import me from "math-expressions";
import { createFunctionFromDefinition } from "../../../../src/Core/utils/function";
import { cesc, cesc2 } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

describe("Function Operator Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("clamp function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function name="original" symbolic="true" displayDecimals="3">x^3</function>
    <clampfunction name="clamp01"><copy target="original" /></clampfunction>
    <clampfunction name="clampn35" lowervalue="-3" uppervalue="5"><copy target="original" /></clampfunction>

    <p><aslist>
    <map>
      <template newNamespace>$$(../original)($x)</template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace><evaluate function="$(../clamp01)" input="$x" /></template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace>$$(../clampn35)($x)</template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
      <copy target="_map2" name="m4" />
    </aslist></p>
    <p><aslist>
      <copy target="_map3" name="m5" />
    </aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let map1Replacements = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map1ReplacementAnchors = map1Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map2Replacements = stateVariables["/_map2"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map2ReplacementAnchors = map2Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map3Replacements = stateVariables["/_map3"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map3ReplacementAnchors = map3Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map4Replacements = stateVariables["/m4"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map4ReplacementAnchors = map4Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map5Replacements = stateVariables["/m5"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map5ReplacementAnchors = map5Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );

      let clamp01 = (x) => Math.min(1, Math.max(0, x));
      let clampn35 = (x) => Math.min(5, Math.max(-3, x));
      let indToVal = (ind) => me.math.round((0.2 * (ind - 11)) ** 3, 3);

      cy.log("Check values in DOM");
      for (let i = 1; i <= 21; i++) {
        cy.get(map1ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              indToVal(i).toString(),
            );
          });

        cy.get(map2ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              clamp01(indToVal(i)).toString(),
            );
          });

        cy.get(map3ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              clampn35(indToVal(i)).toString(),
            );
          });

        cy.get(map4ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              clamp01(indToVal(i)).toString(),
            );
          });

        cy.get(map5ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              clampn35(indToVal(i)).toString(),
            );
          });
      }

      cy.log("check mapped state values");
      cy.window().then(async (win) => {
        for (let i = 1; i <= 21; i++) {
          expect(
            stateVariables[map1Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(indToVal(i), 1e-10);
          expect(
            stateVariables[map2Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(clamp01(indToVal(i)), 1e-10);
          expect(
            stateVariables[map3Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(clampn35(indToVal(i)), 1e-10);
          expect(
            stateVariables[map4Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(clamp01(indToVal(i)), 1e-10);
          expect(
            stateVariables[map5Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(clampn35(indToVal(i)), 1e-10);
        }
      });

      cy.log("check functions created from fDefinition");
      cy.window().then(async (win) => {
        let f01 = createFunctionFromDefinition(
          stateVariables["/clamp01"].stateValues.fDefinitions[0],
        );
        let fn35 = createFunctionFromDefinition(
          stateVariables["/clampn35"].stateValues.fDefinitions[0],
        );

        for (let i = 1; i <= 21; i++) {
          let x = 0.2 * (i - 11);
          expect(f01(x)).closeTo(clamp01(indToVal(i)), 1e-10);
          expect(fn35(x)).closeTo(clampn35(indToVal(i)), 1e-10);
        }
      });
    });
  });

  it("clamp function, numeric", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function name="original" symbolic="false" displayDecimals="3">x^3</function>
    <clampfunction name="clamp01"><copy target="original" /></clampfunction>
    <clampfunction name="clampn35" lowervalue="-3" uppervalue="5"><copy target="original" /></clampfunction>

    <p><aslist>
    <map>
      <template newNamespace>$$(../original)($x)</template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace><evaluate function="$(../clamp01)" input="$x" /></template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace>$$(../clampn35)($x)</template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
      <copy target="_map2" name="m4" />
    </aslist></p>
    <p><aslist>
      <copy target="_map3" name="m5" />
    </aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let map1Replacements = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map1ReplacementAnchors = map1Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map2Replacements = stateVariables["/_map2"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map2ReplacementAnchors = map2Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map3Replacements = stateVariables["/_map3"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map3ReplacementAnchors = map3Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map4Replacements = stateVariables["/m4"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map4ReplacementAnchors = map4Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map5Replacements = stateVariables["/m5"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map5ReplacementAnchors = map5Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );

      let clamp01 = (x) => Math.min(1, Math.max(0, x));
      let clampn35 = (x) => Math.min(5, Math.max(-3, x));
      let indToVal = (ind) => me.math.round((0.2 * (ind - 11)) ** 3, 3);

      cy.log("Check values in DOM");
      for (let i = 1; i <= 21; i++) {
        cy.get(map1ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              indToVal(i).toString(),
            );
          });

        cy.get(map2ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              clamp01(indToVal(i)).toString(),
            );
          });

        cy.get(map3ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              clampn35(indToVal(i)).toString(),
            );
          });

        cy.get(map4ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              clamp01(indToVal(i)).toString(),
            );
          });

        cy.get(map5ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              clampn35(indToVal(i)).toString(),
            );
          });
      }

      cy.log("check mapped state values");
      cy.window().then(async (win) => {
        for (let i = 1; i <= 21; i++) {
          expect(
            stateVariables[map1Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(indToVal(i), 1e-10);
          expect(
            stateVariables[map2Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(clamp01(indToVal(i)), 1e-10);
          expect(
            stateVariables[map3Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(clampn35(indToVal(i)), 1e-10);
          expect(
            stateVariables[map4Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(clamp01(indToVal(i)), 1e-10);
          expect(
            stateVariables[map5Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(clampn35(indToVal(i)), 1e-10);
        }
      });

      cy.log("check functions created from fDefinition");
      cy.window().then(async (win) => {
        let f01 = createFunctionFromDefinition(
          stateVariables["/clamp01"].stateValues.fDefinitions[0],
        );
        let fn35 = createFunctionFromDefinition(
          stateVariables["/clampn35"].stateValues.fDefinitions[0],
        );

        for (let i = 1; i <= 21; i++) {
          let x = 0.2 * (i - 11);
          expect(f01(x)).closeTo(clamp01(indToVal(i)), 1e-10);
          expect(fn35(x)).closeTo(clampn35(indToVal(i)), 1e-10);
        }
      });
    });
  });

  it("clamp function, labeled", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function name="original" displayDecimals="3">x^3<label>orig</label></function>
    <clampfunction name="clamp01"><copy target="original" /><label>clamp 1</label></clampfunction>
    <clampfunction name="clampn35" lowervalue="-3" uppervalue="5"><copy target="original" /><label>clamp 2</label></clampfunction>

    <p><aslist>
    <map>
      <template newNamespace>$$(../original)($x)</template>
      <sources alias="x"><sequence step="1" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace><evaluate function="$(../clamp01)" input="$x" /></template>
      <sources alias="x"><sequence step="1" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace>$$(../clampn35)($x)</template>
      <sources alias="x"><sequence step="1" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/original"].stateValues.label).eq("orig");
      expect(stateVariables["/clamp01"].stateValues.label).eq("clamp 1");
      expect(stateVariables["/clampn35"].stateValues.label).eq("clamp 2");

      let map1Replacements = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map1ReplacementAnchors = map1Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map2Replacements = stateVariables["/_map2"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map2ReplacementAnchors = map2Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map3Replacements = stateVariables["/_map3"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map3ReplacementAnchors = map3Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );

      let clamp01 = (x) => Math.min(1, Math.max(0, x));
      let clampn35 = (x) => Math.min(5, Math.max(-3, x));
      let indToVal = (ind) => me.math.round((ind - 3) ** 3, 3);

      cy.log("Check values in DOM");
      for (let i = 1; i <= 5; i++) {
        cy.get(map1ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              indToVal(i).toString(),
            );
          });

        cy.get(map2ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              clamp01(indToVal(i)).toString(),
            );
          });

        cy.get(map3ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              clampn35(indToVal(i)).toString(),
            );
          });
      }

      cy.log("check mapped state values");
      cy.window().then(async (win) => {
        for (let i = 1; i <= 5; i++) {
          expect(
            stateVariables[map1Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(indToVal(i), 1e-10);
          expect(
            stateVariables[map2Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(clamp01(indToVal(i)), 1e-10);
          expect(
            stateVariables[map3Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(clampn35(indToVal(i)), 1e-10);
        }
      });

      cy.log("check functions created from fDefinition");
      cy.window().then(async (win) => {
        let f01 = createFunctionFromDefinition(
          stateVariables["/clamp01"].stateValues.fDefinitions[0],
        );
        let fn35 = createFunctionFromDefinition(
          stateVariables["/clampn35"].stateValues.fDefinitions[0],
        );

        for (let i = 1; i <= 5; i++) {
          let x = i - 3;
          expect(f01(x)).closeTo(clamp01(indToVal(i)), 1e-10);
          expect(fn35(x)).closeTo(clampn35(indToVal(i)), 1e-10);
        }
      });
    });
  });

  it("wrap function", () => {
    // Note: added domain [-2,2] to reduce time spent calculating all the extrema
    // when calling returnAllStateVariables1()
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function name="original" displayDecimals="3">x^3</function>
    <wrapfunctionperiodic name="wrap01" domain="[-2,2]"><copy target="original" /></wrapfunctionperiodic>
    <wrapfunctionperiodic name="wrapn23" lowervalue="-2" uppervalue="3" domain="[-2,2]"><copy target="original" /></wrapfunctionperiodic>

    <p><aslist>
    <map>
      <template newNamespace>$$(../original)($x)</template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace><evaluate function="$(../wrap01)" input="$x" /></template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace>$$(../wrapn23)($x)</template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
      <copy target="_map2" name="m4" />
    </aslist></p>
    <p><aslist>
      <copy target="_map3" name="m5" />
    </aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let map1Replacements = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map1ReplacementAnchors = map1Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map2Replacements = stateVariables["/_map2"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map2ReplacementAnchors = map2Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map3Replacements = stateVariables["/_map3"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map3ReplacementAnchors = map3Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map4Replacements = stateVariables["/m4"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map4ReplacementAnchors = map4Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map5Replacements = stateVariables["/m5"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map5ReplacementAnchors = map5Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );

      let wrap01 = (x) => me.math.round(me.math.mod(x, 1), 3);
      let wrapn23 = (x) => me.math.round(-2 + me.math.mod(x + 2, 5), 3);
      let indToVal = (ind) => me.math.round((0.2 * (ind - 11)) ** 3, 3);

      cy.log("Check values in DOM");

      for (let i = 1; i <= 21; i++) {
        cy.get(map1ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              indToVal(i).toString(),
            );
          });

        cy.get(map2ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              wrap01(indToVal(i)).toString(),
            );
          });

        cy.get(map3ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              wrapn23(indToVal(i)).toString(),
            );
          });

        cy.get(map4ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              wrap01(indToVal(i)).toString(),
            );
          });

        cy.get(map5ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              wrapn23(indToVal(i)).toString(),
            );
          });
      }

      cy.log("check mapped state values");
      cy.window().then(async (win) => {
        for (let i = 1; i <= 21; i++) {
          expect(
            stateVariables[map1Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(indToVal(i), 1e-10);
          expect(
            stateVariables[map2Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(wrap01(indToVal(i)), 1e-10);
          expect(
            stateVariables[map3Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(wrapn23(indToVal(i)), 1e-10);
          expect(
            stateVariables[map4Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(wrap01(indToVal(i)), 1e-10);
          expect(
            stateVariables[map5Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(wrapn23(indToVal(i)), 1e-10);
        }
      });

      cy.log("check functions created from fDefinition");
      cy.window().then(async (win) => {
        let f01 = createFunctionFromDefinition(
          stateVariables["/wrap01"].stateValues.fDefinitions[0],
        );
        let fn23 = createFunctionFromDefinition(
          stateVariables["/wrapn23"].stateValues.fDefinitions[0],
        );

        for (let i = 1; i <= 21; i++) {
          let x = 0.2 * (i - 11);
          expect(f01(x)).closeTo(wrap01(indToVal(i)), 1e-10);
          expect(fn23(x)).closeTo(wrapn23(indToVal(i)), 1e-10);
        }
      });
    });
  });

  it("wrap function, numeric", () => {
    // Note: added domain [-2,2] to reduce time spent calculating all the extrema
    // when calling returnAllStateVariables1()
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <function name="original" symbolic="false" displayDecimals="3">x^3</function>
    <wrapfunctionperiodic name="wrap01" domain="[-2,2]"><copy target="original" /></wrapfunctionperiodic>
    <wrapfunctionperiodic name="wrapn23" lowervalue="-2" uppervalue="3" domain="[-2,2]"><copy target="original" /></wrapfunctionperiodic>

    <p><aslist>
    <map>
      <template newNamespace>$$(../original)($x)</template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace><evaluate function="$(../wrap01)" input="$x" /></template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace>$$(../wrapn23)($x)</template>
      <sources alias="x"><sequence step="0.2" from="-2" to="2" /></sources>
    </map>
    </aslist></p>
    <p><aslist>
      <copy target="_map2" name="m4" />
    </aslist></p>
    <p><aslist>
      <copy target="_map3" name="m5" />
    </aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let map1Replacements = stateVariables["/_map1"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map1ReplacementAnchors = map1Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map2Replacements = stateVariables["/_map2"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map2ReplacementAnchors = map2Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map3Replacements = stateVariables["/_map3"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map3ReplacementAnchors = map3Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map4Replacements = stateVariables["/m4"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map4ReplacementAnchors = map4Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );
      let map5Replacements = stateVariables["/m5"].replacements.reduce(
        (a, c) => [...a, ...stateVariables[c.componentName].replacements],
        [],
      );
      let map5ReplacementAnchors = map5Replacements.map((x) =>
        cesc2("#" + x.componentName),
      );

      let wrap01 = (x) => me.math.round(me.math.mod(x, 1), 3);
      let wrapn23 = (x) => me.math.round(-2 + me.math.mod(x + 2, 5), 3);
      let indToVal = (ind) => me.math.round((0.2 * (ind - 11)) ** 3, 3);

      cy.log("Check values in DOM");

      for (let i = 1; i <= 21; i++) {
        cy.get(map1ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              indToVal(i).toString(),
            );
          });

        cy.get(map2ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              wrap01(indToVal(i)).toString(),
            );
          });

        cy.get(map3ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              wrapn23(indToVal(i)).toString(),
            );
          });

        cy.get(map4ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              wrap01(indToVal(i)).toString(),
            );
          });

        cy.get(map5ReplacementAnchors[i - 1])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim().replace(/−/g, "-")).equal(
              wrapn23(indToVal(i)).toString(),
            );
          });
      }

      cy.log("check mapped state values");
      cy.window().then(async (win) => {
        for (let i = 1; i <= 21; i++) {
          expect(
            stateVariables[map1Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(indToVal(i), 1e-10);
          expect(
            stateVariables[map2Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(wrap01(indToVal(i)), 1e-10);
          expect(
            stateVariables[map3Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(wrapn23(indToVal(i)), 1e-10);
          expect(
            stateVariables[map4Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(wrap01(indToVal(i)), 1e-10);
          expect(
            stateVariables[map5Replacements[i - 1].componentName].stateValues
              .value,
          ).closeTo(wrapn23(indToVal(i)), 1e-10);
        }
      });

      cy.log("check functions created from fDefinition");
      cy.window().then(async (win) => {
        let f01 = createFunctionFromDefinition(
          stateVariables["/wrap01"].stateValues.fDefinitions[0],
        );
        let fn23 = createFunctionFromDefinition(
          stateVariables["/wrapn23"].stateValues.fDefinitions[0],
        );

        for (let i = 1; i <= 21; i++) {
          let x = 0.2 * (i - 11);
          expect(f01(x)).closeTo(wrap01(indToVal(i)), 1e-10);
          expect(fn23(x)).closeTo(wrapn23(indToVal(i)), 1e-10);
        }
      });
    });
  });

  it("derivative", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><m>a =</m> <mathinput name="a" prefill="1" /></p>
    <p><m>b =</m> <mathinput name="b" prefill="1" /></p>
    <p><m>c =</m> <mathinput name="c" prefill="1" /></p>
    <p><m>x =</m> <mathinput name="x" prefill="x" /></p>

    <math hide name="formula" simplify>
        $a sin($b$x + $c)
    </math>

    <p><m>f($x) =
    <function name="f" variable="$x">$formula</function>
    </m></p>

    <p><m>f'($x) =
    <derivative name="g">$f</derivative>
    </m></p>

    <graph>
      $f
      $g
      <point x="3" y="4">
        <constraints>
          <constrainTo>$f</constrainTo>
        </constraints>
      </point>
      <point x="3" y="4">
        <constraints>
          <constrainTo>$g</constrainTo>
        </constraints>
      </point>
    </graph>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/_m5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f(x)=sin(x+1)");
      });
    cy.get(cesc2("#/_m6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f′(x)=cos(x+1)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = 3,
        y1 = Math.sin(4);
      let x2 = 3,
        y2 = Math.cos(4);

      expect(
        me.fromAst(stateVariables["/f"].stateValues.formula).toString(),
      ).eq("sin(x + 1)");
      expect(
        me.fromAst(stateVariables["/g"].stateValues.formula).toString(),
      ).eq("cos(x + 1)");
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(x1, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(y1, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(x2, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(y2, 1e-12);

      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      let g = createFunctionFromDefinition(
        stateVariables["/g"].stateValues.fDefinitions[0],
      );

      for (let i = 1; i <= 21; i++) {
        let x = 0.2 * (i - 11);
        expect(f(x)).closeTo(Math.sin(x + 1), 1e-10);
        expect(g(x)).closeTo(Math.cos(x + 1), 1e-10);
      }
    });

    cy.window().then(async (win) => {
      let x1 = -3,
        y1 = Math.sin(-2);
      let x2 = 5,
        y2 = Math.cos(6);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 },
      });

      let stateVariables = await win.returnAllStateVariables1();

      expect(
        me.fromAst(stateVariables["/f"].stateValues.formula).toString(),
      ).eq("sin(x + 1)");
      expect(
        me.fromAst(stateVariables["/g"].stateValues.formula).toString(),
      ).eq("cos(x + 1)");
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(x1, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(y1, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(x2, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(y2, 1e-12);
    });

    cy.get(cesc2("#/a") + " textarea").type(`{end}{backspace}2`, {
      force: true,
    });
    cy.get(cesc2("#/b") + " textarea").type(`{end}{backspace}pi`, {
      force: true,
    });
    cy.get(cesc2("#/c") + " textarea").type(`{end}{backspace}e`, {
      force: true,
    });
    cy.get(cesc2("#/x") + " textarea")
      .type(`{end}{backspace}q`, { force: true })
      .blur();

    cy.get(cesc2("#/_m5") + " .mjx-mrow").should(
      "contain.text",
      "f(q)=2sin(e+πq)",
    );
    cy.get(cesc2("#/_m5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f(q)=2sin(e+πq)");
      });
    cy.get(cesc2("#/_m6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f′(q)=2πcos(e+πq)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = -3,
        y1 = 2 * Math.sin(Math.PI * -3 + Math.E);
      let x2 = 5,
        y2 = 2 * Math.PI * Math.cos(Math.PI * 5 + Math.E);

      expect(
        me.fromAst(stateVariables["/f"].stateValues.formula).toString(),
      ).eq("2 sin(e + π q)");
      expect(
        me.fromAst(stateVariables["/g"].stateValues.formula).toString(),
      ).eq("2 π cos(e + π q)");
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(x1, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(y1, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(x2, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(y2, 1e-12);

      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      let g = createFunctionFromDefinition(
        stateVariables["/g"].stateValues.fDefinitions[0],
      );

      for (let i = 1; i <= 21; i++) {
        let x = 0.2 * (i - 11);
        expect(f(x)).closeTo(2 * Math.sin(Math.PI * x + Math.E), 1e-10);
        expect(g(x)).closeTo(
          2 * Math.PI * Math.cos(Math.PI * x + Math.E),
          1e-10,
        );
      }
    });

    cy.window().then(async (win) => {
      let x1 = 9,
        y1 = 2 * Math.sin(Math.PI * 9 + Math.E);
      let x2 = -7,
        y2 = 2 * Math.PI * Math.cos(Math.PI * -7 + Math.E);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 },
      });

      let stateVariables = await win.returnAllStateVariables1();

      expect(
        me.fromAst(stateVariables["/f"].stateValues.formula).toString(),
      ).eq("2 sin(e + π q)");
      expect(
        me.fromAst(stateVariables["/g"].stateValues.formula).toString(),
      ).eq("2 π cos(e + π q)");
      expect(stateVariables["/_point1"].stateValues.xs[0]).closeTo(x1, 1e-12);
      expect(stateVariables["/_point1"].stateValues.xs[1]).closeTo(y1, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[0]).closeTo(x2, 1e-12);
      expect(stateVariables["/_point2"].stateValues.xs[1]).closeTo(y2, 1e-12);
    });
  });

  it("derivative 2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <function name="f1">sin(x)</function>
      <function name="f2" variables="y">e^(2y)</function>
      <function name="f3">xyz</function>
      <function name="f4" variable="z">xyz</function>
      <derivative name="d1"><function>x^2</function></derivative>
      <derivative name="d2"><math name="x2">x^2</math></derivative>
      <derivative name="d2b">$x2</derivative>
      <derivative name="d2c"><copy target="x2" /></derivative>
      <derivative name="d3"><function>x^2sin(z)</function></derivative>
      <derivative name="d4" variables="z">x^2sin(z)</derivative>
      <math name='var'>z</math><number name="a">2</number>
      <derivative name="d4b" variable="$var">x^$a sin($var)</derivative>
      <derivative name="d5"><copy target="f1" /></derivative>
      <derivative name="d5b">$f1</derivative>
      <derivative name="d6"><copy target="f2" /></derivative>
      <derivative name="d6b">$f2</derivative>
      <derivative name="d7"><copy target="f3" /></derivative>
      <derivative name="d7b">$f3</derivative>
      <derivative name="d8"><copy target="f4" /></derivative>
      <derivative name="d8b">$f4</derivative>
      <derivative variables="q" name="d9"><copy target="f1" /></derivative>
      <derivative variable="q" name="d10"><copy target="f2" /></derivative>
      <derivative variables="q" name="d11"><copy target="f3" /></derivative>
      <derivative variable="q" name="d12"><copy target="f4" /></derivative>
      <derivative variables="y" name="d13"><copy target="f3" /></derivative>
      <derivative variable="y" name="d14"><copy target="f4" /></derivative>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        me
          .fromAst(stateVariables["/d1"].stateValues.formula)
          .equals(me.fromText("2x")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d2"].stateValues.formula)
          .equals(me.fromText("2x")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d2b"].stateValues.formula)
          .equals(me.fromText("2x")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d2c"].stateValues.formula)
          .equals(me.fromText("2x")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d3"].stateValues.formula)
          .equals(me.fromText("2x sin(z)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d4"].stateValues.formula)
          .equals(me.fromText("x^2cos(z)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d4b"].stateValues.formula)
          .equals(me.fromText("x^2cos(z)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d5"].stateValues.formula)
          .equals(me.fromText("cos(x)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d5b"].stateValues.formula)
          .equals(me.fromText("cos(x)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d6"].stateValues.formula)
          .equals(me.fromText("2e^(2y)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d6b"].stateValues.formula)
          .equals(me.fromText("2e^(2y)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d7"].stateValues.formula)
          .equals(me.fromText("yz")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d7b"].stateValues.formula)
          .equals(me.fromText("yz")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d8"].stateValues.formula)
          .equals(me.fromText("xy")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d8b"].stateValues.formula)
          .equals(me.fromText("xy")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d9"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d10"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d11"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d12"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d13"].stateValues.formula)
          .equals(me.fromText("xz")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d14"].stateValues.formula)
          .equals(me.fromText("xz")),
      ).eq(true);

      let d1 = createFunctionFromDefinition(
        stateVariables["/d1"].stateValues.fDefinitions[0],
      );
      let d2 = createFunctionFromDefinition(
        stateVariables["/d2"].stateValues.fDefinitions[0],
      );
      let d2b = createFunctionFromDefinition(
        stateVariables["/d2b"].stateValues.fDefinitions[0],
      );
      let d2c = createFunctionFromDefinition(
        stateVariables["/d2c"].stateValues.fDefinitions[0],
      );
      let d5 = createFunctionFromDefinition(
        stateVariables["/d5"].stateValues.fDefinitions[0],
      );
      let d5b = createFunctionFromDefinition(
        stateVariables["/d5b"].stateValues.fDefinitions[0],
      );
      let d6 = createFunctionFromDefinition(
        stateVariables["/d6"].stateValues.fDefinitions[0],
      );
      let d6b = createFunctionFromDefinition(
        stateVariables["/d6b"].stateValues.fDefinitions[0],
      );
      let d9 = createFunctionFromDefinition(
        stateVariables["/d9"].stateValues.fDefinitions[0],
      );
      let d10 = createFunctionFromDefinition(
        stateVariables["/d10"].stateValues.fDefinitions[0],
      );
      let d11 = createFunctionFromDefinition(
        stateVariables["/d11"].stateValues.fDefinitions[0],
      );
      let d12 = createFunctionFromDefinition(
        stateVariables["/d12"].stateValues.fDefinitions[0],
      );

      for (let i = 1; i <= 21; i++) {
        let x = 0.2 * (i - 11);
        expect(d1(x)).closeTo(2 * x, 1e-10);
        expect(d2(x)).closeTo(2 * x, 1e-10);
        expect(d2b(x)).closeTo(2 * x, 1e-10);
        expect(d2c(x)).closeTo(2 * x, 1e-10);
        expect(d5(x)).closeTo(Math.cos(x), 1e-10);
        expect(d5b(x)).closeTo(Math.cos(x), 1e-10);
        expect(d6(x)).closeTo(2 * Math.exp(2 * x), 1e-10);
        expect(d6b(x)).closeTo(2 * Math.exp(2 * x), 1e-10);
        expect(d9(x)).closeTo(0, 1e-10);
        expect(d10(x)).closeTo(0, 1e-10);
        expect(d11(x)).closeTo(0, 1e-10);
        expect(d12(x)).closeTo(0, 1e-10);
      }
    });
  });

  it("derivative 2, labeled", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <function name="f1">sin(x)</function>
      <function name="f2" variable="y">e^(2y)</function>
      <function name="f3">xyz</function>
      <function name="f4" variables="z">xyz</function>
      <derivative name="d1"><function>x^2</function><label>d1</label></derivative>
      <derivative name="d2"><label>d2</label><math name="x2">x^2</math></derivative>
      <derivative name="d2b">$x2<label>d2b</label></derivative>
      <derivative name="d2c"><label>d2c</label><copy target="x2" /></derivative>
      <derivative name="d3"><function>x^2sin(z)</function><label>d3</label></derivative>
      <derivative name="d4" variable="z"><label>d4</label>x^2sin(z)</derivative>
      <math name='var'>z</math><number name="a">2</number>
      <derivative name="d4b" variables="$var">x^$a sin($var)<label>d4b</label></derivative>
      <derivative name="d5"><label>d5</label><copy target="f1" /></derivative>
      <derivative name="d5b">$f1<label>d5b</label></derivative>
      <derivative name="d6"><copy target="f2" /><label>d6</label></derivative>
      <derivative name="d6b"><label>d6b</label>$f2</derivative>
      <derivative name="d7"><copy target="f3" /><label>d7</label></derivative>
      <derivative name="d7b"><label>d7b</label>$f3</derivative>
      <derivative name="d8"><label>d8</label><copy target="f4" /></derivative>
      <derivative name="d8b">$f4<label>d8b</label></derivative>
      <derivative variable="q" name="d9"><label>d9</label><copy target="f1" /></derivative>
      <derivative variables="q" name="d10"><copy target="f2" /><label>d10</label></derivative>
      <derivative variable="q" name="d11"><label>d11</label><copy target="f3" /></derivative>
      <derivative variables="q" name="d12"><copy target="f4" /><label>d12</label></derivative>
      <derivative variable="y" name="d13"><label>d13</label><copy target="f3" /></derivative>
      <derivative variables="y" name="d14"><copy target="f4" /><label>d14</label></derivative>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/d1"].stateValues.label).eq("d1");
      expect(stateVariables["/d2"].stateValues.label).eq("d2");
      expect(stateVariables["/d2b"].stateValues.label).eq("d2b");
      expect(stateVariables["/d2c"].stateValues.label).eq("d2c");
      expect(stateVariables["/d3"].stateValues.label).eq("d3");
      expect(stateVariables["/d4"].stateValues.label).eq("d4");
      expect(stateVariables["/d4b"].stateValues.label).eq("d4b");
      expect(stateVariables["/d5"].stateValues.label).eq("d5");
      expect(stateVariables["/d5b"].stateValues.label).eq("d5b");
      expect(stateVariables["/d6"].stateValues.label).eq("d6");
      expect(stateVariables["/d6b"].stateValues.label).eq("d6b");
      expect(stateVariables["/d7"].stateValues.label).eq("d7");
      expect(stateVariables["/d7b"].stateValues.label).eq("d7b");
      expect(stateVariables["/d8"].stateValues.label).eq("d8");
      expect(stateVariables["/d8b"].stateValues.label).eq("d8b");
      expect(stateVariables["/d9"].stateValues.label).eq("d9");
      expect(stateVariables["/d10"].stateValues.label).eq("d10");
      expect(stateVariables["/d11"].stateValues.label).eq("d11");
      expect(stateVariables["/d12"].stateValues.label).eq("d12");
      expect(stateVariables["/d13"].stateValues.label).eq("d13");
      expect(stateVariables["/d14"].stateValues.label).eq("d14");

      expect(
        me
          .fromAst(stateVariables["/d1"].stateValues.formula)
          .equals(me.fromText("2x")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d2"].stateValues.formula)
          .equals(me.fromText("2x")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d2b"].stateValues.formula)
          .equals(me.fromText("2x")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d2c"].stateValues.formula)
          .equals(me.fromText("2x")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d3"].stateValues.formula)
          .equals(me.fromText("2x sin(z)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d4"].stateValues.formula)
          .equals(me.fromText("x^2cos(z)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d4b"].stateValues.formula)
          .equals(me.fromText("x^2cos(z)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d5"].stateValues.formula)
          .equals(me.fromText("cos(x)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d5b"].stateValues.formula)
          .equals(me.fromText("cos(x)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d6"].stateValues.formula)
          .equals(me.fromText("2e^(2y)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d6b"].stateValues.formula)
          .equals(me.fromText("2e^(2y)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d7"].stateValues.formula)
          .equals(me.fromText("yz")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d7b"].stateValues.formula)
          .equals(me.fromText("yz")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d8"].stateValues.formula)
          .equals(me.fromText("xy")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d8b"].stateValues.formula)
          .equals(me.fromText("xy")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d9"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d10"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d11"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d12"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d13"].stateValues.formula)
          .equals(me.fromText("xz")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d14"].stateValues.formula)
          .equals(me.fromText("xz")),
      ).eq(true);

      let d1 = createFunctionFromDefinition(
        stateVariables["/d1"].stateValues.fDefinitions[0],
      );
      let d2 = createFunctionFromDefinition(
        stateVariables["/d2"].stateValues.fDefinitions[0],
      );
      let d2b = createFunctionFromDefinition(
        stateVariables["/d2b"].stateValues.fDefinitions[0],
      );
      let d2c = createFunctionFromDefinition(
        stateVariables["/d2c"].stateValues.fDefinitions[0],
      );
      let d5 = createFunctionFromDefinition(
        stateVariables["/d5"].stateValues.fDefinitions[0],
      );
      let d5b = createFunctionFromDefinition(
        stateVariables["/d5b"].stateValues.fDefinitions[0],
      );
      let d6 = createFunctionFromDefinition(
        stateVariables["/d6"].stateValues.fDefinitions[0],
      );
      let d6b = createFunctionFromDefinition(
        stateVariables["/d6b"].stateValues.fDefinitions[0],
      );
      let d9 = createFunctionFromDefinition(
        stateVariables["/d9"].stateValues.fDefinitions[0],
      );
      let d10 = createFunctionFromDefinition(
        stateVariables["/d10"].stateValues.fDefinitions[0],
      );
      let d11 = createFunctionFromDefinition(
        stateVariables["/d11"].stateValues.fDefinitions[0],
      );
      let d12 = createFunctionFromDefinition(
        stateVariables["/d12"].stateValues.fDefinitions[0],
      );

      for (let i = 1; i <= 5; i++) {
        let x = i - 3;
        expect(d1(x)).closeTo(2 * x, 1e-10);
        expect(d2(x)).closeTo(2 * x, 1e-10);
        expect(d2b(x)).closeTo(2 * x, 1e-10);
        expect(d2c(x)).closeTo(2 * x, 1e-10);
        expect(d5(x)).closeTo(Math.cos(x), 1e-10);
        expect(d5b(x)).closeTo(Math.cos(x), 1e-10);
        expect(d6(x)).closeTo(2 * Math.exp(2 * x), 1e-10);
        expect(d6b(x)).closeTo(2 * Math.exp(2 * x), 1e-10);
        expect(d9(x)).closeTo(0, 1e-10);
        expect(d10(x)).closeTo(0, 1e-10);
        expect(d11(x)).closeTo(0, 1e-10);
        expect(d12(x)).closeTo(0, 1e-10);
      }
    });
  });

  it("specifying derivative variables of a function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p><aslist>
      <function name="f1" numInputs="3">sin(x+y^2)z</function>
      <function name="f2" variables="z y x">sin(x+y^2)z</function>
      <function name="f3" variables="x y">sin(x+y^2)z</function>
      <function name="f4" variables="x_1 x_2 x_3">sin(x_1+x_2^2)x_3</function>
      </aslist></p>

      <p><aslist>
      <derivative name="d11">$f1</derivative>
      <derivative name="d12" variable="z">$f1</derivative>
      <derivative name="d13" derivVariables="x">$f1</derivative>
      <derivative name="d14" derivVariable="z">$f1</derivative>
      <derivative name="d15" derivVariables="y z">$f1</derivative>
      <derivative name="d16" derivVariables="x x y">$f1</derivative>
      <derivative name="d17" derivVariable="u">$f1</derivative>
      <derivative name="d18" derivVariables="x x y" variables="z">$f1</derivative>
      </aslist></p>

      <p><aslist>
      <derivative name="d21">$f2</derivative>
      <derivative name="d22" variables="x">$f2</derivative>
      <derivative name="d23" derivVariable="x">$f2</derivative>
      <derivative name="d24" derivVariables="z">$f2</derivative>
      <derivative name="d25" derivVariables="y z">$f2</derivative>
      <derivative name="d26" derivVariables="x x y">$f2</derivative>
      <derivative name="d27" derivVariables="u">$f2</derivative>
      <derivative name="d28" derivVariables="x x y" variables="z">$f2</derivative>
      </aslist></p>

      <p><aslist>
      <derivative name="d31">$f3</derivative>
      <derivative name="d32" variables="z">$f3</derivative>
      <derivative name="d33" derivVariables="x">$f3</derivative>
      <derivative name="d34" derivVariable="z">$f3</derivative>
      <derivative name="d35" derivVariables="y z">$f3</derivative>
      <derivative name="d36" derivVariables="x x y">$f3</derivative>
      <derivative name="d37" derivVariable="u">$f3</derivative>
      <derivative name="d38" derivVariables="x x y" variables="z">$f3</derivative>
      </aslist></p>

      <p><aslist>
      <derivative name="d41">$f4</derivative>
      <derivative name="d42" derivVariables="x_1 x_2 x_3">$f4</derivative>
      <derivative name="d43" derivVariable="x">$f4</derivative>
      <derivative name="d44" derivVariables="x_1 x_2 x_3" variables="x_3 x_2 x_1">$f4</derivative>
      </aslist></p>

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        me
          .fromAst(stateVariables["/d11"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d11"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d11"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d12"].stateValues.formula)
          .equals(me.fromText("sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d12"].stateValues.variables).eqls(["z"]);
      expect(stateVariables["/d12"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/d13"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d13"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d13"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d14"].stateValues.formula)
          .equals(me.fromText("sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d14"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d14"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/d15"].stateValues.formula)
          .equals(me.fromText("2 y cos(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d15"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d15"].stateValues.derivVariables).eqls([
        "y",
        "z",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d16"].stateValues.formula)
          .equals(me.fromText("-2 y cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d16"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d16"].stateValues.derivVariables).eqls([
        "x",
        "x",
        "y",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d17"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(stateVariables["/d17"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d17"].stateValues.derivVariables).eqls(["u"]);

      expect(
        me
          .fromAst(stateVariables["/d18"].stateValues.formula)
          .equals(me.fromText("-2 y cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d18"].stateValues.variables).eqls(["z"]);
      expect(stateVariables["/d18"].stateValues.derivVariables).eqls([
        "x",
        "x",
        "y",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d21"].stateValues.formula)
          .equals(me.fromText("sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d21"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/d21"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/d22"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d22"].stateValues.variables).eqls(["x"]);
      expect(stateVariables["/d22"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d23"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d23"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/d23"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d24"].stateValues.formula)
          .equals(me.fromText("sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d24"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/d24"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/d25"].stateValues.formula)
          .equals(me.fromText("2 y cos(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d25"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/d25"].stateValues.derivVariables).eqls([
        "y",
        "z",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d26"].stateValues.formula)
          .equals(me.fromText("-2 y cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d26"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/d26"].stateValues.derivVariables).eqls([
        "x",
        "x",
        "y",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d27"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(stateVariables["/d27"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/d27"].stateValues.derivVariables).eqls(["u"]);

      expect(
        me
          .fromAst(stateVariables["/d28"].stateValues.formula)
          .equals(me.fromText("-2 y cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d28"].stateValues.variables).eqls(["z"]);
      expect(stateVariables["/d28"].stateValues.derivVariables).eqls([
        "x",
        "x",
        "y",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d31"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d31"].stateValues.variables).eqls(["x", "y"]);
      expect(stateVariables["/d31"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d32"].stateValues.formula)
          .equals(me.fromText("sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d32"].stateValues.variables).eqls(["z"]);
      expect(stateVariables["/d32"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/d33"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d33"].stateValues.variables).eqls(["x", "y"]);
      expect(stateVariables["/d33"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d34"].stateValues.formula)
          .equals(me.fromText("sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d34"].stateValues.variables).eqls(["x", "y"]);
      expect(stateVariables["/d34"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/d35"].stateValues.formula)
          .equals(me.fromText("2 y cos(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d35"].stateValues.variables).eqls(["x", "y"]);
      expect(stateVariables["/d35"].stateValues.derivVariables).eqls([
        "y",
        "z",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d36"].stateValues.formula)
          .equals(me.fromText("-2 y cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d36"].stateValues.variables).eqls(["x", "y"]);
      expect(stateVariables["/d36"].stateValues.derivVariables).eqls([
        "x",
        "x",
        "y",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d37"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(stateVariables["/d37"].stateValues.variables).eqls(["x", "y"]);
      expect(stateVariables["/d37"].stateValues.derivVariables).eqls(["u"]);

      expect(
        me
          .fromAst(stateVariables["/d38"].stateValues.formula)
          .equals(me.fromText("-2 y cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d38"].stateValues.variables).eqls(["z"]);
      expect(stateVariables["/d38"].stateValues.derivVariables).eqls([
        "x",
        "x",
        "y",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d41"].stateValues.formula)
          .equals(me.fromText("cos(x_1+x_2^2)x_3")),
      ).eq(true);
      expect(stateVariables["/d41"].stateValues.variables).eqls([
        ["_", "x", 1],
        ["_", "x", 2],
        ["_", "x", 3],
      ]);
      expect(stateVariables["/d41"].stateValues.derivVariables).eqls([
        ["_", "x", 1],
      ]);

      expect(
        me
          .fromAst(stateVariables["/d42"].stateValues.formula)
          .equals(me.fromText("-2 x_2 sin(x_1+x_2^2)")),
      ).eq(true);
      expect(stateVariables["/d42"].stateValues.variables).eqls([
        ["_", "x", 1],
        ["_", "x", 2],
        ["_", "x", 3],
      ]);
      expect(stateVariables["/d42"].stateValues.derivVariables).eqls([
        ["_", "x", 1],
        ["_", "x", 2],
        ["_", "x", 3],
      ]);

      expect(
        me
          .fromAst(stateVariables["/d43"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(stateVariables["/d43"].stateValues.variables).eqls([
        ["_", "x", 1],
        ["_", "x", 2],
        ["_", "x", 3],
      ]);
      expect(stateVariables["/d43"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d44"].stateValues.formula)
          .equals(me.fromText("-2 x_2 sin(x_1+x_2^2)")),
      ).eq(true);
      expect(stateVariables["/d44"].stateValues.variables).eqls([
        ["_", "x", 3],
        ["_", "x", 2],
        ["_", "x", 1],
      ]);
      expect(stateVariables["/d44"].stateValues.derivVariables).eqls([
        ["_", "x", 1],
        ["_", "x", 2],
        ["_", "x", 3],
      ]);
    });
  });

  it("specifying derivative variables of an expression", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <math name="m1">sin(x+y^2)z</math>
      <math name="m2">sin(x_1+x_2^2)x_3</math>
      <derivative name="d1">$m1</derivative>
      <derivative name="d2" variable="x">$m1</derivative>
      <derivative name="d3" variables="x y z">$m1</derivative>
      <derivative name="d4" variables="z y x">$m1</derivative>
      <derivative name="d5" derivVariables="x">$m1</derivative>
      <derivative name="d5a" derivVariable="x" variables="x y z">$m1</derivative>
      <derivative name="d6" derivVariables="x x">$m1</derivative>
      <derivative name="d6a" derivVariable="x"><derivative derivVariable="x">$m1</derivative></derivative>
      <derivative name="d6b" derivVariables="x" variables="x y z"><derivative derivVariables="x">$m1</derivative></derivative>
      <derivative name="d6c" derivVariables="x"><derivative derivVariable="x" variables="x y z">$m1</derivative></derivative>
      <derivative name="d6d" derivVariables="x x" variables="x y z">$m1</derivative>
      <derivative name="d7" derivVariables="x y">$m1</derivative>
      <derivative name="d7a" derivVariable="y"><derivative derivVariables="x">$m1</derivative></derivative>
      <derivative name="d7b" derivVariables="y" variables="x y z"><derivative derivVariable="x">$m1</derivative></derivative>
      <derivative name="d7c" derivVariable="y"><derivative derivVariables="x" variables="x y z">$m1</derivative></derivative>
      <derivative name="d8" derivVariables="x y z">$m1</derivative>
      <derivative name="d8a" derivVariables="z"><derivative derivVariable="y"><derivative derivVariables="x">$m1</derivative></derivative></derivative>
      <derivative name="d8b" derivVariable="z" variables="x y z"><derivative derivVariables="y"><derivative derivVariable="x">$m1</derivative></derivative></derivative>
      <derivative name="d8c" derivVariables="z"><derivative derivVariable="y"><derivative derivVariables="x" variables="x y z">$m1</derivative></derivative></derivative>
      <derivative name="d9" derivVariables="x y z x">$m1</derivative>
      <derivative name="d9a" derivVariables="x"><derivative derivVariables="z"><derivative derivVariables="y"><derivative derivVariables="x">$m1</derivative></derivative></derivative></derivative>
      <derivative name="d9b" derivVariable="x"><derivative derivVariable="z" variables="x y z"><derivative derivVariable="y"><derivative derivVariables="x">$m1</derivative></derivative></derivative></derivative>
      <derivative name="d9c" derivVariable="x"><derivative derivVariables="z"><derivative derivVariables="y" variables="x y z"><derivative derivVariables="x">$m1</derivative></derivative></derivative></derivative>
      <derivative name="d10" derivVariables="q">$m1</derivative>
      <derivative name="d11" derivVariable="y" variables="x y z">$m1</derivative>
      <derivative name="d12" derivVariables="y" variables="x z">$m1</derivative>


      <derivative name="d13" variables="x_1 x_2 x_3">$m2</derivative>
      <derivative name="d14" derivVariables="x_1 x_1">$m2</derivative>
      <derivative name="d15" derivVariables="x_1 x_1" variables="x_1 x_2 x_3">$m2</derivative>

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        me
          .fromAst(stateVariables["/d1"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d1"].stateValues.variables).eqls(["x"]);
      expect(stateVariables["/d1"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d2"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d2"].stateValues.variables).eqls(["x"]);
      expect(stateVariables["/d2"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d3"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d3"].stateValues.variables).eqls(["x", "y", "z"]);
      expect(stateVariables["/d3"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d4"].stateValues.formula)
          .equals(me.fromText("sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d4"].stateValues.variables).eqls(["z", "y", "x"]);
      expect(stateVariables["/d4"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/d5"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d5"].stateValues.variables).eqls(["x"]);
      expect(stateVariables["/d5"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d5a"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d5a"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d5a"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d6"].stateValues.formula)
          .equals(me.fromText("-sin(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d6"].stateValues.variables).eqls(["x"]);
      expect(stateVariables["/d6"].stateValues.derivVariables).eqls(["x", "x"]);

      expect(
        me
          .fromAst(stateVariables["/d6a"].stateValues.formula)
          .equals(me.fromText("-sin(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d6a"].stateValues.variables).eqls(["x"]);
      expect(stateVariables["/d6a"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d6b"].stateValues.formula)
          .equals(me.fromText("-sin(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d6b"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d6b"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d6c"].stateValues.formula)
          .equals(me.fromText("-sin(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d6c"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d6c"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d6d"].stateValues.formula)
          .equals(me.fromText("-sin(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d6d"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d6d"].stateValues.derivVariables).eqls([
        "x",
        "x",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d7"].stateValues.formula)
          .equals(me.fromText("-2 y sin(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d7"].stateValues.variables).eqls(["x", "y"]);
      expect(stateVariables["/d7"].stateValues.derivVariables).eqls(["x", "y"]);

      expect(
        me
          .fromAst(stateVariables["/d7a"].stateValues.formula)
          .equals(me.fromText("-2 y sin(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d7a"].stateValues.variables).eqls(["x"]);
      expect(stateVariables["/d7a"].stateValues.derivVariables).eqls(["y"]);

      expect(
        me
          .fromAst(stateVariables["/d7b"].stateValues.formula)
          .equals(me.fromText("-2 y sin(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d7b"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d7b"].stateValues.derivVariables).eqls(["y"]);

      expect(
        me
          .fromAst(stateVariables["/d7c"].stateValues.formula)
          .equals(me.fromText("-2 y sin(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d7c"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d7c"].stateValues.derivVariables).eqls(["y"]);

      expect(
        me
          .fromAst(stateVariables["/d8"].stateValues.formula)
          .equals(me.fromText("-2 y sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d8"].stateValues.variables).eqls(["x", "y", "z"]);
      expect(stateVariables["/d8"].stateValues.derivVariables).eqls([
        "x",
        "y",
        "z",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d8a"].stateValues.formula)
          .equals(me.fromText("-2 y sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d8a"].stateValues.variables).eqls(["x"]);
      expect(stateVariables["/d8a"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/d8b"].stateValues.formula)
          .equals(me.fromText("-2 y sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d8b"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d8b"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/d8c"].stateValues.formula)
          .equals(me.fromText("-2 y sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d8c"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d8c"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/d9"].stateValues.formula)
          .equals(me.fromText("-2 y cos(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d9"].stateValues.variables).eqls(["x", "y", "z"]);
      expect(stateVariables["/d9"].stateValues.derivVariables).eqls([
        "x",
        "y",
        "z",
        "x",
      ]);

      expect(
        me
          .fromAst(stateVariables["/d9a"].stateValues.formula)
          .equals(me.fromText("-2 y cos(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d9a"].stateValues.variables).eqls(["x"]);
      expect(stateVariables["/d9a"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d9b"].stateValues.formula)
          .equals(me.fromText("-2 y cos(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d9b"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d9b"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d9c"].stateValues.formula)
          .equals(me.fromText("-2 y cos(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/d9c"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d9c"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/d10"].stateValues.formula)
          .equals(me.fromText("0")),
      ).eq(true);
      expect(stateVariables["/d10"].stateValues.variables).eqls(["q"]);
      expect(stateVariables["/d10"].stateValues.derivVariables).eqls(["q"]);

      expect(
        me
          .fromAst(stateVariables["/d11"].stateValues.formula)
          .equals(me.fromText("2 y cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d11"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/d11"].stateValues.derivVariables).eqls(["y"]);

      expect(
        me
          .fromAst(stateVariables["/d12"].stateValues.formula)
          .equals(me.fromText("2 y cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/d12"].stateValues.variables).eqls(["x", "z"]);
      expect(stateVariables["/d12"].stateValues.derivVariables).eqls(["y"]);

      expect(
        me
          .fromAst(stateVariables["/d13"].stateValues.formula)
          .equals(me.fromText("cos(x_1+x_2^2)x_3")),
      ).eq(true);
      expect(stateVariables["/d13"].stateValues.variables).eqls([
        ["_", "x", 1],
        ["_", "x", 2],
        ["_", "x", 3],
      ]);
      expect(stateVariables["/d13"].stateValues.derivVariables).eqls([
        ["_", "x", 1],
      ]);

      expect(
        me
          .fromAst(stateVariables["/d14"].stateValues.formula)
          .equals(me.fromText("-sin(x_1+x_2^2)x_3")),
      ).eq(true);
      expect(stateVariables["/d14"].stateValues.variables).eqls([
        ["_", "x", 1],
      ]);
      expect(stateVariables["/d14"].stateValues.derivVariables).eqls([
        ["_", "x", 1],
        ["_", "x", 1],
      ]);

      expect(
        me
          .fromAst(stateVariables["/d15"].stateValues.formula)
          .equals(me.fromText("-sin(x_1+x_2^2)x_3")),
      ).eq(true);
      expect(stateVariables["/d15"].stateValues.variables).eqls([
        ["_", "x", 1],
        ["_", "x", 2],
        ["_", "x", 3],
      ]);
      expect(stateVariables["/d15"].stateValues.derivVariables).eqls([
        ["_", "x", 1],
        ["_", "x", 1],
      ]);
    });
  });

  it("derivative of function with changed variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <function name="f1" variables="x y z">sin(x+y^2)z</function>
      <function name="f2" variables="z y x">$f1</function>
      <function name="g1" variables="x_1 x_2 x_3">sin(x_1+x_2^2)x_3</function>
      <function name="g2" variables="x_3 x_2 x_1">$g1</function>
      <derivative name="df1">$f1</derivative>
      <derivative name="d2f1">$df1</derivative>
      <derivative name="df2">$f2</derivative>
      <derivative name="d2f2">$df2</derivative>
      <derivative name="dg1">$g1</derivative>
      <derivative name="d2g1">$dg1</derivative>
      <derivative name="dg2">$g2</derivative>
      <derivative name="d2g2">$dg2</derivative>

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        me
          .fromAst(stateVariables["/df1"].stateValues.formula)
          .equals(me.fromText("cos(x+y^2)z")),
      ).eq(true);
      expect(stateVariables["/df1"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/df1"].stateValues.derivVariables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/df2"].stateValues.formula)
          .equals(me.fromText("sin(x+y^2)")),
      ).eq(true);
      expect(stateVariables["/df2"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/df2"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/dg1"].stateValues.formula)
          .equals(me.fromText("cos(x_1+x_2^2)x_3")),
      ).eq(true);
      expect(stateVariables["/dg1"].stateValues.variables).eqls([
        ["_", "x", 1],
        ["_", "x", 2],
        ["_", "x", 3],
      ]);
      expect(stateVariables["/dg1"].stateValues.derivVariables).eqls([
        ["_", "x", 1],
      ]);

      expect(
        me
          .fromAst(stateVariables["/dg2"].stateValues.formula)
          .equals(me.fromText("sin(x_1+x_2^2)")),
      ).eq(true);
      expect(stateVariables["/dg2"].stateValues.variables).eqls([
        ["_", "x", 3],
        ["_", "x", 2],
        ["_", "x", 1],
      ]);
      expect(stateVariables["/dg2"].stateValues.derivVariables).eqls([
        ["_", "x", 3],
      ]);
    });
  });

  it("derivative of function with changed variables, convert to single variable function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <function name="f1" variables="x y z">sin(x)z</function>
      <function name="f2" variables="z y x">$f1.formula</function>
      <function name="f3" variables="x y z">sin(x)yz</function>
      <function name="f4" variables="z y x">$f3.formula</function>
      
      <derivative derivvariables="z" name="df1" >$f1</derivative>
      <derivative name="df2">$f2</derivative>
      <function variable="x" name="df2a">$df2.formula</function>
      <derivative derivvariables="z y" name="df3zy">$f3</derivative>
      <derivative derivvariable="y" name="df3y">$f3</derivative>
      <derivative derivvariables="z" name="df3zya">$df3y</derivative>
      <derivative derivvariables="z y" name="df4zy">$f4</derivative>
      <derivative name="df4z">$f4</derivative>
      <derivative derivvariable="y" name="df4yz">$df4z</derivative>
      <function variables="x" name="df4zya">$df4zy.formula</function>
      <function variable="x" name="df4yza">$df4yz.formula</function>
      
      <graph>
        $df2a
      </graph>
      
      <graph>
        $df4zya
      </graph>
      
      <graph>
        $df4yza
      </graph>

      <map assignNames="t1 t2 t3">
        <template newNamespace>
          <p><aslist>
          <evaluate function="$(../df1)" input="$v 0 0" name="df1" />
          <evaluate function="$(../df2a)" input="$v" name="df2a" />
          <evaluate function="$(../df3zy)" input="$v 0 0" name="df3zy" />
          <evaluate function="$(../df3zya)" input="$v 0 0" name="df3zya" />
          <evaluate function="$(../df4zya)" input="$v" name="df4zya" />
          <evaluate function="$(../df4yza)" input="$v" name="df4yza" />
          <evaluate forceNumeric displayDigits="3" function="$(../df1)" input="$v 0 0" name="df1n" />
          <evaluate forceNumeric displayDigits="3" function="$(../df2a)" input="$v" name="df2an" />
          <evaluate forceNumeric displayDigits="3" function="$(../df3zy)" input="$v 0 0" name="df3zyn" />
          <evaluate forceNumeric displayDigits="3" function="$(../df3zya)" input="$v 0 0" name="df3zyan" />
          <evaluate forceNumeric displayDigits="3" function="$(../df4zya)" input="$v" name="df4zyan" />
          <evaluate forceNumeric displayDigits="3" function="$(../df4yza)" input="$v" name="df4yzan" />
          </aslist></p>
        </template>
        <sources alias="v"><sequence from="-2" to="2" step="2" /></sources>
      </map>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        me
          .fromAst(stateVariables["/df1"].stateValues.formula)
          .equals(me.fromText("sin(x)")),
      ).eq(true);
      expect(stateVariables["/df1"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/df1"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/df2"].stateValues.formula)
          .equals(me.fromText("sin(x)")),
      ).eq(true);
      expect(stateVariables["/df2"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/df2"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/df2a"].stateValues.formula)
          .equals(me.fromText("sin(x)")),
      ).eq(true);
      expect(stateVariables["/df2a"].stateValues.variables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/df3zy"].stateValues.formula)
          .equals(me.fromText("sin(x)")),
      ).eq(true);
      expect(stateVariables["/df3zy"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/df3zy"].stateValues.derivVariables).eqls([
        "z",
        "y",
      ]);

      expect(
        me
          .fromAst(stateVariables["/df3y"].stateValues.formula)
          .equals(me.fromText("sin(x)z")),
      ).eq(true);
      expect(stateVariables["/df3y"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/df3y"].stateValues.derivVariables).eqls(["y"]);

      expect(
        me
          .fromAst(stateVariables["/df3zya"].stateValues.formula)
          .equals(me.fromText("sin(x)")),
      ).eq(true);
      expect(stateVariables["/df3zya"].stateValues.variables).eqls([
        "x",
        "y",
        "z",
      ]);
      expect(stateVariables["/df3zya"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/df4zy"].stateValues.formula)
          .equals(me.fromText("sin(x)")),
      ).eq(true);
      expect(stateVariables["/df4zy"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/df4zy"].stateValues.derivVariables).eqls([
        "z",
        "y",
      ]);

      expect(
        me
          .fromAst(stateVariables["/df4z"].stateValues.formula)
          .equals(me.fromText("sin(x)y")),
      ).eq(true);
      expect(stateVariables["/df4z"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/df4z"].stateValues.derivVariables).eqls(["z"]);

      expect(
        me
          .fromAst(stateVariables["/df4yz"].stateValues.formula)
          .equals(me.fromText("sin(x)")),
      ).eq(true);
      expect(stateVariables["/df4yz"].stateValues.variables).eqls([
        "z",
        "y",
        "x",
      ]);
      expect(stateVariables["/df4yz"].stateValues.derivVariables).eqls(["y"]);

      expect(
        me
          .fromAst(stateVariables["/df4zya"].stateValues.formula)
          .equals(me.fromText("sin(x)")),
      ).eq(true);
      expect(stateVariables["/df4zya"].stateValues.variables).eqls(["x"]);

      expect(
        me
          .fromAst(stateVariables["/df4yza"].stateValues.formula)
          .equals(me.fromText("sin(x)")),
      ).eq(true);
      expect(stateVariables["/df4yza"].stateValues.variables).eqls(["x"]);

      expect(stateVariables["/t1/df1"].stateValues.value).eqls([
        "apply",
        "sin",
        -2,
      ]);
      expect(stateVariables["/t1/df2a"].stateValues.value).eqls([
        "apply",
        "sin",
        -2,
      ]);
      expect(stateVariables["/t1/df3zy"].stateValues.value).eqls([
        "apply",
        "sin",
        -2,
      ]);
      expect(stateVariables["/t1/df3zya"].stateValues.value).eqls([
        "apply",
        "sin",
        -2,
      ]);
      expect(stateVariables["/t1/df4zya"].stateValues.value).eqls([
        "apply",
        "sin",
        -2,
      ]);
      expect(stateVariables["/t1/df4yza"].stateValues.value).eqls([
        "apply",
        "sin",
        -2,
      ]);
      expect(stateVariables["/t1/df1n"].stateValues.value).closeTo(
        Math.sin(-2),
        1e-10,
      );
      expect(stateVariables["/t1/df2an"].stateValues.value).closeTo(
        Math.sin(-2),
        1e-10,
      );
      expect(stateVariables["/t1/df3zyn"].stateValues.value).closeTo(
        Math.sin(-2),
        1e-10,
      );
      expect(stateVariables["/t1/df3zyan"].stateValues.value).closeTo(
        Math.sin(-2),
        1e-10,
      );
      expect(stateVariables["/t1/df4zyan"].stateValues.value).closeTo(
        Math.sin(-2),
        1e-10,
      );
      expect(stateVariables["/t1/df4yzan"].stateValues.value).closeTo(
        Math.sin(-2),
        1e-10,
      );

      expect(stateVariables["/t2/df1"].stateValues.value).eq(0);
      expect(stateVariables["/t2/df2a"].stateValues.value).eq(0);
      expect(stateVariables["/t2/df3zy"].stateValues.value).eq(0);
      expect(stateVariables["/t2/df3zya"].stateValues.value).eq(0);
      expect(stateVariables["/t2/df4zya"].stateValues.value).eq(0);
      expect(stateVariables["/t2/df4yza"].stateValues.value).eq(0);
      expect(stateVariables["/t2/df1n"].stateValues.value).closeTo(0, 1e-10);
      expect(stateVariables["/t2/df2an"].stateValues.value).closeTo(0, 1e-10);
      expect(stateVariables["/t2/df3zyn"].stateValues.value).closeTo(0, 1e-10);
      expect(stateVariables["/t2/df3zyan"].stateValues.value).closeTo(0, 1e-10);
      expect(stateVariables["/t2/df4zyan"].stateValues.value).closeTo(0, 1e-10);
      expect(stateVariables["/t2/df4yzan"].stateValues.value).closeTo(0, 1e-10);

      expect(stateVariables["/t3/df1"].stateValues.value).eqls([
        "apply",
        "sin",
        2,
      ]);
      expect(stateVariables["/t3/df2a"].stateValues.value).eqls([
        "apply",
        "sin",
        2,
      ]);
      expect(stateVariables["/t3/df3zy"].stateValues.value).eqls([
        "apply",
        "sin",
        2,
      ]);
      expect(stateVariables["/t3/df3zya"].stateValues.value).eqls([
        "apply",
        "sin",
        2,
      ]);
      expect(stateVariables["/t3/df4zya"].stateValues.value).eqls([
        "apply",
        "sin",
        2,
      ]);
      expect(stateVariables["/t3/df4yza"].stateValues.value).eqls([
        "apply",
        "sin",
        2,
      ]);
      expect(stateVariables["/t3/df1n"].stateValues.value).closeTo(
        Math.sin(2),
        1e-10,
      );
      expect(stateVariables["/t3/df2an"].stateValues.value).closeTo(
        Math.sin(2),
        1e-10,
      );
      expect(stateVariables["/t3/df3zyn"].stateValues.value).closeTo(
        Math.sin(2),
        1e-10,
      );
      expect(stateVariables["/t3/df3zyan"].stateValues.value).closeTo(
        Math.sin(2),
        1e-10,
      );
      expect(stateVariables["/t3/df4zyan"].stateValues.value).closeTo(
        Math.sin(2),
        1e-10,
      );
      expect(stateVariables["/t3/df4yzan"].stateValues.value).closeTo(
        Math.sin(2),
        1e-10,
      );

      let df1 = createFunctionFromDefinition(
        stateVariables["/df1"].stateValues.fDefinitions[0],
      );
      let df2a = createFunctionFromDefinition(
        stateVariables["/df2a"].stateValues.fDefinitions[0],
      );
      let df3zy = createFunctionFromDefinition(
        stateVariables["/df3zy"].stateValues.fDefinitions[0],
      );
      let df3zya = createFunctionFromDefinition(
        stateVariables["/df3zya"].stateValues.fDefinitions[0],
      );
      let df4zya = createFunctionFromDefinition(
        stateVariables["/df4zya"].stateValues.fDefinitions[0],
      );
      let df4yza = createFunctionFromDefinition(
        stateVariables["/df4yza"].stateValues.fDefinitions[0],
      );

      for (let i = 1; i <= 21; i++) {
        let x = 0.2 * (i - 11);
        expect(df1(x, 0, 0)).closeTo(Math.sin(x), 1e-10);
        expect(df2a(x)).closeTo(Math.sin(x), 1e-10);
        expect(df3zy(x, 0, 0)).closeTo(Math.sin(x), 1e-10);
        expect(df3zya(x, 0, 0)).closeTo(Math.sin(x), 1e-10);
        expect(df4zya(x)).closeTo(Math.sin(x), 1e-10);
        expect(df4yza(x)).closeTo(Math.sin(x), 1e-10);
      }
    });
  });

  it("derivative with empty variables attribute", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <derivative name="d1" variables="">x^2</derivative>

      <graph>
        $d1
      </graph>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        me
          .fromAst(stateVariables["/d1"].stateValues.formula)
          .equals(me.fromText("2x")),
      ).eq(true);
      expect(stateVariables["/d1"].stateValues.variables).eqls(["x"]);
      expect(stateVariables["/d1"].stateValues.derivVariables).eqls(["x"]);

      let d1 = createFunctionFromDefinition(
        stateVariables["/d1"].stateValues.fDefinitions[0],
      );

      for (let i = 1; i <= 21; i++) {
        let x = 0.2 * (i - 11);
        expect(d1(x)).closeTo(2 * x, 1e-10);
      }
    });
  });

  it("derivatives of vector-valued functions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <function name="f1">(sin(x), cos(x))</function>
      <function name="f2" variables="y">(e^(2y), y, log(y))</function>
      <function name="f3">(xyz, xy, xz, yz)</function>
      <function name="f4" variable="z">(xyz, xy, xz, yz)</function>
      <derivative name="d1"><function>(x^2, x^3)</function></derivative>
      <derivative name="d2"><math name="x2">(x^2, x^3)</math></derivative>
      <derivative name="d2b">$x2</derivative>
      <derivative name="d2c"><copy source="x2" /></derivative>
      <derivative name="d3"><function>(x^2sin(z), z^2sin(x))</function></derivative>
      <derivative name="d4" variables="z">(x^2sin(z),z^2sin(x))</derivative>
      <math name='var'>z</math><number name="a">2</number>
      <derivative name="d4b" variable="$var">(x^$a sin($var), $var^$a sin(x))</derivative>
      <derivative name="d5"><copy source="f1" /></derivative>
      <derivative name="d5b">$f1</derivative>
      <derivative name="d6"><copy source="f2" /></derivative>
      <derivative name="d6b">$f2</derivative>
      <derivative name="d7"><copy source="f3" /></derivative>
      <derivative name="d7b">$f3</derivative>
      <derivative name="d8"><copy source="f4" /></derivative>
      <derivative name="d8b">$f4</derivative>
      <derivative variables="q" name="d9"><copy source="f1" /></derivative>
      <derivative variable="q" name="d10"><copy source="f2" /></derivative>
      <derivative variables="q" name="d11"><copy source="f3" /></derivative>
      <derivative variable="q" name="d12"><copy source="f4" /></derivative>
      <derivative variables="y" name="d13"><copy source="f3" /></derivative>
      <derivative variable="y" name="d14"><copy source="f4" /></derivative>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        me
          .fromAst(stateVariables["/d1"].stateValues.formula)
          .equals(me.fromText("(2x,3x^2)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d2"].stateValues.formula)
          .equals(me.fromText("(2x,3x^2)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d2b"].stateValues.formula)
          .equals(me.fromText("(2x,3x^2)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d2c"].stateValues.formula)
          .equals(me.fromText("(2x,3x^2)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d3"].stateValues.formula)
          .equals(me.fromText("(2x sin(z), z^2 cos(x))")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d4"].stateValues.formula)
          .equals(me.fromText("(x^2cos(z), 2z sin(x))")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d4b"].stateValues.formula)
          .equals(me.fromText("(x^2cos(z), 2z sin(x))")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d5"].stateValues.formula)
          .equals(me.fromText("(cos(x),-sin(x))")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d5b"].stateValues.formula)
          .equals(me.fromText("(cos(x), -sin(x))")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d6"].stateValues.formula)
          .equals(me.fromText("(2e^(2y),1,1/y)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d6b"].stateValues.formula)
          .equals(me.fromText("(2e^(2y),1,1/y)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d7"].stateValues.formula)
          .equals(me.fromText("(yz, y, z, 0)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d7b"].stateValues.formula)
          .equals(me.fromText("(yz, y, z, 0)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d8"].stateValues.formula)
          .equals(me.fromText("(xy, 0, x, y)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d8b"].stateValues.formula)
          .equals(me.fromText("(xy, 0, x, y)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d9"].stateValues.formula)
          .equals(me.fromText("(0,0)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d10"].stateValues.formula)
          .equals(me.fromText("(0,0,0)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d11"].stateValues.formula)
          .equals(me.fromText("(0,0,0,0)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d12"].stateValues.formula)
          .equals(me.fromText("(0,0,0,0)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d13"].stateValues.formula)
          .equals(me.fromText("(xz,x,0,z)")),
      ).eq(true);
      expect(
        me
          .fromAst(stateVariables["/d14"].stateValues.formula)
          .equals(me.fromText("(xz,x,0,z)")),
      ).eq(true);

      let d1_1 = createFunctionFromDefinition(
        stateVariables["/d1"].stateValues.fDefinitions[0],
      );
      let d1_2 = createFunctionFromDefinition(
        stateVariables["/d1"].stateValues.fDefinitions[1],
      );
      let d2_1 = createFunctionFromDefinition(
        stateVariables["/d2"].stateValues.fDefinitions[0],
      );
      let d2_2 = createFunctionFromDefinition(
        stateVariables["/d2"].stateValues.fDefinitions[1],
      );
      let d2b_1 = createFunctionFromDefinition(
        stateVariables["/d2b"].stateValues.fDefinitions[0],
      );
      let d2b_2 = createFunctionFromDefinition(
        stateVariables["/d2b"].stateValues.fDefinitions[1],
      );
      let d2c_1 = createFunctionFromDefinition(
        stateVariables["/d2c"].stateValues.fDefinitions[0],
      );
      let d2c_2 = createFunctionFromDefinition(
        stateVariables["/d2c"].stateValues.fDefinitions[1],
      );
      let d5_1 = createFunctionFromDefinition(
        stateVariables["/d5"].stateValues.fDefinitions[0],
      );
      let d5_2 = createFunctionFromDefinition(
        stateVariables["/d5"].stateValues.fDefinitions[1],
      );
      let d5b_1 = createFunctionFromDefinition(
        stateVariables["/d5b"].stateValues.fDefinitions[0],
      );
      let d5b_2 = createFunctionFromDefinition(
        stateVariables["/d5b"].stateValues.fDefinitions[1],
      );
      let d6_1 = createFunctionFromDefinition(
        stateVariables["/d6"].stateValues.fDefinitions[0],
      );
      let d6_2 = createFunctionFromDefinition(
        stateVariables["/d6"].stateValues.fDefinitions[1],
      );
      let d6_3 = createFunctionFromDefinition(
        stateVariables["/d6"].stateValues.fDefinitions[2],
      );
      let d6b_1 = createFunctionFromDefinition(
        stateVariables["/d6b"].stateValues.fDefinitions[0],
      );
      let d6b_2 = createFunctionFromDefinition(
        stateVariables["/d6b"].stateValues.fDefinitions[1],
      );
      let d6b_3 = createFunctionFromDefinition(
        stateVariables["/d6b"].stateValues.fDefinitions[2],
      );
      let d9_1 = createFunctionFromDefinition(
        stateVariables["/d9"].stateValues.fDefinitions[0],
      );
      let d9_2 = createFunctionFromDefinition(
        stateVariables["/d9"].stateValues.fDefinitions[1],
      );
      let d10_1 = createFunctionFromDefinition(
        stateVariables["/d10"].stateValues.fDefinitions[0],
      );
      let d10_2 = createFunctionFromDefinition(
        stateVariables["/d10"].stateValues.fDefinitions[1],
      );
      let d10_3 = createFunctionFromDefinition(
        stateVariables["/d10"].stateValues.fDefinitions[2],
      );
      let d11_1 = createFunctionFromDefinition(
        stateVariables["/d11"].stateValues.fDefinitions[0],
      );
      let d11_2 = createFunctionFromDefinition(
        stateVariables["/d11"].stateValues.fDefinitions[1],
      );
      let d11_3 = createFunctionFromDefinition(
        stateVariables["/d11"].stateValues.fDefinitions[2],
      );
      let d11_4 = createFunctionFromDefinition(
        stateVariables["/d11"].stateValues.fDefinitions[3],
      );
      let d12_1 = createFunctionFromDefinition(
        stateVariables["/d12"].stateValues.fDefinitions[0],
      );
      let d12_2 = createFunctionFromDefinition(
        stateVariables["/d12"].stateValues.fDefinitions[1],
      );
      let d12_3 = createFunctionFromDefinition(
        stateVariables["/d12"].stateValues.fDefinitions[2],
      );
      let d12_4 = createFunctionFromDefinition(
        stateVariables["/d12"].stateValues.fDefinitions[3],
      );

      for (let i = 1; i <= 21; i++) {
        let x = 0.2 * (i - 11);
        expect(d1_1(x)).closeTo(2 * x, 1e-10);
        expect(d1_2(x)).closeTo(3 * x ** 2, 1e-10);
        expect(d2_1(x)).closeTo(2 * x, 1e-10);
        expect(d2_2(x)).closeTo(3 * x ** 2, 1e-10);
        expect(d2b_1(x)).closeTo(2 * x, 1e-10);
        expect(d2b_2(x)).closeTo(3 * x ** 2, 1e-10);
        expect(d2c_1(x)).closeTo(2 * x, 1e-10);
        expect(d2c_2(x)).closeTo(3 * x ** 2, 1e-10);
        expect(d5_1(x)).closeTo(Math.cos(x), 1e-10);
        expect(d5_2(x)).closeTo(-Math.sin(x), 1e-10);
        expect(d5b_1(x)).closeTo(Math.cos(x), 1e-10);
        expect(d5b_2(x)).closeTo(-Math.sin(x), 1e-10);
        expect(d6_1(x)).closeTo(2 * Math.exp(2 * x), 1e-10);
        expect(d6_2(x)).closeTo(1, 1e-10);
        if (x === 0) {
          expect(d6_3(x)).eq(Infinity);
        } else {
          expect(d6_3(x)).closeTo(1 / x, 1e-10);
        }
        expect(d6b_1(x)).closeTo(2 * Math.exp(2 * x), 1e-10);
        expect(d6b_2(x)).closeTo(1, 1e-10);
        if (x === 0) {
          expect(d6b_3(x)).eq(Infinity);
        } else {
          expect(d6b_3(x)).closeTo(1 / x, 1e-10);
        }
        expect(d9_1(x)).closeTo(0, 1e-10);
        expect(d9_2(x)).closeTo(0, 1e-10);
        expect(d10_1(x)).closeTo(0, 1e-10);
        expect(d10_2(x)).closeTo(0, 1e-10);
        expect(d10_3(x)).closeTo(0, 1e-10);
        expect(d11_1(x)).closeTo(0, 1e-10);
        expect(d11_2(x)).closeTo(0, 1e-10);
        expect(d11_3(x)).closeTo(0, 1e-10);
        expect(d11_4(x)).closeTo(0, 1e-10);
        expect(d12_1(x)).closeTo(0, 1e-10);
        expect(d12_2(x)).closeTo(0, 1e-10);
        expect(d12_3(x)).closeTo(0, 1e-10);
        expect(d12_4(x)).closeTo(0, 1e-10);
      }
    });
  });

  // check to make sure fixed bug where wasn't displaying inside <m>
  it("derivative displayed inside <m>", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>Let <m>f(x) = <function name="f">sin(x)</function></m>.  
      Then <m>f'(x) = <derivative><copy target="f" /></derivative></m>.</p>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f(x)=sin(x)");
      });

    cy.get(cesc("#\\/_m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f′(x)=cos(x)");
      });
  });

  it("derivatives of interpolated function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <graph>
        <function minima='(3,4)' />
        <derivative><copy target="_function1"/></derivative>
        <derivative><copy target="_derivative1"/></derivative>
        <derivative><copy target="_derivative2"/></derivative>
        <derivative><copy target="_derivative3"/></derivative>
        <derivative><copy target="_derivative4"/></derivative>
        <derivative><copy target="_derivative5"/></derivative>
      </graph>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f1 = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      let d1 = createFunctionFromDefinition(
        stateVariables["/_derivative1"].stateValues.fDefinitions[0],
      );
      let d2 = createFunctionFromDefinition(
        stateVariables["/_derivative2"].stateValues.fDefinitions[0],
      );
      let d3 = createFunctionFromDefinition(
        stateVariables["/_derivative3"].stateValues.fDefinitions[0],
      );
      let d4 = createFunctionFromDefinition(
        stateVariables["/_derivative4"].stateValues.fDefinitions[0],
      );
      let d5 = createFunctionFromDefinition(
        stateVariables["/_derivative5"].stateValues.fDefinitions[0],
      );
      let d6 = createFunctionFromDefinition(
        stateVariables["/_derivative6"].stateValues.fDefinitions[0],
      );

      for (let x = -10; x <= 10; x += 0.5) {
        expect(f1(x)).eq((x - 3) ** 2 + 4);
        expect(d1(x)).eq(2 * (x - 3));
        expect(d2(x)).eq(2);
        expect(d3(x)).eq(0);
        expect(d4(x)).eq(0);
        expect(d5(x)).eq(0);
        expect(d6(x)).eq(0);
      }
    });
  });

  it("derivatives of interpolated function that is not a function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <function through='(3,4) (3,5)' name="f" />
    <derivative name="df">$f</derivative>
  </graph>

  <math name="m1">f(3) = $$f(3)</math>
  <math name="m2">f'(3) = $$df(3)</math>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "f(3)=NaN");
    cy.get(cesc("#\\/m2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "f′(3)=NaN");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      let df = createFunctionFromDefinition(
        stateVariables["/df"].stateValues.fDefinitions[0],
      );
      expect(f(3)).eqls(NaN);
      expect(df(3)).eqls(NaN);
    });
  });

  it("derivatives of interpolated function 2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <graph>
        <function minima="(3,4)" through="(-1,5) (4,2)" maxima="(1,0)" />
        <derivative stylenumber="2"><copy target="_function1"/></derivative>
        <derivative stylenumber="3"><copy target="_derivative1"/></derivative>
        <derivative stylenumber="4"><copy target="_derivative2"/></derivative>
        <derivative stylenumber="5"><copy target="_derivative3"/></derivative>
      </graph>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let dx = 0.0001;

      let f = createFunctionFromDefinition(
        stateVariables["/_function1"].stateValues.fDefinitions[0],
      );
      let d1 = createFunctionFromDefinition(
        stateVariables["/_derivative1"].stateValues.fDefinitions[0],
      );
      let d2 = createFunctionFromDefinition(
        stateVariables["/_derivative2"].stateValues.fDefinitions[0],
      );
      let d3 = createFunctionFromDefinition(
        stateVariables["/_derivative3"].stateValues.fDefinitions[0],
      );
      let d4 = createFunctionFromDefinition(
        stateVariables["/_derivative4"].stateValues.fDefinitions[0],
      );

      // make sure we don't get within dx of a grid point
      for (let x = -10.02412412; x <= 10; x += 0.5) {
        let f0 = f(x);
        let f1 = f(x + dx);
        let fp05 = d1(x + dx / 2);
        expect(fp05).closeTo((f1 - f0) / dx, 1e-6);

        let fpn05 = d1(x - dx / 2);
        let fpp0 = d2(x);
        expect(fpp0).closeTo((fp05 - fpn05) / dx, 1e-6);

        let fpp1 = d2(x + dx);
        let fppp05 = d3(x + dx / 2);
        expect(fppp05).closeTo((fpp1 - fpp0) / dx, 1e-6);

        let fpppn05 = d3(x - dx / 2);
        let fpppp0 = d4(x);
        expect(fpppp0).closeTo((fppp05 - fpppn05) / dx, 1e-6);
      }
    });
  });

  it("derivatives of interpolated function specified with variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <function name="f" variables="x" maxima="(5,-3)" minima="(-5,3)" />
      <function name="g" styleNumber="2" variable="y" minima="(3,-9)" maxima="(-3,9)" />
    
      <derivative name="df1">$f</derivative>
      <derivative name="dg1" styleNumber="2">$g</derivative>
    
      <derivative name="df1b" derivVariables="x">$f</derivative>
      <derivative name="zero1" derivVariable="x" styleNumber="2">$g</derivative>
    
      <derivative name="zero2" derivVariables="y">$f</derivative>
      <derivative name="dg1b" derivVariable="y" styleNumber="2">$g</derivative>
    
      <derivative name="df2" derivVariables="x x">$f</derivative>
      <derivative name="dg2" derivVariables="y y" styleNumber="2">$g</derivative>

      <derivative name="zero3" derivVariables="x y">$f</derivative>
      <derivative name="zero4" derivVariables="x y" styleNumber="2">$g</derivative>

      <derivative name="zero5" derivVariables="y x">$f</derivative>
      <derivative name="zero6" derivVariables="y x" styleNumber="2">$g</derivative>

      <derivative name="df3" derivVariables="x x x">$f</derivative>
      <derivative name="dg3" derivVariables="y y y" styleNumber="2">$g</derivative>
    
      <derivative name="df4" derivVariables="x x x x">$f</derivative>
      <derivative name="dg4" derivVariables="y y y y" styleNumber="2">$g</derivative>
      
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let dx = 0.0001;

      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      let df1 = createFunctionFromDefinition(
        stateVariables["/df1"].stateValues.fDefinitions[0],
      );
      let df1b = createFunctionFromDefinition(
        stateVariables["/df1b"].stateValues.fDefinitions[0],
      );
      let df2 = createFunctionFromDefinition(
        stateVariables["/df2"].stateValues.fDefinitions[0],
      );
      let df3 = createFunctionFromDefinition(
        stateVariables["/df3"].stateValues.fDefinitions[0],
      );
      let df4 = createFunctionFromDefinition(
        stateVariables["/df4"].stateValues.fDefinitions[0],
      );
      let g = createFunctionFromDefinition(
        stateVariables["/g"].stateValues.fDefinitions[0],
      );
      let dg1 = createFunctionFromDefinition(
        stateVariables["/dg1"].stateValues.fDefinitions[0],
      );
      let dg1b = createFunctionFromDefinition(
        stateVariables["/dg1b"].stateValues.fDefinitions[0],
      );
      let dg2 = createFunctionFromDefinition(
        stateVariables["/dg2"].stateValues.fDefinitions[0],
      );
      let dg3 = createFunctionFromDefinition(
        stateVariables["/dg3"].stateValues.fDefinitions[0],
      );
      let dg4 = createFunctionFromDefinition(
        stateVariables["/dg4"].stateValues.fDefinitions[0],
      );
      let zero1 = createFunctionFromDefinition(
        stateVariables["/zero1"].stateValues.fDefinitions[0],
      );
      let zero2 = createFunctionFromDefinition(
        stateVariables["/zero2"].stateValues.fDefinitions[0],
      );
      let zero3 = createFunctionFromDefinition(
        stateVariables["/zero3"].stateValues.fDefinitions[0],
      );
      let zero4 = createFunctionFromDefinition(
        stateVariables["/zero4"].stateValues.fDefinitions[0],
      );
      let zero5 = createFunctionFromDefinition(
        stateVariables["/zero5"].stateValues.fDefinitions[0],
      );
      let zero6 = createFunctionFromDefinition(
        stateVariables["/zero6"].stateValues.fDefinitions[0],
      );

      // make sure we don't get within dx of a grid point
      for (let x = -10.02412412; x <= 10; x += 0.5) {
        let f_0 = f(x);
        let f_1 = f(x + dx);
        let df1_05 = df1(x + dx / 2);
        let df1b_05 = df1b(x + dx / 2);
        expect(df1_05).closeTo((f_1 - f_0) / dx, 1e-6);
        expect(df1b_05).eq(df1_05);

        let g_0 = g(x);
        let g_1 = g(x + dx);
        let dg1_05 = dg1(x + dx / 2);
        let dg1b_05 = dg1b(x + dx / 2);
        expect(dg1_05).closeTo((g_1 - g_0) / dx, 1e-6);
        expect(dg1b_05).eq(dg1_05);

        let df1_n05 = df1(x - dx / 2);
        let df2_0 = df2(x);
        expect(df2_0).closeTo((df1b_05 - df1_n05) / dx, 1e-6);

        let dg1_n05 = dg1(x - dx / 2);
        let dg2_0 = dg2(x);
        expect(dg2_0).closeTo((dg1b_05 - dg1_n05) / dx, 1e-6);

        let df2_1 = df2(x + dx);
        let df3_05 = df3(x + dx / 2);
        expect(df3_05).closeTo((df2_1 - df2_0) / dx, 1e-6);

        let dg2_1 = dg2(x + dx);
        let dg3_05 = dg3(x + dx / 2);
        expect(dg3_05).closeTo((dg2_1 - dg2_0) / dx, 1e-6);

        let df3_n05 = df3(x - dx / 2);
        let df4_0 = df4(x);
        expect(df4_0).closeTo((df3_05 - df3_n05) / dx, 1e-6);

        let dg3_n05 = dg3(x - dx / 2);
        let dg4_0 = dg4(x);
        expect(dg4_0).closeTo((dg3_05 - dg3_n05) / dx, 1e-6);

        expect(zero1(x)).eq(0);
        expect(zero2(x)).eq(0);
        expect(zero3(x)).eq(0);
        expect(zero4(x)).eq(0);
        expect(zero5(x)).eq(0);
        expect(zero6(x)).eq(0);
      }
    });
  });

  it("derivatives of interpolated function with changed variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <function name="f" variables="x" maxima="(5,-3)" minima="(-5,3)" />
      <function name="g" styleNumber="2" variable="y" >$f</function>
      <function name="h" styleNumber="3" variables="z" >$g</function>
    
      <derivative name="df1">$f</derivative>
      <derivative name="dg1" styleNumber="2">$g</derivative>
      <derivative name="dh1" styleNumber="3">$h</derivative>
    
      <derivative name="df1b" derivVariable="x">$f</derivative>
      <derivative name="zero1" derivVariables="x" styleNumber="2">$g</derivative>
      <derivative name="zero2" derivVariable="x" styleNumber="3">$h</derivative>
    
      <derivative name="zero3" derivVariables="y">$f</derivative>
      <derivative name="dg1b" derivVariable="y" styleNumber="2">$g</derivative>
      <derivative name="zero4" derivVariables="y" styleNumber="3">$h</derivative>
    
      <derivative name="zero5" derivVariable="z">$f</derivative>
      <derivative name="zero6" derivVariables="z" styleNumber="2">$g</derivative>
      <derivative name="dh1b" derivVariable="z" styleNumber="3">$h</derivative>

      <derivative name="df2" derivVariables="x x">$f</derivative>
      <derivative name="dg2" derivVariables="y y" styleNumber="2">$g</derivative>
      <derivative name="dh2" derivVariables="z z" styleNumber="3">$h</derivative>
    
      <derivative name="df2b" derivVariable="x"><derivative derivVariable="x">$f</derivative></derivative>
      <derivative name="dg2b" derivVariables="y" styleNumber="2"><derivative derivVariables="y">$g</derivative></derivative>
      <derivative name="dh2b" derivVariables="z" styleNumber="3"><derivative derivVariable="z">$h</derivative></derivative>

      <derivative name="zero7" derivVariables="x y">$f</derivative>
      <derivative name="zero8" derivVariables="x y" styleNumber="2">$g</derivative>
      <derivative name="zero9" derivVariables="x y" styleNumber="3">$h</derivative>

      <derivative name="zero10" derivVariables="y x">$f</derivative>
      <derivative name="zero11" derivVariables="y x" styleNumber="2">$g</derivative>
      <derivative name="zero12" derivVariables="y x" styleNumber="3">$h</derivative>

      <derivative name="df3" derivVariables="x x x">$f</derivative>
      <derivative name="dg3" derivVariables="y y y" styleNumber="2">$g</derivative>
      <derivative name="dh3" derivVariables="z z z" styleNumber="2">$h</derivative>
    
      <derivative name="df4" derivVariables="x x x x">$f</derivative>
      <derivative name="dg4" derivVariables="y y y y" styleNumber="2">$g</derivative>
      <derivative name="dh4" derivVariables="z z z z" styleNumber="2">$h</derivative>

      <number name="dx">0.0001</number>
      <map assignNames="
        t1 t2 t3 t4 t5 t6 t7 t8 t9 t10 t11 t12 t13 t14 t15 t16 t17 t18 t19 t20
        t21 t22 t23 t24 t25 t26 t27 t28 t29 t30 t31 t32 t33 t34 t35 t36 t37 t38 t39 t40 t41
      ">
        <template newNamespace>
          <p><aslist>
          <evaluate function="$(../f)" input="$x" name="f_0" />
          <evaluate function="$(../df1)" input="$x+$(../dx)/2" name="df1_05" />
          <evaluate function="$(../df1b)" input="$x+$(../dx)/2" name="df1b_05" />
          <evaluate function="$(../df2)" input="$x" name="df2_0" />
          <evaluate function="$(../df2b)" input="$x" name="df2b_0" />
          <evaluate function="$(../df3)" input="$x+$(../dx)/2" name="df3_05" />
          <evaluate function="$(../df4)" input="$x" name="df4_0" />
          
          <evaluate function="$(../g)" input="$x" name="g_0" />
          <evaluate function="$(../dg1)" input="$x+$(../dx)/2" name="dg1_05" />
          <evaluate function="$(../dg1b)" input="$x+$(../dx)/2" name="dg1b_05" />
          <evaluate function="$(../dg2)" input="$x" name="dg2_0" />
          <evaluate function="$(../dg2b)" input="$x" name="dg2b_0" />
          <evaluate function="$(../dg3)" input="$x+$(../dx)/2" name="dg3_05" />
          <evaluate function="$(../dg4)" input="$x" name="dg4_0" />

          <evaluate function="$(../h)" input="$x" name="h_0" />
          <evaluate function="$(../dh1)" input="$x+$(../dx)/2" name="dh1_05" />
          <evaluate function="$(../dh1b)" input="$x+$(../dx)/2" name="dh1b_05" />
          <evaluate function="$(../dh2)" input="$x" name="dh2_0" />
          <evaluate function="$(../dh2b)" input="$x" name="dh2b_0" />
          <evaluate function="$(../dh3)" input="$x+$(../dx)/2" name="dh3_05" />
          <evaluate function="$(../dh4)" input="$x" name="dh4_0" />
          </aslist></p>
        </template>
        <sources alias="x">
          <sequence from="-10.02412412" to="10" step="3.1" />
        </sources>
      </map>
      
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let dx = 0.0001;

      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      let df1 = createFunctionFromDefinition(
        stateVariables["/df1"].stateValues.fDefinitions[0],
      );
      let df1b = createFunctionFromDefinition(
        stateVariables["/df1b"].stateValues.fDefinitions[0],
      );
      let df2 = createFunctionFromDefinition(
        stateVariables["/df2"].stateValues.fDefinitions[0],
      );
      let df2b = createFunctionFromDefinition(
        stateVariables["/df2b"].stateValues.fDefinitions[0],
      );
      let df3 = createFunctionFromDefinition(
        stateVariables["/df3"].stateValues.fDefinitions[0],
      );
      let df4 = createFunctionFromDefinition(
        stateVariables["/df4"].stateValues.fDefinitions[0],
      );
      let g = createFunctionFromDefinition(
        stateVariables["/g"].stateValues.fDefinitions[0],
      );
      let dg1 = createFunctionFromDefinition(
        stateVariables["/dg1"].stateValues.fDefinitions[0],
      );
      let dg1b = createFunctionFromDefinition(
        stateVariables["/dg1b"].stateValues.fDefinitions[0],
      );
      let dg2 = createFunctionFromDefinition(
        stateVariables["/dg2"].stateValues.fDefinitions[0],
      );
      let dg2b = createFunctionFromDefinition(
        stateVariables["/dg2b"].stateValues.fDefinitions[0],
      );
      let dg3 = createFunctionFromDefinition(
        stateVariables["/dg3"].stateValues.fDefinitions[0],
      );
      let dg4 = createFunctionFromDefinition(
        stateVariables["/dg4"].stateValues.fDefinitions[0],
      );
      let h = createFunctionFromDefinition(
        stateVariables["/h"].stateValues.fDefinitions[0],
      );
      let dh1 = createFunctionFromDefinition(
        stateVariables["/dh1"].stateValues.fDefinitions[0],
      );
      let dh1b = createFunctionFromDefinition(
        stateVariables["/dh1b"].stateValues.fDefinitions[0],
      );
      let dh2 = createFunctionFromDefinition(
        stateVariables["/dh2"].stateValues.fDefinitions[0],
      );
      let dh2b = createFunctionFromDefinition(
        stateVariables["/dh2b"].stateValues.fDefinitions[0],
      );
      let dh3 = createFunctionFromDefinition(
        stateVariables["/dh3"].stateValues.fDefinitions[0],
      );
      let dh4 = createFunctionFromDefinition(
        stateVariables["/dh4"].stateValues.fDefinitions[0],
      );
      let zero1 = createFunctionFromDefinition(
        stateVariables["/zero1"].stateValues.fDefinitions[0],
      );
      let zero2 = createFunctionFromDefinition(
        stateVariables["/zero2"].stateValues.fDefinitions[0],
      );
      let zero3 = createFunctionFromDefinition(
        stateVariables["/zero3"].stateValues.fDefinitions[0],
      );
      let zero4 = createFunctionFromDefinition(
        stateVariables["/zero4"].stateValues.fDefinitions[0],
      );
      let zero5 = createFunctionFromDefinition(
        stateVariables["/zero5"].stateValues.fDefinitions[0],
      );
      let zero6 = createFunctionFromDefinition(
        stateVariables["/zero6"].stateValues.fDefinitions[0],
      );
      let zero7 = createFunctionFromDefinition(
        stateVariables["/zero7"].stateValues.fDefinitions[0],
      );
      let zero8 = createFunctionFromDefinition(
        stateVariables["/zero8"].stateValues.fDefinitions[0],
      );
      let zero9 = createFunctionFromDefinition(
        stateVariables["/zero9"].stateValues.fDefinitions[0],
      );
      let zero10 = createFunctionFromDefinition(
        stateVariables["/zero10"].stateValues.fDefinitions[0],
      );
      let zero11 = createFunctionFromDefinition(
        stateVariables["/zero11"].stateValues.fDefinitions[0],
      );
      let zero12 = createFunctionFromDefinition(
        stateVariables["/zero12"].stateValues.fDefinitions[0],
      );

      let i = 0;

      // make sure we don't get within dx of a grid point
      for (let x = -10.02412412; x <= 10; x += 3.1) {
        i++;

        let f_0 = f(x);
        let f_1 = f(x + dx);
        let df1_05 = df1(x + dx / 2);
        let df1b_05 = df1b(x + dx / 2);
        expect(df1_05).closeTo((f_1 - f_0) / dx, 1e-6);
        expect(df1b_05).eq(df1_05);

        let f_0a = stateVariables[`/t${i}/f_0`].stateValues.value;
        expect(f_0a).closeTo(f_0, 1e-10);
        let df1_05a = stateVariables[`/t${i}/df1_05`].stateValues.value;
        expect(df1_05a).closeTo(df1_05, 1e-10);
        let df1b_05a = stateVariables[`/t${i}/df1b_05`].stateValues.value;
        expect(df1b_05a).closeTo(df1b_05, 1e-10);

        let g_0 = g(x);
        let g_1 = g(x + dx);
        expect(g_0).eq(f_0);
        expect(g_1).eq(f_1);
        let dg1_05 = dg1(x + dx / 2);
        let dg1b_05 = dg1b(x + dx / 2);
        expect(dg1_05).closeTo((g_1 - g_0) / dx, 1e-6);
        expect(dg1b_05).eq(dg1_05);

        let g_0a = stateVariables[`/t${i}/g_0`].stateValues.value;
        expect(g_0a).closeTo(f_0, 1e-10);
        let dg1_05a = stateVariables[`/t${i}/dg1_05`].stateValues.value;
        expect(dg1_05a).closeTo(df1_05, 1e-10);
        let dg1b_05a = stateVariables[`/t${i}/dg1b_05`].stateValues.value;
        expect(dg1b_05a).closeTo(df1b_05, 1e-10);

        let h_0 = h(x);
        let h_1 = h(x + dx);
        expect(h_0).eq(f_0);
        expect(h_1).eq(f_1);
        let dh1_05 = dh1(x + dx / 2);
        let dh1b_05 = dh1b(x + dx / 2);
        expect(dh1_05).closeTo((h_1 - h_0) / dx, 1e-6);
        expect(dh1b_05).eq(dh1_05);

        let h_0a = stateVariables[`/t${i}/h_0`].stateValues.value;
        expect(h_0a).closeTo(f_0, 1e-10);
        let dh1_05a = stateVariables[`/t${i}/dh1_05`].stateValues.value;
        expect(dh1_05a).closeTo(df1_05, 1e-10);
        let dh1b_05a = stateVariables[`/t${i}/dh1b_05`].stateValues.value;
        expect(dh1b_05a).closeTo(df1b_05, 1e-10);

        let df1_n05 = df1(x - dx / 2);
        let df2_0 = df2(x);
        expect(df2_0).closeTo((df1b_05 - df1_n05) / dx, 1e-6);

        let df2_0a = stateVariables[`/t${i}/df2_0`].stateValues.value;
        expect(df2_0a).closeTo(df2_0, 1e-10);

        let dg2_0 = dg2(x);
        expect(dg2_0).eq(df2_0);

        let dg2_0a = stateVariables[`/t${i}/dg2_0`].stateValues.value;
        expect(dg2_0a).closeTo(df2_0, 1e-10);

        let dh2_0 = dh2(x);
        expect(dh2_0).eq(df2_0);

        let dh2_0a = stateVariables[`/t${i}/dh2_0`].stateValues.value;
        expect(dh2_0a).closeTo(df2_0, 1e-10);

        let df2b_0 = df2b(x);
        expect(df2b_0).eq(df2_0);

        let df2b_0a = stateVariables[`/t${i}/df2b_0`].stateValues.value;
        expect(df2b_0a).closeTo(df2b_0, 1e-10);

        let dg2b_0 = dg2b(x);
        expect(dg2b_0).eq(dg2_0);

        let dg2b_0a = stateVariables[`/t${i}/dg2b_0`].stateValues.value;
        expect(dg2b_0a).closeTo(df2b_0, 1e-10);

        let dh2b_0 = dh2b(x);
        expect(dh2b_0).eq(dh2_0);

        let dh2b_0a = stateVariables[`/t${i}/dh2b_0`].stateValues.value;
        expect(dh2b_0a).closeTo(df2b_0, 1e-10);

        let df2_1 = df2(x + dx);
        let df3_05 = df3(x + dx / 2);
        expect(df3_05).closeTo((df2_1 - df2_0) / dx, 1e-6);

        let df3_05a = stateVariables[`/t${i}/df3_05`].stateValues.value;
        expect(df3_05a).closeTo(df3_05, 1e-10);

        let dg3_05 = dg3(x + dx / 2);
        expect(dg3_05).eq(df3_05);

        let dg3_05a = stateVariables[`/t${i}/dg3_05`].stateValues.value;
        expect(dg3_05a).closeTo(df3_05, 1e-10);

        let dh3_05 = dh3(x + dx / 2);
        expect(dh3_05).eq(df3_05);

        let dh3_05a = stateVariables[`/t${i}/dh3_05`].stateValues.value;
        expect(dh3_05a).closeTo(df3_05, 1e-10);

        let df3_n05 = df3(x - dx / 2);
        let df4_0 = df4(x);
        expect(df4_0).closeTo((df3_05 - df3_n05) / dx, 1e-6);

        let df4_0a = stateVariables[`/t${i}/df4_0`].stateValues.value;
        expect(df4_0a).closeTo(df4_0, 1e-10);

        let dg4_0 = dg4(x);
        expect(dg4_0).eq(df4_0);

        let dg4_0a = stateVariables[`/t${i}/dg4_0`].stateValues.value;
        expect(dg4_0a).closeTo(df4_0, 1e-10);

        let dh4_0 = dh4(x);
        expect(dh4_0).eq(df4_0);

        let dh4_0a = stateVariables[`/t${i}/dh4_0`].stateValues.value;
        expect(dh4_0a).closeTo(df4_0, 1e-10);

        expect(zero1(x)).eq(0);
        expect(zero2(x)).eq(0);
        expect(zero3(x)).eq(0);
        expect(zero4(x)).eq(0);
        expect(zero5(x)).eq(0);
        expect(zero6(x)).eq(0);
        expect(zero7(x)).eq(0);
        expect(zero8(x)).eq(0);
        expect(zero9(x)).eq(0);
        expect(zero10(x)).eq(0);
        expect(zero11(x)).eq(0);
        expect(zero12(x)).eq(0);
      }
    });
  });

  it("derivatives of interpolated function with changed variables, subscript", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <function name="f" variable="x_1" maxima="(5,-3)" minima="(-5,3)" />
      <function name="g" styleNumber="2" variables="x_2" >$f</function>
    
      <derivative name="df1">$f</derivative>
      <derivative name="dg1" styleNumber="2">$g</derivative>
    
      <derivative name="df1b" derivVariable="x_1">$f</derivative>
      <derivative name="zero1" derivVariables="x_1" styleNumber="2">$g</derivative>
    
      <derivative name="zero2" derivVariables="x_2">$f</derivative>
      <derivative name="dg1b" derivVariable="x_2" styleNumber="2">$g</derivative>
    
      <derivative name="df2" derivVariables="x_1 x_1">$f</derivative>
      <derivative name="dg2" derivVariables="x_2 x_2" styleNumber="2">$g</derivative>
    
      <derivative name="df2b" derivVariable="x_1"><derivative derivVariable="x_1">$f</derivative></derivative>
      <derivative name="dg2b" derivVariables="x_2" styleNumber="2"><derivative derivVariables="x_2">$g</derivative></derivative>

      <derivative name="zero3" derivVariables="x_1 x_2">$f</derivative>
      <derivative name="zero4" derivVariables="x_1 x_2" styleNumber="2">$g</derivative>

      <derivative name="zero5" derivVariables="x_2 x_1">$f</derivative>
      <derivative name="zero6" derivVariables="x_2 x_1" styleNumber="2">$g</derivative>

      <derivative name="df3" derivVariables="x_1 x_1 x_1">$f</derivative>
      <derivative name="dg3" derivVariables="x_2 x_2 x_2" styleNumber="2">$g</derivative>
    
      <derivative name="df4" derivVariables="x_1 x_1 x_1 x_1">$f</derivative>
      <derivative name="dg4" derivVariables="x_2 x_2 x_2 x_2" styleNumber="2">$g</derivative>
    
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let dx = 0.0001;

      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      let df1 = createFunctionFromDefinition(
        stateVariables["/df1"].stateValues.fDefinitions[0],
      );
      let df1b = createFunctionFromDefinition(
        stateVariables["/df1b"].stateValues.fDefinitions[0],
      );
      let df2 = createFunctionFromDefinition(
        stateVariables["/df2"].stateValues.fDefinitions[0],
      );
      let df2b = createFunctionFromDefinition(
        stateVariables["/df2b"].stateValues.fDefinitions[0],
      );
      let df3 = createFunctionFromDefinition(
        stateVariables["/df3"].stateValues.fDefinitions[0],
      );
      let df4 = createFunctionFromDefinition(
        stateVariables["/df4"].stateValues.fDefinitions[0],
      );
      let g = createFunctionFromDefinition(
        stateVariables["/g"].stateValues.fDefinitions[0],
      );
      let dg1 = createFunctionFromDefinition(
        stateVariables["/dg1"].stateValues.fDefinitions[0],
      );
      let dg1b = createFunctionFromDefinition(
        stateVariables["/dg1b"].stateValues.fDefinitions[0],
      );
      let dg2 = createFunctionFromDefinition(
        stateVariables["/dg2"].stateValues.fDefinitions[0],
      );
      let dg2b = createFunctionFromDefinition(
        stateVariables["/dg2b"].stateValues.fDefinitions[0],
      );
      let dg3 = createFunctionFromDefinition(
        stateVariables["/dg3"].stateValues.fDefinitions[0],
      );
      let dg4 = createFunctionFromDefinition(
        stateVariables["/dg4"].stateValues.fDefinitions[0],
      );
      let zero1 = createFunctionFromDefinition(
        stateVariables["/zero1"].stateValues.fDefinitions[0],
      );
      let zero2 = createFunctionFromDefinition(
        stateVariables["/zero2"].stateValues.fDefinitions[0],
      );
      let zero3 = createFunctionFromDefinition(
        stateVariables["/zero3"].stateValues.fDefinitions[0],
      );
      let zero4 = createFunctionFromDefinition(
        stateVariables["/zero4"].stateValues.fDefinitions[0],
      );
      let zero5 = createFunctionFromDefinition(
        stateVariables["/zero5"].stateValues.fDefinitions[0],
      );
      let zero6 = createFunctionFromDefinition(
        stateVariables["/zero6"].stateValues.fDefinitions[0],
      );

      // make sure we don't get within dx of a grid point
      for (let x = -10.02412412; x <= 10; x += 0.5) {
        let f_0 = f(x);
        let f_1 = f(x + dx);
        let df1_05 = df1(x + dx / 2);
        let df1b_05 = df1b(x + dx / 2);
        expect(df1_05).closeTo((f_1 - f_0) / dx, 1e-6);
        expect(df1b_05).eq(df1_05);

        let dg1_05 = dg1(x + dx / 2);
        let dg1b_05 = dg1b(x + dx / 2);
        expect(dg1_05).eq(dg1_05);
        expect(dg1b_05).eq(dg1_05);

        let df1_n05 = df1(x - dx / 2);
        let df2_0 = df2(x);
        expect(df2_0).closeTo((df1b_05 - df1_n05) / dx, 1e-6);

        let dg2_0 = dg2(x);
        expect(dg2_0).eq(df2_0);

        let df2b_0 = df2b(x);
        expect(df2b_0).eq(df2_0);

        let dg2b_0 = dg2b(x);
        expect(dg2b_0).eq(dg2_0);

        let df2_1 = df2(x + dx);
        let df3_05 = df3(x + dx / 2);
        expect(df3_05).closeTo((df2_1 - df2_0) / dx, 1e-6);

        let dg3_05 = dg3(x + dx / 2);
        expect(dg3_05).eq(df3_05);

        let df3_n05 = df3(x - dx / 2);
        let df4_0 = df4(x);
        expect(df4_0).closeTo((df3_05 - df3_n05) / dx, 1e-6);

        let dg4_0 = dg4(x);
        expect(dg4_0).eq(df4_0);

        expect(zero1(x)).eq(0);
        expect(zero2(x)).eq(0);
        expect(zero3(x)).eq(0);
        expect(zero4(x)).eq(0);
        expect(zero5(x)).eq(0);
        expect(zero6(x)).eq(0);
      }
    });
  });

  it("extrema of derivative", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><m>c_1 =</m> <mathinput name="c_1" prefill="1" /></p>
    <p><m>c_2 =</m> <mathinput name="c_2" prefill="1" /></p>
    <p><m>c_3 =</m> <mathinput name="c_3" prefill="3" /></p>
    <p><m>c_4 =</m> <mathinput name="c_4" prefill="4" /></p>
    <p><m>c_5 =</m> <mathinput name="c_5" prefill="5" /></p>
    <p><m>c_6 =</m> <mathinput name="c_6" prefill="1" /></p>
    <p><m>x =</m> <mathinput name="x" prefill="x" /></p>

    <math hide name="formula" simplify>
      $c_1 $x^5/20 - $c_1($c_2+$c_3+$c_4) $x^4/12
      + $c_1($c_2*$c_3 + $c_2 $c_4 + $c_3$c_4)$x^3/6
      - $c_1$c_2$c_3$c_4$x^2/2 + $c_5$x + $c_6
    </math>

    <p><m>f($x) =
    <function name="f" variable="$x">$formula</function>
    </m></p>

    <p><m>f'($x) =
    <derivative name="fp">$f</derivative>
    </m></p>

    <p>again, <m>f'($x) = <copy target="fp" name="fp2" />
    </m></p>


    <p>Number of minima of f': <copy prop="numMinima" assignNames="nMinima" target="fp" /></p>
    <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min1 min2"><copy prop="minima" target="fp" /></extract></p> 

    <p>Number of maxima of f': <copy prop="numMaxima" assignNames="nMaxima" target="fp" /></p>
    <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max1 max2"><copy prop="maxima" target="fp" /></extract></p> 

    <p>To repeat:</p>
    <p>Number of minima of f': <copy prop="numMinima" assignNames="nMinima2" target="fp2" /></p>
    <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min12 min22"><copy prop="minima" target="fp2" /></extract></p> 

    <p>Number of maxima of f': <copy prop="numMaxima" assignNames="nMaxima2" target="fp2" /></p>
    <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max12 max22"><copy prop="maxima" target="fp2" /></extract></p> 


    <p>
      <copy prop="value" target="c_1" assignNames="c_1a" />
      <copy prop="value" target="c_2" assignNames="c_2a" />
      <copy prop="value" target="c_3" assignNames="c_3a" />
      <copy prop="value" target="c_4" assignNames="c_4a" />
      <copy prop="value" target="c_5" assignNames="c_5a" />
      <copy prop="value" target="c_6" assignNames="c_6a" />
      <copy prop="value" target="x" assignNames="xa" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    function fp(x, c1, c2, c3, c4, c5) {
      return (
        (c1 * x ** 4) / 4 -
        (c1 * (c2 + c3 + c4) * x ** 3) / 3 +
        (c1 * (c2 * c3 + c2 * c4 + c3 * c4) * x ** 2) / 2 -
        c1 * c2 * c3 * c4 * x +
        c5
      );
    }

    function fpMinima(c1, c2, c3, c4, c5) {
      let extrema = [c2, c3, c4].sort((a, b) => a - b);
      let minima = [];
      if (c1 > 0) {
        minima.push([extrema[0], fp(extrema[0], c1, c2, c3, c4, c5)]);
        minima.push([extrema[2], fp(extrema[2], c1, c2, c3, c4, c5)]);
      } else {
        minima.push([extrema[1], fp(extrema[1], c1, c2, c3, c4, c5)]);
      }
      return minima;
    }

    function fpMaxima(c1, c2, c3, c4, c5) {
      let extrema = [c2, c3, c4].sort((a, b) => a - b);
      let maxima = [];
      if (c1 > 0) {
        maxima.push([extrema[1], fp(extrema[1], c1, c2, c3, c4, c5)]);
      } else {
        maxima.push([extrema[0], fp(extrema[0], c1, c2, c3, c4, c5)]);
        maxima.push([extrema[2], fp(extrema[2], c1, c2, c3, c4, c5)]);
      }
      return maxima;
    }

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      function verifyExtrema(c1, c2, c3, c4, c5) {
        let minima = fpMinima(c1, c2, c3, c4, c5);
        let nMinima = minima.length;
        let maxima = fpMaxima(c1, c2, c3, c4, c5);
        let nMaxima = maxima.length;

        expect(stateVariables[""]);

        cy.get(cesc("#\\/nMinima")).should("have.text", nMinima.toString());
        cy.get(cesc("#\\/nMinima2")).should("have.text", nMinima.toString());
        cy.get(cesc("#\\/min1"))
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.replace(/−/g, "-").trim()).equal(
              `(${minima[0][0]},${me.math.round(minima[0][1], 5)})`,
            );
          });
        cy.get(cesc("#\\/min12"))
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.replace(/−/g, "-").trim()).equal(
              `(${minima[0][0]},${me.math.round(minima[0][1], 5)})`,
            );
          });
        if (nMinima === 2) {
          cy.get(cesc("#\\/min2"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.replace(/−/g, "-").trim()).equal(
                `(${minima[1][0]},${me.math.round(minima[1][1], 5)})`,
              );
            });
          cy.get(cesc("#\\/min22"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.replace(/−/g, "-").trim()).equal(
                `(${minima[1][0]},${me.math.round(minima[1][1], 5)})`,
              );
            });
        } else {
          cy.get(cesc("#\\/min2")).should("not.exist");
          cy.get(cesc("#\\/min22")).should("not.exist");
        }
        cy.get(cesc("#\\/nMaxima")).should("have.text", nMaxima.toString());
        cy.get(cesc("#\\/nMaxima2")).should("have.text", nMaxima.toString());
        cy.get(cesc("#\\/max1"))
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.replace(/−/g, "-").trim()).equal(
              `(${maxima[0][0]},${me.math.round(maxima[0][1], 5)})`,
            );
          });
        cy.get(cesc("#\\/max12"))
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.replace(/−/g, "-").trim()).equal(
              `(${maxima[0][0]},${me.math.round(maxima[0][1], 5)})`,
            );
          });
        if (nMaxima === 2) {
          cy.get(cesc("#\\/max2"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.replace(/−/g, "-").trim()).equal(
                `(${maxima[1][0]},${me.math.round(maxima[1][1], 5)})`,
              );
            });
          cy.get(cesc("#\\/max22"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.replace(/−/g, "-").trim()).equal(
                `(${maxima[1][0]},${me.math.round(maxima[1][1], 5)})`,
              );
            });
        } else {
          cy.get(cesc("#\\/max2")).should("not.exist");
          cy.get(cesc("#\\/max22")).should("not.exist");
        }
      }

      let c1 = 1,
        c2 = 1,
        c3 = 3,
        c4 = 4,
        c5 = 5,
        c6 = 1,
        v = "x";

      verifyExtrema(c1, c2, c3, c4, c5);

      cy.window().then(async (win) => {
        c1 = 3;
        cy.get(cesc2("#/c_1") + " textarea").type(
          `{end}{backspace}{backspace}${c1}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_1a")).should("contain.text", nInDOM(c1));
        verifyExtrema(c1, c2, c3, c4, c5);

        c2 = -5;
        cy.get(cesc2("#/c_2") + " textarea").type(
          `{end}{backspace}{backspace}${c2}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_2a")).should("contain.text", nInDOM(c2));
        verifyExtrema(c1, c2, c3, c4, c5);

        c3 = 1;
        cy.get(cesc2("#/c_3") + " textarea").type(
          `{end}{backspace}{backspace}${c3}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_3a")).should("contain.text", nInDOM(c3));
        verifyExtrema(c1, c2, c3, c4, c5);

        c4 = -6;
        cy.get(cesc2("#/c_4") + " textarea").type(
          `{end}{backspace}{backspace}${c4}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_4a")).should("contain.text", nInDOM(c4));
        verifyExtrema(c1, c2, c3, c4, c5);

        c5 = 3;
        cy.get(cesc2("#/c_5") + " textarea").type(
          `{end}{backspace}{backspace}${c5}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_5a")).should("contain.text", nInDOM(c5));
        verifyExtrema(c1, c2, c3, c4, c5);

        c6 = 2;
        cy.get(cesc2("#/c_6") + " textarea").type(
          `{end}{backspace}{backspace}${c6}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_6a")).should("contain.text", nInDOM(c6));
        verifyExtrema(c1, c2, c3, c4, c5);

        v = "y";
        cy.get(cesc2("#/x") + " textarea").type(
          `{end}{backspace}{backspace}${v}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/xa")).should("contain.text", v);
        verifyExtrema(c1, c2, c3, c4, c5);
      });

      cy.window().then(async (win) => {
        c1 = 2;
        cy.get(cesc2("#/c_1") + " textarea").type(
          `{end}{backspace}{backspace}${c1}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_1a")).should("contain.text", nInDOM(c1));
        verifyExtrema(c1, c2, c3, c4, c5);

        c2 = 4;
        cy.get(cesc2("#/c_2") + " textarea").type(
          `{end}{backspace}{backspace}${c2}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_2a")).should("contain.text", nInDOM(c2));
        verifyExtrema(c1, c2, c3, c4, c5);

        c3 = -8;
        cy.get(cesc2("#/c_3") + " textarea").type(
          `{end}{backspace}{backspace}${c3}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_3a")).should("contain.text", nInDOM(c3));
        verifyExtrema(c1, c2, c3, c4, c5);

        c4 = 9;
        cy.get(cesc2("#/c_4") + " textarea").type(
          `{end}{backspace}{backspace}${c4}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_4a")).should("contain.text", nInDOM(c4));
        verifyExtrema(c1, c2, c3, c4, c5);

        c5 = -2;
        cy.get(cesc2("#/c_5") + " textarea").type(
          `{end}{backspace}{backspace}${c5}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_5a")).should("contain.text", nInDOM(c5));
        verifyExtrema(c1, c2, c3, c4, c5);

        c6 = 6;
        cy.get(cesc2("#/c_6") + " textarea").type(
          `{end}{backspace}{backspace}${c6}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/c_6a")).should("contain.text", nInDOM(c6));
        verifyExtrema(c1, c2, c3, c4, c5);

        v = "q";
        cy.get(cesc2("#/x") + " textarea").type(
          `{end}{backspace}{backspace}${v}{enter}`,
          { force: true },
        );
        cy.get(cesc2("#/xa")).should("contain.text", v);
        verifyExtrema(c1, c2, c3, c4, c5);
      });
    });
  });

  it("extrema of derivative of interpolated function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <graph>
        <function name="f" minima="(-5,-3) (0,-5)" maxima="(-3,0) (6,8)" />
        <derivative name="fp" stylenumber="2"><copy target="f"/></derivative>
      </graph>

      <copy target="fp" name="fp2" />

      <p>Number of minima of f': <copy prop="numMinima" assignNames="nMinima" target="fp" /></p>
      <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min1 min2"><copy prop="minima" target="fp" /></extract></p> 
  
      <p>Number of maxima of f': <copy prop="numMaxima" assignNames="nMaxima" target="fp" /></p>
      <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max1 max2"><copy prop="maxima" target="fp" /></extract></p> 
  
      <p>To repeat:</p>
      <p>Number of minima of f': <copy prop="numMinima" assignNames="nMinima2" target="fp2" /></p>
      <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min12 min22"><copy prop="minima" target="fp2" /></extract></p> 
  
      <p>Number of maxima of f': <copy prop="numMaxima" assignNames="nMaxima2" target="fp2" /></p>
      <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max12 max22"><copy prop="maxima" target="fp2" /></extract></p> 
  
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/nMinima")).should("have.text", "1");
    cy.get(cesc("#\\/nMinima2")).should("have.text", "1");

    cy.get(cesc("#\\/nMaxima")).should("have.text", "2");
    cy.get(cesc("#\\/nMaxima2")).should("have.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let fp = createFunctionFromDefinition(
        stateVariables["/fp"].stateValues.fDefinitions[0],
      );

      let max1x = (-5 - 3) / 2;
      cy.get(cesc("#\\/max1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/−/g, "-").trim()).equal(
            `(${max1x},${me.math.round(fp(max1x), 5)})`,
          );
        });
      cy.get(cesc("#\\/max12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/−/g, "-").trim()).equal(
            `(${max1x},${me.math.round(fp(max1x), 5)})`,
          );
        });

      let min1x = (-3 + 0) / 2;
      cy.get(cesc("#\\/min1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/−/g, "-").trim()).equal(
            `(${min1x},${me.math.round(fp(min1x), 5)})`,
          );
        });
      cy.get(cesc("#\\/min12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/−/g, "-").trim()).equal(
            `(${min1x},${me.math.round(fp(min1x), 5)})`,
          );
        });

      let max2x = (0 + 6) / 2;
      cy.get(cesc("#\\/max2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/−/g, "-").trim()).equal(
            `(${max2x},${me.math.round(fp(max2x), 5)})`,
          );
        });
      cy.get(cesc("#\\/max22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/−/g, "-").trim()).equal(
            `(${max2x},${me.math.round(fp(max2x), 5)})`,
          );
        });
    });
  });

  it("handle no child", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <derivative name="d1" symbolic></derivative>
      <derivative name="d2">$nothing</derivative>

      <p>$$d1(0)</p>
      <p>$$d2(0)</p>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/d1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc("#\\/d2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let d1 = createFunctionFromDefinition(
        stateVariables["/d1"].stateValues.fDefinitions[0],
      );
      let d2 = createFunctionFromDefinition(
        stateVariables["/d2"].stateValues.fDefinitions[0],
      );

      expect(d1(0)).eqls(NaN);
      expect(d2(0)).eqls(NaN);
    });
  });
});
