describe('Document Tests', function () {

  beforeEach(() => {
    cy.visit('/viewer')
  })

  it('angle determined by three points, 45-45-90 triangle', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
        <document>
            <p>this point will appear on graph</p>
            <mathinput prefill="2"></mathinput>
            <mathinput prefill="2"></mathinput>
            <variable>x=<ref prop="value">_mathinput1</ref></variable>
            <spreadsheet>
              <cell colnum="A" rownum="1"><ref prop="value">_mathinput1</ref></cell>
              <cell colnum="B" rownum="1"><ref prop="value">_mathinput2</ref></cell>
            </spreadsheet>
            <graph><circle><point>(<ref prop="value">_mathinput1</ref>,<ref prop="value">_mathinput2</ref>)</point></circle></graph>
        </document>
    
  `}, "*");
    });
    

    cy.log('Test values displayed in browser')
    cy.get('#\\/_variable1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x=2')
    })
    cy.get('#\\/_mathinput1_input').should('have.value', '2');
    cy.get('#\\/_mathinput2_input').should('have.value', '2');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",2,2]);
      expect(components['/_circle1'].state.centerNumeric).eqls([2,2]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components.__point1.state.xs[0].tree).eq(2);
      expect(components.__point1.state.xs[1].tree).eq(2);
    })

    
})});