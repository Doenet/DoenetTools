import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Math Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
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

  it('hidden string copy/math string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide>x+1</math>
    <math>3<copy tname="_math1" targetAttributesToIgnore="" /> + 5</math>
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
      let replacement = components['/_copy1'].replacements[0];
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

  it('copy latex property', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>x/y</math>
  <copy prop="latex" tname="_math1" />
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
      let replacement = components['/_copy1'].replacements[0];
      cy.get(cesc('#' + replacement.componentName)).should('have.text', '\\frac{x}{y}');

    })

  });

  it('math with internal and external copies', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="a" simplify><math name="x">x</math> + <copy tname="x" /> + <copy tname="z" /></math>
  <math name="z">z</math>
  <copy name="a2" tname="a" />
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
      cy.get(cesc('#' + replacement.componentName)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
  <math simplify>2 + <copy tname="_point1" /></math>
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
      let point = components['/_copy1'].replacements[0];
      let coords = point.adapterUsed;
      expect(components['/_math1'].stateValues.value.tree).eq(5);
      expect(components['/_math1'].activeChildren[1].componentName).equal(coords.componentName);
      expect(coords.adaptedFrom.componentName).eq(point.componentName);
    })

  });

  it('adjacent string children in math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math simplify>2<sequence length="0"/>3</math>
  <graph>
  <point>(<copy tname="_math1" />, 3)</point>
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
      expect(components['/_math1'].activeChildren[0].stateValues.value).eq("2");
      expect(components['/_math1'].activeChildren[1].stateValues.value).eq("3");
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
      expect(components['/_math1'].activeChildren[0].stateValues.value).eq("7");
      expect(components['/_math1'].activeChildren[1].stateValues.value).eq("");
      expect(components['/_math1'].stateValues.value.tree).eq(7);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(7);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(9);
    });
  });

  it('math displayed rounded to 10 significant digits by default', () => {
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
  <p><math name="a" simplify format="$_textinput1">
    \\sin(y)
    <math name="c" format="$cbf">
      sin(x)
    </math>
  </math></p>
  <p><math name="b" simplify format="$_textinput2">
    sin(u)
    <math name="d" format="$caf">
      \\sin(v)
    </math>
  </math></p>

  <copy prop="format" tname="a" name="caf" hide />
  <copy prop="format" tname="b" name="cbf" hide />
  
  <p name="formata"><copy prop="format" tname="a" /></p>
  <p name="formatb"><copy prop="format" tname="b" /></p>
  <p name="formatc"><copy prop="format" tname="c" /></p>
  <p name="formatd"><copy prop="format" tname="d" /></p>
  
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
  <p><math displaysmallaszero>2x + (1E-13)y</math></p>
  <p><math displaysmallaszero="1E-12">2x + (1E-13)y</math></p>
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
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x+1⋅10−13y')
    })
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['*', 1E-15, 'y']]);
      expect(components['/_math2'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['*', 1E-15, 'y']]);
      expect(components['/_math3'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['*', 1E-13, 'y']]);
      expect(components['/_math4'].stateValues.value.tree).eqls(["+", ['*', 2, 'x'], ['*', 1E-13, 'y']]);
      expect(components['/_math1'].stateValues.displaySmallAsZero).eq(0);
      expect(components['/_math2'].stateValues.displaySmallAsZero).eq(1E-14);
      expect(components['/_math3'].stateValues.displaySmallAsZero).eq(1E-14);
      expect(components['/_math4'].stateValues.displaySmallAsZero).eq(1E-12);
    });


  });

  it('display digits and decimals', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math>621802.3520303639164826281</math></p>
  <p><math>31.3835205397397634 x + 4pi</math></p>
  <p><copy tname="_math1" assignNames="dig5a" displayDigits="5" /></p>
  <p><copy tname="_math2" assignNames="dig5b" displayDigits="5" /></p>
  <p><copy tname="_math1" assignNames="dec5a" displayDecimals="5" /></p>
  <p><copy tname="_math2" assignNames="dec5b" displayDecimals="5" /></p>
  <p><copy tname="_math1" assignNames="dig5dec1a" displayDigits="5" displayDecimals="1" /></p>
  <p><copy tname="_math2" assignNames="dig5dec1b" displayDigits="5" displayDecimals="1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.352')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352054x+4π')
    })
    cy.get('#\\/dig5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get('#\\/dig5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get('#\\/dec5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get('#\\/dec5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })
    cy.get('#\\/dig5dec1a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get('#\\/dig5dec1b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eq(621802.3520303639)
      expect(components['/_math2'].stateValues.value.tree).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(components['/dig5a'].stateValues.value.tree).eq(621802.3520303639)
      expect(components['/dig5b'].stateValues.value.tree).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(components['/dec5a'].stateValues.value.tree).eq(621802.3520303639)
      expect(components['/dec5b'].stateValues.value.tree).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(components['/dig5dec1a'].stateValues.value.tree).eq(621802.3520303639)
      expect(components['/dig5dec1b'].stateValues.value.tree).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(components['/_math1'].stateValues.valueForDisplay.tree).eq(621802.352)
      expect(components['/_math2'].stateValues.valueForDisplay.tree).eqls(
        ['+', ['*', 31.38352054, 'x'], ['*', 4, 'pi']]);
      expect(components['/dig5a'].stateValues.valueForDisplay.tree).eq(621800)
      expect(components['/dig5b'].stateValues.valueForDisplay.tree).eqls(
        ['+', ['*', 31.384, 'x'], ['*', 4, 'pi']]);
      expect(components['/dec5a'].stateValues.valueForDisplay.tree).eq(621802.35203)
      expect(components['/dec5b'].stateValues.valueForDisplay.tree).eqls(
        ['+', ['*', 31.38352, 'x'], ['*', 4, 'pi']]);
      expect(components['/dig5dec1a'].stateValues.valueForDisplay.tree).eq(621800)
      expect(components['/dig5dec1b'].stateValues.valueForDisplay.tree).eqls(
        ['+', ['*', 31.384, 'x'], ['*', 4, 'pi']]);

    });


  });

  it('dynamic rounding', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>Number: <math name="n">35203423.02352343201</math></p>
      <p>Number of digits: <mathinput name="ndigits" prefill="3" /></p>
      <p>Number of decimals: <mathinput name="ndecimals" prefill="3" /></p>
      <p><copy tname="n" displayDigits='$ndigits' assignNames="na" /></p>
      <p><copy tname="n" displayDecimals='$ndecimals' assignNames="nb" /></p>
    ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423.02')
    })
    cy.get('#\\/na').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35200000')
    })
    cy.get('#\\/nb').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423.024')
    })

    cy.log('higher precision')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}12{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}5{enter}", { force: true });
    cy.get('#\\/na').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423.0235')
    })
    cy.get('#\\/nb').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423.02352')
    })

    cy.log('invalid precision means no rounding')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}{backspace}x{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}{backspace}y{enter}", { force: true });
    cy.get('#\\/na').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(35203423.02352343201, 1E-15)
    })
    cy.get('#\\/nb').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(35203423.02352343201, 1E-15)
    })

    cy.log('low precision')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/na').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('40000000')
    })
    cy.get('#\\/nb').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423')
    })

    cy.log('negative precision, no rounding for displayDigits')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.get('#\\/na').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(35203423.02352343201, 1E-15)
    })
    cy.get('#\\/nb').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203000')
    })

  })


  it('function symbols', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math>f(x)</math></p>
  <p><math>g(t)</math></p>
  <p><math>h(z)</math></p>
  <p><math functionSymbols="g h">f(x)</math></p>
  <p><math functionSymbols="g h">g(t)</math></p>
  <p><math functionSymbols="g h">h(z)</math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g(t)')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hz')
    })
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('fx')
    })
    cy.get('#\\/_math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g(t)')
    })
    cy.get('#\\/_math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h(z)')
    })

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(["apply", "f", "x"]);
      expect(components['/_math2'].stateValues.value.tree).eqls(["apply", "g", "t"]);
      expect(components['/_math3'].stateValues.value.tree).eqls(["*", "h", "z"]);
      expect(components['/_math4'].stateValues.value.tree).eqls(["*", "f", "x"]);
      expect(components['/_math5'].stateValues.value.tree).eqls(["apply", "g", "t"]);
      expect(components['/_math6'].stateValues.value.tree).eqls(["apply", "h", "z"]);

    });


  });

  it('split symbols', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math>xyz</math></p>
  <p><math splitSymbols="false">xyz</math></p>
  <p><math splitSymbols="true">xyz</math></p>
  <p><math simplify>xyx</math></p>
  <p><math simplify splitSymbols="false">xyx</math></p>
  <p><math simplify splitSymbols="true">xyx</math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get('#\\/_math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get('#\\/_math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_math1'].stateValues.value.tree).eqls(["*", "x", "y", "z"]);
      expect(components['/_math2'].stateValues.value.tree).eqls("xyz");
      expect(components['/_math3'].stateValues.value.tree).eqls(["*", "x", "y", "z"]);
      expect(components['/_math4'].stateValues.value.tree).eqls(["*", "y", ["^", "x", 2]]);
      expect(components['/_math5'].stateValues.value.tree).eqls("xyx");
      expect(components['/_math6'].stateValues.value.tree).eqls(["*", "y", ["^", "x", 2]]);

    });

  });

  it('merge lists with other containers', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="set">{<math>a,b,c</math>}</math></p>
  <!--<p><math name="tuple">(<math>a,b,c</math>,)</math></p>-->
  <p><math name="combinedSet">{<math>a,b,c</math>,d,<math>e,f</math>}</math></p>
  <p><math name="combinedTuple">(<math>a,b,c</math>,d,<math>e,f</math>)</math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/set').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('{a,b,c}')
    })
    // cy.get('#\\/tuple').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('(a,b,c)')
    // })
    cy.get('#\\/combinedSet').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('{a,b,c,d,e,f}')
    })
    cy.get('#\\/combinedTuple').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b,c,d,e,f)')
    })

    cy.log('Test internal values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/set'].stateValues.value.tree).eqls(["set", "a", "b", "c"]);
      // expect(components['/tuple'].stateValues.value.tree).eqls(["tuple", "a", "b", "c"]);
      expect(components['/combinedSet'].stateValues.value.tree).eqls(["set", "a", "b", "c", "d", "e", "f"]);
      expect(components['/combinedTuple'].stateValues.value.tree).eqls(["tuple", "a", "b", "c", "d", "e", "f"]);

    });

  });

  it('components of math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><mathinput name="m" prefill="(a,b,c)" /></p>
  <p><math name="m2">$m</math></p>
  <p><math name="m3" createVectors>$m</math></p>
  <p>Ndimensions: <extract prop="nDimensions" assignNames="nDim1">$m</extract> <copy prop="nDimensions" tname="m2" assignNames="nDim2" /> <copy prop="nDimensions" tname="m3" assignNames="nDim3" /></p>
  <p>x: <extract prop="x" assignNames="x">$m</extract> <copy prop="x" tname="m2" assignNames="x_2" /> <copy prop="x" tname="m3" assignNames="x_3" /></p>
  <p>y: <extract prop="y" assignNames="y">$m</extract> <copy prop="y" tname="m2" assignNames="y_2" /> <copy prop="y" tname="m3" assignNames="y_3" /></p>
  <p>z: <extract prop="z" assignNames="z">$m</extract> <copy prop="z" tname="m2" assignNames="z_2" /> <copy prop="z" tname="m3" assignNames="z_3" /></p>
  <p>x1: <extract prop="x1" assignNames="x1">$m</extract> <copy prop="x1" tname="m2" assignNames="x1_2" /> <copy prop="x1" tname="m3" assignNames="x1_3" /></p>
  <p>x2: <extract prop="x2" assignNames="x2">$m</extract> <copy prop="x2" tname="m2" assignNames="x2_2" /> <copy prop="x2" tname="m3" assignNames="x2_3" /></p>
  <p>x3: <extract prop="x3" assignNames="x3">$m</extract> <copy prop="x3" tname="m2" assignNames="x3_2" /> <copy prop="x3" tname="m3" assignNames="x3_3" /></p>
  <p>x4: <extract prop="x4" assignNames="x4">$m</extract> <copy prop="x4" tname="m2" assignNames="x4_2" /> <copy prop="x4" tname="m3" assignNames="x4_3" /></p>
  <p>x: <mathinput bindValueTo="$x" name="mx" /> <mathinput bindValueTo="$(m2{prop='x'})" name="mx_2" /> <mathinput bindValueTo="$(m3{prop='x'})" name="mx_3" /></p>
  <p>y: <mathinput bindValueTo="$y" name="my" /> <mathinput bindValueTo="$(m2{prop='y'})" name="my_2" /> <mathinput bindValueTo="$(m3{prop='y'})" name="my_3" /></p>
  <p>z: <mathinput bindValueTo="$z" name="mz" /> <mathinput bindValueTo="$(m2{prop='z'})" name="mz_2" /> <mathinput bindValueTo="$(m3{prop='z'})" name="mz_3" /></p>
  <p>x1: <mathinput bindValueTo="$x1" name="mx1" /> <mathinput bindValueTo="$(m2{prop='x1'})" name="mx1_2" /> <mathinput bindValueTo="$(m3{prop='x1'})" name="mx1_3" /></p>
  <p>x2: <mathinput bindValueTo="$x2" name="mx2" /> <mathinput bindValueTo="$(m2{prop='x2'})" name="mx2_2" /> <mathinput bindValueTo="$(m3{prop='x2'})" name="mx2_3" /></p>
  <p>x3: <mathinput bindValueTo="$x3" name="mx3" /> <mathinput bindValueTo="$(m2{prop='x3'})" name="mx3_2" /> <mathinput bindValueTo="$(m3{prop='x3'})" name="mx3_3" /></p>
  <p>x4: <mathinput bindValueTo="$x4" name="mx4" /> <mathinput bindValueTo="$(m2{prop='x4'})" name="mx4_2" /> <mathinput bindValueTo="$(m3{prop='x4'})" name="mx4_3" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    let indToComp = ["x", "y", "z"]

    function check_values(xs, operator) {

      cy.get(`#\\/nDim1`).should('have.text', xs.length.toString())
      cy.get(`#\\/nDim2`).should('have.text', xs.length.toString())

      for (let [ind, x] of xs.entries()) {
        let comp = indToComp[ind];
        if (comp) {
          cy.get(`#\\/${comp}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim().replace(/−/g, '-')).equal(x.toString())
          })
          cy.get(`#\\/${comp}_2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim().replace(/−/g, '-')).equal(x.toString())
          })
          cy.get(`#\\/${comp}_3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim().replace(/−/g, '-')).equal(x.toString())
          })
        }
        cy.get(`#\\/x${ind + 1}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(x.toString())
        })
        cy.get(`#\\/x${ind + 1}_2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(x.toString())
        })
        cy.get(`#\\/x${ind + 1}_3`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(x.toString())
        })
      }

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        expect(components["/nDim1"].stateValues.value).eq(xs.length)
        expect(components["/nDim2"].stateValues.value).eq(xs.length)

        let m3Operator = operator === "tuple" ? "vector" : operator;

        expect(components["/m"].stateValues.value.tree).eqls([operator, ...xs])
        expect(components["/m2"].stateValues.value.tree).eqls([operator, ...xs])
        expect(components["/m3"].stateValues.value.tree).eqls([m3Operator, ...xs])

        for (let [ind, x] of xs.entries()) {
          let comp = indToComp[ind];
          if (comp) {
            expect(components[`/${comp}`].stateValues.value.tree).eqls(x);
            expect(components[`/${comp}_2`].stateValues.value.tree).eqls(x);
            expect(components[`/${comp}_3`].stateValues.value.tree).eqls(x);
          }
          expect(components[`/x${ind + 1}`].stateValues.value.tree).eqls(x);
          expect(components[`/x${ind + 1}_2`].stateValues.value.tree).eqls(x);
          expect(components[`/x${ind + 1}_3`].stateValues.value.tree).eqls(x);
        }

      });

    }


    check_values(["a", "b", "c"], "tuple")

    cy.log('change xyz 1')
    cy.get('#\\/mx textarea').type('{end}{backspace}d{enter}', { force: true })
    cy.get('#\\/my textarea').type('{end}{backspace}e{enter}', { force: true })
    cy.get('#\\/mz textarea').type('{end}{backspace}f{enter}', { force: true })
    check_values(["d", "e", "f"], "tuple")

    cy.log('change xyz 2')
    cy.get('#\\/mx_2 textarea').type('{end}{backspace}g{enter}', { force: true })
    cy.get('#\\/my_2 textarea').type('{end}{backspace}h{enter}', { force: true })
    cy.get('#\\/mz_2 textarea').type('{end}{backspace}i{enter}', { force: true })
    check_values(["g", "h", "i"], "tuple")

    cy.log('change xyz 3')
    cy.get('#\\/mx_3 textarea').type('{end}{backspace}j{enter}', { force: true })
    cy.get('#\\/my_3 textarea').type('{end}{backspace}k{enter}', { force: true })
    cy.get('#\\/mz_3 textarea').type('{end}{backspace}l{enter}', { force: true })
    check_values(["j", "k", "l"], "vector")

    cy.log('change x1x2x3 1')
    cy.get('#\\/mx1 textarea').type('{end}{backspace}m{enter}', { force: true })
    cy.get('#\\/mx2 textarea').type('{end}{backspace}n{enter}', { force: true })
    cy.get('#\\/mx3 textarea').type('{end}{backspace}o{enter}', { force: true })
    check_values(["m", "n", "o"], "vector")

    cy.log('change x1x2x3 2')
    cy.get('#\\/mx1_2 textarea').type('{end}{backspace}p{enter}', { force: true })
    cy.get('#\\/mx2_2 textarea').type('{end}{backspace}q{enter}', { force: true })
    cy.get('#\\/mx3_2 textarea').type('{end}{backspace}r{enter}', { force: true })
    check_values(["p", "q", "r"], "vector")

    cy.log('change x1x2x3 2')
    cy.get('#\\/mx1_3 textarea').type('{end}{backspace}s{enter}', { force: true })
    cy.get('#\\/mx2_3 textarea').type('{end}{backspace}t{enter}', { force: true })
    cy.get('#\\/mx3_3 textarea').type('{end}{backspace}u{enter}', { force: true })
    check_values(["s", "t", "u"], "vector")

    cy.log('change to 4D list')
    cy.get('#\\/m textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}v,w,x,y{enter}", { force: true })

    check_values(["v", "w", "x", "y"], "list")


    cy.log('change x1x2x3x4 1')
    cy.get('#\\/mx1 textarea').type('{end}{backspace}z{enter}', { force: true })
    cy.get('#\\/mx2 textarea').type('{end}{backspace}a{enter}', { force: true })
    cy.get('#\\/mx3 textarea').type('{end}{backspace}b{enter}', { force: true })
    cy.get('#\\/mx4 textarea').type('{end}{backspace}c{enter}', { force: true })
    check_values(["z", "a", "b", "c"], "list")

    cy.log('change x1x2x3x4 2')
    cy.get('#\\/mx1_2 textarea').type('{end}{backspace}d{enter}', { force: true })
    cy.get('#\\/mx2_2 textarea').type('{end}{backspace}e{enter}', { force: true })
    cy.get('#\\/mx3_2 textarea').type('{end}{backspace}f{enter}', { force: true })
    cy.get('#\\/mx4_2 textarea').type('{end}{backspace}g{enter}', { force: true })
    check_values(["d", "e", "f", "g"], "list")


  });

  it('group composite replacements inside math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <math name="groupByDefault">
    <group><math>a</math><math>b</math></group>
  </math>
  <math name="dontGroup" groupCompositeReplacements="false">
    <group><math>a</math><math>b</math></group>
  </math>
  <math name="dontGroupDueToString">
    <group><math>a</math> + <math>b</math></group>
  </math>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/groupByDefault`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(a,b)')
    })
    cy.get(`#\\/dontGroup`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('ab')
    })
    cy.get(`#\\/dontGroupDueToString`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('a+b')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components["/groupByDefault"].stateValues.value.tree).eqls(["tuple", "a", "b"])
      expect(components["/dontGroup"].stateValues.value.tree).eqls(["*", "a", "b"])
      expect(components["/dontGroupDueToString"].stateValues.value.tree).eqls(["+", "a", "b"])



    });




  });

})
