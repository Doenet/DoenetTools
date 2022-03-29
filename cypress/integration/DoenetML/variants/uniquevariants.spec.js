describe('Specifying unique variant tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it.skip('single select', () => {

    let values = ["u", "v", "w", "x", "y", "z"]
    let valuesFound = [];

    cy.log("get all values in six variants")
    for (let ind = 0; ind < 6; ind++) {
      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <select assignnames="x">u,v,w,x,y,z</select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x'].stateValues.value;
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);
      })
    }

    cy.log("values repeat in next variants")
    for (let ind = 6; ind < 18; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <select assignnames="x">u,v,w,x,y,z</select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/x'].stateValues.value).eq(valuesFound[ind % 6])
      })
    }

  });

  it.skip('single selectfromsequence', () => {

    let values = [...Array(10).keys()].map(x => x + 1)
    let valuesFound = [];

    cy.log("get all values in ten variants")
    for (let ind = 0; ind < 10; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <selectfromsequence assignnames="x">10</selectfromsequence>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x'].stateValues.value;
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);
      })
    }

    cy.log("values repeat in next variants")
    for (let ind = 10; ind < 30; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <selectfromsequence assignnames="x">10</selectfromsequence>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/x'].stateValues.value).eq(valuesFound[ind % 10])
      })
    }

  });

  it.skip('select and selectfromsequence combination', () => {

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

    cy.log("get all values in variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <selectfromsequence type="letters" assignnames="w">m,n</selectfromsequence>
        <select assignnames="x">x,y,z</select>
        <selectfromsequence assignnames="y">2,4</selectfromsequence>
        <select assignnames="z">3,7</select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
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
      })
    }

    cy.log("values begin to repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 15; ind += 3) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <selectfromsequence type="letters" assignnames="w">m,n</selectfromsequence>
        <select assignnames="x">x,y,z</select>
        <selectfromsequence assignnames="y">2,4</selectfromsequence>
        <select assignnames="z">3,7</select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
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

        expect(newValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual options selected in first variants")
    let wsFound = [], xsFound = [], ysFound = [], zsFound = [];
    for (let ind = 0; ind < 3; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <selectfromsequence type="letters" assignnames="w">m,n</selectfromsequence>
        <select assignnames="x">x,y,z</select>
        <selectfromsequence assignnames="y">2,4</selectfromsequence>
        <select assignnames="z">3,7</select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        wsFound.push(stateVariables['/w'].stateValues.value);
        xsFound.push(stateVariables['/x'].stateValues.value);
        ysFound.push(stateVariables['/y'].stateValues.value);
        zsFound.push(stateVariables['/z'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(wsFound.slice(0, 2).sort()).eqls(valuesW)
      expect(xsFound.sort()).eqls(valuesX);
      expect(ysFound.sort()).eqls(valuesY);
      expect(zsFound.slice(0, 2).sort()).eqls(valuesZ)
    })

  });

  it.skip('select multiple', () => {

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

    cy.log("get all values in first variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x,y,z" numbertoselect="3">w,x,y,z</select>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
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

      })
    }


    cy.log("values begin to repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x,y,z" numbertoselect="3">w,x,y,z</select>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
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

        expect(newValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual options selected in first variants")
    let xsFound = [], ysFound = [], zsFound = [];
    for (let ind = 0; ind < 4; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x,y,z" numbertoselect="3">w,x,y,z</select>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        xsFound.push(stateVariables['/x'].stateValues.value);
        ysFound.push(stateVariables['/y'].stateValues.value);
        zsFound.push(stateVariables['/z'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle)
    })

  });

  it.skip('select multiple with replacement', () => {

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

    cy.log("get all values in first variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x,y,z" numbertoselect="3" withreplacement>x,y,z</select>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
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

      })
    }


    cy.log("values begin to repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x,y,z" numbertoselect="3" withreplacement>x,y,z</select>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
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

        expect(newValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual options selected in first variants")
    let xsFound = [], ysFound = [], zsFound = [];
    for (let ind = 0; ind < 3; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x,y,z" numbertoselect="3" withreplacement>x,y,z</select>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        xsFound.push(stateVariables['/x'].stateValues.value);
        ysFound.push(stateVariables['/y'].stateValues.value);
        zsFound.push(stateVariables['/z'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle)
    })

  });

  it.skip('select multiple from sequence', () => {

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

    cy.log("get all values in first variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x,y,z" numbertoselect="3">w,z</selectfromsequence>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
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

      })
    }


    cy.log("values begin to repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x,y,z" numbertoselect="3">w,z</selectfromsequence>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
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

        expect(newValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual options selected in first variants")
    let xsFound = [], ysFound = [], zsFound = [];
    for (let ind = 0; ind < 4; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x,y,z" numbertoselect="3">w,z</selectfromsequence>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        xsFound.push(stateVariables['/x'].stateValues.value);
        ysFound.push(stateVariables['/y'].stateValues.value);
        zsFound.push(stateVariables['/z'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle)
    })

  });

  it.skip('select multiple from sequence with replacement', () => {

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

    cy.log("get all values in first variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x,y,z" numbertoselect="3" withreplacement>x,z</selectfromsequence>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
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

      })
    }


    cy.log("values begin to repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x,y,z" numbertoselect="3" withreplacement>x,z</selectfromsequence>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
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

        expect(newValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual options selected in first variants")
    let xsFound = [], ysFound = [], zsFound = [];
    for (let ind = 0; ind < 3; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x,y,z" numbertoselect="3" withreplacement>x,z</selectfromsequence>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        xsFound.push(stateVariables['/x'].stateValues.value);
        ysFound.push(stateVariables['/y'].stateValues.value);
        zsFound.push(stateVariables['/z'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle)
    })

  });

  it.skip('limit variants', () => {

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

    cy.log("get unique values in first variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants nvariants="10" />
        <aslist>
          <selectfromsequence type="letters" assignnames="w,x,y,z" numbertoselect="4" withreplacement>u,z</selectfromsequence>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
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

      })
    }


    cy.log("values repeat in next variants")
    for (let ind = numVariants; ind < 2 * numVariants + 3; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants nvariants="10" />
        <aslist>
          <selectfromsequence type="letters" assignnames="w,x,y,z" numbertoselect="4" withreplacement>u,z</selectfromsequence>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
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

        expect(newValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual options selected in first variants")
    let wsFound = [], xsFound = [], ysFound = [], zsFound = [];
    for (let ind = 0; ind < 6; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants nvariants="10" />
        <aslist>
          <selectfromsequence type="letters" assignnames="w,x,y,z" numbertoselect="4" withreplacement>u,z</selectfromsequence>
        </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        wsFound.push(stateVariables['/w'].stateValues.value);
        xsFound.push(stateVariables['/x'].stateValues.value);
        ysFound.push(stateVariables['/y'].stateValues.value);
        zsFound.push(stateVariables['/z'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(wsFound.sort()).eqls(valuesSingle);
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle)
    })

  });

  it.skip('selects of selectfromsequence', () => {

    let valuesFound = [];
    let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let numVariants = values.length;

    cy.log("get all values in first variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x">
          <selectfromsequence assignnames="n">1,2</selectfromsequence>
          <selectfromsequence assignnames="n">101,103</selectfromsequence>
          <selectfromsequence assignnames="n">201,204</selectfromsequence>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
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

      })
    }


    cy.log("values repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x">
          <selectfromsequence assignnames="n">1,2</selectfromsequence>
          <selectfromsequence assignnames="n">101,103</selectfromsequence>
          <selectfromsequence assignnames="n">201,204</selectfromsequence>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x/n'].stateValues.value;
        expect(newValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual groups selected in first variants")
    let valuesFound2 = [];
    for (let ind = 0; ind < 3; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x">
          <selectfromsequence assignnames="n">1,2</selectfromsequence>
          <selectfromsequence assignnames="n">101,103</selectfromsequence>
          <selectfromsequence assignnames="n">201,204</selectfromsequence>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        valuesFound2.push(stateVariables['/x/n'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(valuesFound2.some(x => x <= 2)).eq(true);
      expect(valuesFound2.some(x => x >= 101 && x <= 103)).eq(true);
      expect(valuesFound2.some(x => x >= 201 && x <= 204)).eq(true);
    })

    cy.log("all individual groups selected twice in first variants")
    for (let ind = 3; ind < 6; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x">
          <selectfromsequence assignnames="n">1,2</selectfromsequence>
          <selectfromsequence assignnames="n">101,103</selectfromsequence>
          <selectfromsequence assignnames="n">201,204</selectfromsequence>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        valuesFound2.push(stateVariables['/x/n'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(valuesFound2.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(2);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(2);
    })


    cy.log("most individual groups selected three times in first variants")
    for (let ind = 6; ind < 8; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x">
          <selectfromsequence assignnames="n">1,2</selectfromsequence>
          <selectfromsequence assignnames="n">101,103</selectfromsequence>
          <selectfromsequence assignnames="n">201,204</selectfromsequence>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        valuesFound2.push(stateVariables['/x/n'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(valuesFound2.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(3);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(3);
    })

  });

  it.skip('selects of selects', () => {

    let valuesFound = [];
    let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let numVariants = values.length;

    cy.log("get all values in first variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x">
          <select assignnames="n">1,2</select>
          <select assignnames="n">101,102,103</select>
          <select assignnames="n">201,202,203,204</select>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
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

      })
    }


    cy.log("values repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x">
          <select assignnames="n">1,2</select>
          <select assignnames="n">101,102,103</select>
          <select assignnames="n">201,202,203,204</select>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x/n'].stateValues.value;
        expect(newValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual groups selected in first variants")
    let valuesFound2 = [];
    for (let ind = 0; ind < 3; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x">
          <select assignnames="n">1,2</select>
          <select assignnames="n">101,102,103</select>
          <select assignnames="n">201,202,203,204</select>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        valuesFound2.push(stateVariables['/x/n'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(valuesFound2.some(x => x <= 2)).eq(true);
      expect(valuesFound2.some(x => x >= 101 && x <= 103)).eq(true);
      expect(valuesFound2.some(x => x >= 201 && x <= 204)).eq(true);
    })

    cy.log("all individual groups selected twice in first variants")
    for (let ind = 3; ind < 6; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x">
          <select assignnames="n">1,2</select>
          <select assignnames="n">101,102,103</select>
          <select assignnames="n">201,202,203,204</select>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        valuesFound2.push(stateVariables['/x/n'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(valuesFound2.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(2);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(2);
    })


    cy.log("most individual groups selected three times in first variants")
    for (let ind = 6; ind < 8; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x">
          <select assignnames="n">1,2</select>
          <select assignnames="n">101,102,103</select>
          <select assignnames="n">201,202,203,204</select>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        valuesFound2.push(stateVariables['/x/n'].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(valuesFound2.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(3);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(3);
    })

  });

  it.skip('selects of paragraphs of selects/selectfromsequence', () => {

    let valuesFound = [];
    let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let numVariants = values.length;

    cy.log("get all values in first variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="x">
        <p><select assignnames="n">1,2</select></p>
        <p><selectfromsequence assignnames="n">101,103</selectfromsequence></p>
        <p><select assignnames="n">201,202,203,204</select></p>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x'].activeChildren[0].stateValues.value;
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

      })
    }


    cy.log("values repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="x">
        <p><select assignnames="n">1,2</select></p>
        <p><selectfromsequence assignnames="n">101,103</selectfromsequence></p>
        <p><select assignnames="n">201,202,203,204</select></p>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables['/x'].activeChildren[0].stateValues.value;
        expect(newValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual groups selected in first variants")
    let valuesFound2 = [];
    for (let ind = 0; ind < 3; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="x">
        <p><select assignnames="n">1,2</select></p>
        <p><selectfromsequence assignnames="n">101,103</selectfromsequence></p>
        <p><select assignnames="n">201,202,203,204</select></p>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        valuesFound2.push(stateVariables['/x'].activeChildren[0].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(valuesFound2.some(x => x <= 2)).eq(true);
      expect(valuesFound2.some(x => x >= 101 && x <= 103)).eq(true);
      expect(valuesFound2.some(x => x >= 201 && x <= 204)).eq(true);
    })

    cy.log("all individual groups selected twice in first variants")
    for (let ind = 3; ind < 6; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="x">
        <p><select assignnames="n">1,2</select></p>
        <p><selectfromsequence assignnames="n">101,103</selectfromsequence></p>
        <p><select assignnames="n">201,202,203,204</select></p>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        valuesFound2.push(stateVariables['/x'].activeChildren[0].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(valuesFound2.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(2);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(2);
    })


    cy.log("most individual groups selected three times in first variants")
    for (let ind = 6; ind < 8; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="x">
        <p><select assignnames="n">1,2</select></p>
        <p><selectfromsequence assignnames="n">101,103</selectfromsequence></p>
        <p><select assignnames="n">201,202,203,204</select></p>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        valuesFound2.push(stateVariables['/x'].activeChildren[0].stateValues.value);
      })
    }
    cy.window().then(async (win) => {
      expect(valuesFound2.reduce((a, c) => a + ((c <= 2) ? 1 : 0), 0)).eq(2);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 101 && c <= 103) ? 1 : 0), 0)).eq(3);
      expect(valuesFound2.reduce((a, c) => a + ((c >= 201 && c <= 204) ? 1 : 0), 0)).eq(3);
    })

  });

  it.skip('selects of selects, select multiple', () => {

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
    for (let ind = 0; ind < 20; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x,y" numbertoselect="2">
          <select assignnames="n">1,2</select>
          <select assignnames="n">101,102,103</select>
          <select assignnames="n">201,202,203,204</select>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x/n'].stateValues.value;
        let newY = stateVariables['/y/n'].stateValues.value;
        let newValue = [newX, newY].join(',');
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

      })
    }


    cy.log("values repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 20; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="x,y" numbertoselect="2">
          <select assignnames="n">1,2</select>
          <select assignnames="n">101,102,103</select>
          <select assignnames="n">201,202,203,204</select>
        </select>
      </aslist>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables['/x/n'].stateValues.value;
        let newY = stateVariables['/y/n'].stateValues.value;
        let newValue = [newX, newY].join(',');
        expect(newValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("selects all individual groups equally in first variants")
    let valuesFound1 = [];
    let valuesFound2 = [];
    for (let pass = 0; pass < 12; pass++) {
      for (let ind = pass * 3; ind < (pass + 1) * 3; ind++) {

        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x,y" numbertoselect="2">
            <select assignnames="n">1,2</select>
            <select assignnames="n">101,102,103</select>
            <select assignnames="n">201,202,203,204</select>
          </select>
        </aslist>
        `,
            requestedVariant: { index: [ind] },
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`);

        cy.window().then(async (win) => {

          let stateVariables = await win.returnAllStateVariables1();
          valuesFound1.push(stateVariables['/x/n'].stateValues.value);
          valuesFound2.push(stateVariables['/y/n'].stateValues.value);
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

  it.skip('deeper nesting of selects/selectfromsequence', () => {

    let valuesFound = [];

    let colorsA = ["red", "orange", "yellow", "magenta", "maroon", "fuchsia", "scarlet"];
    let colorsB = ["green", "chartreuse", "turquoise"];
    let colorsC = ["white", "black"];
    let allColors = [...colorsA, ...colorsB, ...colorsC];
    let colorsFound = [];

    let numbersFound = [];

    let letters = [...Array(26)].map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i));

    let variables = ["u", "v", "w", "x", "y", "z"];

    let categories = ["Favorite color:", "Selected number:", "Chosen letter:", "Variable:"];

    let numVariants = 24;

    cy.log("get all values in first variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="24" uniquevariants/>
      <select assignnames="p">
        <p>Favorite color:
          <select>
            <select>
              <text>red</text>
              <text>orange</text>
              <text>yellow</text>
              <text>magenta</text>
              <text>maroon</text>
              <text>fuchsia</text>
              <text>scarlet</text>
            </select>
            <select>
              <text>green</text>
              <text>chartreuse</text>
              <text>turquoise</text>
            </select>
            <select>
              <text>white</text>
              <text>black</text>
            </select>
          </select>
        </p>
        <p>Selected number:
          <select>
            <selectfromsequence>1000, 2000</selectfromsequence>
            <selectfromsequence>-1000,-900</selectfromsequence>
          </select>
        </p>
        <p>Chosen letter: <selectfromsequence type="letters">z</selectfromsequence></p>
        <p>Variable:
        <select>u,v,w,x,y,z</select>
        </p>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let category = stateVariables['/p'].activeChildren[0].stateValues.value.trim();
        expect(categories.includes(category)).eq(true);

        let component = stateVariables['/p'].activeChildren[1];
        let newValue = component.state.value;
        if (typeof newValue !== "string") {
          newValue = component.state.value;
        }
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
        } else {
          expect(variables.includes(newValue)).eq(true);
        }

        let combinedValue = [category, newValue].join(",");

        expect(valuesFound.includes(combinedValue)).eq(false);
        valuesFound.push(combinedValue);

      })
    }

    cy.window().then(async (win) => {
      let colorsFoundSet = new Set(colorsFound);
      expect(colorsFoundSet.size).eq(6);
      expect(colorsA.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(2);
      expect(colorsB.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(2);
      expect(colorsC.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(2);

      expect(numbersFound.reduce((a, c) => a + ((c > 0 ? 1 : 0)), 0)).eq(3)
      expect(numbersFound.reduce((a, c) => a + ((c < 0 ? 1 : 0)), 0)).eq(3)

    });


    cy.log("values repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="24" uniquevariants/>
      <select assignnames="p">
        <p>Favorite color:
          <select>
            <select>
              <text>red</text>
              <text>orange</text>
              <text>yellow</text>
              <text>magenta</text>
              <text>maroon</text>
              <text>fuchsia</text>
              <text>scarlet</text>
            </select>
            <select>
              <text>green</text>
              <text>chartreuse</text>
              <text>turquoise</text>
            </select>
            <select>
              <text>white</text>
              <text>black</text>
            </select>
          </select>
        </p>
        <p>Selected number:
          <select>
            <selectfromsequence>1000, 2000</selectfromsequence>
            <selectfromsequence>-1000,-900</selectfromsequence>
          </select>
        </p>
        <p>Chosen letter: <selectfromsequence type="letters">z</selectfromsequence></p>
        <p>Variable:
        <select>u,v,w,x,y,z</select>
        </p>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let category = stateVariables['/p'].activeChildren[0].stateValues.value.trim();
        let component = stateVariables['/p'].activeChildren[1];
        let newValue = component.state.value;
        if (typeof newValue !== "string") {
          newValue = component.state.value;
        }
        let combinedValue = [category, newValue].join(",");
        expect(combinedValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual groups selected in first variants")
    let categoriesFound = [];
    for (let ind = 0; ind < 4; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="24" uniquevariants/>
      <select assignnames="p">
        <p>Favorite color:
          <select>
            <select>
              <text>red</text>
              <text>orange</text>
              <text>yellow</text>
              <text>magenta</text>
              <text>maroon</text>
              <text>fuchsia</text>
              <text>scarlet</text>
            </select>
            <select>
              <text>green</text>
              <text>chartreuse</text>
              <text>turquoise</text>
            </select>
            <select>
              <text>white</text>
              <text>black</text>
            </select>
          </select>
        </p>
        <p>Selected number:
          <select>
            <selectfromsequence>1000, 2000</selectfromsequence>
            <selectfromsequence>-1000,-900</selectfromsequence>
          </select>
        </p>
        <p>Chosen letter: <selectfromsequence type="letters">z</selectfromsequence></p>
        <p>Variable:
        <select>u,v,w,x,y,z</select>
        </p>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        categoriesFound.push(stateVariables['/p'].activeChildren[0].stateValues.value.trim());
      })
    }
    cy.window().then(async (win) => {
      for (let ind = 0; ind < 4; ind++) {
        expect(categoriesFound.includes(categories[ind])).eq(true);
      }
    })

    cy.log("all individual groups selected twice in first variants")
    for (let ind = 4; ind < 8; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="24" uniquevariants/>
      <select assignnames="p">
        <p>Favorite color:
          <select>
            <select>
              <text>red</text>
              <text>orange</text>
              <text>yellow</text>
              <text>magenta</text>
              <text>maroon</text>
              <text>fuchsia</text>
              <text>scarlet</text>
            </select>
            <select>
              <text>green</text>
              <text>chartreuse</text>
              <text>turquoise</text>
            </select>
            <select>
              <text>white</text>
              <text>black</text>
            </select>
          </select>
        </p>
        <p>Selected number:
          <select>
            <selectfromsequence>1000, 2000</selectfromsequence>
            <selectfromsequence>-1000,-900</selectfromsequence>
          </select>
        </p>
        <p>Chosen letter: <selectfromsequence type="letters">z</selectfromsequence></p>
        <p>Variable:
        <select>u,v,w,x,y,z</select>
        </p>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        categoriesFound[ind - 4] = stateVariables['/p'].activeChildren[0].stateValues.value.trim();
      })
    }
    cy.window().then(async (win) => {
      for (let ind = 0; ind < 4; ind++) {
        expect(categoriesFound.includes(categories[ind])).eq(true);
      }
    })

  });

  it.skip('select problems of selects/selectfromsequence', () => {

    let valuesFound = [];

    let colorsA = ["red", "orange", "yellow", "magenta", "maroon", "fuchsia", "scarlet"];
    let colorsB = ["green", "chartreuse", "turquoise"];
    let colorsC = ["white", "black"];
    let allColors = [...colorsA, ...colorsB, ...colorsC];
    let colorsFound = [];

    let numbersFound = [];

    let letters = [...Array(26)].map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i));

    let variables = ["u", "v", "w", "x", "y", "z"];

    let categories = ["Favorite color", "Selected number", "Chosen letter", "Variable"];

    let numVariants = 24;

    cy.log("get all values in first variants")
    for (let ind = 0; ind < numVariants; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="24" uniquevariants/>
      <select assignnames="problem">
        <problem><title>Favorite color</title>
          <select><p>I like 
            <select>
              <text>red</text>
              <text>orange</text>
              <text>yellow</text>
              <text>magenta</text>
              <text>maroon</text>
              <text>fuchsia</text>
              <text>scarlet</text>
            </select>
          </p>
          <p>You like
            <select>
              <text>green</text>
              <text>chartreuse</text>
              <text>turquoise</text>
            </select>
          </p>
          <p>They like
            <select>
              <text>white</text>
              <text>black</text>
            </select>
          </p>
          </select>
        </problem>
        <problem><title>Selected number</title>
          <select>
            <p>Positive: <selectfromsequence>1000, 2000</selectfromsequence></p>
            <p>Negative: <selectfromsequence>-1000,-900</selectfromsequence></p>
          </select>
        </problem>
        <problem><title>Chosen letter</title>
          <p>Letter
            <selectfromsequence type="letters">z</selectfromsequence>
          </p>
        </problem>
        <problem><title>Variable</title>
        <p>Let
          <select>u,v,w,x,y,z</select>
          be the temperature at time <m>t</m>.
        </p>
        </problem>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let category = stateVariables['/problem'].stateValues.title;
        expect(categories.includes(category)).eq(true);

        let component = stateVariables['/problem'].activeChildren[2].activeChildren[1];
        let newValue = component.state.value;
        if (typeof newValue !== "string") {
          newValue = component.state.value;
        }
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
        } else {
          expect(variables.includes(newValue)).eq(true);
        }

        let combinedValue = [category, newValue].join(",");

        expect(valuesFound.includes(combinedValue)).eq(false);
        valuesFound.push(combinedValue);

      })
    }

    cy.window().then(async (win) => {
      let colorsFoundSet = new Set(colorsFound);
      expect(colorsFoundSet.size).eq(6);
      expect(colorsA.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(2);
      expect(colorsB.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(2);
      expect(colorsC.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0)).eq(2);

      expect(numbersFound.reduce((a, c) => a + ((c > 0 ? 1 : 0)), 0)).eq(3)
      expect(numbersFound.reduce((a, c) => a + ((c < 0 ? 1 : 0)), 0)).eq(3)

    });


    cy.log("values repeat in next variants")
    for (let ind = numVariants; ind < numVariants + 25; ind += 5) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="24" uniquevariants/>
      <select assignnames="problem">
        <problem><title>Favorite color</title>
          <select><p>I like 
            <select>
              <text>red</text>
              <text>orange</text>
              <text>yellow</text>
              <text>magenta</text>
              <text>maroon</text>
              <text>fuchsia</text>
              <text>scarlet</text>
            </select>
          </p>
          <p>You like
            <select>
              <text>green</text>
              <text>chartreuse</text>
              <text>turquoise</text>
            </select>
          </p>
          <p>They like
            <select>
              <text>white</text>
              <text>black</text>
            </select>
          </p>
          </select>
        </problem>
        <problem><title>Selected number</title>
          <select>
            <p>Positive: <selectfromsequence>1000, 2000</selectfromsequence></p>
            <p>Negative: <selectfromsequence>-1000,-900</selectfromsequence></p>
          </select>
        </problem>
        <problem><title>Chosen letter</title>
          <p>Letter
            <selectfromsequence type="letters">z</selectfromsequence>
          </p>
        </problem>
        <problem><title>Variable</title>
        <p>Let
          <select>u,v,w,x,y,z</select>
          be the temperature at time <m>t</m>.
        </p>
        </problem>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        let category = stateVariables['/problem'].stateValues.title;
        let component = stateVariables['/problem'].activeChildren[2].activeChildren[1];
        let newValue = component.state.value;
        if (typeof newValue !== "string") {
          newValue = component.state.value;
        }
        let combinedValue = [category, newValue].join(",");
        expect(combinedValue).eq(valuesFound[ind % numVariants])
      })
    }

    cy.log("all individual groups selected in first variants")
    let categoriesFound = [];
    for (let ind = 0; ind < 4; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="24" uniquevariants/>
      <select assignnames="problem">
        <problem><title>Favorite color</title>
          <select><p>I like 
            <select>
              <text>red</text>
              <text>orange</text>
              <text>yellow</text>
              <text>magenta</text>
              <text>maroon</text>
              <text>fuchsia</text>
              <text>scarlet</text>
            </select>
          </p>
          <p>You like
            <select>
              <text>green</text>
              <text>chartreuse</text>
              <text>turquoise</text>
            </select>
          </p>
          <p>They like
            <select>
              <text>white</text>
              <text>black</text>
            </select>
          </p>
          </select>
        </problem>
        <problem><title>Selected number</title>
          <select>
            <p>Positive: <selectfromsequence>1000, 2000</selectfromsequence></p>
            <p>Negative: <selectfromsequence>-1000,-900</selectfromsequence></p>
          </select>
        </problem>
        <problem><title>Chosen letter</title>
          <p>Letter
            <selectfromsequence type="letters">z</selectfromsequence>
          </p>
        </problem>
        <problem><title>Variable</title>
        <p>Let
          <select>u,v,w,x,y,z</select>
          be the temperature at time <m>t</m>.
        </p>
        </problem>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        categoriesFound.push(stateVariables['/problem'].stateValues.title);
      })
    }
    cy.window().then(async (win) => {
      for (let ind = 0; ind < 4; ind++) {
        expect(categoriesFound.includes(categories[ind])).eq(true);
      }
    })

    cy.log("all individual groups selected twice in first variants")
    for (let ind = 4; ind < 8; ind++) {

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>${ind}</text>
      <variantControl nvariants="24" uniquevariants/>
      <select assignnames="problem">
        <problem><title>Favorite color</title>
          <select><p>I like 
            <select>
              <text>red</text>
              <text>orange</text>
              <text>yellow</text>
              <text>magenta</text>
              <text>maroon</text>
              <text>fuchsia</text>
              <text>scarlet</text>
            </select>
          </p>
          <p>You like
            <select>
              <text>green</text>
              <text>chartreuse</text>
              <text>turquoise</text>
            </select>
          </p>
          <p>They like
            <select>
              <text>white</text>
              <text>black</text>
            </select>
          </p>
          </select>
        </problem>
        <problem><title>Selected number</title>
          <select>
            <p>Positive: <selectfromsequence>1000, 2000</selectfromsequence></p>
            <p>Negative: <selectfromsequence>-1000,-900</selectfromsequence></p>
          </select>
        </problem>
        <problem><title>Chosen letter</title>
          <p>Letter
            <selectfromsequence type="letters">z</selectfromsequence>
          </p>
        </problem>
        <problem><title>Variable</title>
        <p>Let
          <select>u,v,w,x,y,z</select>
          be the temperature at time <m>t</m>.
        </p>
        </problem>
      </select>
      `,
          requestedVariant: { index: [ind] },
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`);

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        categoriesFound[ind - 4] = stateVariables['/problem'].stateValues.title;
      })
    }
    cy.window().then(async (win) => {
      for (let ind = 0; ind < 4; ind++) {
        expect(categoriesFound.includes(categories[ind])).eq(true);
      }
    })

  });

});