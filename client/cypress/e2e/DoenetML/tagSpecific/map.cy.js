import { cesc, cesc2 } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

describe("Map Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("single map of maths", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <map>
      <template><math>sin(2$x) + $i</math></template>
      <sources alias="x" indexAlias="i">
        <math>x</math>
        <math>y</math>
      </sources>
    </map>
    </aslist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables["/_map1"].replacements;
      let mathr1Name =
        stateVariables[replacements[0].componentName].replacements[0]
          .componentName;
      let mathr1Anchor = "#" + mathr1Name;
      let mathr2Name =
        stateVariables[replacements[1].componentName].replacements[0]
          .componentName;
      let mathr2Anchor = "#" + mathr2Name;

      cy.log("Test values displayed in browser");
      cy.get(`${cesc2(mathr1Anchor)} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(2x)+1");
        });
      cy.get(`${cesc2(mathr2Anchor)} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(2y)+2");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(() => {
        expect(stateVariables[mathr1Name].stateValues.value).eqls([
          "+",
          ["apply", "sin", ["*", 2, "x"]],
          1,
        ]);
        expect(stateVariables[mathr2Name].stateValues.value).eqls([
          "+",
          ["apply", "sin", ["*", 2, "y"]],
          2,
        ]);
      });
    });
  });

  it("single map of texts", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map >
      <template><text>You are a $animal!</text> </template>
      <sources alias="animal"><text>squirrel</text><text>bat</text></sources>
    </map>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables["/_map1"].replacements;
      let textr1Name =
        stateVariables[replacements[0].componentName].replacements[0]
          .componentName;
      let textr1Anchor = "#" + textr1Name;
      let textr2Name =
        stateVariables[replacements[1].componentName].replacements[0]
          .componentName;
      let textr2Anchor = "#" + textr2Name;

      cy.log("Test values displayed in browser");
      cy.get(cesc2(textr1Anchor)).should("have.text", "You are a squirrel!");
      cy.get(cesc2(textr2Anchor)).should("have.text", "You are a bat!");

      cy.log("Test internal values are set to the correct values");
      cy.window().then(() => {
        expect(stateVariables[textr1Name].stateValues.value).eq(
          "You are a squirrel!",
        );
      });
    });
  });

  it("single map of sequence", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map>
      <template><math simplify>$n^2</math> </template>
      <sources alias="n"><sequence from="1" to="5"/></sources>
    </map>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables["/_map1"].replacements;
      let mathrNames = replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      let mathrAnchors = mathrNames.map((x) => cesc2("#" + x));

      cy.log("Test values displayed in browser");
      cy.get(`${mathrAnchors[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(`${mathrAnchors[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(`${mathrAnchors[2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(`${mathrAnchors[3]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("16");
        });
      cy.get(`${mathrAnchors[4]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("25");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(() => {
        expect(stateVariables[mathrNames[0]].stateValues.value).eq(1);
        expect(stateVariables[mathrNames[1]].stateValues.value).eq(4);
        expect(stateVariables[mathrNames[2]].stateValues.value).eq(9);
        expect(stateVariables[mathrNames[3]].stateValues.value).eq(16);
        expect(stateVariables[mathrNames[4]].stateValues.value).eq(25);
      });
    });
  });

  it("triple parallel map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <map behavior="parallel">
      <template><math>($l, $m, $n)</math><math>($i, $j, $k)</math></template>
      <sources alias="l" indexalias="i"><sequence from="1" to="5"/></sources>
      <sources alias="m" indexalias="j"><sequence from="21" to="23"/></sources>
      <sources alias="n" indexalias="k"><sequence from="-5" to="-21" step="-3"/></sources>
    </map>
    </aslist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables["/_map1"].replacements;
      let mathrNames = replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[c.componentName].replacements.map(
            (x) => x.componentName,
          ),
        ],
        [],
      );
      let mathrAnchors = mathrNames.map((x) => cesc2("#" + x));

      cy.log("Test values displayed in browser");
      cy.get(`${mathrAnchors[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,21,−5)");
        });
      cy.get(`${mathrAnchors[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,1,1)");
        });
      cy.get(`${mathrAnchors[2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,22,−8)");
        });
      cy.get(`${mathrAnchors[3]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,2,2)");
        });
      cy.get(`${mathrAnchors[4]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,23,−11)");
        });
      cy.get(`${mathrAnchors[5]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,3,3)");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(() => {
        expect(stateVariables[mathrNames[0]].stateValues.value).eqls([
          "tuple",
          1,
          21,
          -5,
        ]);
        expect(stateVariables[mathrNames[1]].stateValues.value).eqls([
          "tuple",
          1,
          1,
          1,
        ]);
        expect(stateVariables[mathrNames[2]].stateValues.value).eqls([
          "tuple",
          2,
          22,
          -8,
        ]);
        expect(stateVariables[mathrNames[3]].stateValues.value).eqls([
          "tuple",
          2,
          2,
          2,
        ]);
        expect(stateVariables[mathrNames[4]].stateValues.value).eqls([
          "tuple",
          3,
          23,
          -11,
        ]);
        expect(stateVariables[mathrNames[5]].stateValues.value).eqls([
          "tuple",
          3,
          3,
          3,
        ]);
      });
    });
  });

  it("triple combination map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map behavior="combination">
      <template><math>($l, $m, $n)</math><math>($i, $j, $k)</math></template>
      <sources alias="l" indexalias="i"><sequence from="1" to="3"/></sources>
      <sources alias="m" indexalias="j"><sequence from="21" to="23" step="2"/></sources>
      <sources alias="n" indexalias="k"><sequence from="-5" to="-8" step="-3"/></sources>
    </map>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables["/_map1"].replacements;
      let mathrNames = replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[c.componentName].replacements.map(
            (x) => x.componentName,
          ),
        ],
        [],
      );
      let mathrAnchors = mathrNames.map((x) => cesc2("#" + x));

      cy.log("Test values displayed in browser");
      cy.get(`${mathrAnchors[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,21,−5)");
        });
      cy.get(`${mathrAnchors[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,1,1)");
        });
      cy.get(`${mathrAnchors[2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,21,−8)");
        });
      cy.get(`${mathrAnchors[3]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,1,2)");
        });
      cy.get(`${mathrAnchors[4]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,23,−5)");
        });
      cy.get(`${mathrAnchors[5]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2,1)");
        });
      cy.get(`${mathrAnchors[6]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,23,−8)");
        });
      cy.get(`${mathrAnchors[7]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2,2)");
        });
      cy.get(`${mathrAnchors[8]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,21,−5)");
        });
      cy.get(`${mathrAnchors[9]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,1,1)");
        });
      cy.get(`${mathrAnchors[10]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,21,−8)");
        });
      cy.get(`${mathrAnchors[11]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,1,2)");
        });
      cy.get(`${mathrAnchors[12]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,23,−5)");
        });
      cy.get(`${mathrAnchors[13]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,2,1)");
        });
      cy.get(`${mathrAnchors[14]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,23,−8)");
        });
      cy.get(`${mathrAnchors[15]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,2,2)");
        });
      cy.get(`${mathrAnchors[16]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,21,−5)");
        });
      cy.get(`${mathrAnchors[17]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,1,1)");
        });
      cy.get(`${mathrAnchors[18]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,21,−8)");
        });
      cy.get(`${mathrAnchors[19]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,1,2)");
        });
      cy.get(`${mathrAnchors[20]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,23,−5)");
        });
      cy.get(`${mathrAnchors[21]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,2,1)");
        });
      cy.get(`${mathrAnchors[22]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,23,−8)");
        });
      cy.get(`${mathrAnchors[23]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,2,2)");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(() => {
        expect(stateVariables[mathrNames[0]].stateValues.value).eqls([
          "tuple",
          1,
          21,
          -5,
        ]);
        expect(stateVariables[mathrNames[1]].stateValues.value).eqls([
          "tuple",
          1,
          1,
          1,
        ]);
        expect(stateVariables[mathrNames[2]].stateValues.value).eqls([
          "tuple",
          1,
          21,
          -8,
        ]);
        expect(stateVariables[mathrNames[3]].stateValues.value).eqls([
          "tuple",
          1,
          1,
          2,
        ]);
        expect(stateVariables[mathrNames[4]].stateValues.value).eqls([
          "tuple",
          1,
          23,
          -5,
        ]);
        expect(stateVariables[mathrNames[5]].stateValues.value).eqls([
          "tuple",
          1,
          2,
          1,
        ]);
        expect(stateVariables[mathrNames[6]].stateValues.value).eqls([
          "tuple",
          1,
          23,
          -8,
        ]);
        expect(stateVariables[mathrNames[7]].stateValues.value).eqls([
          "tuple",
          1,
          2,
          2,
        ]);
        expect(stateVariables[mathrNames[8]].stateValues.value).eqls([
          "tuple",
          2,
          21,
          -5,
        ]);
        expect(stateVariables[mathrNames[9]].stateValues.value).eqls([
          "tuple",
          2,
          1,
          1,
        ]);
        expect(stateVariables[mathrNames[10]].stateValues.value).eqls([
          "tuple",
          2,
          21,
          -8,
        ]);
        expect(stateVariables[mathrNames[11]].stateValues.value).eqls([
          "tuple",
          2,
          1,
          2,
        ]);
        expect(stateVariables[mathrNames[12]].stateValues.value).eqls([
          "tuple",
          2,
          23,
          -5,
        ]);
        expect(stateVariables[mathrNames[13]].stateValues.value).eqls([
          "tuple",
          2,
          2,
          1,
        ]);
        expect(stateVariables[mathrNames[14]].stateValues.value).eqls([
          "tuple",
          2,
          23,
          -8,
        ]);
        expect(stateVariables[mathrNames[15]].stateValues.value).eqls([
          "tuple",
          2,
          2,
          2,
        ]);
        expect(stateVariables[mathrNames[16]].stateValues.value).eqls([
          "tuple",
          3,
          21,
          -5,
        ]);
        expect(stateVariables[mathrNames[17]].stateValues.value).eqls([
          "tuple",
          3,
          1,
          1,
        ]);
        expect(stateVariables[mathrNames[18]].stateValues.value).eqls([
          "tuple",
          3,
          21,
          -8,
        ]);
        expect(stateVariables[mathrNames[19]].stateValues.value).eqls([
          "tuple",
          3,
          1,
          2,
        ]);
        expect(stateVariables[mathrNames[20]].stateValues.value).eqls([
          "tuple",
          3,
          23,
          -5,
        ]);
        expect(stateVariables[mathrNames[21]].stateValues.value).eqls([
          "tuple",
          3,
          2,
          1,
        ]);
        expect(stateVariables[mathrNames[22]].stateValues.value).eqls([
          "tuple",
          3,
          23,
          -8,
        ]);
        expect(stateVariables[mathrNames[23]].stateValues.value).eqls([
          "tuple",
          3,
          2,
          2,
        ]);
      });
    });
  });

  it("parallel map with unequal numbers of iterates", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><map behavior="parallel">
      <template>hi</template>
      <sources><number>1</number></sources>
      <sources><number>1</number><number>2</number></sources>
    </map></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_p1")).should("have.text", "hi");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(1);

      expect(errorWarnings.warnings[0].message).contain(
        "<map> has parallel behavior but different numbers of iterates in sources. Extra iterates will be ignored",
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(8);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(10);
    });
  });

  it("map with invalid behavior", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><map behavior="bad">
      <template>hi</template>
      <sources><number>1</number></sources>
    </map></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_p1")).should("have.text", "");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(1);

      expect(errorWarnings.warnings[0].message).contain(
        `Invalid map behavior: "bad"`,
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(8);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(10);
    });
  });

  it("two nested maps", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <map>
      <template><map>
          <template><math simplify>$m+$n</math><math simplify>$i+2$j</math></template>
          <sources alias="m" indexalias="i"><sequence from="1" to="2"/></sources>
        </map></template>
      <sources alias="n" indexalias="j"><number>-10</number><number>5</number></sources>
    </map>
    </aslist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables["/_map1"].replacements;
      let mathrNames = replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[
            stateVariables[c.componentName].replacements[0].componentName
          ].replacements.reduce(
            (a1, c1) => [
              ...a1,
              ...stateVariables[c1.componentName].replacements.map(
                (x) => x.componentName,
              ),
            ],
            [],
          ),
        ],
        [],
      );
      let mathrAnchors = mathrNames.map((x) => cesc2("#" + x));

      cy.log("Test values displayed in browser");
      cy.get(`${mathrAnchors[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(`${mathrAnchors[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(`${mathrAnchors[2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(`${mathrAnchors[3]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(`${mathrAnchors[4]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("6");
        });
      cy.get(`${mathrAnchors[5]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(`${mathrAnchors[6]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(`${mathrAnchors[7]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("6");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(() => {
        expect(stateVariables[mathrNames[0]].stateValues.value).eq(-9);
        expect(stateVariables[mathrNames[1]].stateValues.value).eq(3);
        expect(stateVariables[mathrNames[2]].stateValues.value).eq(-8);
        expect(stateVariables[mathrNames[3]].stateValues.value).eq(4);
        expect(stateVariables[mathrNames[4]].stateValues.value).eq(6);
        expect(stateVariables[mathrNames[5]].stateValues.value).eq(5);
        expect(stateVariables[mathrNames[6]].stateValues.value).eq(7);
        expect(stateVariables[mathrNames[7]].stateValues.value).eq(6);
      });
    });
  });

  it("three nested maps with graphs and copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map>
    <template><graph>
        <map>
          <template><map>
              <template><point>($l+$n, $m)</point><point>($i+2*$k, $j)</point></template>
              <sources alias="l" indexalias="i"><sequence from="1" to="2"/></sources>
            </map></template>
          <sources alias="m" indexalias="j"><sequence from="-5" to="5" step="10"/></sources>
        </map>
      </graph></template>
    <sources alias="n" indexalias="k"><sequence from="-10" to="5" step="15"/></sources>
    </map>
    <copy name="mapcopy" target="_map1" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let graphNames = stateVariables["/_map1"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      let graphChildNames = graphNames.map((x) =>
        stateVariables[x].activeChildren.map((x) => x.componentName),
      );
      let graphNames2 = stateVariables["/mapcopy"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      let graph2ChildNames = graphNames2.map((x) =>
        stateVariables[x].activeChildren.map((x) => x.componentName),
      );

      expect(
        stateVariables[graphNames[0]].stateValues.graphicalDescendants.length,
      ).eq(8);
      expect(
        stateVariables[graphNames[1]].stateValues.graphicalDescendants.length,
      ).eq(8);
      expect(
        stateVariables[graphNames2[0]].stateValues.graphicalDescendants.length,
      ).eq(8);
      expect(
        stateVariables[graphNames2[1]].stateValues.graphicalDescendants.length,
      ).eq(8);

      expect(stateVariables[graphChildNames[0][0]].stateValues.xs[0]).eq(-9);
      expect(stateVariables[graphChildNames[0][0]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graphChildNames[0][1]].stateValues.xs[0]).eq(3);
      expect(stateVariables[graphChildNames[0][1]].stateValues.xs[1]).eq(1);
      expect(stateVariables[graphChildNames[0][2]].stateValues.xs[0]).eq(-8);
      expect(stateVariables[graphChildNames[0][2]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graphChildNames[0][3]].stateValues.xs[0]).eq(4);
      expect(stateVariables[graphChildNames[0][3]].stateValues.xs[1]).eq(1);
      expect(stateVariables[graphChildNames[0][4]].stateValues.xs[0]).eq(-9);
      expect(stateVariables[graphChildNames[0][4]].stateValues.xs[1]).eq(5);
      expect(stateVariables[graphChildNames[0][5]].stateValues.xs[0]).eq(3);
      expect(stateVariables[graphChildNames[0][5]].stateValues.xs[1]).eq(2);
      expect(stateVariables[graphChildNames[0][6]].stateValues.xs[0]).eq(-8);
      expect(stateVariables[graphChildNames[0][6]].stateValues.xs[1]).eq(5);
      expect(stateVariables[graphChildNames[0][7]].stateValues.xs[0]).eq(4);
      expect(stateVariables[graphChildNames[0][7]].stateValues.xs[1]).eq(2);

      expect(stateVariables[graphChildNames[1][0]].stateValues.xs[0]).eq(6);
      expect(stateVariables[graphChildNames[1][0]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graphChildNames[1][1]].stateValues.xs[0]).eq(5);
      expect(stateVariables[graphChildNames[1][1]].stateValues.xs[1]).eq(1);
      expect(stateVariables[graphChildNames[1][2]].stateValues.xs[0]).eq(7);
      expect(stateVariables[graphChildNames[1][2]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graphChildNames[1][3]].stateValues.xs[0]).eq(6);
      expect(stateVariables[graphChildNames[1][3]].stateValues.xs[1]).eq(1);
      expect(stateVariables[graphChildNames[1][4]].stateValues.xs[0]).eq(6);
      expect(stateVariables[graphChildNames[1][4]].stateValues.xs[1]).eq(5);
      expect(stateVariables[graphChildNames[1][5]].stateValues.xs[0]).eq(5);
      expect(stateVariables[graphChildNames[1][5]].stateValues.xs[1]).eq(2);
      expect(stateVariables[graphChildNames[1][6]].stateValues.xs[0]).eq(7);
      expect(stateVariables[graphChildNames[1][6]].stateValues.xs[1]).eq(5);
      expect(stateVariables[graphChildNames[1][7]].stateValues.xs[0]).eq(6);
      expect(stateVariables[graphChildNames[1][7]].stateValues.xs[1]).eq(2);

      expect(stateVariables[graph2ChildNames[0][0]].stateValues.xs[0]).eq(-9);
      expect(stateVariables[graph2ChildNames[0][0]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graph2ChildNames[0][1]].stateValues.xs[0]).eq(3);
      expect(stateVariables[graph2ChildNames[0][1]].stateValues.xs[1]).eq(1);
      expect(stateVariables[graph2ChildNames[0][2]].stateValues.xs[0]).eq(-8);
      expect(stateVariables[graph2ChildNames[0][2]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graph2ChildNames[0][3]].stateValues.xs[0]).eq(4);
      expect(stateVariables[graph2ChildNames[0][3]].stateValues.xs[1]).eq(1);
      expect(stateVariables[graph2ChildNames[0][4]].stateValues.xs[0]).eq(-9);
      expect(stateVariables[graph2ChildNames[0][4]].stateValues.xs[1]).eq(5);
      expect(stateVariables[graph2ChildNames[0][5]].stateValues.xs[0]).eq(3);
      expect(stateVariables[graph2ChildNames[0][5]].stateValues.xs[1]).eq(2);
      expect(stateVariables[graph2ChildNames[0][6]].stateValues.xs[0]).eq(-8);
      expect(stateVariables[graph2ChildNames[0][6]].stateValues.xs[1]).eq(5);
      expect(stateVariables[graph2ChildNames[0][7]].stateValues.xs[0]).eq(4);
      expect(stateVariables[graph2ChildNames[0][7]].stateValues.xs[1]).eq(2);

      expect(stateVariables[graph2ChildNames[1][0]].stateValues.xs[0]).eq(6);
      expect(stateVariables[graph2ChildNames[1][0]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graph2ChildNames[1][1]].stateValues.xs[0]).eq(5);
      expect(stateVariables[graph2ChildNames[1][1]].stateValues.xs[1]).eq(1);
      expect(stateVariables[graph2ChildNames[1][2]].stateValues.xs[0]).eq(7);
      expect(stateVariables[graph2ChildNames[1][2]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graph2ChildNames[1][3]].stateValues.xs[0]).eq(6);
      expect(stateVariables[graph2ChildNames[1][3]].stateValues.xs[1]).eq(1);
      expect(stateVariables[graph2ChildNames[1][4]].stateValues.xs[0]).eq(6);
      expect(stateVariables[graph2ChildNames[1][4]].stateValues.xs[1]).eq(5);
      expect(stateVariables[graph2ChildNames[1][5]].stateValues.xs[0]).eq(5);
      expect(stateVariables[graph2ChildNames[1][5]].stateValues.xs[1]).eq(2);
      expect(stateVariables[graph2ChildNames[1][6]].stateValues.xs[0]).eq(7);
      expect(stateVariables[graph2ChildNames[1][6]].stateValues.xs[1]).eq(5);
      expect(stateVariables[graph2ChildNames[1][7]].stateValues.xs[0]).eq(6);
      expect(stateVariables[graph2ChildNames[1][7]].stateValues.xs[1]).eq(2);
    });
  });

  it("three nested maps with graphs and assignnames", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map assignnames="u v">
    <template newNamespace>
      <graph>
        <map assignnames="u v">
          <template newNamespace>
            <map assignnames="u v">
              <template newNamespace>
                <point name="A">($l+$n, $m)</point>
              </template>
              <sources alias="l"><sequence from="1" to="2"/></sources>
            </map>
          </template>
          <sources alias="m"><sequence from="-5" to="5" step="10"/></sources>
        </map>
      </graph>
    </template>
    <sources alias="n"><sequence from="-10" to="5" step="15"/></sources>
    </map>
    <copy assignNames="c1" prop="coords" target="/u/u/u/A" />
    <copy assignNames="c2" prop="coords" target="/u/u/v/A" />
    <copy assignNames="c3" prop="coords" target="/u/v/u/A" />
    <copy assignNames="c4" prop="coords" target="/u/v/v/A" />
    <copy assignNames="c5" prop="coords" target="/v/u/u/A" />
    <copy assignNames="c6" prop="coords" target="/v/u/v/A" />
    <copy assignNames="c7" prop="coords" target="/v/v/u/A" />
    <copy assignNames="c8" prop="coords" target="/v/v/v/A" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("Test values displayed in browser");
    cy.get(cesc(`#\\/c1`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−9,−5)");
      });
    cy.get(cesc(`#\\/c2`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−8,−5)");
      });
    cy.get(cesc(`#\\/c3`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−9,5)");
      });
    cy.get(cesc(`#\\/c4`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−8,5)");
      });
    cy.get(cesc(`#\\/c5`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(6,−5)");
      });
    cy.get(cesc(`#\\/c6`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,−5)");
      });
    cy.get(cesc(`#\\/c7`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(6,5)");
      });
    cy.get(cesc(`#\\/c8`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,5)");
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        stateVariables["/u/_graph1"].stateValues.graphicalDescendants.length,
      ).eq(4);
      expect(
        stateVariables["/v/_graph1"].stateValues.graphicalDescendants.length,
      ).eq(4);
      expect(stateVariables["/u/u/u/A"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/u/u/u/A"].stateValues.xs[1]).eq(-5);
      expect(stateVariables["/u/u/v/A"].stateValues.xs[0]).eq(-8);
      expect(stateVariables["/u/u/v/A"].stateValues.xs[1]).eq(-5);
      expect(stateVariables["/u/v/u/A"].stateValues.xs[0]).eq(-9);
      expect(stateVariables["/u/v/u/A"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/u/v/v/A"].stateValues.xs[0]).eq(-8);
      expect(stateVariables["/u/v/v/A"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/v/u/u/A"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/v/u/u/A"].stateValues.xs[1]).eq(-5);
      expect(stateVariables["/v/u/v/A"].stateValues.xs[0]).eq(7);
      expect(stateVariables["/v/u/v/A"].stateValues.xs[1]).eq(-5);
      expect(stateVariables["/v/v/u/A"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/v/v/u/A"].stateValues.xs[1]).eq(5);
      expect(stateVariables["/v/v/v/A"].stateValues.xs[0]).eq(7);
      expect(stateVariables["/v/v/v/A"].stateValues.xs[1]).eq(5);
    });
  });

  it("combination map nested inside map with graphs", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map>
    <template><graph>
      <map behavior="combination">
        <template><point>($l+$n, $m)</point></template>
        <sources alias="l"><sequence from="1" to="2"/></sources>
        <sources alias="m"><sequence from="-5" to="5" step="10"/></sources>
      </map>
    </graph></template>
    <sources alias="n"><sequence from="-10" to="5" step="15"/></sources>
    </map>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load
    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let graphNames = stateVariables["/_map1"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      let graphChildNames = graphNames.map((x) =>
        stateVariables[x].activeChildren.map((x) => x.componentName),
      );

      expect(
        stateVariables[graphNames[0]].stateValues.graphicalDescendants.length,
      ).eq(4);
      expect(
        stateVariables[graphNames[1]].stateValues.graphicalDescendants.length,
      ).eq(4);
      expect(stateVariables[graphChildNames[0][0]].stateValues.xs[0]).eq(-9);
      expect(stateVariables[graphChildNames[0][0]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graphChildNames[0][1]].stateValues.xs[0]).eq(-9);
      expect(stateVariables[graphChildNames[0][1]].stateValues.xs[1]).eq(5);
      expect(stateVariables[graphChildNames[0][2]].stateValues.xs[0]).eq(-8);
      expect(stateVariables[graphChildNames[0][2]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graphChildNames[0][3]].stateValues.xs[0]).eq(-8);
      expect(stateVariables[graphChildNames[0][3]].stateValues.xs[1]).eq(5);

      expect(stateVariables[graphChildNames[1][0]].stateValues.xs[0]).eq(6);
      expect(stateVariables[graphChildNames[1][0]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graphChildNames[1][1]].stateValues.xs[0]).eq(6);
      expect(stateVariables[graphChildNames[1][1]].stateValues.xs[1]).eq(5);
      expect(stateVariables[graphChildNames[1][2]].stateValues.xs[0]).eq(7);
      expect(stateVariables[graphChildNames[1][2]].stateValues.xs[1]).eq(-5);
      expect(stateVariables[graphChildNames[1][3]].stateValues.xs[0]).eq(7);
      expect(stateVariables[graphChildNames[1][3]].stateValues.xs[1]).eq(5);
    });
  });

  it("map with copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map>
    <template newNamespace><math simplify>
        <copy target="n" name="b"/> + <copy target="j" name="i"/> + <copy target="../a" /> 
        + <math name="q">z</math> + <copy target="q" /> + <copy target="b" /> +<copy target="i" />
      </math><math>x</math></template>
    <sources alias="n" indexalias="j"><sequence from="1" to="2"/></sources>
    </map>
    <math name="a">x</math>
    <copy name="mapcopy" target="_map1" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacementNames = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[c.componentName].replacements.map(
            (x) => x.componentName,
          ),
        ],
        [],
      );
      let replacementAnchors = replacementNames.map((x) => cesc2("#" + x));
      let replacementNames2 = stateVariables["/mapcopy"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[c.componentName].replacements.map(
            (x) => x.componentName,
          ),
        ],
        [],
      );
      let replacementAnchors2 = replacementNames2.map((x) => cesc2("#" + x));

      cy.log("Test values displayed in browser");
      cy.get(`${replacementAnchors[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+4");
        });
      cy.get(`${replacementAnchors[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors[2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+8");
        });
      cy.get(`${replacementAnchors[3]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });

      cy.get(`${cesc2("#/a")} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });

      cy.get(`${replacementAnchors2[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+4");
        });
      cy.get(`${replacementAnchors2[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors2[2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+8");
        });
      cy.get(`${replacementAnchors2[3]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
    });
  });

  it("map with copies, extended dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <number name="length">1</number>
    <map>
    <template newnamespace><math simplify>
        <copy target="n" name="b"/> + <copy target="j" name="i"/> + <copy target="../a" /> 
        + <math name="q">z</math> + <copy target="q" /> + <copy target="b" /> +<copy target="i" />
      </math><math>x</math></template>
    <sources alias="n" indexalias="j"><sequence from="1" length="$length"/></sources>
    </map>
    <math name="a">x</math>
    <copy name="mapcopy" target="_map1" />

    <updatevalue target="length" newValue="2$length"  >
      <label>double</label>
    </updatevalue>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacementNames = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[c.componentName].replacements.map(
            (x) => x.componentName,
          ),
        ],
        [],
      );
      let replacementAnchors = replacementNames.map((x) => cesc2("#" + x));
      let replacementNames2 = stateVariables["/mapcopy"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[c.componentName].replacements.map(
            (x) => x.componentName,
          ),
        ],
        [],
      );
      let replacementAnchors2 = replacementNames2.map((x) => cesc2("#" + x));

      cy.log("Test values displayed in browser");
      cy.get(`${replacementAnchors[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+4");
        });
      cy.get(`${replacementAnchors[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${cesc2("#/a")} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors2[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+4");
        });
      cy.get(`${replacementAnchors2[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
    });

    cy.log("Double the length then test again");
    cy.get(cesc2("#/_updatevalue1_button")).click(); //Update Button
    cy.get(cesc2("#/length")).should("contain.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacementNames = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[c.componentName].replacements.map(
            (x) => x.componentName,
          ),
        ],
        [],
      );
      let replacementAnchors = replacementNames.map((x) => cesc2("#" + x));
      let replacementNames2 = stateVariables["/mapcopy"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[c.componentName].replacements.map(
            (x) => x.componentName,
          ),
        ],
        [],
      );
      let replacementAnchors2 = replacementNames2.map((x) => cesc2("#" + x));

      cy.get(`${replacementAnchors[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+4");
        });
      cy.get(`${replacementAnchors[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors[2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+8");
        });
      cy.get(`${replacementAnchors[3]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${cesc2("#/a")} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors2[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+4");
        });
      cy.get(`${replacementAnchors2[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors2[2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+8");
        });
      cy.get(`${replacementAnchors2[3]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
    });

    cy.log("Double the length again then test one more time");
    cy.get(cesc2("#/_updatevalue1_button")).click(); //Update Button
    cy.get(cesc2("#/length")).should("contain.text", "4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacementNames = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[c.componentName].replacements.map(
            (x) => x.componentName,
          ),
        ],
        [],
      );
      let replacementAnchors = replacementNames.map((x) => cesc2("#" + x));
      let replacementNames2 = stateVariables["/mapcopy"].replacements.reduce(
        (a, c) => [
          ...a,
          ...stateVariables[c.componentName].replacements.map(
            (x) => x.componentName,
          ),
        ],
        [],
      );
      let replacementAnchors2 = replacementNames2.map((x) => cesc2("#" + x));

      cy.get(`${replacementAnchors[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+4");
        });
      cy.get(`${replacementAnchors[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors[2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+8");
        });
      cy.get(`${replacementAnchors[3]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors[4]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+12");
        });
      cy.get(`${replacementAnchors[5]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors[6]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+16");
        });
      cy.get(`${replacementAnchors[7]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${cesc2("#/a")} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors2[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+4");
        });
      cy.get(`${replacementAnchors2[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors2[2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+8");
        });
      cy.get(`${replacementAnchors2[3]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors2[4]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+12");
        });
      cy.get(`${replacementAnchors2[5]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
      cy.get(`${replacementAnchors2[6]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+2z+16");
        });
      cy.get(`${replacementAnchors2[7]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x");
        });
    });
  });

  it("map with copied template", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map>
    <template><math simplify="full">sin(<copy target="i"/><copy target="x"/>)</math></template>
    <sources alias="x" indexalias="i"><math>x</math><math>y</math></sources>
    </map>
  
    <map>
    <copy target="_template1" />
    <sources alias="x" indexalias="i"><math>q</math><math>p</math></sources>
    </map>

    <copy name="mapcopy" target="_map2" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacementNames = stateVariables["/_map1"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      let replacementAnchors = replacementNames.map((x) => cesc2("#" + x));
      let replacementNames2 = stateVariables["/_map2"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      let replacementAnchors2 = replacementNames2.map((x) => cesc2("#" + x));
      let replacementNames3 = stateVariables["/mapcopy"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      let replacementAnchors3 = replacementNames3.map((x) => cesc2("#" + x));

      cy.log("Test values displayed in browser");
      cy.get(`${replacementAnchors[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(x)");
        });
      cy.get(`${replacementAnchors[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(2y)");
        });
      cy.get(`${replacementAnchors2[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(q)");
        });
      cy.get(`${replacementAnchors2[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(2p)");
        });
      cy.get(`${replacementAnchors3[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(q)");
        });
      cy.get(`${replacementAnchors3[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(2p)");
        });
    });
  });

  it("map with new namespace but no new namespace on template", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map newNamespace>
    <template><math simplify="full">sin($i$x)</math></template>
    <sources alias="x" indexalias="i"><math>x</math><math>y</math></sources>
    </map>
  
    <copy name="mapcopy" target="_map1" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacementNames = stateVariables["/_map1"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      let replacementAnchors = replacementNames.map((x) => cesc2("#" + x));
      let replacementNames2 = stateVariables["/mapcopy"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      let replacementAnchors2 = replacementNames2.map((x) => cesc2("#" + x));

      cy.log("Test values displayed in browser");
      cy.get(`${replacementAnchors[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(x)");
        });
      cy.get(`${replacementAnchors[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(2y)");
        });
      cy.get(`${replacementAnchors2[0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(x)");
        });
      cy.get(`${replacementAnchors2[1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("sin(2y)");
        });
    });
  });

  it("graph with new namespace and assignnames", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <copy target="/hi/c/_point1" prop="coords" assignNames="c1" />
    <copy target="/hi/s/_point1" prop="coords" assignNames="c2" />
    <copy target="/hi/q/_point1" prop="coords" assignNames="c3" />
    
    <grapH Name="hi" newNamespace >
    <map assignnames="q  c s">
      <template newnamespace><point>($m, $n)</point></template>
      <sources alias="m"><sequence from="1" to="2"/></sources>
      <sources alias="n"><sequence from="-3" to="-2"/></sources>
    </map>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load

    cy.log("Test values displayed in browser");

    cy.get(cesc(`#\\/c1`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,−2)");
      });
    cy.get(cesc(`#\\/c2`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,−3)");
      });
    cy.get(cesc(`#\\/c3`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,−3)");
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let replacementNames = stateVariables["/hi/_map1"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );

      expect(stateVariables["/hi"].stateValues.graphicalDescendants.length).eq(
        4,
      );
      expect(stateVariables["/hi/q/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/hi/q/_point1"].stateValues.xs[1]).eq(-3);
      expect(stateVariables["/hi/c/_point1"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/hi/c/_point1"].stateValues.xs[1]).eq(-2);
      expect(stateVariables["/hi/s/_point1"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/hi/s/_point1"].stateValues.xs[1]).eq(-3);
      expect(stateVariables[replacementNames[3]].stateValues.xs[0]).eq(2);
      expect(stateVariables[replacementNames[3]].stateValues.xs[1]).eq(-2);
    });
  });

  it("map copying source of other map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map assignnames="u v w">
      <template newNamespace><math>(<copy target="n"/>, <copy target="../e/_copy1" />)</math></template>
      <sources alias="n"><sequence from="1" to="3"/></sources>
    </map>
    <map assignnames="c d e">
      <template newNamespace><math>sin(<copy target="n"/>)</math></template>
      <sources alias="n"><sequence from="4" to="6"/></sources>
    </map>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load

    cy.log("Test values displayed in browser");
    cy.get(`${cesc2("#/u/_math1")} .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,6)");
      });
    cy.get(`${cesc2("#/v/_math1")} .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,6)");
      });
    cy.get(`${cesc2("#/w/_math1")} .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,6)");
      });
    cy.get(`${cesc2("#/c/_math1")} .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sin(4)");
      });
    cy.get(`${cesc2("#/d/_math1")} .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sin(5)");
      });
    cy.get(`${cesc2("#/e/_math1")} .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sin(6)");
      });
  });

  it("map length depending on other map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map>
    <template><map>
       <template><math>($a, $b)</math></template>
       <sources alias="a"><sequence from="1" to="$b" /></sources>
     </map></template>
    <sources alias="b"><sequence from="1" to="3"/></sources>
    </map>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacementNames = stateVariables["/_map1"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      let replacementAnchors = replacementNames.map((x) =>
        stateVariables[x].replacements.map((y) =>
          cesc2(
            "#" + stateVariables[y.componentName].replacements[0].componentName,
          ),
        ),
      );

      cy.log("Test values displayed in browser");
      cy.get(`${replacementAnchors[0][0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,1)");
        });
      cy.get(`${replacementAnchors[1][0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2)");
        });
      cy.get(`${replacementAnchors[1][1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,2)");
        });
      cy.get(`${replacementAnchors[2][0]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,3)");
        });
      cy.get(`${replacementAnchors[2][1]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,3)");
        });
      cy.get(`${replacementAnchors[2][2]} .mjx-mrow`)
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,3)");
        });
    });
  });

  it("map begins zero length, copied multiple times", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>
    <map>
    <template><math simplify>$n^2</math><text>,</text></template>
    <sources alias="n">
    <sequence from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
    </sources>
    </map>
    </p>

    <mathinput name="sequenceFrom" prefill="1"/>
    <mathinput name="sequenceTo" prefill="2"/>
    <mathinput name="sequenceCount" prefill="0"/>
    
    <p><copy name="copymap2" target="_map1" /></p>
    <p><copy name="copymap3" target="copymap2" /></p>

    <copy name="copymapthroughp" target="_p1" />
    <copy name="copymapthroughp2" target="copymapthroughp" />
    <copy name="copymapthroughp3" target="copymapthroughp2" />

    <copy prop="value" target="sequenceCount" assignNames="sequenceCount2" />
    <copy prop="value" target="sequenceTo" assignNames="sequenceTo2" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let p4 = stateVariables["/copymapthroughp"].replacements[0];
      let p4Anchor = cesc2("#" + p4.componentName);
      let p5 = stateVariables["/copymapthroughp2"].replacements[0];
      let p5Anchor = cesc2("#" + p5.componentName);
      let p6 = stateVariables["/copymapthroughp3"].replacements[0];
      let p6Anchor = cesc2("#" + p6.componentName);

      cy.log("At beginning, nothing shown");
      cy.get(cesc2("#/_p1"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(cesc2("#/_p2"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(cesc2("#/_p3"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(p4Anchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(p5Anchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(p6Anchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });

      cy.log("make sequence length 1");
      cy.get(cesc2("#/sequenceCount") + " textarea").type(
        "{end}{backspace}1{enter}",
        { force: true },
      );
      cy.get(cesc2("#/sequenceCount2")).should("contain.text", "1");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let map1mathNames = stateVariables["/_map1"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map1mathAnchors = map1mathNames.map((x) => cesc2("#" + x));
        let map2mathNames = stateVariables["/copymap2"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map2mathAnchors = map2mathNames.map((x) => cesc2("#" + x));
        let map3mathNames = stateVariables["/copymap3"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map3mathAnchors = map3mathNames.map((x) => cesc2("#" + x));
        let map4mathNames = stateVariables[
          stateVariables["/copymapthroughp"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map4mathAnchors = map4mathNames.map((x) => cesc2("#" + x));
        let map5mathNames = stateVariables[
          stateVariables["/copymapthroughp2"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map5mathAnchors = map5mathNames.map((x) => cesc2("#" + x));
        let map6mathNames = stateVariables[
          stateVariables["/copymapthroughp3"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map6mathAnchors = map6mathNames.map((x) => cesc2("#" + x));

        cy.get(cesc2("#/_p1"))
          .children(map1mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(cesc2("#/_p2"))
          .children(map2mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(cesc2("#/_p3"))
          .children(map3mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(p4Anchor)
          .children(map4mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(p5Anchor)
          .children(map5mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(p6Anchor)
          .children(map6mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
      });

      cy.log("make sequence length 0 again");
      cy.get(cesc2("#/sequenceCount") + " textarea").type(
        "{end}{backspace}0{enter}",
        { force: true },
      );
      cy.get(cesc2("#/sequenceCount2")).should("contain.text", "0");

      cy.get(cesc2("#/_p1"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(cesc2("#/_p2"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(cesc2("#/_p3"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(p4Anchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(p5Anchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(p6Anchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });

      cy.log("make sequence length 2");
      cy.get(cesc2("#/sequenceCount") + " textarea").type(
        "{end}{backspace}2{enter}",
        { force: true },
      );
      cy.get(cesc2("#/sequenceCount2")).should("contain.text", "2");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let map1mathNames = stateVariables["/_map1"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map1mathAnchors = map1mathNames.map((x) => cesc2("#" + x));
        let map2mathNames = stateVariables["/copymap2"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map2mathAnchors = map2mathNames.map((x) => cesc2("#" + x));
        let map3mathNames = stateVariables["/copymap3"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map3mathAnchors = map3mathNames.map((x) => cesc2("#" + x));
        let map4mathNames = stateVariables[
          stateVariables["/copymapthroughp"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map4mathAnchors = map4mathNames.map((x) => cesc2("#" + x));
        let map5mathNames = stateVariables[
          stateVariables["/copymapthroughp2"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map5mathAnchors = map5mathNames.map((x) => cesc2("#" + x));
        let map6mathNames = stateVariables[
          stateVariables["/copymapthroughp3"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map6mathAnchors = map6mathNames.map((x) => cesc2("#" + x));

        cy.get(cesc2("#/_p1"))
          .children(map1mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(cesc2("#/_p1"))
          .children(map1mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("4");
          });
        cy.get(cesc2("#/_p2"))
          .children(map2mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(cesc2("#/_p2"))
          .children(map2mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("4");
          });
        cy.get(cesc2("#/_p3"))
          .children(map3mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(cesc2("#/_p3"))
          .children(map3mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("4");
          });
        cy.get(p4Anchor)
          .children(map4mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(p4Anchor)
          .children(map4mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("4");
          });
        cy.get(p5Anchor)
          .children(map5mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(p5Anchor)
          .children(map5mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("4");
          });
        cy.get(p6Anchor)
          .children(map6mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("1");
          });
        cy.get(p6Anchor)
          .children(map6mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("4");
          });
      });

      cy.log("change limits");
      cy.get(cesc2("#/sequenceFrom") + " textarea").type(
        "{end}{backspace}3{enter}",
        { force: true },
      );
      cy.get(cesc2("#/sequenceTo") + " textarea").type(
        "{end}{backspace}5{enter}",
        { force: true },
      );
      cy.get(cesc2("#/sequenceTo2")).should("contain.text", "5");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let map1mathNames = stateVariables["/_map1"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map1mathAnchors = map1mathNames.map((x) => cesc2("#" + x));
        let map2mathNames = stateVariables["/copymap2"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map2mathAnchors = map2mathNames.map((x) => cesc2("#" + x));
        let map3mathNames = stateVariables["/copymap3"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map3mathAnchors = map3mathNames.map((x) => cesc2("#" + x));
        let map4mathNames = stateVariables[
          stateVariables["/copymapthroughp"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map4mathAnchors = map4mathNames.map((x) => cesc2("#" + x));
        let map5mathNames = stateVariables[
          stateVariables["/copymapthroughp2"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map5mathAnchors = map5mathNames.map((x) => cesc2("#" + x));
        let map6mathNames = stateVariables[
          stateVariables["/copymapthroughp3"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map6mathAnchors = map6mathNames.map((x) => cesc2("#" + x));

        cy.get(cesc2("#/_p1"))
          .children(map1mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(cesc2("#/_p1"))
          .children(map1mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
        cy.get(cesc2("#/_p2"))
          .children(map2mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(cesc2("#/_p2"))
          .children(map2mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
        cy.get(cesc2("#/_p3"))
          .children(map3mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(cesc2("#/_p3"))
          .children(map3mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
        cy.get(p4Anchor)
          .children(map4mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(p4Anchor)
          .children(map4mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
        cy.get(p5Anchor)
          .children(map5mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(p5Anchor)
          .children(map5mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
        cy.get(p6Anchor)
          .children(map6mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(p6Anchor)
          .children(map6mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
      });

      cy.log("make sequence length 0 again");
      cy.get(cesc2("#/sequenceCount") + " textarea").type(
        "{end}{backspace}0{enter}",
        { force: true },
      );
      cy.get(cesc2("#/sequenceCount2")).should("contain.text", "0");

      cy.get(cesc2("#/_p1"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(cesc2("#/_p2"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(cesc2("#/_p3"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(p4Anchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(p5Anchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });
      cy.get(p6Anchor)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("");
        });

      cy.log("make sequence length 3");
      cy.get(cesc2("#/sequenceCount") + " textarea").type(
        "{end}{backspace}3{enter}",
        { force: true },
      );
      cy.get(cesc2("#/sequenceCount2")).should("contain.text", "3");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let map1mathNames = stateVariables["/_map1"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map1mathAnchors = map1mathNames.map((x) => cesc2("#" + x));
        let map2mathNames = stateVariables["/copymap2"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map2mathAnchors = map2mathNames.map((x) => cesc2("#" + x));
        let map3mathNames = stateVariables["/copymap3"].replacements.map(
          (x) => stateVariables[x.componentName].replacements[0].componentName,
        );
        let map3mathAnchors = map3mathNames.map((x) => cesc2("#" + x));
        let map4mathNames = stateVariables[
          stateVariables["/copymapthroughp"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map4mathAnchors = map4mathNames.map((x) => cesc2("#" + x));
        let map5mathNames = stateVariables[
          stateVariables["/copymapthroughp2"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map5mathAnchors = map5mathNames.map((x) => cesc2("#" + x));
        let map6mathNames = stateVariables[
          stateVariables["/copymapthroughp3"].replacements[0].componentName
        ].activeChildren
          .filter((x) => x.componentType === "math")
          .map((x) => x.componentName);
        let map6mathAnchors = map6mathNames.map((x) => cesc2("#" + x));

        cy.get(cesc2("#/_p1"))
          .children(map1mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(cesc2("#/_p1"))
          .children(map1mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("16");
          });
        cy.get(cesc2("#/_p1"))
          .children(map1mathAnchors[2])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
        cy.get(cesc2("#/_p2"))
          .children(map2mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(cesc2("#/_p2"))
          .children(map2mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("16");
          });
        cy.get(cesc2("#/_p2"))
          .children(map2mathAnchors[2])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
        cy.get(cesc2("#/_p3"))
          .children(map3mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(cesc2("#/_p3"))
          .children(map3mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("16");
          });
        cy.get(cesc2("#/_p3"))
          .children(map3mathAnchors[2])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
        cy.get(p4Anchor)
          .children(map4mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(p4Anchor)
          .children(map4mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("16");
          });
        cy.get(p4Anchor)
          .children(map4mathAnchors[2])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
        cy.get(p5Anchor)
          .children(map5mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(p5Anchor)
          .children(map5mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("16");
          });
        cy.get(p5Anchor)
          .children(map5mathAnchors[2])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
        cy.get(p6Anchor)
          .children(map6mathAnchors[0])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("9");
          });
        cy.get(p6Anchor)
          .children(map6mathAnchors[1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("16");
          });
        cy.get(p6Anchor)
          .children(map6mathAnchors[2])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal("25");
          });
      });
    });
  });

  it("map with circular dependence in template", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <map assignnames="a b c">
        <template newNamespace><point>
            (<copy target="../q" />$n^2,
            <copy prop="x" target="_point2" />)
          </point><point>
            (<copy target="../r" />$n,
            <copy prop="x" target="_point1" />)
          </point></template>
      <sources alias='n'>
        <sequence from="2" to="4" />
      </sources>
      </map>
    </graph>
    <math name="q">1</math>
    <math name="r">1</math>
    <copy assignNames="c1" prop="coords" target="a/_point1" />
    <copy assignNames="c2" prop="coords" target="a/_point2" />
    <copy assignNames="c3" prop="coords" target="b/_point1" />
    <copy assignNames="c4" prop="coords" target="b/_point2" />
    <copy assignNames="c5" prop="coords" target="c/_point1" />
    <copy assignNames="c6" prop="coords" target="c/_point2" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load

    cy.log("Test values displayed in browser");

    cy.get(cesc(`#\\/c1`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,2)");
      });
    cy.get(cesc(`#\\/c2`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,4)");
      });
    cy.get(cesc(`#\\/c3`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(9,3)");
      });
    cy.get(cesc(`#\\/c4`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,9)");
      });
    cy.get(cesc(`#\\/c5`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(16,4)");
      });
    cy.get(cesc(`#\\/c6`) + ` .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,16)");
      });
    cy.get(`${cesc2("#/q")} .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(`${cesc2("#/r")} .mjx-mrow`)
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let r = 1;
      let q = 1;
      let s = [2, 3, 4];
      let xs1 = s.map((v) => v * v * q);
      let xs2 = s.map((v) => v * r);
      let ns = ["a", "b", "c"];
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/_graph1"].stateValues.graphicalDescendants.length,
      ).eq(6);
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[0]).eq(
          xs1[ind],
        );
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[1]).eq(
          xs2[ind],
        );
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[0]).eq(
          xs2[ind],
        );
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[1]).eq(
          xs1[ind],
        );
      }
    });

    cy.log("move point a1");
    cy.window().then(async (win) => {
      let r = 1.3;
      let q = -2.1;
      let s = [2, 3, 4];
      let xs1 = s.map((v) => v * v * q);
      let xs2 = s.map((v) => v * r);
      let ns = ["a", "b", "c"];

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/a/_point1",
        args: { x: xs1[0], y: xs2[0] },
      });
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[0],
        ).closeTo(xs1[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[1],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[0],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[1],
        ).closeTo(xs1[ind], 1e-14);
      }
    });

    cy.log("move point a2");
    cy.window().then(async (win) => {
      let r = 0.7;
      let q = 1.8;
      let s = [2, 3, 4];
      let xs1 = s.map((v) => v * v * q);
      let xs2 = s.map((v) => v * r);
      let ns = ["a", "b", "c"];

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/a/_point2",
        args: { x: xs2[0], y: xs1[0] },
      });
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[0],
        ).closeTo(xs1[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[1],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[0],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[1],
        ).closeTo(xs1[ind], 1e-14);
      }
    });

    cy.log("move point b1");
    cy.window().then(async (win) => {
      let r = -0.2;
      let q = 0.3;
      let s = [2, 3, 4];
      let xs1 = s.map((v) => v * v * q);
      let xs2 = s.map((v) => v * r);
      let ns = ["a", "b", "c"];

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b/_point1",
        args: { x: xs1[1], y: xs2[1] },
      });
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[0],
        ).closeTo(xs1[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[1],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[0],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[1],
        ).closeTo(xs1[ind], 1e-14);
      }
    });

    cy.log("move point b2");
    cy.window().then(async (win) => {
      let r = 0.6;
      let q = 0.35;
      let s = [2, 3, 4];
      let xs1 = s.map((v) => v * v * q);
      let xs2 = s.map((v) => v * r);
      let ns = ["a", "b", "c"];

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b/_point2",
        args: { x: xs2[1], y: xs1[1] },
      });
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[0],
        ).closeTo(xs1[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[1],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[0],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[1],
        ).closeTo(xs1[ind], 1e-14);
      }
    });

    cy.log("move point c1");
    cy.window().then(async (win) => {
      let r = -0.21;
      let q = -0.46;
      let s = [2, 3, 4];
      let xs1 = s.map((v) => v * v * q);
      let xs2 = s.map((v) => v * r);
      let ns = ["a", "b", "c"];

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/c/_point1",
        args: { x: xs1[2], y: xs2[2] },
      });
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[0],
        ).closeTo(xs1[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[1],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[0],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[1],
        ).closeTo(xs1[ind], 1e-14);
      }
    });

    cy.log("move point c2");
    cy.window().then(async (win) => {
      let r = 0.37;
      let q = -0.73;
      let s = [2, 3, 4];
      let xs1 = s.map((v) => v * v * q);
      let xs2 = s.map((v) => v * r);
      let ns = ["a", "b", "c"];

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/c/_point2",
        args: { x: xs2[2], y: xs1[2] },
      });
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[0],
        ).closeTo(xs1[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point1`].stateValues.xs[1],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[0],
        ).closeTo(xs2[ind], 1e-14);
        expect(
          stateVariables[`/${namespace}/_point2`].stateValues.xs[1],
        ).closeTo(xs1[ind], 1e-14);
      }
    });
  });

  it("two maps with mutual copies, begin zero length, copied multiple times", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <map assignnames="a b c">
        <template newNamespace><point>
            (-$n, $n<copy prop="x" target="../q/_point1" />)
          </point></template>
      <sources alias="n">
        <sequence from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
      </sources>
      </map>
      <map assignnames="q r s">
        <template newNamespace><point>
            ($n, $n<copy prop="x" target="../a/_point1" />)
          </point></template>
      <sources alias="n">
        <sequence from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
      </sources>
      </map>
    </graph>
    
    <mathinput name="sequenceFrom" prefill="1"/>
    <mathinput name="sequenceTo" prefill="2"/>
    <mathinput name="sequenceCount" prefill="0"/>
    
    <graph>
    <copy name="copymap1" target="_map1" newNamespace />
    <copy name="copymap2" target="_map2" newNamespace />
    </graph>
    <graph>
    <copy name="copymap1b" target="copymap1" newNamespace />
    <copy name="copymap2b" target="copymap2" newNamespace />
    </graph>
    
    <copy name="g4" target="_graph1" newNamespace />
    <p><collect componentTypes="point" target="_graph1"/></p>
    <copy prop="value" target="sequenceCount" assignNames="sequenceCount2" />
    <copy prop="value" target="sequenceTo" assignNames="sequenceTo2" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load

    cy.log("At beginning, nothing shown");
    cy.get(cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/_graph1"].stateValues.graphicalDescendants.length,
      ).eq(0);
      expect(
        stateVariables["/_graph2"].stateValues.graphicalDescendants.length,
      ).eq(0);
      expect(
        stateVariables["/_graph3"].stateValues.graphicalDescendants.length,
      ).eq(0);
      expect(
        stateVariables["/g4/_graph1"].stateValues.graphicalDescendants.length,
      ).eq(0);
    });

    cy.log("make sequence length 1");
    cy.get(cesc2("#/sequenceCount") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc2("#/sequenceCount2")).should("contain.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[0].componentName,
      );
      let coords2Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[1].componentName,
      );

      cy.get(cesc2("#/_p1"))
        .children(coords1Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1,1)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords2Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−1)");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_graph1"].stateValues.graphicalDescendants.length,
        ).eq(2);
        expect(
          stateVariables["/_graph2"].stateValues.graphicalDescendants.length,
        ).eq(2);
        expect(
          stateVariables["/_graph3"].stateValues.graphicalDescendants.length,
        ).eq(2);
        expect(
          stateVariables["/g4/_graph1"].stateValues.graphicalDescendants.length,
        ).eq(2);
        expect(stateVariables["/a/_point1"].stateValues.coords).eqls([
          "vector",
          -1,
          1,
        ]);
        expect(stateVariables["/q/_point1"].stateValues.coords).eqls([
          "vector",
          1,
          -1,
        ]);
        expect(stateVariables["/copymap1/a/_point1"].stateValues.coords).eqls([
          "vector",
          -1,
          1,
        ]);
        expect(stateVariables["/copymap2/q/_point1"].stateValues.coords).eqls([
          "vector",
          1,
          -1,
        ]);
        expect(stateVariables["/copymap1b/a/_point1"].stateValues.coords).eqls([
          "vector",
          -1,
          1,
        ]);
        expect(stateVariables["/copymap2b/q/_point1"].stateValues.coords).eqls([
          "vector",
          1,
          -1,
        ]);
        expect(stateVariables["/g4/a/_point1"].stateValues.coords).eqls([
          "vector",
          -1,
          1,
        ]);
        expect(stateVariables["/g4/q/_point1"].stateValues.coords).eqls([
          "vector",
          1,
          -1,
        ]);
      });
    });

    cy.log("make sequence length 0 again");
    cy.get(cesc2("#/sequenceCount") + " textarea").type(
      "{end}{backspace}0{enter}",
      { force: true },
    );
    cy.get(cesc2("#/sequenceCount2")).should("contain.text", "0");

    cy.get(cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/_graph1"].stateValues.graphicalDescendants.length,
      ).eq(0);
      expect(
        stateVariables["/_graph2"].stateValues.graphicalDescendants.length,
      ).eq(0);
      expect(
        stateVariables["/_graph3"].stateValues.graphicalDescendants.length,
      ).eq(0);
      expect(
        stateVariables["/g4/_graph1"].stateValues.graphicalDescendants.length,
      ).eq(0);
    });

    cy.log("make sequence length 2");
    cy.get(cesc2("#/sequenceCount") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );
    cy.get(cesc2("#/sequenceCount2")).should("contain.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[0].componentName,
      );
      let coords2Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[1].componentName,
      );
      let coords3Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[2].componentName,
      );
      let coords4Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[3].componentName,
      );

      cy.get(cesc2("#/_p1"))
        .children(coords1Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1,1)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords2Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,2)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords3Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−1)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords4Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,−2)");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_graph1"].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(
          stateVariables["/_graph2"].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(
          stateVariables["/_graph3"].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(
          stateVariables["/g4/_graph1"].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(stateVariables["/a/_point1"].stateValues.coords).eqls([
          "vector",
          -1,
          1,
        ]);
        expect(stateVariables["/q/_point1"].stateValues.coords).eqls([
          "vector",
          1,
          -1,
        ]);
        expect(stateVariables["/copymap1/a/_point1"].stateValues.coords).eqls([
          "vector",
          -1,
          1,
        ]);
        expect(stateVariables["/copymap2/q/_point1"].stateValues.coords).eqls([
          "vector",
          1,
          -1,
        ]);
        expect(stateVariables["/copymap1b/a/_point1"].stateValues.coords).eqls([
          "vector",
          -1,
          1,
        ]);
        expect(stateVariables["/copymap2b/q/_point1"].stateValues.coords).eqls([
          "vector",
          1,
          -1,
        ]);
        expect(stateVariables["/g4/a/_point1"].stateValues.coords).eqls([
          "vector",
          -1,
          1,
        ]);
        expect(stateVariables["/g4/q/_point1"].stateValues.coords).eqls([
          "vector",
          1,
          -1,
        ]);
        expect(stateVariables["/b/_point1"].stateValues.coords).eqls([
          "vector",
          -2,
          2,
        ]);
        expect(stateVariables["/r/_point1"].stateValues.coords).eqls([
          "vector",
          2,
          -2,
        ]);
        expect(stateVariables["/copymap1/b/_point1"].stateValues.coords).eqls([
          "vector",
          -2,
          2,
        ]);
        expect(stateVariables["/copymap2/r/_point1"].stateValues.coords).eqls([
          "vector",
          2,
          -2,
        ]);
        expect(stateVariables["/copymap1b/b/_point1"].stateValues.coords).eqls([
          "vector",
          -2,
          2,
        ]);
        expect(stateVariables["/copymap2b/r/_point1"].stateValues.coords).eqls([
          "vector",
          2,
          -2,
        ]);
        expect(stateVariables["/g4/b/_point1"].stateValues.coords).eqls([
          "vector",
          -2,
          2,
        ]);
        expect(stateVariables["/g4/r/_point1"].stateValues.coords).eqls([
          "vector",
          2,
          -2,
        ]);
      });
    });

    cy.log("change limits");
    cy.get(cesc2("#/sequenceFrom") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );
    cy.get(cesc2("#/sequenceTo") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc2("#/sequenceTo2")).should("contain.text", "5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[0].componentName,
      );
      let coords2Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[1].componentName,
      );
      let coords3Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[2].componentName,
      );
      let coords4Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[3].componentName,
      );

      cy.get(cesc2("#/_p1"))
        .children(coords1Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,9)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords2Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,15)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords3Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,−9)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords4Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−15)");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_graph1"].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(
          stateVariables["/_graph2"].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(
          stateVariables["/_graph3"].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(
          stateVariables["/g4/_graph1"].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(stateVariables["/a/_point1"].stateValues.coords).eqls([
          "vector",
          -3,
          9,
        ]);
        expect(stateVariables["/q/_point1"].stateValues.coords).eqls([
          "vector",
          3,
          -9,
        ]);
        expect(stateVariables["/copymap1/a/_point1"].stateValues.coords).eqls([
          "vector",
          -3,
          9,
        ]);
        expect(stateVariables["/copymap2/q/_point1"].stateValues.coords).eqls([
          "vector",
          3,
          -9,
        ]);
        expect(stateVariables["/copymap1b/a/_point1"].stateValues.coords).eqls([
          "vector",
          -3,
          9,
        ]);
        expect(stateVariables["/copymap2b/q/_point1"].stateValues.coords).eqls([
          "vector",
          3,
          -9,
        ]);
        expect(stateVariables["/g4/a/_point1"].stateValues.coords).eqls([
          "vector",
          -3,
          9,
        ]);
        expect(stateVariables["/g4/q/_point1"].stateValues.coords).eqls([
          "vector",
          3,
          -9,
        ]);
        expect(stateVariables["/b/_point1"].stateValues.coords).eqls([
          "vector",
          -5,
          15,
        ]);
        expect(stateVariables["/r/_point1"].stateValues.coords).eqls([
          "vector",
          5,
          -15,
        ]);
        expect(stateVariables["/copymap1/b/_point1"].stateValues.coords).eqls([
          "vector",
          -5,
          15,
        ]);
        expect(stateVariables["/copymap2/r/_point1"].stateValues.coords).eqls([
          "vector",
          5,
          -15,
        ]);
        expect(stateVariables["/copymap1b/b/_point1"].stateValues.coords).eqls([
          "vector",
          -5,
          15,
        ]);
        expect(stateVariables["/copymap2b/r/_point1"].stateValues.coords).eqls([
          "vector",
          5,
          -15,
        ]);
        expect(stateVariables["/g4/b/_point1"].stateValues.coords).eqls([
          "vector",
          -5,
          15,
        ]);
        expect(stateVariables["/g4/r/_point1"].stateValues.coords).eqls([
          "vector",
          5,
          -15,
        ]);
      });
    });

    cy.log("make sequence length 0 again");
    cy.get(cesc2("#/sequenceCount") + " textarea").type(
      "{end}{backspace}0{enter}",
      { force: true },
    );
    cy.get(cesc2("#/sequenceCount2")).should("contain.text", "0");

    cy.get(cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/_graph1"].stateValues.graphicalDescendants.length,
      ).eq(0);
      expect(
        stateVariables["/_graph2"].stateValues.graphicalDescendants.length,
      ).eq(0);
      expect(
        stateVariables["/_graph3"].stateValues.graphicalDescendants.length,
      ).eq(0);
      expect(
        stateVariables["/g4/_graph1"].stateValues.graphicalDescendants.length,
      ).eq(0);
    });

    cy.log("make sequence length 3");
    cy.get(cesc2("#/sequenceCount") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );
    cy.get(cesc2("#/sequenceCount2")).should("contain.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[0].componentName,
      );
      let coords2Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[1].componentName,
      );
      let coords3Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[2].componentName,
      );
      let coords4Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[3].componentName,
      );
      let coords5Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[4].componentName,
      );
      let coords6Anchor = cesc2(
        "#" + stateVariables["/_collect1"].replacements[5].componentName,
      );

      cy.get(cesc2("#/_p1"))
        .children(coords1Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,9)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords2Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,12)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords3Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,15)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords4Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,−9)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords5Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,−12)");
        });
      cy.get(cesc2("#/_p1"))
        .children(coords6Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−15)");
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_graph1"].stateValues.graphicalDescendants.length,
        ).eq(6);
        expect(
          stateVariables["/_graph2"].stateValues.graphicalDescendants.length,
        ).eq(6);
        expect(
          stateVariables["/_graph3"].stateValues.graphicalDescendants.length,
        ).eq(6);
        expect(
          stateVariables["/g4/_graph1"].stateValues.graphicalDescendants.length,
        ).eq(6);
        expect(stateVariables["/a/_point1"].stateValues.coords).eqls([
          "vector",
          -3,
          9,
        ]);
        expect(stateVariables["/q/_point1"].stateValues.coords).eqls([
          "vector",
          3,
          -9,
        ]);
        expect(stateVariables["/copymap1/a/_point1"].stateValues.coords).eqls([
          "vector",
          -3,
          9,
        ]);
        expect(stateVariables["/copymap2/q/_point1"].stateValues.coords).eqls([
          "vector",
          3,
          -9,
        ]);
        expect(stateVariables["/copymap1b/a/_point1"].stateValues.coords).eqls([
          "vector",
          -3,
          9,
        ]);
        expect(stateVariables["/copymap2b/q/_point1"].stateValues.coords).eqls([
          "vector",
          3,
          -9,
        ]);
        expect(stateVariables["/g4/a/_point1"].stateValues.coords).eqls([
          "vector",
          -3,
          9,
        ]);
        expect(stateVariables["/g4/q/_point1"].stateValues.coords).eqls([
          "vector",
          3,
          -9,
        ]);
        expect(stateVariables["/b/_point1"].stateValues.coords).eqls([
          "vector",
          -4,
          12,
        ]);
        expect(stateVariables["/r/_point1"].stateValues.coords).eqls([
          "vector",
          4,
          -12,
        ]);
        expect(stateVariables["/copymap1/b/_point1"].stateValues.coords).eqls([
          "vector",
          -4,
          12,
        ]);
        expect(stateVariables["/copymap2/r/_point1"].stateValues.coords).eqls([
          "vector",
          4,
          -12,
        ]);
        expect(stateVariables["/copymap1b/b/_point1"].stateValues.coords).eqls([
          "vector",
          -4,
          12,
        ]);
        expect(stateVariables["/copymap2b/r/_point1"].stateValues.coords).eqls([
          "vector",
          4,
          -12,
        ]);
        expect(stateVariables["/g4/b/_point1"].stateValues.coords).eqls([
          "vector",
          -4,
          12,
        ]);
        expect(stateVariables["/g4/r/_point1"].stateValues.coords).eqls([
          "vector",
          4,
          -12,
        ]);
        expect(stateVariables["/c/_point1"].stateValues.coords).eqls([
          "vector",
          -5,
          15,
        ]);
        expect(stateVariables["/s/_point1"].stateValues.coords).eqls([
          "vector",
          5,
          -15,
        ]);
        expect(stateVariables["/copymap1/c/_point1"].stateValues.coords).eqls([
          "vector",
          -5,
          15,
        ]);
        expect(stateVariables["/copymap2/s/_point1"].stateValues.coords).eqls([
          "vector",
          5,
          -15,
        ]);
        expect(stateVariables["/copymap1b/c/_point1"].stateValues.coords).eqls([
          "vector",
          -5,
          15,
        ]);
        expect(stateVariables["/copymap2b/s/_point1"].stateValues.coords).eqls([
          "vector",
          5,
          -15,
        ]);
        expect(stateVariables["/g4/c/_point1"].stateValues.coords).eqls([
          "vector",
          -5,
          15,
        ]);
        expect(stateVariables["/g4/s/_point1"].stateValues.coords).eqls([
          "vector",
          5,
          -15,
        ]);
      });
    });
  });

  it("map points to adapt to math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput name="number"/></p>
    <p>Step size: <mathinput name="step" /></p>
    
    <math>
      <map>
        <template><point>($n, sin($n))</point></template>
        <sources alias="n">
          <sequence from="2" length="$number" step="$step" />
        </sources>
      </map>
    </math>
    <copy prop="value" target="number" assignNames="number2" />
    <copy prop="value" target="step" assignNames="step2" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].activeChildren.length).eq(0);
    });

    cy.get(cesc2("#/number") + " textarea").type("10{enter}", { force: true });
    cy.get(cesc2("#/number2")).should("contain.text", "10");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].activeChildren.length).eq(0);
    });

    cy.get(cesc2("#/step") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc2("#/step2")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].activeChildren.length).eq(10);
      for (let i = 0; i < 10; i++) {
        let j = i + 2;
        expect(
          stateVariables[
            stateVariables["/_math1"].activeChildren[i].componentName
          ].stateValues.value,
        ).eqls(["vector", j, ["apply", "sin", j]]);
      }
    });

    cy.get(cesc2("#/number") + " textarea").type(
      "{end}{backspace}{backspace}20{enter}",
      { force: true },
    );
    cy.get(cesc2("#/number2")).should("contain.text", "20");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].activeChildren.length).eq(20);
      for (let i = 0; i < 20; i++) {
        let j = i + 2;
        expect(
          stateVariables[
            stateVariables["/_math1"].activeChildren[i].componentName
          ].stateValues.value,
        ).eqls(["vector", j, ["apply", "sin", j]]);
      }
    });

    cy.get(cesc2("#/step") + " textarea").type("{end}{backspace}0.5{enter}", {
      force: true,
    });
    cy.get(cesc2("#/step2")).should("contain.text", "0.5");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].activeChildren.length).eq(20);
      for (let i = 0; i < 20; i++) {
        let j = 2 + i * 0.5;
        if (Number.isInteger(j)) {
          expect(
            stateVariables[
              stateVariables["/_math1"].activeChildren[i].componentName
            ].stateValues.value,
          ).eqls(["vector", j, ["apply", "sin", j]]);
        } else {
          let val =
            stateVariables[
              stateVariables["/_math1"].activeChildren[i].componentName
            ].stateValues.value;
          expect(val[0]).eq("vector");
          expect(val[1]).eq(j);
          expect(val[2]).closeTo(Math.sin(j), 1e14);
        }
      }
    });

    cy.get(cesc2("#/number") + " textarea").type(
      "{end}{backspace}{backspace}10{enter}",
      { force: true },
    );
    cy.get(cesc2("#/number2")).should("contain.text", "10");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].activeChildren.length).eq(10);
      for (let i = 0; i < 10; i++) {
        let j = 2 + i * 0.5;
        if (Number.isInteger(j)) {
          expect(
            stateVariables[
              stateVariables["/_math1"].activeChildren[i].componentName
            ].stateValues.value,
          ).eqls(["vector", j, ["apply", "sin", j]]);
        } else {
          let val =
            stateVariables[
              stateVariables["/_math1"].activeChildren[i].componentName
            ].stateValues.value;
          expect(val[0]).eq("vector");
          expect(val[1]).eq(j);
          expect(val[2]).closeTo(Math.sin(j), 1e14);
        }
      }
    });

    cy.get(cesc2("#/step") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}{enter}",
      { force: true },
    );
    cy.get(cesc2("#/step2")).should("contain.text", "\uff3f");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].activeChildren.length).eq(0);
    });

    cy.get(cesc2("#/number") + " textarea").type(
      "{end}{backspace}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc2("#/number2")).should("contain.text", "5");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].activeChildren.length).eq(0);
    });

    cy.get(cesc2("#/step") + " textarea").type("-3{enter}", { force: true });
    cy.get(cesc2("#/step2")).should("contain.text", `${nInDOM(-3)}`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].activeChildren.length).eq(5);
      for (let i = 0; i < 5; i++) {
        let j = 2 - i * 3;
        expect(
          stateVariables[
            stateVariables["/_math1"].activeChildren[i].componentName
          ].stateValues.value,
        ).eqls(["vector", j, ["apply", "sin", j]]);
      }
    });
  });

  it("map inside sources of map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput name="number"/></p>
    
    <map name="m1" assignNames="p1 p2 p3">
      <template newNamespace><point name="pt">($n, 2$n)</point></template>
      <sources alias="n">
        <sequence length="$number" />
      </sources>
    </map>

    <map name="m2" assignNames="q1 q2 q3">
      <template newNamespace>
        <point name="pt">(<copy target="p" prop="x" />^2, <copy target="p" prop="y" />^2)</point>
      </template>
      <sources alias="p">
        <copy target="m1" />
      </sources>
    </map>

    p1a: <copy target="p1" assignNames="p1a" />,
    p1b: <copy target="p1/pt" assignNames="p1b" />,
    p2a: <copy target="p2" assignNames="p2a" />,
    p2b: <copy target="p2/pt" assignNames="p2b" />,
    p3a: <copy target="p3" assignNames="p3a" />,
    p3b: <copy target="p3/pt" assignNames="p3b" />,

    q1a: <copy target="q1" assignNames="q1a" />,
    q1b: <copy target="q1/pt" assignNames="q1b" />,
    q2a: <copy target="q2" assignNames="q2a" />,
    q2b: <copy target="q2/pt" assignNames="q2b" />,
    q3a: <copy target="q3" assignNames="q3a" />,
    q3b: <copy target="q3/pt" assignNames="q3b" />,

    <p><copy prop="value" target="number" assignNames="number2" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load

    cy.get(cesc2("#/p1/pt")).should("not.exist");
    cy.get(cesc2("#/p1a/pt")).should("not.exist");
    cy.get(cesc2("#/p1b")).should("not.exist");
    cy.get(cesc2("#/p2/pt")).should("not.exist");
    cy.get(cesc2("#/p2a/pt")).should("not.exist");
    cy.get(cesc2("#/p2b")).should("not.exist");
    cy.get(cesc2("#/p3/pt")).should("not.exist");
    cy.get(cesc2("#/p3a/pt")).should("not.exist");
    cy.get(cesc2("#/p3b")).should("not.exist");

    cy.get(cesc2("#/q1/pt")).should("not.exist");
    cy.get(cesc2("#/q1a/pt")).should("not.exist");
    cy.get(cesc2("#/q1b")).should("not.exist");
    cy.get(cesc2("#/q2/pt")).should("not.exist");
    cy.get(cesc2("#/q2a/pt")).should("not.exist");
    cy.get(cesc2("#/q2b")).should("not.exist");
    cy.get(cesc2("#/q3/pt")).should("not.exist");
    cy.get(cesc2("#/q3a/pt")).should("not.exist");
    cy.get(cesc2("#/q3b")).should("not.exist");

    cy.log("set number to be 2");
    cy.get(cesc2("#/number") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc2("#/number")).should("contain.text", "2");

    cy.get(cesc2("#/p1/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc2("#/p1a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc2("#/p1b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });

    cy.get(cesc2("#/p2/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,4)");
      });
    cy.get(cesc2("#/p2a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,4)");
      });
    cy.get(cesc2("#/p2b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,4)");
      });

    cy.get(cesc2("#/p3/pt")).should("not.exist");
    cy.get(cesc2("#/p3a/pt")).should("not.exist");
    cy.get(cesc2("#/p3b")).should("not.exist");

    cy.get(cesc2("#/q1/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc2("#/q1a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc2("#/q1b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });

    cy.get(cesc2("#/q2/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,16)");
      });
    cy.get(cesc2("#/q2a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,16)");
      });
    cy.get(cesc2("#/q2b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,16)");
      });

    cy.get(cesc2("#/q3/pt")).should("not.exist");
    cy.get(cesc2("#/q3a/pt")).should("not.exist");
    cy.get(cesc2("#/q3b")).should("not.exist");

    cy.log("set number to be 1");
    cy.get(cesc2("#/number") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc2("#/number")).should("contain.text", "1");

    cy.get(cesc2("#/p1/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc2("#/p1a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc2("#/p1b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });

    cy.get(cesc2("#/p2/pt")).should("not.exist");
    cy.get(cesc2("#/p2a/pt")).should("not.exist");
    cy.get(cesc2("#/p2b")).should("not.exist");
    cy.get(cesc2("#/p3/pt")).should("not.exist");
    cy.get(cesc2("#/p3a/pt")).should("not.exist");
    cy.get(cesc2("#/p3b")).should("not.exist");

    cy.get(cesc2("#/q1/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc2("#/q1a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc2("#/q1b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });

    cy.get(cesc2("#/q2/pt")).should("not.exist");
    cy.get(cesc2("#/q2a/pt")).should("not.exist");
    cy.get(cesc2("#/q2b")).should("not.exist");
    cy.get(cesc2("#/q3/pt")).should("not.exist");
    cy.get(cesc2("#/q3a/pt")).should("not.exist");
    cy.get(cesc2("#/q3b")).should("not.exist");

    cy.log("set number to be 3");
    cy.get(cesc2("#/number") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc2("#/number")).should("contain.text", "3");

    cy.get(cesc2("#/p1/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc2("#/p1a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc2("#/p1b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });

    cy.get(cesc2("#/p2/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,4)");
      });
    cy.get(cesc2("#/p2a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,4)");
      });
    cy.get(cesc2("#/p2b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,4)");
      });

    cy.get(cesc2("#/p3/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,6)");
      });
    cy.get(cesc2("#/p3a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,6)");
      });
    cy.get(cesc2("#/p3b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,6)");
      });

    cy.get(cesc2("#/q1/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc2("#/q1a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc2("#/q1b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });

    cy.get(cesc2("#/q2/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,16)");
      });
    cy.get(cesc2("#/q2a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,16)");
      });
    cy.get(cesc2("#/q2b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,16)");
      });

    cy.get(cesc2("#/q3/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(9,36)");
      });
    cy.get(cesc2("#/q3a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(9,36)");
      });
    cy.get(cesc2("#/q3b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(9,36)");
      });

    cy.log("set number back to zero");
    cy.get(cesc2("#/number") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });
    cy.get(cesc2("#/number")).should("contain.text", "0");

    cy.get(cesc2("#/p1/pt")).should("not.exist");
    cy.get(cesc2("#/p1a/pt")).should("not.exist");
    cy.get(cesc2("#/p1b")).should("not.exist");
    cy.get(cesc2("#/p2/pt")).should("not.exist");
    cy.get(cesc2("#/p2a/pt")).should("not.exist");
    cy.get(cesc2("#/p2b")).should("not.exist");
    cy.get(cesc2("#/p3/pt")).should("not.exist");
    cy.get(cesc2("#/p3a/pt")).should("not.exist");
    cy.get(cesc2("#/p3b")).should("not.exist");

    cy.get(cesc2("#/q1/pt")).should("not.exist");
    cy.get(cesc2("#/q1a/pt")).should("not.exist");
    cy.get(cesc2("#/q1b")).should("not.exist");
    cy.get(cesc2("#/q2/pt")).should("not.exist");
    cy.get(cesc2("#/q2a/pt")).should("not.exist");
    cy.get(cesc2("#/q2b")).should("not.exist");
    cy.get(cesc2("#/q3/pt")).should("not.exist");
    cy.get(cesc2("#/q3a/pt")).should("not.exist");
    cy.get(cesc2("#/q3b")).should("not.exist");

    cy.log("set number back to 1");
    cy.get(cesc2("#/number") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc2("#/number")).should("contain.text", "1");

    cy.get(cesc2("#/p1/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc2("#/p1a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc2("#/p1b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });

    cy.get(cesc2("#/p2/pt")).should("not.exist");
    cy.get(cesc2("#/p2a/pt")).should("not.exist");
    cy.get(cesc2("#/p2b")).should("not.exist");
    cy.get(cesc2("#/p3/pt")).should("not.exist");
    cy.get(cesc2("#/p3a/pt")).should("not.exist");
    cy.get(cesc2("#/p3b")).should("not.exist");

    cy.get(cesc2("#/q1/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc2("#/q1a/pt"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });
    cy.get(cesc2("#/q1b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,4)");
      });

    cy.get(cesc2("#/q2/pt")).should("not.exist");
    cy.get(cesc2("#/q2a/pt")).should("not.exist");
    cy.get(cesc2("#/q2b")).should("not.exist");
    cy.get(cesc2("#/q3/pt")).should("not.exist");
    cy.get(cesc2("#/q3a/pt")).should("not.exist");
    cy.get(cesc2("#/q3b")).should("not.exist");
  });

  it("can override fixed of source index", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map assignNames="a b">
      <template newNamespace>
      <copy target="i" assignNames="ind" />
      <mathinput bindValueTo="$ind" />
      </template>
      <sources indexAlias="i"><text>red</text><text>yellow</text></sources>
    </map>
    <map assignNames="c d">
      <template newNamespace>
      <copy target="i" assignNames="ind" fixed="false"  />
      <mathinput bindValueTo="$ind" />
      </template>
      <sources indexAlias="i"><text>red</text><text>yellow</text></sources>
    </map>


    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for window to load

    cy.get(cesc2("#/a/ind")).should("have.text", "1");
    cy.get(cesc2("#/b/ind")).should("have.text", "2");
    cy.get(cesc2("#/c/ind")).should("have.text", "1");
    cy.get(cesc2("#/d/ind")).should("have.text", "2");

    cy.get(cesc2("#/a/_mathinput1") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );
    cy.get(cesc2("#/b/_mathinput1") + " textarea").type(
      "{end}{backspace}4{enter}",
      { force: true },
    );
    cy.get(cesc2("#/c/_mathinput1") + " textarea").type(
      "{end}{backspace}5{enter}",
      { force: true },
    );
    cy.get(cesc2("#/d/_mathinput1") + " textarea").type(
      "{end}{backspace}6{enter}",
      { force: true },
    );

    cy.get(cesc2("#/d/ind")).should("have.text", "6");
    cy.get(cesc2("#/a/ind")).should("have.text", "1");
    cy.get(cesc2("#/b/ind")).should("have.text", "2");
    cy.get(cesc2("#/c/ind")).should("have.text", "5");

    cy.get(cesc2("#/a/_mathinput1") + " textarea").type("{end}x{enter}", {
      force: true,
    });
    cy.get(cesc2("#/b/_mathinput1") + " textarea").type("{end}x{enter}", {
      force: true,
    });
    cy.get(cesc2("#/c/_mathinput1") + " textarea").type("{end}x{enter}", {
      force: true,
    });
    cy.get(cesc2("#/d/_mathinput1") + " textarea").type("{end}x{enter}", {
      force: true,
    });

    cy.get(cesc2("#/d/ind")).should("have.text", "NaN");
    cy.get(cesc2("#/a/ind")).should("have.text", "1");
    cy.get(cesc2("#/b/ind")).should("have.text", "2");
    cy.get(cesc2("#/c/ind")).should("have.text", "NaN");

    cy.get(cesc2("#/a/_mathinput1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}7{enter}",
      { force: true },
    );
    cy.get(cesc2("#/b/_mathinput1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}8{enter}",
      { force: true },
    );
    cy.get(cesc2("#/c/_mathinput1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}9{enter}",
      { force: true },
    );
    cy.get(cesc2("#/d/_mathinput1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}10{enter}",
      { force: true },
    );

    cy.get(cesc2("#/d/ind")).should("have.text", "10");
    cy.get(cesc2("#/a/ind")).should("have.text", "1");
    cy.get(cesc2("#/b/ind")).should("have.text", "2");
    cy.get(cesc2("#/c/ind")).should("have.text", "9");
  });

  it("maps hide dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" >
      <label>Hide first map</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true" >
      <label>Hide second map</label>
    </booleaninput>
    <p>Length of map 1: <mathinput name="n1" prefill="4" /></p>
    <p>Length of map 2: <mathinput name="n2" prefill="4" /></p>

    <p name="m1">map 1: <map hide="$h1">
    <template>hi$a </template>
    <sources alias="a"><sequence length="$n1" /></sources>
    </map></p>
    <p name="m2">map 2: <map hide="$h2">
    <template>hi$a </template>
    <sources alias="a"><sequence length="$n2" /></sources>
    </map></p>

    <p>
      <copy prop="value" target="h1" assignNames="h1a" />
      <copy prop="value" target="h2" assignNames="h2a" />
      <copy prop="value" target="n1" assignNames="n1a" />
      <copy prop="value" target="n2" assignNames="n2a" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/m1")).should("have.text", "map 1: hi1 hi2 hi3 hi4 ");
    cy.get(cesc("#\\/m2")).should("have.text", "map 2: ");

    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}6{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}6{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2a")).should("contain.text", "6");
    cy.get(cesc("#\\/n1a")).should("contain.text", "6");

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "map 1: hi1 hi2 hi3 hi4 hi5 hi6 ",
    );
    cy.get(cesc("#\\/m2")).should("have.text", "map 2: ");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();
    cy.get(cesc("#\\/h2a")).should("contain.text", "false");
    cy.get(cesc("#\\/h1a")).should("contain.text", "true");

    cy.get(cesc("#\\/m1")).should("have.text", "map 1: ");
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "map 2: hi1 hi2 hi3 hi4 hi5 hi6 ",
    );

    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}8{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}8{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2a")).should("contain.text", "8");
    cy.get(cesc("#\\/n1a")).should("contain.text", "8");

    cy.get(cesc("#\\/m1")).should("have.text", "map 1: ");
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "map 2: hi1 hi2 hi3 hi4 hi5 hi6 hi7 hi8 ",
    );

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();
    cy.get(cesc("#\\/h2a")).should("contain.text", "true");
    cy.get(cesc("#\\/h1a")).should("contain.text", "false");

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "map 1: hi1 hi2 hi3 hi4 hi5 hi6 hi7 hi8 ",
    );
    cy.get(cesc("#\\/m2")).should("have.text", "map 2: ");

    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2a")).should("contain.text", "3");
    cy.get(cesc("#\\/n1a")).should("contain.text", "3");

    cy.get(cesc("#\\/m1")).should("have.text", "map 1: hi1 hi2 hi3 ");
    cy.get(cesc("#\\/m2")).should("have.text", "map 2: ");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();
    cy.get(cesc("#\\/h2a")).should("contain.text", "false");
    cy.get(cesc("#\\/h1a")).should("contain.text", "true");

    cy.get(cesc("#\\/m1")).should("have.text", "map 1: ");
    cy.get(cesc("#\\/m2")).should("have.text", "map 2: hi1 hi2 hi3 ");

    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2a")).should("contain.text", "4");
    cy.get(cesc("#\\/n1a")).should("contain.text", "4");

    cy.get(cesc("#\\/m1")).should("have.text", "map 1: ");
    cy.get(cesc("#\\/m2")).should("have.text", "map 2: hi1 hi2 hi3 hi4 ");
  });

  it("properly create unique name to avoid duplicate names", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map assignNames='(n1) (n2) '>
      <template>
        <number>$i</number>
        <number>10*$i</number>
      </template>
      
      <sources alias='i'><sequence from='1' to='2' /></sources>
    </map>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/n1")).should("have.text", "1");
    cy.get(cesc("#\\/n2")).should("have.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1a = stateVariables[
        stateVariables["/_map1"].replacements[0].componentName
      ].replacements.filter((s) => s.componentType)[1].componentName;
      let n2a = stateVariables[
        stateVariables["/_map1"].replacements[1].componentName
      ].replacements.filter((s) => s.componentType)[1].componentName;

      expect(stateVariables["/n1"].stateValues.value).eq(1);
      expect(stateVariables[n1a].stateValues.value).eq(10);
      expect(stateVariables["/n2"].stateValues.value).eq(2);
      expect(stateVariables[n2a].stateValues.value).eq(20);
    });
  });

  it("bug for isResponse and parallel is fixed", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <map isResponse behavior="parallel" assignNames="(p1) (p2)">
      <template>
        <p>hi $v</p>
      </template>
      <sources alias="v"><sequence length="2" /></sources>
    </map>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/p1")).should("have.text", "hi 1");
    cy.get(cesc("#\\/p2")).should("have.text", "hi 2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/p1"].stateValues.isResponse).eq(true);
      expect(stateVariables["/p2"].stateValues.isResponse).eq(true);
    });
  });
});
