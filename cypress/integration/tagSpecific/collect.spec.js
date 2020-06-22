describe('Collect Tag Tests',function() {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('collect points from graphs',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,5)</point>
    </graph>

    <graph>
      <copy tname="_point1" />
      <point>(4,2)</point>
      <point>
        <x><copy prop="y" tname="_point2" /></x>
        <y><copy prop="x" tname="_point2" /></y>
      </point>
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" name="points" tname="_panel1"/>
    </graph>

    <p>Coordinates of points: <collect componentTypes="point" prop="coords" name="coords" tname="_panel1"/></p>
    <p><m>x</m>-coordinates of points: <aslist><collect componentTypes="point" prop="x" name="xs" tname="_graph3"/></aslist></p>
    <p><m>x</m>-coordinates of points via a copy: <aslist><copy name="xs2" tname="xs" /></aslist></p>
    <p><m>x</m>-coordinates of points via extract: <aslist><extract prop="x" name="xs3"><copy name="points2" tname="points" /></extract></aslist></p>
    <p>Average of <m>y</m>-coordinates of points: <mean name="mean"><collect componentTypes="point" prop="y" name="ys" tname="_graph3"/></mean></p>
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

    cy.get('#\\/_p5 > span:nth-of-type(2)').invoke('text').then((text) => {
      expect(text.trim()).equal(String(meany).replace(/-/,'−'));
    })


    cy.window().then((win) => {
      let xs = [x1,x2,x1,x3,y2];
      let ys = [y1,y2,y1,y3,x2];
      let components = Object.assign({},win.state.components);
      for(let i=0; i<5; i++) {
        expect(components['/points'].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].stateValues.value.tree).eqls(["vector", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[0].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].stateValues.value).eq(meany);

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
        expect(components['/points'].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].stateValues.value.tree).eqls(["vector", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[0].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].stateValues.value).eq(meany);

    })

    cy.log("move point 1 via copy")
    cy.window().then((win) => {
      x1 = 2;
      y1 = 0;
      let xs = [x1,x2,x1,x3,y2];
      let ys = [y1,y2,y1,y3,x2];
      meany = (y1+y2+y1+y3+x2)/5

      let components = Object.assign({},win.state.components);
      components['/_copy1'].replacements[0].movePoint({x:x1, y:y1});

      for(let i=0; i<5; i++) {
        expect(components['/points'].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].stateValues.value.tree).eqls(["vector", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[0].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].stateValues.value).eq(meany);

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
        expect(components['/points'].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].stateValues.value.tree).eqls(["vector", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[0].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].stateValues.value).eq(meany);

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
        expect(components['/points'].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].stateValues.value.tree).eqls(["vector", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[0].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].stateValues.value).eq(meany);

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
        expect(components['/points'].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points'].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[0].tree).eq(xs[i]);
        expect(components['/points2'].replacements[0].replacements[i].stateValues.xs[1].tree).eq(ys[i]);
        expect(components['/coords'].replacements[i].stateValues.value.tree).eqls(["vector", xs[i], ys[i]]);
        expect(components['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs2'].replacements[0].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(components['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(components['/mean'].stateValues.value).eq(meany);

    })
  });

  it('collect dynamic points from graphs',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <mathinput name="count" prefill="3"/>
    <mathinput name="mult" prefill="2"/>
    <panel>
    <graph>
      <map>
        <template><point>(<copyFromSubs/>, <copy prop="value" tname="../mult" /><copyFromSubs/>)</point></template>
        <substitutions><sequence><to><copy prop="value" tname="count" /></to></sequence></substitutions>
      </map>
      <line>y=x/3</line>
    </graph>

    <graph>
      <map>
      <template><point>(<extract prop="x"><copyFromSubs/></extract>+1, 1.5*<extract prop="y"><copyFromSubs/></extract>)</point></template>
      <substitutions><collect componentTypes="point" tname="_map1"/></substitutions>
    </map>

    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" tname="_panel1"/>
    </graph>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" tname="_graph3" />
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(3*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_collect2'].replacements[i+3].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+3].stateValues.xs[1].tree).eq(3*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(2*x);
        expect(components['/_collect3'].replacements[i+3].stateValues.value.tree).eq(3*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(3*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_collect2'].replacements[i+5].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+5].stateValues.xs[1].tree).eq(3*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(2*x);
        expect(components['/_collect3'].replacements[i+5].stateValues.value.tree).eq(3*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+5].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+5].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+5].stateValues.value.tree).eq(0.75*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+1].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+1].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+1].stateValues.value.tree).eq(0.75*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+4].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+4].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+4].stateValues.value.tree).eq(0.75*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+6].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+6].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+6].stateValues.value.tree).eq(0.75*x);
      }

    })
  });

  // got rid of include hidden and always include hidden
  // rationale: if component becomes unhidden, it's not communicated to collect so it can't grab it after the fact
  it.skip(`default don't include hidden`,() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <extract prop="x"><copy prop="endpoint1" tname="_linesegment1" /></extract>
    <graph>
      <linesegment>(1,2),(-3,5)</linesegment>
    </graph>

    <graph>
      <collect componentTypes="point" tname="_graph1"/>
    </graph>

    <collect componentTypes="point" prop="x" tname="_graph1"/>

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
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <extract prop="x"><copy prop="endpoint1" tname="_linesegment1" /></extract>
    <p>Include hidden: <booleaninput /></p>
    <graph>
      <linesegment>(1,2),(-3,5)</linesegment>
    </graph>

    <graph>
      <collect componentTypes="point" tname="_graph1">
        <includehidden><copy prop="value" tname="_booleaninput1" /></includehidden>
      </collect>
    </graph>

    <p>x-coordinates of points: <aslist>
      <collect componentTypes="point" prop="x">
        <includehidden><copy prop="value" tname="_booleaninput1" /></includehidden>
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
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector",1,2]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector",-3,5]);
    })

    cy.log('include hidden')
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements.length).eq(2);
      expect(components['/_collect1'].replacements[0].stateValues.xs[0].tree).eq(1);
      expect(components['/_collect1'].replacements[0].stateValues.xs[1].tree).eq(2);
      expect(components['/_collect1'].replacements[1].stateValues.xs[0].tree).eq(-3);
      expect(components['/_collect1'].replacements[1].stateValues.xs[1].tree).eq(5);
      expect(components['/_collect2'].replacements.length).eq(2);
      expect(components['/_collect2'].replacements[0].stateValues.value.tree).eq(1);
      expect(components['/_collect2'].replacements[1].stateValues.value.tree).eq(-3);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector",1,2]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector",-3,5]);

    })

    cy.log('move points')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_collect1'].replacements[0].movePoint({x: 3, y: 9})
      components['/_collect1'].replacements[1].movePoint({x: -7, y: -6})
      expect(components['/_collect1'].replacements.length).eq(2);
      expect(components['/_collect1'].replacements[0].stateValues.xs[0].tree).eq(3);
      expect(components['/_collect1'].replacements[0].stateValues.xs[1].tree).eq(9);
      expect(components['/_collect1'].replacements[1].stateValues.xs[0].tree).eq(-7);
      expect(components['/_collect1'].replacements[1].stateValues.xs[1].tree).eq(-6);
      expect(components['/_collect2'].replacements.length).eq(2);
      expect(components['/_collect2'].replacements[0].stateValues.value.tree).eq(3);
      expect(components['/_collect2'].replacements[1].stateValues.value.tree).eq(-7);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector",3,9]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector",-7,-6]);

    })

    cy.log(`don't include hidden`)
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements.length).eq(0);
      expect(components['/_collect2'].replacements.length).eq(0);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector",3,9]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector",-7,-6]);
    })


    cy.log('move line segment point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_linesegment1'].moveLineSegment({point1coords: [0,-8]})
      expect(components['/_collect1'].replacements.length).eq(0);
      expect(components['/_collect2'].replacements.length).eq(0);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector",0,-8]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector",-7,-6]);

    })

    cy.log('include hidden again')
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_collect1'].replacements.length).eq(2);
      expect(components['/_collect1'].replacements[0].stateValues.xs[0].tree).eq(0);
      expect(components['/_collect1'].replacements[0].stateValues.xs[1].tree).eq(-8);
      expect(components['/_collect1'].replacements[1].stateValues.xs[0].tree).eq(-7);
      expect(components['/_collect1'].replacements[1].stateValues.xs[1].tree).eq(-6);
      expect(components['/_collect2'].replacements.length).eq(2);
      expect(components['/_collect2'].replacements[0].stateValues.value.tree).eq(0);
      expect(components['/_collect2'].replacements[1].stateValues.value.tree).eq(-7);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector",0,-8]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector",-7,-6]);

    })

    cy.log('move other line segment point')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_linesegment1'].moveLineSegment({point2coords: [3,4]})
      expect(components['/_collect1'].replacements.length).eq(2);
      expect(components['/_collect1'].replacements[0].stateValues.xs[0].tree).eq(0);
      expect(components['/_collect1'].replacements[0].stateValues.xs[1].tree).eq(-8);
      expect(components['/_collect1'].replacements[1].stateValues.xs[0].tree).eq(3);
      expect(components['/_collect1'].replacements[1].stateValues.xs[1].tree).eq(4);
      expect(components['/_collect2'].replacements.length).eq(2);
      expect(components['/_collect2'].replacements[0].stateValues.value.tree).eq(0);
      expect(components['/_collect2'].replacements[1].stateValues.value.tree).eq(3);
      expect(components['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector",0,-8]);
      expect(components['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector",3,4]);

    })
  })

  it('collect points and lines from graphs',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,4)</point>
      <vector><copy tname="_point1" /><copy tname="_point2" /></vector>
    </graph>

    <graph>
      <point>
        <x><copy prop="y" tname="_point1" /></x>
        <y><copy prop="x" tname="_point1" /></y>
      </point>
      <point>
        <x><copy prop="y" tname="_point2" /></x>
        <y><copy prop="x" tname="_point2" /></y>
      </point>
      <vector><copy tname="_point3" /><copy tname="_point4" /></vector>
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point,vector" tname="_panel1"/>
    </graph>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a'); // to wait for page to load

    let x1=-3, y1=1;
    let x2=-7, y2=4;


    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(components['/_point2'].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_point3'].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(components['/_point4'].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", y1, x1]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", y2, x2]);
      expect(components['/_collect1'].replacements.length).eq(6);
      expect(components['/_collect1'].replacements[0].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(components['/_collect1'].replacements[1].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(components['/_collect1'].replacements[2].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_collect1'].replacements[2].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_collect1'].replacements[3].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(components['/_collect1'].replacements[4].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(components['/_collect1'].replacements[5].stateValues.tail.tree).eqls(["vector", y1, x1]);
      expect(components['/_collect1'].replacements[5].stateValues.head.tree).eqls(["vector", y2, x2]);

    })

    cy.log("move vector 1 via copy")
    cy.window().then((win) => {
      x1 = -8;
      y1 = 6;
      x2 = 3;
      y2 = 2;

      let components = Object.assign({},win.state.components);
      components['/_collect1'].replacements[2].moveVector({tailcoords:[x1,y1], headcoords:[x2,y2]});
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(components['/_point2'].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_point3'].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(components['/_point4'].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", y1, x1]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", y2, x2]);
      expect(components['/_collect1'].replacements.length).eq(6);
      expect(components['/_collect1'].replacements[0].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(components['/_collect1'].replacements[1].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(components['/_collect1'].replacements[2].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_collect1'].replacements[2].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_collect1'].replacements[3].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(components['/_collect1'].replacements[4].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(components['/_collect1'].replacements[5].stateValues.tail.tree).eqls(["vector", y1, x1]);
      expect(components['/_collect1'].replacements[5].stateValues.head.tree).eqls(["vector", y2, x2]);

    })

    cy.log("move vector 2 via copy")
    cy.window().then((win) => {
      x1 = 9;
      y1 = 0;
      x2 = -7;
      y2 = 5;

      let components = Object.assign({},win.state.components);
      components['/_collect1'].replacements[5].moveVector({tailcoords:[y1,x1], headcoords:[y2,x2]});
      expect(components['/_point1'].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(components['/_point2'].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_point3'].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(components['/_point4'].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", y1, x1]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", y2, x2]);
      expect(components['/_collect1'].replacements.length).eq(6);
      expect(components['/_collect1'].replacements[0].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(components['/_collect1'].replacements[1].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(components['/_collect1'].replacements[2].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_collect1'].replacements[2].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_collect1'].replacements[3].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(components['/_collect1'].replacements[4].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(components['/_collect1'].replacements[5].stateValues.tail.tree).eqls(["vector", y1, x1]);
      expect(components['/_collect1'].replacements[5].stateValues.head.tree).eqls(["vector", y2, x2]);

    })
  });

  it('maximum number',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <mathinput name="count" prefill="5"/>
    <mathinput name="mult" prefill="2"/>
    <mathinput name="maxnumber" prefill="2"/>
    <panel>
    <graph>
      <map>
        <template><point>(<copyFromSubs/>, <copy prop="value" tname="../mult" /><copyFromSubs/>)</point></template>
        <substitutions><sequence><to><copy prop="value" tname="count" /></to></sequence></substitutions>
      </map>
      <line>y=x/3</line>
    </graph>

    <graph>
      <map>
      <template><point>(<extract prop="x"><copyFromSubs/></extract>+1, 1.5*<extract prop="y"><copyFromSubs/></extract>)</point></template>
      <substitutions><collect componentTypes="point" tname="_map1"><maximumnumber><copy prop="value" tname="maxnumber" /></maximumnumber></collect></substitutions>
    </map>

    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" tname="_panel1"><maximumnumber>2<copy prop="value" tname="maxnumber" /></maximumnumber></collect>
    </graph>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" tname="_graph3"><maximumnumber><copy prop="value" tname="maxnumber" /></maximumnumber></collect>
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(2*x);
      }
      for(let i=0; i<2; i++) {
        let x=i+1;
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(3*x);
      }
      for(let i=0; i<4; i++) {
        let x=i+1;
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(2*x);
      }
      for(let i=0; i<2; i++) {
        let x=i+1;
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(2*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(3*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_collect2'].replacements[i+5].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+5].stateValues.xs[1].tree).eq(3*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(2*x);
        // expect(components['/_collect3'].replacements[i+5].stateValues.value.tree).eq(3*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(3*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(2*x);
        expect(components['/_collect2'].replacements[i+5].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+5].stateValues.xs[1].tree).eq(3*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(2*x);
        expect(components['/_collect3'].replacements[i+5].stateValues.value.tree).eq(3*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+5].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+5].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+5].stateValues.value.tree).eq(0.75*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+1].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+1].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+1].stateValues.value.tree).eq(0.75*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i+4].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+4].stateValues.xs[1].tree).eq(0.75*x);
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5*x);
        expect(components['/_collect3'].replacements[i+4].stateValues.value.tree).eq(0.75*x);
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
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
      }
      for(let i=0; i<3; i++) {
        let x=i+1;
        expect(components['/_collect1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_map2'].replacements[i].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_map2'].replacements[i].stateValues.xs[1].tree).eq(0.75*x);
      }
      for(let i=0; i<4; i++) {
        let x=i+1;
        expect(components['/_map1'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_map1'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[0].tree).eq(x);
        expect(components['/_collect2'].replacements[i].stateValues.xs[1].tree).eq(0.5*x);
      }
      for(let i=0; i<2; i++) {
        let x=i+1;
        expect(components['/_collect2'].replacements[i+4].stateValues.xs[0].tree).eq(x+1);
        expect(components['/_collect2'].replacements[i+4].stateValues.xs[1].tree).eq(0.75*x);
      }
      for(let i=0; i<3; i++) {
        let x=i+1;
        expect(components['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5*x);
      }

    })
  });

  // removed functionality of collecting child numbers, at least for now
  it.skip('collect child numbers',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <mathinput />

    <math>
      <sequence><to><copy prop="value" tname="_mathinput1" /></to></sequence>
      <math>a</math>
      <math>b</math>
      <math>c</math>
    </math>
    
    <collect prop="childnumber" componentTypes="math" tname="_math1"/>
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
      expect(components['/_collect1'].replacements[0].stateValues.number).eq(1);
      expect(components['/_collect1'].replacements[1].stateValues.number).eq(2);
      expect(components['/_collect1'].replacements[2].stateValues.number).eq(3);
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
      expect(components['/_collect1'].replacements[0].stateValues.number).eq(1);
      expect(components['/_collect1'].replacements[1].stateValues.number).eq(2);
      expect(components['/_collect1'].replacements[2].stateValues.number).eq(3);
      expect(components['/_collect1'].replacements[3].stateValues.number).eq(4);
      expect(components['/_collect1'].replacements[4].stateValues.number).eq(5);
      expect(components['/_collect1'].replacements[5].stateValues.number).eq(6);
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
      expect(components['/_collect1'].replacements[0].stateValues.number).eq(1);
      expect(components['/_collect1'].replacements[1].stateValues.number).eq(2);
      expect(components['/_collect1'].replacements[2].stateValues.number).eq(3);
      expect(components['/_collect1'].replacements[3].stateValues.number).eq(4);
    })

  });

  it('collect, extract, copy multiple ways',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
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
        <sequence><count><copy prop="value" tname="n" /></count></sequence>
      </substitutions>
    </map>
  </p>
  
  <p name="p_1">Inputs collected then, values extracted: 
  <aslist name="al1"><extract prop="value" name="values1"><collect componentTypes="mathinput" tname="p_original"/></extract></aslist></p>

  <p name="p_1a">Copied: <aslist name="al1a"><copy name="values1a" tname="values1" /></aslist></p>
  <p name="p_1b">Copy aslist: <copy name="al1b" tname="al1" /></p>
  <p name="p_1c">Copy copied: <aslist><copy tname="values1a" /></aslist></p>
  <p name="p_1d">Copy aslist containing copy: <copy tname="al1a" /></p>
  <p name="p_1e">Copy copied aslist: <copy tname="al1b" /></p>

  <p name="p_2">Values collected: 
    <aslist name="al2"><collect prop="value" name="values2" componentTypes="mathinput" tname="p_original"/></aslist></p>
    
  <p name="p_2a">Copied: <aslist name="al2a"><copy name="values2a" tname="values2" /></aslist></p>
  <p name="p_2b">Copy aslist: <copy name="al2b" tname="al2" /></p>
  <p name="p_2c">Copy copied: <aslist><copy tname="values2a" /></aslist></p>
  <p name="p_2d">Copy aslist containing copy: <copy tname="al2a" /></p>
  <p name="p_2e">Copy copied aslist: <copy tname="al2b" /></p>

  <p name="p_3">Inputs collected: <aslist name="al3"><collect name="col" componentTypes="mathinput" tname="p_original"/></aslist></p>
  
  <p name="p_3a">Copied: <aslist name="al3a"><copy name="cola" tname="col" /></aslist></p>
  <p name="p_3b">Copy aslist: <copy name="al3b" tname="al3" /></p>
  <p name="p_3c">Copy copied: <aslist><copy tname="cola" /></aslist></p>
  <p name="p_3d">Copy aslist containing copy: <copy tname="al3a" /></p>
  <p name="p_3e">Copy copied aslist: <copy tname="al3b" /></p>
  
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text','a');

    cy.get('#\\/p_3e span:nth-of-type(1) input').clear().type('x{enter}');


    cy.get('#\\/p_original span:nth-of-type(1) input').should('have.value', 'x');

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

    cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'x');


    cy.get('#\\/n_input').clear().type("5{enter}")

    cy.get('#\\/p_original > span:nth-of-type(2) input').clear().type('y').blur();
    cy.get('#\\/p_original > span:nth-of-type(3) input').clear().type('z').blur();
    cy.get('#\\/p_original > span:nth-of-type(4) input').clear().type('u').blur();
    cy.get('#\\/p_original > span:nth-of-type(5) input').clear().type('v').blur();


    cy.get('#\\/p_original > span:nth-of-type(1) input').should('have.value', 'x');
    
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

    cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'x');


    cy.get('#\\/p_original > span:nth-of-type(2) input').should('have.value', 'y');

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

    cy.get('#\\/p_3 > span:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3a > span:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3b > span:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3c > span:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3d > span:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3e > span:nth-of-type(2) input').should('have.value', 'y');


    cy.get('#\\/p_original > span:nth-of-type(3) input').should('have.value', 'z');

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

    cy.get('#\\/p_3 > span:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3a > span:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3b > span:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3c > span:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3d > span:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3e > span:nth-of-type(3) input').should('have.value', 'z');


    cy.get('#\\/p_original > span:nth-of-type(4) input').should('have.value', 'u');

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

    cy.get('#\\/p_3 > span:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3a > span:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3b > span:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3c > span:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3d > span:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3e > span:nth-of-type(4) input').should('have.value', 'u');


    cy.get('#\\/p_original > span:nth-of-type(5) input').should('have.value', 'v');

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

    cy.get('#\\/p_3 > span:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3a > span:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3b > span:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3c > span:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3d > span:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3e > span:nth-of-type(5) input').should('have.value', 'v');




    cy.get('#\\/n_input').clear().type("0{enter}");

    cy.get('#\\/n_input').clear().type("2{enter}");


    cy.get('#\\/p_original > span:nth-of-type(1) input').should('have.value', 'x');

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

    cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'x');
    cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'x');


    cy.get('#\\/p_original > span:nth-of-type(2) input').should('have.value', 'y');

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

    cy.get('#\\/p_3 > span:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3a > span:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3b > span:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3c > span:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3d > span:nth-of-type(2) input').should('have.value', 'y');
    cy.get('#\\/p_3e > span:nth-of-type(2) input').should('have.value', 'y');



    cy.get('#\\/p_3 > span:nth-of-type(1) input').clear().type('a{enter}');
    cy.get('#\\/p_3a > span:nth-of-type(2) input').clear().type('b{enter}');


    cy.get('#\\/p_original > span:nth-of-type(1) input').should('have.value', 'a');

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

    cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'a');


    cy.get('#\\/p_original > span:nth-of-type(2) input').should('have.value', 'b');

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

    cy.get('#\\/p_3 > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3a > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3b > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3c > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3d > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3e > span:nth-of-type(2) input').should('have.value', 'b');



    cy.get('#\\/n_input').clear().type("5{enter}");


    cy.get('#\\/p_original > span:nth-of-type(1) input').should('have.value', 'a');

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

    cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'a');


    cy.get('#\\/p_original > span:nth-of-type(2) input').should('have.value', 'b');

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

    cy.get('#\\/p_3 > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3a > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3b > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3c > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3d > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3e > span:nth-of-type(2) input').should('have.value', 'b');


    cy.get('#\\/p_original > span:nth-of-type(3) input').should('have.value', 'z');

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

    cy.get('#\\/p_3 > span:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3a > span:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3b > span:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3c > span:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3d > span:nth-of-type(3) input').should('have.value', 'z');
    cy.get('#\\/p_3e > span:nth-of-type(3) input').should('have.value', 'z');


    cy.get('#\\/p_original > span:nth-of-type(4) input').should('have.value', 'u');

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

    cy.get('#\\/p_3 > span:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3a > span:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3b > span:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3c > span:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3d > span:nth-of-type(4) input').should('have.value', 'u');
    cy.get('#\\/p_3e > span:nth-of-type(4) input').should('have.value', 'u');


    cy.get('#\\/p_original > span:nth-of-type(5) input').should('have.value', 'v');

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

    cy.get('#\\/p_3 > span:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3a > span:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3b > span:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3c > span:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3d > span:nth-of-type(5) input').should('have.value', 'v');
    cy.get('#\\/p_3e > span:nth-of-type(5) input').should('have.value', 'v');



    cy.get('#\\/p_3b > span:nth-of-type(3) input').clear().type('c{enter}');
    cy.get('#\\/p_3c > span:nth-of-type(4) input').clear().type('d{enter}');
    cy.get('#\\/p_3d > span:nth-of-type(5) input').clear().type('e{enter}');


    cy.get('#\\/p_original > span:nth-of-type(1) input').should('have.value', 'a');

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

    cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'a');
    cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'a');


    cy.get('#\\/p_original > span:nth-of-type(2) input').should('have.value', 'b');

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

    cy.get('#\\/p_3 > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3a > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3b > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3c > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3d > span:nth-of-type(2) input').should('have.value', 'b');
    cy.get('#\\/p_3e > span:nth-of-type(2) input').should('have.value', 'b');


    cy.get('#\\/p_original > span:nth-of-type(3) input').should('have.value', 'c');

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

    cy.get('#\\/p_3 > span:nth-of-type(3) input').should('have.value', 'c');
    cy.get('#\\/p_3a > span:nth-of-type(3) input').should('have.value', 'c');
    cy.get('#\\/p_3b > span:nth-of-type(3) input').should('have.value', 'c');
    cy.get('#\\/p_3c > span:nth-of-type(3) input').should('have.value', 'c');
    cy.get('#\\/p_3d > span:nth-of-type(3) input').should('have.value', 'c');
    cy.get('#\\/p_3e > span:nth-of-type(3) input').should('have.value', 'c');


    cy.get('#\\/p_original > span:nth-of-type(4) input').should('have.value', 'd');

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

    cy.get('#\\/p_3 > span:nth-of-type(4) input').should('have.value', 'd');
    cy.get('#\\/p_3a > span:nth-of-type(4) input').should('have.value', 'd');
    cy.get('#\\/p_3b > span:nth-of-type(4) input').should('have.value', 'd');
    cy.get('#\\/p_3c > span:nth-of-type(4) input').should('have.value', 'd');
    cy.get('#\\/p_3d > span:nth-of-type(4) input').should('have.value', 'd');
    cy.get('#\\/p_3e > span:nth-of-type(4) input').should('have.value', 'd');


    cy.get('#\\/p_original > span:nth-of-type(5) input').should('have.value', 'e');

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

    cy.get('#\\/p_3 > span:nth-of-type(5) input').should('have.value', 'e');
    cy.get('#\\/p_3a > span:nth-of-type(5) input').should('have.value', 'e');
    cy.get('#\\/p_3b > span:nth-of-type(5) input').should('have.value', 'e');
    cy.get('#\\/p_3c > span:nth-of-type(5) input').should('have.value', 'e');
    cy.get('#\\/p_3d > span:nth-of-type(5) input').should('have.value', 'e');
    cy.get('#\\/p_3e > span:nth-of-type(5) input').should('have.value', 'e');



  });

});
