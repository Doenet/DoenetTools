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

describe('Math Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('1+1', () => {
    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 1, 1]);
      expect(stateVariables['/_math2'].stateValues.value).eq(2);
    })
  })

  it('string math string', () => {
    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(["+", ["*", 3, ["+", "x", 1]], 5])
      expect(stateVariables['/_math2'].stateValues.value).eqls(['+', 'x', 1])
      expect(stateVariables['/_math3'].stateValues.value).eqls(["+", 5, ["*", 3, ["+", "x", 1]]])

    })
  })

  it('hidden string copy/math string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide>x+1</math>
    <math>3<copy source="_math1" sourceAttributesToIgnore="" /> + 5</math>
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacement = stateVariables['/_copy1'].replacements[0];
      expect((stateVariables['/_math1'].stateValues.value)).eqls(['+', 'x', 1])
      expect(stateVariables[replacement.componentName].stateValues.value).eqls(['+', 'x', 1])
      expect((stateVariables['/_math2'].stateValues.value)).eqls(["+", ["*", 3, ["+", "x", 1]], 5])
      expect(stateVariables['/_math1'].stateValues.hide).eq(true)
      expect(stateVariables[replacement.componentName].stateValues.hide).eq(true);
      expect(stateVariables['/_math2'].stateValues.hide).eq(false)
    })
  })

  it('math underscore when no value', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(['/', 'x', 'z'])
    })
  })

  it('copy latex property', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>x/y</math>
  <copy prop="latex" source="_math1" />
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacement = stateVariables['/_copy1'].replacements[0];
      cy.get(cesc('#' + replacement.componentName)).should('have.text', '\\frac{x}{y}');

    })

  });

  it('math with internal and external copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math name="a" simplify><math name="x">x</math> + <copy source="x" /> + <copy source="z" /></math>
  <math name="z">z</math>
  <copy name="a2" source="a" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x+z')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacement = stateVariables['/a2'].replacements[0];
      cy.get(cesc('#' + replacement.componentName)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2x+z')
      })
    })

  });

  it('point adapts into a math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <point>3</point>
  <math simplify>2 + <copy source="_point1" /></math>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let point = stateVariables['/_copy1'].replacements[0];
      let coords = point.adapterUsed;
      expect(stateVariables['/_math1'].stateValues.value).eq(5);
      // expect(stateVariables['/_math1'].activeChildren[1].componentName).equal(coords.componentName);
      // expect(coords.adaptedFrom.componentName).eq(point.componentName);
    })

  });

  it('adjacent string children in math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math simplify>2<sequence length="0"/>3</math>
  <graph>
  <point>(<copy source="_math1" />, 3)</point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    })

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // string children are originally 1 and 3
      expect(stateVariables['/_math1'].activeChildren[0]).eq("2");
      expect(stateVariables['/_math1'].activeChildren[1]).eq("3");
      expect(stateVariables['/_math1'].stateValues.value).eq(6);
      expect(stateVariables['/_point1'].stateValues.xs[0]).eq(6);
      expect(stateVariables['/_point1'].stateValues.xs[1]).eq(3);
    });

    cy.log("Move point to (7,9)");
    cy.window().then(async (win) => {
      console.log(`move point1`)
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 7, y: 9 }
      });
      let stateVariables = await win.returnAllStateVariables1();
      // second child takes value, third is blank
      expect(stateVariables['/_math1'].activeChildren[0]).eq("7");
      expect(stateVariables['/_math1'].activeChildren[1]).eq("");
      expect(stateVariables['/_math1'].stateValues.value).eq(7);
      expect(stateVariables['/_point1'].stateValues.xs[0]).eq(7);
      expect(stateVariables['/_point1'].stateValues.xs[1]).eq(9);
    });
  });

  it('math displayed rounded to 10 significant digits by default', () => {
    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eq(1.000000000000001);
      expect(stateVariables['/_math2'].stateValues.value).eqls(
        ['+', ['*', 0.30000000000000004, 'x'], ['*', 4, 'pi']]);
    });
  });

  it('mutual references of format', () => {
    cy.window().then(async (win) => {
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

  <copy prop="format" source="a" name="caf" hide />
  <copy prop="format" source="b" name="cbf" hide />

  <p name="formata"><copy prop="format" source="a" /></p>
  <p name="formatb"><copy prop="format" source="b" /></p>
  <p name="formatc"><copy prop="format" source="c" /></p>
  <p name="formatd"><copy prop="format" source="d" /></p>

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

    cy.get('#\\/a').should('contain.text', 'insxsin(y)')
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


    cy.get('#\\/a').should('contain.text', '＿')
    cy.get('#\\/a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/b .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sinu＿')
    })

    cy.get("#\\/formata").should('have.text', 'text');
    cy.get("#\\/formatb").should('have.text', 'latex');
    cy.get("#\\/formatc").should('have.text', 'latex');
    cy.get("#\\/formatd").should('have.text', 'text');


    cy.log('change format of second back to text')
    cy.get('#\\/_textinput2_input').clear().type(`text{enter}`);

    cy.get('#\\/b').should('contain.text', 'sin(u)＿')

    cy.get('#\\/a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/b .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(u)＿')
    })

    cy.get("#\\/formata").should('have.text', 'text');
    cy.get("#\\/formatb").should('have.text', 'text');
    cy.get("#\\/formatc").should('have.text', 'text');
    cy.get("#\\/formatd").should('have.text', 'text');

    cy.log('change format of first back to latext')
    cy.get('#\\/_textinput1_input').clear().type(`latex{enter}`);

    cy.get('#\\/a').should('contain.text', 'sin(x)sin(y)')

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
    cy.window().then(async (win) => {
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
      -3,
      ['*', 0, ['^', 'x', 2]],
      4,
      ['-', ['*', 2, ['^', 'x', 2]]],
      -3,
      ['*', 5, ['^', 'x', 2]],
    ]

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(originalTree);
      expect(stateVariables['/_math2'].stateValues.value).eqls(originalTree);
      expect(stateVariables['/_math3'].stateValues.value).eqls(["+", ["*", 4, ["^", "x", 2]], -2])
      expect(stateVariables['/_math4'].stateValues.value).eqls(["+", ["*", 4, ["^", "x", 2]], -2])
      expect(stateVariables['/_math5'].stateValues.value).eqls([
        '+',
        ['*', -2, ['^', 'x', 2]],
        ['^', 'x', 2],
        ['*', 5, ['^', 'x', 2]],
        -2
      ]);
      expect(stateVariables['/_math6'].stateValues.value).eqls([
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <p>Default is to not expand: <math>(x-3)(2x+4)</math></p>
    <p>Expand: <math expand="true">(x-3)(2x+4)</math></p>
    <p>Don't expand sum: <math>(x-3)(2x+4) - (3x+5)(7-x)</math></p>
    <p>Expand: <math expand="true">(x-3)(2x+4) - (3x+5)(7-x)</math></p>
    <p>Expand: <math expand>2(1-x)(1+x)(-2)</math></p>

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
    cy.get('#\\/_math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4x2−4')
    });


    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls([
        '*',
        ['+', 'x', -3],
        ['+', ['*', 2, 'x'], 4]
      ]);
      expect(stateVariables['/_math2'].stateValues.value).eqls([
        '+',
        ['*', 2, ['^', 'x', 2]],
        ['*', -2, 'x'],
        -12
      ]);
      expect(stateVariables['/_math3'].stateValues.value).eqls([
        '+',
        [
          '*',
          ['+', 'x', -3],
          ['+', ['*', 2, 'x'], 4]
        ],
        [
          '-',
          [
            '*',
            ['+', ['*', 3, 'x'], 5],
            ['+', 7, ['-', 'x']]
          ]
        ]
      ])
      expect(stateVariables['/_math4'].stateValues.value).eqls([
        '+',
        ['*', 5, ['^', 'x', 2]],
        ['*', -18, 'x'],
        -47
      ])
      expect(stateVariables['/_math5'].stateValues.value).eqls([
        '+',
        ['*', 4, ['^', 'x', 2]],
        -4
      ])

    })

  })

  it('create vectors and intervals', () => {
    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(["list",
        ["tuple", 1, 2, 3],
        ["tuple", 4, 5],
        ["array", 6, 7],
        ["interval", ["tuple", 8, 9], ["tuple", false, true]],
        ["interval", ["tuple", 10, 11], ["tuple", true, false]],
      ]);
      expect(stateVariables['/_math2'].stateValues.value).eqls(["list",
        ["vector", 1, 2, 3],
        ["vector", 4, 5],
        ["array", 6, 7],
        ["interval", ["tuple", 8, 9], ["tuple", false, true]],
        ["interval", ["tuple", 10, 11], ["tuple", true, false]],
      ]);
      expect(stateVariables['/_math3'].stateValues.value).eqls(["list",
        ["tuple", 1, 2, 3],
        ["interval", ["tuple", 4, 5], ["tuple", false, false]],
        ["interval", ["tuple", 6, 7], ["tuple", true, true]],
        ["interval", ["tuple", 8, 9], ["tuple", false, true]],
        ["interval", ["tuple", 10, 11], ["tuple", true, false]],
      ]);
      expect(stateVariables['/_math4'].stateValues.value).eqls(["list",
        ["vector", 1, 2, 3],
        ["vector", 4, 5],
        ["interval", ["tuple", 6, 7], ["tuple", true, true]],
        ["interval", ["tuple", 8, 9], ["tuple", false, true]],
        ["interval", ["tuple", 10, 11], ["tuple", true, false]],
      ]);
    });

  })

  it('display small numbers as zero', () => {
    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['*', 1E-15, 'y']]);
      expect(stateVariables['/_math2'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['*', 1E-15, 'y']]);
      expect(stateVariables['/_math3'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['*', 1E-13, 'y']]);
      expect(stateVariables['/_math4'].stateValues.value).eqls(["+", ['*', 2, 'x'], ['*', 1E-13, 'y']]);
      expect(stateVariables['/_math1'].stateValues.displaySmallAsZero).eq(0);
      expect(stateVariables['/_math2'].stateValues.displaySmallAsZero).eq(1E-14);
      expect(stateVariables['/_math3'].stateValues.displaySmallAsZero).eq(1E-14);
      expect(stateVariables['/_math4'].stateValues.displaySmallAsZero).eq(1E-12);
    });


  });

  it('display digits and decimals', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="expr1">621802.3520303639164826281</math></p>
  <p><math name="expr2">31.3835205397397634 x + 4pi</math></p>
  <p><math name="expr1Dig5" displayDigits="5">621802.3520303639164826281</math></p>
  <p><math name="expr2Dig5" displayDigits="5">31.3835205397397634 x + 4pi</math></p>
  <p><math name="expr1Dec5" displayDecimals="5">621802.3520303639164826281</math></p>
  <p><math name="expr2Dec5" displayDecimals="5">31.3835205397397634 x + 4pi</math></p>
  <p><copy source="expr1" assignNames="expr1Dig5a" displayDigits="5" /></p>
  <p><copy source="expr2" assignNames="expr2Dig5a" displayDigits="5" /></p>
  <p><copy source="expr1" assignNames="expr1Dec5a" displayDecimals="5" /></p>
  <p><copy source="expr2" assignNames="expr2Dec5a" displayDecimals="5" /></p>
  <p><copy source="expr1Dec5" assignNames="expr1Dig5b" displayDigits="5" /></p>
  <p><copy source="expr2Dec5" assignNames="expr2Dig5b" displayDigits="5" /></p>
  <p><copy source="expr1Dig5" assignNames="expr1Dec5b" displayDecimals="5" /></p>
  <p><copy source="expr2Dig5" assignNames="expr2Dec5b" displayDecimals="5" /></p>
  <p><copy source="expr1Dec5a" assignNames="expr1Dig5c" displayDigits="5" /></p>
  <p><copy source="expr2Dec5a" assignNames="expr2Dig5c" displayDigits="5" /></p>
  <p><copy source="expr1Dig5a" assignNames="expr1Dec5c" displayDecimals="5" /></p>
  <p><copy source="expr2Dig5a" assignNames="expr2Dec5c" displayDecimals="5" /></p>
  <p><copy source="expr1Dec5b" assignNames="expr1Dig5d" displayDigits="5" /></p>
  <p><copy source="expr2Dec5b" assignNames="expr2Dig5d" displayDigits="5" /></p>
  <p><copy source="expr1Dig5b" assignNames="expr1Dec5d" displayDecimals="5" /></p>
  <p><copy source="expr2Dig5b" assignNames="expr2Dec5d" displayDecimals="5" /></p>

  <p><copy source="expr1" assignNames="expr1Dig5e" displayDigits="5" displayDecimals="1" /></p>
  <p><copy source="expr2" assignNames="expr2Dig5e" displayDigits="5" displayDecimals="1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/expr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.352')
    })
    cy.get('#\\/expr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352054x+4π')
    })
    cy.get('#\\/expr1Dig5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get('#\\/expr2Dig5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get('#\\/expr1Dec5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get('#\\/expr2Dec5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })
    cy.get('#\\/expr1Dig5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get('#\\/expr2Dig5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get('#\\/expr1Dec5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get('#\\/expr2Dec5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })

    cy.get('#\\/expr1Dig5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get('#\\/expr2Dig5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get('#\\/expr1Dec5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get('#\\/expr2Dec5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })

    cy.get('#\\/expr1Dig5c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get('#\\/expr2Dig5c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get('#\\/expr1Dec5c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get('#\\/expr2Dec5c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })


    cy.get('#\\/expr1Dig5d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get('#\\/expr2Dig5d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get('#\\/expr1Dec5d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get('#\\/expr2Dec5d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })

    cy.get('#\\/expr1Dig5e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get('#\\/expr2Dig5e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/expr1'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dig5'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dec5'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dec5'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5a'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dig5a'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dec5a'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dec5a'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5b'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dig5b'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dec5b'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dec5b'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5c'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dig5c'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dec5c'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dec5c'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5d'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dig5d'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dec5d'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dec5d'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5e'].stateValues.value).eq(621802.3520303639)
      expect(stateVariables['/expr2Dig5e'].stateValues.value).eqls(
        ['+', ['*', 31.383520539739763, 'x'], ['*', 4, 'pi']]);


      expect(stateVariables['/expr1'].stateValues.valueForDisplay).eq(621802.352)
      expect(stateVariables['/expr2'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.38352054, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5'].stateValues.valueForDisplay).eq(621800)
      expect(stateVariables['/expr2Dig5'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.384, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dec5'].stateValues.valueForDisplay).eq(621802.35203)
      expect(stateVariables['/expr2Dec5'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.38352, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5a'].stateValues.valueForDisplay).eq(621800)
      expect(stateVariables['/expr2Dig5a'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.384, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dec5a'].stateValues.valueForDisplay).eq(621802.35203)
      expect(stateVariables['/expr2Dec5a'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.38352, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5b'].stateValues.valueForDisplay).eq(621800)
      expect(stateVariables['/expr2Dig5b'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.384, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dec5b'].stateValues.valueForDisplay).eq(621802.35203)
      expect(stateVariables['/expr2Dec5b'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.38352, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5c'].stateValues.valueForDisplay).eq(621800)
      expect(stateVariables['/expr2Dig5c'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.384, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dec5c'].stateValues.valueForDisplay).eq(621802.35203)
      expect(stateVariables['/expr2Dec5c'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.38352, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5d'].stateValues.valueForDisplay).eq(621800)
      expect(stateVariables['/expr2Dig5d'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.384, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dec5d'].stateValues.valueForDisplay).eq(621802.35203)
      expect(stateVariables['/expr2Dec5d'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.38352, 'x'], ['*', 4, 'pi']]);
      expect(stateVariables['/expr1Dig5e'].stateValues.valueForDisplay).eq(621800)
      expect(stateVariables['/expr2Dig5e'].stateValues.valueForDisplay).eqls(
        ['+', ['*', 31.384, 'x'], ['*', 4, 'pi']]);

    });


  });

  it('pad zeros with display digits and decimals', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math>62.1</math></p>
  <p><math>162.1*10^(-3)</math></p>
  <p><math>1.3 x + 4pi</math></p>
  <p><copy source="_math1" assignNames="dig5a" displayDigits="5" /></p>
  <p><copy source="_math1" assignNames="dig5apad" displayDigits="5" padZeros /></p>
  <p><copy source="_math2" assignNames="dig5b" displayDigits="5" /></p>
  <p><copy source="_math2" assignNames="dig5bpad" displayDigits="5" padZeros /></p>
  <p><copy source="_math3" assignNames="dig5c" displayDigits="5" /></p>
  <p><copy source="_math3" assignNames="dig5cpad" displayDigits="5" padZeros /></p>
  <p><copy source="_math1" assignNames="dec5a" displayDecimals="5" /></p>
  <p><copy source="_math1" assignNames="dec5apad" displayDecimals="5" padZeros /></p>
  <p><copy source="_math2" assignNames="dec5b" displayDecimals="5" /></p>
  <p><copy source="_math2" assignNames="dec5bpad" displayDecimals="5" padZeros /></p>
  <p><copy source="_math3" assignNames="dec5c" displayDecimals="5" /></p>
  <p><copy source="_math3" assignNames="dec5cpad" displayDecimals="5" padZeros /></p>
  <p><copy source="_math1" assignNames="dig5dec1a" displayDigits="5" displayDecimals="1" /></p>
  <p><copy source="_math1" assignNames="dig5dec1apad" displayDigits="5" displayDecimals="1" padZeros /></p>
  <p><copy source="_math2" assignNames="dig5dec1b" displayDigits="5" displayDecimals="1" /></p>
  <p><copy source="_math2" assignNames="dig5dec1bpad" displayDigits="5" displayDecimals="1" padZeros /></p>
  <p><copy source="_math3" assignNames="dig5dec1c" displayDigits="5" displayDecimals="1" /></p>
  <p><copy source="_math3" assignNames="dig5dec1cpad" displayDigits="5" displayDecimals="1" padZeros /></p>

  <p><copy prop="text" source="dig5a" assignNames="dig5aText" /></p>
  <p><copy prop="text" source="dig5apad" assignNames="dig5apadText" /></p>
  <p><copy prop="text" source="dig5b" assignNames="dig5bText" /></p>
  <p><copy prop="text" source="dig5bpad" assignNames="dig5bpadText" /></p>
  <p><copy prop="text" source="dig5c" assignNames="dig5cText" /></p>
  <p><copy prop="text" source="dig5cpad" assignNames="dig5cpadText" /></p>
  <p><copy prop="text" source="dec5a" assignNames="dec5aText" /></p>
  <p><copy prop="text" source="dec5apad" assignNames="dec5apadText" /></p>
  <p><copy prop="text" source="dec5b" assignNames="dec5bText" /></p>
  <p><copy prop="text" source="dec5bpad" assignNames="dec5bpadText" /></p>
  <p><copy prop="text" source="dec5c" assignNames="dec5cText" /></p>
  <p><copy prop="text" source="dec5cpad" assignNames="dec5cpadText" /></p>
  <p><copy prop="text" source="dig5dec1a" assignNames="dig5dec1aText" /></p>
  <p><copy prop="text" source="dig5dec1apad" assignNames="dig5dec1apadText" /></p>
  <p><copy prop="text" source="dig5dec1b" assignNames="dig5dec1bText" /></p>
  <p><copy prop="text" source="dig5dec1bpad" assignNames="dig5dec1bpadText" /></p>
  <p><copy prop="text" source="dig5dec1c" assignNames="dig5dec1cText" /></p>
  <p><copy prop="text" source="dig5dec1cpad" assignNames="dig5dec1cpadText" /></p>

  <p><copy prop="value" source="dig5a" assignNames="dig5aValue" /></p>
  <p><copy prop="value" source="dig5apad" assignNames="dig5apadValue" /></p>
  <p><copy prop="value" source="dig5b" assignNames="dig5bValue" /></p>
  <p><copy prop="value" source="dig5bpad" assignNames="dig5bpadValue" /></p>
  <p><copy prop="value" source="dig5c" assignNames="dig5cValue" /></p>
  <p><copy prop="value" source="dig5cpad" assignNames="dig5cpadValue" /></p>
  <p><copy prop="value" source="dec5a" assignNames="dec5aValue" /></p>
  <p><copy prop="value" source="dec5apad" assignNames="dec5apadValue" /></p>
  <p><copy prop="value" source="dec5b" assignNames="dec5bValue" /></p>
  <p><copy prop="value" source="dec5bpad" assignNames="dec5bpadValue" /></p>
  <p><copy prop="value" source="dec5c" assignNames="dec5cValue" /></p>
  <p><copy prop="value" source="dec5cpad" assignNames="dec5cpadValue" /></p>
  <p><copy prop="value" source="dig5dec1a" assignNames="dig5dec1aValue" /></p>
  <p><copy prop="value" source="dig5dec1apad" assignNames="dig5dec1apadValue" /></p>
  <p><copy prop="value" source="dig5dec1b" assignNames="dig5dec1bValue" /></p>
  <p><copy prop="value" source="dig5dec1bpad" assignNames="dig5dec1bpadValue" /></p>
  <p><copy prop="value" source="dig5dec1c" assignNames="dig5dec1cValue" /></p>
  <p><copy prop="value" source="dig5dec1cpad" assignNames="dig5dec1cpadValue" /></p>

  <p><copy prop="number" source="dig5a" assignNames="dig5aNumber" /></p>
  <p><copy prop="number" source="dig5apad" assignNames="dig5apadNumber" /></p>
  <p><copy prop="number" source="dig5b" assignNames="dig5bNumber" /></p>
  <p><copy prop="number" source="dig5bpad" assignNames="dig5bpadNumber" /></p>
  <p><copy prop="number" source="dig5c" assignNames="dig5cNumber" /></p>
  <p><copy prop="number" source="dig5cpad" assignNames="dig5cpadNumber" /></p>
  <p><copy prop="number" source="dec5a" assignNames="dec5aNumber" /></p>
  <p><copy prop="number" source="dec5apad" assignNames="dec5apadNumber" /></p>
  <p><copy prop="number" source="dec5b" assignNames="dec5bNumber" /></p>
  <p><copy prop="number" source="dec5bpad" assignNames="dec5bpadNumber" /></p>
  <p><copy prop="number" source="dec5c" assignNames="dec5cNumber" /></p>
  <p><copy prop="number" source="dec5cpad" assignNames="dec5cpadNumber" /></p>
  <p><copy prop="number" source="dig5dec1a" assignNames="dig5dec1aNumber" /></p>
  <p><copy prop="number" source="dig5dec1apad" assignNames="dig5dec1apadNumber" /></p>
  <p><copy prop="number" source="dig5dec1b" assignNames="dig5dec1bNumber" /></p>
  <p><copy prop="number" source="dig5dec1bpad" assignNames="dig5dec1bpadNumber" /></p>
  <p><copy prop="number" source="dig5dec1c" assignNames="dig5dec1cNumber" /></p>
  <p><copy prop="number" source="dig5dec1cpad" assignNames="dig5dec1cpadNumber" /></p>

  <p><math name="dig5aMath">$dig5a</math></p>
  <p><math name="dig5apadMath">$dig5apad</math></p>
  <p><math name="dig5bMath">$dig5b</math></p>
  <p><math name="dig5bpadMath">$dig5bpad</math></p>
  <p><math name="dig5cMath">$dig5c</math></p>
  <p><math name="dig5cpadMath">$dig5cpad</math></p>
  <p><math name="dec5aMath">$dec5a</math></p>
  <p><math name="dec5apadMath">$dec5apad</math></p>
  <p><math name="dec5bMath">$dec5b</math></p>
  <p><math name="dec5bpadMath">$dec5bpad</math></p>
  <p><math name="dec5cMath">$dec5c</math></p>
  <p><math name="dec5cpadMath">$dec5cpad</math></p>
  <p><math name="dig5dec1aMath">$dig5dec1a</math></p>
  <p><math name="dig5dec1apadMath">$dig5dec1apad</math></p>
  <p><math name="dig5dec1bMath">$dig5dec1b</math></p>
  <p><math name="dig5dec1bpadMath">$dig5dec1bpad</math></p>
  <p><math name="dig5dec1cMath">$dig5dec1c</math></p>
  <p><math name="dig5dec1cpadMath">$dig5dec1cpad</math></p>

  <p><number name="dig5aNumber2">$dig5a</number></p>
  <p><number name="dig5apadNumber2">$dig5apad</number></p>
  <p><number name="dig5bNumber2">$dig5b</number></p>
  <p><number name="dig5bpadNumber2">$dig5bpad</number></p>
  <p><number name="dig5cNumber2">$dig5c</number></p>
  <p><number name="dig5cpadNumber2">$dig5cpad</number></p>
  <p><number name="dec5aNumber2">$dec5a</number></p>
  <p><number name="dec5apadNumber2">$dec5apad</number></p>
  <p><number name="dec5bNumber2">$dec5b</number></p>
  <p><number name="dec5bpadNumber2">$dec5bpad</number></p>
  <p><number name="dec5cNumber2">$dec5c</number></p>
  <p><number name="dec5cpadNumber2">$dec5cpad</number></p>
  <p><number name="dig5dec1aNumber2">$dig5dec1a</number></p>
  <p><number name="dig5dec1apadNumber2">$dig5dec1apad</number></p>
  <p><number name="dig5dec1bNumber2">$dig5dec1b</number></p>
  <p><number name="dig5dec1bpadNumber2">$dig5dec1bpad</number></p>
  <p><number name="dig5dec1cNumber2">$dig5dec1c</number></p>
  <p><number name="dig5dec1cpadNumber2">$dig5dec1cpad</number></p>

  <p><copy prop="x1" source="dig5a" assignNames="dig5aX1" /></p>
  <p><copy prop="x1" source="dig5apad" assignNames="dig5apadX1" /></p>
  <p><copy prop="x1" source="dig5b" assignNames="dig5bX1" /></p>
  <p><copy prop="x1" source="dig5bpad" assignNames="dig5bpadX1" /></p>
  <p><copy prop="x1" source="dig5c" assignNames="dig5cX1" /></p>
  <p><copy prop="x1" source="dig5cpad" assignNames="dig5cpadX1" /></p>
  <p><copy prop="x1" source="dec5a" assignNames="dec5aX1" /></p>
  <p><copy prop="x1" source="dec5apad" assignNames="dec5apadX1" /></p>
  <p><copy prop="x1" source="dec5b" assignNames="dec5bX1" /></p>
  <p><copy prop="x1" source="dec5bpad" assignNames="dec5bpadX1" /></p>
  <p><copy prop="x1" source="dec5c" assignNames="dec5cX1" /></p>
  <p><copy prop="x1" source="dec5cpad" assignNames="dec5cpadX1" /></p>
  <p><copy prop="x1" source="dig5dec1a" assignNames="dig5dec1aX1" /></p>
  <p><copy prop="x1" source="dig5dec1apad" assignNames="dig5dec1apadX1" /></p>
  <p><copy prop="x1" source="dig5dec1b" assignNames="dig5dec1bX1" /></p>
  <p><copy prop="x1" source="dig5dec1bpad" assignNames="dig5dec1bpadX1" /></p>
  <p><copy prop="x1" source="dig5dec1c" assignNames="dig5dec1cX1" /></p>
  <p><copy prop="x1" source="dig5dec1cpad" assignNames="dig5dec1cpadX1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })

    cy.get('#\\/dig5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dig5apad').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get('#\\/dig5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dig5bpad').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get('#\\/dig5c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dig5cpad').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })
    cy.get('#\\/dec5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dec5apad').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.10000')
    })
    cy.get('#\\/dec5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dec5bpad').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10000⋅10−3')
    })
    cy.get('#\\/dec5c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dec5cpad').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.30000x+4.00000π')
    })
    cy.get('#\\/dig5dec1a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dig5dec1apad').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get('#\\/dig5dec1b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dig5dec1bpad').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get('#\\/dig5dec1c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dig5dec1cpad').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })

    cy.get('#\\/dig5aText').should('have.text', '62.1')
    cy.get('#\\/dig5apadText').should('have.text', '62.100')
    cy.get('#\\/dig5bText').should('have.text', '162.1 * 10^(-3)')
    cy.get('#\\/dig5bpadText').should('have.text', '162.10 * 10^(-3)')
    cy.get('#\\/dig5cText').should('have.text', '1.3 x + 4 π')
    cy.get('#\\/dig5cpadText').should('have.text', '1.3000 x + 4.0000 π')
    cy.get('#\\/dec5aText').should('have.text', '62.1')
    cy.get('#\\/dec5apadText').should('have.text', '62.10000')
    cy.get('#\\/dec5bText').should('have.text', '162.1 * 10^(-3)')
    cy.get('#\\/dec5bpadText').should('have.text', '162.10000 * 10^(-3)')
    cy.get('#\\/dec5cText').should('have.text', '1.3 x + 4 π')
    cy.get('#\\/dec5cpadText').should('have.text', '1.30000 x + 4.00000 π')
    cy.get('#\\/dig5dec1aText').should('have.text', '62.1')
    cy.get('#\\/dig5dec1apadText').should('have.text', '62.100')
    cy.get('#\\/dig5dec1bText').should('have.text', '162.1 * 10^(-3)')
    cy.get('#\\/dig5dec1bpadText').should('have.text', '162.10 * 10^(-3)')
    cy.get('#\\/dig5dec1cText').should('have.text', '1.3 x + 4 π')
    cy.get('#\\/dig5dec1cpadText').should('have.text', '1.3000 x + 4.0000 π')


    cy.get('#\\/dig5aValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dig5apadValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get('#\\/dig5bValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dig5bpadValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get('#\\/dig5cValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dig5cpadValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })
    cy.get('#\\/dec5aValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dec5apadValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.10000')
    })
    cy.get('#\\/dec5bValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dec5bpadValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10000⋅10−3')
    })
    cy.get('#\\/dec5cValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dec5cpadValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.30000x+4.00000π')
    })
    cy.get('#\\/dig5dec1aValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dig5dec1apadValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get('#\\/dig5dec1bValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dig5dec1bpadValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get('#\\/dig5dec1cValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dig5dec1cpadValue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })


    cy.get('#\\/dig5aNumber').should('have.text', '62.1')
    cy.get('#\\/dig5apadNumber').should('have.text', '62.100')
    cy.get('#\\/dig5bNumber').should('have.text', '0.1621')
    cy.get('#\\/dig5bpadNumber').should('have.text', '0.16210')
    cy.get('#\\/dig5cNumber').should('have.text', 'NaN')
    cy.get('#\\/dig5cpadNumber').should('have.text', 'NaN')
    cy.get('#\\/dec5aNumber').should('have.text', '62.1')
    cy.get('#\\/dec5apadNumber').should('have.text', '62.10000')
    cy.get('#\\/dec5bNumber').should('have.text', '0.1621')
    cy.get('#\\/dec5bpadNumber').should('have.text', '0.16210')
    cy.get('#\\/dec5cNumber').should('have.text', 'NaN')
    cy.get('#\\/dec5cpadNumber').should('have.text', 'NaN')
    cy.get('#\\/dig5dec1aNumber').should('have.text', '62.1')
    cy.get('#\\/dig5dec1apadNumber').should('have.text', '62.100')
    cy.get('#\\/dig5dec1bNumber').should('have.text', '0.1621')
    cy.get('#\\/dig5dec1bpadNumber').should('have.text', '0.16210')
    cy.get('#\\/dig5dec1cNumber').should('have.text', 'NaN')
    cy.get('#\\/dig5dec1cpadNumber').should('have.text', 'NaN')


    cy.get('#\\/dig5aMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dig5apadMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get('#\\/dig5bMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dig5bpadMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get('#\\/dig5cMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dig5cpadMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })
    cy.get('#\\/dec5aMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dec5apadMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.10000')
    })
    cy.get('#\\/dec5bMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dec5bpadMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10000⋅10−3')
    })
    cy.get('#\\/dec5cMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dec5cpadMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.30000x+4.00000π')
    })
    cy.get('#\\/dig5dec1aMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dig5dec1apadMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get('#\\/dig5dec1bMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dig5dec1bpadMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get('#\\/dig5dec1cMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dig5dec1cpadMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })


    cy.get('#\\/dig5aNumber2').should('have.text', '62.1')
    cy.get('#\\/dig5apadNumber2').should('have.text', '62.100')
    cy.get('#\\/dig5bNumber2').should('have.text', '0.1621')
    cy.get('#\\/dig5bpadNumber2').should('have.text', '0.16210')
    cy.get('#\\/dig5cNumber2').should('have.text', 'NaN')
    cy.get('#\\/dig5cpadNumber2').should('have.text', 'NaN')
    cy.get('#\\/dec5aNumber2').should('have.text', '62.1')
    cy.get('#\\/dec5apadNumber2').should('have.text', '62.10000')
    cy.get('#\\/dec5bNumber2').should('have.text', '0.1621')
    cy.get('#\\/dec5bpadNumber2').should('have.text', '0.16210')
    cy.get('#\\/dec5cNumber2').should('have.text', 'NaN')
    cy.get('#\\/dec5cpadNumber2').should('have.text', 'NaN')
    cy.get('#\\/dig5dec1aNumber2').should('have.text', '62.1')
    cy.get('#\\/dig5dec1apadNumber2').should('have.text', '62.100')
    cy.get('#\\/dig5dec1bNumber2').should('have.text', '0.1621')
    cy.get('#\\/dig5dec1bpadNumber2').should('have.text', '0.16210')
    cy.get('#\\/dig5dec1cNumber2').should('have.text', 'NaN')
    cy.get('#\\/dig5dec1cpadNumber2').should('have.text', 'NaN')



    cy.get('#\\/dig5aX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dig5apadX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get('#\\/dig5bX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dig5bpadX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get('#\\/dig5cX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dig5cpadX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })
    cy.get('#\\/dec5aX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dec5apadX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.10000')
    })
    cy.get('#\\/dec5bX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dec5bpadX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10000⋅10−3')
    })
    cy.get('#\\/dec5cX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dec5cpadX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.30000x+4.00000π')
    })
    cy.get('#\\/dig5dec1aX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get('#\\/dig5dec1apadX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get('#\\/dig5dec1bX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get('#\\/dig5dec1bpadX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get('#\\/dig5dec1cX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get('#\\/dig5dec1cpadX1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })


  });

  it('dynamic rounding', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>Number: <math name="n">35203423.02352343201</math></p>
      <p>Number of digits: <mathinput name="ndigits" prefill="3" /></p>
      <p>Number of decimals: <mathinput name="ndecimals" prefill="3" /></p>
      <p><copy source="n" displayDigits='$ndigits' assignNames="na" /></p>
      <p><copy source="n" displayDecimals='$ndecimals' assignNames="nb" /></p>
      <p><copy prop="value" source="ndecimals" assignNames="ndecimals2" /></p>
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
    cy.get('#\\/ndecimals2').should('contain.text', '5')
    cy.get('#\\/na').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423.0235')
    })
    cy.get('#\\/nb').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423.02352')
    })

    cy.log('invalid precision means default rounding of 10 digits')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}{backspace}x{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}{backspace}y{enter}", { force: true });
    cy.get('#\\/ndecimals2').should('contain.text', 'y')
    cy.get('#\\/na').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('35203423.02')
    })
    cy.get('#\\/nb').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('35203423.02')
    })

    cy.log('low precision')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/ndecimals2').should('contain.text', '1')
    cy.get('#\\/na').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('40000000')
    })
    cy.get('#\\/nb').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423')
    })

    cy.log('negative precision, default rounding from negative displayDigits')
    cy.get('#\\/ndigits textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.get('#\\/ndecimals textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.get('#\\/ndecimals2').should('contain.text', `${nInDOM(-3)}`)
    cy.get('#\\/na').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('35203423.02')
    })
    cy.get('#\\/nb').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203000')
    })

  })


  it('function symbols', () => {
    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(["apply", "f", "x"]);
      expect(stateVariables['/_math2'].stateValues.value).eqls(["apply", "g", "t"]);
      expect(stateVariables['/_math3'].stateValues.value).eqls(["*", "h", "z"]);
      expect(stateVariables['/_math4'].stateValues.value).eqls(["*", "f", "x"]);
      expect(stateVariables['/_math5'].stateValues.value).eqls(["apply", "g", "t"]);
      expect(stateVariables['/_math6'].stateValues.value).eqls(["apply", "h", "z"]);

    });


  });

  it('copy and overwrite function symbols', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <math name="m1">f(x)+m(x)</math>
  <copy source="m1" functionSymbols="m" assignNames="m2" />
  <copy source="m2" functionSymbols="m f" assignNames="m3" />

  <math name="m4" functionSymbols="m f">f(x)+m(x)</math>
  <copy source="m4" functionSymbols="m" assignNames="m5" />
  <copy source="m5" functionSymbols="f" assignNames="m6" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)+mx')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('fx+m(x)')
    })
    cy.get('#\\/m3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)+m(x)')
    })
    cy.get('#\\/m4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)+m(x)')
    })
    cy.get('#\\/m5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('fx+m(x)')
    })
    cy.get('#\\/m6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)+mx')
    })

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/m1'].stateValues.value).eqls(["+", ["apply", "f", "x"], ["*", "m", "x"]]);
      expect(stateVariables['/m2'].stateValues.value).eqls(["+", ["*", "f", "x"], ["apply", "m", "x"]]);
      expect(stateVariables['/m3'].stateValues.value).eqls(["+", ["apply", "f", "x"], ["apply", "m", "x"]]);
      expect(stateVariables['/m4'].stateValues.value).eqls(["+", ["apply", "f", "x"], ["apply", "m", "x"]]);
      expect(stateVariables['/m5'].stateValues.value).eqls(["+", ["*", "f", "x"], ["apply", "m", "x"]]);
      expect(stateVariables['/m6'].stateValues.value).eqls(["+", ["apply", "f", "x"], ["*", "m", "x"]]);

    });


  });

  it('sourcesAreFunctionSymbols', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><select assignNames="f">f g h k m n</select></p>
  <p><select assignNames="x">s t u v w x y z</select></p>

  <p><math>$f($x)</math></p>
  <p><math>$x($f)</math></p>
  <p><math sourcesAreFunctionSymbols="f">$f($x)</math></p>
  <p><math sourcesAreFunctionSymbols="f">$x($f)</math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = stateVariables["/f"].stateValues.value;
      let x = stateVariables["/x"].stateValues.value;

      cy.log('Test value displayed in browser')
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}${x}`)
      })
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${x}${f}`)
      })
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}(${x})`)
      })
      cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${x}${f}`)
      })

      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_math1'].stateValues.value).eqls(["*", f, x]);
        expect(stateVariables['/_math2'].stateValues.value).eqls(["*", x, f]);
        expect(stateVariables['/_math3'].stateValues.value).eqls(["apply", f, x]);
        expect(stateVariables['/_math4'].stateValues.value).eqls(["*", x, f]);

      });
    })


  });

  it('copy and overwrite sourcesAreFunctionSymbols', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><select assignNames="f">f g h k m n</select></p>

  <p><math name="m1">$f(x)</math></p>
  <p><copy source="m1" sourcesAreFunctionSymbols="f" assignNames="m2" /></p>
  <p><copy source="m2" sourcesAreFunctionSymbols="" assignNames="m3" /></p>

  <p><math name="m4" sourcesAreFunctionSymbols="f">$f(x)</math></p>
  <p><copy source="m4" sourcesAreFunctionSymbols="" assignNames="m5" /></p>
  <p><copy source="m5" sourcesAreFunctionSymbols="f" assignNames="m6" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = stateVariables["/f"].stateValues.value;

      cy.log('Test value displayed in browser')
      cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}x`)
      })
      cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}(x)`)
      })
      cy.get('#\\/m3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}x`)
      })
      cy.get('#\\/m4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}(x)`)
      })
      cy.get('#\\/m5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}x`)
      })
      cy.get('#\\/m6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}(x)`)
      })


      cy.log('Test internal values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/m1'].stateValues.value).eqls(["*", f, "x"]);
        expect(stateVariables['/m2'].stateValues.value).eqls(["apply", f, "x"]);
        expect(stateVariables['/m3'].stateValues.value).eqls(["*", f, "x"]);
        expect(stateVariables['/m4'].stateValues.value).eqls(["apply", f, "x"]);
        expect(stateVariables['/m5'].stateValues.value).eqls(["*", f, "x"]);
        expect(stateVariables['/m6'].stateValues.value).eqls(["apply", f, "x"]);

      });
    })


  });

  it('copy and overwrite simplify', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="m1">x+x</math></p>
  <p><copy source="m1" simplify assignNames="m2" /></p>
  <p><copy source="m2" simplify="none" assignNames="m3" /></p>
  <p><copy source="m1.value" simplify assignNames="m2a" /></p>
  <p><copy source="m2.value" simplify="none" assignNames="m3a" /></p>

  <p><math name="m4" simplify>x+x</math></p>
  <p><copy source="m4" simplify="none" assignNames="m5" /></p>
  <p><copy source="m5" simplify assignNames="m6" /></p>
  <p><copy source="m4.value" simplify="none" assignNames="m5a" /></p>
  <p><copy source="m5a.value" simplify assignNames="m6a" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get('#\\/m3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x')
    })
    cy.get('#\\/m2a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get('#\\/m3a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get('#\\/m4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get('#\\/m5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x')
    })
    cy.get('#\\/m6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get('#\\/m5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get('#\\/m6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/m1'].stateValues.value).eqls(["+", "x", "x"]);
      expect(stateVariables['/m2'].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables['/m3'].stateValues.value).eqls(["+", "x", "x"]);
      expect(stateVariables['/m2a'].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables['/m3a'].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables['/m4'].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables['/m5'].stateValues.value).eqls(["+", "x", "x"]);
      expect(stateVariables['/m6'].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables['/m5a'].stateValues.value).eqls(["*", 2, "x"]);
      expect(stateVariables['/m6a'].stateValues.value).eqls(["*", 2, "x"]);


    });

  });

  it('split symbols', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="m1">xyz</math></p>
  <p><math name="m2" splitSymbols="false">xyz</math></p>
  <p><math name="m3" splitSymbols="true">xyz</math></p>
  <p><math name="m4" simplify>xyx</math></p>
  <p><math name="m5" simplify splitSymbols="false">xyx</math></p>
  <p><math name="m6" simplify splitSymbols="true">xyx</math></p>
  <p><math name="m7">xy_uv</math></p>
  <p><math name="m8">x2_2x</math></p>
  <p><math name="m9">2x_x2</math></p>
  <p><math name="m10">xy uv x2y 2x x2</math></p>
  <p><math name="m11" splitSymbols="false">xy_uv</math></p>
  <p><math name="m12" splitSymbols="false">x2_2x</math></p>
  <p><math name="m13" splitSymbols="false">2x_x2</math></p>
  <p><math name="m14" splitSymbols="false">xy uv x2y 2x x2</math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get('#\\/m5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get('#\\/m6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get('#\\/m7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get('#\\/m8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get('#\\/m9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get('#\\/m10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get('#\\/m11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get('#\\/m12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get('#\\/m13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get('#\\/m14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/m1'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/m2'].stateValues.value).eqls("xyz");
      expect(stateVariables['/m3'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/m4'].stateValues.value).eqls(["*", "y", ["^", "x", 2]]);
      expect(stateVariables['/m5'].stateValues.value).eqls("xyx");
      expect(stateVariables['/m6'].stateValues.value).eqls(["*", "y", ["^", "x", 2]]);
      expect(stateVariables['/m7'].stateValues.value).eqls(["*", "x", ["_", "y", "u"], "v"]);
      expect(stateVariables['/m8'].stateValues.value).eqls(["*", ["_", "x2", 2], "x"]);
      expect(stateVariables['/m9'].stateValues.value).eqls(["*", 2, ["_", "x", "x2"]]);
      expect(stateVariables['/m10'].stateValues.value).eqls(["*", "x", "y", "u", "v", "x2y", 2, "x", "x2"]);
      expect(stateVariables['/m11'].stateValues.value).eqls(["_", "xy", "uv"]);
      expect(stateVariables['/m12'].stateValues.value).eqls(["*", ["_", "x2", 2], "x"]);
      expect(stateVariables['/m13'].stateValues.value).eqls(["*", 2, ["_", "x", "x2"]]);
      expect(stateVariables['/m14'].stateValues.value).eqls(["*", "xy", "uv", "x2y", 2, "x", "x2"]);

    });

  });

  it('split symbols, nested', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="m1"><math>xyz</math></math></p>
  <p><math name="m2" splitSymbols="false"><math>xyz</math></math></p>
  <p><math name="m3" splitSymbols="true"><math>xyz</math></math></p>
  <p><math name="m4" simplify><math>xyx</math></math></p>
  <p><math name="m5" simplify splitSymbols="false"><math>xyx</math></math></p>
  <p><math name="m6" simplify splitSymbols="true"><math>xyx</math></math></p>
  <p><math name="m7"><math>xy_uv</math></math></p>
  <p><math name="m8"><math>x2_2x</math></math></p>
  <p><math name="m9"><math>2x_x2</math></math></p>
  <p><math name="m10"><math>xy uv x2y 2x x2</math></math></p>
  <p><math name="m11" splitSymbols="false"><math>xy_uv</math></math></p>
  <p><math name="m12" splitSymbols="false"><math>x2_2x</math></math></p>
  <p><math name="m13" splitSymbols="false"><math>2x_x2</math></math></p>
  <p><math name="m14" splitSymbols="false"><math>xy uv x2y 2x x2</math></math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get('#\\/m5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get('#\\/m6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get('#\\/m7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get('#\\/m8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get('#\\/m9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get('#\\/m10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get('#\\/m11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get('#\\/m12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get('#\\/m13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get('#\\/m14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/m1'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/m2'].stateValues.value).eqls("xyz");
      expect(stateVariables['/m3'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/m4'].stateValues.value).eqls(["*", "y", ["^", "x", 2]]);
      expect(stateVariables['/m5'].stateValues.value).eqls("xyx");
      expect(stateVariables['/m6'].stateValues.value).eqls(["*", "y", ["^", "x", 2]]);
      expect(stateVariables['/m7'].stateValues.value).eqls(["*", "x", ["_", "y", "u"], "v"]);
      expect(stateVariables['/m8'].stateValues.value).eqls(["*", ["_", "x2", 2], "x"]);
      expect(stateVariables['/m9'].stateValues.value).eqls(["*", 2, ["_", "x", "x2"]]);
      expect(stateVariables['/m10'].stateValues.value).eqls(["*", "x", "y", "u", "v", "x2y", 2, "x", "x2"]);
      expect(stateVariables['/m11'].stateValues.value).eqls(["_", "xy", "uv"]);
      expect(stateVariables['/m12'].stateValues.value).eqls(["*", ["_", "x2", 2], "x"]);
      expect(stateVariables['/m13'].stateValues.value).eqls(["*", 2, ["_", "x", "x2"]]);
      expect(stateVariables['/m14'].stateValues.value).eqls(["*", "xy", "uv", "x2y", 2, "x", "x2"]);

    });

  });

  it('split symbols, latex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math format="latex" name="m1">xyz</math></p>
  <p><math format="latex" name="m2" splitSymbols="false">xyz</math></p>
  <p><math format="latex" name="m2a" >\\var{xyz}</math></p>
  <p><math format="latex" name="m2b" splitSymbols="false" >\\var{xyz}</math></p>
  <p><math format="latex" name="m3" splitSymbols="true">xyz</math></p>
  <p><math format="latex" name="m4" simplify>xyx</math></p>
  <p><math format="latex" name="m5" simplify splitSymbols="false">xyx</math></p>
  <p><math format="latex" name="m5a" simplify>\\var{xyx}</math></p>
  <p><math format="latex" name="m5b" simplify splitSymbols="false">\\var{xyx}</math></p>
  <p><math format="latex" name="m6" simplify splitSymbols="true">xyx</math></p>
  <p><math format="latex" name="m7">xy_uv</math></p>
  <p><math format="latex" name="m8">x2_2x</math></p>
  <p><math format="latex" name="m8a">\\var{x2}_2x</math></p>
  <p><math format="latex" name="m9">2x_x2</math></p>
  <p><math format="latex" name="m9a">2x_\\var{x2}</math></p>
  <p><math format="latex" name="m10">xy uv x2y 2x x2</math></p>
  <p><math format="latex" name="m10a">xy uv \\var{x2y} 2x \\var{x2}</math></p>
  <p><math format="latex" name="m11" splitSymbols="false">xy_uv</math></p>
  <p><math format="latex" name="m11a">\\var{xy}_\\var{uv}</math></p>
  <p><math format="latex" name="m11b" splitSymbols="false">\\var{xy}_\\var{uv}</math></p>
  <p><math format="latex" name="m12" splitSymbols="false">x2_2x</math></p>
  <p><math format="latex" name="m12a" splitSymbols="false">\\var{x2}_2x</math></p>
  <p><math format="latex" name="m13" splitSymbols="false">2x_x2</math></p>
  <p><math format="latex" name="m13a" splitSymbols="false">2x_\\var{x2}</math></p>
  <p><math format="latex" name="m14" splitSymbols="false">xy uv x2y 2x x2</math></p>
  <p><math format="latex" name="m14a">\\var{xy} \\var{uv} x2y 2x x2</math></p>
  <p><math format="latex" name="m14b" splitSymbols="false">\\var{xy} \\var{uv} x2y 2x x2</math></p>
  <p><math format="latex" name="m15">3^x2</math></p>
  <p><math format="latex" name="m15a" splitSymbols="false">3^x2</math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m2a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m2b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get('#\\/m5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get('#\\/m5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get('#\\/m5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get('#\\/m6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get('#\\/m7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get('#\\/m8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get('#\\/m8a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get('#\\/m9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get('#\\/m9a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get('#\\/m10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get('#\\/m10a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get('#\\/m11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get('#\\/m11a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get('#\\/m11b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get('#\\/m12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get('#\\/m12a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get('#\\/m13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get('#\\/m13a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get('#\\/m14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get('#\\/m14a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get('#\\/m14b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get('#\\/m15').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x⋅2')
    })
    cy.get('#\\/m15a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x2')
    })

    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/m1'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/m2'].stateValues.value).eqls("xyz");
      expect(stateVariables['/m2a'].stateValues.value).eqls("xyz");
      expect(stateVariables['/m2b'].stateValues.value).eqls("xyz");
      expect(stateVariables['/m3'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/m4'].stateValues.value).eqls(["*", "y", ["^", "x", 2]]);
      expect(stateVariables['/m5'].stateValues.value).eqls("xyx");
      expect(stateVariables['/m5a'].stateValues.value).eqls("xyx");
      expect(stateVariables['/m5b'].stateValues.value).eqls("xyx");
      expect(stateVariables['/m6'].stateValues.value).eqls(["*", "y", ["^", "x", 2]]);
      expect(stateVariables['/m7'].stateValues.value).eqls(["*", "x", ["_", "y", "u"], "v"]);
      expect(stateVariables['/m8'].stateValues.value).eqls(["*", ["_", "x2", 2], "x"]);
      expect(stateVariables['/m8a'].stateValues.value).eqls(["*", ["_", "x2", 2], "x"]);
      expect(stateVariables['/m9'].stateValues.value).eqls(["*", 2, ["_", "x", "x2"]]);
      expect(stateVariables['/m9a'].stateValues.value).eqls(["*", 2, ["_", "x", "x2"]]);
      expect(stateVariables['/m10'].stateValues.value).eqls(["*", "x", "y", "u", "v", "x2y", 2, "x", "x2"]);
      expect(stateVariables['/m10a'].stateValues.value).eqls(["*", "x", "y", "u", "v", "x2y", 2, "x", "x2"]);
      expect(stateVariables['/m11'].stateValues.value).eqls(["_", "xy", "uv"]);
      expect(stateVariables['/m11a'].stateValues.value).eqls(["_", "xy", "uv"]);
      expect(stateVariables['/m11b'].stateValues.value).eqls(["_", "xy", "uv"]);
      expect(stateVariables['/m12'].stateValues.value).eqls(["*", ["_", "x2", 2], "x"]);
      expect(stateVariables['/m12a'].stateValues.value).eqls(["*", ["_", "x2", 2], "x"]);
      expect(stateVariables['/m13'].stateValues.value).eqls(["*", 2, ["_", "x", "x2"]]);
      expect(stateVariables['/m13a'].stateValues.value).eqls(["*", 2, ["_", "x", "x2"]]);
      expect(stateVariables['/m14'].stateValues.value).eqls(["*", "xy", "uv", "x2y", 2, "x", "x2"]);
      expect(stateVariables['/m14a'].stateValues.value).eqls(["*", "xy", "uv", "x2y", 2, "x", "x2"]);
      expect(stateVariables['/m14b'].stateValues.value).eqls(["*", "xy", "uv", "x2y", 2, "x", "x2"]);
      expect(stateVariables['/m15'].stateValues.value).eqls(["*", ["^", 3, "x"], 2]);
      expect(stateVariables['/m15a'].stateValues.value).eqls(["^", 3, "x2"]);

    });

  });

  it('copy and overwrite split symbols', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="m1">xyz</math></p>
  <p><copy source="m1" splitsymbols="false" assignNames="m2" /></p>
  <p><copy source="m2" splitsymbols assignNames="m3" /></p>

  <p><math name="m4" splitSymbols="false">xyz</math></p>
  <p><copy source="m4" splitsymbols assignNames="m5" /></p>
  <p><copy source="m5" splitsymbols="false" assignNames="m6" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/m6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })


    cy.log('Test internal values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/m1'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/m2'].stateValues.value).eqls("xyz");
      expect(stateVariables['/m3'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/m4'].stateValues.value).eqls("xyz");
      expect(stateVariables['/m5'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/m6'].stateValues.value).eqls("xyz");

    });

  });

  it('merge lists with other containers', () => {
    cy.window().then(async (win) => {
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
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/set'].stateValues.value).eqls(["set", "a", "b", "c"]);
      // expect(stateVariables['/tuple'].stateValues.value).eqls(["tuple", "a", "b", "c"]);
      expect(stateVariables['/combinedSet'].stateValues.value).eqls(["set", "a", "b", "c", "d", "e", "f"]);
      expect(stateVariables['/combinedTuple'].stateValues.value).eqls(["tuple", "a", "b", "c", "d", "e", "f"]);

    });

  });

  it('components of math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><mathinput name="m" prefill="(a,b,c)" /></p>
  <p><math name="m2">$m</math></p>
  <p><math name="m3" createVectors>$m</math></p>
  <p>Ndimensions: <extract prop="nDimensions" assignNames="nDim1">$m</extract> <copy prop="nDimensions" source="m2" assignNames="nDim2" /> <copy prop="nDimensions" source="m3" assignNames="nDim3" /></p>
  <p>x: <extract prop="x" assignNames="x">$m</extract> <copy prop="x" source="m2" assignNames="x_2" /> <copy prop="x" source="m3" assignNames="x_3" /></p>
  <p>y: <extract prop="y" assignNames="y">$m</extract> <copy prop="y" source="m2" assignNames="y_2" /> <copy prop="y" source="m3" assignNames="y_3" /></p>
  <p>z: <extract prop="z" assignNames="z">$m</extract> <copy prop="z" source="m2" assignNames="z_2" /> <copy prop="z" source="m3" assignNames="z_3" /></p>
  <p>x1: <extract prop="x1" assignNames="x1">$m</extract> <copy prop="x1" source="m2" assignNames="x1_2" /> <copy prop="x1" source="m3" assignNames="x1_3" /></p>
  <p>x2: <extract prop="x2" assignNames="x2">$m</extract> <copy prop="x2" source="m2" assignNames="x2_2" /> <copy prop="x2" source="m3" assignNames="x2_3" /></p>
  <p>x3: <extract prop="x3" assignNames="x3">$m</extract> <copy prop="x3" source="m2" assignNames="x3_2" /> <copy prop="x3" source="m3" assignNames="x3_3" /></p>
  <p>x4: <extract prop="x4" assignNames="x4">$m</extract> <copy prop="x4" source="m2" assignNames="x4_2" /> <copy prop="x4" source="m3" assignNames="x4_3" /></p>
  <p>x: <mathinput bindValueTo="$x" name="mx" /> <mathinput bindValueTo="$m2.x" name="mx_2" /> <mathinput bindValueTo="$m3.x" name="mx_3" /></p>
  <p>y: <mathinput bindValueTo="$y" name="my" /> <mathinput bindValueTo="$m2.y" name="my_2" /> <mathinput bindValueTo="$m3.y" name="my_3" /></p>
  <p>z: <mathinput bindValueTo="$z" name="mz" /> <mathinput bindValueTo="$m2.z" name="mz_2" /> <mathinput bindValueTo="$m3.z" name="mz_3" /></p>
  <p>x1: <mathinput bindValueTo="$x1" name="mx1" /> <mathinput bindValueTo="$m2.x1" name="mx1_2" /> <mathinput bindValueTo="$m3.x1" name="mx1_3" /></p>
  <p>x2: <mathinput bindValueTo="$x2" name="mx2" /> <mathinput bindValueTo="$m2.x2" name="mx2_2" /> <mathinput bindValueTo="$m3.x2" name="mx2_3" /></p>
  <p>x3: <mathinput bindValueTo="$x3" name="mx3" /> <mathinput bindValueTo="$m2.x3" name="mx3_2" /> <mathinput bindValueTo="$m3.x3" name="mx3_3" /></p>
  <p>x4: <mathinput bindValueTo="$x4" name="mx4" /> <mathinput bindValueTo="$m2.x4" name="mx4_2" /> <mathinput bindValueTo="$m3.x4" name="mx4_3" /></p>
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

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/nDim1"].stateValues.value).eq(xs.length)
        expect(stateVariables["/nDim2"].stateValues.value).eq(xs.length)

        let m3Operator = operator === "tuple" ? "vector" : operator;

        expect(stateVariables["/m"].stateValues.value).eqls([operator, ...xs])
        expect(stateVariables["/m2"].stateValues.value).eqls([operator, ...xs])
        expect(stateVariables["/m3"].stateValues.value).eqls([m3Operator, ...xs])

        for (let [ind, x] of xs.entries()) {
          let comp = indToComp[ind];
          if (comp) {
            expect(stateVariables[`/${comp}`].stateValues.value).eqls(x);
            expect(stateVariables[`/${comp}_2`].stateValues.value).eqls(x);
            expect(stateVariables[`/${comp}_3`].stateValues.value).eqls(x);
          }
          expect(stateVariables[`/x${ind + 1}`].stateValues.value).eqls(x);
          expect(stateVariables[`/x${ind + 1}_2`].stateValues.value).eqls(x);
          expect(stateVariables[`/x${ind + 1}_3`].stateValues.value).eqls(x);
        }

      });

    }


    check_values(["a", "b", "c"], "tuple")

    cy.log('change xyz 1')
    cy.get('#\\/mx textarea').type('{end}{backspace}d{enter}', { force: true })
    cy.get('#\\/my textarea').type('{end}{backspace}e{enter}', { force: true })
    cy.get('#\\/mz textarea').type('{end}{backspace}f{enter}', { force: true })
    cy.get("#\\/z").should('contain.text', 'f');
    check_values(["d", "e", "f"], "tuple")

    cy.log('change xyz 2')
    cy.get('#\\/mx_2 textarea').type('{end}{backspace}g{enter}', { force: true })
    cy.get('#\\/my_2 textarea').type('{end}{backspace}h{enter}', { force: true })
    cy.get('#\\/mz_2 textarea').type('{end}{backspace}i{enter}', { force: true })
    cy.get("#\\/z").should('contain.text', 'i');
    check_values(["g", "h", "i"], "tuple")

    cy.log('change xyz 3')
    cy.get('#\\/mx_3 textarea').type('{end}{backspace}j{enter}', { force: true })
    cy.get('#\\/my_3 textarea').type('{end}{backspace}k{enter}', { force: true })
    cy.get('#\\/mz_3 textarea').type('{end}{backspace}l{enter}', { force: true })
    cy.get("#\\/z").should('contain.text', 'l');
    check_values(["j", "k", "l"], "vector")

    cy.log('change x1x2x3 1')
    cy.get('#\\/mx1 textarea').type('{end}{backspace}m{enter}', { force: true })
    cy.get('#\\/mx2 textarea').type('{end}{backspace}n{enter}', { force: true })
    cy.get('#\\/mx3 textarea').type('{end}{backspace}o{enter}', { force: true })
    cy.get("#\\/z").should('contain.text', 'o');
    check_values(["m", "n", "o"], "vector")

    cy.log('change x1x2x3 2')
    cy.get('#\\/mx1_2 textarea').type('{end}{backspace}p{enter}', { force: true })
    cy.get('#\\/mx2_2 textarea').type('{end}{backspace}q{enter}', { force: true })
    cy.get('#\\/mx3_2 textarea').type('{end}{backspace}r{enter}', { force: true })
    cy.get("#\\/z").should('contain.text', 'r');
    check_values(["p", "q", "r"], "vector")

    cy.log('change x1x2x3 2')
    cy.get('#\\/mx1_3 textarea').type('{end}{backspace}s{enter}', { force: true })
    cy.get('#\\/mx2_3 textarea').type('{end}{backspace}t{enter}', { force: true })
    cy.get('#\\/mx3_3 textarea').type('{end}{backspace}u{enter}', { force: true })
    cy.get("#\\/z").should('contain.text', 'u');
    check_values(["s", "t", "u"], "vector")

    cy.log('change to 4D list')
    cy.get('#\\/m textarea').type("{ctrl+home}{shift+end}{backspace}v,w,x,y{enter}", { force: true })
    cy.get("#\\/x4").should('contain.text', 'y');

    check_values(["v", "w", "x", "y"], "list")


    cy.log('change x1x2x3x4 1')
    cy.get('#\\/mx1 textarea').type('{end}{backspace}z{enter}', { force: true })
    cy.get('#\\/mx2 textarea').type('{end}{backspace}a{enter}', { force: true })
    cy.get('#\\/mx3 textarea').type('{end}{backspace}b{enter}', { force: true })
    cy.get('#\\/mx4 textarea').type('{end}{backspace}c{enter}', { force: true })
    cy.get("#\\/x4").should('contain.text', 'c');
    check_values(["z", "a", "b", "c"], "list")

    cy.log('change x1x2x3x4 2')
    cy.get('#\\/mx1_2 textarea').type('{end}{backspace}d{enter}', { force: true })
    cy.get('#\\/mx2_2 textarea').type('{end}{backspace}e{enter}', { force: true })
    cy.get('#\\/mx3_2 textarea').type('{end}{backspace}f{enter}', { force: true })
    cy.get('#\\/mx4_2 textarea').type('{end}{backspace}g{enter}', { force: true })
    cy.get("#\\/x4").should('contain.text', 'g');
    check_values(["d", "e", "f", "g"], "list")


  });

  it('group composite replacements inside math', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/groupByDefault"].stateValues.value).eqls(["tuple", "a", "b"])
      expect(stateVariables["/dontGroup"].stateValues.value).eqls(["*", "a", "b"])
      expect(stateVariables["/dontGroupDueToString"].stateValues.value).eqls(["+", "a", "b"])



    });




  });

  it('math inherits unordered of children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <math name="unordered1"><math unordered>2,3</math></math>
  <math name="unordered2">4<math unordered>(2,3)</math></math>
  <math name="unordered3" unordered><math>4</math><math unordered>(2,3)</math></math>
  <math name="ordered1">2,3</math>
  <math name="ordered2"><math>4</math><math unordered>(2,3)</math></math>
  <math name="ordered3" unordered="false"><math unordered>2,3</math></math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/unordered1"].stateValues.unordered).eq(true);
      expect(stateVariables["/unordered2"].stateValues.unordered).eq(true);
      expect(stateVariables["/unordered3"].stateValues.unordered).eq(true);
      expect(stateVariables["/ordered1"].stateValues.unordered).eq(false);
      expect(stateVariables["/ordered2"].stateValues.unordered).eq(false);
      expect(stateVariables["/ordered3"].stateValues.unordered).eq(false);


    });


  });

  it('copy math and overwrite unordered', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <math name="ordered1">2,3</math>
  <copy source="ordered1" unordered assignNames="unordered1" />
  <copy source="unordered1" unordered="false" assignNames="ordered2" />

  <math name="unordered2" unordered>2,3</math>
  <copy source="unordered2" unordered="false" assignNames="ordered3" />
  <copy source="ordered3" unordered assignNames="unordered3" />

  <math name="unordered4"><math unordered>2,3</math></math>
  <copy source="unordered4" unordered="false" assignNames="ordered4" />
  <copy source="ordered4" unordered assignNames="unordered5" />

  <math name="ordered5" unordered="false"><math unordered>2,3</math></math>
  <copy source="ordered5" unordered assignNames="unordered6" />
  <copy source="unordered6" unordered="false" assignNames="ordered6" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/unordered1"].stateValues.unordered).eq(true);
      expect(stateVariables["/unordered2"].stateValues.unordered).eq(true);
      expect(stateVariables["/unordered3"].stateValues.unordered).eq(true);
      expect(stateVariables["/unordered4"].stateValues.unordered).eq(true);
      expect(stateVariables["/unordered5"].stateValues.unordered).eq(true);
      expect(stateVariables["/unordered6"].stateValues.unordered).eq(true);
      expect(stateVariables["/ordered1"].stateValues.unordered).eq(false);
      expect(stateVariables["/ordered2"].stateValues.unordered).eq(false);
      expect(stateVariables["/ordered3"].stateValues.unordered).eq(false);
      expect(stateVariables["/ordered4"].stateValues.unordered).eq(false);
      expect(stateVariables["/ordered5"].stateValues.unordered).eq(false);
      expect(stateVariables["/ordered6"].stateValues.unordered).eq(false);


    });


  });

  it('copy math and overwrite unordered, change dynamically', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <booleaninput name="b1" prefill="true" />
  <booleaninput name="b2" />
  <booleaninput name="b3" prefill="true" />

  <p name="p1" newNamespace>
    <math name="m1" unordered="$(../b1)">2,3</math>
    <copy source="m1" unordered="$(../b2)" assignNames="m2" />
    <copy source="m2" unordered="$(../b3)" assignNames="m3" />
  </p>

  <copy source="p1" assignNames="p2" />
  <p>
    <copy prop="value" source="b1" assignNames="b1a" />
    <copy prop="value" source="b2" assignNames="b2a" />
    <copy prop="value" source="b3" assignNames="b3a" />
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1/m1"].stateValues.unordered).eq(true);
      expect(stateVariables["/p1/m2"].stateValues.unordered).eq(false);
      expect(stateVariables["/p1/m3"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m1"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m2"].stateValues.unordered).eq(false);
      expect(stateVariables["/p2/m3"].stateValues.unordered).eq(true);

    });

    cy.get('#\\/b1').click();
    cy.get("#\\/b1a").should('have.text', "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1/m1"].stateValues.unordered).eq(false);
      expect(stateVariables["/p1/m2"].stateValues.unordered).eq(false);
      expect(stateVariables["/p1/m3"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m1"].stateValues.unordered).eq(false);
      expect(stateVariables["/p2/m2"].stateValues.unordered).eq(false);
      expect(stateVariables["/p2/m3"].stateValues.unordered).eq(true);
    });

    cy.get('#\\/b2').click();
    cy.get("#\\/b2a").should('have.text', "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1/m1"].stateValues.unordered).eq(false);
      expect(stateVariables["/p1/m2"].stateValues.unordered).eq(true);
      expect(stateVariables["/p1/m3"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m1"].stateValues.unordered).eq(false);
      expect(stateVariables["/p2/m2"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m3"].stateValues.unordered).eq(true);
    });

    cy.get('#\\/b3').click();
    cy.get("#\\/b3a").should('have.text', "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1/m1"].stateValues.unordered).eq(false);
      expect(stateVariables["/p1/m2"].stateValues.unordered).eq(true);
      expect(stateVariables["/p1/m3"].stateValues.unordered).eq(false);
      expect(stateVariables["/p2/m1"].stateValues.unordered).eq(false);
      expect(stateVariables["/p2/m2"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m3"].stateValues.unordered).eq(false);
    });

  });

  it('shrink vector dimensions in inverse direction', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <math name="m">(x,y,z)</math>
  <mathinput name="mi" bindValueTo="$m" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)');
    })

    cy.get('#\\/mi textarea').type("{end}{leftArrow}{backspace}{backspace}", { force: true }).blur();

    cy.get('#\\/m .mjx-mrow').should('contain.text', '(x,y)')
    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y)');
    })

  });

  it('change one vector component in inverse direction does not affect other', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <number name="n">1</number>
  <graph>
    <point name="P" coords="(2$n+1,1)" />
    <copy source="P" assignNames="Q" x="2$n-1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').should('have.text', '1');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs).map(x => x)).eqls([3, 1])
      expect((stateVariables['/Q'].stateValues.xs).map(x => x)).eqls([1, 1])
    })

    cy.log('move dependent point')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: -2, y: 3 }
      })
    })

    cy.get('#\\/n').should('have.text', '-0.5');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs).map(x => x)).eqls([0, 3])
      expect((stateVariables['/Q'].stateValues.xs).map(x => x)).eqls([-2, 3])
    })


  });

  it('change one vector component in inverse direction does not affect other, original in math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <number name="n">1</number>
  <math name="coords" simplify>(2$n+1,1)</math>
  <graph>
    <point name="P" coords="$coords" />
    <copy source="P" assignNames="Q" x="2$n-1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').should('have.text', '1');

    cy.get('#\\/coords').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,1)');
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs).map(x => x)).eqls([3, 1])
      expect((stateVariables['/Q'].stateValues.xs).map(x => x)).eqls([1, 1])
    })

    cy.log('move dependent point')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: -2, y: 3 }
      })
    })

    cy.get('#\\/n').should('have.text', '-0.5');
    cy.get('#\\/coords').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,3)');
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs).map(x => x)).eqls([0, 3])
      expect((stateVariables['/Q'].stateValues.xs).map(x => x)).eqls([-2, 3])
    })


  });

  it('change one vector component in inverse direction does not affect other, through mathinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <number name="n">1</number>
  <math name="coords1" simplify>(2$n+1,1)</math>
  <mathinput name="coords2" bindValueTo="$coords1" />
  <graph>
    <point name="P" coords="$coords2" />
    <copy source="P" assignNames="Q" x="2$n-1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').should('have.text', '1');

    cy.get('#\\/coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,1)');
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs).map(x => x)).eqls([3, 1])
      expect((stateVariables['/Q'].stateValues.xs).map(x => x)).eqls([1, 1])
    })

    cy.log('move dependent point')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: -2, y: 3 }
      })
    })

    cy.get('#\\/n').should('have.text', '-0.5');
    cy.get('#\\/coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,3)');
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs).map(x => x)).eqls([0, 3])
      expect((stateVariables['/Q'].stateValues.xs).map(x => x)).eqls([-2, 3])
    })

    cy.log('enter value in mathinput')
    cy.get('#\\/coords2 textarea').type("{end}{leftArrow}{backspace}{backspace}{backspace}6,9{enter}", { force: true })

    cy.get('#\\/n').should('have.text', '2.5');
    cy.get('#\\/coords1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,9)');
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs).map(x => x)).eqls([6, 9])
      expect((stateVariables['/Q'].stateValues.xs).map(x => x)).eqls([4, 9])
    })


  });

  it('copy value prop copies attributes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="m1" displayDigits="3">8.5203845251</math>
  <copy source="m1" prop="value" assignNames="m1a" />
  <copy source="m1" prop="value" displayDigits="5" assignNames="m1b" />
  <copy source="m1" prop="value" link="false" assignNames="m1c" />
  <copy source="m1" prop="value" link="false" displayDigits="5" assignNames="m1d" />
  </p>

  <p><math name="m2" displayDecimals="4">8.5203845251</math>
  <copy source="m2" prop="value" assignNames="m2a" />
  <copy source="m2" prop="value" displayDecimals="6" assignNames="m2b" />
  <copy source="m2" prop="value" link="false" assignNames="m2c" />
  <copy source="m2" prop="value" link="false" displayDecimals="6" assignNames="m2d" />
  </p>

  <p><math name="m3" displaySmallAsZero>0.000000000000000015382487</math>
  <copy source="m3" prop="value" assignNames="m3a" />
  <copy source="m3" prop="value" displaySmallAsZero="false" assignNames="m3b" />
  <copy source="m3" prop="value" link="false" assignNames="m3c" />
  <copy source="m3" prop="value" link="false" displaySmallAsZero="false" assignNames="m3d" />
  </p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', '8.52');
    cy.get('#\\/m1a .mjx-mrow').eq(0).should('have.text', '8.52');
    cy.get('#\\/m1b .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get('#\\/m1c .mjx-mrow').eq(0).should('have.text', '8.52');
    cy.get('#\\/m1d .mjx-mrow').eq(0).should('have.text', '8.5204');

    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get('#\\/m2a .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get('#\\/m2b .mjx-mrow').eq(0).should('have.text', '8.520385');
    cy.get('#\\/m2c .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get('#\\/m2d .mjx-mrow').eq(0).should('have.text', '8.520385');

    cy.get('#\\/m3 .mjx-mrow').eq(0).should('have.text', '0');
    cy.get('#\\/m3a .mjx-mrow').eq(0).should('have.text', '0');
    cy.get('#\\/m3b .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17');
    cy.get('#\\/m3c .mjx-mrow').eq(0).should('have.text', '0');
    cy.get('#\\/m3d .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17');


  });

  // TODO: fix so doesn't break when copy the math, not just copy its value
  it('set vector component to undefined', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <math name="m">(x,y)</math>
  <copy source="m" prop="value" assignNames="m2" />
  <mathinput bindValueTo="$m.x" name="mi" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/m .mjx-mrow').eq(0).should('have.text', '(x,y)');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', '(x,y)');
    cy.get('#\\/mi .mq-editable-field').should('have.text', 'x')

    cy.get("#\\/mi textarea").type("{end}{backspace}{enter}", { force: true }).blur();
    cy.get('#\\/m').should('contain.text', '(＿,y)')

    cy.get('#\\/m .mjx-mrow').eq(0).should('have.text', '(＿,y)');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', '(＿,y)');
    cy.get('#\\/mi .mq-editable-field').should('have.text', '')

    cy.get("#\\/mi textarea").type("{end}q{enter}", { force: true }).blur();
    cy.get('#\\/m').should('contain.text', '(q,y)')

    cy.get('#\\/m .mjx-mrow').eq(0).should('have.text', '(q,y)');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', '(q,y)');
    cy.get('#\\/mi .mq-editable-field').should('have.text', 'q')

  });

  it('negative zero', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="m1">-0</math></p>
  <p><math name="m2">4 - 0</math></p>
  <p><math name="m3">0 - 0</math></p>
  <p><math name="m4">-0 - 0</math></p>
  <p><math name="m5">0 + -0</math></p>
  <p><math name="m6">0 - - 0</math></p>
  <p><math name="m7">-6/-0</math></p>

  <p><math name="m8">4 + <math>-0</math></math></p>
  <p><math name="m9">4 - <math>-0</math></math></p>
  <p><math name="m10"><math>-0</math> + <math>-0</math></math></p>
  <p><math name="m11"><math>-0</math> - <math>-0</math></math></p>
  <p><math name="m12"><math>-6</math>/<math>-0</math></math></p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', '−0');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', '4−0');
    cy.get('#\\/m3 .mjx-mrow').eq(0).should('have.text', '0−0');
    cy.get('#\\/m4 .mjx-mrow').eq(0).should('have.text', '−0−0');
    cy.get('#\\/m5 .mjx-mrow').eq(0).should('have.text', '0−0');
    cy.get('#\\/m6 .mjx-mrow').eq(0).should('have.text', '0−−0');
    cy.get('#\\/m7 .mjx-mrow').eq(0).should('have.text', '−6−0');

    cy.get('#\\/m8 .mjx-mrow').eq(0).should('have.text', '4−0');
    cy.get('#\\/m9 .mjx-mrow').eq(0).should('have.text', '4−−0');
    cy.get('#\\/m10 .mjx-mrow').eq(0).should('have.text', '−0−0');
    cy.get('#\\/m11 .mjx-mrow').eq(0).should('have.text', '−0−−0');
    cy.get('#\\/m12 .mjx-mrow').eq(0).should('have.text', '−6−0');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/m1"].stateValues.value).eqls(["-", 0])
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", 4, ["-", 0]])
      expect(stateVariables["/m3"].stateValues.value).eqls(["+", 0, ["-", 0]])
      expect(stateVariables["/m4"].stateValues.value).eqls(["+", ["-", 0], ["-", 0]])
      expect(stateVariables["/m5"].stateValues.value).eqls(["+", 0, ["-", 0]])
      expect(stateVariables["/m6"].stateValues.value).eqls(["+", 0, ["-", ["-", 0]]])
      expect(stateVariables["/m7"].stateValues.value).eqls(["-", ["/", 6, ["-", 0]]])

      expect(stateVariables["/m8"].stateValues.value).eqls(["+", 4, ["-", 0]])
      expect(stateVariables["/m9"].stateValues.value).eqls(["+", 4, ["-", ["-", 0]]])
      expect(stateVariables["/m10"].stateValues.value).eqls(["+", ["-", 0], ["-", 0]])
      expect(stateVariables["/m11"].stateValues.value).eqls(["+", ["-", 0], ["-", ["-", 0]]])
      expect(stateVariables["/m12"].stateValues.value).eqls(["/", -6, ["-", 0]])

    })
  });

  it('parse <', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="m1">x < y</math></p>
  <p><math name="m2">x <= y</math></p>
  <p><math name="m3">x <
      y</math></p>
  <p><math name="m4">x <=
      y</math></p>
  <p><math name="m5">x &lt; y</math></p>
  <p><math name="m6">x &lt;= y</math></p>

  <p><math name="m7" format="latex">x < y</math></p>
  <p><math name="m8" format="latex">x <
      y</math></p>
  <p><math name="m9" format="latex">x \\lt y</math></p>
  <p><math name="m10" format="latex">x &lt; y</math></p>
  <p><math name="m11" format="latex">x \\le y</math></p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', 'x≤y');
    cy.get('#\\/m3 .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get('#\\/m4 .mjx-mrow').eq(0).should('have.text', 'x≤y');
    cy.get('#\\/m5 .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get('#\\/m6 .mjx-mrow').eq(0).should('have.text', 'x≤y');
    cy.get('#\\/m7 .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get('#\\/m8 .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get('#\\/m9 .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get('#\\/m10 .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get('#\\/m11 .mjx-mrow').eq(0).should('have.text', 'x≤y');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/m1"].stateValues.value).eqls(["<", "x", "y"])
      expect(stateVariables["/m2"].stateValues.value).eqls(["le", "x", "y"])
      expect(stateVariables["/m3"].stateValues.value).eqls(["<", "x", "y"])
      expect(stateVariables["/m4"].stateValues.value).eqls(["le", "x", "y"])
      expect(stateVariables["/m5"].stateValues.value).eqls(["<", "x", "y"])
      expect(stateVariables["/m6"].stateValues.value).eqls(["le", "x", "y"])
      expect(stateVariables["/m7"].stateValues.value).eqls(["<", "x", "y"])
      expect(stateVariables["/m8"].stateValues.value).eqls(["<", "x", "y"])
      expect(stateVariables["/m9"].stateValues.value).eqls(["<", "x", "y"])
      expect(stateVariables["/m10"].stateValues.value).eqls(["<", "x", "y"])
      expect(stateVariables["/m11"].stateValues.value).eqls(["le", "x", "y"])

    })
  });

  it('display rounding preserved when only one math child', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="m1"><math displayDigits="3">8.5203845251</math></math>
    <math name="m1a"><number displayDigits="3">8.5203845251</number></math>
    <math name="m1b"><math displayDigits="3">8.5203845251</math>x+526195.5352</math>
    <math name="m1c"><number displayDigits="3">8.5203845251</number>x+526195.5352</math>
    <math name="m1d"><math displayDigits="3">8.5203845251</math><math displayDigits="3">x</math></math>
    <math name="m1e"><number displayDigits="3">8.5203845251</number><math displayDigits="3">x</math></math>
    <math name="m1f" displayDigits="6"><math displayDigits="3">8.5203845251</math></math>
    <math name="m1g" displayDecimals="8"><math displayDigits="3">8.5203845251</math></math>
  </p>

  <p><math name="m2"><math displayDecimals="4">8.5203845251</math></math>
    <math name="m2a"><number displayDecimals="4">8.5203845251</number></math>
    <math name="m2b"><math displayDecimals="4">8.5203845251</math>x+526195.5352</math>
    <math name="m2c"><number displayDecimals="4">8.5203845251</number>x+526195.5352</math>
    <math name="m2d"><math displayDecimals="4">8.5203845251</math><math displayDecimals="4">x</math></math>
    <math name="m2e"><number displayDecimals="4">8.5203845251</number><math displayDecimals="4">x</math></math>
    <math name="m2f" displayDecimals="6"><math displayDecimals="4">8.5203845251</math></math>
    <math name="m2g" displayDigits="8"><math displayDecimals="4">8.5203845251</math></math>
  </p>

  <p><math name="m3"><math displaySmallAsZero>0.000000000000000015382487</math></math>
    <math name="m3a"><number displaySmallAsZero>0.000000000000000015382487</number></math>
    <math name="m3b"><math displaySmallAsZero>0.000000000000000015382487</math>x+526195.5352</math>
    <math name="m3c"><number displaySmallAsZero>0.000000000000000015382487</number>x+526195.5352</math>
    <math name="m3d"><math displaySmallAsZero>0.000000000000000015382487</math><math displaySmallAsZero>x</math></math>
    <math name="m3e"><number displaySmallAsZero>0.000000000000000015382487</number><math displaySmallAsZero>x</math></math>
    <math name="m3f" displaySmallAsZero="false"><math displaySmallAsZero>0.000000000000000015382487</math></math>
  </p>

  <p><math name="m4"><math displayDigits="3" padZeros>8</math></math>
  <math name="m4a"><number displayDigits="3" padZeros>8</number></math>
  <math name="m4b"><math displayDigits="3" padZeros>8</math>x+526195.5352</math>
  <math name="m4c"><number displayDigits="3" padZeros>8</number>x+526195.5352</math>
  <math name="m4d"><math displayDigits="3" padZeros>8</math><math displayDigits="3" padZeros>x</math></math>
  <math name="m4e"><number displayDigits="3" padZeros>8</number><math displayDigits="3" padZeros>x</math></math>
  <math name="m4f" padZeros="false"><math displayDigits="3" padZeros>8</math></math>
</p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', '8.52');
    cy.get('#\\/m1a .mjx-mrow').eq(0).should('have.text', '8.52');
    cy.get('#\\/m1b .mjx-mrow').eq(0).should('have.text', '8.520384525x+526195.5352');
    cy.get('#\\/m1c .mjx-mrow').eq(0).should('have.text', '8.520384525x+526195.5352');
    cy.get('#\\/m1d .mjx-mrow').eq(0).should('have.text', '8.520384525x');
    cy.get('#\\/m1e .mjx-mrow').eq(0).should('have.text', '8.520384525x');
    cy.get('#\\/m1f .mjx-mrow').eq(0).should('have.text', '8.52038');
    cy.get('#\\/m1g .mjx-mrow').eq(0).should('have.text', '8.52038453');

    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get('#\\/m2a .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get('#\\/m2b .mjx-mrow').eq(0).should('have.text', '8.520384525x+526195.5352');
    cy.get('#\\/m2c .mjx-mrow').eq(0).should('have.text', '8.520384525x+526195.5352');
    cy.get('#\\/m2d .mjx-mrow').eq(0).should('have.text', '8.520384525x');
    cy.get('#\\/m2e .mjx-mrow').eq(0).should('have.text', '8.520384525x');
    cy.get('#\\/m2f .mjx-mrow').eq(0).should('have.text', '8.520385');
    cy.get('#\\/m2g .mjx-mrow').eq(0).should('have.text', '8.5203845');

    cy.get('#\\/m3 .mjx-mrow').eq(0).should('have.text', '0');
    cy.get('#\\/m3a .mjx-mrow').eq(0).should('have.text', '0');
    cy.get('#\\/m3b .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17x+526195.5352');
    cy.get('#\\/m3c .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17x+526195.5352');
    cy.get('#\\/m3d .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17x');
    cy.get('#\\/m3e .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17x');
    cy.get('#\\/m3f .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17');

    cy.get('#\\/m4 .mjx-mrow').eq(0).should('have.text', '8.00');
    cy.get('#\\/m4a .mjx-mrow').eq(0).should('have.text', '8.00');
    cy.get('#\\/m4b .mjx-mrow').eq(0).should('have.text', '8x+526195.5352');
    cy.get('#\\/m4c .mjx-mrow').eq(0).should('have.text', '8x+526195.5352');
    cy.get('#\\/m4d .mjx-mrow').eq(0).should('have.text', '8x');
    cy.get('#\\/m4e .mjx-mrow').eq(0).should('have.text', '8x');
    cy.get('#\\/m4f .mjx-mrow').eq(0).should('have.text', '8');


  });


  it('negative integer to power of integer', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <math>(-3)^2</math>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_math1 .mjx-mrow').eq(0).should('have.text', '(−3)2');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.latex).eq("\\left(-3\\right)^{2}")
    })
  });

  it('can get negative infinity from reciprocal when simplify', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <math name="ninf1" simplify>1/((0)(-1))</math>
  <math name="ninf2" simplify>1/((-1)(0))</math>
  <math name="ninf3" simplify>1/(-0)</math>
  <math name="ninf4" simplify>1/(-1(0))</math>
  <math name="ninf5" simplify>-1/0</math>
  <math name="ninf6" simplify>-1/((-1)(-0))</math>

  <math name="pinf1" simplify>1/((-0)(-1))</math>
  <math name="pinf2" simplify>1/((-1)(-0))</math>
  <math name="pinf3" simplify>-1/(-0)</math>
  <math name="pinf4" simplify>1/(-1(-0))</math>
  <math name="pinf5" simplify>1/0</math>
  <math name="pinf6" simplify>-1/((0)(-1))</math>
  <math name="pinf7" simplify>-1/((-1)(0))</math>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/ninf1 .mjx-mrow').eq(0).should('have.text', '−∞');
    cy.get('#\\/ninf2 .mjx-mrow').eq(0).should('have.text', '−∞');
    cy.get('#\\/ninf3 .mjx-mrow').eq(0).should('have.text', '−∞');
    cy.get('#\\/ninf4 .mjx-mrow').eq(0).should('have.text', '−∞');
    cy.get('#\\/ninf5 .mjx-mrow').eq(0).should('have.text', '−∞');
    cy.get('#\\/ninf6 .mjx-mrow').eq(0).should('have.text', '−∞');

    cy.get('#\\/pinf1 .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get('#\\/pinf2 .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get('#\\/pinf3 .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get('#\\/pinf4 .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get('#\\/pinf5 .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get('#\\/pinf6 .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get('#\\/pinf7 .mjx-mrow').eq(0).should('have.text', '∞');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ninf1"].stateValues.value).eq(-Infinity)
      expect(stateVariables["/ninf2"].stateValues.value).eq(-Infinity)
      expect(stateVariables["/ninf3"].stateValues.value).eq(-Infinity)
      expect(stateVariables["/ninf4"].stateValues.value).eq(-Infinity)
      expect(stateVariables["/ninf5"].stateValues.value).eq(-Infinity)
      expect(stateVariables["/ninf6"].stateValues.value).eq(-Infinity)

      expect(stateVariables["/pinf1"].stateValues.value).eq(Infinity)
      expect(stateVariables["/pinf2"].stateValues.value).eq(Infinity)
      expect(stateVariables["/pinf3"].stateValues.value).eq(Infinity)
      expect(stateVariables["/pinf4"].stateValues.value).eq(Infinity)
      expect(stateVariables["/pinf5"].stateValues.value).eq(Infinity)
      expect(stateVariables["/pinf6"].stateValues.value).eq(Infinity)
      expect(stateVariables["/pinf7"].stateValues.value).eq(Infinity)

    })
  });

  it('display blanks', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p>Display blanks: <booleanInput name="displayBlanks" /></p>
  <p><math name="m1" displayBlanks="$displayBlanks">x^() + /2</math></p>
  <p><math name="m2" displayBlanks="$displayBlanks">+++</math></p>
  <p><math name="m3" displayBlanks="$displayBlanks">2+</math></p>
  <p><math name="m4" displayBlanks="$displayBlanks">2+2+</math></p>
  <p><math name="m5" displayBlanks="$displayBlanks">'-_^</math></p>
  <p><math name="m6" displayBlanks="$displayBlanks">)</math></p>
  <p><math name="m7" displayBlanks="$displayBlanks">(,]</math></p>
  <p><math name="m8" displayBlanks="$displayBlanks">2+()</math></p>
  <p><math name="m9" displayBlanks="$displayBlanks">2+()+5</math></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', 'x+2');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', '+++');
    cy.get('#\\/m3 .mjx-mrow').eq(0).should('have.text', '2+');
    cy.get('#\\/m4 .mjx-mrow').eq(0).should('have.text', '2+2+');
    cy.get('#\\/m5 .mjx-mrow').eq(0).should('have.text', '′−');
    cy.get('#\\/m6 .mjx-mrow').eq(0).should('have.text', '');
    cy.get('#\\/m7 .mjx-mrow').eq(0).should('have.text', '(,]');
    cy.get('#\\/m8 .mjx-mrow').eq(0).should('have.text', '2+');
    cy.get('#\\/m9 .mjx-mrow').eq(0).should('have.text', '2++5');

    cy.get('#\\/displayBlanks').click();

    cy.get('#\\/m1 .mjx-mrow').should('contain.text', '\uff3f')
    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', 'x\uff3f+\uff3f2');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', '+++');
    cy.get('#\\/m3 .mjx-mrow').eq(0).should('have.text', '2+');
    cy.get('#\\/m4 .mjx-mrow').eq(0).should('have.text', '2+2+\uff3f');
    cy.get('#\\/m5 .mjx-mrow').eq(0).should('have.text', '\uff3f′−\uff3f\uff3f\uff3f');
    cy.get('#\\/m6 .mjx-mrow').eq(0).should('have.text', '\uff3f');
    cy.get('#\\/m7 .mjx-mrow').eq(0).should('have.text', '(\uff3f,\uff3f]');
    cy.get('#\\/m8 .mjx-mrow').eq(0).should('have.text', '2+\uff3f');
    cy.get('#\\/m9 .mjx-mrow').eq(0).should('have.text', '2+\uff3f+5');
  });

  it('changes are reloaded correctly.', () => {
    let doenetML = `
    <p><text>a</text></p>
    <p><math name="m1">w</math></p>
    <p><math name="m2">x + <math name="m3">y</math></math></p>
    <p><math name="m4">z</math></p>
    <p><math name="m5">a+$m4</math></p>
    <p><mathinput name="mi1" bindValueTo="$m1" /></p>
    <p><mathinput name="mi2" bindValueTo="$m2" /></p>
    <p><mathinput name="mi3" bindValueTo="$m3" /></p>
    <p><mathinput name="mi4" bindValueTo="$m4" /></p>
    <p><mathinput name="mi5" bindValueTo="$m5" /></p>
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

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', 'w');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', 'x+y');
    cy.get('#\\/m4 .mjx-mrow').eq(0).should('have.text', 'z');
    cy.get('#\\/m5 .mjx-mrow').eq(0).should('have.text', 'a+z');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eqls("w");
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", "y"]);
      expect(stateVariables["/m3"].stateValues.value).eqls("y");
      expect(stateVariables["/m4"].stateValues.value).eqls("z");
      expect(stateVariables["/m5"].stateValues.value).eqls(["+", "a", "z"]);
    });

    cy.get('#\\/mi1 textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/mi2 textarea').type("{end}{backspace}2{enter}", { force: true })
    cy.get('#\\/mi4 textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get('#\\/m4 .mjx-mrow').should('contain.text', '3');

    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', '1');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', 'x+2');
    cy.get('#\\/m4 .mjx-mrow').eq(0).should('have.text', '3');
    cy.get('#\\/m5 .mjx-mrow').eq(0).should('have.text', 'a+3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eqls(1);
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", 2]);
      expect(stateVariables["/m3"].stateValues.value).eqls(2);
      expect(stateVariables["/m4"].stateValues.value).eqls(3);
      expect(stateVariables["/m5"].stateValues.value).eqls(["+", "a", 3]);
    });

    cy.wait(1500);  // wait for debounce 

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables["/m1"];
    }))

    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', '1');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', 'x+2');
    cy.get('#\\/m4 .mjx-mrow').eq(0).should('have.text', '3');
    cy.get('#\\/m5 .mjx-mrow').eq(0).should('have.text', 'a+3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eqls(1);
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", 2]);
      expect(stateVariables["/m3"].stateValues.value).eqls(2);
      expect(stateVariables["/m4"].stateValues.value).eqls(3);
      expect(stateVariables["/m5"].stateValues.value).eqls(["+", "a", 3]);
    });


    cy.get('#\\/mi1 textarea').type("{end}{backspace}4+5{enter}", { force: true })
    cy.get('#\\/mi3 textarea').type("{end}{backspace}6+7{enter}", { force: true })
    cy.get('#\\/mi5 textarea').type("{end}{backspace}8+9{enter}", { force: true })

    cy.get('#\\/m5 .mjx-mrow').should('contain.text', '17');

    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', '4+5');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', 'x+6+7');
    cy.get('#\\/m4 .mjx-mrow').eq(0).should('have.text', '17');
    cy.get('#\\/m5 .mjx-mrow').eq(0).should('have.text', 'a+17');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eqls(["+", 4, 5]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", 6, 7]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["+", 6, 7]);
      expect(stateVariables["/m4"].stateValues.value).eqls(17);
      expect(stateVariables["/m5"].stateValues.value).eqls(["+", "a", 17]);
    });



    cy.wait(1500);  // wait for debounce 

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables["/m1"];
    }))

    cy.get('#\\/m1 .mjx-mrow').eq(0).should('have.text', '4+5');
    cy.get('#\\/m2 .mjx-mrow').eq(0).should('have.text', 'x+6+7');
    cy.get('#\\/m4 .mjx-mrow').eq(0).should('have.text', '17');
    cy.get('#\\/m5 .mjx-mrow').eq(0).should('have.text', 'a+17');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eqls(["+", 4, 5]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", 6, 7]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["+", 6, 7]);
      expect(stateVariables["/m4"].stateValues.value).eqls(17);
      expect(stateVariables["/m5"].stateValues.value).eqls(["+", "a", 17]);
    });



  });



})

