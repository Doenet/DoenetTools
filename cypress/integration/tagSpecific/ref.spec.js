describe('Ref Tag Tests',function() {

  beforeEach(() => {
    cy.visit('/test')
      
    })
      
  it('ref copies properties',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math modifybyreference="false">x</math>
    <ref name="a">_math1</ref>
    <ref name="b">a</ref>
    <math modifybyreference="true">x</math>
    <ref name="c">_math2</ref>
    <ref name="d">c</ref>
    <point label="A">(1,2)</point>
    <ref name="e">_point1</ref>
    <ref name="f">e</ref>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.log(`check properties`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_math1'].state.modifybyreference).eq(false);
      expect(components['/a'].replacements[0].state.modifybyreference).eq(false);
      expect(components['/b'].replacements[0].state.modifybyreference).eq(false);
      expect(components['/_math2'].state.modifybyreference).eq(true);
      expect(components['/c'].replacements[0].state.modifybyreference).eq(true);
      expect(components['/d'].replacements[0].state.modifybyreference).eq(true);
      expect(components['/_point1'].state.label).eq("A");
      expect(components['/e'].replacements[0].state.label).eq("A");
      expect(components['/f'].replacements[0].state.label).eq("A");
      
   })

  });

  it('ref overwrites properties',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math modifybyreference="false">x</math>
    <ref name="r1">_math1</ref>
    <ref name="r2" modifybyreference="true">_math1</ref>
    <ref name="r3" modifybyreference="true">r1</ref>
    <ref name="r4">r2</ref>
    <ref name="r5">r3</ref>
    <point label="A" name="A">(1,2)</point>
    <ref name="r6">A</ref>
    <ref label="B" name="B">A</ref>
    <ref label="C" name="C">B</ref>
    <ref name="r7">C</ref>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.log(`check properties`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_math1'].state.modifybyreference).eq(false);
      expect(components['/r1'].replacements[0].state.modifybyreference).eq(false);
      expect(components['/r2'].replacements[0].state.modifybyreference).eq(true);
      expect(components['/r3'].replacements[0].state.modifybyreference).eq(true);
      expect(components['/r4'].replacements[0].state.modifybyreference).eq(true);
      expect(components['/r5'].replacements[0].state.modifybyreference).eq(true);
      expect(components['/a'].state.label).eq("A");
      expect(components['/r6'].replacements[0].state.label).eq("A");
      expect(components['/b'].replacements[0].state.label).eq("B");
      expect(components['/c'].replacements[0].state.label).eq("C");
      expect(components['/r7'].replacements[0].state.label).eq("C");
      
   })
  });

  it('ref props',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math name="x" modifybyreference="false">x</math>
    <ref name="mr" prop="modifybyreference">x</ref>
    <ref name="frmt" prop="format" modifybyreference="true">x</ref>
    <ref name="frmt2" hide>frmt</ref>
    <point name="A" label="A">(1,2)</point>
    <ref name="cA" prop="coords">A</ref>
    <ref name="l" prop="latex">cA</ref>
    <ref name="lmr" prop="latex" modifybyreference="false">cA</ref>
    <ref name="A2">A</ref>
    <ref name="cA2" prop="coords">A2</ref>
    <ref name="l2" prop="latex">cA2</ref>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/x .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.log(`check properties`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/x'].state.modifybyreference).eq(false);
      expect(components['/mr'].replacements[0].state.modifybyreference).eq(false);
      expect(components['/mr'].replacements[0].state.value).eq(false);
      expect(components['/frmt'].replacements[0].state.modifybyreference).eq(true);
      expect(components['/frmt'].replacements[0].state.value).eq("text");
      expect(components['/frmt'].replacements[0].state.hide).eq(false);
      expect(components['/frmt2'].replacements[0].state.modifybyreference).eq(true);
      expect(components['/frmt2'].replacements[0].state.value).eq("text");
      expect(components['/frmt2'].replacements[0].state.hide).eq(true);
      expect(components['/a'].state.label).eq("A");
      expect(components['/ca'].replacements[0].downstreamDependencies['/a'].dependencyType).eq("referenceShadow");
      expect(components['/l'].replacements[0].state.value).eq("\\left( 1, 2 \\right)");
      expect(components['/l'].replacements[0].state.modifybyreference).eq(true);
      expect(components['/lmr'].replacements[0].state.value).eq("\\left( 1, 2 \\right)");
      expect(components['/lmr'].replacements[0].state.modifybyreference).eq(false);
      expect(components['/a2'].replacements[0].state.label).eq("A");
      expect(components['/ca2'].replacements[0].downstreamDependencies.__point1.dependencyType).eq("referenceShadow");
      expect(components['/l2'].replacements[0].state.value).eq("\\left( 1, 2 \\right)");
      
    })
  });

  it('ref props of ref still updatable',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <graph>
    <point>(1,2)</point>
    </graph>
    
    <graph>
      <ref>_point1</ref>
      <point>(<ref prop="y">_ref1</ref>, <ref prop="x1">_ref1</ref>)</point>
    </graph>
    <ref prop="y">_point1</ref>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__math3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.log(`initial position`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_point1'].state.xs[0].tree).eq(1);
      expect(components['/_point1'].state.xs[1].tree).eq(2);
      expect(components.__point1.state.xs[0].tree).eq(1);
      expect(components.__point1.state.xs[1].tree).eq(2);
      expect(components['/_point2'].state.xs[0].tree).eq(2);
      expect(components['/_point2'].state.xs[1].tree).eq(1);
    })

    cy.log(`move point 1`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: -3, y: 5});
      expect(components['/_point1'].state.xs[0].tree).eq(-3);
      expect(components['/_point1'].state.xs[1].tree).eq(5);
      expect(components.__point1.state.xs[0].tree).eq(-3);
      expect(components.__point1.state.xs[1].tree).eq(5);
      expect(components['/_point2'].state.xs[0].tree).eq(5);
      expect(components['/_point2'].state.xs[1].tree).eq(-3);
    })

    cy.log(`move point 2`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components.__point1.movePoint({x: 6, y: -9});
      expect(components['/_point1'].state.xs[0].tree).eq(6);
      expect(components['/_point1'].state.xs[1].tree).eq(-9);
      expect(components.__point1.state.xs[0].tree).eq(6);
      expect(components.__point1.state.xs[1].tree).eq(-9);
      expect(components['/_point2'].state.xs[0].tree).eq(-9);
      expect(components['/_point2'].state.xs[1].tree).eq(6);
    })

    cy.log(`move point 3`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point2'].movePoint({x: -1, y: -7});
      expect(components['/_point1'].state.xs[0].tree).eq(-7);
      expect(components['/_point1'].state.xs[1].tree).eq(-1);
      expect(components.__point1.state.xs[0].tree).eq(-7);
      expect(components.__point1.state.xs[1].tree).eq(-1);
      expect(components['/_point2'].state.xs[0].tree).eq(-1);
      expect(components['/_point2'].state.xs[1].tree).eq(-7);
    })

  });

  it.skip('ref invalid prop',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>x</math>
    <ref prop="label">_math1</ref>

    <point label="A">x</point>
    <ref>_point1</ref>
    <ref prop="format">_ref1</ref>

    <ref name="A2">A</ref>
    <ref name="cA2" prop="coords">A2</ref>
    <ref name="lcA2" prop="label">cA2</ref>
    <ref name="llcA2" label="B">cA2</ref>

    `},"*");
    });

    cy.get('#__math1') //wait for page to load


    // How to check if the right errors get thrown for these?

  });

  it('ref of prop ref shadows target',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <extract prop="y"><ref prop="head">_vector1</ref></extract>
    <graph>
    <vector><displacement>(-4,2)</displacement><tail>(1,1)</tail></vector>
    </graph>
  
    <graph>
    <ref prop="displacement" name="d1">_vector1</ref>
    </graph>
  
    <graph>
    <ref>d1</ref>
    </graph>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.log(`initial positions`);
    cy.window().then((win) => {
      let displacement = [-4,2];
      let v_tail = [1,1];
      let d_tail = [0,0];
      let v_head = displacement.map((x,i) => x + v_tail[i]);
      let d_head = displacement.map((x,i) => x + d_tail[i]);
      
      let components = Object.assign({},win.state.components);
      expect(components['/_vector1'].state.tail.tree).eqls(["tuple", ...v_tail]);
      expect(components['/_vector1'].state.head.tree).eqls(["tuple", ...v_head]);
      expect(components['/_vector1'].state.displacement.tree).eqls(["tuple",...displacement]);
      expect(components.__vector1.state.tail.tree).eqls(["tuple", ...d_tail]);
      expect(components.__vector1.state.head.tree).eqls(["tuple", ...d_head]);
      expect(components.__vector1.state.displacement.tree).eqls(["tuple",...displacement]);
      expect(components.__vector2.state.tail.tree).eqls(["tuple", ...d_tail]);
      expect(components.__vector2.state.head.tree).eqls(["tuple", ...d_head]);
      expect(components.__vector2.state.displacement.tree).eqls(["tuple",...displacement]);
    })

    cy.log(`move vector 1`);
    cy.window().then((win) => {
      let displacement = [3,1];
      let v_tail = [-1,4];
      let d_tail = [0,0];
      let v_head = displacement.map((x,i) => x + v_tail[i]);
      let d_head = displacement.map((x,i) => x + d_tail[i]);

      let components = Object.assign({},win.state.components);
      components['/_vector1'].moveVector({
        tailcoords: v_tail,
        headcoords: v_head,
      })
      expect(components['/_vector1'].state.tail.tree).eqls(["tuple", ...v_tail]);
      expect(components['/_vector1'].state.head.tree).eqls(["tuple", ...v_head]);
      expect(components['/_vector1'].state.displacement.tree).eqls(["tuple",...displacement]);
      expect(components.__vector1.state.tail.tree).eqls(["tuple", ...d_tail]);
      expect(components.__vector1.state.head.tree).eqls(["tuple", ...d_head]);
      expect(components.__vector1.state.displacement.tree).eqls(["tuple",...displacement]);
      expect(components.__vector2.state.tail.tree).eqls(["tuple", ...d_tail]);
      expect(components.__vector2.state.head.tree).eqls(["tuple", ...d_head]);
      expect(components.__vector2.state.displacement.tree).eqls(["tuple",...displacement]);
    })

    cy.log(`move vector 2`);
    cy.window().then((win) => {
      let displacement = [5,-2];
      let v_tail = [-1,4];
      let d_tail = [3,-7];
      let v_head = displacement.map((x,i) => x + v_tail[i]);
      let d_head = displacement.map((x,i) => x + d_tail[i]);

      let components = Object.assign({},win.state.components);
      components.__vector1.moveVector({
        tailcoords: d_tail,
        headcoords: d_head,
      })
      expect(components['/_vector1'].state.tail.tree).eqls(["tuple", ...v_tail]);
      expect(components['/_vector1'].state.head.tree).eqls(["tuple", ...v_head]);
      expect(components['/_vector1'].state.displacement.tree).eqls(["tuple",...displacement]);
      expect(components.__vector1.state.tail.tree).eqls(["tuple", ...d_tail]);
      expect(components.__vector1.state.head.tree).eqls(["tuple", ...d_head]);
      expect(components.__vector1.state.displacement.tree).eqls(["tuple",...displacement]);
      expect(components.__vector2.state.tail.tree).eqls(["tuple", ...d_tail]);
      expect(components.__vector2.state.head.tree).eqls(["tuple", ...d_head]);
      expect(components.__vector2.state.displacement.tree).eqls(["tuple",...displacement]);
    })

    cy.log(`move vector 3`);
    cy.window().then((win) => {
      let displacement = [-3,6];
      let v_tail = [-1,4];
      let d_tail = [4,-2];
      let v_head = displacement.map((x,i) => x + v_tail[i]);
      let d_head = displacement.map((x,i) => x + d_tail[i]);

      let components = Object.assign({},win.state.components);
      components.__vector2.moveVector({
        tailcoords: d_tail,
        headcoords: d_head,
      })
      expect(components['/_vector1'].state.tail.tree).eqls(["tuple", ...v_tail]);
      expect(components['/_vector1'].state.head.tree).eqls(["tuple", ...v_head]);
      expect(components['/_vector1'].state.displacement.tree).eqls(["tuple",...displacement]);
      expect(components.__vector1.state.tail.tree).eqls(["tuple", ...d_tail]);
      expect(components.__vector1.state.head.tree).eqls(["tuple", ...d_head]);
      expect(components.__vector1.state.displacement.tree).eqls(["tuple",...displacement]);
      expect(components.__vector2.state.tail.tree).eqls(["tuple", ...d_tail]);
      expect(components.__vector2.state.head.tree).eqls(["tuple", ...d_head]);
      expect(components.__vector2.state.displacement.tree).eqls(["tuple",...displacement]);
    })

    cy.log(`move vector 1`);
    cy.window().then((win) => {
      let displacement = [5,0];
      let v_tail = [-8,6];
      let d_tail = [4,-2];
      let v_head = displacement.map((x,i) => x + v_tail[i]);
      let d_head = displacement.map((x,i) => x + d_tail[i]);

      let components = Object.assign({},win.state.components);
      components['/_vector1'].moveVector({
        tailcoords: v_tail,
        headcoords: v_head,
      })
      expect(components['/_vector1'].state.tail.tree).eqls(["tuple", ...v_tail]);
      expect(components['/_vector1'].state.head.tree).eqls(["tuple", ...v_head]);
      expect(components['/_vector1'].state.displacement.tree).eqls(["tuple",...displacement]);
      expect(components.__vector1.state.tail.tree).eqls(["tuple", ...d_tail]);
      expect(components.__vector1.state.head.tree).eqls(["tuple", ...d_head]);
      expect(components.__vector1.state.displacement.tree).eqls(["tuple",...displacement]);
      expect(components.__vector2.state.tail.tree).eqls(["tuple", ...d_tail]);
      expect(components.__vector2.state.head.tree).eqls(["tuple", ...d_head]);
      expect(components.__vector2.state.displacement.tree).eqls(["tuple",...displacement]);
    })

  });

  it('ref of child number',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <mathinput />

    <math>
      <sequence><to><ref prop="value">_mathinput1</ref></to></sequence>
      <math>a</math>
      <math>b</math>
      <math>c</math>
    </math>

    <ref prop="childnumber">_math2</ref>
    <ref prop="childnumber">_math4</ref>
    <ref prop="childnumber">_math1</ref>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text','a');

    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_ref2'].replacements[0].state.number).eq(1);
      expect(components['/_ref3'].replacements[0].state.number).eq(3);
      expect(components['/_ref4'].replacements[0].state.number).eq(5);
    })

    cy.get('#\\/_mathinput1_input').clear().type("2{enter}");

    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_ref2'].replacements[0].state.number).eq(3);
      expect(components['/_ref3'].replacements[0].state.number).eq(5);
      expect(components['/_ref4'].replacements[0].state.number).eq(5);
    })

    cy.get('#\\/_mathinput1_input').clear().type("1{enter}");

    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_ref2'].replacements[0].state.number).eq(2);
      expect(components['/_ref3'].replacements[0].state.number).eq(4);
      expect(components['/_ref4'].replacements[0].state.number).eq(5);
    })

  });

  it('property children account for on replacement changes',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <mathinput />

    <p hide="false">
      <aslist hide="false">
        <sequence><from>a</from><count><ref prop="value">_mathinput1</ref></count></sequence>
      </aslist>
    </p>
    
    <p><ref name="al2">_aslist1</ref></p>
    <ref name="p2">_p1</ref>
    
    <p><ref>al2</ref></p>
    <ref>p2</ref>

    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text','a');

    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#__p1').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#__p2').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });


    cy.get('#\\/_mathinput1_input').clear().type("2{enter}");
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#__p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#__p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });

    cy.get('#\\/_mathinput1_input').clear().type("5{enter}");
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#__p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#__p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });

    cy.get('#\\/_mathinput1_input').clear().type("1{enter}");
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#__p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#__p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });

    cy.get('#\\/_mathinput1_input').clear().type("6{enter}");
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#__p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#__p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });

  });

});