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
    cy.visit('/cypressTest')

  })

  it('copy copies properties', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <copy assignNames="a" target="_math1"/>
    <copy assignNames="b" target="a"/>
    <math modifyIndirectly="true">x</math>
    <copy assignNames="c" target="_math2"/>
    <copy assignNames="d" target="c"/>
    <point label="A">(1,2)</point>
    <copy assignNames="e" target="_point1"/>
    <copy assignNames="f" target="e"/>
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

  it('copy copies properties, with copyTarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <math modifyIndirectly="true">x</math>
    <math name="a" copyTarget="_math1"/>
    <math name="b" copyTarget="a"/>
    <math name="c" copyTarget="_math2"/>
    <math name="d" copyTarget="c"/>
    <point label="A">(1,2)</point>
    <point name="e" copytarget="_point1"/>
    <point name="f" copytarget="e"/>
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
    <copy name="cr1" assignNames="r1" target="_math1"/>
    <copy name="cr2" assignNames="r2" modifyIndirectly="true" target="_math1"/>
    <copy name="cr3" assignNames="r3" modifyIndirectly="true" target="cr1"/>
    <copy name="cr4" assignNames="r4" target="cr2"/>
    <copy name="cr5" assignNames="r5" target="cr3"/>
    <copy name="cr6" assignNames="r6" target="cr2" modifyIndirectly="false" />
    <copy name="cr7" assignNames="r7" target="cr3" modifyIndirectly="false" />

    <point label="A" name="A">(1,2)</point>
    <copy name="cA2" assignNames="A2" target="A"/>
    <copy label="B" name="cB" assignNames="B" target="A"/>
    <copy label="C" name="cC" assignNames="C" target="cB"/>
    <copy name="cC2" assignNames="C2" target="cC"/>
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
      expect(stateVariables['/C'].stateValues.label).eq("C");
      expect(stateVariables['/C2'].stateValues.label).eq("C");

    })
  });

  it('copy overwrites properties, with copyTarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="false">x</math>
    <math name="r1" copytarget="_math1"/>
    <math name="r2" modifyIndirectly="true" copytarget="_math1"/>
    <math name="r3" modifyIndirectly="true" copytarget="r1"/>
    <math name="r4" copytarget="r2"/>
    <math name="r5" copytarget="r3"/>
    <math name="r6" copytarget="r2" modifyIndirectly="false" />
    <math name="r7" copytarget="r3" modifyIndirectly="false" />

    <point label="A" name="A">(1,2)</point>
    <point name="A2" copytarget="A"/>
    <point label="B" name="B" copytarget="A"/>
    <point label="C" name="C" copytarget="B"/>
    <point name="C2" copytarget="C"/>
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
      expect(stateVariables['/C'].stateValues.label).eq("C");
      expect(stateVariables['/C2'].stateValues.label).eq("C");

    })
  });

  it('copy overwrites properties, decode XML entities', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="3 &gt; 4">x</math>
    <copy name="cr1" assignNames="r1" target="_math1"/>
    <copy name="cr2" assignNames="r2" modifyIndirectly="3&lt;4" target="_math1"/>
    <copy name="cr3" assignNames="r3" modifyIndirectly="3&lt;4" target="cr1"/>
    <copy name="cr4" assignNames="r4" target="cr2"/>
    <copy name="cr5" assignNames="r5" target="cr3"/>
    <copy name="cr6" assignNames="r6" target="cr2" modifyIndirectly="3&gt;4" />
    <copy name="cr7" assignNames="r7" target="cr3" modifyIndirectly="3&gt;4" />

    <point label="A" name="A">(1,2)</point>
    <copy name="cA2" assignNames="A2" target="A"/>
    <copy label="B" name="cB"  assignNames="B" target="A"/>
    <copy label="C" name="cC"  assignNames="C" target="cB"/>
    <copy name="cC2" assignNames="C2" target="cC"/>
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
      expect(stateVariables['/C'].stateValues.label).eq("C");
      expect(stateVariables['/C2'].stateValues.label).eq("C");

    })
  });

  it('copy overwrites properties, decode XML entities, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math modifyIndirectly="3 &gt; 4">x</math>
    <math name="r1" copytarget="_math1"/>
    <math name="r2" modifyIndirectly="3&lt;4" copytarget="_math1"/>
    <math name="r3" modifyIndirectly="3&lt;4" copytarget="r1"/>
    <math name="r4" copytarget="r2"/>
    <math name="r5" copytarget="r3"/>
    <math name="r6" copytarget="r2" modifyIndirectly="3&gt;4" />
    <math name="r7" copytarget="r3" modifyIndirectly="3&gt;4" />

    <point label="A" name="A">(1,2)</point>
    <point name="A2" copytarget="A"/>
    <point label="B" name="B" copytarget="A"/>
    <point label="C" name="C" copytarget="B"/>
    <point name="C2" copytarget="C"/>
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
      expect(stateVariables['/C'].stateValues.label).eq("C");
      expect(stateVariables['/C2'].stateValues.label).eq("C");

    })
  });

  it('copy props', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <copy assignNames="mr" prop="modifyIndirectly" target="x"/>
    <copy assignNames="mr2" prop="modifyIndirectly" modifyIndirectly="true" target="x"/>

    <copy assignNames="frmt" prop="format" target="x"/>
    <copy assignNames="frmt2" prop="format" target="x" hide />
    <copy assignNames="frmt3" hide target="frmt"/>

    <point name="A" label="A">(1,2)</point>
    <copy assignNames="cA" prop="coords" target="A"/>
    <copy assignNames="l" prop="latex" target="cA"/>
    <copy assignNames="lmr" prop="latex" modifyIndirectly="false" target="cA"/>
    <copy assignNames="A2" target="A"/>
    <copy assignNames="cA2" prop="coords" target="A2"/>
    <copy assignNames="l2" prop="latex" target="cA2"/>
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

  it('copy props, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="x" modifyIndirectly="false" hide>x</math>
    <boolean name="mr" prop="modifyIndirectly" copytarget="x"/>
    <boolean name="mr2" prop="modifyIndirectly" modifyIndirectly="true" copytarget="x"/>

    <text name="frmt" prop="format" copytarget="x"/>
    <text name="frmt2" prop="format" copytarget="x" hide />
    <text name="frmt3" hide copytarget="frmt"/>

    <point name="A" label="A">(1,2)</point>
    <coords name="cA" prop="coords" copytarget="A"/>
    <text name="l" prop="latex" copytarget="cA"/>
    <text name="lmr" prop="latex" modifyIndirectly="false" copytarget="cA"/>
    <point name="A2" copytarget="A"/>
    <coords name="cA2" prop="coords" copytarget="A2"/>
    <text name="l2" prop="latex" copytarget="cA2"/>
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
      <copy assignNames="p2" target="p1"/>
      <point name="p3">
        (<copy prop="y" target="p2"/>,
        <copy prop="x1" target="p2"/>)
      </point>
    </graph>
    <copy target="p1" assignNames="p1a" />
    <copy target="p2" assignNames="p2a" />
    <copy target="p3" assignNames="p3a" />
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

  it('copy props of copy still updatable, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point name="p1">(1,2)</point>
    </graph>
    
    <graph>
      <point name="p2" copytarget="p1"/>
      <point name="p3">
        (<math prop="y" copytarget="p2"/>,
        <math prop="x1" copytarget="p2"/>)
      </point>
    </graph>
    <point copytarget="p1" name="p1a" />
    <point copytarget="p2" name="p2a" />
    <point copytarget="p3" name="p3a" />
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
    <copy prop="label" target="_math1"/>

    <point label="A" target="x</point>
    <copy target="_point1"/>
    <copy prop="format" target="_ref1"/>

    <copy name="A2" target="A"/>
    <copy name="cA2" prop="coords" target="A2"/>
    <copy name="lcA2" prop="label" target="cA2"/>
    <copy name="llcA2" label="B" target="cA2"/>

    `}, "*");
    });

    cy.get('#__math1') //wait for page to load


    // How to check if the right errors get thrown for these?

  });

  it('copy of prop copy shadows target', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
    <copy prop="displacement" name="cd1" assignNames="d1" target="_vector1"/>
    </graph>
  
    <graph>
    <copy target="cd1" assignNames="d2" />
    </graph>

    <copy target="_vector1" assignNames="v1a" />
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

  it('copy of prop copy shadows target, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <vector displacement="(-4,2)" tail="(1,1)" />
    </graph>
  
    <graph>
      <vector prop="displacement" name="d1" copytarget="_vector1"/>
    </graph>
  
    <graph>
      <vector copytarget="d1" name="d2" />
    </graph>

    <vector copytarget="_vector1" name="v1a" />
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
    
    <p><copy name="al2" target="_aslist1"/></p>
    <copy assignNames="p2" target="_p1"/>
    
    <p><copy target="al2"/></p>
    <copy target="p2" assignNames="p3"/>

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
    
    <p><aslist name="al2" copytarget="_aslist1"/></p>

    <p><aslist copytarget="al2"/></p>

    <p name="p2" copytarget="_p1"/>
    
    <p copytarget="p2" name="p3"/>

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
    <p>Force to stay hidden: <copy target="hidden" targetAttributesToIgnore="" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', 'Hidden text: ');
    cy.get('#\\/_p2').should('have.text', 'Revealed by default: secret');
    cy.get('#\\/_p3').should('have.text', 'Force to stay hidden: ');


  });

  it('copy ignores hide by default, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Hidden text: <text name="hidden" hide>secret</text></p>
    <p>Revealed by default: <text copyTarget="hidden" /></p>
    <p>Force to stay hidden: <text copyTarget="hidden" targetAttributesToIgnore="" /></p>

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
    <copy target="theP" assignNames="theP2" />
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

  it('copy keeps hidden children hidden, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="theP" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
    <p name="pReveal">Revealed: <text copyTarget="theP/hidden" /></p>
    <p copytarget="theP" name="theP2" />
    <p name="pReveal2">Revealed 2: <text copyTarget="theP2/hidden" /></p>


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

    <text name="target">hello</text>

    <booleaninput name='h1' prefill="false" label="Hide first copy" />
    <booleaninput name='h2' prefill="true" label="Hide second copy" />

    <p name="c1">copy 1: <copy hide="$h1" target="target" /></p>
    <p name="c2">copy 2: <copy hide="$h2" target="target" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/c1').should('have.text', 'copy 1: hello')
    cy.get('#\\/c2').should('have.text', 'copy 2: ')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/c1').should('have.text', 'copy 1: ')
    cy.get('#\\/c2').should('have.text', 'copy 2: hello')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/c1').should('have.text', 'copy 1: hello')
    cy.get('#\\/c2').should('have.text', 'copy 2: ')

  })

  it('copies hide dynamically, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <text name="target">hello</text>

    <booleaninput name='h1' prefill="false" label="Hide first copy" />
    <booleaninput name='h2' prefill="true" label="Hide second copy" />

    <p name="c1">copy 1: <text hide="$h1" copytarget="target" /></p>
    <p name="c2">copy 2: <text hide="$h2" copytarget="target" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/c1').should('have.text', 'copy 1: hello')
    cy.get('#\\/c2').should('have.text', 'copy 2: ')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/c1').should('have.text', 'copy 1: ')
    cy.get('#\\/c2').should('have.text', 'copy 2: hello')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

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


    cy.get(cesc('#/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/problem2/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName
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


    cy.get(cesc('#/problem12/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/problem12/problem2/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName
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


    cy.get(cesc('#/set2/problem34/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/set2/problem34/problem2/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName
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


    cy.get(cesc('#/set1/problem12/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/set1/problem12/problem2/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName
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


    cy.get(cesc('#/problem34/problem2/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = stateVariables['/problem34/problem2/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName
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

    <copy target="verb" assignNames="verb2" />
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

  it('copy of component that changes away from a copy, with copyTarget', () => {
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

    <text copytarget="verb" name="verb2" />
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

  it('copy of invalid target gives math in boolean and math', () => {
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
    
    <p>Unlinked copy: <copy link="false" target="m" simplify="$s2" assignNames="m2" /></p>

    <p>Linked copy: <copy target="m" simplify="$s2" assignNames="m3" /></p>
    
    <p>Double value of original: <updateValue target="m" newValue="2$m" name="doubleOriginal" label="double original" /></p>
    <p>Double value of copy 1: <updateValue target="m2" newValue="2$m2" name="doubleCopy1" label="double copy 1" /></p>
    <p>Double value of copy 2: <updateValue target="m3" newValue="2$m3" name="doubleCopy2" label="double copy 2" /></p>

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

  it('copy no link, base test, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Simplify of original: <textinput name="s1" prefill="full" /></p>
    <p>Simplify of copies: <textinput name="s2" prefill="none" /></p>

    <p>Original: <math name="m" simplify="$s1">x +x</math></p>
    
    <p>Unlinked copy: <math link="false" copytarget="m" simplify="$s2" name="m2" /></p>

    <p>Linked copy: <math copytarget="m" simplify="$s2" name="m3" /></p>
    
    <p>Double value of original: <updateValue target="m" newValue="2$m" name="doubleOriginal" label="double original" /></p>
    <p>Double value of copy 1: <updateValue target="m2" newValue="2$m2" name="doubleCopy1" label="double copy 1" /></p>
    <p>Double value of copy 2: <updateValue target="m3" newValue="2$m3" name="doubleCopy2" label="double copy 2" /></p>

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
      <copy target="A" link="false" name="Anolink" assignNames="A2" />
      <copy target="l" link="false" name="lnolink" assignNames="l2" />
    </graph>
    
    <graph>
      <copy target="l" prop="point1" link="false" name="plnolink" assignNames="A3" />
    </graph>
    <graph>
      <copy target="l" prop="points" link="false" name="plsnolink" assignNames="A4 B4"  />
    </graph>

    <copy target="g" link="false" name="gnolink" newNamespace />
    
    <copy target="A" prop="x" link="false" assignNames="Ax" name="pxnolink" />

    <p>
      <copy target="A" assignNames="Ac" />
      <copy target="B" assignNames="Bc" />
      <copy prop="point1" target="l" assignNames="lp1" />
      <copy target="A2" assignNames="A2c" />
      <copy prop="point1" target="l2" assignNames="l2p1" />
      <copy target="A3" assignNames="A3c" />
      <copy target="A4" assignNames="A4c" />
      <copy target="B4" assignNames="B4c" />
      <copy target="gnolink/A" assignNames="A5c" />
      <copy target="gnolink/B" assignNames="B5c" />
      <copy prop="point1" target="gnolink/l" assignNames="l3p1" />

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

  it('copy points and lines with no link, with copytarget', () => {
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
      <point copytarget="A" link="false" name="A2" />
      <line copytarget="l" link="false" name="l2" />
    </graph>
    
    <graph>
      <point copytarget="l" prop="point1" link="false" name="A3" />
    </graph>
    <graph>
      <point copytarget="l" prop="point1" link="false" name="A4" />
      <point copytarget="l" prop="point2" link="false" name="B4" />
    </graph>

    <graph copytarget="g" link="false" name="gnolink" newNamespace />
    
    <math copytarget="A" prop="x" link="false" name="Ax" />

    <p>
      <point copytarget="A" name="Ac" />
      <point copytarget="B" name="Bc" />
      <point prop="point1" copytarget="l" name="lp1" />
      <point copytarget="A2" name="A2c" />
      <point prop="point1" copytarget="l2" name="l2p1" />
      <point copytarget="A3" name="A3c" />
      <point copytarget="A4" name="A4c" />
      <point copytarget="B4" name="B4c" />
      <point copytarget="gnolink/A" name="A5c" />
      <point copytarget="gnolink/B" name="B5c" />
      <point prop="point1" copytarget="gnolink/l" name="l3p1" />

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
    <copy target="_p1" assignNames="p2" link="false" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/_p1").should('have.text', 'Hello')
    cy.get("#\\/p2").should('have.text', 'Hello')

  });

  it('copy string with no link, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Hello</p>
    <p copytarget="_p1" name="p2" link="false" />
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
    <p><group name="g"><text name="m">hello</text> <copy target="m" assignNames="q" /></group></p>
    <p><copy target="g" link="false" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get("#\\/_p1").should('have.text', 'hello hello')
    cy.get("#\\/_p2").should('have.text', 'hello hello')

  });

  // This was causing a duplicate componentName error
  it('copy group with assignNames inside with no link, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><group name="g"><text name="m">hello</text> <copy target="m" assignNames="q" /></group></p>
    <p><group copytarget="g" link="false" /></p>
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
      <copy target="twox" name="ctwox" assignNames="twoxa" />
      <copy target="twox" name="c2twox" assignNames="twoxb" />
    </group>
    
    <copy target="twox" assignNames="twoxc" />
    <copy target="twox" link="false" assignNames="twoxd" />
    
    <copy target="twoxa" assignNames="twoxe" />
    <copy target="twoxa" link="false" assignNames="twoxf" />
    
    <copy target="ctwox" assignNames="twoxg" />
    <copy target="ctwox" link="false" assignNames="twoxh" />

    <copy target="twoxb" assignNames="twoxi" />
    <copy target="twoxb" link="false" assignNames="twoxj" />
    
    <copy target="c2twox" assignNames="twoxk" />
    <copy target="c2twox" link="false" assignNames="twoxl" />
  
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

  it('copy group with copies with no link, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group>
      <p><math name="twox">x+x</math></p>
      <math copytarget="twox" name="twoxa" />
      <math copytarget="twox" name="twoxb" />
    </group>
    
    <math copytarget="twox" name="twoxc" />
    <math copytarget="twox" link="false" name="twoxd" />
    
    <math copytarget="twoxa" name="twoxe" />
    <math copytarget="twoxa" link="false" name="twoxf" />
    
    <math copytarget="twoxe" name="twoxg" />
    <math copytarget="twoxf" link="false" name="twoxh" />

    <math copytarget="twoxb" name="twoxi" />
    <math copytarget="twoxb" link="false" name="twoxj" />
    
    <math copytarget="twoxi" name="twoxk" />
    <math copytarget="twoxj" link="false" name="twoxl" />
  
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
      <copy target="twox" simplify="$sim" name="ctwox" assignNames="twoxa" />
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    <copy target="g" link="false" name="g2" newNamespace />
    <copy target="g2/g" link="false" name="g3" newNamespace />
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

  it('copy group with copy overwriting attribute, no link, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="g">
      <textinput name="sim" prefill="full" />
    
      <p><math name="twox">x+x</math>
      <math copytarget="twox" simplify="$sim" name="twoxa" />
      <math name="threex" simplify="$sim">x+x+x</math>
      </p>
    </group>
    
    <group copytarget="g" link="false" name="g2" newNamespace />
    <group copytarget="g2" link="false" name="g3" newNamespace />
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
    <p>Credit achieved: <copy prop="creditAchieved" target="p/derivativeProblem/_answer1" assignNames="ca" /></p>
    </group>
    
    <copy target="g" link="false" assignNames="g2" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinput1Anchor = cesc('#' + stateVariables["/g/p/derivativeProblem/_answer1"].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput2Anchor = cesc('#' + stateVariables["/g2/p/derivativeProblem/_answer1"].stateValues.inputChildren[0].componentName) + " textarea";

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

  it('copy group with link through assignNames of external, no link, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name="g" newNamespace>
    <problem copyfromuri="doenet:cid=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" name="p" />
    <p>Credit achieved: <number prop="creditAchieved" copytarget="p/_answer1" name="ca" /></p>
    </group>
    
    <group copytarget="g" link="false" name="g2" />
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
    
    <copy target='g' link="false" />
    `}, "*");
    });

    // just testing that page loads, i.e., that bug is removed so that don't get error
    cy.get('#\\/_text1').should('have.text', 'a');


  });

  it('copy group, no link, with function adapted to curve, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group name='g'>
      <graph>
        <function>x</function>
      </graph>
    </group>
    
    <group copytarget='g' link="false" />
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
      <copy target="/external" prop="value" assignNames="w" />
      <point label="$(/external)" name="P">(a,b)</point>
      <copy prop="label" target="P" assignNames="Plabel" />
    </group>
    
    <copy target="g" assignNames="g2" link="false" />
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

  it('copy group, no link, copy to external inside attribute, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput name="external" prefill="bye" />

    <group name="g" newNamespace>
      <text copytarget="/external" prop="value" name="w" />
      <point name="P">
        <label>$(/external)</label>
        (a,b)
      </point>
      <label prop="label" copytarget="P" name="Plabel" />
    </group>
    
    <group copytarget="g" name="g2" link="false" />
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
          <copy target="x" assignNames="w" />
          <point label="$x" name="P">(a,b)</point>
          <copy prop="label" target="P" assignNames="Plabel" />


        </template>
        <sources alias="x">
          $ti
        </sources>
      </map>
    </group>
    
    <copy target="g" assignNames="g2" link="false" />
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

  it('copy group, no link, internal copy to source alias is linked, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <group name="g" newNamespace>
      <textinput name="ti" prefill="hello" />
      <map assignNames="a">
        <template newNamespace>
          <text copytarget="x" name="w" />
          <point name="P">
            <label>$x</label>
            (a,b)
          </point>
          <label prop="label" copytarget="P" name="Plabel" />
        </template>
        <sources alias="x">
          $ti
        </sources>
      </map>
    </group>
    
    <group copytarget="g" name="g2" link="false" />
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

  it('copy no link containing external copies use absolute target', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group newNamespace name="g">
      <p>m = <copy target="../m" assignNames="m1" /></p>
      <p>m = <copy target="../m" assignNames="m2" link="false" /></p>
    </group>
    
    <copy target="g" assignNames="g2" />
    <copy target="g" link="false" assignNames="g3" />
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

  it('copy no link containing external copies use absolute target, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <number name="n">2</number>
    <number name="m">2$n</number>
    
    <group newNamespace name="g">
      <p>m = <number copytarget="../m" name="m1" /></p>
      <p>m = <number copytarget="../m" name="m2" link="false" /></p>
    </group>
    
    <group copytarget="g" name="g2" />
    <group copytarget="g" link="false" name="g3" />
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

      <updateValue name="addP" label="Add p" target="n" newValue="$n+1" />
      <updateValue name="removeP" label="Remove p" target="n" newValue="$n-1" />
      <map assignNames="(p1) (p2) (p3) (p4)">
        <template><p>i=$i, v=$v</p></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </section>
    
    <section name="section2" newNamespace>
      <copy target='../section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section3">
      <copy target='section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <copy target='section1' link='false' assignNames="section4" />
    
    <section name="section5" newNamespace>
      <copy target='../section1/_map1' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section6">
      <copy target='section1/_map1' assignNames='(p1a) (p2a) (p3a) (p4a)' />
    </section>

    <copy target='section1' assignNames="section7" />
  
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

    cy.get(cesc('#/section7_title')).should('have.text', 'Section 1')
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

  it('copy dynamic map no link, check aliases, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <section name="section1" newNamespace>
      <setup>
        <number name="n">2</number>
      </setup>

      <updateValue name="addP" label="Add p" target="n" newValue="$n+1" />
      <updateValue name="removeP" label="Remove p" target="n" newValue="$n-1" />
      <map assignNames="(p1) (p2) (p3) (p4)">
        <template><p>i=$i, v=$v</p></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </section>
    
    <section name="section2" newNamespace>
      <map copytarget='../section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section3">
      <map copytarget='section1/_map1' link='false' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section copytarget='section1' link='false' name="section4" />
    
    <section name="section5" newNamespace>
      <map copytarget='../section1/_map1' assignNames='(p1) (p2) (p3) (p4)' />
    </section>

    <section name="section6">
      <map copytarget='section1/_map1' assignNames='(p1a) (p2a) (p3a) (p4a)' />
    </section>

    <section copytarget='section1' name="section7" />
  
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

    cy.get(cesc('#/section7_title')).should('have.text', 'Section 1')
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
    
    <p><m name="m1">A_1 = <copy target="t1/A" displayDigits="3" /></m></p>
    <p><m name="m2">A_2 = <copy target="t2/A" displayDigits="3" /></m></p>
    
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

  it('trim whitespace off target', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text name="hi">Hello</text>
    <p><copy target=" hi  " /> there</p>
    `}, "*");
    });

    cy.get('#\\/hi').should('have.text', 'Hello');
    cy.get('#\\/_p1').should('have.text', 'Hello there')


  });

  it('trim whitespace off target, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text name="hi">Hello</text>
    <p><text copytarget=" hi  " /> there</p>
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

  it('copy with newNamespace retains original names, even with group', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp"><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section><copy name="c1" target="_p1" newNamespace /></section>
      
      <copy name="c2" target="c1" />
      <copy name="c3" target="c1" assignNames="p1a" />
      <copy name="c4" target="c1" newNamespace />
      <copy name="c5" target="c1" newNamespace assignNames="p1b" />
      
      <copy name="c7" target="_section1" />
      <copy name="c8" target="_section1" assignNames="s1a" />
      <copy name="c9" target="_section1" newNamespace />
      <copy name="c10" target="_section1" newNamespace assignNames="s1b" />
    
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
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/c10/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c8s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c9s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c10s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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

  it('copy with newNamespace retains original names, even with group, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp"><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section><p name="p1a" copytarget="_p1" newNamespace /></section>
      
      <p copytarget="p1a" name="p1b" />
      <p copytarget="p1a" newNamespace name="p1c" />
      
      <section copytarget="_section1" name="s1a" />
      <section copytarget="_section1" newNamespace name="s1b" />
    
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
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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
      
      <section><copy name="c1" target="_p1" newNamespace /></section>
      
      <copy name="c2" target="c1" />
      <copy name="c3" target="c1" assignNames="p1a" />
      <copy name="c4" target="c1" newNamespace />
      <copy name="c5" target="c1" newNamespace assignNames="p1b" />
      
      <copy name="c7" target="_section1" />
      <copy name="c8" target="_section1" assignNames="s1a" />
      <copy name="c9" target="_section1" newNamespace />
      <copy name="c10" target="_section1" newNamespace assignNames="s1b" />
    
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
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/c10/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c8s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c9s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c10s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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

  it('copy with newNamespace retains original names, even with group that assigns names, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp" assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n3">3</number></p>
      
      <section><p name="p1a" copytarget="_p1" newNamespace /></section>
      
      <p copytarget="p1a" name="p1b" />
      <p copytarget="p1a" newNamespace name="p1c" />
      
      <section copytarget="_section1" name="s1a" />
      <section copytarget="_section1" newNamespace name="s1b" />
    
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
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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
      
      <section><copy name="c1" target="_p1" newNamespace /></section>
      
      <copy name="c2" target="c1" />
      <copy name="c3" target="c1" assignNames="p1a" />
      <copy name="c4" target="c1" newNamespace />
      <copy name="c5" target="c1" newNamespace assignNames="p1b" />
      
      <copy name="c7" target="_section1" />
      <copy name="c8" target="_section1" assignNames="s1a" />
      <copy name="c9" target="_section1" newNamespace />
      <copy name="c10" target="_section1" newNamespace assignNames="s1b" />
    
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
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/c10/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c8s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c9s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c10s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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

  it('copy with newNamespace retains original names, even with group that has new namespace, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp" newNamespace><number>1</number> <number>2</number></group> <number>3</number></p>
      
      <section><p name="p1a" copytarget="_p1" newNamespace /></section>
      
      <p copytarget="p1a" name="p1b" />
      <p copytarget="p1a" newNamespace name="p1c" />
      
      <section copytarget="_section1" name="s1a" />
      <section copytarget="_section1" newNamespace name="s1b" />
    
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
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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
      
      <section><copy name="c1" target="_p1" newNamespace /></section>
      
      <copy name="c2" target="c1" />
      <copy name="c3" target="c1" assignNames="p1a" />
      <copy name="c4" target="c1" newNamespace />
      <copy name="c5" target="c1" newNamespace assignNames="p1b" />
      <copy name="c6" target="c1" newNamespace assignNames="grp" />
      
      <copy name="c7" target="_section1" />
      <copy name="c8" target="_section1" assignNames="s1a" />
      <copy name="c9" target="_section1" newNamespace />
      <copy name="c10" target="_section1" newNamespace assignNames="s1b" />
      <copy name="c11" target="_section1" newNamespace assignNames="grp" />
    
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
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/c10/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/c11/grp')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c8s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c9s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c10s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
      })
      cy.get(cesc('#' + c11s)).invoke('text').then(text => {
        expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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

  it('copy with newNamespace retains original names, even with group that has new namespace and assigns names, with copytarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>values: <group name="grp" newNamespace assignNames="n1 n2"><number>1</number> <number>2</number></group> <number name="n1">3</number></p>
      
      <section><p name="p1a" copytarget="_p1" newNamespace /></section>
      
      <p copytarget="p1a" name="p1b" />
      <p copytarget="p1a" newNamespace name="p1c" />
      
      <section copytarget="_section1" name="s1a" />
      <section copytarget="_section1" newNamespace name="s1b" />
    
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
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
    })
    cy.get(cesc('#/s1b')).invoke('text').then(text => {
      expect(text.match(/Section 1\s*values: 1 2 3/)).not.be.null
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

      <copy target="grp" assignNames="grp2" />
      
      <group copytarget="grp2" name="grp3" />

      <group copytarget="grp2/_group1" name="grp4" newNamespace />
      <group copytarget="grp3/_group1" name="grp5" newNamespace />

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

      <p><copy target="grp" assignNames="(num2)" /></p>
      

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
      <collect name="col" componentTypes="point" target="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <copy target="col" assignNames="A2 B2" componentIndex="$n" />
    </graph>
  
    <copy target="g2" name="g3" newNamespace />

    <aslist name="al"><copy prop="x" target="col" componentIndex="$n" assignNames="Ax Bx" /></aslist>

    <copy target="al" name="al2" newNamespace />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
    cy.get('#\\/Bx .mjx-mrow').should('contain.text', nInDOM(x2));
    cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
    cy.get('#\\/al2\\/Bx .mjx-mrow').should('contain.text', nInDOM(x2));

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/A2'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables["/g3/A2"].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/B2'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables["/g3/B2"].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/Ax'].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      expect(stateVariables['/Bx'].stateValues.value).eq(x2);
      expect(stateVariables["/al2/Bx"].stateValues.value).eq(x2);
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

  it('copy componentIndex, with copytarget', () => {
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
      <collect name="col" componentTypes="point" target="g1" assignNames="A1 B1" />
    </graph>
    
    <graph name="g2">
      <point copytarget="col" name="A2" componentIndex="$n" />
    </graph>
  
    <graph copytarget="g2" name="g3" newNamespace />
  
    <aslist name="al"><math prop="x" copytarget="col" componentIndex="$n" name="Ax" /></aslist>
  
    <aslist copytarget="al" name="al2" newNamespace />

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
      <collect name="col" componentTypes="point" target="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><copy prop="xs" target="col" componentIndex="$m" propIndex="$n" assignNames="n1 n2 n3 n4" /></aslist></p>

    <p><copy target="al" name="al2" newNamespace /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
    cy.get('#\\/n2 .mjx-mrow').should('contain.text', nInDOM(y1));
    cy.get('#\\/n3 .mjx-mrow').should('contain.text', nInDOM(x2));
    cy.get('#\\/n4 .mjx-mrow').should('contain.text', nInDOM(y2));
    cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
    cy.get('#\\/al2\\/n2 .mjx-mrow').should('contain.text', nInDOM(y1));
    cy.get('#\\/al2\\/n3 .mjx-mrow').should('contain.text', nInDOM(x2));
    cy.get('#\\/al2\\/n4 .mjx-mrow').should('contain.text', nInDOM(y2));

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/n1'].stateValues.value).eq(x1);
      expect(stateVariables['/n2'].stateValues.value).eq(y1);
      expect(stateVariables['/n3'].stateValues.value).eq(x2);
      expect(stateVariables['/n4'].stateValues.value).eq(y2);
      expect(stateVariables['/al2/n1'].stateValues.value).eq(x1);
      expect(stateVariables['/al2/n2'].stateValues.value).eq(y1);
      expect(stateVariables['/al2/n3'].stateValues.value).eq(x2);
      expect(stateVariables['/al2/n4'].stateValues.value).eq(y2);
    });

    cy.log('set propIndex to 1');

    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
    cy.get('#\\/n2 .mjx-mrow').should('contain.text', nInDOM(x2));
    cy.get('#\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/n4 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
    cy.get('#\\/al2\\/n2 .mjx-mrow').should('contain.text', nInDOM(x2));
    cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/n1'].stateValues.value).eq(x1);
      expect(stateVariables['/n2'].stateValues.value).eq(x2);
      expect(stateVariables['/n3']).eq(undefined);
      expect(stateVariables['/n4']).eq(undefined);
      expect(stateVariables['/al2/n1'].stateValues.value).eq(x1);
      expect(stateVariables['/al2/n2'].stateValues.value).eq(x2);
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

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/n2 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x1);
        expect(stateVariables['/n2'].stateValues.value).eq(x2);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x1);
        expect(stateVariables['/al2/n2'].stateValues.value).eq(x2);
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

    cy.window().then(async (win) => {
      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/n2 .mjx-mrow').should('contain.text', nInDOM(y2));
      cy.get('#\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/n4 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/n2 .mjx-mrow').should('contain.text', nInDOM(y2));
      cy.get('#\\/al2\\/n3 .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/n4 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/n2'].stateValues.value).eq(y2);
        expect(stateVariables['/n3']).eq(undefined);
        expect(stateVariables['/n4']).eq(undefined);
        expect(stateVariables['/al2/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/al2/n2'].stateValues.value).eq(y2);
        expect(stateVariables['/al2/n3']).eq(undefined);
        expect(stateVariables['/al2/n4']).eq(undefined);
      });
    })

  })

  it('copy propIndex and componentIndex, with copytarget', () => {
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
      <collect name="col" componentTypes="point" target="g1" assignNames="A1 B1" />
    </graph>
  
    
    <p><aslist name="al"><math prop="xs" copytarget="col" componentIndex="$m" propIndex="$n" name="n1" /></aslist></p>

    <p><aslist copytarget="al" name="al2" newNamespace /></p>

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

    <p name="p2">Text revealed by default: <copy target="p1/hidden" name="c1" assignNames="notHidden" /></p>
    <p name="p3">Because target attributes to ignore are: <copy prop="targetAttributesToIgnore" target="c1" obtainPropFromComposite /></p>
    <p name="p4">Check attributes: <copy prop="hidden" target="notHidden" /> <copy prop="fixed" target="notHidden" /> <copy prop="newNamespace" target="notHidden" /></p>
    <p name="p5">Check if new namespace copied: <copy target="notHidden/pw"/></p>

    <p>Text but not paragraph stays hidden by default:</p>
    <copy target="p1" name="c2" assignNames="p6" />
    <p name="p7">Because target attributes to ignore are: <copy prop="targetAttributesToIgnore" target="c2" obtainPropFromComposite /></p>
    <p name="p8">Check attributes: <copy prop="hidden" target="p6" /> <copy prop="fixed" target="p6" /> <copy prop="newNamespace" target="p6" /> <copy prop="hidden" target="p6/hidden" /> <copy prop="fixed" target="p6/hidden" /> <copy prop="newNamespace" target="p6/hidden" /></p>
    <p name="p9">Check if inner new namespace copied: <copy target="p6/hidden/pw"/></p>


    <p name="p10">Now text stays hidden: <copy target="p1/hidden" name="c3" assignNames="stillHidden" targetAttributesToIgnore="newNamespace fixed" /></p>
    <p name="p11">Because target attributes to ignore are: <copy prop="targetAttributesToIgnore" target="c3" obtainPropFromComposite /></p>
    <p name="p12">Check attributes: <copy prop="hidden" target="stillHidden" /> <copy prop="fixed" target="stillHidden" /> <copy prop="newNamespace" target="stillHidden" /></p>
    <p name="p13">Check that new namespace not copied: <copy target="stillHidden/pw" /></p>

    <p>Now paragraph stay hidden:</p>
    <copy target="p1" name="c4" assignNames="p14" targetAttributesToIgnore="newNamespace fixed" />
    <p name="p15">Because target attributes to ignore are: <copy prop="targetAttributesToIgnore" target="c4" obtainPropFromComposite /></p>
    <p name="p16">Check attributes: <copy prop="hidden" target="p14" /> <copy prop="fixed" target="p14" /> <copy prop="newNamespace" target="p14" /></p>
    <p name="p17">Check that outer new namespace not copied: <copy target="p14/hidden"/></p>


    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/p1').should('not.exist');

    cy.get('#\\/p2').should('have.text', 'Text revealed by default: secret password');
    cy.get('#\\/p3').should('have.text', 'Because target attributes to ignore are: hide');
    cy.get('#\\/p4').should('have.text', 'Check attributes: false true true');
    cy.get('#\\/p5').should('have.text', 'Check if new namespace copied: password')

    cy.get('#\\/p6').should('have.text', 'Hidden text: ')
    cy.get('#\\/p7').should('have.text', 'Because target attributes to ignore are: hide')
    cy.get('#\\/p8').should('have.text', 'Check attributes: false true true true true true');
    cy.get('#\\/p9').should('have.text', 'Check if inner new namespace copied: password')

    cy.get('#\\/p10').should('have.text', 'Now text stays hidden: ');
    cy.get('#\\/p11').should('have.text', 'Because target attributes to ignore are: newNamespace, fixed');
    cy.get('#\\/p12').should('have.text', 'Check attributes: true false false');
    cy.get('#\\/p13').should('have.text', 'Check that new namespace not copied: ')

    cy.get('#\\/p14').should('not.exist');
    cy.get('#\\/p15').should('have.text', 'Because target attributes to ignore are: newNamespace, fixed');
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
    <copy target="p1" name="c1" assignNames="p2" />
    <p name="p3">Because target attributes to ignore recursively are: <copy prop="targetAttributesToIgnoreRecursively" target="c1" obtainPropFromComposite /></p>
    <p name="p4">Check attributes: <copy prop="hidden" target="p2" /> <copy prop="fixed" target="p2" /> <copy prop="isResponse" target="p2" /> <copy prop="hidden" target="p2/hidden" /> <copy prop="fixed" target="p2/hidden" /> <copy prop="isResponse" target="p2/hidden" /></p>

    <p>Now all is revealed:</p>
    <copy target="p1" name="c2" assignNames="p5" targetAttributesToIgnoreRecursively="hide fixed" />
    <p name="p6">Because target attributes to ignore recursively are: <copy prop="targetAttributesToIgnoreRecursively" target="c2" obtainPropFromComposite /></p>
    <p name="p7">Check attributes: <copy prop="hidden" target="p5" /> <copy prop="fixed" target="p5" /> <copy prop="isResponse" target="p5" /> <copy prop="hidden" target="p5/hidden" /> <copy prop="fixed" target="p5/hidden" /> <copy prop="isResponse" target="p5/hidden" /></p>


    <p>All is still revealed:</p>
    <copy target="p1" name="c3" assignNames="p8" targetAttributesToIgnoreRecursively="hide" targetAttributesToIgnore="fixed isResponse" />
    <p name="p9">Because target attributes to ignore recursively are: <copy prop="targetAttributesToIgnoreRecursively" target="c3" obtainPropFromComposite /></p>
    <p name="p10">And target attributes to ignore are: <copy prop="targetAttributesToIgnore" target="c3" obtainPropFromComposite /></p>
    <p name="p11">Check attributes: <copy prop="hidden" target="p8" /> <copy prop="fixed" target="p8" /> <copy prop="isResponse" target="p8" /> <copy prop="hidden" target="p8/hidden" /> <copy prop="fixed" target="p8/hidden" /> <copy prop="isResponse" target="p8/hidden" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/p1').should('not.exist');

    cy.get('#\\/p2').should('have.text', 'The text: ');
    cy.get('#\\/p3').should('have.text', 'Because target attributes to ignore recursively are: isResponse');
    cy.get('#\\/p4').should('have.text', 'Check attributes: false true false true true false');

    cy.get('#\\/p5').should('have.text', 'The text: secret');
    cy.get('#\\/p6').should('have.text', 'Because target attributes to ignore recursively are: hide, fixed');
    cy.get('#\\/p7').should('have.text', 'Check attributes: false false true false false true');

    cy.get('#\\/p8').should('have.text', 'The text: secret');
    cy.get('#\\/p9').should('have.text', 'Because target attributes to ignore recursively are: hide');
    cy.get('#\\/p10').should('have.text', 'And target attributes to ignore are: fixed, isResponse');
    cy.get('#\\/p11').should('have.text', 'Check attributes: false false false false true true');

  });

  it('copyTarget', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g1">
      <point name="P">(1,2)</point>
    </graph>
    <copy prop="x" target="P" assignNames="P1x" />
    <graph name="g2" newNamespace>
      <point name="P">(3,4)</point>
    </graph>
    <copy prop="x" target="g2/P" assignNames="P2x" />
    <graph name="g3">
      <point copyTarget="P" name="Pa" />
    </graph>
    <graph name="g4" newNamespace>
      <point copyTarget="../g2/P" name="Pa" />
    </graph>
    <graph copyTarget="g1" name="g5" />
    <graph copyTarget="g2" name="g6" />
    <graph copyTarget="g3" name="g7" />
    <graph copyTarget="g4" name="g8" />

    <graph copyTarget="g1" name="g9" newNamespace />
    <graph copyTarget="g2" name="g10" newNamespace />
    <graph copyTarget="g3" name="g11" newNamespace />
    <graph copyTarget="g4" name="g12" newNamespace />

    <graph copyTarget="g5" name="g13" />
    <graph copyTarget="g6" name="g14" />
    <graph copyTarget="g7" name="g15" />
    <graph copyTarget="g8" name="g16" />
    <graph copyTarget="g9" name="g17" />
    <graph copyTarget="g10" name="g18" />
    <graph copyTarget="g11" name="g19" />
    <graph copyTarget="g12" name="g20" />
  
    <graph copyTarget="g5" name="g21" newNamespace />
    <graph copyTarget="g6" name="g22" newNamespace />
    <graph copyTarget="g7" name="g23" newNamespace />
    <graph copyTarget="g8" name="g24" newNamespace />
    <graph copyTarget="g9" name="g25" newNamespace />
    <graph copyTarget="g10" name="g26" newNamespace />
    <graph copyTarget="g11" name="g27" newNamespace />
    <graph copyTarget="g12" name="g28" newNamespace />

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

  it('copyTarget and copies with assignNewNamespaces', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g1">
      <point name="P">(1,2)</point>
    </graph>
    <copy prop="x" target="P" assignNames="P1x" />
    <graph name="g2" newNamespace>
      <point name="P">(3,4)</point>
    </graph>
    <copy prop="x" target="g2/P" assignNames="P2x" />
    <graph name="g3">
      <point copyTarget="P" name="Pa" />
    </graph>
    <graph name="g4" newNamespace>
      <point copyTarget="../g2/P" name="Pa" />
    </graph>
    <graph copyTarget="g1" name="g5" />
    <graph copyTarget="g2" name="g6" />
    <graph copyTarget="g3" name="g7" />
    <graph copyTarget="g4" name="g8" />

    <copy target="g1" assignNames="g9" assignNewNamespaces />
    <copy target="g2" assignNames="g10" assignNewNamespaces />
    <copy target="g3" assignNames="g11" assignNewNamespaces />
    <copy target="g4" assignNames="g12" assignNewNamespaces />

    <graph copyTarget="g5" name="g13" />
    <graph copyTarget="g6" name="g14" />
    <graph copyTarget="g7" name="g15" />
    <graph copyTarget="g8" name="g16" />
    <graph copyTarget="g9" name="g17" />
    <graph copyTarget="g10" name="g18" />
    <graph copyTarget="g11" name="g19" />
    <graph copyTarget="g12" name="g20" />
  
    <copy target="g5" assignNames="g21" assignNewNamespaces />
    <copy target="g6" assignNames="g22" assignNewNamespaces />
    <copy target="g7" assignNames="g23" assignNewNamespaces />
    <copy target="g8" assignNames="g24" assignNewNamespaces />
    <copy target="g9" assignNames="g25" assignNewNamespaces />
    <copy target="g10" assignNames="g26" assignNewNamespaces />
    <copy target="g11" assignNames="g27" assignNewNamespaces />
    <copy target="g12" assignNames="g28" assignNewNamespaces />

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
      <p>Credit achieved: <copy prop="creditAchieved" target="p1" assignNames="ca" /></p>
      <p>Value of mathinput: <copy prop="value" target="mi" assignNames="m" /></p>
      <p>Other answer credit achieved: <copy prop="creditAchieved" target="p2/_answer1" assignNames="cao" /></p>
      </problem>

    <problem name="p2" newNamespace>
      <answer>z</answer>
      <p>Credit achieved: <copy prop="creditAchieved" target="../p2" assignNames="ca" /></p>
      <p>Value of mathinput: <copy prop="value" target="../mi" assignNames="m" /></p>
      <p>Other answer credit achieved: <copy prop="creditAchieved" target="../_answer2" assignNames="cao" /></p>
    </problem>

    <copy target="p1" assignNames="p3" assignNewNamespaces />

    <copy target="p2" assignNames="p4" assignNewNamespaces />

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

  it('copyTarget with newNamespace and references to parent', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <mathinput name="mi" prefill="p" />
    <answer>x</answer>

    <problem name="p1">
      <answer>y</answer>
      <p>Credit achieved: <copy prop="creditAchieved" target="p1" assignNames="ca" /></p>
      <p>Value of mathinput: <copy prop="value" target="mi" assignNames="m" /></p>
      <p>Other answer credit achieved: <copy prop="creditAchieved" target="p2/_answer1" assignNames="cao" /></p>
    </problem>

    <problem name="p2" newNamespace>
      <answer>z</answer>
      <p>Credit achieved: <copy prop="creditAchieved" target="../p2" assignNames="ca" /></p>
      <p>Value of mathinput: <copy prop="value" target="../mi" assignNames="m" /></p>
      <p>Other answer credit achieved: <copy prop="creditAchieved" target="../_answer2" assignNames="cao" /></p>
    </problem>

    <problem copyTarget="p1" name="p3" newNamespace />

    <problem copyTarget="p2" name="p4" newNamespace />

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

  it('copyTarget of copy and map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <mathinput name="n" prefill="2" />

    <p>Value: <copy target="n" prop="value" name="cp" assignNames="n2" /></p>
    <p>Value 2: <copy copytarget="cp" name="cp2" assignNames="n3" /></p>

    <map name="map1" assignNames="(p1) (p2) (p3)">
      <template><p newNamespace>Hello <number copyTarget="v" />!  <mathinput name="x" /> <math copyTarget="x" prop="value" /></p></template>
      <sources alias="v"><sequence from="1" to="$n" /></sources>
    </map>

    <map copyTarget="map1" name="map2" assignNames="(p1a) (p2a) (p3a)" />

    <map copyTarget="map2" name="map3" assignNames="(p1b) (p2b) (p3b)" />


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


});