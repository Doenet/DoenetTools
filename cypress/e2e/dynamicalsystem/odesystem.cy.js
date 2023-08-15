import { createFunctionFromDefinition } from "../../../../src/Core/utils/function";
import { cesc } from "../../../../src/utils/url";

describe("ODEsystem Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("1D linear system", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>a = <mathinput name="a" prefill="1"/></p>
    <p>initial condition = <mathinput name="ic" prefill="1"/></p>
    <p>tol = <mathinput name="tol" parseScientificNotation prefill="1E-6"/></p>
    <odesystem name="ode" tolerance="$tol" initialconditions="$ic">
    <righthandside simplify>$a x</righthandside>

    </odesystem>

    <graph>
    $ode.numericalsolution{assignNames="f"}
    <point x='$zeroFixed' y='$ic' />
    </graph>

    <p><aslist><map>
      <template><evaluate function="$f" input="$v" /></template>
      <sources alias="v">
        <sequence from="0" to="5" step="0.5" />
      </sources>
    </map></aslist></p>

    <number fixed hide name="zeroFixed">0</number>
    $tol.value{assignNames="tol2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=xx(0)=1");
      });

    let ic = 1,
      a = 1,
      tol = 1e-6;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );

      let expectedF = (x) => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(
          expectedF(x),
          tol * Math.max(1, Math.abs(expectedF(x))),
        );
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }
    });

    cy.log("Change initial condition");
    cy.get(cesc("#\\/ic") + " textarea").type(`{end}{backspace}3{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=xx(0)=3",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=xx(0)=3");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      ic = 3;

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let expectedF = (x) => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(
          expectedF(x),
          tol * Math.max(1, Math.abs(expectedF(x))),
        );
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }
    });

    cy.log("Change parameter");
    cy.get(cesc("#\\/a") + " textarea").type(`{end}{backspace}-2{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=−2xx(0)=3",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.replace("−", "-").trim()).equal("dxdt=-2xx(0)=3");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      a = -2;

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let expectedF = (x) => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(
          expectedF(x),
          tol * Math.max(1, Math.abs(expectedF(x))),
        );
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }
    });

    cy.log("Change ic with point");
    cy.window().then(async (win) => {
      ic = -5;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { y: ic },
      });

      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let expectedF = (x) => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(
          expectedF(x),
          tol * Math.max(1, Math.abs(expectedF(x))),
        );
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }
    });

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=−2xx(0)=−5",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/−/g, "-").trim()).equal("dxdt=-2xx(0)=-5");
      });

    cy.log("Change tolerance");
    cy.get(cesc("#\\/tol") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}1E-10{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/tol2") + " .mjx-mrow").should("contain.text", "1⋅10−10");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/−/g, "-").trim()).equal("dxdt=-2xx(0)=-5");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      tol = 1e-10;

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let expectedF = (x) => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(
          expectedF(x),
          tol * Math.max(1, Math.abs(expectedF(x))),
        );
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }
    });

    cy.log("Change parameter again");
    cy.get(cesc("#\\/a") + " textarea").type(
      `{end}{backspace}{backspace}0.5{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=0.5xx(0)=−5",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/−/g, "-").trim()).equal("dxdt=0.5xx(0)=-5");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      a = 0.5;

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let expectedF = (x) => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(
          expectedF(x),
          tol * Math.max(1, Math.abs(expectedF(x))),
        );
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }
    });

    cy.log("Change initial condition to zero");
    cy.get(cesc("#\\/ic") + " textarea").type(
      `{end}{backspace}{backspace}0{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=0.5xx(0)=0",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/−/g, "-").trim()).equal("dxdt=0.5xx(0)=0");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      for (let x = 0; x <= 1000; x += 100) {
        expect(solutionF(x)).eq(0);
      }
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionsFromCore[2 * x]).eq(0);
      }
    });
  });

  it("effect of max iterations, chunksize", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>tol = <mathinput name="tol" parseScientificNotation prefill="1E-6"/></p>
  <p>T = <mathinput name="T" prefill="10"/></p>
  <p>maxiter = <mathinput name="maxiter" prefill="1000"/></p>
  <p>chunksize = <mathinput name="chunksize" prefill="10"/></p>
  <odesystem name="ode" initialconditions="1" maxiterations="$maxiter" tolerance="$tol" chunksize="$chunksize">
    <righthandside>x</righthandside>
  </odesystem>

  <p><m>f($T) = $$(ode.numericalSolution)($T)
  </m></p>


  $tol.value{assignNames="tol2"}
  $T.value{assignNames="T2"}
  $maxiter.value{assignNames="maxiter2"}
  $chunksize.value{assignNames="chunksize2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let tol = 1e-6;
    let expectedF = (x) => Math.exp(x);

    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text.split("=")[1])).closeTo(
          expectedF(10),
          tol * expectedF(10),
        );
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      for (let x = 0; x <= 10; x += 1) {
        expect(solutionF(x)).closeTo(
          expectedF(x),
          tol * Math.max(1, Math.abs(expectedF(x))),
        );
      }
    });

    cy.log("Can't make it to t=20");
    cy.get(cesc("#\\/T") + " textarea").type(
      `{end}{backspace}{backspace}20{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/T2") + " .mjx-mrow").should("contain.text", "20");
    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.split("=")[1].trim()).eq("NaN");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      assert.isNaN(solutionF(20));
    });

    cy.log("increase maxiterations");
    cy.get(cesc("#\\/maxiter") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}2000{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/maxiter2") + " .mjx-mrow").should("contain.text", "2000");
    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text.split("=")[1])).closeTo(
          expectedF(20),
          tol * expectedF(20),
        );
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      for (let x = 0; x <= 20; x += 1) {
        expect(solutionF(x)).closeTo(
          expectedF(x),
          tol * Math.max(1, Math.abs(expectedF(x))),
        );
      }
    });

    cy.log("Can't make it if decrease tolerance");
    cy.get(cesc("#\\/tol") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}1E-8{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/tol2") + " .mjx-mrow").should("contain.text", "1⋅10−8");
    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.split("=")[1].trim()).eq("NaN");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      assert.isNaN(solutionF(20));
    });

    cy.log("increase maxiterations further");
    cy.get(cesc("#\\/maxiter") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}5000{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/maxiter2") + " .mjx-mrow").should("contain.text", "5000");
    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text.split("=")[1])).closeTo(
          expectedF(20),
          tol * expectedF(20),
        );
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      for (let x = 0; x <= 20; x += 1) {
        expect(solutionF(x)).closeTo(
          expectedF(x),
          tol * Math.max(1, Math.abs(expectedF(x))),
        );
      }
    });

    cy.log("decrease maxiterations back down");
    cy.get(cesc("#\\/maxiter") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}1000{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/maxiter2") + " .mjx-mrow").should("contain.text", "1000");
    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.split("=")[1].trim()).eq("NaN");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      assert.isNaN(solutionF(20));
    });

    cy.log("decrease chunksize");
    cy.get(cesc("#\\/chunksize") + " textarea").type(
      `{end}{backspace}{backspace}1{enter}`,
      { force: true },
    );

    cy.get(cesc("#\\/chunksize2") + " .mjx-mrow").should(
      "not.contain.text",
      "10",
    );
    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text.split("=")[1])).closeTo(
          expectedF(20),
          tol * expectedF(20),
        );
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      for (let x = 0; x <= 20; x += 1) {
        expect(solutionF(x)).closeTo(
          expectedF(x),
          tol * Math.max(1, Math.abs(expectedF(x))),
        );
      }
    });
  });

  it("change variables 1D", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>independent variable = <mathinput name="ivar" prefill="t"/></p>
  <p>dependent variable = <mathinput name="dvar" prefill="x"/></p>
  
  <odesystem name="ode" initialconditions="1" independentvariable="$ivar" variables="$dvar">
  <righthandside>$dvar</righthandside>
  </odesystem>

  <graph>
  $ode.numericalsolution{assignNames="f"}
  </graph>


  <p><aslist><map>
    <template><evaluate function="$f" input="$v" /></template>
    <sources alias="v">
      <sequence from="0" to="5" />
    </sources>
  </map></aslist></p>

  $ivar.value{assignNames="ivar2"}
  $dvar.value{assignNames="dvar2"}
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let tol = 1e-6;
    let expectedF = (x) => Math.exp(x);

    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=xx(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );

      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(
          expectedF(t),
          tol * Math.max(1, Math.abs(expectedF(t))),
        );
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });

    cy.log("change independent variable");
    cy.get(cesc("#\\/ivar") + " textarea").type(`{end}{backspace}s{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/ivar2") + " .mjx-mrow").should("contain.text", "s");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxds=xx(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(
          expectedF(t),
          tol * Math.max(1, Math.abs(expectedF(t))),
        );
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });

    cy.log("erase independent variable");
    cy.get(cesc("#\\/ivar") + " textarea").type("{end}{backspace}{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/ivar2") + " .mjx-mrow").should("contain.text", "＿");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxd＿=xx(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
        assert.isNaN(solutionsFromCore[t]);
      }
    });

    cy.log("restore independent variable");
    cy.get(cesc("#\\/ivar") + " textarea").type("{end}{backspace}u{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/ivar2") + " .mjx-mrow").should("contain.text", "u");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdu=xx(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(
          expectedF(t),
          tol * Math.max(1, Math.abs(expectedF(t))),
        );
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });

    cy.log("invalid independent variable");
    cy.get(cesc("#\\/ivar") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/ivar2") + " .mjx-mrow").should("contain.text", "1");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxd1=xx(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
        assert.isNaN(solutionsFromCore[t]);
      }
    });

    cy.log("restore independent variable");
    cy.get(cesc("#\\/ivar") + " textarea").type("{end}{backspace}v{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/ivar2") + " .mjx-mrow").should("contain.text", "v");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdv=xx(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(
          expectedF(t),
          tol * Math.max(1, Math.abs(expectedF(t))),
        );
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });

    cy.log("change dependent variable");
    cy.get(cesc("#\\/dvar") + " textarea").type("{end}{backspace}z{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/dvar2") + " .mjx-mrow").should("contain.text", "z");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dzdv=zz(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(
          expectedF(t),
          tol * Math.max(1, Math.abs(expectedF(t))),
        );
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });

    cy.log("duplicate variable");
    cy.get(cesc("#\\/dvar") + " textarea").type("{end}{backspace}v{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/dvar2") + " .mjx-mrow").should("contain.text", "v");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dvdv=vv(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
        assert.isNaN(solutionsFromCore[t]);
      }
    });

    cy.log("different dependent variable");
    cy.get(cesc("#\\/dvar") + " textarea").type("{end}{backspace}v_1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/dvar2") + " .mjx-mrow").should("contain.text", "v1");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dv1dv=v1v1(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(
          expectedF(t),
          tol * Math.max(1, Math.abs(expectedF(t))),
        );
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });

    cy.log("invalid dependent variable");
    cy.get(cesc("#\\/dvar") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}ab{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/dvar2") + " .mjx-mrow").should("contain.text", "ab");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dabdv=abab(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
        assert.isNaN(solutionsFromCore[t]);
      }
    });

    cy.log("restore dependent variable");
    cy.get(cesc("#\\/dvar") + " textarea").type(
      "{end}{backspace}{backspace}a{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/dvar2") + " .mjx-mrow").should("not.contain.text", "ab");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dadv=aa(0)=1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(
        stateVariables["/ode"].stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(
          expectedF(t),
          tol * Math.max(1, Math.abs(expectedF(t))),
        );
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });
  });

  it("display digits", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>displaydigits = <mathinput name="digits" prefill="10"/></p>

  <odesystem name="ode" displaydigits="$digits" initialconditions="9.87654321987654321">
  <righthandside>0.123456789123456789x</righthandside>
  </odesystem>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=0.1234567891xx(0)=9.87654322");
      });

    cy.log("change display digits");
    cy.get(cesc("#\\/digits") + " textarea").type(
      "{end}{backspace}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=0.12xx(0)=9.9",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=0.12xx(0)=9.9");
      });

    cy.log("change display digits again");
    cy.get(cesc("#\\/digits") + " textarea").type("{end}{backspace}14{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=0.12345678912346xx(0)=9.8765432198765",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=0.12345678912346xx(0)=9.8765432198765");
      });
  });

  it("initial independent variable value", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>initial t = <mathinput name="t0" prefill="0"/></p>
  <p>final t = <mathinput name="tf" prefill="10"/></p>
  
  <odesystem name="ode" initialconditions="1" initialIndependentVariableValue="$t0" displayDigits="10">
    <righthandside>x</righthandside>
  </odesystem>

  <p>We started with 
  <m>x($ode.initialindependentvariablevalue) = 1</m>.</p>

  <p>We end with
  <m>x($tf) = $$(ode.numericalSolution)($tf)</m></p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=xx(0)=1");
      });

    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x(0)=1");
      });

    cy.get(cesc("#\\/_m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.split("=")[0].trim()).equal("x(10)");
        expect(Number(text.split("=")[1])).closeTo(
          Math.exp(10),
          1e-6 * Math.exp(10),
        );
      });

    cy.log("Change initial time");
    cy.get(cesc("#\\/t0") + " textarea").type("{end}{backspace}-5{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=xx(−5)=1",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=xx(−5)=1");
      });

    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x(−5)=1");
      });

    cy.get(cesc("#\\/_m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.split("=")[0].trim()).equal("x(10)");
        expect(Number(text.split("=")[1])).closeTo(
          Math.exp(15),
          1e-6 * Math.exp(15),
        );
      });

    cy.log("Change initial and final time");
    cy.get(cesc("#\\/tf") + " textarea").type(
      "{end}{backspace}{backspace}12{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/t0") + " textarea").type(
      "{end}{backspace}{backspace}11{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=xx(11)=1",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=xx(11)=1");
      });

    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x(11)=1");
      });

    cy.get(cesc("#\\/_m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.split("=")[0].trim()).equal("x(12)");
        expect(Number(text.split("=")[1])).closeTo(
          Math.exp(1),
          1e-6 * Math.exp(1),
        );
      });
  });

  it("display initial conditions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>display initial conditions: <booleaninput name="showic" prefill="true"/></p>  
  <odesystem name="ode" initialconditions="1" hideInitialCondition="!$showic">
    <righthandside>x</righthandside>
  </odesystem>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=xx(0)=1");
      });

    cy.log("don't display initial conditions");
    cy.get(cesc("#\\/showic")).click();
    cy.get(cesc("#\\/ode") + " .mjx-mrow").should("contain.text", "dxdt=x");
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=x");
      });

    cy.log("display initial conditions again");
    cy.get(cesc("#\\/showic")).click();
    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=xx(0)=1",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=xx(0)=1");
      });
  });

  it("2D linear system", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>initial condition 1 = <mathinput name="ic1" prefill="1"/></p>
  <p>initial condition 2 = <mathinput name="ic2" prefill="3"/></p>
  <odesystem name="ode" initialconditions="$ic1 $ic2">
  <righthandside>-0.2y</righthandside>
  <righthandside>0.1x + 0.3y</righthandside>
  </odesystem>

  <graph>
    <curve parmin="0" parmax="10">
      $ode.numericalsolutions{assignNames="f1 f2"}
    </curve>
    <point x="$ic1" y="$ic2" />
  </graph>

  <p><aslist><map>
    <template><evaluate function="$f1" input="$v" /><evaluate function="$f2" input="$v" /></template>
    <sources alias="v">
      <sequence from="0" to="10" />
    </sources>
  </map></aslist></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let tol = 1e-6;

    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal(
          "dxdt=-0.2ydydt=0.1x+0.3yx(0)=1y(0)=3",
        );
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let ode = stateVariables["/ode"];
      let solutionFx = createFunctionFromDefinition(
        ode.stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionFy = createFunctionFromDefinition(
        ode.stateValues.numericalSolutionFDefinitions[1],
      );
      let solutionFx2 = createFunctionFromDefinition(
        stateVariables["/f1"].stateValues.fDefinitions[0],
      );
      let solutionFy2 = createFunctionFromDefinition(
        stateVariables["/f2"].stateValues.fDefinitions[0],
      );
      let solutionsFromCoreX = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let solutionsFromCoreY = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[1].componentName
          ].stateValues.value,
      );
      let expectedFx = (t) => 8 * Math.exp(0.1 * t) - 7 * Math.exp(0.2 * t);
      let expectedFy = (t) => -4 * Math.exp(0.1 * t) + 7 * Math.exp(0.2 * t);
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).closeTo(
          expectedFx(t),
          tol * Math.max(1, Math.abs(expectedFx(t))),
        );
        expect(solutionFy(t)).closeTo(
          expectedFy(t),
          tol * Math.max(1, Math.abs(expectedFy(t))),
        );
        expect(solutionFx2(t)).eq(solutionFx(t));
        expect(solutionFy2(t)).eq(solutionFy(t));
        expect(solutionsFromCoreX[t]).eq(solutionFx(t));
        expect(solutionsFromCoreY[t]).eq(solutionFy(t));
      }
    });

    cy.log("Change initial condition");
    cy.get(cesc("#\\/ic1") + " textarea").type(`{end}{backspace}3{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/ic2") + " textarea").type(`{end}{backspace}-1{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=−0.2ydydt=0.1x+0.3yx(0)=3y(0)=−1",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal(
          "dxdt=-0.2ydydt=0.1x+0.3yx(0)=3y(0)=-1",
        );
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let ode = stateVariables["/ode"];
      let solutionFx = createFunctionFromDefinition(
        ode.stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionFy = createFunctionFromDefinition(
        ode.stateValues.numericalSolutionFDefinitions[1],
      );
      let solutionFx2 = createFunctionFromDefinition(
        stateVariables["/f1"].stateValues.fDefinitions[0],
      );
      let solutionFy2 = createFunctionFromDefinition(
        stateVariables["/f2"].stateValues.fDefinitions[0],
      );
      let solutionsFromCoreX = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let solutionsFromCoreY = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[1].componentName
          ].stateValues.value,
      );
      let expectedFx = (t) => 4 * Math.exp(0.1 * t) - 1 * Math.exp(0.2 * t);
      let expectedFy = (t) => -2 * Math.exp(0.1 * t) + 1 * Math.exp(0.2 * t);
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).closeTo(
          expectedFx(t),
          tol * Math.max(1, Math.abs(expectedFx(t))),
        );
        expect(solutionFy(t)).closeTo(
          expectedFy(t),
          tol * Math.max(1, Math.abs(expectedFy(t))),
        );
        expect(solutionFx2(t)).eq(solutionFx(t));
        expect(solutionFy2(t)).eq(solutionFy(t));
        expect(solutionsFromCoreX[t]).eq(solutionFx(t));
        expect(solutionsFromCoreY[t]).eq(solutionFy(t));
      }
    });

    cy.log("Change ic with point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: 2 },
      });

      let stateVariables = await win.returnAllStateVariables1();

      let ode = stateVariables["/ode"];
      let solutionFx = createFunctionFromDefinition(
        ode.stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionFy = createFunctionFromDefinition(
        ode.stateValues.numericalSolutionFDefinitions[1],
      );
      let solutionFx2 = createFunctionFromDefinition(
        stateVariables["/f1"].stateValues.fDefinitions[0],
      );
      let solutionFy2 = createFunctionFromDefinition(
        stateVariables["/f2"].stateValues.fDefinitions[0],
      );
      let solutionsFromCoreX = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let solutionsFromCoreY = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[1].componentName
          ].stateValues.value,
      );
      let expectedFx = (t) => -6 * Math.exp(0.1 * t) + 1 * Math.exp(0.2 * t);
      let expectedFy = (t) => 3 * Math.exp(0.1 * t) - 1 * Math.exp(0.2 * t);
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).closeTo(
          expectedFx(t),
          tol * Math.max(1, Math.abs(expectedFx(t))),
        );
        expect(solutionFy(t)).closeTo(
          expectedFy(t),
          tol * Math.max(1, Math.abs(expectedFy(t))),
        );
        expect(solutionFx2(t)).eq(solutionFx(t));
        expect(solutionFy2(t)).eq(solutionFy(t));
        expect(solutionsFromCoreX[t]).eq(solutionFx(t));
        expect(solutionsFromCoreY[t]).eq(solutionFy(t));
      }
    });

    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal(
          "dxdt=-0.2ydydt=0.1x+0.3yx(0)=-5y(0)=2",
        );
      });

    cy.log("Change initial condition to zero");
    cy.get(cesc("#\\/ic1") + " textarea").type(
      `{end}{backspace}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/ic2") + " textarea").type(`{end}{backspace}0{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/ode") + " .mjx-mrow").should(
      "contain.text",
      "dxdt=−0.2ydydt=0.1x+0.3yx(0)=0y(0)=0",
    );
    cy.get(cesc("#\\/ode"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().replace(/−/g, "-")).equal(
          "dxdt=-0.2ydydt=0.1x+0.3yx(0)=0y(0)=0",
        );
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let ode = stateVariables["/ode"];
      let solutionFx = createFunctionFromDefinition(
        ode.stateValues.numericalSolutionFDefinitions[0],
      );
      let solutionFy = createFunctionFromDefinition(
        ode.stateValues.numericalSolutionFDefinitions[1],
      );
      let solutionFx2 = createFunctionFromDefinition(
        stateVariables["/f1"].stateValues.fDefinitions[0],
      );
      let solutionFy2 = createFunctionFromDefinition(
        stateVariables["/f2"].stateValues.fDefinitions[0],
      );
      let solutionsFromCoreX = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[0].componentName
          ].stateValues.value,
      );
      let solutionsFromCoreY = stateVariables["/_map1"].replacements.map(
        (x) =>
          stateVariables[
            stateVariables[x.componentName].replacements[1].componentName
          ].stateValues.value,
      );
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).eq(0);
        expect(solutionFy(t)).eq(0);
        expect(solutionFx2(t)).eq(solutionFx(t));
        expect(solutionFy2(t)).eq(solutionFy(t));
        expect(solutionsFromCoreX[t]).eq(solutionFx(t));
        expect(solutionsFromCoreY[t]).eq(solutionFy(t));
      }
    });
  });

  it("higher dimensional ode", () => {
    cy.log("no variables specified");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <odesystem initialconditions="a b c d e f">
  <righthandside>q</righthandside>
  <righthandside>r</righthandside>
  <righthandside>s</righthandside>
  <righthandside>u</righthandside>
  <righthandside>v</righthandside>
  <righthandside>w</righthandside>
  </odesystem>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let disp = function (vs, rs, is) {
      let s = "";
      for (let i = 0; i < vs.length; i++) {
        s += "d" + vs[i] + "dt=" + rs[i];
      }
      for (let i = 0; i < vs.length; i++) {
        s += vs[i] + "(0)=" + is[i];
      }
      return s;
    };

    let vs = ["x1", "x2", "x3", "x4", "x5", "x6"];
    let rs = ["q", "r", "s", "u", "v", "w"];
    let is = ["a", "b", "c", "d", "e", "f"];

    cy.get(cesc("#\\/_odesystem1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(disp(vs, rs, is));
      });

    cy.log("all variables specified");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>b</text>
  <odesystem initialconditions="a b c d e f" variables="j k l m n p">
  <righthandside>q</righthandside>
  <righthandside>r</righthandside>
  <righthandside>s</righthandside>
  <righthandside>u</righthandside>
  <righthandside>v</righthandside>
  <righthandside>w</righthandside>
  </odesystem>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "b"); // to wait for page to load

    let vs2 = ["j", "k", "l", "m", "n", "p"];

    cy.get(cesc("#\\/_odesystem1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(disp(vs2, rs, is));
      });

    cy.log("some variables specified");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>c</text>
  <odesystem initialconditions="a b c d e f" variables="j k l">
  <righthandside>q</righthandside>
  <righthandside>r</righthandside>
  <righthandside>s</righthandside>
  <righthandside>u</righthandside>
  <righthandside>v</righthandside>
  <righthandside>w</righthandside>
  </odesystem>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "c"); // to wait for page to load

    let vs3 = ["j", "k", "l", "x4", "x5", "x6"];

    cy.get(cesc("#\\/_odesystem1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(disp(vs3, rs, is));
      });
  });

  it("copy righthandside, initial conditions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <odesystem name="ode" initialconditions="c 3">
  <righthandside>a*x*y+z</righthandside>
  <righthandside>x/y</righthandside>
  </odesystem>

  <p>RHS1: $ode.rhs1{name="rhs1a"}</p>
  <p>RHS2: $ode.rhs2{name="rhs2a"}</p>
  <p>RHS1: $ode.rhs{name="rhs1b"}</p>
  <p>Both RHSs: <aslist>$ode.rhss{name="rhssa"}</aslist></p>
  <p>RHS1: $ode.righthandside1{name="rhs1c"}</p>
  <p>RHS2: $ode.righthandside2{name="rhs2b"}</p>
  <p>RHS1: $ode.righthandside{name="rhs1d"}</p>
  <p>Both RHSs: <aslist>$ode.righthandsides{name="rhssb"}</aslist></p>
  
  <p>IC1: $ode.initialcondition1{name="ic1a"}</p>
  <p>IC2: $ode.initialcondition2{name="ic2a"}</p>
  <p>IC1: $ode.initialcondition{name="ic1b"}</p>
  <p>Both ICs: <aslist>$ode.initialconditions{name="icsa"}</aslist></p>

  <p>Swap right hand sides and keep initial conditions</p>

  <odesystem name="odeswap" initialconditions="$(ode.initialconditions)">
    <righthandside>$ode.rhs2</righthandside>
    <righthandside>$ode.rhs1</righthandside>
  </odesystem>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("axy+z");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("xy");
      });
    cy.get(cesc("#\\/_p3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("axy+z");
      });
    cy.get(cesc("#\\/_p4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("axy+z");
      });
    cy.get(cesc("#\\/_p4") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("xy");
      });
    cy.get(cesc("#\\/_p5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("axy+z");
      });
    cy.get(cesc("#\\/_p6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("xy");
      });
    cy.get(cesc("#\\/_p7"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("axy+z");
      });
    cy.get(cesc("#\\/_p8"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("axy+z");
      });
    cy.get(cesc("#\\/_p8") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("xy");
      });
    cy.get(cesc("#\\/_p9"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/_p10"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/_p11"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/_p12"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/_p12") + " > span:nth-of-type(2)")
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });

    cy.get(cesc("#\\/odeswap"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("dxdt=xydydt=axy+zx(0)=cy(0)=3");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let rhs1tree = ["+", ["*", "a", "x", "y"], "z"];
      let rhs2tree = ["/", "x", "y"];
      expect(
        stateVariables[stateVariables["/rhs1a"].replacements[0].componentName]
          .stateValues.value,
      ).eqls(rhs1tree);
      expect(
        stateVariables[stateVariables["/rhs1b"].replacements[0].componentName]
          .stateValues.value,
      ).eqls(rhs1tree);
      expect(
        stateVariables[stateVariables["/rhs1c"].replacements[0].componentName]
          .stateValues.value,
      ).eqls(rhs1tree);
      expect(
        stateVariables[stateVariables["/rhs1d"].replacements[0].componentName]
          .stateValues.value,
      ).eqls(rhs1tree);
      expect(
        stateVariables[stateVariables["/rhs2a"].replacements[0].componentName]
          .stateValues.value,
      ).eqls(rhs2tree);
      expect(
        stateVariables[stateVariables["/rhs2b"].replacements[0].componentName]
          .stateValues.value,
      ).eqls(rhs2tree);
      expect(
        stateVariables[stateVariables["/rhssa"].replacements[0].componentName]
          .stateValues.value,
      ).eqls(rhs1tree);
      expect(
        stateVariables[stateVariables["/rhssa"].replacements[1].componentName]
          .stateValues.value,
      ).eqls(rhs2tree);
      expect(
        stateVariables[stateVariables["/rhssb"].replacements[0].componentName]
          .stateValues.value,
      ).eqls(rhs1tree);
      expect(
        stateVariables[stateVariables["/rhssb"].replacements[1].componentName]
          .stateValues.value,
      ).eqls(rhs2tree);
      expect(
        stateVariables[stateVariables["/ic1a"].replacements[0].componentName]
          .stateValues.value,
      ).eqls("c");
      expect(
        stateVariables[stateVariables["/ic1b"].replacements[0].componentName]
          .stateValues.value,
      ).eqls("c");
      expect(
        stateVariables[stateVariables["/ic2a"].replacements[0].componentName]
          .stateValues.value,
      ).eqls(3);
      expect(
        stateVariables[stateVariables["/icsa"].replacements[0].componentName]
          .stateValues.value,
      ).eqls("c");
      expect(
        stateVariables[stateVariables["/icsa"].replacements[1].componentName]
          .stateValues.value,
      ).eqls(3);
    });
  });

  it("warnings", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
<text>a</text>
<odesystem variables="y" independentVariable="y">
  <righthandside>5y</righthandside>
</odesystem>

<odesystem variables="y" independentVariable="sin(x)">
  <righthandside>5y</righthandside>
</odesystem>

<odesystem variables="sin(y)" independentVariable="t">
  <righthandside>5y</righthandside>
</odesystem>

<odesystem variables="x x" independentVariable="t">
  <righthandside>5x</righthandside>
  <righthandside>3x</righthandside>
</odesystem>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(4);

      expect(errorWarnings.warnings[0].message).contain(
        `Invalid value of a variable: sin(x)`,
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(7);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(47);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(7);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(52);

      expect(errorWarnings.warnings[1].message).contain(
        `Variables of <odesystem> must be different than independent variable`,
      );
      expect(errorWarnings.warnings[1].level).eq(1);
      expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(12);

      expect(errorWarnings.warnings[2].message).contain(
        `Invalid value of a variable: sin(y)`,
      );
      expect(errorWarnings.warnings[2].level).eq(1);
      expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(11);
      expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(23);
      expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(11);
      expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(28);

      expect(errorWarnings.warnings[3].message).contain(
        `Can't define ODE RHS functions with duplicate dependent variable names`,
      );
      expect(errorWarnings.warnings[3].level).eq(1);
      expect(errorWarnings.warnings[3].doenetMLrange.lineBegin).eq(15);
      expect(errorWarnings.warnings[3].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.warnings[3].doenetMLrange.lineEnd).eq(18);
      expect(errorWarnings.warnings[3].doenetMLrange.charEnd).eq(12);
    });
  });
});
