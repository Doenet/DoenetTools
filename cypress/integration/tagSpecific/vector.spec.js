describe('Vector Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('vector with single sugared point, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector>(-4,2)</vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with single point sugared as head, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><point>(-4,2)</point></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with single head sugared point, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><head>(-4,2)</head></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with single head point, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><head><point>(-4,2)</point></head></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with single endpoints sugared point, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><endpoints>(-4,2)</endpoints></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with single endpoints point, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><endpoints><point>(-4,2)</point></endpoints></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with single displacement sugared point, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><displacement>(-4,2)</displacement></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with single displacement point, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><displacement><point>(-4,2)</point></displacement></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with two sugared points, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector>(4,1),(-4,2)</vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with two points sugared as head/tail, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><point>(4,1)</point><point>(-4,2)</point></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with sugared head and tail points, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><tail>(4,1)</tail><head>(-4,2)</head></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with head and tail points, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><tail><point>(4,1)</point></tail><head><point>(-4,2)</point></head></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with two sugared endpoints, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><endpoints>(4,1),(-4,2)</endpoints></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with two endpoints, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><endpoints><point>(4,1)</point><point>(-4,2)</point></endpoints></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with displacement and tail, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><displacement>(-8,1)</displacement><tail>(4,1)</tail></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move just head');
    })
  })

  it('vector with displacement and point, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><displacement>(-8,1)</displacement><point>(4,1)</point></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with vector and point, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><vector>(-8,1)</vector><point>(4,1)</point></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with vector and tail, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><vector>(-8,1)</vector><tail>(4,1)</tail></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        tail.movePoint({ x: tailx, y: taily });
        head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with displacement and head, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><displacement>(-8,1)</displacement><head>(-4,2)</head></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        head.movePoint({ x: headx, y: heady });
        tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let headx = -3;
        let heady = -9;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let tailx = headx - displacementx;
        let taily = heady - displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('vector with vector and head, head/tail/displacement reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><vector>(-8,1)</vector><head>(-4,2)</head></vector>
  </graph>

  <graph>
  <ref prop="tail">_vector1</ref>
  <ref prop="head">_vector1</ref>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_ref1'].replacements[0];
      let head = components['/_ref2'].replacements[0];
      let displacement = components['/_ref3'].replacements[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail.get_component(0),
          components['/_vector1'].stateValues.tail.get_component(1),
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head.get_component(0),
          components['/_vector1'].stateValues.head.get_component(1),
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move reffed head and tail')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        head.movePoint({ x: headx, y: heady });
        tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", 0, 0]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementx, displacementy]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let headx = -3;
        let heady = -9;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let tailx = headx - displacementx;
        let taily = heady - displacementy;

        displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.tree).eqls(["vector", displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.tree).eqls(["vector", displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
      })
    })
  })

  it('reffed vectors', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <vector><endpoints>
      <point>(-1,2)</point>
      <point>(-2,3)</point>
    </endpoints></vector>
    <point>(-4,7)</point>
    <point>(3,5)</point>
    <vector>
      <ref>_point3</ref>
      <ref>_point4</ref>
    </vector>
    <vector>(-9,-1),(-3,6)</vector>
  </graph>

  <graph>
    <ref>_vector1</ref>
    <ref>_vector2</ref>
    <ref>_vector3</ref>
  </graph>

  <ref>_graph2</ref>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let vector4 = components['/_ref3'].replacements[0];
      let vector5 = components['/_ref4'].replacements[0];
      let vector6 = components['/_ref5'].replacements[0];

      let vector7 = components['/_ref6'].replacements[0].activeChildren[0];
      let vector8 = components['/_ref6'].replacements[0].activeChildren[1];
      let vector9 = components['/_ref6'].replacements[0].activeChildren[2];



      let vector1s = ['/_vector1', vector4.componentName, vector7.componentName];
      let vector2s = ['/_vector2', vector5.componentName, vector8.componentName];
      let vector3s = ['/_vector3', vector6.componentName, vector9.componentName];
      cy.log("initial state")


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let v1tx = -1;
        let v1ty = 2;
        let v1hx = -2;
        let v1hy = 3;
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;

        for (let name of vector1s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v3hx, v3hy]);
        }

      })

      cy.log('move vector1')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = 5;
        let v1ty = -8;
        let v1hx = 4;
        let v1hy = -9;
        components['/_vector1'].moveVector({
          tailcoords: [v1tx, v1ty],
          headcoords: [v1hx, v1hy]
        });
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of vector1s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move vector4')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = 2;
        let v1ty = 6;
        let v1hx = -2;
        let v1hy = -4;
        vector4.moveVector({
          tailcoords: [v1tx, v1ty],
          headcoords: [v1hx, v1hy]
        });
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of vector1s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move vector7')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        vector7.moveVector({
          tailcoords: [v1tx, v1ty],
          headcoords: [v1hx, v1hy]
        });
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of vector1s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move vector2')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;

        components['/_vector2'].moveVector({
          tailcoords: [v2tx, v2ty],
          headcoords: [v2hx, v2hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of vector1s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move vector5')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = 6;
        let v2ty = -2;
        let v2hx = 1;
        let v2hy = -7;

        vector5.moveVector({
          tailcoords: [v2tx, v2ty],
          headcoords: [v2hx, v2hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of vector1s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move vector8')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = -3;
        let v2ty = -6;
        let v2hx = 5;
        let v2hy = -9;

        vector8.moveVector({
          tailcoords: [v2tx, v2ty],
          headcoords: [v2hx, v2hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of vector1s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move vector3')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = 6;
        let v3ty = -8;
        let v3hx = -1;
        let v3hy = 0;

        components['/_vector3'].moveVector({
          tailcoords: [v3tx, v3ty],
          headcoords: [v3hx, v3hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v2ty = -6;
        let v2tx = -3;
        let v2hx = 5;
        let v2hy = -9;
        for (let name of vector1s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move vector6')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = 3;
        let v3ty = 1;
        let v3hx = -7;
        let v3hy = -2;

        vector6.moveVector({
          tailcoords: [v3tx, v3ty],
          headcoords: [v3hx, v3hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v2ty = -6;
        let v2tx = -3;
        let v2hx = 5;
        let v2hy = -9;
        for (let name of vector1s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v3hx, v3hy]);
        }
      })

      cy.log('move vector9')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = -2;
        let v3ty = 7;
        let v3hx = 5;
        let v3hy = -6;

        vector9.moveVector({
          tailcoords: [v3tx, v3ty],
          headcoords: [v3hx, v3hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v2ty = -6;
        let v2tx = -3;
        let v2hx = 5;
        let v2hy = -9;
        for (let name of vector1s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v1tx, v1ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v2tx, v2ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", v3tx, v3ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", v3hx, v3hy]);
        }
      })

    })

  })

  it('reffed vectors and displacements', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><vector>(1,2)</vector></vector>
  </graph>
  
  <graph>
  <ref>_vector1</ref>
  </graph>
  
  <graph>
  <ref>_vector2</ref>
  </graph>

  <graph>
  <ref prop="displacement">_vector1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let vector3 = components['/_ref1'].replacements[0];
      let vector4 = components['/_ref2'].replacements[0];
      let vector5 = components['/_ref3'].replacements[0];

      let vectors = ['/_vector1', vector3.componentName];
      let displacements = [vector4.componentName, vector5.componentName];

      cy.log("initial state")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let vector_tx = 0;
        let vector_ty = 0;
        let vector_hx = 1;
        let vector_hy = 2;
        let displacement_x = vector_hx - vector_tx;
        let displacement_y = vector_hy - vector_ty;
        let dtail_xs = [0, 0];
        let dtail_ys = [0, 0];
        let dhead_xs = dtail_xs.map(x => x + displacement_x);
        let dhead_ys = dtail_ys.map(y => y + displacement_y);

        for (let name of vectors) {
          expect(components[name].stateValues.tail.tree).eqls(["vector", vector_tx, vector_ty]);
          expect(components[name].stateValues.head.tree).eqls(["vector", vector_hx, vector_hy]);
          expect(components[name].stateValues.displacement.tree).eqls(["vector", displacement_x, displacement_y]);
        }
        for (let i = 0; i < 2; i++) {
          let name = displacements[i];
          expect(components[name].stateValues.tail.tree).eqls(["vector", dtail_xs[i], dtail_ys[i]]);
          expect(components[name].stateValues.head.tree).eqls(["vector", dhead_xs[i], dhead_ys[i]]);
          expect(components[name].stateValues.displacement.tree).eqls(["vector", displacement_x, displacement_y]);
        }

      })

      cy.log("move vectors")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let txs = [-4, 7]
        let tys = [9, 3];
        let hxs = [6, -2]
        let hys = [5, 0];

        for (let i = 0; i < 2; i++) {

          let vector_tx = txs[i];
          let vector_ty = tys[i];
          let vector_hx = hxs[i];
          let vector_hy = hys[i];

          components[vectors[i]].moveVector({
            tailcoords: [vector_tx, vector_ty],
            headcoords: [vector_hx, vector_hy]
          });

          let displacement_x = vector_hx - vector_tx;
          let displacement_y = vector_hy - vector_ty;
          let dtail_xs = [0, 0];
          let dtail_ys = [0, 0];
          let dhead_xs = dtail_xs.map(x => x + displacement_x);
          let dhead_ys = dtail_ys.map(y => y + displacement_y);

          for (let name of vectors) {
            expect(components[name].stateValues.tail.tree).eqls(["vector", vector_tx, vector_ty]);
            expect(components[name].stateValues.head.tree).eqls(["vector", vector_hx, vector_hy]);
            expect(components[name].stateValues.displacement.tree).eqls(["vector", displacement_x, displacement_y]);
          }
          for (let i = 0; i < 2; i++) {
            let name = displacements[i];
            expect(components[name].stateValues.tail.tree).eqls(["vector", dtail_xs[i], dtail_ys[i]]);
            expect(components[name].stateValues.head.tree).eqls(["vector", dhead_xs[i], dhead_ys[i]]);
            expect(components[name].stateValues.displacement.tree).eqls(["vector", displacement_x, displacement_y]);
          }
        }
      })

      cy.log("move displacements")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let vector_tx = 7;
        let vector_ty = 3;
        let dtail_xs = [0, 0];
        let dtail_ys = [0, 0];

        let txs = [7, 0]
        let tys = [-3, 4];
        let hxs = [8, -7]
        let hys = [-2, 1];

        for (let i = 0; i < 2; i++) {

          let displacement_x = hxs[i] - txs[i];
          let displacement_y = hys[i] - tys[i];
          dtail_xs[i] = txs[i];
          dtail_ys[i] = tys[i];
          let dhead_xs = dtail_xs.map(x => x + displacement_x);
          let dhead_ys = dtail_ys.map(y => y + displacement_y);
          let vector_hx = vector_tx + displacement_x;
          let vector_hy = vector_ty + displacement_y;

          components[displacements[i]].moveVector({
            tailcoords: [dtail_xs[i], dtail_ys[i]],
            headcoords: [dhead_xs[i], dhead_ys[i]]
          });

          for (let name of vectors) {
            expect(components[name].stateValues.tail.tree).eqls(["vector", vector_tx, vector_ty]);
            expect(components[name].stateValues.head.tree).eqls(["vector", vector_hx, vector_hy]);
            expect(components[name].stateValues.displacement.tree).eqls(["vector", displacement_x, displacement_y]);
          }
          for (let j = 0; j < 2; j++) {
            let name = displacements[j];
            expect(components[name].stateValues.tail.tree).eqls(["vector", dtail_xs[j], dtail_ys[j]]);
            expect(components[name].stateValues.head.tree).eqls(["vector", dhead_xs[j], dhead_ys[j]]);
            expect(components[name].stateValues.displacement.tree).eqls(["vector", displacement_x, displacement_y]);
          }
        }
      })
    })
  })

  it('constrain to vector', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <vector><ref>_point1</ref><ref>_point2</ref></vector>

  <point>(-5,2)
    <constrainTo><ref>_vector1</ref></constrainTo>
  </point>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('check initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", 1, 2]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", 3, 4]);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(2);
    });

    cy.log('move vector to 45 degrees')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_vector1'].moveVector({
        tailcoords: [-4, 4],
        headcoords: [4, -4],
      })
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", -4, 4]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", 4, -4]);

      let xorig = -5;
      let yorig = 2;
      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 10;
      let yorig = 1;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 9;
      let yorig = 7;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -9;
      let yorig = 7;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });


  })

  it('attract to vector', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <vector><ref>_point1</ref><ref>_point2</ref></vector>

  <point>(-5,2)
    <attractTo><ref>_vector1</ref></attractTo>
  </point>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('check initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", 1, 2]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", 3, 4]);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(-5);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(2);
    });

    cy.log('move vector to 45 degrees')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_vector1'].moveVector({
        tailcoords: [-4, 4],
        headcoords: [4, -4],
      })
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", -4, 4]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", 4, -4]);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(-5)
      expect(components['/_point3'].stateValues.xs[1].tree).eq(2)
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 3.3;
      let yorig = -3.6;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 4.3;
      let yorig = -4.6;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(4.3, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(-4.6, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -2.4;
      let yorig = 2.8;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -4.2;
      let yorig = 4.3;

      components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(p5x, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(p5y, 1E-12);
    });


  })

  it('two update paths through vectors', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <extract prop="y"><ref prop="head">original</ref></extract>
  <mathinput name="a" prefill="2" modifyIndirectly="false" />
  <graph>
    <vector name="original">
      <tail fixed>(0,0)</tail>
      <head>(1,3)</head>
    </vector>
  </graph>
  <graph>
    <vector name="multiplied">
      <tail fixed>(0,0)</tail>
      <head>
        <x>
          <ref prop="value">a</ref>
          <extract prop="x"><ref prop="head">original</ref></extract>
        </x>
        <y>
          <ref prop="value">a</ref>
          <extract prop="y"><ref prop="head">original</ref></extract>
        </y>
      </head>
    </vector>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('check initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/original'].stateValues.tail.tree).eqls(["vector", 0, 0]);
      expect(components['/original'].stateValues.head.tree).eqls(["vector", 1, 3]);
      expect(components['/multiplied'].stateValues.tail.tree).eqls(["vector", 0, 0]);
      expect(components['/multiplied'].stateValues.head.tree).eqls(["vector", 2, 6]);
    });

    cy.log('move original vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/original'].moveVector({ headcoords: [-5, 1] })
      expect(components['/original'].stateValues.tail.tree).eqls(["vector", 0, 0]);
      expect(components['/original'].stateValues.head.tree).eqls(["vector", -5, 1]);
      expect(components['/multiplied'].stateValues.tail.tree).eqls(["vector", 0, 0]);
      expect(components['/multiplied'].stateValues.head.tree).eqls(["vector", -10, 2]);
    });

    cy.log('move multiplied vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/multiplied'].moveVector({ headcoords: [6, -8] })
      expect(components['/original'].stateValues.tail.tree).eqls(["vector", 0, 0]);
      expect(components['/original'].stateValues.head.tree).eqls(["vector", 3, -4]);
      expect(components['/multiplied'].stateValues.tail.tree).eqls(["vector", 0, 0]);
      expect(components['/multiplied'].stateValues.head.tree).eqls(["vector", 6, -8]);
    });

    cy.log("Change factor");
    cy.get('#\\/a_input').clear().type(`-3{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/original'].stateValues.tail.tree).eqls(["vector", 0, 0]);
      expect(components['/original'].stateValues.head.tree).eqls(["vector", 3, -4]);
      expect(components['/multiplied'].stateValues.tail.tree).eqls(["vector", 0, 0]);
      expect(components['/multiplied'].stateValues.head.tree).eqls(["vector", -9, 12]);
    });

    cy.log('move multiplied vector again')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/multiplied'].moveVector({ headcoords: [-6, -3] })
      expect(components['/original'].stateValues.tail.tree).eqls(["vector", 0, 0]);
      expect(components['/original'].stateValues.head.tree).eqls(["vector", 2, 1]);
      expect(components['/multiplied'].stateValues.tail.tree).eqls(["vector", 0, 0]);
      expect(components['/multiplied'].stateValues.head.tree).eqls(["vector", -6, -3]);
    });


  })

  it('display vector sum triangle', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector name="u">(1,1)</vector>
  <vector name="v">
    <tail><ref prop="head">u</ref></tail>
    <displacement>(1,3)</displacement>
  </vector>
  <vector name="w">
    <head><ref prop="head">v</ref></head>
    <tail><ref prop="tail">u</ref></tail>
  </vector>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let uTail = [0, 0];
    let u = [1, 1];
    let v = [1, 3];
    let uHead = u.map((x, i) => x + uTail[i]);
    let vTail = uHead;
    let vHead = v.map((x, i) => x + vTail[i]);
    let w = u.map((x, i) => x + v[i]);
    let wTail = uTail;
    let wHead = w.map((x, i) => x + wTail[i]);

    cy.log('check initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/u'].stateValues.tail.tree).eqls(["vector", ...uTail]);
      expect(components['/u'].stateValues.head.tree).eqls(["vector", ...uHead]);
      expect(components['/u'].stateValues.displacement.tree).eqls(["vector", ...u]);
      expect(components['/v'].stateValues.tail.tree).eqls(["vector", ...vTail]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", ...vHead]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", ...v]);
      expect(components['/w'].stateValues.tail.tree).eqls(["vector", ...wTail]);
      expect(components['/w'].stateValues.head.tree).eqls(["vector", ...wHead]);
      expect(components['/w'].stateValues.displacement.tree).eqls(["vector", ...w]);
    });

    cy.log('moving tail of v just moves head of u')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      vTail = [-3, 2];
      uHead = vTail;

      components['/v'].moveVector({ tailcoords: vTail })

      u = uHead.map((x, i) => x - uTail[i]);

      v = vHead.map((x, i) => x - vTail[i]);

      expect(components['/u'].stateValues.tail.tree).eqls(["vector", ...uTail]);
      expect(components['/u'].stateValues.head.tree).eqls(["vector", ...uHead]);
      expect(components['/u'].stateValues.displacement.tree).eqls(["vector", ...u]);
      expect(components['/v'].stateValues.tail.tree).eqls(["vector", ...vTail]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", ...vHead]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", ...v]);
      expect(components['/w'].stateValues.tail.tree).eqls(["vector", ...wTail]);
      expect(components['/w'].stateValues.head.tree).eqls(["vector", ...wHead]);
      expect(components['/w'].stateValues.displacement.tree).eqls(["vector", ...w]);
    });

    cy.log('moving head of u keeps v displacement fixed')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      uHead = [7, 1];
      vTail = uHead;

      components['/u'].moveVector({ headcoords: uHead })

      u = uHead.map((x, i) => x - uTail[i]);

      vHead = v.map((x, i) => x + vTail[i]);
      w = u.map((x, i) => x + v[i]);
      wTail = uTail;
      wHead = w.map((x, i) => x + wTail[i]);


      expect(components['/u'].stateValues.tail.tree).eqls(["vector", ...uTail]);
      expect(components['/u'].stateValues.head.tree).eqls(["vector", ...uHead]);
      expect(components['/u'].stateValues.displacement.tree).eqls(["vector", ...u]);
      expect(components['/v'].stateValues.tail.tree).eqls(["vector", ...vTail]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", ...vHead]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", ...v]);
      expect(components['/w'].stateValues.tail.tree).eqls(["vector", ...wTail]);
      expect(components['/w'].stateValues.head.tree).eqls(["vector", ...wHead]);
      expect(components['/w'].stateValues.displacement.tree).eqls(["vector", ...w]);
    });

    cy.log('moving tail of u moves tail of w')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      uTail = [3, 4];

      components['/u'].moveVector({ tailcoords: uTail })

      u = uHead.map((x, i) => x - uTail[i]);

      w = u.map((x, i) => x + v[i]);
      wTail = uTail;

      expect(components['/u'].stateValues.tail.tree).eqls(["vector", ...uTail]);
      expect(components['/u'].stateValues.head.tree).eqls(["vector", ...uHead]);
      expect(components['/u'].stateValues.displacement.tree).eqls(["vector", ...u]);
      expect(components['/v'].stateValues.tail.tree).eqls(["vector", ...vTail]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", ...vHead]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", ...v]);
      expect(components['/w'].stateValues.tail.tree).eqls(["vector", ...wTail]);
      expect(components['/w'].stateValues.head.tree).eqls(["vector", ...wHead]);
      expect(components['/w'].stateValues.displacement.tree).eqls(["vector", ...w]);
    });

    cy.log('moving tail of w moves tail of u')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      wTail = [-1, 7];

      components['/w'].moveVector({ tailcoords: wTail })

      uTail = wTail;

      u = uHead.map((x, i) => x - uTail[i]);
      w = u.map((x, i) => x + v[i]);

      expect(components['/u'].stateValues.tail.tree).eqls(["vector", ...uTail]);
      expect(components['/u'].stateValues.head.tree).eqls(["vector", ...uHead]);
      expect(components['/u'].stateValues.displacement.tree).eqls(["vector", ...u]);
      expect(components['/v'].stateValues.tail.tree).eqls(["vector", ...vTail]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", ...vHead]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", ...v]);
      expect(components['/w'].stateValues.tail.tree).eqls(["vector", ...wTail]);
      expect(components['/w'].stateValues.head.tree).eqls(["vector", ...wHead]);
      expect(components['/w'].stateValues.displacement.tree).eqls(["vector", ...w]);
    });

    cy.log('moving head of w moves head of v')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      wHead = [-5, -4];

      components['/w'].moveVector({ headcoords: wHead })

      vHead = wHead;
      v = vHead.map((x, i) => x - vTail[i]);

      w = u.map((x, i) => x + v[i]);

      expect(components['/u'].stateValues.tail.tree).eqls(["vector", ...uTail]);
      expect(components['/u'].stateValues.head.tree).eqls(["vector", ...uHead]);
      expect(components['/u'].stateValues.displacement.tree).eqls(["vector", ...u]);
      expect(components['/v'].stateValues.tail.tree).eqls(["vector", ...vTail]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", ...vHead]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", ...v]);
      expect(components['/w'].stateValues.tail.tree).eqls(["vector", ...wTail]);
      expect(components['/w'].stateValues.head.tree).eqls(["vector", ...wHead]);
      expect(components['/w'].stateValues.displacement.tree).eqls(["vector", ...w]);
    });

    cy.log('moving head of v moves head of w')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      vHead = [4, -7];

      components['/v'].moveVector({ headcoords: vHead })

      wHead = vHead;
      v = vHead.map((x, i) => x - vTail[i]);

      w = u.map((x, i) => x + v[i]);

      expect(components['/u'].stateValues.tail.tree).eqls(["vector", ...uTail]);
      expect(components['/u'].stateValues.head.tree).eqls(["vector", ...uHead]);
      expect(components['/u'].stateValues.displacement.tree).eqls(["vector", ...u]);
      expect(components['/v'].stateValues.tail.tree).eqls(["vector", ...vTail]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", ...vHead]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", ...v]);
      expect(components['/w'].stateValues.tail.tree).eqls(["vector", ...wTail]);
      expect(components['/w'].stateValues.head.tree).eqls(["vector", ...wHead]);
      expect(components['/w'].stateValues.displacement.tree).eqls(["vector", ...w]);
    });

  });

  it('ref coordinates off vectors', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector name="u">(1,5),(7,3)</vector>
  </graph>
  <p>x coordinate of u is <ref name="ux" prop="x">u</ref></p>
  <p>y coordinate of u is <ref name="uy" prop="y">u</ref></p>
  <p>x1 coordinate of u is <ref name="ux1" prop="x1">u</ref></p>
  <p>x2 coordinate of u is <ref name="ux2" prop="x2">u</ref></p>

  <vector name="v">(9,1,-3),(-3,10,8)</vector>
  <p>x coordinate of v is <ref name="vx" prop="x">v</ref></p>
  <p>y coordinate of v is <ref name="vy" prop="y">v</ref></p>
  <p>z coordinate of v is <ref name="vz" prop="z">v</ref></p>
  <p>x1 coordinate of v is <ref name="vx1" prop="x1">v</ref></p>
  <p>x2 coordinate of v is <ref name="vx2" prop="x2">v</ref></p>
  <p>x3 coordinate of v is <ref name="vx3" prop="x3">v</ref></p>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let uTail = [1, 5]
    let uHead = [7, 3];
    let u = [uHead[0] - uTail[0], uHead[1] - uTail[1]];
    let vTail = [9, 1, -3];
    let vHead = [-3, 10, 8];
    let v = [vHead[0] - vTail[0], vHead[1] - vTail[1], vHead[2] - vTail[2]];

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/u'].stateValues.tail.tree).eqls(["vector", ...uTail]);
      expect(components['/u'].stateValues.head.tree).eqls(["vector", ...uHead]);
      expect(components['/u'].stateValues.displacement.tree).eqls(["vector", ...u]);
      expect(components['/u'].stateValues.xs[0].tree).eqls(u[0]);
      expect(components['/u'].stateValues.xs[1].tree).eqls(u[1]);
      expect(components['/v'].stateValues.tail.tree).eqls(["vector", ...vTail]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", ...vHead]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", ...v]);
      expect(components['/v'].stateValues.xs[0].tree).eqls(v[0]);
      expect(components['/v'].stateValues.xs[1].tree).eqls(v[1]);
      expect(components['/v'].stateValues.xs[2].tree).eqls(v[2]);

      expect(components['/ux'].replacements[0].stateValues.value.tree).eqls(u[0]);
      expect(components['/uy'].replacements[0].stateValues.value.tree).eqls(u[1]);
      expect(components['/ux1'].replacements[0].stateValues.value.tree).eqls(u[0]);
      expect(components['/ux2'].replacements[0].stateValues.value.tree).eqls(u[1]);
      expect(components['/vx'].replacements[0].stateValues.value.tree).eqls(v[0]);
      expect(components['/vy'].replacements[0].stateValues.value.tree).eqls(v[1]);
      expect(components['/vz'].replacements[0].stateValues.value.tree).eqls(v[2]);
      expect(components['/vx1'].replacements[0].stateValues.value.tree).eqls(v[0]);
      expect(components['/vx2'].replacements[0].stateValues.value.tree).eqls(v[1]);
      expect(components['/vx3'].replacements[0].stateValues.value.tree).eqls(v[2]);

    });

  });

  it('combining displacement components through refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <vector name="v1">(1,2),(3,5)</vector>
    <ref name="v2">v1</ref>
    <ref name="v3" prop="displacement">v1</ref>
    <vector name="v4"><displacement>
      (<ref prop="y">v2</ref>,<ref prop="x">v3</ref>)
    </displacement></vector>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let x = 2;
    let y = 3;
    let t1x = 1, t1y = 2;
    let t3x = 0, t3y = 0;
    let t4x = 0, t4y = 0;

    cy.log("initial positions")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move head of vector 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 3, hy = 7;
      components['/v1'].moveVector({ headcoords: [hx, hy] });

      x = hx - t1x;
      y = hy - t1y;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move tail of vector 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tx = -2, ty = -1;
      components['/v1'].moveVector({ tailcoords: [tx, ty] });

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move head of vector 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 4, hy = 1;
      components['/v2'].replacements[0].moveVector({ headcoords: [hx, hy] });

      x = hx - t1x;
      y = hy - t1y;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move tail of vector 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tx = 5, ty = 7;
      components['/v2'].replacements[0].moveVector({ tailcoords: [tx, ty] });

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move head of vector 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let hx = -6, hy = 3;
      components['/v3'].replacements[0].moveVector({ headcoords: [hx, hy] });

      x = hx - t3x;
      y = hy - t3y;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move tail of vector 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tx = -1, ty = 4;
      components['/v3'].replacements[0].moveVector({ tailcoords: [tx, ty] });

      x += t3x - tx;
      y += t3y - ty;
      t3x = tx;
      t3y = ty;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move head of vector 4")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 6, hy = -2;
      components['/v4'].moveVector({ headcoords: [hx, hy] });

      x = hy - t4y;
      y = hx - t4x;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move tail of vector 4")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tx = 7, ty = 2;
      components['/v4'].moveVector({ tailcoords: [tx, ty] });

      x += t4y - ty;
      y += t4x - tx;
      t4x = tx;
      t4y = ty;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });


  })

  it('combining displacement components through refs 2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <vector name="v1">(1,2),(3,5)</vector>
    <ref name="v2">v1</ref>
    <ref name="v3" prop="displacement">v1</ref>
    <vector name="v4"><displacement>
      <head>
        <x>
          <extract prop="y">
            <extract prop="head">
              <ref prop="displacement">v2</ref>
            </extract>
          </extract>
        </x>
        <y>
          <extract prop="x">
            <extract prop="head">
              <ref prop="displacement">v3</ref>
            </extract>
          </extract>
        </y>
      </head>
    </displacement></vector>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let x = 2;
    let y = 3;
    let t1x = 1, t1y = 2;
    let t3x = 0, t3y = 0;
    let t4x = 0, t4y = 0;

    cy.log("initial positions")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move head of vector 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 3, hy = 7;
      components['/v1'].moveVector({ headcoords: [hx, hy] });

      x = hx - t1x;
      y = hy - t1y;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move tail of vector 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tx = -2, ty = -1;
      components['/v1'].moveVector({ tailcoords: [tx, ty] });

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move head of vector 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 4, hy = 1;
      components['/v2'].replacements[0].moveVector({ headcoords: [hx, hy] });

      x = hx - t1x;
      y = hy - t1y;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move tail of vector 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tx = 5, ty = 7;
      components['/v2'].replacements[0].moveVector({ tailcoords: [tx, ty] });

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move head of vector 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let hx = -6, hy = 3;
      components['/v3'].replacements[0].moveVector({ headcoords: [hx, hy] });

      x = hx - t3x;
      y = hy - t3y;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move tail of vector 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tx = -1, ty = 4;
      components['/v3'].replacements[0].moveVector({ tailcoords: [tx, ty] });

      x += t3x - tx;
      y += t3y - ty;
      t3x = tx;
      t3y = ty;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move head of vector 4")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 6, hy = -2;
      components['/v4'].moveVector({ headcoords: [hx, hy] });

      x = hy - t4y;
      y = hx - t4x;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });

    cy.log("move tail of vector 4")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tx = 7, ty = 2;
      components['/v4'].moveVector({ tailcoords: [tx, ty] });

      x += t4y - ty;
      y += t4x - tx;
      t4x = tx;
      t4y = ty;

      expect(components['/v1'].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v1'].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.tree).eqls(["vector", t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.tree).eqls(["vector", t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.tree).eqls(["vector", t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.tree).eqls(["vector", t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.tree).eqls(["vector", x, y]);

      expect(components['/v4'].stateValues.tail.tree).eqls(["vector", t4x, t4y]);
      expect(components['/v4'].stateValues.head.tree).eqls(["vector", t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.tree).eqls(["vector", y, x]);

    });


  })

  it('combining components of head and tail through refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector name="v">(1,2),(-2,3)</vector>
  <ref prop="head" name="vh">v</ref>
  <ref prop="tail" name="vt">v</ref>
  <point name="c">
    <x>
      <ref prop="x">vh</ref>
    </x>
    <y>
      <ref prop="y">vt</ref>
    </y>
  </point>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tx = 1, ty = 2, hx = -2, hy = 3;

    cy.log("initial positions")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/v'].stateValues.tail.tree).eqls(["vector", tx, ty]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", hx, hy]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", hx - tx, hy - ty]);

      expect(components['/vt'].replacements[0].stateValues.coords.tree).eqls(["vector", tx, ty]);
      expect(components['/vh'].replacements[0].stateValues.coords.tree).eqls(["vector", hx, hy]);
      expect(components['/c'].stateValues.coords.tree).eqls(["vector", hx, ty]);

    });

    cy.log("move vector 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      tx = 3, ty = -1, hx = -4, hy = 7;

      components['/v'].moveVector({ headcoords: [hx, hy], tailcoords: [tx, ty] });

      expect(components['/v'].stateValues.tail.tree).eqls(["vector", tx, ty]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", hx, hy]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", hx - tx, hy - ty]);

      expect(components['/vt'].replacements[0].stateValues.coords.tree).eqls(["vector", tx, ty]);
      expect(components['/vh'].replacements[0].stateValues.coords.tree).eqls(["vector", hx, hy]);
      expect(components['/c'].stateValues.coords.tree).eqls(["vector", hx, ty]);

    });


    cy.log("move head point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      hx = 2, hy = 9;

      components['/vh'].replacements[0].movePoint({ x: hx, y: hy });

      expect(components['/v'].stateValues.tail.tree).eqls(["vector", tx, ty]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", hx, hy]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", hx - tx, hy - ty]);

      expect(components['/vt'].replacements[0].stateValues.coords.tree).eqls(["vector", tx, ty]);
      expect(components['/vh'].replacements[0].stateValues.coords.tree).eqls(["vector", hx, hy]);
      expect(components['/c'].stateValues.coords.tree).eqls(["vector", hx, ty]);

    });


    cy.log("move tail point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      tx = -3, ty = 10;

      components['/vt'].replacements[0].movePoint({ x: tx, y: ty });

      expect(components['/v'].stateValues.tail.tree).eqls(["vector", tx, ty]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", hx, hy]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", hx - tx, hy - ty]);

      expect(components['/vt'].replacements[0].stateValues.coords.tree).eqls(["vector", tx, ty]);
      expect(components['/vh'].replacements[0].stateValues.coords.tree).eqls(["vector", hx, hy]);
      expect(components['/c'].stateValues.coords.tree).eqls(["vector", hx, ty]);

    });


    cy.log("move combined point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      hx = -6, ty = 0;

      components['/c'].movePoint({ x: hx, y: ty });

      expect(components['/v'].stateValues.tail.tree).eqls(["vector", tx, ty]);
      expect(components['/v'].stateValues.head.tree).eqls(["vector", hx, hy]);
      expect(components['/v'].stateValues.displacement.tree).eqls(["vector", hx - tx, hy - ty]);

      expect(components['/vt'].replacements[0].stateValues.coords.tree).eqls(["vector", tx, ty]);
      expect(components['/vh'].replacements[0].stateValues.coords.tree).eqls(["vector", hx, hy]);
      expect(components['/c'].stateValues.coords.tree).eqls(["vector", hx, ty]);

    });



  })

  it('updates depending on vector definition', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point name="tvt">(1,2)</point>
  <point name="hvh">(-3,4)</point>
  <point name="dvd">(-5,-6)</point>
  <point name="tvth">(7,-8)</point>
  <point name="hvth">(-1,-2)</point>
  <point name="tvtd">(3,-4)</point>
  <point name="dvtd">(5,6)</point>
  <point name="hvhd">(-7,8)</point>
  <point name="dvhd">(9,10)</point>
  </graph>

  <graph>
  <vector name="vt">
    <tail><ref>tvt</ref></tail>
  </vector>
  <vector name="vh">
    <head><ref>hvh</ref></head>
  </vector>
  <vector name="vd">
    <displacement><ref>dvd</ref></displacement>
  </vector>
  <vector name="vth">
    <tail><ref>tvth</ref></tail>
    <head><ref>hvth</ref></head>
  </vector>
  <vector name="vtd">
    <tail><ref>tvtd</ref></tail>
    <displacement><ref>dvtd</ref></displacement>
  </vector>
  <vector name="vhd">
    <head><ref>hvhd</ref></head>
    <displacement><ref>dvhd</ref></displacement>
  </vector>
  </graph>

  <graph>
  <ref prop="tail" name="tfvt">vt</ref>
  <ref prop="head" name="hfvt">vt</ref>
  <ref prop="displacement" name="dfvt">vt</ref>

  <ref prop="tail" name="tfvh">vh</ref>
  <ref prop="head" name="hfvh">vh</ref>
  <ref prop="displacement" name="dfvh">vh</ref>

  <ref prop="tail" name="tfvd">vd</ref>
  <ref prop="head" name="hfvd">vd</ref>
  <ref prop="displacement" name="dfvd">vd</ref>

  <ref prop="tail" name="tfvth">vth</ref>
  <ref prop="head" name="hfvth">vth</ref>
  <ref prop="displacement" name="dfvth">vth</ref>

  <ref prop="tail" name="tfvtd">vtd</ref>
  <ref prop="head" name="hfvtd">vtd</ref>
  <ref prop="displacement" name="dfvtd">vtd</ref>

  <ref prop="tail" name="tfvhd">vhd</ref>
  <ref prop="head" name="hfvhd">vhd</ref>
  <ref prop="displacement" name="dfvhd">vhd</ref>

  </graph>

  <graph>
  <ref name="vt2">vt</ref>
  <ref name="vh2">vh</ref>
  <ref name="vd2">vd</ref>
  <ref name="vth2">vth</ref>
  <ref name="vtd2">vtd</ref>
  <ref name="vhd2">vhd</ref>
  </graph>

  <graph>
  <ref prop="tail" name="tfvt2">vt2</ref>
  <ref prop="head" name="hfvt2">vt2</ref>
  <ref prop="displacement" name="dfvt2">vt2</ref>

  <ref prop="tail" name="tfvh2">vh2</ref>
  <ref prop="head" name="hfvh2">vh2</ref>
  <ref prop="displacement" name="dfvh2">vh2</ref>

  <ref prop="tail" name="tfvd2">vd2</ref>
  <ref prop="head" name="hfvd2">vd2</ref>
  <ref prop="displacement" name="dfvd2">vd2</ref>

  <ref prop="tail" name="tfvth2">vth2</ref>
  <ref prop="head" name="hfvth2">vth2</ref>
  <ref prop="displacement" name="dfvth2">vth2</ref>

  <ref prop="tail" name="tfvtd2">vtd2</ref>
  <ref prop="head" name="hfvtd2">vtd2</ref>
  <ref prop="displacement" name="dfvtd2">vtd2</ref>

  <ref prop="tail" name="tfvhd2">vhd2</ref>
  <ref prop="head" name="hfvhd2">vhd2</ref>
  <ref prop="displacement" name="dfvhd2">vhd2</ref>

  </graph>

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')


    let tvt = [1, 2];
    let hvt = [0, 0];

    let hvh = [-3, 4];
    let tvh = [0, 0];

    let dvd = [-5, -6];
    let tvd = [0, 0];

    let tvth = [7, -8];
    let hvth = [-1, -2];

    let tvtd = [3, -4];
    let dvtd = [5, 6];

    let hvhd = [-7, 8];
    let dvhd = [9, 10];

    let dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
    let dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
    let hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
    let dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
    let hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];
    let tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

    cy.log("Initial configuration")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("move tail of each vector directly")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      tvt = [-3, 5];
      tvh = [9, -2];
      tvd = [0, 7];
      tvth = [-7, 4];
      tvtd = [5, -9];
      tvhd = [-1, -6];

      components['/vt'].moveVector({ tailcoords: tvt })
      components['/vh'].moveVector({ tailcoords: tvh })
      components['/vd'].moveVector({ tailcoords: tvd })
      components['/vth'].moveVector({ tailcoords: tvth })
      components['/vtd'].moveVector({ tailcoords: tvtd })
      components['/vhd'].moveVector({ tailcoords: tvhd })

      // since moved tails directly, heads stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("move head of each vector directly")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      hvt = [5, -1];
      hvh = [3, -6];
      hvd = [1, -9];
      hvth = [6, 2];
      hvtd = [-6, -4];
      hvhd = [-4, 8];

      components['/vt'].moveVector({ headcoords: hvt })
      components['/vh'].moveVector({ headcoords: hvh })
      components['/vd'].moveVector({ headcoords: hvd })
      components['/vth'].moveVector({ headcoords: hvth })
      components['/vtd'].moveVector({ headcoords: hvtd })
      components['/vhd'].moveVector({ headcoords: hvhd })

      // since moved heads directly, tails stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("move tail through defining point, if exists")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      tvt = [9, -1];
      tvth = [3, -2];
      tvtd = [-1, 5];

      components['/tvt'].movePoint({ x: tvt[0], y: tvt[1] })
      components['/tvth'].movePoint({ x: tvth[0], y: tvth[1] })
      components['/tvtd'].movePoint({ x: tvtd[0], y: tvtd[1] })

      // defined by tail only or tail/head, head stays fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

      // defined by tail and displacement, displacement stays fixed and head changes
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

    });

    cy.log("move head through defining point, if exists")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      hvh = [5, 3];
      hvth = [-8, -3];
      hvhd = [7, -6];

      components['/hvh'].movePoint({ x: hvh[0], y: hvh[1] })
      components['/hvth'].movePoint({ x: hvth[0], y: hvth[1] })
      components['/hvhd'].movePoint({ x: hvhd[0], y: hvhd[1] })

      // defined by head only or tail/head, tail stays fixed and displacement changes
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

      // defined by head and displacement, displacement stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("change displacement through defining point, if exists")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      dvd = [-1, -2];
      dvtd = [-6, 8];
      dvhd = [3, -7];

      components['/dvd'].movePoint({ x: dvd[0], y: dvd[1] })
      components['/dvtd'].movePoint({ x: dvtd[0], y: dvtd[1] })
      components['/dvhd'].movePoint({ x: dvhd[0], y: dvhd[1] })

      // defined by displacement only or tail/displacement, tail stays fixed and head changes
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      // defined by head and displacement, head stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("move tail of each vector through reffed point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      tvt = [-5, 3];
      tvh = [7, 0];
      tvd = [-2, 1];
      tvth = [8, -8];
      tvtd = [6, 5];
      tvhd = [-3, 4];

      components['/tfvt'].replacements[0].movePoint({ x: tvt[0], y: tvt[1] })
      components['/tfvh'].replacements[0].movePoint({ x: tvh[0], y: tvh[1] })
      components['/tfvd'].replacements[0].movePoint({ x: tvd[0], y: tvd[1] })
      components['/tfvth'].replacements[0].movePoint({ x: tvth[0], y: tvth[1] })
      components['/tfvtd'].replacements[0].movePoint({ x: tvtd[0], y: tvtd[1] })
      components['/tfvhd'].replacements[0].movePoint({ x: tvhd[0], y: tvhd[1] })

      // for most vectors, heads stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      // defined by displacement only or tail/displacement, 
      // displacement stays fixed and head changes
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("move head of each vector through reffed point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      hvt = [-1, -3];
      hvh = [7, -6];
      hvd = [-2, -5];
      hvth = [-3, 8];
      hvtd = [9, 1];
      hvhd = [-4, 4];

      components['/hfvt'].replacements[0].movePoint({ x: hvt[0], y: hvt[1] })
      components['/hfvh'].replacements[0].movePoint({ x: hvh[0], y: hvh[1] })
      components['/hfvd'].replacements[0].movePoint({ x: hvd[0], y: hvd[1] })
      components['/hfvth'].replacements[0].movePoint({ x: hvth[0], y: hvth[1] })
      components['/hfvtd'].replacements[0].movePoint({ x: hvtd[0], y: hvtd[1] })
      components['/hfvhd'].replacements[0].movePoint({ x: hvhd[0], y: hvhd[1] })

      // for most vectors, tails stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];

      // defined by head and displacement, displacement stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("change displacement of each vector through reffed vectors")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      dvt = [-9, 0];
      dvh = [-3, -1];
      dvd = [-5, 5];
      dvth = [7, 3];
      dvtd = [9, -8];
      dvhd = [1, 2];

      components['/dfvt'].replacements[0].moveVector({ headcoords: dvt });
      components['/dfvh'].replacements[0].moveVector({ headcoords: dvh });
      components['/dfvd'].replacements[0].moveVector({ headcoords: dvd });
      components['/dfvth'].replacements[0].moveVector({ headcoords: dvth });
      components['/dfvtd'].replacements[0].moveVector({ headcoords: dvtd });
      components['/dfvhd'].replacements[0].moveVector({ headcoords: dvhd });

      // for most vectors, tails stay fixed and head changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvh = [tvh[0] + dvh[0], tvh[1] + dvh[1]];
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvth = [tvth[0] + dvth[0], tvth[1] + dvth[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      // defined by head and displacement, head stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("move tail of each reffed vector directly")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      tvt = [1, 8];
      tvh = [-3, 2];
      tvd = [9, -1];
      tvth = [5, -3];
      tvtd = [-4, -8];
      tvhd = [-1, 6];

      components['/vt2'].replacements[0].moveVector({ tailcoords: tvt })
      components['/vh2'].replacements[0].moveVector({ tailcoords: tvh })
      components['/vd2'].replacements[0].moveVector({ tailcoords: tvd })
      components['/vth2'].replacements[0].moveVector({ tailcoords: tvth })
      components['/vtd2'].replacements[0].moveVector({ tailcoords: tvtd })
      components['/vhd2'].replacements[0].moveVector({ tailcoords: tvhd })

      // since moved tails directly, heads stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("move head of each reffed vector directly")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      hvt = [-7, 2];
      hvh = [-2, 9];
      hvd = [0, -3];
      hvth = [6, 1];
      hvtd = [7, 0];
      hvhd = [-8, -4];

      components['/vt2'].replacements[0].moveVector({ headcoords: hvt })
      components['/vh2'].replacements[0].moveVector({ headcoords: hvh })
      components['/vd2'].replacements[0].moveVector({ headcoords: hvd })
      components['/vth2'].replacements[0].moveVector({ headcoords: hvth })
      components['/vtd2'].replacements[0].moveVector({ headcoords: hvtd })
      components['/vhd2'].replacements[0].moveVector({ headcoords: hvhd })

      // since moved heads directly, tails stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("move tail of each reffed vector through reffed point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      tvt = [1, -1];
      tvh = [9, -9];
      tvd = [-3, 2];
      tvth = [5, 0];
      tvtd = [-1, 7];
      tvhd = [-6, 6];

      components['/tfvt2'].replacements[0].movePoint({ x: tvt[0], y: tvt[1] })
      components['/tfvh2'].replacements[0].movePoint({ x: tvh[0], y: tvh[1] })
      components['/tfvd2'].replacements[0].movePoint({ x: tvd[0], y: tvd[1] })
      components['/tfvth2'].replacements[0].movePoint({ x: tvth[0], y: tvth[1] })
      components['/tfvtd2'].replacements[0].movePoint({ x: tvtd[0], y: tvtd[1] })
      components['/tfvhd2'].replacements[0].movePoint({ x: tvhd[0], y: tvhd[1] })

      // for most vectors, heads stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      // defined by displacement only or tail/displacement, 
      // displacement stays fixed and head changes
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("move head of each reffed vector through reffed point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      hvt = [-6, -8];
      hvh = [2, -2];
      hvd = [0, 6];
      hvth = [-5, 4];
      hvtd = [3, 8];
      hvhd = [-1, 5];

      components['/hfvt2'].replacements[0].movePoint({ x: hvt[0], y: hvt[1] })
      components['/hfvh2'].replacements[0].movePoint({ x: hvh[0], y: hvh[1] })
      components['/hfvd2'].replacements[0].movePoint({ x: hvd[0], y: hvd[1] })
      components['/hfvth2'].replacements[0].movePoint({ x: hvth[0], y: hvth[1] })
      components['/hfvtd2'].replacements[0].movePoint({ x: hvtd[0], y: hvtd[1] })
      components['/hfvhd2'].replacements[0].movePoint({ x: hvhd[0], y: hvhd[1] })

      // for most vectors, tails stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];

      // defined by head and displacement, displacement stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });

    cy.log("change displacement of each reffed vector through reffed vectors")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      dvt = [-1, 7];
      dvh = [5, 9];
      dvd = [9, 2];
      dvth = [-3, -5];
      dvtd = [9, -4];
      dvhd = [-5, 3];

      components['/dfvt2'].replacements[0].moveVector({ headcoords: dvt });
      components['/dfvh2'].replacements[0].moveVector({ headcoords: dvh });
      components['/dfvd2'].replacements[0].moveVector({ headcoords: dvd });
      components['/dfvth2'].replacements[0].moveVector({ headcoords: dvth });
      components['/dfvtd2'].replacements[0].moveVector({ headcoords: dvtd });
      components['/dfvhd2'].replacements[0].moveVector({ headcoords: dvhd });

      // for most vectors, tails stay fixed and head changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvh = [tvh[0] + dvh[0], tvh[1] + dvh[1]];
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvth = [tvth[0] + dvth[0], tvth[1] + dvth[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      // defined by head and displacement, head stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt'].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt'].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh'].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh'].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd'].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth'].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth'].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd'].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd'].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd'].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd'].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.simplify().tree).eqls(["vector", ...dvhd]);

    });


  })

  it('vector adapts to coords of displacement', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math><ref>_vector1</ref></math>
  <graph>
    <vector>(1,2),(3,5)</vector>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,3)')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", 2, 3]);
      expect(components['/_math1'].stateValues.value.tree).eqls(["vector", 2, 3]);
    })

    cy.log("move vector head");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_vector1'].moveVector({ headcoords: [9, 7] })
      expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", 8, 5]);
      expect(components['/_math1'].stateValues.value.tree).eqls(["vector", 8, 5]);
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(8,5)')
    })


    cy.log("move vector head");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_vector1'].moveVector({ tailcoords: [-2, 6] })
      expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", 11, 1]);
      expect(components['/_math1'].stateValues.value.tree).eqls(["vector", 11, 1]);
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(11,1)')
    })


  });

  it('three vectors with mutual references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector>
    <head><ref prop="head">_vector2</ref></head>
    <tail><point>(1,0)</point></tail>
  </vector>
  <vector>
    <tail><ref prop="tail">_vector3</ref></tail>
    <head>(3,2)</head>
  </vector>
  <vector>
    <head><ref prop="tail">_vector1</ref></head>
    <tail>(-1,4)</tail>
  </vector>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let x1 = 1, y1 = 0;
    let x2 = 3, y2 = 2;
    let x3 = -1, y3 = 4;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move head of vector 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x2 = 7;
      y2 = -3;
      components['/_head1'].movePoint({ x: x2, y: y2 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move tail of vector 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x1 = -1;
      y1 = -4;
      components['/_tail1'].movePoint({ x: x1, y: y1 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move tail of vector 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x3 = 9;
      y3 = -8;
      components['/_tail2'].movePoint({ x: x3, y: y3 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move head of vector 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x2 = 3;
      y2 = 2;
      components['/_head2'].movePoint({ x: x2, y: y2 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move head of vector 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x1 = -5;
      y1 = 8;
      components['/_head3'].movePoint({ x: x1, y: y1 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move tail of vector 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x3 = 0;
      y3 = -5;
      components['/_tail3'].movePoint({ x: x3, y: y3 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

  })

  it('three vectors with mutual references, using endpoints', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector>
    <endpoints>
    <point>(1,0)</point>
    <ref prop="head">_vector2</ref>
    </endpoints>
  </vector>
  <vector>
    <endpoints>
    <ref prop="tail">_vector3</ref>
    <point>(3,2)</point>
    </endpoints>
  </vector>
  <vector>
    <endpoints>
      <tail>(-1,4)</tail>
      <ref prop="tail">_vector1</ref>
    </endpoints>
  </vector>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let x1 = 1, y1 = 0;
    let x2 = 3, y2 = 2;
    let x3 = -1, y3 = 4;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move head of vector 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x2 = 7;
      y2 = -3;
      components['/_endpoints1'].activeChildren[1].movePoint({ x: x2, y: y2 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move tail of vector 1")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x1 = -1;
      y1 = -4;
      components['/_endpoints1'].activeChildren[0].movePoint({ x: x1, y: y1 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move tail of vector 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x3 = 9;
      y3 = -8;
      components['/_endpoints2'].activeChildren[0].movePoint({ x: x3, y: y3 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move head of vector 2")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x2 = 3;
      y2 = 2;
      components['/_endpoints2'].activeChildren[1].movePoint({ x: x2, y: y2 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move head of vector 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x1 = -5;
      y1 = 8;
      components['/_endpoints3'].activeChildren[1].movePoint({ x: x1, y: y1 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

    cy.log("move tail of vector 3")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      x3 = 0;
      y3 = -5;
      components['/_endpoints3'].activeChildren[0].movePoint({ x: x3, y: y3 });
      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", x1, y1]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector2'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector2'].stateValues.head.tree).eqls(["vector", x2, y2]);
      expect(components['/_vector3'].stateValues.tail.tree).eqls(["vector", x3, y3]);
      expect(components['/_vector3'].stateValues.head.tree).eqls(["vector", x1, y1]);

    })

  })

  it('ref two components of vector', () => {
    // checking bug where second component wasn't updating
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <vector>(3,<ref prop="value">b</ref>),(<ref prop="value">a</ref>,4)</vector>

  <ref prop="x">_vector1</ref>
  <ref prop="y">_vector1</ref>
  
  <p><mathinput name="a" prefill="1"></mathinput></p>
  <p><mathinput name="b" prefill="2"></mathinput></p>
  
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/_ref3'].replacements[0];
      let xAnchor = '#' + x.componentName;
      let y = components['/_ref4'].replacements[0];
      let yAnchor = '#' + y.componentName;


      let a = 1;
      let b = 2;
      let dx = a - 3;
      let dy = 4 - b;

      cy.log('Test values displayed in browser')
      cy.get('#\\/a_input').should('have.value', `${a}`);
      cy.get('#\\/b_input').should('have.value', `${b}`);

      cy.get(xAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`${dx}`)
      });

      cy.get(yAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`${dy}`)
      });

      cy.get('#\\/_vector1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`(${dx},${dy})`)
      });


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", 3, b]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", a, 4]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", dx, dy]);
        expect(x.stateValues.value.tree).eq(dx)
        expect(y.stateValues.value.tree).eq(dy)
      })

      cy.log("changed values");

      let a2 = -5;
      let b2 = 7;
      let dx2 = a2 - 3;
      let dy2 = 4 - b2;

      cy.get('#\\/a_input').clear().type(`${a2}`);
      cy.get('#\\/b_input').clear().type(`${b2}`);

      cy.get('#\\/a_input').should('have.value', `${a2}`);
      cy.get('#\\/b_input').should('have.value', `${b2}`);

      cy.get(xAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`${dx2}`)
      });

      cy.get(yAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`${dy2}`)
      });

      cy.get('#\\/_vector1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`(${dx2},${dy2})`)
      });


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", 3, b2]);
        expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", a2, 4]);
        expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", dx2, dy2]);
        expect(x.stateValues.value.tree).eq(dx2)
        expect(y.stateValues.value.tree).eq(dy2)
      })


    })
  })

  it('vector with displacement and tail, move just tail', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><displacement>(-8,1)</displacement><tail>(4,1)</tail></vector>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tailx = 4;
      let taily = 1;
      let headx = -4;
      let heady = 2;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

    })

    cy.log(`move tail, make sure head doesn't move`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tailx = -3;
      let taily = 7;
      let headx = -4;
      let heady = 2;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      components['/_vector1'].moveVector({
        tailcoords: [tailx, taily],
      });

      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
    })


  })

  it('vector with displacement and head, move just head', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><displacement>(-8,1)</displacement><head>(-4,2)</head></vector>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tailx = 4;
      let taily = 1;
      let headx = -4;
      let heady = 2;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

    })

    cy.log(`move tail, make sure head doesn't move`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tailx = 4;
      let taily = 1;
      let headx = 3;
      let heady = 5;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      components['/_vector1'].moveVector({
        headcoords: [headx, heady],
      });

      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
    })


  })

  it('vector with displacement, move just tail', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><displacement>(-8,1)</displacement></vector>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let tailx = 0;
      let taily = 0;
      let headx = -8;
      let heady = 1;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);

    })

    cy.log(`move tail, make sure head doesn't move`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let tailx = -3;
      let taily = 7;
      let headx = -8;
      let heady = 1;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      components['/_vector1'].moveVector({
        tailcoords: [tailx, taily],
      });

      expect(components['/_vector1'].stateValues.tail.tree).eqls(["vector", tailx, taily]);
      expect(components['/_vector1'].stateValues.head.tree).eqls(["vector", headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.tree).eqls(["vector", displacementx, displacementy]);
    })


  })

});