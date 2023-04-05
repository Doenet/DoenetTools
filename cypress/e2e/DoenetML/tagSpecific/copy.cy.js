import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`
  } else {
    return String(n);
  }
}

describe('Copy Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })

  it('copy copies properties', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <copy assignNames="a" source="_math1"/>
    <copy assignNames="b" source="a"/>
    <math modifyIndirectly="true">x</math>
    <copy assignNames="c" source="_math2"/>
    <copy assignNames="d" source="c"/>
    <point><label>A</label>(1,2)</point>
    <copy assignNames="e" source="_point1"/>
    <copy assignNames="f" source="e"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/a'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/b'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/_math2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/c'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/d'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/_point1'].stateValues.label).eq("A");
      expect(stateVariables['/e'].stateValues.label).eq("A");
      expect(stateVariables['/f'].stateValues.label).eq("A");

    })

  });

  it('copy copies properties, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <math modifyIndirectly="true">x</math>
    <math name="a" copySource="_math1"/>
    <math name="b" copySource="a"/>
    <math name="c" copySource="_math2"/>
    <math name="d" copySource="c"/>
    <point><label>A</label>(1,2)</point>
    <point name="e" copySource="_point1"/>
    <point name="f" copySource="e"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/a'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/b'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/_math2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/c'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/d'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/_point1'].stateValues.label).eq("A");
      expect(stateVariables['/e'].stateValues.label).eq("A");
      expect(stateVariables['/f'].stateValues.label).eq("A");

    })

  });

  it('copy overwrites properties', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <copy name="cr1" assignNames="r1" source="_math1"/>
    <copy name="cr2" assignNames="r2" modifyIndirectly="true" source="_math1"/>
    <copy name="cr3" assignNames="r3" modifyIndirectly="true" source="cr1"/>
    <copy name="cr4" assignNames="r4" source="cr2"/>
    <copy name="cr5" assignNames="r5" source="cr3"/>
    <copy name="cr6" assignNames="r6" source="cr2" modifyIndirectly="false" />
    <copy name="cr7" assignNames="r7" source="cr3" modifyIndirectly="false" />

    <point labelIsName name="A">(1,2)</point>
    <copy name="cA2" assignNames="A2" source="A"/>
    <copy name="cB" assignNames="B" source="A" labelIsName />
    <copy name="cB2" assignNames="B2" source="A" />
    <copy name="cC" assignNames="C" source="cB" labelIsName/>
    <copy name="cC2" assignNames="C2" source="cB"/>
    <copy name="cC3" assignNames="C3" source="B" labelIsName/>
    <copy name="cC4" assignNames="C4" source="B"/>
    <copy name="cD" assignNames="D" source="cC" labelIsName/>
    <copy name="cD2" assignNames="D2" source="cC"/>
    <copy name="cD3" assignNames="D3" source="C" labelIsName/>
    <copy name="cD4" assignNames="D4" source="C"/>
    <copy name="cD5" assignNames="D5" source="cC2" labelIsName/>
    <copy name="cD6" assignNames="D6" source="cC2"/>
    <copy name="cD7" assignNames="D7" source="C2" labelIsName/>
    <copy name="cD8" assignNames="D8" source="C2"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r3'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r4'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r5'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r6'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r7'].stateValues.modifyIndirectly).eq(false);

      expect(stateVariables['/A'].stateValues.label).eq("A");
      expect(stateVariables['/A2'].stateValues.label).eq("A");
      expect(stateVariables['/B'].stateValues.label).eq("B");
      expect(stateVariables['/B2'].stateValues.label).eq("A");
      expect(stateVariables['/C'].stateValues.label).eq("C");
      expect(stateVariables['/C2'].stateValues.label).eq("B");
      expect(stateVariables['/C3'].stateValues.label).eq("C3");
      expect(stateVariables['/C4'].stateValues.label).eq("B");
      expect(stateVariables['/D'].stateValues.label).eq("D");
      expect(stateVariables['/D2'].stateValues.label).eq("C");
      expect(stateVariables['/D3'].stateValues.label).eq("D3");
      expect(stateVariables['/D4'].stateValues.label).eq("C");
      expect(stateVariables['/D5'].stateValues.label).eq("D5");
      expect(stateVariables['/D6'].stateValues.label).eq("B");
      expect(stateVariables['/D7'].stateValues.label).eq("D7");
      expect(stateVariables['/D8'].stateValues.label).eq("B");

    })
  });

  it('copy overwrites properties, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <math name="r1" copySource="_math1"/>
    <math name="r2" modifyIndirectly="true" copySource="_math1"/>
    <math name="r3" modifyIndirectly="true" copySource="r1"/>
    <math name="r4" copySource="r2"/>
    <math name="r5" copySource="r3"/>
    <math name="r6" copySource="r2" modifyIndirectly="false" />
    <math name="r7" copySource="r3" modifyIndirectly="false" />

    <point labelIsName name="A">(1,2)</point>
    <point name="A2"><label>A</label>(1,2)</point>
    <point name="A3" copySource="A"/>
    <point name="A4" copySource="A2"/>
    <point labelIsName name="B" copySource="A"/>
    <point name="B2" copySource="A"/>
    <point name="B3" copySource="A"><label>B</label></point>
    <point labelIsName name="B4" copySource="A2"/>
    <point name="B5" copySource="A2"/>
    <point name="B6" copySource="A2"><label>B</label></point>
    <point labelIsName name="C" copySource="B"/>
    <point name="C2" copySource="B"/>
    <point name="C3" copySource="B"><label>C</label></point>
    <point labelIsName name="C4" copySource="B2"/>
    <point name="C5" copySource="B2"/>
    <point name="C6" copySource="B2"><label>C</label></point>
    <point labelIsName name="C7" copySource="B3"/>
    <point name="C8" copySource="B3"/>
    <point name="C9" copySource="B3"><label>C</label></point>
    <point labelIsName name="C10" copySource="B4"/>
    <point name="C11" copySource="B4"/>
    <point name="C12" copySource="B4"><label>C</label></point>
    <point labelIsName name="C13" copySource="B5"/>
    <point name="C14" copySource="B5"/>
    <point name="C15" copySource="B5"><label>C</label></point>
    <point labelIsName name="C16" copySource="B6"/>
    <point name="C17" copySource="B6"/>
    <point name="C18" copySource="B6"><label>C</label></point>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r3'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r4'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r5'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r6'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r7'].stateValues.modifyIndirectly).eq(false);

      expect(stateVariables['/A'].stateValues.label).eq("A");
      expect(stateVariables['/A2'].stateValues.label).eq("A");
      expect(stateVariables['/A3'].stateValues.label).eq("A");
      expect(stateVariables['/A4'].stateValues.label).eq("A");
      expect(stateVariables['/B'].stateValues.label).eq("B");
      expect(stateVariables['/B2'].stateValues.label).eq("A");
      expect(stateVariables['/B3'].stateValues.label).eq("B");
      expect(stateVariables['/B4'].stateValues.label).eq("B4");
      expect(stateVariables['/B5'].stateValues.label).eq("A");
      expect(stateVariables['/B6'].stateValues.label).eq("B");
      expect(stateVariables['/C'].stateValues.label).eq("C");
      expect(stateVariables['/C2'].stateValues.label).eq("B");
      expect(stateVariables['/C3'].stateValues.label).eq("C");
      expect(stateVariables['/C4'].stateValues.label).eq("C4");
      expect(stateVariables['/C5'].stateValues.label).eq("A");
      expect(stateVariables['/C6'].stateValues.label).eq("C");
      expect(stateVariables['/C7'].stateValues.label).eq("C7");
      expect(stateVariables['/C8'].stateValues.label).eq("B");
      expect(stateVariables['/C9'].stateValues.label).eq("C");
      expect(stateVariables['/C10'].stateValues.label).eq("C10");
      expect(stateVariables['/C11'].stateValues.label).eq("B4");
      expect(stateVariables['/C12'].stateValues.label).eq("C");
      expect(stateVariables['/C13'].stateValues.label).eq("C13");
      expect(stateVariables['/C14'].stateValues.label).eq("A");
      expect(stateVariables['/C15'].stateValues.label).eq("C");
      expect(stateVariables['/C16'].stateValues.label).eq("C16");
      expect(stateVariables['/C17'].stateValues.label).eq("B");
      expect(stateVariables['/C18'].stateValues.label).eq("C");

    })
  });

  it('copy overwrites properties, decode XML entities', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="3 &gt; 4">x</math>
    <copy name="cr1" assignNames="r1" source="_math1"/>
    <copy name="cr2" assignNames="r2" modifyIndirectly="3&lt;4" source="_math1"/>
    <copy name="cr3" assignNames="r3" modifyIndirectly="3&lt;4" source="cr1"/>
    <copy name="cr4" assignNames="r4" source="cr2"/>
    <copy name="cr5" assignNames="r5" source="cr3"/>
    <copy name="cr6" assignNames="r6" source="cr2" modifyIndirectly="3&gt;4" />
    <copy name="cr7" assignNames="r7" source="cr3" modifyIndirectly="3&gt;4" />


    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r3'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r4'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r5'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r6'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r7'].stateValues.modifyIndirectly).eq(false);

    })
  });

  it('copy overwrites properties, decode XML entities, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="3 &gt; 4">x</math>
    <math name="r1" copySource="_math1"/>
    <math name="r2" modifyIndirectly="3&lt;4" copySource="_math1"/>
    <math name="r3" modifyIndirectly="3&lt;4" copySource="r1"/>
    <math name="r4" copySource="r2"/>
    <math name="r5" copySource="r3"/>
    <math name="r6" copySource="r2" modifyIndirectly="3&gt;4" />
    <math name="r7" copySource="r3" modifyIndirectly="3&gt;4" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r3'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r4'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r5'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/r6'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/r7'].stateValues.modifyIndirectly).eq(false);

    })
  });

  it('copy props', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <copy assignNames="mr" prop="modifyIndirectly" source="x"/>
    <copy assignNames="mr2" prop="modifyIndirectly" modifyIndirectly="true" source="x"/>

    <copy assignNames="frmt" prop="format" source="x"/>
    <copy assignNames="frmt2" prop="format" source="x" hide />
    <copy assignNames="frmt3" hide source="frmt"/>

    <point name="A" labelIsName>(1,2)</point>
    <copy assignNames="cA" prop="coords" source="A"/>
    <copy assignNames="l" prop="latex" source="cA"/>
    <copy assignNames="lmr" prop="latex" modifyIndirectly="false" source="cA"/>
    <copy assignNames="A2" source="A"/>
    <copy assignNames="cA2" prop="coords" source="A2"/>
    <copy assignNames="l2" prop="latex" source="cA2"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/x'].stateValues.hidden).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables['/mr'].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables['/mr'].stateValues.hidden).eq(false);
      expect(stateVariables['/mr'].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(stateVariables['/mr2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/mr2'].stateValues.hidden).eq(false);
      expect(stateVariables['/mr2'].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables['/frmt'].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables['/frmt'].stateValues.hidden).eq(false);
      expect(stateVariables['/frmt'].stateValues.value).eq("text");

      expect(stateVariables['/frmt2'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/frmt2'].stateValues.hidden).eq(true);
      expect(stateVariables['/frmt2'].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(stateVariables['/frmt3'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/frmt3'].stateValues.value).eq("text");
      expect(stateVariables['/frmt3'].stateValues.hidden).eq(true);

      expect(stateVariables['/A'].stateValues.label).eq("A");
      expect((stateVariables['/cA'].stateValues.value)).eqls(["vector", 1, 2]);
      expect(stateVariables['/l'].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(stateVariables['/l'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/lmr'].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(stateVariables['/lmr'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/A2'].stateValues.label).eq("A");
      expect((stateVariables['/cA2'].stateValues.value)).eqls(["vector", 1, 2]);
      expect(stateVariables['/l2'].stateValues.value).eq("\\left( 1, 2 \\right)");

    })
  });

  it('copy props, dot notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <copy assignNames="mr" source="x.modifyIndirectly"/>
    <copy assignNames="mr2" modifyIndirectly="true" source="x.modifyIndirectly"/>

    <copy assignNames="frmt" source="x.format"/>
    <copy assignNames="frmt2" source="x.format" hide />
    <copy assignNames="frmt3" hide source="frmt"/>

    <point name="A" labelIsName>(1,2)</point>
    <copy assignNames="cA" source="A.coords"/>
    <copy assignNames="l" source="cA.latex"/>
    <copy assignNames="lmr" modifyIndirectly="false" source="cA.latex"/>
    <copy assignNames="A2" source="A"/>
    <copy assignNames="cA2" source="A2.coords"/>
    <copy assignNames="l2" source="cA2.latex"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/x'].stateValues.hidden).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables['/mr'].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables['/mr'].stateValues.hidden).eq(false);
      expect(stateVariables['/mr'].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(stateVariables['/mr2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/mr2'].stateValues.hidden).eq(false);
      expect(stateVariables['/mr2'].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables['/frmt'].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables['/frmt'].stateValues.hidden).eq(false);
      expect(stateVariables['/frmt'].stateValues.value).eq("text");

      expect(stateVariables['/frmt2'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/frmt2'].stateValues.hidden).eq(true);
      expect(stateVariables['/frmt2'].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(stateVariables['/frmt3'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/frmt3'].stateValues.value).eq("text");
      expect(stateVariables['/frmt3'].stateValues.hidden).eq(true);

      expect(stateVariables['/A'].stateValues.label).eq("A");
      expect((stateVariables['/cA'].stateValues.value)).eqls(["vector", 1, 2]);
      expect(stateVariables['/l'].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(stateVariables['/l'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/lmr'].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(stateVariables['/lmr'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/A2'].stateValues.label).eq("A");
      expect((stateVariables['/cA2'].stateValues.value)).eqls(["vector", 1, 2]);
      expect(stateVariables['/l2'].stateValues.value).eq("\\left( 1, 2 \\right)");

    })
  });

  it('copy props, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <boolean name="mr" copyProp="modifyIndirectly" copySource="x"/>
    <boolean name="mr2" copyProp="modifyIndirectly" modifyIndirectly="true" copySource="x"/>

    <text name="frmt" copyProp="format" copySource="x"/>
    <text name="frmt2" copyProp="format" copySource="x" hide />
    <text name="frmt3" hide copySource="frmt"/>

    <point name="A" labelIsName>(1,2)</point>
    <coords name="cA" copyProp="coords" copySource="A"/>
    <text name="l" copyProp="latex" copySource="cA"/>
    <text name="lmr" copyProp="latex" modifyIndirectly="false" copySource="cA"/>
    <point name="A2" copySource="A"/>
    <coords name="cA2" copyProp="coords" copySource="A2"/>
    <text name="l2" copyProp="latex" copySource="cA2"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/x'].stateValues.hidden).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables['/mr'].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables['/mr'].stateValues.hidden).eq(false);
      expect(stateVariables['/mr'].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(stateVariables['/mr2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/mr2'].stateValues.hidden).eq(false);
      expect(stateVariables['/mr2'].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables['/frmt'].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables['/frmt'].stateValues.hidden).eq(false);
      expect(stateVariables['/frmt'].stateValues.value).eq("text");

      expect(stateVariables['/frmt2'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/frmt2'].stateValues.hidden).eq(true);
      expect(stateVariables['/frmt2'].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(stateVariables['/frmt3'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/frmt3'].stateValues.value).eq("text");
      expect(stateVariables['/frmt3'].stateValues.hidden).eq(true);

      expect(stateVariables['/A'].stateValues.label).eq("A");
      expect((stateVariables['/cA'].stateValues.value)).eqls(["vector", 1, 2]);
      expect(stateVariables['/l'].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(stateVariables['/l'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/lmr'].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(stateVariables['/lmr'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/A2'].stateValues.label).eq("A");
      expect((stateVariables['/cA2'].stateValues.value)).eqls(["vector", 1, 2]);
      expect(stateVariables['/l2'].stateValues.value).eq("\\left( 1, 2 \\right)");

    })
  });

  it('copy props, with copySource, dot notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <boolean name="mr" copySource="x.modifyIndirectly"/>
    <boolean name="mr2" modifyIndirectly="true" copySource="x.modifyIndirectly"/>

    <text name="frmt" copySource="x.format"/>
    <text name="frmt2" copySource="x.format" hide />
    <text name="frmt3" hide copySource="frmt"/>

    <point name="A" labelIsName>(1,2)</point>
    <coords name="cA" copySource="A.coords"/>
    <text name="l" copySource="cA.latex"/>
    <text name="lmr" modifyIndirectly="false" copySource="cA.latex"/>
    <point name="A2" copySource="A"/>
    <coords name="cA2" copySource="A2.coords"/>
    <text name="l2" copySource="cA2.latex"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/x'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/x'].stateValues.hidden).eq(true);
      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables['/mr'].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables['/mr'].stateValues.hidden).eq(false);
      expect(stateVariables['/mr'].stateValues.value).eq(false);

      // modifyIndirectly is overwritten
      expect(stateVariables['/mr2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/mr2'].stateValues.hidden).eq(false);
      expect(stateVariables['/mr2'].stateValues.value).eq(false);

      // modifyIndirectly attribute is copied (as it has propagateToProps=true)
      expect(stateVariables['/frmt'].stateValues.modifyIndirectly).eq(false);
      // hide attribute is not copied (default behavior)
      expect(stateVariables['/frmt'].stateValues.hidden).eq(false);
      expect(stateVariables['/frmt'].stateValues.value).eq("text");

      expect(stateVariables['/frmt2'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/frmt2'].stateValues.hidden).eq(true);
      expect(stateVariables['/frmt2'].stateValues.value).eq("text");

      // all attributes copied when don't use prop
      expect(stateVariables['/frmt3'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/frmt3'].stateValues.value).eq("text");
      expect(stateVariables['/frmt3'].stateValues.hidden).eq(true);

      expect(stateVariables['/A'].stateValues.label).eq("A");
      expect((stateVariables['/cA'].stateValues.value)).eqls(["vector", 1, 2]);
      expect(stateVariables['/l'].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(stateVariables['/l'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/lmr'].stateValues.value).eq("\\left( 1, 2 \\right)");
      expect(stateVariables['/lmr'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/A2'].stateValues.label).eq("A");
      expect((stateVariables['/cA2'].stateValues.value)).eqls(["vector", 1, 2]);
      expect(stateVariables['/l2'].stateValues.value).eq("\\left( 1, 2 \\right)");

    })
  });

  it('copy props of copy still updatable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <copy assignNames="p2" source="p1"/>
      <point name="p3">
        (<copy prop="y" source="p2"/>,
        <copy prop="x1" source="p2"/>)
      </point>
    </graph>
    <copy source="p1" assignNames="p1a" />
    <copy source="p2" assignNames="p2a" />
    <copy source="p3" assignNames="p3a" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`initial position`);
    cy.get('#\\/p1a').should("contain.text", "(1,2)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(1);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(2);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(2);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(1);
    })

    cy.log(`move point 1`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: -3, y: 5 }
      });
    })

    cy.get('#\\/p1a').should("contain.text", "(−3,5)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(-3);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(5);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(5);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(-3);
    })

    cy.log(`move point 2`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 6, y: -9 }
      });
    })

    cy.get('#\\/p2a').should("contain.text", "(6,−9)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(6);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-9);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(-9);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(6);
    })

    cy.log(`move point 3`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: -1, y: -7 }
      });
    })

    cy.get('#\\/p3a').should("contain.text", "(−1,−7)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(-7);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-1);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(-1);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(-7);
    })

  });

  it('copy props of copy still updatable, dot notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <copy assignNames="p2" source="p1"/>
      <point name="p3">
        (<copy source="p2.y"/>,
        <copy source="p2.x1"/>)
      </point>
    </graph>
    <copy source="p1" assignNames="p1a" />
    <copy source="p2" assignNames="p2a" />
    <copy source="p3" assignNames="p3a" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`initial position`);
    cy.get('#\\/p1a').should("contain.text", "(1,2)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(1);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(2);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(2);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(1);
    })

    cy.log(`move point 1`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: -3, y: 5 }
      });
    })

    cy.get('#\\/p1a').should("contain.text", "(−3,5)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(-3);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(5);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(5);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(-3);
    })

    cy.log(`move point 2`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 6, y: -9 }
      });
    })

    cy.get('#\\/p2a').should("contain.text", "(6,−9)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(6);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-9);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(-9);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(6);
    })

    cy.log(`move point 3`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: -1, y: -7 }
      });
    })

    cy.get('#\\/p3a').should("contain.text", "(−1,−7)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(-7);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-1);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(-1);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(-7);
    })

  });

  it('copy props of copy still updatable, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <point name="p2" copySource="p1"/>
      <point name="p3">
        (<math copyProp="y" copySource="p2"/>,
        <math copyProp="x1" copySource="p2"/>)
      </point>
    </graph>
    <point copySource="p1" name="p1a" />
    <point copySource="p2" name="p2a" />
    <point copySource="p3" name="p3a" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`initial position`);
    cy.get('#\\/p1a').should("contain.text", "(1,2)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(1);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(2);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(2);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(1);
    })

    cy.log(`move point 1`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: -3, y: 5 }
      });
    })

    cy.get('#\\/p1a').should("contain.text", "(−3,5)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(-3);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(5);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(5);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(-3);
    })

    cy.log(`move point 2`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 6, y: -9 }
      });
    })

    cy.get('#\\/p2a').should("contain.text", "(6,−9)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(6);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-9);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(-9);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(6);
    })

    cy.log(`move point 3`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: -1, y: -7 }
      });
    })

    cy.get('#\\/p3a').should("contain.text", "(−1,−7)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(-7);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-1);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(-1);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(-7);
    })

  });

  it('copy props of copy still updatable, with copySource, dot notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <point name="p2" copySource="p1"/>
      <point name="p3">
        (<math copySource="p2.y"/>,
        <math copySource="p2.x1"/>)
      </point>
    </graph>
    <point copySource="p1" name="p1a" />
    <point copySource="p2" name="p2a" />
    <point copySource="p3" name="p3a" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`initial position`);
    cy.get('#\\/p1a').should("contain.text", "(1,2)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(1);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(2);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(2);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(2);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(1);
    })

    cy.log(`move point 1`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: -3, y: 5 }
      });
    })

    cy.get('#\\/p1a').should("contain.text", "(−3,5)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(-3);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(5);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-3);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(5);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(5);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(-3);
    })

    cy.log(`move point 2`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 6, y: -9 }
      });
    })

    cy.get('#\\/p2a').should("contain.text", "(6,−9)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(6);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(-9);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(6);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-9);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(-9);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(6);
    })

    cy.log(`move point 3`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: -1, y: -7 }
      });
    })

    cy.get('#\\/p3a').should("contain.text", "(−1,−7)")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p1'].stateValues.xs[0]).eq(-7);
      expect(stateVariables['/p1'].stateValues.xs[1]).eq(-1);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(-7);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(-1);
      expect(stateVariables['/p3'].stateValues.xs[0]).eq(-1);
      expect(stateVariables['/p3'].stateValues.xs[1]).eq(-7);
    })

  });

  it.skip('copy invalid prop', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <math>x</math>
    <copy prop="label" source="_math1"/>

    <point />
    <copy source="_point1"/>
    <copy prop="format" source="_ref1"/>

    <copy name="A2" source="A"/>
    <copy name="cA2" prop="coords" source="A2"/>
    <copy name="lcA2" prop="label" source="cA2"/>
    <copy name="llcA2" labelIsName source="cA2"/>

    `}, "*");
    });

    cy.get('#__math1') //wait for page to load


    // How to check if the right errors get thrown for these?

  });

  it('copy of prop copy shadows source', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
    <copy prop="displacement" name="cd1" assignNames="d1" source="_vector1"/>
    </graph>
  
    <graph>
    <copy source="cd1" assignNames="d2" />
    </graph>

    <copy source="_vector1" assignNames="v1a" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`initial positions`);
    cy.window().then(async (win) => {
      let displacement = [-4, 2];
      let v_tail = [1, 1];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
      expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
      expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
      expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
      expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
    })

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [3, 1];
      let v_tail = [-1, 4];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 2`);
    cy.window().then(async (win) => {
      let displacement = [5, -2];
      let v_tail = [-1, 4];
      let d_tail = [3, -7];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d1",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 3`);
    cy.window().then(async (win) => {
      let displacement = [-3, 6];
      let v_tail = [-1, 4];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d2",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [5, 0];
      let v_tail = [-8, 6];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

  });

  it('copy of prop copy shadows source, dot notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
    <copy name="cd1" assignNames="d1" source="_vector1.displacement"/>
    </graph>
  
    <graph>
    <copy source="cd1" assignNames="d2" />
    </graph>

    <copy source="_vector1" assignNames="v1a" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`initial positions`);
    cy.window().then(async (win) => {
      let displacement = [-4, 2];
      let v_tail = [1, 1];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
      expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
      expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
      expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
      expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
    })

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [3, 1];
      let v_tail = [-1, 4];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 2`);
    cy.window().then(async (win) => {
      let displacement = [5, -2];
      let v_tail = [-1, 4];
      let d_tail = [3, -7];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d1",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 3`);
    cy.window().then(async (win) => {
      let displacement = [-3, 6];
      let v_tail = [-1, 4];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d2",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [5, 0];
      let v_tail = [-8, 6];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

  });

  it('copy of prop copy shadows source, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
      <vector copyprop="displacement" name="d1" copySource="_vector1"/>
    </graph>
  
    <graph>
      <vector copySource="d1" name="d2" />
    </graph>

    <vector copySource="_vector1" name="v1a" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`initial positions`);
    cy.window().then(async (win) => {
      let displacement = [-4, 2];
      let v_tail = [1, 1];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
      expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
      expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
      expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
      expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
    })

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [3, 1];
      let v_tail = [-1, 4];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 2`);
    cy.window().then(async (win) => {
      let displacement = [5, -2];
      let v_tail = [-1, 4];
      let d_tail = [3, -7];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d1",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 3`);
    cy.window().then(async (win) => {
      let displacement = [-3, 6];
      let v_tail = [-1, 4];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d2",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [5, 0];
      let v_tail = [-8, 6];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

  });

  it('copy of prop copy shadows source, with copySource, dot notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
      <vector name="d1" copySource="_vector1.displacement"/>
    </graph>
  
    <graph>
      <vector copySource="d1" name="d2" />
    </graph>

    <vector copySource="_vector1" name="v1a" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`initial positions`);
    cy.window().then(async (win) => {
      let displacement = [-4, 2];
      let v_tail = [1, 1];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
      expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
      expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
      expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
      expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
      expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
      expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
      expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
    })

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [3, 1];
      let v_tail = [-1, 4];
      let d_tail = [0, 0];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 2`);
    cy.window().then(async (win) => {
      let displacement = [5, -2];
      let v_tail = [-1, 4];
      let d_tail = [3, -7];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d1",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 3`);
    cy.window().then(async (win) => {
      let displacement = [-3, 6];
      let v_tail = [-1, 4];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/d2",
        args: {
          tailcoords: d_tail,
          headcoords: d_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

    cy.log(`move vector 1`);
    cy.window().then(async (win) => {
      let displacement = [5, 0];
      let v_tail = [-8, 6];
      let d_tail = [4, -2];
      let v_head = displacement.map((x, i) => x + v_tail[i]);
      let d_head = displacement.map((x, i) => x + d_tail[i]);

      win.callAction1({
        actionName: "moveVector",
        componentName: "/_vector1",
        args: {
          tailcoords: v_tail,
          headcoords: v_head,
        }
      });

      cy.get('#\\/v1a').should('contain.text', `(${nInDOM(displacement[0])},${nInDOM(displacement[1])})`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_vector1'].stateValues.tail).eqls([...v_tail]);
        expect(stateVariables['/_vector1'].stateValues.head).eqls([...v_head]);
        expect(stateVariables['/_vector1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d1'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d1'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d1'].stateValues.displacement).eqls([...displacement]);
        expect(stateVariables['/d2'].stateValues.tail).eqls([...d_tail]);
        expect(stateVariables['/d2'].stateValues.head).eqls([...d_head]);
        expect(stateVariables['/d2'].stateValues.displacement).eqls([...displacement]);
      })
    })

  });

  it('property children account for replacement changes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput />

    <p>
      <aslist>
        <sequence type="letters" from="a" length="$_mathinput1" />
      </aslist>
    </p>
    
    <p><copy name="al2" source="_aslist1"/></p>
    <copy assignNames="p2" source="_p1"/>
    
    <p><copy source="al2"/></p>
    <copy source="p2" assignNames="p3"/>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#\\/p2').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#\\/p3').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });


    cy.get('#\\/_mathinput1 textarea').type("2{enter}", { force: true });

    cy.get('#\\/_p1').should('contain.text', 'a, b');

    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#\\/p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#\\/p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}5{enter}", { force: true });
    cy.get('#\\/_p1').should('contain.text', 'a, b, c, d, e');
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#\\/p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#\\/p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/_p1').should('not.contain.text', 'a, b, c, d, e');
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}6{enter}", { force: true });
    cy.get('#\\/_p1').should('contain.text', 'a, b, c, d, e, f');
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#\\/p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#\\/p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });

  });

  it('property children account for replacement changes, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput />

    <p>
      <aslist>
        <sequence type="letters" from="a" length="$_mathinput1" />
      </aslist>
    </p>
    
    <p><aslist name="al2" copySource="_aslist1"/></p>

    <p><aslist copySource="al2"/></p>

    <p name="p2" copySource="_p1"/>
    
    <p copySource="p2" name="p3"/>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#\\/p2').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });
    cy.get('#\\/p3').invoke('text').then((text) => {
      expect(text.trim()).equal('')
    });


    cy.get('#\\/_mathinput1 textarea').type("2{enter}", { force: true });

    cy.get('#\\/_p1').should('contain.text', 'a, b');

    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#\\/p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });
    cy.get('#\\/p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b')
    });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}5{enter}", { force: true });
    cy.get('#\\/_p1').should('contain.text', 'a, b, c, d, e');
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#\\/p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });
    cy.get('#\\/p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e')
    });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/_p1').should('not.contain.text', 'a, b, c, d, e');
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}6{enter}", { force: true });
    cy.get('#\\/_p1').should('contain.text', 'a, b, c, d, e, f');
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#\\/_p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#\\/p2').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#\\/_p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });
    cy.get('#\\/p3').invoke('text').then((text) => {
      expect(text.trim()).equal('a, b, c, d, e, f')
    });

  });

  it('copy macros', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a=<mathinput name="a" prefill="5" /></p>
    <p>b=<mathinput name="b" prefill="2" /></p>
    <p>c=<mathinput name="c" prefill="3" /></p>

    <p name="orig"><m>ax^2+bx+c = <math name="s">$a x^2 + $b x + $c</math></m></p>
    <p name="single"><m>ax^2+bx+c = $s</m></p>
    <p name="double"><m>ax^2+bx+c = $$s</m></p>
    <p name="triple"><m>ax^2+bx+c = $$$s</m></p>
    <p name="singlem">$_m1</p>
    <p name="doublem">$$_m1</p>
    <p name="triplem">$$$_m1</p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/orig').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=5x2+2x+3')
    })
    cy.get('#\\/single').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=5x2+2x+3')
    })
    cy.get('#\\/double').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=$$s')
    })
    cy.get('#\\/triple').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=$$$s')
    })
    cy.get('#\\/singlem').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=5x2+2x+3')
    })
    cy.get('#\\/doublem').should('have.text', '$$_m1');
    cy.get('#\\/triplem').should('have.text', '$$$_m1');


    cy.log('Enter new numbers');
    cy.get('#\\/a textarea').type("{end}{backspace}9{enter}", { force: true })
    cy.get('#\\/b textarea').type("{end}{backspace}6{enter}", { force: true })
    cy.get('#\\/c textarea').type("{end}{backspace}7{enter}", { force: true })

    cy.get('#\\/orig').should('contain.text', 'ax2+bx+c=9x2+6x+7')
    cy.get('#\\/orig').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=9x2+6x+7')
    })
    cy.get('#\\/single').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=9x2+6x+7')
    })
    cy.get('#\\/double').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=$$s')
    })
    cy.get('#\\/triple').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=$$$s')
    })
    cy.get('#\\/singlem').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ax2+bx+c=9x2+6x+7')
    })
    cy.get('#\\/doublem').should('have.text', '$$_m1');
    cy.get('#\\/triplem').should('have.text', '$$$_m1');


  });

  it('macros after failed double macro', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <text name="t">hi</text>
    <text name="u">bye</text>
    <p>$t, $$t, $ $u,
    $t, $$u, $u</p>
    <p>$u, $$t(, $t,
    $u, $$u, $t</p>
    <p>$t, $$$t, $5, $u, $$5, $t, $$$5, $u</p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', "hi, $$t, $ bye,\n    hi, $$u, bye")
    cy.get('#\\/_p2').should('have.text', "bye, $$t(, hi,\n    bye, $$u, hi")
    cy.get('#\\/_p3').should('have.text', "hi, $$$t, $5, bye, $$5, hi, $$$5, bye")
  })

  it('copy ignores hide by default', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Hidden text: <text name="hidden" hide>secret</text></p>
    <p>Revealed by default: $hidden</p>
    <p>Force to stay hidden: <copy source="hidden" sourceAttributesToIgnore="" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', 'Hidden text: ');
    cy.get('#\\/_p2').should('have.text', 'Revealed by default: secret');
    cy.get('#\\/_p3').should('have.text', 'Force to stay hidden: ');


  });

  it('copy ignores hide by default, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Hidden text: <text name="hidden" hide>secret</text></p>
    <p>Revealed by default: <text copySource="hidden" /></p>
    <p>Force to stay hidden: <text copySource="hidden" sourceAttributesToIgnore="" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', 'Hidden text: ');
    cy.get('#\\/_p2').should('have.text', 'Revealed by default: secret');
    cy.get('#\\/_p3').should('have.text', 'Force to stay hidden: ');


  });

  it('copy keeps hidden children hidden', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="theP" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pReveal">Revealed: $(theP/hidden)</p>
    <copy source="theP" assignNames="theP2" />
    <p name="pReveal2">Revealed 2: $(theP2/hidden)</p>


    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/theP').should('have.text', 'Hidden text: ');
    cy.get('#\\/pReveal').should('have.text', 'Revealed: secret');
    cy.get('#\\/theP2').should('have.text', 'Hidden text: ');
    cy.get('#\\/pReveal2').should('have.text', 'Revealed 2: secret');


  });

  it('copy keeps hidden children hidden, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="theP" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pReveal">Revealed: <text copySource="theP/hidden" /></p>
    <p copySource="theP" name="theP2" />
    <p name="pReveal2">Revealed 2: <text copySource="theP2/hidden" /></p>


    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/theP').should('have.text', 'Hidden text: ');
    cy.get('#\\/pReveal').should('have.text', 'Revealed: secret');
    cy.get('#\\/theP2').should('have.text', 'Hidden text: ');
    cy.get('#\\/pReveal2').should('have.text', 'Revealed 2: secret');


  });

  it('copies hide dynamically', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <text name="source">hello</text>

    <booleaninput name='h1' prefill="false">
      <label>Hide first copy</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true">
      <label>Hide second copy</label>
    </booleaninput>

    <p name="c1">copy 1: <copy hide="$h1" source="source" /></p>
    <p name="c2">copy 2: <copy hide="$h2" source="source" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/c1').should('have.text', 'copy 1: hello')
    cy.get('#\\/c2').should('have.text', 'copy 2: ')

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();

    cy.get('#\\/c1').should('have.text', 'copy 1: ')
    cy.get('#\\/c2').should('have.text', 'copy 2: hello')

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();

    cy.get('#\\/c1').should('have.text', 'copy 1: hello')
    cy.get('#\\/c2').should('have.text', 'copy 2: ')

  })

  it('copies hide dynamically, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <text name="source">hello</text>

    <booleaninput name='h1' prefill="false">
      <label>Hide first copy</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true">
      <label>Hide second copy</label>
    </booleaninput>

    <p name="c1">copy 1: <text hide="$h1" copySource="source" /></p>
    <p name="c2">copy 2: <text hide="$h2" copySource="source" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/c1').should('have.text', 'copy 1: hello')
    cy.get('#\\/c2').should('have.text', 'copy 2: ')

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();

    cy.get('#\\/c1').should('have.text', 'copy 1: ')
    cy.get('#\\/c2').should('have.text', 'copy 2: hello')

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();

    cy.get('#\\/c1').should('have.text', 'copy 1: hello')
    cy.get('#\\/c2').should('have.text', 'copy 2: ')

  })

  it('copy uri two problems', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Two problems</title>

    <copy assignNames="problem1" uri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" />
    
    <copy assignNames="problem2" uri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
    `}, "*");
    });
    cy.get('#\\/_title1').should('have.text', 'Two problems');  // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')

    cy.get(cesc('#/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_copy1"].stateValues.cid).eq("bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu")
        expect(stateVariables["/_copy1"].stateValues.doenetId).eq("abcdefg")
        expect(stateVariables["/_copy2"].stateValues.cid).eq("bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti")
        expect(stateVariables["/_copy2"].stateValues.doenetId).eq("hijklmnop")
      })
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/problem2/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/problem2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x', { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type('{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })

  })

  it('copy uri two problems, with copyFromUri', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Two problems</title>

    <problem name="problem1" copyFromUri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" />
    
    <problem name="problem2" copyFromUri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
    `}, "*");
    });
    cy.get('#\\/_title1').should('have.text', 'Two problems');  // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')


    cy.get(cesc('#/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/problem2/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/problem2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x', { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type('{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })

  })

  it('copy uri two problems, with copyFromUri, change titles, add content, change attribute', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Two problems</title>

    <problem name="problem1" copyFromUri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" >
      <title>Extra animal sounds</title>

      <p>New content at bottom</p>
    </problem>
    
    <problem name="problem2" copyFromUri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" sectionWideCheckWork>
      <title>Derivative with second derivative</title>

      <p>What is the second derivative of <math copySource="problem2/expr" />?
      <answer>
        <award>
          <derivative>$(problem2/_derivative1)</derivative>
        </award>
      </answer>
    </p>
    </problem>

    <p>End paragraph</p>
    `}, "*");
    });
    cy.get('#\\/_title1').should('have.text', 'Two problems');  // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/problem1/_title1')).should('not.exist')
    cy.get(cesc('#/_title2')).should('have.text', 'Extra animal sounds')
    cy.get(cesc('#/_p1')).should('have.text', 'New content at bottom')
    cy.get(cesc('#/_p3')).should('have.text', 'End paragraph')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1"].stateValues.title).eq("Extra animal sounds")
    })

    cy.get(cesc('#/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/problem2/_title1')).should('not.exist')
    cy.get(cesc('#/_title3')).should('have.text', 'Derivative with second derivative')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/problem2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';

      let mathinput2Name = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc('#' + mathinput2Name) + ' textarea';


      expect(stateVariables["/problem2"].stateValues.title).eq("Derivative with second derivative")

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(cesc('#/problem2_submit')).click()
      cy.get(cesc('#/problem2_incorrect')).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x', { force: true });
      cy.get(cesc('#/problem2_submit')).click()
      cy.get(cesc('#/problem2_partial')).should('contain.text', '50%')



      cy.log(`enter incorrect answer for problem 2, part 2`);
      cy.get(mathinput2Anchor).type('3{enter}', { force: true });
      cy.get(cesc('#/problem2_submit')).click()
      cy.get(cesc('#/problem2_partial')).should('contain.text', '50%')


      cy.log(`enter correct answer for problem 2, part 2`);
      cy.get(mathinput2Anchor).type('{end}{backspace}2', { force: true });
      cy.get(cesc('#/problem2_submit')).click()
      cy.get(cesc('#/problem2_correct')).should('be.visible')



    })

  })

  it('copy uri two problems, with copyFromUri, newNamespace change titles, add content, change attribute', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Two problems</title>

    <problem name="problem1" newNamespace copyFromUri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" >
      <title>Extra animal sounds</title>

      <p>New content at bottom</p>
    </problem>
    
    <problem name="problem2" newNamespace copyFromUri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" sectionWideCheckWork>
      <title>Derivative with second derivative</title>

      <p>What is the second derivative of <math copySource="expr" />?
      <answer>
        <award>
          <derivative>$_derivative1</derivative>
        </award>
      </answer>
    </p>
    </problem>

    <p>End paragraph</p>
    `}, "*");
    });
    cy.get('#\\/_title1').should('have.text', 'Two problems');  // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/problem1/_title1')).should('not.exist')
    cy.get(cesc('#/problem1/_title2')).should('have.text', 'Extra animal sounds')
    cy.get(cesc('#/problem1/_p4')).should('have.text', 'New content at bottom')
    cy.get(cesc('#/_p1')).should('have.text', 'End paragraph')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1"].stateValues.title).eq("Extra animal sounds")
    })

    cy.get(cesc('#/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/problem2/_title1')).should('not.exist')
    cy.get(cesc('#/problem2/_title2')).should('have.text', 'Derivative with second derivative')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/problem2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';

      let mathinput2Name = stateVariables['/problem2/_answer2'].stateValues.inputChildren[0].componentName
      let mathinput2Anchor = cesc('#' + mathinput2Name) + ' textarea';


      expect(stateVariables["/problem2"].stateValues.title).eq("Derivative with second derivative")

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(cesc('#/problem2_submit')).click()
      cy.get(cesc('#/problem2_incorrect')).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x', { force: true });
      cy.get(cesc('#/problem2_submit')).click()
      cy.get(cesc('#/problem2_partial')).should('contain.text', '50%')



      cy.log(`enter incorrect answer for problem 2, part 2`);
      cy.get(mathinput2Anchor).type('3{enter}', { force: true });
      cy.get(cesc('#/problem2_submit')).click()
      cy.get(cesc('#/problem2_partial')).should('contain.text', '50%')


      cy.log(`enter correct answer for problem 2, part 2`);
      cy.get(mathinput2Anchor).type('{end}{backspace}2', { force: true });
      cy.get(cesc('#/problem2_submit')).click()
      cy.get(cesc('#/problem2_correct')).should('be.visible')



    })

  })

  it('copy uri two problems, change attribute but cannot change titles or add content without copyFromUri', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Two problems</title>

    <copy assignNames="problem1" uri="doenet:cId=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu&DoenEtiD=abcdefg" >
      <title>Extra animal sounds</title>

      <p>New content at bottom</p>
    </copy>
    
    <copy assignNames="problem2" uri="doenet:doeneTiD=hijklmnop&CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" sectionWideCheckWork>
      <title>Derivative with second derivative</title>

      <p>What is the second derivative of <math copySource="problem2/expr" />?
      <answer>
        <award>
          <derivative>$(problem2/_derivative1)</derivative>
        </award>
      </answer>
    </p>
    </copy>
    <p>End paragraph</p>

    `}, "*");
    });
    cy.get('#\\/_title1').should('have.text', 'Two problems');  // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/problem1/_title1')).should('have.text', 'Animal sounds')
    cy.get(cesc('#/_title2')).should('not.exist')
    cy.get(cesc('#/_p1')).should('not.exist')
    cy.get(cesc('#/_p3')).should('have.text', 'End paragraph')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1"].stateValues.title).eq("Animal sounds")
    })

    cy.get(cesc('#/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/problem2/_title1')).should('have.text', 'Derivative problem')
    cy.get(cesc('#/_title3')).should('not.exist')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/problem2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';


      expect(stateVariables['/_answer1']).eq(undefined)

      expect(stateVariables["/problem2"].stateValues.title).eq("Derivative problem")

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(cesc('#/problem2_submit')).click()
      cy.get(cesc('#/problem2_incorrect')).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x', { force: true });
      cy.get(cesc('#/problem2_submit')).click()
      cy.get(cesc('#/problem2_correct')).should('be.visible')


    })

  })

  it('copy uri containing copy uri of two problems', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Four problems</title>

    <copy assignNames="problem12" uri="doenet:CID=bafkreih7bmpf7mbimgeoxgffdt6tbc6o462wj7gtxkzrqsk3kzhdaqzabi" />
    
    <copy assignNames="problem34" newNamespace name="set2" uri="doenet:CID=bafkreih7bmpf7mbimgeoxgffdt6tbc6o462wj7gtxkzrqsk3kzhdaqzabi" />
    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'Four problems');  // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/problem12/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem12/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem12/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem12/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem12/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem12/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem12/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem12/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem12/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem12/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem12/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem12/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem12/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/problem12/problem2/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/problem12/problem2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x', { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type('{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })


    cy.get(cesc('#/set2/problem34/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/set2/problem34/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/set2/problem34/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/set2/problem34/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/set2/problem34/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/set2/problem34/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/set2/problem34/problem2/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/set2/problem34/problem2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x', { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type('{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })


  })

  // this triggered an error not caught with the other order
  it('copy uri containing copy uri of two problems, newNamespace first', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Four problems</title>

    <copy assignNames="problem12" newNamespace name="set1" uri="doenet:CID=bafkreih7bmpf7mbimgeoxgffdt6tbc6o462wj7gtxkzrqsk3kzhdaqzabi" />
    
    <copy assignNames="problem34" uri="doenet:CID=bafkreih7bmpf7mbimgeoxgffdt6tbc6o462wj7gtxkzrqsk3kzhdaqzabi" />
    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'Four problems');  // to wait for page to load

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/set1/problem12/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/set1/problem12/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/set1/problem12/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/set1/problem12/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/set1/problem12/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/set1/problem12/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/set1/problem12/problem2/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/set1/problem12/problem2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x', { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type('{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })


    cy.get(cesc('#/problem34/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem34/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem34/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem34/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem34/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem34/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem34/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem34/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem34/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem34/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem34/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem34/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem34/problem1/_feedback2')).should('have.text', `Try again.`)

    })


    cy.get(cesc('#/problem34/problem2/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/problem34/problem2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + ' textarea';
      let mathinputSubmitAnchor = cesc('#' + mathinputName + '_submit');
      let mathinputCorrectAnchor = cesc('#' + mathinputName + '_correct');
      let mathinputIncorrectAnchor = cesc('#' + mathinputName + '_incorrect');

      cy.log(`enter incorrect answer for problem 2`);
      cy.get(mathinputAnchor).type('2y{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('not.exist')
      cy.get(mathinputIncorrectAnchor).should('be.visible')

      cy.log(`enter correct answer for problem 2`);
      cy.get(mathinputAnchor).type('{end}{backspace}x', { force: true });
      cy.get(mathinputSubmitAnchor).should('be.visible')
      cy.get(mathinputAnchor).type('{enter}', { force: true });
      cy.get(mathinputSubmitAnchor).should('not.exist')
      cy.get(mathinputCorrectAnchor).should('be.visible')
      cy.get(mathinputIncorrectAnchor).should('not.exist')


    })


  })

  it('copy uri containing variant control', () => {


    const doenetML = `
    <title>Two variants from copied document</title>
    
    <copy assignNames="thedoc" uri="doenet:cid=bafkreidlsgyexefli6dymalyij6se6hmjdky3lxag5jsgce3m7mazhsaja" />
    `;

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });


    cy.get('#\\/_title1').should('have.text', 'Two variants from copied document');  // to wait for page to load

    cy.get('#\\/thedoc').should('contain.text', 'first')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/thedoc"].sharedParameters.allPossibleVariants).eqls(["first", "last"])
      expect(stateVariables["/thedoc"].sharedParameters.variantName).eq("first")
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["a", "b"])
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq("a")

    });



    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariantIndex: 2
      }, "*");
    });

    cy.get('#\\/thedoc').should('contain.text', 'last')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/thedoc"].sharedParameters.allPossibleVariants).eqls(["first", "last"])
      expect(stateVariables["/thedoc"].sharedParameters.variantName).eq("last")
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["a", "b"])
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq("b")

    });

  })

  it('copy uri not in a problem', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <copy assignNames="problem1" uri="doenet:cId=bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey&DoenEtiD=abcdefg" />
  
    `}, "*");
    });

    cy.get('#\\/problem1_title').should('have.text', 'Animal sounds');

    let problem1Version;
    let animalOptions = ["cat", "dog", "mouse", "fish"];
    let soundOptions = ["meow", "woof", "squeak", "blub"]

    cy.get(cesc('#/problem1/_p1')).invoke('text').then(text => {
      let titleOptions = animalOptions.map(x => `What does the ${x} say?`)
      problem1Version = titleOptions.indexOf(text);
      expect(problem1Version).not.eq(-1)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_copy1"].stateValues.cid).eq("bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey")
        expect(stateVariables["/_copy1"].stateValues.doenetId).eq("abcdefg")
      })
    })

    cy.log(`select correct answer for problem 1`).then(() => {
      let animal = animalOptions[problem1Version];
      let sound = soundOptions[problem1Version]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('be.visible');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback1')).should('have.text', `That's right, the ${animal} goes ${sound}!`)
      cy.get(cesc('#/problem1/_feedback2')).should('not.exist');

    })

    cy.log(`select incorrect answer for problem 1`).then(() => {
      let incorrectInd = (problem1Version + 1) % 4;
      let sound = soundOptions[incorrectInd]
      cy.get(cesc('#/problem1/_choiceinput1')).contains(sound).click({ force: true });
      cy.get(cesc('#/problem1/_choiceinput1_submit')).click();
      cy.get(cesc('#/problem1/_choiceinput1_correct')).should('not.exist');
      cy.get(cesc('#/problem1/_choiceinput1_incorrect')).should('be.visible');
      cy.get(cesc('#/problem1/_feedback1')).should('not.exist');
      cy.get(cesc('#/problem1/_feedback2')).should('have.text', `Try again.`)

    })



  })

  it('copyFromUri for uri not in a problem yields nothing', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <problem name="problem1" copyFromUri="doenet:cId=bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey&DoenEtiD=abcdefg" />
  
    `}, "*");
    });


    cy.get('#\\/problem1_title').should('have.text', 'Problem 1');

    cy.get('#\\/_document1').should('not.contain.text', 'Animal sounds')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(Object.keys(stateVariables).length).eq(3);
    })
  })

  it('copy of component that changes away from a copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput name="b" />

    <text name="jump" hide>jump</text>
    
    <p name="forVerb"><conditionalContent assignNames="(verb)">
      <case condition="$b"><text>skip</text></case>
      <else>$jump</else>
    </conditionalContent></p>

    <copy source="verb" assignNames="verb2" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/forVerb').should('have.text', 'jump');
    cy.get('#\\/verb2').should('have.text', 'jump');

    cy.get('#\\/b').click();
    cy.get('#\\/forVerb').should('have.text', 'skip');
    cy.get('#\\/verb2').should('have.text', 'skip');



  });

  it('copy of component that changes away from a copy, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleaninput name="b" />

    <text name="jump" hide>jump</text>
    
    <p name="forVerb"><conditionalContent assignNames="(verb)">
      <case condition="$b"><text>skip</text></case>
      <else>$jump</else>
    </conditionalContent></p>

    <text copySource="verb" name="verb2" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/forVerb').should('have.text', 'jump');
    cy.get('#\\/verb2').should('have.text', 'jump');

    cy.get('#\\/b').click();
    cy.get('#\\/forVerb').should('have.text', 'skip');
    cy.get('#\\/verb2').should('have.text', 'skip');



  });

  it('copy of invalid source gives math in boolean and math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>We can't see $invalid in paragraph <text>or $invisible in text</text>.</p>

    <p>In math, we can: <math>$bad + $nothing</math></p>

    <p>And in boolean as well: <boolean>not ($missing = x)</boolean></p>.

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', "We can't see  in paragraph or  in text.")

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿+＿')
    })

    cy.get('#\\/_boolean1').should('have.text', "true");




  });

  it('copy no link, base test', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Simplify of original: <textinput name="s1" prefill="full" /></p>
    <p>Simplify of copies: <textinput name="s2" prefill="none" /></p>

    <p>Original: <math name="m" simplify="$s1">x +x</math></p>
    
    <p>Unlinked copy: <copy link="false" source="m" simplify="$s2" assignNames="m2" /></p>

    <p>Linked copy: <copy source="m" simplify="$s2" assignNames="m3" /></p>
    
    <p>Double value of original: <updateValue target="m" newValue="2$m" name="doubleOriginal" >
      <label>double original</label>
    </updateValue></p>
    <p>Double value of copy 1: <updateValue target="m2" newValue="2$m2" name="doubleCopy1" >
      <label>double copy 1</label>
    </updateValue></p>
    <p>Double value of copy 2: <updateValue target="m3" newValue="2$m3" name="doubleCopy2" >
      <label>double copy 2</label>
    </updateValue></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('x+x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('x+x')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_copy1"].stateValues.link).eq(false)
      expect(stateVariables["/_copy2"].stateValues.link).eq(true)
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["+", "x", "x"])
    });

    cy.log('simplify copies')
    cy.get('#\\/s2_input').clear().type("full{enter}");

    cy.get(`#\\/m2`).should('contain.text', '2x')
    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, "x"])
    });


    cy.log('stop simplifying original')
    cy.get('#\\/s1_input').clear().type("none{enter}");

    cy.get(`#\\/m`).should('contain.text', 'x+x')

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('x+x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["+", "x", "x"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, "x"])
    });


    cy.log('double original')
    cy.get('#\\/doubleOriginal_button').click();

    cy.get(`#\\/m`).should('contain.text', '2(x+x)')

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2(x+x)')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, ["+", "x", "x"]])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 4, "x"])
    });


    cy.log('double copy1')
    cy.get('#\\/doubleCopy1_button').click();

    cy.get(`#\\/m2`).should('contain.text', '4x')

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2(x+x)')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, ["+", "x", "x"]])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 4, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 4, "x"])
    });


    cy.log('double copy2')
    cy.get('#\\/doubleCopy2_button').click();

    cy.get(`#\\/m3`).should('contain.text', '8x')

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅4x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('8x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, 4, "x"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 4, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 8, "x"])
    });


    cy.log('stop simplifying copies')
    cy.get('#\\/s2_input').clear().type("none{enter}");

    cy.get(`#\\/m2`).should('contain.text', '2⋅2x')

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅4x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅4x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, 4, "x"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, 2, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, 4, "x"])
    });

  });

  it('copy no link, base test, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Simplify of original: <textinput name="s1" prefill="full" /></p>
    <p>Simplify of copies: <textinput name="s2" prefill="none" /></p>

    <p>Original: <math name="m" simplify="$s1">x +x</math></p>
    
    <p>Unlinked copy: <math link="false" copySource="m" simplify="$s2" name="m2" /></p>

    <p>Linked copy: <math copySource="m" simplify="$s2" name="m3" /></p>
    
    <p>Double value of original: <updateValue target="m" newValue="2$m" name="doubleOriginal" >
      <label>double original</label>
    </updateValue></p>
    <p>Double value of copy 1: <updateValue target="m2" newValue="2$m2" name="doubleCopy1" >
      <label>double copy 1</label>
    </updateValue></p>
    <p>Double value of copy 2: <updateValue target="m3" newValue="2$m3" name="doubleCopy2" >
      <label>double copy 2</label>
    </updateValue></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('x+x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('x+x')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["+", "x", "x"])
    });

    cy.log('simplify copies')
    cy.get('#\\/s2_input').clear().type("full{enter}");

    cy.get(`#\\/m2`).should('contain.text', '2x')
    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, "x"])
    });


    cy.log('stop simplifying original')
    cy.get('#\\/s1_input').clear().type("none{enter}");

    cy.get(`#\\/m`).should('contain.text', 'x+x')

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('x+x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["+", "x", "x"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, "x"])
    });


    cy.log('double original')
    cy.get('#\\/doubleOriginal_button').click();

    cy.get(`#\\/m`).should('contain.text', '2(x+x)')

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2(x+x)')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, ["+", "x", "x"]])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 4, "x"])
    });


    cy.log('double copy1')
    cy.get('#\\/doubleCopy1_button').click();

    cy.get(`#\\/m2`).should('contain.text', '4x')

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2(x+x)')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, ["+", "x", "x"]])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 4, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 4, "x"])
    });


    cy.log('double copy2')
    cy.get('#\\/doubleCopy2_button').click();

    cy.get(`#\\/m3`).should('contain.text', '8x')

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅4x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('4x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('8x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, 4, "x"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 4, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 8, "x"])
    });


    cy.log('stop simplifying copies')
    cy.get('#\\/s2_input').clear().type("none{enter}");

    cy.get(`#\\/m2`).should('contain.text', '2⋅2x')

    cy.get(`#\\/m`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅4x')
    })
    cy.get(`#\\/m2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅2x')
    })
    cy.get(`#\\/m3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('2⋅4x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.value).eqls(["*", 2, 4, "x"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["*", 2, 2, "x"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["*", 2, 4, "x"])
    });

  });

  it('copy points and lines with no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <copy source="A" link="false" name="Anolink" assignNames="A2" />
      <copy source="l" link="false" name="lnolink" assignNames="l2" />
    </graph>
    
    <graph>
      <copy source="l" prop="point1" link="false" name="plnolink" assignNames="A3" />
    </graph>
    <graph>
      <copy source="l" prop="points" link="false" name="plsnolink" assignNames="A4 B4"  />
    </graph>

    <copy source="g" link="false" name="gnolink" newNamespace />
    
    <copy source="A" prop="x" link="false" assignNames="Ax" name="pxnolink" />

    <p>
      <copy source="A" assignNames="Ac" />
      <copy source="B" assignNames="Bc" />
      <copy prop="point1" source="l" assignNames="lp1" />
      <copy source="A2" assignNames="A2c" />
      <copy prop="point1" source="l2" assignNames="l2p1" />
      <copy source="A3" assignNames="A3c" />
      <copy source="A4" assignNames="A4c" />
      <copy source="B4" assignNames="B4c" />
      <copy source="gnolink/A" assignNames="A5c" />
      <copy source="gnolink/B" assignNames="B5c" />
      <copy prop="point1" source="gnolink/l" assignNames="l3p1" />

    </p>
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(`#\\/Ax`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('1')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/Anolink"].stateValues.link).eq(false)
      expect(stateVariables["/lnolink"].stateValues.link).eq(false)
      expect(stateVariables["/plnolink"].stateValues.link).eq(false)
      expect(stateVariables["/plsnolink"].stateValues.link).eq(false)
      expect(stateVariables["/gnolink"].stateValues.link).eq(false)
      expect(stateVariables["/pxnolink"].stateValues.link).eq(false)
      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)


    })

    cy.log('move A');
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -9, y: -3 }
      })
    })

    cy.get("#\\/Ac").should('contain.text', `(${nInDOM(-9)},${nInDOM(-3)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3])
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3])
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });

    cy.log('move B')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -2, y: 6 }
      })
    })

    cy.get("#\\/Bc").should('contain.text', `(${nInDOM(-2)},${nInDOM(6)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3])
      expect(stateVariables["/B"].stateValues.xs).eqls([-2, 6])
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3])
      expect(stateVariables["/l"].stateValues.point2).eqls([-2, 6])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)



    });

    cy.log('move l')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [-7, -6],
          point2coords: [8, 0]
        }
      })
    })

    cy.get("#\\/lp1").should('contain.text', `(${nInDOM(-7)},${nInDOM(-6)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });

    cy.log('move A2')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: 5, y: 4 }
      })
    })

    cy.get("#\\/A2c").should('contain.text', `(${nInDOM(5)},${nInDOM(4)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });


    cy.log('move l2')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [-5, 9],
          point2coords: [-4, -1]
        }
      })
    })

    cy.get("#\\/l2p1").should('contain.text', `(${nInDOM(-5)},${nInDOM(9)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });


    cy.log('move A3')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 6, y: -3 }
      })
    })

    cy.get("#\\/A3c").should('contain.text', `(${nInDOM(6)},${nInDOM(-3)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move A4')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A4",
        args: { x: -2, y: 7 }
      })
    })

    cy.get("#\\/A4c").should('contain.text', `(${nInDOM(-2)},${nInDOM(7)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move B4')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B4",
        args: { x: -9, y: -8 }
      })
    })

    cy.get("#\\/B4c").should('contain.text', `(${nInDOM(-9)},${nInDOM(-8)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move A5')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/A",
        args: { x: -10, y: -9 }
      })
    })

    cy.get("#\\/A5c").should('contain.text', `(${nInDOM(-10)},${nInDOM(-9)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move B5')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/B",
        args: { x: -8, y: -7 }
      })
    })

    cy.get("#\\/B5c").should('contain.text', `(${nInDOM(-8)},${nInDOM(-7)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([-8, -7])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([-8, -7])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move l3')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/gnolink/l",
        args: {
          point1coords: [6, 5],
          point2coords: [4, -3]
        }
      })
    })

    cy.get("#\\/l3p1").should('contain.text', `(${nInDOM(6)},${nInDOM(5)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([6, 5])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([4, -3])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([6, 5])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([4, -3])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

  });

  it('copy points and lines with no link, dot notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <copy source="A" link="false" name="Anolink" assignNames="A2" />
      <copy source="l" link="false" name="lnolink" assignNames="l2" />
    </graph>
    
    <graph>
      <copy source="l.point1" link="false" name="plnolink" assignNames="A3" />
    </graph>
    <graph>
      <copy source="l.points" link="false" name="plsnolink" assignNames="A4 B4"  />
    </graph>

    <copy source="g" link="false" name="gnolink" newNamespace />
    
    <copy source="A.x" link="false" assignNames="Ax" name="pxnolink" />

    <p>
      <copy source="A" assignNames="Ac" />
      <copy source="B" assignNames="Bc" />
      <copy source="l.point1" assignNames="lp1" />
      <copy source="A2" assignNames="A2c" />
      <copy source="l2.point1" assignNames="l2p1" />
      <copy source="A3" assignNames="A3c" />
      <copy source="A4" assignNames="A4c" />
      <copy source="B4" assignNames="B4c" />
      <copy source="gnolink/A" assignNames="A5c" />
      <copy source="gnolink/B" assignNames="B5c" />
      <copy source="gnolink/l.point1" assignNames="l3p1" />

    </p>
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(`#\\/Ax`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('1')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/Anolink"].stateValues.link).eq(false)
      expect(stateVariables["/lnolink"].stateValues.link).eq(false)
      expect(stateVariables["/plnolink"].stateValues.link).eq(false)
      expect(stateVariables["/plsnolink"].stateValues.link).eq(false)
      expect(stateVariables["/gnolink"].stateValues.link).eq(false)
      expect(stateVariables["/pxnolink"].stateValues.link).eq(false)
      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)


    })

    cy.log('move A');
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -9, y: -3 }
      })
    })

    cy.get("#\\/Ac").should('contain.text', `(${nInDOM(-9)},${nInDOM(-3)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3])
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3])
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });

    cy.log('move B')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -2, y: 6 }
      })
    })

    cy.get("#\\/Bc").should('contain.text', `(${nInDOM(-2)},${nInDOM(6)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3])
      expect(stateVariables["/B"].stateValues.xs).eqls([-2, 6])
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3])
      expect(stateVariables["/l"].stateValues.point2).eqls([-2, 6])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)



    });

    cy.log('move l')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [-7, -6],
          point2coords: [8, 0]
        }
      })
    })

    cy.get("#\\/lp1").should('contain.text', `(${nInDOM(-7)},${nInDOM(-6)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });

    cy.log('move A2')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: 5, y: 4 }
      })
    })

    cy.get("#\\/A2c").should('contain.text', `(${nInDOM(5)},${nInDOM(4)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });


    cy.log('move l2')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [-5, 9],
          point2coords: [-4, -1]
        }
      })
    })

    cy.get("#\\/l2p1").should('contain.text', `(${nInDOM(-5)},${nInDOM(9)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });


    cy.log('move A3')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 6, y: -3 }
      })
    })

    cy.get("#\\/A3c").should('contain.text', `(${nInDOM(6)},${nInDOM(-3)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move A4')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A4",
        args: { x: -2, y: 7 }
      })
    })

    cy.get("#\\/A4c").should('contain.text', `(${nInDOM(-2)},${nInDOM(7)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move B4')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B4",
        args: { x: -9, y: -8 }
      })
    })

    cy.get("#\\/B4c").should('contain.text', `(${nInDOM(-9)},${nInDOM(-8)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move A5')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/A",
        args: { x: -10, y: -9 }
      })
    })

    cy.get("#\\/A5c").should('contain.text', `(${nInDOM(-10)},${nInDOM(-9)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move B5')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/B",
        args: { x: -8, y: -7 }
      })
    })

    cy.get("#\\/B5c").should('contain.text', `(${nInDOM(-8)},${nInDOM(-7)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([-8, -7])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([-8, -7])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move l3')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/gnolink/l",
        args: {
          point1coords: [6, 5],
          point2coords: [4, -3]
        }
      })
    })

    cy.get("#\\/l3p1").should('contain.text', `(${nInDOM(6)},${nInDOM(5)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([6, 5])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([4, -3])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([6, 5])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([4, -3])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

  });

  it('copy points and lines with no link, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <point copySource="A" link="false" name="A2" />
      <line copySource="l" link="false" name="l2" />
    </graph>
    
    <graph>
      <point copySource="l" copyProp="point1" link="false" name="A3" />
    </graph>
    <graph>
      <point copySource="l" copyProp="point1" link="false" name="A4" />
      <point copySource="l" copyProp="point2" link="false" name="B4" />
    </graph>

    <graph copySource="g" link="false" name="gnolink" newNamespace />
    
    <math copySource="A" copyProp="x" link="false" name="Ax" />

    <p>
      <point copySource="A" name="Ac" />
      <point copySource="B" name="Bc" />
      <point copyProp="point1" copySource="l" name="lp1" />
      <point copySource="A2" name="A2c" />
      <point copyProp="point1" copySource="l2" name="l2p1" />
      <point copySource="A3" name="A3c" />
      <point copySource="A4" name="A4c" />
      <point copySource="B4" name="B4c" />
      <point copySource="gnolink/A" name="A5c" />
      <point copySource="gnolink/B" name="B5c" />
      <point copyProp="point1" copySource="gnolink/l" name="l3p1" />

    </p>
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(`#\\/Ax`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('1')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)


    })

    cy.log('move A');
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -9, y: -3 }
      })
    })

    cy.get("#\\/Ac").should('contain.text', `(${nInDOM(-9)},${nInDOM(-3)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3])
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3])
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });

    cy.log('move B')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -2, y: 6 }
      })
    })

    cy.get("#\\/Bc").should('contain.text', `(${nInDOM(-2)},${nInDOM(6)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3])
      expect(stateVariables["/B"].stateValues.xs).eqls([-2, 6])
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3])
      expect(stateVariables["/l"].stateValues.point2).eqls([-2, 6])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)



    });

    cy.log('move l')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [-7, -6],
          point2coords: [8, 0]
        }
      })
    })

    cy.get("#\\/lp1").should('contain.text', `(${nInDOM(-7)},${nInDOM(-6)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });

    cy.log('move A2')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: 5, y: 4 }
      })
    })

    cy.get("#\\/A2c").should('contain.text', `(${nInDOM(5)},${nInDOM(4)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });


    cy.log('move l2')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [-5, 9],
          point2coords: [-4, -1]
        }
      })
    })

    cy.get("#\\/l2p1").should('contain.text', `(${nInDOM(-5)},${nInDOM(9)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });


    cy.log('move A3')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 6, y: -3 }
      })
    })

    cy.get("#\\/A3c").should('contain.text', `(${nInDOM(6)},${nInDOM(-3)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move A4')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A4",
        args: { x: -2, y: 7 }
      })
    })

    cy.get("#\\/A4c").should('contain.text', `(${nInDOM(-2)},${nInDOM(7)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move B4')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B4",
        args: { x: -9, y: -8 }
      })
    })

    cy.get("#\\/B4c").should('contain.text', `(${nInDOM(-9)},${nInDOM(-8)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move A5')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/A",
        args: { x: -10, y: -9 }
      })
    })

    cy.get("#\\/A5c").should('contain.text', `(${nInDOM(-10)},${nInDOM(-9)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move B5')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/B",
        args: { x: -8, y: -7 }
      })
    })

    cy.get("#\\/B5c").should('contain.text', `(${nInDOM(-8)},${nInDOM(-7)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([-8, -7])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([-8, -7])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move l3')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/gnolink/l",
        args: {
          point1coords: [6, 5],
          point2coords: [4, -3]
        }
      })
    })

    cy.get("#\\/l3p1").should('contain.text', `(${nInDOM(6)},${nInDOM(5)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([6, 5])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([4, -3])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([6, 5])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([4, -3])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

  });

  it('copy points and lines with no link, with copySource, dot notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
      <line through="$A $B" name="l" />
    </graph>
    
    <graph>
      <point copySource="A" link="false" name="A2" />
      <line copySource="l" link="false" name="l2" />
    </graph>
    
    <graph>
      <point copySource="l.point1" link="false" name="A3" />
    </graph>
    <graph>
      <point copySource="l.point1" link="false" name="A4" />
      <point copySource="l.point2" link="false" name="B4" />
    </graph>

    <graph copySource="g" link="false" name="gnolink" newNamespace />
    
    <math copySource="A.x" link="false" name="Ax" />

    <p>
      <point copySource="A" name="Ac" />
      <point copySource="B" name="Bc" />
      <point copySource="l.point1" name="lp1" />
      <point copySource="A2" name="A2c" />
      <point copySource="l2.point1" name="l2p1" />
      <point copySource="A3" name="A3c" />
      <point copySource="A4" name="A4c" />
      <point copySource="B4" name="B4c" />
      <point copySource="gnolink/A" name="A5c" />
      <point copySource="gnolink/B" name="B5c" />
      <point copySource="gnolink/l.point1" name="l3p1" />

    </p>
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(`#\\/Ax`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('1')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)


    })

    cy.log('move A');
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -9, y: -3 }
      })
    })

    cy.get("#\\/Ac").should('contain.text', `(${nInDOM(-9)},${nInDOM(-3)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3])
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3])
      expect(stateVariables["/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });

    cy.log('move B')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -2, y: 6 }
      })
    })

    cy.get("#\\/Bc").should('contain.text', `(${nInDOM(-2)},${nInDOM(6)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-9, -3])
      expect(stateVariables["/B"].stateValues.xs).eqls([-2, 6])
      expect(stateVariables["/l"].stateValues.point1).eqls([-9, -3])
      expect(stateVariables["/l"].stateValues.point2).eqls([-2, 6])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)



    });

    cy.log('move l')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [-7, -6],
          point2coords: [8, 0]
        }
      })
    })

    cy.get("#\\/lp1").should('contain.text', `(${nInDOM(-7)},${nInDOM(-6)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });

    cy.log('move A2')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: 5, y: 4 }
      })
    })

    cy.get("#\\/A2c").should('contain.text', `(${nInDOM(5)},${nInDOM(4)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/l2"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });


    cy.log('move l2')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l2",
        args: {
          point1coords: [-5, 9],
          point2coords: [-4, -1]
        }
      })
    })

    cy.get("#\\/l2p1").should('contain.text', `(${nInDOM(-5)},${nInDOM(9)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)

    });


    cy.log('move A3')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A3",
        args: { x: 6, y: -3 }
      })
    })

    cy.get("#\\/A3c").should('contain.text', `(${nInDOM(6)},${nInDOM(-3)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move A4')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A4",
        args: { x: -2, y: 7 }
      })
    })

    cy.get("#\\/A4c").should('contain.text', `(${nInDOM(-2)},${nInDOM(7)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move B4')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B4",
        args: { x: -9, y: -8 }
      })
    })

    cy.get("#\\/B4c").should('contain.text', `(${nInDOM(-9)},${nInDOM(-8)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([1, 2])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([1, 2])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move A5')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/A",
        args: { x: -10, y: -9 }
      })
    })

    cy.get("#\\/A5c").should('contain.text', `(${nInDOM(-10)},${nInDOM(-9)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([3, 4])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([3, 4])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move B5')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/gnolink/B",
        args: { x: -8, y: -7 }
      })
    })

    cy.get("#\\/B5c").should('contain.text', `(${nInDOM(-8)},${nInDOM(-7)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([-10, -9])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([-8, -7])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([-10, -9])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([-8, -7])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

    cy.log('move l3')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/gnolink/l",
        args: {
          point1coords: [6, 5],
          point2coords: [4, -3]
        }
      })
    })

    cy.get("#\\/l3p1").should('contain.text', `(${nInDOM(6)},${nInDOM(5)})`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-7, -6])
      expect(stateVariables["/B"].stateValues.xs).eqls([8, 0])
      expect(stateVariables["/l"].stateValues.point1).eqls([-7, -6])
      expect(stateVariables["/l"].stateValues.point2).eqls([8, 0])
      expect(stateVariables["/A2"].stateValues.xs).eqls([5, 4])
      expect(stateVariables["/l2"].stateValues.point1).eqls([-5, 9])
      expect(stateVariables["/l2"].stateValues.point2).eqls([-4, -1])
      expect(stateVariables["/A3"].stateValues.xs).eqls([6, -3])
      expect(stateVariables["/A4"].stateValues.xs).eqls([-2, 7])
      expect(stateVariables["/B4"].stateValues.xs).eqls([-9, -8])
      expect(stateVariables["/gnolink/A"].stateValues.xs).eqls([6, 5])
      expect(stateVariables["/gnolink/B"].stateValues.xs).eqls([4, -3])
      expect(stateVariables["/gnolink/l"].stateValues.point1).eqls([6, 5])
      expect(stateVariables["/gnolink/l"].stateValues.point2).eqls([4, -3])
      expect(stateVariables["/Ax"].stateValues.value).eqls(1)
    });

  });

  it('copy string with no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Hello</p>
    <copy source="_p1" assignNames="p2" link="false" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/_p1").should('have.text', 'Hello')
    cy.get("#\\/p2").should('have.text', 'Hello')

  });

  it('copy string with no link, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Hello</p>
    <p copySource="_p1" name="p2" link="false" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/_p1").should('have.text', 'Hello')
    cy.get("#\\/p2").should('have.text', 'Hello')

  });

  // This was causing a duplicate componentName error
  it('copy group with assignNames inside with no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><group name="g"><text name="m">hello</text> <copy source="m" assignNames="q" /></group></p>
    <p><copy source="g" link="false" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/_p1").should('have.text', 'hello hello')
    cy.get("#\\/_p2").should('have.text', 'hello hello')

  });

  // This was causing a duplicate componentName error
  it('copy group with assignNames inside with no link, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><group name="g"><text name="m">hello</text> <copy source="m" assignNames="q" /></group></p>
    <p><group copySource="g" link="false" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/_p1").should('have.text', 'hello hello')
    cy.get("#\\/_p2").should('have.text', 'hello hello')

  });

  it('copy group with copies with no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group>
      <p><math name="twox">x+x</math></p>
      <copy source="twox" name="ctwox" assignNames="twoxa" />
      <copy source="twox" name="c2twox" assignNames="twoxb" />
    </group>
    
    <copy source="twox" assignNames="twoxc" />
    <copy source="twox" link="false" assignNames="twoxd" />
    
    <copy source="twoxa" assignNames="twoxe" />
    <copy source="twoxa" link="false" assignNames="twoxf" />
    
    <copy source="ctwox" assignNames="twoxg" />
    <copy source="ctwox" link="false" assignNames="twoxh" />

    <copy source="twoxb" assignNames="twoxi" />
    <copy source="twoxb" link="false" assignNames="twoxj" />
    
    <copy source="c2twox" assignNames="twoxk" />
    <copy source="c2twox" link="false" assignNames="twoxl" />
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxb").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxc").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxd").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxe").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxf").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxh").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxi").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxj").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxk").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxl").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })

  });

  it('copy group with copies with no link, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group>
      <p><math name="twox">x+x</math></p>
      <math copySource="twox" name="twoxa" />
      <math copySource="twox" name="twoxb" />
    </group>
    
    <math copySource="twox" name="twoxc" />
    <math copySource="twox" link="false" name="twoxd" />
    
    <math copySource="twoxa" name="twoxe" />
    <math copySource="twoxa" link="false" name="twoxf" />
    
    <math copySource="twoxe" name="twoxg" />
    <math copySource="twoxf" link="false" name="twoxh" />

    <math copySource="twoxb" name="twoxi" />
    <math copySource="twoxb" link="false" name="twoxj" />
    
    <math copySource="twoxi" name="twoxk" />
    <math copySource="twoxj" link="false" name="twoxl" />
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxb").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxc").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxd").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxe").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxf").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxh").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxi").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxj").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxk").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxl").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })

  });

  it('copy group with copy overwriting attribute, no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="g">
      <textinput name="sim" prefill="full" />
    
      <p><math name="twox">x+x</math>
      <copy source="twox" simplify="$sim" name="ctwox" assignNames="twoxa" />
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    <copy source="g" link="false" name="g2" newNamespace />
    <copy source="g2/g" link="false" name="g3" newNamespace />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })

    cy.get("#\\/g2\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/g2\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })

    cy.get("#\\/g3\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g3\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/g3\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })


    cy.log('change first simplify')
    cy.get('#\\/sim_input').clear().type("none{enter}")

    cy.get("#\\/twoxa").should('contain.text', 'x+x')
    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })

    cy.get("#\\/g2\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/g2\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })

    cy.get("#\\/g3\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g3\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/g3\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })


    cy.log('change second simplify')
    cy.get('#\\/g2\\/sim_input').clear().type("none{enter}")

    cy.get("#\\/g2\\/twoxa").should('contain.text', 'x+x')
    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })

    cy.get("#\\/g2\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })

    cy.get("#\\/g3\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g3\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/g3\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })


    cy.log('change third simplify')
    cy.get('#\\/g3\\/sim_input').clear().type("none{enter}")

    cy.get("#\\/g3\\/twoxa").should('contain.text', 'x+x')
    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })

    cy.get("#\\/g2\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })

    cy.get("#\\/g3\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g3\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g3\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })



  });

  it('copy group with copy overwriting attribute, no link, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="g">
      <textinput name="sim" prefill="full" />
    
      <p><math name="twox">x+x</math>
      <math copySource="twox" simplify="$sim" name="twoxa" />
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    <group copySource="g" link="false" name="g2" newNamespace />
    <group copySource="g2" link="false" name="g3" newNamespace />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })

    cy.get("#\\/g2\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/g2\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })

    cy.get("#\\/g3\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g3\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/g3\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })


    cy.log('change first simplify')
    cy.get('#\\/sim_input').clear().type("none{enter}")

    cy.get("#\\/twoxa").should('contain.text', 'x+x')
    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })

    cy.get("#\\/g2\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/g2\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })

    cy.get("#\\/g3\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g3\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/g3\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })


    cy.log('change second simplify')
    cy.get('#\\/g2\\/sim_input').clear().type("none{enter}")

    cy.get("#\\/g2\\/twoxa").should('contain.text', 'x+x')
    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })

    cy.get("#\\/g2\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })

    cy.get("#\\/g3\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g3\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("2x")
    })
    cy.get("#\\/g3\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("3x")
    })


    cy.log('change third simplify')
    cy.get('#\\/g3\\/sim_input').clear().type("none{enter}")

    cy.get("#\\/g3\\/twoxa").should('contain.text', 'x+x')
    cy.get("#\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })

    cy.get("#\\/g2\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g2\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })

    cy.get("#\\/g3\\/twox").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g3\\/twoxa").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x")
    })
    cy.get("#\\/g3\\/threex").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x+x+x")
    })


  });

  it('copy group with link through assignNames of external, no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="g" newNamespace>
    <copy uri="doenet:cid=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" assignNames="p" />
    <p>Credit achieved: <copy source="p/_answer1.creditAchieved" assignNames="ca" /></p>
    </group>
    
    <copy source="g" link="false" assignNames="g2" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinput1Anchor = cesc('#' + stateVariables["/g/p/_answer1"].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput2Anchor = cesc('#' + stateVariables["/g2/p/_answer1"].stateValues.inputChildren[0].componentName) + " textarea";

      cy.get(cesc('#/g/ca')).should('have.text', '0')
      cy.get(cesc('#/g2/ca')).should('have.text', '0')

      cy.get(mathinput1Anchor).type("2x{enter}", { force: true })

      cy.get(cesc('#/g/ca')).should('have.text', '1')
      cy.get(cesc('#/g2/ca')).should('have.text', '0')

      cy.get(mathinput2Anchor).type("2x{enter}", { force: true })

      cy.get(cesc('#/g/ca')).should('have.text', '1')
      cy.get(cesc('#/g2/ca')).should('have.text', '1')

    });
  });

  it('copy group with link through assignNames of external, no link, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="g" newNamespace>
    <problem copyfromuri="doenet:cid=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" name="p" />
    <p>Credit achieved: <number copySource="p/_answer1.creditAchieved" name="ca" /></p>
    </group>
    
    <group copySource="g" link="false" name="g2" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinput1Anchor = cesc('#' + stateVariables["/g/p/_answer1"].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput2Anchor = cesc('#' + stateVariables["/g2/p/_answer1"].stateValues.inputChildren[0].componentName) + " textarea";

      cy.get(cesc('#/g/ca')).should('have.text', '0')
      cy.get(cesc('#/g2/ca')).should('have.text', '0')

      cy.get(mathinput1Anchor).type("2x{enter}", { force: true })

      cy.get(cesc('#/g/ca')).should('have.text', '1')
      cy.get(cesc('#/g2/ca')).should('have.text', '0')

      cy.get(mathinput2Anchor).type("2x{enter}", { force: true })

      cy.get(cesc('#/g/ca')).should('have.text', '1')
      cy.get(cesc('#/g2/ca')).should('have.text', '1')

    });
  });

  it('copy group, no link, with function adapted to curve', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name='g'>
      <graph>
        <function>x</function>
      </graph>
    </group>
    
    <copy source='g' link="false" />
    `}, "*");
    });

    // just testing that page loads, i.e., that bug is removed so that don't get error
    cy.get('#\\/_text1').should('have.text', 'a');


  });

  it('copy group, no link, with function adapted to curve, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name='g'>
      <graph>
        <function>x</function>
      </graph>
    </group>
    
    <group copySource='g' link="false" />
    `}, "*");
    });

    // just testing that page loads, i.e., that bug is removed so that don't get error
    cy.get('#\\/_text1').should('have.text', 'a');


  });

  it('copy group, no link, copy to external inside attribute', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput name="external" prefill="bye" />

    <group name="g" newNamespace>
      <copy source="/external.value" assignNames="w" />
      <point name="P"><label>$(/external)</label>(a,b)</point>
      <copy source="P.label" assignNames="Plabel" />
    </group>
    
    <copy source="g" assignNames="g2" link="false" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/g/w')).should('have.text', 'bye')
    cy.get(cesc('#/g/Plabel')).should('have.text', 'bye')
    cy.get(cesc('#/g2/w')).should('have.text', 'bye')
    cy.get(cesc('#/g2/Plabel')).should('have.text', 'bye')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq('bye')
      expect(stateVariables["/g2/P"].stateValues.label).eq('bye')

    })

    cy.get(cesc('#/external_input')).clear().type('hi{enter}')

    cy.get(cesc('#/g/w')).should('have.text', 'hi')
    cy.get(cesc('#/g/Plabel')).should('have.text', 'hi')
    cy.get(cesc('#/g2/w')).should('have.text', 'bye')
    cy.get(cesc('#/g2/Plabel')).should('have.text', 'bye')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq('hi')
      expect(stateVariables["/g2/P"].stateValues.label).eq('bye')
    })

  });

  it('copy group, no link, copy to external inside attribute, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput name="external" prefill="bye" />

    <group name="g" newNamespace>
      <text copySource="/external.value" name="w" />
      <point name="P">
        <label>$(/external)</label>
        (a,b)
      </point>
      <label copySource="P.label" name="Plabel" />
    </group>
    
    <group copySource="g" name="g2" link="false" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/g/w')).should('have.text', 'bye')
    cy.get(cesc('#/g/Plabel')).should('have.text', 'bye')
    cy.get(cesc('#/g2/w')).should('have.text', 'bye')
    cy.get(cesc('#/g2/Plabel')).should('have.text', 'bye')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq('bye')
      expect(stateVariables["/g2/P"].stateValues.label).eq('bye')

    })

    cy.get(cesc('#/external_input')).clear().type('hi{enter}')

    cy.get(cesc('#/g/w')).should('have.text', 'hi')
    cy.get(cesc('#/g/Plabel')).should('have.text', 'hi')
    cy.get(cesc('#/g2/w')).should('have.text', 'bye')
    cy.get(cesc('#/g2/Plabel')).should('have.text', 'bye')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.label).eq('hi')
      expect(stateVariables["/g2/P"].stateValues.label).eq('bye')
    })

  });

  it('copy group, no link, internal copy to source alias is linked', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <group name="g" newNamespace>
      <textinput name="ti" prefill="hello" />
      <map assignNames="a">
        <template newNamespace>
          <copy source="x" assignNames="w" />
          <point name="P"><label>$x</label>(a,b)</point>
          <copy prop="label" source="P" assignNames="Plabel" />


        </template>
        <sources alias="x">
          $ti
        </sources>
      </map>
    </group>
    
    <copy source="g" assignNames="g2" link="false" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/g/a/w')).should('have.text', 'hello')
    cy.get(cesc('#/g/a/Plabel')).should('have.text', 'hello')
    cy.get(cesc('#/g2/a/w')).should('have.text', 'hello')
    cy.get(cesc('#/g2/a/Plabel')).should('have.text', 'hello')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/a/P"].stateValues.label).eq('hello')
      expect(stateVariables["/g2/a/P"].stateValues.label).eq('hello')

    })

    cy.get(cesc('#/g/ti_input')).clear().type('one{enter}')
    cy.get(cesc('#/g2/ti_input')).clear().type('two{enter}')

    cy.get(cesc('#/g/a/w')).should('have.text', 'one')
    cy.get(cesc('#/g/a/Plabel')).should('have.text', 'one')
    cy.get(cesc('#/g2/a/w')).should('have.text', 'two')
    cy.get(cesc('#/g2/a/Plabel')).should('have.text', 'two')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/a/P"].stateValues.label).eq('one')
      expect(stateVariables["/g2/a/P"].stateValues.label).eq('two')
    })

  });

  it('copy group, no link, internal copy to source alias is linked, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <group name="g" newNamespace>
      <textinput name="ti" prefill="hello" />
      <map assignNames="a">
        <template newNamespace>
          <text copySource="x" name="w" />
          <point name="P">
            <label>$x</label>
            (a,b)
          </point>
          <label copyProp="label" copySource="P" name="Plabel" />
        </template>
        <sources alias="x">
          $ti
        </sources>
      </map>
    </group>
    
    <group copySource="g" name="g2" link="false" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/g/a/w')).should('have.text', 'hello')
    cy.get(cesc('#/g/a/Plabel')).should('have.text', 'hello')
    cy.get(cesc('#/g2/a/w')).should('have.text', 'hello')
    cy.get(cesc('#/g2/a/Plabel')).should('have.text', 'hello')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/a/P"].stateValues.label).eq('hello')
      expect(stateVariables["/g2/a/P"].stateValues.label).eq('hello')

    })

    cy.get(cesc('#/g/ti_input')).clear().type('one{enter}')
    cy.get(cesc('#/g2/ti_input')).clear().type('two{enter}')

    cy.get(cesc('#/g/a/w')).should('have.text', 'one')
    cy.get(cesc('#/g/a/Plabel')).should('have.text', 'one')
    cy.get(cesc('#/g2/a/w')).should('have.text', 'two')
    cy.get(cesc('#/g2/a/Plabel')).should('have.text', 'two')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/a/P"].stateValues.label).eq('one')
      expect(stateVariables["/g2/a/P"].stateValues.label).eq('two')
    })

  });

  it('copy no link containing external copies use absolute source', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group newNamespace name="g">
      <p>m = <copy source="../m" assignNames="m1" /></p>
      <p>m = <copy source="../m" assignNames="m2" link="false" /></p>
    </group>
    
    <copy source="g" assignNames="g2" />
    <copy source="g" link="false" assignNames="g3" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/n')).should('have.text', '2')
    cy.get(cesc('#/m')).should('have.text', '4')
    cy.get(cesc('#/g/m1')).should('have.text', '4')
    cy.get(cesc('#/g/m2')).should('have.text', '4')
    cy.get(cesc('#/g2/m1')).should('have.text', '4')
    cy.get(cesc('#/g2/m2')).should('have.text', '4')
    cy.get(cesc('#/g3/m1')).should('have.text', '4')
    cy.get(cesc('#/g3/m2')).should('have.text', '4')

  });

  it('copy no link containing external copies use absolute source, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group newNamespace name="g">
      <p>m = <number copySource="../m" name="m1" /></p>
      <p>m = <number copySource="../m" name="m2" link="false" /></p>
    </group>
    
    <group copySource="g" name="g2" />
    <group copySource="g" link="false" name="g3" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/n')).should('have.text', '2')
    cy.get(cesc('#/m')).should('have.text', '4')
    cy.get(cesc('#/g/m1')).should('have.text', '4')
    cy.get(cesc('#/g/m2')).should('have.text', '4')
    cy.get(cesc('#/g2/m1')).should('have.text', '4')
    cy.get(cesc('#/g2/m2')).should('have.text', '4')
    cy.get(cesc('#/g3/m1')).should('have.text', '4')
    cy.get(cesc('#/g3/m2')).should('have.text', '4')

  });

  it('copy dynamic map no link, check aliases', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <section name="section1" newNamespace>
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" target="n" newValue="$n+1" >
        <label>Add P</label>
      </updateValue>
      <updateValue name="removeP" target="n" newValue="$n-1" >
        <label>Remove P</label>
      </updateValue>
      <map assignNames="(p1) (p2) (p3) (p4)">
        <template><p>i=$i, v=$v</p></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </section>
    
    <section name="section2" newNamespace>
      <copy source='../section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section3">
      <copy source='section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <copy source='section1' link='false' assignNames="section4" />
    
    <section name="section5" newNamespace>
      <copy source='../section1/_map1' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section6">
      <copy source='section1/_map1' assignNames='(p1a) (p2a) (p3a) (p4a)' />
    </section>

    <copy source='section1' assignNames="section7" />
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/section1_title')).should('have.text', 'Section 1')
    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2_title')).should('have.text', 'Section 2')
    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/section3_title')).should('have.text', 'Section 3')
    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4_title')).should('have.text', 'Section 4')
    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5_title')).should('have.text', 'Section 5')
    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/section6_title')).should('have.text', 'Section 6')
    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7_title')).should('have.text', 'Section 7')
    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section1/addP_button')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section7/removeP_button')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section4/addP_button')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section4/removeP_button')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


  });

  it('copy dynamic map no link, check aliases, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <section name="section1" newNamespace>
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" target="n" newValue="$n+1" >
        <label>Add P</label>
      </updateValue>
      <updateValue name="removeP" target="n" newValue="$n-1" >
        <label>Remove P</label>
      </updateValue>
      <map assignNames="(p1) (p2) (p3) (p4)">
        <template><p>i=$i, v=$v</p></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </section>
    
    <section name="section2" newNamespace>
      <map copySource='../section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section3">
      <map copySource='section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section copySource='section1' link='false' name="section4" />
    
    <section name="section5" newNamespace>
      <map copySource='../section1/_map1' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section6">
      <map copySource='section1/_map1' assignNames='(p1a) (p2a) (p3a) (p4a)' />
    </section>

    <section copySource='section1' name="section7" />
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/section1_title')).should('have.text', 'Section 1')
    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2_title')).should('have.text', 'Section 2')
    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/section3_title')).should('have.text', 'Section 3')
    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4_title')).should('have.text', 'Section 4')
    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5_title')).should('have.text', 'Section 5')
    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/section6_title')).should('have.text', 'Section 6')
    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7_title')).should('have.text', 'Section 7')
    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section1/addP_button')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section7/removeP_button')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section4/addP_button')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('have.text', "i=3, v=13");
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


    cy.get(cesc('#/section4/removeP_button')).click();

    cy.get(cesc('#/section1/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section1/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section1/p3')).should('not.exist');
    cy.get(cesc('#/section1/p4')).should('not.exist');

    cy.get(cesc('#/section2/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section2/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section2/p3')).should('not.exist');
    cy.get(cesc('#/section2/p4')).should('not.exist');

    cy.get(cesc('#/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3')).should('not.exist');
    cy.get(cesc('#/p4')).should('not.exist');

    cy.get(cesc('#/section4/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section4/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section4/p3')).should('not.exist');
    cy.get(cesc('#/section4/p4')).should('not.exist');

    cy.get(cesc('#/section5/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section5/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section5/p3')).should('not.exist');
    cy.get(cesc('#/section5/p4')).should('not.exist');

    cy.get(cesc('#/p1a')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/p2a')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/p3a')).should('not.exist');
    cy.get(cesc('#/p4a')).should('not.exist');

    cy.get(cesc('#/section7/p1')).should('have.text', "i=1, v=11");
    cy.get(cesc('#/section7/p2')).should('have.text', "i=2, v=12");
    cy.get(cesc('#/section7/p3')).should('not.exist');
    cy.get(cesc('#/section7/p4')).should('not.exist');


  });

  it('copy map source with no link', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of iterations: <mathinput name="n" /></p>

    <graph>
    
      <map name="map1" assignNames="(A B C) (D E F)">
      <template>
      
      <point x="$i{link='false'}" y='$i.value{link="false"}+1'>
      </point>
      <point>
        (<number copySource="i" link="false" /> + 2, <number copySource="i.value" link="false" /> +3)
      </point>
      <point>
        (<copy source="i" link="false" /> + 4, <copy source="i.value" link="false" /> +5)
      </point>
      </template>
      
      <sources alias="i"><sequence from="1" to="$n" /></sources>
      </map>
        
    </graph>

    <p>A: <copy source="A" assignNames="A2" /></p>
    <p>B: <copy source="B" assignNames="B2" /></p>
    <p>C: <copy source="C" assignNames="C2" /></p>
    <p>D: <copy source="D" assignNames="D2" /></p>
    <p>E: <copy source="E" assignNames="E2" /></p>
    <p>F: <copy source="F" assignNames="F2" /></p>
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/A2')).should('not.exist')
    cy.get(cesc('#/B2')).should('not.exist')
    cy.get(cesc('#/C2')).should('not.exist')
    cy.get(cesc('#/D2')).should('not.exist')
    cy.get(cesc('#/E2')).should('not.exist')
    cy.get(cesc('#/F2')).should('not.exist')

    cy.get('#\\/n textarea').type("1{enter}", { force: true });

    cy.get(cesc('#/A2') + ' .mjx-mrow').should('contain.text', '(1,2)')
    cy.get(cesc('#/A2') + ' .mjx-mrow').eq(0).should('have.text', '(1,2)')
    cy.get(cesc('#/B2') + ' .mjx-mrow').eq(0).should('have.text', '(3,4)')
    cy.get(cesc('#/C2') + ' .mjx-mrow').eq(0).should('have.text', '(5,6)')
    cy.get(cesc('#/D2')).should('not.exist')
    cy.get(cesc('#/E2')).should('not.exist')
    cy.get(cesc('#/F2')).should('not.exist')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9, y: 0 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 1, y: 8 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: 7, y: 2 }
      })
    })

    cy.get(cesc('#/C2') + ' .mjx-mrow').should('contain.text', '(7,2)')
    cy.get(cesc('#/A2') + ' .mjx-mrow').eq(0).should('have.text', '(9,0)')
    cy.get(cesc('#/B2') + ' .mjx-mrow').eq(0).should('have.text', '(1,8)')
    cy.get(cesc('#/C2') + ' .mjx-mrow').eq(0).should('have.text', '(7,2)')
    cy.get(cesc('#/D2')).should('not.exist')
    cy.get(cesc('#/E2')).should('not.exist')
    cy.get(cesc('#/F2')).should('not.exist')

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true });

    cy.get(cesc('#/D2') + ' .mjx-mrow').should('contain.text', '(2,3)')
    cy.get(cesc('#/A2') + ' .mjx-mrow').eq(0).should('have.text', '(9,0)')
    cy.get(cesc('#/B2') + ' .mjx-mrow').eq(0).should('have.text', '(1,8)')
    cy.get(cesc('#/C2') + ' .mjx-mrow').eq(0).should('have.text', '(7,2)')
    cy.get(cesc('#/D2') + ' .mjx-mrow').eq(0).should('have.text', '(2,3)')
    cy.get(cesc('#/E2') + ' .mjx-mrow').eq(0).should('have.text', '(4,5)')
    cy.get(cesc('#/F2') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/D",
        args: { x: 0, y: 10 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/E",
        args: { x: 9, y: 1 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/F",
        args: { x: 2, y: 8 }
      })
    })

    cy.get(cesc('#/F2') + ' .mjx-mrow').should('contain.text', '(2,8)')
    cy.get(cesc('#/A2') + ' .mjx-mrow').eq(0).should('have.text', '(9,0)')
    cy.get(cesc('#/B2') + ' .mjx-mrow').eq(0).should('have.text', '(1,8)')
    cy.get(cesc('#/C2') + ' .mjx-mrow').eq(0).should('have.text', '(7,2)')
    cy.get(cesc('#/D2') + ' .mjx-mrow').eq(0).should('have.text', '(0,10)')
    cy.get(cesc('#/E2') + ' .mjx-mrow').eq(0).should('have.text', '(9,1)')
    cy.get(cesc('#/F2') + ' .mjx-mrow').eq(0).should('have.text', '(2,8)')

    cy.get('#\\/n textarea').type("{end}{backspace}0{enter}", { force: true });

    cy.get(cesc('#/A2')).should('not.exist')
    cy.get(cesc('#/B2')).should('not.exist')
    cy.get(cesc('#/C2')).should('not.exist')
    cy.get(cesc('#/D2')).should('not.exist')
    cy.get(cesc('#/E2')).should('not.exist')
    cy.get(cesc('#/F2')).should('not.exist')

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true });

    cy.get(cesc('#/F2') + ' .mjx-mrow').should('contain.text', '(2,8)')
    cy.get(cesc('#/A2') + ' .mjx-mrow').eq(0).should('have.text', '(9,0)')
    cy.get(cesc('#/B2') + ' .mjx-mrow').eq(0).should('have.text', '(1,8)')
    cy.get(cesc('#/C2') + ' .mjx-mrow').eq(0).should('have.text', '(7,2)')
    cy.get(cesc('#/D2') + ' .mjx-mrow').eq(0).should('have.text', '(0,10)')
    cy.get(cesc('#/E2') + ' .mjx-mrow').eq(0).should('have.text', '(9,1)')
    cy.get(cesc('#/F2') + ' .mjx-mrow').eq(0).should('have.text', '(2,8)')
  });

  it('external content cannot reach outside namespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <copy uri="doenet:cid=bafkreih2fyavknvf6vog7ksfl4xpfagv5crdzg4jfaosowpoxssludkghm" assignNames="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/hi')).should('have.text', 'Bye');

    cy.get(cesc('#/greetings/hi')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c5')).should('have.text', 'Hello');


    cy.get(cesc('#/greetings/s/hi')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c4')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/s/s/hi')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l1')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/m1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c5')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c5')).should('have.text', 'Hello');

  });

  it('external content cannot reach outside namespace, external is single section', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <copy uri="doenet:cid=bafkreia6ggqxrjyelafunquyuqj3f7axlpgcy3aqy4dfjqsn7ypbsgeyma" assignNames="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/hi')).should('have.text', 'Bye');

    cy.get(cesc('#/greetings/hi')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c5')).should('have.text', 'Hello');


    cy.get(cesc('#/greetings/s/hi')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/l1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l2')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l3')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l4')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l5')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c5')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/s/s/hi')).should('have.text', 'Marhaban');

    cy.get(cesc('#/greetings/s/s/l1')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l2')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l3')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l4')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l5')).should('have.text', 'Marhaban');

    cy.get(cesc('#/greetings/s/s/m1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m2')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m3')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m4')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m5')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c5')).should('have.text', 'Hello');

  });

  it('external content cannot reach outside namespace, with copyFromURI', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <section copyFromURI="doenet:cid=bafkreia6ggqxrjyelafunquyuqj3f7axlpgcy3aqy4dfjqsn7ypbsgeyma" name="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/hi')).should('have.text', 'Bye');

    cy.get(cesc('#/greetings/hi')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c5')).should('have.text', 'Hello');


    cy.get(cesc('#/greetings/s/hi')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/l1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l2')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l3')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l4')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l5')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c5')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/s/s/hi')).should('have.text', 'Marhaban');

    cy.get(cesc('#/greetings/s/s/l1')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l2')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l3')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l4')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l5')).should('have.text', 'Marhaban');

    cy.get(cesc('#/greetings/s/s/m1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m2')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m3')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m4')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m5')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c5')).should('have.text', 'Hello');

  });

  it('external content cannot reach outside namespace, external has namespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <copy uri="doenet:cid=bafkreic3d52wrxarg3llo3hybczjm4gz2wq3qznwneup7bzpyqtvq6swea" assignNames="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/hi')).should('have.text', 'Bye');

    cy.get(cesc('#/greetings/hi')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c5')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/nm1')).should('not.exist');
    cy.get(cesc('#/greetings/nm2')).should('not.exist');
    cy.get(cesc('#/greetings/nm3')).should('not.exist');
    cy.get(cesc('#/greetings/nm4')).should('not.exist');

    cy.get(cesc('#/greetings/pNoMatch')).should('have.text', 'Four no matches:')

    cy.get(cesc('#/greetings/s/hi')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/l1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l2')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l3')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l4')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l5')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c5')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/s/nm1')).should('not.exist');
    cy.get(cesc('#/greetings/s/nm2')).should('not.exist');
    cy.get(cesc('#/greetings/s/nm3')).should('not.exist');
    cy.get(cesc('#/greetings/s/nm4')).should('not.exist');

    cy.get(cesc('#/greetings/s/pNoMatch')).should('have.text', 'Four no matches:')


    cy.get(cesc('#/greetings/s/s/hi')).should('have.text', 'Marhaban');

    cy.get(cesc('#/greetings/s/s/l1')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l2')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l3')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l4')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l5')).should('have.text', 'Marhaban');

    cy.get(cesc('#/greetings/s/s/m1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m2')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m3')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m4')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m5')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c5')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/s/s/nm1')).should('not.exist');
    cy.get(cesc('#/greetings/s/s/nm2')).should('not.exist');
    cy.get(cesc('#/greetings/s/s/nm3')).should('not.exist');
    cy.get(cesc('#/greetings/s/s/nm4')).should('not.exist');

    cy.get(cesc('#/greetings/s/s/pNoMatch')).should('have.text', 'Four no matches:')


  });

  it('external content cannot reach outside namespace, external has namespace, with copyFromURI', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <section copyFromURI="doenet:cid=bafkreic3d52wrxarg3llo3hybczjm4gz2wq3qznwneup7bzpyqtvq6swea" name="greetings" />

    <p>Don't get this: <text name="hi">Bye</text></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/hi')).should('have.text', 'Bye');

    cy.get(cesc('#/greetings/hi')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/c5')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/nm1')).should('not.exist');
    cy.get(cesc('#/greetings/nm2')).should('not.exist');
    cy.get(cesc('#/greetings/nm3')).should('not.exist');
    cy.get(cesc('#/greetings/nm4')).should('not.exist');

    cy.get(cesc('#/greetings/pNoMatch')).should('have.text', 'Four no matches:')

    cy.get(cesc('#/greetings/s/hi')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/l1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l2')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l3')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l4')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/l5')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/c5')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/s/nm1')).should('not.exist');
    cy.get(cesc('#/greetings/s/nm2')).should('not.exist');
    cy.get(cesc('#/greetings/s/nm3')).should('not.exist');
    cy.get(cesc('#/greetings/s/nm4')).should('not.exist');

    cy.get(cesc('#/greetings/s/pNoMatch')).should('have.text', 'Four no matches:')


    cy.get(cesc('#/greetings/s/s/hi')).should('have.text', 'Marhaban');

    cy.get(cesc('#/greetings/s/s/l1')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l2')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l3')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l4')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greetings/s/s/l5')).should('have.text', 'Marhaban');

    cy.get(cesc('#/greetings/s/s/m1')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m2')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m3')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m4')).should('have.text', 'Hola');
    cy.get(cesc('#/greetings/s/s/m5')).should('have.text', 'Hola');

    cy.get(cesc('#/greetings/s/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greetings/s/s/c5')).should('have.text', 'Hello');

    cy.get(cesc('#/greetings/s/s/nm1')).should('not.exist');
    cy.get(cesc('#/greetings/s/s/nm2')).should('not.exist');
    cy.get(cesc('#/greetings/s/s/nm3')).should('not.exist');
    cy.get(cesc('#/greetings/s/s/nm4')).should('not.exist');

    cy.get(cesc('#/greetings/s/s/pNoMatch')).should('have.text', 'Four no matches:')


  });

  it('external content inside external content cannot reach outside namespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <copy uri="doenet:cid=bafkreid3zm7azt6xdt7vdepymgfbl2r237iaxssvskpj7qd6owyszfamam" assignNames="greet" />

    <p>Don't get this 2: <text name="hi">Leave</text></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/hi')).should('have.text', 'Leave');

    cy.get(cesc('#/greet/hi')).should('have.text', 'Bye');

    cy.get(cesc('#/greet/greetings/hi')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c5')).should('have.text', 'Hello');


    cy.get(cesc('#/greet/greetings/s/hi')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/l1')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c4')).should('have.text', 'Hello');

    cy.get(cesc('#/greet/greetings/s/s/hi')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greet/greetings/s/s/l1')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greet/greetings/s/s/m1')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c5')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c5')).should('have.text', 'Hello');

  });

  it('external content inside external content cannot reach outside namespace, external is single section', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <copy uri="doenet:cid=bafkreibw2hnx6fjk56ofulow4cs5gfspz5audke3rxrbg6mi3yv5lvgnia" assignNames="greet" />

    <p>Don't get this 2: <text name="hi">Leave</text></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/hi')).should('have.text', 'Leave');

    cy.get(cesc('#/greet/hi')).should('have.text', 'Bye');

    cy.get(cesc('#/greet/greetings/hi')).should('have.text', 'Hello');

    cy.get(cesc('#/greet/greetings/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c5')).should('have.text', 'Hello');


    cy.get(cesc('#/greet/greetings/s/hi')).should('have.text', 'Hola');

    cy.get(cesc('#/greet/greetings/s/l1')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/l2')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/l3')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/l4')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/l5')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c4')).should('have.text', 'Hello');

    cy.get(cesc('#/greet/greetings/s/s/hi')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greet/greetings/s/s/l1')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greet/greetings/s/s/m1')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c5')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c5')).should('have.text', 'Hello');

  });

  it('external content inside external content cannot reach outside namespace, with copyFromURI', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <section copyfromuri="doenet:cid=bafkreibw2hnx6fjk56ofulow4cs5gfspz5audke3rxrbg6mi3yv5lvgnia" name="greet" />

    <p>Don't get this 2: <text name="hi">Leave</text></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/hi')).should('have.text', 'Leave');

    cy.get(cesc('#/greet/hi')).should('have.text', 'Bye');

    cy.get(cesc('#/greet/greetings/hi')).should('have.text', 'Hello');

    cy.get(cesc('#/greet/greetings/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/c5')).should('have.text', 'Hello');


    cy.get(cesc('#/greet/greetings/s/hi')).should('have.text', 'Hola');

    cy.get(cesc('#/greet/greetings/s/l1')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/l2')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/l3')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/l4')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/l5')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/c4')).should('have.text', 'Hello');

    cy.get(cesc('#/greet/greetings/s/s/hi')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greet/greetings/s/s/l1')).should('have.text', 'Marhaban');
    cy.get(cesc('#/greet/greetings/s/s/m1')).should('have.text', 'Hola');
    cy.get(cesc('#/greet/greetings/s/s/c1')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c2')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c3')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c4')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c5')).should('have.text', 'Hello');
    cy.get(cesc('#/greet/greetings/s/s/c5')).should('have.text', 'Hello');

  });

  it('copy of template source maintained when withheld', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput name="n" /></p>

    <graph name='g1'>
      <map name="map1" assignNames="t1 t2">
        <template newNamespace>
          <point name="A" x="$(i{link='false' fixed='false'})" y='1'/>
        </template>
        <sources alias="i"><sequence from="1" to="$n" /></sources>
      </map>
    </graph>
    
    <p><m name="m1">A_1 = <copy source="t1/A" displayDigits="3" /></m></p>
    <p><m name="m2">A_2 = <copy source="t2/A" displayDigits="3" /></m></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })

    cy.log('Add point')

    cy.get('#\\/n textarea').type("1{enter}", { force: true })
    cy.get('#\\/m1').should('contain.text', 'A1=(1,1)')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(1,1)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })


    cy.log('Move point')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/t1/A",
        args: { x: -3, y: 7 }
      })
    })

    cy.get('#\\/m1').should('contain.text', 'A1=(−3,7)')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(−3,7)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })


    cy.log('Remove point')
    cy.get('#\\/n textarea').type("{end}{backspace}0{enter}", { force: true })

    cy.get('#\\/m1').should('not.contain.text', 'A1=(−3,7)')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })


    cy.log('Remember coordinates when restore point since copy was maintained')

    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get('#\\/m1 .mjx-mrow').should('contain.text', 'A1=(−3,7)')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(−3,7)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })


    cy.log('Add second point')

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })
    cy.get('#\\/m2 .mjx-mrow').should('contain.text', 'A2=(2,1)')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(−3,7)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=(2,1)')
    })


    cy.log('Move second point')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      win.callAction1({
        actionName: "movePoint",
        componentName: "/t2/A",
        args: { x: 5, y: -4 }
      })
    })

    cy.get('#\\/m2 .mjx-mrow').should('contain.text', 'A2=(5,−4)')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(−3,7)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=(5,−4)')
    })


    cy.log('Remove both points')
    cy.get('#\\/n textarea').type("{end}{backspace}0{enter}", { force: true })

    cy.get('#\\/m1 .mjx-mrow').should('not.contain.text', 'A1=(−3,7)')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=')
    })


    cy.log('Remember coordinates of both points')

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })
    cy.get('#\\/m1 .mjx-mrow').should('contain.text', 'A1=(−3,7)')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A1=(−3,7)')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A2=(5,−4)')
    })


  });

  it('trim whitespace off source', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text name="hi">Hello</text>
    <p><copy source=" hi  " /> there</p>
    `}, "*");
    });

    cy.get('#\\/hi').should('have.text', 'Hello');
    cy.get('#\\/_p1').should('have.text', 'Hello there')


  });

  it('trim whitespace off source, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text name="hi">Hello</text>
    <p><text copySource=" hi  " /> there</p>
    `}, "*");
    });

    cy.get('#\\/hi').should('have.text', 'Hello');
    cy.get('#\\/_p1').should('have.text', 'Hello there')


  });

  it('copy of external content retains desired variant', () => {
    let doenetML = `
    <text>a</text>
    <copy assignNames="problem1" uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" />
    `;

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariantIndex: 1
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');


    let catInd, choiceOrder;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1/_select1"].stateValues.currentVariantName).eq("cat");
      let choices = stateVariables['/problem1/_choiceinput1'].stateValues.choiceTexts;
      catInd = choices.indexOf("meow") + 1;
      choiceOrder = stateVariables['/problem1/_choiceinput1'].stateValues.choiceOrder;

      cy.get(cesc(`#/problem1/_choiceinput1_choice${catInd}_input`)).click();
    })


    cy.get(cesc(`#/problem1/_choiceinput1_submit`)).click();
    cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');

    cy.wait(2000);  // make sure 1 second debounce occurred

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariantIndex: 1
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let foundIt = Boolean(stateVariables["/problem1/_choiceinput1"]?.stateValues?.choiceTexts);
      return foundIt;
    }))


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1/_select1"].stateValues.currentVariantName).eq("cat");
      expect(stateVariables['/problem1/_choiceinput1'].stateValues.choiceOrder).eqls(choiceOrder);
      let choices = [...stateVariables['/problem1/_choiceinput1'].stateValues.choiceTexts];
      expect(choices.indexOf("meow") + 1).eq(catInd);
    })


  });

  it('copy of external content retains desired variant, with copyfromuri', () => {
    let doenetML = `
    <text>a</text>
    <problem name="problem1" copyFromURI="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" />
    `;

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariantIndex: 1
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');


    let catInd, choiceOrder;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1/_select1"].stateValues.currentVariantName).eq("cat");
      let choices = stateVariables['/problem1/_choiceinput1'].stateValues.choiceTexts;
      catInd = choices.indexOf("meow") + 1;
      choiceOrder = stateVariables['/problem1/_choiceinput1'].stateValues.choiceOrder;

      cy.get(cesc(`#/problem1/_choiceinput1_choice${catInd}_input`)).click();
    })


    cy.get(cesc(`#/problem1/_choiceinput1_submit`)).click();
    cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');

    cy.wait(2000);  // make sure 1 second debounce occurred

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariantIndex: 1
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let foundIt = Boolean(stateVariables["/problem1/_choiceinput1"]?.stateValues?.choiceTexts);
      return foundIt;
    }))


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1/_select1"].stateValues.currentVariantName).eq("cat");
      expect(stateVariables['/problem1/_choiceinput1'].stateValues.choiceOrder).eqls(choiceOrder);
      let choices = [...stateVariables['/problem1/_choiceinput1'].stateValues.choiceTexts];
      expect(choices.indexOf("meow") + 1).eq(catInd);
    })


  });

  it('copy of external content retains desired variant, no problem in external content', () => {
    let doenetML = `
    <text>a</text>
    <copy assignNames="problem1" uri="doenet:CID=bafkreidqud3rixmphu3jufuke4rw7magtcrbrjgeo6ihkoyonsig7wciey" />
    `;

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariantIndex: 1
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');


    let catInd, choiceOrder;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1/_select1"].stateValues.currentVariantName).eq("cat");
      let choices = stateVariables['/problem1/_choiceinput1'].stateValues.choiceTexts;
      catInd = choices.indexOf("meow") + 1;
      choiceOrder = stateVariables['/problem1/_choiceinput1'].stateValues.choiceOrder;

      cy.get(cesc(`#/problem1/_choiceinput1_choice${catInd}_input`)).click();
    })


    cy.get(cesc(`#/problem1/_choiceinput1_submit`)).click();
    cy.get(cesc(`#/problem1/_choiceinput1_correct`)).should('be.visible');

    cy.wait(2000);  // make sure 1 second debounce occurred

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariantIndex: 1
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let foundIt = Boolean(stateVariables["/problem1/_choiceinput1"]?.stateValues?.choiceTexts);
      return foundIt;
    }))


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/problem1/_select1"].stateValues.currentVariantName).eq("cat");
      expect(stateVariables['/problem1/_choiceinput1'].stateValues.choiceOrder).eqls(choiceOrder);
      let choices = [...stateVariables['/problem1/_choiceinput1'].stateValues.choiceTexts];
      expect(choices.indexOf("meow") + 1).eq(catInd);
    })


  });

  it('copy with newNamespace retains original names, even with group', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp"><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section><copy name="c1" source="_p1" newNamespace /></section>
      
      <copy name="c2" source="c1" />
      <copy name="c3" source="c1" assignNames="p1a" />
      <copy name="c4" source="c1" newNamespace />
      <copy name="c5" source="c1" newNamespace assignNames="p1b" />
      
      <copy name="c7" source="_section1" />
      <copy name="c8" source="_section1" assignNames="s1a" />
      <copy name="c9" source="_section1" newNamespace />
      <copy name="c10" source="_section1" newNamespace assignNames="s1b" />
    
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');
    cy.get(cesc('#/_number1')).should('have.text', '1');
    cy.get(cesc('#/_number2')).should('have.text', '2');
    cy.get(cesc('#/_number3')).should('have.text', '3');

    cy.get(cesc('#/c1/_number1')).should('have.text', '1');
    cy.get(cesc('#/c1/_number2')).should('have.text', '2');
    cy.get(cesc('#/c1/_number3')).should('have.text', '3');

    cy.get(cesc('#/c4/_number1')).should('have.text', '1');
    cy.get(cesc('#/c4/_number2')).should('have.text', '2');
    cy.get(cesc('#/c4/_number3')).should('have.text', '3');

    cy.get(cesc('#/c9/c1/_number1')).should('have.text', '1');
    cy.get(cesc('#/c9/c1/_number2')).should('have.text', '2');
    cy.get(cesc('#/c9/c1/_number3')).should('have.text', '3');

    cy.get(cesc('#/_p1')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1a')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/c5/p1b')).should('have.text', 'values: 1 2 3')

    cy.get(cesc('#/_section1')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1a')).invoke('text').then(text => {
      expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/c10/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/c2"].replacements[0].componentName;
      let c3p = stateVariables["/c3"].replacements[0].componentName;
      let c4p = stateVariables["/c4"].replacements[0].componentName;
      let c5p = stateVariables["/c5"].replacements[0].componentName;
      let c7s = stateVariables["/c7"].replacements[0].componentName;
      let c8s = stateVariables["/c8"].replacements[0].componentName;
      let c9s = stateVariables["/c9"].replacements[0].componentName;
      let c10s = stateVariables["/c10"].replacements[0].componentName;

      cy.get(cesc('#' + c2p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c3p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c4p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c5p)).should('have.text', 'values: 1 2 3')

      cy.get(cesc('#' + c7s)).invoke('text').then(text => {
        expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c8s)).invoke('text').then(text => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c9s)).invoke('text').then(text => {
        expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c10s)).invoke('text').then(text => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null
      })

      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/c1/_number1"].stateValues.value).eq(1)
        expect(stateVariables["/c1/_number2"].stateValues.value).eq(2)
        expect(stateVariables["/c1/_number3"].stateValues.value).eq(3)

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__")
        expect(c2pChildNames[1].slice(0, 3)).eq("/__")
        expect(c2pChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c3p's children should have gotten unique names (so begin with two underscores)
        let c3pChildNames = stateVariables[c3p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c3pChildNames[0].slice(0, 3)).eq("/__")
        expect(c3pChildNames[1].slice(0, 3)).eq("/__")
        expect(c3pChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c3pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c3pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c3pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have retained their original names
        let c4pChildNames = stateVariables[c4p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c4pChildNames[0]).eq("/c4/_number1")
        expect(c4pChildNames[1]).eq("/c4/_number2")
        expect(c4pChildNames[2]).eq("/c4/_number3")
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c5p's children should have gotten unique names (so begin with two underscores after namespace)
        let c5pChildNames = stateVariables[c5p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c5pChildNames[0].slice(0, 6)).eq("/c5/__")
        expect(c5pChildNames[1].slice(0, 6)).eq("/c5/__")
        expect(c5pChildNames[2].slice(0, 6)).eq("/c5/__")
        expect(stateVariables[c5pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c5pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c5pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__")
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__")
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // c8s's grandchildren should have gotten unique names (so begin with two underscores)
        let c8sChildName = stateVariables[c8s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c8sGrandChildNames = stateVariables[c8sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c8sGrandChildNames[0].slice(0, 3)).eq("/__")
        expect(c8sGrandChildNames[1].slice(0, 3)).eq("/__")
        expect(c8sGrandChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c8sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c8sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c8sGrandChildNames[2]].stateValues.value).eq(3);


        // c9s's grandchildren should have retained their original names
        let c9sChildName = stateVariables[c9s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c9sGrandChildNames[0]).eq("/c9/c1/_number1")
        expect(c9sGrandChildNames[1]).eq("/c9/c1/_number2")
        expect(c9sGrandChildNames[2]).eq("/c9/c1/_number3")
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);


        // c10s's grandchildren should have gotten unique names (so begin with two underscores after namespace)
        let c10sChildName = stateVariables[c10s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c10sGrandChildNames = stateVariables[c10sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c10sGrandChildNames[0].slice(0, 7)).eq("/c10/__")
        expect(c10sGrandChildNames[1].slice(0, 7)).eq("/c10/__")
        expect(c10sGrandChildNames[2].slice(0, 7)).eq("/c10/__")
        expect(stateVariables[c10sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c10sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c10sGrandChildNames[2]].stateValues.value).eq(3);


      })


    })
  });

  it('copy with newNamespace retains original names, even with group, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp"><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section><p name="p1a" copySource="_p1" newNamespace /></section>
      
      <p copySource="p1a" name="p1b" />
      <p copySource="p1a" newNamespace name="p1c" />
      
      <section copySource="_section1" name="s1a" />
      <section copySource="_section1" newNamespace name="s1b" />
    
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');
    cy.get(cesc('#/_number1')).should('have.text', '1');
    cy.get(cesc('#/_number2')).should('have.text', '2');
    cy.get(cesc('#/_number3')).should('have.text', '3');

    cy.get(cesc('#/p1a/_number1')).should('have.text', '1');
    cy.get(cesc('#/p1a/_number2')).should('have.text', '2');
    cy.get(cesc('#/p1a/_number3')).should('have.text', '3');

    cy.get(cesc('#/p1b/_number1')).should('have.text', '1');
    cy.get(cesc('#/p1b/_number2')).should('have.text', '2');
    cy.get(cesc('#/p1b/_number3')).should('have.text', '3');

    cy.get(cesc('#/p1c/_number1')).should('have.text', '1');
    cy.get(cesc('#/p1c/_number2')).should('have.text', '2');
    cy.get(cesc('#/p1c/_number3')).should('have.text', '3');

    cy.get(cesc('#/s1b/p1a/_number1')).should('have.text', '1');
    cy.get(cesc('#/s1b/p1a/_number2')).should('have.text', '2');
    cy.get(cesc('#/s1b/p1a/_number3')).should('have.text', '3');

    cy.get(cesc('#/_p1')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1a')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1b')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1c')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/s1b/p1a')).should('have.text', 'values: 1 2 3')

    cy.get(cesc('#/_section1')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1a')).invoke('text').then(text => {
      expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1)
      expect(stateVariables["/p1a/_number2"].stateValues.value).eq(2)
      expect(stateVariables["/p1a/_number3"].stateValues.value).eq(3)

      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1)
      expect(stateVariables["/p1b/_number2"].stateValues.value).eq(2)
      expect(stateVariables["/p1b/_number3"].stateValues.value).eq(3)

      expect(stateVariables["/p1c/_number1"].stateValues.value).eq(1)
      expect(stateVariables["/p1c/_number2"].stateValues.value).eq(2)
      expect(stateVariables["/p1c/_number3"].stateValues.value).eq(3)

      // s1a's grandchildren should have gotten unique names (so begin with two underscores)
      let s1aChildName = stateVariables['/s1a'].activeChildren[0].componentName;
      let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);
      expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__")
      expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__")
      expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__")
      expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
      expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
      expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

    })
  });

  it('copy with newNamespace retains original names, even with group that assigns names', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp" assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n3">3</number></p>
      
      <section><copy name="c1" source="_p1" newNamespace /></section>
      
      <copy name="c2" source="c1" />
      <copy name="c3" source="c1" assignNames="p1a" />
      <copy name="c4" source="c1" newNamespace />
      <copy name="c5" source="c1" newNamespace assignNames="p1b" />
      
      <copy name="c7" source="_section1" />
      <copy name="c8" source="_section1" assignNames="s1a" />
      <copy name="c9" source="_section1" newNamespace />
      <copy name="c10" source="_section1" newNamespace assignNames="s1b" />
    
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');
    cy.get(cesc('#/n1')).should('have.text', '1');
    cy.get(cesc('#/n2')).should('have.text', '2');
    cy.get(cesc('#/n3')).should('have.text', '3');

    cy.get(cesc('#/c1/n1')).should('have.text', '1');
    cy.get(cesc('#/c1/n2')).should('have.text', '2');
    cy.get(cesc('#/c1/n3')).should('have.text', '3');

    cy.get(cesc('#/c4/n1')).should('have.text', '1');
    cy.get(cesc('#/c4/n2')).should('have.text', '2');
    cy.get(cesc('#/c4/n3')).should('have.text', '3');

    cy.get(cesc('#/c9/c1/n1')).should('have.text', '1');
    cy.get(cesc('#/c9/c1/n2')).should('have.text', '2');
    cy.get(cesc('#/c9/c1/n3')).should('have.text', '3');

    cy.get(cesc('#/_p1')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1a')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/c5/p1b')).should('have.text', 'values: 1 2 3')

    cy.get(cesc('#/_section1')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1a')).invoke('text').then(text => {
      expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/c10/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/c2"].replacements[0].componentName;
      let c3p = stateVariables["/c3"].replacements[0].componentName;
      let c4p = stateVariables["/c4"].replacements[0].componentName;
      let c5p = stateVariables["/c5"].replacements[0].componentName;
      let c7s = stateVariables["/c7"].replacements[0].componentName;
      let c8s = stateVariables["/c8"].replacements[0].componentName;
      let c9s = stateVariables["/c9"].replacements[0].componentName;
      let c10s = stateVariables["/c10"].replacements[0].componentName;

      cy.get(cesc('#' + c2p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c3p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c4p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c5p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c7s)).invoke('text').then(text => {
        expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c8s)).invoke('text').then(text => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c9s)).invoke('text').then(text => {
        expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c10s)).invoke('text').then(text => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null
      })
      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/c1/n1"].stateValues.value).eq(1)
        expect(stateVariables["/c1/n2"].stateValues.value).eq(2)
        expect(stateVariables["/c1/n3"].stateValues.value).eq(3)

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__")
        expect(c2pChildNames[1].slice(0, 3)).eq("/__")
        expect(c2pChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c3p's children should have gotten unique names (so begin with two underscores)
        let c3pChildNames = stateVariables[c3p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c3pChildNames[0].slice(0, 3)).eq("/__")
        expect(c3pChildNames[1].slice(0, 3)).eq("/__")
        expect(c3pChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c3pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c3pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c3pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have retained their original names
        let c4pChildNames = stateVariables[c4p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c4pChildNames[0]).eq("/c4/n1")
        expect(c4pChildNames[1]).eq("/c4/n2")
        expect(c4pChildNames[2]).eq("/c4/n3")
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c5p's children should have gotten unique names (so begin with two underscores after namespace)
        let c5pChildNames = stateVariables[c5p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c5pChildNames[0].slice(0, 6)).eq("/c5/__")
        expect(c5pChildNames[1].slice(0, 6)).eq("/c5/__")
        expect(c5pChildNames[2].slice(0, 6)).eq("/c5/__")
        expect(stateVariables[c5pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c5pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c5pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__")
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__")
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // c8s's grandchildren should have gotten unique names (so begin with two underscores)
        let c8sChildName = stateVariables[c8s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c8sGrandChildNames = stateVariables[c8sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c8sGrandChildNames[0].slice(0, 3)).eq("/__")
        expect(c8sGrandChildNames[1].slice(0, 3)).eq("/__")
        expect(c8sGrandChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c8sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c8sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c8sGrandChildNames[2]].stateValues.value).eq(3);


        // c9s's grandchildren should have retained their original names
        let c9sChildName = stateVariables[c9s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c9sGrandChildNames[0]).eq("/c9/c1/n1")
        expect(c9sGrandChildNames[1]).eq("/c9/c1/n2")
        expect(c9sGrandChildNames[2]).eq("/c9/c1/n3")
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);


        // c10s's grandchildren should have gotten unique names (so begin with two underscores after namespace)
        let c10sChildName = stateVariables[c10s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c10sGrandChildNames = stateVariables[c10sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c10sGrandChildNames[0].slice(0, 7)).eq("/c10/__")
        expect(c10sGrandChildNames[1].slice(0, 7)).eq("/c10/__")
        expect(c10sGrandChildNames[2].slice(0, 7)).eq("/c10/__")
        expect(stateVariables[c10sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c10sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c10sGrandChildNames[2]].stateValues.value).eq(3);

      })


    })
  });

  it('copy with newNamespace retains original names, even with group that assigns names, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp" assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n3">3</number></p>
      
      <section><p name="p1a" copySource="_p1" newNamespace /></section>
      
      <p copySource="p1a" name="p1b" />
      <p copySource="p1a" newNamespace name="p1c" />
      
      <section copySource="_section1" name="s1a" />
      <section copySource="_section1" newNamespace name="s1b" />
    
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');
    cy.get(cesc('#/n1')).should('have.text', '1');
    cy.get(cesc('#/n2')).should('have.text', '2');
    cy.get(cesc('#/n3')).should('have.text', '3');

    cy.get(cesc('#/p1a/n1')).should('have.text', '1');
    cy.get(cesc('#/p1a/n2')).should('have.text', '2');
    cy.get(cesc('#/p1a/n3')).should('have.text', '3');

    cy.get(cesc('#/p1b/n1')).should('have.text', '1');
    cy.get(cesc('#/p1b/n2')).should('have.text', '2');
    cy.get(cesc('#/p1b/n3')).should('have.text', '3');

    cy.get(cesc('#/p1c/n1')).should('have.text', '1');
    cy.get(cesc('#/p1c/n2')).should('have.text', '2');
    cy.get(cesc('#/p1c/n3')).should('have.text', '3');

    cy.get(cesc('#/s1b/p1a/n1')).should('have.text', '1');
    cy.get(cesc('#/s1b/p1a/n2')).should('have.text', '2');
    cy.get(cesc('#/s1b/p1a/n3')).should('have.text', '3');

    cy.get(cesc('#/_p1')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1a')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1b')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1c')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/s1b/p1a')).should('have.text', 'values: 1 2 3')

    cy.get(cesc('#/_section1')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1a')).invoke('text').then(text => {
      expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/p1a/n1"].stateValues.value).eq(1)
      expect(stateVariables["/p1a/n2"].stateValues.value).eq(2)
      expect(stateVariables["/p1a/n3"].stateValues.value).eq(3)

      expect(stateVariables["/p1b/n1"].stateValues.value).eq(1)
      expect(stateVariables["/p1b/n2"].stateValues.value).eq(2)
      expect(stateVariables["/p1b/n3"].stateValues.value).eq(3)

      expect(stateVariables["/p1c/n1"].stateValues.value).eq(1)
      expect(stateVariables["/p1c/n2"].stateValues.value).eq(2)
      expect(stateVariables["/p1c/n3"].stateValues.value).eq(3)

      // s1a's grandchildren should have gotten unique names (so begin with two underscores)
      let s1aChildName = stateVariables['/s1a'].activeChildren[0].componentName;
      let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);
      expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__")
      expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__")
      expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__")
      expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
      expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
      expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);

    })
  });

  it('copy with newNamespace retains original names, even with group that has new namespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp" newNamespace><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section><copy name="c1" source="_p1" newNamespace /></section>
      
      <copy name="c2" source="c1" />
      <copy name="c3" source="c1" assignNames="p1a" />
      <copy name="c4" source="c1" newNamespace />
      <copy name="c5" source="c1" newNamespace assignNames="p1b" />
      
      <copy name="c7" source="_section1" />
      <copy name="c8" source="_section1" assignNames="s1a" />
      <copy name="c9" source="_section1" newNamespace />
      <copy name="c10" source="_section1" newNamespace assignNames="s1b" />
    
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');
    cy.get(cesc('#/grp/_number1')).should('have.text', '1');
    cy.get(cesc('#/grp/_number2')).should('have.text', '2');
    cy.get(cesc('#/_number1')).should('have.text', '3');

    cy.get(cesc('#/c1/grp/_number1')).should('have.text', '1');
    cy.get(cesc('#/c1/grp/_number2')).should('have.text', '2');
    cy.get(cesc('#/c1/_number1')).should('have.text', '3');

    cy.get(cesc('#/c4/grp/_number1')).should('have.text', '1');
    cy.get(cesc('#/c4/grp/_number2')).should('have.text', '2');
    cy.get(cesc('#/c4/_number1')).should('have.text', '3');

    cy.get(cesc('#/c9/c1/grp/_number1')).should('have.text', '1');
    cy.get(cesc('#/c9/c1/grp/_number2')).should('have.text', '2');
    cy.get(cesc('#/c9/c1/_number1')).should('have.text', '3');

    cy.get(cesc('#/_p1')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1a')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/c5/p1b')).should('have.text', 'values: 1 2 3')

    cy.get(cesc('#/_section1')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1a')).invoke('text').then(text => {
      expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/c10/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/c2"].replacements[0].componentName;
      let c3p = stateVariables["/c3"].replacements[0].componentName;
      let c4p = stateVariables["/c4"].replacements[0].componentName;
      let c5p = stateVariables["/c5"].replacements[0].componentName;
      let c7s = stateVariables["/c7"].replacements[0].componentName;
      let c8s = stateVariables["/c8"].replacements[0].componentName;
      let c9s = stateVariables["/c9"].replacements[0].componentName;
      let c10s = stateVariables["/c10"].replacements[0].componentName;

      cy.get(cesc('#' + c2p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c3p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c4p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c5p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c7s)).invoke('text').then(text => {
        expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c8s)).invoke('text').then(text => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c9s)).invoke('text').then(text => {
        expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c10s)).invoke('text').then(text => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null
      })

      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/c1/grp/_number1"].stateValues.value).eq(1)
        expect(stateVariables["/c1/grp/_number2"].stateValues.value).eq(2)
        expect(stateVariables["/c1/_number1"].stateValues.value).eq(3)

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__")
        expect(c2pChildNames[1].slice(0, 3)).eq("/__")
        expect(c2pChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c3p's children should have gotten unique names (so begin with two underscores)
        let c3pChildNames = stateVariables[c3p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c3pChildNames[0].slice(0, 3)).eq("/__")
        expect(c3pChildNames[1].slice(0, 3)).eq("/__")
        expect(c3pChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c3pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c3pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c3pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have retained their original names
        let c4pChildNames = stateVariables[c4p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c4pChildNames[0]).eq("/c4/grp/_number1")
        expect(c4pChildNames[1]).eq("/c4/grp/_number2")
        expect(c4pChildNames[2]).eq("/c4/_number1")
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c5p's children should have gotten unique names (so begin with two underscores after namespace)
        let c5pChildNames = stateVariables[c5p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c5pChildNames[0].slice(0, 6)).eq("/c5/__")
        expect(c5pChildNames[1].slice(0, 6)).eq("/c5/__")
        expect(c5pChildNames[2].slice(0, 6)).eq("/c5/__")
        expect(stateVariables[c5pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c5pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c5pChildNames[2]].stateValues.value).eq(3);

        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__")
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__")
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // c8s's grandchildren should have gotten unique names (so begin with two underscores)
        let c8sChildName = stateVariables[c8s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c8sGrandChildNames = stateVariables[c8sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c8sGrandChildNames[0].slice(0, 3)).eq("/__")
        expect(c8sGrandChildNames[1].slice(0, 3)).eq("/__")
        expect(c8sGrandChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c8sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c8sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c8sGrandChildNames[2]].stateValues.value).eq(3);


        // c9s's grandchildren should have retained their original names
        let c9sChildName = stateVariables[c9s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c9sGrandChildNames[0]).eq("/c9/c1/grp/_number1")
        expect(c9sGrandChildNames[1]).eq("/c9/c1/grp/_number2")
        expect(c9sGrandChildNames[2]).eq("/c9/c1/_number1")
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);


        // c10s's grandchildren should have gotten unique names (so begin with two underscores after namespace)
        let c10sChildName = stateVariables[c10s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c10sGrandChildNames = stateVariables[c10sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c10sGrandChildNames[0].slice(0, 7)).eq("/c10/__")
        expect(c10sGrandChildNames[1].slice(0, 7)).eq("/c10/__")
        expect(c10sGrandChildNames[2].slice(0, 7)).eq("/c10/__")
        expect(stateVariables[c10sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c10sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c10sGrandChildNames[2]].stateValues.value).eq(3);

      })


    })
  });

  it('copy with newNamespace retains original names, even with group that has new namespace, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp" newNamespace><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section><p name="p1a" copySource="_p1" newNamespace /></section>
      
      <p copySource="p1a" name="p1b" />
      <p copySource="p1a" newNamespace name="p1c" />
      
      <section copySource="_section1" name="s1a" />
      <section copySource="_section1" newNamespace name="s1b" />
    
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');
    cy.get(cesc('#/grp/_number1')).should('have.text', '1');
    cy.get(cesc('#/grp/_number2')).should('have.text', '2');
    cy.get(cesc('#/_number1')).should('have.text', '3');

    cy.get(cesc('#/p1a/grp/_number1')).should('have.text', '1');
    cy.get(cesc('#/p1a/grp/_number2')).should('have.text', '2');
    cy.get(cesc('#/p1a/_number1')).should('have.text', '3');

    cy.get(cesc('#/p1b/grp/_number1')).should('have.text', '1');
    cy.get(cesc('#/p1b/grp/_number2')).should('have.text', '2');
    cy.get(cesc('#/p1b/_number1')).should('have.text', '3');

    cy.get(cesc('#/p1c/grp/_number1')).should('have.text', '1');
    cy.get(cesc('#/p1c/grp/_number2')).should('have.text', '2');
    cy.get(cesc('#/p1c/_number1')).should('have.text', '3');


    cy.get(cesc('#/_p1')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1a')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1b')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1c')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/s1b/p1a')).should('have.text', 'values: 1 2 3')

    cy.get(cesc('#/_section1')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1a')).invoke('text').then(text => {
      expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/p1a/grp/_number1"].stateValues.value).eq(1)
      expect(stateVariables["/p1a/grp/_number2"].stateValues.value).eq(2)
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(3)

      expect(stateVariables["/p1b/grp/_number1"].stateValues.value).eq(1)
      expect(stateVariables["/p1b/grp/_number2"].stateValues.value).eq(2)
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(3)

      expect(stateVariables["/p1c/grp/_number1"].stateValues.value).eq(1)
      expect(stateVariables["/p1c/grp/_number2"].stateValues.value).eq(2)
      expect(stateVariables["/p1c/_number1"].stateValues.value).eq(3)


      // s1a's grandchildren should have gotten unique names (so begin with two underscores)
      let s1aChildName = stateVariables['/s1a'].activeChildren[0].componentName;
      let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);
      expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__")
      expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__")
      expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__")
      expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
      expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
      expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);


    })
  });

  it('copy with newNamespace retains original names, even with group that has new namespace and assigns names', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp" newNamespace assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n1">3</number></p>
      
      <section><copy name="c1" source="_p1" newNamespace /></section>
      
      <copy name="c2" source="c1" />
      <copy name="c3" source="c1" assignNames="p1a" />
      <copy name="c4" source="c1" newNamespace />
      <copy name="c5" source="c1" newNamespace assignNames="p1b" />
      <copy name="c6" source="c1" newNamespace assignNames="grp" />
      
      <copy name="c7" source="_section1" />
      <copy name="c8" source="_section1" assignNames="s1a" />
      <copy name="c9" source="_section1" newNamespace />
      <copy name="c10" source="_section1" newNamespace assignNames="s1b" />
      <copy name="c11" source="_section1" newNamespace assignNames="grp" />
    
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');
    cy.get(cesc('#/grp/n1')).should('have.text', '1');
    cy.get(cesc('#/grp/n2')).should('have.text', '2');
    cy.get(cesc('#/n1')).should('have.text', '3');

    cy.get(cesc('#/c1/grp/n1')).should('have.text', '1');
    cy.get(cesc('#/c1/grp/n2')).should('have.text', '2');
    cy.get(cesc('#/c1/n1')).should('have.text', '3');

    cy.get(cesc('#/c4/grp/n1')).should('have.text', '1');
    cy.get(cesc('#/c4/grp/n2')).should('have.text', '2');
    cy.get(cesc('#/c4/n1')).should('have.text', '3');

    cy.get(cesc('#/c9/c1/grp/n1')).should('have.text', '1');
    cy.get(cesc('#/c9/c1/grp/n2')).should('have.text', '2');
    cy.get(cesc('#/c9/c1/n1')).should('have.text', '3');

    cy.get(cesc('#/_p1')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1a')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/c5/p1b')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/c6/grp')).should('have.text', 'values: 1 2 3')

    cy.get(cesc('#/_section1')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1a')).invoke('text').then(text => {
      expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/c10/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/c11/grp')).invoke('text').then(text => {
      expect(text.match(/Section 6\s*values: 1 2 3/)).not.be.null
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c2p = stateVariables["/c2"].replacements[0].componentName;
      let c3p = stateVariables["/c3"].replacements[0].componentName;
      let c4p = stateVariables["/c4"].replacements[0].componentName;
      let c5p = stateVariables["/c5"].replacements[0].componentName;
      let c6p = stateVariables["/c6"].replacements[0].componentName;
      let c7s = stateVariables["/c7"].replacements[0].componentName;
      let c8s = stateVariables["/c8"].replacements[0].componentName;
      let c9s = stateVariables["/c9"].replacements[0].componentName;
      let c10s = stateVariables["/c10"].replacements[0].componentName;
      let c11s = stateVariables["/c11"].replacements[0].componentName;

      cy.get(cesc('#' + c2p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c3p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c4p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c5p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c6p)).should('have.text', 'values: 1 2 3')
      cy.get(cesc('#' + c7s)).invoke('text').then(text => {
        expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c8s)).invoke('text').then(text => {
        expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c9s)).invoke('text').then(text => {
        expect(text.match(/Section 4\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c10s)).invoke('text').then(text => {
        expect(text.match(/Section 5\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c11s)).invoke('text').then(text => {
        expect(text.match(/Section 6\s*values: 1 2 3/)).not.be.null
      })

      // put in window just so happens after above
      cy.window().then(async (win) => {
        expect(stateVariables["/c1/grp/n1"].stateValues.value).eq(1)
        expect(stateVariables["/c1/grp/n2"].stateValues.value).eq(2)
        expect(stateVariables["/c1/n1"].stateValues.value).eq(3)

        // c2p's children should have gotten unique names (so begin with two underscores)
        let c2pChildNames = stateVariables[c2p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c2pChildNames[0].slice(0, 3)).eq("/__")
        expect(c2pChildNames[1].slice(0, 3)).eq("/__")
        expect(c2pChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c2pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c2pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c2pChildNames[2]].stateValues.value).eq(3);

        // c3p's children should have gotten unique names (so begin with two underscores)
        let c3pChildNames = stateVariables[c3p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c3pChildNames[0].slice(0, 3)).eq("/__")
        expect(c3pChildNames[1].slice(0, 3)).eq("/__")
        expect(c3pChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c3pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c3pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c3pChildNames[2]].stateValues.value).eq(3);

        // c4p's children should have retained their original names
        let c4pChildNames = stateVariables[c4p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c4pChildNames[0]).eq("/c4/grp/n1")
        expect(c4pChildNames[1]).eq("/c4/grp/n2")
        expect(c4pChildNames[2]).eq("/c4/n1")
        expect(stateVariables[c4pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c4pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c4pChildNames[2]].stateValues.value).eq(3);

        // c5p's children should have gotten unique names (so begin with two underscores after namespace)
        let c5pChildNames = stateVariables[c5p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c5pChildNames[0].slice(0, 6)).eq("/c5/__")
        expect(c5pChildNames[1].slice(0, 6)).eq("/c5/__")
        expect(c5pChildNames[2].slice(0, 6)).eq("/c5/__")
        expect(stateVariables[c5pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c5pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c5pChildNames[2]].stateValues.value).eq(3);

        // c6p's children should have gotten unique names (so begin with two underscores after namespace)
        let c6pChildNames = stateVariables[c6p].activeChildren.filter(x => x.componentName).map(x => x.componentName);
        expect(c6pChildNames[0].slice(0, 6)).eq("/c6/__")
        expect(c6pChildNames[1].slice(0, 6)).eq("/c6/__")
        expect(c6pChildNames[2].slice(0, 6)).eq("/c6/__")
        expect(stateVariables[c6pChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c6pChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c6pChildNames[2]].stateValues.value).eq(3);


        // c7s's grandchildren should have gotten unique names (so begin with two underscores)
        let c7sChildName = stateVariables[c7s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c7sGrandChildNames = stateVariables[c7sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c7sGrandChildNames[0].slice(0, 3)).eq("/__")
        expect(c7sGrandChildNames[1].slice(0, 3)).eq("/__")
        expect(c7sGrandChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c7sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c7sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c7sGrandChildNames[2]].stateValues.value).eq(3);

        // c8s's grandchildren should have gotten unique names (so begin with two underscores)
        let c8sChildName = stateVariables[c8s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c8sGrandChildNames = stateVariables[c8sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c8sGrandChildNames[0].slice(0, 3)).eq("/__")
        expect(c8sGrandChildNames[1].slice(0, 3)).eq("/__")
        expect(c8sGrandChildNames[2].slice(0, 3)).eq("/__")
        expect(stateVariables[c8sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c8sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c8sGrandChildNames[2]].stateValues.value).eq(3);


        // c9s's grandchildren should have retained their original names
        let c9sChildName = stateVariables[c9s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c9sGrandChildNames = stateVariables[c9sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c9sGrandChildNames[0]).eq("/c9/c1/grp/n1")
        expect(c9sGrandChildNames[1]).eq("/c9/c1/grp/n2")
        expect(c9sGrandChildNames[2]).eq("/c9/c1/n1")
        expect(stateVariables[c9sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c9sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c9sGrandChildNames[2]].stateValues.value).eq(3);


        // c10s's grandchildren should have gotten unique names (so begin with two underscores after namespace)
        let c10sChildName = stateVariables[c10s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c10sGrandChildNames = stateVariables[c10sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c10sGrandChildNames[0].slice(0, 7)).eq("/c10/__")
        expect(c10sGrandChildNames[1].slice(0, 7)).eq("/c10/__")
        expect(c10sGrandChildNames[2].slice(0, 7)).eq("/c10/__")
        expect(stateVariables[c10sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c10sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c10sGrandChildNames[2]].stateValues.value).eq(3);


        // c11s's grandchildren should have gotten unique names (so begin with two underscores after namespace)
        let c11sChildName = stateVariables[c11s].activeChildren.filter(x => x.componentName)[0].componentName;
        let c11sGrandChildNames = stateVariables[c11sChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);

        expect(c11sGrandChildNames[0].slice(0, 7)).eq("/c11/__")
        expect(c11sGrandChildNames[1].slice(0, 7)).eq("/c11/__")
        expect(c11sGrandChildNames[2].slice(0, 7)).eq("/c11/__")
        expect(stateVariables[c11sGrandChildNames[0]].stateValues.value).eq(1);
        expect(stateVariables[c11sGrandChildNames[1]].stateValues.value).eq(2);
        expect(stateVariables[c11sGrandChildNames[2]].stateValues.value).eq(3);


      })


    })
  });

  it('copy with newNamespace retains original names, even with group that has new namespace and assigns names, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp" newNamespace assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n1">3</number></p>
      
      <section><p name="p1a" copySource="_p1" newNamespace /></section>
      
      <p copySource="p1a" name="p1b" />
      <p copySource="p1a" newNamespace name="p1c" />
      
      <section copySource="_section1" name="s1a" />
      <section copySource="_section1" newNamespace name="s1b" />
    
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');
    cy.get(cesc('#/grp/n1')).should('have.text', '1');
    cy.get(cesc('#/grp/n2')).should('have.text', '2');
    cy.get(cesc('#/n1')).should('have.text', '3');

    cy.get(cesc('#/p1a/grp/n1')).should('have.text', '1');
    cy.get(cesc('#/p1a/grp/n2')).should('have.text', '2');
    cy.get(cesc('#/p1a/n1')).should('have.text', '3');

    cy.get(cesc('#/p1b/grp/n1')).should('have.text', '1');
    cy.get(cesc('#/p1b/grp/n2')).should('have.text', '2');
    cy.get(cesc('#/p1b/n1')).should('have.text', '3');

    cy.get(cesc('#/p1c/grp/n1')).should('have.text', '1');
    cy.get(cesc('#/p1c/grp/n2')).should('have.text', '2');
    cy.get(cesc('#/p1c/n1')).should('have.text', '3');


    cy.get(cesc('#/_p1')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1a')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1b')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/p1c')).should('have.text', 'values: 1 2 3')
    cy.get(cesc('#/s1b/p1a')).should('have.text', 'values: 1 2 3')

    cy.get(cesc('#/_section1')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1a')).invoke('text').then(text => {
      expect(text.match(/Section 2\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 3\s*values: 1 2 3/)).not.be.null
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/p1a/grp/n1"].stateValues.value).eq(1)
      expect(stateVariables["/p1a/grp/n2"].stateValues.value).eq(2)
      expect(stateVariables["/p1a/n1"].stateValues.value).eq(3)

      expect(stateVariables["/p1b/grp/n1"].stateValues.value).eq(1)
      expect(stateVariables["/p1b/grp/n2"].stateValues.value).eq(2)
      expect(stateVariables["/p1b/n1"].stateValues.value).eq(3)

      expect(stateVariables["/p1c/grp/n1"].stateValues.value).eq(1)
      expect(stateVariables["/p1c/grp/n2"].stateValues.value).eq(2)
      expect(stateVariables["/p1c/n1"].stateValues.value).eq(3)


      // s1a's grandchildren should have gotten unique names (so begin with two underscores)
      let s1aChildName = stateVariables['/s1a'].activeChildren[0].componentName;
      let s1aGrandChildNames = stateVariables[s1aChildName].activeChildren.filter(x => x.componentName).map(x => x.componentName);
      expect(s1aGrandChildNames[0].slice(0, 3)).eq("/__")
      expect(s1aGrandChildNames[1].slice(0, 3)).eq("/__")
      expect(s1aGrandChildNames[2].slice(0, 3)).eq("/__")
      expect(stateVariables[s1aGrandChildNames[0]].stateValues.value).eq(1);
      expect(stateVariables[s1aGrandChildNames[1]].stateValues.value).eq(2);
      expect(stateVariables[s1aGrandChildNames[2]].stateValues.value).eq(3);


    })
  });

  it('copy group of groups retains name', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="grp" newNamespace><number name="num1">1</number> <number name="num2">2</number> <group><number name="num3">3</number><number name="num4">4</number><group><number name="num5">5</number><number name="num6">6</number></group></group></group>

      <copy source="grp" assignNames="grp2" />
      
      <group copySource="grp2" name="grp3" />

      <group copySource="grp2/_group1" name="grp4" newNamespace />
      <group copySource="grp3/_group1" name="grp5" newNamespace />

    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');

    cy.get(cesc('#/grp/num1')).should('have.text', '1');
    cy.get(cesc('#/grp/num2')).should('have.text', '2');
    cy.get(cesc('#/grp/num3')).should('have.text', '3');
    cy.get(cesc('#/grp/num4')).should('have.text', '4');
    cy.get(cesc('#/grp/num5')).should('have.text', '5');
    cy.get(cesc('#/grp/num6')).should('have.text', '6');

    cy.get(cesc('#/grp2/num1')).should('have.text', '1');
    cy.get(cesc('#/grp2/num2')).should('have.text', '2');
    cy.get(cesc('#/grp2/num3')).should('have.text', '3');
    cy.get(cesc('#/grp2/num4')).should('have.text', '4');
    cy.get(cesc('#/grp2/num5')).should('have.text', '5');
    cy.get(cesc('#/grp2/num6')).should('have.text', '6');

    cy.get(cesc('#/grp3/num1')).should('have.text', '1');
    cy.get(cesc('#/grp3/num2')).should('have.text', '2');
    cy.get(cesc('#/grp3/num3')).should('have.text', '3');
    cy.get(cesc('#/grp3/num4')).should('have.text', '4');
    cy.get(cesc('#/grp3/num5')).should('have.text', '5');
    cy.get(cesc('#/grp3/num6')).should('have.text', '6');

    cy.get(cesc('#/grp4/num3')).should('have.text', '3');
    cy.get(cesc('#/grp4/num4')).should('have.text', '4');
    cy.get(cesc('#/grp4/num5')).should('have.text', '5');
    cy.get(cesc('#/grp4/num6')).should('have.text', '6');

    cy.get(cesc('#/grp5/num3')).should('have.text', '3');
    cy.get(cesc('#/grp5/num4')).should('have.text', '4');
    cy.get(cesc('#/grp5/num5')).should('have.text', '5');
    cy.get(cesc('#/grp5/num6')).should('have.text', '6');

  })

  it('copy group, avoid name collision when assign subnames', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="grp" newNamespace><number name="num1">1</number> <number name="num2">2</number></group>

      <p><copy source="grp" assignNames="(num2)" /></p>
      

    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');

    cy.get(cesc('#/_p1')).should('have.text', "1 2")

  })

  it('copy componentIndex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>n: <mathinput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <copy source="col" assignNames="A2 B2" componentIndex="$n" />
    </graph>
  
    <copy source="g2" name="g3" newNamespace />

    <aslist name="al"><copy prop="x" source="col" componentIndex="$n" assignNames="Ax Bx" /></aslist>

    <copy source="al" name="al2" newNamespace />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.get('#\\/Ax .mjx-mrow').should('not.exist');
    cy.get('#\\/Bx .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/Ax .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/A2']).eq(undefined);
      expect(stateVariables["/g3/A2"]).eq(undefined);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/B2']).eq(undefined);
      expect(stateVariables["/g3/B2"]).eq(undefined);
      expect(stateVariables['/Ax']).eq(undefined);
      expect(stateVariables["/al2/Ax"]).eq(undefined);
      expect(stateVariables['/Bx']).eq(undefined);
      expect(stateVariables["/al2/Bx"]).eq(undefined);
    });

    cy.log('restrict collection to first component');

    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/Bx .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');
    cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
    cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/A2'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/B2']).eq(undefined);
      expect(stateVariables["/g3/B2"]).eq(undefined);
      expect(stateVariables['/Ax'].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      expect(stateVariables['/Bx']).eq(undefined);
      expect(stateVariables["/al2/Bx"]).eq(undefined);
    });

    cy.log('move copied point')
    cy.window().then(async (win) => {
      x1 = 9, y1 = -5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: x1, y: y1 }
      })

      cy.get('#\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B2']).eq(undefined);
        expect(stateVariables["/g3/B2"]).eq(undefined);
        expect(stateVariables['/Ax'].stateValues.value).eq(x1);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
        expect(stateVariables['/Bx']).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
      });

    })

    cy.log('collect second component');

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })


    cy.window().then(async (win) => {

      cy.get('#\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B2']).eq(undefined);
        expect(stateVariables["/g3/B2"]).eq(undefined);
        expect(stateVariables['/Ax'].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
        expect(stateVariables['/Bx']).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
      });

    })


    cy.log('move double copied point')
    cy.window().then(async (win) => {
      x2 = 0, y2 = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A2",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B2']).eq(undefined);
        expect(stateVariables["/g3/B2"]).eq(undefined);
        expect(stateVariables['/Ax'].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
        expect(stateVariables['/Bx']).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
      });

    })

  })

  it('copy componentIndex, array notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>n: <mathinput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <copy source="col[$n]" assignNames="A2 B2" />
    </graph>
  
    <copy source="g2" name="g3" newNamespace />

    <aslist name="al"><copy source="col[$n].x" assignNames="Ax Bx" /></aslist>

    <copy source="al" name="al2" newNamespace />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.get('#\\/Ax .mjx-mrow').should('not.exist');
    cy.get('#\\/Bx .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/Ax .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/A2']).eq(undefined);
      expect(stateVariables["/g3/A2"]).eq(undefined);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/B2']).eq(undefined);
      expect(stateVariables["/g3/B2"]).eq(undefined);
      expect(stateVariables['/Ax']).eq(undefined);
      expect(stateVariables["/al2/Ax"]).eq(undefined);
      expect(stateVariables['/Bx']).eq(undefined);
      expect(stateVariables["/al2/Bx"]).eq(undefined);
    });

    cy.log('restrict collection to first component');

    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/Bx .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');
    cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
    cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/A2'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/B2']).eq(undefined);
      expect(stateVariables["/g3/B2"]).eq(undefined);
      expect(stateVariables['/Ax'].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      expect(stateVariables['/Bx']).eq(undefined);
      expect(stateVariables["/al2/Bx"]).eq(undefined);
    });

    cy.log('move copied point')
    cy.window().then(async (win) => {
      x1 = 9, y1 = -5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: x1, y: y1 }
      })

      cy.get('#\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B2']).eq(undefined);
        expect(stateVariables["/g3/B2"]).eq(undefined);
        expect(stateVariables['/Ax'].stateValues.value).eq(x1);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
        expect(stateVariables['/Bx']).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
      });

    })

    cy.log('restrict collection to second component');

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })


    cy.window().then(async (win) => {

      cy.get('#\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B2']).eq(undefined);
        expect(stateVariables["/g3/B2"]).eq(undefined);
        expect(stateVariables['/Ax'].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
        expect(stateVariables['/Bx']).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
      });

    })


    cy.log('move double copied point')
    cy.window().then(async (win) => {
      x2 = 0, y2 = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A2",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B2']).eq(undefined);
        expect(stateVariables["/g3/B2"]).eq(undefined);
        expect(stateVariables['/Ax'].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
        expect(stateVariables['/Bx']).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
      });

    })

  })

  it('copy componentIndex, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>n: <mathinput name="n" prefill="1" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <point copySource="col" name="A2" componentIndex="$n" />
    </graph>
  
    <graph copySource="g2" name="g3" newNamespace />
  
    <aslist name="al"><math copyprop="x" copySource="col" componentIndex="$n" name="Ax" /></aslist>
  
    <aslist copySource="al" name="al2" newNamespace />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
    cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/A2'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/Ax'].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
    });

    cy.log('move copied point')
    cy.window().then(async (win) => {
      x1 = 9, y1 = -5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: x1, y: y1 }
      })

      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/Ax'].stateValues.value).eq(x1);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      });

    })

    cy.log('restrict collection to second component');

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })


    cy.window().then(async (win) => {

      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/Ax'].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
      });

    })


    cy.log('move double copied point')
    cy.window().then(async (win) => {
      x2 = 0, y2 = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A2",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/Ax'].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
      });

    })

  })

  it('copy componentIndex, with copySource, array notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>n: <mathinput name="n" prefill="1" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <point copySource="col[$n]" name="A2" />
    </graph>
  
    <graph copySource="g2" name="g3" newNamespace />
  
    <aslist name="al"><math copySource="col[$n].x" name="Ax" /></aslist>
  
    <aslist copySource="al" name="al2" newNamespace />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
    cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/A2'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/Ax'].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
    });

    cy.log('move copied point')
    cy.window().then(async (win) => {
      x1 = 9, y1 = -5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A2",
        args: { x: x1, y: y1 }
      })

      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/Ax'].stateValues.value).eq(x1);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      });

    })

    cy.log('restrict collection to second component');

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })


    cy.window().then(async (win) => {

      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/Ax'].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
      });

    })


    cy.log('move double copied point')
    cy.window().then(async (win) => {
      x2 = 0, y2 = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A2",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/A2'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/Ax'].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
      });

    })

  })

  it('copy propIndex and componentIndex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>m: <mathinput name="m" /></p>
    <p>n: <mathinput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><copy prop="xs" source="col" componentIndex="$m" propIndex="$n" assignNames="n1 n2 n3 n4" /></aslist></p>

    <p><copy source="al" name="al2" newNamespace /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.get('#\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/n4 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/n1']).eq(undefined);
      expect(stateVariables['/n2']).eq(undefined);
      expect(stateVariables['/n3']).eq(undefined);
      expect(stateVariables['/n4']).eq(undefined);
      expect(stateVariables['/al2/n1']).eq(undefined);
      expect(stateVariables['/al2/n2']).eq(undefined);
      expect(stateVariables['/al2/n3']).eq(undefined);
      expect(stateVariables['/al2/n4']).eq(undefined);
    });

    cy.log('set propIndex to 1');

    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/n4 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/n1']).eq(undefined);
      expect(stateVariables['/n2']).eq(undefined);
      expect(stateVariables['/n3']).eq(undefined);
      expect(stateVariables['/n4']).eq(undefined);
      expect(stateVariables['/al2/n1']).eq(undefined);
      expect(stateVariables['/al2/n2']).eq(undefined);
      expect(stateVariables['/al2/n3']).eq(undefined);
      expect(stateVariables['/al2/n4']).eq(undefined);
    });

    cy.log('move point 1')
    cy.window().then(async (win) => {
      x1 = 9, y1 = -5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: x1, y: y1 }
      })

      cy.get('#\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1']).eq(undefined);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1']).eq(undefined);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })

    cy.log('set componentIndex to 2');

    cy.get('#\\/m textarea').type("2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });

    })


    cy.log('move point2')
    cy.window().then(async (win) => {
      x2 = 0, y2 = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })


    cy.log('set propIndex to 2')
    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(y2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(y2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(y2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(y2);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })


    cy.log('set componentIndex to 1')
    cy.get('#\\/m textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(y1));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(y1));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(y1);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(y1);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })



    cy.log('set propIndex to 3')
    cy.get('#\\/n textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1']).eq(undefined);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1']).eq(undefined);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })


    cy.log('set propIndex to 1')
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x1);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x1);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })



    cy.log('set componentIndex to 3')
    cy.get('#\\/m textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1']).eq(undefined);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1']).eq(undefined);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })


    cy.log('set componentIndex to 2')
    cy.get('#\\/m textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })

    cy.log('clear propIndex')
    cy.get('#\\/n textarea').type("{end}{backspace}{enter}", { force: true })

    cy.get('#\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/n4 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/n1']).eq(undefined);
      expect(stateVariables['/n2']).eq(undefined);
      expect(stateVariables['/n3']).eq(undefined);
      expect(stateVariables['/n4']).eq(undefined);
      expect(stateVariables['/al2/n1']).eq(undefined);
      expect(stateVariables['/al2/n2']).eq(undefined);
      expect(stateVariables['/al2/n3']).eq(undefined);
      expect(stateVariables['/al2/n4']).eq(undefined);
    })

  })

  it('copy propIndex and componentIndex, array notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>m: <mathinput name="m" /></p>
    <p>n: <mathinput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><copy source="col[$m].xs[$n]" assignNames="n1 n2 n3 n4" /></aslist></p>

    <p><copy source="al" name="al2" newNamespace /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.get('#\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/n4 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/n1']).eq(undefined);
      expect(stateVariables['/n2']).eq(undefined);
      expect(stateVariables['/n3']).eq(undefined);
      expect(stateVariables['/n4']).eq(undefined);
      expect(stateVariables['/al2/n1']).eq(undefined);
      expect(stateVariables['/al2/n2']).eq(undefined);
      expect(stateVariables['/al2/n3']).eq(undefined);
      expect(stateVariables['/al2/n4']).eq(undefined);
    });

    cy.log('set propIndex to 1');

    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/n4 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/n1']).eq(undefined);
      expect(stateVariables['/n2']).eq(undefined);
      expect(stateVariables['/n3']).eq(undefined);
      expect(stateVariables['/n4']).eq(undefined);
      expect(stateVariables['/al2/n1']).eq(undefined);
      expect(stateVariables['/al2/n2']).eq(undefined);
      expect(stateVariables['/al2/n3']).eq(undefined);
      expect(stateVariables['/al2/n4']).eq(undefined);
    });

    cy.log('move point 1')
    cy.window().then(async (win) => {
      x1 = 9, y1 = -5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: x1, y: y1 }
      })

      cy.get('#\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1']).eq(undefined);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1']).eq(undefined);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })

    cy.log('set componentIndex to 2');

    cy.get('#\\/m textarea').type("2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });

    })


    cy.log('move point2')
    cy.window().then(async (win) => {
      x2 = 0, y2 = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })


    cy.log('set propIndex to 2')
    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(y2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(y2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(y2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(y2);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })


    cy.log('set componentIndex to 1')
    cy.get('#\\/m textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(y1));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(y1));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(y1);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(y1);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })



    cy.log('set propIndex to 3')
    cy.get('#\\/n textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1']).eq(undefined);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1']).eq(undefined);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })


    cy.log('set propIndex to 1')
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x1);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x1);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })



    cy.log('set componentIndex to 3')
    cy.get('#\\/m textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1']).eq(undefined);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1']).eq(undefined);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })


    cy.log('set componentIndex to 2')
    cy.get('#\\/m textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n2']).eq(undefined);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })

    cy.log('clear propIndex')
    cy.get('#\\/n textarea').type("{end}{backspace}{enter}", { force: true })

    cy.get('#\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/n4 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/n1']).eq(undefined);
      expect(stateVariables['/n2']).eq(undefined);
      expect(stateVariables['/n3']).eq(undefined);
      expect(stateVariables['/n4']).eq(undefined);
      expect(stateVariables['/al2/n1']).eq(undefined);
      expect(stateVariables['/al2/n2']).eq(undefined);
      expect(stateVariables['/al2/n3']).eq(undefined);
      expect(stateVariables['/al2/n4']).eq(undefined);
    })

  })

  it('copy propIndex and componentIndex, with copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>m: <mathinput name="m" prefill="2" /></p>
    <p>n: <mathinput name="n" prefill="1" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><math copyprop="xs" copySource="col" componentIndex="$m" propIndex="$n" name="n1" /></aslist></p>

    <p><aslist copySource="al" name="al2" newNamespace /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
      });

    })


    cy.log('move point2')
    cy.window().then(async (win) => {
      x2 = 0, y2 = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
      });
    })


    cy.log('set propIndex to 2')
    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(y2));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(y2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(y2);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(y2);
      });
    })


    cy.log('set componentIndex to 1')
    cy.get('#\\/m textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(y1));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(y1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(y1);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(y1);
      });
    })



    cy.log('set propIndex to 3')
    cy.get('#\\/n textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', '\uff3f');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', '\uff3f');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq('\uff3f');
        expect(stateVariables['/al2/n1'].stateValues.value).eq('\uff3f');
      });
    })


    cy.log('set propIndex to 1')
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x1);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x1);
      });
    })



    cy.log('set componentIndex to 3')
    cy.get('#\\/m textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', '\uff3f');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', '\uff3f');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq('\uff3f');
        expect(stateVariables['/al2/n1'].stateValues.value).eq('\uff3f');
      });
    })


    cy.log('set componentIndex to 2')
    cy.get('#\\/m textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
      });
    })

    cy.log('clear propIndex')
    cy.get('#\\/n textarea').type("{end}{backspace}{enter}", { force: true })

    cy.window().then(async (win) => {
      cy.get('#\\/n1 .mjx-mrow').should('contain.text', '\uff3f');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', '\uff3f');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq('\uff3f');
        expect(stateVariables['/al2/n1'].stateValues.value).eq('\uff3f');
      });
    })

  })

  it('copy propIndex and componentIndex, with copySource, array notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>m: <mathinput name="m" prefill="2" /></p>
    <p>n: <mathinput name="n" prefill="1" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>

    <graph name="g1a">
      <collect name="col" componentTypes="point" source="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><math copySource="col[$m].xs[$n]" name="n1" /></aslist></p>

    <p><aslist copySource="al" name="al2" newNamespace /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
      });

    })


    cy.log('move point2')
    cy.window().then(async (win) => {
      x2 = 0, y2 = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
      });
    })


    cy.log('set propIndex to 2')
    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(y2));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(y2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(y2);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(y2);
      });
    })


    cy.log('set componentIndex to 1')
    cy.get('#\\/m textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(y1));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(y1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(y1);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(y1);
      });
    })



    cy.log('set propIndex to 3')
    cy.get('#\\/n textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', '\uff3f');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', '\uff3f');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq('\uff3f');
        expect(stateVariables['/al2/n1'].stateValues.value).eq('\uff3f');
      });
    })


    cy.log('set propIndex to 1')
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x1);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x1);
      });
    })



    cy.log('set componentIndex to 3')
    cy.get('#\\/m textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', '\uff3f');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', '\uff3f');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq('\uff3f');
        expect(stateVariables['/al2/n1'].stateValues.value).eq('\uff3f');
      });
    })


    cy.log('set componentIndex to 2')
    cy.get('#\\/m textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('not.exist');
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
      });
    })

    cy.log('clear propIndex')
    cy.get('#\\/n textarea').type("{end}{backspace}{enter}", { force: true })

    cy.window().then(async (win) => {
      cy.get('#\\/n1 .mjx-mrow').should('contain.text', '\uff3f');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', '\uff3f');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq('\uff3f');
        expect(stateVariables['/al2/n1'].stateValues.value).eq('\uff3f');
      });
    })

  })

  it('target attributes to ignore, component and primitive attributes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p newNamespace name="p1" hide fixed>Hidden text: <text name="hidden" hide fixed newNamespace>secret <text name="pw">password</text></text></p>

    <p name="p2">Text revealed by default: <copy source="p1/hidden" name="c1" assignNames="notHidden" /></p>
    <p name="p3">Because source attributes to ignore are: <copy prop="sourceAttributesToIgnore" source="c1" obtainPropFromComposite /></p>
    <p name="p4">Check attributes: <copy prop="hidden" source="notHidden" /> <copy prop="fixed" source="notHidden" /> <copy prop="newNamespace" source="notHidden" /></p>
    <p name="p5">Check if new namespace copied: <copy source="notHidden/pw"/></p>

    <p>Text but not paragraph stays hidden by default:</p>
    <copy source="p1" name="c2" assignNames="p6" />
    <p name="p7">Because source attributes to ignore are: <copy prop="sourceAttributesToIgnore" source="c2" obtainPropFromComposite /></p>
    <p name="p8">Check attributes: <copy prop="hidden" source="p6" /> <copy prop="fixed" source="p6" /> <copy prop="newNamespace" source="p6" /> <copy prop="hidden" source="p6/hidden" /> <copy prop="fixed" source="p6/hidden" /> <copy prop="newNamespace" source="p6/hidden" /></p>
    <p name="p9">Check if inner new namespace copied: <copy source="p6/hidden/pw"/></p>


    <p name="p10">Now text stays hidden: <copy source="p1/hidden" name="c3" assignNames="stillHidden" sourceAttributesToIgnore="newNamespace fixed" /></p>
    <p name="p11">Because source attributes to ignore are: <copy prop="sourceAttributesToIgnore" source="c3" obtainPropFromComposite /></p>
    <p name="p12">Check attributes: <copy prop="hidden" source="stillHidden" /> <copy prop="fixed" source="stillHidden" /> <copy prop="newNamespace" source="stillHidden" /></p>
    <p name="p13">Check that new namespace not copied: <copy source="stillHidden/pw" /></p>

    <p>Now paragraph stay hidden:</p>
    <copy source="p1" name="c4" assignNames="p14" sourceAttributesToIgnore="newNamespace fixed" />
    <p name="p15">Because source attributes to ignore are: <copy prop="sourceAttributesToIgnore" source="c4" obtainPropFromComposite /></p>
    <p name="p16">Check attributes: <copy prop="hidden" source="p14" /> <copy prop="fixed" source="p14" /> <copy prop="newNamespace" source="p14" /></p>
    <p name="p17">Check that outer new namespace not copied: <copy source="p14/hidden"/></p>


    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/p1').should('not.exist');

    cy.get('#\\/p2').should('have.text', 'Text revealed by default: secret password');
    cy.get('#\\/p3').should('have.text', 'Because source attributes to ignore are: hide');
    cy.get('#\\/p4').should('have.text', 'Check attributes: false true true');
    cy.get('#\\/p5').should('have.text', 'Check if new namespace copied: password')

    cy.get('#\\/p6').should('have.text', 'Hidden text: ')
    cy.get('#\\/p7').should('have.text', 'Because source attributes to ignore are: hide')
    cy.get('#\\/p8').should('have.text', 'Check attributes: false true true true true true');
    cy.get('#\\/p9').should('have.text', 'Check if inner new namespace copied: password')

    cy.get('#\\/p10').should('have.text', 'Now text stays hidden: ');
    cy.get('#\\/p11').should('have.text', 'Because source attributes to ignore are: newNamespace, fixed');
    cy.get('#\\/p12').should('have.text', 'Check attributes: true false false');
    cy.get('#\\/p13').should('have.text', 'Check that new namespace not copied: ')

    cy.get('#\\/p14').should('not.exist');
    cy.get('#\\/p15').should('have.text', 'Because source attributes to ignore are: newNamespace, fixed');
    cy.get('#\\/p16').should('have.text', 'Check attributes: true false false');
    cy.get('#\\/p17').should('have.text', 'Check that outer new namespace not copied: ')

    // TODO: is there a way to check that inner new namespace was maintained?

  });

  it('target attributes to ignore recursively', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p name="p1" hide newNamespace fixed isResponse>The text: <text name="hidden" hide fixed isResponse>secret</text></p>

    <p>Text but not paragraph stays hidden by default:</p>
    <copy source="p1" name="c1" assignNames="p2" />
    <p name="p3">Because source attributes to ignore recursively are: <copy prop="sourceAttributesToIgnoreRecursively" source="c1" obtainPropFromComposite /></p>
    <p name="p4">Check attributes: <copy prop="hidden" source="p2" /> <copy prop="fixed" source="p2" /> <copy prop="isResponse" source="p2" /> <copy prop="hidden" source="p2/hidden" /> <copy prop="fixed" source="p2/hidden" /> <copy prop="isResponse" source="p2/hidden" /></p>

    <p>Now all is revealed:</p>
    <copy source="p1" name="c2" assignNames="p5" sourceAttributesToIgnoreRecursively="hide fixed" />
    <p name="p6">Because source attributes to ignore recursively are: <copy prop="sourceAttributesToIgnoreRecursively" source="c2" obtainPropFromComposite /></p>
    <p name="p7">Check attributes: <copy prop="hidden" source="p5" /> <copy prop="fixed" source="p5" /> <copy prop="isResponse" source="p5" /> <copy prop="hidden" source="p5/hidden" /> <copy prop="fixed" source="p5/hidden" /> <copy prop="isResponse" source="p5/hidden" /></p>


    <p>All is still revealed:</p>
    <copy source="p1" name="c3" assignNames="p8" sourceAttributesToIgnoreRecursively="hide" sourceAttributesToIgnore="fixed isResponse" />
    <p name="p9">Because source attributes to ignore recursively are: <copy prop="sourceAttributesToIgnoreRecursively" source="c3" obtainPropFromComposite /></p>
    <p name="p10">And source attributes to ignore are: <copy prop="sourceAttributesToIgnore" source="c3" obtainPropFromComposite /></p>
    <p name="p11">Check attributes: <copy prop="hidden" source="p8" /> <copy prop="fixed" source="p8" /> <copy prop="isResponse" source="p8" /> <copy prop="hidden" source="p8/hidden" /> <copy prop="fixed" source="p8/hidden" /> <copy prop="isResponse" source="p8/hidden" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/p1').should('not.exist');

    cy.get('#\\/p2').should('have.text', 'The text: ');
    cy.get('#\\/p3').should('have.text', 'Because source attributes to ignore recursively are: isResponse');
    cy.get('#\\/p4').should('have.text', 'Check attributes: false true false true true false');

    cy.get('#\\/p5').should('have.text', 'The text: secret');
    cy.get('#\\/p6').should('have.text', 'Because source attributes to ignore recursively are: hide, fixed');
    cy.get('#\\/p7').should('have.text', 'Check attributes: false false true false false true');

    cy.get('#\\/p8').should('have.text', 'The text: secret');
    cy.get('#\\/p9').should('have.text', 'Because source attributes to ignore recursively are: hide');
    cy.get('#\\/p10').should('have.text', 'And source attributes to ignore are: fixed, isResponse');
    cy.get('#\\/p11').should('have.text', 'Check attributes: false false false false true true');

  });

  it('copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g1">
      <point name="P">(1,2)</point>
    </graph>
    <copy source="P.x" assignNames="P1x" />
    <graph name="g2" newNamespace>
      <point name="P">(3,4)</point>
    </graph>
    <copy source="g2/P.x" assignNames="P2x" />
    <graph name="g3">
      <point copySource="P" name="Pa" />
    </graph>
    <graph name="g4" newNamespace>
      <point copySource="../g2/P" name="Pa" />
    </graph>
    <graph copySource="g1" name="g5" />
    <graph copySource="g2" name="g6" />
    <graph copySource="g3" name="g7" />
    <graph copySource="g4" name="g8" />

    <graph copySource="g1" name="g9" newNamespace />
    <graph copySource="g2" name="g10" newNamespace />
    <graph copySource="g3" name="g11" newNamespace />
    <graph copySource="g4" name="g12" newNamespace />

    <graph copySource="g5" name="g13" />
    <graph copySource="g6" name="g14" />
    <graph copySource="g7" name="g15" />
    <graph copySource="g8" name="g16" />
    <graph copySource="g9" name="g17" />
    <graph copySource="g10" name="g18" />
    <graph copySource="g11" name="g19" />
    <graph copySource="g12" name="g20" />
  
    <graph copySource="g5" name="g21" newNamespace />
    <graph copySource="g6" name="g22" newNamespace />
    <graph copySource="g7" name="g23" newNamespace />
    <graph copySource="g8" name="g24" newNamespace />
    <graph copySource="g9" name="g25" newNamespace />
    <graph copySource="g10" name="g26" newNamespace />
    <graph copySource="g11" name="g27" newNamespace />
    <graph copySource="g12" name="g28" newNamespace />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let P1 = [1, 2];
    let P2 = [3, 4]

    cy.get(cesc('#/P1x')).contains(`${P1[0]}`);
    cy.get(cesc('#/P2x')).contains(`${P2[0]}`);



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g5PName = stateVariables["/g5"].activeChildren[0].componentName;
      let g7PName = stateVariables["/g7"].activeChildren[0].componentName;
      let g13PName = stateVariables["/g13"].activeChildren[0].componentName;
      let g15PName = stateVariables["/g15"].activeChildren[0].componentName;
      let g21PName = stateVariables["/g21"].activeChildren[0].componentName;
      let g23PName = stateVariables["/g23"].activeChildren[0].componentName;

      expect(stateVariables['/P'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g2/P'].stateValues.xs).eqls(P2);
      expect(stateVariables['/Pa'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g4/Pa'].stateValues.xs).eqls(P2);

      expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g6/P'].stateValues.xs).eqls(P2);
      expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g8/Pa'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g9/P'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g10/P'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g11/Pa'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g12/Pa'].stateValues.xs).eqls(P2);

      expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g14/P'].stateValues.xs).eqls(P2);
      expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g16/Pa'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g17/P'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g18/P'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g19/Pa'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g20/Pa'].stateValues.xs).eqls(P2);

      expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g22/P'].stateValues.xs).eqls(P2);
      expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g24/Pa'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g25/P'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g26/P'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g27/Pa'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g28/Pa'].stateValues.xs).eqls(P2);

      cy.log(`move P1 to (4,5)`)
      cy.window().then(async (win) => {
        P1 = [4, 5];

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/P",
          args: { x: P1[0], y: P1[1] }
        })

        cy.get(cesc('#/P1x')).contains(`${P1[0]}`);
        cy.get(cesc('#/P2x')).contains(`${P2[0]}`);

      })

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g2/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g4/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g6/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g8/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g9/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g10/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g11/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g12/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g14/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g16/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g17/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g18/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g19/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g20/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g22/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g24/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g25/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g26/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g27/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g28/Pa'].stateValues.xs).eqls(P2);

      });


      cy.log(`move P2 to (7,0)`)
      cy.window().then(async (win) => {
        P2 = [7, 0];
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/g2/P",
          args: { x: P2[0], y: P2[1] }
        })

        cy.get(cesc('#/P2x')).contains(`${P2[0]}`);
        cy.get(cesc('#/P1x')).contains(`${P1[0]}`);
      })

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g2/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g4/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g6/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g8/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g9/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g10/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g11/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g12/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g14/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g16/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g17/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g18/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g19/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g20/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g22/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g24/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g25/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g26/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g27/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g28/Pa'].stateValues.xs).eqls(P2);

      });


      cy.log(`move P1 via Pa to (2,9)`)
      cy.window().then(async (win) => {
        P1 = [2, 0];

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/Pa",
          args: { x: P1[0], y: P1[1] }
        })

        cy.get(cesc('#/P1x')).contains(`${P1[0]}`);
        cy.get(cesc('#/P2x')).contains(`${P2[0]}`);

      })


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g2/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g4/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g6/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g8/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g9/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g10/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g11/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g12/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g14/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g16/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g17/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g18/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g19/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g20/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g22/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g24/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g25/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g26/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g27/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g28/Pa'].stateValues.xs).eqls(P2);

      });


      cy.log(`move P2 via graph 4's Pa to (8, 6)`)
      cy.window().then(async (win) => {
        P2 = [8, 6];
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/g4/Pa",
          args: { x: P2[0], y: P2[1] }
        })

        cy.get(cesc('#/P2x')).contains(`${P2[0]}`);
        cy.get(cesc('#/P1x')).contains(`${P1[0]}`);
      })


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g2/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g4/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g6/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g8/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g9/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g10/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g11/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g12/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g14/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g16/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g17/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g18/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g19/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g20/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g22/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g24/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g25/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g26/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g27/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g28/Pa'].stateValues.xs).eqls(P2);

      });

    });


  });

  it('copySource and copies with assignNewNamespaces', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g1">
      <point name="P">(1,2)</point>
    </graph>
    <copy source="P.x" assignNames="P1x" />
    <graph name="g2" newNamespace>
      <point name="P">(3,4)</point>
    </graph>
    <copy source="g2/P.x" assignNames="P2x" />
    <graph name="g3">
      <point copySource="P" name="Pa" />
    </graph>
    <graph name="g4" newNamespace>
      <point copySource="../g2/P" name="Pa" />
    </graph>
    <graph copySource="g1" name="g5" />
    <graph copySource="g2" name="g6" />
    <graph copySource="g3" name="g7" />
    <graph copySource="g4" name="g8" />

    <copy source="g1" assignNames="g9" assignNewNamespaces />
    <copy source="g2" assignNames="g10" assignNewNamespaces />
    <copy source="g3" assignNames="g11" assignNewNamespaces />
    <copy source="g4" assignNames="g12" assignNewNamespaces />

    <graph copySource="g5" name="g13" />
    <graph copySource="g6" name="g14" />
    <graph copySource="g7" name="g15" />
    <graph copySource="g8" name="g16" />
    <graph copySource="g9" name="g17" />
    <graph copySource="g10" name="g18" />
    <graph copySource="g11" name="g19" />
    <graph copySource="g12" name="g20" />
  
    <copy source="g5" assignNames="g21" assignNewNamespaces />
    <copy source="g6" assignNames="g22" assignNewNamespaces />
    <copy source="g7" assignNames="g23" assignNewNamespaces />
    <copy source="g8" assignNames="g24" assignNewNamespaces />
    <copy source="g9" assignNames="g25" assignNewNamespaces />
    <copy source="g10" assignNames="g26" assignNewNamespaces />
    <copy source="g11" assignNames="g27" assignNewNamespaces />
    <copy source="g12" assignNames="g28" assignNewNamespaces />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let P1 = [1, 2];
    let P2 = [3, 4]

    cy.get(cesc('#/P1x')).contains(`${P1[0]}`);
    cy.get(cesc('#/P2x')).contains(`${P2[0]}`);



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let g5PName = stateVariables["/g5"].activeChildren[0].componentName;
      let g7PName = stateVariables["/g7"].activeChildren[0].componentName;
      let g13PName = stateVariables["/g13"].activeChildren[0].componentName;
      let g15PName = stateVariables["/g15"].activeChildren[0].componentName;
      let g21PName = stateVariables["/g21"].activeChildren[0].componentName;
      let g23PName = stateVariables["/g23"].activeChildren[0].componentName;

      expect(stateVariables['/P'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g2/P'].stateValues.xs).eqls(P2);
      expect(stateVariables['/Pa'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g4/Pa'].stateValues.xs).eqls(P2);

      expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g6/P'].stateValues.xs).eqls(P2);
      expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g8/Pa'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g9/P'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g10/P'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g11/Pa'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g12/Pa'].stateValues.xs).eqls(P2);

      expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g14/P'].stateValues.xs).eqls(P2);
      expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g16/Pa'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g17/P'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g18/P'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g19/Pa'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g20/Pa'].stateValues.xs).eqls(P2);

      expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g22/P'].stateValues.xs).eqls(P2);
      expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
      expect(stateVariables['/g24/Pa'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g25/P'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g26/P'].stateValues.xs).eqls(P2);
      expect(stateVariables['/g27/Pa'].stateValues.xs).eqls(P1);
      expect(stateVariables['/g28/Pa'].stateValues.xs).eqls(P2);

      cy.log(`move P1 to (4,5)`)
      cy.window().then(async (win) => {
        P1 = [4, 5];

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/P",
          args: { x: P1[0], y: P1[1] }
        })

        cy.get(cesc('#/P1x')).contains(`${P1[0]}`);
        cy.get(cesc('#/P2x')).contains(`${P2[0]}`);

      })

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g2/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g4/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g6/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g8/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g9/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g10/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g11/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g12/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g14/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g16/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g17/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g18/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g19/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g20/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g22/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g24/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g25/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g26/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g27/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g28/Pa'].stateValues.xs).eqls(P2);

      });


      cy.log(`move P2 to (7,0)`)
      cy.window().then(async (win) => {
        P2 = [7, 0];
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/g2/P",
          args: { x: P2[0], y: P2[1] }
        })

        cy.get(cesc('#/P2x')).contains(`${P2[0]}`);
        cy.get(cesc('#/P1x')).contains(`${P1[0]}`);
      })

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g2/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g4/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g6/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g8/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g9/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g10/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g11/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g12/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g14/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g16/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g17/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g18/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g19/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g20/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g22/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g24/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g25/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g26/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g27/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g28/Pa'].stateValues.xs).eqls(P2);

      });


      cy.log(`move P1 via Pa to (2,9)`)
      cy.window().then(async (win) => {
        P1 = [2, 0];

        await win.callAction1({
          actionName: "movePoint",
          componentName: "/Pa",
          args: { x: P1[0], y: P1[1] }
        })

        cy.get(cesc('#/P1x')).contains(`${P1[0]}`);
        cy.get(cesc('#/P2x')).contains(`${P2[0]}`);

      })


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g2/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g4/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g6/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g8/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g9/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g10/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g11/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g12/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g14/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g16/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g17/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g18/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g19/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g20/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g22/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g24/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g25/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g26/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g27/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g28/Pa'].stateValues.xs).eqls(P2);

      });


      cy.log(`move P2 via graph 4's Pa to (8, 6)`)
      cy.window().then(async (win) => {
        P2 = [8, 6];
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/g4/Pa",
          args: { x: P2[0], y: P2[1] }
        })

        cy.get(cesc('#/P2x')).contains(`${P2[0]}`);
        cy.get(cesc('#/P1x')).contains(`${P1[0]}`);
      })


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g2/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g4/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g5PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g6/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g7PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g8/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g9/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g10/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g11/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g12/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g13PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g14/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g15PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g16/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g17/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g18/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g19/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g20/Pa'].stateValues.xs).eqls(P2);

        expect(stateVariables[g21PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g22/P'].stateValues.xs).eqls(P2);
        expect(stateVariables[g23PName].stateValues.xs).eqls(P1);
        expect(stateVariables['/g24/Pa'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g25/P'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g26/P'].stateValues.xs).eqls(P2);
        expect(stateVariables['/g27/Pa'].stateValues.xs).eqls(P1);
        expect(stateVariables['/g28/Pa'].stateValues.xs).eqls(P2);

      });

    });


  });

  it('assignNewNamespaces and references to parent', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <mathinput name="mi" prefill="p" />
    <answer>x</answer>

    <problem name="p1">
      <answer>y</answer>
      <p>Credit achieved: <copy source="p1.creditAchieved" assignNames="ca" /></p>
      <p>Value of mathinput: <copy source="mi.value" assignNames="m" /></p>
      <p>Other answer credit achieved: <copy source="p2/_answer1.creditAchieved" assignNames="cao" /></p>
      </problem>

    <problem name="p2" newNamespace>
      <answer>z</answer>
      <p>Credit achieved: <copy source="../p2.creditAchieved" assignNames="ca" /></p>
      <p>Value of mathinput: <copy source="../mi.value" assignNames="m" /></p>
      <p>Other answer credit achieved: <copy source="../_answer2.creditAchieved" assignNames="cao" /></p>
    </problem>

    <copy source="p1" assignNames="p3" assignNewNamespaces />

    <copy source="p2" assignNames="p4" assignNewNamespaces />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/ca')).contains('0')
    cy.get(cesc('#/p2/cao')).contains('0')
    cy.get(cesc('#/p3/ca')).contains('0')
    cy.get(cesc('#/p4/cao')).contains('0')

    cy.get(cesc('#/cao')).contains('0')
    cy.get(cesc('#/p2/ca')).contains('0')
    cy.get(cesc('#/p3/cao')).contains('0')
    cy.get(cesc('#/p4/ca')).contains('0')

    cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
    cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
    cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
    cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'p')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinputoutsideName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputoutsideAnchor = cesc('#' + mathinputoutsideName) + " textarea";
      let mathinputoutsideSubmitAnchor = cesc('#' + mathinputoutsideName + '_submit');
      let mathinputoutsideCorrectAnchor = cesc('#' + mathinputoutsideName + '_correct');
      let mathinputoutsideIncorrectAnchor = cesc('#' + mathinputoutsideName + '_incorrect');
      let mathinputoutsideFieldAnchor = cesc('#' + mathinputoutsideName) + ' .mq-editable-field';

      let mathinputp1Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinputp1Anchor = cesc('#' + mathinputp1Name) + " textarea";
      let mathinputp1SubmitAnchor = cesc('#' + mathinputp1Name + '_submit');
      let mathinputp1CorrectAnchor = cesc('#' + mathinputp1Name + '_correct');
      let mathinputp1IncorrectAnchor = cesc('#' + mathinputp1Name + '_incorrect');
      let mathinputp1FieldAnchor = cesc('#' + mathinputp1Name) + ' .mq-editable-field';

      let mathinputp2Name = stateVariables['/p2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputp2Anchor = cesc('#' + mathinputp2Name) + " textarea";
      let mathinputp2SubmitAnchor = cesc('#' + mathinputp2Name + '_submit');
      let mathinputp2CorrectAnchor = cesc('#' + mathinputp2Name + '_correct');
      let mathinputp2IncorrectAnchor = cesc('#' + mathinputp2Name + '_incorrect');
      let mathinputp2FieldAnchor = cesc('#' + mathinputp2Name) + ' .mq-editable-field';

      let mathinputp3Name = stateVariables['/p3/_answer2'].stateValues.inputChildren[0].componentName
      let mathinputp3Anchor = cesc('#' + mathinputp3Name) + " textarea";
      let mathinputp3SubmitAnchor = cesc('#' + mathinputp3Name + '_submit');
      let mathinputp3CorrectAnchor = cesc('#' + mathinputp3Name + '_correct');
      let mathinputp3IncorrectAnchor = cesc('#' + mathinputp3Name + '_incorrect');
      let mathinputp3FieldAnchor = cesc('#' + mathinputp3Name) + ' .mq-editable-field';

      let mathinputp4Name = stateVariables['/p4/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputp4Anchor = cesc('#' + mathinputp4Name) + " textarea";
      let mathinputp4SubmitAnchor = cesc('#' + mathinputp4Name + '_submit');
      let mathinputp4CorrectAnchor = cesc('#' + mathinputp4Name + '_correct');
      let mathinputp4IncorrectAnchor = cesc('#' + mathinputp4Name + '_incorrect');
      let mathinputp4FieldAnchor = cesc('#' + mathinputp4Name) + ' .mq-editable-field';

      expect(stateVariables['/ca'].stateValues.value).eq(0);
      expect(stateVariables['/p2/cao'].stateValues.value).eq(0);
      expect(stateVariables['/p3/ca'].stateValues.value).eq(0);
      expect(stateVariables['/p4/cao'].stateValues.value).eq(0);

      expect(stateVariables['/cao'].stateValues.value).eq(0);
      expect(stateVariables['/p2/ca'].stateValues.value).eq(0);
      expect(stateVariables['/p3/cao'].stateValues.value).eq(0);
      expect(stateVariables['/p4/ca'].stateValues.value).eq(0);

      expect(stateVariables['/m'].stateValues.value).eq("p");
      expect(stateVariables['/p2/m'].stateValues.value).eq("p");
      expect(stateVariables['/p3/m'].stateValues.value).eq("p");
      expect(stateVariables['/p4/m'].stateValues.value).eq("p");


      cy.log('answer outside answer')

      cy.get(mathinputoutsideAnchor).type("x{enter}", { force: true });
      cy.get(mathinputoutsideCorrectAnchor).should('be.visible');
      cy.get(mathinputp1SubmitAnchor).should('be.visible');
      cy.get(mathinputp2SubmitAnchor).should('be.visible');
      cy.get(mathinputp3SubmitAnchor).should('be.visible');
      cy.get(mathinputp4SubmitAnchor).should('be.visible');

      cy.log('correctly answer first problem')
      cy.get(mathinputp1Anchor).type("y{enter}", { force: true })
      cy.get(mathinputp1CorrectAnchor).should('be.visible')
      cy.get(mathinputp2SubmitAnchor).should('be.visible');
      cy.get(mathinputp3CorrectAnchor).should('be.visible');
      cy.get(mathinputp4SubmitAnchor).should('be.visible');

      cy.get(mathinputp1FieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y')
      })
      cy.get(mathinputp2FieldAnchor).should('have.text', '')
      cy.get(mathinputp3FieldAnchor).should('have.text', 'y')
      cy.get(mathinputp4FieldAnchor).should('have.text', '')

      cy.get(cesc('#/ca')).contains('1')
      cy.get(cesc('#/p2/cao')).contains('1')
      cy.get(cesc('#/p3/ca')).contains('1')
      cy.get(cesc('#/p4/cao')).contains('1')

      cy.get(cesc('#/cao')).contains('0')
      cy.get(cesc('#/p2/ca')).contains('0')
      cy.get(cesc('#/p3/cao')).contains('0')
      cy.get(cesc('#/p4/ca')).contains('0')

      cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'p')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p2/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p3/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p4/cao'].stateValues.value).eq(1);

        expect(stateVariables['/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p2/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p3/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p4/ca'].stateValues.value).eq(0);

        expect(stateVariables['/m'].stateValues.value).eq("p");
        expect(stateVariables['/p2/m'].stateValues.value).eq("p");
        expect(stateVariables['/p3/m'].stateValues.value).eq("p");
        expect(stateVariables['/p4/m'].stateValues.value).eq("p");
      })


      cy.log('correctly answer second problem')
      cy.get(mathinputp2Anchor).type("z{enter}", { force: true })
      cy.get(mathinputp2CorrectAnchor).should('be.visible')
      cy.get(mathinputp1CorrectAnchor).should('be.visible')
      cy.get(mathinputp3CorrectAnchor).should('be.visible');
      cy.get(mathinputp4CorrectAnchor).should('be.visible');

      cy.get(mathinputp2FieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
      })
      cy.get(mathinputp1FieldAnchor).should('have.text', 'y')
      cy.get(mathinputp3FieldAnchor).should('have.text', 'y')
      cy.get(mathinputp4FieldAnchor).should('have.text', 'z')

      cy.get(cesc('#/ca')).contains('1')
      cy.get(cesc('#/p2/cao')).contains('1')
      cy.get(cesc('#/p3/ca')).contains('1')
      cy.get(cesc('#/p4/cao')).contains('1')

      cy.get(cesc('#/cao')).contains('1')
      cy.get(cesc('#/p2/ca')).contains('1')
      cy.get(cesc('#/p3/cao')).contains('1')
      cy.get(cesc('#/p4/ca')).contains('1')

      cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'p')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p2/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p3/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p4/cao'].stateValues.value).eq(1);

        expect(stateVariables['/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p2/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p3/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p4/ca'].stateValues.value).eq(1);

        expect(stateVariables['/m'].stateValues.value).eq("p");
        expect(stateVariables['/p2/m'].stateValues.value).eq("p");
        expect(stateVariables['/p3/m'].stateValues.value).eq("p");
        expect(stateVariables['/p4/m'].stateValues.value).eq("p");
      })


      cy.log('incorrectly answer third problem')
      cy.get(mathinputp3Anchor).type("{end}{backspace}a{enter}", { force: true })
      cy.get(mathinputp3IncorrectAnchor).should('be.visible')
      cy.get(mathinputp1IncorrectAnchor).should('be.visible')
      cy.get(mathinputp2CorrectAnchor).should('be.visible')
      cy.get(mathinputp4CorrectAnchor).should('be.visible');

      cy.get(mathinputp3FieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
      })
      cy.get(mathinputp1FieldAnchor).should('have.text', 'a')
      cy.get(mathinputp2FieldAnchor).should('have.text', 'z')
      cy.get(mathinputp4FieldAnchor).should('have.text', 'z')

      cy.get(cesc('#/ca')).contains('0')
      cy.get(cesc('#/p2/cao')).contains('0')
      cy.get(cesc('#/p3/ca')).contains('0')
      cy.get(cesc('#/p4/cao')).contains('0')

      cy.get(cesc('#/cao')).contains('1')
      cy.get(cesc('#/p2/ca')).contains('1')
      cy.get(cesc('#/p3/cao')).contains('1')
      cy.get(cesc('#/p4/ca')).contains('1')

      cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'p')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p2/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p3/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p4/cao'].stateValues.value).eq(0);

        expect(stateVariables['/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p2/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p3/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p4/ca'].stateValues.value).eq(1);

        expect(stateVariables['/m'].stateValues.value).eq("p");
        expect(stateVariables['/p2/m'].stateValues.value).eq("p");
        expect(stateVariables['/p3/m'].stateValues.value).eq("p");
        expect(stateVariables['/p4/m'].stateValues.value).eq("p");
      })


      cy.log('incorrectly answer fourth problem')
      cy.get(mathinputp4Anchor).type("{end}{backspace}b{enter}", { force: true })
      cy.get(mathinputp4IncorrectAnchor).should('be.visible')
      cy.get(mathinputp1IncorrectAnchor).should('be.visible')
      cy.get(mathinputp2IncorrectAnchor).should('be.visible')
      cy.get(mathinputp3IncorrectAnchor).should('be.visible')

      cy.get(mathinputp4FieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
      })
      cy.get(mathinputp1FieldAnchor).should('have.text', 'a')
      cy.get(mathinputp2FieldAnchor).should('have.text', 'b')
      cy.get(mathinputp3FieldAnchor).should('have.text', 'a')

      cy.get(cesc('#/ca')).contains('0')
      cy.get(cesc('#/p2/cao')).contains('0')
      cy.get(cesc('#/p3/ca')).contains('0')
      cy.get(cesc('#/p4/cao')).contains('0')

      cy.get(cesc('#/cao')).contains('0')
      cy.get(cesc('#/p2/ca')).contains('0')
      cy.get(cesc('#/p3/cao')).contains('0')
      cy.get(cesc('#/p4/ca')).contains('0')

      cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'p')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p2/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p3/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p4/cao'].stateValues.value).eq(0);

        expect(stateVariables['/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p2/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p3/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p4/ca'].stateValues.value).eq(0);

        expect(stateVariables['/m'].stateValues.value).eq("p");
        expect(stateVariables['/p2/m'].stateValues.value).eq("p");
        expect(stateVariables['/p3/m'].stateValues.value).eq("p");
        expect(stateVariables['/p4/m'].stateValues.value).eq("p");
      })


      cy.log('change mathinput')
      cy.get(cesc("#/mi") + " textarea").type("{end}{backspace}q{enter}", { force: true })
      cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'q')
      cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'q')
      cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'q')
      cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'q')


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/m'].stateValues.value).eq("q");
        expect(stateVariables['/p2/m'].stateValues.value).eq("q");
        expect(stateVariables['/p3/m'].stateValues.value).eq("q");
        expect(stateVariables['/p4/m'].stateValues.value).eq("q");
      })

    });




  });

  it('copySource with newNamespace and references to parent', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <mathinput name="mi" prefill="p" />
    <answer>x</answer>

    <problem name="p1">
      <answer>y</answer>
      <p>Credit achieved: <number copysource="p1.creditAchieved" name="ca" /></p>
      <p>Value of mathinput: <math copysource="mi" name="m" /></p>
      <p>Other answer credit achieved: <number copysource="p2/_answer1.creditAchieved" name="cao" /></p>
    </problem>

    <problem name="p2" newNamespace>
      <answer>z</answer>
      <p>Credit achieved: <number copysource="../p2.creditAchieved" name="ca" /></p>
      <p>Value of mathinput: <math copysource="../mi" name="m" /></p>
      <p>Other answer credit achieved: <number copysource="../_answer2.creditAchieved" name="cao" /></p>
    </problem>

    <problem copySource="p1" name="p3" newNamespace />

    <problem copySource="p2" name="p4" newNamespace />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/ca')).contains('0')
    cy.get(cesc('#/p2/cao')).contains('0')
    cy.get(cesc('#/p3/ca')).contains('0')
    cy.get(cesc('#/p4/cao')).contains('0')

    cy.get(cesc('#/cao')).contains('0')
    cy.get(cesc('#/p2/ca')).contains('0')
    cy.get(cesc('#/p3/cao')).contains('0')
    cy.get(cesc('#/p4/ca')).contains('0')

    cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
    cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
    cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
    cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'p')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinputoutsideName = stateVariables['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputoutsideAnchor = cesc('#' + mathinputoutsideName) + " textarea";
      let mathinputoutsideSubmitAnchor = cesc('#' + mathinputoutsideName + '_submit');
      let mathinputoutsideCorrectAnchor = cesc('#' + mathinputoutsideName + '_correct');
      let mathinputoutsideIncorrectAnchor = cesc('#' + mathinputoutsideName + '_incorrect');
      let mathinputoutsideFieldAnchor = cesc('#' + mathinputoutsideName) + ' .mq-editable-field';

      let mathinputp1Name = stateVariables['/_answer2'].stateValues.inputChildren[0].componentName
      let mathinputp1Anchor = cesc('#' + mathinputp1Name) + " textarea";
      let mathinputp1SubmitAnchor = cesc('#' + mathinputp1Name + '_submit');
      let mathinputp1CorrectAnchor = cesc('#' + mathinputp1Name + '_correct');
      let mathinputp1IncorrectAnchor = cesc('#' + mathinputp1Name + '_incorrect');
      let mathinputp1FieldAnchor = cesc('#' + mathinputp1Name) + ' .mq-editable-field';

      let mathinputp2Name = stateVariables['/p2/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputp2Anchor = cesc('#' + mathinputp2Name) + " textarea";
      let mathinputp2SubmitAnchor = cesc('#' + mathinputp2Name + '_submit');
      let mathinputp2CorrectAnchor = cesc('#' + mathinputp2Name + '_correct');
      let mathinputp2IncorrectAnchor = cesc('#' + mathinputp2Name + '_incorrect');
      let mathinputp2FieldAnchor = cesc('#' + mathinputp2Name) + ' .mq-editable-field';

      let mathinputp3Name = stateVariables['/p3/_answer2'].stateValues.inputChildren[0].componentName
      let mathinputp3Anchor = cesc('#' + mathinputp3Name) + " textarea";
      let mathinputp3SubmitAnchor = cesc('#' + mathinputp3Name + '_submit');
      let mathinputp3CorrectAnchor = cesc('#' + mathinputp3Name + '_correct');
      let mathinputp3IncorrectAnchor = cesc('#' + mathinputp3Name + '_incorrect');
      let mathinputp3FieldAnchor = cesc('#' + mathinputp3Name) + ' .mq-editable-field';

      let mathinputp4Name = stateVariables['/p4/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputp4Anchor = cesc('#' + mathinputp4Name) + " textarea";
      let mathinputp4SubmitAnchor = cesc('#' + mathinputp4Name + '_submit');
      let mathinputp4CorrectAnchor = cesc('#' + mathinputp4Name + '_correct');
      let mathinputp4IncorrectAnchor = cesc('#' + mathinputp4Name + '_incorrect');
      let mathinputp4FieldAnchor = cesc('#' + mathinputp4Name) + ' .mq-editable-field';

      expect(stateVariables['/ca'].stateValues.value).eq(0);
      expect(stateVariables['/p2/cao'].stateValues.value).eq(0);
      expect(stateVariables['/p3/ca'].stateValues.value).eq(0);
      expect(stateVariables['/p4/cao'].stateValues.value).eq(0);

      expect(stateVariables['/cao'].stateValues.value).eq(0);
      expect(stateVariables['/p2/ca'].stateValues.value).eq(0);
      expect(stateVariables['/p3/cao'].stateValues.value).eq(0);
      expect(stateVariables['/p4/ca'].stateValues.value).eq(0);

      expect(stateVariables['/m'].stateValues.value).eq("p");
      expect(stateVariables['/p2/m'].stateValues.value).eq("p");
      expect(stateVariables['/p3/m'].stateValues.value).eq("p");
      expect(stateVariables['/p4/m'].stateValues.value).eq("p");


      cy.log('answer outside answer')

      cy.get(mathinputoutsideAnchor).type("x{enter}", { force: true });
      cy.get(mathinputoutsideCorrectAnchor).should('be.visible');
      cy.get(mathinputp1SubmitAnchor).should('be.visible');
      cy.get(mathinputp2SubmitAnchor).should('be.visible');
      cy.get(mathinputp3SubmitAnchor).should('be.visible');
      cy.get(mathinputp4SubmitAnchor).should('be.visible');

      cy.log('correctly answer first problem')
      cy.get(mathinputp1Anchor).type("y{enter}", { force: true })
      cy.get(mathinputp1CorrectAnchor).should('be.visible')
      cy.get(mathinputp2SubmitAnchor).should('be.visible');
      cy.get(mathinputp3CorrectAnchor).should('be.visible');
      cy.get(mathinputp4SubmitAnchor).should('be.visible');

      cy.get(mathinputp1FieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y')
      })
      cy.get(mathinputp2FieldAnchor).should('have.text', '')
      cy.get(mathinputp3FieldAnchor).should('have.text', 'y')
      cy.get(mathinputp4FieldAnchor).should('have.text', '')

      cy.get(cesc('#/ca')).contains('1')
      cy.get(cesc('#/p2/cao')).contains('1')
      cy.get(cesc('#/p3/ca')).contains('1')
      cy.get(cesc('#/p4/cao')).contains('1')

      cy.get(cesc('#/cao')).contains('0')
      cy.get(cesc('#/p2/ca')).contains('0')
      cy.get(cesc('#/p3/cao')).contains('0')
      cy.get(cesc('#/p4/ca')).contains('0')

      cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'p')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p2/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p3/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p4/cao'].stateValues.value).eq(1);

        expect(stateVariables['/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p2/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p3/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p4/ca'].stateValues.value).eq(0);

        expect(stateVariables['/m'].stateValues.value).eq("p");
        expect(stateVariables['/p2/m'].stateValues.value).eq("p");
        expect(stateVariables['/p3/m'].stateValues.value).eq("p");
        expect(stateVariables['/p4/m'].stateValues.value).eq("p");
      })


      cy.log('correctly answer second problem')
      cy.get(mathinputp2Anchor).type("z{enter}", { force: true })
      cy.get(mathinputp2CorrectAnchor).should('be.visible')
      cy.get(mathinputp1CorrectAnchor).should('be.visible')
      cy.get(mathinputp3CorrectAnchor).should('be.visible');
      cy.get(mathinputp4CorrectAnchor).should('be.visible');

      cy.get(mathinputp2FieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
      })
      cy.get(mathinputp1FieldAnchor).should('have.text', 'y')
      cy.get(mathinputp3FieldAnchor).should('have.text', 'y')
      cy.get(mathinputp4FieldAnchor).should('have.text', 'z')

      cy.get(cesc('#/ca')).contains('1')
      cy.get(cesc('#/p2/cao')).contains('1')
      cy.get(cesc('#/p3/ca')).contains('1')
      cy.get(cesc('#/p4/cao')).contains('1')

      cy.get(cesc('#/cao')).contains('1')
      cy.get(cesc('#/p2/ca')).contains('1')
      cy.get(cesc('#/p3/cao')).contains('1')
      cy.get(cesc('#/p4/ca')).contains('1')

      cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'p')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p2/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p3/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p4/cao'].stateValues.value).eq(1);

        expect(stateVariables['/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p2/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p3/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p4/ca'].stateValues.value).eq(1);

        expect(stateVariables['/m'].stateValues.value).eq("p");
        expect(stateVariables['/p2/m'].stateValues.value).eq("p");
        expect(stateVariables['/p3/m'].stateValues.value).eq("p");
        expect(stateVariables['/p4/m'].stateValues.value).eq("p");
      })


      cy.log('incorrectly answer third problem')
      cy.get(mathinputp3Anchor).type("{end}{backspace}a{enter}", { force: true })
      cy.get(mathinputp3IncorrectAnchor).should('be.visible')
      cy.get(mathinputp1IncorrectAnchor).should('be.visible')
      cy.get(mathinputp2CorrectAnchor).should('be.visible')
      cy.get(mathinputp4CorrectAnchor).should('be.visible');

      cy.get(mathinputp3FieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
      })
      cy.get(mathinputp1FieldAnchor).should('have.text', 'a')
      cy.get(mathinputp2FieldAnchor).should('have.text', 'z')
      cy.get(mathinputp4FieldAnchor).should('have.text', 'z')

      cy.get(cesc('#/ca')).contains('0')
      cy.get(cesc('#/p2/cao')).contains('0')
      cy.get(cesc('#/p3/ca')).contains('0')
      cy.get(cesc('#/p4/cao')).contains('0')

      cy.get(cesc('#/cao')).contains('1')
      cy.get(cesc('#/p2/ca')).contains('1')
      cy.get(cesc('#/p3/cao')).contains('1')
      cy.get(cesc('#/p4/ca')).contains('1')

      cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'p')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p2/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p3/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p4/cao'].stateValues.value).eq(0);

        expect(stateVariables['/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p2/ca'].stateValues.value).eq(1);
        expect(stateVariables['/p3/cao'].stateValues.value).eq(1);
        expect(stateVariables['/p4/ca'].stateValues.value).eq(1);

        expect(stateVariables['/m'].stateValues.value).eq("p");
        expect(stateVariables['/p2/m'].stateValues.value).eq("p");
        expect(stateVariables['/p3/m'].stateValues.value).eq("p");
        expect(stateVariables['/p4/m'].stateValues.value).eq("p");
      })


      cy.log('incorrectly answer fourth problem')
      cy.get(mathinputp4Anchor).type("{end}{backspace}b{enter}", { force: true })
      cy.get(mathinputp4IncorrectAnchor).should('be.visible')
      cy.get(mathinputp1IncorrectAnchor).should('be.visible')
      cy.get(mathinputp2IncorrectAnchor).should('be.visible')
      cy.get(mathinputp3IncorrectAnchor).should('be.visible')

      cy.get(mathinputp4FieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
      })
      cy.get(mathinputp1FieldAnchor).should('have.text', 'a')
      cy.get(mathinputp2FieldAnchor).should('have.text', 'b')
      cy.get(mathinputp3FieldAnchor).should('have.text', 'a')

      cy.get(cesc('#/ca')).contains('0')
      cy.get(cesc('#/p2/cao')).contains('0')
      cy.get(cesc('#/p3/ca')).contains('0')
      cy.get(cesc('#/p4/cao')).contains('0')

      cy.get(cesc('#/cao')).contains('0')
      cy.get(cesc('#/p2/ca')).contains('0')
      cy.get(cesc('#/p3/cao')).contains('0')
      cy.get(cesc('#/p4/ca')).contains('0')

      cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'p')
      cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'p')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p2/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p3/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p4/cao'].stateValues.value).eq(0);

        expect(stateVariables['/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p2/ca'].stateValues.value).eq(0);
        expect(stateVariables['/p3/cao'].stateValues.value).eq(0);
        expect(stateVariables['/p4/ca'].stateValues.value).eq(0);

        expect(stateVariables['/m'].stateValues.value).eq("p");
        expect(stateVariables['/p2/m'].stateValues.value).eq("p");
        expect(stateVariables['/p3/m'].stateValues.value).eq("p");
        expect(stateVariables['/p4/m'].stateValues.value).eq("p");
      })


      cy.log('change mathinput')
      cy.get(cesc("#/mi") + " textarea").type("{end}{backspace}q{enter}", { force: true })
      cy.get(cesc('#/m') + " .mjx-mrow").eq(0).should('have.text', 'q')
      cy.get(cesc('#/p2/m') + " .mjx-mrow").eq(0).should('have.text', 'q')
      cy.get(cesc('#/p3/m') + " .mjx-mrow").eq(0).should('have.text', 'q')
      cy.get(cesc('#/p4/m') + " .mjx-mrow").eq(0).should('have.text', 'q')


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/m'].stateValues.value).eq("q");
        expect(stateVariables['/p2/m'].stateValues.value).eq("q");
        expect(stateVariables['/p3/m'].stateValues.value).eq("q");
        expect(stateVariables['/p4/m'].stateValues.value).eq("q");
      })

    });




  });

  it('copySource of copy and map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <mathinput name="n" prefill="2" />

    <p>Value: <copy source="n" prop="value" name="cp" assignNames="n2" /></p>
    <p>Value 2: <copy copySource="cp" name="cp2" assignNames="n3" /></p>

    <map name="map1" assignNames="(p1) (p2) (p3)">
      <template><p newNamespace>Hello <number copySource="v" />!  <mathinput name="x" /> <math copySource="x" /></p></template>
      <sources alias="v"><sequence from="1" to="$n" /></sources>
    </map>

    <map copySource="map1" name="map2" assignNames="(p1a) (p2a) (p3a)" />

    <map copySource="map2" name="map3" assignNames="(p1b) (p2b) (p3b)" />


    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/n2')).contains('2')
    cy.get(cesc('#/n3')).contains('2')

    cy.get(cesc("#/p1")).contains('Hello 1!');
    cy.get(cesc("#/p1/_number1")).contains('1');
    cy.get(cesc("#/p1/_math1")).contains('＿');
    cy.get(cesc("#/p2")).contains('Hello 2!');
    cy.get(cesc("#/p2/_number1")).contains('2');
    cy.get(cesc("#/p2/_math1")).contains('＿');
    cy.get(cesc("#/p3")).should('not.exist')
    cy.get(cesc("#/p3/_number1")).should('not.exist')
    cy.get(cesc("#/p3/_math1")).should('not.exist')

    cy.get(cesc("#/p1a")).contains('Hello 1!');
    cy.get(cesc("#/p1a/_number1")).contains('1');
    cy.get(cesc("#/p1a/_math1")).contains('＿');
    cy.get(cesc("#/p2a")).contains('Hello 2!');
    cy.get(cesc("#/p2a/_number1")).contains('2');
    cy.get(cesc("#/p2a/_math1")).contains('＿');
    cy.get(cesc("#/p3a")).should('not.exist')
    cy.get(cesc("#/p3a/_number1")).should('not.exist')
    cy.get(cesc("#/p3a/_math1")).should('not.exist')

    cy.get(cesc("#/p1b")).contains('Hello 1!');
    cy.get(cesc("#/p1b/_number1")).contains('1');
    cy.get(cesc("#/p1b/_math1")).contains('＿');
    cy.get(cesc("#/p2b")).contains('Hello 2!');
    cy.get(cesc("#/p2b/_number1")).contains('2');
    cy.get(cesc("#/p2b/_math1")).contains('＿');
    cy.get(cesc("#/p3b")).should('not.exist')
    cy.get(cesc("#/p3b/_number1")).should('not.exist')
    cy.get(cesc("#/p3b/_math1")).should('not.exist')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(2);
      expect(stateVariables["/n3"].stateValues.value).eq(2);

      expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/_number1"]).eq(undefined);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/_number1"]).eq(undefined);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/_number1"]).eq(undefined);

      expect(stateVariables["/p1/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p2/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p3/_math1"]).eq(undefined);
      expect(stateVariables["/p1a/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p2a/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p3a/_math1"]).eq(undefined);
      expect(stateVariables["/p1b/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p2b/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p3b/_math1"]).eq(undefined);

    });


    cy.log('type x in first mathinput')
    cy.get(cesc('#/p1/x') + " textarea").type("x{enter}", { force: true });

    cy.get(cesc("#/p1")).contains('Hello 1!');
    cy.get(cesc("#/p1/_number1")).contains('1');
    cy.get(cesc("#/p1/_math1")).contains('x');
    cy.get(cesc("#/p2")).contains('Hello 2!');
    cy.get(cesc("#/p2/_number1")).contains('2');
    cy.get(cesc("#/p2/_math1")).contains('＿');
    cy.get(cesc("#/p3")).should('not.exist')
    cy.get(cesc("#/p3/_number1")).should('not.exist')
    cy.get(cesc("#/p3/_math1")).should('not.exist')

    cy.get(cesc("#/p1a")).contains('Hello 1!');
    cy.get(cesc("#/p1a/_number1")).contains('1');
    cy.get(cesc("#/p1a/_math1")).contains('x');
    cy.get(cesc("#/p2a")).contains('Hello 2!');
    cy.get(cesc("#/p2a/_number1")).contains('2');
    cy.get(cesc("#/p2a/_math1")).contains('＿');
    cy.get(cesc("#/p3a")).should('not.exist')
    cy.get(cesc("#/p3a/_number1")).should('not.exist')
    cy.get(cesc("#/p3a/_math1")).should('not.exist')

    cy.get(cesc("#/p1b")).contains('Hello 1!');
    cy.get(cesc("#/p1b/_number1")).contains('1');
    cy.get(cesc("#/p1b/_math1")).contains('x');
    cy.get(cesc("#/p2b")).contains('Hello 2!');
    cy.get(cesc("#/p2b/_number1")).contains('2');
    cy.get(cesc("#/p2b/_math1")).contains('＿');
    cy.get(cesc("#/p3b")).should('not.exist')
    cy.get(cesc("#/p3b/_number1")).should('not.exist')
    cy.get(cesc("#/p3b/_math1")).should('not.exist')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(2);
      expect(stateVariables["/n3"].stateValues.value).eq(2);

      expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/_number1"]).eq(undefined);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/_number1"]).eq(undefined);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/_number1"]).eq(undefined);

      expect(stateVariables["/p1/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p3/_math1"]).eq(undefined);
      expect(stateVariables["/p1a/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2a/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p3a/_math1"]).eq(undefined);
      expect(stateVariables["/p1b/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2b/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p3b/_math1"]).eq(undefined);

    });


    cy.log('type y in second mathinput')
    cy.get(cesc('#/p2b/x') + " textarea").type("y{enter}", { force: true });

    cy.get(cesc("#/p1")).contains('Hello 1!');
    cy.get(cesc("#/p1/_number1")).contains('1');
    cy.get(cesc("#/p1/_math1")).contains('x');
    cy.get(cesc("#/p2")).contains('Hello 2!');
    cy.get(cesc("#/p2/_number1")).contains('2');
    cy.get(cesc("#/p2/_math1")).contains('y');
    cy.get(cesc("#/p3")).should('not.exist')
    cy.get(cesc("#/p3/_number1")).should('not.exist')
    cy.get(cesc("#/p3/_math1")).should('not.exist')

    cy.get(cesc("#/p1a")).contains('Hello 1!');
    cy.get(cesc("#/p1a/_number1")).contains('1');
    cy.get(cesc("#/p1a/_math1")).contains('x');
    cy.get(cesc("#/p2a")).contains('Hello 2!');
    cy.get(cesc("#/p2a/_number1")).contains('2');
    cy.get(cesc("#/p2a/_math1")).contains('y');
    cy.get(cesc("#/p3a")).should('not.exist')
    cy.get(cesc("#/p3a/_number1")).should('not.exist')
    cy.get(cesc("#/p3a/_math1")).should('not.exist')

    cy.get(cesc("#/p1b")).contains('Hello 1!');
    cy.get(cesc("#/p1b/_number1")).contains('1');
    cy.get(cesc("#/p1b/_math1")).contains('x');
    cy.get(cesc("#/p2b")).contains('Hello 2!');
    cy.get(cesc("#/p2b/_number1")).contains('2');
    cy.get(cesc("#/p2b/_math1")).contains('y');
    cy.get(cesc("#/p3b")).should('not.exist')
    cy.get(cesc("#/p3b/_number1")).should('not.exist')
    cy.get(cesc("#/p3b/_math1")).should('not.exist')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(2);
      expect(stateVariables["/n3"].stateValues.value).eq(2);

      expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/_number1"]).eq(undefined);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/_number1"]).eq(undefined);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/_number1"]).eq(undefined);

      expect(stateVariables["/p1/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2/_math1"].stateValues.value).eq('y');
      expect(stateVariables["/p3/_math1"]).eq(undefined);
      expect(stateVariables["/p1a/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2a/_math1"].stateValues.value).eq('y');
      expect(stateVariables["/p3a/_math1"]).eq(undefined);
      expect(stateVariables["/p1b/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2b/_math1"].stateValues.value).eq('y');
      expect(stateVariables["/p3b/_math1"]).eq(undefined);

    });


    cy.log('increase n')
    cy.get(cesc('#/n') + " textarea").type("{end}{backspace}3{enter}", { force: true });

    cy.get(cesc('#/n2')).contains('3')
    cy.get(cesc('#/n3')).contains('3')

    cy.get(cesc("#/p1")).contains('Hello 1!');
    cy.get(cesc("#/p1/_number1")).contains('1');
    cy.get(cesc("#/p1/_math1")).contains('x');
    cy.get(cesc("#/p2")).contains('Hello 2!');
    cy.get(cesc("#/p2/_number1")).contains('2');
    cy.get(cesc("#/p2/_math1")).contains('y');
    cy.get(cesc("#/p3")).contains('Hello 3!');
    cy.get(cesc("#/p3/_number1")).contains('3');
    cy.get(cesc("#/p3/_math1")).contains('＿');

    cy.get(cesc("#/p1a")).contains('Hello 1!');
    cy.get(cesc("#/p1a/_number1")).contains('1');
    cy.get(cesc("#/p1a/_math1")).contains('x');
    cy.get(cesc("#/p2a")).contains('Hello 2!');
    cy.get(cesc("#/p2a/_number1")).contains('2');
    cy.get(cesc("#/p2a/_math1")).contains('y');
    cy.get(cesc("#/p3a")).contains('Hello 3!');
    cy.get(cesc("#/p3a/_number1")).contains('3');
    cy.get(cesc("#/p3a/_math1")).contains('＿');

    cy.get(cesc("#/p1b")).contains('Hello 1!');
    cy.get(cesc("#/p1b/_number1")).contains('1');
    cy.get(cesc("#/p1b/_math1")).contains('x');
    cy.get(cesc("#/p2b")).contains('Hello 2!');
    cy.get(cesc("#/p2b/_number1")).contains('2');
    cy.get(cesc("#/p2b/_math1")).contains('y');
    cy.get(cesc("#/p3b")).contains('Hello 3!');
    cy.get(cesc("#/p3b/_number1")).contains('3');
    cy.get(cesc("#/p3b/_math1")).contains('＿');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(3);
      expect(stateVariables["/n3"].stateValues.value).eq(3);

      expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/_number1"].stateValues.value).eq(3);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/_number1"].stateValues.value).eq(3);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/_number1"].stateValues.value).eq(3);

      expect(stateVariables["/p1/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2/_math1"].stateValues.value).eq('y');
      expect(stateVariables["/p3/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p1a/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2a/_math1"].stateValues.value).eq('y');
      expect(stateVariables["/p3a/_math1"].stateValues.value).eq('＿');
      expect(stateVariables["/p1b/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2b/_math1"].stateValues.value).eq('y');
      expect(stateVariables["/p3b/_math1"].stateValues.value).eq('＿');

    });

    cy.log('type z in third mathinput')
    cy.get(cesc('#/p3a/x') + " textarea").type("z{enter}", { force: true });


    cy.get(cesc("#/p1")).contains('Hello 1!');
    cy.get(cesc("#/p1/_number1")).contains('1');
    cy.get(cesc("#/p1/_math1")).contains('x');
    cy.get(cesc("#/p2")).contains('Hello 2!');
    cy.get(cesc("#/p2/_number1")).contains('2');
    cy.get(cesc("#/p2/_math1")).contains('y');
    cy.get(cesc("#/p3")).contains('Hello 3!');
    cy.get(cesc("#/p3/_number1")).contains('3');
    cy.get(cesc("#/p3/_math1")).contains('z');

    cy.get(cesc("#/p1a")).contains('Hello 1!');
    cy.get(cesc("#/p1a/_number1")).contains('1');
    cy.get(cesc("#/p1a/_math1")).contains('x');
    cy.get(cesc("#/p2a")).contains('Hello 2!');
    cy.get(cesc("#/p2a/_number1")).contains('2');
    cy.get(cesc("#/p2a/_math1")).contains('y');
    cy.get(cesc("#/p3a")).contains('Hello 3!');
    cy.get(cesc("#/p3a/_number1")).contains('3');
    cy.get(cesc("#/p3a/_math1")).contains('z');

    cy.get(cesc("#/p1b")).contains('Hello 1!');
    cy.get(cesc("#/p1b/_number1")).contains('1');
    cy.get(cesc("#/p1b/_math1")).contains('x');
    cy.get(cesc("#/p2b")).contains('Hello 2!');
    cy.get(cesc("#/p2b/_number1")).contains('2');
    cy.get(cesc("#/p2b/_math1")).contains('y');
    cy.get(cesc("#/p3b")).contains('Hello 3!');
    cy.get(cesc("#/p3b/_number1")).contains('3');
    cy.get(cesc("#/p3b/_math1")).contains('z');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n2"].stateValues.value).eq(3);
      expect(stateVariables["/n3"].stateValues.value).eq(3);

      expect(stateVariables["/p1/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3/_number1"].stateValues.value).eq(3);
      expect(stateVariables["/p1a/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2a/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3a/_number1"].stateValues.value).eq(3);
      expect(stateVariables["/p1b/_number1"].stateValues.value).eq(1);
      expect(stateVariables["/p2b/_number1"].stateValues.value).eq(2);
      expect(stateVariables["/p3b/_number1"].stateValues.value).eq(3);

      expect(stateVariables["/p1/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2/_math1"].stateValues.value).eq('y');
      expect(stateVariables["/p3/_math1"].stateValues.value).eq('z');
      expect(stateVariables["/p1a/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2a/_math1"].stateValues.value).eq('y');
      expect(stateVariables["/p3a/_math1"].stateValues.value).eq('z');
      expect(stateVariables["/p1b/_math1"].stateValues.value).eq('x');
      expect(stateVariables["/p2b/_math1"].stateValues.value).eq('y');
      expect(stateVariables["/p3b/_math1"].stateValues.value).eq('z');

    });
  });

  it('copySource and createComponentOfType wrap to match specified type', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <mathinput name="mi" prefill="2" />
        
    <math name="m1" copySource="mi" />
    <copy source="mi" assignNames="m2" createComponentOfType="MatH" />

    <number name="n1" copySource="mi" />
    <copy source="mi" assignNames="n2" createComponentOfType="number" />

    <point name="P">(x,y)</point>

    <coords name="c1" copySource="P" />
    <copy assignNames="c2" source="P" createComponentOfType="coords" />
    <coords name="c3" copySource="P" copyprop="coords" />
    <copy assignNames="c4" source="P" createComponentOfType="coords" prop="coords" />

    <math name="mc1" copySource="P" />
    <copy assignNames="mc2" source="P" createComponentOfType="math" />
    <math name="mc3" copySource="P" copyprop="coords" />
    <copy assignNames="mc4" source="P" createComponentOfType="math" prop="coords" />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/m1') + ' .mjx-mrow').eq(0).contains('2');
    cy.get(cesc('#/m2') + ' .mjx-mrow').eq(0).contains('2');

    cy.get(cesc('#/n1')).contains('2');
    cy.get(cesc('#/n2')).contains('2');

    cy.get(cesc('#/c1') + ' .mjx-mrow').eq(0).contains('(x,y)');
    cy.get(cesc('#/c2') + ' .mjx-mrow').eq(0).contains('(x,y)');
    cy.get(cesc('#/c3') + ' .mjx-mrow').eq(0).contains('(x,y)');
    cy.get(cesc('#/c4') + ' .mjx-mrow').eq(0).contains('(x,y)');

    cy.get(cesc('#/mc1') + ' .mjx-mrow').eq(0).contains('(x,y)');
    cy.get(cesc('#/mc2') + ' .mjx-mrow').eq(0).contains('(x,y)');
    cy.get(cesc('#/mc3') + ' .mjx-mrow').eq(0).contains('(x,y)');
    cy.get(cesc('#/mc4') + ' .mjx-mrow').eq(0).contains('(x,y)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eq(2);
      expect(stateVariables["/m2"].stateValues.value).eq(2);

      expect(stateVariables["/n1"].stateValues.value).eq(2);
      expect(stateVariables["/n2"].stateValues.value).eq(2);

      expect(stateVariables["/c1"].stateValues.value).eqls(["vector", "x", "y"]);
      expect(stateVariables["/c2"].stateValues.value).eqls(["vector", "x", "y"]);
      expect(stateVariables["/c3"].stateValues.value).eqls(["vector", "x", "y"]);
      expect(stateVariables["/c4"].stateValues.value).eqls(["vector", "x", "y"]);

      expect(stateVariables["/mc1"].stateValues.value).eqls(["vector", "x", "y"]);
      expect(stateVariables["/mc2"].stateValues.value).eqls(["vector", "x", "y"]);
      expect(stateVariables["/mc3"].stateValues.value).eqls(["vector", "x", "y"]);
      expect(stateVariables["/mc4"].stateValues.value).eqls(["vector", "x", "y"]);

    });


    cy.log('enter a')
    cy.get(cesc('#/mi') + " textarea").type("{end}{backspace}a{enter}", { force: true });

    cy.get(cesc('#/m1') + ' .mjx-mrow').should('contain.text', 'a');

    cy.get(cesc('#/m1') + ' .mjx-mrow').eq(0).contains('a');
    cy.get(cesc('#/m2') + ' .mjx-mrow').eq(0).contains('a');

    cy.get(cesc('#/n1')).contains('NaN');
    cy.get(cesc('#/n2')).contains('NaN');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eq('a');
      expect(stateVariables["/m2"].stateValues.value).eq('a');

      expect(stateVariables["/n1"].stateValues.value).eqls(NaN);
      expect(stateVariables["/n2"].stateValues.value).eqls(NaN);


    });

  });

  it('add children to invalid copySource', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g" copySource="invalid">
      <point name="P" />
    </graph>

    <graph name="g2" copySource="invalid" newNamespace>
      <point name="P" />
    </graph>

    <math name="Pcoords" copySource="P" />
    <math name="g2Pcoords" copySource="g2/P" />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/Pcoords') + ' .mjx-mrow').eq(0).contains('(0,0)');
    cy.get(cesc('#/g2Pcoords') + ' .mjx-mrow').eq(0).contains('(0,0)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g"].activeChildren.length).eq(1);
      expect(stateVariables["/g"].activeChildren[0].componentName).eq("/P");
      expect(stateVariables["/P"].stateValues.xs).eqls([0, 0]);

      expect(stateVariables["/g2"].activeChildren.length).eq(1);
      expect(stateVariables["/g2"].activeChildren[0].componentName).eq("/g2/P");
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([0, 0]);

      expect(stateVariables["/Pcoords"].stateValues.value).eqls(["vector", 0, 0]);
      expect(stateVariables["/g2Pcoords"].stateValues.value).eqls(["vector", 0, 0]);

    });

    cy.log(`move points`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/P",
        args: { x: 7, y: 6 }
      })
    })

    cy.get(cesc('#/g2Pcoords') + ' .mjx-mrow').should('contain.text', '(7,6)');
    cy.get(cesc('#/Pcoords') + ' .mjx-mrow').should('contain.text', '(3,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([3, 5]);

      expect(stateVariables["/g2/P"].stateValues.xs).eqls([7, 6]);

      expect(stateVariables["/Pcoords"].stateValues.value).eqls(["vector", 3, 5]);
      expect(stateVariables["/g2Pcoords"].stateValues.value).eqls(["vector", 7, 6]);

    });


  });

  it('add children with copySource, different newNamespace combinations', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g1">
      <point name="P1">(1,2)</point>
    </graph>

    <graph name="g1a" copySource="g1">
      <vector name="v1">(4,5)</vector>
    </graph>

    <math name="P1coords" copySource="P1" />
    <math name="v1displacement" copySource="v1" />

    <graph name="g2">
      <point name="P2">(1,2)</point>
    </graph>

    <graph name="g2a" copySource="g2" newNamespace>
      <vector name="v2">(4,5)</vector>
    </graph>

    <math name="P2coords" copySource="P2" />
    <math name="P2acoords" copySource="g2a/P2" />
    <math name="v2displacement" copySource="g2a/v2" />

    <graph name="g3" newNamespace>
      <point name="P3">(1,2)</point>
    </graph>

    <graph name="g3a" copySource="g3" newNamespace>
      <vector name="v3">(4,5)</vector>
    </graph>

    <math name="P3coords" copySource="g3/P3" />
    <math name="P3acoords" copySource="g3a/P3" />
    <math name="v3displacement" copySource="g3a/v3" />

    <graph name="g4" newNamespace>
      <point name="P4">(1,2)</point>
    </graph>

    <graph name="g4a" copySource="g4">
      <vector name="v4">(4,5)</vector>
    </graph>

    <math name="P4coords" copySource="g4/P4" />
    <math name="P4acoords" copySource="g4a/P4" />
    <math name="v4displacement" copySource="v4" />



    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/P1coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/v1displacement') + ' .mjx-mrow').eq(0).contains('(4,5)');

    cy.get(cesc('#/P2coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/P2acoords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/v2displacement') + ' .mjx-mrow').eq(0).contains('(4,5)');

    cy.get(cesc('#/P3coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/P3acoords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/v3displacement') + ' .mjx-mrow').eq(0).contains('(4,5)');

    cy.get(cesc('#/P4coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/P4acoords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/v4displacement') + ' .mjx-mrow').eq(0).contains('(4,5)');

    let P1aName;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1"].activeChildren.length).eq(1);
      expect(stateVariables["/g1"].activeChildren[0].componentName).eq("/P1");
      expect(stateVariables["/P1"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g1a"].activeChildren.length).eq(2);
      expect(stateVariables["/g1a"].activeChildren[1].componentName).eq("/v1");
      P1aName = stateVariables["/g1a"].activeChildren[0].componentName
      expect(stateVariables[P1aName].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/v1"].stateValues.displacement).eqls([4, 5]);
      expect(stateVariables["/P1coords"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/v1displacement"].stateValues.value).eqls(["vector", 4, 5]);

      expect(stateVariables["/g2"].activeChildren.length).eq(1);
      expect(stateVariables["/g2"].activeChildren[0].componentName).eq("/P2");
      expect(stateVariables["/P2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g2a"].activeChildren.length).eq(2);
      expect(stateVariables["/g2a"].activeChildren[0].componentName).eq("/g2a/P2");
      expect(stateVariables["/g2a"].activeChildren[1].componentName).eq("/g2a/v2");
      expect(stateVariables["/g2a/P2"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g2a/v2"].stateValues.displacement).eqls([4, 5]);
      expect(stateVariables["/P2coords"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/P2acoords"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/v2displacement"].stateValues.value).eqls(["vector", 4, 5]);

      expect(stateVariables["/g3"].activeChildren.length).eq(1);
      expect(stateVariables["/g3"].activeChildren[0].componentName).eq("/g3/P3");
      expect(stateVariables["/g3/P3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g3a"].activeChildren.length).eq(2);
      expect(stateVariables["/g3a"].activeChildren[0].componentName).eq("/g3a/P3");
      expect(stateVariables["/g3a"].activeChildren[1].componentName).eq("/g3a/v3");
      expect(stateVariables["/g3a/P3"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g3a/v3"].stateValues.displacement).eqls([4, 5]);
      expect(stateVariables["/P3coords"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/P3acoords"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/v3displacement"].stateValues.value).eqls(["vector", 4, 5]);

      expect(stateVariables["/g4"].activeChildren.length).eq(1);
      expect(stateVariables["/g4"].activeChildren[0].componentName).eq("/g4/P4");
      expect(stateVariables["/g4/P4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g4a"].activeChildren.length).eq(2);
      expect(stateVariables["/g4a"].activeChildren[0].componentName).eq("/g4a/P4");
      expect(stateVariables["/g4a"].activeChildren[1].componentName).eq("/v4");
      expect(stateVariables["/g4a/P4"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/v4"].stateValues.displacement).eqls([4, 5]);
      expect(stateVariables["/P4coords"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/P4acoords"].stateValues.value).eqls(["vector", 1, 2]);
      expect(stateVariables["/v4displacement"].stateValues.value).eqls(["vector", 4, 5]);

    });

    cy.log(`move points`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P1",
        args: { x: 3, y: 5 }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v1",
        args: {
          headcoords: [8, 7]
        }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P2",
        args: { x: 6, y: 0 }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/g2a/v2",
        args: {
          headcoords: [9, 1]
        }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/P3",
        args: { x: 5, y: 8 }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/g3a/v3",
        args: {
          headcoords: [8, 6]
        }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/P4",
        args: { x: 0, y: 3 }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v4",
        args: {
          headcoords: [7, 2]
        }
      })
    })

    cy.get(cesc('#/v4displacement') + ' .mjx-mrow').should('contain.text', '(7,2)');

    cy.get(cesc('#/P1coords') + ' .mjx-mrow').eq(0).contains('(3,5)');
    cy.get(cesc('#/v1displacement') + ' .mjx-mrow').eq(0).contains('(8,7)');

    cy.get(cesc('#/P2coords') + ' .mjx-mrow').eq(0).contains('(6,0)');
    cy.get(cesc('#/P2acoords') + ' .mjx-mrow').eq(0).contains('(6,0)');
    cy.get(cesc('#/v2displacement') + ' .mjx-mrow').eq(0).contains('(9,1)');

    cy.get(cesc('#/P3coords') + ' .mjx-mrow').eq(0).contains('(5,8)');
    cy.get(cesc('#/P3acoords') + ' .mjx-mrow').eq(0).contains('(5,8)');
    cy.get(cesc('#/v3displacement') + ' .mjx-mrow').eq(0).contains('(8,6)');

    cy.get(cesc('#/P4coords') + ' .mjx-mrow').eq(0).contains('(0,3)');
    cy.get(cesc('#/P4acoords') + ' .mjx-mrow').eq(0).contains('(0,3)');
    cy.get(cesc('#/v4displacement') + ' .mjx-mrow').eq(0).contains('(7,2)');

    cy.window().then(async (win) => {

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables[P1aName].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/v1"].stateValues.displacement).eqls([8, 7]);
      expect(stateVariables["/P1coords"].stateValues.value).eqls(["vector", 3, 5]);
      expect(stateVariables["/v1displacement"].stateValues.value).eqls(["vector", 8, 7]);

      expect(stateVariables["/P2"].stateValues.xs).eqls([6, 0]);
      expect(stateVariables["/g2a/P2"].stateValues.xs).eqls([6, 0]);
      expect(stateVariables["/g2a/v2"].stateValues.displacement).eqls([9, 1]);
      expect(stateVariables["/P2coords"].stateValues.value).eqls(["vector", 6, 0]);
      expect(stateVariables["/P2acoords"].stateValues.value).eqls(["vector", 6, 0]);
      expect(stateVariables["/v2displacement"].stateValues.value).eqls(["vector", 9, 1]);

      expect(stateVariables["/g3/P3"].stateValues.xs).eqls([5, 8]);
      expect(stateVariables["/g3a/P3"].stateValues.xs).eqls([5, 8]);
      expect(stateVariables["/g3a/v3"].stateValues.displacement).eqls([8, 6]);
      expect(stateVariables["/P3coords"].stateValues.value).eqls(["vector", 5, 8]);
      expect(stateVariables["/P3acoords"].stateValues.value).eqls(["vector", 5, 8]);
      expect(stateVariables["/v3displacement"].stateValues.value).eqls(["vector", 8, 6]);

      expect(stateVariables["/g4/P4"].stateValues.xs).eqls([0, 3]);
      expect(stateVariables["/g4a/P4"].stateValues.xs).eqls([0, 3]);
      expect(stateVariables["/v4"].stateValues.displacement).eqls([7, 2]);
      expect(stateVariables["/P4coords"].stateValues.value).eqls(["vector", 0, 3]);
      expect(stateVariables["/P4acoords"].stateValues.value).eqls(["vector", 0, 3]);
      expect(stateVariables["/v4displacement"].stateValues.value).eqls(["vector", 7, 2]);

    });


    cy.log(`move shadowed points`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: P1aName,
        args: { x: 2, y: 1 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2a/P2",
        args: { x: 5, y: 4 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3a/P3",
        args: { x: 9, y: 7 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4a/P4",
        args: { x: 7, y: 6 }
      })
    })

    cy.get(cesc('#/P4coords') + ' .mjx-mrow').should('contain.text', '(7,6)');

    cy.get(cesc('#/P1coords') + ' .mjx-mrow').eq(0).contains('(2,1)');
    cy.get(cesc('#/v1displacement') + ' .mjx-mrow').eq(0).contains('(8,7)');

    cy.get(cesc('#/P2coords') + ' .mjx-mrow').eq(0).contains('(5,4)');
    cy.get(cesc('#/P2acoords') + ' .mjx-mrow').eq(0).contains('(5,4)');
    cy.get(cesc('#/v2displacement') + ' .mjx-mrow').eq(0).contains('(9,1)');

    cy.get(cesc('#/P3coords') + ' .mjx-mrow').eq(0).contains('(9,7)');
    cy.get(cesc('#/P3acoords') + ' .mjx-mrow').eq(0).contains('(9,7)');
    cy.get(cesc('#/v3displacement') + ' .mjx-mrow').eq(0).contains('(8,6)');

    cy.get(cesc('#/P4coords') + ' .mjx-mrow').eq(0).contains('(7,6)');
    cy.get(cesc('#/P4acoords') + ' .mjx-mrow').eq(0).contains('(7,6)');
    cy.get(cesc('#/v4displacement') + ' .mjx-mrow').eq(0).contains('(7,2)');

    cy.window().then(async (win) => {

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.xs).eqls([2, 1]);
      expect(stateVariables[P1aName].stateValues.xs).eqls([2, 1]);
      expect(stateVariables["/v1"].stateValues.displacement).eqls([8, 7]);
      expect(stateVariables["/P1coords"].stateValues.value).eqls(["vector", 2, 1]);
      expect(stateVariables["/v1displacement"].stateValues.value).eqls(["vector", 8, 7]);

      expect(stateVariables["/P2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/g2a/P2"].stateValues.xs).eqls([5, 4]);
      expect(stateVariables["/g2a/v2"].stateValues.displacement).eqls([9, 1]);
      expect(stateVariables["/P2coords"].stateValues.value).eqls(["vector", 5, 4]);
      expect(stateVariables["/P2acoords"].stateValues.value).eqls(["vector", 5, 4]);
      expect(stateVariables["/v2displacement"].stateValues.value).eqls(["vector", 9, 1]);

      expect(stateVariables["/g3/P3"].stateValues.xs).eqls([9, 7]);
      expect(stateVariables["/g3a/P3"].stateValues.xs).eqls([9, 7]);
      expect(stateVariables["/g3a/v3"].stateValues.displacement).eqls([8, 6]);
      expect(stateVariables["/P3coords"].stateValues.value).eqls(["vector", 9, 7]);
      expect(stateVariables["/P3acoords"].stateValues.value).eqls(["vector", 9, 7]);
      expect(stateVariables["/v3displacement"].stateValues.value).eqls(["vector", 8, 6]);

      expect(stateVariables["/g4/P4"].stateValues.xs).eqls([7, 6]);
      expect(stateVariables["/g4a/P4"].stateValues.xs).eqls([7, 6]);
      expect(stateVariables["/v4"].stateValues.displacement).eqls([7, 2]);
      expect(stateVariables["/P4coords"].stateValues.value).eqls(["vector", 7, 6]);
      expect(stateVariables["/P4acoords"].stateValues.value).eqls(["vector", 7, 6]);
      expect(stateVariables["/v4displacement"].stateValues.value).eqls(["vector", 7, 2]);

    });

  });

  it('add children with copySource, ignore implicit newNamespace when copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <group name="grp">
      <graph name="g" size="small" newNamespace>
        <point name="P">(1,2)</point>
      </graph>
    
      <graph name="g2" copySource="g">
        <vector name="v" />
      </graph>
    
      <graph name="g3" copySource="g2" newNamespace />

      <graph name="g4" copySource="g2" />
    
    </group>
    
    <group copySource="grp" name="grp2" newNamespace />
  
    <p>Point 1: <math copySource="g/P" name="P1coords" /></p>
    <p>Point 2: <math copySource="g2/P" name="P2coords" /></p>
    <p>Vector 2: <math copySource="v" name="v2displacement" /></p>
    <p>Point 3: <math copySource="g3/P" name="P3coords" /></p>
    <p>Vector 3: <math copySource="g3/v" name="v3displacement" /></p>
    <p>Point 4: <math copySource="g4/P" name="P4coords" /></p>
    <p>Nothing at g4/v: <math copySource="g4/v" name="v4nodisplacement" /></p>

    <group name="grp2ps" newNamespace>
      <p>Grp2 Point 1: <math copySource="/grp2/g/P" name="P1coords" /></p>
      <p>Grp2 Point 2: <math copySource="/grp2/g2/P" name="P2coords" /></p>

      <p>Grp2 Vector 2: <math copySource="/grp2/v" name="v2displacement" /></p>
      <p>Nothing at /grp2/g2/v: <math copySource="/grp2/g2/v" name="v2nodisplacement" /></p>

      <p>Grp2 Point 3: <math copySource="/grp2/g3/P" name="P3coords" /></p>
      <p>Grp2 Vector 3: <math copySource="/grp2/g3/v" name="v3displacement" /></p>
 
      <p>Grp2 Point 4: <math copySource="/grp2/g4/P" name="P4coords" /></p>
      <p>Nothing at /grp2/g4/v: <math copySource="/grp2/g4/v" name="v4nodisplacement" /></p>
    </group>


    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/P1coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/P2coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/v2displacement') + ' .mjx-mrow').eq(0).contains('(1,0)');
    cy.get(cesc('#/P3coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/v3displacement') + ' .mjx-mrow').eq(0).contains('(1,0)');
    cy.get(cesc('#/P4coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/v4nodisplacement') + ' .mjx-mrow').eq(0).contains('\uff3f');

    cy.get(cesc('#/grp2ps/P1coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/grp2ps/P2coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/grp2ps/v2displacement') + ' .mjx-mrow').eq(0).contains('(1,0)');
    cy.get(cesc('#/grp2ps/v2nodisplacement') + ' .mjx-mrow').eq(0).contains('\uff3f');
    cy.get(cesc('#/grp2ps/P3coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/grp2ps/v3displacement') + ' .mjx-mrow').eq(0).contains('(1,0)');
    cy.get(cesc('#/grp2ps/P4coords') + ' .mjx-mrow').eq(0).contains('(1,2)');
    cy.get(cesc('#/grp2ps/v4nodisplacement') + ' .mjx-mrow').eq(0).contains('\uff3f');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/v"].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g3/v"].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls([1, 2]);
      let g4vName = stateVariables["/g4"].activeChildren[1].componentName
      expect(g4vName.substring(0, 3) === "/__");
      expect(stateVariables[g4vName].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/g4/v"]).eq(undefined);


      expect(stateVariables["/grp2/g/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/grp2/g2/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/grp2/v"].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/grp2/g2/v"]).eq(undefined);
      expect(stateVariables["/grp2/g3/P"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/grp2/g3/v"].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/grp2/g4/P"].stateValues.xs).eqls([1, 2]);
      let grp2g4vName = stateVariables["/grp2/g4"].activeChildren[1].componentName
      expect(grp2g4vName.substring(0, 3) === "/__");
      expect(stateVariables[grp2g4vName].stateValues.displacement).eqls([1, 0]);
      expect(stateVariables["/grp2/g4/v"]).eq(undefined);

    });


  });

  it('add children with copySource, multiple levels of groups', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="grp0" >
      <group name="grp1">
    
        <graph name="g" newNamespace>
          <point name="P">(1,2)</point>
        </graph>
      
        <graph name="g2" copySource="g">
          <vector name="v">(4,5)</vector>
        </graph>
      
        <graph name="g3" copySource="g2" newNamespace>
          <circle name="c" center="$(../g/P)" />
          <lineSegment name="l" endpoints="$P $(../v.head)" />
        </graph>
      
        <copy name="cp1" source="g" assignNames="g4" />
        
        <graph copySource="cp1" name="g5" newNamespace>
          <circle name="c" />
        </graph>
        
      </group>
      
      
      <group copySource="grp1" name="grp2" newNamespace>
      
        <graph copySource="../g5" name="g6">
          <lineSegment name="l" endpoints="$(g6/c.center) $(../g4/P)" />
        </graph>
      
      </group>
    
    </group>
    
    
    <group copySource="grp0" name="grp3" newNamespace>
    
      <graph copySource="../grp2/g6" name="g7" newNamespace>
        <vector name="v" tail="$l.endpoint1" head="$(../v.head)" />
      </graph>
    
    </group>
    
    <p>Point 1: <math copySource="g/P" name="P1coords" /></p>
    <p>Point 2: <math copySource="g2/P" name="P2coords" /></p>
    <p>Vector 2: <math copySource="v" name="v2displacement" /></p>
    <p>Point 3: <math copySource="g3/P" name="P3coords" /></p>
    <p>Vector 3: <math copySource="g3/v" name="v3displacement" /></p>
    <p>Circle 3 center: <math copySource="g3/c.center" name="c3center" /></p>
    <p>Line segment 3 point 1: <math copySource="g3/l.endpoint1" name="l3point1" /></p>
    <p>Line segment 3 point 2: <math copySource="g3/l.endpoint2" name="l3point2" /></p>
    <p>Point 4: <math copySource="g4/P" name="P4coords" /></p>
    <p>Point 5: <math copySource="g5/P" name="P5coords" /></p>
    <p>Circle 5 center: <math copySource="g5/c.center" name="c5center" /></p>
    
    <group name="grp2ps" newNamespace>
      <p>Grp2 Point 1: <math copySource="/grp2/g/P" name="P1coords" /></p>
      <p>Grp2 Point 2: <math copySource="/grp2/g2/P" name="P2coords" /></p>
      <p>Grp2 Vector 2: <math copySource="/grp2/v" name="v2displacement" /></p>
      <p>Grp2 Point 3: <math copySource="/grp2/g3/P" name="P3coords" /></p>
      <p>Grp2 Vector 3: <math copySource="/grp2/g3/v" name="v3displacement" /></p>
      <p>Grp2 Circle 3 center: <math copySource="/grp2/g3/c.center" name="c3center" /></p>
      <p>Grp2 Line segment 3 point 1: <math copySource="/grp2/g3/l.endpoint1" name="l3point1" /></p>
      <p>Grp2 Line segment 3 point 2: <math copySource="/grp2/g3/l.endpoint2" name="l3point2" /></p>
      <p>Grp2 Point 4: <math copySource="/grp2/g4/P" name="P4coords" /></p>
      <p>Grp2 Point 5: <math copySource="/grp2/g5/P" name="P5coords" /></p>
      <p>Grp2 Circle 5 center: <math copySource="/grp2/g5/c.center" name="c5center" /></p>
      <p>Grp2 Point 6: <math copySource="/grp2/g6/P" name="P6coords" /></p>
      <p>Grp2 Circle 6 center: <math copySource="/grp2/g6/c.center" name="c6center" /></p>
      <p>Grp2 Line segment 6 point 1: <math copySource="/grp2/l.endpoint1" name="l6point1" /></p>
      <p>Grp2 Line segment 6 point 2: <math copySource="/grp2/l.endpoint2" name="l6point2" /></p>
    </group>

    
    <group name="grp3ps" newNamespace>

      <p>Grp3 Point 1: <math copySource="/grp3/g/P" name="P1coords" /></p>
      <p>Grp3 Point 2: <math copySource="/grp3/g2/P" name="P2coords" /></p>
      <p>Grp3 Vector 2: <math copySource="/grp3/v" name="v2displacement" /></p>
      <p>Grp3 Point 3: <math copySource="/grp3/g3/P" name="P3coords" /></p>
      <p>Grp3 Vector 3: <math copySource="/grp3/g3/v" name="v3displacement" /></p>
      <p>Grp3 Circle 3 center: <math copySource="/grp3/g3/c.center" name="c3center" /></p>
      <p>Grp3 Line segment 3 point 1: <math copySource="/grp3/g3/l.endpoint1" name="l3point1" /></p>
      <p>Grp3 Line segment 3 point 2: <math copySource="/grp3/g3/l.endpoint2" name="l3point2" /></p>
      <p>Grp3 Point 4: <math copySource="/grp3/g4/P" name="P4coords" /></p>
      <p>Grp3 Point 5: <math copySource="/grp3/g5/P" name="P5coords" /></p>
      <p>Grp3 Circle 5 center: <math copySource="/grp3/g5/c.center" name="c5center" /></p>
      
      <group name="grp2ps" newNamespace>
        <p>Grp3 Grp2 Point 1: <math copySource="/grp3/grp2/g/P" name="P1coords" /></p>
        <p>Grp3 Grp2 Point 2: <math copySource="/grp3/grp2/g2/P" name="P2coords" /></p>
        <p>Grp3 Grp2 Vector 2: <math copySource="/grp3/grp2/v" name="v2displacement" /></p>
        <p>Grp3 Grp2 Point 3: <math copySource="/grp3/grp2/g3/P" name="P3coords" /></p>
        <p>Grp3 Grp2 Vector 3: <math copySource="/grp3/grp2/g3/v" name="v3displacement" /></p>
        <p>Grp3 Grp2 Circle 3 center: <math copySource="/grp3/grp2/g3/c.center" name="c3center" /></p>
        <p>Grp3 Grp2 Line segment 3 point 1: <math copySource="/grp3/grp2/g3/l.endpoint1" name="l3point1" /></p>
        <p>Grp3 Grp2 Line segment 3 point 2: <math copySource="/grp3/grp2/g3/l.endpoint2" name="l3point2" /></p>
        <p>Grp3 Grp2 Point 4: <math copySource="/grp3/grp2/g4/P" name="P4coords" /></p>
        <p>Grp3 Grp2 Point 5: <math copySource="/grp3/grp2/g5/P" name="P5coords" /></p>
        <p>Grp3 Grp2 Circle 5 center: <math copySource="/grp3/grp2/g5/c.center" name="c5center" /></p>
        <p>Grp3 Grp2 Point 6: <math copySource="/grp3/grp2/g6/P" name="P6coords" /></p>
        <p>Grp3 Grp2 Circle 6 center: <math copySource="/grp3/grp2/g6/c.center" name="c6center" /></p>
        <p>Grp3 Grp2 Line segment 6 point 1: <math copySource="/grp3/grp2/l.endpoint1" name="l6point1" /></p>
        <p>Grp3 Grp2 Line segment 6 point 2: <math copySource="/grp3/grp2/l.endpoint2" name="l6point2" /></p>
        <p>Grp3 Point 7: <math copySource="/grp3/g7/P" name="P7coords" /></p>
        <p>Grp3 Circle 7 center: <math copySource="/grp3/g7/c.center" name="c7center" /></p>
        <p>Grp3 Line segment 7 point 1: <math copySource="/grp3/g7/l.endpoint1" name="l7point1" /></p>
        <p>Grp3 Line segment 7 point 2: <math copySource="/grp3/g7/l.endpoint2" name="l7point2" /></p>
        <p>Grp3 Vector 7 head: <math copySource="/grp3/g7/v.head" name="v7head" /></p>
        <p>Grp3 Vector 7 tail: <math copySource="/grp3/g7/v.tail" name="v7tail" /></p>
      </group>

    </group>



    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let P = [1, 2];
    let v = [4, 5];
    let vH = [4, 5];
    let c0 = [0, 0];

    cy.get(cesc('#/P1coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/P2coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/v2displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/P3coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/v3displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/c3center') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/l3point1') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/l3point2') + ' .mjx-mrow').eq(0).contains('(' + vH + ')');
    cy.get(cesc('#/P4coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/P5coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/c5center') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');


    cy.get(cesc('#/grp2ps/P1coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/P2coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/v2displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp2ps/P3coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/v3displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp2ps/c3center') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/l3point1') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/l3point2') + ' .mjx-mrow').eq(0).contains('(' + vH + ')');
    cy.get(cesc('#/grp2ps/P4coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/P5coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/c5center') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');
    cy.get(cesc('#/grp2ps/P6coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/l6point1') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');
    cy.get(cesc('#/grp2ps/l6point2') + ' .mjx-mrow').eq(0).contains('(' + P + ')');


    cy.get(cesc('#/grp3ps/P1coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/P2coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/v2displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp3ps/P3coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/v3displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp3ps/c3center') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/l3point1') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/l3point2') + ' .mjx-mrow').eq(0).contains('(' + vH + ')');
    cy.get(cesc('#/grp3ps/P4coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/P5coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/c5center') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');


    cy.get(cesc('#/grp3ps/grp2ps/P1coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P2coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/v2displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P3coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/v3displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp3ps/grp2ps/c3center') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l3point1') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l3point2') + ' .mjx-mrow').eq(0).contains('(' + vH + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P4coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P5coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/c5center') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P6coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l6point1') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l6point2') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P7coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l7point1') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l7point2') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/v7head') + ' .mjx-mrow').eq(0).contains('(' + vH + ')');
    cy.get(cesc('#/grp3ps/grp2ps/v7tail') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g5/c"].stateValues.center).eqls(c0);

      expect(stateVariables["/grp2/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp2/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp2/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp2/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/grp2/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/grp2/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g5/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp2/g6/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g6/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp2/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp2/l"].stateValues.endpoints[1]).eqls(P);

      expect(stateVariables["/grp3/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp3/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/grp3/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/grp3/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g5/c"].stateValues.center).eqls(c0);

      expect(stateVariables["/grp3/grp2/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/grp2/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/grp2/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp3/grp2/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/grp3/grp2/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/grp3/grp2/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g5/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/grp2/g6/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g6/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/grp2/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp3/grp2/l"].stateValues.endpoints[1]).eqls(P);
      expect(stateVariables["/grp3/g7/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g7/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/g7/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp3/g7/l"].stateValues.endpoints[1]).eqls(P);
      expect(stateVariables["/grp3/g7/v"].stateValues.head).eqls(vH);
      expect(stateVariables["/grp3/g7/v"].stateValues.tail).eqls(c0);

    });


    cy.log('move objects')
    cy.window().then(async (win) => {
      P = [3, 5]
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g/P",
        args: { x: P[0], y: P[1] }
      })
      v = [8, 7]
      vH = [5, 1]
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v",
        args: {
          headcoords: vH,
          tailcoords: [vH[0] - v[0], vH[1] - v[1]],
        }
      })
      c0 = [6, 0];
      win.callAction1({
        actionName: "moveCircle",
        componentName: "/g5/c",
        args: { center: c0 }
      })
    })

    cy.get(cesc('#/grp3ps/grp2ps/v7tail') + ' .mjx-mrow').should('contain.text', '(' + c0 + ')');


    cy.get(cesc('#/P1coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/P2coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/v2displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/P3coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/v3displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/c3center') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/l3point1') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/l3point2') + ' .mjx-mrow').eq(0).contains('(' + vH + ')');
    cy.get(cesc('#/P4coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/P5coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/c5center') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');


    cy.get(cesc('#/grp2ps/P1coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/P2coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/v2displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp2ps/P3coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/v3displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp2ps/c3center') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/l3point1') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/l3point2') + ' .mjx-mrow').eq(0).contains('(' + vH + ')');
    cy.get(cesc('#/grp2ps/P4coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/P5coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/c5center') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');
    cy.get(cesc('#/grp2ps/P6coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp2ps/l6point1') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');
    cy.get(cesc('#/grp2ps/l6point2') + ' .mjx-mrow').eq(0).contains('(' + P + ')');


    cy.get(cesc('#/grp3ps/P1coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/P2coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/v2displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp3ps/P3coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/v3displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp3ps/c3center') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/l3point1') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/l3point2') + ' .mjx-mrow').eq(0).contains('(' + vH + ')');
    cy.get(cesc('#/grp3ps/P4coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/P5coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/c5center') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');


    cy.get(cesc('#/grp3ps/grp2ps/P1coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P2coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/v2displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P3coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/v3displacement') + ' .mjx-mrow').eq(0).contains('(' + v + ')');
    cy.get(cesc('#/grp3ps/grp2ps/c3center') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l3point1') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l3point2') + ' .mjx-mrow').eq(0).contains('(' + vH + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P4coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P5coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/c5center') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P6coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l6point1') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l6point2') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/P7coords') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l7point1') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');
    cy.get(cesc('#/grp3ps/grp2ps/l7point2') + ' .mjx-mrow').eq(0).contains('(' + P + ')');
    cy.get(cesc('#/grp3ps/grp2ps/v7head') + ' .mjx-mrow').eq(0).contains('(' + vH + ')');
    cy.get(cesc('#/grp3ps/grp2ps/v7tail') + ' .mjx-mrow').eq(0).contains('(' + c0 + ')');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/g5/c"].stateValues.center).eqls(c0);

      expect(stateVariables["/grp2/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp2/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp2/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp2/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/grp2/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/grp2/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g5/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp2/g6/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp2/g6/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp2/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp2/l"].stateValues.endpoints[1]).eqls(P);

      expect(stateVariables["/grp3/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp3/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/grp3/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/grp3/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g5/c"].stateValues.center).eqls(c0);

      expect(stateVariables["/grp3/grp2/g/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g2/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/grp2/g3/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g3/v"].stateValues.displacement).eqls(v);
      expect(stateVariables["/grp3/grp2/g3/c"].stateValues.center).eqls(P);
      expect(stateVariables["/grp3/grp2/g3/l"].stateValues.endpoints[0]).eqls(P);
      expect(stateVariables["/grp3/grp2/g3/l"].stateValues.endpoints[1]).eqls(vH);
      expect(stateVariables["/grp3/grp2/g4/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g5/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g5/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/grp2/g6/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/grp2/g6/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/grp2/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp3/grp2/l"].stateValues.endpoints[1]).eqls(P);
      expect(stateVariables["/grp3/g7/P"].stateValues.xs).eqls(P);
      expect(stateVariables["/grp3/g7/c"].stateValues.center).eqls(c0);
      expect(stateVariables["/grp3/g7/l"].stateValues.endpoints[0]).eqls(c0);
      expect(stateVariables["/grp3/g7/l"].stateValues.endpoints[1]).eqls(P);
      expect(stateVariables["/grp3/g7/v"].stateValues.head).eqls(vH);
      expect(stateVariables["/grp3/g7/v"].stateValues.tail).eqls(c0);

    });



  });

  it('dot and array notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P">(2,3)</point>
    </graph>
    
    <p name="p1">P: $P</p>
    <p name="p2">P: $P[1]</p>
    <p name="p3">nothing: $P[2]</p>
    <p name="p4">P.: $P.</p>
    <p name="p5">P.1: $P.1</p>
    <p name="p6">x of P: $P.x</p>
    <p name="p7">y of P: $P.y</p>
    <p name="p8">nothing: $P._x</p>
    <p name="p9">x of P: $P.xs[1]</p>
    <p name="p10">y of P: $P.xs[2]</p>
    <p name="p11">nothing: $P.xs[3]</p>
    
    
    <p name="p12">P: $(P)</p>
    <p name="p13">(P).x: $(P).x</p>
    <p name="p14">no match: $(P.)</p>
    <p name="p15">nothing: $(P.1)</p>
    <p name="p16">x of P: $(P.x)</p>
    <p name="p17">y of P: $(P.y)</p>
    <p name="p18">x of P: $(P.xs[1])</p>
    <p name="p19">y of P: $(P.xs[2])</p>


    <p name="p20">P: <copy source="P" /></p>
    <p name="p21">P: <copy source="P[1]" /></p>
    <p name="p22">nothing: <copy source="P[2]" /></p>
    <p name="p23">nothing: <copy source="P." /></p>
    <p name="p24">nothing: <copy source="P.1" /></p>
    <p name="p25">x of P: <copy source="P.x" /></p>
    <p name="p26">y of P: <copy source="P.y" /></p>
    <p name="p27">nothing: <copy source="P._x" /></p>
    <p name="p28">x of P: <copy source="P.xs[1]" /></p>
    <p name="p29">y of P: <copy source="P.xs[2]" /></p>
    <p name="p30">nothing: <copy source="P.xs[3]" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '(2,3)');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '(2,3)');
    cy.get(cesc('#/p3')).should('have.text', "nothing: ")
    cy.get(cesc('#/p4') + ' .mjx-mrow').eq(0).should('have.text', '(2,3)');
    cy.get(cesc('#/p4')).should('contain.text', ').');
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(0).should('have.text', '(2,3)');
    cy.get(cesc('#/p5')).should('contain.text', ').1');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(0).should('have.text', '2');
    cy.get(cesc('#/p7') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p8')).should('have.text', "nothing: ");
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(0).should('have.text', '2');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p11')).should('have.text', "nothing: ");

    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(0).should('have.text', '(2,3)');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(0).should('have.text', '(2,3)');
    cy.get(cesc('#/p13')).should('contain.text', ').x');
    cy.get(cesc('#/p14')).should('have.text', "no match: $(P.)");
    cy.get(cesc('#/p15')).should('have.text', "nothing: ");
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(0).should('have.text', '2');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p18') + ' .mjx-mrow').eq(0).should('have.text', '2');
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(0).should('have.text', '3');

    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(0).should('have.text', '(2,3)');
    cy.get(cesc('#/p21') + ' .mjx-mrow').eq(0).should('have.text', '(2,3)');
    cy.get(cesc('#/p22')).should('have.text', "nothing: ")
    cy.get(cesc('#/p23')).should('have.text', "nothing: ")
    cy.get(cesc('#/p24')).should('have.text', "nothing: ")
    cy.get(cesc('#/p25') + ' .mjx-mrow').eq(0).should('have.text', '2');
    cy.get(cesc('#/p26') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p27')).should('have.text', "nothing: ")
    cy.get(cesc('#/p28') + ' .mjx-mrow').eq(0).should('have.text', '2');
    cy.get(cesc('#/p29') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p30')).should('have.text', "nothing: ");


  });

  it('dot and array notation, chaining, macros', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph size="small">
      <line name="l" through="(2/3,3) (5,6)" displayDigits="2" />
    </graph>
    
    <p name="p1">$l.points.coords</p>
    <p name="p2">$l.points.x</p>
    <p name="p3">$l.points.y</p>
    <p name="p4">$l.points.bad</p>
    <p name="p5">$l.points.xs[1]</p>
    <p name="p6">$l.points.xs[2]</p>
    <p name="p7">$l.points.xs[3]</p>

    <p name="p8">$l.points[1].coords</p>
    <p name="p9">$l.points[1].x</p>
    <p name="p10">$l.points[1].y</p>
    <p name="p11">$l.points[1].bad</p>
    <p name="p12">$l.points[1].xs[1]</p>
    <p name="p13">$l.points[1].xs[2]</p>
    <p name="p14">$l.points[1].xs[3]</p>

    <p name="p15">$l.points[2].coords</p>
    <p name="p16">$l.points[2].x</p>
    <p name="p17">$l.points[2].y</p>
    <p name="p18">$l.points[2].bad</p>
    <p name="p19">$l.points[2].xs[1]</p>
    <p name="p20">$l.points[2].xs[2]</p>
    <p name="p21">$l.points[2].xs[3]</p>

    <p name="p22">$l.points[3].coords</p>
    <p name="p23">$l.points[3].x</p>
    <p name="p24">$l.points[3].y</p>
    <p name="p25">$l.points[3].bad</p>
    <p name="p26">$l.points[3].xs[1]</p>
    <p name="p27">$l.points[3].xs[2]</p>
    <p name="p28">$l.points[3].xs[3]</p>

    <p name="p29">$l.points.coords.latex</p>
    <p name="p30">$l.points.x.latex</p>
    <p name="p31">$l.points.y.latex</p>
    <p name="p32">$l.points.bad.latex</p>
    <p name="p33">$l.points.xs[1].latex</p>
    <p name="p34">$l.points.xs[2].latex</p>
    <p name="p35">$l.points.xs[3].latex</p>
    
    <p name="p36">$l.points[1].coords.latex</p>
    <p name="p37">$l.points[1].x.latex</p>
    <p name="p38">$l.points[1].y.latex</p>
    <p name="p39">$l.points[1].bad.latex</p>
    <p name="p40">$l.points[1].xs[1].latex</p>
    <p name="p41">$l.points[1].xs[2].latex</p>
    <p name="p42">$l.points[1].xs[3].latex</p>

    <p name="p43">$l.points[1][1]</p>
    <p name="p44">$l.points[1][2]</p>
    <p name="p45">$l.points[2][1]</p>
    <p name="p46">$l.points[2][2]</p>
    <p name="p47">$l.points[0][1]</p>
    <p name="p48">$l.points[1][0]</p>
    <p name="p49">$l.points[1][3]</p>
    <p name="p50">$l.points[3][1]</p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '(23,3)');
    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(3).should('have.text', '(5,6)');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '23');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(1).should('have.text', '5');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(1).should('have.text', '6');
    cy.get(cesc('#/p4')).should('have.text', '')
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(0).should('have.text', '23');
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(1).should('have.text', '5');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(1).should('have.text', '6');
    cy.get(cesc('#/p7')).should('have.text', '')

    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(0).should('have.text', '(23,3)');
    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(0).should('have.text', '23');
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p11')).should('have.text', '')
    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(0).should('have.text', '23');
    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p14')).should('have.text', '')

    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(0).should('have.text', '(5,6)');
    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(0).should('have.text', '5');
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(0).should('have.text', '6');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p18')).should('have.text', '')
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(0).should('have.text', '5');
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(0).should('have.text', '6');
    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p21')).should('have.text', '')

    cy.get(cesc('#/p22')).should('have.text', '')
    cy.get(cesc('#/p23')).should('have.text', '')
    cy.get(cesc('#/p24')).should('have.text', '')
    cy.get(cesc('#/p25')).should('have.text', '')
    cy.get(cesc('#/p26')).should('have.text', '')
    cy.get(cesc('#/p27')).should('have.text', '')
    cy.get(cesc('#/p28')).should('have.text', '')

    cy.get(cesc('#/p29')).should('have.text', '\\left( \\frac{2}{3}, 3 \\right)\\left( 5, 6 \\right)');
    cy.get(cesc('#/p30')).should('have.text', '\\frac{2}{3}5');
    cy.get(cesc('#/p31')).should('have.text', '36');
    cy.get(cesc('#/p32')).should('have.text', '')
    cy.get(cesc('#/p33')).should('have.text', '\\frac{2}{3}5');
    cy.get(cesc('#/p34')).should('have.text', '36');
    cy.get(cesc('#/p35')).should('have.text', '')

    cy.get(cesc('#/p36')).should('have.text', '\\left( \\frac{2}{3}, 3 \\right)');
    cy.get(cesc('#/p37')).should('have.text', '\\frac{2}{3}');
    cy.get(cesc('#/p38')).should('have.text', '3');
    cy.get(cesc('#/p39')).should('have.text', '')
    cy.get(cesc('#/p40')).should('have.text', '\\frac{2}{3}');
    cy.get(cesc('#/p41')).should('have.text', '3');
    cy.get(cesc('#/p42')).should('have.text', '')

    cy.get(cesc('#/p43') + ' .mjx-mrow').eq(0).should('have.text', '23');
    cy.get(cesc('#/p44') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p45') + ' .mjx-mrow').eq(0).should('have.text', '5');
    cy.get(cesc('#/p46') + ' .mjx-mrow').eq(0).should('have.text', '6');
    cy.get(cesc('#/p47')).should('have.text', '')
    cy.get(cesc('#/p48')).should('have.text', '')
    cy.get(cesc('#/p49')).should('have.text', '')
    cy.get(cesc('#/p50')).should('have.text', '')


    cy.log('move points');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [7, 8],
          point2coords: [9, 0]
        }
      })
    })

    cy.get(cesc('#/p29')).should('have.text', '\\left( 7, 8 \\right)\\left( 9, 0 \\right)');

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '(7,8)');
    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(3).should('have.text', '(9,0)');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '7');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(1).should('have.text', '9');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(0).should('have.text', '8');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(1).should('have.text', '0');
    cy.get(cesc('#/p4')).should('have.text', '')
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(0).should('have.text', '7');
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(1).should('have.text', '9');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(0).should('have.text', '8');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(1).should('have.text', '0');
    cy.get(cesc('#/p7')).should('have.text', '')

    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(0).should('have.text', '(7,8)');
    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(0).should('have.text', '7');
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(0).should('have.text', '8');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p11')).should('have.text', '')
    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(0).should('have.text', '7');
    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(0).should('have.text', '8');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p14')).should('have.text', '')

    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(0).should('have.text', '(9,0)');
    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(0).should('have.text', '9');
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p18')).should('have.text', '')
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(0).should('have.text', '9');
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p21')).should('have.text', '')

    cy.get(cesc('#/p22')).should('have.text', '')
    cy.get(cesc('#/p23')).should('have.text', '')
    cy.get(cesc('#/p24')).should('have.text', '')
    cy.get(cesc('#/p25')).should('have.text', '')
    cy.get(cesc('#/p26')).should('have.text', '')
    cy.get(cesc('#/p27')).should('have.text', '')
    cy.get(cesc('#/p28')).should('have.text', '')

    cy.get(cesc('#/p29')).should('have.text', '\\left( 7, 8 \\right)\\left( 9, 0 \\right)');
    cy.get(cesc('#/p30')).should('have.text', '79');
    cy.get(cesc('#/p31')).should('have.text', '80');
    cy.get(cesc('#/p32')).should('have.text', '')
    cy.get(cesc('#/p33')).should('have.text', '79');
    cy.get(cesc('#/p34')).should('have.text', '80');
    cy.get(cesc('#/p35')).should('have.text', '')

    cy.get(cesc('#/p36')).should('have.text', '\\left( 7, 8 \\right)');
    cy.get(cesc('#/p37')).should('have.text', '7');
    cy.get(cesc('#/p38')).should('have.text', '8');
    cy.get(cesc('#/p39')).should('have.text', '')
    cy.get(cesc('#/p40')).should('have.text', '7');
    cy.get(cesc('#/p41')).should('have.text', '8');
    cy.get(cesc('#/p42')).should('have.text', '')

    cy.get(cesc('#/p43') + ' .mjx-mrow').eq(0).should('have.text', '7');
    cy.get(cesc('#/p44') + ' .mjx-mrow').eq(0).should('have.text', '8');
    cy.get(cesc('#/p45') + ' .mjx-mrow').eq(0).should('have.text', '9');
    cy.get(cesc('#/p46') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#/p47')).should('have.text', '')
    cy.get(cesc('#/p48')).should('have.text', '')
    cy.get(cesc('#/p49')).should('have.text', '')
    cy.get(cesc('#/p50')).should('have.text', '')

  });

  it('dot and array notation, chaining, copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph size="small">
      <line name="l" through="(2/3,3) (5,6)" displayDigits="2" />
    </graph>
    
    <p name="p1"><copy source="l.points.coords" /></p>
    <p name="p2"><copy source="l.points.x" /></p>
    <p name="p3"><copy source="l.points.y" /></p>
    <p name="p4"><copy source="l.points.bad" /></p>
    <p name="p5"><copy source="l.points.xs[1]" /></p>
    <p name="p6"><copy source="l.points.xs[2]" /></p>
    <p name="p7"><copy source="l.points.xs[3]" /></p>

    <p name="p8"><copy source="l.points[1].coords" /></p>
    <p name="p9"><copy source="l.points[1].x" /></p>
    <p name="p10"><copy source="l.points[1].y" /></p>
    <p name="p11"><copy source="l.points[1].bad" /></p>
    <p name="p12"><copy source="l.points[1].xs[1]" /></p>
    <p name="p13"><copy source="l.points[1].xs[2]" /></p>
    <p name="p14"><copy source="l.points[1].xs[3]" /></p>

    <p name="p15"><copy source="l.points[2].coords" /></p>
    <p name="p16"><copy source="l.points[2].x" /></p>
    <p name="p17"><copy source="l.points[2].y" /></p>
    <p name="p18"><copy source="l.points[2].bad" /></p>
    <p name="p19"><copy source="l.points[2].xs[1]" /></p>
    <p name="p20"><copy source="l.points[2].xs[2]" /></p>
    <p name="p21"><copy source="l.points[2].xs[3]" /></p>

    <p name="p22"><copy source="l.points[3].coords" /></p>
    <p name="p23"><copy source="l.points[3].x" /></p>
    <p name="p24"><copy source="l.points[3].y" /></p>
    <p name="p25"><copy source="l.points[3].bad" /></p>
    <p name="p26"><copy source="l.points[3].xs[1]" /></p>
    <p name="p27"><copy source="l.points[3].xs[2]" /></p>
    <p name="p28"><copy source="l.points[3].xs[3]" /></p>

    <p name="p29"><copy source="l.points.coords.latex" /></p>
    <p name="p30"><copy source="l.points.x.latex" /></p>
    <p name="p31"><copy source="l.points.y.latex" /></p>
    <p name="p32"><copy source="l.points.bad.latex" /></p>
    <p name="p33"><copy source="l.points.xs[1].latex" /></p>
    <p name="p34"><copy source="l.points.xs[2].latex" /></p>
    <p name="p35"><copy source="l.points.xs[3].latex" /></p>
    
    <p name="p36"><copy source="l.points[1].coords.latex" /></p>
    <p name="p37"><copy source="l.points[1].x.latex" /></p>
    <p name="p38"><copy source="l.points[1].y.latex" /></p>
    <p name="p39"><copy source="l.points[1].bad.latex" /></p>
    <p name="p40"><copy source="l.points[1].xs[1].latex" /></p>
    <p name="p41"><copy source="l.points[1].xs[2].latex" /></p>
    <p name="p42"><copy source="l.points[1].xs[3].latex" /></p>
    
    <p name="p43"><copy source="l.points[1][1]" /></p>
    <p name="p44"><copy source="l.points[1][2]" /></p>
    <p name="p45"><copy source="l.points[2][1]" /></p>
    <p name="p46"><copy source="l.points[2][2]" /></p>
    <p name="p47"><copy source="l.points[0][1]" /></p>
    <p name="p48"><copy source="l.points[1][0]" /></p>
    <p name="p49"><copy source="l.points[1][3]" /></p>
    <p name="p50"><copy source="l.points[3][1]" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '(23,3)');
    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(3).should('have.text', '(5,6)');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '23');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(1).should('have.text', '5');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(1).should('have.text', '6');
    cy.get(cesc('#/p4')).should('have.text', '')
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(0).should('have.text', '23');
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(1).should('have.text', '5');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(1).should('have.text', '6');
    cy.get(cesc('#/p7')).should('have.text', '')

    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(0).should('have.text', '(23,3)');
    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(0).should('have.text', '23');
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p11')).should('have.text', '')
    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(0).should('have.text', '23');
    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p14')).should('have.text', '')

    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(0).should('have.text', '(5,6)');
    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(0).should('have.text', '5');
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(0).should('have.text', '6');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p18')).should('have.text', '')
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(0).should('have.text', '5');
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(0).should('have.text', '6');
    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p21')).should('have.text', '')

    cy.get(cesc('#/p22')).should('have.text', '')
    cy.get(cesc('#/p23')).should('have.text', '')
    cy.get(cesc('#/p24')).should('have.text', '')
    cy.get(cesc('#/p25')).should('have.text', '')
    cy.get(cesc('#/p26')).should('have.text', '')
    cy.get(cesc('#/p27')).should('have.text', '')
    cy.get(cesc('#/p28')).should('have.text', '')

    cy.get(cesc('#/p29')).should('have.text', '\\left( \\frac{2}{3}, 3 \\right)\\left( 5, 6 \\right)');
    cy.get(cesc('#/p30')).should('have.text', '\\frac{2}{3}5');
    cy.get(cesc('#/p31')).should('have.text', '36');
    cy.get(cesc('#/p32')).should('have.text', '')
    cy.get(cesc('#/p33')).should('have.text', '\\frac{2}{3}5');
    cy.get(cesc('#/p34')).should('have.text', '36');
    cy.get(cesc('#/p35')).should('have.text', '')

    cy.get(cesc('#/p36')).should('have.text', '\\left( \\frac{2}{3}, 3 \\right)');
    cy.get(cesc('#/p37')).should('have.text', '\\frac{2}{3}');
    cy.get(cesc('#/p38')).should('have.text', '3');
    cy.get(cesc('#/p39')).should('have.text', '')
    cy.get(cesc('#/p40')).should('have.text', '\\frac{2}{3}');
    cy.get(cesc('#/p41')).should('have.text', '3');
    cy.get(cesc('#/p42')).should('have.text', '')

    cy.get(cesc('#/p43') + ' .mjx-mrow').eq(0).should('have.text', '23');
    cy.get(cesc('#/p44') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#/p45') + ' .mjx-mrow').eq(0).should('have.text', '5');
    cy.get(cesc('#/p46') + ' .mjx-mrow').eq(0).should('have.text', '6');
    cy.get(cesc('#/p47')).should('have.text', '')
    cy.get(cesc('#/p48')).should('have.text', '')
    cy.get(cesc('#/p49')).should('have.text', '')
    cy.get(cesc('#/p50')).should('have.text', '')

    cy.log('move points');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [7, 8],
          point2coords: [9, 0]
        }
      })
    })

    cy.get(cesc('#/p29')).should('have.text', '\\left( 7, 8 \\right)\\left( 9, 0 \\right)');

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '(7,8)');
    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(3).should('have.text', '(9,0)');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '7');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(1).should('have.text', '9');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(0).should('have.text', '8');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(1).should('have.text', '0');
    cy.get(cesc('#/p4')).should('have.text', '')
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(0).should('have.text', '7');
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(1).should('have.text', '9');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(0).should('have.text', '8');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(1).should('have.text', '0');
    cy.get(cesc('#/p7')).should('have.text', '')

    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(0).should('have.text', '(7,8)');
    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(0).should('have.text', '7');
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(0).should('have.text', '8');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p11')).should('have.text', '')
    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(0).should('have.text', '7');
    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(0).should('have.text', '8');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p14')).should('have.text', '')

    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(0).should('have.text', '(9,0)');
    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(0).should('have.text', '9');
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p18')).should('have.text', '')
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(0).should('have.text', '9');
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p21')).should('have.text', '')

    cy.get(cesc('#/p22')).should('have.text', '')
    cy.get(cesc('#/p23')).should('have.text', '')
    cy.get(cesc('#/p24')).should('have.text', '')
    cy.get(cesc('#/p25')).should('have.text', '')
    cy.get(cesc('#/p26')).should('have.text', '')
    cy.get(cesc('#/p27')).should('have.text', '')
    cy.get(cesc('#/p28')).should('have.text', '')

    cy.get(cesc('#/p29')).should('have.text', '\\left( 7, 8 \\right)\\left( 9, 0 \\right)');
    cy.get(cesc('#/p30')).should('have.text', '79');
    cy.get(cesc('#/p31')).should('have.text', '80');
    cy.get(cesc('#/p32')).should('have.text', '')
    cy.get(cesc('#/p33')).should('have.text', '79');
    cy.get(cesc('#/p34')).should('have.text', '80');
    cy.get(cesc('#/p35')).should('have.text', '')

    cy.get(cesc('#/p36')).should('have.text', '\\left( 7, 8 \\right)');
    cy.get(cesc('#/p37')).should('have.text', '7');
    cy.get(cesc('#/p38')).should('have.text', '8');
    cy.get(cesc('#/p39')).should('have.text', '')
    cy.get(cesc('#/p40')).should('have.text', '7');
    cy.get(cesc('#/p41')).should('have.text', '8');
    cy.get(cesc('#/p42')).should('have.text', '')

    cy.get(cesc('#/p43') + ' .mjx-mrow').eq(0).should('have.text', '7');
    cy.get(cesc('#/p44') + ' .mjx-mrow').eq(0).should('have.text', '8');
    cy.get(cesc('#/p45') + ' .mjx-mrow').eq(0).should('have.text', '9');
    cy.get(cesc('#/p46') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#/p47')).should('have.text', '')
    cy.get(cesc('#/p48')).should('have.text', '')
    cy.get(cesc('#/p49')).should('have.text', '')
    cy.get(cesc('#/p50')).should('have.text', '')


  });

  it('dot and array notation, chaining, specify attributes, macros', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph size="small">
      <line name="l" through="(3.92639372,9.8293629453) (0.9060742037,32.93520806203104)" displayDigits="2" />
    </graph>
    
    <p name="p1">$l.points.coords</p>
    <p name="p2">$l.points.x</p>
    <p name="p3">$l.points.y</p>
    <p name="p4">$l.points.bad</p>
    <p name="p5">$l.points.xs[1]</p>
    <p name="p6">$l.points.xs[2]</p>
    <p name="p7">$l.points.xs[3]</p>

    <p name="p8">$(l.points.coords{displayDecimals="4"})</p>
    <p name="p9">$(l.points.x{displayDecimals="4"})</p>
    <p name="p10">$(l.points.y{displayDecimals="4"})</p>
    <p name="p11">$(l.points.bad{displayDecimals="4"})</p>
    <p name="p12">$(l.points.xs[1]{displayDecimals="4"})</p>
    <p name="p13">$(l.points.xs[2]{displayDecimals="4"})</p>
    <p name="p14">$(l.points.xs[3]{displayDecimals="4"})</p>

    <p name="p15">$(l.points[1].coords{displayDecimals="4"})</p>
    <p name="p16">$(l.points[1].x{displayDecimals="4"})</p>
    <p name="p17">$(l.points[1].y{displayDecimals="4"})</p>
    <p name="p18">$(l.points[1].bad{displayDecimals="4"})</p>
    <p name="p19">$(l.points[1].xs[1]{displayDecimals="4"})</p>
    <p name="p20">$(l.points[1].xs[2]{displayDecimals="4"})</p>
    <p name="p21">$(l.points[1].xs[3]{displayDecimals="4"})</p>

    <p name="p22">$l.points.coords{displayDecimals="4"}</p>
    <p name="p23">$l.points{displayDecimals="4"}.x</p>
    <p name="p24">$l{displayDecimals="4"}.points.y</p>
    <p name="p25">$l.points.bad{displayDecimals="4"}</p>
    <p name="p26">$l.points.xs[1]{displayDecimals="4"}</p>
    <p name="p27">$l.points{displayDecimals="4"}.xs[2]</p>
    <p name="p28">$l{displayDecimals="4"}.points.xs[3]</p>

    <p name="p29">$l.points[1].coords{displayDecimals="4"}</p>
    <p name="p30">$l.points[1]{displayDecimals="4"}.x</p>
    <p name="p31">$l{displayDecimals="4"}.points[1].y</p>
    <p name="p32">$l.points[1].bad{displayDecimals="4"}</p>
    <p name="p33">$l.points[1].xs[1]{displayDecimals="4"}</p>
    <p name="p34">$l.points[1]{displayDecimals="4"}.xs[2]</p>
    <p name="p35">$l{displayDecimals="4"}.points[1].xs[3]</p>

    <p name="p36">$l{displayDecimals="4"}.latex</p>
    <p name="p37">$(l{displayDigits="3"}.points{displayDecimals="4"})</p>
    <p name="p38">$(l{displayDigits="3"}.points[1]{displayDecimals="4"})</p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '(3.9,9.8)');
    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(3).should('have.text', '(0.91,33)');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '3.9');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(1).should('have.text', '0.91');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(0).should('have.text', '9.8');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(1).should('have.text', '33');
    cy.get(cesc('#/p4')).should('have.text', '')
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(0).should('have.text', '3.9');
    cy.get(cesc('#/p5') + ' .mjx-mrow').eq(1).should('have.text', '0.91');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(0).should('have.text', '9.8');
    cy.get(cesc('#/p6') + ' .mjx-mrow').eq(1).should('have.text', '33');
    cy.get(cesc('#/p7')).should('have.text', '')

    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(0).should('have.text', '(3.9264,9.8294)');
    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(3).should('have.text', '(0.9061,32.9352)');
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(0).should('have.text', '3.9264');
    cy.get(cesc('#/p9') + ' .mjx-mrow').eq(1).should('have.text', '0.9061');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(0).should('have.text', '9.8294');
    cy.get(cesc('#/p10') + ' .mjx-mrow').eq(1).should('have.text', '32.9352');
    cy.get(cesc('#/p11')).should('have.text', '')
    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(0).should('have.text', '3.9264');
    cy.get(cesc('#/p12') + ' .mjx-mrow').eq(1).should('have.text', '0.9061');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(0).should('have.text', '9.8294');
    cy.get(cesc('#/p13') + ' .mjx-mrow').eq(1).should('have.text', '32.9352');
    cy.get(cesc('#/p14')).should('have.text', '')

    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(0).should('have.text', '(3.9264,9.8294)');
    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(0).should('have.text', '3.9264');
    cy.get(cesc('#/p16') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(0).should('have.text', '9.8294');
    cy.get(cesc('#/p17') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p18')).should('have.text', '')
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(0).should('have.text', '3.9264');
    cy.get(cesc('#/p19') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(0).should('have.text', '9.8294');
    cy.get(cesc('#/p20') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p21')).should('have.text', '')

    cy.get(cesc('#/p22') + ' .mjx-mrow').eq(0).should('have.text', '(3.9264,9.8294)');
    cy.get(cesc('#/p22') + ' .mjx-mrow').eq(3).should('have.text', '(0.9061,32.9352)');
    cy.get(cesc('#/p23') + ' .mjx-mrow').eq(0).should('have.text', '3.9264');
    cy.get(cesc('#/p23') + ' .mjx-mrow').eq(1).should('have.text', '0.9061');
    cy.get(cesc('#/p24') + ' .mjx-mrow').eq(0).should('have.text', '9.8294');
    cy.get(cesc('#/p24') + ' .mjx-mrow').eq(1).should('have.text', '32.9352');
    cy.get(cesc('#/p25')).should('have.text', '')
    cy.get(cesc('#/p26') + ' .mjx-mrow').eq(0).should('have.text', '3.9264');
    cy.get(cesc('#/p26') + ' .mjx-mrow').eq(1).should('have.text', '0.9061');
    cy.get(cesc('#/p27') + ' .mjx-mrow').eq(0).should('have.text', '9.8294');
    cy.get(cesc('#/p27') + ' .mjx-mrow').eq(1).should('have.text', '32.9352');
    cy.get(cesc('#/p28')).should('have.text', '')

    cy.get(cesc('#/p29') + ' .mjx-mrow').eq(0).should('have.text', '(3.9264,9.8294)');
    cy.get(cesc('#/p29') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p30') + ' .mjx-mrow').eq(0).should('have.text', '3.9264');
    cy.get(cesc('#/p30') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p31') + ' .mjx-mrow').eq(0).should('have.text', '9.8294');
    cy.get(cesc('#/p31') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p32')).should('have.text', '')
    cy.get(cesc('#/p33') + ' .mjx-mrow').eq(0).should('have.text', '3.9264');
    cy.get(cesc('#/p33') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p34') + ' .mjx-mrow').eq(0).should('have.text', '9.8294');
    cy.get(cesc('#/p34') + ' .mjx-mrow').eq(1).should('not.exist');
    cy.get(cesc('#/p35')).should('have.text', '')

    cy.get(cesc('#/p36')).should('have.text', '0 = -23.1058 x - 3.0203 y + 120.4105');
    cy.get(cesc('#/p37') + ' .mjx-mrow').eq(0).should('have.text', '(3.9264,9.8294)');
    cy.get(cesc('#/p37') + ' .mjx-mrow').eq(3).should('have.text', '(0.9061,32.9352)');
    cy.get(cesc('#/p38') + ' .mjx-mrow').eq(0).should('have.text', '(3.9264,9.8294)');
    cy.get(cesc('#/p38') + ' .mjx-mrow').eq(3).should('not.exist');

  });

  it('dot and array notation, chaining, nested', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph size="small">
      <line name="l" through="(1.92639372,9.8293629453) (5.9060742037,2.93520806203104)" />
      $l.points
    </graph>
    
    <p name="p1"><aslist>
      $l[1].points[$l.points[1].x]{displayDigits="$l.points[2].x"}.y
    </aslist></p>
    <p name="p2"><aslist>
      <copy source='l[1].points[$l.points[1].x]{displayDigits="$l.points[2].x"}.y' />
    </aslist></p>
    
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '2.93521');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '2.93521');

    cy.window().then(async (win) => {

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [1.38527302734, 8.48273402357],
          point2coords: [5.9060742037, 2.93520806203104],
        }
      })

    })

    cy.get(cesc('#/p1') + ' .mjx-mrow').should('contain.text', '8.48273');
    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '8.48273');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '8.48273');

    cy.window().then(async (win) => {

      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [1.38527302734, 8.48273402357],
          point2coords: [4.482081034234, 7.34828203481],
        }
      })

    })

    cy.get(cesc('#/p1') + ' .mjx-mrow').should('contain.text', '8.483');
    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '8.483');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '8.483');



  });

  it('dot and array notation, chaining, copy source, change type', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph size="small">
      <line name="l" through="(2/3,3/4) (5/8,6/10)" displayDigits="2" />
    </graph>
    
    <p name="p1"><aslist><copy source="l.points.coords" creatComponentOfType="math" nComponents="2" /></aslist></p>
    <p name="p2"><aslist><copy source="l.points.x" createComponentOfType="number" nComponents="2" /></aslist></p>
    <p name="p3"><aslist><copy source="l.points.y" createComponentOfType="number" nComponents="2" /></aslist></p>
    <p name="p4"><aslist><copy source="l.points.bad" createComponentOfType="number" nComponents="2" /></aslist></p>
    <p name="p5"><aslist><copy source="l.points.xs[1]" createComponentOfType="number" nComponents="2" /></aslist></p>
    <p name="p6"><aslist><copy source="l.points.xs[2]" createComponentOfType="number" nComponents="2" /></aslist></p>
    <p name="p7"><aslist><copy source="l.points.xs[3]" createComponentOfType="number" nComponents="2" /></aslist></p>

    <p name="p8"><math copySource="l.points[1].coords" /></p>
    <p name="p9"><number copySource="l.points[1].x" /></p>
    <p name="p10"><number copysource="l.points[1].y" /></p>
    <p name="p11"><number copysource="l.points[1].bad" /></p>
    <p name="p12"><number copysource="l.points[1].xs[1]" /></p>
    <p name="p13"><number copysource="l.points[1].xs[2]" /></p>
    <p name="p14"><number copysource="l.points[1].xs[3]" /></p>

    <p name="p15"><math copysource="l.points[2].coords" /></p>
    <p name="p16"><number copysource="l.points[2].x" /></p>
    <p name="p17"><number copysource="l.points[2].y" /></p>
    <p name="p18"><number copysource="l.points[2].bad" /></p>
    <p name="p19"><number copysource="l.points[2].xs[1]" /></p>
    <p name="p20"><number copysource="l.points[2].xs[2]" /></p>
    <p name="p21"><number copysource="l.points[2].xs[3]" /></p>

    <p name="p22"><math copysource="l.points[3].coords" /></p>
    <p name="p23"><number copysource="l.points[3].x" /></p>
    <p name="p24"><number copysource="l.points[3].y" /></p>
    <p name="p25"><number copysource="l.points[3].bad" /></p>
    <p name="p26"><number copysource="l.points[3].xs[1]" /></p>
    <p name="p27"><number copysource="l.points[3].xs[2]" /></p>
    <p name="p28"><number copysource="l.points[3].xs[3]" /></p>

    <p name="p29"><aslist><copy source="l.points.coords.latex" createComponentOfType="text" nComponents="2" /></aslist></p>
    <p name="p30"><aslist><copy source="l.points.x.latex" createComponentOfType="text" nComponents="2" /></aslist></p>
    <p name="p31"><aslist><copy source="l.points.y.latex" createComponentOfType="text" nComponents="2" /></aslist></p>
    <p name="p32"><aslist><copy source="l.points.bad.latex" createComponentOfType="text" nComponents="2" /></aslist></p>
    <p name="p33"><aslist><copy source="l.points.xs[1].latex" createComponentOfType="text" nComponents="2" /></aslist></p>
    <p name="p34"><aslist><copy source="l.points.xs[2].latex" createComponentOfType="text" nComponents="2" /></aslist></p>
    <p name="p35"><aslist><copy source="l.points.xs[3].latex" createComponentOfType="text" nComponents="2" /></aslist></p>
    
    <p name="p36"><text copysource="l.points[1].coords.latex" /></p>
    <p name="p37"><text copysource="l.points[1].x.latex" /></p>
    <p name="p38"><text copysource="l.points[1].y.latex" /></p>
    <p name="p39"><text copysource="l.points[1].bad.latex" /></p>
    <p name="p40"><text copysource="l.points[1].xs[1].latex" /></p>
    <p name="p41"><text copysource="l.points[1].xs[2].latex" /></p>
    <p name="p42"><text copysource="l.points[1].xs[3].latex" /></p>
    
    <p name="p43"><number copysource="l.points[1][1]" /></p>
    <p name="p44"><number copysource="l.points[1][2]" /></p>
    <p name="p45"><number copysource="l.points[2][1]" /></p>
    <p name="p46"><number copysource="l.points[2][2]" /></p>
    <p name="p47"><number copysource="l.points[0][1]" /></p>
    <p name="p48"><number copysource="l.points[1][0]" /></p>
    <p name="p49"><number copysource="l.points[1][3]" /></p>
    <p name="p50"><number copysource="l.points[3][1]" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '(23,34)');
    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(3).should('have.text', '(58,35)');
    cy.get(cesc('#/p2')).should('have.text', '0.67, 0.63');
    cy.get(cesc('#/p3')).should('have.text', '0.75, 0.6');
    cy.get(cesc('#/p4')).should('have.text', 'NaN, NaN')
    cy.get(cesc('#/p5')).should('have.text', '0.67, 0.63');
    cy.get(cesc('#/p6')).should('have.text', '0.75, 0.6');
    cy.get(cesc('#/p7')).should('have.text', 'NaN, NaN')

    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(0).should('have.text', '(23,34)');
    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p9')).should('have.text', '0.67');
    cy.get(cesc('#/p10')).should('have.text', '0.75');
    cy.get(cesc('#/p11')).should('have.text', 'NaN')
    cy.get(cesc('#/p12')).should('have.text', '0.67');
    cy.get(cesc('#/p13')).should('have.text', '0.75');
    cy.get(cesc('#/p14')).should('have.text', 'NaN')

    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(0).should('have.text', '(58,35)');
    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p16')).should('have.text', '0.63');
    cy.get(cesc('#/p17')).should('have.text', '0.6');
    cy.get(cesc('#/p18')).should('have.text', 'NaN')
    cy.get(cesc('#/p19')).should('have.text', '0.63');
    cy.get(cesc('#/p20')).should('have.text', '0.6');
    cy.get(cesc('#/p21')).should('have.text', 'NaN')

    cy.get(cesc('#/p22') + ' .mjx-mrow').eq(0).should('have.text', '\uff3f')
    cy.get(cesc('#/p23')).should('have.text', 'NaN')
    cy.get(cesc('#/p24')).should('have.text', 'NaN')
    cy.get(cesc('#/p25')).should('have.text', 'NaN')
    cy.get(cesc('#/p26')).should('have.text', 'NaN')
    cy.get(cesc('#/p27')).should('have.text', 'NaN')
    cy.get(cesc('#/p28')).should('have.text', 'NaN')

    cy.get(cesc('#/p29')).should('have.text', '\\left( \\frac{2}{3}, \\frac{3}{4} \\right), \\left( \\frac{5}{8}, \\frac{3}{5} \\right)');
    cy.get(cesc('#/p30')).should('have.text', '\\frac{2}{3}, \\frac{5}{8}');
    cy.get(cesc('#/p31')).should('have.text', '\\frac{3}{4}, \\frac{3}{5}');
    cy.get(cesc('#/p32')).should('have.text', ', ')
    cy.get(cesc('#/p33')).should('have.text', '\\frac{2}{3}, \\frac{5}{8}');
    cy.get(cesc('#/p34')).should('have.text', '\\frac{3}{4}, \\frac{3}{5}');
    cy.get(cesc('#/p35')).should('have.text', ', ')

    cy.get(cesc('#/p36')).should('have.text', '\\left( \\frac{2}{3}, \\frac{3}{4} \\right)');
    cy.get(cesc('#/p37')).should('have.text', '\\frac{2}{3}');
    cy.get(cesc('#/p38')).should('have.text', '\\frac{3}{4}');
    cy.get(cesc('#/p39')).should('have.text', '')
    cy.get(cesc('#/p40')).should('have.text', '\\frac{2}{3}');
    cy.get(cesc('#/p41')).should('have.text', '\\frac{3}{4}');
    cy.get(cesc('#/p42')).should('have.text', '')

    cy.get(cesc('#/p43')).should('have.text', '0.67');
    cy.get(cesc('#/p44')).should('have.text', '0.75');
    cy.get(cesc('#/p45')).should('have.text', '0.63');
    cy.get(cesc('#/p46')).should('have.text', '0.6');
    cy.get(cesc('#/p47')).should('have.text', 'NaN');
    cy.get(cesc('#/p48')).should('have.text', 'NaN');
    cy.get(cesc('#/p49')).should('have.text', 'NaN');
    cy.get(cesc('#/p50')).should('have.text', 'NaN');

    cy.log('move points');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/l",
        args: {
          point1coords: [7, 8],
          point2coords: [9, 0]
        }
      })
    })

    cy.get(cesc('#/p29')).should('have.text', '\\left( 7, 8 \\right), \\left( 9, 0 \\right)');

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '(7,8)');
    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(3).should('have.text', '(9,0)');
    cy.get(cesc('#/p2')).should('have.text', '7, 9');
    cy.get(cesc('#/p3')).should('have.text', '8, 0');
    cy.get(cesc('#/p4')).should('have.text', 'NaN, NaN')
    cy.get(cesc('#/p5')).should('have.text', '7, 9');
    cy.get(cesc('#/p6')).should('have.text', '8, 0');
    cy.get(cesc('#/p7')).should('have.text', 'NaN, NaN')

    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(0).should('have.text', '(7,8)');
    cy.get(cesc('#/p8') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p9')).should('have.text', '7');
    cy.get(cesc('#/p10')).should('have.text', '8');
    cy.get(cesc('#/p11')).should('have.text', 'NaN')
    cy.get(cesc('#/p12')).should('have.text', '7');
    cy.get(cesc('#/p13')).should('have.text', '8');
    cy.get(cesc('#/p14')).should('have.text', 'NaN')

    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(0).should('have.text', '(9,0)');
    cy.get(cesc('#/p15') + ' .mjx-mrow').eq(3).should('not.exist');
    cy.get(cesc('#/p16')).should('have.text', '9');
    cy.get(cesc('#/p17')).should('have.text', '0');
    cy.get(cesc('#/p18')).should('have.text', 'NaN')
    cy.get(cesc('#/p19')).should('have.text', '9');
    cy.get(cesc('#/p20')).should('have.text', '0');
    cy.get(cesc('#/p21')).should('have.text', 'NaN')

    cy.get(cesc('#/p22') + ' .mjx-mrow').eq(0).should('have.text', '\uff3f')
    cy.get(cesc('#/p23')).should('have.text', 'NaN')
    cy.get(cesc('#/p24')).should('have.text', 'NaN')
    cy.get(cesc('#/p25')).should('have.text', 'NaN')
    cy.get(cesc('#/p26')).should('have.text', 'NaN')
    cy.get(cesc('#/p27')).should('have.text', 'NaN')
    cy.get(cesc('#/p28')).should('have.text', 'NaN')

    cy.get(cesc('#/p29')).should('have.text', '\\left( 7, 8 \\right), \\left( 9, 0 \\right)');
    cy.get(cesc('#/p30')).should('have.text', '7, 9');
    cy.get(cesc('#/p31')).should('have.text', '8, 0');
    cy.get(cesc('#/p32')).should('have.text', ', ')
    cy.get(cesc('#/p33')).should('have.text', '7, 9');
    cy.get(cesc('#/p34')).should('have.text', '8, 0');
    cy.get(cesc('#/p35')).should('have.text', ', ')

    cy.get(cesc('#/p36')).should('have.text', '\\left( 7, 8 \\right)');
    cy.get(cesc('#/p37')).should('have.text', '7');
    cy.get(cesc('#/p38')).should('have.text', '8');
    cy.get(cesc('#/p39')).should('have.text', '')
    cy.get(cesc('#/p40')).should('have.text', '7');
    cy.get(cesc('#/p41')).should('have.text', '8');
    cy.get(cesc('#/p42')).should('have.text', '')

    cy.get(cesc('#/p43')).should('have.text', '7');
    cy.get(cesc('#/p44')).should('have.text', '8');
    cy.get(cesc('#/p45')).should('have.text', '9');
    cy.get(cesc('#/p46')).should('have.text', '0');
    cy.get(cesc('#/p47')).should('have.text', 'NaN');
    cy.get(cesc('#/p48')).should('have.text', 'NaN');
    cy.get(cesc('#/p49')).should('have.text', 'NaN');
    cy.get(cesc('#/p50')).should('have.text', 'NaN');


  });

  it('dot and array notation, multidimensional, dynamic', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph size="small">
      <line through="(1,2) (3,4)" />
      <line through="(5,7) (9,6)" />
    </graph>

    <graph size="small">
      <collect name="col" componentTypes="line" source="_graph1" />
    </graph>

    <p>Line number: <mathinput name="ln" prefill="1" /></p>
    <p>Point number: <mathinput name="pn" prefill="1" /></p>
    <p>Coordinate number: <mathinput name="cn" prefill="1" /></p>

    
    <p name="p1">$col[$ln].points[$pn][$cn]</p>
    <p name="p2"><copy source="col[$ln].points[$pn][$cn]" /></p>
    <p name="p3">$col[$ln].points[$pn].xs[$cn]</p>
    <p name="p4"><copy source="col[$ln].points[$pn].xs[$cn]" /></p>
    
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '1');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '1');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(0).should('have.text', '1');
    cy.get(cesc('#/p4') + ' .mjx-mrow').eq(0).should('have.text', '1');

    cy.get(cesc('#/ln') + " textarea").type("{end}{backspace}{enter}", { force: true })

    cy.get(cesc('#/p1')).should('have.text', '');
    cy.get(cesc('#/p2')).should('have.text', '');
    cy.get(cesc('#/p3')).should('have.text', '');
    cy.get(cesc('#/p4')).should('have.text', '');

    cy.get(cesc('#/ln') + " textarea").type("2{enter}", { force: true })

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '5');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '5');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(0).should('have.text', '5');
    cy.get(cesc('#/p4') + ' .mjx-mrow').eq(0).should('have.text', '5');

    cy.get(cesc('#/pn') + " textarea").type("{end}{backspace}{enter}", { force: true })

    cy.get(cesc('#/p1')).should('have.text', '');
    cy.get(cesc('#/p2')).should('have.text', '');
    cy.get(cesc('#/p3')).should('have.text', '');
    cy.get(cesc('#/p4')).should('have.text', '');

    cy.get(cesc('#/pn') + " textarea").type("2{enter}", { force: true })

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '9');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '9');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(0).should('have.text', '9');
    cy.get(cesc('#/p4') + ' .mjx-mrow').eq(0).should('have.text', '9');

    cy.get(cesc('#/cn') + " textarea").type("{end}{backspace}{enter}", { force: true })

    cy.get(cesc('#/p1')).should('have.text', '');
    cy.get(cesc('#/p2')).should('have.text', '');
    cy.get(cesc('#/p3')).should('have.text', '');
    cy.get(cesc('#/p4')).should('have.text', '');

    cy.get(cesc('#/cn') + " textarea").type("2{enter}", { force: true })

    cy.get(cesc('#/p1') + ' .mjx-mrow').eq(0).should('have.text', '6');
    cy.get(cesc('#/p2') + ' .mjx-mrow').eq(0).should('have.text', '6');
    cy.get(cesc('#/p3') + ' .mjx-mrow').eq(0).should('have.text', '6');
    cy.get(cesc('#/p4') + ' .mjx-mrow').eq(0).should('have.text', '6');

  });

  it('dot and array notation, recurse to subnames of composite replacements', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>n: <mathinput name="n" prefill="2" /></p>

    <map name="myMap">
      <template newnamespace>
        <p>The line through 
          <m>P=<point name="P">($v+1,$v+2)</point></m> and <m>Q=<point name="Q">($v+4, $v-1)</point></m>
          is <line name="l" through="$P $Q" />.</p>
      </template>
      <sources alias="v"><sequence from="1" to="$n" /></sources>
    </map>

    <p>Template number: <mathinput name="tn" prefill="1" /></p>
    <p>Point number: <mathinput name="pn" prefill="1" /></p>
    <p>Coordinate number: <mathinput name="cn" prefill="1" /></p>

    <p name="pt">The points from template $tn are: $(myMap[$tn]/P) and <copy source="myMap[$tn]/Q"/>.</p>
    <p name="pp">Point $pn from the line in that template is: $(myMap[$tn]/l.points[$pn]).</p>
    <p name="pc">Coordinate $cn from that point is $(myMap[$tn]/l.points[$pn].xs[$cn]).</p>
    <p name="pc2">Again, coordinate $cn from that point is <copy source="myMap[$tn]/l.points[$pn].xs[$cn]" />.</p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let Pxs = [2, 3, 4, 5, 6];
    let Pys = [3, 4, 5, 6, 7];
    let Qxs = [5, 6, 7, 8, 9];
    let Qys = [0, 1, 2, 3, 4];

    function checkResult(n, tn, pn, cn) {
      if (!(n >= 1 && tn <= n)) {
        // we have nothing
        cy.get("#\\/pt").should("contain.text", "are:  and .")
        cy.get("#\\/pp").should("contain.text", " from the line in that template is: .")
        cy.get("#\\/pc").should('contain.text', "from that point is .")
        cy.get("#\\/pc2").should('contain.text', "from that point is .")

      } else {
        cy.get("#\\/pt .mjx-mrow").should('contain.text', `(${Pxs[tn - 1]},${Pys[tn - 1]})`);
        cy.get("#\\/pt .mjx-mrow").should('contain.text', `(${Qxs[tn - 1]},${Qys[tn - 1]})`);
        cy.get("#\\/pt .mjx-mrow").eq(1).should('have.text', `(${Pxs[tn - 1]},${Pys[tn - 1]})`);
        cy.get("#\\/pt .mjx-mrow").eq(4).should('have.text', `(${Qxs[tn - 1]},${Qys[tn - 1]})`);

        if (pn === 1) {
          cy.get("#\\/pp .mjx-mrow").should('contain.text', `(${Pxs[tn - 1]},${Pys[tn - 1]})`);
          cy.get("#\\/pp .mjx-mrow").eq(1).should('have.text', `(${Pxs[tn - 1]},${Pys[tn - 1]})`);
          if (cn === 1) {
            cy.get("#\\/pc .mjx-mrow").should('contain.text', `${Pxs[tn - 1]}`);
            cy.get("#\\/pc2 .mjx-mrow").should('contain.text', `${Pxs[tn - 1]}`);
            cy.get("#\\/pc .mjx-mrow").eq(1).should('have.text', `${Pxs[tn - 1]}`);
            cy.get("#\\/pc2 .mjx-mrow").eq(1).should('have.text', `${Pxs[tn - 1]}`);
          } else if (cn === 2) {
            cy.get("#\\/pc .mjx-mrow").should('contain.text', `${Pys[tn - 1]}`);
            cy.get("#\\/pc2 .mjx-mrow").should('contain.text', `${Pys[tn - 1]}`);
            cy.get("#\\/pc .mjx-mrow").eq(1).should('have.text', `${Pys[tn - 1]}`);
            cy.get("#\\/pc2 .mjx-mrow").eq(1).should('have.text', `${Pys[tn - 1]}`);
          } else {
            cy.get("#\\/pc").should('contain.text', "from that point is .")
            cy.get("#\\/pc2").should('contain.text', "from that point is .")
          }
        } else if (pn === 2) {
          cy.get("#\\/pp .mjx-mrow").should('contain.text', `(${Qxs[tn - 1]},${Qys[tn - 1]})`);
          cy.get("#\\/pp .mjx-mrow").eq(1).should('have.text', `(${Qxs[tn - 1]},${Qys[tn - 1]})`);
          if (cn === 1) {
            cy.get("#\\/pc .mjx-mrow").should('contain.text', `${Qxs[tn - 1]}`);
            cy.get("#\\/pc2 .mjx-mrow").should('contain.text', `${Qxs[tn - 1]}`);
            cy.get("#\\/pc .mjx-mrow").eq(1).should('have.text', `${Qxs[tn - 1]}`);
            cy.get("#\\/pc2 .mjx-mrow").eq(1).should('have.text', `${Qxs[tn - 1]}`);
          } else if (cn === 2) {
            cy.get("#\\/pc .mjx-mrow").should('contain.text', `${Qys[tn - 1]}`);
            cy.get("#\\/pc2 .mjx-mrow").should('contain.text', `${Qys[tn - 1]}`);
            cy.get("#\\/pc .mjx-mrow").eq(1).should('have.text', `${Qys[tn - 1]}`);
            cy.get("#\\/pc2 .mjx-mrow").eq(1).should('have.text', `${Qys[tn - 1]}`);
          } else {
            cy.get("#\\/pc").should('contain.text', "from that point is .")
            cy.get("#\\/pc2").should('contain.text', "from that point is .")
          }
        } else {
          cy.get("#\\/pp").should("contain.text", " from the line in that template is: .")
          cy.get("#\\/pc").should('contain.text', "from that point is .")
          cy.get("#\\/pc2").should('contain.text', "from that point is .")
        }

      }
    }

    checkResult(2, 1, 1, 1)

    cy.get("#\\/tn textarea").type("{end}{backspace}2{enter}", { force: true })
    checkResult(2, 2, 1, 1)

    cy.get("#\\/tn textarea").type("{end}{backspace}3{enter}", { force: true })
    checkResult(2, 3, 1, 1)

    cy.get("#\\/n textarea").type("{end}{backspace}4{enter}", { force: true })
    checkResult(4, 3, 1, 1)

    cy.get("#\\/pn textarea").type("{end}{backspace}3{enter}", { force: true })
    checkResult(4, 3, 3, 1)

    cy.get("#\\/pn textarea").type("{end}{backspace}2{enter}", { force: true })
    checkResult(4, 3, 2, 1)

    cy.get("#\\/cn textarea").type("{end}{backspace}3{enter}", { force: true })
    checkResult(4, 3, 2, 3)

    cy.get("#\\/cn textarea").type("{end}{backspace}2{enter}", { force: true })
    checkResult(4, 3, 2, 2)

    cy.get("#\\/n textarea").type("{end}{backspace}3{enter}", { force: true })
    checkResult(3, 3, 2, 2)

    cy.get("#\\/n textarea").type("{end}{backspace}1{enter}", { force: true })
    checkResult(1, 3, 2, 2)

    cy.get("#\\/tn textarea").type("{end}{backspace}1{enter}", { force: true })
    checkResult(1, 1, 2, 2)

  });

  it('isPlainMacro and isPlainCopy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="x+x" name="mi" />

    <p name="pmacro1">$mi</p>
    <p name="pmacro2">$mi{simplify}</p>
    <p name="pcopy1"><copy source="mi" /></p>
    <p name="pcopy2"><copy source="mi{simplify}" /></p>
    <p name="pcopy3"><copy source="mi" simplify /></p>
    <p name="pcopy4"><copy source="mi" createComponentOfType="mathinput" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/pmacro1') + " .mjx-mrow").eq(0).should('have.text', 'x+x');
    cy.get(cesc('#/pmacro2') + " .mjx-mrow").eq(0).should('have.text', '2x');

    cy.get(cesc('#/pcopy1') + " .mjx-mrow").eq(0).should('have.text', 'x+x');
    cy.get(cesc('#/pcopy2') + " .mjx-mrow").eq(0).should('have.text', '2x');
    cy.get(cesc('#/pcopy3') + " .mjx-mrow").eq(0).should('have.text', '2x');
    cy.get(cesc('#/pcopy4') + " .mq-editable-field").eq(0).should('have.text', 'x+x');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let macrom1Name = stateVariables["/pmacro1"].activeChildren[0].componentName;
      let macrom2Name = stateVariables["/pmacro2"].activeChildren[0].componentName;
      let copym1Name = stateVariables["/pcopy1"].activeChildren[0].componentName;
      let copym2Name = stateVariables["/pcopy2"].activeChildren[0].componentName;
      let copym3Name = stateVariables["/pcopy3"].activeChildren[0].componentName;
      let copymi4Name = stateVariables["/pcopy4"].activeChildren[0].componentName;

      expect(stateVariables[macrom1Name].componentType).eq('math')
      expect(stateVariables[macrom2Name].componentType).eq('math')
      expect(stateVariables[copym1Name].componentType).eq('math')
      expect(stateVariables[copym2Name].componentType).eq('math')
      expect(stateVariables[copym3Name].componentType).eq('math')
      expect(stateVariables[copymi4Name].componentType).eq('mathInput')
      expect(stateVariables[macrom1Name].stateValues.value).eqls(["+", "x", "x"])
      expect(stateVariables[macrom2Name].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables[copym1Name].stateValues.value).eqls(["+", "x", "x"])
      expect(stateVariables[copym2Name].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables[copym3Name].stateValues.value).eqls(["*", 2, "x"])
      expect(stateVariables[copymi4Name].stateValues.value).eqls(["+", "x", "x"])

    });


  });

  it('copies of composites ignore isPlainMacro and isPlainCopy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="g">
      <mathinput prefill="x" />
      <mathinput prefill="y" />
    </group>

    <p><collect componentTypes="mathinput" source="g" name="col" /></p>

    <p name="pmacro">$col</p>

    <p name="pcopy"><copy source="col" /></p>

    <p name="pmacro2">$g</p>

    <p name="pcopy2"><copy source="g" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/pmacro') + " .mq-editable-field").eq(0).should('have.text', 'x');
    cy.get(cesc('#/pmacro') + " .mq-editable-field").eq(1).should('have.text', 'y');

    cy.get(cesc('#/pcopy') + " .mq-editable-field").eq(0).should('have.text', 'x');
    cy.get(cesc('#/pcopy') + " .mq-editable-field").eq(1).should('have.text', 'y');

    cy.get(cesc('#/pmacro2') + " .mq-editable-field").eq(0).should('have.text', 'x');
    cy.get(cesc('#/pmacro2') + " .mq-editable-field").eq(1).should('have.text', 'y');

    cy.get(cesc('#/pcopy2') + " .mq-editable-field").eq(0).should('have.text', 'x');
    cy.get(cesc('#/pcopy2') + " .mq-editable-field").eq(1).should('have.text', 'y');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let [macromi1Name, macromi2Name] = stateVariables["/pmacro"].activeChildren.map(x => x.componentName);
      let [copymi1Name, copymi2Name] = stateVariables["/pcopy"].activeChildren.map(x => x.componentName);
      let [macromi1Name2, macromi2Name2] = stateVariables["/pmacro2"].activeChildren.filter(x => x.componentName).map(x => x.componentName);
      let [copymi1Name2, copymi2Name2] = stateVariables["/pcopy2"].activeChildren.filter(x => x.componentName).map(x => x.componentName);


      expect(stateVariables[macromi1Name].componentType).eq('mathInput')
      expect(stateVariables[macromi2Name].componentType).eq('mathInput')
      expect(stateVariables[copymi1Name].componentType).eq('mathInput')
      expect(stateVariables[copymi2Name].componentType).eq('mathInput')
      expect(stateVariables[macromi1Name].stateValues.value).eq('x')
      expect(stateVariables[macromi2Name].stateValues.value).eq('y')
      expect(stateVariables[copymi1Name].stateValues.value).eq('x')
      expect(stateVariables[copymi2Name].stateValues.value).eq('y')
      expect(stateVariables[macromi1Name2].componentType).eq('mathInput')
      expect(stateVariables[macromi2Name2].componentType).eq('mathInput')
      expect(stateVariables[copymi1Name2].componentType).eq('mathInput')
      expect(stateVariables[copymi2Name2].componentType).eq('mathInput')
      expect(stateVariables[macromi1Name2].stateValues.value).eq('x')
      expect(stateVariables[macromi2Name2].stateValues.value).eq('y')
      expect(stateVariables[copymi1Name2].stateValues.value).eq('x')
      expect(stateVariables[copymi2Name2].stateValues.value).eq('y')

    });


  });

  it('copies of composites with subnames do not ignore isPlainMacro and isPlainCopy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map name="map" assignNames="t1 t2">
      <template newNamespace><mathinput name="mi" prefill="$v" /></template>
      <sources alias="v"><math>x</math><math>y</math></sources>
    </map>

    <p name="pmacro">$map</p>
    <p name="pcopy"><copy source="map" /></p>

    <p name="pmacroInd">$map[1]$map[2]</p>
    <p name="pcopyInd"><copy source="map[1]" /><copy source="map[2]" /></p>

    <p name="pmacroSubname">$(map[1]/mi)$(map[2]/mi)</p>
    <p name="pcopySubname"><copy source="map[1]/mi" /><copy source="map[2]/mi" /></p>



    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/pmacro') + " .mq-editable-field").eq(0).should('have.text', 'x');
    cy.get(cesc('#/pmacro') + " .mq-editable-field").eq(1).should('have.text', 'y');

    cy.get(cesc('#/pcopy') + " .mq-editable-field").eq(0).should('have.text', 'x');
    cy.get(cesc('#/pcopy') + " .mq-editable-field").eq(1).should('have.text', 'y');

    cy.get(cesc('#/pmacroInd') + " .mq-editable-field").eq(0).should('have.text', 'x');
    cy.get(cesc('#/pmacroInd') + " .mq-editable-field").eq(1).should('have.text', 'y');

    cy.get(cesc('#/pcopyInd') + " .mq-editable-field").eq(0).should('have.text', 'x');
    cy.get(cesc('#/pcopyInd') + " .mq-editable-field").eq(1).should('have.text', 'y');

    cy.get(cesc('#/pmacroSubname') + " .mjx-mrow").eq(0).should('have.text', 'x');
    cy.get(cesc('#/pmacroSubname') + " .mjx-mrow").eq(1).should('have.text', 'y');

    cy.get(cesc('#/pcopySubname') + " .mjx-mrow").eq(0).should('have.text', 'x');
    cy.get(cesc('#/pcopySubname') + " .mjx-mrow").eq(1).should('have.text', 'y');



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let [macromi1Name, macromi2Name] = stateVariables["/pmacro"].activeChildren.map(x => x.componentName);
      let [copymi1Name, copymi2Name] = stateVariables["/pcopy"].activeChildren.map(x => x.componentName);
      let [macroIndmi1Name, macroIndmi2Name] = stateVariables["/pmacroInd"].activeChildren.map(x => x.componentName);
      let [copyIndmi1Name, copyIndmi2Name] = stateVariables["/pmacroInd"].activeChildren.map(x => x.componentName);
      let [macroSubnamem1Name, macroSubnamem2Name] = stateVariables["/pmacroSubname"].activeChildren.map(x => x.componentName);
      let [copySubnamem1Name, copySubnamem2Name] = stateVariables["/pcopySubname"].activeChildren.map(x => x.componentName);

      expect(stateVariables[macromi1Name].componentType).eq('mathInput')
      expect(stateVariables[macromi2Name].componentType).eq('mathInput')
      expect(stateVariables[copymi1Name].componentType).eq('mathInput')
      expect(stateVariables[copymi2Name].componentType).eq('mathInput')
      expect(stateVariables[macroIndmi1Name].componentType).eq('mathInput')
      expect(stateVariables[macroIndmi2Name].componentType).eq('mathInput')
      expect(stateVariables[copyIndmi1Name].componentType).eq('mathInput')
      expect(stateVariables[copyIndmi2Name].componentType).eq('mathInput')
      expect(stateVariables[macroSubnamem1Name].componentType).eq('math')
      expect(stateVariables[macroSubnamem2Name].componentType).eq('math')
      expect(stateVariables[copySubnamem1Name].componentType).eq('math')
      expect(stateVariables[copySubnamem2Name].componentType).eq('math')
      expect(stateVariables[macromi1Name].stateValues.value).eq('x')
      expect(stateVariables[macromi2Name].stateValues.value).eq('y')
      expect(stateVariables[copymi1Name].stateValues.value).eq('x')
      expect(stateVariables[copymi2Name].stateValues.value).eq('y')
      expect(stateVariables[macroIndmi1Name].stateValues.value).eq('x')
      expect(stateVariables[macroIndmi2Name].stateValues.value).eq('y')
      expect(stateVariables[copyIndmi1Name].stateValues.value).eq('x')
      expect(stateVariables[copyIndmi2Name].stateValues.value).eq('y')
      expect(stateVariables[macroSubnamem1Name].stateValues.value).eq('x')
      expect(stateVariables[macroSubnamem2Name].stateValues.value).eq('y')
      expect(stateVariables[copySubnamem1Name].stateValues.value).eq('x')
      expect(stateVariables[copySubnamem2Name].stateValues.value).eq('y')

    });


  });

  it('isPlainCopy does not mean isPlainMacro', () => {

    // a plain copy copies children, unlike a macro
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="p1"><math newNamespace name="x">x+<math name="y">y</math></math></p>

    <p name="p2"><copy source="x" assignNames="x2" /></p>
    
    <p name="p3">x2/y: $(x2/y)</p>

    <p name="p4">$x</p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get(cesc('#/p1') + " .mjx-mrow").eq(0).should('have.text', 'x+y');
    cy.get(cesc('#/p2') + " .mjx-mrow").eq(0).should('have.text', 'x+y');
    cy.get(cesc('#/p3') + " .mjx-mrow").eq(0).should('have.text', 'y');
    cy.get(cesc('#/p4') + " .mjx-mrow").eq(0).should('have.text', 'x+y');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x2"].activeChildren.length).eq(2)

      expect(stateVariables["/x2/y"].stateValues.value).eq("y")

      let macroName = stateVariables["/p4"].activeChildren[0].componentName;
      expect(stateVariables[macroName].activeChildren.length).eq(0);


    });


  });

  it('plain copies and macros with createComponentOfType', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><mathinput name="mi"/>  <mathinput copySource="mi" />  <math copySource="mi" /></p>

    <p>$mi{createComponentOfType='mathinput'}, $mi, $mi{createComponentOfType='math'}</p> 

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '\uff3f')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mi3Anchor = cesc('#' + stateVariables["/_p2"].activeChildren[0].componentName);
      let m2Anchor = cesc('#' + stateVariables["/_p2"].activeChildren[2].componentName);
      let m3Anchor = cesc('#' + stateVariables["/_p2"].activeChildren[4].componentName);

      cy.get(m2Anchor + " .mjx-mrow").should('contain.text', '\uff3f')
      cy.get(m3Anchor + " .mjx-mrow").should('contain.text', '\uff3f')


      cy.log('mathinputs change with immediate value')
      cy.get('#\\/mi textarea').type("x", { force: true })

      cy.get('#\\/_mathinput2 .mq-editable-field').should('have.text', 'x')
      cy.get(mi3Anchor + ' .mq-editable-field').should('have.text', 'x')

      cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '\uff3f')
      cy.get(m2Anchor + " .mjx-mrow").should('contain.text', '\uff3f')
      cy.get(m3Anchor + " .mjx-mrow").should('contain.text', '\uff3f')

      cy.log('maths change with value')
      cy.get('#\\/mi textarea').blur();

      cy.get('#\\/_math1 .mjx-mrow').should('contain.text', 'x')
      cy.get(m2Anchor + " .mjx-mrow").should('contain.text', 'x')
      cy.get(m3Anchor + " .mjx-mrow").should('contain.text', 'x')


      cy.log('mathinputs change with immediate value')
      cy.get('#\\/_mathinput2 textarea').type("{end}{backspace}y", { force: true })

      cy.get('#\\/mi .mq-editable-field').should('have.text', 'y')
      cy.get(mi3Anchor + ' .mq-editable-field').should('have.text', 'y')

      cy.get('#\\/_math1 .mjx-mrow').should('contain.text', 'x')
      cy.get(m2Anchor + " .mjx-mrow").should('contain.text', 'x')
      cy.get(m3Anchor + " .mjx-mrow").should('contain.text', 'x')

      cy.log('maths change with value')
      cy.get('#\\/_mathinput2 textarea').blur();

      cy.get('#\\/_math1 .mjx-mrow').should('contain.text', 'y')
      cy.get(m2Anchor + " .mjx-mrow").should('contain.text', 'y')
      cy.get(m3Anchor + " .mjx-mrow").should('contain.text', 'y')


      cy.log('mathinputs change with immediate value')
      cy.get(mi3Anchor + ' textarea').type("{end}{backspace}z", { force: true })

      cy.get('#\\/mi .mq-editable-field').should('have.text', 'z')
      cy.get('#\\/_mathinput2 .mq-editable-field').should('have.text', 'z')

      cy.get('#\\/_math1 .mjx-mrow').should('contain.text', 'y')
      cy.get(m2Anchor + " .mjx-mrow").should('contain.text', 'y')
      cy.get(m3Anchor + " .mjx-mrow").should('contain.text', 'y')

      cy.log('maths change with value')
      cy.get(mi3Anchor + ' textarea').blur();

      cy.get('#\\/_math1 .mjx-mrow').should('contain.text', 'z')
      cy.get(m2Anchor + " .mjx-mrow").should('contain.text', 'z')
      cy.get(m3Anchor + " .mjx-mrow").should('contain.text', 'z')


    });


  });

  it('copy number from external content multiple ways, change attributes', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" /></p>

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" assignNames="n2" displayDigits="3" /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" displayDigits="3" name="n4" /></p>

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" newNamespace /></p>

    <p><copy uri="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" assignNames="n6" displayDigits="3" newNamespace /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" newNamespace /></p>

    <p><number copyFromURI="doenet:cid=bafkreiewuu4vpro2d3vxm3wmclbsgzcsdsswhmtfcrqq7m6datze2tiwu4" displayDigits="3" name="n8" newNamespace /></p>

    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', '8.853729375')
    cy.get('#\\/n2').should('have.text', '8.85')
    cy.get('#\\/_number1').should('have.text', '8.853729375')
    cy.get('#\\/n4').should('have.text', '8.85')
    cy.get('#\\/_p5').should('have.text', '8.853729375')
    cy.get('#\\/_copy4\\/n6').should('have.text', '8.85')
    cy.get('#\\/_number3').should('have.text', '8.853729375')
    cy.get('#\\/n8').should('have.text', '8.85')



  });


  it('correctly wrap replacement changes when verifying to force component type', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <answer name="ans">47</answer>
        <number copySource="ans.submittedResponse" name="num" />
    `}, "*");
    });

    cy.get('#\\/num').should('have.text', 'NaN')

    cy.get('#\\/ans textarea').type("4{enter}", { force: true });
    cy.get('#\\/num').should('have.text', '4')

    cy.get('#\\/ans textarea').type("7{enter}", { force: true });
    cy.get('#\\/num').should('have.text', '47')

  });

});