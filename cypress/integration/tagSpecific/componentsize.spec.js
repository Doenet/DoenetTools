
describe('Component Size Tag Tests', function () {

  beforeEach(() => {

    cy.visit('/test')

  })


  it('width', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <width>1</width>
  <width>1 px</width>
  <width>10 pixel</width>
  <width>  100 pixels  </width>
  <width>
  10%
  </width>
  <width>10 em   </width>
  <width>1 in</width>
  <width>10inch</width>
  <width>  10inches</width>
  <width>100    pt  </width>
  <width>1mm</width>  
  <width>  100    millimeter</width>
  <width>10millimeters</width>
  <width>100    cm</width>
  <width>   1centimeter</width>
  <width>100 centimeters   </width>
  `}, "*");
    });

    cy.log('test display of first values');
    cy.get('#\\/_width1').should('have.text', '1');
    cy.get('#\\/_width2').should('have.text', '1');
    cy.get('#\\/_width3').should('have.text', '10');
    cy.get('#\\/_width4').should('have.text', '100');
    cy.get('#\\/_width5').should('have.text', '10');
    cy.get('#\\/_width6').should('have.text', '1000');
    cy.get('#\\/_width7').should('have.text', '96');
    cy.get('#\\/_width8').should('have.text', '960');
    cy.get('#\\/_width9').should('have.text', '960');

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_width1'].stateValues.value).eq(1);
      expect(components['/_width1'].stateValues.isAbsolute).eq(true);
      expect(components['/_width2'].stateValues.value).eq(1);
      expect(components['/_width2'].stateValues.isAbsolute).eq(true);
      expect(components['/_width3'].stateValues.value).eq(10);
      expect(components['/_width3'].stateValues.isAbsolute).eq(true);
      expect(components['/_width4'].stateValues.value).eq(100);
      expect(components['/_width4'].stateValues.isAbsolute).eq(true);
      expect(components['/_width5'].stateValues.value).eq(10);
      expect(components['/_width5'].stateValues.isAbsolute).eq(false);
      expect(components['/_width6'].stateValues.value).eq(1000);
      expect(components['/_width6'].stateValues.isAbsolute).eq(false);
      expect(components['/_width7'].stateValues.value).eq(96);
      expect(components['/_width7'].stateValues.isAbsolute).eq(true);
      expect(components['/_width8'].stateValues.value).eq(960);
      expect(components['/_width8'].stateValues.isAbsolute).eq(true);
      expect(components['/_width9'].stateValues.value).eq(960);
      expect(components['/_width9'].stateValues.isAbsolute).eq(true);
      expect(components['/_width10'].stateValues.value).closeTo(100 * 1.333333333333, 1E-9);
      expect(components['/_width10'].stateValues.isAbsolute).eq(true);
      expect(components['/_width11'].stateValues.value).closeTo(1 * 3.7795296, 1E-9);
      expect(components['/_width11'].stateValues.isAbsolute).eq(true);
      expect(components['/_width12'].stateValues.value).closeTo(100 * 3.7795296, 1E-9);
      expect(components['/_width12'].stateValues.isAbsolute).eq(true);
      expect(components['/_width13'].stateValues.value).closeTo(10 * 3.7795296, 1E-9);
      expect(components['/_width13'].stateValues.isAbsolute).eq(true);
      expect(components['/_width14'].stateValues.value).closeTo(100 * 37.795296, 1E-9);
      expect(components['/_width14'].stateValues.isAbsolute).eq(true);
      expect(components['/_width15'].stateValues.value).closeTo(1 * 37.795296, 1E-9);
      expect(components['/_width15'].stateValues.isAbsolute).eq(true);
      expect(components['/_width16'].stateValues.value).closeTo(100 * 37.795296, 1E-9);
      expect(components['/_width16'].stateValues.isAbsolute).eq(true);

    })

  })

  it('width2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <width><number>1</number></width>
  <width><number>1</number> px</width>
  <width><number>10</number> pixel</width>
  <width>  <number>100</number> pixels  </width>
  <width>
  <number>10</number>%
  </width>
  <width><number>10</number> em   </width>
  <width><number>1</number> in</width>
  <width><number>10</number>inch</width>
  <width>  <number>10</number>inches</width>
  <width><number>100</number>    pt  </width>
  <width><number>1</number>mm</width>  
  <width>  <number>100</number>    millimeter</width>
  <width><number>10</number>millimeters</width>
  <width><number>100</number>    cm</width>
  <width>   <number>1</number>centimeter</width>
  <width><number>100</number> centimeters   </width>
  `}, "*");
    });

    cy.log('test display of first values');
    cy.get('#\\/_width1').should('have.text', '1');
    cy.get('#\\/_width2').should('have.text', '1');
    cy.get('#\\/_width3').should('have.text', '10');
    cy.get('#\\/_width4').should('have.text', '100');
    cy.get('#\\/_width5').should('have.text', '10');
    cy.get('#\\/_width6').should('have.text', '1000');
    cy.get('#\\/_width7').should('have.text', '96');
    cy.get('#\\/_width8').should('have.text', '960');
    cy.get('#\\/_width9').should('have.text', '960');

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_width1'].stateValues.value).eq(1);
      expect(components['/_width1'].stateValues.isAbsolute).eq(true);
      expect(components['/_width2'].stateValues.value).eq(1);
      expect(components['/_width2'].stateValues.isAbsolute).eq(true);
      expect(components['/_width3'].stateValues.value).eq(10);
      expect(components['/_width3'].stateValues.isAbsolute).eq(true);
      expect(components['/_width4'].stateValues.value).eq(100);
      expect(components['/_width4'].stateValues.isAbsolute).eq(true);
      expect(components['/_width5'].stateValues.value).eq(10);
      expect(components['/_width5'].stateValues.isAbsolute).eq(false);
      expect(components['/_width6'].stateValues.value).eq(1000);
      expect(components['/_width6'].stateValues.isAbsolute).eq(false);
      expect(components['/_width7'].stateValues.value).eq(96);
      expect(components['/_width7'].stateValues.isAbsolute).eq(true);
      expect(components['/_width8'].stateValues.value).eq(960);
      expect(components['/_width8'].stateValues.isAbsolute).eq(true);
      expect(components['/_width9'].stateValues.value).eq(960);
      expect(components['/_width9'].stateValues.isAbsolute).eq(true);
      expect(components['/_width10'].stateValues.value).closeTo(100 * 1.333333333333, 1E-9);
      expect(components['/_width10'].stateValues.isAbsolute).eq(true);
      expect(components['/_width11'].stateValues.value).closeTo(1 * 3.7795296, 1E-9);
      expect(components['/_width11'].stateValues.isAbsolute).eq(true);
      expect(components['/_width12'].stateValues.value).closeTo(100 * 3.7795296, 1E-9);
      expect(components['/_width12'].stateValues.isAbsolute).eq(true);
      expect(components['/_width13'].stateValues.value).closeTo(10 * 3.7795296, 1E-9);
      expect(components['/_width13'].stateValues.isAbsolute).eq(true);
      expect(components['/_width14'].stateValues.value).closeTo(100 * 37.795296, 1E-9);
      expect(components['/_width14'].stateValues.isAbsolute).eq(true);
      expect(components['/_width15'].stateValues.value).closeTo(1 * 37.795296, 1E-9);
      expect(components['/_width15'].stateValues.isAbsolute).eq(true);
      expect(components['/_width16'].stateValues.value).closeTo(100 * 37.795296, 1E-9);
      expect(components['/_width16'].stateValues.isAbsolute).eq(true);

    })

  })

})
