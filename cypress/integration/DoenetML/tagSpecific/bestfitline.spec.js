import me from 'math-expressions';

describe('BestFitLine Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('fit line to 4 points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" tname="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
        <point>(1,2)</point>
        <point>(1,6)</point>
      
        <point>(7,3)</point>
        <point>(7,-1)</point>
      
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" tname="l" assignNames="eq" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=−0.5x+4.5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let eqTree = me.fromText('y=-0.5x+4.5').simplify().tree;
      expect(components['/l'].stateValues.equation.tree).eqls(eqTree);
      expect(components['/eq'].stateValues.value.tree).eqls(eqTree);
    })

    cy.log('move points')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/_point1"].movePoint({ x: -5, y: -8 });
      components["/_point2"].movePoint({ x: 3, y: 5 });

      components["/_point3"].movePoint({ x: -5, y: -10 });
      components["/_point4"].movePoint({ x: 3, y: 9 });

    })

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=2x+1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let eqTree = me.fromText('y=2x+1').simplify().tree;
      expect(components['/l'].stateValues.equation.tree).eqls(eqTree);
      expect(components['/eq'].stateValues.value.tree).eqls(eqTree);
    })

  })

  it('no arguments', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      
      <text>a</text>
      <graph name="g">
      
        <bestFitLine name="l" />
      
      </graph>
      
      <copy prop="equation" tname="l" assignNames="eq" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/l'].stateValues.equation.tree).eqls("＿");
      expect(components['/eq'].stateValues.value.tree).eqls("＿");
    })


  })

  it('fit line to 0 points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" tname="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
      
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" tname="l" assignNames="eq" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/l'].stateValues.equation.tree).eqls("＿");
      expect(components['/eq'].stateValues.value.tree).eqls("＿");
    })

  })

  it('fit line to 1 point', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" tname="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
      
        <point>(3,4)</point>
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" tname="l" assignNames="eq" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=4')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/l'].stateValues.equation.tree).eqls(["=", "y", 4]);
      expect(components['/eq'].stateValues.value.tree).eqls(["=", "y", 4]);
    })

    cy.log('move point')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/_point1"].movePoint({ x: -5, y: -8 });
    })

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=−8')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/l'].stateValues.equation.tree).eqls(["=", "y", -8]);
      expect(components['/eq'].stateValues.value.tree).eqls(["=", "y", -8]);
    })

  })

  it('fit line to 2 points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" tname="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
      
        <point>(3,4)</point>
        <point>(-5,0)</point>
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" tname="l" assignNames="eq" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=0.5x+2.5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let eqTree = me.fromText('y=0.5x+2.5').simplify().tree;
      expect(components['/l'].stateValues.equation.tree).eqls(eqTree);
      expect(components['/eq'].stateValues.value.tree).eqls(eqTree);
    })

    cy.log('move points to be vertical')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/_point1"].movePoint({ x: -5, y: -8 });
    })

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=−4')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/l'].stateValues.equation.tree).eqls(["=", "y", -4]);
      expect(components['/eq'].stateValues.value.tree).eqls(["=", "y", -4]);
    })


    cy.log('move points')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/_point2"].movePoint({ x: -4, y: -6 });
    })

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=2x+2')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let eqTree = me.fromText('y=2x+2').simplify().tree;
      expect(components['/l'].stateValues.equation.tree).eqls(eqTree);
      expect(components['/eq'].stateValues.value.tree).eqls(eqTree);
    })

  })

  it('fit line to points of different dimensions', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" tname="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
        <point>(1,2)</point>
        <point>(1,6, a)</point>
      
        <point>(7,3,3,1,5)</point>
        <point>(7,-1,5,x)</point>
      
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" tname="l" assignNames="eq" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=−0.5x+4.5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let eqTree = me.fromText('y=-0.5x+4.5').simplify().tree;
      expect(components['/l'].stateValues.equation.tree).eqls(eqTree);
      expect(components['/eq'].stateValues.value.tree).eqls(eqTree);
    })

    cy.log('move points')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/_point1"].movePoint({ x: -5, y: -8 });
      components["/_point2"].movePoint({ x: 3, y: 5 });

      components["/_point3"].movePoint({ x: -5, y: -10 });
      components["/_point4"].movePoint({ x: 3, y: 9 });

    })

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=2x+1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let eqTree = me.fromText('y=2x+1').simplify().tree;
      expect(components['/l'].stateValues.equation.tree).eqls(eqTree);
      expect(components['/eq'].stateValues.value.tree).eqls(eqTree);
    })

  })


  it('fit line to 4 points, ignore non-numerical points', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" tname="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
        <point>(a,b)</point>
        <point>(1,2)</point>
        <point>(c,2)</point>
        <point>(1,6)</point>
        <point>(1,d)</point>
      
        <point>(7,3)</point>
        <point>(7+f,3+g)</point>
        <point>(7,-1)</point>
        <point>(,-1)</point>
      
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" tname="l" assignNames="eq" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=−0.5x+4.5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let eqTree = me.fromText('y=-0.5x+4.5').simplify().tree;
      expect(components['/l'].stateValues.equation.tree).eqls(eqTree);
      expect(components['/eq'].stateValues.value.tree).eqls(eqTree);
    })

    cy.log('move points')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/_point2"].movePoint({ x: -5, y: -8 });
      components["/_point4"].movePoint({ x: 3, y: 5 });

      components["/_point6"].movePoint({ x: -5, y: -10 });
      components["/_point8"].movePoint({ x: 3, y: 9 });

    })

    cy.get('#\\/eq').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=2x+1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let eqTree = me.fromText('y=2x+1').simplify().tree;
      expect(components['/l'].stateValues.equation.tree).eqls(eqTree);
      expect(components['/eq'].stateValues.value.tree).eqls(eqTree);
    })

  })

})