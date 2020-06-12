describe('Graph Reference Test', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('(slow)graph referenced multiple ways', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="graphA">
      <point name="pointA">(1,2)</point>
      <point name="pointB">(-2,4)</point>
      <line name="lineA">y=x+1</line>
      <line name="lineB"><through><ref>pointA</ref><ref>pointB</ref></through></line>
      <ref name="pointC">pointA</ref>
      <point name="pointD"><coords>
        (<ref prop="x">pointA</ref>, <ref prop="y">pointB</ref>)
      </coords></point>
      <ref name="lineC">lineA</ref>
      <ref name="lineD">lineB</ref>
      <intersection name="pointE"><ref>lineA</ref><ref>lineB</ref></intersection>
    </graph>

    <graph name="graphB">
      <ref>pointA</ref>
      <ref>pointB</ref>
      <ref>lineA</ref>
      <ref>lineB</ref>
      <ref>pointC</ref>
      <ref>pointD</ref>
      <ref>lineC</ref>
      <ref>lineD</ref>
      <ref>pointE</ref>
    </graph>

    <ref name="graphC">graphA</ref>

    <ref name="graphD">graphB</ref>

    <ref name="graphE">graphC</ref>

    <ref name="graphF">graphD</ref>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let pointsA = ['/pointa', '__point3', '__point5', '__point7', '__point10',
      '__point12', '__point15', '__point17', '__point20', '__point22',
      '__point25', '__point27'];
    let pointsB = ['/pointb', '__point6', '__point11', '__point16',
      '__point21', '__point26'];
    let pointsD = ['/pointd', '__point8', '__point13', '__point18',
      '__point23', '__point28'];
    let pointsE = ['__point4', '__point9', '__point14', '__point19',
      '__point24', '__point29'];
    let linesA = ['/linea', '__line1', '__line5', '__line7', '__line9', '__line11',
      '__line13', '__line15', '__line17', '__line19', '__line21', '__line23'];
    let linesB = ['/lineb', '__line2', '__line6', '__line8', '__line10', '__line12',
      '__line14', '__line16', '__line18', '__line20', '__line22', '__line24'];


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
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let point of pointsA) {
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointAy, 1E-12);
      }
      for (let point of pointsB) {
        expect(components[point].state.xs[0].tree).closeTo(pointBx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsD) {
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsE) {
        expect(components[point].state.xs[0].tree).closeTo(pointEx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointEy, 1E-12);
      }
      for (let line of linesA) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
      }
      for (let line of linesB) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
      }
    })

    cy.log(`move points and line in first graph`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      pointAx = -3;
      pointAy = 6;
      pointBx = 4;
      pointBy = -2;
      components['/pointa'].movePoint({ x: pointAx, y: pointAy });
      components['/pointb'].movePoint({ x: pointBx, y: pointBy });

      let moveUp = -3;
      let point1coords = [
        components['/linea'].state.points[0].get_component(0),
        components['/linea'].state.points[0].get_component(1),
      ];
      let point2coords = [
        components['/linea'].state.points[1].get_component(0),
        components['/linea'].state.points[1].get_component(1),
      ];
      point1coords[1] = point1coords[1].add(moveUp);
      point2coords[1] = point2coords[1].add(moveUp);
      components['/linea'].moveLine({
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
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointAy, 1E-12);
      }
      for (let point of pointsB) {
        expect(components[point].state.xs[0].tree).closeTo(pointBx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsD) {
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsE) {
        expect(components[point].state.xs[0].tree).closeTo(pointEx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointEy, 1E-12);
      }
      for (let line of linesA) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
      }
      for (let line of linesB) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
      }
    })


    cy.log(`move shadow points and line in second graph`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let pointDx = 3;
      let pointDy = 2;
      let pointCy = -9;

      components.__point8.movePoint({ x: pointDx, y: pointDy });
      components.__point7.movePoint({ x: pointDx, y: pointCy });

      pointAx = pointDx;
      pointAy = pointCy;
      pointBy = pointDy;

      let moveUp = 8;
      let point1coords = [
        components.__line7.state.points[0].get_component(0),
        components.__line7.state.points[0].get_component(1),
      ];
      let point2coords = [
        components.__line7.state.points[1].get_component(0),
        components.__line7.state.points[1].get_component(1),
      ];
      point1coords[1] = point1coords[1].add(moveUp);
      point2coords[1] = point2coords[1].add(moveUp);
      components.__line7.moveLine({
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
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointAy, 1E-12);
      }
      for (let point of pointsB) {
        expect(components[point].state.xs[0].tree).closeTo(pointBx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsD) {
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsE) {
        expect(components[point].state.xs[0].tree).closeTo(pointEx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointEy, 1E-12);
      }
      for (let line of linesA) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
      }
      for (let line of linesB) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
      }
    })


    cy.log(`move both shadow lines in third graph`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let moveUp = -4;
      let point1coords = [
        components.__line11.state.points[0].get_component(0),
        components.__line11.state.points[0].get_component(1),
      ];
      let point2coords = [
        components.__line11.state.points[1].get_component(0),
        components.__line11.state.points[1].get_component(1),
      ];
      point1coords[1] = point1coords[1].add(moveUp);
      point2coords[1] = point2coords[1].add(moveUp);
      components.__line11.moveLine({
        point1coords: point1coords,
        point2coords: point2coords
      });

      xinterceptA -= moveUp;
      yinterceptA += moveUp;;


      let moveX = 3;
      let moveY = 2;
      point1coords = [
        components.__line12.state.points[0].get_component(0),
        components.__line12.state.points[0].get_component(1),
      ];
      point2coords = [
        components.__line12.state.points[1].get_component(0),
        components.__line12.state.points[1].get_component(1),
      ];
      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);
      components.__line12.moveLine({
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
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointAy, 1E-12);
      }
      for (let point of pointsB) {
        expect(components[point].state.xs[0].tree).closeTo(pointBx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsD) {
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsE) {
        expect(components[point].state.xs[0].tree).closeTo(pointEx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointEy, 1E-12);
      }
      for (let line of linesA) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
      }
      for (let line of linesB) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
      }
    })


    cy.log(`move shadow points and line in fourth graph`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let pointDx = -5;
      let pointDy = -1;
      let pointCy = 5;

      components.__point17.movePoint({ x: pointDx, y: pointCy });
      components.__point18.movePoint({ x: pointDx, y: pointDy });

      pointAx = pointDx;
      pointAy = pointCy;
      pointBy = pointDy;

      let moveUp = 1;
      let point1coords = [
        components.__line15.state.points[0].get_component(0),
        components.__line15.state.points[0].get_component(1),
      ];
      let point2coords = [
        components.__line15.state.points[1].get_component(0),
        components.__line15.state.points[1].get_component(1),
      ];
      point1coords[1] = point1coords[1].add(moveUp);
      point2coords[1] = point2coords[1].add(moveUp);
      components.__line15.moveLine({
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
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointAy, 1E-12);
      }
      for (let point of pointsB) {
        expect(components[point].state.xs[0].tree).closeTo(pointBx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsD) {
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsE) {
        expect(components[point].state.xs[0].tree).closeTo(pointEx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointEy, 1E-12);
      }
      for (let line of linesA) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
      }
      for (let line of linesB) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
      }
    })


    cy.log(`move points and line in fifth graph`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      pointAx = 7;
      pointAy = -7;
      pointBx = -8;
      pointBy = 9;
      components.__point20.movePoint({ x: pointAx, y: pointAy });
      components.__point21.movePoint({ x: pointBx, y: pointBy });

      let moveUp = -3;
      let point1coords = [
        components.__line17.state.points[0].get_component(0),
        components.__line17.state.points[0].get_component(1),
      ];
      let point2coords = [
        components.__line17.state.points[1].get_component(0),
        components.__line17.state.points[1].get_component(1),
      ];
      point1coords[1] = point1coords[1].add(moveUp);
      point2coords[1] = point2coords[1].add(moveUp);
      components.__line17.moveLine({
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
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointAy, 1E-12);
      }
      for (let point of pointsB) {
        expect(components[point].state.xs[0].tree).closeTo(pointBx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsD) {
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsE) {
        expect(components[point].state.xs[0].tree).closeTo(pointEx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointEy, 1E-12);
      }
      for (let line of linesA) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
      }
      for (let line of linesB) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
      }
    })


    cy.log(`move both shadow lines in sixth graph`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let moveUp = -2;
      let point1coords = [
        components.__line23.state.points[0].get_component(0),
        components.__line23.state.points[0].get_component(1),
      ];
      let point2coords = [
        components.__line23.state.points[1].get_component(0),
        components.__line23.state.points[1].get_component(1),
      ];
      point1coords[1] = point1coords[1].add(moveUp);
      point2coords[1] = point2coords[1].add(moveUp);
      components.__line23.moveLine({
        point1coords: point1coords,
        point2coords: point2coords
      });

      xinterceptA -= moveUp;
      yinterceptA += moveUp;;


      let moveX = -1;
      let moveY = 3;
      point1coords = [
        components.__line24.state.points[0].get_component(0),
        components.__line24.state.points[0].get_component(1),
      ];
      point2coords = [
        components.__line24.state.points[1].get_component(0),
        components.__line24.state.points[1].get_component(1),
      ];
      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);
      components.__line24.moveLine({
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
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointAy, 1E-12);
      }
      for (let point of pointsB) {
        expect(components[point].state.xs[0].tree).closeTo(pointBx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsD) {
        expect(components[point].state.xs[0].tree).closeTo(pointAx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointBy, 1E-12);
      }
      for (let point of pointsE) {
        expect(components[point].state.xs[0].tree).closeTo(pointEx, 1E-12);
        expect(components[point].state.xs[1].tree).closeTo(pointEy, 1E-12);
      }
      for (let line of linesA) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeA, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptA, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptA, 1E-12);
      }
      for (let line of linesB) {
        expect(components[line].state.slope.evaluate_to_constant()).closeTo(slopeB, 1E-12);
        expect(components[line].state.xintercept.evaluate_to_constant()).closeTo(xinterceptB, 1E-12);
        expect(components[line].state.yintercept.evaluate_to_constant()).closeTo(yinterceptB, 1E-12);
      }
    })

  });

});