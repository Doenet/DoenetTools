import cssesc from 'cssesc';
import me from 'math-expressions';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('MathInput Graph Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
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
    <point>(<copy prop="value" target="x" />,<copy prop="value" target="y" />)</point>
    </graph>
    <copy prop="coords" target="_point1" name="coords" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coordsAnchor = cesc('#' + stateVariables["/coords"].replacements[0].componentName);

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/x'].stateValues.value).is.eq(1);
        expect(stateVariables['/y'].stateValues.value).is.eq(2);
        expect(stateVariables['/_point1'].stateValues.xs[0]).is.eq(1);
        expect(stateVariables['/_point1'].stateValues.xs[1]).is.eq(2);
      });


      cy.log("Enter -3 for x");
      cy.get('#\\/x textarea').type('{end}{backspace}-3{enter}', { force: true });
      cy.get(coordsAnchor).should('contain.text', '(−3,2)')

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,2)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/x'].stateValues.value).evaluate_to_constant()).to.eq(-3);
        expect(stateVariables['/y'].stateValues.value).is.eq(2);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[0]).evaluate_to_constant()).to.eq(-3);
        expect(stateVariables['/_point1'].stateValues.xs[1]).is.eq(2);
      });


      cy.log("Enter -4 for y");
      cy.get('#\\/y textarea').type('{end}{backspace}-4{enter}', { force: true });
      cy.get(coordsAnchor).should('contain.text', '(−3,−4)')

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−4)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/x'].stateValues.value).evaluate_to_constant()).to.eq(-3);
        expect(me.fromAst(stateVariables['/y'].stateValues.value).evaluate_to_constant()).to.eq(-4);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[0]).evaluate_to_constant()).to.eq(-3);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[1]).evaluate_to_constant()).to.eq(-4);
      });

      cy.log(`move point to (5,-6)`)
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: 5, y: -6 }
        });
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/x'].stateValues.value).evaluate_to_constant()).to.eq(5);
        expect(me.fromAst(stateVariables['/y'].stateValues.value).evaluate_to_constant()).to.eq(-6);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(5);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(-6);
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
    <point>(<copy prop="value" target="x" />^2,<copy prop="value" target="y" />)</point>
    </graph>
    <copy prop="coords" target="_point1" name="coords" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coordsAnchor = cesc('#' + stateVariables["/coords"].replacements[0].componentName);

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,2)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/x'].stateValues.value).is.eq(3);
        expect(stateVariables['/y'].stateValues.value).is.eq(2);
        expect(stateVariables['/_point1'].stateValues.xs[0]).is.eq(9);
        expect(stateVariables['/_point1'].stateValues.xs[1]).is.eq(2);
      });


      cy.log("Enter -1.2 for x");
      cy.get('#\\/x textarea').type('{end}{backspace}-1.2{enter}', { force: true });
      cy.get(coordsAnchor).should('contain.text', '(1.44,2)')

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.44,2)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/x'].stateValues.value).evaluate_to_constant()).to.eq(-1.2);
        expect(stateVariables['/y'].stateValues.value).is.eq(2);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[0]).evaluate_to_constant()).to.eq(1.44);
        expect(stateVariables['/_point1'].stateValues.xs[1]).is.eq(2);
      });


      cy.log(`try to move point to (5,6)`)
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: 5, y: 6 }
        });
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/x'].stateValues.value).evaluate_to_constant()).to.eq(-1.2);
        expect(me.fromAst(stateVariables['/y'].stateValues.value).evaluate_to_constant()).to.eq(6);
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(1.44);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(6);
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
    <point>(<copy prop="value" target="a" /><copy prop="value" target="b" />, -7)</point>
    </graph>
    <copy prop="coords" target="_point1" name="coords" />`}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coordsAnchor = cesc('#' + stateVariables["/coords"].replacements[0].componentName);

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,−7)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/a'].stateValues.value).evaluate_to_constant()).is.eq(-3);
        expect(me.fromAst(stateVariables['/b'].stateValues.value).evaluate_to_constant()).is.eq(2);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[0]).evaluate_to_constant()).is.eq(-6);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[1]).evaluate_to_constant()).is.eq(-7);
      });


      cy.log("Enter -1.5 for a");
      cy.get('#\\/a textarea').type('{end}{backspace}{backspace}-1.5{enter}', { force: true });
      cy.get(coordsAnchor).should('contain.text', '(−3,−7)')

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/a'].stateValues.value).evaluate_to_constant()).is.eq(-1.5);
        expect(me.fromAst(stateVariables['/b'].stateValues.value).evaluate_to_constant()).is.eq(2);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[0]).evaluate_to_constant()).is.eq(-3);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[1]).evaluate_to_constant()).is.eq(-7);
      });


      cy.log(`try to move point to (5,6)`)
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: 5, y: 6 }
        });
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/a'].stateValues.value).evaluate_to_constant()).is.eq(-1.5);
        expect(me.fromAst(stateVariables['/b'].stateValues.value).evaluate_to_constant()).is.eq(2);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[0]).evaluate_to_constant()).is.eq(-3);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[1]).evaluate_to_constant()).is.eq(6);
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
    <point>(<copy prop="value" target="a" /><copy prop="value" modifyIndirectly="false" target="b" />, -7)</point>
    </graph>
    <copy prop="coords" target="_point1" name="coords" />`}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coordsAnchor = cesc('#' + stateVariables["/coords"].replacements[0].componentName);

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,−7)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/a'].stateValues.value).evaluate_to_constant()).is.eq(-3);
        expect(me.fromAst(stateVariables['/b'].stateValues.value).evaluate_to_constant()).is.eq(2);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[0]).evaluate_to_constant()).is.eq(-6);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[1]).evaluate_to_constant()).is.eq(-7);
      });


      cy.log("Enter -1.5 for a");
      cy.get('#\\/a textarea').type('{end}{backspace}{backspace}-1.5{enter}', { force: true });
      cy.get(coordsAnchor).should('contain.text', '(−3,−7)')

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/a'].stateValues.value).evaluate_to_constant()).is.eq(-1.5);
        expect(me.fromAst(stateVariables['/b'].stateValues.value).evaluate_to_constant()).is.eq(2);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[0]).evaluate_to_constant()).is.eq(-3);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[1]).evaluate_to_constant()).is.eq(-7);
      });


      cy.log(`move point to (5,6)`)
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: 5, y: 6 }
        });
        let stateVariables = await win.returnAllStateVariables1();
        expect(me.fromAst(stateVariables['/a'].stateValues.value).evaluate_to_constant()).is.eq(2.5);
        expect(me.fromAst(stateVariables['/b'].stateValues.value).evaluate_to_constant()).is.eq(2);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[0]).evaluate_to_constant()).is.eq(5);
        expect(me.fromAst(stateVariables['/_point1'].stateValues.xs[1]).evaluate_to_constant()).is.eq(6);
      });

      cy.log('Test values displayed in browser')
      cy.get(coordsAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)')
      });
    })

  });


});