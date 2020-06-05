describe('Boolean Operator on Math Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('iisinteger', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <mathinput />
    <p>
    <isinteger><ref prop="value">_mathinput1</ref></isinteger>
    </p>
    `}, "*");
    });

    cy.get('#\\/_isinteger1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].state.value).eq(false);
    });

    cy.log('37');
    cy.get('#\\/_mathinput1_input').clear().type("37{enter}");
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].state.value).eq(true);
    });

    cy.log('37.1');
    cy.get('#\\/_mathinput1_input').clear().type("37.1{enter}");
    cy.get('#\\/_isinteger1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].state.value).eq(false);
    });

    cy.log('39/3');
    cy.get('#\\/_mathinput1_input').clear().type("39/3{enter}");
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].state.value).eq(true);
    });

    cy.log('-39.6/3.3');
    cy.get('#\\/_mathinput1_input').clear().type("39.6/3.3{enter}");
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].state.value).eq(true);
    });

    cy.log('x');
    cy.get('#\\/_mathinput1_input').clear().type("x{enter}");
    cy.get('#\\/_isinteger1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].state.value).eq(false);
    });

    cy.log('sqrt(4)');
    cy.get('#\\/_mathinput1_input').clear().type("sqrt(4){enter}");
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].state.value).eq(true);
    });

    cy.log('2sin(pi/4)^2');
    cy.get('#\\/_mathinput1_input').clear().type("2sin(pi/4)^2{enter}");
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].state.value).eq(true);
    });

    cy.log('1E-300');
    cy.get('#\\/_mathinput1_input').clear().type("1E-300{enter}");
    cy.get('#\\/_isinteger1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].state.value).eq(false);
    });

    cy.log('-0');
    cy.get('#\\/_mathinput1_input').clear().type("-0{enter}");
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].state.value).eq(true);
    });



  })

});