describe('Graph Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('function sugared in graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <graph>x^2</graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components.__curve1.state.curveType).eq("function");
      expect(components.__curve1.state.flipFunction).eq(false);
      expect(components.__curve1.state.variables[0].tree).eq("x");
      expect(components.__curve1.state.variables[1].tree).eq("y");
      expect(components.__curve1.state.f(-2)).eq(4);
      expect(components.__curve1.state.f(3)).eq(9);
    })

  });

  it('y = function sugared in graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <graph>y=x^2</graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components.__curve1.state.curveType).eq("function");
      expect(components.__curve1.state.flipFunction).eq(false);
      expect(components.__curve1.state.variables[0].tree).eq("x");
      expect(components.__curve1.state.variables[1].tree).eq("y");
      expect(components.__curve1.state.f(-2)).eq(4);
      expect(components.__curve1.state.f(3)).eq(9);
    })

  });

  it('inverse function sugared in graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <text>a</text>
    <graph>y^2=x</graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components.__curve1.state.curveType).eq("function");
      expect(components.__curve1.state.flipFunction).eq(true);
      expect(components.__curve1.state.variables[0].tree).eq("x");
      expect(components.__curve1.state.variables[1].tree).eq("y");
      expect(components.__curve1.state.f(-2)).eq(4);
      expect(components.__curve1.state.f(3)).eq(9);
    })

  });

});