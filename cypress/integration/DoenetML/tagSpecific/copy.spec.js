import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Copy Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('copy copies properties', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <copy name="a" tname="_math1"/>
    <copy name="b" tname="a"/>
    <math modifyIndirectly="true">x</math>
    <copy name="c" tname="_math2"/>
    <copy name="d" tname="c"/>
    <point label="A">(1,2)</point>
    <copy name="e" tname="_point1"/>
    <copy name="f" tname="e"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(components['/a'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(components['/b'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(components['/_math2'].stateValues.modifyIndirectly).eq(true);
      expect(components['/c'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/d'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/_point1'].stateValues.label).eq("A");
      expect(components['/e'].replacements[0].stateValues.label).eq("A");
      expect(components['/f'].replacements[0].stateValues.label).eq("A");

    })

  });

  it('copy overwrites properties', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <copy name="r1" tname="_math1"/>
    <copy name="r2" modifyIndirectly="true" tname="_math1"/>
    <copy name="r3" modifyIndirectly="true" tname="r1"/>
    <copy name="r4" tname="r2"/>
    <copy name="r5" tname="r3"/>
    <copy name="r6" tname="r2" modifyIndirectly="false" />
    <copy name="r7" tname="r3" modifyIndirectly="false" />

    <point label="A" name="A">(1,2)</point>
    <copy name="A2" tname="A"/>
    <copy label="B" name="B" tname="A"/>
    <copy label="C" name="C" tname="B"/>
    <copy name="C2" tname="C"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(components['/r1'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(components['/r2'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/r3'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/r4'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/r5'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/r6'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(components['/r7'].replacements[0].stateValues.modifyIndirectly).eq(false);

      expect(components['/A'].stateValues.label).eq("A");
      expect(components['/A2'].replacements[0].stateValues.label).eq("A");
      expect(components['/B'].replacements[0].stateValues.label).eq("B");
      expect(components['/C'].replacements[0].stateValues.label).eq("C");
      expect(components['/C2'].replacements[0].stateValues.label).eq("C");

    })
  });

  it('copy props', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <copy name="mr" prop="modifyIndirectly" tname="x"/>
    <copy name="mr2" prop="modifyIndirectly" modifyIndirectly="true" tname="x"/>

    <copy name="frmt" prop="format" tname="x"/>
    <copy name="frmt2" prop="format" tname="x" hide />
    <copy name="frmt3" hide tname="frmt"/>

    <point name="A" label="A">(1,2)</point>
    <copy name="cA" prop="coords" tname="A"/>
    <copy name="l" prop="latex" tname="cA"/>
    <copy name="lmr" prop="latex" modifyIndirectly="false" tname="cA"/>
    <copy name="A2" tname="A"/>
    <copy name="cA2" prop="coords" tname="A2"/>
    <copy name="l2" prop="latex" tname="cA2"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.modifyIndirectly).eq(false);
      expect(components['/x'].stateValues.hide).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(components['/mr'].replacements[0].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(components['/mr'].replacements[0].stateValues.hide).eq(false);
      expect(components['/mr'].replacements[0].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(components['/mr2'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/mr2'].replacements[0].stateValues.hide).eq(false);
      expect(components['/mr2'].replacements[0].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(components['/frmt'].replacements[0].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(components['/frmt'].replacements[0].stateValues.hide).eq(false);
      expect(components['/frmt'].replacements[0].stateValues.value).eq("text");

      expect(components['/frmt2'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(components['/frmt2'].replacements[0].stateValues.hidden).eq(true);
      expect(components['/frmt2'].replacements[0].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(components['/frmt3'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(components['/frmt3'].replacements[0].stateValues.value).eq("text");
      expect(components['/frmt3'].replacements[0].stateValues.hidden).eq(true);

      expect(components['/A'].stateValues.label).eq("A");
      expect(components['/cA'].replacements[0].stateValues.value.tree).eqls(["vector", 1, 2]);
      expect(components['/l'].replacements[0].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(components['/l'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/lmr'].replacements[0].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(components['/lmr'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(components['/A2'].replacements[0].stateValues.label).eq("A");
      expect(components['/cA2'].replacements[0].stateValues.value.tree).eqls(["vector", 1, 2]);
      expect(components['/l2'].replacements[0].stateValues.value).eq("\\left( 1, 2 \\right)");

    })
  });

  it('copy props of copy still updatable', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    </graph>
    
    <graph>
      <copy name="p2" tname="_point1"/>
      <point>
        (<copy prop="y" tname="p2"/>,
        <copy prop="x1" tname="p2"/>)
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`initial position`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(2);
      expect(components["/p2"].replacements[0].stateValues.xs[0].tree).eq(1);
      expect(components["/p2"].replacements[0].stateValues.xs[1].tree).eq(2);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(2);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(1);
    })

    cy.log(`move point 1`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -3, y: 5 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-3);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(5);
      expect(components["/p2"].replacements[0].stateValues.xs[0].tree).eq(-3);
      expect(components["/p2"].replacements[0].stateValues.xs[1].tree).eq(5);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(5);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-3);
    })

    cy.log(`move point 2`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/p2"].replacements[0].movePoint({ x: 6, y: -9 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(6);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-9);
      expect(components["/p2"].replacements[0].stateValues.xs[0].tree).eq(6);
      expect(components["/p2"].replacements[0].stateValues.xs[1].tree).eq(-9);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(-9);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(6);
    })

    cy.log(`move point 3`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: -1, y: -7 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-7);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-1);
      expect(components["/p2"].replacements[0].stateValues.xs[0].tree).eq(-7);
      expect(components["/p2"].replacements[0].stateValues.xs[1].tree).eq(-1);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(-1);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-7);
    })

  });

  it.skip('copy invalid prop', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>x</math>
    <copy prop="label" tname="_math1"/>

    <point label="A" tname="x</point>
    <copy tname="_point1"/>
    <copy prop="format" tname="_ref1"/>

    <copy name="A2" tname="A"/>
    <copy name="cA2" prop="coords" tname="A2"/>
    <copy name="lcA2" prop="label" tname="cA2"/>
    <copy name="llcA2" label="B" tname="cA2"/>

    `}, "*");
    });

    cy.get('#__math1') //wait for page to load


    // How to check if the right errors get thrown for these?

  });

  it('copy of prop copy shadows target', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
    <copy prop="displacement" name="d1" tname="_vector1"/>
    </graph>
  
    <graph>
    <copy tname="d1" name="d2" />
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let vector2 = components["/d1"].replacements[0];
      let vector3 = components["/d2"].replacements[0];

      cy.log(`initial positions`);
      cy.window().then((win) => {
        let displacement = [-4, 2];
        let v_tail = [1, 1];
        let d_tail = [0, 0];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([...v_tail]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([...v_head]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
        expect(vector2.stateValues.tail.map(x => x.tree)).eqls([...d_tail]);
        expect(vector2.stateValues.head.map(x => x.tree)).eqls([...d_head]);
        expect(vector2.stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
        expect(vector3.stateValues.tail.map(x => x.tree)).eqls([...d_tail]);
        expect(vector3.stateValues.head.map(x => x.tree)).eqls([...d_head]);
        expect(vector3.stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
      })

      cy.log(`move vector 1`);
      cy.window().then((win) => {
        let displacement = [3, 1];
        let v_tail = [-1, 4];
        let d_tail = [0, 0];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        let components = Object.assign({}, win.state.components);
        components['/_vector1'].moveVector({
          tailcoords: v_tail,
          headcoords: v_head,
        })
        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([...v_tail]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([...v_head]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
        expect(vector2.stateValues.tail.map(x => x.tree)).eqls([...d_tail]);
        expect(vector2.stateValues.head.map(x => x.tree)).eqls([...d_head]);
        expect(vector2.stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
        expect(vector3.stateValues.tail.map(x => x.tree)).eqls([...d_tail]);
        expect(vector3.stateValues.head.map(x => x.tree)).eqls([...d_head]);
        expect(vector3.stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
      })

      cy.log(`move vector 2`);
      cy.window().then((win) => {
        let displacement = [5, -2];
        let v_tail = [-1, 4];
        let d_tail = [3, -7];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        let components = Object.assign({}, win.state.components);
        vector2.moveVector({
          tailcoords: d_tail,
          headcoords: d_head,
        })
        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([...v_tail]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([...v_head]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
        expect(vector2.stateValues.tail.map(x => x.tree)).eqls([...d_tail]);
        expect(vector2.stateValues.head.map(x => x.tree)).eqls([...d_head]);
        expect(vector2.stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
        expect(vector3.stateValues.tail.map(x => x.tree)).eqls([...d_tail]);
        expect(vector3.stateValues.head.map(x => x.tree)).eqls([...d_head]);
        expect(vector3.stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
      })

      cy.log(`move vector 3`);
      cy.window().then((win) => {
        let displacement = [-3, 6];
        let v_tail = [-1, 4];
        let d_tail = [4, -2];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        let components = Object.assign({}, win.state.components);
        vector3.moveVector({
          tailcoords: d_tail,
          headcoords: d_head,
        })
        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([...v_tail]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([...v_head]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
        expect(vector2.stateValues.tail.map(x => x.tree)).eqls([...d_tail]);
        expect(vector2.stateValues.head.map(x => x.tree)).eqls([...d_head]);
        expect(vector2.stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
        expect(vector3.stateValues.tail.map(x => x.tree)).eqls([...d_tail]);
        expect(vector3.stateValues.head.map(x => x.tree)).eqls([...d_head]);
        expect(vector3.stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
      })

      cy.log(`move vector 1`);
      cy.window().then((win) => {
        let displacement = [5, 0];
        let v_tail = [-8, 6];
        let d_tail = [4, -2];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        let components = Object.assign({}, win.state.components);
        components['/_vector1'].moveVector({
          tailcoords: v_tail,
          headcoords: v_head,
        })
        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([...v_tail]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([...v_head]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
        expect(vector2.stateValues.tail.map(x => x.tree)).eqls([...d_tail]);
        expect(vector2.stateValues.head.map(x => x.tree)).eqls([...d_head]);
        expect(vector2.stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
        expect(vector3.stateValues.tail.map(x => x.tree)).eqls([...d_tail]);
        expect(vector3.stateValues.head.map(x => x.tree)).eqls([...d_head]);
        expect(vector3.stateValues.displacement.map(x => x.tree)).eqls([...displacement]);
      })
    })

  });

  it('property children account for replacement changes', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput />

    <p hide="false">
      <aslist hide="false">
        <sequence type="letters" from="a" length="$_mathinput1" />
      </aslist>
    </p>
    
    <p><copy name="al2" tname="_aslist1"/></p>
    <copy name="p2" tname="_p1"/>
    
    <p><copy tname="al2"/></p>
    <copy tname="p2" name="p3"/>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let p2Anchor = cesc("#" + components["/p2"].replacements[0].componentName);
      let p3Anchor = cesc("#" + components["/p3"].replacements[0].componentName);

      cy.get('#\\/_p1').invoke('text').then((text) => {
        expect(text.trim()).equal('')
      });
      cy.get('#\\/_p2').invoke('text').then((text) => {
        expect(text.trim()).equal('')
      });
      cy.get(p2Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('')
      });
      cy.get('#\\/_p3').invoke('text').then((text) => {
        expect(text.trim()).equal('')
      });
      cy.get(p3Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('')
      });


      cy.get('#\\/_mathinput1 textarea').type("2{enter}", { force: true });
      cy.get('#\\/_p1').invoke('text').then((text) => {
        expect(text.trim()).equal('a, b')
      });
      cy.get('#\\/_p2').invoke('text').then((text) => {
        expect(text.trim()).equal('a, b')
      });
      cy.get(p2Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('a, b')
      });
      cy.get('#\\/_p3').invoke('text').then((text) => {
        expect(text.trim()).equal('a, b')
      });
      cy.get(p3Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('a, b')
      });

      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}5{enter}", { force: true });
      cy.get('#\\/_p1').invoke('text').then((text) => {
        expect(text.trim()).equal('a, b, c, d, e')
      });
      cy.get('#\\/_p2').invoke('text').then((text) => {
        expect(text.trim()).equal('a, b, c, d, e')
      });
      cy.get(p2Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('a, b, c, d, e')
      });
      cy.get('#\\/_p3').invoke('text').then((text) => {
        expect(text.trim()).equal('a, b, c, d, e')
      });
      cy.get(p3Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('a, b, c, d, e')
      });

      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}1{enter}", { force: true });
      cy.get('#\\/_p1').invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get('#\\/_p2').invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get(p2Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get('#\\/_p3').invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get(p3Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });

      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}6{enter}", { force: true });
      cy.get('#\\/_p1').invoke('text').then((text) => {
        expect(text.trim()).equal('a, b, c, d, e, f')
      });
      cy.get('#\\/_p2').invoke('text').then((text) => {
        expect(text.trim()).equal('a, b, c, d, e, f')
      });
      cy.get(p2Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('a, b, c, d, e, f')
      });
      cy.get('#\\/_p3').invoke('text').then((text) => {
        expect(text.trim()).equal('a, b, c, d, e, f')
      });
      cy.get(p3Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('a, b, c, d, e, f')
      });
    })
  });

  it('copy macros', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a=<mathinput name="a" prefill="5" /></p>
    <p>b=<mathinput name="b" prefill="2" /></p>
    <p>c=<mathinput name="c" prefill="3" /></p>

    <p name="orig"><m>ax^2+bx+c = <math name="s">$a x^2 + $b x + $c</math></m></p>
    <p name="single"><m>ax^2+bx+c = $s</m></p>
    <p name="double"><m>ax^2+bx+c = $$s</m></p>
    <p name="triple"><m>ax^2+bx+c = $$$s</m></p>
    <p name="singlem">$_m1</p>
    <p name="doublem">$$_m1</p>
    <p name="triplem">$$$_m1</p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/orig').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=5x2+2x+3')
    })
    cy.get('#\\/single').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=5x2+2x+3')
    })
    cy.get('#\\/double').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=$$s')
    })
    cy.get('#\\/triple').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=$$$s')
    })
    cy.get('#\\/singlem').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=5x2+2x+3')
    })
    cy.get('#\\/doublem').should('have.text', '$$_m1');
    cy.get('#\\/triplem').should('have.text', '$$$_m1');


    cy.log('Enter new numbers');
    cy.get('#\\/a textarea').type("{end}{backspace}9{enter}", { force: true })
    cy.get('#\\/b textarea').type("{end}{backspace}6{enter}", { force: true })
    cy.get('#\\/c textarea').type("{end}{backspace}7{enter}", { force: true })

    cy.get('#\\/orig').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=9x2+6x+7')
    })
    cy.get('#\\/single').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=9x2+6x+7')
    })
    cy.get('#\\/double').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=$$s')
    })
    cy.get('#\\/triple').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=$$$s')
    })
    cy.get('#\\/singlem').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=9x2+6x+7')
    })
    cy.get('#\\/doublem').should('have.text', '$$_m1');
    cy.get('#\\/triplem').should('have.text', '$$$_m1');


  });

  it('copy ignores hide by default', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Hidden text: <text name="hidden" hide>secret</text></p>
    <p>Revealed by default: $hidden</p>
    <p>Force to stay hidden: <copy tname="hidden" targetAttributesToIgnore="" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', 'Hidden text: ');
    cy.get('#\\/_p2').should('have.text', 'Revealed by default: secret');
    cy.get('#\\/_p3').should('have.text', 'Force to stay hidden: ');


  });


  it('copy keeps hidden children hidden', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="theP" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pReveal">Revealed: $(theP/hidden)</p>
    <copy tname="theP" assignNames="theP2" />
    <p name="pReveal2">Revealed 2: $(theP2/hidden)</p>


    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/theP').should('have.text', 'Hidden text: ');
    cy.get('#\\/pReveal').should('have.text', 'Revealed: secret');
    cy.get('#\\/theP2').should('have.text', 'Hidden text: ');
    cy.get('#\\/pReveal2').should('have.text', 'Revealed 2: secret');


  });

  it('copies hide dynamically', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <text name="target">hello</text>

    <booleaninput name='h1' prefill="false" label="Hide first copy" />
    <booleaninput name='h2' prefill="true" label="Hide second copy" />

    <p name="c1">copy 1: <copy hide="$h1" tname="target" /></p>
    <p name="c2">copy 2: <copy hide="$h2" tname="target" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/c1').should('have.text', 'copy 1: hello')
    cy.get('#\\/c2').should('have.text', 'copy 2: ')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/c1').should('have.text', 'copy 1: ')
    cy.get('#\\/c2').should('have.text', 'copy 2: hello')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/c1').should('have.text', 'copy 1: hello')
    cy.get('#\\/c2').should('have.text', 'copy 2: ')

  })

  it('copy uri two problems', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <title>Two problems</title>

    <copy assignNames="problem1" uri="doenet:conTentId=a666134b719e70e8acb48d91d582d1efd90d7f11fb499ab77f9f1fa5dafdb96d&DoenEtiD=abcdefg" />
    
    <copy assignNames="problem2" uri="doenet:doeneTiD=hijklmnop&contentId=64e31126079d65ea41e90129fa96a7fd54f1faa73fb7b2ef99d8bbed1d13f69a" />
    `}, "*");
    });
    cy.get('#\\/_title1').should('have.text', 'Two problems');  // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components["/_copy1"].stateValues.contentId).eq("a666134b719e70e8acb48d91d582d1efd90d7f11fb499ab77f9f1fa5dafdb96d")
        expect(components["/_copy1"].stateValues.doenetId).eq("abcdefg")
        expect(components["/_copy2"].stateValues.contentId).eq("64e31126079d65ea41e90129fa96a7fd54f1faa73fb7b2ef99d8bbed1d13f69a")
        expect(components["/_copy2"].stateValues.doenetId).eq("hijklmnop")
      })
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/problem2/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })

  })

  it('copy uri containing copy uri of two problems', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <title>Four problems</title>

    <copy assignNames="problem12" uri="doenet:contentId=251ff8a0091dcd0b876862bcfb914e8e78ac395ffe22583d149ceec9bebf2b4e" />
    
    <copy assignNames="problem34" newNamespace name="set2" uri="doenet:contentId=251ff8a0091dcd0b876862bcfb914e8e78ac395ffe22583d149ceec9bebf2b4e" />
    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'Four problems');  // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/problem12/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem12/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem12/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem12/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem12/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem12/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem12/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem12/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem12/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem12/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem12/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem12/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem12/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/problem12/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/problem12/problem2/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })


    cy.get(cesc('#/set2/problem34/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/set2/problem34/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/set2/problem34/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/set2/problem34/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/set2/problem34/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/set2/problem34/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/set2/problem34/problem2/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })


  })

  // this triggered an error not caught with the other order
  it('copy uri containing copy uri of two problems, newNamespace first', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <title>Four problems</title>

    <copy assignNames="problem12" newNamespace name="set1" uri="doenet:contentId=251ff8a0091dcd0b876862bcfb914e8e78ac395ffe22583d149ceec9bebf2b4e" />
    
    <copy assignNames="problem34" uri="doenet:contentId=251ff8a0091dcd0b876862bcfb914e8e78ac395ffe22583d149ceec9bebf2b4e" />
    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'Four problems');  // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/set1/problem12/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/set1/problem12/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/set1/problem12/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/set1/problem12/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/set1/problem12/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/set1/problem12/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/set1/problem12/problem2/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })


    cy.get(cesc('#/problem34/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem34/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem34/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem34/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem34/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem34/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem34/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem34/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem34/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem34/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem34/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem34/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem34/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/problem34/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/problem34/problem2/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })


  })

  it('copy of component that changes away from a copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput name="b" />

    <text name="jump" hide>jump</text>
    
    <p name="forVerb"><conditionalContent assignNames="(verb)">
      <case condition="$b"><text>skip</text></case>
      <else>$jump</else>
    </conditionalContent></p>

    <copy tname="verb" assignNames="verb2" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/forVerb').should('have.text', 'jump');
    cy.get('#\\/verb2').should('have.text', 'jump');

    cy.get('#\\/b').click();
    cy.get('#\\/forVerb').should('have.text', 'skip');
    cy.get('#\\/verb2').should('have.text', 'skip');



  });

  it('copy of invalid target gives math in boolean and math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>We can't see $invalid in paragraph <text>or $invisible in text</text>.</p>

    <p>In math, we can: <math>$bad + $nothing</math></p>

    <p>And in boolean as well: <boolean>not ($missing = x)</boolean></p>.

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', "We can't see  in paragraph or  in text.")

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+＿')
    })

    cy.get('#\\/_boolean1').should('have.text', "true");




  });

});