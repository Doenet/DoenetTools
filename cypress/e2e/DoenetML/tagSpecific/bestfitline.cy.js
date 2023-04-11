import me from 'math-expressions';
import { cesc } from '../../../../src/_utils/url';


describe('BestFitLine Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })

  it('fit line to 4 points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
        <point>(1,2)</point>
        <point>(1,6)</point>
      
        <point>(7,3)</point>
        <point>(7,-1)</point>
      
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" target="l" assignNames="eq" />
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=−0.5x+4.5')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText('y=-0.5x+4.5').simplify().tree;
      expect(stateVariables['/l'].stateValues.equation).eqls(eqTree);
      expect(stateVariables['/eq'].stateValues.value).eqls(eqTree);
    })

    cy.log('move points')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: -8 }
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 3, y: 5 }
      });

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -5, y: -10 }
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: 3, y: 9 }
      });

    })

    cy.get(cesc('#\\/eq')).should('contain.text', 'y=2x+1')
    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=2x+1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText('y=2x+1').simplify().tree;
      expect(stateVariables['/l'].stateValues.equation).eqls(eqTree);
      expect(stateVariables['/eq'].stateValues.value).eqls(eqTree);
    })

  })

  it('no arguments', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      
      <text>a</text>
      <graph name="g">
      
        <bestFitLine name="l" />
      
      </graph>
      
      <copy prop="equation" target="l" assignNames="eq" />
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/l'].stateValues.equation).eqls("＿");
      expect(stateVariables['/eq'].stateValues.value).eqls("＿");
    })


  })

  it('fit line to 0 points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
      
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" target="l" assignNames="eq" />
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/l'].stateValues.equation).eqls("＿");
      expect(stateVariables['/eq'].stateValues.value).eqls("＿");
    })

  })

  it('fit line to 1 point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
      
        <point>(3,4)</point>
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" target="l" assignNames="eq" />
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=4')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/l'].stateValues.equation).eqls(["=", "y", 4]);
      expect(stateVariables['/eq'].stateValues.value).eqls(["=", "y", 4]);
    })

    cy.log('move point')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: -8 }
      });
    })

    cy.get(cesc('#\\/eq')).should('contain.text', 'y=−8')
    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=−8')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/l'].stateValues.equation).eqls(["=", "y", -8]);
      expect(stateVariables['/eq'].stateValues.value).eqls(["=", "y", -8]);
    })

  })

  it('fit line to 2 points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
      
        <point>(3,4)</point>
        <point>(-5,0)</point>
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" target="l" assignNames="eq" />
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=0.5x+2.5')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText('y=0.5x+2.5').simplify().tree;
      expect(stateVariables['/l'].stateValues.equation).eqls(eqTree);
      expect(stateVariables['/eq'].stateValues.value).eqls(eqTree);
    })

    cy.log('move points to be vertical')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: -8 }
      });
    })

    cy.get(cesc('#\\/eq')).should('contain.text', 'y=−4');
    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=−4')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/l'].stateValues.equation).eqls(["=", "y", -4]);
      expect(stateVariables['/eq'].stateValues.value).eqls(["=", "y", -4]);
    })


    cy.log('move points')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -4, y: -6 }
      });
    })

    cy.get(cesc('#\\/eq')).should('contain.text', 'y=2x+2')
    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=2x+2')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText('y=2x+2').simplify().tree;
      expect(stateVariables['/l'].stateValues.equation).eqls(eqTree);
      expect(stateVariables['/eq'].stateValues.value).eqls(eqTree);
    })

  })

  it('fit line to points of different dimensions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
        <point>(1,2)</point>
        <point>(1,6, a)</point>
      
        <point>(7,3,3,1,5)</point>
        <point>(7,-1,5,x)</point>
      
        <bestFitLine points="$ps" name="l" />
      
      </graph>
      
      <copy prop="equation" target="l" assignNames="eq" />

    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=−0.5x+4.5')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText('y=-0.5x+4.5').simplify().tree;
      expect(stateVariables['/l'].stateValues.equation).eqls(eqTree);
      expect(stateVariables['/eq'].stateValues.value).eqls(eqTree);
    })

    cy.log('move points')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: -8 }
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 3, y: 5 }
      });

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -5, y: -10 }
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: 3, y: 9 }
      });

    })

    cy.get(cesc('#\\/eq')).should('contain.text', 'y=2x+1')
    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=2x+1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText('y=2x+1').simplify().tree;
      expect(stateVariables['/l'].stateValues.equation).eqls(eqTree);
      expect(stateVariables['/eq'].stateValues.value).eqls(eqTree);
    })

  })


  it('fit line to 4 points, ignore non-numerical points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
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
      
      <copy prop="equation" target="l" assignNames="eq" />
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=−0.5x+4.5')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText('y=-0.5x+4.5').simplify().tree;
      expect(stateVariables['/l'].stateValues.equation).eqls(eqTree);
      expect(stateVariables['/eq'].stateValues.value).eqls(eqTree);
    })

    cy.log('move points')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -5, y: -8 }
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: 3, y: 5 }
      });

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point6",
        args: { x: -5, y: -10 }
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point8",
        args: { x: 3, y: 9 }
      });

    })

    cy.get(cesc('#\\/eq')).should('contain.text', 'y=2x+1')

    cy.get(cesc('#\\/eq')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=2x+1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText('y=2x+1').simplify().tree;
      expect(stateVariables['/l'].stateValues.equation).eqls(eqTree);
      expect(stateVariables['/eq'].stateValues.value).eqls(eqTree);
    })

  })

})