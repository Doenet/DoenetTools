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

describe('Extract Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('extract copies properties', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract prop="latex" assignNames="e1"><math modifyIndirectly="false">x</math></extract>
    <extract prop="latex" assignNames="e2"><math modifyIndirectly="true">x</math></extract>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/_math2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/e1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/e2'].stateValues.modifyIndirectly).eq(true);
    })

  });

  it('extract can overwrite basecomponent properties', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract modifyIndirectly="true" prop="latex" assignNames="e1"><math modifyIndirectly="false">x</math></extract>
    <extract modifyIndirectly="false" prop="latex" assignNames="e2"><math modifyIndirectly="true">x</math></extract>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(stateVariables['/_math2'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/e1'].stateValues.modifyIndirectly).eq(true);
      expect(stateVariables['/e2'].stateValues.modifyIndirectly).eq(false);
    })

  });

  it('extract multiple tags', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract prop="y" assignNames="e1 e2 e3">
      <point>(1,2)</point>
      <point>(3,4)</point>
      <point>(5,6)</point>
    </extract>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get("#\\/e1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get("#\\/e2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get("#\\/e3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    })

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/e1"].stateValues.value).eq(2);
      expect(stateVariables["/e2"].stateValues.value).eq(4);
      expect(stateVariables["/e3"].stateValues.value).eq(6);

    })
  });

  it('extract still updatable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <copy assignNames="copy" target="original" />
      <point name="transformed">
        (<copy prop="y" target="copy2" />,
        <extract prop="x1"><copy name="copy2" target="copy" /></extract>)
      </point>
    </graph>

    <graph>
    <point name="original">(1,2)</point>
    </graph>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log(`initial position`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/original'].stateValues.xs[0]).eq(1);
      expect(stateVariables['/original'].stateValues.xs[1]).eq(2);
      expect(stateVariables['/copy'].stateValues.xs[0]).eq(1);
      expect(stateVariables['/copy'].stateValues.xs[1]).eq(2);
      expect(stateVariables['/transformed'].stateValues.xs[0]).eq(2);
      expect(stateVariables['/transformed'].stateValues.xs[1]).eq(1);
    })

    cy.log(`move original point`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/original",
        args: { x: -3, y: 5 }
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/original'].stateValues.xs[0]).eq(-3);
      expect(stateVariables['/original'].stateValues.xs[1]).eq(5);
      expect(stateVariables['/copy'].stateValues.xs[0]).eq(-3);
      expect(stateVariables['/copy'].stateValues.xs[1]).eq(5);
      expect(stateVariables['/transformed'].stateValues.xs[0]).eq(5);
      expect(stateVariables['/transformed'].stateValues.xs[1]).eq(-3);
    })

    cy.log(`move copy point`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/copy",
        args: { x: 6, y: -9 }
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/original'].stateValues.xs[0]).eq(6);
      expect(stateVariables['/original'].stateValues.xs[1]).eq(-9);
      expect(stateVariables['/copy'].stateValues.xs[0]).eq(6);
      expect(stateVariables['/copy'].stateValues.xs[1]).eq(-9);
      expect(stateVariables['/transformed'].stateValues.xs[0]).eq(-9);
      expect(stateVariables['/transformed'].stateValues.xs[1]).eq(6);
    })

    cy.log(`move transformed point`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/transformed",
        args: { x: -1, y: -7 }
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/original'].stateValues.xs[0]).eq(-7);
      expect(stateVariables['/original'].stateValues.xs[1]).eq(-1);
      expect(stateVariables['/copy'].stateValues.xs[0]).eq(-7);
      expect(stateVariables['/copy'].stateValues.xs[1]).eq(-1);
      expect(stateVariables['/transformed'].stateValues.xs[0]).eq(-1);
      expect(stateVariables['/transformed'].stateValues.xs[1]).eq(-7);
    })

  });

  it('copy prop of extract', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract prop="center">
    <circle through="$_point1 $_point2" />
    </extract>
    
    <copy assignNames="x1" prop="x" target="_extract1" />,
    <copy assignNames="y1" prop="y" target="_extract1" />
    
    <graph>
    <point>(1,2)</point>
    <point>(5,6)</point>
    <copy assignNames="copiedextract" target="_extract1" />
    </graph>

    <copy assignNames="x2" prop="x" target="copiedextract" />,
    <copy assignNames="y2" prop="y" target="copiedextract" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).eq(3);
      expect(stateVariables["/y1"].stateValues.value).eq(4);
      expect(stateVariables["/x2"].stateValues.value).eq(3);
      expect(stateVariables["/y2"].stateValues.value).eq(4);
    })

    cy.log('move extracted center');
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/copiedextract",
        args: { x: -2, y: -5 }
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).closeTo(-2, 1E-12);
      expect(stateVariables["/y1"].stateValues.value).closeTo(-5, 1E-12);
      expect(stateVariables["/x2"].stateValues.value).closeTo(-2, 1E-12);
      expect(stateVariables["/y2"].stateValues.value).closeTo(-5, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[0]).closeTo(-4, 1E-12);
      expect(stateVariables['/_point1'].stateValues.xs[1]).closeTo(-7, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[0]).closeTo(0, 1E-12);
      expect(stateVariables['/_point2'].stateValues.xs[1]).closeTo(-3, 1E-12);
    })

    cy.log('move points 1 and 2');
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: -1 }
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -6, y: -7 }
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/x1"].stateValues.value).closeTo(1, 1E-12);
      expect(stateVariables["/y1"].stateValues.value).closeTo(-4, 1E-12);
      expect(stateVariables["/x2"].stateValues.value).closeTo(1, 1E-12);
      expect(stateVariables["/y2"].stateValues.value).closeTo(-4, 1E-12);
    })


  });

  it('extract from sequence', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n"/>

    <p><aslist>
    <extract prop="text">
      <sequence length="$n" />
    </extract>
    </aslist></p>
    
    <p><aslist><copy target="_extract1" /></aslist></p>
    
    <p><copy target="_aslist2" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_p1').should('have.text', '');
    cy.get('#\\/_p2').should('have.text', '');
    cy.get('#\\/_p3').should('have.text', '');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls([]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls([]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls([]);
      expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([]);
    })

    cy.log('set to 3')
    cy.get('#\\/n textarea').type(`3{enter}`, { force: true });
    cy.get('#\\/_p1').should('have.text', '1, 2, 3');
    cy.get('#\\/_p2').should('have.text', '1, 2, 3');
    cy.get('#\\/_p3').should('have.text', '1, 2, 3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text"]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text"]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text"]);
      expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2", "3"]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2", "3"]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2", "3"]);
    })

    cy.log('increase to 4')
    cy.get('#\\/n textarea').type(`{end}{backspace}4{enter}`, { force: true });
    cy.get('#\\/_p1').should('have.text', '1, 2, 3, 4');
    cy.get('#\\/_p2').should('have.text', '1, 2, 3, 4');
    cy.get('#\\/_p3').should('have.text', '1, 2, 3, 4');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text"]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text"]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text"]);
      expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2", "3", "4"]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2", "3", "4"]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2", "3", "4"]);
    })



    cy.log('decrease to 2')
    cy.get('#\\/n textarea').type(`{end}{backspace}2{enter}`, { force: true });
    cy.get('#\\/_p1').should('have.text', '1, 2');
    cy.get('#\\/_p2').should('have.text', '1, 2');
    cy.get('#\\/_p3').should('have.text', '1, 2');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["text", "text"]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["text", "text"]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["text", "text"]);
      expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2"]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2"]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2"]);
    })

    cy.log('increase to 5')
    cy.get('#\\/n textarea').type(`{end}{backspace}5{enter}`, { force: true });
    cy.get('#\\/_p1').should('have.text', '1, 2, 3, 4, 5');
    cy.get('#\\/_p2').should('have.text', '1, 2, 3, 4, 5');
    cy.get('#\\/_p3').should('have.text', '1, 2, 3, 4, 5');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text", "text"]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text", "text"]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text", "text"]);
      expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2", "3", "4", "5"]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2", "3", "4", "5"]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls(["1", "2", "3", "4", "5"]);
    })


  });

  it('extract from map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <mathinput name="m" />
    
    <p><aslist>
    <extract prop="x">
      <map>
        <template newnamespace><point>($a+<copy prop="value" target="../m" />,0)</point></template>
        <sources alias="a">
          <sequence length="$n" />
        </sources>
      </map>
    </extract>
    </aslist></p>
    
    <p><aslist><copy target="_extract1" /></aslist></p>
    
    <p><copy target="_aslist2" /></p>

    <p><copy prop="value" target="n" assignNames="n2" />
    <copy prop="value" target="m" assignNames="m2" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_p1').should('have.text', '');
    cy.get('#\\/_p2').should('have.text', '');
    cy.get('#\\/_p3').should('have.text', '');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls([]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls([]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls([]);
      expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([]);
      expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([]);
      expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([]);
    })

    cy.log('set n to 3')
    cy.get('#\\/n textarea').type(`3{enter}`, { force: true });
    cy.get('#\\/n2').should('contain.text', '3')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let aslist1 = stateVariables["/_p1"].activeChildren[0];
      let aslist2 = stateVariables["/_p2"].activeChildren[0];
      let aslist3 = stateVariables["/_p3"].activeChildren[0];
      for (let i = 0; i < 3; i++) {
        cy.get(cesc(`#${stateVariables[aslist1.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i + 1}+＿`)
        });
        cy.get(cesc(`#${stateVariables[aslist2.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i + 1}+＿`)
        });
        cy.get(cesc(`#${stateVariables[aslist3.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i + 1}+＿`)
        });
      }

      // Note: put in another .then so test execute in order they appear here
      // (so easier to find test results)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
        expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([["+", 1, "＿"], ["+", 2, "＿"], ["+", 3, "＿"]]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([["+", 1, "＿"], ["+", 2, "＿"], ["+", 3, "＿"]]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([["+", 1, "＿"], ["+", 2, "＿"], ["+", 3, "＿"]]);
      })
    })

    cy.log('set m to 7')
    cy.get('#\\/m textarea').type(`7{enter}`, { force: true });
    cy.get('#\\/m2').should('contain.text', '7')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let aslist1 = stateVariables["/_p1"].activeChildren[0];
      let aslist2 = stateVariables["/_p2"].activeChildren[0];
      let aslist3 = stateVariables["/_p3"].activeChildren[0];
      for (let i = 0; i < 3; i++) {
        cy.get(cesc(`#${stateVariables[aslist1.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i + 8}`)
        });
        cy.get(cesc(`#${stateVariables[aslist2.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i + 8}`)
        });
        cy.get(cesc(`#${stateVariables[aslist3.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i + 8}`)
        });
      }

      // Note: put in another .then so test execute in order they appear here
      // (so easier to find test results)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
        expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([8, 9, 10]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([8, 9, 10]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([8, 9, 10]);
      })
    })

    cy.log('increase n to 4')
    cy.get('#\\/n textarea').type(`{end}{backspace}4{enter}`, { force: true });
    cy.get('#\\/n2').should('contain.text', '4')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let aslist1 = stateVariables["/_p1"].activeChildren[0];
      let aslist2 = stateVariables["/_p2"].activeChildren[0];
      let aslist3 = stateVariables["/_p3"].activeChildren[0];
      for (let i = 0; i < 4; i++) {
        cy.get(cesc(`#${stateVariables[aslist1.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i + 8}`)
        });
        cy.get(cesc(`#${stateVariables[aslist2.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i + 8}`)
        });
        cy.get(cesc(`#${stateVariables[aslist3.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i + 8}`)
        });
      }

      // Note: put in another .then so test execute in order they appear here
      // (so easier to find test results)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
        expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([8, 9, 10, 11]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([8, 9, 10, 11]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([8, 9, 10, 11]);
      })
    })

    cy.log('change m to q')
    cy.get('#\\/m textarea').type(`{end}{backspace}q{enter}`, { force: true });
    cy.get('#\\/m2').should('contain.text', 'q')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let aslist1 = stateVariables["/_p1"].activeChildren[0];
      let aslist2 = stateVariables["/_p2"].activeChildren[0];
      let aslist3 = stateVariables["/_p3"].activeChildren[0];
      for (let i = 0; i < 4; i++) {
        cy.get(cesc(`#${stateVariables[aslist1.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`q+${i + 1}`)
        });
        cy.get(cesc(`#${stateVariables[aslist2.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`q+${i + 1}`)
        });
        cy.get(cesc(`#${stateVariables[aslist3.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`q+${i + 1}`)
        });
      }

      // Note: put in another .then so test execute in order they appear here
      // (so easier to find test results)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
        expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([["+", "q", 1], ["+", "q", 2], ["+", "q", 3], ["+", "q", 4]]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([["+", "q", 1], ["+", "q", 2], ["+", "q", 3], ["+", "q", 4]]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([["+", "q", 1], ["+", "q", 2], ["+", "q", 3], ["+", "q", 4]]);
      })
    })



    cy.log('decrease n to 2')
    cy.get('#\\/n textarea').type(`{end}{backspace}2{enter}`, { force: true });
    cy.get('#\\/n2').should('contain.text', '2')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let aslist1 = stateVariables["/_p1"].activeChildren[0];
      let aslist2 = stateVariables["/_p2"].activeChildren[0];
      let aslist3 = stateVariables["/_p3"].activeChildren[0];
      for (let i = 0; i < 2; i++) {
        cy.get(cesc(`#${stateVariables[aslist1.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`q+${i + 1}`)
        });
        cy.get(cesc(`#${stateVariables[aslist2.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`q+${i + 1}`)
        });
        cy.get(cesc(`#${stateVariables[aslist3.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`q+${i + 1}`)
        });
      }

      // Note: put in another .then so test execute in order they appear here
      // (so easier to find test results)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
        expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([["+", "q", 1], ["+", "q", 2]]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([["+", "q", 1], ["+", "q", 2]]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([["+", "q", 1], ["+", "q", 2]]);
      })
    })


    cy.log('set m to -1')
    cy.get('#\\/m textarea').type(`{end}{backspace}-1{enter}`, { force: true });
    cy.get('#\\/m2').should('contain.text', '−1')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let aslist1 = stateVariables["/_p1"].activeChildren[0];
      let aslist2 = stateVariables["/_p2"].activeChildren[0];
      let aslist3 = stateVariables["/_p3"].activeChildren[0];
      for (let i = 0; i < 2; i++) {
        cy.get(cesc(`#${stateVariables[aslist1.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i}`)
        });
        cy.get(cesc(`#${stateVariables[aslist2.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i}`)
        });
        cy.get(cesc(`#${stateVariables[aslist3.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i}`)
        });
      }

      // Note: put in another .then so test execute in order they appear here
      // (so easier to find test results)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
        expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([0, 1]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([0, 1]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([0, 1]);
      })
    })


    cy.log('increase n to 5')
    cy.get('#\\/n textarea').type(`{end}{backspace}5{enter}`, { force: true });
    cy.get('#\\/n2').should('contain.text', '5')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let aslist1 = stateVariables["/_p1"].activeChildren[0];
      let aslist2 = stateVariables["/_p2"].activeChildren[0];
      let aslist3 = stateVariables["/_p3"].activeChildren[0];
      for (let i = 0; i < 5; i++) {
        cy.get(cesc(`#${stateVariables[aslist1.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i}`)
        });
        cy.get(cesc(`#${stateVariables[aslist2.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i}`)
        });
        cy.get(cesc(`#${stateVariables[aslist3.componentName].activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`${i}`)
        });
      }

      // Note: put in another .then so test execute in order they appear here
      // (so easier to find test results)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math", "math"]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math", "math"]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math", "math"]);
        expect(stateVariables["/_aslist1"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([0, 1, 2, 3, 4]);
        expect(stateVariables["/_aslist2"].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([0, 1, 2, 3, 4]);
        expect(stateVariables[stateVariables["/_p3"].activeChildren[0].componentName].activeChildren.map(x => stateVariables[x.componentName].stateValues.value)).eqls([0, 1, 2, 3, 4]);
      })
    })


  });

  // not sure if this is desired, but it is current behavior
  it('extract ignores hide', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>See hidden text: <extract prop="value"><text name="hidden" hide>secret</text></extract></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_p1').should('have.text', 'See hidden text: secret');


  });

  it('extracts hide dynamically', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" >
      <label>Hide first extract</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true" >
      <label>Hide second extract</label>
    </booleaninput>

    <p name="e1">extract 1: <extract hide="$h1" prop="value" ><text>hello</text></extract></p>
    <p name="e2">extract 2: <extract hide="$h2" prop="value" ><text>hello</text></extract></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/e1').should('have.text', 'extract 1: hello')
    cy.get('#\\/e2').should('have.text', 'extract 2: ')

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();

    cy.get('#\\/e1').should('have.text', 'extract 1: ')
    cy.get('#\\/e2').should('have.text', 'extract 2: hello')

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();

    cy.get('#\\/e1').should('have.text', 'extract 1: hello')
    cy.get('#\\/e2').should('have.text', 'extract 2: ')

  })

  it('extract componentIndex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>n: <mathinput name="n" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <aslist name="al"><extract prop="x" componentIndex="$n" assignNames="Ax Bx">
      <collect name="col" componentTypes="point" target="g1" />
    </extract></aslist>

    <copy target="al" name="al2" newNamespace />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4;

    cy.get('#\\/Ax .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/Ax .mjx-mrow').should('not.exist');
    cy.get('#\\/Bx .mjx-mrow').should('not.exist');
    cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
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
      expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
      expect(stateVariables['/Ax'].stateValues.value).eq(x1);
      expect(stateVariables["/al2/Ax"].stateValues.value).eq(x1);
      expect(stateVariables['/Bx']).eq(undefined);
      expect(stateVariables["/al2/Bx"]).eq(undefined);
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      x1 = 9, y1 = -5;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: x1, y: y1 }
      })

      cy.get('#\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x1));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
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
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/Ax'].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
        expect(stateVariables['/Bx']).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
      });

    })


    cy.log('move point')
    cy.window().then(async (win) => {
      x2 = 0, y2 = 8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: x2, y: y2 }
      })

      cy.get('#\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/al2\\/Bx .mjx-mrow').should('not.exist');
      cy.get('#\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/al2\\/Ax .mjx-mrow').should('contain.text', nInDOM(x2));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/A'].stateValues.xs).eqls([x1, y1]);
        expect(stateVariables['/B'].stateValues.xs).eqls([x2, y2]);
        expect(stateVariables['/Ax'].stateValues.value).eq(x2);
        expect(stateVariables["/al2/Ax"].stateValues.value).eq(x2);
        expect(stateVariables['/Bx']).eq(undefined);
        expect(stateVariables["/al2/Bx"]).eq(undefined);
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

    
    <p><aslist name="al"><extract prop="xs" componentIndex="$m" propIndex="$n" assignNames="n1 n2 n3 n4">
      <collect name="col" componentTypes="point" target="g1" assignNames="A1 B1" />
    </extract></aslist></p>

    <p><copy target="al" name="al2" newNamespace /></p>

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
    });

  })

  it('copy multidimensional propIndex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>m: <mathinput name="m" /></p>
    <p>n: <mathinput name="n" /></p>

    <graph name="g1">
      <polygon vertices="(1,2) (3,4) (-5,6)" name="pg" />
    </graph>

    
    <p name="p1"><extract prop="vertices" propIndex="$m $n" assignNames="n1 n2">
      $pg
    </extract></p>

    <p copySource="p1" name="p2" newNamespace />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let x1 = 1, y1 = 2, x2 = 3, y2 = 4, x3 = -5, y3 = 6;

    cy.get('#\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/p2\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
      expect(stateVariables['/n1']).eq(undefined);
      expect(stateVariables['/n2']).eq(undefined);
      expect(stateVariables['/p2/n1']).eq(undefined);
      expect(stateVariables['/p2/n2']).eq(undefined);
    });

    cy.log('set second propIndex to 1');

    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/p2\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
      expect(stateVariables['/n1']).eq(undefined);
      expect(stateVariables['/n2']).eq(undefined);
      expect(stateVariables['/p2/n1']).eq(undefined);
      expect(stateVariables['/p2/n2']).eq(undefined);
    });


    cy.log('move first point')
    cy.window().then(async (win) => {
      x1 = 9, y1 = -5;
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/pg",
        args: {
          pointCoords: { 0: [x1, y1] }
        }
      })

      cy.get('#\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
        expect(stateVariables['/n1']).eq(undefined);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/p2/n1']).eq(undefined);
        expect(stateVariables['/p2/n2']).eq(undefined);
      });
    })

    cy.log('set first propIndex to 2');

    cy.get('#\\/m textarea').type("2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/p2/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/p2/n2']).eq(undefined);
      });

    })


    cy.log('move second point')
    cy.window().then(async (win) => {
      x2 = 0, y2 = 8;
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/pg",
        args: {
          pointCoords: { 1: [x2, y2] }
        }
      })

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x2));
      cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
        expect(stateVariables['/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/p2/n1'].stateValues.value).eq(x2);
        expect(stateVariables['/p2/n2']).eq(undefined);
      });

    })


    cy.log('set second propIndex to 2')
    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(y2));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n1 .mjx-mrow').should('contain.text', nInDOM(y2));
      cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
        expect(stateVariables['/n1'].stateValues.value).eq(y2);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/p2/n1'].stateValues.value).eq(y2);
        expect(stateVariables['/p2/n2']).eq(undefined);
      });
    })


    cy.log('set first propIndex to 1')
    cy.get('#\\/m textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(y1));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n1 .mjx-mrow').should('contain.text', nInDOM(y1));
      cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
        expect(stateVariables['/n1'].stateValues.value).eq(y1);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/p2/n1'].stateValues.value).eq(y1);
        expect(stateVariables['/p2/n2']).eq(undefined);
      });
    })



    cy.log('set second propIndex to 3')
    cy.get('#\\/n textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
        expect(stateVariables['/n1']).eq(undefined);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/p2/n1']).eq(undefined);
        expect(stateVariables['/p2/n2']).eq(undefined);
      });
    })


    cy.log('set second propIndex to 1')
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x1));
      cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
        expect(stateVariables['/n1'].stateValues.value).eq(x1);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/p2/n1'].stateValues.value).eq(x1);
        expect(stateVariables['/p2/n2']).eq(undefined);
      });
    })



    cy.log('set first propindex to 4')
    cy.get('#\\/m textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.window().then(async (win) => {

      cy.get('#\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n1 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
        expect(stateVariables['/n1']).eq(undefined);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/p2/n1']).eq(undefined);
        expect(stateVariables['/p2/n2']).eq(undefined);
      });
    })


    cy.log('set first propIndex to 3')
    cy.get('#\\/m textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.window().then(async (win) => {


      cy.get('#\\/n1 .mjx-mrow').should('contain.text', nInDOM(x3));
      cy.get('#\\/n2 .mjx-mrow').should('not.exist');
      cy.get('#\\/p2\\/n1 .mjx-mrow').should('contain.text', nInDOM(x3));
      cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
        expect(stateVariables['/n1'].stateValues.value).eq(x3);
        expect(stateVariables['/n2']).eq(undefined);
        expect(stateVariables['/p2/n1'].stateValues.value).eq(x3);
        expect(stateVariables['/p2/n2']).eq(undefined);
      });
    })

    cy.log('clear second propIndex')
    cy.get('#\\/n textarea').type("{end}{backspace}{enter}", { force: true })

    cy.get('#\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/n2 .mjx-mrow').should('not.exist');
    cy.get('#\\/p2\\/n1 .mjx-mrow').should('not.exist');
    cy.get('#\\/p2\\/n2 .mjx-mrow').should('not.exist');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/pg'].stateValues.vertices).eqls([[x1, y1], [x2, y2], [x3, y3]]);
      expect(stateVariables['/n1']).eq(undefined);
      expect(stateVariables['/n2']).eq(undefined);
      expect(stateVariables['/p2/n1']).eq(undefined);
      expect(stateVariables['/p2/n2']).eq(undefined);
    });

  })

  it('extract is case insensitive', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract prop="LaTeX" assignNames="e1"><math>x</math></extract>
    <extract prop="LATEX" assignNames="e2"><math>y</math></extract>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/e1'].stateValues.value).eq("x");
      expect(stateVariables['/e2'].stateValues.value).eq("y");
    })

  });

  it('createComponentOfType adapts result', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract prop="x" assignNames="e1"><vector>(1/2,2/3)</vector></extract>
    <extract prop="x" assignNames="e2" createComponentOfType="number"><vector>(3/4,4/5)</vector></extract>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get("#\\/e1 .mjx-mrow").should('contain.text', '12')
    cy.get("#\\/e2").should('have.text', '0.75')

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/e1'].stateValues.value).eqls(["/", 1, 2])
      expect(stateVariables['/e2'].stateValues.value).eq(0.75);
    })

  });

});