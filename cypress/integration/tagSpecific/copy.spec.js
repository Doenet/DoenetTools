describe('Copy Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

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
      expect(components['/b'].replacements[0].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(components['/_math2'].stateValues.modifyIndirectly).eq(true);
      expect(components['/c'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/d'].replacements[0].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/_point1'].stateValues.label).eq("A");
      expect(components['/e'].replacements[0].stateValues.label).eq("A");
      expect(components['/f'].replacements[0].replacements[0].stateValues.label).eq("A");

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
      expect(components['/r3'].replacements[0].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/r4'].replacements[0].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/r5'].replacements[0].replacements[0].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(components['/r6'].replacements[0].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(components['/r7'].replacements[0].replacements[0].replacements[0].stateValues.modifyIndirectly).eq(false);

      expect(components['/A'].stateValues.label).eq("A");
      expect(components['/A2'].replacements[0].stateValues.label).eq("A");
      expect(components['/B'].replacements[0].stateValues.label).eq("B");
      expect(components['/C'].replacements[0].replacements[0].stateValues.label).eq("C");
      expect(components['/C2'].replacements[0].replacements[0].replacements[0].stateValues.label).eq("C");

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
      expect(components['/frmt2'].replacements[0].stateValues.hide).eq(true);
      expect(components['/frmt2'].replacements[0].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(components['/frmt3'].replacements[0].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(components['/frmt3'].replacements[0].replacements[0].stateValues.value).eq("text");
      expect(components['/frmt3'].replacements[0].replacements[0].stateValues.hide).eq(true);

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
      <point>(<copy prop="y" tname="p2"/>, <copy prop="x1" tname="p2"/>)</point>
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
    <vector><displacement>(-4,2)</displacement><tail>(1,1)</tail></vector>
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
      let vector3 = components["/d2"].replacements[0].replacements[0];

      cy.log(`initial positions`);
      cy.window().then((win) => {
        let displacement = [-4, 2];
        let v_tail = [1, 1];
        let d_tail = [0, 0];
        let v_head = displacement.map((x, i) => x + v_tail[i]);
        let d_head = displacement.map((x, i) => x + d_tail[i]);

        expect(components['/_vector1'].stateValues.tail.map(x=>x.tree)).eqls([...v_tail]);
        expect(components['/_vector1'].stateValues.head.map(x=>x.tree)).eqls([...v_head]);
        expect(components['/_vector1'].stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
        expect(vector2.stateValues.tail.map(x=>x.tree)).eqls([...d_tail]);
        expect(vector2.stateValues.head.map(x=>x.tree)).eqls([...d_head]);
        expect(vector2.stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
        expect(vector3.stateValues.tail.map(x=>x.tree)).eqls([...d_tail]);
        expect(vector3.stateValues.head.map(x=>x.tree)).eqls([...d_head]);
        expect(vector3.stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
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
        expect(components['/_vector1'].stateValues.tail.map(x=>x.tree)).eqls([...v_tail]);
        expect(components['/_vector1'].stateValues.head.map(x=>x.tree)).eqls([...v_head]);
        expect(components['/_vector1'].stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
        expect(vector2.stateValues.tail.map(x=>x.tree)).eqls([...d_tail]);
        expect(vector2.stateValues.head.map(x=>x.tree)).eqls([...d_head]);
        expect(vector2.stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
        expect(vector3.stateValues.tail.map(x=>x.tree)).eqls([...d_tail]);
        expect(vector3.stateValues.head.map(x=>x.tree)).eqls([...d_head]);
        expect(vector3.stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
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
        expect(components['/_vector1'].stateValues.tail.map(x=>x.tree)).eqls([...v_tail]);
        expect(components['/_vector1'].stateValues.head.map(x=>x.tree)).eqls([...v_head]);
        expect(components['/_vector1'].stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
        expect(vector2.stateValues.tail.map(x=>x.tree)).eqls([...d_tail]);
        expect(vector2.stateValues.head.map(x=>x.tree)).eqls([...d_head]);
        expect(vector2.stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
        expect(vector3.stateValues.tail.map(x=>x.tree)).eqls([...d_tail]);
        expect(vector3.stateValues.head.map(x=>x.tree)).eqls([...d_head]);
        expect(vector3.stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
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
        expect(components['/_vector1'].stateValues.tail.map(x=>x.tree)).eqls([...v_tail]);
        expect(components['/_vector1'].stateValues.head.map(x=>x.tree)).eqls([...v_head]);
        expect(components['/_vector1'].stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
        expect(vector2.stateValues.tail.map(x=>x.tree)).eqls([...d_tail]);
        expect(vector2.stateValues.head.map(x=>x.tree)).eqls([...d_head]);
        expect(vector2.stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
        expect(vector3.stateValues.tail.map(x=>x.tree)).eqls([...d_tail]);
        expect(vector3.stateValues.head.map(x=>x.tree)).eqls([...d_head]);
        expect(vector3.stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
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
        expect(components['/_vector1'].stateValues.tail.map(x=>x.tree)).eqls([...v_tail]);
        expect(components['/_vector1'].stateValues.head.map(x=>x.tree)).eqls([...v_head]);
        expect(components['/_vector1'].stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
        expect(vector2.stateValues.tail.map(x=>x.tree)).eqls([...d_tail]);
        expect(vector2.stateValues.head.map(x=>x.tree)).eqls([...d_head]);
        expect(vector2.stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
        expect(vector3.stateValues.tail.map(x=>x.tree)).eqls([...d_tail]);
        expect(vector3.stateValues.head.map(x=>x.tree)).eqls([...d_head]);
        expect(vector3.stateValues.displacement.map(x=>x.tree)).eqls([...displacement]);
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
        <sequence><from>a</from><count><copy prop="value" tname="_mathinput1"/></count></sequence>
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

      let p2Anchor = "#" + components["/p2"].replacements[0].componentName;
      let p3Anchor = "#" + components["/p3"].replacements[0].replacements[0].componentName;

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


      cy.get('#\\/_mathinput1_input').clear().type("2{enter}");
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

      cy.get('#\\/_mathinput1_input').clear().type("5{enter}");
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

      cy.get('#\\/_mathinput1_input').clear().type("1{enter}");
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

      cy.get('#\\/_mathinput1_input').clear().type("6{enter}");
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

});