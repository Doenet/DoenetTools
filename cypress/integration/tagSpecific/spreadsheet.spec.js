
describe('Spreadsheet Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  var enterSpreadsheetText = function ({ id = "\\/_spreadsheet1", row, column, text = "", clear = false, verify = true }) {
    cy.get(`#${id} tbody > :nth-child(${row}) > :nth-child(${column + 1})`).click({ force: true });
    if (clear) {
      cy.get(`#${id} .handsontableInput`).clear({ force: true }).type(`${text}{enter}`, { force: true });
    } else {
      cy.get(`#${id} .handsontableInput`).type(`${text}{enter}`, { force: true });
    }
    if(verify) {
      cy.get(`#${id} tbody > :nth-child(${row}) > :nth-child(${column + 1})`).should('have.text', text)
    }
  }

  it('empty spreadsheet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <spreadsheet/>
  <math>1</math>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.log('check have spreadsheet cells')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(Array.isArray(components['/_spreadsheet1'].state.cells)).eq(true);
    })
    cy.log("enter text in B3");
    enterSpreadsheetText({ row: 3, column: 2, text: "hello" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq("hello");
    })

    cy.log("delete text in B3");
    enterSpreadsheetText({ row: 3, column: 2, clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq("");
    })

    cy.log("enter text in A1");
    enterSpreadsheetText({ row: 1, column: 1, text: "first" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("first");
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq("");
    })

    cy.log("enter text in D2");
    enterSpreadsheetText({ row: 2, column: 4, text: "right" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("first");
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq("");
      expect(components['/_spreadsheet1'].state.cells[1][3]).eq("right");
    })

  })

  it('spreadsheet with cell children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <extract prop="text"><ref prop="cellC1">_spreadsheet1</ref></extract>
  <extract prop="text"><ref prop="cellC3">_spreadsheet1</ref></extract>
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
    cy.get('#__text1').should('have.text', 'first')
    cy.get('#__text2').should('have.text', '')
    cy.get('#__text3').should('have.text', 'hello')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("first");
      expect(components['/_spreadsheet1'].state.cells[2][2]).eq("hello");
      expect(components['/_spreadsheet1'].state.cells[2][3]).eq("bye");
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq("before");
      expect(components['/_spreadsheet1'].state.cells[1][1]).eq("above");
      expect(components['/_cell1'].state.text).eq("first");
      expect(components['/_cell2'].state.text).eq("hello");
      expect(components['/_cell3'].state.text).eq("bye");
      expect(components['/_cell4'].state.text).eq("before");
      expect(components['/_cell5'].state.text).eq("above");
    })

    cy.log("overwrite text in A1");
    enterSpreadsheetText({ row: 1, column: 1, text: "new" });
    cy.get('#__text1').should('have.text', 'new')
    cy.get('#__text2').should('have.text', '')
    cy.get('#__text3').should('have.text', 'hello')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("new");
      expect(components['/_spreadsheet1'].state.cells[2][2]).eq("hello");
      expect(components['/_spreadsheet1'].state.cells[2][3]).eq("bye");
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq("before");
      expect(components['/_spreadsheet1'].state.cells[1][1]).eq("above");
      expect(components['/_cell1'].state.text).eq("new");
      expect(components['/_cell2'].state.text).eq("hello");
      expect(components['/_cell3'].state.text).eq("bye");
      expect(components['/_cell4'].state.text).eq("before");
      expect(components['/_cell5'].state.text).eq("above");
    })

    cy.log("enter text in new cell C1");
    enterSpreadsheetText({ row: 1, column: 3, text: "third" });
    cy.get('#__text1').should('have.text', 'new')
    cy.get('#__text2').should('have.text', 'third')
    cy.get('#__text3').should('have.text', 'hello')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("new");
      expect(components['/_spreadsheet1'].state.cells[2][2]).eq("hello");
      expect(components['/_spreadsheet1'].state.cells[2][3]).eq("bye");
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq("before");
      expect(components['/_spreadsheet1'].state.cells[1][1]).eq("above");
      expect(components['/_cell1'].state.text).eq("new");
      expect(components['/_cell2'].state.text).eq("hello");
      expect(components['/_cell3'].state.text).eq("bye");
      expect(components['/_cell4'].state.text).eq("before");
      expect(components['/_cell5'].state.text).eq("above");
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq("third");

    })

    cy.log("delete text in C3");
    enterSpreadsheetText({ row: 3, column: 3, clear: true });
    cy.get('#__text1').should('have.text', 'new')
    cy.get('#__text2').should('have.text', 'third')
    cy.get('#__text3').should('have.text', '')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("new");
      expect(components['/_spreadsheet1'].state.cells[2][2]).eq("");
      expect(components['/_spreadsheet1'].state.cells[2][3]).eq("bye");
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq("before");
      expect(components['/_spreadsheet1'].state.cells[1][1]).eq("above");
      expect(components['/_cell1'].state.text).eq("new");
      expect(components['/_cell2'].state.text).eq("");
      expect(components['/_cell3'].state.text).eq("bye");
      expect(components['/_cell4'].state.text).eq("before");
      expect(components['/_cell5'].state.text).eq("above");
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq("third");
    })

  })

  it('ref individual cells into new spreadsheet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <extract prop="text"><ref prop="cellA3">_spreadsheet2</ref></extract>
  <extract prop="text"><ref prop="cellD3">C1</ref></extract>
  <extract prop="text"><ref prop="cellD4">C2</ref></extract>
  <extract prop="text"><ref prop="cellB1">C1a</ref></extract>

  <spreadsheet>
  <cell>first</cell>
  <cell colnum="C" rownum="3">hello</cell>
  <cell>bye</cell>
  <cell colnum="4" rownum="4">last</cell>
  <cell colnum="B" rownum="A">mid</cell>
  </spreadsheet>

  <spreadsheet>
  <ref>_cell4</ref>
  <ref colnum="A">_cell2</ref>
  <ref>_cell3</ref>
  <ref colnum="2" rownum="4">_cell1</ref>
  <ref rownum="2">_cell5</ref>
  </spreadsheet>

  <ref name="C1">_spreadsheet1</ref>
  <ref name="C2">_spreadsheet2</ref>
  <ref name="C1a">C1</ref>
  <ref name="C2a">C2</ref>
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
      1: ['/_cell1', '__cell4'],
      2: ['/_cell2', '__cell2'],
      3: ['/_cell3', '__cell3'],
      4: ['/_cell4', '__cell1'],
      5: ['/_cell5', '__cell5']
    };

    let spreadsheetNames = {
      0: ['/_spreadsheet1', '__spreadsheet1', '__spreadsheet3'],
      1: ['/_spreadsheet2', '__spreadsheet2', '__spreadsheet4']
    };

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'first')
    cy.get('#__text2').should('have.text', 'hello')
    cy.get('#__text3').should('have.text', 'bye')
    cy.get('#__text4').should('have.text', 'last')
    cy.get('#__text5').should('have.text', 'mid')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let cellValues = {
        1: "first",
        2: "hello",
        3: "bye",
        4: "last",
        5: "mid",
        6: undefined,
      };

      for (let cellNum in cellNames) {
        for (let ind in cellNames[cellNum]) {
          expect(components[cellNames[cellNum][ind]].state.text).eq(cellValues[cellNum]);
        }
      }

      for (let ssNum in spreadsheetNames) {
        for (let ssInd in spreadsheetNames[ssNum]) {
          let ssName = spreadsheetNames[ssNum][ssInd];
          for (let cellNum in cellLocations) {
            let cLoc = cellLocations[cellNum][ssNum];
            expect(components[ssName].state.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(cellValues[cellNum]);
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
          cy.get('#__text1').should('have.text', allCellValues[1][valueInd2])
          cy.get('#__text2').should('have.text', allCellValues[2][valueInd2])
          cy.get('#__text3').should('have.text', allCellValues[3][valueInd2])
          cy.get('#__text4').should('have.text', allCellValues[4][valueInd2])
          cy.get('#__text5').should('have.text', allCellValues[5][valueInd2])

          for (let cellNum in cellNames) {
            for (let ind in cellNames[cellNum]) {
              expect(components[cellNames[cellNum][ind]].state.text).eq(allCellValues[cellNum][valueInd2]);
            }
          }

          for (let ssNum in spreadsheetNames) {
            for (let ssInd in spreadsheetNames[ssNum]) {
              let ssName = spreadsheetNames[ssNum][ssInd];
              for (let cellNum in cellLocations) {
                let cLoc = cellLocations[cellNum][ssNum];
                if (cellNum < 6 || ssNum == (valueInd2 > 2)) {
                  expect(components[ssName].state.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(allCellValues[cellNum][valueInd2]);
                } else {
                  if (ssNum === '1') {
                    expect(components[ssName].state.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(undefined);
                  } else {
                    expect(components[ssName].state.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(allCellValues[cellNum][2]);
                  }
                }
              }
            }
          }
        })
      }
    }

  })

  it('ref spreadsheet cells into new spreadsheet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <extract prop="text"><ref prop="cellA3">_spreadsheet2</ref></extract>
  <extract prop="text"><ref prop="cellD3">C1</ref></extract>
  <extract prop="text"><ref prop="cellD4">C2</ref></extract>
  <extract prop="text"><ref prop="cellB1">C1a</ref></extract>

  <spreadsheet>
  <cell>first</cell>
  <cell colnum="C" rownum="3">hello</cell>
  <cell>bye</cell>
  <cell colnum="4" rownum="4">last</cell>
  <cell colnum="B" rownum="A">mid</cell>
  </spreadsheet>

  <spreadsheet>
  <ref prop="cellD4" colnum="D" rownum="4">_spreadsheet1</ref>
  <ref prop="cellC3" colnum="A" rownum="3">_spreadsheet1</ref>
  <ref prop="cellD3">_spreadsheet1</ref>
  <ref prop="cellA1" colnum="2" rownum="4">_spreadsheet1</ref>
  <ref rownum="2" colnum="b">
    <prop variablename="cells" colnum="b" rownum="1"/>
    <reftarget>_spreadsheet1</reftarget>
  </ref>
  </spreadsheet>

  <ref name="C1">_spreadsheet1</ref>
  <ref name="C2">_spreadsheet2</ref>
  <ref name="C1a">C1</ref>
  <ref name="C2a">C2</ref>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'first')
    cy.get('#__text2').should('have.text', 'hello')
    cy.get('#__text3').should('have.text', 'bye')
    cy.get('#__text4').should('have.text', 'last')
    cy.get('#__text5').should('have.text', 'mid')

    let cellLocations = {
      1: [[1, 1], [4, 2]],
      2: [[3, 3], [3, 1]],
      3: [[3, 4], [3, 2]],
      4: [[4, 4], [4, 4]],
      5: [[1, 2], [2, 2]],
      6: [[2, 2], [1, 3]],
    };

    let cellNames = {
      1: ['/_cell1', '__cell4'],
      2: ['/_cell2', '__cell2'],
      3: ['/_cell3', '__cell3'],
      4: ['/_cell4', '__cell1'],
      5: ['/_cell5', '__cell5']
    };

    let spreadsheetNames = {
      0: ['/_spreadsheet1', '__spreadsheet1', '__spreadsheet3'],
      1: ['/_spreadsheet2', '__spreadsheet2', '__spreadsheet4']
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
        6: undefined,
      };

      for (let cellNum in cellNames) {
        for (let ind in cellNames[cellNum]) {
          expect(components[cellNames[cellNum][ind]].state.text).eq(cellValues[cellNum]);
        }
      }

      for (let ssNum in spreadsheetNames) {
        for (let ssInd in spreadsheetNames[ssNum]) {
          let ssName = spreadsheetNames[ssNum][ssInd];
          for (let cellNum in cellLocations) {
            let cLoc = cellLocations[cellNum][ssNum];
            expect(components[ssName].state.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(cellValues[cellNum]);
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
          cy.get('#__text1').should('have.text', allCellValues[1][valueInd2])
          cy.get('#__text2').should('have.text', allCellValues[2][valueInd2])
          cy.get('#__text3').should('have.text', allCellValues[3][valueInd2])
          cy.get('#__text4').should('have.text', allCellValues[4][valueInd2])
          cy.get('#__text5').should('have.text', allCellValues[5][valueInd2])

          for (let cellNum in cellNames) {
            for (let ind in cellNames[cellNum]) {
              expect(components[cellNames[cellNum][ind]].state.text).eq(allCellValues[cellNum][valueInd2]);
            }
          }

          for (let ssNum in spreadsheetNames) {
            for (let ssInd in spreadsheetNames[ssNum]) {
              let ssName = spreadsheetNames[ssNum][ssInd];
              for (let cellNum in cellLocations) {
                let cLoc = cellLocations[cellNum][ssNum];
                if (cellNum < 6 || ssNum == (valueInd2 > 2)) {
                  expect(components[ssName].state.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(allCellValues[cellNum][valueInd2]);
                } else {
                  if (ssNum === '1') {
                    expect(components[ssName].state.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(undefined);
                  } else {
                    expect(components[ssName].state.cells[cLoc[0] - 1][cLoc[1] - 1]).eq(allCellValues[cellNum][2]);
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
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
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
    cy.get('#__text1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(7);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(6);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("A1");
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq("B1");
      expect(components['/_spreadsheet1'].state.cells[0][3]).eq("D1");
      expect(components['/_spreadsheet1'].state.cells[1][1]).eq("B2");
      expect(components['/_spreadsheet1'].state.cells[1][2]).eq("C2");
      expect(components['/_spreadsheet1'].state.cells[4][0]).eq("A5");
      expect(components['/_spreadsheet1'].state.cells[4][5]).eq("F5");
      expect(components['/_spreadsheet1'].state.cells[5][2]).eq("C6");
      expect(components['/_spreadsheet1'].state.cells[5][3]).eq("D6");
      expect(components['/_spreadsheet1'].state.cells[6][0]).eq("A7");
      expect(components['/_cell1'].state.text).eq("A1");
      expect(components['/_cell2'].state.text).eq("B1");
      expect(components['/_cell3'].state.text).eq("D1");
      expect(components['/_cell4'].state.text).eq("B2");
      expect(components['/_cell5'].state.text).eq("C2");
      expect(components['/_cell6'].state.text).eq("A5");
      expect(components['/_cell7'].state.text).eq("F5");
      expect(components['/_cell8'].state.text).eq("C6");
      expect(components['/_cell9'].state.text).eq("D6");
      expect(components['/_cell10'].state.text).eq("A7");

    })

    cy.log("enter text into first column");
    for (let ind = 1; ind <= 7; ind++) {
      enterSpreadsheetText({ row: ind, column: 1, text: `row${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 7; ind++) {
        expect(components['/_spreadsheet1'].state.cells[ind - 1][0]).eq(`row${ind}`);
      }
      expect(components['/_cell1'].state.text).eq("row1");
      expect(components['/_cell6'].state.text).eq("row5");
      expect(components['/_cell10'].state.text).eq("row7");

    })

  })

  it('build spreadsheet from cells and columns', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
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
    cy.get('#__text1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(6);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(7);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("A1");
      expect(components['/_spreadsheet1'].state.cells[1][0]).eq("A2");
      expect(components['/_spreadsheet1'].state.cells[3][0]).eq("A4");
      expect(components['/_spreadsheet1'].state.cells[1][1]).eq("B2");
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq("B3");
      expect(components['/_spreadsheet1'].state.cells[0][4]).eq("E1");
      expect(components['/_spreadsheet1'].state.cells[5][4]).eq("E6");
      expect(components['/_spreadsheet1'].state.cells[2][5]).eq("F3");
      expect(components['/_spreadsheet1'].state.cells[3][5]).eq("F4");
      expect(components['/_spreadsheet1'].state.cells[0][6]).eq("G1");
      expect(components['/_cell1'].state.text).eq("A1");
      expect(components['/_cell2'].state.text).eq("A2");
      expect(components['/_cell3'].state.text).eq("A4");
      expect(components['/_cell4'].state.text).eq("B2");
      expect(components['/_cell5'].state.text).eq("B3");
      expect(components['/_cell6'].state.text).eq("E1");
      expect(components['/_cell7'].state.text).eq("E6");
      expect(components['/_cell8'].state.text).eq("F3");
      expect(components['/_cell9'].state.text).eq("F4");
      expect(components['/_cell10'].state.text).eq("G1");

    })

    cy.log("enter text into first row");
    for (let ind = 1; ind <= 7; ind++) {
      enterSpreadsheetText({ row: 1, column: ind, text: `column${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 7; ind++) {
        expect(components['/_spreadsheet1'].state.cells[0][ind - 1]).eq(`column${ind}`);
      }
      expect(components['/_cell1'].state.text).eq("column1");
      expect(components['/_cell6'].state.text).eq("column5");
      expect(components['/_cell10'].state.text).eq("column7");

    })

  })

  it('build spreadsheet with cellblocks', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellC3">_spreadsheet1</ref></extract>
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
    cy.get('#__text1').should('have.text', 'C3')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(6);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(8);
      expect(components['/_spreadsheet1'].state.cells[2][2]).eq("C3");
      expect(components['/_spreadsheet1'].state.cells[2][3]).eq("D3");
      expect(components['/_spreadsheet1'].state.cells[1][4]).eq("E2");
      expect(components['/_spreadsheet1'].state.cells[2][4]).eq("E3");
      expect(components['/_spreadsheet1'].state.cells[1][5]).eq("F2");
      expect(components['/_spreadsheet1'].state.cells[1][6]).eq("G2");
      expect(components['/_spreadsheet1'].state.cells[3][6]).eq("G4");
      expect(components['/_spreadsheet1'].state.cells[4][6]).eq("G5");
      expect(components['/_spreadsheet1'].state.cells[4][7]).eq("H5");
      expect(components['/_spreadsheet1'].state.cells[4][0]).eq("A5");
      expect(components['/_spreadsheet1'].state.cells[5][1]).eq("B6");
      expect(components['/_spreadsheet1'].state.cells[4][2]).eq("C5");
      expect(components['/_cell1'].state.text).eq("C3");
      expect(components['/_cell2'].state.text).eq("D3");
      expect(components['/_cell3'].state.text).eq("E2");
      expect(components['/_cell4'].state.text).eq("E3");
      expect(components['/_cell5'].state.text).eq("F2");
      expect(components['/_cell6'].state.text).eq("G2");
      expect(components['/_cell7'].state.text).eq("G4");
      expect(components['/_cell8'].state.text).eq("G5");
      expect(components['/_cell9'].state.text).eq("H5");
      expect(components['/_cell10'].state.text).eq("A5");
      expect(components['/_cell11'].state.text).eq("B6");
      expect(components['/_cell12'].state.text).eq("C5");

    })

    cy.log("enter text into fifth row");
    for (let ind = 1; ind <= 8; ind++) {
      enterSpreadsheetText({ row: 5, column: ind, text: `column${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 8; ind++) {
        expect(components['/_spreadsheet1'].state.cells[4][ind - 1]).eq(`column${ind}`);
      }
      expect(components['/_cell8'].state.text).eq("column7");
      expect(components['/_cell9'].state.text).eq("column8");
      expect(components['/_cell10'].state.text).eq("column1");
      expect(components['/_cell12'].state.text).eq("column3");

    })

  })

  it('ref spreadsheet with cellblocks', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
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
  <ref prop="rangeC3D4">_spreadsheet1</ref>
  <ref prop="range((1,1),(4,2))">_spreadsheet1</ref>
  <ref prop="rangeD2C1" rownum="3" colnum="1">_spreadsheet1</ref>
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(4);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(4);
      expect(components['/_spreadsheet2'].state.numrows).eq(4);
      expect(components['/_spreadsheet2'].state.numcolumns).eq(4);
      for (let row = 1; row <= 4; row++) {
        for (let col = 1; col <= 4; col++) {
          expect(components['/_spreadsheet1'].state.cells[row - 1][col - 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 3; row <= 4; row++) {
        for (let col = 3; col <= 4; col++) {
          expect(components['/_spreadsheet2'].state.cells[row - 3][col - 3]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 4; row++) {
        for (let col = 1; col <= 2; col++) {
          expect(components['/_spreadsheet2'].state.cells[row - 1][col + 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 2; row++) {
        for (let col = 3; col <= 4; col++) {
          expect(components['/_spreadsheet2'].state.cells[row + 1][col - 3]).eq(`${String.fromCharCode(64 + col)}${row}`);
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
        expect(components['/_spreadsheet1'].state.cells[2][ind - 1]).eq(`column${ind}`);
      }
      expect(components['/_spreadsheet2'].state.cells[2][2]).eq(`column1`);
      expect(components['/_spreadsheet2'].state.cells[2][3]).eq(`column2`);
      expect(components['/_spreadsheet2'].state.cells[0][0]).eq(`column3`);
      expect(components['/_spreadsheet2'].state.cells[0][1]).eq(`column4`);

    })

    cy.log("enter text into second column of second spreadsheet");
    for (let ind = 1; ind <= 4; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: ind, column: 2, text: `row${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 4; ind++) {
        expect(components['/_spreadsheet2'].state.cells[ind - 1][1]).eq(`row${ind}`);
      }
      expect(components['/_spreadsheet1'].state.cells[2][3]).eq(`row1`);
      expect(components['/_spreadsheet1'].state.cells[3][3]).eq(`row2`);
      expect(components['/_spreadsheet1'].state.cells[0][3]).eq(`row3`);
      expect(components['/_spreadsheet1'].state.cells[1][3]).eq(`row4`);

    })


  })

  it('ref spreadsheet with cellblocks - no sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
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
  <ref>
    <prop>
      <variablename>cells</variablename>
      <from colnum="C" />
      <from rownum="3" />
      <to rownum="4" />
      <to colnum="D" />
    </prop>
    <reftarget>_spreadsheet1</reftarget>
  </ref>
  <ref>
    <prop>
      <variablename>cells</variablename>
      <from colnum="1"/>
      <to rownum="4"/>
      <from rownum="1"/>
      <to colnum="2"/>
    </prop>
    _spreadsheet1
  </ref>
  <ref rownum="3" colnum="1">
    <prop>
      <variablename>cells</variablename>
      <from colnum="D" />
      <to colnum="C" />
      <from rownum="2"/>
      <to rownum="1"/>
    </prop>
    _spreadsheet1
  </ref>
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(4);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(4);
      expect(components['/_spreadsheet2'].state.numrows).eq(4);
      expect(components['/_spreadsheet2'].state.numcolumns).eq(4);
      for (let row = 1; row <= 4; row++) {
        for (let col = 1; col <= 4; col++) {
          expect(components['/_spreadsheet1'].state.cells[row - 1][col - 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 3; row <= 4; row++) {
        for (let col = 3; col <= 4; col++) {
          expect(components['/_spreadsheet2'].state.cells[row - 3][col - 3]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 4; row++) {
        for (let col = 1; col <= 2; col++) {
          expect(components['/_spreadsheet2'].state.cells[row - 1][col + 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 2; row++) {
        for (let col = 3; col <= 4; col++) {
          expect(components['/_spreadsheet2'].state.cells[row + 1][col - 3]).eq(`${String.fromCharCode(64 + col)}${row}`);
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
        expect(components['/_spreadsheet1'].state.cells[2][ind - 1]).eq(`column${ind}`);
      }
      expect(components['/_spreadsheet2'].state.cells[2][2]).eq(`column1`);
      expect(components['/_spreadsheet2'].state.cells[2][3]).eq(`column2`);
      expect(components['/_spreadsheet2'].state.cells[0][0]).eq(`column3`);
      expect(components['/_spreadsheet2'].state.cells[0][1]).eq(`column4`);

    })

    cy.log("enter text into second column of second spreadsheet");
    for (let ind = 1; ind <= 4; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: ind, column: 2, text: `row${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 4; ind++) {
        expect(components['/_spreadsheet2'].state.cells[ind - 1][1]).eq(`row${ind}`);
      }
      expect(components['/_spreadsheet1'].state.cells[2][3]).eq(`row1`);
      expect(components['/_spreadsheet1'].state.cells[3][3]).eq(`row2`);
      expect(components['/_spreadsheet1'].state.cells[0][3]).eq(`row3`);
      expect(components['/_spreadsheet1'].state.cells[1][3]).eq(`row4`);

    })

  })

  it('ref spreadsheet with rows and columns', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
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
  <ref prop="row2" rownum="3">_spreadsheet1</ref>
  <ref prop="column3" colnum="5">_spreadsheet1</ref>
  <ref prop="rowA">_spreadsheet1</ref>
  <ref prop="columnB">_spreadsheet1</ref>
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(4);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(4);
      expect(components['/_spreadsheet2'].state.numrows).eq(4);
      expect(components['/_spreadsheet2'].state.numcolumns).eq(6);
      for (let row = 1; row <= 4; row++) {
        for (let col = 1; col <= 4; col++) {
          expect(components['/_spreadsheet1'].state.cells[row - 1][col - 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 2; row++) {
        for (let col = 1; col <= 4; col++) {
          expect(components['/_spreadsheet2'].state.cells[row - 1][col - 1]).eq(undefined);
        }
      }
      for (let col = 1; col <= 4; col++) {
        expect(components['/_spreadsheet2'].state.cells[2][col - 1]).eq(`${String.fromCharCode(64 + col)}2`);
        expect(components['/_spreadsheet2'].state.cells[3][col - 1]).eq(`${String.fromCharCode(64 + col)}1`);
      }
      for (let row = 1; row <= 4; row++) {
        expect(components['/_spreadsheet2'].state.cells[row - 1][4]).eq(`C${row}`);
        expect(components['/_spreadsheet2'].state.cells[row - 1][5]).eq(`B${row}`);
      }
    })

    cy.log("enter text into second row of first spreadsheet");
    for (let ind = 1; ind <= 4; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: ind, text: `column${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 4; ind++) {
        expect(components['/_spreadsheet1'].state.cells[1][ind - 1]).eq(`column${ind}`);
      }
      // becomes third row of second spreadsheet
      expect(components['/_spreadsheet2'].state.cells[2][0]).eq(`column1`);
      expect(components['/_spreadsheet2'].state.cells[2][1]).eq(`column2`);
      expect(components['/_spreadsheet2'].state.cells[2][2]).eq(`column3`);
      expect(components['/_spreadsheet2'].state.cells[2][3]).eq(`column4`);

      // fifth and sixth column ref third and second column
      expect(components['/_spreadsheet2'].state.cells[1][4]).eq(`column3`);
      expect(components['/_spreadsheet2'].state.cells[1][5]).eq(`column2`);


    })

    cy.log("enter text into fifth column of second spreadsheet");
    for (let ind = 1; ind <= 4; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: ind, column: 5, text: `row${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 4; ind++) {
        expect(components['/_spreadsheet2'].state.cells[ind - 1][4]).eq(`row${ind}`);
      }

      //comes third column of first spreadsheet
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq(`row1`);
      expect(components['/_spreadsheet1'].state.cells[1][2]).eq(`row2`);
      expect(components['/_spreadsheet1'].state.cells[2][2]).eq(`row3`);
      expect(components['/_spreadsheet1'].state.cells[3][2]).eq(`row4`);

      // third and fourth row of second spreadsheet also change due
      // changes in second and first row of first spreadsheet
      expect(components['/_spreadsheet2'].state.cells[2][2]).eq(`row2`);
      expect(components['/_spreadsheet2'].state.cells[3][2]).eq(`row1`);


    })


  })

  it('ref spreadsheet with rows and columns - no sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
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
  <ref rownum="3">
    <prop>
      <variablename>cells</variablename>
      <rownum>2</rownum>
    </prop>
    _spreadsheet1
  </ref>
  <ref colnum="5">
    <prop variablename="cells" colnum="3" />
    _spreadsheet1
  </ref>
  <ref>
    <prop variablename="cells" rownum="A" />
    _spreadsheet1
  </ref>
  <ref>
    <prop>
      <variablename>cells</variablename>
      <colnum>B</colnum>
    </prop>
    <reftarget>_spreadsheet1</reftarget>
  </ref>
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(4);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(4);
      expect(components['/_spreadsheet2'].state.numrows).eq(4);
      expect(components['/_spreadsheet2'].state.numcolumns).eq(6);
      for (let row = 1; row <= 4; row++) {
        for (let col = 1; col <= 4; col++) {
          expect(components['/_spreadsheet1'].state.cells[row - 1][col - 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 2; row++) {
        for (let col = 1; col <= 4; col++) {
          expect(components['/_spreadsheet2'].state.cells[row - 1][col - 1]).eq(undefined);
        }
      }
      for (let col = 1; col <= 4; col++) {
        expect(components['/_spreadsheet2'].state.cells[2][col - 1]).eq(`${String.fromCharCode(64 + col)}2`);
        expect(components['/_spreadsheet2'].state.cells[3][col - 1]).eq(`${String.fromCharCode(64 + col)}1`);
      }
      for (let row = 1; row <= 4; row++) {
        expect(components['/_spreadsheet2'].state.cells[row - 1][4]).eq(`C${row}`);
        expect(components['/_spreadsheet2'].state.cells[row - 1][5]).eq(`B${row}`);
      }
    })

    cy.log("enter text into second row of first spreadsheet");
    for (let ind = 1; ind <= 4; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: ind, text: `column${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 4; ind++) {
        expect(components['/_spreadsheet1'].state.cells[1][ind - 1]).eq(`column${ind}`);
      }
      // becomes third row of second spreadsheet
      expect(components['/_spreadsheet2'].state.cells[2][0]).eq(`column1`);
      expect(components['/_spreadsheet2'].state.cells[2][1]).eq(`column2`);
      expect(components['/_spreadsheet2'].state.cells[2][2]).eq(`column3`);
      expect(components['/_spreadsheet2'].state.cells[2][3]).eq(`column4`);

      // fifth and sixth column ref third and second column
      expect(components['/_spreadsheet2'].state.cells[1][4]).eq(`column3`);
      expect(components['/_spreadsheet2'].state.cells[1][5]).eq(`column2`);


    })

    cy.log("enter text into fifth column of second spreadsheet");
    for (let ind = 1; ind <= 4; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: ind, column: 5, text: `row${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 4; ind++) {
        expect(components['/_spreadsheet2'].state.cells[ind - 1][4]).eq(`row${ind}`);
      }

      //becomes third column of first spreadsheet
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq(`row1`);
      expect(components['/_spreadsheet1'].state.cells[1][2]).eq(`row2`);
      expect(components['/_spreadsheet1'].state.cells[2][2]).eq(`row3`);
      expect(components['/_spreadsheet1'].state.cells[3][2]).eq(`row4`);

      // third and fourth row of second spreadsheet also change due
      // changes in second and first row of first spreadsheet
      expect(components['/_spreadsheet2'].state.cells[2][2]).eq(`row2`);
      expect(components['/_spreadsheet2'].state.cells[3][2]).eq(`row1`);

    })

  })

  it('ref all spreadsheet cells shifted', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <spreadsheet numrows="3" numcolumns="3">
  <cell>A1</cell><cell>B1</cell><cell>C1</cell>
  <cell rownum="2" colnum="1">A2</cell><cell>B2</cell><cell>C2</cell>
  <cell rownum="3" colnum="1">A3</cell><cell>B3</cell><cell>C3</cell>
  </spreadsheet>

  <spreadsheet>
  <ref prop="cells" rownum="3" colnum="2">_spreadsheet1</ref>
  </spreadsheet>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'A1')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(3);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(3);
      expect(components['/_spreadsheet2'].state.numrows).eq(5);
      expect(components['/_spreadsheet2'].state.numcolumns).eq(4);
      for (let row = 1; row <= 3; row++) {
        for (let col = 1; col <= 3; col++) {
          expect(components['/_spreadsheet1'].state.cells[row - 1][col - 1]).eq(`${String.fromCharCode(64 + col)}${row}`);
        }
      }
      for (let row = 1; row <= 3; row++) {
        for (let col = 1; col <= 3; col++) {
          expect(components['/_spreadsheet2'].state.cells[row + 1][col]).eq(`${String.fromCharCode(64 + col)}${row}`);
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
        expect(components['/_spreadsheet1'].state.cells[1][ind - 1]).eq(`column${ind}`);
      }
      for (let ind = 1; ind <= 3; ind++) {
        expect(components['/_spreadsheet2'].state.cells[3][ind]).eq(`column${ind}`);
      }

    })

    cy.log("enter text into fourth column of second spreadsheet");
    for (let ind = 1; ind <= 5; ind++) {
      enterSpreadsheetText({ id: "\\/_spreadsheet2", row: ind, column: 4, text: `row${ind}` });
    }
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 5; ind++) {
        expect(components['/_spreadsheet2'].state.cells[ind - 1][3]).eq(`row${ind}`);
      }

      //becomes third column of first spreadsheet
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq(`row3`);
      expect(components['/_spreadsheet1'].state.cells[1][2]).eq(`row4`);
      expect(components['/_spreadsheet1'].state.cells[2][2]).eq(`row5`);

    })

  })

  it('ref spreadsheet cells ignores cell col/row num', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellE1">_spreadsheet1</ref></extract>
  <spreadsheet>
  <cell colnum="5">alpha</cell>
  <cell>beta</cell>
  <cell rownum="2">gamma</cell>
  </spreadsheet>
  
  <spreadsheet>
  <ref prop="rangeE1F2">_spreadsheet1</ref>
  <ref prop="rangeE1F2" colnum="4">_spreadsheet1</ref>
  <ref prop="rangeE1F2" rownum="3">_spreadsheet1</ref>
  </spreadsheet>  
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'alpha')

    let cellBlockUpperLefts = [[0, 0], [0, 3], [2, 3]];

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][4]).eq('alpha');
      expect(components['/_spreadsheet1'].state.cells[0][5]).eq('beta');
      expect(components['/_spreadsheet1'].state.cells[1][5]).eq('gamma');
      for (let inds of cellBlockUpperLefts) {
        let row = inds[0];
        let col = inds[1];
        expect(components['/_spreadsheet2'].state.cells[row][col]).eq('alpha');
        expect(components['/_spreadsheet2'].state.cells[row][col + 1]).eq('beta');
        expect(components['/_spreadsheet2'].state.cells[row + 1][col + 1]).eq('gamma');

      }
    })

    cy.log("enter text in first spreadsheet block");
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 5, text: `a` });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 6, text: `b` });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: 5, text: `c` });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: 6, text: `d` });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][4]).eq('a');
      expect(components['/_spreadsheet1'].state.cells[0][5]).eq('b');
      expect(components['/_spreadsheet1'].state.cells[1][4]).eq('c');
      expect(components['/_spreadsheet1'].state.cells[1][5]).eq('d');
      for (let inds of cellBlockUpperLefts) {
        let row = inds[0];
        let col = inds[1];
        expect(components['/_spreadsheet2'].state.cells[row][col]).eq('a');
        expect(components['/_spreadsheet2'].state.cells[row][col + 1]).eq('b');
        expect(components['/_spreadsheet2'].state.cells[row + 1][col]).eq('c');
        expect(components['/_spreadsheet2'].state.cells[row + 1][col + 1]).eq('d');

      }
    })


    cy.log("enter text in other spreadsheet blocks");
    enterSpreadsheetText({ id: "\\/_spreadsheet2", row: 1, column: 1, text: `first` });
    enterSpreadsheetText({ id: "\\/_spreadsheet2", row: 1, column: 5, text: `second` });
    enterSpreadsheetText({ id: "\\/_spreadsheet2", row: 4, column: 4, text: `third` });
    enterSpreadsheetText({ id: "\\/_spreadsheet2", row: 4, column: 5, text: `fourth` });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][4]).eq('first');
      expect(components['/_spreadsheet1'].state.cells[0][5]).eq('second');
      expect(components['/_spreadsheet1'].state.cells[1][4]).eq('third');
      expect(components['/_spreadsheet1'].state.cells[1][5]).eq('fourth');
      for (let inds of cellBlockUpperLefts) {
        let row = inds[0];
        let col = inds[1];
        expect(components['/_spreadsheet2'].state.cells[row][col]).eq('first');
        expect(components['/_spreadsheet2'].state.cells[row][col + 1]).eq('second');
        expect(components['/_spreadsheet2'].state.cells[row + 1][col]).eq('third');
        expect(components['/_spreadsheet2'].state.cells[row + 1][col + 1]).eq('fourth');

      }
    })


  })

  it('ref points from spreadsheet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <spreadsheet>
  <cell>(1,2)</cell>
  <cell>hello</cell>
  <cell>5</cell>
  </spreadsheet>
  
  <graph>
    <ref prop="points">_spreadsheet1</ref>
  </graph>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', '(1,2)')

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq('(1,2)');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_graph1'].activeChildren.length).eq(1);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eq(1);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(2);

    })

    cy.log('move point');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_graph1'].activeChildren[0].movePoint({ x: -3, y: 7 })
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq('( -3, 7 )');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_graph1'].activeChildren.length).eq(1);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eqls(['-', 3]);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(7);

    })

    cy.log('type in different coordinates');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 1, text: '(4,9)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq('(4,9)');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_graph1'].activeChildren.length).eq(1);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eq(4);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(9);

    })

    cy.log('enter new point');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 3, column: 2, text: '(5,4)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq('(4,9)');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq('(5,4)');
      expect(components['/_graph1'].activeChildren.length).eq(2);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eq(4);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(9);
      expect(components['/_graph1'].activeChildren[1].state.xs[0].tree).eq(5);
      expect(components['/_graph1'].activeChildren[1].state.xs[1].tree).eq(4);

    })

    cy.log('move new point');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_graph1'].activeChildren[1].movePoint({ x: 0, y: 1 })
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq('(4,9)');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq('( 0, 1 )');
      expect(components['/_graph1'].activeChildren.length).eq(2);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eq(4);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(9);
      expect(components['/_graph1'].activeChildren[1].state.xs[0].tree).eq(0);
      expect(components['/_graph1'].activeChildren[1].state.xs[1].tree).eq(1);

    })


    cy.log('enter random text on top of point');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 1, text: ')x,-', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq(')x,-');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq('( 0, 1 )');
      expect(components['/_graph1'].activeChildren.length).eq(1);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eq(0);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(1);

    })

    cy.log('enter new point');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 4, column: 1, text: '(3,2)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq(')x,-');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq('( 0, 1 )');
      expect(components['/_spreadsheet1'].state.cells[3][0]).eq('(3,2)');
      expect(components['/_graph1'].activeChildren.length).eq(2);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eq(3);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(2);
      expect(components['/_graph1'].activeChildren[1].state.xs[0].tree).eq(0);
      expect(components['/_graph1'].activeChildren[1].state.xs[1].tree).eq(1);

    })

    cy.log('enter point on top of text');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 1, column: 1, text: '(7,3)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq('(7,3)');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq('( 0, 1 )');
      expect(components['/_spreadsheet1'].state.cells[3][0]).eq('(3,2)');
      expect(components['/_graph1'].activeChildren.length).eq(3);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eq(7);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(3);
      expect(components['/_graph1'].activeChildren[1].state.xs[0].tree).eq(3);
      expect(components['/_graph1'].activeChildren[1].state.xs[1].tree).eq(2);
      expect(components['/_graph1'].activeChildren[2].state.xs[0].tree).eq(0);
      expect(components['/_graph1'].activeChildren[2].state.xs[1].tree).eq(1);

    })


    cy.log('non-numerical point added (but not graphed)');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: 4, text: '(x,q)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq('(7,3)');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq('( 0, 1 )');
      expect(components['/_spreadsheet1'].state.cells[3][0]).eq('(3,2)');
      expect(components['/_spreadsheet1'].state.cells[1][3]).eq('(x,q)');
      expect(components['/_graph1'].activeChildren.length).eq(4);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eq(7);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(3);
      expect(components['/_graph1'].activeChildren[1].state.xs[0].tree).eq(3);
      expect(components['/_graph1'].activeChildren[1].state.xs[1].tree).eq(2);
      expect(components['/_graph1'].activeChildren[2].state.xs[0].tree).eq(0);
      expect(components['/_graph1'].activeChildren[2].state.xs[1].tree).eq(1);
      expect(components['/_graph1'].activeChildren[3].state.xs[0].tree).eq('x');
      expect(components['/_graph1'].activeChildren[3].state.xs[1].tree).eq('q');

    })


    cy.log('3D point added (but not graphed)');
    enterSpreadsheetText({ id: "\\/_spreadsheet1", row: 2, column: 1, text: '(1,2,3)', clear: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq('(7,3)');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq('( 0, 1 )');
      expect(components['/_spreadsheet1'].state.cells[3][0]).eq('(3,2)');
      expect(components['/_spreadsheet1'].state.cells[1][3]).eq('(x,q)');
      expect(components['/_spreadsheet1'].state.cells[1][0]).eq('(1,2,3)');
      expect(components['/_graph1'].activeChildren.length).eq(5);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eq(7);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(3);
      expect(components['/_graph1'].activeChildren[1].state.xs[0].tree).eq(1);
      expect(components['/_graph1'].activeChildren[1].state.xs[1].tree).eq(2);
      expect(components['/_graph1'].activeChildren[1].state.xs[2].tree).eq(3);
      expect(components['/_graph1'].activeChildren[2].state.xs[0].tree).eq(3);
      expect(components['/_graph1'].activeChildren[2].state.xs[1].tree).eq(2);
      expect(components['/_graph1'].activeChildren[3].state.xs[0].tree).eq(0);
      expect(components['/_graph1'].activeChildren[3].state.xs[1].tree).eq(1);
      expect(components['/_graph1'].activeChildren[4].state.xs[0].tree).eq('x');
      expect(components['/_graph1'].activeChildren[4].state.xs[1].tree).eq('q');

    })


    cy.log('move point');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_graph1'].activeChildren[2].movePoint({ x: 8, y: 5 });

      expect(components['/_spreadsheet1'].state.cells[0][0]).eq('(7,3)');
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq('hello');
      expect(components['/_spreadsheet1'].state.cells[0][2]).eq('5');
      expect(components['/_spreadsheet1'].state.cells[2][1]).eq('( 0, 1 )');
      expect(components['/_spreadsheet1'].state.cells[3][0]).eq('( 8, 5 )');
      expect(components['/_spreadsheet1'].state.cells[1][3]).eq('(x,q)');
      expect(components['/_spreadsheet1'].state.cells[1][0]).eq('(1,2,3)');
      expect(components['/_graph1'].activeChildren.length).eq(5);
      expect(components['/_graph1'].activeChildren[0].state.xs[0].tree).eq(7);
      expect(components['/_graph1'].activeChildren[0].state.xs[1].tree).eq(3);
      expect(components['/_graph1'].activeChildren[1].state.xs[0].tree).eq(1);
      expect(components['/_graph1'].activeChildren[1].state.xs[1].tree).eq(2);
      expect(components['/_graph1'].activeChildren[1].state.xs[2].tree).eq(3);
      expect(components['/_graph1'].activeChildren[2].state.xs[0].tree).eq(8);
      expect(components['/_graph1'].activeChildren[2].state.xs[1].tree).eq(5);
      expect(components['/_graph1'].activeChildren[3].state.xs[0].tree).eq(0);
      expect(components['/_graph1'].activeChildren[3].state.xs[1].tree).eq(1);
      expect(components['/_graph1'].activeChildren[4].state.xs[0].tree).eq('x');
      expect(components['/_graph1'].activeChildren[4].state.xs[1].tree).eq('q');

    })
  })

  it('internal references within spreadsheet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <spreadsheet>
    <ref prop="cellC1">_spreadsheet1</ref>
    <ref prop="cellE1">_spreadsheet1</ref>
    <cell>first</cell>
    <ref prop="cellB1">_spreadsheet1</ref>
    <ref prop="cellC1">_spreadsheet1</ref>

    <row rownum="2">
      <ref colnum="2" prop="cellC2">_spreadsheet1</ref>
      <ref prop="cellD2">_spreadsheet1</ref>
      <ref prop="cellE2">_spreadsheet1</ref>
      <ref prop="cellF2">_spreadsheet1</ref>
      <ref prop="cellA3">_spreadsheet1</ref>
    </row>
  </spreadsheet>
 
  <ref name="s2">_spreadsheet1</ref>

  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'first')

    let firstInds = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
    let secondInds = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 0]];

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(4);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(6);
      expect(components['/s2'].replacements[0].state.numrows).eq(4);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(6);
      for (let inds of firstInds) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(`first`);
        expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(`first`);
      }
      for (let inds of secondInds) {
        expect(["", undefined].includes(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]])).eq(true);
        expect(["", undefined].includes(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]])).eq(true);
      }

    })

    cy.log("change text of second group in first spreadsheet")
    for (let indsChange of secondInds) {
      let newText = `a${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('first');
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq('first');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(newText);
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
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('a20');
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq('a20');
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
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('b04');
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq('b04');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(newText);
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
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('c20');
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq('c20');
        }
      })
    }


  })

  it('internal references within spreadsheet 2', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <spreadsheet>
    <ref rownum="2" prop="cellC3">_spreadsheet1</ref>
    <cell rownum="3" colnum="B">first</cell>
    <ref prop="cellB3">_spreadsheet1</ref>
    <ref prop="cellA1">_spreadsheet1</ref>
    <ref rownum="5" colnum="2" prop="rangeA1C3">_spreadsheet1</ref>
    <ref prop="column2" colnum="5">_spreadsheet1</ref>
  </spreadsheet>

  <ref name="s2">_spreadsheet1</ref>
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
      expect(components['/_spreadsheet1'].state.numrows).eq(7);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(5);
      expect(components['/s2'].replacements[0].state.numrows).eq(7);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(5);
      for (let inds of firstInds) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(`first`);
        expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(`first`);
      }
      for (let inds of secondInds) {
        expect(["", undefined].includes(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]])).eq(true);
        expect(["", undefined].includes(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]])).eq(true);
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
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('first');
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq('first');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(newText);
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
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('a44');
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq('a44');
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
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('b54');
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq('b54');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(newText);
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
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('c44');
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq('c44');
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
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
        expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
      }
      for (let [i, inds] of block2Inds.entries()) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
        expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
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
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
        expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
      }
      for (let [i, inds] of block2Inds.entries()) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
        expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
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
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(blockTexts3[i]);
        expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(blockTexts3[i]);
      }
      for (let [i, inds] of block2Inds.entries()) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(blockTexts3[i]);
        expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(blockTexts3[i]);
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
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(blockTexts4[i]);
        expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(blockTexts4[i]);
      }
      for (let [i, inds] of block2Inds.entries()) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(blockTexts4[i]);
        expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(blockTexts4[i]);
      }
    });

  })

  it('internal references to rows', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <spreadsheet>
    <ref prop="rowC">_spreadsheet1</ref>
    <ref prop="rowE">_spreadsheet1</ref>
    <row><cell>first</cell><cell>second</cell><cell colnum="6">sixth</cell></row>
    <ref prop="rowB">_spreadsheet1</ref>
    <ref prop="rowC">_spreadsheet1</ref>
  </spreadsheet>

  <ref name="s2">_spreadsheet1</ref>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'first')

    let numrows = 5;
    let numcols = 6;

    let rowTexts = ["first", "second", , , , "sixth"]

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(numrows);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(numcols);
      expect(components['/s2'].replacements[0].state.numrows).eq(numrows);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(numcols);
      for (let row = 0; row < numrows; row++) {
        for (let col of [0, 1, 5]) {
          expect(components['/_spreadsheet1'].state.cells[row][col]).eq(rowTexts[col]);
          expect(components['/s2'].replacements[0].state.cells[row][col]).eq(rowTexts[col]);
        }
      }

    })

    cy.log("change text of each row in first spreadsheet")

    let newRowTexts = [];
    for (let rowChange = 0; rowChange < numrows; rowChange++) {
      newRowTexts.push([]);
      let thisNew = newRowTexts[rowChange];
      for (let colChange = 0; colChange < numcols; colChange++) {
        let newText = `a${rowChange}${colChange}`;
        thisNew.push(newText);
        enterSpreadsheetText({ id: "\\/_spreadsheet1", row: rowChange + 1, column: colChange + 1, text: newText });
      }
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let row = 0; row < numrows; row++) {
          for (let col = 0; col < numcols; col++) {
            expect(components['/_spreadsheet1'].state.cells[row][col]).eq(thisNew[col]);
            expect(components['/s2'].replacements[0].state.cells[row][col]).eq(thisNew[col]);
          }
        }
      });
    }

    cy.log("change text of each row in second spreadsheet")

    let newRowTextsB = [];
    for (let rowChange = 0; rowChange < numrows; rowChange++) {
      newRowTextsB.push([]);
      let thisNew = newRowTextsB[rowChange];
      for (let colChange = 0; colChange < numcols; colChange++) {
        let newText = `b${rowChange}${colChange}`;
        thisNew.push(newText);
        enterSpreadsheetText({ id: "__spreadsheet1", row: rowChange + 1, column: colChange + 1, text: newText });
      }
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let row = 0; row < numrows; row++) {
          for (let col = 0; col < numcols; col++) {
            expect(components['/_spreadsheet1'].state.cells[row][col]).eq(thisNew[col]);
            expect(components['/s2'].replacements[0].state.cells[row][col]).eq(thisNew[col]);
          }
        }
      });
    }

  })

  it('internal references to columns', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <spreadsheet>
    <ref prop="columnC">_spreadsheet1</ref>
    <ref prop="columnE">_spreadsheet1</ref>
    <column><cell>first</cell><cell>second</cell><cell rownum="6">sixth</cell></column>
    <ref prop="columnB">_spreadsheet1</ref>
    <ref prop="columnC">_spreadsheet1</ref>
  </spreadsheet>

  <ref name="s2">_spreadsheet1</ref>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'first')


    let numrows = 6;
    let numcols = 5;

    let colTexts = ["first", "second", , , , "sixth"]

    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(numrows);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(numcols);
      expect(components['/s2'].replacements[0].state.numrows).eq(numrows);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(numcols);
      for (let col = 0; col < numcols; col++) {
        for (let row of [0, 1, 5]) {
          expect(components['/_spreadsheet1'].state.cells[row][col]).eq(colTexts[row]);
          expect(components['/s2'].replacements[0].state.cells[row][col]).eq(colTexts[row]);
        }
      }

    })

    cy.log("change text of each column in first spreadsheet")

    let newcolTexts = [];
    for (let colChange = 0; colChange < numcols; colChange++) {
      newcolTexts.push([]);
      let thisNew = newcolTexts[colChange];
      for (let rowChange = 0; rowChange < numrows; rowChange++) {
        let newText = `a${colChange}${rowChange}`;
        thisNew.push(newText);
        enterSpreadsheetText({ id: "\\/_spreadsheet1", column: colChange + 1, row: rowChange + 1, text: newText });
      }
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let col = 0; col < numcols; col++) {
          for (let row = 0; row < numrows; row++) {
            expect(components['/_spreadsheet1'].state.cells[row][col]).eq(thisNew[row]);
            expect(components['/s2'].replacements[0].state.cells[row][col]).eq(thisNew[row]);
          }
        }
      });
    }

    cy.log("change text of each column in second spreadsheet")

    let newcolTextsB = [];
    for (let colChange = 0; colChange < numcols; colChange++) {
      newcolTextsB.push([]);
      let thisNew = newcolTextsB[colChange];
      for (let rowChange = 0; rowChange < numrows; rowChange++) {
        let newText = `b${colChange}${rowChange}`;
        thisNew.push(newText);
        enterSpreadsheetText({ id: "__spreadsheet1", column: colChange + 1, row: rowChange + 1, text: newText });
      }
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let col = 0; col < numcols; col++) {
          for (let row = 0; row < numrows; row++) {
            expect(components['/_spreadsheet1'].state.cells[row][col]).eq(thisNew[row]);
            expect(components['/s2'].replacements[0].state.cells[row][col]).eq(thisNew[row]);
          }
        }
      });
    }

  })

  it('internal references to cell ranges', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellF1">_spreadsheet1</ref></extract>
  <spreadsheet>
    <ref prop="rangeE1F2">_spreadsheet1</ref>
    <cellblock>
      <row><cell>a</cell><cell>b</cell></row>
      <row><cell>c</cell><cell>d</cell></row>
      <row><cell>e</cell><cell>f</cell></row>
      <row><cell>g</cell><cell>h</cell></row>
    </cellblock>
    <ref prop="rangeC1D3">_spreadsheet1</ref>
  </spreadsheet>

  <ref name="s2">_spreadsheet1</ref>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', 'b')


    let numrows = 4;
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
      expect(components['/_spreadsheet1'].state.numrows).eq(numrows);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(numcols);
      expect(components['/s2'].replacements[0].state.numrows).eq(numrows);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(numcols);
      for (let group = 0; group < 8; group++) {
        for (let inds of groupInds[group]) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(groupTexts[group]);
          expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(groupTexts[group]);
        }
      }
      for (let inds of extraInds) {
        expect(["", undefined].includes(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]])).eq(true);
        expect(["", undefined].includes(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]])).eq(true);
      }

    })

    cy.log("change text of each column in first spreadsheet")
    let newcolTexts = [];
    let newGroupTexts = [];
    for (let colChange = 0; colChange < numcols; colChange++) {
      newcolTexts.push([]);
      let thisNew = newcolTexts[colChange];
      for (let rowChange = 0; rowChange < numrows; rowChange++) {
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
            expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(thisNewGroup[group]);
            expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(thisNewGroup[group]);
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
      for (let rowChange = 0; rowChange < numrows; rowChange++) {
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
            expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(thisNewGroup[group]);
            expect(components['/s2'].replacements[0].state.cells[inds[0]][inds[1]]).eq(thisNewGroup[group]);
          }
        }
      });
    }


  })

  it('mutual references between two spreadsheets', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <spreadsheet>
    <ref rownum="2" colnum="1" prop="cellC3">_spreadsheet2</ref>
    <ref prop="cellA2">_spreadsheet2</ref>
    <ref prop="cellB2">_spreadsheet2</ref>
    <ref prop="cellC2">_spreadsheet2</ref>
    <ref prop="cellD2">_spreadsheet2</ref>
    <ref prop="row2" rownum="4">_spreadsheet2</ref>
    <ref prop="rangeB2D4" rownum="5" colnum="4">_spreadsheet2</ref>
    <cell rownum="3" colnum="C">first</cell>
  </spreadsheet>

  <spreadsheet>
    <ref rownum="2" colnum="1" prop="cellC3">_spreadsheet1</ref>
    <ref prop="cellA2">_spreadsheet1</ref>
    <ref prop="cellB2">_spreadsheet1</ref>
    <ref prop="cellC2">_spreadsheet1</ref>
    <ref prop="cellD2">_spreadsheet1</ref>
    <ref prop="row2" rownum="4">_spreadsheet1</ref>
    <ref prop="rangeB2D4" rownum="5" colnum="4">_spreadsheet1</ref>
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
      expect(components['/_spreadsheet1'].state.numrows).eq(7);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(6);
      expect(components['/_spreadsheet2'].state.numrows).eq(7);
      expect(components['/_spreadsheet2'].state.numcolumns).eq(6);
      for (let inds of firstInds) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(`first`);
        expect(["", undefined].includes(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]])).eq(true);
      }
      for (let inds of secondInds) {
        expect(["", undefined].includes(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]])).eq(true);
        expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(`first`);
      }
      for (let inds of [...row1Inds, ...row2Inds, ...block1Inds, ...block2Inds]) {
        expect(["", undefined].includes(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]])).eq(true);
        expect(["", undefined].includes(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]])).eq(true);
      }

    })

    cy.log("change text of second group in first spreadsheet")
    for (let indsChange of secondInds) {
      let newText = `a${indsChange[0]}${indsChange[1]}`
      enterSpreadsheetText({ id: "\\/_spreadsheet1", row: indsChange[0] + 1, column: indsChange[1] + 1, text: newText });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        for (let inds of firstInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('first');
          expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq('first');
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
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq('a54');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('a54');
          expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(newText);
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
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('b65');
          expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(newText);
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq('b65');
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
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(newText);
          expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq('c65');
        }
        for (let inds of secondInds) {
          expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq('c65');
          expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(newText);
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
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
      }
      for (let [i, inds] of [...block2Inds, ...block1Inds].entries()) {
        expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(blockTexts1[i]);
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
        expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
      }
      for (let [i, inds] of [...block2Inds, ...block1Inds].entries()) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(blockTexts2[i]);
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
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(rowTexts1[i]);
      }
      for (let [i, inds] of [...row2Inds, ...row1Inds].entries()) {
        expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(rowTexts1[i]);
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
        expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(rowTexts2[i]);
      }
      for (let [i, inds] of [...row2Inds, ...row1Inds].entries()) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(rowTexts2[i]);
      }
    });



  })

  it('references to cells outside spreadsheet area', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <spreadsheet>
    <ref prop="cellQ1">_spreadsheet1</ref>
    <ref prop="rangeE6F8">_spreadsheet1</ref>
    <ref rownum="4" prop="row10">_spreadsheet1</ref>
    <ref rownum="5" prop="row8">_spreadsheet2</ref>
    <ref rownum="2" colnum="4" prop="cellG2">_spreadsheet2</ref>
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
      expect(components['/_spreadsheet1'].state.numrows).eq(numrows1);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(numcols1);
      expect(components['/_spreadsheet2'].state.numrows).eq(numrows2);
      expect(components['/_spreadsheet2'].state.numcolumns).eq(numcols2);
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
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(textsA[i]);
      }
      for (let [i, inds] of inds1B.entries()) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(textsA[i]);
      }
      for (let [i, inds] of inds2.entries()) {
        expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(textsA[i + inds1B.length]);
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
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(textsB[i]);
      }
      for (let [i, inds] of inds1B.entries()) {
        expect(components['/_spreadsheet1'].state.cells[inds[0]][inds[1]]).eq(textsB[i]);
      }
      for (let [i, inds] of inds2.entries()) {
        expect(components['/_spreadsheet2'].state.cells[inds[0]][inds[1]]).eq(textsB[i + inds1B.length]);
      }
    })




  })

  it('internal references to spreadsheet size', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <spreadsheet>
    <cell><ref prop="numrows">_spreadsheet1</ref></cell>
    <cell><ref prop="numcolumns">_spreadsheet1</ref></cell>
  </spreadsheet>

  <ref name="s2">_spreadsheet1</ref>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', '4')


    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(4);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(4);
      expect(components['/s2'].replacements[0].state.numrows).eq(4);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(4);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("4");
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq("4");
      expect(components['/s2'].replacements[0].state.cells[0][0]).eq("4");
      expect(components['/s2'].replacements[0].state.cells[0][1]).eq("4");
    });

    cy.log("increase rownum and colnum in first spreadsheet")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "6" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "7" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(6);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(7);
      expect(components['/s2'].replacements[0].state.numrows).eq(6);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(7);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("6");
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq("7");
      expect(components['/s2'].replacements[0].state.cells[0][0]).eq("6");
      expect(components['/s2'].replacements[0].state.cells[0][1]).eq("7");
    });


    cy.log("can't decrease rownum and colnum")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "3", verify: false });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "2", verify: false });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(6);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(7);
      expect(components['/s2'].replacements[0].state.numrows).eq(6);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(7);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("6");
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq("7");
      expect(components['/s2'].replacements[0].state.cells[0][0]).eq("6");
      expect(components['/s2'].replacements[0].state.cells[0][1]).eq("7");
    });


    cy.log("can't make non-numeric rownum and colnum")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "hello", verify: false });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "x", verify: false });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(6);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(7);
      expect(components['/s2'].replacements[0].state.numrows).eq(6);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(7);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("6");
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq("7");
      expect(components['/s2'].replacements[0].state.cells[0][0]).eq("6");
      expect(components['/s2'].replacements[0].state.cells[0][1]).eq("7");
    });


    cy.log("increase rownum and colnum in second spreadsheet")
    enterSpreadsheetText({ id: "__spreadsheet1", column: 1, row: 1, text: "11" });
    enterSpreadsheetText({ id: "__spreadsheet1", column: 2, row: 1, text: "9" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(11);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(9);
      expect(components['/s2'].replacements[0].state.numrows).eq(11);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(9);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("11");
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq("9");
      expect(components['/s2'].replacements[0].state.cells[0][0]).eq("11");
      expect(components['/s2'].replacements[0].state.cells[0][1]).eq("9");
    });

  })

  it('spreadsheet size based on internal references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <extract prop="text"><ref prop="cellA1">_spreadsheet1</ref></extract>
  <spreadsheet>
    <numrows><ref prop="cellA1">_spreadsheet1</ref></numrows>
    <numcolumns><ref prop="cellB1">_spreadsheet1</ref></numcolumns>
  </spreadsheet>

  <ref name="s2">_spreadsheet1</ref>
  `}, "*");
    });

    // to wait for page to load
    cy.get('#__text1').should('have.text', '')


    cy.log('check initial cell values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(4);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(4);
      expect(components['/s2'].replacements[0].state.numrows).eq(4);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(4);
      expect([undefined, ""].includes(components['/_spreadsheet1'].state.cells[0][0])).eq(true);
      expect([undefined, ""].includes(components['/_spreadsheet1'].state.cells[0][1])).eq(true);
      expect([undefined, ""].includes(components['/s2'].replacements[0].state.cells[0][0])).eq(true);
      expect([undefined, ""].includes(components['/s2'].replacements[0].state.cells[0][1])).eq(true);
    });

    cy.log("increase rownum and colnum in first spreadsheet")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "6" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "7" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(6);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(7);
      expect(components['/s2'].replacements[0].state.numrows).eq(6);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(7);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("6");
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq("7");
      expect(components['/s2'].replacements[0].state.cells[0][0]).eq("6");
      expect(components['/s2'].replacements[0].state.cells[0][1]).eq("7");
    });


    cy.log("can't decrease rownum and colnum")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "3" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "2" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(6);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(7);
      expect(components['/s2'].replacements[0].state.numrows).eq(6);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(7);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("3");
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq("2");
      expect(components['/s2'].replacements[0].state.cells[0][0]).eq("3");
      expect(components['/s2'].replacements[0].state.cells[0][1]).eq("2");
    });


    cy.log("can't make non-numeric rownum and colnum")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "hello" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 2, row: 1, text: "x" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(6);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(7);
      expect(components['/s2'].replacements[0].state.numrows).eq(6);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(7);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("hello");
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq("x");
      expect(components['/s2'].replacements[0].state.cells[0][0]).eq("hello");
      expect(components['/s2'].replacements[0].state.cells[0][1]).eq("x");
    });


    cy.log("increase rownum and colnum in second spreadsheet")
    enterSpreadsheetText({ id: "__spreadsheet1", column: 1, row: 1, text: "11" });
    enterSpreadsheetText({ id: "__spreadsheet1", column: 2, row: 1, text: "9" });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.numrows).eq(11);
      expect(components['/_spreadsheet1'].state.numcolumns).eq(9);
      expect(components['/s2'].replacements[0].state.numrows).eq(11);
      expect(components['/s2'].replacements[0].state.numcolumns).eq(9);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("11");
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq("9");
      expect(components['/s2'].replacements[0].state.cells[0][0]).eq("11");
      expect(components['/s2'].replacements[0].state.cells[0][1]).eq("9");
    });

  })

  it('references to cells, adapter to math, number, or text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
<spreadsheet>
  <cell>1</cell>
</spreadsheet>

<p><ref prop="cellA1">_spreadsheet1</ref> A</p>

<p><aslist>
  <math simplify><ref prop="cellA1">_spreadsheet1</ref>+1</math>
  <number><ref prop="cellA1">_spreadsheet1</ref>+1</number>
  <text><ref prop="cellA1">_spreadsheet1</ref> B</text>
</aslist></p>

<p><aslist>
  <math simplify><ref prop="cellA1">_spreadsheet1</ref>+<ref prop="cellA2">_spreadsheet1</ref></math>
  <number><ref prop="cellA1">_spreadsheet1</ref>+<ref prop="cellA2">_spreadsheet1</ref></number>
  <text><ref prop="cellA1">_spreadsheet1</ref> + <ref prop="cellA2">_spreadsheet1</ref></text>
</aslist></p>
  `}, "*");
    });

    cy.log('check initial cell values')

    cy.get('#\\/_p1').should('have.text', '1 A');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/_number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/_text1').should('have.text', '1 B');

    cy.get('#\\/_math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+1')
    })
    cy.get('#\\/_number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/_text2').should('have.text', '1 + ');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq("1");
    });


    cy.log("different numbers in cells")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "5" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 2, text: "7" });


    cy.get('#\\/_p1').should('have.text', '5 A');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    })
    cy.get('#\\/_number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    })
    cy.get('#\\/_text1').should('have.text', '5 B');

    cy.get('#\\/_math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('12')
    })
    cy.get('#\\/_number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('12')
    })
    cy.get('#\\/_text2').should('have.text', '5 + 7');


    cy.log("different variables in cells")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "x" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 2, text: "y" });

    cy.get('#\\/_p1').should('have.text', 'x A');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    })
    cy.get('#\\/_number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/_text1').should('have.text', 'x B');

    cy.get('#\\/_math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get('#\\/_number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/_text2').should('have.text', 'x + y');


    cy.log("non-valid math in one cell")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "q(" });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 2, text: "sin(w)" });

    cy.get('#\\/_p1').should('have.text', 'q( A');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+1')
    })
    cy.get('#\\/_number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/_text1').should('have.text', 'q( B');

    cy.get('#\\/_math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+sin(w)')
    })
    cy.get('#\\/_number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/_text2').should('have.text', 'q( + sin(w)');


    cy.log("one cell is blank")
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 1, text: "", clear: true });
    enterSpreadsheetText({ id: "\\/_spreadsheet1", column: 1, row: 2, text: "5" });

    cy.get('#\\/_p1').should('have.text', ' A');

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+1')
    })
    cy.get('#\\/_number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/_text1').should('have.text', ' B');

    cy.get('#\\/_math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+5')
    })
    cy.get('#\\/_number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/_text2').should('have.text', ' + 5');

  })

  it('references to cells within other cells math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <spreadsheet>
  <cell>1</cell><cell><math simplify><ref fixed>x</ref>+<ref prop="cellA2">_spreadsheet1</ref></math></cell>
  <cell rownum="2" colnum="1">3</cell>
  <cell><math simplify><ref prop="cellA1" fixed>_spreadsheet1</ref> + <ref prop="cellC2">_spreadsheet1</ref></math></cell>
  <cell>5</cell>
</spreadsheet>

<math name="x" simplify><ref prop="cellA1">_spreadsheet1</ref>+1</math>
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

      expect(components['/x'].state.value.tree).eq(x);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq(A1.toString());
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq(B1.toString());
      expect(components['/_spreadsheet1'].state.cells[1][0]).eq(A2.toString());
      expect(components['/_spreadsheet1'].state.cells[1][1]).eq(B2.toString());
      expect(components['/_spreadsheet1'].state.cells[1][2]).eq(C2.toString());
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

      expect(components['/x'].state.value.tree).eq(x);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq(A1.toString());
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq(B1.toString());
      expect(components['/_spreadsheet1'].state.cells[1][0]).eq(A2.toString());
      expect(components['/_spreadsheet1'].state.cells[1][1]).eq(B2.toString());
      expect(components['/_spreadsheet1'].state.cells[1][2]).eq(C2.toString());
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

      expect(components['/x'].state.value.tree).eq(x);
      expect(components['/_spreadsheet1'].state.cells[0][0]).eq(A1.toString());
      expect(components['/_spreadsheet1'].state.cells[0][1]).eq(B1.toString());
      expect(components['/_spreadsheet1'].state.cells[1][0]).eq(A2.toString());
      expect(components['/_spreadsheet1'].state.cells[1][1]).eq(B2.toString());
      expect(components['/_spreadsheet1'].state.cells[1][2]).eq(C2.toString());
    });



  })


});

