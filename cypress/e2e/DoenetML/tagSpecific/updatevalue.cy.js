import me from 'math-expressions';

describe('UpdateValue Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })

  it('incrementing graph of line segments', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <number name="step">20/<copy target="count" /></number>
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
    <updatevalue target="count" newValue="2$count" >
      <label>double</label>
    </updateValue>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let left = -10;

    cy.log(`check internal values`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let count = 2;
      let step = 20 / count;

      expect(stateVariables['/count'].stateValues.value).eq(count);
      expect(stateVariables['/step'].stateValues.value).eq(step);

      for (let ind = 1; ind <= count; ind++) {
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][0])
          .evaluate_to_constant()).closeTo(left + (ind - 1) * step, 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][1])
          .evaluate_to_constant()).closeTo(Math.sin(left + (ind - 1) * step), 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][0])
          .evaluate_to_constant()).closeTo(left + ind * step, 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][1])
          .evaluate_to_constant()).closeTo(Math.sin(left + ind * step), 1E-12);
      }
    });

    cy.log('double number');
    cy.get('#\\/_updatevalue1_button').click();
    cy.get('#\\/count').should('have.text', '4')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let count = 4;
      let step = 20 / count;


      expect(stateVariables['/count'].stateValues.value).eq(count);
      expect(stateVariables['/step'].stateValues.value).eq(step);

      for (let ind = 1; ind <= count; ind++) {
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][0])
          .evaluate_to_constant()).closeTo(left + (ind - 1) * step, 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][1])
          .evaluate_to_constant()).closeTo(Math.sin(left + (ind - 1) * step), 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][0])
          .evaluate_to_constant()).closeTo(left + ind * step, 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][1])
          .evaluate_to_constant()).closeTo(Math.sin(left + ind * step), 1E-12);
      }
    });

    cy.log('double number a second time');
    cy.get('#\\/_updatevalue1_button').click();
    cy.get('#\\/count').should('have.text', '8')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let count = 8;
      let step = 20 / count;


      expect(stateVariables['/count'].stateValues.value).eq(count);
      expect(stateVariables['/step'].stateValues.value).eq(step);

      for (let ind = 1; ind <= count; ind++) {
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][0])
          .evaluate_to_constant()).closeTo(left + (ind - 1) * step, 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][1])
          .evaluate_to_constant()).closeTo(Math.sin(left + (ind - 1) * step), 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][0])
          .evaluate_to_constant()).closeTo(left + ind * step, 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][1])
          .evaluate_to_constant()).closeTo(Math.sin(left + ind * step), 1E-12);
      }
    });

    cy.log('double number a third time');
    cy.get('#\\/_updatevalue1_button').click();
    cy.get('#\\/count').should('have.text', '16')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let count = 16;
      let step = 20 / count;


      expect(stateVariables['/count'].stateValues.value).eq(count);
      expect(stateVariables['/step'].stateValues.value).eq(step);

      for (let ind = 1; ind <= count; ind++) {
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][0])
          .evaluate_to_constant()).closeTo(left + (ind - 1) * step, 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[0][1])
          .evaluate_to_constant()).closeTo(Math.sin(left + (ind - 1) * step), 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][0])
          .evaluate_to_constant()).closeTo(left + ind * step, 1E-12);
        expect(me.fromAst(stateVariables['/l' + ind + '/_linesegment1'].stateValues.endpoints[1][1])
          .evaluate_to_constant()).closeTo(Math.sin(left + ind * step), 1E-12);
      }
    });

  })

  it('update boolean', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="b" />
    <updateValue target="b" newValue="not$b" type="boolean" >
      <label>change mind</label>
    </updateValue>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");

    cy.get('#\\/_updatevalue1_button').click();
    cy.get('#\\/b').should('have.text', "true");


    cy.get('#\\/_updatevalue1_button').click();
    cy.get('#\\/b').should('have.text', "false");

  })

  // catch bug where componentWithSelectableType wasn't 
  // converting strings to booleans correctly
  it('update boolean using string value', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="b" />
    <updateValue name="setTrue" target="b" newValue="true" type="boolean" >
      <label>set true</label>
    </updateValue>
    <updateValue name="setFalse" target="b" newValue="false" type="boolean" >
      <label>set false</label>
    </updateValue>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");

    cy.get('#\\/setTrue_button').click();
    cy.get('#\\/b').should('have.text', "true");

    cy.get('#\\/setTrue_button').click();
    cy.get('#\\/b').should('have.text', "true");

    cy.get('#\\/setFalse_button').click();
    cy.get('#\\/b').should('have.text', "false");

    cy.get('#\\/setFalse_button').click();
    cy.get('#\\/b').should('have.text', "false");

    cy.get('#\\/setTrue_button').click();
    cy.get('#\\/b').should('have.text', "true");

  })

  it('update number using string value with operator', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <number name="n" >1</number>
    <updateValue name="setToSum" target="n" newValue="1+1" type="number" >
      <label>set to 1+1</label>
    </updateValue>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/n').should('have.text', "1");

    cy.get('#\\/setToSum_button').click();
    cy.get('#\\/n').should('have.text', "2");
  })

  it('update property', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <point name="P">(1,2)</point>

    <updateValue target="P" prop="x" newValue="2$(P.x)" >
      <label>double</label>
    </updateValue>
    <updateValue target="P.x" newValue="2$(P.x)" >
      <label>also double</label>
    </updateValue>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })

    cy.get('#\\/_updatevalue1_button').click();
    cy.waitUntil(() => cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(2,2)'
    ))

    cy.get('#\\/_updatevalue2_button').click();
    cy.waitUntil(() => cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(4,2)'
    ))
  })

  it('update componentIndex', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="grp">
      <point name="p">(3,2)</point>
      <point name="p2">(1,5)</point>
      <point name="p3">(7,0)</point>
    </group>
    
    <collect componentTypes="point" source="grp" name="col" />
  
    <updateValue target="col" prop="x" newValue="2$(p.x)" componentIndex="2" />
    <updateValue target="col[3].x" newValue="2$(p.x)" />
    <p><booleaninput name="bi" /><copy prop="value" source="bi" assignNames="b" /></p>
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

    cy.get('#\\/_updatevalue1_button').click();
    cy.waitUntil(() => cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(6,5)'
    ))
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,0)')
    })

    cy.get('#\\/_updatevalue1_button').click();
    // nothing has changed even after wait for core to respond to booleaninput
    cy.get('#\\/bi').click();
    cy.get('#\\/b').should('have.text', 'true');
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,0)')
    })


    cy.get('#\\/_updatevalue2_button').click();
    cy.waitUntil(() => cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(6,5)'
    ))
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,0)')
    })

    cy.get('#\\/_updatevalue2_button').click();
    // nothing has changed even after wait for core to respond to booleaninput
    cy.get('#\\/bi').click();
    cy.get('#\\/b').should('have.text', 'false');
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,0)')
    })


  })

  it('update propIndex', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <point name="p">(3,2,1)</point>
    
    <collect componentTypes="point" target="grp" name="col" />
  
    <updateValue target="p" prop="xs" newValue="2$(p.x)" propIndex="2" />
    <updateValue target="p.xs[3]" newValue="2$(p.x)" />
    <p><booleaninput name="bi" /><copy prop="value" target="bi" assignNames="b" /></p>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2,1)')
    })

    cy.get('#\\/_updatevalue1_button').click();
    cy.waitUntil(() => cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(3,6,1)'
    ))

    cy.get('#\\/_updatevalue1_button').click();
    // nothing has changed even after wait for core to respond to booleaninput
    cy.get('#\\/bi').click();
    cy.get('#\\/b').should('have.text', 'true');
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,6,1)')
    })

    cy.get('#\\/_updatevalue2_button').click();
    cy.waitUntil(() => cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(3,6,6)'
    ))

    cy.get('#\\/_updatevalue2_button').click();
    // nothing has changed even after wait for core to respond to booleaninput
    cy.get('#\\/bi').click();
    cy.get('#\\/b').should('have.text', 'false');
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,6,6)')
    })
  })

  it('update multiple components', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="grp">
      <point name="p">(3,2)</point>
      <point name="p2">(1,5)</point>
      <point name="p3">(7,0)</point>
    </group>
    
    <collect componentTypes="point" target="grp" name="col" />
  
    <updateValue target="col" prop="x" newValue="2$(p.x)" />
    <updateValue target="col.x" newValue="2$(p.x)" />
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

    cy.get('#\\/_updatevalue1_button').click();
    cy.waitUntil(() => cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(6,2)'
    ))
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,2)')
    })
    cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,5)')
    })
    cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,0)')
    })

    cy.get('#\\/_updatevalue2_button').click();
    cy.waitUntil(() => cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(12,2)'
    ))
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

  it('update property of property', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <line through="$P $Q" name="l" />
    <point name="P">(1,2)</point>
    <point name="Q">(3,4)</point>

    <updateValue target="l.point1.x" newValue="2$(P.x)" >
      <label>double</label>
    </updateValue>
    <updateValue target="l.points[1].x" newValue="2$(P.x)" >
      <label>also double</label>
    </updateValue>
    <updateValue target="l.points[1]" newValue="(3,7)" >
      <label>set point</label>
    </updateValue>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })

    cy.get('#\\/_updatevalue1_button').click();
    cy.waitUntil(() => cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(2,2)'
    ))

    cy.get('#\\/_updatevalue2_button').click();
    cy.waitUntil(() => cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(4,2)'
    ))

    cy.get('#\\/_updatevalue3_button').click();
    cy.waitUntil(() => cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(3,7)'
    ))

    cy.get('#\\/_updatevalue1_button').click();
    cy.waitUntil(() => cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(6,7)'
    ))

    cy.get('#\\/_updatevalue2_button').click();
    cy.waitUntil(() => cy.get('#\\/P').find('.mjx-mrow').eq(0).invoke('text').then((text) =>
      text.trim() === '(12,7)'
    ))

  })


  it('chained updates', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify >
      <label>update</label>
    </updateValue>
    <updateValue name="quad" target="y" newValue="4$y" triggerWith="trip" simplify />
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

    cy.get('#\\/trip_button').click();
    cy.get('#\\/x').should('contain.text', '3x')
    cy.get('#\\/y').should('contain.text', '4y')
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x')
    });
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4y')
    });

    cy.get('#\\/trip_button').click();

    cy.get('#\\/x').should('contain.text', '9x')
    cy.get('#\\/y').should('contain.text', '16y')

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9x')
    });
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16y')
    });

  })

  it('chained updates on multiple sources', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x">x</math>
    <math name="y">y</math>
    <math name="z">z</math>
    
    <updateValue name="doub" target="z" newValue="2$z" simplify >
      <label>update</label>
    </updateValue>
    <updateValue name="trip" target="x" newValue="3$x" simplify >
      <label>update</label>
    </updateValue>
    <updateValue name="quad" target="y" newValue="4$y" triggerWith="doub trip" simplify />
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

    cy.get('#\\/trip_button').click();
    cy.get('#\\/x').should('contain.text', '3x');
    cy.get('#\\/y').should('contain.text', '4y');

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x')
    });
    cy.get('#\\/z').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4y')
    });

    cy.get('#\\/doub_button').click();
    cy.get('#\\/z').should('contain.text', '2z');
    cy.get('#\\/y').should('contain.text', '16y');
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x')
    });
    cy.get('#\\/z').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2z')
    });
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16y')
    });

    cy.get('#\\/trip_button').click();
    cy.get('#\\/x').should('contain.text', '9x');
    cy.get('#\\/y').should('contain.text', '64y');

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9x')
    });
    cy.get('#\\/z').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2z')
    });
    cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('64y')
    });

  })

  it('update based on trigger', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.get('#\\/trip').should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      cy.get('#\\/x').should('contain.text', '3x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: 4 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: 5 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
      cy.get('#\\/x').should('contain.text', '9x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });


    });
  })

  it('update triggered when click', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhenObjectsClicked="P" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.get('#\\/trip').should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
      });
      cy.get('#\\/x').should('contain.text', '3x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
      });
      cy.get('#\\/x').should('contain.text', '9x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });


    });
  })

  it('update triggered when object focused', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhenObjectsFocused="P" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.get('#\\/trip').should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointFocused",
        componentName: "/P",
      });
      cy.get('#\\/x').should('contain.text', '3x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointFocused",
        componentName: "/P",
      });
      cy.get('#\\/x').should('contain.text', '9x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });


    });
  })

  it('chained updates based on trigger', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    <updateValue name="quad" target="y" newValue="4$y" simplify triggerWith="trip"  />
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

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      cy.get('#\\/x').should('contain.text', '3x');
      cy.get('#\\/y').should('contain.text', '4y');

      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: 4 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: 5 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });

      cy.get('#\\/x').should('contain.text', '9x');
      cy.get('#\\/y').should('contain.text', '16y');

      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });


    });
  })

  it('chained updates based on trigger on same object', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    <updateValue name="quad" target="x" newValue="4$x" simplify triggerWith="trip"  />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.get('#\\/trip').should('not.exist');
    cy.get('#\\/quad').should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      // since second change could be asynchronous, use other form so that cypress will wait
      cy.get('#\\/x').find('.mjx-mrow').should('have.text', '12x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: 4 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: 5 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
      // since second change could be asynchronous, use other form so that cypress will wait
      // (keep other form of test to make it clear we aren't actually changing anything)
      cy.get('#\\/x').find('.mjx-mrow').should('have.text', '144x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('144x')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('144x')
      });


    });
  })

  it('triggerWhen supercedes chaining', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <math name="x">x</math>
    <math name="y">y</math>
    
    <updateValue name="trip" target="x" newValue="3$x" simplify triggerWhen="$(P.x)>0 and $(P.y)>0" />
    <updateValue name="quad" target="y" newValue="4$y" simplify triggerWith="trip" triggerWhen="$(P.x)<0 and $(P.y)<0" />
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

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get('#\\/y').should("contain.text", '4y')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      cy.get('#\\/x').should("contain.text", '3x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: -4 }
      });
      cy.get('#\\/y').should("contain.text", '16y')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: -5 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
      cy.get('#\\/x').should("contain.text", '9x')
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });


    });
  })


  it('triggerSet', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet >
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" />

    </triggerSet>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");

    cy.get('#\\/_triggerset1_button').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello");
    cy.get('#\\/n').should('have.text', "2");

    cy.get('#\\/_triggerset1_button').click();
    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', " hello hello");
    cy.get('#\\/n').should('have.text', "3");

    cy.get('#\\/_triggerset1_button').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello hello hello");
    cy.get('#\\/n').should('have.text', "4");
  })

  it('triggerSet and chain to updatevalue', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet >
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />

    </triggerSet>

    <updateValue target="n" newValue="$n+1" type="number" triggerWith="_triggerset1" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");

    cy.get('#\\/_triggerset1_button').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello");
    cy.get('#\\/n').should('have.text', "2");

    cy.get('#\\/_triggerset1_button').click();
    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', " hello hello");
    cy.get('#\\/n').should('have.text', "3");

    cy.get('#\\/_triggerset1_button').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello hello hello");
    cy.get('#\\/n').should('have.text', "4");
  })

  it('triggerSet and chain to triggerset', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet >
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
    </triggerSet>

    <triggerSet triggerWith="_triggerset1" >
      <label>perform updates</label>
      <updateValue target="n" newValue="$n+1" type="number"  />
      <updateValue target="m" newValue="$m-1" type="number"  />
    </triggerSet>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");
    cy.get('#\\/m').should('have.text', "5");
    cy.get('#\\/_triggerset2').should('not.exist');

    cy.get('#\\/_triggerset1_button').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello");
    cy.get('#\\/n').should('have.text', "2");
    cy.get('#\\/m').should('have.text', "4");

    cy.get('#\\/_triggerset1_button').click();
    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', " hello hello");
    cy.get('#\\/n').should('have.text', "3");
    cy.get('#\\/m').should('have.text', "3");

    cy.get('#\\/_triggerset1_button').click();
    cy.get('#\\/b').should('have.text', "true");
    cy.get('#\\/hello').should('have.text', " hello hello hello");
    cy.get('#\\/n').should('have.text', "4");
    cy.get('#\\/m').should('have.text', "2");
  })

  it('triggerSet based on trigger', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="P">(-1,2)</point>
  </graph>
  <math name="x">x</math>
  <math name="y">y</math>
  
  <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0" >
    <updateValue name="trip" target="x" newValue="3$x" simplify />
    <updateValue name="quad" target="y" newValue="4$y" simplify />
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

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      cy.get('#\\/x').should('contain.text', '3x');
      cy.get('#\\/y').should('contain.text', '4y');
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: 4 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: 5 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
      cy.get('#\\/x').should('contain.text', '9x');
      cy.get('#\\/y').should('contain.text', '16y');
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });


    });
  })

  it('triggerWhen supercedes chaining for triggerset', () => {

    cy.window().then(async (win) => {
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

    <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
    </triggerSet>

    <triggerSet triggerWith="_triggerset1" triggerWhen="$(P.x)<0 and $(P.y)<0" >
      <label>perform updates</label>
      <updateValue target="n" newValue="$n+1" type="number"  />
      <updateValue target="m" newValue="$m-1" type="number"  />
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

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");

    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: -4 }
      });
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: -5 }
      });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");

    });
  })

  it('triggerset supercedes triggerWhen for updateValue children', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" triggerWhen="$(P.x)<0 and $(P.y)<0" />
    </triggerSet>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");

    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: -4 }
      });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: -5 }
      });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");

    });
  })

  it('triggerset supercedes chaining for updateValue children', () => {

    cy.window().then(async (win) => {
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

    <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" triggerWith="uv" />
    </triggerSet>

    <updateValue name="uv" target="m" newValue="$m-1" type="number" triggerWhen="$(P.x)<0 and $(P.y)<0" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/b').should('have.text', "false");
    cy.get('#\\/hello').should('have.text', "");
    cy.get('#\\/n').should('have.text', "1");
    cy.get('#\\/m').should('have.text', "5");
    cy.get('#\\/_triggerset1').should('not.exist');
    cy.get('#\\/uv').should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get('#\\/m').should('have.text', "4");
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");

    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: -4 }
      });
      cy.get('#\\/m').should('have.text', "3");
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: -5 }
      });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");

    });
  })

  it('update value to blank string', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <text name="t">something</text>
    <updatevalue name="toBlank" type="text" target="t" newValue="" >
      <label>setToBlank</label>
    </updateValue>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/t').should('have.text', 'something')
    cy.get('#\\/toBlank_button').click();
    cy.get('#\\/t').should('have.text', '')


  })


  // TODO: what is supposed to happen here?
  it.skip('update value set to ignore read only flag', () => {

    let doenetML = `
    <text>a</text>
    <p>m = <number name="m" >1</number></p>
    <p>n = <number name="n" >10</number></p>

    <p><updateValue name="incm" target="m" newValue="$m+1"  >
      <label>increment m</label>
    </updateValue></p>
    <p><updateValue name="incn" target="n" newValue="$n+10" disabledIgnoresParentReadOnly >
      <label>increment n</label>
    </updateValue></p>

    `
    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/m').should('have.text', '1');
    cy.get('#\\/n').should('have.text', '10');


    cy.get('#\\/incm_button').click();
    cy.get('#\\/incn_button').click();

    cy.get('#\\/m').should('have.text', '2');
    cy.get('#\\/n').should('have.text', '20');

    cy.wait(2000);  // wait to make sure 1 second debounce occurred

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_readOnly').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#\\/incm_button').should('be.disabled')
    cy.get('#\\/incn_button').should('not.be.disabled')

    cy.get('#\\/m').should('have.text', '2');
    cy.get('#\\/n').should('have.text', '20');

    cy.get('#\\/incm_button').click();
    cy.get('#\\/incn_button').click();

    cy.get('#\\/m').should('have.text', '2');
    cy.get('#\\/n').should('have.text', '30');




  })

  it('math in label', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="b" />
    <updateValue target="b" newValue="not$b" type="boolean" name="update">
      <label>we have <m>\\prod_{i=1}^3 y_i</m></label>
    </updateValue>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/update').should('contain.text', 'we have ∏3i=1yi')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/update'].stateValues.label).eq("we have \\(\\prod_{i=1}^3 y_i\\)");
    });

  })

  it('label is name', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean name="b" />
    <updateValue target="b" newValue="not$b" type="boolean" name="SwapIt" labelIsName />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/SwapIt').should('contain.text', 'Swap It')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/SwapIt'].stateValues.label).eq("Swap It");
    });

  })

  it('update essential label value', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <updateValue target="uv.label" newValue="Hello!" type="text" name="uv"  />
    `}, "*");
    });

    cy.get('#\\/uv').should('contain.text', 'Button')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/uv'].stateValues.label).eq("");
    });

    cy.get('#\\/uv').click();

    cy.get('#\\/uv').should('contain.text', 'Hello!')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/uv'].stateValues.label).eq("Hello!");
    });


  })

  it('bug fix: no duplicate name error, #1921', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <updateValue target="v.tail.coords" newValue="(3,4)"><label>Move tail</label></updateValue>
    <triggerSet>
      <label>Move both</label>
      <updateValue target="v.head.coords" newValue="(5,6)" />
      <updateValue target="v.tail.coords" newValue="(7,2)" />
    </triggerSet><graph>
      <vector name="v" />
    </graph><copy source="v.tail" assignNames="vt" /><copy source="v.head" assignNames="vh" />
    `}, "*");
    });

    cy.get('#\\/_updatevalue1').should('contain.text', 'Move tail')
    cy.get('#\\/_triggerset1').should('contain.text', 'Move both')
    cy.get('#\\/vh .mjx-mrow').eq(0).should('have.text', "(1,0)")
    cy.get('#\\/vt .mjx-mrow').eq(0).should('have.text', "(0,0)")

    cy.get('#\\/_updatevalue1').click();

    cy.get('#\\/vt .mjx-mrow').should('contain.text', "(3,4)")

    cy.get('#\\/vt .mjx-mrow').eq(0).should('have.text', "(3,4)")
    cy.get('#\\/vh .mjx-mrow').eq(0).should('have.text', "(4,4)")

    cy.get('#\\/_triggerset1').click();
    cy.get('#\\/vt .mjx-mrow').should('contain.text', "(7,2)")

    cy.get('#\\/vt .mjx-mrow').eq(0).should('have.text', "(7,2)")
    cy.get('#\\/vh .mjx-mrow').eq(0).should('have.text', "(9,4)")


  })

  it('updatevalue in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>n: <number name="n">1</number></p>
    <graph >
      <updatevalue anchor="$anchorCoords1" name="updatevalue1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" target="n" newValue="$n+1"><label>increment</label></updatevalue>
      <updatevalue name="updatevalue2" target="n" newValue="$n-1"><label>decrement</label></updatevalue>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $updatevalue1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $updatevalue2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$updatevalue2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $updatevalue1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $updatevalue2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$updatevalue2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$updatevalue2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$updatevalue2.disabled" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    ` }, "*");
    });

    // TODO: how to click on the buttons and test if they are disabled?

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(1,3)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(0,0)')

    cy.get("#\\/pPositionFromAnchor1").should('have.text', 'Position from anchor 1: upperright')
    cy.get("#\\/pPositionFromAnchor2").should('have.text', 'Position from anchor 2: center')
    cy.get("#\\/positionFromAnchor1").should('have.value', '1')
    cy.get("#\\/positionFromAnchor2").should('have.value', '9')
    cy.get("#\\/pDraggable1").should('have.text', 'Draggable 1: true')
    cy.get("#\\/pDraggable2").should('have.text', 'Draggable 2: true')


    cy.log("move updatevalues by dragging")

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/updatevalue1",
        args: { x: -2, y: 3 }
      })
      win.callAction1({
        actionName: "moveButton",
        componentName: "/updatevalue2",
        args: { x: 4, y: -5 }
      })
    })

    cy.get('#\\/pAnchor2 .mjx-mrow').should('contain.text', '(4,−5)')

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(−2,3)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(4,−5)')


    cy.log("move updatevalues by entering coordinates")

    cy.get('#\\/anchorCoords1 textarea').type("{home}{shift+end}{backspace}(6,7){enter}", { force: true })
    cy.get('#\\/anchorCoords2 textarea').type("{home}{shift+end}{backspace}(8,9){enter}", { force: true })

    cy.get('#\\/pAnchor2 .mjx-mrow').should('contain.text', '(8,9)')

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(8,9)')


    cy.log('change position from anchor');
    cy.get('#\\/positionFromAnchor1').select("lowerLeft")
    cy.get('#\\/positionFromAnchor2').select("lowerRight")

    cy.get("#\\/pPositionFromAnchor1").should('have.text', 'Position from anchor 1: lowerleft')
    cy.get("#\\/pPositionFromAnchor2").should('have.text', 'Position from anchor 2: lowerright')


    cy.log('make not draggable')

    cy.get('#\\/draggable1').click();
    cy.get('#\\/draggable2').click();
    cy.get("#\\/pDraggable1").should('have.text', 'Draggable 1: false')
    cy.get("#\\/pDraggable2").should('have.text', 'Draggable 2: false')


    cy.log('cannot move updatevalues by dragging')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/updatevalue1",
        args: { x: -10, y: -9 }
      })
      win.callAction1({
        actionName: "moveButton",
        componentName: "/updatevalue2",
        args: { x: -8, y: -7 }
      })
    })

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get("#\\/bi").click();
    cy.get("#\\/b").should('have.text', 'true');

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(8,9)')



  })

});