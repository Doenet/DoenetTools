describe('AnimateFromSequence Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('increase from 1 to 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <number name="a">1</number></p>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='a' animationInterval='100' />

  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', '1')
    cy.get('#\\/a2').should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).eq(1);
      expect(components['/a'].stateValues.value).eq(1);
      expect(components['/a2'].stateValues.value).eq(1);
      expect(components['/x'].stateValues.selectedIndex).eq(1);
      expect(await components['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(`#\\/b_input`).click();
    cy.get('#\\/a').should('have.text', '2')
    cy.get('#\\/a2').should('have.text', '2')
    cy.get('#\\/a').should('have.text', '3')
    cy.get('#\\/a2').should('have.text', '3')
    cy.get('#\\/a').should('have.text', '4')
    cy.get('#\\/a2').should('have.text', '4')
    cy.get('#\\/a').should('have.text', '5')
    cy.get('#\\/a2').should('have.text', '5')
    cy.get('#\\/a').should('have.text', '6')
    cy.get('#\\/a2').should('have.text', '6')
    cy.get('#\\/a').should('have.text', '7')
    cy.get('#\\/a2').should('have.text', '7')
    cy.get('#\\/a').should('have.text', '8')
    cy.get('#\\/a2').should('have.text', '8')
    cy.get('#\\/a').should('have.text', '9')
    cy.get('#\\/a2').should('have.text', '9')
    cy.get('#\\/a').should('have.text', '10')
    cy.get('#\\/a2').should('have.text', '10')
    cy.get('#\\/a').should('have.text', '1')
    cy.get('#\\/a2').should('have.text', '1')
    cy.get('#\\/a').should('have.text', '2')
    cy.get('#\\/a2').should('have.text', '2')

    cy.get(`#\\/b_input`).click();

    cy.wait(500)

    // should stop at 2 or 3
    cy.get('#\\/a').contains(/2|3/)

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let lastValue = await components['/x'].stateValues.value;
      expect(lastValue === 2 || lastValue === 3).be.true;
      expect(components['/a'].stateValues.value).eq(lastValue);
      expect(components['/a2'].stateValues.value).eq(lastValue);
      expect(components['/x'].stateValues.selectedIndex).eq(lastValue);
      expect(await components['/x'].stateValues.animationOn).eq(false);

      cy.get('#\\/a').should('have.text', `${lastValue}`)
      cy.get('#\\/a2').should('have.text', `${lastValue}`)

    })

  })

  it('increase once from 1 to 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <number name="a">1</number></p>

  <animateFromSequence name="x" animationMode='increase once' animationOn='$b' target='a' animationInterval='100' />

  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', '1')
    cy.get('#\\/a2').should('have.text', '1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).eq(1);
      expect(components['/a'].stateValues.value).eq(1);
      expect(components['/a2'].stateValues.value).eq(1);
      expect(components['/x'].stateValues.selectedIndex).eq(1);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(`#\\/b_input`).click();
    cy.get('#\\/a').should('have.text', '2')
    cy.get('#\\/a2').should('have.text', '2')
    cy.get('#\\/a').should('have.text', '3')
    cy.get('#\\/a2').should('have.text', '3')
    cy.get('#\\/a').should('have.text', '4')
    cy.get('#\\/a2').should('have.text', '4')
    cy.get('#\\/a').should('have.text', '5')
    cy.get('#\\/a2').should('have.text', '5')
    cy.get('#\\/a').should('have.text', '6')
    cy.get('#\\/a2').should('have.text', '6')
    cy.get('#\\/a').should('have.text', '7')
    cy.get('#\\/a2').should('have.text', '7')
    cy.get('#\\/a').should('have.text', '8')
    cy.get('#\\/a2').should('have.text', '8')
    cy.get('#\\/a').should('have.text', '9')
    cy.get('#\\/a2').should('have.text', '9')
    cy.get('#\\/a').should('have.text', '10')
    cy.get('#\\/a2').should('have.text', '10')

    cy.wait(500)
    cy.get('#\\/a').should('have.text', '10')
    cy.get('#\\/a2').should('have.text', '10')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).eq(10);
      expect(components['/a'].stateValues.value).eq(10);
      expect(components['/a2'].stateValues.value).eq(10);
      expect(components['/x'].stateValues.selectedIndex).eq(10);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

  })

  it('decrease from z to e by 3', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <text name="a">z</text></p>

  <animateFromSequence type="letters" name="x" animationMode='decrease' animationOn='$b' target='a' animationInterval='100' from="e" to="z" step="3" />
  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', 'z')
    cy.get('#\\/a2').should('have.text', 'z')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).eq('e');
      expect(components['/a'].stateValues.value).eq('z');
      expect(components['/a2'].stateValues.value).eq('z');
      expect(components['/x'].stateValues.selectedIndex).eq(1);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

    cy.log('advance at most one when click twice')
    cy.get(`#\\/b_input`).click();
    cy.get(`#\\/b_input`).click();

    cy.get('#\\/a').contains(/w|z/)

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let lastValue = await components['/x'].stateValues.value;
      expect(lastValue === "z" || lastValue === "w").be.true;
      expect(components['/a'].stateValues.value).eq(lastValue);
      expect(components['/a2'].stateValues.value).eq(lastValue);
      expect(components['/x'].stateValues.selectedIndex).eq(lastValue === "z" ? 8 : 7);
      expect(components['/x'].stateValues.animationOn).eq(false);
      cy.get('#\\/a').should('have.text', lastValue)
      cy.get('#\\/a2').should('have.text', lastValue)

    })


    cy.get(`#\\/b_input`).click();
    cy.get('#\\/a').should('have.text', 't')
    cy.get('#\\/a2').should('have.text', 't')
    cy.get('#\\/a').should('have.text', 'q')
    cy.get('#\\/a2').should('have.text', 'q')
    cy.get('#\\/a').should('have.text', 'n')
    cy.get('#\\/a2').should('have.text', 'n')
    cy.get('#\\/a').should('have.text', 'k')
    cy.get('#\\/a2').should('have.text', 'k')
    cy.get('#\\/a').should('have.text', 'h')
    cy.get('#\\/a2').should('have.text', 'h')
    cy.get('#\\/a').should('have.text', 'e')
    cy.get('#\\/a2').should('have.text', 'e')
    cy.get('#\\/a').should('have.text', 'z')
    cy.get('#\\/a2').should('have.text', 'z')
    cy.get('#\\/a').should('have.text', 'w')
    cy.get('#\\/a2').should('have.text', 'w')
    cy.get('#\\/a').should('have.text', 't')
    cy.get('#\\/a2').should('have.text', 't')
    cy.get('#\\/a').should('have.text', 'q')
    cy.get('#\\/a2').should('have.text', 'q')

    cy.get(`#\\/b_input`).click();

    cy.wait(500)
    cy.get('#\\/a').contains(/q|n/)


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let lastValue = await components['/x'].stateValues.value;
      expect(lastValue === "q" || lastValue === "n").be.true;
      expect(components['/a'].stateValues.value).eq(lastValue);
      expect(components['/a2'].stateValues.value).eq(lastValue);
      expect(components['/x'].stateValues.selectedIndex).eq(lastValue === "q" ? 5 : 4);
      expect(components['/x'].stateValues.animationOn).eq(false);

      cy.get('#\\/a').should('have.text', lastValue)
      cy.get('#\\/a2').should('have.text', lastValue)

    })

  })

  it('decrease once from z to e by 3', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <text name="a">z</text></p>

  <animateFromSequence type="letters" name="x" animationMode='decrease once' animationOn='$b' target='a' animationInterval='100' from="e" to="z" step="3" />
  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', 'z')
    cy.get('#\\/a2').should('have.text', 'z')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).eq('e');
      expect(components['/a'].stateValues.value).eq('z');
      expect(components['/a2'].stateValues.value).eq('z');
      expect(components['/x'].stateValues.selectedIndex).eq(1);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(`#\\/b_input`).click();
    cy.get('#\\/a').should('have.text', 'w')
    cy.get('#\\/a2').should('have.text', 'w')
    cy.get('#\\/a').should('have.text', 't')
    cy.get('#\\/a2').should('have.text', 't')
    cy.get('#\\/a').should('have.text', 'q')
    cy.get('#\\/a2').should('have.text', 'q')
    cy.get('#\\/a').should('have.text', 'n')
    cy.get('#\\/a2').should('have.text', 'n')
    cy.get('#\\/a').should('have.text', 'k')
    cy.get('#\\/a2').should('have.text', 'k')
    cy.get('#\\/a').should('have.text', 'h')
    cy.get('#\\/a2').should('have.text', 'h')
    cy.get('#\\/a').should('have.text', 'e')
    cy.get('#\\/a2').should('have.text', 'e')


    cy.wait(500)
    cy.get('#\\/a').should('have.text', 'e')
    cy.get('#\\/a2').should('have.text', 'e')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).eq('e');
      expect(components['/a'].stateValues.value).eq('e');
      expect(components['/a2'].stateValues.value).eq('e');
      expect(components['/x'].stateValues.selectedIndex).eq(1);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

  })

  it('oscillate between -1000 and 1000 by 100s, skipping 0, +-200, +-300 +-400, +-700, +-800', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <number name="a">-600</number></p>

  <animateFromSequence name="x" animationMode='oscillate' animationOn='$b' target='a' animationInterval='100' from="-1000" to="1000" step="100" exclude="0 200 -200 300 -300 400 -400 700 -700 800 -800" />
  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', '-600')
    cy.get('#\\/a2').should('have.text', '-600')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).eq(-1000);
      expect(components['/a'].stateValues.value).eq(-600);
      expect(components['/a2'].stateValues.value).eq(-600);
      expect(components['/x'].stateValues.selectedIndex).eq(1);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(`#\\/b_input`).click();
    cy.get(`#\\/b_input`).click();


    cy.get('#\\/a').contains(/-600|-500/)

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let lastValue = await components['/x'].stateValues.value;
      expect(lastValue === -600 || lastValue === -500).be.true;
      expect(components['/a'].stateValues.value).eq(lastValue);
      expect(components['/a2'].stateValues.value).eq(lastValue);
      expect(components['/x'].stateValues.selectedIndex).eq(lastValue === -600 ? 3 : 4);
      expect(components['/x'].stateValues.animationOn).eq(false);
      cy.get('#\\/a').should('have.text', `${lastValue}`)
      cy.get('#\\/a2').should('have.text', `${lastValue}`)


    })

    cy.get(`#\\/b_input`).click();
    cy.get('#\\/a').should('have.text', '-100')
    cy.get('#\\/a2').should('have.text', '-100')
    cy.get('#\\/a').should('have.text', '100')
    cy.get('#\\/a2').should('have.text', '100')
    cy.get('#\\/a').should('have.text', '500')
    cy.get('#\\/a2').should('have.text', '500')
    cy.get('#\\/a').should('have.text', '600')
    cy.get('#\\/a2').should('have.text', '600')
    cy.get('#\\/a').should('have.text', '900')
    cy.get('#\\/a2').should('have.text', '900')
    cy.get('#\\/a').should('have.text', '1000')
    cy.get('#\\/a2').should('have.text', '1000')
    cy.get('#\\/a').should('have.text', '900')
    cy.get('#\\/a2').should('have.text', '900')
    cy.get('#\\/a').should('have.text', '600')
    cy.get('#\\/a2').should('have.text', '600')
    cy.get('#\\/a').should('have.text', '500')
    cy.get('#\\/a2').should('have.text', '500')
    cy.get('#\\/a').should('have.text', '100')
    cy.get('#\\/a2').should('have.text', '100')
    cy.get('#\\/a').should('have.text', '-100')
    cy.get('#\\/a2').should('have.text', '-100')
    cy.get('#\\/a').should('have.text', '-500')
    cy.get('#\\/a2').should('have.text', '-500')
    cy.get('#\\/a').should('have.text', '-600')
    cy.get('#\\/a2').should('have.text', '-600')
    cy.get('#\\/a').should('have.text', '-900')
    cy.get('#\\/a2').should('have.text', '-900')
    cy.get('#\\/a').should('have.text', '-1000')
    cy.get('#\\/a2').should('have.text', '-1000')
    cy.get('#\\/a').should('have.text', '-900')
    cy.get('#\\/a2').should('have.text', '-900')
    cy.get('#\\/a').should('have.text', '-600')
    cy.get('#\\/a2').should('have.text', '-600')
    cy.get('#\\/a').should('have.text', '-500')
    cy.get('#\\/a2').should('have.text', '-500')
    cy.get('#\\/a').should('have.text', '-100')
    cy.get('#\\/a2').should('have.text', '-100')

    cy.get(`#\\/b_input`).click();

    cy.wait(500)

    cy.get('#\\/a').contains(/-100|100/)

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let lastValue = await components['/x'].stateValues.value;
      expect(lastValue === -100 || lastValue === 100).be.true;
      expect(components['/a'].stateValues.value).eq(lastValue);
      expect(components['/a2'].stateValues.value).eq(lastValue);
      expect(components['/x'].stateValues.selectedIndex).eq(lastValue === -100 ? 5 : 6);
      expect(components['/x'].stateValues.animationOn).eq(false);

      cy.get('#\\/a').should('have.text', `${lastValue}`)
      cy.get('#\\/a2').should('have.text', `${lastValue}`)

    })

  })

  it('animation adjusts if value changed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p name="pa">value: $a</p> 
  <slider name="a" initialValue="89.8" from="1" to="100" step="0.1" />

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='a' animationInterval='400' from="1" to="100" step="0.1" />

  <booleaninput name="b" />
  
  <p name="pa2">value: $a2</p>
  <copy target="a" assignNames="a2" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/pa').should('have.text', 'value: 89.8')
    cy.get('#\\/pa2').should('have.text', 'value: 89.8')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).closeTo(1, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(89.8, 1E-12);
      expect(components['/a2'].stateValues.value).closeTo(89.8, 1E-12);
      expect(components['/x'].stateValues.selectedIndex).eq(1);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(`#\\/b_input`).click();
    cy.get(`#\\/b_input`).click();

    cy.get('#\\/pa').should('have.text', 'value: 89.8')
    cy.get('#\\/pa2').should('have.text', 'value: 89.8')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).closeTo(89.8, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(89.8, 1E-12);
      expect(components['/a2'].stateValues.value).closeTo(89.8, 1E-12);
      expect(components['/x'].stateValues.selectedIndex).eq(889);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(`#\\/b_input`).click();
    cy.get('#\\/pa').should('have.text', 'value: 89.8')
    cy.get('#\\/pa2').should('have.text', 'value: 89.8')
    cy.get('#\\/pa').should('have.text', 'value: 89.9')
    cy.get('#\\/pa2').should('have.text', 'value: 89.9')
    cy.get('#\\/pa').should('have.text', 'value: 90')
    cy.get('#\\/pa2').should('have.text', 'value: 90')
    cy.get('#\\/pa').should('have.text', 'value: 90.1')
    cy.get('#\\/pa2').should('have.text', 'value: 90.1')

    cy.get(`#\\/b_input`).click();

    cy.get('#\\/pa').should('have.text', 'value: 90.1')
    cy.get('#\\/pa2').should('have.text', 'value: 90.1')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).closeTo(90.1, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(90.1, 1E-12);
      expect(components['/a2'].stateValues.value).closeTo(90.1, 1E-12);
      expect(components['/x'].stateValues.selectedIndex).eq(892);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })


    cy.get(`#\\/b_input`).click();
    cy.get('#\\/pa').should('have.text', 'value: 90.1')
    cy.get('#\\/pa2').should('have.text', 'value: 90.1')
    cy.get('#\\/pa').should('have.text', 'value: 90.2')
    cy.get('#\\/pa2').should('have.text', 'value: 90.2')
    cy.get(`#\\/b_input`).click();

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).closeTo(90.2, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(90.2, 1E-12);
      expect(components['/a2'].stateValues.value).closeTo(90.2, 1E-12);
      expect(components['/x'].stateValues.selectedIndex).eq(893);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

    cy.log(`change value on with first slider`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/a"].changeValue({ value: 33.4 });
    })

    cy.get('#\\/pa').should('have.text', 'value: 33.4')
    cy.get('#\\/pa2').should('have.text', 'value: 33.4')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).closeTo(90.2, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(33.4, 1E-12);
      expect(components['/a2'].stateValues.value).closeTo(33.4, 1E-12);
      expect(components['/x'].stateValues.selectedIndex).eq(893);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })


    cy.get(`#\\/b_input`).click();
    cy.get('#\\/pa').should('have.text', 'value: 33.4')
    cy.get('#\\/pa2').should('have.text', 'value: 33.4')
    cy.get('#\\/pa').should('have.text', 'value: 33.5')
    cy.get('#\\/pa2').should('have.text', 'value: 33.5')
    cy.get('#\\/pa').should('have.text', 'value: 33.6')
    cy.get('#\\/pa2').should('have.text', 'value: 33.6')
    cy.get(`#\\/b_input`).click();

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).closeTo(33.6, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(33.6, 1E-12);
      expect(components['/a2'].stateValues.value).closeTo(33.6, 1E-12);
      expect(components['/x'].stateValues.selectedIndex).eq(327);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

    cy.log(`change value on with second slider`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/a2"].changeValue({ value: 64.5 });
    })

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).closeTo(33.6, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(64.5, 1E-12);
      expect(components['/a2'].stateValues.value).closeTo(64.5, 1E-12);
      expect(components['/x'].stateValues.selectedIndex).eq(327);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(`#\\/b_input`).click();
    cy.get('#\\/pa').should('have.text', 'value: 64.5')
    cy.get('#\\/pa2').should('have.text', 'value: 64.5')
    cy.get('#\\/pa').should('have.text', 'value: 64.6')
    cy.get('#\\/pa2').should('have.text', 'value: 64.6')
    cy.get('#\\/pa').should('have.text', 'value: 64.7')
    cy.get('#\\/pa2').should('have.text', 'value: 64.7')
    cy.get(`#\\/b_input`).click();

    cy.wait(500)
    cy.get('#\\/pa').should('have.text', 'value: 64.7')
    cy.get('#\\/pa2').should('have.text', 'value: 64.7')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/x'].stateValues.value).closeTo(64.7, 1E-12);
      expect(components['/a'].stateValues.value).closeTo(64.7, 1E-12);
      expect(components['/a2'].stateValues.value).closeTo(64.7, 1E-12);
      expect(components['/x'].stateValues.selectedIndex).eq(638);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })


  })

  it('check that calculated default value does not change on reload', () => {
    let doenetML = `
    <text>a</text>
    <p>Animation mode: <textinput name="anmode" prefill="increase" /></p>
    <animatefromsequence name="an" animationmode="$anmode" />
    <p>Animation direction: <copy prop="currentAnimationDirection" target="an" assignNames="cad" /></p>
    `;


    cy.window().then((win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/cad').should('have.text', 'increase')
    cy.get('#\\/anmode_input').should('have.value', 'increase')


    cy.get('#\\/anmode_input').clear().type('decrease{enter}')

    cy.get('#\\/cad').should('have.text', 'decrease')
    cy.get('#\\/anmode_input').should('have.value', 'decrease')


    cy.window().then((win) => {
      win.postMessage({
        doenetML: '<text>b</text>',
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/cad').should('have.text', 'decrease')
    cy.get('#\\/anmode_input').should('have.value', 'decrease')


  })



});
