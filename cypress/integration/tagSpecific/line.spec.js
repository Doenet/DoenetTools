import me from 'math-expressions';

describe('Line Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('move points reffed by line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point label='P'>(3,5)</point>
  <point label='Q'>(-4,-1)</point>
    <line>
      <through>
        <ref>_point1</ref>
        <ref>_point2</ref>
      </through>
    </line>
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('move point P to (5,-5)')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 5, y: -5 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(5)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(-5)
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', 5, -5])
      expect(components['/_point2'].stateValues.xs[0].tree).eq(-4)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(-1)
      expect(components['/_point2'].stateValues.coords.tree).eqls(['vector', -4, -1])

    })
  })

  it('full unsugared <through><point> line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line label='l'>
      <through>
        <point>(1,2)</point>
        <point>(4,7)</point>
      </through>
    </line>
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('points are where they should be')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(2)
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', 1, 2])
      expect(components['/_point2'].stateValues.xs[0].tree).eq(4)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(7)
      expect(components['/_point2'].stateValues.coords.tree).eqls(['vector', 4, 7])

      expect(components['/_line1'].stateValues.label).eq('l')
      expect(components['/_line1'].stateValues.slope.tree).eqls(['/', 5, 3])

    })
  })

  it('sugar <point> from string inside <through>', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line label='l'>
      <through>
        (1,2),(4,7)
      </through>
    </line>
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let point1 = components['/_through1'].activeChildren[0];
      let point2 = components['/_through1'].activeChildren[1];

      cy.log('points are where they should be')
      cy.window().then((win) => {
        expect(point1.stateValues.xs[0].tree).eq(1)
        expect(point1.stateValues.xs[1].tree).eq(2)
        expect(point1.stateValues.coords.tree).eqls(['vector', 1, 2])
        expect(point2.stateValues.xs[0].tree).eq(4)
        expect(point2.stateValues.xs[1].tree).eq(7)
        expect(point2.stateValues.coords.tree).eqls(['vector', 4, 7])

        expect(components['/_line1'].stateValues.label).eq('l')
        expect(components['/_line1'].stateValues.slope.tree).eqls(['/', 5, 3])

      })
    })
  })

  it('sugar <through> from string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line label='l'>
        (1,2),(4,7)
    </line>
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let through1 = components["/_line1"].activeChildren[1];
      let point1 = through1.activeChildren[0];
      let point2 = through1.activeChildren[1];

      cy.log('points are where they should be')
      cy.window().then((win) => {
        expect(point1.stateValues.xs[0].tree).eq(1)
        expect(point1.stateValues.xs[1].tree).eq(2)
        expect(point1.stateValues.coords.tree).eqls(['vector', 1, 2])
        expect(point2.stateValues.xs[0].tree).eq(4)
        expect(point2.stateValues.xs[1].tree).eq(7)
        expect(point2.stateValues.coords.tree).eqls(['vector', 4, 7])

        expect(components['/_line1'].stateValues.label).eq('l')
        expect(components['/_line1'].stateValues.slope.tree).eqls(['/', 5, 3])

      })
    })
  })

  it('sugar <through> from strings and maths', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>1</math>
  <math>2</math>
  <graph>
    <line label='l'>
      (<ref>_math1</ref>,<ref>_math2</ref>),(<math>4</math>,7)
    </line>
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let through1 = components["/_line1"].activeChildren[1];
      let point1 = through1.activeChildren[0];
      let point2 = through1.activeChildren[1];

      cy.log('points are where they should be')
      cy.window().then((win) => {
        expect(point1.stateValues.xs[0].tree).eq(1)
        expect(point1.stateValues.xs[1].tree).eq(2)
        expect(point1.stateValues.coords.tree).eqls(['vector', 1, 2])
        expect(point2.stateValues.xs[0].tree).eq(4)
        expect(point2.stateValues.xs[1].tree).eq(7)
        expect(point2.stateValues.coords.tree).eqls(['vector', 4, 7])

        expect(components['/_line1'].stateValues.label).eq('l')
        expect(components['/_line1'].stateValues.slope.tree).eqls(['/', 5, 3])

      })
    })
  })

  it('sugar <through> from <points>', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>1</math>
  <math>2</math>
  <graph>
    <line label='l'>
      <point>(<ref>_math1</ref>,<ref>_math2</ref>)</point>
      <point>(<math>4</math>,7)</point>
    </line>
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('points are where they should be')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(1)
      expect(components['/_point1'].stateValues.xs[1].tree).eq(2)
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', 1, 2])
      expect(components['/_point2'].stateValues.xs[0].tree).eq(4)
      expect(components['/_point2'].stateValues.xs[1].tree).eq(7)
      expect(components['/_point2'].stateValues.coords.tree).eqls(['vector', 4, 7])

      expect(components['/_line1'].stateValues.label).eq('l')
      expect(components['/_line1'].stateValues.slope.tree).eqls(['/', 5, 3])

    })
  })

  it('sugar <point> label as a component', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line>
    <label>l</label>
      <through>
        (1,2),(4,7)
      </through>
    </line>
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let point1 = components['/_through1'].activeChildren[0];
      let point2 = components['/_through1'].activeChildren[1];


      cy.log('points are where they should be')
      cy.window().then((win) => {
        expect(point1.stateValues.xs[0].tree).eq(1)
        expect(point1.stateValues.xs[1].tree).eq(2)
        expect(point1.stateValues.coords.tree).eqls(['vector', 1, 2])
        expect(point2.stateValues.xs[0].tree).eq(4)
        expect(point2.stateValues.xs[1].tree).eq(7)
        expect(point2.stateValues.coords.tree).eqls(['vector', 4, 7])

        expect(components['/_line1'].stateValues.label).eq('l')
        expect(components['/_line1'].stateValues.slope.tree).eqls(['/', 5, 3])

      })
    })
  })

  it('line from sugared equation, single string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>1</math>
  <graph>
    <line>
      5x-2y=3
    </line>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.log('equation is what it should be')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(components['/_line1'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('5x-2y=3'))).to.be.true;
    })

    cy.log("Move line right 1 and down 3");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_line1'].stateValues.points[0].get_component(0),
        components['/_line1'].stateValues.points[0].get_component(1),
      ];
      let point2coords = [
        components['/_line1'].stateValues.points[1].get_component(0),
        components['/_line1'].stateValues.points[1].get_component(1),
      ];

      let moveX = 1;
      let moveY = -3;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_line1'].moveLine({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let newEquation = me.fromText("5x-2y=3").substitute({
        'x': ['+', 'x', -moveX],
        'y': ['+', 'y', -moveY],
      });

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(components['/_line1'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(newEquation)).to.be.true;

    })

  });

  it('line from unsugared equation, single string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>1</math>
  <graph>
    <line><equation>
      5x-2y=3
    </equation></line>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.log('equation is what it should be')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(components['/_line1'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('5x-2y=3'))).to.be.true;
    })

    cy.log("Move line right 1 and down 3");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_line1'].stateValues.points[0].get_component(0),
        components['/_line1'].stateValues.points[0].get_component(1),
      ];
      let point2coords = [
        components['/_line1'].stateValues.points[1].get_component(0),
        components['/_line1'].stateValues.points[1].get_component(1),
      ];

      let moveX = 1;
      let moveY = -3;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_line1'].moveLine({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let newEquation = me.fromText("5x-2y=3").substitute({
        'x': ['+', 'x', -moveX],
        'y': ['+', 'y', -moveY],
      });

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(components['/_line1'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(newEquation)).to.be.true;

    })

  });

  it('line from sugared equation, multiple pieces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>5x</math>
  <number>2</number>
  <graph>
    <line>
      <ref>_math1</ref>-<ref>_number1</ref>y=3
    </line>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5x')
    })

    cy.log('equation is what it should be')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(components['/_line1'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('5x-2y=3'))).to.be.true;
    })


  });

  it('line from equation with different variables', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line variables="u,v">
      5u-2v=3
    </line>
  </graph>
  <p>Variables are <ref prop="var1">_line1</ref> and <ref prop="var2">_line1</ref>.</p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let math1 = components['/_ref1'].replacements[0];
      let math1Anchor = '#' + math1.componentName;
      let math2 = components['/_ref2'].replacements[0];
      let math2Anchor = '#' + math2.componentName;

      cy.log('equation and line variable are what they should be')
      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u')
      })
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('v')
      })

      cy.window().then((win) => {

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(components['/_line1'].stateValues.equation.tree);
        expect(unproxiedEquation.equals(me.fromText('5u-2v=3'))).to.be.true;
        expect(components['/_line1'].stateValues.var1.tree).eq("u");
        expect(components['/_line1'].stateValues.var2.tree).eq("v");
        expect(components['/_line1'].stateValues.coeff0.tree).eq(-3);
        expect(components['/_line1'].stateValues.coeffvar1.tree).eq(5);
        expect(components['/_line1'].stateValues.coeffvar2.tree).eq(-2);
        expect(components['/_line1'].stateValues.slope.tree).eqls(['/', 5, 2]);
        expect(components['/_line1'].stateValues.xintercept.tree).eqls(['/', 3, 5]);
        expect(components['/_line1'].stateValues.yintercept.tree).eqls(['/', -3, 2]);
        expect(math1.stateValues.value.tree).eq("u");
        expect(math2.stateValues.value.tree).eq("v");
      })

      cy.log("Move line right 1 and down 3");
      cy.window().then((win) => {

        let point1coords = [
          components['/_line1'].stateValues.points[0].get_component(0),
          components['/_line1'].stateValues.points[0].get_component(1),
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1].get_component(0),
          components['/_line1'].stateValues.points[1].get_component(1),
        ];

        let moveX = 1;
        let moveY = -3;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_line1'].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let newEquation = me.fromText("5u-2v=3").substitute({
          'u': ['+', 'u', -moveX],
          'v': ['+', 'v', -moveY],
        });

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(components['/_line1'].stateValues.equation.tree);
        expect(unproxiedEquation.equals(newEquation)).to.be.true;

      })
    })

  });

  it('line from points with strange constraints', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point>
  <coords>
  (<ref prop="y">_point2</ref>,
  <ref>a</ref>)
  </coords>
  </point>
  <point>(5,3)</point>
  <line><through><ref>_point1</ref><ref>_point2</ref></through></line>
  </graph>
  <math name="a" hide simplify><ref prop="x">_point2</ref>+1</math>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let point2x = 5;
    let point2y = 3;
    let a = point2x + 1;
    let point1x = point2y;
    let point1y = a;
    let slope = (point1y - point2y) / (point1x - point2x);
    let yintercept = point2y - slope * point2x;

    cy.log('points and line match constraints')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(point2x, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(point2y, 1E-12);

      expect(components['/a'].stateValues.value.tree).closeTo(a, 1E-12);

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(point1x, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(point1y, 1E-12);

      expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-12);

      expect(components['/_line1'].stateValues.yintercept.evaluate_to_constant()).closeTo(yintercept, 1E-12);
    })

    cy.log('move point 1')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      point1x = -5;
      point1y = -3;

      a = point1y;
      point2y = point1x;
      point2x = a - 1;

      slope = (point1y - point2y) / (point1x - point2x);
      yintercept = point2y - slope * point2x;

      components['/_point1'].movePoint({ x: point1x, y: point1y });

      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(point2x, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(point2y, 1E-12);

      expect(components['/a'].stateValues.value.tree).closeTo(a, 1E-12);

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(point1x, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(point1y, 1E-12);

      expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-12);

      expect(components['/_line1'].stateValues.yintercept.evaluate_to_constant()).closeTo(yintercept, 1E-12);
    })


    cy.log('move line')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        components['/_line1'].stateValues.points[0].get_component(0),
        components['/_line1'].stateValues.points[0].get_component(1),
      ];
      let point2coords = [
        components['/_line1'].stateValues.points[1].get_component(0),
        components['/_line1'].stateValues.points[1].get_component(1),
      ];

      let moveX = -5;
      let moveY = 12;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      components['/_line1'].moveLine({
        point1coords: point1coords,
        point2coords: point2coords
      });


      // Note: one of two possible scenarios should be true
      // and it's not clear if either are preferred, given the strange constraints
      // Whether point1 or point2 wins depends on details of update algorithm
      // If point2 takes precedence, uncomment the first group of lines
      // and comment out the second group of lines

      // point2x += moveX;;
      // point2y += moveY;
      // a = point2x + 1;
      // point1x = point2y;
      // point1y = a;

      point1x += moveX;;
      point1y += moveY;
      a = point1y;
      point2y = point1x;
      point2x = a - 1;

      slope = (point1y - point2y) / (point1x - point2x);
      yintercept = point2y - slope * point2x;

      expect(components['/_point2'].stateValues.xs[0].tree).closeTo(point2x, 1E-12);
      expect(components['/_point2'].stateValues.xs[1].tree).closeTo(point2y, 1E-12);

      expect(components['/a'].stateValues.value.tree).closeTo(a, 1E-12);

      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(point1x, 1E-12);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(point1y, 1E-12);

      expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-12);

      expect(components['/_line1'].stateValues.yintercept.evaluate_to_constant()).closeTo(yintercept, 1E-12);
    })

  });

  it('reffed line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(0,0)</point>
  <point>(1,3)</point>
  <line><through><ref>_point1</ref><ref>_point2</ref></through></line>
  </graph>
  
  <graph>
  <ref>_line1</ref>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let point1 = components['/_ref1'].replacements[0];
      let point2 = components['/_ref2'].replacements[0];
      let line2 = components['/_ref3'].replacements[0];

      cy.log('line starts off correctly')
      cy.window().then((win) => {
        expect(line2.stateValues.slope.evaluate_to_constant()).closeTo(3, 1E-12);
        expect(line2.stateValues.yintercept.evaluate_to_constant()).closeTo(0, 1E-12);

      });

      cy.log('move points')
      cy.window().then((win) => {

        point1.movePoint({ x: -3, y: 5 });
        point2.movePoint({ x: 5, y: 1 });

        expect(line2.stateValues.slope.evaluate_to_constant()).closeTo(-0.5, 1E-12);
        expect(line2.stateValues.yintercept.evaluate_to_constant()).closeTo(3.5, 1E-12);

      });

      cy.log('move line1')
      cy.window().then((win) => {

        let point1coords = [
          components['/_line1'].stateValues.points[0].get_component(0),
          components['/_line1'].stateValues.points[0].get_component(1),
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1].get_component(0),
          components['/_line1'].stateValues.points[1].get_component(1),
        ];

        let moveX = -2;
        let moveY = -1;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_line1'].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        expect(line2.stateValues.slope.evaluate_to_constant()).closeTo(-0.5, 1E-12);
        expect(line2.stateValues.yintercept.evaluate_to_constant()).closeTo(1.5, 1E-12);

      });

      cy.log('move line2')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          components['/_line1'].stateValues.points[0].get_component(0),
          components['/_line1'].stateValues.points[0].get_component(1),
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1].get_component(0),
          components['/_line1'].stateValues.points[1].get_component(1),
        ];

        let moveX = -5;
        let moveY = -2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        line2.moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        expect(line2.stateValues.slope.evaluate_to_constant()).closeTo(-0.5, 1E-12);
        expect(line2.stateValues.yintercept.evaluate_to_constant()).closeTo(-3, 1E-12);

      });

    })
  })

  it('line via reffed through', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(0,0)</point>
  <point>(1,3)</point>
  <line><through><ref>_point1</ref><ref>_point2</ref></through></line>
  </graph>
  
  <graph>
  <line><ref>_through1</ref></line>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let point1 = components['/_ref1'].replacements[0];
      let point2 = components['/_ref2'].replacements[0];

      cy.log('line starts off correctly')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_line2'].stateValues.slope.evaluate_to_constant()).closeTo(3, 1E-12);
        expect(components['/_line2'].stateValues.yintercept.evaluate_to_constant()).closeTo(0, 1E-12);

      });

      cy.log('move points')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        point1.movePoint({ x: -3, y: 5 });
        point2.movePoint({ x: 5, y: 1 });

        expect(components['/_line2'].stateValues.slope.evaluate_to_constant()).closeTo(-0.5, 1E-12);
        expect(components['/_line2'].stateValues.yintercept.evaluate_to_constant()).closeTo(3.5, 1E-12);

      });

      cy.log('move line1')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          components['/_line1'].stateValues.points[0].get_component(0),
          components['/_line1'].stateValues.points[0].get_component(1),
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1].get_component(0),
          components['/_line1'].stateValues.points[1].get_component(1),
        ];

        let moveX = -2;
        let moveY = -1;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_line1'].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        expect(components['/_line2'].stateValues.slope.evaluate_to_constant()).closeTo(-0.5, 1E-12);
        expect(components['/_line2'].stateValues.yintercept.evaluate_to_constant()).closeTo(1.5, 1E-12);

      });

      cy.log('move line2')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          components['/_line1'].stateValues.points[0].get_component(0),
          components['/_line1'].stateValues.points[0].get_component(1),
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1].get_component(0),
          components['/_line1'].stateValues.points[1].get_component(1),
        ];

        let moveX = -5;
        let moveY = -2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_line2'].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        expect(components['/_line2'].stateValues.slope.evaluate_to_constant()).closeTo(-0.5, 1E-12);
        expect(components['/_line2'].stateValues.yintercept.evaluate_to_constant()).closeTo(-3, 1E-12);

      });
    })

  })

  it('ref points of line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <line>(1,2),(3,4)</line>
  </graph>
  <graph>
  <ref prop="point1">_line1</ref>
  <ref prop="point2">_line1</ref>
  </graph>
  <graph>
  <ref prop="points">_line1</ref>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let through1 = components['/_line1'].activeChildren[0];
      let point1 = through1.activeChildren[0];
      let point2 = through1.activeChildren[1];
      let point3 = components['/_ref1'].replacements[0];
      let point4 = components['/_ref2'].replacements[0];
      let point5 = components['/_ref3'].replacements[0];
      let point6 = components['/_ref3'].replacements[1];

      cy.window().then((win) => {
        let p1x = 1;
        let p1y = 2;
        let p2x = 3;
        let p2y = 4;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)
      })

      cy.log('move first individually reffed point');
      cy.window().then((win) => {
        let p1x = -2;
        let p1y = -5;
        point3.movePoint({ x: p1x, y: p1y });
        let p2x = 3;
        let p2y = 4;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)
      })

      cy.log('move second individually reffed point');
      cy.window().then((win) => {
        let p2x = 8;
        let p2y = -1;
        point4.movePoint({ x: p2x, y: p2y });
        let p1x = -2;
        let p1y = -5;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)
      })

      cy.log('move second array-reffed point');
      cy.window().then((win) => {
        let p2x = -6;
        let p2y = 4;
        point6.movePoint({ x: p2x, y: p2y });
        let p1x = -2;
        let p1y = -5;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)
      })

      cy.log('move first array-reffed point');
      cy.window().then((win) => {
        let p1x = 0;
        let p1y = 7;
        point5.movePoint({ x: p1x, y: p1y });
        let p2x = -6;
        let p2y = 4;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)
      })

      cy.log('move line up and to the right')
      cy.window().then((win) => {

        let point1coords = [
          components['/_line1'].stateValues.points[0].get_component(0),
          components['/_line1'].stateValues.points[0].get_component(1),
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1].get_component(0),
          components['/_line1'].stateValues.points[1].get_component(1),
        ];

        let moveX = 4;
        let moveY = 2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_line1'].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = point1coords[0].simplify().tree;
        let p1y = point1coords[1].simplify().tree;
        let p2x = point2coords[0].simplify().tree;
        let p2y = point2coords[1].simplify().tree;

        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(point5.stateValues.xs[0].tree).eq(p1x)
        expect(point5.stateValues.xs[1].tree).eq(p1y)
        expect(point6.stateValues.xs[0].tree).eq(p2x)
        expect(point6.stateValues.xs[1].tree).eq(p2y)

      })
    })

  })

  it('new line from reffed points of line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <line>(-1,-2),(-3,-4)</line>
  </graph>
  <graph>
  <line>
    <ref prop="points">_line1</ref>
  </line>
  <ref prop="points">_line1</ref>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let through1 = components['/_line1'].activeChildren[0];
      let point1 = through1.activeChildren[0];
      let point2 = through1.activeChildren[1];
      let point3 = components['/_ref1'].replacements[0];
      let point4 = components['/_ref1'].replacements[1];

      cy.window().then((win) => {
        let p1x = -1;
        let p1y = -2;
        let p2x = -3;
        let p2y = -4;
        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", p2x, p2y]);
        expect(components['/_line2'].stateValues.points[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_line2'].stateValues.points[1].tree).eqls(["vector", p2x, p2y]);
      })

      cy.log('move first line up and to the right')
      cy.window().then((win) => {

        let point1coords = [
          components['/_line1'].stateValues.points[0].get_component(0),
          components['/_line1'].stateValues.points[0].get_component(1),
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1].get_component(0),
          components['/_line1'].stateValues.points[1].get_component(1),
        ];

        let moveX = 4;
        let moveY = 2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_line1'].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = -1 + moveX;
        let p1y = -2 + moveY;
        let p2x = -3 + moveX;
        let p2y = -4 + moveY;

        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", p2x, p2y]);
        expect(components['/_line2'].stateValues.points[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_line2'].stateValues.points[1].tree).eqls(["vector", p2x, p2y]);

      })


      cy.log('move second line up and to the left')
      cy.window().then((win) => {

        let point1coords = [
          components['/_line2'].stateValues.points[0].get_component(0),
          components['/_line2'].stateValues.points[0].get_component(1),
        ];
        let point2coords = [
          components['/_line2'].stateValues.points[1].get_component(0),
          components['/_line2'].stateValues.points[1].get_component(1),
        ];

        let moveX = -7;
        let moveY = 3;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_line2'].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });


        moveX = 4 + moveX;
        moveY = 2 + moveY;
        let p1x = -1 + moveX;
        let p1y = -2 + moveY;
        let p2x = -3 + moveX;
        let p2y = -4 + moveY;

        expect(point1.stateValues.xs[0].tree).eq(p1x)
        expect(point1.stateValues.xs[1].tree).eq(p1y)
        expect(point2.stateValues.xs[0].tree).eq(p2x)
        expect(point2.stateValues.xs[1].tree).eq(p2y)
        expect(point3.stateValues.xs[0].tree).eq(p1x)
        expect(point3.stateValues.xs[1].tree).eq(p1y)
        expect(point4.stateValues.xs[0].tree).eq(p2x)
        expect(point4.stateValues.xs[1].tree).eq(p2y)
        expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", p2x, p2y]);
        expect(components['/_line2'].stateValues.points[0].tree).eqls(["vector", p1x, p1y]);
        expect(components['/_line2'].stateValues.points[1].tree).eqls(["vector", p2x, p2y]);

      })
    })
  })

  it('reference public state variables of line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line>
      (5,-4),(1,4)
    </line>
  </graph>

  <p>Variables are <ref prop="var1">_line1</ref> and <ref prop="var2">_line1</ref>.</p>
  <p><m>x</m>-intercept is: <ref prop="xintercept">_line1</ref>.</p>
  <p><m>y</m>-intercept is: <ref prop="yintercept">_line1</ref>.</p>
  <p>Slope is: <ref prop="slope">_line1</ref>.</p>
  <p>Equation is: <ref prop="equation">_line1</ref>.</p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let var1 = components['/_ref1'].replacements[0];
      let var1Anchor = '#' + var1.componentName;
      let var2 = components['/_ref2'].replacements[0];
      let var2Anchor = '#' + var2.componentName;
      let xintercept = components['/_ref3'].replacements[0];
      let xinterceptAnchor = '#' + xintercept.componentName;
      let yintercept = components['/_ref4'].replacements[0];
      let yinterceptAnchor = '#' + yintercept.componentName;
      let slope = components['/_ref5'].replacements[0];
      let slopeAnchor = '#' + slope.componentName;
      let equation = components['/_ref6'].replacements[0];

      cy.get(var1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(var2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      })
      cy.get(xinterceptAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get(yinterceptAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      })
      cy.get(slopeAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })

      cy.window().then((win) => {
        // have to create unproxied version of equation for equals to work
        let unproxiedEquationInLine = me.fromAst(components['/_line1'].stateValues.equation.tree);
        expect(unproxiedEquationInLine.equals(me.fromText('y = -2x+6'))).to.be.true;
        expect(components['/_line1'].stateValues.var1.tree).eq("x");
        expect(components['/_line1'].stateValues.var2.tree).eq("y");
        expect(components['/_line1'].stateValues.slope.tree).eq(-2);
        expect(components['/_line1'].stateValues.xintercept.tree).eq(3);
        expect(components['/_line1'].stateValues.yintercept.tree).eq(6);
        expect(var1.stateValues.value.tree).eq("x");
        expect(var2.stateValues.value.tree).eq("y");
        expect(xintercept.stateValues.value.tree).eq(3);
        expect(yintercept.stateValues.value.tree).eq(6);
        expect(slope.stateValues.value.tree).eq(-2);
        let unproxiedEquation = me.fromAst(equation.stateValues.value.tree);
        expect(unproxiedEquation.equals(me.fromText('y = -2x+6'))).to.be.true;

      })

    })
  });

  it('line from reference to equation and coefficients', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line>
      (5,1),(1,5)
    </line>
  </graph>
  <graph>
  <line><ref prop="equation">_line1</ref></line>
  </graph>
  <graph>
  <line variables="u,v">
    <ref prop="coeffvar1">_line1</ref>u + <ref prop="coeffvar2">_line1</ref>v + <ref prop="coeff0">_line1</ref> =0
  </line>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(components['/_line1'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('y = 6-x'))).to.be.true;
      unproxiedEquation = me.fromAst(components['/_line2'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('y = 6-x'))).to.be.true;
      unproxiedEquation = me.fromAst(components['/_line3'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('v = 6-u'))).to.be.true;
      expect(components['/_line1'].stateValues.variables[0].tree).eq("x");
      expect(components['/_line1'].stateValues.variables[1].tree).eq("y");
      expect(components['/_line1'].stateValues.slope.tree).eq(-1);
      expect(components['/_line1'].stateValues.xintercept.tree).eq(6);
      expect(components['/_line1'].stateValues.yintercept.tree).eq(6);
      expect(components['/_line2'].stateValues.variables[0].tree).eq("x");
      expect(components['/_line2'].stateValues.variables[1].tree).eq("y");
      expect(components['/_line2'].stateValues.slope.tree).eq(-1);
      expect(components['/_line2'].stateValues.xintercept.tree).eq(6);
      expect(components['/_line2'].stateValues.yintercept.tree).eq(6);
      expect(components['/_line3'].stateValues.variables[0].tree).eq("u");
      expect(components['/_line3'].stateValues.variables[1].tree).eq("v");
      expect(components['/_line3'].stateValues.slope.tree).eq(-1);
      expect(components['/_line3'].stateValues.xintercept.tree).eq(6);
      expect(components['/_line3'].stateValues.yintercept.tree).eq(6);
    })

    cy.log("move points")

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let through1 = components['/_line1'].activeChildren[0];
      let point1 = through1.activeChildren[0];
      let point2 = through1.activeChildren[1];
      point1.movePoint({ x: 4, y: 4 });
      point2.movePoint({ x: 6, y: 8 });

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(components['/_line1'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('y = 2x-4'))).to.be.true;
      unproxiedEquation = me.fromAst(components['/_line2'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('y = 2x-4'))).to.be.true;
      unproxiedEquation = me.fromAst(components['/_line3'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('v = 2u-4'))).to.be.true;
      expect(components['/_line1'].stateValues.slope.tree).eq(2);
      expect(components['/_line1'].stateValues.xintercept.tree).eq(2);
      expect(components['/_line1'].stateValues.yintercept.tree).eq(-4);
      expect(components['/_line2'].stateValues.slope.tree).eq(2);
      expect(components['/_line2'].stateValues.xintercept.tree).eq(2);
      expect(components['/_line2'].stateValues.yintercept.tree).eq(-4);
      expect(components['/_line3'].stateValues.slope.tree).eq(2);
      expect(components['/_line3'].stateValues.xintercept.tree).eq(2);
      expect(components['/_line3'].stateValues.yintercept.tree).eq(-4);
    })
  });

  it('extracting point coordinates of symmetric line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <line>
    <point>(1,2)</point>
    <point>
      (<ref prop="y">_point1</ref>, <ref prop="x">_point1</ref>)
    </point>
  </line> 
  <point name="x1">
    <x><extract prop="x"><ref prop="point1">_line1</ref></extract></x>
    <y fixed>3</y>
  </point>
  <point name="x2">
    <x><extract prop="x"><ref prop="point2">_line1</ref></extract></x>
    <y fixed>4</y>
  </point>
  <point name="y1">
    <y><extract prop="y"><ref prop="point1">_line1</ref></extract></y>
    <x fixed>3</x>
  </point>
  <point name="y2">
    <y><extract prop="y"><ref prop="point2">_line1</ref></extract></y>
    <x fixed>4</x>
  </point>
</graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let x = 1, y = 2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x, y]);
      expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", y, x]);
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
      expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x, y]);
      expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", y, x]);
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
      expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x, y]);
      expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", y, x]);
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
      expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x, y]);
      expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", y, x]);
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
      expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x, y]);
      expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", y, x]);
      expect(components['/x1'].stateValues.xs[0].tree).eq(x);
      expect(components['/x2'].stateValues.xs[0].tree).eq(y);
      expect(components['/y1'].stateValues.xs[1].tree).eq(y);
      expect(components['/y2'].stateValues.xs[1].tree).eq(x);
    })


  })

  it('three lines with mutual references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <line>
    <through>
    <ref prop="point2">_line2</ref>
    <point>(1,0)</point>
    </through>
  </line>
  <line>
    <through hide="false">
    <ref prop="point2">_line3</ref>
    <point>(3,2)</point>
    </through>
  </line>
  <line>
    <through hide="false">
    <ref prop="point2">_line1</ref>
    <point>(-1,4)</point>
    </through>
  </line>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let point1 = components['/_through1'].activeChildren[0];
      let point2 = components['/_through1'].activeChildren[1];
      let point3 = components['/_through2'].activeChildren[1];
      let point4 = components['/_through2'].activeChildren[2];
      let point5 = components['/_through3'].activeChildren[1];
      let point6 = components['/_through3'].activeChildren[2];

      let x1 = 1, y1 = 0;
      let x2 = 3, y2 = 2;
      let x3 = -1, y3 = 4;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_line2'].stateValues.points[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_line2'].stateValues.points[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_line3'].stateValues.points[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_line3'].stateValues.points[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 1 of line 1")
      cy.window().then((win) => {
        x2 = 7;
        y2 = -3;
        point1.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_line2'].stateValues.points[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_line2'].stateValues.points[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_line3'].stateValues.points[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_line3'].stateValues.points[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 2 of line 1")
      cy.window().then((win) => {
        x1 = -1;
        y1 = -4;
        point2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_line2'].stateValues.points[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_line2'].stateValues.points[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_line3'].stateValues.points[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_line3'].stateValues.points[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 1 of line 2")
      cy.window().then((win) => {
        x3 = 9;
        y3 = -8;
        point3.movePoint({ x: x3, y: y3 });
        expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_line2'].stateValues.points[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_line2'].stateValues.points[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_line3'].stateValues.points[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_line3'].stateValues.points[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 2 of line 2")
      cy.window().then((win) => {
        x2 = 3;
        y2 = 2;
        point4.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_line2'].stateValues.points[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_line2'].stateValues.points[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_line3'].stateValues.points[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_line3'].stateValues.points[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 1 of line 3")
      cy.window().then((win) => {
        x1 = -5;
        y1 = 8;
        point5.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_line2'].stateValues.points[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_line2'].stateValues.points[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_line3'].stateValues.points[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_line3'].stateValues.points[1].tree).eqls(["vector", x3, y3]);

      })

      cy.log("move point 2 of line 3")
      cy.window().then((win) => {
        x3 = 0;
        y3 = -5;
        point6.movePoint({ x: x3, y: y3 });
        expect(components['/_line1'].stateValues.points[0].tree).eqls(["vector", x2, y2]);
        expect(components['/_line1'].stateValues.points[1].tree).eqls(["vector", x1, y1]);
        expect(components['/_line2'].stateValues.points[0].tree).eqls(["vector", x3, y3]);
        expect(components['/_line2'].stateValues.points[1].tree).eqls(["vector", x2, y2]);
        expect(components['/_line3'].stateValues.points[0].tree).eqls(["vector", x1, y1]);
        expect(components['/_line3'].stateValues.points[1].tree).eqls(["vector", x3, y3]);

      })

    })
  })

})
