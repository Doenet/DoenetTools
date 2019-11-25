describe('Circle Tag Tests',function() {

  beforeEach(() => {
      cy.visit('/test')

    })
  
  it('circle with no parameters gives unit circle',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <circle/>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",0,0]);
      expect(components['/_circle1'].state.centerNumeric).eqls([0,0]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components.__point1.state.xs[0].tree).eq(0);
      expect(components.__point1.state.xs[1].tree).eq(0);
      expect(components.__radius1.state.value.tree).eq(1);
    })

    cy.log("move circle")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_circle1'].moveCircle({center: [2,3], radius: 1});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,3]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,3]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(3);
      expect(components.__radius1.state.value.tree).eq(1);
    })


    cy.log("change radius")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: 5, y:0});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,3]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,3]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(3);
      expect(components.__radius1.state.value.tree).eq(5);
    })

    cy.log("change center")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components.__point1.movePoint({x: -6, y:-2});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-6, -2]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-6, -2]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components.__point1.state.xs[0].tree).eq(-6);
      expect(components.__point1.state.xs[1].tree).eq(-2);
      expect(components.__radius1.state.value.tree).eq(5);
    })

  });

  it('circle with string point for sugared for center',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <circle>(-1,3)</circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__radius2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-1,3]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-1,3]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components.__center1.state.xs[0].tree).eq(-1);
      expect(components.__center1.state.xs[1].tree).eq(3);
      expect(components.__point1.state.xs[0].tree).eq(-1);
      expect(components.__point1.state.xs[1].tree).eq(3);
      expect(components.__radius1.state.value.tree).eq(1);
    })

    cy.log("move circle")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_circle1'].moveCircle({center: [2,4], radius: 1});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,4]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,4]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components.__center1.state.xs[0].tree).eq(2);
      expect(components.__center1.state.xs[1].tree).eq(4);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(4);
      expect(components.__radius1.state.value.tree).eq(1);
    })


    cy.log("change radius")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: 5, y:0});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,4]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,4]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components.__center1.state.xs[0].tree).eq(2);
      expect(components.__center1.state.xs[1].tree).eq(4);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(4);
      expect(components.__radius1.state.value.tree).eq(5);
    })

    cy.log("change center via defining point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components.__center1.movePoint({x: -6, y:-2});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-6, -2]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-6, -2]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components.__center1.state.xs[0].tree).eq(-6);
      expect(components.__center1.state.xs[1].tree).eq(-2);
      expect(components.__point1.state.xs[0].tree).eq(-6);
      expect(components.__point1.state.xs[1].tree).eq(-2);
      expect(components.__radius1.state.value.tree).eq(5);
    })


    cy.log("change center via reffed point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components.__point1.movePoint({x: -7, y:8});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-7, 8]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-7, 8]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components.__center1.state.xs[0].tree).eq(-7);
      expect(components.__center1.state.xs[1].tree).eq(8);
      expect(components.__point1.state.xs[0].tree).eq(-7);
      expect(components.__point1.state.xs[1].tree).eq(8);
      expect(components.__radius1.state.value.tree).eq(5);
    })

  });

  it('circle with point sugared for center',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <circle><point>(-1,3)</point></circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__radius2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-1,3]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-1,3]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components['/_point1'].state.xs[0].tree).eq(-1);
      expect(components['/_point1'].state.xs[1].tree).eq(3);
      expect(components.__point1.state.xs[0].tree).eq(-1);
      expect(components.__point1.state.xs[1].tree).eq(3);
      expect(components.__radius1.state.value.tree).eq(1);
    })

    cy.log("move circle")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_circle1'].moveCircle({center: [2,4], radius: 1});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,4]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,4]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components['/_point1'].state.xs[0].tree).eq(2);
      expect(components['/_point1'].state.xs[1].tree).eq(4);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(4);
      expect(components.__radius1.state.value.tree).eq(1);
    })


    cy.log("change radius")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point2'].movePoint({x: 5, y:0});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,4]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,4]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components['/_point1'].state.xs[0].tree).eq(2);
      expect(components['/_point1'].state.xs[1].tree).eq(4);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(4);
      expect(components.__radius1.state.value.tree).eq(5);
    })

    cy.log("change center via defining point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: -6, y:-2});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-6, -2]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-6, -2]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components['/_point1'].state.xs[0].tree).eq(-6);
      expect(components['/_point1'].state.xs[1].tree).eq(-2);
      expect(components.__point1.state.xs[0].tree).eq(-6);
      expect(components.__point1.state.xs[1].tree).eq(-2);
      expect(components.__radius1.state.value.tree).eq(5);
    })


    cy.log("change center via reffed point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components.__point1.movePoint({x: -7, y:8});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-7, 8]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-7, 8]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components['/_point1'].state.xs[0].tree).eq(-7);
      expect(components['/_point1'].state.xs[1].tree).eq(8);
      expect(components.__point1.state.xs[0].tree).eq(-7);
      expect(components.__point1.state.xs[1].tree).eq(8);
      expect(components.__radius1.state.value.tree).eq(5);
    })

  });

  it('circle with center containing sugared point',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <circle><center>(-1,3)</center></circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__radius2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-1,3]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-1,3]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components['/_center1'].state.xs[0].tree).eq(-1);
      expect(components['/_center1'].state.xs[1].tree).eq(3);
      expect(components.__point1.state.xs[0].tree).eq(-1);
      expect(components.__point1.state.xs[1].tree).eq(3);
      expect(components.__radius1.state.value.tree).eq(1);
    })

    cy.log("move circle")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_circle1'].moveCircle({center: [2,4], radius: 1});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,4]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,4]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components['/_center1'].state.xs[0].tree).eq(2);
      expect(components['/_center1'].state.xs[1].tree).eq(4);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(4);
      expect(components.__radius1.state.value.tree).eq(1);
    })


    cy.log("change radius")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: 5, y:0});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,4]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,4]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components['/_center1'].state.xs[0].tree).eq(2);
      expect(components['/_center1'].state.xs[1].tree).eq(4);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(4);
      expect(components.__radius1.state.value.tree).eq(5);
    })

    cy.log("change center via defining point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_center1'].movePoint({x: -6, y:-2});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-6, -2]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-6, -2]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components['/_center1'].state.xs[0].tree).eq(-6);
      expect(components['/_center1'].state.xs[1].tree).eq(-2);
      expect(components.__point1.state.xs[0].tree).eq(-6);
      expect(components.__point1.state.xs[1].tree).eq(-2);
      expect(components.__radius1.state.value.tree).eq(5);
    })


    cy.log("change center via reffed point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components.__point1.movePoint({x: -7, y:8});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-7, 8]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-7, 8]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components['/_center1'].state.xs[0].tree).eq(-7);
      expect(components['/_center1'].state.xs[1].tree).eq(8);
      expect(components.__point1.state.xs[0].tree).eq(-7);
      expect(components.__point1.state.xs[1].tree).eq(8);
      expect(components.__radius1.state.value.tree).eq(5);
    })

  });

  it('circle with full center point',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <circle><center><point>(-1,3)</point></center></circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__radius2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-1,3]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-1,3]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components['/_point1'].state.xs[0].tree).eq(-1);
      expect(components['/_point1'].state.xs[1].tree).eq(3);
      expect(components.__point1.state.xs[0].tree).eq(-1);
      expect(components.__point1.state.xs[1].tree).eq(3);
      expect(components.__radius1.state.value.tree).eq(1);
    })

    cy.log("move circle")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_circle1'].moveCircle({center: [2,4], radius: 1});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,4]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,4]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components['/_point1'].state.xs[0].tree).eq(2);
      expect(components['/_point1'].state.xs[1].tree).eq(4);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(4);
      expect(components.__radius1.state.value.tree).eq(1);
    })


    cy.log("change radius")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point2'].movePoint({x: 5, y:0});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,4]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,4]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components['/_point1'].state.xs[0].tree).eq(2);
      expect(components['/_point1'].state.xs[1].tree).eq(4);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(4);
      expect(components.__radius1.state.value.tree).eq(5);
    })

    cy.log("change center via defining point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: -6, y:-2});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-6, -2]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-6, -2]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components['/_point1'].state.xs[0].tree).eq(-6);
      expect(components['/_point1'].state.xs[1].tree).eq(-2);
      expect(components.__point1.state.xs[0].tree).eq(-6);
      expect(components.__point1.state.xs[1].tree).eq(-2);
      expect(components.__radius1.state.value.tree).eq(5);
    })


    cy.log("change center via reffed point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components.__point1.movePoint({x: -7, y:8});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-7, 8]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-7, 8]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_circle1'].state.radiusNumeric).eq(5);
      expect(components['/_point1'].state.xs[0].tree).eq(-7);
      expect(components['/_point1'].state.xs[1].tree).eq(8);
      expect(components.__point1.state.xs[0].tree).eq(-7);
      expect(components.__point1.state.xs[1].tree).eq(8);
      expect(components.__radius1.state.value.tree).eq(5);
    })

  });

  it('circle with radius',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <point>(2,0)</point>
    <circle><radius><ref prop="x">_point1</ref></radius></circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__radius2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let x=0, y=0, r=2;
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",x,y]);
      expect(components['/_circle1'].state.centerNumeric).eqls([x,y]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(r);
      expect(components['/_point1'].state.xs[1].tree).eq(0);
      expect(components.__point1.state.xs[0].tree).eq(x);
      expect(components.__point1.state.xs[1].tree).eq(y);
      expect(components.__radius1.state.value.tree).eq(r);
    })

    cy.log("move circle")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let x=3, y=4, r=2;
      components['/_circle1'].moveCircle({center: [x,y], radius: r});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",x,y]);
      expect(components['/_circle1'].state.centerNumeric).eqls([x,y]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(r);
      expect(components['/_point1'].state.xs[1].tree).eq(0);
      expect(components.__point1.state.xs[0].tree).eq(x);
      expect(components.__point1.state.xs[1].tree).eq(y);
      expect(components.__radius1.state.value.tree).eq(r);
    })


    cy.log("change radius with defining point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let x=3, y=4, r=5;
      components['/_point1'].movePoint({x:r, y:0});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",x,y]);
      expect(components['/_circle1'].state.centerNumeric).eqls([x,y]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(r);
      expect(components['/_point1'].state.xs[1].tree).eq(0);
      expect(components.__point1.state.xs[0].tree).eq(x);
      expect(components.__point1.state.xs[1].tree).eq(y);
      expect(components.__radius1.state.value.tree).eq(r);
    })


    cy.log("change radius with reffed point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let x=3, y=4, r=7;
      components['/_point2'].movePoint({x:r, y:0});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",x,y]);
      expect(components['/_circle1'].state.centerNumeric).eqls([x,y]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(r);
      expect(components['/_point1'].state.xs[1].tree).eq(0);
      expect(components.__point1.state.xs[0].tree).eq(x);
      expect(components.__point1.state.xs[1].tree).eq(y);
      expect(components.__radius1.state.value.tree).eq(r);
    })

    cy.log("change center with reffed point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let x=-5, y=-2, r=7;
      components.__point1.movePoint({x:x, y:y});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",x,y]);
      expect(components['/_circle1'].state.centerNumeric).eqls([x,y]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(r);
      expect(components['/_point1'].state.xs[1].tree).eq(0);
      expect(components.__point1.state.xs[0].tree).eq(x);
      expect(components.__point1.state.xs[1].tree).eq(y);
      expect(components.__radius1.state.value.tree).eq(r);
    })


  });

  it('circle through point',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point>
    <circle><through><ref>_point1</ref></through></circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__radius2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let tx=2, ty=-3;
      let r=1;
      let cx=tx, cy=ty-r;
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",cx,cy]);
      expect(components['/_circle1'].state.centerNumeric).eqls([cx,cy]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(tx);
      expect(components['/_point1'].state.xs[1].tree).eq(ty);
      expect(components.__point2.state.xs[0].tree).eq(cx);
      expect(components.__point2.state.xs[1].tree).eq(cy);
      expect(components['/_point2'].state.xs[0].tree).eq(r);
      expect(components['/_point2'].state.xs[1].tree).eq(0);
      expect(components.__radius1.state.value.tree).eq(r);
    })

    cy.log("move circle")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let tx=-4, ty=7;
      let r=1;
      let cx=tx, cy=ty-r;
      components['/_circle1'].moveCircle({center: [cx,cy], radius: r})
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",cx,cy]);
      expect(components['/_circle1'].state.centerNumeric).eqls([cx,cy]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(tx);
      expect(components['/_point1'].state.xs[1].tree).eq(ty);
      expect(components.__point2.state.xs[0].tree).eq(cx);
      expect(components.__point2.state.xs[1].tree).eq(cy);
      expect(components['/_point2'].state.xs[0].tree).eq(r);
      expect(components['/_point2'].state.xs[1].tree).eq(0);
      expect(components.__radius1.state.value.tree).eq(r);
    })

    cy.log("move through point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let tx=-5, ty=9;
      let r=1;
      let cx=tx, cy=ty-r;
      components['/_point1'].movePoint({x:tx, y: ty})
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",cx,cy]);
      expect(components['/_circle1'].state.centerNumeric).eqls([cx,cy]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(tx);
      expect(components['/_point1'].state.xs[1].tree).eq(ty);
      expect(components.__point2.state.xs[0].tree).eq(cx);
      expect(components.__point2.state.xs[1].tree).eq(cy);
      expect(components['/_point2'].state.xs[0].tree).eq(r);
      expect(components['/_point2'].state.xs[1].tree).eq(0);
      expect(components.__radius1.state.value.tree).eq(r);
    })

    cy.log("move reffed center")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let tx=3, ty=-3;
      let r=1;
      let cx=tx, cy=ty-r;
      components.__point2.movePoint({x:cx, y: cy})
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",cx,cy]);
      expect(components['/_circle1'].state.centerNumeric).eqls([cx,cy]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(tx);
      expect(components['/_point1'].state.xs[1].tree).eq(ty);
      expect(components.__point2.state.xs[0].tree).eq(cx);
      expect(components.__point2.state.xs[1].tree).eq(cy);
      expect(components['/_point2'].state.xs[0].tree).eq(r);
      expect(components['/_point2'].state.xs[1].tree).eq(0);
      expect(components.__radius1.state.value.tree).eq(r);
    })

    cy.log("change reffed radius, center stays fixed")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let r=3;
      let cx=3, cy=-4;
      let tx=3, ty=cy+r;
      components['/_point2'].movePoint({x:r, y: 0})
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",cx,cy]);
      expect(components['/_circle1'].state.centerNumeric).eqls([cx,cy]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(tx);
      expect(components['/_point1'].state.xs[1].tree).eq(ty);
      expect(components.__point2.state.xs[0].tree).eq(cx);
      expect(components.__point2.state.xs[1].tree).eq(cy);
      expect(components['/_point2'].state.xs[0].tree).eq(r);
      expect(components['/_point2'].state.xs[1].tree).eq(0);
      expect(components.__radius1.state.value.tree).eq(r);
    })

    cy.log("try to make radius negative")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let rtry = -3;
      let r=0;
      let cx=3, cy=-4;
      let tx=3, ty=cy+r;
      components['/_point2'].movePoint({x:rtry, y: 0})
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",cx,cy]);
      expect(components['/_circle1'].state.centerNumeric).eqls([cx,cy]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(tx);
      expect(components['/_point1'].state.xs[1].tree).eq(ty);
      expect(components.__point2.state.xs[0].tree).eq(cx);
      expect(components.__point2.state.xs[1].tree).eq(cy);
      expect(components['/_point2'].state.xs[0].tree).eq(r);
      expect(components['/_point2'].state.xs[1].tree).eq(0);
      expect(components.__radius1.state.value.tree).eq(r);
    })

    cy.log("make radius positive again")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let r=2;
      let cx=3, cy=-4;
      let tx=3, ty=cy+r;
      components['/_point2'].movePoint({x:r, y: 0})
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",cx,cy]);
      expect(components['/_circle1'].state.centerNumeric).eqls([cx,cy]);
      expect(components['/_circle1'].state.radius.tree).eq(r);
      expect(components['/_circle1'].state.radiusNumeric).eq(r);
      expect(components['/_point1'].state.xs[0].tree).eq(tx);
      expect(components['/_point1'].state.xs[1].tree).eq(ty);
      expect(components.__point2.state.xs[0].tree).eq(cx);
      expect(components.__point2.state.xs[1].tree).eq(cy);
      expect(components['/_point2'].state.xs[0].tree).eq(r);
      expect(components['/_point2'].state.xs[1].tree).eq(0);
      expect(components.__radius1.state.value.tree).eq(r);
    })

  });

  it('circle through two points',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point><point>(3,4)</point>
    <circle><through><ref>_point1</ref><ref>_point2</ref></through></circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="x">_point1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=2, t1y=-3;
      let t2x=3, t2y=4;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move circle')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=-2, t1y=0;
      let t2x=-1, t2y=7;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components['/_circle1'].moveCircle({center: [cx,cy], radius: r})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move first through point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=4, t1y=-1;
      let t2x=-1, t2y=7;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components['/_point1'].movePoint({x:t1x, y:t1y})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move second through point on top of first')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=4, t1y=-1;
      let t2x=4, t2y=-1;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components['/_point2'].movePoint({x:t2x, y:t2y})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move second through point again')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=4, t1y=-1;
      let t2x=8, t2y=-3;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components['/_point2'].movePoint({x:t2x, y:t2y})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move center')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=4+2, t1y=-1-3;
      let t2x=8+2, t2y=-3-3;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components.__point3.movePoint({x:cx, y:cy})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move radius to half size')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=8+(4+2-8)/2, t1y=-5+(-1-3+5)/2;
      let t2x=8+(8+2-8)/2, t2y=-5+(-3-3+5)/2;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components['/_point3'].movePoint({x:r, y:0})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

  });

  it('circle through two points, undefined on first pass',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <circle><through><ref>_point1</ref><ref>_point2</ref></through></circle>
    <point>(2,-3)</point><point>(3,4)</point>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="x">_point1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=2, t1y=-3;
      let t2x=3, t2y=4;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move circle')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=-2, t1y=0;
      let t2x=-1, t2y=7;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components['/_circle1'].moveCircle({center: [cx,cy], radius: r})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move first through point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=4, t1y=-1;
      let t2x=-1, t2y=7;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components['/_point1'].movePoint({x:t1x, y:t1y})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move second through point on top of first')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=4, t1y=-1;
      let t2x=4, t2y=-1;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components['/_point2'].movePoint({x:t2x, y:t2y})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move second through point again')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=4, t1y=-1;
      let t2x=8, t2y=-3;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components['/_point2'].movePoint({x:t2x, y:t2y})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move center')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=4+2, t1y=-1-3;
      let t2x=8+2, t2y=-3-3;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components.__point1.movePoint({x:cx, y:cy})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move radius to half size')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=8+(4+2-8)/2, t1y=-5+(-1-3+5)/2;
      let t2x=8+(8+2-8)/2, t2y=-5+(-3-3+5)/2;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      components['/_point3'].movePoint({x:r, y:0})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

  })

  it('circle through three points',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point><point>(3,4)</point><point>(-3,4)</point>
    <circle><through><ref>_point1</ref><ref>_point2</ref><ref>_point3</ref></through></circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="x">_point1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
  
    let t1x=2, t1y=-3;
    let t2x=3, t2y=4;
    let t3x=-3, t3y=4;

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point4.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point4.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move circle up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      let dx = 3, dy=4;
      cx += dx;
      cy += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      components['/_circle1'].moveCircle({center:[cx,cy], radius: r})
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point4.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point4.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move first point to be in straight line')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      t1x=-3, t1y=8;

      components['/_point1'].movePoint({x: t1x, y: t1y})

      expect(Number.isFinite(components['/_circle1'].state.centerNumeric[0])).false;
      expect(Number.isFinite(components['/_circle1'].state.centerNumeric[1])).false;
      expect(Number.isFinite(components['/_circle1'].state.radiusNumeric)).false;

      expect(Number.isFinite(components['/_circle1'].state.center.tree[0])).false;
      expect(Number.isFinite(components['/_circle1'].state.center.tree[1])).false;
      expect(Number.isFinite(components['/_circle1'].state.radius.tree)).false;

      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(Number.isFinite(components.__point4.state.xs[0].tree)).false;
      expect(Number.isFinite(components.__point4.state.xs[1].tree)).false;
      expect(Number.isFinite(components.__radius1.state.value.tree)).false;
    })

    cy.log('move second point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      t2x=-4, t2y=-2;

      components['/_point2'].movePoint({x: t2x, y: t2y})

      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point4.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point4.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      t3x=5, t3y=3;

      components['/_point3'].movePoint({x: t3x, y: t3y})

      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point4.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point4.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move points to be identical')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      t1x=5, t1y=3;
      t2x=5, t2y=3;

      components['/_point1'].movePoint({x: t1x, y: t1y})
      components['/_point2'].movePoint({x: t2x, y: t2y})

      // should be a circle of radius zero
      let cx = t1x;
      let cy = t1y;
      let r = 0;

      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point4.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point4.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })


    cy.log('move points apart again')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      t2x=2, t2y=-7;
      t3x=0, t3y=-8;

      components['/_point2'].movePoint({x: t2x, y: t2y})
      components['/_point3'].movePoint({x: t3x, y: t3y})

      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point4.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point4.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })


    cy.log('move center by reffed point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      let dx=2, dy=-3;
      cx += dx;
      cy += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      components.__point4.movePoint({x: cx, y: cy});
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point4.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point4.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('half radius around center')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      r = r/2;

      t1x = cx + (t1x-cx)/2;
      t1y = cy + (t1y-cy)/2;
      t2x = cx + (t2x-cx)/2;
      t2y = cy + (t2y-cy)/2;
      t3x = cx + (t3x-cx)/2;
      t3y = cy + (t3y-cy)/2;

      components['/_point4'].movePoint({x: r, y: 0});

      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point4.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point4.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

  });

  it('circle through three points, undefined on first pass',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <circle><through><ref>_point1</ref><ref>_point2</ref><ref>_point3</ref></through></circle>
    <point>(2,-3)</point><point>(3,4)</point><point>(-3,4)</point>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="x">_point1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
  
    let t1x=2, t1y=-3;
    let t2x=3, t2y=4;
    let t3x=-3, t3y=4;

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move circle up and to the right')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      let dx = 3, dy=4;
      cx += dx;
      cy += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      components['/_circle1'].moveCircle({center:[cx,cy], radius: r})
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move first point to be in straight line')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      t1x=-3, t1y=8;

      components['/_point1'].movePoint({x: t1x, y: t1y})

      expect(Number.isFinite(components['/_circle1'].state.centerNumeric[0])).false;
      expect(Number.isFinite(components['/_circle1'].state.centerNumeric[1])).false;
      expect(Number.isFinite(components['/_circle1'].state.radiusNumeric)).false;

      expect(Number.isFinite(components['/_circle1'].state.center.tree[0])).false;
      expect(Number.isFinite(components['/_circle1'].state.center.tree[1])).false;
      expect(Number.isFinite(components['/_circle1'].state.radius.tree)).false;

      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(Number.isFinite(components.__point1.state.xs[0].tree)).false;
      expect(Number.isFinite(components.__point1.state.xs[1].tree)).false;
      expect(Number.isFinite(components.__radius1.state.value.tree)).false;
    })

    cy.log('move second point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      t2x=-4, t2y=-2;

      components['/_point2'].movePoint({x: t2x, y: t2y})

      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      t3x=5, t3y=3;

      components['/_point3'].movePoint({x: t3x, y: t3y})

      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move points to be identical')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      t1x=5, t1y=3;
      t2x=5, t2y=3;

      components['/_point1'].movePoint({x: t1x, y: t1y})
      components['/_point2'].movePoint({x: t2x, y: t2y})

      // should be a circle of radius zero
      let cx = t1x;
      let cy = t1y;
      let r = 0;

      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })


    cy.log('move points apart again')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      t2x=2, t2y=-7;
      t3x=0, t3y=-8;

      components['/_point2'].movePoint({x: t2x, y: t2y})
      components['/_point3'].movePoint({x: t3x, y: t3y})

      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })


    cy.log('move center by reffed point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      let dx=2, dy=-3;
      cx += dx;
      cy += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      components.__point1.movePoint({x: cx, y: cy});
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('half radius around center')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
 
      // calculate center and radius from circle itself
      let cx = components['/_circle1'].state.centerNumeric[0];
      let cy = components['/_circle1'].state.centerNumeric[1];
      let r = components['/_circle1'].state.radiusNumeric;

      r = r/2;

      t1x = cx + (t1x-cx)/2;
      t1y = cy + (t1y-cy)/2;
      t2x = cx + (t2x-cx)/2;
      t2y = cy + (t2y-cy)/2;
      t3x = cx + (t3x-cx)/2;
      t3y = cy + (t3y-cy)/2;

      components['/_point4'].movePoint({x: r, y: 0});

      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t3x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t3y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

  });

  it('circle with radius and through one point',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <point>(2,0)</point><point>(3,4)</point>

    <circle>
      <radius><ref prop="x">_point1</ref></radius>
      <through><ref>_point2</ref></through>
    </circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__radius2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let tx=3, ty=4;
      let r=2;
      let cx=tx, cy=ty-r;

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point2.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point2.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move circle')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let tx=1, ty=-1;
      let r=2;
      let cx=tx, cy=ty-r;
      components['/_circle1'].moveCircle({center:[cx,cy], radius: r});
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point2.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point2.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let tx=4, ty=7;
      let r=2;
      let cx=tx, cy=ty-r;
      components['/_point2'].movePoint({x:tx, y:ty});
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point2.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point2.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('change definition radius')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let tx=4, ty=7;
      let r=6;
      let cx=tx, cy=ty-r;
      components['/_point1'].movePoint({x:r, y:0});
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point2.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point2.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('half reffed radius, keeping center fixed')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=4, cy=1;
      let r=3;
      let tx=cx, ty=cy+3;
      components['/_point3'].movePoint({x:r, y:0});
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point2.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point2.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })
  });

  it('circle with radius and through two points',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <point>(2,0)</point><point>(3,4)</point><point>(5,6)</point>

    <circle>
      <radius><ref prop="x">_point1</ref></radius>
      <through><ref>_point2</ref><ref>_point3</ref></through>
    </circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__radius2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=3, t1y=4;
      let t2x=5, t2y=6;
      let r=2;

      // get center from circle itself
      let cx =components['/_circle1'].state.centerNumeric[0];
      let cy =components['/_circle1'].state.centerNumeric[1];

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius2.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move circle')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=3, t1y=4;
      let t2x=5, t2y=6;
      let r=2;

      // get center from circle itself
      let cx =components['/_circle1'].state.centerNumeric[0];
      let cy =components['/_circle1'].state.centerNumeric[1];

      let dx = -1, dy=-3;
      cx += dx;
      cy += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      components['/_circle1'].moveCircle({center:[cx,cy], radius: r});
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius2.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move through point too far away')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=0, t1y=-1;
      let t2x=4, t2y=3;
      let r=2;

      components['/_point2'].movePoint({x:t1x, y:t1y});

      expect(Number.isFinite(components['/_circle1'].state.center.tree[1])).false;
      expect(Number.isFinite(components['/_circle1'].state.center.tree[2])).false;
      expect(Number.isFinite(components['/_circle1'].state.centerNumeric[0])).false;
      expect(Number.isFinite(components['/_circle1'].state.centerNumeric[1])).false;
      expect(Number.isFinite(components['/_circle1'].state.radius.tree)).false;
      expect(Number.isFinite(components['/_circle1'].state.radiusNumeric)).false;
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(Number.isFinite(components.__point3.state.xs[0].tree)).false;
      expect(Number.isFinite(components.__point3.state.xs[1].tree)).false;
      expect(Number.isFinite(components.__radius2.state.value.tree)).false;

    })

    cy.log('increase definition radius')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=0, t1y=-1;
      let t2x=4, t2y=3;
      let r=6;

      components['/_point1'].movePoint({x:r, y:0});

      // get center from circle itself
      let cx =components['/_circle1'].state.centerNumeric[0];
      let cy =components['/_circle1'].state.centerNumeric[1];

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius2.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('decrease reffed and then definition radius')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=0, t1y=-1;
      let t2x=4, t2y=3;
      let r=6;

      // get center from circle itself
      let cx =components['/_circle1'].state.centerNumeric[0];
      let cy =components['/_circle1'].state.centerNumeric[1];

      r = r/3;

      t1x = cx + (t1x-cx)/3;
      t1y = cy + (t1y-cy)/3;
      t2x = cx + (t2x-cx)/3;
      t2y = cy + (t2y-cy)/3;

      components['/_point4'].movePoint({x:r, y:0});

      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius2.state.value.tree).closeTo(r,1E-12);

      r = r/3;
      components['/_point1'].movePoint({x:r, y:0});

      expect(Number.isFinite(components['/_circle1'].state.center.tree[1])).false;
      expect(Number.isFinite(components['/_circle1'].state.center.tree[2])).false;
      expect(Number.isFinite(components['/_circle1'].state.centerNumeric[0])).false;
      expect(Number.isFinite(components['/_circle1'].state.centerNumeric[1])).false;
      expect(Number.isFinite(components['/_circle1'].state.radius.tree)).false;
      expect(Number.isFinite(components['/_circle1'].state.radiusNumeric)).false;
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(Number.isFinite(components.__point3.state.xs[0].tree)).false;
      expect(Number.isFinite(components.__point3.state.xs[1].tree)).false;
      expect(Number.isFinite(components.__radius2.state.value.tree)).false;

    })

    cy.log('move through points close enough')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=-2, t1y=7;
      let t2x=-2.5, t2y=6.6;
      let r=2/3;

      components['/_point2'].movePoint({x:t1x, y:t1y});
      components['/_point3'].movePoint({x:t2x, y:t2y});

      // get center from circle itself
      let cx =components['/_circle1'].state.centerNumeric[0];
      let cy =components['/_circle1'].state.centerNumeric[1];

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius2.state.value.tree).closeTo(r,1E-12);

    })

    cy.log('move reffed center')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=-2, t1y=7;
      let t2x=-2.5, t2y=6.6;
      let r=2/3;

      // get center from circle itself
      let cx =components['/_circle1'].state.centerNumeric[0];
      let cy =components['/_circle1'].state.centerNumeric[1];

      let dx = 6, dy=-7;
      cx += dx;
      cy += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      components.__point3.movePoint({x: cx, y: cy});

      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius2.state.value.tree).closeTo(r,1E-12);

    })

  })

  it('circle with point sugared as center and through point',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <point>(3,4)</point><point>(5,6)</point>

    <circle>
      <ref>_point1</ref>
      <through><ref>_point2</ref></through>
    </circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="x">_point1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=3, cy=4;
      let tx=5, ty=6;
      let r=Math.sqrt(Math.pow(tx-cx,2)+Math.pow(ty-cy,2));

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move circle')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=3, cy=4;
      let tx=5, ty=6;
      let r=Math.sqrt(Math.pow(tx-cx,2)+Math.pow(ty-cy,2));

      let dx = -2, dy=-6;
      cx += dx;
      cy += dy;
      tx += dx;
      ty += dy;

      components['/_circle1'].moveCircle({center: [cx,cy], radius: r})

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move defining center')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=1, cy=-2;
      let tx=3, ty=0;

      cx = -5;
      cy = 5;

      let r=Math.sqrt(Math.pow(tx-cx,2)+Math.pow(ty-cy,2));

      components['/_point1'].movePoint({x: cx, y: cy});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move reffed center')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=-5, cy=5;
      let tx=3, ty=0;

      let r=Math.sqrt(Math.pow(tx-cx,2)+Math.pow(ty-cy,2));

      let dx = 6, dy=-6;
      cx += dx;
      cy += dy;
      tx += dx;
      ty += dy;

      components.__point3.movePoint({x: cx, y: cy});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })


    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=1, cy=-1;
      let tx=-4, ty=3;

      let r=Math.sqrt(Math.pow(tx-cx,2)+Math.pow(ty-cy,2));

      components['/_point2'].movePoint({x: tx, y: ty});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('change reffed radius')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=1, cy=-1;
      let tx=-4, ty=3;

      let r=Math.sqrt(Math.pow(tx-cx,2)+Math.pow(ty-cy,2));

      r=r/4;

      tx = cx + (tx-cx)/4;
      ty = cy + (ty-cy)/4;

      components['/_point3'].movePoint({x: r, y: 0});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })


  })

  it('circle with radius and string sugared as center',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <point>(3,0)</point>

    <circle>
      <radius><ref prop="x">_point1</ref></radius>
      (-3,5)
    </circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__radius2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=-3, cy=5;
      let r=3;

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components.__center1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__center1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('make defined radius negative')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=-3, cy=5;
      let r=-3;

      components['/_point1'].movePoint({x: r, y: 0});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components.__center1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__center1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('making reffed radius negative sets it to zero')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=-3, cy=5;
      let r=0;

      components['/_point2'].movePoint({x: -5, y: 0});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components.__center1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__center1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })

  })

  it('point constrained to circle',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <point>(3,0)</point><point>(-1,7)</point>

    <circle>
      <radius><ref prop="x">_point1</ref></radius>
      <center><ref>_point2</ref></center>
    </circle>
    <point>(-4,-6)
      <constrainTo><ref>_circle1</ref></constrainTo>
    </point>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="radius">_circle1</ref>, 0)</point>
    </graph>
    <ref prop="radius">_circle1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__radius2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })


    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=-1, cy=7;
      let r=3;

      let px = components['/_point3'].state.xs[0].tree;
      let py = components['/_point3'].state.xs[1].tree;
      let dist = Math.sqrt(Math.pow(px-cx,2)+Math.pow(py-cy,2));
      expect(dist).closeTo(r,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__point2.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point2.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius2.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move circle')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=5, cy=-2;
      let r=3;

      components['/_point2'].movePoint({x: cx, y: cy});

      let px = components['/_point3'].state.xs[0].tree;
      let py = components['/_point3'].state.xs[1].tree;
      let dist = Math.sqrt(Math.pow(px-cx,2)+Math.pow(py-cy,2));
      expect(dist).closeTo(r,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__point2.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point2.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius2.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('shink circle')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=5, cy=-2;
      let r=1;

      components['/_point1'].movePoint({x: r, y: 0});
      
      let px = components['/_point3'].state.xs[0].tree;
      let py = components['/_point3'].state.xs[1].tree;
      let dist = Math.sqrt(Math.pow(px-cx,2)+Math.pow(py-cy,2));
      expect(dist).closeTo(r,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__point2.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point2.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius2.state.value.tree).closeTo(r,1E-12);
    })

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=5, cy=-2;
      let r=1;

      components['/_point3'].movePoint({x: -9, y: 8});
      
      let px = components['/_point3'].state.xs[0].tree;
      let py = components['/_point3'].state.xs[1].tree;
      let dist = Math.sqrt(Math.pow(px-cx,2)+Math.pow(py-cy,2));
      expect(dist).closeTo(r,1E-12);

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(0,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__point2.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point2.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius2.state.value.tree).closeTo(r,1E-12);
    })

  })

  it('all updatable with refs',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <point>(3,0)</point><point>(-1,7)</point>
    <circle>
      <center><ref>_point1</ref></center>
      <through><ref>_point2</ref></through>
    </circle>
    </graph>
    <graph>
    <ref prop="center">_circle1</ref>
    <point>(<ref prop="y">_ref3</ref>, <ref prop="radius">_circle1</ref>)</point>
    <ref>_circle1</ref>
    </graph>
    <ref prop="x">_point1</ref>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#__math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=3, cy=0;
      let tx=-1, ty=7;
      let r=Math.sqrt(Math.pow(tx-cx,2) + Math.pow(ty-cy,2));

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(r,1E-12);
      expect(components.__circle1.state.center.tree[1]).closeTo(cx,1E-12);
      expect(components.__circle1.state.center.tree[2]).closeTo(cy,1E-12);
      expect(components.__circle1.state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components.__circle1.state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components.__circle1.state.radius.tree).closeTo(r,1E-12);
      expect(components.__circle1.state.radiusNumeric).closeTo(r,1E-12);

    })

    cy.log("move circle 1")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=3, cy=0;
      let tx=-1, ty=7;
      let r=Math.sqrt(Math.pow(tx-cx,2) + Math.pow(ty-cy,2));

      let dx=-5, dy=4;
      cx += dx;
      cy += dy;
      tx += dx;
      ty += dy;

      components['/_circle1'].moveCircle({center: [cx,cy], radius: r});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(r,1E-12);
      expect(components.__circle1.state.center.tree[1]).closeTo(cx,1E-12);
      expect(components.__circle1.state.center.tree[2]).closeTo(cy,1E-12);
      expect(components.__circle1.state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components.__circle1.state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components.__circle1.state.radius.tree).closeTo(r,1E-12);
      expect(components.__circle1.state.radiusNumeric).closeTo(r,1E-12);

    })

    cy.log("move circle 2")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=3, cy=0;
      let tx=-1, ty=7;
      let r=Math.sqrt(Math.pow(tx-cx,2) + Math.pow(ty-cy,2));

      let dx=3, dy=-2;
      cx += dx;
      cy += dy;
      tx += dx;
      ty += dy;

      components.__circle1.moveCircle({center: [cx,cy], radius: r});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(r,1E-12);
      expect(components.__circle1.state.center.tree[1]).closeTo(cx,1E-12);
      expect(components.__circle1.state.center.tree[2]).closeTo(cy,1E-12);
      expect(components.__circle1.state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components.__circle1.state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components.__circle1.state.radius.tree).closeTo(r,1E-12);
      expect(components.__circle1.state.radiusNumeric).closeTo(r,1E-12);

    })

    cy.log("move reffed center")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=3, cy=0;
      let tx=-1, ty=7;
      let r=Math.sqrt(Math.pow(tx-cx,2) + Math.pow(ty-cy,2));

      let dx=-5, dy=-5;
      cx += dx;
      cy += dy;
      tx += dx;
      ty += dy;

      components.__point3.movePoint({x: cx, y: cy});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(r,1E-12);
      expect(components.__circle1.state.center.tree[1]).closeTo(cx,1E-12);
      expect(components.__circle1.state.center.tree[2]).closeTo(cy,1E-12);
      expect(components.__circle1.state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components.__circle1.state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components.__circle1.state.radius.tree).closeTo(r,1E-12);
      expect(components.__circle1.state.radiusNumeric).closeTo(r,1E-12);

    })

    cy.log("move defining center")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=-2, cy=-5;
      let tx=-6, ty=2;

      cx = -3;
      cy = 1;

      let r=Math.sqrt(Math.pow(tx-cx,2) + Math.pow(ty-cy,2));

      components['/_point1'].movePoint({x: cx, y: cy});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(r,1E-12);
      expect(components.__circle1.state.center.tree[1]).closeTo(cx,1E-12);
      expect(components.__circle1.state.center.tree[2]).closeTo(cy,1E-12);
      expect(components.__circle1.state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components.__circle1.state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components.__circle1.state.radius.tree).closeTo(r,1E-12);
      expect(components.__circle1.state.radiusNumeric).closeTo(r,1E-12);

    })

    cy.log("move through point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=-3, cy=1;
      let tx=-6, ty=2;

      tx = 0;
      ty = 4;

      let r=Math.sqrt(Math.pow(tx-cx,2) + Math.pow(ty-cy,2));

      components['/_point2'].movePoint({x: tx, y: ty});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(r,1E-12);
      expect(components.__circle1.state.center.tree[1]).closeTo(cx,1E-12);
      expect(components.__circle1.state.center.tree[2]).closeTo(cy,1E-12);
      expect(components.__circle1.state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components.__circle1.state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components.__circle1.state.radius.tree).closeTo(r,1E-12);
      expect(components.__circle1.state.radiusNumeric).closeTo(r,1E-12);

    })

    cy.log("move point of refs")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let cx=-3, cy=1;
      let tx=0, ty=4;

      let theta = Math.atan2(ty-cy, tx-cx);

      let r = 2;
      cy = -3;

      tx = cx + r*Math.cos(theta);
      ty = cy + r*Math.sin(theta);

      components['/_point3'].movePoint({x: cy, y: r});

      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(cx,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(tx,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(ty,1E-12);
      expect(components.__point3.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point3.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[0].tree).closeTo(cy,1E-12);
      expect(components['/_point3'].state.xs[1].tree).closeTo(r,1E-12);
      expect(components.__circle1.state.center.tree[1]).closeTo(cx,1E-12);
      expect(components.__circle1.state.center.tree[2]).closeTo(cy,1E-12);
      expect(components.__circle1.state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components.__circle1.state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components.__circle1.state.radius.tree).closeTo(r,1E-12);
      expect(components.__circle1.state.radiusNumeric).closeTo(r,1E-12);

    })

  })

  it('triangle inscribed in circle, ref center coordinates separately and radius',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <graph>
    <triangle layer="1" name="t">(1,2),(3,5),(-5,2)</triangle>
  
    <circle name="c">
      <through>
        <ref prop="vertex1">t</ref>
        <ref prop="vertex2">t</ref>
        <ref prop="vertex3">t</ref>
      </through>
    </circle>
  
    <point name="x">
      <x><extract prop="x"><ref prop="center">c</ref></extract></x>
      <y fixed>0</y>
    </point>
  
    <point name="y">
      <x fixed>0</x>
      <y><extract prop="y"><ref prop="center">c</ref></extract></y>
    </point>
    <point name="r">(<ref prop="radius">c</ref>,5)</point>
  
    </graph>
    <math>1</math>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let t1x = 1, t1y = 2, t2x = 3, t2y = 5, t3x = -5, t3y = 2;
    let circy, circx, r;

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      // calculate center and radius from circle itself
      circx = components['/c'].state.centerNumeric[0];
      circy = components['/c'].state.centerNumeric[1];
      r = components['/c'].state.radiusNumeric;

      // verify triangle vertices are on circle
      expect(Math.sqrt((t1x-circx)**2+(t1y-circy)**2)).closeTo(r,1E-12);
      expect(Math.sqrt((t2x-circx)**2+(t2y-circy)**2)).closeTo(r,1E-12);
      expect(Math.sqrt((t3x-circx)**2+(t3y-circy)**2)).closeTo(r,1E-12);
      
      expect(components['/t'].state.vertices[0].tree[1]).closeTo(t1x,1E-12);
      expect(components['/t'].state.vertices[0].tree[2]).closeTo(t1y,1E-12);
      expect(components['/t'].state.vertices[1].tree[1]).closeTo(t2x,1E-12);
      expect(components['/t'].state.vertices[1].tree[2]).closeTo(t2y,1E-12);
      expect(components['/t'].state.vertices[2].tree[1]).closeTo(t3x,1E-12);
      expect(components['/t'].state.vertices[2].tree[2]).closeTo(t3y,1E-12);
      expect(components['/c'].state.center.tree[1]).closeTo(circx,1E-12);
      expect(components['/c'].state.center.tree[2]).closeTo(circy,1E-12);
      expect(components['/c'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/x'].state.xs[0].tree).closeTo(circx,1E-12);
      expect(components['/y'].state.xs[1].tree).closeTo(circy,1E-12);
      expect(components['/r'].state.xs[0].tree).closeTo(r,1E-12);
   
    })

    cy.log("move triangle points")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      t1x = -3, t1y = 1, t2x = 4, t2y = 0, t3x = -1, t3y = 7;

      components['/t'].movePolygon([
        [t1x, t1y],[t2x,t2y],[t3x,t3y]
      ])

      // calculate center and radius from circle itself
      circx = components['/c'].state.centerNumeric[0];
      circy = components['/c'].state.centerNumeric[1];
      r = components['/c'].state.radiusNumeric;

      // verify triangle vertices are on circle
      expect(Math.sqrt((t1x-circx)**2+(t1y-circy)**2)).closeTo(r,1E-12);
      expect(Math.sqrt((t2x-circx)**2+(t2y-circy)**2)).closeTo(r,1E-12);
      expect(Math.sqrt((t3x-circx)**2+(t3y-circy)**2)).closeTo(r,1E-12);
      
      expect(components['/t'].state.vertices[0].tree[1]).closeTo(t1x,1E-12);
      expect(components['/t'].state.vertices[0].tree[2]).closeTo(t1y,1E-12);
      expect(components['/t'].state.vertices[1].tree[1]).closeTo(t2x,1E-12);
      expect(components['/t'].state.vertices[1].tree[2]).closeTo(t2y,1E-12);
      expect(components['/t'].state.vertices[2].tree[1]).closeTo(t3x,1E-12);
      expect(components['/t'].state.vertices[2].tree[2]).closeTo(t3y,1E-12);
      expect(components['/c'].state.center.tree[1]).closeTo(circx,1E-12);
      expect(components['/c'].state.center.tree[2]).closeTo(circy,1E-12);
      expect(components['/c'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/x'].state.xs[0].tree).closeTo(circx,1E-12);
      expect(components['/y'].state.xs[1].tree).closeTo(circy,1E-12);
      expect(components['/r'].state.xs[0].tree).closeTo(r,1E-12);
   
    })

    cy.log("move circle via center")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let dx = 2, dy = -3;
      circx += dx;
      circy += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      components['/c'].moveCircle({center: [circx,circy]});

      expect(components['/c'].state.centerNumeric[0]).closeTo(circx,1E-12);
      expect(components['/c'].state.centerNumeric[1]).closeTo(circy,1E-12);
      expect(components['/c'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/t'].state.vertices[0].tree[1]).closeTo(t1x,1E-12);
      expect(components['/t'].state.vertices[0].tree[2]).closeTo(t1y,1E-12);
      expect(components['/t'].state.vertices[1].tree[1]).closeTo(t2x,1E-12);
      expect(components['/t'].state.vertices[1].tree[2]).closeTo(t2y,1E-12);
      expect(components['/t'].state.vertices[2].tree[1]).closeTo(t3x,1E-12);
      expect(components['/t'].state.vertices[2].tree[2]).closeTo(t3y,1E-12);
      expect(components['/c'].state.center.tree[1]).closeTo(circx,1E-12);
      expect(components['/c'].state.center.tree[2]).closeTo(circy,1E-12);
      expect(components['/c'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/x'].state.xs[0].tree).closeTo(circx,1E-12);
      expect(components['/y'].state.xs[1].tree).closeTo(circy,1E-12);
      expect(components['/r'].state.xs[0].tree).closeTo(r,1E-12);
   
    })


    cy.log("move circle center x")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let dx = -5;
      circx += dx;
      t1x += dx;
      t2x += dx;
      t3x += dx;
      
      components['/x'].movePoint({x: circx});

      expect(components['/c'].state.centerNumeric[0]).closeTo(circx,1E-12);
      expect(components['/c'].state.centerNumeric[1]).closeTo(circy,1E-12);
      expect(components['/c'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/t'].state.vertices[0].tree[1]).closeTo(t1x,1E-12);
      expect(components['/t'].state.vertices[0].tree[2]).closeTo(t1y,1E-12);
      expect(components['/t'].state.vertices[1].tree[1]).closeTo(t2x,1E-12);
      expect(components['/t'].state.vertices[1].tree[2]).closeTo(t2y,1E-12);
      expect(components['/t'].state.vertices[2].tree[1]).closeTo(t3x,1E-12);
      expect(components['/t'].state.vertices[2].tree[2]).closeTo(t3y,1E-12);
      expect(components['/c'].state.center.tree[1]).closeTo(circx,1E-12);
      expect(components['/c'].state.center.tree[2]).closeTo(circy,1E-12);
      expect(components['/c'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/x'].state.xs[0].tree).closeTo(circx,1E-12);
      expect(components['/y'].state.xs[1].tree).closeTo(circy,1E-12);
      expect(components['/r'].state.xs[0].tree).closeTo(r,1E-12);
   
    })



    cy.log("move circle center y")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let dy = 6;
      circy += dy;
      t1y += dy;
      t2y += dy;
      t3y += dy;
      
      components['/y'].movePoint({y: circy});

      expect(components['/c'].state.centerNumeric[0]).closeTo(circx,1E-12);
      expect(components['/c'].state.centerNumeric[1]).closeTo(circy,1E-12);
      expect(components['/c'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/t'].state.vertices[0].tree[1]).closeTo(t1x,1E-12);
      expect(components['/t'].state.vertices[0].tree[2]).closeTo(t1y,1E-12);
      expect(components['/t'].state.vertices[1].tree[1]).closeTo(t2x,1E-12);
      expect(components['/t'].state.vertices[1].tree[2]).closeTo(t2y,1E-12);
      expect(components['/t'].state.vertices[2].tree[1]).closeTo(t3x,1E-12);
      expect(components['/t'].state.vertices[2].tree[2]).closeTo(t3y,1E-12);
      expect(components['/c'].state.center.tree[1]).closeTo(circx,1E-12);
      expect(components['/c'].state.center.tree[2]).closeTo(circy,1E-12);
      expect(components['/c'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/x'].state.xs[0].tree).closeTo(circx,1E-12);
      expect(components['/y'].state.xs[1].tree).closeTo(circy,1E-12);
      expect(components['/r'].state.xs[0].tree).closeTo(r,1E-12);
   
    })

    cy.log("shrink radius")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let radiusfactor = 0.4;

      r = r * radiusfactor;

      t1x = circx + (t1x-circx)*radiusfactor;
      t1y = circy + (t1y-circy)*radiusfactor;
      t2x = circx + (t2x-circx)*radiusfactor;
      t2y = circy + (t2y-circy)*radiusfactor;
      t3x = circx + (t3x-circx)*radiusfactor;
      t3y = circy + (t3y-circy)*radiusfactor;

      components['/r'].movePoint({x: r});

      expect(components['/c'].state.centerNumeric[0]).closeTo(circx,1E-12);
      expect(components['/c'].state.centerNumeric[1]).closeTo(circy,1E-12);
      expect(components['/c'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/t'].state.vertices[0].tree[1]).closeTo(t1x,1E-12);
      expect(components['/t'].state.vertices[0].tree[2]).closeTo(t1y,1E-12);
      expect(components['/t'].state.vertices[1].tree[1]).closeTo(t2x,1E-12);
      expect(components['/t'].state.vertices[1].tree[2]).closeTo(t2y,1E-12);
      expect(components['/t'].state.vertices[2].tree[1]).closeTo(t3x,1E-12);
      expect(components['/t'].state.vertices[2].tree[2]).closeTo(t3y,1E-12);
      expect(components['/c'].state.center.tree[1]).closeTo(circx,1E-12);
      expect(components['/c'].state.center.tree[2]).closeTo(circy,1E-12);
      expect(components['/c'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/x'].state.xs[0].tree).closeTo(circx,1E-12);
      expect(components['/y'].state.xs[1].tree).closeTo(circy,1E-12);
      expect(components['/r'].state.xs[0].tree).closeTo(r,1E-12);
   
    })

    cy.log("shrink radius to zero")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      components['/r'].movePoint({x: -3}); // overshoot

      expect(components['/c'].state.centerNumeric[0]).closeTo(circx,1E-12);
      expect(components['/c'].state.centerNumeric[1]).closeTo(circy,1E-12);
      expect(components['/c'].state.radiusNumeric).closeTo(0,1E-12);

      expect(components['/t'].state.vertices[0].tree[1]).closeTo(circx,1E-12);
      expect(components['/t'].state.vertices[0].tree[2]).closeTo(circy,1E-12);
      expect(components['/t'].state.vertices[1].tree[1]).closeTo(circx,1E-12);
      expect(components['/t'].state.vertices[1].tree[2]).closeTo(circy,1E-12);
      expect(components['/t'].state.vertices[2].tree[1]).closeTo(circx,1E-12);
      expect(components['/t'].state.vertices[2].tree[2]).closeTo(circy,1E-12);
      expect(components['/c'].state.center.tree[1]).closeTo(circx,1E-12);
      expect(components['/c'].state.center.tree[2]).closeTo(circy,1E-12);
      expect(components['/c'].state.radius.tree).closeTo(0,1E-12);
      expect(components['/x'].state.xs[0].tree).closeTo(circx,1E-12);
      expect(components['/y'].state.xs[1].tree).closeTo(circy,1E-12);
      expect(components['/r'].state.xs[0].tree).closeTo(0,1E-12);
   
    })

    cy.log("increase radius to 6")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let radiusfactor = 6/r;

      r = r * radiusfactor;

      t1x = circx + (t1x-circx)*radiusfactor;
      t1y = circy + (t1y-circy)*radiusfactor;
      t2x = circx + (t2x-circx)*radiusfactor;
      t2y = circy + (t2y-circy)*radiusfactor;
      t3x = circx + (t3x-circx)*radiusfactor;
      t3y = circy + (t3y-circy)*radiusfactor;

      components['/r'].movePoint({x: r});

      expect(components['/c'].state.centerNumeric[0]).closeTo(circx,1E-12);
      expect(components['/c'].state.centerNumeric[1]).closeTo(circy,1E-12);
      expect(components['/c'].state.radiusNumeric).closeTo(r,1E-12);

      expect(components['/t'].state.vertices[0].tree[1]).closeTo(t1x,1E-12);
      expect(components['/t'].state.vertices[0].tree[2]).closeTo(t1y,1E-12);
      expect(components['/t'].state.vertices[1].tree[1]).closeTo(t2x,1E-12);
      expect(components['/t'].state.vertices[1].tree[2]).closeTo(t2y,1E-12);
      expect(components['/t'].state.vertices[2].tree[1]).closeTo(t3x,1E-12);
      expect(components['/t'].state.vertices[2].tree[2]).closeTo(t3y,1E-12);
      expect(components['/c'].state.center.tree[1]).closeTo(circx,1E-12);
      expect(components['/c'].state.center.tree[2]).closeTo(circy,1E-12);
      expect(components['/c'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/x'].state.xs[0].tree).closeTo(circx,1E-12);
      expect(components['/y'].state.xs[1].tree).closeTo(circy,1E-12);
      expect(components['/r'].state.xs[0].tree).closeTo(r,1E-12);
   
    })



  })

  it('circle where radius depends on center',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
  <text>a</text>
  <graph>
    <circle>
      <center>(1,2)</center>
      <radius><extract prop="y"><ref prop="center">_circle1</ref></extract></radius>
    </circle>
    <ref prop="center">_circle1</ref>
  </graph>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a')// to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",1,2]);
      expect(components['/_circle1'].state.radius.tree).eq(2);
      expect(components['/_ref2'].replacements[0].state.coords.tree).eqls(["tuple",1,2])
    })

    cy.log("move circle");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_circle1'].moveCircle({center: [-3,5]});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-3,5]);
      expect(components['/_circle1'].state.radius.tree).eq(5);
      expect(components['/_ref2'].replacements[0].state.coords.tree).eqls(["tuple",-3,5])
    })

    cy.log("move center point");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_ref2'].replacements[0].movePoint({x: 8, y: 7});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",8,7]);
      expect(components['/_circle1'].state.radius.tree).eq(7);
      expect(components['/_ref2'].replacements[0].state.coords.tree).eqls(["tuple", 8,7])
    })

    cy.log("move circle below x-axis");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_circle1'].moveCircle({center: [3,-2]});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",3,-2]);
      expect(components['/_circle1'].state.radius.tree).eq(-2);
      expect(components['/_ref2'].replacements[0].state.coords.tree).eqls(["tuple",3,-2])
    })

    cy.log("move circle back up with center point");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_ref2'].replacements[0].movePoint({x: 1, y: 4});
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",1,4]);
      expect(components['/_circle1'].state.radius.tree).eq(4);
      expect(components['/_ref2'].replacements[0].state.coords.tree).eqls(["tuple",1,4])
    })

  })


});
  