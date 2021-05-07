describe('AnimateFromSequence Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('increase from 1 to 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' assignNames='a' animationInterval='100' />

  <booleaninput name="b" />
  
  <p>copy: <copy tname="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', '1')
    cy.get('#\\/a2').should('have.text', '1')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.value).eq(1);
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
    cy.get('#\\/a').should('have.text', '1')
    cy.get('#\\/a2').should('have.text', '1')
    cy.get('#\\/a').should('have.text', '2')
    cy.get('#\\/a2').should('have.text', '2')

    cy.get(`#\\/b_input`).click();

    cy.wait(500)
    cy.get('#\\/a').should('have.text', '2')
    cy.get('#\\/a2').should('have.text', '2')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.value).eq(2);
      expect(components['/a'].stateValues.value).eq(2);
      expect(components['/a2'].stateValues.value).eq(2);
      expect(components['/x'].stateValues.selectedIndex).eq(2);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

  })

  it('increase once from 1 to 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <animateFromSequence name="x" animationMode='increase once' animationOn='$b' assignNames='a' animationInterval='100' />

  <booleaninput name="b" />
  
  <p>copy: <copy tname="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', '1')
    cy.get('#\\/a2').should('have.text', '1')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.value).eq(1);
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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.value).eq(10);
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

  <animateFromSequence type="letters" name="x" animationMode='decrease' animationOn='$b' assignNames='a' animationInterval='100' from="e" to="z" step="3" initialSelectedIndex="8" />
  <booleaninput name="b" />
  
  <p>copy: <copy tname="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', 'z')
    cy.get('#\\/a2').should('have.text', 'z')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.value).eq('z');
      expect(components['/a'].stateValues.value).eq('z');
      expect(components['/a2'].stateValues.value).eq('z');
      expect(components['/x'].stateValues.selectedIndex).eq(8);
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
    cy.get('#\\/a').should('have.text', 'q')
    cy.get('#\\/a2').should('have.text', 'q')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.value).eq('q');
      expect(components['/a'].stateValues.value).eq('q');
      expect(components['/a2'].stateValues.value).eq('q');
      expect(components['/x'].stateValues.selectedIndex).eq(5);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

  })

  it('decrease once from z to e by 3', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <animateFromSequence type="letters" name="x" animationMode='decrease once' animationOn='$b' assignNames='a' animationInterval='100' from="e" to="z" step="3" initialSelectedIndex="8" />
  <booleaninput name="b" />
  
  <p>copy: <copy tname="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', 'z')
    cy.get('#\\/a2').should('have.text', 'z')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.value).eq('z');
      expect(components['/a'].stateValues.value).eq('z');
      expect(components['/a2'].stateValues.value).eq('z');
      expect(components['/x'].stateValues.selectedIndex).eq(8);
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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.value).eq('e');
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

  <animateFromSequence name="x" animationMode='oscillate' animationOn='$b' assignNames='a' animationInterval='100' from="-1000" to="1000" step="100" exclude="0 200 -200 300 -300 400 -400 700 -700 800 -800" initialSelectedIndex="3" />
  <booleaninput name="b" />
  
  <p>copy: <copy tname="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', '-600')
    cy.get('#\\/a2').should('have.text', '-600')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.value).eq(-600);
      expect(components['/a'].stateValues.value).eq(-600);
      expect(components['/a2'].stateValues.value).eq(-600);
      expect(components['/x'].stateValues.selectedIndex).eq(3);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(`#\\/b_input`).click();
    cy.get('#\\/a').should('have.text', '-500')
    cy.get('#\\/a2').should('have.text', '-500')
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
    cy.get('#\\/a').should('have.text', '-100')
    cy.get('#\\/a2').should('have.text', '-100')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/x'].stateValues.value).eq(-100);
      expect(components['/a'].stateValues.value).eq(-100);
      expect(components['/a2'].stateValues.value).eq(-100);
      expect(components['/x'].stateValues.selectedIndex).eq(5);
      expect(components['/x'].stateValues.animationOn).eq(false);
    })

  })

});
