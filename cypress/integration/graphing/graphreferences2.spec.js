describe('Graph Reference Test 2', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('graph referenced multiple ways 2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <panel columns="4">
    <graph width="150px" height="150px" name="graph1">
    <vector head="(-4,2)" tail="(3,5)" />
    </graph>
  
    <graph width="150px" height="150px" name="graph2">
    <copy prop="tail" tname="_vector1" />
    <copy prop="head" tname="_vector1" />
    <copy prop="displacement" name="d1" tname="_vector1" />
    <copy name="rv1" tname="_vector1" />
    </graph>
  
    <graph width="150px" height="150px" name="graph3">
    <copy prop="tail" tname="d1" />
    <copy prop="head" tname="d1" />
    <copy prop="displacement" tname="d1" />
    <copy tname="d1" />
    </graph>
  
    <graph width="150px" height="150px" name="graph4">
    <copy prop="tail" tname="rv1" />
    <copy prop="head" tname="rv1" />
    <copy prop="displacement" tname="rv1" />
    <copy name="rv2" tname="rv1" />
    </graph>
  
    <copy width="150px" height="150px" name="graph5" tname="graph1" />
    <copy width="150px" height="150px" name="graph6" tname="graph2" />
    <copy width="150px" height="150px" name="graph7" tname="graph3" />
    <copy width="150px" height="150px" name="graph8" tname="graph4" />
    
    <copy width="150px" height="150px" name="graph9" tname="graph5" />
    <copy width="150px" height="150px" name="graph10" tname="graph6" />
    <copy width="150px" height="150px" name="graph11" tname="graph7" />
    <copy width="150px" height="150px" name="graph12" tname="graph8" />
    </panel>
  
    <copy name="panel2" tname="_panel1" />
  
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

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

      let graph1 = components["/graph1"];
      let graph2 = components["/graph2"];
      let graph3 = components["/graph3"];
      let graph4 = components["/graph4"];
      let graph5 = components['/graph5'].replacements[0];
      let graph6 = components['/graph6'].replacements[0];
      let graph7 = components['/graph7'].replacements[0];
      let graph8 = components['/graph8'].replacements[0];
      let graph9 = components['/graph9'].replacements[0];
      let graph10 = components['/graph10'].replacements[0];
      let graph11 = components['/graph11'].replacements[0];
      let graph12 = components['/graph12'].replacements[0];

      let graph1A = components['/panel2'].replacements[0].activeChildren[0];
      let graph2A = components['/panel2'].replacements[0].activeChildren[1];
      let graph3A = components['/panel2'].replacements[0].activeChildren[2];
      let graph4A = components['/panel2'].replacements[0].activeChildren[3];
      let graph5A = components['/panel2'].replacements[0].activeChildren[4];
      let graph6A = components['/panel2'].replacements[0].activeChildren[5];
      let graph7A = components['/panel2'].replacements[0].activeChildren[6];
      let graph8A = components['/panel2'].replacements[0].activeChildren[7];
      let graph9A = components['/panel2'].replacements[0].activeChildren[8];
      let graph10A = components['/panel2'].replacements[0].activeChildren[9];
      let graph11A = components['/panel2'].replacements[0].activeChildren[10];
      let graph12A = components['/panel2'].replacements[0].activeChildren[11];

      let vectors = [
        components[graph1.stateValues.childrenToRender[0]],
        components[graph2.stateValues.childrenToRender[3]],
        components[graph4.stateValues.childrenToRender[3]],
        components[graph5.stateValues.childrenToRender[0]],
        components[graph6.stateValues.childrenToRender[3]],
        components[graph8.stateValues.childrenToRender[3]],
        components[graph9.stateValues.childrenToRender[0]],
        components[graph10.stateValues.childrenToRender[3]],
        components[graph12.stateValues.childrenToRender[3]],
        components[graph1A.stateValues.childrenToRender[0]],
        components[graph2A.stateValues.childrenToRender[3]],
        components[graph4A.stateValues.childrenToRender[3]],
        components[graph5A.stateValues.childrenToRender[0]],
        components[graph6A.stateValues.childrenToRender[3]],
        components[graph8A.stateValues.childrenToRender[3]],
        components[graph9A.stateValues.childrenToRender[0]],
        components[graph10A.stateValues.childrenToRender[3]],
        components[graph12A.stateValues.childrenToRender[3]],
      ];

      let displacementsA = [
        components[graph2.stateValues.childrenToRender[2]],
        components[graph3.stateValues.childrenToRender[3]],
        components[graph6.stateValues.childrenToRender[2]],
        components[graph7.stateValues.childrenToRender[3]],
        components[graph10.stateValues.childrenToRender[2]],
        components[graph11.stateValues.childrenToRender[3]],
        components[graph2A.stateValues.childrenToRender[2]],
        components[graph3A.stateValues.childrenToRender[3]],
        components[graph6A.stateValues.childrenToRender[2]],
        components[graph7A.stateValues.childrenToRender[3]],
        components[graph10A.stateValues.childrenToRender[2]],
        components[graph11A.stateValues.childrenToRender[3]],
      ];

      let displacementsB = [
        components[graph3.stateValues.childrenToRender[2]],
        components[graph7.stateValues.childrenToRender[2]],
        components[graph11.stateValues.childrenToRender[2]],
        components[graph3A.stateValues.childrenToRender[2]],
        components[graph7A.stateValues.childrenToRender[2]],
        components[graph11A.stateValues.childrenToRender[2]],
      ];

      let displacementsC = [
        components[graph4.stateValues.childrenToRender[2]],
        components[graph8.stateValues.childrenToRender[2]],
        components[graph12.stateValues.childrenToRender[2]],
        components[graph4A.stateValues.childrenToRender[2]],
        components[graph8A.stateValues.childrenToRender[2]],
        components[graph12A.stateValues.childrenToRender[2]],
      ];

      let tails = [
        components[graph2.stateValues.childrenToRender[0]],
        components[graph4.stateValues.childrenToRender[0]],
        components[graph6.stateValues.childrenToRender[0]],
        components[graph8.stateValues.childrenToRender[0]],
        components[graph10.stateValues.childrenToRender[0]],
        components[graph12.stateValues.childrenToRender[0]],
        components[graph2A.stateValues.childrenToRender[0]],
        components[graph4A.stateValues.childrenToRender[0]],
        components[graph6A.stateValues.childrenToRender[0]],
        components[graph8A.stateValues.childrenToRender[0]],
        components[graph10A.stateValues.childrenToRender[0]],
        components[graph12A.stateValues.childrenToRender[0]],
      ]

      let heads = [
        components[graph2.stateValues.childrenToRender[1]],
        components[graph4.stateValues.childrenToRender[1]],
        components[graph6.stateValues.childrenToRender[1]],
        components[graph8.stateValues.childrenToRender[1]],
        components[graph10.stateValues.childrenToRender[1]],
        components[graph12.stateValues.childrenToRender[1]],
        components[graph2A.stateValues.childrenToRender[1]],
        components[graph4A.stateValues.childrenToRender[1]],
        components[graph6A.stateValues.childrenToRender[1]],
        components[graph8A.stateValues.childrenToRender[1]],
        components[graph10A.stateValues.childrenToRender[1]],
        components[graph12A.stateValues.childrenToRender[1]],
      ]

      let displacementTails = [
        components[graph3.stateValues.childrenToRender[0]],
        components[graph7.stateValues.childrenToRender[0]],
        components[graph11.stateValues.childrenToRender[0]],
        components[graph3A.stateValues.childrenToRender[0]],
        components[graph7A.stateValues.childrenToRender[0]],
        components[graph11A.stateValues.childrenToRender[0]],
      ]


      let displacementHeads = [
        components[graph3.stateValues.childrenToRender[1]],
        components[graph7.stateValues.childrenToRender[1]],
        components[graph11.stateValues.childrenToRender[1]],
        components[graph3A.stateValues.childrenToRender[1]],
        components[graph7A.stateValues.childrenToRender[1]],
        components[graph11A.stateValues.childrenToRender[1]],
      ]

      cy.log(`check original configuration`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

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
          expect(vector.stateValues.tail.map(x => x.tree)).eqls([...ov_t]);
          expect(vector.stateValues.head.map(x => x.tree)).eqls([...ov_h]);
          expect(vector.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsA) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d1_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d1_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsB) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d2_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d2_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsC) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d3_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d3_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let tail of tails) {
          expect(tail.stateValues.xs.map(x => x.tree)).eqls([...ov_t]);
        }
        for (let head of heads) {
          expect(head.stateValues.xs.map(x => x.tree)).eqls([...ov_h]);
        }
        for (let dTail of displacementTails) {
          expect(dTail.stateValues.xs.map(x => x.tree)).eqls([...d1_t]);
        }
        for (let dHead of displacementHeads) {
          expect(dHead.stateValues.xs.map(x => x.tree)).eqls([...d1_h]);
        }
      })

      cy.log(`move an original vector`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let ov_t = [-1, 7];
        let ov_h = [0, -2];
        let d = ov_h.map((x, i) => x - ov_t[i]);
        let d1_t = [0, 0];
        let d1_h = d1_t.map((x, i) => x + d[i]);
        let d2_t = [0, 0];
        let d2_h = d2_t.map((x, i) => x + d[i]);
        let d3_t = [0, 0];
        let d3_h = d3_t.map((x, i) => x + d[i]);

        vectors[8].moveVector({
          tailcoords: ov_t,
          headcoords: ov_h
        })

        for (let vector of vectors) {
          expect(vector.stateValues.tail.map(x => x.tree)).eqls([...ov_t]);
          expect(vector.stateValues.head.map(x => x.tree)).eqls([...ov_h]);
          expect(vector.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsA) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d1_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d1_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsB) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d2_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d2_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsC) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d3_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d3_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let tail of tails) {
          expect(tail.stateValues.xs.map(x => x.tree)).eqls([...ov_t]);
        }
        for (let head of heads) {
          expect(head.stateValues.xs.map(x => x.tree)).eqls([...ov_h]);
        }
        for (let dTail of displacementTails) {
          expect(dTail.stateValues.xs.map(x => x.tree)).eqls([...d1_t]);
        }
        for (let dHead of displacementHeads) {
          expect(dHead.stateValues.xs.map(x => x.tree)).eqls([...d1_h]);
        }
      })

      cy.log(`move displacementA vector`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let d1_t = [2, 5];
        let d1_h = [7, 1];
        let d = d1_h.map((x, i) => x - d1_t[i]);

        let ov_t = [-1, 7];
        let ov_h = ov_t.map((x, i) => x + d[i]);
        let d2_t = [0, 0];
        let d2_h = d2_t.map((x, i) => x + d[i]);
        let d3_t = [0, 0];
        let d3_h = d3_t.map((x, i) => x + d[i]);

        displacementsA[1].moveVector({
          tailcoords: d1_t,
          headcoords: d1_h
        })

        for (let vector of vectors) {
          expect(vector.stateValues.tail.map(x => x.tree)).eqls([...ov_t]);
          expect(vector.stateValues.head.map(x => x.tree)).eqls([...ov_h]);
          expect(vector.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsA) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d1_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d1_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsB) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d2_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d2_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsC) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d3_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d3_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let tail of tails) {
          expect(tail.stateValues.xs.map(x => x.tree)).eqls([...ov_t]);
        }
        for (let head of heads) {
          expect(head.stateValues.xs.map(x => x.tree)).eqls([...ov_h]);
        }
        for (let dTail of displacementTails) {
          expect(dTail.stateValues.xs.map(x => x.tree)).eqls([...d1_t]);
        }
        for (let dHead of displacementHeads) {
          expect(dHead.stateValues.xs.map(x => x.tree)).eqls([...d1_h]);
        }
      })

      cy.log(`move displacementB vector`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let d2_t = [-2, 3];
        let d2_h = [5, -5];
        let d = d2_h.map((x, i) => x - d2_t[i]);

        let ov_t = [-1, 7];
        let ov_h = ov_t.map((x, i) => x + d[i]);
        let d1_t = [2, 5];
        let d1_h = d1_t.map((x, i) => x + d[i]);
        let d3_t = [0, 0];
        let d3_h = d3_t.map((x, i) => x + d[i]);

        displacementsB[2].moveVector({
          tailcoords: d2_t,
          headcoords: d2_h
        })

        for (let vector of vectors) {
          expect(vector.stateValues.tail.map(x => x.tree)).eqls([...ov_t]);
          expect(vector.stateValues.head.map(x => x.tree)).eqls([...ov_h]);
          expect(vector.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsA) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d1_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d1_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsB) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d2_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d2_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsC) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d3_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d3_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let tail of tails) {
          expect(tail.stateValues.xs.map(x => x.tree)).eqls([...ov_t]);
        }
        for (let head of heads) {
          expect(head.stateValues.xs.map(x => x.tree)).eqls([...ov_h]);
        }
        for (let dTail of displacementTails) {
          expect(dTail.stateValues.xs.map(x => x.tree)).eqls([...d1_t]);
        }
        for (let dHead of displacementHeads) {
          expect(dHead.stateValues.xs.map(x => x.tree)).eqls([...d1_h]);
        }
      })

      cy.log(`move displacementC vector`);
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let d3_t = [9, 8];
        let d3_h = [7, 4];
        let d = d3_h.map((x, i) => x - d3_t[i]);

        let ov_t = [-1, 7];
        let ov_h = ov_t.map((x, i) => x + d[i]);
        let d1_t = [2, 5];
        let d1_h = d1_t.map((x, i) => x + d[i]);
        let d2_t = [-2, 3]
        let d2_h = d2_t.map((x, i) => x + d[i]);

        displacementsC[5].moveVector({
          tailcoords: d3_t,
          headcoords: d3_h
        })

        for (let vector of vectors) {
          expect(vector.stateValues.tail.map(x => x.tree)).eqls([...ov_t]);
          expect(vector.stateValues.head.map(x => x.tree)).eqls([...ov_h]);
          expect(vector.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsA) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d1_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d1_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsB) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d2_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d2_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let displacement of displacementsC) {
          expect(displacement.stateValues.tail.map(x => x.tree)).eqls([...d3_t]);
          expect(displacement.stateValues.head.map(x => x.tree)).eqls([...d3_h]);
          expect(displacement.stateValues.displacement.map(x => x.tree)).eqls([...d]);
        }
        for (let tail of tails) {
          expect(tail.stateValues.xs.map(x => x.tree)).eqls([...ov_t]);
        }
        for (let head of heads) {
          expect(head.stateValues.xs.map(x => x.tree)).eqls([...ov_h]);
        }
        for (let dTail of displacementTails) {
          expect(dTail.stateValues.xs.map(x => x.tree)).eqls([...d1_t]);
        }
        for (let dHead of displacementHeads) {
          expect(dHead.stateValues.xs.map(x => x.tree)).eqls([...d1_h]);
        }
      })

    });

  });
});