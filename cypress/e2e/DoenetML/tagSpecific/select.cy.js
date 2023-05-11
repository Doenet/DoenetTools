import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Select Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("no parameters, select doesn't do anything", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><select/></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_p1"].activeChildren.length).eq(0);
    });
  });

  it("select single math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select assignnames="(x1)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x2)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x3)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x4)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x5)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x6)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x7)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x8)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x9)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x10)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 10; ind++) {
        let x = stateVariables["/x" + ind].stateValues.value;
        expect(["u", "v", "w", "x", "y", "z"].includes(x)).eq(true);
      }
    });
  });

  it("select multiple maths", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select name="s1" assignnames="(x1)  (y1)  (z1)" numToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s2" assignnames="(x2)  (y2)  (z2)" numToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s3" assignnames="(x3)  (y3)  (z3)" numToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s4" assignnames="(x4)  (y4)  (z4)" numToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s5" assignnames="(x5)  (y5)  (z5)" numToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 5; ind++) {
        let x = stateVariables["/x" + ind].stateValues.value;
        let y = stateVariables["/y" + ind].stateValues.value;
        let z = stateVariables["/z" + ind].stateValues.value;

        expect(["u", "v", "w", "x", "y", "z"].includes(x)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(y)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(z)).eq(true);
        expect(x).not.eq(y);
        expect(x).not.eq(z);
        expect(y).not.eq(z);
      }
    });
  });

  it("select multiple maths, initially unresolved", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select name="s1" assignnames="(x1)  (y1)  (z1)" numToSelect="$n" >
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s2" assignnames="(x2)  (y2)  (z2)" numToSelect="$n">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s3" assignnames="(x3)  (y3)  (z3)" numToSelect="$n">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s4" assignnames="(x4)  (y4)  (z4)" numToSelect="$n">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s5" assignnames="(x5)  (y5)  (z5)" numToSelect="$n">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>

    <copy name="n2" target="n3" />
    <copy name="n" target="num1" />
    <math name="num1" simplify><copy target="n2" />+<copy target="num2" /></math>
    <math name="num2" simplify><copy target="n3" />+<copy target="num3" /></math>
    <copy name="n3" target="num3" />
    <number name="num3">1</number>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");
    cy.get(cesc("#\\/num1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 5; ind++) {
        let x = stateVariables["/x" + ind].stateValues.value;
        let y = stateVariables["/y" + ind].stateValues.value;
        let z = stateVariables["/z" + ind].stateValues.value;

        expect(["u", "v", "w", "x", "y", "z"].includes(x)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(y)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(z)).eq(true);
        expect(x).not.eq(y);
        expect(x).not.eq(z);
        expect(y).not.eq(z);
      }
    });
  });

  it("select multiple maths with namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select name="s1" assignnames="(x1)  (y1)  (z1)" numToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s2" assignnames="(x2)  (y2)  (z2)" numToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s3" assignnames="(x3)  (y3)  (z3)" numToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s4" assignnames="(x4)  (y4)  (z4)" numToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s5" assignnames="(x5)  (y5)  (z5)" numToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 5; ind++) {
        let x = stateVariables["/s" + ind + "/x" + ind].stateValues.value;
        let y = stateVariables["/s" + ind + "/y" + ind].stateValues.value;
        let z = stateVariables["/s" + ind + "/z" + ind].stateValues.value;

        expect(["u", "v", "w", "x", "y", "z"].includes(x)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(y)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(z)).eq(true);
        expect(x).not.eq(y);
        expect(x).not.eq(z);
        expect(y).not.eq(z);
      }
    });
  });

  it("select multiple maths, with replacement", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select name="s1" assignnames="(x1)  (y1)  (z1)" numToSelect="5" withReplacement>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s2" assignnames="(x2)  (y2)  (z2)" numToSelect="5" withReplacement>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s3" assignnames="(x3)  (y3)  (z3)" numToSelect="5" withReplacement>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s4" assignnames="(x4)  (y4)  (z4)" numToSelect="5" withReplacement>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s5" assignnames="(x5)  (y5)  (z5)" numToSelect="5" withReplacement>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 5; ind++) {
        let x = stateVariables["/x" + ind].stateValues.value;
        let y = stateVariables["/y" + ind].stateValues.value;
        let z = stateVariables["/z" + ind].stateValues.value;

        expect(["x", "y", "z"].includes(x)).eq(true);
        expect(["x", "y", "z"].includes(y)).eq(true);
        expect(["x", "y", "z"].includes(z)).eq(true);

        let s = stateVariables["/s" + ind];

        for (let i = 3; i < 5; i++) {
          expect(
            ["x", "y", "z"].includes(
              stateVariables[
                stateVariables[s.replacements[i].componentName].replacements[0]
                  .componentName
              ].stateValues.value,
            ),
          ).eq(true);
        }
      }
    });
  });

  it("copies don't resample", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>
    <aslist>
    <select name="s1">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s2">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>
    </p>

    <p>
    <aslist>
    <copy name="noresample1" target="s1" />
    <copy name="noresample2" target="s2" />
    <copy name="noreresample1" target="noresample1" />
    <copy name="noreresample2" target="noresample2" />
    </aslist>
    </p>

    <p>
    <copy name="noresamplelist" target="_aslist1" />
    </p>

    <p>
    <copy name="noreresamplelist" target="noresamplelist" />
    </p>

    <copy name="noresamplep" target="_p1" />
    <copy name="noreresamplep" target="noresamplep" />
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 =
        stateVariables[
          stateVariables[stateVariables["/s1"].replacements[0].componentName]
            .replacements[0].componentName
        ].stateValues.value;
      let x2 =
        stateVariables[
          stateVariables[stateVariables["/s2"].replacements[0].componentName]
            .replacements[0].componentName
        ].stateValues.value;
      expect(["u", "v", "w", "x", "y", "z"].includes(x1)).eq(true);
      expect(["u", "v", "w", "x", "y", "z"].includes(x2)).eq(true);

      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noresample1"].replacements[0].componentName
          ].replacements[0].componentName
        ].stateValues.value,
      ).eq(x1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noresample2"].replacements[0].componentName
          ].replacements[0].componentName
        ].stateValues.value,
      ).eq(x2);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noreresample1"].replacements[0].componentName
          ].replacements[0].componentName
        ].stateValues.value,
      ).eq(x1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noreresample2"].replacements[0].componentName
          ].replacements[0].componentName
        ].stateValues.value,
      ).eq(x2);

      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noresamplelist"].replacements[0].componentName
          ].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(x1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noresamplelist"].replacements[0].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(x2);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noreresamplelist"].replacements[0].componentName
          ].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(x1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noreresamplelist"].replacements[0].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(x2);

      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables["/noresamplep"].replacements[0].componentName
            ].activeChildren[1].componentName
          ].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(x1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables["/noresamplep"].replacements[0].componentName
            ].activeChildren[1].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(x2);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables["/noreresamplep"].replacements[0].componentName
            ].activeChildren[1].componentName
          ].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(x1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables["/noreresamplep"].replacements[0].componentName
            ].activeChildren[1].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(x2);
    });
  });

  it("select doesn't change dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number to select: <mathinput prefill="5" name="numToSelect"/></p>
    <p>First option: <mathinput prefill="a" name="x"/></p>
    <p>Second option: <mathinput prefill="b" name="y"/></p>
    <p>Third option: <mathinput prefill="c" name="z"/></p>
    <p name="pchoices">
    Selected choices: <aslist>
    <select name="sample1" withReplacement numToSelect="$numToSelect" assignNames="((v1)) ((v2)) ((v3)) ((v4)) ((v5)) ((v6)) ((v7))">
      <option><copy prop="value" target="x" /></option>
      <option><copy prop="value" target="y" /></option>
      <option><copy prop="value" target="z" /></option>
    </select>
    </aslist>
    </p>

    <p name="pchoices2">Selected choices: <aslist><copy name="noresample" target="sample1" assignNames="((w1)) ((w2)) ((w3)) ((w4)) ((w5)) ((w6)) ((w7))" /></aslist></p>

    <copy name="pchoices3" target="pchoices" />

    <p><copy prop="value" target="z" assignNames="z2" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let samplemaths;
    let sampleIndices;
    let names1 = ["/v1", "/v2", "/v3", "/v4", "/v5", "/v6", "/v7"];
    let names2 = ["/w1", "/w2", "/w3", "/w4", "/w5", "/w6", "/w7"];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let samplereplacements = stateVariables["/sample1"].replacements;
      expect(samplereplacements.length).eq(5);
      samplemaths = samplereplacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );
      for (let val of samplemaths) {
        expect(["a", "b", "c"].includes(val)).eq(true);
      }

      // let choices2 = stateVariables['/pchoices2'].activeChildren[1].activeChildren;
      // let choices3 = stateVariables['/pchoices3'].replacements[0].activeChildren[1].activeChildren;
      // expect(choices2.length).eq(5);
      // expect(choices3.length).eq(5);

      for (let ind = 0; ind < 5; ind++) {
        expect(stateVariables[names1[ind]].stateValues.value).eq(
          samplemaths[ind],
        );
        expect(stateVariables[names2[ind]].stateValues.value).eq(
          samplemaths[ind],
        );
      }
      expect(stateVariables[names1[5]]).eq(undefined);
      expect(stateVariables[names2[5]]).eq(undefined);

      sampleIndices = samplemaths.map((x) => ["a", "b", "c"].indexOf(x) + 1);
      expect(stateVariables["/sample1"].stateValues.selectedIndices).eqls(
        sampleIndices,
      );
      // expect(stateVariables["/noresample"].replacements[0].stateValues.selectedIndices).eqls(sampleIndices)
      // expect(stateVariables['/pchoices3'].replacements[0].activeChildren[1].definingChildren[0].stateValues.selectedIndices).eqls(sampleIndices)
    });

    cy.log("Nothing changes when change number to select");
    cy.get(cesc("#\\/numToSelect") + " textarea").type(
      `{end}{backspace}7{enter}`,
      { force: true },
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let samplereplacements = stateVariables["/sample1"].replacements;
      let samplemaths2 = samplereplacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );

      // let choices2 = stateVariables['/pchoices2'].activeChildren[1].activeChildren;
      // let choices3 = stateVariables['/pchoices3'].replacements[0].activeChildren[1].activeChildren;

      expect(samplereplacements.length).eq(5);
      for (let ind = 0; ind < 5; ind++) {
        expect(samplemaths2).eqls(samplemaths);
        expect(stateVariables[names1[ind]].stateValues.value).eq(
          samplemaths[ind],
        );
        expect(stateVariables[names2[ind]].stateValues.value).eq(
          samplemaths[ind],
        );
      }
      expect(stateVariables[names1[5]]).eq(undefined);
      expect(stateVariables[names2[5]]).eq(undefined);

      expect(stateVariables["/sample1"].stateValues.selectedIndices).eqls(
        sampleIndices,
      );
      // expect(stateVariables["/noresample"].replacements[0].stateValues.selectedIndices).eqls(sampleIndices)
      // expect(stateVariables['/pchoices3'].replacements[0].activeChildren[1].definingChildren[0].stateValues.selectedIndices).eqls(sampleIndices)
    });

    cy.log("Values change to reflect copy sources");

    let newvalues = {
      a: "q",
      b: "r",
      c: "s",
    };
    cy.get(cesc("#\\/x") + " textarea").type(
      "{end}{backspace}" + newvalues.a + `{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/y") + " textarea").type(
      "{end}{backspace}" + newvalues.b + `{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/z") + " textarea").type(
      "{end}{backspace}" + newvalues.c + `{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/z2")).should("contain.text", newvalues.c);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let samplereplacements = stateVariables["/sample1"].replacements;
      let samplemaths3 = samplereplacements.map(
        (x) =>
          stateVariables[
            stateVariables[
              stateVariables[x.componentName].replacements[0].componentName
            ].replacements[0].componentName
          ].stateValues.value,
      );

      expect(samplereplacements.length).eq(5);
      // expect(choices2.length).eq(5);
      // expect(choices3.length).eq(5);
      for (let ind = 0; ind < 5; ind++) {
        expect(samplemaths3[ind]).eq(newvalues[samplemaths[ind]]);
        expect(stateVariables[names1[ind]].stateValues.value).eq(
          newvalues[samplemaths[ind]],
        );
        expect(stateVariables[names2[ind]].stateValues.value).eq(
          newvalues[samplemaths[ind]],
        );
      }
      expect(stateVariables[names1[5]]).eq(undefined);
      expect(stateVariables[names2[5]]).eq(undefined);

      expect(stateVariables["/sample1"].stateValues.selectedIndices).eqls(
        sampleIndices,
      );
      // expect(stateVariables["/noresample"].replacements[0].stateValues.selectedIndices).eqls(sampleIndices)
      // expect(stateVariables['/pchoices3'].replacements[0].activeChildren[1].definingChildren[0].stateValues.selectedIndices).eqls(sampleIndices)
    });
  });

  it("select doesn't resample in dynamic map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    How many variables do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnames="a b c d e f">
      <template newNamespace>
        <select assignnames="(n)">
          <option><math>u</math></option>
          <option><math>v</math></option>
          <option><math>w</math></option>
          <option><math>x</math></option>
          <option><math>y</math></option>
          <option><math>z</math></option>
          <option><math>p</math></option>
          <option><math>q</math></option>
          <option><math>r</math></option>
          <option><math>s</math></option>
          <option><math>t</math></option>
        </select>
      </template>
      <sources>
      <sequence length="$_mathinput1"/>
      </sources>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist><copy target="_map1" /></aslist></p>
    <p name="p3"><copy target="_aslist1" /></p>

    <copy name="p4" target="p1" />
    <copy name="p5" target="p2" />
    <copy name="p6" target="p3" />

    <copy name="p7" target="p4" />
    <copy name="p8" target="p5" />
    <copy name="p9" target="p6" />
    <p><copy prop="value" target="_mathinput1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let sampledvariables = [];

    cy.log("initially nothing");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
    });

    cy.log("sample one variable");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}1{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      sampledvariables.push(n1);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      for (let ind = 0; ind < 1; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
      }
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
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
      expect(n1).eq(sampledvariables[0]);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);

      for (let ind = 0; ind < 1; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
      }
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
      expect(n1).eq(sampledvariables[0]);
      sampledvariables.push(n2);
      sampledvariables.push(n3);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      for (let ind = 0; ind < 3; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
      }
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
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
      expect(n1).eq(sampledvariables[0]);
      expect(n2).eq(sampledvariables[1]);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);

      for (let ind = 0; ind < 2; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
      }
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
      expect(n1).eq(sampledvariables[0]);
      expect(n2).eq(sampledvariables[1]);
      expect(n3).eq(sampledvariables[2]);
      sampledvariables.push(n4);
      sampledvariables.push(n5);
      sampledvariables.push(n6);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
      }
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
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
      expect(n1).eq(sampledvariables[0]);
      expect(n2).eq(sampledvariables[1]);
      expect(n3).eq(sampledvariables[2]);
      expect(n4).eq(sampledvariables[3]);
      expect(n5).eq(sampledvariables[4]);
      expect(n6).eq(sampledvariables[5]);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
      }
    });
  });

  it("select single group of maths, assign names to grandchildren", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <p name="p1"><aslist><select assignnames="(x1 y1 z1)">
      <option><math>u</math><math>v</math><math>w</math></option>
      <option><math>x</math><math>y</math><math>z</math></option>
      <option><math>a</math><math>b</math><math>c</math></option>
      <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="p2"><aslist><select assignnames="(x2 y2 z2)">
      <option><math>u</math><math>v</math><math>w</math></option>
      <option><math>x</math><math>y</math><math>z</math></option>
      <option><math>a</math><math>b</math><math>c</math></option>
      <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="p3"><aslist><select assignnames="(x3 y3 z3)">
      <option><math>u</math><math>v</math><math>w</math></option>
      <option><math>x</math><math>y</math><math>z</math></option>
      <option><math>a</math><math>b</math><math>c</math></option>
      <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="q1"><aslist><copy target="x1" /><copy target="y1" /><copy target="z1" /></aslist></p>
    <p name="q2"><aslist><copy target="x2" /><copy target="y2" /><copy target="z2" /></aslist></p>
    <p name="q3"><aslist><copy target="x3" /><copy target="y3" /><copy target="z3" /></aslist></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    let lists = {
      x: ["x", "y", "z"],
      u: ["u", "v", "w"],
      a: ["a", "b", "c"],
      q: ["q", "r", "s"],
    };

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = stateVariables["/x1"].stateValues.value;
      let y1 = stateVariables["/y1"].stateValues.value;
      let z1 = stateVariables["/z1"].stateValues.value;
      let x2 = stateVariables["/x2"].stateValues.value;
      let y2 = stateVariables["/y2"].stateValues.value;
      let z2 = stateVariables["/z2"].stateValues.value;
      let x3 = stateVariables["/x3"].stateValues.value;
      let y3 = stateVariables["/y3"].stateValues.value;
      let z3 = stateVariables["/z3"].stateValues.value;

      let list1 = lists[x1];
      let list2 = lists[x2];
      let list3 = lists[x3];

      expect(y1).eq(list1[1]);
      expect(z1).eq(list1[2]);
      expect(y2).eq(list2[1]);
      expect(z2).eq(list2[2]);
      expect(y3).eq(list3[1]);
      expect(z3).eq(list3[2]);

      for (let name of ["/p1", "/q1"]) {
        let aslistChildren = stateVariables[
          stateVariables[name].activeChildren[0].componentName
        ].activeChildren.map((x) => stateVariables[x.componentName]);
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value).eq(list1[ind]);
        }
      }
      for (let name of ["/p2", "/q2"]) {
        let aslistChildren = stateVariables[
          stateVariables[name].activeChildren[0].componentName
        ].activeChildren.map((x) => stateVariables[x.componentName]);
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value).eq(list2[ind]);
        }
      }
      for (let name of ["/p3", "/q3"]) {
        let aslistChildren = stateVariables[
          stateVariables[name].activeChildren[0].componentName
        ].activeChildren.map((x) => stateVariables[x.componentName]);
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value).eq(list3[ind]);
        }
      }
    });
  });

  it("select single group of maths, assign names with namespace to grandchildren", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <p name="p1"><aslist><select assignnames="(x y z)" name="s1" newnamespace>
      <option><math>u</math><math>v</math><math>w</math></option>
      <option><math>x</math><math>y</math><math>z</math></option>
      <option><math>a</math><math>b</math><math>c</math></option>
      <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="p2"><aslist><select assignnames="(x y z)" name="s2" newnamespace>
    <option><math>u</math><math>v</math><math>w</math></option>
    <option><math>x</math><math>y</math><math>z</math></option>
    <option><math>a</math><math>b</math><math>c</math></option>
    <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="p3"><aslist><select assignnames="(x y z)" name="s3" newnamespace>
    <option><math>u</math><math>v</math><math>w</math></option>
    <option><math>x</math><math>y</math><math>z</math></option>
    <option><math>a</math><math>b</math><math>c</math></option>
    <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="q1"><aslist><copy target="s1/x" /><copy target="s1/y" /><copy target="s1/z" /></aslist></p>
    <p name="q2"><aslist><copy target="s2/x" /><copy target="s2/y" /><copy target="s2/z" /></aslist></p>
    <p name="q3"><aslist><copy target="s3/x" /><copy target="s3/y" /><copy target="s3/z" /></aslist></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    let lists = {
      x: ["x", "y", "z"],
      u: ["u", "v", "w"],
      a: ["a", "b", "c"],
      q: ["q", "r", "s"],
    };

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = stateVariables["/s1/x"].stateValues.value;
      let y1 = stateVariables["/s1/y"].stateValues.value;
      let z1 = stateVariables["/s1/z"].stateValues.value;
      let x2 = stateVariables["/s2/x"].stateValues.value;
      let y2 = stateVariables["/s2/y"].stateValues.value;
      let z2 = stateVariables["/s2/z"].stateValues.value;
      let x3 = stateVariables["/s3/x"].stateValues.value;
      let y3 = stateVariables["/s3/y"].stateValues.value;
      let z3 = stateVariables["/s3/z"].stateValues.value;

      let list1 = lists[x1];
      let list2 = lists[x2];
      let list3 = lists[x3];

      expect(y1).eq(list1[1]);
      expect(z1).eq(list1[2]);
      expect(y2).eq(list2[1]);
      expect(z2).eq(list2[2]);
      expect(y3).eq(list3[1]);
      expect(z3).eq(list3[2]);

      for (let name of ["/p1", "/q1"]) {
        let aslistChildren = stateVariables[
          stateVariables[name].activeChildren[0].componentName
        ].activeChildren.map((x) => stateVariables[x.componentName]);
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value).eq(list1[ind]);
        }
      }
      for (let name of ["/p2", "/q2"]) {
        let aslistChildren = stateVariables[
          stateVariables[name].activeChildren[0].componentName
        ].activeChildren.map((x) => stateVariables[x.componentName]);
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value).eq(list2[ind]);
        }
      }
      for (let name of ["/p3", "/q3"]) {
        let aslistChildren = stateVariables[
          stateVariables[name].activeChildren[0].componentName
        ].activeChildren.map((x) => stateVariables[x.componentName]);
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value).eq(list3[ind]);
        }
      }
    });
  });

  it("select multiple group of maths, assign names to grandchildren", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <p name="p1"><aslist>
      <select assignnames="(x1 y1 z1) (x2 y2 z2) (x3 y3 z3)" numToSelect="3">
        <option><math>u</math><math>v</math><math>w</math></option>
        <option><math>x</math><math>y</math><math>z</math></option>
        <option><math>a</math><math>b</math><math>c</math></option>
        <option><math>q</math><math>r</math><math>s</math></option>
      </select>
    </aslist></p>
    <p name="q1"><aslist>
      <copy target="x1" /><copy target="y1" /><copy target="z1" />
      <copy target="x2" /><copy target="y2" /><copy target="z2" />
      <copy target="x3" /><copy target="y3" /><copy target="z3" />
    </aslist></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    let lists = {
      x: ["x", "y", "z"],
      u: ["u", "v", "w"],
      a: ["a", "b", "c"],
      q: ["q", "r", "s"],
    };

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = stateVariables["/x1"].stateValues.value;
      let y1 = stateVariables["/y1"].stateValues.value;
      let z1 = stateVariables["/z1"].stateValues.value;
      let x2 = stateVariables["/x2"].stateValues.value;
      let y2 = stateVariables["/y2"].stateValues.value;
      let z2 = stateVariables["/z2"].stateValues.value;
      let x3 = stateVariables["/x3"].stateValues.value;
      let y3 = stateVariables["/y3"].stateValues.value;
      let z3 = stateVariables["/z3"].stateValues.value;

      let list1 = lists[x1];
      let list2 = lists[x2];
      let list3 = lists[x3];

      let listsByInd = [list1, list2, list3];

      expect(x1).not.eq(x2);
      expect(x1).not.eq(x3);
      expect(x2).not.eq(x3);

      expect(y1).eq(list1[1]);
      expect(z1).eq(list1[2]);
      expect(y2).eq(list2[1]);
      expect(z2).eq(list2[2]);
      expect(y3).eq(list3[1]);
      expect(z3).eq(list3[2]);

      for (let name of ["/p1", "/q1"]) {
        let aslistChildren = stateVariables[
          stateVariables[name].activeChildren[0].componentName
        ].activeChildren.map((x) => stateVariables[x.componentName]);
        for (let ind1 = 0; ind1 < 3; ind1++) {
          for (let ind2 = 0; ind2 < 3; ind2++) {
            expect(aslistChildren[ind1 * 3 + ind2].stateValues.value).eq(
              listsByInd[ind1][ind2],
            );
          }
        }
      }
    });
  });

  it("references to outside components", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <math hide name="x1">x</math>
    <math hide name="x2">y</math>
    <math hide name="x3">z</math>

    <select assignnames="q r s t u" numToSelect="5" withreplacement>
      <option newNamespace><p>Option 1: <math>3<copy target="../x1" /><copy target="../y1" /></math></p></option>
      <option><p name="h" newnamespace>Option 2: <math>4<copy target="../x2" /><copy target="../y2" /></math></p></option>
      <option newNamespace><p name="l">Option 3: <math>5<copy target="../x3" /><copy target="../y3" /></math></p></option>
    </select>

    <math hide name="y1">a</math>
    <math hide name="y2">b</math>
    <math hide name="y3">c</math>

    <p>Selected options repeated</p>
    <copy name="q2" target="q" />
    <copy name="r2" target="r" />
    <copy name="s2" target="s" />
    <copy name="t2" target="t" />
    <copy name="u2" target="u" />

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    let option = {
      "Option 1: ": me.fromText("3xa"),
      "Option 2: ": me.fromText("4yb"),
      "Option 3: ": me.fromText("5zc"),
    };

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let q2 =
        stateVariables[
          stateVariables[stateVariables["/q2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let q2string = q2[0];
      let q2math = me.fromAst(
        stateVariables[q2[1].componentName].stateValues.value,
      );
      expect(q2math.equals(option[q2string])).eq(true);

      let r2 =
        stateVariables[
          stateVariables[stateVariables["/r2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let r2string = r2[0];
      let r2math = me.fromAst(
        stateVariables[r2[1].componentName].stateValues.value,
      );
      expect(r2math.equals(option[r2string])).eq(true);

      let s2 =
        stateVariables[
          stateVariables[stateVariables["/s2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let s2string = s2[0];
      let s2math = me.fromAst(
        stateVariables[s2[1].componentName].stateValues.value,
      );
      expect(s2math.equals(option[s2string])).eq(true);

      let t2 =
        stateVariables[
          stateVariables[stateVariables["/t2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let t2string = t2[0];
      let t2math = me.fromAst(
        stateVariables[t2[1].componentName].stateValues.value,
      );
      expect(t2math.equals(option[t2string])).eq(true);

      let u2 =
        stateVariables[
          stateVariables[stateVariables["/u2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let u2string = u2[0];
      let u2math = me.fromAst(
        stateVariables[u2[1].componentName].stateValues.value,
      );
      expect(u2math.equals(option[u2string])).eq(true);
    });
  });

  it("references to outside components, no new namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <math hide name="x1">x</math>
    <math hide name="x2">y</math>
    <math hide name="x3">z</math>

    <select assignnames="q r s t u" numToSelect="5" withreplacement>
      <option><p>Option 1: <math>3<copy target="x1" /><copy target="y1" /></math></p></option>
      <option><p name="h">Option 2: <math>4<copy target="x2" /><copy target="y2" /></math></p></option>
      <option><p name="l">Option 3: <math>5<copy target="x3" /><copy target="y3" /></math></p></option>
    </select>

    <math hide name="y1">a</math>
    <math hide name="y2">b</math>
    <math hide name="y3">c</math>

    <p>Selected options repeated</p>
    <copy name="q2" target="q" />
    <copy name="r2" target="r" />
    <copy name="s2" target="s" />
    <copy name="t2" target="t" />
    <copy name="u2" target="u" />

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    let option = {
      "Option 1: ": me.fromText("3xa"),
      "Option 2: ": me.fromText("4yb"),
      "Option 3: ": me.fromText("5zc"),
    };

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let q2 =
        stateVariables[
          stateVariables[stateVariables["/q2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let q2string = q2[0];
      let q2math = me.fromAst(
        stateVariables[q2[1].componentName].stateValues.value,
      );
      expect(q2math.equals(option[q2string])).eq(true);

      let r2 =
        stateVariables[
          stateVariables[stateVariables["/r2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let r2string = r2[0];
      let r2math = me.fromAst(
        stateVariables[r2[1].componentName].stateValues.value,
      );
      expect(r2math.equals(option[r2string])).eq(true);

      let s2 =
        stateVariables[
          stateVariables[stateVariables["/s2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let s2string = s2[0];
      let s2math = me.fromAst(
        stateVariables[s2[1].componentName].stateValues.value,
      );
      expect(s2math.equals(option[s2string])).eq(true);

      let t2 =
        stateVariables[
          stateVariables[stateVariables["/t2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let t2string = t2[0];
      let t2math = me.fromAst(
        stateVariables[t2[1].componentName].stateValues.value,
      );
      expect(t2math.equals(option[t2string])).eq(true);

      let u2 =
        stateVariables[
          stateVariables[stateVariables["/u2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let u2string = u2[0];
      let u2math = me.fromAst(
        stateVariables[u2[1].componentName].stateValues.value,
      );
      expect(u2math.equals(option[u2string])).eq(true);
    });
  });

  it("internal references", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <select assignnames="q r s t u" numToSelect="5" withreplacement>
      <option newNamespace><p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + <copy target="x" />^2<copy target="z1" />^3</math></p></option>
      <option newNamespace><p>Option 2: <math>4<math name="x">y</math> + <math name="z2">b</math> + <copy target="x" />^2<copy target="z2" />^3</math></p></option>
      <option newNamespace><p>Option 3: <math>5<math name="x">z</math> + <math name="z3">c</math> + <copy target="x" />^2<copy target="z3" />^3</math></p></option>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" target="q" />
    <copy name="r2" target="r" />
    <copy name="s2" target="s" />
    <copy name="t2" target="t" />
    <copy name="u2" target="u" />

    <p>Copy x from within selection options</p>
    <p><copy name="qx" target="q/x" /></p>
    <p><copy name="rx" target="r/x" /></p>
    <p><copy name="sx" target="s/x" /></p>
    <p><copy name="tx" target="t/x" /></p>
    <p><copy name="ux" target="u/x" /></p>

    <p>Copy select itself</p>
    <section name="repeat"><copy target="_select1" /></section>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let option = {
      "Option 1: ": me.fromText("3x+a+x^2a^3"),
      "Option 2: ": me.fromText("4y+b+y^2b^3"),
      "Option 3: ": me.fromText("5z+c+z^2c^3"),
    };

    let xoption = {
      "Option 1: ": "x",
      "Option 2: ": "y",
      "Option 3: ": "z",
    };

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let q2 =
        stateVariables[
          stateVariables[stateVariables["/q2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let q2string = q2[0];
      let q2math = me.fromAst(
        stateVariables[q2[1].componentName].stateValues.value,
      );
      expect(q2math.equals(option[q2string])).eq(true);
      let qx =
        stateVariables[stateVariables["/qx"].replacements[0].componentName]
          .stateValues.value;
      expect(qx).eq(xoption[q2string]);
      let repeatqmath = me.fromAst(
        stateVariables[
          stateVariables[
            stateVariables["/repeat"].activeChildren[0].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(repeatqmath.equals(option[q2string])).eq(true);

      let r2 =
        stateVariables[
          stateVariables[stateVariables["/r2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let r2string = r2[0];
      let r2math = me.fromAst(
        stateVariables[r2[1].componentName].stateValues.value,
      );
      expect(r2math.equals(option[r2string])).eq(true);
      let rx =
        stateVariables[stateVariables["/rx"].replacements[0].componentName]
          .stateValues.value;
      expect(rx).eq(xoption[r2string]);
      let repeatrmath = me.fromAst(
        stateVariables[
          stateVariables[
            stateVariables["/repeat"].activeChildren[1].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(repeatrmath.equals(option[r2string])).eq(true);

      let s2 =
        stateVariables[
          stateVariables[stateVariables["/s2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let s2string = s2[0];
      let s2math = me.fromAst(
        stateVariables[s2[1].componentName].stateValues.value,
      );
      expect(s2math.equals(option[s2string])).eq(true);
      let sx =
        stateVariables[stateVariables["/sx"].replacements[0].componentName]
          .stateValues.value;
      expect(sx).eq(xoption[s2string]);
      let repeatsmath = me.fromAst(
        stateVariables[
          stateVariables[
            stateVariables["/repeat"].activeChildren[2].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(repeatsmath.equals(option[s2string])).eq(true);

      let t2 =
        stateVariables[
          stateVariables[stateVariables["/t2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let t2string = t2[0];
      let t2math = me.fromAst(
        stateVariables[t2[1].componentName].stateValues.value,
      );
      expect(t2math.equals(option[t2string])).eq(true);
      let tx =
        stateVariables[stateVariables["/tx"].replacements[0].componentName]
          .stateValues.value;
      expect(tx).eq(xoption[t2string]);
      let repeattmath = me.fromAst(
        stateVariables[
          stateVariables[
            stateVariables["/repeat"].activeChildren[3].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(repeattmath.equals(option[t2string])).eq(true);

      let u2 =
        stateVariables[
          stateVariables[stateVariables["/u2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let u2string = u2[0];
      let u2math = me.fromAst(
        stateVariables[u2[1].componentName].stateValues.value,
      );
      expect(u2math.equals(option[u2string])).eq(true);
      let ux =
        stateVariables[stateVariables["/ux"].replacements[0].componentName]
          .stateValues.value;
      expect(ux).eq(xoption[u2string]);
      let repeatumath = me.fromAst(
        stateVariables[
          stateVariables[
            stateVariables["/repeat"].activeChildren[4].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(repeatumath.equals(option[u2string])).eq(true);
    });
  });

  it("internal references with no new namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <select assignnames="q r s t u" numToSelect="5" withreplacement>
      <option><p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + <copy target="x" />^2<copy target="z1" />^3</math></p></option>
      <option><p>Option 2: <math>4<math name="y">y</math> + <math name="z2">b</math> + <copy target="y" />^2<copy target="z2" />^3</math></p></option>
      <option><p>Option 3: <math>5<math name="z">z</math> + <math name="z3">c</math> + <copy target="z" />^2<copy target="z3" />^3</math></p></option>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" target="q" />
    <copy name="r2" target="r" />
    <copy name="s2" target="s" />
    <copy name="t2" target="t" />
    <copy name="u2" target="u" />

    <p>Copy select itself</p>
    <section name="repeat"><copy target="_select1" /></section>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let option = {
      "Option 1: ": me.fromText("3x+a+x^2a^3"),
      "Option 2: ": me.fromText("4y+b+y^2b^3"),
      "Option 3: ": me.fromText("5z+c+z^2c^3"),
    };

    let xoption = {
      "Option 1: ": "x",
      "Option 2: ": "y",
      "Option 3: ": "z",
    };

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let q2 =
        stateVariables[
          stateVariables[stateVariables["/q2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let q2string = q2[0];
      let q2math = me.fromAst(
        stateVariables[q2[1].componentName].stateValues.value,
      );
      expect(q2math.equals(option[q2string])).eq(true);
      let repeatqmath = me.fromAst(
        stateVariables[
          stateVariables[
            stateVariables["/repeat"].activeChildren[0].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(repeatqmath.equals(option[q2string])).eq(true);

      let r2 =
        stateVariables[
          stateVariables[stateVariables["/r2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let r2string = r2[0];
      let r2math = me.fromAst(
        stateVariables[r2[1].componentName].stateValues.value,
      );
      expect(r2math.equals(option[r2string])).eq(true);
      let repeatrmath = me.fromAst(
        stateVariables[
          stateVariables[
            stateVariables["/repeat"].activeChildren[1].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(repeatrmath.equals(option[r2string])).eq(true);

      let s2 =
        stateVariables[
          stateVariables[stateVariables["/s2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let s2string = s2[0];
      let s2math = me.fromAst(
        stateVariables[s2[1].componentName].stateValues.value,
      );
      expect(s2math.equals(option[s2string])).eq(true);
      let repeatsmath = me.fromAst(
        stateVariables[
          stateVariables[
            stateVariables["/repeat"].activeChildren[2].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(repeatsmath.equals(option[s2string])).eq(true);

      let t2 =
        stateVariables[
          stateVariables[stateVariables["/t2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let t2string = t2[0];
      let t2math = me.fromAst(
        stateVariables[t2[1].componentName].stateValues.value,
      );
      expect(t2math.equals(option[t2string])).eq(true);
      let repeattmath = me.fromAst(
        stateVariables[
          stateVariables[
            stateVariables["/repeat"].activeChildren[3].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(repeattmath.equals(option[t2string])).eq(true);

      let u2 =
        stateVariables[
          stateVariables[stateVariables["/u2"].replacements[0].componentName]
            .replacements[0].componentName
        ].activeChildren;
      let u2string = u2[0];
      let u2math = me.fromAst(
        stateVariables[u2[1].componentName].stateValues.value,
      );
      expect(u2math.equals(option[u2string])).eq(true);
      let repeatumath = me.fromAst(
        stateVariables[
          stateVariables[
            stateVariables["/repeat"].activeChildren[4].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(repeatumath.equals(option[u2string])).eq(true);
    });
  });

  it("variant names specified, select single", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <variantControl nvariants="5" variantNames="aVocado  broCColi   carrot  Dill eggplanT"/>

    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariants="dill"><math>d</math></option>
      <option selectForVariants="Carrot"><math>c</math></option>
      <option selectForVariants="eggPlant"><math>e</math></option>
      <option selectForVariants="avocadO"><math>a</math></option>
      <option selectForVariants="broccOli"><math>b</math></option>
    </select>
    </p>

    <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    `,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // let variantName = stateVariables['/x'].sharedParameters.variantName;
      // let expectedx = variantName.substring(0, 1);
      let expectedx = "b";

      let x = stateVariables["/x"].stateValues.value;

      expect(x).eq(expectedx);

      let xorig =
        stateVariables[
          stateVariables[
            stateVariables["/_select1"].replacements[0].componentName
          ].replacements[0].componentName
        ].stateValues.value;
      expect(xorig).eq(expectedx);

      let x2 =
        stateVariables[stateVariables["/x2"].replacements[0].componentName]
          .stateValues.value;
      expect(x2).eq(expectedx);

      let x3 =
        stateVariables[
          stateVariables[stateVariables["/x3"].replacements[0].componentName]
            .replacements[0].componentName
        ].stateValues.value;
      expect(x3).eq(expectedx);
    });
  });

  it("variant names specified, select multiple", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <variantControl nvariants="5" variantNames="avocado  brOccoli   carrot  dill    eggPlant  "/>

    <p>Selected variables:
    <aslist>
    <select assignnames="(x)  (y)  (z)" numToSelect="3">
      <option selectForVariants="dill  carrot  avocado"><math>d</math></option>
      <option selectForVariants="cArrOt eggplant eggplant"><math>c</math></option>
      <option selectForVariants="eggplant  broccoli  dilL"><math>e</math></option>
      <option selectForVariants="aVocado   avocado   broccoli"><math>a</math></option>
      <option selectForVariants="  broccoli     caRRot     dill    "><math>b</math></option>
    </select>
    </aslist>
    </p>

    <p>Selected first variable: <copy name="x2" target="x" /></p>
    <p>Selected second variable: <copy name="y2" target="y" /></p>
    <p>Selected third variable: <copy name="z2" target="z" /></p>
    <p>Selected variables repeated: <aslist><copy name="s2" target="_select1" /></aslist></p>

    `,
          requestedVariantIndex: 3,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let variantMap = {
        avocado: ["d", "a", "a"],
        broccoli: ["e", "a", "b"],
        carrot: ["d", "c", "b"],
        dill: ["d", "e", "b"],
        eggplant: ["c", "c", "e"],
      };

      // let variantName = stateVariables['/x'].sharedParameters.variantName;
      let variantName = "carrot";
      let variantVars = variantMap[variantName];

      let x = stateVariables["/x"].stateValues.value;

      expect(variantVars.includes(x)).eq(true);
      variantVars.splice(variantVars.indexOf(x), 1);

      let y = stateVariables["/y"].stateValues.value;
      expect(variantVars.includes(y)).eq(true);
      variantVars.splice(variantVars.indexOf(y), 1);

      let z = stateVariables["/z"].stateValues.value;
      expect(z).eq(variantVars[0]);

      let xorig =
        stateVariables[
          stateVariables[
            stateVariables["/_select1"].replacements[0].componentName
          ].replacements[0].componentName
        ].stateValues.value;
      expect(xorig).eq(x);
      let yorig =
        stateVariables[
          stateVariables[
            stateVariables["/_select1"].replacements[1].componentName
          ].replacements[0].componentName
        ].stateValues.value;
      expect(yorig).eq(y);
      let zorig =
        stateVariables[
          stateVariables[
            stateVariables["/_select1"].replacements[2].componentName
          ].replacements[0].componentName
        ].stateValues.value;
      expect(zorig).eq(z);

      let x2 =
        stateVariables[stateVariables["/x2"].replacements[0].componentName]
          .stateValues.value;
      expect(x2).eq(x);
      let y2 =
        stateVariables[stateVariables["/y2"].replacements[0].componentName]
          .stateValues.value;
      expect(y2).eq(y);
      let z2 =
        stateVariables[stateVariables["/z2"].replacements[0].componentName]
          .stateValues.value;
      expect(z2).eq(z);

      let x3 =
        stateVariables[
          stateVariables[stateVariables["/s2"].replacements[0].componentName]
            .replacements[0].componentName
        ].stateValues.value;
      expect(x3).eq(x);
      let y3 =
        stateVariables[
          stateVariables[stateVariables["/s2"].replacements[1].componentName]
            .replacements[0].componentName
        ].stateValues.value;
      expect(y3).eq(y);
      let z3 =
        stateVariables[
          stateVariables[stateVariables["/s2"].replacements[2].componentName]
            .replacements[0].componentName
        ].stateValues.value;
      expect(z3).eq(z);
    });
  });

  it("select math as sugared string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select type="math" assignnames="m1 m2 m3 m4 m5" numToSelect="5">
      x^2  x/y  u  a  b-c  s+t  mn  -1
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let options = ["x^2", "x/y", "u", "a", "b-c", "s+t", "mn", "-1"].map((x) =>
      me.fromText(x),
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathsSoFar = [];
      for (let ind = 1; ind <= 5; ind++) {
        let math = me.fromAst(stateVariables["/m" + ind].stateValues.value);
        expect(options.some((x) => x.equalsViaSyntax(math))).eq(true);
        expect(mathsSoFar.some((x) => x.equalsViaSyntax(math))).eq(false);
        mathsSoFar.push(math);
      }
    });
  });

  it("select math as sugared string, no type specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select assignnames="m1 m2 m3 m4 m5" numToSelect="5">
      x^2  x/y  u  a  b-c  s+t  mn  -1
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let options = ["x^2", "x/y", "u", "a", "b-c", "s+t", "mn", "-1"].map((x) =>
      me.fromText(x),
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathsSoFar = [];
      for (let ind = 1; ind <= 5; ind++) {
        let math = me.fromAst(stateVariables["/m" + ind].stateValues.value);
        expect(options.some((x) => x.equalsViaSyntax(math))).eq(true);
        expect(mathsSoFar.some((x) => x.equalsViaSyntax(math))).eq(false);
        mathsSoFar.push(math);
      }
    });
  });

  it("select math as sugared strings and macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <setup>
      <math name="var1">x</math>
      <math name="var2">y</math>
      <number name="a">7</number>
      <math name="b">-3</math>
    </setup>
    <aslist>
    <select assignnames="m1 m2 m3 m4 m5 m6" numToSelect="6">
      $a$var1^2  $b$var1/$var2  u-$b  $a  $var1-c $(var2{createComponentOfType="math"})
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let options = ["7x^2", "(-3)x/y", "u-(-3)", "7", "x-c", "y"].map((x) =>
      me.fromText(x),
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathsSoFar = [];
      for (let ind = 1; ind <= 6; ind++) {
        let comp = stateVariables["/m" + ind];
        let math;
        if (comp.componentType === "math") {
          math = me.fromAst(comp.stateValues.value);
        } else {
          math = me.fromAst(
            stateVariables[comp.replacements[0].componentName].stateValues
              .value,
          );
        }
        expect(options.some((x) => x.equalsViaSyntax(math))).eq(true);
        expect(mathsSoFar.some((x) => x.equalsViaSyntax(math))).eq(false);
        mathsSoFar.push(math);
      }
    });
  });

  it("select text as sugared string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select type="text" assignnames="w1 w2 w3 w4 w5" numToSelect="5">
      Lorem  ipsum  dolor  sit  amet  consectetur  adipiscing  elit
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let wordsSoFar = [];
      for (let ind = 1; ind <= 5; ind++) {
        let word = stateVariables["/w" + ind].stateValues.value;
        expect(
          [
            "Lorem",
            "ipsum",
            "dolor",
            "sit",
            "amet",
            "consectetur",
            "adipiscing",
            "elit",
          ].includes(word),
        ).eq(true);
        expect(wordsSoFar.includes(word)).eq(false);
        wordsSoFar.push(word);
      }
    });
  });

  it("select text as sugared strings and macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <setup>
      <text name="a">amet</text>
      <text name="cSpace">consectetur </text>
      <text name="spaceD"> dolor</text>
    </setup>
    <aslist>
    <select type="text" assignnames="w1 w2 w3 w4 w5" numToSelect="5">
      Lorem  ipsum$spaceD  sit  $(a{createComponentOfType="text"})  $(cSpace)adipiscing
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let wordsSoFar = [];
      for (let ind = 1; ind <= 5; ind++) {
        let comp = stateVariables["/w" + ind];
        let word;
        if (comp.componentType === "text") {
          word = comp.stateValues.value;
        } else {
          word =
            stateVariables[comp.replacements[0].componentName].stateValues
              .value;
        }

        expect(
          [
            "Lorem",
            "ipsum dolor",
            "sit",
            "amet",
            "consectetur adipiscing",
          ].includes(word),
        ).eq(true);
        expect(wordsSoFar.includes(word)).eq(false);
        wordsSoFar.push(word);
      }
    });
  });

  it("select number as sugared string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select type="number" assignnames="n1 n2 n3 n4 n5 n6 n7 n8 n9 n10" numToSelect="10" withReplacement>
      2 3 5 7 11 13 17 19
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 10; ind++) {
        let num = stateVariables["/n" + ind].stateValues.value;
        expect([2, 3, 5, 7, 11, 13, 17, 19].includes(num)).eq(true);
      }
    });
  });

  it("select number as sugared strings and macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <setup>
      <number name="a">5</number>
      <math name="b">-7</math>
      <math name="c">6+2</math>
    </setup>
    <aslist>
    <select type="number" assignnames="n1 n2 n3 n4 n5 n6 n7 n8 n9 n10" numToSelect="6">
      2 $a+$b 3-$c $(a{createComponentOfType="number"}) $b-1 $c
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 6; ind++) {
        let comp = stateVariables["/n" + ind];
        let num;
        if (comp.componentType === "number") {
          num = comp.stateValues.value;
        } else {
          num =
            stateVariables[comp.replacements[0].componentName].stateValues
              .value;
        }
        expect([2, -2, -5, 5, -8, 8].includes(num)).eq(true);
      }
    });
  });

  it("select boolean as sugared string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select type="boolean" assignnames="b1 b2 b3 b4 b5 b6 b7 b8 b9 b10 b11 b12 b13 b14 b15 b16 b17 b18 b19 b20" numToSelect="20" withReplacement>
      true false
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let foundTrue = false,
        foundFalse = false;
      for (let ind = 1; ind <= 20; ind++) {
        let bool = stateVariables["/b" + ind].stateValues.value;
        expect([true, false].includes(bool)).eq(true);
        if (bool === true) {
          foundTrue = true;
        } else {
          foundFalse = true;
        }
      }
      expect(foundTrue).be.true;
      expect(foundFalse).be.true;
    });
  });

  it("select boolean as sugared strings and macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <setup>
      <boolean name="t">true</boolean>
      <boolean name="f">false</boolean>
    </setup>
    <aslist>
    <select type="boolean" assignnames="b1 b2 b3 b4 b5 b6 b7 b8 b9 b10 b11 b12 b13 b14 b15 b16 b17 b18 b19 b20" numToSelect="20" withReplacement>
      true false $t $f $(t{createComponentOfType="boolean"}) $(f{createComponentOfType="boolean"})
    </select>
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let foundTrue = false,
        foundFalse = false;
      for (let ind = 1; ind <= 20; ind++) {
        let comp = stateVariables["/b" + ind];
        let bool;
        if (comp.componentType === "boolean") {
          bool = comp.stateValues.value;
        } else {
          bool =
            stateVariables[comp.replacements[0].componentName].stateValues
              .value;
        }
        expect([true, false].includes(bool)).eq(true);
        if (bool === true) {
          foundTrue = true;
        } else {
          foundFalse = true;
        }
      }
      expect(foundTrue).be.true;
      expect(foundFalse).be.true;
    });
  });

  it("select weighted", () => {
    // TODO: this test seems to fail with num Y < 17 once in awhile
    // even though it should fail less than 0.1% of the time
    // Is there a flaw?

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <text>a</text>
        <aslist>
        <map>
          <template>
          <select>
            <option selectweight="0.2"><text>x</text></option>
            <option><text>y</text></option>
            <option selectweight="5"><text>z</text></option>
            </select>
          </template>
          <sources><sequence length="200" /></sources>
        </map>
        </aslist>
        `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `a`);

    let numX = 0,
      numY = 0,
      numZ = 0;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 0; ind < 200; ind++) {
        let theText =
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables[
                  stateVariables["/_map1"].replacements[ind].componentName
                ].replacements[1].componentName
              ].replacements[0].componentName
            ].replacements[0].componentName
          ];
        let x = theText.stateValues.value;
        if (x === "z") {
          numZ++;
        } else if (x === "y") {
          numY++;
        } else {
          numX++;
        }
      }
    });

    cy.window().then(async (win) => {
      expect(numX).greaterThan(0);
      expect(numX).lessThan(15);
      expect(numY).greaterThan(17);
      expect(numY).lessThan(50);
      expect(numZ).greaterThan(140);
    });
  });

  it("select weighted with replacement", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select numToSelect="200" withreplacement>
      <option selectweight="0.2"><text>x</text></option>
      <option><text>y</text></option>
      <option selectweight="5"><text>z</text></option>
    </select>
    </aslist>
    `,
          requestedVariantIndex: 0,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numX = 0,
        numY = 0,
        numZ = 0;
      let selectReplacements = stateVariables["/_select1"].replacements;
      for (let ind = 0; ind < 200; ind++) {
        let x =
          stateVariables[
            stateVariables[selectReplacements[ind].componentName]
              .replacements[0].componentName
          ].stateValues.value;
        if (x === "x") {
          numX++;
        } else if (x === "y") {
          numY++;
        } else {
          numZ++;
        }
      }
      expect(numX).greaterThan(0);
      expect(numX).lessThan(15);
      expect(numY).greaterThan(20);
      expect(numY).lessThan(50);
      expect(numZ).greaterThan(150);
    });
  });

  it("select weighted without replacement", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <text>a</text>
        <aslist>
        <map>
          <template>
          <select numToSelect="2">
            <option selectweight="0.1"><text>u</text></option>
            <option selectweight="0.1"><text>v</text></option>
            <option selectweight="0.1"><text>w</text></option>
            <option selectweight="5"><text>x</text></option>
            <option><text>y</text></option>
            <option selectweight="10"><text>z</text></option>
          </select>
          </template>
          <sources><sequence length="200" /></sources>
        </map>
        </aslist>
        `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `a`);

    let numX = 0,
      numY = 0,
      numZ = 0,
      numUVW = 0;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      for (let ind = 0; ind < 200; ind++) {
        let theSelect =
          stateVariables[
            stateVariables[
              stateVariables["/_map1"].replacements[ind].componentName
            ].replacements[1].componentName
          ];
        let theText1 =
          stateVariables[
            stateVariables[theSelect.replacements[0].componentName]
              .replacements[0].componentName
          ];
        let x = theText1.stateValues.value;

        if (x === "z") {
          numZ++;
        } else if (x === "y") {
          numY++;
        } else if (x === "x") {
          numX++;
        } else {
          numUVW++;
        }
        let theText2 =
          stateVariables[
            stateVariables[theSelect.replacements[1].componentName]
              .replacements[0].componentName
          ];
        let y = theText2.stateValues.value;
        if (y === "z") {
          numZ++;
        } else if (y === "y") {
          numY++;
        } else if (y === "x") {
          numX++;
        } else {
          numUVW++;
        }
      }
    });

    cy.window().then(async (win) => {
      expect(numUVW).greaterThan(0);
      expect(numUVW).lessThan(15);
      expect(numX).greaterThan(150);
      expect(numY).greaterThan(10);
      expect(numY).lessThan(50);
      expect(numZ).greaterThan(170);
    });
  });

  it("references to internal assignnames", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <select name="original" assignnames="(q) (r) (s) (t) (u) (v) (w)" numToSelect="7" withreplacement>
      <option><p newNamespace><select assignnames="q r" numToSelect="2">a e i o u</select><copy name="q2" target="q" /><copy name="r2" target="r" /></p></option>
      <option><p newNamespace><selectfromsequence type="letters" assignnames="q r" numToSelect="2" from="a" to="z" /><copy name="q2" target="q" /><copy name="r2" target="r" /></p></option>
      <option><p newNamespace><text name="q">z</text><selectfromsequence type="letters" assignnames="r" numToSelect="1" from="u" to="z" /><copy name="q2" target="q" /><copy name="r2" target="r" /></p></option>
      <option><p newNamespace><text name="q">q</text><text name="r">r</text><copy name="q2" target="q" /><copy name="r2" target="r" /></p></option>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" target="q" />
    <copy name="r2" target="r" />
    <copy name="s2" target="s" />
    <copy name="t2" target="t" />
    <copy name="u2" target="u" />
    <copy name="v2" target="v" />
    <copy name="w2" target="w" />

    <p>Copy q and r and their copies from within selected options</p>
    <p><copy name="qq" target="q/q" /><copy name="qr" target="q/r" /><copy name="qq2" target="q/q2" /><copy name="qr2" target="q/r2" /></p>
    <p><copy name="rq" target="r/q" /><copy name="rr" target="r/r" /><copy name="rq2" target="r/q2" /><copy name="rr2" target="r/r2" /></p>
    <p><copy name="sq" target="s/q" /><copy name="sr" target="s/r" /><copy name="sq2" target="s/q2" /><copy name="sr2" target="s/r2" /></p>
    <p><copy name="tq" target="t/q" /><copy name="tr" target="t/r" /><copy name="tq2" target="t/q2" /><copy name="tr2" target="t/r2" /></p>
    <p><copy name="uq" target="u/q" /><copy name="ur" target="u/r" /><copy name="uq2" target="u/q2" /><copy name="ur2" target="u/r2" /></p>
    <p><copy name="vq" target="v/q" /><copy name="vr" target="v/r" /><copy name="vq2" target="v/q2" /><copy name="vr2" target="v/r2" /></p>
    <p><copy name="wq" target="w/q" /><copy name="wr" target="w/r" /><copy name="wq2" target="w/q2" /><copy name="wr2" target="w/r2" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let qs = stateVariables["/q"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let rs = stateVariables["/r"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let ss = stateVariables["/s"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let ts = stateVariables["/t"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let us = stateVariables["/u"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let vs = stateVariables["/v"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let ws = stateVariables["/w"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      let q2s = stateVariables[
        stateVariables["/q2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let r2s = stateVariables[
        stateVariables["/r2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let s2s = stateVariables[
        stateVariables["/s2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let t2s = stateVariables[
        stateVariables["/t2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let u2s = stateVariables[
        stateVariables["/u2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let v2s = stateVariables[
        stateVariables["/v2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let w2s = stateVariables[
        stateVariables["/w2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);
      expect(v2s).eqls(vs);
      expect(w2s).eqls(ws);

      let q3s = [
        stateVariables[stateVariables["/qq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let r3s = [
        stateVariables[stateVariables["/rq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let s3s = [
        stateVariables[stateVariables["/sq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let t3s = [
        stateVariables[stateVariables["/tq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let u3s = [
        stateVariables[stateVariables["/uq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/ur"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/uq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/ur2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let v3s = [
        stateVariables[stateVariables["/vq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/vr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/vq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/vr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let w3s = [
        stateVariables[stateVariables["/wq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/wr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/wq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/wr2"].replacements[0].componentName]
          .stateValues.value,
      ];

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);
      expect(v3s).eqls(vs);
      expect(w3s).eqls(ws);
    });
  });

  it("references to internal assignnames, newnamespaces", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <select name="original" assignnames="(q) (r) (s) (t) (u) (v) (w)" numToSelect="7" withreplacement>
      <option><p newNamespace><select name="s" newnamespace assignnames="q r" numToSelect="2">a e i o u</select><copy name="q2" target="s/q" /><copy name="r2" target="s/r" /></p></option>
      <option><p newNamespace><selectfromsequence type="letters" name="s" newnamespace assignnames="q r" numToSelect="2" from="a" to="z" /><copy name="q2" target="s/q" /><copy name="r2" target="s/r" /></p></option>
      <option><p newNamespace><selectfromsequence type="letters" name="s" newnamespace assignnames="q r" numToSelect="2" withreplacement from="u" to="z" /><copy name="q2" target="s/q" /><copy name="r2" target="s/r" /></p></option>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" target="q" />
    <copy name="r2" target="r" />
    <copy name="s2" target="s" />
    <copy name="t2" target="t" />
    <copy name="u2" target="u" />
    <copy name="v2" target="v" />
    <copy name="w2" target="w" />

    <p>Selected options repeated, no p</p>
    <p><copy name="q3" target="q/s" /></p>
    <p><copy name="r3" target="r/s" /></p>
    <p><copy name="s3" target="s/s" /></p>
    <p><copy name="t3" target="t/s" /></p>
    <p><copy name="u3" target="u/s" /></p>
    <p><copy name="v3" target="v/s" /></p>
    <p><copy name="w3" target="w/s" /></p>

    <p>Copy q and r from within selected options</p>
    <p><copy name="qq" target="q/s/q" /><copy name="qr" target="q/s/r" /><copy name="qq2" target="q/q2" /><copy name="qr2" target="q/r2" /></p>
    <p><copy name="rq" target="r/s/q" /><copy name="rr" target="r/s/r" /><copy name="rq2" target="r/q2" /><copy name="rr2" target="r/r2" /></p>
    <p><copy name="sq" target="s/s/q" /><copy name="sr" target="s/s/r" /><copy name="sq2" target="s/q2" /><copy name="sr2" target="s/r2" /></p>
    <p><copy name="tq" target="t/s/q" /><copy name="tr" target="t/s/r" /><copy name="tq2" target="t/q2" /><copy name="tr2" target="t/r2" /></p>
    <p><copy name="uq" target="u/s/q" /><copy name="ur" target="u/s/r" /><copy name="uq2" target="u/q2" /><copy name="ur2" target="u/r2" /></p>
    <p><copy name="vq" target="v/s/q" /><copy name="vr" target="v/s/r" /><copy name="vq2" target="v/q2" /><copy name="vr2" target="v/r2" /></p>
    <p><copy name="wq" target="w/s/q" /><copy name="wr" target="w/s/r" /><copy name="wq2" target="w/q2" /><copy name="wr2" target="w/r2" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let qs = stateVariables["/q"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let rs = stateVariables["/r"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let ss = stateVariables["/s"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let ts = stateVariables["/t"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let us = stateVariables["/u"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let vs = stateVariables["/v"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let ws = stateVariables["/w"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      let q2s = stateVariables[
        stateVariables["/q2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let r2s = stateVariables[
        stateVariables["/r2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let s2s = stateVariables[
        stateVariables["/s2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let t2s = stateVariables[
        stateVariables["/t2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let u2s = stateVariables[
        stateVariables["/u2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let v2s = stateVariables[
        stateVariables["/v2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let w2s = stateVariables[
        stateVariables["/w2"].replacements[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);
      expect(v2s).eqls(vs);
      expect(w2s).eqls(ws);

      let q3s = stateVariables["/q3"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let r3s = stateVariables["/r3"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let s3s = stateVariables["/s3"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let t3s = stateVariables["/t3"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let u3s = stateVariables["/u3"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let v3s = stateVariables["/v3"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let w3s = stateVariables["/w3"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );

      expect(q3s).eqls(qs.slice(0, 2));
      expect(r3s).eqls(rs.slice(0, 2));
      expect(s3s).eqls(ss.slice(0, 2));
      expect(t3s).eqls(ts.slice(0, 2));
      expect(u3s).eqls(us.slice(0, 2));
      expect(v3s).eqls(vs.slice(0, 2));
      expect(w3s).eqls(ws.slice(0, 2));

      let q4s = [
        stateVariables[stateVariables["/qq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let r4s = [
        stateVariables[stateVariables["/rq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let s4s = [
        stateVariables[stateVariables["/sq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let t4s = [
        stateVariables[stateVariables["/tq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let u4s = [
        stateVariables[stateVariables["/uq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/ur"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/uq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/ur2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let v4s = [
        stateVariables[stateVariables["/vq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/vr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/vq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/vr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let w4s = [
        stateVariables[stateVariables["/wq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/wr"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/wq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/wr2"].replacements[0].componentName]
          .stateValues.value,
      ];

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);
      expect(t4s).eqls(ts);
      expect(u4s).eqls(us);
      expect(v4s).eqls(vs);
      expect(w4s).eqls(ws);
    });
  });

  // can no longer reference between named grandchildren using their original names
  it.skip("references to internal assignnames, named grandchildren", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <select name="original" assignnames="(q qq  qr) (r  rq rr) (s  sq  sr) (t  tq  tr) (u uq ur)" numToSelect="5" withreplacement>
      <p><select assignnames="q r" numToSelect="2">a e i o u</select><copy name="q2" target="q" /><copy name="r2" target="r" /></p>
      <p><selectfromsequence type="letters" assignnames="q r" numToSelect="2">a z</selectfromsequence><copy name="q2" target="q" /><copy name="r2" target="r" /></p>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" target="q" /></p>
    <p><copy name="r2" target="r" /></p>
    <p><copy name="s2" target="s" /></p>
    <p><copy name="t2" target="t" /></p>
    <p><copy name="u2" target="u" /></p>

    <p>Copy x/q and x/r and their copies from within selected options</p>
    <p><copy name="qq2" target="q/q" /><copy name="qr2" target="q/r" /><copy name="qq3" target="qq" /><copy name="qr3" target="qr" /></p>
    <p><copy name="rq2" target="r/q" /><copy name="rr2" target="r/r" /><copy name="rq3" target="rq" /><copy name="rr3" target="rr" /></p>
    <p><copy name="sq2" target="s/q" /><copy name="sr2" target="s/r" /><copy name="sq3" target="sq" /><copy name="sr3" target="sr" /></p>
    <p><copy name="tq2" target="t/q" /><copy name="tr2" target="t/r" /><copy name="tq3" target="tq" /><copy name="tr3" target="tr" /></p>
    <p><copy name="uq2" target="u/q" /><copy name="ur2" target="u/r" /><copy name="uq3" target="uq" /><copy name="ur3" target="ur" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/u\\/r"))
      .invoke("text")
      .then((text) => {
        expect(text.length).equal(1);
      });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let qs = stateVariables["/q"].replacements.map(
        (x) => x.stateValues.value,
      );
      let rs = stateVariables["/r"].replacements.map(
        (x) => x.stateValues.value,
      );
      let ss = stateVariables["/s"].replacements.map(
        (x) => x.stateValues.value,
      );
      let ts = stateVariables["/t"].replacements.map(
        (x) => x.stateValues.value,
      );
      let us = stateVariables["/u"].replacements.map(
        (x) => x.stateValues.value,
      );

      let q2s = stateVariables["/q2"].replacements.map(
        (x) => x.stateValues.value,
      );
      let r2s = stateVariables["/r2"].replacements.map(
        (x) => x.stateValues.value,
      );
      let s2s = stateVariables["/s2"].replacements.map(
        (x) => x.stateValues.value,
      );
      let t2s = stateVariables["/t2"].replacements.map(
        (x) => x.stateValues.value,
      );
      let u2s = stateVariables["/u2"].replacements.map(
        (x) => x.stateValues.value,
      );

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);

      let q3s = [
        stateVariables[stateVariables["/qq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let q4s = [
        stateVariables[stateVariables["/qq3"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qr3"].replacements[0].componentName]
          .stateValues.value,
      ];
      let r3s = [
        stateVariables[stateVariables["/rq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let r4s = [
        stateVariables[stateVariables["/rq3"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rr3"].replacements[0].componentName]
          .stateValues.value,
      ];
      let s3s = [
        stateVariables[stateVariables["/sq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let s4s = [
        stateVariables[stateVariables["/sq3"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sr3"].replacements[0].componentName]
          .stateValues.value,
      ];
      let t3s = [
        stateVariables[stateVariables["/tq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let t4s = [
        stateVariables[stateVariables["/tq3"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tr3"].replacements[0].componentName]
          .stateValues.value,
      ];
      let u3s = [
        stateVariables[stateVariables["/uq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/ur2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let u4s = [
        stateVariables[stateVariables["/uq3"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/ur3"].replacements[0].componentName]
          .stateValues.value,
      ];

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);
      expect(t4s).eqls(ts);
      expect(u4s).eqls(us);
    });
  });

  // can no longer reference between named grandchildren using their original names
  it.skip("references to internal assignnames, newnamespaces, named grandchildren", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
        <select name="original" assignnames="(q qq  qr) (r  rq rr) (s  sq  sr) (t  tq  tr) (u uq ur)" numToSelect="5" withreplacement>
      <p><select name="a" assignnames="q r" numToSelect="2" newnamespace>a e i o u</select><copy name="q2" target="a/q" /><copy name="r2" target="a/r" /></p>
      <p><selectfromsequence type="letters" name="b" assignnames="q r" numToSelect="2" newnamespace>a z</selectfromsequence><copy name="q2" target="b/q" /><copy name="r2" target="b/r" /></p>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" target="q" /></p>
    <p><copy name="r2" target="r" /></p>
    <p><copy name="s2" target="s" /></p>
    <p><copy name="t2" target="t" /></p>
    <p><copy name="u2" target="u" /></p>

    <p>Copy x/q and x/r and their copies from within selected options</p>
    <p><copy name="qq2" target="q/q" /><copy name="qr2" target="q/r" /><copy name="qq3" target="qq" /><copy name="qr3" target="qr" /></p>
    <p><copy name="rq2" target="r/q" /><copy name="rr2" target="r/r" /><copy name="rq3" target="rq" /><copy name="rr3" target="rr" /></p>
    <p><copy name="sq2" target="s/q" /><copy name="sr2" target="s/r" /><copy name="sq3" target="sq" /><copy name="sr3" target="sr" /></p>
    <p><copy name="tq2" target="t/q" /><copy name="tr2" target="t/r" /><copy name="tq3" target="tq" /><copy name="tr3" target="tr" /></p>
    <p><copy name="uq2" target="u/q" /><copy name="ur2" target="u/r" /><copy name="uq3" target="uq" /><copy name="ur3" target="ur" /></p>


    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/u\\/r"))
      .invoke("text")
      .then((text) => {
        expect(text.length).equal(1);
      });
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let qs = stateVariables["/q"].replacements.map(
        (x) => x.stateValues.value,
      );
      let rs = stateVariables["/r"].replacements.map(
        (x) => x.stateValues.value,
      );
      let ss = stateVariables["/s"].replacements.map(
        (x) => x.stateValues.value,
      );
      let ts = stateVariables["/t"].replacements.map(
        (x) => x.stateValues.value,
      );
      let us = stateVariables["/u"].replacements.map(
        (x) => x.stateValues.value,
      );

      let q2s = stateVariables["/q2"].replacements.map(
        (x) => x.stateValues.value,
      );
      let r2s = stateVariables["/r2"].replacements.map(
        (x) => x.stateValues.value,
      );
      let s2s = stateVariables["/s2"].replacements.map(
        (x) => x.stateValues.value,
      );
      let t2s = stateVariables["/t2"].replacements.map(
        (x) => x.stateValues.value,
      );
      let u2s = stateVariables["/u2"].replacements.map(
        (x) => x.stateValues.value,
      );

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);

      let q3s = [
        stateVariables[stateVariables["/qq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let q4s = [
        stateVariables[stateVariables["/qq3"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qr3"].replacements[0].componentName]
          .stateValues.value,
      ];
      let r3s = [
        stateVariables[stateVariables["/rq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let r4s = [
        stateVariables[stateVariables["/rq3"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rr3"].replacements[0].componentName]
          .stateValues.value,
      ];
      let s3s = [
        stateVariables[stateVariables["/sq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let s4s = [
        stateVariables[stateVariables["/sq3"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sr3"].replacements[0].componentName]
          .stateValues.value,
      ];
      let t3s = [
        stateVariables[stateVariables["/tq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tr2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let t4s = [
        stateVariables[stateVariables["/tq3"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tr3"].replacements[0].componentName]
          .stateValues.value,
      ];
      let u3s = [
        stateVariables[stateVariables["/uq2"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/ur2"].replacements[0].componentName]
          .stateValues.value,
      ];
      let u4s = [
        stateVariables[stateVariables["/uq3"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/ur3"].replacements[0].componentName]
          .stateValues.value,
      ];

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);
      expect(t4s).eqls(ts);
      expect(u4s).eqls(us);
    });
  });

  it("references to select of selects", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <select name="original" assignnames="(q) (r) (s) (t) (u)" numToSelect="5" withreplacement>
      <option><select newNamespace assignnames="q r" numToSelect="2">a e i o u</select></option>
      <option><selectfromsequence type="letters" newNamespace assignnames="q r" numToSelect="2" from="a" to="z" /></option>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" target="q" /></p>
    <p><copy name="r2" target="r" /></p>
    <p><copy name="s2" target="s" /></p>
    <p><copy name="t2" target="t" /></p>
    <p><copy name="u2" target="u" /></p>

    <p>Copy x/q and x/r</p>
    <p><copy name="qq" target="q/q" /><copy name="qr" target="q/r" /></p>
    <p><copy name="rq" target="r/q" /><copy name="rr" target="r/r" /></p>
    <p><copy name="sq" target="s/q" /><copy name="sr" target="s/r" /></p>
    <p><copy name="tq" target="t/q" /><copy name="tr" target="t/r" /></p>
    <p><copy name="uq" target="u/q" /><copy name="ur" target="u/r" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let qs = stateVariables["/q"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let rs = stateVariables["/r"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let ss = stateVariables["/s"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let ts = stateVariables["/t"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let us = stateVariables["/u"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );

      let q2s = stateVariables["/q2"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let r2s = stateVariables["/r2"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let s2s = stateVariables["/s2"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let t2s = stateVariables["/t2"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );
      let u2s = stateVariables["/u2"].replacements
        .map((x) => stateVariables[x.componentName])
        .map((x) =>
          x.replacements
            ? stateVariables[x.replacements[0].componentName].stateValues.value
            : x.stateValues.value,
        );

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);

      let q3s = [
        stateVariables[stateVariables["/qq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/qr"].replacements[0].componentName]
          .stateValues.value,
      ];
      let r3s = [
        stateVariables[stateVariables["/rq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/rr"].replacements[0].componentName]
          .stateValues.value,
      ];
      let s3s = [
        stateVariables[stateVariables["/sq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/sr"].replacements[0].componentName]
          .stateValues.value,
      ];
      let t3s = [
        stateVariables[stateVariables["/tq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/tr"].replacements[0].componentName]
          .stateValues.value,
      ];
      let u3s = [
        stateVariables[stateVariables["/uq"].replacements[0].componentName]
          .stateValues.value,
        stateVariables[stateVariables["/ur"].replacements[0].componentName]
          .stateValues.value,
      ];

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);
    });
  });

  it("references to select of selects of selects", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <select assignnames="q r s" numToSelect="3" withreplacement>
      <option newNamespace><select assignnames="q r s" numToSelect="3" withreplacement>
        <option newNamespace><select type="text" assignnames="q r" numToSelect="2">a e i o u</select></option>
        <option newNamespace><selectfromsequence type="letters" assignnames="q r" numToSelect="2" from="a" to="j" /></option>
      </select></option>
      <option newNamespace><select assignnames="q r s" numToSelect="3">
        <option newNamespace><select type="text" assignnames="q r" numToSelect="2">v w x y z</select></option>
        <option newNamespace><selectfromsequence type="letters" assignnames="q r" numToSelect="2" from="k" to="n" /></option>
        <option newNamespace><selectfromsequence type="letters" assignnames="q r" numToSelect="2" from="x" to="z" /></option>
        <option newNamespace><select type="text" assignnames="q r" numToSelect="2">p d q</select></option>
      </select></option>
    </select>

    <p>Selected options repeated</p>
    <p name="pq2"><copy name="q2" target="q" /></p>
    <p name="pr2"><copy name="r2" target="r" /></p>
    <p name="ps2"><copy name="s2" target="s" /></p>

    <p>Copy x/q, x/r, x/s</p>
    <p name="pq3"><copy name="qq" target="q/q" /><copy name="qr" target="q/r" /><copy name="qs" target="q/s" /></p>
    <p name="pr3"><copy name="rq" target="r/q" /><copy name="rr" target="r/r" /><copy name="rs" target="r/s" /></p>
    <p name="ps3"><copy name="sq" target="s/q" /><copy name="sr" target="s/r" /><copy name="ss" target="s/s" /></p>

    <p>Copy x/x/q, x/x/r</p>
    <p name="pq4"><copy name="qqq" target="q/q/q" /><copy name="qqr" target="q/q/r" /><copy name="qrq" target="q/r/q" /><copy name="qrr" target="q/r/r" /><copy name="qsq" target="q/s/q" /><copy name="qsr" target="q/s/r" /></p>
    <p name="pr4"><copy name="rqq" target="r/q/q" /><copy name="rqr" target="r/q/r" /><copy name="rrq" target="r/r/q" /><copy name="rrr" target="r/r/r" /><copy name="rsq" target="r/s/q" /><copy name="rsr" target="r/s/r" /></p>
    <p name="ps4"><copy name="sqq" target="s/q/q" /><copy name="sqr" target="s/q/r" /><copy name="srq" target="s/r/q" /><copy name="srr" target="s/r/r" /><copy name="ssq" target="s/s/q" /><copy name="ssr" target="s/s/r" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let qs = ["/q/q/q", "/q/q/r", "/q/r/q", "/q/r/r", "/q/s/q", "/q/s/r"].map(
        (x) =>
          stateVariables[x].replacements
            ? stateVariables[stateVariables[x].replacements[0].componentName]
                .stateValues.value
            : stateVariables[x].stateValues.value,
      );
      let rs = ["/r/q/q", "/r/q/r", "/r/r/q", "/r/r/r", "/r/s/q", "/r/s/r"].map(
        (x) =>
          stateVariables[x].replacements
            ? stateVariables[stateVariables[x].replacements[0].componentName]
                .stateValues.value
            : stateVariables[x].stateValues.value,
      );
      let ss = ["/s/q/q", "/s/q/r", "/s/r/q", "/s/r/r", "/s/s/q", "/s/s/r"].map(
        (x) =>
          stateVariables[x].replacements
            ? stateVariables[stateVariables[x].replacements[0].componentName]
                .stateValues.value
            : stateVariables[x].stateValues.value,
      );

      cy.get(cesc("#\\/pq2")).should("have.text", qs.join(""));
      cy.get(cesc("#\\/pr2")).should("have.text", rs.join(""));
      cy.get(cesc("#\\/ps2")).should("have.text", ss.join(""));

      cy.get(cesc("#\\/pq3")).should("have.text", qs.join(""));
      cy.get(cesc("#\\/pr3")).should("have.text", rs.join(""));
      cy.get(cesc("#\\/ps3")).should("have.text", ss.join(""));

      cy.get(cesc("#\\/pq4")).should("have.text", qs.join(""));
      cy.get(cesc("#\\/pr4")).should("have.text", rs.join(""));
      cy.get(cesc("#\\/ps4")).should("have.text", ss.join(""));
    });
  });

  it("references to select of selects of selects, newnamespaces", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <select name="a" newnamespace assignnames="(q) (r) (s)" numToSelect="3" withreplacement>
      <option><select name="b" newnamespace assignnames="(q) (r) (s)" numToSelect="3" withreplacement>
        <option><select name="c" newnamespace type="text" assignnames="q r" numToSelect="2">a e i o u</select></option>
        <option><selectfromsequence type="letters" name="d" newnamespace assignnames="q r" numToSelect="2" from="a" to="j" /></option>
      </select></option>
      <option><select name="e" newnamespace assignnames="(q) (r) (s)" numToSelect="3">
        <option><select name="f" newnamespace type="text" assignnames="q r" numToSelect="2">v w x y z</select></option>
        <option><selectfromsequence type="letters" name="g" newnamespace assignnames="q r" numToSelect="2" from="k" to="n" /></option>
        <option><selectfromsequence type="letters" name="h" newnamespace assignnames="q r" numToSelect="2" from="x" to="z" /></option>
        <option><select name="i" newnamespace type="text" assignnames="q r" numToSelect="2">p d q</select></option>
      </select></option>
    </select>

    <p>Selected options repeated</p>
    <p name="pq2"><copy name="q2" target="a/q" /></p>
    <p name="pr2"><copy name="r2" target="a/r" /></p>
    <p name="ps2"><copy name="s2" target="a/s" /></p>

    <p>Copy x/q, x/r, x/s</p>
    <p name="pq3"><copy name="qq" target="a/q/q" /><copy name="qr" target="a/q/r" /><copy name="qs" target="a/q/s" /></p>
    <p name="pr3"><copy name="rq" target="a/r/q" /><copy name="rr" target="a/r/r" /><copy name="rs" target="a/r/s" /></p>
    <p name="ps3"><copy name="sq" target="a/s/q" /><copy name="sr" target="a/s/r" /><copy name="ss" target="a/s/s" /></p>

    <p>Copy x/x/q, x/x/r</p>
    <p name="pq4"><copy name="qqq" target="a/q/q/q" /><copy name="qqr" target="a/q/q/r" /><copy name="qrq" target="a/q/r/q" /><copy name="qrr" target="a/q/r/r" /><copy name="qsq" target="a/q/s/q" /><copy name="qsr" target="a/q/s/r" /></p>
    <p name="pr4"><copy name="rqq" target="a/r/q/q" /><copy name="rqr" target="a/r/q/r" /><copy name="rrq" target="a/r/r/q" /><copy name="rrr" target="a/r/r/r" /><copy name="rsq" target="a/r/s/q" /><copy name="rsr" target="a/r/s/r" /></p>
    <p name="ps4"><copy name="sqq" target="a/s/q/q" /><copy name="sqr" target="a/s/q/r" /><copy name="srq" target="a/s/r/q" /><copy name="srr" target="a/s/r/r" /><copy name="ssq" target="a/s/s/q" /><copy name="ssr" target="a/s/s/r" /></p>

    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let qs = [
        "/a/q/q/q",
        "/a/q/q/r",
        "/a/q/r/q",
        "/a/q/r/r",
        "/a/q/s/q",
        "/a/q/s/r",
      ].map((x) =>
        stateVariables[x].replacements
          ? stateVariables[stateVariables[x].replacements[0].componentName]
              .stateValues.value
          : stateVariables[x].stateValues.value,
      );
      let rs = [
        "/a/r/q/q",
        "/a/r/q/r",
        "/a/r/r/q",
        "/a/r/r/r",
        "/a/r/s/q",
        "/a/r/s/r",
      ].map((x) =>
        stateVariables[x].replacements
          ? stateVariables[stateVariables[x].replacements[0].componentName]
              .stateValues.value
          : stateVariables[x].stateValues.value,
      );
      let ss = [
        "/a/s/q/q",
        "/a/s/q/r",
        "/a/s/r/q",
        "/a/s/r/r",
        "/a/s/s/q",
        "/a/s/s/r",
      ].map((x) =>
        stateVariables[x].replacements
          ? stateVariables[stateVariables[x].replacements[0].componentName]
              .stateValues.value
          : stateVariables[x].stateValues.value,
      );

      cy.get(cesc("#\\/pq2")).should("have.text", qs.join(""));
      cy.get(cesc("#\\/pr2")).should("have.text", rs.join(""));
      cy.get(cesc("#\\/ps2")).should("have.text", ss.join(""));

      cy.get(cesc("#\\/pq3")).should("have.text", qs.join(""));
      cy.get(cesc("#\\/pr3")).should("have.text", rs.join(""));
      cy.get(cesc("#\\/ps3")).should("have.text", ss.join(""));

      cy.get(cesc("#\\/pq4")).should("have.text", qs.join(""));
      cy.get(cesc("#\\/pr4")).should("have.text", rs.join(""));
      cy.get(cesc("#\\/ps4")).should("have.text", ss.join(""));
    });
  });

  it("references to named grandchildren's children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <select assignnames="(a b c d)">
    <option>
      <math name="h1" newNamespace><math name="w">x</math><math>y</math></math>
      <math simplify newNamespace><math name="q">z</math> + 2<copy name="v" target="q" /></math>
      <copy target="a/w" />
      <copy target="b/q" />
    </option>
    <option>
      <math name="h2" newNamespace><math name="w">u</math><math>v</math></math>
      <math simplify newNamespace><math name="q">t</math> + 2<copy name="v" target="q" /></math>
      <copy target="a/w" />
      <copy target="b/q" />
    </option>
    </select>
    
    <p>Copy grandchidren</p>
    <p><copy name="a2" target="a" /></p>
    <p><copy name="b2" target="b" /></p>
    <p><copy name="c2" target="c" /></p>
    <p><copy name="d2" target="d" /></p>
    
    <p>Copy named children of grandchild</p>
    <p><copy name="w2" target="a/w" /></p>
    <p><copy name="v2" target="b/v" /></p>
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let options = [
      {
        a: "x y",
        b: "3 z",
        c: "x",
        d: "z",
        v: "z",
        w: "x",
      },
      {
        a: "u v",
        b: "3 t",
        c: "u",
        d: "t",
        v: "t",
        w: "u",
      },
    ];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let chosenChildren = stateVariables[
        stateVariables["/_select1"].replacements[0].componentName
      ].replacements
        .filter((x) => typeof x !== "string")
        .map((x) => stateVariables[x.componentName])
        .map((v, i) =>
          i < 2 ? v : stateVariables[v.replacements[0].componentName],
        );
      let option =
        options[stateVariables["/_select1"].stateValues.selectedIndices[0] - 1];

      expect(me.fromAst(chosenChildren[0].stateValues.value).toString()).eq(
        option.a,
      );
      expect(me.fromAst(chosenChildren[1].stateValues.value).toString()).eq(
        option.b,
      );
      expect(me.fromAst(chosenChildren[2].stateValues.value).toString()).eq(
        option.c,
      );
      expect(me.fromAst(chosenChildren[3].stateValues.value).toString()).eq(
        option.d,
      );

      let a2 = me
        .fromAst(
          stateVariables[stateVariables["/a2"].replacements[0].componentName]
            .stateValues.value,
        )
        .toString();
      let b2 = me
        .fromAst(
          stateVariables[stateVariables["/b2"].replacements[0].componentName]
            .stateValues.value,
        )
        .toString();
      let c2 = me
        .fromAst(
          stateVariables[stateVariables["/c2"].replacements[0].componentName]
            .stateValues.value,
        )
        .toString();
      let d2 = me
        .fromAst(
          stateVariables[stateVariables["/d2"].replacements[0].componentName]
            .stateValues.value,
        )
        .toString();
      let v2 = me
        .fromAst(
          stateVariables[stateVariables["/v2"].replacements[0].componentName]
            .stateValues.value,
        )
        .toString();
      let w2 = me
        .fromAst(
          stateVariables[stateVariables["/w2"].replacements[0].componentName]
            .stateValues.value,
        )
        .toString();

      expect(a2).eq(option.a);
      expect(b2).eq(option.b);
      expect(c2).eq(option.c);
      expect(d2).eq(option.d);
      expect(v2).eq(option.v);
      expect(w2).eq(option.w);
    });
  });

  it("select of a map of a select, with references", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist name="list1">
    <select assignnames="(j) (k) (l)" numToSelect="3" withreplacement>
    <option><map assignnames="a b" newNamespace>
      <template newNamespace>
        <select assignnames="(p q) (r s)" numToSelect="2">
          <option><math>$x^2</math><math>$x^6</math></option>
          <option><math>$x^3</math><math>$x^7</math></option>
          <option><math>$x^4</math><math>$x^8</math></option>
          <option><math>$x^5</math><math>$x^9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>x</math><math>y</math>
      </sources>
    </map></option>
    <option><map assignnames="a b" newNamespace>
      <template newNamespace>
        <select assignnames="(p q) (r s)" numToSelect="2">
          <option><math>$x 2</math><math>$x 6</math></option>
          <option><math>$x 3</math><math>$x 7</math></option>
          <option><math>$x 4</math><math>$x 8</math></option>
          <option><math>$x 5</math><math>$x 9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>u</math><math>v</math>
      </sources>
    </map></option>
    </select>
    </aslist></p>

    <p>Copy whole select again</p>
    <p><aslist name="list2"><copy name="s2" target="_select1" /></aslist></p>

    <p>Copy individual selections</p>
    <p><aslist name="list3">
    <copy name="j2" target="j" />
    <copy name="k2" target="k" />
    <copy name="l2" target="l" />
    </aslist></p>

    <p>Copy individual pieces</p>
    <p><aslist name="list4">
    <copy name="p1" target="j/a/p" /><copy name="p2" target="j/a/q" /><copy name="p3" target="j/a/r" /><copy name="p4" target="j/a/s" /><copy name="p5" target="j/b/p" /><copy name="p6" target="j/b/q" /><copy name="p7" target="j/b/r" /><copy name="p8" target="j/b/s" />
    <copy name="p9" target="k/a/p" /><copy name="p10" target="k/a/q" /><copy name="p11" target="k/a/r" /><copy name="p12" target="k/a/s" /><copy name="p13" target="k/b/p" /><copy name="p14" target="k/b/q" /><copy name="p15" target="k/b/r" /><copy name="p16" target="k/b/s" />
    <copy name="p17" target="l/a/p" /><copy name="p18" target="l/a/q" /><copy name="p19" target="l/a/r" /><copy name="p20" target="l/a/s" /><copy name="p21" target="l/b/p" /><copy name="p22" target="l/b/q" /><copy name="p23" target="l/b/r" /><copy name="p24" target="l/b/s" />
    </aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let theList1 = stateVariables["/list1"].activeChildren.map((x) =>
        me
          .fromAst(stateVariables[x.componentName].stateValues.value)
          .toString(),
      );
      let theList2 = stateVariables["/list2"].activeChildren.map((x) =>
        me
          .fromAst(stateVariables[x.componentName].stateValues.value)
          .toString(),
      );
      let theList3 = stateVariables["/list3"].activeChildren.map((x) =>
        me
          .fromAst(stateVariables[x.componentName].stateValues.value)
          .toString(),
      );

      expect(theList2).eqls(theList1);
      expect(theList3).eqls(theList1);

      let theList4 = [...Array(24).keys()].map((i) =>
        me
          .fromAst(
            stateVariables[
              stateVariables["/p" + (i + 1)].replacements[0].componentName
            ].stateValues.value,
          )
          .toString(),
      );

      expect(theList4).eqls(theList1);
    });
  });

  it("select of a map of a select, new namespaces", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist name="list1">
    <select name="s" newnamespace assignnames="(j) (k) (l)" numToSelect="3" withreplacement>
    <option><map name="m" newnamespace assignnames="a b">
      <template newnamespace>
        <select name="v" newnamespace assignnames="(p q) (r s)" numToSelect="2">
          <option><math>$x^2</math><math>$x^6</math></option>
          <option><math>$x^3</math><math>$x^7</math></option>
          <option><math>$x^4</math><math>$x^8</math></option>
          <option><math>$x^5</math><math>$x^9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>x</math><math>y</math>
      </sources>
    </map></option>
    <option><map name="n" newnamespace assignnames="a b">
      <template newnamespace>
        <select name="v" newnamespace assignnames="(p q) (r s)" numToSelect="2">
          <option><math>$x 2</math><math>$x 6</math></option>
          <option><math>$x 3</math><math>$x 7</math></option>
          <option><math>$x 4</math><math>$x 8</math></option>
          <option><math>$x 5</math><math>$x 9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>u</math><math>v</math>
      </sources>
    </map></option>
    </select>
    </aslist></p>

    <p>Copy whole select again</p>
    <p><aslist name="list2"><copy name="s2" target="s" /></aslist></p>

    <p>Copy individual selections</p>
    <p><aslist name="list3">
    <copy name="j2" target="s/j" />
    <copy name="k2" target="s/k" />
    <copy name="l2" target="s/l" />
    </aslist></p>

    <p>Copy individual pieces</p>
    <p><aslist name="list4">
    <copy name="p1" target="s/j/a/v/p" /><copy name="p2" target="s/j/a/v/q" /><copy name="p3" target="s/j/a/v/r" /><copy name="p4" target="s/j/a/v/s" /><copy name="p5" target="s/j/b/v/p" /><copy name="p6" target="s/j/b/v/q" /><copy name="p7" target="s/j/b/v/r" /><copy name="p8" target="s/j/b/v/s" />
    <copy name="p9" target="s/k/a/v/p" /><copy name="p10" target="s/k/a/v/q" /><copy name="p11" target="s/k/a/v/r" /><copy name="p12" target="s/k/a/v/s" /><copy name="p13" target="s/k/b/v/p" /><copy name="p14" target="s/k/b/v/q" /><copy name="p15" target="s/k/b/v/r" /><copy name="p16" target="s/k/b/v/s" />
    <copy name="p17" target="s/l/a/v/p" /><copy name="p18" target="s/l/a/v/q" /><copy name="p19" target="s/l/a/v/r" /><copy name="p20" target="s/l/a/v/s" /><copy name="p21" target="s/l/b/v/p" /><copy name="p22" target="s/l/b/v/q" /><copy name="p23" target="s/l/b/v/r" /><copy name="p24" target="s/l/b/v/s" />
    </aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let theList1 = stateVariables["/list1"].activeChildren.map((x) =>
        me
          .fromAst(stateVariables[x.componentName].stateValues.value)
          .toString(),
      );
      let theList2 = stateVariables["/list2"].activeChildren.map((x) =>
        me
          .fromAst(stateVariables[x.componentName].stateValues.value)
          .toString(),
      );
      let theList3 = stateVariables["/list3"].activeChildren.map((x) =>
        me
          .fromAst(stateVariables[x.componentName].stateValues.value)
          .toString(),
      );

      expect(theList2).eqls(theList1);
      expect(theList3).eqls(theList1);

      let theList4 = [...Array(24).keys()].map((i) =>
        me
          .fromAst(
            stateVariables[
              stateVariables["/p" + (i + 1)].replacements[0].componentName
            ].stateValues.value,
          )
          .toString(),
      );

      expect(theList4).eqls(theList1);
    });
  });

  it("select with hide will hide replacements but not copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <p>Selects and hide</p>
      <p><select assignnames="(c)">
        <option><text>a</text></option>
        <option><text>b</text></option>
        <option><text>c</text></option>
        <option><text>d</text></option>
        <option><text>e</text></option>
      </select>, <select assignnames="(d)" hide>
        <option><text>a</text></option>
        <option><text>b</text></option>
        <option><text>c</text></option>
        <option><text>d</text></option>
        <option><text>e</text></option>
      </select></p>
      <p><copy target="c" />, <copy target="d" /></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_p1")).should("have.text", "Selects and hide");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c = await stateVariables["/c"].stateValues.value;
      let d = await stateVariables["/d"].stateValues.value;
      expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
      expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

      cy.get(cesc(`#\\/_p2`)).should("have.text", `${c}, `);
      cy.get(cesc(`#\\/_p3`)).should("have.text", `${c}, ${d}`);
    });
  });

  it("select with hide will hide named grandchildren replacements but not copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <p>Selects and hide</p>
      <p><aslist><select assignnames="(a b c)">
        <option>
          <text>a</text>
          <text>b</text>
          <text>c</text>
        </option>
        <option>
          <text>d</text>
          <text>e</text>
          <text>f</text>
        </option>
      </select><select assignnames="(d e)" hide>
        <option>
          <text>a</text>
          <text>b</text>
        </option>
        <option>
          <text>c</text>
          <text>d</text>
        </option>
        <option>
          <text>e</text>
          <text>f</text>
        </option>
      </select></aslist></p>
      <p><copy target="a" />, <copy hide="true" target="b" />, <copy target="c" />, <copy hide="false" target="d" />, <copy target="e" /></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_p1")).should("have.text", "Selects and hide");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let a = stateVariables["/a"].stateValues.value;
      let b = stateVariables["/b"].stateValues.value;
      let c = stateVariables["/c"].stateValues.value;
      let d = stateVariables["/d"].stateValues.value;
      let e = stateVariables["/e"].stateValues.value;
      expect(["a", "d"].includes(a)).eq(true);
      expect(["b", "e"].includes(b)).eq(true);
      expect(["c", "f"].includes(c)).eq(true);
      expect(["a", "c", "e"].includes(d)).eq(true);
      expect(["b", "d", "f"].includes(e)).eq(true);

      cy.get(cesc(`#\\/_p2`)).should("have.text", `${a}, ${b}, ${c}`);
      cy.get(cesc(`#\\/_p3`)).should("have.text", `${a}, , ${c}, ${d}, ${e}`);
    });
  });

  it("selects hide dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" >
      <label>Hide first select</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true" >
      <label>Hide second select</label>
    </booleaninput>
    <p><select assignnames="(c)" hide="$h1">
      <option><text>a</text></option>
      <option><text>b</text></option>
      <option><text>c</text></option>
      <option><text>d</text></option>
      <option><text>e</text></option>
    </select>, <select assignnames="(d)" hide="$h2">
      <option><text>a</text></option>
      <option><text>b</text></option>
      <option><text>c</text></option>
      <option><text>d</text></option>
      <option><text>e</text></option>
    </select></p>
    <p><copy target="c" />, <copy target="d" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c = await stateVariables["/c"].stateValues.value;
      let d = await stateVariables["/d"].stateValues.value;
      expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
      expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

      cy.get(cesc(`#\\/_p1`)).should("have.text", `${c}, `);
      cy.get(cesc(`#\\/_p2`)).should("have.text", `${c}, ${d}`);

      cy.get(cesc("#\\/h1")).click();
      cy.get(cesc("#\\/h2")).click();

      cy.get(cesc(`#\\/_p1`)).should("have.text", `, ${d}`);
      cy.get(cesc(`#\\/_p2`)).should("have.text", `${c}, ${d}`);

      cy.get(cesc("#\\/h1")).click();
      cy.get(cesc("#\\/h2")).click();

      cy.get(cesc(`#\\/_p1`)).should("have.text", `${c}, `);
      cy.get(cesc(`#\\/_p2`)).should("have.text", `${c}, ${d}`);
    });
  });

  it("string and blank strings in options", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <setup>
      <text name="animal1">fox</text><text name="verb1">jumps</text>
      <text name="animal2">elephant</text><text name="verb2">trumpets</text>
    </setup>

    <p name="pa">a: <select assignnames="a">
      <option>The $animal1 $verb1.</option>
      <option>The $animal2 $verb2.</option>
    </select></p>

    <p name="pa1">a1: <copy target="a" assignNames="((a11) (a12))" /></p>

    <p name="ppieces" >pieces: <copy target="_select1" assignNames="(b c)" /></p>
  
    <p name="pb1">b1: <copy target="b" assignNames="b1" /></p>
    <p name="pc1">c1: <copy target="c" assignNames="c1" /></p>
  
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let options = [
      {
        animal: "fox",
        verb: "jumps",
      },
      {
        animal: "elephant",
        verb: "trumpets",
      },
    ];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let option =
        options[stateVariables["/_select1"].stateValues.selectedIndices[0] - 1];

      cy.get(cesc("#\\/pa")).should(
        "have.text",
        `a: The ${option.animal} ${option.verb}.`,
      );
      cy.get(cesc("#\\/pa1")).should(
        "have.text",
        `a1: The ${option.animal} ${option.verb}.`,
      );
      cy.get(cesc("#\\/ppieces")).should(
        "have.text",
        `pieces: The ${option.animal} ${option.verb}.`,
      );
      cy.get(cesc("#\\/pb1")).should("have.text", `b1: ${option.animal}`);
      cy.get(cesc("#\\/pc1")).should("have.text", `c1: ${option.verb}`);

      cy.get(cesc("#\\/a11")).should("have.text", `${option.animal}`);
      cy.get(cesc("#\\/a12")).should("have.text", `${option.verb}`);
      cy.get(cesc("#\\/b1")).should("have.text", `${option.animal}`);
      cy.get(cesc("#\\/c1")).should("have.text", `${option.verb}`);
    });
  });

  it("correctly rename assignNames of multiple levels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <select>
      <option>
    
        <p>q,r = <select assignNames='(q  r)'>
          <option><text>a</text><text>b</text></option>
        </select></p>
    
    
        <p>q2 = $q</p>
        <p>r2 = $r</p>
      </option>
    </select>
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let replacements =
        stateVariables[
          stateVariables["/_select1"].replacements[0].componentName
        ].replacements;

      let p1 = replacements[1].componentName;
      let p2 = replacements[3].componentName;
      let p3 = replacements[5].componentName;

      cy.get(cesc2("#" + p1)).should("have.text", `q,r = ab`);
      cy.get(cesc2("#" + p2)).should("have.text", `q2 = a`);
      cy.get(cesc2("#" + p3)).should("have.text", `r2 = b`);
    });
  });

  it("numToSelect from selectfromsequence", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>n1 = <selectFromSequence from="1" to="5" assignNames="n1" /></p>
    <p>vars = <aslist><select type="text" name="vars1" numToSelect="$n1" assignNames="a1 b1 c1 d1 e1" >u v w x y z</select></aslist></p>
    <p name="p1">a1=$a1, b1=$b1, c1=$c1, d1=$d1, e1=$e1</p>

    <p>n2 = <selectFromSequence from="1" to="5" assignNames="n2" /></p>
    <p>vars = <aslist><select type="text" name="vars2" numToSelect="$n2" assignNames="a2 b2 c2 d2 e2" >u v w x y z</select></aslist></p>
    <p name="p2">a2=$a2, b2=$b2, c2=$c2, d2=$d2, e2=$e2</p>

    <p>n3 = <selectFromSequence from="1" to="5" assignNames="n3" /></p>
    <p>vars = <aslist><select type="text" name="vars3" numToSelect="$n3" assignNames="a3 b3 c3 d3 e3" >u v w x y z</select></aslist></p>
    <p name="p3">a3=$a3, b3=$b3, c3=$c3, d3=$d3, e3=$e3</p>

    <p>n4 = <selectFromSequence from="1" to="5" assignNames="n4" /></p>
    <p>vars = <aslist><select type="text" name="vars4" numToSelect="$n4" assignNames="a4 b4 c4 d4 e4" >u v w x y z</select></aslist></p>
    <p name="p4">a4=$a4, b4=$b4, c4=$c4, d4=$d4, e4=$e4</p>

    <p>n5 = <selectFromSequence from="1" to="5" assignNames="n5" /></p>
    <p>vars = <aslist><select type="text" name="vars5" numToSelect="$n5" assignNames="a5 b5 c5 d5 e5" >u v w x y z</select></aslist></p>
    <p name="p5">a5=$a5, b5=$b5, c5=$c5, d5=$d5, e5=$e5</p>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/n1"].stateValues.value;
      let n2 = stateVariables["/n2"].stateValues.value;
      let n3 = stateVariables["/n3"].stateValues.value;
      let n4 = stateVariables["/n4"].stateValues.value;
      let n5 = stateVariables["/n5"].stateValues.value;

      let vars1 = stateVariables["/vars1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let vars2 = stateVariables["/vars2"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let vars3 = stateVariables["/vars3"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let vars4 = stateVariables["/vars4"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let vars5 = stateVariables["/vars5"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );

      expect(vars1.length).eq(n1);
      expect(vars2.length).eq(n2);
      expect(vars3.length).eq(n3);
      expect(vars4.length).eq(n4);
      expect(vars5.length).eq(n5);

      vars1.length = 5;
      vars2.length = 5;
      vars3.length = 5;
      vars4.length = 5;
      vars5.length = 5;

      vars1.fill("", n1);
      vars2.fill("", n2);
      vars3.fill("", n3);
      vars4.fill("", n4);
      vars5.fill("", n5);

      let l = ["a", "b", "c", "d", "e"];

      cy.get(cesc("#\\/p1")).should(
        "have.text",
        vars1.map((v, i) => `${l[i]}1=${v}`).join(", "),
      );
      cy.get(cesc("#\\/p2")).should(
        "have.text",
        vars2.map((v, i) => `${l[i]}2=${v}`).join(", "),
      );
      cy.get(cesc("#\\/p3")).should(
        "have.text",
        vars3.map((v, i) => `${l[i]}3=${v}`).join(", "),
      );
      cy.get(cesc("#\\/p4")).should(
        "have.text",
        vars4.map((v, i) => `${l[i]}4=${v}`).join(", "),
      );
      cy.get(cesc("#\\/p5")).should(
        "have.text",
        vars5.map((v, i) => `${l[i]}5=${v}`).join(", "),
      );
    });
  });

  it("add level to assign names even in shadow", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><select name="s" assignnames="q">a b</select></p>
    <copy target="_p1" name="c" newNamespace />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let q = stateVariables["/q"].stateValues.value;

      expect(stateVariables["/c/q"].stateValues.value).eq(q);
    });
  });

  it("ensure unique names", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <select numToSelect="3" withReplacement>
      <option><p>What is <text>this</text>?</p></option>
    </select>
    
    <select numToSelect="3" withReplacement assignNames="A B C">
      <option><p>What is <text>this</text>?</p></option>
    </select>
    
    <select numToSelect="3" withReplacement assignNames="(D) (E) (F)">
      <option><p>What is <text>this</text>?</p></option>
    </select>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let pNames1 = stateVariables["/_select1"].replacements.map(
        (x) => stateVariables[x.componentName].replacements[0].componentName,
      );
      for (let pn of pNames1) {
        cy.get(cesc2("#" + pn)).should("have.text", "What is this?");
      }

      let pNames2 = ["/A", "/B", "/C"].map(
        (x) => stateVariables[x].replacements[0].componentName,
      );
      for (let pn of pNames2) {
        cy.get(cesc2("#" + pn)).should("have.text", "What is this?");
      }

      for (let pn of ["/D", "/E", "/F"]) {
        cy.get(cesc2("#" + pn)).should("have.text", "What is this?");
      }
    });
  });
});
