describe('Graph Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('string sugared to curve in graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>x^2</graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let curve = components["/_graph1"].activeChildren[0];
      expect(curve.stateValues.flipFunction).eq(false);
      expect(curve.stateValues.fs[0](-2)).eq(4);
      expect(curve.stateValues.fs[0](3)).eq(9);
    })

  });

  it.skip('y = function string sugared to curve in graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>y=x^2</graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let curve = components["/_graph1"].activeChildren[0];
      let functioncurve = curve.activeChildren[0];
      expect(curve.stateValues.variables[0].tree).eq("x");
      expect(curve.stateValues.variables[1].tree).eq("y");
      expect(functioncurve.stateValues.variables[0].tree).eq("x");
      expect(functioncurve.stateValues.variables[1].tree).eq("y");
      expect(functioncurve.stateValues.flipFunction).eq(false);
      expect(functioncurve.stateValues.f(-2)).eq(4);
      expect(functioncurve.stateValues.f(3)).eq(9);
    })

  });

  it.skip('inverse function string sugared to curve in graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>y^2=x</graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let curve = components["/_graph1"].activeChildren[0];
      let functioncurve = curve.activeChildren[0];
      expect(curve.stateValues.variables[0].tree).eq("x");
      expect(curve.stateValues.variables[1].tree).eq("y");
      expect(functioncurve.stateValues.variables[0].tree).eq("x");
      expect(functioncurve.stateValues.variables[1].tree).eq("y");
      expect(functioncurve.stateValues.flipFunction).eq(true);
      expect(functioncurve.stateValues.f(-2)).eq(4);
      expect(functioncurve.stateValues.f(3)).eq(9);
    })

  });

  it('functions sugared to curves in graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <function>x^2</function>
      <function variables="t" stylenumber="2" label="g">t^3</function>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let curve1 = components["/_graph1"].activeChildren[0];
      let curve2 = components["/_graph1"].activeChildren[1];

      expect(curve1.stateValues.fs[0](-2)).eq(4);
      expect(curve1.stateValues.fs[0](3)).eq(9);
      expect(curve2.stateValues.fs[0](-2)).eq(-8);
      expect(curve2.stateValues.fs[0](3)).eq(27);
      expect(curve1.stateValues.label).eq("");
      expect(curve2.stateValues.label).eq("g");
      expect(curve1.stateValues.styleNumber).eq(1);
      expect(curve2.stateValues.styleNumber).eq(2);

    })

  });

  it('changing bounding box', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph><point>(0,0)</point>
    </graph>

    <p>xmin: <copy prop="xmin" tname="_graph1" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" tname="_graph1" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" tname="_graph1" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" tname="_graph1" assignNames="ymax" /></p>

    <p>Change xmin: <mathinput name="xminInput" bindValueTo="$(_graph1{prop='xmin'})" /></p>
    <p>Change xmax: <mathinput name="xmaxInput" bindValueTo="$(_graph1{prop='xmax'})" /></p>
    <p>Change ymin: <mathinput name="yminInput" bindValueTo="$(_graph1{prop='ymin'})" /></p>
    <p>Change ymax: <mathinput name="ymaxInput" bindValueTo="$(_graph1{prop='ymax'})" /></p>
    
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    function checkLimits(xmin, xmax, ymin, ymax) {
      cy.get('#\\/xmin').should('have.text', String(xmin));
      cy.get('#\\/xmax').should('have.text', String(xmax));
      cy.get('#\\/ymin').should('have.text', String(ymin));
      cy.get('#\\/ymax').should('have.text', String(ymax));

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components["/_graph1"].stateValues.xmin).eq(xmin);
        expect(components["/_graph1"].stateValues.xmax).eq(xmax);
        expect(components["/_graph1"].stateValues.ymin).eq(ymin);
        expect(components["/_graph1"].stateValues.ymax).eq(ymax);

      })

    }


    let xmin = -10, xmax = 10, ymin = -10, ymax = 10;

    checkLimits(xmin, xmax, ymin, ymax)

    cy.get('#\\/_graph1_navigationbar > :nth-child(6)').click().then((_) => {
      let increment = 0.1 * (ymax - ymin);
      ymin += increment;
      ymax += increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(6)').click().then((_) => {
      let increment = 0.1 * (ymax - ymin);
      ymin += increment;
      ymax += increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(5)').click().then((_) => {
      let increment = 0.1 * (ymax - ymin);
      ymin -= increment;
      ymax -= increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(4)').click().then((_) => {
      let increment = 0.1 * (xmax - xmin);
      xmin -= increment;
      xmax -= increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(7)').click().then((_) => {
      let increment = 0.1 * (xmax - xmin);
      xmin += increment;
      xmax += increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(7)').click().then((_) => {
      let increment = 0.1 * (xmax - xmin);
      xmin += increment;
      xmax += increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(3)').click().then((_) => {
      let meanx = (xmax + xmin) / 2;
      xmin = meanx + 0.8 * (xmin - meanx);
      xmax = meanx + 0.8 * (xmax - meanx);
      let meany = (ymax + ymin) / 2;
      ymin = meany + 0.8 * (ymin - meany);
      ymax = meany + 0.8 * (ymax - meany);
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(3)').click().then((_) => {
      let meanx = (xmax + xmin) / 2;
      xmin = meanx + 0.8 * (xmin - meanx);
      xmax = meanx + 0.8 * (xmax - meanx);
      let meany = (ymax + ymin) / 2;
      ymin = meany + 0.8 * (ymin - meany);
      ymax = meany + 0.8 * (ymax - meany);
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(1)').click().then((_) => {
      let meanx = (xmax + xmin) / 2;
      xmin = meanx + (xmin - meanx) / 0.8;
      xmax = meanx + (xmax - meanx) / 0.8;
      let meany = (ymax + ymin) / 2;
      ymin = meany + (ymin - meany) / 0.8;
      ymax = meany + (ymax - meany) / 0.8;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/xminInput textarea').type(`{end}{backspace}{backspace}-8{enter}`, { force: true }).then((_) => {
      xmin = -8;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/xmaxInput textarea').type(`{end}{backspace}{backspace}12{enter}`, { force: true }).then((_) => {
      xmax = 12;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/yminInput textarea').type(`{end}{backspace}{backspace}-4{enter}`, { force: true }).then((_) => {
      ymin = -4;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/ymaxInput textarea').type(`{end}{backspace}{backspace}16{enter}`, { force: true }).then((_) => {
      ymax = 16;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(5)').click().then((_) => {
      let increment = 0.1 * (ymax - ymin);
      ymin -= increment;
      ymax -= increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(4)').click().then((_) => {
      let increment = 0.1 * (xmax - xmin);
      xmin -= increment;
      xmax -= increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })


  });


});