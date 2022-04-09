import me from 'math-expressions';
import cssesc from 'cssesc';

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

async function testPolylineCopiedTwice({ vertices,
  polylineName = "/pg",
  graph1Name = "/g1", graph2Name = "/g2", graph3Name = "/g3",
  pointsInDomPrefix = "/p"
}) {


  for (let i in vertices) {
    let ind = Number(i) + 1;
    if (Number.isFinite(vertices[i][0])) {
      cy.get(`#${cesc(pointsInDomPrefix + ind)} .mjx-mrow`).should('contain.text', `(${nInDOM(Math.round(vertices[i][0] * 100000000) / 100000000).substring(0, 6)}`)
    }
    if (Number.isFinite(vertices[i][1])) {
      cy.get(`#${cesc(pointsInDomPrefix + ind)} .mjx-mrow`).should('contain.text', `,${nInDOM(Math.round(vertices[i][1] * 100000000) / 100000000).substring(0, 6)}`)
    }
  }
  cy.get(`#${cesc(pointsInDomPrefix + (vertices.length + 1))}`).should('not.exist')


  cy.window().then(async (win) => {
    let stateVariables = await win.returnAllStateVariables1();
    expect(stateVariables[graph1Name + polylineName].stateValues.nVertices).eqls(vertices.length);
    expect(stateVariables[graph2Name + polylineName].stateValues.nVertices).eqls(vertices.length);
    expect(stateVariables[graph3Name + polylineName].stateValues.nVertices).eqls(vertices.length);

    for (let i in vertices) {
      if (Number.isFinite(vertices[i][0])) {
        expect(me.fromAst(stateVariables[graph1Name + polylineName].stateValues.vertices[i][0]).evaluate_to_constant()).closeTo(vertices[i][0], 1E-12);
        expect(me.fromAst(stateVariables[graph2Name + polylineName].stateValues.vertices[i][0]).evaluate_to_constant()).closeTo(vertices[i][0], 1E-12);
        expect(me.fromAst(stateVariables[graph3Name + polylineName].stateValues.vertices[i][0]).evaluate_to_constant()).closeTo(vertices[i][0], 1E-12);
      } else {
        expect(stateVariables[graph1Name + polylineName].stateValues.vertices[i][0]).eq(vertices[i][0]);
        expect(stateVariables[graph2Name + polylineName].stateValues.vertices[i][0]).eq(vertices[i][0]);
        expect(stateVariables[graph3Name + polylineName].stateValues.vertices[i][0]).eq(vertices[i][0]);
      }
      if (Number.isFinite(vertices[i][1])) {
        expect(me.fromAst(stateVariables[graph1Name + polylineName].stateValues.vertices[i][1]).evaluate_to_constant()).closeTo(vertices[i][1], 1E-12);
        expect(me.fromAst(stateVariables[graph2Name + polylineName].stateValues.vertices[i][1]).evaluate_to_constant()).closeTo(vertices[i][1], 1E-12);
        expect(me.fromAst(stateVariables[graph3Name + polylineName].stateValues.vertices[i][1]).evaluate_to_constant()).closeTo(vertices[i][1], 1E-12);
      } else {
        expect(stateVariables[graph1Name + polylineName].stateValues.vertices[i][1]).eq(vertices[i][1]);
        expect(stateVariables[graph2Name + polylineName].stateValues.vertices[i][1]).eq(vertices[i][1]);
        expect(stateVariables[graph3Name + polylineName].stateValues.vertices[i][1]).eq(vertices[i][1]);
      }
    }

  })

}

