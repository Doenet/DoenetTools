describe('Curve Tag Bezier Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  async function checkBezierCurve({ curve, throughPoints, directions, controlVectors }) {
    if (throughPoints) {
      for (let [ind, pt] of throughPoints.entries()) {
        expect((await curve.stateValues.throughPoints)[ind].map(x => x.tree)).eqls(pt);
      }
    }

    if (directions) {
      for (let [ind, dir] of directions.entries()) {
        expect((await curve.stateValues.vectorControlDirections)[ind]).eq(dir);
      }
    }

    if (controlVectors) {
      for (let [ind, vecs] of controlVectors.entries()) {
        if (vecs) {
          let pt = throughPoints[ind];
          if (vecs[0]) {
            expect((await curve.stateValues.controlVectors)[ind][0].map(x => x.tree)).eqls(vecs[0]);
            if (pt) {
              expect((await curve.stateValues.controlPoints)[ind][0].map(x => x.tree)).eqls(
                [pt[0] + vecs[0][0], pt[1] + vecs[0][1]]);
            }
          }
          if (vecs[1]) {
            expect((await curve.stateValues.controlVectors)[ind][1].map(x => x.tree)).eqls(vecs[1]);
            if (pt) {
              expect((await curve.stateValues.controlPoints)[ind][1].map(x => x.tree)).eqls(
                [pt[0] + vecs[1][0], pt[1] + vecs[1][1]]);
            }
          }
        }
      }
    }

  }

  it('no controls specified', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
  
    <graph>
      <curve through="(1,2)(3,4)(-5,6)(2,1)" />
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]]
    let directions = ["none", "none", "none", "none"];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })
    });

    cy.log('cannot change control vector')
    cy.get(`#\\/dir1`).select(`2`);
    cy.get(`#\\/dir1`).should('have.value', '1');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: [2, 1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

      expect((await components['/_curve1'].stateValues.controlVectors)[0][1][0].tree).not.eq(2);
      expect((await components['/_curve1'].stateValues.controlVectors)[0][1][1].tree).not.eq(1);
      expect((await components['/g2/curve'].stateValues.controlVectors)[0][1][0].tree).not.eq(2);
      expect((await components['/g2/curve'].stateValues.controlVectors)[0][1][1].tree).not.eq(1);
      expect((await components['/g3/curve'].stateValues.controlVectors)[0][1][0].tree).not.eq(2);
      expect((await components['/g3/curve'].stateValues.controlVectors)[0][1][1].tree).not.eq(1);
    });

    cy.log('move through point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: [-3, -4]
      })

      throughPoints[0] = [-3, -4]

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('cannot move next control vector')
    cy.get(`#\\/dir2`).select(`2`);
    cy.get(`#\\/dir2`).should('have.value', '1');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: [4, -2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

      let v00 = (await components['/_curve1'].stateValues.controlVectors)[1][0][0].tree;
      let v01 = (await components['/_curve1'].stateValues.controlVectors)[1][0][1].tree;
      expect(v00).not.eq(4);
      expect(v01).not.eq(-2);
      expect((await components['/_curve1'].stateValues.controlVectors)[1][1][0].tree).eq(-v00);
      expect((await components['/_curve1'].stateValues.controlVectors)[1][1][1].tree).eq(-v01);

    });
  })

  it('empty control', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph>
      <curve through="(1,2) (3,4) (-5,6) (2,1)">
        <beziercontrols/>
      </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];

    let directions = ["none", "none", "none", "none"];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })
    });

    cy.log('activate and move control vector on curve1')
    cy.get(`#\\/dir1`).select(`2`);
    cy.get(`#\\/dir1`).should('have.value', '2');
    cy.get(`#\\/dir1a`).should('have.value', '2');
    cy.get(`#\\/dir1b`).should('have.value', '2');

    let controlVectors = [[[-2, -1], [2, 1]]]

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })


      directions[0] = "symmetric";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [-3, -4]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('symmetric control vector on curve 3')
    cy.get(`#\\/dir2a`).select(`2`);
    cy.get(`#\\/dir2`).should('have.value', '2');
    cy.get(`#\\/dir2a`).should('have.value', '2');
    cy.get(`#\\/dir2b`).should('have.value', '2');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[4, -2], [-4, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      directions[1] = "symmetric";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('asymmetric control vector on curve 1')
    cy.get(`#\\/dir3`).select(`3`);
    cy.get(`#\\/dir3`).should('have.value', '3');
    cy.get(`#\\/dir3a`).should('have.value', '3');
    cy.get(`#\\/dir3b`).should('have.value', '3');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [[1, 0], [0, -2]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "both";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector on curve 2')
    cy.get(`#\\/dir2a`).select(`4`);
    cy.get(`#\\/dir2`).should('have.value', '4');
    cy.get(`#\\/dir2a`).should('have.value', '4');
    cy.get(`#\\/dir2b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[-4, -5]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      directions[1] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector on curve 3')
    cy.get(`#\\/dir3b`).select(`5`);
    cy.get(`#\\/dir3`).should('have.value', '5');
    cy.get(`#\\/dir3a`).should('have.value', '5');
    cy.get(`#\\/dir3b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [null, [6, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('move through points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


  })

  it('sugared controls', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph>
      <curve through="(1,2) (3,4) (-5,6) (2,1)" >
        <beziercontrols>(3,1) (-1,5) (5,3) (0,0)</beziercontrols>
      </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];
    let directions = ["symmetric", "symmetric", "symmetric", "symmetric"];
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[-1, 5], [1, -5]],
      [[5, 3], [-5, -3]],
      [[0, 0], [-0, -0]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = [[-2, -1], [2, 1]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [-3, -4]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[4, -2], [-4, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('asymmetric control vector on curve 1')
    cy.get(`#\\/dir3`).select(`3`);
    cy.get(`#\\/dir3`).should('have.value', '3');
    cy.get(`#\\/dir3a`).should('have.value', '3');
    cy.get(`#\\/dir3b`).should('have.value', '3');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [[1, 0], [0, -2]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "both";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector on curve 2')
    cy.get(`#\\/dir2a`).select(`4`);
    cy.get(`#\\/dir2`).should('have.value', '4');
    cy.get(`#\\/dir2a`).should('have.value', '4');
    cy.get(`#\\/dir2b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[-4, -5]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      directions[1] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector on curve 3')
    cy.get(`#\\/dir3b`).select(`5`);
    cy.get(`#\\/dir3`).should('have.value', '5');
    cy.get(`#\\/dir3a`).should('have.value', '5');
    cy.get(`#\\/dir3b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [null, [6, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('previous control vector at end of curve 3')
    cy.get(`#\\/dir4b`).select(`4`);
    cy.get(`#\\/dir4`).should('have.value', '4');
    cy.get(`#\\/dir4a`).should('have.value', '4');
    cy.get(`#\\/dir4b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[3][1] = null;

      directions[3] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector at beginning curve 1')
    cy.get(`#\\/dir1`).select(`5`);
    cy.get(`#\\/dir1`).should('have.value', '5');
    cy.get(`#\\/dir1a`).should('have.value', '5');
    cy.get(`#\\/dir1b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


  })

  it.skip('sugared asymmetric controls', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph>
      <curve through="(1,2) (3,4) (-5,6) (2,1)" >
        <beziercontrols>(3,1),((-1,5),(4,2)),((5,3),(7,-1)),(0,0)</beziercontrols>
      </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];
    let directions = ["symmetric", "both", "both", "symmetric"];
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[-1, 5], [4, 2]],
      [[5, 3], [7, -1]],
      [[0, 0], [-0, -0]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = [[-2, -1], [2, 1]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [-3, -4]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vectors on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[4, -2], [3, 5]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors[1][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('symmetric control vector on curve 1')
    cy.get(`#\\/dir3`).select(`2`);
    cy.get(`#\\/dir3`).should('have.value', '2');
    cy.get(`#\\/dir3a`).should('have.value', '2');
    cy.get(`#\\/dir3b`).should('have.value', '2');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [[1, 0], [-1, -0]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "symmetric";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector on curve 2')
    cy.get(`#\\/dir2a`).select(`4`);
    cy.get(`#\\/dir2`).should('have.value', '4');
    cy.get(`#\\/dir2a`).should('have.value', '4');
    cy.get(`#\\/dir2b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[-4, -5]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      directions[1] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector on curve 3')
    cy.get(`#\\/dir3b`).select(`5`);
    cy.get(`#\\/dir3`).should('have.value', '5');
    cy.get(`#\\/dir3a`).should('have.value', '5');
    cy.get(`#\\/dir3b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [null, [6, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector at end of curve 3')
    cy.get(`#\\/dir4b`).select(`4`);
    cy.get(`#\\/dir4`).should('have.value', '4');
    cy.get(`#\\/dir4a`).should('have.value', '4');
    cy.get(`#\\/dir4b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[3][1] = null;

      directions[3] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector at end of curve 1')
    cy.get(`#\\/dir1`).select(`5`);
    cy.get(`#\\/dir1`).should('have.value', '5');
    cy.get(`#\\/dir1a`).should('have.value', '5');
    cy.get(`#\\/dir1b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('move through points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


  })


  it('check use default bug is fixed', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <controlVectors>(-1,5)</controlVectors>
    <copy target="_controlvectors1" assignNames="cv1a" />

    <p><textinput name="dira" bindValueTo="$(_controlvectors1{prop='direction'})" />
    </p>

    <p><textinput name="dirb" bindValueTo="$(cv1a{prop='direction'})" />
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.get('#\\/dira_input').should('have.value', 'symmetric')
    cy.get('#\\/dirb_input').should('have.value', 'symmetric')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_controlvectors1'].stateValues.direction).eq('symmetric')
      expect(components['/_controlvectors1'].state.direction.usedDefault).be.true

      expect(components['/cv1a'].stateValues.direction).eq('symmetric')
      expect(components['/cv1a'].state.direction.usedDefault).be.true
    })


    cy.get('#\\/dira_input').clear().type("both{enter}")

    cy.get('#\\/dira_input').should('have.value', 'both')
    cy.get('#\\/dirb_input').should('have.value', 'both')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_controlvectors1'].stateValues.direction).eq('both')
      expect(components['/_controlvectors1'].state.direction.usedDefault).not.be.true

      expect(components['/cv1a'].stateValues.direction).eq('both')
      expect(components['/cv1a'].state.direction.usedDefault).not.be.true
    })


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <controlVectors>(-1,5)</controlVectors>
    <copy target="_controlvectors1" assignNames="cv1a" />

    <p><textinput name="dira" bindValueTo="$(_controlvectors1{prop='direction'})" />
    </p>

    <p><textinput name="dirb" bindValueTo="$(cv1a{prop='direction'})" />
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b'); //wait for window to load

    cy.get('#\\/dira_input').should('have.value', 'symmetric')
    cy.get('#\\/dirb_input').should('have.value', 'symmetric')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_controlvectors1'].stateValues.direction).eq('symmetric')
      expect(components['/_controlvectors1'].state.direction.usedDefault).be.true

      expect(components['/cv1a'].stateValues.direction).eq('symmetric')
      expect(components['/cv1a'].state.direction.usedDefault).be.true
    })


    cy.get('#\\/dirb_input').clear().type("none{enter}")

    cy.get('#\\/dira_input').should('have.value', 'none')
    cy.get('#\\/dirb_input').should('have.value', 'none')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_controlvectors1'].stateValues.direction).eq('none')
      expect(components['/_controlvectors1'].state.direction.usedDefault).not.be.true

      expect(components['/cv1a'].stateValues.direction).eq('none')
      expect(components['/cv1a'].state.direction.usedDefault).not.be.true
    })


  })

  it('symmetric controls', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph>
      <curve through="(1,2) (3,4) (-5,6) (2,1)">
        <beziercontrols>
          <controlVectors><vector>(3,1)</vector></controlVectors>
          <controlVectors>(-1,5)</controlVectors>
          <controlVectors><vector>(5,3)</vector></controlVectors>
          <controlVectors>(0,0)</controlVectors>
        </beziercontrols>
      </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];
    let directions = ["symmetric", "symmetric", "symmetric", "symmetric"];
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[-1, 5], [1, -5]],
      [[5, 3], [-5, -3]],
      [[0, 0], [-0, -0]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = [[-2, -1], [2, 1]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [-3, -4]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[4, -2], [-4, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('asymmetric control vector on curve 1')
    cy.get(`#\\/dir3`).select(`3`);
    cy.get(`#\\/dir3`).should('have.value', '3');
    cy.get(`#\\/dir3a`).should('have.value', '3');
    cy.get(`#\\/dir3b`).should('have.value', '3');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [[1, 0], [0, -2]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "both";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector on curve 2')
    cy.get(`#\\/dir2a`).select(`4`);
    cy.get(`#\\/dir2`).should('have.value', '4');
    cy.get(`#\\/dir2a`).should('have.value', '4');
    cy.get(`#\\/dir2b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[-4, -5]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      directions[1] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector on curve 3')
    cy.get(`#\\/dir3b`).select(`5`);
    cy.get(`#\\/dir3`).should('have.value', '5');
    cy.get(`#\\/dir3a`).should('have.value', '5');
    cy.get(`#\\/dir3b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [null, [6, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('previous control vector at end of curve 3')
    cy.get(`#\\/dir4b`).select(`4`);
    cy.get(`#\\/dir4`).should('have.value', '4');
    cy.get(`#\\/dir4a`).should('have.value', '4');
    cy.get(`#\\/dir4b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[3][1] = null;

      directions[3] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector at end of curve 1')
    cy.get(`#\\/dir1`).select(`5`);
    cy.get(`#\\/dir1`).should('have.value', '5');
    cy.get(`#\\/dir1a`).should('have.value', '5');
    cy.get(`#\\/dir1b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


  })

  it('symmetric controls, specified by pointNumber', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph>
      <curve through="(1,2) (3,4) (-5,6) (2,1)" >
        <beziercontrols>
          <controlVectors><vector>(3,1)</vector></controlVectors>
          <controlVectors pointNumber="3"><vector>(5,3)</vector></controlVectors>
          <controlVectors>(0,0)</controlVectors>
          <controlVectors pointNumber="2">(-1,5)</controlVectors>
        </beziercontrols>
      </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];
    let directions = ["symmetric", "symmetric", "symmetric", "symmetric"];
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[-1, 5], [1, -5]],
      [[5, 3], [-5, -3]],
      [[0, 0], [-0, -0]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = [[-2, -1], [2, 1]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [-3, -4]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[4, -2], [-4, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('asymmetric control vector on curve 1')
    cy.get(`#\\/dir3`).select(`3`);
    cy.get(`#\\/dir3`).should('have.value', '3');
    cy.get(`#\\/dir3a`).should('have.value', '3');
    cy.get(`#\\/dir3b`).should('have.value', '3');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [[1, 0], [0, -2]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "both";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector on curve 2')
    cy.get(`#\\/dir2a`).select(`4`);
    cy.get(`#\\/dir2`).should('have.value', '4');
    cy.get(`#\\/dir2a`).should('have.value', '4');
    cy.get(`#\\/dir2b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[-4, -5]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      directions[1] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector on curve 3')
    cy.get(`#\\/dir3b`).select(`5`);
    cy.get(`#\\/dir3`).should('have.value', '5');
    cy.get(`#\\/dir3a`).should('have.value', '5');
    cy.get(`#\\/dir3b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [null, [6, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('previous control vector at end of curve 3')
    cy.get(`#\\/dir4b`).select(`4`);
    cy.get(`#\\/dir4`).should('have.value', '4');
    cy.get(`#\\/dir4a`).should('have.value', '4');
    cy.get(`#\\/dir4b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[3][1] = null;

      directions[3] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector at end of curve 1')
    cy.get(`#\\/dir1`).select(`5`);
    cy.get(`#\\/dir1`).should('have.value', '5');
    cy.get(`#\\/dir1a`).should('have.value', '5');
    cy.get(`#\\/dir1b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

  })

  it('symmetric controls, specified by pointNumber, skipping one', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph>
      <curve through="(1,2) (3,4) (-5,6) (2,1)" >
        <beziercontrols>
          <controlVectors><vector>(3,1)</vector></controlVectors>
          <controlVectors pointNumber="3"><vector>(5,3)</vector></controlVectors>
          <controlVectors>(0,0)</controlVectors>
        </beziercontrols>
      </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];
    let directions = ["symmetric", "none", "symmetric", "symmetric"];
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[], []],
      [[5, 3], [-5, -3]],
      [[0, 0], [-0, -0]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let cv2 = (await components["/_curve1"].stateValues.controlVectors)[1][0];

      controlVectors[1][0][0] = cv2[0].tree;
      controlVectors[1][0][1] = cv2[1].tree;
      controlVectors[1][1][0] = -controlVectors[1][0][0];
      controlVectors[1][1][1] = -controlVectors[1][0][1];

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = [[-2, -1], [2, 1]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[3] = [-3, -4]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[3] = [[4, -2], [-4, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [3, 0],
        controlVector: controlVectors[3][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('asymmetric control vector on curve 1')
    cy.get(`#\\/dir3`).select(`3`);
    cy.get(`#\\/dir3`).should('have.value', '3');
    cy.get(`#\\/dir3a`).should('have.value', '3');
    cy.get(`#\\/dir3b`).should('have.value', '3');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [[1, 0], [0, -2]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "both";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector on curve 2')
    cy.get(`#\\/dir2a`).select(`4`);
    cy.get(`#\\/dir2`).should('have.value', '4');
    cy.get(`#\\/dir2a`).should('have.value', '4');
    cy.get(`#\\/dir2b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[-4, -5]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      directions[1] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector on curve 3')
    cy.get(`#\\/dir3b`).select(`5`);
    cy.get(`#\\/dir3`).should('have.value', '5');
    cy.get(`#\\/dir3a`).should('have.value', '5');
    cy.get(`#\\/dir3b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [null, [6, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('previous control vector at end of curve 3')
    cy.get(`#\\/dir4b`).select(`4`);
    cy.get(`#\\/dir4`).should('have.value', '4');
    cy.get(`#\\/dir4a`).should('have.value', '4');
    cy.get(`#\\/dir4b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[3][1] = null;

      directions[3] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector at end of curve 1')
    cy.get(`#\\/dir1`).select(`5`);
    cy.get(`#\\/dir1`).should('have.value', '5');
    cy.get(`#\\/dir1a`).should('have.value', '5');
    cy.get(`#\\/dir1b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

  })

  it('asymmetric controls', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>

      <curve through="(1,2) (3,4) (-5,6) (2,1)" >
        <beziercontrols>
          <controlVectors><vector>(3,1)</vector></controlVectors>
          <controlVectors direction="both">(-1,5) (4,2)</controlVectors>
          <controlVectors direction="both"><vector>(5,3)</vector><vector>(7,-1)</vector></controlVectors>
          <controlVectors>(0,0)</controlVectors>
        </beziercontrols>
      </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];
    let directions = ["symmetric", "both", "both", "symmetric"];
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[-1, 5], [4, 2]],
      [[5, 3], [7, -1]],
      [[0, 0], [-0, -0]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = [[-2, -1], [2, 1]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [-3, -4]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vectors on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[4, -2], [3, 5]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors[1][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('symmetric control vector on curve 1')
    cy.get(`#\\/dir3`).select(`2`);
    cy.get(`#\\/dir3`).should('have.value', '2');
    cy.get(`#\\/dir3a`).should('have.value', '2');
    cy.get(`#\\/dir3b`).should('have.value', '2');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [[1, 0], [-1, -0]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "symmetric";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector on curve 2')
    cy.get(`#\\/dir2a`).select(`4`);
    cy.get(`#\\/dir2`).should('have.value', '4');
    cy.get(`#\\/dir2a`).should('have.value', '4');
    cy.get(`#\\/dir2b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[-4, -5]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      directions[1] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector on curve 3')
    cy.get(`#\\/dir3b`).select(`5`);
    cy.get(`#\\/dir3`).should('have.value', '5');
    cy.get(`#\\/dir3a`).should('have.value', '5');
    cy.get(`#\\/dir3b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [null, [6, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector at end of curve 3')
    cy.get(`#\\/dir4b`).select(`4`);
    cy.get(`#\\/dir4`).should('have.value', '4');
    cy.get(`#\\/dir4a`).should('have.value', '4');
    cy.get(`#\\/dir4b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[3][1] = null;

      directions[3] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector at end of curve 1')
    cy.get(`#\\/dir1`).select(`5`);
    cy.get(`#\\/dir1`).should('have.value', '5');
    cy.get(`#\\/dir1a`).should('have.value', '5');
    cy.get(`#\\/dir1b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('move through points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


  })

  it('asymmetric controls, specified by pointNumber', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph>
      <curve through="(1,2) (3,4) (-5,6) (2,1)" >
        <beziercontrols>
          <controlVectors pointNumber="4">(0,0)</controlVectors>
          <controlVectors pointNumber="3" direction="both"><vector>(5,3)</vector><vector>(7,-1)</vector></controlVectors>
          <controlVectors pointNumber="1"><vector>(3,1)</vector></controlVectors>
          <controlVectors direction="both">(-1,5)(4,2)</controlVectors>
        </beziercontrols>
      </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];
    let directions = ["symmetric", "both", "both", "symmetric"];
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[-1, 5], [4, 2]],
      [[5, 3], [7, -1]],
      [[0, 0], [-0, -0]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = [[-2, -1], [2, 1]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [-3, -4]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vectors on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[4, -2], [3, 5]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors[1][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('symmetric control vector on curve 1')
    cy.get(`#\\/dir3`).select(`2`);
    cy.get(`#\\/dir3`).should('have.value', '2');
    cy.get(`#\\/dir3a`).should('have.value', '2');
    cy.get(`#\\/dir3b`).should('have.value', '2');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [[1, 0], [-1, -0]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "symmetric";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector on curve 2')
    cy.get(`#\\/dir2a`).select(`4`);
    cy.get(`#\\/dir2`).should('have.value', '4');
    cy.get(`#\\/dir2a`).should('have.value', '4');
    cy.get(`#\\/dir2b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[-4, -5]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      directions[1] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector on curve 3')
    cy.get(`#\\/dir3b`).select(`5`);
    cy.get(`#\\/dir3`).should('have.value', '5');
    cy.get(`#\\/dir3a`).should('have.value', '5');
    cy.get(`#\\/dir3b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [null, [6, 2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      directions[2] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('previous control vector at end of curve 3')
    cy.get(`#\\/dir4b`).select(`4`);
    cy.get(`#\\/dir4`).should('have.value', '4');
    cy.get(`#\\/dir4a`).should('have.value', '4');
    cy.get(`#\\/dir4b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[3][1] = null;

      directions[3] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('next control vector at end of curve 1')
    cy.get(`#\\/dir1`).select(`5`);
    cy.get(`#\\/dir1`).should('have.value', '5');
    cy.get(`#\\/dir1a`).should('have.value', '5');
    cy.get(`#\\/dir1b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('move through points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


  })

  it('asymmetric controls, previous and next', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph>
      <curve through="(1,2) (3,4) (-5,6) (2,1)" >
        <beziercontrols>
          <controlVectors><vector>(3,1)</vector></controlVectors>
          <controlVectors direction="previous">(-1,5)</controlVectors>
          <controlVectors direction="next"><vector>(5,3)</vector></controlVectors>
          <controlVectors>(0,0)</controlVectors>
        </beziercontrols>
      </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
      <copy target="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
      <copy target="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];
    let directions = ["symmetric", "previous", "next", "symmetric"];
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[-1, 5], null],
      [null, [5, 3]],
      [[0, 0], [-0, -0]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = [[-2, -1], [2, 1]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [-3, -4]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move previous control vector on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[4, -2]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move next control vector on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [null, [8, 7]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('switch previous to next on curve 1')
    cy.get(`#\\/dir2`).select(`5`);
    cy.get(`#\\/dir2`).should('have.value', '5');
    cy.get(`#\\/dir2a`).should('have.value', '5');
    cy.get(`#\\/dir2b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1][1] = controlVectors[1][0];
      controlVectors[1][0] = null;

      directions[1] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move new next control vector on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [null, [-1, 6]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors[1][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('switch next to previous on curve 3')
    cy.get(`#\\/dir3b`).select(`4`);
    cy.get(`#\\/dir3`).should('have.value', '4');
    cy.get(`#\\/dir3a`).should('have.value', '4');
    cy.get(`#\\/dir3b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2][0] = controlVectors[2][1];
      controlVectors[2][1] = null;

      directions[2] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move new previous control vector on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[2] = [[-3, -2], null]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('switch next to symmetric on curve 2')
    cy.get(`#\\/dir2a`).select(`2`);
    cy.get(`#\\/dir2`).should('have.value', '2');
    cy.get(`#\\/dir2a`).should('have.value', '2');
    cy.get(`#\\/dir2b`).should('have.value', '2');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1][0] = controlVectors[1][1];
      controlVectors[1][1] = [-controlVectors[1][0][0], -controlVectors[1][0][1]];

      directions[1] = "symmetric";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move new next symmetric vector on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[4, 9], [-4, -9]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move other end of new next symmetric vector on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[1] = [[6, -2], [-6, 2]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors[1][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('previous control vector at end of curve 3')
    cy.get(`#\\/dir4b`).select(`4`);
    cy.get(`#\\/dir4`).should('have.value', '4');
    cy.get(`#\\/dir4a`).should('have.value', '4');
    cy.get(`#\\/dir4b`).should('have.value', '4');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[3][1] = null;

      directions[3] = "previous";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move new previous control vector on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[3] = [[1, -1], null]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [3, 0],
        controlVector: controlVectors[3][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('next control vector at end of curve 1')
    cy.get(`#\\/dir1`).select(`5`);
    cy.get(`#\\/dir1`).should('have.value', '5');
    cy.get(`#\\/dir1a`).should('have.value', '5');
    cy.get(`#\\/dir1b`).should('have.value', '5');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move new next next vector on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors[0] = [null, [8, -3]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


  })

  it('constrain through points to grid', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point x="1" y="2">
      <constraints>
        <constrainToGrid />
      </constraints>
    </point>
    <point x="3" y="4">
      <constraints>
        <constrainToGrid />
      </constraints>
    </point>
    <point x="-5" y="6">
      <constraints>
        <constrainToGrid />
      </constraints>
    </point>
    <point x="2" y="1">
      <constraints>
        <constrainToGrid />
      </constraints>
    </point>
      
    <curve through="$_point1 $_point2 $_point3 $_point4">
      <beziercontrols>
        (7,8) (3,1) 
        <controlVectors direction="both">(4,1) (0,0)</controlVectors>
        (-1,-2)
      </beziercontrols>
    </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy target="../_curve1" assignNames="curve" />
    </graph>

    <copy target="g2" assignNames="g3" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];
    let directions = ["symmetric", "symmetric", "both", "symmetric"];
    let controlVectors = [
      [[7, 8], [-7, -8]],
      [[3, 1], [-3, -1]],
      [[4, 1], [0, 0]],
      [[-1, -2], [1, 2]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


    cy.log('move through point on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: [1.1, 8.7]
      })
      throughPoints[1] = [1, 9];

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = [[-2, -1], [2, 1]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move original point determining through point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point3'].movePoint({ x: -3.2, y: 4.9 })

      throughPoints[2] = [-3, 5];

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    })

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: [-7.4, 1.6]
      })
      throughPoints[0] = [-7, 2];

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: [-4.6, -9.3]
      })
      throughPoints[3] = [-5, -9];

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });
  })


  it.skip('constrain control points to angles', () => {

    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.throughPoints[0].map(x => x.tree)).eqls([1, 2]);
      expect(components['/_curve1'].stateValues.throughPoints[1].map(x => x.tree)).eqls([3, 4]);
      expect(components['/_curve1'].stateValues.throughPoints[2].map(x => x.tree)).eqls([-5, 6]);
      expect(components['/_curve1'].stateValues.throughPoints[3].map(x => x.tree)).eqls([2, -3]);
      expect((await components['/_curve1'].stateValues.controlVectors)[0].tree[1]).greaterThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[0].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[1].tree[1]).lessThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[1].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].tree[1]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].tree[2]).lessThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].tree[1]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].tree[2]).lessThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].tree[1]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].tree[2]).greaterThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[5].tree[1]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[5].tree[2]).greaterThan(0);
    });

    cy.log('move control vectors')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_curve1'].moveControlVector({
        controlVectorInd: 3,
        controlVector: [7, -6]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInd: 2,
        controlVector: [-6, -5]
      })
      expect(components['/_curve1'].stateValues.throughPoints[0].map(x => x.tree)).eqls([1, 2]);
      expect(components['/_curve1'].stateValues.throughPoints[1].map(x => x.tree)).eqls([3, 4]);
      expect(components['/_curve1'].stateValues.throughPoints[2].map(x => x.tree)).eqls([-5, 6]);
      expect(components['/_curve1'].stateValues.throughPoints[3].map(x => x.tree)).eqls([2, -3]);
      expect((await components['/_curve1'].stateValues.controlVectors)[0].tree[1]).greaterThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[0].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[1].tree[1]).lessThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[1].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].tree[1]).lessThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].tree[1]).greaterThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].tree[1]).lessThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[5].tree[1]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[5].tree[2]).greaterThan(0);
    });

  })

  it.skip('attract control points to angles', () => {

    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.throughPoints[0].map(x => x.tree)).eqls([1, 2]);
      expect(components['/_curve1'].stateValues.throughPoints[1].map(x => x.tree)).eqls([3, 4]);
      expect(components['/_curve1'].stateValues.throughPoints[2].map(x => x.tree)).eqls([-5, 6]);
      expect(components['/_curve1'].stateValues.throughPoints[3].map(x => x.tree)).eqls([2, -3]);
      expect((await components['/_curve1'].stateValues.controlVectors)[0].map(x => x.tree)).eqls([3, 1]);
      expect((await components['/_curve1'].stateValues.controlVectors)[1].map(x => x.tree)).eqls([-4, 1]);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].map(x => x.tree)).eqls([1, -2]);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].map(x => x.tree)).eqls([5, -6]);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].map(x => x.tree)).eqls([-5, 6]);
      expect((await components['/_curve1'].stateValues.controlVectors)[5].map(x => x.tree)).eqls([-2, 3]);

    });

    cy.log('move control vector close to angles')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_curve1'].moveControlVector({
        controlVectorInd: 3,
        controlVector: [7, 0.2]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInd: 2,
        controlVector: [0.1, -6]
      })
      expect(components['/_curve1'].stateValues.throughPoints[0].map(x => x.tree)).eqls([1, 2]);
      expect(components['/_curve1'].stateValues.throughPoints[1].map(x => x.tree)).eqls([3, 4]);
      expect(components['/_curve1'].stateValues.throughPoints[2].map(x => x.tree)).eqls([-5, 6]);
      expect(components['/_curve1'].stateValues.throughPoints[3].map(x => x.tree)).eqls([2, -3]);
      expect((await components['/_curve1'].stateValues.controlVectors)[0].map(x => x.tree)).eqls([3, 1]);
      expect((await components['/_curve1'].stateValues.controlVectors)[1].map(x => x.tree)).eqls([-4, 1]);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].tree[1]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].tree[2]).lessThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].tree[1]).greaterThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].tree[1]).lessThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[5].map(x => x.tree)).eqls([-2, 3]);
    });

  })

  it.skip('attract symmetric control points to asymmetric angles', () => {

    cy.window().then(async (win) => {
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


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_curve1'].stateValues.throughPoints[0].map(x => x.tree)).eqls([1, 2]);
      expect(components['/_curve1'].stateValues.throughPoints[1].map(x => x.tree)).eqls([3, 4]);
      expect(components['/_curve1'].stateValues.throughPoints[2].map(x => x.tree)).eqls([-5, 6]);
      expect(components['/_curve1'].stateValues.throughPoints[3].map(x => x.tree)).eqls([2, -3]);
      expect((await components['/_curve1'].stateValues.controlVectors)[0].map(x => x.tree)).eqls([3, 1]);
      expect((await components['/_curve1'].stateValues.controlVectors)[1].map(x => x.tree)).eqls([-4, 1]);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].map(x => x.tree)).eqls([4, -1]);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].map(x => x.tree)).eqls([5, -6]);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].map(x => x.tree)).eqls([-5, 6]);
      expect((await components['/_curve1'].stateValues.controlVectors)[5].map(x => x.tree)).eqls([-2, 3]);

    });

    cy.log('move control vectors close to angles')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_curve1'].moveControlVector({
        controlVectorInd: 3,
        controlVector: [7, 0.125]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInd: 2,
        controlVector: [0.125, -6]
      })
      expect(components['/_curve1'].stateValues.throughPoints[0].map(x => x.tree)).eqls([1, 2]);
      expect(components['/_curve1'].stateValues.throughPoints[1].map(x => x.tree)).eqls([3, 4]);
      expect(components['/_curve1'].stateValues.throughPoints[2].map(x => x.tree)).eqls([-5, 6]);
      expect(components['/_curve1'].stateValues.throughPoints[3].map(x => x.tree)).eqls([2, -3]);
      expect((await components['/_curve1'].stateValues.controlVectors)[0].map(x => x.tree)).eqls([3, 1]);
      expect((await components['/_curve1'].stateValues.controlVectors)[1].tree[1]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[1].tree[2]).greaterThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].tree[1]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].tree[2]).lessThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].tree[1]).greaterThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].tree[1]).lessThan(0);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].tree[2]).closeTo(0, 1E-12);
      expect((await components['/_curve1'].stateValues.controlVectors)[5].map(x => x.tree)).eqls([-2, 3]);
    });

    cy.log('move control vectors opposite sides')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_curve1'].moveControlVector({
        controlVectorInd: 3,
        controlVector: [-7, 0.125]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInd: 2,
        controlVector: [0.125, 6]
      })
      expect(components['/_curve1'].stateValues.throughPoints[0].map(x => x.tree)).eqls([1, 2]);
      expect(components['/_curve1'].stateValues.throughPoints[1].map(x => x.tree)).eqls([3, 4]);
      expect(components['/_curve1'].stateValues.throughPoints[2].map(x => x.tree)).eqls([-5, 6]);
      expect(components['/_curve1'].stateValues.throughPoints[3].map(x => x.tree)).eqls([2, -3]);
      expect((await components['/_curve1'].stateValues.controlVectors)[0].map(x => x.tree)).eqls([3, 1]);
      expect((await components['/_curve1'].stateValues.controlVectors)[1].map(x => x.tree)).eqls([-0.125, -6]);
      expect((await components['/_curve1'].stateValues.controlVectors)[2].map(x => x.tree)).eqls([0.125, 6]);
      expect((await components['/_curve1'].stateValues.controlVectors)[3].map(x => x.tree)).eqls([-7, 0.125]);
      expect((await components['/_curve1'].stateValues.controlVectors)[4].map(x => x.tree)).eqls([7, -0.125]);
      expect((await components['/_curve1'].stateValues.controlVectors)[5].map(x => x.tree)).eqls([-2, 3]);
    });

  })

  it('new curve from copied control vectors, some flipped', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <curve through="(-9,6) (-3,7) (4,0) (8,5)">
      <beziercontrols>
        <controlVectors>(3,1)</controlVectors>
        <controlVectors>(5,-6)</controlVectors>
        <controlVectors direction="both">(3,2)(-1,5)</controlVectors>
        <controlVectors>(1,4)</controlVectors>
      </beziercontrols>
    </curve>
    </graph>
    <graph>
    <curve through="$(_curve1{prop='throughPoint1'}) ($(_curve1{prop='throughPointX2_2'}), $(_curve1{prop='throughPointX2_1'})) $(_curve1{prop='throughPoint3'}) ($(_curve1{prop='throughPointX4_2'}), $(_curve1{prop='throughPointX4_1'}))">
      <beziercontrols>
        <controlVectors>
          <copy prop="controlVector1_1" target="_curve1" />
        </controlVectors>
        <controlVectors>
        <vector>
          (<extract prop="y"><copy prop="controlVector2_1" target="_curve1" /></extract>,
          <extract prop="x"><copy prop="controlVector2_1" target="_curve1" /></extract>)
        </vector>
        </controlVectors>
        <controlVectors direction="both">
          <copy prop="controlVector3_1" target="_curve1" />
          <vector>
            (<extract prop="y"><copy prop="controlVector3_2" target="_curve1" /></extract>,
            <extract prop="x"><copy prop="controlVector3_2" target="_curve1" /></extract>)
          </vector>
        </controlVectors>
        <controlVectors>
          <vector>
            (<extract prop="y"><copy prop="controlVector4_1" target="_curve1" /></extract>,
            <extract prop="x"><copy prop="controlVector4_1" target="_curve1" /></extract>)
          </vector>
        </controlVectors>
      </beziercontrols>
    </curve>
    </graph>

    <graph>
      <copy target="_curve1" assignNames="curve1a" />
    </graph>
    <graph>
      <copy target="_curve2" assignNames="curve2a" />
    </graph>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let directions = ["symmetric", "symmetric", "both", "symmetric"];

    let throughPoints1 = [[-9, 6], [-3, 7], [4, 0], [8, 5]];
    let controlVectors1 = [
      [[3, 1], [-3, -1]],
      [[5, -6], [-5, 6]],
      [[3, 2], [-1, 5]],
      [[1, 4], [-1, -4]],
    ];


    let throughPoints2 = [[-9, 6], [7, -3], [4, 0], [5, 8]];
    let controlVectors2 = [
      [[3, 1], [-3, -1]],
      [[-6, 5], [6, -5]],
      [[3, 2], [5, -1]],
      [[4, 1], [-4, -1]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      await checkBezierCurve({
        curve: components['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      await checkBezierCurve({
        curve: components['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      await checkBezierCurve({
        curve: components['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
    });


    cy.log('move through points on all four curves')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      throughPoints1 = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      throughPoints2 = [[7, 2], [-3, 1], [2, 9], [-3, -4]];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints1[0]
      });
      await components['/curve1a'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints1[1]
      });
      await components['/_curve2'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints2[2]
      });
      await components['/curve2a'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints2[3]
      });


      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      await checkBezierCurve({
        curve: components['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      await checkBezierCurve({
        curve: components['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      await checkBezierCurve({
        curve: components['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move control vectors on all four curves')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors1 = [
        [[-1, 5], [1, -5]],
        [[0, 3], [-0, -3]],
        [[-8, -3], [4, 6]],
        [[3, -2], [-3, 2]],
      ];
      controlVectors2 = [
        [[-1, 5], [1, -5]],
        [[3, 0], [-3, -0]],
        [[-8, -3], [6, 4]],
        [[-2, 3], [2, -3]],
      ];

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors1[0][1]
      })

      await components['/curve1a'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors1[1][1]
      })

      await components['/_curve2'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors2[2][0]
      })
      await components['/curve2a'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors2[2][1]
      })

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [3, 0],
        controlVector: controlVectors1[3][0]
      })


      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      await checkBezierCurve({
        curve: components['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      await checkBezierCurve({
        curve: components['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      await checkBezierCurve({
        curve: components['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move through points on all four curves again')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      throughPoints1 = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      throughPoints2 = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];

      await components['/curve2a'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints2[0]
      });
      await components['/_curve2'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints2[1]
      });
      await components['/curve1a'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints1[2]
      });
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints1[3]
      });


      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      await checkBezierCurve({
        curve: components['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      await checkBezierCurve({
        curve: components['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      await checkBezierCurve({
        curve: components['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move control vectors on all four curves again')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors1 = [
        [[4, -1], [-4, 1]],
        [[2, -6], [-2, 6]],
        [[-5, 1], [0, -3]],
        [[4, -5], [-4, 5]],
      ];
      controlVectors2 = [
        [[4, -1], [-4, 1]],
        [[-6, 2], [6, -2]],
        [[-5, 1], [-3, 0]],
        [[-5, 4], [5, -4]],
      ];

      await components['/curve2a'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors2[0][1]
      })

      await components['/_curve2'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors2[1][1]
      })

      await components['/curve1a'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors1[2][0]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors1[2][1]
      })

      await components['/curve2a'].moveControlVector({
        controlVectorInds: [3, 0],
        controlVector: controlVectors2[3][0]
      })


      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      await checkBezierCurve({
        curve: components['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      await checkBezierCurve({
        curve: components['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      await checkBezierCurve({
        curve: components['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })



  })

  it('new curve from copied control points, some flipped', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    
    <graph>
    <curve through="(-9,6) (-3,7) (4,0) (8,5)">
    <beziercontrols>
      <controlVectors>(3,1)</controlVectors>
      <controlVectors>(5,-6)</controlVectors>
      <controlVectors direction="both">(3,2) (-1,5)</controlVectors>
      <controlVectors>(1,4)</controlVectors>
    </beziercontrols>
    </curve>
    </graph>

    <graph>
    <curve through="$(_curve1{prop='throughPoint1'}) ($(_curve1{prop='throughPointX2_2'}), $(_curve1{prop='throughPointX2_1'})) $(_curve1{prop='throughPoint3'}) ($(_curve1{prop='throughPointX4_2'}), $(_curve1{prop='throughPointX4_1'}))">
      <beziercontrols>
        <controlVectors>
          <vector>
            (<copy prop="controlPointX1_1_1" target="_curve1" />
             -<copy fixed prop="throughPointX1_1" target="_curve1" />,
             <copy prop="controlPointX1_1_2" target="_curve1" />
             -<copy fixed prop="throughPointX1_2" target="_curve1" />)
          </vector>
        </controlVectors>
        <controlVectors>
          <vector>
            (<copy prop="controlPointX2_1_2" target="_curve1" />
             -<copy fixed prop="throughPointX2_2" target="_curve1" />,
            <copy prop="controlPointX2_1_1" target="_curve1" />
             -<copy fixed prop="throughPointX2_1" target="_curve1" />)
          </vector>
        </controlVectors>
        <controlVectors direction="both">
          <vector>
            (<copy prop="controlPointX3_1_1" target="_curve1" />
             -<copy fixed prop="throughPointX3_1" target="_curve1" />,
            <copy prop="controlPointX3_1_2" target="_curve1" />
             -<copy fixed prop="throughPointX3_2" target="_curve1" />)
          </vector>
          <vector>
            (<copy prop="controlPointX3_2_2" target="_curve1" />
             -<copy fixed prop="throughPointX3_2" target="_curve1" />,
            <copy prop="controlPointX3_2_1" target="_curve1" />
             -<copy fixed prop="throughPointX3_1" target="_curve1" />)
          </vector>
        </controlVectors>
        <controlVectors>
          <vector>
            (<copy prop="controlPointX4_1_2" target="_curve1" />
             -<copy fixed prop="throughPointX4_2" target="_curve1" />,
            <copy prop="controlPointX4_1_1" target="_curve1" />
             -<copy fixed prop="throughPointX4_1" target="_curve1" />)
          </vector>
        </controlVectors>
      </beziercontrols>
    </curve>
    </graph>

    <graph>
      <copy target="_curve1" assignNames="curve1a" />
    </graph>
    <graph>
      <copy target="_curve2" assignNames="curve2a" />
    </graph>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let directions = ["symmetric", "symmetric", "both", "symmetric"];

    let throughPoints1 = [[-9, 6], [-3, 7], [4, 0], [8, 5]];
    let controlVectors1 = [
      [[3, 1], [-3, -1]],
      [[5, -6], [-5, 6]],
      [[3, 2], [-1, 5]],
      [[1, 4], [-1, -4]],
    ];


    let throughPoints2 = [[-9, 6], [7, -3], [4, 0], [5, 8]];
    let controlVectors2 = [
      [[3, 1], [-3, -1]],
      [[-6, 5], [6, -5]],
      [[3, 2], [5, -1]],
      [[4, 1], [-4, -1]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      await checkBezierCurve({
        curve: components['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      await checkBezierCurve({
        curve: components['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      await checkBezierCurve({
        curve: components['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
    });


    cy.log('move through points on all four curves')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      throughPoints1 = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      throughPoints2 = [[7, 2], [-3, 1], [2, 9], [-3, -4]];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints1[0]
      });
      await components['/curve1a'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints1[1]
      });
      await components['/_curve2'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints2[2]
      });
      await components['/curve2a'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints2[3]
      });


      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      await checkBezierCurve({
        curve: components['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      await checkBezierCurve({
        curve: components['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      await checkBezierCurve({
        curve: components['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move control vectors on all four curves')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors1 = [
        [[-1, 5], [1, -5]],
        [[0, 3], [-0, -3]],
        [[-8, -3], [4, 6]],
        [[3, -2], [-3, 2]],
      ];
      controlVectors2 = [
        [[-1, 5], [1, -5]],
        [[3, 0], [-3, -0]],
        [[-8, -3], [6, 4]],
        [[-2, 3], [2, -3]],
      ];

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors1[0][1]
      })

      await components['/curve1a'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors1[1][1]
      })

      await components['/_curve2'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors2[2][0]
      })
      await components['/curve2a'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors2[2][1]
      })

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [3, 0],
        controlVector: controlVectors1[3][0]
      })


      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      await checkBezierCurve({
        curve: components['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      await checkBezierCurve({
        curve: components['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      await checkBezierCurve({
        curve: components['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move through points on all four curves again')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      throughPoints1 = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      throughPoints2 = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];

      await components['/curve2a'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints2[0]
      });
      await components['/_curve2'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints2[1]
      });
      await components['/curve1a'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints1[2]
      });
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints1[3]
      });


      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      await checkBezierCurve({
        curve: components['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      await checkBezierCurve({
        curve: components['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      await checkBezierCurve({
        curve: components['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move control vectors on all four curves again')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors1 = [
        [[4, -1], [-4, 1]],
        [[2, -6], [-2, 6]],
        [[-5, 1], [0, -3]],
        [[4, -5], [-4, 5]],
      ];
      controlVectors2 = [
        [[4, -1], [-4, 1]],
        [[-6, 2], [6, -2]],
        [[-5, 1], [-3, 0]],
        [[-5, 4], [5, -4]],
      ];

      await components['/curve2a'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors2[0][1]
      })

      await components['/_curve2'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors2[1][1]
      })

      await components['/curve1a'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors1[2][0]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors1[2][1]
      })

      await components['/curve2a'].moveControlVector({
        controlVectorInds: [3, 0],
        controlVector: controlVectors2[3][0]
      })


      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      await checkBezierCurve({
        curve: components['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      await checkBezierCurve({
        curve: components['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      await checkBezierCurve({
        curve: components['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


  })

  it('fourth point depends on internal copy of first point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve through="(1,2) (3,4) (-5,6) $(_curve1{prop='throughPoint1' componentType='point'})">
  <bezierControls />
  </curve>
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../_curve1" assignNames="curve" />
  </graph>

  <copy target="g2" assignNames="g3" />

  <p>Temp way to change controls 1:
  <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
    <group name="choices">
      <choice>none</choice>
      <choice>symmetric</choice>
      <choice>both</choice>
      <choice>previous</choice>
      <choice>next</choice>
    </group>
  </choiceInput>
  <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
    <copy target="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 2:
  <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
    <copy target="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 3:
  <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
    <copy target="choices" />
  </choiceInput>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [1, 2]];
    let directions = ["none", "none", "none", "none"];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })
    });


    cy.log('move first three points on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[-4, -1], [8, 9], [-3, 7], [-4, -1]];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[5, 6], [-1, -2], [6, -5], [5, 6]];

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[4, -4], [-7, 7], [3, 3], [4, -4]];

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [7, 0];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [-6, 9];

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [8, 2];

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });


    cy.log('move control vectors')
    cy.get(`#\\/dir1`).select(`2`);
    cy.get(`#\\/dir2a`).select(`2`);
    cy.get(`#\\/dir3b`).select(`2`);
    cy.get(`#\\/dir4`).select(`2`);
    cy.get(`#\\/dir1`).should('have.value', '2');
    cy.get(`#\\/dir1a`).should('have.value', '2');
    cy.get(`#\\/dir1b`).should('have.value', '2');
    cy.get(`#\\/dir2`).should('have.value', '2');
    cy.get(`#\\/dir2a`).should('have.value', '2');
    cy.get(`#\\/dir2b`).should('have.value', '2');
    cy.get(`#\\/dir3`).should('have.value', '2');
    cy.get(`#\\/dir3a`).should('have.value', '2');
    cy.get(`#\\/dir3b`).should('have.value', '2');
    cy.get(`#\\/dir4`).should('have.value', '2');
    cy.get(`#\\/dir4a`).should('have.value', '2');
    cy.get(`#\\/dir4b`).should('have.value', '2');
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[-1, 5], [1, -5]],
      [[5, 3], [-5, -3]],
      [[-9, -4], [9, 4]],
    ];
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 0],
        controlVector: controlVectors[0][0]
      })
      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })
      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [3, 0],
        controlVector: controlVectors[3][0]
      })

      directions = ["symmetric", "symmetric", "symmetric", "symmetric"];

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    })

    cy.log('move control vectors again')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors = [
        [[5, -6], [-5, 6]],
        [[-3, 2], [3, -2]],
        [[-8, -9], [8, 9]],
        [[7, 1], [-7, -1]],
      ];

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })
      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors[1][1]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })
      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [3, 1],
        controlVector: controlVectors[3][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    })

  })

  it('first point depends on internal copy of fourth point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve through="$(_curve1{prop='throughPoint4' componentType='point'}) (3,4) (-5,6) (1,2)">
  <bezierControls />
  </curve>
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../_curve1" assignNames="curve" />
  </graph>

  <copy target="g2" assignNames="g3" />

  <p>Temp way to change controls 1:
  <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
    <group name="choices">
      <choice>none</choice>
      <choice>symmetric</choice>
      <choice>both</choice>
      <choice>previous</choice>
      <choice>next</choice>
    </group>
  </choiceInput>
  <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
    <copy target="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 2:
  <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
    <copy target="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 3:
  <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
    <copy target="choices" />
  </choiceInput>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [1, 2]];
    let directions = ["none", "none", "none", "none"];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })
    });


    cy.log('move first three points on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[-4, -1], [8, 9], [-3, 7], [-4, -1]];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[5, 6], [-1, -2], [6, -5], [5, 6]];

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[4, -4], [-7, 7], [3, 3], [4, -4]];

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [7, 0];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [-6, 9];

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [8, 2];

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });


    cy.log('move control vectors')
    cy.get(`#\\/dir1`).select(`2`);
    cy.get(`#\\/dir2a`).select(`2`);
    cy.get(`#\\/dir3b`).select(`2`);
    cy.get(`#\\/dir4`).select(`2`);
    cy.get(`#\\/dir1`).should('have.value', '2');
    cy.get(`#\\/dir1a`).should('have.value', '2');
    cy.get(`#\\/dir1b`).should('have.value', '2');
    cy.get(`#\\/dir2`).should('have.value', '2');
    cy.get(`#\\/dir2a`).should('have.value', '2');
    cy.get(`#\\/dir2b`).should('have.value', '2');
    cy.get(`#\\/dir3`).should('have.value', '2');
    cy.get(`#\\/dir3a`).should('have.value', '2');
    cy.get(`#\\/dir3b`).should('have.value', '2');
    cy.get(`#\\/dir4`).should('have.value', '2');
    cy.get(`#\\/dir4a`).should('have.value', '2');
    cy.get(`#\\/dir4b`).should('have.value', '2');
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[-1, 5], [1, -5]],
      [[5, 3], [-5, -3]],
      [[-9, -4], [9, 4]],
    ];
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 0],
        controlVector: controlVectors[0][0]
      })
      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })
      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [3, 0],
        controlVector: controlVectors[3][0]
      })

      directions = ["symmetric", "symmetric", "symmetric", "symmetric"];

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    })

    cy.log('move control vectors again')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors = [
        [[5, -6], [-5, 6]],
        [[-3, 2], [3, -2]],
        [[-8, -9], [8, 9]],
        [[7, 1], [-7, -1]],
      ];

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })
      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors[1][1]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })
      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [3, 1],
        controlVector: controlVectors[3][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    })

  })

  it('first point depends fourth, formula for fifth', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve through="$(_curve1{prop='throughPoint4' componentType='point'}) (3,4) (-5,6) (1,2) ($(_curve1{prop='throughPointX1_1'})+1, 2)">
  <bezierControls />
  </curve>
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../_curve1" assignNames="curve" />
  </graph>

  <copy target="g2" assignNames="g3" />

  <p>Temp way to change controls 1:
  <choiceInput inline name="dir1" bindValueTo="$(_curve1{prop='vectorcontroldirection1'})" >
    <group name="choices">
      <choice>none</choice>
      <choice>symmetric</choice>
      <choice>both</choice>
      <choice>previous</choice>
      <choice>next</choice>
    </group>
  </choiceInput>
  <choiceInput inline name="dir2" bindValueTo="$(_curve1{prop='vectorcontroldirection2'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir4" bindValueTo="$(_curve1{prop='vectorcontroldirection4'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir5" bindValueTo="$(_curve1{prop='vectorcontroldirection5'})" >
    <copy target="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 2:
  <choiceInput inline name="dir1a" bindValueTo="$(g2/curve{prop='vectorcontroldirection1'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir2a" bindValueTo="$(g2/curve{prop='vectorcontroldirection2'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir4a" bindValueTo="$(g2/curve{prop='vectorcontroldirection4'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir5a" bindValueTo="$(g2/curve{prop='vectorcontroldirection5'})" >
    <copy target="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 3:
  <choiceInput inline name="dir1b" bindValueTo="$(g3/curve{prop='vectorcontroldirection1'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir2b" bindValueTo="$(g3/curve{prop='vectorcontroldirection2'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir4b" bindValueTo="$(g3/curve{prop='vectorcontroldirection4'})" >
    <copy target="choices" />
  </choiceInput>
  <choiceInput inline name="dir5b" bindValueTo="$(g3/curve{prop='vectorcontroldirection5'})" >
    <copy target="choices" />
  </choiceInput>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [1, 2], [2, 2]];
    let directions = ["none", "none", "none", "none", "none"];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })
    });


    cy.log('move first three points on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[-4, -1], [8, 9], [-3, 7], [-4, -1], [-3, 2]];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[5, 6], [-1, -2], [6, -5], [5, 6], [6, 2]];

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[4, -4], [-7, 7], [3, 3], [4, -4], [5, 2]];

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [7, 0];
      throughPoints[4] = [8, 2];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [-6, 9];
      throughPoints[4] = [-5, 2];

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [8, 2];
      throughPoints[4] = [9, 2];

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fifth point on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [-8, 2];
      throughPoints[4] = [-7, 9];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 4,
        throughPoint: throughPoints[4]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fifth point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [-1, 2];
      throughPoints[4] = [0, 9];

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 4,
        throughPoint: throughPoints[4]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fifth point on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = [4, 2];
      throughPoints[4] = [5, 4];

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 4,
        throughPoint: throughPoints[4]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions
      })

    });


    cy.log('move control vectors')
    cy.get(`#\\/dir1`).select(`2`);
    cy.get(`#\\/dir2a`).select(`2`);
    cy.get(`#\\/dir3b`).select(`2`);
    cy.get(`#\\/dir4`).select(`2`);
    cy.get(`#\\/dir5`).select(`2`);
    cy.get(`#\\/dir1`).should('have.value', '2');
    cy.get(`#\\/dir1a`).should('have.value', '2');
    cy.get(`#\\/dir1b`).should('have.value', '2');
    cy.get(`#\\/dir2`).should('have.value', '2');
    cy.get(`#\\/dir2a`).should('have.value', '2');
    cy.get(`#\\/dir2b`).should('have.value', '2');
    cy.get(`#\\/dir3`).should('have.value', '2');
    cy.get(`#\\/dir3a`).should('have.value', '2');
    cy.get(`#\\/dir3b`).should('have.value', '2');
    cy.get(`#\\/dir4`).should('have.value', '2');
    cy.get(`#\\/dir4a`).should('have.value', '2');
    cy.get(`#\\/dir4b`).should('have.value', '2');
    cy.get(`#\\/dir5`).should('have.value', '2');
    cy.get(`#\\/dir5a`).should('have.value', '2');
    cy.get(`#\\/dir5b`).should('have.value', '2');
    let controlVectors = [
      [[3, 1], [-3, -1]],
      [[-1, 5], [1, -5]],
      [[5, 3], [-5, -3]],
      [[-9, -4], [9, 4]],
      [[6, 9], [-6, -9]],
    ];
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 0],
        controlVector: controlVectors[0][0]
      })
      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })
      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [3, 0],
        controlVector: controlVectors[3][0]
      })
      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [4, 0],
        controlVector: controlVectors[4][0]
      })

      directions = ["symmetric", "symmetric", "symmetric", "symmetric", "symmetric"];

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    })

    cy.log('move control vectors again')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors = [
        [[5, -6], [-5, 6]],
        [[-3, 2], [3, -2]],
        [[-8, -9], [8, 9]],
        [[7, 1], [-7, -1]],
        [[-3, -2], [3, 2]],
      ];

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })
      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors[1][1]
      })
      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })
      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [3, 1],
        controlVector: controlVectors[3][1]
      })
      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [4, 1],
        controlVector: controlVectors[4][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    })

  })

  it('first, fourth, seventh point depends on fourth, seventh, tenth', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve through="$(_curve1{prop='throughPoint4' componentType='point'}) (1,2) (3,4) $(_curve1{prop='throughPoint7' componentType='point'}) (5,7) (-5,7) $(_curve1{prop='throughPoint10' componentType='point'}) (3,1) (5,0) (-5,-1)" />
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../_curve1" assignNames="curve" />
  </graph>

  <copy target="g2" assignNames="g3" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[-5, -1], [1, 2], [3, 4], [-5, -1], [5, 7], [-5, 7],
    [-5, -1], [3, 1], [5, 0], [-5, -1]]

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })
    });


    cy.log('move first three points on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[-4, 6], [8, 9], [-3, 7], [-4, 6], [5, 7], [-5, 7],
      [-4, 6], [3, 1], [5, 0], [-4, 6]]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move first three points on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[5, 6], [-1, -2], [6, -5], [5, 6], [5, 7], [-5, 7],
      [5, 6], [3, 1], [5, 0], [5, 6]]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move first three points on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[4, -4], [-7, 7], [3, 3], [4, -4], [5, 7], [-5, 7],
      [4, -4], [3, 1], [5, 0], [4, -4]]

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });



    cy.log('move second three points on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[9, 1], [-7, 7], [3, 3], [9, 1], [-8, -2], [7, -3],
      [9, 1], [3, 1], [5, 0], [9, 1]]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 4,
        throughPoint: throughPoints[4]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 5,
        throughPoint: throughPoints[5]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move second three points on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[0, 2], [-7, 7], [3, 3], [0, 2], [1, -3], [-2, -4],
      [0, 2], [3, 1], [5, 0], [0, 2]]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 4,
        throughPoint: throughPoints[4]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 5,
        throughPoint: throughPoints[5]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move second three points on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[-5, -6], [-7, 7], [3, 3], [-5, -6], [-7, 8], [9, 0],
      [-5, -6], [3, 1], [5, 0], [-5, -6]]

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 4,
        throughPoint: throughPoints[4]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 5,
        throughPoint: throughPoints[5]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move third three points on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[-9, 8], [-7, 7], [3, 3], [-9, 8], [-7, 8], [9, 0],
      [-9, 8], [7, -6], [-5, -4], [-9, 8]]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 6,
        throughPoint: throughPoints[6]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 7,
        throughPoint: throughPoints[7]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 8,
        throughPoint: throughPoints[8]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move third three points on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[2, 4], [-7, 7], [3, 3], [2, 4], [-7, 8], [9, 0],
      [2, 4], [3, -5], [5, -6], [2, 4]]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 6,
        throughPoint: throughPoints[6]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 7,
        throughPoint: throughPoints[7]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 8,
        throughPoint: throughPoints[8]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move third three points on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[3, -6], [-7, 7], [3, 3], [3, -6], [-7, 8], [9, 0],
      [3, -6], [9, 2], [-7, -1], [3, -6]]

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 6,
        throughPoint: throughPoints[6]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 7,
        throughPoint: throughPoints[7]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 8,
        throughPoint: throughPoints[8]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });



    cy.log('move last point on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = throughPoints[6] = throughPoints[9] = [-6, -8];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 9,
        throughPoint: throughPoints[9]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move last point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = throughPoints[6] = throughPoints[9] = [0, 3];

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 9,
        throughPoint: throughPoints[9]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move last point on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = throughPoints[3] = throughPoints[6] = throughPoints[9] = [2, -5];

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 9,
        throughPoint: throughPoints[9]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });


  })

  it('first, fourth, seventh point depends on shifted fourth, seventh, tenth', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve through="($(_curve1{prop='throughPointX4_1'})+1, $(_curve1{prop='throughPointX4_2'})+1) (1,2) (3,4) ($(_curve1{prop='throughPointX7_1'})+1, $(_curve1{prop='throughPointX7_2'})+1) (5,7) (-5,7) ($(_curve1{prop='throughPointX10_1'})+1, $(_curve1{prop='throughPointX10_2'})+1) (3,1) (5,0) (-5,-1)" />
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../_curve1" assignNames="curve" />
  </graph>

  <copy target="g2" assignNames="g3" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[-2, 2], [1, 2], [3, 4], [-3, 1], [5, 7], [-5, 7],
    [-4, 0], [3, 1], [5, 0], [-5, -1]]

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })
    });


    cy.log('move first three points on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[-4, 6], [8, 9], [-3, 7], [-5, 5], [5, 7], [-5, 7],
      [-6, 4], [3, 1], [5, 0], [-7, 3]]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move first three points on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[5, 6], [-1, -2], [6, -5], [4, 5], [5, 7], [-5, 7],
      [3, 4], [3, 1], [5, 0], [2, 3]]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move first three points on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[4, -4], [-7, 7], [3, 3], [3, -5], [5, 7], [-5, 7],
      [2, -6], [3, 1], [5, 0], [1, -7]]

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });



    cy.log('move second three points on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[10, 2], [-7, 7], [3, 3], [9, 1], [-8, -2], [7, -3],
      [8, 0], [3, 1], [5, 0], [7, -1]]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 4,
        throughPoint: throughPoints[4]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 5,
        throughPoint: throughPoints[5]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move second three points on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[1, 3], [-7, 7], [3, 3], [0, 2], [1, -3], [-2, -4],
      [-1, 1], [3, 1], [5, 0], [-2, 0]]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 4,
        throughPoint: throughPoints[4]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 5,
        throughPoint: throughPoints[5]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move second three points on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[-4, -5], [-7, 7], [3, 3], [-5, -6], [-7, 8], [9, 0],
      [-6, -7], [3, 1], [5, 0], [-7, -8]]

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 4,
        throughPoint: throughPoints[4]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 5,
        throughPoint: throughPoints[5]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move third three points on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[-7, 10], [-7, 7], [3, 3], [-8, 9], [-7, 8], [9, 0],
      [-9, 8], [7, -6], [-5, -4], [-10, 7]]

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 6,
        throughPoint: throughPoints[6]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 7,
        throughPoint: throughPoints[7]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 8,
        throughPoint: throughPoints[8]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move third three points on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[4, 6], [-7, 7], [3, 3], [3, 5], [-7, 8], [9, 0],
      [2, 4], [3, -5], [5, -6], [1, 3]]

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 6,
        throughPoint: throughPoints[6]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 7,
        throughPoint: throughPoints[7]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 8,
        throughPoint: throughPoints[8]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move third three points on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[5, -4], [-7, 7], [3, 3], [4, -5], [-7, 8], [9, 0],
      [3, -6], [9, 2], [-7, -1], [2, -7]]

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 6,
        throughPoint: throughPoints[6]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 7,
        throughPoint: throughPoints[7]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 8,
        throughPoint: throughPoints[8]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });



    cy.log('move last point on curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [-3, -5];
      throughPoints[3] = [-4, -6];
      throughPoints[6] = [-5, -7];
      throughPoints[9] = [-6, -8];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 9,
        throughPoint: throughPoints[9]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move last point on curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [3, 6];
      throughPoints[3] = [2, 5];
      throughPoints[6] = [1, 4];
      throughPoints[9] = [0, 3];

      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 9,
        throughPoint: throughPoints[9]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move last point on curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints[0] = [5, -2];
      throughPoints[3] = [4, -3];
      throughPoints[6] = [3, -4];
      throughPoints[9] = [2, -5];

      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 9,
        throughPoint: throughPoints[9]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });


  })

  it('third control vector depends on internal copy of first control vector', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve through="(1,2) (3,4) (-5,6)">
  <beziercontrols>
    <controlVectors>(-1,4)</controlVectors>
    <controlVectors>(2,0)</controlVectors>
    <controlVectors><copy prop="controlVector1_2" target="_curve1" /></controlVectors>
  </beziercontrols>
  </curve>
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../_curve1" assignNames="curve" />
  </graph>

  <copy target="g2" assignNames="g3" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6]];
    let controlVectors = [
      [[-1, 4], [1, -4]],
      [[2, 0], [-2, -0]],
      [[1, -4], [-1, 4]],
    ];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        controlVectors,
      })
    });


    cy.log('move first and second control vectors of curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors = [
        [[4, -2], [-4, 2]],
        [[3, 5], [-3, -5]],
        [[-4, 2], [4, -2]],
      ];

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 0],
        controlVector: controlVectors[0][0]
      })

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });

    cy.log('move first and second control vectors of curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors = [
        [[-7, 9], [7, -9]],
        [[6, 1], [-6, -1]],
        [[7, -9], [-7, 9]],
      ];

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [1, 1],
        controlVector: controlVectors[1][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });


    cy.log('move first and second control vectors of curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors = [
        [[-5, 1], [5, -1]],
        [[-2, -3], [2, 3]],
        [[5, -1], [-5, 1]],
      ];

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [1, 0],
        controlVector: controlVectors[1][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });


    cy.log('move last control vector of curve 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors = [
        [[9, 10], [-9, -10]],
        [[-2, -3], [2, 3]],
        [[-9, -10], [9, 10]],
      ];

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });


    cy.log('move last control vector of curve 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors = [
        [[-3, -7], [3, 7]],
        [[-2, -3], [2, 3]],
        [[3, 7], [-3, -7]],
      ];

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });


    cy.log('move last control vector of curve 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      controlVectors = [
        [[4, 6], [-4, -6]],
        [[-2, -3], [2, 3]],
        [[-4, -6], [4, 6]],
      ];

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });


  })

  it('first control vector depends on internal copy of unspecified third control vector', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <curve through="(1,2) (3,4) (-5,6)">
  <beziercontrols>
    <controlVectors><copy prop="controlVector3_1" target="_curve1" /></controlVectors>
    <controlVectors>(-1,4)</controlVectors>
  </beziercontrols>
  </curve>
  </graph>

  <graph name="g2" newNamespace>
    <copy target="../_curve1" assignNames="curve" />
  </graph>

  <copy target="g2" assignNames="g3" />

  <p>Temp way to change controls 1:
  <choiceInput inline name="dir3" bindValueTo="$(_curve1{prop='vectorcontroldirection3'})" >
    <group name="choices">
      <choice>none</choice>
      <choice>symmetric</choice>
      <choice>both</choice>
      <choice>previous</choice>
      <choice>next</choice>
    </group>
  </choiceInput>
  </p>

  <p>Temp way to change controls 2:
  <choiceInput inline name="dir3a" bindValueTo="$(g2/curve{prop='vectorcontroldirection3'})" >
  <copy target="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 3:
  <choiceInput inline name="dir3b" bindValueTo="$(g3/curve{prop='vectorcontroldirection3'})" >
  <copy target="choices" />
  </choiceInput>
  </p>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6]];
    let controlVectors = [
      [[], []],
      [[-1, 4], [1, -4]],
      [[], []],
    ];
    let directions = ["symmetric", "symmetric", "none"];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let cv3 = (await components["/_curve1"].stateValues.controlVectors)[2][0];

      controlVectors[0][0][0] = controlVectors[2][0][0] = cv3[0].tree;
      controlVectors[0][0][1] = controlVectors[2][0][1] = cv3[1].tree;
      controlVectors[0][1][0] = controlVectors[2][1][0] = -controlVectors[0][0][0];
      controlVectors[0][1][1] = controlVectors[2][1][1] = -controlVectors[0][0][1];

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


    cy.log("can't move first control vector of curve 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 0],
        controlVector: [9, 2]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


    cy.log("can't move first control vector of curve 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [0, 0],
        controlVector: [-7, 6]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("can't move first control vector of curve 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: [91, 11]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


    cy.log('turn on third control vector on curve 1')
    cy.get(`#\\/dir3`).select(`2`);
    cy.get(`#\\/dir3`).should('have.value', '2');
    cy.get(`#\\/dir3a`).should('have.value', '2');
    cy.get(`#\\/dir3b`).should('have.value', '2');

    cy.log("move first control vector of curve 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      directions[2] = "symmetric";
      controlVectors[0] = controlVectors[2] = [[3, 7], [-3, -7]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 0],
        controlVector: controlVectors[0][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move first control vector of curve 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = controlVectors[2] = [[-5, 9], [5, -9]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move first control vector of curve 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = controlVectors[2] = [[-4, -3], [4, 3]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: controlVectors[0][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move third control vector of curve 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = controlVectors[2] = [[1, 9], [-1, -9]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move third control vector of curve 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = controlVectors[2] = [[-2, 8], [2, -8]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move third control vector of curve 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = controlVectors[2] = [[3, -7], [-3, 7]]

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

  })

  it('internal copies among controls', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
  <curve through="(1,2) (3,4) (-5,6) (3,5)">
  <beziercontrols>
    <controlVectors><vector>
      (<copy prop="controlVectorX1_2_2" target="_curve1" />,
      5)
    </vector></controlVectors>
    <controlVectors direction="both">
      <vector>(3,4)</vector>
      <vector>
        (-<copy prop="controlVectorX2_1_2" target="_curve1" />,
        <copy prop="controlVectorX2_1_1" target="_curve1" />)
      </vector>
    </controlVectors>
    <controlVectors><vector>
      (<copy prop="controlVectorX4_1_2" target="_curve1" />,
      4)
    </vector></controlVectors>
    <controlVectors><vector>
      (<copy prop="controlVectorX3_1_2" target="_curve1" />,
      -2)
    </vector></controlVectors>
  </beziercontrols>
  </curve>
  </graph>
  
  <graph name="g2" newNamespace>
    <copy target="../_curve1" assignNames="curve" />
  </graph>

  <copy target="g2" assignNames="g3" />

  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let throughPoints = [[1, 2], [3, 4], [-5, 6], [3, 5]];
    let controlVectors = [
      [[-5, 5], [5, -5]],
      [[3, 4], [-4, 3]],
      [[-2, 4], [2, -4]],
      [[4, -2], [-4, 2]],
    ];
    let directions = ["symmetric", "both", "symmetric", "symmetric"];

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move points')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      throughPoints = [[-5, 7], [8, 3], [-2, -4], [6, -1]];

      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 0,
        throughPoint: throughPoints[0]
      })
      await components['/g2/curve'].moveThroughPoint({
        throughPointInd: 1,
        throughPoint: throughPoints[1]
      })
      await components['/g3/curve'].moveThroughPoint({
        throughPointInd: 2,
        throughPoint: throughPoints[2]
      })
      await components['/_curve1'].moveThroughPoint({
        throughPointInd: 3,
        throughPoint: throughPoints[3]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
      })

    });

    cy.log("move first control vector of curve 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);


      controlVectors[0] = [[7, -7], [-7, 7]]

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [0, 0],
        controlVector: [-9, -7]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move first control vector of curve 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[0] = [[-1, 1], [1, -1]]

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [0, 1],
        controlVector: [5, -1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move second control vector of curve 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[1] = [[6, -2], [2, 6]],

        await components['/g3/curve'].moveControlVector({
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move second control vector of curve 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[1] = [[-7, -8], [8, -7]],

        await components['/_curve1'].moveControlVector({
          controlVectorInds: [1, 1],
          controlVector: controlVectors[1][1]
        })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move third control vector of curve 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[2] = [[-3, 5], [3, -5]];
      controlVectors[3] = [[5, -3], [-5, 3]];

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [2, 0],
        controlVector: controlVectors[2][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move third control vector of curve 3")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[2] = [[7, 6], [-7, -6]];
      controlVectors[3] = [[6, 7], [-6, -7]];

      await components['/g3/curve'].moveControlVector({
        controlVectorInds: [2, 1],
        controlVector: controlVectors[2][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move fourth control vector of curve 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[2] = [[-1, -2], [1, 2]];
      controlVectors[3] = [[-2, -1], [2, 1]];

      await components['/_curve1'].moveControlVector({
        controlVectorInds: [3, 0],
        controlVector: controlVectors[3][0]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move fourth control vector of curve 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      controlVectors[2] = [[1, -9], [-1, 9]];
      controlVectors[3] = [[-9, 1], [9, -1]];

      await components['/g2/curve'].moveControlVector({
        controlVectorInds: [3, 1],
        controlVector: controlVectors[3][1]
      })

      await checkBezierCurve({
        curve: components['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      await checkBezierCurve({
        curve: components['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });
  })


});