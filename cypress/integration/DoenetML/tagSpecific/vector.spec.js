import cssesc from 'cssesc';
import me from 'math-expressions';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`
  } else {
    return String(n);
  }
}

describe('Vector Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  async function testVectorCopiedHTD({ headx, heady, tailx, taily,
    displacementTailShiftx = 0, displacementTailShifty = 0,
    vectorName = "/_vector1", tailName = "/tail", headName = "/head", displacementName = "/displacement",
    tailInDomName = "/tail2", headInDomName = "/head2", displacementInDomName = "/displacement2"
  }) {

    let displacementx = headx - tailx;
    let displacementy = heady - taily;

    cy.get(`#${cesc(tailInDomName)} .mjx-mrow`).should('contain.text', `(${nInDOM(tailx)},${nInDOM(taily)})`)
    cy.get(`#${cesc(headInDomName)} .mjx-mrow`).should('contain.text', `(${nInDOM(headx)},${nInDOM(heady)})`)
    cy.get(`#${cesc(displacementInDomName)} .mjx-mrow`).should('contain.text', `(${nInDOM(displacementx)},${nInDOM(displacementy)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[vectorName].stateValues.tail).eqls([tailx, taily]);
      expect(stateVariables[vectorName].stateValues.head).eqls([headx, heady]);
      expect(stateVariables[vectorName].stateValues.displacement).eqls([displacementx, displacementy]);
      expect(stateVariables[tailName].stateValues.xs).eqls([tailx, taily]);
      expect(stateVariables[headName].stateValues.xs).eqls([headx, heady]);
      expect(stateVariables[displacementName].stateValues.tail).eqls([displacementTailShiftx, displacementTailShifty]);
      expect(stateVariables[displacementName].stateValues.head).eqls([displacementx + displacementTailShiftx, displacementy + displacementTailShifty]);
      expect(stateVariables[displacementName].stateValues.displacement).eqls([displacementx, displacementy]);
    })

  }

  it('vector with no arguments, head/tail/displacement copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector/>
  </graph>

  <graph>
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 0;
    let taily = 0;
    let headx = 1;
    let heady = 0;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 0;
    let taily = 0;
    let headx = 0;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 4;
    let taily = 1;
    let headx = 4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied head moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied tail')
    cy.window().then(async (win) => {

      tailx = -3;
      taily = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      tailx = headx - displacementx;
      taily = heady - displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied head moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied tail')
    cy.window().then(async (win) => {

      tailx = -3;
      taily = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      tailx = headx - displacementx;
      taily = heady - displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied head moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied tail')
    cy.window().then(async (win) => {

      tailx = -3;
      taily = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      tailx = headx - displacementx;
      taily = heady - displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied head moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied tail')
    cy.window().then(async (win) => {

      tailx = -3;
      taily = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      tailx = headx - displacementx;
      taily = heady - displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied head moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied tail')
    cy.window().then(async (win) => {

      tailx = -3;
      taily = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      tailx = headx - displacementx;
      taily = heady - displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied head moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied tail')
    cy.window().then(async (win) => {

      tailx = -3;
      taily = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      tailx = headx - displacementx;
      taily = heady - displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = -4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied head moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied tail')
    cy.window().then(async (win) => {

      tailx = -3;
      taily = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      tailx = headx - displacementx;
      taily = heady - displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -5;
      heady = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied tail')
    cy.window().then(async (win) => {

      tailx = -3;
      taily = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 4;
    let taily = 1;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -5;
      heady = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied tail')
    cy.window().then(async (win) => {

      tailx = -3;
      taily = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
 `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let tailx = 3;
    let taily = 4;
    let headx = 4;
    let heady = 4;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })
  })


  it('copied vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph newNamespace name="g1">
    <vector tail="(-1,2)" head="(-2,3)" name="vector1" />
    <point>(-4,7)</point>
    <point>(3,5)</point>
    <vector tail="$_point1" head="$_point2" name="vector2" />
    <vector tail="(-9,-1)" head="(-3,6)" name="vector3" />
  </graph>

  <graph newNamespace name="g2">
    <copy target="/g1/vector1" assignNames="vector1" />
    <copy target="/g1/vector2" assignNames="vector2" />
    <copy target="/g1/vector3" assignNames="vector3" />
  </graph>

  <copy target="g2" assignNames="g3" />

  <copy target="g3/vector1" assignNames="vector1" />
  <copy target="g3/vector2" assignNames="vector2" />
  <copy target="g3/vector3" assignNames="vector3" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let vector1s = ['/g1/vector1', '/g2/vector1', '/g3/vector1', '/vector1'];
    let vector2s = ['/g1/vector2', '/g2/vector2', '/g3/vector2', '/vector2'];
    let vector3s = ['/g1/vector3', '/g2/vector3', '/g3/vector3', '/vector3'];


    cy.log("initial state")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
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
        expect(stateVariables[name].stateValues.tail).eqls([v1tx, v1ty]);
        expect(stateVariables[name].stateValues.head).eqls([v1hx, v1hy]);
      }
      for (let name of vector2s) {
        expect(stateVariables[name].stateValues.tail).eqls([v2tx, v2ty]);
        expect(stateVariables[name].stateValues.head).eqls([v2hx, v2hy]);
      }
      for (let name of vector3s) {
        expect(stateVariables[name].stateValues.tail).eqls([v3tx, v3ty]);
        expect(stateVariables[name].stateValues.head).eqls([v3hx, v3hy]);
      }

    })

    cy.log('move vector1')
    cy.window().then(async (win) => {

      let v1tx = 5;
      let v1ty = -8;
      let v1hx = 4;
      let v1hy = -9;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g1/vector1",
        args: {
          tailcoords: [v1tx, v1ty],
          headcoords: [v1hx, v1hy]
        }
      })

      let v2tx = -4;
      let v2ty = 7;
      let v2hx = 3;
      let v2hy = 5;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get('#\\/vector1 .mjx-mrow').should('contain.text', `(${nInDOM(v1hx - v1tx)},${nInDOM(v1hy - v1ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of vector1s) {
          expect(stateVariables[name].stateValues.tail).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.head).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(stateVariables[name].stateValues.tail).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.head).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(stateVariables[name].stateValues.tail).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.head).eqls([v3hx, v3hy]);
        }
      })
    })

    cy.log('move vector4')
    cy.window().then(async (win) => {

      let v1tx = 2;
      let v1ty = 6;
      let v1hx = -2;
      let v1hy = -4;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g2/vector1",
        args: {
          tailcoords: [v1tx, v1ty],
          headcoords: [v1hx, v1hy]
        }
      })

      let v2tx = -4;
      let v2ty = 7;
      let v2hx = 3;
      let v2hy = 5;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get('#\\/vector1 .mjx-mrow').should('contain.text', `(${nInDOM(v1hx - v1tx)},${nInDOM(v1hy - v1ty)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of vector1s) {
          expect(stateVariables[name].stateValues.tail).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.head).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(stateVariables[name].stateValues.tail).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.head).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(stateVariables[name].stateValues.tail).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.head).eqls([v3hx, v3hy]);
        }
      })
    })

    cy.log('move vector7')
    cy.window().then(async (win) => {

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g3/vector1",
        args: {
          tailcoords: [v1tx, v1ty],
          headcoords: [v1hx, v1hy]
        }
      })
      let v2tx = -4;
      let v2ty = 7;
      let v2hx = 3;
      let v2hy = 5;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get('#\\/vector1 .mjx-mrow').should('contain.text', `(${nInDOM(v1hx - v1tx)},${nInDOM(v1hy - v1ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of vector1s) {
          expect(stateVariables[name].stateValues.tail).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.head).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(stateVariables[name].stateValues.tail).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.head).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(stateVariables[name].stateValues.tail).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.head).eqls([v3hx, v3hy]);
        }
      })
    })

    cy.log('move vector2')
    cy.window().then(async (win) => {

      let v2tx = -4;
      let v2ty = 7;
      let v2hx = 3;
      let v2hy = 5;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g1/vector2",
        args: {
          tailcoords: [v2tx, v2ty],
          headcoords: [v2hx, v2hy]
        }
      })

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get('#\\/vector2 .mjx-mrow').should('contain.text', `(${nInDOM(v2hx - v2tx)},${nInDOM(v2hy - v2ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of vector1s) {
          expect(stateVariables[name].stateValues.tail).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.head).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(stateVariables[name].stateValues.tail).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.head).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(stateVariables[name].stateValues.tail).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.head).eqls([v3hx, v3hy]);
        }
      })
    })

    cy.log('move vector5')
    cy.window().then(async (win) => {

      let v2tx = 6;
      let v2ty = -2;
      let v2hx = 1;
      let v2hy = -7;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g2/vector2",
        args: {
          tailcoords: [v2tx, v2ty],
          headcoords: [v2hx, v2hy]
        }
      })

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get('#\\/vector2 .mjx-mrow').should('contain.text', `(${nInDOM(v2hx - v2tx)},${nInDOM(v2hy - v2ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of vector1s) {
          expect(stateVariables[name].stateValues.tail).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.head).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(stateVariables[name].stateValues.tail).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.head).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(stateVariables[name].stateValues.tail).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.head).eqls([v3hx, v3hy]);
        }
      })
    })

    cy.log('move vector8')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let v2tx = -3;
      let v2ty = -6;
      let v2hx = 5;
      let v2hy = -9;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g3/vector2",
        args: {
          tailcoords: [v2tx, v2ty],
          headcoords: [v2hx, v2hy]
        }
      })

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get('#\\/vector2 .mjx-mrow').should('contain.text', `(${nInDOM(v2hx - v2tx)},${nInDOM(v2hy - v2ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of vector1s) {
          expect(stateVariables[name].stateValues.tail).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.head).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(stateVariables[name].stateValues.tail).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.head).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(stateVariables[name].stateValues.tail).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.head).eqls([v3hx, v3hy]);
        }
      })
    })

    cy.log('move vector3')
    cy.window().then(async (win) => {

      let v3tx = 6;
      let v3ty = -8;
      let v3hx = -1;
      let v3hy = 0;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g1/vector3",
        args: {
          tailcoords: [v3tx, v3ty],
          headcoords: [v3hx, v3hy]
        }
      })

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v2ty = -6;
      let v2tx = -3;
      let v2hx = 5;
      let v2hy = -9;

      cy.get('#\\/vector3 .mjx-mrow').should('contain.text', `(${nInDOM(v3hx - v3tx)},${nInDOM(v3hy - v3ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of vector1s) {
          expect(stateVariables[name].stateValues.tail).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.head).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(stateVariables[name].stateValues.tail).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.head).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(stateVariables[name].stateValues.tail).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.head).eqls([v3hx, v3hy]);
        }
      })
    })

    cy.log('move vector6')
    cy.window().then(async (win) => {

      let v3tx = 3;
      let v3ty = 1;
      let v3hx = -7;
      let v3hy = -2;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g2/vector3",
        args: {
          tailcoords: [v3tx, v3ty],
          headcoords: [v3hx, v3hy]
        }
      })

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v2ty = -6;
      let v2tx = -3;
      let v2hx = 5;
      let v2hy = -9;

      cy.get('#\\/vector3 .mjx-mrow').should('contain.text', `(${nInDOM(v3hx - v3tx)},${nInDOM(v3hy - v3ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of vector1s) {
          expect(stateVariables[name].stateValues.tail).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.head).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(stateVariables[name].stateValues.tail).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.head).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(stateVariables[name].stateValues.tail).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.head).eqls([v3hx, v3hy]);
        }
      })
    })

    cy.log('move vector9')
    cy.window().then(async (win) => {

      let v3tx = -2;
      let v3ty = 7;
      let v3hx = 5;
      let v3hy = -6;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g3/vector3",
        args: {
          tailcoords: [v3tx, v3ty],
          headcoords: [v3hx, v3hy]
        }
      })

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v2ty = -6;
      let v2tx = -3;
      let v2hx = 5;
      let v2hy = -9;


      cy.get('#\\/vector3 .mjx-mrow').should('contain.text', `(${nInDOM(v3hx - v3tx)},${nInDOM(v3hy - v3ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of vector1s) {
          expect(stateVariables[name].stateValues.tail).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.head).eqls([v1hx, v1hy]);
        }
        for (let name of vector2s) {
          expect(stateVariables[name].stateValues.tail).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.head).eqls([v2hx, v2hy]);
        }
        for (let name of vector3s) {
          expect(stateVariables[name].stateValues.tail).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.head).eqls([v3hx, v3hy]);
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
  <vector name="vector1"><vector name="d">(1,2)</vector></vector>
  </graph>
  
  <graph>
  <copy target="vector1" assignNames="vector2" />
  </graph>
  
  <graph>
  <copy target="d" assignNames="vector3" />
  </graph>

  <graph>
  <copy prop="displacement" target="vector1" assignNames="vector4" />
  </graph>

  <copy target="vector1" assignNames="v1a" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    let vectors = ['/vector1', '/vector2'];
    let displacements = ['/vector3', '/vector4'];

    cy.log("initial state")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
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
        expect(stateVariables[name].stateValues.tail).eqls([vector_tx, vector_ty]);
        expect(stateVariables[name].stateValues.head).eqls([vector_hx, vector_hy]);
        expect(stateVariables[name].stateValues.displacement).eqls([displacement_x, displacement_y]);
      }
      for (let i = 0; i < 2; i++) {
        let name = displacements[i];
        expect(stateVariables[name].stateValues.tail).eqls([dtail_xs[i], dtail_ys[i]]);
        expect(stateVariables[name].stateValues.head).eqls([dhead_xs[i], dhead_ys[i]]);
        expect(stateVariables[name].stateValues.displacement).eqls([displacement_x, displacement_y]);
      }

    })

    cy.log("move vectors")
    cy.window().then(async (win) => {
      let txs = [-4, 7]
      let tys = [9, 3];
      let hxs = [6, -2]
      let hys = [5, 0];

      for (let i = 0; i < 2; i++) {
        cy.window().then(async (win) => {

          let vector_tx = txs[i];
          let vector_ty = tys[i];
          let vector_hx = hxs[i];
          let vector_hy = hys[i];

          win.callAction1({
            actionName: "moveVector",
            componentName: vectors[i],
            args: {
              tailcoords: [vector_tx, vector_ty],
              headcoords: [vector_hx, vector_hy]
            }
          })

          let displacement_x = vector_hx - vector_tx;
          let displacement_y = vector_hy - vector_ty;
          let dtail_xs = [0, 0];
          let dtail_ys = [0, 0];
          let dhead_xs = dtail_xs.map(x => x + displacement_x);
          let dhead_ys = dtail_ys.map(y => y + displacement_y);

          cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(displacement_x)},${nInDOM(displacement_y)})`)

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            for (let name of vectors) {
              expect(stateVariables[name].stateValues.tail).eqls([vector_tx, vector_ty]);
              expect(stateVariables[name].stateValues.head).eqls([vector_hx, vector_hy]);
              expect(stateVariables[name].stateValues.displacement).eqls([displacement_x, displacement_y]);
            }
            for (let i = 0; i < 2; i++) {
              let name = displacements[i];
              expect(stateVariables[name].stateValues.tail).eqls([dtail_xs[i], dtail_ys[i]]);
              expect(stateVariables[name].stateValues.head).eqls([dhead_xs[i], dhead_ys[i]]);
              expect(stateVariables[name].stateValues.displacement).eqls([displacement_x, displacement_y]);
            }
          })
        })
      }
    })

    cy.log("move displacements")
    cy.window().then(async (win) => {

      let vector_tx = 7;
      let vector_ty = 3;
      let dtail_xs = [0, 0];
      let dtail_ys = [0, 0];

      let txs = [7, 0]
      let tys = [-3, 4];
      let hxs = [8, -7]
      let hys = [-2, 1];

      for (let i = 0; i < 2; i++) {

        cy.window().then(async (win) => {

          let displacement_x = hxs[i] - txs[i];
          let displacement_y = hys[i] - tys[i];
          dtail_xs[i] = txs[i];
          dtail_ys[i] = tys[i];
          let dhead_xs = dtail_xs.map(x => x + displacement_x);
          let dhead_ys = dtail_ys.map(y => y + displacement_y);
          let vector_hx = vector_tx + displacement_x;
          let vector_hy = vector_ty + displacement_y;


          win.callAction1({
            actionName: "moveVector",
            componentName: displacements[i],
            args: {
              tailcoords: [dtail_xs[i], dtail_ys[i]],
              headcoords: [dhead_xs[i], dhead_ys[i]]
            }
          })


          cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(displacement_x)},${nInDOM(displacement_y)})`)

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            for (let name of vectors) {
              expect(stateVariables[name].stateValues.tail).eqls([vector_tx, vector_ty]);
              expect(stateVariables[name].stateValues.head).eqls([vector_hx, vector_hy]);
              expect(stateVariables[name].stateValues.displacement).eqls([displacement_x, displacement_y]);
            }
            for (let j = 0; j < 2; j++) {
              let name = displacements[j];
              expect(stateVariables[name].stateValues.tail).eqls([dtail_xs[j], dtail_ys[j]]);
              expect(stateVariables[name].stateValues.head).eqls([dhead_xs[j], dhead_ys[j]]);
              expect(stateVariables[name].stateValues.displacement).eqls([displacement_x, displacement_y]);
            }
          })
        })
      }
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
  <copy target="_vector1" assignNames="v1a" />
  <copy target="_point3" assignNames="p3a" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('check initial values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.tail).eqls([1, 2]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([3, 4]);
      expect(stateVariables['/_point3'].stateValues.xs[0]).eq(1);
      expect(stateVariables['/_point3'].stateValues.xs[1]).eq(2);
    });

    cy.log('move vector to 45 degrees')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: '/_vector1',
        args: {
          tailcoords: [-4, 4],
          headcoords: [4, -4],
        }
      })
    })

    cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(8)},${nInDOM(-8)})`)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_vector1'].stateValues.tail).eqls([-4, 4]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([4, -4]);

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

      expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(p5x, 1E-12);
      expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let xorig = 10;
      let yorig = 1;


      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig }
      })


      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get('#\\/p3a .mjx-mrow').should('contain.text', `(${nInDOM(p5x)},${nInDOM(p5y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(p5x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(p5y, 1E-12);
      })
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let xorig = 9;
      let yorig = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig }
      })

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get('#\\/p3a .mjx-mrow').should('contain.text', `(${nInDOM(p5x)},${nInDOM(p5y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(p5x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(p5y, 1E-12);
      });
    })

    cy.log('move point')
    cy.window().then(async (win) => {
      let xorig = -9;
      let yorig = 7;


      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig }
      })

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get('#\\/p3a .mjx-mrow').should('contain.text', `(${nInDOM(p5x)},${nInDOM(p5y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(p5x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(p5y, 1E-12);
      })
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
  <copy target="_vector1" assignNames="v1a" />
  <copy target="_point3" assignNames="p3a" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('check initial values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.tail).eqls([1, 2]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([3, 4]);
      expect(stateVariables['/_point3'].stateValues.xs[0]).eq(-5);
      expect(stateVariables['/_point3'].stateValues.xs[1]).eq(2);
    });

    cy.log('move vector to 45 degrees')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: '/_vector1',
        args: {
          tailcoords: [-4, 4],
          headcoords: [4, -4],
        }
      })
    })

    cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(8)},${nInDOM(-8)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.tail).eqls([-4, 4]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([4, -4]);
      expect(stateVariables['/_point3'].stateValues.xs[0]).eq(-5)
      expect(stateVariables['/_point3'].stateValues.xs[1]).eq(2)
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let xorig = 3.3;
      let yorig = -3.6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig }
      })


      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get('#\\/p3a .mjx-mrow').should('contain.text', `(${nInDOM(p5x)},${nInDOM(p5y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(p5x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(p5y, 1E-12);
      });
    })

    cy.log('move point')
    cy.window().then(async (win) => {
      let xorig = 4.3;
      let yorig = -4.6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig }
      })

      cy.get('#\\/p3a .mjx-mrow').should('contain.text', `(${nInDOM(4.3)},${nInDOM(-4.6)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(4.3, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(-4.6, 1E-12);
      });
    })

    cy.log('move point')
    cy.window().then(async (win) => {
      let xorig = -2.4;
      let yorig = 2.8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig }
      })

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get('#\\/p3a .mjx-mrow').should('contain.text', `(${nInDOM(Math.round(p5x * 10) / 10)},${nInDOM(Math.round(p5y * 10) / 10)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(p5x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(p5y, 1E-12);
      });
    })

    cy.log('move point')
    cy.window().then(async (win) => {
      let xorig = -4.2;
      let yorig = 4.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig }
      })

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;


      cy.get('#\\/p3a .mjx-mrow').should('contain.text', `(${nInDOM(p5x)},${nInDOM(p5y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(p5x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(p5y, 1E-12);
      });
    })

    cy.log('move point')
    cy.window().then(async (win) => {
      let xorig = -4.4;
      let yorig = 4.5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig }
      })

      cy.get('#\\/p3a .mjx-mrow').should('contain.text', `(${nInDOM(-4.4)},${nInDOM(4.5)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(-4.4, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(4.5, 1E-12);
      });
    })

  })

  it('constrain to vector, different scales from graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <vector head="(-1,-0.05)" tail="(1,0.05)" name="l" />
    <point x="100" y="0" name="P">
      <constraints baseOnGraph="_graph1">
        <constrainTo><copy target="l" /></constrainTo>
      </constraints>
    </point>
  </graph>
  <copy target="P" assignNames="Pa" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log(`point on vector, close to origin`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/P'].stateValues.xs[0];
      let y = stateVariables['/P'].stateValues.xs[1];

      expect(y).greaterThan(0);
      expect(y).lessThan(0.01);

      expect(x).closeTo(20 * y, 1E-10)
    })

    cy.log(`move point`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -100, y: 0.05 }
      })
    })

    cy.get('#\\/Pa .mjx-mrow').should('contain.text', `0.04`)

    cy.window().then(async (win) => {

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/P'].stateValues.xs[0];
      let y = stateVariables['/P'].stateValues.xs[1];
      expect(y).lessThan(0.05);
      expect(y).greaterThan(0.04);
      expect(x).closeTo(20 * y, 1E-10)
    })

    cy.log(`move point past end`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -100, y: 0.1 }
      })
    })

    cy.get('#\\/Pa .mjx-mrow').should('contain.text', `0.05`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/P'].stateValues.xs[0];
      let y = stateVariables['/P'].stateValues.xs[1];
      expect(y).eq(0.05);
      expect(x).closeTo(20 * y, 1E-10)
    })

  });

  it('two update paths through vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <point name="zeroFixed" fixed>(0,0)</point>
  <mathinput name="a" prefill="2" modifyIndirectly="false" />
  <graph>
    <vector name="original" tail="$zeroFixed" head="(1,3)" />
  </graph>
  <graph>
    <vector name="multiplied" tail="$zeroFixed" head="($a$(original{prop='headX1'}), $a$(original{prop='headX2'}))" />
  </graph>
  <copy target='original' assignNames="o2" />
  <copy target='multiplied' assignNames="m2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('check initial values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/original'].stateValues.tail).eqls([0, 0]);
      expect(stateVariables['/original'].stateValues.head).eqls([1, 3]);
      expect(stateVariables['/multiplied'].stateValues.tail).eqls([0, 0]);
      expect(stateVariables['/multiplied'].stateValues.head).eqls([2, 6]);
    });

    cy.log('move original vector')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: '/original',
        args: {
          headcoords: [-5, 1],
        }
      })
    })

    cy.get('#\\/o2 .mjx-mrow').should('contain.text', `(${nInDOM(-5)},${nInDOM(1)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/original'].stateValues.tail).eqls([0, 0]);
      expect(stateVariables['/original'].stateValues.head).eqls([-5, 1]);
      expect(stateVariables['/multiplied'].stateValues.tail).eqls([0, 0]);
      expect(stateVariables['/multiplied'].stateValues.head).eqls([-10, 2]);
    });

    cy.log('move multiplied vector')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: '/multiplied',
        args: {
          headcoords: [6, -8],
        }
      })
    })

    cy.get('#\\/m2 .mjx-mrow').should('contain.text', `(${nInDOM(6)},${nInDOM(-8)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/original'].stateValues.tail).eqls([0, 0]);
      expect(stateVariables['/original'].stateValues.head).eqls([3, -4]);
      expect(stateVariables['/multiplied'].stateValues.tail).eqls([0, 0]);
      expect(stateVariables['/multiplied'].stateValues.head).eqls([6, -8]);
    });

    cy.log("Change factor");
    cy.get('#\\/a textarea').type(`{end}{backspace}-3{enter}`, { force: true });

    cy.get('#\\/m2 .mjx-mrow').should('contain.text', `(${nInDOM(-9)},${nInDOM(12)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/original'].stateValues.tail).eqls([0, 0]);
      expect(stateVariables['/original'].stateValues.head).eqls([3, -4]);
      expect(stateVariables['/multiplied'].stateValues.tail).eqls([0, 0]);
      expect(stateVariables['/multiplied'].stateValues.head).eqls([-9, 12]);
    });

    cy.log('move multiplied vector again')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: '/multiplied',
        args: {
          headcoords: [-6, -3],
        }
      })
    })

    cy.get('#\\/m2 .mjx-mrow').should('contain.text', `(${nInDOM(-6)},${nInDOM(-3)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/original'].stateValues.tail).eqls([0, 0]);
      expect(stateVariables['/original'].stateValues.head).eqls([2, 1]);
      expect(stateVariables['/multiplied'].stateValues.tail).eqls([0, 0]);
      expect(stateVariables['/multiplied'].stateValues.head).eqls([-6, -3]);
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
  <copy target="u" assignNames="u2" />
  <copy target="v" assignNames="v2" />
  <copy target="w" assignNames="w2" />
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
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/u'].stateValues.tail).eqls([...uTail]);
      expect(stateVariables['/u'].stateValues.head).eqls([...uHead]);
      expect(stateVariables['/u'].stateValues.displacement).eqls([...u]);
      expect(stateVariables['/v'].stateValues.tail).eqls([...vTail]);
      expect(stateVariables['/v'].stateValues.head).eqls([...vHead]);
      expect(stateVariables['/v'].stateValues.displacement).eqls([...v]);
      expect(stateVariables['/w'].stateValues.tail).eqls([...wTail]);
      expect(stateVariables['/w'].stateValues.head).eqls([...wHead]);
      expect(stateVariables['/w'].stateValues.displacement).eqls([...w]);
    });

    cy.log('moving tail of v just moves head of u')
    cy.window().then(async (win) => {
      vTail = [-3, 2];
      uHead = vTail;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v',
        args: {
          tailcoords: vTail
        }
      })


      u = uHead.map((x, i) => x - uTail[i]);

      v = vHead.map((x, i) => x - vTail[i]);

      cy.get('#\\/u2 .mjx-mrow').should('contain.text', `(${nInDOM(u[0])},${nInDOM(u[1])})`)


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/u'].stateValues.tail).eqls([...uTail]);
        expect(stateVariables['/u'].stateValues.head).eqls([...uHead]);
        expect(stateVariables['/u'].stateValues.displacement).eqls([...u]);
        expect(stateVariables['/v'].stateValues.tail).eqls([...vTail]);
        expect(stateVariables['/v'].stateValues.head).eqls([...vHead]);
        expect(stateVariables['/v'].stateValues.displacement).eqls([...v]);
        expect(stateVariables['/w'].stateValues.tail).eqls([...wTail]);
        expect(stateVariables['/w'].stateValues.head).eqls([...wHead]);
        expect(stateVariables['/w'].stateValues.displacement).eqls([...w]);
      });
    })

    cy.log('moving head of u keeps v displacement fixed')
    cy.window().then(async (win) => {

      uHead = [7, 1];
      vTail = uHead;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/u',
        args: {
          headcoords: uHead
        }
      })

      u = uHead.map((x, i) => x - uTail[i]);

      vHead = v.map((x, i) => x + vTail[i]);
      w = u.map((x, i) => x + v[i]);
      wTail = uTail;
      wHead = w.map((x, i) => x + wTail[i]);

      cy.get('#\\/u2 .mjx-mrow').should('contain.text', `(${nInDOM(u[0])},${nInDOM(u[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/u'].stateValues.tail).eqls([...uTail]);
        expect(stateVariables['/u'].stateValues.head).eqls([...uHead]);
        expect(stateVariables['/u'].stateValues.displacement).eqls([...u]);
        expect(stateVariables['/v'].stateValues.tail).eqls([...vTail]);
        expect(stateVariables['/v'].stateValues.head).eqls([...vHead]);
        expect(stateVariables['/v'].stateValues.displacement).eqls([...v]);
        expect(stateVariables['/w'].stateValues.tail).eqls([...wTail]);
        expect(stateVariables['/w'].stateValues.head).eqls([...wHead]);
        expect(stateVariables['/w'].stateValues.displacement).eqls([...w]);
      });
    })

    cy.log('moving tail of u moves tail of w')
    cy.window().then(async (win) => {

      uTail = [3, 4];

      win.callAction1({
        actionName: "moveVector",
        componentName: '/u',
        args: {
          tailcoords: uTail
        }
      })

      u = uHead.map((x, i) => x - uTail[i]);

      w = u.map((x, i) => x + v[i]);
      wTail = uTail;

      cy.get('#\\/u2 .mjx-mrow').should('contain.text', `(${nInDOM(u[0])},${nInDOM(u[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/u'].stateValues.tail).eqls([...uTail]);
        expect(stateVariables['/u'].stateValues.head).eqls([...uHead]);
        expect(stateVariables['/u'].stateValues.displacement).eqls([...u]);
        expect(stateVariables['/v'].stateValues.tail).eqls([...vTail]);
        expect(stateVariables['/v'].stateValues.head).eqls([...vHead]);
        expect(stateVariables['/v'].stateValues.displacement).eqls([...v]);
        expect(stateVariables['/w'].stateValues.tail).eqls([...wTail]);
        expect(stateVariables['/w'].stateValues.head).eqls([...wHead]);
        expect(stateVariables['/w'].stateValues.displacement).eqls([...w]);
      });
    })

    cy.log('moving tail of w moves tail of u')
    cy.window().then(async (win) => {

      wTail = [-1, 7];

      win.callAction1({
        actionName: "moveVector",
        componentName: '/w',
        args: {
          tailcoords: wTail
        }
      })

      uTail = wTail;

      u = uHead.map((x, i) => x - uTail[i]);
      w = u.map((x, i) => x + v[i]);

      cy.get('#\\/u2 .mjx-mrow').should('contain.text', `(${nInDOM(u[0])},${nInDOM(u[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/u'].stateValues.tail).eqls([...uTail]);
        expect(stateVariables['/u'].stateValues.head).eqls([...uHead]);
        expect(stateVariables['/u'].stateValues.displacement).eqls([...u]);
        expect(stateVariables['/v'].stateValues.tail).eqls([...vTail]);
        expect(stateVariables['/v'].stateValues.head).eqls([...vHead]);
        expect(stateVariables['/v'].stateValues.displacement).eqls([...v]);
        expect(stateVariables['/w'].stateValues.tail).eqls([...wTail]);
        expect(stateVariables['/w'].stateValues.head).eqls([...wHead]);
        expect(stateVariables['/w'].stateValues.displacement).eqls([...w]);
      });
    })

    cy.log('moving head of w moves head of v')
    cy.window().then(async (win) => {

      wHead = [-5, -4];

      win.callAction1({
        actionName: "moveVector",
        componentName: '/w',
        args: {
          headcoords: wHead
        }
      })

      vHead = wHead;
      v = vHead.map((x, i) => x - vTail[i]);

      w = u.map((x, i) => x + v[i]);

      cy.get('#\\/w2 .mjx-mrow').should('contain.text', `(${nInDOM(w[0])},${nInDOM(w[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/u'].stateValues.tail).eqls([...uTail]);
        expect(stateVariables['/u'].stateValues.head).eqls([...uHead]);
        expect(stateVariables['/u'].stateValues.displacement).eqls([...u]);
        expect(stateVariables['/v'].stateValues.tail).eqls([...vTail]);
        expect(stateVariables['/v'].stateValues.head).eqls([...vHead]);
        expect(stateVariables['/v'].stateValues.displacement).eqls([...v]);
        expect(stateVariables['/w'].stateValues.tail).eqls([...wTail]);
        expect(stateVariables['/w'].stateValues.head).eqls([...wHead]);
        expect(stateVariables['/w'].stateValues.displacement).eqls([...w]);
      });
    })

    cy.log('moving head of v moves head of w')
    cy.window().then(async (win) => {

      vHead = [4, -7];

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v',
        args: {
          headcoords: vHead
        }
      })

      wHead = vHead;
      v = vHead.map((x, i) => x - vTail[i]);

      w = u.map((x, i) => x + v[i]);

      cy.get('#\\/w2 .mjx-mrow').should('contain.text', `(${nInDOM(w[0])},${nInDOM(w[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/u'].stateValues.tail).eqls([...uTail]);
        expect(stateVariables['/u'].stateValues.head).eqls([...uHead]);
        expect(stateVariables['/u'].stateValues.displacement).eqls([...u]);
        expect(stateVariables['/v'].stateValues.tail).eqls([...vTail]);
        expect(stateVariables['/v'].stateValues.head).eqls([...vHead]);
        expect(stateVariables['/v'].stateValues.displacement).eqls([...v]);
        expect(stateVariables['/w'].stateValues.tail).eqls([...wTail]);
        expect(stateVariables['/w'].stateValues.head).eqls([...wHead]);
        expect(stateVariables['/w'].stateValues.displacement).eqls([...w]);
      });
    })

  });

  it('copy coordinates off vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector name="u" tail="(1,5)" head="(7,3)" />
  </graph>
  <p>x coordinate of u is <copy assignNames="ux" prop="x" target="u" /></p>
  <p>y coordinate of u is <copy assignNames="uy" prop="y" target="u" /></p>
  <p>x1 coordinate of u is <copy assignNames="ux1" prop="x1" target="u" /></p>
  <p>x2 coordinate of u is <copy assignNames="ux2" prop="x2" target="u" /></p>

  <vector name="v" tail="(9,1,-3)" head="(-3,10,8)" />
  <p>x coordinate of v is <copy assignNames="vx" prop="x" target="v" /></p>
  <p>y coordinate of v is <copy assignNames="vy" prop="y" target="v" /></p>
  <p>z coordinate of v is <copy assignNames="vz" prop="z" target="v" /></p>
  <p>x1 coordinate of v is <copy assignNames="vx1" prop="x1" target="v" /></p>
  <p>x2 coordinate of v is <copy assignNames="vx2" prop="x2" target="v" /></p>
  <p>x3 coordinate of v is <copy assignNames="vx3" prop="x3" target="v" /></p>
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
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/u'].stateValues.tail).eqls([...uTail]);
      expect(stateVariables['/u'].stateValues.head).eqls([...uHead]);
      expect(stateVariables['/u'].stateValues.displacement).eqls([...u]);
      expect(stateVariables['/v'].stateValues.tail).eqls([...vTail]);
      expect(stateVariables['/v'].stateValues.head).eqls([...vHead]);
      expect(stateVariables['/v'].stateValues.displacement).eqls([...v]);

      expect(stateVariables['/ux'].stateValues.value).eqls(u[0]);
      expect(stateVariables['/uy'].stateValues.value).eqls(u[1]);
      expect(stateVariables['/ux1'].stateValues.value).eqls(u[0]);
      expect(stateVariables['/ux2'].stateValues.value).eqls(u[1]);
      expect(stateVariables['/vx'].stateValues.value).eqls(v[0]);
      expect(stateVariables['/vy'].stateValues.value).eqls(v[1]);
      expect(stateVariables['/vz'].stateValues.value).eqls(v[2]);
      expect(stateVariables['/vx1'].stateValues.value).eqls(v[0]);
      expect(stateVariables['/vx2'].stateValues.value).eqls(v[1]);
      expect(stateVariables['/vx3'].stateValues.value).eqls(v[2]);

    });

  });

  it('combining displacement components through copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <vector name="v1" tail="(1,2)" head="(3,5)" />
    <copy assignNames="v2" target="v1" />
    <copy assignNames="v3" prop="displacement" target="v1" />
    <vector name="v4" displacement="($(v2{prop='y'}), $(v3{prop='x'}))" />
  </graph>
  <copy target="v1" assignNames="v1a" />
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
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
      expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
      expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

      expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
      expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
      expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

      expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
      expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
      expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

      expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
      expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
      expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

    });

    cy.log("move head of vector 1")
    cy.window().then(async (win) => {

      let hx = 3, hy = 7;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v1',
        args: {
          headcoords: [hx, hy]
        }
      })

      x = hx - t1x;
      y = hy - t1y;

      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      });
    })

    cy.log("move tail of vector 1")
    cy.window().then(async (win) => {

      let tx = -2, ty = -1;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v1',
        args: {
          tailcoords: [tx, ty]
        }
      })

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;

      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);
      })
    });

    cy.log("move head of vector 2")
    cy.window().then(async (win) => {

      let hx = 4, hy = 1;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v2',
        args: {
          headcoords: [hx, hy]
        }
      })

      x = hx - t1x;
      y = hy - t1y;


      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);
      })
    });

    cy.log("move tail of vector 2")
    cy.window().then(async (win) => {
      let tx = 5, ty = 7;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v2',
        args: {
          tailcoords: [tx, ty]
        }
      })

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;

      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });

    cy.log("move head of vector 3")
    cy.window().then(async (win) => {

      let hx = -6, hy = 3;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v3',
        args: {
          headcoords: [hx, hy]
        }
      })

      x = hx - t3x;
      y = hy - t3y;

      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });

    cy.log("move tail of vector 3")
    cy.window().then(async (win) => {

      let tx = -1, ty = 4;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v3',
        args: {
          tailcoords: [tx, ty]
        }
      })

      x += t3x - tx;
      y += t3y - ty;
      t3x = tx;
      t3y = ty;

      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });

    cy.log("move head of vector 4")
    cy.window().then(async (win) => {

      let hx = 6, hy = -2;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v4',
        args: {
          headcoords: [hx, hy]
        }
      })

      x = hy - t4y;
      y = hx - t4x;

      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      });
    })

    cy.log("move tail of vector 4")
    cy.window().then(async (win) => {

      let tx = 7, ty = 2;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v4',
        args: {
          tailcoords: [tx, ty]
        }
      })

      x += t4y - ty;
      y += t4x - tx;
      t4x = tx;
      t4y = ty;

      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });


  })

  it('combining displacement components through copies 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <vector name="v1" tail="(1,2)" head="(3,5)" />
    <copy assignNames="v2" target="v1" />
    <copy assignNames="v3" prop="displacement" target="v1" />
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
  <copy target="v1" assignNames="v1a" />
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
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
      expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
      expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

      expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
      expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
      expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

      expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
      expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
      expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

      expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
      expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
      expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

    });

    cy.log("move head of vector 1")
    cy.window().then(async (win) => {

      let hx = 3, hy = 7;
      win.callAction1({
        actionName: "moveVector",
        componentName: '/v1',
        args: {
          headcoords: [hx, hy]
        }
      })

      x = hx - t1x;
      y = hy - t1y;

      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      });
    })

    cy.log("move tail of vector 1")
    cy.window().then(async (win) => {

      let tx = -2, ty = -1;
      win.callAction1({
        actionName: "moveVector",
        componentName: '/v1',
        args: {
          tailcoords: [tx, ty]
        }
      })

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;


      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });

    cy.log("move head of vector 2")
    cy.window().then(async (win) => {

      let hx = 4, hy = 1;
      win.callAction1({
        actionName: "moveVector",
        componentName: '/v2',
        args: {
          headcoords: [hx, hy]
        }
      })

      x = hx - t1x;
      y = hy - t1y;

      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });

    cy.log("move tail of vector 2")
    cy.window().then(async (win) => {

      let tx = 5, ty = 7;
      win.callAction1({
        actionName: "moveVector",
        componentName: '/v2',
        args: {
          tailcoords: [tx, ty]
        }
      })

      x += t1x - tx;
      y += t1y - ty;
      t1x = tx;
      t1y = ty;


      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });

    cy.log("move head of vector 3")
    cy.window().then(async (win) => {

      let hx = -6, hy = 3;
      win.callAction1({
        actionName: "moveVector",
        componentName: '/v3',
        args: {
          headcoords: [hx, hy]
        }
      })

      x = hx - t3x;
      y = hy - t3y;


      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });

    cy.log("move tail of vector 3")
    cy.window().then(async (win) => {

      let tx = -1, ty = 4;
      win.callAction1({
        actionName: "moveVector",
        componentName: '/v3',
        args: {
          tailcoords: [tx, ty]
        }
      })

      x += t3x - tx;
      y += t3y - ty;
      t3x = tx;
      t3y = ty;


      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });

    cy.log("move head of vector 4")
    cy.window().then(async (win) => {

      let hx = 6, hy = -2;
      win.callAction1({
        actionName: "moveVector",
        componentName: '/v4',
        args: {
          headcoords: [hx, hy]
        }
      })

      x = hy - t4y;
      y = hx - t4x;


      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });

    cy.log("move tail of vector 4")
    cy.window().then(async (win) => {

      let tx = 7, ty = 2;
      win.callAction1({
        actionName: "moveVector",
        componentName: '/v4',
        args: {
          tailcoords: [tx, ty]
        }
      })

      x += t4y - ty;
      y += t4x - tx;
      t4x = tx;
      t4y = ty;

      cy.get('#\\/v1a .mjx-mrow').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v1'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v1'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v1'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v2'].stateValues.tail).eqls([t1x, t1y]);
        expect(stateVariables['/v2'].stateValues.head).eqls([t1x + x, t1y + y]);
        expect(stateVariables['/v2'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v3'].stateValues.tail).eqls([t3x, t3y]);
        expect(stateVariables['/v3'].stateValues.head).eqls([t3x + x, t3y + y]);
        expect(stateVariables['/v3'].stateValues.displacement).eqls([x, y]);

        expect(stateVariables['/v4'].stateValues.tail).eqls([t4x, t4y]);
        expect(stateVariables['/v4'].stateValues.head).eqls([t4x + y, t4y + x]);
        expect(stateVariables['/v4'].stateValues.displacement).eqls([y, x]);

      })
    });


  })

  it('combining components of head and tail through copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <vector name="v" tail="(1,2)" head="(-2,3)" />
  <copy prop="head" assignNames="vh" target="v" />
  <copy prop="tail" assignNames="vt" target="v" />
  <point name="c" x="$(vh{prop='x'})" y="$(vt{prop='y'})"/>
  </graph>
  <copy target="v" assignNames="va" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tx = 1, ty = 2, hx = -2, hy = 3;

    cy.log("initial positions")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/v'].stateValues.tail).eqls([tx, ty]);
      expect(stateVariables['/v'].stateValues.head).eqls([hx, hy]);
      expect(stateVariables['/v'].stateValues.displacement).eqls([hx - tx, hy - ty]);

      expect(stateVariables['/vt'].stateValues.coords).eqls(["vector", tx, ty]);
      expect(stateVariables['/vh'].stateValues.coords).eqls(["vector", hx, hy]);
      expect(stateVariables['/c'].stateValues.coords).eqls(["vector", hx, ty]);

    });

    cy.log("move vector 1")
    cy.window().then(async (win) => {

      tx = 3, ty = -1, hx = -4, hy = 7;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/v',
        args: {
          headcoords: [hx, hy], tailcoords: [tx, ty]
        }
      })

      cy.get('#\\/va .mjx-mrow').should('contain.text', `(${nInDOM(hx - tx)},${nInDOM(hy - ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v'].stateValues.tail).eqls([tx, ty]);
        expect(stateVariables['/v'].stateValues.head).eqls([hx, hy]);
        expect(stateVariables['/v'].stateValues.displacement).eqls([hx - tx, hy - ty]);

        expect(stateVariables['/vt'].stateValues.coords).eqls(["vector", tx, ty]);
        expect(stateVariables['/vh'].stateValues.coords).eqls(["vector", hx, hy]);
        expect(stateVariables['/c'].stateValues.coords).eqls(["vector", hx, ty]);
      })
    });


    cy.log("move head point")
    cy.window().then(async (win) => {

      hx = 2, hy = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/vh",
        args: { x: hx, y: hy }
      })

      cy.get('#\\/va .mjx-mrow').should('contain.text', `(${nInDOM(hx - tx)},${nInDOM(hy - ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v'].stateValues.tail).eqls([tx, ty]);
        expect(stateVariables['/v'].stateValues.head).eqls([hx, hy]);
        expect(stateVariables['/v'].stateValues.displacement).eqls([hx - tx, hy - ty]);

        expect(stateVariables['/vt'].stateValues.coords).eqls(["vector", tx, ty]);
        expect(stateVariables['/vh'].stateValues.coords).eqls(["vector", hx, hy]);
        expect(stateVariables['/c'].stateValues.coords).eqls(["vector", hx, ty]);

      })
    });


    cy.log("move tail point")
    cy.window().then(async (win) => {

      tx = -3, ty = 10;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/vt",
        args: { x: tx, y: ty }
      })

      cy.get('#\\/va .mjx-mrow').should('contain.text', `(${nInDOM(hx - tx)},${nInDOM(hy - ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v'].stateValues.tail).eqls([tx, ty]);
        expect(stateVariables['/v'].stateValues.head).eqls([hx, hy]);
        expect(stateVariables['/v'].stateValues.displacement).eqls([hx - tx, hy - ty]);

        expect(stateVariables['/vt'].stateValues.coords).eqls(["vector", tx, ty]);
        expect(stateVariables['/vh'].stateValues.coords).eqls(["vector", hx, hy]);
        expect(stateVariables['/c'].stateValues.coords).eqls(["vector", hx, ty]);

      })
    });


    cy.log("move combined point")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      hx = -6, ty = 0;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/c",
        args: { x: hx, y: ty }
      })

      cy.get('#\\/va .mjx-mrow').should('contain.text', `(${nInDOM(hx - tx)},${nInDOM(hy - ty)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/v'].stateValues.tail).eqls([tx, ty]);
        expect(stateVariables['/v'].stateValues.head).eqls([hx, hy]);
        expect(stateVariables['/v'].stateValues.displacement).eqls([hx - tx, hy - ty]);

        expect(stateVariables['/vt'].stateValues.coords).eqls(["vector", tx, ty]);
        expect(stateVariables['/vh'].stateValues.coords).eqls(["vector", hx, hy]);
        expect(stateVariables['/c'].stateValues.coords).eqls(["vector", hx, ty]);

      })
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
  <copy prop="tail" assignNames="tfvt" target="vt" />
  <copy prop="head" assignNames="hfvt" target="vt" />
  <copy prop="displacement" assignNames="dfvt" target="vt" />

  <copy prop="tail" assignNames="tfvh" target="vh" />
  <copy prop="head" assignNames="hfvh" target="vh" />
  <copy prop="displacement" assignNames="dfvh" target="vh" />

  <copy prop="tail" assignNames="tfvd" target="vd" />
  <copy prop="head" assignNames="hfvd" target="vd" />
  <copy prop="displacement" assignNames="dfvd" target="vd" />

  <copy prop="tail" assignNames="tfvth" target="vth" />
  <copy prop="head" assignNames="hfvth" target="vth" />
  <copy prop="displacement" assignNames="dfvth" target="vth" />

  <copy prop="tail" assignNames="tfvtd" target="vtd" />
  <copy prop="head" assignNames="hfvtd" target="vtd" />
  <copy prop="displacement" assignNames="dfvtd" target="vtd" />

  <copy prop="tail" assignNames="tfvhd" target="vhd" />
  <copy prop="head" assignNames="hfvhd" target="vhd" />
  <copy prop="displacement" assignNames="dfvhd" target="vhd" />

  </graph>

  <graph>
  <copy assignNames="vt2" target="vt" />
  <copy assignNames="vh2" target="vh" />
  <copy assignNames="vd2" target="vd" />
  <copy assignNames="vth2" target="vth" />
  <copy assignNames="vtd2" target="vtd" />
  <copy assignNames="vhd2" target="vhd" />
  </graph>

  <graph>
  <copy prop="tail" assignNames="tfvt2" target="vt2" />
  <copy prop="head" assignNames="hfvt2" target="vt2" />
  <copy prop="displacement" assignNames="dfvt2" target="vt2" />

  <copy prop="tail" assignNames="tfvh2" target="vh2" />
  <copy prop="head" assignNames="hfvh2" target="vh2" />
  <copy prop="displacement" assignNames="dfvh2" target="vh2" />

  <copy prop="tail" assignNames="tfvd2" target="vd2" />
  <copy prop="head" assignNames="hfvd2" target="vd2" />
  <copy prop="displacement" assignNames="dfvd2" target="vd2" />

  <copy prop="tail" assignNames="tfvth2" target="vth2" />
  <copy prop="head" assignNames="hfvth2" target="vth2" />
  <copy prop="displacement" assignNames="dfvth2" target="vth2" />

  <copy prop="tail" assignNames="tfvtd2" target="vtd2" />
  <copy prop="head" assignNames="hfvtd2" target="vtd2" />
  <copy prop="displacement" assignNames="dfvtd2" target="vtd2" />

  <copy prop="tail" assignNames="tfvhd2" target="vhd2" />
  <copy prop="head" assignNames="hfvhd2" target="vhd2" />
  <copy prop="displacement" assignNames="dfvhd2" target="vhd2" />

  </graph>

  <copy prop="head" target="dfvhd2" assignNames="dfvhd2_hdom" />
  <copy target="hfvhd2" assignNames="hfvhd2_dom" />
  <copy target="tfvhd2" assignNames="tfvhd2_dom" />
  <copy prop="head" target="vhd2" assignNames="vhd2_hdom" />
  <copy prop="tail" target="vhd2" assignNames="vhd2_tdom" />
  <copy prop="head" target="dfvhd" assignNames="dfvhd_hdom" />
  <copy target="hfvhd" assignNames="hfvhd_dom" />
  <copy target="tfvhd" assignNames="tfvhd_dom" />
  <copy target="dvhd" assignNames="dvhd_dom" />
  <copy target="hvhd" assignNames="hvhd_dom" />
  <copy target="tvtd" assignNames="tvtd_dom" />
  <copy prop="head" target="vhd" assignNames="vhd_hdom" />
  <copy prop="tail" target="vhd" assignNames="vhd_tdom" />

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
      let stateVariables = await win.returnAllStateVariables1();

      expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
      expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
      expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
      expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
      expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
      expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
      expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
      expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
      expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

      expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
      expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
      expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

      expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
      expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
      expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

      expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
      expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
      expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

      expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
      expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
      expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

      expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
      expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
      expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

      expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
      expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
      expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

      expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
      expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
      expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

      expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
      expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
      expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

      expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
      expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
      expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

      expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
      expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
      expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

      expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
      expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
      expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

      expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
      expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
      expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

      expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
      expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
      expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

      expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
      expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
      expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

      expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
      expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
      expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

      expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
      expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
      expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

      expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
      expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
      expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

      expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
      expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
      expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

      expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
      expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
      expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

      expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
      expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
      expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

      expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
      expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
      expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

      expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
      expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
      expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

      expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
      expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
      expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

      expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
      expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
      expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

    });

    cy.log("move tail of each vector directly")
    cy.window().then(async (win) => {

      tvt = [-3, 5];
      tvh = [9, -2];
      tvd = [0, 7];
      tvth = [-7, 4];
      tvtd = [5, -9];
      tvhd = [-1, -6];


      win.callAction1({
        actionName: "moveVector",
        componentName: '/vt',
        args: { tailcoords: tvt }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vh',
        args: { tailcoords: tvh }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vd',
        args: { tailcoords: tvd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vth',
        args: { tailcoords: tvth }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vtd',
        args: { tailcoords: tvtd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vhd',
        args: { tailcoords: tvhd }
      })

      cy.get('#\\/vhd_tdom').should('contain.text', `(${nInDOM(tvhd[0])},${nInDOM(tvhd[1])})`)

      // since moved tails directly, heads stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

      });
    })

    cy.log("move head of each vector directly")
    cy.window().then(async (win) => {

      hvt = [5, -1];
      hvh = [3, -6];
      hvd = [1, -9];
      hvth = [6, 2];
      hvtd = [-6, -4];
      hvhd = [-4, 8];


      win.callAction1({
        actionName: "moveVector",
        componentName: '/vt',
        args: { headcoords: hvt }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vh',
        args: { headcoords: hvh }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vd',
        args: { headcoords: hvd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vth',
        args: { headcoords: hvth }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vtd',
        args: { headcoords: hvtd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vhd',
        args: { headcoords: hvhd }
      })


      cy.get('#\\/vhd_hdom').should('contain.text', `(${nInDOM(hvhd[0])},${nInDOM(hvhd[1])})`)

      // since moved heads directly, tails stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

      });
    })

    cy.log("move tail through defining point, if exists")
    cy.window().then(async (win) => {

      tvt = [9, -1];
      tvth = [3, -2];
      tvtd = [-1, 5];


      win.callAction1({
        actionName: "movePoint",
        componentName: "/tvt",
        args: { x: tvt[0], y: tvt[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tvth",
        args: { x: tvth[0], y: tvth[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tvtd",
        args: { x: tvtd[0], y: tvtd[1] }
      })

      cy.get('#\\/tvtd_dom').should('contain.text', `(${nInDOM(tvtd[0])},${nInDOM(tvtd[1])})`)

      // defined by tail/head, head stays fixed and displacement changes
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

      // defined by tail or tail and displacement, displacement stays fixed and head changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);
      })
    });

    cy.log("move head through defining point, if exists")
    cy.window().then(async (win) => {

      hvh = [5, 3];
      hvth = [-8, -3];
      hvhd = [7, -6];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/hvh",
        args: { x: hvh[0], y: hvh[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hvth",
        args: { x: hvth[0], y: hvth[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hvhd",
        args: { x: hvhd[0], y: hvhd[1] }
      })

      cy.get('#\\/hvhd_dom').should('contain.text', `(${nInDOM(hvhd[0])},${nInDOM(hvhd[1])})`)

      // defined by head only or tail/head, tail stays fixed and displacement changes
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

      // defined by head and displacement, displacement stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);
      })
    });

    cy.log("change displacement through defining point, if exists")
    cy.window().then(async (win) => {

      dvd = [-1, -2];
      dvtd = [-6, 8];
      dvhd = [3, -7];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/dvd",
        args: { x: dvd[0], y: dvd[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/dvtd",
        args: { x: dvtd[0], y: dvtd[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/dvhd",
        args: { x: dvhd[0], y: dvhd[1] }
      })

      cy.get('#\\/dvhd_dom').should('contain.text', `(${nInDOM(dvhd[0])},${nInDOM(dvhd[1])})`)


      // defined by displacement only or tail/displacement, tail stays fixed and head changes
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      // defined by head and displacement, head stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

      })
    });

    cy.log("move tail of each vector through copied point")
    cy.window().then(async (win) => {

      tvt = [-5, 3];
      tvh = [7, 0];
      tvd = [-2, 1];
      tvth = [8, -8];
      tvtd = [6, 5];
      tvhd = [-3, 4];


      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvt",
        args: { x: tvt[0], y: tvt[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvh",
        args: { x: tvh[0], y: tvh[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvd",
        args: { x: tvd[0], y: tvd[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvth",
        args: { x: tvth[0], y: tvth[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvtd",
        args: { x: tvtd[0], y: tvtd[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvhd",
        args: { x: tvhd[0], y: tvhd[1] }
      })


      cy.get('#\\/tfvhd_dom').should('contain.text', `(${nInDOM(tvhd[0])},${nInDOM(tvhd[1])})`)


      // if defined by head, head stays fixed and displacement changes
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      // if not defined by head,
      // displacement stays fixed and head changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);
      })
    });

    cy.log("move head of each vector through copied point")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      hvt = [-1, -3];
      hvh = [7, -6];
      hvd = [-2, -5];
      hvth = [-3, 8];
      hvtd = [9, 1];
      hvhd = [-4, 4];


      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvt",
        args: { x: hvt[0], y: hvt[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvh",
        args: { x: hvh[0], y: hvh[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvd",
        args: { x: hvd[0], y: hvd[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvth",
        args: { x: hvth[0], y: hvth[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvtd",
        args: { x: hvtd[0], y: hvtd[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvhd",
        args: { x: hvhd[0], y: hvhd[1] }
      })

      cy.get('#\\/hfvhd_dom').should('contain.text', `(${nInDOM(hvhd[0])},${nInDOM(hvhd[1])})`)


      // for most vectors, tails stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];

      // defined by head and displacement, displacement stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);
      })
    });

    cy.log("change displacement of each vector through copied vectors")
    cy.window().then(async (win) => {

      dvt = [-9, 0];
      dvh = [-3, -1];
      dvd = [-5, 5];
      dvth = [7, 3];
      dvtd = [9, -8];
      dvhd = [1, 2];

      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvt',
        args: { headcoords: dvt }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvh',
        args: { headcoords: dvh }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvd',
        args: { headcoords: dvd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvth',
        args: { headcoords: dvth }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvtd',
        args: { headcoords: dvtd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvhd',
        args: { headcoords: dvhd }
      })

      cy.get('#\\/dfvhd_hdom').should('contain.text', `(${nInDOM(dvhd[0])},${nInDOM(dvhd[1])})`)

      // for most vectors, tails stay fixed and head changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvh = [tvh[0] + dvh[0], tvh[1] + dvh[1]];
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvth = [tvth[0] + dvth[0], tvth[1] + dvth[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      // defined by head and displacement, head stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

      })
    });

    cy.log("move tail of each copied vector directly")
    cy.window().then(async (win) => {

      tvt = [1, 8];
      tvh = [-3, 2];
      tvd = [9, -1];
      tvth = [5, -3];
      tvtd = [-4, -8];
      tvhd = [-1, 6];

      win.callAction1({
        actionName: "moveVector",
        componentName: '/vt2',
        args: { tailcoords: tvt }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vh2',
        args: { tailcoords: tvh }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vd2',
        args: { tailcoords: tvd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vth2',
        args: { tailcoords: tvth }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vtd2',
        args: { tailcoords: tvtd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vhd2',
        args: { tailcoords: tvhd }
      })


      cy.get('#\\/vhd2_tdom').should('contain.text', `(${nInDOM(tvhd[0])},${nInDOM(tvhd[1])})`)

      // since moved tails directly, heads stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);
      })
    });

    cy.log("move head of each copied vector directly")
    cy.window().then(async (win) => {

      hvt = [-7, 2];
      hvh = [-2, 9];
      hvd = [0, -3];
      hvth = [6, 1];
      hvtd = [7, 0];
      hvhd = [-8, -4];


      win.callAction1({
        actionName: "moveVector",
        componentName: '/vt2',
        args: { headcoords: hvt }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vh2',
        args: { headcoords: hvh }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vd2',
        args: { headcoords: hvd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vth2',
        args: { headcoords: hvth }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vtd2',
        args: { headcoords: hvtd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/vhd2',
        args: { headcoords: hvhd }
      })


      cy.get('#\\/vhd2_hdom').should('contain.text', `(${nInDOM(hvhd[0])},${nInDOM(hvhd[1])})`)

      // since moved heads directly, tails stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);
      })
    });

    cy.log("move tail of each copied vector through copied point")
    cy.window().then(async (win) => {

      tvt = [1, -1];
      tvh = [9, -9];
      tvd = [-3, 2];
      tvth = [5, 0];
      tvtd = [-1, 7];
      tvhd = [-6, 6];


      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvt2",
        args: { x: tvt[0], y: tvt[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvh2",
        args: { x: tvh[0], y: tvh[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvd2",
        args: { x: tvd[0], y: tvd[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvth2",
        args: { x: tvth[0], y: tvth[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvtd2",
        args: { x: tvtd[0], y: tvtd[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvhd2",
        args: { x: tvhd[0], y: tvhd[1] }
      })


      cy.get('#\\/tfvhd2_dom').should('contain.text', `(${nInDOM(tvhd[0])},${nInDOM(tvhd[1])}`)


      // if defined by head, head stays fixed and displacement changes
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      // if not defined by head, 
      // displacement stays fixed and head changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);
      })
    });

    cy.log("move head of each copied vector through copied point")
    cy.window().then(async (win) => {

      hvt = [-6, -8];
      hvh = [2, -2];
      hvd = [0, 6];
      hvth = [-5, 4];
      hvtd = [3, 8];
      hvhd = [-1, 5];


      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvt2",
        args: { x: hvt[0], y: hvt[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvh2",
        args: { x: hvh[0], y: hvh[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvd2",
        args: { x: hvd[0], y: hvd[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvth2",
        args: { x: hvth[0], y: hvth[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvtd2",
        args: { x: hvtd[0], y: hvtd[1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvhd2",
        args: { x: hvhd[0], y: hvhd[1] }
      })

      cy.get('#\\/hfvhd2_dom').should('contain.text', `(${nInDOM(hvhd[0])},${nInDOM(hvhd[1])})`)


      // for most vectors, tails stay fixed and displacement changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];

      // defined by head and displacement, displacement stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);
      })
    });

    cy.log("change displacement of each copied vector through copied vectors")
    cy.window().then(async (win) => {

      dvt = [-1, 7];
      dvh = [5, 9];
      dvd = [9, 2];
      dvth = [-3, -5];
      dvtd = [9, -4];
      dvhd = [-5, 3];


      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvt2',
        args: { headcoords: dvt }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvh2',
        args: { headcoords: dvh }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvd2',
        args: { headcoords: dvd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvth2',
        args: { headcoords: dvth }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvtd2',
        args: { headcoords: dvtd }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: '/dfvhd2',
        args: { headcoords: dvhd }
      })

      cy.get('#\\/dfvhd2_hdom').should('contain.text', `(${nInDOM(dvhd[0])},${nInDOM(dvhd[1])})`)

      // for most vectors, tails stay fixed and head changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvh = [tvh[0] + dvh[0], tvh[1] + dvh[1]];
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvth = [tvth[0] + dvth[0], tvth[1] + dvth[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      // defined by head and displacement, head stays fixed and tail changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(me.fromAst(stateVariables['/tvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(me.fromAst(stateVariables['/dvd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvd]);
        expect(me.fromAst(stateVariables['/tvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(me.fromAst(stateVariables['/tvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/dvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvtd]);
        expect(me.fromAst(stateVariables['/hvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(me.fromAst(stateVariables['/dvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...dvhd]);

        expect(stateVariables['/vt'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(stateVariables['/vt2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvt]);
        expect(stateVariables['/vt2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvt]);
        expect(stateVariables['/vt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(stateVariables['/vh2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvh]);
        expect(stateVariables['/vh2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvh]);
        expect(stateVariables['/vh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(stateVariables['/vd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvd]);
        expect(stateVariables['/vd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvd]);
        expect(stateVariables['/vd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(stateVariables['/vth2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvth]);
        expect(stateVariables['/vth2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvth]);
        expect(stateVariables['/vth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(stateVariables['/vtd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvtd]);
        expect(stateVariables['/vtd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvtd]);
        expect(stateVariables['/vtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(stateVariables['/vhd2'].stateValues.tail.map(x => me.fromAst(x).simplify().tree)).eqls([...tvhd]);
        expect(stateVariables['/vhd2'].stateValues.head.map(x => me.fromAst(x).simplify().tree)).eqls([...hvhd]);
        expect(stateVariables['/vhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);

        expect(me.fromAst(stateVariables['/tfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvt]);
        expect(me.fromAst(stateVariables['/hfvt2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvt]);
        expect(stateVariables['/dfvt2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvt]);

        expect(me.fromAst(stateVariables['/tfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvh]);
        expect(me.fromAst(stateVariables['/hfvh2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvh]);
        expect(stateVariables['/dfvh2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvh]);

        expect(me.fromAst(stateVariables['/tfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvd]);
        expect(me.fromAst(stateVariables['/hfvd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvd]);
        expect(stateVariables['/dfvd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvd]);

        expect(me.fromAst(stateVariables['/tfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvth]);
        expect(me.fromAst(stateVariables['/hfvth2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvth]);
        expect(stateVariables['/dfvth2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvth]);

        expect(me.fromAst(stateVariables['/tfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvtd]);
        expect(me.fromAst(stateVariables['/hfvtd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvtd]);
        expect(stateVariables['/dfvtd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvtd]);

        expect(me.fromAst(stateVariables['/tfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...tvhd]);
        expect(me.fromAst(stateVariables['/hfvhd2'].stateValues.coords).simplify().tree).eqls(["vector", ...hvhd]);
        expect(stateVariables['/dfvhd2'].stateValues.displacement.map(x => me.fromAst(x).simplify().tree)).eqls([...dvhd]);
      })
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([2, 3]);
      expect(stateVariables['/_math1'].stateValues.value).eqls(["vector", 2, 3]);
    })

    cy.log("move vector head");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: '/_vector1',
        args: { headcoords: [9, 7] }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(8,5)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([8, 5]);
      expect(stateVariables['/_math1'].stateValues.value).eqls(["vector", 8, 5]);
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(8,5)')
    })


    cy.log("move vector tail");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: '/_vector1',
        args: { tailcoords: [-2, 6] }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(11,1)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([11, 1]);
      expect(stateVariables['/_math1'].stateValues.value).eqls(["vector", 11, 1]);
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
  <copy prop="head" target="_vector1" assignNames="v1h" />
  <copy prop="tail" target="_vector1" assignNames="v1t" />
  <copy prop="head" target="_vector2" assignNames="v2h" />
  <copy prop="tail" target="_vector2" assignNames="v2t" />
  <copy prop="head" target="_vector3" assignNames="v3h" />
  <copy prop="tail" target="_vector3" assignNames="v3t" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let x1 = 1, y1 = 0;
    let x2 = 3, y2 = 2;
    let x3 = -1, y3 = 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.tail).eqls([x1, y1]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([x2, y2]);
      expect(stateVariables['/_vector2'].stateValues.tail).eqls([x3, y3]);
      expect(stateVariables['/_vector2'].stateValues.head).eqls([x2, y2]);
      expect(stateVariables['/_vector3'].stateValues.tail).eqls([x3, y3]);
      expect(stateVariables['/_vector3'].stateValues.head).eqls([x1, y1]);

    })

    cy.log("move head of vector 1")
    cy.window().then(async (win) => {

      x2 = 7;
      y2 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/v1h",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/v1h').should('contain.text', `(${nInDOM(x2)},${nInDOM(y2)})`)


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([x1, y1]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector2'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector2'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector3'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector3'].stateValues.head).eqls([x1, y1]);
      })
    })

    cy.log("move tail of vector 1")
    cy.window().then(async (win) => {

      x1 = -1;
      y1 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/v1t",
        args: { x: x1, y: y1 }
      })

      cy.get('#\\/v1t').should('contain.text', `(${nInDOM(x1)},${nInDOM(y1)})`)


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([x1, y1]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector2'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector2'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector3'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector3'].stateValues.head).eqls([x1, y1]);
      })
    })

    cy.log("move tail of vector 2")
    cy.window().then(async (win) => {

      x3 = 9;
      y3 = -8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/v2t",
        args: { x: x3, y: y3 }
      })

      cy.get('#\\/v2t').should('contain.text', `(${nInDOM(x3)},${nInDOM(y3)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([x1, y1]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector2'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector2'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector3'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector3'].stateValues.head).eqls([x1, y1]);
      })
    })

    cy.log("move head of vector 2")
    cy.window().then(async (win) => {

      x2 = 3;
      y2 = 2;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/v2h",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/v2h').should('contain.text', `(${nInDOM(x2)},${nInDOM(y2)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([x1, y1]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector2'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector2'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector3'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector3'].stateValues.head).eqls([x1, y1]);
      })
    })

    cy.log("move head of vector 3")
    cy.window().then(async (win) => {

      x1 = -5;
      y1 = 8;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/v3h",
        args: { x: x1, y: y1 }
      })

      cy.get('#\\/v3h').should('contain.text', `(${nInDOM(x1)},${nInDOM(y1)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([x1, y1]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector2'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector2'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector3'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector3'].stateValues.head).eqls([x1, y1]);
      })
    })

    cy.log("move tail of vector 3")
    cy.window().then(async (win) => {

      x3 = 0;
      y3 = -5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/v3t",
        args: { x: x3, y: y3 }
      })

      cy.get('#\\/v3t').should('contain.text', `(${nInDOM(x3)},${nInDOM(y3)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([x1, y1]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector2'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector2'].stateValues.head).eqls([x2, y2]);
        expect(stateVariables['/_vector3'].stateValues.tail).eqls([x3, y3]);
        expect(stateVariables['/_vector3'].stateValues.head).eqls([x1, y1]);
      })
    })

  })

  it('copy two components of vector', () => {
    // checking bug where second component wasn't updating
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <vector tail="(3, $b)" head="($a,4)" />

  <copy prop="x" target="_vector1" assignNames="v1x" />
  <copy prop="y" target="_vector1" assignNames="v1y" />
  
  <p><mathinput name="a" prefill="1"></mathinput></p>
  <p><mathinput name="b" prefill="2"></mathinput></p>
  
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let a = 1;
    let b = 2;
    let dx = a - 3;
    let dy = 4 - b;

    cy.log('Test values displayed in browser')
    cy.get("#\\/v1x").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`${dx}`)
    });

    cy.get("#\\/v1y").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`${dy}`)
    });

    cy.get('#\\/_vector1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`(${dx},${dy})`)
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.tail).eqls([3, b]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([a, 4]);
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([dx, dy]);
      expect(stateVariables['/v1x'].stateValues.value).eq(dx)
      expect(stateVariables['/v1y'].stateValues.value).eq(dy)
    })

    cy.log("changed values");

    let a2 = -5;
    let b2 = 7;
    let dx2 = a2 - 3;
    let dy2 = 4 - b2;

    cy.get('#\\/a textarea').type(`{end}{backspace}${a2}`, { force: true });
    cy.get('#\\/b textarea').type(`{end}{backspace}${b2}`, { force: true }).blur();

    cy.get("#\\/v1x .mjx-mrow").should('contain.text', `${nInDOM(dx2)}`)
    cy.get("#\\/v1y .mjx-mrow").should('contain.text', `${nInDOM(dy2)}`)

    cy.get("#\\/v1x").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`${dx2}`)
    });

    cy.get("#\\/v1y").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`${dy2}`)
    });

    cy.get('#\\/_vector1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`(${dx2},${dy2})`)
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.tail).eqls([3, b2]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([a2, 4]);
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([dx2, dy2]);
      expect(stateVariables['/v1x'].stateValues.value).eq(dx2)
      expect(stateVariables['/v1y'].stateValues.value).eq(dy2)
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
  <copy target="_vector1" assignNames="v1a" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let tailx = 4;
      let taily = 1;
      let headx = -4;
      let heady = 2;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      expect(stateVariables['/_vector1'].stateValues.tail).eqls([tailx, taily]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([headx, heady]);
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([displacementx, displacementy]);

    })

    cy.log(`move tail, make sure head doesn't move`)
    cy.window().then(async (win) => {

      let tailx = -3;
      let taily = 7;
      let headx = -4;
      let heady = 2;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/_vector1',
        args: { tailcoords: [tailx, taily] }
      })

      cy.get("#\\/v1a .mjx-mrow").should('contain.text', `(${nInDOM(displacementx)},${nInDOM(displacementy)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([tailx, taily]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([headx, heady]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([displacementx, displacementy]);
      })
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
  <copy target="_vector1" assignNames="v1a" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let tailx = 4;
      let taily = 1;
      let headx = -4;
      let heady = 2;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      expect(stateVariables['/_vector1'].stateValues.tail).eqls([tailx, taily]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([headx, heady]);
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([displacementx, displacementy]);

    })

    cy.log(`move tail, make sure head doesn't move`)
    cy.window().then(async (win) => {

      let tailx = 4;
      let taily = 1;
      let headx = 3;
      let heady = 5;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/_vector1',
        args: { headcoords: [headx, heady] }
      })

      cy.get("#\\/v1a .mjx-mrow").should('contain.text', `(${nInDOM(displacementx)},${nInDOM(displacementy)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([tailx, taily]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([headx, heady]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([displacementx, displacementy]);
      })
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
  <copy target="_vector1" assignNames="v1a" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let tailx = 0;
      let taily = 0;
      let headx = -8;
      let heady = 1;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      expect(stateVariables['/_vector1'].stateValues.tail).eqls([tailx, taily]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([headx, heady]);
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([displacementx, displacementy]);

    })

    cy.log(`move tail, make sure head doesn't move`)
    cy.window().then(async (win) => {

      let tailx = -3;
      let taily = 7;
      let headx = -8;
      let heady = 1;
      let displacementx = headx - tailx;
      let displacementy = heady - taily;

      win.callAction1({
        actionName: "moveVector",
        componentName: '/_vector1',
        args: { tailcoords: [tailx, taily] }
      })

      cy.get("#\\/v1a .mjx-mrow").should('contain.text', `(${nInDOM(displacementx)},${nInDOM(displacementy)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([tailx, taily]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([headx, heady]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([displacementx, displacementy]);
      })
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
  <copy prop="tail" target="_vector1" assignNames="tail" />
  <copy prop="head" target="_vector1" assignNames="head" />
  <copy prop="displacement" target="_vector1" assignNames="displacement" />
  </graph>
  
  <copy prop="tail" target="_vector1" assignNames="tail2" />
  <copy prop="head" target="_vector1" assignNames="head2" />
  <copy prop="displacement" target="_vector1" assignNames="displacement2" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tailx = 0;
    let taily = 0;
    let headx = -4;
    let heady = 2;
    let displacementTailShiftx = 0;
    let displacementTailShifty = 0;

    cy.window().then(async (win) => {

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move vector up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: [tailx, taily],
          headcoords: [headx, heady]
        }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })

    })

    cy.log('move copied tail moves vector')
    cy.window().then(async (win) => {

      let moveX = -8;
      let moveY = 4;
      tailx += moveX;
      headx += moveX;
      taily += moveY;
      heady += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tail",
        args: { x: tailx, y: taily }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied head')
    cy.window().then(async (win) => {

      headx = -3;
      heady = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/head",
        args: { x: headx, y: heady }
      })

      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
      })
    })

    cy.log('move copied displacement')
    cy.window().then(async (win) => {

      let displacementTailShiftx = -4;
      let displacementTailShifty = -5;

      let displacementx = 2;
      let displacementy = -3;

      headx = tailx + displacementx;
      heady = taily + displacementy;

      let displacementheadx = displacementTailShiftx + displacementx;
      let displacementheady = displacementTailShifty + displacementy;


      win.callAction1({
        actionName: "moveVector",
        componentName: "/displacement",
        args: {
          tailcoords: [displacementTailShiftx, displacementTailShifty],
          headcoords: [displacementheadx, displacementheady]
        }
      })


      await testVectorCopiedHTD({
        headx, heady, tailx, taily, displacementTailShiftx, displacementTailShifty
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_vector1"].stateValues.head).eqls([1])
      expect(stateVariables["/_vector1"].stateValues.tail).eqls([0])
      expect(stateVariables["/_vector1"].stateValues.displacement).eqls([1])

      expect(stateVariables["/h"].stateValues.xs).eqls([1])
      expect(stateVariables["/t"].stateValues.xs).eqls([0])
      expect(stateVariables["/d"].stateValues.displacement).eqls([1])

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
  <copy target="v1" prop="head" assignNames="v1h" />
  <copy target="v2" prop="head" assignNames="v2h" />
  <copy target="v3" prop="head" assignNames="v3h" />
  <copy target="v4" prop="head" assignNames="v4h" />
  <copy target="v5" prop="head" assignNames="v5h" />
  <copy target="v6" prop="head" assignNames="v6h" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v1"].stateValues.head).eqls([3, 4])
      expect(stateVariables["/v1"].stateValues.tail).eqls([3, 4])
      expect(stateVariables["/v1"].stateValues.displacement).eqls([0, 0])

      expect(stateVariables["/v2"].stateValues.head).eqls([3, 4])
      expect(stateVariables["/v2"].stateValues.tail).eqls([0, 0])
      expect(stateVariables["/v2"].stateValues.displacement).eqls([3, 4])

      expect(stateVariables["/v3"].stateValues.head).eqls([3, 4])
      expect(stateVariables["/v3"].stateValues.tail).eqls([3, 4])
      expect(stateVariables["/v3"].stateValues.displacement).eqls([0, 0])

      expect(stateVariables["/v4"].stateValues.head).eqls([6, 8])
      expect(stateVariables["/v4"].stateValues.tail).eqls([3, 4])
      expect(stateVariables["/v4"].stateValues.displacement).eqls([3, 4])

      expect(stateVariables["/v5"].stateValues.head).eqls([3, 4])
      expect(stateVariables["/v5"].stateValues.tail).eqls([0, 0])
      expect(stateVariables["/v5"].stateValues.displacement).eqls([3, 4])

      expect(stateVariables["/v6"].stateValues.head).eqls([6, 8])
      expect(stateVariables["/v6"].stateValues.tail).eqls([3, 4])
      expect(stateVariables["/v6"].stateValues.displacement).eqls([3, 4])

    })

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v1",
        args: { headcoords: [1, 2] }
      })

      cy.get("#\\/v1h .mjx-mrow").should('contain.text', `(${nInDOM(1)},${nInDOM(2)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v1"].stateValues.head).eqls([1, 2])
        expect(stateVariables["/v1"].stateValues.tail).eqls([1, 2])
        expect(stateVariables["/v1"].stateValues.displacement).eqls([0, 0])
      });
    })

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v1",
        args: { tailcoords: [-4, 5] }
      })

      cy.get("#\\/v1h .mjx-mrow").should('contain.text', `(${nInDOM(-4)},${nInDOM(5)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v1"].stateValues.head).eqls([-4, 5])
        expect(stateVariables["/v1"].stateValues.tail).eqls([-4, 5])
        expect(stateVariables["/v1"].stateValues.displacement).eqls([0, 0])
      })
    })

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v3",
        args: { headcoords: [1, 2] }
      })

      cy.get("#\\/v3h .mjx-mrow").should('contain.text', `(${nInDOM(1)},${nInDOM(2)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v3"].stateValues.head).eqls([1, 2])
        expect(stateVariables["/v3"].stateValues.tail).eqls([1, 2])
        expect(stateVariables["/v3"].stateValues.displacement).eqls([0, 0])
      })
    })

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v3",
        args: { tailcoords: [-4, 5] }
      })

      cy.get("#\\/v3h .mjx-mrow").should('contain.text', `(${nInDOM(-4)},${nInDOM(5)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v3"].stateValues.head).eqls([-4, 5])
        expect(stateVariables["/v3"].stateValues.tail).eqls([-4, 5])
        expect(stateVariables["/v3"].stateValues.displacement).eqls([0, 0])
      })
    });


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v2",
        args: { headcoords: [1, 2] }
      })

      cy.get("#\\/v2h .mjx-mrow").should('contain.text', `(${nInDOM(1)},${nInDOM(2)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v2"].stateValues.head).eqls([1, 2])
        expect(stateVariables["/v2"].stateValues.tail).eqls([0, 0])
        expect(stateVariables["/v2"].stateValues.displacement).eqls([1, 2])
      })
    })

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v2",
        args: { tailcoords: [5, 7] }
      })

      cy.get("#\\/v2h .mjx-mrow").should('contain.text', `(${nInDOM(-4)},${nInDOM(-5)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v2"].stateValues.head).eqls([-4, -5])
        expect(stateVariables["/v2"].stateValues.tail).eqls([0, 0])
        expect(stateVariables["/v2"].stateValues.displacement).eqls([-4, -5])
      })
    })

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v5",
        args: { headcoords: [1, 2] }
      })
      cy.get("#\\/v5h .mjx-mrow").should('contain.text', `(${nInDOM(1)},${nInDOM(2)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v5"].stateValues.head).eqls([1, 2])
        expect(stateVariables["/v5"].stateValues.tail).eqls([0, 0])
        expect(stateVariables["/v5"].stateValues.displacement).eqls([1, 2])
      })
    })

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v5",
        args: { tailcoords: [5, 7] }
      })
      cy.get("#\\/v5h .mjx-mrow").should('contain.text', `(${nInDOM(-4)},${nInDOM(-5)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v5"].stateValues.head).eqls([-4, -5])
        expect(stateVariables["/v5"].stateValues.tail).eqls([0, 0])
        expect(stateVariables["/v5"].stateValues.displacement).eqls([-4, -5])
      })
    });


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v4",
        args: { headcoords: [-1, 1] }
      })
      cy.get("#\\/v4h .mjx-mrow").should('contain.text', `(${nInDOM(-8)},${nInDOM(-6)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v4"].stateValues.head).eqls([-8, -6])
        expect(stateVariables["/v4"].stateValues.tail).eqls([-4, -3])
        expect(stateVariables["/v4"].stateValues.displacement).eqls([-4, -3])
      })
    })


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v4",
        args: { tailcoords: [-10, -2] }
      })

      // since based on tail and displacement
      // Vector sets displacement to try to keep head in the same place

      cy.get("#\\/v4h .mjx-mrow").should('contain.text', `(${nInDOM(4)},${nInDOM(-8)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v4"].stateValues.head).eqls([4, -8])
        expect(stateVariables["/v4"].stateValues.tail).eqls([2, -4])
        expect(stateVariables["/v4"].stateValues.displacement).eqls([2, -4])
      })
    })

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v6",
        args: { headcoords: [-1, 1] }
      })

      cy.get("#\\/v6h .mjx-mrow").should('contain.text', `(${nInDOM(-8)},${nInDOM(-6)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v6"].stateValues.head).eqls([-8, -6])
        expect(stateVariables["/v6"].stateValues.tail).eqls([-4, -3])
        expect(stateVariables["/v6"].stateValues.displacement).eqls([-4, -3])
      })
    })

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v6",
        args: { tailcoords: [-10, -2] }
      })

      // since based on tail and displacement
      // Vector sets displacement to try to keep head in the same place

      cy.get("#\\/v6h .mjx-mrow").should('contain.text', `(${nInDOM(4)},${nInDOM(-8)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v6"].stateValues.head).eqls([4, -8])
        expect(stateVariables["/v6"].stateValues.tail).eqls([2, -4])
        expect(stateVariables["/v6"].stateValues.displacement).eqls([2, -4])
      })
    });

  })

  it('vector with no arguments, copy and specify attributes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph name="g0" newNamespace>
    <vector name="v0" />
    <copy target="v0" head="(3,4)" assignNames="v1" />
    <copy target="v1" tail="(-1,0)" assignNames="v2" />
    <copy target="v0" tail="(2,-6)" assignNames="v3" />
    <copy target="v3" displacement="(-3,4)" assignNames="v4" />
    <copy target="v0" displacement="(5,-1)" assignNames="v5" />
    <copy target="v5" head="(6,2)" assignNames="v6" />
  </graph>

  <copy tname="g0" assignNames="g1" />

  <copy target="g0/v0" prop="tail" assignNames="v0t" />
  <copy target="g0/v0" prop="head" assignNames="v0h" />
  <copy target="g0/v1" prop="tail" assignNames="v1t" />
  <copy target="g0/v1" prop="head" assignNames="v1h" />
  <copy target="g0/v2" prop="tail" assignNames="v2t" />
  <copy target="g0/v2" prop="head" assignNames="v2h" />
  <copy target="g0/v3" prop="tail" assignNames="v3t" />
  <copy target="g0/v3" prop="head" assignNames="v3h" />
  <copy target="g0/v4" prop="tail" assignNames="v4t" />
  <copy target="g0/v4" prop="head" assignNames="v4h" />
  <copy target="g0/v5" prop="tail" assignNames="v5t" />
  <copy target="g0/v5" prop="head" assignNames="v5h" />
  <copy target="g0/v6" prop="tail" assignNames="v6t" />
  <copy target="g0/v6" prop="head" assignNames="v6h" />

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let tails = [
      [0, 0],
      [0, 0],
      [-1, 0],
      [2, -6],
      [2, -6],
      [0, 0],
      [1, 3],
    ]

    let heads = [
      [1, 0],
      [3, 4],
      [3, 4],
      [3, -6],
      [-1, -2],
      [5, -1],
      [6, 2],
    ]

    let displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 2; j++) {
          expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
          expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
          expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
        }
      }

    })


    cy.log('move tail of g0/v0');

    cy.window().then(async (win) => {
      tails[0] = tails[1] = tails[5] = [3, 5];
      heads[5] = [tails[5][0] + displacements[5][0], tails[5][1] + displacements[5][1]]
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])
      heads[3] = [tails[3][0] + displacements[0][0], tails[3][1] + displacements[0][1]]
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])


      win.callAction1({
        actionName: "moveVector",
        componentName: "/g0/v0",
        args: { tailcoords: tails[0] }
      })

      cy.get("#\\/v0t .mjx-mrow").should('contain.text', `(${nInDOM(tails[0][0])},${nInDOM(tails[0][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })


    cy.log('move head of g1/v0');

    cy.window().then(async (win) => {

      heads[0] = [-2, 8]

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])
      heads[3] = [tails[3][0] + displacements[0][0], tails[3][1] + displacements[0][1]]
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g1/v0",
        args: { headcoords: heads[0] }
      })

      cy.get("#\\/v0h .mjx-mrow").should('contain.text', `(${nInDOM(heads[0][0])},${nInDOM(heads[0][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })


    cy.log('move head of g0/v1');

    cy.window().then(async (win) => {

      heads[1] = heads[2] = [-9, -1]

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g0/v1",
        args: { headcoords: heads[1] }
      })

      cy.get("#\\/v1h .mjx-mrow").should('contain.text', `(${nInDOM(heads[1][0])},${nInDOM(heads[1][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })

    })



    cy.log('move tail of g1/v1');

    cy.window().then(async (win) => {

      tails[0] = tails[1] = tails[5] = [5, -3];
      heads[0] = [tails[0][0] + displacements[0][0], tails[0][1] + displacements[0][1]]
      heads[5] = [tails[5][0] + displacements[5][0], tails[5][1] + displacements[5][1]]
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g1/v1",
        args: { tailcoords: tails[1] }
      })

      cy.get("#\\/v1t .mjx-mrow").should('contain.text', `(${nInDOM(tails[1][0])},${nInDOM(tails[1][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })


    cy.log('move tail of g0/v2');

    cy.window().then(async (win) => {

      tails[2] = [7, 9];

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g0/v2",
        args: { tailcoords: tails[2] }
      })

      cy.get("#\\/v2t .mjx-mrow").should('contain.text', `(${nInDOM(tails[2][0])},${nInDOM(tails[2][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })


    cy.log('move head of g1/v2');

    cy.window().then(async (win) => {

      heads[1] = heads[2] = [8, 4];

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g1/v2",
        args: { headcoords: heads[2] }
      })

      cy.get("#\\/v2h .mjx-mrow").should('contain.text', `(${nInDOM(heads[2][0])},${nInDOM(heads[2][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })



    cy.log('move head of g0/v3');

    cy.window().then(async (win) => {

      heads[3] = [-4, -7];
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])
      heads[0] = [tails[0][0] + displacements[3][0], tails[0][1] + displacements[3][1]]
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g0/v3",
        args: { headcoords: heads[3] }
      })

      cy.get("#\\/v3h .mjx-mrow").should('contain.text', `(${nInDOM(heads[3][0])},${nInDOM(heads[3][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })


    cy.log('move tail of g1/v3');

    cy.window().then(async (win) => {

      tails[3] = tails[4] = [-6, 2]
      heads[4] = [tails[4][0] + displacements[4][0], tails[4][1] + displacements[4][1]]

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])
      heads[0] = [tails[0][0] + displacements[3][0], tails[0][1] + displacements[3][1]]
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g1/v3",
        args: { tailcoords: tails[3] }
      })

      cy.get("#\\/v3t .mjx-mrow").should('contain.text', `(${nInDOM(tails[3][0])},${nInDOM(tails[3][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })



    cy.log('move tail of g0/v4');

    cy.window().then(async (win) => {

      tails[3] = tails[4] = [-2, 3]
      heads[3] = [tails[3][0] + displacements[3][0], tails[3][1] + displacements[3][1]]

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g0/v4",
        args: { tailcoords: tails[4] }
      })

      cy.get("#\\/v4t .mjx-mrow").should('contain.text', `(${nInDOM(tails[4][0])},${nInDOM(tails[4][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })



    cy.log('move head of g1/v4');

    cy.window().then(async (win) => {

      heads[4] = [2, 0]

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g1/v4",
        args: { headcoords: heads[4] }
      })

      cy.get("#\\/v4h .mjx-mrow").should('contain.text', `(${nInDOM(heads[4][0])},${nInDOM(heads[4][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })


    cy.log('move head of g0/v5');

    cy.window().then(async (win) => {

      heads[5] = [-9, -8]

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])
      tails[6] = [heads[6][0] - displacements[5][0], heads[6][1] - displacements[5][1]]
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g0/v5",
        args: { headcoords: heads[5] }
      })

      cy.get("#\\/v5h .mjx-mrow").should('contain.text', `(${nInDOM(heads[5][0])},${nInDOM(heads[5][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })



    cy.log('move tail of g1/v5');

    cy.window().then(async (win) => {

      tails[0] = tails[1] = tails[5] = [3, 7]

      heads[0] = [tails[0][0] + displacements[0][0], tails[0][1] + displacements[0][1]]

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])
      tails[6] = [heads[6][0] - displacements[5][0], heads[6][1] - displacements[5][1]]
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g1/v5",
        args: { tailcoords: tails[5] }
      })

      cy.get("#\\/v5t .mjx-mrow").should('contain.text', `(${nInDOM(tails[5][0])},${nInDOM(tails[5][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })



    cy.log('move tail of g0/v6');

    cy.window().then(async (win) => {

      tails[6] = [8, -7]

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])
      heads[5] = [tails[5][0] + displacements[6][0], tails[5][1] + displacements[6][1]]
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g0/v6",
        args: { tailcoords: tails[6] }
      })

      cy.get("#\\/v6t .mjx-mrow").should('contain.text', `(${nInDOM(tails[6][0])},${nInDOM(tails[6][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })



    cy.log('move head of g1/v6');

    cy.window().then(async (win) => {

      heads[6] = [9, -5]

      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])
      heads[5] = [tails[5][0] + displacements[6][0], tails[5][1] + displacements[6][1]]
      displacements = heads.map((v, i) => [v[0] - tails[i][0], v[1] - tails[i][1]])

      win.callAction1({
        actionName: "moveVector",
        componentName: "/g1/v6",
        args: { headcoords: heads[6] }
      })

      cy.get("#\\/v6h .mjx-mrow").should('contain.text', `(${nInDOM(heads[6][0])},${nInDOM(heads[6][1])})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.tail).eqls(tails[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.head).eqls(heads[i]);
            expect(stateVariables[`/g${j}/v${i}`].stateValues.displacement).eqls(displacements[i]);
          }
        }
      })
    })

  })


});