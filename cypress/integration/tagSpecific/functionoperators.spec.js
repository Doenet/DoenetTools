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
    cy.visit('/test')

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
      <template newNamespace><evaluate><copy tname="../original" /><copySource/></evaluate></template>
      <sources><sequence step="0.2">-2,2</sequence></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace><evaluate><copy tname="../clamp01" /><copySource/></evaluate></template>
      <sources><sequence step="0.2">-2,2</sequence></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace><evaluate><copy tname="../clampn35" /><copySource/></evaluate></template>
      <sources><sequence step="0.2">-2,2</sequence></sources>
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
      let map1Replacements = components["/_map1"].replacements.reduce((a,c) => [...a,...c.replacements],[]);
      let map1ReplacementAnchors = map1Replacements.map(x => cesc('#' + x.componentName))
      let map2Replacements = components["/_map2"].replacements.reduce((a,c) => [...a,...c.replacements],[]);
      let map2ReplacementAnchors = map2Replacements.map(x => cesc('#' + x.componentName))
      let map3Replacements = components["/_map3"].replacements.reduce((a,c) => [...a,...c.replacements],[]);
      let map3ReplacementAnchors = map3Replacements.map(x => cesc('#' + x.componentName))
      let map4Replacements = components["/m4"].replacements.reduce((a,c) => [...a,...c.replacements],[]);
      let map4ReplacementAnchors = map4Replacements.map(x => cesc('#' + x.componentName))
      let map5Replacements = components["/m5"].replacements.reduce((a,c) => [...a,...c.replacements],[]);
      let map5ReplacementAnchors = map5Replacements.map(x => cesc('#' + x.componentName))

      let clamp01 = x => Math.min(1, Math.max(0, x));
      let clampn35 = x => Math.min(5, Math.max(-3, x));
      let indToVal = ind => me.math.round((0.2 * (ind - 11)) ** 3, 8);

      for (let i = 1; i <= 21; i++) {
        cy.get(map1ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace('−', '-')).equal(indToVal(i).toString())
        });

        cy.get(map2ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace('−', '-')).equal(clamp01(indToVal(i)).toString())
        });

        cy.get(map3ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace('−', '-')).equal(clampn35(indToVal(i)).toString())
        });

        cy.get(map4ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace('−', '-')).equal(clamp01(indToVal(i)).toString())
        });

        cy.get(map5ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace('−', '-')).equal(clampn35(indToVal(i)).toString())
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
      <template newNamespace><evaluate><copy tname="../original" /><copySource/></evaluate></template>
      <sources><sequence step="0.2">-2,2</sequence></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace><evaluate><copy tname="../wrap01" /><copySource/></evaluate></template>
      <sources><sequence step="0.2">-2,2</sequence></sources>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template newNamespace><evaluate><copy tname="../wrapn23" /><copySource/></evaluate></template>
      <sources><sequence step="0.2">-2,2</sequence></sources>
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
      let map1Replacements = components["/_map1"].replacements.reduce((a,c) => [...a,...c.replacements],[]);
      let map1ReplacementAnchors = map1Replacements.map(x => cesc('#' + x.componentName))
      let map2Replacements = components["/_map2"].replacements.reduce((a,c) => [...a,...c.replacements],[]);
      let map2ReplacementAnchors = map2Replacements.map(x => cesc('#' + x.componentName))
      let map3Replacements = components["/_map3"].replacements.reduce((a,c) => [...a,...c.replacements],[]);
      let map3ReplacementAnchors = map3Replacements.map(x => cesc('#' + x.componentName))
      let map4Replacements = components["/m4"].replacements.reduce((a,c) => [...a,...c.replacements],[]);
      let map4ReplacementAnchors = map4Replacements.map(x => cesc('#' + x.componentName))
      let map5Replacements = components["/m5"].replacements.reduce((a,c) => [...a,...c.replacements],[]);
      let map5ReplacementAnchors = map5Replacements.map(x => cesc('#' + x.componentName))

      let wrap01 = x => me.math.round(me.math.mod(x, 1), 8);
      let wrapn23 = x => me.math.round(-2 + me.math.mod(x + 2, 5), 8);
      let indToVal = ind => me.math.round((0.2 * (ind - 11)) ** 3, 8);

      for (let i = 1; i <= 21; i++) {
        cy.get(map1ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace('−', '-')).equal(indToVal(i).toString())
        });

        cy.get(map2ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace('−', '-')).equal(wrap01(indToVal(i)).toString())
        });

        cy.get(map3ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace('−', '-')).equal(wrapn23(indToVal(i)).toString())
        });

        cy.get(map4ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace('−', '-')).equal(wrap01(indToVal(i)).toString())
        });

        cy.get(map5ReplacementAnchors[i - 1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace('−', '-')).equal(wrapn23(indToVal(i)).toString())
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

    <p><m>f(<copy prop="value" tname="x"/>) =
    <function name="f">
      <variable><copy prop="value" tname="x" /></variable>
      <formula simplify>
        <copy prop="value" tname="a"/>
         sin(<copy prop="value" tname="b"/><copy prop="value" tname="x"/> + <copy prop="value" tname="c"/>)
      </formula>
    </function>
    </m></p>

    <p><m>f'(<copy prop="value" tname="x"/>) =
    <derivative name="g"><copy tname="f"/></derivative>
    </m></p>

    <graph>
      <copy tname="f"/>
      <copy tname="g"/>
      <point>
        <constrainTo><copy tname="f" /></constrainTo>
        (3,4)
      </point>
      <point>
        <constrainTo><copy tname="g" /></constrainTo>
        (3,4)
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


    cy.get(cesc('#/a_input')).clear().type(`2`);
    cy.get(cesc('#/b_input')).clear().type(`pi`);
    cy.get(cesc('#/c_input')).clear().type(`e`);
    cy.get(cesc('#/x_input')).clear().type(`q`).blur();


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
      <derivative name="d1">x^2</derivative>
      <derivative name="d2"><math>x^2</math></derivative>
      <derivative name="d3">x^2sin(z)</derivative>
      <derivative variable="z" name="d4">x^2sin(z)</derivative>
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

  it('derivative displayed inside <m>', () => {
    // check to make fixed bug where wasn't displaying inside <m>
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
        <function>
          <minimum>(3,4)</minimum>
        </function>
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
        expect(components["/_function1"].stateValues.numericalf(x)).eq((x - 3) ** 2 + 4);
        expect(components["/_derivative1"].stateValues.numericalf(x)).eq(2 * (x - 3));
        expect(components["/_derivative2"].stateValues.numericalf(x)).eq(2);
        expect(components["/_derivative3"].stateValues.numericalf(x)).eq(0);
        expect(components["/_derivative4"].stateValues.numericalf(x)).eq(0);
        expect(components["/_derivative5"].stateValues.numericalf(x)).eq(0);
        expect(components["/_derivative6"].stateValues.numericalf(x)).eq(0);

      }
    })
  })

  it('derivatives of interpolated function 2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <graph>
        <function>
          <minimum>(3,4)</minimum>
          <through>(-1,5),(4,2)</through>
          <maximum>(1,0)</maximum>
        </function>
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

        let f0 = components["/_function1"].stateValues.numericalf(x);
        let f1 = components["/_function1"].stateValues.numericalf(x + dx);
        let fp05 = components["/_derivative1"].stateValues.numericalf(x + dx / 2);
        expect(fp05).closeTo((f1 - f0) / dx, 1E-6)

        let fpn05 = components["/_derivative1"].stateValues.numericalf(x - dx / 2);
        let fpp0 = components["/_derivative2"].stateValues.numericalf(x);
        expect(fpp0).closeTo((fp05 - fpn05) / dx, 1E-6)

        let fpp1 = components["/_derivative2"].stateValues.numericalf(x + dx);
        let fppp05 = components["/_derivative3"].stateValues.numericalf(x + dx / 2);
        expect(fppp05).closeTo((fpp1 - fpp0) / dx, 1E-6)

        let fpppn05 = components["/_derivative3"].stateValues.numericalf(x - dx / 2);
        let fpppp0 = components["/_derivative4"].stateValues.numericalf(x);
        expect(fpppp0).closeTo((fppp05 - fpppn05) / dx, 1E-6)

      }
    })
  })


})
