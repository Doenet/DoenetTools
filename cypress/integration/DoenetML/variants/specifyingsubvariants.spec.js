import { numberToLetters } from "../../../../src/Core/utils/sequence";

describe('Specifying subvariants tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('specify indices of a select', () => {

    let values = ["u", "v", "w", "x", "y", "z"]

    cy.log("specify each index in turn")
    for (let ind = 1; ind <= 6; ind++) {
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <select type="text" assignnames="x">u v w x y z</select>
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
        expect(components['/x'].stateValues.value).eq(values[ind - 1]);
        expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
          index: 1,
          name: 'a',
          meta: {
            subvariantsSpecified: true,
            createdBy: "/_document1"
          },
          subvariants: [{
            indices: [ind],
            meta: { createdBy: "/_select1" },
            subvariants: []
          }]
        })
      })

    }

  });

  it('specify two indices of a select, ignores withReplacement', () => {

    let values = ["x", "y", "z"]

    cy.log("specify each pair of indices in turn")
    for (let ind1 = 1; ind1 <= 3; ind1++) {
      for (let ind2 = 1; ind2 <= 3; ind2++) {

        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
      <text>${ind1}</text>
      <text>${ind2}</text>
      <select type="text" assignnames="x y" numbertoselect="2">x y z</select>
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
          expect(components['/x'].stateValues.value).eq(values[ind1 - 1]);
          expect(components['/y'].stateValues.value).eq(values[ind2 - 1]);
          expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
            index: 1,
            name: 'a',
            meta: {
              subvariantsSpecified: true,
              createdBy: "/_document1"
            },
            subvariants: [{
              indices: [ind1, ind2],
              meta: { createdBy: "/_select1" },
              subvariants: []
            }]
          })
        })
      }

    }

  });

  it('specify indices of a selectfromsequence', () => {

    let values = [...Array(10).keys()].map(x => x + 1);

    cy.log("specify each index in turn")
    for (let ind = 1; ind <= 10; ind++) {

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
        expect(components['/n'].stateValues.value).eq(values[ind - 1]);
        expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
          index: 1,
          name: 'a',
          meta: {
            subvariantsSpecified: true,
            createdBy: "/_document1"
          },
          subvariants: [{
            indices: [ind],
            meta: { createdBy: "/_selectfromsequence1" },
          }]
        })
      })

    }
  })

  it('specify two indices of a selectfromsequence, ignores withReplacement', () => {

    let values = [...Array(4).keys()].map(x => x + 1);

    cy.log("specify each pair of indices in turn")
    for (let ind1 = 1; ind1 <= 4; ind1++) {
      for (let ind2 = 1; ind2 <= 4; ind2++) {

        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind1}</text>
        <text>${ind2}</text>
        <selectfromsequence assignnames="x y" numbertoselect="2" to="4" />
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
          expect(components['/x'].stateValues.value).eq(values[ind1 - 1]);
          expect(components['/y'].stateValues.value).eq(values[ind2 - 1]);
          expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
            index: 1,
            name: 'a',
            meta: {
              subvariantsSpecified: true,
              createdBy: "/_document1"
            },
            subvariants: [{
              indices: [ind1, ind2],
              meta: { createdBy: "/_selectfromsequence1" },
            }]
          })
        })
      }
    }
  });

  it('specify indices of selects, ignores variant names', () => {

    let directions = ["north", "south", "east", "west"];
    let directionIndByVariantName = {
      a: [1], b: [2], c: [3], d: [4]
    }
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

    let variantNames = ["a", "b", "c", "d"];

    cy.log("specify each document variant");
    for (let ind = 1; ind <= 4; ind++) {

      let variantName = variantNames[ind - 1];

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="4"/>

      <p>Direction: <select assignnames="(direction)" numbertoselect="1">
        <option selectForVariantNames="a"><text>north</text></option>
        <option selectForVariantNames="b"><text>south</text></option>
        <option selectForVariantNames="c"><text>east</text></option>
        <option selectForVariantNames="d"><text>west</text></option>
      </select></p>

      <p>Sides: <aslist>
      <select assignnames="(side1) (side2)" numbertoselect="2">
        <option selectForVariantNames="a b c a"><text>top</text></option>
        <option selectForVariantNames="b d"><text>bottom</text></option>
        <option selectForVariantNames="c"><text>left</text></option>
        <option selectForVariantNames="d"><text>right</text></option>
      </select>
      </aslist></p>
    `,
          requestedVariant: {
            name: variantName
          }
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);
        expect(components['/direction'].stateValues.value).eq(directionsByVariantName[variantName]);

        let sidesSelected = [components['/side1'].stateValues.value, components['/side2'].stateValues.value];
        let sideOrder = sidesSelected.map(x => sides.indexOf(x) + 1)
        expect(sidesSelected.sort()).eqls(sidesByVariantName[variantName]);
        expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
          index: ind,
          name: numberToLetters(ind, true),
          meta: {
            subvariantsSpecified: false,
            createdBy: "/_document1"
          },
          subvariants: [{
            indices: directionIndByVariantName[variantName],
            meta: { createdBy: "/_select1" },
            subvariants: []
          }, {
            indices: sideOrder,
            meta: { createdBy: "/_select2" },
            subvariants: []
          }]
        })
      })
    }

    cy.log("Override variant for first select")
    let directionToChoose = [4, 1, 2, 3, 3, 2, 4, 2];

    for (let ind = 0; ind < 8; ind++) {

      let variantName = variantNames[ind % 4];
      let directionInd = directionToChoose[ind];
      let direction = directions[directionInd - 1];
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="4"/>

      <p>Direction: <select assignnames="(direction)" numbertoselect="1">
        <option selectForVariantNames="a"><text>north</text></option>
        <option selectForVariantNames="b"><text>south</text></option>
        <option selectForVariantNames="c"><text>east</text></option>
        <option selectForVariantNames="d"><text>west</text></option>
      </select></p>

      <p>Sides: <aslist>
      <select assignnames="(side1) (side2)" numbertoselect="2">
        <option selectForVariantNames="a b c a"><text>top</text></option>
        <option selectForVariantNames="b d"><text>bottom</text></option>
        <option selectForVariantNames="c"><text>left</text></option>
        <option selectForVariantNames="d"><text>right</text></option>
      </select>
      </aslist></p>
    `,
          requestedVariant: {
            name: variantName,
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
        let sideOrder = sidesSelected.map(x => sides.indexOf(x) + 1)
        expect(sidesSelected.sort()).eqls(sidesByVariantName[variantName]);
        expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
          index: (ind % 4) + 1,
          name: numberToLetters((ind % 4) + 1, true),
          meta: {
            subvariantsSpecified: true,
            createdBy: "/_document1"
          },
          subvariants: [{
            indices: [directionInd],
            meta: { createdBy: "/_select1" },
            subvariants: []
          }, {
            indices: sideOrder,
            meta: { createdBy: "/_select2" },
            subvariants: []
          }]
        })
      })
    }

    cy.log("Override variant for second select")
    let sidesToChoose = [[4, 2], [2, 2], [1, 4], [4, 3], [3, 3], [1, 3], [3, 2], [1, 1]];

    for (let ind = 0; ind < 8; ind++) {

      let variantName = variantNames[ind % 4];
      let direction = directions[ind % 4];
      let sideInds = sidesToChoose[ind];
      let sidesChosen = sideInds.map(x => sides[x - 1])
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="4"/>

      <p>Direction: <select assignnames="(direction)" numbertoselect="1">
        <option selectForVariantNames="a"><text>north</text></option>
        <option selectForVariantNames="b"><text>south</text></option>
        <option selectForVariantNames="c"><text>east</text></option>
        <option selectForVariantNames="d"><text>west</text></option>
      </select></p>

      <p>Sides: <aslist>
      <select assignnames="(side1) (side2)" numbertoselect="2">
        <option selectForVariantNames="a b c a"><text>top</text></option>
        <option selectForVariantNames="b d"><text>bottom</text></option>
        <option selectForVariantNames="c"><text>left</text></option>
        <option selectForVariantNames="d"><text>right</text></option>
      </select>
      </aslist></p>
    `,
          requestedVariant: {
            name: variantName,
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
        expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
          index: (ind % 4) + 1,
          name: numberToLetters((ind % 4) + 1, true),
          meta: {
            subvariantsSpecified: true,
            createdBy: "/_document1"
          },
          subvariants: [{
            indices: directionIndByVariantName[variantName],
            meta: { createdBy: "/_select1" },
            subvariants: []
          }, {
            indices: sideInds,
            meta: { createdBy: "/_select2" },
            subvariants: []
          }]
        })
      })
    }

    cy.log("Specify choices for both selects")
    for (let ind = 0; ind < 8; ind++) {

      let directionInd = directionToChoose[ind];
      let direction = directions[directionInd - 1];
      let sideInds = sidesToChoose[ind];
      let sidesChosen = sideInds.map(x => sides[x - 1])
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="4"/>

      <p>Direction: <select assignnames="(direction)" numbertoselect="1">
        <option selectForVariantNames="a"><text>north</text></option>
        <option selectForVariantNames="b"><text>south</text></option>
        <option selectForVariantNames="c"><text>east</text></option>
        <option selectForVariantNames="d"><text>west</text></option>
      </select></p>

      <p>Sides: <aslist>
      <select assignnames="(side1) (side2)" numbertoselect="2">
        <option selectForVariantNames="a b c a"><text>top</text></option>
        <option selectForVariantNames="b d"><text>bottom</text></option>
        <option selectForVariantNames="c"><text>left</text></option>
        <option selectForVariantNames="d"><text>right</text></option>
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

        expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
          index: 1,
          name: 'a',
          meta: {
            subvariantsSpecified: true,
            createdBy: "/_document1"
          },
          subvariants: [{
            indices: [directionInd],
            meta: { createdBy: "/_select1" },
            subvariants: []
          }, {
            indices: sideInds,
            meta: { createdBy: "/_select2" },
            subvariants: []
          }]
        })
      })
    }

  });

  it('nested selects', () => {

    let firstStringsToInd = {
      "Favorite color:": 1,
      "Selected number:": 2,
      "Chosen letter:": 3,
      "Variable:": 4
    }

    let colorsByInd = ["red", "orange", "green", "white", "chartreuse"];
    let lettersByInd = ["c", "d", "e", "f", "g"];
    let lettersByInd2 = ["u", "v", "w", "x", "z", "y"];

    cy.log("Select options from first group")
    for (let ind = 1; ind <= 10; ind++) {
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="100"/>
  
      <select assignnames="(p)">
        <option><p newNamespace>Favorite color:
          <select>
            <option><text>red</text></option>
            <option><text>orange</text></option>
            <option><text>green</text></option>
            <option><text>white</text></option>
            <option><text>chartreuse</text></option>
          </select>
        </p></option>
        <option><p newNamespace>Selected number: 
          <select assignNames="(s)">
            <option><selectfromsequence from="1000" to="2000" /></option>
            <option><selectfromsequence from="-1000" to="-400" /></option>
          </select>
        </p></option>
        <option><p newNamespace>Chosen letter: <selectfromsequence type="letters" from="c" to="g" /></p></option>
        <option><p newNamespace>Variable: <select>u v w x z y</select></p></option>
      </select>
      `,
          requestedVariant: {
            subvariants: [{
              indices: [1],
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
        expect(variantInd).eq(1);

        expect(p.activeChildren[1].stateValues.value).eq(colorsByInd[(ind - 1) % 5])

        expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
          index: 1,
          name: 'a',
          meta: {
            subvariantsSpecified: true,
            createdBy: "/_document1"
          },
          subvariants: [{
            indices: [1],
            meta: { createdBy: "/_select1" },
            subvariants: [{
              indices: [((ind - 1) % 5) + 1],
              meta: { createdBy: "/p/_select1" },
              subvariants: []
            }]
          }]
        })
      });

    }

    cy.log("Select options from second group")
    for (let ind1 = 1; ind1 <= 4; ind1++) {
      for (let ind2 = 1; ind2 <= 2000; ind2 += 300) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind1}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>

        <select assignnames="(p)">
          <option><p newNamespace>Favorite color:
            <select>
              <option><text>red</text></option>
              <option><text>orange</text></option>
              <option><text>green</text></option>
              <option><text>white</text></option>
              <option><text>chartreuse</text></option>
            </select>
          </p></option>
          <option><p newNamespace>Selected number: 
            <select assignNames="(s)">
              <option><selectfromsequence from="1000" to="2000" /></option>
              <option><selectfromsequence from="-1000" to="-400" /></option>
            </select>
          </p></option>
          <option><p newNamespace>Chosen letter: <selectfromsequence type="letters" from="c" to="g" /></p></option>
          <option><p newNamespace>Variable: <select>u v w x z y</select></p></option>
        </select>
        `,
            requestedVariant: {
              subvariants: [{
                indices: [2],
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
          expect(variantInd).eq(2);

          let num = p.activeChildren[1].stateValues.value;

          let effectiveInd2;
          if ((ind1 - 1) % 2 === 0) {
            effectiveInd2 = ((ind2 - 1) % 1001) + 1;
            expect(num).eq(999 + effectiveInd2);
          } else {
            effectiveInd2 = ((ind2 - 1) % 601) + 1;
            expect(num).eq(-1001 + effectiveInd2);
          }

          expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
            index: 1,
            name: 'a',
            meta: {
              subvariantsSpecified: true,
              createdBy: "/_document1"
            },
            subvariants: [{
              indices: [2],
              meta: { createdBy: "/_select1" },
              subvariants: [{
                indices: [((ind1 - 1) % 2) + 1],
                meta: { createdBy: "/p/_select1" },
                subvariants: [{
                  meta: { createdBy: "/p/s" },
                  indices: [effectiveInd2],
                }]
              }]
            }]
          })
        });
      }
    }

    cy.log("Select options from third group")
    for (let ind = 1; ind <= 10; ind++) {
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="100"/>
  
      <select assignnames="(p)">
        <option><p newNamespace>Favorite color:
          <select>
            <option><text>red</text></option>
            <option><text>orange</text></option>
            <option><text>green</text></option>
            <option><text>white</text></option>
            <option><text>chartreuse</text></option>
          </select>
        </p></option>
        <option><p newNamespace>Selected number: 
          <select assignNames="(s)">
            <option><selectfromsequence from="1000" to="2000" /></option>
            <option><selectfromsequence from="-1000" to="-400" /></option>
          </select>
        </p></option>
        <option><p newNamespace>Chosen letter: <selectfromsequence type="letters" from="c" to="g" /></p></option>
        <option><p newNamespace>Variable: <select>u v w x z y</select></p></option>
      </select>
      `,
          requestedVariant: {
            subvariants: [{
              indices: [3],
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
        expect(variantInd).eq(3);

        expect(p.activeChildren[1].stateValues.value).eq(lettersByInd[(ind - 1) % 5])

        expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
          index: 1,
          name: 'a',
          meta: {
            subvariantsSpecified: true,
            createdBy: "/_document1"
          },
          subvariants: [{
            indices: [3],
            meta: { createdBy: "/_select1" },
            subvariants: [{
              indices: [((ind - 1) % 5) + 1],
              meta: { createdBy: "/p/_selectfromsequence1" },
            }]
          }]
        })
      });

    }


    cy.log("Select options from fourth group")
    for (let ind = 1; ind <= 12; ind++) {
      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="100"/>
  
      <select assignnames="(p)">
        <option><p newNamespace>Favorite color:
          <select>
            <option><text>red</text></option>
            <option><text>orange</text></option>
            <option><text>green</text></option>
            <option><text>white</text></option>
            <option><text>chartreuse</text></option>
          </select>
        </p></option>
        <option><p newNamespace>Selected number: 
          <select assignNames="(s)">
            <option><selectfromsequence from="1000" to="2000" /></option>
            <option><selectfromsequence from="-1000" to="-400" /></option>
          </select>
        </p></option>
        <option><p newNamespace>Chosen letter: <selectfromsequence type="letters" from="c" to="g" /></p></option>
        <option><p newNamespace>Variable: <select>u v w x z y</select></p></option>
      </select>
      `,
          requestedVariant: {
            subvariants: [{
              indices: [4],
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
        expect(variantInd).eq(4);

        expect(p.activeChildren[1].stateValues.value.tree).eq(lettersByInd2[(ind - 1) % 6])

        expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
          index: 1,
          name: 'a',
          meta: {
            subvariantsSpecified: true,
            createdBy: "/_document1"
          },
          subvariants: [{
            indices: [4],
            meta: { createdBy: "/_select1" },
            subvariants: [{
              indices: [((ind - 1) % 6) + 1],
              meta: { createdBy: "/p/_select1" },
              subvariants: []
            }]
          }]
        })
      });

    }

  });

  it('selected problems', () => {

    let titlesToInd = {
      "A word problem": 1,
      "A number problem": 2,
    }

    let problemAoptions = ["angry", "bad", "churlish", "drab", "excoriated"];
    let problemAselectOptions = ["bad", "angry", "drab", "excoriated", "churlish"];

    let problemBoptions = [7, 13, 47, 7, 13];
    let problemBselectOptions = [7, 47, 13];

    cy.log("Test each combination of problems")
    for (let ind1 = 1; ind1 <= 2; ind1++) {
      for (let ind2 = 1; ind2 <= 2; ind2++) {
        for (let ind3 = 1; ind3 <= 2; ind3++) {
          for (let ind4 = 1; ind4 <= 2; ind4++) {
            for (let ind5 = 3; ind5 <= 4; ind5++) {
              for (let ind6 = 5; ind6 <= 5; ind6++) {
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
            
                <select assignnames="(problem1)  (problem2)  (problem3)" numbertoselect="3" withReplacement>
                  <option><problem newNamespace><title>A word problem</title>
                    <variantControl nvariants="5" variantNames="a b c d e" />
                    <p>Word:
                      <select>
                        <option selectForVariantNames="b"><text>bad</text></option>
                        <option selectForVariantNames="a"><text>angry</text></option>
                        <option selectForVariantNames="d"><text>drab</text></option>
                        <option selectForVariantNames="e"><text>excoriated</text></option>
                        <option selectForVariantNames="c"><text>churlish</text></option>
                      </select>
                    </p>
                  </problem></option>
                  <option><problem newNamespace><title>A number problem</title>
                    <variantControl nvariants="3" />
                    <p>Number: 
                      <select>
                         <option selectForVariantNames="a"><number>7</number></option>
                         <option selectForVariantNames="c"><number>47</number></option>
                         <option selectForVariantNames="b"><number>13</number></option>
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

                  let generatedVariantInfo = {
                    index: 1,
                    name: 'a',
                    meta: {
                      subvariantsSpecified: true,
                      createdBy: "/_document1"
                    },
                    subvariants: [{
                      indices: [],
                      meta: { createdBy: "/_select1" },
                      subvariants: []
                    }]
                  }

                  let problemInds = [ind1, ind2, ind3];

                  let problemVariantInds = [ind4, ind5, ind6];

                  for (let i = 1; i <= 3; i++) {
                    let problem = components['/problem' + i];
                    let variantInd = titlesToInd[problem.stateValues.title];
                    expect(variantInd).eq(problemInds[i - 1]);
                    generatedVariantInfo.subvariants[0].indices.push(variantInd);

                    let p = problem.activeChildren[4];

                    if (variantInd === 1) {
                      let word = problemAoptions[problemVariantInds[i - 1] - 1];
                      expect(p.activeChildren[1].stateValues.value).eq(word)
                      let selectIndex = problemAselectOptions.indexOf(word) + 1;
                      let problemIndex = problemVariantInds[i - 1];
                      generatedVariantInfo.subvariants[0].subvariants.push({
                        index: problemIndex,
                        name: numberToLetters(problemIndex, true),
                        meta: {
                          subvariantsSpecified: false,
                          createdBy: `/problem${i}`
                        },
                        subvariants: [{
                          indices: [selectIndex],
                          meta: { createdBy: `/problem${i}/_select1` },
                          subvariants: []
                        }]
                      })
                    } else {
                      let number = problemBoptions[problemVariantInds[i - 1] - 1];
                      expect(p.activeChildren[1].stateValues.value).eq(number)
                      let selectIndex = problemBselectOptions.indexOf(number) + 1;
                      let problemIndex = ((problemVariantInds[i - 1] - 1) % 3) + 1;
                      generatedVariantInfo.subvariants[0].subvariants.push({
                        index: problemIndex,
                        name: numberToLetters(problemIndex, true),
                        meta: {
                          subvariantsSpecified: false,
                          createdBy: `/problem${i}`
                        },
                        subvariants: [{
                          indices: [selectIndex],
                          meta: { createdBy: `/problem${i}/_select1` },
                          subvariants: []
                        }]
                      })

                    }

                  }

                  expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
                    generatedVariantInfo
                  )
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
      "A word problem": 1,
      "A number problem": 2,
    }

    let problemAoptions = ["angry", "bad", "churlish", "drab", "excoriated"];
    let problemBoptions = [1, 2, 3, 4, 5];

    cy.log("Test each combination of problems")
    for (let ind1 = 1; ind1 <= 2; ind1++) {
      for (let ind2 = 1; ind2 <= 2; ind2++) {
        for (let ind3 = 1; ind3 <= 2; ind3++) {
          for (let ind4 = 1; ind4 <= 2; ind4++) {
            for (let ind5 = 3; ind5 <= 4; ind5++) {
              for (let ind6 = 5; ind6 <= 5; ind6++) {
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
              
                  <select assignnames="(problem1)  (problem2)  (problem3)" numbertoselect="3" withReplacement>
                    <option><problem newNamespace><title>A word problem</title>
                      <variantControl nvariants="5" />
                      <p>Word:
                        <select>
                          <option><text>angry</text></option>
                          <option><text>bad</text></option>
                          <option><text>churlish</text></option>
                          <option><text>drab</text></option>
                          <option><text>excoriated</text></option>
                        </select>
                      </p>
                    </problem></option>
                    <option><problem newNamespace><title>A number problem</title>
                      <variantControl nvariants="3" />
                      <p>Number: 
                        <selectfromsequence length="10" />
                      </p>
                    </problem></option>
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

                  let generatedVariantInfo = {
                    index: 1,
                    name: 'a',
                    meta: {
                      subvariantsSpecified: true,
                      createdBy: "/_document1"
                    },
                    subvariants: [{
                      indices: [],
                      meta: { createdBy: "/_select1" },
                      subvariants: []
                    }]
                  }

                  let problemInds = [ind1, ind2, ind3];

                  let selectInds = [ind4, ind5, ind6];

                  for (let i = 1; i <= 3; i++) {
                    let problem = components['/problem' + i];
                    let variantInd = titlesToInd[problem.stateValues.title];
                    expect(variantInd).eq(problemInds[i - 1]);
                    generatedVariantInfo.subvariants[0].indices.push(variantInd);

                    let p = problem.activeChildren[4];

                    if (variantInd === 1) {
                      expect(p.activeChildren[1].stateValues.value).eq(problemAoptions[selectInds[i - 1] - 1])
                      generatedVariantInfo.subvariants[0].subvariants.push({
                        index: problem.stateValues.generatedVariantInfo.index,
                        name: numberToLetters(problem.stateValues.generatedVariantInfo.index, true),
                        meta: {
                          subvariantsSpecified: true,
                          createdBy: `/problem${i}`
                        },
                        subvariants: [{
                          indices: [selectInds[i - 1]],
                          meta: { createdBy: `/problem${i}/_select1` },
                          subvariants: []
                        }]
                      })
                    } else {
                      expect(p.activeChildren[1].stateValues.value).eq(problemBoptions[selectInds[i - 1] - 1])
                      generatedVariantInfo.subvariants[0].subvariants.push({
                        index: problem.stateValues.generatedVariantInfo.index,
                        name: numberToLetters(problem.stateValues.generatedVariantInfo.index, true),
                        meta: {
                          subvariantsSpecified: true,
                          createdBy: `/problem${i}`
                        },
                        subvariants: [{
                          indices: [selectInds[i - 1]],
                          meta: { createdBy: `/problem${i}/_selectfromsequence1` },
                        }]
                      })
                    }
                  }

                  expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
                    generatedVariantInfo
                  )

                })
              }
            }
          }
        }
      }
    }

  });

  it('specify values of a selectRandomNumbers', () => {

    let values = [0.150382373817, 502385.24839203, -3.18593023941];

    cy.log("specify values, even if out of range of distribution")
    for (let ind = 0; ind < 3; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <selectRandomNumbers assignnames="n" />
      `,
          requestedVariant: {
            subvariants: [{
              values: [values[ind]]
            }]
          }
        }, "*");
      });

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);
        expect(components['/n'].stateValues.value).eq(values[ind]);
        expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
          index: 1,
          name: 'a',
          meta: {
            subvariantsSpecified: true,
            createdBy: "/_document1"
          },
          subvariants: [{
            values: [values[ind]],
            meta: { createdBy: "/_selectrandomnumbers1" },
          }]
        })
      })

    }
  })


});