import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('BooleanInput Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('single boolean input', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput label="hello"/>
    <copy prop="value" tname="_booleaninput1" />
    <copy tname="_copy1" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let boolean1 = components['/_copy1'].replacements[0];
      let boolean1Anchor = cesc('#' + boolean1.componentName);
      let boolean2 = components['/_copy2'].replacements[0];
      let boolean2Anchor = cesc('#' + boolean2.componentName);

      cy.log('Test values displayed in browser')

      cy.get(boolean1Anchor).should('have.text', "false");
      cy.get(boolean2Anchor).should('have.text', "false");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(false);
        expect(boolean2.stateValues.value).eq(false);
        expect(components['/_booleaninput1'].stateValues.label).eq("hello");
      });

      cy.log('check the box')
      cy.get('#\\/_booleaninput1_input').click();

      cy.log('Test values displayed in browser')
      // cy.get('#\\/_booleaninput1_input').should('have.attr', 'checked');
      cy.get(boolean1Anchor).should('have.text', "true");
      cy.get(boolean2Anchor).should('have.text', "true");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(boolean1.stateValues.value).eq(true);
        expect(boolean2.stateValues.value).eq(true);
      });

      cy.log('uncheck the box')
      cy.get('#\\/_booleaninput1_input').click();

      cy.log('Test values displayed in browser')
      // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');
      cy.get(boolean1Anchor).should('have.text', "false");
      cy.get(boolean2Anchor).should('have.text', "false");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(false);
        expect(boolean2.stateValues.value).eq(false);
      });

    })
  })

  it('single boolean input, starts checked', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput prefill="true"/>
    <copy prop="value" tname="_booleaninput1" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let boolean1 = components['/_copy1'].replacements[0];
      let boolean1Anchor = cesc('#' + boolean1.componentName);

      cy.log('Test values displayed in browser')
      cy.get(boolean1Anchor).should('have.text', "true");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(boolean1.stateValues.value).eq(true);
      });

      cy.log('uncheck the box')
      cy.get('#\\/_booleaninput1_input').click();

      cy.log('Test values displayed in browser')
      cy.get(boolean1Anchor).should('have.text', "false");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(false);
      });

      cy.log('recheck the box')
      cy.get('#\\/_booleaninput1_input').click();

      cy.log('Test values displayed in browser')
      cy.get(boolean1Anchor).should('have.text', "true");

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(boolean1.stateValues.value).eq(true);
      });

    })
  })

  it('copied boolean input', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><booleaninput prefill="true" label="green"/></p>
    <p><copy tname="_booleaninput1" /></p>
    <p><copy prop="value" tname="_booleaninput1" /></p>
    <p><booleaninput label="red" /></p>
    <p><copy prop="value" tname="_booleaninput2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let booleaninput1a = components['/_copy1'].replacements[0];
      let booleaninput1aAnchor = cesc('#' + booleaninput1a.componentName + "_input");
      let boolean1 = components['/_copy2'].replacements[0];
      let boolean1Anchor = cesc('#' + boolean1.componentName);
      let boolean2 = components['/_copy3'].replacements[0];
      let boolean2Anchor = cesc('#' + boolean2.componentName);

      cy.get(boolean1Anchor).should('have.text', "true");
      cy.get(boolean2Anchor).should('have.text', "false");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(booleaninput1a.stateValues.value).eq(true);
        expect(components['/_booleaninput2'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(true);
        expect(boolean2.stateValues.value).eq(false);
        expect(components['/_booleaninput1'].stateValues.label).eq("green");
        expect(components['/_booleaninput2'].stateValues.label).eq("red");
      });

      cy.log("click the first input");
      cy.get("#\\/_booleaninput1_input").click();
      cy.get(boolean1Anchor).should('have.text', "false");
      cy.get(boolean2Anchor).should('have.text', "false");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleaninput1'].stateValues.value).eq(false);
        expect(booleaninput1a.stateValues.value).eq(false);
        expect(components['/_booleaninput2'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(false);
        expect(boolean2.stateValues.value).eq(false);
      });

      cy.log("click the second input");
      cy.get(booleaninput1aAnchor).click();
      cy.get(boolean1Anchor).should('have.text', "true");
      cy.get(boolean2Anchor).should('have.text', "false");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(booleaninput1a.stateValues.value).eq(true);
        expect(components['/_booleaninput2'].stateValues.value).eq(false);
        expect(boolean1.stateValues.value).eq(true);
        expect(boolean2.stateValues.value).eq(false);
      });


      cy.log("click the third input");
      cy.get("#\\/_booleaninput2_input").click();
      cy.get(boolean1Anchor).should('have.text', "true");
      cy.get(boolean2Anchor).should('have.text', "true");
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(booleaninput1a.stateValues.value).eq(true);
        expect(components['/_booleaninput2'].stateValues.value).eq(true);
        expect(boolean1.stateValues.value).eq(true);
        expect(boolean2.stateValues.value).eq(true);
      });

    })
  })

  it('downstream from booleaninput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput bindValueTo="$_boolean1" /></p>
    <p>Copied boolean: <copy tname="_boolean1" /></p>
    <p>Copied boolean input: <copy prop="value" tname="_booleaninput1" /></p>
    `}, "*");
    });

    // cy.get('#\\/_booleaninput1_input').should('have.attr', 'checked');


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let boolean2 = components['/_copy1'].replacements[0];
      let boolean2Anchor = cesc('#' + boolean2.componentName);
      let boolean3 = components['/_copy2'].replacements[0];
      let boolean3Anchor = cesc('#' + boolean3.componentName);

      cy.get('#\\/_boolean1').should('have.text', 'true');
      cy.get(boolean2Anchor).should('have.text', 'true');
      cy.get(boolean3Anchor).should('have.text', 'true');

      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(true);
        expect(components['/_boolean1'].stateValues.value).eq(true);
        expect(boolean2.stateValues.value).eq(true);
        expect(boolean3.stateValues.value).eq(true);
      });

      cy.log('change value')
      cy.get('#\\/_booleaninput1_input').click();

      // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

      cy.get('#\\/_boolean1').should('have.text', 'false');
      cy.get(boolean2Anchor).should('have.text', 'false');
      cy.get(boolean3Anchor).should('have.text', 'false');


      cy.window().then((win) => {
        expect(components['/_booleaninput1'].stateValues.value).eq(false);
        expect(components['/_boolean1'].stateValues.value).eq(false);
        expect(boolean2.stateValues.value).eq(false);
        expect(boolean3.stateValues.value).eq(false);
      });

    });

    cy.log('prefill ignored');
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput prefill="false" bindValueTo="$_boolean1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded


    // cy.get('#\\/_booleaninput1_input').should('have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', 'true');


    cy.log("values revert if not updatable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <p>Original boolean: <boolean>can't <text>update</text> <text>me</text></boolean></p>
    <p>booleaninput based on boolean: <booleaninput bindValueTo="$_boolean1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c');  // to wait until loaded

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', `false`);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_boolean1'].stateValues.value).eq(false);
    });

    cy.log('change value, but it reverts')
    cy.get('#\\/_booleaninput1_input').click();

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', `false`);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_booleaninput1'].stateValues.value).eq(false);
      expect(components['/_boolean1'].stateValues.value).eq(false);
    });

  })

  it('chain update off booleaninput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput name="bi" />
    <number name="n">1</number>
    <updateValue triggerWithTnames="bi" tname="n" newValue="$n+1" type="number" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').should('have.text', '1')
    cy.get('#\\/bi_input').click();
    cy.get('#\\/n').should('have.text', '2')
    cy.get('#\\/bi_input').click();
    cy.get('#\\/n').should('have.text', '3')

  })


});