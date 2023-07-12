import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("CallAction Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("resample random numbers", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs" >
      <label>roll dice</label>
    </callAction></p>
    <p>Sum: <number name="sum"><sum>
      <map>
        <template><number>$v*10^($i-1)</number></template>
        <sources alias="v" indexAlias="i">$s</sources>
      </map>
    </sum></number></p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let numbers,
      sum = 0;

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        numbers = text.split(",").map(Number);
        expect(numbers.length).eq(5);
        for (let [ind, num] of numbers.entries()) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
          sum += num * 10 ** ind;
        }
      });
    cy.get(cesc("#\\/sum"))
      .invoke("text")
      .then((text) => {
        let sum2 = Number(text);
        expect(sum2).eq(sum);
      });

    // main purpose of sum is to make sure wait until recalculation has occured
    cy.get(cesc("#\\/rs_button"))
      .click()
      .then(() => {
        cy.get(cesc("#\\/sum")).should("not.contain", sum.toString());
      });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2.length).eq(5);
        for (let num of numbers2) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
      });
  });

  it("add and delete points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <section name="theGraphs" newNamespace>
      <title>The graphs</title>
      <graph name="g">
        <point name="P">(1,2)</point>
      </graph>
      
      $g{name="g2"}
    </section>

    $theGraphs{name="theGraphs2"}

    <p>points from graph: <collect componentTypes="point" target="theGraphs/g" prop="coords" assignNames="p1 p2 p3" /></p>
    <callAction name="addPoint" target="theGraphs/g" actionName="addChildren">
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>
    <callAction name="deletePoint" target="theGraphs/g" actionName="deleteChildren" number="1" >
      <label>delete point</label>
    </callAction>
    <p><booleaninput name="bi" />$bi.value{assignNames="b"}</p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/p1")).should("contain.text", "(1,2)");

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

    cy.get(cesc("#\\/addPoint_button")).click();

    cy.get(cesc("#\\/p2")).should("contain.text", "(3,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4]);
      }

      await win.callAction1({
        actionName: "movePoint",
        componentName: g1.stateValues.graphicalDescendants[1].componentName,
        args: { x: -2, y: 5 },
      });
    });

    cy.get(cesc("#\\/p2")).should("contain.text", "(−2,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);
      }
    });

    cy.get(cesc("#\\/addPoint_button")).click();

    cy.get(cesc("#\\/p3")).should("contain.text", "(3,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(pointNames.length).eq(3);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);
        expect(stateVariables[pointNames[2]].stateValues.xs).eqls([3, 4]);
      }

      await win.callAction1({
        actionName: "movePoint",
        componentName: g2.stateValues.graphicalDescendants[2].componentName,
        args: { x: 7, y: -9 },
      });
    });

    cy.get(cesc("#\\/p3")).should("contain.text", "(7,−9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(stateVariables[pointNames[2]].stateValues.xs).eqls([7, -9]);
      }
    });

    cy.get(cesc("#\\/deletePoint_button")).click();

    cy.get(cesc("#\\/p3")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);
      }

      await win.callAction1({
        actionName: "movePoint",
        componentName: g3.stateValues.graphicalDescendants[1].componentName,
        args: { x: 1, y: 0 },
      });
    });

    cy.get(cesc("#\\/p2")).should("contain.text", "(1,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([1, 0]);
      }
    });

    cy.get(cesc("#\\/deletePoint_button")).click();

    cy.get(cesc("#\\/p2")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(pointNames.length).eq(1);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
      }
    });

    cy.get(cesc("#\\/deletePoint_button")).click();

    // since nothing happens, we wait for core to respond to booleaninput
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");

    cy.get(cesc("#\\/p1")).should("contain.text", "(1,2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(pointNames.length).eq(1);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
      }
    });

    cy.get(cesc("#\\/addPoint_button")).click();

    cy.get(cesc("#\\/p2")).should("contain.text", "(3,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1 = stateVariables["/theGraphs/g"];
      let g2 = stateVariables["/theGraphs/g2"];
      let g3 = stateVariables["/theGraphs2/g"];
      let g4 = stateVariables["/theGraphs2/g2"];
      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4]);
      }
    });
  });

  it("chained actions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
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

    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/addPoint_button")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      expect(g.stateValues.graphicalDescendants.length).eq(1);

      let numbers;

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          numbers = text.split(",").map(Number);
          expect(numbers.length).eq(5);
          for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
          }
        });

      cy.get(cesc("#\\/rs_button")).click();

      cy.get(cesc("#\\/p2")).should("contain.text", "(3,4");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables["/g"];

        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4]);

        await win.callAction1({
          actionName: "movePoint",
          componentName: pointNames[1],
          args: { x: -2, y: 5 },
        });
      });

      cy.get(cesc("#\\/p2")).should("contain.text", "(−2,5)");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables["/g"];

        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);

        cy.get(cesc("#\\/nums"))
          .invoke("text")
          .then((text) => {
            let numbers2 = text.split(",").map(Number);
            expect(numbers2.length).eq(5);
            for (let num of numbers2) {
              expect(Number.isInteger(num)).be.true;
              expect(num).gte(1);
              expect(num).lte(6);
            }
            expect(numbers2).not.eqls(numbers);
          });
      });
    });
  });

  it("chained actions, unnecessary $", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
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

    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/addPoint_button")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      expect(g.stateValues.graphicalDescendants.length).eq(1);

      let numbers;

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          numbers = text.split(",").map(Number);
          expect(numbers.length).eq(5);
          for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
          }
        });

      cy.get(cesc("#\\/rs_button")).click();

      cy.get(cesc("#\\/p2")).should("contain.text", "(3,4");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables["/g"];

        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4]);

        await win.callAction1({
          actionName: "movePoint",
          componentName: pointNames[1],
          args: { x: -2, y: 5 },
        });
      });

      cy.get(cesc("#\\/p2")).should("contain.text", "(−2,5)");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables["/g"];

        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);

        cy.get(cesc("#\\/nums"))
          .invoke("text")
          .then((text) => {
            let numbers2 = text.split(",").map(Number);
            expect(numbers2.length).eq(5);
            for (let num of numbers2) {
              expect(Number.isInteger(num)).be.true;
              expect(num).gte(1);
              expect(num).lte(6);
            }
            expect(numbers2).not.eqls(numbers);
          });
      });
    });
  });

  it("chained actions, inside map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <map assignNames="set1 set2">
    <template newNamespace>
      <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
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

    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load\

    for (let ind = 1; ind <= 2; ind++) {
      cy.get(cesc(`#\\/set${ind}\\/addPoint_button`)).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables[`/set${ind}/g`];

        expect(g.stateValues.graphicalDescendants.length).eq(1);

        let numbers;

        cy.get(cesc(`#\\/set${ind}\\/nums`))
          .invoke("text")
          .then((text) => {
            numbers = text.split(",").map(Number);
            expect(numbers.length).eq(5);
            for (let num of numbers) {
              expect(Number.isInteger(num)).be.true;
              expect(num).gte(1);
              expect(num).lte(6);
            }
          });

        cy.get(cesc(`#\\/set${ind}\\/rs_button`)).click();

        cy.get(cesc(`#\\/set${ind}\\/p2`)).should("contain.text", "(3,4");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          let g = stateVariables[`/set${ind}/g`];

          let pointNames = g.stateValues.graphicalDescendants.map(
            (x) => x.componentName,
          );
          expect(pointNames.length).eq(2);
          expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
          expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4]);

          await win.callAction1({
            actionName: "movePoint",
            componentName: pointNames[1],
            args: { x: -2, y: 5 },
          });
        });

        cy.get(cesc(`#\\/set${ind}\\/p2`)).should("contain.text", "(−2,5)");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          let g = stateVariables[`/set${ind}/g`];

          let pointNames = g.stateValues.graphicalDescendants.map(
            (x) => x.componentName,
          );
          expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);

          cy.get(cesc(`#\\/set${ind}\\/nums`))
            .invoke("text")
            .then((text) => {
              let numbers2 = text.split(",").map(Number);
              expect(numbers2.length).eq(5);
              for (let num of numbers2) {
                expect(Number.isInteger(num)).be.true;
                expect(num).gte(1);
                expect(num).lte(6);
              }
              expect(numbers2).not.eqls(numbers);
            });
        });
      });
    }
  });

  it("chained actions on multiple sources", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
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

    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/addPoint")).should("not.exist");

    let numbers;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      expect(g.stateValues.graphicalDescendants.length).eq(1);

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          numbers = text.split(",").map(Number);
          expect(numbers.length).eq(5);
          for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
          }
        });
      cy.get(cesc("#\\/n")).should("have.text", "1");
    });

    cy.get(cesc("#\\/rs_button")).click();

    cy.get(cesc("#\\/p2")).should("contain.text", "(3,4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(
        (x) => x.componentName,
      );
      expect(pointNames.length).eq(2);
      expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4]);

      await win.callAction1({
        actionName: "movePoint",
        componentName: pointNames[1],
        args: { x: -2, y: 5 },
      });
    });

    cy.get(cesc("#\\/p2")).should("contain.text", "(−2,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(
        (x) => x.componentName,
      );
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2.length).eq(5);
          for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
          }
          expect(numbers2).not.eqls(numbers);
        });

      cy.get(cesc("#\\/n")).should("have.text", "1");
    });

    cy.get(cesc("#\\/in_button")).click();

    cy.get(cesc("#\\/p3")).should("contain.text", "(3,4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(
        (x) => x.componentName,
      );
      expect(pointNames.length).eq(3);
      expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);
      expect(stateVariables[pointNames[2]].stateValues.xs).eqls([3, 4]);

      await win.callAction1({
        actionName: "movePoint",
        componentName: pointNames[2],
        args: { x: 7, y: -9 },
      });
    });

    cy.get(cesc("#\\/p3")).should("contain.text", "(7,−9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(
        (x) => x.componentName,
      );
      expect(stateVariables[pointNames[2]].stateValues.xs).eqls([7, -9]);

      cy.get(cesc("#\\/n")).should("have.text", "2");
    });
  });

  it("action based on trigger", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    $P.coords{assignNames="P2"}

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>roll dice</label>
    </callAction></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let numbers;

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        numbers = text.split(",").map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
      });

    cy.get(cesc("#\\/P2")).should("contain.text", "(−1,2)");

    cy.get(cesc("#\\/rs")).should("not.exist");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 },
      });

      cy.get(cesc("#\\/P2")).should("contain.text", "(−1,−7)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 },
      });
      cy.get(cesc("#\\/P2")).should("contain.text", "(3,−4)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 },
      });
      cy.get(cesc("#\\/P2")).should("contain.text", "(1,7)");

      cy.waitUntil(() =>
        cy
          .get(cesc("#\\/nums"))
          .invoke("text")
          .then((text) => {
            let numbers2 = text.split(",").map(Number);
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
          }),
      );
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 },
      });

      cy.get(cesc("#\\/P2")).should("contain.text", "(5,9)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: 4 },
      });

      cy.get(cesc("#\\/P2")).should("contain.text", "(−3,4)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: 5 },
      });

      cy.get(cesc("#\\/P2")).should("contain.text", "(−6,5)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 },
      });

      cy.get(cesc("#\\/P2")).should("contain.text", "(4,2)");

      cy.waitUntil(() =>
        cy
          .get(cesc("#\\/nums"))
          .invoke("text")
          .then((text) => {
            let numbers2 = text.split(",").map(Number);
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
          }),
      );
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 },
      });

      cy.get(cesc("#\\/P2")).should("contain.text", "(9,7)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });
  });

  it("action triggered when click", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    $P.coords{assignNames="P2"}

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs" triggerWhenObjectsClicked="P" >
      <label>roll dice</label>
    </callAction></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let numbers;

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        numbers = text.split(",").map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
      });

    cy.get(cesc("#\\/P2")).should("contain.text", "(−1,2)");

    cy.get(cesc("#\\/rs")).should("not.exist");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 },
      });
      cy.get(cesc("#\\/P2")).should("contain.text", "(3,−4)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
        args: { name: "/P" },
      });

      cy.waitUntil(() =>
        cy
          .get(cesc("#\\/nums"))
          .invoke("text")
          .then((text) => {
            let numbers2 = text.split(",").map(Number);
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
          }),
      );
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 },
      });

      cy.get(cesc("#\\/P2")).should("contain.text", "(5,9)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
        args: { name: "/P" },
      });

      cy.waitUntil(() =>
        cy
          .get(cesc("#\\/nums"))
          .invoke("text")
          .then((text) => {
            let numbers2 = text.split(",").map(Number);
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
          }),
      );
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 },
      });

      cy.get(cesc("#\\/P2")).should("contain.text", "(9,7)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });
  });

  it("action triggered when click, inside template creating random names", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <map>
    <template>
      <graph>
        <point name="P">(-1,2)</point>
      </graph>
      $P.coords{assignNames="P2"}
      <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
      <p><callAction target="s" actionName="resample" name="rs" triggerWhenObjectsClicked="P" >
        <label>roll dice</label>
      </callAction></p>
    </template>
    <sources><sequence length="2" /></sources>
    </map>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      for (let ind = 0; ind < 2; ind++) {
        let templateName =
          stateVariables["/_map1"].replacements[ind].componentName;

        let tReps = stateVariables[templateName].replacements;
        let graphName = tReps[1].componentName;
        let copyName = tReps[3].componentName;
        let numsAnchor = "#" + cesc2(tReps[5].componentName);

        let PName = stateVariables[graphName].activeChildren[0].componentName;
        let P2Anchor =
          "#" + cesc2(stateVariables[copyName].replacements[0].componentName);

        let numbers;

        cy.get(numsAnchor)
          .invoke("text")
          .then((text) => {
            numbers = text.split(",").map(Number);
            expect(numbers.length).eq(5);
            for (let num of numbers) {
              expect(Number.isInteger(num)).be.true;
              expect(num).gte(1);
              expect(num).lte(6);
            }
          });

        cy.get(P2Anchor).should("contain.text", "(−1,2)");

        cy.window().then(async (win) => {
          await win.callAction1({
            actionName: "movePoint",
            componentName: PName,
            args: { x: 3, y: -4 },
          });
          cy.get(P2Anchor).should("contain.text", "(3,−4)");

          cy.get(numsAnchor)
            .invoke("text")
            .then((text) => {
              let numbers2 = text.split(",").map(Number);
              expect(numbers2).eqls(numbers);
            });
        });

        cy.window().then(async (win) => {
          await win.callAction1({
            actionName: "pointClicked",
            componentName: PName,
            args: { name: PName },
          });

          cy.waitUntil(() =>
            cy
              .get(numsAnchor)
              .invoke("text")
              .then((text) => {
                let numbers2 = text.split(",").map(Number);
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
              }),
          );
        });

        cy.window().then(async (win) => {
          await win.callAction1({
            actionName: "movePoint",
            componentName: PName,
            args: { x: 5, y: 9 },
          });

          cy.get(P2Anchor).should("contain.text", "(5,9)");

          cy.get(numsAnchor)
            .invoke("text")
            .then((text) => {
              let numbers2 = text.split(",").map(Number);
              expect(numbers2).eqls(numbers);
            });
        });

        cy.window().then(async (win) => {
          await win.callAction1({
            actionName: "pointClicked",
            componentName: PName,
            args: { name: PName },
          });

          cy.waitUntil(() =>
            cy
              .get(numsAnchor)
              .invoke("text")
              .then((text) => {
                let numbers2 = text.split(",").map(Number);
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
              }),
          );
        });

        cy.window().then(async (win) => {
          await win.callAction1({
            actionName: "movePoint",
            componentName: PName,
            args: { x: 9, y: 7 },
          });

          cy.get(P2Anchor).should("contain.text", "(9,7)");

          cy.get(numsAnchor)
            .invoke("text")
            .then((text) => {
              let numbers2 = text.split(",").map(Number);
              expect(numbers2).eqls(numbers);
            });
        });
      }
    });
  });

  it("action triggered when object focused", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>
    $P.coords{assignNames="P2"}

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs" triggerWhenObjectsFocused="P" >
      <label>roll dice</label>
    </callAction></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let numbers;

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        numbers = text.split(",").map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
      });

    cy.get(cesc("#\\/P2")).should("contain.text", "(−1,2)");

    cy.get(cesc("#\\/rs")).should("not.exist");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 },
      });
      cy.get(cesc("#\\/P2")).should("contain.text", "(3,−4)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointFocused",
        componentName: "/P",
        args: { name: "/P" },
      });

      cy.waitUntil(() =>
        cy
          .get(cesc("#\\/nums"))
          .invoke("text")
          .then((text) => {
            let numbers2 = text.split(",").map(Number);
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
          }),
      );
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 },
      });

      cy.get(cesc("#\\/P2")).should("contain.text", "(5,9)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointFocused",
        componentName: "/P",
        args: { name: "/P" },
      });

      cy.waitUntil(() =>
        cy
          .get(cesc("#\\/nums"))
          .invoke("text")
          .then((text) => {
            let numbers2 = text.split(",").map(Number);
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
          }),
      );
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 },
      });

      cy.get(cesc("#\\/P2")).should("contain.text", "(9,7)");

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2).eqls(numbers);
        });
    });
  });

  it("chained updates based on trigger", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>
    $P.coords{assignNames="P2"}

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs"  triggerWith="addPoint" >
      <label>roll dice and add point</label>
    </callAction></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>

    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/P2")).should("contain.text", "(−1,2)");
    cy.get(cesc("#\\/rs")).should("not.exist");
    cy.get(cesc("#\\/addPoint")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    });

    let numbers;

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        numbers = text.split(",").map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(−1,−7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(3,−4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(1,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2.length).eq(5);
        for (let num of numbers2) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(5,9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: 4 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(−3,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: 5 },
      });
    });
    cy.get(cesc("#\\/P2")).should("contain.text", "(−6,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(4,2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(3);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2.length).eq(5);
        for (let num of numbers2) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(9,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(3);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });
  });

  it("triggerWhen supercedes chaining", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>

    $P.coords{assignNames="P2"}

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs"  triggerWith="addPoint" triggerWhen="$(P.x)<0 and $(P.y)<0" >
      <label>roll dice and add point</label>
    </callAction></p>

    <callAction name="addPoint" target="g" actionName="addChildren" triggerWhen="$(P.x)>0 and $(P.y)>0" >
      <label>add point</label>
      <point>(3,4)</point>
    </callAction>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/P2")).should("contain.text", "(−1,2)");
    cy.get(cesc("#\\/rs")).should("not.exist");
    cy.get(cesc("#\\/addPoint")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    });

    let numbers;

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        numbers = text.split(",").map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -1, y: -7 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(−1,−7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2.length).eq(5);
        for (let num of numbers2) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: -4 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(3,−4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 7 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(1,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 9 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(5,9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -3, y: -4 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(−3,−4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2.length).eq(5);
        for (let num of numbers2) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
        numbers = numbers2;
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -6, y: -5 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(−6,−5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(2);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 2 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(4,2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(3);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 7 },
      });
    });

    cy.get(cesc("#\\/P2")).should("contain.text", "(9,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(3);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2).eqls(numbers);
      });
  });

  it("triggerSet", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

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
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/rs")).should("not.exist");
    cy.get(cesc("#\\/addPoint")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    });

    let numbers;

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        numbers = text.split(",").map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
      });

    cy.get(cesc("#\\/tset_button")).click();

    cy.get(cesc("#\\/p2")).should("contain.text", "(3,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(
        (x) => x.componentName,
      );
      expect(pointNames.length).eq(2);
      expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4]);

      await win.callAction1({
        actionName: "movePoint",
        componentName: pointNames[1],
        args: { x: -2, y: 5 },
      });
    });

    cy.get(cesc("#\\/p2")).should("contain.text", "(−2,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(
        (x) => x.componentName,
      );
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2.length).eq(5);
        for (let num of numbers2) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
      });
  });

  it("triggerSet and chain to callAction", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p>points from graph: <collect componentTypes="point" target="g" prop="coords" assignNames="p1 p2 p3" /></p>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

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

    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/rs")).should("not.exist");
    cy.get(cesc("#\\/addPoint")).should("not.exist");
    cy.get(cesc("#\\/sub")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let mathinputName =
        stateVariables["/ans"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = cesc2("#" + mathinputName) + " textarea";
      let mathinputSubmitAnchor = cesc2("#" + mathinputName + "_submit");
      let mathinputCorrectAnchor = cesc2("#" + mathinputName + "_correct");
      let mathinputIncorrectAnchor = cesc2("#" + mathinputName + "_incorrect");
      let mathinputPartialAnchor = cesc2("#" + mathinputName + "_partial");

      cy.get(mathinputAnchor).type(`x`, { force: true });

      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinputCorrectAnchor).should("not.exist");
      cy.get(mathinputIncorrectAnchor).should("not.exist");
      cy.get(mathinputPartialAnchor).should("not.exist");

      expect(g.stateValues.graphicalDescendants.length).eq(1);

      let numbers;

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          numbers = text.split(",").map(Number);
          expect(numbers.length).eq(5);
          for (let num of numbers) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
          }
        });

      cy.get(cesc("#\\/tset_button")).click();

      cy.get(cesc("#\\/p2")).should("contain.text", "(3,4)");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables["/g"];

        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(pointNames.length).eq(2);
        expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4]);

        await win.callAction1({
          actionName: "movePoint",
          componentName: pointNames[1],
          args: { x: -2, y: 5 },
        });
      });

      cy.get(cesc("#\\/p2")).should("contain.text", "(−2,5)");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let g = stateVariables["/g"];

        let pointNames = g.stateValues.graphicalDescendants.map(
          (x) => x.componentName,
        );
        expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);
      });

      cy.get(cesc("#\\/nums"))
        .invoke("text")
        .then((text) => {
          let numbers2 = text.split(",").map(Number);
          expect(numbers2.length).eq(5);
          for (let num of numbers2) {
            expect(Number.isInteger(num)).be.true;
            expect(num).gte(1);
            expect(num).lte(6);
          }
          expect(numbers2).not.eqls(numbers);
        });

      cy.get(mathinputSubmitAnchor).should("not.exist");
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinputIncorrectAnchor).should("not.exist");
      cy.get(mathinputPartialAnchor).should("not.exist");
    });
  });

  it("chaining with updateValue", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
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


    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/addPoint")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g = stateVariables["/g"];
      expect(g.stateValues.graphicalDescendants.length).eq(1);
    });

    let numbers;

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        numbers = text.split(",").map(Number);
        expect(numbers.length).eq(5);
        for (let num of numbers) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
      });
    cy.get(cesc("#\\/n")).should("have.text", "1");

    cy.get(cesc("#\\/rs_button")).click();

    cy.get(cesc("#\\/p2")).should("contain.text", "(3,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(
        (x) => x.componentName,
      );
      expect(pointNames.length).eq(2);
      expect(stateVariables[pointNames[0]].stateValues.xs).eqls([1, 2]);
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([3, 4]);

      await win.callAction1({
        actionName: "movePoint",
        componentName: pointNames[1],
        args: { x: -2, y: 5 },
      });
    });

    cy.get(cesc("#\\/p2")).should("contain.text", "(−2,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g = stateVariables["/g"];

      let pointNames = g.stateValues.graphicalDescendants.map(
        (x) => x.componentName,
      );
      expect(stateVariables[pointNames[1]].stateValues.xs).eqls([-2, 5]);
    });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2.length).eq(5);
        for (let num of numbers2) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
      });

    cy.get(cesc("#\\/n")).should("have.text", "2");
  });

  it("math in label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="rs" ><label>Hi <m>\\sum_{i=1}^5x_i</m></label></callAction></p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/rs")).should("contain.text", "Hi ∑5i=1xi");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/rs"].stateValues.label).eq(
        "Hi \\(\\sum_{i=1}^5x_i\\)",
      );
    });
  });

  it("label is name", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="resample" name="resample_numbers" labelIsName /></p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/resample_numbers")).should(
      "contain.text",
      "resample numbers",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/resample_numbers"].stateValues.label).eq(
        "resample numbers",
      );
    });
  });

  it("case insensitive action name", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="nums"><aslist><sampleRandomNumbers name="s" numSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction target="s" actionName="reSamplE" name="rs"><label>roll dice</label></callAction></p>
    <p>Sum: <number name="sum"><sum>
      <map>
        <template><number>$v*10^($i-1)</number></template>
        <sources alias="v" indexAlias="i">$s</sources>
      </map>
    </sum></number></p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let numbers,
      sum = 0;

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        numbers = text.split(",").map(Number);
        expect(numbers.length).eq(5);
        for (let [ind, num] of numbers.entries()) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
          sum += num * 10 ** ind;
        }
      });
    cy.get(cesc("#\\/sum"))
      .invoke("text")
      .then((text) => {
        let sum2 = Number(text);
        expect(sum2).eq(sum);
      });

    // main purpose of sum is to make sure wait until recalculation has occured
    cy.get(cesc("#\\/rs_button"))
      .click()
      .then(() => {
        cy.get(cesc("#\\/sum")).should("not.contain", sum.toString());
      });

    cy.get(cesc("#\\/nums"))
      .invoke("text")
      .then((text) => {
        let numbers2 = text.split(",").map(Number);
        expect(numbers2.length).eq(5);
        for (let num of numbers2) {
          expect(Number.isInteger(num)).be.true;
          expect(num).gte(1);
          expect(num).lte(6);
        }
        expect(numbers2).not.eqls(numbers);
      });
  });

  it("callaction in graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph >
      <callaction anchor="$anchorCoords1" name="callaction1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1" target="_graph1" actionName="addChildren">
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
    <p name="pFixed1">Fixed 1: $fixed1</p>
    <p name="pFixed2">Fixed 2: $fixed2</p>
    <p>Change fixed 1 <booleanInput name="fixed1" prefill="false" /></p>
    <p>Change fixed 2 <booleanInput name="fixed2" bindValueTo="$callaction2.fixed" /></p>
    <p name="pFixLocation1">FixLocation 1: $fixLocation1</p>
    <p name="pFixLocation2">FixLocation 2: $fixLocation2</p>
    <p>Change fixLocation 1 <booleanInput name="fixLocation1" prefill="false" /></p>
    <p>Change fixLocation 2 <booleanInput name="fixLocation2" bindValueTo="$callaction2.fixLocation" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    `,
        },
        "*",
      );
    });

    // TODO: how to click on the buttons and test if they are disabled?

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: upperright",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: center",
    );
    cy.get(cesc("#\\/positionFromAnchor1")).should("have.value", "1");
    cy.get(cesc("#\\/positionFromAnchor2")).should("have.value", "9");
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: true");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: true");

    cy.log("move callactions by dragging");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction1",
        args: { x: -2, y: 3 },
      });
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction2",
        args: { x: 4, y: -5 },
      });
    });

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should(
      "contain.text",
      "(4,−5)",
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,−5)");

    cy.log("move callactions by entering coordinates");

    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(6,7){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(8,9){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should("contain.text", "(8,9)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");

    cy.log("change position from anchor");
    cy.get(cesc("#\\/positionFromAnchor1")).select("lowerLeft");
    cy.get(cesc("#\\/positionFromAnchor2")).select("lowerRight");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: lowerleft",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("make not draggable");

    cy.get(cesc("#\\/draggable1")).click();
    cy.get(cesc("#\\/draggable2")).click();
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: false");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: false");

    cy.log("cannot move callactions by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction1",
        args: { x: -10, y: -9 },
      });
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction2",
        args: { x: -8, y: -7 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");

    cy.log("make draggable again");

    cy.get(cesc("#\\/draggable1")).click();
    cy.get(cesc("#\\/draggable2")).click();
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: true");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: true");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction1",
        args: { x: -10, y: -9 },
      });
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction2",
        args: { x: -8, y: -7 },
      });
    });

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should(
      "contain.text",
      "(−8,−7)",
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−10,−9)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("fix location");

    cy.get(cesc("#\\/fixLocation1")).click();
    cy.get(cesc("#\\/fixLocation2")).click();
    cy.get(cesc("#\\/pFixLocation1")).should(
      "have.text",
      "FixLocation 1: true",
    );
    cy.get(cesc("#\\/pFixLocation2")).should(
      "have.text",
      "FixLocation 2: true",
    );

    cy.log("can change coordinates entering coordinates only for button 1");

    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(3,4){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(1,2){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("cannot move callactions by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction1",
        args: { x: 4, y: 6 },
      });
      win.callAction1({
        actionName: "moveButton",
        componentName: "/callaction2",
        args: { x: 7, y: 8 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "false");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("can change position from anchor only for button 1");
    cy.get(cesc("#\\/positionFromAnchor2")).select("bottom");
    cy.get(cesc("#\\/positionFromAnchor1")).select("top");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: top",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("can change disabled attribute");
    cy.get(cesc("#\\/disabled1")).click();
    cy.get(cesc("#\\/disabled2")).click();
    cy.get(cesc("#\\/pDisabled1")).should("have.text", "Disabled 1: false");
    cy.get(cesc("#\\/pDisabled2")).should("have.text", "Disabled 2: true");

    cy.log("make completely fixed");
    cy.get(cesc("#\\/fixed1")).click();
    cy.get(cesc("#\\/fixed2")).click();
    cy.get(cesc("#\\/pFixed1")).should("have.text", "Fixed 1: true");
    cy.get(cesc("#\\/pFixed2")).should("have.text", "Fixed 2: true");

    cy.log("can change coordinates entering coordinates only for button 1");

    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(7,8){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(5,6){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow").should("contain.text", "(5,6)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("can change position from anchor only for button 1");
    cy.get(cesc("#\\/positionFromAnchor2")).select("left");
    cy.get(cesc("#\\/positionFromAnchor1")).select("right");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: right",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("can change disabled attribute only for button 1");
    cy.get(cesc("#\\/disabled2")).click();
    cy.get(cesc("#\\/disabled1")).click();
    cy.get(cesc("#\\/pDisabled1")).should("have.text", "Disabled 1: true");
    cy.get(cesc("#\\/pDisabled2")).should("have.text", "Disabled 2: true");
  });
});
