describe('Curve Tag Bezier Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  function checkBezierCurve({ curve, throughPoints, directions, controlVectors }) {
    if (throughPoints) {
      for (let [ind, pt] of throughPoints.entries()) {
        expect(curve.stateValues.throughPoints[ind]).eqls(pt);
      }
    }

    if (directions) {
      for (let [ind, dir] of directions.entries()) {
        expect(curve.stateValues.vectorControlDirections[ind]).eq(dir);
      }
    }

    if (controlVectors) {
      for (let [ind, vecs] of controlVectors.entries()) {
        if (vecs) {
          let pt = throughPoints[ind];
          if (vecs[0]) {
            expect(curve.stateValues.controlVectors[ind][0]).eqls(vecs[0]);
            if (pt) {
              expect(curve.stateValues.controlPoints[ind][0]).eqls(
                [pt[0] + vecs[0][0], pt[1] + vecs[0][1]]);
            }
          }
          if (vecs[1]) {
            expect(curve.stateValues.controlVectors[ind][1]).eqls(vecs[1]);
            if (pt) {
              expect(curve.stateValues.controlPoints[ind][1]).eqls(
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
      <curve through="(1, 2) (3, 4) (-5, 6) (2, 1)" />
    </graph>

    <graph name="g2" newNamespace>
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]]
    let directions = ["none", "none", "none", "none"];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })
    });

    cy.log('cannot change control vector')
    cy.get(`#\\/dir1`).select(`2`);
    cy.get(`#\\/dir1`).should('have.value', '1');

    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: [2, 1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();
      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0][1][0]).not.eq(2);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0][1][1]).not.eq(1);
      expect((stateVariables['/g2/curve'].stateValues.controlVectors)[0][1][0]).not.eq(2);
      expect((stateVariables['/g2/curve'].stateValues.controlVectors)[0][1][1]).not.eq(1);
      expect((stateVariables['/g3/curve'].stateValues.controlVectors)[0][1][0]).not.eq(2);
      expect((stateVariables['/g3/curve'].stateValues.controlVectors)[0][1][1]).not.eq(1);
    });

    cy.log('move through point')
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 0,
          throughPoint: [-3, -4]
        }
      })

      throughPoints[0] = [-3, -4]

      let stateVariables = await win.returnAllStateVariables1();
      console.log(stateVariables);

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('cannot move next control vector')
    cy.get(`#\\/dir2`).select(`2`);
    cy.get(`#\\/dir2`).should('have.value', '1');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [1, 0],
          controlVector: [4, -2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

      let v00 = (stateVariables['/_curve1'].stateValues.controlVectors)[1][0][0];
      let v01 = (stateVariables['/_curve1'].stateValues.controlVectors)[1][0][1];
      expect(v00).not.eq(4);
      expect(v01).not.eq(-2);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1][1][0]).eq(-v00);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1][1][1]).eq(-v01);

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
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [2, 1]];

    let directions = ["none", "none", "none", "none"];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[0] = "symmetric";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = [-3, -4]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[1] = [[4, -2], [-4, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[1] = "symmetric";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [[1, 0], [0, -2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "both";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[1] = [[-4, -5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[1] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [null, [6, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('move through points')
    cy.window().then(async (win) => {

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
      <copy source="choices" />
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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {

      controlVectors[0] = [[-2, -1], [2, 1]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = [-3, -4]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve 3')
    cy.window().then(async (win) => {
      controlVectors[1] = [[4, -2], [-4, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [[1, 0], [0, -2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "both";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[1] = [[-4, -5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[1] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [null, [6, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[3][1] = null;

      directions[3] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through points')
    cy.window().then(async (win) => {

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
      <copy source="choices" />
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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[0] = [[-2, -1], [2, 1]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      throughPoints[0] = [-3, -4]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vectors on curve 3')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      controlVectors[1] = [[4, -2], [3, 5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors[1][1]
        }
      })

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();
      controlVectors[2] = [[1, 0], [-1, -0]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      directions[2] = "symmetric";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();
      controlVectors[1] = [[-4, -5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      directions[1] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();
      controlVectors[2] = [null, [6, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      directions[2] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[3][1] = null;

      directions[3] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('move through points')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


  })


  // Not sure if this test is still useful
  // now that we don't have usedDefault sent from the core worker
  // Is there a reason to send that information?
  it('check use default bug is fixed', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <controlVectors>(-1,5)</controlVectors>
    <copy source="_controlvectors1" assignNames="cv1a" />

    <p><textinput name="dira" bindValueTo="$(_controlvectors1.direction)" />
    </p>

    <p><textinput name="dirb" bindValueTo="$(cv1a.direction)" />
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); //wait for window to load

    cy.get('#\\/dira_input').should('have.value', 'symmetric')
    cy.get('#\\/dirb_input').should('have.value', 'symmetric')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_controlvectors1'].stateValues.direction).eq('symmetric')
      // expect(stateVariables['/_controlvectors1'].state.direction.usedDefault).be.true

      expect(stateVariables['/cv1a'].stateValues.direction).eq('symmetric')
      // expect(stateVariables['/cv1a'].state.direction.usedDefault).be.true
    })


    cy.get('#\\/dira_input').clear().type("both{enter}")

    cy.get('#\\/dira_input').should('have.value', 'both')
    cy.get('#\\/dirb_input').should('have.value', 'both')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_controlvectors1'].stateValues.direction).eq('both')
      // expect(stateVariables['/_controlvectors1'].state.direction.usedDefault).not.be.true

      expect(stateVariables['/cv1a'].stateValues.direction).eq('both')
      // expect(stateVariables['/cv1a'].state.direction.usedDefault).not.be.true
    })


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <controlVectors>(-1,5)</controlVectors>
    <copy source="_controlvectors1" assignNames="cv1a" />

    <p><textinput name="dira" bindValueTo="$(_controlvectors1.direction)" />
    </p>

    <p><textinput name="dirb" bindValueTo="$(cv1a.direction)" />
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b'); //wait for window to load

    cy.get('#\\/dira_input').should('have.value', 'symmetric')
    cy.get('#\\/dirb_input').should('have.value', 'symmetric')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_controlvectors1'].stateValues.direction).eq('symmetric')
      // expect(stateVariables['/_controlvectors1'].state.direction.usedDefault).be.true

      expect(stateVariables['/cv1a'].stateValues.direction).eq('symmetric')
      // expect(stateVariables['/cv1a'].state.direction.usedDefault).be.true
    })


    cy.get('#\\/dirb_input').clear().type("none{enter}")

    cy.get('#\\/dira_input').should('have.value', 'none')
    cy.get('#\\/dirb_input').should('have.value', 'none')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_controlvectors1'].stateValues.direction).eq('none')
      // expect(stateVariables['/_controlvectors1'].state.direction.usedDefault).not.be.true

      expect(stateVariables['/cv1a'].stateValues.direction).eq('none')
      // expect(stateVariables['/cv1a'].state.direction.usedDefault).not.be.true
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
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
      <copy source="choices" />
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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {

      controlVectors[0] = [[-2, -1], [2, 1]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = [-3, -4]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve 3')
    cy.window().then(async (win) => {
      controlVectors[1] = [[4, -2], [-4, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [[1, 0], [0, -2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "both";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[1] = [[-4, -5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[1] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [null, [6, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[3][1] = null;

      directions[3] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through points')
    cy.window().then(async (win) => {

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
      <copy source="choices" />
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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {

      controlVectors[0] = [[-2, -1], [2, 1]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = [-3, -4]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve 3')
    cy.window().then(async (win) => {
      controlVectors[1] = [[4, -2], [-4, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [[1, 0], [0, -2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "both";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[1] = [[-4, -5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[1] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [null, [6, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[3][1] = null;

      directions[3] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through points')
    cy.window().then(async (win) => {

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
      <copy source="choices" />
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
      let stateVariables = await win.returnAllStateVariables1();

      let cv2 = (stateVariables["/_curve1"].stateValues.controlVectors)[1][0];

      controlVectors[1][0][0] = cv2[0];
      controlVectors[1][0][1] = cv2[1];
      controlVectors[1][1][0] = -controlVectors[1][0][0];
      controlVectors[1][1][1] = -controlVectors[1][0][1];

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {

      controlVectors[0] = [[-2, -1], [2, 1]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[3] = [-3, -4]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve 3')
    cy.window().then(async (win) => {
      controlVectors[3] = [[4, -2], [-4, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [3, 0],
          controlVector: controlVectors[3][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [[1, 0], [0, -2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "both";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[1] = [[-4, -5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[1] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [null, [6, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[3][1] = null;

      directions[3] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through points')
    cy.window().then(async (win) => {

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
      <copy source="choices" />
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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {

      controlVectors[0] = [[-2, -1], [2, 1]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = [-3, -4]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vectors on curve 3')
    cy.window().then(async (win) => {
      controlVectors[1] = [[4, -2], [3, 5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors[1][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [[1, 0], [-1, -0]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "symmetric";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[1] = [[-4, -5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[1] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [null, [6, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[3][1] = null;

      directions[3] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('move through points')
    cy.window().then(async (win) => {

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
          <controlVectors direction="both">(-1,5) (4,2)</controlVectors>
        </beziercontrols>
      </curve>
    </graph>

    <graph name="g2" newNamespace>
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
      <copy source="choices" />
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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {

      controlVectors[0] = [[-2, -1], [2, 1]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = [-3, -4]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vectors on curve 3')
    cy.window().then(async (win) => {
      controlVectors[1] = [[4, -2], [3, 5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors[1][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [[1, 0], [-1, -0]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "symmetric";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[1] = [[-4, -5]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[1] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      controlVectors[2] = [null, [6, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions[2] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[3][1] = null;

      directions[3] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });


    cy.log('move through points')
    cy.window().then(async (win) => {

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

    <p>Temp way to change controls 1:
    <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group name="choices">
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 2:
    <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
      <copy source="choices" />
    </choiceInput>
    </p>

    <p>Temp way to change controls 3:
    <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
      <copy source="choices" />
    </choiceInput>
    <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
      <copy source="choices" />
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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {

      controlVectors[0] = [[-2, -1], [2, 1]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = [-3, -4]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move previous control vector on curve 3')
    cy.window().then(async (win) => {
      controlVectors[1] = [[4, -2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move next control vector on curve 2')
    cy.window().then(async (win) => {
      controlVectors[2] = [null, [8, 7]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();
      controlVectors[1][1] = controlVectors[1][0];
      controlVectors[1][0] = null;

      directions[1] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move new next control vector on curve 3')
    cy.window().then(async (win) => {
      controlVectors[1] = [null, [-1, 6]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors[1][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();
      controlVectors[2][0] = controlVectors[2][1];
      controlVectors[2][1] = null;

      directions[2] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move new previous control vector on curve 1')
    cy.window().then(async (win) => {
      controlVectors[2] = [[-3, -2], null]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();
      controlVectors[1][0] = controlVectors[1][1];
      controlVectors[1][1] = [-controlVectors[1][0][0], -controlVectors[1][0][1]];

      directions[1] = "symmetric";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move new next symmetric vector on curve 3')
    cy.window().then(async (win) => {
      controlVectors[1] = [[4, 9], [-4, -9]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move other end of new next symmetric vector on curve 1')
    cy.window().then(async (win) => {
      controlVectors[1] = [[6, -2], [-6, 2]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors[1][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[3][1] = null;

      directions[3] = "previous";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move new previous control vector on curve 2')
    cy.window().then(async (win) => {
      controlVectors[3] = [[1, -1], null]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [3, 0],
          controlVector: controlVectors[3][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();

      controlVectors[0][1] = controlVectors[0][0];
      controlVectors[0][0] = null;

      directions[0] = "next";

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move new next next vector on curve 3')
    cy.window().then(async (win) => {
      controlVectors[0] = [null, [8, -3]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through points')
    cy.window().then(async (win) => {

      throughPoints[1] = [7, -6]
      throughPoints[2] = [3, 9]
      throughPoints[3] = [-4, 8]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      <copy source="../_curve1" assignNames="curve" />
    </graph>

    <copy source="g2" assignNames="g3" />

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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


    cy.log('move through point on curve 1')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: [1.1, 8.7]
        }
      })
      throughPoints[1] = [1, 9];

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move control vector on curve1')
    cy.window().then(async (win) => {

      controlVectors[0] = [[-2, -1], [2, 1]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move original point determining through point')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -3.2, y: 4.9 }
      })

      let stateVariables = await win.returnAllStateVariables1();

      throughPoints[2] = [-3, 5];

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    })

    cy.log('move through point on curve 2')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: [-7.4, 1.6]
        }
      })
      throughPoints[0] = [-7, 2];

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    });

    cy.log('move through point on curve 3')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: [-4.6, -9.3]
        }
      })
      throughPoints[3] = [-5, -9];

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.throughPoints[0]).eqls([1, 2]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[1]).eqls([3, 4]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[2]).eqls([-5, 6]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[3]).eqls([2, -3]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0][1]).greaterThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1][1]).lessThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2][1]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2][2]).lessThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3][1]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3][2]).lessThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4][1]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4][2]).greaterThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[5][1]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[5][2]).greaterThan(0);
    });

    cy.log('move control vectors')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInd: 3,
          controlVector: [7, -6]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInd: 2,
          controlVector: [-6, -5]
        }
      })
      expect(stateVariables['/_curve1'].stateValues.throughPoints[0]).eqls([1, 2]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[1]).eqls([3, 4]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[2]).eqls([-5, 6]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[3]).eqls([2, -3]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0][1]).greaterThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1][1]).lessThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2][1]).lessThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3][1]).greaterThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4][1]).lessThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[5][1]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[5][2]).greaterThan(0);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.throughPoints[0]).eqls([1, 2]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[1]).eqls([3, 4]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[2]).eqls([-5, 6]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[3]).eqls([2, -3]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0]).eqls([3, 1]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1]).eqls([-4, 1]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2]).eqls([1, -2]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3]).eqls([5, -6]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4]).eqls([-5, 6]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[5]).eqls([-2, 3]);

    });

    cy.log('move control vector close to angles')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInd: 3,
          controlVector: [7, 0.2]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInd: 2,
          controlVector: [0.1, -6]
        }
      })
      expect(stateVariables['/_curve1'].stateValues.throughPoints[0]).eqls([1, 2]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[1]).eqls([3, 4]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[2]).eqls([-5, 6]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[3]).eqls([2, -3]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0]).eqls([3, 1]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1]).eqls([-4, 1]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2][1]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2][2]).lessThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3][1]).greaterThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4][1]).lessThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[5]).eqls([-2, 3]);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_curve1'].stateValues.throughPoints[0]).eqls([1, 2]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[1]).eqls([3, 4]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[2]).eqls([-5, 6]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[3]).eqls([2, -3]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0]).eqls([3, 1]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1]).eqls([-4, 1]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2]).eqls([4, -1]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3]).eqls([5, -6]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4]).eqls([-5, 6]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[5]).eqls([-2, 3]);

    });

    cy.log('move control vectors close to angles')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInd: 3,
          controlVector: [7, 0.125]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInd: 2,
          controlVector: [0.125, -6]
        }
      })
      expect(stateVariables['/_curve1'].stateValues.throughPoints[0]).eqls([1, 2]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[1]).eqls([3, 4]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[2]).eqls([-5, 6]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[3]).eqls([2, -3]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0]).eqls([3, 1]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1][1]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1][2]).greaterThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2][1]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2][2]).lessThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3][1]).greaterThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4][1]).lessThan(0);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4][2]).closeTo(0, 1E-12);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[5]).eqls([-2, 3]);
    });

    cy.log('move control vectors opposite sides')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInd: 3,
          controlVector: [-7, 0.125]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInd: 2,
          controlVector: [0.125, 6]
        }
      })
      expect(stateVariables['/_curve1'].stateValues.throughPoints[0]).eqls([1, 2]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[1]).eqls([3, 4]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[2]).eqls([-5, 6]);
      expect(stateVariables['/_curve1'].stateValues.throughPoints[3]).eqls([2, -3]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[0]).eqls([3, 1]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[1]).eqls([-0.125, -6]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[2]).eqls([0.125, 6]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[3]).eqls([-7, 0.125]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[4]).eqls([7, -0.125]);
      expect((stateVariables['/_curve1'].stateValues.controlVectors)[5]).eqls([-2, 3]);
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
        <controlVectors direction="both">(3,2) (-1,5)</controlVectors>
        <controlVectors>(1,4)</controlVectors>
      </beziercontrols>
    </curve>
    </graph>
    <graph>
    <curve through="$(_curve1.throughPoint1) ($(_curve1.throughPointX2_2), $(_curve1.throughPointX2_1)) $(_curve1.throughPoint3) ($(_curve1.throughPointX4_2), $(_curve1.throughPointX4_1))">
      <beziercontrols>
        <controlVectors>
          <copy prop="controlVector1_1" source="_curve1" />
        </controlVectors>
        <controlVectors>
          <vector>
            (<extract prop="y"><copy prop="controlVector2_1" source="_curve1" /></extract>,
            <extract prop="x"><copy prop="controlVector2_1" source="_curve1" /></extract>)
          </vector>
        </controlVectors>
        <controlVectors direction="both">
          <copy prop="controlVector3_1" source="_curve1" />
          <vector>
            (<extract prop="y"><copy prop="controlVector3_2" source="_curve1" /></extract>,
            <extract prop="x"><copy prop="controlVector3_2" source="_curve1" /></extract>)
          </vector>
        </controlVectors>
        <controlVectors>
          <vector>
            (<extract prop="y"><copy prop="controlVector4_1" source="_curve1" /></extract>,
            <extract prop="x"><copy prop="controlVector4_1" source="_curve1" /></extract>)
          </vector>
        </controlVectors>
      </beziercontrols>
    </curve>
    </graph>

    <graph>
      <copy source="_curve1" assignNames="curve1a" />
    </graph>
    <graph>
      <copy source="_curve2" assignNames="curve2a" />
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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      checkBezierCurve({
        curve: stateVariables['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      checkBezierCurve({
        curve: stateVariables['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      checkBezierCurve({
        curve: stateVariables['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
    });


    cy.log('move through points on all four curves')
    cy.window().then(async (win) => {
      throughPoints1 = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      throughPoints2 = [[7, 2], [-3, 1], [2, 9], [-3, -4]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints1[0]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/curve1a",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints1[1]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve2",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints2[2]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/curve2a",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints2[3]
        }
      });


      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      checkBezierCurve({
        curve: stateVariables['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      checkBezierCurve({
        curve: stateVariables['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      checkBezierCurve({
        curve: stateVariables['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move control vectors on all four curves')
    cy.window().then(async (win) => {

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

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors1[0][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/curve1a",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors1[1][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve2",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors2[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/curve2a",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors2[2][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [3, 0],
          controlVector: controlVectors1[3][0]
        }
      })


      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      checkBezierCurve({
        curve: stateVariables['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      checkBezierCurve({
        curve: stateVariables['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      checkBezierCurve({
        curve: stateVariables['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move through points on all four curves again')
    cy.window().then(async (win) => {
      throughPoints1 = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      throughPoints2 = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/curve2a",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints2[0]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve2",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints2[1]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/curve1a",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints1[2]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints1[3]
        }
      });


      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      checkBezierCurve({
        curve: stateVariables['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      checkBezierCurve({
        curve: stateVariables['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      checkBezierCurve({
        curve: stateVariables['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move control vectors on all four curves again')
    cy.window().then(async (win) => {

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

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/curve2a",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors2[0][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve2",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors2[1][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/curve1a",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors1[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors1[2][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/curve2a",
        args: {
          controlVectorInds: [3, 0],
          controlVector: controlVectors2[3][0]
        }
      })


      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      checkBezierCurve({
        curve: stateVariables['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      checkBezierCurve({
        curve: stateVariables['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      checkBezierCurve({
        curve: stateVariables['/curve2a'],
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
    <curve through="$(_curve1.throughPoint1) ($(_curve1.throughPointX2_2), $(_curve1.throughPointX2_1)) $(_curve1.throughPoint3) ($(_curve1.throughPointX4_2), $(_curve1.throughPointX4_1))">
      <beziercontrols>
        <controlVectors>
          <vector>
            (<copy prop="controlPointX1_1_1" source="_curve1" />
             -<copy fixed prop="throughPointX1_1" source="_curve1" />,
             <copy prop="controlPointX1_1_2" source="_curve1" />
             -<copy fixed prop="throughPointX1_2" source="_curve1" />)
          </vector>
        </controlVectors>
        <controlVectors>
          <vector>
            (<copy prop="controlPointX2_1_2" source="_curve1" />
             -<copy fixed prop="throughPointX2_2" source="_curve1" />,
            <copy prop="controlPointX2_1_1" source="_curve1" />
             -<copy fixed prop="throughPointX2_1" source="_curve1" />)
          </vector>
        </controlVectors>
        <controlVectors direction="both">
          <vector>
            (<copy prop="controlPointX3_1_1" source="_curve1" />
             -<copy fixed prop="throughPointX3_1" source="_curve1" />,
            <copy prop="controlPointX3_1_2" source="_curve1" />
             -<copy fixed prop="throughPointX3_2" source="_curve1" />)
          </vector>
          <vector>
            (<copy prop="controlPointX3_2_2" source="_curve1" />
             -<copy fixed prop="throughPointX3_2" source="_curve1" />,
            <copy prop="controlPointX3_2_1" source="_curve1" />
             -<copy fixed prop="throughPointX3_1" source="_curve1" />)
          </vector>
        </controlVectors>
        <controlVectors>
          <vector>
            (<copy prop="controlPointX4_1_2" source="_curve1" />
             -<copy fixed prop="throughPointX4_2" source="_curve1" />,
            <copy prop="controlPointX4_1_1" source="_curve1" />
             -<copy fixed prop="throughPointX4_1" source="_curve1" />)
          </vector>
        </controlVectors>
      </beziercontrols>
    </curve>
    </graph>

    <graph>
      <copy source="_curve1" assignNames="curve1a" />
    </graph>
    <graph>
      <copy source="_curve2" assignNames="curve2a" />
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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      checkBezierCurve({
        curve: stateVariables['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      checkBezierCurve({
        curve: stateVariables['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      checkBezierCurve({
        curve: stateVariables['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
    });


    cy.log('move through points on all four curves')
    cy.window().then(async (win) => {
      throughPoints1 = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      throughPoints2 = [[7, 2], [-3, 1], [2, 9], [-3, -4]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints1[0]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/curve1a",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints1[1]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve2",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints2[2]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/curve2a",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints2[3]
        }
      });

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      checkBezierCurve({
        curve: stateVariables['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      checkBezierCurve({
        curve: stateVariables['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      checkBezierCurve({
        curve: stateVariables['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move control vectors on all four curves')
    cy.window().then(async (win) => {

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

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors1[0][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/curve1a",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors1[1][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve2",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors2[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/curve2a",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors2[2][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [3, 0],
          controlVector: controlVectors1[3][0]
        }
      })


      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      checkBezierCurve({
        curve: stateVariables['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      checkBezierCurve({
        curve: stateVariables['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      checkBezierCurve({
        curve: stateVariables['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move through points on all four curves again')
    cy.window().then(async (win) => {
      throughPoints1 = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      throughPoints2 = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/curve2a",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints2[0]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve2",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints2[1]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/curve1a",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints1[2]
        }
      });
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints1[3]
        }
      });


      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      checkBezierCurve({
        curve: stateVariables['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      checkBezierCurve({
        curve: stateVariables['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      checkBezierCurve({
        curve: stateVariables['/curve2a'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })

    })


    cy.log('move control vectors on all four curves again')
    cy.window().then(async (win) => {

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

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/curve2a",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors2[0][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve2",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors2[1][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/curve1a",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors1[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors1[2][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/curve2a",
        args: {
          controlVectorInds: [3, 0],
          controlVector: controlVectors2[3][0]
        }
      })


      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })
      checkBezierCurve({
        curve: stateVariables['/curve1a'],
        throughPoints: throughPoints1,
        directions,
        controlVectors: controlVectors1,
      })

      checkBezierCurve({
        curve: stateVariables['/_curve2'],
        throughPoints: throughPoints2,
        directions,
        controlVectors: controlVectors2,
      })
      checkBezierCurve({
        curve: stateVariables['/curve2a'],
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
  <curve through="(1,2) (3,4) (-5,6) $(_curve1.throughPoint1{ createComponentOfType='point'})">
  <bezierControls />
  </curve>
  </graph>

  <graph name="g2" newNamespace>
    <copy source="../_curve1" assignNames="curve" />
  </graph>

  <copy source="g2" assignNames="g3" />

  <p>Temp way to change controls 1:
  <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
    <group name="choices">
      <choice>none</choice>
      <choice>symmetric</choice>
      <choice>both</choice>
      <choice>previous</choice>
      <choice>next</choice>
    </group>
  </choiceInput>
  <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
    <copy source="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 2:
  <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
    <copy source="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 3:
  <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
    <copy source="choices" />
  </choiceInput>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [1, 2]];
    let directions = ["none", "none", "none", "none"];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })
    });


    cy.log('move first three points on curve 1')
    cy.window().then(async (win) => {

      throughPoints = [[-4, -1], [8, 9], [-3, 7], [-4, -1]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 2')
    cy.window().then(async (win) => {

      throughPoints = [[5, 6], [-1, -2], [6, -5], [5, 6]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 3')
    cy.window().then(async (win) => {

      throughPoints = [[4, -4], [-7, 7], [3, 3], [4, -4]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 1')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [7, 0];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [-6, 9];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 3')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [8, 2];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: controlVectors[0][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [3, 0],
          controlVector: controlVectors[3][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions = ["symmetric", "symmetric", "symmetric", "symmetric"];

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    })

    cy.log('move control vectors again')
    cy.window().then(async (win) => {

      controlVectors = [
        [[5, -6], [-5, 6]],
        [[-3, 2], [3, -2]],
        [[-8, -9], [8, 9]],
        [[7, 1], [-7, -1]],
      ];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors[1][1]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [3, 1],
          controlVector: controlVectors[3][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
  <curve through="$(_curve1.throughPoint4{ createComponentOfType='point'}) (3,4) (-5,6) (1,2)">
  <bezierControls />
  </curve>
  </graph>

  <graph name="g2" newNamespace>
    <copy source="../_curve1" assignNames="curve" />
  </graph>

  <copy source="g2" assignNames="g3" />

  <p>Temp way to change controls 1:
  <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
    <group name="choices">
      <choice>none</choice>
      <choice>symmetric</choice>
      <choice>both</choice>
      <choice>previous</choice>
      <choice>next</choice>
    </group>
  </choiceInput>
  <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
    <copy source="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 2:
  <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
    <copy source="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 3:
  <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
    <copy source="choices" />
  </choiceInput>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [1, 2]];
    let directions = ["none", "none", "none", "none"];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })
    });


    cy.log('move first three points on curve 1')
    cy.window().then(async (win) => {

      throughPoints = [[-4, -1], [8, 9], [-3, 7], [-4, -1]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 2')
    cy.window().then(async (win) => {

      throughPoints = [[5, 6], [-1, -2], [6, -5], [5, 6]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 3')
    cy.window().then(async (win) => {

      throughPoints = [[4, -4], [-7, 7], [3, 3], [4, -4]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 1')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [7, 0];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [-6, 9];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 3')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [8, 2];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: controlVectors[0][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [3, 0],
          controlVector: controlVectors[3][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions = ["symmetric", "symmetric", "symmetric", "symmetric"];

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    })

    cy.log('move control vectors again')
    cy.window().then(async (win) => {

      controlVectors = [
        [[5, -6], [-5, 6]],
        [[-3, 2], [3, -2]],
        [[-8, -9], [8, 9]],
        [[7, 1], [-7, -1]],
      ];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors[1][1]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [3, 1],
          controlVector: controlVectors[3][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
  <curve through="$(_curve1.throughPoint4{ createComponentOfType='point'}) (3,4) (-5,6) (1,2) ($_curve1.throughPointX1_1+1, 2)">
  <bezierControls />
  </curve>
  </graph>

  <graph name="g2" newNamespace>
    <copy source="../_curve1" assignNames="curve" />
  </graph>

  <copy source="g2" assignNames="g3" />

  <p>Temp way to change controls 1:
  <choiceInput inline name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
    <group name="choices">
      <choice>none</choice>
      <choice>symmetric</choice>
      <choice>both</choice>
      <choice>previous</choice>
      <choice>next</choice>
    </group>
  </choiceInput>
  <choiceInput inline name="dir2" bindValueTo="$_curve1.vectorcontroldirection2" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir5" bindValueTo="$_curve1.vectorcontroldirection5" >
    <copy source="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 2:
  <choiceInput inline name="dir1a" bindValueTo="$(g2/curve.vectorcontroldirection1)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir2a" bindValueTo="$(g2/curve.vectorcontroldirection2)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir4a" bindValueTo="$(g2/curve.vectorcontroldirection4)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir5a" bindValueTo="$(g2/curve.vectorcontroldirection5)" >
    <copy source="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 3:
  <choiceInput inline name="dir1b" bindValueTo="$(g3/curve.vectorcontroldirection1)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir2b" bindValueTo="$(g3/curve.vectorcontroldirection2)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir4b" bindValueTo="$(g3/curve.vectorcontroldirection4)" >
    <copy source="choices" />
  </choiceInput>
  <choiceInput inline name="dir5b" bindValueTo="$(g3/curve.vectorcontroldirection5)" >
    <copy source="choices" />
  </choiceInput>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[1, 2], [3, 4], [-5, 6], [1, 2], [2, 2]];
    let directions = ["none", "none", "none", "none", "none"];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })
    });


    cy.log('move first three points on curve 1')
    cy.window().then(async (win) => {

      throughPoints = [[-4, -1], [8, 9], [-3, 7], [-4, -1], [-3, 2]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 2')
    cy.window().then(async (win) => {

      throughPoints = [[5, 6], [-1, -2], [6, -5], [5, 6], [6, 2]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move first three points on curve 3')
    cy.window().then(async (win) => {

      throughPoints = [[4, -4], [-7, 7], [3, 3], [4, -4], [5, 2]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 1')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [7, 0];
      throughPoints[4] = [8, 2];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [-6, 9];
      throughPoints[4] = [-5, 2];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fourth point on curve 3')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [8, 2];
      throughPoints[4] = [9, 2];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fifth point on curve 1')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [-8, 2];
      throughPoints[4] = [-7, 9];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 4,
          throughPoint: throughPoints[4]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fifth point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [-1, 2];
      throughPoints[4] = [0, 9];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 4,
          throughPoint: throughPoints[4]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions
      })

    });

    cy.log('move fifth point on curve 3')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = [4, 2];
      throughPoints[4] = [5, 4];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 4,
          throughPoint: throughPoints[4]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: controlVectors[0][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [3, 0],
          controlVector: controlVectors[3][0]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [4, 0],
          controlVector: controlVectors[4][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      directions = ["symmetric", "symmetric", "symmetric", "symmetric", "symmetric"];

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })

    })

    cy.log('move control vectors again')
    cy.window().then(async (win) => {

      controlVectors = [
        [[5, -6], [-5, 6]],
        [[-3, 2], [3, -2]],
        [[-8, -9], [8, 9]],
        [[7, 1], [-7, -1]],
        [[-3, -2], [3, 2]],
      ];


      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors[1][1]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [3, 1],
          controlVector: controlVectors[3][1]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [4, 1],
          controlVector: controlVectors[4][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
  <curve through="$(_curve1.throughPoint4{createComponentOfType='point'}) (1,2) (3,4) $(_curve1.throughPoint7{ createComponentOfType='point'}) (5,7) (-5,7) $(_curve1.throughPoint10{ createComponentOfType='point'}) (3,1) (5,0) (-5,-1)" />
  </graph>

  <graph name="g2" newNamespace>
    <copy source="../_curve1" assignNames="curve" />
  </graph>

  <copy source="g2" assignNames="g3" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[-5, -1], [1, 2], [3, 4], [-5, -1], [5, 7], [-5, 7],
    [-5, -1], [3, 1], [5, 0], [-5, -1]]

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })
    });


    cy.log('move first three points on curve 1')
    cy.window().then(async (win) => {

      throughPoints = [[-4, 6], [8, 9], [-3, 7], [-4, 6], [5, 7], [-5, 7],
      [-4, 6], [3, 1], [5, 0], [-4, 6]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move first three points on curve 2')
    cy.window().then(async (win) => {

      throughPoints = [[5, 6], [-1, -2], [6, -5], [5, 6], [5, 7], [-5, 7],
      [5, 6], [3, 1], [5, 0], [5, 6]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move first three points on curve 3')
    cy.window().then(async (win) => {

      throughPoints = [[4, -4], [-7, 7], [3, 3], [4, -4], [5, 7], [-5, 7],
      [4, -4], [3, 1], [5, 0], [4, -4]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });



    cy.log('move second three points on curve 1')
    cy.window().then(async (win) => {

      throughPoints = [[9, 1], [-7, 7], [3, 3], [9, 1], [-8, -2], [7, -3],
      [9, 1], [3, 1], [5, 0], [9, 1]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 4,
          throughPoint: throughPoints[4]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 5,
          throughPoint: throughPoints[5]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move second three points on curve 2')
    cy.window().then(async (win) => {

      throughPoints = [[0, 2], [-7, 7], [3, 3], [0, 2], [1, -3], [-2, -4],
      [0, 2], [3, 1], [5, 0], [0, 2]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 4,
          throughPoint: throughPoints[4]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 5,
          throughPoint: throughPoints[5]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move second three points on curve 3')
    cy.window().then(async (win) => {

      throughPoints = [[-5, -6], [-7, 7], [3, 3], [-5, -6], [-7, 8], [9, 0],
      [-5, -6], [3, 1], [5, 0], [-5, -6]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 4,
          throughPoint: throughPoints[4]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 5,
          throughPoint: throughPoints[5]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move third three points on curve 1')
    cy.window().then(async (win) => {

      throughPoints = [[-9, 8], [-7, 7], [3, 3], [-9, 8], [-7, 8], [9, 0],
      [-9, 8], [7, -6], [-5, -4], [-9, 8]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 6,
          throughPoint: throughPoints[6]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 7,
          throughPoint: throughPoints[7]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 8,
          throughPoint: throughPoints[8]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move third three points on curve 2')
    cy.window().then(async (win) => {

      throughPoints = [[2, 4], [-7, 7], [3, 3], [2, 4], [-7, 8], [9, 0],
      [2, 4], [3, -5], [5, -6], [2, 4]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 6,
          throughPoint: throughPoints[6]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 7,
          throughPoint: throughPoints[7]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 8,
          throughPoint: throughPoints[8]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move third three points on curve 3')
    cy.window().then(async (win) => {

      throughPoints = [[3, -6], [-7, 7], [3, 3], [3, -6], [-7, 8], [9, 0],
      [3, -6], [9, 2], [-7, -1], [3, -6]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 6,
          throughPoint: throughPoints[6]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 7,
          throughPoint: throughPoints[7]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 8,
          throughPoint: throughPoints[8]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });



    cy.log('move last point on curve 1')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = throughPoints[6] = throughPoints[9] = [-6, -8];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 9,
          throughPoint: throughPoints[9]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move last point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = throughPoints[6] = throughPoints[9] = [0, 3];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 9,
          throughPoint: throughPoints[9]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move last point on curve 3')
    cy.window().then(async (win) => {

      throughPoints[0] = throughPoints[3] = throughPoints[6] = throughPoints[9] = [2, -5];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 9,
          throughPoint: throughPoints[9]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
  <curve through="($(_curve1.throughPointX4_1)+1, $(_curve1.throughPointX4_2)+1) (1,2) (3,4) ($(_curve1.throughPointX7_1)+1, $(_curve1.throughPointX7_2)+1) (5,7) (-5,7) ($(_curve1.throughPointX10_1)+1, $(_curve1.throughPointX10_2)+1) (3,1) (5,0) (-5,-1)" />
  
  </graph>

  <graph name="g2" newNamespace>
    <copy source="../_curve1" assignNames="curve" />
  </graph>

  <copy source="g2" assignNames="g3" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let throughPoints = [[-2, 2], [1, 2], [3, 4], [-3, 1], [5, 7], [-5, 7],
    [-4, 0], [3, 1], [5, 0], [-5, -1]]

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })
    });


    cy.log('move first three points on curve 1')
    cy.window().then(async (win) => {

      throughPoints = [[-4, 6], [8, 9], [-3, 7], [-5, 5], [5, 7], [-5, 7],
      [-6, 4], [3, 1], [5, 0], [-7, 3]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move first three points on curve 2')
    cy.window().then(async (win) => {

      throughPoints = [[5, 6], [-1, -2], [6, -5], [4, 5], [5, 7], [-5, 7],
      [3, 4], [3, 1], [5, 0], [2, 3]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move first three points on curve 3')
    cy.window().then(async (win) => {

      throughPoints = [[4, -4], [-7, 7], [3, 3], [3, -5], [5, 7], [-5, 7],
      [2, -6], [3, 1], [5, 0], [1, -7]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });



    cy.log('move second three points on curve 1')
    cy.window().then(async (win) => {

      throughPoints = [[10, 2], [-7, 7], [3, 3], [9, 1], [-8, -2], [7, -3],
      [8, 0], [3, 1], [5, 0], [7, -1]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 4,
          throughPoint: throughPoints[4]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 5,
          throughPoint: throughPoints[5]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move second three points on curve 2')
    cy.window().then(async (win) => {

      throughPoints = [[1, 3], [-7, 7], [3, 3], [0, 2], [1, -3], [-2, -4],
      [-1, 1], [3, 1], [5, 0], [-2, 0]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 4,
          throughPoint: throughPoints[4]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 5,
          throughPoint: throughPoints[5]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move second three points on curve 3')
    cy.window().then(async (win) => {

      throughPoints = [[-4, -5], [-7, 7], [3, 3], [-5, -6], [-7, 8], [9, 0],
      [-6, -7], [3, 1], [5, 0], [-7, -8]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 4,
          throughPoint: throughPoints[4]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 5,
          throughPoint: throughPoints[5]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move third three points on curve 1')
    cy.window().then(async (win) => {

      throughPoints = [[-7, 10], [-7, 7], [3, 3], [-8, 9], [-7, 8], [9, 0],
      [-9, 8], [7, -6], [-5, -4], [-10, 7]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 6,
          throughPoint: throughPoints[6]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 7,
          throughPoint: throughPoints[7]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 8,
          throughPoint: throughPoints[8]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move third three points on curve 2')
    cy.window().then(async (win) => {

      throughPoints = [[4, 6], [-7, 7], [3, 3], [3, 5], [-7, 8], [9, 0],
      [2, 4], [3, -5], [5, -6], [1, 3]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 6,
          throughPoint: throughPoints[6]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 7,
          throughPoint: throughPoints[7]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 8,
          throughPoint: throughPoints[8]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log('move third three points on curve 3')
    cy.window().then(async (win) => {

      throughPoints = [[5, -4], [-7, 7], [3, 3], [4, -5], [-7, 8], [9, 0],
      [3, -6], [9, 2], [-7, -1], [2, -7]]

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 6,
          throughPoint: throughPoints[6]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 7,
          throughPoint: throughPoints[7]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 8,
          throughPoint: throughPoints[8]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });



    cy.log('move last point on curve 1')
    cy.window().then(async (win) => {

      throughPoints[0] = [-3, -5];
      throughPoints[3] = [-4, -6];
      throughPoints[6] = [-5, -7];
      throughPoints[9] = [-6, -8];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 9,
          throughPoint: throughPoints[9]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move last point on curve 2')
    cy.window().then(async (win) => {

      throughPoints[0] = [3, 6];
      throughPoints[3] = [2, 5];
      throughPoints[6] = [1, 4];
      throughPoints[9] = [0, 3];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 9,
          throughPoint: throughPoints[9]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });


    cy.log('move last point on curve 3')
    cy.window().then(async (win) => {

      throughPoints[0] = [5, -2];
      throughPoints[3] = [4, -3];
      throughPoints[6] = [3, -4];
      throughPoints[9] = [2, -5];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 9,
          throughPoint: throughPoints[9]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
    <controlVectors><copy prop="controlVector1_2" source="_curve1" /></controlVectors>
  </beziercontrols>
  </curve>
  </graph>
  <graph name="g2" newNamespace>
    <copy source="../_curve1" assignNames="curve" />
  </graph>

  <copy source="g2" assignNames="g3" />
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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        controlVectors,
      })
    });


    cy.log('move first and second control vectors of curve 1')
    cy.window().then(async (win) => {
      controlVectors = [
        [[4, -2], [-4, 2]],
        [[3, 5], [-3, -5]],
        [[-4, 2], [4, -2]],
      ];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: controlVectors[0][0]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });

    cy.log('move first and second control vectors of curve 2')
    cy.window().then(async (win) => {
      controlVectors = [
        [[-7, 9], [7, -9]],
        [[6, 1], [-6, -1]],
        [[7, -9], [-7, 9]],
      ];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [1, 1],
          controlVector: controlVectors[1][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });


    cy.log('move first and second control vectors of curve 3')
    cy.window().then(async (win) => {
      controlVectors = [
        [[-5, 1], [5, -1]],
        [[-2, -3], [2, 3]],
        [[5, -1], [-5, 1]],
      ];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [1, 0],
          controlVector: controlVectors[1][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });


    cy.log('move last control vector of curve 1')
    cy.window().then(async (win) => {
      controlVectors = [
        [[9, 10], [-9, -10]],
        [[-2, -3], [2, 3]],
        [[-9, -10], [9, 10]],
      ];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });


    cy.log('move last control vector of curve 2')
    cy.window().then(async (win) => {
      controlVectors = [
        [[-3, -7], [3, 7]],
        [[-2, -3], [2, 3]],
        [[3, 7], [-3, -7]],
      ];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        controlVectors,
      })

    });


    cy.log('move last control vector of curve 3')
    cy.window().then(async (win) => {
      controlVectors = [
        [[4, 6], [-4, -6]],
        [[-2, -3], [2, 3]],
        [[-4, -6], [4, 6]],
      ];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
    <controlVectors><copy prop="controlVector3_1" source="_curve1" /></controlVectors>
    <controlVectors>(-1,4)</controlVectors>
  </beziercontrols>
  </curve>
  </graph>

  <graph name="g2" newNamespace>
    <copy source="../_curve1" assignNames="curve" />
  </graph>

  <copy source="g2" assignNames="g3" />

  <p>Temp way to change controls 1:
  <choiceInput inline name="dir3" bindValueTo="$_curve1.vectorcontroldirection3" >
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
  <choiceInput inline name="dir3a" bindValueTo="$(g2/curve.vectorcontroldirection3)" >
  <copy source="choices" />
  </choiceInput>
  </p>

  <p>Temp way to change controls 3:
  <choiceInput inline name="dir3b" bindValueTo="$(g3/curve.vectorcontroldirection3)" >
  <copy source="choices" />
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
      let stateVariables = await win.returnAllStateVariables1();

      let cv3 = (stateVariables["/_curve1"].stateValues.controlVectors)[2][0];

      controlVectors[0][0][0] = controlVectors[2][0][0] = cv3[0];
      controlVectors[0][0][1] = controlVectors[2][0][1] = cv3[1];
      controlVectors[0][1][0] = controlVectors[2][1][0] = -controlVectors[0][0][0];
      controlVectors[0][1][1] = controlVectors[2][1][1] = -controlVectors[0][0][1];

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


    cy.log("can't move first control vector of curve 1")
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [9, 2]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });


    cy.log("can't move first control vector of curve 2")
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [-7, 6]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("can't move first control vector of curve 3")
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [0, 1],
          controlVector: [91, 11]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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

      directions[2] = "symmetric";
      controlVectors[0] = controlVectors[2] = [[3, 7], [-3, -7]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: controlVectors[0][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move first control vector of curve 2")
    cy.window().then(async (win) => {

      controlVectors[0] = controlVectors[2] = [[-5, 9], [5, -9]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move first control vector of curve 3")
    cy.window().then(async (win) => {

      controlVectors[0] = controlVectors[2] = [[-4, -3], [4, 3]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [0, 1],
          controlVector: controlVectors[0][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move third control vector of curve 1")
    cy.window().then(async (win) => {

      controlVectors[0] = controlVectors[2] = [[1, 9], [-1, -9]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move third control vector of curve 2")
    cy.window().then(async (win) => {

      controlVectors[0] = controlVectors[2] = [[-2, 8], [2, -8]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move third control vector of curve 3")
    cy.window().then(async (win) => {

      controlVectors[0] = controlVectors[2] = [[3, -7], [-3, 7]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
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
      (<copy prop="controlVectorX1_2_2" source="_curve1" />,
      5)
    </vector></controlVectors>
    <controlVectors direction="both">
      <vector>(3,4)</vector>
      <vector>
        (-<copy prop="controlVectorX2_1_2" source="_curve1" />,
        <copy prop="controlVectorX2_1_1" source="_curve1" />)
      </vector>
    </controlVectors>
    <controlVectors><vector>
      (<copy prop="controlVectorX4_1_2" source="_curve1" />,
      4)
    </vector></controlVectors>
    <controlVectors><vector>
      (<copy prop="controlVectorX3_1_2" source="_curve1" />,
      -2)
    </vector></controlVectors>
  </beziercontrols>
  </curve>
  </graph>
  
  <graph name="g2" newNamespace>
    <copy source="../_curve1" assignNames="curve" />
  </graph>

  <copy source="g2" assignNames="g3" />

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
      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log('move points')
    cy.window().then(async (win) => {

      throughPoints = [[-5, 7], [8, 3], [-2, -4], [6, -1]];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 0,
          throughPoint: throughPoints[0]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g2/curve",
        args: {
          throughPointInd: 1,
          throughPoint: throughPoints[1]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/g3/curve",
        args: {
          throughPointInd: 2,
          throughPoint: throughPoints[2]
        }
      })
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 3,
          throughPoint: throughPoints[3]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
      })

    });

    cy.log("move first control vector of curve 1")
    cy.window().then(async (win) => {

      controlVectors[0] = [[7, -7], [-7, 7]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [-9, -7]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move first control vector of curve 2")
    cy.window().then(async (win) => {

      controlVectors[0] = [[-1, 1], [1, -1]]

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [0, 1],
          controlVector: [5, -1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move second control vector of curve 3")
    cy.window().then(async (win) => {

      controlVectors[1] = [[6, -2], [2, 6]],

        await win.callAction1({
          actionName: "moveControlVector",
          componentName: "/g3/curve",
          args: {
            controlVectorInds: [1, 0],
            controlVector: controlVectors[1][0]
          }
        })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move second control vector of curve 1")
    cy.window().then(async (win) => {

      controlVectors[1] = [[-7, -8], [8, -7]],

        await win.callAction1({
          actionName: "moveControlVector",
          componentName: "/_curve1",
          args: {
            controlVectorInds: [1, 1],
            controlVector: controlVectors[1][1]
          }
        })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move third control vector of curve 2")
    cy.window().then(async (win) => {

      controlVectors[2] = [[-3, 5], [3, -5]];
      controlVectors[3] = [[5, -3], [-5, 3]];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [2, 0],
          controlVector: controlVectors[2][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move third control vector of curve 3")
    cy.window().then(async (win) => {

      controlVectors[2] = [[7, 6], [-7, -6]];
      controlVectors[3] = [[6, 7], [-6, -7]];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g3/curve",
        args: {
          controlVectorInds: [2, 1],
          controlVector: controlVectors[2][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move fourth control vector of curve 1")
    cy.window().then(async (win) => {

      controlVectors[2] = [[-1, -2], [1, 2]];
      controlVectors[3] = [[-2, -1], [2, 1]];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [3, 0],
          controlVector: controlVectors[3][0]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });

    cy.log("move fourth control vector of curve 2")
    cy.window().then(async (win) => {

      controlVectors[2] = [[1, -9], [-1, 9]];
      controlVectors[3] = [[-9, 1], [9, -1]];

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/g2/curve",
        args: {
          controlVectorInds: [3, 1],
          controlVector: controlVectors[3][1]
        }
      })

      let stateVariables = await win.returnAllStateVariables1();

      checkBezierCurve({
        curve: stateVariables['/_curve1'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g2/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
      checkBezierCurve({
        curve: stateVariables['/g3/curve'],
        throughPoints,
        directions,
        controlVectors,
      })
    });
  })

  it('copy props with propIndex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>n: <mathinput name="n" prefill="2" /></p>

  <graph name="g">
    <curve name="c" through="(1,2) (3,4) (-2,6) (-4,7) (2,9) (6,5)" >
      <bezierControls>
        (-1,0) (0,-1) (1,0) (0,-1) (-1,0) (-1,0)
      </bezierControls>
    </curve>
  </graph>
  
  <p><aslist><copy prop="throughPoints" source="c" propIndex="$n" assignNames="Pt1 Pt2" /></aslist></p>
  <p><aslist><copy prop="xCriticalPoints" source="c" propIndex="$n" assignNames="Px1 Px2" /></aslist></p>
  <p><aslist><copy prop="yCriticalPoints" source="c" propIndex="$n" assignNames="Py1 Py2 Py3 Py4" /></aslist></p>
  <p><aslist><copy prop="curvatureChangePoints" source="c" propIndex="$n" assignNames="Pc1 Pc2" /></aslist></p>

  <p><aslist><copy prop="throughPoint1" source="c" propIndex="$n" assignNames="t1 t2" /></aslist></p>
  <p><aslist><copy prop="xCriticalPoint1" source="c" propIndex="$n" assignNames="x1 x2" /></aslist></p>
  <p><aslist><copy prop="yCriticalPoint1" source="c" propIndex="$n" assignNames="y1 y2" /></aslist></p>
  <p><aslist><copy prop="curvatureChangePoint1" source="c" propIndex="$n" assignNames="c1 c2" /></aslist></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/Pt1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(3,4)")
    })
    cy.get('#\\/Px1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−4,7)")
    })
    cy.get('#\\/Py1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−2,6)")
    })
    cy.get('#\\/Pc1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(4,7)")
    })
    cy.get('#\\/t1 .mjx-mrow').eq(0).should('have.text', "2")
    cy.get('#\\/x1').should('have.text', "4")
    cy.get('#\\/y1').should('have.text', "2")
    cy.get('#\\/c1').should('have.text', "6")


    cy.log('set propIndex to 1')

    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true });

    cy.get('#\\/Px1 .mjx-mrow').should('contain.text', "(3,4)")
    cy.get('#\\/Pt1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(1,2)")
    })
    cy.get('#\\/Px1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(3,4)")
    })
    cy.get('#\\/Py1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(1,2)")
    })
    cy.get('#\\/Pc1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−2,6)")
    })
    cy.get('#\\/t1 .mjx-mrow').eq(0).should('have.text', "1")
    cy.get('#\\/x1').should('have.text', "3")
    cy.get('#\\/y1').should('have.text', "1")
    cy.get('#\\/c1').should('have.text', "-2")


    cy.log('erase propIndex')

    cy.get('#\\/n textarea').type("{end}{backspace}{enter}", { force: true });

    cy.get('#\\/Pt1').should('not.exist');
    cy.get('#\\/Pt2').should('not.exist');

    cy.get('#\\/Px1').should('not.exist');
    cy.get('#\\/Px2').should('not.exist');

    cy.get('#\\/Py1').should('not.exist');
    cy.get('#\\/Py2').should('not.exist');
    cy.get('#\\/Py3').should('not.exist');
    cy.get('#\\/Py4').should('not.exist');

    cy.get('#\\/Pc1').should('not.exist');
    cy.get('#\\/Pc2').should('not.exist');

    cy.get('#\\/t1').should('not.exist');
    cy.get('#\\/x1').should('not.exist');
    cy.get('#\\/y1').should('not.exist');
    cy.get('#\\/c1').should('not.exist');


    cy.log('set propIndex to 4')

    cy.get('#\\/n textarea').type("4{enter}", { force: true });

    cy.get('#\\/Py1 .mjx-mrow').should('contain.text', "(6,5)")
    cy.get('#\\/Px1 .mjx-mrow').should('not.exist')
    cy.get('#\\/Pt1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−4,7)")
    })
    cy.get('#\\/Py1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(6,5)")
    })
    cy.get('#\\/Pc1 .mjx-mrow').should('not.exist')
    cy.get('#\\/t1').should('not.exist')
    cy.get('#\\/x1').should('not.exist')
    cy.get('#\\/y1').should('not.exist')
    cy.get('#\\/c1').should('not.exist')


  })

  it('copy props with propIndex, dot and array notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>n: <mathinput name="n" prefill="2" /></p>

  <graph name="g">
    <curve name="c" through="(1,2) (3,4) (-2,6) (-4,7) (2,9) (6,5)" >
      <bezierControls>
        (-1,0) (0,-1) (1,0) (0,-1) (-1,0) (-1,0)
      </bezierControls>
    </curve>
  </graph>
  
  <p><aslist><copy source="c.throughPoints[$n]" assignNames="Pt1 Pt2" /></aslist></p>
  <p><aslist><copy source="c.xCriticalPoints[$n]" assignNames="Px1 Px2" /></aslist></p>
  <p><aslist><copy source="c.yCriticalPoints[$n]" assignNames="Py1 Py2 Py3 Py4" /></aslist></p>
  <p><aslist><copy source="c.curvatureChangePoints[$n]" assignNames="Pc1 Pc2" /></aslist></p>

  <p><aslist><copy source="c.throughPoint1[$n]" assignNames="t1 t2" /></aslist></p>
  <p><aslist><copy source="c.xCriticalPoint1[$n]" assignNames="x1 x2" /></aslist></p>
  <p><aslist><copy source="c.yCriticalPoint1[$n]" assignNames="y1 y2" /></aslist></p>
  <p><aslist><copy source="c.curvatureChangePoint1[$n]" assignNames="c1 c2" /></aslist></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/Pt1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(3,4)")
    })
    cy.get('#\\/Px1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−4,7)")
    })
    cy.get('#\\/Py1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−2,6)")
    })
    cy.get('#\\/Pc1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(4,7)")
    })
    cy.get('#\\/t1 .mjx-mrow').eq(0).should('have.text', "2")
    cy.get('#\\/x1').should('have.text', "4")
    cy.get('#\\/y1').should('have.text', "2")
    cy.get('#\\/c1').should('have.text', "6")


    cy.log('set propIndex to 1')

    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true });

    cy.get('#\\/Px1 .mjx-mrow').should('contain.text', "(3,4)")
    cy.get('#\\/Pt1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(1,2)")
    })
    cy.get('#\\/Px1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(3,4)")
    })
    cy.get('#\\/Py1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(1,2)")
    })
    cy.get('#\\/Pc1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−2,6)")
    })
    cy.get('#\\/t1 .mjx-mrow').eq(0).should('have.text', "1")
    cy.get('#\\/x1').should('have.text', "3")
    cy.get('#\\/y1').should('have.text', "1")
    cy.get('#\\/c1').should('have.text', "-2")


    cy.log('erase propIndex')

    cy.get('#\\/n textarea').type("{end}{backspace}{enter}", { force: true });

    cy.get('#\\/Pt1').should('not.exist');
    cy.get('#\\/Pt2').should('not.exist');

    cy.get('#\\/Px1').should('not.exist');
    cy.get('#\\/Px2').should('not.exist');

    cy.get('#\\/Py1').should('not.exist');
    cy.get('#\\/Py2').should('not.exist');
    cy.get('#\\/Py3').should('not.exist');
    cy.get('#\\/Py4').should('not.exist');

    cy.get('#\\/Pc1').should('not.exist');
    cy.get('#\\/Pc2').should('not.exist');

    cy.get('#\\/t1').should('not.exist');
    cy.get('#\\/x1').should('not.exist');
    cy.get('#\\/y1').should('not.exist');
    cy.get('#\\/c1').should('not.exist');


    cy.log('set propIndex to 4')

    cy.get('#\\/n textarea').type("4{enter}", { force: true });

    cy.get('#\\/Py1 .mjx-mrow').should('contain.text', "(6,5)")
    cy.get('#\\/Px1 .mjx-mrow').should('not.exist')
    cy.get('#\\/Pt1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−4,7)")
    })
    cy.get('#\\/Py1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(6,5)")
    })
    cy.get('#\\/Pc1 .mjx-mrow').should('not.exist')
    cy.get('#\\/t1').should('not.exist')
    cy.get('#\\/x1').should('not.exist')
    cy.get('#\\/y1').should('not.exist')
    cy.get('#\\/c1').should('not.exist')


  })

  it('copy props with multidimensional propIndex, dot and array notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>n: <mathinput name="n" prefill="2" /></p>

  <graph name="g">
    <curve name="c" through="(1,2) (3,4) (-2,6) (-4,7) (2,9) (6,5)" >
      <bezierControls>
        (-1,0) (0,-1) (1,0) (0,-1) (-1,0) (-1,0)
      </bezierControls>
    </curve>
  </graph>
  
  <p><aslist><copy source="c.throughPoints[$n]" assignNames="Pt1 Pt2" /></aslist></p>
  <p><aslist><copy source="c.xCriticalPoints[$n]" assignNames="Px1 Px2" /></aslist></p>
  <p><aslist><copy source="c.yCriticalPoints[$n]" assignNames="Py1 Py2 Py3 Py4" /></aslist></p>
  <p><aslist><copy source="c.curvatureChangePoints[$n]" assignNames="Pc1 Pc2" /></aslist></p>

  <p><aslist><copy source="c.throughPoints[1][$n]" assignNames="t1 t2" /></aslist></p>
  <p><aslist><copy source="c.xCriticalPoints[1][$n]" assignNames="x1 x2" /></aslist></p>
  <p><aslist><copy source="c.yCriticalPoints[1][$n]" assignNames="y1 y2" /></aslist></p>
  <p><aslist><copy source="c.curvatureChangePoints[1][$n]" assignNames="c1 c2" /></aslist></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/Pt1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(3,4)")
    })
    cy.get('#\\/Px1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−4,7)")
    })
    cy.get('#\\/Py1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−2,6)")
    })
    cy.get('#\\/Pc1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(4,7)")
    })
    cy.get('#\\/t1 .mjx-mrow').eq(0).should('have.text', "2")
    cy.get('#\\/x1').should('have.text', "4")
    cy.get('#\\/y1').should('have.text', "2")
    cy.get('#\\/c1').should('have.text', "6")


    cy.log('set propIndex to 1')

    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true });

    cy.get('#\\/Px1 .mjx-mrow').should('contain.text', "(3,4)")
    cy.get('#\\/Pt1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(1,2)")
    })
    cy.get('#\\/Px1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(3,4)")
    })
    cy.get('#\\/Py1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(1,2)")
    })
    cy.get('#\\/Pc1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−2,6)")
    })
    cy.get('#\\/t1 .mjx-mrow').eq(0).should('have.text', "1")
    cy.get('#\\/x1').should('have.text', "3")
    cy.get('#\\/y1').should('have.text', "1")
    cy.get('#\\/c1').should('have.text', "-2")


    cy.log('erase propIndex')

    cy.get('#\\/n textarea').type("{end}{backspace}{enter}", { force: true });

    cy.get('#\\/Pt1').should('not.exist');
    cy.get('#\\/Pt2').should('not.exist');

    cy.get('#\\/Px1').should('not.exist');
    cy.get('#\\/Px2').should('not.exist');

    cy.get('#\\/Py1').should('not.exist');
    cy.get('#\\/Py2').should('not.exist');
    cy.get('#\\/Py3').should('not.exist');
    cy.get('#\\/Py4').should('not.exist');

    cy.get('#\\/Pc1').should('not.exist');
    cy.get('#\\/Pc2').should('not.exist');

    cy.get('#\\/t1').should('not.exist');
    cy.get('#\\/x1').should('not.exist');
    cy.get('#\\/y1').should('not.exist');
    cy.get('#\\/c1').should('not.exist');


    cy.log('set propIndex to 4')

    cy.get('#\\/n textarea').type("4{enter}", { force: true });

    cy.get('#\\/Py1 .mjx-mrow').should('contain.text', "(6,5)")
    cy.get('#\\/Px1 .mjx-mrow').should('not.exist')
    cy.get('#\\/Pt1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−4,7)")
    })
    cy.get('#\\/Py1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(6,5)")
    })
    cy.get('#\\/Pc1 .mjx-mrow').should('not.exist')
    cy.get('#\\/t1').should('not.exist')
    cy.get('#\\/x1').should('not.exist')
    cy.get('#\\/y1').should('not.exist')
    cy.get('#\\/c1').should('not.exist')


  })

  it('copy control vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph name="g">
    <curve name="c" through="(1,2) (3,4) (-2,6)" >
      <bezierControls>
        (-1,0)
        <controlVectors direction="both">(0,-1) (-1, 0)</controlVectors>
        (1,0)
      </bezierControls>
    </curve>
  </graph>
  
  <p><aslist><copy prop="controlVectors" source="c" assignNames="cv1 cv2 cv3 cv4 cv5 cv6" /></aslist></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/cv1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−1,0)")
    })
    cy.get('#\\/cv2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(1,0)")
    })
    cy.get('#\\/cv3 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(0,−1)")
    })
    cy.get('#\\/cv4 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−1,0)")
    })
    cy.get('#\\/cv5 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(1,0)")
    })
    cy.get('#\\/cv6 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−1,0)")
    })

    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/c",
        args: {
          controlVectorInds: [0, 1],
          controlVector: [2, 1]
        }
      })

      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/c",
        args: {
          controlVectorInds: [1, 0],
          controlVector: [3,-5]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/c",
        args: {
          controlVectorInds: [1, 1],
          controlVector: [2,-4]
        }
      })
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/c",
        args: {
          controlVectorInds: [2, 0],
          controlVector: [-2,-6]
        }
      })
    })


    cy.get('#\\/cv6 .mjx-mrow').should('contain.text', "(2,6)");
    cy.get('#\\/cv1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−2,−1)")
    })
    cy.get('#\\/cv2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(2,1)")
    })
    cy.get('#\\/cv3 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(3,−5)")
    })
    cy.get('#\\/cv4 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(2,−4)")
    })
    cy.get('#\\/cv5 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(−2,−6)")
    })
    cy.get('#\\/cv6 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(2,6)")
    })

  })

});