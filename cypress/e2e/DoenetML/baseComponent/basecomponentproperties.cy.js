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
    cy.visit('/cypressTest')
  })

  it('change fixed even when fixed', () => {
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

  it('change fixed even when fixed, have attribute', () => {
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

  it('change fixed even when fixed, start out fixed', () => {
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

})