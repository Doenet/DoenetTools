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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <copy name="a" target="_math1"/>
    <copy name="b" target="a"/>
    <math modifyIndirectly="true">x</math>
    <copy name="c" target="_math2"/>
    <copy name="d" target="c"/>
    <point label="A">(1,2)</point>
    <copy name="e" target="_point1"/>
    <copy name="f" target="e"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(await components['/a'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(await components['/b'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(await components['/_math2'].stateValues.modifyIndirectly).eq(true);
      expect(await components['/c'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/d'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/_point1'].stateValues.label).eq("A");
      expect(await components['/e'].replacements[0].stateValues.label).eq("A");
      expect(await components['/f'].replacements[0].stateValues.label).eq("A");

    })

  });

  it('copy overwrites properties', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <copy name="r1" target="_math1"/>
    <copy name="r2" modifyIndirectly="true" target="_math1"/>
    <copy name="r3" modifyIndirectly="true" target="r1"/>
    <copy name="r4" target="r2"/>
    <copy name="r5" target="r3"/>
    <copy name="r6" target="r2" modifyIndirectly="false" />
    <copy name="r7" target="r3" modifyIndirectly="false" />

    <point label="A" name="A">(1,2)</point>
    <copy name="A2" target="A"/>
    <copy label="B" name="B" target="A"/>
    <copy label="C" name="C" target="B"/>
    <copy name="C2" target="C"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(await components['/r1'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(await components['/r2'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/r3'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/r4'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/r5'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/r6'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(await components['/r7'].replacements[0].stateValues.modifyIndirectly).eq(false);

      expect(await components['/A'].stateValues.label).eq("A");
      expect(await components['/A2'].replacements[0].stateValues.label).eq("A");
      expect(await components['/B'].replacements[0].stateValues.label).eq("B");
      expect(await components['/C'].replacements[0].stateValues.label).eq("C");
      expect(await components['/C2'].replacements[0].stateValues.label).eq("C");

    })
  });

  it('copy overwrites properties, decode XML entities', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="3 &gt; 4">x</math>
    <copy name="r1" target="_math1"/>
    <copy name="r2" modifyIndirectly="3&lt;4" target="_math1"/>
    <copy name="r3" modifyIndirectly="3&lt;4" target="r1"/>
    <copy name="r4" target="r2"/>
    <copy name="r5" target="r3"/>
    <copy name="r6" target="r2" modifyIndirectly="3&gt;4" />
    <copy name="r7" target="r3" modifyIndirectly="3&gt;4" />

    <point label="A" name="A">(1,2)</point>
    <copy name="A2" target="A"/>
    <copy label="B" name="B" target="A"/>
    <copy label="C" name="C" target="B"/>
    <copy name="C2" target="C"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(await components['/r1'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(await components['/r2'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/r3'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/r4'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/r5'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/r6'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(await components['/r7'].replacements[0].stateValues.modifyIndirectly).eq(false);

      expect(await components['/A'].stateValues.label).eq("A");
      expect(await components['/A2'].replacements[0].stateValues.label).eq("A");
      expect(await components['/B'].replacements[0].stateValues.label).eq("B");
      expect(await components['/C'].replacements[0].stateValues.label).eq("C");
      expect(await components['/C2'].replacements[0].stateValues.label).eq("C");

    })
  });

  it('copy props', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <copy name="mr" prop="modifyIndirectly" target="x"/>
    <copy name="mr2" prop="modifyIndirectly" modifyIndirectly="true" target="x"/>

    <copy name="frmt" prop="format" target="x"/>
    <copy name="frmt2" prop="format" target="x" hide />
    <copy name="frmt3" hide target="frmt"/>

    <point name="A" label="A">(1,2)</point>
    <copy name="cA" prop="coords" target="A"/>
    <copy name="l" prop="latex" target="cA"/>
    <copy name="lmr" prop="latex" modifyIndirectly="false" target="cA"/>
    <copy name="A2" target="A"/>
    <copy name="cA2" prop="coords" target="A2"/>
    <copy name="l2" prop="latex" target="cA2"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.modifyIndirectly).eq(false);
      expect(await components['/x'].stateValues.hide).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(await components['/mr'].replacements[0].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(await components['/mr'].replacements[0].stateValues.hide).eq(false);
      expect(await components['/mr'].replacements[0].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(await components['/mr2'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/mr2'].replacements[0].stateValues.hide).eq(false);
      expect(await components['/mr2'].replacements[0].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(await components['/frmt'].replacements[0].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(await components['/frmt'].replacements[0].stateValues.hide).eq(false);
      expect(await components['/frmt'].replacements[0].stateValues.value).eq("text");

      expect(await components['/frmt2'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(await components['/frmt2'].replacements[0].stateValues.hidden).eq(true);
      expect(await components['/frmt2'].replacements[0].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(await components['/frmt3'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(await components['/frmt3'].replacements[0].stateValues.value).eq("text");
      expect(await components['/frmt3'].replacements[0].stateValues.hidden).eq(true);

      expect(await components['/A'].stateValues.label).eq("A");
      expect((await components['/cA'].replacements[0].stateValues.value).tree).eqls(["vector", 1, 2]);
      expect(await components['/l'].replacements[0].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(await components['/l'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/lmr'].replacements[0].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(await components['/lmr'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(await components['/A2'].replacements[0].stateValues.label).eq("A");
      expect((await components['/cA2'].replacements[0].stateValues.value).tree).eqls(["vector", 1, 2]);
      expect(await components['/l2'].replacements[0].stateValues.value).eq("\\left( 1, 2 \\right)");

    })
  });

  it('copy props of copy still updatable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    </graph>
    
    <graph>
      <copy name="p2" target="_point1"/>
      <point>
        (<copy prop="y" target="p2"/>,
        <copy prop="x1" target="p2"/>)
      </point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`initial position`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(2);
      expect(components["/p2"].replacements[0].stateValues.xs[0].tree).eq(1);
      expect(components["/p2"].replacements[0].stateValues.xs[1].tree).eq(2);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(2);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(1);
    })

    cy.log(`move point 1`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: -3, y: 5 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-3);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(5);
      expect(components["/p2"].replacements[0].stateValues.xs[0].tree).eq(-3);
      expect(components["/p2"].replacements[0].stateValues.xs[1].tree).eq(5);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(5);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-3);
    })

    cy.log(`move point 2`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/p2"].replacements[0].movePoint({ x: 6, y: -9 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(6);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-9);
      expect(components["/p2"].replacements[0].stateValues.xs[0].tree).eq(6);
      expect(components["/p2"].replacements[0].stateValues.xs[1].tree).eq(-9);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(-9);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(6);
    })

    cy.log(`move point 3`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point2'].movePoint({ x: -1, y: -7 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(-7);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-1);
      expect(components["/p2"].replacements[0].stateValues.xs[0].tree).eq(-7);
      expect(components["/p2"].replacements[0].stateValues.xs[1].tree).eq(-1);
      expect(components['/_point2'].stateValues.xs[0].tree).eq(-1);
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-7);
    })

  });

  it.skip('copy invalid prop', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>x</math>
    <copy prop="label" target="_math1"/>

    <point label="A" target="x</point>
    <copy target="_point1"/>
    <copy prop="format" target="_ref1"/>

    <copy name="A2" target="A"/>
    <copy name="cA2" prop="coords" target="A2"/>
    <copy name="lcA2" prop="label" target="cA2"/>
    <copy name="llcA2" label="B" target="cA2"/>

    `}, "*");
    });

    cy.get('#__math1') //wait for page to load


    // How to check if the right errors get thrown for these?

  });

  it('copy of prop copy shadows target', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
    <copy prop="displacement" name="d1" target="_vector1"/>
    </graph>
  
    <graph>
    <copy target="d1" name="d2" />
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let vector2 = components["/d1"].replacements[0];
      let vector3 = components["/d2"].replacements[0];

      cy.log(`initial positions`);
      cy.window().then(async (win) => {
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
      cy.window().then(async (win) => {
        let displacement = [3, 1];
        let v_tail = [-1, 4];
        let d_tail = [0, 0];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        let components = Object.assign({}, win.state.components);
        await components['/_vector1'].moveVector({
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
      cy.window().then(async (win) => {
        let displacement = [5, -2];
        let v_tail = [-1, 4];
        let d_tail = [3, -7];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        let components = Object.assign({}, win.state.components);
        await vector2.moveVector({
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
      cy.window().then(async (win) => {
        let displacement = [-3, 6];
        let v_tail = [-1, 4];
        let d_tail = [4, -2];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        let components = Object.assign({}, win.state.components);
        await vector3.moveVector({
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
      cy.window().then(async (win) => {
        let displacement = [5, 0];
        let v_tail = [-8, 6];
        let d_tail = [4, -2];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        let components = Object.assign({}, win.state.components);
        await components['/_vector1'].moveVector({
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput />

    <p>
      <aslist>
        <sequence type="letters" from="a" length="$_mathinput1" />
      </aslist>
    </p>
    
    <p><copy name="al2" target="_aslist1"/></p>
    <copy name="p2" target="_p1"/>
    
    <p><copy target="al2"/></p>
    <copy target="p2" name="p3"/>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
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

  it('macros after failed double macro', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <text name="t">hi</text>
    <text name="u">bye</text>
    <p>$t, $$t, $ $u,
    $t, $$u, $u</p>
    <p>$u, $$t(, $t,
    $u, $$u, $t</p>
    <p>$t, $$$t, $5, $u, $$5, $t, $$$5, $u</p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', "hi, $$t, $ bye,\n    hi, $$u, bye")
    cy.get('#\\/_p2').should('have.text', "bye, $$t(, hi,\n    bye, $$u, hi")
    cy.get('#\\/_p3').should('have.text', "hi, $$$t, $5, bye, $$5, hi, $$$5, bye")
  })

  it('copy ignores hide by default', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Hidden text: <text name="hidden" hide>secret</text></p>
    <p>Revealed by default: $hidden</p>
    <p>Force to stay hidden: <copy target="hidden" targetAttributesToIgnore="" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', 'Hidden text: ');
    cy.get('#\\/_p2').should('have.text', 'Revealed by default: secret');
    cy.get('#\\/_p3').should('have.text', 'Force to stay hidden: ');


  });

  it('copy keeps hidden children hidden', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="theP" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pReveal">Revealed: $(theP/hidden)</p>
    <copy target="theP" assignNames="theP2" />
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <text name="target">hello</text>

    <booleaninput name='h1' prefill="false" label="Hide first copy" />
    <booleaninput name='h2' prefill="true" label="Hide second copy" />

    <p name="c1">copy 1: <copy hide="$h1" target="target" /></p>
    <p name="c2">copy 2: <copy hide="$h2" target="target" /></p>
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Two problems</title>

    <copy assignNames="problem1" uri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" />
    
    <copy assignNames="problem2" uri="doenet:doeneTiD=hijklmnop&contentId=CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
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
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components["/_copy1"].stateValues.contentId).eq("bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu")
        expect(components["/_copy1"].stateValues.doenetId).eq("abcdefg")
        expect(components["/_copy2"].stateValues.contentId).eq("bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti")
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


    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Four problems</title>

    <copy assignNames="problem12" uri="doenet:CID=bafkreih7bmpf7mbimgeoxgffdt6tbc6o462wj7gtxkzrqsk3kzhdaqzabi" />
    
    <copy assignNames="problem34" newNamespace name="set2" uri="doenet:CID=bafkreih7bmpf7mbimgeoxgffdt6tbc6o462wj7gtxkzrqsk3kzhdaqzabi" />
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


    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Four problems</title>

    <copy assignNames="problem12" newNamespace name="set1" uri="doenet:CID=bafkreih7bmpf7mbimgeoxgffdt6tbc6o462wj7gtxkzrqsk3kzhdaqzabi" />
    
    <copy assignNames="problem34" uri="doenet:CID=bafkreih7bmpf7mbimgeoxgffdt6tbc6o462wj7gtxkzrqsk3kzhdaqzabi" />
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


    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput name="b" />

    <text name="jump" hide>jump</text>
    
    <p name="forVerb"><conditionalContent assignNames="(verb)">
      <case condition="$b"><text>skip</text></case>
      <else>$jump</else>
    </conditionalContent></p>

    <copy target="verb" assignNames="verb2" />
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
    cy.window().then(async (win) => {
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

  it('copy no link, base test', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Simplify of original: <textinput name="s1" prefill="full" /></p>
    <p>Simplify of copies: <textinput name="s2" prefill="none" /></p>

    <p>Original: <math name="m" simplify="$s1">x +x</math></p>
    
    <p>Unlinked copy: <copy link="false" target="m" simplify="$s2" assignNames="m2" /></p>

    <p>Linked copy: <copy target="m" simplify="$s2" assignNames="m3" /></p>
    
    <p>Double value of original: <updateValue target="m" newValue="2$m" name="doubleOriginal" label="double original" /></p>
    <p>Double value of copy 1: <updateValue target="m2" newValue="2$m2" name="doubleCopy1" label="double copy 1" /></p>
    <p>Double value of copy 2: <updateValue target="m3" newValue="2$m3" name="doubleCopy2" label="double copy 2" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('x+x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('x+x')
    })


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/_copy1"].stateValues.link).eq(false)
      expect(components["/_copy2"].stateValues.link).eq(true)
      expect(components["/m"].stateValues.value.tree).eqls(["*", 2, "x"])
      expect(components["/m2"].stateValues.value.tree).eqls(["+", "x", "x"])
      expect(components["/m3"].stateValues.value.tree).eqls(["+", "x", "x"])
    });

    cy.log('simplify copies')
    cy.get('#\\/s2_input').clear().type("full{enter}");

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m"].stateValues.value.tree).eqls(["*", 2, "x"])
      expect(components["/m2"].stateValues.value.tree).eqls(["*", 2, "x"])
      expect(components["/m3"].stateValues.value.tree).eqls(["*", 2, "x"])
    });


    cy.log('stop simplifying original')
    cy.get('#\\/s1_input').clear().type("none{enter}");

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('x+x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m"].stateValues.value.tree).eqls(["+", "x", "x"])
      expect(components["/m2"].stateValues.value.tree).eqls(["*", 2, "x"])
      expect(components["/m3"].stateValues.value.tree).eqls(["*", 2, "x"])
    });


    cy.log('double original')
    cy.get('#\\/doubleOriginal').click();

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2(x+x)')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m"].stateValues.value.tree).eqls(["*", 2, ["+", "x", "x"]])
      expect(components["/m2"].stateValues.value.tree).eqls(["*", 2, "x"])
      expect(components["/m3"].stateValues.value.tree).eqls(["*", 4, "x"])
    });


    cy.log('double copy1')
    cy.get('#\\/doubleCopy1').click();

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2(x+x)')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m"].stateValues.value.tree).eqls(["*", 2, ["+", "x", "x"]])
      expect(components["/m2"].stateValues.value.tree).eqls(["*", 4, "x"])
      expect(components["/m3"].stateValues.value.tree).eqls(["*", 4, "x"])
    });


    cy.log('double copy2')
    cy.get('#\\/doubleCopy2').click();

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅4x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('8x')
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m"].stateValues.value.tree).eqls(["*", 2, 4, "x"])
      expect(components["/m2"].stateValues.value.tree).eqls(["*", 4, "x"])
      expect(components["/m3"].stateValues.value.tree).eqls(["*", 8, "x"])
    });


    cy.log('stop simplifying copies')
    cy.get('#\\/s2_input').clear().type("none{enter}");

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅4x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅4x')
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m"].stateValues.value.tree).eqls(["*", 2, 4, "x"])
      expect(components["/m2"].stateValues.value.tree).eqls(["*", 2, 2, "x"])
      expect(components["/m3"].stateValues.value.tree).eqls(["*", 2, 4, "x"])
    });

  });

  it('copy points and lines with no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <copy target="A" link="false" name="Anolink" assignNames="A2" />
      <copy target="l" link="false" name="lnolink" assignNames="l2" />
    </graph>
    
    <graph>
      <copy target="l" prop="point1" link="false" name="plnolink" assignNames="A3" />
    </graph>
    <graph>
      <copy target="l" prop="points" link="false" name="plsnolink" assignNames="A4 B4"  />
    </graph>

    <copy target="g" link="false" name="gnolink" assignNames="g2" />
    
    <copy target="A" prop="x" link="false" assignNames="Ax" name="pxnolink" />
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(`#\\/Ax`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('1')
    })


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let A5 = components["/g2"].activeChildren[0];
      let B5 = components["/g2"].activeChildren[1];
      let l3 = components["/g2"].activeChildren[2];


      expect(components["/Anolink"].stateValues.link).eq(false)
      expect(components["/lnolink"].stateValues.link).eq(false)
      expect(components["/plnolink"].stateValues.link).eq(false)
      expect(components["/plsnolink"].stateValues.link).eq(false)
      expect(components["/gnolink"].stateValues.link).eq(false)
      expect(components["/pxnolink"].stateValues.link).eq(false)
      expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
      expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([1, 2])
      expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([3, 4])
      expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
      expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([1, 2])
      expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([3, 4])
      expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
      expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
      expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(A5.stateValues.xs.map(x => x.tree)).eqls([1, 2])
      expect(B5.stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(l3.stateValues.point1.map(x => x.tree)).eqls([1, 2])
      expect(l3.stateValues.point2.map(x => x.tree)).eqls([3, 4])
      expect(components["/Ax"].stateValues.value.tree).eqls(1)


      cy.log('move A').then(async () => {
        await components["/A"].movePoint({ x: -9, y: -3 })

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-9, -3])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-9, -3])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)

      });

      cy.log('move B').then(async () => {
        await components["/B"].movePoint({ x: -2, y: 6 })

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-9, -3])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([-2, 6])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-9, -3])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([-2, 6])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)



      });

      cy.log('move l').then(async () => {
        let components = Object.assign({}, win.state.components);
        await components["/l"].moveLine({
          point1coords: [-7, -6],
          point2coords: [8, 0]
        });

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-7, -6])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([8, 0])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-7, -6])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([8, 0])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)

      });

      cy.log('move A2').then(async () => {
        let components = Object.assign({}, win.state.components);
        await components["/A2"].movePoint({ x: 5, y: 4 })

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-7, -6])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([8, 0])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-7, -6])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([8, 0])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([5, 4])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)

      });


      cy.log('move l2').then(async () => {
        let components = Object.assign({}, win.state.components);
        await components["/l2"].moveLine({
          point1coords: [-5, 9],
          point2coords: [-4, -1]
        });

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-7, -6])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([8, 0])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-7, -6])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([8, 0])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([5, 4])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([-5, 9])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([-4, -1])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)

      });


      cy.log('move A3').then(async () => {
        await components["/A3"].movePoint({ x: 6, y: -3 })

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-7, -6])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([8, 0])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-7, -6])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([8, 0])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([5, 4])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([-5, 9])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([-4, -1])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([6, -3])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)
      });

      cy.log('move A4').then(async () => {
        await components["/A4"].movePoint({ x: -2, y: 7 })

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-7, -6])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([8, 0])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-7, -6])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([8, 0])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([5, 4])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([-5, 9])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([-4, -1])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([6, -3])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([-2, 7])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)
      });

      cy.log('move B4').then(async () => {
        await components["/B4"].movePoint({ x: -9, y: -8 })

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-7, -6])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([8, 0])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-7, -6])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([8, 0])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([5, 4])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([-5, 9])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([-4, -1])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([6, -3])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([-2, 7])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([-9, -8])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([1, 2])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)
      });

      cy.log('move A5').then(async () => {
        await A5.movePoint({ x: -10, y: -9 })

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-7, -6])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([8, 0])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-7, -6])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([8, 0])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([5, 4])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([-5, 9])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([-4, -1])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([6, -3])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([-2, 7])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([-9, -8])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([-10, -9])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([3, 4])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([-10, -9])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([3, 4])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)
      });

      cy.log('move B5').then(async () => {
        await B5.movePoint({ x: -8, y: -7 })

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-7, -6])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([8, 0])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-7, -6])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([8, 0])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([5, 4])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([-5, 9])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([-4, -1])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([6, -3])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([-2, 7])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([-9, -8])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([-10, -9])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([-8, -7])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([-10, -9])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([-8, -7])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)
      });

      cy.log('move l3').then(async () => {
        await l3.moveLine({
          point1coords: [6, 5],
          point2coords: [4, -3]
        });

        expect(components["/A"].stateValues.xs.map(x => x.tree)).eqls([-7, -6])
        expect(components["/B"].stateValues.xs.map(x => x.tree)).eqls([8, 0])
        expect(components["/l"].stateValues.point1.map(x => x.tree)).eqls([-7, -6])
        expect(components["/l"].stateValues.point2.map(x => x.tree)).eqls([8, 0])
        expect(components["/A2"].stateValues.xs.map(x => x.tree)).eqls([5, 4])
        expect(components["/l2"].stateValues.point1.map(x => x.tree)).eqls([-5, 9])
        expect(components["/l2"].stateValues.point2.map(x => x.tree)).eqls([-4, -1])
        expect(components["/A3"].stateValues.xs.map(x => x.tree)).eqls([6, -3])
        expect(components["/A4"].stateValues.xs.map(x => x.tree)).eqls([-2, 7])
        expect(components["/B4"].stateValues.xs.map(x => x.tree)).eqls([-9, -8])
        expect(A5.stateValues.xs.map(x => x.tree)).eqls([6, 5])
        expect(B5.stateValues.xs.map(x => x.tree)).eqls([4, -3])
        expect(l3.stateValues.point1.map(x => x.tree)).eqls([6, 5])
        expect(l3.stateValues.point2.map(x => x.tree)).eqls([4, -3])
        expect(components["/Ax"].stateValues.value.tree).eqls(1)
      });


    })
  });

  it('copy string with no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Hello</p>
    <copy target="_p1" assignNames="p2" link="false" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/_p1").should('have.text', 'Hello')
    cy.get("#\\/p2").should('have.text', 'Hello')

  });

  // This was causing a duplicate componentName error
  it('copy group with assignNames inside with no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><group name="g"><text name="m">hello</text> <copy target="m" assignNames="q" /></group></p>
    <p><copy target="g" link="false" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/_p1").should('have.text', 'hello hello')
    cy.get("#\\/_p2").should('have.text', 'hello hello')

  });

  it('copy group with copies with no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group>
      <p><math name="twox">x+x</math></p>
      <copy target="twox" name="ctwox" assignNames="twoxa" />
      <copy target="twox" name="c2twox" assignNames="twoxb" />
    </group>
    
    <copy target="twox" assignNames="twoxc" />
    <copy target="twox" link="false" assignNames="twoxd" />
    
    <copy target="twoxa" assignNames="twoxe" />
    <copy target="twoxa" link="false" assignNames="twoxf" />
    
    <copy target="ctwox" assignNames="twoxg" />
    <copy target="ctwox" link="false" assignNames="twoxh" />

    <copy target="twoxb" assignNames="twoxi" />
    <copy target="twoxb" link="false" assignNames="twoxj" />
    
    <copy target="c2twox" assignNames="twoxk" />
    <copy target="c2twox" link="false" assignNames="twoxl" />
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxb").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxc").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxd").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxe").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxf").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxh").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxi").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxj").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxk").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxl").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })

  });

  it('copy group with copy overwriting attribute, no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="g">
      <textinput name="sim" prefill="full" />
    
      <p><math name="twox">x+x</math>
      <copy target="twox" simplify="$sim" name="ctwox" assignNames="twoxa" />
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    <copy target="g" link="false" assignNames="g2" />
    <copy target="g2" link="false" assignNames="g3" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let sima = cesc('#' + components["/g2"].replacements[1].componentName + '_input');
      let pg2 = components["/g2"].replacements[3];
      let twoxb = cesc('#' + pg2.activeChildren[0].componentName);
      let twoxc = cesc('#' + pg2.activeChildren[2].componentName);
      let threexa = cesc('#' + pg2.activeChildren[4].componentName);

      let simb = cesc('#' + components["/g3"].replacements[1].componentName + '_input');
      let pg3 = components["/g3"].replacements[3];
      let twoxd = cesc('#' + pg3.activeChildren[0].componentName);
      let twoxe = cesc('#' + pg3.activeChildren[2].componentName);
      let threexb = cesc('#' + pg3.activeChildren[4].componentName);


      cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("2x")
      })
      cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("3x")
      })

      cy.get(twoxb).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(twoxc).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("2x")
      })
      cy.get(threexa).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("3x")
      })

      cy.get(twoxd).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(twoxe).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("2x")
      })
      cy.get(threexb).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("3x")
      })


      cy.log('change first simplify')
      cy.get('#\\/sim_input').clear().type("none{enter}")

      cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
      })

      cy.get(twoxb).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(twoxc).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("2x")
      })
      cy.get(threexa).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("3x")
      })

      cy.get(twoxd).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(twoxe).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("2x")
      })
      cy.get(threexb).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("3x")
      })


      cy.log('change second simplify')
      cy.get(sima).clear().type("none{enter}")

      cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
      })

      cy.get(twoxb).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(twoxc).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(threexa).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
      })

      cy.get(twoxd).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(twoxe).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("2x")
      })
      cy.get(threexb).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("3x")
      })


      cy.log('change third simplify')
      cy.get(simb).clear().type("none{enter}")

      cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
      })

      cy.get(twoxb).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(twoxc).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(threexa).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
      })

      cy.get(twoxd).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(twoxe).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x")
      })
      cy.get(threexb).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
      })

    })

  });

  it('copy group with link through assignNames of external, no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="g" newNamespace>
    <copy uri="doenet:contentId=CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" assignNames="p" />
    <p>Credit achieved: <copy prop="creditAchieved" target="p/derivativeProblem/_answer1" assignNames="ca" /></p>
    </group>
    
    <copy target="g" link="false" assignNames="g2" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mathinput1Anchor = cesc('#' + components["/g/p/derivativeProblem/_answer1"].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput2Anchor = cesc('#' + components["/g2/p/derivativeProblem/_answer1"].stateValues.inputChildren[0].componentName) + " textarea";

      cy.get(cesc('#/g/ca')).should('have.text', '0')
      cy.get(cesc('#/g2/ca')).should('have.text', '0')

      cy.get(mathinput1Anchor).type("2x{enter}", { force: true })

      cy.get(cesc('#/g/ca')).should('have.text', '1')
      cy.get(cesc('#/g2/ca')).should('have.text', '0')

      cy.get(mathinput2Anchor).type("2x{enter}", { force: true })

      cy.get(cesc('#/g/ca')).should('have.text', '1')
      cy.get(cesc('#/g2/ca')).should('have.text', '1')

    });
  });

  it('copy group, no link, with function adapted to curve', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name='g'>
      <graph>
        <function>x</function>
      </graph>
    </group>
    
    <copy target='g' link="false" />
    `}, "*");
    });

    // just testing that page loads, i.e., that bug is removed so that don't get error
    cy.get('#\\/_text1').should('have.text', 'a');


  });

  it('copy group, no link, copy to external inside attribute', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput name="external" prefill="bye" />

    <group name="g" newNamespace>
      <copy target="/external" prop="value" assignNames="w" />
      <point label="$(/external)" name="P">(a,b)</point>
      <copy prop="label" target="P" assignNames="Plabel" />
    </group>
    
    <copy target="g" assignNames="g2" link="false" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/g/w')).should('have.text', 'bye')
    cy.get(cesc('#/g/Plabel')).should('have.text', 'bye')
    cy.get(cesc('#/g2/w')).should('have.text', 'bye')
    cy.get(cesc('#/g2/Plabel')).should('have.text', 'bye')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/g/P"].stateValues.label).eq('bye')
      expect(components["/g2/P"].stateValues.label).eq('bye')

    })

    cy.get(cesc('#/external_input')).clear().type('hi{enter}')

    cy.get(cesc('#/g/w')).should('have.text', 'hi')
    cy.get(cesc('#/g/Plabel')).should('have.text', 'hi')
    cy.get(cesc('#/g2/w')).should('have.text', 'bye')
    cy.get(cesc('#/g2/Plabel')).should('have.text', 'bye')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/g/P"].stateValues.label).eq('hi')
      expect(components["/g2/P"].stateValues.label).eq('bye')
    })

  });

  it('copy group, no link, internal copy to source alias is linked', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <group name="g" newNamespace>
      <textinput name="ti" prefill="hello" />
      <map assignNames="a">
        <template newNamespace>
          <copy target="x" assignNames="w" />
          <point label="$x" name="P">(a,b)</point>
          <copy prop="label" target="P" assignNames="Plabel" />


        </template>
        <sources alias="x">
          $ti
        </sources>
      </map>
    </group>
    
    <copy target="g" assignNames="g2" link="false" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/g/a/w')).should('have.text', 'hello')
    cy.get(cesc('#/g/a/Plabel')).should('have.text', 'hello')
    cy.get(cesc('#/g2/a/w')).should('have.text', 'hello')
    cy.get(cesc('#/g2/a/Plabel')).should('have.text', 'hello')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/g/a/P"].stateValues.label).eq('hello')
      expect(components["/g2/a/P"].stateValues.label).eq('hello')

    })

    cy.get(cesc('#/g/ti_input')).clear().type('one{enter}')
    cy.get(cesc('#/g2/ti_input')).clear().type('two{enter}')

    cy.get(cesc('#/g/a/w')).should('have.text', 'one')
    cy.get(cesc('#/g/a/Plabel')).should('have.text', 'one')
    cy.get(cesc('#/g2/a/w')).should('have.text', 'two')
    cy.get(cesc('#/g2/a/Plabel')).should('have.text', 'two')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/g/a/P"].stateValues.label).eq('one')
      expect(components["/g2/a/P"].stateValues.label).eq('two')
    })

  });


  it('copy no link containing external copies use absolute target', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group newNamespace name="g">
      <p>m = <copy target="../m" assignNames="m1" /></p>
      <p>m = <copy target="../m" assignNames="m2" link="false" /></p>
    </group>
    
    <copy target="g" assignNames="g2" />
    <copy target="g" link="false" assignNames="g3" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/n')).should('have.text', '2')
    cy.get(cesc('#/m')).should('have.text', '4')
    cy.get(cesc('#/g/m1')).should('have.text', '4')
    cy.get(cesc('#/g/m2')).should('have.text', '4')
    cy.get(cesc('#/g2/m1')).should('have.text', '4')
    cy.get(cesc('#/g2/m2')).should('have.text', '4')
    cy.get(cesc('#/g3/m1')).should('have.text', '4')
    cy.get(cesc('#/g3/m2')).should('have.text', '4')

  });


  it('copy dynamic map no link, check aliases', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <section name="section1" newNamespace>
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" label="Add p" target="n" newValue="$n+1" />
      <updateValue name="removeP" label="Remove p" target="n" newValue="$n-1" />
      <map assignNames="(p1) (p2) (p3) (p4)">
        <template><p>i=$i, v=$v</p></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </section>
    
    <section name="section2" newNamespace>
      <copy target='../section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section3">
      <copy target='section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <copy target='section1' link='false' assignNames="section4" />
    
    <section name="section5" newNamespace>
      <copy target='../section1/_map1' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section6">
      <copy target='section1/_map1' assignNames='(p1a) (p2a) (p3a) (p4a)' />
    </section>

    <copy target='section1' assignNames="section7" />
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/section1_title')).should('have.text', 'Section 1')
    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2_title')).should('have.text', 'Section 2')
    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/section3_title')).should('have.text', 'Section 3')
    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4_title')).should('have.text', 'Section 4')
    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5_title')).should('have.text', 'Section 5')
    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/section6_title')).should('have.text', 'Section 6')
    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7_title')).should('have.text', 'Section 1')
    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section1/addP')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section7/removeP')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section4/addP')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section4/removeP')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


  });


  it('external content cannot reach outside namespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <copy uri="doenet:contentid=fa2e015536a5f55c6faa455f2ef280d5e8a23c9b89281d2759eebca4ba0d463b" assignNames="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/hi')).should('have.text', 'Bye');

    cy.get(cesc('#/greetings/hi')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c5')).should('have.text', 'Hello');


    cy.get(cesc('#/greetings/s/hi')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c4')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/s/s/hi')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l1')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/m1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c5')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c5')).should('have.text', 'Hello');

  });


  it('external content inside external content cannot reach outside namespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <copy uri="doenet:contentId=efe76666130b9e6d61e6162f19467c9564f964cd9f5e2b63244ec279ac54a869" assignNames="greet" />

    <p>Don't get this 2: <text name="hi">Leave</text></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/hi')).should('have.text', 'Leave');

    cy.get(cesc('#/greet/hi')).should('have.text', 'Bye');

    cy.get(cesc('#/greet/greetings/hi')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c5')).should('have.text', 'Hello');


    cy.get(cesc('#/greet/greetings/s/hi')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/l1')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c4')).should('have.text', 'Hello');

    cy.get(cesc('#/greet/greetings/s/s/hi')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greet/greetings/s/s/l1')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greet/greetings/s/s/m1')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c5')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c5')).should('have.text', 'Hello');

  });

  it('copy of template source maintained when withheld', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput name="n" /></p>

    <graph name='g1'>
      <map name="map1" assignNames="t1 t2">
        <template newNamespace>
          <point name="A" x="$(i{link='false' fixed='false'})" y='1'/>
        </template>
        <sources alias="i"><sequence from="1" to="$n" /></sources>
      </map>
    </graph>
    
    <p><m name="m1">A_1 = <copy target="t1/A" displayDigits="3" /></m></p>
    <p><m name="m2">A_2 = <copy target="t2/A" displayDigits="3" /></m></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })

    cy.log('Add point')

    cy.get('#\\/n textarea').type("1{enter}", { force: true })
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(1,1)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })


    cy.log('Move point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/t1/A"].movePoint({ x: -3, y: 7 })
    })

    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(−3,7)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })


    cy.log('Remove point')
    cy.get('#\\/n textarea').type("{end}{backspace}0{enter}", { force: true })

    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })


    cy.log('Remember coordinates when restore point since copy was maintained')

    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get('#\\/m1 .mjx-mrow').should('contain.text', 'A1=(−3,7)')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(−3,7)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })


    cy.log('Add second point')

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(−3,7)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=(2,1)')
    })


    cy.log('Move second point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/t2/A"].movePoint({ x: 5, y: -4 })
    })

    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(−3,7)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=(5,−4)')
    })


    cy.log('Remove both points')
    cy.get('#\\/n textarea').type("{end}{backspace}0{enter}", { force: true })

    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })


    cy.log('Remember coordinates of both points')

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(−3,7)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=(5,−4)')
    })


  });


  it('trim whitespace off target', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text name="hi">Hello</text>
    <p><copy target=" hi  " /> there</p>
    `}, "*");
    });

    cy.get('#\\/hi').should('have.text', 'Hello');
    cy.get('#\\/_p1').should('have.text', 'Hello there')


  });


});