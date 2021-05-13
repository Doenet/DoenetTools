
describe('Slider Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

it('slider with no arguments', ()=>{
  cy.window().then((win) => {
    win.postMessage({
      doenetML: `
      <text>Slider with no arguments</text>
      <slider />

  `}, "*");
  });
  cy.get('[data-cy=\\/_slider-handle]')
  .trigger('mousedown')
      .trigger('mousemove', { clientX: 150, clientY: 0 })
      .trigger('mouseup')

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let slider1value = components['/_slider1'].stateValues.value;
        expect(slider1value).eq(3)
      })
})
 



it('move default seven number slider', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider label="test label" showTicks>
  <number>1</number>
  <number>2</number>
  <number>3</number> 
  <number>4</number>
  <number>5</number>
  <number>6</number>
  <number>7</number>
</slider>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.log('move handle to 100 px');
    cy.get('[data-cy=\\/_slider-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 145, clientY: 0 })
      .trigger('mouseup')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let slider1value = components['/_slider1'].stateValues.value;
      expect(slider1value).eq(1)
    })

    cy.get('[data-cy=\\/_slider2divslider-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 160, clientY: 0 })
      .trigger('mouseup')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let slider1value = components['/_slider1'].stateValues.value;
      expect(slider1value).eq(2)
    })

    cy.get('[data-cy=\\/_slider1divslider-track]')
      .click('left');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let slider1value = components['/_slider1'].stateValues.value;
      expect(slider1value).eq(1)
    })
  })
})



