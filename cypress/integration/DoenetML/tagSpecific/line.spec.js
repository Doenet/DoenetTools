import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Line Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('move points copied by line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point label='P'>(3,5)</point>
  <point label='Q'>(-4,-1)</point>
    <line through="$_point1 $_point2 "/>
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

  it('through = string of points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line label='l' through="(1,2) (4,7)" />
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let throughComponent = components["/_line1"].attributes.through;
      let point1 = throughComponent.activeChildren[0];
      let point2 = throughComponent.activeChildren[1];

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

  it('through = points from strings and maths', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>1</math>
  <math>2</math>
  <graph>
    <line label='l' through="($_math1, $_math2) (4,7) " />
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let throughComponent = components["/_line1"].attributes.through;
      let point1 = throughComponent.activeChildren[0];
      let point2 = throughComponent.activeChildren[1];

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
        components['/_line1'].stateValues.points[0][0],
        components['/_line1'].stateValues.points[0][1],
      ];
      let point2coords = [
        components['/_line1'].stateValues.points[1][0],
        components['/_line1'].stateValues.points[1][1],
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
    <line equation="5x-2y=3" />
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
        components['/_line1'].stateValues.points[0][0],
        components['/_line1'].stateValues.points[0][1],
      ];
      let point2coords = [
        components['/_line1'].stateValues.points[1][0],
        components['/_line1'].stateValues.points[1][1],
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

  it('line from equation, multiple pieces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>5x</math>
  <number>2</number>
  <graph>
    <line equation="$_math1 - $_number1 y = 3" />
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
    <line variables="u v">
      5u-2v=3
    </line>
  </graph>
  <p>Variables are <copy prop="var1" tname="_line1" /> and <copy prop="var2" tname="_line1" />.</p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let math1 = components['/_copy1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy2'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);

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
          components['/_line1'].stateValues.points[0][0],
          components['/_line1'].stateValues.points[0][1],
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1][0],
          components['/_line1'].stateValues.points[1][1],
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
  (<copy prop="y" tname="_point2" />,
  <copy tname="a" />)
  </point>
  <point>(5,3)</point>
  <line through="$_point1 $_point2" />
  </graph>
  <math name="a" hide simplify><copy prop="x" tname="_point2" />+1</math>
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
        components['/_line1'].stateValues.points[0][0],
        components['/_line1'].stateValues.points[0][1],
      ];
      let point2coords = [
        components['/_line1'].stateValues.points[1][0],
        components['/_line1'].stateValues.points[1][1],
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

  it('copied line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(0,0)</point>
  <point>(1,3)</point>
  <line through="$_point1 $_point2" />
  </graph>
  
  <graph>
  <copy tname="_line1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let throughComponent = components["/_line1"].attributes.through;
      let point1 = throughComponent.activeChildren[0];
      let point2 = throughComponent.activeChildren[1];
      let line2 = components['/_copy1'].replacements[0];

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
          components['/_line1'].stateValues.points[0][0],
          components['/_line1'].stateValues.points[0][1],
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1][0],
          components['/_line1'].stateValues.points[1][1],
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
          components['/_line1'].stateValues.points[0][0],
          components['/_line1'].stateValues.points[0][1],
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1][0],
          components['/_line1'].stateValues.points[1][1],
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

  it('copied line based on equation', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <line>
  y = 2x+1
  </line>
  </graph>
  
  <graph>
  <copy tname="_line1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let line2 = components['/_copy1'].replacements[0];

      cy.log('line starts off correctly')
      cy.window().then((win) => {
        expect(components["/_line1"].stateValues.slope.evaluate_to_constant()).closeTo(2, 1E-12);
        expect(components["/_line1"].stateValues.yintercept.evaluate_to_constant()).closeTo(1, 1E-12);
        expect(line2.stateValues.slope.evaluate_to_constant()).closeTo(2, 1E-12);
        expect(line2.stateValues.yintercept.evaluate_to_constant()).closeTo(1, 1E-12);

      });


      cy.log('move line1')
      cy.window().then((win) => {

        let point1coords = [
          components['/_line1'].stateValues.points[0][0],
          components['/_line1'].stateValues.points[0][1],
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1][0],
          components['/_line1'].stateValues.points[1][1],
        ];

        let moveX = -2;
        let moveY = -1;

        // 2(x+2)+1-1 = 2x+4

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        components['/_line1'].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        expect(components["/_line1"].stateValues.slope.evaluate_to_constant()).closeTo(2, 1E-12);
        expect(components["/_line1"].stateValues.yintercept.evaluate_to_constant()).closeTo(4, 1E-12);
        expect(line2.stateValues.slope.evaluate_to_constant()).closeTo(2, 1E-12);
        expect(line2.stateValues.yintercept.evaluate_to_constant()).closeTo(4, 1E-12);

      });

      cy.log('move line2')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          components['/_line1'].stateValues.points[0][0],
          components['/_line1'].stateValues.points[0][1],
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1][0],
          components['/_line1'].stateValues.points[1][1],
        ];

        let moveX = -5;
        let moveY = -2;

        // 2(x+5)+4-2 = 2x + 12

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        line2.moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        expect(components["/_line1"].stateValues.slope.evaluate_to_constant()).closeTo(2, 1E-12);
        expect(components["/_line1"].stateValues.yintercept.evaluate_to_constant()).closeTo(12, 1E-12);
        expect(line2.stateValues.slope.evaluate_to_constant()).closeTo(2, 1E-12);
        expect(line2.stateValues.yintercept.evaluate_to_constant()).closeTo(12, 1E-12);

      });

    })
  })

  it('copy points of line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <line through="(1,2) (3,4)" />
  </graph>
  <graph>
  <copy prop="point1" tname="_line1" />
  <copy prop="point2" tname="_line1" />
  </graph>
  <graph>
  <copy prop="points" tname="_line1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let through1 = components['/_line1'].attributes.through;
      let point1 = through1.activeChildren[0];
      let point2 = through1.activeChildren[1];
      let point3 = components['/_copy1'].replacements[0];
      let point4 = components['/_copy2'].replacements[0];
      let point5 = components['/_copy3'].replacements[0];
      let point6 = components['/_copy3'].replacements[1];

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

      cy.log('move first individually copied point');
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

      cy.log('move second individually copied point');
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

      cy.log('move second array-copied point');
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

      cy.log('move first array-copied point');
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
          components['/_line1'].stateValues.points[0][0],
          components['/_line1'].stateValues.points[0][1],
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1][0],
          components['/_line1'].stateValues.points[1][1],
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

  it('new line from copied points of line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <line through="(-1,-2) (-3,-4)" />
  </graph>
  <graph>
  <line through="$(_line1{prop='points'})" />
  <copy prop="points" tname="_line1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let through1 = components['/_line1'].attributes.through;
      let point1 = through1.activeChildren[0];
      let point2 = through1.activeChildren[1];
      let point3 = components['/_copy1'].replacements[0];
      let point4 = components['/_copy1'].replacements[1];

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
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([p2x, p2y]);
        expect(components['/_line2'].stateValues.points[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect(components['/_line2'].stateValues.points[1].map(x => x.tree)).eqls([p2x, p2y]);
      })

      cy.log('move first line up and to the right')
      cy.window().then((win) => {

        let point1coords = [
          components['/_line1'].stateValues.points[0][0],
          components['/_line1'].stateValues.points[0][1],
        ];
        let point2coords = [
          components['/_line1'].stateValues.points[1][0],
          components['/_line1'].stateValues.points[1][1],
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
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([p2x, p2y]);
        expect(components['/_line2'].stateValues.points[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect(components['/_line2'].stateValues.points[1].map(x => x.tree)).eqls([p2x, p2y]);

      })


      cy.log('move second line up and to the left')
      cy.window().then((win) => {

        let point1coords = [
          components['/_line2'].stateValues.points[0][0],
          components['/_line2'].stateValues.points[0][1],
        ];
        let point2coords = [
          components['/_line2'].stateValues.points[1][0],
          components['/_line2'].stateValues.points[1][1],
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
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([p2x, p2y]);
        expect(components['/_line2'].stateValues.points[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect(components['/_line2'].stateValues.points[1].map(x => x.tree)).eqls([p2x, p2y]);

      })
    })
  })

  it('copy public state variables of line', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line through="(5,-4) (1,4)" />
  </graph>

  <p>Variables are <copy prop="var1" tname="_line1" /> and <copy prop="var2" tname="_line1" />.</p>
  <p><m>x</m>-intercept is: <copy prop="xintercept" tname="_line1" />.</p>
  <p><m>y</m>-intercept is: <copy prop="yintercept" tname="_line1" />.</p>
  <p>Slope is: <copy prop="slope" tname="_line1" />.</p>
  <p>Equation is: <copy prop="equation" tname="_line1" />.</p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let var1 = components['/_copy1'].replacements[0];
      let var1Anchor = cesc('#' + var1.componentName);
      let var2 = components['/_copy2'].replacements[0];
      let var2Anchor = cesc('#' + var2.componentName);
      let xintercept = components['/_copy3'].replacements[0];
      let xinterceptAnchor = cesc('#' + xintercept.componentName);
      let yintercept = components['/_copy4'].replacements[0];
      let yinterceptAnchor = cesc('#' + yintercept.componentName);
      let slope = components['/_copy5'].replacements[0];
      let slopeAnchor = cesc('#' + slope.componentName);
      let equation = components['/_copy6'].replacements[0];

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

  it('line from copy of equation and coefficients', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line through="(5,1)(1,5)" />
  </graph>
  <graph>
  <line equation="$(_line1{prop='equation'})" />
  </graph>
  <graph>
  <line variables="u v" equation="$(_line1{prop='coeffvar1'})u +$(_line1{prop='coeffvar2'})v + $(_line1{prop='coeff0'}) = 0" />
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
      let through1 = components['/_line1'].attributes.through;
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
  <math name="threeFixed" fixed>3</math>

  <graph>
  <point hide name="A">(1,2)</point>
  <line through="$A ($(A{prop='y'}),$(A{prop='x'})) "/>
  <point name="x1" x="$(_line1{prop='pointX1_1'})" y="$threeFixed" />
  <point name="x2">
    (<extract prop="x"><copy prop="point2" tname="_line1" /></extract>,
    <math fixed>4</math>)
  </point>
  <point name="y1" y="$(_line1{prop='pointX1_2'})" x="$threeFixed" />
  <point name="y2">
    (<math fixed>4</math>,
    <extract prop="y"><copy prop="point2" tname="_line1" /></extract>)
  </point>
</graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let x = 1, y = 2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x, y]);
      expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([y, x]);
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
      expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x, y]);
      expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([y, x]);
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
      expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x, y]);
      expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([y, x]);
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
      expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x, y]);
      expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([y, x]);
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
      expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x, y]);
      expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([y, x]);
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
  <line through="$(_line2{prop='point2' componentType='point'}) (1,0)" />
  <line through="$(_line3{prop='point2' componentType='point'}) (3,2)" />
  <line through="$(_line1{prop='point2' componentType='point'}) (-1,4)" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let throughComponent1 = components["/_line1"].attributes.through;
      let point1 = throughComponent1.activeChildren[0];
      let point2 = throughComponent1.activeChildren[1];
      let throughComponent2 = components["/_line2"].attributes.through;
      let point3 = throughComponent2.activeChildren[0];
      let point4 = throughComponent2.activeChildren[1];
      let throughComponent3 = components["/_line3"].attributes.through;
      let point5 = throughComponent3.activeChildren[0];
      let point6 = throughComponent3.activeChildren[1];

      let x1 = 1, y1 = 0;
      let x2 = 3, y2 = 2;
      let x3 = -1, y3 = 4;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line2'].stateValues.points[0].map(x => x.tree)).eqls([x3, y3]);
        expect(components['/_line2'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line3'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line3'].stateValues.points[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 1 of line 1")
      cy.window().then((win) => {
        x2 = 7;
        y2 = -3;
        point1.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line2'].stateValues.points[0].map(x => x.tree)).eqls([x3, y3]);
        expect(components['/_line2'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line3'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line3'].stateValues.points[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 2 of line 1")
      cy.window().then((win) => {
        x1 = -1;
        y1 = -4;
        point2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line2'].stateValues.points[0].map(x => x.tree)).eqls([x3, y3]);
        expect(components['/_line2'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line3'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line3'].stateValues.points[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 1 of line 2")
      cy.window().then((win) => {
        x3 = 9;
        y3 = -8;
        point3.movePoint({ x: x3, y: y3 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line2'].stateValues.points[0].map(x => x.tree)).eqls([x3, y3]);
        expect(components['/_line2'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line3'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line3'].stateValues.points[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 2 of line 2")
      cy.window().then((win) => {
        x2 = 3;
        y2 = 2;
        point4.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line2'].stateValues.points[0].map(x => x.tree)).eqls([x3, y3]);
        expect(components['/_line2'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line3'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line3'].stateValues.points[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 1 of line 3")
      cy.window().then((win) => {
        x1 = -5;
        y1 = 8;
        point5.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line2'].stateValues.points[0].map(x => x.tree)).eqls([x3, y3]);
        expect(components['/_line2'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line3'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line3'].stateValues.points[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 2 of line 3")
      cy.window().then((win) => {
        x3 = 0;
        y3 = -5;
        point6.movePoint({ x: x3, y: y3 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line2'].stateValues.points[0].map(x => x.tree)).eqls([x3, y3]);
        expect(components['/_line2'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(components['/_line3'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line3'].stateValues.points[1].map(x => x.tree)).eqls([x3, y3]);

      })

    })
  })

  it('line with no arguments', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line/>
    <copy name="A" prop="point1" tname="_line1" />
    <copy name="B" prop="point2" tname="_line1" />
  </graph>

  <graph>
    <copy name="l2" tname="_line1" />
    <copy name="A2" prop="point1" tname="l2" />
    <copy name="B2" prop="point2" tname="l2" />  
  </graph>

  <copy name="g3" tname="_graph2" />


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A = components['/A'].replacements[0];
      let B = components['/B'].replacements[0];
      let l2 = components["/l2"].replacements[0];
      let A2 = components["/A2"].replacements[0];
      let B2 = components["/B2"].replacements[0];
      let l3 = components["/g3"].replacements[0].activeChildren[0]
      let A3 = components["/g3"].replacements[0].activeChildren[1]
      let B3 = components["/g3"].replacements[0].activeChildren[2]

      let x1 = 1, y1 = 0;
      let x2 = 0, y2 = 0;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line with empty through', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line through="" />
    <copy name="A" prop="point1" tname="_line1" />
    <copy name="B" prop="point2" tname="_line1" />
  </graph>
  <graph>
    <copy name="l2" tname="_line1" />
    <copy name="A2" prop="point1" tname="l2" />
    <copy name="B2" prop="point2" tname="l2" />  
  </graph>

  <copy name="g3" tname="_graph2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A = components['/A'].replacements[0];
      let B = components['/B'].replacements[0];
      let l2 = components["/l2"].replacements[0];
      let A2 = components["/A2"].replacements[0];
      let B2 = components["/B2"].replacements[0];
      let l3 = components["/g3"].replacements[0].activeChildren[0]
      let A3 = components["/g3"].replacements[0].activeChildren[1]
      let B3 = components["/g3"].replacements[0].activeChildren[2]

      let x1 = 1, y1 = 0;
      let x2 = 0, y2 = 0;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line through one point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line through="(-5,9)" />
    <copy name="A" prop="point1" tname="_line1" />
    <copy name="B" prop="point2" tname="_line1" />
  </graph>
  <graph>
    <copy name="l2" tname="_line1" />
    <copy name="A2" prop="point1" tname="l2" />
    <copy name="B2" prop="point2" tname="l2" />  
  </graph>

  <copy name="g3" tname="_graph2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A = components['/A'].replacements[0];
      let B = components['/B'].replacements[0];
      let l2 = components["/l2"].replacements[0];
      let A2 = components["/A2"].replacements[0];
      let B2 = components["/B2"].replacements[0];
      let l3 = components["/g3"].replacements[0].activeChildren[0]
      let A3 = components["/g3"].replacements[0].activeChildren[1]
      let B3 = components["/g3"].replacements[0].activeChildren[2]

      let x1 = -5, y1 = 9;
      let x2 = 0, y2 = 0;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line through one point - the origin', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line through="(0,0)" />
    <copy name="A" prop="point1" tname="_line1" />
    <copy name="B" prop="point2" tname="_line1" />
  </graph>
  <graph>
    <copy name="l2" tname="_line1" />
    <copy name="A2" prop="point1" tname="l2" />
    <copy name="B2" prop="point2" tname="l2" />  
  </graph>

  <copy name="g3" tname="_graph2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A = components['/A'].replacements[0];
      let B = components['/B'].replacements[0];
      let l2 = components["/l2"].replacements[0];
      let A2 = components["/A2"].replacements[0];
      let B2 = components["/B2"].replacements[0];
      let l3 = components["/g3"].replacements[0].activeChildren[0]
      let A3 = components["/g3"].replacements[0].activeChildren[1]
      let B3 = components["/g3"].replacements[0].activeChildren[2]

      let x1 = 0, y1 = 0;
      let x2 = 1, y2 = 0;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line through fixed point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point hide fixed>(-5,9)</point>
    <line through="$_point1" />
    <copy name="A" prop="point1" tname="_line1" />
    <copy name="B" prop="point2" tname="_line1" />
  </graph>
  <graph>
    <copy name="l2" tname="_line1" />
    <copy name="A2" prop="point1" tname="l2" />
    <copy name="B2" prop="point2" tname="l2" />  
  </graph>

  <copy name="g3" tname="_graph2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A = components['/A'].replacements[0];
      let B = components['/B'].replacements[0];
      let l2 = components["/l2"].replacements[0];
      let A2 = components["/A2"].replacements[0];
      let B2 = components["/B2"].replacements[0];
      let l3 = components["/g3"].replacements[0].activeChildren[0]
      let A3 = components["/g3"].replacements[0].activeChildren[1]
      let B3 = components["/g3"].replacements[0].activeChildren[2]

      let x1 = -5, y1 = 9;
      let x2 = 0, y2 = 0;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("can't move point 1")
      cy.window().then((win) => {
        A.movePoint({ x: 7, y: -3 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point 2")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("try to move line")
      cy.window().then((win) => {

        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [5, 3],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point A2")
      cy.window().then((win) => {
        A2.movePoint({ x: -1, y: 0 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [10, 9],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        A3.movePoint({ x: -3, y: 7 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [0, -1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line through dynamic number of moveable points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <map hide>
    <template>
      <point>
        ($x + <math>0</math>,
        2$x + <math>0</math>)
      </point>
    </template>
    <sources alias="x">
      <sequence length="$_mathinput1" />
    </sources>
  </map>
  <graph>
    <line through="$_map1" />
    <copy name="A" prop="point1" tname="_line1" />
    <copy name="B" prop="point2" tname="_line1" />
  </graph>

  <graph>
    <copy name="l2" tname="_line1" />
    <copy name="A2" prop="point1" tname="l2" />
    <copy name="B2" prop="point2" tname="l2" />  
  </graph>

  <copy name="g3" tname="_graph2" />

  <mathinput prefill="0"/>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A = components['/A'].replacements[0];
      let B = components['/B'].replacements[0];
      let l2 = components["/l2"].replacements[0];
      let A2 = components["/A2"].replacements[0];
      let B2 = components["/B2"].replacements[0];
      let l3 = components["/g3"].replacements[0].activeChildren[0]
      let A3 = components["/g3"].replacements[0].activeChildren[1]
      let B3 = components["/g3"].replacements[0].activeChildren[2]

      let x1 = 1, y1 = 0;
      let x2 = 0, y2 = 0;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log('add first through point')
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}1{enter}", { force: true })

      cy.window().then((win) => {
        x1 = 1;
        y1 = 2;

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log('add second through point')
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}2{enter}", { force: true })

      cy.window().then((win) => {
        x2 = 2;
        y2 = 4;

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log('remove second through point')
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}1{enter}", { force: true })

      cy.window().then((win) => {

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log('remove first through point')
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}0{enter}", { force: true })

      cy.window().then((win) => {

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line through dynamic number of fixed points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <map hide>
    <template>
      <point>
        ($x, 2$x)
      </point>
    </template>
    <sources alias="x">
      <sequence length="$_mathinput1" />
    </sources>
  </map>
  <graph>
    <line through="$_map1" />
    <copy name="A" prop="point1" tname="_line1" />
    <copy name="B" prop="point2" tname="_line1" />
  </graph>

  <graph>
    <copy name="l2" tname="_line1" />
    <copy name="A2" prop="point1" tname="l2" />
    <copy name="B2" prop="point2" tname="l2" />  
  </graph>

  <copy name="g3" tname="_graph2" />

  <mathinput prefill="0"/>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A = components['/A'].replacements[0];
      let B = components['/B'].replacements[0];
      let l2 = components["/l2"].replacements[0];
      let A2 = components["/A2"].replacements[0];
      let B2 = components["/B2"].replacements[0];
      let l3 = components["/g3"].replacements[0].activeChildren[0]
      let A3 = components["/g3"].replacements[0].activeChildren[1]
      let B3 = components["/g3"].replacements[0].activeChildren[2]

      let x1 = 1, y1 = 0;
      let x2 = 0, y2 = 0;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log('add first through point')
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}1{enter}", { force: true })

      cy.window().then((win) => {
        x1 = 1;
        y1 = 2;

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        A.movePoint({ x: 7, y: -3 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [5, 3],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        A2.movePoint({ x: -1, y: 0 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [10, 9],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        A3.movePoint({ x: -3, y: 7 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [0, -1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log('add second through point')
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}2{enter}", { force: true })

      cy.window().then((win) => {
        x2 = 2;
        y2 = 4;

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        A.movePoint({ x: 7, y: -3 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        B.movePoint({ x: -1, y: -4 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        components['/_line1'].moveLine({
          point1coords: [5, 3],
          point2coords: [-7, -8]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        A2.movePoint({ x: -1, y: 0 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        B2.movePoint({ x: 6, y: -6 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        l2.moveLine({
          point1coords: [10, 9],
          point2coords: [8, 7]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        A3.movePoint({ x: -3, y: 7 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        B3.movePoint({ x: -8, y: -4 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        l3.moveLine({
          point1coords: [0, -1],
          point2coords: [2, -3]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log('remove second through point')
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}1{enter}", { force: true })

      cy.window().then((win) => {

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        A.movePoint({ x: 7, y: -3 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [5, 3],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        A2.movePoint({ x: -1, y: 0 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [10, 9],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        A3.movePoint({ x: -3, y: 7 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [0, -1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log('remove first through point')
      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}0{enter}", { force: true })

      cy.window().then((win) => {

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        x1 = 7;
        y1 = -3;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1")
      cy.window().then((win) => {

        x1 = 5;
        y1 = 3;
        x2 = -7;
        y2 = -8;
        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A2")
      cy.window().then((win) => {
        x1 = -1;
        y1 = 0;
        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2")
      cy.window().then((win) => {

        x1 = 10;
        y1 = 9;
        x2 = 8;
        y2 = 7;
        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        x1 = -3;
        y1 = 7;
        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = -8;
        y2 = -4;
        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 3")
      cy.window().then((win) => {

        x1 = 0;
        y1 = -1;
        x2 = 2;
        y2 = -3;
        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [x2, y2]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l2.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(l3.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line through point referencing own component', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line through="(3, $(_line1{prop='pointX1_1'})) (4,5)" />
  </graph>

  <graph>
    <copy tname="_line1" name="la" />
    <copy prop="point1" tname="_line1" name="P1a" />
    <copy prop="point2" tname="_line1" name="P2a" />
  </graph>
  `}, "*");
    });

    // A torture test, because when _copy1 is expanded,
    // it causes a state variable to become unresolved right in the middle
    // of the algorithm processing the consequences of it becoming resolved

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let la = components['/la'].replacements[0];
      let P1a = components['/P1a'].replacements[0];
      let P2a = components['/P2a'].replacements[0];

      let throughComponent = components["/_line1"].attributes.through;
      let point1 = throughComponent.activeChildren[0];
      let point2 = throughComponent.activeChildren[1];

      let x1 = 3, y1 = 3;
      let x2 = 4, y2 = 5;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point 1")
      cy.window().then((win) => {

        x1 = y1 = 7;
        let y1try = 13;

        point1.movePoint({ x: x1, y: y1try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point 2")
      cy.window().then((win) => {

        x2 = -3
        y2 = 9;

        point2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point 1a")
      cy.window().then((win) => {

        x1 = y1 = -1;
        let y1try = -21;

        P1a.movePoint({ x: x1, y: y1try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point 2a")
      cy.window().then((win) => {

        x2 = -5
        y2 = 6;

        P2a.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move line")
      cy.window().then((win) => {

        let dx = 4, dy = -3;

        let y1try = y1 + dy;
        x1 = y1 = x1 + dx;
        x2 = x2 + dx;
        y2 = y2 + dy;

        components['/_line1'].moveLine({
          point1coords: [x1, y1try],
          point2coords: [x2, y2]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move line a")
      cy.window().then((win) => {

        let dx = -6, dy = -9;

        let y1try = y1 + dy;
        x1 = y1 = x1 + dx;
        x2 = x2 + dx;
        y2 = y2 + dy;

        la.moveLine({
          point1coords: [x1, y1try],
          point2coords: [x2, y2]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line through point referencing own component via copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line through="(3,$(la{prop='pointX1_1'})) (4,5)" />
  </graph>

  <graph>
    <copy tname="_line1" name="la" />
    <copy prop="point1" tname="_line1" name="P1a" />
    <copy prop="point2" tname="_line1" name="P2a" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let la = components['/la'].replacements[0];
      let P1a = components['/P1a'].replacements[0];
      let P2a = components['/P2a'].replacements[0];

      let throughChild = components["/_line1"].attributes.through;
      let point1 = throughChild.activeChildren[0];
      let point2 = throughChild.activeChildren[1];

      let x1 = 3, y1 = 3;
      let x2 = 4, y2 = 5;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point 1")
      cy.window().then((win) => {

        x1 = y1 = 7;
        let y1try = 13;

        point1.movePoint({ x: x1, y: y1try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point 2")
      cy.window().then((win) => {

        x2 = -3
        y2 = 9;

        point2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point 1a")
      cy.window().then((win) => {

        x1 = y1 = -1;
        let y1try = -21;

        P1a.movePoint({ x: x1, y: y1try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point 2a")
      cy.window().then((win) => {

        x2 = -5
        y2 = 6;

        P2a.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move line")
      cy.window().then((win) => {

        let dx = 4, dy = -3;

        let y1try = y1 + dy;
        x1 = y1 = x1 + dx;
        x2 = x2 + dx;
        y2 = y2 + dy;

        components['/_line1'].moveLine({
          point1coords: [x1, y1try],
          point2coords: [x2, y2]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move line a")
      cy.window().then((win) => {

        let dx = -6, dy = -9;

        let y1try = y1 + dy;
        x1 = y1 = x1 + dx;
        x2 = x2 + dx;
        y2 = y2 + dy;

        la.moveLine({
          point1coords: [x1, y1try],
          point2coords: [x2, y2]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line with self references to points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line through="(2$(_line1{prop='pointX2_2'})+1, 2$(_line1{prop='pointX2_1'})+1) ($(_line1{prop='pointX1_1'})+1, 1)"/>
  </graph>

  <graph>
    <copy tname="_line1" name="la" />
    <copy prop="point1" tname="_line1" name="P1a" />
    <copy prop="point2" tname="_line1" name="P2a" />
  </graph>
  `}, "*");
    });

    // Another torture test with state variables becoming unresolved
    // while being processed

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let la = components['/la'].replacements[0];
      let P1a = components['/P1a'].replacements[0];
      let P2a = components['/P2a'].replacements[0];

      let throughChild = components["/_line1"].attributes.through;
      let point1 = throughChild.activeChildren[0];
      let point2 = throughChild.activeChildren[1];

      let y2 = 1;
      let x1 = 2 * y2 + 1;
      let x2 = x1 + 1;
      let y1 = 2 * x2 + 1;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point 1")
      cy.window().then((win) => {

        x1 = 7;
        let y1try = 13;

        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;

        point1.movePoint({ x: x1, y: y1try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point 2")
      cy.window().then((win) => {

        x2 = -4
        let y2try = 9;

        x1 = x2 - 1;
        y2 = (x1 - 1) / 2;
        y1 = 2 * x2 + 1;

        point2.movePoint({ x: x2, y: y2try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point 1a")
      cy.window().then((win) => {

        x1 = -1;
        let y1try = -21;

        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;


        P1a.movePoint({ x: x1, y: y1try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point 2a")
      cy.window().then((win) => {

        x2 = -8
        let y2try = 9;

        x1 = x2 - 1;
        y2 = (x1 - 1) / 2;
        y1 = 2 * x2 + 1;


        P2a.movePoint({ x: x2, y: y2try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move line")
      cy.window().then((win) => {

        let dx = 4, dy = -3;

        let y1try = y1 + dy;
        let x2try = x2 + dx;
        let y2try = y2 + dy;

        x1 = x1 + dx;
        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;


        components['/_line1'].moveLine({
          point1coords: [x1, y1try],
          point2coords: [x2try, y2try]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move line a")
      cy.window().then((win) => {

        let dx = -6, dy = -9;

        let y1try = y1 + dy;
        let x2try = x2 + dx;
        let y2try = y2 + dy;

        x1 = x1 + dx;
        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;


        la.moveLine({
          point1coords: [x1, y1try],
          point2coords: [x2try, y2try]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line with self references to points via copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line through="(2$(la{prop='pointX2_2'})+1,2$(la{prop='pointX2_1'})+1) ($(la{prop='pointX1_1'})+1,1)" />
  </graph>

  <graph>
    <copy tname="_line1" name="la" />
    <copy prop="point1" tname="_line1" name="P1a" />
    <copy prop="point2" tname="_line1" name="P2a" />
  </graph>
  `}, "*");
    });

    // Another torture test with state variables becoming unresolved
    // while being processed

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let la = components['/la'].replacements[0];
      let P1a = components['/P1a'].replacements[0];

      let P2a = components['/P2a'].replacements[0];
      let throughChild = components["/_line1"].attributes.through;
      let point1 = throughChild.activeChildren[0];
      let point2 = throughChild.activeChildren[1];

      let y2 = 1;
      let x1 = 2 * y2 + 1;
      let x2 = x1 + 1;
      let y1 = 2 * x2 + 1;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point 1")
      cy.window().then((win) => {

        x1 = 7;
        let y1try = 13;

        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;

        point1.movePoint({ x: x1, y: y1try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point 2")
      cy.window().then((win) => {

        x2 = -4
        let y2try = 9;

        x1 = x2 - 1;
        y2 = (x1 - 1) / 2;
        y1 = 2 * x2 + 1;

        point2.movePoint({ x: x2, y: y2try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point 1a")
      cy.window().then((win) => {

        x1 = -1;
        let y1try = -21;

        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;


        P1a.movePoint({ x: x1, y: y1try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move point 2a")
      cy.window().then((win) => {

        x2 = -8
        let y2try = 9;

        x1 = x2 - 1;
        y2 = (x1 - 1) / 2;
        y1 = 2 * x2 + 1;


        P2a.movePoint({ x: x2, y: y2try });
        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move line")
      cy.window().then((win) => {

        let dx = 4, dy = -3;

        let y1try = y1 + dy;
        let x2try = x2 + dx;
        let y2try = y2 + dy;

        x1 = x1 + dx;
        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;


        components['/_line1'].moveLine({
          point1coords: [x1, y1try],
          point2coords: [x2try, y2try]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("move line a")
      cy.window().then((win) => {

        let dx = -6, dy = -9;

        let y1try = y1 + dy;
        let x2try = x2 + dx;
        let y2try = y2 + dy;

        x1 = x1 + dx;
        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;


        la.moveLine({
          point1coords: [x1, y1try],
          point2coords: [x2try, y2try]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(la.stateValues.points[0].map(x => x.tree)).eqls([x1, y1]);
        expect(la.stateValues.points[1].map(x => x.tree)).eqls([x2, y2]);
        expect(point1.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(point2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(P1a.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(P2a.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line through one point and given slope', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>slope: <mathinput name="slope" prefill="1" /></p>
  <graph>
    <line through="(-5,9)" slope="$slope" />
    <copy name="A" prop="point1" tname="_line1" />
    <copy name="B" prop="point2" tname="_line1" />
  </graph>
  <graph>
    <copy name="l2" tname="_line1" />
    <copy name="A2" prop="point1" tname="l2" />
    <copy name="B2" prop="point2" tname="l2" />  
  </graph>

  <copy name="g3" tname="_graph2" />
  
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A = components['/A'].replacements[0];
      let B = components['/B'].replacements[0];
      let l2 = components["/l2"].replacements[0];
      let A2 = components["/A2"].replacements[0];
      let B2 = components["/B2"].replacements[0];
      let l3 = components["/g3"].replacements[0].activeChildren[0]
      let A3 = components["/g3"].replacements[0].activeChildren[1]
      let B3 = components["/g3"].replacements[0].activeChildren[2]

      let x1 = -5, y1 = 9;
      let x2 = -4, y2 = 10;
      let slope = 1;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.tree).eq(slope);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.tree).eq(slope);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.tree).eq(slope);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        let dx = 4, dy = -4;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.tree).eq(slope);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.tree).eq(slope);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.tree).eq(slope);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B, infinite slope")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        slope = Infinity;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(components['/_line1'].stateValues.slope.tree)).eq(slope);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(l2.stateValues.slope.tree)).eq(slope);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(l3.stateValues.slope.tree)).eq(slope);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1, ignores point2 coords")
      cy.window().then((win) => {

        let dx = -1, dy = 3;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [31, 22]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(components['/_line1'].stateValues.slope.tree)).eq(slope);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(l2.stateValues.slope.tree)).eq(slope);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(l3.stateValues.slope.tree)).eq(slope);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("change slope")
      cy.window().then((win) => {

        slope = 0.5;

        let dx = y2 - y1; // since infinite slope

        x2 = x1 + dx;
        y2 = y1 + slope * dx;

        cy.get('#\\/slope textarea').type("{end}{backspace}0.5{enter}", { force: true }).then(() => {

          expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(components['/_line1'].stateValues.slope.tree).eq(slope);
          expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(l2.stateValues.slope.tree).eq(slope);
          expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(l3.stateValues.slope.tree).eq(slope);
          expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
          expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
          expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);
        })

      })



      cy.log("move point A2")
      cy.window().then((win) => {
        let dx = -6, dy = -9;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.tree).eq(slope);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.tree).eq(slope);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.tree).eq(slope);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        slope = (y2 - y1) / (x2 - x1);

        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2, ignores point2 coords")
      cy.window().then((win) => {

        let dx = 3, dy = 6;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [-73, 58]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        let dx = 4, dy = -11;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -3;
        slope = (y2 - y1) / (x2 - x1);

        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("change slope")
      cy.window().then((win) => {

        slope = -3;

        let dx = x2 - x1;

        x2 = x1 + dx;
        y2 = y1 + slope * dx;

        cy.get('#\\/slope textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}-3{enter}", { force: true }).then(() => {

          expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
          expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
          expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
          expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
          expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
          expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);
        })
      })

      cy.log("move line 3, ignores point2 coords")
      cy.window().then((win) => {

        let dx = -8, dy = 14;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [18, 91]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

  it('line with just slope', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>slope: <mathinput name="slope" prefill="1" /></p>
  <graph>
    <line slope="$slope" />
    <copy name="A" prop="point1" tname="_line1" />
    <copy name="B" prop="point2" tname="_line1" />
  </graph>
  <graph>
    <copy name="l2" tname="_line1" />
    <copy name="A2" prop="point1" tname="l2" />
    <copy name="B2" prop="point2" tname="l2" />  
  </graph>

  <copy name="g3" tname="_graph2" />
  
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A = components['/A'].replacements[0];
      let B = components['/B'].replacements[0];
      let l2 = components["/l2"].replacements[0];
      let A2 = components["/A2"].replacements[0];
      let B2 = components["/B2"].replacements[0];
      let l3 = components["/g3"].replacements[0].activeChildren[0]
      let A3 = components["/g3"].replacements[0].activeChildren[1]
      let B3 = components["/g3"].replacements[0].activeChildren[2]

      let x1 = 0, y1 = 0;
      let x2 = 1, y2 = 1;
      let slope = 1;

      cy.window().then((win) => {
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.tree).eq(slope);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.tree).eq(slope);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.tree).eq(slope);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A")
      cy.window().then((win) => {
        let dx = -1, dy = -5;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;
        A.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.tree).eq(slope);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.tree).eq(slope);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.tree).eq(slope);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B, infinite slope")
      cy.window().then((win) => {
        x2 = -1;
        y2 = -4;
        slope = Infinity;
        B.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(components['/_line1'].stateValues.slope.tree)).eq(slope);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(l2.stateValues.slope.tree)).eq(slope);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(l3.stateValues.slope.tree)).eq(slope);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 1, ignores point2 coords")
      cy.window().then((win) => {

        let dx = -1, dy = 3;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        components['/_line1'].moveLine({
          point1coords: [x1, y1],
          point2coords: [31, 22]
        });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(components['/_line1'].stateValues.slope.tree)).eq(slope);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(l2.stateValues.slope.tree)).eq(slope);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(Math.abs(l3.stateValues.slope.tree)).eq(slope);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("change slope")
      cy.window().then((win) => {

        slope = 0.5;

        let dx = y2 - y1; // since infinite slope

        x2 = x1 + dx;
        y2 = y1 + slope * dx;

        cy.get('#\\/slope textarea').type("{end}{backspace}0.5{enter}", { force: true }).then(() => {

          expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(components['/_line1'].stateValues.slope.tree).eq(slope);
          expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(l2.stateValues.slope.tree).eq(slope);
          expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(l3.stateValues.slope.tree).eq(slope);
          expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
          expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
          expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);
        })

      })



      cy.log("move point A2")
      cy.window().then((win) => {
        let dx = -6, dy = -9;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        A2.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.tree).eq(slope);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.tree).eq(slope);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.tree).eq(slope);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B2")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -6;
        slope = (y2 - y1) / (x2 - x1);

        B2.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move line 2, ignores point2 coords")
      cy.window().then((win) => {

        let dx = 3, dy = 6;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        l2.moveLine({
          point1coords: [x1, y1],
          point2coords: [-73, 58]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point A3")
      cy.window().then((win) => {
        let dx = 4, dy = -11;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        A3.movePoint({ x: x1, y: y1 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })

      cy.log("move point B3")
      cy.window().then((win) => {
        x2 = 6;
        y2 = -3;
        slope = (y2 - y1) / (x2 - x1);

        B3.movePoint({ x: x2, y: y2 });
        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


      cy.log("change slope")
      cy.window().then((win) => {

        slope = -3;

        let dx = x2 - x1;

        x2 = x1 + dx;
        y2 = y1 + slope * dx;

        cy.get('#\\/slope textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}-3{enter}", { force: true }).then(() => {

          expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
          expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
          expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
          expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
          expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
          expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
          expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
          expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
          expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);
        })
      })

      cy.log("move line 3, ignores point2 coords")
      cy.window().then((win) => {

        let dx = -8, dy = 14;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        l3.moveLine({
          point1coords: [x1, y1],
          point2coords: [18, 91]
        });

        expect(components['/_line1'].stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(components['/_line1'].stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(components['/_line1'].stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l2.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l2.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l2.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(l3.stateValues.points[0].map(x => x.evaluate_to_constant())).eqls([x1, y1]);
        expect(l3.stateValues.points[1].map(x => x.evaluate_to_constant())).eqls([x2, y2]);
        expect(l3.stateValues.slope.evaluate_to_constant()).closeTo(slope, 1E-14);
        expect(A.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A2.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B2.stateValues.coords.tree).eqls(["vector", x2, y2]);
        expect(A3.stateValues.coords.tree).eqls(["vector", x1, y1]);
        expect(B3.stateValues.coords.tree).eqls(["vector", x2, y2]);

      })


    })
  })

})
