
describe('Solution Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })


  it("solution isn't created before opening", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <solution name="sol">
    <p name="solutionText">This is the text of the solution.</p>
  </solution>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get("#\\/solutionText").should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/solutionText']).be.undefined;
    })

    cy.get("#\\/sol_button").click();

    cy.get("#\\/solutionText").should('have.text', 'This is the text of the solution.');


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/solutionText'].stateValues.text).eq('This is the text of the solution.');
    })
    
  })



})




