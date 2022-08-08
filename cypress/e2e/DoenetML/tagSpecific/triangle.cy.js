import me from 'math-expressions';

describe('Triangle Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('triangle with no children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle/>
    <copy name="vertex1" prop="vertex1" target="_triangle1" />
    <copy name="vertex2" prop="vertex2" target="_triangle1" />
    <copy name="vertex3" prop="vertex3" target="_triangle1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let v1x = 0, v1y = 1;
      let v2x = 1, v2y = 0;
      let v3x = 0, v3y = 0;

      let vertices = [
        stateVariables["/vertex1"].replacements[0],
        stateVariables["/vertex2"].replacements[0],
        stateVariables["/vertex3"].replacements[0],
      ]

      cy.window().then(async (win) => {
        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
          expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
        }
      })

      cy.log('move triangle up and to the right')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let moveX = 3;
        let moveY = 2;

        let desiredVertices = [];
        for (let i = 0; i < stateVariables['/_triangle1'].stateValues.nVertices; i++) {
          desiredVertices.push([
            me.fromAst(stateVariables['/_triangle1'].stateValues.vertices[i][0]).add(moveX).tree,
            me.fromAst(stateVariables['/_triangle1'].stateValues.vertices[i][1]).add(moveY).tree
          ])
        }

        await win.callAction1({
          actionName: "movePolygon",
          componentName: "/_triangle1",
          args: { pointCoords: desiredVertices }
        });

        v1x += moveX;
        v2x += moveX;
        v3x += moveX;
        v1y += moveY;
        v2y += moveY;
        v3y += moveY;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          for (let i = 0; i < vertices.length; i++) {
            expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
            expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
          }
        })
      })


      cy.log('move each point')
      cy.window().then(async (win) => {

        v1x = 7, v2x = -5, v3x = -1;
        v1y = -4, v2y = -9, v3y = 8;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          await win.callAction1({
            actionName: "movePoint",
            componentName: vertices[i].componentName,
            args: { x: pxs[i], y: pys[i] }
          })
        }
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          for (let i = 0; i < 3; i++) {
            expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
            expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
          }
        })

      })
    })

  })

  it('triangle with empty vertices', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle vertices="" />
    <copy name="vertex1" prop="vertex1" target="_triangle1" />
    <copy name="vertex2" prop="vertex2" target="_triangle1" />
    <copy name="vertex3" prop="vertex3" target="_triangle1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let v1x = 0, v1y = 1;
      let v2x = 1, v2y = 0;
      let v3x = 0, v3y = 0;

      let vertices = [
        stateVariables["/vertex1"].replacements[0],
        stateVariables["/vertex2"].replacements[0],
        stateVariables["/vertex3"].replacements[0],
      ]

      cy.window().then(async (win) => {
        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
          expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
        }
      })

      cy.log('move triangle up and to the right')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let moveX = 3;
        let moveY = 2;

        let desiredVertices = [];
        for (let i = 0; i < stateVariables['/_triangle1'].stateValues.nVertices; i++) {
          desiredVertices.push([
            me.fromAst(stateVariables['/_triangle1'].stateValues.vertices[i][0]).add(moveX).tree,
            me.fromAst(stateVariables['/_triangle1'].stateValues.vertices[i][1]).add(moveY).tree
          ])
        }

        await win.callAction1({
          actionName: "movePolygon",
          componentName: "/_triangle1",
          args: { pointCoords: desiredVertices }
        });

        v1x += moveX;
        v2x += moveX;
        v3x += moveX;
        v1y += moveY;
        v2y += moveY;
        v3y += moveY;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          for (let i = 0; i < vertices.length; i++) {
            expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
            expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
          }
        })
      })


      cy.log('move each point')
      cy.window().then(async (win) => {

        v1x = 7, v2x = -5, v3x = -1;
        v1y = -4, v2y = -9, v3y = 8;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          await win.callAction1({
            actionName: "movePoint",
            componentName: vertices[i].componentName,
            args: { x: pxs[i], y: pys[i] }
          })
        }

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          for (let i = 0; i < 3; i++) {
            expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
            expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
          }
        })
      })
    })

  })

  it('triangle with one vertex specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle vertices="(-8,5)" />
    <copy name="vertex1" prop="vertex1" target="_triangle1" />
    <copy name="vertex2" prop="vertex2" target="_triangle1" />
    <copy name="vertex3" prop="vertex3" target="_triangle1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let v1x = -8, v1y = 5;
      let v2x = 1, v2y = 0;
      let v3x = 0, v3y = 0;

      let vertices = [
        stateVariables["/vertex1"].replacements[0],
        stateVariables["/vertex2"].replacements[0],
        stateVariables["/vertex3"].replacements[0],
      ]

      cy.window().then(async (win) => {
        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
          expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
        }
      })

      cy.log('move triangle up and to the right')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let moveX = 3;
        let moveY = 2;

        let desiredVertices = [];
        for (let i = 0; i < stateVariables['/_triangle1'].stateValues.nVertices; i++) {
          desiredVertices.push([
            me.fromAst(stateVariables['/_triangle1'].stateValues.vertices[i][0]).add(moveX).tree,
            me.fromAst(stateVariables['/_triangle1'].stateValues.vertices[i][1]).add(moveY).tree
          ])
        }

        await win.callAction1({
          actionName: "movePolygon",
          componentName: "/_triangle1",
          args: { pointCoords: desiredVertices }
        });

        v1x += moveX;
        v2x += moveX;
        v3x += moveX;
        v1y += moveY;
        v2y += moveY;
        v3y += moveY;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          for (let i = 0; i < vertices.length; i++) {
            expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
            expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
          }
        })

      })


      cy.log('move each point')
      cy.window().then(async (win) => {

        v1x = 7, v2x = -5, v3x = -1;
        v1y = -4, v2y = -9, v3y = 8;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          await win.callAction1({
            actionName: "movePoint",
            componentName: vertices[i].componentName,
            args: { x: pxs[i], y: pys[i] }
          })
        }

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          for (let i = 0; i < 3; i++) {
            expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
            expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
          }
        })
      })
    })

  })

  it('triangle with two vertices specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle vertices="(-8,5) (6,2)" />
    <copy name="vertex1" prop="vertex1" target="_triangle1" />
    <copy name="vertex2" prop="vertex2" target="_triangle1" />
    <copy name="vertex3" prop="vertex3" target="_triangle1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let v1x = -8, v1y = 5;
      let v2x = 6, v2y = 2;
      let v3x = 0, v3y = 0;

      let vertices = [
        stateVariables["/vertex1"].replacements[0],
        stateVariables["/vertex2"].replacements[0],
        stateVariables["/vertex3"].replacements[0],
      ]

      cy.window().then(async (win) => {
        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
          expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
        }
      })

      cy.log('move triangle up and to the right')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let moveX = 3;
        let moveY = 2;

        let desiredVertices = [];
        for (let i = 0; i < stateVariables['/_triangle1'].stateValues.nVertices; i++) {
          desiredVertices.push([
            me.fromAst(stateVariables['/_triangle1'].stateValues.vertices[i][0]).add(moveX).tree,
            me.fromAst(stateVariables['/_triangle1'].stateValues.vertices[i][1]).add(moveY).tree
          ])
        }

        await win.callAction1({
          actionName: "movePolygon",
          componentName: "/_triangle1",
          args: { pointCoords: desiredVertices }
        });

        v1x += moveX;
        v2x += moveX;
        v3x += moveX;
        v1y += moveY;
        v2y += moveY;
        v3y += moveY;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          for (let i = 0; i < vertices.length; i++) {
            expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
            expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
          }
        })

      })


      cy.log('move each point')
      cy.window().then(async (win) => {

        v1x = 7, v2x = -5, v3x = -1;
        v1y = -4, v2y = -9, v3y = 8;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          await win.callAction1({
            actionName: "movePoint",
            componentName: vertices[i].componentName,
            args: { x: pxs[i], y: pys[i] }
          })
        }

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          for (let i = 0; i < 3; i++) {
            expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
            expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
          }
        })

      })
    })

  })

  it('triangle with three vertices specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle vertices="(-8,5) (6,2) (5,-4)" />
    <copy name="vertex1" prop="vertex1" target="_triangle1" />
    <copy name="vertex2" prop="vertex2" target="_triangle1" />
    <copy name="vertex3" prop="vertex3" target="_triangle1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let v1x = -8, v1y = 5;
      let v2x = 6, v2y = 2;
      let v3x = 5, v3y = -4;

      let vertices = [
        stateVariables["/vertex1"].replacements[0],
        stateVariables["/vertex2"].replacements[0],
        stateVariables["/vertex3"].replacements[0],
      ]

      cy.window().then(async (win) => {
        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
          expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
        }
      })

      cy.log('move triangle up and to the right')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let moveX = 3;
        let moveY = 2;

        let desiredVertices = [];
        for (let i = 0; i < stateVariables['/_triangle1'].stateValues.nVertices; i++) {
          desiredVertices.push([
            me.fromAst(stateVariables['/_triangle1'].stateValues.vertices[i][0]).add(moveX).tree,
            me.fromAst(stateVariables['/_triangle1'].stateValues.vertices[i][1]).add(moveY).tree
          ])
        }

        await win.callAction1({
          actionName: "movePolygon",
          componentName: "/_triangle1",
          args: { pointCoords: desiredVertices }
        });

        v1x += moveX;
        v2x += moveX;
        v3x += moveX;
        v1y += moveY;
        v2y += moveY;
        v3y += moveY;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          for (let i = 0; i < vertices.length; i++) {
            expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
            expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
          }
        })

      })


      cy.log('move each point')
      cy.window().then(async (win) => {

        v1x = 7, v2x = -5, v3x = -1;
        v1y = -4, v2y = -9, v3y = 8;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          await win.callAction1({
            actionName: "movePoint",
            componentName: vertices[i].componentName,
            args: { x: pxs[i], y: pys[i] }
          })
        }

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          for (let i = 0; i < 3; i++) {
            expect((stateVariables['/_triangle1'].stateValues.vertices)[i]).eqls([pxs[i], pys[i]]);
            expect((stateVariables[vertices[i].componentName].stateValues.coords)).eqls(['vector', pxs[i], pys[i]]);
          }
        })

      })
    })

  })

  it('copy triangle and overwrite vertices', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <group newNamespace name="g1" >
    <sideBySide widths="25% 25% 25% 25%" >
      <graph width="180" height="180">
        <triangle name="t1" />
      </graph>
      <graph width="180" height="180">
        <copy target="t1" vertices="(3,-2)" assignNames="t2" />
      </graph>
      <graph width="180" height="180">
        <copy target="t1" vertices="(5,2) (6, -1)" assignNames="t3" />
      </graph>
      <graph width="180" height="180">
        <copy target="t1" vertices="(9,0) (-4, 5) (2, -3)" assignNames="t4" />
      </graph>
    </sideBySide>
  </group>
  
  <copy target="g1" assignNames="g2" />

  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    async function checkTransformedTrianglesValues({ stateVariables,
      v0x1, v0y1, v1x1, v1y1, v2x1, v2y1,
      v0x2, v0y2,
      v0x3, v0y3, v1x3, v1y3,
      v0x4, v0y4, v1x4, v1y4, v2x4, v2y4,
    }) {

      let v1s = [[v0x1, v0y1], [v1x1, v1y1], [v2x1, v2y1]];
      let v2s = [[v0x2, v0y2], [v1x1, v1y1], [v2x1, v2y1]];
      let v3s = [[v0x3, v0y3], [v1x3, v1y3], [v2x1, v2y1]];
      let v4s = [[v0x4, v0y4], [v1x4, v1y4], [v2x4, v2y4]];

      expect((stateVariables['/g1/t1'].stateValues.vertices).map(y => y)).eqls(v1s);
      expect((stateVariables['/g2/t1'].stateValues.vertices).map(y => y)).eqls(v1s);

      expect((stateVariables['/g1/t2'].stateValues.vertices).map(y => y)).eqls(v2s);
      expect((stateVariables['/g2/t2'].stateValues.vertices).map(y => y)).eqls(v2s);

      expect((stateVariables['/g1/t3'].stateValues.vertices).map(y => y)).eqls(v3s);
      expect((stateVariables['/g2/t3'].stateValues.vertices).map(y => y)).eqls(v3s);

      expect((stateVariables['/g1/t4'].stateValues.vertices).map(y => y)).eqls(v4s);
      expect((stateVariables['/g2/t4'].stateValues.vertices).map(y => y)).eqls(v4s);

    }


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let v0x1 = 0, v0y1 = 1, v1x1 = 1, v1y1 = 0, v2x1 = 0, v2y1 = 0;
      let v0x2 = 3, v0y2 = -2;
      let v0x3 = 5, v0y3 = 2, v1x3 = 6, v1y3 = -1;
      let v0x4 = 9, v0y4 = 0, v1x4 = -4, v1y4 = 5, v2x4 = 2, v2y4 = -3;


      await checkTransformedTrianglesValues({
        stateVariables,
        v0x1, v0y1, v1x1, v1y1, v2x1, v2y1,
        v0x2, v0y2,
        v0x3, v0y3, v1x3, v1y3,
        v0x4, v0y4, v1x4, v1y4, v2x4, v2y4,
      })


      cy.log('move g1/t1 up and to the right')
      cy.window().then(async (win) => {

        let dx = 3, dy = 2;

        v0x1 += dx;
        v1x1 += dx;
        v2x1 += dx;
        v0y1 += dy;
        v1y1 += dy;
        v2y1 += dy;

        await win.callAction1({
          actionName: "movePolygon",
          componentName: "/g1/t1",
          args: { pointCoords: [[v0x1, v0y1], [v1x1, v1y1], [v2x1, v2y1]] }
        });

        let stateVariables = await win.returnAllStateVariables1();

        await checkTransformedTrianglesValues({
          stateVariables,
          v0x1, v0y1, v1x1, v1y1, v2x1, v2y1,
          v0x2, v0y2,
          v0x3, v0y3, v1x3, v1y3,
          v0x4, v0y4, v1x4, v1y4, v2x4, v2y4,
        })
      })


      cy.log('move vertices of g2/t1 independently')
      cy.window().then(async (win) => {

        v0x1 = 7;
        v1x1 = -5;
        v2x1 = -1;
        v0y1 = -4;
        v1y1 = -9;
        v2y1 = 8;

        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g2/t1',
          args: { pointCoords: { 0: [v0x1, v0y1] } }
        });
        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g2/t1',
          args: { pointCoords: { 1: [v1x1, v1y1] } }
        });
        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g2/t1',
          args: { pointCoords: { 2: [v2x1, v2y1] } }
        });

        let stateVariables = await win.returnAllStateVariables1();

        await checkTransformedTrianglesValues({
          stateVariables,
          v0x1, v0y1, v1x1, v1y1, v2x1, v2y1,
          v0x2, v0y2,
          v0x3, v0y3, v1x3, v1y3,
          v0x4, v0y4, v1x4, v1y4, v2x4, v2y4,
        })
      })



      cy.log('move g2/t2 up and to the left')
      cy.window().then(async (win) => {

        let dx = -4, dy = 1;

        v0x2 += dx;
        v1x1 += dx;
        v2x1 += dx;
        v0y2 += dy;
        v1y1 += dy;
        v2y1 += dy;

        await win.callAction1({
          actionName: "movePolygon",
          componentName: "/g2/t2",
          args: { pointCoords: [[v0x2, v0y2], [v1x1, v1y1], [v2x1, v2y1]] }
        });

        let stateVariables = await win.returnAllStateVariables1();

        await checkTransformedTrianglesValues({
          stateVariables,
          v0x1, v0y1, v1x1, v1y1, v2x1, v2y1,
          v0x2, v0y2,
          v0x3, v0y3, v1x3, v1y3,
          v0x4, v0y4, v1x4, v1y4, v2x4, v2y4,
        })
      })

      cy.log('move vertices of g1/t2 independently')
      cy.window().then(async (win) => {

        v0x2 = 1;
        v1x1 = 5;
        v2x1 = -3;
        v0y2 = 8;
        v1y1 = 4;
        v2y1 = -5;

        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g1/t2',
          args: { pointCoords: { 0: [v0x2, v0y2] } }
        });
        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g1/t2',
          args: { pointCoords: { 1: [v1x1, v1y1] } }
        });
        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g1/t2',
          args: { pointCoords: { 2: [v2x1, v2y1] } }
        });


        let stateVariables = await win.returnAllStateVariables1();
        await checkTransformedTrianglesValues({
          stateVariables,
          v0x1, v0y1, v1x1, v1y1, v2x1, v2y1,
          v0x2, v0y2,
          v0x3, v0y3, v1x3, v1y3,
          v0x4, v0y4, v1x4, v1y4, v2x4, v2y4,
        })
      })


      cy.log('move g1/t3 down and to the right')
      cy.window().then(async (win) => {

        let dx = 4, dy = -5;

        v0x3 += dx;
        v1x3 += dx;
        v2x1 += dx;
        v0y3 += dy;
        v1y3 += dy;
        v2y1 += dy;

        await win.callAction1({
          actionName: "movePolygon",
          componentName: "/g1/t3",
          args: { pointCoords: [[v0x3, v0y3], [v1x3, v1y3], [v2x1, v2y1]] }
        });

        let stateVariables = await win.returnAllStateVariables1();

        await checkTransformedTrianglesValues({
          stateVariables,
          v0x1, v0y1, v1x1, v1y1, v2x1, v2y1,
          v0x2, v0y2,
          v0x3, v0y3, v1x3, v1y3,
          v0x4, v0y4, v1x4, v1y4, v2x4, v2y4,
        })
      })



      cy.log('move vertices of g2/t3 independently')
      cy.window().then(async (win) => {

        v0x3 = 0;
        v1x3 = 8;
        v2x1 = 9;
        v0y3 = 0;
        v1y3 = -6;
        v2y1 = -5;

        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g2/t3',
          args: { pointCoords: { 0: [v0x3, v0y3] } }
        });
        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g2/t3',
          args: { pointCoords: { 1: [v1x3, v1y3] } }
        });
        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g2/t3',
          args: { pointCoords: { 2: [v2x1, v2y1] } }
        });

        let stateVariables = await win.returnAllStateVariables1();
        await checkTransformedTrianglesValues({
          stateVariables,
          v0x1, v0y1, v1x1, v1y1, v2x1, v2y1,
          v0x2, v0y2,
          v0x3, v0y3, v1x3, v1y3,
          v0x4, v0y4, v1x4, v1y4, v2x4, v2y4,
        })

      })



      cy.log('move g2/t4 down and to the left')
      cy.window().then(async (win) => {

        let dx = -7, dy = -8;

        v0x4 += dx;
        v1x4 += dx;
        v2x4 += dx;
        v0y4 += dy;
        v1y4 += dy;
        v2y4 += dy;

        await win.callAction1({
          actionName: "movePolygon",
          componentName: "/g2/t4",
          args: { pointCoords: [[v0x4, v0y4], [v1x4, v1y4], [v2x4, v2y4]] }
        });


        let stateVariables = await win.returnAllStateVariables1();
        await checkTransformedTrianglesValues({
          stateVariables,
          v0x1, v0y1, v1x1, v1y1, v2x1, v2y1,
          v0x2, v0y2,
          v0x3, v0y3, v1x3, v1y3,
          v0x4, v0y4, v1x4, v1y4, v2x4, v2y4,
        })
      })

      cy.log('move vertices of g1/t4 independently')
      cy.window().then(async (win) => {

        v0x4 = -7;
        v1x4 = 0;
        v2x4 = 4;
        v0y4 = 0;
        v1y4 = -8;
        v2y4 = 6;

        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g1/t4',
          args: { pointCoords: { 0: [v0x4, v0y4] } }
        });
        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g1/t4',
          args: { pointCoords: { 1: [v1x4, v1y4] } }
        });
        await win.callAction1({
          actionName: "movePolygon",
          componentName: '/g1/t4',
          args: { pointCoords: { 2: [v2x4, v2y4] } }
        });

        let stateVariables = await win.returnAllStateVariables1();
        await checkTransformedTrianglesValues({
          stateVariables,
          v0x1, v0y1, v1x1, v1y1, v2x1, v2y1,
          v0x2, v0y2,
          v0x3, v0y3, v1x3, v1y3,
          v0x4, v0y4, v1x4, v1y4, v2x4, v2y4,
        })
      })


    })

  })

  it('constrain to triangle', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle vertices="(0,0) (6,0) (0,6)" />
    <point x="10" y="10">
      <constraints>
      <constrainTo><copy target="_triangle1" /></constrainTo>
      </constraints>
    </point>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([0, 0]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([6, 0]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([0, 6]);
      expect(stateVariables['/_point1'].stateValues.xs[0]).eq(3);
      expect(stateVariables['/_point1'].stateValues.xs[1]).eq(3);


    })

    cy.log("move point upper left")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -3, y: 8 }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(0);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(6);
      })
    })

    cy.log("move point to left")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: 4 }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(0);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(4);
      })
    })

    cy.log("move point to lower left")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -7, y: -3 }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(0);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(0);
      })
    })

    cy.log("move point to lower right")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: -8 }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_point1'].stateValues.xs[0]).eq(6);
        expect(stateVariables['/_point1'].stateValues.xs[1]).eq(0);
      })
    })

    cy.log("move point to right")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: 4 }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(5, 1E-14);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(1, 1E-14);
      })
    })

    cy.log("move point to middle")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.5, y: 3.5 }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(2, 1E-14);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(4, 1E-14);
      })
    })

    cy.log("move point a little left")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1, y: 3 }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(0, 1E-14);
        expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(3, 1E-14);
      })
    })


  })

  it('reflect triangle via individual vertices', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle vertices="(1,2) (3,4) (-5,6)" />

  <triangle vertices="($(_triangle1.vertexX1_2), $(_triangle1.vertexX1_1)) ($(_triangle1.vertexX2_2), $(_triangle1.vertexX2_1)) $flip3" />
  </graph>

  <point name="flip3">
    (<extract prop="y"><copy prop="vertex3" target="_triangle1" /></extract>,
    <extract prop="x"><copy prop="vertex3" target="_triangle1" /></extract>)
  </point>

  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([1, 2]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([3, 4]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([-5, 6]);
      expect((stateVariables['/_triangle2'].stateValues.vertices)[0]).eqls([2, 1]);
      expect((stateVariables['/_triangle2'].stateValues.vertices)[1]).eqls([4, 3]);
      expect((stateVariables['/_triangle2'].stateValues.vertices)[2]).eqls([6, -5]);
    })

    cy.log('move first triangle verticies')
    cy.window().then(async (win) => {

      let x1 = 8, y1 = -1;
      let x2 = 0, y2 = -5;
      let x3 = 7, y3 = 9;

      let vertices = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
      ];

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/_triangle1",
        args: { pointCoords: vertices }
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([x1, y1]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([x2, y2]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([x3, y3]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[0]).eqls([y1, x1]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[1]).eqls([y2, x2]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[2]).eqls([y3, x3]);
      })
    })

    cy.log('move second triangle verticies')
    cy.window().then(async (win) => {

      let x1 = -5, y1 = 2;
      let x2 = -8, y2 = 9;
      let x3 = 3, y3 = -6;

      let vertices = [
        [y1, x1],
        [y2, x2],
        [y3, x3],
      ];

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/_triangle2",
        args: { pointCoords: vertices }
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([x1, y1]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([x2, y2]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([x3, y3]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[0]).eqls([y1, x1]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[1]).eqls([y2, x2]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[2]).eqls([y3, x3]);
      })
    })

  })

  it('reflect triangle via individual vertices, one vertex specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle vertices="(1,2)" />

  <triangle vertices="($(_triangle1.vertexX1_2), $(_triangle1.vertexX1_1)) ($(_triangle1.vertexX2_2), $(_triangle1.vertexX2_1)) $flip3" />
  </graph>

  <point name="flip3">
    (<extract prop="y"><copy prop="vertex3" target="_triangle1" /></extract>,
    <extract prop="x"><copy prop="vertex3" target="_triangle1" /></extract>)
  </point>

  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([1, 2]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([1, 0]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([0, 0]);
      expect((stateVariables['/_triangle2'].stateValues.vertices)[0]).eqls([2, 1]);
      expect((stateVariables['/_triangle2'].stateValues.vertices)[1]).eqls([0, 1]);
      expect((stateVariables['/_triangle2'].stateValues.vertices)[2]).eqls([0, 0]);
    })

    cy.log('move first triangle verticies')
    cy.window().then(async (win) => {

      let x1 = 8, y1 = -1;
      let x2 = 0, y2 = -5;
      let x3 = 7, y3 = 9;

      let vertices = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
      ];

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/_triangle1",
        args: { pointCoords: vertices }
      });

      cy.log('move first triangle verticies')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([x1, y1]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([x2, y2]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([x3, y3]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[0]).eqls([y1, x1]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[1]).eqls([y2, x2]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[2]).eqls([y3, x3]);
      })
    })

    cy.log('move second triangle verticies')
    cy.window().then(async (win) => {

      let x1 = -5, y1 = 2;
      let x2 = -8, y2 = 9;
      let x3 = 3, y3 = -6;

      let vertices = [
        [y1, x1],
        [y2, x2],
        [y3, x3],
      ];

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/_triangle2",
        args: { pointCoords: vertices }
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([x1, y1]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([x2, y2]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([x3, y3]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[0]).eqls([y1, x1]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[1]).eqls([y2, x2]);
        expect((stateVariables['/_triangle2'].stateValues.vertices)[2]).eqls([y3, x3]);
      })
    })

  })

  it('triangle with one vertex refection of other', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point name="A" hide>
    (<copy prop="y" target="B" />,
    <copy prop="x" target="B" />)
  </point>
  <point name="B" hide>(3,5)</point>
  <point name="C" hide>(-5,2)</point>
  <triangle vertices="$A $B $C" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([5, 3]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([3, 5]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([-5, 2]);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: '/_triangle1',
        args: { pointCoords: { 0: [-1, 4] } }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([-1, 4]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([4, -1]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([-5, 2]);
      })
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: '/_triangle1',
        args: { pointCoords: { 1: [7, -8] } }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([-8, 7]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([7, -8]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([-5, 2]);
      })
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: '/_triangle1',
        args: { pointCoords: { 2: [0, 6] } }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([-8, 7]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([7, -8]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([0, 6]);
      })
    })

  })

  it('triangle with one vertex refection of other with internal references', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle vertices="($(_triangle1.vertexX2_2), $(_triangle1.vertexX2_1)) (3,5) (-5,2)" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([5, 3]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([3, 5]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([-5, 2]);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: '/_triangle1',
        args: { pointCoords: { 0: [-1, 4] } }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([-1, 4]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([4, -1]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([-5, 2]);
      })
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: '/_triangle1',
        args: { pointCoords: { 1: [7, -8] } }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([-8, 7]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([7, -8]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([-5, 2]);
      })
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: '/_triangle1',
        args: { pointCoords: { 2: [0, 6] } }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([-8, 7]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([7, -8]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([0, 6]);
      })
    })

  })

  it('triangle with one vertex refection of other with internal references, one vertex specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle vertices="($(_triangle1.vertexX2_2), $(_triangle1.vertexX2_1))" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([0, 1]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([1, 0]);
      expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([0, 0]);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: '/_triangle1',
        args: { pointCoords: { 0: [-1, 4] } }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([-1, 4]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([4, -1]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([0, 0]);
      })
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: '/_triangle1',
        args: { pointCoords: { 1: [7, -8] } }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([-8, 7]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([7, -8]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([0, 0]);
      })
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: '/_triangle1',
        args: { pointCoords: { 2: [0, 6] } }
      });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_triangle1'].stateValues.vertices)[0]).eqls([-8, 7]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[1]).eqls([7, -8]);
        expect((stateVariables['/_triangle1'].stateValues.vertices)[2]).eqls([0, 6]);
      })
    })

  })


});