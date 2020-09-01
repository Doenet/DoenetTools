describe('Curve Tag Bezier Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('sugared points, no controls specified', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      (1,2),(3,4),(-5,6),(2,1)
    </curve>
    </graph>
    
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(0)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [2, 1]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 + 2, 2 + 1]);
    });

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 + 2, -4 + 1]);
    });

    cy.log('move symmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(1)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -4, 2]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 + 2, -4 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 - 4, 4 + 2]);
    });
  })

  it('through points, no controls specified', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,1)</through>
    </curve>
    </graph>
    
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(0)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [2, 1]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 + 2, 2 + 1]);
    });

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 + 2, -4 + 1]);
    });

    cy.log('move symmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(1)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -4, 2]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 + 2, -4 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 - 4, 4 + 2]);
    });
  })

  it('sugared symmetric controls', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,1)</through>
      <beziercontrols>(3,1),(-1,5),(5,3),(0,0)</beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 2 * 3 + 1, 2 * 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 2 * -5 - 5, 2 * 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3 - 1, 1 - 2]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, -1]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [3, 1]
      })

      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 + 3, 2 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 2 * 3 + 1, 2 * 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 2 * -5 - 5, 2 * 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, -1]);
    });

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 + 3, -4 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 2 * 3 + 1, 2 * 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 2 * -5 - 5, 2 * 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, -1]);
    });

    cy.log('move symmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 + 3, -4 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 - 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 2 * -5 - 5, 2 * 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, -1]);
    });

  })

  it('sugared asymmetric controls', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,1)</through>
      <beziercontrols>(3,1),((-1,5),(4,2)),((5,3),(7,-1)),(0,0)</beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3 - 1, 1 - 2]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7 + 5, -1 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [3, 1]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 3 + 1, 1 + 2]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7 + 5, -1 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    })

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 3 - 3, 1 - 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7 + 5, -1 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    })

    cy.log('move asymmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 3 - 3, 1 - 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7 + 5, -1 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    })

  })

  it('sugared symmetric vector controls', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,1)</through>
      <beziercontrols defaultcontrols="vector">(3,1),(-1,5),(5,3),(0,0)</beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 + 3, 2 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 1, -5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5, -3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [-2, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 - 2, 2 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 1, -5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5, -3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 - 2, -4 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 1, -5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5, -3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move symmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 - 2, -4 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 - 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5, -3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

  })

  it('sugared asymmetric vector controls', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,1)</through>
      <beziercontrols defaultcontrols="vector">(3,1),((-1,5),(4,2)),((5,3),(7,-1)),(0,0)</beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 + 3, 2 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [-2, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 - 2, 2 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 - 2, -4 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move asymmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 - 2, -4 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

  })

  it('symmetric controls', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,1)</through>
      <beziercontrols>
        <point>(3,1)</point>
        <point>(-1,5)</point>
        <controlPoints>(5,3)</controlPoints>
        <point>(0,0)</point>
      </beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 2 * 3 + 1, 2 * 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 2 * -5 - 5, 2 * 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3 - 1, 1 - 2]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, -1]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [3, 1]
      })

      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 + 3, 2 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 2 * 3 + 1, 2 * 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 2 * -5 - 5, 2 * 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, -1]);
    });

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 + 3, -4 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 2 * 3 + 1, 2 * 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 2 * -5 - 5, 2 * 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, -1]);
    });

    cy.log('move symmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 + 3, -4 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 - 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 2 * -5 - 5, 2 * 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, -1]);
    });

  })

  it('asymmetric controls', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,1)</through>
      <beziercontrols>
        <point>(3,1)</point>
        <controlPoints>(-1,5),(4,2)</controlPoints>
        <controlPoints><point>(5,3)</point><point>(7,-1)</point></controlPoints>
        <controlPoints>(0,0)</controlPoints>
      </beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3 - 1, 1 - 2]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7 + 5, -1 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [3, 1]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 3 + 1, 1 + 2]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7 + 5, -1 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    })

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 3 - 3, 1 - 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7 + 5, -1 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    })

    cy.log('move asymmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 3 - 3, 1 - 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5 + 5, 3 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7 + 5, -1 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    })

  })

  it('symmetric vector controls', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,1)</through>
      <beziercontrols>
        <vector>(3,1)</vector>
        <controlVectors>(-1,5)</controlVectors>
        <vector>(5,3)</vector>
        <vector>(0,0)</vector>
      </beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 + 3, 2 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 1, -5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5, -3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [-2, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 - 2, 2 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 1, -5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5, -3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 - 2, -4 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 1, 4 - 5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 1, -5]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5, -3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move symmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 - 2, -4 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 - 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 - 5, 6 - 3]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5, -3]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

  })

  it('asymmetric vector controls', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,1)</through>
      <beziercontrols>
        <controlVectors>(3,1)</controlVectors>
        <controlVectors><vector>(-1,5)</vector><vector>(4,2)</vector></controlVectors>
        <controlVectors>(5,3),(7,-1)</controlVectors>
        <vector>(0,0)</vector>
      </beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 + 3, 2 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [-2, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 - 2, 2 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 - 2, -4 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 - 1, 4 + 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

    cy.log('move asymmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 - 2, -4 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3 + 4, 4 + 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0, 0]);
    });

  })

  it('mix point and vector controls', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,1)</through>
      <beziercontrols>
        <controlVectors>(3,1)</controlVectors>
        <controlPoints><point>(-1,5)</point><point>(4,2)</point></controlPoints>
        <controlVectors>(5,3),(7,-1)</controlVectors>
        <point>(0,0)</point>
      </beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 + 3, 2 + 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [-2, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1 - 2, 2 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    });

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: [-3, -4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 - 2, -4 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -1, 5]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -1 - 3, 5 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    });

    cy.log('move asymmetric control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [4, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", -3 - 2, -4 + 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3 + 4, 4 - 2]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 4, 2]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5 + 5, 6 + 3]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -5 + 7, 6 - 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", -2, 4]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 4, -2]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4 - 3, 2 - 4]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, 3]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -1]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 0 - 2, 0 - 1]);
    });

  })

  it.skip('constrain through points to grid', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point constrainToGrid>(1,2)</point>
    <point constrainToGrid>(3,4)</point>
    <point constrainToGrid>(-5,6)</point>
    <point constrainToGrid>(2,1)</point>
      
    <curve>
      <copy tname="_point1" />
      <copy tname="_point2" />
      <copy tname="_point3" />
      <copy tname="_point4" />
      <beziercontrols>
        (7,8),(3,1),((4,1),(0,0)),(-1,-2)
      </beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 7, 8]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 2 * 3 - 3, 2 * 4 - 1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 4, 1]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", -1, -2]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 7 - 1, 8 - 2]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 3 - 3, 1 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -(3 - 3), -(1 - 4)]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 4 + 5, 1 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 0 + 5, 0 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -1 - 2, -2 - 1]);
    });

    cy.log('move through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: [1.1, 8.7]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 1, 9]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 7, 8]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 1, 9 - 3]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 1, 9 + 3]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 4, 1]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", -1, -2]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 7 - 1, 8 - 2]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 3 - 3, 1 - 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -(3 - 3), -(1 - 4)]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 4 + 5, 1 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 0 + 5, 0 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -1 - 2, -2 - 1]);
    });

    cy.log('move control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2,
        controlvector: [-1.25, 2.75]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 1, 9]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 7, 8]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 1 + 1.25, 9 - 2.75]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 1 - 1.25, 9 + 2.75]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 4, 1]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", -1, -2]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 7 - 1, 8 - 2]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 1.25, -2.75]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -1.25, 2.75]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 4 + 5, 1 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 0 + 5, 0 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -1 - 2, -2 - 1]);
    });

    cy.log('move original point determining through point')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point3'].movePoint({ x: -3.2, y: 4.9 })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 1, 9]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -3, 5]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 7, 8]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 1 + 1.25, 9 - 2.75]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 1 - 1.25, 9 + 2.75]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -3 + 9, 5 - 5]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", -3 + 5, 5 - 6]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", -1, -2]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 7 - 1, 8 - 2]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 1.25, -2.75]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -1.25, 2.75]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 4 + 5, 1 - 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 0 + 5, 0 - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -1 - 2, -2 - 1]);
    });

  })

  it.skip('constrain control points to grid', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point constrainToGrid>(1,2)</point>
    <point constrainToGrid>(3,4)</point>
    <point constrainToGrid>(-5,6)</point>
    <point constrainToGrid>(0,2)</point>
    <point constrainToGrid>(2,1)</point>
      
    <curve>
      (7,8),(3,1),(0,0),(-1,-2)
      <beziercontrols>
      <copy tname="_point1" />
      <copy tname="_point2" />
      <controlPoints>
        <copy tname="_point3" />
        <copy tname="_point4" />
      </controlPoints>
      <copy tname="_point5" />
      </beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 7, 8]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", 0, 0]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", -1, -2]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 2 * 3 - 3, 2 * 1 - 4]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 0, 2]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 1 - 7, 2 - 8]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 3 - 3, 4 - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -(3 - 3), -(4 - 1)]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 0, 2]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 2 + 1, 1 + 2]);
      expect(components['/_point1'].state.coords.tree).eqls(["tuple", 1, 2]);
      expect(components['/_point2'].state.coords.tree).eqls(["tuple", 3, 4]);
      expect(components['/_point3'].state.coords.tree).eqls(["tuple", -5, 6]);
      expect(components['/_point4'].state.coords.tree).eqls(["tuple", 0, 2]);
      expect(components['/_point5'].state.coords.tree).eqls(["tuple", 2, 1]);
    });

    cy.log(`move through points and control points aren't constrained`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: [-3.75, 5.25]
      })
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: [1.25, 8.75]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 7, 8]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", -3.75, 5.25]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", 1.25, 8.75]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", -1, -2]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -3.75, 5.25 + 3]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", -3.75, 5.25 - 3]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 1.25 - 5, 8.75 + 6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 1.25 + 0, 8.75 + 2]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 1 - 7, 2 - 8]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 3 - 3, 4 - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -(3 - 3), -(4 - 1)]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 0, 2]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 2 + 1, 1 + 2]);
      expect(components['/_point1'].state.coords.tree).eqls(["tuple", 1, 2]);
      expect(components['/_point2'].state.coords.tree).eqls(["tuple", -4, 8]);
      expect(components['/_point3'].state.coords.tree).eqls(["tuple", 1 - 5, 9 + 6]);
      expect(components['/_point4'].state.coords.tree).eqls(["tuple", 1 + 0, 9 + 2]);
      expect(components['/_point5'].state.coords.tree).eqls(["tuple", 2, 1]);
    });

    cy.log(`move control points or original points deterimining control points`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2,
        controlvector: [7.3, -2.9]
      })
      components['/_point4'].movePoint({ x: 5.4, y: 0.7 });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 7, 8]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", -3.75, 5.25]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", 1.25, 8.75]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", -1, -2]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", -11, 8]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", 3.5, 2.5]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", 1.25 - 5, 8.75 + 6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", 5, 1]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 1 - 7, 2 - 8]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -7.25, 2.75]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 7.25, -2.75]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 5 - 1.25, 1 - 8.75]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", 2 + 1, 1 + 2]);
      expect(components['/_point1'].state.coords.tree).eqls(["tuple", 1, 2]);
      expect(components['/_point2'].state.coords.tree).eqls(["tuple", -11, 8]);
      expect(components['/_point3'].state.coords.tree).eqls(["tuple", 1 - 5, 9 + 6]);
      expect(components['/_point4'].state.coords.tree).eqls(["tuple", 5, 1]);
      expect(components['/_point5'].state.coords.tree).eqls(["tuple", 2, 1]);
    });
  })

  it('constrain control points to angles', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,-3)</through>
      <beziercontrols>
        <controlVectors>(3,1)</controlVectors>
        <controlPoints><point>(-1,5)</point><point>(4,2)</point></controlPoints>
        <controlVectors>(5,-6)</controlVectors>
        <point>(0,0)</point>
      </beziercontrols>
      <constrainToAngles>
      0, pi/2, pi, 3pi/2
      </constrainToAngles>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, -3]);
      expect(components['/_curve1'].state.controlvectors[0].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[0].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[1].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[1].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[2].tree[1]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[2].tree[2]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[1]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[3].tree[2]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[4].tree[1]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[4].tree[2]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[5].tree[1]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[5].tree[2]).greaterThan(0);
    });

    cy.log('move control vectors')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: [7, -6]
      })
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2,
        controlvector: [-6, -5]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, -3]);
      expect(components['/_curve1'].state.controlvectors[0].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[0].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[1].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[1].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[2].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[2].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[3].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[4].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[4].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[5].tree[1]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[5].tree[2]).greaterThan(0);
    });

  })

  it('attract control points to angles', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,-3)</through>
      <beziercontrols>
        <controlVectors>(3,1)</controlVectors>
        <controlPoints><point>(-1,5)</point><point>(4,2)</point></controlPoints>
        <controlVectors>(5,-6)</controlVectors>
        <point>(0,0)</point>
      </beziercontrols>
      <attractToAngles>
      0, pi/2, pi, 3pi/2
      </attractToAngles>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, -3]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -4, 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 1, -2]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, -6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, 3]);

    });

    cy.log('move control vector close to angles')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: [7, 0.2]
      })
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2,
        controlvector: [0.1, -6]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, -3]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -4, 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree[1]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[2].tree[2]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[4].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[4].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, 3]);
    });

  })

  it('attract symmetric control points to asymmetric angles', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>
      <through>(1,2),(3,4),(-5,6),(2,-3)</through>
      <beziercontrols>
        <controlVectors>(3,1)</controlVectors>
        <controlPoints><point>(-1,5)</point></controlPoints>
        <controlVectors>(5,-6)</controlVectors>
        <point>(0,0)</point>
      </beziercontrols>
      <attractToAngles>
      0, pi/2
      </attractToAngles>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, -3]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -4, 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 4, -1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 5, -6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, 3]);

    });

    cy.log('move control vectors close to angles')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: [7, 0.125]
      })
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2,
        controlvector: [0.125, -6]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, -3]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree[1]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[1].tree[2]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[2].tree[1]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[2].tree[2]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[4].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[4].tree[2]).closeTo(0, 1E-12);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, 3]);
    });

    cy.log('move control vectors opposite sides')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: [-7, 0.125]
      })
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2,
        controlvector: [0.125, 6]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(["tuple", -5, 6]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(["tuple", 2, -3]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 3, 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -0.125, -6]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 0.125, 6]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", -7, 0.125]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", 7, -0.125]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -2, 3]);
    });

  })

  it('unspecified controls change with point', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>(-3,-4),(0,0),(6,5)</curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.controlvectors[0].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[0].tree[2]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[1].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[1].tree[2]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[2].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[2].tree[2]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[2]).lessThan(0);

    });

    cy.log("move points to opposite sides")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_curve1'].moveThroughpoint({
        throughpoint: [8, 4],
        throughpointInd: 0,
      })
      components['/_curve1'].moveThroughpoint({
        throughpoint: [-2, -7],
        throughpointInd: 2,
      })

      expect(components['/_curve1'].state.controlvectors[0].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[0].tree[2]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[1].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[1].tree[2]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[2].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[2].tree[2]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[2]).greaterThan(0);

    });


    cy.log("mark as controlled and move again")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/_curve1'].togglePointControl(0);
      components['/_curve1'].togglePointControl(1);
      components['/_curve1'].togglePointControl(2);

      components['/_curve1'].moveThroughpoint({
        throughpoint: [-3, -4],
        throughpointInd: 0,
      })
      components['/_curve1'].moveThroughpoint({
        throughpoint: [6, 5],
        throughpointInd: 2,
      })

      expect(components['/_curve1'].state.controlvectors[0].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[0].tree[2]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[1].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[1].tree[2]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[2].tree[1]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[2].tree[2]).lessThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[1]).greaterThan(0);
      expect(components['/_curve1'].state.controlvectors[3].tree[2]).greaterThan(0);

    });

  })

  it('new curve from reffed control vectors, some flipped', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>(-9,6),(-3,7),(4,0),(8,5)
    <beziercontrols>
      <vector>(3,1)</vector>
      <vector>(5,-6)</vector>
      <controlVectors>(3,2),(-1,5)</controlVectors>
      <vector>(1,4)</vector>
    </beziercontrols>
    </curve>
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
      <beziercontrols>
        <copy prop="controlvector1" tname="_curve1" />
        <vector>
          <head>
            <x>
              <extract prop="y"><copy prop="controlvector2" tname="_curve1" /></extract>
            </x>
            <y>
              <extract prop="x"><copy prop="controlvector2" tname="_curve1" /></extract>
            </y>
          </head>
        </vector>
        <controlVectors>
          <copy prop="controlvector4" tname="_curve1" />
          <vector>
            <head>
              <x>
                <extract prop="y"><copy prop="controlvector5" tname="_curve1" /></extract>
              </x>
              <y>
                <extract prop="x"><copy prop="controlvector5" tname="_curve1" /></extract>
              </y>
            </head>
          </vector>
        </controlVectors>
        <vector>
          <head>
            <x>
              <extract prop="y"><copy prop="controlvector6" tname="_curve1" /></extract>
            </x>
            <y>
              <extract prop="x"><copy prop="controlvector6" tname="_curve1" /></extract>
            </y>
          </head>
        </vector>
      </beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load


    cy.window().then((win) => {
      let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];
      let psflipped = [[-9, 6], [7, -3], [4, 0], [5, 8]];
      let cvs = [[3, 1], [5, -6], [3, 2], [-1, 5], [1, 4]];
      let cvsflipped = [[3, 1], [-6, 5], [3, 2], [5, -1], [4, 1]];

      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...cvs[0]]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...cvs[1]]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...cvs[2]]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(['tuple', ...cvs[3]]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(['tuple', ...cvs[4]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);
      expect(components['/_curve2'].state.controlvectors[0].tree).eqls(['tuple', ...cvsflipped[0]]);
      expect(components['/_curve2'].state.controlvectors[1].tree).eqls(['tuple', ...cvsflipped[1]]);
      expect(components['/_curve2'].state.controlvectors[3].tree).eqls(['tuple', ...cvsflipped[2]]);
      expect(components['/_curve2'].state.controlvectors[4].tree).eqls(['tuple', ...cvsflipped[3]]);
      expect(components['/_curve2'].state.controlvectors[5].tree).eqls(['tuple', ...cvsflipped[4]]);
    })

    cy.log('move first curve points')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      let psflipped = [[7, 2], [-3, 1], [2, 9], [-3, -4]];
      let cvs = [[3, 1], [5, -6], [3, 2], [-1, 5], [1, 4]];
      let cvsflipped = [[3, 1], [-6, 5], [3, 2], [5, -1], [4, 1]];

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: ps[0]
      });

      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: ps[1]
      });

      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: ps[2]
      });

      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: ps[3]
      });

      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...cvs[0]]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...cvs[1]]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...cvs[2]]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(['tuple', ...cvs[3]]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(['tuple', ...cvs[4]]);
      expect(components['/_curve2'].state.controlvectors[0].tree).eqls(['tuple', ...cvsflipped[0]]);
      expect(components['/_curve2'].state.controlvectors[1].tree).eqls(['tuple', ...cvsflipped[1]]);
      expect(components['/_curve2'].state.controlvectors[3].tree).eqls(['tuple', ...cvsflipped[2]]);
      expect(components['/_curve2'].state.controlvectors[4].tree).eqls(['tuple', ...cvsflipped[3]]);
      expect(components['/_curve2'].state.controlvectors[5].tree).eqls(['tuple', ...cvsflipped[4]]);

    })

    cy.log('move second curve points')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];
      let cvs = [[3, 1], [5, -6], [3, 2], [-1, 5], [1, 4]];
      let cvsflipped = [[3, 1], [-6, 5], [3, 2], [5, -1], [4, 1]];

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: psflipped[0]
      });

      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: psflipped[1]
      });

      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: psflipped[2]
      });

      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: psflipped[3]
      });

      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...cvs[0]]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...cvs[1]]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...cvs[2]]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(['tuple', ...cvs[3]]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(['tuple', ...cvs[4]]);
      expect(components['/_curve2'].state.controlvectors[0].tree).eqls(['tuple', ...cvsflipped[0]]);
      expect(components['/_curve2'].state.controlvectors[1].tree).eqls(['tuple', ...cvsflipped[1]]);
      expect(components['/_curve2'].state.controlvectors[3].tree).eqls(['tuple', ...cvsflipped[2]]);
      expect(components['/_curve2'].state.controlvectors[4].tree).eqls(['tuple', ...cvsflipped[3]]);
      expect(components['/_curve2'].state.controlvectors[5].tree).eqls(['tuple', ...cvsflipped[4]]);

    })


    cy.log('move first curve control vectors')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];
      let cvs = [[-1, 5], [0, 3], [-8, -3], [4, 6], [3, -2]];
      let cvsflipped = [[-1, 5], [3, 0], [-8, -3], [6, 4], [-2, 3]];

      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: cvs[0]
      });

      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...cvs[0]]);
      expect(components['/_curve2'].state.controlvectors[0].tree).eqls(['tuple', ...cvsflipped[0]]);

      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: cvs[1]
      });

      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...cvs[1]]);
      expect(components['/_curve2'].state.controlvectors[1].tree).eqls(['tuple', ...cvsflipped[1]]);

      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: cvs[2]
      });

      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...cvs[2]]);
      expect(components['/_curve2'].state.controlvectors[3].tree).eqls(['tuple', ...cvsflipped[2]]);

      components['/_curve1'].moveControlvector({
        controlvectorInd: 4,
        controlvector: cvs[3]
      });

      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(['tuple', ...cvs[3]]);
      expect(components['/_curve2'].state.controlvectors[4].tree).eqls(['tuple', ...cvsflipped[3]]);

      components['/_curve1'].moveControlvector({
        controlvectorInd: 5,
        controlvector: cvs[4]
      });

      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(['tuple', ...cvs[4]]);
      expect(components['/_curve2'].state.controlvectors[5].tree).eqls(['tuple', ...cvsflipped[4]]);


      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

    })


    cy.log('move second curve control vectors')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];
      let cvs = [[4, -1], [2, -6], [-5, 1], [0, -3], [4, -5]];
      let cvsflipped = [[4, -1], [-6, 2], [-5, 1], [-3, 0], [-5, 4]];

      components['/_curve2'].moveControlvector({
        controlvectorInd: 0,
        controlvector: cvsflipped[0]
      });

      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...cvs[0]]);
      expect(components['/_curve2'].state.controlvectors[0].tree).eqls(['tuple', ...cvsflipped[0]]);

      components['/_curve2'].moveControlvector({
        controlvectorInd: 1,
        controlvector: cvsflipped[1]
      });

      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...cvs[1]]);
      expect(components['/_curve2'].state.controlvectors[1].tree).eqls(['tuple', ...cvsflipped[1]]);

      components['/_curve2'].moveControlvector({
        controlvectorInd: 3,
        controlvector: cvsflipped[2]
      });

      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...cvs[2]]);
      expect(components['/_curve2'].state.controlvectors[3].tree).eqls(['tuple', ...cvsflipped[2]]);

      components['/_curve2'].moveControlvector({
        controlvectorInd: 4,
        controlvector: cvsflipped[3]
      });

      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(['tuple', ...cvs[3]]);
      expect(components['/_curve2'].state.controlvectors[4].tree).eqls(['tuple', ...cvsflipped[3]]);

      components['/_curve2'].moveControlvector({
        controlvectorInd: 5,
        controlvector: cvsflipped[4]
      });

      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(['tuple', ...cvs[4]]);
      expect(components['/_curve2'].state.controlvectors[5].tree).eqls(['tuple', ...cvsflipped[4]]);


      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

    })


  })

  // The behavior of this construction isn't as expected
  // due to just one pass of downstream updates.
  // When changing curve2, the calculation of what to change in
  // curve1 depends on curve1 values.
  // The only reason it passes is that repeat one of the curve 2
  // move point commands, giving two passes of downstream updates
  it('new curve from reffed control points, some flipped', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve>(-9,6),(-3,7),(4,0),(8,5)
    <beziercontrols>
      <vector>(3,1)</vector>
      <vector>(5,-6)</vector>
      <controlVectors>(3,2),(-1,5)</controlVectors>
      <vector>(1,4)</vector>
    </beziercontrols>
    </curve>
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
      <beziercontrols>
        <copy prop="controlpoint1" tname="_curve1" />
        <point>
          <x>
            <extract prop="y"><copy prop="controlpoint2" tname="_curve1" /></extract>
          </x>
          <y>
            <extract prop="x"><copy prop="controlpoint2" tname="_curve1" /></extract>
          </y>
        </point>
        <controlPoints>
          <copy prop="controlpoint4" tname="_curve1" />
          <point>
            <x>
              <extract prop="y"><copy prop="controlpoint5" tname="_curve1" /></extract>
              -<extract fixed prop="y"><copy prop="throughpoint3" tname="_curve1" /></extract>
              +<extract fixed prop="x"><copy prop="throughpoint3" tname="_curve1" /></extract>
            </x>
            <y>
              <extract prop="x"><copy prop="controlpoint5" tname="_curve1" /></extract>
              -<extract fixed prop="x"><copy prop="throughpoint3" tname="_curve1" /></extract>
              +<extract fixed prop="y"><copy prop="throughpoint3" tname="_curve1" /></extract>
            </y>
          </point>
        </controlPoints>
        <point>
          <x>
            <extract prop="y"><copy prop="controlpoint6" tname="_curve1" /></extract>
          </x>
          <y>
            <extract prop="x"><copy prop="controlpoint6" tname="_curve1" /></extract>
          </y>
        </point>
      </beziercontrols>
    </curve>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load


    cy.window().then((win) => {
      let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];
      let psflipped = [[-9, 6], [7, -3], [4, 0], [5, 8]];
      let cvs = [[3, 1], [5, -6], [3, 2], [-1, 5], [1, 4]];
      let cvsflipped = [[3, 1], [-6, 5], [3, 2], [5, -1], [4, 1]];

      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...cvs[0]]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...cvs[1]]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...cvs[2]]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(['tuple', ...cvs[3]]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(['tuple', ...cvs[4]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);
      expect(components['/_curve2'].state.controlvectors[0].tree).eqls(['tuple', ...cvsflipped[0]]);
      expect(components['/_curve2'].state.controlvectors[1].tree).eqls(['tuple', ...cvsflipped[1]]);
      expect(components['/_curve2'].state.controlvectors[3].tree).eqls(['tuple', ...cvsflipped[2]]);
      expect(components['/_curve2'].state.controlvectors[4].tree).eqls(['tuple', ...cvsflipped[3]]);
      expect(components['/_curve2'].state.controlvectors[5].tree).eqls(['tuple', ...cvsflipped[4]]);
    })

    cy.log('move first curve points')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      let psflipped = [[7, 2], [-3, 1], [2, 9], [-3, -4]];
      let cvs = [[3, 1], [5, -6], [3, 2], [-1, 5], [1, 4]];
      let cvsflipped = [[3, 1], [-6, 5], [3, 2], [5, -1], [4, 1]];

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: ps[0]
      });

      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: ps[1]
      });

      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: ps[2]
      });

      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);

      components['/_curve1'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: ps[3]
      });

      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...cvs[0]]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...cvs[1]]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...cvs[2]]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(['tuple', ...cvs[3]]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(['tuple', ...cvs[4]]);
      expect(components['/_curve2'].state.controlvectors[0].tree).eqls(['tuple', ...cvsflipped[0]]);
      expect(components['/_curve2'].state.controlvectors[1].tree).eqls(['tuple', ...cvsflipped[1]]);
      expect(components['/_curve2'].state.controlvectors[3].tree).eqls(['tuple', ...cvsflipped[2]]);
      expect(components['/_curve2'].state.controlvectors[4].tree).eqls(['tuple', ...cvsflipped[3]]);
      expect(components['/_curve2'].state.controlvectors[5].tree).eqls(['tuple', ...cvsflipped[4]]);

    })

    cy.log('move second curve points')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];
      let cvs = [[3, 1], [5, -6], [3, 2], [-1, 5], [1, 4]];
      let cvsflipped = [[3, 1], [-6, 5], [3, 2], [5, -1], [4, 1]];

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: psflipped[0]
      });

      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: psflipped[1]
      });

      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);

      // the test would fail if didn't repeat this move command
      // to allow two passes of downstream updates
      components['/_curve2'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: psflipped[2]
      });
      components['/_curve2'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: psflipped[2]
      });

      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);

      components['/_curve2'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: psflipped[3]
      });

      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...cvs[0]]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...cvs[1]]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...cvs[2]]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(['tuple', ...cvs[3]]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(['tuple', ...cvs[4]]);
      expect(components['/_curve2'].state.controlvectors[0].tree).eqls(['tuple', ...cvsflipped[0]]);
      expect(components['/_curve2'].state.controlvectors[1].tree).eqls(['tuple', ...cvsflipped[1]]);
      expect(components['/_curve2'].state.controlvectors[3].tree).eqls(['tuple', ...cvsflipped[2]]);
      expect(components['/_curve2'].state.controlvectors[4].tree).eqls(['tuple', ...cvsflipped[3]]);
      expect(components['/_curve2'].state.controlvectors[5].tree).eqls(['tuple', ...cvsflipped[4]]);

    })


    cy.log('move first curve control vectors')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];
      let cvs = [[-1, 5], [0, 3], [-8, -3], [4, 6], [3, -2]];
      let cvsflipped = [[-1, 5], [3, 0], [-8, -3], [6, 4], [-2, 3]];

      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: cvs[0]
      });

      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...cvs[0]]);
      expect(components['/_curve2'].state.controlvectors[0].tree).eqls(['tuple', ...cvsflipped[0]]);

      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: cvs[1]
      });

      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...cvs[1]]);
      expect(components['/_curve2'].state.controlvectors[1].tree).eqls(['tuple', ...cvsflipped[1]]);

      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: cvs[2]
      });

      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...cvs[2]]);
      expect(components['/_curve2'].state.controlvectors[3].tree).eqls(['tuple', ...cvsflipped[2]]);

      components['/_curve1'].moveControlvector({
        controlvectorInd: 4,
        controlvector: cvs[3]
      });

      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(['tuple', ...cvs[3]]);
      expect(components['/_curve2'].state.controlvectors[4].tree).eqls(['tuple', ...cvsflipped[3]]);

      components['/_curve1'].moveControlvector({
        controlvectorInd: 5,
        controlvector: cvs[4]
      });

      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(['tuple', ...cvs[4]]);
      expect(components['/_curve2'].state.controlvectors[5].tree).eqls(['tuple', ...cvsflipped[4]]);


      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

    })


    cy.log('move second curve control vectors')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];
      let cvs = [[4, -1], [2, -6], [-5, 1], [0, -3], [4, -5]];
      let cvsflipped = [[4, -1], [-6, 2], [-5, 1], [-3, 0], [-5, 4]];

      components['/_curve2'].moveControlvector({
        controlvectorInd: 0,
        controlvector: cvsflipped[0]
      });

      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...cvs[0]]);
      expect(components['/_curve2'].state.controlvectors[0].tree).eqls(['tuple', ...cvsflipped[0]]);

      components['/_curve2'].moveControlvector({
        controlvectorInd: 1,
        controlvector: cvsflipped[1]
      });

      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...cvs[1]]);
      expect(components['/_curve2'].state.controlvectors[1].tree).eqls(['tuple', ...cvsflipped[1]]);

      components['/_curve2'].moveControlvector({
        controlvectorInd: 3,
        controlvector: cvsflipped[2]
      });

      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...cvs[2]]);
      expect(components['/_curve2'].state.controlvectors[3].tree).eqls(['tuple', ...cvsflipped[2]]);

      components['/_curve2'].moveControlvector({
        controlvectorInd: 4,
        controlvector: cvsflipped[3]
      });

      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(['tuple', ...cvs[3]]);
      expect(components['/_curve2'].state.controlvectors[4].tree).eqls(['tuple', ...cvsflipped[3]]);

      components['/_curve2'].moveControlvector({
        controlvectorInd: 5,
        controlvector: cvsflipped[4]
      });

      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(['tuple', ...cvs[4]]);
      expect(components['/_curve2'].state.controlvectors[5].tree).eqls(['tuple', ...cvsflipped[4]]);


      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...ps[0]]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...ps[1]]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...ps[2]]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...ps[3]]);
      expect(components['/_curve2'].state.throughpoints[0].tree).eqls(['tuple', ...psflipped[0]]);
      expect(components['/_curve2'].state.throughpoints[1].tree).eqls(['tuple', ...psflipped[1]]);
      expect(components['/_curve2'].state.throughpoints[2].tree).eqls(['tuple', ...psflipped[2]]);
      expect(components['/_curve2'].state.throughpoints[3].tree).eqls(['tuple', ...psflipped[3]]);

    })


  })

  it('fourth point depends on internal ref of first point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve>
  <through>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <point>(-5,6)</point>
  <copy prop="throughpoint1" tname="_curve1" />
  </through>
  </curve>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move first point')
    cy.window().then((win) => {
      A = [-4, -1];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move second point')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fourth point')
    cy.window().then((win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move first control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(0)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [2, 1]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);

    })

    cy.log('move second control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(1)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [-3, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -3, 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] - 3, B[1] + 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 3, -4]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] + 3, B[1] - 4]);

    })

    cy.log('move third control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2,
        controlvector: [-5, 1]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);

    })

    cy.log('move fourth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(2)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: [0, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 0, 4]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 0, C[1] + 4]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -0, -4]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 0, C[1] - 4]);

    })

    cy.log('move fifth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 4,
        controlvector: [-7, -6]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 7, 6]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 7, C[1] + 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -7, -6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 7, C[1] - 6]);

    })

    cy.log('move sixth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(3)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 5,
        controlvector: [-1, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 7, 6]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 7, C[1] + 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -7, -6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 7, C[1] - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -1, -2]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", A[0] - 1, A[1] - 2]);

    })
  })

  it('first point depends on internal ref of fourth point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve>
  <through>
  <copy prop="throughpoint4" tname="_curve1" />
  <point>(3,4)</point>
  <point>(-5,6)</point>
  <point>(1,2)</point>
  </through>
  </curve>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move first point')
    cy.window().then((win) => {
      A = [-4, -1];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move second point')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fourth point')
    cy.window().then((win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
    })

    cy.log('move first control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(0)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [2, 1]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);

    })

    cy.log('move second control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(1)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [-3, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -3, 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] - 3, B[1] + 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 3, -4]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] + 3, B[1] - 4]);

    })

    cy.log('move third control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2,
        controlvector: [-5, 1]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);

    })

    cy.log('move fourth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(2)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: [0, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 0, 4]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 0, C[1] + 4]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -0, -4]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 0, C[1] - 4]);

    })

    cy.log('move fifth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 4,
        controlvector: [-7, -6]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 7, 6]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 7, C[1] + 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -7, -6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 7, C[1] - 6]);

    })

    cy.log('move sixth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(3)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 5,
        controlvector: [-1, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 7, 6]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 7, C[1] + 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -7, -6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 7, C[1] - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -1, -2]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", A[0] - 1, A[1] - 2]);

    })
  })

  it('first point depends fourth, formula for fifth', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve>
  <through>
  <copy prop="throughpoint4" tname="_curve1" />
  <point>(3,4)</point>
  <point>(-5,6)</point>
  <point>(1,2)</point>
  <point>
    <x><extract prop="x"><copy prop="throughpoint1" tname="_curve1" /></extract>+1</x>
    <y>2</y>
  </point>
  </through>
  </curve>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [A[0] + 1, 2];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
    })

    cy.log('move first point')
    cy.window().then((win) => {
      A = [-4, -1];
      D[0] = A[0] + 1;

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
    })

    cy.log('move second point')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
    })

    cy.log('move fourth point')
    cy.window().then((win) => {
      A = [7, 0];
      D[0] = A[0] + 1;
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
    })


    cy.log('move fifth point')
    cy.window().then((win) => {
      D = [-5, 9];
      A[0] = D[0] - 1;
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 4,
        throughpoint: D
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
    })


    cy.log('move first control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(0)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: [2, 1]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);

    })

    cy.log('move second control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(1)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: [-3, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", -3, 4]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] - 3, B[1] + 4]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", 3, -4]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] + 3, B[1] - 4]);

    })

    cy.log('move third control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 2,
        controlvector: [-5, 1]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);

    })

    cy.log('move fourth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(2)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: [0, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 0, 4]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 0, C[1] + 4]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -0, -4]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 0, C[1] - 4]);

    })

    cy.log('move fifth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 4,
        controlvector: [-7, -6]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 7, 6]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 7, C[1] + 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -7, -6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 7, C[1] - 6]);

    })

    cy.log('move sixth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(3)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 5,
        controlvector: [-1, -2]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 7, 6]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 7, C[1] + 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -7, -6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 7, C[1] - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -1, -2]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", A[0] - 1, A[1] - 2]);
      expect(components['/_curve1'].state.controlvectors[6].tree).eqls(["tuple", 1, 2]);
      expect(components['/_curve1'].state.controlpoints[6].tree).eqls(["tuple", A[0] + 1, A[1] + 2]);

    })

    cy.log('move seventh control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveControlvector({
        controlvectorInd: 6,
        controlvector: [3, 4]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 7, 6]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 7, C[1] + 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -7, -6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 7, C[1] - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", A[0] - 3, A[1] - 4]);
      expect(components['/_curve1'].state.controlvectors[6].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.controlpoints[6].tree).eqls(["tuple", A[0] + 3, A[1] + 4]);

    })

    cy.log('move eighth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].togglePointControl(4)
      components['/_curve1'].moveControlvector({
        controlvectorInd: 7,
        controlvector: [7, -9]
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(["tuple", 2, 1]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(["tuple", A[0] + 2, A[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(["tuple", 5, -1]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(["tuple", B[0] + 5, B[1] - 1]);
      expect(components['/_curve1'].state.controlvectors[2].tree).eqls(["tuple", -5, 1]);
      expect(components['/_curve1'].state.controlpoints[2].tree).eqls(["tuple", B[0] - 5, B[1] + 1]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(["tuple", 7, 6]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(["tuple", C[0] + 7, C[1] + 6]);
      expect(components['/_curve1'].state.controlvectors[4].tree).eqls(["tuple", -7, -6]);
      expect(components['/_curve1'].state.controlpoints[4].tree).eqls(["tuple", C[0] - 7, C[1] - 6]);
      expect(components['/_curve1'].state.controlvectors[5].tree).eqls(["tuple", -3, -4]);
      expect(components['/_curve1'].state.controlpoints[5].tree).eqls(["tuple", A[0] - 3, A[1] - 4]);
      expect(components['/_curve1'].state.controlvectors[6].tree).eqls(["tuple", 3, 4]);
      expect(components['/_curve1'].state.controlpoints[6].tree).eqls(["tuple", A[0] + 3, A[1] + 4]);
      expect(components['/_curve1'].state.controlvectors[7].tree).eqls(["tuple", 7, -9]);
      expect(components['/_curve1'].state.controlpoints[7].tree).eqls(["tuple", D[0] + 7, D[1] - 9]);

    })

  })

  it('first, fourth, seventh point depends on fourth, seventh, tenth', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve>
  <through>
    <copy prop="throughpoint4" tname="_curve1" />
    <point>(1,2)</point>
    <point>(3,4)</point>
    <copy prop="throughpoint7" tname="_curve1" />
    <point>(5,7)</point>
    <point>(-5,7)</point>
    <copy prop="throughpoint10" tname="_curve1" />
    <point>(3,1)</point>
    <point>(5,0)</point>
    <point>(-5,-1)</point>
  </through>
  </curve>
  </graph>
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [-5, -1];
    let B = [1, 2];
    let C = [3, 4];
    let D = [5, 7];
    let E = [-5, 7];
    let F = [3, 1];
    let G = [5, 0];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move first point')
    cy.window().then((win) => {
      A = [-4, -9];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move second point')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fourth point')
    cy.window().then((win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fifth point')
    cy.window().then((win) => {
      D = [-9, 1];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 4,
        throughpoint: D
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move sixth point')
    cy.window().then((win) => {
      E = [-3, 6];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 5,
        throughpoint: E
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move seventh point')
    cy.window().then((win) => {
      A = [2, -4];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 6,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move eighth point')
    cy.window().then((win) => {
      F = [6, 7];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 7,
        throughpoint: F
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move nineth point')
    cy.window().then((win) => {
      G = [1, -8];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 8,
        throughpoint: G
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move tenth point')
    cy.window().then((win) => {
      A = [-6, 10];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 9,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

  })

  it('first, fourth, seventh point depends on shifted fourth, seventh, tenth', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve>
  <through>
    <point>
      <x><extract prop="x"><copy prop="throughpoint4" tname="_curve1" /></extract>+1</x>
      <y><extract prop="y"><copy prop="throughpoint4" tname="_curve1" /></extract>+1</y>
    </point>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <point>
      <x><extract prop="x"><copy prop="throughpoint7" tname="_curve1" /></extract>+1</x>
      <y><extract prop="y"><copy prop="throughpoint7" tname="_curve1" /></extract>+1</y>
    </point>
    <point>(5,7)</point>
    <point>(-5,7)</point>
    <point>
      <x><extract prop="x"><copy prop="throughpoint10" tname="_curve1" /></extract>+1</x>
      <y><extract prop="y"><copy prop="throughpoint10" tname="_curve1" /></extract>+1</y>
    </point>
    <point>(3,1)</point>
    <point>(5,0)</point>
    <point>(-5,-1)</point>
  </through>
  </curve>
  </graph>
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [-5, -1];
    let B = [1, 2];
    let C = [3, 4];
    let D = [5, 7];
    let E = [-5, 7];
    let F = [3, 1];
    let G = [5, 0];
    let A1 = [A[0] + 1, A[1] + 1];
    let A2 = [A[0] + 2, A[1] + 2];
    let A3 = [A[0] + 3, A[1] + 3];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move first point')
    cy.window().then((win) => {
      A = [-4, -9];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A3
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move second point')
    cy.window().then((win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fourth point')
    cy.window().then((win) => {
      A = [7, 0];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 3,
        throughpoint: A2
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move fifth point')
    cy.window().then((win) => {
      D = [-9, 1];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 4,
        throughpoint: D
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move sixth point')
    cy.window().then((win) => {
      E = [-3, 6];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 5,
        throughpoint: E
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move seventh point')
    cy.window().then((win) => {
      A = [2, -4];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 6,
        throughpoint: A1
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move eighth point')
    cy.window().then((win) => {
      F = [6, 7];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 7,
        throughpoint: F
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move nineth point')
    cy.window().then((win) => {
      G = [1, -8];
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 8,
        throughpoint: G
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

    cy.log('move tenth point')
    cy.window().then((win) => {
      A = [-6, 7];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 9,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A3]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.throughpoints[3].tree).eqls(['tuple', ...A2]);
      expect(components['/_curve1'].state.throughpoints[4].tree).eqls(['tuple', ...D]);
      expect(components['/_curve1'].state.throughpoints[5].tree).eqls(['tuple', ...E]);
      expect(components['/_curve1'].state.throughpoints[6].tree).eqls(['tuple', ...A1]);
      expect(components['/_curve1'].state.throughpoints[7].tree).eqls(['tuple', ...F]);
      expect(components['/_curve1'].state.throughpoints[8].tree).eqls(['tuple', ...G]);
      expect(components['/_curve1'].state.throughpoints[9].tree).eqls(['tuple', ...A]);
    })

  })

  it('fourth control point depends on internal ref of first control point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve>
  <through>(1,2),(3,4),(-5,6)</through>
  <beziercontrols>
    <point>(-1,4)</point>
    <point>(2,0)</point>
    <copy prop="controlpoint1" tname="_curve1" />
  </beziercontrols>
  </curve>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let Acp = [-1, 4];
    let Bcp = [2, 0];
    let Acv = [Acp[0]-A[0], Acp[1]-A[1]];
    let Bcv = [Bcp[0]-B[0], Bcp[1]-B[1]];
    let Ccv = [Acp[0]-C[0], Acp[1]-C[1]];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
   })

    cy.log('move first point')
    cy.window().then((win) => {
      A[0] -= 5;
      A[1] -= 3;
      Acp[0] -= 5;
      Acp[1] -= 3;
      Ccv = [Acp[0]-C[0], Acp[1]-C[1]];
  
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
    })

    cy.log('move second point')
    cy.window().then((win) => {
      B[0] += 2;
      B[1] -= 2;
      Bcp[0] += 2;
      Bcp[1] -= 2;

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      C[0] += 4;
      C[1] += 1;
      Acp[0] += 4;
      Acp[1] += 1;
      Acv = [Acp[0]-A[0], Acp[1]-A[1]];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
    })

    cy.log('move first control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Acv = [2, 1];
      Acp = [A[0]+Acv[0], A[1] + Acv[1]];
      Ccv = [Acp[0]-C[0], Acp[1]-C[1]];
      
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: Acv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);

    })

    cy.log('move second control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Bcv = [-3, 4];
      Bcp = [B[0]+Bcv[0], B[1] + Bcv[1]];

      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: Bcv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);

    })

    cy.log('move fourth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Ccv = [0, 6];
      Acp = [C[0]+Ccv[0], C[1] + Ccv[1]];
      Acv = [Acp[0]-A[0], Acp[1]-A[1]];

      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: Ccv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);

    })

  })

  it('first control point depends on internal ref of fourth control point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve>
  <through>(1,2),(3,4),(-5,6)</through>
  <beziercontrols>
    <copy prop="controlpoint4" tname="_curve1" />
    <point>(2,0)</point>
    <point>(-1,4)</point>
  </beziercontrols>
  </curve>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let Acp = [-1, 4];
    let Bcp = [2, 0];
    let Acv = [Acp[0]-A[0], Acp[1]-A[1]];
    let Bcv = [Bcp[0]-B[0], Bcp[1]-B[1]];
    let Ccv = [Acp[0]-C[0], Acp[1]-C[1]];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
   })

    cy.log('move first point')
    cy.window().then((win) => {
      A[0] -= 5;
      A[1] -= 3;
      Acp[0] -= 5;
      Acp[1] -= 3;
      Ccv = [Acp[0]-C[0], Acp[1]-C[1]];
  
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
    })

    cy.log('move second point')
    cy.window().then((win) => {
      B[0] += 2;
      B[1] -= 2;
      Bcp[0] += 2;
      Bcp[1] -= 2;

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      C[0] += 4;
      C[1] += 1;
      Acp[0] += 4;
      Acp[1] += 1;
      Acv = [Acp[0]-A[0], Acp[1]-A[1]];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
    })

    cy.log('move first control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Acv = [2, 1];
      Acp = [A[0]+Acv[0], A[1] + Acv[1]];
      Ccv = [Acp[0]-C[0], Acp[1]-C[1]];
      
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: Acv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);

    })

    cy.log('move second control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Bcv = [-3, 4];
      Bcp = [B[0]+Bcv[0], B[1] + Bcv[1]];

      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: Bcv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);

    })

    cy.log('move fourth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Ccv = [0, 6];
      Acp = [C[0]+Ccv[0], C[1] + Ccv[1]];
      Acv = [Acp[0]-A[0], Acp[1]-A[1]];

      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: Ccv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);

    })

  })

  it('first control point depends on internal ref of fourth control vector', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve>
  <through>(1,2),(3,4),(-5,6)</through>
  <beziercontrols>
    <copy prop="controlpoint4" tname="_curve1" />
    <point>(2,0)</point>
    <vector>(4,-2)</vector>
  </beziercontrols>
  </curve>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let Acp = [-1, 4];
    let Bcp = [2, 0];
    let Acv = [Acp[0]-A[0], Acp[1]-A[1]];
    let Bcv = [Bcp[0]-B[0], Bcp[1]-B[1]];
    let Ccv = [Acp[0]-C[0], Acp[1]-C[1]];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
   })

    cy.log('move first point')
    cy.window().then((win) => {
      A[0] -= 5;
      A[1] -= 3;
      Acp[0] -= 5;
      Acp[1] -= 3;
      Ccv = [Acp[0]-C[0], Acp[1]-C[1]];
  
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
    })

    cy.log('move second point')
    cy.window().then((win) => {
      B[0] += 2;
      B[1] -= 2;
      Bcp[0] += 2;
      Bcp[1] -= 2;

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      C[0] += 4;
      C[1] += 1;
      Acp[0] += 4;
      Acp[1] += 1;
      Acv = [Acp[0]-A[0], Acp[1]-A[1]];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);
    })

    cy.log('move first control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Acv = [2, 1];
      Acp = [A[0]+Acv[0], A[1] + Acv[1]];
      Ccv = [Acp[0]-C[0], Acp[1]-C[1]];
      
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: Acv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);

    })

    cy.log('move second control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Bcv = [-3, 4];
      Bcp = [B[0]+Bcv[0], B[1] + Bcv[1]];

      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: Bcv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);

    })

    cy.log('move fourth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Ccv = [0, 6];
      Acp = [C[0]+Ccv[0], C[1] + Ccv[1]];
      Acv = [Acp[0]-A[0], Acp[1]-A[1]];

      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: Ccv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Ccv]);

    })

  })

  it('first control vector depends on internal ref of fourth control point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve>
  <through>(1,2),(3,4),(-5,6)</through>
  <beziercontrols>
    <copy prop="controlvector4" tname="_curve1" />
    <point>(2,0)</point>
    <point>(-1,4)</point>
  </beziercontrols>
  </curve>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let Ccp = [-1, 4];
    let Bcp = [2, 0];
    let Acv = [Ccp[0]-C[0], Ccp[1]-C[1]];
    let Bcv = [Bcp[0]-B[0], Bcp[1]-B[1]];
    let Acp = [A[0]+Acv[0], A[1]+Acv[1]];
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Ccp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Acv]);
   })

    cy.log('move first point')
    cy.window().then((win) => {
      A[0] -= 5;
      A[1] -= 3;
      Acp = [A[0]+Acv[0], A[1]+Acv[1]];
  
      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Ccp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Acv]);
    })

    cy.log('move second point')
    cy.window().then((win) => {
      B[0] += 2;
      B[1] -= 2;
      Bcp = [B[0]+Bcv[0], B[1]+Bcv[1]];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Ccp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Acv]);
    })

    cy.log('move third point')
    cy.window().then((win) => {
      C[0] += 4;
      C[1] += 1;
      Ccp = [C[0]+Acv[0], C[1]+Acv[1]];

      let components = Object.assign({}, win.state.components);
      components['/_curve1'].moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Ccp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Acv]);
    })

    cy.log('move first control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Acv = [2, 1];
      Acp = [A[0]+Acv[0], A[1] + Acv[1]];
      Ccp = [C[0]+Acv[0], C[1]+Acv[1]];
      
      components['/_curve1'].moveControlvector({
        controlvectorInd: 0,
        controlvector: Acv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Ccp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Acv]);

    })

    cy.log('move second control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Bcv = [-3, 4];
      Bcp = [B[0]+Bcv[0], B[1] + Bcv[1]];

      components['/_curve1'].moveControlvector({
        controlvectorInd: 1,
        controlvector: Bcv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Ccp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Acv]);

    })

    cy.log('move fourth control vector')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      Acv = [0, 6];
      Acp = [A[0]+Acv[0], A[1] + Acv[1]];
      Ccp = [C[0]+Acv[0], C[1]+Acv[1]];

      components['/_curve1'].moveControlvector({
        controlvectorInd: 3,
        controlvector: Acv
      })
      expect(components['/_curve1'].state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(components['/_curve1'].state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(components['/_curve1'].state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(components['/_curve1'].state.controlpoints[0].tree).eqls(['tuple', ...Acp]);
      expect(components['/_curve1'].state.controlpoints[1].tree).eqls(['tuple', ...Bcp]);
      expect(components['/_curve1'].state.controlpoints[3].tree).eqls(['tuple', ...Ccp]);
      expect(components['/_curve1'].state.controlvectors[0].tree).eqls(['tuple', ...Acv]);
      expect(components['/_curve1'].state.controlvectors[1].tree).eqls(['tuple', ...Bcv]);
      expect(components['/_curve1'].state.controlvectors[3].tree).eqls(['tuple', ...Acv]);

    })

  })

  it('internal refs among controls, based on one vector, curve reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve>
  <through>(1,2),(3,4),(-5,6),(3,5)</through>
  <beziercontrols>
    <copy prop="controlvector3" tname="_curve1" />
    <controlpoints><copy prop="controlpoint1" tname="_curve1" /><copy prop="controlpoint4" tname="_curve1" /></controlpoints>
    <controlvectors><copy prop="controlvector6" tname="_curve1" /><copy prop="controlvector2" tname="_curve1" /></controlvectors>
    <vector>(4,-2)</vector>
  </beziercontrols>
  </curve>
  </graph>
  
  <graph>
    <copy name="c2" tname="_curve1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [3,5];

    let Cv6 = [4,-2];
    let Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

    let Cv4 = Cv6;
    let Cp4 = [C[0]+Cv4[0], C[1]+Cv4[1]];

    let Cp3 = Cp4;
    let Cv3 = [Cp3[0]-B[0], Cp3[1]-B[1]];

    let Cv1 = Cv3;
    let Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];

    let Cp2 = Cp1;
    let Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

    let Cv5 = Cv2;
    let Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

    let curve1, curve2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      curve1 = components['/_curve1'];
      curve2 = components['/c2'].replacements[0];
  
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   })

    cy.log('move first point')
    cy.window().then((win) => {
      A = [-4,-1];

      Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      curve1.moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A
      });

      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })

    cy.log('move first point shadow')
    cy.window().then((win) => {
      A = [3,7];

      Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      curve2.moveThroughpoint({
        throughpointInd: 0,
        throughpoint: A
      });

      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })

    cy.log('move second point')
    cy.window().then((win) => {

      B = [2,-1];

      Cp3 = [B[0]+Cv3[0], B[1]+Cv3[1]];

      Cp4 = Cp3;
      Cv4 = [Cp4[0]-C[0], Cp4[1]-C[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];
      
      Cv1 = Cv3;
      Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];
  
      curve1.moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });

      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move second point shadow')
    cy.window().then((win) => {

      B = [-1,3];

      Cp3 = [B[0]+Cv3[0], B[1]+Cv3[1]];

      Cp4 = Cp3;
      Cv4 = [Cp4[0]-C[0], Cp4[1]-C[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];
      
      Cv1 = Cv3;
      Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];
  
      curve2.moveThroughpoint({
        throughpointInd: 1,
        throughpoint: B
      });

      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })

    cy.log('move third point')
    cy.window().then((win) => {
      C = [-4,5];

      Cp4 = [C[0]+Cv4[0], C[1]+Cv4[1]];
  
      Cp3 = Cp4;
      Cv3 = [Cp3[0]-B[0], Cp3[1]-B[1]];
  
      Cv1 = Cv3;
      Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];
  
      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];
  
      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];
  

      curve1.moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });

      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })

    cy.log('move third point shadow')
    cy.window().then((win) => {
      C = [4,-6];

      Cp4 = [C[0]+Cv4[0], C[1]+Cv4[1]];
  
      Cp3 = Cp4;
      Cv3 = [Cp3[0]-B[0], Cp3[1]-B[1]];
  
      Cv1 = Cv3;
      Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];
  
      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];
  
      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];
  

      curve2.moveThroughpoint({
        throughpointInd: 2,
        throughpoint: C
      });

      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move fourth point')
    cy.window().then((win) => {
      D = [-6,-7];

      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      Cp4 = [C[0]+Cv4[0], C[1]+Cv4[1]];
  
      Cp3 = Cp4;
      Cv3 = [Cp3[0]-B[0], Cp3[1]-B[1]];
  
      Cv1 = Cv3;
      Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];
  
      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];
  
      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];
  

      curve1.moveThroughpoint({
        throughpointInd: 3,
        throughpoint: D
      });

      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move fourth point shadow')
    cy.window().then((win) => {
      D = [8,-6];

      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      Cp4 = [C[0]+Cv4[0], C[1]+Cv4[1]];
  
      Cp3 = Cp4;
      Cv3 = [Cp3[0]-B[0], Cp3[1]-B[1]];
  
      Cv1 = Cv3;
      Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];
  
      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];
  
      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];
  

      curve2.moveThroughpoint({
        throughpointInd: 3,
        throughpoint: D
      });

      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })

    cy.log('move first control vector')
    cy.window().then((win) => {

      Cv1 = [-3,2]
      Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      Cv3 = Cv1;
      Cp3 = [B[0]+Cv3[0], B[1]+Cv3[1]];

      Cp4 = Cp3;
      Cv4 = [Cp4[0]-C[0], Cp4[1]-C[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      curve1.moveControlvector({
        controlvectorInd: 0,
        controlvector: Cv1
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move first control vector shadow')
    cy.window().then((win) => {

      Cv1 = [-2,3]
      Cp1 = [A[0]+Cv1[0], A[1]+Cv1[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      Cv3 = Cv1;
      Cp3 = [B[0]+Cv3[0], B[1]+Cv3[1]];

      Cp4 = Cp3;
      Cv4 = [Cp4[0]-C[0], Cp4[1]-C[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      curve2.moveControlvector({
        controlvectorInd: 0,
        controlvector: Cv1
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move second control vector')
    cy.window().then((win) => {

      Cv2 = [5,-4];
      Cp2 = [B[0]+Cv2[0], B[1]+Cv2[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      Cp1 = Cp2;
      Cv1 = [Cp1[0]-A[0], Cp1[1]-A[1]];

      Cv3 = Cv1;
      Cp3 = [B[0]+Cv3[0], B[1]+Cv3[1]];

      Cp4 = Cp3;
      Cv4 = [Cp4[0]-C[0], Cp4[1]-C[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      curve1.moveControlvector({
        controlvectorInd: 1,
        controlvector: Cv2
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move second control vector shadow')
    cy.window().then((win) => {

      Cv2 = [3,-5];
      Cp2 = [B[0]+Cv2[0], B[1]+Cv2[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      Cp1 = Cp2;
      Cv1 = [Cp1[0]-A[0], Cp1[1]-A[1]];

      Cv3 = Cv1;
      Cp3 = [B[0]+Cv3[0], B[1]+Cv3[1]];

      Cp4 = Cp3;
      Cv4 = [Cp4[0]-C[0], Cp4[1]-C[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      curve2.moveControlvector({
        controlvectorInd: 1,
        controlvector: Cv2
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move third control vector')
    cy.window().then((win) => {

      Cv3 = [2,7];
      Cp3 = [B[0]+Cv3[0], B[1]+Cv3[1]];

      Cp4 = Cp3;
      Cv4 = [Cp4[0]-C[0], Cp4[1]-C[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      Cv1 = Cv3;
      Cp1 = [A[0]+Cv3[0], A[1]+Cv3[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      curve1.moveControlvector({
        controlvectorInd: 2,
        controlvector: Cv3
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move third control vector shadow')
    cy.window().then((win) => {

      Cv3 = [7,2];
      Cp3 = [B[0]+Cv3[0], B[1]+Cv3[1]];

      Cp4 = Cp3;
      Cv4 = [Cp4[0]-C[0], Cp4[1]-C[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      Cv1 = Cv3;
      Cp1 = [A[0]+Cv3[0], A[1]+Cv3[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      curve2.moveControlvector({
        controlvectorInd: 2,
        controlvector: Cv3
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move fourth control vector')
    cy.window().then((win) => {

      Cv4 = [-5,-4];
      Cp4 = [C[0]+Cv4[0], C[1]+Cv4[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      Cp3 = Cp4;
      Cv3 = [Cp3[0]-B[0], Cp3[1]-B[1]];

      Cv1 = Cv3;
      Cp1 = [A[0]+Cv3[0], A[1]+Cv3[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      curve1.moveControlvector({
        controlvectorInd: 3,
        controlvector: Cv4
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move fourth control vector shadow')
    cy.window().then((win) => {

      Cv4 = [5,4];
      Cp4 = [C[0]+Cv4[0], C[1]+Cv4[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      Cp3 = Cp4;
      Cv3 = [Cp3[0]-B[0], Cp3[1]-B[1]];

      Cv1 = Cv3;
      Cp1 = [A[0]+Cv3[0], A[1]+Cv3[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      curve2.moveControlvector({
        controlvectorInd: 3,
        controlvector: Cv4
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move fifth control vector')
    cy.window().then((win) => {

      Cv5 = [1,6];
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      Cv2 = Cv5;
      Cp2 = [B[0]+Cv2[0], B[1]+Cv2[1]];

      Cp1 = Cp2;
      Cv1 = [Cp1[0]-A[0], Cp1[1]-A[1]];

      Cv3 = Cv1;
      Cp3 = [B[0]+Cv3[0], B[1]+Cv3[1]];

      Cp4 = Cp3;
      Cv4 = [Cp4[0]-C[0], Cp4[1]-C[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      curve1.moveControlvector({
        controlvectorInd: 4,
        controlvector: Cv5
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move fifth control vector shadow')
    cy.window().then((win) => {

      Cv5 = [6,1];
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      Cv2 = Cv5;
      Cp2 = [B[0]+Cv2[0], B[1]+Cv2[1]];

      Cp1 = Cp2;
      Cv1 = [Cp1[0]-A[0], Cp1[1]-A[1]];

      Cv3 = Cv1;
      Cp3 = [B[0]+Cv3[0], B[1]+Cv3[1]];

      Cp4 = Cp3;
      Cv4 = [Cp4[0]-C[0], Cp4[1]-C[1]];

      Cv6 = Cv4;
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      curve2.moveControlvector({
        controlvectorInd: 4,
        controlvector: Cv5
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move sixth control vector')
    cy.window().then((win) => {

      Cv6 = [-9,2];
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      Cv4 = Cv6;
      Cp4 = [C[0]+Cv4[0], C[1]+Cv4[1]];

      Cp3 = Cp4;
      Cv3 = [Cp3[0]-B[0], Cp3[1]-B[1]];

      Cv1 = Cv3;
      Cp1 = [A[0]+Cv3[0], A[1]+Cv3[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      curve1.moveControlvector({
        controlvectorInd: 5,
        controlvector: Cv6
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


    cy.log('move sixth control vector shadow')
    cy.window().then((win) => {

      Cv6 = [2,-9];
      Cp6 = [D[0]+Cv6[0], D[1]+Cv6[1]];

      Cv4 = Cv6;
      Cp4 = [C[0]+Cv4[0], C[1]+Cv4[1]];

      Cp3 = Cp4;
      Cv3 = [Cp3[0]-B[0], Cp3[1]-B[1]];

      Cv1 = Cv3;
      Cp1 = [A[0]+Cv3[0], A[1]+Cv3[1]];

      Cp2 = Cp1;
      Cv2 = [Cp2[0]-B[0], Cp2[1]-B[1]];

      Cv5 = Cv2;
      Cp5 = [C[0]+Cv5[0], C[1]+Cv5[1]];

      curve2.moveControlvector({
        controlvectorInd: 5,
        controlvector: Cv6
      })
      
      expect(curve1.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve1.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve1.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve1.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve1.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve1.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve1.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve1.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve1.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve1.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve1.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve1.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve1.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve1.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve1.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve1.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
      expect(curve2.state.throughpoints[0].tree).eqls(['tuple', ...A]);
      expect(curve2.state.throughpoints[1].tree).eqls(['tuple', ...B]);
      expect(curve2.state.throughpoints[2].tree).eqls(['tuple', ...C]);
      expect(curve2.state.throughpoints[3].tree).eqls(['tuple', ...D]);
      expect(curve2.state.controlpoints[0].tree).eqls(['tuple', ...Cp1]);
      expect(curve2.state.controlpoints[1].tree).eqls(['tuple', ...Cp2]);
      expect(curve2.state.controlpoints[2].tree).eqls(['tuple', ...Cp3]);
      expect(curve2.state.controlpoints[3].tree).eqls(['tuple', ...Cp4]);
      expect(curve2.state.controlpoints[4].tree).eqls(['tuple', ...Cp5]);
      expect(curve2.state.controlpoints[5].tree).eqls(['tuple', ...Cp6]);
      expect(curve2.state.controlvectors[0].tree).eqls(['tuple', ...Cv1]);
      expect(curve2.state.controlvectors[1].tree).eqls(['tuple', ...Cv2]);
      expect(curve2.state.controlvectors[2].tree).eqls(['tuple', ...Cv3]);
      expect(curve2.state.controlvectors[3].tree).eqls(['tuple', ...Cv4]);
      expect(curve2.state.controlvectors[4].tree).eqls(['tuple', ...Cv5]);
      expect(curve2.state.controlvectors[5].tree).eqls(['tuple', ...Cv6]);
   
    })


  })


});