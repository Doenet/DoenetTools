import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("SampleRandomNumbers Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("no parameters, sample single uniform random number from 0 to 1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers/></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect(sample).gt(0);
        expect(sample).lte(1);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(0.5, 0.05);
      expect(varX).closeTo(1 / 12, 0.015);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(0.5, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(1 / 12, 1e-10);
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(1 / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      console.log(samples, copiedSamples);
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample five uniform random numbers from 0 to 8, only to specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="uniform" numSamples="5" to="8" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect(sample).gt(0);
        expect(sample).lte(8);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(4, 0.5);
      expect(varX).closeTo(8 ** 2 / 12, 0.8);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(4, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(8 ** 2 / 12, 1e-10);
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(8 ** 2 / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample five uniform random numbers from -5 to -4, only from specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="uniform" numSamples="5" from="-5" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect(sample).gt(-5);
        expect(sample).lte(-4);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(-4.5, 0.05);
      expect(varX).closeTo(1 / 12, 0.015);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(-4.5, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(1 / 12, 1e-10);
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(1 / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample ten uniform random numbers from -4 to -2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers numSamples="10" from="-4" to="-2" /></template>
      <sources><sequence length="40" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect(sample).gt(-4);
        expect(sample).lte(-2);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(-3, 0.5);
      expect(varX).closeTo(2 ** 2 / 12, 0.5);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(-3, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(2 ** 2 / 12, 1e-10);
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(2 ** 2 / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample ten uniform random numbers from -2 to -4", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers numSamples="10" from="-2" to="-4" /></template>
      <sources><sequence length="40" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect(sample).gt(-4);
        expect(sample).lte(-2);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(-3, 0.5);
      expect(varX).closeTo(2 ** 2 / 12, 0.5);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(-3, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(2 ** 2 / 12, 1e-10);
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(2 ** 2 / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample twenty continuous standard normals, no parameters", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="gaussian" numSamples="20" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(0, 0.15);
      expect(varX).closeTo(1, 0.2);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(0, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(1, 1e-10);
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(1),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample five continuous standard normals, unspecified mean 0, standard deviation 10", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="gaussian" numSamples="5" standardDeviation="10" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(0, 2);
      expect(varX).closeTo(100, 25);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(0, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(100, 1e-10);
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(100),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample single continuous standard normal, mean -50, unspecified standard deviation 1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="gaussian" mean="-50" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(-50, 0.2);
      expect(varX).closeTo(1, 0.3);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(-50, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(1, 1e-10);
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(1),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample twenty continuous standard normals, mean 100, standard deviation 10", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="gaussian" numSamples="20" mean="100" standardDeviation="10" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(100, 2);
      expect(varX).closeTo(100, 30);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(100, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(100, 1e-10);
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(100),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample twenty continuous standard normals, mean -3, variance 0.01", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="gaussian" numSamples="20" mean="-3" variance="0.01" /></template>
      <sources><sequence length="20" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(-3, 0.1);
      expect(varX).closeTo(0.01, 0.003);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(-3, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(0.01, 1e-10);
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(0.01),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample single discrete uniform, no parameters, integer from 0 to 1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([0, 1].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(0.5, 0.1);
      expect(varX).closeTo((2 ** 2 - 1) / 12, 0.1);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(0.5, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(
        (2 ** 2 - 1) / 12,
        1e-10,
      );
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt((2 ** 2 - 1) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample single discrete uniform, from 0.5 to 5.5, only to specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" to="5.5" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([0.5, 1.5, 2.5, 3.5, 4.5, 5.5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(3, 0.3);
      expect(varX).closeTo((6 ** 2 - 1) / 12, 0.5);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(3, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(
        (6 ** 2 - 1) / 12,
        1e-10,
      );
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt((6 ** 2 - 1) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample single discrete uniform, from 8.5 to 9.5, only from specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="8.5" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([8.5, 9.5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(9, 0.1);
      expect(varX).closeTo((2 ** 2 - 1) / 12, 0.05);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(9, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(
        (2 ** 2 - 1) / 12,
        1e-10,
      );
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt((2 ** 2 - 1) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample five integers from -3 to 5", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="-3" to="5" numSamples="5" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([-3, -2, -1, 0, 1, 2, 3, 4, 5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(1, 0.5);
      expect(varX).closeTo((9 ** 2 - 1) / 12, 1);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(1, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(
        (9 ** 2 - 1) / 12,
        1e-10,
      );
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt((9 ** 2 - 1) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample five integers from 5 to -3 gives nothing", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="5" to="-3" numSamples="5" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(0);

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample 10 odd integers from -3 to 5", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="-3" to="5" numSamples="10" step="2" /></template>
      <sources><sequence length="40" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([-3, -1, 1, 3, 5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(1, 0.5);
      expect(varX).closeTo(((5 ** 2 - 1) * 2 ** 2) / 12, 1);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(1, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(
        ((5 ** 2 - 1) * 2 ** 2) / 12,
        1e-10,
      );
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(((5 ** 2 - 1) * 2 ** 2) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample single discrete uniform, no parameters except exclude, get first two non-negative integers", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" exclude="0 2" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([1, 3].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(2, 0.2);
      expect(varX).closeTo(((2 ** 2 - 1) * 2 ** 2) / 12, 0.2);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(2, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(
        ((2 ** 2 - 1) * 2 ** 2) / 12,
        1e-10,
      );
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(((2 ** 2 - 1) * 2 ** 2) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample single discrete uniform, from 0.5 to 4.5, exclude 1.5, 3.5, only to and exclude specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" to="4.5" exclude="1.5 3.5" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([0.5, 2.5, 4.5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(2.5, 0.3);
      expect(varX).closeTo(((3 ** 2 - 1) * 2 ** 2) / 12, 0.5);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(2.5, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(
        ((3 ** 2 - 1) * 2 ** 2) / 12,
        1e-10,
      );
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(((3 ** 2 - 1) * 2 ** 2) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample single discrete uniform, from 6.5 to 9.5 exclude 6.5, 8.6, only from and exclude specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="6.5" exclude="6.5 8.5" /></template>
      <sources><sequence length="400" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([7.5, 9.5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      expect(meanX).closeTo(8.5, 0.1);
      expect(varX).closeTo(((2 ** 2 - 1) * 2 ** 2) / 12, 0.05);

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];
      expect(firstSample.stateValues.mean).closeTo(8.5, 1e-10);
      expect(firstSample.stateValues.variance).closeTo(
        ((2 ** 2 - 1) * 2 ** 2) / 12,
        1e-10,
      );
      expect(firstSample.stateValues.standardDeviation).closeTo(
        Math.sqrt(((2 ** 2 - 1) * 2 ** 2) / 12),
        1e-10,
      );

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample five integers from -3 to 5, excluding -2 and 0", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="-3" to="5" exclude="-2 0" numSamples="5" /></template>
      <sources><sequence length="80" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([-3, -1, 1, 2, 3, 4, 5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];

      expect(meanX).closeTo(firstSample.stateValues.mean, 0.5);
      expect(varX).closeTo(firstSample.stateValues.variance, 1);

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample 10 odd integers from -3 to 5, excluding 3", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><sampleRandomNumbers type="discreteUniform" from="-3" to="5" exclude="3" numSamples="10" step="2" /></template>
      <sources><sequence length="40" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      <copy source="_map1" />
    </aslist></p>

    <copy source="p2" assignNames = "p3" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(400);

      for (let sample of samples) {
        expect([-3, -1, 1, 5].includes(sample)).eq(true);
      }

      let meanX = me.math.mean(samples);
      let varX = me.math.variance(samples, "uncorrected");

      let firstSample =
        stateVariables[
          stateVariables[stateVariables["/_map1"].replacements[0].componentName]
            .replacements[0].componentName
        ];

      expect(meanX).closeTo(firstSample.stateValues.mean, 0.5);
      expect(varX).closeTo(firstSample.stateValues.variance, 1);

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sampled number does change dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="50" name="numSamples"/>
    <mathinput prefill="10" name="maxnum"/>
    <p><aslist>
    <sampleRandomNumbers name="sample1" to="$maxnum" numSamples="$numSamples" />
    </aslist></p>

    <mathinput prefill="180" name="numSamples2"/>
    <mathinput prefill="4" name="standardDeviation"/>
    <p><aslist>
    <sampleRandomNumbers type="gaussian" name="sample2" standardDeviation="$standardDeviation" numSamples="$numSamples2" />
    </aslist></p>
    <p>
      <copy prop="value" source="numSamples2" assignNames="numSamples2a" />
      <copy prop="value" source="standardDeviation" assignNames="standardDeviationa" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let sample1numbers, sample2numbers;
    let sample1numbersb, sample2numbersb;
    let sample1numbersc, sample2numbersc;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      sample1numbers = stateVariables["/sample1"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      sample2numbers = stateVariables["/sample2"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(sample1numbers.length).eq(50);
      expect(sample2numbers.length).eq(180);

      for (let num of sample1numbers) {
        expect(num).gte(0);
        expect(num).lt(10);
      }

      expect(me.math.mean(sample1numbers)).closeTo(5, 2);
      expect(me.math.variance(sample1numbers, "uncorrected")).closeTo(
        10 ** 2 / 12,
        3,
      );

      expect(me.math.mean(sample2numbers)).closeTo(0, 1);
      expect(me.math.variance(sample2numbers, "uncorrected")).closeTo(16, 8);
    });

    cy.log("Get new samples when change number of samples");
    cy.get(cesc("#\\/numSamples") + " textarea").type(
      `{end}{backspace}{backspace}70{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/numSamples2") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}160{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/numSamples2a")).should("contain.text", "160");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      sample1numbersb = stateVariables["/sample1"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      sample2numbersb = stateVariables["/sample2"].replacements
        .slice(
          0,
          stateVariables["/sample2"].replacements.length -
            stateVariables["/sample2"].replacementsToWithhold,
        )
        .map((x) => stateVariables[x.componentName].stateValues.value);
      expect(sample1numbersb.length).eq(70);
      expect(sample2numbersb.length).eq(160);

      for (let num of sample1numbersb) {
        expect(num).gte(0);
        expect(num).lt(10);
      }

      expect(me.math.mean(sample1numbersb)).closeTo(5, 2);
      expect(me.math.variance(sample1numbersb, "uncorrected")).closeTo(
        10 ** 2 / 12,
        4,
      );

      expect(me.math.mean(sample2numbersb)).closeTo(0, 1);
      expect(me.math.variance(sample2numbersb, "uncorrected")).closeTo(16, 6);

      for (let ind = 0; ind < 10; ind++) {
        expect(sample1numbersb[ind]).not.eq(sample1numbers[ind]);
      }
      for (let ind = 0; ind < 10; ind++) {
        expect(sample2numbersb[ind]).not.eq(sample2numbers[ind]);
      }
    });

    cy.log("Get new samples when sample parameters");
    cy.get(cesc("#\\/maxnum") + " textarea").type(
      `{end}{backspace}{backspace}4{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/standardDeviation") + " textarea").type(
      `{end}{backspace}{backspace}18{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/standardDeviationa")).should("contain.text", "18");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      sample1numbersc = stateVariables["/sample1"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      sample2numbersc = stateVariables["/sample2"].replacements
        .slice(
          0,
          stateVariables["/sample2"].replacements.length -
            stateVariables["/sample2"].replacementsToWithhold,
        )
        .map((x) => stateVariables[x.componentName].stateValues.value);
      expect(sample1numbersc.length).eq(70);
      expect(sample2numbersc.length).eq(160);

      for (let num of sample1numbersc) {
        expect(num).gte(0);
        expect(num).lt(4);
      }
      expect(me.math.mean(sample1numbersc)).closeTo(2, 1);
      expect(me.math.variance(sample1numbersc, "uncorrected")).closeTo(
        4 ** 2 / 12,
        1,
      );

      expect(me.math.mean(sample2numbersc)).closeTo(0, 6);
      expect(me.math.variance(sample2numbersc, "uncorrected")).closeTo(
        18 ** 2,
        120,
      );

      for (let ind = 0; ind < 10; ind++) {
        expect(sample1numbersc[ind]).not.eq(sample1numbersb[ind]);
      }
      for (let ind = 0; ind < 10; ind++) {
        expect(sample2numbersc[ind]).not.eq(sample2numbersb[ind]);
      }
    });
  });

  it("random number doesn't resample in dynamic map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    How many numbers do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnames="a b c d e f">
      <template newNamespace>
        <sampleRandomNumbers assignnames="n" />
      </template>
      <sources>
      <sequence length="$_mathinput1" />
      </sources>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist><copy source="_map1" /></aslist></p>
    <p name="p3"><copy source="_aslist1" /></p>

    <copy name="p4" source="p1" />
    <copy name="p5" source="p2" />
    <copy name="p6" source="p3" />

    <copy name="p7" source="p4" />
    <copy name="p8" source="p5" />
    <copy name="p9" source="p6" />
    <p><copy prop="value" source="_mathinput1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let samplednumbers = [];

    cy.log("initially nothing");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkSampledNumbers(stateVariables, []);
    });

    cy.log("sample one number");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}1{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      samplednumbers.push(n1);

      checkSampledNumbers(stateVariables, samplednumbers);
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkSampledNumbers(stateVariables, []);
    });

    cy.log("get same number back");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}1{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      checkSampledNumbers(stateVariables, samplednumbers);
    });

    cy.log("get two more samples");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}3{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      let n3 = stateVariables["/c/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      samplednumbers.push(n2);
      samplednumbers.push(n3);
      checkSampledNumbers(stateVariables, samplednumbers);
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkSampledNumbers(stateVariables, []);
    });

    cy.log("get first two numbers back");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}2{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      checkSampledNumbers(stateVariables, samplednumbers.slice(0, 2));
    });

    cy.log("get six total samples");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}6{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "6");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      let n3 = stateVariables["/c/n"].stateValues.value;
      let n4 = stateVariables["/d/n"].stateValues.value;
      let n5 = stateVariables["/e/n"].stateValues.value;
      let n6 = stateVariables["/f/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      samplednumbers.push(n4);
      samplednumbers.push(n5);
      samplednumbers.push(n6);
      checkSampledNumbers(stateVariables, samplednumbers);
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkSampledNumbers(stateVariables, []);
    });

    cy.log("get all six back");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}6{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "6");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      let n3 = stateVariables["/c/n"].stateValues.value;
      let n4 = stateVariables["/d/n"].stateValues.value;
      let n5 = stateVariables["/e/n"].stateValues.value;
      let n6 = stateVariables["/f/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      expect(n4).eq(samplednumbers[3]);
      expect(n5).eq(samplednumbers[4]);
      expect(n6).eq(samplednumbers[5]);
      checkSampledNumbers(stateVariables, samplednumbers);
    });
  });

  it("sample single discrete uniform number, assign name", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><sampleRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="u"/></p>
    <p><sampleRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="v"/></p>
    <p><sampleRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignnames="w"/></p>
    <p><copy assignNames="u2" source="u" /></p>
    <p><copy assignNames="v2" source="v" /></p>
    <p><copy assignNames="w2" source="w" /></p>
    `,
        },
        "*",
      );
    });

    let options = [3, 10];

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables["/u"];
      let u2 = stateVariables["/u2"];

      expect(options.includes(u.stateValues.value)).eq(true);
      expect(u.stateValues.value).eq(u2.stateValues.value);

      let v = stateVariables["/v"];
      let v2 = stateVariables["/v2"];
      expect(options.includes(v.stateValues.value)).eq(true);
      expect(v.stateValues.value).eq(v2.stateValues.value);

      let w = stateVariables["/w"];
      let w2 = stateVariables["/w2"];
      expect(options.includes(w.stateValues.value)).eq(true);
      expect(w.stateValues.value).eq(w2.stateValues.value);
    });
  });

  it("sample multiple uniform random numbers, assign names", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
      <sampleRandomNumbers name="s" from="3" to="13" assignnames="u v w" numSamples="6" displayDigits="10" />
    </aslist></p>
    <p><copy assignNames="u2" source="u" /></p>
    <p><copy assignNames="v2" source="v" /></p>
    <p><copy assignNames="w2" source="w" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let results = [];

    for (let ind = 0; ind < 6; ind++) {
      cy.get(cesc("#\\/_p1") + " > :nth-child(" + (2 * ind + 4) + ")")
        .invoke("text")
        .then((text) => {
          let num = Number(text);
          results[ind] = num;
          expect(num).gte(3);
          expect(num).lt(13);
        });
    }

    cy.log("check by name").then(() => {
      cy.get(cesc("#\\/u")).should("have.text", results[0]);
      cy.get(cesc("#\\/u2")).should("have.text", results[0]);
      cy.get(cesc("#\\/v")).should("have.text", results[1]);
      cy.get(cesc("#\\/v2")).should("have.text", results[1]);
      cy.get(cesc("#\\/w")).should("have.text", results[2]);
      cy.get(cesc("#\\/w2")).should("have.text", results[2]);
    });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables["/u"];
      let u2 = stateVariables["/u2"];
      expect(u.stateValues.value).closeTo(results[0], 1e-8);
      expect(u2.stateValues.value).closeTo(results[0], 1e-8);

      let v = stateVariables["/v"];
      let v2 = stateVariables["/v2"];
      expect(v.stateValues.value).closeTo(results[1], 1e-8);
      expect(v2.stateValues.value).closeTo(results[1], 1e-8);

      let w = stateVariables["/w"];
      let w2 = stateVariables["/w2"];
      expect(w.stateValues.value).closeTo(results[2], 1e-8);
      expect(w2.stateValues.value).closeTo(results[2], 1e-8);

      let s = stateVariables["/s"];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = stateVariables[s.replacements[ind].componentName];
        expect(r.stateValues.value).closeTo(results[ind], 1e-8);
      }
    });
  });

  it("sample multiple uniform random numbers, assign names, newNamespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
      <sampleRandomNumbers name="s" newnamespace from="3" to="13" assignnames="u v w" numSamples="6" displayDigits="10" />
    </aslist></p>
    <p><copy assignNames="u2" source="s/u" /></p>
    <p><copy assignNames="v2" source="s/v" /></p>
    <p><copy assignNames="w2" source="s/w" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let results = [];

    for (let ind = 0; ind < 6; ind++) {
      cy.get(cesc("#\\/_p1") + " > :nth-child(" + (2 * ind + 4) + ")")
        .invoke("text")
        .then((text) => {
          let num = Number(text);
          results[ind] = num;
          expect(num).gte(3);
          expect(num).lt(13);
        });
    }

    cy.log("check by name").then(() => {
      cy.get(cesc("#\\/s\\/u")).should("have.text", results[0]);
      cy.get(cesc("#\\/u2")).should("have.text", results[0]);
      cy.get(cesc("#\\/s\\/v")).should("have.text", results[1]);
      cy.get(cesc("#\\/v2")).should("have.text", results[1]);
      cy.get(cesc("#\\/s\\/w")).should("have.text", results[2]);
      cy.get(cesc("#\\/w2")).should("have.text", results[2]);
    });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables["/s/u"];
      let u2 = stateVariables["/u2"];
      expect(u.stateValues.value).closeTo(results[0], 1e-8);
      expect(u2.stateValues.value).closeTo(results[0], 1e-8);

      let v = stateVariables["/s/v"];
      let v2 = stateVariables["/v2"];
      expect(v.stateValues.value).closeTo(results[1], 1e-8);
      expect(v2.stateValues.value).closeTo(results[1], 1e-8);

      let w = stateVariables["/s/w"];
      let w2 = stateVariables["/w2"];
      expect(w.stateValues.value).closeTo(results[2], 1e-8);
      expect(w2.stateValues.value).closeTo(results[2], 1e-8);

      let s = stateVariables["/s"];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = stateVariables[s.replacements[ind].componentName];
        expect(r.stateValues.value).closeTo(results[ind], 1e-8);
      }
    });
  });

  it("copying parameters", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of samples <mathinput name="nSamples" prefill="10" /></p>
    <p>Specified type of random number <textinput name="type" /></p>
    <p>Specified mean <mathinput name="specifiedMean" prefill="0" /></p>
    <p>Specified variance <mathinput name="specifiedVariance" prefill="1" /></p>
    <p>Specified from <mathinput name="specifiedFrom" prefill="0" /></p>
    <p>Specified to <mathinput name="specifiedTo" prefill="1" /></p>
    <p>Specified step <mathinput name="specifiedStep" prefill="1" /></p>
    <p>Actual type: <copy prop="type" source="samples" obtainPropFromComposite assignNames="actualType" /></p>
    <p>Actual from: <copy prop="from" source="samples" obtainPropFromComposite assignNames="actualFrom" /></p>
    <p>Actual to: <copy prop="to" source="samples" obtainPropFromComposite assignNames="actualTo" /></p>
    <p>Actual step: <copy prop="step" source="samples" obtainPropFromComposite assignNames="actualStep" /></p>
    <p>Expected mean: <copy prop="mean" source="samples" obtainPropFromComposite assignNames="expectedMean" displayDigits="10" /></p>
    <p>Expected variance: <copy prop="variance" source="samples" obtainPropFromComposite assignNames="expectedVariance" displayDigits="10" /></p>
    <p>Expected standard deviation: <copy prop="standardDeviation" source="samples" obtainPropFromComposite assignNames="expectedStandardDeviation" displayDigits="10" /></p>
    <p>Resulting mean: <mean name="resultingMean" displayDigits="10">$samples</mean></p>
    <p>Resulting variance: <variance name="resultingVariance" displayDigits="10">$samples</variance></p>
    <p>Resulting standard deviation: <standardDeviation name="resultingStandardDeviation" displayDigits="10">$samples</standardDeviation></p>
    <p name="p1"><aslist>
      <sampleRandomNumbers name="samples" numSamples="$nSamples" type="$type" mean="$specifiedMean" variance="$specifiedVariance" from="$specifiedFrom" to="$specifiedTo" step="$specifiedStep" displayDigits="10" />
    </aslist></p>
    <p name="p2"><aslist><copy source="samples" /></aslist></p>
    <p name="p3"><copy source="_aslist1" /></p>

    <copy name="p4c" source="p1" assignNames="p4" />
    <copy name="p5c" source="p2" assignNames="p5" />
    <copy name="p6c" source="p3" assignNames="p6" />

    <copy name="p7c" source="p4c" assignNames="(p7)" />
    <copy name="p8c" source="p5" assignNames="p8" />
    <copy name="p9c" source="p6c" assignNames="(p9)" />

    <p>
      <copy prop="value" source="nSamples" assignNames="nSamplesa" />
      <copy prop="value" source="specifiedTo" assignNames="specifiedToa" />
      <copy prop="value" source="type" assignNames="typea" />
      <copy prop="value" source="specifiedVariance" assignNames="specifiedVariancea" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let checkSamples = function ({
      numSamples,
      specifiedType,
      specifiedMean,
      specifiedVariance,
      specifiedFrom,
      specifiedTo,
      specifiedStep,
      sampleComponent,
      allowedErrorInMean,
      allowedErrorInVariance,
      checkAllSamples = true,
      stateVariables,
    }) {
      let nReplacements = sampleComponent.replacements.length;
      if (sampleComponent.replacementsToWithhold) {
        nReplacements -= sampleComponent.replacementsToWithhold;
      }
      let samples = sampleComponent.replacements
        .slice(0, nReplacements)
        .map((x) => stateVariables[x.componentName].stateValues.value);
      expect(samples.length).eq(numSamples);

      cy.get(cesc("#\\/nSamples") + " .mq-editable-field")
        .invoke("text")
        .then((text) => {
          expect(
            text.replace(/[\s\u200B-\u200D\uFEFF]/g, "").replace(/−/, "-"),
          ).equal(numSamples.toString());
        });
      cy.get(cesc("#\\/type_input")).should("have.value", specifiedType);
      cy.get(cesc("#\\/specifiedMean") + " .mq-editable-field")
        .invoke("text")
        .then((text) => {
          expect(
            text.replace(/[\s\u200B-\u200D\uFEFF]/g, "").replace(/−/, "-"),
          ).equal(specifiedMean.toString());
        });
      cy.get(cesc("#\\/specifiedVariance") + " .mq-editable-field")
        .invoke("text")
        .then((text) => {
          expect(
            text.replace(/[\s\u200B-\u200D\uFEFF]/g, "").replace(/−/, "-"),
          ).equal(specifiedVariance.toString());
        });
      cy.get(cesc("#\\/specifiedFrom") + " .mq-editable-field")
        .invoke("text")
        .then((text) => {
          expect(
            text.replace(/[\s\u200B-\u200D\uFEFF]/g, "").replace(/−/, "-"),
          ).equal(specifiedFrom.toString());
        });
      cy.get(cesc("#\\/specifiedTo") + " .mq-editable-field")
        .invoke("text")
        .then((text) => {
          expect(
            text.replace(/[\s\u200B-\u200D\uFEFF]/g, "").replace(/−/, "-"),
          ).equal(specifiedTo.toString());
        });
      cy.get(cesc("#\\/specifiedStep") + " .mq-editable-field")
        .invoke("text")
        .then((text) => {
          expect(
            text.replace(/[\s\u200B-\u200D\uFEFF]/g, "").replace(/−/, "-"),
          ).equal(specifiedStep.toString());
        });

      let type = specifiedType.toLowerCase();
      if (!["gaussian", "uniform", "discreteuniform"].includes(type)) {
        type = "uniform";
      }

      cy.get(cesc("#\\/actualType")).should("have.text", type);

      let from = specifiedFrom;
      let to = specifiedTo;
      let step = specifiedStep;
      let expectedMean = specifiedMean;
      let expectedVariance = specifiedVariance;

      if (type === "uniform") {
        step = "NaN";
        expectedMean = (to + from) / 2;
        expectedVariance = (to - from) ** 2 / 12;
      } else if (type === "discreteuniform") {
        to = from + Math.floor((to - from) / step) * step;
        expectedMean = (to + from) / 2;
        expectedVariance =
          ((((to - from) / step + 1) ** 2 - 1) * step ** 2) / 12;
      } else {
        from = "NaN";
        to = "NaN";
        step = "NaN";
      }

      let expectedStandardDeviation = Math.sqrt(expectedVariance);

      cy.get(cesc(`#\\/actualFrom`)).should("have.text", from);
      cy.get(cesc(`#\\/actualTo`)).should("have.text", to);
      cy.get(cesc(`#\\/actualStep`)).should("have.text", step);
      cy.get(cesc(`#\\/expectedMean`))
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(expectedMean, 1e-8);
        });
      cy.get(cesc(`#\\/expectedVariance`))
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(expectedVariance, 1e-8);
        });
      cy.get(cesc(`#\\/expectedStandardDeviation`))
        .invoke("text")
        .then((text) => {
          expect(Number(text)).closeTo(expectedStandardDeviation, 1e-8);
        });

      let resultingMean = me.math.mean(samples);
      let resultingVariance = me.math.variance(samples);
      let resultingStandardDeviation = Math.sqrt(resultingVariance);

      cy.get(cesc(`#\\/resultingMean`) + ` .mjx-mrow`)
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(resultingMean, 1e-8);
          expect(resultingMean).closeTo(expectedMean, allowedErrorInMean);
        });
      cy.get(cesc(`#\\/resultingVariance`) + ` .mjx-mrow`)
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(
            resultingVariance,
            1e-8,
          );
          expect(resultingVariance).closeTo(
            expectedVariance,
            allowedErrorInVariance,
          );
        });
      cy.get(cesc(`#\\/resultingStandardDeviation`) + ` .mjx-mrow`)
        .invoke("text")
        .then((text) => {
          expect(Number(text.replace(/−/, "-"))).closeTo(
            resultingStandardDeviation,
            1e-8,
          );
          expect(resultingStandardDeviation).closeTo(
            expectedStandardDeviation,
            Math.sqrt(allowedErrorInVariance),
          );
        });

      if (checkAllSamples) {
        for (let ind = 1; ind <= 9; ind++) {
          cy.get(cesc(`#\\/p${ind}`))
            .invoke("text")
            .then((text) => {
              let numbers = text.split(",").map(Number);
              expect(numbers.length).eq(numSamples);
              for (let [i, num] of numbers.entries()) {
                expect(num).closeTo(samples[i], 1e-8);
              }
            });
        }
      }
    };

    let numSamples = 10;
    let specifiedType = "";
    let specifiedMean = 0;
    let specifiedVariance = 1;
    let specifiedFrom = 0;
    let specifiedTo = 1;
    let specifiedStep = 1;

    cy.log("initial values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numSamples,
        specifiedType,
        specifiedMean,
        specifiedVariance,
        specifiedFrom,
        specifiedTo,
        specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.4,
        allowedErrorInVariance: 0.4,
        stateVariables,
      });
    });

    cy.log("Increase number of samples").then(() => {
      numSamples = 50;
    });
    cy.get(cesc(`#\\/nSamples`) + ` textarea`).type(
      "{end}{backspace}{backspace}50{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/nSamplesa")).should("contain.text", "50");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numSamples,
        specifiedType,
        specifiedMean,
        specifiedVariance,
        specifiedFrom,
        specifiedTo,
        specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.2,
        allowedErrorInVariance: 0.2,
        checkAllSamples: false,
        stateVariables,
      });
    });

    cy.log("change from and to").then(() => {
      specifiedFrom = -3;
      specifiedTo = 0;
    });
    cy.get(cesc(`#\\/specifiedFrom`) + ` textarea`).type(
      "{end}{backspace}{backspace}-3{enter}",
      { force: true },
    );
    cy.get(cesc(`#\\/specifiedTo`) + ` textarea`).type(
      "{end}{backspace}{backspace}0{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/specifiedToa")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numSamples,
        specifiedType,
        specifiedMean,
        specifiedVariance,
        specifiedFrom,
        specifiedTo,
        specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.4,
        allowedErrorInVariance: 0.4,
        checkAllSamples: false,
        stateVariables,
      });
    });

    cy.log("change type to discrete uniform").then(() => {
      specifiedType = "discreteUniform";
    });
    cy.get(cesc(`#\\/type_input`)).clear().type("discreteUniform{enter}");
    cy.get(cesc("#\\/typea")).should("contain.text", "discreteUniform");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numSamples,
        specifiedType,
        specifiedMean,
        specifiedVariance,
        specifiedFrom,
        specifiedTo,
        specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.4,
        allowedErrorInVariance: 0.4,
        checkAllSamples: false,
        stateVariables,
      });
    });

    cy.log("change from, to, and step").then(() => {
      specifiedFrom = 3;
      specifiedTo = -8;
      specifiedStep = -4;
    });
    cy.get(cesc(`#\\/specifiedFrom`) + ` textarea`).type(
      "{end}{backspace}{backspace}3{enter}",
      { force: true },
    );
    cy.get(cesc(`#\\/specifiedStep`) + ` textarea`).type(
      "{end}{backspace}{backspace}-4{enter}",
      { force: true },
    );
    cy.get(cesc(`#\\/specifiedTo`) + ` textarea`).type(
      "{end}{backspace}{backspace}-8{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/specifiedToa")).should("contain.text", "−8");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numSamples,
        specifiedType,
        specifiedMean,
        specifiedVariance,
        specifiedFrom,
        specifiedTo,
        specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 1,
        allowedErrorInVariance: 3,
        checkAllSamples: false,
        stateVariables,
      });
    });

    cy.log("change type to gaussian").then(() => {
      specifiedType = "gaussian";
    });
    cy.get(cesc(`#\\/type_input`)).clear().type("gaussian{enter}");
    cy.get(cesc("#\\/typea")).should("contain.text", "gaussian");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numSamples,
        specifiedType,
        specifiedMean,
        specifiedVariance,
        specifiedFrom,
        specifiedTo,
        specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.8,
        allowedErrorInVariance: 0.8,
        checkAllSamples: false,
        stateVariables,
      });
    });

    cy.log("change mean and variance").then(() => {
      specifiedMean = -11;
      specifiedVariance = 3;
    });
    cy.get(cesc(`#\\/specifiedMean`) + ` textarea`).type(
      "{end}{backspace}{backspace}-11{enter}",
      { force: true },
    );
    cy.get(cesc(`#\\/specifiedVariance`) + ` textarea`).type(
      "{end}{backspace}{backspace}3{enter}",
      { force: true },
    );
    cy.get(cesc(`#\\/specifiedVariancea`)).should("contain.text", "3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numSamples,
        specifiedType,
        specifiedMean,
        specifiedVariance,
        specifiedFrom,
        specifiedTo,
        specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.8,
        allowedErrorInVariance: 3,
        checkAllSamples: false,
        stateVariables,
      });
    });

    cy.log("Increase number of samples").then(() => {
      numSamples = 200;
    });
    cy.get(cesc(`#\\/nSamples`) + ` textarea`).type(
      "{end}{backspace}{backspace}200{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/nSamplesa")).should("contain.text", "200");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numSamples,
        specifiedType,
        specifiedMean,
        specifiedVariance,
        specifiedFrom,
        specifiedTo,
        specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 0.4,
        allowedErrorInVariance: 0.8,
        checkAllSamples: false,
        stateVariables,
      });
    });

    cy.log("Decrease number of samples").then(() => {
      numSamples = 20;
    });
    cy.get(cesc(`#\\/nSamples`) + ` textarea`).type("{end}{backspace}{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/nSamplesa")).should("not.contain.text", "200");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkSamples({
        numSamples,
        specifiedType,
        specifiedMean,
        specifiedVariance,
        specifiedFrom,
        specifiedTo,
        specifiedStep,
        sampleComponent: stateVariables["/samples"],
        allowedErrorInMean: 1,
        allowedErrorInVariance: 3,
        checkAllSamples: true,
        stateVariables,
      });
    });
  });

  it(`different numbers when reload page if don't save state`, () => {
    let doenetML = `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let samples = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      samples = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(0);
        expect(sample).lte(1);
      }
    });

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );

      expect(samples2.length).eq(100);

      for (let [ind, sample] of samples2.entries()) {
        expect(sample).gt(0);
        expect(sample).lte(1);
        expect(sample).not.eq(samples[ind]);
      }
    });
  });

  it("same numbers when reload if save state", () => {
    let doenetML = `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <booleaninput name="bi" /><boolean name="b2" copySource="bi" />

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

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let samples = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      samples = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(0);
        expect(sample).lte(1);
      }
    });

    cy.log("interact so changes will be saved to database");
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b2")).should("have.text", "true");

    cy.log("wait for debounce");
    cy.wait(1500);

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.log("make sure core is up and running");
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b2")).should("have.text", "false");

    cy.log("check that values are unchanged");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );

      expect(samples2).eqls(samples);
    });
  });

  it("same numbers for given variant if variantDeterminesSeed", () => {
    let doenetML = `
    <text>a</text>
    <p><aslist>
    <map>
      <template><sampleRandomNumbers variantDeterminesSeed /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

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

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let samples = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      samples = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(sample).gt(0);
        expect(sample).lte(1);
      }
    });

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

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );

      expect(samples2).eqls(samples);
    });

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );

      expect(samples2.length).eq(100);

      for (let [ind, sample] of samples2.entries()) {
        expect(sample).gt(0);
        expect(sample).lte(1);
        expect(sample).not.eq(samples[ind]);
      }
    });
  });

  it("rounding", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><sampleRandomNumbers assignNames="n1" from="10" to="20" displayDigits="10" /></aslist></p>
    <p><aslist><sampleRandomNumbers assignNames="n2" from="10" to="20" displayDigits="3" /></aslist></p>
    <p><aslist><sampleRandomNumbers assignNames="n3" from="10" to="20" displayDecimals="3" /></aslist></p>
    <p><aslist><sampleRandomNumbers assignNames="n4" type="discreteUniform" from="10" to="20" displayDigits="3" padZeros /></aslist></p>

    <p><number name="n1a">$n1</number></p>
    <p><number name="n2a">$n2</number></p>
    <p><number name="n3a">$n3</number></p>
    <p><number name="n4a">$n4</number></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let n1 = stateVariables["/n1"].stateValues.value;
      let n2 = stateVariables["/n2"].stateValues.value;
      let n3 = stateVariables["/n3"].stateValues.value;
      let n4 = stateVariables["/n4"].stateValues.value;

      cy.get(cesc("#\\/n1")).should(
        "have.text",
        String(Math.round(n1 * 10 ** 8) / 10 ** 8),
      );
      cy.get(cesc("#\\/n2")).should(
        "have.text",
        String(Math.round(n2 * 10 ** 1) / 10 ** 1),
      );
      cy.get(cesc("#\\/n3")).should(
        "have.text",
        String(Math.round(n3 * 10 ** 3) / 10 ** 3),
      );
      cy.get(cesc("#\\/n4")).should("have.text", String(n4) + ".0");

      cy.get(cesc("#\\/n1a")).should(
        "have.text",
        String(Math.round(n1 * 10 ** 8) / 10 ** 8),
      );
      cy.get(cesc("#\\/n2a")).should(
        "have.text",
        String(Math.round(n2 * 10 ** 1) / 10 ** 1),
      );
      cy.get(cesc("#\\/n3a")).should(
        "have.text",
        String(Math.round(n3 * 10 ** 3) / 10 ** 3),
      );
      cy.get(cesc("#\\/n4a")).should("have.text", String(n4) + ".0");
    });
  });

  it(`resample random numbers`, () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
          <text>a</text>
          <p><aslist><sampleRandomNumbers name="srn1" assignNames="rn1 rn2" numSamples="2" from="1" to="10" /></aslist>,
          <sampleRandomNumbers name="srn2" assignNames="rn3" from="1000" to="10000" />
          </p>

          <p>
            <callAction name="resamp1" target="srn1" actionName="resample"><label>Resample first two</label></callAction>
            <callAction name="resamp2" target="srn2" actionName="resample"><label>Resample last</label></callAction>
          </p>
      
          `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let rn1, rn2, rn3;
    let rn1b, rn2b, rn3b;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      rn1 = stateVariables["/rn1"].stateValues.value;
      rn2 = stateVariables["/rn2"].stateValues.value;
      rn3 = stateVariables["/rn3"].stateValues.value;

      expect(rn1).gt(1).lt(10);
      expect(rn2).gt(1).lt(10);
      expect(rn3).gt(1000).lt(10000);

      let rn1Rounded = Math.round(rn1 * 100) / 100;

      cy.get(cesc2("#/rn1")).should("have.text", rn1Rounded.toString());

      cy.get(cesc2("#/resamp1")).click();

      cy.get(cesc2("#/rn1")).should("not.have.text", rn1Rounded.toString());
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      rn1b = stateVariables["/rn1"].stateValues.value;
      rn2b = stateVariables["/rn2"].stateValues.value;
      rn3b = stateVariables["/rn3"].stateValues.value;

      expect(rn1b).gt(1).lt(10);
      expect(rn2b).gt(1).lt(10);
      expect(rn3b).gt(1000).lt(10000);

      expect(rn1b).not.eq(rn1);
      expect(rn2b).not.eq(rn2);
      expect(rn3b).eq(rn3);

      let rn3Rounded = Math.round(rn3 * 100) / 100;

      cy.get(cesc2("#/rn3")).should("have.text", rn3Rounded.toString());

      cy.get(cesc2("#/resamp2")).click();

      cy.get(cesc2("#/rn3")).should("not.have.text", rn3Rounded.toString());
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let rn1c = stateVariables["/rn1"].stateValues.value;
      let rn2c = stateVariables["/rn2"].stateValues.value;
      let rn3c = stateVariables["/rn3"].stateValues.value;

      expect(rn1c).gt(1).lt(10);
      expect(rn2c).gt(1).lt(10);
      expect(rn3c).gt(1000).lt(10000);

      expect(rn1c).eq(rn1b);
      expect(rn2c).eq(rn2b);
      expect(rn3c).not.eq(rn3);
    });
  });

  function checkSampledNumbers(stateVariables, samplednumbers) {
    let n = samplednumbers.length;
    expect(
      stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
        .activeChildren.length,
    ).eq(n);
    expect(
      stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
        .activeChildren.length,
    ).eq(n);
    expect(
      stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
        .activeChildren.length,
    ).eq(n);
    expect(
      stateVariables[
        stateVariables[stateVariables["/p4"].replacements[0].componentName]
          .activeChildren[0].componentName
      ].activeChildren.length,
    ).eq(n);
    expect(
      stateVariables[
        stateVariables[stateVariables["/p5"].replacements[0].componentName]
          .activeChildren[0].componentName
      ].activeChildren.length,
    ).eq(n);
    expect(
      stateVariables[
        stateVariables[stateVariables["/p6"].replacements[0].componentName]
          .activeChildren[0].componentName
      ].activeChildren.length,
    ).eq(n);
    expect(
      stateVariables[
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren[0].componentName
      ].activeChildren.length,
    ).eq(n);
    expect(
      stateVariables[
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren[0].componentName
      ].activeChildren.length,
    ).eq(n);
    expect(
      stateVariables[
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren[0].componentName
      ].activeChildren.length,
    ).eq(n);
    for (let ind = 0; ind < n; ind++) {
      expect(
        stateVariables[
          stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
            .activeChildren[ind].componentName
        ].stateValues.value,
      ).eq(samplednumbers[ind]);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
            .activeChildren[ind].componentName
        ].stateValues.value,
      ).eq(samplednumbers[ind]);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
            .activeChildren[ind].componentName
        ].stateValues.value,
      ).eq(samplednumbers[ind]);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[stateVariables["/p4"].replacements[0].componentName]
              .activeChildren[0].componentName
          ].activeChildren[ind].componentName
        ].stateValues.value,
      ).eq(samplednumbers[ind]);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[stateVariables["/p5"].replacements[0].componentName]
              .activeChildren[0].componentName
          ].activeChildren[ind].componentName
        ].stateValues.value,
      ).eq(samplednumbers[ind]);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[stateVariables["/p6"].replacements[0].componentName]
              .activeChildren[0].componentName
          ].activeChildren[ind].componentName
        ].stateValues.value,
      ).eq(samplednumbers[ind]);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].replacements[0].componentName
            ].activeChildren[0].componentName
          ].activeChildren[ind].componentName
        ].stateValues.value,
      ).eq(samplednumbers[ind]);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].replacements[0].componentName
            ].activeChildren[0].componentName
          ].activeChildren[ind].componentName
        ].stateValues.value,
      ).eq(samplednumbers[ind]);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].replacements[0].componentName
            ].activeChildren[0].componentName
          ].activeChildren[ind].componentName
        ].stateValues.value,
      ).eq(samplednumbers[ind]);
    }
  }
});
