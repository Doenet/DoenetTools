import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Vector Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('vector with no arguments, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector/>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 0;
        let taily = 0;
        let headx = 1;
        let heady = 0;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = 4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head and tail')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {
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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });


        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })


  it('vector with sugared tuple giving xs, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector>(-4,2)</vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with point giving displacement, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><point>(-4,2)</point></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector from vector giving displacement, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><vector>(-4,2)</vector></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with just displacement, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector displacement ="(-4,2)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with xs, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector xs="-4 2" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with x and y, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector x="-4" y="2" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })

  })

  it('vector with y, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector y="2" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = 0;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = 1;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })

  })


  it('vector with sugared tuple giving xs and tail, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector tail="(4,1)" >(-8,1)</vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -7;
        let heady = 7;

        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })

  })

  it('vector with displacement point child and tail, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector tail="(4,1)" ><point>(-8,1)</point></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -7;
        let heady = 7;

        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })

  })

  it('vector with displacement vector child and tail, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector tail="(4,1)" ><vector>(-8,1)</vector></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -7;
        let heady = 7;

        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })

  })

  it('vector with displacement and tail, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector displacement="(-8,1)" tail="(4,1)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -7;
        let heady = 7;

        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })

  })

  it('vector with xs and tail, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector xs="-8 1" tail="(4,1)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -7;
        let heady = 7;

        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })

  })

  it('vector with x, y and tail, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector x="-8" y="1" tail="(4,1)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -7;
        let heady = 7;

        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })

  })

  it('vector with y and tail, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector y="1" tail="(4,1)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 4;
        let taily = 1;
        let headx = 4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = 1;
        let heady = 7;

        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })

  })



  it('vector with sugared tuple giving xs and head, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector head="(-4,2)" >(-8,1)</vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head moves vector')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = 5;
        let taily = -10;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {
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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with displacement point child and head, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector head="(-4,2)" ><point>(-8,1)</point></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head moves vector')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = 5;
        let taily = -10;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {
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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with displacement vector child and head, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector head="(-4,2)" ><vector>(-8,1)</vector></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head moves vector')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = 5;
        let taily = -10;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {
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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with displacement and head, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector displacement="(-8,1)" head="(-4,2)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head moves vector')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = 5;
        let taily = -10;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {
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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with xs and head, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector xs="-8 1" head="(-4,2)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head moves vector')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = 5;
        let taily = -10;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {
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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with x, y and head, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector x="-8" y="1" head="(-4,2)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head moves vector')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = 5;
        let taily = -10;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {
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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with y and head, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector y="1" head="(-4,2)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = -4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head moves vector')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -3;
        let taily = -10;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {
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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })


  it('vector with just head, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector head="(-4,2)"/>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail keeps head fixed')
      cy.window().then(async (win) => {

        let tailx = -7;
        let taily = 5;
        let headx = -1;
        let heady = 4;

        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })


      cy.log('move displacement')
      cy.window().then(async (win) => {

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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with head and tail, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector tail="(4,1)" head="(-4,2)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail keeps head fixed')
      cy.window().then(async (win) => {

        let tailx = -7;
        let taily = 5;
        let headx = -1;
        let heady = 4;

        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })


      cy.log('move displacement')
      cy.window().then(async (win) => {

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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector with just tail, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector tail="(3,4)"/>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tailx = 3;
        let taily = 4;
        let headx = 4;
        let heady = 4;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = 7;
        let heady = 6;

        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let tailx = -7;
        let taily = 5;
        let headx = -3;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {
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

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });


        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })


  it('copied vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <vector tail="(-1,2)" head="(-2,3)" />
    <point>(-4,7)</point>
    <point>(3,5)</point>
    <vector tail="$_point1" head="$_point2" />
    <vector tail="(-9,-1)" head="(-3,6)" />
  </graph>

  <graph>
    <copy target="_vector1" />
    <copy target="_vector2" />
    <copy target="_vector3" />
  </graph>

  <copy target="_graph2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let vector4 = components['/_copy1'].replacements[0];
      let vector5 = components['/_copy2'].replacements[0];
      let vector6 = components['/_copy3'].replacements[0];

      let vector7 = components['/_copy4'].replacements[0].activeChildren[0];
      let vector8 = components['/_copy4'].replacements[0].activeChildren[1];
      let vector9 = components['/_copy4'].replacements[0].activeChildren[2];



      let vector1s = ['/_vector1', vector4.componentName, vector7.componentName];
      let vector2s = ['/_vector2', vector5.componentName, vector8.componentName];
      let vector3s = ['/_vector3', vector6.componentName, vector9.componentName];
      cy.log("initial state")


      cy.window().then(async (win) => {
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v1tx, v1ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v2tx, v2ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v3tx, v3ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v3hx, v3hy]);
        }

      })

      cy.log('move vector1')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = 5;
        let v1ty = -8;
        let v1hx = 4;
        let v1hy = -9;
        await components['/_vector1'].moveVector({
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v1tx, v1ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v2tx, v2ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v3tx, v3ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move vector4')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = 2;
        let v1ty = 6;
        let v1hx = -2;
        let v1hy = -4;
        await vector4.moveVector({
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v1tx, v1ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v2tx, v2ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v3tx, v3ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move vector7')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        await vector7.moveVector({
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v1tx, v1ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v2tx, v2ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v3tx, v3ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move vector2')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;

        await components['/_vector2'].moveVector({
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v1tx, v1ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v2tx, v2ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v3tx, v3ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move vector5')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = 6;
        let v2ty = -2;
        let v2hx = 1;
        let v2hy = -7;

        await vector5.moveVector({
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v1tx, v1ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v2tx, v2ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v3tx, v3ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move vector8')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = -3;
        let v2ty = -6;
        let v2hx = 5;
        let v2hy = -9;

        await vector8.moveVector({
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v1tx, v1ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v2tx, v2ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v3tx, v3ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move vector3')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = 6;
        let v3ty = -8;
        let v3hx = -1;
        let v3hy = 0;

        await components['/_vector3'].moveVector({
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v1tx, v1ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v2tx, v2ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v3tx, v3ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move vector6')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = 3;
        let v3ty = 1;
        let v3hx = -7;
        let v3hy = -2;

        await vector6.moveVector({
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v1tx, v1ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v2tx, v2ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v3tx, v3ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move vector9')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = -2;
        let v3ty = 7;
        let v3hx = 5;
        let v3hy = -6;

        await vector9.moveVector({
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v1tx, v1ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v2tx, v2ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([v3tx, v3ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

    })

  })

  it('copied vectors and displacements', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector><vector>(1,2)</vector></vector>
  </graph>
  
  <graph>
  <copy target="_vector1" />
  </graph>
  
  <graph>
  <copy target="_vector2" />
  </graph>

  <graph>
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let vector3 = components['/_copy1'].replacements[0];
      let vector4 = components['/_copy2'].replacements[0];
      let vector5 = components['/_copy3'].replacements[0];

      let vectors = ['/_vector1', vector3.componentName];
      let displacements = [vector4.componentName, vector5.componentName];

      cy.log("initial state")
      cy.window().then(async (win) => {
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
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([vector_tx, vector_ty]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([vector_hx, vector_hy]);
          expect(components[name].stateValues.displacement.map(x => x.tree)).eqls([displacement_x, displacement_y]);
        }
        for (let i = 0; i < 2; i++) {
          let name = displacements[i];
          expect(components[name].stateValues.tail.map(x => x.tree)).eqls([dtail_xs[i], dtail_ys[i]]);
          expect(components[name].stateValues.head.map(x => x.tree)).eqls([dhead_xs[i], dhead_ys[i]]);
          expect(components[name].stateValues.displacement.map(x => x.tree)).eqls([displacement_x, displacement_y]);
        }

      })

      cy.log("move vectors")
      cy.window().then(async (win) => {
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

          await components[vectors[i]].moveVector({
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
            expect(components[name].stateValues.tail.map(x => x.tree)).eqls([vector_tx, vector_ty]);
            expect(components[name].stateValues.head.map(x => x.tree)).eqls([vector_hx, vector_hy]);
            expect(components[name].stateValues.displacement.map(x => x.tree)).eqls([displacement_x, displacement_y]);
          }
          for (let i = 0; i < 2; i++) {
            let name = displacements[i];
            expect(components[name].stateValues.tail.map(x => x.tree)).eqls([dtail_xs[i], dtail_ys[i]]);
            expect(components[name].stateValues.head.map(x => x.tree)).eqls([dhead_xs[i], dhead_ys[i]]);
            expect(components[name].stateValues.displacement.map(x => x.tree)).eqls([displacement_x, displacement_y]);
          }
        }
      })

      cy.log("move displacements")
      cy.window().then(async (win) => {
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

          await components[displacements[i]].moveVector({
            tailcoords: [dtail_xs[i], dtail_ys[i]],
            headcoords: [dhead_xs[i], dhead_ys[i]]
          });

          for (let name of vectors) {
            expect(components[name].stateValues.tail.map(x => x.tree)).eqls([vector_tx, vector_ty]);
            expect(components[name].stateValues.head.map(x => x.tree)).eqls([vector_hx, vector_hy]);
            expect(components[name].stateValues.displacement.map(x => x.tree)).eqls([displacement_x, displacement_y]);
          }
          for (let j = 0; j < 2; j++) {
            let name = displacements[j];
            expect(components[name].stateValues.tail.map(x => x.tree)).eqls([dtail_xs[j], dtail_ys[j]]);
            expect(components[name].stateValues.head.map(x => x.tree)).eqls([dhead_xs[j], dhead_ys[j]]);
            expect(components[name].stateValues.displacement.map(x => x.tree)).eqls([displacement_x, displacement_y]);
          }
        }
      })
    })
  })

  it('constrain to vector', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <vector tail="$_point1" head="$_point2" />

  <point x="-5" y="2">
    <constraints>
      <constrainTo><copy target="_vector1" /></constrainTo>
    </constraints>
  </point>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('check initial values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([1, 2]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([3, 4]);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(1);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(2);
    });

    cy.log('move vector to 45 degrees')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_vector1'].moveVector({
        tailcoords: [-4, 4],
        headcoords: [4, -4],
      })
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([-4, 4]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([4, -4]);

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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 10;
      let yorig = 1;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 9;
      let yorig = 7;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -9;
      let yorig = 7;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <vector tail="$_point1" head="$_point2" />

  <point x="-5" y="2">
    <constraints>
      <attractTo><copy target="_vector1" /></attractTo>
    </constraints>
  </point>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('check initial values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([1, 2]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([3, 4]);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(-5);
      expect(components['/_point3'].stateValues.xs[1].tree).eq(2);
    });

    cy.log('move vector to 45 degrees')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_vector1'].moveVector({
        tailcoords: [-4, 4],
        headcoords: [4, -4],
      })
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([-4, 4]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([4, -4]);
      expect(components['/_point3'].stateValues.xs[0].tree).eq(-5)
      expect(components['/_point3'].stateValues.xs[1].tree).eq(2)
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 3.3;
      let yorig = -3.6;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 4.3;
      let yorig = -4.6;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

      expect(components['/_point3'].stateValues.xs[0].tree).closeTo(4.3, 1E-12);
      expect(components['/_point3'].stateValues.xs[1].tree).closeTo(-4.6, 1E-12);
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -2.4;
      let yorig = 2.8;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -4.2;
      let yorig = 4.3;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

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

  it('constrain to vector, different scales from graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <vector head="(-1,-0.05)" tail="(1,0.05)" name="l" />
    <point x="100" y="0" name="P">
      <constraints scalesFromGraph="_graph1">
        <constrainTo><copy target="l" /></constrainTo>
      </constraints>
    </point>
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log(`point on vector, close to origin`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/P'].stateValues.xs[0].tree;
      let y = components['/P'].stateValues.xs[1].tree;

      expect(y).greaterThan(0);
      expect(y).lessThan(0.01);

      expect(x).closeTo(20 * y, 1E-10)
    })

    cy.log(`move point`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -100, y: 0.05 });
      let x = components['/P'].stateValues.xs[0].tree;
      let y = components['/P'].stateValues.xs[1].tree;
      expect(y).lessThan(0.05);
      expect(y).greaterThan(0.04);
      expect(x).closeTo(20 * y, 1E-10)
    })

    cy.log(`move point past end`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -100, y: 0.1 });
      let x = components['/P'].stateValues.xs[0].tree;
      let y = components['/P'].stateValues.xs[1].tree;
      expect(y).eq(0.05);
      expect(x).closeTo(20 * y, 1E-10)
    })

  });

  it('two update paths through vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <extract prop="y"><copy prop="head" target="original" /></extract>
  <point name="zeroFixed" fixed>(0,0)</point>
  <mathinput name="a" prefill="2" modifyIndirectly="false" />
  <graph>
    <vector name="original" tail="$zeroFixed" head="(1,3)" />
  </graph>
  <graph>
    <vector name="multiplied" tail="$zeroFixed" head="($a$(original{prop='headX1'}), $a$(original{prop='headX2'}))" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('check initial values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/original'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
      expect(components['/original'].stateValues.head.map(x => x.tree)).eqls([1, 3]);
      expect(components['/multiplied'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
      expect(components['/multiplied'].stateValues.head.map(x => x.tree)).eqls([2, 6]);
    });

    cy.log('move original vector')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/original'].moveVector({ headcoords: [-5, 1] })
      expect(components['/original'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
      expect(components['/original'].stateValues.head.map(x => x.tree)).eqls([-5, 1]);
      expect(components['/multiplied'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
      expect(components['/multiplied'].stateValues.head.map(x => x.tree)).eqls([-10, 2]);
    });

    cy.log('move multiplied vector')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/multiplied'].moveVector({ headcoords: [6, -8] })
      expect(components['/original'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
      expect(components['/original'].stateValues.head.map(x => x.tree)).eqls([3, -4]);
      expect(components['/multiplied'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
      expect(components['/multiplied'].stateValues.head.map(x => x.tree)).eqls([6, -8]);
    });

    cy.log("Change factor");
    cy.get('#\\/a textarea').type(`{end}{backspace}-3{enter}`, { force: true });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/original'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
      expect(components['/original'].stateValues.head.map(x => x.tree)).eqls([3, -4]);
      expect(components['/multiplied'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
      expect(components['/multiplied'].stateValues.head.map(x => x.tree)).eqls([-9, 12]);
    });

    cy.log('move multiplied vector again')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/multiplied'].moveVector({ headcoords: [-6, -3] })
      expect(components['/original'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
      expect(components['/original'].stateValues.head.map(x => x.tree)).eqls([2, 1]);
      expect(components['/multiplied'].stateValues.tail.map(x => x.tree)).eqls([0, 0]);
      expect(components['/multiplied'].stateValues.head.map(x => x.tree)).eqls([-6, -3]);
    });


  })

  it('display vector sum triangle', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector name="u" head="(1,1)" />
  <vector name="v" tail="$(u{prop='head'})" displacement="(1,3)" />
  <vector name="w" head="$(v{prop='head'})" tail="$(u{prop='tail'})" />
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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/u'].stateValues.tail.map(x => x.tree)).eqls([...uTail]);
      expect(components['/u'].stateValues.head.map(x => x.tree)).eqls([...uHead]);
      expect(components['/u'].stateValues.displacement.map(x => x.tree)).eqls([...u]);
      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([...vTail]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([...vHead]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([...v]);
      expect(components['/w'].stateValues.tail.map(x => x.tree)).eqls([...wTail]);
      expect(components['/w'].stateValues.head.map(x => x.tree)).eqls([...wHead]);
      expect(components['/w'].stateValues.displacement.map(x => x.tree)).eqls([...w]);
    });

    cy.log('moving tail of v just moves head of u')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      vTail = [-3, 2];
      uHead = vTail;

      await components['/v'].moveVector({ tailcoords: vTail })

      u = uHead.map((x, i) => x - uTail[i]);

      v = vHead.map((x, i) => x - vTail[i]);

      expect(components['/u'].stateValues.tail.map(x => x.tree)).eqls([...uTail]);
      expect(components['/u'].stateValues.head.map(x => x.tree)).eqls([...uHead]);
      expect(components['/u'].stateValues.displacement.map(x => x.tree)).eqls([...u]);
      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([...vTail]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([...vHead]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([...v]);
      expect(components['/w'].stateValues.tail.map(x => x.tree)).eqls([...wTail]);
      expect(components['/w'].stateValues.head.map(x => x.tree)).eqls([...wHead]);
      expect(components['/w'].stateValues.displacement.map(x => x.tree)).eqls([...w]);
    });

    cy.log('moving head of u keeps v displacement fixed')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      uHead = [7, 1];
      vTail = uHead;

      await components['/u'].moveVector({ headcoords: uHead })

      u = uHead.map((x, i) => x - uTail[i]);

      vHead = v.map((x, i) => x + vTail[i]);
      w = u.map((x, i) => x + v[i]);
      wTail = uTail;
      wHead = w.map((x, i) => x + wTail[i]);


      expect(components['/u'].stateValues.tail.map(x => x.tree)).eqls([...uTail]);
      expect(components['/u'].stateValues.head.map(x => x.tree)).eqls([...uHead]);
      expect(components['/u'].stateValues.displacement.map(x => x.tree)).eqls([...u]);
      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([...vTail]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([...vHead]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([...v]);
      expect(components['/w'].stateValues.tail.map(x => x.tree)).eqls([...wTail]);
      expect(components['/w'].stateValues.head.map(x => x.tree)).eqls([...wHead]);
      expect(components['/w'].stateValues.displacement.map(x => x.tree)).eqls([...w]);
    });

    cy.log('moving tail of u moves tail of w')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      uTail = [3, 4];

      await components['/u'].moveVector({ tailcoords: uTail })

      u = uHead.map((x, i) => x - uTail[i]);

      w = u.map((x, i) => x + v[i]);
      wTail = uTail;

      expect(components['/u'].stateValues.tail.map(x => x.tree)).eqls([...uTail]);
      expect(components['/u'].stateValues.head.map(x => x.tree)).eqls([...uHead]);
      expect(components['/u'].stateValues.displacement.map(x => x.tree)).eqls([...u]);
      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([...vTail]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([...vHead]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([...v]);
      expect(components['/w'].stateValues.tail.map(x => x.tree)).eqls([...wTail]);
      expect(components['/w'].stateValues.head.map(x => x.tree)).eqls([...wHead]);
      expect(components['/w'].stateValues.displacement.map(x => x.tree)).eqls([...w]);
    });

    cy.log('moving tail of w moves tail of u')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      wTail = [-1, 7];

      await components['/w'].moveVector({ tailcoords: wTail })

      uTail = wTail;

      u = uHead.map((x, i) => x - uTail[i]);
      w = u.map((x, i) => x + v[i]);

      expect(components['/u'].stateValues.tail.map(x => x.tree)).eqls([...uTail]);
      expect(components['/u'].stateValues.head.map(x => x.tree)).eqls([...uHead]);
      expect(components['/u'].stateValues.displacement.map(x => x.tree)).eqls([...u]);
      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([...vTail]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([...vHead]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([...v]);
      expect(components['/w'].stateValues.tail.map(x => x.tree)).eqls([...wTail]);
      expect(components['/w'].stateValues.head.map(x => x.tree)).eqls([...wHead]);
      expect(components['/w'].stateValues.displacement.map(x => x.tree)).eqls([...w]);
    });

    cy.log('moving head of w moves head of v')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      wHead = [-5, -4];

      await components['/w'].moveVector({ headcoords: wHead })

      vHead = wHead;
      v = vHead.map((x, i) => x - vTail[i]);

      w = u.map((x, i) => x + v[i]);

      expect(components['/u'].stateValues.tail.map(x => x.tree)).eqls([...uTail]);
      expect(components['/u'].stateValues.head.map(x => x.tree)).eqls([...uHead]);
      expect(components['/u'].stateValues.displacement.map(x => x.tree)).eqls([...u]);
      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([...vTail]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([...vHead]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([...v]);
      expect(components['/w'].stateValues.tail.map(x => x.tree)).eqls([...wTail]);
      expect(components['/w'].stateValues.head.map(x => x.tree)).eqls([...wHead]);
      expect(components['/w'].stateValues.displacement.map(x => x.tree)).eqls([...w]);
    });

    cy.log('moving head of v moves head of w')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      vHead = [4, -7];

      await components['/v'].moveVector({ headcoords: vHead })

      wHead = vHead;
      v = vHead.map((x, i) => x - vTail[i]);

      w = u.map((x, i) => x + v[i]);

      expect(components['/u'].stateValues.tail.map(x => x.tree)).eqls([...uTail]);
      expect(components['/u'].stateValues.head.map(x => x.tree)).eqls([...uHead]);
      expect(components['/u'].stateValues.displacement.map(x => x.tree)).eqls([...u]);
      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([...vTail]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([...vHead]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([...v]);
      expect(components['/w'].stateValues.tail.map(x => x.tree)).eqls([...wTail]);
      expect(components['/w'].stateValues.head.map(x => x.tree)).eqls([...wHead]);
      expect(components['/w'].stateValues.displacement.map(x => x.tree)).eqls([...w]);
    });

  });

  it('copy coordinates off vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector name="u" tail="(1,5)" head="(7,3)" />
  </graph>
  <p>x coordinate of u is <copy name="ux" prop="x" target="u" /></p>
  <p>y coordinate of u is <copy name="uy" prop="y" target="u" /></p>
  <p>x1 coordinate of u is <copy name="ux1" prop="x1" target="u" /></p>
  <p>x2 coordinate of u is <copy name="ux2" prop="x2" target="u" /></p>

  <vector name="v" tail="(9,1,-3)" head="(-3,10,8)" />
  <p>x coordinate of v is <copy name="vx" prop="x" target="v" /></p>
  <p>y coordinate of v is <copy name="vy" prop="y" target="v" /></p>
  <p>z coordinate of v is <copy name="vz" prop="z" target="v" /></p>
  <p>x1 coordinate of v is <copy name="vx1" prop="x1" target="v" /></p>
  <p>x2 coordinate of v is <copy name="vx2" prop="x2" target="v" /></p>
  <p>x3 coordinate of v is <copy name="vx3" prop="x3" target="v" /></p>
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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/u'].stateValues.tail.map(x => x.tree)).eqls([...uTail]);
      expect(components['/u'].stateValues.head.map(x => x.tree)).eqls([...uHead]);
      expect(components['/u'].stateValues.displacement.map(x => x.tree)).eqls([...u]);
      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([...vTail]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([...vHead]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([...v]);

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

  it('combining displacement components through copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <vector name="v1" tail="(1,2)" head="(3,5)" />
    <copy name="v2" target="v1" />
    <copy name="v3" prop="displacement" target="v1" />
    <vector name="v4" displacement="($(v2{prop='y'}), $(v3{prop='x'}))" />
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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move head of vector 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 3, hy = 7;
      await components['/v1'].moveVector({ headcoords: [hx, hy] });

      x = hx - t1x;
      y = hy - t1y;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move tail of vector 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tx = -2, ty = -1;
      await components['/v1'].moveVector({ tailcoords: [tx, ty] });

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move head of vector 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 4, hy = 1;
      await components['/v2'].replacements[0].moveVector({ headcoords: [hx, hy] });

      x = hx - t1x;
      y = hy - t1y;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move tail of vector 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tx = 5, ty = 7;
      await components['/v2'].replacements[0].moveVector({ tailcoords: [tx, ty] });

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move head of vector 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let hx = -6, hy = 3;
      await components['/v3'].replacements[0].moveVector({ headcoords: [hx, hy] });

      x = hx - t3x;
      y = hy - t3y;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move tail of vector 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tx = -1, ty = 4;
      await components['/v3'].replacements[0].moveVector({ tailcoords: [tx, ty] });

      x += t3x - tx;
      y += t3y - ty;
      t3x = tx;
      t3y = ty;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move head of vector 4")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 6, hy = -2;
      await components['/v4'].moveVector({ headcoords: [hx, hy] });

      x = hy - t4y;
      y = hx - t4x;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move tail of vector 4")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tx = 7, ty = 2;
      await components['/v4'].moveVector({ tailcoords: [tx, ty] });

      x += t4y - ty;
      y += t4x - tx;
      t4x = tx;
      t4y = ty;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });


  })

  it('combining displacement components through copies 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <vector name="v1" tail="(1,2)" head="(3,5)" />
    <copy name="v2" target="v1" />
    <copy name="v3" prop="displacement" target="v1" />
    <point name="v4displacementhead" hide>(
      <extract prop="y">
        <extract prop="head">
          <copy prop="displacement" target="v2" />
        </extract>
      </extract>,
      <extract prop="x">
        <extract prop="head">
          <copy prop="displacement" target="v3" />
        </extract>
      </extract>
    )</point>
    <vector name="v4displacement" head="$v4displacementhead" hide />
    <vector name="v4" displacement="$v4displacement" />
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
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move head of vector 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 3, hy = 7;
      await components['/v1'].moveVector({ headcoords: [hx, hy] });

      x = hx - t1x;
      y = hy - t1y;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move tail of vector 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tx = -2, ty = -1;
      await components['/v1'].moveVector({ tailcoords: [tx, ty] });

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move head of vector 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 4, hy = 1;
      await components['/v2'].replacements[0].moveVector({ headcoords: [hx, hy] });

      x = hx - t1x;
      y = hy - t1y;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move tail of vector 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tx = 5, ty = 7;
      await components['/v2'].replacements[0].moveVector({ tailcoords: [tx, ty] });

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move head of vector 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let hx = -6, hy = 3;
      await components['/v3'].replacements[0].moveVector({ headcoords: [hx, hy] });

      x = hx - t3x;
      y = hy - t3y;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move tail of vector 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tx = -1, ty = 4;
      await components['/v3'].replacements[0].moveVector({ tailcoords: [tx, ty] });

      x += t3x - tx;
      y += t3y - ty;
      t3x = tx;
      t3y = ty;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move head of vector 4")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let hx = 6, hy = -2;
      await components['/v4'].moveVector({ headcoords: [hx, hy] });

      x = hy - t4y;
      y = hx - t4x;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });

    cy.log("move tail of vector 4")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tx = 7, ty = 2;
      await components['/v4'].moveVector({ tailcoords: [tx, ty] });

      x += t4y - ty;
      y += t4x - tx;
      t4x = tx;
      t4y = ty;

      expect(components['/v1'].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v1'].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v1'].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v2'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t1x, t1y]);
      expect(components['/v2'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t1x + x, t1y + y]);
      expect(components['/v2'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v3'].replacements[0].stateValues.tail.map(x => x.tree)).eqls([t3x, t3y]);
      expect(components['/v3'].replacements[0].stateValues.head.map(x => x.tree)).eqls([t3x + x, t3y + y]);
      expect(components['/v3'].replacements[0].stateValues.displacement.map(x => x.tree)).eqls([x, y]);

      expect(components['/v4'].stateValues.tail.map(x => x.tree)).eqls([t4x, t4y]);
      expect(components['/v4'].stateValues.head.map(x => x.tree)).eqls([t4x + y, t4y + x]);
      expect(components['/v4'].stateValues.displacement.map(x => x.tree)).eqls([y, x]);

    });


  })

  it('combining components of head and tail through copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector name="v" tail="(1,2)" head="(-2,3)" />
  <copy prop="head" name="vh" target="v" />
  <copy prop="tail" name="vt" target="v" />
  <point name="c" x="$(vh{prop='x'})" y="$(vt{prop='y'})"/>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tx = 1, ty = 2, hx = -2, hy = 3;

    cy.log("initial positions")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([tx, ty]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([hx, hy]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([hx - tx, hy - ty]);

      expect(components['/vt'].replacements[0].stateValues.coords.tree).eqls(["vector", tx, ty]);
      expect(components['/vh'].replacements[0].stateValues.coords.tree).eqls(["vector", hx, hy]);
      expect(components['/c'].stateValues.coords.tree).eqls(["vector", hx, ty]);

    });

    cy.log("move vector 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      tx = 3, ty = -1, hx = -4, hy = 7;

      await components['/v'].moveVector({ headcoords: [hx, hy], tailcoords: [tx, ty] });

      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([tx, ty]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([hx, hy]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([hx - tx, hy - ty]);

      expect(components['/vt'].replacements[0].stateValues.coords.tree).eqls(["vector", tx, ty]);
      expect(components['/vh'].replacements[0].stateValues.coords.tree).eqls(["vector", hx, hy]);
      expect(components['/c'].stateValues.coords.tree).eqls(["vector", hx, ty]);

    });


    cy.log("move head point")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      hx = 2, hy = 9;

      await components['/vh'].replacements[0].movePoint({ x: hx, y: hy });

      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([tx, ty]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([hx, hy]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([hx - tx, hy - ty]);

      expect(components['/vt'].replacements[0].stateValues.coords.tree).eqls(["vector", tx, ty]);
      expect(components['/vh'].replacements[0].stateValues.coords.tree).eqls(["vector", hx, hy]);
      expect(components['/c'].stateValues.coords.tree).eqls(["vector", hx, ty]);

    });


    cy.log("move tail point")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      tx = -3, ty = 10;

      await components['/vt'].replacements[0].movePoint({ x: tx, y: ty });

      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([tx, ty]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([hx, hy]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([hx - tx, hy - ty]);

      expect(components['/vt'].replacements[0].stateValues.coords.tree).eqls(["vector", tx, ty]);
      expect(components['/vh'].replacements[0].stateValues.coords.tree).eqls(["vector", hx, hy]);
      expect(components['/c'].stateValues.coords.tree).eqls(["vector", hx, ty]);

    });


    cy.log("move combined point")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      hx = -6, ty = 0;

      await components['/c'].movePoint({ x: hx, y: ty });

      expect(components['/v'].stateValues.tail.map(x => x.tree)).eqls([tx, ty]);
      expect(components['/v'].stateValues.head.map(x => x.tree)).eqls([hx, hy]);
      expect(components['/v'].stateValues.displacement.map(x => x.tree)).eqls([hx - tx, hy - ty]);

      expect(components['/vt'].replacements[0].stateValues.coords.tree).eqls(["vector", tx, ty]);
      expect(components['/vh'].replacements[0].stateValues.coords.tree).eqls(["vector", hx, hy]);
      expect(components['/c'].stateValues.coords.tree).eqls(["vector", hx, ty]);

    });



  })

  it('updates depending on vector definition', () => {
    cy.window().then(async (win) => {
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
  <vector name="vt" tail="$tvt" />
  <vector name="vh" head="$hvh" />
  <vector name="vd" displacement="$dvd" />
  <vector name="vth" tail="$tvth" head="$hvth" />
  <vector name="vtd" tail="$tvtd" displacement="$dvtd" />
  <vector name="vhd" head="$hvhd" displacement="$dvhd" />
  </graph>

  <graph>
  <copy prop="tail" name="tfvt" target="vt" />
  <copy prop="head" name="hfvt" target="vt" />
  <copy prop="displacement" name="dfvt" target="vt" />

  <copy prop="tail" name="tfvh" target="vh" />
  <copy prop="head" name="hfvh" target="vh" />
  <copy prop="displacement" name="dfvh" target="vh" />

  <copy prop="tail" name="tfvd" target="vd" />
  <copy prop="head" name="hfvd" target="vd" />
  <copy prop="displacement" name="dfvd" target="vd" />

  <copy prop="tail" name="tfvth" target="vth" />
  <copy prop="head" name="hfvth" target="vth" />
  <copy prop="displacement" name="dfvth" target="vth" />

  <copy prop="tail" name="tfvtd" target="vtd" />
  <copy prop="head" name="hfvtd" target="vtd" />
  <copy prop="displacement" name="dfvtd" target="vtd" />

  <copy prop="tail" name="tfvhd" target="vhd" />
  <copy prop="head" name="hfvhd" target="vhd" />
  <copy prop="displacement" name="dfvhd" target="vhd" />

  </graph>

  <graph>
  <copy name="vt2" target="vt" />
  <copy name="vh2" target="vh" />
  <copy name="vd2" target="vd" />
  <copy name="vth2" target="vth" />
  <copy name="vtd2" target="vtd" />
  <copy name="vhd2" target="vhd" />
  </graph>

  <graph>
  <copy prop="tail" name="tfvt2" target="vt2" />
  <copy prop="head" name="hfvt2" target="vt2" />
  <copy prop="displacement" name="dfvt2" target="vt2" />

  <copy prop="tail" name="tfvh2" target="vh2" />
  <copy prop="head" name="hfvh2" target="vh2" />
  <copy prop="displacement" name="dfvh2" target="vh2" />

  <copy prop="tail" name="tfvd2" target="vd2" />
  <copy prop="head" name="hfvd2" target="vd2" />
  <copy prop="displacement" name="dfvd2" target="vd2" />

  <copy prop="tail" name="tfvth2" target="vth2" />
  <copy prop="head" name="hfvth2" target="vth2" />
  <copy prop="displacement" name="dfvth2" target="vth2" />

  <copy prop="tail" name="tfvtd2" target="vtd2" />
  <copy prop="head" name="hfvtd2" target="vtd2" />
  <copy prop="displacement" name="dfvtd2" target="vtd2" />

  <copy prop="tail" name="tfvhd2" target="vhd2" />
  <copy prop="head" name="hfvhd2" target="vhd2" />
  <copy prop="displacement" name="dfvhd2" target="vhd2" />

  </graph>

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')


    let tvt = [1, 2];
    let hvt = [2, 2];

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
    cy.window().then(async (win) => {
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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("move tail of each vector directly")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      tvt = [-3, 5];
      tvh = [9, -2];
      tvd = [0, 7];
      tvth = [-7, 4];
      tvtd = [5, -9];
      tvhd = [-1, -6];

      await components['/vt'].moveVector({ tailcoords: tvt })
      await components['/vh'].moveVector({ tailcoords: tvh })
      await components['/vd'].moveVector({ tailcoords: tvd })
      await components['/vth'].moveVector({ tailcoords: tvth })
      await components['/vtd'].moveVector({ tailcoords: tvtd })
      await components['/vhd'].moveVector({ tailcoords: tvhd })

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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("move head of each vector directly")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      hvt = [5, -1];
      hvh = [3, -6];
      hvd = [1, -9];
      hvth = [6, 2];
      hvtd = [-6, -4];
      hvhd = [-4, 8];

      await components['/vt'].moveVector({ headcoords: hvt })
      await components['/vh'].moveVector({ headcoords: hvh })
      await components['/vd'].moveVector({ headcoords: hvd })
      await components['/vth'].moveVector({ headcoords: hvth })
      await components['/vtd'].moveVector({ headcoords: hvtd })
      await components['/vhd'].moveVector({ headcoords: hvhd })

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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("move tail through defining point, if exists")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      tvt = [9, -1];
      tvth = [3, -2];
      tvtd = [-1, 5];

      await components['/tvt'].movePoint({ x: tvt[0], y: tvt[1] })
      await components['/tvth'].movePoint({ x: tvth[0], y: tvth[1] })
      await components['/tvtd'].movePoint({ x: tvtd[0], y: tvtd[1] })

      // defined by tail only or tail/head, head stays fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

      // defined by tail and displacement, displacement stays fixed and head changes
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      expect(components['/tvt'].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/tvth'].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/tvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

    });

    cy.log("move head through defining point, if exists")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      hvh = [5, 3];
      hvth = [-8, -3];
      hvhd = [7, -6];

      await components['/hvh'].movePoint({ x: hvh[0], y: hvh[1] })
      await components['/hvth'].movePoint({ x: hvth[0], y: hvth[1] })
      await components['/hvhd'].movePoint({ x: hvhd[0], y: hvhd[1] })

      // defined by head only or tail/head, tail stays fixed and displacement changes
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

      // defined by head and displacement, displacement stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      expect(components['/hvh'].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/hvth'].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/hvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("change displacement through defining point, if exists")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      dvd = [-1, -2];
      dvtd = [-6, 8];
      dvhd = [3, -7];

      await components['/dvd'].movePoint({ x: dvd[0], y: dvd[1] })
      await components['/dvtd'].movePoint({ x: dvtd[0], y: dvtd[1] })
      await components['/dvhd'].movePoint({ x: dvhd[0], y: dvhd[1] })

      // defined by displacement only or tail/displacement, tail stays fixed and head changes
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      // defined by head and displacement, head stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      expect(components['/dvd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvd]);
      expect(components['/dvtd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvtd]);
      expect(components['/dvhd'].stateValues.coords.simplify().tree).eqls(["vector", ...dvhd]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("move tail of each vector through copied point")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      tvt = [-5, 3];
      tvh = [7, 0];
      tvd = [-2, 1];
      tvth = [8, -8];
      tvtd = [6, 5];
      tvhd = [-3, 4];

      await components['/tfvt'].replacements[0].movePoint({ x: tvt[0], y: tvt[1] })
      await components['/tfvh'].replacements[0].movePoint({ x: tvh[0], y: tvh[1] })
      await components['/tfvd'].replacements[0].movePoint({ x: tvd[0], y: tvd[1] })
      await components['/tfvth'].replacements[0].movePoint({ x: tvth[0], y: tvth[1] })
      await components['/tfvtd'].replacements[0].movePoint({ x: tvtd[0], y: tvtd[1] })
      await components['/tfvhd'].replacements[0].movePoint({ x: tvhd[0], y: tvhd[1] })

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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("move head of each vector through copied point")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      hvt = [-1, -3];
      hvh = [7, -6];
      hvd = [-2, -5];
      hvth = [-3, 8];
      hvtd = [9, 1];
      hvhd = [-4, 4];

      await components['/hfvt'].replacements[0].movePoint({ x: hvt[0], y: hvt[1] })
      await components['/hfvh'].replacements[0].movePoint({ x: hvh[0], y: hvh[1] })
      await components['/hfvd'].replacements[0].movePoint({ x: hvd[0], y: hvd[1] })
      await components['/hfvth'].replacements[0].movePoint({ x: hvth[0], y: hvth[1] })
      await components['/hfvtd'].replacements[0].movePoint({ x: hvtd[0], y: hvtd[1] })
      await components['/hfvhd'].replacements[0].movePoint({ x: hvhd[0], y: hvhd[1] })

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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("change displacement of each vector through copied vectors")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      dvt = [-9, 0];
      dvh = [-3, -1];
      dvd = [-5, 5];
      dvth = [7, 3];
      dvtd = [9, -8];
      dvhd = [1, 2];

      await components['/dfvt'].replacements[0].moveVector({ headcoords: dvt });
      await components['/dfvh'].replacements[0].moveVector({ headcoords: dvh });
      await components['/dfvd'].replacements[0].moveVector({ headcoords: dvd });
      await components['/dfvth'].replacements[0].moveVector({ headcoords: dvth });
      await components['/dfvtd'].replacements[0].moveVector({ headcoords: dvtd });
      await components['/dfvhd'].replacements[0].moveVector({ headcoords: dvhd });

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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("move tail of each copied vector directly")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      tvt = [1, 8];
      tvh = [-3, 2];
      tvd = [9, -1];
      tvth = [5, -3];
      tvtd = [-4, -8];
      tvhd = [-1, 6];

      await components['/vt2'].replacements[0].moveVector({ tailcoords: tvt })
      await components['/vh2'].replacements[0].moveVector({ tailcoords: tvh })
      await components['/vd2'].replacements[0].moveVector({ tailcoords: tvd })
      await components['/vth2'].replacements[0].moveVector({ tailcoords: tvth })
      await components['/vtd2'].replacements[0].moveVector({ tailcoords: tvtd })
      await components['/vhd2'].replacements[0].moveVector({ tailcoords: tvhd })

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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("move head of each copied vector directly")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      hvt = [-7, 2];
      hvh = [-2, 9];
      hvd = [0, -3];
      hvth = [6, 1];
      hvtd = [7, 0];
      hvhd = [-8, -4];

      await components['/vt2'].replacements[0].moveVector({ headcoords: hvt })
      await components['/vh2'].replacements[0].moveVector({ headcoords: hvh })
      await components['/vd2'].replacements[0].moveVector({ headcoords: hvd })
      await components['/vth2'].replacements[0].moveVector({ headcoords: hvth })
      await components['/vtd2'].replacements[0].moveVector({ headcoords: hvtd })
      await components['/vhd2'].replacements[0].moveVector({ headcoords: hvhd })

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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("move tail of each copied vector through copied point")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      tvt = [1, -1];
      tvh = [9, -9];
      tvd = [-3, 2];
      tvth = [5, 0];
      tvtd = [-1, 7];
      tvhd = [-6, 6];

      await components['/tfvt2'].replacements[0].movePoint({ x: tvt[0], y: tvt[1] })
      await components['/tfvh2'].replacements[0].movePoint({ x: tvh[0], y: tvh[1] })
      await components['/tfvd2'].replacements[0].movePoint({ x: tvd[0], y: tvd[1] })
      await components['/tfvth2'].replacements[0].movePoint({ x: tvth[0], y: tvth[1] })
      await components['/tfvtd2'].replacements[0].movePoint({ x: tvtd[0], y: tvtd[1] })
      await components['/tfvhd2'].replacements[0].movePoint({ x: tvhd[0], y: tvhd[1] })

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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("move head of each copied vector through copied point")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      hvt = [-6, -8];
      hvh = [2, -2];
      hvd = [0, 6];
      hvth = [-5, 4];
      hvtd = [3, 8];
      hvhd = [-1, 5];

      await components['/hfvt2'].replacements[0].movePoint({ x: hvt[0], y: hvt[1] })
      await components['/hfvh2'].replacements[0].movePoint({ x: hvh[0], y: hvh[1] })
      await components['/hfvd2'].replacements[0].movePoint({ x: hvd[0], y: hvd[1] })
      await components['/hfvth2'].replacements[0].movePoint({ x: hvth[0], y: hvth[1] })
      await components['/hfvtd2'].replacements[0].movePoint({ x: hvtd[0], y: hvtd[1] })
      await components['/hfvhd2'].replacements[0].movePoint({ x: hvhd[0], y: hvhd[1] })

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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });

    cy.log("change displacement of each copied vector through copied vectors")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      dvt = [-1, 7];
      dvh = [5, 9];
      dvd = [9, 2];
      dvth = [-3, -5];
      dvtd = [9, -4];
      dvhd = [-5, 3];

      await components['/dfvt2'].replacements[0].moveVector({ headcoords: dvt });
      await components['/dfvh2'].replacements[0].moveVector({ headcoords: dvh });
      await components['/dfvd2'].replacements[0].moveVector({ headcoords: dvd });
      await components['/dfvth2'].replacements[0].moveVector({ headcoords: dvth });
      await components['/dfvtd2'].replacements[0].moveVector({ headcoords: dvtd });
      await components['/dfvhd2'].replacements[0].moveVector({ headcoords: dvhd });

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

      expect(components['/vt'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd'].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd'].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd'].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/vt2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvt]);
      expect(components['/vt2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvt]);
      expect(components['/vt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/vh2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvh]);
      expect(components['/vh2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvh]);
      expect(components['/vh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/vd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvd]);
      expect(components['/vd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvd]);
      expect(components['/vd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/vth2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvth]);
      expect(components['/vth2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvth]);
      expect(components['/vth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/vtd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvtd]);
      expect(components['/vtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/vhd2'].replacements[0].stateValues.tail.map(x => x.simplify().tree)).eqls([...tvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.head.map(x => x.simplify().tree)).eqls([...hvhd]);
      expect(components['/vhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

      expect(components['/tfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvt]);
      expect(components['/hfvt2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvt]);
      expect(components['/dfvt2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvt]);

      expect(components['/tfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvh]);
      expect(components['/hfvh2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvh]);
      expect(components['/dfvh2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvh]);

      expect(components['/tfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvd]);
      expect(components['/hfvd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvd]);
      expect(components['/dfvd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvd]);

      expect(components['/tfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvth]);
      expect(components['/hfvth2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvth]);
      expect(components['/dfvth2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvth]);

      expect(components['/tfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvtd]);
      expect(components['/hfvtd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvtd]);
      expect(components['/dfvtd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvtd]);

      expect(components['/tfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...tvhd]);
      expect(components['/hfvhd2'].replacements[0].stateValues.coords.simplify().tree).eqls(["vector", ...hvhd]);
      expect(components['/dfvhd2'].replacements[0].stateValues.displacement.map(x => x.simplify().tree)).eqls([...dvhd]);

    });


  })

  it('vector adapts to coords of displacement', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math><copy target="_vector1" /></math>
  <graph>
    <vector tail="(1,2)" head="(3,5)" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,3)')
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([2, 3]);
      expect(components['/_math1'].stateValues.value.tree).eqls(["vector", 2, 3]);
    })

    cy.log("move vector head");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_vector1'].moveVector({ headcoords: [9, 7] })
      expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([8, 5]);
      expect(components['/_math1'].stateValues.value.tree).eqls(["vector", 8, 5]);
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(8,5)')
    })


    cy.log("move vector head");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_vector1'].moveVector({ tailcoords: [-2, 6] })
      expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([11, 1]);
      expect(components['/_math1'].stateValues.value.tree).eqls(["vector", 11, 1]);
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(11,1)')
    })


  });

  it('three vectors with mutual references', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector head="$(_vector2{prop='head'})" tail="(1,0)" />
  <vector tail="$(_vector3{prop='tail'})" head="(3,2)" />
  <vector head="$(_vector1{prop='tail'})" tail="(-1,4)" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let x1 = 1, y1 = 0;
    let x2 = 3, y2 = 2;
    let x3 = -1, y3 = 4;

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector2'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector2'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector3'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector3'].stateValues.head.map(x => x.tree)).eqls([x1, y1]);

    })

    cy.log("move head of vector 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      x2 = 7;
      y2 = -3;
      let head1 = components["/_vector1"].attributes.head.component;
      await head1.movePoint({ x: x2, y: y2 });
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector2'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector2'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector3'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector3'].stateValues.head.map(x => x.tree)).eqls([x1, y1]);

    })

    cy.log("move tail of vector 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      x1 = -1;
      y1 = -4;
      let tail1 = components["/_vector1"].attributes.tail.component;
      await tail1.movePoint({ x: x1, y: y1 });
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector2'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector2'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector3'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector3'].stateValues.head.map(x => x.tree)).eqls([x1, y1]);

    })

    cy.log("move tail of vector 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      x3 = 9;
      y3 = -8;
      let tail2 = components["/_vector2"].attributes.tail.component;
      await tail2.movePoint({ x: x3, y: y3 });
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector2'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector2'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector3'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector3'].stateValues.head.map(x => x.tree)).eqls([x1, y1]);

    })

    cy.log("move head of vector 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      x2 = 3;
      y2 = 2;
      let head2 = components["/_vector2"].attributes.head.component;
      await head2.movePoint({ x: x2, y: y2 });
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector2'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector2'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector3'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector3'].stateValues.head.map(x => x.tree)).eqls([x1, y1]);

    })

    cy.log("move head of vector 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      x1 = -5;
      y1 = 8;
      let head3 = components["/_vector3"].attributes.head.component;
      await head3.movePoint({ x: x1, y: y1 });
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector2'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector2'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector3'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector3'].stateValues.head.map(x => x.tree)).eqls([x1, y1]);

    })

    cy.log("move tail of vector 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      x3 = 0;
      y3 = -5;
      let tail3 = components["/_vector3"].attributes.tail.component;
      await tail3.movePoint({ x: x3, y: y3 });
      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector2'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector2'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_vector3'].stateValues.tail.map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_vector3'].stateValues.head.map(x => x.tree)).eqls([x1, y1]);

    })

  })

  it('copy two components of vector', () => {
    // checking bug where second component wasn't updating
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <vector tail="(3, $b)" head="($a,4)" />

  <copy prop="x" target="_vector1" />
  <copy prop="y" target="_vector1" />
  
  <p><mathinput name="a" prefill="1"></mathinput></p>
  <p><mathinput name="b" prefill="2"></mathinput></p>
  
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = components['/_copy1'].replacements[0];
      let xAnchor = cesc('#' + x.componentName);
      let y = components['/_copy2'].replacements[0];
      let yAnchor = cesc('#' + y.componentName);


      let a = 1;
      let b = 2;
      let dx = a - 3;
      let dy = 4 - b;

      cy.log('Test values displayed in browser')
      cy.get(xAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`${dx}`)
      });

      cy.get(yAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`${dy}`)
      });

      cy.get('#\\/_vector1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`(${dx},${dy})`)
      });


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([3, b]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([a, 4]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([dx, dy]);
        expect(x.stateValues.value.tree).eq(dx)
        expect(y.stateValues.value.tree).eq(dy)
      })

      cy.log("changed values");

      let a2 = -5;
      let b2 = 7;
      let dx2 = a2 - 3;
      let dy2 = 4 - b2;

      cy.get('#\\/a textarea').type(`{end}{backspace}${a2}`, { force: true });
      cy.get('#\\/b textarea').type(`{end}{backspace}${b2}`, { force: true }).blur();

      cy.get(xAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`${dx2}`)
      });

      cy.get(yAnchor + ' .mjx-mrow').should('contain.text', `${dy2}`.replace(/-/g, '−'))
      cy.get(yAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`${dy2}`)
      });

      cy.get('#\\/_vector1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal(`(${dx2},${dy2})`)
      });


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([3, b2]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([a2, 4]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([dx2, dy2]);
        expect(x.stateValues.value.tree).eq(dx2)
        expect(y.stateValues.value.tree).eq(dy2)
      })


    })
  })

  it('vector with displacement and tail, move just tail', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector displacement="(-8,1)" tail="(4,1)" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tailx = 4;
      let taily = 1;
      let headx = -4;
      let heady = 2;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

    })

    cy.log(`move tail, make sure head doesn't move`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tailx = -3;
      let taily = 7;
      let headx = -4;
      let heady = 2;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      await components['/_vector1'].moveVector({
        tailcoords: [tailx, taily],
      });

      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
    })


  })

  it('vector with displacement and head, move just head', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector displacement="(-8,1)" head="(-4,2)" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tailx = 4;
      let taily = 1;
      let headx = -4;
      let heady = 2;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

    })

    cy.log(`move tail, make sure head doesn't move`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tailx = 4;
      let taily = 1;
      let headx = 3;
      let heady = 5;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      await components['/_vector1'].moveVector({
        headcoords: [headx, heady],
      });

      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
    })


  })

  it('vector with displacement, move just tail', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector displacement="(-8,1)" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tailx = 0;
      let taily = 0;
      let headx = -8;
      let heady = 1;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

    })

    cy.log(`move tail, make sure head doesn't move`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let tailx = -3;
      let taily = 7;
      let headx = -8;
      let heady = 1;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      await components['/_vector1'].moveVector({
        tailcoords: [tailx, taily],
      });

      expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
      expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
      expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
    })


  })

  it('point inside vector overrides displacement', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector displacement="(9, 10)" ><point>(-4,2)</point></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector inside vector overrides displacement', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector displacement="(9, 10)" ><vector>(-4,2)</vector></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('point inside vector overrides xs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector xs="9 10" ><point>(-4,2)</point></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector inside vector overrides xs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector xs="9 10" ><vector>(-4,2)</vector></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('displacement overrides xs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector xs="9 10" displacement="(-4,2)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('point inside vector overrides x and y', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector x="9" y="10" ><point>(-4,2)</point></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('vector inside vector overrides x and y', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector x="9" y="10" ><vector>(-4,2)</vector></vector>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('displacement overrides x and y', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector x="9" y="10" displacement="(-4,2)" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('xs overrides x and y', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector x="9" y="10" xs="-4 2" />
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" />
  <copy prop="head" target="_vector1" />
  <copy prop="displacement" target="_vector1" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let tail = components['/_copy1'].replacements[0];
      let head = components['/_copy2'].replacements[0];
      let displacement = components['/_copy3'].replacements[0];

      cy.window().then(async (win) => {
        let tailx = 0;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);

      })

      cy.log('move vector up and to the right')
      cy.window().then(async (win) => {

        let tailcoords = [
          components['/_vector1'].stateValues.tail[0],
          components['/_vector1'].stateValues.tail[1],
        ];
        let headcoords = [
          components['/_vector1'].stateValues.head[0],
          components['/_vector1'].stateValues.head[1],
        ];

        let moveX = 3;
        let moveY = 2;

        tailcoords[0] = tailcoords[0].add(moveX).simplify();
        tailcoords[1] = tailcoords[1].add(moveY).simplify();
        headcoords[0] = headcoords[0].add(moveX).simplify();
        headcoords[1] = headcoords[1].add(moveY).simplify();

        await components['/_vector1'].moveVector({
          tailcoords: tailcoords,
          headcoords: headcoords
        });

        let tailx = tailcoords[0].simplify().tree;
        let taily = tailcoords[1].simplify().tree;
        let headx = headcoords[0].simplify().tree;
        let heady = headcoords[1].simplify().tree;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied tail moves vector')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let headx = -3;
        let heady = 8;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await tail.movePoint({ x: tailx, y: taily });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move copied head')
      cy.window().then(async (win) => {


        let tailx = 1;
        let taily = 6;
        let headx = 4;
        let heady = -9;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        await head.movePoint({ x: headx, y: heady });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([0, 0]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })

      cy.log('move displacement')
      cy.window().then(async (win) => {

        let tailx = 1;
        let taily = 6;
        let displacementtailx = 3;
        let displacementtaily = -5;
        let displacementheadx = 6;
        let displacementheady = -9;
        let displacementx = displacementheadx - displacementtailx;
        let displacementy = displacementheady - displacementtaily;

        let headx = tailx + displacementx;
        let heady = taily + displacementy;

        await displacement.moveVector({
          tailcoords: [displacementtailx, displacementtaily],
          headcoords: [displacementheadx, displacementheady]
        });

        expect(components['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([tailx, taily]);
        expect(components['/_vector1'].stateValues.head.map(x => x.tree)).eqls([headx, heady]);
        expect(components['/_vector1'].stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
        expect(tail.stateValues.xs[0].tree).eq(tailx);
        expect(tail.stateValues.xs[1].tree).eq(taily);
        expect(head.stateValues.xs[0].tree).eq(headx);
        expect(head.stateValues.xs[1].tree).eq(heady);
        expect(displacement.stateValues.tail.map(x => x.tree)).eqls([displacementtailx, displacementtaily]);
        expect(displacement.stateValues.head.map(x => x.tree)).eqls([displacementheadx, displacementheady]);
        expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([displacementx, displacementy]);
      })
    })
  })

  it('1D vector', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <vector>1</vector>

  <copy prop="tail" target="_vector1" assignNames="t" />
  <copy prop="head" target="_vector1" assignNames="h"/>
  <copy prop="displacement" target="_vector1" assignNames="d" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_vector1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/t').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/h').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/_vector1"].stateValues.head.map(x => x.tree)).eqls([1])
      expect(components["/_vector1"].stateValues.tail.map(x => x.tree)).eqls([0])
      expect(components["/_vector1"].stateValues.displacement.map(x => x.tree)).eqls([1])

      expect(components["/h"].stateValues.xs.map(x => x.tree)).eqls([1])
      expect(components["/t"].stateValues.xs.map(x => x.tree)).eqls([0])
      expect(components["/d"].stateValues.displacement.map(x => x.tree)).eqls([1])

    })
  })

  it('mutual dependence among entire head, tail, displacement', () => {
    // this could be made more interesting once have operations on vectors
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <vector name="v1" head="$(v1{prop='tail'})" tail="(3,4)" />
  </graph>

  <graph>
    <vector name="v2" head="$(v2{prop='displacement'})" displacement="(3,4)" />
  </graph>

  <graph>
    <vector name="v3" tail="$(v3{prop='head'})" head="(3,4)" />
  </graph>

  <graph>
    <vector name="v4" tail="$(v4{prop='displacement'})" displacement="(3,4)" />
  </graph>

  <graph>
    <vector name="v5" displacement="$(v5{prop='head'})" head="(3,4)" />
  </graph>

  <graph>
    <vector name="v6" displacement="$(v6{prop='tail'})" tail="(3,4)" />
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/v1"].stateValues.head.map(x => x.tree)).eqls([3, 4])
      expect(components["/v1"].stateValues.tail.map(x => x.tree)).eqls([3, 4])
      expect(components["/v1"].stateValues.displacement.map(x => x.tree)).eqls([0, 0])

      expect(components["/v2"].stateValues.head.map(x => x.tree)).eqls([3, 4])
      expect(components["/v2"].stateValues.tail.map(x => x.tree)).eqls([0, 0])
      expect(components["/v2"].stateValues.displacement.map(x => x.tree)).eqls([3, 4])

      expect(components["/v3"].stateValues.head.map(x => x.tree)).eqls([3, 4])
      expect(components["/v3"].stateValues.tail.map(x => x.tree)).eqls([3, 4])
      expect(components["/v3"].stateValues.displacement.map(x => x.tree)).eqls([0, 0])

      expect(components["/v4"].stateValues.head.map(x => x.tree)).eqls([6, 8])
      expect(components["/v4"].stateValues.tail.map(x => x.tree)).eqls([3, 4])
      expect(components["/v4"].stateValues.displacement.map(x => x.tree)).eqls([3, 4])

      expect(components["/v5"].stateValues.head.map(x => x.tree)).eqls([3, 4])
      expect(components["/v5"].stateValues.tail.map(x => x.tree)).eqls([0, 0])
      expect(components["/v5"].stateValues.displacement.map(x => x.tree)).eqls([3, 4])

      expect(components["/v6"].stateValues.head.map(x => x.tree)).eqls([6, 8])
      expect(components["/v6"].stateValues.tail.map(x => x.tree)).eqls([3, 4])
      expect(components["/v6"].stateValues.displacement.map(x => x.tree)).eqls([3, 4])

    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/v1"].moveVector({ headcoords: [1, 2] })
      expect(components["/v1"].stateValues.head.map(x => x.tree)).eqls([1, 2])
      expect(components["/v1"].stateValues.tail.map(x => x.tree)).eqls([1, 2])
      expect(components["/v1"].stateValues.displacement.map(x => x.tree)).eqls([0, 0])

      await components["/v1"].moveVector({ tailcoords: [-4, 5] })
      expect(components["/v1"].stateValues.head.map(x => x.tree)).eqls([-4, 5])
      expect(components["/v1"].stateValues.tail.map(x => x.tree)).eqls([-4, 5])
      expect(components["/v1"].stateValues.displacement.map(x => x.tree)).eqls([0, 0])

      await components["/v3"].moveVector({ headcoords: [1, 2] })
      expect(components["/v3"].stateValues.head.map(x => x.tree)).eqls([1, 2])
      expect(components["/v3"].stateValues.tail.map(x => x.tree)).eqls([1, 2])
      expect(components["/v3"].stateValues.displacement.map(x => x.tree)).eqls([0, 0])

      await components["/v3"].moveVector({ tailcoords: [-4, 5] })
      expect(components["/v3"].stateValues.head.map(x => x.tree)).eqls([-4, 5])
      expect(components["/v3"].stateValues.tail.map(x => x.tree)).eqls([-4, 5])
      expect(components["/v3"].stateValues.displacement.map(x => x.tree)).eqls([0, 0])

    });


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/v2"].moveVector({ headcoords: [1, 2] })
      expect(components["/v2"].stateValues.head.map(x => x.tree)).eqls([1, 2])
      expect(components["/v2"].stateValues.tail.map(x => x.tree)).eqls([0, 0])
      expect(components["/v2"].stateValues.displacement.map(x => x.tree)).eqls([1, 2])

      await components["/v2"].moveVector({ tailcoords: [5, 7] })
      expect(components["/v2"].stateValues.head.map(x => x.tree)).eqls([-4, -5])
      expect(components["/v2"].stateValues.tail.map(x => x.tree)).eqls([0, 0])
      expect(components["/v2"].stateValues.displacement.map(x => x.tree)).eqls([-4, -5])

      await components["/v5"].moveVector({ headcoords: [1, 2] })
      expect(components["/v5"].stateValues.head.map(x => x.tree)).eqls([1, 2])
      expect(components["/v5"].stateValues.tail.map(x => x.tree)).eqls([0, 0])
      expect(components["/v5"].stateValues.displacement.map(x => x.tree)).eqls([1, 2])

      await components["/v5"].moveVector({ tailcoords: [5, 7] })
      expect(components["/v5"].stateValues.head.map(x => x.tree)).eqls([-4, -5])
      expect(components["/v5"].stateValues.tail.map(x => x.tree)).eqls([0, 0])
      expect(components["/v5"].stateValues.displacement.map(x => x.tree)).eqls([-4, -5])

    });


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/v4"].moveVector({ headcoords: [-1, 1] })
      expect(components["/v4"].stateValues.head.map(x => x.tree)).eqls([-8, -6])
      expect(components["/v4"].stateValues.tail.map(x => x.tree)).eqls([-4, -3])
      expect(components["/v4"].stateValues.displacement.map(x => x.tree)).eqls([-4, -3])

      await components["/v4"].moveVector({ tailcoords: [-10, -2] })
      // since based on tail and displacement
      // Vector sets displacement to try to keep head in the same place
      expect(components["/v4"].stateValues.head.map(x => x.tree)).eqls([4, -8])
      expect(components["/v4"].stateValues.tail.map(x => x.tree)).eqls([2, -4])
      expect(components["/v4"].stateValues.displacement.map(x => x.tree)).eqls([2, -4])

      await components["/v6"].moveVector({ headcoords: [-1, 1] })
      expect(components["/v6"].stateValues.head.map(x => x.tree)).eqls([-8, -6])
      expect(components["/v6"].stateValues.tail.map(x => x.tree)).eqls([-4, -3])
      expect(components["/v6"].stateValues.displacement.map(x => x.tree)).eqls([-4, -3])

      await components["/v6"].moveVector({ tailcoords: [-10, -2] })
      // since based on tail and displacement
      // Vector sets displacement to try to keep head in the same place
      expect(components["/v6"].stateValues.head.map(x => x.tree)).eqls([4, -8])
      expect(components["/v6"].stateValues.tail.map(x => x.tree)).eqls([2, -4])
      expect(components["/v6"].stateValues.displacement.map(x => x.tree)).eqls([2, -4])

    });

  })

});