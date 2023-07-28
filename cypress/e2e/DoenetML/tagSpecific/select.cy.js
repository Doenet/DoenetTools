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

    $n3{name="n2"}
    $num1{name="n"}
    <math name="num1" simplify>$n2+$num2</math>
    <math name="num2" simplify>$n3+$num3</math>
    $num3{name="n3"}
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

  it("asList", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><select name="s" assignnames="u v w x y" numToSelect="5" type="number">175 176 177 178 179 180 181</select></p>
    <p><select copySource="s" name="s2" asList="false" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let results = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      results.push(stateVariables["/u"].stateValues.value);
      results.push(stateVariables["/v"].stateValues.value);
      results.push(stateVariables["/w"].stateValues.value);
      results.push(stateVariables["/x"].stateValues.value);
      results.push(stateVariables["/y"].stateValues.value);

      for (let num of results) {
        expect(num).gte(175).lte(181);
      }

      let roundedResults = results.map((x) => Math.round(x * 100) / 100);
      cy.get(cesc2("#/_p1")).should("have.text", roundedResults.join(", "));
      cy.get(cesc2("#/_p2")).should("have.text", roundedResults.join(""));
    });
  });

  it("not list if have ps", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <section>
      <select numToSelect="4" withReplacement>
        <option><p>hello</p></option>
        <option><p>bye</p></option>
      </select>
    </section>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); //wait for page to load
    cy.get(cesc2("#/_section1")).should("not.contain.text", ",");
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
    $s1{name="noresample1"}
    $s2{name="noresample2"}
    $noresample1{name="noreresample1"}
    $noresample2{name="noreresample2"}
    </aslist>
    </p>

    <p>
    $_aslist1{name="noresamplelist"}
    </p>

    <p>
    $noresamplelist{name="noreresamplelist"}
    </p>

    $_p1{name="noresamplep"}
    $noresamplep{name="noreresamplep"}
    
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
          stateVariables["/noresamplelist"].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(x1);
      expect(
        stateVariables[
          stateVariables["/noresamplelist"].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(x2);
      expect(
        stateVariables[
          stateVariables["/noreresamplelist"].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(x1);
      expect(
        stateVariables[
          stateVariables["/noreresamplelist"].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(x2);

      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noresamplep"].activeChildren[1].componentName
          ].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(x1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noresamplep"].activeChildren[1].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(x2);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noreresamplep"].activeChildren[1].componentName
          ].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(x1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noreresamplep"].activeChildren[1].componentName
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
      <option>$x.value</option>
      <option>$y.value</option>
      <option>$z.value</option>
    </select>
    </aslist>
    </p>

    <p name="pchoices2">Selected choices: <aslist><select name="noresample" copysource="sample1" assignNames="((w1)) ((w2)) ((w3)) ((w4)) ((w5)) ((w6)) ((w7))" /></aslist></p>

    $pchoices{name="pchoices3"}

    <p>$z.value{assignNames="z2"}</p>

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
    
    <p name="p2"><aslist>$_map1</aslist></p>
    <p name="p3">$_aslist1</p>

    $p1{name="p4"}
    $p2{name="p5"}
    $p3{name="p6"}

    $p4{name="p7"}
    $p5{name="p8"}
    $p6{name="p9"}
    <p>$_mathinput1.value{assignNames="m1"}</p>
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(sampledvariables[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
    <p name="q1"><aslist>$x1$y1$z1</aslist></p>
    <p name="q2"><aslist>$x2$y2$z2</aslist></p>
    <p name="q3"><aslist>$x3$y3$z3</aslist></p>
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
    <p name="q1"><aslist>$(s1/x)$(s1/y)$(s1/z)</aslist></p>
    <p name="q2"><aslist>$(s2/x)$(s2/y)$(s2/z)</aslist></p>
    <p name="q3"><aslist>$(s3/x)$(s3/y)$(s3/z)</aslist></p>

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
      $x1$y1$z1
      $x2$y2$z2
      $x3$y3$z3
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
      <option newNamespace><p>Option 1: <math>3$(../x1)$(../y1)</math></p></option>
      <option><p name="h" newnamespace>Option 2: <math>4$(../x2)$(../y2)</math></p></option>
      <option newNamespace><p name="l">Option 3: <math>5$(../x3)$(../y3)</math></p></option>
    </select>

    <math hide name="y1">a</math>
    <math hide name="y2">b</math>
    <math hide name="y3">c</math>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}

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
        stateVariables[stateVariables["/q2"].replacements[0].componentName]
          .activeChildren;
      let q2string = q2[0];
      let q2math = me.fromAst(
        stateVariables[q2[1].componentName].stateValues.value,
      );
      expect(q2math.equals(option[q2string])).eq(true);

      let r2 =
        stateVariables[stateVariables["/r2"].replacements[0].componentName]
          .activeChildren;
      let r2string = r2[0];
      let r2math = me.fromAst(
        stateVariables[r2[1].componentName].stateValues.value,
      );
      expect(r2math.equals(option[r2string])).eq(true);

      let s2 =
        stateVariables[stateVariables["/s2"].replacements[0].componentName]
          .activeChildren;
      let s2string = s2[0];
      let s2math = me.fromAst(
        stateVariables[s2[1].componentName].stateValues.value,
      );
      expect(s2math.equals(option[s2string])).eq(true);

      let t2 =
        stateVariables[stateVariables["/t2"].replacements[0].componentName]
          .activeChildren;
      let t2string = t2[0];
      let t2math = me.fromAst(
        stateVariables[t2[1].componentName].stateValues.value,
      );
      expect(t2math.equals(option[t2string])).eq(true);

      let u2 =
        stateVariables[stateVariables["/u2"].replacements[0].componentName]
          .activeChildren;
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
      <option><p>Option 1: <math>3$x1$y1</math></p></option>
      <option><p name="h">Option 2: <math>4$x2$y2</math></p></option>
      <option><p name="l">Option 3: <math>5$x3$y3</math></p></option>
    </select>

    <math hide name="y1">a</math>
    <math hide name="y2">b</math>
    <math hide name="y3">c</math>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}

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
        stateVariables[stateVariables["/q2"].replacements[0].componentName]
          .activeChildren;
      let q2string = q2[0];
      let q2math = me.fromAst(
        stateVariables[q2[1].componentName].stateValues.value,
      );
      expect(q2math.equals(option[q2string])).eq(true);

      let r2 =
        stateVariables[stateVariables["/r2"].replacements[0].componentName]
          .activeChildren;
      let r2string = r2[0];
      let r2math = me.fromAst(
        stateVariables[r2[1].componentName].stateValues.value,
      );
      expect(r2math.equals(option[r2string])).eq(true);

      let s2 =
        stateVariables[stateVariables["/s2"].replacements[0].componentName]
          .activeChildren;
      let s2string = s2[0];
      let s2math = me.fromAst(
        stateVariables[s2[1].componentName].stateValues.value,
      );
      expect(s2math.equals(option[s2string])).eq(true);

      let t2 =
        stateVariables[stateVariables["/t2"].replacements[0].componentName]
          .activeChildren;
      let t2string = t2[0];
      let t2math = me.fromAst(
        stateVariables[t2[1].componentName].stateValues.value,
      );
      expect(t2math.equals(option[t2string])).eq(true);

      let u2 =
        stateVariables[stateVariables["/u2"].replacements[0].componentName]
          .activeChildren;
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
      <option newNamespace><p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + $x^2$z1^3</math></p></option>
      <option newNamespace><p>Option 2: <math>4<math name="x">y</math> + <math name="z2">b</math> + $x^2$z2^3</math></p></option>
      <option newNamespace><p>Option 3: <math>5<math name="x">z</math> + <math name="z3">c</math> + $x^2$z3^3</math></p></option>
    </select>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}

    <p>Copy x from within selection options</p>
    <p>$(q/x{name="qx"})</p>
    <p>$(r/x{name="rx"})</p>
    <p>$(s/x{name="sx"})</p>
    <p>$(t/x{name="tx"})</p>
    <p>$(u/x{name="ux"})</p>

    <p>Copy select itself</p>
    <section name="repeat">$_select1</section>

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
        stateVariables[stateVariables["/q2"].replacements[0].componentName]
          .activeChildren;
      let q2string = q2[0];
      let q2math = me.fromAst(
        stateVariables[q2[1].componentName].stateValues.value,
      );
      expect(q2math.equals(option[q2string])).eq(true);
      let qx = stateVariables["/qx"].stateValues.value;
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
        stateVariables[stateVariables["/r2"].replacements[0].componentName]
          .activeChildren;
      let r2string = r2[0];
      let r2math = me.fromAst(
        stateVariables[r2[1].componentName].stateValues.value,
      );
      expect(r2math.equals(option[r2string])).eq(true);
      let rx = stateVariables["/rx"].stateValues.value;
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
        stateVariables[stateVariables["/s2"].replacements[0].componentName]
          .activeChildren;
      let s2string = s2[0];
      let s2math = me.fromAst(
        stateVariables[s2[1].componentName].stateValues.value,
      );
      expect(s2math.equals(option[s2string])).eq(true);
      let sx = stateVariables["/sx"].stateValues.value;
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
        stateVariables[stateVariables["/t2"].replacements[0].componentName]
          .activeChildren;
      let t2string = t2[0];
      let t2math = me.fromAst(
        stateVariables[t2[1].componentName].stateValues.value,
      );
      expect(t2math.equals(option[t2string])).eq(true);
      let tx = stateVariables["/tx"].stateValues.value;
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
        stateVariables[stateVariables["/u2"].replacements[0].componentName]
          .activeChildren;
      let u2string = u2[0];
      let u2math = me.fromAst(
        stateVariables[u2[1].componentName].stateValues.value,
      );
      expect(u2math.equals(option[u2string])).eq(true);
      let ux = stateVariables["/ux"].stateValues.value;
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
      <option><p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + $x^2$z1^3</math></p></option>
      <option><p>Option 2: <math>4<math name="y">y</math> + <math name="z2">b</math> + $y^2$z2^3</math></p></option>
      <option><p>Option 3: <math>5<math name="z">z</math> + <math name="z3">c</math> + $z^2$z3^3</math></p></option>
    </select>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}

    <p>Copy select itself</p>
    <section name="repeat">$_select1</section>

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
        stateVariables[stateVariables["/q2"].replacements[0].componentName]
          .activeChildren;
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
        stateVariables[stateVariables["/r2"].replacements[0].componentName]
          .activeChildren;
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
        stateVariables[stateVariables["/s2"].replacements[0].componentName]
          .activeChildren;
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
        stateVariables[stateVariables["/t2"].replacements[0].componentName]
          .activeChildren;
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
        stateVariables[stateVariables["/u2"].replacements[0].componentName]
          .activeChildren;
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
    <variantControl numVariants="5" variantNames="aVocado  broCColi   carrot  Dill eggplanT"/>

    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariants="dill"><math>d</math></option>
      <option selectForVariants="Carrot"><math>c</math></option>
      <option selectForVariants="eggPlant"><math>e</math></option>
      <option selectForVariants="avocadO"><math>a</math></option>
      <option selectForVariants="broccOli"><math>b</math></option>
    </select>
    </p>

    <p>Selected variable repeated: $x{name="x2"}</p>
    <p>Selected variable repeated again: $_select1{name="x3"}</p>
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

      let x2 = stateVariables["/x2"].stateValues.value;
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
    <variantControl numVariants="5" variantNames="avocado  brOccoli   carrot  dill    eggPlant  "/>

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

    <p>Selected first variable: $x{name="x2"}</p>
    <p>Selected second variable: $y{name="y2"}</p>
    <p>Selected third variable: $z{name="z2"}</p>
    <p>Selected variables repeated: <aslist>$_select1{name="s2"}</aslist></p>

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

      let x2 = stateVariables["/x2"].stateValues.value;
      expect(x2).eq(x);
      let y2 = stateVariables["/y2"].stateValues.value;
      expect(y2).eq(y);
      let z2 = stateVariables["/z2"].stateValues.value;
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

  it("select invalid type with sugared string, becomes math with warning", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <select type="nothing" assignnames="m1 m2 m3 m4 m5" numToSelect="5">
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

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(1);

      expect(errorWarnings.warnings[0].message).contain(
        "Invalid type for select: nothing",
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(13);
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
      <option><p newNamespace><select assignnames="q r" numToSelect="2">a e i o u</select>$q{name="q2"}$r{name="r2"}</p></option>
      <option><p newNamespace><selectfromsequence type="letters" assignnames="q r" numToSelect="2" from="a" to="z" />$q{name="q2"}$r{name="r2"}</p></option>
      <option><p newNamespace><text name="q">z</text><selectfromsequence type="letters" assignnames="r" numToSelect="1" from="u" to="z" />$q{name="q2"}$r{name="r2"}</p></option>
      <option><p newNamespace><text name="q">q</text><text name="r">r</text>$q{name="q2"}$r{name="r2"}</p></option>
    </select>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}
    $v{name="v2"}
    $w{name="w2"}

    <p>Copy q and r and their copies from within selected options</p>
    <p>$(q/q{name="qq"})$(q/r{name="qr"})$(q/q2{name="qq2"})$(q/r2{name="qr2"})</p>
    <p>$(r/q{name="rq"})$(r/r{name="rr"})$(r/q2{name="rq2"})$(r/r2{name="rr2"})</p>
    <p>$(s/q{name="sq"})$(s/r{name="sr"})$(s/q2{name="sq2"})$(s/r2{name="sr2"})</p>
    <p>$(t/q{name="tq"})$(t/r{name="tr"})$(t/q2{name="tq2"})$(t/r2{name="tr2"})</p>
    <p>$(u/q{name="uq"})$(u/r{name="ur"})$(u/q2{name="uq2"})$(u/r2{name="ur2"})</p>
    <p>$(v/q{name="vq"})$(v/r{name="vr"})$(v/q2{name="vq2"})$(v/r2{name="vr2"})</p>
    <p>$(w/q{name="wq"})$(w/r{name="wr"})$(w/q2{name="wq2"})$(w/r2{name="wr2"})</p>

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

      let q2s = stateVariables["/q2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let r2s = stateVariables["/r2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let s2s = stateVariables["/s2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let t2s = stateVariables["/t2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let u2s = stateVariables["/u2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let v2s = stateVariables["/v2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let w2s = stateVariables["/w2"].activeChildren.map(
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
        stateVariables["/qq"].stateValues.value,
        stateVariables["/qr"].stateValues.value,
        stateVariables["/qq2"].stateValues.value,
        stateVariables["/qr2"].stateValues.value,
      ];
      let r3s = [
        stateVariables["/rq"].stateValues.value,
        stateVariables["/rr"].stateValues.value,
        stateVariables["/rq2"].stateValues.value,
        stateVariables["/rr2"].stateValues.value,
      ];
      let s3s = [
        stateVariables["/sq"].stateValues.value,
        stateVariables["/sr"].stateValues.value,
        stateVariables["/sq2"].stateValues.value,
        stateVariables["/sr2"].stateValues.value,
      ];
      let t3s = [
        stateVariables["/tq"].stateValues.value,
        stateVariables["/tr"].stateValues.value,
        stateVariables["/tq2"].stateValues.value,
        stateVariables["/tr2"].stateValues.value,
      ];
      let u3s = [
        stateVariables["/uq"].stateValues.value,
        stateVariables["/ur"].stateValues.value,
        stateVariables["/uq2"].stateValues.value,
        stateVariables["/ur2"].stateValues.value,
      ];
      let v3s = [
        stateVariables["/vq"].stateValues.value,
        stateVariables["/vr"].stateValues.value,
        stateVariables["/vq2"].stateValues.value,
        stateVariables["/vr2"].stateValues.value,
      ];
      let w3s = [
        stateVariables["/wq"].stateValues.value,
        stateVariables["/wr"].stateValues.value,
        stateVariables["/wq2"].stateValues.value,
        stateVariables["/wr2"].stateValues.value,
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
      <option><p newNamespace><select name="s" newnamespace assignnames="q r" numToSelect="2">a e i o u</select>$(s/q{name="q2"})$(s/r{name="r2"})</p></option>
      <option><p newNamespace><selectfromsequence type="letters" name="s" newnamespace assignnames="q r" numToSelect="2" from="a" to="z" />$(s/q{name="q2"})$(s/r{name="r2"})</p></option>
      <option><p newNamespace><selectfromsequence type="letters" name="s" newnamespace assignnames="q r" numToSelect="2" withreplacement from="u" to="z" />$(s/q{name="q2"})$(s/r{name="r2"})</p></option>
    </select>

    <p>Selected options repeated</p>
    $q{name="q2"}
    $r{name="r2"}
    $s{name="s2"}
    $t{name="t2"}
    $u{name="u2"}
    $v{name="v2"}
    $w{name="w2"}

    <p>Selected options repeated, no p</p>
    <p>$(q/s{name="q3"})</p>
    <p>$(r/s{name="r3"})</p>
    <p>$(s/s{name="s3"})</p>
    <p>$(t/s{name="t3"})</p>
    <p>$(u/s{name="u3"})</p>
    <p>$(v/s{name="v3"})</p>
    <p>$(w/s{name="w3"})</p>

    <p>Copy q and r from within selected options</p>
    <p>$(q/s/q{name="qq"})$(q/s/r{name="qr"})$(q/q2{name="qq2"})$(q/r2{name="qr2"})</p>
    <p>$(r/s/q{name="rq"})$(r/s/r{name="rr"})$(r/q2{name="rq2"})$(r/r2{name="rr2"})</p>
    <p>$(s/s/q{name="sq"})$(s/s/r{name="sr"})$(s/q2{name="sq2"})$(s/r2{name="sr2"})</p>
    <p>$(t/s/q{name="tq"})$(t/s/r{name="tr"})$(t/q2{name="tq2"})$(t/r2{name="tr2"})</p>
    <p>$(u/s/q{name="uq"})$(u/s/r{name="ur"})$(u/q2{name="uq2"})$(u/r2{name="ur2"})</p>
    <p>$(v/s/q{name="vq"})$(v/s/r{name="vr"})$(v/q2{name="vq2"})$(v/r2{name="vr2"})</p>
    <p>$(w/s/q{name="wq"})$(w/s/r{name="wr"})$(w/q2{name="wq2"})$(w/r2{name="wr2"})</p>

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

      let q2s = stateVariables["/q2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let r2s = stateVariables["/r2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let s2s = stateVariables["/s2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let t2s = stateVariables["/t2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let u2s = stateVariables["/u2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let v2s = stateVariables["/v2"].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let w2s = stateVariables["/w2"].activeChildren.map(
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
        stateVariables["/qq"].stateValues.value,
        stateVariables["/qr"].stateValues.value,
        stateVariables["/qq2"].stateValues.value,
        stateVariables["/qr2"].stateValues.value,
      ];
      let r4s = [
        stateVariables["/rq"].stateValues.value,
        stateVariables["/rr"].stateValues.value,
        stateVariables["/rq2"].stateValues.value,
        stateVariables["/rr2"].stateValues.value,
      ];
      let s4s = [
        stateVariables["/sq"].stateValues.value,
        stateVariables["/sr"].stateValues.value,
        stateVariables["/sq2"].stateValues.value,
        stateVariables["/sr2"].stateValues.value,
      ];
      let t4s = [
        stateVariables["/tq"].stateValues.value,
        stateVariables["/tr"].stateValues.value,
        stateVariables["/tq2"].stateValues.value,
        stateVariables["/tr2"].stateValues.value,
      ];
      let u4s = [
        stateVariables["/uq"].stateValues.value,
        stateVariables["/ur"].stateValues.value,
        stateVariables["/uq2"].stateValues.value,
        stateVariables["/ur2"].stateValues.value,
      ];
      let v4s = [
        stateVariables["/vq"].stateValues.value,
        stateVariables["/vr"].stateValues.value,
        stateVariables["/vq2"].stateValues.value,
        stateVariables["/vr2"].stateValues.value,
      ];
      let w4s = [
        stateVariables["/wq"].stateValues.value,
        stateVariables["/wr"].stateValues.value,
        stateVariables["/wq2"].stateValues.value,
        stateVariables["/wr2"].stateValues.value,
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
      <p><select assignnames="q r" numToSelect="2">a e i o u</select>$q{name="q2"}$r{name="r2"}</p>
      <p><selectfromsequence type="letters" assignnames="q r" numToSelect="2">a z</selectfromsequence>$q{name="q2"}$r{name="r2"}</p>
    </select>

    <p>Selected options repeated</p>
    <p>$q{name="q2"}</p>
    <p>$r{name="r2"}</p>
    <p>$s{name="s2"}</p>
    <p>$t{name="t2"}</p>
    <p>$u{name="u2"}</p>

    <p>Copy x/q and x/r and their copies from within selected options</p>
    <p>$(q/q{name="qq2"})$(q/r{name="qr2"})$qq{name="qq3"}$qr{name="qr3"}</p>
    <p>$(r/q{name="rq2"})$(r/r{name="rr2"})$rq{name="rq3"}$rr{name="rr3"}</p>
    <p>$(s/q{name="sq2"})$(s/r{name="sr2"})$sq{name="sq3"}$sr{name="sr3"}</p>
    <p>$(t/q{name="tq2"})$(t/r{name="tr2"})$tq{name="tq3"}$tr{name="tr3"}</p>
    <p>$(u/q{name="uq2"})$(u/r{name="ur2"})$uq{name="uq3"}$ur{name="ur3"}</p>

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
      <p><select name="a" assignnames="q r" numToSelect="2" newnamespace>a e i o u</select>$(a/q{name="q2"})$(a/r{name="r2"})</p>
      <p><selectfromsequence type="letters" name="b" assignnames="q r" numToSelect="2" newnamespace>a z</selectfromsequence>$(b/q{name="q2"})$(b/r{name="r2"})</p>
    </select>

    <p>Selected options repeated</p>
    <p>$q{name="q2"}</p>
    <p>$r{name="r2"}</p>
    <p>$s{name="s2"}</p>
    <p>$t{name="t2"}</p>
    <p>$u{name="u2"}</p>

    <p>Copy x/q and x/r and their copies from within selected options</p>
    <p>$(q/q{name="qq2"})$(q/r{name="qr2"})$qq{name="qq3"}$qr{name="qr3"}</p>
    <p>$(r/q{name="rq2"})$(r/r{name="rr2"})$rq{name="rq3"}$rr{name="rr3"}</p>
    <p>$(s/q{name="sq2"})$(s/r{name="sr2"})$sq{name="sq3"}$sr{name="sr3"}</p>
    <p>$(t/q{name="tq2"})$(t/r{name="tr2"})$tq{name="tq3"}$tr{name="tr3"}</p>
    <p>$(u/q{name="uq2"})$(u/r{name="ur2"})$uq{name="uq3"}$ur{name="ur3"}</p>


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
    <p>$q{name="q2"}</p>
    <p>$r{name="r2"}</p>
    <p>$s{name="s2"}</p>
    <p>$t{name="t2"}</p>
    <p>$u{name="u2"}</p>

    <p>Copy x/q and x/r</p>
    <p>$(q/q{name="qq"})$(q/r{name="qr"})</p>
    <p>$(r/q{name="rq"})$(r/r{name="rr"})</p>
    <p>$(s/q{name="sq"})$(s/r{name="sr"})</p>
    <p>$(t/q{name="tq"})$(t/r{name="tr"})</p>
    <p>$(u/q{name="uq"})$(u/r{name="ur"})</p>

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
        stateVariables["/qq"].stateValues.value,
        stateVariables["/qr"].stateValues.value,
      ];
      let r3s = [
        stateVariables["/rq"].stateValues.value,
        stateVariables["/rr"].stateValues.value,
      ];
      let s3s = [
        stateVariables["/sq"].stateValues.value,
        stateVariables["/sr"].stateValues.value,
      ];
      let t3s = [
        stateVariables["/tq"].stateValues.value,
        stateVariables["/tr"].stateValues.value,
      ];
      let u3s = [
        stateVariables["/uq"].stateValues.value,
        stateVariables["/ur"].stateValues.value,
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
    <p name="pq2">$q{name="q2"}</p>
    <p name="pr2">$r{name="r2"}</p>
    <p name="ps2">$s{name="s2"}</p>

    <p>Copy x/q, x/r, x/s</p>
    <p name="pq3">$(q/q{name="qq"})$(q/r{name="qr"})$(q/s{name="qs"})</p>
    <p name="pr3">$(r/q{name="rq"})$(r/r{name="rr"})$(r/s{name="rs"})</p>
    <p name="ps3">$(s/q{name="sq"})$(s/r{name="sr"})$(s/s{name="ss"})</p>

    <p>Copy x/x/q, x/x/r</p>
    <p name="pq4">$(q/q/q{name="qqq"})$(q/q/r{name="qqr"})$(q/r/q{name="qrq"})$(q/r/r{name="qrr"})$(q/s/q{name="qsq"})$(q/s/r{name="qsr"})</p>
    <p name="pr4">$(r/q/q{name="rqq"})$(r/q/r{name="rqr"})$(r/r/q{name="rrq"})$(r/r/r{name="rrr"})$(r/s/q{name="rsq"})$(r/s/r{name="rsr"})</p>
    <p name="ps4">$(s/q/q{name="sqq"})$(s/q/r{name="sqr"})$(s/r/q{name="srq"})$(s/r/r{name="srr"})$(s/s/q{name="ssq"})$(s/s/r{name="ssr"})</p>

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

      cy.get(cesc("#\\/pq2"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(qs.join(""));
        });
      cy.get(cesc("#\\/pr2"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(rs.join(""));
        });
      cy.get(cesc("#\\/ps2"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(ss.join(""));
        });

      cy.get(cesc("#\\/pq3"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(qs.join(""));
        });
      cy.get(cesc("#\\/pr3"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(rs.join(""));
        });
      cy.get(cesc("#\\/ps3"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(ss.join(""));
        });

      cy.get(cesc("#\\/pq4"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(qs.join(""));
        });
      cy.get(cesc("#\\/pr4"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(rs.join(""));
        });
      cy.get(cesc("#\\/ps4"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(ss.join(""));
        });
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
    <p name="pq2">$(a/q{name="q2"})</p>
    <p name="pr2">$(a/r{name="r2"})</p>
    <p name="ps2">$(a/s{name="s2"})</p>

    <p>Copy x/q, x/r, x/s</p>
    <p name="pq3">$(a/q/q{name="qq"})$(a/q/r{name="qr"})$(a/q/s{name="qs"})</p>
    <p name="pr3">$(a/r/q{name="rq"})$(a/r/r{name="rr"})$(a/r/s{name="rs"})</p>
    <p name="ps3">$(a/s/q{name="sq"})$(a/s/r{name="sr"})$(a/s/s{name="ss"})</p>

    <p>Copy x/x/q, x/x/r</p>
    <p name="pq4">$(a/q/q/q{name="qqq"})$(a/q/q/r{name="qqr"})$(a/q/r/q{name="qrq"})$(a/q/r/r{name="qrr"})$(a/q/s/q{name="qsq"})$(a/q/s/r{name="qsr"})</p>
    <p name="pr4">$(a/r/q/q{name="rqq"})$(a/r/q/r{name="rqr"})$(a/r/r/q{name="rrq"})$(a/r/r/r{name="rrr"})$(a/r/s/q{name="rsq"})$(a/r/s/r{name="rsr"})</p>
    <p name="ps4">$(a/s/q/q{name="sqq"})$(a/s/q/r{name="sqr"})$(a/s/r/q{name="srq"})$(a/s/r/r{name="srr"})$(a/s/s/q{name="ssq"})$(a/s/s/r{name="ssr"})</p>

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

      cy.get(cesc("#\\/pq2"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(qs.join(""));
        });
      cy.get(cesc("#\\/pr2"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(rs.join(""));
        });
      cy.get(cesc("#\\/ps2"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(ss.join(""));
        });

      cy.get(cesc("#\\/pq3"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(qs.join(""));
        });
      cy.get(cesc("#\\/pr3"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(rs.join(""));
        });
      cy.get(cesc("#\\/ps3"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(ss.join(""));
        });

      cy.get(cesc("#\\/pq4"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(qs.join(""));
        });
      cy.get(cesc("#\\/pr4"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(rs.join(""));
        });
      cy.get(cesc("#\\/ps4"))
        .invoke("text")
        .then((text) => {
          expect(text.replace(/, /g, "")).eq(ss.join(""));
        });
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
      <math simplify newNamespace><math name="q">z</math> + 2$q{name="v"}</math>
      $(a/w)
      $(b/q)
    </option>
    <option>
      <math name="h2" newNamespace><math name="w">u</math><math>v</math></math>
      <math simplify newNamespace><math name="q">t</math> + 2$q{name="v"}</math>
      $(a/w)
      $(b/q)
    </option>
    </select>
    
    <p>Copy grandchidren</p>
    <p>$a{name="a2"}</p>
    <p>$b{name="b2"}</p>
    <p>$c{name="c2"}</p>
    <p>$d{name="d2"}</p>
    
    <p>Copy named children of grandchild</p>
    <p>$(a/w{name="w2"})</p>
    <p>$(b/v{name="v2"})</p>
    
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

      let a2 = me.fromAst(stateVariables["/a2"].stateValues.value).toString();
      let b2 = me.fromAst(stateVariables["/b2"].stateValues.value).toString();
      let c2 = me.fromAst(stateVariables["/c2"].stateValues.value).toString();
      let d2 = me.fromAst(stateVariables["/d2"].stateValues.value).toString();
      let v2 = me.fromAst(stateVariables["/v2"].stateValues.value).toString();
      let w2 = me.fromAst(stateVariables["/w2"].stateValues.value).toString();

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
    <p><aslist name="list2">$_select1{name="s2"}</aslist></p>

    <p>Copy individual selections</p>
    <p><aslist name="list3">
    $j{name="j2"}
    $k{name="k2"}
    $l{name="l2"}
    </aslist></p>

    <p>Copy individual pieces</p>
    <p><aslist name="list4">
    $(j/a/p{name="p1"})$(j/a/q{name="p2"})$(j/a/r{name="p3"})$(j/a/s{name="p4"})$(j/b/p{name="p5"})$(j/b/q{name="p6"})$(j/b/r{name="p7"})$(j/b/s{name="p8"})
    $(k/a/p{name="p9"})$(k/a/q{name="p10"})$(k/a/r{name="p11"})$(k/a/s{name="p12"})$(k/b/p{name="p13"})$(k/b/q{name="p14"})$(k/b/r{name="p15"})$(k/b/s{name="p16"})
    $(l/a/p{name="p17"})$(l/a/q{name="p18"})$(l/a/r{name="p19"})$(l/a/s{name="p20"})$(l/b/p{name="p21"})$(l/b/q{name="p22"})$(l/b/r{name="p23"})$(l/b/s{name="p24"})
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
        me.fromAst(stateVariables["/p" + (i + 1)].stateValues.value).toString(),
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
    <p><aslist name="list2">$s{name="s2"}</aslist></p>

    <p>Copy individual selections</p>
    <p><aslist name="list3">
    $(s/j{name="j2"})
    $(s/k{name="k2"})
    $(s/l{name="l2"})
    </aslist></p>

    <p>Copy individual pieces</p>
    <p><aslist name="list4">
    $(s/j/a/v/p{name="p1"})$(s/j/a/v/q{name="p2"})$(s/j/a/v/r{name="p3"})$(s/j/a/v/s{name="p4"})$(s/j/b/v/p{name="p5"})$(s/j/b/v/q{name="p6"})$(s/j/b/v/r{name="p7"})$(s/j/b/v/s{name="p8"})
    $(s/k/a/v/p{name="p9"})$(s/k/a/v/q{name="p10"})$(s/k/a/v/r{name="p11"})$(s/k/a/v/s{name="p12"})$(s/k/b/v/p{name="p13"})$(s/k/b/v/q{name="p14"})$(s/k/b/v/r{name="p15"})$(s/k/b/v/s{name="p16"})
    $(s/l/a/v/p{name="p17"})$(s/l/a/v/q{name="p18"})$(s/l/a/v/r{name="p19"})$(s/l/a/v/s{name="p20"})$(s/l/b/v/p{name="p21"})$(s/l/b/v/q{name="p22"})$(s/l/b/v/r{name="p23"})$(s/l/b/v/s{name="p24"})
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
        me.fromAst(stateVariables["/p" + (i + 1)].stateValues.value).toString(),
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
      <p>$c, $d</p>
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
      <p>$a, <copy hide="true" target="b" />, $c, <copy hide="false" target="d" />, $e</p>
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
    <p>$c, $d</p>
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

    <p name="pa1">a1: $a{assignNames="a11 a12 a13 a14"}</p>

    <p name="ppieces" >pieces: <select copySource="_select1" assignNames="(b c d e)" /></p>
  
    <p name="pb1">b1: $b{name="b1"}</p>
    <p name="pc1">c1: $c{name="c1"}</p>
    <p name="pd1">d1: $d{name="d1"}</p>
    <p name="pe1">e1: $e{name="e1"}</p>
  
    
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
      cy.get(cesc("#\\/pb1")).should("have.text", `b1: `);
      cy.get(cesc("#\\/pc1")).should("have.text", `c1: ${option.animal}`);
      cy.get(cesc("#\\/pd1")).should("have.text", `d1: ${option.verb}`);
      cy.get(cesc("#\\/pe1")).should("have.text", `e1: `);

      cy.get(cesc("#\\/a11")).should("not.exist");
      cy.get(cesc("#\\/a12")).should("have.text", `${option.animal}`);
      cy.get(cesc("#\\/a13")).should("have.text", `${option.verb}`);
      cy.get(cesc("#\\/a14")).should("not.exist");
      cy.get(cesc("#\\/b1")).should("not.exist");
      cy.get(cesc("#\\/c1")).should("have.text", `${option.animal}`);
      cy.get(cesc("#\\/d1")).should("have.text", `${option.verb}`);
      cy.get(cesc("#\\/e1")).should("not.exist");
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

  it("display error when miss a name in selectForVariants, inside text", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <variantControl variantNames="apple banana cherry" numVariants="3" />
    
    <p>We have a <text><select>
      <option selectForVariants="apple">apple</option>
      <option selectForVariants="cherry">cherry</option>
    </select></text>!</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_p1")).should("contain.text", "We have a ");
    cy.get(cesc2("#/_p1")).should("contain.text", "!");
    cy.get(cesc2("#/_p1")).should(
      "contain.text",
      "Some variants are specified for select but no options are specified for possible variant name: banana",
    );
    cy.get(cesc2("#/_p1")).should("contain.text", "lines 4–7");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(1);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Some variants are specified for select but no options are specified for possible variant name: banana",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(24);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(13);
    });
  });

  it("display error when repeat name in selectForVariants more times than numToSelect, inside p", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <variantControl variantNames="apple banana cherry" numVariants="3" />
    
    <p>We have a <select>
      <option selectForVariants="apple">apple</option>
      <option selectForVariants="apple">cherry</option>
    </select>!</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_p1")).should("contain.text", "We have a ");
    cy.get(cesc2("#/_p1")).should("contain.text", "!");
    cy.get(cesc2("#/_p1")).should(
      "contain.text",
      "Invalid variant name for select.  Variant name apple appears in 2 options but number to select is 1",
    );
    cy.get(cesc2("#/_p1")).should("contain.text", "lines 4–7");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(1);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Invalid variant name for select.  Variant name apple appears in 2 options but number to select is 1",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(18);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(13);
    });
  });

  it("display error when repeat name in selectForVariants more times than numToSelect, inside document", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <variantControl variantNames="apple banana" numVariants="2" />
    
    We have a <select>
      <option selectForVariants="apple">apple</option>
      <option selectForVariants="banana">banana</option>
      <option selectForVariants="donut">donut</option>
    </select>!
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_document1")).should("contain.text", "We have a ");
    cy.get(cesc2("#/_document1")).should("contain.text", "!");
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Variant name donut that is specified for select is not a possible variant name",
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "lines 4–8");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(1);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Variant name donut that is specified for select is not a possible variant name",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(15);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(8);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(13);
    });
  });

  it("display error when numToSelect is larger than number of options, inside graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>No points for graph!</p>

    <graph><select numToSelect="3">
      <option><point>(3,4)</point></option>
      <option><point>(5,6)</point></option>
    </select></graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_p1")).should("contain.text", "No points for graph!");
    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "Cannot select 3 components from only 2",
    );
    cy.get(cesc2("#/_document1")).should("contain.text", "lines 4–7");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(1);
      expect(errorWarnings.warnings.length).eq(0);

      expect(errorWarnings.errors[0].message).contain(
        "Cannot select 3 components from only 2",
      );
      expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(4);
      expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(12);
      expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(13);
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
