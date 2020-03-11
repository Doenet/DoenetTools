describe('Extract Tag Tests',function() {

  beforeEach(() => {
    cy.visit('/test')
  })
      
  it('extract copies properties',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <extract prop="latex"><math modifybyreference="false">x</math></extract>
    <extract prop="latex"><math modifybyreference="true">x</math></extract>
    `},"*");
    });

    cy.get('#__text2').should('have.text', 'x') //wait for window to load

    cy.log(`check properties`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_math1'].state.modifybyreference).eq(false);
      expect(components['/_math2'].state.modifybyreference).eq(true);
      expect(components['/_extract1'].replacements[0].state.modifybyreference).eq(false);
      expect(components['/_extract2'].replacements[0].state.modifybyreference).eq(true);
    })

  });

  it('extract can overwrite basecomponent properties',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <extract modifybyreference="true" prop="latex"><math modifybyreference="false">x</math></extract>
    <extract modifybyreference="false" prop="latex"><math modifybyreference="true">x</math></extract>
    `},"*");
    });

    cy.get('#__text2').should('have.text', 'x') //wait for window to load


    cy.log(`check properties`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_math1'].state.modifybyreference).eq(false);
      expect(components['/_math2'].state.modifybyreference).eq(true);
      expect(components['/_extract1'].replacements[0].state.modifybyreference).eq(true);
      expect(components['/_extract2'].replacements[0].state.modifybyreference).eq(false);
    })

  });

  it('extract multiple tags',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <extract prop="y">
      <point>(1,2)</point>
      <point>(3,4)</point>
      <point>(5,6)</point>
    </extract>
    `},"*");
    });

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#__math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#__math3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    })

    cy.log(`check properties`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components.__math1.state.value.tree).eq(2);
      expect(components.__math2.state.value.tree).eq(4);
      expect(components.__math3.state.value.tree).eq(6);
      
    })
  });

  it('extract still updatable',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <graph>
      <ref name="copy">original</ref>
      <point name="transformed">(<ref prop="y">copy2</ref>, <extract prop="x1"><ref name="copy2">copy</ref></extract>)</point>
    </graph>

    <graph>
    <point name="original">(1,2)</point>
    </graph>
    <ref prop="x">original</ref>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.log(`initial position`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/original'].state.xs[0].tree).eq(1);
      expect(components['/original'].state.xs[1].tree).eq(2);
      expect(components['/copy'].replacements[0].state.xs[0].tree).eq(1);
      expect(components['/copy'].replacements[0].state.xs[1].tree).eq(2);
      expect(components['/transformed'].state.xs[0].tree).eq(2);
      expect(components['/transformed'].state.xs[1].tree).eq(1);
    })

    cy.log(`move original point`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/original'].movePoint({x: -3, y: 5});
      expect(components['/original'].state.xs[0].tree).eq(-3);
      expect(components['/original'].state.xs[1].tree).eq(5);
      expect(components['/copy'].replacements[0].state.xs[0].tree).eq(-3);
      expect(components['/copy'].replacements[0].state.xs[1].tree).eq(5);
      expect(components['/transformed'].state.xs[0].tree).eq(5);
      expect(components['/transformed'].state.xs[1].tree).eq(-3);
    })

    cy.log(`move copy point`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/copy'].replacements[0].movePoint({x: 6, y: -9});
      expect(components['/original'].state.xs[0].tree).eq(6);
      expect(components['/original'].state.xs[1].tree).eq(-9);
      expect(components['/copy'].replacements[0].state.xs[0].tree).eq(6);
      expect(components['/copy'].replacements[0].state.xs[1].tree).eq(-9);
      expect(components['/transformed'].state.xs[0].tree).eq(-9);
      expect(components['/transformed'].state.xs[1].tree).eq(6);
    })

    cy.log(`move transformed point`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/transformed'].movePoint({x: -1, y: -7});
      expect(components['/original'].state.xs[0].tree).eq(-7);
      expect(components['/original'].state.xs[1].tree).eq(-1);
      expect(components['/copy'].replacements[0].state.xs[0].tree).eq(-7);
      expect(components['/copy'].replacements[0].state.xs[1].tree).eq(-1);
      expect(components['/transformed'].state.xs[0].tree).eq(-1);
      expect(components['/transformed'].state.xs[1].tree).eq(-7);
    })

  });

  it('ref prop of extract',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <extract prop="center">
    <circle>
      <through>
        <ref>_point1</ref>
        <ref>_point2</ref>
      </through>
    </circle>
    </extract>
    
    <ref prop="x">_extract1</ref>,
    <ref prop="y">_extract1</ref>
    
    <graph>
    <point>(1,2)</point>
    <point>(5,6)</point>
    <ref name="reffedextract">_extract1</ref>
    </graph>

    <ref prop="x">reffedextract</ref>,
    <ref prop="y">reffedextract</ref>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__math4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components.__math1.state.value.tree).eq(3);
      expect(components.__math2.state.value.tree).eq(4);
      expect(components.__math3.state.value.tree).eq(3);
      expect(components.__math4.state.value.tree).eq(4);
    })

    cy.log('move extracted center');
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/reffedextract'].replacements[0].movePoint({x: -2, y: -5});
      expect(components.__math1.state.value.tree).closeTo(-2, 1E-12);
      expect(components.__math2.state.value.tree).closeTo(-5, 1E-12);
      expect(components.__math3.state.value.tree).closeTo(-2, 1E-12);
      expect(components.__math4.state.value.tree).closeTo(-5, 1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(-4, 1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(-7, 1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(0, 1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(-3, 1E-12);
    })

    cy.log('move points 1 and 2');
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: 8, y: -1});
      components['/_point2'].movePoint({x: -6, y: -7});
      expect(components.__math1.state.value.tree).closeTo(1, 1E-12);
      expect(components.__math2.state.value.tree).closeTo(-4, 1E-12);
      expect(components.__math3.state.value.tree).closeTo(1, 1E-12);
      expect(components.__math4.state.value.tree).closeTo(-4, 1E-12);
    })


  });

});