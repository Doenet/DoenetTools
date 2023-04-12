import { cesc } from '../../../../src/_utils/url';

describe('Graph Reference Test 2', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })

  it('graph referenced multiple ways 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sbsgroup>
    <sideBySide>
    <graph width="150px" height="150px" name="graph1">
    <vector head="(-4,2)" tail="(3,5)" />
    </graph>
  
    <graph width="150px" height="150px" name="graph2">
    <copy prop="tail" target="_vector1" />
    <copy prop="head" target="_vector1" />
    <copy prop="displacement" name="d1" target="_vector1" />
    <copy name="rv1" target="_vector1" />
    </graph>

    <graph width="150px" height="150px" name="graph3">
    <copy prop="tail" target="d1" />
    <copy prop="head" target="d1" />
    <copy prop="displacement" target="d1" />
    <copy target="d1" />
    </graph>
  
    <graph width="150px" height="150px" name="graph4">
    <copy prop="tail" target="rv1" />
    <copy prop="head" target="rv1" />
    <copy prop="displacement" target="rv1" />
    <copy name="rv2" target="rv1" />
    </graph>
    </sidebyside>

    <sidebyside>
    <copy width="150px" height="150px" name="graph5" target="graph1" />
    <copy width="150px" height="150px" name="graph6" target="graph2" />
    <copy width="150px" height="150px" name="graph7" target="graph3" />
    <copy width="150px" height="150px" name="graph8" target="graph4" />
    </sidebyside>

    <sidebyside>
    <copy width="150px" height="150px" name="graph9" target="graph5" />
    <copy width="150px" height="150px" name="graph10" target="graph6" />
    <copy width="150px" height="150px" name="graph11" target="graph7" />
    <copy width="150px" height="150px" name="graph12" target="graph8" />
    </sideBySide>
    </sbsgroup>

    <copy name="sbsgroup2" target="_sbsgroup1" />
  
    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // let originalVectors = [0, 2, 6]
      // let displacementsA = [1, 4];
      // let displacementsB = [3,];
      // let displacementsC = [5,];
      // let vectorShift = 7;
      // let originalTails = [1, 5];
      // let originalHeads = [2, 6];
      // let displacementTails = [3,];
      // let displacementHeads = [4,];
      // let pointShift = 6;
      // let nShifts = 6;

      let graph1 = stateVariables["/graph1"];
      let graph2 = stateVariables["/graph2"];
      let graph3 = stateVariables["/graph3"];
      let graph4 = stateVariables["/graph4"];
      let graph5 = stateVariables[stateVariables['/graph5'].replacements[0].componentName];
      let graph6 = stateVariables[stateVariables['/graph6'].replacements[0].componentName];
      let graph7 = stateVariables[stateVariables['/graph7'].replacements[0].componentName];
      let graph8 = stateVariables[stateVariables['/graph8'].replacements[0].componentName];
      let graph9 = stateVariables[stateVariables['/graph9'].replacements[0].componentName];
      let graph10 = stateVariables[stateVariables['/graph10'].replacements[0].componentName];
      let graph11 = stateVariables[stateVariables['/graph11'].replacements[0].componentName];
      let graph12 = stateVariables[stateVariables['/graph12'].replacements[0].componentName];

      let graph1A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[0].componentName];
      let graph2A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[1].componentName];
      let graph3A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[2].componentName];
      let graph4A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[3].componentName];
      let graph5A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[1].componentName].activeChildren[0].componentName];
      let graph6A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[1].componentName].activeChildren[1].componentName];
      let graph7A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[1].componentName].activeChildren[2].componentName];
      let graph8A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[1].componentName].activeChildren[3].componentName];
      let graph9A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[2].componentName].activeChildren[0].componentName];
      let graph10A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[2].componentName].activeChildren[1].componentName];
      let graph11A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[2].componentName].activeChildren[2].componentName];
      let graph12A = stateVariables[stateVariables[stateVariables[stateVariables['/sbsgroup2'].replacements[0].componentName].activeChildren[2].componentName].activeChildren[3].componentName];

      let vectors = [
        graph1.activeChildren[0].componentName,
        graph2.activeChildren[3].componentName,
        graph4.activeChildren[3].componentName,
        graph5.activeChildren[0].componentName,
        graph6.activeChildren[3].componentName,
        graph8.activeChildren[3].componentName,
        graph9.activeChildren[0].componentName,
        graph10.activeChildren[3].componentName,
        graph12.activeChildren[3].componentName,
        graph1A.activeChildren[0].componentName,
        graph2A.activeChildren[3].componentName,
        graph4A.activeChildren[3].componentName,
        graph5A.activeChildren[0].componentName,
        graph6A.activeChildren[3].componentName,
        graph8A.activeChildren[3].componentName,
        graph9A.activeChildren[0].componentName,
        graph10A.activeChildren[3].componentName,
        graph12A.activeChildren[3].componentName,
      ];

      let displacementsA = [
        graph2.activeChildren[2].componentName,
        graph3.activeChildren[3].componentName,
        graph6.activeChildren[2].componentName,
        graph7.activeChildren[3].componentName,
        graph10.activeChildren[2].componentName,
        graph11.activeChildren[3].componentName,
        graph2A.activeChildren[2].componentName,
        graph3A.activeChildren[3].componentName,
        graph6A.activeChildren[2].componentName,
        graph7A.activeChildren[3].componentName,
        graph10A.activeChildren[2].componentName,
        graph11A.activeChildren[3].componentName,
      ];

      let displacementsB = [
        graph3.activeChildren[2].componentName,
        graph7.activeChildren[2].componentName,
        graph11.activeChildren[2].componentName,
        graph3A.activeChildren[2].componentName,
        graph7A.activeChildren[2].componentName,
        graph11A.activeChildren[2].componentName,
      ];

      let displacementsC = [
        graph4.activeChildren[2].componentName,
        graph8.activeChildren[2].componentName,
        graph12.activeChildren[2].componentName,
        graph4A.activeChildren[2].componentName,
        graph8A.activeChildren[2].componentName,
        graph12A.activeChildren[2].componentName,
      ];

      let tails = [
        graph2.activeChildren[0].componentName,
        graph4.activeChildren[0].componentName,
        graph6.activeChildren[0].componentName,
        graph8.activeChildren[0].componentName,
        graph10.activeChildren[0].componentName,
        graph12.activeChildren[0].componentName,
        graph2A.activeChildren[0].componentName,
        graph4A.activeChildren[0].componentName,
        graph6A.activeChildren[0].componentName,
        graph8A.activeChildren[0].componentName,
        graph10A.activeChildren[0].componentName,
        graph12A.activeChildren[0].componentName,
      ]

      let heads = [
        graph2.activeChildren[1].componentName,
        graph4.activeChildren[1].componentName,
        graph6.activeChildren[1].componentName,
        graph8.activeChildren[1].componentName,
        graph10.activeChildren[1].componentName,
        graph12.activeChildren[1].componentName,
        graph2A.activeChildren[1].componentName,
        graph4A.activeChildren[1].componentName,
        graph6A.activeChildren[1].componentName,
        graph8A.activeChildren[1].componentName,
        graph10A.activeChildren[1].componentName,
        graph12A.activeChildren[1].componentName,
      ]

      let displacementTails = [
        graph3.activeChildren[0].componentName,
        graph7.activeChildren[0].componentName,
        graph11.activeChildren[0].componentName,
        graph3A.activeChildren[0].componentName,
        graph7A.activeChildren[0].componentName,
        graph11A.activeChildren[0].componentName,
      ]


      let displacementHeads = [
        graph3.activeChildren[1].componentName,
        graph7.activeChildren[1].componentName,
        graph11.activeChildren[1].componentName,
        graph3A.activeChildren[1].componentName,
        graph7A.activeChildren[1].componentName,
        graph11A.activeChildren[1].componentName,
      ]

      cy.log(`check original configuration`);
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let ov_t = [3, 5];
        let ov_h = [-4, 2];
        let d = ov_h.map((x, i) => x - ov_t[i]);
        let d1_t = [0, 0];
        let d1_h = d1_t.map((x, i) => x + d[i]);
        let d2_t = [0, 0];
        let d2_h = d2_t.map((x, i) => x + d[i]);
        let d3_t = [0, 0];
        let d3_h = d3_t.map((x, i) => x + d[i]);

        for (let vector of vectors) {
          expect(stateVariables[vector].stateValues.tail).eqls([...ov_t]);
          expect(stateVariables[vector].stateValues.head).eqls([...ov_h]);
          expect(stateVariables[vector].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsA) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d1_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d1_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsB) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d2_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d2_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsC) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d3_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d3_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let tail of tails) {
          expect(stateVariables[tail].stateValues.xs).eqls([...ov_t]);
        }
        for (let head of heads) {
          expect(stateVariables[head].stateValues.xs).eqls([...ov_h]);
        }
        for (let dTail of displacementTails) {
          expect(stateVariables[dTail].stateValues.xs).eqls([...d1_t]);
        }
        for (let dHead of displacementHeads) {
          expect(stateVariables[dHead].stateValues.xs).eqls([...d1_h]);
        }
      })

      cy.log(`move an original vector`);
      cy.window().then(async (win) => {

        let ov_t = [-1, 7];
        let ov_h = [0, -2];
        let d = ov_h.map((x, i) => x - ov_t[i]);
        let d1_t = [0, 0];
        let d1_h = d1_t.map((x, i) => x + d[i]);
        let d2_t = [0, 0];
        let d2_h = d2_t.map((x, i) => x + d[i]);
        let d3_t = [0, 0];
        let d3_h = d3_t.map((x, i) => x + d[i]);

        await win.callAction1({
          actionName: "moveVector",
          componentName: vectors[8],
          args: {
            tailcoords: ov_t,
            headcoords: ov_h
          }
        })
        let stateVariables = await win.returnAllStateVariables1();

        for (let vector of vectors) {
          expect(stateVariables[vector].stateValues.tail).eqls([...ov_t]);
          expect(stateVariables[vector].stateValues.head).eqls([...ov_h]);
          expect(stateVariables[vector].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsA) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d1_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d1_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsB) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d2_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d2_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsC) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d3_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d3_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let tail of tails) {
          expect(stateVariables[tail].stateValues.xs).eqls([...ov_t]);
        }
        for (let head of heads) {
          expect(stateVariables[head].stateValues.xs).eqls([...ov_h]);
        }
        for (let dTail of displacementTails) {
          expect(stateVariables[dTail].stateValues.xs).eqls([...d1_t]);
        }
        for (let dHead of displacementHeads) {
          expect(stateVariables[dHead].stateValues.xs).eqls([...d1_h]);
        }
      })

      cy.log(`move displacementA vector`);
      cy.window().then(async (win) => {

        let d1_t = [2, 5];
        let d1_h = [7, 1];
        let d = d1_h.map((x, i) => x - d1_t[i]);

        let ov_t = [-1, 7];
        let ov_h = ov_t.map((x, i) => x + d[i]);
        let d2_t = [0, 0];
        let d2_h = d2_t.map((x, i) => x + d[i]);
        let d3_t = [0, 0];
        let d3_h = d3_t.map((x, i) => x + d[i]);

        await win.callAction1({
          actionName: "moveVector",
          componentName: displacementsA[1],
          args: {
            tailcoords: d1_t,
            headcoords: d1_h
          }
        })
        let stateVariables = await win.returnAllStateVariables1();

        for (let vector of vectors) {
          expect(stateVariables[vector].stateValues.tail).eqls([...ov_t]);
          expect(stateVariables[vector].stateValues.head).eqls([...ov_h]);
          expect(stateVariables[vector].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsA) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d1_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d1_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsB) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d2_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d2_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsC) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d3_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d3_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let tail of tails) {
          expect(stateVariables[tail].stateValues.xs).eqls([...ov_t]);
        }
        for (let head of heads) {
          expect(stateVariables[head].stateValues.xs).eqls([...ov_h]);
        }
        for (let dTail of displacementTails) {
          expect(stateVariables[dTail].stateValues.xs).eqls([...d1_t]);
        }
        for (let dHead of displacementHeads) {
          expect(stateVariables[dHead].stateValues.xs).eqls([...d1_h]);
        }
      })

      cy.log(`move displacementB vector`);
      cy.window().then(async (win) => {

        let d2_t = [-2, 3];
        let d2_h = [5, -5];
        let d = d2_h.map((x, i) => x - d2_t[i]);

        let ov_t = [-1, 7];
        let ov_h = ov_t.map((x, i) => x + d[i]);
        let d1_t = [2, 5];
        let d1_h = d1_t.map((x, i) => x + d[i]);
        let d3_t = [0, 0];
        let d3_h = d3_t.map((x, i) => x + d[i]);

        await win.callAction1({
          actionName: "moveVector",
          componentName: displacementsB[2],
          args: {
            tailcoords: d2_t,
            headcoords: d2_h
          }
        })
        let stateVariables = await win.returnAllStateVariables1();

        for (let vector of vectors) {
          expect(stateVariables[vector].stateValues.tail).eqls([...ov_t]);
          expect(stateVariables[vector].stateValues.head).eqls([...ov_h]);
          expect(stateVariables[vector].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsA) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d1_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d1_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsB) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d2_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d2_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsC) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d3_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d3_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let tail of tails) {
          expect(stateVariables[tail].stateValues.xs).eqls([...ov_t]);
        }
        for (let head of heads) {
          expect(stateVariables[head].stateValues.xs).eqls([...ov_h]);
        }
        for (let dTail of displacementTails) {
          expect(stateVariables[dTail].stateValues.xs).eqls([...d1_t]);
        }
        for (let dHead of displacementHeads) {
          expect(stateVariables[dHead].stateValues.xs).eqls([...d1_h]);
        }
      })

      cy.log(`move displacementC vector`);
      cy.window().then(async (win) => {

        let d3_t = [9, 8];
        let d3_h = [7, 4];
        let d = d3_h.map((x, i) => x - d3_t[i]);

        let ov_t = [-1, 7];
        let ov_h = ov_t.map((x, i) => x + d[i]);
        let d1_t = [2, 5];
        let d1_h = d1_t.map((x, i) => x + d[i]);
        let d2_t = [-2, 3]
        let d2_h = d2_t.map((x, i) => x + d[i]);

        await win.callAction1({
          actionName: "moveVector",
          componentName: displacementsC[5],
          args: {
            tailcoords: d3_t,
            headcoords: d3_h
          }
        })
        let stateVariables = await win.returnAllStateVariables1();

        for (let vector of vectors) {
          expect(stateVariables[vector].stateValues.tail).eqls([...ov_t]);
          expect(stateVariables[vector].stateValues.head).eqls([...ov_h]);
          expect(stateVariables[vector].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsA) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d1_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d1_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsB) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d2_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d2_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let displacement of displacementsC) {
          expect(stateVariables[displacement].stateValues.tail).eqls([...d3_t]);
          expect(stateVariables[displacement].stateValues.head).eqls([...d3_h]);
          expect(stateVariables[displacement].stateValues.displacement).eqls([...d]);
        }
        for (let tail of tails) {
          expect(stateVariables[tail].stateValues.xs).eqls([...ov_t]);
        }
        for (let head of heads) {
          expect(stateVariables[head].stateValues.xs).eqls([...ov_h]);
        }
        for (let dTail of displacementTails) {
          expect(stateVariables[dTail].stateValues.xs).eqls([...d1_t]);
        }
        for (let dHead of displacementHeads) {
          expect(stateVariables[dHead].stateValues.xs).eqls([...d1_h]);
        }
      })

    });

  });
});