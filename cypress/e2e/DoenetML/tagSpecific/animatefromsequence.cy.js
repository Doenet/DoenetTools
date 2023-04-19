import { cesc } from '../../../../src/_utils/url';

describe('AnimateFromSequence Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })

  it('increase from 1 to 10', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <number name="a">1</number></p>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='a' animationInterval='100' />

  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/a')).should('have.text', '1')
    cy.get(cesc('#\\/a2')).should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq(1);
      expect(stateVariables['/a'].stateValues.value).eq(1);
      expect(stateVariables['/a2'].stateValues.value).eq(1);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/a')).should('have.text', '2')
    cy.get(cesc('#\\/a2')).should('have.text', '2')
    cy.get(cesc('#\\/a')).should('have.text', '3')
    cy.get(cesc('#\\/a2')).should('have.text', '3')
    cy.get(cesc('#\\/a')).should('have.text', '4')
    cy.get(cesc('#\\/a2')).should('have.text', '4')
    cy.get(cesc('#\\/a')).should('have.text', '5')
    cy.get(cesc('#\\/a2')).should('have.text', '5')
    cy.get(cesc('#\\/a')).should('have.text', '6')
    cy.get(cesc('#\\/a2')).should('have.text', '6')
    cy.get(cesc('#\\/a')).should('have.text', '7')
    cy.get(cesc('#\\/a2')).should('have.text', '7')
    cy.get(cesc('#\\/a')).should('have.text', '8')
    cy.get(cesc('#\\/a2')).should('have.text', '8')
    cy.get(cesc('#\\/a')).should('have.text', '9')
    cy.get(cesc('#\\/a2')).should('have.text', '9')
    cy.get(cesc('#\\/a')).should('have.text', '10')
    cy.get(cesc('#\\/a2')).should('have.text', '10')
    cy.get(cesc('#\\/a')).should('have.text', '1')
    cy.get(cesc('#\\/a2')).should('have.text', '1')
    cy.get(cesc('#\\/a')).should('have.text', '2')
    cy.get(cesc('#\\/a2')).should('have.text', '2')

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    // should stop at 2 or 3
    cy.get(cesc('#\\/a')).contains(/2|3/)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let lastValue = stateVariables['/x'].stateValues.value;
      expect(lastValue === 2 || lastValue === 3).be.true;
      expect(stateVariables['/a'].stateValues.value).eq(lastValue);
      expect(stateVariables['/a2'].stateValues.value).eq(lastValue);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/a')).should('have.text', `${lastValue}`)
      cy.get(cesc('#\\/a2')).should('have.text', `${lastValue}`)

    })

  })

  it('increase once from 1 to 10', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <number name="a">1</number></p>

  <animateFromSequence name="x" animationMode='increase once' animationOn='$b' target='a' animationInterval='100' />

  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/a')).should('have.text', '1')
    cy.get(cesc('#\\/a2')).should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq(1);
      expect(stateVariables['/a'].stateValues.value).eq(1);
      expect(stateVariables['/a2'].stateValues.value).eq(1);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/a')).should('have.text', '2')
    cy.get(cesc('#\\/a2')).should('have.text', '2')
    cy.get(cesc('#\\/a')).should('have.text', '3')
    cy.get(cesc('#\\/a2')).should('have.text', '3')
    cy.get(cesc('#\\/a')).should('have.text', '4')
    cy.get(cesc('#\\/a2')).should('have.text', '4')
    cy.get(cesc('#\\/a')).should('have.text', '5')
    cy.get(cesc('#\\/a2')).should('have.text', '5')
    cy.get(cesc('#\\/a')).should('have.text', '6')
    cy.get(cesc('#\\/a2')).should('have.text', '6')
    cy.get(cesc('#\\/a')).should('have.text', '7')
    cy.get(cesc('#\\/a2')).should('have.text', '7')
    cy.get(cesc('#\\/a')).should('have.text', '8')
    cy.get(cesc('#\\/a2')).should('have.text', '8')
    cy.get(cesc('#\\/a')).should('have.text', '9')
    cy.get(cesc('#\\/a2')).should('have.text', '9')
    cy.get(cesc('#\\/a')).should('have.text', '10')
    cy.get(cesc('#\\/a2')).should('have.text', '10')

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    cy.get(cesc('#\\/a')).should('have.text', '10')
    cy.get(cesc('#\\/a2')).should('have.text', '10')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq(10);
      expect(stateVariables['/a'].stateValues.value).eq(10);
      expect(stateVariables['/a2'].stateValues.value).eq(10);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(10);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

  })

  it('decrease from z to e by 3', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <text name="a">z</text></p>

  <animateFromSequence type="letters" name="x" animationMode='decrease' animationOn='$b' target='a' animationInterval='100' from="e" to="z" step="3" />
  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/a')).should('have.text', 'z')
    cy.get(cesc('#\\/a2')).should('have.text', 'z')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq('e');
      expect(stateVariables['/a'].stateValues.value).eq('z');
      expect(stateVariables['/a2'].stateValues.value).eq('z');
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.log('advance at most one when click twice')
    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc(`#\\/b`)).click();


    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let lastValue = stateVariables['/x'].stateValues.value;
      return (lastValue === "z" || lastValue === "w") && stateVariables['/x'].stateValues.animationOn === false;
    }))

    cy.get(cesc('#\\/a')).contains(/w|z/)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let lastValue = stateVariables['/x'].stateValues.value;
      console.log(`lastValue: `, lastValue)
      expect(lastValue === "z" || lastValue === "w").be.true;
      expect(stateVariables['/a'].stateValues.value).eq(lastValue);
      expect(stateVariables['/a2'].stateValues.value).eq(lastValue);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue === "z" ? 8 : 7);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
      cy.get(cesc('#\\/a')).should('have.text', lastValue)
      cy.get(cesc('#\\/a2')).should('have.text', lastValue)

    })


    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/a')).should('have.text', 't')
    cy.get(cesc('#\\/a2')).should('have.text', 't')
    cy.get(cesc('#\\/a')).should('have.text', 'q')
    cy.get(cesc('#\\/a2')).should('have.text', 'q')
    cy.get(cesc('#\\/a')).should('have.text', 'n')
    cy.get(cesc('#\\/a2')).should('have.text', 'n')
    cy.get(cesc('#\\/a')).should('have.text', 'k')
    cy.get(cesc('#\\/a2')).should('have.text', 'k')
    cy.get(cesc('#\\/a')).should('have.text', 'h')
    cy.get(cesc('#\\/a2')).should('have.text', 'h')
    cy.get(cesc('#\\/a')).should('have.text', 'e')
    cy.get(cesc('#\\/a2')).should('have.text', 'e')
    cy.get(cesc('#\\/a')).should('have.text', 'z')
    cy.get(cesc('#\\/a2')).should('have.text', 'z')
    cy.get(cesc('#\\/a')).should('have.text', 'w')
    cy.get(cesc('#\\/a2')).should('have.text', 'w')
    cy.get(cesc('#\\/a')).should('have.text', 't')
    cy.get(cesc('#\\/a2')).should('have.text', 't')
    cy.get(cesc('#\\/a')).should('have.text', 'q')
    cy.get(cesc('#\\/a2')).should('have.text', 'q')

    cy.get(cesc(`#\\/b`)).click();


    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    cy.get(cesc('#\\/a')).contains(/q|n/)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let lastValue = stateVariables['/x'].stateValues.value;
      expect(lastValue === "q" || lastValue === "n").be.true;
      expect(stateVariables['/a'].stateValues.value).eq(lastValue);
      expect(stateVariables['/a2'].stateValues.value).eq(lastValue);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue === "q" ? 5 : 4);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/a')).should('have.text', lastValue)
      cy.get(cesc('#\\/a2')).should('have.text', lastValue)

    })

  })

  it('decrease once from z to e by 3', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <text name="a">z</text></p>

  <animateFromSequence type="letters" name="x" animationMode='decrease once' animationOn='$b' target='a' animationInterval='100' from="e" to="z" step="3" />
  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/a')).should('have.text', 'z')
    cy.get(cesc('#\\/a2')).should('have.text', 'z')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq('e');
      expect(stateVariables['/a'].stateValues.value).eq('z');
      expect(stateVariables['/a2'].stateValues.value).eq('z');
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/a')).should('have.text', 'w')
    cy.get(cesc('#\\/a2')).should('have.text', 'w')
    cy.get(cesc('#\\/a')).should('have.text', 't')
    cy.get(cesc('#\\/a2')).should('have.text', 't')
    cy.get(cesc('#\\/a')).should('have.text', 'q')
    cy.get(cesc('#\\/a2')).should('have.text', 'q')
    cy.get(cesc('#\\/a')).should('have.text', 'n')
    cy.get(cesc('#\\/a2')).should('have.text', 'n')
    cy.get(cesc('#\\/a')).should('have.text', 'k')
    cy.get(cesc('#\\/a2')).should('have.text', 'k')
    cy.get(cesc('#\\/a')).should('have.text', 'h')
    cy.get(cesc('#\\/a2')).should('have.text', 'h')
    cy.get(cesc('#\\/a')).should('have.text', 'e')
    cy.get(cesc('#\\/a2')).should('have.text', 'e')

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    cy.get(cesc('#\\/a')).should('have.text', 'e')
    cy.get(cesc('#\\/a2')).should('have.text', 'e')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq('e');
      expect(stateVariables['/a'].stateValues.value).eq('e');
      expect(stateVariables['/a2'].stateValues.value).eq('e');
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

  })

  it('oscillate between -1000 and 1000 by 100s, skipping 0, +-200, +-300 +-400, +-700, +-800', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <number name="a">-600</number></p>

  <animateFromSequence name="x" animationMode='oscillate' animationOn='$b' target='a' animationInterval='100' from="-1000" to="1000" step="100" exclude="0 200 -200 300 -300 400 -400 700 -700 800 -800" />
  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/a')).should('have.text', '-600')
    cy.get(cesc('#\\/a2')).should('have.text', '-600')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq(-1000);
      expect(stateVariables['/a'].stateValues.value).eq(-600);
      expect(stateVariables['/a2'].stateValues.value).eq(-600);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc(`#\\/b`)).click();


    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let lastValue = stateVariables['/x'].stateValues.value;
      return (lastValue === -600 || lastValue === -500) && stateVariables['/x'].stateValues.animationOn === false;
    }))

    cy.get(cesc('#\\/a')).contains(/-600|-500/)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let lastValue = stateVariables['/x'].stateValues.value;
      expect(lastValue === -600 || lastValue === -500).be.true;
      expect(stateVariables['/a'].stateValues.value).eq(lastValue);
      expect(stateVariables['/a2'].stateValues.value).eq(lastValue);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue === -600 ? 3 : 4);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
      cy.get(cesc('#\\/a')).should('have.text', `${lastValue}`)
      cy.get(cesc('#\\/a2')).should('have.text', `${lastValue}`)


    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/a')).should('have.text', '-100')
    cy.get(cesc('#\\/a2')).should('have.text', '-100')
    cy.get(cesc('#\\/a')).should('have.text', '100')
    cy.get(cesc('#\\/a2')).should('have.text', '100')
    cy.get(cesc('#\\/a')).should('have.text', '500')
    cy.get(cesc('#\\/a2')).should('have.text', '500')
    cy.get(cesc('#\\/a')).should('have.text', '600')
    cy.get(cesc('#\\/a2')).should('have.text', '600')
    cy.get(cesc('#\\/a')).should('have.text', '900')
    cy.get(cesc('#\\/a2')).should('have.text', '900')
    cy.get(cesc('#\\/a')).should('have.text', '1000')
    cy.get(cesc('#\\/a2')).should('have.text', '1000')
    cy.get(cesc('#\\/a')).should('have.text', '900')
    cy.get(cesc('#\\/a2')).should('have.text', '900')
    cy.get(cesc('#\\/a')).should('have.text', '600')
    cy.get(cesc('#\\/a2')).should('have.text', '600')
    cy.get(cesc('#\\/a')).should('have.text', '500')
    cy.get(cesc('#\\/a2')).should('have.text', '500')
    cy.get(cesc('#\\/a')).should('have.text', '100')
    cy.get(cesc('#\\/a2')).should('have.text', '100')
    cy.get(cesc('#\\/a')).should('have.text', '-100')
    cy.get(cesc('#\\/a2')).should('have.text', '-100')
    cy.get(cesc('#\\/a')).should('have.text', '-500')
    cy.get(cesc('#\\/a2')).should('have.text', '-500')
    cy.get(cesc('#\\/a')).should('have.text', '-600')
    cy.get(cesc('#\\/a2')).should('have.text', '-600')
    cy.get(cesc('#\\/a')).should('have.text', '-900')
    cy.get(cesc('#\\/a2')).should('have.text', '-900')
    cy.get(cesc('#\\/a')).should('have.text', '-1000')
    cy.get(cesc('#\\/a2')).should('have.text', '-1000')
    cy.get(cesc('#\\/a')).should('have.text', '-900')
    cy.get(cesc('#\\/a2')).should('have.text', '-900')
    cy.get(cesc('#\\/a')).should('have.text', '-600')
    cy.get(cesc('#\\/a2')).should('have.text', '-600')
    cy.get(cesc('#\\/a')).should('have.text', '-500')
    cy.get(cesc('#\\/a2')).should('have.text', '-500')
    cy.get(cesc('#\\/a')).should('have.text', '-100')
    cy.get(cesc('#\\/a2')).should('have.text', '-100')

    cy.get(cesc(`#\\/b`)).click();


    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    cy.get(cesc('#\\/a')).contains(/-100|100/)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let lastValue = stateVariables['/x'].stateValues.value;
      expect(lastValue === -100 || lastValue === 100).be.true;
      expect(stateVariables['/a'].stateValues.value).eq(lastValue);
      expect(stateVariables['/a2'].stateValues.value).eq(lastValue);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue === -100 ? 5 : 6);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/a')).should('have.text', `${lastValue}`)
      cy.get(cesc('#\\/a2')).should('have.text', `${lastValue}`)

    })

  })

  it('animation adjusts if value changed when paused', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p name="pa">value: $a</p> 
  <slider name="a" initialValue="89.8" from="1" to="100" step="0.1" />

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='a' animationInterval='400' from="1" to="100" step="0.1" />

  <booleaninput name="b" />
  
  <p name="pa2">value: $a2</p>
  <slider copySource="a" name="a2" />

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/pa')).should('have.text', 'value: 89.8')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 89.8')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).closeTo(1, 1E-12);
      expect(stateVariables['/a'].stateValues.value).closeTo(89.8, 1E-12);
      expect(stateVariables['/a2'].stateValues.value).closeTo(89.8, 1E-12);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let lastValue = stateVariables['/x'].stateValues.value;
      return Math.abs(lastValue - 89.8) < 1E-12 && stateVariables['/x'].stateValues.animationOn === false;
    }))

    cy.get(cesc('#\\/pa')).should('have.text', 'value: 89.8')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 89.8')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).closeTo(89.8, 1E-12);
      expect(stateVariables['/a'].stateValues.value).closeTo(89.8, 1E-12);
      expect(stateVariables['/a2'].stateValues.value).closeTo(89.8, 1E-12);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(889);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 89.8')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 89.8')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 89.9')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 89.9')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 90')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 90')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 90.1')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 90.1')

    cy.get(cesc(`#\\/b`)).click();


    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))


    cy.get(cesc('#\\/pa')).should('have.text', 'value: 90.1')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 90.1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).closeTo(90.1, 1E-12);
      expect(stateVariables['/a'].stateValues.value).closeTo(90.1, 1E-12);
      expect(stateVariables['/a2'].stateValues.value).closeTo(90.1, 1E-12);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(892);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })


    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 90.1')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 90.1')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 90.2')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 90.2')
    cy.get(cesc(`#\\/b`)).click();


    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).closeTo(90.2, 1E-12);
      expect(stateVariables['/a'].stateValues.value).closeTo(90.2, 1E-12);
      expect(stateVariables['/a2'].stateValues.value).closeTo(90.2, 1E-12);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(893);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.log(`change value on with first slider`)
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "changeValue",
        componentName: "/a",
        args: { value: 33.4 }
      })
    })

    cy.get(cesc('#\\/pa')).should('have.text', 'value: 33.4')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 33.4')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).closeTo(90.2, 1E-12);
      expect(stateVariables['/a'].stateValues.value).closeTo(33.4, 1E-12);
      expect(stateVariables['/a2'].stateValues.value).closeTo(33.4, 1E-12);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(893);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })


    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 33.4')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 33.4')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 33.5')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 33.5')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 33.6')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 33.6')
    cy.get(cesc(`#\\/b`)).click();


    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).closeTo(33.6, 1E-12);
      expect(stateVariables['/a'].stateValues.value).closeTo(33.6, 1E-12);
      expect(stateVariables['/a2'].stateValues.value).closeTo(33.6, 1E-12);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(327);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.log(`change value on with second slider`)
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "changeValue",
        componentName: "/a2",
        args: { value: 64.5 }
      })
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).closeTo(33.6, 1E-12);
      expect(stateVariables['/a'].stateValues.value).closeTo(64.5, 1E-12);
      expect(stateVariables['/a2'].stateValues.value).closeTo(64.5, 1E-12);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(327);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 64.5')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 64.5')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 64.6')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 64.6')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 64.7')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 64.7')
    cy.get(cesc(`#\\/b`)).click();


    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))


    cy.get(cesc('#\\/pa')).should('have.text', 'value: 64.7')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 64.7')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).closeTo(64.7, 1E-12);
      expect(stateVariables['/a'].stateValues.value).closeTo(64.7, 1E-12);
      expect(stateVariables['/a2'].stateValues.value).closeTo(64.7, 1E-12);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(638);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })


  })

  it('animation adjusts if value changed when running', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p name="pa">value: $a</p> 
  <slider name="a" initialValue="89.8" from="1" to="100" step="0.1" />

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='a' animationInterval='400' from="1" to="100" step="0.1" />

  <booleaninput name="b" />
  
  <p name="pa2">value: $a2</p>
  <slider copysource="a" name="a2" />

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/pa')).should('have.text', 'value: 89.8')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 89.8')

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 89.8')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 89.8')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 89.9')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 89.9')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 90')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 90')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 90.1')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 90.1')

    cy.log(`change value on with first slider`)
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "changeValue",
        componentName: "/a",
        args: { value: 33.4 }
      })
    })

    cy.get(cesc('#\\/pa')).should('have.text', 'value: 33.4')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 33.4')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 33.5')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 33.5')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 33.6')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 33.6')

    cy.log(`change value on with second slider`)
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "changeValue",
        componentName: "/a2",
        args: { value: 4.5 }
      })
    })

    cy.get(cesc('#\\/pa')).should('have.text', 'value: 4.5')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 4.5')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 4.6')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 4.6')
    cy.get(cesc('#\\/pa')).should('have.text', 'value: 4.7')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 4.7')
    cy.get(cesc(`#\\/b`)).click();


    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    cy.get(cesc('#\\/pa')).should('have.text', 'value: 4.7')
    cy.get(cesc('#\\/pa2')).should('have.text', 'value: 4.7')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).closeTo(4.7, 1E-12);
      expect(stateVariables['/a'].stateValues.value).closeTo(4.7, 1E-12);
      expect(stateVariables['/a2'].stateValues.value).closeTo(4.7, 1E-12);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(38);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })


  })

  it('check that calculated default value does not change on reload', () => {
    let doenetML = `
    <text>a</text>
    <p>Animation mode: <textinput name="anmode" prefill="increase" /></p>
    <animatefromsequence name="an" animationmode="$anmode" />
    <p>Animation direction: <copy prop="currentAnimationDirection" target="an" assignNames="cad" /></p>
    `;

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/cad')).should('have.text', 'increase')
    cy.get(cesc('#\\/anmode_input')).should('have.value', 'increase')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/anmode"].stateValues.value).eq('increase');
      expect(stateVariables["/an"].stateValues.animationMode).eq('increase');
    })


    cy.get(cesc('#\\/anmode_input')).clear().type('decrease{enter}')

    cy.get(cesc('#\\/cad')).should('have.text', 'decrease')
    cy.get(cesc('#\\/anmode_input')).should('have.value', 'decrease')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/anmode"].stateValues.value).eq('decrease');
      expect(stateVariables["/an"].stateValues.animationMode).eq('decrease');
    })

    cy.wait(2000);  // wait for 1 second debounce

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables["/anmode"];
    }))

    cy.get(cesc('#\\/cad')).should('have.text', 'decrease')
    cy.get(cesc('#\\/anmode_input')).should('have.value', 'decrease')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/anmode"].stateValues.value).eq('decrease');
      expect(stateVariables["/an"].stateValues.animationMode).eq('decrease');
    })

  })

  it('call animation actions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>value: <number name="a">1</number></p>

  <animateFromSequence name="x" animationMode='increase' target='a' animationInterval='100' />

  <callAction target="x" actionName="startAnimation" name="start" >
    <label>start</label>
  </callAction>
  <callAction target="x" actionName="stopAnimation" name="stop" >
    <label>stop</label>
  </callAction>
  <callAction target="x" actionName="toggleAnimation" name="toggle" >
    <label>toggle</label>
  </callAction>

  <p>copy: <copy target="a" assignNames="a2" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/a')).should('have.text', '1')
    cy.get(cesc('#\\/a2')).should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq(1);
      expect(stateVariables['/a'].stateValues.value).eq(1);
      expect(stateVariables['/a2'].stateValues.value).eq(1);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc('#\\/start_button')).click();
    cy.get(cesc('#\\/a')).should('have.text', '2')
    cy.get(cesc('#\\/a2')).should('have.text', '2')
    cy.get(cesc('#\\/a')).should('have.text', '3')
    cy.get(cesc('#\\/a2')).should('have.text', '3')
    cy.get(cesc('#\\/a')).should('have.text', '4')
    cy.get(cesc('#\\/a2')).should('have.text', '4')
    cy.get(cesc('#\\/a')).should('have.text', '5')
    cy.get(cesc('#\\/a2')).should('have.text', '5')

    cy.get(cesc('#\\/start_button')).click();
    cy.get(cesc('#\\/a')).should('have.text', '6')
    cy.get(cesc('#\\/a2')).should('have.text', '6')
    cy.get(cesc('#\\/a')).should('have.text', '7')
    cy.get(cesc('#\\/a2')).should('have.text', '7')
    cy.get(cesc('#\\/a')).should('have.text', '8')
    cy.get(cesc('#\\/a2')).should('have.text', '8')
    cy.get(cesc('#\\/a')).should('have.text', '9')
    cy.get(cesc('#\\/a2')).should('have.text', '9')
    cy.get(cesc('#\\/a')).should('have.text', '10')
    cy.get(cesc('#\\/a2')).should('have.text', '10')
    cy.get(cesc('#\\/a')).should('have.text', '1')
    cy.get(cesc('#\\/a2')).should('have.text', '1')
    cy.get(cesc('#\\/a')).should('have.text', '2')
    cy.get(cesc('#\\/a2')).should('have.text', '2')

    cy.get(cesc('#\\/stop_button')).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    // should stop at 2 or 3
    cy.get(cesc('#\\/a')).contains(/2|3/)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let lastValue = stateVariables['/x'].stateValues.value;
      expect(lastValue === 2 || lastValue === 3).be.true;
      expect(stateVariables['/a'].stateValues.value).eq(lastValue);
      expect(stateVariables['/a2'].stateValues.value).eq(lastValue);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/a')).should('have.text', `${lastValue}`)
      cy.get(cesc('#\\/a2')).should('have.text', `${lastValue}`)

      cy.get(cesc('#\\/stop_button')).click();


      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        return stateVariables['/x'].stateValues.animationOn === false;
      }))

      cy.get(cesc('#\\/a')).should('have.text', `${lastValue}`)
      cy.get(cesc('#\\/a2')).should('have.text', `${lastValue}`)

    })


    cy.get(cesc('#\\/toggle_button')).click();
    cy.get(cesc('#\\/a')).should('have.text', '4')
    cy.get(cesc('#\\/a2')).should('have.text', '4')
    cy.get(cesc('#\\/a')).should('have.text', '5')
    cy.get(cesc('#\\/a2')).should('have.text', '5')
    cy.get(cesc('#\\/a')).should('have.text', '6')
    cy.get(cesc('#\\/a2')).should('have.text', '6')
    cy.get(cesc('#\\/a')).should('have.text', '7')
    cy.get(cesc('#\\/a2')).should('have.text', '7')

    cy.get(cesc('#\\/toggle_button')).click();


    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    // should stop at 7 or 8
    cy.get(cesc('#\\/a')).contains(/7|8/)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let lastValue = stateVariables['/x'].stateValues.value;
      expect(lastValue === 7 || lastValue === 8).be.true;
      expect(stateVariables['/a'].stateValues.value).eq(lastValue);
      expect(stateVariables['/a2'].stateValues.value).eq(lastValue);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/a')).should('have.text', `${lastValue}`)
      cy.get(cesc('#\\/a2')).should('have.text', `${lastValue}`)


    })


  })

  it('animate componentIndex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>values: <group name="grp">
    <number>1</number>
    <number>2</number>
    <number>3</number>
  </group>
  </p>

  <p name="plist"><aslist><collect componentTypes="number" target="grp" name="col" assignNames="n1 n2 n3" /></aslist></p>
    
  <p>Index to animate: <mathinput prefill="1" name="ind" /></p>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='col' animationInterval='100' componentIndex="$ind" />

  <booleaninput name="b" />

  <p>copy: <copy target="grp" name="c2" newNamespace /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/_number1')).should('have.text', '1')
    cy.get(cesc('#\\/_number2')).should('have.text', '2')
    cy.get(cesc('#\\/_number3')).should('have.text', '3')
    cy.get(cesc('#\\/n1')).should('have.text', '1')
    cy.get(cesc('#\\/n2')).should('have.text', '2')
    cy.get(cesc('#\\/n3')).should('have.text', '3')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '1')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '2')
    cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '3')
    cy.get(cesc('#\\/plist')).should('have.text', '1, 2, 3')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq(1);
      expect(stateVariables['/_number1'].stateValues.value).eq(1);
      expect(stateVariables['/_number2'].stateValues.value).eq(2);
      expect(stateVariables['/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/n1'].stateValues.value).eq(1);
      expect(stateVariables['/n2'].stateValues.value).eq(2);
      expect(stateVariables['/n3'].stateValues.value).eq(3);
      expect(stateVariables['/c2/_number1'].stateValues.value).eq(1);
      expect(stateVariables['/c2/_number2'].stateValues.value).eq(2);
      expect(stateVariables['/c2/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/_number1')).should('have.text', '2')
    cy.get(cesc('#\\/n1')).should('have.text', '2')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '2')
    cy.get(cesc('#\\/_number1')).should('have.text', '3')
    cy.get(cesc('#\\/n1')).should('have.text', '3')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '3')
    cy.get(cesc('#\\/_number1')).should('have.text', '4')
    cy.get(cesc('#\\/n1')).should('have.text', '4')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '4')
    cy.get(cesc('#\\/_number1')).should('have.text', '5')
    cy.get(cesc('#\\/n1')).should('have.text', '5')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '5')
    cy.get(cesc('#\\/_number1')).should('have.text', '6')
    cy.get(cesc('#\\/n1')).should('have.text', '6')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '6')
    cy.get(cesc('#\\/_number1')).should('have.text', '7')
    cy.get(cesc('#\\/n1')).should('have.text', '7')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '7')
    cy.get(cesc('#\\/_number1')).should('have.text', '8')
    cy.get(cesc('#\\/n1')).should('have.text', '8')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '8')
    cy.get(cesc('#\\/_number1')).should('have.text', '9')
    cy.get(cesc('#\\/n1')).should('have.text', '9')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '9')
    cy.get(cesc('#\\/_number1')).should('have.text', '10')
    cy.get(cesc('#\\/n1')).should('have.text', '10')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '10')
    cy.get(cesc('#\\/_number1')).should('have.text', '1')
    cy.get(cesc('#\\/n1')).should('have.text', '1')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '1')
    cy.get(cesc('#\\/_number1')).should('have.text', '2')
    cy.get(cesc('#\\/n1')).should('have.text', '2')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '2')

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    // should stop at 2 or 3
    cy.get(cesc('#\\/_number1')).contains(/2|3/)

    let lastValue1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue1 = stateVariables['/x'].stateValues.value;
      expect(lastValue1 === 2 || lastValue1 === 3).be.true;

      expect(stateVariables['/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/_number2'].stateValues.value).eq(2);
      expect(stateVariables['/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/n1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/n2'].stateValues.value).eq(2);
      expect(stateVariables['/n3'].stateValues.value).eq(3);
      expect(stateVariables['/c2/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/c2/_number2'].stateValues.value).eq(2);
      expect(stateVariables['/c2/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/_number2')).should('have.text', '2')
      cy.get(cesc('#\\/_number3')).should('have.text', '3')
      cy.get(cesc('#\\/n1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/n2')).should('have.text', '2')
      cy.get(cesc('#\\/n3')).should('have.text', '3')
      cy.get(cesc('#\\/c2\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '2')
      cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '3')
      cy.get(cesc('#\\/plist')).should('have.text', `${lastValue1}, 2, 3`)


    })

    cy.log('Animate index 2');

    cy.get(cesc('#\\/ind') + ' textarea').type("{end}{backspace}2{enter}", { force: true });

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/_number2')).should('have.text', '3')
    cy.get(cesc('#\\/n2')).should('have.text', '3')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '3')
    cy.get(cesc('#\\/_number2')).should('have.text', '4')
    cy.get(cesc('#\\/n2')).should('have.text', '4')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '4')
    cy.get(cesc('#\\/_number2')).should('have.text', '5')
    cy.get(cesc('#\\/n2')).should('have.text', '5')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '5')
    cy.get(cesc('#\\/_number2')).should('have.text', '6')
    cy.get(cesc('#\\/n2')).should('have.text', '6')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '6')
    cy.get(cesc('#\\/_number2')).should('have.text', '7')
    cy.get(cesc('#\\/n2')).should('have.text', '7')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '7')
    cy.get(cesc('#\\/_number2')).should('have.text', '8')
    cy.get(cesc('#\\/n2')).should('have.text', '8')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '8')

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    // should stop at 9 or 0
    cy.get(cesc('#\\/_number2')).contains(/8|9/)


    let lastValue2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue2 = stateVariables['/x'].stateValues.value;
      expect(lastValue2 === 8 || lastValue2 === 9).be.true;

      expect(stateVariables['/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/_number2'].stateValues.value).eq(lastValue2);
      expect(stateVariables['/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/n1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/n2'].stateValues.value).eq(lastValue2);
      expect(stateVariables['/n3'].stateValues.value).eq(3);
      expect(stateVariables['/c2/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/c2/_number2'].stateValues.value).eq(lastValue2);
      expect(stateVariables['/c2/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue2);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/_number2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/_number3')).should('have.text', '3')
      cy.get(cesc('#\\/n1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/n2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/n3')).should('have.text', '3')
      cy.get(cesc('#\\/c2\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/c2\\/_number2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '3')
      cy.get(cesc('#\\/plist')).should('have.text', `${lastValue1}, ${lastValue2}, 3`)


    })

    cy.log('Switch to animate index 3 while animating');

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/_number2')).should('have.text', '10')
    cy.get(cesc('#\\/n2')).should('have.text', '10')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '10')
    cy.get(cesc('#\\/_number2')).should('have.text', '1')
    cy.get(cesc('#\\/n2')).should('have.text', '1')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '1')

    cy.get(cesc('#\\/ind') + ' textarea').type("{end}{backspace}3{enter}", { force: true });

    cy.get(cesc('#\\/_number3')).should('have.text', '4')
    cy.get(cesc('#\\/n3')).should('have.text', '4')
    cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '4')
    cy.get(cesc('#\\/_number3')).should('have.text', '5')
    cy.get(cesc('#\\/n3')).should('have.text', '5')
    cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '5')
    cy.get(cesc('#\\/_number3')).should('have.text', '6')
    cy.get(cesc('#\\/n3')).should('have.text', '6')
    cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '6')
    cy.get(cesc('#\\/_number3')).should('have.text', '7')
    cy.get(cesc('#\\/n3')).should('have.text', '7')
    cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '7')

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    // should stop at 7 or 8
    cy.get(cesc('#\\/_number3')).contains(/7|8/)

    // previous should have stopped at 1 or 2
    cy.get(cesc('#\\/_number2')).contains(/1|2/)

    let lastValue3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue3 = stateVariables['/x'].stateValues.value;
      expect(lastValue3 === 7 || lastValue3 === 8).be.true;
      lastValue2 = stateVariables['/_number2'].stateValues.value;
      expect(lastValue2 === 1 || lastValue2 === 2).be.true;

      expect(stateVariables['/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/_number3'].stateValues.value).eq(lastValue3);
      expect(stateVariables['/n1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/n2'].stateValues.value).eq(lastValue2);
      expect(stateVariables['/n3'].stateValues.value).eq(lastValue3);
      expect(stateVariables['/c2/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/c2/_number2'].stateValues.value).eq(lastValue2);
      expect(stateVariables['/c2/_number3'].stateValues.value).eq(lastValue3);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue3);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/_number2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/_number3')).should('have.text', `${lastValue3}`)
      cy.get(cesc('#\\/n1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/n2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/n3')).should('have.text', `${lastValue3}`)
      cy.get(cesc('#\\/c2\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/c2\\/_number2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/c2\\/_number3')).should('have.text', `${lastValue3}`)
      cy.get(cesc('#\\/plist')).should('have.text', `${lastValue1}, ${lastValue2}, ${lastValue3}`)


    })

  })

  it('animate componentIndex, array notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>values: <group name="grp">
    <number>1</number>
    <number>2</number>
    <number>3</number>
  </group>
  </p>

  <p name="plist"><aslist><collect componentTypes="number" target="grp" name="col" assignNames="n1 n2 n3" /></aslist></p>
    
  <p>Index to animate: <mathinput prefill="1" name="ind" /></p>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='col[$ind]' animationInterval='100' />

  <booleaninput name="b" />

  <p>copy: <copy target="grp" name="c2" newNamespace /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/_number1')).should('have.text', '1')
    cy.get(cesc('#\\/_number2')).should('have.text', '2')
    cy.get(cesc('#\\/_number3')).should('have.text', '3')
    cy.get(cesc('#\\/n1')).should('have.text', '1')
    cy.get(cesc('#\\/n2')).should('have.text', '2')
    cy.get(cesc('#\\/n3')).should('have.text', '3')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '1')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '2')
    cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '3')
    cy.get(cesc('#\\/plist')).should('have.text', '1, 2, 3')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq(1);
      expect(stateVariables['/_number1'].stateValues.value).eq(1);
      expect(stateVariables['/_number2'].stateValues.value).eq(2);
      expect(stateVariables['/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/n1'].stateValues.value).eq(1);
      expect(stateVariables['/n2'].stateValues.value).eq(2);
      expect(stateVariables['/n3'].stateValues.value).eq(3);
      expect(stateVariables['/c2/_number1'].stateValues.value).eq(1);
      expect(stateVariables['/c2/_number2'].stateValues.value).eq(2);
      expect(stateVariables['/c2/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/_number1')).should('have.text', '2')
    cy.get(cesc('#\\/n1')).should('have.text', '2')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '2')
    cy.get(cesc('#\\/_number1')).should('have.text', '3')
    cy.get(cesc('#\\/n1')).should('have.text', '3')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '3')
    cy.get(cesc('#\\/_number1')).should('have.text', '4')
    cy.get(cesc('#\\/n1')).should('have.text', '4')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '4')
    cy.get(cesc('#\\/_number1')).should('have.text', '5')
    cy.get(cesc('#\\/n1')).should('have.text', '5')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '5')
    cy.get(cesc('#\\/_number1')).should('have.text', '6')
    cy.get(cesc('#\\/n1')).should('have.text', '6')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '6')
    cy.get(cesc('#\\/_number1')).should('have.text', '7')
    cy.get(cesc('#\\/n1')).should('have.text', '7')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '7')
    cy.get(cesc('#\\/_number1')).should('have.text', '8')
    cy.get(cesc('#\\/n1')).should('have.text', '8')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '8')
    cy.get(cesc('#\\/_number1')).should('have.text', '9')
    cy.get(cesc('#\\/n1')).should('have.text', '9')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '9')
    cy.get(cesc('#\\/_number1')).should('have.text', '10')
    cy.get(cesc('#\\/n1')).should('have.text', '10')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '10')
    cy.get(cesc('#\\/_number1')).should('have.text', '1')
    cy.get(cesc('#\\/n1')).should('have.text', '1')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '1')
    cy.get(cesc('#\\/_number1')).should('have.text', '2')
    cy.get(cesc('#\\/n1')).should('have.text', '2')
    cy.get(cesc('#\\/c2\\/_number1')).should('have.text', '2')

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    // should stop at 2 or 3
    cy.get(cesc('#\\/_number1')).contains(/2|3/)

    let lastValue1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue1 = stateVariables['/x'].stateValues.value;
      expect(lastValue1 === 2 || lastValue1 === 3).be.true;

      expect(stateVariables['/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/_number2'].stateValues.value).eq(2);
      expect(stateVariables['/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/n1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/n2'].stateValues.value).eq(2);
      expect(stateVariables['/n3'].stateValues.value).eq(3);
      expect(stateVariables['/c2/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/c2/_number2'].stateValues.value).eq(2);
      expect(stateVariables['/c2/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/_number2')).should('have.text', '2')
      cy.get(cesc('#\\/_number3')).should('have.text', '3')
      cy.get(cesc('#\\/n1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/n2')).should('have.text', '2')
      cy.get(cesc('#\\/n3')).should('have.text', '3')
      cy.get(cesc('#\\/c2\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '2')
      cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '3')
      cy.get(cesc('#\\/plist')).should('have.text', `${lastValue1}, 2, 3`)


    })

    cy.log('Animate index 2');

    cy.get(cesc('#\\/ind') + ' textarea').type("{end}{backspace}2{enter}", { force: true });

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/_number2')).should('have.text', '3')
    cy.get(cesc('#\\/n2')).should('have.text', '3')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '3')
    cy.get(cesc('#\\/_number2')).should('have.text', '4')
    cy.get(cesc('#\\/n2')).should('have.text', '4')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '4')
    cy.get(cesc('#\\/_number2')).should('have.text', '5')
    cy.get(cesc('#\\/n2')).should('have.text', '5')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '5')
    cy.get(cesc('#\\/_number2')).should('have.text', '6')
    cy.get(cesc('#\\/n2')).should('have.text', '6')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '6')
    cy.get(cesc('#\\/_number2')).should('have.text', '7')
    cy.get(cesc('#\\/n2')).should('have.text', '7')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '7')
    cy.get(cesc('#\\/_number2')).should('have.text', '8')
    cy.get(cesc('#\\/n2')).should('have.text', '8')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '8')

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    // should stop at 9 or 0
    cy.get(cesc('#\\/_number2')).contains(/8|9/)


    let lastValue2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue2 = stateVariables['/x'].stateValues.value;
      expect(lastValue2 === 8 || lastValue2 === 9).be.true;

      expect(stateVariables['/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/_number2'].stateValues.value).eq(lastValue2);
      expect(stateVariables['/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/n1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/n2'].stateValues.value).eq(lastValue2);
      expect(stateVariables['/n3'].stateValues.value).eq(3);
      expect(stateVariables['/c2/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/c2/_number2'].stateValues.value).eq(lastValue2);
      expect(stateVariables['/c2/_number3'].stateValues.value).eq(3);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue2);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/_number2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/_number3')).should('have.text', '3')
      cy.get(cesc('#\\/n1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/n2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/n3')).should('have.text', '3')
      cy.get(cesc('#\\/c2\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/c2\\/_number2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '3')
      cy.get(cesc('#\\/plist')).should('have.text', `${lastValue1}, ${lastValue2}, 3`)


    })

    cy.log('Switch to animate index 3 while animating');

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/_number2')).should('have.text', '10')
    cy.get(cesc('#\\/n2')).should('have.text', '10')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '10')
    cy.get(cesc('#\\/_number2')).should('have.text', '1')
    cy.get(cesc('#\\/n2')).should('have.text', '1')
    cy.get(cesc('#\\/c2\\/_number2')).should('have.text', '1')

    cy.get(cesc('#\\/ind') + ' textarea').type("{end}{backspace}3{enter}", { force: true });

    cy.get(cesc('#\\/_number3')).should('have.text', '4')
    cy.get(cesc('#\\/n3')).should('have.text', '4')
    cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '4')
    cy.get(cesc('#\\/_number3')).should('have.text', '5')
    cy.get(cesc('#\\/n3')).should('have.text', '5')
    cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '5')
    cy.get(cesc('#\\/_number3')).should('have.text', '6')
    cy.get(cesc('#\\/n3')).should('have.text', '6')
    cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '6')
    cy.get(cesc('#\\/_number3')).should('have.text', '7')
    cy.get(cesc('#\\/n3')).should('have.text', '7')
    cy.get(cesc('#\\/c2\\/_number3')).should('have.text', '7')

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    // should stop at 7 or 8
    cy.get(cesc('#\\/_number3')).contains(/7|8/)

    // previous should have stopped at 1 or 2
    cy.get(cesc('#\\/_number2')).contains(/1|2/)

    let lastValue3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue3 = stateVariables['/x'].stateValues.value;
      expect(lastValue3 === 7 || lastValue3 === 8).be.true;
      lastValue2 = stateVariables['/_number2'].stateValues.value;
      expect(lastValue2 === 1 || lastValue2 === 2).be.true;

      expect(stateVariables['/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/_number3'].stateValues.value).eq(lastValue3);
      expect(stateVariables['/n1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/n2'].stateValues.value).eq(lastValue2);
      expect(stateVariables['/n3'].stateValues.value).eq(lastValue3);
      expect(stateVariables['/c2/_number1'].stateValues.value).eq(lastValue1);
      expect(stateVariables['/c2/_number2'].stateValues.value).eq(lastValue2);
      expect(stateVariables['/c2/_number3'].stateValues.value).eq(lastValue3);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue3);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/_number2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/_number3')).should('have.text', `${lastValue3}`)
      cy.get(cesc('#\\/n1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/n2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/n3')).should('have.text', `${lastValue3}`)
      cy.get(cesc('#\\/c2\\/_number1')).should('have.text', `${lastValue1}`)
      cy.get(cesc('#\\/c2\\/_number2')).should('have.text', `${lastValue2}`)
      cy.get(cesc('#\\/c2\\/_number3')).should('have.text', `${lastValue3}`)
      cy.get(cesc('#\\/plist')).should('have.text', `${lastValue1}, ${lastValue2}, ${lastValue3}`)


    })

  })

  it('animate propIndex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>


  <p name="p1"><numberlist name="nl">1 2 3</numberlist></p>
    
  <p>Component to animate: <mathinput prefill="1" name="ind" /></p>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='nl' prop="numbers" propIndex="$ind" animationInterval='100' />

  <booleaninput name="b" />

  <p name="p2"><copy target="nl" assignNames="nl2" /></p>

  <p><copy prop="number3" target="nl" assignNames="n3" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/p1')).should('have.text', '1, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '1, 2, 3')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq(1);
      expect(stateVariables['/nl'].stateValues.numbers).eqls([1, 2, 3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([1, 2, 3]);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/p1')).should('have.text', '2, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '2, 2, 3')
    cy.get(cesc('#\\/p1')).should('have.text', '3, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '3, 2, 3')
    cy.get(cesc('#\\/p1')).should('have.text', '4, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '4, 2, 3')
    cy.get(cesc('#\\/p1')).should('have.text', '5, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '5, 2, 3')


    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    let lastValue1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue1 = stateVariables['/x'].stateValues.value;
      expect(lastValue1 === 5 || lastValue1 === 6).be.true;

      expect(stateVariables['/nl'].stateValues.numbers).eqls([lastValue1, 2, 3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([lastValue1, 2, 3]);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 2, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 2, 3`)


    })

    cy.log('Animate index 2');

    cy.get(cesc('#\\/ind') + ' textarea').type("{end}{backspace}2{enter}", { force: true });

    cy.get(cesc(`#\\/b`)).click().then(() => {
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 3, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 3, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 4, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 4, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 5, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 5, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 6, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 6, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 7, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 7, 3`)
    });

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    let lastValue2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue2 = stateVariables['/x'].stateValues.value;
      expect(lastValue2 === 7 || lastValue2 === 8).be.true;


      expect(stateVariables['/nl'].stateValues.numbers).eqls([lastValue1, lastValue2, 3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([lastValue1, lastValue2, 3]);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue2);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, ${lastValue2}, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, ${lastValue2}, 3`)

    })

    cy.log('Switch to animate index 3 while animating');

    cy.get(cesc(`#\\/b`)).click().then(() => {
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 9, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 9, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 10, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 10, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 1, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 1, 3`)
    })


    cy.get(cesc('#\\/ind') + ' textarea').type("{end}{backspace}3{enter}", { force: true });

    cy.get(cesc('#\\/n3')).should('have.text', '4')
    cy.get(cesc('#\\/n3')).should('have.text', '5')
    cy.get(cesc('#\\/n3')).should('have.text', '6')
    cy.get(cesc('#\\/n3')).should('have.text', '7')

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    let lastValue3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue3 = stateVariables['/x'].stateValues.value;
      expect(lastValue3 === 7 || lastValue3 === 8).be.true;
      lastValue2 = stateVariables['/nl'].stateValues.numbers[1];
      expect(lastValue2 === 1 || lastValue2 === 2).be.true;

      expect(stateVariables['/nl'].stateValues.numbers).eqls([lastValue1, lastValue2, lastValue3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([lastValue1, lastValue2, lastValue3]);

      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue3);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, ${lastValue2}, ${lastValue3}`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, ${lastValue2}, ${lastValue3}`)


    })

  })

  it('animate propIndex, array notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>


  <p name="p1"><numberlist name="nl">1 2 3</numberlist></p>
    
  <p>Component to animate: <mathinput prefill="1" name="ind" /></p>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='nl.numbers[$ind]' animationInterval='100' />

  <booleaninput name="b" />

  <p name="p2"><copy target="nl" assignNames="nl2" /></p>

  <p><copy prop="number3" target="nl" assignNames="n3" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/p1')).should('have.text', '1, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '1, 2, 3')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq(1);
      expect(stateVariables['/nl'].stateValues.numbers).eqls([1, 2, 3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([1, 2, 3]);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/p1')).should('have.text', '2, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '2, 2, 3')
    cy.get(cesc('#\\/p1')).should('have.text', '3, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '3, 2, 3')
    cy.get(cesc('#\\/p1')).should('have.text', '4, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '4, 2, 3')
    cy.get(cesc('#\\/p1')).should('have.text', '5, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '5, 2, 3')


    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    let lastValue1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue1 = stateVariables['/x'].stateValues.value;
      expect(lastValue1 === 5 || lastValue1 === 6).be.true;

      expect(stateVariables['/nl'].stateValues.numbers).eqls([lastValue1, 2, 3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([lastValue1, 2, 3]);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 2, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 2, 3`)


    })

    cy.log('Animate index 2');

    cy.get(cesc('#\\/ind') + ' textarea').type("{end}{backspace}2{enter}", { force: true });

    cy.get(cesc(`#\\/b`)).click().then(() => {
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 3, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 3, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 4, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 4, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 5, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 5, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 6, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 6, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 7, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 7, 3`)
    });

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    let lastValue2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue2 = stateVariables['/x'].stateValues.value;
      expect(lastValue2 === 7 || lastValue2 === 8).be.true;


      expect(stateVariables['/nl'].stateValues.numbers).eqls([lastValue1, lastValue2, 3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([lastValue1, lastValue2, 3]);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue2);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, ${lastValue2}, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, ${lastValue2}, 3`)

    })

    cy.log('Switch to animate index 3 while animating');

    cy.get(cesc(`#\\/b`)).click().then(() => {
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 9, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 9, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 10, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 10, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 1, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 1, 3`)
    })


    cy.get(cesc('#\\/ind') + ' textarea').type("{end}{backspace}3{enter}", { force: true });

    cy.get(cesc('#\\/n3')).should('have.text', '4')
    cy.get(cesc('#\\/n3')).should('have.text', '5')
    cy.get(cesc('#\\/n3')).should('have.text', '6')
    cy.get(cesc('#\\/n3')).should('have.text', '7')

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    let lastValue3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue3 = stateVariables['/x'].stateValues.value;
      expect(lastValue3 === 7 || lastValue3 === 8).be.true;
      lastValue2 = stateVariables['/nl'].stateValues.numbers[1];
      expect(lastValue2 === 1 || lastValue2 === 2).be.true;

      expect(stateVariables['/nl'].stateValues.numbers).eqls([lastValue1, lastValue2, lastValue3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([lastValue1, lastValue2, lastValue3]);

      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue3);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, ${lastValue2}, ${lastValue3}`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, ${lastValue2}, ${lastValue3}`)


    })

  })

  it('animate property of property', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
    <polygon vertices="(1,7) (2,5) (3,9)" name="pg" />
  </graph>

  <p name="p1"><numberlist name="nl">$pg.vertices[1].x $pg.vertices[2].x $pg.vertices[3].x</numberlist></p>
    
  <p>Component to animate: <mathinput prefill="1" name="ind" /></p>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='pg.vertices[$ind].x' animationInterval='100' />

  <booleaninput name="b" />

  <p name="p2"><copy target="nl" assignNames="nl2" /></p>

  <p><copy prop="number3" target="nl" assignNames="n3" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#\\/p1')).should('have.text', '1, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '1, 2, 3')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.value).eq(1);
      expect(stateVariables['/nl'].stateValues.numbers).eqls([1, 2, 3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([1, 2, 3]);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);
    })

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc('#\\/p1')).should('have.text', '2, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '2, 2, 3')
    cy.get(cesc('#\\/p1')).should('have.text', '3, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '3, 2, 3')
    cy.get(cesc('#\\/p1')).should('have.text', '4, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '4, 2, 3')
    cy.get(cesc('#\\/p1')).should('have.text', '5, 2, 3')
    cy.get(cesc('#\\/p2')).should('have.text', '5, 2, 3')


    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    let lastValue1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue1 = stateVariables['/x'].stateValues.value;
      expect(lastValue1 === 5 || lastValue1 === 6).be.true;

      expect(stateVariables['/nl'].stateValues.numbers).eqls([lastValue1, 2, 3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([lastValue1, 2, 3]);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue1);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 2, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 2, 3`)


    })

    cy.log('Animate index 2');

    cy.get(cesc('#\\/ind') + ' textarea').type("{end}{backspace}2{enter}", { force: true });

    cy.get(cesc(`#\\/b`)).click().then(() => {
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 3, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 3, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 4, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 4, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 5, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 5, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 6, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 6, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 7, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 7, 3`)
    });

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    let lastValue2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue2 = stateVariables['/x'].stateValues.value;
      expect(lastValue2 === 7 || lastValue2 === 8).be.true;


      expect(stateVariables['/nl'].stateValues.numbers).eqls([lastValue1, lastValue2, 3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([lastValue1, lastValue2, 3]);
      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue2);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, ${lastValue2}, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, ${lastValue2}, 3`)

    })

    cy.log('Switch to animate index 3 while animating');

    cy.get(cesc(`#\\/b`)).click().then(() => {
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 9, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 9, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 10, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 10, 3`)
      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, 1, 3`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, 1, 3`)
    })


    cy.get(cesc('#\\/ind') + ' textarea').type("{end}{backspace}3{enter}", { force: true });

    cy.get(cesc('#\\/n3')).should('have.text', '4')
    cy.get(cesc('#\\/n3')).should('have.text', '5')
    cy.get(cesc('#\\/n3')).should('have.text', '6')
    cy.get(cesc('#\\/n3')).should('have.text', '7')

    cy.get(cesc(`#\\/b`)).click();

    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables['/x'].stateValues.animationOn === false;
    }))

    let lastValue3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      lastValue3 = stateVariables['/x'].stateValues.value;
      expect(lastValue3 === 7 || lastValue3 === 8).be.true;
      lastValue2 = stateVariables['/nl'].stateValues.numbers[1];
      expect(lastValue2 === 1 || lastValue2 === 2).be.true;

      expect(stateVariables['/nl'].stateValues.numbers).eqls([lastValue1, lastValue2, lastValue3]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([lastValue1, lastValue2, lastValue3]);

      expect(stateVariables['/x'].stateValues.selectedIndex).eq(lastValue3);
      expect(stateVariables['/x'].stateValues.animationOn).eq(false);

      cy.get(cesc('#\\/p1')).should('have.text', `${lastValue1}, ${lastValue2}, ${lastValue3}`)
      cy.get(cesc('#\\/p2')).should('have.text', `${lastValue1}, ${lastValue2}, ${lastValue3}`)


    })

  })

  it('animation stops when triggered by its own variable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <number name="t">1</number>
  <animateFromSequence name="timeAnimation" target="t" from="1" to="100" 
  animationOn="true" animationMode="increase once" animationInterval='100'/>

  <updateValue triggerWhen="$t > 2" target="timeAnimation.animationOn"
   newValue="false" type="boolean" />

  <boolean name="isOn" copySource="timeAnimation.animationOn" />


  `}, "*");
    });

    cy.get(cesc("#\\/isOn")).should('have.text', 'true');
    cy.get(cesc('#\\/t')).should('have.text', '1');
    cy.get(cesc('#\\/t')).should('have.text', '2');
    cy.get(cesc('#\\/t')).should('have.text', '3');
    cy.get(cesc("#\\/isOn")).should('have.text', 'false');

    cy.wait(500);

    cy.get(cesc('#\\/t')).should('have.text', '3');
    cy.get(cesc("#\\/isOn")).should('have.text', 'false');

  })


  it("animate number adapted to math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <p>value: <math name="a"><number>1</number></math></p>

  <animateFromSequence name="x" animationMode='increase once' animationOn='$b' target='a' from="1" to="3" animationInterval='100' />

  <booleaninput name="b" />
  
  <p>copy: <copy target="a" assignNames="a2" /></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/a") + " .mjx-mrow").should("have.text", "1");
    cy.get(cesc("#\\/a2") + " .mjx-mrow").should("have.text", "1");

    cy.get(cesc(`#\\/b`)).click();
    cy.get(cesc("#\\/a") + " .mjx-mrow").should("have.text", "2");
    cy.get(cesc("#\\/a2") + " .mjx-mrow").should("have.text", "2");
    cy.get(cesc("#\\/a") + " .mjx-mrow").should("have.text", "3");
    cy.get(cesc("#\\/a2") + " .mjx-mrow").should("have.text", "3");


  });

});
