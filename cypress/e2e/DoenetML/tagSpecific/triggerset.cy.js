import { cesc } from '../../../../src/_utils/url';


describe('TriggerSet Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

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

    <triggerSet name="tset">
      <label>perform updates and actions</label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" target="hello" newValue="$hello hello" type="text" />
      <updateValue name="addOne" target="n" newValue="$n+1" type="number" />
      <callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
      <callAction name="addPoint" target="g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>
    `}, "*");
    });
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/flip')).should('not.exist');
    cy.get(cesc('#\\/addHello')).should('not.exist');
    cy.get(cesc('#\\/addOne')).should('not.exist');
    cy.get(cesc('#\\/rs')).should('not.exist');
    cy.get(cesc('#\\/addPoint')).should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numbers;
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', "");
      cy.get(cesc('#\\/n')).should('have.text', "1");


      cy.get(cesc('#\\/tset_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 2;
      }))

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello");
      cy.get(cesc('#\\/n')).should('have.text', "2");


      cy.get(cesc('#\\/tset_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 3;
      }))

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', " hello hello");
      cy.get(cesc('#\\/n')).should('have.text', "3");


      cy.get(cesc('#\\/tset_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 4;
      }))

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello hello hello");
      cy.get(cesc('#\\/n')).should('have.text', "4");

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

    <triggerSet name="tset">
      <label>perform updates and actions</label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" target="hello" newValue="$hello hello" type="text" />
      <callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
    </triggerSet>

    <updateValue name="addOne" target="n" newValue="$n+1" type="number" triggerWith="tset" />
    <callAction name="addPoint" target="g" actionName="addChildren"  triggerWith="tset" >
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>
    `}, "*");
    });
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/flip')).should('not.exist');
    cy.get(cesc('#\\/addHello')).should('not.exist');
    cy.get(cesc('#\\/addOne')).should('not.exist');
    cy.get(cesc('#\\/rs')).should('not.exist');
    cy.get(cesc('#\\/addPoint')).should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numbers;
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', "");
      cy.get(cesc('#\\/n')).should('have.text', "1");


      cy.get(cesc('#\\/tset_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 2;
      }))

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello");
      cy.get(cesc('#\\/n')).should('have.text', "2");


      cy.get(cesc('#\\/tset_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 3;
      }))

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', " hello hello");
      cy.get(cesc('#\\/n')).should('have.text', "3");


      cy.get(cesc('#\\/tset_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 4;
      }))

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello hello hello");
      cy.get(cesc('#\\/n')).should('have.text', "4");
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

    <triggerSet name="tset">
      <label>perform updates and actions</label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
    </triggerSet>

    <triggerSet triggerWith="tset" >
      <label>perform updates</label>
      <updateValue target="n" newValue="$n+1" type="number"  />
      <callAction name="addPoint" target="g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    `}, "*");
    });
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/flip')).should('not.exist');
    cy.get(cesc('#\\/addHello')).should('not.exist');
    cy.get(cesc('#\\/addOne')).should('not.exist');
    cy.get(cesc('#\\/rs')).should('not.exist');
    cy.get(cesc('#\\/addPoint')).should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numbers;
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', "");
      cy.get(cesc('#\\/n')).should('have.text', "1");


      cy.get(cesc('#\\/tset_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 2;
      }))

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello");
      cy.get(cesc('#\\/n')).should('have.text', "2");


      cy.get(cesc('#\\/tset_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 3;
      }))

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', " hello hello");
      cy.get(cesc('#\\/n')).should('have.text', "3");


      cy.get(cesc('#\\/tset_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 4;
      }))

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello hello hello");
      cy.get(cesc('#\\/n')).should('have.text', "4");
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

    <triggerSet name="tset">
      <label>perform updates and actions</label>
      <updateValue name="flip" target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
    </triggerSet>

    <triggerSet triggerWith="tset in" >
      <label>perform updates</label>
      <updateValue target="n" newValue="$n+1" type="number"  />
      <callAction name="addPoint" target="g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <updateValue name="in" target="n2" newValue="$n2+1" type="number" >
      <label>update number and others</label>
    </updateValue>

    `}, "*");
    });
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/flip')).should('not.exist');
    cy.get(cesc('#\\/addHello')).should('not.exist');
    cy.get(cesc('#\\/addOne')).should('not.exist');
    cy.get(cesc('#\\/rs')).should('not.exist');
    cy.get(cesc('#\\/addPoint')).should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numbers;
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', "");
      cy.get(cesc('#\\/n')).should('have.text', "1");
      cy.get(cesc('#\\/n2')).should('have.text', "1");


      cy.get(cesc('#\\/tset_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 2;
      }))

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).not.eqls(numbers)
        numbers = numbers2;
      })

      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello");
      cy.get(cesc('#\\/n')).should('have.text', "2");
      cy.get(cesc('#\\/n2')).should('have.text', "1");



      cy.get(cesc('#\\/in_button')).click()
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let g = stateVariables["/g"];
        return g.activeChildren.length === 3;
      }))

      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello");
      cy.get(cesc('#\\/n')).should('have.text', "3");
      cy.get(cesc('#\\/n2')).should('have.text', "2");


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
  
  <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0" >
    <updateValue name="trip" target="x" newValue="3$x" simplify />
    <updateValue name="quad" target="y" newValue="4$y" simplify />
  </triggerSet>
  `}, "*");
    });
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });

    cy.get(cesc('#\\/trip')).should('not.exist');
    cy.get(cesc('#\\/quad')).should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      cy.get(cesc('#\\/x')).should('contain.text', '3x')
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: 4 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: 5 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
      cy.get(cesc('#\\/x')).should('contain.text', '9x')
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
  
  <triggerSet triggerWhenObjectsClicked="P" >
    <updateValue name="trip" target="x" newValue="3$x" simplify />
    <updateValue name="quad" target="y" newValue="4$y" simplify />
  </triggerSet>
  `}, "*");
    });
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });

    cy.get(cesc('#\\/trip')).should('not.exist');
    cy.get(cesc('#\\/quad')).should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
        args: { name: "/P" }
      });
      cy.get(cesc('#\\/x')).should('contain.text', '3x')
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
        args: { name: "/P" }
      });
      cy.get(cesc('#\\/x')).should('contain.text', '9x')
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });


    });
  })

  it('triggerSet triggered when object focused', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="P">(-1,2)</point>
  </graph>
  <math name="x">x</math>
  <math name="y">y</math>
  
  <triggerSet triggerWhenObjectsFocused="P" >
    <updateValue name="trip" target="x" newValue="3$x" simplify />
    <updateValue name="quad" target="y" newValue="4$y" simplify />
  </triggerSet>
  `}, "*");
    });
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });

    cy.get(cesc('#\\/trip')).should('not.exist');
    cy.get(cesc('#\\/quad')).should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointFocused",
        componentName: "/P",
        args: { name: "/P" }
      });
      cy.get(cesc('#\\/x')).should('contain.text', '3x')
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointFocused",
        componentName: "/P",
        args: { name: "/P" }
      });
      cy.get(cesc('#\\/x')).should('contain.text', '9x')
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get(cesc('#\\/x')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get(cesc('#\\/y')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/b')).should('have.text', "false");
    cy.get(cesc('#\\/hello')).should('have.text', "");
    cy.get(cesc('#\\/n')).should('have.text', "1");
    cy.get(cesc('#\\/m')).should('have.text', "5");
    cy.get(cesc('#\\/_triggerset1')).should('not.exist');
    cy.get(cesc('#\\/_triggerset2')).should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', "");
      cy.get(cesc('#\\/n')).should('have.text', "2");
      cy.get(cesc('#\\/m')).should('have.text', "4");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', "");
      cy.get(cesc('#\\/n')).should('have.text', "2");
      cy.get(cesc('#\\/m')).should('have.text', "4");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello");
      cy.get(cesc('#\\/n')).should('have.text', "2");
      cy.get(cesc('#\\/m')).should('have.text', "4");

    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello");
      cy.get(cesc('#\\/n')).should('have.text', "2");
      cy.get(cesc('#\\/m')).should('have.text', "4");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: -4 }
      });
      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello");
      cy.get(cesc('#\\/n')).should('have.text', "3");
      cy.get(cesc('#\\/m')).should('have.text', "3");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: -5 }
      });
      cy.get(cesc('#\\/b')).should('have.text', "true");
      cy.get(cesc('#\\/hello')).should('have.text', " hello");
      cy.get(cesc('#\\/n')).should('have.text', "3");
      cy.get(cesc('#\\/m')).should('have.text', "3");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', " hello hello");
      cy.get(cesc('#\\/n')).should('have.text', "3");
      cy.get(cesc('#\\/m')).should('have.text', "3");
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', " hello hello");
      cy.get(cesc('#\\/n')).should('have.text', "3");
      cy.get(cesc('#\\/m')).should('have.text', "3");

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

    <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" triggerWhen="$(P.x)<0 and $(P.y)<0" />
      <callAction target="s" actionName="resample" name="rs" triggerWhen="$(P.x)<0 and $(P.y)<0" >
        <label>roll dice and add point</label>
      </callAction>
      <callAction name="addPoint" target="g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    `}, "*");
    });
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let numbers;
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);

      cy.get(cesc('#\\/nums')).invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', "");
      cy.get(cesc('#\\/n')).should('have.text', "1");

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
        cy.get(cesc('#\\/nums')).invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get(cesc('#\\/b')).should('have.text', "false");
        cy.get(cesc('#\\/hello')).should('have.text', "");
        cy.get(cesc('#\\/n')).should('have.text', "1");
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
        cy.get(cesc('#\\/nums')).invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get(cesc('#\\/b')).should('have.text', "false");
        cy.get(cesc('#\\/hello')).should('have.text', "");
        cy.get(cesc('#\\/n')).should('have.text', "1");
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
        cy.get(cesc('#\\/nums')).invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers);
          numbers = numbers2;
        })
        cy.get(cesc('#\\/b')).should('have.text', "true");
        cy.get(cesc('#\\/hello')).should('have.text', " hello");
        cy.get(cesc('#\\/n')).should('have.text', "2");

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
        cy.get(cesc('#\\/nums')).invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get(cesc('#\\/b')).should('have.text', "true");
        cy.get(cesc('#\\/hello')).should('have.text', " hello");
        cy.get(cesc('#\\/n')).should('have.text', "2");
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
        cy.get(cesc('#\\/nums')).invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get(cesc('#\\/b')).should('have.text', "true");
        cy.get(cesc('#\\/hello')).should('have.text', " hello");
        cy.get(cesc('#\\/n')).should('have.text', "2");
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
        cy.get(cesc('#\\/nums')).invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get(cesc('#\\/b')).should('have.text', "true");
        cy.get(cesc('#\\/hello')).should('have.text', " hello");
        cy.get(cesc('#\\/n')).should('have.text', "2");
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
        cy.get(cesc('#\\/nums')).invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers);
          numbers = numbers2;
        })
        cy.get(cesc('#\\/b')).should('have.text', "false");
        cy.get(cesc('#\\/hello')).should('have.text', " hello hello");
        cy.get(cesc('#\\/n')).should('have.text', "3");
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
        cy.get(cesc('#\\/nums')).invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get(cesc('#\\/b')).should('have.text', "false");
        cy.get(cesc('#\\/hello')).should('have.text', " hello hello");
        cy.get(cesc('#\\/n')).should('have.text', "3");

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

    <triggerSet triggerWhen="$(P.x)>0 and $(P.y)>0">
      <label>perform updates</label>
      <updateValue target="b" newValue="not$b" type="boolean" />
      <updateValue target="hello" newValue="$hello hello" type="text" />
      <updateValue target="n" newValue="$n+1" type="number" triggerWith="uv" />
      <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="uv" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <updateValue name="uv" target="m" newValue="$m-1" type="number" triggerWhen="$(P.x)<0 and $(P.y)<0" />

    `}, "*");
    });
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];

      expect(g.activeChildren.length).eq(1);
      cy.get(cesc('#\\/b')).should('have.text', "false");
      cy.get(cesc('#\\/hello')).should('have.text', "");
      cy.get(cesc('#\\/n')).should('have.text', "1");
      cy.get(cesc('#\\/m')).should('have.text', "5");
      cy.get(cesc('#\\/_triggerset1')).should('not.exist');
      cy.get(cesc('#\\/uv')).should('not.exist');

      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/P",
          args: { x: -1, y: -7 }
        });
        cy.get(cesc('#\\/m')).should('have.text', "4");
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let g = stateVariables["/g"];
          expect(g.activeChildren.length).eq(1);
        })
        cy.get(cesc('#\\/b')).should('have.text', "false");
        cy.get(cesc('#\\/hello')).should('have.text', "");
        cy.get(cesc('#\\/n')).should('have.text', "1");
      })

      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/P",
          args: { x: 3, y: -4 }
        });
        cy.get(cesc('#\\/b')).should('have.text', "false");
        cy.get(cesc('#\\/hello')).should('have.text', "");
        cy.get(cesc('#\\/n')).should('have.text', "1");
        cy.get(cesc('#\\/m')).should('have.text', "4");
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
        cy.get(cesc('#\\/b')).should('have.text', "true");
        cy.get(cesc('#\\/hello')).should('have.text', " hello");
        cy.get(cesc('#\\/n')).should('have.text', "2");
        cy.get(cesc('#\\/m')).should('have.text', "4");
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
        cy.get(cesc('#\\/b')).should('have.text', "true");
        cy.get(cesc('#\\/hello')).should('have.text', " hello");
        cy.get(cesc('#\\/n')).should('have.text', "2");
        cy.get(cesc('#\\/m')).should('have.text', "4");
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
        cy.get(cesc('#\\/b')).should('have.text', "true");
        cy.get(cesc('#\\/hello')).should('have.text', " hello");
        cy.get(cesc('#\\/n')).should('have.text', "2");
        cy.get(cesc('#\\/m')).should('have.text', "3");
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
        cy.get(cesc('#\\/b')).should('have.text', "true");
        cy.get(cesc('#\\/hello')).should('have.text', " hello");
        cy.get(cesc('#\\/n')).should('have.text', "2");
        cy.get(cesc('#\\/m')).should('have.text', "3");
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
        cy.get(cesc('#\\/b')).should('have.text', "false");
        cy.get(cesc('#\\/hello')).should('have.text', " hello hello");
        cy.get(cesc('#\\/n')).should('have.text', "3");
        cy.get(cesc('#\\/m')).should('have.text', "3");
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
        cy.get(cesc('#\\/b')).should('have.text', "false");
        cy.get(cesc('#\\/hello')).should('have.text', " hello hello");
        cy.get(cesc('#\\/n')).should('have.text', "3");
        cy.get(cesc('#\\/m')).should('have.text', "3");

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
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/tset')).should('contain.text', 'It is ∂f∂x')

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
    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/trigger-me')).should('contain.text', 'trigger me')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/trigger-me'].stateValues.label).eq("trigger me");
    });


  })

  it('triggerset in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>n: <number name="n">1</number></p>
    <graph >
      <triggerset anchor="$anchorCoords1" name="triggerset1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1">
        <label>increment and add point</label>
        <callAction target="_graph1" actionName="addChildren">
          <point>(3,4)</point>
        </callAction>
        <updateValue target="n" newValue="$n+1" />
      </triggerset>
      <triggerset name="triggerset2">
        <label>add point 2 and decrement</label>
        <callAction target="_graph1" actionName="addChildren">
          <point>(-3,-4)</point>
        </callAction>
        <updateValue target="n" newValue="$n-1" />

      </triggerset>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $triggerset1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $triggerset2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$triggerset2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $triggerset1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $triggerset2.positionFromAnchor</p>
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
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$triggerset2.positionFromAnchor">
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
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$triggerset2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$triggerset2.disabled" /></p>
    <p name="pFixed1">Fixed 1: $fixed1</p>
    <p name="pFixed2">Fixed 2: $fixed2</p>
    <p>Change fixed 1 <booleanInput name="fixed1" prefill="false" /></p>
    <p>Change fixed 2 <booleanInput name="fixed2" bindValueTo="$triggerset2.fixed" /></p>
    <p name="pFixLocation1">FixLocation 1: $fixLocation1</p>
    <p name="pFixLocation2">FixLocation 2: $fixLocation2</p>
    <p>Change fixLocation 1 <booleanInput name="fixLocation1" prefill="false" /></p>
    <p>Change fixLocation 2 <booleanInput name="fixLocation2" bindValueTo="$triggerset2.fixLocation" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    ` }, "*");
    });

    // TODO: how to click on the buttons and test if they are disabled?

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(1,3)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')

    cy.get(cesc("#\\/pPositionFromAnchor1")).should('have.text', 'Position from anchor 1: upperright')
    cy.get(cesc("#\\/pPositionFromAnchor2")).should('have.text', 'Position from anchor 2: center')
    cy.get(cesc("#\\/positionFromAnchor1")).should('have.value', '1')
    cy.get(cesc("#\\/positionFromAnchor2")).should('have.value', '9')
    cy.get(cesc("#\\/pDraggable1")).should('have.text', 'Draggable 1: true')
    cy.get(cesc("#\\/pDraggable2")).should('have.text', 'Draggable 2: true')


    cy.log("move triggersets by dragging")

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/triggerset1",
        args: { x: -2, y: 3 }
      })
      win.callAction1({
        actionName: "moveButton",
        componentName: "/triggerset2",
        args: { x: 4, y: -5 }
      })
    })

    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').should('contain.text', '(4,−5)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(−2,3)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(4,−5)')


    cy.log("move triggersets by entering coordinates")

    cy.get(cesc('#\\/anchorCoords1') + ' textarea').type("{home}{shift+end}{backspace}(6,7){enter}", { force: true })
    cy.get(cesc('#\\/anchorCoords2') + ' textarea').type("{home}{shift+end}{backspace}(8,9){enter}", { force: true })

    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').should('contain.text', '(8,9)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(8,9)')


    cy.log('change position from anchor');
    cy.get(cesc('#\\/positionFromAnchor1')).select("lowerLeft")
    cy.get(cesc('#\\/positionFromAnchor2')).select("lowerRight")

    cy.get(cesc("#\\/pPositionFromAnchor1")).should('have.text', 'Position from anchor 1: lowerleft')
    cy.get(cesc("#\\/pPositionFromAnchor2")).should('have.text', 'Position from anchor 2: lowerright')


    cy.log('make not draggable')

    cy.get(cesc('#\\/draggable1')).click();
    cy.get(cesc('#\\/draggable2')).click();
    cy.get(cesc("#\\/pDraggable1")).should('have.text', 'Draggable 1: false')
    cy.get(cesc("#\\/pDraggable2")).should('have.text', 'Draggable 2: false')


    cy.log('cannot move triggersets by dragging')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/triggerset1",
        args: { x: -10, y: -9 }
      })
      win.callAction1({
        actionName: "moveButton",
        componentName: "/triggerset2",
        args: { x: -8, y: -7 }
      })
    })

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should('have.text', 'true');

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(8,9)')

    cy.log('make draggable again')

    cy.get(cesc('#\\/draggable1')).click();
    cy.get(cesc('#\\/draggable2')).click();
    cy.get(cesc("#\\/pDraggable1")).should('have.text', 'Draggable 1: true')
    cy.get(cesc("#\\/pDraggable2")).should('have.text', 'Draggable 2: true')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/triggerset1",
        args: { x: -10, y: -9 }
      })
      win.callAction1({
        actionName: "moveButton",
        componentName: "/triggerset2",
        args: { x: -8, y: -7 }
      })
    })

    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').should('contain.text', '(−8,−7)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(−10,−9)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(−8,−7)')



    cy.log('fix location')

    cy.get(cesc('#\\/fixLocation1')).click();
    cy.get(cesc('#\\/fixLocation2')).click();
    cy.get(cesc("#\\/pFixLocation1")).should('have.text', 'FixLocation 1: true')
    cy.get(cesc("#\\/pFixLocation2")).should('have.text', 'FixLocation 2: true')


    cy.log('can change coordinates entering coordinates only for button 1')

    cy.get(cesc('#\\/anchorCoords2') + ' textarea').type("{home}{shift+end}{backspace}(3,4){enter}", { force: true })
    cy.get(cesc('#\\/anchorCoords1') + ' textarea').type("{home}{shift+end}{backspace}(1,2){enter}", { force: true })

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').should('contain.text', '(1,2)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(1,2)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(−8,−7)')


    cy.log('cannot move triggersets by dragging')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/triggerset1",
        args: { x: 4, y: 6 }
      })
      win.callAction1({
        actionName: "moveButton",
        componentName: "/triggerset2",
        args: { x: 7, y: 8 }
      })
    })

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should('have.text', 'false');

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(1,2)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(−8,−7)')


    cy.log('can change position from anchor only for button 1');
    cy.get(cesc('#\\/positionFromAnchor2')).select("bottom")
    cy.get(cesc('#\\/positionFromAnchor1')).select("top")

    cy.get(cesc("#\\/pPositionFromAnchor1")).should('have.text', 'Position from anchor 1: top')
    cy.get(cesc("#\\/pPositionFromAnchor2")).should('have.text', 'Position from anchor 2: lowerright')

    cy.log("can change disabled attribute")
    cy.get(cesc('#\\/disabled1')).click();
    cy.get(cesc('#\\/disabled2')).click();
    cy.get(cesc("#\\/pDisabled1")).should('have.text', 'Disabled 1: false')
    cy.get(cesc("#\\/pDisabled2")).should('have.text', 'Disabled 2: true')


    cy.log('make completely fixed')
    cy.get(cesc('#\\/fixed1')).click();
    cy.get(cesc('#\\/fixed2')).click();
    cy.get(cesc("#\\/pFixed1")).should('have.text', 'Fixed 1: true')
    cy.get(cesc("#\\/pFixed2")).should('have.text', 'Fixed 2: true')


    cy.log('can change coordinates entering coordinates only for button 1')

    cy.get(cesc('#\\/anchorCoords2') + ' textarea').type("{home}{shift+end}{backspace}(7,8){enter}", { force: true })
    cy.get(cesc('#\\/anchorCoords1') + ' textarea').type("{home}{shift+end}{backspace}(5,6){enter}", { force: true })

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').should('contain.text', '(5,6)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(5,6)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(−8,−7)')


    cy.log('can change position from anchor only for button 1');
    cy.get(cesc('#\\/positionFromAnchor2')).select("left")
    cy.get(cesc('#\\/positionFromAnchor1')).select("right")

    cy.get(cesc("#\\/pPositionFromAnchor1")).should('have.text', 'Position from anchor 1: right')
    cy.get(cesc("#\\/pPositionFromAnchor2")).should('have.text', 'Position from anchor 2: lowerright')


    cy.log("can change disabled attribute only for button 1")
    cy.get(cesc('#\\/disabled2')).click();
    cy.get(cesc('#\\/disabled1')).click();
    cy.get(cesc("#\\/pDisabled1")).should('have.text', 'Disabled 1: true')
    cy.get(cesc("#\\/pDisabled2")).should('have.text', 'Disabled 2: true')


  })

});