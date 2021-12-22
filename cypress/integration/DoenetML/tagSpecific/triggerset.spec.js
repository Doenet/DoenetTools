describe('TriggerSet Tag Tests', function () {

  beforeEach(() => {
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
      <updateValue name="flip" tName="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" tName="hello" newValue="$hello hello" type="text" />
      <updateValue name="addOne" tName="n" newValue="$n+1" type="number" />
      <callAction tName="s" actionName="resample" label="roll dice and add point" name="rs" />
      <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" >
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
      let components = win.state.components;
      let numbers;
      let g = components["/g"];

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


      cy.get('#\\/tset').click().then(() => {
        expect(g.activeChildren.length).eq(2);

        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers)
          numbers = numbers2;
        })

        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");

      })

      cy.get('#\\/tset').click().then(() => {
        expect(g.activeChildren.length).eq(3);

        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers)
          numbers = numbers2;
        })

        cy.get('#\\/b').should('have.text', "false");
        cy.get('#\\/hello').should('have.text', " hello hello");
        cy.get('#\\/n').should('have.text', "3");

      })

      cy.get('#\\/tset').click().then(() => {
        expect(g.activeChildren.length).eq(4);

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
      <updateValue name="flip" tName="b" newValue="not$b" type="boolean" />
      <updateValue name="addHello" tName="hello" newValue="$hello hello" type="text" />
      <callAction tName="s" actionName="resample" label="roll dice and add point" name="rs" />
    </triggerSet>

    <updateValue name="addOne" tName="n" newValue="$n+1" type="number" triggerWithTnames="tset" />
    <callAction name="addPoint" tName="g" actionName="addChildren" label="add point"  triggerWithTnames="tset" >
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
      let components = win.state.components;
      let numbers;
      let g = components["/g"];

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


      cy.get('#\\/tset').click().then(() => {
        expect(g.activeChildren.length).eq(2);

        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers)
          numbers = numbers2;
        })

        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");

      })

      cy.get('#\\/tset').click().then(() => {
        expect(g.activeChildren.length).eq(3);

        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers)
          numbers = numbers2;
        })

        cy.get('#\\/b').should('have.text', "false");
        cy.get('#\\/hello').should('have.text', " hello hello");
        cy.get('#\\/n').should('have.text', "3");

      })

      cy.get('#\\/tset').click().then(() => {
        expect(g.activeChildren.length).eq(4);

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
      <updateValue name="flip" tName="b" newValue="not$b" type="boolean" />
      <updateValue tName="hello" newValue="$hello hello" type="text" />
      <callAction tName="s" actionName="resample" label="roll dice and add point" name="rs" />
    </triggerSet>

    <triggerSet label="perform updates" triggerWithTnames="tset" >
      <updateValue tName="n" newValue="$n+1" type="number"  />
      <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" >
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
      let components = win.state.components;
      let numbers;
      let g = components["/g"];

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


      cy.get('#\\/tset').click().then(() => {
        expect(g.activeChildren.length).eq(2);

        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers)
          numbers = numbers2;
        })

        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");

      })

      cy.get('#\\/tset').click().then(() => {
        expect(g.activeChildren.length).eq(3);

        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers)
          numbers = numbers2;
        })

        cy.get('#\\/b').should('have.text', "false");
        cy.get('#\\/hello').should('have.text', " hello hello");
        cy.get('#\\/n').should('have.text', "3");

      })

      cy.get('#\\/tset').click().then(() => {
        expect(g.activeChildren.length).eq(4);

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
      <updateValue name="flip" tName="b" newValue="not$b" type="boolean" />
      <updateValue tName="hello" newValue="$hello hello" type="text" />
      <callAction tName="s" actionName="resample" label="roll dice and add point" name="rs" />
    </triggerSet>

    <triggerSet label="perform updates" triggerWithTnames="tset in" >
      <updateValue tName="n" newValue="$n+1" type="number"  />
      <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <updateValue label="update number and others" name="in" tname="n2" newValue="$n2+1" type="number" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/flip').should('not.exist');
    cy.get('#\\/addHello').should('not.exist');
    cy.get('#\\/addOne').should('not.exist');
    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then(async (win) => {
      let components = win.state.components;
      let numbers;
      let g = components["/g"];

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


      cy.get('#\\/tset').click().then(() => {
        expect(g.activeChildren.length).eq(2);

        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).not.eqls(numbers)
          numbers = numbers2;
        })

        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");
        cy.get('#\\/n2').should('have.text', "1");

      })

      cy.get('#\\/in').click().then(() => {
        expect(g.activeChildren.length).eq(3);
        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "3");
        cy.get('#\\/n2').should('have.text', "2");

      })


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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -1, y: -7 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('y')
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 1, y: 7 });
      cy.wait(10);
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -3, y: 4 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -6, y: 5 });
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4y')
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 4, y: 2 });
      cy.wait(10);
      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9x')
      });
      cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16y')
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 9, y: 7 });
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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -1, y: -7 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 1, y: 7 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");

    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "2");
      cy.get('#\\/m').should('have.text', "4");
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -3, y: -4 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -6, y: -5 });
      cy.get('#\\/b').should('have.text', "true");
      cy.get('#\\/hello').should('have.text', " hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 4, y: 2 });
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', " hello hello");
      cy.get('#\\/n').should('have.text', "3");
      cy.get('#\\/m').should('have.text', "3");
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 9, y: 7 });
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
      <updateValue tName="b" newValue="not$b" type="boolean" />
      <updateValue tName="hello" newValue="$hello hello" type="text" />
      <updateValue tName="n" newValue="$n+1" type="number" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" />
      <callAction tName="s" actionName="resample" label="roll dice and add point" name="rs" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" />
      <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = win.state.components;
      let numbers;
      let g = components["/g"];

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
        await components['/P'].movePoint({ x: -1, y: -7 });
        expect(g.activeChildren.length).eq(1);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get('#\\/b').should('have.text', "false");
        cy.get('#\\/hello').should('have.text', "");
        cy.get('#\\/n').should('have.text', "1");
      })

      cy.window().then(async (win) => {
        await components['/P'].movePoint({ x: 3, y: -4 });
        expect(g.activeChildren.length).eq(1);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get('#\\/b').should('have.text', "false");
        cy.get('#\\/hello').should('have.text', "");
        cy.get('#\\/n').should('have.text', "1");
      })

      cy.window().then(async (win) => {
        await components['/P'].movePoint({ x: 1, y: 7 });
        cy.wait(10).then(() => {
          expect(g.activeChildren.length).eq(2);
          cy.get('#\\/nums').invoke('text').then(text => {
            let numbers2 = text.split(',').map(Number);
            expect(numbers2).not.eqls(numbers);
            numbers = numbers2;
          })
          cy.get('#\\/b').should('have.text', "true");
          cy.get('#\\/hello').should('have.text', " hello");
          cy.get('#\\/n').should('have.text', "2");

        })
      })

      cy.window().then(async (win) => {
        await components['/P'].movePoint({ x: 5, y: 9 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");
      })

      cy.window().then(async (win) => {
        await components['/P'].movePoint({ x: -3, y: -4 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");
      })

      cy.window().then(async (win) => {
        await components['/P'].movePoint({ x: -6, y: -5 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers);
        })
        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");
      })

      cy.window().then(async (win) => {
        await components['/P'].movePoint({ x: 4, y: 2 });
        cy.wait(10).then(() => {
          expect(g.activeChildren.length).eq(3);
          cy.get('#\\/nums').invoke('text').then(text => {
            let numbers2 = text.split(',').map(Number);
            expect(numbers2).not.eqls(numbers);
            numbers = numbers2;
          })
          cy.get('#\\/b').should('have.text', "false");
          cy.get('#\\/hello').should('have.text', " hello hello");
          cy.get('#\\/n').should('have.text', "3");
        })
      })

      cy.window().then(async (win) => {
        await components['/P'].movePoint({ x: 9, y: 7 });
        expect(g.activeChildren.length).eq(3);
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
      <updateValue tName="b" newValue="not$b" type="boolean" />
      <updateValue tName="hello" newValue="$hello hello" type="text" />
      <updateValue tName="n" newValue="$n+1" type="number" triggerWithTnames="uv" />
      <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" triggerWithTnames="uv" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <updateValue name="uv" tName="m" newValue="$m-1" type="number" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = win.state.components;
      let g = components["/g"];

      expect(g.activeChildren.length).eq(1);
      cy.get('#\\/b').should('have.text', "false");
      cy.get('#\\/hello').should('have.text', "");
      cy.get('#\\/n').should('have.text', "1");
      cy.get('#\\/m').should('have.text', "5");
      cy.get('#\\/_triggerset1').should('not.exist');
      cy.get('#\\/uv').should('not.exist');

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: -1, y: -7 });
        expect(g.activeChildren.length).eq(1);
        cy.get('#\\/b').should('have.text', "false");
        cy.get('#\\/hello').should('have.text', "");
        cy.get('#\\/n').should('have.text', "1");
        cy.get('#\\/m').should('have.text', "4");
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 3, y: -4 });
        cy.get('#\\/b').should('have.text', "false");
        cy.get('#\\/hello').should('have.text', "");
        cy.get('#\\/n').should('have.text', "1");
        cy.get('#\\/m').should('have.text', "4");
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 1, y: 7 });
        cy.wait(10).then(() => {
          expect(g.activeChildren.length).eq(2);
          cy.get('#\\/b').should('have.text', "true");
          cy.get('#\\/hello').should('have.text', " hello");
          cy.get('#\\/n').should('have.text', "2");
          cy.get('#\\/m').should('have.text', "4");
        })
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 5, y: 9 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");
        cy.get('#\\/m').should('have.text', "4");
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: -3, y: -4 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");
        cy.get('#\\/m').should('have.text', "3");
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: -6, y: -5 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/b').should('have.text', "true");
        cy.get('#\\/hello').should('have.text', " hello");
        cy.get('#\\/n').should('have.text', "2");
        cy.get('#\\/m').should('have.text', "3");
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 4, y: 2 });
        cy.wait(10).then(() => {
          expect(g.activeChildren.length).eq(3);
          cy.get('#\\/b').should('have.text', "false");
          cy.get('#\\/hello').should('have.text', " hello hello");
          cy.get('#\\/n').should('have.text', "3");
          cy.get('#\\/m').should('have.text', "3");
        })
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 9, y: 7 });
        expect(g.activeChildren.length).eq(3);
        cy.get('#\\/b').should('have.text', "false");
        cy.get('#\\/hello').should('have.text', " hello hello");
        cy.get('#\\/n').should('have.text', "3");
        cy.get('#\\/m').should('have.text', "3");

      });
    })
  })


});