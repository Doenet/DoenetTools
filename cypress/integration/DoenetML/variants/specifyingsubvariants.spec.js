import { numberToLetters } from "../../../../src/Core/utils/sequence";
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

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

        let variantInd = firstStringsToInd[p.activeChildren[0].trim()];
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

          let variantInd = firstStringsToInd[p.activeChildren[0].trim()];
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

        let variantInd = firstStringsToInd[p.activeChildren[0].trim()];
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

        let variantInd = firstStringsToInd[p.activeChildren[0].trim()];
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

                  expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
                    generatedVariantInfo.subvariants[0].subvariants
                  )
                })
              }
            }
          }
        }
      }
    }

  });

  it('selected problems, one outside select', () => {

    let titlesToInd = {
      "A word problem": 1,
      "A number problem": 2,
    }

    let problemAoptions = ["angry", "bad", "churlish", "drab", "excoriated"];
    let problemAselectOptions = ["bad", "angry", "drab", "excoriated", "churlish"];

    let problemBoptions = [7, 13, 47, 7, 13];
    let problemBselectOptions = [7, 47, 13];

    cy.log("Test each combination of problems")
    for (let ind2 = 1; ind2 <= 2; ind2++) {
      for (let ind3 = 2; ind3 <= 2; ind3++) {
        for (let ind4 = 1; ind4 <= 2; ind4++) {
          for (let ind5 = 3; ind5 <= 4; ind5++) {
            for (let ind6 = 5; ind6 <= 5; ind6++) {
              cy.window().then((win) => {
                win.postMessage({
                  doenetML: `
                <text>${ind2}</text>
                <text>${ind3}</text>
                <text>${ind4}</text>
                <text>${ind5}</text>
                <text>${ind6}</text>
                <variantControl nvariants="100"/>
            
                <problem newNamespace name="problem1"><title>A word problem</title>
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
                </problem>
                <select assignnames="(problem2)  (problem3)" numbertoselect="2" withReplacement>
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
                      index: ind4,
                    }, {
                      indices: [ind2, ind3],
                      subvariants: [{
                        index: ind5
                      }, {
                        index: ind6
                      }]
                    }]
                  }
                }, "*");
              });
              // to wait for page to load
              cy.get('#\\/_text1').should('have.text', `${ind2}`)
              cy.get('#\\/_text2').should('have.text', `${ind3}`)
              cy.get('#\\/_text3').should('have.text', `${ind4}`)
              cy.get('#\\/_text4').should('have.text', `${ind5}`)
              cy.get('#\\/_text5').should('have.text', `${ind6}`)

              cy.window().then((win) => {
                let components = Object.assign({}, win.state.components);

                let generatedVariantInfo = {
                  index: 1,
                  name: 'a',
                  meta: {
                    subvariantsSpecified: true,
                    createdBy: "/_document1"
                  },
                  subvariants: [undefined, {
                    indices: [],
                    meta: { createdBy: "/_select1" },
                    subvariants: []
                  }]
                }

                let itemVariantInfo = [];

                let problemInds = [1, ind2, ind3];

                let problemVariantInds = [ind4, ind5, ind6];

                for (let i = 1; i <= 3; i++) {
                  let problem = components['/problem' + i];
                  let variantInd = titlesToInd[problem.stateValues.title];
                  expect(variantInd).eq(problemInds[i - 1]);
                  if (i !== 1) {
                    generatedVariantInfo.subvariants[1].indices.push(variantInd);
                  }

                  let p = problem.activeChildren[4];

                  if (variantInd === 1) {
                    let word = problemAoptions[problemVariantInds[i - 1] - 1];
                    expect(p.activeChildren[1].stateValues.value).eq(word)
                    let selectIndex = problemAselectOptions.indexOf(word) + 1;
                    let problemIndex = problemVariantInds[i - 1];
                    let problemVariantInfo = {
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
                    }
                    if (i === 1) {
                      generatedVariantInfo.subvariants[0] = problemVariantInfo;
                    } else {
                      generatedVariantInfo.subvariants[1].subvariants.push(
                        problemVariantInfo
                      )
                    }
                    itemVariantInfo.push(problemVariantInfo);

                  } else {
                    let number = problemBoptions[problemVariantInds[i - 1] - 1];
                    expect(p.activeChildren[1].stateValues.value).eq(number)
                    let selectIndex = problemBselectOptions.indexOf(number) + 1;
                    let problemIndex = ((problemVariantInds[i - 1] - 1) % 3) + 1;
                    let problemVariantInfo = {
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
                    }
                    generatedVariantInfo.subvariants[1].subvariants.push(
                      problemVariantInfo
                    )
                    itemVariantInfo.push(problemVariantInfo)

                  }

                }

                expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
                  generatedVariantInfo
                )
                expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
                  itemVariantInfo
                )
              })
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
                  expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
                    generatedVariantInfo.subvariants[0].subvariants
                  )

                })
              }
            }
          }
        }
      }
    }

  });

  it('selected problems, one outside select, specify options directly', () => {

    let titlesToInd = {
      "A word problem": 1,
      "A number problem": 2,
    }

    let problemAoptions = ["angry", "bad", "churlish", "drab", "excoriated"];
    let problemBoptions = [1, 2, 3, 4, 5];

    cy.log("Test each combination of problems")
    for (let ind2 = 1; ind2 <= 2; ind2++) {
      for (let ind3 = 2; ind3 <= 2; ind3++) {
        for (let ind4 = 1; ind4 <= 2; ind4++) {
          for (let ind5 = 3; ind5 <= 4; ind5++) {
            for (let ind6 = 5; ind6 <= 5; ind6++) {
              cy.window().then((win) => {
                win.postMessage({
                  doenetML: `
                  <text>${ind2}</text>
                  <text>${ind3}</text>
                  <text>${ind4}</text>
                  <text>${ind5}</text>
                  <text>${ind6}</text>
    
                  <variantControl nvariants="100"/>
              
                  <problem newNamespace name="problem1"><title>A word problem</title>
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
                  </problem>
                  <select assignnames="(problem2)  (problem3)" numbertoselect="2" withReplacement>
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
                      subvariants: [{
                        indices: [ind4]
                      }]
                    }, {
                      indices: [ind2, ind3],
                      subvariants: [{
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
              cy.get('#\\/_text1').should('have.text', `${ind2}`)
              cy.get('#\\/_text2').should('have.text', `${ind3}`)
              cy.get('#\\/_text3').should('have.text', `${ind4}`)
              cy.get('#\\/_text4').should('have.text', `${ind5}`)
              cy.get('#\\/_text5').should('have.text', `${ind6}`)

              cy.window().then((win) => {
                let components = Object.assign({}, win.state.components);

                let generatedVariantInfo = {
                  index: 1,
                  name: 'a',
                  meta: {
                    subvariantsSpecified: true,
                    createdBy: "/_document1"
                  },
                  subvariants: [null, {
                    indices: [],
                    meta: { createdBy: "/_select1" },
                    subvariants: []
                  }]
                }
                let itemVariantInfo = [];

                let problemInds = [1, ind2, ind3];

                let selectInds = [ind4, ind5, ind6];

                for (let i = 1; i <= 3; i++) {
                  let problem = components['/problem' + i];
                  let variantInd = titlesToInd[problem.stateValues.title];
                  expect(variantInd).eq(problemInds[i - 1]);

                  if (i !== 1) {
                    generatedVariantInfo.subvariants[1].indices.push(variantInd);
                  }

                  let p = problem.activeChildren[4];

                  if (variantInd === 1) {
                    expect(p.activeChildren[1].stateValues.value).eq(problemAoptions[selectInds[i - 1] - 1])
                    let problemVariantInfo = {
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
                    }
                    if (i == 1) {
                      generatedVariantInfo.subvariants[0] = problemVariantInfo;
                    } else {
                      generatedVariantInfo.subvariants[1].subvariants.push(
                        problemVariantInfo
                      )
                    }
                    itemVariantInfo.push(problemVariantInfo);
                  } else {
                    expect(p.activeChildren[1].stateValues.value).eq(problemBoptions[selectInds[i - 1] - 1])
                    let problemVariantInfo = {
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
                    }
                    generatedVariantInfo.subvariants[1].subvariants.push(
                      problemVariantInfo
                    )
                    itemVariantInfo.push(problemVariantInfo);
                  }
                }

                expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
                  generatedVariantInfo
                )
                expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
                  itemVariantInfo
                )

              })
            }
          }
        }
      }
    }

  });

  it('selected problems, one without variantcontrol, specify options directly', () => {

    let titlesToInd = {
      "A word problem": 1,
      "A number problem": 2,
    }

    let problemAoptions = ["angry", "bad", "churlish", "drab", "excoriated"];
    let problemBoptions = [1, 2, 3, 4, 5];

    cy.log("Test each combination of problems")
    for (let ind1 = 1; ind1 <= 1; ind1++) {
      for (let ind2 = 2; ind2 <= 2; ind2++) {
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
                      <text>Filler to move children to same spot</text>
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
                  expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
                    generatedVariantInfo.subvariants[0].subvariants
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

  it('problem variants are the same in multiple contexts', () => {


    let problemAlone = `
      <text>a</text>
      <problem name="problem1">
        <p>a = <selectFromSequence assignNames="a" from="1" to="1000" /></p>
        <p>v = <select assignNames="v">a b c d e f g h i j k l m n o p q r s t u v w x y z</select></p>

        <select numberToSelect="2" assignNames="(o1) (o2)">
          <option>
            <select assignNamesSkip="2">
              <option>
                <group newNamespace>
                  <math name="m">x^2</math>
                  <text name="t">apple</text>
                </group>
              </option>
              <option>
                <group newNamespace>
                  <math name="m">y^3</math>
                  <text name="t">banana</text>
                </group>
              </option>
            </select>
          </option>
          <option>
            <group newNamespace>
              <math name="m">2q</math>
              <text name="t">pear</text>
            </group>
          </option>
          <option>
            <group newNamespace>
              <select assignNames="m">uv wx yz</select>
              <selectFromSequence type="letters" assignNames="t" from="gh" to="hg" />
            </group>
          </option>
        </select>

        <p><m>$a$v</m> <answer name="ans1">$a$v</answer></p>

        <p>$(o1/m): <answer name="ans2">$(o1/m)</answer></p>
        <p>$(o1/t): <answer name="ans3" type="text">$(o1/t)</answer></p>

        <p>$(o2/m): <answer name="ans4">$(o2/m)</answer></p>
        <p>$(o2/t): <answer name="ans5" type="text">$(o2/t)</answer></p>

      </problem>
    `

    let problemWithSiblings = `
      <text>a</text>
      <problem newNamespace>
        <p>n = <selectFromSequence from="-99" to="99" assignNames="n" /></p>
        <p><m>$n = </m> <answer>$n</answer></p>
      </problem>
      <problem newNamespace name="problem2">
        <p>a = <selectFromSequence assignNames="a" from="1" to="1000" /></p>
        <p>v = <select assignNames="v">a b c d e f g h i j k l m n o p q r s t u v w x y z</select></p>

        <select numberToSelect="2" assignNames="(o1) (o2)">
          <option>
            <select assignNamesSkip="2">
              <option>
                <group newNamespace>
                  <math name="m">x^2</math>
                  <text name="t">apple</text>
                </group>
              </option>
              <option>
                <group newNamespace>
                  <math name="m">y^3</math>
                  <text name="t">banana</text>
                </group>
              </option>
            </select>
          </option>
          <option>
            <group newNamespace>
              <math name="m">2q</math>
              <text name="t">pear</text>
            </group>
          </option>
          <option>
            <group newNamespace>
              <select assignNames="m">uv wx yz</select>
              <selectFromSequence type="letters" assignNames="t" from="gh" to="hg" />
            </group>
          </option>
        </select>

        <p><m>$a$v</m> <answer name="ans1">$a$v</answer></p>

        <p>$(o1/m): <answer name="ans2">$(o1/m)</answer></p>
        <p>$(o1/t): <answer name="ans3" type="text">$(o1/t)</answer></p>

        <p>$(o2/m): <answer name="ans4">$(o2/m)</answer></p>
        <p>$(o2/t): <answer name="ans5" type="text">$(o2/t)</answer></p>

      </problem>
      <problem newNamespace name="problem3">
        <p>m = <select assignNames='m' type='number'>2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 71 73 79 83 89 97</select></p>
        <p><m>$m = </m> <answer>$m</answer></p>
      </problem>
    `

    let problemRepeated = `
      <text>a</text>
      <problem name="problem1" newNamespace>
        <p>a = <selectFromSequence assignNames="a" from="1" to="1000" /></p>
        <p>v = <select assignNames="v">a b c d e f g h i j k l m n o p q r s t u v w x y z</select></p>

        <select numberToSelect="2" assignNames="(o1) (o2)">
          <option>
            <select assignNamesSkip="2">
              <option>
                <group newNamespace>
                  <math name="m">x^2</math>
                  <text name="t">apple</text>
                </group>
              </option>
              <option>
                <group newNamespace>
                  <math name="m">y^3</math>
                  <text name="t">banana</text>
                </group>
              </option>
            </select>
          </option>
          <option>
            <group newNamespace>
              <math name="m">2q</math>
              <text name="t">pear</text>
            </group>
          </option>
          <option>
            <group newNamespace>
              <select assignNames="m">uv wx yz</select>
              <selectFromSequence type="letters" assignNames="t" from="gh" to="hg" />
            </group>
          </option>
        </select>

        <p><m>$a$v</m> <answer name="ans1">$a$v</answer></p>

        <p>$(o1/m): <answer name="ans2">$(o1/m)</answer></p>
        <p>$(o1/t): <answer name="ans3" type="text">$(o1/t)</answer></p>

        <p>$(o2/m): <answer name="ans4">$(o2/m)</answer></p>
        <p>$(o2/t): <answer name="ans5" type="text">$(o2/t)</answer></p>

      </problem>
      <problem name="problem2" newNamespace>
        <p>a = <selectFromSequence assignNames="a" from="1" to="1000" /></p>
        <p>v = <select assignNames="v">a b c d e f g h i j k l m n o p q r s t u v w x y z</select></p>

        <select numberToSelect="2" assignNames="(o1) (o2)">
          <option>
            <select assignNamesSkip="2">
              <option>
                <group newNamespace>
                  <math name="m">x^2</math>
                  <text name="t">apple</text>
                </group>
              </option>
              <option>
                <group newNamespace>
                  <math name="m">y^3</math>
                  <text name="t">banana</text>
                </group>
              </option>
            </select>
          </option>
          <option>
            <group newNamespace>
              <math name="m">2q</math>
              <text name="t">pear</text>
            </group>
          </option>
          <option>
            <group newNamespace>
              <select assignNames="m">uv wx yz</select>
              <selectFromSequence type="letters" assignNames="t" from="gh" to="hg" />
            </group>
          </option>
        </select>

        <p><m>$a$v</m> <answer name="ans1">$a$v</answer></p>

        <p>$(o1/m): <answer name="ans2">$(o1/m)</answer></p>
        <p>$(o1/t): <answer name="ans3" type="text">$(o1/t)</answer></p>

        <p>$(o2/m): <answer name="ans4">$(o2/m)</answer></p>
        <p>$(o2/t): <answer name="ans5" type="text">$(o2/t)</answer></p>

      </problem>
      <problem name="problem3" newNamespace>
        <p>a = <selectFromSequence assignNames="a" from="1" to="1000" /></p>
        <p>v = <select assignNames="v">a b c d e f g h i j k l m n o p q r s t u v w x y z</select></p>

        <select numberToSelect="2" assignNames="(o1) (o2)">
          <option>
            <select assignNamesSkip="2">
              <option>
                <group newNamespace>
                  <math name="m">x^2</math>
                  <text name="t">apple</text>
                </group>
              </option>
              <option>
                <group newNamespace>
                  <math name="m">y^3</math>
                  <text name="t">banana</text>
                </group>
              </option>
            </select>
          </option>
          <option>
            <group newNamespace>
              <math name="m">2q</math>
              <text name="t">pear</text>
            </group>
          </option>
          <option>
            <group newNamespace>
              <select assignNames="m">uv wx yz</select>
              <selectFromSequence type="letters" assignNames="t" from="gh" to="hg" />
            </group>
          </option>
        </select>

        <p><m>$a$v</m> <answer name="ans1">$a$v</answer></p>

        <p>$(o1/m): <answer name="ans2">$(o1/m)</answer></p>
        <p>$(o1/t): <answer name="ans3" type="text">$(o1/t)</answer></p>

        <p>$(o2/m): <answer name="ans4">$(o2/m)</answer></p>
        <p>$(o2/t): <answer name="ans5" type="text">$(o2/t)</answer></p>

      </problem>
    `

    let problemRepeatedAsExternalCopies = `
      <text>a</text>
      <copy uri="doenet:contentId=bafkreif3jsrmitv2j5urwrmru7ra56aapzniexoul5elyr2y2osd6wxs7i" componentType="problem" assignNames="problem1" />
      <copy uri="doenet:contentId=bafkreif3jsrmitv2j5urwrmru7ra56aapzniexoul5elyr2y2osd6wxs7i" componentType="problem" assignNames="problem2" />
      <copy uri="doenet:contentId=bafkreif3jsrmitv2j5urwrmru7ra56aapzniexoul5elyr2y2osd6wxs7i" componentType="problem" assignNames="problem3" />
    `

    // TODO: how to make this work?
    let problemRepeatedAsCopies = `
      <text>a</text>
      <problem name="problem1" newNamespace>
        <p>a = <selectFromSequence assignNames="a" from="1" to="1000" /></p>
        <p>v = <select assignNames="v">a b c d e f g h i j k l m n o p q r s t u v w x y z</select></p>

        <select numberToSelect="2" assignNames="(o1) (o2)">
          <option>
            <select assignNamesSkip="2">
              <option>
                <group newNamespace>
                  <math name="m">x^2</math>
                  <text name="t">apple</text>
                </group>
              </option>
              <option>
                <group newNamespace>
                  <math name="m">y^3</math>
                  <text name="t">banana</text>
                </group>
              </option>
            </select>
          </option>
          <option>
            <group newNamespace>
              <math name="m">2q</math>
              <text name="t">pear</text>
            </group>
          </option>
          <option>
            <group newNamespace>
              <select assignNames="m">uv wx yz</select>
              <selectFromSequence type="letters" assignNames="t" from="gh" to="hg" />
            </group>
          </option>
        </select>

        <p><m>$a$v</m> <answer name="ans1">$a$v</answer></p>

        <p>$(o1/m): <answer name="ans2">$(o1/m)</answer></p>
        <p>$(o1/t): <answer name="ans3" type="text">$(o1/t)</answer></p>

        <p>$(o2/m): <answer name="ans4">$(o2/m)</answer></p>
        <p>$(o2/t): <answer name="ans5" type="text">$(o2/t)</answer></p>

      </problem>
      <copy target="problem1" assignNames="problem2" />
      <copy target="problem1" assignNames="problem3" />
    `

    let problemRepeatedAsExternalCopiesInPaginator = `
      <text>a</text>
      <paginatorControls paginatorTname="pgn" name="pcontrols" />
      <paginator name="pgn">
        <copy uri="doenet:contentId=bafkreif3jsrmitv2j5urwrmru7ra56aapzniexoul5elyr2y2osd6wxs7i" componentType="problem" assignNames="problem1" />
        <copy uri="doenet:contentId=bafkreif3jsrmitv2j5urwrmru7ra56aapzniexoul5elyr2y2osd6wxs7i" componentType="problem" assignNames="problem2" />
        <copy uri="doenet:contentId=bafkreif3jsrmitv2j5urwrmru7ra56aapzniexoul5elyr2y2osd6wxs7i" componentType="problem" assignNames="problem3" />
      </paginator>
    `


    function checkProblemInstance({ probName, probInfo, components, enterValues = false }) {

      expect(components[`${probName}/a`].stateValues.value.toString()).eq(probInfo.a.toString())
      expect(components[`${probName}/v`].stateValues.value.toString()).eq(probInfo.v.toString())
      expect(components[`${probName}/o1/m`].stateValues.value.toString()).eq(probInfo.o1m.toString())
      expect(components[`${probName}/o1/t`].stateValues.value.toString()).eq(probInfo.o1t.toString())
      expect(components[`${probName}/o2/m`].stateValues.value.toString()).eq(probInfo.o2m.toString())
      expect(components[`${probName}/o2/t`].stateValues.value.toString()).eq(probInfo.o2t.toString())


      if (enterValues) {
        let mathinput1Name = components[`${probName}/ans1`].stateValues.inputChildren[0].componentName;
        let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
        let answer1Correct = cesc('#' + mathinput1Name + "_correct");

        let mathinput2Name = components[`${probName}/ans2`].stateValues.inputChildren[0].componentName;
        let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
        let answer2Correct = cesc('#' + mathinput2Name + "_correct");

        let textinput3Name = components[`${probName}/ans3`].stateValues.inputChildren[0].componentName;
        let textinput3Anchor = cesc('#' + textinput3Name) + "_input";
        let answer3Correct = cesc('#' + textinput3Name + "_correct");

        let mathinput4Name = components[`${probName}/ans4`].stateValues.inputChildren[0].componentName;
        let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
        let answer4Correct = cesc('#' + mathinput4Name + "_correct");

        let textinput5Name = components[`${probName}/ans5`].stateValues.inputChildren[0].componentName;
        let textinput5Anchor = cesc('#' + textinput5Name) + "_input";
        let answer5Correct = cesc('#' + textinput5Name + "_correct");


        cy.get(mathinput1Anchor).type(`${probInfo.a}${probInfo.v.toString()}{enter}`, { force: true });
        cy.get(answer1Correct).should('be.visible');

        cy.get(mathinput2Anchor).type(`${probInfo.o1m.toString()}{enter}`, { force: true });
        cy.get(answer2Correct).should('be.visible');

        cy.get(textinput3Anchor).type(`${probInfo.o1t}{enter}`);
        cy.get(answer3Correct).should('be.visible');

        cy.get(mathinput4Anchor).type(`${probInfo.o2m.toString()}{enter}`, { force: true });
        cy.get(answer4Correct).should('be.visible');

        cy.get(textinput5Anchor).type(`${probInfo.o2t}{enter}`);
        cy.get(answer5Correct).should('be.visible');

      }

    }


    cy.log(`map out first 3 variants`)
    let problemInfo = [];

    for (let ind = 0; ind < 3; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>b</text>
      `}, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load


      cy.window().then((win) => {
        win.postMessage({
          doenetML: problemAlone,
          requestedVariant: {
            subvariants: [{
              index: ind + 1
            }]
          }
        }, "*");
      });

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `a`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);

        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[0].index).eq(ind + 1)

        let thisProbInfo = {};
        let thisProbName = "";

        thisProbInfo.a = components[`${thisProbName}/a`].stateValues.value;
        thisProbInfo.v = components[`${thisProbName}/v`].stateValues.value;
        thisProbInfo.o1m = components[`${thisProbName}/o1/m`].stateValues.value;
        thisProbInfo.o1t = components[`${thisProbName}/o1/t`].stateValues.value;
        thisProbInfo.o2m = components[`${thisProbName}/o2/m`].stateValues.value;
        thisProbInfo.o2t = components[`${thisProbName}/o2/t`].stateValues.value;


        problemInfo.push(thisProbInfo);

      })

    }


    cy.log(`repeat to see if consistent`)

    for (let ind = 0; ind < 3; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>b</text>
      `}, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load


      cy.window().then((win) => {
        win.postMessage({
          doenetML: problemAlone,
          requestedVariant: {
            subvariants: [{
              index: ind + 1
            }]
          }
        }, "*");
      });

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `a`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);

        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[0].index).eq(ind + 1)

        checkProblemInstance({
          probName: "",
          probInfo: problemInfo[ind],
          components,
          enterValues: false
        })


      })

    }


    cy.log(`check with siblings`)

    for (let ind = 0; ind < 3; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>b</text>
      `}, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load


      cy.window().then((win) => {
        win.postMessage({
          doenetML: problemWithSiblings,
          requestedVariant: {
            subvariants: [
              { index: 2 * ind },
              { index: ind + 1 },
              { index: -ind },
            ]
          }
        }, "*");
      });

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `a`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);

        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[1].index).eq(ind + 1)

        checkProblemInstance({
          probName: "/problem2",
          probInfo: problemInfo[ind],
          components,
          enterValues: false
        })


      })

    }

    cy.log(`check repeated`)

    for (let ind = 0; ind < 3; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>b</text>
      `}, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load


      cy.window().then((win) => {
        win.postMessage({
          doenetML: problemRepeated,
          requestedVariant: {
            subvariants: [
              { index: 3 - ind },
              { index: (ind + 1) % 3 + 1 },
              { index: (4 - ind) % 3 + 1 },
            ]
          }
        }, "*");
      });

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `a`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);

        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[0].index).eq(3 - ind)
        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[1].index).eq((ind + 1) % 3 + 1)
        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[2].index).eq((4 - ind) % 3 + 1)

        checkProblemInstance({
          probName: "/problem1",
          probInfo: problemInfo[3 - ind - 1],
          components,
          enterValues: false
        })

        checkProblemInstance({
          probName: "/problem2",
          probInfo: problemInfo[(ind + 1) % 3],
          components,
          enterValues: false
        })

        checkProblemInstance({
          probName: "/problem3",
          probInfo: problemInfo[(4 - ind) % 3],
          components,
          enterValues: false
        })



      })

    }

    cy.log(`check repeated as external copies`)

    for (let ind = 0; ind < 3; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>b</text>
      `}, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load


      cy.window().then((win) => {
        win.postMessage({
          doenetML: problemRepeatedAsExternalCopies,
          requestedVariant: {
            subvariants: [
              { index: 3 - ind },
              { index: (ind + 1) % 3 + 1 },
              { index: (4 - ind) % 3 + 1 },
            ]
          }
        }, "*");
      });

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `a`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);

        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[0].index).eq(3 - ind)
        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[1].index).eq((ind + 1) % 3 + 1)
        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[2].index).eq((4 - ind) % 3 + 1)

        checkProblemInstance({
          probName: "/problem1",
          probInfo: problemInfo[3 - ind - 1],
          components,
          enterValues: false
        })

        checkProblemInstance({
          probName: "/problem2",
          probInfo: problemInfo[(ind + 1) % 3],
          components,
          enterValues: false
        })

        checkProblemInstance({
          probName: "/problem3",
          probInfo: problemInfo[(4 - ind) % 3],
          components,
          enterValues: false
        })



      })

    }


    // cy.log(`check repeated as internal copies`)

    // for (let ind = 0; ind < 3; ind++) {

    //   cy.window().then((win) => {
    //     win.postMessage({
    //       doenetML: `
    //   <text>b</text>
    //   `}, "*");
    //   });
    //   cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load


    //   cy.window().then((win) => {
    //     win.postMessage({
    //       doenetML: problemRepeatedAsCopies,
    //       requestedVariant: {
    //         subvariants: [
    //           { index: 3 - ind },
    //           { index: (ind + 1) % 3 + 1 },
    //           { index: (4 - ind) % 3 + 1 },
    //         ]
    //       }
    //     }, "*");
    //   });

    //   // to wait for page to load
    //   cy.get('#\\/_text1').should('have.text', `a`)

    //   cy.window().then((win) => {

    //     let components = Object.assign({}, win.state.components);

    //     console.log(JSON.parse(JSON.stringify(components["/_document1"].stateValues.generatedVariantInfo)))

    //     console.log(components)

    //     expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[0].index).eq(3 - ind)
    //     expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[1].index).eq((ind + 1) % 3 + 1)
    //     expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[2].index).eq((4 - ind) % 3 + 1)

    //     checkProblemInstance({
    //       probName: "/problem1",
    //       probInfo: problemInfo[3-ind-1],
    //       components,
    //       enterValues: true
    //     })

    //     checkProblemInstance({
    //       probName: "/problem2",
    //       probInfo: problemInfo[(ind + 1) % 3],
    //       components,
    //       enterValues: true
    //     })

    //     checkProblemInstance({
    //       probName: "/problem3",
    //       probInfo: problemInfo[(4 - ind) % 3],
    //       components,
    //       enterValues: true
    //     })

    //   })

    // }


    cy.log(`check repeated as external copies in paginator`)

    for (let ind = 0; ind < 3; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
      <text>b</text>
      `}, "*");
      });
      cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load


      cy.window().then((win) => {
        win.postMessage({
          doenetML: problemRepeatedAsExternalCopiesInPaginator,
          requestedVariant: {
            subvariants: [
              { index: 3 - ind },
              { index: (ind + 1) % 3 + 1 },
              { index: (4 - ind) % 3 + 1 },
            ]
          }
        }, "*");
      });

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `a`)

      cy.window().then((win) => {

        let components = Object.assign({}, win.state.components);

        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[0].index).eq(3 - ind)
        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[1].index).eq((ind + 1) % 3 + 1)
        expect(components["/_document1"].stateValues.generatedVariantInfo.subvariants[2].index).eq((4 - ind) % 3 + 1)

        checkProblemInstance({
          probName: "/problem1",
          probInfo: problemInfo[3 - ind - 1],
          components,
          enterValues: false
        })

        cy.get(cesc('#/pcontrols_next')).click()
        cy.wait(100)
        cy.window().then((win) => {

          let components = Object.assign({}, win.state.components);
          checkProblemInstance({
            probName: "/problem2",
            probInfo: problemInfo[(ind + 1) % 3],
            components,
            enterValues: false
          })
        })

        cy.get(cesc('#/pcontrols_next')).click()
        cy.wait(100)
        cy.window().then((win) => {

          let components = Object.assign({}, win.state.components);
          checkProblemInstance({
            probName: "/problem3",
            probInfo: problemInfo[(4 - ind) % 3],
            components,
            enterValues: false
          })
        })

      })

    }


  })



});