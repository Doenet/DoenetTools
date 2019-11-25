describe('Mathinput Graph Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('mathinputs specifying point', () => {

    // two mathinputs specifying the x and y coordinate of a single point
    // demonstrates two-way data binding

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <mathinput name="x" prefill="1"/>
    <mathinput name="y" prefill="2"/>
    <graph>
    <point><coords>(<ref prop="value">x</ref>,<ref prop="value">y</ref>)</coords></point>
    </graph>
    <ref prop="coords">_point1</ref>`}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/x_input').should('have.value', '1');
    cy.get('#\\/y_input').should('have.value', '2');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].state.value.tree).is.eq(1);
      expect(components['/y'].state.value.tree).is.eq(2);
      expect(components['/_point1'].state.xs[0].tree).is.eq(1);
      expect(components['/_point1'].state.xs[1].tree).is.eq(2);
    });


    cy.log("Enter -3 for x");
    cy.get('#\\/x_input').clear().type('-3{enter}');

    cy.log('Test values displayed in browser')
    cy.get('#\\/x_input').should('have.value', '-3');
    cy.get('#\\/y_input').should('have.value', '2');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,2)')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].state.value.evaluate_to_constant()).to.eq(-3);
      expect(components['/y'].state.value.tree).is.eq(2);
      expect(components['/_point1'].state.xs[0].evaluate_to_constant()).to.eq(-3);
      expect(components['/_point1'].state.xs[1].tree).is.eq(2);
    });


    cy.log("Enter -4 for y");
    cy.get('#\\/y_input').clear().type('-4{enter}');

    cy.log('Test values displayed in browser')
    cy.get('#\\/x_input').should('have.value', '-3');
    cy.get('#\\/y_input').should('have.value', '-4');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,−4)')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].state.value.evaluate_to_constant()).to.eq(-3);
      expect(components['/y'].state.value.evaluate_to_constant()).to.eq(-4);
      expect(components['/_point1'].state.xs[0].evaluate_to_constant()).to.eq(-3);
      expect(components['/_point1'].state.xs[1].evaluate_to_constant()).to.eq(-4);
    });

    cy.log(`move point to (5,-6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 5, y: -6 });
      expect(components['/x'].state.value.evaluate_to_constant()).to.eq(5);
      expect(components['/y'].state.value.evaluate_to_constant()).to.eq(-6);
      expect(components['/_point1'].state.xs[0].tree).eq(5);
      expect(components['/_point1'].state.xs[1].tree).eq(-6);
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/x_input').should('have.value', '5');
    cy.get('#\\/y_input').should('have.value', '-6');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,−6)')
    });



  })

  it('mathinput specifying point -- non-invertible x', () => {

    // x-coordinate is the square of the first mathinput
    // therefore, cannot invert from x-coordinate to mathinput
    // so that cannot change x-coordinate directly by dragging point

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <mathinput name="x" prefill="3"/>
    <mathinput name="y" prefill="2"/>
    <graph>
    <point><coords simplify>(<ref prop="value">x</ref>^2,<ref prop="value">y</ref>)</coords></point>
    </graph>
    <ref prop="coords">_point1</ref>
    `}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/x_input').should('have.value', '3');
    cy.get('#\\/y_input').should('have.value', '2');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9,2)')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].state.value.tree).is.eq(3);
      expect(components['/y'].state.value.tree).is.eq(2);
      expect(components['/_point1'].state.xs[0].tree).is.eq(9);
      expect(components['/_point1'].state.xs[1].tree).is.eq(2);
    });


    cy.log("Enter -1.2 for x");
    cy.get('#\\/x_input').clear().type('-1.2{enter}');

    cy.log('Test values displayed in browser')
    cy.get('#\\/x_input').should('have.value', '-1.2');
    cy.get('#\\/y_input').should('have.value', '2');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.44,2)')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].state.value.evaluate_to_constant()).to.eq(-1.2);
      expect(components['/y'].state.value.tree).is.eq(2);
      expect(components['/_point1'].state.xs[0].evaluate_to_constant()).to.eq(1.44);
      expect(components['/_point1'].state.xs[1].tree).is.eq(2);
    });


    cy.log(`try to move point to (5,6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 5, y: 6 });
      expect(components['/x'].state.value.evaluate_to_constant()).to.eq(-1.2);
      expect(components['/y'].state.value.evaluate_to_constant()).to.eq(6);
      expect(components['/_point1'].state.xs[0].tree).eq(1.44);
      expect(components['/_point1'].state.xs[1].tree).eq(6);
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/x_input').should('have.value', '-1.2');
    cy.get('#\\/y_input').should('have.value', '6');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.44,6)')
    });


  });


  it('mathinput specifying point -- product', () => {

    // x-coordinate of a point is product of mathinputs
    // Since cannot determine both factors from the product
    // the transformation is non-invertible
    // and cannot directly change the x-coordinate of point by dragging

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <mathinput name="a" prefill="-3"/>
    <mathinput name="b" prefill="2"/>
    <graph>
    <point><coords simplify>(<ref prop="value">a</ref><ref prop="value">b</ref>, -7)</coords></point>
    </graph>
    <ref prop="coords">_point1</ref>`}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/a_input').should('have.value', '- 3');
    cy.get('#\\/b_input').should('have.value', '2');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−6,−7)')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].state.value.evaluate_to_constant()).is.eq(-3);
      expect(components['/b'].state.value.evaluate_to_constant()).is.eq(2);
      expect(components['/_point1'].state.xs[0].evaluate_to_constant()).is.eq(-6);
      expect(components['/_point1'].state.xs[1].evaluate_to_constant()).is.eq(-7);
    });


    cy.log("Enter -1.5 for a");
    cy.get('#\\/a_input').clear().type('-1.5{enter}');

    cy.log('Test values displayed in browser')
    cy.get('#\\/a_input').should('have.value', '-1.5');
    cy.get('#\\/b_input').should('have.value', '2');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,−7)')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].state.value.evaluate_to_constant()).is.eq(-1.5);
      expect(components['/b'].state.value.evaluate_to_constant()).is.eq(2);
      expect(components['/_point1'].state.xs[0].evaluate_to_constant()).is.eq(-3);
      expect(components['/_point1'].state.xs[1].evaluate_to_constant()).is.eq(-7);
    });


    cy.log(`try to move point to (5,6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 5, y: 6 });
      expect(components['/a'].state.value.evaluate_to_constant()).is.eq(-1.5);
      expect(components['/b'].state.value.evaluate_to_constant()).is.eq(2);
      expect(components['/_point1'].state.xs[0].evaluate_to_constant()).is.eq(-3);
      expect(components['/_point1'].state.xs[1].evaluate_to_constant()).is.eq(6);
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/a_input').should('have.value', '-1.5');
    cy.get('#\\/b_input').should('have.value', '2');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,6)')
    });


  });


  it('mathinput specifying point -- product, make invertible', () => {

    // x-coordinate of a point is product of mathinputs
    // Since one factor is marked with modifybyreference=false,
    // we leave that factor constant when changing the x-coordinate by dragging
    // and modify the other factor to match the new x-coordinate

    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <mathinput name="a" prefill="-3"/>
    <mathinput name="b" prefill="2"/>
    <graph>
    <point><coords simplify>(<ref prop="value">a</ref><ref prop="value" modifybyreference="false">b</ref>, -7)</coords></point>
    </graph>
    <ref prop="coords">_point1</ref>`}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/a_input').should('have.value', '- 3');
    cy.get('#\\/b_input').should('have.value', '2');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−6,−7)')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].state.value.evaluate_to_constant()).is.eq(-3);
      expect(components['/b'].state.value.evaluate_to_constant()).is.eq(2);
      expect(components['/_point1'].state.xs[0].evaluate_to_constant()).is.eq(-6);
      expect(components['/_point1'].state.xs[1].evaluate_to_constant()).is.eq(-7);
    });


    cy.log("Enter -1.5 for a");
    cy.get('#\\/a_input').clear().type('-1.5{enter}');

    cy.log('Test values displayed in browser')
    cy.get('#\\/a_input').should('have.value', '-1.5');
    cy.get('#\\/b_input').should('have.value', '2');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,−7)')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].state.value.evaluate_to_constant()).is.eq(-1.5);
      expect(components['/b'].state.value.evaluate_to_constant()).is.eq(2);
      expect(components['/_point1'].state.xs[0].evaluate_to_constant()).is.eq(-3);
      expect(components['/_point1'].state.xs[1].evaluate_to_constant()).is.eq(-7);
    });


    cy.log(`move point to (5,6)`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 5, y: 6 });
      expect(components['/a'].state.value.evaluate_to_constant()).is.eq(2.5);
      expect(components['/b'].state.value.evaluate_to_constant()).is.eq(2);
      expect(components['/_point1'].state.xs[0].evaluate_to_constant()).is.eq(5);
      expect(components['/_point1'].state.xs[1].evaluate_to_constant()).is.eq(6);
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/a_input').should('have.value', '5/2');
    cy.get('#\\/b_input').should('have.value', '2');

    cy.get('#__coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,6)')
    });


  });


});