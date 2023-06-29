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

describe("Piecewise Function Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("heaviside function", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
    <piecewisefunction name="f">
      <function domain="(0,Infinity)">1</function>
      <function>0</function>
    </piecewisefunction>
    <piecewisefunction name="f2">
      <function domain="(-Infinity,0]">0</function>
      <function>1</function>
    </piecewisefunction>
    <piecewisefunction name="g">
      <function domain="[0,Infinity)">1</function>
      <function>0</function>
    </piecewisefunction>
    <piecewisefunction name="g2">
      <function domain="(-Infinity,0)">0</function>
      <function>1</function>
    </piecewisefunction>
    <piecewisefunction name="h">
      <function domain="[0,0]">1/2</function>
      <function domain="(0,Infinity)">1</function>
      <function>0</function>
    </piecewisefunction>
    <piecewisefunction name="h2">
      <function domain="(0,Infinity)">1</function>
      <function domain="(-Infinity,0)">0</function>
      <function>1/2</function>
    </piecewisefunction>
    </graph>
    <me name="mef">f(x)=$f</me>
    <me name="mef2">f_2(x)=$f2</me>
    <me name="meg">g(x)=$g</me>
    <me name="meg2">g_2(x)=$g2</me>
    <me name="meh">h(x)=$h</me>
    <me name="meh2">h_2(x)=$h2</me>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/mef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "f(x)={1if\u00a0x>00otherwise");
    cy.get(cesc("#\\/mef2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "f2(x)={0if\u00a0x≤01otherwise");
    cy.get(cesc("#\\/meg") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "g(x)={1if\u00a0x≥00otherwise");
    cy.get(cesc("#\\/meg2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "g2(x)={0if\u00a0x<01otherwise");
    cy.get(cesc("#\\/meh") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "h(x)=⎧⎪⎨⎪⎩12if\u00a0x=01if\u00a0x>00otherwise");
    cy.get(cesc("#\\/meh2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "h2(x)=⎧⎪⎨⎪⎩1if\u00a0x>00if\u00a0x<012otherwise");

    let fs = ["f", "f2"];
    let gs = ["g", "g2"];
    let hs = ["h", "h2"];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      for (let fsym of fs) {
        let f = createFunctionFromDefinition(
          stateVariables["/" + fsym].stateValues.fDefinitions[0],
        );
        expect(f(-2)).closeTo(0, 1e-12);
        expect(f(-1)).closeTo(0, 1e-12);
        expect(f(-1e-6)).closeTo(0, 1e-12);
        expect(f(0)).closeTo(0, 1e-12);
        expect(f(1e-6)).closeTo(1, 1e-12);
        expect(f(1)).closeTo(1, 1e-12);
        expect(f(2)).closeTo(1, 1e-12);

        expect(stateVariables["/" + fsym].stateValues.globalMinimum[1]).eq(0);
        expect(stateVariables["/" + fsym].stateValues.globalInfimum[1]).eq(0);
        expect(stateVariables["/" + fsym].stateValues.globalMaximum[1]).eq(1);
        expect(stateVariables["/" + fsym].stateValues.globalSupremum[1]).eq(1);
      }

      for (let gsym of gs) {
        let g = createFunctionFromDefinition(
          stateVariables["/" + gsym].stateValues.fDefinitions[0],
        );
        expect(g(-2)).closeTo(0, 1e-12);
        expect(g(-1)).closeTo(0, 1e-12);
        expect(g(-1e-6)).closeTo(0, 1e-12);
        expect(g(0)).closeTo(1, 1e-12);
        expect(g(1e-6)).closeTo(1, 1e-12);
        expect(g(1)).closeTo(1, 1e-12);
        expect(g(2)).closeTo(1, 1e-12);

        expect(stateVariables["/" + gsym].stateValues.globalMinimum[1]).eq(0);
        expect(stateVariables["/" + gsym].stateValues.globalInfimum[1]).eq(0);
        expect(stateVariables["/" + gsym].stateValues.globalMaximum[1]).eq(1);
        expect(stateVariables["/" + gsym].stateValues.globalSupremum[1]).eq(1);
      }

      for (let hsym of hs) {
        let h = createFunctionFromDefinition(
          stateVariables["/" + hsym].stateValues.fDefinitions[0],
        );
        expect(h(-2)).closeTo(0, 1e-12);
        expect(h(-1)).closeTo(0, 1e-12);
        expect(h(-1e-6)).closeTo(0, 1e-12);
        expect(h(0)).closeTo(0.5, 1e-12);
        expect(h(1e-6)).closeTo(1, 1e-12);
        expect(h(1)).closeTo(1, 1e-12);
        expect(h(2)).closeTo(1, 1e-12);

        expect(stateVariables["/" + hsym].stateValues.globalMinimum[1]).eq(0);
        expect(stateVariables["/" + hsym].stateValues.globalInfimum[1]).eq(0);
        expect(stateVariables["/" + hsym].stateValues.globalMaximum[1]).eq(1);
        expect(stateVariables["/" + hsym].stateValues.globalSupremum[1]).eq(1);
      }
    });
  });

  it("heaviside function, ignore extra pieces", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
    <piecewisefunction name="f">
      <function domain="(0,Infinity)">1</function>
      <function>0</function>
      <function>x^2</function>
    </piecewisefunction>
    <piecewisefunction name="f2">
      <function domain="(-Infinity,0]">0</function>
      <function>1</function>
      <function domain="(-1,1)">x^2</function>
    </piecewisefunction>
    <piecewisefunction name="g">
      <function domain="[0,Infinity)">1</function>
      <function>0</function>
      <function domain="(-1,1]">x^2</function>
    </piecewisefunction>
    <piecewisefunction name="g2">
      <function domain="(-Infinity,0)">0</function>
      <function>1</function>
      <function domain="[-1,1)">x^2</function>
    </piecewisefunction>
    <piecewisefunction name="h">
      <function domain="[0,0]">1/2</function>
      <function domain="(0,Infinity)">1</function>
      <function>0</function>
      <function domain="(-3,-1]">x^2</function>
      <function domain="(1,3)">x^3</function>
    </piecewisefunction>
    <piecewisefunction name="h2">
      <function domain="(0,Infinity)">1</function>
      <function domain="(-Infinity,0)">0</function>
      <function>1/2</function>
      <function domain="[-3,-1)">x^2</function>
      <function domain="[1,3]">x^3</function>
    </piecewisefunction>
    </graph>
    <me name="mef">f(x)=$f</me>
    <me name="mef2">f_2(x)=$f2</me>
    <me name="meg">g(x)=$g</me>
    <me name="meg2">g_2(x)=$g2</me>
    <me name="meh">h(x)=$h</me>
    <me name="meh2">h_2(x)=$h2</me>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/mef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "f(x)={1if\u00a0x>00otherwise");
    cy.get(cesc("#\\/mef2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "f2(x)={0if\u00a0x≤01otherwise");
    cy.get(cesc("#\\/meg") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "g(x)={1if\u00a0x≥00otherwise");
    cy.get(cesc("#\\/meg2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "g2(x)={0if\u00a0x<01otherwise");
    cy.get(cesc("#\\/meh") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "h(x)=⎧⎪⎨⎪⎩12if\u00a0x=01if\u00a0x>00otherwise");
    cy.get(cesc("#\\/meh2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "h2(x)=⎧⎪⎨⎪⎩1if\u00a0x>00if\u00a0x<012otherwise");

    let fs = ["f", "f2"];
    let gs = ["g", "g2"];
    let hs = ["h", "h2"];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      for (let fsym of fs) {
        let f = createFunctionFromDefinition(
          stateVariables["/" + fsym].stateValues.fDefinitions[0],
        );
        expect(f(-2)).closeTo(0, 1e-12);
        expect(f(-1)).closeTo(0, 1e-12);
        expect(f(-1e-6)).closeTo(0, 1e-12);
        expect(f(0)).closeTo(0, 1e-12);
        expect(f(1e-6)).closeTo(1, 1e-12);
        expect(f(1)).closeTo(1, 1e-12);
        expect(f(2)).closeTo(1, 1e-12);

        expect(stateVariables["/" + fsym].stateValues.globalMinimum[1]).eq(0);
        expect(stateVariables["/" + fsym].stateValues.globalInfimum[1]).eq(0);
        expect(stateVariables["/" + fsym].stateValues.globalMaximum[1]).eq(1);
        expect(stateVariables["/" + fsym].stateValues.globalSupremum[1]).eq(1);
      }

      for (let gsym of gs) {
        let g = createFunctionFromDefinition(
          stateVariables["/" + gsym].stateValues.fDefinitions[0],
        );
        expect(g(-2)).closeTo(0, 1e-12);
        expect(g(-1)).closeTo(0, 1e-12);
        expect(g(-1e-6)).closeTo(0, 1e-12);
        expect(g(0)).closeTo(1, 1e-12);
        expect(g(1e-6)).closeTo(1, 1e-12);
        expect(g(1)).closeTo(1, 1e-12);
        expect(g(2)).closeTo(1, 1e-12);

        expect(stateVariables["/" + gsym].stateValues.globalMinimum[1]).eq(0);
        expect(stateVariables["/" + gsym].stateValues.globalInfimum[1]).eq(0);
        expect(stateVariables["/" + gsym].stateValues.globalMaximum[1]).eq(1);
        expect(stateVariables["/" + gsym].stateValues.globalSupremum[1]).eq(1);
      }

      for (let hsym of hs) {
        let h = createFunctionFromDefinition(
          stateVariables["/" + hsym].stateValues.fDefinitions[0],
        );
        expect(h(-2)).closeTo(0, 1e-12);
        expect(h(-1)).closeTo(0, 1e-12);
        expect(h(-1e-6)).closeTo(0, 1e-12);
        expect(h(0)).closeTo(0.5, 1e-12);
        expect(h(1e-6)).closeTo(1, 1e-12);
        expect(h(1)).closeTo(1, 1e-12);
        expect(h(2)).closeTo(1, 1e-12);

        expect(stateVariables["/" + hsym].stateValues.globalMinimum[1]).eq(0);
        expect(stateVariables["/" + hsym].stateValues.globalInfimum[1]).eq(0);
        expect(stateVariables["/" + hsym].stateValues.globalMaximum[1]).eq(1);
        expect(stateVariables["/" + hsym].stateValues.globalSupremum[1]).eq(1);
      }
    });
  });

  it("different variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
    <piecewisefunction name="f" variables="t">
      <function domain="(0,Infinity)">x</function>
      <function domain="(-Infinity, 0]" variables="y">2-y</function>
    </piecewisefunction>
    <piecewisefunction name="g">
      <function domain="(0,Infinity)" variables="q">q</function>
      <function domain="(-Infinity, 0)" variables="y">2-y</function>
    </piecewisefunction>
    <piecewisefunction name="h" variables="s">
      <function domain="[0,10)" variables="q">q</function>
      <function domain="[-10, 0)" variables="y">2-y</function>
    </piecewisefunction>
    <piecewisefunction name="k" domain="(-10,10]" variables="u">
      <function domain="(0,Infinity)" variables="q">q</function>
      <function domain="(-Infinity, 0)" variables="y">2-y</function>
    </piecewisefunction>
    </graph>
    <me name="mef">f(t)=$f</me>
    <me name="meg">g(q)=$g</me>
    <me name="meh">h(s)=$h</me>
    <me name="mek">k(u)=$k</me>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/mef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "f(t)={tif\u00a0t>02−tif\u00a0t≤0");
    cy.get(cesc("#\\/meg") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "g(q)={qif\u00a0q>02−qif\u00a0q<0");
    cy.get(cesc("#\\/meh") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "h(s)={sif\u00a00≤s<102−sif\u00a0−10≤s<0");
    cy.get(cesc("#\\/mek") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "k(u)={uif\u00a0u>02−uif\u00a0u<0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      expect(f(-2)).closeTo(4, 1e-12);
      expect(f(-1)).closeTo(3, 1e-12);
      expect(f(-1e-6)).closeTo(2.000001, 1e-12);
      expect(f(0)).closeTo(2, 1e-12);
      expect(f(1e-6)).closeTo(1e-6, 1e-12);
      expect(f(1)).closeTo(1, 1e-12);
      expect(f(2)).closeTo(2, 1e-12);

      expect(stateVariables["/f"].stateValues.globalMinimum).eqls([]);
      expect(stateVariables["/f"].stateValues.globalInfimum).eqls([0, 0]);
      expect(stateVariables["/f"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/f"].stateValues.globalSupremum).eqls([-200, 202]);

      let g = createFunctionFromDefinition(
        stateVariables["/g"].stateValues.fDefinitions[0],
      );
      expect(g(-2)).closeTo(4, 1e-12);
      expect(g(-1)).closeTo(3, 1e-12);
      expect(g(-1e-6)).closeTo(2.000001, 1e-12);
      expect(g(0)).eqls(NaN);
      expect(g(1e-6)).closeTo(1e-6, 1e-12);
      expect(g(1)).closeTo(1, 1e-12);
      expect(g(2)).closeTo(2, 1e-12);

      expect(stateVariables["/g"].stateValues.globalMinimum).eqls([]);
      expect(stateVariables["/g"].stateValues.globalInfimum).eqls([0, 0]);
      expect(stateVariables["/g"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/g"].stateValues.globalSupremum).eqls([-200, 202]);

      let h = createFunctionFromDefinition(
        stateVariables["/h"].stateValues.fDefinitions[0],
      );
      expect(h(-10.000001)).eqls(NaN);
      expect(h(-10)).closeTo(12, 1e-12);
      expect(h(-2)).closeTo(4, 1e-12);
      expect(h(-1)).closeTo(3, 1e-12);
      expect(h(-1e-6)).closeTo(2.000001, 1e-12);
      expect(h(0)).closeTo(0, 1e-12);
      expect(h(1e-6)).closeTo(1e-6, 1e-12);
      expect(h(1)).closeTo(1, 1e-12);
      expect(h(2)).closeTo(2, 1e-12);
      expect(h(9.99999)).closeTo(9.99999, 1e-12);
      expect(h(10)).eqls(NaN);

      expect(stateVariables["/h"].stateValues.globalMinimum).eqls([0, 0]);
      expect(stateVariables["/h"].stateValues.globalInfimum).eqls([0, 0]);
      expect(stateVariables["/h"].stateValues.globalMaximum).eqls([-10, 12]);
      expect(stateVariables["/h"].stateValues.globalSupremum).eqls([-10, 12]);

      let k = createFunctionFromDefinition(
        stateVariables["/k"].stateValues.fDefinitions[0],
      );
      expect(k(-10)).eqls(NaN);
      expect(k(-9.99999)).closeTo(11.99999, 1e-12);
      expect(k(-2)).closeTo(4, 1e-12);
      expect(k(-1)).closeTo(3, 1e-12);
      expect(k(-1e-6)).closeTo(2.000001, 1e-12);
      expect(k(0)).eqls(NaN);
      expect(k(1e-6)).closeTo(1e-6, 1e-12);
      expect(k(1)).closeTo(1, 1e-12);
      expect(k(2)).closeTo(2, 1e-12);
      expect(k(10)).closeTo(10, 1e-12);
      expect(k(10.0000001)).eqls(NaN);

      expect(stateVariables["/k"].stateValues.globalMinimum).eqls([]);
      expect(stateVariables["/k"].stateValues.globalInfimum).eqls([0, 0]);
      expect(stateVariables["/k"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/k"].stateValues.globalSupremum).eqls([-10, 12]);
    });
  });

  it("extrema", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph size="small">
      <piecewisefunction name="f">
        <function domain="(0,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewisefunction>
      <piecewisefunction name="f2">
        <function domain="[0,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewisefunction>
    </graph>
    <me name="mef">f(x)=$f</me>
    <me name="mef2">f_2(x)=$f2</me>
    <p name="pfmin">Minima of f: $f.minima</p>
    <p name="pfmax">Maxima of f: $f.maxima</p>
    <p name="pf2min">Minima of f_2: $f2.minima</p>
    <p name="pf2max">Maxima of f_2: $f2.maxima</p>

    <graph size="small">
      <piecewisefunction name="g">
        <function domain="(0.1,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewisefunction>
      <piecewisefunction name="g2">
        <function domain="[0.1,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewisefunction>
    </graph>
    <me name="meg">g(x)=$g</me>
    <me name="meg2">g_2(x)=$g2</me>
    <p name="pgmin">Minima of g: $g.minima</p>
    <p name="pgmax">Maxima of g: $g.maxima</p>
    <p name="pg2min">Minima of g_2: $g2.minima</p>
    <p name="pg2max">Maxima of g_2: $g2.maxima</p>

    <graph size="small">
      <piecewisefunction name="h" displaySmallAsZero>
        <function domain="(-0.1,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewisefunction>
      <piecewisefunction name="h2" displaySmallAsZero>
        <function domain="[-0.1,Infinity)">x^2</function>
        <function>-x^2</function>
      </piecewisefunction>
    </graph>
    <me name="meh">h(x)=$h</me>
    <me name="meh2">h_2(x)=$h2</me>
    <p name="phmin">Minima of h: $h.minima</p>
    <p name="phmax">Maxima of h: $h.maxima</p>
    <p name="ph2min">Minima of h_2: $h2.minima</p>
    <p name="ph2max">Maxima of h_2: $h2.maxima</p>

    <graph size="small">
      <piecewisefunction name="k" displaySmallAsZero="10^(-13)" displayDigits="5">
        <function domain="(1,Infinity)">(x-2)^2</function>
        <function domain="(-Infinity, -1)">(x+2)^2</function>
        <function>cos(pi*x/2)</function>
      </piecewisefunction>
      <piecewisefunction name="k2" displaySmallAsZero="10^(-13)" displayDigits="5">
        <function domain="[1,Infinity)">(x-2)^2</function>
        <function domain="(-Infinity, -1]">(x+2)^2</function>
        <function>cos(pi*x/2)</function>
      </piecewisefunction>
    </graph>
    <me name="mek">k(x)=$k</me>
    <me name="mek2">k_2(x)=$k2</me>
    <p name="pkmin">Minima of k: $k.minima</p>
    <p name="pkmax">Maxima of k: $k.maxima</p>
    <p name="pk2min">Minima of k_2: $k2.minima</p>
    <p name="pk2max">Maxima of k_2: $k2.maxima</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/mef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "f(x)={x2if\u00a0x>0−x2otherwise");
    cy.get(cesc("#\\/mef2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "f2(x)={x2if\u00a0x≥0−x2otherwise");
    cy.get(cesc("#\\/pfmin") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/pfmax") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/pf2min") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/pf2max") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/f"].stateValues.minima).eqls([]);
      expect(stateVariables["/f"].stateValues.maxima).eqls([]);
      expect(stateVariables["/f2"].stateValues.minima).eqls([]);
      expect(stateVariables["/f2"].stateValues.maxima).eqls([]);
      expect(stateVariables["/f"].stateValues.globalMinimum).eqls([]);
      expect(stateVariables["/f"].stateValues.globalInfimum).eqls([
        -200,
        -(200 ** 2),
      ]);
      expect(stateVariables["/f"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/f"].stateValues.globalSupremum).eqls([
        200,
        200 ** 2,
      ]);
      expect(stateVariables["/f2"].stateValues.globalMinimum).eqls([]);
      expect(stateVariables["/f2"].stateValues.globalInfimum).eqls([
        -200,
        -(200 ** 2),
      ]);
      expect(stateVariables["/f2"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/f2"].stateValues.globalSupremum).eqls([
        200,
        200 ** 2,
      ]);
    });

    cy.get(cesc("#\\/meg") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "g(x)={x2if\u00a0x>0.1−x2otherwise");
    cy.get(cesc("#\\/meg2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "g2(x)={x2if\u00a0x≥0.1−x2otherwise");
    cy.get(cesc("#\\/pgmin") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0.1,−0.01)");
    cy.get(cesc("#\\/pgmin") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc("#\\/pgmax") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/pgmax") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc("#\\/pg2min") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/pg2max") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/pg2max") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g"].stateValues.minima.length).eq(1);
      expect(stateVariables["/g"].stateValues.minima[0][0]).closeTo(0.1, 1e-14);
      expect(stateVariables["/g"].stateValues.minima[0][1]).closeTo(
        -0.01,
        1e-14,
      );
      expect(stateVariables["/g"].stateValues.maxima.length).eq(1);
      expect(stateVariables["/g"].stateValues.maxima[0][0]).closeTo(0, 1e-14);
      expect(stateVariables["/g"].stateValues.maxima[0][1]).closeTo(0, 1e-14);
      expect(stateVariables["/g2"].stateValues.minima).eqls([]);
      expect(stateVariables["/g2"].stateValues.maxima.length).eq(1);
      expect(stateVariables["/g2"].stateValues.maxima[0][0]).closeTo(0, 1e-14);
      expect(stateVariables["/g2"].stateValues.maxima[0][1]).closeTo(0, 1e-14);
      expect(stateVariables["/g"].stateValues.globalMinimum).eqls([]);
      expect(stateVariables["/g"].stateValues.globalInfimum).eqls([
        -199.9,
        -(199.9 ** 2),
      ]);
      expect(stateVariables["/g"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/g"].stateValues.globalSupremum).eqls([
        200.1,
        200.1 ** 2,
      ]);
      expect(stateVariables["/g2"].stateValues.globalMinimum).eqls([]);
      expect(stateVariables["/g2"].stateValues.globalInfimum).eqls([
        -199.9,
        -(199.9 ** 2),
      ]);
      expect(stateVariables["/g2"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/g2"].stateValues.globalSupremum).eqls([
        200.1,
        200.1 ** 2,
      ]);
    });

    cy.get(cesc("#\\/meh") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "h(x)={x2if\u00a0x>−0.1−x2otherwise");
    cy.get(cesc("#\\/meh2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "h2(x)={x2if\u00a0x≥−0.1−x2otherwise");
    cy.get(cesc("#\\/phmin") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/phmin") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc("#\\/phmax") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/ph2min") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/ph2min") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc("#\\/ph2max") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−0.1,0.01)");
    cy.get(cesc("#\\/ph2max") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/h"].stateValues.minima.length).eq(1);
      expect(stateVariables["/h"].stateValues.minima[0][0]).closeTo(0, 1e-14);
      expect(stateVariables["/h"].stateValues.minima[0][1]).closeTo(0, 1e-14);
      expect(stateVariables["/h"].stateValues.maxima).eqls([]);
      expect(stateVariables["/h2"].stateValues.minima.length).eq(1);
      expect(stateVariables["/h2"].stateValues.minima[0][0]).closeTo(0, 1e-14);
      expect(stateVariables["/h2"].stateValues.minima[0][1]).closeTo(0, 1e-14);
      expect(stateVariables["/h2"].stateValues.maxima.length).eq(1);
      expect(stateVariables["/h2"].stateValues.maxima[0][0]).closeTo(
        -0.1,
        1e-14,
      );
      expect(stateVariables["/h2"].stateValues.maxima[0][1]).closeTo(
        0.01,
        1e-14,
      );
      expect(stateVariables["/h"].stateValues.globalMinimum).eqls([]);
      expect(stateVariables["/h"].stateValues.globalInfimum).eqls([
        -200.1,
        -(200.1 ** 2),
      ]);
      expect(stateVariables["/h"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/h"].stateValues.globalSupremum).eqls([
        199.9,
        199.9 ** 2,
      ]);
      expect(stateVariables["/h2"].stateValues.globalMinimum).eqls([]);
      expect(stateVariables["/h2"].stateValues.globalInfimum).eqls([
        -200.1,
        -(200.1 ** 2),
      ]);
      expect(stateVariables["/h2"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/h2"].stateValues.globalSupremum).eqls([
        199.9,
        199.9 ** 2,
      ]);
    });

    cy.get(cesc("#\\/mek") + " .mjx-mrow")
      .eq(0)
      .should(
        "have.text",
        "k(x)=⎧⎪\n⎪⎨⎪\n⎪⎩(x−2)2if\u00a0x>1(x+2)2if\u00a0x<−1cos(πx2)otherwise",
      );
    cy.get(cesc("#\\/mek2") + " .mjx-mrow")
      .eq(0)
      .should(
        "have.text",
        "k2(x)=⎧⎪\n⎪⎨⎪\n⎪⎩(x−2)2if\u00a0x≥1(x+2)2if\u00a0x≤−1cos(πx2)otherwise",
      );
    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,0)");
    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(−1,0)");
    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(1,0)");
    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "(2,0)");
    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(8)
      .should("not.exist");
    cy.get(cesc("#\\/pkmax") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
    cy.get(cesc("#\\/pkmax") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc("#\\/pk2min") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,0)");
    cy.get(cesc("#\\/pk2min") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(2,0)");
    cy.get(cesc("#\\/pk2min") + " .mjx-mrow")
      .eq(4)
      .should("not.exist");
    cy.get(cesc("#\\/pk2max") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−1,1)");
    cy.get(cesc("#\\/pk2max") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(0,1)");
    cy.get(cesc("#\\/pk2max") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(1,1)");
    cy.get(cesc("#\\/pk2max") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/k"].stateValues.minima.length).eq(4);
      expect(stateVariables["/k"].stateValues.minima[0][0]).closeTo(-2, 1e-14);
      expect(stateVariables["/k"].stateValues.minima[0][1]).closeTo(0, 1e-14);
      expect(stateVariables["/k"].stateValues.minima[1][0]).closeTo(-1, 1e-14);
      expect(stateVariables["/k"].stateValues.minima[1][1]).closeTo(0, 1e-14);
      expect(stateVariables["/k"].stateValues.minima[2][0]).closeTo(1, 1e-14);
      expect(stateVariables["/k"].stateValues.minima[2][1]).closeTo(0, 1e-14);
      expect(stateVariables["/k"].stateValues.minima[3][0]).closeTo(2, 1e-14);
      expect(stateVariables["/k"].stateValues.minima[3][1]).closeTo(0, 1e-14);

      expect(stateVariables["/k"].stateValues.maxima.length).eq(1);
      expect(stateVariables["/k"].stateValues.maxima[0][0]).closeTo(0, 1e-14);
      expect(stateVariables["/k"].stateValues.maxima[0][1]).closeTo(1, 1e-14);

      expect(stateVariables["/k2"].stateValues.minima.length).eq(2);
      expect(stateVariables["/k2"].stateValues.minima[0][0]).closeTo(-2, 1e-14);
      expect(stateVariables["/k2"].stateValues.minima[0][1]).closeTo(0, 1e-14);
      expect(stateVariables["/k2"].stateValues.minima[1][0]).closeTo(2, 1e-14);
      expect(stateVariables["/k2"].stateValues.minima[1][1]).closeTo(0, 1e-14);

      expect(stateVariables["/k2"].stateValues.maxima.length).eq(3);
      expect(stateVariables["/k2"].stateValues.maxima[0][0]).closeTo(-1, 1e-14);
      expect(stateVariables["/k2"].stateValues.maxima[0][1]).closeTo(1, 1e-14);
      expect(stateVariables["/k2"].stateValues.maxima[1][0]).closeTo(0, 1e-14);
      expect(stateVariables["/k2"].stateValues.maxima[1][1]).closeTo(1, 1e-14);
      expect(stateVariables["/k2"].stateValues.maxima[2][0]).closeTo(1, 1e-14);
      expect(stateVariables["/k2"].stateValues.maxima[2][1]).closeTo(1, 1e-14);

      expect(stateVariables["/k"].stateValues.globalMinimum).eqls([2, 0]);
      expect(stateVariables["/k"].stateValues.globalInfimum).eqls([2, 0]);
      expect(stateVariables["/k"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/k"].stateValues.globalSupremum).eqls([
        201,
        199 ** 2,
      ]);
      expect(stateVariables["/k2"].stateValues.globalMinimum).eqls([2, 0]);
      expect(stateVariables["/k2"].stateValues.globalInfimum).eqls([2, 0]);
      expect(stateVariables["/k2"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/k2"].stateValues.globalSupremum).eqls([
        201,
        199 ** 2,
      ]);
    });
  });

  it("extrema 2, overlap in domains", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph size="small">
      <piecewisefunction name="f">
        <function domain="(-1,1)">x^2</function>
        <function domain="(0,Infinity)">(x-1)^2+1</function>
        <function>(x+1)^2+1</function>
      </piecewisefunction>
      <piecewisefunction name="f2">
      <function domain="[-1,1]">x^2</function>
      <function domain="(0,Infinity)">(x-1)^2+1</function>
      <function>(x+1)^2+1</function>
      </piecewisefunction>
    </graph>
    <me name="mef">f(x)=$f</me>
    <me name="mef2">f_2(x)=$f2</me>
    <p name="pfmin">Minima of f: $f.minima</p>
    <p name="pfmax">Maxima of f: $f.maxima</p>
    <p name="pf2min">Minima of f_2: $f2.minima</p>
    <p name="pf2max">Maxima of f_2: $f2.maxima</p>

    <graph size="small">
      <piecewisefunction name="g">
      <function domain="(-1,1)">x^2</function>
      <function domain="(0,Infinity)">(x-2)^2+1</function>
      <function>(x+2)^2+1</function>
      </piecewisefunction>
      <piecewisefunction name="g2">
      <function domain="[-1,1]">x^2</function>
      <function domain="(0,Infinity)">(x-2)^2+1</function>
      <function>(x+2)^2+1</function>
      </piecewisefunction>
    </graph>
    <me name="meg">g(x)=$g</me>
    <me name="meg2">g_2(x)=$g2</me>
    <p name="pgmin">Minima of g: $g.minima</p>
    <p name="pgmax">Maxima of g: $g.maxima</p>
    <p name="pg2min">Minima of g_2: $g2.minima</p>
    <p name="pg2max">Maxima of g_2: $g2.maxima</p>



    <graph size="small">
      <piecewiseFunction name="h" >
        <function domain="(-1,1)">x^2</function>
        <function domain="(-3,3)">x^4/4-2x^2</function>
        <function>abs(x)</function>
      </piecewiseFunction>
      <piecewiseFunction name="h2" >
        <function domain="[-1,1]">x^2</function>
        <function domain="[-3,3]">x^4/4-2x^2</function>
        <function>abs(x)</function>
      </piecewiseFunction>
    </graph>
    <me name="meh">h(x)=$h</me>
    <me name="meh2">h_2(x)=$h2</me>
    <p name="phmin">Minima of h: $h.minima</p>
    <p name="phmax">Maxima of h: $h.maxima</p>
    <p name="ph2min">Minima of h_2: $h2.minima</p>
    <p name="ph2max">Maxima of h_2: $h2.maxima</p>

    <graph size="small">
      <piecewiseFunction name="k" >
        <function domain="(-1,1)">x^2</function>
        <function domain="(-3,3)">x^4/4-2x^2+4</function>
        <function>abs(x)</function>
      </piecewiseFunction>
      <piecewiseFunction name="k2" >
        <function domain="[-1,1]">x^2</function>
        <function domain="[-3,3]">x^4/4-2x^2+4</function>
        <function>abs(x)</function>
      </piecewiseFunction>
    </graph>
    <me name="mek">k(x)=$k</me>
    <me name="mek2">k_2(x)=$k2</me>
    <p name="pkmin">Minima of k: $k.minima</p>
    <p name="pkmax">Maxima of k: $k.maxima</p>
    <p name="pk2min">Minima of k_2: $k2.minima</p>
    <p name="pk2max">Maxima of k_2: $k2.maxima</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/pfmin") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/pfmin") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc("#\\/pfmax") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/pf2min") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/pf2min") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc("#\\/pf2max") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/f"].stateValues.minima).eqls([[0, 0]]);
      expect(stateVariables["/f"].stateValues.maxima).eqls([]);
      expect(stateVariables["/f2"].stateValues.minima).eqls([[0, 0]]);
      expect(stateVariables["/f2"].stateValues.maxima).eqls([]);

      expect(stateVariables["/f"].stateValues.globalMinimum).eqls([0, 0]);
      expect(stateVariables["/f"].stateValues.globalInfimum).eqls([0, 0]);
      expect(stateVariables["/f"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/f"].stateValues.globalSupremum).eqls([
        201,
        200 ** 2 + 1,
      ]);
      expect(stateVariables["/f2"].stateValues.globalMinimum).eqls([0, 0]);
      expect(stateVariables["/f2"].stateValues.globalInfimum).eqls([0, 0]);
      expect(stateVariables["/f2"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/f2"].stateValues.globalSupremum).eqls([
        201,
        200 ** 2 + 1,
      ]);
    });

    cy.get(cesc("#\\/pgmin") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,1)");
    cy.get(cesc("#\\/pgmin") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/pgmin") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(2,1)");
    cy.get(cesc("#\\/pgmin") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");
    cy.get(cesc("#\\/pgmax") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−1,2)");
    cy.get(cesc("#\\/pgmax") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(1,2)");
    cy.get(cesc("#\\/pgmax") + " .mjx-mrow")
      .eq(4)
      .should("not.exist");
    cy.get(cesc("#\\/pg2min") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,1)");
    cy.get(cesc("#\\/pg2min") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/pg2min") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(2,1)");
    cy.get(cesc("#\\/pg2min") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");
    cy.get(cesc("#\\/pg2max") + " .mjx-mrow").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g"].stateValues.minima.length).eq(3);
      expect(stateVariables["/g"].stateValues.minima[0][0]).closeTo(-2, 1e-14);
      expect(stateVariables["/g"].stateValues.minima[0][1]).closeTo(1, 1e-14);
      expect(stateVariables["/g"].stateValues.minima[1][0]).closeTo(0, 1e-14);
      expect(stateVariables["/g"].stateValues.minima[1][1]).closeTo(0, 1e-14);
      expect(stateVariables["/g"].stateValues.minima[2][0]).closeTo(2, 1e-14);
      expect(stateVariables["/g"].stateValues.minima[2][1]).closeTo(1, 1e-14);
      expect(stateVariables["/g"].stateValues.maxima.length).eq(2);
      expect(stateVariables["/g"].stateValues.maxima[0][0]).closeTo(-1, 1e-14);
      expect(stateVariables["/g"].stateValues.maxima[0][1]).closeTo(2, 1e-14);
      expect(stateVariables["/g"].stateValues.maxima[1][0]).closeTo(1, 1e-14);
      expect(stateVariables["/g"].stateValues.maxima[1][1]).closeTo(2, 1e-14);
      expect(stateVariables["/g2"].stateValues.minima.length).eq(3);
      expect(stateVariables["/g2"].stateValues.minima[0][0]).closeTo(-2, 1e-14);
      expect(stateVariables["/g2"].stateValues.minima[0][1]).closeTo(1, 1e-14);
      expect(stateVariables["/g2"].stateValues.minima[1][0]).closeTo(0, 1e-14);
      expect(stateVariables["/g2"].stateValues.minima[1][1]).closeTo(0, 1e-14);
      expect(stateVariables["/g2"].stateValues.minima[2][0]).closeTo(2, 1e-14);
      expect(stateVariables["/g2"].stateValues.minima[2][1]).closeTo(1, 1e-14);
      expect(stateVariables["/g2"].stateValues.maxima).eqls([]);

      expect(stateVariables["/g"].stateValues.globalMinimum).eqls([0, 0]);
      expect(stateVariables["/g"].stateValues.globalInfimum).eqls([0, 0]);
      expect(stateVariables["/g"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/g"].stateValues.globalSupremum).eqls([
        201,
        199 ** 2 + 1,
      ]);
      expect(stateVariables["/g2"].stateValues.globalMinimum).eqls([0, 0]);
      expect(stateVariables["/g2"].stateValues.globalInfimum).eqls([0, 0]);
      expect(stateVariables["/g2"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/g2"].stateValues.globalSupremum).eqls([
        201,
        199 ** 2 + 1,
      ]);
    });

    cy.get(cesc("#\\/phmin") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,−4)");
    cy.get(cesc("#\\/phmin") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/phmin") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(2,−4)");
    cy.get(cesc("#\\/phmin") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");
    cy.get(cesc("#\\/phmax") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/ph2min") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,−4)");
    cy.get(cesc("#\\/ph2min") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/ph2min") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(2,−4)");
    cy.get(cesc("#\\/ph2min") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");
    cy.get(cesc("#\\/ph2max") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−1,1)");
    cy.get(cesc("#\\/ph2max") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(1,1)");
    cy.get(cesc("#\\/ph2max") + " .mjx-mrow")
      .eq(4)
      .should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/h"].stateValues.minima.length).eq(3);
      expect(stateVariables["/h"].stateValues.minima[0][0]).closeTo(-2, 1e-8);
      expect(stateVariables["/h"].stateValues.minima[0][1]).closeTo(-4, 1e-8);
      expect(stateVariables["/h"].stateValues.minima[1][0]).closeTo(0, 1e-8);
      expect(stateVariables["/h"].stateValues.minima[1][1]).closeTo(0, 1e-8);
      expect(stateVariables["/h"].stateValues.minima[2][0]).closeTo(2, 1e-8);
      expect(stateVariables["/h"].stateValues.minima[2][1]).closeTo(-4, 1e-8);
      expect(stateVariables["/h"].stateValues.maxima).eqls([]);
      expect(stateVariables["/h2"].stateValues.minima.length).eq(3);
      expect(stateVariables["/h2"].stateValues.minima[0][0]).closeTo(-2, 1e-8);
      expect(stateVariables["/h2"].stateValues.minima[0][1]).closeTo(-4, 1e-8);
      expect(stateVariables["/h2"].stateValues.minima[1][0]).closeTo(0, 1e-8);
      expect(stateVariables["/h2"].stateValues.minima[1][1]).closeTo(0, 1e-8);
      expect(stateVariables["/h2"].stateValues.minima[2][0]).closeTo(2, 1e-8);
      expect(stateVariables["/h2"].stateValues.minima[2][1]).closeTo(-4, 1e-8);
      expect(stateVariables["/h2"].stateValues.maxima.length).eq(2);
      expect(stateVariables["/h2"].stateValues.maxima[0][0]).closeTo(-1, 1e-8);
      expect(stateVariables["/h2"].stateValues.maxima[0][1]).closeTo(1, 1e-8);
      expect(stateVariables["/h2"].stateValues.maxima[1][0]).closeTo(1, 1e-8);
      expect(stateVariables["/h2"].stateValues.maxima[1][1]).closeTo(1, 1e-8);

      expect(stateVariables["/h"].stateValues.globalMinimum).eqls([-2, -4]);
      expect(stateVariables["/h"].stateValues.globalInfimum).eqls([-2, -4]);
      expect(stateVariables["/h"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/h"].stateValues.globalSupremum).eqls([-203, 203]);
      expect(stateVariables["/h2"].stateValues.globalMinimum).eqls([-2, -4]);
      expect(stateVariables["/h2"].stateValues.globalInfimum).eqls([-2, -4]);
      expect(stateVariables["/h2"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/h2"].stateValues.globalSupremum).eqls([
        -203, 203,
      ]);
    });

    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,3)");
    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(−2,0)");
    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "(2,0)");
    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(8)
      .should("have.text", "(3,3)");
    cy.get(cesc("#\\/pkmin") + " .mjx-mrow")
      .eq(10)
      .should("not.exist");
    cy.get(cesc("#\\/pkmax") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−1,2.25)");
    cy.get(cesc("#\\/pkmax") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(1,2.25)");
    cy.get(cesc("#\\/pkmax") + " .mjx-mrow")
      .eq(4)
      .should("not.exist");
    cy.get(cesc("#\\/pk2min") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,0)");
    cy.get(cesc("#\\/pk2min") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/pk2min") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(2,0)");
    cy.get(cesc("#\\/pk2min") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");
    cy.get(cesc("#\\/pk2max") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,6.25)");
    cy.get(cesc("#\\/pk2max") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(3,6.25)");
    cy.get(cesc("#\\/pk2max") + " .mjx-mrow")
      .eq(4)
      .should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/k"].stateValues.minima.length).eq(5);
      expect(stateVariables["/k"].stateValues.minima[0][0]).closeTo(-3, 1e-8);
      expect(stateVariables["/k"].stateValues.minima[0][1]).closeTo(3, 1e-8);
      expect(stateVariables["/k"].stateValues.minima[1][0]).closeTo(-2, 1e-8);
      expect(stateVariables["/k"].stateValues.minima[1][1]).closeTo(0, 1e-8);
      expect(stateVariables["/k"].stateValues.minima[2][0]).closeTo(0, 1e-8);
      expect(stateVariables["/k"].stateValues.minima[2][1]).closeTo(0, 1e-8);
      expect(stateVariables["/k"].stateValues.minima[3][0]).closeTo(2, 1e-8);
      expect(stateVariables["/k"].stateValues.minima[3][1]).closeTo(0, 1e-8);
      expect(stateVariables["/k"].stateValues.minima[4][0]).closeTo(3, 1e-8);
      expect(stateVariables["/k"].stateValues.minima[4][1]).closeTo(3, 1e-8);
      expect(stateVariables["/k"].stateValues.maxima.length).eq(2);
      expect(stateVariables["/k"].stateValues.maxima[0][0]).closeTo(-1, 1e-8);
      expect(stateVariables["/k"].stateValues.maxima[0][1]).closeTo(2.25, 1e-8);
      expect(stateVariables["/k"].stateValues.maxima[1][0]).closeTo(1, 1e-8);
      expect(stateVariables["/k"].stateValues.maxima[1][1]).closeTo(2.25, 1e-8);
      expect(stateVariables["/k2"].stateValues.minima.length).eq(3);
      expect(stateVariables["/k2"].stateValues.minima[0][0]).closeTo(-2, 1e-8);
      expect(stateVariables["/k2"].stateValues.minima[0][1]).closeTo(0, 1e-8);
      expect(stateVariables["/k2"].stateValues.minima[1][0]).closeTo(0, 1e-8);
      expect(stateVariables["/k2"].stateValues.minima[1][1]).closeTo(0, 1e-8);
      expect(stateVariables["/k2"].stateValues.minima[2][0]).closeTo(2, 1e-8);
      expect(stateVariables["/k2"].stateValues.minima[2][1]).closeTo(0, 1e-8);
      expect(stateVariables["/k2"].stateValues.maxima.length).eq(2);
      expect(stateVariables["/k2"].stateValues.maxima[0][0]).closeTo(-3, 1e-8);
      expect(stateVariables["/k2"].stateValues.maxima[0][1]).closeTo(
        6.25,
        1e-8,
      );
      expect(stateVariables["/k2"].stateValues.maxima[1][0]).closeTo(3, 1e-8);
      expect(stateVariables["/k2"].stateValues.maxima[1][1]).closeTo(
        6.25,
        1e-8,
      );

      expect(stateVariables["/k"].stateValues.globalMinimum).eqls([0, 0]);
      expect(stateVariables["/k"].stateValues.globalInfimum).eqls([0, 0]);
      expect(stateVariables["/k"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/k"].stateValues.globalSupremum).eqls([-203, 203]);
      expect(stateVariables["/k2"].stateValues.globalMinimum).eqls([0, 0]);
      expect(stateVariables["/k2"].stateValues.globalInfimum).eqls([0, 0]);
      expect(stateVariables["/k2"].stateValues.globalMaximum).eqls([]);
      expect(stateVariables["/k2"].stateValues.globalSupremum).eqls([
        -203, 203,
      ]);
    });
  });

  it("ignore function pieces with non-numerical domain when evaluating numerically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
    <piecewisefunction name="f" symbolic="false">
      <function domain="[a,a]">1</function>
      <function domain="(s,t)">x</function>
      <function domain="[1,q)">x^2/10</function>
      <function domain="(z,5)">x^3/100</function>
      <function domain="[8,10]">x^4/1000</function>
      <function domain="(20,-10)">x^5/10000</function>
    </piecewisefunction>
    </graph>
    <me name="mef">f(x)=$f</me>
    <p name="p7">$$f(7)</p>
    <p name="p8">$$f(8)</p>
    <p name="p9">$$f(9)</p>
    <p name="p10">$$f(10)</p>
    <p name="p11">$$f(11)</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/mef") + " .mjx-mrow")
      .eq(0)
      .should(
        "have.text",
        "f(x)=⎧⎪\n⎪\n⎪\n⎪\n⎪\n⎪\n⎪⎨⎪\n⎪\n⎪\n⎪\n⎪\n⎪\n⎪⎩1if\u00a0x=axif\u00a0s<x<tx210if\u00a01≤x<qx3100if\u00a0z<x<5x41000if\u00a08≤x≤10",
      );

    cy.get(cesc("#\\/p7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");
    cy.get(cesc("#\\/p8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4.1");
    cy.get(cesc("#\\/p9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "6.56");
    cy.get(cesc("#\\/p10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "10");
    cy.get(cesc("#\\/p11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "NaN");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      for (let i = -10; i <= 15; i++) {
        if (i >= 8 && i <= 10) {
          expect(f(i)).closeTo(i ** 4 / 1000, 1e-14);
        } else {
          expect(f(i)).eqls(NaN);
        }
      }

      expect(stateVariables["/f"].stateValues.globalMinimum).eqls([8, f(8)]);
      expect(stateVariables["/f"].stateValues.globalInfimum).eqls([8, f(8)]);
      expect(stateVariables["/f"].stateValues.globalMaximum).eqls([10, f(10)]);
      expect(stateVariables["/f"].stateValues.globalSupremum).eqls([10, f(10)]);
    });
  });

  it("use single point notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
    <piecewisefunction name="f">
      <function domain="[1, sin(pi/2)]">x</function>
      <function domain="[sqrt(4), 2]">x^2/10</function>
      <function domain="(sin(5pi/2),3)">x^3/100</function>
    </piecewisefunction>
    $f.extrema
    $f.globalMaximum{styleNumber="2"}
    $f.globalInfimum{styleNumber="3"}
    </graph>
    <me name="mef">f(x)=$f</me>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/mef") + " .mjx-mrow")
      .eq(0)
      .should(
        "have.text",
        "f(x)=⎧⎪\n⎪⎨⎪\n⎪⎩xif\u00a0x=1x210if\u00a0x=2x3100if\u00a01<x<2\u00a0or\u00a02<x<3",
      );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      expect(f(0)).eqls(NaN);
      expect(f(0.999)).eqls(NaN);
      expect(f(1)).eq(1);
      expect(f(1.0001)).closeTo(1.0001 ** 3 / 100, 1e-14);
      expect(f(1.9999)).closeTo(1.9999 ** 3 / 100, 1e-14);
      expect(f(2)).eq(4 / 10);
      expect(f(2.0001)).closeTo(2.0001 ** 3 / 100, 1e-14);
      expect(f(2.9999)).closeTo(2.9999 ** 3 / 100, 1e-14);
      expect(f(3)).eqls(NaN);
      expect(f(4)).eqls(NaN);

      expect(stateVariables["/f"].stateValues.maxima).eqls([[2, 4 / 10]]);
      expect(stateVariables["/f"].stateValues.minima).eqls([]);
      expect(stateVariables["/f"].stateValues.globalMaximum).eqls([1, 1]);
      expect(stateVariables["/f"].stateValues.globalSupremum).eqls([1, 1]);
      expect(stateVariables["/f"].stateValues.globalMinimum).eqls([]);
      expect(stateVariables["/f"].stateValues.globalInfimum).eqls([1, 1 / 100]);
    });
  });

  it("global extrema, find single points from gaps", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
    <piecewisefunction name="f" domain="(-5,5)">
      <function domain="(-1,0.1)">3</function>
      <function domain="(3,4)">1/x-1</function>
      <function domain="(4,5)">1/x-1</function>
      <function domain="(-6,Infinity)">-2-(x+4)^2</function>
    </piecewisefunction>
    $f.extrema
    $f.globalMaximum{styleNumber="2"}
    $f.globalInfimum{styleNumber="3"}
    </graph>
    <me name="mef">f(x)=$f</me>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/mef") + " .mjx-mrow")
      .eq(0)
      .should(
        "have.text",
        "f(x)=⎧⎪⎨⎪⎩3if\u00a0−1<x<0.11x−1if\u00a03<x<4\u00a0or\u00a04<x<5−2−(x+4)2if\u00a0−6<x≤−1\u00a0or\u00a00.1≤x≤3\u00a0or\u00a0x=4\u00a0or\u00a0x≥5",
      );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f = createFunctionFromDefinition(
        stateVariables["/f"].stateValues.fDefinitions[0],
      );
      expect(f(-5)).eqls(NaN);
      expect(f(-4.999)).closeTo(-2 - 0.999 ** 2, 1e-14);
      expect(f(-1)).eq(-2 - 3 ** 2);
      expect(f(-0.999)).eq(3);
      expect(f(0.0999)).eq(3);
      expect(f(0.1)).eq(-2 - 4.1 ** 2);
      expect(f(3)).eq(-2 - 7 ** 2);
      expect(f(3.001)).eq(1 / 3.001 - 1);
      expect(f(3.999)).eq(1 / 3.999 - 1);
      expect(f(4)).eq(-2 - 8 ** 2);
      expect(f(4.001)).eq(1 / 4.001 - 1);
      expect(f(4.999)).eq(1 / 4.999 - 1);
      expect(f(5)).eqls(NaN);

      expect(stateVariables["/f"].stateValues.maxima).eqls([[-4, -2]]);
      expect(stateVariables["/f"].stateValues.minima).eqls([
        [-1, -2 - 3 ** 2],
        [3, -2 - 7 ** 2],
        [4, -2 - 8 ** 2],
      ]);
      expect(stateVariables["/f"].stateValues.globalMaximum[0]).within(
        -1,
        -0.9,
      );
      expect(stateVariables["/f"].stateValues.globalMaximum[1]).eq(3);
      expect(stateVariables["/f"].stateValues.globalSupremum).eqls([-1, 3]);
      expect(stateVariables["/f"].stateValues.globalMinimum).eqls([
        4,
        -2 - 8 ** 2,
      ]);
      expect(stateVariables["/f"].stateValues.globalInfimum).eqls([
        4,
        -2 - 8 ** 2,
      ]);
    });
  });

  it("latex combines pieces", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
    <piecewisefunction name="f">
      <function domain="(1,3)">x</function>
      <function domain="(s,t)">x</function>
      <function domain="(2,4)">x</function>
      <function domain="[1,q)">x^2</function>
      <function domain="[4,5)">x^2</function>
      <function domain="[b,1)">x^2</function>
      <function domain="[5,6)">x^2</function>
      <function domain="(8,9)">x</function>
    </piecewisefunction>
    </graph>
    <me name="mef">f(x)=$f</me>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/mef") + " .mjx-mrow")
      .eq(0)
      .should(
        "have.text",
        "f(x)=⎧⎨⎩xif\u00a0s<x<t\u00a0or\u00a01<x<4x2if\u00a01≤x<q\u00a0or\u00a0b≤x<1\u00a0or\u00a04≤x<6xif\u00a08<x<9",
      );
  });

  it("extrema of a function with piecewise function child", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
    <function name="f">
    <piecewisefunction domain="(-5,8]">
      <function domain="(-1,1]">x^2</function>
      <function domain="(-4,4]">1-x^2/4</function>
      <function>cos(pi x)</function>
    </piecewisefunction>
    </function>
    $f.extrema
    $f.globalSupremum{styleNumber="2"}
    $f.globalMaximum{styleNumber="3"}
    $f.globalInfimum{styleNumber="4"}
    $f.globalMinimum{styleNumber="5"}
    </graph>
    <me name="mef">f(x)=$f</me>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/mef") + " .mjx-mrow")
      .eq(0)
      .should(
        "have.text",
        "f(x)=⎧⎪⎨⎪⎩x2if\u00a0−1<x≤11−x24if\u00a0−4<x≤−1\u00a0or\u00a01<x≤4cos(πx)otherwise",
      );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/f"].stateValues.maxima).eqls([
        [-4, 1],
        [1, 1],
        [6, 1],
        [8, 1],
      ]);
      expect(stateVariables["/f"].stateValues.minima).eqls([
        [0, 0],
        [4, -3],
        [5, -1],
        [7, -1],
      ]);
      expect(stateVariables["/f"].stateValues.globalMaximum).eqls([1, 1]);
      expect(stateVariables["/f"].stateValues.globalSupremum).eqls([-1, 1]);
      expect(stateVariables["/f"].stateValues.globalMinimum).eqls([4, -3]);
      expect(stateVariables["/f"].stateValues.globalInfimum).eqls([-4, -3]);
    });
  });

  it("extrema of piecewise functions with piecewise function children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <piecewisefunction name="f1">
        <function domain="(-Infinity,0)">0</function>
        <function>x^2</function>
      </piecewisefunction>
      $f1.extrema
    </graph>
    
    <graph>
      <piecewisefunction name="f2">
        <piecewisefunction copySource="f1" domain="(-3,2]" />
        <function>1/x</function>
      </piecewisefunction>
      $f2.extrema
    </graph>
    
    <graph>
      <piecewisefunction name="f3">
        <function domain="(3,Infinity)">9*e^(-(x-3))</function>
        <function domain="[1,2)">8-x</function>
        $f1
      </piecewisefunction>
      $f3.extrema
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let f2 = createFunctionFromDefinition(
        stateVariables["/f2"].stateValues.fDefinitions[0],
      );

      expect(f2(-4)).eq(-1 / 4);
      expect(f2(-3)).eq(-1 / 3);
      expect(f2(-2)).eq(0);
      expect(f2(-1)).eq(0);
      expect(f2(0)).eq(0);
      expect(f2(1)).eq(1);
      expect(f2(2)).eq(4);
      expect(f2(3)).eq(1 / 3);
      expect(f2(4)).eq(1 / 4);

      expect(stateVariables["/f2"].stateValues.maxima).eqls([[2, 4]]);
      expect(stateVariables["/f2"].stateValues.minima).eqls([[-3, -1 / 3]]);
      expect(stateVariables["/f2"].stateValues.globalMaximum).eqls([2, 4]);
      expect(stateVariables["/f2"].stateValues.globalSupremum).eqls([2, 4]);
      expect(stateVariables["/f2"].stateValues.globalMinimum).eqls([
        -3,
        -1 / 3,
      ]);
      expect(stateVariables["/f2"].stateValues.globalInfimum).eqls([
        -3,
        -1 / 3,
      ]);

      let f3 = createFunctionFromDefinition(
        stateVariables["/f3"].stateValues.fDefinitions[0],
      );

      expect(f3(-4)).eq(0);
      expect(f3(0)).eq(0);
      expect(f3(0.5)).eq(0.25);
      expect(f3(1)).eq(7);
      expect(f3(1.5)).eq(6.5);
      expect(f3(2)).eq(4);
      expect(f3(3)).eq(9);
      expect(f3(4)).eq(9 * Math.exp(-1));

      expect(stateVariables["/f3"].stateValues.maxima).eqls([
        [1, 7],
        [3, 9],
      ]);
      expect(stateVariables["/f3"].stateValues.minima).eqls([[2, 4]]);
      expect(stateVariables["/f3"].stateValues.globalMaximum).eqls([3, 9]);
      expect(stateVariables["/f3"].stateValues.globalSupremum).eqls([3, 9]);
      expect(stateVariables["/f3"].stateValues.globalMinimum[1]).eq(0);
      expect(stateVariables["/f3"].stateValues.globalInfimum[1]).eq(0);
    });
  });
});
