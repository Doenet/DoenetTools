import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Function Operator Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('clamp function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function name="original">x^3</function>
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
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let map1Replacements = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map1ReplacementAnchors = map1Replacements.map(x => cesc('#' + x.componentName))
      let map2Replacements = stateVariables["/_map2"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map2ReplacementAnchors = map2Replacements.map(x => cesc('#' + x.componentName))
      let map3Replacements = stateVariables["/_map3"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map3ReplacementAnchors = map3Replacements.map(x => cesc('#' + x.componentName))
      let map4Replacements = stateVariables["/m4"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map4ReplacementAnchors = map4Replacements.map(x => cesc('#' + x.componentName))
      let map5Replacements = stateVariables["/m5"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map5ReplacementAnchors = map5Replacements.map(x => cesc('#' + x.componentName))

      let clamp01 = x => Math.min(1, Math.max(0, x));
      let clampn35 = x => Math.min(5, Math.max(-3, x));
      let indToVal = ind => me.math.round((0.2 * (ind - 11)) ** 3, 8);

      for (let i = 1; i <= 21; i++) {
        cy.get(map1ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(indToVal(i).toString())
        });

        cy.get(map2ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(clamp01(indToVal(i)).toString())
        });

        cy.get(map3ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(clampn35(indToVal(i)).toString())
        });

        cy.get(map4ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(clamp01(indToVal(i)).toString())
        });

        cy.get(map5ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(clampn35(indToVal(i)).toString())
        });
      }


      cy.window().then(async (win) => {
        for (let i = 1; i <= 21; i++) {
          expect(map1Replacements[i - 1].stateValues.value.tree).closeTo(indToVal(i), 1E-10);
          expect(map2Replacements[i - 1].stateValues.value.tree).closeTo(clamp01(indToVal(i)), 1E-10);
          expect(map3Replacements[i - 1].stateValues.value.tree).closeTo(clampn35(indToVal(i)), 1E-10);
          expect(map4Replacements[i - 1].stateValues.value.tree).closeTo(clamp01(indToVal(i)), 1E-10);
          expect(map5Replacements[i - 1].stateValues.value.tree).closeTo(clampn35(indToVal(i)), 1E-10);
        }
      })
    })
  })

  it('wrap function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function name="original">x^3</function>
    <wrapfunctionperiodic name="wrap01"><copy target="original" /></wrapfunctionperiodic>
    <wrapfunctionperiodic name="wrapn23" lowervalue="-2" uppervalue="3"><copy target="original" /></wrapfunctionperiodic>

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
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let map1Replacements = stateVariables["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map1ReplacementAnchors = map1Replacements.map(x => cesc('#' + x.componentName))
      let map2Replacements = stateVariables["/_map2"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map2ReplacementAnchors = map2Replacements.map(x => cesc('#' + x.componentName))
      let map3Replacements = stateVariables["/_map3"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map3ReplacementAnchors = map3Replacements.map(x => cesc('#' + x.componentName))
      let map4Replacements = stateVariables["/m4"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map4ReplacementAnchors = map4Replacements.map(x => cesc('#' + x.componentName))
      let map5Replacements = stateVariables["/m5"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map5ReplacementAnchors = map5Replacements.map(x => cesc('#' + x.componentName))

      let wrap01 = x => me.math.round(me.math.mod(x, 1), 8);
      let wrapn23 = x => me.math.round(-2 + me.math.mod(x + 2, 5), 8);
      let indToVal = ind => me.math.round((0.2 * (ind - 11)) ** 3, 8);

      for (let i = 1; i <= 21; i++) {
        cy.get(map1ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(indToVal(i).toString())
        });

        cy.get(map2ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(wrap01(indToVal(i)).toString())
        });

        cy.get(map3ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(wrapn23(indToVal(i)).toString())
        });

        cy.get(map4ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(wrap01(indToVal(i)).toString())
        });

        cy.get(map5ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(wrapn23(indToVal(i)).toString())
        });
      }

      cy.window().then(async (win) => {
        for (let i = 1; i <= 21; i++) {
          expect(map1Replacements[i - 1].stateValues.value.tree).closeTo(indToVal(i), 1E-10);
          expect(map2Replacements[i - 1].stateValues.value.tree).closeTo(wrap01(indToVal(i)), 1E-10);
          expect(map3Replacements[i - 1].stateValues.value.tree).closeTo(wrapn23(indToVal(i)), 1E-10);
          expect(map4Replacements[i - 1].stateValues.value.tree).closeTo(wrap01(indToVal(i)), 1E-10);
          expect(map5Replacements[i - 1].stateValues.value.tree).closeTo(wrapn23(indToVal(i)), 1E-10);
        }
      })
    })
  })

  it('derivative', () => {
    cy.window().then(async (win) => {
      win.postMessage({
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
    <function name="f" variables="$x">$formula</function>
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

    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#/_m5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)=sin(x+1)')
    });
    cy.get(cesc('#/_m6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal("f′(x)=cos(x+1)")
    });



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = 3, y1 = Math.sin(4);
      let x2 = 3, y2 = Math.cos(4);

      expect(stateVariables["/f"].stateValues.formula.toString()).eq('sin(x + 1)');
      expect(stateVariables["/g"].stateValues.formula.toString()).eq('cos(x + 1)');
      expect(stateVariables["/_point1"].stateValues.xs[0].tree).closeTo(x1, 1E-12);
      expect(stateVariables["/_point1"].stateValues.xs[1].tree).closeTo(y1, 1E-12);
      expect(stateVariables["/_point2"].stateValues.xs[0].tree).closeTo(x2, 1E-12);
      expect(stateVariables["/_point2"].stateValues.xs[1].tree).closeTo(y2, 1E-12);

    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let x1 = -3, y1 = Math.sin(-2);
      let x2 = 5, y2 = Math.cos(6);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 }
      })

      expect(stateVariables["/f"].stateValues.formula.toString()).eq('sin(x + 1)');
      expect(stateVariables["/g"].stateValues.formula.toString()).eq('cos(x + 1)');
      expect(stateVariables["/_point1"].stateValues.xs[0].tree).closeTo(x1, 1E-12);
      expect(stateVariables["/_point1"].stateValues.xs[1].tree).closeTo(y1, 1E-12);
      expect(stateVariables["/_point2"].stateValues.xs[0].tree).closeTo(x2, 1E-12);
      expect(stateVariables["/_point2"].stateValues.xs[1].tree).closeTo(y2, 1E-12);

    })


    cy.get(cesc('#/a') + ' textarea').type(`{end}{backspace}2`, { force: true });
    cy.get(cesc('#/b') + ' textarea').type(`{end}{backspace}pi`, { force: true });
    cy.get(cesc('#/c') + ' textarea').type(`{end}{backspace}e`, { force: true });
    cy.get(cesc('#/x') + ' textarea').type(`{end}{backspace}q`, { force: true }).blur();


    cy.get(cesc('#/_m5') + ' .mjx-mrow').should('contain.text', 'f(q)=2sin(e+πq)')
    cy.get(cesc('#/_m5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(q)=2sin(e+πq)')
    });
    cy.get(cesc('#/_m6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal("f′(q)=2πcos(e+πq)")
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = -3, y1 = 2 * Math.sin(Math.PI * -3 + Math.E);
      let x2 = 5, y2 = 2 * Math.PI * Math.cos(Math.PI * 5 + Math.E);

      expect(stateVariables["/f"].stateValues.formula.toString()).eq('2 sin(e + π q)');
      expect(stateVariables["/g"].stateValues.formula.toString()).eq('2 π cos(e + π q)');
      expect(stateVariables["/_point1"].stateValues.xs[0].tree).closeTo(x1, 1E-12);
      expect(stateVariables["/_point1"].stateValues.xs[1].tree).closeTo(y1, 1E-12);
      expect(stateVariables["/_point2"].stateValues.xs[0].tree).closeTo(x2, 1E-12);
      expect(stateVariables["/_point2"].stateValues.xs[1].tree).closeTo(y2, 1E-12);

    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let x1 = 9, y1 = 2 * Math.sin(Math.PI * 9 + Math.E);
      let x2 = -7, y2 = 2 * Math.PI * Math.cos(Math.PI * -7 + Math.E);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 }
      })

      expect(stateVariables["/f"].stateValues.formula.toString()).eq('2 sin(e + π q)');
      expect(stateVariables["/g"].stateValues.formula.toString()).eq('2 π cos(e + π q)');
      expect(stateVariables["/_point1"].stateValues.xs[0].tree).closeTo(x1, 1E-12);
      expect(stateVariables["/_point1"].stateValues.xs[1].tree).closeTo(y1, 1E-12);
      expect(stateVariables["/_point2"].stateValues.xs[0].tree).closeTo(x2, 1E-12);
      expect(stateVariables["/_point2"].stateValues.xs[1].tree).closeTo(y2, 1E-12);

    })


  })

  it('derivative 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <function name="f1">sin(x)</function>
      <function name="f2" variables="y">e^(2y)</function>
      <function name="f3">xyz</function>
      <function name="f4" variables="z">xyz</function>
      <derivative name="d1"><function>x^2</function></derivative>
      <derivative name="d2"><math name="x2">x^2</math></derivative>
      <derivative name="d2b">$x2</derivative>
      <derivative name="d2c"><copy target="x2" /></derivative>
      <derivative name="d3"><function>x^2sin(z)</function></derivative>
      <derivative name="d4" variables="z">x^2sin(z)</derivative>
      <math name='var'>z</math><number name="a">2</number>
      <derivative name="d4b" variables="$var">x^$a sin($var)</derivative>
      <derivative name="d5"><copy target="f1" /></derivative>
      <derivative name="d5b">$f1</derivative>
      <derivative name="d6"><copy target="f2" /></derivative>
      <derivative name="d6b">$f2</derivative>
      <derivative name="d7"><copy target="f3" /></derivative>
      <derivative name="d7b">$f3</derivative>
      <derivative name="d8"><copy target="f4" /></derivative>
      <derivative name="d8b">$f4</derivative>
      <derivative variables="q" name="d9"><copy target="f1" /></derivative>
      <derivative variables="q" name="d10"><copy target="f2" /></derivative>
      <derivative variables="q" name="d11"><copy target="f3" /></derivative>
      <derivative variables="q" name="d12"><copy target="f4" /></derivative>
      <derivative variables="y" name="d13"><copy target="f3" /></derivative>
      <derivative variables="y" name="d14"><copy target="f4" /></derivative>
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/d1'].stateValues.formula.equals(me.fromText("2x"))).eq(true);
      expect(stateVariables['/d2'].stateValues.formula.equals(me.fromText("2x"))).eq(true);
      expect(stateVariables['/d2b'].stateValues.formula.equals(me.fromText("2x"))).eq(true);
      expect(stateVariables['/d2c'].stateValues.formula.equals(me.fromText("2x"))).eq(true);
      expect(stateVariables['/d3'].stateValues.formula.equals(me.fromText("2x sin(z)"))).eq(true);
      expect(stateVariables['/d4'].stateValues.formula.equals(me.fromText("x^2cos(z)"))).eq(true);
      expect(stateVariables['/d4b'].stateValues.formula.equals(me.fromText("x^2cos(z)"))).eq(true);
      expect(stateVariables['/d5'].stateValues.formula.equals(me.fromText("cos(x)"))).eq(true);
      expect(stateVariables['/d5b'].stateValues.formula.equals(me.fromText("cos(x)"))).eq(true);
      expect(stateVariables['/d6'].stateValues.formula.equals(me.fromText("2e^(2y)"))).eq(true);
      expect(stateVariables['/d6b'].stateValues.formula.equals(me.fromText("2e^(2y)"))).eq(true);
      expect(stateVariables['/d7'].stateValues.formula.equals(me.fromText("yz"))).eq(true);
      expect(stateVariables['/d7b'].stateValues.formula.equals(me.fromText("yz"))).eq(true);
      expect(stateVariables['/d8'].stateValues.formula.equals(me.fromText("xy"))).eq(true);
      expect(stateVariables['/d8b'].stateValues.formula.equals(me.fromText("xy"))).eq(true);
      expect(stateVariables['/d9'].stateValues.formula.equals(me.fromText("0"))).eq(true);
      expect(stateVariables['/d10'].stateValues.formula.equals(me.fromText("0"))).eq(true);
      expect(stateVariables['/d11'].stateValues.formula.equals(me.fromText("0"))).eq(true);
      expect(stateVariables['/d12'].stateValues.formula.equals(me.fromText("0"))).eq(true);
      expect(stateVariables['/d13'].stateValues.formula.equals(me.fromText("xz"))).eq(true);
      expect(stateVariables['/d14'].stateValues.formula.equals(me.fromText("xz"))).eq(true);
    })
  })

  it('specifying derivative variables of a function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <function name="f1" nInputs="3">sin(x+y^2)z</function>
      <function name="f2" variables="z y x">sin(x+y^2)z</function>
      <function name="f3" variables="x y">sin(x+y^2)z</function>
      <function name="f4" variables="x_1 x_2 x_3">sin(x_1+x_2^2)x_3</function>
      <derivative name="d11">$f1</derivative>
      <derivative name="d12" variables="z">$f1</derivative>
      <derivative name="d13" derivVariables="x">$f1</derivative>
      <derivative name="d14" derivVariables="z">$f1</derivative>
      <derivative name="d15" derivVariables="y z">$f1</derivative>
      <derivative name="d16" derivVariables="x x y">$f1</derivative>
      <derivative name="d17" derivVariables="u">$f1</derivative>
      <derivative name="d18" derivVariables="x x y" variables="z">$f1</derivative>

      <derivative name="d21">$f2</derivative>
      <derivative name="d22" variables="x">$f2</derivative>
      <derivative name="d23" derivVariables="x">$f2</derivative>
      <derivative name="d24" derivVariables="z">$f2</derivative>
      <derivative name="d25" derivVariables="y z">$f2</derivative>
      <derivative name="d26" derivVariables="x x y">$f2</derivative>
      <derivative name="d27" derivVariables="u">$f2</derivative>
      <derivative name="d28" derivVariables="x x y" variables="z">$f2</derivative>

      <derivative name="d31">$f3</derivative>
      <derivative name="d32" variables="z">$f3</derivative>
      <derivative name="d33" derivVariables="x">$f3</derivative>
      <derivative name="d34" derivVariables="z">$f3</derivative>
      <derivative name="d35" derivVariables="y z">$f3</derivative>
      <derivative name="d36" derivVariables="x x y">$f3</derivative>
      <derivative name="d37" derivVariables="u">$f3</derivative>
      <derivative name="d38" derivVariables="x x y" variables="z">$f3</derivative>

      <derivative name="d41">$f4</derivative>
      <derivative name="d42" derivVariables="x_1 x_2 x_3">$f4</derivative>
      <derivative name="d43" derivVariables="x">$f4</derivative>
      <derivative name="d44" derivVariables="x_1 x_2 x_3" variables="x_3 x_2 x_1">$f4</derivative>

      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect((stateVariables['/d11'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d11'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d11'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d12'].stateValues.formula).equals(me.fromText("sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d12'].stateValues.variables).map(x => x.tree)).eqls(["z"])
      expect((stateVariables['/d12'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/d13'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d13'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d13'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d14'].stateValues.formula).equals(me.fromText("sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d14'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d14'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/d15'].stateValues.formula).equals(me.fromText("2 y cos(x+y^2)"))).eq(true);
      expect((stateVariables['/d15'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d15'].stateValues.derivVariables).map(x => x.tree)).eqls(["y", "z"])

      expect((stateVariables['/d16'].stateValues.formula).equals(me.fromText("-2 y cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d16'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d16'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "x", "y"])

      expect((stateVariables['/d17'].stateValues.formula).equals(me.fromText("0"))).eq(true);
      expect((stateVariables['/d17'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d17'].stateValues.derivVariables).map(x => x.tree)).eqls(["u"])

      expect((stateVariables['/d18'].stateValues.formula).equals(me.fromText("-2 y cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d18'].stateValues.variables).map(x => x.tree)).eqls(["z"])
      expect((stateVariables['/d18'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "x", "y"])


      expect((stateVariables['/d21'].stateValues.formula).equals(me.fromText("sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d21'].stateValues.variables).map(x => x.tree)).eqls(["z", "y", "x"])
      expect((stateVariables['/d21'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/d22'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d22'].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((stateVariables['/d22'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d23'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d23'].stateValues.variables).map(x => x.tree)).eqls(["z", "y", "x"])
      expect((stateVariables['/d23'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d24'].stateValues.formula).equals(me.fromText("sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d24'].stateValues.variables).map(x => x.tree)).eqls(["z", "y", "x"])
      expect((stateVariables['/d24'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/d25'].stateValues.formula).equals(me.fromText("2 y cos(x+y^2)"))).eq(true);
      expect((stateVariables['/d25'].stateValues.variables).map(x => x.tree)).eqls(["z", "y", "x"])
      expect((stateVariables['/d25'].stateValues.derivVariables).map(x => x.tree)).eqls(["y", "z"])

      expect((stateVariables['/d26'].stateValues.formula).equals(me.fromText("-2 y cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d26'].stateValues.variables).map(x => x.tree)).eqls(["z", "y", "x"])
      expect((stateVariables['/d26'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "x", "y"])

      expect((stateVariables['/d27'].stateValues.formula).equals(me.fromText("0"))).eq(true);
      expect((stateVariables['/d27'].stateValues.variables).map(x => x.tree)).eqls(["z", "y", "x"])
      expect((stateVariables['/d27'].stateValues.derivVariables).map(x => x.tree)).eqls(["u"])

      expect((stateVariables['/d28'].stateValues.formula).equals(me.fromText("-2 y cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d28'].stateValues.variables).map(x => x.tree)).eqls(["z"])
      expect((stateVariables['/d28'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "x", "y"])


      expect((stateVariables['/d31'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d31'].stateValues.variables).map(x => x.tree)).eqls(["x", "y"])
      expect((stateVariables['/d31'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d32'].stateValues.formula).equals(me.fromText("sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d32'].stateValues.variables).map(x => x.tree)).eqls(["z"])
      expect((stateVariables['/d32'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/d33'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d33'].stateValues.variables).map(x => x.tree)).eqls(["x", "y"])
      expect((stateVariables['/d33'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d34'].stateValues.formula).equals(me.fromText("sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d34'].stateValues.variables).map(x => x.tree)).eqls(["x", "y"])
      expect((stateVariables['/d34'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/d35'].stateValues.formula).equals(me.fromText("2 y cos(x+y^2)"))).eq(true);
      expect((stateVariables['/d35'].stateValues.variables).map(x => x.tree)).eqls(["x", "y"])
      expect((stateVariables['/d35'].stateValues.derivVariables).map(x => x.tree)).eqls(["y", "z"])

      expect((stateVariables['/d36'].stateValues.formula).equals(me.fromText("-2 y cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d36'].stateValues.variables).map(x => x.tree)).eqls(["x", "y"])
      expect((stateVariables['/d36'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "x", "y"])

      expect((stateVariables['/d37'].stateValues.formula).equals(me.fromText("0"))).eq(true);
      expect((stateVariables['/d37'].stateValues.variables).map(x => x.tree)).eqls(["x", "y"])
      expect((stateVariables['/d37'].stateValues.derivVariables).map(x => x.tree)).eqls(["u"])

      expect((stateVariables['/d38'].stateValues.formula).equals(me.fromText("-2 y cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d38'].stateValues.variables).map(x => x.tree)).eqls(["z"])
      expect((stateVariables['/d38'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "x", "y"])


      expect((stateVariables['/d41'].stateValues.formula).equals(me.fromText("cos(x_1+x_2^2)x_3"))).eq(true);
      expect((stateVariables['/d41'].stateValues.variables).map(x => x.tree)).eqls([["_", "x", 1], ["_", "x", 2], ["_", "x", 3]])
      expect((stateVariables['/d41'].stateValues.derivVariables).map(x => x.tree)).eqls([["_", "x", 1]])

      expect((stateVariables['/d42'].stateValues.formula).equals(me.fromText("-2 x_2 sin(x_1+x_2^2)"))).eq(true);
      expect((stateVariables['/d42'].stateValues.variables).map(x => x.tree)).eqls([["_", "x", 1], ["_", "x", 2], ["_", "x", 3]])
      expect((stateVariables['/d42'].stateValues.derivVariables).map(x => x.tree)).eqls([["_", "x", 1], ["_", "x", 2], ["_", "x", 3]])

      expect((stateVariables['/d43'].stateValues.formula).equals(me.fromText("0"))).eq(true);
      expect((stateVariables['/d43'].stateValues.variables).map(x => x.tree)).eqls([["_", "x", 1], ["_", "x", 2], ["_", "x", 3]])
      expect((stateVariables['/d43'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d44'].stateValues.formula).equals(me.fromText("-2 x_2 sin(x_1+x_2^2)"))).eq(true);
      expect((stateVariables['/d44'].stateValues.variables).map(x => x.tree)).eqls([["_", "x", 3], ["_", "x", 2], ["_", "x", 1]])
      expect((stateVariables['/d44'].stateValues.derivVariables).map(x => x.tree)).eqls([["_", "x", 1], ["_", "x", 2], ["_", "x", 3]])

    })
  })

  it('specifying derivative variables of an expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <math name="m1">sin(x+y^2)z</math>
      <math name="m2">sin(x_1+x_2^2)x_3</math>
      <derivative name="d1">$m1</derivative>
      <derivative name="d2" variables="x">$m1</derivative>
      <derivative name="d3" variables="x y z">$m1</derivative>
      <derivative name="d4" variables="z y x">$m1</derivative>
      <derivative name="d5" derivVariables="x">$m1</derivative>
      <derivative name="d5a" derivVariables="x" variables="x y z">$m1</derivative>
      <derivative name="d6" derivVariables="x x">$m1</derivative>
      <derivative name="d6a" derivVariables="x"><derivative derivVariables="x">$m1</derivative></derivative>
      <derivative name="d6b" derivVariables="x" variables="x y z"><derivative derivVariables="x">$m1</derivative></derivative>
      <derivative name="d6c" derivVariables="x"><derivative derivVariables="x" variables="x y z">$m1</derivative></derivative>
      <derivative name="d6d" derivVariables="x x" variables="x y z">$m1</derivative>
      <derivative name="d7" derivVariables="x y">$m1</derivative>
      <derivative name="d7a" derivVariables="y"><derivative derivVariables="x">$m1</derivative></derivative>
      <derivative name="d7b" derivVariables="y" variables="x y z"><derivative derivVariables="x">$m1</derivative></derivative>
      <derivative name="d7c" derivVariables="y"><derivative derivVariables="x" variables="x y z">$m1</derivative></derivative>
      <derivative name="d8" derivVariables="x y z">$m1</derivative>
      <derivative name="d8a" derivVariables="z"><derivative derivVariables="y"><derivative derivVariables="x">$m1</derivative></derivative></derivative>
      <derivative name="d8b" derivVariables="z" variables="x y z"><derivative derivVariables="y"><derivative derivVariables="x">$m1</derivative></derivative></derivative>
      <derivative name="d8c" derivVariables="z"><derivative derivVariables="y"><derivative derivVariables="x" variables="x y z">$m1</derivative></derivative></derivative>
      <derivative name="d9" derivVariables="x y z x">$m1</derivative>
      <derivative name="d9a" derivVariables="x"><derivative derivVariables="z"><derivative derivVariables="y"><derivative derivVariables="x">$m1</derivative></derivative></derivative></derivative>
      <derivative name="d9b" derivVariables="x"><derivative derivVariables="z" variables="x y z"><derivative derivVariables="y"><derivative derivVariables="x">$m1</derivative></derivative></derivative></derivative>
      <derivative name="d9c" derivVariables="x"><derivative derivVariables="z"><derivative derivVariables="y" variables="x y z"><derivative derivVariables="x">$m1</derivative></derivative></derivative></derivative>
      <derivative name="d10" derivVariables="q">$m1</derivative>
      <derivative name="d11" derivVariables="y" variables="x y z">$m1</derivative>
      <derivative name="d12" derivVariables="y" variables="x z">$m1</derivative>


      <derivative name="d13" variables="x_1 x_2 x_3">$m2</derivative>
      <derivative name="d14" derivVariables="x_1 x_1">$m2</derivative>
      <derivative name="d15" derivVariables="x_1 x_1" variables="x_1 x_2 x_3">$m2</derivative>

      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect((stateVariables['/d1'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d1'].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((stateVariables['/d1'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d2'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d2'].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((stateVariables['/d2'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d3'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d3'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d3'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d4'].stateValues.formula).equals(me.fromText("sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d4'].stateValues.variables).map(x => x.tree)).eqls(["z", "y", "x"])
      expect((stateVariables['/d4'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/d5'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d5'].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((stateVariables['/d5'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d5a'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d5a'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d5a'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d6'].stateValues.formula).equals(me.fromText("-sin(x+y^2)z"))).eq(true);
      expect((stateVariables['/d6'].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((stateVariables['/d6'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "x"])

      expect((stateVariables['/d6a'].stateValues.formula).equals(me.fromText("-sin(x+y^2)z"))).eq(true);
      expect((stateVariables['/d6a'].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((stateVariables['/d6a'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d6b'].stateValues.formula).equals(me.fromText("-sin(x+y^2)z"))).eq(true);
      expect((stateVariables['/d6b'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d6b'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d6c'].stateValues.formula).equals(me.fromText("-sin(x+y^2)z"))).eq(true);
      expect((stateVariables['/d6c'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d6c'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d6d'].stateValues.formula).equals(me.fromText("-sin(x+y^2)z"))).eq(true);
      expect((stateVariables['/d6d'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d6d'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "x"])

      expect((stateVariables['/d7'].stateValues.formula).equals(me.fromText("-2 y sin(x+y^2)z"))).eq(true);
      expect((stateVariables['/d7'].stateValues.variables).map(x => x.tree)).eqls(["x", "y"])
      expect((stateVariables['/d7'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "y"])

      expect((stateVariables['/d7a'].stateValues.formula).equals(me.fromText("-2 y sin(x+y^2)z"))).eq(true);
      expect((stateVariables['/d7a'].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((stateVariables['/d7a'].stateValues.derivVariables).map(x => x.tree)).eqls(["y"])

      expect((stateVariables['/d7b'].stateValues.formula).equals(me.fromText("-2 y sin(x+y^2)z"))).eq(true);
      expect((stateVariables['/d7b'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d7b'].stateValues.derivVariables).map(x => x.tree)).eqls(["y"])

      expect((stateVariables['/d7c'].stateValues.formula).equals(me.fromText("-2 y sin(x+y^2)z"))).eq(true);
      expect((stateVariables['/d7c'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d7c'].stateValues.derivVariables).map(x => x.tree)).eqls(["y"])

      expect((stateVariables['/d8'].stateValues.formula).equals(me.fromText("-2 y sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d8'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d8'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "y", "z"])

      expect((stateVariables['/d8a'].stateValues.formula).equals(me.fromText("-2 y sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d8a'].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((stateVariables['/d8a'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/d8b'].stateValues.formula).equals(me.fromText("-2 y sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d8b'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d8b'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/d8c'].stateValues.formula).equals(me.fromText("-2 y sin(x+y^2)"))).eq(true);
      expect((stateVariables['/d8c'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d8c'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/d9'].stateValues.formula).equals(me.fromText("-2 y cos(x+y^2)"))).eq(true);
      expect((stateVariables['/d9'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d9'].stateValues.derivVariables).map(x => x.tree)).eqls(["x", "y", "z", "x"])

      expect((stateVariables['/d9a'].stateValues.formula).equals(me.fromText("-2 y cos(x+y^2)"))).eq(true);
      expect((stateVariables['/d9a'].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((stateVariables['/d9a'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d9b'].stateValues.formula).equals(me.fromText("-2 y cos(x+y^2)"))).eq(true);
      expect((stateVariables['/d9b'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d9b'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d9c'].stateValues.formula).equals(me.fromText("-2 y cos(x+y^2)"))).eq(true);
      expect((stateVariables['/d9c'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d9c'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/d10'].stateValues.formula).equals(me.fromText("0"))).eq(true);
      expect((stateVariables['/d10'].stateValues.variables).map(x => x.tree)).eqls(["q"])
      expect((stateVariables['/d10'].stateValues.derivVariables).map(x => x.tree)).eqls(["q"])

      expect((stateVariables['/d11'].stateValues.formula).equals(me.fromText("2 y cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d11'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/d11'].stateValues.derivVariables).map(x => x.tree)).eqls(["y"])

      expect((stateVariables['/d12'].stateValues.formula).equals(me.fromText("2 y cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/d12'].stateValues.variables).map(x => x.tree)).eqls(["x", "z"])
      expect((stateVariables['/d12'].stateValues.derivVariables).map(x => x.tree)).eqls(["y"])

      expect((stateVariables['/d13'].stateValues.formula).equals(me.fromText("cos(x_1+x_2^2)x_3"))).eq(true);
      expect((stateVariables['/d13'].stateValues.variables).map(x => x.tree)).eqls([["_", "x", 1], ["_", "x", 2], ["_", "x", 3]])
      expect((stateVariables['/d13'].stateValues.derivVariables).map(x => x.tree)).eqls([["_", "x", 1]])

      expect((stateVariables['/d14'].stateValues.formula).equals(me.fromText("-sin(x_1+x_2^2)x_3"))).eq(true);
      expect((stateVariables['/d14'].stateValues.variables).map(x => x.tree)).eqls([["_", "x", 1]])
      expect((stateVariables['/d14'].stateValues.derivVariables).map(x => x.tree)).eqls([["_", "x", 1], ["_", "x", 1]])

      expect((stateVariables['/d15'].stateValues.formula).equals(me.fromText("-sin(x_1+x_2^2)x_3"))).eq(true);
      expect((stateVariables['/d15'].stateValues.variables).map(x => x.tree)).eqls([["_", "x", 1], ["_", "x", 2], ["_", "x", 3]])
      expect((stateVariables['/d15'].stateValues.derivVariables).map(x => x.tree)).eqls([["_", "x", 1], ["_", "x", 1]])

    })
  })

  it('derivative of function with changed variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
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

      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect((stateVariables['/df1'].stateValues.formula).equals(me.fromText("cos(x+y^2)z"))).eq(true);
      expect((stateVariables['/df1'].stateValues.variables).map(x => x.tree)).eqls(["x", "y", "z"])
      expect((stateVariables['/df1'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

      expect((stateVariables['/df2'].stateValues.formula).equals(me.fromText("sin(x+y^2)"))).eq(true);
      expect((stateVariables['/df2'].stateValues.variables).map(x => x.tree)).eqls(["z", "y", "x"])
      expect((stateVariables['/df2'].stateValues.derivVariables).map(x => x.tree)).eqls(["z"])

      expect((stateVariables['/dg1'].stateValues.formula).equals(me.fromText("cos(x_1+x_2^2)x_3"))).eq(true);
      expect((stateVariables['/dg1'].stateValues.variables).map(x => x.tree)).eqls([["_", "x", 1], ["_", "x", 2], ["_", "x", 3]])
      expect((stateVariables['/dg1'].stateValues.derivVariables).map(x => x.tree)).eqls([["_", "x", 1]])

      expect((stateVariables['/dg2'].stateValues.formula).equals(me.fromText("sin(x_1+x_2^2)"))).eq(true);
      expect((stateVariables['/dg2'].stateValues.variables).map(x => x.tree)).eqls([["_", "x", 3], ["_", "x", 2], ["_", "x", 1]])
      expect((stateVariables['/dg2'].stateValues.derivVariables).map(x => x.tree)).eqls([["_", "x", 3]])
    })
  })

  it('derivative with empty variables attribute', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <derivative name="d1" variables="">x^2</derivative>
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect((stateVariables['/d1'].stateValues.formula).equals(me.fromText("2x"))).eq(true);
      expect((stateVariables['/d1'].stateValues.variables).map(x => x.tree)).eqls(["x"])
      expect((stateVariables['/d1'].stateValues.derivVariables).map(x => x.tree)).eqls(["x"])

    })
  })

  // check to make sure fixed bug where wasn't displaying inside <m>
  it('derivative displayed inside <m>', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>Let <m>f(x) = <function name="f">sin(x)</function></m>.  
      Then <m>f'(x) = <derivative><copy target="f" /></derivative></m>.</p>
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)=sin(x)')
    });

    cy.get('#\\/_m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal("f′(x)=cos(x)")
    });

  })

  it('derivatives of interpolated function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
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
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      for (let x = -10; x <= 10; x += 0.5) {
        expect((stateVariables["/_function1"].stateValues.fs)[0](x)).eq((x - 3) ** 2 + 4);
        expect((stateVariables["/_derivative1"].stateValues.fs)[0](x)).eq(2 * (x - 3));
        expect((stateVariables["/_derivative2"].stateValues.fs)[0](x)).eq(2);
        expect((stateVariables["/_derivative3"].stateValues.fs)[0](x)).eq(0);
        expect((stateVariables["/_derivative4"].stateValues.fs)[0](x)).eq(0);
        expect((stateVariables["/_derivative5"].stateValues.fs)[0](x)).eq(0);
        expect((stateVariables["/_derivative6"].stateValues.fs)[0](x)).eq(0);

      }
    })
  })

  it('derivatives of interpolated function 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <graph>
        <function minima="(3,4)" through="(-1,5)(4,2)" maxima="(1,0)" />
        <derivative stylenumber="2"><copy target="_function1"/></derivative>
        <derivative stylenumber="3"><copy target="_derivative1"/></derivative>
        <derivative stylenumber="4"><copy target="_derivative2"/></derivative>
        <derivative stylenumber="5"><copy target="_derivative3"/></derivative>
      </graph>
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let dx = 0.0001;

      // make sure we don't get within dx of a grid point
      for (let x = -10.02412412; x <= 10; x += 0.5) {

        let f0 = (stateVariables["/_function1"].stateValues.fs)[0](x);
        let f1 = (stateVariables["/_function1"].stateValues.fs)[0](x + dx);
        let fp05 = (stateVariables["/_derivative1"].stateValues.fs)[0](x + dx / 2);
        expect(fp05).closeTo((f1 - f0) / dx, 1E-6)

        let fpn05 = (stateVariables["/_derivative1"].stateValues.fs)[0](x - dx / 2);
        let fpp0 = (stateVariables["/_derivative2"].stateValues.fs)[0](x);
        expect(fpp0).closeTo((fp05 - fpn05) / dx, 1E-6)

        let fpp1 = (stateVariables["/_derivative2"].stateValues.fs)[0](x + dx);
        let fppp05 = (stateVariables["/_derivative3"].stateValues.fs)[0](x + dx / 2);
        expect(fppp05).closeTo((fpp1 - fpp0) / dx, 1E-6)

        let fpppn05 = (stateVariables["/_derivative3"].stateValues.fs)[0](x - dx / 2);
        let fpppp0 = (stateVariables["/_derivative4"].stateValues.fs)[0](x);
        expect(fpppp0).closeTo((fppp05 - fpppn05) / dx, 1E-6)

      }
    })
  })

  it('derivatives of interpolated function specified with variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <function name="f" variables="x" maxima="(5,-3)" minima="(-5,3)" />
      <function name="g" styleNumber="2" variables="y" minima="(3,-9)" maxima="(-3,9)" />
    
      <derivative name="df1">$f</derivative>
      <derivative name="dg1" styleNumber="2">$g</derivative>
    
      <derivative name="df1b" derivVariables="x">$f</derivative>
      <derivative name="zero1" derivVariables="x" styleNumber="2">$g</derivative>
    
      <derivative name="zero2" derivVariables="y">$f</derivative>
      <derivative name="dg1b" derivVariables="y" styleNumber="2">$g</derivative>
    
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
      
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let dx = 0.0001;

      // make sure we don't get within dx of a grid point
      for (let x = -10.02412412; x <= 10; x += 0.5) {

        let f_0 = (stateVariables["/f"].stateValues.fs)[0](x);
        let f_1 = (stateVariables["/f"].stateValues.fs)[0](x + dx);
        let df1_05 = (stateVariables["/df1"].stateValues.fs)[0](x + dx / 2);
        let df1b_05 = (stateVariables["/df1b"].stateValues.fs)[0](x + dx / 2);
        expect(df1_05).closeTo((f_1 - f_0) / dx, 1E-6);
        expect(df1b_05).eq(df1_05);

        let g_0 = (stateVariables["/g"].stateValues.fs)[0](x);
        let g_1 = (stateVariables["/g"].stateValues.fs)[0](x + dx);
        let dg1_05 = (stateVariables["/dg1"].stateValues.fs)[0](x + dx / 2);
        let dg1b_05 = (stateVariables["/dg1b"].stateValues.fs)[0](x + dx / 2);
        expect(dg1_05).closeTo((g_1 - g_0) / dx, 1E-6);
        expect(dg1b_05).eq(dg1_05);


        let df1_n05 = (stateVariables["/df1"].stateValues.fs)[0](x - dx / 2);
        let df2_0 = (stateVariables["/df2"].stateValues.fs)[0](x);
        expect(df2_0).closeTo((df1b_05 - df1_n05) / dx, 1E-6)

        let dg1_n05 = (stateVariables["/dg1"].stateValues.fs)[0](x - dx / 2);
        let dg2_0 = (stateVariables["/dg2"].stateValues.fs)[0](x);
        expect(dg2_0).closeTo((dg1b_05 - dg1_n05) / dx, 1E-6)

        let df2_1 = (stateVariables["/df2"].stateValues.fs)[0](x + dx);
        let df3_05 = (stateVariables["/df3"].stateValues.fs)[0](x + dx / 2);
        expect(df3_05).closeTo((df2_1 - df2_0) / dx, 1E-6)

        let dg2_1 = (stateVariables["/dg2"].stateValues.fs)[0](x + dx);
        let dg3_05 = (stateVariables["/dg3"].stateValues.fs)[0](x + dx / 2);
        expect(dg3_05).closeTo((dg2_1 - dg2_0) / dx, 1E-6)

        let df3_n05 = (stateVariables["/df3"].stateValues.fs)[0](x - dx / 2);
        let df4_0 = (stateVariables["/df4"].stateValues.fs)[0](x);
        expect(df4_0).closeTo((df3_05 - df3_n05) / dx, 1E-6)

        let dg3_n05 = (stateVariables["/dg3"].stateValues.fs)[0](x - dx / 2);
        let dg4_0 = (stateVariables["/dg4"].stateValues.fs)[0](x);
        expect(dg4_0).closeTo((dg3_05 - dg3_n05) / dx, 1E-6)

        expect((stateVariables["/zero1"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero2"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero3"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero4"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero5"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero6"].stateValues.fs)[0](x)).eq(0)

      }
    })
  })

  it('derivatives of interpolated function with changed variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <function name="f" variables="x" maxima="(5,-3)" minima="(-5,3)" />
      <function name="g" styleNumber="2" variables="y" >$f</function>
    
      <derivative name="df1">$f</derivative>
      <derivative name="dg1" styleNumber="2">$g</derivative>
    
      <derivative name="df1b" derivVariables="x">$f</derivative>
      <derivative name="zero1" derivVariables="x" styleNumber="2">$g</derivative>
    
      <derivative name="zero2" derivVariables="y">$f</derivative>
      <derivative name="dg1b" derivVariables="y" styleNumber="2">$g</derivative>
    
      <derivative name="df2" derivVariables="x x">$f</derivative>
      <derivative name="dg2" derivVariables="y y" styleNumber="2">$g</derivative>
    
      <derivative name="df2b" derivVariables="x"><derivative derivVariables="x">$f</derivative></derivative>
      <derivative name="dg2b" derivVariables="y" styleNumber="2"><derivative derivVariables="y">$g</derivative></derivative>

      <derivative name="zero3" derivVariables="x y">$f</derivative>
      <derivative name="zero4" derivVariables="x y" styleNumber="2">$g</derivative>

      <derivative name="zero5" derivVariables="y x">$f</derivative>
      <derivative name="zero6" derivVariables="y x" styleNumber="2">$g</derivative>

      <derivative name="df3" derivVariables="x x x">$f</derivative>
      <derivative name="dg3" derivVariables="y y y" styleNumber="2">$g</derivative>
    
      <derivative name="df4" derivVariables="x x x x">$f</derivative>
      <derivative name="dg4" derivVariables="y y y y" styleNumber="2">$g</derivative>
      
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let dx = 0.0001;

      // make sure we don't get within dx of a grid point
      for (let x = -10.02412412; x <= 10; x += 0.5) {

        let f_0 = (stateVariables["/f"].stateValues.fs)[0](x);
        let f_1 = (stateVariables["/f"].stateValues.fs)[0](x + dx);
        let df1_05 = (stateVariables["/df1"].stateValues.fs)[0](x + dx / 2);
        let df1b_05 = (stateVariables["/df1b"].stateValues.fs)[0](x + dx / 2);
        expect(df1_05).closeTo((f_1 - f_0) / dx, 1E-6);
        expect(df1b_05).eq(df1_05);

        let dg1_05 = (stateVariables["/dg1"].stateValues.fs)[0](x + dx / 2);
        let dg1b_05 = (stateVariables["/dg1b"].stateValues.fs)[0](x + dx / 2);
        expect(dg1_05).eq(dg1_05);
        expect(dg1b_05).eq(dg1_05);


        let df1_n05 = (stateVariables["/df1"].stateValues.fs)[0](x - dx / 2);
        let df2_0 = (stateVariables["/df2"].stateValues.fs)[0](x);
        expect(df2_0).closeTo((df1b_05 - df1_n05) / dx, 1E-6)

        let dg2_0 = (stateVariables["/dg2"].stateValues.fs)[0](x);
        expect(dg2_0).eq(df2_0)

        let df2b_0 = (stateVariables["/df2b"].stateValues.fs)[0](x);
        expect(df2b_0).eq(df2_0)

        let dg2b_0 = (stateVariables["/dg2b"].stateValues.fs)[0](x);
        expect(dg2b_0).eq(dg2_0)

        let df2_1 = (stateVariables["/df2"].stateValues.fs)[0](x + dx);
        let df3_05 = (stateVariables["/df3"].stateValues.fs)[0](x + dx / 2);
        expect(df3_05).closeTo((df2_1 - df2_0) / dx, 1E-6)

        let dg3_05 = (stateVariables["/dg3"].stateValues.fs)[0](x + dx / 2);
        expect(dg3_05).eq(df3_05)

        let df3_n05 = (stateVariables["/df3"].stateValues.fs)[0](x - dx / 2);
        let df4_0 = (stateVariables["/df4"].stateValues.fs)[0](x);
        expect(df4_0).closeTo((df3_05 - df3_n05) / dx, 1E-6)

        let dg4_0 = (stateVariables["/dg4"].stateValues.fs)[0](x);
        expect(dg4_0).eq(df4_0)

        expect((stateVariables["/zero1"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero2"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero3"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero4"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero5"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero6"].stateValues.fs)[0](x)).eq(0)

      }
    })
  })

  it('derivatives of interpolated function with changed variables, subscript', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <function name="f" variables="x_1" maxima="(5,-3)" minima="(-5,3)" />
      <function name="g" styleNumber="2" variables="x_2" >$f</function>
    
      <derivative name="df1">$f</derivative>
      <derivative name="dg1" styleNumber="2">$g</derivative>
    
      <derivative name="df1b" derivVariables="x_1">$f</derivative>
      <derivative name="zero1" derivVariables="x_1" styleNumber="2">$g</derivative>
    
      <derivative name="zero2" derivVariables="x_2">$f</derivative>
      <derivative name="dg1b" derivVariables="x_2" styleNumber="2">$g</derivative>
    
      <derivative name="df2" derivVariables="x_1 x_1">$f</derivative>
      <derivative name="dg2" derivVariables="x_2 x_2" styleNumber="2">$g</derivative>
    
      <derivative name="df2b" derivVariables="x_1"><derivative derivVariables="x_1">$f</derivative></derivative>
      <derivative name="dg2b" derivVariables="x_2" styleNumber="2"><derivative derivVariables="x_2">$g</derivative></derivative>

      <derivative name="zero3" derivVariables="x_1 x_2">$f</derivative>
      <derivative name="zero4" derivVariables="x_1 x_2" styleNumber="2">$g</derivative>

      <derivative name="zero5" derivVariables="x_2 x_1">$f</derivative>
      <derivative name="zero6" derivVariables="x_2 x_1" styleNumber="2">$g</derivative>

      <derivative name="df3" derivVariables="x_1 x_1 x_1">$f</derivative>
      <derivative name="dg3" derivVariables="x_2 x_2 x_2" styleNumber="2">$g</derivative>
    
      <derivative name="df4" derivVariables="x_1 x_1 x_1 x_1">$f</derivative>
      <derivative name="dg4" derivVariables="x_2 x_2 x_2 x_2" styleNumber="2">$g</derivative>
    
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let dx = 0.0001;

      // make sure we don't get within dx of a grid point
      for (let x = -10.02412412; x <= 10; x += 0.5) {

        let f_0 = (stateVariables["/f"].stateValues.fs)[0](x);
        let f_1 = (stateVariables["/f"].stateValues.fs)[0](x + dx);
        let df1_05 = (stateVariables["/df1"].stateValues.fs)[0](x + dx / 2);
        let df1b_05 = (stateVariables["/df1b"].stateValues.fs)[0](x + dx / 2);
        expect(df1_05).closeTo((f_1 - f_0) / dx, 1E-6);
        expect(df1b_05).eq(df1_05);

        let dg1_05 = (stateVariables["/dg1"].stateValues.fs)[0](x + dx / 2);
        let dg1b_05 = (stateVariables["/dg1b"].stateValues.fs)[0](x + dx / 2);
        expect(dg1_05).eq(dg1_05);
        expect(dg1b_05).eq(dg1_05);


        let df1_n05 = (stateVariables["/df1"].stateValues.fs)[0](x - dx / 2);
        let df2_0 = (stateVariables["/df2"].stateValues.fs)[0](x);
        expect(df2_0).closeTo((df1b_05 - df1_n05) / dx, 1E-6)

        let dg2_0 = (stateVariables["/dg2"].stateValues.fs)[0](x);
        expect(dg2_0).eq(df2_0)

        let df2b_0 = (stateVariables["/df2b"].stateValues.fs)[0](x);
        expect(df2b_0).eq(df2_0)

        let dg2b_0 = (stateVariables["/dg2b"].stateValues.fs)[0](x);
        expect(dg2b_0).eq(dg2_0)

        let df2_1 = (stateVariables["/df2"].stateValues.fs)[0](x + dx);
        let df3_05 = (stateVariables["/df3"].stateValues.fs)[0](x + dx / 2);
        expect(df3_05).closeTo((df2_1 - df2_0) / dx, 1E-6)

        let dg3_05 = (stateVariables["/dg3"].stateValues.fs)[0](x + dx / 2);
        expect(dg3_05).eq(df3_05)

        let df3_n05 = (stateVariables["/df3"].stateValues.fs)[0](x - dx / 2);
        let df4_0 = (stateVariables["/df4"].stateValues.fs)[0](x);
        expect(df4_0).closeTo((df3_05 - df3_n05) / dx, 1E-6)

        let dg4_0 = (stateVariables["/dg4"].stateValues.fs)[0](x);
        expect(dg4_0).eq(df4_0)

        expect((stateVariables["/zero1"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero2"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero3"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero4"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero5"].stateValues.fs)[0](x)).eq(0)
        expect((stateVariables["/zero6"].stateValues.fs)[0](x)).eq(0)

      }
    })
  })

  it('extrema of derivative', () => {
    cy.window().then(async (win) => {
      win.postMessage({
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
    <function name="f" variables="$x">$formula</function>
    </m></p>

    <p><m>f'($x) =
    <derivative name="fp">$f</derivative>
    </m></p>

    <p>again, <m>f'($x) = <copy target="fp" name="fp2" />
    </m></p>


    <p>Number of minima of f': <copy prop="numberminima" assignNames="nMinima" target="fp" /></p>
    <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min1 min2"><copy prop="minima" target="fp" /></extract></p> 

    <p>Number of maxima of f': <copy prop="numbermaxima" assignNames="nMaxima" target="fp" /></p>
    <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max1 max2"><copy prop="maxima" target="fp" /></extract></p> 

    <p>To repeat:</p>
    <p>Number of minima of f': <copy prop="numberminima" assignNames="nMinima2" target="fp2" /></p>
    <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min12 min22"><copy prop="minima" target="fp2" /></extract></p> 

    <p>Number of maxima of f': <copy prop="numbermaxima" assignNames="nMaxima2" target="fp2" /></p>
    <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max12 max22"><copy prop="maxima" target="fp2" /></extract></p> 


    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  // to wait until loaded


    function fp(x, c1, c2, c3, c4, c5) {
      return c1 * x ** 4 / 4 - c1 * (c2 + c3 + c4) * x ** 3 / 3 + c1 * (c2 * c3 + c2 * c4 + c3 * c4) * x ** 2 / 2 - c1 * c2 * c3 * c4 * x + c5;
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

        expect(stateVariables[""])

        cy.get('#\\/nMinima').should('have.text', nMinima.toString())
        cy.get('#\\/nMinima2').should('have.text', nMinima.toString())
        cy.get('#\\/min1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.replace(/−/g, '-').trim()).equal(`(${minima[0][0]},${me.math.round(minima[0][1], 5)})`)
        })
        cy.get('#\\/min12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.replace(/−/g, '-').trim()).equal(`(${minima[0][0]},${me.math.round(minima[0][1], 5)})`)
        })
        if (nMinima === 2) {
          cy.get('#\\/min2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.replace(/−/g, '-').trim()).equal(`(${minima[1][0]},${me.math.round(minima[1][1], 5)})`)
          })
          cy.get('#\\/min22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.replace(/−/g, '-').trim()).equal(`(${minima[1][0]},${me.math.round(minima[1][1], 5)})`)
          })
        } else {
          cy.get('#\\/min2').should('not.exist')
          cy.get('#\\/min22').should('not.exist')
        }
        cy.get('#\\/nMaxima').should('have.text', nMaxima.toString())
        cy.get('#\\/nMaxima2').should('have.text', nMaxima.toString())
        cy.get('#\\/max1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.replace(/−/g, '-').trim()).equal(`(${maxima[0][0]},${me.math.round(maxima[0][1], 5)})`)
        })
        cy.get('#\\/max12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.replace(/−/g, '-').trim()).equal(`(${maxima[0][0]},${me.math.round(maxima[0][1], 5)})`)
        })
        if (nMaxima === 2) {
          cy.get('#\\/max2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.replace(/−/g, '-').trim()).equal(`(${maxima[1][0]},${me.math.round(maxima[1][1], 5)})`)
          })
          cy.get('#\\/max22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.replace(/−/g, '-').trim()).equal(`(${maxima[1][0]},${me.math.round(maxima[1][1], 5)})`)
          })
        } else {
          cy.get('#\\/max2').should('not.exist')
          cy.get('#\\/max22').should('not.exist')
        }
      }

      let c1 = 1, c2 = 1, c3 = 3, c4 = 4, c5 = 5, c6 = 1, v = 'x';

      verifyExtrema(c1, c2, c3, c4, c5)

      cy.window().then(async (win) => {

        c1 = 3;
        cy.get(cesc('#/c_1') + ' textarea').type(`{end}{backspace}{backspace}${c1}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5)

        c2 = -5;
        cy.get(cesc('#/c_2') + ' textarea').type(`{end}{backspace}{backspace}${c2}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5)

        c3 = 1;
        cy.get(cesc('#/c_3') + ' textarea').type(`{end}{backspace}{backspace}${c3}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5)

        c4 = -6;
        cy.get(cesc('#/c_4') + ' textarea').type(`{end}{backspace}{backspace}${c4}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5)

        c5 = 3;
        cy.get(cesc('#/c_5') + ' textarea').type(`{end}{backspace}{backspace}${c5}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5)

        c6 = 2;
        cy.get(cesc('#/c_6') + ' textarea').type(`{end}{backspace}{backspace}${c6}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5)

        v = 'y';
        cy.get(cesc('#/x') + ' textarea').type(`{end}{backspace}{backspace}${v}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5)


      })


      cy.window().then(async (win) => {

        c1 = 2;
        cy.get(cesc('#/c_1') + ' textarea').type(`{end}{backspace}{backspace}${c1}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5);

        c2 = 4;
        cy.get(cesc('#/c_2') + ' textarea').type(`{end}{backspace}{backspace}${c2}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5);

        c3 = -8;
        cy.get(cesc('#/c_3') + ' textarea').type(`{end}{backspace}{backspace}${c3}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5);

        c4 = 9;
        cy.get(cesc('#/c_4') + ' textarea').type(`{end}{backspace}{backspace}${c4}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5);

        c5 = -2;
        cy.get(cesc('#/c_5') + ' textarea').type(`{end}{backspace}{backspace}${c5}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5);

        c6 = 6;
        cy.get(cesc('#/c_6') + ' textarea').type(`{end}{backspace}{backspace}${c6}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5);

        v = 'q';
        cy.get(cesc('#/x') + ' textarea').type(`{end}{backspace}{backspace}${v}{enter}`, { force: true });
        verifyExtrema(c1, c2, c3, c4, c5)

      })

    })



  })

  it('extrema of derivative of interpolated function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <graph>
        <function name="f" minima="(-5,-3) (0,-5)" maxima="(-3,0) (6,8)" />
        <derivative name="fp" stylenumber="2"><copy target="f"/></derivative>
      </graph>

      <copy target="fp" name="fp2" />

      <p>Number of minima of f': <copy prop="numberminima" assignNames="nMinima" target="fp" /></p>
      <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min1 min2"><copy prop="minima" target="fp" /></extract></p> 
  
      <p>Number of maxima of f': <copy prop="numbermaxima" assignNames="nMaxima" target="fp" /></p>
      <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max1 max2"><copy prop="maxima" target="fp" /></extract></p> 
  
      <p>To repeat:</p>
      <p>Number of minima of f': <copy prop="numberminima" assignNames="nMinima2" target="fp2" /></p>
      <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min12 min22"><copy prop="minima" target="fp2" /></extract></p> 
  
      <p>Number of maxima of f': <copy prop="numbermaxima" assignNames="nMaxima2" target="fp2" /></p>
      <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max12 max22"><copy prop="maxima" target="fp2" /></extract></p> 
  
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/nMinima').should('have.text', '1')
    cy.get('#\\/nMinima2').should('have.text', '1')

    cy.get('#\\/nMaxima').should('have.text', '2')
    cy.get('#\\/nMaxima2').should('have.text', '2')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let fp = stateVariables["/fp"].stateValues.numericalf;

      let max1x = (-5 - 3) / 2
      cy.get('#\\/max1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${max1x},${me.math.round(fp(max1x), 5)})`)
      })
      cy.get('#\\/max12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${max1x},${me.math.round(fp(max1x), 5)})`)
      })

      let min1x = (-3 + 0) / 2
      cy.get('#\\/min1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${min1x},${me.math.round(fp(min1x), 5)})`)
      })
      cy.get('#\\/min12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${min1x},${me.math.round(fp(min1x), 5)})`)
      })

      let max2x = (0 + 6) / 2
      cy.get('#\\/max2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${max2x},${me.math.round(fp(max2x), 5)})`)
      })
      cy.get('#\\/max22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${max2x},${me.math.round(fp(max2x), 5)})`)
      })


    })
  })

})
