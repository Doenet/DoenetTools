import me from 'math-expressions';

describe('Math Operator Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('sum', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <text>a</text>
      <sum name="numbers"><math>3</math><number>17</number><number>5-4</number></sum>
      <sum name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <ref>numbers</ref>
      <ref>vars</ref>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_ref1'].replacements[0];
      let replacement1Anchor = '#' + replacement1.componentName;
      let replacement2 = components['/_ref2'].replacements[0];
      let replacement2Anchor = '#' + replacement2.componentName;

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21')
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x+2y+z')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x+2y+z')
      });
      cy.window().then((win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(21);
        expect(components['/vars'].stateValues.value.tree).eqls(['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z']);
        expect(replacement1.stateValues.value.tree).eq(21);
        expect(replacement2.stateValues.value.tree).eqls(['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z']);
      })
    })
  })

  it('product', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <text>a</text>

      <product name="numbers"><math>3</math><number>17</number><number>5-4</number></product>
      <product name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <ref>numbers</ref>
      <ref>vars</ref>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_ref1'].replacements[0];
      let replacement1Anchor = '#' + replacement1.componentName;
      let replacement2 = components['/_ref2'].replacements[0];
      let replacement2Anchor = '#' + replacement2.componentName;

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('51')
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x(x+y)(x+y+z)')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('51')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x(x+y)(x+y+z)')
      });
      cy.window().then((win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(51);
        expect(components['/vars'].stateValues.value.tree).eqls(['*', 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]);
        expect(replacement1.stateValues.value.tree).eq(51);
        expect(replacement2.stateValues.value.tree).eqls(['*', 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]);
      })
    })
  })

  it('clamp number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <text>a</text>

      <clampNumber>55.3</clampNumber>
      <clampNumber>-55.3</clampNumber>
      <clampNumber>0.3</clampNumber>

      <clampNumber lowervalue="10" uppervalue="40">55.3</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">-55.3</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">12</clampNumber>

      <clampNumber lowervalue="10" uppervalue="40"><math>55.3</math></clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><number>-55.3</number></clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><number>12</number></clampNumber>

      <clampNumber lowervalue="10" uppervalue="40">x+y</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><math>x+y</math></clampNumber>

      <ref>_clampnumber1</ref>
      <ref>_clampnumber5</ref>
      <ref>_clampnumber9</ref>

      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_ref1'].replacements[0];
      let replacement1Anchor = '#' + replacement1.componentName;
      let replacement2 = components['/_ref2'].replacements[0];
      let replacement2Anchor = '#' + replacement2.componentName;
      let replacement3 = components['/_ref3'].replacements[0];
      let replacement3Anchor = '#' + replacement3.componentName;

      cy.get('#\\/_clampnumber1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/_clampnumber2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_clampnumber3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.3')
      });
      cy.get('#\\/_clampnumber4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('40')
      });
      cy.get('#\\/_clampnumber5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('10')
      });
      cy.get('#\\/_clampnumber6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get('#\\/_clampnumber7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('40')
      });
      cy.get('#\\/_clampnumber8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('10')
      });
      cy.get('#\\/_clampnumber9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get('#\\/_clampnumber10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/_clampnumber11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('10')
      });
      cy.get(replacement3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });


      cy.window().then((win) => {
        expect(components['/_clampnumber1'].stateValues.value.tree).eq(1);
        expect(components['/_clampnumber2'].stateValues.value.tree).eq(0);
        expect(components['/_clampnumber3'].stateValues.value.tree).eq(0.3);
        expect(components['/_clampnumber4'].stateValues.value.tree).eq(40);
        expect(components['/_clampnumber5'].stateValues.value.tree).eq(10);
        expect(components['/_clampnumber6'].stateValues.value.tree).eq(12);
        expect(components['/_clampnumber7'].stateValues.value.tree).eq(40);
        expect(components['/_clampnumber8'].stateValues.value.tree).eq(10);
        expect(components['/_clampnumber9'].stateValues.value.tree).eq(12);
        expect(components['/_clampnumber10'].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components['/_clampnumber11'].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(replacement1.stateValues.value.tree).eq(1);
        expect(replacement2.stateValues.value.tree).eq(10);
        expect(replacement3.stateValues.value.tree).eq(12);
      })
    })
  })

  it('wrap number periodic', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <text>a</text>

      <wrapnumberperiodic>55.3</wrapnumberperiodic>
      <wrapnumberperiodic>-55.3</wrapnumberperiodic>
      <wrapnumberperiodic>0.3</wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">55.3</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">-55.3</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">12</wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40"><math>55.3</math></wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><number>-55.3</number></wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><number>12</number></wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">x+y</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><math>x+y</math></wrapnumberperiodic>

      <ref>_wrapnumberperiodic1</ref>
      <ref>_wrapnumberperiodic5</ref>
      <ref>_wrapnumberperiodic9</ref>

      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_ref1'].replacements[0];
      let replacement1Anchor = '#' + replacement1.componentName;
      let replacement2 = components['/_ref2'].replacements[0];
      let replacement2Anchor = '#' + replacement2.componentName;
      let replacement3 = components['/_ref3'].replacements[0];
      let replacement3Anchor = '#' + replacement3.componentName;

      cy.get('#\\/_wrapnumberperiodic1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.3')
      });
      cy.get('#\\/_wrapnumberperiodic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.7')
      });
      cy.get('#\\/_wrapnumberperiodic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.3')
      });
      cy.get('#\\/_wrapnumberperiodic4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('25.3')
      });
      cy.get('#\\/_wrapnumberperiodic5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('34.7')
      });
      cy.get('#\\/_wrapnumberperiodic6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get('#\\/_wrapnumberperiodic7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('25.3')
      });
      cy.get('#\\/_wrapnumberperiodic8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('34.7')
      });
      cy.get('#\\/_wrapnumberperiodic9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get('#\\/_wrapnumberperiodic10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get('#\\/_wrapnumberperiodic11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.3')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('34.7')
      });
      cy.get(replacement3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });

      cy.window().then((win) => {
        expect(components['/_wrapnumberperiodic1'].stateValues.value.tree).closeTo(0.3, 1E-12);
        expect(components['/_wrapnumberperiodic2'].stateValues.value.tree).closeTo(0.7, 1E-12);
        expect(components['/_wrapnumberperiodic3'].stateValues.value.tree).closeTo(0.3, 1E-12);
        expect(components['/_wrapnumberperiodic4'].stateValues.value.tree).closeTo(25.3, 1E-12);
        expect(components['/_wrapnumberperiodic5'].stateValues.value.tree).closeTo(34.7, 1E-12);
        expect(components['/_wrapnumberperiodic6'].stateValues.value.tree).closeTo(12, 1E-12);
        expect(components['/_wrapnumberperiodic7'].stateValues.value.tree).closeTo(25.3, 1E-12);
        expect(components['/_wrapnumberperiodic8'].stateValues.value.tree).closeTo(34.7, 1E-12);
        expect(components['/_wrapnumberperiodic9'].stateValues.value.tree).closeTo(12, 1E-12);
        expect(components['/_wrapnumberperiodic10'].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components['/_wrapnumberperiodic11'].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(replacement1.stateValues.value.tree).closeTo(0.3, 1E-12);
        expect(replacement2.stateValues.value.tree).closeTo(34.7, 1E-12);
        expect(replacement3.stateValues.value.tree).closeTo(12, 1E-12);
      })
    })
  })

  it('clamp and wrap number updatable', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <text>a</text>
      <graph>
        <point layer="1">(6,7)</point>
        <point>
          <x>
          <clampnumber lowervalue="-2" uppervalue="5">
            <ref prop="x">_point1</ref>
          </clampnumber>
          </x>
          <y>
          <wrapnumberperiodic lowervalue="-2" uppervalue="5">
            <ref prop="y">_point1</ref>
          </wrapnumberperiodic>
          </y>
        </point>
        <point>(<ref prop="y">_point2</ref>, <ref prop="x">_point2</ref>)</point>
      </graph>

      <ref name="g2">_graph1</ref>
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let clamp = x => Math.min(5, Math.max(-2, x));
    let wrap = x => -2 + me.math.mod((x + 2), 7);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 6, y = 7;
      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point2'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[0].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[1].tree).eq(clamp(x));

      let g2children = components['/g2'].replacements[0].activeChildren
      expect(g2children[0].stateValues.xs[0].tree).eq(x);
      expect(g2children[0].stateValues.xs[1].tree).eq(y);
      expect(g2children[1].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[1].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[0].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[1].tree).eq(clamp(x));

    })

    cy.log("move point 1");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -5, y = 0;
      components['/_point1'].movePoint({ x: x, y: y });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point2'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[0].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[1].tree).eq(clamp(x));

      let g2children = components['/g2'].replacements[0].activeChildren
      expect(g2children[0].stateValues.xs[0].tree).eq(x);
      expect(g2children[0].stateValues.xs[1].tree).eq(y);
      expect(g2children[1].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[1].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[0].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[1].tree).eq(clamp(x));

    })


    cy.log("move point 2");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9, y = -3;
      components['/_point2'].movePoint({ x: x, y: y });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point1'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point2'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point2'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[0].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[1].tree).eq(clamp(x));

      let g2children = components['/g2'].replacements[0].activeChildren
      expect(g2children[0].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[0].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[1].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[1].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[0].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[1].tree).eq(clamp(x));

    })

    cy.log("move point 3");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -4, y = 8;
      components['/_point3'].movePoint({ x: y, y: x });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point1'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point2'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point2'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[0].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[1].tree).eq(clamp(x));


      let g2children = components['/g2'].replacements[0].activeChildren
      expect(g2children[0].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[0].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[1].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[1].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[0].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[1].tree).eq(clamp(x));

    })


    cy.log("move point 4");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 10, y = -10;

      let g2children = components['/g2'].replacements[0].activeChildren
      g2children[0].movePoint({ x: x, y: y });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(x);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(y);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point2'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[0].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[1].tree).eq(clamp(x));

      expect(g2children[0].stateValues.xs[0].tree).eq(x);
      expect(g2children[0].stateValues.xs[1].tree).eq(y);
      expect(g2children[1].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[1].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[0].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[1].tree).eq(clamp(x));

    })

    cy.log("move point 5");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = 11, y = -13;

      let g2children = components['/g2'].replacements[0].activeChildren
      g2children[1].movePoint({ x: x, y: y });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point1'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point2'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point2'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[0].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[1].tree).eq(clamp(x));

      expect(g2children[0].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[0].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[1].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[1].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[0].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[1].tree).eq(clamp(x));

    })

    cy.log("move point 6");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3, y = 12;

      let g2children = components['/g2'].replacements[0].activeChildren
      g2children[2].movePoint({ x: y, y: x });

      expect(components['/_point1'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point1'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point2'].stateValues.xs[0].tree).eq(clamp(x));
      expect(components['/_point2'].stateValues.xs[1].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[0].tree).eq(wrap(y));
      expect(components['/_point3'].stateValues.xs[1].tree).eq(clamp(x));

      expect(g2children[0].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[0].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[1].stateValues.xs[0].tree).eq(clamp(x));
      expect(g2children[1].stateValues.xs[1].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[0].tree).eq(wrap(y));
      expect(g2children[2].stateValues.xs[1].tree).eq(clamp(x));
    })

  });

  it('round expressions', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <text>a</text>
      <round>55.3252326</round>
      <round>log(31)</round>
      <round>0.5</round>

      <round numberdecimals="1">55.3252326</round>
      <round numberdecimals="2">log(31)</round>
      <round numberdecimals="3">0.5555</round>

      <round numberdigits="3">55.3252326</round>
      <round numberdigits="4">log(31)</round>
      <round numberdigits="5">0.555555</round>

      <round numberdigits="3"><math>sin(55.3252326 x)</math></round>
      <round numberdigits="3">log(31) exp(3) <number>sin(2)</number></round>

      <round numberdecimals="-6"><math>exp(20) pi</math></round>

      <ref>_round1</ref>
      <ref>_round5</ref>
      <ref>_round11</ref>
  
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_ref1'].replacements[0];
      let replacement1Anchor = '#' + replacement1.componentName;
      let replacement2 = components['/_ref2'].replacements[0];
      let replacement2Anchor = '#' + replacement2.componentName;
      let replacement3 = components['/_ref3'].replacements[0];
      let replacement3Anchor = '#' + replacement3.componentName;

      cy.get('#\\/_round1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('55')
      });
      cy.get('#\\/_round2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/_round3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/_round4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('55.3')
      });
      cy.get('#\\/_round5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3.43')
      });
      cy.get('#\\/_round6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.556')
      });
      cy.get('#\\/_round7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('55.3')
      });
      cy.get('#\\/_round8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3.434')
      });
      cy.get('#\\/_round9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.55556')
      });
      cy.get('#\\/_round10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(55.3x)')
      });
      cy.get('#\\/_round11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('62.7')
      });
      cy.get('#\\/_round12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1524000000')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('55')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3.43')
      });
      cy.get(replacement3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('62.7')
      });


      cy.window().then((win) => {
        expect(components['/_round1'].stateValues.value.tree).eq(55);
        expect(components['/_round2'].stateValues.value.tree).eq(3);
        expect(components['/_round3'].stateValues.value.tree).eq(1);
        expect(components['/_round4'].stateValues.value.tree).eq(55.3);
        expect(components['/_round5'].stateValues.value.tree).eq(3.43);
        expect(components['/_round6'].stateValues.value.tree).eq(0.556);
        expect(components['/_round7'].stateValues.value.tree).eq(55.3);
        expect(components['/_round8'].stateValues.value.tree).eq(3.434);
        expect(components['/_round9'].stateValues.value.tree).eq(0.55556);
        expect(components['/_round10'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 55.3, 'x']]);
        expect(components['/_round11'].stateValues.value.tree).eq(62.7);
        expect(components['/_round12'].stateValues.value.tree).eq(1524000000);
        expect(replacement1.stateValues.value.tree).eq(55);
        expect(replacement2.stateValues.value.tree).eq(3.43);
        expect(replacement3.stateValues.value.tree).eq(62.7);
      })
    })
  })

  it('convert set to list', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `

      <p><text>a</text></p>
      <p><math>{1,2,3,2,1}</math></p>
      <p><math>(1,2,3,2,1)</math></p>
      <p><math>1,2,3,2,1</math></p>

      <p><convertSetToList><ref>_math1</ref></convertSetToList></p>
      <p><convertSetToList><ref>_math2</ref></convertSetToList></p>
      <p><convertSetToList><ref>_math3</ref></convertSetToList></p>

      <p><ref name="r1">_convertSetToList1</ref></p>
      <p><ref name="r2">_convertSetToList2</ref></p>
      <p><ref name="r3">_convertSetToList3</ref></p>


      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/r1'].replacements[0];
      let replacement1Anchor = '#' + replacement1.componentName;
      let replacement2 = components['/r2'].replacements[0];
      let replacement2Anchor = '#' + replacement2.componentName;
      let replacement3 = components['/r3'].replacements[0];
      let replacement3Anchor = '#' + replacement3.componentName;

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('{1,2,3,2,1}')
      });
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2,3,2,1)')
      });
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1,2,3,2,1')
      });
      cy.get('#\\/_convertsettolist1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1,2,3')
      });
      cy.get('#\\/_convertsettolist2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2,3,2,1)')
      });
      cy.get('#\\/_convertsettolist3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1,2,3,2,1')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1,2,3')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2,3,2,1)')
      });
      cy.get(replacement3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1,2,3,2,1')
      });


      cy.window().then((win) => {
        expect(components['/_math1'].stateValues.value.tree).eqls(['set', 1, 2, 3, 2, 1]);
        expect(components['/_math2'].stateValues.value.tree).eqls(['tuple', 1, 2, 3, 2, 1]);
        expect(components['/_math3'].stateValues.value.tree).eqls(['list', 1, 2, 3, 2, 1]);
        expect(components['/_convertsettolist1'].stateValues.value.tree).eqls(['list', 1, 2, 3]);
        expect(components['/_convertsettolist2'].stateValues.value.tree).eqls(['tuple', 1, 2, 3, 2, 1]);
        expect(components['/_convertsettolist3'].stateValues.value.tree).eqls(['list', 1, 2, 3, 2, 1]);
        expect(replacement1.stateValues.value.tree).eqls(['list', 1, 2, 3]);
        expect(replacement2.stateValues.value.tree).eqls(['tuple', 1, 2, 3, 2, 1]);
        expect(replacement3.stateValues.value.tree).eqls(['list', 1, 2, 3, 2, 1]);
        expect(components['/_convertsettolist1'].stateValues.unordered).eq(true);
        expect(components['/_convertsettolist2'].stateValues.unordered).eq(true);
        expect(components['/_convertsettolist3'].stateValues.unordered).eq(true);
        expect(replacement1.stateValues.unordered).eq(true);
        expect(replacement2.stateValues.unordered).eq(true);
        expect(replacement3.stateValues.unordered).eq(true);
      })
    })
  })

  it('convert set to list, initially unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `

      <p><text>a</text></p>

      <p><math name="m">7</math>
      <selectFromSequence assignNames='p' hide='true'>
        <exclude><ref>m</ref></exclude>
        <exclude><ref>n</ref></exclude>
        -10, 10
      </selectFromSequence>
      </p>

      <p><convertSetToList><math>{<ref>m</ref>,<ref>n</ref>,<ref>p</ref>, <ref>m</ref>}</math></convertSetToList></p>
      <p><ref name="csl2">_convertSetToList1</ref></p>

      <p><ref name="n2">n3</ref>
      <ref name="n">num1</ref>
      <math name="num1" simplify><ref>n2</ref>+<ref>num2</ref></math>
      <math name="num2" simplify><ref>n3</ref>+<ref>num3</ref></math>
      <ref name="n3">num3</ref>
      <number name="num3">1</number></p>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let p = components['/p'].stateValues.value;
      expect(components['/_convertsettolist1'].stateValues.value.tree).eqls(['list', 7, 3, p]);
      expect(components['/csl2'].replacements[0].stateValues.value.tree).eqls(['list', 7, 3, p]);
      expect(components['/_convertsettolist1'].stateValues.unordered).eq(true);
      expect(components['/csl2'].replacements[0].stateValues.unordered).eq(true);
    })
  })

  it('floor and ceil', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <text>a</text>
      <floor>55.3252326</floor>
      <ceil>log(31)</ceil>

      <floor><ref>_floor1</ref>/<ref>_ceil1</ref></floor>
      <ceil><ref>_ceil1</ref>/<ref>_floor1</ref></ceil>

      <p>Allow for slight roundoff error:
      <floor>3.999999999999999</floor>
      <ceil>-6999.999999999999</ceil>
      </p>

      <ref name="f2a">_floor2</ref>
      <ref name="c2a">_ceil2</ref>

      <floor>2.1x</floor>
      <ceil>-3.2y</ceil>
  
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/f2a'].replacements[0];
      let replacement1Anchor = '#' + replacement1.componentName;
      let replacement2 = components['/c2a'].replacements[0];
      let replacement2Anchor = '#' + replacement2.componentName;

      cy.get('#\\/_floor1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('55')
      });
      cy.get('#\\/_ceil1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      });
      cy.get('#\\/_floor2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('13')
      });
      cy.get('#\\/_ceil2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/_floor3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      });
      cy.get('#\\/_ceil3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7000')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('13')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/_floor4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2.1x')
      });
      cy.get('#\\/_ceil4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3.2y')
      });

      cy.window().then((win) => {
        expect(components['/_floor1'].stateValues.value.tree).eq(55);
        expect(components['/_ceil1'].stateValues.value.tree).eq(4);
        expect(components['/_floor2'].stateValues.value.tree).eq(13);
        expect(components['/_ceil2'].stateValues.value.tree).eq(1);
        expect(components['/_floor3'].stateValues.value.tree).eq(4);
        expect(components['/_ceil3'].stateValues.value.tree).eq(-7000);
        expect(replacement1.stateValues.value.tree).eq(13);
        expect(replacement2.stateValues.value.tree).eq(1);
        expect(components['/_floor4'].stateValues.value.tree).eqls(['*', 2.1, 'x']);
        expect(components['/_ceil4'].stateValues.value.tree).eqls(['-', ['*', 3.2, 'y']]);
      })
    })
  })

  it('abs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
      <text>a</text>
      <abs>-5.3</abs>
      <abs>-x</abs>
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_abs1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5.3')
    });
    cy.get('#\\/_abs2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('|−x|')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_abs1'].stateValues.value.tree).eq(5.3);
      expect(components['/_abs2'].stateValues.value.tree).eqls(['apply', 'abs', ['-', 'x']]);
    })
  })

})
