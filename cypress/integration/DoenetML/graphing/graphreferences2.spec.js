describe('Graph Reference Test 2', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

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
    </sidebyside>

    <sidebyside>
    <copy width="150px" height="150px" name="graph5" tname="graph1" />
    <copy width="150px" height="150px" name="graph6" tname="graph2" />
    <copy width="150px" height="150px" name="graph7" tname="graph3" />
    <copy width="150px" height="150px" name="graph8" tname="graph4" />
    </sidebyside>

    <sidebyside>
    <copy width="150px" height="150px" name="graph9" tname="graph5" />
    <copy width="150px" height="150px" name="graph10" tname="graph6" />
    <copy width="150px" height="150px" name="graph11" tname="graph7" />
    <copy width="150px" height="150px" name="graph12" tname="graph8" />
    </sideBySide>
    </sbsgroup>

    <copy name="sbsgroup2" tname="_sbsgroup1" />
  
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
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

      let graph1A = components['/sbsgroup2'].replacements[0].activeChildren[0].activeChildren[0];
      let graph2A = components['/sbsgroup2'].replacements[0].activeChildren[0].activeChildren[1];
      let graph3A = components['/sbsgroup2'].replacements[0].activeChildren[0].activeChildren[2];
      let graph4A = components['/sbsgroup2'].replacements[0].activeChildren[0].activeChildren[3];
      let graph5A = components['/sbsgroup2'].replacements[0].activeChildren[1].activeChildren[0];
      let graph6A = components['/sbsgroup2'].replacements[0].activeChildren[1].activeChildren[1];
      let graph7A = components['/sbsgroup2'].replacements[0].activeChildren[1].activeChildren[2];
      let graph8A = components['/sbsgroup2'].replacements[0].activeChildren[1].activeChildren[3];
      let graph9A = components['/sbsgroup2'].replacements[0].activeChildren[2].activeChildren[0];
      let graph10A = components['/sbsgroup2'].replacements[0].activeChildren[2].activeChildren[1];
      let graph11A = components['/sbsgroup2'].replacements[0].activeChildren[2].activeChildren[2];
      let graph12A = components['/sbsgroup2'].replacements[0].activeChildren[2].activeChildren[3];

      let vectors = [
        graph1.activeChildren[0],
        graph2.activeChildren[3],
        graph4.activeChildren[3],
        graph5.activeChildren[0],
        graph6.activeChildren[3],
        graph8.activeChildren[3],
        graph9.activeChildren[0],
        graph10.activeChildren[3],
        graph12.activeChildren[3],
        graph1A.activeChildren[0],
        graph2A.activeChildren[3],
        graph4A.activeChildren[3],
        graph5A.activeChildren[0],
        graph6A.activeChildren[3],
        graph8A.activeChildren[3],
        graph9A.activeChildren[0],
        graph10A.activeChildren[3],
        graph12A.activeChildren[3],
      ];

      let displacementsA = [
        graph2.activeChildren[2],
        graph3.activeChildren[3],
        graph6.activeChildren[2],
        graph7.activeChildren[3],
        graph10.activeChildren[2],
        graph11.activeChildren[3],
        graph2A.activeChildren[2],
        graph3A.activeChildren[3],
        graph6A.activeChildren[2],
        graph7A.activeChildren[3],
        graph10A.activeChildren[2],
        graph11A.activeChildren[3],
      ];

      let displacementsB = [
        graph3.activeChildren[2],
        graph7.activeChildren[2],
        graph11.activeChildren[2],
        graph3A.activeChildren[2],
        graph7A.activeChildren[2],
        graph11A.activeChildren[2],
      ];

      let displacementsC = [
        graph4.activeChildren[2],
        graph8.activeChildren[2],
        graph12.activeChildren[2],
        graph4A.activeChildren[2],
        graph8A.activeChildren[2],
        graph12A.activeChildren[2],
      ];

      let tails = [
        graph2.activeChildren[0],
        graph4.activeChildren[0],
        graph6.activeChildren[0],
        graph8.activeChildren[0],
        graph10.activeChildren[0],
        graph12.activeChildren[0],
        graph2A.activeChildren[0],
        graph4A.activeChildren[0],
        graph6A.activeChildren[0],
        graph8A.activeChildren[0],
        graph10A.activeChildren[0],
        graph12A.activeChildren[0],
      ]

      let heads = [
        graph2.activeChildren[1],
        graph4.activeChildren[1],
        graph6.activeChildren[1],
        graph8.activeChildren[1],
        graph10.activeChildren[1],
        graph12.activeChildren[1],
        graph2A.activeChildren[1],
        graph4A.activeChildren[1],
        graph6A.activeChildren[1],
        graph8A.activeChildren[1],
        graph10A.activeChildren[1],
        graph12A.activeChildren[1],
      ]

      let displacementTails = [
        graph3.activeChildren[0],
        graph7.activeChildren[0],
        graph11.activeChildren[0],
        graph3A.activeChildren[0],
        graph7A.activeChildren[0],
        graph11A.activeChildren[0],
      ]


      let displacementHeads = [
        graph3.activeChildren[1],
        graph7.activeChildren[1],
        graph11.activeChildren[1],
        graph3A.activeChildren[1],
        graph7A.activeChildren[1],
        graph11A.activeChildren[1],
      ]

      cy.log(`check original configuration`);
      cy.window().then(async (win) => {
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
      cy.window().then(async (win) => {
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

        await vectors[8].moveVector({
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
      cy.window().then(async (win) => {
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

        await displacementsA[1].moveVector({
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
      cy.window().then(async (win) => {
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

        await displacementsB[2].moveVector({
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
      cy.window().then(async (win) => {
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

        await displacementsC[5].moveVector({
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