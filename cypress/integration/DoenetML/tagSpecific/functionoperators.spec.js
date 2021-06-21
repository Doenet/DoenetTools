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
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function name="original">x^3</function>
    <clampfunction name="clamp01"><copy tname="original" /></clampfunction>
    <clampfunction name="clampn35" lowervalue="-3" uppervalue="5"><copy tname="original" /></clampfunction>

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
      <copy tname="_map2" name="m4" />
    </aslist></p>
    <p><aslist>
      <copy tname="_map3" name="m5" />
    </aslist></p>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map1ReplacementAnchors = map1Replacements.map(x => cesc('#' + x.componentName))
      let map2Replacements = components["/_map2"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map2ReplacementAnchors = map2Replacements.map(x => cesc('#' + x.componentName))
      let map3Replacements = components["/_map3"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map3ReplacementAnchors = map3Replacements.map(x => cesc('#' + x.componentName))
      let map4Replacements = components["/m4"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map4ReplacementAnchors = map4Replacements.map(x => cesc('#' + x.componentName))
      let map5Replacements = components["/m5"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
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


      cy.window().then((win) => {
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
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <function name="original">x^3</function>
    <wrapfunctionperiodic name="wrap01"><copy tname="original" /></wrapfunctionperiodic>
    <wrapfunctionperiodic name="wrapn23" lowervalue="-2" uppervalue="3"><copy tname="original" /></wrapfunctionperiodic>

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
      <copy tname="_map2" name="m4" />
    </aslist></p>
    <p><aslist>
      <copy tname="_map3" name="m5" />
    </aslist></p>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let map1Replacements = components["/_map1"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map1ReplacementAnchors = map1Replacements.map(x => cesc('#' + x.componentName))
      let map2Replacements = components["/_map2"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map2ReplacementAnchors = map2Replacements.map(x => cesc('#' + x.componentName))
      let map3Replacements = components["/_map3"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map3ReplacementAnchors = map3Replacements.map(x => cesc('#' + x.componentName))
      let map4Replacements = components["/m4"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let map4ReplacementAnchors = map4Replacements.map(x => cesc('#' + x.componentName))
      let map5Replacements = components["/m5"].replacements.reduce((a, c) => [...a, ...c.replacements], []);
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

      cy.window().then((win) => {
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
    cy.window().then((win) => {
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
    <function name="f" variable="$x" formula="$formula" />
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



    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = 3, y1 = Math.sin(4);
      let x2 = 3, y2 = Math.cos(4);

      expect(components["/f"].stateValues.formula.toString()).eq('sin(x + 1)');
      expect(components["/g"].stateValues.formula.toString()).eq('cos(x + 1)');
      expect(components["/_point1"].stateValues.xs[0].tree).closeTo(x1, 1E-12);
      expect(components["/_point1"].stateValues.xs[1].tree).closeTo(y1, 1E-12);
      expect(components["/_point2"].stateValues.xs[0].tree).closeTo(x2, 1E-12);
      expect(components["/_point2"].stateValues.xs[1].tree).closeTo(y2, 1E-12);

    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x1 = -3, y1 = Math.sin(-2);
      let x2 = 5, y2 = Math.cos(6);

      components["/_point1"].movePoint({ x: x1, y: y1 })
      components["/_point2"].movePoint({ x: x2, y: y2 })

      expect(components["/f"].stateValues.formula.toString()).eq('sin(x + 1)');
      expect(components["/g"].stateValues.formula.toString()).eq('cos(x + 1)');
      expect(components["/_point1"].stateValues.xs[0].tree).closeTo(x1, 1E-12);
      expect(components["/_point1"].stateValues.xs[1].tree).closeTo(y1, 1E-12);
      expect(components["/_point2"].stateValues.xs[0].tree).closeTo(x2, 1E-12);
      expect(components["/_point2"].stateValues.xs[1].tree).closeTo(y2, 1E-12);

    })


    cy.get(cesc('#/a') + ' textarea').type(`{end}{backspace}2`, { force: true });
    cy.get(cesc('#/b') + ' textarea').type(`{end}{backspace}pi`, { force: true });
    cy.get(cesc('#/c') + ' textarea').type(`{end}{backspace}e`, { force: true });
    cy.get(cesc('#/x') + ' textarea').type(`{end}{backspace}q`, { force: true }).blur();


    cy.get(cesc('#/_m5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(q)=2sin(e+πq)')
    });
    cy.get(cesc('#/_m6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal("f′(q)=2πcos(e+πq)")
    });


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = -3, y1 = 2 * Math.sin(Math.PI * -3 + Math.E);
      let x2 = 5, y2 = 2 * Math.PI * Math.cos(Math.PI * 5 + Math.E);

      expect(components["/f"].stateValues.formula.toString()).eq('2 sin(e + π q)');
      expect(components["/g"].stateValues.formula.toString()).eq('2 π cos(e + π q)');
      expect(components["/_point1"].stateValues.xs[0].tree).closeTo(x1, 1E-12);
      expect(components["/_point1"].stateValues.xs[1].tree).closeTo(y1, 1E-12);
      expect(components["/_point2"].stateValues.xs[0].tree).closeTo(x2, 1E-12);
      expect(components["/_point2"].stateValues.xs[1].tree).closeTo(y2, 1E-12);

    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x1 = 9, y1 = 2 * Math.sin(Math.PI * 9 + Math.E);
      let x2 = -7, y2 = 2 * Math.PI * Math.cos(Math.PI * -7 + Math.E);

      components["/_point1"].movePoint({ x: x1, y: y1 })
      components["/_point2"].movePoint({ x: x2, y: y2 })

      expect(components["/f"].stateValues.formula.toString()).eq('2 sin(e + π q)');
      expect(components["/g"].stateValues.formula.toString()).eq('2 π cos(e + π q)');
      expect(components["/_point1"].stateValues.xs[0].tree).closeTo(x1, 1E-12);
      expect(components["/_point1"].stateValues.xs[1].tree).closeTo(y1, 1E-12);
      expect(components["/_point2"].stateValues.xs[0].tree).closeTo(x2, 1E-12);
      expect(components["/_point2"].stateValues.xs[1].tree).closeTo(y2, 1E-12);

    })


  })

  it('derivative 2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <function name="f1">sin(x)</function>
      <function name="f2" variable="y">e^(2y)</function>
      <function name="f3">xyz</function>
      <function name="f4" variable="z">xyz</function>
      <derivative name="d1"><function>x^2</function></derivative>
      <derivative name="d2"><math>x^2</math></derivative>
      <derivative name="d3"><function formula="x^2sin(z)" /></derivative>
      <derivative name="d4" variable="z">x^2sin(z)</derivative>
      <derivative name="d5"><copy tname="f1" /></derivative>
      <derivative name="d6"><copy tname="f2" /></derivative>
      <derivative name="d7"><copy tname="f3" /></derivative>
      <derivative name="d8"><copy tname="f4" /></derivative>
      <derivative variable="q" name="d9"><copy tname="f1" /></derivative>
      <derivative variable="q" name="d10"><copy tname="f2" /></derivative>
      <derivative variable="q" name="d11"><copy tname="f3" /></derivative>
      <derivative variable="q" name="d12"><copy tname="f4" /></derivative>
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/d1'].stateValues.formula.equals(me.fromText("2x"))).eq(true);
      expect(components['/d2'].stateValues.formula.equals(me.fromText("2x"))).eq(true);
      expect(components['/d3'].stateValues.formula.equals(me.fromText("2x sin(z)"))).eq(true);
      expect(components['/d4'].stateValues.formula.equals(me.fromText("x^2cos(z)"))).eq(true);
      expect(components['/d5'].stateValues.formula.equals(me.fromText("cos(x)"))).eq(true);
      expect(components['/d6'].stateValues.formula.equals(me.fromText("2e^(2y)"))).eq(true);
      expect(components['/d7'].stateValues.formula.equals(me.fromText("yz"))).eq(true);
      expect(components['/d8'].stateValues.formula.equals(me.fromText("xy"))).eq(true);
      expect(components['/d9'].stateValues.formula.equals(me.fromText("cos(x)"))).eq(true);
      expect(components['/d10'].stateValues.formula.equals(me.fromText("2e^(2y)"))).eq(true);
      expect(components['/d11'].stateValues.formula.equals(me.fromText("yz"))).eq(true);
      expect(components['/d12'].stateValues.formula.equals(me.fromText("xy"))).eq(true);
    })
  })

  // check to make sure fixed bug where wasn't displaying inside <m>
  it('derivative displayed inside <m>', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>Let <m>f(x) = <function name="f">sin(x)</function></m>.  
      Then <m>f'(x) = <derivative><copy tname="f" /></derivative></m>.</p>
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
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <graph>
        <function minima='(3,4)' />
        <derivative><copy tname="_function1"/></derivative>
        <derivative><copy tname="_derivative1"/></derivative>
        <derivative><copy tname="_derivative2"/></derivative>
        <derivative><copy tname="_derivative3"/></derivative>
        <derivative><copy tname="_derivative4"/></derivative>
        <derivative><copy tname="_derivative5"/></derivative>
      </graph>
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded



    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      for (let x = -10; x <= 10; x += 0.5) {
        expect(components["/_function1"].stateValues.f(x)).eq((x - 3) ** 2 + 4);
        expect(components["/_derivative1"].stateValues.f(x)).eq(2 * (x - 3));
        expect(components["/_derivative2"].stateValues.f(x)).eq(2);
        expect(components["/_derivative3"].stateValues.f(x)).eq(0);
        expect(components["/_derivative4"].stateValues.f(x)).eq(0);
        expect(components["/_derivative5"].stateValues.f(x)).eq(0);
        expect(components["/_derivative6"].stateValues.f(x)).eq(0);

      }
    })
  })

  it('derivatives of interpolated function 2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <graph>
        <function minima="(3,4)" through="(-1,5)(4,2)" maxima="(1,0)" />
        <derivative stylenumber="2"><copy tname="_function1"/></derivative>
        <derivative stylenumber="3"><copy tname="_derivative1"/></derivative>
        <derivative stylenumber="4"><copy tname="_derivative2"/></derivative>
        <derivative stylenumber="5"><copy tname="_derivative3"/></derivative>
      </graph>
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let dx = 0.0001;

      // make sure we don't get within dx of a grid point
      for (let x = -10.02412412; x <= 10; x += 0.5) {

        let f0 = components["/_function1"].stateValues.f(x);
        let f1 = components["/_function1"].stateValues.f(x + dx);
        let fp05 = components["/_derivative1"].stateValues.f(x + dx / 2);
        expect(fp05).closeTo((f1 - f0) / dx, 1E-6)

        let fpn05 = components["/_derivative1"].stateValues.f(x - dx / 2);
        let fpp0 = components["/_derivative2"].stateValues.f(x);
        expect(fpp0).closeTo((fp05 - fpn05) / dx, 1E-6)

        let fpp1 = components["/_derivative2"].stateValues.f(x + dx);
        let fppp05 = components["/_derivative3"].stateValues.f(x + dx / 2);
        expect(fppp05).closeTo((fpp1 - fpp0) / dx, 1E-6)

        let fpppn05 = components["/_derivative3"].stateValues.f(x - dx / 2);
        let fpppp0 = components["/_derivative4"].stateValues.f(x);
        expect(fpppp0).closeTo((fppp05 - fpppn05) / dx, 1E-6)

      }
    })
  })

  it('extrema of derivative', () => {
    cy.window().then((win) => {
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
    <function name="f" variable="$x" formula="$formula" />
    </m></p>

    <p><m>f'($x) =
    <derivative name="fp">$f</derivative>
    </m></p>

    <p>again, <m>f'($x) = <copy tname="fp" name="fp2" />
    </m></p>


    <p>Number of minima of f': <copy prop="numberminima" assignNames="nMinima" tname="fp" /></p>
    <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min1 min2"><copy prop="minima" tname="fp" /></extract></p> 

    <p>Number of maxima of f': <copy prop="numbermaxima" assignNames="nMaxima" tname="fp" /></p>
    <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max1 max2"><copy prop="maxima" tname="fp" /></extract></p> 

    <p>To repeat:</p>
    <p>Number of minima of f': <copy prop="numberminima" assignNames="nMinima2" tname="fp2" /></p>
    <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min12 min22"><copy prop="minima" tname="fp2" /></extract></p> 

    <p>Number of maxima of f': <copy prop="numbermaxima" assignNames="nMaxima2" tname="fp2" /></p>
    <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max12 max22"><copy prop="maxima" tname="fp2" /></extract></p> 


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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      function verifyExtrema(c1, c2, c3, c4, c5) {
        let minima = fpMinima(c1, c2, c3, c4, c5);
        let nMinima = minima.length;
        let maxima = fpMaxima(c1, c2, c3, c4, c5);
        let nMaxima = maxima.length;

        expect(components[""])

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

      cy.window().then((win) => {

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


      cy.window().then((win) => {

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
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <graph>
        <function name="f" minima="(-5,-3) (0,-5)" maxima="(-3,0) (6,8)" />
        <derivative name="fp" stylenumber="2"><copy tname="f"/></derivative>
      </graph>

      <copy tname="fp" name="fp2" />

      <p>Number of minima of f': <copy prop="numberminima" assignNames="nMinima" tname="fp" /></p>
      <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min1 min2"><copy prop="minima" tname="fp" /></extract></p> 
  
      <p>Number of maxima of f': <copy prop="numbermaxima" assignNames="nMaxima" tname="fp" /></p>
      <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max1 max2"><copy prop="maxima" tname="fp" /></extract></p> 
  
      <p>To repeat:</p>
      <p>Number of minima of f': <copy prop="numberminima" assignNames="nMinima2" tname="fp2" /></p>
      <p>Minima of f': <extract prop="coords" displayDecimals="5" assignNames="min12 min22"><copy prop="minima" tname="fp2" /></extract></p> 
  
      <p>Number of maxima of f': <copy prop="numbermaxima" assignNames="nMaxima2" tname="fp2" /></p>
      <p>Maxima of f': <extract prop="coords" displayDecimals="5" assignNames="max12 max22"><copy prop="maxima" tname="fp2" /></extract></p> 
  
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/nMinima').should('have.text', '1')
    cy.get('#\\/nMinima2').should('have.text', '1')

    cy.get('#\\/nMaxima').should('have.text', '2')
    cy.get('#\\/nMaxima2').should('have.text', '2')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let fp = components["/fp"].stateValues.numericalf;

      let max1x = (-5-3)/2
      cy.get('#\\/max1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${max1x},${me.math.round(fp(max1x), 5)})`)
      })
      cy.get('#\\/max12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${max1x},${me.math.round(fp(max1x), 5)})`)
      })

      let min1x = (-3+0)/2
      cy.get('#\\/min1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${min1x},${me.math.round(fp(min1x), 5)})`)
      })
      cy.get('#\\/min12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${min1x},${me.math.round(fp(min1x), 5)})`)
      })

      let max2x = (0+6)/2
      cy.get('#\\/max2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${max2x},${me.math.round(fp(max2x), 5)})`)
      })
      cy.get('#\\/max22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-').trim()).equal(`(${max2x},${me.math.round(fp(max2x), 5)})`)
      })


    })
  })

})
