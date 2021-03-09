describe('Specifying subvariants tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('specify indices of a select', () => {

    let values = ["u", "v", "w", "x", "y", "z"]

    cy.log("specify each index in turn")
    for (let ind = 0; ind < 6; ind++) {
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <select assignnames="(x)">u,v,w,x,y,z</select>
    `,
          requestedVariant: {
            subvariants: [{
              indices: [ind]
            }]
          },
        }, "*");
      });
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);
        expect(components['/x'].stateValues.value).eq(values[ind]);
      })

    }

  });

  it('specify two indices of a select, ignores withReplacement', () => {

    let values = ["x", "y", "z"]

    cy.log("specify each pair of indices in turn")
    for (let ind1 = 0; ind1 < 3; ind1++) {
      for (let ind2 = 0; ind2 < 3; ind2++) {

        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
      <text>${ind1}</text>
      <text>${ind2}</text>
      <select assignnames="(x),(y)" numbertoselect="2">x,y,z</select>
      `,
            requestedVariant: {
              subvariants: [{
                indices: [ind1, ind2]
              }]
            }
          }, "*");
        });

        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind1}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then((win) => {

          let components = Object.assign({}, win.state.components);
          expect(components['/x'].stateValues.value).eq(values[ind1]);
          expect(components['/y'].stateValues.value).eq(values[ind2]);
        })
      }

    }

  });

  it('specify indices of a selectfromsequence', () => {

    let values = [...Array(10).keys()].map(x => x + 1);

    cy.log("specify each index in turn")
    for (let ind = 0; ind < 10; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <selectfromsequence assignnames="n" to="10" />
      `,
          requestedVariant: {
            subvariants: [{
              indices: [ind]
            }]
          }
        }, "*");
      });

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);
        expect(components['/n'].stateValues.value).eq(values[ind]);
      })

    }
  })

  it('specify two indices of a selectfromsequence, ignores withReplacement', () => {

    let values = [...Array(4).keys()].map(x => x + 1);

    cy.log("specify each pair of indices in turn")
    for (let ind1 = 0; ind1 < 4; ind1++) {
      for (let ind2 = 0; ind2 < 4; ind2++) {

        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind1}</text>
        <text>${ind2}</text>
        <selectfromsequence assignnames="x,y" numbertoselect="2" to="4" />
      `,
            requestedVariant: {
              subvariants: [{
                indices: [ind1, ind2]
              }]
            }
          }, "*");
        });
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind1}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then((win) => {

          let components = Object.assign({}, win.state.components);
          expect(components['/x'].stateValues.value).eq(values[ind1]);
          expect(components['/y'].stateValues.value).eq(values[ind2]);
        })
      }
    }
  });

  it('specify indices of selects, ignores variant names', () => {

    let directions = ["north", "south", "east", "west"]
    let directionsByVariantName = {
      a: directions[0],
      b: directions[1],
      c: directions[2],
      d: directions[3]
    }

    let sides = ["top", "bottom", "left", "right"]

    let sidesByVariantName = {
      a: [sides[0], sides[0]],
      b: [sides[1], sides[0]],
      c: [sides[2], sides[0]],
      d: [sides[1], sides[3]]
    }

    let variants = ["a", "b", "c", "d"];

    cy.log("specify each document variant");
    for (let ind = 0; ind < 4; ind++) {

      let variant = variants[ind];

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="4"/>

      <p>Direction: <select assignnames="(direction)" numbertoselect="1">
        <option selectForVariants="a"><text>north</text></option>
        <option selectForVariants="b"><text>south</text></option>
        <option selectForVariants="c"><text>east</text></option>
        <option selectForVariants="d"><text>west</text></option>
      </select></p>

      <p>Sides: <aslist>
      <select assignnames="(side1),(side2)" numbertoselect="2">
        <option selectForVariants="a,b,c,a"><text>top</text></option>
        <option selectForVariants="b,d"><text>bottom</text></option>
        <option selectForVariants="c"><text>left</text></option>
        <option selectForVariants="d"><text>right</text></option>
      </select>
      </aslist></p>
    `,
          requestedVariant: {
            value: variant
          }
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);
        expect(components['/direction'].stateValues.value).eq(directionsByVariantName[variant]);

        let sidesSelected = [components['/side1'].stateValues.value, components['/side2'].stateValues.value];
        expect(sidesSelected.sort()).eqls(sidesByVariantName[variant]);
      })
    }

    cy.log("Override variant for first select")
    let directionToChoose = [3, 0, 1, 2, 2, 1, 3, 1];

    for (let ind = 0; ind < 8; ind++) {

      let variant = variants[ind % 4];
      let directionInd = directionToChoose[ind];
      let direction = directions[directionInd];
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="4"/>

      <p>Direction: <select assignnames="(direction)" numbertoselect="1">
        <option selectForVariants="a"><text>north</text></option>
        <option selectForVariants="b"><text>south</text></option>
        <option selectForVariants="c"><text>east</text></option>
        <option selectForVariants="d"><text>west</text></option>
      </select></p>

      <p>Sides: <aslist>
      <select assignnames="(side1),(side2)" numbertoselect="2">
        <option selectForVariants="a,b,c,a"><text>top</text></option>
        <option selectForVariants="b,d"><text>bottom</text></option>
        <option selectForVariants="c"><text>left</text></option>
        <option selectForVariants="d"><text>right</text></option>
      </select>
      </aslist></p>
    `,
          requestedVariant: {
            value: variant,
            subvariants: [{
              indices: [directionInd]
            }]
          }
        }, "*");
      });
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);
        expect(components['/direction'].stateValues.value).eq(direction);

        let sidesSelected = [components['/side1'].stateValues.value, components['/side2'].stateValues.value];
        expect(sidesSelected.sort()).eqls(sidesByVariantName[variant]);
      })
    }

    cy.log("Override variant for second select")
    let sidesToChoose = [[3, 1], [1, 1], [0, 3], [3, 2], [2, 2], [0, 2], [2, 1], [0, 0]];

    for (let ind = 0; ind < 8; ind++) {

      let variant = variants[ind % 4];
      let direction = directions[ind % 4];
      let sideInds = sidesToChoose[ind];
      let sidesChosen = sideInds.map(x => sides[x])
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="4"/>

      <p>Direction: <select assignnames="(direction)" numbertoselect="1">
        <option selectForVariants="a"><text>north</text></option>
        <option selectForVariants="b"><text>south</text></option>
        <option selectForVariants="c"><text>east</text></option>
        <option selectForVariants="d"><text>west</text></option>
      </select></p>

      <p>Sides: <aslist>
      <select assignnames="(side1),(side2)" numbertoselect="2">
        <option selectForVariants="a,b,c,a"><text>top</text></option>
        <option selectForVariants="b,d"><text>bottom</text></option>
        <option selectForVariants="c"><text>left</text></option>
        <option selectForVariants="d"><text>right</text></option>
      </select>
      </aslist></p>
    `,
          requestedVariant: {
            value: variant,
            subvariants: [{
            }, {
              indices: sideInds
            }]
          }
        }, "*");
      });
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);
        expect(components['/direction'].stateValues.value).eq(direction);

        let sidesSelected = [components['/side1'].stateValues.value, components['/side2'].stateValues.value];
        expect(sidesSelected).eqls(sidesChosen);
      })
    }

    cy.log("Specify choices for both selects")
    for (let ind = 0; ind < 8; ind++) {

      let directionInd = directionToChoose[ind];
      let direction = directions[directionInd];
      let sideInds = sidesToChoose[ind];
      let sidesChosen = sideInds.map(x => sides[x])
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="4"/>

      <p>Direction: <select assignnames="(direction)" numbertoselect="1">
        <option selectForVariants="a"><text>north</text></option>
        <option selectForVariants="b"><text>south</text></option>
        <option selectForVariants="c"><text>east</text></option>
        <option selectForVariants="d"><text>west</text></option>
      </select></p>

      <p>Sides: <aslist>
      <select assignnames="(side1),(side2)" numbertoselect="2">
        <option selectForVariants="a,b,c,a"><text>top</text></option>
        <option selectForVariants="b,d"><text>bottom</text></option>
        <option selectForVariants="c"><text>left</text></option>
        <option selectForVariants="d"><text>right</text></option>
      </select>
      </aslist></p>
    `,
          requestedVariant: {
            subvariants: [{
              indices: [directionInd]
            }, {
              indices: sideInds
            }]
          }
        }, "*");
      });
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);
        expect(components['/direction'].stateValues.value).eq(direction);

        let sidesSelected = [components['/side1'].stateValues.value, components['/side2'].stateValues.value];
        expect(sidesSelected).eqls(sidesChosen);
      })
    }

  });

  it('nested selects', () => {

    let firstStringsToInd = {
      "Favorite color:": 0,
      "Selected number:": 1,
      "Chosen letter:": 2,
      "Variable:": 3
    }

    let colorsByInd = ["red", "orange", "green", "white", "chartreuse"];
    let lettersByInd = ["c", "d", "e", "f", "g"];

    cy.log("Select options from first group")
    for (let ind = 0; ind < 5; ind++) {
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="100"/>
  
      <select assignnames="(p)">
        <option><p>Favorite color:
          <select>
            <option><text>red</text></option>
            <option><text>orange</text></option>
            <option><text>green</text></option>
            <option><text>white</text></option>
            <option><text>chartreuse</text></option>
          </select>
        </p></option>
        <option><p>Selected number: 
          <select>
            <selectfromsequence from="1000" to="2000" />
            <selectfromsequence from="-1000" to="-400" />
          </select>
        </p></option>
        <option><p>Chosen letter: <selectfromsequence type="letters">c,g</selectfromsequence></p></option>
        <option><p>Variable: <select>u,v,w,x,z,y</select></p></option>
      </select>
      `,
          requestedVariant: {
            subvariants: [{
              indices: [0],
              subvariants: [{
                indices: [ind]
              }]
            }]
          }
        }, "*");
      });
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let p = components['/p'];

        let variantInd = firstStringsToInd[p.activeChildren[0].stateValues.value.trim()];
        expect(variantInd).eq(0);

        expect(p.activeChildren[1].stateValues.value).eq(colorsByInd[ind])
      });

    }

    cy.log("Select options from second group")
    for (let ind1 = 0; ind1 < 2; ind1++) {
      for (let ind2 = 0; ind2 < 400; ind2 += 100) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind1}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <select assignnames="p">
          <p>Favorite color:
            <select>
              <text>red</text>
              <text>orange</text>
              <text>green</text>
              <text>white</text>
              <text>chartreuse</text>
            </select>
          </p>
          <p>Selected number: 
            <select>
              <selectfromsequence>1000, 2000</selectfromsequence>
              <selectfromsequence>-1000,-400</selectfromsequence>
            </select>
          </p>
          <p>Chosen letter: <selectfromsequence type="letters">c,g</selectfromsequence></p>
          <p>Variable: <select>u,v,w,x,z,y</select></p>
        </select>
        `,
            requestedVariant: {
              subvariants: [{
                indices: [1],
                subvariants: [{
                  indices: [ind1],
                  subvariants: [{
                    indices: [ind2]
                  }]
                }]
              }]
            }
          }, "*");
        });
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind1}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);
          let p = components['/p'];

          let variantInd = firstStringsToInd[p.activeChildren[0].stateValues.value.trim()];
          expect(variantInd).eq(1);

          let num = p.activeChildren[1].stateValues.value;

          if (ind1 === 0) {
            expect(num).eq(1000 + ind2);
          } else {
            expect(num).eq(-1000 + ind2);
          }
        });
      }
    }

    cy.log("Select options from third group")
    for (let ind = 0; ind < 5; ind++) {
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="100"/>
  
      <select assignnames="p">
        <p>Favorite color:
          <select>
            <text>red</text>
            <text>orange</text>
            <text>green</text>
            <text>white</text>
            <text>chartreuse</text>
          </select>
        </p>
        <p>Selected number: 
          <select>
            <selectfromsequence>1000, 2000</selectfromsequence>
            <selectfromsequence>-1000,-400</selectfromsequence>
          </select>
        </p>
        <p>Chosen letter: <selectfromsequence type="letters">c,g</selectfromsequence></p>
        <p>Variable: <select>u,v,w,x,z,y</select></p>
      </select>
      `,
          requestedVariant: {
            subvariants: [{
              indices: [2],
              subvariants: [{
                indices: [ind]
              }]
            }]
          }
        }, "*");
      });
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let p = components['/p'];

        let variantInd = firstStringsToInd[p.activeChildren[0].stateValues.value.trim()];
        expect(variantInd).eq(2);

        expect(p.activeChildren[1].stateValues.value).eq(lettersByInd[ind])
      });

    }

  });

  it.only('selected problems', () => {

    let titlesToInd = {
      "A word problem": 0,
      "A number problem": 1,
    }

    let problemAoptions = ["angry", "bad", "churlish", "drab", "excoriated"];
    let problemBoptions = [7, 13, 47, 7, 13];

    cy.log("Test each combination of problems")
    for (let ind1 = 0; ind1 < 2; ind1++) {
      for (let ind2 = 0; ind2 < 2; ind2++) {
        for (let ind3 = 0; ind3 < 2; ind3++) {
          for (let ind4 = 0; ind4 < 2; ind4++) {
            for (let ind5 = 2; ind5 < 4; ind5++) {
              for (let ind6 = 4; ind6 < 5; ind6++) {
                cy.window().then((win) => {
                  win.postMessage({
                    doenetML: `
                <text>${ind1}</text>
                <text>${ind2}</text>
                <text>${ind3}</text>
                <text>${ind4}</text>
                <text>${ind5}</text>
                <text>${ind6}</text>
                <variantControl nvariants="100"/>
            
                <select assignnames="(problem1), (problem2), (problem3)" numbertoselect="3" withReplacement>
                  <option><problem><title>A word problem</title>
                    <variantControl nvariants="5" variants="a,b,c,d,e" />
                    <p>Word:
                      <select>
                        <option selectForVariants="a"><text>angry</text></option>
                        <option selectForVariants="b"><text>bad</text></option>
                        <option selectForVariants="c"><text>churlish</text></option>
                        <option selectForVariants="d"><text>drab</text></option>
                        <option selectForVariants="e"><text>excoriated</text></option>
                      </select>
                    </p>
                  </problem></option>
                  <option><problem><title>A number problem</title>
                    <variantControl nvariants="3" />
                    <p>Number: 
                      <select>
                         <option selectForVariants="a"><number>7</number></option>
                         <option selectForVariants="b"><number>13</number></option>
                         <option selectForVariants="c"><number>47</number></option>
                    </select></p>
                  </problem></option>
                </select>
                `,
                    requestedVariant: {
                      subvariants: [{
                        indices: [ind1, ind2, ind3],
                        subvariants: [{
                          index: ind4
                        }, {
                          index: ind5
                        }, {
                          index: ind6
                        }]
                      }]
                    }
                  }, "*");
                });
                // to wait for page to load
                cy.get('#\\/_text1').should('have.text', `${ind1}`)
                cy.get('#\\/_text2').should('have.text', `${ind2}`)
                cy.get('#\\/_text3').should('have.text', `${ind3}`)
                cy.get('#\\/_text4').should('have.text', `${ind4}`)
                cy.get('#\\/_text5').should('have.text', `${ind5}`)
                cy.get('#\\/_text6').should('have.text', `${ind6}`)

                cy.window().then((win) => {
                  let components = Object.assign({}, win.state.components);

                  let problemInds = [ind1, ind2, ind3];

                  let selectInds = [ind4, ind5, ind6];

                  for (let i = 1; i <= 3; i++) {
                    let problem = components['/problem' + i];
                    let variantInd = titlesToInd[problem.stateValues.title];
                    expect(variantInd).eq(problemInds[i - 1]);

                    let p = problem.activeChildren[4];

                    if (variantInd === 0) {
                      expect(p.activeChildren[1].stateValues.value).eq(problemAoptions[selectInds[i - 1]])
                    } else {
                      expect(p.activeChildren[1].stateValues.value).eq(problemBoptions[selectInds[i - 1]])
                    }
                  }
                })
              }
            }
          }
        }
      }
    }

  });

  it('selected problems, specify options directly', () => {

    let titlesToInd = {
      "A word problem": 0,
      "A number problem": 1,
    }

    let problemAoptions = ["angry", "bad", "churlish", "drab", "excoriated"];
    let problemBoptions = [1, 2, 3, 4, 5];

    cy.log("Test each combination of problems")
    for (let ind1 = 0; ind1 < 2; ind1++) {
      for (let ind2 = 0; ind2 < 2; ind2++) {
        for (let ind3 = 0; ind3 < 2; ind3++) {
          for (let ind4 = 0; ind4 < 2; ind4++) {
            for (let ind5 = 2; ind5 < 4; ind5++) {
              for (let ind6 = 4; ind6 < 5; ind6++) {
                cy.window().then((win) => {
                  win.postMessage({
                    doenetML: `
                  <text>${ind1}</text>
                  <text>${ind2}</text>
                  <text>${ind3}</text>
                  <text>${ind4}</text>
                  <text>${ind5}</text>
                  <text>${ind6}</text>
    
                  <variantControl nvariants="100"/>
              
                  <select assignnames="problem1, problem2, problem3" numbertoselect="3" withReplacement>
                    <problem><title>A word problem</title>
                      <variantControl nvariants="5" />
                      <p>Word:
                        <select>
                          <text>angry</text>
                          <text>bad</text>
                          <text>churlish</text>
                          <text>drab</text>
                          <text>excoriated</text>
                        </select>
                      </p>
                    </problem>
                    <problem><title>A number problem</title>
                      <variantControl nvariants="3" />
                      <p>Number: 
                        <selectfromsequence>10</selectfromsequence>
                      </p>
                    </problem>
                  </select>
                  `,
                    requestedVariant: {
                      subvariants: [{
                        indices: [ind1, ind2, ind3],
                        subvariants: [{
                          subvariants: [{
                            indices: [ind4]
                          }]
                        }, {
                          subvariants: [{
                            indices: [ind5]
                          }]
                        }, {
                          subvariants: [{
                            indices: [ind6]
                          }]
                        }]
                      }]
                    }
                  }, "*");
                });
                // to wait for page to load
                cy.get('#\\/_text1').should('have.text', `${ind1}`)
                cy.get('#\\/_text2').should('have.text', `${ind2}`)
                cy.get('#\\/_text3').should('have.text', `${ind3}`)
                cy.get('#\\/_text4').should('have.text', `${ind4}`)
                cy.get('#\\/_text5').should('have.text', `${ind5}`)
                cy.get('#\\/_text6').should('have.text', `${ind6}`)

                cy.window().then((win) => {
                  let components = Object.assign({}, win.state.components);

                  let problemInds = [ind1, ind2, ind3];

                  let selectInds = [ind4, ind5, ind6];

                  for (let i = 1; i <= 3; i++) {
                    let problem = components['/problem' + i];
                    let variantInd = titlesToInd[problem.stateValues.title];
                    expect(variantInd).eq(problemInds[i - 1]);

                    let p = problem.activeChildren[4];

                    if (variantInd === 0) {
                      expect(p.activeChildren[1].stateValues.value).eq(problemAoptions[selectInds[i - 1]])
                    } else {
                      expect(p.activeChildren[1].stateValues.value).eq(problemBoptions[selectInds[i - 1]])
                    }
                  }
                })
              }
            }
          }
        }
      }
    }

  });

});