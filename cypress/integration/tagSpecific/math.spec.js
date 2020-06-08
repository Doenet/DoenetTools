describe('Math Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('1+1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math>1+1</math>
    <math simplify>1+1</math>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+1')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(['+', 1, 1]);
      expect(components['/_math2'].stateValues.value.tree).eq(2);
    })
  })

  it('string math string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math>3<math>x+1</math>+5</math>
    <math simplify>3<math>x+1</math>+5</math>
    `}, "*");

    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3(x+1)+5')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('(x+1)')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(["+", ["*", 3, ["+", "x", 1]], 5])
      expect(components['/_math2'].stateValues.value.tree).eqls(['+', 'x', 1])
      expect(components['/_math3'].stateValues.value.tree).eqls(["+", 5, ["*", 3, ["+", "x", 1]]])

    })
  })

  it('hidden string ref/math string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide>x+1</math>
    <math>3<ref>_math1</ref> + 5</math>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3(x+1)+5')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('(x+1)')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacement = components['/_ref1'].replacements[0];
      expect(components['/_math1'].stateValues.value.tree).eqls(['+', 'x', 1])
      expect(replacement.stateValues.value.tree).eqls(['+', 'x', 1])
      expect(components['/_math2'].stateValues.value.tree).eqls(["+", ["*", 3, ["+", "x", 1]], 5])
      expect(components['/_math1'].stateValues.hide).eq(true)
      expect(replacement.stateValues.hide).eq(true);
      expect(components['/_math2'].stateValues.hide).eq(false)
    })
  })

  it('math underscore when no value', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math></math>
    `}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_text1').should('have.text', 'a'); // wait to load
    cy.get('.mjx-charbox').invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <math> </math>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b'); // wait to load
    cy.get('.mjx-charbox').invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <math />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'c'); // wait to load
    cy.get('.mjx-charbox').invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

  })

  it('format latex', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math format="latex">\\frac{x}{z}</math>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-char').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/_math1').find('.mjx-char').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(['/', 'x', 'z'])
    })
  })

  it('ref latex property', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>x/y</math>
  <ref prop="latex">_math1</ref>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-char').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/_math1').find('.mjx-char').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacement = components['/_ref1'].replacements[0];
      cy.get('#' + replacement.componentName).should('have.text', '\\frac{x}{y}');

    })

  });

  it('math with internal and external refs', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="a" simplify><math name="x">x</math> + <ref>x</ref> + <ref>z</ref></math>
  <math name="z">z</math>
  <ref name="a2">a</ref>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x+z')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacement = components['/a2'].replacements[0];
      cy.get('#' + replacement.componentName).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x+z')
      })
    })

  });

  it('point adapts into a math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <point>3</point>
  <math simplify>2 + <ref>_point1</ref></math>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let point = components['/_ref1'].replacements[0];
      let coords = point.adapterUsed;
      expect(components['/_math1'].stateValues.value.tree).eq(5);
      expect(components['/_math1'].activeChildren[2].componentName).equal(coords.componentName);
      expect(coords.adaptedFrom.componentName).eq(point.componentName);
    })

  });

  it('adjacent string children in math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math simplify>2<sequence count="0"/>3</math>
  <graph>
  <point><coords>(<ref>_math1</ref>, 3)</coords></point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    })

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      // string children are originally 1 and 3
      expect(components['/_math1'].activeChildren[1].stateValues.value).eq("2");
      expect(components['/_math1'].activeChildren[2].stateValues.value).eq("3");
      expect(components['/_math1'].stateValues.value.tree).eq(6);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(6);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(3);
    });

    cy.log("Move point to (7,9)");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      console.log(`move point1`)
      components['/_point1'].movePoint({ x: 7, y: 9 });
      console.log(`point moved`)
      // second child takes value, third is blank
      expect(components['/_math1'].activeChildren[1].stateValues.value).eq("7");
      expect(components['/_math1'].activeChildren[2].stateValues.value).eq("");
      expect(components['/_math1'].stateValues.value.tree).eq(7);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(7);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(9);
    });
  });

  it('math displayed rounded to 14 significant digits by default', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math>1.000000000000001</math></p>
  <p><math>0.30000000000000004 x + 4pi</math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0.3x+4π')
    })

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eq(1.000000000000001);
      expect(components['/_math2'].stateValues.value.tree).eqls(
        ['+', ['*', 0.30000000000000004, 'x'], ['*', 4, 'pi']]);
    });
  });

  it('mutual references of format', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>q</text>
  <p><math name="a" simplify>
    <format><ref prop="value">_textinput1</ref></format>
    \\sin(y)
    <math name="c">
      <ref prop="format">b</ref>
      sin(x)
    </math>
  </math></p>
  <p><math name="b" simplify>
    <format><ref prop="value">_textinput2</ref></format>
    sin(u)
    <math name="d">
      <ref prop="format">a</ref>
      \\sin(v)
    </math>
  </math></p>
  
  <p name="formata"><ref prop="format">a</ref></p>
  <p name="formatb"><ref prop="format">b</ref></p>
  <p name="formatc"><ref prop="format">c</ref></p>
  <p name="formatd"><ref prop="format">d</ref></p>
  
  <textinput prefill="latex"/>
  <textinput prefill="text"/>
      
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'q');  // to wait to load
    cy.log('Test value displayed in browser')
    cy.get('#\\/a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)sin(y)')
    })
    cy.get('#\\/b .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(u)sin(v)')
    })

    cy.get("#\\/formata").should('have.text', 'latex');
    cy.get("#\\/formatb").should('have.text', 'text');
    cy.get("#\\/formatc").should('have.text', 'text');
    cy.get("#\\/formatd").should('have.text', 'latex');

    cy.log('change format of second to latex')
    cy.get('#\\/_textinput2_input').clear().type(`latex{enter}`);

    cy.get('#\\/a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('insxsin(y)')
    })
    cy.get('#\\/b .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('insusin(v)')
    })

    cy.get("#\\/formata").should('have.text', 'latex');
    cy.get("#\\/formatb").should('have.text', 'latex');
    cy.get("#\\/formatc").should('have.text', 'latex');
    cy.get("#\\/formatd").should('have.text', 'latex');

    cy.log('change format of first to text')
    cy.get('#\\/_textinput1_input').clear().type(`text{enter}`);

    cy.get('#\\/a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/b .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('insu＿')
    })

    cy.get("#\\/formata").should('have.text', 'text');
    cy.get("#\\/formatb").should('have.text', 'latex');
    cy.get("#\\/formatc").should('have.text', 'latex');
    cy.get("#\\/formatd").should('have.text', 'text');


    cy.log('change format of second back to text')
    cy.get('#\\/_textinput2_input').clear().type(`text{enter}`);

    cy.get('#\\/a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/b .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿sin(u)')
    })

    cy.get("#\\/formata").should('have.text', 'text');
    cy.get("#\\/formatb").should('have.text', 'text');
    cy.get("#\\/formatc").should('have.text', 'text');
    cy.get("#\\/formatd").should('have.text', 'text');

    cy.log('change format of first back to latext')
    cy.get('#\\/_textinput1_input').clear().type(`latex{enter}`);

    cy.get('#\\/a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)sin(y)')
    })
    cy.get('#\\/b .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(u)sin(v)')
    })

    cy.get("#\\/formata").should('have.text', 'latex');
    cy.get("#\\/formatb").should('have.text', 'text');
    cy.get("#\\/formatc").should('have.text', 'text');
    cy.get("#\\/formatd").should('have.text', 'latex');

  });

  it('simplify math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>Default is no simplification: <math>1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    <p>Explicit no simplify: <math simplify="none">1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    <p>Full simplify a: <math simplify>1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    <p>Full simplify b: <math simplify="full">1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    <p>Simplify numbers: <math simplify="numbers">1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    <p>Simplify numbers preserve order: <math simplify="numberspreserveorder">1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    `}, "*");

    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1x2−3+0x2+4−2x2−3+5x2')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1x2−3+0x2+4−2x2−3+5x2')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4x2−2')
    });
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4x2−2')
    });
    cy.get('#\\/_math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−2x2+x2+5x2−2')
    });
    cy.get('#\\/_math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+1−2x2−3+5x2')
    })

    let originalTree = [
      '+',
      ['*', 1, ['^', 'x', 2]],
      ['-', 3],
      ['*', 0, ['^', 'x', 2]],
      4,
      ['-', ['*', 2, ['^', 'x', 2]]],
      ['-', 3],
      ['*', 5, ['^', 'x', 2]],
    ]

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(originalTree);
      expect(components['/_math2'].stateValues.value.tree).eqls(originalTree);
      expect(components['/_math3'].stateValues.value.tree).eqls(["+", ["*", 4, ["^", "x", 2]], -2])
      expect(components['/_math4'].stateValues.value.tree).eqls(["+", ["*", 4, ["^", "x", 2]], -2])
      expect(components['/_math5'].stateValues.value.tree).eqls([
        '+',
        ['*', -2, ['^', 'x', 2]],
        ['^', 'x', 2],
        ['*', 5, ['^', 'x', 2]],
        -2
      ]);
      expect(components['/_math6'].stateValues.value.tree).eqls([
        '+',
        ['^', 'x', 2],
        1,
        ['*', -2, ['^', 'x', 2]],
        -3,
        ['*', 5, ['^', 'x', 2]],
      ]);

    })
  })

  it('expand math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>Default is to not expand: <math>(x-3)(2x+4)</math></p>
    <p>Expand: <math expand="true">(x-3)(2x+4)</math></p>
    <p>Don't expand sum: <math>(x-3)(2x+4) - (3x+5)(7-x)</math></p>
    <p>Expand: <math expand="true">(x-3)(2x+4) - (3x+5)(7-x)</math></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x−3)(2x+4)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x2−2x−12')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x−3)(2x+4)−(3x+5)(7−x)')
    })
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5x2−18x−47')
    });
  })

  it('create vectors and intervals', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>Default: <math>(1,2,3),(4,5),[6,7],(8,9],[10,11)</math></p>
    <p>Create vectors: <math createvectors="true">(1,2,3),(4,5),[6,7],(8,9],[10,11)</math></p>
    <p>Create intervals: <math createintervals="true">(1,2,3),(4,5),[6,7],(8,9],[10,11)</math></p>
    <p>Create vectors and intervals: <math createvectors createintervals>(1,2,3),(4,5),[6,7],(8,9],[10,11)</math></p>
    `}, "*");

    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Look same in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2,3),(4,5),[6,7],(8,9],[10,11)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2,3),(4,5),[6,7],(8,9],[10,11)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2,3),(4,5),[6,7],(8,9],[10,11)')
    });
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2,3),(4,5),[6,7],(8,9],[10,11)')
    });

    cy.log('Different internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(["list",
        ["tuple", 1, 2, 3],
        ["tuple", 4, 5],
        ["array", 6, 7],
        ["interval", ["tuple", 8, 9], ["tuple", false, true]],
        ["interval", ["tuple", 10, 11], ["tuple", true, false]],
      ]);
      expect(components['/_math2'].stateValues.value.tree).eqls(["list",
        ["vector", 1, 2, 3],
        ["vector", 4, 5],
        ["array", 6, 7],
        ["interval", ["tuple", 8, 9], ["tuple", false, true]],
        ["interval", ["tuple", 10, 11], ["tuple", true, false]],
      ]);
      expect(components['/_math3'].stateValues.value.tree).eqls(["list",
        ["tuple", 1, 2, 3],
        ["interval", ["tuple", 4, 5], ["tuple", false, false]],
        ["interval", ["tuple", 6, 7], ["tuple", true, true]],
        ["interval", ["tuple", 8, 9], ["tuple", false, true]],
        ["interval", ["tuple", 10, 11], ["tuple", true, false]],
      ]);
      expect(components['/_math4'].stateValues.value.tree).eqls(["list",
        ["vector", 1, 2, 3],
        ["vector", 4, 5],
        ["interval", ["tuple", 6, 7], ["tuple", true, true]],
        ["interval", ["tuple", 8, 9], ["tuple", false, true]],
        ["interval", ["tuple", 10, 11], ["tuple", true, false]],
      ]);
    });

  })

  it('display small numbers as zero', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math>2x + (1E-15)y</math></p>
  <p><math displaysmallaszero>2x + (1E-15)y</math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x+1⋅10−15y')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['*', 1E-15, 'y']]);
      expect(components['/_math2'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['*', 1E-15, 'y']]);
      expect(components['/_math1'].stateValues.displaySmallAsZero).eq(false);
      expect(components['/_math2'].stateValues.displaySmallAsZero).eq(true);
    });


  });

})
