describe('Circle Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('circle with no parameters gives unit circle', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <circle/>
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0];
      let radiusNumber = components["/radiusNumber"].replacements[0];
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([0, 0]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([0, 0]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(1);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(1);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([0, 0]);
        expect(circle2.stateValues.numericalCenter).eqls([0, 0]);
        expect((await circle2.stateValues.radius).tree).eq(1);
        expect(circle2.stateValues.numericalRadius).eq(1);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([0, 0]);
        expect(circle3.stateValues.numericalCenter).eqls([0, 0]);
        expect((await circle3.stateValues.radius).tree).eq(1);
        expect(circle3.stateValues.numericalRadius).eq(1);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(0);
        expect(centerPoint.stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(1);
      })

      cy.log("move circle")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_circle1'].moveCircle({ center: [2, 3] });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([2, 3]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([2, 3]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(1);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(1);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([2, 3]);
        expect(circle2.stateValues.numericalCenter).eqls([2, 3]);
        expect((await circle2.stateValues.radius).tree).eq(1);
        expect(circle2.stateValues.numericalRadius).eq(1);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([2, 3]);
        expect(circle3.stateValues.numericalCenter).eqls([2, 3]);
        expect((await circle3.stateValues.radius).tree).eq(1);
        expect(circle3.stateValues.numericalRadius).eq(1);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(2);
        expect(centerPoint.stateValues.xs[1].tree).eq(3);
        expect(radiusNumber.stateValues.value.tree).eq(1);
      })


      cy.log("change radius")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 5, y: 0 });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([2, 3]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([2, 3]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([2, 3]);
        expect(circle2.stateValues.numericalCenter).eqls([2, 3]);
        expect((await circle2.stateValues.radius).tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([2, 3]);
        expect(circle3.stateValues.numericalCenter).eqls([2, 3]);
        expect((await circle3.stateValues.radius).tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(2);
        expect(centerPoint.stateValues.xs[1].tree).eq(3);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })

      cy.log("change center")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await centerPoint.movePoint({ x: -6, y: -2 });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-6, -2]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([-6, -2]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([-6, -2]);
        expect(circle2.stateValues.numericalCenter).eqls([-6, -2]);
        expect((await circle2.stateValues.radius).tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([-6, -2]);
        expect(circle3.stateValues.numericalCenter).eqls([-6, -2]);
        expect((await circle3.stateValues.radius).tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(-6);
        expect(centerPoint.stateValues.xs[1].tree).eq(-2);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })

      cy.log("move circle2")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await circle2.moveCircle({ center: [-7, 9] });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-7, 9]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([-7, 9]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([-7, 9]);
        expect(circle2.stateValues.numericalCenter).eqls([-7, 9]);
        expect((await circle2.stateValues.radius).tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([-7, 9]);
        expect(circle3.stateValues.numericalCenter).eqls([-7, 9]);
        expect((await circle3.stateValues.radius).tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(-7);
        expect(centerPoint.stateValues.xs[1].tree).eq(9);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })


      cy.log("move circle3")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await circle3.moveCircle({ center: [6, -8] });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([6, -8]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([6, -8]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([6, -8]);
        expect(circle2.stateValues.numericalCenter).eqls([6, -8]);
        expect((await circle2.stateValues.radius).tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([6, -8]);
        expect(circle3.stateValues.numericalCenter).eqls([6, -8]);
        expect((await circle3.stateValues.radius).tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(6);
        expect(centerPoint.stateValues.xs[1].tree).eq(-8);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })

    })

  });

  it('circle with center', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <circle center="(-1,3)" />
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];
      let center1 = components["/_circle1"].attributes["center"].component;

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-1, 3]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([-1, 3]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(1);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(1);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([-1, 3]);
        expect(circle2.stateValues.numericalCenter).eqls([-1, 3]);
        expect((await circle2.stateValues.radius).tree).eq(1);
        expect(circle2.stateValues.numericalRadius).eq(1);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([-1, 3]);
        expect(circle3.stateValues.numericalCenter).eqls([-1, 3]);
        expect((await circle3.stateValues.radius).tree).eq(1);
        expect(circle3.stateValues.numericalRadius).eq(1);
        expect((await center1.stateValues.xs)[0].tree).eq(-1);
        expect(center1.stateValues.xs[1].tree).eq(3);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(-1);
        expect(centerPoint.stateValues.xs[1].tree).eq(3);
        expect(radiusNumber.stateValues.value.tree).eq(1);
      })

      cy.log("move circle")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_circle1'].moveCircle({ center: [2, 4] });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([2, 4]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([2, 4]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(1);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(1);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([2, 4]);
        expect(circle2.stateValues.numericalCenter).eqls([2, 4]);
        expect((await circle2.stateValues.radius).tree).eq(1);
        expect(circle2.stateValues.numericalRadius).eq(1);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([2, 4]);
        expect(circle3.stateValues.numericalCenter).eqls([2, 4]);
        expect((await circle3.stateValues.radius).tree).eq(1);
        expect(circle3.stateValues.numericalRadius).eq(1);
        expect((await center1.stateValues.xs)[0].tree).eq(2);
        expect(center1.stateValues.xs[1].tree).eq(4);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(2);
        expect(centerPoint.stateValues.xs[1].tree).eq(4);
        expect(radiusNumber.stateValues.value.tree).eq(1);
      })


      cy.log("change radius")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 5, y: 0 });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([2, 4]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([2, 4]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([2, 4]);
        expect(circle2.stateValues.numericalCenter).eqls([2, 4]);
        expect((await circle2.stateValues.radius).tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([2, 4]);
        expect(circle3.stateValues.numericalCenter).eqls([2, 4]);
        expect((await circle3.stateValues.radius).tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect((await center1.stateValues.xs)[0].tree).eq(2);
        expect(center1.stateValues.xs[1].tree).eq(4);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(2);
        expect(centerPoint.stateValues.xs[1].tree).eq(4);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })

      cy.log("change center via defining point")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await center1.movePoint({ x: -6, y: -2 });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-6, -2]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([-6, -2]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([-6, -2]);
        expect(circle2.stateValues.numericalCenter).eqls([-6, -2]);
        expect((await circle2.stateValues.radius).tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([-6, -2]);
        expect(circle3.stateValues.numericalCenter).eqls([-6, -2]);
        expect((await circle3.stateValues.radius).tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect((await center1.stateValues.xs)[0].tree).eq(-6);
        expect(center1.stateValues.xs[1].tree).eq(-2);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(-6);
        expect(centerPoint.stateValues.xs[1].tree).eq(-2);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })


      cy.log("change center via reffed point")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await centerPoint.movePoint({ x: -7, y: 8 });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-7, 8]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([-7, 8]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([-7, 8]);
        expect(circle2.stateValues.numericalCenter).eqls([-7, 8]);
        expect((await circle2.stateValues.radius).tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([-7, 8]);
        expect(circle3.stateValues.numericalCenter).eqls([-7, 8]);
        expect((await circle3.stateValues.radius).tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect((await center1.stateValues.xs)[0].tree).eq(-7);
        expect(center1.stateValues.xs[1].tree).eq(8);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(-7);
        expect(centerPoint.stateValues.xs[1].tree).eq(8);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })

      cy.log("move circle2")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await circle2.moveCircle({ center: [9, -10] });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([9, -10]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([9, -10]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([9, -10]);
        expect(circle2.stateValues.numericalCenter).eqls([9, -10]);
        expect((await circle2.stateValues.radius).tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([9, -10]);
        expect(circle3.stateValues.numericalCenter).eqls([9, -10]);
        expect((await circle3.stateValues.radius).tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect((await center1.stateValues.xs)[0].tree).eq(9);
        expect(center1.stateValues.xs[1].tree).eq(-10);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(9);
        expect(centerPoint.stateValues.xs[1].tree).eq(-10);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })

      cy.log("move circle3")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await circle3.moveCircle({ center: [-3, -4] });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, -4]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([-3, -4]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(5);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([-3, -4]);
        expect(circle2.stateValues.numericalCenter).eqls([-3, -4]);
        expect((await circle2.stateValues.radius).tree).eq(5);
        expect(circle2.stateValues.numericalRadius).eq(5);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([-3, -4]);
        expect(circle3.stateValues.numericalCenter).eqls([-3, -4]);
        expect((await circle3.stateValues.radius).tree).eq(5);
        expect(circle3.stateValues.numericalRadius).eq(5);
        expect((await center1.stateValues.xs)[0].tree).eq(-3);
        expect(center1.stateValues.xs[1].tree).eq(-4);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(-3);
        expect(centerPoint.stateValues.xs[1].tree).eq(-4);
        expect(radiusNumber.stateValues.value.tree).eq(5);
      })
    })
  });

  it('circle with radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" tname="_point1" /></math>
    <graph>
    <point>(2,0)</point>
    <circle radius="$pX" />
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let x = 0, y = 0, r = 2;
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle2.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle3.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(0);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(x);
        expect(centerPoint.stateValues.xs[1].tree).eq(y);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

      cy.log("move circle")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let x = 3, y = 4, r = 2;
        await components['/_circle1'].moveCircle({ center: [x, y] });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle2.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle3.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(0);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(x);
        expect(centerPoint.stateValues.xs[1].tree).eq(y);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })


      cy.log("change radius with defining point")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let x = 3, y = 4, r = 5;
        await components['/_point1'].movePoint({ x: r, y: 0 });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle2.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle3.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(0);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(x);
        expect(centerPoint.stateValues.xs[1].tree).eq(y);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })


      cy.log("change radius with reffed point")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let x = 3, y = 4, r = 7;
        await components['/_point2'].movePoint({ x: r, y: 0 });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle2.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle3.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(0);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(x);
        expect(centerPoint.stateValues.xs[1].tree).eq(y);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

      cy.log("change center with reffed point")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let x = -5, y = -2, r = 7;
        await centerPoint.movePoint({ x: x, y: y });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle2.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle3.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(0);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(x);
        expect(centerPoint.stateValues.xs[1].tree).eq(y);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

      cy.log("move circle2")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let x = 9, y = -10, r = 7;
        await circle2.moveCircle({ center: [x, y] });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle2.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle3.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(0);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(x);
        expect(centerPoint.stateValues.xs[1].tree).eq(y);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

      cy.log("move circle3")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let x = -3, y = -4, r = 7;
        await circle3.moveCircle({ center: [x, y] });
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle2.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([x, y]);
        expect(circle3.stateValues.numericalCenter).eqls([x, y]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(0);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(x);
        expect(centerPoint.stateValues.xs[1].tree).eq(y);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

    })

  });

  it('circle through point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point>
    <circle through="$_point1" />
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tx = 2, ty = -3;
        let r = 1;
        let cx = tx, cy = ty - r;
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([cx, cy]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle2.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle3.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(tx);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(ty);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(cx);
        expect(centerPoint.stateValues.xs[1].tree).eq(cy);
        expect(components['/_point2'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point2'].stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

      cy.log("move circle")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tx = -4, ty = 7;
        let r = 1;
        let cx = tx, cy = ty - r;
        await components['/_circle1'].moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([cx, cy]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle2.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle3.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(tx);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(ty);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(cx);
        expect(centerPoint.stateValues.xs[1].tree).eq(cy);
        expect(components['/_point2'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point2'].stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

      cy.log("move through point")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tx = -5, ty = 9;
        let r = 1;
        let cx = tx, cy = ty - r;
        await components['/_point1'].movePoint({ x: tx, y: ty })
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([cx, cy]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle2.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle3.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(tx);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(ty);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(cx);
        expect(centerPoint.stateValues.xs[1].tree).eq(cy);
        expect(components['/_point2'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point2'].stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

      cy.log("move reffed center")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tx = 3, ty = -3;
        let r = 1;
        let cx = tx, cy = ty - r;
        await centerPoint.movePoint({ x: cx, y: cy })
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([cx, cy]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle2.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle3.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(tx);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(ty);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(cx);
        expect(centerPoint.stateValues.xs[1].tree).eq(cy);
        expect(components['/_point2'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point2'].stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

      cy.log("change reffed radius, center moves")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let r = 3;
        let cx = 3, cy = -6;
        let tx = 3, ty = cy + r;
        await components['/_point2'].movePoint({ x: r, y: 0 })
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([cx, cy]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle2.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle3.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(tx);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(ty);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(cx);
        expect(centerPoint.stateValues.xs[1].tree).eq(cy);
        expect(components['/_point2'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point2'].stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

      cy.log("try to make radius negative")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let rtry = -3;
        let r = 0;
        let cx = 3, cy = -3;
        let tx = 3, ty = cy + r;
        await components['/_point2'].movePoint({ x: rtry, y: 0 })
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([cx, cy]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle2.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle3.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(tx);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(ty);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(cx);
        expect(centerPoint.stateValues.xs[1].tree).eq(cy);
        expect(components['/_point2'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point2'].stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

      cy.log("make radius positive again")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let r = 2;
        let cx = 3, cy = -5;
        let tx = 3, ty = cy + r;
        await components['/_point2'].movePoint({ x: r, y: 0 })
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([cx, cy]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle2.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle3.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(tx);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(ty);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(cx);
        expect(centerPoint.stateValues.xs[1].tree).eq(cy);
        expect(components['/_point2'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point2'].stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })


      cy.log("move circle2")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let r = 2;
        let cx = 9, cy = -10;
        let tx = 9, ty = cy + r;

        await circle2.moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([cx, cy]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle2.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle3.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(tx);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(ty);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(cx);
        expect(centerPoint.stateValues.xs[1].tree).eq(cy);
        expect(components['/_point2'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point2'].stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })


      cy.log("move circle3")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let r = 2;
        let cx = -3, cy = -4;
        let tx = -3, ty = cy + r;
        await circle3.moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([cx, cy]);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect(components['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(circle2.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle2.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle2.stateValues.radius).tree).eq(r);
        expect(circle2.stateValues.numericalRadius).eq(r);
        expect(circle3.stateValues.center.map(x => x.tree)).eqls([cx, cy]);
        expect(circle3.stateValues.numericalCenter).eqls([cx, cy]);
        expect((await circle3.stateValues.radius).tree).eq(r);
        expect(circle3.stateValues.numericalRadius).eq(r);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(tx);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(ty);
        expect((await centerPoint.stateValues.xs)[0].tree).eq(cx);
        expect(centerPoint.stateValues.xs[1].tree).eq(cy);
        expect(components['/_point2'].stateValues.xs[0].tree).eq(r);
        expect(components['/_point2'].stateValues.xs[1].tree).eq(0);
        expect(radiusNumber.stateValues.value.tree).eq(r);
      })

    })
  });

  it('circle through two points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point><point>(3,4)</point>
    <circle through="$_point1 $_point2"/>
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 2, t1y = -3;
        let t2x = 3, t2y = 4;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = -2, t1y = 0;
        let t2x = -1, t2y = 7;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await components['/_circle1'].moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move first through point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 4, t1y = -1;
        let t2x = -1, t2y = 7;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await components['/_point1'].movePoint({ x: t1x, y: t1y })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move second through point on top of first')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 4, t1y = -1;
        let t2x = 4, t2y = -1;
        let r = 0;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await components['/_point2'].movePoint({ x: t2x, y: t2y })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move second through point again')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 4, t1y = -1;
        let t2x = 8, t2y = -3;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await components['/_point2'].movePoint({ x: t2x, y: t2y })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move center')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 4 + 2, t1y = -1 - 3;
        let t2x = 8 + 2, t2y = -3 - 3;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await centerPoint.movePoint({ x: cx, y: cy })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move radius to half size')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
        let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await components['/_point3'].movePoint({ x: r, y: 0 })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle2')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
        let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        let dx = 3, dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await circle2.moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle3')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
        let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        let dx = -3, dy = 5;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await circle3.moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })
    })
  });

  it('circle through two points, undefined on first pass', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <circle through="$_point1 $_point2" />
    <point>(2,-3)</point><point>(3,4)</point>
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 2, t1y = -3;
        let t2x = 3, t2y = 4;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = -2, t1y = 0;
        let t2x = -1, t2y = 7;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await components['/_circle1'].moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move first through point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 4, t1y = -1;
        let t2x = -1, t2y = 7;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await components['/_point1'].movePoint({ x: t1x, y: t1y })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move second through point on top of first')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 4, t1y = -1;
        let t2x = 4, t2y = -1;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await components['/_point2'].movePoint({ x: t2x, y: t2y })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move second through point again')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 4, t1y = -1;
        let t2x = 8, t2y = -3;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await components['/_point2'].movePoint({ x: t2x, y: t2y })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move center')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 4 + 2, t1y = -1 - 3;
        let t2x = 8 + 2, t2y = -3 - 3;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await centerPoint.movePoint({ x: cx, y: cy })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move radius to half size')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
        let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        await components['/_point3'].movePoint({ x: r, y: 0 })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('move circle2')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
        let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        let dx = 3, dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await circle2.moveCircle({ center: [cx, cy] })

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('move circle3')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
        let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        let cx = (t1x + t2x) / 2, cy = (t1y + t2y) / 2;
        let dx = -3, dy = 5;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await circle3.moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

    })
  })

  it('circle through three points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(2,-3)</point><point>(3,4)</point><point>(-3,4)</point>
    <circle through="$_point1 $_point2 $_point3" />
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <copy prop="diameter" name="diam" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let diam = components["/diam"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      let t1x = 2, t1y = -3;
      let t2x = 3, t2y = 4;
      let t3x = -3, t3y = 4;

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })

      cy.log('move circle up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        let dx = 3, dy = 4;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;

        await components['/_circle1'].moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })

      cy.log('move first point to be in straight line')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t1x = -3, t1y = 8;

        await components['/_point1'].movePoint({ x: t1x, y: t1y })

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalRadius)).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.center[0].tree)).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.center[1].tree)).false;
        expect(Number.isFinite((await components['/_circle1'].stateValues.radius).tree)).false;
        expect(Number.isFinite(circle2.stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(circle2.stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(circle2.stateValues.numericalRadius)).false;
        expect(Number.isFinite(circle2.stateValues.center[0].tree)).false;
        expect(Number.isFinite(circle2.stateValues.center[1].tree)).false;
        expect(Number.isFinite((await circle2.stateValues.radius).tree)).false;
        expect(Number.isFinite(circle3.stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(circle3.stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(circle3.stateValues.numericalRadius)).false;
        expect(Number.isFinite(circle3.stateValues.center[0].tree)).false;
        expect(Number.isFinite(circle3.stateValues.center[1].tree)).false;
        expect(Number.isFinite((await circle3.stateValues.radius).tree)).false;

        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect(Number.isFinite((await centerPoint.stateValues.xs)[0].tree)).false;
        expect(Number.isFinite(centerPoint.stateValues.xs[1].tree)).false;
        expect(Number.isFinite(radiusNumber.stateValues.value.tree)).false;
        expect(Number.isFinite(diam.stateValues.value.tree)).false;
      })

      cy.log('move second point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2x = -4, t2y = -2;

        await components['/_point2'].movePoint({ x: t2x, y: t2y })

        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);


        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })

      cy.log('move third point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t3x = 5, t3y = 3;

        await components['/_point3'].movePoint({ x: t3x, y: t3y })

        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })

      cy.log('move points to be identical')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t1x = 5, t1y = 3;
        t2x = 5, t2y = 3;

        await components['/_point1'].movePoint({ x: t1x, y: t1y })
        await components['/_point2'].movePoint({ x: t2x, y: t2y })

        // should be a circle of radius zero
        let cx = t1x;
        let cy = t1y;
        let r = 0;

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })


      cy.log('points 1 and 3 are identical')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2x = 2, t2y = -7;

        // two points should be the diameter
        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;
        let r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));

        await components['/_point2'].movePoint({ x: t2x, y: t2y })

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })


      cy.log('points 2 and 3 are identical')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t3x = 2, t3y = -7;

        // two points should be the diameter
        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;
        let r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));

        await components['/_point3'].movePoint({ x: t3x, y: t3y })

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })


      cy.log('points 1 and 2 are identical')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t1x = 4, t1y = 9;
        t2x = 4, t2y = 9;

        // two points should be the diameter
        let cx = (t1x + t3x) / 2;
        let cy = (t1y + t3y) / 2;
        let r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));

        await components['/_point1'].movePoint({ x: t1x, y: t1y })
        await components['/_point2'].movePoint({ x: t2x, y: t2y })

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })



      cy.log('move points apart again')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2x = 2, t2y = -7;
        t3x = 0, t3y = -8;

        await components['/_point2'].movePoint({ x: t2x, y: t2y })
        await components['/_point3'].movePoint({ x: t3x, y: t3y })

        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })


      cy.log('move center by reffed point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        let dx = 2, dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;

        await centerPoint.movePoint({ x: cx, y: cy });
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })

      cy.log('half radius around center')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        r = r / 2;

        t1x = cx + (t1x - cx) / 2;
        t1y = cy + (t1y - cy) / 2;
        t2x = cx + (t2x - cx) / 2;
        t2y = cy + (t2y - cy) / 2;
        t3x = cx + (t3x - cx) / 2;
        t3y = cy + (t3y - cy) / 2;

        await components['/_point4'].movePoint({ x: r, y: 0 });

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })


      cy.log('move circle2')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        // calculate center and radius from circle itself
        let cx = circle2.stateValues.numericalCenter[0];
        let cy = circle2.stateValues.numericalCenter[1];
        let r = circle2.stateValues.numericalRadius;

        let dx = -5, dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;

        await circle2.moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })


      cy.log('move circle3')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        // calculate center and radius from circle itself
        let cx = circle3.stateValues.numericalCenter[0];
        let cy = circle3.stateValues.numericalCenter[1];
        let r = circle3.stateValues.numericalRadius;

        let dx = 7, dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;

        await circle3.moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
        expect(diam.stateValues.value.tree).closeTo(2 * r, 1E-12);
      })



    })

  });

  it('circle through three points, undefined on first pass', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <circle through="$_point1 $_point2 $_point3" />
    <point>(2,-3)</point><point>(3,4)</point><point>(-3,4)</point>
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];


      let t1x = 2, t1y = -3;
      let t2x = 3, t2y = 4;
      let t3x = -3, t3y = 4;

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        let dx = 3, dy = 4;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;

        await components['/_circle1'].moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move first point to be in straight line')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t1x = -3, t1y = 8;

        await components['/_point1'].movePoint({ x: t1x, y: t1y })

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalRadius)).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.center[0].tree)).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.center[1].tree)).false;
        expect(Number.isFinite((await components['/_circle1'].stateValues.radius).tree)).false;
        expect(Number.isFinite(circle2.stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(circle2.stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(circle2.stateValues.numericalRadius)).false;
        expect(Number.isFinite(circle2.stateValues.center[0].tree)).false;
        expect(Number.isFinite(circle2.stateValues.center[1].tree)).false;
        expect(Number.isFinite((await circle2.stateValues.radius).tree)).false;
        expect(Number.isFinite(circle3.stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(circle3.stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(circle3.stateValues.numericalRadius)).false;
        expect(Number.isFinite(circle3.stateValues.center[0].tree)).false;
        expect(Number.isFinite(circle3.stateValues.center[1].tree)).false;
        expect(Number.isFinite((await circle3.stateValues.radius).tree)).false;

        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect(Number.isFinite((await centerPoint.stateValues.xs)[0].tree)).false;
        expect(Number.isFinite(centerPoint.stateValues.xs[1].tree)).false;
        expect(Number.isFinite(radiusNumber.stateValues.value.tree)).false;
      })

      cy.log('move second point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2x = -4, t2y = -2;

        await components['/_point2'].movePoint({ x: t2x, y: t2y })

        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);


        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move third point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t3x = 5, t3y = 3;

        await components['/_point3'].movePoint({ x: t3x, y: t3y })

        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move points to be identical')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t1x = 5, t1y = 3;
        t2x = 5, t2y = 3;

        await components['/_point1'].movePoint({ x: t1x, y: t1y })
        await components['/_point2'].movePoint({ x: t2x, y: t2y })

        // should be a circle of radius zero
        let cx = t1x;
        let cy = t1y;
        let r = 0;

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('points 1 and 3 are identical')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2x = 2, t2y = -7;

        // two points should be the diameter
        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;
        let r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));

        await components['/_point2'].movePoint({ x: t2x, y: t2y })

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('points 2 and 3 are identical')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t3x = 2, t3y = -7;

        // two points should be the diameter
        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;
        let r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));

        await components['/_point3'].movePoint({ x: t3x, y: t3y })

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('points 1 and 2 are identical')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t1x = 4, t1y = 9;
        t2x = 4, t2y = 9;

        // two points should be the diameter
        let cx = (t1x + t3x) / 2;
        let cy = (t1y + t3y) / 2;
        let r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));

        await components['/_point1'].movePoint({ x: t1x, y: t1y })
        await components['/_point2'].movePoint({ x: t2x, y: t2y })

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })



      cy.log('move points apart again')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2x = 2, t2y = -7;
        t3x = 0, t3y = -8;

        await components['/_point2'].movePoint({ x: t2x, y: t2y })
        await components['/_point3'].movePoint({ x: t3x, y: t3y })

        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('move center by reffed point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        let dx = 2, dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;

        await centerPoint.movePoint({ x: cx, y: cy });
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('half radius around center')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // calculate center and radius from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];
        let r = components['/_circle1'].stateValues.numericalRadius;

        r = r / 2;

        t1x = cx + (t1x - cx) / 2;
        t1y = cy + (t1y - cy) / 2;
        t2x = cx + (t2x - cx) / 2;
        t2y = cy + (t2y - cy) / 2;
        t3x = cx + (t3x - cx) / 2;
        t3y = cy + (t3y - cy) / 2;

        await components['/_point4'].movePoint({ x: r, y: 0 });

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('move circle2')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        // calculate center and radius from circle itself
        let cx = circle2.stateValues.numericalCenter[0];
        let cy = circle2.stateValues.numericalCenter[1];
        let r = circle2.stateValues.numericalRadius;

        let dx = -5, dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;

        await circle2.moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('move circle3')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        // calculate center and radius from circle itself
        let cx = circle3.stateValues.numericalCenter[0];
        let cy = circle3.stateValues.numericalCenter[1];
        let r = circle3.stateValues.numericalRadius;

        let dx = 7, dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;

        await circle3.moveCircle({ center: [cx, cy] })
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t3x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t3y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


    })

  });

  it('circle with radius and through one point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" tname="_point1" /></math>
    <graph>
    <point>(2,0)</point><point>(3,4)</point>

    <circle radius="$pX" through="$_point2" />
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tx = 3, ty = 4;
        let r = 2;
        let cx = tx, cy = ty - r;

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tx = 1, ty = -1;
        let r = 2;
        let cx = tx, cy = ty - r;
        await components['/_circle1'].moveCircle({ center: [cx, cy] });
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move through point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tx = 4, ty = 7;
        let r = 2;
        let cx = tx, cy = ty - r;
        await components['/_point2'].movePoint({ x: tx, y: ty });
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('change definition radius')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tx = 4, ty = 7;
        let r = 6;
        let cx = tx, cy = ty - r;
        await components['/_point1'].movePoint({ x: r, y: 0 });
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('half reffed radius, center moves')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 4, cy = 4;
        let r = 3;
        let tx = cx, ty = cy + 3;
        await components['/_point3'].movePoint({ x: r, y: 0 });
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle2')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 9, cy = -10;
        let r = 3;
        let tx = cx, ty = cy + r;
        await circle2.moveCircle({ center: [cx, cy] });
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle3')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = -4, cy = -3;
        let r = 3;
        let tx = cx, ty = cy + r;
        await circle3.moveCircle({ center: [cx, cy] });
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })
    })
  });

  it('circle with radius and through two points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" tname="_point1" /></math>
    <graph>
    <point>(2,0)</point><point>(3,4)</point><point>(5,6)</point>

    <circle radius="$pX" through="$_point2 $_point3" />
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 3, t1y = 4;
        let t2x = 5, t2y = 6;
        let r = 2;

        // get center from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 3, t1y = 4;
        let t2x = 5, t2y = 6;
        let r = 2;

        // get center from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];

        let dx = -1, dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;

        await components['/_circle1'].moveCircle({ center: [cx, cy] });
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move through point too far away')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 0, t1y = -1;
        let t2x = 4, t2y = 3;
        let r = 2;

        await components['/_point2'].movePoint({ x: t1x, y: t1y });

        expect(Number.isFinite(components['/_circle1'].stateValues.center[0].tree)).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.center[1].tree)).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await components['/_circle1'].stateValues.radius).tree)).false;
        // expect(Number.isFinite(components['/_circle1'].stateValues.numericalRadius)).false;
        expect(Number.isFinite(circle2.stateValues.center[0].tree)).false;
        expect(Number.isFinite(circle2.stateValues.center[1].tree)).false;
        expect(Number.isFinite(circle2.stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(circle2.stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await circle2.stateValues.radius).tree)).false;
        // expect(Number.isFinite(circle2.stateValues.numericalRadius)).false;
        expect(Number.isFinite(circle3.stateValues.center[0].tree)).false;
        expect(Number.isFinite(circle3.stateValues.center[1].tree)).false;
        expect(Number.isFinite(circle3.stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(circle3.stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await circle3.stateValues.radius).tree)).false;
        // expect(Number.isFinite(circle3.stateValues.numericalRadius)).false;
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(Number.isFinite((await centerPoint.stateValues.xs)[0].tree)).false;
        expect(Number.isFinite(centerPoint.stateValues.xs[1].tree)).false;
        // expect(Number.isFinite(radiusNumber.stateValues.value.tree)).false;

      })

      cy.log('increase definition radius')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 0, t1y = -1;
        let t2x = 4, t2y = 3;
        let r = 6;

        await components['/_point1'].movePoint({ x: r, y: 0 });

        // get center from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('decrease reffed and then definition radius')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 0, t1y = -1;
        let t2x = 4, t2y = 3;
        let r = 6;

        // get center from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];

        r = r / 3;
        await components['/_point4'].movePoint({ x: r, y: 0 });

        expect(Number.isFinite(components['/_circle1'].stateValues.center[0].tree)).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.center[1].tree)).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await components['/_circle1'].stateValues.radius).tree)).false;
        // expect(Number.isFinite(components['/_circle1'].stateValues.numericalRadius)).false;
        expect(Number.isFinite(circle2.stateValues.center[0].tree)).false;
        expect(Number.isFinite(circle2.stateValues.center[1].tree)).false;
        expect(Number.isFinite(circle2.stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(circle2.stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await circle2.stateValues.radius).tree)).false;
        // expect(Number.isFinite(circle2.stateValues.numericalRadius)).false;
        expect(Number.isFinite(circle3.stateValues.center[0].tree)).false;
        expect(Number.isFinite(circle3.stateValues.center[1].tree)).false;
        expect(Number.isFinite(circle3.stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(circle3.stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await circle3.stateValues.radius).tree)).false;
        // expect(Number.isFinite(circle3.stateValues.numericalRadius)).false;
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(Number.isFinite((await centerPoint.stateValues.xs)[0].tree)).false;
        expect(Number.isFinite(centerPoint.stateValues.xs[1].tree)).false;
        // expect(Number.isFinite(radiusNumber.stateValues.value.tree)).false;

        r = r * 3;
        await components['/_point4'].movePoint({ x: r, y: 0 });

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);

        r = r / 9;
        await components['/_point1'].movePoint({ x: r, y: 0 });

        expect(Number.isFinite(components['/_circle1'].stateValues.center[0].tree)).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.center[1].tree)).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await components['/_circle1'].stateValues.radius).tree)).false;
        // expect(Number.isFinite(components['/_circle1'].stateValues.numericalRadius)).false;
        expect(Number.isFinite(circle2.stateValues.center[0].tree)).false;
        expect(Number.isFinite(circle2.stateValues.center[1].tree)).false;
        expect(Number.isFinite(circle2.stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(circle2.stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await circle2.stateValues.radius).tree)).false;
        // expect(Number.isFinite(circle2.stateValues.numericalRadius)).false;
        expect(Number.isFinite(circle3.stateValues.center[0].tree)).false;
        expect(Number.isFinite(circle3.stateValues.center[1].tree)).false;
        expect(Number.isFinite(circle3.stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(circle3.stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await circle3.stateValues.radius).tree)).false;
        // expect(Number.isFinite(circle3.stateValues.numericalRadius)).false;
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect(Number.isFinite((await centerPoint.stateValues.xs)[0].tree)).false;
        expect(Number.isFinite(centerPoint.stateValues.xs[1].tree)).false;
        // expect(Number.isFinite(radiusNumber.stateValues.value.tree)).false;

      })

      cy.log('move through points on top of each other')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 5, t1y = -4;
        let t2x = 5, t2y = -4;
        let r = 2 / 3;

        let cx = t1x, cy = t1y - r;

        await components['/_point2'].movePoint({ x: t1x, y: t1y });
        await components['/_point3'].movePoint({ x: t2x, y: t2y });

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);

      })


      cy.log('move through points apart, but close enough')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = -2, t1y = 7;
        let t2x = -2.5, t2y = 6.6;
        let r = 2 / 3;

        await components['/_point2'].movePoint({ x: t1x, y: t1y });
        await components['/_point3'].movePoint({ x: t2x, y: t2y });

        // get center from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);

      })

      cy.log('move reffed center')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = -2, t1y = 7;
        let t2x = -2.5, t2y = 6.6;
        let r = 2 / 3;

        // get center from circle itself
        let cx = components['/_circle1'].stateValues.numericalCenter[0];
        let cy = components['/_circle1'].stateValues.numericalCenter[1];

        let dx = 6, dy = -7;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;

        await centerPoint.movePoint({ x: cx, y: cy });

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);

      })


      cy.log('move circle2')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 4, t1y = 0;
        let t2x = 3.5, t2y = -0.4;
        let r = 2 / 3;

        // get center from circle itself
        let cx = circle2.stateValues.numericalCenter[0];
        let cy = circle2.stateValues.numericalCenter[1];

        let dx = 3, dy = -1;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;

        await circle2.moveCircle({ center: [cx, cy] });

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);

      })


      cy.log('move circle3')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let t1x = 7, t1y = -1;
        let t2x = 6.5, t2y = -1.4;
        let r = 2 / 3;

        // get center from circle itself
        let cx = circle3.stateValues.numericalCenter[0];
        let cy = circle3.stateValues.numericalCenter[1];

        let dx = -5, dy = 3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;

        await circle3.moveCircle({ center: [cx, cy] });

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(t1x, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(t1y, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(t2x, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(t2y, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);

      })



    })
  })

  it('circle with center and through point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(3,4)</point><point>(5,6)</point>

    <circle center="$_point1" through="$_point2" />
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 3, cy = 4;
        let tx = 5, ty = 6;
        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 3, cy = 4;
        let tx = 5, ty = 6;
        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        let dx = -2, dy = -6;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;

        await components['/_circle1'].moveCircle({ center: [cx, cy] })

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move defining center')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 1, cy = -2;
        let tx = 3, ty = 0;

        cx = -5;
        cy = 5;

        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        await components['/_point1'].movePoint({ x: cx, y: cy });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move reffed center')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 1, cy = -1;
        let tx = 3, ty = 0;

        await centerPoint.movePoint({ x: cx, y: cy });
        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('move through point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 1, cy = -1;
        let tx = -4, ty = 3;

        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        await components['/_point2'].movePoint({ x: tx, y: ty });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('change reffed radius')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 1, cy = -1;
        let tx = -4, ty = 3;

        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        r = r / 4;

        tx = cx + (tx - cx) / 4;
        ty = cy + (ty - cy) / 4;

        await components['/_point3'].movePoint({ x: r, y: 0 });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('move circle2')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 1, cy = -1;
        let tx = -4, ty = 3;

        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        r = r / 4;

        tx = cx + (tx - cx) / 4;
        ty = cy + (ty - cy) / 4;

        let dx = 4, dy = -1;

        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;


        await circle2.moveCircle({ center: [cx, cy] })

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('move circle3')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 1, cy = -1;
        let tx = -4, ty = 3;

        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        r = r / 4;

        tx = cx + (tx - cx) / 4;
        ty = cy + (ty - cy) / 4;

        let dx = -5, dy = 4;

        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;


        await circle3.moveCircle({ center: [cx, cy] })

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

    })
  })

  it('circle with radius and center', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" tname="_point1" /></math>
    <graph>
    <point>(3,0)</point>

    <circle radius="$pX" center="(-3,5)" />
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <graph name="graph3">
      <copy name="circle2" tname="_circle1" />
    </graph>
    <copy name="graph4" tname="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let definingCenter = components["/_circle1"].attributes["center"].component
      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];
      let circle3 = components["/graph4"].replacements[0].activeChildren[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = -3, cy = 5;
        let r = 3;

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect((await definingCenter.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect((await definingCenter.stateValues.xs)[1].tree).closeTo(cy, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('make defined radius negative')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = -3, cy = 5;
        let r = -3;

        await components['/_point1'].movePoint({ x: r, y: 0 });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(0, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(0, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(0, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(0, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(0, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(0, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect((await definingCenter.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect((await definingCenter.stateValues.xs)[1].tree).closeTo(cy, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(0, 1E-12);
      })

      cy.log('making reffed radius negative sets it to zero')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = -3, cy = 5;
        let r = 0;

        await components['/_point1'].movePoint({ x: 1, y: 0 });

        await components['/_point2'].movePoint({ x: -5, y: 0 });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circle3.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle3.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle3.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle3.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle3.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle3.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect((await definingCenter.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect((await definingCenter.stateValues.xs)[1].tree).closeTo(cy, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })
    })

  })

  it('point constrained to circle', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" tname="_point1" /></math>
    <point>(3,0)</point><point>(-1,7)</point>
    <graph>
    <circle radius="$pX" center="$_point2" />
    <point x="-4" y="-6">
      <constraints>
        <constrainTo><copy tname="_circle1" /></constrainTo>
      </constraints>
    </point>
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" name="radiusNumber" tname="_circle1" />
    <copy name="graph2" tname="_graph1" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let radiusNumber = components["/radiusNumber"].replacements[0]
      let circleShadow = components["/graph2"].replacements[0].activeChildren[0];
      let pointShadow = components["/graph2"].replacements[0].activeChildren[1];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = -1, cy = 7;
        let r = 3;

        let px = components['/_point3'].stateValues.xs[0].tree;
        let py = components['/_point3'].stateValues.xs[1].tree;
        let dist = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(pointShadow.stateValues.xs[0].tree).eq(px);
        expect(pointShadow.stateValues.xs[1].tree).eq(py);

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circleShadow.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move circle')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 5, cy = -2;
        let r = 3;

        await components['/_point2'].movePoint({ x: cx, y: cy });

        let px = components['/_point3'].stateValues.xs[0].tree;
        let py = components['/_point3'].stateValues.xs[1].tree;
        let dist = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(pointShadow.stateValues.xs[0].tree).eq(px);
        expect(pointShadow.stateValues.xs[1].tree).eq(py);

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circleShadow.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('shink circle')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 5, cy = -2;
        let r = 1;

        await components['/_point1'].movePoint({ x: r, y: 0 });

        let px = components['/_point3'].stateValues.xs[0].tree;
        let py = components['/_point3'].stateValues.xs[1].tree;
        let dist = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(pointShadow.stateValues.xs[0].tree).eq(px);
        expect(pointShadow.stateValues.xs[1].tree).eq(py);

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circleShadow.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })

      cy.log('move point')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 5, cy = -2;
        let r = 1;

        await components['/_point3'].movePoint({ x: -9, y: 8 });

        let px = components['/_point3'].stateValues.xs[0].tree;
        let py = components['/_point3'].stateValues.xs[1].tree;
        let dist = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(pointShadow.stateValues.xs[0].tree).eq(px);
        expect(pointShadow.stateValues.xs[1].tree).eq(py);

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circleShadow.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('move circle shadow')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = -3, cy = 7;
        let r = 1;

        await circleShadow.moveCircle({ center: [cx, cy] });

        let px = components['/_point3'].stateValues.xs[0].tree;
        let py = components['/_point3'].stateValues.xs[1].tree;
        let dist = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(pointShadow.stateValues.xs[0].tree).eq(px);
        expect(pointShadow.stateValues.xs[1].tree).eq(py);

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circleShadow.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


      cy.log('move point shadow')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = -3, cy = 7;
        let r = 1;

        await pointShadow.movePoint({ x: 11, y: -21 });

        let px = components['/_point3'].stateValues.xs[0].tree;
        let py = components['/_point3'].stateValues.xs[1].tree;
        let dist = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(pointShadow.stateValues.xs[0].tree).eq(px);
        expect(pointShadow.stateValues.xs[1].tree).eq(py);

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circleShadow.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circleShadow.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circleShadow.stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(0, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(radiusNumber.stateValues.value.tree).closeTo(r, 1E-12);
      })


    })

  })

  it('all updatable with copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(3,0)</point><point>(-1,7)</point>
    <circle center="$_point1" through="$_point2" />
    </graph>
    <graph>
    <copy prop="center" name="centerPoint" tname="_circle1" />
    <point>
      (<copy prop="y" tname="centerPoint" />,
      <copy prop="radius" tname="_circle1" />)
    </point>
    <copy name="circle2" tname="_circle1" />
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let centerPoint = components["/centerPoint"].replacements[0]
      let circle2 = components["/circle2"].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 3, cy = 0;
        let tx = -1, ty = 7;
        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);

      })

      cy.log("move circle 1")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 3, cy = 0;
        let tx = -1, ty = 7;
        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        let dx = -5, dy = 4;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;

        await components['/_circle1'].moveCircle({ center: [cx, cy] });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);

      })

      cy.log("move circle 2")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 3, cy = 0;
        let tx = -1, ty = 7;
        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        let dx = 3, dy = -2;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;

        await circle2.moveCircle({ center: [cx, cy] });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);

      })

      cy.log("move reffed center")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = 6, cy = -2;
        let tx = 2, ty = 5;

        let dx = -5, dy = -5;
        cx += dx;
        cy += dy;

        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        await centerPoint.movePoint({ x: cx, y: cy });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);

      })

      cy.log("move defining center")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let tx = 2, ty = 5;

        let cx = -3;
        let cy = 1;

        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        await components['/_point1'].movePoint({ x: cx, y: cy });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);

      })

      cy.log("move through point")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = -3, cy = 1;

        let tx = 0;
        let ty = 4;

        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        await components['/_point2'].movePoint({ x: tx, y: ty });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(r, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(r, 1E-12);

      })

      // This test captures the actual behavior with this strange construction
      // Question: is this the desired behavior?
      // Not sure how to improve behavior in a way that wouldn't depend
      // on the order of which is updated first:
      // the x or y coordinate of the point moved
      cy.log("move point of refs")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let cx = -3, cy = 1;
        let tx = 0, ty = 4;

        let theta = Math.atan2(ty - cy, tx - cx);

        let rSpecified = 2;
        tx = cx + rSpecified * Math.cos(theta);
        ty = cy + rSpecified * Math.sin(theta);

        cy = -3;

        // first time through, the radius doesn't end up being what specified
        let rActual = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2))

        await components['/_point3'].movePoint({ x: cy, y: rSpecified });

        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(rActual, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(rActual, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(rActual, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(rActual, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(rActual, 1E-12);


        // try it again
        // since center doesn't move, we get radius specified
        theta = Math.atan2(ty - cy, tx - cx);
        tx = cx + rSpecified * Math.cos(theta);
        ty = cy + rSpecified * Math.sin(theta);
        rActual = rSpecified;

        await components['/_point3'].movePoint({ x: cy, y: rSpecified });


        expect(components['/_circle1'].stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(rActual, 1E-12);
        expect(components['/_circle1'].stateValues.numericalRadius).closeTo(rActual, 1E-12);
        expect(components['/_point1'].stateValues.xs[0].tree).closeTo(cx, 1E-12);
        expect(components['/_point1'].stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point2'].stateValues.xs[0].tree).closeTo(tx, 1E-12);
        expect(components['/_point2'].stateValues.xs[1].tree).closeTo(ty, 1E-12);
        expect((await centerPoint.stateValues.xs)[0].tree).closeTo(cx, 1E-12);
        expect(centerPoint.stateValues.xs[1].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[0].tree).closeTo(cy, 1E-12);
        expect(components['/_point3'].stateValues.xs[1].tree).closeTo(rActual, 1E-12);
        expect(circle2.stateValues.center[0].tree).closeTo(cx, 1E-12);
        expect(circle2.stateValues.center[1].tree).closeTo(cy, 1E-12);
        expect(circle2.stateValues.numericalCenter[0]).closeTo(cx, 1E-12);
        expect(circle2.stateValues.numericalCenter[1]).closeTo(cy, 1E-12);
        expect((await circle2.stateValues.radius).tree).closeTo(rActual, 1E-12);
        expect(circle2.stateValues.numericalRadius).closeTo(rActual, 1E-12);



      })
    })

  })

  it('triangle inscribed in circle, copy center coordinates separately and radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <number hide name="fixedZero" fixed>0</number>
    <graph>
    <triangle layer="1" name="t" vertices="(1,2) (3,5) (-5,2)" />
  
    <circle name="c" through="$(t{prop='vertex1'}) $(t{prop='vertex2'}) $(t{prop='vertex3'})" />
  
    <point name="x">
      (<extract prop="x"><copy prop="center" tname="c" /></extract>,
      $fixedZero)
    </point>
  
    <point name="y">
      ($fixedZero,
      <extract prop="y"><copy prop="center" tname="c" /></extract>)
    </point>
    <point name="r">
      (<copy prop="radius" tname="c" />, 5)
    </point>
  
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let t1x = 1, t1y = 2, t2x = 3, t2y = 5, t3x = -5, t3y = 2;
    let circy, circx, r;

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      // calculate center and radius from circle itself
      circx = components['/c'].stateValues.numericalCenter[0];
      circy = components['/c'].stateValues.numericalCenter[1];
      r = components['/c'].stateValues.numericalRadius;

      // verify triangle vertices are on circle
      expect(Math.sqrt((t1x - circx) ** 2 + (t1y - circy) ** 2)).closeTo(r, 1E-12);
      expect(Math.sqrt((t2x - circx) ** 2 + (t2y - circy) ** 2)).closeTo(r, 1E-12);
      expect(Math.sqrt((t3x - circx) ** 2 + (t3y - circy) ** 2)).closeTo(r, 1E-12);

      expect((await components['/t'].stateValues.vertices)[0][0].tree).closeTo(t1x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[0][1].tree).closeTo(t1y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][0].tree).closeTo(t2x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][1].tree).closeTo(t2y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][0].tree).closeTo(t3x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][1].tree).closeTo(t3y, 1E-12);
      expect(components['/c'].stateValues.center[0].tree).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.center[1].tree).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.radius.tree).closeTo(r, 1E-12);
      expect(components['/x'].stateValues.xs[0].tree).closeTo(circx, 1E-12);
      expect(components['/y'].stateValues.xs[1].tree).closeTo(circy, 1E-12);
      expect(components['/r'].stateValues.xs[0].tree).closeTo(r, 1E-12);

    })

    cy.log("move triangle points")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      t1x = -3, t1y = 1, t2x = 4, t2y = 0, t3x = -1, t3y = 7;

      await components['/t'].movePolygon({
        pointCoords: [
          [t1x, t1y], [t2x, t2y], [t3x, t3y]
        ]
      })

      // calculate center and radius from circle itself
      circx = components['/c'].stateValues.numericalCenter[0];
      circy = components['/c'].stateValues.numericalCenter[1];
      r = components['/c'].stateValues.numericalRadius;

      // verify triangle vertices are on circle
      expect(Math.sqrt((t1x - circx) ** 2 + (t1y - circy) ** 2)).closeTo(r, 1E-12);
      expect(Math.sqrt((t2x - circx) ** 2 + (t2y - circy) ** 2)).closeTo(r, 1E-12);
      expect(Math.sqrt((t3x - circx) ** 2 + (t3y - circy) ** 2)).closeTo(r, 1E-12);

      expect((await components['/t'].stateValues.vertices)[0][0].tree).closeTo(t1x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[0][1].tree).closeTo(t1y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][0].tree).closeTo(t2x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][1].tree).closeTo(t2y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][0].tree).closeTo(t3x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][1].tree).closeTo(t3y, 1E-12);
      expect(components['/c'].stateValues.center[0].tree).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.center[1].tree).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.radius.tree).closeTo(r, 1E-12);
      expect(components['/x'].stateValues.xs[0].tree).closeTo(circx, 1E-12);
      expect(components['/y'].stateValues.xs[1].tree).closeTo(circy, 1E-12);
      expect(components['/r'].stateValues.xs[0].tree).closeTo(r, 1E-12);

    })

    cy.log("move circle via center")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let dx = 2, dy = -3;
      circx += dx;
      circy += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await components['/c'].moveCircle({ center: [circx, circy] });

      expect(components['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.numericalRadius).closeTo(r, 1E-12);

      expect((await components['/t'].stateValues.vertices)[0][0].tree).closeTo(t1x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[0][1].tree).closeTo(t1y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][0].tree).closeTo(t2x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][1].tree).closeTo(t2y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][0].tree).closeTo(t3x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][1].tree).closeTo(t3y, 1E-12);
      expect(components['/c'].stateValues.center[0].tree).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.center[1].tree).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.radius.tree).closeTo(r, 1E-12);
      expect(components['/x'].stateValues.xs[0].tree).closeTo(circx, 1E-12);
      expect(components['/y'].stateValues.xs[1].tree).closeTo(circy, 1E-12);
      expect(components['/r'].stateValues.xs[0].tree).closeTo(r, 1E-12);

    })


    cy.log("move circle center x")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let dx = -5;
      circx += dx;
      t1x += dx;
      t2x += dx;
      t3x += dx;

      await components['/x'].movePoint({ x: circx });

      expect(components['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.numericalRadius).closeTo(r, 1E-12);

      expect((await components['/t'].stateValues.vertices)[0][0].tree).closeTo(t1x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[0][1].tree).closeTo(t1y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][0].tree).closeTo(t2x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][1].tree).closeTo(t2y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][0].tree).closeTo(t3x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][1].tree).closeTo(t3y, 1E-12);
      expect(components['/c'].stateValues.center[0].tree).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.center[1].tree).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.radius.tree).closeTo(r, 1E-12);
      expect(components['/x'].stateValues.xs[0].tree).closeTo(circx, 1E-12);
      expect(components['/y'].stateValues.xs[1].tree).closeTo(circy, 1E-12);
      expect(components['/r'].stateValues.xs[0].tree).closeTo(r, 1E-12);

    })



    cy.log("move circle center y")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let dy = 6;
      circy += dy;
      t1y += dy;
      t2y += dy;
      t3y += dy;

      await components['/y'].movePoint({ y: circy });

      expect(components['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.numericalRadius).closeTo(r, 1E-12);

      expect((await components['/t'].stateValues.vertices)[0][0].tree).closeTo(t1x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[0][1].tree).closeTo(t1y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][0].tree).closeTo(t2x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][1].tree).closeTo(t2y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][0].tree).closeTo(t3x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][1].tree).closeTo(t3y, 1E-12);
      expect(components['/c'].stateValues.center[0].tree).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.center[1].tree).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.radius.tree).closeTo(r, 1E-12);
      expect(components['/x'].stateValues.xs[0].tree).closeTo(circx, 1E-12);
      expect(components['/y'].stateValues.xs[1].tree).closeTo(circy, 1E-12);
      expect(components['/r'].stateValues.xs[0].tree).closeTo(r, 1E-12);

    })

    cy.log("shrink radius")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let radiusfactor = 0.4;

      r = r * radiusfactor;

      t1x = circx + (t1x - circx) * radiusfactor;
      t1y = circy + (t1y - circy) * radiusfactor;
      t2x = circx + (t2x - circx) * radiusfactor;
      t2y = circy + (t2y - circy) * radiusfactor;
      t3x = circx + (t3x - circx) * radiusfactor;
      t3y = circy + (t3y - circy) * radiusfactor;

      await components['/r'].movePoint({ x: r });

      expect(components['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.numericalRadius).closeTo(r, 1E-12);

      expect((await components['/t'].stateValues.vertices)[0][0].tree).closeTo(t1x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[0][1].tree).closeTo(t1y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][0].tree).closeTo(t2x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][1].tree).closeTo(t2y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][0].tree).closeTo(t3x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][1].tree).closeTo(t3y, 1E-12);
      expect(components['/c'].stateValues.center[0].tree).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.center[1].tree).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.radius.tree).closeTo(r, 1E-12);
      expect(components['/x'].stateValues.xs[0].tree).closeTo(circx, 1E-12);
      expect(components['/y'].stateValues.xs[1].tree).closeTo(circy, 1E-12);
      expect(components['/r'].stateValues.xs[0].tree).closeTo(r, 1E-12);

    })

    cy.log("shrink radius to zero")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/r'].movePoint({ x: -3 }); // overshoot

      expect(components['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.numericalRadius).closeTo(0, 1E-12);

      expect((await components['/t'].stateValues.vertices)[0][0].tree).closeTo(circx, 1E-12);
      expect((await components['/t'].stateValues.vertices)[0][1].tree).closeTo(circy, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][0].tree).closeTo(circx, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][1].tree).closeTo(circy, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][0].tree).closeTo(circx, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][1].tree).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.center[0].tree).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.center[1].tree).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.radius.tree).closeTo(0, 1E-12);
      expect(components['/x'].stateValues.xs[0].tree).closeTo(circx, 1E-12);
      expect(components['/y'].stateValues.xs[1].tree).closeTo(circy, 1E-12);
      expect(components['/r'].stateValues.xs[0].tree).closeTo(0, 1E-12);

    })

    cy.log("increase radius to 6")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let radiusfactor = 6 / r;

      r = r * radiusfactor;

      t1x = circx + (t1x - circx) * radiusfactor;
      t1y = circy + (t1y - circy) * radiusfactor;
      t2x = circx + (t2x - circx) * radiusfactor;
      t2y = circy + (t2y - circy) * radiusfactor;
      t3x = circx + (t3x - circx) * radiusfactor;
      t3y = circy + (t3y - circy) * radiusfactor;

      await components['/r'].movePoint({ x: r });

      expect(components['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.numericalRadius).closeTo(r, 1E-12);

      expect((await components['/t'].stateValues.vertices)[0][0].tree).closeTo(t1x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[0][1].tree).closeTo(t1y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][0].tree).closeTo(t2x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[1][1].tree).closeTo(t2y, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][0].tree).closeTo(t3x, 1E-12);
      expect((await components['/t'].stateValues.vertices)[2][1].tree).closeTo(t3y, 1E-12);
      expect(components['/c'].stateValues.center[0].tree).closeTo(circx, 1E-12);
      expect(components['/c'].stateValues.center[1].tree).closeTo(circy, 1E-12);
      expect(components['/c'].stateValues.radius.tree).closeTo(r, 1E-12);
      expect(components['/x'].stateValues.xs[0].tree).closeTo(circx, 1E-12);
      expect(components['/y'].stateValues.xs[1].tree).closeTo(circy, 1E-12);
      expect(components['/r'].stateValues.xs[0].tree).closeTo(r, 1E-12);

    })



  })

  it('circle where radius depends on center', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math hide name="r"><extract prop="y"><copy prop="center" tname="_circle1" /></extract></math>
  <graph>
    <circle radius="$r" center="(1,2)" />
    <copy prop="center" tname="_circle1" />
  </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 2]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(2);
      expect(components['/_copy2'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_circle1'].moveCircle({ center: [-3, 5] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, 5]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
      expect(components['/_copy2'].replacements[0].stateValues.coords.tree).eqls(["vector", -3, 5])
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_copy2'].replacements[0].movePoint({ x: 8, y: 7 });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([8, 7]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(7);
      expect(components['/_copy2'].replacements[0].stateValues.coords.tree).eqls(["vector", 8, 7])
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_circle1'].moveCircle({ center: [3, -2] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([3, -2]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(0);
      expect(components['/_copy2'].replacements[0].stateValues.coords.tree).eqls(["vector", 3, -2])
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_copy2'].replacements[0].movePoint({ x: 1, y: 4 });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 4]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(4);
      expect(components['/_copy2'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 4])
    })

  })

  it('circle where center depends on radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle radius="2" center="(1,$(_circle1{prop='radius'}))" />
    <copy prop="center" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 2]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(2);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_circle1'].moveCircle({ center: [-3, 5] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, 5]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", -3, 5])
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_copy1'].replacements[0].movePoint({ x: 8, y: 7 });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([8, 7]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(7);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 8, 7])
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_circle1'].moveCircle({ center: [3, -2] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([3, 0]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(0);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 3, 0])
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_copy1'].replacements[0].movePoint({ x: 1, y: 4 });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 4]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(4);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 4])
    })

  })

  it('circle where center depends on diameter', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle radius="2" center="(1,$(_circle1{prop='diameter'}))" />
    <copy prop="center" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 4]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(2);
      expect(components['/_circle1'].stateValues.diameter.tree).eq(4);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 4])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_circle1'].moveCircle({ center: [-3, 6] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, 6]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(3);
      expect(components['/_circle1'].stateValues.diameter.tree).eq(6);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", -3, 6])
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_copy1'].replacements[0].movePoint({ x: 8, y: 4 });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([8, 4]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(2);
      expect(components['/_circle1'].stateValues.diameter.tree).eq(4);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 8, 4])
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_circle1'].moveCircle({ center: [3, -2] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([3, 0]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(0);
      expect(components['/_circle1'].stateValues.diameter.tree).eq(0);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 3, 0])
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_copy1'].replacements[0].movePoint({ x: 1, y: 8 });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 8]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(4);
      expect(components['/_circle1'].stateValues.diameter.tree).eq(8);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 8])
    })

  })

  it('circle where center depends on unspecified radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle center="(1,$(_circle1{prop='radius'}))" />
    <copy prop="center" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 1]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(1);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 1])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_circle1'].moveCircle({ center: [-3, 5] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, 5]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(5);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", -3, 5])
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_copy1'].replacements[0].movePoint({ x: 8, y: 7 });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([8, 7]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(7);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 8, 7])
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_circle1'].moveCircle({ center: [3, -2] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([3, 0]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(0);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 3, 0])
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_copy1'].replacements[0].movePoint({ x: 1, y: 4 });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 4]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(4);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 4])
    })

  })

  it('circle where single through point depends on radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle radius="2" through="(1,2$(_circle1{prop='radius'}))" />
    <copy prop="center" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 2]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(2);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 5;
      let actualHeight = (5 + 2) / 2;
      // given previous radius is 2, would move through point to 5+2,
      // so that center of circle would be (5+2)/2
      await components['/_circle1'].moveCircle({ center: [-3, desiredHeight] });

      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", -3, actualHeight])
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 7;
      let actualHeight = (7 + 3.5) / 2;  // given previous radius is 3.5
      await components['/_copy1'].replacements[0].movePoint({ x: 8, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([8, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 8, actualHeight])
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_circle1'].moveCircle({ center: [4, -6] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([4, 0]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(0);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 4, 0])
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 4;
      let actualHeight = (4 + 0) / 2;  // given previous radius is 0
      await components['/_copy1'].replacements[0].movePoint({ x: 1, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, actualHeight])
    })

  })

  it('circle where single through point depends on unspecified radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle through="(1,2$(_circle1{prop='radius'}))" />
    <copy prop="center" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 1]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(1);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 1])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 5;
      let actualHeight = (5 + 1) / 2;
      // given previous radius is 1, would move through point to 5+1,
      // so that center of circle would be (5+1)/2
      await components['/_circle1'].moveCircle({ center: [-3, desiredHeight] });

      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", -3, actualHeight])
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 7;
      let actualHeight = (7 + 3) / 2;  // given previous radius is 3
      await components['/_copy1'].replacements[0].movePoint({ x: 8, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([8, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 8, actualHeight])
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_circle1'].moveCircle({ center: [4, -6] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([4, 0]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(0);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 4, 0])
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 4;
      let actualHeight = (4 + 0) / 2;  // given previous radius is 0
      await components['/_copy1'].replacements[0].movePoint({ x: 1, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, actualHeight])
    })

  })

  it('circle where radius depends on single through point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="r" hide><extract prop="y"><copy prop="throughPoint1" tname="_circle1" /></extract>/2</math>
  <graph>
    <circle radius="$r" through="(1,4)" />
    <copy prop="center" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 2]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(2);
      expect(components['/_copy2'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 5;
      let actualHeight = (5 + 2) / 2;
      // given previous radius is 2, would move through point to 5+2,
      // so that center of circle would be (5+2)/2
      await components['/_circle1'].moveCircle({ center: [-3, desiredHeight] });

      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy2'].replacements[0].stateValues.coords.tree).eqls(["vector", -3, actualHeight])
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 7;
      let actualHeight = (7 + 3.5) / 2;  // given previous radius is 3.5
      await components['/_copy2'].replacements[0].movePoint({ x: 8, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([8, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy2'].replacements[0].stateValues.coords.tree).eqls(["vector", 8, actualHeight])
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = -6;
      let actualHeight = -6 + 5.25
      // would move through point to -6+5.25,
      // but radius becomes zero, so center is at -6+5.25
      await components['/_circle1'].moveCircle({ center: [4, desiredHeight] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([4, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(0);
      expect(components['/_copy2'].replacements[0].stateValues.coords.tree).eqls(["vector", 4, actualHeight])
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 4;
      let actualHeight = (4 + 0) / 2;  // given previous radius is 0
      await components['/_copy2'].replacements[0].movePoint({ x: 1, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy2'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, actualHeight])
    })

  })

  it('circle where center depends on through point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle through="(1,4)" center="($(_circle1{prop='throughPointX1_1'}), $(_circle1{prop='throughPointX1_2'})/2)"/>
    <copy prop="center" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 2]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(2);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 5;
      let actualHeight = (5 + 2) / 2;
      // given previous radius is 2, would move through point to 5+2,
      // so that center of circle would be (5+2)/2
      await components['/_circle1'].moveCircle({ center: [-3, desiredHeight] });

      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", -3, actualHeight])
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 7;
      let actualHeight = 7;  // since moving center itself
      await components['/_copy1'].replacements[0].movePoint({ x: 8, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([8, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 8, actualHeight])
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = -8;
      let actualHeight = (-8 + 7) / 2; // given previous radius is 7
      await components['/_circle1'].moveCircle({ center: [4, desiredHeight] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([4, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(-actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 4, actualHeight])
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 4;
      let actualHeight = 4;  // since moving point itself
      await components['/_copy1'].replacements[0].movePoint({ x: 1, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, actualHeight])
    })

  })

  it('circle where through point depends on center', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle through="($(_circle1{prop='centerX1'}),$(_circle1{prop='centerX2'})2)" center="(1,2)" />
    <copy prop="center" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 2]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(2);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 5;
      let actualHeight = (5 + 2) / 2;
      // given previous radius is 2, would move through point to 5+2,
      // so that center of circle would be (5+2)/2
      await components['/_circle1'].moveCircle({ center: [-3, desiredHeight] });

      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", -3, actualHeight])
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 7;
      let actualHeight = 7;  // since moving center itself
      await components['/_copy1'].replacements[0].movePoint({ x: 8, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([8, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 8, actualHeight])
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = -8;
      let actualHeight = (-8 + 7) / 2; // given previous radius is 7
      await components['/_circle1'].moveCircle({ center: [4, desiredHeight] });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([4, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(-actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 4, actualHeight])
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 4;
      let actualHeight = 4;  // since moving point itself
      await components['/_copy1'].replacements[0].movePoint({ x: 1, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(actualHeight);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, actualHeight])
    })

  })

  it('circle where one center component depends on other center component', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle center="(1, $(_circle1{prop='centerX1'})+1)" />
    <copy prop="center" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([1, 2]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(1);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 5;
      let actualHeight = -2;
      await components['/_circle1'].moveCircle({ center: [-3, desiredHeight] });

      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([-3, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(1);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", -3, actualHeight])
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let desiredHeight = 7;
      let actualHeight = 9;  // since moving center itself
      await components['/_copy1'].replacements[0].movePoint({ x: 8, y: desiredHeight });
      expect(components['/_circle1'].stateValues.center.map(x => x.tree)).eqls([8, actualHeight]);
      expect((await components['/_circle1'].stateValues.radius).tree).eq(1);
      expect(components['/_copy1'].replacements[0].stateValues.coords.tree).eqls(["vector", 8, actualHeight])
    })

  })

  it('circle where radius depends on two through points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math hide name="r">
    abs(<extract prop="x"><copy prop="throughPoint1" tname="_circle1" /></extract>
      -<extract prop="x"><copy prop="throughPoint2" tname="_circle1" /></extract>)
  </math>
  <graph>
    <circle radius="$r" through="(1,2) (3,4)" />
    <copy prop="center" name="centerPoint" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let centerPoint = components["/centerPoint"].replacements[0];
      let throughComponent = components["/_circle1"].attributes["through"].component;
      let throughPoint1 = throughComponent.activeChildren[0];
      let throughPoint2 = throughComponent.activeChildren[1];

      let t1x = 1, t1y = 2;
      let t2x = 3, t2y = 4;

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let r = Math.abs(t1x - t2x);
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect((await components['/_circle1'].stateValues.throughPoints)[0].map(x => x.tree)).eqls([t1x, t1y])
        expect((await components['/_circle1'].stateValues.throughPoints)[1].map(x => x.tree)).eqls([t2x, t2y])
        expect((await throughPoint1.stateValues.coords).tree).eqls(["vector", t1x, t1y])
        expect((await throughPoint2.stateValues.coords).tree).eqls(["vector", t2x, t2y])

      })

      cy.log("move circle");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let numericalCenter = components['/_circle1'].stateValues.numericalCenter;
        let dx = 2, dy = -3;
        let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;

        await components['/_circle1'].moveCircle({ center: newCenter });

        let r = Math.abs(t1x - t2x);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(newCenter[0], 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(newCenter[1], 1E-12);
      })

      cy.log("move center point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let numericalCenter = components['/_circle1'].stateValues.numericalCenter;
        let dx = -5, dy = -2;
        let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;

        await centerPoint.movePoint({ x: newCenter[0], y: newCenter[1] });

        let r = Math.abs(t1x - t2x);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(newCenter[0], 1E-12);
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(newCenter[1], 1E-12);

      })

      cy.log("move first through point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t1x = 6;
        t1y = 3;
        await throughPoint1.movePoint({ x: t1x, y: t1y });

        let r = Math.abs(t1x - t2x);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);


      })


      cy.log("move second through point under first through point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2x = 5;
        t2y = -3;
        await throughPoint2.movePoint({ x: t2x, y: t2y });

        let r = Math.abs(t1x - t2x);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).false;


      })


      cy.log("move second through point close enough to make circle");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2y = 1.5;
        await throughPoint2.movePoint({ x: t2x, y: t2y });

        let r = Math.abs(t1x - t2x);
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).true;


      })


    })
  })

  it('circle with dependencies among radius and two through points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="r" hide>
    <extract prop="x"><copy prop="throughPoint1" tname="_circle1" /></extract>
  </math>
  <graph>
    <circle radius="$r" through="(1,2) ($(_circle1{prop='radius'})+1,3)" />
    <copy prop="center" name="centerPoint" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let centerPoint = components["/centerPoint"].replacements[0];
      let throughComponent = components["/_circle1"].attributes["through"].component;
      let throughPoint1 = throughComponent.activeChildren[0];
      let throughPoint2 = throughComponent.activeChildren[1];

      let t1x = 1, t1y = 2;
      let t2x = 2, t2y = 3;

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let r = t1x;
        expect((await components['/_circle1'].stateValues.radius).tree).eq(r);
        expect((await components['/_circle1'].stateValues.throughPoints)[0].map(x => x.tree)).eqls([t1x, t1y])
        expect((await components['/_circle1'].stateValues.throughPoints)[1].map(x => x.tree)).eqls([t2x, t2y])
        expect((await throughPoint1.stateValues.coords).tree).eqls(["vector", t1x, t1y])
        expect((await throughPoint2.stateValues.coords).tree).eqls(["vector", t2x, t2y])

      })

      cy.log("move circle");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let numericalCenter = components['/_circle1'].stateValues.numericalCenter;
        let dx = 2, dy = -3;
        let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;

        await components['/_circle1'].moveCircle({ center: newCenter });

        let r = t1x;
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).true;
      })

      cy.log("move center point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let numericalCenter = components['/_circle1'].stateValues.numericalCenter;
        let dx = -1, dy = -2;
        let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;

        await centerPoint.movePoint({ x: newCenter[0], y: newCenter[1] });

        let r = t1x
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).true;

      })

      cy.log("move first through point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t1x = 6;
        t1y = 3;
        await throughPoint1.movePoint({ x: t1x, y: t1y });

        let r = t1x;
        t2x = t1x + 1;
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);


      })


      cy.log("move second through point under first through point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2y = -9;
        await throughPoint2.movePoint({ x: t2x, y: t2y });

        let r = t1x;
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).false;


      })


      cy.log("move second through point to the right");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2x = 8;
        await throughPoint2.movePoint({ x: t2x, y: t2y });

        t1x = t2x - 1;
        let r = t1x;

        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).true;


      })


    })
  })

  it('circle where through point 2 depends on through point 1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle through="(1,2) ($(_circle1{prop='throughPointX1_1'})+1,3)"/>
    <copy prop="center" name="centerPoint" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let centerPoint = components["/centerPoint"].replacements[0];
      let throughComponent = components["/_circle1"].attributes["through"].component;
      let throughPoint1 = throughComponent.activeChildren[0];
      let throughPoint2 = throughComponent.activeChildren[1];

      let t1x = 1, t1y = 2;
      let t2x = 2, t2y = 3;

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;

        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);
        expect((await components['/_circle1'].stateValues.throughPoints)[0].map(x => x.tree)).eqls([t1x, t1y])
        expect((await components['/_circle1'].stateValues.throughPoints)[1].map(x => x.tree)).eqls([t2x, t2y])
        expect((await throughPoint1.stateValues.coords).tree).eqls(["vector", t1x, t1y])
        expect((await throughPoint2.stateValues.coords).tree).eqls(["vector", t2x, t2y])

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12)
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12)

      })

      cy.log("move circle");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;

        let dx = 2, dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;

        await components['/_circle1'].moveCircle({ center: [cx, cy] });

        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12)
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12)
      })

      cy.log("move center point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;

        let dx = -1, dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;

        await centerPoint.movePoint({ x: cx, y: cy });

        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12)
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12)

      })

      cy.log("move first through point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t1x = 6;
        t1y = 3;
        await throughPoint1.movePoint({ x: t1x, y: t1y });

        t2x = t1x + 1;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;

        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12)
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12)

      })


      cy.log("move second through point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2x = -7;
        t2y = -9;
        await throughPoint2.movePoint({ x: t2x, y: t2y });

        t1x = t2x - 1;
        let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;

        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12)
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12)

      })


    })
  })

  it('circle with dependencies among three through points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle through="($(_circle1{prop='throughPointX2_1'})+1,3) (1,2) ($(_circle1{prop='throughPointX1_1'})+1,5)" />
    <copy prop="center" name="centerPoint" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let centerPoint = components["/centerPoint"].replacements[0];
      let throughComponent = components["/_circle1"].attributes["through"].component;
      let throughPoint1 = throughComponent.activeChildren[0];
      let throughPoint2 = throughComponent.activeChildren[1];
      let throughPoint3 = throughComponent.activeChildren[2];

      let t1x = 2, t1y = 3;
      let t2x = 1, t2y = 2;
      let t3x = 3, t3y = 5;

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);


        expect(Number.isFinite((await components['/_circle1'].stateValues.radius).tree)).true;
        expect((await components['/_circle1'].stateValues.throughPoints)[0].map(x => x.tree)).eqls([t1x, t1y])
        expect((await components['/_circle1'].stateValues.throughPoints)[1].map(x => x.tree)).eqls([t2x, t2y])
        expect((await components['/_circle1'].stateValues.throughPoints)[2].map(x => x.tree)).eqls([t3x, t3y])
        expect((await throughPoint1.stateValues.coords).tree).eqls(["vector", t1x, t1y])
        expect((await throughPoint2.stateValues.coords).tree).eqls(["vector", t2x, t2y])
        expect((await throughPoint3.stateValues.coords).tree).eqls(["vector", t3x, t3y])

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).true;

      })

      cy.log("move circle");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let numericalCenter = components['/_circle1'].stateValues.numericalCenter;
        let cx = numericalCenter[0];
        let cy = numericalCenter[1];

        let dx = 2, dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;

        let r = components['/_circle1'].stateValues.radius.tree;

        await components['/_circle1'].moveCircle({ center: [cx, cy] });

        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[2][0]).closeTo(t3x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[2][1]).closeTo(t3y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);
        expect((await throughPoint3.stateValues.xs)[0].tree).closeTo(t3x, 1E-12);
        expect((await throughPoint3.stateValues.xs)[1].tree).closeTo(t3y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12)
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12)
      })

      cy.log("move center point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);


        let numericalCenter = components['/_circle1'].stateValues.numericalCenter;
        let cx = numericalCenter[0];
        let cy = numericalCenter[1];

        let dx = -1, dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;

        let r = components['/_circle1'].stateValues.radius.tree;

        await centerPoint.movePoint({ x: cx, y: cy });

        expect((await components['/_circle1'].stateValues.radius).tree).closeTo(r, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[2][0]).closeTo(t3x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[2][1]).closeTo(t3y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);
        expect((await throughPoint3.stateValues.xs)[0].tree).closeTo(t3x, 1E-12);
        expect((await throughPoint3.stateValues.xs)[1].tree).closeTo(t3y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalCenter[0]).closeTo(cx, 1E-12)
        expect(components['/_circle1'].stateValues.numericalCenter[1]).closeTo(cy, 1E-12)

      })

      cy.log("move first through point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t1x = 6;
        t1y = 3;
        await throughPoint1.movePoint({ x: t1x, y: t1y });

        t3x = t1x + 1;
        t2x = t1x - 1;

        expect(Number.isFinite((await components['/_circle1'].stateValues.radius).tree)).true;

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[2][0]).closeTo(t3x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[2][1]).closeTo(t3y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);
        expect((await throughPoint3.stateValues.xs)[0].tree).closeTo(t3x, 1E-12);
        expect((await throughPoint3.stateValues.xs)[1].tree).closeTo(t3y, 1E-12);

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).true;

      })


      cy.log("move second through point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t2x = -7;
        t2y = -9;
        await throughPoint2.movePoint({ x: t2x, y: t2y });

        t1x = t2x + 1;
        t3x = t1x + 1;

        expect(Number.isFinite((await components['/_circle1'].stateValues.radius).tree)).true;

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[2][0]).closeTo(t3x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[2][1]).closeTo(t3y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);
        expect((await throughPoint3.stateValues.xs)[0].tree).closeTo(t3x, 1E-12);
        expect((await throughPoint3.stateValues.xs)[1].tree).closeTo(t3y, 1E-12);

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).true;

      })


      cy.log("move third through point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        t3x = 1;
        t3y = -2;
        await throughPoint3.movePoint({ x: t3x, y: t3y });

        t1x = t3x - 1;
        t2x = t1x - 1;

        expect(Number.isFinite((await components['/_circle1'].stateValues.radius).tree)).true;

        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect(components['/_circle1'].stateValues.numericalThroughPoints[2][0]).closeTo(t3x, 1E-12);
        expect(components['/_circle1'].stateValues.numericalThroughPoints[2][1]).closeTo(t3y, 1E-12);

        expect((await throughPoint1.stateValues.xs)[0].tree).closeTo(t1x, 1E-12);
        expect((await throughPoint1.stateValues.xs)[1].tree).closeTo(t1y, 1E-12);
        expect((await throughPoint2.stateValues.xs)[0].tree).closeTo(t2x, 1E-12);
        expect((await throughPoint2.stateValues.xs)[1].tree).closeTo(t2y, 1E-12);
        expect((await throughPoint3.stateValues.xs)[0].tree).closeTo(t3x, 1E-12);
        expect((await throughPoint3.stateValues.xs)[1].tree).closeTo(t3y, 1E-12);

        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(components['/_circle1'].stateValues.numericalCenter[1])).true;

      })


    })
  })

  it('essential center can combine coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle/>
    <point>
     (<extract prop="y"><copy prop="center" tname="_circle1" /></extract>,
     <extract prop="x"><copy prop="center" tname="_circle1" /></extract>)
    </point>
    <copy prop="center" name="centerPoint" tname="_circle1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let centerPoint = components["/centerPoint"].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        expect(components['/_circle1'].stateValues.numericalRadius).eq(1);
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([0, 0]);
        expect(centerPoint.stateValues.coords.tree).eqls(["vector", 0, 0])
        expect(components["/_point1"].stateValues.coords.tree).eqls(["vector", 0, 0])

      })

      cy.log("move circle");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_circle1'].moveCircle({ center: [-7, 2] });
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([-7, 2]);
        expect(centerPoint.stateValues.coords.tree).eqls(["vector", -7, 2])
        expect(components["/_point1"].stateValues.coords.tree).eqls(["vector", 2, -7])
      })

      cy.log("move flipped point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components["/_point1"].movePoint({ x: -3, y: -5 });
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([-5, -3]);
        expect(centerPoint.stateValues.coords.tree).eqls(["vector", -5, -3])
        expect(components["/_point1"].stateValues.coords.tree).eqls(["vector", -3, -5])

      })

      cy.log("move center point");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await centerPoint.movePoint({ x: 1, y: -4 });
        expect(components['/_circle1'].stateValues.numericalCenter).eqls([1, -4]);
        expect(centerPoint.stateValues.coords.tree).eqls(["vector", 1, -4])
        expect(components["/_point1"].stateValues.coords.tree).eqls(["vector", -4, 1])

      })


    })
  })

  it('handle initially undefined center', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Center: <mathinput name="c" /></p>
  <graph>
    <circle center="$c" name="circ" />
  </graph>
  <graph>
    <copy tname="circ" assignNames="circ2" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/circ'].stateValues.numericalCenter).eqls([NaN, NaN]);
      expect(components['/circ'].stateValues.numericalRadius).eq(1);
      expect(components['/circ2'].stateValues.numericalCenter).eqls([NaN, NaN]);
      expect(components['/circ2'].stateValues.numericalRadius).eq(1);
    });

    cy.log("enter point for center");
    cy.get('#\\/c textarea').type("(2,1){enter}", { force: true })
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/circ'].stateValues.numericalCenter).eqls([2,1]);
      expect(components['/circ'].stateValues.numericalRadius).eq(1);
      expect(components['/circ2'].stateValues.numericalCenter).eqls([2,1]);
      expect(components['/circ2'].stateValues.numericalRadius).eq(1);
    })

    cy.log(`move circle`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/circ'].moveCircle({ center: [-7, 2] });
      expect(components['/circ'].stateValues.numericalCenter).eqls([-7,2]);
      expect(components['/circ'].stateValues.numericalRadius).eq(1);
      expect(components['/circ2'].stateValues.numericalCenter).eqls([-7,2]);
      expect(components['/circ2'].stateValues.numericalRadius).eq(1);
    })

    cy.log("change point for center");
    cy.get('#\\/c textarea').type("{end}{leftArrow}{backspace}-4{enter}", { force: true })
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/circ'].stateValues.numericalCenter).eqls([-7,-4]);
      expect(components['/circ'].stateValues.numericalRadius).eq(1);
      expect(components['/circ2'].stateValues.numericalCenter).eqls([-7,-4]);
      expect(components['/circ2'].stateValues.numericalRadius).eq(1);
    })

    cy.log(`move circle2`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/circ2'].moveCircle({ center: [6,9] });
      expect(components['/circ'].stateValues.numericalCenter).eqls([6,9]);
      expect(components['/circ'].stateValues.numericalRadius).eq(1);
      expect(components['/circ2'].stateValues.numericalCenter).eqls([6,9]);
      expect(components['/circ2'].stateValues.numericalRadius).eq(1);
    })

    cy.log("center undefined again");
    cy.get('#\\/c textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}", { force: true })
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/circ'].stateValues.numericalCenter).eqls([NaN,NaN]);
      expect(components['/circ'].stateValues.numericalRadius).eq(1);
      expect(components['/circ2'].stateValues.numericalCenter).eqls([NaN,NaN]);
      expect(components['/circ2'].stateValues.numericalRadius).eq(1);
    })

    cy.log("enter new point for center");
    cy.get('#\\/c textarea').type("(5,4){enter}", { force: true })
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/circ'].stateValues.numericalCenter).eqls([5,4]);
      expect(components['/circ'].stateValues.numericalRadius).eq(1);
      expect(components['/circ2'].stateValues.numericalCenter).eqls([5,4]);
      expect(components['/circ2'].stateValues.numericalRadius).eq(1);
    })

  })


});
