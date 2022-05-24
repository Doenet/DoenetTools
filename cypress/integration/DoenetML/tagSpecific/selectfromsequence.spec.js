import me from 'math-expressions';

describe('SelectFromSequence Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('no parameters, select single number from 1 to 10', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence name="sample1"/>
    <selectfromsequence name="sample2"/>
    <selectfromsequence name="sample3"/>
    <selectfromsequence name="sample4"/>
    <selectfromsequence name="sample5"/>
    <selectfromsequence name="sample6"/>
    <selectfromsequence name="sample7"/>
    <selectfromsequence name="sample8"/>
    <selectfromsequence name="sample9"/>
    <selectfromsequence name="sample10"/>
    <selectfromsequence name="sample11"/>
    <selectfromsequence name="sample12"/>
    <selectfromsequence name="sample13"/>
    <selectfromsequence name="sample14"/>
    <selectfromsequence name="sample15"/>
    <selectfromsequence name="sample16"/>
    <selectfromsequence name="sample17"/>
    <selectfromsequence name="sample18"/>
    <selectfromsequence name="sample19"/>
    <selectfromsequence name="sample20"/>
    <selectfromsequence name="sample21"/>
    <selectfromsequence name="sample22"/>
    <selectfromsequence name="sample23"/>
    <selectfromsequence name="sample24"/>
    <selectfromsequence name="sample25"/>
    <selectfromsequence name="sample26"/>
    <selectfromsequence name="sample27"/>
    <selectfromsequence name="sample28"/>
    <selectfromsequence name="sample29"/>
    <selectfromsequence name="sample30"/>
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 30; ind++) {
        let num = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(num)).eq(true);
      }
    })
  });

  it('select single number from 1 to 6', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence name="sample1" to="6" />
    <selectfromsequence name="sample2" to="6" />
    <selectfromsequence name="sample3" to="6" />
    <selectfromsequence name="sample4" to="6" />
    <selectfromsequence name="sample5" to="6" />
    <selectfromsequence name="sample6" to="6" />
    <selectfromsequence name="sample7" to="6" />
    <selectfromsequence name="sample8" to="6" />
    <selectfromsequence name="sample9" to="6" />
    <selectfromsequence name="sample10" to="6" />
    <selectfromsequence name="sample11" to="6" />
    <selectfromsequence name="sample12" to="6" />
    <selectfromsequence name="sample13" to="6" />
    <selectfromsequence name="sample14" to="6" />
    <selectfromsequence name="sample15" to="6" />
    <selectfromsequence name="sample16" to="6" />
    <selectfromsequence name="sample17" to="6" />
    <selectfromsequence name="sample18" to="6" />
    <selectfromsequence name="sample19" to="6" />
    <selectfromsequence name="sample20" to="6" />
    <selectfromsequence name="sample21" to="6" />
    <selectfromsequence name="sample22" to="6" />
    <selectfromsequence name="sample23" to="6" />
    <selectfromsequence name="sample24" to="6" />
    <selectfromsequence name="sample25" to="6" />
    <selectfromsequence name="sample26" to="6" />
    <selectfromsequence name="sample27" to="6" />
    <selectfromsequence name="sample28" to="6" />
    <selectfromsequence name="sample29" to="6" />
    <selectfromsequence name="sample30" to="6" />
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 30; ind++) {
        let num = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        expect([1, 2, 3, 4, 5, 6].includes(num)).eq(true);
      }
    })
  });

  it('select single number from -3 to 5', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence name="sample1" from="-3" to="5" />
    <selectfromsequence name="sample2" from="-3" to="5" />
    <selectfromsequence name="sample3" from="-3" to="5" />
    <selectfromsequence name="sample4" from="-3" to="5" />
    <selectfromsequence name="sample5" from="-3" to="5" />
    <selectfromsequence name="sample6" from="-3" to="5" />
    <selectfromsequence name="sample7" from="-3" to="5" />
    <selectfromsequence name="sample8" from="-3" to="5" />
    <selectfromsequence name="sample9" from="-3" to="5" />
    <selectfromsequence name="sample10" from="-3" to="5" />
    <selectfromsequence name="sample11" from="-3" to="5" />
    <selectfromsequence name="sample12" from="-3" to="5" />
    <selectfromsequence name="sample13" from="-3" to="5" />
    <selectfromsequence name="sample14" from="-3" to="5" />
    <selectfromsequence name="sample15" from="-3" to="5" />
    <selectfromsequence name="sample16" from="-3" to="5" />
    <selectfromsequence name="sample17" from="-3" to="5" />
    <selectfromsequence name="sample18" from="-3" to="5" />
    <selectfromsequence name="sample19" from="-3" to="5" />
    <selectfromsequence name="sample20" from="-3" to="5" />
    <selectfromsequence name="sample21" from="-3" to="5" />
    <selectfromsequence name="sample22" from="-3" to="5" />
    <selectfromsequence name="sample23" from="-3" to="5" />
    <selectfromsequence name="sample24" from="-3" to="5" />
    <selectfromsequence name="sample25" from="-3" to="5" />
    <selectfromsequence name="sample26" from="-3" to="5" />
    <selectfromsequence name="sample27" from="-3" to="5" />
    <selectfromsequence name="sample28" from="-3" to="5" />
    <selectfromsequence name="sample29" from="-3" to="5" />
    <selectfromsequence name="sample30" from="-3" to="5" />
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 30; ind++) {
        let num = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        expect([-3, -2, -1, 0, 1, 2, 3, 4, 5].includes(num)).eq(true);
      }
    })
  });

  it('select single number from -3 to 5, excluding 0', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence exclude="0" name="sample1" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample2" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample3" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample4" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample5" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample6" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample7" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample8" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample9" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample10" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample11" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample12" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample13" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample14" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample15" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample16" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample17" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample18" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample19" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample20" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample21" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample22" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample23" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample24" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample25" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample26" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample27" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample28" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample29" from="-3" to="5" />
    <selectfromsequence exclude="0" name="sample30" from="-3" to="5" />
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 30; ind++) {
        let num = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        expect([-3, -2, -1, 1, 2, 3, 4, 5].includes(num)).eq(true);
      }
    })
  });

  it('select single odd number from -3 to 5', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence step="2" name="sample1" from="-3" to="5" />
    <selectfromsequence step="2" name="sample2" from="-3" to="5" />
    <selectfromsequence step="2" name="sample3" from="-3" to="5" />
    <selectfromsequence step="2" name="sample4" from="-3" to="5" />
    <selectfromsequence step="2" name="sample5" from="-3" to="5" />
    <selectfromsequence step="2" name="sample6" from="-3" to="5" />
    <selectfromsequence step="2" name="sample7" from="-3" to="5" />
    <selectfromsequence step="2" name="sample8" from="-3" to="5" />
    <selectfromsequence step="2" name="sample9" from="-3" to="5" />
    <selectfromsequence step="2" name="sample10" from="-3" to="5" />
    <selectfromsequence step="2" name="sample11" from="-3" to="5" />
    <selectfromsequence step="2" name="sample12" from="-3" to="5" />
    <selectfromsequence step="2" name="sample13" from="-3" to="5" />
    <selectfromsequence step="2" name="sample14" from="-3" to="5" />
    <selectfromsequence step="2" name="sample15" from="-3" to="5" />
    <selectfromsequence step="2" name="sample16" from="-3" to="5" />
    <selectfromsequence step="2" name="sample17" from="-3" to="5" />
    <selectfromsequence step="2" name="sample18" from="-3" to="5" />
    <selectfromsequence step="2" name="sample19" from="-3" to="5" />
    <selectfromsequence step="2" name="sample20" from="-3" to="5" />
    <selectfromsequence step="2" name="sample21" from="-3" to="5" />
    <selectfromsequence step="2" name="sample22" from="-3" to="5" />
    <selectfromsequence step="2" name="sample23" from="-3" to="5" />
    <selectfromsequence step="2" name="sample24" from="-3" to="5" />
    <selectfromsequence step="2" name="sample25" from="-3" to="5" />
    <selectfromsequence step="2" name="sample26" from="-3" to="5" />
    <selectfromsequence step="2" name="sample27" from="-3" to="5" />
    <selectfromsequence step="2" name="sample28" from="-3" to="5" />
    <selectfromsequence step="2" name="sample29" from="-3" to="5" />
    <selectfromsequence step="2" name="sample30" from="-3" to="5" />
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 30; ind++) {
        let num = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        expect([-3, -1, 1, 3, 5].includes(num)).eq(true);
      }
    })
  });

  it('select single letter from c to h', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence type="letters" name="sample1" from="c" to="h" />
    <selectfromsequence type="letters" name="sample2" from="c" to="h" />
    <selectfromsequence type="letters" name="sample3" from="c" to="h" />
    <selectfromsequence type="letters" name="sample4" from="c" to="h" />
    <selectfromsequence type="letters" name="sample5" from="c" to="h" />
    <selectfromsequence type="letters" name="sample6" from="c" to="h" />
    <selectfromsequence type="letters" name="sample7" from="c" to="h" />
    <selectfromsequence type="letters" name="sample8" from="c" to="h" />
    <selectfromsequence type="letters" name="sample9" from="c" to="h" />
    <selectfromsequence type="letters" name="sample10" from="c" to="h" />
    <selectfromsequence type="letters" name="sample11" from="c" to="h" />
    <selectfromsequence type="letters" name="sample12" from="c" to="h" />
    <selectfromsequence type="letters" name="sample13" from="c" to="h" />
    <selectfromsequence type="letters" name="sample14" from="c" to="h" />
    <selectfromsequence type="letters" name="sample15" from="c" to="h" />
    <selectfromsequence type="letters" name="sample16" from="c" to="h" />
    <selectfromsequence type="letters" name="sample17" from="c" to="h" />
    <selectfromsequence type="letters" name="sample18" from="c" to="h" />
    <selectfromsequence type="letters" name="sample19" from="c" to="h" />
    <selectfromsequence type="letters" name="sample20" from="c" to="h" />
    <selectfromsequence type="letters" name="sample21" from="c" to="h" />
    <selectfromsequence type="letters" name="sample22" from="c" to="h" />
    <selectfromsequence type="letters" name="sample23" from="c" to="h" />
    <selectfromsequence type="letters" name="sample24" from="c" to="h" />
    <selectfromsequence type="letters" name="sample25" from="c" to="h" />
    <selectfromsequence type="letters" name="sample26" from="c" to="h" />
    <selectfromsequence type="letters" name="sample27" from="c" to="h" />
    <selectfromsequence type="letters" name="sample28" from="c" to="h" />
    <selectfromsequence type="letters" name="sample29" from="c" to="h" />
    <selectfromsequence type="letters" name="sample30" from="c" to="h" />
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 30; ind++) {
        let letter = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        expect(['c', 'd', 'e', 'f', 'g', 'h'].includes(letter)).eq(true);
      }
    })
  });

  it('select two even numbers from -4 to 4, excluding 0', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample1" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample2" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample3" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample4" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample5" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample6" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample7" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample8" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample9" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample10" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample11" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample12" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample13" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample14" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample15" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample16" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample17" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample18" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample19" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample20" from="-4" to="4" />
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let num2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;
        expect([-4, -2, 2, 4].includes(num1)).eq(true);
        expect([-4, -2, 2, 4].includes(num2)).eq(true);
        expect(num1).not.eq(num2);
      }
    })
  });

  it('select two even numbers from -4 to 2, excluding 0 and combinations', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample1" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample2" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample3" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample4" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample5" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample6" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample7" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample8" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample9" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample10" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample11" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample12" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample13" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample14" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample15" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample16" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample17" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample18" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample19" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample20" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [[-4, 2], [-2, -4], [2, -2]];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let num2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;

        expect(allowedCombinations.some(v => v[0] === num1 && v[1] === num2)).eq(true);
      }
    })
  });

  it('select two even numbers from -4 to 2, excluding 0 and combinations, as copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist name="ec">-4 -2</numberlist>
    <number name="e1">-2</number>
    <number name="e2">2</number>
    <math name="e3">-4</math>
    <numberlist name="ec2">-4 -2</numberlist>
    <numberlist name="ec3">-2 2</numberlist>
    <mathlist name="ec4">2 -4</mathlist>

    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample1" from="-4" to="2" excludecombinations="$ec ($e1 2) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample2" from="-4" to="2" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample3" from="-4" to="2" excludecombinations="$ec ($e1 2) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample4" from="-4" to="2" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample5" from="-4" to="2" excludecombinations="$ec ($e1 2) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample6" from="-4" to="2" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample7" from="-4" to="2" excludecombinations="$ec ($e1 2) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample8" from="-4" to="2" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample9" from="-4" to="2" excludecombinations="$ec ($e1 2) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample10" from="-4" to="2" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample11" from="-4" to="2" excludecombinations="$ec ($e1 2) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample12" from="-4" to="2" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample13" from="-4" to="2" excludecombinations="$ec ($e1 2) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample14" from="-4" to="2" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample15" from="-4" to="2" excludecombinations="$ec ($e1 2) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample16" from="-4" to="2" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample17" from="-4" to="2" excludecombinations="$ec ($e1 2) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample18" from="-4" to="2" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample19" from="-4" to="2" excludecombinations="$ec ($e1 2) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample20" from="-4" to="2" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [[-4, 2], [-2, -4], [2, -2]];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let num2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;

        expect(allowedCombinations.some(v => v[0] === num1 && v[1] === num2)).eq(true);
      }
    })
  });

  it('select two even numbers from -4 to 2, excluding 0 and combinations, exclude extras', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample1" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample2" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample3" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample4" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample5" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample6" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample7" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample8" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample9" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample10" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample11" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample12" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample13" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample14" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample15" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample16" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample17" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample18" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample19" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0 3 4 5 6 7 8" numbertoselect="2" name="sample20" from="-4" to="2" excludecombinations="(-4 -2) (-2 2) (2 -4)" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [[-4, 2], [-2, -4], [2, -2]];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let num2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;

        expect(allowedCombinations.some(v => v[0] === num1 && v[1] === num2)).eq(true);
      }
    })
  });

  it('select five even numbers with replacement from -4 to 4, excluding 0', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample1" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample2" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample3" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample4" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample5" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample6" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample7" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample8" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample9" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample10" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample11" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample12" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample13" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample14" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample15" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample16" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample17" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample18" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample19" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample20" from="-4" to="4" />
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let num2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;
        let num3 = stateVariables[stateVariables['/sample' + ind].replacements[2].componentName].stateValues.value;
        let num4 = stateVariables[stateVariables['/sample' + ind].replacements[3].componentName].stateValues.value;
        let num5 = stateVariables[stateVariables['/sample' + ind].replacements[4].componentName].stateValues.value;
        expect([-4, -2, 2, 4].includes(num1)).eq(true);
        expect([-4, -2, 2, 4].includes(num2)).eq(true);
        expect([-4, -2, 2, 4].includes(num3)).eq(true);
        expect([-4, -2, 2, 4].includes(num4)).eq(true);
        expect([-4, -2, 2, 4].includes(num5)).eq(true);
      }
    })
  });

  it('select five (number initially unresolved) even numbers with replacement from -4 to 4, excluding 0', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample1" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample2" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample3" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample4" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample5" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample6" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample7" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample8" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample9" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample10" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample11" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample12" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample13" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample14" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample15" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample16" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample17" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample18" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample19" numbertoselect="$n" from="-4" to="4" />
    <selectfromsequence step="2" exclude="0" withReplacement name="sample20" numbertoselect="$n" from="-4" to="4" />
    </aslist>
    <copy name="n2" target="n3" />
    <copy name="n" target="num1" />
    <math name="num1"><copy target="n2" />+<copy target="num2" />+2</math>
    <math name="num2"><copy target="n3" />+<copy target="num3" /></math>
    <copy name="n3" target="num3" />
    <number name="num3">1</number>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let num2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;
        let num3 = stateVariables[stateVariables['/sample' + ind].replacements[2].componentName].stateValues.value;
        let num4 = stateVariables[stateVariables['/sample' + ind].replacements[3].componentName].stateValues.value;
        let num5 = stateVariables[stateVariables['/sample' + ind].replacements[4].componentName].stateValues.value;
        expect([-4, -2, 2, 4].includes(num1)).eq(true);
        expect([-4, -2, 2, 4].includes(num2)).eq(true);
        expect([-4, -2, 2, 4].includes(num3)).eq(true);
        expect([-4, -2, 2, 4].includes(num4)).eq(true);
        expect([-4, -2, 2, 4].includes(num5)).eq(true);
      }
    })
  });

  it("copies don't resample", () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <p><aslist>
    <selectfromsequence name="sample1" to="100" />
    <selectfromsequence name="sample2" to="100" />
    </aslist></p>

    <p><aslist>
    <copy name="noresample1" target="sample1" />
    <copy name="noresample2" target="sample2" />
    <copy name="noreresample1" target="noresample1" />
    <copy name="noreresample2" target="noresample2" />
    </aslist></p>

    <p><copy name="noresamplelist" target="_aslist1" /></p>

    <p><copy name="noreresamplelist" target="noresamplelist" /></p>

    <copy name="noresamplep" target="_p1" />
    <copy name="noreresamplep" target="noresamplep" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let num1 = stateVariables[stateVariables['/sample1'].replacements[0].componentName].stateValues.value;
      let num2 = stateVariables[stateVariables['/sample2'].replacements[0].componentName].stateValues.value;
      expect(Number.isInteger(num1) && num1 >= 1 && num1 <= 100).eq(true);
      expect(Number.isInteger(num2) && num2 >= 1 && num2 <= 100).eq(true);
      expect(stateVariables[stateVariables['/noresample1'].replacements[0].componentName].stateValues.value).eq(num1);
      expect(stateVariables[stateVariables['/noresample2'].replacements[0].componentName].stateValues.value).eq(num2);
      expect(stateVariables[stateVariables['/noreresample1'].replacements[0].componentName].stateValues.value).eq(num1);
      expect(stateVariables[stateVariables['/noreresample2'].replacements[0].componentName].stateValues.value).eq(num2);

      expect(stateVariables[stateVariables[stateVariables['/noresamplelist'].replacements[0].componentName].activeChildren[0].componentName].stateValues.value).eq(num1);
      expect(stateVariables[stateVariables[stateVariables['/noresamplelist'].replacements[0].componentName].activeChildren[1].componentName].stateValues.value).eq(num2);
      expect(stateVariables[stateVariables[stateVariables['/noreresamplelist'].replacements[0].componentName].activeChildren[0].componentName].stateValues.value).eq(num1);
      expect(stateVariables[stateVariables[stateVariables['/noreresamplelist'].replacements[0].componentName].activeChildren[1].componentName].stateValues.value).eq(num2);

      expect(stateVariables[stateVariables[stateVariables[stateVariables['/noresamplep'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[0].componentName].stateValues.value).eq(num1);
      expect(stateVariables[stateVariables[stateVariables[stateVariables['/noresamplep'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[1].componentName].stateValues.value).eq(num2);
      expect(stateVariables[stateVariables[stateVariables[stateVariables['/noreresamplep'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[0].componentName].stateValues.value).eq(num1);
      expect(stateVariables[stateVariables[stateVariables[stateVariables['/noreresamplep'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[1].componentName].stateValues.value).eq(num2);

    })
  });

  it("select doesn't change dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <mathinput prefill="5" name="numbertoselect"/>
    <mathinput prefill="3" name="maxnum"/>
    <p><aslist>
    <selectfromsequence name="sample1" withReplacement length="$maxnum" numbertoselect="$numbertoselect" />
    </aslist></p>

    <mathinput prefill="2" name="numbertoselect2"/>
    <mathinput prefill="10" name="maxnum2"/>
    <p><aslist>
    <selectfromsequence name="sample2" withReplacement length="$maxnum2" numbertoselect="$numbertoselect2" />
    </aslist></p>
    <p><copy prop="value" target="maxnum2" assignNames="maxnum2a" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let sample1numbers, sample2numbers;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let sample1replacements = stateVariables['/sample1'].replacements;
      let sample2replacements = stateVariables['/sample2'].replacements;
      expect(sample1replacements.length).eq(5);
      expect(sample2replacements.length).eq(2);
      sample1numbers = sample1replacements.map(x => stateVariables[x.componentName].stateValues.value);
      sample2numbers = sample2replacements.map(x => stateVariables[x.componentName].stateValues.value);

      for (let num of sample1numbers) {
        expect([1, 2, 3].includes(num)).eq(true);
      }
      for (let num of sample2numbers) {
        expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(num)).eq(true);
      }

    });

    cy.log("Nothing changes when change mathinputs");
    cy.get('#\\/numbertoselect textarea').type(`{end}{backspace}7{enter}`, { force: true });
    cy.get('#\\/maxnum textarea').type(`{end}{backspace}11{enter}`, { force: true });
    cy.get('#\\/numbertoselect2 textarea').type(`{end}{backspace}15{enter}`, { force: true });
    cy.get('#\\/maxnum2 textarea').type(`{end}{backspace}{backspace}18{enter}`, { force: true });
    cy.get('#\\/maxnum2a').should('contain.text', '18');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let sample1replacements = stateVariables['/sample1'].replacements;
      let sample2replacements = stateVariables['/sample2'].replacements;

      expect(sample1replacements.map(x => stateVariables[x.componentName].stateValues.value)).eqls(sample1numbers)
      expect(sample2replacements.map(x => stateVariables[x.componentName].stateValues.value)).eqls(sample2numbers)


    })
  });

  it("select doesn't resample in dynamic map", () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    How many numbers do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnames="a b c d e f">
      <template newNamespace>
        <selectfromsequence assignnames="n" to="100" />
      </template>
      <sources>
      <sequence length="$_mathinput1" />
      </sources>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist><copy target="_map1" /></aslist></p>
    <p name="p3"><copy target="_aslist1" /></p>

    <copy name="p4" target="p1" />
    <copy name="p5" target="p2" />
    <copy name="p6" target="p3" />

    <copy name="p7" target="p4" />
    <copy name="p8" target="p5" />
    <copy name="p9" target="p6" />
    <p><copy prop="value" target="_mathinput1" assignNames="m1" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let samplednumbers = [];

    cy.log("initially nothing")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
    });

    cy.log("sample one variable");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}1{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '1')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      samplednumbers.push(n1);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      for (let ind = 0; ind < 1; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '0')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
    });

    cy.log("get same number back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}1{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '1')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(1);

      for (let ind = 0; ind < 1; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("get two more samples");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}3{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '3')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      let n2 = stateVariables['/b/n'].stateValues.value;
      let n3 = stateVariables['/c/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      samplednumbers.push(n2);
      samplednumbers.push(n3);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(3);
      for (let ind = 0; ind < 3; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '0')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
    });


    cy.log("get first two numbers back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}2{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '2')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      let n2 = stateVariables['/b/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(2);

      for (let ind = 0; ind < 2; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("get six total samples");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}6{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '6')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      let n2 = stateVariables['/b/n'].stateValues.value;
      let n3 = stateVariables['/c/n'].stateValues.value;
      let n4 = stateVariables['/d/n'].stateValues.value;
      let n5 = stateVariables['/e/n'].stateValues.value;
      let n6 = stateVariables['/f/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      samplednumbers.push(n4);
      samplednumbers.push(n5);
      samplednumbers.push(n6);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '0')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(0);
    });

    cy.log("get all six back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}6{enter}`, { force: true });
    cy.get('#\\/m1').should('contain.text', '6')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/a/n'].stateValues.value;
      let n2 = stateVariables['/b/n'].stateValues.value;
      let n3 = stateVariables['/c/n'].stateValues.value;
      let n4 = stateVariables['/d/n'].stateValues.value;
      let n5 = stateVariables['/e/n'].stateValues.value;
      let n6 = stateVariables['/f/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      expect(n4).eq(samplednumbers[3]);
      expect(n5).eq(samplednumbers[4]);
      expect(n6).eq(samplednumbers[5]);
      expect(stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      expect(stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(stateVariables[stateVariables[stateVariables['/p1'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p2'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables['/p3'].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p4'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p5'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p6'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p7'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p8'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
        expect(stateVariables[stateVariables[stateVariables[stateVariables['/p9'].replacements[0].componentName].activeChildren[0].componentName].activeChildren[ind].componentName].stateValues.value).eq(samplednumbers[ind]);
      }
    })

  });

  it('select single math, assign name', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><selectfromsequence type="math" from="x" step="y" length="3" assignnames="u"/></p>
    <p><selectfromsequence type="math" from="x" step="y" length="3" assignnames="v"/></p>
    <p><selectfromsequence type="math" from="x" step="y" length="3" assignnames="w"/></p>
    <p><copy name="u2" target="u" /></p>
    <p><copy name="v2" target="v" /></p>
    <p><copy name="w2" target="w" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let options = [
      me.fromText("x"),
      me.fromText("x+y"),
      me.fromText("x+2y"),
    ];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables['/u'];
      let u2 = stateVariables[stateVariables['/u2'].replacements[0].componentName];
      let comparisons = options.map(el => el.equals(me.fromAst(u.stateValues.value)));
      expect(comparisons.includes(true)).eq(true);
      expect(u.stateValues.value).eqls(u2.stateValues.value);

      let v = stateVariables['/v'];
      let v2 = stateVariables[stateVariables['/v2'].replacements[0].componentName];
      comparisons = options.map(el => el.equals(me.fromAst(v.stateValues.value)));
      expect(comparisons.includes(true)).eq(true);
      expect(v.stateValues.value).eqls(v2.stateValues.value);

      let w = stateVariables['/w'];
      let w2 = stateVariables[stateVariables['/w2'].replacements[0].componentName];
      comparisons = options.map(el => el.equals(me.fromAst(w.stateValues.value)));
      expect(comparisons.includes(true)).eq(true);
      expect(w.stateValues.value).eqls(w2.stateValues.value);

    })

  });

  it('select multiple maths, assign names', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <p><aslist>
      <selectfromsequence name="s" type="math" from="x" step="y" length="3" assignnames="u v w" numbertoselect="6" withReplacement />
    </aslist></p>
    <p><copy name="u2" target="u" /></p>
    <p><copy name="v2" target="v" /></p>
    <p><copy name="w2" target="w" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let options = [
      me.fromText("x"),
      me.fromText("x+y"),
      me.fromText("x+2y"),
    ];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables['/u'];
      let u2 = stateVariables[stateVariables['/u2'].replacements[0].componentName];
      let comparisons = options.map(el => el.equals(me.fromAst(u.stateValues.value)));
      expect(comparisons.includes(true)).eq(true);
      expect(u.stateValues.value).eqls(u2.stateValues.value);

      let v = stateVariables['/v'];
      let v2 = stateVariables[stateVariables['/v2'].replacements[0].componentName];
      comparisons = options.map(el => el.equals(me.fromAst(v.stateValues.value)));
      expect(comparisons.includes(true)).eq(true);
      expect(v.stateValues.value).eqls(v2.stateValues.value);

      let w = stateVariables['/w'];
      let w2 = stateVariables[stateVariables['/w2'].replacements[0].componentName];
      comparisons = options.map(el => el.equals(me.fromAst(w.stateValues.value)));
      expect(comparisons.includes(true)).eq(true);
      expect(w.stateValues.value).eqls(w2.stateValues.value);

      let s = stateVariables['/s'];
      for (let ind = 3; ind < 6; ind++) {
        let r = stateVariables[s.replacements[ind].componentName];
        comparisons = options.map(el => el.equals(me.fromAst(r.stateValues.value)));
        expect(comparisons.includes(true)).eq(true);
      }
    })

  });

  it('select multiple maths, assign names, new namespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <p><aslist>
      <selectfromsequence name="s" newnamespace type="math" from="x" step="y" length="3" assignnames="u v w" numbertoselect="6" withReplacement />
    </aslist></p>
    <p><copy name="u2" target="s/u" /></p>
    <p><copy name="v2" target="s/v" /></p>
    <p><copy name="w2" target="s/w" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let options = [
      me.fromText("x"),
      me.fromText("x+y"),
      me.fromText("x+2y"),
    ];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables['/s/u'];
      let u2 = stateVariables[stateVariables['/u2'].replacements[0].componentName];
      let comparisons = options.map(el => el.equals(me.fromAst(u.stateValues.value)));
      expect(comparisons.includes(true)).eq(true);
      expect(u.stateValues.value).eqls(u2.stateValues.value);

      let v = stateVariables['/s/v'];
      let v2 = stateVariables[stateVariables['/v2'].replacements[0].componentName];
      comparisons = options.map(el => el.equals(me.fromAst(v.stateValues.value)));
      expect(comparisons.includes(true)).eq(true);
      expect(v.stateValues.value).eqls(v2.stateValues.value);

      let w = stateVariables['/s/w'];
      let w2 = stateVariables[stateVariables['/w2'].replacements[0].componentName];
      comparisons = options.map(el => el.equals(me.fromAst(w.stateValues.value)));
      expect(comparisons.includes(true)).eq(true);
      expect(w.stateValues.value).eqls(w2.stateValues.value);

      let s = stateVariables['/s'];
      for (let ind = 3; ind < 6; ind++) {
        let r = stateVariables[s.replacements[ind].componentName];
        comparisons = options.map(el => el.equals(me.fromAst(r.stateValues.value)));
        expect(comparisons.includes(true)).eq(true);
      }
    })

  });

  it('selectfromsequence with hide will hide replacements', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <p>Selectfromsequences and hide</p>
      <p><selectfromsequence type="letters" assignnames="c" from="a" to="e" />, <selectfromsequence type="letters" assignnames="d" from="a" to="e" hide /></p>
      <p><copy target="c" />, <copy hide="false" target="d" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_p1').should('have.text', "Selectfromsequences and hide");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c = await stateVariables['/c'].stateValues.value;
      let d = await stateVariables['/d'].stateValues.value;
      expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
      expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

      cy.get(`#\\/_p2`).should('have.text', `${c}, `)
      cy.get(`#\\/_p3`).should('have.text', `${c}, ${d}`)

    })
  });

  it('select multiple numbers with excludecombinations, adjust for round-off error', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample1" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample2" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample3" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample4" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample5" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample6" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample7" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample8" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample9" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample10" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample11" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample12" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample13" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample14" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample15" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample16" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample17" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample18" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample19" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample20" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [[0.1, 0.2], [0.2, 0.1], [0.3, 0.2]];
    let foundCombination = [false, false, false];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let x1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let x2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;

        let combination = -1;
        for (let [ind, comb] of allowedCombinations.entries()) {
          if (Math.abs(comb[0] - x1) < 1E-14 && Math.abs(comb[1] - x2) < 1E-14) {
            combination = ind;
          }
        }

        expect(combination).not.eq(-1)

        foundCombination[combination] = true;

      }

      for (let i = 0; i < 3; i++) {
        expect(foundCombination[i]).be.true;
      }
    })
  });

  it('select multiple math with excludecombinations, adjust for round-off error', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample1" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample2" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample3" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample4" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample5" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample6" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample7" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample8" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample9" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample10" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample11" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample12" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample13" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample14" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample15" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample16" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample17" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample18" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample19" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="0.1" to="0.3" step="0.1" numbertoselect="2" name="sample20" excludecombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [[0.1, 0.2], [0.2, 0.1], [0.3, 0.2]];
    let foundCombination = [false, false, false];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let x1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let x2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;

        let combination = -1;
        for (let [ind, comb] of allowedCombinations.entries()) {
          if (Math.abs(comb[0] - x1) < 1E-14 && Math.abs(comb[1] - x2) < 1E-14) {
            combination = ind;
          }
        }

        expect(combination).not.eq(-1)

        foundCombination[combination] = true;

      }

      for (let i = 0; i < 3; i++) {
        expect(foundCombination[i]).be.true;
      }
    })
  });

  it('select multiple maths with excludes and excludecombinations', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample1" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample2" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample3" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample4" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample5" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample6" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample7" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample8" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample9" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample10" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample11" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample12" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample13" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample14" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample15" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample16" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample17" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample18" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample19" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample20" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [[me.fromText('x'), me.fromText('x+3y')], [me.fromText('x+y'), me.fromText('x')], [me.fromText('x+3y'), me.fromText('x+y')]];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let x1 = me.fromAst(stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value);
        let x2 = me.fromAst(stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value);

        expect(allowedCombinations.some(v => v[0].equals(x1) && v[1].equals(x2))).eq(true);
      }
    })
  });

  it('select multiple maths with excludes and excludecombinations, as copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist name="ec">x x+y</mathlist>
    <math name="e1">x+y</math>
    <math name="e2">x+3y</math>
    <math name="e3">x</math>
    <mathlist name="ec2">x x+y</mathlist>
    <mathlist name="ec3">x+y x+3y</mathlist>

    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample1" excludecombinations="$ec ($e1 x+3y) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample2" excludecombinations="$ec2 $ec3 (x+3y $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample3" excludecombinations="$ec ($e1 x+3y) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample4" excludecombinations="$ec2 $ec3 (x+3y $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample5" excludecombinations="$ec ($e1 x+3y) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample6" excludecombinations="$ec2 $ec3 (x+3y $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample7" excludecombinations="$ec ($e1 x+3y) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample8" excludecombinations="$ec2 $ec3 (x+3y $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample9" excludecombinations="$ec ($e1 x+3y) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample10" excludecombinations="$ec2 $ec3 (x+3y $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample11" excludecombinations="$ec ($e1 x+3y) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample12" excludecombinations="$ec2 $ec3 (x+3y $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample13" excludecombinations="$ec ($e1 x+3y) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample14" excludecombinations="$ec2 $ec3 (x+3y $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample15" excludecombinations="$ec ($e1 x+3y) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample16" excludecombinations="$ec2 $ec3 (x+3y $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample17" excludecombinations="$ec ($e1 x+3y) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample18" excludecombinations="$ec2 $ec3 (x+3y $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample19" excludecombinations="$ec ($e1 x+3y) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y" numbertoselect="2" name="sample20" excludecombinations="$ec2 $ec3 (x+3y $e3)" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [[me.fromText('x'), me.fromText('x+3y')], [me.fromText('x+y'), me.fromText('x')], [me.fromText('x+3y'), me.fromText('x+y')]];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let x1 = me.fromAst(stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value);
        let x2 = me.fromAst(stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value);

        expect(allowedCombinations.some(v => v[0].equals(x1) && v[1].equals(x2))).eq(true);
      }
    })
  });

  it('select multiple maths with excludes and excludecombinations, exclude extras', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample1" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample2" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample3" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample4" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample5" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample6" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample7" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample8" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample9" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample10" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample11" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample12" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample13" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample14" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample15" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample16" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample17" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample18" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample19" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" length="4" exclude="x+2y 2z q y" numbertoselect="2" name="sample20" excludecombinations="(x x+y) (x+y x+3y) (x+3y x)" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [[me.fromText('x'), me.fromText('x+3y')], [me.fromText('x+y'), me.fromText('x')], [me.fromText('x+3y'), me.fromText('x+y')]];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let x1 = me.fromAst(stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value);
        let x2 = me.fromAst(stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value);

        expect(allowedCombinations.some(v => v[0].equals(x1) && v[1].equals(x2))).eq(true);
      }
    })
  });

  it('select multiple letters with excludes and excludecombinations', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample1" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample2" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample3" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample4" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample5" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample6" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample7" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample8" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample9" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample10" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample11" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample12" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample13" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample14" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample15" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample16" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample17" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample18" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample19" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample20" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [['m', 's'], ['s', 'v'], ['v', 'm']];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let x1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let x2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;

        expect(allowedCombinations.some(v => v[0] === x1 && v[1] === x2)).eq(true);
      }
    })
  });

  it('select multiple letters with excludes and excludecombinations, as copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textlist name="ec">m v</textlist>
    <text name="e1">s</text>
    <text name="e2">v</text>
    <text name="e3">s</text>
    <textlist name="ec2">m v</textlist>
    <textlist name="ec3">s m</textlist>

    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample1" excludecombinations="$ec ($e1 m) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample2" excludecombinations="$ec2 $ec3 (v $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample3" excludecombinations="$ec ($e1 m) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample4" excludecombinations="$ec2 $ec3 (v $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample5" excludecombinations="$ec ($e1 m) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample6" excludecombinations="$ec2 $ec3 (v $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample7" excludecombinations="$ec ($e1 m) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample8" excludecombinations="$ec2 $ec3 (v $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample9" excludecombinations="$ec ($e1 m) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample10" excludecombinations="$ec2 $ec3 (v $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample11" excludecombinations="$ec ($e1 m) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample12" excludecombinations="$ec2 $ec3 (v $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample13" excludecombinations="$ec ($e1 m) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample14" excludecombinations="$ec2 $ec3 (v $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample15" excludecombinations="$ec ($e1 m) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample16" excludecombinations="$ec2 $ec3 (v $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample17" excludecombinations="$ec ($e1 m) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample18" excludecombinations="$ec2 $ec3 (v $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample19" excludecombinations="$ec ($e1 m) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p" numbertoselect="2" name="sample20" excludecombinations="$ec2 $ec3 (v $e3)" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [['m', 's'], ['s', 'v'], ['v', 'm']];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let x1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let x2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;

        expect(allowedCombinations.some(v => v[0] === x1 && v[1] === x2)).eq(true);
      }
    })
  });

  it('select multiple letters with excludes and excludecombinations, exclude extras', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample1" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample2" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample3" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample4" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample5" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample6" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample7" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample8" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample9" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample10" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample11" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample12" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample13" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample14" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample15" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample16" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample17" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample18" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample19" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    <p><aslist><selectfromsequence type="letters" from="m" step="3" length="4" exclude="p q r z a" numbertoselect="2" name="sample20" excludecombinations="(m v) (s m) (v s)" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let allowedCombinations = [['m', 's'], ['s', 'v'], ['v', 'm']];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let x1 = stateVariables[stateVariables['/sample' + ind].replacements[0].componentName].stateValues.value;
        let x2 = stateVariables[stateVariables['/sample' + ind].replacements[1].componentName].stateValues.value;

        expect(allowedCombinations.some(v => v[0] === x1 && v[1] === x2)).eq(true);
      }
    })
  });

  it('select numbers and sort', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence numbertoselect="20" sortresults="true" withreplacement="true" from="-20" to="20" /></aslist></p>

    <p><copy target="_aslist1" /></p>
    <copy target="_p1" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let lastnumber = -20;
      let originalnumbers = stateVariables['/_selectfromsequence1'].replacements.map(x => stateVariables[x.componentName]);
      let secondnumbers = stateVariables[stateVariables['/_copy1'].replacements[0].componentName].activeChildren.map(x => stateVariables[x.componentName]);
      let thirdnumbers = stateVariables[stateVariables[stateVariables['/_copy2'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName]);
      for (let i = 0; i < 20; i++) {
        let newnumber = originalnumbers[i].stateValues.value;
        expect(newnumber).gte(lastnumber);
        lastnumber = newnumber;
        expect(secondnumbers[i].stateValues.value).eq(newnumber);
        expect(thirdnumbers[i].stateValues.value).eq(newnumber);
      }
    });

  });

  it('select letters and sort', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence type="letters" numbertoselect="40" sortresults="true" withreplacement="true" from="a" to="bz" /></aslist></p>

    <p><copy target="_aslist1" /></p>
    <copy target="_p1" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let lastletter = 'a';
      let originalletters = stateVariables['/_selectfromsequence1'].replacements.map(x => stateVariables[x.componentName]);
      let secondletters = stateVariables[stateVariables['/_copy1'].replacements[0].componentName].activeChildren.map(x => stateVariables[x.componentName]);
      let thirdletters = stateVariables[stateVariables[stateVariables['/_copy2'].replacements[0].componentName].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName]);
      for (let i = 0; i < 20; i++) {
        let newletter = originalletters[i].stateValues.value;
        expect(newletter.length).gte(lastletter.length);
        expect(newletter.length > lastletter.length || newletter >= lastletter).to.be.true;
        lastletter = newletter;
        expect(secondletters[i].stateValues.value).eq(newletter);
        expect(thirdletters[i].stateValues.value).eq(newletter);
      }
    });

  });

  it('selectfromsequence hides dynamically', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" label="Hide first select" />
    <booleaninput name='h2' prefill="true" label="Hide second select" />
    <p><selectfromsequence assignnames="c" hide="$h1" type="letters" from="a" to="e"/>, <selectfromsequence assignnames="d" hide="$h2" type="letters" from="a" to="e"/></p>
    <p><copy target="c" />, <copy target="d" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c = await stateVariables['/c'].stateValues.value;
      let d = await stateVariables['/d'].stateValues.value;
      expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
      expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

      cy.get(`#\\/_p1`).should('have.text', `${c}, `)
      cy.get(`#\\/_p2`).should('have.text', `${c}, ${d}`)

      cy.get('#\\/h1_input').click();
      cy.get('#\\/h2_input').click();

      cy.get(`#\\/_p1`).should('have.text', `, ${d}`)
      cy.get(`#\\/_p2`).should('have.text', `${c}, ${d}`)

      cy.get('#\\/h1_input').click();
      cy.get('#\\/h2_input').click();

      cy.get(`#\\/_p1`).should('have.text', `${c}, `)
      cy.get(`#\\/_p2`).should('have.text', `${c}, ${d}`)

    })
  });

  it('selectfromsequence defaults to fixed', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <booleaninput name='f1' prefill="false" label="Fix first select" />
    <booleaninput name='f2' prefill="true" label="Fix second select" />
    <p>
      <selectfromsequence assignnames="a" type="letters" from="a" to="e"/>
      <selectfromsequence assignnames="b" fixed="$f1" type="letters" from="a" to="e"/>
      <selectfromsequence assignnames="c" fixed="$f2" type="letters" from="a" to="e"/>
    </p>
    <p>
      <copy target="a" assignNames="a2" /> 
      <copy target="b" assignNames="b2" />
      <copy target="c" assignNames="c2" />
    </p>
    <p>
      <textinput name="a3" bindValueTo="$a" />
      <textinput name="b3" bindValueTo="$b" />
      <textinput name="c3" bindValueTo="$c" />
    </p>
    <p>
      <textinput name="a4" bindValueTo="$a2" />
      <textinput name="b4" bindValueTo="$b2" />
      <textinput name="c4" bindValueTo="$c2" />
    </p>
    <p>
      <copy prop="fixed" target="a" assignNames="af" />
      <copy prop="fixed" target="b" assignNames="bf" />
      <copy prop="fixed" target="c" assignNames="cf" />
    </p>
    <p>
      <copy prop="fixed" target="a2" assignNames="a2f" />
      <copy prop="fixed" target="b2" assignNames="b2f" />
      <copy prop="fixed" target="c2" assignNames="c2f" />
    </p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let a = stateVariables['/a'].stateValues.value;
      let b = stateVariables['/b'].stateValues.value;
      let c = stateVariables['/c'].stateValues.value;
      expect(["a", "b", "c", "d", "e"].includes(a)).eq(true);
      expect(["a", "b", "c", "d", "e"].includes(b)).eq(true);
      expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);

      cy.get('#\\/a').should('have.text', a)
      cy.get('#\\/b').should('have.text', b)
      cy.get('#\\/c').should('have.text', c)
      cy.get('#\\/a2').should('have.text', a)
      cy.get('#\\/b2').should('have.text', b)
      cy.get('#\\/c2').should('have.text', c)

      cy.get('#\\/af').should('have.text', "true")
      cy.get('#\\/bf').should('have.text', "false")
      cy.get('#\\/cf').should('have.text', "true")
      cy.get('#\\/a2f').should('have.text', "true")
      cy.get('#\\/b2f').should('have.text', "false")
      cy.get('#\\/c2f').should('have.text', "true")


      cy.get('#\\/a3_input').clear().type("f{enter}")
      cy.get('#\\/b3_input').clear().type("g{enter}")
      cy.get('#\\/c3_input').clear().type("h{enter}")

      cy.get('#\\/a').should('have.text', a)
      cy.get('#\\/b').should('have.text', "g")
      cy.get('#\\/c').should('have.text', c)
      cy.get('#\\/a2').should('have.text', a)
      cy.get('#\\/b2').should('have.text', "g")
      cy.get('#\\/c2').should('have.text', c)

      cy.get('#\\/a4_input').clear().type("i{enter}")
      cy.get('#\\/b4_input').clear().type("j{enter}")
      cy.get('#\\/c4_input').clear().type("k{enter}")

      cy.get('#\\/a').should('have.text', a)
      cy.get('#\\/b').should('have.text', "j")
      cy.get('#\\/c').should('have.text', c)
      cy.get('#\\/a2').should('have.text', a)
      cy.get('#\\/b2').should('have.text', "j")
      cy.get('#\\/c2').should('have.text', c)

      cy.get('#\\/f1_input').click();
      cy.get('#\\/f2_input').click();

      cy.get('#\\/af').should('have.text', "true")
      cy.get('#\\/bf').should('have.text', "true")
      cy.get('#\\/cf').should('have.text', "false")
      cy.get('#\\/a2f').should('have.text', "true")
      cy.get('#\\/b2f').should('have.text', "true")
      cy.get('#\\/c2f').should('have.text', "false")

      cy.get('#\\/a3_input').clear().type("l{enter}")
      cy.get('#\\/b3_input').clear().type("m{enter}")
      cy.get('#\\/c3_input').clear().type("n{enter}")

      cy.get('#\\/a').should('have.text', a)
      cy.get('#\\/b').should('have.text', "j")
      cy.get('#\\/c').should('have.text', "n")
      cy.get('#\\/a2').should('have.text', a)
      cy.get('#\\/b2').should('have.text', "j")
      cy.get('#\\/c2').should('have.text', "n")


      cy.get('#\\/a4_input').clear().type("o{enter}")
      cy.get('#\\/b4_input').clear().type("p{enter}")
      cy.get('#\\/c4_input').clear().type("q{enter}")

      cy.get('#\\/a').should('have.text', a)
      cy.get('#\\/b').should('have.text', "j")
      cy.get('#\\/c').should('have.text', "q")
      cy.get('#\\/a2').should('have.text', a)
      cy.get('#\\/b2').should('have.text', "j")
      cy.get('#\\/c2').should('have.text', "q")


    })
  });

  it('numberToSelect from selectfromsequence', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>n1 = <selectFromSequence from="1" to="5" assignNames="n1" /></p>
    <p>nums = <aslist><selectFromSequence name="nums1" from="1" to="10" numberToSelect="$n1" assignNames="a1 b1 c1 d1 e1" /></aslist></p>
    <p name="p1">a1=$a1, b1=$b1, c1=$c1, d1=$d1, e1=$e1</p>

    <p>n2 = <selectFromSequence from="1" to="5" assignNames="n2" /></p>
    <p>nums = <aslist><selectFromSequence name="nums2" from="1" to="10" numberToSelect="$n2" assignNames="a2 b2 c2 d2 e2" /></aslist></p>
    <p name="p2">a2=$a2, b2=$b2, c2=$c2, d2=$d2, e2=$e2</p>

    <p>n3 = <selectFromSequence from="1" to="5" assignNames="n3" /></p>
    <p>nums = <aslist><selectFromSequence name="nums3" from="1" to="10" numberToSelect="$n3" assignNames="a3 b3 c3 d3 e3" /></aslist></p>
    <p name="p3">a3=$a3, b3=$b3, c3=$c3, d3=$d3, e3=$e3</p>

    <p>n4 = <selectFromSequence from="1" to="5" assignNames="n4" /></p>
    <p>nums = <aslist><selectFromSequence name="nums4" from="1" to="10" numberToSelect="$n4" assignNames="a4 b4 c4 d4 e4" /></aslist></p>
    <p name="p4">a4=$a4, b4=$b4, c4=$c4, d4=$d4, e4=$e4</p>

    <p>n5 = <selectFromSequence from="1" to="5" assignNames="n5" /></p>
    <p>nums = <aslist><selectFromSequence name="nums5" from="1" to="10" numberToSelect="$n5" assignNames="a5 b5 c5 d5 e5" /></aslist></p>
    <p name="p5">a5=$a5, b5=$b5, c5=$c5, d5=$d5, e5=$e5</p>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables['/n1'].stateValues.value;
      let n2 = stateVariables['/n2'].stateValues.value;
      let n3 = stateVariables['/n3'].stateValues.value;
      let n4 = stateVariables['/n4'].stateValues.value;
      let n5 = stateVariables['/n5'].stateValues.value;

      let nums1 = stateVariables['/nums1'].replacements.map(x => stateVariables[x.componentName].stateValues.value);
      let nums2 = stateVariables['/nums2'].replacements.map(x => stateVariables[x.componentName].stateValues.value);
      let nums3 = stateVariables['/nums3'].replacements.map(x => stateVariables[x.componentName].stateValues.value);
      let nums4 = stateVariables['/nums4'].replacements.map(x => stateVariables[x.componentName].stateValues.value);
      let nums5 = stateVariables['/nums5'].replacements.map(x => stateVariables[x.componentName].stateValues.value);

      expect(nums1.length).eq(n1);
      expect(nums2.length).eq(n2);
      expect(nums3.length).eq(n3);
      expect(nums4.length).eq(n4);
      expect(nums5.length).eq(n5);

      nums1.length = 5;
      nums2.length = 5;
      nums3.length = 5;
      nums4.length = 5;
      nums5.length = 5;

      nums1.fill('', n1)
      nums2.fill('', n2)
      nums3.fill('', n3)
      nums4.fill('', n4)
      nums5.fill('', n5)


      let l = ["a", "b", "c", "d", "e"]

      cy.get('#\\/p1').should('have.text', nums1.map((v, i) => `${l[i]}1=${v}`).join(', '))
      cy.get('#\\/p2').should('have.text', nums2.map((v, i) => `${l[i]}2=${v}`).join(', '))
      cy.get('#\\/p3').should('have.text', nums3.map((v, i) => `${l[i]}3=${v}`).join(', '))
      cy.get('#\\/p4').should('have.text', nums4.map((v, i) => `${l[i]}4=${v}`).join(', '))
      cy.get('#\\/p5').should('have.text', nums5.map((v, i) => `${l[i]}5=${v}`).join(', '))

    })
  });


})