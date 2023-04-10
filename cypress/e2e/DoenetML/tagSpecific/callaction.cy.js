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
    cy.visit('/src/Tools/cypressTest/')


  })


  it('resample random numbers', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice</label>
    </callAction></p>
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
    <callAction name="addPoint" target="theGraphs/g" actionName="addChildren">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>
    <callAction name="deletePoint" target="theGraphs/g" actionName="deleteChildren" number="1" >
      <label>delete point</label>
    </callAction>
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
    cy.get('#\\/bi').click();
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
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice and add point</label>
    </callAction></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="rs">
      <label>add point</label>
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

  it('chained actions, unnecessary $', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice and add point</label>
    </callAction></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="$rs">
      <label>add point</label>
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

  it('chained actions, inside map', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <map assignNames="set1 set2">
    <template newNamespace>
      <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
      <p><callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction></p>

      <graph name="g">
        <point name="P">(1,2)</point>
      </graph>
      
      <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

      <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="rs">
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </template>
    <sources><sequence length="2" /></sources>
    </map>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load\


    for (let ind = 1; ind <= 2; ind++) {

      cy.get(`#\\/set${ind}\\/addPoint_button`).should("not.exist");


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables[`/set${ind}/g`];

        expect(g.stateValues.graphicalDescendants.length).eq(1);

        let numbers;

        cy.get(`#\\/set${ind}\\/nums`).invoke('text').then(text => {
          numbers = text.split(',').map(Number);
          expect(numbers.length).eq(5);
          for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1)
            expect(num).lte(6)
          }
        })

        cy.get(`#\\/set${ind}\\/rs_button`).click();

        cy.get(`#\\/set${ind}\\/p2`).should('contain.text', '(3,4');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          let g = stateVariables[`/set${ind}/g`];

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

        cy.get(`#\\/set${ind}\\/p2`).should('contain.text', '(−2,5)');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          let g = stateVariables[`/set${ind}/g`];

          let pointNames = g.stateValues.graphicalDescendants.map(x => x.componentName);
          expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5])


          cy.get(`#\\/set${ind}\\/nums`).invoke('text').then(text => {
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
    }

  })

  it('chained actions on multiple sources', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice and add point</label>
    </callAction></p>

    <p><number name="n">1</number></p>
    <p><updateValue name="in" target="n" newValue="$n+1" type="number" >
      <label>increment number and add point</label>
    </updateValue></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
        
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="rs in">
      <label>add point</label>
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
    <p><callAction target="s" actionName="resample" name="rs" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>roll dice</label>
    </callAction></p>
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
        if (numbers2.length !== 5) {
          return false;
        }
        let foundChange = false;
        for (let [i, num] of numbers2.entries()) {
          if (!Number.isInteger(num) || num < 1 || num > 6) {
            return false;
          }
          if (num !== numbers[i]) {
            foundChange = true;
          }
        }
        if (!foundChange) {
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
        if (numbers2.length !== 5) {
          return false;
        }
        let foundChange = false;
        for (let [i, num] of numbers2.entries()) {
          if (!Number.isInteger(num) || num < 1 || num > 6) {
            return false;
          }
          if (num !== numbers[i]) {
            foundChange = true;
          }
        }
        if (!foundChange) {
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
    <p><callAction target="s" actionName="resample" name="rs" triggerWhenObjectsClicked="P" >
      <label>roll dice</label>
    </callAction></p>
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
        if (numbers2.length !== 5) {
          return false;
        }
        let foundChange = false;
        for (let [i, num] of numbers2.entries()) {
          if (!Number.isInteger(num) || num < 1 || num > 6) {
            return false;
          }
          if (num !== numbers[i]) {
            foundChange = true;
          }
        }
        if (!foundChange) {
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
        if (numbers2.length !== 5) {
          return false;
        }
        let foundChange = false;
        for (let [i, num] of numbers2.entries()) {
          if (!Number.isInteger(num) || num < 1 || num > 6) {
            return false;
          }
          if (num !== numbers[i]) {
            foundChange = true;
          }
        }
        if (!foundChange) {
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

  it('action triggered when click, inside template creating random names', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map>
    <template>
      <graph>
        <point name="P">(-1,2)</point>
      </graph>
      <copy prop="coords" target="P" assignNames="P2" />
      <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
      <p><callAction target="s" actionName="resample" name="rs" triggerWhenObjectsClicked="P" >
        <label>roll dice</label>
      </callAction></p>
    </template>
    <sources><sequence length="2" /></sources>
    </map>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      for (let ind = 0; ind < 2; ind++) {
        let templateName = stateVariables["/_map1"].replacements[ind].componentName;

        let tReps = stateVariables[templateName].replacements;
        let graphName = tReps[1].componentName;
        let copyName = tReps[3].componentName;
        let numsAnchor = '#' + cesc(tReps[5].componentName);

        let PName = stateVariables[graphName].activeChildren[0].componentName;
        let P2Anchor = '#' + cesc(stateVariables[copyName].replacements[0].componentName);


        let numbers;

        cy.get(numsAnchor).invoke('text').then(text => {
          numbers = text.split(',').map(Number);
          expect(numbers.length).eq(5);
          for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1)
            expect(num).lte(6)
          }
        })

        cy.get(P2Anchor).should('contain.text', '(−1,2)')


        cy.window().then(async (win) => {
          await win.callAction1({
            actionName: "movePoint",
            componentName: PName,
            args: { x: 3, y: -4 }
          });
          cy.get(P2Anchor).should('contain.text', '(3,−4)')

          cy.get(numsAnchor).invoke('text').then(text => {
            let numbers2 = text.split(',').map(Number);
            expect(numbers2).eqls(numbers)
          });
        })

        cy.window().then(async (win) => {
          await win.callAction1({
            actionName: "pointClicked",
            componentName: PName,
          });

          cy.waitUntil(() => cy.get(numsAnchor).invoke('text').then(text => {
            let numbers2 = text.split(',').map(Number);
            if (numbers2.length !== 5) {
              return false;
            }
            let foundChange = false;
            for (let [i, num] of numbers2.entries()) {
              if (!Number.isInteger(num) || num < 1 || num > 6) {
                return false;
              }
              if (num !== numbers[i]) {
                foundChange = true;
              }
            }
            if (!foundChange) {
              return false;
            }
            numbers = numbers2;
            return true;
          }))

        })

        cy.window().then(async (win) => {
          await win.callAction1({
            actionName: "movePoint",
            componentName: PName,
            args: { x: 5, y: 9 }
          });

          cy.get(P2Anchor).should('contain.text', '(5,9)')

          cy.get(numsAnchor).invoke('text').then(text => {
            let numbers2 = text.split(',').map(Number);
            expect(numbers2).eqls(numbers)
          });
        })


        cy.window().then(async (win) => {
          await win.callAction1({
            actionName: "pointClicked",
            componentName: PName,
          });

          cy.waitUntil(() => cy.get(numsAnchor).invoke('text').then(text => {
            let numbers2 = text.split(',').map(Number);
            if (numbers2.length !== 5) {
              return false;
            }
            let foundChange = false;
            for (let [i, num] of numbers2.entries()) {
              if (!Number.isInteger(num) || num < 1 || num > 6) {
                return false;
              }
              if (num !== numbers[i]) {
                foundChange = true;
              }
            }
            if (!foundChange) {
              return false;
            }
            numbers = numbers2;
            return true;
          }))
        })

        cy.window().then(async (win) => {
          await win.callAction1({
            actionName: "movePoint",
            componentName: PName,
            args: { x: 9, y: 7 }
          });

          cy.get(P2Anchor).should('contain.text', '(9,7)')

          cy.get(numsAnchor).invoke('text').then(text => {
            let numbers2 = text.split(',').map(Number);
            expect(numbers2).eqls(numbers)
          });

        });


      }

    })


  })

  it('action triggered when object focused', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    <copy prop="coords" target="P" assignNames="P2" />

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs" triggerWhenObjectsFocused="P" >
      <label>roll dice</label>
    </callAction></p>
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
        actionName: "pointFocused",
        componentName: "/P",
      });

      cy.waitUntil(() => cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        if (numbers2.length !== 5) {
          return false;
        }
        let foundChange = false;
        for (let [i, num] of numbers2.entries()) {
          if (!Number.isInteger(num) || num < 1 || num > 6) {
            return false;
          }
          if (num !== numbers[i]) {
            foundChange = true;
          }
        }
        if (!foundChange) {
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
        actionName: "pointFocused",
        componentName: "/P",
      });

      cy.waitUntil(() => cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        if (numbers2.length !== 5) {
          return false;
        }
        let foundChange = false;
        for (let [i, num] of numbers2.entries()) {
          if (!Number.isInteger(num) || num < 1 || num > 6) {
            return false;
          }
          if (num !== numbers[i]) {
            foundChange = true;
          }
        }
        if (!foundChange) {
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
    <p><callAction target="s" actionName="resample" name="rs"  triggerWith="addPoint" >
      <label>roll dice and add point</label>
    </callAction></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>add point</label>
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
    <p><callAction target="s" actionName="resample" name="rs"  triggerWith="addPoint" triggerWhen="$(P.x)<0 and $(P.y)<0" >
      <label>roll dice and add point</label>
    </callAction></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>add point</label>
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

    <triggerSet name="tset" >
      <label>perform actions</label>
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

    <triggerSet name="tset" >
        <label>perform actions</label>
        <callAction target="s" actionName="resample" name="rs" >
        <label>roll dice and add point</label>
      </callAction>
      <callAction name="addPoint" target="g" actionName="addChildren" >
        <label>add point</label>
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <callAction name="sub" target="ans" actionName="submitAnswer" triggerWith="tset" />

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
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice and more</label>
    </callAction></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWith="addOne">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    <p>Count: <number name="n">1</number></p>
    <updateValue name="addOne" target="n" newValue="$n+1" type="number" triggerWith="rs" />


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

  it('math in label', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs" ><label>Hi <m>\\sum_{i=1}^5x_i</m></label></callAction></p>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/rs').should('contain.text', 'Hi ∑5i=1xi')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/rs'].stateValues.label).eq("Hi \\(\\sum_{i=1}^5x_i\\)");
    });

  })

  it('label is name', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="resample_numbers" labelIsName /></p>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/resample_numbers').should('contain.text', 'resample numbers')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/resample_numbers'].stateValues.label).eq("resample numbers");
    });

  })

  it('case insensitive action name', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="reSamplE" name="rs"><label>roll dice</label></callAction></p>
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

  it('callaction in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph >
      <callaction anchor="$anchorCoords1" name="callaction1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" target="_graph1" actionName="addChildren">
        <label>add point</label>
        <point>(3,4)</point>
      </callaction>
      <callaction name="callaction2" target="_graph1" actionName="addChildren">
        <label>add point 2</label>
        <point>(-3,-4)</point>
      </callaction>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $callaction1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $callaction2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$callaction2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $callaction1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $callaction2.positionFromAnchor</p>
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
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$callaction2.positionFromAnchor">
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
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$callaction2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$callaction2.disabled" /></p>
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


    cy.log("move callactions by dragging")

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction1",
        args: { x: -2, y: 3 }
      })
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction2",
        args: { x: 4, y: -5 }
      })
    })

    cy.get('#\\/pAnchor2 .mjx-mrow').should('contain.text', '(4,−5)')

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(−2,3)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(4,−5)')


    cy.log("move callactions by entering coordinates")

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


    cy.log('cannot move callactions by dragging')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction1",
        args: { x: -10, y: -9 }
      })
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction2",
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