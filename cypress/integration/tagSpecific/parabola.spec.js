import me from 'math-expressions';

describe('Parabola Tag Tests',function() {

  beforeEach(() => {
      cy.visit('/test')

    })
  
  it('parabola with no parameters gives y=x^2',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <graph>
    <parabola />
    <ref prop="vertex" name="v">_parabola1</ref>
    </graph>
    <graph>
    <ref name="p2">_parabola1</ref>
    <ref name="v2">v</ref>
    </graph>

    <ref prop="equation" name="e2">p2</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load
    cy.get('#__equation1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=x2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_parabola1'].state.a).eq(1);
      expect(components['/_parabola1'].state.b).eq(0);
      expect(components['/_parabola1'].state.c).eq(0);
      expect(components['/_parabola1'].state.equation.tree).eqls(me.fromText("y=x^2").tree);
      expect(components['/_parabola1'].state.vertex.evaluate_numbers().tree).eqls(["tuple",0,0]);
      expect(components['/v'].replacements[0].state.coords.evaluate_numbers().tree).eqls(["tuple",0,0]);
      expect(components['/p2'].replacements[0].state.a).eq(1);
      expect(components['/p2'].replacements[0].state.b).eq(0);
      expect(components['/p2'].replacements[0].state.c).eq(0);
      expect(components['/p2'].replacements[0].state.equation.tree).eqls(me.fromText("y=x^2").tree);
      expect(components['/p2'].replacements[0].state.vertex.evaluate_numbers().tree).eqls(["tuple",0,0]);
      expect(components['/v2'].replacements[0].state.coords.evaluate_numbers().tree).eqls(["tuple",0,0]);
      expect(components['/e2'].replacements[0].state.value.tree).eqls(me.fromText("y=x^2").tree);


    })

  });
  
  it('parabola through no points gives y=x^2',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <graph>
    <parabola><through></through></parabola>
    <ref prop="vertex" name="v">_parabola1</ref>
    </graph>
    <graph>
    <ref name="p2">_parabola1</ref>
    <ref name="v2">v</ref>
    </graph>

    <ref prop="equation" name="e2">p2</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load
    cy.get('#__equation1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=x2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_parabola1'].state.a).eq(1);
      expect(components['/_parabola1'].state.b).eq(0);
      expect(components['/_parabola1'].state.c).eq(0);
      expect(components['/_parabola1'].state.equation.tree).eqls(me.fromText("y=x^2").tree);
      expect(components['/_parabola1'].state.vertex.evaluate_numbers().tree).eqls(["tuple",0,0]);
      expect(components['/v'].replacements[0].state.coords.evaluate_numbers().tree).eqls(["tuple",0,0]);
      expect(components['/p2'].replacements[0].state.a).eq(1);
      expect(components['/p2'].replacements[0].state.b).eq(0);
      expect(components['/p2'].replacements[0].state.c).eq(0);
      expect(components['/p2'].replacements[0].state.equation.tree).eqls(me.fromText("y=x^2").tree);
      expect(components['/p2'].replacements[0].state.vertex.evaluate_numbers().tree).eqls(["tuple",0,0]);
      expect(components['/v2'].replacements[0].state.coords.evaluate_numbers().tree).eqls(["tuple",0,0]);
      expect(components['/e2'].replacements[0].state.value.tree).eqls(me.fromText("y=x^2").tree);


    })

  });

  it('parabola through one point uses it as vertex',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <parabola><through><ref>_point1</ref></through></parabola>
    </graph>
    <graph>
    <ref name="p2">_parabola1</ref>
    <ref prop="vertex" name="v">_parabola1</ref>
    </graph>

    <ref prop="equation" name="e2">p2</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load
    cy.get('#__equation1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=x2−2x+3')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_parabola1'].state.a).eq(1);
      expect(components['/_parabola1'].state.b).eq(-2);
      expect(components['/_parabola1'].state.c).eq(3);
      expect(components['/_parabola1'].state.equation.tree).eqls(me.fromText("y=x^2-2x+3").evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/_parabola1'].state.vertex.evaluate_numbers().tree).eqls(["tuple",1,2]);
      expect(components['/v'].replacements[0].state.coords.evaluate_numbers().tree).eqls(["tuple",1,2]);
      expect(components['/p2'].replacements[0].state.a).eq(1);
      expect(components['/p2'].replacements[0].state.b).eq(-2);
      expect(components['/p2'].replacements[0].state.c).eq(3);
      expect(components['/p2'].replacements[0].state.equation.tree).eqls(me.fromText("y=x^2-2x+3").evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/p2'].replacements[0].state.vertex.evaluate_numbers().tree).eqls(["tuple",1,2]);
      expect(components['/e2'].replacements[0].state.value.tree).eqls(me.fromText("y=x^2-2x+3").evaluate_numbers({skip_ordering: true}).tree);


      components['/_point1'].movePoint({x: -3, y: -7});
      cy.get('#__equation1 .mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y=x2+6x+2')
      })
  
      expect(components['/_parabola1'].state.a).eq(1);
      expect(components['/_parabola1'].state.b).eq(6);
      expect(components['/_parabola1'].state.c).eq(2);
      expect(components['/_parabola1'].state.equation.tree).eqls(me.fromText("y=x^2+6x+2").evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/_parabola1'].state.vertex.evaluate_numbers().tree).eqls(["tuple",-3,-7]);
      expect(components['/v'].replacements[0].state.coords.evaluate_numbers().tree).eqls(["tuple",-3,-7]);
      expect(components['/p2'].replacements[0].state.a).eq(1);
      expect(components['/p2'].replacements[0].state.b).eq(6);
      expect(components['/p2'].replacements[0].state.c).eq(2);
      expect(components['/p2'].replacements[0].state.equation.tree).eqls(me.fromText("y=x^2+6x+2").evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/p2'].replacements[0].state.vertex.evaluate_numbers().tree).eqls(["tuple",-3,-7]);
      expect(components['/e2'].replacements[0].state.value.tree).eqls(me.fromText("y=x^2+6x+2").evaluate_numbers({skip_ordering: true}).tree);



    })



  });
 
  it('parabola through two points',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <parabola><through><ref>_point1</ref><ref>_point2</ref></through></parabola>
    </graph>
    <graph>
    <ref name="p2">_parabola1</ref>
    <ref prop="vertex" name="v">_parabola1</ref>
    </graph>

    <ref prop="equation" name="e2">p2</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load
    cy.get('#__equation1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=x2−3x+4')
    })

    let a = 1;
    let b = (2 - 4 - 1 + 9) / (1 - 3);
    let c = 2 - 1 - b*1;

    let vertex_x = -b / (2 * a);
    let vertex_y = c - b ** 2 / (4 * a)

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_parabola1'].state.a).eq(1);
      expect(components['/_parabola1'].state.b).eq(b);
      expect(components['/_parabola1'].state.c).eq(c);
      expect(components['/_parabola1'].state.equation.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/_parabola1'].state.vertex.evaluate_numbers().tree).eqls(["tuple",vertex_x, vertex_y]);
      expect(components['/v'].replacements[0].state.coords.evaluate_numbers().tree).eqls(["tuple",vertex_x, vertex_y]);
      expect(components['/p2'].replacements[0].state.a).eq(1);
      expect(components['/p2'].replacements[0].state.b).eq(b);
      expect(components['/p2'].replacements[0].state.c).eq(c);
      expect(components['/p2'].replacements[0].state.equation.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/p2'].replacements[0].state.vertex.evaluate_numbers().tree).eqls(["tuple",vertex_x, vertex_y]);
      expect(components['/e2'].replacements[0].state.value.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);

    });

    cy.log("move points on top of each other");

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      components['/_point1'].movePoint({x: 3, y: 4});
      
      cy.get('#__equation1 .mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y=NaN')
      })

      assert.isNaN(components['/_parabola1'].state.a);
      assert.isNaN(components['/_parabola1'].state.b);
      assert.isNaN(components['/_parabola1'].state.c);

      expect(components['/_parabola1'].state.vertex).eq(undefined);
      expect(components['/v'].replacements.length).eq(0);
      assert.isNaN(components['/p2'].replacements[0].state.a);
      assert.isNaN(components['/p2'].replacements[0].state.b);
      assert.isNaN(components['/p2'].replacements[0].state.c);
      expect(components['/p2'].replacements[0].state.vertex).eq(undefined)

    })

    cy.log("move points ");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let x1 = -1, x2 = -8;
      let y1 = 5, y2 = -2;

      components['/_point1'].movePoint({x: x1, y: y1});
      components['/_point2'].movePoint({x: x2, y: y2});

      let b =  (y1 - y2 - x1**2 + x2**2) / (x1 - x2);
      let c = y1 - x1**2 - b * x1;

      let vertex_x = -b / (2 * 1);
      let vertex_y = c - b ** 2 / (4 * 1)
  
      
      cy.get('#__equation1 .mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`y=x2+${b}x+${c}`)
      })

      expect(components['/_parabola1'].state.a).eq(1);
      expect(components['/_parabola1'].state.b).eq(b);
      expect(components['/_parabola1'].state.c).eq(c);
      expect(components['/_parabola1'].state.equation.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/_parabola1'].state.vertex.evaluate_numbers().tree).eqls(["tuple",vertex_x, vertex_y]);
      expect(components['/v'].replacements[0].state.coords.evaluate_numbers().tree).eqls(["tuple",vertex_x, vertex_y]);
      expect(components['/p2'].replacements[0].state.a).eq(1);
      expect(components['/p2'].replacements[0].state.b).eq(b);
      expect(components['/p2'].replacements[0].state.c).eq(c);
      expect(components['/p2'].replacements[0].state.equation.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/p2'].replacements[0].state.vertex.evaluate_numbers().tree).eqls(["tuple",vertex_x, vertex_y]);
      expect(components['/e2'].replacements[0].state.value.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);


    })

    // TODO: why is curve not showing up again?


  });

  it('parabola through three points',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <point>(5,6)</point>
    <parabola><through><ref>_point1</ref><ref>_point2</ref><ref>_point3</ref></through></parabola>
    </graph>
    <graph>
    <ref name="p2">_parabola1</ref>
    <ref prop="vertex" name="v">_parabola1</ref>
    </graph>

    <ref prop="equation" name="e2">p2</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load
    cy.get('#__equation1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=x+1')
    })

 
    cy.window().then((win) => {

      let x1 = 1, x2 = 3, x3 = 5;
      let y1 = 2, y2 = 4, y3 = 6;
  
      let x12 = x1 * x1;
      let x22 = x2 * x2;
      let x32 = x3 * x3;
  
      let u1 = x12 - x32;
      let u2 = x22 - x32;
  
      let v1 = x1 - x3;
      let v2 = x2 - x3;
  
      let z1 = y1 - y3;
      let z2 = y2 - y3;
  
      let det = u1 * v2 - u2 * v1;
  
      let a,b,c;
  
      if(det === 0) {
        a = NaN;
        b = NaN;
        c = NaN;
      } else {
        a = (z1 * v2 - z2 * v1) / det;
        b = (z2 * u1 - z1 * u2) / det;
        c = y1 - b * x1 - a * x12;
      }
  
      let vertex_x = -b / (2 * a);
      let vertex_y = c - b ** 2 / (4 * a)
  
      let components = Object.assign({},win.state.components);
      expect(components['/_parabola1'].state.a).eq(a);
      expect(components['/_parabola1'].state.b).eq(b);
      expect(components['/_parabola1'].state.c).eq(c);
      expect(components['/_parabola1'].state.equation.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/_parabola1'].state.vertex).eq(undefined);
      expect(components['/v'].replacements.length).eq(0);
      expect(components['/p2'].replacements[0].state.a).eq(a);
      expect(components['/p2'].replacements[0].state.b).eq(b);
      expect(components['/p2'].replacements[0].state.c).eq(c);
      expect(components['/p2'].replacements[0].state.equation.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/p2'].replacements[0].state.vertex).eq(undefined)
      expect(components['/e2'].replacements[0].state.value.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);

    });

    cy.log("move points on top of each other");

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      components['/_point1'].movePoint({x: 3, y: 4});
      
      cy.get('#__equation1 .mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y=NaN')
      })

      assert.isNaN(components['/_parabola1'].state.a);
      assert.isNaN(components['/_parabola1'].state.b);
      assert.isNaN(components['/_parabola1'].state.c);

      expect(components['/_parabola1'].state.vertex).eq(undefined);
      expect(components['/v'].replacements.length).eq(0);
      assert.isNaN(components['/p2'].replacements[0].state.a);
      assert.isNaN(components['/p2'].replacements[0].state.b);
      assert.isNaN(components['/p2'].replacements[0].state.c);
      expect(components['/p2'].replacements[0].state.vertex).eq(undefined)

    })

    cy.log("move points ");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let x1 = 2, x2 = 6, x3 = 5;
      let y1 = 7, y2 = -9, y3 = 1;
  
      let x12 = x1 * x1;
      let x22 = x2 * x2;
      let x32 = x3 * x3;
  
      let u1 = x12 - x32;
      let u2 = x22 - x32;
  
      let v1 = x1 - x3;
      let v2 = x2 - x3;
  
      let z1 = y1 - y3;
      let z2 = y2 - y3;
  
      let det = u1 * v2 - u2 * v1;
  
      let a,b,c;
  
      if(det === 0) {
        a = NaN;
        b = NaN;
        c = NaN;
      } else {
        a = (z1 * v2 - z2 * v1) / det;
        b = (z2 * u1 - z1 * u2) / det;
        c = y1 - b * x1 - a * x12;
      }
  
      let vertex_x = -b / (2 * a);
      let vertex_y = c - b ** 2 / (4 * a)

      components['/_point1'].movePoint({x: x1, y: y1});
      components['/_point2'].movePoint({x: x2, y: y2});
      components['/_point3'].movePoint({x: x3, y: y3});


      
      cy.get('#__equation1 .mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`y=−2x2+12x−9`)
      })

      expect(components['/_parabola1'].state.a).eq(a);
      expect(components['/_parabola1'].state.b).eq(b);
      expect(components['/_parabola1'].state.c).eq(c);
      expect(components['/_parabola1'].state.equation.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/_parabola1'].state.vertex.evaluate_numbers().tree).eqls(["tuple",vertex_x, vertex_y]);
      expect(components['/v'].replacements[0].state.coords.evaluate_numbers().tree).eqls(["tuple",vertex_x, vertex_y]);
      expect(components['/p2'].replacements[0].state.a).eq(a);
      expect(components['/p2'].replacements[0].state.b).eq(b);
      expect(components['/p2'].replacements[0].state.c).eq(c);
      expect(components['/p2'].replacements[0].state.equation.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);
      expect(components['/p2'].replacements[0].state.vertex.evaluate_numbers().tree).eqls(["tuple",vertex_x, vertex_y]);
      expect(components['/e2'].replacements[0].state.value.tree).eqls(me.fromText(`y=${a}x^2+${b}x+${c}`).evaluate_numbers({skip_ordering: true}).tree);


    })

    // TODO: why is curve not showing up again?


  });


});
  