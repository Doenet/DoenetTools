import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('CallAction Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')


  })


  it('resample random numbers', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" label="roll dice" name="rs" /></p>
    <p>Sum: <number name="sum"><sum>
      <map>
        <template><number>$v*10^($i-1)</number></template>
        <sources alias="v" indexAlias="i">$s</sources>
      </map>
    </sum></number></p>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let numbers, sum = 0;

    cy.get('#\\/nums').invoke('text').then(text => {
      numbers = text.split(',').map(Number);
      expect(numbers.length).eq(5);
      for (let [ind, num] of numbers.entries()) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
        sum += num * 10 ** ind;
      }
    })
    cy.get('#\\/sum').invoke('text').then(text => {
      let sum2 = Number(text);
      expect(sum2).eq(sum);
    })

    // main purpose of sum is to make sure wait until recalculation has occured
    cy.get('#\\/rs_button').click().then(() => {
      cy.get('#\\/sum').should('not.contain', sum.toString());
    });


    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2.length).eq(5);
      for (let num of numbers2) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
      expect(numbers2).not.eqls(numbers)
    })


  })

  it('add and delete points', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <section name="theGraphs" newNamespace>
      <title>The graphs</title>
      <graph name="g">
        <point name="P">(1,2)</point>
      </graph>
      
      <copy target="g" assignNames="g2" />
    </section>

    <copy target="theGraphs" assignNames="theGraphs2" />

    <p>points from graph: <collect componentTypes="point" target="theGraphs/g" prop="coords" assignNames="p1 p2 p3" /></p>
    <callAction name="addPoint" target="theGraphs/g" actionName="addChildren" label="add point">
      <point>(3,4)</point>
    </callAction>
    <callAction name="deletePoint" target="theGraphs/g" actionName="deleteChildren" label="delete point" number="1" />
    <p><booleaninput name="bi" /><copy prop="value" target="bi" assignNames="b" /></p>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/p1').should('contain.text', '(1,2)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        expect(g.stateValues.graphicalDescendants.length).eq(1);
      }

    });

    cy.get('#\\/addPoint_button').click();

    cy.get('#\\/p2').should('contain.text', '(3,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];


      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4])
      }

      await win.callAction1({
        actionName: "movePoint",
        componentName: g1.stateValues.graphicalDescendants[1].componentName,
        args: { x: -2, y: 5 }
      })

    });

    cy.get('#\\/p2').should('contain.text', '(−2,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5])
      }
    })

    cy.get('#\\/addPoint_button').click();

    cy.get('#\\/p3').should('contain.text', '(3,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];


      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(pointNames.length).eq(3);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5])
        expect(stateVariables[pointNames[2]].stateValues.xs).eqls([3, 4])
      }

      await win.callAction1({
        actionName: "movePoint",
        componentName: g2.stateValues.graphicalDescendants[2].componentName,
        args: { x: 7, y: -9 }
      })

    });

    cy.get('#\\/p3').should('contain.text', '(7,−9)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(stateVariables[pointNames[2]].stateValues.xs).eqls([7, -9])
      }
    })


    cy.get('#\\/deletePoint_button').click();

    cy.get('#\\/p3').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5])
      }

      await win.callAction1({
        actionName: "movePoint",
        componentName: g3.stateValues.graphicalDescendants[1].componentName,
        args: { x: 1, y: 0 }
      })
    })

    cy.get('#\\/p2').should('contain.text', '(1,0)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([1, 0])
      }

    })

    cy.get('#\\/deletePoint_button').click();

    cy.get('#\\/p2').should('not.exist');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(pointNames.length).eq(1);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
      }

    })


    cy.get('#\\/deletePoint_button').click();

    // since nothing happens, we wait for core to respond to booleaninput
    cy.get('#\\/bi_input').click();
    cy.get('#\\/b').should('have.text', 'true');

    cy.get('#\\/p1').should('contain.text', '(1,2)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(pointNames.length).eq(1);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
      }

    })


    cy.get('#\\/addPoint_button').click();

    cy.get('#\\/p2').should('contain.text', '(3,4)');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];


      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4])
      }


    });

  })

  it('chained actions', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" label="roll dice and add point" name="rs" /></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" label="add point" triggerWithTargets="rs">
    <point>(3,4)</point>
    </callAction>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/addPoint_button').should("not.exist");


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      expect(g.stateValues.graphicalDescendants.length).eq(1);

      let numbers;

      cy.get('#\\/nums').invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })

      cy.get('#\\/rs_button').click();

      cy.get('#\\/p2').should('contain.text', '(3,4');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables["/g"];

        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4])


        await win.callAction1({
          actionName: "movePoint",
          componentName: pointNames[1],
          args: { x: -2, y: 5 }
        })

      });

      cy.get('#\\/p2').should('contain.text', '(−2,5)');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables["/g"];

        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5])


        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2.length).eq(5);
          for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1)
            expect(num).lte(6)
          }
          expect(numbers2).not.eqls(numbers)
        })

      })

    });

  })

  it('chained actions on multiple sources', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" label="roll dice and add point" name="rs" /></p>

    <p><number name="n">1</number></p>
    <p><updateValue label="increment number and add point" name="in" target="n" newValue="$n+1" type="number" /></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
        
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" label="add point" triggerWithTargets="rs in">
    <point>(3,4)</point>
    </callAction>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/addPoint').should("not.exist");

    let numbers;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      expect(g.stateValues.graphicalDescendants.length).eq(1);

      cy.get('#\\/nums').invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      })
      cy.get('#\\/n').should('have.text', '1');
    });

    cy.get('#\\/rs_button').click();

    cy.get('#\\/p2').should('contain.text', '(3,4');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
      expect(pointNames.length).eq(2);
      expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4])


      await win.callAction1({
        actionName: "movePoint",
        componentName: pointNames[1],
        args: { x: -2, y: 5 }
      })

    });

    cy.get('#\\/p2').should('contain.text', '(−2,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5])


      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2.length).eq(5);
        for (let num of numbers2) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
        expect(numbers2).not.eqls(numbers)
      })

      cy.get('#\\/n').should('have.text', '1');

    })

    cy.get('#\\/in_button').click();

    cy.get('#\\/p3').should('contain.text', '(3,4');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
      expect(pointNames.length).eq(3);
      expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5])
      expect(stateVariables[pointNames[2]].stateValues.xs).eqls([3, 4])

      await win.callAction1({
        actionName: "movePoint",
        componentName: pointNames[2],
        args: { x: 7, y: -9 }
      })

    });

    cy.get('#\\/p3').should('contain.text', '(7,−9)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
      expect(stateVariables[pointNames[2]].stateValues.xs).eqls([7, -9])

      cy.get('#\\/n').should('have.text', '2');

    })

  })

  it('action based on trigger', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <copy prop="coords" target="P" assignNames="P2" />

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" label="roll dice" name="rs" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let numbers;

    cy.get('#\\/nums').invoke('text').then(text => {
      numbers = text.split(',').map(Number);
      expect(numbers.length).eq(5);
      for (let num of numbers) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
    })

    cy.get('#\\/P2').should('contain.text', '(−1,2)')

    cy.get('#\\/rs').should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });

      cy.get('#\\/P2').should('contain.text', '(−1,−7)')

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get('#\\/P2').should('contain.text', '(3,−4)')

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
      cy.get('#\\/P2').should('contain.text', '(1,7)')

      cy.waitUntil(() => cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        if(numbers2.length !== 5) {
          return false;
        }
        let foundChange = false;
        for (let [i, num] of numbers2.entries()) {
          if(!Number.isInteger(num) || num < 1 || num > 6 ) {
            return false;
          }
          if(num !== numbers[i]) {
            foundChange = true;
          }
        }
        if(!foundChange) {
          return false;
        }
        numbers = numbers2;
        return true;
      }))

    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });

      cy.get('#\\/P2').should('contain.text', '(5,9)')

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: 4 }
      });

      cy.get('#\\/P2').should('contain.text', '(−3,4)')

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: 5 }
      });

      cy.get('#\\/P2').should('contain.text', '(−6,5)')

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });

      cy.get('#\\/P2').should('contain.text', '(4,2)')

      cy.waitUntil(() => cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        if(numbers2.length !== 5) {
          return false;
        }
        let foundChange = false;
        for (let [i, num] of numbers2.entries()) {
          if(!Number.isInteger(num) || num < 1 || num > 6 ) {
            return false;
          }
          if(num !== numbers[i]) {
            foundChange = true;
          }
        }
        if(!foundChange) {
          return false;
        }
        numbers = numbers2;
        return true;
      }))
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });

      cy.get('#\\/P2').should('contain.text', '(9,7)')

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });

    });
  })

  it('action triggered when click', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <copy prop="coords" target="P" assignNames="P2" />

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" label="roll dice" name="rs" triggerWhenTargetsClicked="P" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let numbers;

    cy.get('#\\/nums').invoke('text').then(text => {
      numbers = text.split(',').map(Number);
      expect(numbers.length).eq(5);
      for (let num of numbers) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
    })

    cy.get('#\\/P2').should('contain.text', '(−1,2)')

    cy.get('#\\/rs').should('not.exist');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
      cy.get('#\\/P2').should('contain.text', '(3,−4)')

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
      });

      cy.waitUntil(() => cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        if(numbers2.length !== 5) {
          return false;
        }
        let foundChange = false;
        for (let [i, num] of numbers2.entries()) {
          if(!Number.isInteger(num) || num < 1 || num > 6 ) {
            return false;
          }
          if(num !== numbers[i]) {
            foundChange = true;
          }
        }
        if(!foundChange) {
          return false;
        }
        numbers = numbers2;
        return true;
      }))

    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });

      cy.get('#\\/P2').should('contain.text', '(5,9)')

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
      });

      cy.waitUntil(() => cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        if(numbers2.length !== 5) {
          return false;
        }
        let foundChange = false;
        for (let [i, num] of numbers2.entries()) {
          if(!Number.isInteger(num) || num < 1 || num > 6 ) {
            return false;
          }
          if(num !== numbers[i]) {
            foundChange = true;
          }
        }
        if(!foundChange) {
          return false;
        }
        numbers = numbers2;
        return true;
      }))
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });

      cy.get('#\\/P2').should('contain.text', '(9,7)')

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });

    });
  })

  it('chained updates based on trigger', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>
    <copy prop="coords" target="P" assignNames="P2" />

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" label="roll dice and add point" name="rs"  triggerWithTargets="addPoint" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" label="add point" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" >
    <point>(3,4)</point>
    </callAction>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/P2').should('contain.text', '(−1,2)')
    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    })

    let numbers;

    cy.get('#\\/nums').invoke('text').then(text => {
      numbers = text.split(',').map(Number);
      expect(numbers.length).eq(5);
      for (let num of numbers) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
    })


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(−1,−7)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(3,−4)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
    });

    cy.get('#\\/P2').should('contain.text', '(1,7)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2.length).eq(5);
      for (let num of numbers2) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
      expect(numbers2).not.eqls(numbers);
      numbers = numbers2;
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(5,9)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: 4 }
      });
    });

    cy.get('#\\/P2').should('contain.text', '(−3,4)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: 5 }
      });
    })
    cy.get('#\\/P2').should('contain.text', '(−6,5)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
    });

    cy.get('#\\/P2').should('contain.text', '(4,2)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(3);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2.length).eq(5);
      for (let num of numbers2) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
      expect(numbers2).not.eqls(numbers);
      numbers = numbers2;
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(9,7)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(3);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

  })

  it('triggerWhen supercedes chaining', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>

    <copy prop="coords" target="P" assignNames="P2" />

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" label="roll dice and add point" name="rs"  triggerWithTargets="addPoint" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" label="add point" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" >
    <point>(3,4)</point>
    </callAction>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/P2').should('contain.text', '(−1,2)')
    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    })

    let numbers;

    cy.get('#\\/nums').invoke('text').then(text => {
      numbers = text.split(',').map(Number);
      expect(numbers.length).eq(5);
      for (let num of numbers) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
    })


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 }
      });
    });

    cy.get('#\\/P2').should('contain.text', '(−1,−7)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2.length).eq(5);
      for (let num of numbers2) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
      expect(numbers2).not.eqls(numbers);
      numbers = numbers2;
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(3,−4)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(1,7)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(5,9)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: -4 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(−3,−4)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2.length).eq(5);
      for (let num of numbers2) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
      expect(numbers2).not.eqls(numbers);
      numbers = numbers2;
    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: -5 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(−6,−5)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(4,2)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(3);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 }
      });
    })

    cy.get('#\\/P2').should('contain.text', '(9,7)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(3);
    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2).eqls(numbers)
    });
  })

  it('triggerSet', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

    <triggerSet label="perform actions" name="tset" >
      <callAction target="s" actionName="resample" label="roll dice and add point" name="rs" />
      <callAction name="addPoint" target="g" actionName="addChildren" label="add point" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    })

    let numbers;

    cy.get('#\\/nums').invoke('text').then(text => {
      numbers = text.split(',').map(Number);
      expect(numbers.length).eq(5);
      for (let num of numbers) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
    })

    cy.get('#\\/tset_button').click();

    cy.get('#\\/p2').should('contain.text', '(3,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
      expect(pointNames.length).eq(2);
      expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4])

      await win.callAction1({
        actionName: "movePoint",
        componentName: pointNames[1],
        args: { x: -2, y: 5 }
      })

    });

    cy.get('#\\/p2').should('contain.text', '(−2,5)');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5])


    })

    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2.length).eq(5);
      for (let num of numbers2) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
      expect(numbers2).not.eqls(numbers)
    })


  })

  it('triggerSet and chain to callAction', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

    <p>Enter x: <answer name="ans">x</answer></p>

    <triggerSet label="perform actions" name="tset" >
      <callAction target="s" actionName="resample" label="roll dice and add point" name="rs" />
      <callAction name="addPoint" target="g" actionName="addChildren" label="add point" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <callAction name="sub" target="ans" actionName="submitAnswer" triggerWithTargets="tset" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');
    cy.get('#\\/sub').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let mathinputName = stateVariables['/ans'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');
      let mathinputPartialAnchor = cesc('#' + mathinputName + '_partial');


      cy.get(mathinputAnchor).type(`x`, { force: true });

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinputCorrectAnchor).should('not.exist');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');


      expect(g.stateValues.graphicalDescendants.length).eq(1);

      let numbers;

      cy.get('#\\/nums').invoke('text').then(text => {
        numbers = text.split(',').map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
      });

      cy.get('#\\/tset_button').click();


      cy.get('#\\/p2').should('contain.text', '(3,4)');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables["/g"];

        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4])

        await win.callAction1({
          actionName: "movePoint",
          componentName: pointNames[1],
          args: { x: -2, y: 5 }
        })

      });

      cy.get('#\\/p2').should('contain.text', '(−2,5)');


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables["/g"];

        let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5])


      })


      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2.length).eq(5);
        for (let num of numbers2) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1)
          expect(num).lte(6)
        }
        expect(numbers2).not.eqls(numbers)
      })

      cy.get(mathinputSubmitAnchor).should('not.exist');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinputIncorrectAnchor).should('not.exist');
      cy.get(mathinputPartialAnchor).should('not.exist');


    })


  })

  it('chaining with updateValue', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" label="roll dice and more" name="rs" /></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" label="add point" triggerWithTargets="addOne">
    <point>(3,4)</point>
    </callAction>

    <p>Count: <number name="n">1</number></p>
    <updateValue name="addOne" target="n" newValue="$n+1" type="number" triggerWithTargets="rs" />


    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/addPoint').should("not.exist");


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    })


    let numbers;

    cy.get('#\\/nums').invoke('text').then(text => {
      numbers = text.split(',').map(Number);
      expect(numbers.length).eq(5);
      for (let num of numbers) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
    })
    cy.get('#\\/n').should('have.text', "1");

    cy.get('#\\/rs_button').click();


    cy.get('#\\/p2').should('contain.text', '(3,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
      expect(pointNames.length).eq(2);
      expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2])
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4])

      await win.callAction1({
        actionName: "movePoint",
        componentName: pointNames[1],
        args: { x: -2, y: 5 }
      })

    });

    cy.get('#\\/p2').should('contain.text', '(−2,5)');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5])

    })


    cy.get('#\\/nums').invoke('text').then(text => {
      let numbers2 = text.split(',').map(Number);
      expect(numbers2.length).eq(5);
      for (let num of numbers2) {
        expect(Number.isInteger(num)).be.true;
        expect(num).gte(1)
        expect(num).lte(6)
      }
      expect(numbers2).not.eqls(numbers)
    })

    cy.get('#\\/n').should('have.text', "2");


  })

});