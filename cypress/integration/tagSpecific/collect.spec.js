describe('Collect Tag Tests',function() {

  beforeEach(() => {
    cy.visit('/test')
  })

  it.only('collect points from graphs',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,5)</point>
    </graph>

    <graph>
      <ref>_point1</ref>
      <point>(4,2)</point>
      <point>
        <x><ref prop="y">_point2</ref></x>
        <y><ref prop="x">_point2</ref></y>
      </point>
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" name="points">_panel1</collect>
    </graph>

    <p>Coordinates of points: <collect componentTypes="point" prop="coords" name="coords">_panel1</collect></p>
    <p><m>x</m>-coordinates of points: <aslist><collect componentTypes="point" prop="x" name="xs">_graph3</collect></aslist></p>
    <p><m>x</m>-coordinates of points via a ref: <aslist><ref name="xs2">xs</ref></aslist></p>
    <p><m>x</m>-coordinates of points via extract: <aslist><extract prop="x" name="xs3"><ref name="points2">points</ref></extract></aslist></p>
    <p>Average of <m>y</m>-coordinates of points: <mean name="mean"><collect componentTypes="point" prop="y" name="ys">_graph3</collect></mean></p>
    `},"*");
    });
  
    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load

    let x1=-3, y1=1;
    let x2=-7, y2=5;
    let x3=4, y3=2;

    let coords1Text = ('(' + x1 + ',' + y1 + ')').replace(/-/g, '−')
    let coords2Text = ('(' + x2 + ',' + y2 + ')').replace(/-/g, '−')
    let coords3Text = ('(' + x3 + ',' + y3 + ')').replace(/-/g, '−')
    let coords2tText = ('(' + y2 + ',' + x2 + ')').replace(/-/g, '−')

    let meany = (y1+y2+y1+y3+x2)/5

    cy.get('#\\/_p1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(coords1Text);
    })
    cy.get('#\\/_p1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(coords2Text);
    })
    cy.get('#\\/_p1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(coords1Text);
    })
    cy.get('#\\/_p1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(coords3Text);
    })
    cy.get('#\\/_p1 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(coords2tText);
    })

    cy.get('#\\/_p2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/,'−'));
    })
    cy.get('#\\/_p2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x2).replace(/-/,'−'));
    })
    cy.get('#\\/_p2 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/,'−'));
    })
    cy.get('#\\/_p2 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x3).replace(/-/,'−'));
    })
    cy.get('#\\/_p2 > span:nth-of-type(6)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(y2).replace(/-/,'−'));
    })

    cy.get('#\\/_p3 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/,'−'));
    })
    cy.get('#\\/_p3 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x2).replace(/-/,'−'));
    })
    cy.get('#\\/_p3 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/,'−'));
    })
    cy.get('#\\/_p3 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x3).replace(/-/,'−'));
    })
    cy.get('#\\/_p3 > span:nth-of-type(6)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(y2).replace(/-/,'−'));
    })


    cy.get('#\\/_p4 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/,'−'));
    })
    cy.get('#\\/_p4 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x2).replace(/-/,'−'));
    })
    cy.get('#\\/_p4 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/,'−'));
    })
    cy.get('#\\/_p4 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x3).replace(/-/,'−'));
    })
    cy.get('#\\/_p4 > span:nth-of-type(6)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(y2).replace(/-/,'−'));
    })

    cy.get('#\\/_p5 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(meany).replace(/-/,'−'));
    })


    cy.window().then((win) => {
      let xs = [x1,x2,x1,x3,y2];
      let ys = [y1,y2,y1,y3,x2];
      let components = Object.assign({},win.state.components);
      for(let i=0; i<5; i++) {
        expect(components['/points'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].state.value.tree).eqls(["tuple", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].state.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].state.value.tree).eq(meany);

    })

    cy.log("move point 1")
    cy.window().then((win) => {
      x1 = -8;
      y1 = 6;
      let xs = [x1,x2,x1,x3,y2];
      let ys = [y1,y2,y1,y3,x2];
      meany = (y1+y2+y1+y3+x2)/5

      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x:x1, y:y1});

      for(let i=0; i<5; i++) {
        expect(components['/points'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].state.value.tree).eqls(["tuple", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].state.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].state.value.tree).eq(meany);

    })

    cy.log("move point 1 via ref")
    cy.window().then((win) => {
      x1 = 2;
      y1 = 0;
      let xs = [x1,x2,x1,x3,y2];
      let ys = [y1,y2,y1,y3,x2];
      meany = (y1+y2+y1+y3+x2)/5

      let components = Object.assign({},win.state.components);
      components['/_ref1'].replacements[0].movePoint({x:x1, y:y1});

      for(let i=0; i<5; i++) {
        expect(components['/points'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].state.value.tree).eqls(["tuple", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].state.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].state.value.tree).eq(meany);

    })


    cy.log("move point 2")
    cy.window().then((win) => {
      x2 = 4;
      y2 = 8;
      let xs = [x1,x2,x1,x3,y2];
      let ys = [y1,y2,y1,y3,x2];
      meany = (y1+y2+y1+y3+x2)/5

      let components = Object.assign({},win.state.components);
      components['/_point2'].movePoint({x:x2, y:y2});

      for(let i=0; i<5; i++) {
        expect(components['/points'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].state.value.tree).eqls(["tuple", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].state.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].state.value.tree).eq(meany);

    })


    cy.log("move flipped point 2")
    cy.window().then((win) => {
      x2 = -1;
      y2 = -3;
      let xs = [x1,x2,x1,x3,y2];
      let ys = [y1,y2,y1,y3,x2];
      meany = (y1+y2+y1+y3+x2)/5

      let components = Object.assign({},win.state.components);
      components['/_point4'].movePoint({x:y2, y:x2});

      for(let i=0; i<5; i++) {
        expect(components['/points'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].state.value.tree).eqls(["tuple", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].state.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].state.value.tree).eq(meany);

    })

    cy.log("move point 3")
    cy.window().then((win) => {
      x3 = -5;
      y3 = 9;
      let xs = [x1,x2,x1,x3,y2];
      let ys = [y1,y2,y1,y3,x2];
      meany = (y1+y2+y1+y3+x2)/5

      let components = Object.assign({},win.state.components);
      components['/_point3'].movePoint({x:x3, y:y3});

      for(let i=0; i<5; i++) {
        expect(components['/points'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[i].state.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[i].state.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].state.value.tree).eqls(["tuple", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].state.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].state.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].state.value.tree).eq(meany);

    })
  });

  it('collect dynamic points from graphs',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <mathinput name="count" prefill="3"/>
    <mathinput name="mult" prefill="2"/>
    <panel>
    <graph>
      <map>
        <template><point>(<subsref/>, <ref prop="value">mult</ref><subsref/>)</point></template>
        <substitutions><sequence><to><ref prop="value">count</ref></to></sequence></substitutions>
      </map>
      <line>y=x/3</line>
    </graph>

    <graph>
      <map>
      <template><point>(<extract prop="x"><subsref/></extract>+1, 1.5*<extract prop="y"><subsref/></extract>)</point></template>
      <substitutions><collect components="point">_map1</collect></substitutions>
    </map>

    </graph>
    </panel>

    <graph>
      <collect components="point">_panel1</collect>
    </graph>

    <p>y-coordinates of points: <aslist>
      <collect components="point" prop="y">_graph3</collect>
    </aslist></p>
    `},"*");
    });
  
    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length).eq(3);
      expect(components['/_collect1'].replacements.length).eq(3);
      expect(components['/_map2'].replacements.length).eq(3);
      expect(components['/_collect2'].replacements.length).eq(6);
      expect(components['/_collect3'].replacements.length).eq(6);

      for(let i=0; i<3; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(3*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_collect2'].replacements[i+3].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+3].state.xs[1].tree).eq(3*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(2*x);
        expect(components['/_collect3'].replacements[i+3].state.value.tree).eq(3*x);
      }

    })

    cy.log("increase number of points")
    cy.get('#\\/count_input').clear().type(`5{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length).eq(5);
      expect(components['/_collect1'].replacements.length).eq(5);
      expect(components['/_map2'].replacements.length).eq(5);
      expect(components['/_collect2'].replacements.length).eq(10);
      expect(components['/_collect3'].replacements.length).eq(10);

      for(let i=0; i<5; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(3*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_collect2'].replacements[i+5].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+5].state.xs[1].tree).eq(3*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(2*x);
        expect(components['/_collect3'].replacements[i+5].state.value.tree).eq(3*x);
      }

    })


    cy.log("change multiple")
    cy.get('#\\/mult_input').clear().type(`0.5{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length).eq(5);
      expect(components['/_collect1'].replacements.length).eq(5);
      expect(components['/_map2'].replacements.length).eq(5);
      expect(components['/_collect2'].replacements.length).eq(10);
      expect(components['/_collect3'].replacements.length).eq(10);

      for(let i=0; i<5; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+5].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+5].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+5].state.value.tree).eq(0.75*x);
      }

    })


    cy.log("decrease number of points")
    cy.get('#\\/count_input').clear().type(`1{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length - components['/_map1'].replacementsToWithhold).eq(1);
      expect(components['/_collect1'].replacements.length).eq(1);
      expect(components['/_map2'].replacements.length - components['/_map2'].replacementsToWithhold).eq(1);
      expect(components['/_collect2'].replacements.length).eq(2);
      expect(components['/_collect3'].replacements.length).eq(2);

      for(let i=0; i<1; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+1].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+1].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+1].state.value.tree).eq(0.75*x);
      }

    })


    cy.log("increase number of points back to 4")
    cy.get('#\\/count_input').clear().type(`4{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length - components['/_map1'].replacementsToWithhold).eq(4);
      expect(components['/_collect1'].replacements.length).eq(4);
      expect(components['/_map2'].replacements.length - components['/_map2'].replacementsToWithhold).eq(4);
      expect(components['/_collect2'].replacements.length).eq(8);
      expect(components['/_collect3'].replacements.length).eq(8);

      for(let i=0; i<4; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+4].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+4].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+4].state.value.tree).eq(0.75*x);
      }

    })

    cy.log("increase number of points to 6")
    cy.get('#\\/count_input').clear().type(`6{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length - components['/_map1'].replacementsToWithhold).eq(6);
      expect(components['/_collect1'].replacements.length).eq(6);
      expect(components['/_map2'].replacements.length - components['/_map2'].replacementsToWithhold).eq(6);
      expect(components['/_collect2'].replacements.length).eq(12);
      expect(components['/_collect3'].replacements.length).eq(12);

      for(let i=0; i<6; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+6].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+6].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+6].state.value.tree).eq(0.75*x);
      }

    })
  });

  // got rid of include hidden and always include hidden
  // rationale: if component becomes unhidden, it's not communicated to collect so it can't grab it after the fact
  it.skip(`default don't include hidden`,() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <extract prop="x"><ref prop="endpoint1">_linesegment1</ref></extract>
    <graph>
      <linesegment>(1,2),(-3,5)</linesegment>
    </graph>

    <graph>
      <collect components="point">_graph1</collect>
    </graph>

    <collect components="point" prop="x">_graph1</collect>

    `},"*");
    });
    
    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements.length).eq(0);
      expect(components['/_collect2'].replacements.length).eq(0);
    })

  })

  it.skip(`dynamically change if include hidden`,() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <extract prop="x"><ref prop="endpoint1">_linesegment1</ref></extract>
    <p>Include hidden: <booleaninput /></p>
    <graph>
      <linesegment>(1,2),(-3,5)</linesegment>
    </graph>

    <graph>
      <collect components="point">
        <includehidden><ref prop="value">_booleaninput1</ref></includehidden>
        _graph1
      </collect>
    </graph>

    <p>x-coordinates of points: <aslist>
      <collect components="point" prop="x">
        <includehidden><ref prop="value">_booleaninput1</ref></includehidden>
        _graph1
      </collect>
    </aslist></p>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements.length).eq(0);
      expect(components['/_collect2'].replacements.length).eq(0);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple",1,2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple",-3,5]);
    })

    cy.log('include hidden')
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements.length).eq(2);
      expect(components['/_collect1'].replacements[0].state.xs[0].tree).eq(1);
      expect(components['/_collect1'].replacements[0].state.xs[1].tree).eq(2);
      expect(components['/_collect1'].replacements[1].state.xs[0].tree).eq(-3);
      expect(components['/_collect1'].replacements[1].state.xs[1].tree).eq(5);
      expect(components['/_collect2'].replacements.length).eq(2);
      expect(components['/_collect2'].replacements[0].state.value.tree).eq(1);
      expect(components['/_collect2'].replacements[1].state.value.tree).eq(-3);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple",1,2]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple",-3,5]);

    })

    cy.log('move points')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_collect1'].replacements[0].movePoint({x: 3, y: 9})
      components['/_collect1'].replacements[1].movePoint({x: -7, y: -6})
      expect(components['/_collect1'].replacements.length).eq(2);
      expect(components['/_collect1'].replacements[0].state.xs[0].tree).eq(3);
      expect(components['/_collect1'].replacements[0].state.xs[1].tree).eq(9);
      expect(components['/_collect1'].replacements[1].state.xs[0].tree).eq(-7);
      expect(components['/_collect1'].replacements[1].state.xs[1].tree).eq(-6);
      expect(components['/_collect2'].replacements.length).eq(2);
      expect(components['/_collect2'].replacements[0].state.value.tree).eq(3);
      expect(components['/_collect2'].replacements[1].state.value.tree).eq(-7);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple",3,9]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple",-7,-6]);

    })

    cy.log(`don't include hidden`)
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements.length).eq(0);
      expect(components['/_collect2'].replacements.length).eq(0);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple",3,9]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple",-7,-6]);
    })


    cy.log('move line segment point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_linesegment1'].moveLineSegment({point1coords: [0,-8]})
      expect(components['/_collect1'].replacements.length).eq(0);
      expect(components['/_collect2'].replacements.length).eq(0);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple",0,-8]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple",-7,-6]);

    })

    cy.log('include hidden again')
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements.length).eq(2);
      expect(components['/_collect1'].replacements[0].state.xs[0].tree).eq(0);
      expect(components['/_collect1'].replacements[0].state.xs[1].tree).eq(-8);
      expect(components['/_collect1'].replacements[1].state.xs[0].tree).eq(-7);
      expect(components['/_collect1'].replacements[1].state.xs[1].tree).eq(-6);
      expect(components['/_collect2'].replacements.length).eq(2);
      expect(components['/_collect2'].replacements[0].state.value.tree).eq(0);
      expect(components['/_collect2'].replacements[1].state.value.tree).eq(-7);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple",0,-8]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple",-7,-6]);

    })

    cy.log('move other line segment point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_linesegment1'].moveLineSegment({point2coords: [3,4]})
      expect(components['/_collect1'].replacements.length).eq(2);
      expect(components['/_collect1'].replacements[0].state.xs[0].tree).eq(0);
      expect(components['/_collect1'].replacements[0].state.xs[1].tree).eq(-8);
      expect(components['/_collect1'].replacements[1].state.xs[0].tree).eq(3);
      expect(components['/_collect1'].replacements[1].state.xs[1].tree).eq(4);
      expect(components['/_collect2'].replacements.length).eq(2);
      expect(components['/_collect2'].replacements[0].state.value.tree).eq(0);
      expect(components['/_collect2'].replacements[1].state.value.tree).eq(3);
      expect(components['/_linesegment1'].state.endpoints[0].tree).eqls(["tuple",0,-8]);
      expect(components['/_linesegment1'].state.endpoints[1].tree).eqls(["tuple",3,4]);

    })
  })

  it('collect points and lines from graphs',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,4)</point>
      <vector><ref>_point1</ref><ref>_point2</ref></vector>
    </graph>

    <graph>
      <point>
        <x><ref prop="y">_point1</ref></x>
        <y><ref prop="x">_point1</ref></y>
      </point>
      <point>
        <x><ref prop="y">_point2</ref></x>
        <y><ref prop="x">_point2</ref></y>
      </point>
      <vector><ref>_point3</ref><ref>_point4</ref></vector>
    </graph>
    </panel>

    <graph>
      <collect components="point,vector" >_panel1</collect>
    </graph>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load

    let x1=-3, y1=1;
    let x2=-7, y2=4;


    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_point1'].state.coords.tree).eqls(["tuple", x1, y1]);
      expect(components['/_point2'].state.coords.tree).eqls(["tuple", x2, y2]);
      expect(components['/_vector1'].state.tail.tree).eqls(["tuple", x1, y1]);
      expect(components['/_vector1'].state.head.tree).eqls(["tuple", x2, y2]);
      expect(components['/_point3'].state.coords.tree).eqls(["tuple", y1, x1]);
      expect(components['/_point4'].state.coords.tree).eqls(["tuple", y2, x2]);
      expect(components['/_vector2'].state.tail.tree).eqls(["tuple", y1, x1]);
      expect(components['/_vector2'].state.head.tree).eqls(["tuple", y2, x2]);
      expect(components['/_collect1'].replacements.length).eq(6);
      expect(components['/_collect1'].replacements[0].state.coords.tree).eqls(["tuple", x1, y1]);
      expect(components['/_collect1'].replacements[1].state.coords.tree).eqls(["tuple", x2, y2]);
      expect(components['/_collect1'].replacements[2].state.tail.tree).eqls(["tuple", x1, y1]);
      expect(components['/_collect1'].replacements[2].state.head.tree).eqls(["tuple", x2, y2]);
      expect(components['/_collect1'].replacements[3].state.coords.tree).eqls(["tuple", y1, x1]);
      expect(components['/_collect1'].replacements[4].state.coords.tree).eqls(["tuple", y2, x2]);
      expect(components['/_collect1'].replacements[5].state.tail.tree).eqls(["tuple", y1, x1]);
      expect(components['/_collect1'].replacements[5].state.head.tree).eqls(["tuple", y2, x2]);

    })

    cy.log("move vector 1 via copy")
    cy.window().then((win) => {
      x1 = -8;
      y1 = 6;
      x2 = 3;
      y2 = 2;

      let components = Object.assign({},win.state.components);
      components['/_collect1'].replacements[2].moveVector({tailcoords:[x1,y1], headcoords:[x2,y2]});
      expect(components['/_point1'].state.coords.tree).eqls(["tuple", x1, y1]);
      expect(components['/_point2'].state.coords.tree).eqls(["tuple", x2, y2]);
      expect(components['/_vector1'].state.tail.tree).eqls(["tuple", x1, y1]);
      expect(components['/_vector1'].state.head.tree).eqls(["tuple", x2, y2]);
      expect(components['/_point3'].state.coords.tree).eqls(["tuple", y1, x1]);
      expect(components['/_point4'].state.coords.tree).eqls(["tuple", y2, x2]);
      expect(components['/_vector2'].state.tail.tree).eqls(["tuple", y1, x1]);
      expect(components['/_vector2'].state.head.tree).eqls(["tuple", y2, x2]);
      expect(components['/_collect1'].replacements.length).eq(6);
      expect(components['/_collect1'].replacements[0].state.coords.tree).eqls(["tuple", x1, y1]);
      expect(components['/_collect1'].replacements[1].state.coords.tree).eqls(["tuple", x2, y2]);
      expect(components['/_collect1'].replacements[2].state.tail.tree).eqls(["tuple", x1, y1]);
      expect(components['/_collect1'].replacements[2].state.head.tree).eqls(["tuple", x2, y2]);
      expect(components['/_collect1'].replacements[3].state.coords.tree).eqls(["tuple", y1, x1]);
      expect(components['/_collect1'].replacements[4].state.coords.tree).eqls(["tuple", y2, x2]);
      expect(components['/_collect1'].replacements[5].state.tail.tree).eqls(["tuple", y1, x1]);
      expect(components['/_collect1'].replacements[5].state.head.tree).eqls(["tuple", y2, x2]);

    })

    cy.log("move vector 2 via copy")
    cy.window().then((win) => {
      x1 = 9;
      y1 = 0;
      x2 = -7;
      y2 = 5;

      let components = Object.assign({},win.state.components);
      components['/_collect1'].replacements[5].moveVector({tailcoords:[y1,x1], headcoords:[y2,x2]});
      expect(components['/_point1'].state.coords.tree).eqls(["tuple", x1, y1]);
      expect(components['/_point2'].state.coords.tree).eqls(["tuple", x2, y2]);
      expect(components['/_vector1'].state.tail.tree).eqls(["tuple", x1, y1]);
      expect(components['/_vector1'].state.head.tree).eqls(["tuple", x2, y2]);
      expect(components['/_point3'].state.coords.tree).eqls(["tuple", y1, x1]);
      expect(components['/_point4'].state.coords.tree).eqls(["tuple", y2, x2]);
      expect(components['/_vector2'].state.tail.tree).eqls(["tuple", y1, x1]);
      expect(components['/_vector2'].state.head.tree).eqls(["tuple", y2, x2]);
      expect(components['/_collect1'].replacements.length).eq(6);
      expect(components['/_collect1'].replacements[0].state.coords.tree).eqls(["tuple", x1, y1]);
      expect(components['/_collect1'].replacements[1].state.coords.tree).eqls(["tuple", x2, y2]);
      expect(components['/_collect1'].replacements[2].state.tail.tree).eqls(["tuple", x1, y1]);
      expect(components['/_collect1'].replacements[2].state.head.tree).eqls(["tuple", x2, y2]);
      expect(components['/_collect1'].replacements[3].state.coords.tree).eqls(["tuple", y1, x1]);
      expect(components['/_collect1'].replacements[4].state.coords.tree).eqls(["tuple", y2, x2]);
      expect(components['/_collect1'].replacements[5].state.tail.tree).eqls(["tuple", y1, x1]);
      expect(components['/_collect1'].replacements[5].state.head.tree).eqls(["tuple", y2, x2]);

    })
  });

  it('maximum number',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <mathinput name="count" prefill="5"/>
    <mathinput name="mult" prefill="2"/>
    <mathinput name="maxnumber" prefill="2"/>
    <panel>
    <graph>
      <map>
        <template><point>(<subsref/>, <ref prop="value">mult</ref><subsref/>)</point></template>
        <substitutions><sequence><to><ref prop="value">count</ref></to></sequence></substitutions>
      </map>
      <line>y=x/3</line>
    </graph>

    <graph>
      <map>
      <template><point>(<extract prop="x"><subsref/></extract>+1, 1.5*<extract prop="y"><subsref/></extract>)</point></template>
      <substitutions><collect components="point"><maximumnumber><ref prop="value">maxnumber</ref></maximumnumber>_map1</collect></substitutions>
    </map>

    </graph>
    </panel>

    <graph>
      <collect components="point"><maximumnumber>2<ref prop="value">maxnumber</ref></maximumnumber>_panel1</collect>
    </graph>

    <p>y-coordinates of points: <aslist>
      <collect components="point" prop="y"><maximumnumber><ref prop="value">maxnumber</ref></maximumnumber>_graph3</collect>
    </aslist></p>
    `},"*");
    });
  
    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length).eq(5);
      expect(components['/_collect1'].replacements.length).eq(2);
      expect(components['/_map2'].replacements.length).eq(2);
      expect(components['/_collect2'].replacements.length).eq(4);
      expect(components['/_collect3'].replacements.length).eq(2);

      for(let i=0; i<5; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(2*x);
      }
      for(let i=0; i<2; i++) {
        let x=i+1;
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(3*x);
      }
      for(let i=0; i<4; i++) {
        let x=i+1;
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(2*x);
      }
      for(let i=0; i<2; i++) {
        let x=i+1;
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(2*x);
      }

    })


    cy.log("increase maxnumber")
    cy.get('#\\/maxnumber_input').clear().type(`5{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length).eq(5);
      expect(components['/_collect1'].replacements.length).eq(5);
      expect(components['/_map2'].replacements.length).eq(5);
      expect(components['/_collect2'].replacements.length).eq(10);
      expect(components['/_collect3'].replacements.length).eq(5);

      for(let i=0; i<5; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(3*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_collect2'].replacements[i+5].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+5].state.xs[1].tree).eq(3*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(2*x);
        // expect(components['/_collect3'].replacements[i+5].state.value.tree).eq(3*x);
      }

    })



    cy.log("increase maxnumber further")
    cy.get('#\\/maxnumber_input').clear().type(`10{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length).eq(5);
      expect(components['/_collect1'].replacements.length).eq(5);
      expect(components['/_map2'].replacements.length).eq(5);
      expect(components['/_collect2'].replacements.length).eq(10);
      expect(components['/_collect3'].replacements.length).eq(10);

      for(let i=0; i<5; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(3*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(2*x);
        expect(components['/_collect2'].replacements[i+5].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+5].state.xs[1].tree).eq(3*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(2*x);
        expect(components['/_collect3'].replacements[i+5].state.value.tree).eq(3*x);
      }

    })



    cy.log("change multiple")
    cy.get('#\\/mult_input').clear().type(`0.5{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length).eq(5);
      expect(components['/_collect1'].replacements.length).eq(5);
      expect(components['/_map2'].replacements.length).eq(5);
      expect(components['/_collect2'].replacements.length).eq(10);
      expect(components['/_collect3'].replacements.length).eq(10);

      for(let i=0; i<5; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+5].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+5].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+5].state.value.tree).eq(0.75*x);
      }

    })


    cy.log("decrease number of points")
    cy.get('#\\/count_input').clear().type(`1{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length - components['/_map1'].replacementsToWithhold).eq(1);
      expect(components['/_collect1'].replacements.length).eq(1);
      expect(components['/_map2'].replacements.length - components['/_map2'].replacementsToWithhold).eq(1);
      expect(components['/_collect2'].replacements.length).eq(2);
      expect(components['/_collect3'].replacements.length).eq(2);

      for(let i=0; i<1; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+1].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+1].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+1].state.value.tree).eq(0.75*x);
      }

    })


    cy.log("increase number of points back to 4")
    cy.get('#\\/count_input').clear().type(`4{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length - components['/_map1'].replacementsToWithhold).eq(4);
      expect(components['/_collect1'].replacements.length).eq(4);
      expect(components['/_map2'].replacements.length - components['/_map2'].replacementsToWithhold).eq(4);
      expect(components['/_collect2'].replacements.length).eq(8);
      expect(components['/_collect3'].replacements.length).eq(8);

      for(let i=0; i<4; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+4].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+4].state.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+4].state.value.tree).eq(0.75*x);
      }

    })

    cy.log("decrease max number to 3")
    cy.get('#\\/maxnumber_input').clear().type(`3{enter}`);


    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_map1'].replacements.length - components['/_map1'].replacementsToWithhold).eq(4);
      expect(components['/_collect1'].replacements.length).eq(3);
      expect(components['/_map2'].replacements.length - components['/_map2'].replacementsToWithhold).eq(3);
      expect(components['/_collect2'].replacements.length).eq(6);
      expect(components['/_collect3'].replacements.length).eq(3);

      for(let i=0; i<4; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(0.5*x);
      }
      for(let i=0; i<3; i++) {
        let x=i+1;
        expect(components['/_collect1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].state.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].state.xs[1].tree).eq(0.75*x);
      }
      for(let i=0; i<4; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].state.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i].state.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].state.xs[1].tree).eq(0.5*x);
      }
      for(let i=0; i<2; i++) {
        let x=i+1;
        expect(components['/_collect2'].replacements[i+4].state.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+4].state.xs[1].tree).eq(0.75*x);
      }
      for(let i=0; i<3; i++) {
        let x=i+1;
        expect(components['/_collect3'].replacements[i].state.value.tree).eq(0.5*x);
      }

    })
  });

  it('collect child numbers',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <mathinput />

    <math>
      <sequence><to><ref prop="value">_mathinput1</ref></to></sequence>
      <math>a</math>
      <math>b</math>
      <math>c</math>
    </math>
    
    <collect prop="childnumber" components="math">_math1</collect>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text','a');

    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements[0].state.number).eq(1);
      expect(components['/_collect1'].replacements[1].state.number).eq(2);
      expect(components['/_collect1'].replacements[2].state.number).eq(3);
    })

    cy.get('#\\/_mathinput1_input').clear().type("3{enter}");

    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements[0].state.number).eq(1);
      expect(components['/_collect1'].replacements[1].state.number).eq(2);
      expect(components['/_collect1'].replacements[2].state.number).eq(3);
      expect(components['/_collect1'].replacements[3].state.number).eq(4);
      expect(components['/_collect1'].replacements[4].state.number).eq(5);
      expect(components['/_collect1'].replacements[5].state.number).eq(6);
    })

    cy.get('#\\/_mathinput1_input').clear().type("1{enter}");

    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements[0].state.number).eq(1);
      expect(components['/_collect1'].replacements[1].state.number).eq(2);
      expect(components['/_collect1'].replacements[2].state.number).eq(3);
      expect(components['/_collect1'].replacements[3].state.number).eq(4);
    })

  });

  it('collect, extract, ref multiple ways',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
  <text>a</text>

  <p>How many blanks? 
    <mathinput name="n" prefill="1" />
  </p>
 
  <p name="p_original">Enter expressions:
    <map>
      <template>
        <mathinput />
      </template>
      <substitutions>
        <sequence><count><ref prop="value">n</ref></count></sequence>
      </substitutions>
    </map>
  </p>
  
  <p name="p_1">Inputs collected then, values extracted: 
  <aslist name="al1"><extract prop="value" name="values1"><collect components="mathinput">p_original</collect></extract></aslist></p>

  <p name="p_1a">Reffed: <aslist name="al1a"><ref name="values1a">values1</ref></aslist></p>
  <p name="p_1b">Ref aslist: <ref name="al1b">al1</ref></p>
  <p name="p_1c">Ref reffed: <aslist><ref>values1a</ref></aslist></p>
  <p name="p_1d">Ref aslist containing ref: <ref>al1a</ref></p>
  <p name="p_1e">Ref reffed aslist: <ref>al1b</ref></p>

  <p name="p_2">Values collected: 
    <aslist name="al2"><collect prop="value" name="values2" components="mathinput">p_original</collect></aslist></p>
    
  <p name="p_2a">Reffed: <aslist name="al2a"><ref name="values2a">values2</ref></aslist></p>
  <p name="p_2b">Ref aslist: <ref name="al2b">al2</ref></p>
  <p name="p_2c">Ref reffed: <aslist><ref>values2a</ref></aslist></p>
  <p name="p_2d">Ref aslist containing ref: <ref>al2a</ref></p>
  <p name="p_2e">Ref reffed aslist: <ref>al2b</ref></p>

  <p name="p_3">Inputs collected: <aslist name="al3"><collect name="col" components="mathinput">p_original</collect></aslist></p>
  
  <p name="p_3a">Reffed: <aslist name="al3a"><ref name="cola">col</ref></aslist></p>
  <p name="p_3b">Ref aslist: <ref name="al3b">al3</ref></p>
  <p name="p_3c">Ref reffed: <aslist><ref>cola</ref></aslist></p>
  <p name="p_3d">Ref aslist containing ref: <ref>al3a</ref></p>
  <p name="p_3e">Ref reffed aslist: <ref>al3b</ref></p>
  
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text','a');

    cy.get('#\\/p_3e div:nth-of-type(1) input').clear().type('x{enter}');


    cy.get('#\\/p_original div:nth-of-type(1) input').should('have.value', 'x');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})

    cy.get('#\\/p_3 > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3a > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3b > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3c > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3d > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3e > div:nth-of-type(1) input').should('have.value', 'x');


    cy.get('#\\/n_input').clear().type("5{enter}")

    cy.get('#\\/p_original > div:nth-of-type(2) input').clear().type('y').blur();
    cy.get('#\\/p_original > div:nth-of-type(3) input').clear().type('z').blur();
    cy.get('#\\/p_original > div:nth-of-type(4) input').clear().type('u').blur();
    cy.get('#\\/p_original > div:nth-of-type(5) input').clear().type('v').blur();


    cy.get('#\\/p_original > div:nth-of-type(1) input').should('have.value', 'x');
    
    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})

    cy.get('#\\/p_3 > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3a > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3b > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3c > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3d > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3e > div:nth-of-type(1) input').should('have.value', 'x');


    cy.get('#\\/p_original > div:nth-of-type(2) input').should('have.value', 'y');

    cy.get('#\\/p_1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_1a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_1b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_1c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_1d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_1e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})

    cy.get('#\\/p_2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_2a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_2b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_2c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_2d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_2e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})

    cy.get('#\\/p_3 > div:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3a > div:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3b > div:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3c > div:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3d > div:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3e > div:nth-of-type(2) input').should('have.value', 'y');


    cy.get('#\\/p_original > div:nth-of-type(3) input').should('have.value', 'z');

    cy.get('#\\/p_1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_1a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_1b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_1c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_1d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_1e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})

    cy.get('#\\/p_2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_2a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_2b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_2c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_2d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_2e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})

    cy.get('#\\/p_3 > div:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3a > div:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3b > div:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3c > div:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3d > div:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3e > div:nth-of-type(3) input').should('have.value', 'z');


    cy.get('#\\/p_original > div:nth-of-type(4) input').should('have.value', 'u');

    cy.get('#\\/p_1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_1a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_1b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_1c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_1d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_1e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})

    cy.get('#\\/p_2 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_2a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_2b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_2c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_2d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_2e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})

    cy.get('#\\/p_3 > div:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3a > div:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3b > div:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3c > div:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3d > div:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3e > div:nth-of-type(4) input').should('have.value', 'u');


    cy.get('#\\/p_original > div:nth-of-type(5) input').should('have.value', 'v');

    cy.get('#\\/p_1 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_1a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_1b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_1c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_1d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_1e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})

    cy.get('#\\/p_2 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_2a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_2b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_2c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_2d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_2e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})

    cy.get('#\\/p_3 > div:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3a > div:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3b > div:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3c > div:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3d > div:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3e > div:nth-of-type(5) input').should('have.value', 'v');




    cy.get('#\\/n_input').clear().type("0{enter}");

    cy.get('#\\/n_input').clear().type("2{enter}");


    cy.get('#\\/p_original > div:nth-of-type(1) input').should('have.value', 'x');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('x')})

    cy.get('#\\/p_3 > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3a > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3b > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3c > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3d > div:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3e > div:nth-of-type(1) input').should('have.value', 'x');


    cy.get('#\\/p_original > div:nth-of-type(2) input').should('have.value', 'y');

    cy.get('#\\/p_1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_1a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_1b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_1c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_1d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_1e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})

    cy.get('#\\/p_2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_2a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_2b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_2c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_2d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})
    cy.get('#\\/p_2e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('y')})

    cy.get('#\\/p_3 > div:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3a > div:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3b > div:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3c > div:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3d > div:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3e > div:nth-of-type(2) input').should('have.value', 'y');



    cy.get('#\\/p_3 > div:nth-of-type(1) input').clear().type('a{enter}');
    cy.get('#\\/p_3a > div:nth-of-type(2) input').clear().type('b{enter}');


    cy.get('#\\/p_original > div:nth-of-type(1) input').should('have.value', 'a');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})

    cy.get('#\\/p_3 > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3a > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3b > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3c > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3d > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3e > div:nth-of-type(1) input').should('have.value', 'a');


    cy.get('#\\/p_original > div:nth-of-type(2) input').should('have.value', 'b');

    cy.get('#\\/p_1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})

    cy.get('#\\/p_2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})

    cy.get('#\\/p_3 > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3a > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3b > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3c > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3d > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3e > div:nth-of-type(2) input').should('have.value', 'b');



    cy.get('#\\/n_input').clear().type("5{enter}");


    cy.get('#\\/p_original > div:nth-of-type(1) input').should('have.value', 'a');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})

    cy.get('#\\/p_3 > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3a > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3b > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3c > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3d > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3e > div:nth-of-type(1) input').should('have.value', 'a');


    cy.get('#\\/p_original > div:nth-of-type(2) input').should('have.value', 'b');

    cy.get('#\\/p_1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})

    cy.get('#\\/p_2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})

    cy.get('#\\/p_3 > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3a > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3b > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3c > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3d > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3e > div:nth-of-type(2) input').should('have.value', 'b');


    cy.get('#\\/p_original > div:nth-of-type(3) input').should('have.value', 'z');

    cy.get('#\\/p_1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_1a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_1b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_1c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_1d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_1e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})

    cy.get('#\\/p_2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_2a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_2b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_2c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_2d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})
    cy.get('#\\/p_2e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('z')})

    cy.get('#\\/p_3 > div:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3a > div:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3b > div:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3c > div:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3d > div:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3e > div:nth-of-type(3) input').should('have.value', 'z');


    cy.get('#\\/p_original > div:nth-of-type(4) input').should('have.value', 'u');

    cy.get('#\\/p_1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_1a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_1b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_1c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_1d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_1e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})

    cy.get('#\\/p_2 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_2a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_2b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_2c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_2d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})
    cy.get('#\\/p_2e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('u')})

    cy.get('#\\/p_3 > div:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3a > div:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3b > div:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3c > div:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3d > div:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3e > div:nth-of-type(4) input').should('have.value', 'u');


    cy.get('#\\/p_original > div:nth-of-type(5) input').should('have.value', 'v');

    cy.get('#\\/p_1 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_1a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_1b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_1c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_1d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_1e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})

    cy.get('#\\/p_2 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_2a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_2b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_2c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_2d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})
    cy.get('#\\/p_2e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('v')})

    cy.get('#\\/p_3 > div:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3a > div:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3b > div:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3c > div:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3d > div:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3e > div:nth-of-type(5) input').should('have.value', 'v');



    cy.get('#\\/p_3b > div:nth-of-type(3) input').clear().type('c{enter}');
    cy.get('#\\/p_3c > div:nth-of-type(4) input').clear().type('d{enter}');
    cy.get('#\\/p_3d > div:nth-of-type(5) input').clear().type('e{enter}');


    cy.get('#\\/p_original > div:nth-of-type(1) input').should('have.value', 'a');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('a')})

    cy.get('#\\/p_3 > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3a > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3b > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3c > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3d > div:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3e > div:nth-of-type(1) input').should('have.value', 'a');


    cy.get('#\\/p_original > div:nth-of-type(2) input').should('have.value', 'b');

    cy.get('#\\/p_1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_1e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})

    cy.get('#\\/p_2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})
    cy.get('#\\/p_2e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('b')})

    cy.get('#\\/p_3 > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3a > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3b > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3c > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3d > div:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3e > div:nth-of-type(2) input').should('have.value', 'b');


    cy.get('#\\/p_original > div:nth-of-type(3) input').should('have.value', 'c');

    cy.get('#\\/p_1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})
    cy.get('#\\/p_1a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})
    cy.get('#\\/p_1b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})
    cy.get('#\\/p_1c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})
    cy.get('#\\/p_1d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})
    cy.get('#\\/p_1e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})

    cy.get('#\\/p_2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})
    cy.get('#\\/p_2a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})
    cy.get('#\\/p_2b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})
    cy.get('#\\/p_2c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})
    cy.get('#\\/p_2d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})
    cy.get('#\\/p_2e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('c')})

    cy.get('#\\/p_3 > div:nth-of-type(3) input').should('have.value', 'c');
    cy.get('#\\/p_3a > div:nth-of-type(3) input').should('have.value', 'c');
    cy.get('#\\/p_3b > div:nth-of-type(3) input').should('have.value', 'c');
    cy.get('#\\/p_3c > div:nth-of-type(3) input').should('have.value', 'c');
    cy.get('#\\/p_3d > div:nth-of-type(3) input').should('have.value', 'c');
    cy.get('#\\/p_3e > div:nth-of-type(3) input').should('have.value', 'c');


    cy.get('#\\/p_original > div:nth-of-type(4) input').should('have.value', 'd');

    cy.get('#\\/p_1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})
    cy.get('#\\/p_1a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})
    cy.get('#\\/p_1b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})
    cy.get('#\\/p_1c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})
    cy.get('#\\/p_1d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})
    cy.get('#\\/p_1e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})

    cy.get('#\\/p_2 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})
    cy.get('#\\/p_2a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})
    cy.get('#\\/p_2b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})
    cy.get('#\\/p_2c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})
    cy.get('#\\/p_2d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})
    cy.get('#\\/p_2e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('d')})

    cy.get('#\\/p_3 > div:nth-of-type(4) input').should('have.value', 'd');
    cy.get('#\\/p_3a > div:nth-of-type(4) input').should('have.value', 'd');
    cy.get('#\\/p_3b > div:nth-of-type(4) input').should('have.value', 'd');
    cy.get('#\\/p_3c > div:nth-of-type(4) input').should('have.value', 'd');
    cy.get('#\\/p_3d > div:nth-of-type(4) input').should('have.value', 'd');
    cy.get('#\\/p_3e > div:nth-of-type(4) input').should('have.value', 'd');


    cy.get('#\\/p_original > div:nth-of-type(5) input').should('have.value', 'e');

    cy.get('#\\/p_1 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})
    cy.get('#\\/p_1a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})
    cy.get('#\\/p_1b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})
    cy.get('#\\/p_1c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})
    cy.get('#\\/p_1d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})
    cy.get('#\\/p_1e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})

    cy.get('#\\/p_2 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})
    cy.get('#\\/p_2a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})
    cy.get('#\\/p_2b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})
    cy.get('#\\/p_2c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})
    cy.get('#\\/p_2d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})
    cy.get('#\\/p_2e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {expect(text.trim()).equal('e')})

    cy.get('#\\/p_3 > div:nth-of-type(5) input').should('have.value', 'e');
    cy.get('#\\/p_3a > div:nth-of-type(5) input').should('have.value', 'e');
    cy.get('#\\/p_3b > div:nth-of-type(5) input').should('have.value', 'e');
    cy.get('#\\/p_3c > div:nth-of-type(5) input').should('have.value', 'e');
    cy.get('#\\/p_3d > div:nth-of-type(5) input').should('have.value', 'e');
    cy.get('#\\/p_3e > div:nth-of-type(5) input').should('have.value', 'e');



  });

});
