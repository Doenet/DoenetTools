
describe('Spreadsheet Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  var enterSpreadsheetText = function ({ id = "\\/_spreadsheet1", row, column, text = "", clear = false, verify = true }) {
    cy.get(`#${id} tbody > :nth-child(${row}) > :nth-child(${column + 1})`).click({ force: true });
    if (clear) {
      cy.get(`#${id} .handsontableInput`).clear({ force: true }).type(`${text}{enter}`, { force: true });
    } else {
      cy.get(`#${id} .handsontableInput`).type(`${text}{enter}`, { force: true });
    }
    if (verify) {
      cy.get(`#${id} tbody > :nth-child(${row}) > :nth-child(${column + 1})`).should('have.text', text)
    }
  }

  it('empty spreadsheet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <spreadsheet minNumRows="4" minNumColumns="4" />
  <text>a</text>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log('check have spreadsheet cells')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(Array.isArray(components['/_spreadsheet1'].stateValues.cells)).eq(true);
    })
    cy.log("enter text in B3");
    enterSpreadsheetText({ row: 3, column: 2, text: "hello" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq("hello");
    })

    cy.log("delete text in B3");
    enterSpreadsheetText({ row: 3, column: 2, clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq("");
    })

    cy.log("enter text in A1");
    enterSpreadsheetText({ row: 1, column: 1, text: "first" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("first");
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq("");
    })

    cy.log("enter text in D2");
    enterSpreadsheetText({ row: 2, column: 4, text: "right" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("first");
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq("");
      expect(components['/_spreadsheet1'].stateValues.cells[1][3]).eq("right");
    })

  })

  it('spreadsheet with cell children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <extract prop="text" assignNames="t2"><copy prop="cellC1" target="_spreadsheet1" /></extract>
  <extract prop="text" assignNames="t3"><copy prop="cellC3" target="_spreadsheet1" /></extract>
  <spreadsheet>
  <cell>first</cell>
  <cell colnum="C" rownum="3">hello</cell>
  <cell>bye</cell>
  <cell colnum="B">before</cell>
  <cell rownum="2">above</cell>
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'first')
    cy.get('#\\/t2').should('have.text', '')
    cy.get('#\\/t3').should('have.text', 'hello')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("first");
      expect(components['/_spreadsheet1'].stateValues.cells[2][2]).eq("hello");
      expect(components['/_spreadsheet1'].stateValues.cells[2][3]).eq("bye");
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq("before");
      expect(components['/_spreadsheet1'].stateValues.cells[1][1]).eq("above");
      expect(components['/_cell1'].stateValues.text).eq("first");
      expect(components['/_cell2'].stateValues.text).eq("hello");
      expect(components['/_cell3'].stateValues.text).eq("bye");
      expect(components['/_cell4'].stateValues.text).eq("before");
      expect(components['/_cell5'].stateValues.text).eq("above");
    })

    cy.log("overwrite text in A1");
    enterSpreadsheetText({ row: 1, column: 1, text: "new" });
    cy.get('#\\/t1').should('have.text', 'new')
    cy.get('#\\/t2').should('have.text', '')
    cy.get('#\\/t3').should('have.text', 'hello')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("new");
      expect(components['/_spreadsheet1'].stateValues.cells[2][2]).eq("hello");
      expect(components['/_spreadsheet1'].stateValues.cells[2][3]).eq("bye");
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq("before");
      expect(components['/_spreadsheet1'].stateValues.cells[1][1]).eq("above");
      expect(components['/_cell1'].stateValues.text).eq("new");
      expect(components['/_cell2'].stateValues.text).eq("hello");
      expect(components['/_cell3'].stateValues.text).eq("bye");
      expect(components['/_cell4'].stateValues.text).eq("before");
      expect(components['/_cell5'].stateValues.text).eq("above");
    })

    cy.log("enter text in new cell C1");
    enterSpreadsheetText({ row: 1, column: 3, text: "third" });
    cy.get('#\\/t1').should('have.text', 'new')
    cy.get('#\\/t2').should('have.text', 'third')
    cy.get('#\\/t3').should('have.text', 'hello')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("new");
      expect(components['/_spreadsheet1'].stateValues.cells[2][2]).eq("hello");
      expect(components['/_spreadsheet1'].stateValues.cells[2][3]).eq("bye");
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq("before");
      expect(components['/_spreadsheet1'].stateValues.cells[1][1]).eq("above");
      expect(components['/_cell1'].stateValues.text).eq("new");
      expect(components['/_cell2'].stateValues.text).eq("hello");
      expect(components['/_cell3'].stateValues.text).eq("bye");
      expect(components['/_cell4'].stateValues.text).eq("before");
      expect(components['/_cell5'].stateValues.text).eq("above");
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq("third");

    })

    cy.log("delete text in C3");
    enterSpreadsheetText({ row: 3, column: 3, clear: true });
    cy.get('#\\/t1').should('have.text', 'new')
    cy.get('#\\/t2').should('have.text', 'third')
    cy.get('#\\/t3').should('have.text', '')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("new");
      expect(components['/_spreadsheet1'].stateValues.cells[2][2]).eq("");
      expect(components['/_spreadsheet1'].stateValues.cells[2][3]).eq("bye");
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq("before");
      expect(components['/_spreadsheet1'].stateValues.cells[1][1]).eq("above");
      expect(components['/_cell1'].stateValues.text).eq("new");
      expect(components['/_cell2'].stateValues.text).eq("");
      expect(components['/_cell3'].stateValues.text).eq("bye");
      expect(components['/_cell4'].stateValues.text).eq("before");
      expect(components['/_cell5'].stateValues.text).eq("above");
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq("third");
    })

  })

  it('copy individual cells into new spreadsheet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <extract prop="text" assignNames="t2"><copy prop="cellA3" target="_spreadsheet2" /></extract>
  <extract prop="text" assignNames="t3"><copy prop="cellD3" target="C1" /></extract>
  <extract prop="text" assignNames="t4"><copy prop="cellD4" target="C2" /></extract>
  <extract prop="text" assignNames="t5"><copy prop="cellB1" target="C1a" /></extract>

  <spreadsheet>
  <cell>first</cell>
  <cell colnum="C" rownum="3">hello</cell>
  <cell>bye</cell>
  <cell colnum="4" rownum="4">last</cell>
  <cell colnum="B" rownum="A">mid</cell>
  </spreadsheet>

  <spreadsheet>
  <copy target="_cell4" assignNames="c4a" />
  <copy colnum="A" target="_cell2" assignNames="c2a" />
  <copy target="_cell3" assignNames="c3a" />
  <copy colnum="2" rownum="4" target="_cell1" assignNames="c1a" />
  <copy rownum="2" target="_cell5" assignNames="c5a" />
  </spreadsheet>

  <copy name="C1" target="_spreadsheet1" assignNames="ss1a" />
  <copy name="C2" target="_spreadsheet2" assignNames="ss2a" />
  <copy name="C1a" target="C1" assignNames="ss1b" />
  <copy name="C2a" target="C2" assignNames="ss2b" />
  `}, "*");
    });
    cy.get('#\\/_spreadsheet1')//wait for window to load

    let cellLocations = {
      1: [[1, 1], [4, 2]],
      2: [[3, 3], [3, 1]],
      3: [[3, 4], [3, 2]],
      4: [[4, 4], [4, 4]],
      5: [[1, 2], [2, 2]],
      6: [[2, 2], [1, 3]],
    };

    let cellNames = {
      1: ['/_cell1', '/c1a'],
      2: ['/_cell2', '/c2a'],
      3: ['/_cell3', '/c3a'],
      4: ['/_cell4', '/c4a'],
      5: ['/_cell5', '/c5a']
    };

    let spreadsheetNames = {
      0: ['/_spreadsheet1', '/ss1a', '/ss1b'],
      1: ['/_spreadsheet2', '/ss2a', '/ss2b']
    };

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'first')
    cy.get('#\\/t2').should('have.text', 'hello')
    cy.get('#\\/t3').should('have.text', 'bye')
    cy.get('#\\/t4').should('have.text', 'last')
    cy.get('#\\/t5').should('have.text', 'mid')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let cellValues = {
        1: "first",
        2: "hello",
        3: "bye",
        4: "last",
        5: "mid",
        6: "",
      };

      for (let cellNum in cellNames) {
        for (let ind in cellNames[cellNum]) {
          expect(components[cellNames[cellNum][ind]].stateValues.text).eq(cellValues[cellNum]);
        }
      }

      for (let ssNum in spreadsheetNames) {
        for (let ssInd in spreadsheetNames[ssNum]) {
          let ssName = spreadsheetNames[ssNum][ssInd];
          for (let cellNum in cellLocations) {
            let cLoc = cellLocations[cellNum][ssNum];
            expect(components[ssName].stateValues.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(cellValues[cellNum]);
          }
        }
      }
    })

    let allCellValues = {
      1: ["apple", "red", "up", "soft", "happy", "monday"],
      2: ["banana", "purple", "down", "hard", "sad", "tuesday"],
      3: ["grape", "black", "left", "smooth", "serious", "wednesday"],
      4: ["orange", "green", "right", "prickly", "determined", "thursday"],
      5: ["melon", "yellow", "middle", "rough", "impulsive", "friday"],
      6: ["pear", "brown", "back", "dimpled", "passive", "saturday"],
    };

    let valueInd = -1;
    let valueInd2 = -1;
    for (let ssNumChange in spreadsheetNames) {
      for (let ssIndChange in spreadsheetNames[ssNumChange]) {
        let ssNameChange = spreadsheetNames[ssNumChange][ssIndChange];
        valueInd++;

        if (ssNameChange[0] === "/") {
          ssNameChange = '\\' + ssNameChange;
        }

        for (let cellNum in allCellValues) {
          let cLoc = cellLocations[cellNum][ssNumChange];
          enterSpreadsheetText({ id: ssNameChange, row: cLoc[0], column: cLoc[1], text: allCellValues[cellNum][valueInd] });
        }


        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);

          // have to use a different valueInd variable
          // since the code is run asynchronously
          valueInd2++;
          cy.get('#\\/t1').should('have.text', allCellValues[1][valueInd2])
          cy.get('#\\/t2').should('have.text', allCellValues[2][valueInd2])
          cy.get('#\\/t3').should('have.text', allCellValues[3][valueInd2])
          cy.get('#\\/t4').should('have.text', allCellValues[4][valueInd2])
          cy.get('#\\/t5').should('have.text', allCellValues[5][valueInd2])

          for (let cellNum in cellNames) {
            for (let ind in cellNames[cellNum]) {
              expect(components[cellNames[cellNum][ind]].stateValues.text).eq(allCellValues[cellNum][valueInd2]);
            }
          }

          for (let ssNum in spreadsheetNames) {
            for (let ssInd in spreadsheetNames[ssNum]) {
              let ssName = spreadsheetNames[ssNum][ssInd];
              for (let cellNum in cellLocations) {
                let cLoc = cellLocations[cellNum][ssNum];
                if (cellNum < 6 || ssNum == (valueInd2 > 2)) {
                  expect(components[ssName].stateValues.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(allCellValues[cellNum][valueInd2]);
                } else {
                  if (ssNum === '1') {
                    expect(components[ssName].stateValues.cells[cLoc[0] - 1][cLoc[1] - 1]).eq("");
                  } else {
                    expect(components[ssName].stateValues.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(allCellValues[cellNum][2]);
                  }
                }
              }
            }
          }
        })
      }
    }

  })

  it('copy spreadsheet cells into new spreadsheet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <extract prop="text" assignNames="t2"><copy prop="cellA3" target="_spreadsheet2" /></extract>
  <extract prop="text" assignNames="t3"><copy prop="cellD3" target="C1" /></extract>
  <extract prop="text" assignNames="t4"><copy prop="cellD4" target="C2" /></extract>
  <extract prop="text" assignNames="t5"><copy prop="cellB1" target="C1a" /></extract>

  <spreadsheet>
  <cell>first</cell>
  <cell colnum="C" rownum="3">hello</cell>
  <cell>bye</cell>
  <cell colnum="4" rownum="4">last</cell>
  <cell colnum="B" rownum="A">mid</cell>
  </spreadsheet>

  <spreadsheet>
  <copy prop="cellD4" colnum="D" rownum="4" target="_spreadsheet1" assignNames="c4a" />
  <copy prop="cellC3" colnum="A" rownum="3" target="_spreadsheet1" assignNames="c2a" />
  <copy prop="cellD3" target="_spreadsheet1" assignNames="c3a" />
  <copy prop="cellA1" colnum="2" rownum="4" target="_spreadsheet1" assignNames="c1a" />
  <copy prop="cellb1" rownum="2" colnum="b" target="_spreadsheet1" assignNames="c5a" />
  </spreadsheet>

  <copy name="C1" target="_spreadsheet1" assignNames="ss1a" />
  <copy name="C2" target="_spreadsheet2" assignNames="ss2a" />
  <copy name="C1a" target="C1" assignNames="ss1b" />
  <copy name="C2a" target="C2" assignNames="ss2b" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'first')
    cy.get('#\\/t2').should('have.text', 'hello')
    cy.get('#\\/t3').should('have.text', 'bye')
    cy.get('#\\/t4').should('have.text', 'last')
    cy.get('#\\/t5').should('have.text', 'mid')

    let cellLocations = {
      1: [[1, 1], [4, 2]],
      2: [[3, 3], [3, 1]],
      3: [[3, 4], [3, 2]],
      4: [[4, 4], [4, 4]],
      5: [[1, 2], [2, 2]],
      6: [[2, 2], [1, 3]],
    };

    let cellNames = {
      1: ['/_cell1', '/c1a'],
      2: ['/_cell2', '/c2a'],
      3: ['/_cell3', '/c3a'],
      4: ['/_cell4', '/c4a'],
      5: ['/_cell5', '/c5a']
    };

    let spreadsheetNames = {
      0: ['/_spreadsheet1', '/ss1a', '/ss1b'],
      1: ['/_spreadsheet2', '/ss2a', '/ss2b']
    };

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let cellValues = {
        1: "first",
        2: "hello",
        3: "bye",
        4: "last",
        5: "mid",
        6: "",
      };

      for (let cellNum in cellNames) {
        for (let ind in cellNames[cellNum]) {
          expect(components[cellNames[cellNum][ind]].stateValues.text).eq(cellValues[cellNum]);
        }
      }

      for (let ssNum in spreadsheetNames) {
        for (let ssInd in spreadsheetNames[ssNum]) {
          let ssName = spreadsheetNames[ssNum][ssInd];
          for (let cellNum in cellLocations) {
            let cLoc = cellLocations[cellNum][ssNum];
            expect(components[ssName].stateValues.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(cellValues[cellNum]);
          }
        }
      }
    })

    let allCellValues = {
      1: ["apple", "red", "up", "soft", "happy", "monday"],
      2: ["banana", "purple", "down", "hard", "sad", "tuesday"],
      3: ["grape", "black", "left", "smooth", "serious", "wednesday"],
      4: ["orange", "green", "right", "prickly", "determined", "thursday"],
      5: ["melon", "yellow", "middle", "rough", "impulsive", "friday"],
      6: ["pear", "brown", "back", "dimpled", "passive", "saturday"],
    };

    let valueInd = -1;
    let valueInd2 = -1;
    for (let ssNumChange in spreadsheetNames) {
      for (let ssIndChange in spreadsheetNames[ssNumChange]) {
        let ssNameChange = spreadsheetNames[ssNumChange][ssIndChange];
        valueInd++;

        if (ssNameChange[0] === "/") {
          ssNameChange = '\\' + ssNameChange;
        }

        for (let cellNum in allCellValues) {
          let cLoc = cellLocations[cellNum][ssNumChange];
          enterSpreadsheetText({ id: ssNameChange, row: cLoc[0], column: cLoc[1], text: allCellValues[cellNum][valueInd] });
        }

        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);

          // have to use a different valueInd variable
          // since the code is run asynchronously
          valueInd2++;
          cy.get('#\\/t1').should('have.text', allCellValues[1][valueInd2])
          cy.get('#\\/t2').should('have.text', allCellValues[2][valueInd2])
          cy.get('#\\/t3').should('have.text', allCellValues[3][valueInd2])
          cy.get('#\\/t4').should('have.text', allCellValues[4][valueInd2])
          cy.get('#\\/t5').should('have.text', allCellValues[5][valueInd2])

          for (let cellNum in cellNames) {
            for (let ind in cellNames[cellNum]) {
              expect(components[cellNames[cellNum][ind]].stateValues.text).eq(allCellValues[cellNum][valueInd2]);
            }
          }

          for (let ssNum in spreadsheetNames) {
            for (let ssInd in spreadsheetNames[ssNum]) {
              let ssName = spreadsheetNames[ssNum][ssInd];
              for (let cellNum in cellLocations) {
                let cLoc = cellLocations[cellNum][ssNum];
                if (cellNum < 6 || ssNum == (valueInd2 > 2)) {
                  expect(components[ssName].stateValues.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(allCellValues[cellNum][valueInd2]);
                } else {
                  if (ssNum === '1') {
                    expect(components[ssName].stateValues.cells[cLoc[0] - 1][cLoc[1] - 1]).eq("");
                  } else {
                    expect(components[ssName].stateValues.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(allCellValues[cellNum][2]);
                  }
                }
              }
            }
          }
        })
      }
    }



  })

  it('build spreadsheet from cells and rows', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
  <row><cell>A1</cell><cell>B1</cell><cell colnum="D">D1</cell></row>
  <row><cell colnum="2">B2</cell><cell>C2</cell></row>
  <row rownum="5"><cell>A5</cell><cell colnum="F">F5</cell></row>
  <row><cell colnum="3">C6</cell><cell>D6</cell></row>
  <cell>A7</cell>
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(7);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(6);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("A1");
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq("B1");
      expect(components['/_spreadsheet1'].stateValues.cells[0][3]).eq("D1");
      expect(components['/_spreadsheet1'].stateValues.cells[1][1]).eq("B2");
      expect(components['/_spreadsheet1'].stateValues.cells[1][2]).eq("C2");
      expect(components['/_spreadsheet1'].stateValues.cells[4][0]).eq("A5");
      expect(components['/_spreadsheet1'].stateValues.cells[4][5]).eq("F5");
      expect(components['/_spreadsheet1'].stateValues.cells[5][2]).eq("C6");
      expect(components['/_spreadsheet1'].stateValues.cells[5][3]).eq("D6");
      expect(components['/_spreadsheet1'].stateValues.cells[6][0]).eq("A7");
      expect(components['/_cell1'].stateValues.text).eq("A1");
      expect(components['/_cell2'].stateValues.text).eq("B1");
      expect(components['/_cell3'].stateValues.text).eq("D1");
      expect(components['/_cell4'].stateValues.text).eq("B2");
      expect(components['/_cell5'].stateValues.text).eq("C2");
      expect(components['/_cell6'].stateValues.text).eq("A5");
      expect(components['/_cell7'].stateValues.text).eq("F5");
      expect(components['/_cell8'].stateValues.text).eq("C6");
      expect(components['/_cell9'].stateValues.text).eq("D6");
      expect(components['/_cell10'].stateValues.text).eq("A7");

    })

    cy.log("enter text into first column");
    for (let ind = 1; ind <= 7; ind++) {
      enterSpreadsheetText({ row: ind, column: 1, text: `row${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 7; ind++) {
        expect(components['/_spreadsheet1'].stateValues.cells[ind - 1][0]).eq(`row${ind}`);
      }
      expect(components['/_cell1'].stateValues.text).eq("row1");
      expect(components['/_cell6'].stateValues.text).eq("row5");
      expect(components['/_cell10'].stateValues.text).eq("row7");

    })

  })

  it('build spreadsheet from cells and columns', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
  <column><cell>A1</cell><cell>A2</cell><cell rownum="D">A4</cell></column>
  <column><cell rownum="2">B2</cell><cell>B3</cell></column>
  <column colnum="5"><cell>E1</cell><cell rownum="F">E6</cell></column>
  <column><cell rownum="3">F3</cell><cell>F4</cell></column>
  <cell>G1</cell>
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(6);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(7);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("A1");
      expect(components['/_spreadsheet1'].stateValues.cells[1][0]).eq("A2");
      expect(components['/_spreadsheet1'].stateValues.cells[3][0]).eq("A4");
      expect(components['/_spreadsheet1'].stateValues.cells[1][1]).eq("B2");
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq("B3");
      expect(components['/_spreadsheet1'].stateValues.cells[0][4]).eq("E1");
      expect(components['/_spreadsheet1'].stateValues.cells[5][4]).eq("E6");
      expect(components['/_spreadsheet1'].stateValues.cells[2][5]).eq("F3");
      expect(components['/_spreadsheet1'].stateValues.cells[3][5]).eq("F4");
      expect(components['/_spreadsheet1'].stateValues.cells[0][6]).eq("G1");
      expect(components['/_cell1'].stateValues.text).eq("A1");
      expect(components['/_cell2'].stateValues.text).eq("A2");
      expect(components['/_cell3'].stateValues.text).eq("A4");
      expect(components['/_cell4'].stateValues.text).eq("B2");
      expect(components['/_cell5'].stateValues.text).eq("B3");
      expect(components['/_cell6'].stateValues.text).eq("E1");
      expect(components['/_cell7'].stateValues.text).eq("E6");
      expect(components['/_cell8'].stateValues.text).eq("F3");
      expect(components['/_cell9'].stateValues.text).eq("F4");
      expect(components['/_cell10'].stateValues.text).eq("G1");

    })

    cy.log("enter text into first row");
    for (let ind = 1; ind <= 7; ind++) {
      enterSpreadsheetText({ row: 1, column: ind, text: `column${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 7; ind++) {
        expect(components['/_spreadsheet1'].stateValues.cells[0][ind - 1]).eq(`column${ind}`);
      }
      expect(components['/_cell1'].stateValues.text).eq("column1");
      expect(components['/_cell6'].stateValues.text).eq("column5");
      expect(components['/_cell10'].stateValues.text).eq("column7");

    })

  })

  it('build spreadsheet with cellblocks', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellC3" target="_spreadsheet1" /></extract>
  <spreadsheet>
  <cellblock rownum="2" colnum="3">
    <row rownum="2"><cell>C3</cell><cell>D3</cell></row>
    <column colnum="3"><cell>E2</cell><cell>E3</cell></column>
  </cellblock>
  <cell>F2</cell>
  <cellblock>
    <cell>G2</cell>
    <cell rownum="3">G4</cell>
  </cellblock>
  <cellblock rownum="5">
    <cell>G5</cell><cell>H5</cell>
  </cellblock>
  <cellblock colnum="A">
  <cell>A5</cell>
  <cell rownum="2" colnum="2">B6</cell>
  </cellblock>
  <cell>C5</cell>
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'C3')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(6);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(8);
      expect(components['/_spreadsheet1'].stateValues.cells[2][2]).eq("C3");
      expect(components['/_spreadsheet1'].stateValues.cells[2][3]).eq("D3");
      expect(components['/_spreadsheet1'].stateValues.cells[1][4]).eq("E2");
      expect(components['/_spreadsheet1'].stateValues.cells[2][4]).eq("E3");
      expect(components['/_spreadsheet1'].stateValues.cells[1][5]).eq("F2");
      expect(components['/_spreadsheet1'].stateValues.cells[1][6]).eq("G2");
      expect(components['/_spreadsheet1'].stateValues.cells[3][6]).eq("G4");
      expect(components['/_spreadsheet1'].stateValues.cells[4][6]).eq("G5");
      expect(components['/_spreadsheet1'].stateValues.cells[4][7]).eq("H5");
      expect(components['/_spreadsheet1'].stateValues.cells[4][0]).eq("A5");
      expect(components['/_spreadsheet1'].stateValues.cells[5][1]).eq("B6");
      expect(components['/_spreadsheet1'].stateValues.cells[4][2]).eq("C5");
      expect(components['/_cell1'].stateValues.text).eq("C3");
      expect(components['/_cell2'].stateValues.text).eq("D3");
      expect(components['/_cell3'].stateValues.text).eq("E2");
      expect(components['/_cell4'].stateValues.text).eq("E3");
      expect(components['/_cell5'].stateValues.text).eq("F2");
      expect(components['/_cell6'].stateValues.text).eq("G2");
      expect(components['/_cell7'].stateValues.text).eq("G4");
      expect(components['/_cell8'].stateValues.text).eq("G5");
      expect(components['/_cell9'].stateValues.text).eq("H5");
      expect(components['/_cell10'].stateValues.text).eq("A5");
      expect(components['/_cell11'].stateValues.text).eq("B6");
      expect(components['/_cell12'].stateValues.text).eq("C5");

    })

    cy.log("enter text into fifth row");
    for (let ind = 1; ind <= 8; ind++) {
      enterSpreadsheetText({ row: 5, column: ind, text: `column${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 8; ind++) {
        expect(components['/_spreadsheet1'].stateValues.cells[4][ind - 1]).eq(`column${ind}`);
      }
      expect(components['/_cell8'].stateValues.text).eq("column7");
      expect(components['/_cell9'].stateValues.text).eq("column8");
      expect(components['/_cell10'].stateValues.text).eq("column1");
      expect(components['/_cell12'].stateValues.text).eq("column3");

    })

  })

  it('copy spreadsheet with cellblocks', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
  <row><cell>A1</cell><cell>B1</cell><cell>C1</cell></row>
  <column><cell rownum="2">A2</cell><cell>A3</cell><cell>A4</cell></column>
  <cellblock rownum="2">
    <cell>B2</cell><cell>C2</cell><cell>D2</cell>
    <row rownum="2"><cell>B3</cell><cell>C3</cell><cell>D3</cell></row>
  </cellblock>
  <cell rownum="4">B4</cell><cell>C4</cell><cell>D4</cell>
  <cell rownum="1">D1</cell>
  </spreadsheet>

  <spreadsheet>
  <copy prop="rangeC3D4" target="_spreadsheet1" />
  <copy prop="range((1,1),(4,2))" target="_spreadsheet1" />
  <copy prop="rangeD2C1" rownum="3" colnum="1" target="_spreadsheet1" />
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(4);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(4);
      expect(components['/_spreadsheet2'].stateValues.numRows).eq(4);
      expect(components['/_spreadsheet2'].stateValues.numColumns).eq(4);
      for (let row = 1; row <= 4; row++) {
        for (let col = 1; col <= 4; col++) {
          expect(components['/_spreadsheet1'].stateValues.cells[row - 1][col - 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 3; row <= 4; row++) {
        for (let col = 3; col <= 4; col++) {
          expect(components['/_spreadsheet2'].stateValues.cells[row - 3][col - 3]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 4; row++) {
        for (let col = 1; col <= 2; col++) {
          expect(components['/_spreadsheet2'].stateValues.cells[row - 1][col + 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 2; row++) {
        for (let col = 3; col <= 4; col++) {
          expect(components['/_spreadsheet2'].stateValues.cells[row + 1][col - 3]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
    })

    cy.log("enter text into third row of first spreadsheet");
    for (let ind = 1; ind <= 4; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 3, column: ind, text: `column${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 4; ind++) {
        expect(components['/_spreadsheet1'].stateValues.cells[2][ind - 1]).eq(`column${ind}`);
      }
      expect(components['/_spreadsheet2'].stateValues.cells[2][2]).eq(`column1`);
      expect(components['/_spreadsheet2'].stateValues.cells[2][3]).eq(`column2`);
      expect(components['/_spreadsheet2'].stateValues.cells[0][0]).eq(`column3`);
      expect(components['/_spreadsheet2'].stateValues.cells[0][1]).eq(`column4`);

    })

    cy.log("enter text into second column of second spreadsheet");
    for (let ind = 1; ind <= 4; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: ind, column: 2, text: `row${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 4; ind++) {
        expect(components['/_spreadsheet2'].stateValues.cells[ind - 1][1]).eq(`row${ind}`);
      }
      expect(components['/_spreadsheet1'].stateValues.cells[2][3]).eq(`row1`);
      expect(components['/_spreadsheet1'].stateValues.cells[3][3]).eq(`row2`);
      expect(components['/_spreadsheet1'].stateValues.cells[0][3]).eq(`row3`);
      expect(components['/_spreadsheet1'].stateValues.cells[1][3]).eq(`row4`);

    })


  })

  it('copy spreadsheet with rows and columns', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
  <row><cell>A1</cell><cell>B1</cell><cell>C1</cell></row>
  <column><cell rownum="2">A2</cell><cell>A3</cell><cell>A4</cell></column>
  <cellblock rownum="2">
    <cell>B2</cell><cell>C2</cell><cell>D2</cell>
    <row rownum="2"><cell>B3</cell><cell>C3</cell><cell>D3</cell></row>
  </cellblock>
  <cell rownum="4">B4</cell><cell>C4</cell><cell>D4</cell>
  <cell rownum="1">D1</cell>
  </spreadsheet>

  <spreadsheet>
  <copy prop="row2" rownum="3" target="_spreadsheet1" />
  <copy prop="column3" colnum="5" target="_spreadsheet1" />
  <copy prop="rowA" target="_spreadsheet1" />
  <copy prop="columnB" target="_spreadsheet1" />
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(4);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(4);
      expect(components['/_spreadsheet2'].stateValues.numRows).eq(4);
      expect(components['/_spreadsheet2'].stateValues.numColumns).eq(6);
      for (let row = 1; row <= 4; row++) {
        for (let col = 1; col <= 4; col++) {
          expect(components['/_spreadsheet1'].stateValues.cells[row - 1][col - 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 2; row++) {
        for (let col = 1; col <= 4; col++) {
          expect(components['/_spreadsheet2'].stateValues.cells[row - 1][col - 1]).eq("");
        }
      }
      for (let col = 1; col <= 4; col++) {
        expect(components['/_spreadsheet2'].stateValues.cells[2][col - 1]).eq(`${String.fromCharCode(64 + col)}2`);
        expect(components['/_spreadsheet2'].stateValues.cells[3][col - 1]).eq(`${String.fromCharCode(64 + col)}1`);
      }
      for (let row = 1; row <= 4; row++) {
        expect(components['/_spreadsheet2'].stateValues.cells[row - 1][4]).eq(`C${row}`);
        expect(components['/_spreadsheet2'].stateValues.cells[row - 1][5]).eq(`B${row}`);
      }
    })

    cy.log("enter text into second row of first spreadsheet");
    for (let ind = 1; ind <= 4; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: ind, text: `column${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 4; ind++) {
        expect(components['/_spreadsheet1'].stateValues.cells[1][ind - 1]).eq(`column${ind}`);
      }
      // becomes third row of second spreadsheet
      expect(components['/_spreadsheet2'].stateValues.cells[2][0]).eq(`column1`);
      expect(components['/_spreadsheet2'].stateValues.cells[2][1]).eq(`column2`);
      expect(components['/_spreadsheet2'].stateValues.cells[2][2]).eq(`column3`);
      expect(components['/_spreadsheet2'].stateValues.cells[2][3]).eq(`column4`);

      // fifth and sixth column ref third and second column
      expect(components['/_spreadsheet2'].stateValues.cells[1][4]).eq(`column3`);
      expect(components['/_spreadsheet2'].stateValues.cells[1][5]).eq(`column2`);


    })

    cy.log("enter text into fifth column of second spreadsheet");
    for (let ind = 1; ind <= 4; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: ind, column: 5, text: `row${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 4; ind++) {
        expect(components['/_spreadsheet2'].stateValues.cells[ind - 1][4]).eq(`row${ind}`);
      }

      //comes third column of first spreadsheet
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq(`row1`);
      expect(components['/_spreadsheet1'].stateValues.cells[1][2]).eq(`row2`);
      expect(components['/_spreadsheet1'].stateValues.cells[2][2]).eq(`row3`);
      expect(components['/_spreadsheet1'].stateValues.cells[3][2]).eq(`row4`);

      // third and fourth row of second spreadsheet also change due
      // changes in second and first row of first spreadsheet
      expect(components['/_spreadsheet2'].stateValues.cells[2][2]).eq(`row2`);
      expect(components['/_spreadsheet2'].stateValues.cells[3][2]).eq(`row1`);


    })


  })

  it('copy all spreadsheet cells shifted', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet minNumRows="3" minNumColumns="3">
  <cell>A1</cell><cell>B1</cell><cell>C1</cell>
  <cell rownum="2" colnum="1">A2</cell><cell>B2</cell><cell>C2</cell>
  <cell rownum="3" colnum="1">A3</cell><cell>B3</cell><cell>C3</cell>
  </spreadsheet>

  <spreadsheet>
  <copy prop="cells" rownum="3" colnum="2" target="_spreadsheet1" />
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(3);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(3);
      expect(components['/_spreadsheet2'].stateValues.numRows).eq(5);
      expect(components['/_spreadsheet2'].stateValues.numColumns).eq(4);
      for (let row = 1; row <= 3; row++) {
        for (let col = 1; col <= 3; col++) {
          expect(components['/_spreadsheet1'].stateValues.cells[row - 1][col - 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 3; row++) {
        for (let col = 1; col <= 3; col++) {
          expect(components['/_spreadsheet2'].stateValues.cells[row + 1][col]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
    })

    cy.log("enter text into second row of first spreadsheet");
    for (let ind = 1; ind <= 3; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: ind, text: `column${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 3; ind++) {
        expect(components['/_spreadsheet1'].stateValues.cells[1][ind - 1]).eq(`column${ind}`);
      }
      for (let ind = 1; ind <= 3; ind++) {
        expect(components['/_spreadsheet2'].stateValues.cells[3][ind]).eq(`column${ind}`);
      }

    })

    cy.log("enter text into fourth column of second spreadsheet");
    for (let ind = 1; ind <= 5; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: ind, column: 4, text: `row${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 5; ind++) {
        expect(components['/_spreadsheet2'].stateValues.cells[ind - 1][3]).eq(`row${ind}`);
      }

      //becomes third column of first spreadsheet
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq(`row3`);
      expect(components['/_spreadsheet1'].stateValues.cells[1][2]).eq(`row4`);
      expect(components['/_spreadsheet1'].stateValues.cells[2][2]).eq(`row5`);

    })

  })

  it('copy spreadsheet cells ignores cell col/row num', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellE1" target="_spreadsheet1" /></extract>
  <spreadsheet>
  <cell colnum="5">alpha</cell>
  <cell>beta</cell>
  <cell rownum="2">gamma</cell>
  </spreadsheet>
  
  <spreadsheet>
  <copy prop="rangeE1F2" target="_spreadsheet1" />
  <copy prop="rangeE1F2" colnum="4" target="_spreadsheet1" />
  <copy prop="rangeE1F2" rownum="3" target="_spreadsheet1" />
  </spreadsheet>  
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'alpha')

    let cellBlockUpperLefts = [[0, 0], [0, 3], [2, 3]];

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][4]).eq('alpha');
      expect(components['/_spreadsheet1'].stateValues.cells[0][5]).eq('beta');
      expect(components['/_spreadsheet1'].stateValues.cells[1][5]).eq('gamma');
      for (let inds of cellBlockUpperLefts) {
        let row = inds[0];
        let col = inds[1];
        expect(components['/_spreadsheet2'].stateValues.cells[row][col]).eq('alpha');
        expect(components['/_spreadsheet2'].stateValues.cells[row][col + 1]).eq('beta');
        expect(components['/_spreadsheet2'].stateValues.cells[row + 1][col + 1]).eq('gamma');

      }
    })

    cy.log("enter text in first spreadsheet block");
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 5, text: `a` });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 6, text: `b` });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: 5, text: `c` });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: 6, text: `d` });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][4]).eq('a');
      expect(components['/_spreadsheet1'].stateValues.cells[0][5]).eq('b');
      expect(components['/_spreadsheet1'].stateValues.cells[1][4]).eq('c');
      expect(components['/_spreadsheet1'].stateValues.cells[1][5]).eq('d');
      for (let inds of cellBlockUpperLefts) {
        let row = inds[0];
        let col = inds[1];
        expect(components['/_spreadsheet2'].stateValues.cells[row][col]).eq('a');
        expect(components['/_spreadsheet2'].stateValues.cells[row][col + 1]).eq('b');
        expect(components['/_spreadsheet2'].stateValues.cells[row + 1][col]).eq('c');
        expect(components['/_spreadsheet2'].stateValues.cells[row + 1][col + 1]).eq('d');

      }
    })


    cy.log("enter text in other spreadsheet blocks");
    enterSpreadsheetText({ id: "\\/_spreadsheet2", row: 1, column: 1, text: `first` });
    enterSpreadsheetText({ id: "\\/_spreadsheet2", row: 1, column: 5, text: `second` });
    enterSpreadsheetText({ id: "\\/_spreadsheet2", row: 4, column: 4, text: `third` });
    enterSpreadsheetText({ id: "\\/_spreadsheet2", row: 4, column: 5, text: `fourth` });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][4]).eq('first');
      expect(components['/_spreadsheet1'].stateValues.cells[0][5]).eq('second');
      expect(components['/_spreadsheet1'].stateValues.cells[1][4]).eq('third');
      expect(components['/_spreadsheet1'].stateValues.cells[1][5]).eq('fourth');
      for (let inds of cellBlockUpperLefts) {
        let row = inds[0];
        let col = inds[1];
        expect(components['/_spreadsheet2'].stateValues.cells[row][col]).eq('first');
        expect(components['/_spreadsheet2'].stateValues.cells[row][col + 1]).eq('second');
        expect(components['/_spreadsheet2'].stateValues.cells[row + 1][col]).eq('third');
        expect(components['/_spreadsheet2'].stateValues.cells[row + 1][col + 1]).eq('fourth');

      }
    })


  })

  it('copy extracted points from spreadsheet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet minNumRows="4" minNumColumns="4">
  <cell>(1,2)</cell>
  <cell>hello</cell>
  <cell>5</cell>
  </spreadsheet>
  
  <graph name="inAllCells">
    <copy prop="pointsInCells" target="_spreadsheet1" removeEmptyArrayEntries />
  </graph>

  <graph name="inCellB3">
    <copy prop="pointsInCellB3" target="_spreadsheet1" removeEmptyArrayEntries />
  </graph>

  <graph name="inRow2">
    <copy prop="pointsInRow2" target="_spreadsheet1" removeEmptyArrayEntries />
  </graph>

  <graph name="inColumn1">
    <copy prop="pointsInColumn1" target="_spreadsheet1" removeEmptyArrayEntries />
  </graph>

  <graph name="inRangeA2B4">
    <copy prop="pointsInRangeA2B4" target="_spreadsheet1" removeEmptyArrayEntries />
  </graph>

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', '(1,2)')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('(1,2)');
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
      expect(components['/inAllCells'].activeChildren.length).eq(1);
      expect(components['/inAllCells'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2]);
      expect(components['/inCellB3'].activeChildren.length).eq(0);
      expect(components['/inRow2'].activeChildren.length).eq(0);
      expect(components['/inColumn1'].activeChildren.length).eq(1);
      expect(components['/inColumn1'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2]);
      expect(components['/inRangeA2B4'].activeChildren.length).eq(0);

    })

    // cy.log('move point');
    // cy.window().then((win) => {
    //   let components = Object.assign({}, win.state.components);
    //   components['/inAllCells'].activeChildren[0].movePoint({ x: -3, y: 7 })
    //   expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('( -3, 7 )');
    //   expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
    //   expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
    //   expect(components['/inAllCells'].activeChildren.length).eq(1);
    //   expect(components['/inAllCells'].activeChildren[0].stateValues.xs[0].tree).eqls(['-', 3]);
    //   expect(components['/inAllCells'].activeChildren[0].stateValues.xs[1].tree).eq(7);

    // })

    cy.log('type in different coordinates');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 1, text: '(4,9)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('(4,9)');
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
      expect(components['/inAllCells'].activeChildren.length).eq(1);
      expect(components['/inAllCells'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([4, 9]);
      expect(components['/inCellB3'].activeChildren.length).eq(0);
      expect(components['/inRow2'].activeChildren.length).eq(0);
      expect(components['/inColumn1'].activeChildren.length).eq(1);
      expect(components['/inColumn1'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([4, 9]);
      expect(components['/inRangeA2B4'].activeChildren.length).eq(0);

    })

    cy.log('enter new point B3');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 3, column: 2, text: '(5,4)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('(4,9)');
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq('(5,4)');
      expect(components['/inAllCells'].activeChildren.length).eq(2);
      expect(components['/inAllCells'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([4, 9]);
      expect(components['/inAllCells'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inCellB3'].activeChildren.length).eq(1);
      expect(components['/inCellB3'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inRow2'].activeChildren.length).eq(0);
      expect(components['/inColumn1'].activeChildren.length).eq(1);
      expect(components['/inColumn1'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([4, 9]);
      expect(components['/inRangeA2B4'].activeChildren.length).eq(1);
      expect(components['/inRangeA2B4'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);

    })

    // cy.log('move new point');
    // cy.window().then((win) => {
    //   let components = Object.assign({}, win.state.components);
    //   components['/inAllCells'].activeChildren[1].movePoint({ x: 0, y: 1 })
    //   expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('(4,9)');
    //   expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
    //   expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
    //   expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq('( 0, 1 )');
    //   expect(components['/inAllCells'].activeChildren.length).eq(2);
    //   expect(components['/inAllCells'].activeChildren[0].stateValues.xs[0].tree).eq(4);
    //   expect(components['/inAllCells'].activeChildren[0].stateValues.xs[1].tree).eq(9);
    //   expect(components['/inAllCells'].activeChildren[1].stateValues.xs[0].tree).eq(0);
    //   expect(components['/inAllCells'].activeChildren[1].stateValues.xs[1].tree).eq(1);
    // })


    cy.log('enter random text on top of point in A1');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 1, text: ')x,-', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq(')x,-');
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq('(5,4)');
      expect(components['/inAllCells'].activeChildren.length).eq(1);
      expect(components['/inAllCells'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inCellB3'].activeChildren.length).eq(1);
      expect(components['/inCellB3'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inRow2'].activeChildren.length).eq(0);
      expect(components['/inColumn1'].activeChildren.length).eq(0);
      expect(components['/inRangeA2B4'].activeChildren.length).eq(1);
      expect(components['/inRangeA2B4'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);

    })

    cy.log('enter new point in A4');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 4, column: 1, text: '(3,2)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq(')x,-');
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq('(5,4)');
      expect(components['/_spreadsheet1'].stateValues.cells[3][0]).eq('(3,2)');
      expect(components['/inAllCells'].activeChildren.length).eq(2);
      expect(components['/inAllCells'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inAllCells'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 2]);
      expect(components['/inCellB3'].activeChildren.length).eq(1);
      expect(components['/inCellB3'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inRow2'].activeChildren.length).eq(0);
      expect(components['/inColumn1'].activeChildren.length).eq(1);
      expect(components['/inColumn1'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([3, 2]);
      expect(components['/inRangeA2B4'].activeChildren.length).eq(2);
      expect(components['/inRangeA2B4'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inRangeA2B4'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 2]);

    })

    cy.log('enter point on top of text in A1');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 1, text: '(7,3)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('(7,3)');
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq('(5,4)');
      expect(components['/_spreadsheet1'].stateValues.cells[3][0]).eq('(3,2)');
      expect(components['/inAllCells'].activeChildren.length).eq(3);
      expect(components['/inAllCells'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([7, 3]);
      expect(components['/inAllCells'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inAllCells'].activeChildren[2].stateValues.xs.map(x => x.tree)).eqls([3, 2]);
      expect(components['/inCellB3'].activeChildren.length).eq(1);
      expect(components['/inCellB3'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inRow2'].activeChildren.length).eq(0);
      expect(components['/inColumn1'].activeChildren.length).eq(2);
      expect(components['/inColumn1'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([7, 3]);
      expect(components['/inColumn1'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 2]);
      expect(components['/inRangeA2B4'].activeChildren.length).eq(2);
      expect(components['/inRangeA2B4'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inRangeA2B4'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 2]);

    })


    cy.log('non-numerical point added (but not graphed) in D2');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: 4, text: '(x,q)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('(7,3)');
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq('(5,4)');
      expect(components['/_spreadsheet1'].stateValues.cells[3][0]).eq('(3,2)');
      expect(components['/_spreadsheet1'].stateValues.cells[1][3]).eq('(x,q)');
      expect(components['/inAllCells'].activeChildren.length).eq(4);
      expect(components['/inAllCells'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([7, 3]);
      expect(components['/inAllCells'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls(['x', 'q']);
      expect(components['/inAllCells'].activeChildren[2].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inAllCells'].activeChildren[3].stateValues.xs.map(x => x.tree)).eqls([3, 2]);
      expect(components['/inCellB3'].activeChildren.length).eq(1);
      expect(components['/inCellB3'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inRow2'].activeChildren.length).eq(1);
      expect(components['/inRow2'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls(['x', 'q']);
      expect(components['/inColumn1'].activeChildren.length).eq(2);
      expect(components['/inColumn1'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([7, 3]);
      expect(components['/inColumn1'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 2]);
      expect(components['/inRangeA2B4'].activeChildren.length).eq(2);
      expect(components['/inRangeA2B4'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inRangeA2B4'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([3, 2]);

    })


    cy.log('3D point added (but not graphed) in A2');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: 1, text: '(1,2,3)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('(7,3)');
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq('(5,4)');
      expect(components['/_spreadsheet1'].stateValues.cells[3][0]).eq('(3,2)');
      expect(components['/_spreadsheet1'].stateValues.cells[1][3]).eq('(x,q)');
      expect(components['/_spreadsheet1'].stateValues.cells[1][0]).eq('(1,2,3)');
      expect(components['/inAllCells'].activeChildren.length).eq(5);
      expect(components['/inAllCells'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([7, 3]);
      expect(components['/inAllCells'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([1, 2, 3]);
      expect(components['/inAllCells'].activeChildren[2].stateValues.xs.map(x => x.tree)).eqls(['x', 'q']);
      expect(components['/inAllCells'].activeChildren[3].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inAllCells'].activeChildren[4].stateValues.xs.map(x => x.tree)).eqls([3, 2]);
      expect(components['/inCellB3'].activeChildren.length).eq(1);
      expect(components['/inCellB3'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inRow2'].activeChildren.length).eq(2);
      expect(components['/inRow2'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2, 3]);
      expect(components['/inRow2'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls(['x', 'q']);
      expect(components['/inColumn1'].activeChildren.length).eq(3);
      expect(components['/inColumn1'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([7, 3]);
      expect(components['/inColumn1'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([1, 2, 3]);
      expect(components['/inColumn1'].activeChildren[2].stateValues.xs.map(x => x.tree)).eqls([3, 2]);
      expect(components['/inRangeA2B4'].activeChildren.length).eq(3);
      expect(components['/inRangeA2B4'].activeChildren[0].stateValues.xs.map(x => x.tree)).eqls([1, 2, 3]);
      expect(components['/inRangeA2B4'].activeChildren[1].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      expect(components['/inRangeA2B4'].activeChildren[2].stateValues.xs.map(x => x.tree)).eqls([3, 2]);


    })


    // cy.log('move point');
    // cy.window().then((win) => {
    //   let components = Object.assign({}, win.state.components);
    //   components['/inAllCells'].activeChildren[2].movePoint({ x: 8, y: 5 });

    //   expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('(7,3)');
    //   expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
    //   expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
    //   expect(components['/_spreadsheet1'].stateValues.cells[2][1]).eq('( 0, 1 )');
    //   expect(components['/_spreadsheet1'].stateValues.cells[3][0]).eq('( 8, 5 )');
    //   expect(components['/_spreadsheet1'].stateValues.cells[1][3]).eq('(x,q)');
    //   expect(components['/_spreadsheet1'].stateValues.cells[1][0]).eq('(1,2,3)');
    //   expect(components['/inAllCells'].activeChildren.length).eq(5);
    //   expect(components['/inAllCells'].activeChildren[0].stateValues.xs[0].tree).eq(7);
    //   expect(components['/inAllCells'].activeChildren[0].stateValues.xs[1].tree).eq(3);
    //   expect(components['/inAllCells'].activeChildren[1].stateValues.xs[0].tree).eq(1);
    //   expect(components['/inAllCells'].activeChildren[1].stateValues.xs[1].tree).eq(2);
    //   expect(components['/inAllCells'].activeChildren[1].stateValues.xs[2].tree).eq(3);
    //   expect(components['/inAllCells'].activeChildren[2].stateValues.xs[0].tree).eq(8);
    //   expect(components['/inAllCells'].activeChildren[2].stateValues.xs[1].tree).eq(5);
    //   expect(components['/inAllCells'].activeChildren[3].stateValues.xs[0].tree).eq(0);
    //   expect(components['/inAllCells'].activeChildren[3].stateValues.xs[1].tree).eq(1);
    //   expect(components['/inAllCells'].activeChildren[4].stateValues.xs[0].tree).eq('x');
    //   expect(components['/inAllCells'].activeChildren[4].stateValues.xs[1].tree).eq('q');
    // })

  })

  it('spreadsheet prefill', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="m1">x^2</math>
  <text name="t1">hello</text>
  <number name="n1">5</number>
  <boolean name="b1">true</boolean>

  <spreadsheet minNumRows="2" minNumColumns="4">
  <row>
    <cell prefill="$m1" />
    <cell prefill="$t1" />
    <cell prefill="$n1" />
    <cell prefill="$b1" />
  </row>
  </spreadsheet>
  

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.log('initial values')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('x2')
    })
    cy.get('#\\/t1').should('have.text', 'hello')
    cy.get('#\\/n1').should('have.text', '5')
    cy.get('#\\/b1').should('have.text', 'true')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('x^2');
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].stateValues.cells[0][3]).eq('true');
    })

    cy.log("changing spreadsheet doesn't change prefill sources")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 1, text: '3(-', clear: true });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 2, text: 'bye', clear: true });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 3, text: 'ab', clear: true });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 4, text: '1+q', clear: true });

    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('x2')
    })
    cy.get('#\\/t1').should('have.text', 'hello')
    cy.get('#\\/n1').should('have.text', '5')
    cy.get('#\\/b1').should('have.text', 'true')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq('3(-');
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq('bye');
      expect(components['/_spreadsheet1'].stateValues.cells[0][2]).eq('ab');
      expect(components['/_spreadsheet1'].stateValues.cells[0][3]).eq('1+q');
    })


  })



  it.skip('internal references within spreadsheet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
    <copy prop="cellC1" target="_spreadsheet1" componentType="cell" />
    <copy prop="cellE1" target="_spreadsheet1" componentType="cell" />
    <cell>first</cell>
    <copy prop="cellB1" target="_spreadsheet1" componentType="cell" />
    <copy prop="cellC1" target="_spreadsheet1" componentType="cell" />

    <row rownum="2">
      <copy colnum="2" prop="cellC2" target="_spreadsheet1" />
      <copy prop="cellD2" target="_spreadsheet1" />
      <copy prop="cellE2" target="_spreadsheet1" />
      <copy prop="cellF2" target="_spreadsheet1" />
      <copy prop="cellA3" target="_spreadsheet1" />
    </row>
  </spreadsheet>
 
  <copy assignNames"s2" target="_spreadsheet1" />

  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', 'first')

    let firstInds = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
    let secondInds = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 0]];

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(4);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(6);
      expect(components['/s2'].stateValues.numRows).eq(4);
      expect(components['/s2'].stateValues.numColumns).eq(6);
      for (let inds of firstInds) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(`first`);
        expect(components['/s2'].stateValues.cells[inds[0]][inds[1]]).eq(`first`);
      }
      for (let inds of secondInds) {
        expect(["", undefined].includes(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]])).eq(true);
        expect(["", undefined].includes(components['/s2'].stateValues.cells[inds[0]][inds[1]])).eq(true);
      }

    })

    cy.log("change text of second group in first spreadsheet")
    for (let indsChange of secondInds) {
      let newText = `a${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('first');
          expect(components['/s2'].stateValues.cells[inds[0]][inds[1]]).eq('first');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
      })
    }

    cy.log("change text of first group in first spreadsheet")
    for (let indsChange of firstInds) {
      let newText = `b${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('a20');
          expect(components['/s2'].stateValues.cells[inds[0]][inds[1]]).eq('a20');
        }
      })
    }


    cy.log("change text of second group in second spreadsheet")
    for (let indsChange of secondInds) {
      let newText = `c${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "__spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('b04');
          expect(components['/s2'].stateValues.cells[inds[0]][inds[1]]).eq('b04');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
      })
    }

    cy.log("change text of first group in second spreadsheet")
    for (let indsChange of firstInds) {
      let newText = `d${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "__spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('c20');
          expect(components['/s2'].stateValues.cells[inds[0]][inds[1]]).eq('c20');
        }
      })
    }


  })

  it.skip('internal references within spreadsheet 2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
    <copy rownum="2" prop="cellC3" target="_spreadsheet1" />
    <cell rownum="3" colnum="B">first</cell>
    <copy prop="cellB3" target="_spreadsheet1" />
    <copy prop="cellA1" target="_spreadsheet1" />
    <copy rownum="5" colnum="2" prop="rangeA1C3" target="_spreadsheet1" />
    <copy prop="column2" colnum="5" target="_spreadsheet1" />
  </spreadsheet>

  <copy name="s2" target="_spreadsheet1" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', '')

    let firstInds = [[2, 1], [2, 2], [1, 0], [6, 2], [6, 3], [5, 1], [2, 4], [5, 4]];
    let secondInds = [[0, 0], [2, 3], [4, 1], [4, 4]];

    let block1Inds = [[0, 1], [0, 2], [1, 1], [1, 2], [2, 0]];
    let block2Inds = [[4, 2], [4, 3], [5, 2], [5, 3], [6, 1]];

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(7);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(5);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(7);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(5);
      for (let inds of firstInds) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(`first`);
        expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(`first`);
      }
      for (let inds of secondInds) {
        expect(["", undefined].includes(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]])).eq(true);
        expect(["", undefined].includes(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]])).eq(true);
      }

    })

    cy.log("change text of second group in first spreadsheet")
    for (let indsChange of secondInds) {
      let newText = `a${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.get('#\\/_spreadsheet1 ')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('first');
          expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq('first');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
      })
    }

    cy.log("change text of first group in first spreadsheet")
    for (let indsChange of firstInds) {
      let newText = `b${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('a44');
          expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq('a44');
        }
      })
    }


    cy.log("change text of second group in second spreadsheet")
    for (let indsChange of secondInds) {
      let newText = `c${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "__spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('b54');
          expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq('b54');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
      })
    }

    cy.log("change text of first group in second spreadsheet")
    for (let indsChange of firstInds) {
      let newText = `d${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "__spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('c44');
          expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq('c44');
        }
      })
    }

    cy.log("change text of first block in first spreadsheet")

    let blockTexts1 = [];
    for (let indsChange of block1Inds) {
      let newText = `e${indsChange[0]}${indsChange[1]}`
      blockTexts1.push(newText);
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let [i, inds] of block1Inds.entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
        expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
      }
      for (let [i, inds] of block2Inds.entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
        expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
      }
    });

    cy.log("change text of second block in first spreadsheet")

    let blockTexts2 = [];
    for (let indsChange of block2Inds) {
      let newText = `f${indsChange[0]}${indsChange[1]}`
      blockTexts2.push(newText);
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let [i, inds] of block1Inds.entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
        expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
      }
      for (let [i, inds] of block2Inds.entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
        expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
      }
    });


    cy.log("change text of first block in second spreadsheet")

    let blockTexts3 = [];
    for (let indsChange of block1Inds) {
      let newText = `g${indsChange[0]}${indsChange[1]}`
      blockTexts3.push(newText);
      enterSpreadsheetText({ id: "__spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let [i, inds] of block1Inds.entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts3[i]);
        expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts3[i]);
      }
      for (let [i, inds] of block2Inds.entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts3[i]);
        expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts3[i]);
      }
    });

    cy.log("change text of second block in second spreadsheet")

    let blockTexts4 = [];
    for (let indsChange of block2Inds) {
      let newText = `h${indsChange[0]}${indsChange[1]}`
      blockTexts4.push(newText);
      enterSpreadsheetText({ id: "__spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let [i, inds] of block1Inds.entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts4[i]);
        expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts4[i]);
      }
      for (let [i, inds] of block2Inds.entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts4[i]);
        expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts4[i]);
      }
    });

  })

  it.skip('internal references to rows', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
    <copy prop="rowC" target="_spreadsheet1" />
    <copy prop="rowE" target="_spreadsheet1" />
    <row><cell>first</cell><cell>second</cell><cell colnum="6">sixth</cell></row>
    <copy prop="rowB" target="_spreadsheet1" />
    <copy prop="rowC" target="_spreadsheet1" />
  </spreadsheet>

  <copy name="s2" target="_spreadsheet1" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'first')

    let numRows = 5;
    let numcols = 6;

    let rowTexts = ["first", "second", , , , "sixth"]

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(numRows);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(numcols);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(numRows);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(numcols);
      for (let row = 0; row < numRows; row++) {
        for (let col of [0, 1, 5]) {
          expect(components['/_spreadsheet1'].stateValues.cells[row][col]).eq(rowTexts[col]);
          expect(components['/s2'].replacements[0].stateValues.cells[row][col]).eq(rowTexts[col]);
        }
      }

    })

    cy.log("change text of each row in first spreadsheet")

    let newRowTexts = [];
    for (let rowChange = 0; rowChange < numRows; rowChange++) {
      newRowTexts.push([]);
      let thisNew = newRowTexts[rowChange];
      for (let colChange = 0; colChange < numcols; colChange++) {
        let newText = `a${rowChange}${colChange}`;
        thisNew.push(newText);
        enterSpreadsheetText({ id: "\\/_spreadsheet1", row: rowChange + 1, column: colChange + 1, text: newText });
      }
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numcols; col++) {
            expect(components['/_spreadsheet1'].stateValues.cells[row][col]).eq(thisNew[col]);
            expect(components['/s2'].replacements[0].stateValues.cells[row][col]).eq(thisNew[col]);
          }
        }
      });
    }

    cy.log("change text of each row in second spreadsheet")

    let newRowTextsB = [];
    for (let rowChange = 0; rowChange < numRows; rowChange++) {
      newRowTextsB.push([]);
      let thisNew = newRowTextsB[rowChange];
      for (let colChange = 0; colChange < numcols; colChange++) {
        let newText = `b${rowChange}${colChange}`;
        thisNew.push(newText);
        enterSpreadsheetText({ id: "__spreadsheet1", row: rowChange + 1, column: colChange + 1, text: newText });
      }
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numcols; col++) {
            expect(components['/_spreadsheet1'].stateValues.cells[row][col]).eq(thisNew[col]);
            expect(components['/s2'].replacements[0].stateValues.cells[row][col]).eq(thisNew[col]);
          }
        }
      });
    }

  })

  it.skip('internal references to columns', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
    <copy prop="columnC" target="_spreadsheet1" />
    <copy prop="columnE" target="_spreadsheet1" />
    <column><cell>first</cell><cell>second</cell><cell rownum="6">sixth</cell></column>
    <copy prop="columnB" target="_spreadsheet1" />
    <copy prop="columnC" target="_spreadsheet1" />
  </spreadsheet>

  <copy name="s2" target="_spreadsheet1" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'first')


    let numRows = 6;
    let numcols = 5;

    let colTexts = ["first", "second", , , , "sixth"]

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(numRows);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(numcols);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(numRows);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(numcols);
      for (let col = 0; col < numcols; col++) {
        for (let row of [0, 1, 5]) {
          expect(components['/_spreadsheet1'].stateValues.cells[row][col]).eq(colTexts[row]);
          expect(components['/s2'].replacements[0].stateValues.cells[row][col]).eq(colTexts[row]);
        }
      }

    })

    cy.log("change text of each column in first spreadsheet")

    let newcolTexts = [];
    for (let colChange = 0; colChange < numcols; colChange++) {
      newcolTexts.push([]);
      let thisNew = newcolTexts[colChange];
      for (let rowChange = 0; rowChange < numRows; rowChange++) {
        let newText = `a${colChange}${rowChange}`;
        thisNew.push(newText);
        enterSpreadsheetText({ id: "\\/_spreadsheet1", column: colChange + 1, row: rowChange + 1, text: newText });
      }
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let col = 0; col < numcols; col++) {
          for (let row = 0; row < numRows; row++) {
            expect(components['/_spreadsheet1'].stateValues.cells[row][col]).eq(thisNew[row]);
            expect(components['/s2'].replacements[0].stateValues.cells[row][col]).eq(thisNew[row]);
          }
        }
      });
    }

    cy.log("change text of each column in second spreadsheet")

    let newcolTextsB = [];
    for (let colChange = 0; colChange < numcols; colChange++) {
      newcolTextsB.push([]);
      let thisNew = newcolTextsB[colChange];
      for (let rowChange = 0; rowChange < numRows; rowChange++) {
        let newText = `b${colChange}${rowChange}`;
        thisNew.push(newText);
        enterSpreadsheetText({ id: "__spreadsheet1", column: colChange + 1, row: rowChange + 1, text: newText });
      }
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let col = 0; col < numcols; col++) {
          for (let row = 0; row < numRows; row++) {
            expect(components['/_spreadsheet1'].stateValues.cells[row][col]).eq(thisNew[row]);
            expect(components['/s2'].replacements[0].stateValues.cells[row][col]).eq(thisNew[row]);
          }
        }
      });
    }

  })

  it.skip('internal references to cell ranges', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text"><copy prop="cellF1" target="_spreadsheet1" /></extract>
  <spreadsheet>
    <copy prop="rangeE1F2" target="_spreadsheet1" />
    <cellblock>
      <row><cell>a</cell><cell>b</cell></row>
      <row><cell>c</cell><cell>d</cell></row>
      <row><cell>e</cell><cell>f</cell></row>
      <row><cell>g</cell><cell>h</cell></row>
    </cellblock>
    <copy prop="rangeC1D3" target="_spreadsheet1" />
  </spreadsheet>

  <copy name="s2" target="_spreadsheet1" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'b')


    let numRows = 4;
    let numcols = 6;

    let groupTexts = ["a", "b", "c", "d", "e", "f", "g", "h"]

    let groupInds = [
      [[0, 0], [0, 2], [0, 4]],
      [[0, 1], [0, 3], [0, 5]],
      [[1, 0], [1, 2], [1, 4]],
      [[1, 1], [1, 3], [1, 5]],
      [[2, 2], [2, 4]],
      [[2, 3], [2, 5]],
      [[3, 2]],
      [[3, 3]]
    ];

    let extraInds = [[2, 0], [2, 1], [3, 0], [3, 1], [3, 4], [3, 5]]

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(numRows);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(numcols);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(numRows);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(numcols);
      for (let group = 0; group < 8; group++) {
        for (let inds of groupInds[group]) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(groupTexts[group]);
          expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(groupTexts[group]);
        }
      }
      for (let inds of extraInds) {
        expect(["", undefined].includes(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]])).eq(true);
        expect(["", undefined].includes(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]])).eq(true);
      }

    })

    cy.log("change text of each column in first spreadsheet")
    let newcolTexts = [];
    let newGroupTexts = [];
    for (let colChange = 0; colChange < numcols; colChange++) {
      newcolTexts.push([]);
      let thisNew = newcolTexts[colChange];
      for (let rowChange = 0; rowChange < numRows; rowChange++) {
        let newText = `a${colChange}${rowChange}`;
        thisNew.push(newText);
        enterSpreadsheetText({ id: "\\/_spreadsheet1", column: colChange + 1, row: rowChange + 1, text: newText });
      }
      if (colChange === 0) {
        newGroupTexts.push([...groupTexts])
      } else {
        newGroupTexts.push([...newGroupTexts[colChange - 1]])
      }
      let thisNewGroup = newGroupTexts[colChange];

      if ([0, 2, 4].includes(colChange)) {
        thisNewGroup[0] = thisNew[0];
        thisNewGroup[2] = thisNew[1];
      }
      if ([2, 4].includes(colChange)) {
        thisNewGroup[4] = thisNew[2];
      }
      if (colChange === 2) {
        thisNewGroup[6] = thisNew[3];
      }

      if ([1, 3, 5].includes(colChange)) {
        thisNewGroup[1] = thisNew[0];
        thisNewGroup[3] = thisNew[1];
      }
      if ([3, 5].includes(colChange)) {
        thisNewGroup[5] = thisNew[2];
      }
      if (colChange === 3) {
        thisNewGroup[7] = thisNew[3];
      }

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let group = 0; group < 8; group++) {
          for (let inds of groupInds[group]) {
            expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(thisNewGroup[group]);
            expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(thisNewGroup[group]);
          }
        }
      });
    }

    cy.log("change text of each column in first spreadsheet")
    let newcolTexts2 = [];
    let newGroupTexts2 = [];
    for (let colChange = 0; colChange < numcols; colChange++) {
      newcolTexts2.push([]);
      let thisNew = newcolTexts2[colChange];
      for (let rowChange = 0; rowChange < numRows; rowChange++) {
        let newText = `b${colChange}${rowChange}`;
        thisNew.push(newText);
        enterSpreadsheetText({ id: "__spreadsheet1", column: colChange + 1, row: rowChange + 1, text: newText });
      }
      if (colChange === 0) {
        newGroupTexts2.push([...newGroupTexts[numcols - 1]])
      } else {
        newGroupTexts2.push([...newGroupTexts2[colChange - 1]])
      }
      let thisNewGroup = newGroupTexts2[colChange];

      if ([0, 2, 4].includes(colChange)) {
        thisNewGroup[0] = thisNew[0];
        thisNewGroup[2] = thisNew[1];
      }
      if ([2, 4].includes(colChange)) {
        thisNewGroup[4] = thisNew[2];
      }
      if (colChange === 2) {
        thisNewGroup[6] = thisNew[3];
      }

      if ([1, 3, 5].includes(colChange)) {
        thisNewGroup[1] = thisNew[0];
        thisNewGroup[3] = thisNew[1];
      }
      if ([3, 5].includes(colChange)) {
        thisNewGroup[5] = thisNew[2];
      }
      if (colChange === 3) {
        thisNewGroup[7] = thisNew[3];
      }

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let group = 0; group < 8; group++) {
          for (let inds of groupInds[group]) {
            expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(thisNewGroup[group]);
            expect(components['/s2'].replacements[0].stateValues.cells[inds[0]][inds[1]]).eq(thisNewGroup[group]);
          }
        }
      });
    }


  })

  it.skip('mutual references between two spreadsheets', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
    <copy rownum="2" colnum="1" prop="cellC3" target="_spreadsheet2" />
    <copy prop="cellA2" target="_spreadsheet2" />
    <copy prop="cellB2" target="_spreadsheet2" />
    <copy prop="cellC2" target="_spreadsheet2" />
    <copy prop="cellD2" target="_spreadsheet2" />
    <copy prop="row2" rownum="4" target="_spreadsheet2" />
    <copy prop="rangeB2D4" rownum="5" colnum="4" target="_spreadsheet2" />
    <cell rownum="3" colnum="C">first</cell>
  </spreadsheet>

  <spreadsheet>
    <copy rownum="2" colnum="1" prop="cellC3" target="_spreadsheet1" />
    <copy prop="cellA2" target="_spreadsheet1" />
    <copy prop="cellB2" target="_spreadsheet1" />
    <copy prop="cellC2" target="_spreadsheet1" />
    <copy prop="cellD2" target="_spreadsheet1" />
    <copy prop="row2" rownum="4" target="_spreadsheet1" />
    <copy prop="rangeB2D4" rownum="5" colnum="4" target="_spreadsheet1" />
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', '')

    let firstInds = [[2, 2], [1, 1], [1, 3], [3, 0], [3, 2], [3, 4], [4, 4], [6, 3], [6, 5]];
    let secondInds = [[1, 0], [1, 2], [1, 4], [3, 1], [3, 3], [4, 3], [4, 5], [6, 4], [5, 4]];

    let row1Inds = [[1, 5]];
    let row2Inds = [[3, 5]];

    let block1Inds = [[2, 1], [2, 3]];
    let block2Inds = [[5, 3], [5, 5]];

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(7);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(6);
      expect(components['/_spreadsheet2'].stateValues.numRows).eq(7);
      expect(components['/_spreadsheet2'].stateValues.numColumns).eq(6);
      for (let inds of firstInds) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(`first`);
        expect(["", undefined].includes(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]])).eq(true);
      }
      for (let inds of secondInds) {
        expect(["", undefined].includes(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]])).eq(true);
        expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(`first`);
      }
      for (let inds of [...row1Inds, ...row2Inds, ...block1Inds, ...block2Inds]) {
        expect(["", undefined].includes(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]])).eq(true);
        expect(["", undefined].includes(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]])).eq(true);
      }

    })

    cy.log("change text of second group in first spreadsheet")
    for (let indsChange of secondInds) {
      let newText = `a${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('first');
          expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq('first');
        }
      })
    }

    cy.log("change text of first group in first spreadsheet")
    for (let indsChange of firstInds) {
      let newText = `b${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq('a54');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('a54');
          expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
      })
    }


    cy.log("change text of first group in second spreadsheet")
    for (let indsChange of firstInds) {
      let newText = `c${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('b65');
          expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq('b65');
        }
      })
    }

    cy.log("change text of second group in second spreadsheet")
    for (let indsChange of secondInds) {
      let newText = `d${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq('c65');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq('c65');
          expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(newText);
        }
      })
    }

    cy.log("change text of blocks in first spreadsheet")

    let blockTexts1 = [];
    for (let indsChange of [...block1Inds, ...block2Inds]) {
      let newText = `e${indsChange[0]}${indsChange[1]}`
      blockTexts1.push(newText);
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let [i, inds] of [...block1Inds, ...block2Inds].entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
      }
      for (let [i, inds] of [...block2Inds, ...block1Inds].entries()) {
        expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
      }
    });


    cy.log("change text of blocks in second spreadsheet")

    let blockTexts2 = [];
    for (let indsChange of [...block1Inds, ...block2Inds]) {
      let newText = `f${indsChange[0]}${indsChange[1]}`
      blockTexts2.push(newText);
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let [i, inds] of [...block1Inds, ...block2Inds].entries()) {
        expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
      }
      for (let [i, inds] of [...block2Inds, ...block1Inds].entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
      }
    });


    cy.log("change text of rows in first spreadsheet")

    let rowTexts1 = [];
    for (let indsChange of [...row1Inds, ...row2Inds]) {
      let newText = `e${indsChange[0]}${indsChange[1]}`
      rowTexts1.push(newText);
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let [i, inds] of [...row1Inds, ...row2Inds].entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(rowTexts1[i]);
      }
      for (let [i, inds] of [...row2Inds, ...row1Inds].entries()) {
        expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(rowTexts1[i]);
      }
    });


    cy.log("change text of rows in second spreadsheet")

    let rowTexts2 = [];
    for (let indsChange of [...row1Inds, ...row2Inds]) {
      let newText = `f${indsChange[0]}${indsChange[1]}`
      rowTexts2.push(newText);
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let [i, inds] of [...row1Inds, ...row2Inds].entries()) {
        expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(rowTexts2[i]);
      }
      for (let [i, inds] of [...row2Inds, ...row1Inds].entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(rowTexts2[i]);
      }
    });



  })

  it.skip('references to cells outside spreadsheet area', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
    <copy prop="cellQ1" target="_spreadsheet1" />
    <copy prop="rangeE6F8" target="_spreadsheet1" />
    <copy rownum="4" prop="row10" target="_spreadsheet1" />
    <copy rownum="5" prop="row8" target="_spreadsheet2" />
    <copy rownum="2" colnum="4" prop="cellG2" target="_spreadsheet2" />
  </spreadsheet>
 
  <spreadsheet></spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', '')

    let numcols1 = 17;
    let numrows1 = 10;
    let numcols2 = 7;
    let numrows2 = 8;


    let inds1A = [
      [0, 0],
      [0, 1], [0, 2], [1, 1], [1, 2], [2, 1], [2, 2],
      [3, 0], [3, 4], [3, 8], [3, 12], [3, 16],
    ]

    let inds1B = [
      [0, 16],
      [5, 4], [5, 5], [6, 4], [6, 5], [7, 4], [7, 5],
      [9, 0], [9, 4], [9, 8], [9, 12], [9, 16],
    ]

    let inds1C = [
      [4, 0], [4, 2], [4, 4], [4, 6],
      [1, 3]
    ]
    let inds2 = [
      [7, 0], [7, 2], [7, 4], [7, 6],
      [1, 6]
    ]
    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(numrows1);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(numcols1);
      expect(components['/_spreadsheet2'].stateValues.numRows).eq(numrows2);
      expect(components['/_spreadsheet2'].stateValues.numColumns).eq(numcols2);
    })

    cy.log("enter text into first groups")
    let textsA = [];
    for (let indsChange of [...inds1A, ...inds1C]) {
      let newText = `a${indsChange[0]}${indsChange[1]}`;
      textsA.push(newText);
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let [i, inds] of [...inds1A, ...inds1C].entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(textsA[i]);
      }
      for (let [i, inds] of inds1B.entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(textsA[i]);
      }
      for (let [i, inds] of inds2.entries()) {
        expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(textsA[i + inds1B.length]);
      }
    })


    cy.log("enter text into second groups")
    let textsB = [];
    for (let indsChange of inds1B) {
      let newText = `b${indsChange[0]}${indsChange[1]}`;
      textsB.push(newText);
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    for (let indsChange of inds2) {
      let newText = `c${indsChange[0]}${indsChange[1]}`;
      textsB.push(newText);
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let [i, inds] of [...inds1A, ...inds1C].entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(textsB[i]);
      }
      for (let [i, inds] of inds1B.entries()) {
        expect(components['/_spreadsheet1'].stateValues.cells[inds[0]][inds[1]]).eq(textsB[i]);
      }
      for (let [i, inds] of inds2.entries()) {
        expect(components['/_spreadsheet2'].stateValues.cells[inds[0]][inds[1]]).eq(textsB[i + inds1B.length]);
      }
    })




  })

  it.skip('internal references to spreadsheet size', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet minNumRows="4" minNumColumns="4">
    <cell><copy prop="numRows" target="_spreadsheet1" /></cell>
    <cell><copy prop="numColumns" target="_spreadsheet1" /></cell>
  </spreadsheet>

  <copy name="s2" target="_spreadsheet1" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/t1').should('have.text', '4')


    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(4);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(4);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(4);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(4);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("4");
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq("4");
      expect(components['/s2'].replacements[0].stateValues.cells[0][0]).eq("4");
      expect(components['/s2'].replacements[0].stateValues.cells[0][1]).eq("4");
    });

    cy.log("increase rownum and colnum in first spreadsheet")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "6" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "7" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(6);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(7);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(6);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(7);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("6");
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq("7");
      expect(components['/s2'].replacements[0].stateValues.cells[0][0]).eq("6");
      expect(components['/s2'].replacements[0].stateValues.cells[0][1]).eq("7");
    });


    cy.log("can't decrease rownum and colnum")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "3", verify: false });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "2", verify: false });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(6);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(7);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(6);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(7);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("6");
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq("7");
      expect(components['/s2'].replacements[0].stateValues.cells[0][0]).eq("6");
      expect(components['/s2'].replacements[0].stateValues.cells[0][1]).eq("7");
    });


    cy.log("can't make non-numeric rownum and colnum")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "hello", verify: false });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "x", verify: false });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(6);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(7);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(6);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(7);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("6");
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq("7");
      expect(components['/s2'].replacements[0].stateValues.cells[0][0]).eq("6");
      expect(components['/s2'].replacements[0].stateValues.cells[0][1]).eq("7");
    });


    cy.log("increase rownum and colnum in second spreadsheet")
    enterSpreadsheetText({ id: "__spreadsheet1", column: 1, row: 1, text: "11" });
    enterSpreadsheetText({ id: "__spreadsheet1", column: 2, row: 1, text: "9" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(11);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(9);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(11);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(9);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("11");
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq("9");
      expect(components['/s2'].replacements[0].stateValues.cells[0][0]).eq("11");
      expect(components['/s2'].replacements[0].stateValues.cells[0][1]).eq("9");
    });

  })

  it.skip('spreadsheet size based on internal references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <extract prop="text"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
    <numRows><copy prop="cellA1" target="_spreadsheet1" /></numRows>
    <numColumns><copy prop="cellB1" target="_spreadsheet1" /></numColumns>
  </spreadsheet>

  <copy name="s2" target="_spreadsheet1" />
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', '')


    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(4);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(4);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(4);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(4);
      expect([undefined, ""].includes(components['/_spreadsheet1'].stateValues.cells[0][0])).eq(true);
      expect([undefined, ""].includes(components['/_spreadsheet1'].stateValues.cells[0][1])).eq(true);
      expect([undefined, ""].includes(components['/s2'].replacements[0].stateValues.cells[0][0])).eq(true);
      expect([undefined, ""].includes(components['/s2'].replacements[0].stateValues.cells[0][1])).eq(true);
    });

    cy.log("increase rownum and colnum in first spreadsheet")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "6" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "7" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(6);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(7);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(6);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(7);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("6");
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq("7");
      expect(components['/s2'].replacements[0].stateValues.cells[0][0]).eq("6");
      expect(components['/s2'].replacements[0].stateValues.cells[0][1]).eq("7");
    });


    cy.log("can't decrease rownum and colnum")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "3" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "2" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(6);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(7);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(6);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(7);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("3");
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq("2");
      expect(components['/s2'].replacements[0].stateValues.cells[0][0]).eq("3");
      expect(components['/s2'].replacements[0].stateValues.cells[0][1]).eq("2");
    });


    cy.log("can't make non-numeric rownum and colnum")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "hello" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "x" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(6);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(7);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(6);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(7);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("hello");
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq("x");
      expect(components['/s2'].replacements[0].stateValues.cells[0][0]).eq("hello");
      expect(components['/s2'].replacements[0].stateValues.cells[0][1]).eq("x");
    });


    cy.log("increase rownum and colnum in second spreadsheet")
    enterSpreadsheetText({ id: "__spreadsheet1", column: 1, row: 1, text: "11" });
    enterSpreadsheetText({ id: "__spreadsheet1", column: 2, row: 1, text: "9" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.numRows).eq(11);
      expect(components['/_spreadsheet1'].stateValues.numColumns).eq(9);
      expect(components['/s2'].replacements[0].stateValues.numRows).eq(11);
      expect(components['/s2'].replacements[0].stateValues.numColumns).eq(9);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("11");
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq("9");
      expect(components['/s2'].replacements[0].stateValues.cells[0][0]).eq("11");
      expect(components['/s2'].replacements[0].stateValues.cells[0][1]).eq("9");
    });

  })

  it('references to cells, adapter to math, number, or text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
<spreadsheet minNumRows="4" minNumColumns="4">
  <cell>1</cell>
</spreadsheet>

<p><copy prop="cellA1" target="_spreadsheet1" /> A</p>

<p><aslist>
  <math simplify><copy prop="cellA1" target="_spreadsheet1" />+1</math>
  <number><copy prop="cellA1" target="_spreadsheet1" />+1</number>
  <text><copy prop="cellA1" target="_spreadsheet1" /> B</text>
</aslist></p>

<p><aslist>
  <math simplify><copy prop="cellA1" target="_spreadsheet1" />+<copy prop="cellA2" target="_spreadsheet1" /></math>
  <number><copy prop="cellA1" target="_spreadsheet1" />+<copy prop="cellA2" target="_spreadsheet1" /></number>
  <text><copy prop="cellA1" target="_spreadsheet1" /> + <copy prop="cellA2" target="_spreadsheet1" /></text>
</aslist></p>
  `}, "*");
    });

    cy.log('check initial cell values')

    cy.get('#\\/_p1').should('have.text', '1 A');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/_number1').should('have.text', '2')
    cy.get('#\\/_text1').should('have.text', '1 B');

    cy.get('#\\/_math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+1')
    })
    cy.get('#\\/_number2').should('have.text', 'NaN')
    cy.get('#\\/_text2').should('have.text', '1 + ');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq("1");
    });


    cy.log("different numbers in cells")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "5" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 2, text: "7" });


    cy.get('#\\/_p1').should('have.text', '5 A');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    })
    cy.get('#\\/_number1').should('have.text', '6')
    cy.get('#\\/_text1').should('have.text', '5 B');

    cy.get('#\\/_math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('12')
    })
    cy.get('#\\/_number2').should('have.text', '12')
    cy.get('#\\/_text2').should('have.text', '5 + 7');


    cy.log("different variables in cells")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "x" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 2, text: "y" });

    cy.get('#\\/_p1').should('have.text', 'x A');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    })
    cy.get('#\\/_number1').should('have.text', 'NaN')
    cy.get('#\\/_text1').should('have.text', 'x B');

    cy.get('#\\/_math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get('#\\/_number2').should('have.text', 'NaN')
    cy.get('#\\/_text2').should('have.text', 'x + y');


    cy.log("non-valid math in one cell")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "q(" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 2, text: "sin(w)" });

    cy.get('#\\/_p1').should('have.text', 'q( A');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+1')
    })
    cy.get('#\\/_number1').should('have.text', 'NaN')
    cy.get('#\\/_text1').should('have.text', 'q( B');

    cy.get('#\\/_math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+sin(w)')
    })
    cy.get('#\\/_number2').should('have.text', 'NaN')
    cy.get('#\\/_text2').should('have.text', 'q( + sin(w)');


    cy.log("one cell is blank")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "", clear: true });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 2, text: "5" });

    cy.get('#\\/_p1').should('have.text', ' A');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+1')
    })
    cy.get('#\\/_number1').should('have.text', 'NaN')
    cy.get('#\\/_text1').should('have.text', ' B');

    cy.get('#\\/_math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+5')
    })
    cy.get('#\\/_number2').should('have.text', 'NaN')
    cy.get('#\\/_text2').should('have.text', ' + 5');

  })

  it('references to cells where not adapted', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
<spreadsheet minNumRows="4" minNumColumns="4" name="s">
  <cell>1</cell><cell>2</cell>
</spreadsheet>

<copy prop="cellB1" target="s" assignNames="c1" />
<copy prop="cellA1" target="s" assignNames="c2" />

<tabular>
  <row>
    <copy prop="cellB1" target="s" />
    <cell>Hello</cell>
    <copy prop="cellB2" target="s" />
  </row>
  <row>
    <cell>Bye</cell>
    <copy target="s" prop="cellA1" />
  </row>
</tabular>

  `}, "*");
    });

    cy.log('check initial cell values')

    cy.get('#\\/c1').should('have.text', '2');
    cy.get('#\\/c2').should('have.text', '1');
    cy.get('#\\/_row1').should('have.text', '2Hello');
    cy.get('#\\/_row2').should('have.text', 'Bye1');

    cy.log("change cells")
    enterSpreadsheetText({ id: "\\/s", column: 1, row: 1, text: "A" });
    enterSpreadsheetText({ id: "\\/s", column: 2, row: 1, text: "B" });
    enterSpreadsheetText({ id: "\\/s", column: 2, row: 2, text: "C" });

    cy.get('#\\/c1').should('have.text', 'B');
    cy.get('#\\/c2').should('have.text', 'A');
    cy.get('#\\/_row1').should('have.text', 'BHelloC');
    cy.get('#\\/_row2').should('have.text', 'ByeA');

  })

  it.skip('references to cells within other cells math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <spreadsheet>
  <cell>1</cell><cell><math simplify><copy fixed target="x" />+<copy prop="cellA2" target="_spreadsheet1" /></math></cell>
  <cell rownum="2" colnum="1">3</cell>
  <cell><math simplify><copy prop="cellA1" fixed target="_spreadsheet1" /> + <copy prop="cellC2" target="_spreadsheet1" /></math></cell>
  <cell>5</cell>
</spreadsheet>

<math name="x" simplify><copy prop="cellA1" target="_spreadsheet1" />+1</math>
  `}, "*");
    });
    cy.get('#\\/_spreadsheet1')//wait for window to load


    cy.log('check initial cell values')

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A1 = 1;
      let C2 = 5;
      let A2 = 3;
      let x = A1 + 1;
      let B1 = x + A2;
      let B2 = A1 + C2;

      expect(components['/x'].stateValues.value.tree).eq(x);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq(A1.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq(B1.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[1][0]).eq(A2.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[1][1]).eq(B2.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[1][2]).eq(C2.toString());
    });


    cy.log("enter different defining numbers")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "7" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 2, text: "8" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 3, row: 2, text: "9" });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A1 = 7;
      let C2 = 9;
      let A2 = 8;
      let x = A1 + 1;
      let B1 = x + A2;
      let B2 = A1 + C2;

      expect(components['/x'].stateValues.value.tree).eq(x);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq(A1.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq(B1.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[1][0]).eq(A2.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[1][1]).eq(B2.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[1][2]).eq(C2.toString());
    });


    cy.log("enter different resulting numbers")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "3" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 2, text: "4" });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let A1 = 7;
      let x = A1 + 1;
      let B1 = 3;
      let B2 = 4;

      let C2 = B2 - A1;
      let A2 = B1 - x;

      expect(components['/x'].stateValues.value.tree).eq(x);
      expect(components['/_spreadsheet1'].stateValues.cells[0][0]).eq(A1.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[0][1]).eq(B1.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[1][0]).eq(A2.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[1][1]).eq(B2.toString());
      expect(components['/_spreadsheet1'].stateValues.cells[1][2]).eq(C2.toString());
    });



  })

  it('spreadsheet can merge coordinates', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
  <cell name="coords" prefill="(1,2)" />
  </spreadsheet>
  <graph>
    <point name="P" coords="$(coords{prop='math'})" />
  </graph>
  <p>Change x-coordinate: <mathinput name="x1" bindValueTo="$(P{prop='x1'})" /></p>
  <p>Change y-coordinate: <mathinput name="x2" bindValueTo="$(P{prop='x2'})" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/x1 textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get('#\\/t1').should('have.text', '( 3, 2 )')

    cy.get('#\\/x2 textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.get('#\\/t1').should('have.text', '( 3, 4 )')

  });

  it('spreadsheet can merge coordinates, with math child', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <extract prop="text" assignNames="t1"><copy prop="cellA1" target="_spreadsheet1" /></extract>
  <spreadsheet>
  <cell name="coords" ><math>(1,2)</math></cell>
  </spreadsheet>
  <graph>
    <point name="P" coords="$(coords{prop='math'})" />
  </graph>
  <p>Change x-coordinate: <mathinput name="x1" bindValueTo="$(P{prop='x1'})" /></p>
  <p>Change y-coordinate: <mathinput name="x2" bindValueTo="$(P{prop='x2'})" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/x1 textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get('#\\/t1').should('have.text', '( 3, 2 )')

    cy.get('#\\/x2 textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.get('#\\/t1').should('have.text', '( 3, 4 )')

  });

});

