describe('Graph Reference Test', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('(slow)graph referenced multiple ways', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="graphA">
      <point name="pointA">(1,2)</point>
      <point name="pointB">(-2,4)</point>
      <line name="lineA">y=x+1</line>
      <line name="lineB" through="$pointA $pointB" />
      <copy name="pointC" target="pointA" />
      <point name="pointD" x="$(pointA{prop='x'})" y="$(pointB{prop='y'})" />
      <copy name="lineC" target="lineA" />
      <copy name="lineD" target="lineB" />
      <intersection name="pointE"><copy target="lineA" /><copy target="lineB" /></intersection>
    </graph>

    <graph name="graphB">
      $pointA$pointB$lineA$lineB$pointC$pointD$lineC$lineD$pointE
    </graph>

    <copy name="graphC" target="graphA" />

    <copy name="graphD" target="graphB" />

    <copy name="graphE" target="graphC" />

    <copy name="graphF" target="graphD" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let graphB = stateVariables["/graphB"];
      let graphC = stateVariables["/graphC"].replacements[0];
      let graphD = stateVariables["/graphD"].replacements[0];
      let graphE = stateVariables["/graphE"].replacements[0];
      let graphF = stateVariables["/graphF"].replacements[0];
      let pointsA = [
        '/pointA', 
        stateVariables['/pointC'].replacements[0].componentName,
        graphB.activeChildren[0].componentName,
        graphB.activeChildren[4].componentName,
        graphC.activeChildren[0].componentName,
        graphC.activeChildren[4].componentName,
        graphD.activeChildren[0].componentName,
        graphD.activeChildren[4].componentName,
        graphE.activeChildren[0].componentName,
        graphE.activeChildren[4].componentName,
        graphF.activeChildren[0].componentName,
        graphF.activeChildren[4].componentName,
      ];

      let pointsB = [
        '/pointB',
        graphB.activeChildren[1].componentName,
        graphC.activeChildren[1].componentName,
        graphD.activeChildren[1].componentName,
        graphE.activeChildren[1].componentName,
        graphF.activeChildren[1].componentName,
      ];

      let pointsD = [
        '/pointD',
        graphB.activeChildren[5].componentName,
        graphC.activeChildren[5].componentName,
        graphD.activeChildren[5].componentName,
        graphE.activeChildren[5].componentName,
        graphF.activeChildren[5].componentName,
      ];

      let pointsE = [
        stateVariables['/pointE'].replacements[0].componentName,
        graphB.activeChildren[8].componentName,
        graphC.activeChildren[8].componentName,
        graphD.activeChildren[8].componentName,
        graphE.activeChildren[8].componentName,
        graphF.activeChildren[8].componentName,
      ];

      let linesA = [
        '/lineA', 
        stateVariables['/lineC'].replacements[0].componentName,
        graphB.activeChildren[2].componentName,
        graphB.activeChildren[6].componentName,
        graphC.activeChildren[2].componentName,
        graphC.activeChildren[6].componentName,
        graphD.activeChildren[2].componentName,
        graphD.activeChildren[6].componentName,
        graphE.activeChildren[2].componentName,
        graphE.activeChildren[6].componentName,
        graphF.activeChildren[2].componentName,
        graphF.activeChildren[6].componentName,
      ];


      let linesB = [
        '/lineB', 
        stateVariables['/lineD'].replacements[0].componentName,
        graphB.activeChildren[3].componentName,
        graphB.activeChildren[7].componentName,
        graphC.activeChildren[3].componentName,
        graphC.activeChildren[7].componentName,
        graphD.activeChildren[3].componentName,
        graphD.activeChildren[7].componentName,
        graphE.activeChildren[3].componentName,
        graphE.activeChildren[7].componentName,
        graphF.activeChildren[3].componentName,
        graphF.activeChildren[7].componentName,
      ];
      
      let pointAx = 1;
      let pointAy = 2;
      let pointBx = -2;
      let pointBy = 4;
      let slopeA = 1;
      let xinterceptA = -1;
      let yinterceptA = 1;
      let slopeB = (pointBy - pointAy) / (pointBx - pointAx);
      let xinterceptB = -pointAy / slopeB + pointAx;
      let yinterceptB = pointAy - slopeB * pointAx;
      let pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
      let pointEy = slopeA * pointEx + yinterceptA;


      cy.log(`check original configuration`);
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        for (let point of pointsA) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })

      cy.log(`move points and line in first graph`);
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        pointAx = -3;
        pointAy = 6;
        pointBx = 4;
        pointBy = -2;
        await win.callAction1({
        actionName: "movePoint",
        componentName: "/pointA",
        args: { x: pointAx, y: pointAy }
      });
        await win.callAction1({
        actionName: "movePoint",
        componentName: "/pointB",
        args: { x: pointBx, y: pointBy }
      });

        let moveUp = -3;
        let point1coords = [
          (stateVariables['/lineA'].stateValues.points)[0][0],
          (stateVariables['/lineA'].stateValues.points)[0][1],
        ];
        let point2coords = [
          (stateVariables['/lineA'].stateValues.points)[1][0],
          (stateVariables['/lineA'].stateValues.points)[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        await win.callAction1({
        actionName: "moveLine",
        componentName: "/lineA",
        args: {
          point1coords: point1coords,
          point2coords: point2coords
        }
      });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;

        for (let point of pointsA) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })


      cy.log(`move shadow points and line in second graph`);
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let pointDx = 3;
        let pointDy = 2;
        let pointCy = -9;

        await stateVariables[pointsD[1]].movePoint({ x: pointDx, y: pointDy });
        await stateVariables[pointsA[3]].movePoint({ x: pointDx, y: pointCy });

        pointAx = pointDx;
        pointAy = pointCy;
        pointBy = pointDy;

        let moveUp = 8;
        let lineA3Points = await stateVariables[linesA[3]].stateValues.points;
        let point1coords = [
          lineA3Points[0][0],
          lineA3Points[0][1],
        ];
        let point2coords = [
          lineA3Points[1][0],
          lineA3Points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        await stateVariables[linesA[3]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;


        for (let point of pointsA) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })


      cy.log(`move both shadow lines in third graph`);
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let moveUp = -4;
        let lineA5points = await stateVariables[linesA[5]].stateValues.points;
        let point1coords = [
          lineA5points[0][0],
          lineA5points[0][1],
        ];
        let point2coords = [
          lineA5points[1][0],
          lineA5points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        await stateVariables[linesA[5]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;


        let moveX = 3;
        let moveY = 2;
        let lineB5points = await stateVariables[linesB[5]].stateValues.points;
        point1coords = [
          lineB5points[0][0],
          lineB5points[0][1],
        ];
        point2coords = [
          lineB5points[1][0],
          lineB5points[1][1],
        ];
        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);
        await stateVariables[linesB[5]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        pointAx += moveX;
        pointAy += moveY;
        pointBx += moveX;
        pointBy += moveY;

        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;


        for (let point of pointsA) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })


      cy.log(`move shadow points and line in fourth graph`);
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let pointDx = -5;
        let pointDy = -1;
        let pointCy = 5;

        await stateVariables[pointsA[7]].movePoint({ x: pointDx, y: pointCy });
        await stateVariables[pointsD[3]].movePoint({ x: pointDx, y: pointDy });

        pointAx = pointDx;
        pointAy = pointCy;
        pointBy = pointDy;

        let moveUp = 1;
        let lineA7points = await stateVariables[linesA[7]].stateValues.points;
        let point1coords = [
          lineA7points[0][0],
          lineA7points[0][1],
        ];
        let point2coords = [
          lineA7points[1][0],
          lineA7points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        await stateVariables[linesA[7]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;


        for (let point of pointsA) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })


      cy.log(`move points and line in fifth graph`);
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        pointAx = 7;
        pointAy = -7;
        pointBx = -8;
        pointBy = 9;
        await stateVariables[pointsA[8]].movePoint({ x: pointAx, y: pointAy });
        await stateVariables[pointsB[4]].movePoint({ x: pointBx, y: pointBy });

        let moveUp = -3;
        let lineA8points = await stateVariables[linesA[8]].stateValues.points;
        let point1coords = [
          lineA8points[0][0],
          lineA8points[0][1],
        ];
        let point2coords = [
          lineA8points[1][0],
          lineA8points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        await stateVariables[linesA[8]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;
        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;

        for (let point of pointsA) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })


      cy.log(`move both shadow lines in sixth graph`);
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let moveUp = -2;
        let lineA11points = await stateVariables[linesA[11]].stateValues.points;
        let point1coords = [
          lineA11points[0][0],
          lineA11points[0][1],
        ];
        let point2coords = [
          lineA11points[1][0],
          lineA11points[1][1],
        ];
        point1coords[1] = point1coords[1].add(moveUp);
        point2coords[1] = point2coords[1].add(moveUp);
        await stateVariables[linesA[11]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        xinterceptA -= moveUp;
        yinterceptA += moveUp;;


        let moveX = -1;
        let moveY = 3;
        let lineB11points = await stateVariables[linesB[11]].stateValues.points;
        point1coords = [
          lineB11points[0][0],
          lineB11points[0][1],
        ];
        point2coords = [
          lineB11points[1][0],
          lineB11points[1][1],
        ];
        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);
        await stateVariables[linesB[11]].moveLine({
          point1coords: point1coords,
          point2coords: point2coords
        });

        pointAx += moveX;
        pointAy += moveY;
        pointBx += moveX;
        pointBy += moveY;

        slopeB = (pointBy - pointAy) / (pointBx - pointAx);
        xinterceptB = -pointAy / slopeB + pointAx;
        yinterceptB = pointAy - slopeB * pointAx;
        pointEx = (yinterceptB - yinterceptA) / (slopeA - slopeB);
        pointEy = slopeA * pointEx + yinterceptA;


        for (let point of pointsA) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointAy, 1E-12);
        }
        for (let point of pointsB) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointBx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsD) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointAx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointBy, 1E-12);
        }
        for (let point of pointsE) {
          expect(stateVariables[point].stateValues.xs[0].tree).closeTo(pointEx, 1E-12);
          expect(stateVariables[point].stateValues.xs[1].tree).closeTo(pointEy, 1E-12);
        }
        for (let line of linesA) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeA, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
        }
        for (let line of linesB) {
          expect((stateVariables[line].stateValues.slope).evaluate_to_constant()).closeTo(slopeB, 1E-12);
          expect((stateVariables[line].stateValues.xintercept).evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
          expect((stateVariables[line].stateValues.yintercept).evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
        }
      })

    });
  });

});