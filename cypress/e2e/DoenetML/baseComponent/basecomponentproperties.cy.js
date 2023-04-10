import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('base component property Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })

  it('change the fixed attribute even when fixed', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph><point name="P" /></graph>
  <p><updateValue type="boolean" target='P.fixed' newValue="true" name="makeFixed"><label>Make fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='P.fixed' newValue="false" name="makeNotFixed"><label>Make not fixed</label></updateValue></p>

  <p name="pIsFixed">Is fixed? $P.fixed</p>
  <p name="pCoords">Coordinates of P: $P</p>
  <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>
  `}, "*");
    });


    cy.get('#\\/pIsFixed').should('have.text', 'Is fixed? false');
    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(0,0)');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 2 }
      })
    })

    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(1,2)');

    cy.log('have point fixed')
    cy.get('#\\/makeFixed').click();
    cy.get('#\\/pIsFixed').should('have.text', 'Is fixed? true');

    cy.log('point does not move')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 4 }
      })
    })

    cy.get('#\\/bi').click();
    cy.get('#\\/b').should('have.text', 'true')

    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(1,2)');

    cy.log('have point not fixed')
    cy.get('#\\/makeNotFixed').click();
    cy.get('#\\/pIsFixed').should('have.text', 'Is fixed? false');

    cy.log('point does moves')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 6 }
      })
    })

    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(5,6)');

  })

  it('change the fixed attribute even when fixed, have attribute', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph><point name="P" fixed="false" /></graph>
  <p><updateValue type="boolean" target='P.fixed' newValue="true" name="makeFixed"><label>Make fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='P.fixed' newValue="false" name="makeNotFixed"><label>Make not fixed</label></updateValue></p>

  <p name="pIsFixed">Is fixed? $P.fixed</p>
  <p name="pCoords">Coordinates of P: $P</p>
  <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>
  `}, "*");
    });


    cy.get('#\\/pIsFixed').should('have.text', 'Is fixed? false');
    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(0,0)');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 2 }
      })
    })

    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(1,2)');

    cy.log('have point fixed')
    cy.get('#\\/makeFixed').click();
    cy.get('#\\/pIsFixed').should('have.text', 'Is fixed? true');

    cy.log('point does not move')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 4 }
      })
    })

    cy.get('#\\/bi').click();
    cy.get('#\\/b').should('have.text', 'true')

    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(1,2)');

    cy.log('have point not fixed')
    cy.get('#\\/makeNotFixed').click();
    cy.get('#\\/pIsFixed').should('have.text', 'Is fixed? false');

    cy.log('point does moves')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 6 }
      })
    })

    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(5,6)');

  })

  it('change the fixed attribute even when fixed, start out fixed', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph><point name="P" fixed /></graph>
  <p><updateValue type="boolean" target='P.fixed' newValue="true" name="makeFixed"><label>Make fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='P.fixed' newValue="false" name="makeNotFixed"><label>Make not fixed</label></updateValue></p>

  <p name="pIsFixed">Is fixed? $P.fixed</p>
  <p name="pCoords">Coordinates of P: $P</p>
  <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>
  `}, "*");
    });


    cy.get('#\\/pIsFixed').should('have.text', 'Is fixed? true');
    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(0,0)');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 2 }
      })
    })

    cy.get('#\\/bi').click();
    cy.get('#\\/b').should('have.text', 'true')


    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(0,0)');

    cy.log('have point not fixed')
    cy.get('#\\/makeNotFixed').click();
    cy.get('#\\/pIsFixed').should('have.text', 'Is fixed? false');

    cy.log('point does move')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 4 }
      })
    })

    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(3,4)');

    cy.log('have point fixed again')
    cy.get('#\\/makeFixed').click();
    cy.get('#\\/pIsFixed').should('have.text', 'Is fixed? true');

    cy.log('point does not move')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 5, y: 6 }
      })
    })

    cy.get('#\\/bi').click();
    cy.get('#\\/b').should('have.text', 'false')

    cy.get('#\\/pCoords .mjx-mrow').should('contain.text', '(3,4)');

  })

  it('can override fixed of parent', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph name="g">
    <point name="A" labelIsName>(1,2)</point>
    <point name="B" fixed="false" labelIsName>(3,4)</point>
    <point name="C" fixed labelIsName>(5,6)</point>
  </graph>

  <p><updateValue type="boolean" target='A.fixed' newValue="true" name="makeAFixed"><label>Make A fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='A.fixed' newValue="false" name="makeANotFixed"><label>Make A not fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='B.fixed' newValue="true" name="makeBFixed"><label>Make B fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='B.fixed' newValue="false" name="makeBNotFixed"><label>Make B not fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='C.fixed' newValue="true" name="makeCFixed"><label>Make C fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='C.fixed' newValue="false" name="makeCNotFixed"><label>Make C not fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='g.fixed' newValue="true" name="makegFixed"><label>Make g fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='g.fixed' newValue="false" name="makegNotFixed"><label>Make g not fixed</label></updateValue></p>

  <p name="pAIsFixed">Is A fixed? $A.fixed</p>
  <p name="pBIsFixed">Is B fixed? $B.fixed</p>
  <p name="pCIsFixed">Is C fixed? $C.fixed</p>
  <p name="pgIsFixed">Is g fixed? $g.fixed</p>
  <p name="pACoords">Coordinates of A: $A</p>
  <p name="pBCoords">Coordinates of B: $B</p>
  <p name="pCCoords">Coordinates of C: $C</p>
  `}, "*");
    });


    cy.get('#\\/pgIsFixed').should('have.text', 'Is g fixed? false');
    cy.get('#\\/pAIsFixed').should('have.text', 'Is A fixed? false');
    cy.get('#\\/pBIsFixed').should('have.text', 'Is B fixed? false');
    cy.get('#\\/pCIsFixed').should('have.text', 'Is C fixed? true');

    cy.get('#\\/pACoords .mjx-mrow').should('contain.text', '(1,2)');
    cy.get('#\\/pBCoords .mjx-mrow').should('contain.text', '(3,4)');
    cy.get('#\\/pCCoords .mjx-mrow').should('contain.text', '(5,6)');

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -1, y: -2 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: -5, y: -6 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -3, y: -4 }
      })
    })


    cy.get('#\\/pBCoords .mjx-mrow').should('contain.text', '(−3,−4)');
    cy.get('#\\/pACoords .mjx-mrow').should('contain.text', '(−1,−2)');
    cy.get('#\\/pCCoords .mjx-mrow').should('contain.text', '(5,6)');


    cy.log('A changes fixed with g')

    cy.get('#\\/makegFixed').click();


    cy.get('#\\/pgIsFixed').should('have.text', 'Is g fixed? true');
    cy.get('#\\/pAIsFixed').should('have.text', 'Is A fixed? true');
    cy.get('#\\/pBIsFixed').should('have.text', 'Is B fixed? false');
    cy.get('#\\/pCIsFixed').should('have.text', 'Is C fixed? true');


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 10, y: 9 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: 6, y: 5 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 8, y: 7 }
      })
    })

    cy.get('#\\/pBCoords .mjx-mrow').should('contain.text', '(8,7)');
    cy.get('#\\/pACoords .mjx-mrow').should('contain.text', '(−1,−2)');
    cy.get('#\\/pCCoords .mjx-mrow').should('contain.text', '(5,6)');


    cy.log('change fixed of points')

    cy.get('#\\/makeANotFixed').click();
    cy.get('#\\/pAIsFixed').should('have.text', 'Is A fixed? false');

    cy.get('#\\/makeBFixed').click();
    cy.get('#\\/pBIsFixed').should('have.text', 'Is B fixed? true');

    cy.get('#\\/makeCNotFixed').click();
    cy.get('#\\/pCIsFixed').should('have.text', 'Is C fixed? false');


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 12, y: 11 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 10, y: 9 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: 6, y: 5 }
      })
    })

    cy.get('#\\/pCCoords .mjx-mrow').should('contain.text', '(6,5)');
    cy.get('#\\/pACoords .mjx-mrow').should('contain.text', '(10,9)');
    cy.get('#\\/pBCoords .mjx-mrow').should('contain.text', '(8,7)');


    cy.log('changing fixed of g does not affect points')

    cy.get('#\\/makegNotFixed').click();


    cy.get('#\\/pgIsFixed').should('have.text', 'Is g fixed? false');
    cy.get('#\\/pAIsFixed').should('have.text', 'Is A fixed? false');
    cy.get('#\\/pBIsFixed').should('have.text', 'Is B fixed? true');
    cy.get('#\\/pCIsFixed').should('have.text', 'Is C fixed? false');

    cy.get('#\\/makegFixed').click();

    cy.get('#\\/pgIsFixed').should('have.text', 'Is g fixed? true');
    cy.get('#\\/pAIsFixed').should('have.text', 'Is A fixed? false');
    cy.get('#\\/pBIsFixed').should('have.text', 'Is B fixed? true');
    cy.get('#\\/pCIsFixed').should('have.text', 'Is C fixed? false');

  })

  it('fixed propagates to shadow even if essential', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph size="small">
    <point name="A" />
    <point name="B" >(1,2)</point>
    <point name="C" fixed />
    <point name="D" fixed="false">(3,4)</point>
  </graph>
  
  <graph size="small">
    <point copySource="A" name="A2" />
    <point copySource="B" name="B2" />
    <point copySource="C" name="C2" />
    <point copySource="D" name="D2" />
  </graph>
  
  <graph size="small">
    <point copySource="A" name="A3" fixed="false" />
    <point copySource="B" name="B3" fixed="false" />
    <point copySource="C" name="C3" fixed="false" />
    <point copySource="D" name="D3" fixed="false" />
  </graph>
  
  <p><booleaninput bindValueTo="$A.fixed" name="toggleAFixed"><label>A fixed</label></booleanInput>
  </p>
  <p><booleaninput bindValueTo="$B.fixed" name="toggleBFixed"><label>B fixed</label></booleanInput>
  </p>
  <p><booleaninput bindValueTo="$C.fixed" name="toggleCFixed"><label>C fixed</label></booleanInput>
  </p>
  <p><booleaninput bindValueTo="$D.fixed" name="toggleDFixed"><label>D fixed</label></booleanInput>
  </p>

  <p name="pAIsFixed">Is A fixed? $A.fixed</p>
  <p name="pBIsFixed">Is B fixed? $B.fixed</p>
  <p name="pCIsFixed">Is C fixed? $C.fixed</p>
  <p name="pDIsFixed">Is D fixed? $D.fixed</p>
  <p name="pA2IsFixed">Is A2 fixed? $A2.fixed</p>
  <p name="pB2IsFixed">Is B2 fixed? $B2.fixed</p>
  <p name="pC2IsFixed">Is C2 fixed? $C2.fixed</p>
  <p name="pD2IsFixed">Is D2 fixed? $D2.fixed</p>
  <p name="pA3IsFixed">Is A3 fixed? $A3.fixed</p>
  <p name="pB3IsFixed">Is B3 fixed? $B3.fixed</p>
  <p name="pC3IsFixed">Is C3 fixed? $C3.fixed</p>
  <p name="pD3IsFixed">Is D3 fixed? $D3.fixed</p>
  <p name="pACoords">Coordinates of A: $A</p>
  <p name="pBCoords">Coordinates of B: $B</p>
  <p name="pCCoords">Coordinates of C: $C</p>
  <p name="pDCoords">Coordinates of D: $D</p>
  `}, "*");
    });


    cy.get('#\\/pAIsFixed').should('have.text', 'Is A fixed? false');
    cy.get('#\\/pBIsFixed').should('have.text', 'Is B fixed? false');
    cy.get('#\\/pCIsFixed').should('have.text', 'Is C fixed? true');
    cy.get('#\\/pDIsFixed').should('have.text', 'Is D fixed? false');
    cy.get('#\\/pA2IsFixed').should('have.text', 'Is A2 fixed? false');
    cy.get('#\\/pB2IsFixed').should('have.text', 'Is B2 fixed? false');
    cy.get('#\\/pC2IsFixed').should('have.text', 'Is C2 fixed? true');
    cy.get('#\\/pD2IsFixed').should('have.text', 'Is D2 fixed? false');
    cy.get('#\\/pA3IsFixed').should('have.text', 'Is A3 fixed? false');
    cy.get('#\\/pB3IsFixed').should('have.text', 'Is B3 fixed? false');
    cy.get('#\\/pC3IsFixed').should('have.text', 'Is C3 fixed? false');
    cy.get('#\\/pD3IsFixed').should('have.text', 'Is D3 fixed? false');

    cy.get('#\\/pACoords .mjx-mrow').should('contain.text', '(0,0)');
    cy.get('#\\/pBCoords .mjx-mrow').should('contain.text', '(1,2)');
    cy.get('#\\/pCCoords .mjx-mrow').should('contain.text', '(0,0)');
    cy.get('#\\/pDCoords .mjx-mrow').should('contain.text', '(3,4)');


    cy.log('can change coords of all but fixed C2')

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: -1, y: -2 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: -3, y: -4 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/C2",
        args: { x: -5, y: -6 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/D2",
        args: { x: -7, y: -8 }
      })
    })


    cy.get('#\\/pDCoords .mjx-mrow').should('contain.text', '(−7,−8)');
    cy.get('#\\/pACoords .mjx-mrow').should('contain.text', '(−1,−2)');
    cy.get('#\\/pBCoords .mjx-mrow').should('contain.text', '(−3,−4)');
    cy.get('#\\/pCCoords .mjx-mrow').should('contain.text', '(0,0)');


    cy.log('cannot change coords of C3 even though not fixed')

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 10, y: 9 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B3",
        args: { x: 8, y: 7 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/C3",
        args: { x: 6, y: 5 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/D2",
        args: { x: 4, y: 3 }
      })
    })


    cy.get('#\\/pDCoords .mjx-mrow').should('contain.text', '(4,3)');
    cy.get('#\\/pACoords .mjx-mrow').should('contain.text', '(10,9)');
    cy.get('#\\/pBCoords .mjx-mrow').should('contain.text', '(8,7)');
    cy.get('#\\/pCCoords .mjx-mrow').should('contain.text', '(0,0)');



    cy.log('toggle fixed')

    cy.get('#\\/toggleAFixed').click();
    cy.get('#\\/toggleBFixed').click();
    cy.get('#\\/toggleCFixed').click();
    cy.get('#\\/toggleDFixed').click();


    cy.get('#\\/pDIsFixed').should('have.text', 'Is D fixed? true');
    cy.get('#\\/pAIsFixed').should('have.text', 'Is A fixed? true');
    cy.get('#\\/pBIsFixed').should('have.text', 'Is B fixed? true');
    cy.get('#\\/pCIsFixed').should('have.text', 'Is C fixed? false');
    cy.get('#\\/pA2IsFixed').should('have.text', 'Is A2 fixed? true');
    cy.get('#\\/pB2IsFixed').should('have.text', 'Is B2 fixed? true');
    cy.get('#\\/pC2IsFixed').should('have.text', 'Is C2 fixed? false');
    cy.get('#\\/pD2IsFixed').should('have.text', 'Is D2 fixed? true');
    cy.get('#\\/pA3IsFixed').should('have.text', 'Is A3 fixed? false');
    cy.get('#\\/pB3IsFixed').should('have.text', 'Is B3 fixed? false');
    cy.get('#\\/pC3IsFixed').should('have.text', 'Is C3 fixed? false');
    cy.get('#\\/pD3IsFixed').should('have.text', 'Is D3 fixed? false');


    cy.log('can only change coords of C2')


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: 15, y: 14 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B2",
        args: { x: 13, y: 12 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/D2",
        args: { x: 11, y: 10 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/C2",
        args: { x: 9, y: 8 }
      })
    })

    cy.get('#\\/pCCoords .mjx-mrow').should('contain.text', '(9,8)');
    cy.get('#\\/pACoords .mjx-mrow').should('contain.text', '(10,9)');
    cy.get('#\\/pBCoords .mjx-mrow').should('contain.text', '(8,7)');
    cy.get('#\\/pDCoords .mjx-mrow').should('contain.text', '(4,3)');



    cy.log('can only change coords of C3, even though not fixed')


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 1, y: -2 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B3",
        args: { x: 3, y: -4 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/D3",
        args: { x: 5, y: -6 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/C3",
        args: { x: 7, y: -8 }
      })
    })

    cy.get('#\\/pCCoords .mjx-mrow').should('contain.text', '(7,−8)');
    cy.get('#\\/pACoords .mjx-mrow').should('contain.text', '(10,9)');
    cy.get('#\\/pBCoords .mjx-mrow').should('contain.text', '(8,7)');
    cy.get('#\\/pDCoords .mjx-mrow').should('contain.text', '(4,3)');



  })

  it('change disabled, inverse direction', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <textinput name="ti" prefill="a" />
  <p><updateValue type="boolean" target='ti.disabled' newValue="true" name="makeDisabled"><label>Make disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti.disabled' newValue="false" name="makeNotDisabled"><label>Make not disabled</label></updateValue></p>

  <p name="pIsDisabled">Is disabled? $ti.disabled</p>
  <p name="pText">Text: $ti</p>
  `}, "*");
    });


    cy.get('#\\/pIsDisabled').should('have.text', 'Is disabled? false');
    cy.get('#\\/pText').should('have.text', 'Text: a');

    cy.get('#\\/ti_input').type("{end}{backspace}b{enter}");
    cy.get('#\\/pText').should('have.text', 'Text: b');

    cy.log('disable input')
    cy.get('#\\/makeDisabled').click();
    cy.get('#\\/pIsDisabled').should('have.text', 'Is disabled? true');

    cy.get('#\\/ti_input').should('be.disabled');


    cy.log('enable input')
    cy.get('#\\/makeNotDisabled').click();
    cy.get('#\\/pIsDisabled').should('have.text', 'Is disabled? false');

    cy.get('#\\/ti_input').type("{end}{backspace}c{enter}");
    cy.get('#\\/pText').should('have.text', 'Text: c');


  })

  it('can override disabled of parent', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <section name="s">
    <textinput name="ti1" prefill="a" />
    <textinput name="ti2" prefill="b" disabled />
    <textinput name="ti3" prefill="c" disabled="false" />
  </section>

  <p><updateValue type="boolean" target='ti1.disabled' newValue="true" name="maketi1Disabled"><label>Make ti1 disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti1.disabled' newValue="false" name="maketi1NotDisabled"><label>Make ti1 not disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti2.disabled' newValue="true" name="maketi2Disabled"><label>Make ti2 disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti2.disabled' newValue="false" name="maketi2NotDisabled"><label>Make ti2 not disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti3.disabled' newValue="true" name="maketi3Disabled"><label>Make ti3 disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti3.disabled' newValue="false" name="maketi3NotDisabled"><label>Make ti3 not disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='s.disabled' newValue="true" name="makesDisabled"><label>Make s disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='s.disabled' newValue="false" name="makesNotDisabled"><label>Make s not disabled</label></updateValue></p>

  <p name="pti1IsDisabled">Is ti1 disabled? $ti1.disabled</p>
  <p name="pti2IsDisabled">Is ti2 disabled? $ti2.disabled</p>
  <p name="pti3IsDisabled">Is ti3 disabled? $ti3.disabled</p>
  <p name="psIsDisabled">Is s disabled? $s.disabled</p>
  <p name="pti1Text">Text: $ti1</p>
  <p name="pti2Text">Text: $ti2</p>
  <p name="pti3Text">Text: $ti3</p>
  `}, "*");
    });


    cy.get('#\\/pti1IsDisabled').should('have.text', 'Is ti1 disabled? false');
    cy.get('#\\/pti2IsDisabled').should('have.text', 'Is ti2 disabled? true');
    cy.get('#\\/pti3IsDisabled').should('have.text', 'Is ti3 disabled? false');
    cy.get('#\\/psIsDisabled').should('have.text', 'Is s disabled? false');
    cy.get('#\\/pti1Text').should('have.text', 'Text: a');
    cy.get('#\\/pti2Text').should('have.text', 'Text: b');
    cy.get('#\\/pti3Text').should('have.text', 'Text: c');


    cy.get('#\\/ti1_input').type("{end}{backspace}d{enter}");
    cy.get('#\\/pti1Text').should('have.text', 'Text: d');

    cy.get('#\\/ti2_input').should('be.disabled');

    cy.get('#\\/ti3_input').type("{end}{backspace}e{enter}");
    cy.get('#\\/pti3Text').should('have.text', 'Text: e');


    cy.log('ti1 changed disabled with s')

    cy.get('#\\/makesDisabled').click();

    cy.get('#\\/psIsDisabled').should('have.text', 'Is s disabled? true');
    cy.get('#\\/pti1IsDisabled').should('have.text', 'Is ti1 disabled? true');
    cy.get('#\\/pti2IsDisabled').should('have.text', 'Is ti2 disabled? true');
    cy.get('#\\/pti3IsDisabled').should('have.text', 'Is ti3 disabled? false');

    cy.get('#\\/ti1_input').should('be.disabled');
    cy.get('#\\/ti2_input').should('be.disabled');

    cy.get('#\\/ti3_input').type("{end}{backspace}f{enter}");
    cy.get('#\\/pti3Text').should('have.text', 'Text: f');


    cy.log('change disabled of inputs')

    cy.get('#\\/maketi1NotDisabled').click();
    cy.get('#\\/maketi2NotDisabled').click();
    cy.get('#\\/maketi3Disabled').click();


    cy.get('#\\/pti3IsDisabled').should('have.text', 'Is ti3 disabled? true');
    cy.get('#\\/pti1IsDisabled').should('have.text', 'Is ti1 disabled? false');
    cy.get('#\\/pti2IsDisabled').should('have.text', 'Is ti2 disabled? false');


    cy.get('#\\/ti1_input').type("{end}{backspace}g{enter}");
    cy.get('#\\/pti1Text').should('have.text', 'Text: g');

    cy.get('#\\/ti2_input').type("{end}{backspace}h{enter}");
    cy.get('#\\/pti2Text').should('have.text', 'Text: h');

    cy.get('#\\/ti3_input').should('be.disabled');


    cy.log('changing fixed of s does not affect inputs')

    cy.get('#\\/makesNotDisabled').click();

    cy.get('#\\/psIsDisabled').should('have.text', 'Is s disabled? false');
    cy.get('#\\/pti3IsDisabled').should('have.text', 'Is ti3 disabled? true');
    cy.get('#\\/pti1IsDisabled').should('have.text', 'Is ti1 disabled? false');
    cy.get('#\\/pti2IsDisabled').should('have.text', 'Is ti2 disabled? false');


    cy.get('#\\/makesDisabled').click();

    cy.get('#\\/psIsDisabled').should('have.text', 'Is s disabled? true');
    cy.get('#\\/pti3IsDisabled').should('have.text', 'Is ti3 disabled? true');
    cy.get('#\\/pti1IsDisabled').should('have.text', 'Is ti1 disabled? false');
    cy.get('#\\/pti2IsDisabled').should('have.text', 'Is ti2 disabled? false');


  })

  it('disabled propagates to shadow even if essential', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>
    <textinput name="ti1" prefill="a" />
    <textinput name="ti2" prefill="b" disabled />
    <textinput name="ti3" prefill="c" disabled="false" />
  </p>

  <p>
    <textinput name="ti12" copySource="ti1" />
    <textinput name="ti22" copySource="ti2" />
    <textinput name="ti32" copySource="ti3" />
  </p>

  <p>
    <textinput name="ti13" copySource="ti1" disabled="false" />
    <textinput name="ti23" copySource="ti2" disabled="false" />
    <textinput name="ti33" copySource="ti3" disabled="false" />
  </p>

  <p><booleaninput bindValueTo="$ti1.disabled" name="toggleti1Disabled"><label>ti1 disabled</label></booleanInput>
  </p>
  <p><booleaninput bindValueTo="$ti2.disabled" name="toggleti2Disabled"><label>ti2 disabled</label></booleanInput>
  </p>
  <p><booleaninput bindValueTo="$ti3.disabled" name="toggleti3Disabled"><label>ti3 disabled</label></booleanInput>
  </p>

  <p name="pti1IsDisabled">Is ti1 disabled? $ti1.disabled</p>
  <p name="pti2IsDisabled">Is ti2 disabled? $ti2.disabled</p>
  <p name="pti3IsDisabled">Is ti3 disabled? $ti3.disabled</p>
  <p name="pti12IsDisabled">Is ti12 disabled? $ti12.disabled</p>
  <p name="pti22IsDisabled">Is ti22 disabled? $ti22.disabled</p>
  <p name="pti32IsDisabled">Is ti32 disabled? $ti32.disabled</p>
  <p name="pti13IsDisabled">Is ti13 disabled? $ti13.disabled</p>
  <p name="pti23IsDisabled">Is ti23 disabled? $ti23.disabled</p>
  <p name="pti33IsDisabled">Is ti33 disabled? $ti33.disabled</p>


  `}, "*");
    });


    cy.get('#\\/pti1IsDisabled').should('have.text', 'Is ti1 disabled? false');
    cy.get('#\\/pti2IsDisabled').should('have.text', 'Is ti2 disabled? true');
    cy.get('#\\/pti3IsDisabled').should('have.text', 'Is ti3 disabled? false');
    cy.get('#\\/pti12IsDisabled').should('have.text', 'Is ti12 disabled? false');
    cy.get('#\\/pti22IsDisabled').should('have.text', 'Is ti22 disabled? true');
    cy.get('#\\/pti32IsDisabled').should('have.text', 'Is ti32 disabled? false');
    cy.get('#\\/pti13IsDisabled').should('have.text', 'Is ti13 disabled? false');
    cy.get('#\\/pti23IsDisabled').should('have.text', 'Is ti23 disabled? false');
    cy.get('#\\/pti33IsDisabled').should('have.text', 'Is ti33 disabled? false');


    cy.get('#\\/ti1_input').should('not.be.disabled');
    cy.get('#\\/ti2_input').should('be.disabled');
    cy.get('#\\/ti3_input').should('not.be.disabled');

    cy.get('#\\/ti12_input').should('not.be.disabled');
    cy.get('#\\/ti22_input').should('be.disabled');
    cy.get('#\\/ti32_input').should('not.be.disabled');

    cy.get('#\\/ti13_input').should('not.be.disabled');
    cy.get('#\\/ti23_input').should('not.be.disabled');
    cy.get('#\\/ti33_input').should('not.be.disabled');

    cy.log('toggle disabled')

    cy.get('#\\/toggleti1Disabled').click();
    cy.get('#\\/toggleti2Disabled').click();
    cy.get('#\\/toggleti3Disabled').click();


    cy.get('#\\/pti3IsDisabled').should('have.text', 'Is ti3 disabled? true');
    cy.get('#\\/pti1IsDisabled').should('have.text', 'Is ti1 disabled? true');
    cy.get('#\\/pti2IsDisabled').should('have.text', 'Is ti2 disabled? false');
    cy.get('#\\/pti12IsDisabled').should('have.text', 'Is ti12 disabled? true');
    cy.get('#\\/pti22IsDisabled').should('have.text', 'Is ti22 disabled? false');
    cy.get('#\\/pti32IsDisabled').should('have.text', 'Is ti32 disabled? true');
    cy.get('#\\/pti13IsDisabled').should('have.text', 'Is ti13 disabled? false');
    cy.get('#\\/pti23IsDisabled').should('have.text', 'Is ti23 disabled? false');
    cy.get('#\\/pti33IsDisabled').should('have.text', 'Is ti33 disabled? false');


    cy.get('#\\/ti1_input').should('be.disabled');
    cy.get('#\\/ti2_input').should('not.be.disabled');
    cy.get('#\\/ti3_input').should('be.disabled');

    cy.get('#\\/ti12_input').should('be.disabled');
    cy.get('#\\/ti22_input').should('not.be.disabled');
    cy.get('#\\/ti32_input').should('be.disabled');

    cy.get('#\\/ti13_input').should('not.be.disabled');
    cy.get('#\\/ti23_input').should('not.be.disabled');
    cy.get('#\\/ti33_input').should('not.be.disabled');



  })

  it('change hidden, inverse direction', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <textinput name="ti" prefill="a" />
  <p><updateValue type="boolean" target='ti.hidden' newValue="true" name="makeHidden"><label>Make hidden</label></updateValue></p>
  <p><updateValue type="boolean" target='ti.hidden' newValue="false" name="makeNotHidden"><label>Make not hidden</label></updateValue></p>

  <p name="pIsHidden">Is hidden? $ti.hidden</p>
  <p name="pText">Text: $ti</p>
  `}, "*");
    });


    cy.get('#\\/pIsHidden').should('have.text', 'Is hidden? false');
    cy.get('#\\/pText').should('have.text', 'Text: a');

    cy.get('#\\/ti_input').type("{end}{backspace}b{enter}");
    cy.get('#\\/pText').should('have.text', 'Text: b');

    cy.log('hide input')
    cy.get('#\\/makeHidden').click();
    cy.get('#\\/pIsHidden').should('have.text', 'Is hidden? true');

    cy.get('#\\/ti_input').should('not.exist');


    cy.log('show input')
    cy.get('#\\/makeNotHidden').click();
    cy.get('#\\/pIsHidden').should('have.text', 'Is hidden? false');

    cy.get('#\\/ti_input').type("{end}{backspace}c{enter}");
    cy.get('#\\/pText').should('have.text', 'Text: c');


  })

  it('accept permid attribute', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <section permid="s">
      <title>Hello</title>
      <p permid="p">Hi</p>
    </section>

    <p permid="pids">Permids: $_section1.permid, $_p1.permid, $_p2.permid</p>

  `}, "*");
    });


    cy.get('#\\/_p1').should('have.text', 'Hi');

    cy.get('#\\/_p2').should('have.text', 'Permids: s, p, pids');

  })

})