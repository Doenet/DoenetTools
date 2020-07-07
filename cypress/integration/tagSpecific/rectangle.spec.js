describe('Rectangle Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('rectangle with no parameters gives unit square', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <rectangle/>
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_rectangle1" />
    <point>(<copy prop="radius" tname="_circle1" />, 0)</point>
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerpoint"].replacements[0];
      let radiusNumber = components["/radiusnumber"].replacements[0];
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_circle1'].stateValues.center.tree).eqls(["vector", 0, 0]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([0, 0]);
        expect(components['/_circle1'].stateValues.radius.tree).eq(1);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(1);
        expect(circle2.stateValues.center.tree).eqls(["vector", 0, 0]);
        expect(circle2.stateValues.numericalCenter).eqls([0, 0]);
        expect(circle2.stateValues.radius.tree).eq(1);
        expect(circle2.stateValues.numericalRadius).eq(1);
        expect(circle3.stateValues.center.tree).eqls(["vector", 0, 0]);
        expect(circle3.stateValues.numericalCenter).eqls([0, 0]);
        expect(circle3.stateValues.radius.tree).eq(1);
        expect(circle3.stateValues.numericalRadius).eq(1);
        expect(centerPoint.stateValues.xs[0].tree).eq(0);
        expect(centerPoint.stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(1);
      })

      cy.log("move circle")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_circle1'].moveCircle({ center: [2, 3] });
        expect(components['/_circle1'].stateValues.center.tree).eqls(["vector", 2, 3]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([2, 3]);
        expect(components['/_circle1'].stateValues.radius.tree).eq(1);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(1);
        expect(circle2.stateValues.center.tree).eqls(["vector", 2, 3]);
        expect(circle2.stateValues.numericalCenter).eqls([2, 3]);
        expect(circle2.stateValues.radius.tree).eq(1);
        expect(circle2.stateValues.numericalRadius).eq(1);
        expect(circle3.stateValues.center.tree).eqls(["vector", 2, 3]);
        expect(circle3.stateValues.numericalCenter).eqls([2, 3]);
        expect(circle3.stateValues.radius.tree).eq(1);
        expect(circle3.stateValues.numericalRadius).eq(1);
        expect(centerPoint.stateValues.xs[0].tree).eq(2);
        expect(centerPoint.stateValues.xs[1].tree).eq(3);
        expect(radiusNumber.stateValues.value.tree).eq(1);
      })


      cy.log("change radius")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components['/_point1'].movePoint({ x: 5, y: 0 });
        expect(components['/_circle1'].stateValues.center.tree).eqls(["vector", 2, 3]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([2, 3]);
        expect(components['/_circle1'].stateValues.radius.tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.tree).eqls(["vector", 2, 3]);
        expect(circle2.stateValues.numericalCenter).eqls([2, 3]);
        expect(circle2.stateValues.radius.tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.tree).eqls(["vector", 2, 3]);
        expect(circle3.stateValues.numericalCenter).eqls([2, 3]);
        expect(circle3.stateValues.radius.tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect(centerPoint.stateValues.xs[0].tree).eq(2);
        expect(centerPoint.stateValues.xs[1].tree).eq(3);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })

      cy.log("change center")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        centerPoint.movePoint({ x: -6, y: -2 });
        expect(components['/_circle1'].stateValues.center.tree).eqls(["vector", -6, -2]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([-6, -2]);
        expect(components['/_circle1'].stateValues.radius.tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.tree).eqls(["vector", -6, -2]);
        expect(circle2.stateValues.numericalCenter).eqls([-6, -2]);
        expect(circle2.stateValues.radius.tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.tree).eqls(["vector", -6, -2]);
        expect(circle3.stateValues.numericalCenter).eqls([-6, -2]);
        expect(circle3.stateValues.radius.tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect(centerPoint.stateValues.xs[0].tree).eq(-6);
        expect(centerPoint.stateValues.xs[1].tree).eq(-2);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })

      cy.log("move circle2")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        circle2.moveCircle({ center: [-7, 9] });
        expect(components['/_circle1'].stateValues.center.tree).eqls(["vector", -7, 9]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([-7, 9]);
        expect(components['/_circle1'].stateValues.radius.tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.tree).eqls(["vector", -7, 9]);
        expect(circle2.stateValues.numericalCenter).eqls([-7, 9]);
        expect(circle2.stateValues.radius.tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.tree).eqls(["vector", -7, 9]);
        expect(circle3.stateValues.numericalCenter).eqls([-7, 9]);
        expect(circle3.stateValues.radius.tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect(centerPoint.stateValues.xs[0].tree).eq(-7);
        expect(centerPoint.stateValues.xs[1].tree).eq(9);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })


      cy.log("move circle3")
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        circle3.moveCircle({ center: [6, -8] });
        expect(components['/_circle1'].stateValues.center.tree).eqls(["vector", 6, -8]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([6, -8]);
        expect(components['/_circle1'].stateValues.radius.tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.tree).eqls(["vector", 6, -8]);
        expect(circle2.stateValues.numericalCenter).eqls([6, -8]);
        expect(circle2.stateValues.radius.tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.tree).eqls(["vector", 6, -8]);
        expect(circle3.stateValues.numericalCenter).eqls([6, -8]);
        expect(circle3.stateValues.radius.tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect(centerPoint.stateValues.xs[0].tree).eq(6);
        expect(centerPoint.stateValues.xs[1].tree).eq(-8);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })

    })

  });

});
