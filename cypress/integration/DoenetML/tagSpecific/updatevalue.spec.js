describe('UpdateValue Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')


  })

  it('incrementing graph of line segments', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <number name="step">20/<copy tname="count" /></number>
    <number name="count">2</number>
    <graph>
    <map assignNames="l1 l2 l3 l4 l5 l6 l7 l8 l9 l10 l11 l12 l13 l14 l15 l16" >
    <template newNamespace>
    <linesegment endpoints="($x, sin($x)) ($x+$(../step), sin($x+$(../step)))" />
    </template>
    <sources alias="x">
    <sequence from="-10" to="10-$step" length="$count" />
    </sources>
    </map>
    </graph>
    <p></p>
    <updatevalue label="double" tName="count" newValue="2$count" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let left = -10;

    cy.log(`check internal values`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let count = 2;
      let step = 20 / count;

      expect(components['/count'].stateValues.value).eq(count);
      expect(components['/step'].stateValues.value).eq(step);

      for (let ind = 1; ind <= count; ind++) {
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][0]
          .evaluate_to_constant()).closeTo(left + (ind - 1) * step, 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][1]
          .evaluate_to_constant()).closeTo(Math.sin(left + (ind - 1) * step), 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][0]
          .evaluate_to_constant()).closeTo(left + ind * step, 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][1]
          .evaluate_to_constant()).closeTo(Math.sin(left + ind * step), 1E-12);
      }
    });

    cy.log('double number');
    cy.get('#\\/_updatevalue1').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let count = 4;
      let step = 20 / count;


      expect(components['/count'].stateValues.value).eq(count);
      expect(components['/step'].stateValues.value).eq(step);

      for (let ind = 1; ind <= count; ind++) {
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][0]
          .evaluate_to_constant()).closeTo(left + (ind - 1) * step, 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][1]
          .evaluate_to_constant()).closeTo(Math.sin(left + (ind - 1) * step), 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][0]
          .evaluate_to_constant()).closeTo(left + ind * step, 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][1]
          .evaluate_to_constant()).closeTo(Math.sin(left + ind * step), 1E-12);
      }
    });

    cy.log('double number a second time');
    cy.get('#\\/_updatevalue1').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let count = 8;
      let step = 20 / count;


      expect(components['/count'].stateValues.value).eq(count);
      expect(components['/step'].stateValues.value).eq(step);

      for (let ind = 1; ind <= count; ind++) {
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][0]
          .evaluate_to_constant()).closeTo(left + (ind - 1) * step, 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][1]
          .evaluate_to_constant()).closeTo(Math.sin(left + (ind - 1) * step), 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][0]
          .evaluate_to_constant()).closeTo(left + ind * step, 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][1]
          .evaluate_to_constant()).closeTo(Math.sin(left + ind * step), 1E-12);
      }
    });

    cy.log('double number a third time');
    cy.get('#\\/_updatevalue1').click();
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let count = 16;
      let step = 20 / count;


      expect(components['/count'].stateValues.value).eq(count);
      expect(components['/step'].stateValues.value).eq(step);

      for (let ind = 1; ind <= count; ind++) {
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][0]
          .evaluate_to_constant()).closeTo(left + (ind - 1) * step, 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][1]
          .evaluate_to_constant()).closeTo(Math.sin(left + (ind - 1) * step), 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][0]
          .evaluate_to_constant()).closeTo(left + ind * step, 1E-12);
        expect(components['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][1]
          .evaluate_to_constant()).closeTo(Math.sin(left + ind * step), 1E-12);
      }
    });

  })

  it('update boolean', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="b" />
    <updateValue tName="b" newValue="not$b" type="boolean" label="change mind" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");

    cy.get('#\\/_updatevalue1').click();
    cy.get('#\\/b').should('have.text', "true");


    cy.get('#\\/_updatevalue1').click();
    cy.get('#\\/b').should('have.text', "false");

  })

  // catch bug where componentWithSelectableType wasn't 
  // converting strings to booleans correctly
  it('update boolean using string value', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="b" />
    <updateValue name="setTrue" tName="b" newValue="true" type="boolean" label="set true" />
    <updateValue name="setFalse" tName="b" newValue="false" type="boolean" label="set false" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");

    cy.get('#\\/setTrue').click();
    cy.get('#\\/b').should('have.text', "true");

    cy.get('#\\/setTrue').click();
    cy.get('#\\/b').should('have.text', "true");

    cy.get('#\\/setFalse').click();
    cy.get('#\\/b').should('have.text', "false");

    cy.get('#\\/setFalse').click();
    cy.get('#\\/b').should('have.text', "false");

    cy.get('#\\/setTrue').click();
    cy.get('#\\/b').should('have.text', "true");

  })

  it('update number using string value with operator', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <number name="n" >1</number>
    <updateValue name="setToSum" tName="n" newValue="1+1" type="number" label="set to 1+1" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/n').should('have.text', "1");

    cy.get('#\\/setToSum').click();
    cy.get('#\\/n').should('have.text', "2");
  })

  it('update property', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <point name="P">(1,2)</point>

    <updateValue tName="P" prop="x" newValue="2$(P{prop='x'})" label="double" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })

    cy.get('#\\/_updatevalue1').click();
    cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,2)')
    })

    cy.get('#\\/_updatevalue1').click();
    cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,2)')
    })
  })

  it('update componentIndex', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="grp">
      <point name="p">(3,2)</point>
      <point name="p2">(1,5)</point>
      <point name="p3">(7,0)</point>
    </group>
    
    <collect componentTypes="point" tname="grp" name="col" />
  
    <updateValue tName="col" prop="x" newValue="2$(p{prop='x'})" componentIndex="2" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,0)')
    })

    cy.get('#\\/_updatevalue1').click();
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,0)')
    })

    cy.get('#\\/_updatevalue1').click();
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,0)')
    })

  })

  it('update multiple components', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="grp">
      <point name="p">(3,2)</point>
      <point name="p2">(1,5)</point>
      <point name="p3">(7,0)</point>
    </group>
    
    <collect componentTypes="point" tname="grp" name="col" />
  
    <updateValue tName="col" prop="x" newValue="2$(p{prop='x'})" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,0)')
    })

    cy.get('#\\/_updatevalue1').click();
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,0)')
    })

    cy.get('#\\/_updatevalue1').click();
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(12,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(12,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(12,0)')
    })

  })

  it('chained updates', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" tName="x" newValue="3$x" label="update" simplify />
    <updateValue name="quad" tName="y" newValue="4$y" triggerWithTnames="trip" simplify />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });

    cy.get('#\\/quad').should('not.exist');

    cy.get('#\\/trip').click();
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x')
    });
    // since second change is asynchronous, need to use other form so that cypress will wait
    cy.get('#\\/y').find('.mjx-mrow').should('have.text', '4y')
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4y')
    });

    cy.get('#\\/trip').click();

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9x')
    });
    // since second change is asynchronous, need to use other form so that cypress will wait
    // (keep other form of test to make it clear we aren't actually changing anything)
    cy.get('#\\/y').find('.mjx-mrow').should('have.text', '16y')
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16y')
    });

  })

  it('chained updates on multiple sources', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x">x</math>
    <math name="y">y</math>
    <math name="z">z</math>
    
    <updateValue name="doub" tName="z" newValue="2$z" label="update" simplify />
    <updateValue name="trip" tName="x" newValue="3$x" label="update" simplify />
    <updateValue name="quad" tName="y" newValue="4$y" triggerWithTnames="doub trip" simplify />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#\\/z').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });

    cy.get('#\\/quad').should('not.exist');

    cy.get('#\\/trip').click();
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x')
    });
    cy.get('#\\/z').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    // since second change is asynchronous, need to use other form so that cypress will wait
    cy.get('#\\/y').find('.mjx-mrow').should('have.text', '4y')
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4y')
    });

    cy.get('#\\/doub').click();
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x')
    });
    cy.get('#\\/z').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2z')
    });
    // since second change is asynchronous, need to use other form so that cypress will wait
    cy.get('#\\/y').find('.mjx-mrow').should('have.text', '16y')
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16y')
    });

    cy.get('#\\/trip').click();

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9x')
    });
    cy.get('#\\/z').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2z')
    });
    // since second change is asynchronous, need to use other form so that cypress will wait
    // (keep other form of test to make it clear we aren't actually changing anything)
    cy.get('#\\/y').find('.mjx-mrow').should('have.text', '64y')
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('64y')
    });

  })

  it('update based on trigger', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" tName="x" newValue="3$x" simplify triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.get('#\\/trip').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -1, y: -7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 1, y: 7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -3, y: 4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -6, y: 5 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 4, y: 2 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 9, y: 7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });


    });
  })

  it('chained updates based on trigger', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" tName="x" newValue="3$x" simplify triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" />
    <updateValue name="quad" tName="y" newValue="4$y" simplify triggerWithTnames="trip"  />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });

    cy.get('#\\/trip').should('not.exist');
    cy.get('#\\/quad').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -1, y: -7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 1, y: 7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      // since second change is asynchronous, need to use other form so that cypress will wait
      cy.get('#\\/y').find('.mjx-mrow').should('have.text', '4y')
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -3, y: 4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -6, y: 5 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 4, y: 2 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      // since second change is asynchronous, need to use other form so that cypress will wait
      // (keep other form of test to make it clear we aren't actually changing anything)
      cy.get('#\\/y').find('.mjx-mrow').should('have.text', '16y')
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 9, y: 7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });


    });
  })

  it('chained updates based on trigger on same object', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" tName="x" newValue="3$x" simplify triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" />
    <updateValue name="quad" tName="x" newValue="4$x" simplify triggerWithTnames="trip"  />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.get('#\\/trip').should('not.exist');
    cy.get('#\\/quad').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -1, y: -7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 1, y: 7 });
      // since second change could be asynchronous, use other form so that cypress will wait
      cy.get('#\\/x').find('.mjx-mrow').should('have.text', '12x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -3, y: 4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -6, y: 5 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 4, y: 2 });
      // since second change could be asynchronous, use other form so that cypress will wait
      // (keep other form of test to make it clear we aren't actually changing anything)
      cy.get('#\\/x').find('.mjx-mrow').should('have.text', '144x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('144x')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 9, y: 7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('144x')
      });


    });
  })

  it('triggerWhen supercedes chaining', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" tName="x" newValue="3$x" simplify triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" />
    <updateValue name="quad" tName="y" newValue="4$y" simplify triggerWithTnames="trip" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });

    cy.get('#\\/trip').should('not.exist');
    cy.get('#\\/quad').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -1, y: -7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 1, y: 7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -3, y: -4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -6, y: -5 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 4, y: 2 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 9, y: 7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });


    });
  })


  it('triggerSet', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet label="perform updates" >
      <updateValue tName="b" newValue="not$b" type="boolean" />
      <updateValue tName="hello" newValue="$hello hello" type="text" />
      <updateValue tName="n" newValue="$n+1" type="number" />

    </triggerSet>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");

    cy.get('#\\/_triggerset1').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello");
    cy.get('#\\/n').should('have.text', "2");

    cy.get('#\\/_triggerset1').click();
    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', " hello hello");
    cy.get('#\\/n').should('have.text', "3");

    cy.get('#\\/_triggerset1').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello hello hello");
    cy.get('#\\/n').should('have.text', "4");
  })

  it('triggerSet and chain to updatevalue', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet label="perform updates" >
      <updateValue tName="b" newValue="not$b" type="boolean" />
      <updateValue tName="hello" newValue="$hello hello" type="text" />

    </triggerSet>

    <updateValue tName="n" newValue="$n+1" type="number" triggerWithTnames="_triggerset1" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");

    cy.get('#\\/_triggerset1').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello");
    cy.get('#\\/n').should('have.text', "2");

    cy.get('#\\/_triggerset1').click();
    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', " hello hello");
    cy.get('#\\/n').should('have.text', "3");

    cy.get('#\\/_triggerset1').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello hello hello");
    cy.get('#\\/n').should('have.text', "4");
  })

  it('triggerSet and chain to triggerset', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet label="perform updates" >
      <updateValue tName="b" newValue="not$b" type="boolean" />
      <updateValue tName="hello" newValue="$hello hello" type="text" />
    </triggerSet>

    <triggerSet label="perform updates" triggerWithTnames="_triggerset1" >
      <updateValue tName="n" newValue="$n+1" type="number"  />
      <updateValue tName="m" newValue="$m-1" type="number"  />
    </triggerSet>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");
    cy.get('#\\/m').should('have.text', "5");
    cy.get('#\\/_triggerset2').should('not.exist');

    cy.get('#\\/_triggerset1').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello");
    cy.get('#\\/n').should('have.text', "2");
    cy.get('#\\/m').should('have.text', "4");

    cy.get('#\\/_triggerset1').click();
    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', " hello hello");
    cy.get('#\\/n').should('have.text', "3");
    cy.get('#\\/m').should('have.text', "3");

    cy.get('#\\/_triggerset1').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello hello hello");
    cy.get('#\\/n').should('have.text', "4");
    cy.get('#\\/m').should('have.text', "2");
  })

  it('triggerSet based on trigger', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="P">(-1,2)</point>
  </graph>
  <math name="x">x</math>
  <math name="y">y</math>
  
  <triggerSet triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" >
    <updateValue name="trip" tName="x" newValue="3$x" simplify />
    <updateValue name="quad" tName="y" newValue="4$y" simplify />
  </triggerSet>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });

    cy.get('#\\/trip').should('not.exist');
    cy.get('#\\/quad').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -1, y: -7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 1, y: 7 });
      cy.wait(10);
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -3, y: 4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -6, y: 5 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 4, y: 2 });
      cy.wait(10);
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 9, y: 7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });


    });
  })

  it('triggerWhen supercedes chaining for triggerset', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet label="perform updates" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0">
      <updateValue tName="b" newValue="not$b" type="boolean" />
      <updateValue tName="hello" newValue="$hello hello" type="text" />
    </triggerSet>

    <triggerSet label="perform updates" triggerWithTnames="_triggerset1" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" >
      <updateValue tName="n" newValue="$n+1" type="number"  />
      <updateValue tName="m" newValue="$m-1" type="number"  />
    </triggerSet>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");
    cy.get('#\\/m').should('have.text', "5");
    cy.get('#\\/_triggerset1').should('not.exist');
    cy.get('#\\/_triggerset2').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -1, y: -7 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 1, y: 7 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
  
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -3, y: -4 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -6, y: -5 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 4, y: 2 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 9, y: 7 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");

    });
  })

  it('triggerset supercedes triggerWhen for updateValue children', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet label="perform updates" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0">
      <updateValue tName="b" newValue="not$b" type="boolean" />
      <updateValue tName="hello" newValue="$hello hello" type="text" />
      <updateValue tName="n" newValue="$n+1" type="number" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" />
    </triggerSet>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -1, y: -7 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 1, y: 7 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
  
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -3, y: -4 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -6, y: -5 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 4, y: 2 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 9, y: 7 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");

    });
  })

  it('triggerset supercedes chaining for updateValue children', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet label="perform updates" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0">
      <updateValue tName="b" newValue="not$b" type="boolean" />
      <updateValue tName="hello" newValue="$hello hello" type="text" />
      <updateValue tName="n" newValue="$n+1" type="number" triggerWithTnames="uv" />
    </triggerSet>

    <updateValue name="uv" tName="m" newValue="$m-1" type="number" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");
    cy.get('#\\/m').should('have.text', "5");
    cy.get('#\\/_triggerset1').should('not.exist');
    cy.get('#\\/uv').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -1, y: -7 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 1, y: 7 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
  
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -3, y: -4 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: -6, y: -5 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 4, y: 2 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/P'].movePoint({ x: 9, y: 7 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");

    });
  })

  it('update value to blank string', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <text name="t">something</text>
    <updatevalue name="toBlank" label="setToBlank" type="text" tname="t" newValue="" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/t').should('have.text', 'something')
    cy.get('#\\/toBlank').click();
    cy.get('#\\/t').should('have.text', '')


  })


});