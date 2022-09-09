
describe('Solution Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it("solution isn't created before opening", () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/solutionText']).be.undefined;
    })

    cy.get("#\\/sol_button").click();

    cy.get("#\\/solutionText").should('have.text', 'This is the text of the solution.');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/solutionText'].stateValues.text).eq('This is the text of the solution.');
    })
    
  })

  it('Can open solution in read only mode', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_readOnly').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <solution name="solution1">
        <title>Hello</title>
        <p>Content</p>
      </solution>

      <p><textinput name="ti" /></p>
    `}, "*");
    });

    cy.get('#\\/solution1_button').should("contain.text", "Solution")

    cy.get('#\\/_title1').should('not.exist');
    cy.get('#\\/_p1').should('not.exist');
    cy.get('#\\/ti_input').should('be.disabled')

    cy.get("#\\/solution1_button").click();
    cy.get('#\\/_title1').should('have.text', 'Hello');
    cy.get('#\\/_p1').should('have.text', 'Content');

    cy.get('#\\/solution1_button').click()
    cy.get('#\\/_title1').should('not.exist');
    cy.get('#\\/_p1').should('not.exist');

  });

})




