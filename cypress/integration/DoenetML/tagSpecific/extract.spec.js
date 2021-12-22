import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Extract Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('extract copies properties', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract prop="latex"><math modifyIndirectly="false">x</math></extract>
    <extract prop="latex"><math modifyIndirectly="true">x</math></extract>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(await components['/_math2'].stateValues.modifyIndirectly).eq(true);
      expect(await components['/_extract1'].replacements[0].stateValues.modifyIndirectly).eq(false);
      expect(await components['/_extract2'].replacements[0].stateValues.modifyIndirectly).eq(true);
    })

  });

  it('extract can overwrite basecomponent properties', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract modifyIndirectly="true" prop="latex"><math modifyIndirectly="false">x</math></extract>
    <extract modifyIndirectly="false" prop="latex"><math modifyIndirectly="true">x</math></extract>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`check properties`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/_math1'].stateValues.modifyIndirectly).eq(false);
      expect(await components['/_math2'].stateValues.modifyIndirectly).eq(true);
      expect(await components['/_extract1'].replacements[0].stateValues.modifyIndirectly).eq(true);
      expect(await components['/_extract2'].replacements[0].stateValues.modifyIndirectly).eq(false);
    })

  });

  it('extract multiple tags', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract prop="y">
      <point>(1,2)</point>
      <point>(3,4)</point>
      <point>(5,6)</point>
    </extract>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let math1 = components['/_extract1'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_extract1'].replacements[1];
      let math2Anchor = cesc('#' + math2.componentName);
      let math3 = components['/_extract1'].replacements[2];
      let math3Anchor = cesc('#' + math3.componentName);


      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get(math3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      })

      cy.log(`check properties`);
      cy.window().then((win) => {
        expect(math1.stateValues.value.tree).eq(2);
        expect(math2.stateValues.value.tree).eq(4);
        expect(math3.stateValues.value.tree).eq(6);

      })
    })
  });

  it('extract still updatable', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <copy name="copy" target="original" />
      <point name="transformed">
        (<copy prop="y" target="copy2" />,
        <extract prop="x1"><copy name="copy2" target="copy" /></extract>)
      </point>
    </graph>

    <graph>
    <point name="original">(1,2)</point>
    </graph>
    <copy prop="x" target="original" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log(`initial position`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components['/original'].stateValues.xs[0].tree).eq(1);
      expect(await components['/original'].stateValues.xs[1].tree).eq(2);
      expect(await components['/copy'].replacements[0].stateValues.xs[0].tree).eq(1);
      expect(await components['/copy'].replacements[0].stateValues.xs[1].tree).eq(2);
      expect(await components['/transformed'].stateValues.xs[0].tree).eq(2);
      expect(await components['/transformed'].stateValues.xs[1].tree).eq(1);
    })

    cy.log(`move original point`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/original'].movePoint({ x: -3, y: 5 });
      expect(await components['/original'].stateValues.xs[0].tree).eq(-3);
      expect(await components['/original'].stateValues.xs[1].tree).eq(5);
      expect(await components['/copy'].replacements[0].stateValues.xs[0].tree).eq(-3);
      expect(await components['/copy'].replacements[0].stateValues.xs[1].tree).eq(5);
      expect(await components['/transformed'].stateValues.xs[0].tree).eq(5);
      expect(await components['/transformed'].stateValues.xs[1].tree).eq(-3);
    })

    cy.log(`move copy point`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/copy'].replacements[0].movePoint({ x: 6, y: -9 });
      expect(await components['/original'].stateValues.xs[0].tree).eq(6);
      expect(await components['/original'].stateValues.xs[1].tree).eq(-9);
      expect(await components['/copy'].replacements[0].stateValues.xs[0].tree).eq(6);
      expect(await components['/copy'].replacements[0].stateValues.xs[1].tree).eq(-9);
      expect(await components['/transformed'].stateValues.xs[0].tree).eq(-9);
      expect(await components['/transformed'].stateValues.xs[1].tree).eq(6);
    })

    cy.log(`move transformed point`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/transformed'].movePoint({ x: -1, y: -7 });
      expect(await components['/original'].stateValues.xs[0].tree).eq(-7);
      expect(await components['/original'].stateValues.xs[1].tree).eq(-1);
      expect(await components['/copy'].replacements[0].stateValues.xs[0].tree).eq(-7);
      expect(await components['/copy'].replacements[0].stateValues.xs[1].tree).eq(-1);
      expect(await components['/transformed'].stateValues.xs[0].tree).eq(-1);
      expect(await components['/transformed'].stateValues.xs[1].tree).eq(-7);
    })

  });

  it('copy prop of extract', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract prop="center">
    <circle through="$_point1 $_point2" />
    </extract>
    
    <copy name="x1" prop="x" target="_extract1" />,
    <copy name="y1" prop="y" target="_extract1" />
    
    <graph>
    <point>(1,2)</point>
    <point>(5,6)</point>
    <copy name="copiedextract" target="_extract1" />
    </graph>

    <copy name="x2" prop="x" target="copiedextract" />,
    <copy name="y2" prop="y" target="copiedextract" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(await components["/x1"].replacements[0].stateValues.value.tree).eq(3);
      expect(await components["/y1"].replacements[0].stateValues.value.tree).eq(4);
      expect(await components["/x2"].replacements[0].stateValues.value.tree).eq(3);
      expect(await components["/y2"].replacements[0].stateValues.value.tree).eq(4);
    })

    cy.log('move extracted center');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await await components['/copiedextract'].replacements[0].movePoint({ x: -2, y: -5 });
      expect(await await components["/x1"].replacements[0].stateValues.value.tree).closeTo(-2, 1E-12);
      expect(await await components["/y1"].replacements[0].stateValues.value.tree).closeTo(-5, 1E-12);
      expect(await await components["/x2"].replacements[0].stateValues.value.tree).closeTo(-2, 1E-12);
      expect(await await components["/y2"].replacements[0].stateValues.value.tree).closeTo(-5, 1E-12);
      expect(await await components['/_point1'].stateValues.xs[0].tree).closeTo(-4, 1E-12);
      expect(await await components['/_point1'].stateValues.xs[1].tree).closeTo(-7, 1E-12);
      expect(await await components['/_point2'].stateValues.xs[0].tree).closeTo(0, 1E-12);
      expect(await await components['/_point2'].stateValues.xs[1].tree).closeTo(-3, 1E-12);
    })

    cy.log('move points 1 and 2');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 8, y: -1 });
      await components['/_point2'].movePoint({ x: -6, y: -7 });
      expect(await components["/x1"].replacements[0].stateValues.value.tree).closeTo(1, 1E-12);
      expect(await components["/y1"].replacements[0].stateValues.value.tree).closeTo(-4, 1E-12);
      expect(await components["/x2"].replacements[0].stateValues.value.tree).closeTo(1, 1E-12);
      expect(await components["/y2"].replacements[0].stateValues.value.tree).closeTo(-4, 1E-12);
    })


  });

  it('extract from sequence', () => {
    cy.window().then((win) => {
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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls([]);
      expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls([]);
      expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls([]);
      expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value)).eqls([]);
      expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value)).eqls([]);
      expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value)).eqls([]);
    })

    cy.log('set to 3')
    cy.get('#\\/n textarea').type(`3{enter}`, { force: true });
    cy.get('#\\/_p1').should('have.text', '1, 2, 3');
    cy.get('#\\/_p2').should('have.text', '1, 2, 3');
    cy.get('#\\/_p3').should('have.text', '1, 2, 3');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text"]);
      expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text"]);
      expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text"]);
      expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2", "3"]);
      expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2", "3"]);
      expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2", "3"]);
    })

    cy.log('increase to 4')
    cy.get('#\\/n textarea').type(`{end}{backspace}4{enter}`, { force: true });
    cy.get('#\\/_p1').should('have.text', '1, 2, 3, 4');
    cy.get('#\\/_p2').should('have.text', '1, 2, 3, 4');
    cy.get('#\\/_p3').should('have.text', '1, 2, 3, 4');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text"]);
      expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text"]);
      expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text"]);
      expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2", "3", "4"]);
      expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2", "3", "4"]);
      expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2", "3", "4"]);
    })



    cy.log('decrease to 2')
    cy.get('#\\/n textarea').type(`{end}{backspace}2{enter}`, { force: true });
    cy.get('#\\/_p1').should('have.text', '1, 2');
    cy.get('#\\/_p2').should('have.text', '1, 2');
    cy.get('#\\/_p3').should('have.text', '1, 2');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["text", "text"]);
      expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["text", "text"]);
      expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["text", "text"]);
      expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2"]);
      expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2"]);
      expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2"]);
    })

    cy.log('increase to 5')
    cy.get('#\\/n textarea').type(`{end}{backspace}5{enter}`, { force: true });
    cy.get('#\\/_p1').should('have.text', '1, 2, 3, 4, 5');
    cy.get('#\\/_p2').should('have.text', '1, 2, 3, 4, 5');
    cy.get('#\\/_p3').should('have.text', '1, 2, 3, 4, 5');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text", "text"]);
      expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text", "text"]);
      expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["text", "text", "text", "text", "text"]);
      expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2", "3", "4", "5"]);
      expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2", "3", "4", "5"]);
      expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value)).eqls(["1", "2", "3", "4", "5"]);
    })


  });

  it('extract from map', () => {
    cy.window().then((win) => {
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
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let aslist1 = components["/_p1"].activeChildren[0];
      let aslist2 = components["/_p2"].activeChildren[0];
      let aslist3 = components["/_p3"].activeChildren[0];
      cy.get('#\\/_p1').should('have.text', '');
      cy.get('#\\/_p2').should('have.text', '');
      cy.get('#\\/_p3').should('have.text', '');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls([]);
        expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls([]);
        expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls([]);
        expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value)).eqls([]);
        expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value)).eqls([]);
        expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value)).eqls([]);
      })

      cy.log('set n to 3')
      cy.get('#\\/n textarea').type(`3{enter}`, { force: true });
      cy.window().then((win) => {
        for (let i = 0; i < 3; i++) {
          cy.get(cesc(`#${aslist1.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`＿+${i + 1}`)
          });
          cy.get(cesc(`#${aslist2.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`＿+${i + 1}`)
          });
          cy.get(cesc(`#${aslist3.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`＿+${i + 1}`)
          });
        }

        // Note: put in another .then so test execute in order they appear here
        // (so easier to find test results)
        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);
          expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
          expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["＿ + 1", "＿ + 2", "＿ + 3"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["＿ + 1", "＿ + 2", "＿ + 3"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value.toString())).eqls(["＿ + 1", "＿ + 2", "＿ + 3"]);
        })
      })

      cy.log('set m to 7')
      cy.get('#\\/m textarea').type(`7{enter}`, { force: true });
      cy.window().then((win) => {
        for (let i = 0; i < 3; i++) {
          cy.get(cesc(`#${aslist1.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i + 8}`)
          });
          cy.get(cesc(`#${aslist2.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i + 8}`)
          });
          cy.get(cesc(`#${aslist3.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i + 8}`)
          });
        }

        // Note: put in another .then so test execute in order they appear here
        // (so easier to find test results)
        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);
          expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math"]);
          expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["8", "9", "10"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["8", "9", "10"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value.toString())).eqls(["8", "9", "10"]);
        })
      })

      cy.log('increase n to 4')
      cy.get('#\\/n textarea').type(`{end}{backspace}4{enter}`, { force: true });
      cy.window().then((win) => {
        for (let i = 0; i < 4; i++) {
          cy.get(cesc(`#${aslist1.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i + 8}`)
          });
          cy.get(cesc(`#${aslist2.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i + 8}`)
          });
          cy.get(cesc(`#${aslist3.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i + 8}`)
          });
        }

        // Note: put in another .then so test execute in order they appear here
        // (so easier to find test results)
        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);
          expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
          expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["8", "9", "10", "11"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["8", "9", "10", "11"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value.toString())).eqls(["8", "9", "10", "11"]);
        })
      })

      cy.log('change m to q')
      cy.get('#\\/m textarea').type(`{end}{backspace}q{enter}`, { force: true });
      cy.window().then((win) => {
        for (let i = 0; i < 4; i++) {
          cy.get(cesc(`#${aslist1.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`q+${i + 1}`)
          });
          cy.get(cesc(`#${aslist2.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`q+${i + 1}`)
          });
          cy.get(cesc(`#${aslist3.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`q+${i + 1}`)
          });
        }

        // Note: put in another .then so test execute in order they appear here
        // (so easier to find test results)
        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);
          expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math"]);
          expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["q + 1", "q + 2", "q + 3", "q + 4"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["q + 1", "q + 2", "q + 3", "q + 4"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value.toString())).eqls(["q + 1", "q + 2", "q + 3", "q + 4"]);
        })
      })



      cy.log('decrease n to 2')
      cy.get('#\\/n textarea').type(`{end}{backspace}2{enter}`, { force: true });
      cy.window().then((win) => {
        for (let i = 0; i < 2; i++) {
          cy.get(cesc(`#${aslist1.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`q+${i + 1}`)
          });
          cy.get(cesc(`#${aslist2.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`q+${i + 1}`)
          });
          cy.get(cesc(`#${aslist3.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`q+${i + 1}`)
          });
        }

        // Note: put in another .then so test execute in order they appear here
        // (so easier to find test results)
        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);
          expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
          expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["q + 1", "q + 2"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["q + 1", "q + 2"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value.toString())).eqls(["q + 1", "q + 2"]);
        })
      })


      cy.log('set m to -1')
      cy.get('#\\/m textarea').type(`{end}{backspace}-1{enter}`, { force: true });
      cy.window().then((win) => {
        for (let i = 0; i < 2; i++) {
          cy.get(cesc(`#${aslist1.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i}`)
          });
          cy.get(cesc(`#${aslist2.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i}`)
          });
          cy.get(cesc(`#${aslist3.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i}`)
          });
        }

        // Note: put in another .then so test execute in order they appear here
        // (so easier to find test results)
        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);
          expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["math", "math"]);
          expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["0", "1"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["0", "1"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value.toString())).eqls(["0", "1"]);
        })
      })


      cy.log('increase n to 5')
      cy.get('#\\/n textarea').type(`{end}{backspace}5{enter}`, { force: true });
      cy.window().then((win) => {
        for (let i = 0; i < 5; i++) {
          cy.get(cesc(`#${aslist1.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i}`)
          });
          cy.get(cesc(`#${aslist2.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i}`)
          });
          cy.get(cesc(`#${aslist3.activeChildren[i].componentName}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i}`)
          });
        }

        // Note: put in another .then so test execute in order they appear here
        // (so easier to find test results)
        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);
          expect(components["/_aslist1"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math", "math"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math", "math"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.componentType)).eqls(["math", "math", "math", "math", "math"]);
          expect(components["/_aslist1"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["0", "1", "2", "3", "4"]);
          expect(components["/_aslist2"].activeChildren.map(x => x.stateValues.value.toString())).eqls(["0", "1", "2", "3", "4"]);
          expect(components["/_p3"].activeChildren[0].activeChildren.map(x => x.stateValues.value.toString())).eqls(["0", "1", "2", "3", "4"]);
        })
      })

    })
  });

  // not sure if this is desired, but it is current behavior
  it('extract ignores hide', () => {
    cy.window().then((win) => {
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
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" label="Hide first extract" />
    <booleaninput name='h2' prefill="true" label="Hide second extract" />

    <p name="e1">extract 1: <extract hide="$h1" prop="value" ><text>hello</text></extract></p>
    <p name="e2">extract 2: <extract hide="$h2" prop="value" ><text>hello</text></extract></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/e1').should('have.text', 'extract 1: hello')
    cy.get('#\\/e2').should('have.text', 'extract 2: ')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/e1').should('have.text', 'extract 1: ')
    cy.get('#\\/e2').should('have.text', 'extract 2: hello')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/e1').should('have.text', 'extract 1: hello')
    cy.get('#\\/e2').should('have.text', 'extract 2: ')

  })


});