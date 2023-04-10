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
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })

  it('single boolean input', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput name="bi1" >
      <label>hello</label>
    </booleaninput>
    <copy prop="value" target="bi1" assignNames="v1" />
    <copy target="_copy1" assignNames="v2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test values displayed in browser')

    cy.get('#\\/v1').should('have.text', "false");
    cy.get("#\\/v2").should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
      expect(stateVariables['/bi1'].stateValues.label).eq("hello");
    });

    cy.log('check the box')
    cy.get('#\\/bi1').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/v1').should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });

    cy.log('uncheck the box')
    cy.get('#\\/bi1').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/v1').should('have.text', "false");
    cy.get("#\\/v2").should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
    });

  })

  it('single boolean input, starts checked', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput prefill="true"/>
    <copy prop="value" target="_booleaninput1" assignNames="v1" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test values displayed in browser')
    cy.get("#\\/v1").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/v1'].stateValues.value).eq(true);
    });

    cy.log('uncheck the box')
    cy.get('#\\/_booleaninput1').click();

    cy.log('Test values displayed in browser')
    cy.get("#\\/v1").should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/v1'].stateValues.value).eq(false);
    });

    cy.log('recheck the box')
    cy.get('#\\/_booleaninput1').click();

    cy.log('Test values displayed in browser')
    cy.get("#\\/v1").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/v1'].stateValues.value).eq(true);
    });

  })

  it('copied boolean input', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><booleaninput prefill="true" name="bi1" >
      <label>green</label>
    </booleaninput></p>
    <p><booleanInput copySource="bi1" name="bi1a" /></p>
    <p><copy prop="value" target="bi1" assignNames="v1" /></p>
    <p><booleaninput name="bi2" >
      <label>red</label>
    </booleaninput></p>
    <p><copy prop="value" target="bi2" assignNames="v2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get("#\\/v1").should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(true);
      expect(stateVariables['/bi1a'].stateValues.value).eq(true);
      expect(stateVariables['/bi2'].stateValues.value).eq(false);
      expect(stateVariables['/v1'].stateValues.value).eq(true);
      expect(stateVariables['/v2'].stateValues.value).eq(false);
      expect(stateVariables['/bi1'].stateValues.label).eq("green");
      expect(stateVariables['/bi2'].stateValues.label).eq("red");
    });

    cy.log("click the first input");
    cy.get("#\\/bi1").click();
    cy.get("#\\/v1").should('have.text', "false");
    cy.get("#\\/v2").should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(false);
      expect(stateVariables['/bi1a'].stateValues.value).eq(false);
      expect(stateVariables['/bi2'].stateValues.value).eq(false);
      expect(stateVariables['/v1'].stateValues.value).eq(false);
      expect(stateVariables['/v2'].stateValues.value).eq(false);
    });

    cy.log("click the second input");
    cy.get("#\\/bi1a").click();
    cy.get("#\\/v1").should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(true);
      expect(stateVariables['/bi1a'].stateValues.value).eq(true);
      expect(stateVariables['/bi2'].stateValues.value).eq(false);
      expect(stateVariables['/v1'].stateValues.value).eq(true);
      expect(stateVariables['/v2'].stateValues.value).eq(false);
    });


    cy.log("click the third input");
    cy.get("#\\/bi2").click();
    cy.get("#\\/v1").should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/bi1'].stateValues.value).eq(true);
      expect(stateVariables['/bi1a'].stateValues.value).eq(true);
      expect(stateVariables['/bi2'].stateValues.value).eq(true);
      expect(stateVariables['/v1'].stateValues.value).eq(true);
      expect(stateVariables['/v2'].stateValues.value).eq(true);
    });

  })

  it('downstream from booleaninput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput bindValueTo="$_boolean1" /></p>
    <p>Copied boolean: <copy target="_boolean1" assignNames="b2" /></p>
    <p>Copied boolean input: <copy prop="value" target="_booleaninput1" assignNames="b3" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get('#\\/_boolean1').should('have.text', 'true');
    cy.get("#\\/b2").should('have.text', 'true');
    cy.get("#\\/b3").should('have.text', 'true');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(true);
      expect(stateVariables['/_boolean1'].stateValues.value).eq(true);
      expect(stateVariables['/b2'].stateValues.value).eq(true);
      expect(stateVariables['/b3'].stateValues.value).eq(true);
    });

    cy.log('change value')
    cy.get('#\\/_booleaninput1').click();

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', 'false');
    cy.get("#\\/b2").should('have.text', 'false');
    cy.get("#\\/b3").should('have.text', 'false');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_boolean1'].stateValues.value).eq(false);
      expect(stateVariables['/b2'].stateValues.value).eq(false);
      expect(stateVariables['/b3'].stateValues.value).eq(false);
    });


    cy.log('prefill ignored');
    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_boolean1'].stateValues.value).eq(false);
    });

    cy.log('change value, but it reverts')
    cy.get('#\\/_booleaninput1').click();

    // cy.get('#\\/_booleaninput1_input').should('not.have.attr', 'checked');

    cy.get('#\\/_boolean1').should('have.text', `false`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_booleaninput1'].stateValues.value).eq(false);
      expect(stateVariables['/_boolean1'].stateValues.value).eq(false);
    });

  })

  it('chain update off booleaninput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput name="bi" />
    <number name="n">1</number>
    <updateValue triggerWith="bi" target="n" newValue="$n+1" type="number" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').should('have.text', '1')
    cy.get('#\\/bi').click();
    cy.get('#\\/n').should('have.text', '2')
    cy.get('#\\/bi').click();
    cy.get('#\\/n').should('have.text', '3')

  })

  it('boolean input as toggle button', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><booleanInput name="atb" >
      <label>As Toggle</label>
    </booleaninput></p>
    <p><booleanInput name="bi" asToggleButton="$atb">
      <label>hello</label>
    </booleaninput></p>

    <copy prop="value" target="bi" assignNames="v1" />
    <copy target="_copy1" assignNames="v2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test values displayed in browser')

    cy.get('#\\/atb_input').should('not.be.checked');
    cy.get('#\\/bi_input').should('not.be.checked');
    cy.get('#\\/v1').should('have.text', "false");
    cy.get("#\\/v2").should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(false);
      expect(stateVariables['/bi'].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
      expect(stateVariables['/atb'].stateValues.label).eq("As Toggle");
      expect(stateVariables['/bi'].stateValues.label).eq("hello");
    });

    cy.log('check the box')
    cy.get('#\\/bi').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/atb_input').should('not.be.checked');
    cy.get('#\\/bi_input').should('be.checked');
    cy.get('#\\/v1').should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(false);
      expect(stateVariables['/bi'].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });

    cy.log('set as toggle button')
    cy.get('#\\/atb').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/atb_input').should('be.checked');
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get('#\\/bi_input').should('be.checked');
    cy.get('#\\/v1').should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(true);
      expect(stateVariables['/bi'].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });


    cy.log('turn off via toggle button')
    cy.get('#\\/bi_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/atb_input').should('be.checked');
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get('#\\/bi_input').should('not.be.checked');
    cy.get('#\\/v1').should('have.text', "false");
    cy.get("#\\/v2").should('have.text', "false");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(true);
      expect(stateVariables['/bi'].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
    });


    cy.log('turn on via toggle button')
    cy.get('#\\/bi_input').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/atb_input').should('be.checked');
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get('#\\/bi_input').should('be.checked');
    cy.get('#\\/v1').should('have.text', "true");
    cy.get("#\\/v2").should('have.text', "true");

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(true);
      expect(stateVariables['/bi'].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });

  })

  it('boolean input with math in label', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><booleanInput name="atb" ><label>It is <m>\\int_a^b f(x)\\,dx</m></label></booleaninput></p>
    <p><booleanInput name="bi" asToggleButton="$atb"><label>Hello <math>a/b</math></label></booleaninput></p>

    <copy prop="value" target="atb" assignNames="v" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test values displayed in browser')

    cy.get('#\\/atb_input').should('not.be.checked');
    cy.get('#\\/bi_input').should('not.be.checked');
    cy.get('#\\/v').should('have.text', "false");
    cy.get('#\\/atb').should('contain.text', 'It is ∫baf(x)dx')
    cy.get('#\\/bi').should('contain.text', 'Hello ab')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(false);
      expect(stateVariables['/bi'].stateValues.value).eq(false);
      expect(stateVariables["/v"].stateValues.value).eq(false);
      expect(stateVariables['/atb'].stateValues.label).eq("It is \\(\\int_a^b f(x)\\,dx\\)");
      expect(stateVariables['/bi'].stateValues.label).eq("Hello \\(\\frac{a}{b}\\)");
    });


    cy.log('set as toggle button')
    cy.get('#\\/atb').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/v').should('have.text', "true");
    cy.get('#\\/atb_input').should('be.checked');
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get('#\\/bi_input').should('be.checked');
    cy.get('#\\/atb').should('contain.text', 'It is ∫baf(x)dx')
    cy.get('#\\/bi').should('contain.text', 'Hello ab')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/atb'].stateValues.value).eq(true);
      expect(stateVariables['/bi'].stateValues.value).eq(false);
      expect(stateVariables["/v"].stateValues.value).eq(true);
      expect(stateVariables['/atb'].stateValues.label).eq("It is \\(\\int_a^b f(x)\\,dx\\)");
      expect(stateVariables['/bi'].stateValues.label).eq("Hello \\(\\frac{a}{b}\\)");
    });

  })

  it('boolean input with labelIsName', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><booleanInput name="asToggleButton" labelIsName /></p>
    <p><booleanInput name="AnotherInput" asToggleButton="$asToggleButton" labelIsName /></p>

    <boolean copySource="asToggleButton" name="v" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test values displayed in browser')

    cy.get('#\\/asToggleButton_input').should('not.be.checked');
    cy.get('#\\/AnotherInput_input').should('not.be.checked');
    cy.get('#\\/v').should('have.text', "false");
    cy.get('#\\/asToggleButton').should('contain.text', 'as toggle button')
    cy.get('#\\/AnotherInput').should('contain.text', 'Another Input')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/asToggleButton'].stateValues.value).eq(false);
      expect(stateVariables['/AnotherInput'].stateValues.value).eq(false);
      expect(stateVariables["/v"].stateValues.value).eq(false);
      expect(stateVariables['/asToggleButton'].stateValues.label).eq("as toggle button");
      expect(stateVariables['/AnotherInput'].stateValues.label).eq("Another Input");
    });


    cy.log('set as toggle button')
    cy.get('#\\/asToggleButton').click();

    cy.log('Test values displayed in browser')
    cy.get('#\\/v').should('have.text', "true");
    cy.get('#\\/asToggleButton_input').should('be.checked');
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get('#\\/AnotherInput_input').should('be.checked');
    cy.get('#\\/asToggleButton').should('contain.text', 'as toggle button')
    cy.get('#\\/AnotherInput').should('contain.text', 'Another Input')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/asToggleButton'].stateValues.value).eq(true);
      expect(stateVariables['/AnotherInput'].stateValues.value).eq(false);
      expect(stateVariables["/v"].stateValues.value).eq(true);
      expect(stateVariables['/asToggleButton'].stateValues.label).eq("as toggle button");
      expect(stateVariables['/AnotherInput'].stateValues.label).eq("Another Input");
    });

  })

  it('boolean input in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>n: <number name="n">1</number></p>
    <graph >
      <booleaninput anchor="$anchorCoords1" name="booleaninput1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1"><label>input 1</label></booleaninput>
      <booleaninput name="booleaninput2"><label>input 2</label></booleaninput>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $booleaninput1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $booleaninput2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$booleaninput2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $booleaninput1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $booleaninput2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$booleaninput2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$booleaninput2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$booleaninput2.disabled" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    ` }, "*");
    });

    // TODO: how to click on the checkboxes and test if they are disabled?

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(1,3)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(0,0)')

    cy.get("#\\/pPositionFromAnchor1").should('have.text', 'Position from anchor 1: upperright')
    cy.get("#\\/pPositionFromAnchor2").should('have.text', 'Position from anchor 2: center')
    cy.get("#\\/positionFromAnchor1").should('have.value', '1')
    cy.get("#\\/positionFromAnchor2").should('have.value', '9')
    cy.get("#\\/pDraggable1").should('have.text', 'Draggable 1: true')
    cy.get("#\\/pDraggable2").should('have.text', 'Draggable 2: true')


    cy.log("move booleaninputs by dragging")

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput1",
        args: { x: -2, y: 3 }
      })
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput2",
        args: { x: 4, y: -5 }
      })
    })

    cy.get('#\\/pAnchor2 .mjx-mrow').should('contain.text', '(4,−5)')

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(−2,3)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(4,−5)')


    cy.log("move booleaninputs by entering coordinates")

    cy.get('#\\/anchorCoords1 textarea').type("{home}{shift+end}{backspace}(6,7){enter}", { force: true })
    cy.get('#\\/anchorCoords2 textarea').type("{home}{shift+end}{backspace}(8,9){enter}", { force: true })

    cy.get('#\\/pAnchor2 .mjx-mrow').should('contain.text', '(8,9)')

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(8,9)')


    cy.log('change position from anchor');
    cy.get('#\\/positionFromAnchor1').select("lowerLeft")
    cy.get('#\\/positionFromAnchor2').select("lowerRight")

    cy.get("#\\/pPositionFromAnchor1").should('have.text', 'Position from anchor 1: lowerleft')
    cy.get("#\\/pPositionFromAnchor2").should('have.text', 'Position from anchor 2: lowerright')


    cy.log('make not draggable')

    cy.get('#\\/draggable1').click();
    cy.get('#\\/draggable2').click();
    cy.get("#\\/pDraggable1").should('have.text', 'Draggable 1: false')
    cy.get("#\\/pDraggable2").should('have.text', 'Draggable 2: false')


    cy.log('cannot move booleaninputs by dragging')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput1",
        args: { x: -10, y: -9 }
      })
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput2",
        args: { x: -8, y: -7 }
      })
    })

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get("#\\/bi").click();
    cy.get("#\\/b").should('have.text', 'true');

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(8,9)')



  })


});