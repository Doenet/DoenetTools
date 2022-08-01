describe('TriggerSet Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('triggerSet', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

    <triggerSet label="perform updates and actions"  name="tset">
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" target="hello" newValue="$hello hello" type="text" />
      <updateValue name="addOne" target="n" newValue="$n+1" type="number" />
      <callAction target="s" actionName="resample" label="roll dice and add point" name="rs" />
      <callAction name="addPoint" target="g" actionName="addChildren" label="add point" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/flip').should('not.exist');
    cy.get('#\\/addHello').should('not.exist');
    cy.get('#\\/addOne').should('not.exist');
    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numbers;
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);

      cy.get('#\\/nums').invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");


      cy.get('#\\/tset_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 2;
      }))

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");


      cy.get('#\\/tset_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 3;
      }))

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");


      cy.get('#\\/tset_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 4;
      }))

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello hello hello");
      cy.get('#\\/n').should('have.text', "4");

    })
  })

  it('triggerSet and chain to updatevalue and call action', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

    <triggerSet label="perform updates and actions" name="tset">
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" target="hello" newValue="$hello hello" type="text" />
      <callAction target="s" actionName="resample" label="roll dice and add point" name="rs" />
    </triggerSet>

    <updateValue name="addOne" target="n" newValue="$n+1" type="number" triggerWithTargets="tset" />
    <callAction name="addPoint" target="g" actionName="addChildren" label="add point"  triggerWithTargets="tset" >
      <point>(3,4)</point>
    </callAction>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/flip').should('not.exist');
    cy.get('#\\/addHello').should('not.exist');
    cy.get('#\\/addOne').should('not.exist');
    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numbers;
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);

      cy.get('#\\/nums').invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");


      cy.get('#\\/tset_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 2;
      }))

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");


      cy.get('#\\/tset_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 3;
      }))

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");


      cy.get('#\\/tset_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 4;
      }))

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello hello hello");
      cy.get('#\\/n').should('have.text', "4");
    })

  })

  it('triggerSet and chain to triggerset', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

    <triggerSet label="perform updates and actions" name="tset">
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <callAction target="s" actionName="resample" label="roll dice and add point" name="rs" />
    </triggerSet>

    <triggerSet label="perform updates" triggerWithTargets="tset" >
      <updateValue target="n" newValue="$n+1" type="number"  />
      <callAction name="addPoint" target="g" actionName="addChildren" label="add point" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/flip').should('not.exist');
    cy.get('#\\/addHello').should('not.exist');
    cy.get('#\\/addOne').should('not.exist');
    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numbers;
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);

      cy.get('#\\/nums').invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");


      cy.get('#\\/tset_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 2;
      }))

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");


      cy.get('#\\/tset_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 3;
      }))

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");


      cy.get('#\\/tset_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 4;
      }))

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello hello hello");
      cy.get('#\\/n').should('have.text', "4");
    })

  })

  it('triggerSet and chain multiple sources to triggerset', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count 2: <number name="n2">1</number></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

    <triggerSet label="perform updates and actions" name="tset">
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <callAction target="s" actionName="resample" label="roll dice and add point" name="rs" />
    </triggerSet>

    <triggerSet label="perform updates" triggerWithTargets="tset in" >
      <updateValue target="n" newValue="$n+1" type="number"  />
      <callAction name="addPoint" target="g" actionName="addChildren" label="add point" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <updateValue label="update number and others" name="in" target="n2" newValue="$n2+1" type="number" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/flip').should('not.exist');
    cy.get('#\\/addHello').should('not.exist');
    cy.get('#\\/addOne').should('not.exist');
    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numbers;
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);

      cy.get('#\\/nums').invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");
      cy.get('#\\/n2').should('have.text', "1");


      cy.get('#\\/tset_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 2;
      }))

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/n2').should('have.text', "1");



      cy.get('#\\/in_button').click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 3;
      }))

      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/n2').should('have.text', "2");


    })
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
  
  <triggerSet triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" >
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
      cy.get('#\\/x').should('contain.text', '3x')
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
      cy.get('#\\/x').should('contain.text', '9x')
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

  it('triggerSet triggered when click', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="P">(-1,2)</point>
  </graph>
  <math name="x">x</math>
  <math name="y">y</math>
  
  <triggerSet triggerWhenTargetsClicked="P" >
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
        actionName: "pointClicked",
        componentName: "/P",
      });
      cy.get('#\\/x').should('contain.text', '3x')
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
        actionName: "pointClicked",
        componentName: "/P",
      });
      cy.get('#\\/x').should('contain.text', '9x')
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

    <triggerSet label="perform updates" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0">
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
    </triggerSet>

    <triggerSet label="perform updates" triggerWithTargets="_triggerset1" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" >
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
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "2");
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
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "3");
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

  it('triggerset supercedes triggerWhen for updateValue and callAction children', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

    <triggerSet label="perform updates" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0">
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" />
      <callAction target="s" actionName="resample" label="roll dice and add point" name="rs" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" />
      <callAction name="addPoint" target="g" actionName="addChildren" label="add point" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numbers;
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);

      cy.get('#\\/nums').invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");

      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/P",
          args: { x: -1, y: -7 }
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(1);
        })
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
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
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(1);
        })
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
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

        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          return g.activeChildren.length === 2;
        }))
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers);
          numbers = numbers2;
        })
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
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(2);
        })
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
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
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(2);
        })
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
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
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(2);
        })
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
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

        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          return g.activeChildren.length === 3;
        }))
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers);
          numbers = numbers2;
        })
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
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(3);
        })
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get('#\\/b').should('have.text', "false");
        cy.get('#\\/hello').should('have.text', " hello hello");
        cy.get('#\\/n').should('have.text', "3");

      });
    })
  })

  it('triggerset supercedes chaining for updateValue children', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>

    <p>Boolean to swap: <boolean name="b" /></p>
    <p>Say hello: <text name="hello"></text></p>
    <p>Count: <number name="n">1</number></p>
    <p>Count down: <number name="m">5</number></p>

    <triggerSet label="perform updates" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0">
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" triggerWithTargets="uv" />
      <callAction name="addPoint" target="g" actionName="addChildren" label="add point" triggerWithTargets="uv" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <updateValue name="uv" target="m" newValue="$m-1" type="number" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);
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
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(1);
        })
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

        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          return g.activeChildren.length === 2;
        }))
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
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(2);
        })
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
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(2);
        })
        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");
        cy.get('#\\/m').should('have.text', "3");
      })

      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/P",
          args: { x: -6, y: -5 }
        });
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(2);
        })
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
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          return g.activeChildren.length === 3;
        }))
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
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(3);
        })
        cy.get('#\\/b').should('have.text', "false");
        cy.get('#\\/hello').should('have.text', " hello hello");
        cy.get('#\\/n').should('have.text', "3");
        cy.get('#\\/m').should('have.text', "3");

      });
    })
  })

  it('triggerSet with math in label', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>

    <triggerSet name="tset">
      <label>It is <math>∂f/∂x</math></label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
    </triggerSet>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/tset').should('contain.text', 'It is ∂f∂x')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/tset'].stateValues.label).eq("It is \\(\\frac{ \\partial f }{ \\partial x }\\)");
    });


  })

  it('triggerSet with label is name', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Boolean to swap: <boolean name="b" /></p>

    <triggerSet name="trigger-me" labelIsName>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
    </triggerSet>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/trigger-me').should('contain.text', 'trigger me')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/trigger-me'].stateValues.label).eq("trigger me");
    });


  })


});