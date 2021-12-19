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
    cy.visit('/cypressTest')


  })


  it('resample random numbers', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction tName="s" actionName="resample" label="roll dice" name="rs" /></p>
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

    cy.get('#\\/rs').click();
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

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <section name="theGraphs" newNamespace>
      <title>The graphs</title>
      <graph name="g">
        <point name="P">(1,2)</point>
      </graph>
      
      <copy tname="g" assignNames="g2" />
    </section>

    <copy tname="theGraphs" assignNames="theGraphs2" />

    <callAction name="addPoint" tName="theGraphs/g" actionName="addChildren" label="add point">
      <point>(3,4)</point>
    </callAction>
    <callAction name="deletePoint" tName="theGraphs/g" actionName="deleteChildren" label="delete point" number="1" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = win.state.components;

      let g1 = components["/theGraphs/g"];
      let g2 = components["/theGraphs/g2"];
      let g3 = components["/theGraphs2/g"];
      let g4 = components["/theGraphs2/g2"];

      let gs = [g1, g2, g3, g4];

      for (let g of gs) {
        expect(g.activeChildren.length).eq(1);
      }

      cy.get('#\\/addPoint').click().then(async () => {
        for (let g of gs) {
          expect(g.activeChildren.length).eq(2);
          expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
          expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        }
        await g1.activeChildren[1].movePoint({ x: -2, y: 5 })
        for (let g of gs) {
          expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([-2, 5])
        }
      })
      cy.get('#\\/addPoint').click().then(async () => {
        for (let g of gs) {
          expect(g.activeChildren.length).eq(3);
          expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
          expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([-2, 5])
          expect(g.activeChildren[2].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        }
        await g2.activeChildren[2].movePoint({ x: 7, y: -9 })
        for (let g of gs) {
          expect(g.activeChildren[2].stateValues.xs.map(x => x.tree)).eqls([7, -9])
        }
      })

      cy.get('#\\/deletePoint').click().then(async () => {
        for (let g of gs) {
          expect(g.activeChildren.length).eq(2);
          expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
          expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([-2, 5])
        }
        await g3.activeChildren[1].movePoint({ x: 1, y: 0 })
        for (let g of gs) {
          expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([1, 0])
        }
      })

      cy.get('#\\/deletePoint').click().then(async () => {
        for (let g of gs) {
          expect(g.activeChildren.length).eq(1);
          expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        }
      })

      cy.get('#\\/deletePoint').click().then(async () => {
        for (let g of gs) {
          expect(g.activeChildren.length).eq(1);
          expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        }
      })

      cy.get('#\\/addPoint').click().then(async () => {
        for (let g of gs) {
          expect(g.activeChildren.length).eq(2);
          expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
          expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        }
        await g4.activeChildren[1].movePoint({ x: 4, y: 8 })
        for (let g of gs) {
          expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([4, 8])
        }
      })

    });

  })

  it('chained actions', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction tName="s" actionName="resample" label="roll dice and add point" name="rs" /></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" triggerWithTnames="rs">
    <point>(3,4)</point>
    </callAction>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/addPoint').should("not.exist");


    cy.window().then((win) => {
      let components = win.state.components;

      let g = components["/g"];

      expect(g.activeChildren.length).eq(1);

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

      cy.get('#\\/rs').click().then(async () => {
        expect(g.activeChildren.length).eq(2);
        expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        await g.activeChildren[1].movePoint({ x: -2, y: 5 })
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([-2, 5])

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

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction tName="s" actionName="resample" label="roll dice and add point" name="rs" /></p>

    <p><number name="n">1</number></p>
    <p><updateValue label="increment number and add point" name="in" tname="n" newValue="$n+1" type="number" /></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    
    <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" triggerWithTnames="rs in">
    <point>(3,4)</point>
    </callAction>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/addPoint').should("not.exist");


    cy.window().then((win) => {
      let components = win.state.components;

      let g = components["/g"];

      expect(g.activeChildren.length).eq(1);

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
      cy.get('#\\/n').should('have.text', '1');

      cy.get('#\\/rs').click().then(async () => {
        expect(g.activeChildren.length).eq(2);
        expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        await g.activeChildren[1].movePoint({ x: -2, y: 5 })
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([-2, 5])

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

      cy.get('#\\/in').click().then(async () => {
        expect(g.activeChildren.length).eq(3);
        expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([-2, 5])
        expect(g.activeChildren[2].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        await g.activeChildren[2].movePoint({ x: 7, y: -9 })
        expect(g.activeChildren[2].stateValues.xs.map(x => x.tree)).eqls([7, -9])

        cy.get('#\\/n').should('have.text', '2');

      })

    });

  })

  it('action based on trigger', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(-1,2)</point>
    </graph>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction tName="s" actionName="resample" label="roll dice" name="rs" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" /></p>

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
    cy.get('#\\/rs').should('not.exist');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -1, y: -7 });

      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 3, y: -4 });
      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 1, y: 7 });
      cy.wait(10);  // to make sure all actions have chance to complete
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
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 5, y: 9 });
      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -3, y: 4 });
      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -6, y: 5 });
      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 4, y: 2 });
      cy.wait(10);  // to make sure all actions have chance to complete
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
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: 9, y: 7 });
      cy.get('#\\/nums').invoke('text').then(text => {
        let numbers2 = text.split(',').map(Number);
        expect(numbers2).eqls(numbers)
      });

    });
  })

  it('chained updates based on trigger', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction tName="s" actionName="resample" label="roll dice and add point" name="rs"  triggerWithTnames="addPoint" /></p>

    <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" >
    <point>(3,4)</point>
    </callAction>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then((win) => {
      let components = win.state.components;

      let g = components["/g"];

      expect(g.activeChildren.length).eq(1);

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
        await components['/P'].movePoint({ x: -1, y: -7 });
        expect(g.activeChildren.length).eq(1);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 3, y: -4 });
        expect(g.activeChildren.length).eq(1);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 1, y: 7 });
        cy.wait(10);  // to make sure all actions have chance to complete
        expect(g.activeChildren.length).eq(2);
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
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 5, y: 9 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: -3, y: 4 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: -6, y: 5 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 4, y: 2 });
        cy.wait(10);  // to make sure all actions have chance to complete
        expect(g.activeChildren.length).eq(3);
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
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 9, y: 7 });
        expect(g.activeChildren.length).eq(3);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });

      })
    });
  })

  it('triggerWhen supercedes chaining', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="P">(-1,2)</point>
    </graph>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction tName="s" actionName="resample" label="roll dice and add point" name="rs"  triggerWithTnames="addPoint" triggerWhen="$(P{prop='x'})<0 and $(P{prop='y'})<0" /></p>

    <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" triggerWhen="$(P{prop='x'})>0 and $(P{prop='y'})>0" >
    <point>(3,4)</point>
    </callAction>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then((win) => {
      let components = win.state.components;

      let g = components["/g"];

      expect(g.activeChildren.length).eq(1);

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
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: -1, y: -7 });
        cy.wait(10);  // to make sure all actions have chance to complete
        expect(g.activeChildren.length).eq(1);
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
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 3, y: -4 });
        expect(g.activeChildren.length).eq(1);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 1, y: 7 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 5, y: 9 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: -3, y: -4 });
        cy.wait(10);  // to make sure all actions have chance to complete
        expect(g.activeChildren.length).eq(2);
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
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: -6, y: -5 });
        expect(g.activeChildren.length).eq(2);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 4, y: 2 });
        expect(g.activeChildren.length).eq(3);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/P'].movePoint({ x: 9, y: 7 });
        expect(g.activeChildren.length).eq(3);
        cy.get('#\\/nums').invoke('text').then(text => {
          let numbers2 = text.split(',').map(Number);
          expect(numbers2).eqls(numbers)
        });
      })
    });
  })

  it('triggerSet', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

    <triggerSet label="perform actions" name="tset" >
      <callAction tName="s" actionName="resample" label="roll dice and add point" name="rs" />
      <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');

    cy.window().then((win) => {
      let components = win.state.components;

      let g = components["/g"];

      expect(g.activeChildren.length).eq(1);

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

      cy.get('#\\/tset').click().then(async () => {
        expect(g.activeChildren.length).eq(2);
        expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        await g.activeChildren[1].movePoint({ x: -2, y: 5 })
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([-2, 5])

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

  it('triggerSet and chain to callAction', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>

    <p>Enter x: <answer name="ans">x</answer></p>

    <triggerSet label="perform actions" name="tset" >
      <callAction tName="s" actionName="resample" label="roll dice and add point" name="rs" />
      <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" >
        <point>(3,4)</point>
      </callAction>
    </triggerSet>

    <callAction name="sub" tName="ans" actionName="submitAnswer" triggerWithTnames="tset" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/rs').should('not.exist');
    cy.get('#\\/addPoint').should('not.exist');
    cy.get('#\\/sub').should('not.exist');

    cy.window().then((win) => {
      let components = win.state.components;

      let g = components["/g"];

      let mathinputName = components['/ans'].stateValues.inputChildren[0].componentName
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


      expect(g.activeChildren.length).eq(1);

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

      cy.get('#\\/tset').click().then(async () => {
        expect(g.activeChildren.length).eq(2);
        expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        await g.activeChildren[1].movePoint({ x: -2, y: 5 })
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([-2, 5])

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


  })

  it('chaining with updateValue', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p name="nums"><aslist><sampleRandomNumbers name="s" numberOfSamples="5" type="discreteUniform" from="1" to="6" /></aslist></p>
    <p><callAction tName="s" actionName="resample" label="roll dice and more" name="rs" /></p>

    <graph name="g">
      <point name="P">(1,2)</point>
    </graph>
    

    <callAction name="addPoint" tName="g" actionName="addChildren" label="add point" triggerWithTnames="addOne">
    <point>(3,4)</point>
    </callAction>

    <p>Count: <number name="n">1</number></p>
    <updateValue name="addOne" tName="n" newValue="$n+1" type="number" triggerWithTnames="rs" />


    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/addPoint').should("not.exist");


    cy.window().then((win) => {
      let components = win.state.components;

      let g = components["/g"];

      expect(g.activeChildren.length).eq(1);

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

      cy.get('#\\/rs').click().then(async () => {
        expect(g.activeChildren.length).eq(2);
        expect(g.activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2])
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 4])
        await g.activeChildren[1].movePoint({ x: -2, y: 5 })
        expect(g.activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([-2, 5])

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

  })

});