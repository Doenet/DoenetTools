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
    <vector><head>(-4,2)</head><tail>(3,5)</tail></vector>
    </graph>
  
    <graph width="150px" height="150px" name="graph2">
    <ref prop="tail">_vector1</ref>
    <ref prop="head">_vector1</ref>
    <ref prop="displacement" name="d1">_vector1</ref>
    <ref name="rv1">_vector1</ref>
    </graph>
  
    <graph width="150px" height="150px" name="graph3">
    <ref prop="tail">d1</ref>
    <ref prop="head">d1</ref>
    <ref prop="displacement">d1</ref>
    <ref>d1</ref>
    </graph>
  
    <graph width="150px" height="150px" name="graph4">
    <ref prop="tail">rv1</ref>
    <ref prop="head">rv1</ref>
    <ref prop="displacement">rv1</ref>
    <ref>rv1</ref>
    </graph>
  
    <ref width="150px" height="150px" name="graph5">graph1</ref>
    <ref width="150px" height="150px" name="graph6">graph2</ref>
    <ref width="150px" height="150px" name="graph7">graph3</ref>
    <ref width="150px" height="150px" name="graph8">graph4</ref>
    
    <ref width="150px" height="150px">graph5</ref>
    <ref width="150px" height="150px">graph6</ref>
    <ref width="150px" height="150px">graph7</ref>
    <ref width="150px" height="150px">graph8</ref>
    </panel>
  
    <ref>_panel1</ref>
  
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let originalVectors = [0, 2, 6]
    let displacementsA = [1, 4];
    let displacementsB = [3,];
    let displacementsC = [5,];
    let vectorShift = 7;
    let originalTails = [1, 5];
    let originalHeads = [2, 6];
    let displacementTails = [3,];
    let displacementHeads = [4,];
    let pointShift = 6;
    let nShifts = 6;

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

      for (let i = 0; i < nShifts; i++) {
        for (let j of originalVectors) {
          let name = '__vector' + (i * vectorShift + j);
          if(i === 0 && j === 0) {
            name = '/_vector1';
          }
          expect(components[name].state.tail.tree).eqls(["tuple", ...ov_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...ov_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsA) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d1_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d1_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsB) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d2_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d2_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsC) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d3_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d3_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of originalTails) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...ov_t]);
        }
        for (let j of originalHeads) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...ov_h]);
        }
        for (let j of displacementTails) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...d1_t]);
        }
        for (let j of displacementHeads) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...d1_h]);
        }
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

      components['__vector' + (1 * vectorShift + 2)].moveVector({
        tailcoords: ov_t,
        headcoords: ov_h
      })

      for (let i = 0; i < nShifts; i++) {
        for (let j of originalVectors) {
          let name = '__vector' + (i * vectorShift + j);
          if(i === 0 && j === 0) {
            name = '/_vector1';
          }
          expect(components[name].state.tail.tree).eqls(["tuple", ...ov_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...ov_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsA) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d1_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d1_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsB) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d2_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d2_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsC) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d3_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d3_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of originalTails) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...ov_t]);
        }
        for (let j of originalHeads) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...ov_h]);
        }
        for (let j of displacementTails) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...d1_t]);
        }
        for (let j of displacementHeads) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...d1_h]);
        }
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

      components['__vector' + (0 * vectorShift + 4)].moveVector({
        tailcoords: d1_t,
        headcoords: d1_h
      })

      for (let i = 0; i < nShifts; i++) {
        for (let j of originalVectors) {
          let name = '__vector' + (i * vectorShift + j);
          if(i === 0 && j === 0) {
            name = '/_vector1';
          }
          expect(components[name].state.tail.tree).eqls(["tuple", ...ov_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...ov_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsA) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d1_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d1_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsB) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d2_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d2_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsC) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d3_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d3_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of originalTails) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...ov_t]);
        }
        for (let j of originalHeads) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...ov_h]);
        }
        for (let j of displacementTails) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...d1_t]);
        }
        for (let j of displacementHeads) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...d1_h]);
        }
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

      components['__vector' + (2 * vectorShift + 3)].moveVector({
        tailcoords: d2_t,
        headcoords: d2_h
      })

      for (let i = 0; i < nShifts; i++) {
        for (let j of originalVectors) {
          let name = '__vector' + (i * vectorShift + j);
          if(i === 0 && j === 0) {
            name = '/_vector1';
          }
          expect(components[name].state.tail.tree).eqls(["tuple", ...ov_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...ov_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsA) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d1_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d1_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsB) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d2_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d2_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsC) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d3_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d3_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of originalTails) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...ov_t]);
        }
        for (let j of originalHeads) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...ov_h]);
        }
        for (let j of displacementTails) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...d1_t]);
        }
        for (let j of displacementHeads) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...d1_h]);
        }
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

      components['__vector' + (5 * vectorShift + 5)].moveVector({
        tailcoords: d3_t,
        headcoords: d3_h
      })

      for (let i = 0; i < nShifts; i++) {
        for (let j of originalVectors) {
          let name = '__vector' + (i * vectorShift + j);
          if(i === 0 && j === 0) {
            name = '/_vector1';
          }
          expect(components[name].state.tail.tree).eqls(["tuple", ...ov_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...ov_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsA) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d1_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d1_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsB) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d2_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d2_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of displacementsC) {
          let name = '__vector' + (i * vectorShift + j);
          expect(components[name].state.tail.tree).eqls(["tuple", ...d3_t]);
          expect(components[name].state.head.tree).eqls(["tuple", ...d3_h]);
          expect(components[name].state.displacement.tree).eqls(["tuple", ...d]);
        }
        for (let j of originalTails) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...ov_t]);
        }
        for (let j of originalHeads) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...ov_h]);
        }
        for (let j of displacementTails) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...d1_t]);
        }
        for (let j of displacementHeads) {
          let name = '__point' + (i * pointShift + j);
          expect(components[name].state.coords.tree).eqls(["tuple", ...d1_h]);
        }
      }
    })


  });
});