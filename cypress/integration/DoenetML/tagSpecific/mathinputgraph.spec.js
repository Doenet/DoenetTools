import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('MathInput Graph Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('mathinputs specifying point', () => {

    // two mathinputs specifying the x and y coordinate of a single point
    // demonstrates two-way data binding

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="x" prefill="1"/>
    <mathinput name="y" prefill="2"/>
    <graph>
    <point>(<copy prop="value" tname="x" />,<copy prop="value" tname="y" />)</point>
    </graph>
    <copy prop="coords" tname="_point1" name="coords" />`}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let coordsAnchor = cesc('#' + components["/coords"].replacements[0].componentName);

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/x'].stateValues.value.tree).is.eq(1);
        expect(components['/y'].stateValues.value.tree).is.eq(2);
        expect(components['/_point1'].stateValues.xs[0].tree).is.eq(1);
        expect(components['/_point1'].stateValues.xs[1].tree).is.eq(2);
      });


      cy.log("Enter -3 for x");
      cy.get('#\\/x textarea').type('{end}{backspace}-3{enter}', { force: true });

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,2)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/x'].stateValues.value.evaluate_to_constant()).to.eq(-3);
        expect(components['/y'].stateValues.value.tree).is.eq(2);
        expect(components['/_point1'].stateValues.xs[0].evaluate_to_constant()).to.eq(-3);
        expect(components['/_point1'].stateValues.xs[1].tree).is.eq(2);
      });


      cy.log("Enter -4 for y");
      cy.get('#\\/y textarea').type('{end}{backspace}-4{enter}', { force: true });

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−4)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/x'].stateValues.value.evaluate_to_constant()).to.eq(-3);
        expect(components['/y'].stateValues.value.evaluate_to_constant()).to.eq(-4);
        expect(components['/_point1'].stateValues.xs[0].evaluate_to_constant()).to.eq(-3);
        expect(components['/_point1'].stateValues.xs[1].evaluate_to_constant()).to.eq(-4);
      });

      cy.log(`move point to (5,-6)`)
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 5, y: -6 });
        expect(components['/x'].stateValues.value.evaluate_to_constant()).to.eq(5);
        expect(components['/y'].stateValues.value.evaluate_to_constant()).to.eq(-6);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(5);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(-6);
      });

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−6)')
      });

    })

  })

  it('mathinput specifying point -- non-invertible x', () => {

    // x-coordinate is the square of the first mathinput
    // therefore, cannot invert from x-coordinate to mathinput
    // so that cannot change x-coordinate directly by dragging point

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="x" prefill="3"/>
    <mathinput name="y" prefill="2"/>
    <graph>
    <point>(<copy prop="value" tname="x" />^2,<copy prop="value" tname="y" />)</point>
    </graph>
    <copy prop="coords" tname="_point1" name="coords" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let coordsAnchor = cesc('#' + components["/coords"].replacements[0].componentName);

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,2)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/x'].stateValues.value.tree).is.eq(3);
        expect(components['/y'].stateValues.value.tree).is.eq(2);
        expect(components['/_point1'].stateValues.xs[0].tree).is.eq(9);
        expect(components['/_point1'].stateValues.xs[1].tree).is.eq(2);
      });


      cy.log("Enter -1.2 for x");
      cy.get('#\\/x textarea').type('{end}{backspace}-1.2{enter}', { force: true });

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.44,2)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/x'].stateValues.value.evaluate_to_constant()).to.eq(-1.2);
        expect(components['/y'].stateValues.value.tree).is.eq(2);
        expect(components['/_point1'].stateValues.xs[0].evaluate_to_constant()).to.eq(1.44);
        expect(components['/_point1'].stateValues.xs[1].tree).is.eq(2);
      });


      cy.log(`try to move point to (5,6)`)
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 5, y: 6 });
        expect(components['/x'].stateValues.value.evaluate_to_constant()).to.eq(-1.2);
        expect(components['/y'].stateValues.value.evaluate_to_constant()).to.eq(6);
        expect(components['/_point1'].stateValues.xs[0].tree).eq(1.44);
        expect(components['/_point1'].stateValues.xs[1].tree).eq(6);
      });

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.44,6)')
      });
    })

  });

  it('mathinput specifying point -- product', () => {

    // x-coordinate of a point is product of mathinputs
    // Since cannot determine both factors from the product
    // the transformation is non-invertible
    // and cannot directly change the x-coordinate of point by dragging

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="a" prefill="-3"/>
    <mathinput name="b" prefill="2"/>
    <graph>
    <point>(<copy prop="value" tname="a" /><copy prop="value" tname="b" />, -7)</point>
    </graph>
    <copy prop="coords" tname="_point1" name="coords" />`}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let coordsAnchor = cesc('#' + components["/coords"].replacements[0].componentName);

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,−7)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.value.evaluate_to_constant()).is.eq(-3);
        expect(components['/b'].stateValues.value.evaluate_to_constant()).is.eq(2);
        expect(components['/_point1'].stateValues.xs[0].evaluate_to_constant()).is.eq(-6);
        expect(components['/_point1'].stateValues.xs[1].evaluate_to_constant()).is.eq(-7);
      });


      cy.log("Enter -1.5 for a");
      cy.get('#\\/a textarea').type('{end}{backspace}{backspace}-1.5{enter}', { force: true });

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.value.evaluate_to_constant()).is.eq(-1.5);
        expect(components['/b'].stateValues.value.evaluate_to_constant()).is.eq(2);
        expect(components['/_point1'].stateValues.xs[0].evaluate_to_constant()).is.eq(-3);
        expect(components['/_point1'].stateValues.xs[1].evaluate_to_constant()).is.eq(-7);
      });


      cy.log(`try to move point to (5,6)`)
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 5, y: 6 });
        expect(components['/a'].stateValues.value.evaluate_to_constant()).is.eq(-1.5);
        expect(components['/b'].stateValues.value.evaluate_to_constant()).is.eq(2);
        expect(components['/_point1'].stateValues.xs[0].evaluate_to_constant()).is.eq(-3);
        expect(components['/_point1'].stateValues.xs[1].evaluate_to_constant()).is.eq(6);
      });

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,6)')
      });

    })
  });

  it('mathinput specifying point -- product, make invertible', () => {

    // x-coordinate of a point is product of mathinputs
    // Since one factor is marked with modifyIndirectly=false,
    // we leave that factor constant when changing the x-coordinate by dragging
    // and modify the other factor to match the new x-coordinate

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="a" prefill="-3"/>
    <mathinput name="b" prefill="2"/>
    <graph>
    <point>(<copy prop="value" tname="a" /><copy prop="value" modifyIndirectly="false" tname="b" />, -7)</point>
    </graph>
    <copy prop="coords" tname="_point1" name="coords" />`}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let coordsAnchor = cesc('#' + components["/coords"].replacements[0].componentName);

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,−7)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.value.evaluate_to_constant()).is.eq(-3);
        expect(components['/b'].stateValues.value.evaluate_to_constant()).is.eq(2);
        expect(components['/_point1'].stateValues.xs[0].evaluate_to_constant()).is.eq(-6);
        expect(components['/_point1'].stateValues.xs[1].evaluate_to_constant()).is.eq(-7);
      });


      cy.log("Enter -1.5 for a");
      cy.get('#\\/a textarea').type('{end}{backspace}{backspace}-1.5{enter}', { force: true });

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.value.evaluate_to_constant()).is.eq(-1.5);
        expect(components['/b'].stateValues.value.evaluate_to_constant()).is.eq(2);
        expect(components['/_point1'].stateValues.xs[0].evaluate_to_constant()).is.eq(-3);
        expect(components['/_point1'].stateValues.xs[1].evaluate_to_constant()).is.eq(-7);
      });


      cy.log(`move point to (5,6)`)
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_point1'].movePoint({ x: 5, y: 6 });
        expect(components['/a'].stateValues.value.evaluate_to_constant()).is.eq(2.5);
        expect(components['/b'].stateValues.value.evaluate_to_constant()).is.eq(2);
        expect(components['/_point1'].stateValues.xs[0].evaluate_to_constant()).is.eq(5);
        expect(components['/_point1'].stateValues.xs[1].evaluate_to_constant()).is.eq(6);
      });

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)')
      });
    })

  });


});