describe('Polyline Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('Polyline vertices and copied points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)</point>
    <point>(-3,4)</point>
    <polyline vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <copy target="g1/pg" prop="vertices" assignNames="p1 p2 p3 p4" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let vertices = [[3, 5], [-4, -1], [5, 2], [-3, 4]];

    testPolylineCopiedTwice({ vertices });


    cy.log('move individual vertex')
    cy.window().then(async (win) => {

      vertices[1] = [4, 7]

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g1/pg",
        args: {
          pointCoords: { 1: vertices[1] }
        }
      })

      testPolylineCopiedTwice({ vertices });

    })


    cy.log('move copied polyline up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices
        }
      })

      testPolylineCopiedTwice({ vertices });

    })

    cy.log('move double copied individual vertex')
    cy.window().then(async (win) => {

      vertices[2] = [-9, -8]

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g3/pg",
        args: {
          pointCoords: { 2: vertices[2] }
        }
      })

      testPolylineCopiedTwice({ vertices });

    })

  })

  it('Polyline string points in vertices', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>-1</math>
  <graph name="g1" newNamespace>
    <polyline vertices="(3,5) (-4,$(../_math1))(5,2)(-3,4)" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <copy target="g1/pg" prop="vertices" assignNames="p1 p2 p3 p4" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let vertices = [[3, 5], [-4, -1], [5, 2], [-3, 4]];

    testPolylineCopiedTwice({ vertices });


    cy.log('move individual vertex')
    cy.window().then(async (win) => {

      vertices[1] = [4, 7]

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g1/pg",
        args: {
          pointCoords: { 1: vertices[1] }
        }
      })

      testPolylineCopiedTwice({ vertices });

    })


    cy.log('move copied polyline up and to the right')
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices
        }
      })

      testPolylineCopiedTwice({ vertices });

    })

    cy.log('move double copied individual vertex')
    cy.window().then(async (win) => {

      vertices[2] = [-9, -8]

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g3/pg",
        args: {
          pointCoords: { 2: vertices[2] }
        }
      })

      testPolylineCopiedTwice({ vertices });

    })

  })

  it('dynamic polyline with vertices from copied map, initially zero, copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <mathinput name="length" prefill="0" />
  <graph name="g1" newNamespace>
    <map>
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="0" length="$(../length)" /></sources>
    </map>
    <polyline vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6) (p7) (p8) (p9) (p10)" >
    <template><round numberDecimals="8">$v</round></template>
    <sources alias="v"><copy target="g1/pg" prop="vertices" /></sources>
  </map>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let vertices = [];
    testPolylineCopiedTwice({ vertices });

    cy.get('#\\/length textarea').type("{end}{backspace}1{enter}", { force: true }).then(() => {
      vertices[0] = [0, 5 * Math.sin(0)];
      testPolylineCopiedTwice({ vertices });
    });

    cy.get('#\\/length textarea').type("{end}{backspace}2{enter}", { force: true }).then(() => {
      vertices[1] = [1, 5 * Math.sin(1)];
      testPolylineCopiedTwice({ vertices });
    });

    cy.get('#\\/length textarea').type("{end}{backspace}3{enter}", { force: true }).then(() => {
      vertices[2] = [2, 5 * Math.sin(2)];
      testPolylineCopiedTwice({ vertices });
    });

    cy.get('#\\/length textarea').type("{end}{backspace}2{enter}", { force: true }).then(() => {
      vertices.splice(2, 1);
      testPolylineCopiedTwice({ vertices });
    });

    cy.get('#\\/length textarea').type("{end}{backspace}0{enter}", { force: true }).then(() => {
      vertices = []
      testPolylineCopiedTwice({ vertices });
    });

    cy.get('#\\/length textarea').type("{end}{backspace}5{enter}", { force: true }).then(() => {
      for (let i = 0; i < 5; i++) {
        vertices.push([i, 5 * Math.sin(i)])
      }
      testPolylineCopiedTwice({ vertices });
    });


    cy.log("start over and begin with big increment")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>

  <mathinput name="length" prefill="0" />
  <graph name="g1" newNamespace>
    <map>
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="0" length="$(../length)" /></sources>
    </map>
    <polyline vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6) (p7) (p8) (p9) (p10)" >
    <template><round numberDecimals="8">$v</round></template>
    <sources alias="v"><copy target="g1/pg" prop="vertices" /></sources>
  </map>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load


    cy.window().then(async (win) => {
      vertices = [];
      testPolylineCopiedTwice({ vertices });
    })


    cy.get('#\\/length textarea').type("{end}{backspace}10{enter}", { force: true }).then(() => {
      for (let i = 0; i < 10; i++) {
        vertices.push([i, 5 * Math.sin(i)])
      }
      testPolylineCopiedTwice({ vertices });
    });


    cy.get('#\\/length textarea').type("{end}{backspace}{backspace}1{enter}", { force: true }).then(() => {

      vertices = [[0, 5 * Math.sin(0)]]
      testPolylineCopiedTwice({ vertices });
    });


  })

  it('polyline with initially undefined point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput/>

  <graph name="g1" newNamespace>
    <polyline vertices="(1,2) (-1,5) ($(../_mathinput1),7)(3,-5)(-4,-3)" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <map assignNames="(p1) (p2) (p3) (p4) (p5)" >
    <template><round numberDecimals="8">$v</round></template>
    <sources alias="v"><copy target="g1/pg" prop="vertices" /></sources>
  </map>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let vertices = [[1, 2], [-1, 5], ['\uff3f', 7], [3, -5], [-4, -3]];
    testPolylineCopiedTwice({ vertices });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}-2{enter}", { force: true }).then(() => {
      vertices[2][0] = -2;
      testPolylineCopiedTwice({ vertices });
    })

  })

  it(`can't move polyline based on map`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  
  <graph name="g1" newNamespace>
    <map hide assignNames="(mp1) (mp2) (mp3) (mp4) (mp5) (mp6) (mp7) (mp8) (mp9) (mp10) (mp11)" >
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="-5" to="5"/></sources>
    </map>
    <polyline vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6) (p7) (p8) (p9) (p10) (p11)" >
    <template><round numberDecimals="8">$v</round></template>
    <sources alias="v"><copy target="g1/pg" prop="vertices" /></sources>
  </map>
  <textinput name="ti" />
  <copy target="ti" prop="value" assignNames="t" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let vertices = [];
    for (let i = -5; i <= 5; i++) {
      vertices.push([i, 5 * Math.sin(i)]);
    }
    testPolylineCopiedTwice({ vertices });


    cy.log("can't move points")
    cy.window().then(async (win) => {

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/mp1",
        args: { x: 9, y: -8 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/mp9",
        args: { x: -8, y: 4 }
      })

      // since core could be delayed and we can't tell that no change occurred,
      // change value of textinput and wait for the change to be processed by core
      cy.get('#\\/ti_input').type("wait{enter}")
      cy.get('#\\/t').should('have.text', "wait").then(() => {
        testPolylineCopiedTwice({ vertices });
      })
    })


    cy.log("can't move polyline1")
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;

      let vertices2 = vertices.map(v => [v[0] + moveX, v[1] + moveY]);

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g1/pg",
        args: {
          pointCoords: vertices2
        }
      })

      cy.get('#\\/ti_input').clear().type("more{enter}")
      cy.get('#\\/t').should('have.text', "more").then(() => {
        testPolylineCopiedTwice({ vertices });
      })
    })

    cy.log("can't move polyline2")
    cy.window().then(async (win) => {

      let moveX = -5;
      let moveY = 6;

      let vertices2 = vertices.map(v => [v[0] + moveX, v[1] + moveY]);

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices2
        }
      })

      cy.get('#\\/ti_input').clear().type("less{enter}")
      cy.get('#\\/t').should('have.text', "less").then(() => {
        testPolylineCopiedTwice({ vertices });
      })

    })

    cy.log("can't move polyline3")
    cy.window().then(async (win) => {

      let moveX = 7;
      let moveY = -4;

      let vertices2 = vertices.map(v => [v[0] + moveX, v[1] + moveY]);

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g3/pg",
        args: {
          pointCoords: vertices2
        }
      })

      cy.get('#\\/ti_input').clear().type("last{enter}")
      cy.get('#\\/t').should('have.text', "last").then(() => {
        testPolylineCopiedTwice({ vertices });
      })

    })
  })

  it(`create moveable polyline based on map`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph name="g1" newNamespace>
    <map hide assignNames="(mp1) (mp2) (mp3) (mp4) (mp5) (mp6) (mp7) (mp8) (mp9) (mp10) (mp11)" >
      <template><point>($x + <math>0</math>, 5sin($x) + <math>0</math>)</point></template>
      <sources alias="x"><sequence from="-5" to="5"/></sources>
    </map>
    <polyline vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6) (p7) (p8) (p9) (p10) (p11)" >
    <template><round numberDecimals="8">$v</round></template>
    <sources alias="v"><copy target="g1/pg" prop="vertices" /></sources>
  </map>
  <textinput name="ti" />
  <copy target="ti" prop="value" assignNames="t" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let vertices = [];
    for (let i = -5; i <= 5; i++) {
      vertices.push([i, 5 * Math.sin(i)]);
    }
    testPolylineCopiedTwice({ vertices });


    cy.log("can move points")

    cy.window().then(async (win) => {

      vertices[0] = [9, -8];
      vertices[8] = [-8, 4];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/mp1",
        args: { x: vertices[0][0], y: vertices[0][1] }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/mp9",
        args: { x: vertices[8][0], y: vertices[8][1] }
      })

      testPolylineCopiedTwice({ vertices });

    })


    cy.log("can move polyline1")
    cy.window().then(async (win) => {

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g1/pg",
        args: {
          pointCoords: vertices
        }
      })

      testPolylineCopiedTwice({ vertices });

    })

    cy.log("can move polyline2")
    cy.window().then(async (win) => {

      let moveX = -5;
      let moveY = 6;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices
        }
      })

      testPolylineCopiedTwice({ vertices });

    })


    cy.log("can move polyline3")
    cy.window().then(async (win) => {

      let moveX = 7;
      let moveY = -4;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices
        }
      })

      testPolylineCopiedTwice({ vertices });

    })


  })

  it('copy vertices of polyline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="(-3,-1)(1,2)(3,4)(6,-2)" />
  </graph>
  <graph>
  <copy assignNames="v1" prop="vertex1" target="_polyline1" />
  <copy assignNames="v2" prop="vertex2" target="_polyline1" />
  <copy assignNames="v3" prop="vertex3" target="_polyline1" />
  <copy assignNames="v4" prop="vertex4" target="_polyline1" />
  </graph>
  <graph>
  <copy assignNames="v1a v2a v3a v4a" prop="vertices" target="_polyline1" />
  </graph>
  <copy assignNames="v4b" prop="vertex4" target="_polyline1" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let ps = [[-3, -1], [1, 2], [3, 4], [6, -2]];

      for (let i = 0; i < 4; i++) {
        expect((stateVariables[`/v${i + 1}`].stateValues.xs)[0]).eq(ps[i][0]);
        expect((stateVariables[`/v${i + 1}a`].stateValues.xs)[0]).eq(ps[i][0]);
        expect((stateVariables[`/v${i + 1}`].stateValues.xs)[1]).eq(ps[i][1]);
        expect((stateVariables[`/v${i + 1}a`].stateValues.xs)[1]).eq(ps[i][1]);
      }
    })

    cy.log('move individually copied vertices');
    cy.window().then(async (win) => {
      let ps = [[-5, 3], [-2, 7], [0, -8], [9, -6]];

      for (let i = 0; i < 4; i++) {
        win.callAction1({
          actionName: "movePoint",
          componentName: `/v${i + 1}`,
          args: { x: ps[i][0], y: ps[i][1] }
        })
      }

      cy.get('#\\/v4b .mjx-mrow').should('contain.text', `(${nInDOM(ps[3][0])},${nInDOM(ps[3][1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        for (let i = 0; i < 4; i++) {
          expect((stateVariables[`/v${i + 1}`].stateValues.xs)[0]).eq(ps[i][0]);
          expect((stateVariables[`/v${i + 1}a`].stateValues.xs)[0]).eq(ps[i][0]);
          expect((stateVariables[`/v${i + 1}`].stateValues.xs)[1]).eq(ps[i][1]);
          expect((stateVariables[`/v${i + 1}a`].stateValues.xs)[1]).eq(ps[i][1]);
        }
      })

    })

    cy.log('move array-copied vertices');
    cy.window().then(async (win) => {
      let ps = [[-7, -1], [-3, 5], [2, 4], [6, 0]];

      for (let i = 0; i < 4; i++) {
        win.callAction1({
          actionName: "movePoint",
          componentName: `/v${i + 1}a`,
          args: { x: ps[i][0], y: ps[i][1] }
        })
      }

      cy.get('#\\/v4b .mjx-mrow').should('contain.text', `(${nInDOM(ps[3][0])},${nInDOM(ps[3][1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        for (let i = 0; i < 4; i++) {
          expect((stateVariables[`/v${i + 1}`].stateValues.xs)[0]).eq(ps[i][0]);
          expect((stateVariables[`/v${i + 1}a`].stateValues.xs)[0]).eq(ps[i][0]);
          expect((stateVariables[`/v${i + 1}`].stateValues.xs)[1]).eq(ps[i][1]);
          expect((stateVariables[`/v${i + 1}a`].stateValues.xs)[1]).eq(ps[i][1]);
        }
      })

    })

  })

  it('new polyline from copied vertices of polyline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
  <polyline vertices="(-9,6)(-3,7)(4,0)(8,5)" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <polyline vertices="$(../g1/pg{prop='vertices'})" name="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <copy target="g1/pg" prop="vertices" assignNames="p1 p2 p3 p4" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load



    let vertices = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

    testPolylineCopiedTwice({ vertices });


    cy.log('move first polyline up and to the right')
    cy.window().then(async (win) => {

      let moveX = 4;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g1/pg",
        args: {
          pointCoords: vertices
        }
      })

      testPolylineCopiedTwice({ vertices });

    })


    cy.log('move copied polyline up and to the left')
    cy.window().then(async (win) => {

      let moveX = -7;
      let moveY = 3;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices
        }
      })

      testPolylineCopiedTwice({ vertices });

    })


    cy.log('move dobule copied polyline down and to the left')
    cy.window().then(async (win) => {

      let moveX = -1;
      let moveY = -4;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/g3/pg",
        args: {
          pointCoords: vertices
        }
      })

      testPolylineCopiedTwice({ vertices });

    })


  })

  it('new polyline as translated version of polyline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="5" name="transx" />
    <mathinput prefill="7" name="transy" />
    <graph>
    <polyline vertices=" (0,0) (3,-4) (1,-6) (-5,-6) " />
    <map hide>
      <template newNamespace>
        <point>(<extract prop="x"><copy target="x" fixed="false"/></extract>+
          <copy prop="value" modifyIndirectly="false" target="../transx" />,
        <extract prop="y"><copy target="x" fixed="false" /></extract>+
        <copy prop="value" modifyIndirectly="false" target="../transy" />)
        </point>
      </template>
      <sources alias="x">
        <copy prop="vertices" name="vs" target="_polyline1" />
      </sources>
    </map>
    <polyline vertices="$_map1" />
    </graph>
    <copy target="_polyline2" prop="vertices" assignNames="p1 p2 p3 p4" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    async function testPolylines({ vertices, transX, transY }) {

      let vertices2 = vertices.map(v => [v[0] + transX, v[1] + transY])

      for (let i in vertices) {
        let ind = Number(i) + 1;
        cy.get(`#${cesc("/p" + ind)} .mjx-mrow`).should('contain.text', `(${nInDOM(Math.round(vertices2[i][0] * 100000000) / 100000000).substring(0, 6)}`)
        cy.get(`#${cesc("/p" + ind)} .mjx-mrow`).should('contain.text', `,${nInDOM(Math.round(vertices2[i][1] * 100000000) / 100000000).substring(0, 6)}`)
      }
      cy.get(`#${cesc("/p" + (vertices.length + 1))}`).should('not.exist')


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polyline1"].stateValues.nVertices).eqls(vertices.length);
        expect(stateVariables["/_polyline2"].stateValues.nVertices).eqls(vertices.length);

        for (let i in vertices) {
          if (Number.isFinite(vertices[i][0])) {
            expect(me.fromAst(stateVariables["/_polyline1"].stateValues.vertices[i][0]).evaluate_to_constant()).closeTo(vertices[i][0], 1E-12);
            expect(me.fromAst(stateVariables["/_polyline2"].stateValues.vertices[i][0]).evaluate_to_constant()).closeTo(vertices2[i][0], 1E-12);
          } else {
            expect(stateVariables["/_polyline1"].stateValues.vertices[i][0]).eq(vertices[i][0]);
            expect(stateVariables["/_polyline2"].stateValues.vertices[i][0]).eq(vertices2[i][0]);
          }
          if (Number.isFinite(vertices[i][1])) {
            expect(me.fromAst(stateVariables["/_polyline1"].stateValues.vertices[i][1]).evaluate_to_constant()).closeTo(vertices[i][1], 1E-12);
            expect(me.fromAst(stateVariables["/_polyline2"].stateValues.vertices[i][1]).evaluate_to_constant()).closeTo(vertices2[i][1], 1E-12);
          } else {
            expect(stateVariables["/_polyline1"].stateValues.vertices[i][1]).eq(vertices[i][1]);
            expect(stateVariables["/_polyline2"].stateValues.vertices[i][1]).eq(vertices2[i][1]);
          }
        }

      })

    }


    let vertices = [[0, 0], [3, -4], [1, -6], [-5, -6]];
    let transX = 5;
    let transY = 7;

    testPolylines({ vertices, transX, transY })


    cy.log("move points on first polyline")
    cy.window().then(async (win) => {
      vertices = [[1, -1], [-3, 2], [-1, 7], [6, 3]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: vertices
        }
      })

      testPolylines({ vertices, transX, transY })

    })

    cy.log("move points on second polyline")
    cy.window().then(async (win) => {
      let vertices2 = [[-3, 4], [1, 0], [9, 6], [2, -1]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline2",
        args: {
          pointCoords: vertices2
        }
      })

      vertices = vertices2.map(v => [v[0] - transX, v[1] - transY])

      testPolylines({ vertices, transX, transY })

    })


    cy.log("change translation")
    cy.get("#\\/transx textarea").type("{end}{backspace}2{enter}", { force: true });
    cy.get("#\\/transy textarea").type("{end}{backspace}10{enter}", { force: true });
    cy.window().then(async (win) => {

      transX = 2;
      transY = 10;

      testPolylines({ vertices, transX, transY })

    })

  })

  it('open parallelogram based on three points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <polyline name="parallelogram" vertices="(1,2) (3,4) (-5,6) ($(parallelogram{fixed prop='vertexX1_1'})+$(parallelogram{fixed prop='vertexX3_1'})-$(parallelogram{prop='vertexX2_1'}), $(parallelogram{fixed prop='vertexX1_2'})+$(parallelogram{fixed prop='vertexX3_2'})-$(parallelogram{prop='vertexX2_2'}))" />
    </graph>

    <copy target="parallelogram" prop="vertices" assignNames="p1 p2 p3 p4" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/parallelogram'].stateValues.vertices)[0]).eqls(A);
      expect((stateVariables['/parallelogram'].stateValues.vertices)[1]).eqls(B);
      expect((stateVariables['/parallelogram'].stateValues.vertices)[2]).eqls(C);
      expect((stateVariables['/parallelogram'].stateValues.vertices)[3]).eqls(D);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -1];
      D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/parallelogram",
        args: {
          pointCoords: { 0: A }
        }
      })

      cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/parallelogram'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[3]).eqls(D);
      })
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];
      D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/parallelogram",
        args: {
          pointCoords: { 1: B }
        }
      })

      cy.get('#\\/p2 .mjx-mrow').should("contain.text", `(${nInDOM(B[0])},${nInDOM(B[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/parallelogram'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[3]).eqls(D);
      })
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];
      D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/parallelogram",
        args: {
          pointCoords: { 2: C }
        }
      })

      cy.get('#\\/p3 .mjx-mrow').should("contain.text", `(${nInDOM(C[0])},${nInDOM(C[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/parallelogram'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[3]).eqls(D);
      })
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      D = [7, 0];
      B = [A[0] + C[0] - D[0], A[1] + C[1] - D[1]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/parallelogram",
        args: {
          pointCoords: { 3: D }
        }
      })

      cy.get('#\\/p4 .mjx-mrow').should("contain.text", `(${nInDOM(D[0])},${nInDOM(D[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/parallelogram'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/parallelogram'].stateValues.vertices)[3]).eqls(D);
      })
    })

  })

  it('new polyline from copied vertices, some flipped', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <polyline vertices="(-9,6)(-3,7)(4,0)(8,5)" />
  </graph>
  <graph>
    <polyline vertices="$(_polyline1{prop='vertex1'}) ($(_polyline1{prop='vertexX2_2'}), $(_polyline1{prop='vertexX2_1'})) $(_polyline1{prop='vertex3'}) ($(_polyline1{prop='vertexX4_2'}), $(_polyline1{prop='vertexX4_1'}))" />
  </graph>
  <copy target="_polyline2" prop="vertices" assignNames="p1 p2 p3 p4" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    async function testPolylines({ vertices }) {

      let vertices2 = [...vertices];
      vertices2[1] = [vertices2[1][1], vertices2[1][0]];
      vertices2[3] = [vertices2[3][1], vertices2[3][0]];

      for (let i in vertices) {
        let ind = Number(i) + 1;
        cy.get(`#${cesc("/p" + ind)} .mjx-mrow`).should('contain.text', `(${nInDOM(Math.round(vertices2[i][0] * 100000000) / 100000000).substring(0, 6)}`)
        cy.get(`#${cesc("/p" + ind)} .mjx-mrow`).should('contain.text', `,${nInDOM(Math.round(vertices2[i][1] * 100000000) / 100000000).substring(0, 6)}`)
      }
      cy.get(`#${cesc("/p" + (vertices.length + 1))}`).should('not.exist')


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polyline1"].stateValues.nVertices).eqls(vertices.length);
        expect(stateVariables["/_polyline2"].stateValues.nVertices).eqls(vertices.length);

        for (let i in vertices) {
          if (Number.isFinite(vertices[i][0])) {
            expect(me.fromAst(stateVariables["/_polyline1"].stateValues.vertices[i][0]).evaluate_to_constant()).closeTo(vertices[i][0], 1E-12);
            expect(me.fromAst(stateVariables["/_polyline2"].stateValues.vertices[i][0]).evaluate_to_constant()).closeTo(vertices2[i][0], 1E-12);
          } else {
            expect(stateVariables["/_polyline1"].stateValues.vertices[i][0]).eq(vertices[i][0]);
            expect(stateVariables["/_polyline2"].stateValues.vertices[i][0]).eq(vertices2[i][0]);
          }
          if (Number.isFinite(vertices[i][1])) {
            expect(me.fromAst(stateVariables["/_polyline1"].stateValues.vertices[i][1]).evaluate_to_constant()).closeTo(vertices[i][1], 1E-12);
            expect(me.fromAst(stateVariables["/_polyline2"].stateValues.vertices[i][1]).evaluate_to_constant()).closeTo(vertices2[i][1], 1E-12);
          } else {
            expect(stateVariables["/_polyline1"].stateValues.vertices[i][1]).eq(vertices[i][1]);
            expect(stateVariables["/_polyline2"].stateValues.vertices[i][1]).eq(vertices2[i][1]);
          }
        }

      })

    }


    let vertices = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

    testPolylines({ vertices })

    cy.log('move first polyline verticies')
    cy.window().then(async (win) => {
      vertices = [[7, 2], [1, -3], [2, 9], [-4, -3]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: vertices
        }
      })

      testPolylines({ vertices })

    })

    cy.log('move second polyline verticies')
    cy.window().then(async (win) => {
      let vertices2 = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline2",
        args: {
          pointCoords: vertices2
        }
      })

      vertices = [...vertices2];
      vertices[1] = [vertices[1][1], vertices[1][0]];
      vertices[3] = [vertices[3][1], vertices[3][0]];

      testPolylines({ vertices })

    })

  })

  it('four vertex polyline based on three points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="(1,2) (3,4) (-5,6) ($(_polyline1{fixed prop='vertexX3_1'})+$(_polyline1{fixed prop='vertexX2_1'})-$(_polyline1{prop='vertexX1_1'}), $(_polyline1{fixed prop='vertexX3_2'})+$(_polyline1{fixed prop='vertexX2_2'})-$(_polyline1{prop='vertexX1_2'}))" />
  </graph>
  <copy target="_polyline1" prop="vertices" assignNames="p1 p2 p3 p4" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

    cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(D);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -1];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 0: A }
        }
      })

      cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(D);
      })
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 1: B }
        }
      })

      cy.get('#\\/p2 .mjx-mrow').should("contain.text", `(${nInDOM(B[0])},${nInDOM(B[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(D);
      })
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 2: C }
        }
      })

      cy.get('#\\/p3 .mjx-mrow').should("contain.text", `(${nInDOM(C[0])},${nInDOM(C[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(D);
      })
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      D = [7, 0];
      A = [C[0] + B[0] - D[0], C[1] + B[1] - D[1]];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 3: D }
        }
      })

      cy.get('#\\/p4 .mjx-mrow').should("contain.text", `(${nInDOM(D[0])},${nInDOM(D[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(D);
      })
    })

  })

  it('fourth vertex depends on internal copy of first vertex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="(1,2) (3,4)(-5,6) $(_polyline1{prop='vertex1' componentType='point'})" />
  </graph>
  <copy target="_polyline1" prop="vertices" assignNames="p1 p2 p3 p4" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];

    cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_polyline1'].stateValues.nVertices).eq(4)
      expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -1];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 0: A }
        }
      })

      cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
      })
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 1: B }
        }
      })

      cy.get('#\\/p2 .mjx-mrow').should("contain.text", `(${nInDOM(B[0])},${nInDOM(B[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
      })
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 2: C }
        }
      })

      cy.get('#\\/p3 .mjx-mrow').should("contain.text", `(${nInDOM(C[0])},${nInDOM(C[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
      })
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      A = [7, 0];
      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 3: A }
        }
      })

      cy.get('#\\/p4 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
      })
    })

  })

  it('first vertex depends on internal copy of fourth vertex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="$(_polyline1{prop='vertex4' componentType='point' }) (3,4) (-5,6) (1,2)" />
  </graph>
  <copy target="_polyline1" prop="vertices" assignNames="p1 p2 p3 p4" />
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];

    cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_polyline1'].stateValues.nVertices).eq(4)
      expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -1];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 0: A }
        }
      })

      cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
      })
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 1: B }
        }
      })

      cy.get('#\\/p2 .mjx-mrow').should("contain.text", `(${nInDOM(B[0])},${nInDOM(B[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
      })
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 2: C }
        }
      })

      cy.get('#\\/p3 .mjx-mrow').should("contain.text", `(${nInDOM(C[0])},${nInDOM(C[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
      })
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      A = [7, 0];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 3: A }
        }
      })

      cy.get('#\\/p4 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
      })
    })

  })

  it('first vertex depends fourth, formula for fifth', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="$(_polyline1{prop='vertex4' componentType='point'}) (3,4)(-5,6) (1,2) ($(_polyline1{prop='vertexX1_1'})+1,2)" />
  </graph>
  <copy target="_polyline1" prop="vertices" assignNames="p1 p2 p3 p4 p5" />
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [A[0] + 1, 2];

    cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
      expect((stateVariables['/_polyline1'].stateValues.vertices)[4]).eqls(D);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -1];
      D[0] = A[0] + 1;

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 0: A }
        }
      })

      cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[4]).eqls(D);
      })
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 1: B }
        }
      })

      cy.get('#\\/p2 .mjx-mrow').should("contain.text", `(${nInDOM(B[0])},${nInDOM(B[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[4]).eqls(D);
      })
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 2: C }
        }
      })

      cy.get('#\\/p3 .mjx-mrow').should("contain.text", `(${nInDOM(C[0])},${nInDOM(C[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[4]).eqls(D);
      })
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      A = [7, 0];
      D[0] = A[0] + 1;

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 3: A }
        }
      })

      cy.get('#\\/p4 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[4]).eqls(D);
      })
    })

    cy.log('move fifth vertex')
    cy.window().then(async (win) => {
      D = [-5, 9];
      A[0] = D[0] - 1;

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 4: D }
        }
      })

      cy.get('#\\/p5 .mjx-mrow').should("contain.text", `(${nInDOM(D[0])},${nInDOM(D[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_polyline1'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/_polyline1'].stateValues.vertices)[4]).eqls(D);
      })
    })

  })

  it('first, fourth, seventh vertex depends on fourth, seventh, tenth', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline name="P" vertices="$(P{prop='vertex4' componentType='point'}) (1,2) (3,4) $(P{prop='vertex7' componentType='point'}) (5,7) (-5,7) $(P{prop='vertex10' componentType='point'}) (3,1) (5,0) (-5,-1)" />
  </graph>
  <copy target="P" prop="vertices" assignNames="p1 p2 p3 p4 p5 p6 p7 p8 p9 p10" />
  
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

    cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
      expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
      expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
      expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
      expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
      expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
      expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
      expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
      expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
      expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -9];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 0: A }
        }
      })

      cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 1: B }
        }
      })

      cy.get('#\\/p2 .mjx-mrow').should("contain.text", `(${nInDOM(B[0])},${nInDOM(B[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 2: C }
        }
      })

      cy.get('#\\/p3 .mjx-mrow').should("contain.text", `(${nInDOM(C[0])},${nInDOM(C[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      A = [7, 0];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 3: A }
        }
      })

      cy.get('#\\/p4 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move fifth vertex')
    cy.window().then(async (win) => {
      D = [-9, 1];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 4: D }
        }
      })

      cy.get('#\\/p5 .mjx-mrow').should("contain.text", `(${nInDOM(D[0])},${nInDOM(D[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move sixth vertex')
    cy.window().then(async (win) => {
      E = [-3, 6];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 5: E }
        }
      })

      cy.get('#\\/p6 .mjx-mrow').should("contain.text", `(${nInDOM(E[0])},${nInDOM(E[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move seventh vertex')
    cy.window().then(async (win) => {
      A = [2, -4];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 6: A }
        }
      })

      cy.get('#\\/p7 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move eighth vertex')
    cy.window().then(async (win) => {
      F = [6, 7];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 7: F }
        }
      })

      cy.get('#\\/p8 .mjx-mrow').should("contain.text", `(${nInDOM(F[0])},${nInDOM(F[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move nineth vertex')
    cy.window().then(async (win) => {
      G = [1, -8];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 8: G }
        }
      })

      cy.get('#\\/p9 .mjx-mrow').should("contain.text", `(${nInDOM(G[0])},${nInDOM(G[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move tenth vertex')
    cy.window().then(async (win) => {
      A = [-6, 10];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 9: A }
        }
      })

      cy.get('#\\/p10 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })
  })

  it('first, fourth, seventh vertex depends on shifted fourth, seventh, tenth', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline name="P" vertices="($(P{prop='vertexX4_1'})+1,$(P{prop='vertexX4_2'})+1) (1,2) (3,4) ($(P{prop='vertexX7_1'})+1,$(P{prop='vertexX7_2'})+1) (5,7) (-5,7) ($(P{prop='vertexX10_1'})+1,$(P{prop='vertexX10_2'})+1) (3,1) (5,0) (-5,-1)" />
  </graph>
  <copy target="P" prop="vertices" assignNames="p1 p2 p3 p4 p5 p6 p7 p8 p9 p10" />
  
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

    cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A3[0])},${nInDOM(A3[1])})`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
      expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
      expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
      expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
      expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
      expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
      expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
      expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
      expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
      expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -9];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 0: A3 }
        }
      })

      cy.get('#\\/p1 .mjx-mrow').should("contain.text", `(${nInDOM(A3[0])},${nInDOM(A3[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 1: B }
        }
      })

      cy.get('#\\/p2 .mjx-mrow').should("contain.text", `(${nInDOM(B[0])},${nInDOM(B[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 2: C }
        }
      })

      cy.get('#\\/p3 .mjx-mrow').should("contain.text", `(${nInDOM(C[0])},${nInDOM(C[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      A = [7, 0];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 3: A2 }
        }
      })

      cy.get('#\\/p4 .mjx-mrow').should("contain.text", `(${nInDOM(A2[0])},${nInDOM(A2[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move fifth vertex')
    cy.window().then(async (win) => {
      D = [-9, 1];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 4: D }
        }
      })

      cy.get('#\\/p5 .mjx-mrow').should("contain.text", `(${nInDOM(D[0])},${nInDOM(D[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move sixth vertex')
    cy.window().then(async (win) => {
      E = [-3, 6];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 5: E }
        }
      })

      cy.get('#\\/p6 .mjx-mrow').should("contain.text", `(${nInDOM(E[0])},${nInDOM(E[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move seventh vertex')
    cy.window().then(async (win) => {
      A = [2, -4];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 6: A1 }
        }
      })

      cy.get('#\\/p7 .mjx-mrow').should("contain.text", `(${nInDOM(A1[0])},${nInDOM(A1[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move eighth vertex')
    cy.window().then(async (win) => {
      F = [6, 7];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 7: F }
        }
      })

      cy.get('#\\/p8 .mjx-mrow').should("contain.text", `(${nInDOM(F[0])},${nInDOM(F[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move nineth vertex')
    cy.window().then(async (win) => {
      G = [1, -8];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 8: G }
        }
      })

      cy.get('#\\/p9 .mjx-mrow').should("contain.text", `(${nInDOM(G[0])},${nInDOM(G[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })

    cy.log('move tenth vertex')
    cy.window().then(async (win) => {
      A = [-6, 7];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/P",
        args: {
          pointCoords: { 9: A }
        }
      })

      cy.get('#\\/p10 .mjx-mrow').should("contain.text", `(${nInDOM(A[0])},${nInDOM(A[1])})`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/P'].stateValues.vertices)[0]).eqls(A3);
        expect((stateVariables['/P'].stateValues.vertices)[1]).eqls(B);
        expect((stateVariables['/P'].stateValues.vertices)[2]).eqls(C);
        expect((stateVariables['/P'].stateValues.vertices)[3]).eqls(A2);
        expect((stateVariables['/P'].stateValues.vertices)[4]).eqls(D);
        expect((stateVariables['/P'].stateValues.vertices)[5]).eqls(E);
        expect((stateVariables['/P'].stateValues.vertices)[6]).eqls(A1);
        expect((stateVariables['/P'].stateValues.vertices)[7]).eqls(F);
        expect((stateVariables['/P'].stateValues.vertices)[8]).eqls(G);
        expect((stateVariables['/P'].stateValues.vertices)[9]).eqls(A);
      })
    })
  })

  it('attract to polyline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <polyline vertices=" (3,5) (-4,-1)(5,2)" />
    <point x="7" y="8">
      <constraints>
        <attractTo><copy target="_polyline1" /></attractTo>
      </constraints>
    </point>
  </graph>
  <copy target="_point1" assignNames="p1" />
  <copy target="_polyline1" prop="vertices" assignNames="v1 v2 v3" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let x1 = 3, x2 = -4, x3 = 5;
    let y1 = 5, y2 = -1, y3 = 2;

    cy.log('point originally not attracted')

    cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(7,8)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.coords).eqls(['vector', 7, 8]);
    })

    cy.log('move point near segment 1')
    cy.window().then(async (win) => {

      let x = 1;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(1.14`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)
      })
    })


    cy.log('move point near segment 2')
    cy.window().then(async (win) => {

      let x = 3;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.4;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(3.12`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)
      })
    })

    cy.log('move point near segment between first and last vertices')
    cy.window().then(async (win) => {

      let x = 4;
      let mseg3 = (y1 - y3) / (x1 - x3);
      let y = mseg3 * (x - x3) + y3 + 0.2;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(4,`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x, 1E-6);
        expect(py).closeTo(y, 1E-6);

      })
    })

    cy.log('move point just past first vertex')
    cy.window().then(async (win) => {

      let x = x1 + 0.2;
      let y = y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(3,5)`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x1, 1E-6);
        expect(py).closeTo(y1, 1E-6);
      })
    })

    cy.log('point not attracted along extension of first segment')
    cy.window().then(async (win) => {

      let x = 4;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(4,`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x, 1E-6);
        expect(py).closeTo(y, 1E-6);
      })
    })

    cy.window().then(async (win) => {

      let x = -5;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(${nInDOM(-5)},`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x, 1E-6);
        expect(py).closeTo(y, 1E-6);
      })
    })


    cy.log('move point just past second vertex')
    cy.window().then(async (win) => {

      let x = x2 - 0.2;
      let y = y2 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(${nInDOM(-4)},`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x2, 1E-6);
        expect(py).closeTo(y2, 1E-6);
      })
    })


    cy.log('point not attracted along extension of second segment')
    cy.window().then(async (win) => {

      let x = 6;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(6,`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x, 1E-6);
        expect(py).closeTo(y, 1E-6);
      })
    })

    cy.window().then(async (win) => {

      let x = -5;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(${nInDOM(-5)},`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x, 1E-6);
        expect(py).closeTo(y, 1E-6);
      })
    })



    cy.log('move polyline so point attracts to first segment')
    cy.window().then(async (win) => {

      let moveX = -3;
      let moveY = -2;

      x1 += moveX;
      x2 += moveX;
      x3 += moveX;
      y1 += moveY;
      y2 += moveY;
      y3 += moveY;

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: [[x1, y1], [x2, y2], [x3, y3]]
        }
      })

      cy.get('#\\/v1 .mjx-mrow').should('contain.text', `(${nInDOM(x1)},${nInDOM(y1)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        let mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)
      })
    })


    cy.log('move second vertex so point attracts to second segment')
    cy.window().then(async (win) => {

      let moveX = -1;
      let moveY = 1;

      x2 += moveX;
      y2 += moveY;

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 1: [x2, y2] }
        }
      })

      cy.get('#\\/v2 .mjx-mrow').should('contain.text', `(${nInDOM(x2)},${nInDOM(y2)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        let mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)
      })
    })
  })

  it('constrain to polyline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <polyline vertices=" (3,5) (-4,-1)(5,2)" />
    <point x="7" y="8">
      <constraints>
        <constrainTo><copy target="_polyline1" /></constrainTo>
      </constraints>
    </point>
  </graph>
  <copy target="_point1" assignNames="p1" />
  <copy target="_polyline1" prop="vertices" assignNames="v1 v2 v3" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let x1 = 3, x2 = -4, x3 = 5;
    let y1 = 5, y2 = -1, y3 = 2;

    cy.log('point originally constrained')

    cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(${nInDOM(x1)},${nInDOM(y1)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.coords).eqls(['vector', x1, y1]);
    })

    cy.log('move point near segment 1')
    cy.window().then(async (win) => {

      let x = 1;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(1.14`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)
      })
    })


    cy.log('move point near segment 2')
    cy.window().then(async (win) => {

      let x = 3;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.4;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(3.12`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)
      })
    })

    cy.log('move point near segment between first and last vertices')
    cy.window().then(async (win) => {

      let x = 4;
      let mseg3 = (y1 - y3) / (x1 - x3);
      let y = mseg3 * (x - x3) + y3 + 0.2;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(2.93`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];
        let mseg1 = (y2 - y1) / (x2 - x1);
        expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

      })
    })

    cy.log('move point just past first vertex')
    cy.window().then(async (win) => {

      let x = x1 + 0.2;
      let y = y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(3,5)`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x1, 1E-6);
        expect(py).closeTo(y1, 1E-6);
      })
    })

    cy.log('point along extension of first segment constrained to endpoint')
    cy.window().then(async (win) => {

      let x = 4;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(${nInDOM(x1)},${nInDOM(y1)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x1, 1E-6);
        expect(py).closeTo(y1, 1E-6);
      })
    })

    cy.window().then(async (win) => {

      let x = -5;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(${nInDOM(x2)},${nInDOM(y2)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x2, 1E-6);
        expect(py).closeTo(y2, 1E-6);
      })
    })


    cy.log('move point just past second vertex')
    cy.window().then(async (win) => {

      let x = x2 - 0.2;
      let y = y2 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(${nInDOM(x2)},${nInDOM(y2)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x2, 1E-6);
        expect(py).closeTo(y2, 1E-6);
      })
    })


    cy.log('point along extension of second segment constrained to endpoint')
    cy.window().then(async (win) => {

      let x = 6;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(${nInDOM(x3)},${nInDOM(y3)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x3, 1E-6);
        expect(py).closeTo(y3, 1E-6);
      })
    })

    cy.window().then(async (win) => {

      let x = -5;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y }
      })

      cy.get('#\\/p1 .mjx-mrow').should('contain.text', `(${nInDOM(x2)},${nInDOM(y2)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        expect(px).closeTo(x2, 1E-6);
        expect(py).closeTo(y2, 1E-6);
      })
    })


    cy.log('move polyline so point constrained to first segment')
    cy.window().then(async (win) => {

      let moveX = -3;
      let moveY = -5;

      x1 += moveX;
      x2 += moveX;
      x3 += moveX;
      y1 += moveY;
      y2 += moveY;
      y3 += moveY;

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: [[x1, y1], [x2, y2], [x3, y3]]
        }
      })

      cy.get('#\\/v1 .mjx-mrow').should('contain.text', `(${nInDOM(x1)},${nInDOM(y1)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        let mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)
      })
    })


    cy.log('move second vertex so point constrained to second segment')
    cy.window().then(async (win) => {

      let moveX = -1;
      let moveY = 8;

      x2 += moveX;
      y2 += moveY;

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/_polyline1",
        args: {
          pointCoords: { 1: [x2, y2] }
        }
      })

      cy.get('#\\/v2 .mjx-mrow').should('contain.text', `(${nInDOM(x2)},${nInDOM(y2)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables['/_point1'].stateValues.xs[0];
        let py = stateVariables['/_point1'].stateValues.xs[1];

        let mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)
      })
    })
  })

  it('constrain to polyline, different scales from graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <polyline vertices="(-50,-0.02) (-40,0.07) (70,0.06) (10,-0.01)" name="p" />
    <point x="0" y="0.01" name="A">
      <constraints baseOnGraph="_graph1">
        <constrainTo><copy target="p" /></constrainTo>
      </constraints>
    </point>
  </graph>
  <copy target="A" assignNames="A2" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let x1 = -50, x2 = -40, x3 = 70, x4 = 10;
    let y1 = -0.02, y2 = 0.07, y3 = 0.06, y4 = -0.01;

    cy.log('point originally on segment 3')

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', `(${nInDOM(15.)}`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mseg3 = (y4 - y3) / (x4 - x3);

      let px = stateVariables['/A'].stateValues.xs[0];
      let py = stateVariables['/A'].stateValues.xs[1];

      expect(py).closeTo(mseg3 * (px - x3) + y3, 1E-6)

    })

    cy.log('move point near segment 1')
    cy.window().then(async (win) => {

      let mseg1 = (y2 - y1) / (x2 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: `/A`,
        args: { x: -20, y: 0.02 }
      })

      cy.get('#\\/A2 .mjx-mrow').should('contain.text', `(${nInDOM(-45.)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/A'].stateValues.xs[0];
        let py = stateVariables['/A'].stateValues.xs[1];

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)
      })
    })


    cy.log('move point near segment 2')
    cy.window().then(async (win) => {

      let mseg2 = (y2 - y3) / (x2 - x3);

      win.callAction1({
        actionName: "movePoint",
        componentName: `/A`,
        args: { x: 0, y: 0.04 }
      })

      cy.get('#\\/A2 .mjx-mrow').should('contain.text', `(${nInDOM(2.3)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/A'].stateValues.xs[0];
        let py = stateVariables['/A'].stateValues.xs[1];

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)
      })
    })


    cy.log('move point near segement between first and last vertices')
    cy.window().then(async (win) => {

      let mseg3 = (y4 - y3) / (x4 - x3);

      win.callAction1({
        actionName: "movePoint",
        componentName: `/A`,
        args: { x: -10, y: 0.02 }
      })

      cy.get('#\\/A2 .mjx-mrow').should('contain.text', `(${nInDOM(16.)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables['/A'].stateValues.xs[0];
        let py = stateVariables['/A'].stateValues.xs[1];

        expect(py).closeTo(mseg3 * (px - x3) + y3, 1E-6)
      })
    })

  })

  it('fixed polyline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <polyline vertices="(1,3) (5,7) (-2,6)" name="p" fixed />
  </graph>
  <textinput name="ti" />
  <copy prop="value" target="ti" assignNames="t" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/p'].stateValues.vertices)[0]).eqls([1, 3]);
      expect((stateVariables['/p'].stateValues.vertices)[1]).eqls([5, 7]);
      expect((stateVariables['/p'].stateValues.vertices)[2]).eqls([-2, 6]);
      expect(stateVariables['/p'].stateValues.fixed).eq(true);

    })

    cy.log('cannot move vertices')
    cy.window().then(async (win) => {

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/p",
        args: {
          pointCoords: [[4, 7], [8, 10], [1, 9]]
        }
      })

      // to make sure waited for core to react,
      // wait for text to change from change in textinput
      cy.get('#\\/ti_input').type("wait{enter}");
      cy.get('#\\/t').should('have.text', 'wait')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/p'].stateValues.vertices)[0]).eqls([1, 3]);
        expect((stateVariables['/p'].stateValues.vertices)[1]).eqls([5, 7]);
        expect((stateVariables['/p'].stateValues.vertices)[2]).eqls([-2, 6]);
      })
    })

  })

});