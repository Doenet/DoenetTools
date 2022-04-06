import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}


describe('Specifying unique variant tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('single select', () => {

    let values = ["u", "v", "w", "x", "y", "z"]

    cy.log("get all values in order and they repeat in next variants")
    for (let ind = 1; ind <= 18; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <select assignnames="x">u v w x y z</select>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.get('#\\/x .mjx-mrow').should('have.text', values[(ind - 1) % 6])

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/x'].stateValues.value).eq(values[(ind - 1) % 6])
      })
    }

  });

  it('single selectfromsequence', () => {

    cy.log("get all values in order and they repeat in next variants")
    for (let ind = 1; ind <= 15; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      };

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <selectfromsequence assignnames="x" length="5" />
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.get('#\\/x').should('have.text', (ind - 1) % 5 + 1)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/x'].stateValues.value).eq((ind - 1) % 5 + 1)
      })
    }


  });

  it('selectfromsequence with excludes', () => {

    cy.log("get all values in order and they repeat in next variants")
    for (let ind = 1; ind <= 12; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      };

      let letters = ["c", "e", "i", "m"]

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <selectfromsequence assignnames="x" type="letters" from="c" to="m" step="2" exclude="g k" />
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.get('#\\/x').should('have.text', letters[(ind - 1) % 4])

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/x'].stateValues.value).eq(letters[(ind - 1) % 4])
      })
    }


  });

  it('select and selectfromsequence combination', () => {

    let valuesW = ["m", "n"]
    let valuesX = ["x", "y", "z"];
    let valuesY = [2, 3, 4];
    let valuesZ = [3, 7];

    let values = [];
    for (let w of valuesW) {
      for (let x of valuesX) {
        for (let y of valuesY) {
          for (let z of valuesZ) {
            values.push([w, x, y, z].join(','));
          }
        }
      }
    }
    let valuesFound = [];

    let numVariants = valuesW.length * valuesX.length * valuesY.length * valuesZ.length;

    let wsFound = [], xsFound = [], ysFound = [], zsFound = [];

    cy.log("get all values in variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <selectfromsequence type="letters" assignnames="w" from="m" to="n" />
        <select assignnames="x">x y z</select>
        <selectfromsequence assignnames="y" from="2" to="4" />
        <select assignnames="z">3 7</select>
      </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newW = stateVariables['/w'].stateValues.value;
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newW, newX, newY, newZ].join(',')
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 3) {
          wsFound.push(newW);
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }
      })
    }

    cy.log("all individual options selected in first variants")
    cy.window().then(async (win) => {
      expect(wsFound.slice(0, 2).sort()).eqls(valuesW)
      expect(xsFound.sort()).eqls(valuesX);
      expect(ysFound.sort()).eqls(valuesY);
      expect(zsFound.slice(0, 2).sort()).eqls(valuesZ)
    })

    cy.log("values begin to repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 15; ind += 3) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <selectfromsequence type="letters" assignnames="w" from="m" to="n" />
        <select assignnames="x">x y z</select>
        <selectfromsequence assignnames="y" from="2" to="4" />
        <select assignnames="z">3 7</select>
      </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newW = stateVariables['/w'].stateValues.value;
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newW, newX, newY, newZ].join(',')

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants])
      })
    }


  });

  it('select multiple', () => {

    let valuesSingle = ["w", "x", "y", "z"]
    let valuesFound = [];
    let values = [];
    for (let x of valuesSingle) {
      for (let y of valuesSingle) {
        if (y == x) {
          continue;
        }
        for (let z of valuesSingle) {
          if (z === x || z === y) {
            continue;
          }
          values.push([x, y, z].join(','));
        }
      }
    }

    let numVariants = values.length;

    let xsFound = [], ysFound = [], zsFound = [];


    cy.log("get all values in first variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x y z" numbertoselect="3">w x y z</select>
        </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newX, newY, newZ].join(',')
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 4) {
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }

      })
    }

    cy.log("all individual options selected in first variants")
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle)
    })

    cy.log("values begin to repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x y z" numbertoselect="3">w x y z</select>
        </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newX, newY, newZ].join(',')

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants])
      })
    }


  });

  it('select multiple with replacement', () => {

    let valuesSingle = ["x", "y", "z"]
    let valuesFound = [];
    let values = [];
    for (let x of valuesSingle) {
      for (let y of valuesSingle) {
        for (let z of valuesSingle) {
          values.push([x, y, z].join(','));
        }
      }
    }

    let numVariants = values.length;
    let xsFound = [], ysFound = [], zsFound = [];

    cy.log("get all values in first variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x y z" numbertoselect="3" withreplacement>x y z</select>
        </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newX, newY, newZ].join(',')
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);


        if (ind <= 3) {
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }
      })
    }

    cy.log("all individual options selected in first variants")
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle)
    })

    cy.log("values begin to repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x y z" numbertoselect="3" withreplacement>x y z</select>
        </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newX, newY, newZ].join(',')

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants])
      })
    }

  });

  it('select multiple from sequence', () => {

    let valuesSingle = ["w", "x", "y", "z"]
    let valuesFound = [];
    let values = [];
    for (let x of valuesSingle) {
      for (let y of valuesSingle) {
        if (y == x) {
          continue;
        }
        for (let z of valuesSingle) {
          if (z === x || z === y) {
            continue;
          }
          values.push([x, y, z].join(','));
        }
      }
    }

    let numVariants = values.length;
    let xsFound = [], ysFound = [], zsFound = [];

    cy.log("get all values in first variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x y z" numbertoselect="3" from="w" to="z" />
        </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newX, newY, newZ].join(',')
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 4) {
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }
      })
    }

    cy.log("all individual options selected in first variants")
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle)
    })

    cy.log("values begin to repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x y z" numbertoselect="3" from="w" to="z" />
        </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newX, newY, newZ].join(',')

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants])

      })
    }

  });

  it('select multiple from sequence with replacement', () => {

    let valuesSingle = ["x", "y", "z"]
    let valuesFound = [];
    let values = [];
    for (let x of valuesSingle) {
      for (let y of valuesSingle) {
        for (let z of valuesSingle) {
          values.push([x, y, z].join(','));
        }
      }
    }

    let numVariants = values.length;
    let xsFound = [], ysFound = [], zsFound = [];

    cy.log("get all values in first variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x y z" numbertoselect="3" withreplacement from="x" to="z" />
        </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newX, newY, newZ].join(',')
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 3) {
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }
      })
    }

    cy.log("all individual options selected in first variants")
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle)
    })

    cy.log("values begin to repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x y z" numbertoselect="3" withreplacement from="x" to="z" />
        </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newX, newY, newZ].join(',')

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants])
      })
    }


  });

  it('limit variants', () => {

    let valuesSingle = ["u", "v", "w", "x", "y", "z"]
    let valuesFound = [];
    let values = [];
    for (let w of valuesSingle) {
      for (let x of valuesSingle) {
        for (let y of valuesSingle) {
          for (let z of valuesSingle) {
            values.push([w, x, y, z].join(','));
          }
        }
      }
    }

    let numVariants = 10;
    let wsFound = [], xsFound = [], ysFound = [], zsFound = [];

    cy.log("get unique values in first variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants nvariants="10" />
        <aslist>
          <selectfromsequence type="letters" assignnames="w x y z" numbertoselect="4" withreplacement from="u" to="z" />
        </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newW = stateVariables['/w'].stateValues.value;
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newW, newX, newY, newZ].join(',')
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 6) {
          wsFound.push(newW);
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }

      })
    }

    cy.log("all individual options selected in first variants")
    cy.window().then(async (win) => {
      expect(wsFound.sort()).eqls(valuesSingle);
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle)
    })

    cy.log("values repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= 2 * numVariants + 3; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants nvariants="10" />
        <aslist>
          <selectfromsequence type="letters" assignnames="w x y z" numbertoselect="4" withreplacement from="u" to="z" />
        </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newW = stateVariables['/w'].stateValues.value;
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newZ = stateVariables['/z'].stateValues.value;
        let newValue = [newW, newX, newY, newZ].join(',')

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants])
      })
    }


  });

  it('selects of selectfromsequence', () => {

    let valuesFound = [];
    let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let numVariants = values.length;

    cy.log("get all values in first variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="((x))">
        <option>
          <selectfromsequence from="1" to="2" />
        </option>
        <option>
          <selectfromsequence from="101" to="103" />
        </option>
        <option>
          <selectfromsequence from="201" to="204" />
        </option>
      </select>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x'].stateValues.value;
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind === 3) {
          cy.log("all individual groups selected in first variants")
          cy.window().then(async (win) => {
            expect(valuesFound.some(x => x <= 2)).eq(true);
            expect(valuesFound.some(x => x >= 101 && x <= 103)).eq(true);
            expect(valuesFound.some(x => x >= 201 && x <= 204)).eq(true);
          })
        }

        if (ind === 6) {
          cy.log("all individual groups selected twice in first variants")
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
            expect(valuesFound.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(2);
            expect(valuesFound.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(2);
          })
        }

        if (ind === 8) {
          cy.log("most individual groups selected three times in first variants")
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
            expect(valuesFound.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(3);
            expect(valuesFound.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(3);
          })
        }

      })
    }


    cy.log("values repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="((x))">
        <option>
          <selectfromsequence from="1" to="2" />
        </option>
        <option>
          <selectfromsequence from="101" to="103" />
        </option>
        <option>
          <selectfromsequence from="201" to="204" />
        </option>
      </select>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x'].stateValues.value;
        expect(newValue).eq(valuesFound[(ind - 1) % numVariants])

      })
    }

  });

  it('selects of selects', () => {

    let valuesFound = [];
    let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let numVariants = values.length;

    cy.log("get all values in first variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="((x))">
        <option>
          <select>1 2</select>
        </option>
        <option>
          <select>101 102 103</select>
        </option>
        <option>
          <select>201 202 203 204</select>
        </option>
      </select>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x'].stateValues.value;
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind === 3) {
          cy.log("all individual groups selected in first variants")
          cy.window().then(async (win) => {
            expect(valuesFound.some(x => x <= 2)).eq(true);
            expect(valuesFound.some(x => x >= 101 && x <= 103)).eq(true);
            expect(valuesFound.some(x => x >= 201 && x <= 204)).eq(true);
          })
        }

        if (ind === 6) {
          cy.log("all individual groups selected twice in first variants")
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
            expect(valuesFound.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(2);
            expect(valuesFound.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(2);
          })
        }

        if (ind === 8) {
          cy.log("most individual groups selected three times in first variants")
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
            expect(valuesFound.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(3);
            expect(valuesFound.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(3);
          })
        }

      })
    }


    cy.log("values repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="((x))">
        <option>
          <select>1 2</select>
        </option>
        <option>
          <select>101 102 103</select>
        </option>
        <option>
          <select>201 202 203 204</select>
        </option>
      </select>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x'].stateValues.value;
        expect(newValue).eq(valuesFound[(ind - 1) % numVariants])

      })
    }

  });

  it('selects of paragraphs of selects/selectfromsequence', () => {

    let valuesFound = [];
    let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let numVariants = values.length;

    cy.log("get all values in first variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="x">
        <option newNamespace>
          <p><select assignnames="n">1 2</select></p>
        </option>
        <option newNamespace>
         <p><selectfromsequence assignnames="n" from="101" to="103"/></p>
        </option>
        <option newNamespace>
          <p><select assignnames="n">201 202 203 204</select></p>
        </option>
      </select>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x/n'].stateValues.value;
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind === 3) {
          cy.log("all individual groups selected in first variants")
          cy.window().then(async (win) => {
            expect(valuesFound.some(x => x <= 2)).eq(true);
            expect(valuesFound.some(x => x >= 101 && x <= 103)).eq(true);
            expect(valuesFound.some(x => x >= 201 && x <= 204)).eq(true);
          })
        }

        if (ind === 6) {
          cy.log("all individual groups selected twice in first variants")
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
            expect(valuesFound.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(2);
            expect(valuesFound.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(2);
          })
        }

        if (ind === 8) {
          cy.log("most individual groups selected three times in first variants")
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
            expect(valuesFound.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(3);
            expect(valuesFound.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(3);
          })
        }

      })
    }


    cy.log("values repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="x">
        <option newNamespace>
          <p><select assignnames="n">1 2</select></p>
        </option>
        <option newNamespace>
         <p><selectfromsequence assignnames="n" from="101" to="103"/></p>
        </option>
        <option newNamespace>
          <p><select assignnames="n">201 202 203 204</select></p>
        </option>
      </select>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x/n'].stateValues.value;
        expect(newValue).eq(valuesFound[(ind - 1) % numVariants])

      })
    }

  });

  it('selects of selects, select multiple', () => {

    let valuesFound = [];
    let valuesSingle = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let values = [];
    for (let x of valuesSingle) {
      for (let y of valuesSingle) {
        if (Math.abs(y - x) > 5) {
          values.push([x, y].join(','));
        }
      }
    }
    let numVariants = values.length;

    cy.log("get unique values in first variants")
    for (let ind = 1; ind <= 20; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="((x)) ((y))" numberToSelect="2">
          <option>
            <select>1 2</select>
          </option>
          <option>
            <select>101 102 103</select>
          </option>
          <option>
            <select>201 202 203 204</select>
          </option>
        </select>
      </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newValue = [newX, newY].join(',');
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

      })
    }


    cy.log("values repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 20; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="((x)) ((y))" numberToSelect="2">
          <option>
            <select>1 2</select>
          </option>
          <option>
            <select>101 102 103</select>
          </option>
          <option>
            <select>201 202 203 204</select>
          </option>
        </select>
      </aslist>
      `,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x'].stateValues.value;
        let newY = stateVariables['/y'].stateValues.value;
        let newValue = [newX, newY].join(',');
        expect(newValue).eq(valuesFound[(ind - 1) % numVariants])
      })
    }

    cy.log("selects all individual groups equally in first variants")
    let valuesFound1 = [];
    let valuesFound2 = [];
    for (let pass = 0; pass < 12; pass++) {
      for (let ind = pass * 3 + 1; ind <= (pass + 1) * 3; ind++) {

        // reload every 10 times to keep it from slowing down
        // (presumably due to garbage collecting)
        if (ind % 10 === 0) {
          cy.reload();
        }

        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="((x)) ((y))" numberToSelect="2">
            <option>
              <select>1 2</select>
            </option>
            <option>
              <select>101 102 103</select>
            </option>
            <option>
              <select>201 202 203 204</select>
            </option>
          </select>
        </aslist>
        `,
            requestedVariant: { index: ind },
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`);

        cy.window().then(async (win) => {

          let stateVariables = await win.returnAllStateVariables1();
          valuesFound1.push(stateVariables['/x'].stateValues.value);
          valuesFound2.push(stateVariables['/y'].stateValues.value);
        })
      }
      cy.window().then(async (win) => {
        expect(valuesFound1.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(pass + 1);
        expect(valuesFound1.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(pass + 1);
        expect(valuesFound1.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(pass + 1);
        expect(valuesFound2.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(pass + 1);
        expect(valuesFound2.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(pass + 1);
        expect(valuesFound2.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(pass + 1);
      })
    }

  });

  it('deeper nesting of selects/selectfromsequence', () => {

    let doenetML = `
    <variantControl nvariants="24" uniquevariants/>
    <select assignnames="(p)">
      <option>
        <p>Favorite color:
          <select>
            <option>
              <select type="text">red orange yellow magenta maroon fuchsia scarlet</select>
            </option>
            <option>
              <select type="text">green chartreuse turquoise</select>
            </option>
            <option>
              <select type="text">white black</select>
            </option>
          </select>
        </p>
      </option>
      <option>
        <p>Selected number:
          <select>
            <option><selectfromsequence from="1000" to="2000" /></option>
            <option><selectfromsequence from="-1000" to="-900" /></option>
          </select>
        </p>
      </option>
      <option>
        <p>Chosen letter: <selectfromsequence type="letters" from="a" to="z" /></p>
      </option>
      <option>
        <p>Variable:
          <select>u v w x y z</select>
        </p>
      </option>
    </select>
    `

    let valuesFound = [];

    let colorsA = ["red", "orange", "yellow", "magenta", "maroon", "fuchsia", "scarlet"];
    let colorsB = ["green", "chartreuse", "turquoise"];
    let colorsC = ["white", "black"];
    let allColors = [...colorsA, ...colorsB, ...colorsC];

    let letters = [...Array(26)].map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i));

    let variables = ["u", "v", "w", "x", "y", "z"];

    let categories = ["Favorite color:", "Selected number:", "Chosen letter:", "Variable:"];

    let numVariants = 24;

    let colorsFound = [];
    let numbersFound = [];
    let lettersFound = [];
    let variablesFound = [];
    let categoriesFound = [];

    cy.log("get all values in first variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let category = stateVariables['/p'].activeChildren[0].trim();
        expect(categories.includes(category)).eq(true);

        let component = stateVariables[stateVariables['/p'].activeChildren.filter(x => x.componentName)[0].componentName];
        let newValue = component.stateValues.value;
        if (category === categories[0]) {
          expect(allColors.includes(newValue)).eq(true);
          colorsFound.push(newValue);
        } else if (category === categories[1]) {
          let validNum = Number.isInteger(newValue) && (
            (newValue >= 1000 && newValue <= 2000) ||
            (newValue >= -1000 && newValue <= -900)
          )
          expect(validNum).eq(true);
          numbersFound.push(newValue);
        } else if (category === categories[2]) {
          expect(letters.includes(newValue)).eq(true);
          lettersFound.push(newValue);
        } else {
          expect(variables.includes(newValue)).eq(true);
          variablesFound.push(newValue);
        }

        let combinedValue = [category, newValue].join(",");

        expect(valuesFound.includes(combinedValue)).eq(false);
        valuesFound.push(combinedValue);

        categoriesFound.push(category);

        if (ind === 4) {
          cy.log("all individual groups selected in first variants")
          cy.window().then(async (win) => {
            for (let ind = 0; ind < 4; ind++) {
              expect(categoriesFound.includes(categories[ind])).eq(true);
            }
          })
        }

        if (ind === 8) {
          cy.log("all individual groups selected twice in first variants")
          cy.window().then(async (win) => {
            for (let ind = 0; ind < 4; ind++) {
              expect(categoriesFound.slice(4, 8).includes(categories[ind])).eq(true);
            }
          })
        }

      })
    }

    cy.log('the 24 values are distributed 6 to each category and evenly distributed across subcategories')
    cy.window().then(async (win) => {
      let colorsFoundSet = new Set(colorsFound);
      expect(colorsFoundSet.size).eq(6);
      expect(colorsA.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(2);
      expect(colorsB.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(2);
      expect(colorsC.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(2);

      expect(numbersFound.reduce((a, c) => a + ((c > 0 ? 1 : 0)), 0)).eq(3)
      expect(numbersFound.reduce((a, c) => a + ((c < 0 ? 1 : 0)), 0)).eq(3)

      expect(lettersFound.length).eq(6);
      expect(variablesFound.length).eq(6);

      expect(variablesFound.sort()).eqls(variables);

    });


    cy.log("values repeat in next variants")
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let category = stateVariables['/p'].activeChildren[0].trim();
        let component = stateVariables[stateVariables['/p'].activeChildren.filter(x => x.componentName)[0].componentName];
        let newValue = component.stateValues.value;
        let combinedValue = [category, newValue].join(",");
        expect(combinedValue).eq(valuesFound[(ind - 1) % numVariants])
      })
    }

  });

  it('select problems of selects/selectfromsequence', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    let doenetML = `
    <variantControl nvariants="6" uniquevariants/>
    <select assignnames="(problem)">
      <option>
        <problem newNamespace><title>Favorite color</title>
          <select assignNames="(p)">
            <option>
              <p newNamespace>I like 
                <select type="text" assignNames="color">red orange yellow magenta maroon fuchsia scarlet</select>
              </p>
            </option>
            <option>
              <p newNamespace>You like
                <select type="text" assignNames="color">green chartreuse turquoise</select>
              </p>
            </option>
          </select>
          <p>Enter the color $(p/color): <answer name="ans" type="text">$(p/color)</answer></p>
        </problem>
      </option>
      <option>
        <problem newNamespace><title>Selected word</title>
          <select assignNames="(p)">
            <option><p newNamespace>Verb: <select type="text" assignNames="word">run walk jump skip</select></p></option>
            <option><p newNamespace>Adjective: <select type="text" assignNames="word">soft scary large empty residual limitless</select></p></option>
          </select>
          <p>Enter the word $(p/word): <answer name="ans" type="text">$(p/word)</answer></p>
        </problem>
      </option>
      <option>
        <problem newNamespace><title>Chosen letter</title>
          <p>Letter
            <selectfromsequence  assignNames="l" type="letters" from="a" to="z" />
          </p>
          <p>Enter the letter $l: <answer name="ans" type="text">$l</answer></p>
        </problem>
      </option>
    </select>
    `

    let valuesFound = [];

    let colorsA = ["red", "orange", "yellow", "magenta", "maroon", "fuchsia", "scarlet"];
    let colorsB = ["green", "chartreuse", "turquoise"];
    let allColors = [...colorsA, ...colorsB];

    let wordsA = ["run", "walk", "jump", "skip"];
    let wordsB = ["soft", "scary", "large", "empty", "residual", "limitless"];
    let allWords = [...wordsA, ...wordsB];

    let letters = [...Array(26)].map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i));

    let categories = ["Favorite color", "Selected word", "Chosen letter"];

    let numVariants = 6;

    let categoriesFound = [];
    let colorsFound = [];
    let wordsFound = [];
    let lettersFound = [];

    cy.log("get all values in first variants")
    for (let ind = 1; ind <= numVariants; ind++) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      let category, newValue;


      let textinputName;


      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();

        textinputName = stateVariables[`/problem/ans`].stateValues.inputChildren[0].componentName;
        category = stateVariables['/problem'].stateValues.title;
        expect(categories.includes(category)).eq(true);

        let component = stateVariables[stateVariables[stateVariables['/problem'].activeChildren.filter(x => x.componentName)[1].componentName].activeChildren[1].componentName];
        newValue = component.stateValues.value;
        if (category === categories[0]) {
          expect(allColors.includes(newValue)).eq(true);
          colorsFound.push(newValue);


        } else if (category === categories[1]) {
          expect(allWords.includes(newValue)).eq(true);
          wordsFound.push(newValue);
        } else if (category === categories[2]) {
          expect(letters.includes(newValue)).eq(true);
          lettersFound.push(newValue);
        }

        let combinedValue = [category, newValue].join(",");

        expect(valuesFound.includes(combinedValue)).eq(false);
        valuesFound.push(combinedValue);


        categoriesFound.push(category);

        if (ind === 3) {
          cy.log("all individual groups selected in first variants")
          cy.window().then(async (win) => {
            for (let ind = 0; ind < 3; ind++) {
              expect(categoriesFound.includes(categories[ind])).eq(true);
            }
          })
        }

        if (ind === 6) {
          cy.log("all individual groups selected twice in first variants")
          cy.window().then(async (win) => {
            for (let ind = 0; ind < 3; ind++) {
              expect(categoriesFound.slice(3).includes(categories[ind])).eq(true);
            }
          })
        }

      })


      cy.window().then(async (win) => {
        let textinputAnchor = cesc('#' + textinputName) + "_input";
        let answerCorrect = cesc('#' + textinputName + "_correct");
        let answerIncorrect = cesc('#' + textinputName + "_incorrect");
        let answerSubmit = cesc('#' + textinputName + "_submit");

        cy.get(textinputAnchor).type(`${newValue}{enter}`);

        cy.get(answerCorrect).should('be.visible');

        cy.window().then(async (win) => {

          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/problem/ans"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/problem/ans"].stateValues.submittedResponses).eqls([newValue]);
          expect(stateVariables[textinputName].stateValues.value).eq(newValue)

        });

        cy.wait(2000);  // wait for 1 second debounce

        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariant: { index: ind },
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`);

        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/problem/ans"];
        }))

        cy.get(answerCorrect).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/problem/ans"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/problem/ans"].stateValues.submittedResponses).eqls([newValue]);
          expect(stateVariables[textinputName].stateValues.value).eq(newValue)
        });


        cy.get(textinputAnchor).type(`{end}X`);
        cy.get(answerSubmit).click()
        cy.get(answerIncorrect).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/problem/ans"].stateValues.creditAchieved).eq(0);
          expect(stateVariables["/problem/ans"].stateValues.submittedResponses).eqls([newValue + "X"]);
          expect(stateVariables[textinputName].stateValues.value).eq(newValue + "X")
        });

        cy.get(textinputAnchor).type(`{end}{backspace}`);
        cy.get(answerSubmit).click()
        cy.get(answerCorrect).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/problem/ans"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/problem/ans"].stateValues.submittedResponses).eqls([newValue]);
          expect(stateVariables[textinputName].stateValues.value).eq(newValue)
        });


      })

    }

    cy.window().then(async (win) => {
      let colorsFoundSet = new Set(colorsFound);
      expect(colorsFoundSet.size).eq(2);
      expect(colorsA.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(1);
      expect(colorsB.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(1);

      let wordsFoundSet = new Set(wordsFound);
      expect(wordsFoundSet.size).eq(2);
      expect(wordsA.reduce((a, c) => a + (wordsFoundSet.has(c) ? 1 : 0), 0)).eq(1);
      expect(wordsB.reduce((a, c) => a + (wordsFoundSet.has(c) ? 1 : 0), 0)).eq(1);


    });


    cy.log("values repeat in next variants")
    for (let ind = numVariants + 1; ind <= numVariants + 6; ind += 2) {

      cy.get('#testRunner_toggleControls').click();
      cy.get('#testRunner_newAttempt').click()
      cy.wait(100)
      cy.get('#testRunner_toggleControls').click();
      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariant: { index: ind },
        }, "*");
      })

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let category = stateVariables['/problem'].stateValues.title;
        let component = stateVariables[stateVariables[stateVariables['/problem'].activeChildren.filter(x => x.componentName)[1].componentName].activeChildren[1].componentName];
        let newValue = component.stateValues.value;
        let combinedValue = [category, newValue].join(",");
        expect(combinedValue).eq(valuesFound[(ind - 1) % numVariants])
      })
    }


  });

  it('can get unique with map without variants', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    let doenetML = `
    <variantControl uniquevariants />
    <selectfromsequence assignnames="x" length="3" />
    <map assignNames="(p1) (p2) (p3) (p4)">
      <template>
        <p>letter: $v</p>
      </template>
      <sources alias="v">
        <sequence type="letters" length="$n" />
      </sources>
    </map>
    <p>N: <mathinput name="n" prefill="1" /></p>
    `

    cy.log("get all values in order and they repeat in next variants")
    for (let ind = 1; ind <= 4; ind++) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>${doenetML}`,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.get('#\\/x').should('have.text', (ind - 1) % 3 + 1)

      cy.get('#\\/p1').should('have.text', 'letter: a')
      cy.get('#\\/p2').should('not.exist')

      cy.get('#\\/n textarea').type("{end}{backspace}3{enter}", { force: true })
      cy.get('#\\/p1').should('have.text', 'letter: a')
      cy.get('#\\/p2').should('have.text', 'letter: b')
      cy.get('#\\/p3').should('have.text', 'letter: c')


      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/x'].stateValues.value).eq((ind - 1) % 3 + 1)
        expect(stateVariables[stateVariables["/p1"].activeChildren[1].componentName].stateValues.value).eq('a')
        expect(stateVariables[stateVariables["/p2"].activeChildren[1].componentName].stateValues.value).eq('b')
        expect(stateVariables[stateVariables["/p3"].activeChildren[1].componentName].stateValues.value).eq('c')
      })



      cy.wait(2000);  // wait for 1 second debounce
      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>${doenetML}`,
          requestedVariant: { index: ind },
        }, "*");
      })

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      // wait until core is loaded
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        return stateVariables["/x"];
      }))

      cy.get('#\\/x').should('have.text', (ind - 1) % 3 + 1)

      cy.get('#\\/p1').should('have.text', 'letter: a')
      cy.get('#\\/p2').should('have.text', 'letter: b')
      cy.get('#\\/p3').should('have.text', 'letter: c')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/x'].stateValues.value).eq((ind - 1) % 3 + 1)
        expect(stateVariables[stateVariables["/p1"].activeChildren[1].componentName].stateValues.value).eq('a')
        expect(stateVariables[stateVariables["/p2"].activeChildren[1].componentName].stateValues.value).eq('b')
        expect(stateVariables[stateVariables["/p3"].activeChildren[1].componentName].stateValues.value).eq('c')
      })

      cy.get('#\\/n textarea').type("{end}{backspace}4{enter}", { force: true })
      cy.get('#\\/p1').should('have.text', 'letter: a')
      cy.get('#\\/p2').should('have.text', 'letter: b')
      cy.get('#\\/p3').should('have.text', 'letter: c')
      cy.get('#\\/p4').should('have.text', 'letter: d')

    }


  });

  it('single randomized choiceinput', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

  
    let doenetML = `
    <variantControl uniquevariants />
    <choiceinput name="ci" randomizeOrder>
      <choice>red</choice>
      <choice>blue</choice>
      <choice>green</choice>
    </choiceinput>
    <p>Selected value: <copy prop='selectedvalue' target="ci" assignNames="selectedValue" /></p>

    `

    let ordersFound = [];
    let choices = ["red", "blue", "green"];

    cy.log("get all orders in first 6 variants")
    for (let ind = 1; ind <= 6; ind++) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let choiceOrder = stateVariables['/ci'].stateValues.choiceOrder;
        let selectedOrder = choiceOrder.join(",")
        expect(ordersFound.includes(selectedOrder)).eq(false);
        ordersFound.push(selectedOrder);

        for (let i = 0; i < 3; i++) {
          cy.get(`#\\/ci_choice${i + 1}_input`).click();
          cy.get('#\\/selectedValue').should('have.text', choices[choiceOrder[i]-1])
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[i]-1]])
          });
        }

        cy.wait(2000);  // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariant: { index: ind },
          }, "*");
        })
  
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)
  
        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/ci"];
        }))
  
        cy.get('#\\/selectedValue').should('have.text', choices[choiceOrder[2]-1])

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[2]-1]])
        });

          cy.get(`#\\/ci_choice1_input`).click();
          cy.get('#\\/selectedValue').should('have.text', choices[choiceOrder[0]-1])

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[0]-1]])
        });
      })
    }



    cy.log("7th variant repeats first order")
    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_newAttempt').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();
    cy.reload();

    let ind = 7;

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `<text>${ind}</text>${doenetML}`,
        requestedVariant: { index: ind },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `${ind}`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables['/ci'].stateValues.choiceOrder;
      let selectedOrder = choiceOrder.join(",")
      expect(selectedOrder).eq(ordersFound[0]);

    });

  });

  it('randomized choiceinput with selectFromSequence in choices', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

  
    let doenetML = `
    <variantControl uniquevariants />
    <choiceinput name="ci" randomizeOrder>
      <choice><selectFromSequence from="1" to="2" assignNames="n" /></choice>
      <choice><selectFromSequence type="letters" from="a" to="b" assignNames="l" /></choice>
    </choiceinput>
    <p>Selected value: <copy prop='selectedvalue' target="ci" assignNames="selectedValue" /></p>
    `

    let selectionsFound = [];

    cy.log("get all options in first 8 variants")
    for (let ind = 1; ind <= 8; ind++) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariant: { index: ind },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let choiceOrder = stateVariables['/ci'].stateValues.choiceOrder;
        let n = stateVariables["/n"].stateValues.value;
        let l = stateVariables["/l"].stateValues.value;
        let choices = [n.toString(), l]
        let selectedOption = [...choiceOrder, ...choices].join(",")
        expect(selectionsFound.includes(selectedOption)).eq(false);
        selectionsFound.push(selectedOption);

        for (let i = 0; i < 2; i++) {
          cy.get(`#\\/ci_choice${i + 1}_input`).click();
          cy.get('#\\/selectedValue').should('have.text', choices[choiceOrder[i]-1])
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[i]-1]])
          });
        }

        cy.wait(2000);  // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariant: { index: ind },
          }, "*");
        })
  
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)
  
        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/ci"];
        }))
  
        cy.get('#\\/selectedValue').should('have.text', choices[choiceOrder[1]-1])

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[1]-1]])
        });

          cy.get(`#\\/ci_choice1_input`).click();
          cy.get('#\\/selectedValue').should('have.text', choices[choiceOrder[0]-1])

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[0]-1]])
        });
      })
    }



    cy.log("7th variant repeats first order")
    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_newAttempt').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();
    cy.reload();

    let ind = 9;

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `<text>${ind}</text>${doenetML}`,
        requestedVariant: { index: ind },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `${ind}`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables['/ci'].stateValues.choiceOrder;
      let n = stateVariables["/n"].stateValues.value;
      let l = stateVariables["/l"].stateValues.value;
      let choices = [n.toString(), l]
      let selectedOption = [...choiceOrder, ...choices].join(",")
      expect(selectedOption).eq(selectionsFound[0]);

    });

  });



});