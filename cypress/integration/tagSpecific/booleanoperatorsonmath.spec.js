describe('Boolean Operator on Math Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('isinteger', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <mathinput />
    <p>
    <isinteger><copy prop="value" tname="_mathinput1" /></isinteger>
    </p>
    `}, "*");
    });

    cy.get('#\\/_isinteger1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].stateValues.value).eq(false);
    });

    cy.log('37');
    cy.get('#\\/_mathinput1 textarea').type("37{enter}", { force: true });
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].stateValues.value).eq(true);
    });

    cy.log('37.1');
    cy.get('#\\/_mathinput1 textarea').type("{end}.1{enter}", { force: true });
    cy.get('#\\/_isinteger1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].stateValues.value).eq(false);
    });

    cy.log('39/3');
    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}39/3{enter}", { force: true });
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].stateValues.value).eq(true);
    });

    cy.log('-39.6/3.3');
    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-39.6/3.3{enter}", { force: true });
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].stateValues.value).eq(true);
    });

    cy.log('x');
    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}x{enter}", { force: true });
    cy.get('#\\/_isinteger1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].stateValues.value).eq(false);
    });

    cy.log('sqrt(4)');
    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}sqrt4{enter}", { force: true });
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].stateValues.value).eq(true);
    });

    cy.log('2sin(pi/4)^2');
    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}2sin(pi/4){rightarrow}{rightarrow}^2{enter}", { force: true });
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].stateValues.value).eq(true);
    });

    cy.log('1E-300');
    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}1E-300{enter}", { force: true });
    cy.get('#\\/_isinteger1').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].stateValues.value).eq(false);
    });

    cy.log('-0');
    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}-0{enter}", { force: true });
    cy.get('#\\/_isinteger1').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_isinteger1'].stateValues.value).eq(true);
    });



  })

});