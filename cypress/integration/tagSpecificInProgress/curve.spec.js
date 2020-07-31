describe('Curve Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('spline through four points, as string with ref', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <curve>
    (-1,2),(2, <copy prop="value" tname="_mathinput1" />),
    (2<copy prop="value" tname="_mathinput1" />, -4), (5,6)
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(-2);
      expect(components['/_curve1'].parameterization(1)).eqls([2, -2]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(-4);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([-4, -4]);
    })

    cy.get("#\\/_mathinput1_input").clear().type("4{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(4);
      expect(components['/_curve1'].parameterization(1)).eqls([2, 4]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(8);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([8, -4]);
    })

  });

  it('spline through four points, as reffed points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <point>(-1,2)</point>
    <point>(2, <copy prop="value" tname="_mathinput1" />)</point>
    <point>(2<copy prop="value" tname="_mathinput1" />, -4)</point>
    <point>(5,6)</point>
    <curve>
    <copy tname="_point1" />
    <copy tname="_point2" />
    <copy tname="_point3" />
    <copy tname="_point4" />
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(-2);
      expect(components['/_curve1'].parameterization(1)).eqls([2, -2]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(-4);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([-4, -4]);
    })

    cy.get("#\\/_mathinput1_input").clear().type("4{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(4);
      expect(components['/_curve1'].parameterization(1)).eqls([2, 4]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(8);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([8, -4]);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: 5, y: 7 })
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(5);
      expect(components['/_curve1'].parameterization(1, 1)).eq(7);
      expect(components['/_curve1'].parameterization(1)).eqls([5, 7]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(14);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([14, -4]);
    })

  });

  it('spline through four points, as reffed points, no sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <point>(-1,2)</point>
    <point>(2, <copy prop="value" tname="_mathinput1" />)</point>
    <point>(2<copy prop="value" tname="_mathinput1" />, -4)</point>
    <point>(5,6)</point>
    <curve>
    <through>
    <copy tname="_point1" />
    <copy tname="_point2" />
    <copy tname="_point3" />
    <copy tname="_point4" />
    </through>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(-2);
      expect(components['/_curve1'].parameterization(1)).eqls([2, -2]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(-4);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([-4, -4]);
    })

    cy.get("#\\/_mathinput1_input").clear().type("4{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(4);
      expect(components['/_curve1'].parameterization(1)).eqls([2, 4]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(8);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([8, -4]);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: 5, y: 7 })
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);
      expect(components['/_curve1'].parameterization(1, 0)).eq(5);
      expect(components['/_curve1'].parameterization(1, 1)).eq(7);
      expect(components['/_curve1'].parameterization(1)).eqls([5, 7]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(14);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([14, -4]);
    })

  });

  it('spline through four points, as reffed points, change spline parameters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <point>(-1,2)</point>
    <point>(2, <copy prop="value" tname="_mathinput1" />)</point>
    <point>(2<copy prop="value" tname="_mathinput1" />, -4)</point>
    <point>(5,6)</point>
    <curve splineform="uniform" splinetension="0.4">
    <copy tname="_point1" />
    <copy tname="_point2" />
    <copy tname="_point3" />
    <copy tname="_point4" />
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("uniform");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.4);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(-2);
      expect(components['/_curve1'].parameterization(1)).eqls([2, -2]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(-4);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([-4, -4]);
    })

    cy.get("#\\/_mathinput1_input").clear().type("4{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("uniform");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.4);
      expect(components['/_curve1'].parameterization(1, 0)).eq(2);
      expect(components['/_curve1'].parameterization(1, 1)).eq(4);
      expect(components['/_curve1'].parameterization(1)).eqls([2, 4]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(8);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([8, -4]);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point2'].movePoint({ x: 5, y: 7 })
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("uniform");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.4);
      expect(components['/_curve1'].parameterization(1, 0)).eq(5);
      expect(components['/_curve1'].parameterization(1, 1)).eq(7);
      expect(components['/_curve1'].parameterization(1)).eqls([5, 7]);
      expect(components['/_curve1'].parameterization(2, 0)).eq(14);
      expect(components['/_curve1'].parameterization(2, 1)).eq(-4);
      expect(components['/_curve1'].parameterization(2)).eqls([14, -4]);
    })

  });

  it('constrain to spline', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput />
    <mathinput prefill="0.8"/>
    <graph>
    <point>(-7,-4)</point>
    <point>(2.5,6)</point>
    <point>(3, 5.8)</point>
    <point>(8,-6)</point>
    <curve>
      <splineform><copy prop="value" tname="_textinput1" /></splineform>
      <splinetension><copy prop="value" tname="_mathinput1" /></splinetension>
     <copy tname="_point1" />
     <copy tname="_point2" />
     <copy tname="_point3" />
     <copy tname="_point4" />
    </curve>
    
    <point>(5,10)
    <constrainTo><copy tname="_curve1" /></constrainTo>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.curveType).eq("spline");
      expect(components['/_curve1'].stateValues.nPoints).eq(4);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);

      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(2.8, 0.1);
      expect(y).closeTo(6.1, 0.1);
    })

    cy.get("#\\/_textinput1_input").clear().type("uniform{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.splineform).eq("uniform");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);
      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(3.4, 0.1);
      expect(y).closeTo(8, 0.1);
    })

    cy.get("#\\/_textinput1_input").clear().type("centripetal{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.8);
      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(2.8, 0.1);
      expect(y).closeTo(6.1, 0.1);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point5'].movePoint({ x: 10, y: 2 })
      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(5.5, 0.1);
      expect(y).closeTo(0.2, 0.1);
    })

    cy.get("#\\/_mathinput1_input").clear().type("0.1{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.1);
      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(5.5, 0.1);
      expect(y).closeTo(0.2, 0.1);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 9, y: 9 });
      components['/_point2'].movePoint({ x: -9, y: 2 });
      components['/_point3'].movePoint({ x: 6, y: -8 });
      components['/_point4'].movePoint({ x: 9, y: 9 });
      components['/_point5'].movePoint({ x: 10, y: -7 });
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.1);
      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(6.4, 0.1);
      expect(y).closeTo(-6.3, 0.1);
    })

    cy.get("#\\/_textinput1_input").clear().type("uniform{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point5'].movePoint({ x: 10, y: -7 });
      expect(components['/_curve1'].stateValues.splineform).eq("uniform");
      expect(components['/_curve1'].stateValues.splinetension).eq(0.1);
      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(6.5, 0.1);
      expect(y).closeTo(-6.3, 0.1);
    })

    cy.get("#\\/_mathinput1_input").clear().type("1{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point5'].movePoint({ x: 10, y: -7 });
      expect(components['/_curve1'].stateValues.splineform).eq("uniform");
      expect(components['/_curve1'].stateValues.splinetension).eq(1);
      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(8.6, 0.1);
      expect(y).closeTo(-6.1, 0.1);
    })

    cy.get("#\\/_textinput1_input").clear().blur()
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point5'].movePoint({ x: 10, y: -7 });
      expect(components['/_curve1'].stateValues.splineform).eq("centripetal");
      expect(components['/_curve1'].stateValues.splinetension).eq(1);
      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(7.4, 0.1);
      expect(y).closeTo(-6.1, 0.1);
    })

  });

  it('extrapolate', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput />
    <booleaninput />
    <graph>
    <point>(-7,-4)</point>
    <point>(-4, 3)</point>
    <point>(4, 3)</point>
    <point>(7,-4)</point>
    <curve>
    <extrapolatebackward><copy prop="value" tname="_booleaninput1" /></extrapolatebackward>
    <extrapolateforward><copy prop="value" tname="_booleaninput2" /></extrapolateforward>

     <copy tname="_point1" />
     <copy tname="_point2" />
     <copy tname="_point3" />
     <copy tname="_point4" />
    </curve>
    
    <point>(8,-8)
    <constrainTo><copy tname="_curve1" /></constrainTo>
    </point>
    <point>(-8,-8)
    <constrainTo><copy tname="_curve1" /></constrainTo>
    </point>
    
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(7, 1E-3);
      expect(y).closeTo(-4, 1E-3);

      x = components['/_point6'].stateValues.xs[0].tree;
      y = components['/_point6'].stateValues.xs[1].tree;
      expect(x).closeTo(-7, 1E-3);
      expect(y).closeTo(-4, 1E-3);
    })

    cy.log("turn on extrapolation")
    cy.get("#\\/_booleaninput1_input").click();
    cy.get("#\\/_booleaninput2_input").click();

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(8.6, 0.1);
      expect(y).closeTo(-7.7, 0.1);

      x = components['/_point6'].stateValues.xs[0].tree;
      y = components['/_point6'].stateValues.xs[1].tree;
      expect(x).closeTo(-8.6, 0.1);
      expect(y).closeTo(-7.7, 0.1);
    })

    cy.log("activate bezier controls and move tangents")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(0)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [-1, 2]
      })
      components['/_curve1'].togglePointControl(3)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2 * 3 - 1,
        controlvector: [1, 2]
      })
      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(5.7, 0.1);
      expect(y).closeTo(-5.6, 0.1);

      x = components['/_point6'].stateValues.xs[0].tree;
      y = components['/_point6'].stateValues.xs[1].tree;
      expect(x).closeTo(-5.7, 0.1);
      expect(y).closeTo(-5.6, 0.1);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [1, -2]
      })
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2 * 3 - 1,
        controlvector: [-1, -2]
      })

      components['/_point5'].movePoint({ x: 9, y: -3 })

      let x = components['/_point5'].stateValues.xs[0].tree;
      let y = components['/_point5'].stateValues.xs[1].tree;
      expect(x).closeTo(7.5, 0.1);
      expect(y).closeTo(-2.5, 0.1);

      components['/_point6'].movePoint({ x: -9, y: -3 })

      x = components['/_point6'].stateValues.xs[0].tree;
      y = components['/_point6'].stateValues.xs[1].tree;
      expect(x).closeTo(-7.5, 0.1);
      expect(y).closeTo(-2.5, 0.1);
    })


  });

  it('variable length curve', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput /></p>
    <p>Step size: <mathinput /></p>
    
    <graph>
    <curve>
      <through>
      <map>
        <template><point>(<copyFromSubs/>, sin(<copyFromSubs/>))</point></template>
        <substitutions>
          <sequence from="0">
            <count><copy prop="value" tname="_mathinput1" /></count>
            <step><copy prop="value" tname="_mathinput2" /></step>
          </sequence>
        </substitutions>
      </map>
      </through>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let curve = components['/_curve1'];

      expect(curve.state.throughpoints.length).eq(0);
      expect(curve.state.controlvectors.length).eq(0);

    })

    cy.get("#\\/_mathinput1_input").clear().type("10{enter}");
    cy.get("#\\/_mathinput2_input").clear().type("1{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let curve = components['/_curve1'];

      let throughpoints = curve.state.throughpoints;

      expect(throughpoints.length).eq(10);
      expect(curve.state.controlvectors.length).eq(19);

      for (let i = 0; i < 10; i++) {
        expect(throughpoints[i].tree[1]).closeTo(i, 1E-12);
        expect(throughpoints[i].tree[2]).closeTo(Math.sin(i), 1E-12);
      }
    })

    cy.get("#\\/_mathinput1_input").clear().type("20{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let curve = components['/_curve1'];

      let throughpoints = curve.state.throughpoints;

      expect(throughpoints.length).eq(20);
      expect(curve.state.controlvectors.length).eq(39);

      for (let i = 0; i < 20; i++) {
        expect(throughpoints[i].tree[1]).closeTo(i, 1E-12);
        expect(throughpoints[i].tree[2]).closeTo(Math.sin(i), 1E-12);
      }
    })


    cy.get("#\\/_mathinput2_input").clear().type("0.5{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let curve = components['/_curve1'];

      let throughpoints = curve.state.throughpoints;

      expect(throughpoints.length).eq(20);
      expect(curve.state.controlvectors.length).eq(39);

      for (let i = 0; i < 20; i++) {
        expect(throughpoints[i].tree[1]).closeTo(i * 0.5, 1E-12);
        expect(throughpoints[i].tree[2]).closeTo(Math.sin(i * 0.5), 1E-12);
      }
    })

    cy.get("#\\/_mathinput1_input").clear().type("10{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let curve = components['/_curve1'];

      let throughpoints = curve.state.throughpoints;

      expect(throughpoints.length).eq(10);
      expect(curve.state.controlvectors.length).eq(19);

      for (let i = 0; i < 10; i++) {
        expect(throughpoints[i].tree[1]).closeTo(i * 0.5, 1E-12);
        expect(throughpoints[i].tree[2]).closeTo(Math.sin(i * 0.5), 1E-12);
      }
    })


  });

  it('new curve from reffed vertices, some flipped', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>(-9,6),(-3,7),(4,0),(8,5)</curve>
    </graph>
    <graph>
    <curve>
      <copy prop="throughpoint1" tname="_curve1" />
      <point>
        (<extract prop="y"><copy prop="throughpoint2" tname="_curve1" /></extract>,
        <extract prop="x"><copy prop="throughpoint2" tname="_curve1" /></extract>)
      </point>
      <copy prop="throughpoint3" tname="_curve1" />
      <point>
        <x><extract prop="y"><copy prop="throughpoint4" tname="_curve1" /></extract></x>
        <y><extract prop="x"><copy prop="throughpoint4" tname="_curve1" /></extract></y>
      </point>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    cy.window().then((win) => {
      let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];
      let psflipped = [[-9, 6], [7, -3], [4, 0], [5, 8]];
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve1'].stateValues.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve1'].stateValues.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve1'].stateValues.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].stateValues.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_curve2'].stateValues.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_curve2'].stateValues.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_curve2'].stateValues.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);
    })

    cy.log('move first curve points')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      let psflipped = [[7, 2], [-3, 1], [2, 9], [-3, -4]];

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: ps[0]
      });

      expect(components['/_curve1'].stateValues.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve2'].stateValues.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: ps[1]
      });

      expect(components['/_curve1'].stateValues.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve2'].stateValues.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: ps[2]
      });

      expect(components['/_curve1'].stateValues.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve2'].stateValues.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: ps[3]
      });

      expect(components['/_curve1'].stateValues.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].stateValues.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

    })

    cy.log('move second polyline verticies')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: psflipped[0]
      });

      expect(components['/_curve1'].stateValues.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve2'].stateValues.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: psflipped[1]
      });

      expect(components['/_curve1'].stateValues.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve2'].stateValues.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: psflipped[2]
      });

      expect(components['/_curve1'].stateValues.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve2'].stateValues.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: psflipped[3]
      });

      expect(components['/_curve1'].stateValues.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].stateValues.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

    })

  });

  it('extracting point coordinates of symmetric curve', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <point>(1,2)</point>
      <point>
        (<copy prop="y" tname="_point1" />, <copy prop="x" tname="_point1" />)
      </point>
    </curve> 
    <point name="x1">
      <x><extract prop="x"><copy prop="throughpoint1" tname="_curve1" /></extract></x>
      <y fixed>3</y>
    </point>
    <point name="x2">
      <x><extract prop="x"><copy prop="throughpoint2" tname="_curve1" /></extract></x>
      <y fixed>4</y>
    </point>
    <point name="y1">
      <y><extract prop="y"><copy prop="throughpoint1" tname="_curve1" /></extract></y>
      <x fixed>3</x>
    </point>
    <point name="y2">
      <y><extract prop="y"><copy prop="throughpoint2" tname="_curve1" /></extract></y>
      <x fixed>4</x>
    </point>
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  //wait for window to load


    let x = 1, y = 2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.throughpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_curve1'].stateValues.throughpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })

    cy.log("move x point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x = 3;
      components['/x1'].movePoint({ x: x });
      expect(components['/_curve1'].stateValues.throughpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_curve1'].stateValues.throughpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })

    cy.log("move x point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      y = 4;
      components['/x2'].movePoint({ x: y });
      expect(components['/_curve1'].stateValues.throughpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_curve1'].stateValues.throughpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })

    cy.log("move y point 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      y = -6;
      components['/y1'].movePoint({ y: y });
      expect(components['/_curve1'].stateValues.throughpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_curve1'].stateValues.throughpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })

    cy.log("move y point 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x = -8;
      components['/y2'].movePoint({ y: x });
      expect(components['/_curve1'].stateValues.throughpoints[0].tree).eqls(["tuple", x, y]);
      expect(components['/_curve1'].stateValues.throughpoints[1].tree).eqls(["tuple", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })


  });

});
