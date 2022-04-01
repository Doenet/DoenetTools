function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`
  } else {
    return String(n);
  }
}

describe('Circle Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
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
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <copy prop="center" assignNames="centerPoint2" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([0, 0]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([0, 0]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(1);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([0, 0]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([0, 0]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([0, 0]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([0, 0]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(1);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(0);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(1);
    })

    cy.log("move circle")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [2, 3] }
      });
    });

    cy.get('#\\/centerPoint2').should('contain.text', '(2,3)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_circle1'].stateValues.center).eqls([2, 3]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([2, 3]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(1);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([2, 3]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([2, 3]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([2, 3]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([2, 3]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(1);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(3);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(1);
    })


    cy.log("change radius")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 5, y: 0 }
      });
    })

    cy.get('#\\/radiusNumber').should('contain.text', '5')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_circle1'].stateValues.center).eqls([2, 3]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([2, 3]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([2, 3]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([2, 3]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([2, 3]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([2, 3]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(5);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(3);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    })

    cy.log("change center")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: -6, y: -2 }
      });
    })

    cy.get('#\\/centerPoint2').should('contain.text', '(−6,−2)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([-6, -2]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([-6, -2]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([-6, -2]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([-6, -2]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([-6, -2]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([-6, -2]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(5);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-6);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(-2);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    })

    cy.log("move circle2")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [-7, 9] }
      });
    });

    cy.get('#\\/centerPoint2').should('contain.text', '(−7,9)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([-7, 9]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([-7, 9]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([-7, 9]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([-7, 9]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([-7, 9]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([-7, 9]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(5);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-7);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(9);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    })


    cy.log("move circle3")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [6, -8] }
      });
    });

    cy.get('#\\/centerPoint2').should('contain.text', '(6,−8)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([6, -8]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([6, -8]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([6, -8]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([6, -8]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([6, -8]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([6, -8]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(5);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(6);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(-8);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    })



  });

  it('circle with center', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="center">(-1,3)</point>
      <circle center="$center" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point name="radiusPoint" x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <copy prop="center" assignNames="centerPoint2" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([-1, 3]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([-1, 3]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(1);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([-1, 3]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([-1, 3]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([-1, 3]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([-1, 3]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(1);
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(-1);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(3);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-1);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(3);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(1);
    })

    cy.log("move circle")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [2, 4] }
      });
    })

    cy.get('#\\/centerPoint2').should('contain.text', '(2,4)')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_circle1'].stateValues.center).eqls([2, 4]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([2, 4]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(1);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([2, 4]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([2, 4]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(1);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([2, 4]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([2, 4]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(1);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(1);
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(4);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(1);
    })


    cy.log("change radius")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/radiusPoint",
        args: { x: 5, y: 0 }
      });

    })

    cy.get('#\\/radiusNumber').should('contain.text', '5')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([2, 4]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([2, 4]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([2, 4]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([2, 4]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([2, 4]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([2, 4]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(5);
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(4);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(2);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(4);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    })

    cy.log("change center via defining point")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/center",
        args: { x: -6, y: -2 }
      });

    })

    cy.get('#\\/centerPoint2').should('contain.text', '(−6,−2)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([-6, -2]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([-6, -2]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([-6, -2]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([-6, -2]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([-6, -2]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([-6, -2]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(5);
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(-6);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(-2);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-6);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(-2);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    })


    cy.log("change center via reffed point")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: -7, y: 8 }
      });

    })

    cy.get('#\\/centerPoint2').should('contain.text', '(−7,8)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([-7, 8]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([-7, 8]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([-7, 8]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([-7, 8]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([-7, 8]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([-7, 8]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(5);
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(-7);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(8);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-7);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(8);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    })

    cy.log("move circle2")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [9, -10] }
      });
    })

    cy.get('#\\/centerPoint2').should('contain.text', '(9,−10)')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([9, -10]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([9, -10]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([9, -10]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([9, -10]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([9, -10]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([9, -10]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(5);
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(9);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(-10);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(9);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(-10);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    })

    cy.log("move circle3")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [-3, -4] }
      });
    })

    cy.get('#\\/centerPoint2').should('contain.text', '(−3,−4)')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, -4]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([-3, -4]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([-3, -4]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([-3, -4]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([-3, -4]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([-3, -4]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(5);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(5);
      expect((await stateVariables["/center"].stateValues.xs)[0]).eq(-3);
      expect(stateVariables["/center"].stateValues.xs[1]).eq(-4);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(-3);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(-4);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(5);
    })

  });

  it('circle with radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" target="_point1" /></math>
    <graph>
    <point>(2,0)</point>
    <circle radius="$pX" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="center" assignNames="centerPoint2" target="_circle1" />
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 0, y = 0, r = 2;
      expect(stateVariables['/_circle1'].stateValues.center).eqls([x, y]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([x, y]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([x, y]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([x, y]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([x, y]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
      expect(stateVariables['/_point1'].stateValues.xs[0]).eq(r);
      expect(stateVariables['/_point1'].stateValues.xs[1]).eq(0);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
    })

    cy.log("move circle")
    cy.window().then(async (win) => {
      let x = 3, y = 4, r = 2;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [x, y] }
      });


      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([x, y]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })


    cy.log("change radius with defining point")
    cy.window().then(async (win) => {
      let x = 3, y = 4, r = 5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: r, y: 0 }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([x, y]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })


    cy.log("change radius with reffed point")
    cy.window().then(async (win) => {
      let x = 3, y = 4, r = 7;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: r, y: 0 }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([x, y]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })

    cy.log("change center with reffed point")
    cy.window().then(async (win) => {
      let x = -5, y = -2, r = 7;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: x, y: y }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([x, y]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })

    cy.log("move circle2")
    cy.window().then(async (win) => {
      let x = 9, y = -10, r = 7;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [x, y] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([x, y]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })

    cy.log("move circle3")
    cy.window().then(async (win) => {
      let x = -3, y = -4, r = 7;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [x, y] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(x)},${nInDOM(y)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([x, y]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([x, y]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([x, y]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([x, y]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(0);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(x);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
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
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <copy prop="center" assignNames="centerPoint2" target="_circle1" />
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let tx = 2, ty = -3;
      let r = 1;
      let cnx = tx, cny = ty - r;
      expect(stateVariables['/_circle1'].stateValues.center).eqls([cnx, cny]);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([cnx, cny]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
      expect(stateVariables["/graph3/circle"].stateValues.center).eqls([cnx, cny]);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
      expect(stateVariables["/graph4/circle"].stateValues.center).eqls([cnx, cny]);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
      expect(stateVariables['/_point1'].stateValues.xs[0]).eq(tx);
      expect(stateVariables['/_point1'].stateValues.xs[1]).eq(ty);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(cnx);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
      expect(stateVariables['/_point2'].stateValues.xs[0]).eq(r);
      expect(stateVariables['/_point2'].stateValues.xs[1]).eq(0);
      expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
    })

    cy.log("move circle")
    cy.window().then(async (win) => {
      let tx = -4, ty = 7;
      let r = 1;
      let cnx = tx, cny = ty - r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(tx);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(cnx);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables['/_point2'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point2'].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })

    cy.log("move through point")
    cy.window().then(async (win) => {
      let tx = -5, ty = 9;
      let r = 1;
      let cnx = tx, cny = ty - r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: tx, y: ty }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(tx);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(cnx);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables['/_point2'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point2'].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })

    cy.log("move reffed center")
    cy.window().then(async (win) => {
      let tx = 3, ty = -3;
      let r = 1;
      let cnx = tx, cny = ty - r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(tx);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(cnx);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables['/_point2'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point2'].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })

    cy.log("change reffed radius, center moves")
    cy.window().then(async (win) => {
      let r = 3;
      let cnx = 3, cny = -6;
      let tx = 3, ty = cny + r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: r, y: 0 }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(tx);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(cnx);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables['/_point2'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point2'].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })

    cy.log("try to make radius negative")
    cy.window().then(async (win) => {
      let rtry = -3;
      let r = 0;
      let cnx = 3, cny = -3;
      let tx = 3, ty = cny + r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: rtry, y: 0 }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(tx);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(cnx);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables['/_point2'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point2'].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })

    cy.log("make radius positive again")
    cy.window().then(async (win) => {
      let r = 2;
      let cnx = 3, cny = -5;
      let tx = 3, ty = cny + r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: r, y: 0 }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(tx);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(cnx);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables['/_point2'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point2'].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })


    cy.log("move circle2")
    cy.window().then(async (win) => {
      let r = 2;
      let cnx = 9, cny = -10;
      let tx = 9, ty = cny + r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(tx);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(cnx);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables['/_point2'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point2'].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
      })
    })


    cy.log("move circle3")
    cy.window().then(async (win) => {
      let r = 2;
      let cnx = -3, cny = -4;
      let tx = -3, ty = cny + r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.center).eqls([cnx, cny]);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter).eqls([cnx, cny]);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).eq(r);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).eq(r);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(tx);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(ty);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).eq(cnx);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).eq(cny);
        expect(stateVariables['/_point2'].stateValues.xs[0]).eq(r);
        expect(stateVariables['/_point2'].stateValues.xs[1]).eq(0);
        expect(stateVariables["/radiusNumber"].stateValues.value).eq(r);
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
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" target="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 2, t1y = -3;
      let t2x = 3, t2y = 4;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
    })

    cy.log('move circle')
    cy.window().then(async (win) => {
      let t1x = -2, t1y = 0;
      let t2x = -1, t2y = 7;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move first through point')
    cy.window().then(async (win) => {
      let t1x = 4, t1y = -1;
      let t2x = -1, t2y = 7;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move second through point on top of first')
    cy.window().then(async (win) => {
      let t1x = 4, t1y = -1;
      let t2x = 4, t2y = -1;
      let r = 0;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move second through point again')
    cy.window().then(async (win) => {
      let t1x = 4, t1y = -1;
      let t2x = 8, t2y = -3;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move center')
    cy.window().then(async (win) => {
      let t1x = 4 + 2, t1y = -1 - 3;
      let t2x = 8 + 2, t2y = -3 - 3;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move radius to half size')
    cy.window().then(async (win) => {
      let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: r, y: 0 }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move circle2')
    cy.window().then(async (win) => {
      let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      let dx = 3, dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move circle3')
    cy.window().then(async (win) => {
      let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      let dx = -3, dy = 5;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
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
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" target="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 2, t1y = -3;
      let t2x = 3, t2y = 4;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
    })

    cy.log('move circle')
    cy.window().then(async (win) => {
      let t1x = -2, t1y = 0;
      let t2x = -1, t2y = 7;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move first through point')
    cy.window().then(async (win) => {
      let t1x = 4, t1y = -1;
      let t2x = -1, t2y = 7;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move second through point on top of first')
    cy.window().then(async (win) => {
      let t1x = 4, t1y = -1;
      let t2x = 4, t2y = -1;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move second through point again')
    cy.window().then(async (win) => {
      let t1x = 4, t1y = -1;
      let t2x = 8, t2y = -3;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move center')
    cy.window().then(async (win) => {
      let t1x = 4 + 2, t1y = -1 - 3;
      let t2x = 8 + 2, t2y = -3 - 3;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move radius to half size')
    cy.window().then(async (win) => {
      let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: r, y: 0 }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })


    cy.log('move circle2')
    cy.window().then(async (win) => {
      let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      let dx = 3, dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })


    cy.log('move circle3')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 8 + (4 + 2 - 8) / 2, t1y = -5 + (-1 - 3 + 5) / 2;
      let t2x = 8 + (8 + 2 - 8) / 2, t2y = -5 + (-3 - 3 + 5) / 2;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
      let cnx = (t1x + t2x) / 2, cny = (t1y + t2y) / 2;
      let dx = -3, dy = 5;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(cnx)},${nInDOM(cny)})`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
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
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" target="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <copy prop="diameter" assignNames="diam" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    let t1x = 2, t1y = -3;
    let t2x = 3, t2y = 4;
    let t3x = -3, t3y = 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
      let r = stateVariables['/_circle1'].stateValues.numericalRadius;

      expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);

      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
      expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
      expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
    })

    cy.log('move circle up and to the right')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
      let r = stateVariables['/_circle1'].stateValues.numericalRadius;

      let dx = 3, dy = 4;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('move first point to be in straight line')
    cy.window().then(async (win) => {

      t1x = -3, t1y = 8;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(＿,＿)`)
      cy.get('#\\/radiusNumber').should('contain.text', '＿')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.center[1])).false;
        expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.center[1])).false;
        expect(Number.isFinite((await stateVariables["/graph3/circle"].stateValues.radius))).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.center[1])).false;
        expect(Number.isFinite((await stateVariables["/graph4/circle"].stateValues.radius))).false;

        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect(Number.isFinite((await stateVariables["/centerPoint"].stateValues.xs)[0])).false;
        expect(Number.isFinite(stateVariables["/centerPoint"].stateValues.xs[1])).false;
        expect(Number.isFinite(stateVariables["/radiusNumber"].stateValues.value)).false;
        expect(Number.isFinite(stateVariables["/diam"].stateValues.value)).false;
      })
    })

    cy.log('move second point')
    cy.window().then(async (win) => {

      t2x = -4, t2y = -2;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(−1.5`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
        let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
        let r = stateVariables['/_circle1'].stateValues.numericalRadius;


        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))


        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);


        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('move third point')
    cy.window().then(async (win) => {

      t3x = 5, t3y = 3;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y }
      })


      cy.get('#\\/centerPoint2').should('contain.text', `(−0.7`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
        let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
        let r = stateVariables['/_circle1'].stateValues.numericalRadius;

        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))


        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('move points to be identical')
    cy.window().then(async (win) => {

      t1x = 5, t1y = 3;
      t2x = 5, t2y = 3;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })

      // should be a circle of radius zero
      let cnx = t1x;
      let cny = t1y;
      let r = 0;

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })


    cy.log('points 1 and 3 are identical')
    cy.window().then(async (win) => {

      t2x = 2, t2y = -7;

      // two points should be the diameter
      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('points 2 and 3 are identical')
    cy.window().then(async (win) => {

      t3x = 2, t3y = -7;

      // two points should be the diameter
      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y }
      })


      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('points 1 and 2 are identical')
    cy.window().then(async (win) => {

      t1x = 4, t1y = 9;
      t2x = 4, t2y = 9;

      // two points should be the diameter
      let cnx = (t1x + t3x) / 2;
      let cny = (t1y + t3y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })


    cy.log('move points apart again')
    cy.window().then(async (win) => {

      t2x = 2, t2y = -7;
      t3x = 0, t3y = -8;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(−3.6`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
        let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
        let r = stateVariables['/_circle1'].stateValues.numericalRadius;

        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })


    cy.log('move center by reffed point')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // calculate center and radius from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
      let r = stateVariables['/_circle1'].stateValues.numericalRadius;

      let dx = 2, dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('half radius around center')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // calculate center and radius from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
      let r = stateVariables['/_circle1'].stateValues.numericalRadius;

      r = r / 2;

      t1x = cnx + (t1x - cnx) / 2;
      t1y = cny + (t1y - cny) / 2;
      t2x = cnx + (t2x - cnx) / 2;
      t2y = cny + (t2y - cny) / 2;
      t3x = cnx + (t3x - cnx) / 2;
      t3y = cny + (t3y - cny) / 2;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: r, y: 0 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })


    cy.log('move circle2')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph3/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph3/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph3/circle"].stateValues.numericalRadius;

      let dx = -5, dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('move circle3')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph4/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph4/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph4/circle"].stateValues.numericalRadius;

      let dx = 7, dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
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
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" target="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <copy prop="diameter" assignNames="diam" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    let t1x = 2, t1y = -3;
    let t2x = 3, t2y = 4;
    let t3x = -3, t3y = 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
      let r = stateVariables['/_circle1'].stateValues.numericalRadius;

      expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);

      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
      expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
      expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
    })

    cy.log('move circle up and to the right')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
      let r = stateVariables['/_circle1'].stateValues.numericalRadius;

      let dx = 3, dy = 4;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('move first point to be in straight line')
    cy.window().then(async (win) => {

      t1x = -3, t1y = 8;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(＿,＿)`)
      cy.get('#\\/radiusNumber').should('contain.text', '＿')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.center[1])).false;
        expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.center[1])).false;
        expect(Number.isFinite((await stateVariables["/graph3/circle"].stateValues.radius))).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalCenter[1])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.center[1])).false;
        expect(Number.isFinite((await stateVariables["/graph4/circle"].stateValues.radius))).false;

        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect(Number.isFinite((await stateVariables["/centerPoint"].stateValues.xs)[0])).false;
        expect(Number.isFinite(stateVariables["/centerPoint"].stateValues.xs[1])).false;
        expect(Number.isFinite(stateVariables["/radiusNumber"].stateValues.value)).false;
        expect(Number.isFinite(stateVariables["/diam"].stateValues.value)).false;
      })
    })

    cy.log('move second point')
    cy.window().then(async (win) => {

      t2x = -4, t2y = -2;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(−1.5`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
        let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
        let r = stateVariables['/_circle1'].stateValues.numericalRadius;


        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))


        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);


        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('move third point')
    cy.window().then(async (win) => {

      t3x = 5, t3y = 3;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y }
      })


      cy.get('#\\/centerPoint2').should('contain.text', `(−0.7`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
        let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
        let r = stateVariables['/_circle1'].stateValues.numericalRadius;

        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))


        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('move points to be identical')
    cy.window().then(async (win) => {

      t1x = 5, t1y = 3;
      t2x = 5, t2y = 3;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })

      // should be a circle of radius zero
      let cnx = t1x;
      let cny = t1y;
      let r = 0;

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })


    cy.log('points 1 and 3 are identical')
    cy.window().then(async (win) => {

      t2x = 2, t2y = -7;

      // two points should be the diameter
      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('points 2 and 3 are identical')
    cy.window().then(async (win) => {

      t3x = 2, t3y = -7;

      // two points should be the diameter
      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y }
      })


      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('points 1 and 2 are identical')
    cy.window().then(async (win) => {

      t1x = 4, t1y = 9;
      t2x = 4, t2y = 9;

      // two points should be the diameter
      let cnx = (t1x + t3x) / 2;
      let cny = (t1y + t3y) / 2;
      let r = Math.sqrt(Math.pow(t2x - cnx, 2) + Math.pow(t2y - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: t1x, y: t1y }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })


    cy.log('move points apart again')
    cy.window().then(async (win) => {

      t2x = 2, t2y = -7;
      t3x = 0, t3y = -8;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t2x, y: t2y }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t3x, y: t3y }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(−3.6`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // calculate center and radius from circle itself
        let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
        let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
        let r = stateVariables['/_circle1'].stateValues.numericalRadius;

        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })


    cy.log('move center by reffed point')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // calculate center and radius from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
      let r = stateVariables['/_circle1'].stateValues.numericalRadius;

      let dx = 2, dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('half radius around center')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // calculate center and radius from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];
      let r = stateVariables['/_circle1'].stateValues.numericalRadius;

      r = r / 2;

      t1x = cnx + (t1x - cnx) / 2;
      t1y = cny + (t1y - cny) / 2;
      t2x = cnx + (t2x - cnx) / 2;
      t2y = cny + (t2y - cny) / 2;
      t3x = cnx + (t3x - cnx) / 2;
      t3y = cny + (t3y - cny) / 2;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: r, y: 0 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })


    cy.log('move circle2')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph3/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph3/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph3/circle"].stateValues.numericalRadius;

      let dx = -5, dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })

    cy.log('move circle3')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // calculate center and radius from circle itself
      let cnx = stateVariables["/graph4/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph4/circle"].stateValues.numericalCenter[1];
      let r = stateVariables["/graph4/circle"].stateValues.numericalRadius;

      let dx = 7, dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t3y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
        expect(stateVariables["/diam"].stateValues.value).closeTo(2 * r, 1E-12);
      })
    })



  });

  it('circle with radius and through one point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" target="_point1" /></math>
    <graph>
    <point>(2,0)</point><point>(3,4)</point>

    <circle radius="$pX" through="$_point2" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" target="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let tx = 3, ty = 4;
      let r = 2;
      let cnx = tx, cny = ty - r;

      expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
    })

    cy.log('move circle')
    cy.window().then(async (win) => {
      let tx = 1, ty = -1;
      let r = 2;
      let cnx = tx, cny = ty - r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move through point')
    cy.window().then(async (win) => {
      let tx = 4, ty = 7;
      let r = 2;
      let cnx = tx, cny = ty - r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: tx, y: ty }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('change definition radius')
    cy.window().then(async (win) => {
      let tx = 4, ty = 7;
      let r = 6;
      let cnx = tx, cny = ty - r;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: r, y: 0 }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('half reffed radius, center moves')
    cy.window().then(async (win) => {
      let cnx = 4, cny = 4;
      let r = 3;
      let tx = cnx, ty = cny + 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: r, y: 0 }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move circle2')
    cy.window().then(async (win) => {
      let cnx = 9, cny = -10;
      let r = 3;
      let tx = cnx, ty = cny + r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move circle3')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = -4, cny = -3;
      let r = 3;
      let tx = cnx, ty = cny + r;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

  });

  it('circle with radius and through two points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" target="_point1" /></math>
    <graph>
    <point>(2,0)</point><point>(3,4)</point><point>(5,6)</point>

    <circle radius="$pX" through="$_point2 $_point3" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" target="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 3, t1y = 4;
      let t2x = 5, t2y = 6;
      let r = 2;

      // get center from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];

      expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
      expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
      expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
    })

    cy.log('move circle')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 3, t1y = 4;
      let t2x = 5, t2y = 6;
      let r = 2;

      // get center from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];

      let dx = -1, dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move through point too far away')
    cy.window().then(async (win) => {
      let t1x = 0, t1y = -1;
      let t2x = 4, t2y = 3;
      let r = 2;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t1x, y: t1y }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(＿,＿)`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.center[1])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.center[1])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await stateVariables["/graph3/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.center[1])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await stateVariables["/graph4/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalRadius)).false;
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(Number.isFinite((await stateVariables["/centerPoint"].stateValues.xs)[0])).false;
        expect(Number.isFinite(stateVariables["/centerPoint"].stateValues.xs[1])).false;
        // expect(Number.isFinite(stateVariables["/radiusNumber"].stateValues.value)).false;
      })
    })

    cy.log('increase definition radius')
    cy.window().then(async (win) => {
      let t1x = 0, t1y = -1;
      let t2x = 4, t2y = 3;
      let r = 6;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: r, y: 0 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(−1.7`)


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // get center from circle itself
        let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
        let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];

        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('decrease reffed and then definition radius')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 0, t1y = -1;
      let t2x = 4, t2y = 3;
      let r = 6;

      // get center from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];

      r = r / 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: r, y: 0 }
      });


      cy.get('#\\/centerPoint2').should('contain.text', `(＿,＿)`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.center[1])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.center[1])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await stateVariables["/graph3/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.center[1])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await stateVariables["/graph4/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalRadius)).false;
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(Number.isFinite((await stateVariables["/centerPoint"].stateValues.xs)[0])).false;
        expect(Number.isFinite(stateVariables["/centerPoint"].stateValues.xs[1])).false;
        // expect(Number.isFinite(stateVariables["/radiusNumber"].stateValues.value)).false;

        r = r * 3;
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point4",
          args: { x: r, y: 0 }
        });

        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      })


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);

        r = r / 9;
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: r, y: 0 }
        });
      })


      cy.get('#\\/centerPoint2').should('contain.text', `(＿,＿)`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.center[1])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.center[1])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await stateVariables["/graph3/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph3/circle"].stateValues.numericalRadius)).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.center[0])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.center[1])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalCenter[1])).false;
        // expect(Number.isFinite((await stateVariables["/graph4/circle"].stateValues.radius))).false;
        // expect(Number.isFinite(stateVariables["/graph4/circle"].stateValues.numericalRadius)).false;
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect(Number.isFinite((await stateVariables["/centerPoint"].stateValues.xs)[0])).false;
        expect(Number.isFinite(stateVariables["/centerPoint"].stateValues.xs[1])).false;
        // expect(Number.isFinite(stateVariables["/radiusNumber"].stateValues.value)).false;
      })
    })

    cy.log('move through points on top of each other')
    cy.window().then(async (win) => {
      let t1x = 5, t1y = -4;
      let t2x = 5, t2y = -4;
      let r = 2 / 3;

      let cnx = t1x, cny = t1y - r;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t1x, y: t1y }
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t2x, y: t2y }
      });


      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);

      })
    })


    cy.log('move through points apart, but close enough')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = -2, t1y = 7;
      let t2x = -2.5, t2y = 6.6;
      let r = 2 / 3;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: t1x, y: t1y }
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: t2x, y: t2y }
      });

      cy.get('#\\/centerPoint2').should('contain.text', '(−1.8')


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        // get center from circle itself
        let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
        let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];

        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move reffed center')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = -2, t1y = 7;
      let t2x = -2.5, t2y = 6.6;
      let r = 2 / 3;

      // get center from circle itself
      let cnx = stateVariables['/_circle1'].stateValues.numericalCenter[0];
      let cny = stateVariables['/_circle1'].stateValues.numericalCenter[1];

      let dx = 6, dy = -7;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;


      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny }
      });


      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })


    cy.log('move circle2')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 4, t1y = 0;
      let t2x = 3.5, t2y = -0.4;
      let r = 2 / 3;

      // get center from circle itself
      let cnx = stateVariables["/graph3/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph3/circle"].stateValues.numericalCenter[1];

      let dx = 3, dy = -1;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;


      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] }
      });


      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })


    cy.log('move circle3')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let t1x = 7, t1y = -1;
      let t2x = 6.5, t2y = -1.4;
      let r = 2 / 3;

      // get center from circle itself
      let cnx = stateVariables["/graph4/circle"].stateValues.numericalCenter[0];
      let cny = stateVariables["/graph4/circle"].stateValues.numericalCenter[1];

      let dx = -5, dy = 3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] }
      });


      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(t1y, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
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
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" target="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 3, cny = 4;
      let tx = 5, ty = 6;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
    })

    cy.log('move circle')
    cy.window().then(async (win) => {
      let cnx = 3, cny = 4;
      let tx = 5, ty = 6;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = -2, dy = -6;
      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      })
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move defining center')
    cy.window().then(async (win) => {
      let cnx = 1, cny = -2;
      let tx = 3, ty = 0;

      cnx = -5;
      cny = 5;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: cnx, y: cny }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move reffed center')
    cy.window().then(async (win) => {
      let cnx = 1, cny = -1;
      let tx = 3, ty = 0;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move through point')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 1, cny = -1;
      let tx = -4, ty = 3;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: tx, y: ty }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('change reffed radius')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 1, cny = -1;
      let tx = -4, ty = 3;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      r = r / 4;

      tx = cnx + (tx - cnx) / 4;
      ty = cny + (ty - cny) / 4;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: r, y: 0 }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move circle2')
    cy.window().then(async (win) => {
      let cnx = 1, cny = -1;
      let tx = -4, ty = 3;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      r = r / 4;

      tx = cnx + (tx - cnx) / 4;
      ty = cny + (ty - cny) / 4;

      let dx = 4, dy = -1;

      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;


      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph3/circle",
        args: { center: [cnx, cny] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })


    cy.log('move circle3')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 1, cny = -1;
      let tx = -4, ty = 3;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      r = r / 4;

      tx = cnx + (tx - cnx) / 4;
      ty = cny + (ty - cny) / 4;

      let dx = -5, dy = 4;

      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;


      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph4/circle",
        args: { center: [cnx, cny] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

  })

  it('circle with radius and center', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" target="_point1" /></math>
    <graph>
    <point>(3,0)</point>
    <point name="center">(-3,5)</point>
    <circle radius="$pX" center="$center" />
    </graph>
    <graph>
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point name="radiusPoint" x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" target="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <graph name="graph3" newNamespace>
      <copy assignNames="circle" target="../_circle1" />
    </graph>
    <copy assignNames="graph4" target="graph3" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = -3, cny = 5;
      let r = 3;

      expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
      expect((await stateVariables["/center"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect((await stateVariables["/center"].stateValues.xs)[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
    })

    cy.log('make defined radius negative')
    cy.window().then(async (win) => {
      let cnx = -3, cny = 5;
      let r = -3;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: r, y: 0 }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(0, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(0, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(0, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(0, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(0, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(0, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect((await stateVariables["/center"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect((await stateVariables["/center"].stateValues.xs)[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(0, 1E-12);
      })
    })

    cy.log('making copied radius negative sets it to zero')
    cy.window().then(async (win) => {
      let cnx = -3, cny = 5;
      let r = 0;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1, y: 0 }
      });

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/radiusPoint",
        args: { x: -5, y: 0 }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph3/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph3/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph4/circle"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph4/circle"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect((await stateVariables["/center"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect((await stateVariables["/center"].stateValues.xs)[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

  })

  it('point constrained to circle', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="pX"><copy prop="x" target="_point1" /></math>
    <point>(3,0)</point><point>(-1,7)</point>
    <graph>
      <circle radius="$pX" center="$_point2" />
      <point x="-4" y="-6">
        <constraints>
          <constrainTo><copy target="_circle1" /></constrainTo>
        </constraints>
      </point>
      </graph>
    <graph>
      <copy prop="center" assignNames="centerPoint" target="_circle1" />
      <point x="$(_circle1{prop='radius'})" y="0" />
    </graph>
    <extract prop="coords" displaySmallAsZero assignNames="centerPoint2">
      <copy prop="center" target="_circle1" />
    </extract>
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />
    <copy name="graph2" target="_graph1" newNamespace />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = -1, cny = 7;
      let r = 3;

      let px = stateVariables['/_point3'].stateValues.xs[0];
      let py = stateVariables['/_point3'].stateValues.xs[1];
      let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
      expect(dist).closeTo(r, 1E-12);
      expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
      expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

      expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables["/graph2/_circle1"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph2/_circle1"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/graph2/_circle1"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/graph2/_circle1"].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
    })

    cy.log('move circle')
    cy.window().then(async (win) => {
      let cnx = 5, cny = -2;
      let r = 3;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: cnx, y: cny }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables['/_point3'].stateValues.xs[0];
        let py = stateVariables['/_point3'].stateValues.xs[1];
        let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph2/_circle1"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('shink circle')
    cy.window().then(async (win) => {
      let cnx = 5, cny = -2;
      let r = 1;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: r, y: 0 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables['/_point3'].stateValues.xs[0];
        let py = stateVariables['/_point3'].stateValues.xs[1];
        let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph2/_circle1"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })

    cy.log('move point')
    cy.window().then(async (win) => {
      let cnx = 5, cny = -2;
      let r = 1;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -9, y: 8 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables['/_point3'].stateValues.xs[0];
        let py = stateVariables['/_point3'].stateValues.xs[1];
        let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph2/_circle1"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })
    })


    cy.log('move circle shadow')
    cy.window().then(async (win) => {
      let cnx = -3, cny = 7;
      let r = 1;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/graph2/_circle1",
        args: { center: [cnx, cny] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables['/_point3'].stateValues.xs[0];
        let py = stateVariables['/_point3'].stateValues.xs[1];
        let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph2/_circle1"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
      })

    })

    cy.log('move point shadow')
    cy.window().then(async (win) => {
      let cnx = -3, cny = 7;
      let r = 1;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/graph2/_point3",
        args: { x: 11, y: -21 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables['/_point3'].stateValues.xs[0];
        let py = stateVariables['/_point3'].stateValues.xs[1];
        let dist = Math.sqrt(Math.pow(px - cnx, 2) + Math.pow(py - cny, 2));
        expect(dist).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[0]).eq(px);
        expect(stateVariables["/graph2/_point3"].stateValues.xs[1]).eq(py);

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/graph2/_circle1"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/graph2/_circle1"].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(0, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/radiusNumber"].stateValues.value).closeTo(r, 1E-12);
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
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
    <point>
      (<copy prop="y" target="centerPoint" />,
      <copy prop="radius" target="_circle1" />)
    </point>
    <copy assignNames="circle2" target="_circle1" />
    </graph>
    <copy prop="center" assignNames="centerPoint2" target="_circle1" />
    <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 3, cny = 0;
      let tx = -1, ty = 7;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
      expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
      expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(cny, 1E-12);
      expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(r, 1E-12);
      expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(cny, 1E-12);
      expect(stateVariables["/circle2"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
      expect(stateVariables["/circle2"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
      expect((await stateVariables["/circle2"].stateValues.radius)).closeTo(r, 1E-12);
      expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(r, 1E-12);

    })

    cy.log("move circle 1")
    cy.window().then(async (win) => {
      let cnx = 3, cny = 0;
      let tx = -1, ty = 7;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = -5, dy = 4;
      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(r, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/circle2"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(r, 1E-12);

      })
    })

    cy.log("move circle 2")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let cnx = 3, cny = 0;
      let tx = -1, ty = 7;
      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      let dx = 3, dy = -2;
      cnx += dx;
      cny += dy;
      tx += dx;
      ty += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/circle2",
        args: { center: [cnx, cny] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(r, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/circle2"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(r, 1E-12);
      })
    })

    cy.log("move copied center")
    cy.window().then(async (win) => {
      let cnx = 6, cny = -2;
      let tx = 2, ty = 5;

      let dx = -5, dy = -5;
      cnx += dx;
      cny += dy;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(r, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/circle2"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(r, 1E-12);
      })
    })

    cy.log("move defining center")
    cy.window().then(async (win) => {
      let tx = 2, ty = 5;

      let cnx = -3;
      let cny = 1;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: cnx, y: cny }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(r, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/circle2"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(r, 1E-12);
      })
    })

    cy.log("move through point")
    cy.window().then(async (win) => {
      let cnx = -3, cny = 1;

      let tx = 0;
      let ty = 4;

      let r = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2));

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: tx, y: ty }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(r, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(r, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/circle2"].stateValues.radius)).closeTo(r, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(r, 1E-12);
      })
    })

    // This test captures the actual behavior with this strange construction
    // Question: is this the desired behavior?
    // Not sure how to improve behavior in a way that wouldn't depend
    // on the order of which is updated first:
    // the x or y coordinate of the point moved
    cy.log("move point of refs")
    cy.window().then(async (win) => {
      let cnx = -3, cny = 1;
      let tx = 0, ty = 4;

      let theta = Math.atan2(ty - cny, tx - cnx);

      let rSpecified = 2;
      tx = cnx + rSpecified * Math.cos(theta);
      ty = cny + rSpecified * Math.sin(theta);

      cny = -3;

      // first time through, the radius doesn't end up being what specified
      let rActual = Math.sqrt(Math.pow(tx - cnx, 2) + Math.pow(ty - cny, 2))

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: cny, y: rSpecified }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(rActual * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();


        expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(rActual, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(rActual, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
        expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
        expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(cny, 1E-12);
        expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(rActual, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(cny, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
        expect((await stateVariables["/circle2"].stateValues.radius)).closeTo(rActual, 1E-12);
        expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(rActual, 1E-12);

        // try it again
        // since center doesn't move, we get radius specified
        theta = Math.atan2(ty - cny, tx - cnx);
        tx = cnx + rSpecified * Math.cos(theta);
        ty = cny + rSpecified * Math.sin(theta);
        rActual = rSpecified;

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point3",
          args: { x: cny, y: rSpecified }
        });


        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(cnx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(cny * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(rActual * 100) / 100))

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          expect(stateVariables['/_circle1'].stateValues.center[0]).closeTo(cnx, 1E-12);
          expect(stateVariables['/_circle1'].stateValues.center[1]).closeTo(cny, 1E-12);
          expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
          expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
          expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(rActual, 1E-12);
          expect(stateVariables['/_circle1'].stateValues.numericalRadius).closeTo(rActual, 1E-12);
          expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(cnx, 1E-12);
          expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(cny, 1E-12);
          expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(tx, 1E-12);
          expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(ty, 1E-12);
          expect((await stateVariables["/centerPoint"].stateValues.xs)[0]).closeTo(cnx, 1E-12);
          expect(stateVariables["/centerPoint"].stateValues.xs[1]).closeTo(cny, 1E-12);
          expect(stateVariables['/_point3'].stateValues.xs[0]).closeTo(cny, 1E-12);
          expect(stateVariables['/_point3'].stateValues.xs[1]).closeTo(rActual, 1E-12);
          expect(stateVariables["/circle2"].stateValues.center[0]).closeTo(cnx, 1E-12);
          expect(stateVariables["/circle2"].stateValues.center[1]).closeTo(cny, 1E-12);
          expect(stateVariables["/circle2"].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12);
          expect(stateVariables["/circle2"].stateValues.numericalCenter[1]).closeTo(cny, 1E-12);
          expect((await stateVariables["/circle2"].stateValues.radius)).closeTo(rActual, 1E-12);
          expect(stateVariables["/circle2"].stateValues.numericalRadius).closeTo(rActual, 1E-12);
        })
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
      (<extract prop="x"><copy prop="center" target="c" /></extract>,
      $fixedZero)
    </point>
  
    <point name="y">
      ($fixedZero,
      <extract prop="y"><copy prop="center" target="c" /></extract>)
    </point>
    <point name="r">
      (<copy prop="radius" target="c" />, 5)
    </point>
  
    </graph>
    <copy prop="center" assignNames="centerPoint2" target="c" />
    <copy prop="radius" assignNames="radiusNumber" target="c" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    let t1x = 1, t1y = 2, t2x = 3, t2y = 5, t3x = -5, t3y = 2;
    let circy, circx, r;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // calculate center and radius from circle itself
      circx = stateVariables['/c'].stateValues.numericalCenter[0];
      circy = stateVariables['/c'].stateValues.numericalCenter[1];
      r = stateVariables['/c'].stateValues.numericalRadius;

      // verify triangle vertices are on circle
      expect(Math.sqrt((t1x - circx) ** 2 + (t1y - circy) ** 2)).closeTo(r, 1E-12);
      expect(Math.sqrt((t2x - circx) ** 2 + (t2y - circy) ** 2)).closeTo(r, 1E-12);
      expect(Math.sqrt((t3x - circx) ** 2 + (t3y - circy) ** 2)).closeTo(r, 1E-12);

      expect((stateVariables['/t'].stateValues.vertices)[0][0]).closeTo(t1x, 1E-12);
      expect((stateVariables['/t'].stateValues.vertices)[0][1]).closeTo(t1y, 1E-12);
      expect((stateVariables['/t'].stateValues.vertices)[1][0]).closeTo(t2x, 1E-12);
      expect((stateVariables['/t'].stateValues.vertices)[1][1]).closeTo(t2y, 1E-12);
      expect((stateVariables['/t'].stateValues.vertices)[2][0]).closeTo(t3x, 1E-12);
      expect((stateVariables['/t'].stateValues.vertices)[2][1]).closeTo(t3y, 1E-12);
      expect(stateVariables['/c'].stateValues.center[0]).closeTo(circx, 1E-12);
      expect(stateVariables['/c'].stateValues.center[1]).closeTo(circy, 1E-12);
      expect(stateVariables['/c'].stateValues.radius).closeTo(r, 1E-12);
      expect(stateVariables['/x'].stateValues.xs[0]).closeTo(circx, 1E-12);
      expect(stateVariables['/y'].stateValues.xs[1]).closeTo(circy, 1E-12);
      expect(stateVariables['/r'].stateValues.xs[0]).closeTo(r, 1E-12);

    })

    cy.log("move triangle points")
    cy.window().then(async (win) => {
      t1x = -3, t1y = 1, t2x = 4, t2y = 0, t3x = -1, t3y = 7;

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/t",
        args: {
          pointCoords: [
            [t1x, t1y], [t2x, t2y], [t3x, t3y]
          ]
        }
      })

      cy.get('#\\/centerPoint2').should('contain.text', `(0.8`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        // calculate center and radius from circle itself
        circx = stateVariables['/c'].stateValues.numericalCenter[0];
        circy = stateVariables['/c'].stateValues.numericalCenter[1];
        r = stateVariables['/c'].stateValues.numericalRadius;

        cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(circx * 100) / 100)}`)
        cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(circy * 100) / 100)}`)
        cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

        // verify triangle vertices are on circle
        expect(Math.sqrt((t1x - circx) ** 2 + (t1y - circy) ** 2)).closeTo(r, 1E-12);
        expect(Math.sqrt((t2x - circx) ** 2 + (t2y - circy) ** 2)).closeTo(r, 1E-12);
        expect(Math.sqrt((t3x - circx) ** 2 + (t3y - circy) ** 2)).closeTo(r, 1E-12);

        expect((stateVariables['/t'].stateValues.vertices)[0][0]).closeTo(t1x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[0][1]).closeTo(t1y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][0]).closeTo(t2x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][1]).closeTo(t2y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][0]).closeTo(t3x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][1]).closeTo(t3y, 1E-12);
        expect(stateVariables['/c'].stateValues.center[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.center[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.radius).closeTo(r, 1E-12);
        expect(stateVariables['/x'].stateValues.xs[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/y'].stateValues.xs[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/r'].stateValues.xs[0]).closeTo(r, 1E-12);
      })
    })

    cy.log("move circle via center")
    cy.window().then(async (win) => {

      let dx = 2, dy = -3;
      circx += dx;
      circy += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/c",
        args: { center: [circx, circy] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(circx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(circy * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalRadius).closeTo(r, 1E-12);

        expect((stateVariables['/t'].stateValues.vertices)[0][0]).closeTo(t1x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[0][1]).closeTo(t1y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][0]).closeTo(t2x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][1]).closeTo(t2y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][0]).closeTo(t3x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][1]).closeTo(t3y, 1E-12);
        expect(stateVariables['/c'].stateValues.center[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.center[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.radius).closeTo(r, 1E-12);
        expect(stateVariables['/x'].stateValues.xs[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/y'].stateValues.xs[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/r'].stateValues.xs[0]).closeTo(r, 1E-12);
      })
    })


    cy.log("move circle center x")
    cy.window().then(async (win) => {

      let dx = -5;
      circx += dx;
      t1x += dx;
      t2x += dx;
      t3x += dx;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/x",
        args: { x: circx }
      });


      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(circx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(circy * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalRadius).closeTo(r, 1E-12);

        expect((stateVariables['/t'].stateValues.vertices)[0][0]).closeTo(t1x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[0][1]).closeTo(t1y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][0]).closeTo(t2x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][1]).closeTo(t2y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][0]).closeTo(t3x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][1]).closeTo(t3y, 1E-12);
        expect(stateVariables['/c'].stateValues.center[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.center[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.radius).closeTo(r, 1E-12);
        expect(stateVariables['/x'].stateValues.xs[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/y'].stateValues.xs[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/r'].stateValues.xs[0]).closeTo(r, 1E-12);
      })
    })



    cy.log("move circle center y")
    cy.window().then(async (win) => {

      let dy = 6;
      circy += dy;
      t1y += dy;
      t2y += dy;
      t3y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/y",
        args: { y: circy }
      });


      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(circx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(circy * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalRadius).closeTo(r, 1E-12);

        expect((stateVariables['/t'].stateValues.vertices)[0][0]).closeTo(t1x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[0][1]).closeTo(t1y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][0]).closeTo(t2x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][1]).closeTo(t2y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][0]).closeTo(t3x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][1]).closeTo(t3y, 1E-12);
        expect(stateVariables['/c'].stateValues.center[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.center[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.radius).closeTo(r, 1E-12);
        expect(stateVariables['/x'].stateValues.xs[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/y'].stateValues.xs[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/r'].stateValues.xs[0]).closeTo(r, 1E-12);
      })
    })

    cy.log("shrink radius")
    cy.window().then(async (win) => {

      let radiusfactor = 0.4;

      r = r * radiusfactor;

      t1x = circx + (t1x - circx) * radiusfactor;
      t1y = circy + (t1y - circy) * radiusfactor;
      t2x = circx + (t2x - circx) * radiusfactor;
      t2y = circy + (t2y - circy) * radiusfactor;
      t3x = circx + (t3x - circx) * radiusfactor;
      t3y = circy + (t3y - circy) * radiusfactor;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/r",
        args: { x: r }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(circx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(circy * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalRadius).closeTo(r, 1E-12);

        expect((stateVariables['/t'].stateValues.vertices)[0][0]).closeTo(t1x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[0][1]).closeTo(t1y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][0]).closeTo(t2x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][1]).closeTo(t2y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][0]).closeTo(t3x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][1]).closeTo(t3y, 1E-12);
        expect(stateVariables['/c'].stateValues.center[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.center[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.radius).closeTo(r, 1E-12);
        expect(stateVariables['/x'].stateValues.xs[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/y'].stateValues.xs[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/r'].stateValues.xs[0]).closeTo(r, 1E-12);
      })
    })

    cy.log("shrink radius to zero")
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/r",
        args: { x: -3 }
      }); // overshoot


      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(circx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(circy * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalRadius).closeTo(0, 1E-12);

        expect((stateVariables['/t'].stateValues.vertices)[0][0]).closeTo(circx, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[0][1]).closeTo(circy, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][0]).closeTo(circx, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][1]).closeTo(circy, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][0]).closeTo(circx, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.center[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.center[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.radius).closeTo(0, 1E-12);
        expect(stateVariables['/x'].stateValues.xs[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/y'].stateValues.xs[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/r'].stateValues.xs[0]).closeTo(0, 1E-12);
      })
    })

    cy.log("increase radius to 6")
    cy.window().then(async (win) => {

      let radiusfactor = 6 / r;

      r = r * radiusfactor;

      t1x = circx + (t1x - circx) * radiusfactor;
      t1y = circy + (t1y - circy) * radiusfactor;
      t2x = circx + (t2x - circx) * radiusfactor;
      t2y = circy + (t2y - circy) * radiusfactor;
      t3x = circx + (t3x - circx) * radiusfactor;
      t3y = circy + (t3y - circy) * radiusfactor;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/r",
        args: { x: r }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(Math.trunc(circx * 100) / 100)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(Math.trunc(circy * 100) / 100)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/c'].stateValues.numericalCenter[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalCenter[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.numericalRadius).closeTo(r, 1E-12);

        expect((stateVariables['/t'].stateValues.vertices)[0][0]).closeTo(t1x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[0][1]).closeTo(t1y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][0]).closeTo(t2x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[1][1]).closeTo(t2y, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][0]).closeTo(t3x, 1E-12);
        expect((stateVariables['/t'].stateValues.vertices)[2][1]).closeTo(t3y, 1E-12);
        expect(stateVariables['/c'].stateValues.center[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/c'].stateValues.center[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/c'].stateValues.radius).closeTo(r, 1E-12);
        expect(stateVariables['/x'].stateValues.xs[0]).closeTo(circx, 1E-12);
        expect(stateVariables['/y'].stateValues.xs[1]).closeTo(circy, 1E-12);
        expect(stateVariables['/r'].stateValues.xs[0]).closeTo(r, 1E-12);
      })
    })



  })

  it('circle where radius depends on center', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math hide name="r"><extract prop="y"><copy prop="center" target="_circle1" /></extract></math>
  <graph>
    <circle radius="$r" center="(1,2)" />
    <copy prop="center" target="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 2]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(2);
      expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, 5] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(5)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(5))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, 5]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", -3, 5])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: 7 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(8)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(7)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(7))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([8, 7]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(7);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 8, 7])
      })
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [3, -2] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(-2)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(0))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([3, -2]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(0);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 3, -2])
      })
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: 4 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(1)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(4)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(4))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 4]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(4);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 4])
      })
    })

  })

  it('circle where center depends on radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle radius="2" center="(1,$(_circle1{prop='radius'}))" />
    <copy prop="center" target="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 2]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(2);
      expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, 5] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(5)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(5))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, 5]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", -3, 5])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: 7 }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(8)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(7)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(7))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([8, 7]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(7);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 8, 7])
      })
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [3, -2] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(0)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(0))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([3, 0]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(0);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 3, 0])
      })
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: 4 }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(1)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(4)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(4))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 4]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(4);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 4])
      })
    })

  })

  it('circle where center depends on diameter', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle radius="2" center="(1,$(_circle1{prop='diameter'}))" />
    <copy prop="center" target="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 4]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(2);
      expect(stateVariables['/_circle1'].stateValues.diameter).eq(4);
      expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 4])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, 6] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(6)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(3))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, 6]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(3);
        expect(stateVariables['/_circle1'].stateValues.diameter).eq(6);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", -3, 6])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: 4 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(8)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(4)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(2))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([8, 4]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(2);
        expect(stateVariables['/_circle1'].stateValues.diameter).eq(4);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 8, 4])
      })
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [3, -2] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(0)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(0))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([3, 0]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(0);
        expect(stateVariables['/_circle1'].stateValues.diameter).eq(0);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 3, 0])
      })
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: 8 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(1)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(8)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(4))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 8]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(4);
        expect(stateVariables['/_circle1'].stateValues.diameter).eq(8);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 8])
      })
    })

  })

  it('circle where center depends on unspecified radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle center="(1,$(_circle1{prop='radius'}))" />
    <copy prop="center" target="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 1]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(1);
      expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 1])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, 5] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(5)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(5))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, 5]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(5);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", -3, 5])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: 7 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(8)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(7)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(7))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([8, 7]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(7);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 8, 7])
      })
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [3, -2] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(0)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(0))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([3, 0]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(0);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 3, 0])
      })
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: 4 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(1)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(4)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(4))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 4]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(4);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 4])
      })
    })

  })

  it('circle where single through point depends on radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle radius="2" through="(1,2$(_circle1{prop='radius'}))" />
    <copy prop="center" target="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 2]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(2);
      expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = (5 + 2) / 2;
      // given previous radius is 2, would move through point to 5+2,
      // so that center of circle would be (5+2)/2
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", -3, actualHeight])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = (7 + 3.5) / 2;  // given previous radius is 3.5
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(8)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([8, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 8, actualHeight])
      })
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [4, -6] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(4)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(0)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(0))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([4, 0]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(0);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 4, 0])
      })
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let desiredHeight = 4;
      let actualHeight = (4 + 0) / 2;  // given previous radius is 0
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(1)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([1, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, actualHeight])
      })
    })

  })

  it('circle where single through point depends on unspecified radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle through="(1,2$(_circle1{prop='radius'}))" />
    <copy prop="center" target="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 1]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(1);
      expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 1])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = (5 + 1) / 2;
      // given previous radius is 1, would move through point to 5+1,
      // so that center of circle would be (5+1)/2
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", -3, actualHeight])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = (7 + 3) / 2;  // given previous radius is 3
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(8)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([8, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 8, actualHeight])
      })
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [4, -6] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(4)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(0)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(0))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([4, 0]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(0);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 4, 0])
      })
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let desiredHeight = 4;
      let actualHeight = (4 + 0) / 2;  // given previous radius is 0
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(1)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([1, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, actualHeight])
      })
    })

  })

  it('circle where radius depends on single through point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="r" hide><extract prop="y"><copy prop="throughPoint1" target="_circle1" /></extract>/2</math>
  <graph>
    <circle radius="$r" through="(1,4)" />
    <copy prop="center" target="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 2]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(2);
      expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = (5 + 2) / 2;
      // given previous radius is 2, would move through point to 5+2,
      // so that center of circle would be (5+2)/2
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", -3, actualHeight])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = (7 + 3.5) / 2;  // given previous radius is 3.5
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(8)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([8, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 8, actualHeight])
      })
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let desiredHeight = -6;
      let actualHeight = -6 + 5.25
      // would move through point to -6+5.25,
      // but radius becomes zero, so center is at -6+5.25
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [4, desiredHeight] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(4)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(0))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([4, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(0);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 4, actualHeight])
      })
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let desiredHeight = 4;
      let actualHeight = (4 + 0) / 2;  // given previous radius is 0
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(1)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([1, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, actualHeight])
      })
    })

  })

  it('circle where center depends on through point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle through="(1,4)" center="($(_circle1{prop='throughPointX1_1'}), $(_circle1{prop='throughPointX1_2'})/2)"/>
    <copy prop="center" target="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 2]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(2);
      expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = (5 + 2) / 2;
      // given previous radius is 2, would move through point to 5+2,
      // so that center of circle would be (5+2)/2
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", -3, actualHeight])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = 7;  // since moving center itself
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(8)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([8, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 8, actualHeight])
      })
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let desiredHeight = -8;
      let actualHeight = (-8 + 7) / 2; // given previous radius is 7
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [4, desiredHeight] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(4)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(-actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([4, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(-actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 4, actualHeight])
      })
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let desiredHeight = 4;
      let actualHeight = 4;  // since moving point itself
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(1)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([1, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, actualHeight])
      })
    })

  })

  it('circle where through point depends on center', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle through="($(_circle1{prop='centerX1'}),$(_circle1{prop='centerX2'})2)" center="(1,2)" />
    <copy prop="center" target="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 2]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(2);
      expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = (5 + 2) / 2;
      // given previous radius is 2, would move through point to 5+2,
      // so that center of circle would be (5+2)/2
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", -3, actualHeight])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = 7;  // since moving center itself
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(8)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([8, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 8, actualHeight])
      })
    })

    cy.log("move circle below x-axis");
    cy.window().then(async (win) => {
      let desiredHeight = -8;
      let actualHeight = (-8 + 7) / 2; // given previous radius is 7
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [4, desiredHeight] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(4)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(-actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([4, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(-actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 4, actualHeight])
      })
    })

    cy.log("move circle back up with center point");
    cy.window().then(async (win) => {
      let desiredHeight = 4;
      let actualHeight = 4;  // since moving point itself
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(1)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(actualHeight))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([1, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(actualHeight);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, actualHeight])
      })
    })

  })

  it('circle where one center component depends on other center component', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle center="(1, $(_circle1{prop='centerX1'})+1)" />
    <copy prop="center" target="_circle1" assignNames="centerPoint" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_circle1'].stateValues.center).eqls([1, 2]);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(1);
      expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 1, 2])
    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let desiredHeight = 5;
      let actualHeight = -2;
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-3, desiredHeight] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-3)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(1))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/_circle1'].stateValues.center).eqls([-3, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(1);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", -3, actualHeight])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let desiredHeight = 7;
      let actualHeight = 9;  // since moving center itself
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 8, y: desiredHeight }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(8)}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(actualHeight)}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(1))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.center).eqls([8, actualHeight]);
        expect((stateVariables['/_circle1'].stateValues.radius)).eq(1);
        expect(stateVariables['/centerPoint'].stateValues.coords).eqls(["vector", 8, actualHeight])
      })
    })

  })

  it('circle where radius depends on two through points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math hide name="r">
    abs(<extract prop="x"><copy prop="throughPoint1" target="_circle1" /></extract>
      -<extract prop="x"><copy prop="throughPoint2" target="_circle1" /></extract>)
  </math>
  <graph>
    <point name="TP1">(1,2)</point>
    <point name="TP2">(3,4)</point>
    <circle radius="$r" through="$TP1 $TP2" />
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    let t1x = 1, t1y = 2;
    let t2x = 3, t2y = 4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let r = Math.abs(t1x - t2x);
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
      expect((stateVariables['/_circle1'].stateValues.throughPoints)[0]).eqls([t1x, t1y])
      expect((stateVariables['/_circle1'].stateValues.throughPoints)[1]).eqls([t2x, t2y])
      expect((await stateVariables["/TP1"].stateValues.coords)).eqls(["vector", t1x, t1y])
      expect((await stateVariables["/TP2"].stateValues.coords)).eqls(["vector", t2x, t2y])

    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter = stateVariables['/_circle1'].stateValues.numericalCenter;
      let dx = 2, dy = -3;
      let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: newCenter }
      });

      let r = Math.abs(t1x - t2x);

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(newCenter[0])}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(newCenter[1])}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(newCenter[0], 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(newCenter[1], 1E-12);
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter = stateVariables['/_circle1'].stateValues.numericalCenter;
      let dx = -5, dy = -2;
      let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: newCenter[0], y: newCenter[1] }
      });

      let r = Math.abs(t1x - t2x);

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(newCenter[0])}`)
      cy.get('#\\/centerPoint2').should('contain.text', `${nInDOM(newCenter[1])}`)
      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(newCenter[0], 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(newCenter[1], 1E-12);
      })
    })

    cy.log("move first through point");
    cy.window().then(async (win) => {

      t1x = 6;
      t1y = 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP1",
        args: { x: t1x, y: t1y }
      });

      let r = Math.abs(t1x - t2x);

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);
      })

    })


    cy.log("move second through point under first through point");
    cy.window().then(async (win) => {

      t2x = 5;
      t2y = -3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y }
      });

      let r = Math.abs(t1x - t2x);

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).false;
      })

    })


    cy.log("move second through point close enough to make circle");
    cy.window().then(async (win) => {

      t2y = 1.5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y }
      });

      let r = Math.abs(t1x - t2x);

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).true;
      })

    })


  })

  it('circle with dependencies among radius and two through points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="r" hide>
    <extract prop="x"><copy prop="throughPoint1" target="_circle1" /></extract>
  </math>
  <graph>
    <point name="TP1">(1,2)</point>
    <copy prop="throughPoint2" target="_circle1" assignNames="TP2" />
    <circle radius="$r" through="$TP1 ($(_circle1{prop='radius'})+1,3)" />
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
  </graph>

  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    let t1x = 1, t1y = 2;
    let t2x = 2, t2y = 3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let r = t1x;
      expect((stateVariables['/_circle1'].stateValues.radius)).eq(r);
      expect((stateVariables['/_circle1'].stateValues.throughPoints)[0]).eqls([t1x, t1y])
      expect((stateVariables['/_circle1'].stateValues.throughPoints)[1]).eqls([t2x, t2y])
      expect((await stateVariables["/TP1"].stateValues.coords)).eqls(["vector", t1x, t1y])
      expect((await stateVariables["/TP2"].stateValues.coords)).eqls(["vector", t2x, t2y])

    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter = stateVariables['/_circle1'].stateValues.numericalCenter;
      let dx = 2, dy = -3;
      let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: newCenter }
      });

      let r = t1x;

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).true;
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter = stateVariables['/_circle1'].stateValues.numericalCenter;
      let dx = -1, dy = -2;
      let newCenter = [numericalCenter[0] + dx, numericalCenter[1] + dy];
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: newCenter[0], y: newCenter[1] }
      });

      let r = t1x

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).true;
      })
    })

    cy.log("move first through point");
    cy.window().then(async (win) => {

      t1x = 6;
      t1y = 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP1",
        args: { x: t1x, y: t1y }
      });

      let r = t1x;
      t2x = t1x + 1;

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

      })
    })


    cy.log("move second through point under first through point");
    cy.window().then(async (win) => {

      t2y = -9;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y }
      });

      let r = t1x;


      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).false;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).false;
      })

    })


    cy.log("move second through point to the right");
    cy.window().then(async (win) => {

      t2x = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y }
      });

      t1x = t2x - 1;
      let r = t1x;


      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(r))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).true;
      })

    })


  })

  it('circle where through point 2 depends on through point 1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="TP1">(1,2)</point>
    <copy prop="throughPoint2" target="_circle1" assignNames="TP2" />
    <circle through="$TP1 ($(_circle1{prop='throughPointX1_1'})+1,3)"/>
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
  </graph>

  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    let t1x = 1, t1y = 2;
    let t2x = 2, t2y = 3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);
      expect((stateVariables['/_circle1'].stateValues.throughPoints)[0]).eqls([t1x, t1y])
      expect((stateVariables['/_circle1'].stateValues.throughPoints)[1]).eqls([t2x, t2y])
      expect((await stateVariables["/TP1"].stateValues.coords)).eqls(["vector", t1x, t1y])
      expect((await stateVariables["/TP2"].stateValues.coords)).eqls(["vector", t2x, t2y])

      expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12)
      expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12)

    })

    cy.log("move circle");
    cy.window().then(async (win) => {

      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      let dx = 2, dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      });

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;


      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12)
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12)
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {

      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      let dx = -1, dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny }
      });

      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12)
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12)
      })
    })

    cy.log("move first through point");
    cy.window().then(async (win) => {

      t1x = 6;
      t1y = 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP1",
        args: { x: t1x, y: t1y }
      });

      t2x = t1x + 1;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12)
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12)
      })
    })


    cy.log("move second through point");
    cy.window().then(async (win) => {

      t2x = -7;
      t2y = -9;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y }
      });

      t1x = t2x - 1;
      let r = Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;

      let cnx = (t1x + t2x) / 2;
      let cny = (t1y + t2y) / 2;

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12)
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12)
      })
    })



  })

  it('circle with dependencies among three through points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="TP2">(1,2)</point>
    <copy prop="throughPoint3" target="_circle1" assignNames="TP3" />
    <circle through="($(_circle1{prop='throughPointX2_1'})+1,3) $TP2 ($(_circle1{prop='throughPointX1_1'})+1,5)" />
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
  </graph>

  <copy prop="throughPoint1" target="_circle1" assignNames="TP1" />
  <copy prop="radius" assignNames="radiusNumber" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    let t1x = 2, t1y = 3;
    let t2x = 1, t2y = 2;
    let t3x = 3, t3y = 5;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();


      expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).true;
      expect((stateVariables['/_circle1'].stateValues.throughPoints)[0]).eqls([t1x, t1y])
      expect((stateVariables['/_circle1'].stateValues.throughPoints)[1]).eqls([t2x, t2y])
      expect((stateVariables['/_circle1'].stateValues.throughPoints)[2]).eqls([t3x, t3y])
      expect((await stateVariables["/TP1"].stateValues.coords)).eqls(["vector", t1x, t1y])
      expect((await stateVariables["/TP2"].stateValues.coords)).eqls(["vector", t2x, t2y])
      expect((await stateVariables["/TP3"].stateValues.coords)).eqls(["vector", t3x, t3y])

      expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).true;
      expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).true;

    })

    cy.log("move circle");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter = stateVariables['/_circle1'].stateValues.numericalCenter;
      let cnx = numericalCenter[0];
      let cny = numericalCenter[1];

      let dx = 2, dy = -3;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      let r = stateVariables['/_circle1'].stateValues.radius;

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [cnx, cny] }
      });

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[2][0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[2][1]).closeTo(t3y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/TP3"].stateValues.xs)[0]).closeTo(t3x, 1E-12);
        expect((await stateVariables["/TP3"].stateValues.xs)[1]).closeTo(t3y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12)
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12)
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalCenter = stateVariables['/_circle1'].stateValues.numericalCenter;
      let cnx = numericalCenter[0];
      let cny = numericalCenter[1];

      let dx = -1, dy = -2;
      cnx += dx;
      cny += dy;
      t1x += dx;
      t1y += dy;
      t2x += dx;
      t2y += dy;
      t3x += dx;
      t3y += dy;

      let r = stateVariables['/_circle1'].stateValues.radius;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: cnx, y: cny }
      });

      cy.get('#\\/radiusNumber').should('contain.text', nInDOM(Math.trunc(r * 100) / 100))

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_circle1'].stateValues.radius)).closeTo(r, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[2][0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[2][1]).closeTo(t3y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/TP3"].stateValues.xs)[0]).closeTo(t3x, 1E-12);
        expect((await stateVariables["/TP3"].stateValues.xs)[1]).closeTo(t3y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalCenter[0]).closeTo(cnx, 1E-12)
        expect(stateVariables['/_circle1'].stateValues.numericalCenter[1]).closeTo(cny, 1E-12)
      })
    })

    cy.log("move first through point");
    cy.window().then(async (win) => {

      t1x = 6;
      t1y = 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP1",
        args: { x: t1x, y: t1y }
      });

      t3x = t1x + 1;
      t2x = t1x - 1;


      cy.get('#\\/TP1').should('contain.text', `(${nInDOM(Math.trunc(t1x * 100) / 100)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).true;

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[2][0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[2][1]).closeTo(t3y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/TP3"].stateValues.xs)[0]).closeTo(t3x, 1E-12);
        expect((await stateVariables["/TP3"].stateValues.xs)[1]).closeTo(t3y, 1E-12);

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).true;
      })
    })


    cy.log("move second through point");
    cy.window().then(async (win) => {

      t2x = -7;
      t2y = -9;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP2",
        args: { x: t2x, y: t2y }
      });

      t1x = t2x + 1;
      t3x = t1x + 1;


      cy.get('#\\/TP1').should('contain.text', `(${nInDOM(Math.trunc(t1x * 100) / 100)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).true;

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[2][0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[2][1]).closeTo(t3y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/TP3"].stateValues.xs)[0]).closeTo(t3x, 1E-12);
        expect((await stateVariables["/TP3"].stateValues.xs)[1]).closeTo(t3y, 1E-12);

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).true;
      })
    })


    cy.log("move third through point");
    cy.window().then(async (win) => {

      t3x = 1;
      t3y = -2;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/TP3",
        args: { x: t3x, y: t3y }
      });

      t1x = t3x - 1;
      t2x = t1x - 1;


      cy.get('#\\/TP1').should('contain.text', `(${nInDOM(Math.trunc(t1x * 100) / 100)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(Number.isFinite((stateVariables['/_circle1'].stateValues.radius))).true;

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][0]).closeTo(t1x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[0][1]).closeTo(t1y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][0]).closeTo(t2x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[1][1]).closeTo(t2y, 1E-12);

        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[2][0]).closeTo(t3x, 1E-12);
        expect(stateVariables['/_circle1'].stateValues.numericalThroughPoints[2][1]).closeTo(t3y, 1E-12);

        expect((await stateVariables["/TP1"].stateValues.xs)[0]).closeTo(t1x, 1E-12);
        expect((await stateVariables["/TP1"].stateValues.xs)[1]).closeTo(t1y, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[0]).closeTo(t2x, 1E-12);
        expect((await stateVariables["/TP2"].stateValues.xs)[1]).closeTo(t2y, 1E-12);
        expect((await stateVariables["/TP3"].stateValues.xs)[0]).closeTo(t3x, 1E-12);
        expect((await stateVariables["/TP3"].stateValues.xs)[1]).closeTo(t3y, 1E-12);

        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[0])).true;
        expect(Number.isFinite(stateVariables['/_circle1'].stateValues.numericalCenter[1])).true;
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
     (<extract prop="y"><copy prop="center" target="_circle1" /></extract>,
     <extract prop="x"><copy prop="center" target="_circle1" /></extract>)
    </point>
    <copy prop="center" assignNames="centerPoint" target="_circle1" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="_circle1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_circle1'].stateValues.numericalRadius).eq(1);
      expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([0, 0]);
      expect(stateVariables["/centerPoint"].stateValues.coords).eqls(["vector", 0, 0])
      expect(stateVariables["/_point1"].stateValues.coords).eqls(["vector", 0, 0])

    })

    cy.log("move circle");
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/_circle1",
        args: { center: [-7, 2] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-7)},${nInDOM(2)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([-7, 2]);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls(["vector", -7, 2])
        expect(stateVariables["/_point1"].stateValues.coords).eqls(["vector", 2, -7])
      })
    })

    cy.log("move flipped point");
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -3, y: -5 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-5)},${nInDOM(-3)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([-5, -3]);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls(["vector", -5, -3])
        expect(stateVariables["/_point1"].stateValues.coords).eqls(["vector", -3, -5])
      })
    })

    cy.log("move center point");
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/centerPoint",
        args: { x: 1, y: -4 }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(1)},${nInDOM(-4)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_circle1'].stateValues.numericalCenter).eqls([1, -4]);
        expect(stateVariables["/centerPoint"].stateValues.coords).eqls(["vector", 1, -4])
        expect(stateVariables["/_point1"].stateValues.coords).eqls(["vector", -4, 1])
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
    <copy target="circ" assignNames="circ2" />
  </graph>

  <copy prop="center" assignNames="centerPoint2" target="circ" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([NaN, NaN]);
      expect(stateVariables['/circ'].stateValues.numericalRadius).eq(1);
      expect(stateVariables['/circ2'].stateValues.numericalCenter).eqls([NaN, NaN]);
      expect(stateVariables['/circ2'].stateValues.numericalRadius).eq(1);
    });

    cy.log("enter point for center");
    cy.get('#\\/c textarea').type("(2,1){enter}", { force: true })

    cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(2)},${nInDOM(1)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([2, 1]);
      expect(stateVariables['/circ'].stateValues.numericalRadius).eq(1);
      expect(stateVariables['/circ2'].stateValues.numericalCenter).eqls([2, 1]);
      expect(stateVariables['/circ2'].stateValues.numericalRadius).eq(1);
    })

    cy.log(`move circle`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/circ",
        args: { center: [-7, 2] }
      });
      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-7)},${nInDOM(2)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([-7, 2]);
        expect(stateVariables['/circ'].stateValues.numericalRadius).eq(1);
        expect(stateVariables['/circ2'].stateValues.numericalCenter).eqls([-7, 2]);
        expect(stateVariables['/circ2'].stateValues.numericalRadius).eq(1);
      })
    })

    cy.log("change point for center");
    cy.get('#\\/c textarea').type("{end}{leftArrow}{backspace}-4{enter}", { force: true })

    cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(-7)},${nInDOM(-4)})`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([-7, -4]);
      expect(stateVariables['/circ'].stateValues.numericalRadius).eq(1);
      expect(stateVariables['/circ2'].stateValues.numericalCenter).eqls([-7, -4]);
      expect(stateVariables['/circ2'].stateValues.numericalRadius).eq(1);
    })

    cy.log(`move circle2`)
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/circ2",
        args: { center: [6, 9] }
      });

      cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(6)},${nInDOM(9)})`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([6, 9]);
        expect(stateVariables['/circ'].stateValues.numericalRadius).eq(1);
        expect(stateVariables['/circ2'].stateValues.numericalCenter).eqls([6, 9]);
        expect(stateVariables['/circ2'].stateValues.numericalRadius).eq(1);
      })
    })

    cy.log("center undefined again");
    cy.get('#\\/c textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}", { force: true })

    cy.get('#\\/centerPoint2').should('contain.text', `(＿,＿)`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([NaN, NaN]);
      expect(stateVariables['/circ'].stateValues.numericalRadius).eq(1);
      expect(stateVariables['/circ2'].stateValues.numericalCenter).eqls([NaN, NaN]);
      expect(stateVariables['/circ2'].stateValues.numericalRadius).eq(1);
    })

    cy.log("enter new point for center");
    cy.get('#\\/c textarea').type("(5,4){enter}", { force: true })

    cy.get('#\\/centerPoint2').should('contain.text', `(${nInDOM(5)},${nInDOM(4)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([5, 4]);
      expect(stateVariables['/circ'].stateValues.numericalRadius).eq(1);
      expect(stateVariables['/circ2'].stateValues.numericalCenter).eqls([5, 4]);
      expect(stateVariables['/circ2'].stateValues.numericalRadius).eq(1);
    })

  })

  it('overwrite attributes on copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <circle name="c" />
  </graph>

  <p>Change radius: <mathinput name="rc" bindValueTo="$(c{prop='radius'})" /></p>
  <p>Change center: <mathinput name="cc" bindValueTo="$(c{prop='center'})" /></p>

  <graph>
    <point name="P">(3,4)</point>
    <copy target="c" center="$P" assignNames="c1" />
  </graph>

  <p>Change radius: <mathinput name="rc1" bindValueTo="$(c1{prop='radius'})" /></p>
  <p>Change center: <mathinput name="cc1" bindValueTo="$(c1{prop='center'})" /></p>

  <graph>
    <point name="Q">(7,7)</point>
    <copy target="c1" through="$Q" assignNames="c2" />
  </graph>

  <p>Change radius: <mathinput name="rc2" bindValueTo="$(c2{prop='radius'})" /></p>
  <p>Change center: <mathinput name="cc2" bindValueTo="$(c2{prop='center'})" /></p>

  <graph>
    <copy target="c" radius="$src3" assignNames = "c3" />
  </graph>

  <p>Set radius radius: <mathinput name="src3" prefill="3" /></p>
  <p>Change radius: <mathinput name="rc3" bindValueTo="$(c3{prop='radius'})" /></p>
  <p>Change center: <mathinput name="cc3" bindValueTo="$(c3{prop='center'})" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load

    cy.get('#\\/rc .mq-editable-field').should('have.text', '1')
    cy.get('#\\/cc .mq-editable-field').should('have.text', '(0,0)')
    cy.get('#\\/rc1 .mq-editable-field').should('have.text', '1')
    cy.get('#\\/cc1 .mq-editable-field').should('have.text', '(3,4)')
    cy.get('#\\/rc2 .mq-editable-field').should('have.text', '5')
    cy.get('#\\/cc2 .mq-editable-field').should('have.text', '(3,4)')
    cy.get('#\\/src3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/rc3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/cc3 .mq-editable-field').should('have.text', '(0,0)')


    cy.log('move original circle')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/c",
        args: { center: [-1, 2] }
      })
    });

    cy.get('#\\/rc .mq-editable-field').should('have.text', '1')
    cy.get('#\\/cc .mq-editable-field').should('have.text', '(−1,2)')
    cy.get('#\\/rc1 .mq-editable-field').should('have.text', '1')
    cy.get('#\\/cc1 .mq-editable-field').should('have.text', '(3,4)')
    cy.get('#\\/rc2 .mq-editable-field').should('have.text', '5')
    cy.get('#\\/cc2 .mq-editable-field').should('have.text', '(3,4)')
    cy.get('#\\/src3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/rc3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/cc3 .mq-editable-field').should('have.text', '(−1,2)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await (stateVariables["/P"].stateValues.xs)).eqls([3, 4]);
      expect(await (stateVariables["/Q"].stateValues.xs)).eqls([7, 7]);
    });

    cy.log('enter non-numeric radius and center for original circle');
    cy.get('#\\/rc textarea').type("{end}+x{enter}", { force: true })
    cy.get('#\\/cc textarea').type("{end}{leftArrow}{backspace}y{enter}", { force: true })

    cy.get('#\\/rc .mq-editable-field').should('have.text', '1+x')
    cy.get('#\\/cc .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('(−1,y)')
    })
    cy.get('#\\/rc1 .mq-editable-field').should('have.text', '1+x')
    cy.get('#\\/cc1 .mq-editable-field').should('have.text', '(3,4)')
    cy.get('#\\/rc2 .mq-editable-field').should('have.text', '5')
    cy.get('#\\/cc2 .mq-editable-field').should('have.text', '(3,4)')
    cy.get('#\\/src3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/rc3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/cc3 .mq-editable-field').should('have.text', '(−1,y)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await (stateVariables["/P"].stateValues.xs)).eqls([3, 4]);
      expect(await (stateVariables["/Q"].stateValues.xs)).eqls([7, 7]);
    });

    cy.log('set radius and center for original circle back to number using other components');
    cy.get('#\\/rc1 textarea').type("{end}{backspace}{backspace}{backspace}2{enter}", { force: true })
    cy.get('#\\/cc3 textarea').type("{end}{leftArrow}{backspace}{backspace}{backspace}{backspace}4,5{enter}", { force: true })

    cy.get('#\\/rc .mq-editable-field').should('have.text', '2')
    cy.get('#\\/cc .mq-editable-field').should('have.text', '(4,5)')
    cy.get('#\\/rc1 .mq-editable-field').should('have.text', '2')
    cy.get('#\\/cc1 .mq-editable-field').should('have.text', '(3,4)')
    cy.get('#\\/rc2 .mq-editable-field').should('have.text', '5')
    cy.get('#\\/cc2 .mq-editable-field').should('have.text', '(3,4)')
    cy.get('#\\/src3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/rc3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/cc3 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('(4,5)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await (stateVariables["/P"].stateValues.xs)).eqls([3, 4]);
      expect(await (stateVariables["/Q"].stateValues.xs)).eqls([7, 7]);
    });


    cy.log('move point P and set radius of second circle')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -5, y: 2 }
      })
    });

    cy.get('#\\/rc1 textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.get('#\\/rc .mq-editable-field').should('have.text', '4')
    cy.get('#\\/cc .mq-editable-field').should('have.text', '(4,5)')
    cy.get('#\\/rc1 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })
    cy.get('#\\/cc1 .mq-editable-field').should('have.text', '(−5,2)')
    cy.get('#\\/rc2 .mq-editable-field').should('have.text', '13')
    cy.get('#\\/cc2 .mq-editable-field').should('have.text', '(−5,2)')
    cy.get('#\\/src3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/rc3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/cc3 .mq-editable-field').should('have.text', '(4,5)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await (stateVariables["/P"].stateValues.xs)).eqls([-5, 2]);
      expect(await (stateVariables["/Q"].stateValues.xs)).eqls([7, 7]);
    });


    cy.log('move point Q')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 3, y: 8 }
      })
    });

    cy.get('#\\/rc .mq-editable-field').should('have.text', '4')
    cy.get('#\\/cc .mq-editable-field').should('have.text', '(4,5)')
    cy.get('#\\/rc1 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })
    cy.get('#\\/cc1 .mq-editable-field').should('have.text', '(−5,2)')
    cy.get('#\\/rc2 .mq-editable-field').should('have.text', '10')
    cy.get('#\\/cc2 .mq-editable-field').should('have.text', '(−5,2)')
    cy.get('#\\/src3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/rc3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/cc3 .mq-editable-field').should('have.text', '(4,5)')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await (stateVariables["/P"].stateValues.xs)).eqls([-5, 2]);
      expect(await (stateVariables["/Q"].stateValues.xs)).eqls([3, 8]);
    });

    cy.log('set radius of third circle')

    cy.get('#\\/rc2 textarea').type("{end}{backspace}{backspace}5{enter}", { force: true })

    cy.get('#\\/rc .mq-editable-field').should('have.text', '4')
    cy.get('#\\/cc .mq-editable-field').should('have.text', '(4,5)')
    cy.get('#\\/rc1 .mq-editable-field').should('have.text', '4')
    cy.get('#\\/cc1 .mq-editable-field').should('have.text', '(−5,2)')
    cy.get('#\\/rc2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get('#\\/cc2 .mq-editable-field').should('have.text', '(−5,2)')
    cy.get('#\\/src3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/rc3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/cc3 .mq-editable-field').should('have.text', '(4,5)')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await (stateVariables["/P"].stateValues.xs)).eqls([-5, 2]);
      expect(await (stateVariables["/Q"].stateValues.xs)).eqls([-1, 5]);
    });


    cy.log('set center of third circle')

    cy.get('#\\/cc2 textarea').type("{end}{leftArrow}{backspace}{backspace}{backspace}{backspace}5,-3{enter}", { force: true })

    cy.get('#\\/rc .mq-editable-field').should('have.text', '4')
    cy.get('#\\/cc .mq-editable-field').should('have.text', '(4,5)')
    cy.get('#\\/rc1 .mq-editable-field').should('have.text', '4')
    cy.get('#\\/cc1 .mq-editable-field').should('have.text', '(5,−3)')
    cy.get('#\\/rc2 .mq-editable-field').should('have.text', '10')
    cy.get('#\\/cc2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('(5,−3)')
    })
    cy.get('#\\/src3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/rc3 .mq-editable-field').should('have.text', '3')
    cy.get('#\\/cc3 .mq-editable-field').should('have.text', '(4,5)')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await (stateVariables["/P"].stateValues.xs)).eqls([5, -3]);
      expect(await (stateVariables["/Q"].stateValues.xs)).eqls([-1, 5]);
    });


    cy.log('set radius of fourth circle')

    cy.get('#\\/src3 textarea').type("{end}{backspace}9{enter}", { force: true })

    cy.get('#\\/rc .mq-editable-field').should('have.text', '4')
    cy.get('#\\/cc .mq-editable-field').should('have.text', '(4,5)')
    cy.get('#\\/rc1 .mq-editable-field').should('have.text', '4')
    cy.get('#\\/cc1 .mq-editable-field').should('have.text', '(5,−3)')
    cy.get('#\\/rc2 .mq-editable-field').should('have.text', '10')
    cy.get('#\\/cc2 .mq-editable-field').should('have.text', '(5,−3)')
    cy.get('#\\/src3 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9')
    })
    cy.get('#\\/rc3 .mq-editable-field').should('have.text', '9')
    cy.get('#\\/cc3 .mq-editable-field').should('have.text', '(4,5)')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await (stateVariables["/P"].stateValues.xs)).eqls([5, -3]);
      expect(await (stateVariables["/Q"].stateValues.xs)).eqls([-1, 5]);
    });



    cy.log('move and change radius of fourth circle')

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/c3",
        args: { center: [3, 8] }
      })
    });

    cy.get('#\\/rc3 textarea').type("{end}{backspace}9{enter}", { force: true })

    cy.get('#\\/rc .mq-editable-field').should('have.text', '4')
    cy.get('#\\/cc .mq-editable-field').should('have.text', '(3,8)')
    cy.get('#\\/rc1 .mq-editable-field').should('have.text', '4')
    cy.get('#\\/cc1 .mq-editable-field').should('have.text', '(5,−3)')
    cy.get('#\\/rc2 .mq-editable-field').should('have.text', '10')
    cy.get('#\\/cc2 .mq-editable-field').should('have.text', '(5,−3)')
    cy.get('#\\/src3 .mq-editable-field').should('have.text', '9')
    cy.get('#\\/rc3 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9')
    })
    cy.get('#\\/cc3 .mq-editable-field').should('have.text', '(3,8)')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(await (stateVariables["/P"].stateValues.xs)).eqls([5, -3]);
      expect(await (stateVariables["/Q"].stateValues.xs)).eqls([-1, 5]);
    });


  })

  it('reload essential center from database', () => {
    let doenetML = `
    <text>a</text>
    <graph>
      <circle name="circ" />
    </graph>
    <mathinput bindvalueTo="$(circ{prop='radius'})" name="r" />
    <p>radius: <copy prop='radius' target='circ' assignNames="r2" /></p>
    <p>Center: <copy prop="center" target="circ" assignNames="c" /></p>
  `;

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')// to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([0, 0]);
      expect(stateVariables['/circ'].stateValues.numericalRadius).eq(1);
    });

    cy.log(`move circle`)
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveCircle",
        componentName: "/circ",
        args: { center: [-7, 2] }
      });

      cy.get(`#\\/r2 .mjx-mrow`).should('contain.text', "1");
      cy.get(`#\\/c .mjx-mrow`).should('contain.text', `(${nInDOM(-7)},${nInDOM(2)})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([-7, 2]);
        expect(stateVariables['/circ'].stateValues.numericalRadius).eq(1);
      })
    })

    cy.log("change radius");
    cy.get('#\\/r textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(`#\\/r .mq-editable-field`).should('contain.text', "3");
    cy.get(`#\\/r2 .mjx-mrow`).should('contain.text', "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([-7, 2]);
      expect(stateVariables['/circ'].stateValues.numericalRadius).eq(3);
    })


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: '<text>b</text>',
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/circ'].stateValues.numericalCenter).eqls([-7, 2]);
      expect(stateVariables['/circ'].stateValues.numericalRadius).eq(3);
    })

  })

});
