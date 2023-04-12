import { cesc, cesc2 } from '../../../../src/_utils/url';

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
    cy.visit('/src/Tools/cypressTest/')
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+1')
    })
    cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3(x+1)+5')
    })
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(1).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3(x+1)+5')
    })
    cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(1).invoke('text').then((text) => {
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
    cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // wait to load
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'b'); // wait to load
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
    cy.get(cesc('#\\/_text1')).should('have.text', 'c'); // wait to load
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-char').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get(cesc('#\\/_math1')).find('.mjx-char').eq(1).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-char').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get(cesc('#\\/_math1')).find('.mjx-char').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacement = stateVariables['/_copy1'].replacements[0];
      cy.get(cesc2('#' + replacement.componentName)).should('have.text', '\\frac{x}{y}');

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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x+z')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacement = stateVariables['/a2'].replacements[0];
      cy.get(cesc2('#' + replacement.componentName)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'q');  // to wait to load
    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/a') + ' .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)sin(y)')
    })
    cy.get(cesc('#\\/b') + ' .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(u)sin(v)')
    })

    cy.get(cesc("#\\/formata")).should('have.text', 'latex');
    cy.get(cesc("#\\/formatb")).should('have.text', 'text');
    cy.get(cesc("#\\/formatc")).should('have.text', 'text');
    cy.get(cesc("#\\/formatd")).should('have.text', 'latex');

    cy.log('change format of second to latex')
    cy.get(cesc('#\\/_textinput2_input')).clear().type(`latex{enter}`);

    cy.get(cesc('#\\/a')).should('contain.text', 'insxsin(y)')
    cy.get(cesc('#\\/a') + ' .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('insxsin(y)')
    })
    cy.get(cesc('#\\/b') + ' .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('insusin(v)')
    })

    cy.get(cesc("#\\/formata")).should('have.text', 'latex');
    cy.get(cesc("#\\/formatb")).should('have.text', 'latex');
    cy.get(cesc("#\\/formatc")).should('have.text', 'latex');
    cy.get(cesc("#\\/formatd")).should('have.text', 'latex');

    cy.log('change format of first to text')
    cy.get(cesc('#\\/_textinput1_input')).clear().type(`text{enter}`);


    cy.get(cesc('#\\/a')).should('contain.text', '＿')
    cy.get(cesc('#\\/a') + ' .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get(cesc('#\\/b') + ' .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sinu＿')
    })

    cy.get(cesc("#\\/formata")).should('have.text', 'text');
    cy.get(cesc("#\\/formatb")).should('have.text', 'latex');
    cy.get(cesc("#\\/formatc")).should('have.text', 'latex');
    cy.get(cesc("#\\/formatd")).should('have.text', 'text');


    cy.log('change format of second back to text')
    cy.get(cesc('#\\/_textinput2_input')).clear().type(`text{enter}`);

    cy.get(cesc('#\\/b')).should('contain.text', 'sin(u)＿')

    cy.get(cesc('#\\/a') + ' .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get(cesc('#\\/b') + ' .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(u)＿')
    })

    cy.get(cesc("#\\/formata")).should('have.text', 'text');
    cy.get(cesc("#\\/formatb")).should('have.text', 'text');
    cy.get(cesc("#\\/formatc")).should('have.text', 'text');
    cy.get(cesc("#\\/formatd")).should('have.text', 'text');

    cy.log('change format of first back to latext')
    cy.get(cesc('#\\/_textinput1_input')).clear().type(`latex{enter}`);

    cy.get(cesc('#\\/a')).should('contain.text', 'sin(x)sin(y)')

    cy.get(cesc('#\\/a') + ' .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)sin(y)')
    })
    cy.get(cesc('#\\/b') + ' .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(u)sin(v)')
    })

    cy.get(cesc("#\\/formata")).should('have.text', 'latex');
    cy.get(cesc("#\\/formatb")).should('have.text', 'text');
    cy.get(cesc("#\\/formatc")).should('have.text', 'text');
    cy.get(cesc("#\\/formatd")).should('have.text', 'latex');

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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1x2−3+0x2+4−2x2−3+5x2')
    });
    cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1x2−3+0x2+4−2x2−3+5x2')
    });
    cy.get(cesc('#\\/_math3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4x2−2')
    });
    cy.get(cesc('#\\/_math4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4x2−2')
    });
    cy.get(cesc('#\\/_math5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−2x2+x2+5x2−2')
    });
    cy.get(cesc('#\\/_math6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x−3)(2x+4)')
    });
    cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x2−2x−12')
    });
    cy.get(cesc('#\\/_math3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x−3)(2x+4)−(3x+5)(7−x)')
    })
    cy.get(cesc('#\\/_math4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5x2−18x−47')
    });
    cy.get(cesc('#\\/_math5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
    <p>Alt vectors: <math>⟨1,2,3⟩,⟨4,5⟩,[6,7],(8,9],[10,11)</math></p>
    `}, "*");

    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Look same in browser (except alt-vector)')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2,3),(4,5),[6,7],(8,9],[10,11)')
    });
    cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2,3),(4,5),[6,7],(8,9],[10,11)')
    });
    cy.get(cesc('#\\/_math3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2,3),(4,5),[6,7],(8,9],[10,11)')
    });
    cy.get(cesc('#\\/_math4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2,3),(4,5),[6,7],(8,9],[10,11)')
    });
    cy.get(cesc('#\\/_math5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('⟨1,2,3⟩,⟨4,5⟩,[6,7],(8,9],[10,11)')
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
      expect(stateVariables['/_math5'].stateValues.value).eqls(["list",
        ["altvector", 1, 2, 3],
        ["altvector", 4, 5],
        ["array", 6, 7],
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
  <p><math parseScientificNotation>2x + (1E-15)y</math></p>
  <p><math parseScientificNotation displaysmallaszero>2x + (1E-15)y</math></p>
  <p><math parseScientificNotation displaysmallaszero>2x + (1E-13)y</math></p>
  <p><math parseScientificNotation displaysmallaszero="1E-12">2x + (1E-13)y</math></p>
  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x+1⋅10−15y')
    })
    cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get(cesc('#\\/_math3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x+1⋅10−13y')
    })
    cy.get(cesc('#\\/_math4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/expr1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.352')
    })
    cy.get(cesc('#\\/expr2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352054x+4π')
    })
    cy.get(cesc('#\\/expr1Dig5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get(cesc('#\\/expr2Dig5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get(cesc('#\\/expr1Dec5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get(cesc('#\\/expr2Dec5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })
    cy.get(cesc('#\\/expr1Dig5a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get(cesc('#\\/expr2Dig5a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get(cesc('#\\/expr1Dec5a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get(cesc('#\\/expr2Dec5a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })

    cy.get(cesc('#\\/expr1Dig5b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get(cesc('#\\/expr2Dig5b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get(cesc('#\\/expr1Dec5b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get(cesc('#\\/expr2Dec5b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })

    cy.get(cesc('#\\/expr1Dig5c')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get(cesc('#\\/expr2Dig5c')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get(cesc('#\\/expr1Dec5c')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get(cesc('#\\/expr2Dec5c')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })


    cy.get(cesc('#\\/expr1Dig5d')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get(cesc('#\\/expr2Dig5d')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.384x+4π')
    })
    cy.get(cesc('#\\/expr1Dec5d')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621802.35203')
    })
    cy.get(cesc('#\\/expr2Dec5d')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('31.38352x+4π')
    })

    cy.get(cesc('#\\/expr1Dig5e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('621800')
    })
    cy.get(cesc('#\\/expr2Dig5e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/_math3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })

    cy.get(cesc('#\\/dig5a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dig5apad')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get(cesc('#\\/dig5b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dig5bpad')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get(cesc('#\\/dig5c')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dig5cpad')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })
    cy.get(cesc('#\\/dec5a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dec5apad')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.10000')
    })
    cy.get(cesc('#\\/dec5b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dec5bpad')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10000⋅10−3')
    })
    cy.get(cesc('#\\/dec5c')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dec5cpad')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.30000x+4.00000π')
    })
    cy.get(cesc('#\\/dig5dec1a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dig5dec1apad')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get(cesc('#\\/dig5dec1b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dig5dec1bpad')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get(cesc('#\\/dig5dec1c')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dig5dec1cpad')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })

    cy.get(cesc('#\\/dig5aText')).should('have.text', '62.1')
    cy.get(cesc('#\\/dig5apadText')).should('have.text', '62.100')
    cy.get(cesc('#\\/dig5bText')).should('have.text', '162.1 * 10⁻³')
    cy.get(cesc('#\\/dig5bpadText')).should('have.text', '162.10 * 10⁻³')
    cy.get(cesc('#\\/dig5cText')).should('have.text', '1.3 x + 4 π')
    cy.get(cesc('#\\/dig5cpadText')).should('have.text', '1.3000 x + 4.0000 π')
    cy.get(cesc('#\\/dec5aText')).should('have.text', '62.1')
    cy.get(cesc('#\\/dec5apadText')).should('have.text', '62.10000')
    cy.get(cesc('#\\/dec5bText')).should('have.text', '162.1 * 10⁻³')
    cy.get(cesc('#\\/dec5bpadText')).should('have.text', '162.10000 * 10⁻³')
    cy.get(cesc('#\\/dec5cText')).should('have.text', '1.3 x + 4 π')
    cy.get(cesc('#\\/dec5cpadText')).should('have.text', '1.30000 x + 4.00000 π')
    cy.get(cesc('#\\/dig5dec1aText')).should('have.text', '62.1')
    cy.get(cesc('#\\/dig5dec1apadText')).should('have.text', '62.100')
    cy.get(cesc('#\\/dig5dec1bText')).should('have.text', '162.1 * 10⁻³')
    cy.get(cesc('#\\/dig5dec1bpadText')).should('have.text', '162.10 * 10⁻³')
    cy.get(cesc('#\\/dig5dec1cText')).should('have.text', '1.3 x + 4 π')
    cy.get(cesc('#\\/dig5dec1cpadText')).should('have.text', '1.3000 x + 4.0000 π')


    cy.get(cesc('#\\/dig5aValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dig5apadValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get(cesc('#\\/dig5bValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dig5bpadValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get(cesc('#\\/dig5cValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dig5cpadValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })
    cy.get(cesc('#\\/dec5aValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dec5apadValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.10000')
    })
    cy.get(cesc('#\\/dec5bValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dec5bpadValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10000⋅10−3')
    })
    cy.get(cesc('#\\/dec5cValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dec5cpadValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.30000x+4.00000π')
    })
    cy.get(cesc('#\\/dig5dec1aValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dig5dec1apadValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get(cesc('#\\/dig5dec1bValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dig5dec1bpadValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get(cesc('#\\/dig5dec1cValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dig5dec1cpadValue')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })


    cy.get(cesc('#\\/dig5aNumber')).should('have.text', '62.1')
    cy.get(cesc('#\\/dig5apadNumber')).should('have.text', '62.100')
    cy.get(cesc('#\\/dig5bNumber')).should('have.text', '0.1621')
    cy.get(cesc('#\\/dig5bpadNumber')).should('have.text', '0.16210')
    cy.get(cesc('#\\/dig5cNumber')).should('have.text', 'NaN')
    cy.get(cesc('#\\/dig5cpadNumber')).should('have.text', 'NaN')
    cy.get(cesc('#\\/dec5aNumber')).should('have.text', '62.1')
    cy.get(cesc('#\\/dec5apadNumber')).should('have.text', '62.10000')
    cy.get(cesc('#\\/dec5bNumber')).should('have.text', '0.1621')
    cy.get(cesc('#\\/dec5bpadNumber')).should('have.text', '0.16210')
    cy.get(cesc('#\\/dec5cNumber')).should('have.text', 'NaN')
    cy.get(cesc('#\\/dec5cpadNumber')).should('have.text', 'NaN')
    cy.get(cesc('#\\/dig5dec1aNumber')).should('have.text', '62.1')
    cy.get(cesc('#\\/dig5dec1apadNumber')).should('have.text', '62.100')
    cy.get(cesc('#\\/dig5dec1bNumber')).should('have.text', '0.1621')
    cy.get(cesc('#\\/dig5dec1bpadNumber')).should('have.text', '0.16210')
    cy.get(cesc('#\\/dig5dec1cNumber')).should('have.text', 'NaN')
    cy.get(cesc('#\\/dig5dec1cpadNumber')).should('have.text', 'NaN')


    cy.get(cesc('#\\/dig5aMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dig5apadMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get(cesc('#\\/dig5bMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dig5bpadMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get(cesc('#\\/dig5cMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dig5cpadMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })
    cy.get(cesc('#\\/dec5aMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dec5apadMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.10000')
    })
    cy.get(cesc('#\\/dec5bMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dec5bpadMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10000⋅10−3')
    })
    cy.get(cesc('#\\/dec5cMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dec5cpadMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.30000x+4.00000π')
    })
    cy.get(cesc('#\\/dig5dec1aMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dig5dec1apadMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get(cesc('#\\/dig5dec1bMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dig5dec1bpadMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get(cesc('#\\/dig5dec1cMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dig5dec1cpadMath')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })


    cy.get(cesc('#\\/dig5aNumber2')).should('have.text', '62.1')
    cy.get(cesc('#\\/dig5apadNumber2')).should('have.text', '62.100')
    cy.get(cesc('#\\/dig5bNumber2')).should('have.text', '0.1621')
    cy.get(cesc('#\\/dig5bpadNumber2')).should('have.text', '0.16210')
    cy.get(cesc('#\\/dig5cNumber2')).should('have.text', 'NaN')
    cy.get(cesc('#\\/dig5cpadNumber2')).should('have.text', 'NaN')
    cy.get(cesc('#\\/dec5aNumber2')).should('have.text', '62.1')
    cy.get(cesc('#\\/dec5apadNumber2')).should('have.text', '62.10000')
    cy.get(cesc('#\\/dec5bNumber2')).should('have.text', '0.1621')
    cy.get(cesc('#\\/dec5bpadNumber2')).should('have.text', '0.16210')
    cy.get(cesc('#\\/dec5cNumber2')).should('have.text', 'NaN')
    cy.get(cesc('#\\/dec5cpadNumber2')).should('have.text', 'NaN')
    cy.get(cesc('#\\/dig5dec1aNumber2')).should('have.text', '62.1')
    cy.get(cesc('#\\/dig5dec1apadNumber2')).should('have.text', '62.100')
    cy.get(cesc('#\\/dig5dec1bNumber2')).should('have.text', '0.1621')
    cy.get(cesc('#\\/dig5dec1bpadNumber2')).should('have.text', '0.16210')
    cy.get(cesc('#\\/dig5dec1cNumber2')).should('have.text', 'NaN')
    cy.get(cesc('#\\/dig5dec1cpadNumber2')).should('have.text', 'NaN')



    cy.get(cesc('#\\/dig5aX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dig5apadX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get(cesc('#\\/dig5bX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dig5bpadX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get(cesc('#\\/dig5cX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dig5cpadX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3000x+4.0000π')
    })
    cy.get(cesc('#\\/dec5aX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dec5apadX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.10000')
    })
    cy.get(cesc('#\\/dec5bX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dec5bpadX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10000⋅10−3')
    })
    cy.get(cesc('#\\/dec5cX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dec5cpadX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.30000x+4.00000π')
    })
    cy.get(cesc('#\\/dig5dec1aX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.1')
    })
    cy.get(cesc('#\\/dig5dec1apadX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62.100')
    })
    cy.get(cesc('#\\/dig5dec1bX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.1⋅10−3')
    })
    cy.get(cesc('#\\/dig5dec1bpadX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('162.10⋅10−3')
    })
    cy.get(cesc('#\\/dig5dec1cX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1.3x+4π')
    })
    cy.get(cesc('#\\/dig5dec1cpadX1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/n')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423.02')
    })
    cy.get(cesc('#\\/na')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35200000')
    })
    cy.get(cesc('#\\/nb')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423.024')
    })

    cy.log('higher precision')
    cy.get(cesc('#\\/ndigits') + ' textarea').type("{end}{backspace}12{enter}", { force: true });
    cy.get(cesc('#\\/ndecimals') + ' textarea').type("{end}{backspace}5{enter}", { force: true });
    cy.get(cesc('#\\/ndecimals2')).should('contain.text', '5')
    cy.get(cesc('#\\/na')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423.0235')
    })
    cy.get(cesc('#\\/nb')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423.02352')
    })

    cy.log('invalid precision means default rounding of 10 digits')
    cy.get(cesc('#\\/ndigits') + ' textarea').type("{end}{backspace}{backspace}x{enter}", { force: true });
    cy.get(cesc('#\\/ndecimals') + ' textarea').type("{end}{backspace}{backspace}y{enter}", { force: true });
    cy.get(cesc('#\\/ndecimals2')).should('contain.text', 'y')
    cy.get(cesc('#\\/na')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('35203423.02')
    })
    cy.get(cesc('#\\/nb')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('35203423.02')
    })

    cy.log('low precision')
    cy.get(cesc('#\\/ndigits') + ' textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get(cesc('#\\/ndecimals') + ' textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get(cesc('#\\/ndecimals2')).should('contain.text', '1')
    cy.get(cesc('#\\/na')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('40000000')
    })
    cy.get(cesc('#\\/nb')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('35203423')
    })

    cy.log('negative precision, default rounding from negative displayDigits')
    cy.get(cesc('#\\/ndigits') + ' textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.get(cesc('#\\/ndecimals') + ' textarea').type("{end}{backspace}-3{enter}", { force: true });
    cy.get(cesc('#\\/ndecimals2')).should('contain.text', `${nInDOM(-3)}`)
    cy.get(cesc('#\\/na')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('35203423.02')
    })
    cy.get(cesc('#\\/nb')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)')
    })
    cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g(t)')
    })
    cy.get(cesc('#\\/_math3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hz')
    })
    cy.get(cesc('#\\/_math4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('fx')
    })
    cy.get(cesc('#\\/_math5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g(t)')
    })
    cy.get(cesc('#\\/_math6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)+mx')
    })
    cy.get(cesc('#\\/m2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('fx+m(x)')
    })
    cy.get(cesc('#\\/m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)+m(x)')
    })
    cy.get(cesc('#\\/m4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)+m(x)')
    })
    cy.get(cesc('#\\/m5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('fx+m(x)')
    })
    cy.get(cesc('#\\/m6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = stateVariables["/f"].stateValues.value;
      let x = stateVariables["/x"].stateValues.value;

      cy.log('Test value displayed in browser')
      cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}${x}`)
      })
      cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${x}${f}`)
      })
      cy.get(cesc('#\\/_math3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}(${x})`)
      })
      cy.get(cesc('#\\/_math4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let f = stateVariables["/f"].stateValues.value;

      cy.log('Test value displayed in browser')
      cy.get(cesc('#\\/m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}x`)
      })
      cy.get(cesc('#\\/m2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}(x)`)
      })
      cy.get(cesc('#\\/m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}x`)
      })
      cy.get(cesc('#\\/m4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}(x)`)
      })
      cy.get(cesc('#\\/m5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`${f}x`)
      })
      cy.get(cesc('#\\/m6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x')
    })
    cy.get(cesc('#\\/m2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get(cesc('#\\/m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x')
    })
    cy.get(cesc('#\\/m2a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get(cesc('#\\/m3a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get(cesc('#\\/m4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get(cesc('#\\/m5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x')
    })
    cy.get(cesc('#\\/m6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get(cesc('#\\/m5a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get(cesc('#\\/m6a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get(cesc('#\\/m5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get(cesc('#\\/m6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get(cesc('#\\/m7')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get(cesc('#\\/m8')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get(cesc('#\\/m9')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get(cesc('#\\/m10')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get(cesc('#\\/m11')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get(cesc('#\\/m12')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get(cesc('#\\/m13')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get(cesc('#\\/m14')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get(cesc('#\\/m5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get(cesc('#\\/m6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get(cesc('#\\/m7')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get(cesc('#\\/m8')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get(cesc('#\\/m9')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get(cesc('#\\/m10')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get(cesc('#\\/m11')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get(cesc('#\\/m12')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get(cesc('#\\/m13')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get(cesc('#\\/m14')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
  <p><math format="latex" name="m2a" >\\operatorname{xyz}</math></p>
  <p><math format="latex" name="m2b" splitSymbols="false" >\\operatorname{xyz}</math></p>
  <p><math format="latex" name="m3" splitSymbols="true">xyz</math></p>
  <p><math format="latex" name="m4" simplify>xyx</math></p>
  <p><math format="latex" name="m5" simplify splitSymbols="false">xyx</math></p>
  <p><math format="latex" name="m5a" simplify>\\operatorname{xyx}</math></p>
  <p><math format="latex" name="m5b" simplify splitSymbols="false">\\operatorname{xyx}</math></p>
  <p><math format="latex" name="m6" simplify splitSymbols="true">xyx</math></p>
  <p><math format="latex" name="m7">xy_uv</math></p>
  <p><math format="latex" name="m8">x2_2x</math></p>
  <p><math format="latex" name="m8a">\\operatorname{x2}_2x</math></p>
  <p><math format="latex" name="m9">2x_x2</math></p>
  <p><math format="latex" name="m9a">2x_\\operatorname{x2}</math></p>
  <p><math format="latex" name="m9b">2x_{x2}</math></p>
  <p><math format="latex" name="m10">xy uv x2y 2x x2</math></p>
  <p><math format="latex" name="m10a">xy uv \\operatorname{x2y} 2x \\operatorname{x2}</math></p>
  <p><math format="latex" name="m11" splitSymbols="false">xy_uv</math></p>
  <p><math format="latex" name="m11a">\\operatorname{xy}_\\operatorname{uv}</math></p>
  <p><math format="latex" name="m11b" splitSymbols="false">\\operatorname{xy}_\\operatorname{uv}</math></p>
  <p><math format="latex" name="m12" splitSymbols="false">x2_2x</math></p>
  <p><math format="latex" name="m12a" splitSymbols="false">\\operatorname{x2}_2x</math></p>
  <p><math format="latex" name="m13" splitSymbols="false">2x_x2</math></p>
  <p><math format="latex" name="m13a" splitSymbols="false">2x_\\operatorname{x2}</math></p>
  <p><math format="latex" name="m14" splitSymbols="false">xy uv x2y 2x x2</math></p>
  <p><math format="latex" name="m14a">\\operatorname{xy} \\operatorname{uv} x2y 2x x2</math></p>
  <p><math format="latex" name="m14b" splitSymbols="false">\\operatorname{xy} \\operatorname{uv} x2y 2x x2</math></p>
  <p><math format="latex" name="m15">3^x2</math></p>
  <p><math format="latex" name="m15a" splitSymbols="false">3^x2</math></p>
  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m2a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m2b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get(cesc('#\\/m5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get(cesc('#\\/m5a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get(cesc('#\\/m5b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyx')
    })
    cy.get(cesc('#\\/m6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yx2')
    })
    cy.get(cesc('#\\/m7')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get(cesc('#\\/m8')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get(cesc('#\\/m8a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get(cesc('#\\/m9')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx⋅2')
    })
    cy.get(cesc('#\\/m9a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get(cesc('#\\/m9b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get(cesc('#\\/m10')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get(cesc('#\\/m10a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get(cesc('#\\/m11')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get(cesc('#\\/m11a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get(cesc('#\\/m11b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get(cesc('#\\/m12')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get(cesc('#\\/m12a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x22x')
    })
    cy.get(cesc('#\\/m13')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get(cesc('#\\/m13a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2xx2')
    })
    cy.get(cesc('#\\/m14')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get(cesc('#\\/m14a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get(cesc('#\\/m14b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuvx2y⋅2xx2')
    })
    cy.get(cesc('#\\/m15')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x⋅2')
    })
    cy.get(cesc('#\\/m15a')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
      expect(stateVariables['/m9'].stateValues.value).eqls(["*", 2, ["_", "x", "x"], 2]);
      expect(stateVariables['/m9a'].stateValues.value).eqls(["*", 2, ["_", "x", "x2"]]);
      expect(stateVariables['/m9b'].stateValues.value).eqls(["*", 2, ["_", "x", "x2"]]);
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(cesc('#\\/m6')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get(cesc('#\\/set')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('{a,b,c}')
    })
    // cy.get(cesc('#\\/tuple')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('(a,b,c)')
    // })
    cy.get(cesc('#\\/combinedSet')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('{a,b,c,d,e,f}')
    })
    cy.get(cesc('#\\/combinedTuple')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded


    let indToComp = ["x", "y", "z"]

    function check_values(xs, operator) {

      cy.get(cesc(`#\\/nDim1`)).should('have.text', xs.length.toString())
      cy.get(cesc(`#\\/nDim2`)).should('have.text', xs.length.toString())

      for (let [ind, x] of xs.entries()) {
        let comp = indToComp[ind];
        if (comp) {
          cy.get(cesc(`#\\/${comp}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim().replace(/−/g, '-')).equal(x.toString())
          })
          cy.get(cesc(`#\\/${comp}_2`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim().replace(/−/g, '-')).equal(x.toString())
          })
          cy.get(cesc(`#\\/${comp}_3`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim().replace(/−/g, '-')).equal(x.toString())
          })
        }
        cy.get(cesc(`#\\/x${ind + 1}`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(x.toString())
        })
        cy.get(cesc(`#\\/x${ind + 1}_2`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim().replace(/−/g, '-')).equal(x.toString())
        })
        cy.get(cesc(`#\\/x${ind + 1}_3`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
    cy.get(cesc('#\\/mx') + ' textarea').type('{end}{backspace}d{enter}', { force: true })
    cy.get(cesc('#\\/my') + ' textarea').type('{end}{backspace}e{enter}', { force: true })
    cy.get(cesc('#\\/mz') + ' textarea').type('{end}{backspace}f{enter}', { force: true })
    cy.get(cesc("#\\/z")).should('contain.text', 'f');
    check_values(["d", "e", "f"], "tuple")

    cy.log('change xyz 2')
    cy.get(cesc('#\\/mx_2') + ' textarea').type('{end}{backspace}g{enter}', { force: true })
    cy.get(cesc('#\\/my_2') + ' textarea').type('{end}{backspace}h{enter}', { force: true })
    cy.get(cesc('#\\/mz_2') + ' textarea').type('{end}{backspace}i{enter}', { force: true })
    cy.get(cesc("#\\/z")).should('contain.text', 'i');
    check_values(["g", "h", "i"], "tuple")

    cy.log('change xyz 3')
    cy.get(cesc('#\\/mx_3') + ' textarea').type('{end}{backspace}j{enter}', { force: true })
    cy.get(cesc('#\\/my_3') + ' textarea').type('{end}{backspace}k{enter}', { force: true })
    cy.get(cesc('#\\/mz_3') + ' textarea').type('{end}{backspace}l{enter}', { force: true })
    cy.get(cesc("#\\/z")).should('contain.text', 'l');
    check_values(["j", "k", "l"], "vector")

    cy.log('change x1x2x3 1')
    cy.get(cesc('#\\/mx1') + ' textarea').type('{end}{backspace}m{enter}', { force: true })
    cy.get(cesc('#\\/mx2') + ' textarea').type('{end}{backspace}n{enter}', { force: true })
    cy.get(cesc('#\\/mx3') + ' textarea').type('{end}{backspace}o{enter}', { force: true })
    cy.get(cesc("#\\/z")).should('contain.text', 'o');
    check_values(["m", "n", "o"], "vector")

    cy.log('change x1x2x3 2')
    cy.get(cesc('#\\/mx1_2') + ' textarea').type('{end}{backspace}p{enter}', { force: true })
    cy.get(cesc('#\\/mx2_2') + ' textarea').type('{end}{backspace}q{enter}', { force: true })
    cy.get(cesc('#\\/mx3_2') + ' textarea').type('{end}{backspace}r{enter}', { force: true })
    cy.get(cesc("#\\/z")).should('contain.text', 'r');
    check_values(["p", "q", "r"], "vector")

    cy.log('change x1x2x3 2')
    cy.get(cesc('#\\/mx1_3') + ' textarea').type('{end}{backspace}s{enter}', { force: true })
    cy.get(cesc('#\\/mx2_3') + ' textarea').type('{end}{backspace}t{enter}', { force: true })
    cy.get(cesc('#\\/mx3_3') + ' textarea').type('{end}{backspace}u{enter}', { force: true })
    cy.get(cesc("#\\/z")).should('contain.text', 'u');
    check_values(["s", "t", "u"], "vector")

    cy.log('change to 4D list')
    cy.get(cesc('#\\/m') + ' textarea').type("{ctrl+home}{shift+end}{backspace}v,w,x,y{enter}", { force: true })
    cy.get(cesc("#\\/x4")).should('contain.text', 'y');

    check_values(["v", "w", "x", "y"], "list")


    cy.log('change x1x2x3x4 1')
    cy.get(cesc('#\\/mx1') + ' textarea').type('{end}{backspace}z{enter}', { force: true })
    cy.get(cesc('#\\/mx2') + ' textarea').type('{end}{backspace}a{enter}', { force: true })
    cy.get(cesc('#\\/mx3') + ' textarea').type('{end}{backspace}b{enter}', { force: true })
    cy.get(cesc('#\\/mx4') + ' textarea').type('{end}{backspace}c{enter}', { force: true })
    cy.get(cesc("#\\/x4")).should('contain.text', 'c');
    check_values(["z", "a", "b", "c"], "list")

    cy.log('change x1x2x3x4 2')
    cy.get(cesc('#\\/mx1_2') + ' textarea').type('{end}{backspace}d{enter}', { force: true })
    cy.get(cesc('#\\/mx2_2') + ' textarea').type('{end}{backspace}e{enter}', { force: true })
    cy.get(cesc('#\\/mx3_2') + ' textarea').type('{end}{backspace}f{enter}', { force: true })
    cy.get(cesc('#\\/mx4_2') + ' textarea').type('{end}{backspace}g{enter}', { force: true })
    cy.get(cesc("#\\/x4")).should('contain.text', 'g');
    check_values(["d", "e", "f", "g"], "list")

    cy.log('change to 3D alt vector')
    cy.get(cesc('#\\/m') + ' textarea').type("{ctrl+home}{shift+end}{backspace}\\langle a,b,c\\rangle {enter}", { force: true })
    cy.get(cesc("#\\/z")).should('contain.text', 'c');

    check_values(["a", "b", "c"], "altvector")

    cy.log('change xyz 3')
    cy.get(cesc('#\\/mx_3') + ' textarea').type('{end}{backspace}j{enter}', { force: true })
    cy.get(cesc('#\\/my_3') + ' textarea').type('{end}{backspace}k{enter}', { force: true })
    cy.get(cesc('#\\/mz_3') + ' textarea').type('{end}{backspace}l{enter}', { force: true })
    cy.get(cesc("#\\/z")).should('contain.text', 'l');
    check_values(["j", "k", "l"], "altvector")


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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc(`#\\/groupByDefault`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(a,b)')
    })
    cy.get(cesc(`#\\/dontGroup`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('ab')
    })
    cy.get(cesc(`#\\/dontGroupDueToString`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1/m1"].stateValues.unordered).eq(true);
      expect(stateVariables["/p1/m2"].stateValues.unordered).eq(false);
      expect(stateVariables["/p1/m3"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m1"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m2"].stateValues.unordered).eq(false);
      expect(stateVariables["/p2/m3"].stateValues.unordered).eq(true);

    });

    cy.get(cesc('#\\/b1')).click();
    cy.get(cesc("#\\/b1a")).should('have.text', "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1/m1"].stateValues.unordered).eq(false);
      expect(stateVariables["/p1/m2"].stateValues.unordered).eq(false);
      expect(stateVariables["/p1/m3"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m1"].stateValues.unordered).eq(false);
      expect(stateVariables["/p2/m2"].stateValues.unordered).eq(false);
      expect(stateVariables["/p2/m3"].stateValues.unordered).eq(true);
    });

    cy.get(cesc('#\\/b2')).click();
    cy.get(cesc("#\\/b2a")).should('have.text', "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p1/m1"].stateValues.unordered).eq(false);
      expect(stateVariables["/p1/m2"].stateValues.unordered).eq(true);
      expect(stateVariables["/p1/m3"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m1"].stateValues.unordered).eq(false);
      expect(stateVariables["/p2/m2"].stateValues.unordered).eq(true);
      expect(stateVariables["/p2/m3"].stateValues.unordered).eq(true);
    });

    cy.get(cesc('#\\/b3')).click();
    cy.get(cesc("#\\/b3a")).should('have.text', "false");

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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)');
    })

    cy.get(cesc('#\\/mi') + ' textarea').type("{end}{leftArrow}{backspace}{backspace}", { force: true }).blur();

    cy.get(cesc('#\\/m') + ' .mjx-mrow').should('contain.text', '(x,y)')
    cy.get(cesc('#\\/m')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/n')).should('have.text', '1');

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

    cy.get(cesc('#\\/n')).should('have.text', '-0.5');

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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/n')).should('have.text', '1');

    cy.get(cesc('#\\/coords')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/n')).should('have.text', '-0.5');
    cy.get(cesc('#\\/coords')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/n')).should('have.text', '1');

    cy.get(cesc('#\\/coords1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/n')).should('have.text', '-0.5');
    cy.get(cesc('#\\/coords1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,3)');
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs).map(x => x)).eqls([0, 3])
      expect((stateVariables['/Q'].stateValues.xs).map(x => x)).eqls([-2, 3])
    })

    cy.log('enter value in mathinput')
    cy.get(cesc('#\\/coords2') + ' textarea').type("{end}{leftArrow}{backspace}{backspace}{backspace}6,9{enter}", { force: true })

    cy.get(cesc('#\\/n')).should('have.text', '2.5');
    cy.get(cesc('#\\/coords1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', '8.52');
    cy.get(cesc('#\\/m1a') + ' .mjx-mrow').eq(0).should('have.text', '8.52');
    cy.get(cesc('#\\/m1b') + ' .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get(cesc('#\\/m1c') + ' .mjx-mrow').eq(0).should('have.text', '8.52');
    cy.get(cesc('#\\/m1d') + ' .mjx-mrow').eq(0).should('have.text', '8.5204');

    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get(cesc('#\\/m2a') + ' .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get(cesc('#\\/m2b') + ' .mjx-mrow').eq(0).should('have.text', '8.520385');
    cy.get(cesc('#\\/m2c') + ' .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get(cesc('#\\/m2d') + ' .mjx-mrow').eq(0).should('have.text', '8.520385');

    cy.get(cesc('#\\/m3') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#\\/m3a') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#\\/m3b') + ' .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17');
    cy.get(cesc('#\\/m3c') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#\\/m3d') + ' .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17');


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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m') + ' .mjx-mrow').eq(0).should('have.text', '(x,y)');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', '(x,y)');
    cy.get(cesc('#\\/mi') + ' .mq-editable-field').should('have.text', 'x')

    cy.get(cesc("#\\/mi") + " textarea").type("{end}{backspace}{enter}", { force: true }).blur();
    cy.get(cesc('#\\/m')).should('contain.text', '(＿,y)')

    cy.get(cesc('#\\/m') + ' .mjx-mrow').eq(0).should('have.text', '(＿,y)');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', '(＿,y)');
    cy.get(cesc('#\\/mi') + ' .mq-editable-field').should('have.text', '')

    cy.get(cesc("#\\/mi") + " textarea").type("{end}q{enter}", { force: true }).blur();
    cy.get(cesc('#\\/m')).should('contain.text', '(q,y)')

    cy.get(cesc('#\\/m') + ' .mjx-mrow').eq(0).should('have.text', '(q,y)');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', '(q,y)');
    cy.get(cesc('#\\/mi') + ' .mq-editable-field').should('have.text', 'q')

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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', '−0');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', '4−0');
    cy.get(cesc('#\\/m3') + ' .mjx-mrow').eq(0).should('have.text', '0−0');
    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', '−0−0');
    cy.get(cesc('#\\/m5') + ' .mjx-mrow').eq(0).should('have.text', '0−0');
    cy.get(cesc('#\\/m6') + ' .mjx-mrow').eq(0).should('have.text', '0−−0');
    cy.get(cesc('#\\/m7') + ' .mjx-mrow').eq(0).should('have.text', '−6−0');

    cy.get(cesc('#\\/m8') + ' .mjx-mrow').eq(0).should('have.text', '4−0');
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').eq(0).should('have.text', '4−−0');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').eq(0).should('have.text', '−0−0');
    cy.get(cesc('#\\/m11') + ' .mjx-mrow').eq(0).should('have.text', '−0−−0');
    cy.get(cesc('#\\/m12') + ' .mjx-mrow').eq(0).should('have.text', '−6−0');


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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', 'x≤y');
    cy.get(cesc('#\\/m3') + ' .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', 'x≤y');
    cy.get(cesc('#\\/m5') + ' .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get(cesc('#\\/m6') + ' .mjx-mrow').eq(0).should('have.text', 'x≤y');
    cy.get(cesc('#\\/m7') + ' .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get(cesc('#\\/m8') + ' .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').eq(0).should('have.text', 'x<y');
    cy.get(cesc('#\\/m11') + ' .mjx-mrow').eq(0).should('have.text', 'x≤y');


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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', '8.52');
    cy.get(cesc('#\\/m1a') + ' .mjx-mrow').eq(0).should('have.text', '8.52');
    cy.get(cesc('#\\/m1b') + ' .mjx-mrow').eq(0).should('have.text', '8.520384525x+526195.5352');
    cy.get(cesc('#\\/m1c') + ' .mjx-mrow').eq(0).should('have.text', '8.520384525x+526195.5352');
    cy.get(cesc('#\\/m1d') + ' .mjx-mrow').eq(0).should('have.text', '8.520384525x');
    cy.get(cesc('#\\/m1e') + ' .mjx-mrow').eq(0).should('have.text', '8.520384525x');
    cy.get(cesc('#\\/m1f') + ' .mjx-mrow').eq(0).should('have.text', '8.52038');
    cy.get(cesc('#\\/m1g') + ' .mjx-mrow').eq(0).should('have.text', '8.52038453');

    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get(cesc('#\\/m2a') + ' .mjx-mrow').eq(0).should('have.text', '8.5204');
    cy.get(cesc('#\\/m2b') + ' .mjx-mrow').eq(0).should('have.text', '8.520384525x+526195.5352');
    cy.get(cesc('#\\/m2c') + ' .mjx-mrow').eq(0).should('have.text', '8.520384525x+526195.5352');
    cy.get(cesc('#\\/m2d') + ' .mjx-mrow').eq(0).should('have.text', '8.520384525x');
    cy.get(cesc('#\\/m2e') + ' .mjx-mrow').eq(0).should('have.text', '8.520384525x');
    cy.get(cesc('#\\/m2f') + ' .mjx-mrow').eq(0).should('have.text', '8.520385');
    cy.get(cesc('#\\/m2g') + ' .mjx-mrow').eq(0).should('have.text', '8.5203845');

    cy.get(cesc('#\\/m3') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#\\/m3a') + ' .mjx-mrow').eq(0).should('have.text', '0');
    cy.get(cesc('#\\/m3b') + ' .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17x+526195.5352');
    cy.get(cesc('#\\/m3c') + ' .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17x+526195.5352');
    cy.get(cesc('#\\/m3d') + ' .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17x');
    cy.get(cesc('#\\/m3e') + ' .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17x');
    cy.get(cesc('#\\/m3f') + ' .mjx-mrow').eq(0).should('have.text', '1.5382487⋅10−17');

    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', '8.00');
    cy.get(cesc('#\\/m4a') + ' .mjx-mrow').eq(0).should('have.text', '8.00');
    cy.get(cesc('#\\/m4b') + ' .mjx-mrow').eq(0).should('have.text', '8x+526195.5352');
    cy.get(cesc('#\\/m4c') + ' .mjx-mrow').eq(0).should('have.text', '8x+526195.5352');
    cy.get(cesc('#\\/m4d') + ' .mjx-mrow').eq(0).should('have.text', '8x');
    cy.get(cesc('#\\/m4e') + ' .mjx-mrow').eq(0).should('have.text', '8x');
    cy.get(cesc('#\\/m4f') + ' .mjx-mrow').eq(0).should('have.text', '8');


  });

  it('negative integer to power of integer', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <math>(-3)^2</math>
  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/_math1') + ' .mjx-mrow').eq(0).should('have.text', '(−3)2');


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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/ninf1') + ' .mjx-mrow').eq(0).should('have.text', '−∞');
    cy.get(cesc('#\\/ninf2') + ' .mjx-mrow').eq(0).should('have.text', '−∞');
    cy.get(cesc('#\\/ninf3') + ' .mjx-mrow').eq(0).should('have.text', '−∞');
    cy.get(cesc('#\\/ninf4') + ' .mjx-mrow').eq(0).should('have.text', '−∞');
    cy.get(cesc('#\\/ninf5') + ' .mjx-mrow').eq(0).should('have.text', '−∞');
    cy.get(cesc('#\\/ninf6') + ' .mjx-mrow').eq(0).should('have.text', '−∞');

    cy.get(cesc('#\\/pinf1') + ' .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get(cesc('#\\/pinf2') + ' .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get(cesc('#\\/pinf3') + ' .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get(cesc('#\\/pinf4') + ' .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get(cesc('#\\/pinf5') + ' .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get(cesc('#\\/pinf6') + ' .mjx-mrow').eq(0).should('have.text', '∞');
    cy.get(cesc('#\\/pinf7') + ' .mjx-mrow').eq(0).should('have.text', '∞');


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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', 'x+2');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', '+++');
    cy.get(cesc('#\\/m3') + ' .mjx-mrow').eq(0).should('have.text', '2+');
    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', '2+2+');
    cy.get(cesc('#\\/m5') + ' .mjx-mrow').eq(0).should('have.text', '′−');
    cy.get(cesc('#\\/m6') + ' .mjx-mrow').eq(0).should('have.text', '');
    cy.get(cesc('#\\/m7') + ' .mjx-mrow').eq(0).should('have.text', '(,]');
    cy.get(cesc('#\\/m8') + ' .mjx-mrow').eq(0).should('have.text', '2+');
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').eq(0).should('have.text', '2++5');

    cy.get(cesc('#\\/displayBlanks')).click();

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').should('contain.text', '\uff3f')
    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', 'x\uff3f+\uff3f2');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', '+++');
    cy.get(cesc('#\\/m3') + ' .mjx-mrow').eq(0).should('have.text', '2+');
    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', '2+2+\uff3f');
    cy.get(cesc('#\\/m5') + ' .mjx-mrow').eq(0).should('have.text', '\uff3f′−\uff3f\uff3f\uff3f');
    cy.get(cesc('#\\/m6') + ' .mjx-mrow').eq(0).should('have.text', '\uff3f');
    cy.get(cesc('#\\/m7') + ' .mjx-mrow').eq(0).should('have.text', '(\uff3f,\uff3f]');
    cy.get(cesc('#\\/m8') + ' .mjx-mrow').eq(0).should('have.text', '2+\uff3f');
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').eq(0).should('have.text', '2+\uff3f+5');
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

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', 'w');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', 'x+y');
    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', 'z');
    cy.get(cesc('#\\/m5') + ' .mjx-mrow').eq(0).should('have.text', 'a+z');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eqls("w");
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", "y"]);
      expect(stateVariables["/m3"].stateValues.value).eqls("y");
      expect(stateVariables["/m4"].stateValues.value).eqls("z");
      expect(stateVariables["/m5"].stateValues.value).eqls(["+", "a", "z"]);
    });

    cy.get(cesc('#\\/mi1') + ' textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get(cesc('#\\/mi2') + ' textarea').type("{end}{backspace}2{enter}", { force: true })
    cy.get(cesc('#\\/mi4') + ' textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(cesc('#\\/m4') + ' .mjx-mrow').should('contain.text', '3');

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', '1');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', 'x+2');
    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#\\/m5') + ' .mjx-mrow').eq(0).should('have.text', 'a+3');

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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables["/m1"];
    }))

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', '1');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', 'x+2');
    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', '3');
    cy.get(cesc('#\\/m5') + ' .mjx-mrow').eq(0).should('have.text', 'a+3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eqls(1);
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", 2]);
      expect(stateVariables["/m3"].stateValues.value).eqls(2);
      expect(stateVariables["/m4"].stateValues.value).eqls(3);
      expect(stateVariables["/m5"].stateValues.value).eqls(["+", "a", 3]);
    });


    cy.get(cesc('#\\/mi1') + ' textarea').type("{end}{backspace}4+5{enter}", { force: true })
    cy.get(cesc('#\\/mi3') + ' textarea').type("{end}{backspace}6+7{enter}", { force: true })
    cy.get(cesc('#\\/mi5') + ' textarea').type("{end}{backspace}8+9{enter}", { force: true })

    cy.get(cesc('#\\/m5') + ' .mjx-mrow').should('contain.text', '17');

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', '4+5');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', 'x+6+7');
    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', '17');
    cy.get(cesc('#\\/m5') + ' .mjx-mrow').eq(0).should('have.text', 'a+17');

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


    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    // wait until core is loaded
    cy.waitUntil(() => cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      return stateVariables["/m1"];
    }))

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', '4+5');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', 'x+6+7');
    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', '17');
    cy.get(cesc('#\\/m5') + ' .mjx-mrow').eq(0).should('have.text', 'a+17');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m1"].stateValues.value).eqls(["+", 4, 5]);
      expect(stateVariables["/m2"].stateValues.value).eqls(["+", "x", 6, 7]);
      expect(stateVariables["/m3"].stateValues.value).eqls(["+", 6, 7]);
      expect(stateVariables["/m4"].stateValues.value).eqls(17);
      expect(stateVariables["/m5"].stateValues.value).eqls(["+", "a", 17]);
    });



  });

  it('add and subtract vectors, multiply by scalar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p>Tuple2: <math name="tuple2">(a,b)</math></p>
  <p>Vector2: <math name="vector2" createVectors>(c,d)</math></p>
  <p>Alt vector2: <math name="altvector2">⟨p,q⟩</math></p>
  <p>Interval: <math name="interval" createIntervals>(e,f)</math></p>
  <p>Tuple3: <math name="tuple3">(g,h,i)</math></p>
  <p>Vector3: <math name="vector3" createVectors>(j,k,l)</math></p>
  <p>Alt vector3: <math name="altvector3">⟨r,s,t⟩</math></p>
  <p><math name="t2t2sum">$tuple2+$tuple2</math></p>
  <p><math name="t2t2sumSimp" simplify>$tuple2+$tuple2</math></p>
  <p><math name="v2v2sum">$vector2+$vector2</math></p>
  <p><math name="v2v2sumSimp" simplify>$vector2+$vector2</math></p>
  <p><math name="a2a2sum">$altvector2+$altvector2</math></p>
  <p><math name="a2a2sumSimp" simplify>$altvector2+$altvector2</math></p>
  <p><math name="iisum">$interval+$interval</math></p>
  <p><math name="iisumSimp" simplify>$interval+$interval</math></p>
  <p><math name="t2v2sum">$tuple2+$vector2</math></p>
  <p><math name="t2v2sumSimp" simplify>$tuple2+$vector2</math></p>
  <p><math name="v2t2sum">$vector2+$tuple2</math></p>
  <p><math name="v2t2sumSimp" simplify>$vector2+$tuple2</math></p>
  <p><math name="t2a2sum">$tuple2+$altvector2</math></p>
  <p><math name="t2a2sumSimp" simplify>$tuple2+$altvector2</math></p>
  <p><math name="a2t2sum">$altvector2+$tuple2</math></p>
  <p><math name="a2t2sumSimp" simplify>$altvector2+$tuple2</math></p>
  <p><math name="v2a2sum">$vector2+$altvector2</math></p>
  <p><math name="v2a2sumSimp" simplify>$vector2+$altvector2</math></p>
  <p><math name="a2v2sum">$altvector2+$vector2</math></p>
  <p><math name="a2v2sumSimp" simplify>$altvector2+$vector2</math></p>
  <p><math name="t2v2diff">$tuple2-$vector2</math></p>
  <p><math name="t2v2diffSimp" simplify>$tuple2-$vector2</math></p>
  <p><math name="v2t2diff">$vector2-$tuple2</math></p>
  <p><math name="v2t2diffSimp" simplify>$vector2-$tuple2</math></p>
  <p><math name="t2a2diff">$tuple2-$altvector2</math></p>
  <p><math name="t2a2diffSimp" simplify>$tuple2-$altvector2</math></p>
  <p><math name="a2t2diff">$altvector2-$tuple2</math></p>
  <p><math name="a2t2diffSimp" simplify>$altvector2-$tuple2</math></p>
  <p><math name="v2a2diff">$vector2-$altvector2</math></p>
  <p><math name="v2a2diffSimp" simplify>$vector2-$altvector2</math></p>
  <p><math name="a2v2diff">$altvector2-$vector2</math></p>
  <p><math name="a2v2diffSimp" simplify>$altvector2-$vector2</math></p>
  <p><math name="t2isum">$tuple2+$interval</math></p>
  <p><math name="t2isumSimp" simplify>$tuple2+$interval</math></p>
  <p><math name="v2isum">$vector2+$interval</math></p>
  <p><math name="v2isumSimp" simplify>$vector2+$interval</math></p>
  <p><math name="a2isum">$altvector2+$interval</math></p>
  <p><math name="a2isumSimp" simplify>$altvector2+$interval</math></p>
  <p><math name="st2mul">m$tuple2</math></p>
  <p><math name="st2mulSimp" simplify>m$tuple2</math></p>
  <p><math name="st2mulExp" expand>m$tuple2</math></p>
  <p><math name="t2smul">$tuple2 m</math></p>
  <p><math name="t2smulSimp" simplify>$tuple2 m</math></p>
  <p><math name="t2smulExp" expand>$tuple2 m</math></p>
  <p><math name="sv2mul">m$vector2</math></p>
  <p><math name="sv2mulSimp" simplify>m$vector2</math></p>
  <p><math name="sv2mulExp" expand>m$vector2</math></p>
  <p><math name="v2smul">$vector2 m</math></p>
  <p><math name="v2smulSimp" simplify>$vector2 m</math></p>
  <p><math name="v2smulExp" expand>$vector2 m</math></p>
  <p><math name="sa2mul">m$altvector2</math></p>
  <p><math name="sa2mulSimp" simplify>m$altvector2</math></p>
  <p><math name="sa2mulExp" expand>m$altvector2</math></p>
  <p><math name="a2smul">$altvector2 m</math></p>
  <p><math name="a2smulSimp" simplify>$altvector2 m</math></p>
  <p><math name="a2smulExp" expand>$altvector2 m</math></p>
  <p><math name="simul">m$interval</math></p>
  <p><math name="simulSimp" simplify>m$interval</math></p>
  <p><math name="simulExp" expand>m$interval</math></p>
  <p><math name="ismul">$interval m</math></p>
  <p><math name="ismulSimp" simplify>$interval m</math></p>
  <p><math name="ismulExp" expand>$interval m</math></p>
  <p><math name="st2v2ssum">m$tuple2+$vector2*n</math></p>
  <p><math name="st2v2ssumSimp" simplify>m$tuple2+$vector2*n</math></p>
  <p><math name="st2v2ssumExp" expand>m$tuple2+$vector2*n</math></p>
  <p><math name="st2a2ssum">m$tuple2+$altvector2*n</math></p>
  <p><math name="st2a2ssumSimp" simplify>m$tuple2+$altvector2*n</math></p>
  <p><math name="st2a2ssumExp" expand>m$tuple2+$altvector2*n</math></p>
  <p><math name="sv2a2ssum">m$vector2+$altvector2*n</math></p>
  <p><math name="sv2a2ssumSimp" simplify>m$vector2+$altvector2*n</math></p>
  <p><math name="sv2a2ssumExp" expand>m$vector2+$altvector2*n</math></p>

  <p><math name="t3t3sum">$tuple3+$tuple3</math></p>
  <p><math name="t3t3sumSimp" simplify>$tuple3+$tuple3</math></p>
  <p><math name="v3v3sum">$vector3+$vector3</math></p>
  <p><math name="v3v3sumSimp" simplify>$vector3+$vector3</math></p>
  <p><math name="a3a3sum">$altvector3+$altvector3</math></p>
  <p><math name="a3a3sumSimp" simplify>$altvector3+$altvector3</math></p>
  <p><math name="t3v3sum">$tuple3+$vector3</math></p>
  <p><math name="t3v3sumSimp" simplify>$tuple3+$vector3</math></p>
  <p><math name="v3t3sum">$vector3+$tuple3</math></p>
  <p><math name="v3t3sumSimp" simplify>$vector3+$tuple3</math></p>
  <p><math name="t3a3sum">$tuple3+$altvector3</math></p>
  <p><math name="t3a3sumSimp" simplify>$tuple3+$altvector3</math></p>
  <p><math name="a3t3sum">$altvector3+$tuple3</math></p>
  <p><math name="a3t3sumSimp" simplify>$altvector3+$tuple3</math></p>
  <p><math name="v3a3sum">$vector3+$altvector3</math></p>
  <p><math name="v3a3sumSimp" simplify>$vector3+$altvector3</math></p>
  <p><math name="a3v3sum">$altvector3+$vector3</math></p>
  <p><math name="a3v3sumSimp" simplify>$altvector3+$vector3</math></p>
  <p><math name="t3v3diff">$tuple3-$vector3</math></p>
  <p><math name="t3v3diffSimp" simplify>$tuple3-$vector3</math></p>
  <p><math name="v3t3diff">$vector3-$tuple3</math></p>
  <p><math name="v3t3diffSimp" simplify>$vector3-$tuple3</math></p>
  <p><math name="t3a3diff">$tuple3-$altvector3</math></p>
  <p><math name="t3a3diffSimp" simplify>$tuple3-$altvector3</math></p>
  <p><math name="a3t3diff">$altvector3-$tuple3</math></p>
  <p><math name="a3t3diffSimp" simplify>$altvector3-$tuple3</math></p>
  <p><math name="v3a3diff">$vector3-$altvector3</math></p>
  <p><math name="v3a3diffSimp" simplify>$vector3-$altvector3</math></p>
  <p><math name="a3v3diff">$altvector3-$vector3</math></p>
  <p><math name="a3v3diffSimp" simplify>$altvector3-$vector3</math></p>
  <p><math name="st3mul">m$tuple3</math></p>
  <p><math name="st3mulSimp" simplify>m$tuple3</math></p>
  <p><math name="st3mulExp" expand>m$tuple3</math></p>
  <p><math name="t3smul">$tuple3 m</math></p>
  <p><math name="t3smulSimp" simplify>$tuple3 m</math></p>
  <p><math name="t3smulExp" expand>$tuple3 m</math></p>
  <p><math name="sv3mul">m$vector3</math></p>
  <p><math name="sv3mulSimp" simplify>m$vector3</math></p>
  <p><math name="sv3mulExp" expand>m$vector3</math></p>
  <p><math name="v3smul">$vector3 m</math></p>
  <p><math name="v3smulSimp" simplify>$vector3 m</math></p>
  <p><math name="v3smulExp" expand>$vector3 m</math></p>
  <p><math name="sa3mul">m$altvector3</math></p>
  <p><math name="sa3mulSimp" simplify>m$altvector3</math></p>
  <p><math name="sa3mulExp" expand>m$altvector3</math></p>
  <p><math name="a3smul">$altvector3 m</math></p>
  <p><math name="a3smulSimp" simplify>$altvector3 m</math></p>
  <p><math name="a3smulExp" expand>$altvector3 m</math></p>
  <p><math name="st3v3ssum">m$tuple3+$vector3*n</math></p>
  <p><math name="st3v3ssumSimp" simplify>m$tuple3+$vector3*n</math></p>
  <p><math name="st3v3ssumExp" expand>m$tuple3+$vector3*n</math></p>
  <p><math name="st3a3ssum">m$tuple3+$altvector3*n</math></p>
  <p><math name="st3a3ssumSimp" simplify>m$tuple3+$altvector3*n</math></p>
  <p><math name="st3a3ssumExp" expand>m$tuple3+$altvector3*n</math></p>
  <p><math name="sv3a3ssum">m$vector3+$altvector3*n</math></p>
  <p><math name="sv3a3ssumSimp" simplify>m$vector3+$altvector3*n</math></p>
  <p><math name="sv3a3ssumExp" expand>m$vector3+$altvector3*n</math></p>
  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/t2t2sum') + ' .mjx-mrow').eq(0).should('have.text', '(a,b)+(a,b)');
    cy.get(cesc('#\\/t2t2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(2a,2b)');
    cy.get(cesc('#\\/v2v2sum') + ' .mjx-mrow').eq(0).should('have.text', '(c,d)+(c,d)');
    cy.get(cesc('#\\/v2v2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(2c,2d)');
    cy.get(cesc('#\\/a2a2sum') + ' .mjx-mrow').eq(0).should('have.text', '⟨p,q⟩+⟨p,q⟩');
    cy.get(cesc('#\\/a2a2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '⟨2p,2q⟩');
    cy.get(cesc('#\\/iisum') + ' .mjx-mrow').eq(0).should('have.text', '(e,f)+(e,f)');
    cy.get(cesc('#\\/iisumSimp') + ' .mjx-mrow').eq(0).should('have.text', '2(e,f)');
    cy.get(cesc('#\\/t2v2sum') + ' .mjx-mrow').eq(0).should('have.text', '(a,b)+(c,d)');
    cy.get(cesc('#\\/t2v2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(a+c,b+d)');
    cy.get(cesc('#\\/v2t2sum') + ' .mjx-mrow').eq(0).should('have.text', '(c,d)+(a,b)');
    cy.get(cesc('#\\/v2t2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(a+c,b+d)');
    cy.get(cesc('#\\/t2a2sum') + ' .mjx-mrow').eq(0).should('have.text', '(a,b)+⟨p,q⟩');
    cy.get(cesc('#\\/t2a2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(a+p,b+q)');
    cy.get(cesc('#\\/a2t2sum') + ' .mjx-mrow').eq(0).should('have.text', '⟨p,q⟩+(a,b)');
    cy.get(cesc('#\\/a2t2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(a+p,b+q)');
    cy.get(cesc('#\\/v2a2sum') + ' .mjx-mrow').eq(0).should('have.text', '(c,d)+⟨p,q⟩');
    cy.get(cesc('#\\/v2a2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(c+p,d+q)');
    cy.get(cesc('#\\/a2v2sum') + ' .mjx-mrow').eq(0).should('have.text', '⟨p,q⟩+(c,d)');
    cy.get(cesc('#\\/a2v2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(c+p,d+q)');
    cy.get(cesc('#\\/t2v2diff') + ' .mjx-mrow').eq(0).should('have.text', '(a,b)−(c,d)');
    cy.get(cesc('#\\/t2v2diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(a−c,b−d)');
    cy.get(cesc('#\\/v2t2diff') + ' .mjx-mrow').eq(0).should('have.text', '(c,d)−(a,b)');
    cy.get(cesc('#\\/v2t2diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(−a+c,−b+d)');
    cy.get(cesc('#\\/t2a2diff') + ' .mjx-mrow').eq(0).should('have.text', '(a,b)−⟨p,q⟩');
    cy.get(cesc('#\\/t2a2diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(a−p,b−q)');
    cy.get(cesc('#\\/a2t2diff') + ' .mjx-mrow').eq(0).should('have.text', '⟨p,q⟩−(a,b)');
    cy.get(cesc('#\\/a2t2diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(−a+p,−b+q)');
    cy.get(cesc('#\\/v2a2diff') + ' .mjx-mrow').eq(0).should('have.text', '(c,d)−⟨p,q⟩');
    cy.get(cesc('#\\/v2a2diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(c−p,d−q)');
    cy.get(cesc('#\\/a2v2diff') + ' .mjx-mrow').eq(0).should('have.text', '⟨p,q⟩−(c,d)');
    cy.get(cesc('#\\/a2v2diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(−c+p,−d+q)');
    cy.get(cesc('#\\/t2isum') + ' .mjx-mrow').eq(0).should('have.text', '(a,b)+(e,f)');
    cy.get(cesc('#\\/t2isumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(e,f)+(a,b)');
    cy.get(cesc('#\\/v2isum') + ' .mjx-mrow').eq(0).should('have.text', '(c,d)+(e,f)');
    cy.get(cesc('#\\/v2isumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(e,f)+(c,d)');
    cy.get(cesc('#\\/a2isum') + ' .mjx-mrow').eq(0).should('have.text', '⟨p,q⟩+(e,f)');
    cy.get(cesc('#\\/a2isumSimp') + ' .mjx-mrow').eq(0).should('have.text', '⟨p,q⟩+(e,f)');
    cy.get(cesc('#\\/st2mul') + ' .mjx-mrow').eq(0).should('have.text', 'm(a,b)');
    cy.get(cesc('#\\/st2mulSimp') + ' .mjx-mrow').eq(0).should('have.text', '(am,bm)');
    cy.get(cesc('#\\/st2mulExp') + ' .mjx-mrow').eq(0).should('have.text', '(am,bm)');
    cy.get(cesc('#\\/t2smul') + ' .mjx-mrow').eq(0).should('have.text', '(a,b)m');
    cy.get(cesc('#\\/t2smulSimp') + ' .mjx-mrow').eq(0).should('have.text', '(am,bm)');
    cy.get(cesc('#\\/t2smulExp') + ' .mjx-mrow').eq(0).should('have.text', '(am,bm)');
    cy.get(cesc('#\\/sv2mul') + ' .mjx-mrow').eq(0).should('have.text', 'm(c,d)');
    cy.get(cesc('#\\/sv2mulSimp') + ' .mjx-mrow').eq(0).should('have.text', '(cm,dm)');
    cy.get(cesc('#\\/sv2mulExp') + ' .mjx-mrow').eq(0).should('have.text', '(cm,dm)');
    cy.get(cesc('#\\/v2smul') + ' .mjx-mrow').eq(0).should('have.text', '(c,d)m');
    cy.get(cesc('#\\/v2smulSimp') + ' .mjx-mrow').eq(0).should('have.text', '(cm,dm)');
    cy.get(cesc('#\\/v2smulExp') + ' .mjx-mrow').eq(0).should('have.text', '(cm,dm)');
    cy.get(cesc('#\\/sa2mul') + ' .mjx-mrow').eq(0).should('have.text', 'm⟨p,q⟩');
    cy.get(cesc('#\\/sa2mulSimp') + ' .mjx-mrow').eq(0).should('have.text', '⟨mp,mq⟩');
    cy.get(cesc('#\\/sa2mulExp') + ' .mjx-mrow').eq(0).should('have.text', '⟨mp,mq⟩');
    cy.get(cesc('#\\/a2smul') + ' .mjx-mrow').eq(0).should('have.text', '⟨p,q⟩m');
    cy.get(cesc('#\\/a2smulSimp') + ' .mjx-mrow').eq(0).should('have.text', '⟨mp,mq⟩');
    cy.get(cesc('#\\/a2smulExp') + ' .mjx-mrow').eq(0).should('have.text', '⟨mp,mq⟩');
    cy.get(cesc('#\\/simul') + ' .mjx-mrow').eq(0).should('have.text', 'm(e,f)');
    cy.get(cesc('#\\/simulSimp') + ' .mjx-mrow').eq(0).should('have.text', 'm(e,f)');
    cy.get(cesc('#\\/simulExp') + ' .mjx-mrow').eq(0).should('have.text', 'm(e,f)');
    cy.get(cesc('#\\/ismul') + ' .mjx-mrow').eq(0).should('have.text', '(e,f)m');
    cy.get(cesc('#\\/ismulSimp') + ' .mjx-mrow').eq(0).should('have.text', 'm(e,f)');
    cy.get(cesc('#\\/ismulExp') + ' .mjx-mrow').eq(0).should('have.text', 'm(e,f)');
    cy.get(cesc('#\\/st2v2ssum') + ' .mjx-mrow').eq(0).should('have.text', 'm(a,b)+(c,d)n');
    cy.get(cesc('#\\/st2v2ssumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(am+cn,bm+dn)');
    cy.get(cesc('#\\/st2v2ssumExp') + ' .mjx-mrow').eq(0).should('have.text', '(am+cn,bm+dn)');
    cy.get(cesc('#\\/st2a2ssum') + ' .mjx-mrow').eq(0).should('have.text', 'm(a,b)+⟨p,q⟩n');
    cy.get(cesc('#\\/st2a2ssumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(am+np,bm+nq)');
    cy.get(cesc('#\\/st2a2ssumExp') + ' .mjx-mrow').eq(0).should('have.text', '(am+np,bm+nq)');
    cy.get(cesc('#\\/sv2a2ssum') + ' .mjx-mrow').eq(0).should('have.text', 'm(c,d)+⟨p,q⟩n');
    cy.get(cesc('#\\/sv2a2ssumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(cm+np,dm+nq)');
    cy.get(cesc('#\\/sv2a2ssumExp') + ' .mjx-mrow').eq(0).should('have.text', '(cm+np,dm+nq)');

    cy.get(cesc('#\\/t3t3sum') + ' .mjx-mrow').eq(0).should('have.text', '(g,h,i)+(g,h,i)');
    cy.get(cesc('#\\/t3t3sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(2g,2h,2i)');
    cy.get(cesc('#\\/v3v3sum') + ' .mjx-mrow').eq(0).should('have.text', '(j,k,l)+(j,k,l)');
    cy.get(cesc('#\\/v3v3sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(2j,2k,2l)');
    cy.get(cesc('#\\/a3a3sum') + ' .mjx-mrow').eq(0).should('have.text', '⟨r,s,t⟩+⟨r,s,t⟩');
    cy.get(cesc('#\\/a3a3sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '⟨2r,2s,2t⟩');
    cy.get(cesc('#\\/t3v3sum') + ' .mjx-mrow').eq(0).should('have.text', '(g,h,i)+(j,k,l)');
    cy.get(cesc('#\\/t3v3sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(g+j,h+k,i+l)');
    cy.get(cesc('#\\/v3t3sum') + ' .mjx-mrow').eq(0).should('have.text', '(j,k,l)+(g,h,i)');
    cy.get(cesc('#\\/v3t3sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(g+j,h+k,i+l)');
    cy.get(cesc('#\\/t3a3sum') + ' .mjx-mrow').eq(0).should('have.text', '(g,h,i)+⟨r,s,t⟩');
    cy.get(cesc('#\\/t3a3sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(g+r,h+s,i+t)');
    cy.get(cesc('#\\/a3t3sum') + ' .mjx-mrow').eq(0).should('have.text', '⟨r,s,t⟩+(g,h,i)');
    cy.get(cesc('#\\/a3t3sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(g+r,h+s,i+t)');
    cy.get(cesc('#\\/v3a3sum') + ' .mjx-mrow').eq(0).should('have.text', '(j,k,l)+⟨r,s,t⟩');
    cy.get(cesc('#\\/v3a3sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(j+r,k+s,l+t)');
    cy.get(cesc('#\\/a3v3sum') + ' .mjx-mrow').eq(0).should('have.text', '⟨r,s,t⟩+(j,k,l)');
    cy.get(cesc('#\\/a3v3sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(j+r,k+s,l+t)');
    cy.get(cesc('#\\/t3v3diff') + ' .mjx-mrow').eq(0).should('have.text', '(g,h,i)−(j,k,l)');
    cy.get(cesc('#\\/t3v3diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(g−j,h−k,i−l)');
    cy.get(cesc('#\\/v3t3diff') + ' .mjx-mrow').eq(0).should('have.text', '(j,k,l)−(g,h,i)');
    cy.get(cesc('#\\/v3t3diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(−g+j,−h+k,−i+l)');
    cy.get(cesc('#\\/t3a3diff') + ' .mjx-mrow').eq(0).should('have.text', '(g,h,i)−⟨r,s,t⟩');
    cy.get(cesc('#\\/t3a3diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(g−r,h−s,i−t)');
    cy.get(cesc('#\\/a3t3diff') + ' .mjx-mrow').eq(0).should('have.text', '⟨r,s,t⟩−(g,h,i)');
    cy.get(cesc('#\\/a3t3diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(−g+r,−h+s,−i+t)');
    cy.get(cesc('#\\/v3a3diff') + ' .mjx-mrow').eq(0).should('have.text', '(j,k,l)−⟨r,s,t⟩');
    cy.get(cesc('#\\/v3a3diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(j−r,k−s,l−t)');
    cy.get(cesc('#\\/a3v3diff') + ' .mjx-mrow').eq(0).should('have.text', '⟨r,s,t⟩−(j,k,l)');
    cy.get(cesc('#\\/a3v3diffSimp') + ' .mjx-mrow').eq(0).should('have.text', '(−j+r,−k+s,−l+t)');
    cy.get(cesc('#\\/st3mul') + ' .mjx-mrow').eq(0).should('have.text', 'm(g,h,i)');
    cy.get(cesc('#\\/st3mulSimp') + ' .mjx-mrow').eq(0).should('have.text', '(gm,hm,im)');
    cy.get(cesc('#\\/st3mulExp') + ' .mjx-mrow').eq(0).should('have.text', '(gm,hm,im)');
    cy.get(cesc('#\\/t3smul') + ' .mjx-mrow').eq(0).should('have.text', '(g,h,i)m');
    cy.get(cesc('#\\/t3smulSimp') + ' .mjx-mrow').eq(0).should('have.text', '(gm,hm,im)');
    cy.get(cesc('#\\/t3smulExp') + ' .mjx-mrow').eq(0).should('have.text', '(gm,hm,im)');
    cy.get(cesc('#\\/sv3mul') + ' .mjx-mrow').eq(0).should('have.text', 'm(j,k,l)');
    cy.get(cesc('#\\/sv3mulSimp') + ' .mjx-mrow').eq(0).should('have.text', '(jm,km,lm)');
    cy.get(cesc('#\\/sv3mulExp') + ' .mjx-mrow').eq(0).should('have.text', '(jm,km,lm)');
    cy.get(cesc('#\\/v3smul') + ' .mjx-mrow').eq(0).should('have.text', '(j,k,l)m');
    cy.get(cesc('#\\/v3smulSimp') + ' .mjx-mrow').eq(0).should('have.text', '(jm,km,lm)');
    cy.get(cesc('#\\/v3smulExp') + ' .mjx-mrow').eq(0).should('have.text', '(jm,km,lm)');
    cy.get(cesc('#\\/sa3mul') + ' .mjx-mrow').eq(0).should('have.text', 'm⟨r,s,t⟩');
    cy.get(cesc('#\\/sa3mulSimp') + ' .mjx-mrow').eq(0).should('have.text', '⟨mr,ms,mt⟩');
    cy.get(cesc('#\\/sa3mulExp') + ' .mjx-mrow').eq(0).should('have.text', '⟨mr,ms,mt⟩');
    cy.get(cesc('#\\/a3smul') + ' .mjx-mrow').eq(0).should('have.text', '⟨r,s,t⟩m');
    cy.get(cesc('#\\/a3smulSimp') + ' .mjx-mrow').eq(0).should('have.text', '⟨mr,ms,mt⟩');
    cy.get(cesc('#\\/a3smulExp') + ' .mjx-mrow').eq(0).should('have.text', '⟨mr,ms,mt⟩');
    cy.get(cesc('#\\/st3v3ssum') + ' .mjx-mrow').eq(0).should('have.text', 'm(g,h,i)+(j,k,l)n');
    cy.get(cesc('#\\/st3v3ssumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(gm+jn,hm+kn,im+ln)');
    cy.get(cesc('#\\/st3v3ssumExp') + ' .mjx-mrow').eq(0).should('have.text', '(gm+jn,hm+kn,im+ln)');
    cy.get(cesc('#\\/st3a3ssum') + ' .mjx-mrow').eq(0).should('have.text', 'm(g,h,i)+⟨r,s,t⟩n');
    cy.get(cesc('#\\/st3a3ssumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(gm+nr,hm+ns,im+nt)');
    cy.get(cesc('#\\/st3a3ssumExp') + ' .mjx-mrow').eq(0).should('have.text', '(gm+nr,hm+ns,im+nt)');
    cy.get(cesc('#\\/sv3a3ssum') + ' .mjx-mrow').eq(0).should('have.text', 'm(j,k,l)+⟨r,s,t⟩n');
    cy.get(cesc('#\\/sv3a3ssumSimp') + ' .mjx-mrow').eq(0).should('have.text', '(jm+nr,km+ns,lm+nt)');
    cy.get(cesc('#\\/sv3a3ssumExp') + ' .mjx-mrow').eq(0).should('have.text', '(jm+nr,km+ns,lm+nt)');

  });

  it('add and subtract matrices, multiply by scalar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p>matrix22: <math name="matrix22" format="latex">\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}</math></p>
  <p>matrix21: <math name="matrix21" format="latex">\\begin{bmatrix}e\\\\f\\end{bmatrix}</math></p>
  <p>matrix12: <math name="matrix12" format="latex">\\begin{bmatrix}g&h\\end{bmatrix}</math></p>
  <p>Tuple2: <math name="tuple2">(i,j)</math></p>
  <p>Vector2: <math name="vector2" createVectors>(k,l)</math></p>
  <p>matrix22b: <math name="matrix22b" format="latex">\\begin{bmatrix}n&o\\\\p&q\\end{bmatrix}</math></p>
  <p><math name="m22m22sum">$matrix22+$matrix22</math></p>
  <p><math name="m22m22sumSimp" simplify>$matrix22+$matrix22</math></p>
  <p><math name="m21m21sum">$matrix21+$matrix21</math></p>
  <p><math name="m21m21sumSimp" simplify>$matrix21+$matrix21</math></p>
  <p><math name="m12m12sum">$matrix12+$matrix12</math></p>
  <p><math name="m12m12sumSimp" simplify>$matrix12+$matrix12</math></p>
  <p><math name="m21t2sum">$matrix21+$tuple2</math></p>
  <p><math name="m21t2sumSimp" simplify>$matrix21+$tuple2</math></p>
  <p><math name="m21v2sum">$matrix21+$vector2</math></p>
  <p><math name="m21v2sumSimp" simplify>$matrix21+$vector2</math></p>
  <p><math name="m12t2sum">$matrix12+$tuple2</math></p>
  <p><math name="m12t2sumSimp" simplify>$matrix12+$tuple2</math></p>
  <p><math name="m12v2sum">$matrix12+$vector2</math></p>
  <p><math name="m12v2sumSimp" simplify>$matrix12+$vector2</math></p>
  <p><math name="m22m21sum">$matrix22+$matrix21</math></p>
  <p><math name="m22m21sumSimp" simplify>$matrix22+$matrix21</math></p>
  <p><math name="m22m12sum">$matrix22+$matrix12</math></p>
  <p><math name="m22m12sumSimp" simplify>$matrix22+$matrix12</math></p>
  <p><math name="m21m12sum">$matrix21+$matrix12</math></p>
  <p><math name="m21m12sumSimp" simplify>$matrix21+$matrix12</math></p>
  <p><math name="m22m21m12m12m21m22sum">$matrix22+$matrix21+$matrix12+$matrix12+$matrix21+$matrix22</math></p>
  <p><math name="m22m21m12m12m21m22sumSimp" simplify>$matrix22+$matrix21+$matrix12+$matrix12+$matrix21+$matrix22</math></p>

  <p><math name="sm22mul">m$matrix22</math></p>
  <p><math name="sm22mulSimp" simplify>m$matrix22</math></p>
  <p><math name="sm22mulExp" expand>m$matrix22</math></p>
  <p><math name="m22smul">$matrix22 m</math></p>
  <p><math name="m22smulSimp" simplify>$matrix22 m</math></p>
  <p><math name="m22smulExp" expand>$matrix22 m</math></p>
  <p><math name="sm21mul">m$matrix21</math></p>
  <p><math name="sm21mulSimp" simplify>m$matrix21</math></p>
  <p><math name="sm21mulExp" expand>m$matrix21</math></p>
  <p><math name="m21smul">$matrix21 m</math></p>
  <p><math name="m21smulSimp" simplify>$matrix21 m</math></p>
  <p><math name="m21smulExp" expand>$matrix21 m</math></p>
  <p><math name="sm12mul">m$matrix12</math></p>
  <p><math name="sm12mulSimp" simplify>m$matrix12</math></p>
  <p><math name="sm12mulExp" expand>m$matrix12</math></p>
  <p><math name="m12smul">$matrix12 m</math></p>
  <p><math name="m12smulSimp" simplify>$matrix12 m</math></p>
  <p><math name="m12smulExp" expand>$matrix12 m</math></p>


  <p><math name="m22m22b">$matrix22+$matrix22b</math></p>
  <p><math name="m22m22bSimp" simplify>$matrix22+$matrix22b</math></p>
  <p><math name="m22m22bdiff">$matrix22-$matrix22b</math></p>
  <p><math name="m22m22bdiffSimp" simplify>$matrix22-$matrix22b</math></p>
  <p><math name="m22sm22b">$matrix22+m$matrix22b</math></p>
  <p><math name="m22sm22bSimp" simplify>$matrix22+m$matrix22b</math></p>
  <p><math name="m22sm22bExpSimp" expand simplify>$matrix22+m$matrix22b</math></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m22m22sum') + ' .mjx-mrow').eq(0).should('have.text', '[abcd]+[abcd]');
    cy.get(cesc('#\\/m22m22sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[2a2b2c2d]');
    cy.get(cesc('#\\/m21m21sum') + ' .mjx-mrow').eq(0).should('have.text', '[ef]+[ef]');
    cy.get(cesc('#\\/m21m21sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[2e2f]');
    cy.get(cesc('#\\/m12m12sum') + ' .mjx-mrow').eq(0).should('have.text', '[gh]+[gh]');
    cy.get(cesc('#\\/m12m12sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[2g2h]');
    cy.get(cesc('#\\/m21t2sum') + ' .mjx-mrow').eq(0).should('have.text', '[ef]+(i,j)');
    cy.get(cesc('#\\/m21t2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[ef]+(i,j)');
    cy.get(cesc('#\\/m21v2sum') + ' .mjx-mrow').eq(0).should('have.text', '[ef]+(k,l)');
    cy.get(cesc('#\\/m21v2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[ef]+(k,l)');
    cy.get(cesc('#\\/m12t2sum') + ' .mjx-mrow').eq(0).should('have.text', '[gh]+(i,j)');
    cy.get(cesc('#\\/m12t2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[gh]+(i,j)');
    cy.get(cesc('#\\/m12v2sum') + ' .mjx-mrow').eq(0).should('have.text', '[gh]+(k,l)');
    cy.get(cesc('#\\/m12v2sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[gh]+(k,l)');
    cy.get(cesc('#\\/m22m21sum') + ' .mjx-mrow').eq(0).should('have.text', '[abcd]+[ef]');
    cy.get(cesc('#\\/m22m21sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[ef]+[abcd]');
    cy.get(cesc('#\\/m22m12sum') + ' .mjx-mrow').eq(0).should('have.text', '[abcd]+[gh]');
    cy.get(cesc('#\\/m22m12sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[gh]+[abcd]');
    cy.get(cesc('#\\/m21m12sum') + ' .mjx-mrow').eq(0).should('have.text', '[ef]+[gh]');
    cy.get(cesc('#\\/m21m12sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[gh]+[ef]');
    cy.get(cesc('#\\/m22m21m12m12m21m22sum') + ' .mjx-mrow').eq(0).should('have.text', '[abcd]+[ef]+[gh]+[gh]+[ef]+[abcd]');
    cy.get(cesc('#\\/m22m21m12m12m21m22sumSimp') + ' .mjx-mrow').eq(0).should('have.text', '[2g2h]+[2e2f]+[2a2b2c2d]');

    cy.get(cesc('#\\/sm22mul') + ' .mjx-mrow').eq(0).should('have.text', 'm[abcd]');
    cy.get(cesc('#\\/sm22mulSimp') + ' .mjx-mrow').eq(0).should('have.text', '[ambmcmdm]');
    cy.get(cesc('#\\/sm22mulExp') + ' .mjx-mrow').eq(0).should('have.text', '[ambmcmdm]');
    cy.get(cesc('#\\/m22smul') + ' .mjx-mrow').eq(0).should('have.text', '[abcd]m');
    cy.get(cesc('#\\/m22smulSimp') + ' .mjx-mrow').eq(0).should('have.text', '[ambmcmdm]');
    cy.get(cesc('#\\/m22smulExp') + ' .mjx-mrow').eq(0).should('have.text', '[ambmcmdm]');
    cy.get(cesc('#\\/sm21mul') + ' .mjx-mrow').eq(0).should('have.text', 'm[ef]');
    cy.get(cesc('#\\/sm21mulSimp') + ' .mjx-mrow').eq(0).should('have.text', '[emfm]');
    cy.get(cesc('#\\/sm21mulExp') + ' .mjx-mrow').eq(0).should('have.text', '[emfm]');
    cy.get(cesc('#\\/m21smul') + ' .mjx-mrow').eq(0).should('have.text', '[ef]m');
    cy.get(cesc('#\\/m21smulSimp') + ' .mjx-mrow').eq(0).should('have.text', '[emfm]');
    cy.get(cesc('#\\/m21smulExp') + ' .mjx-mrow').eq(0).should('have.text', '[emfm]');
    cy.get(cesc('#\\/sm12mul') + ' .mjx-mrow').eq(0).should('have.text', 'm[gh]');
    cy.get(cesc('#\\/sm12mulSimp') + ' .mjx-mrow').eq(0).should('have.text', '[gmhm]');
    cy.get(cesc('#\\/sm12mulExp') + ' .mjx-mrow').eq(0).should('have.text', '[gmhm]');
    cy.get(cesc('#\\/m12smul') + ' .mjx-mrow').eq(0).should('have.text', '[gh]m');
    cy.get(cesc('#\\/m12smulSimp') + ' .mjx-mrow').eq(0).should('have.text', '[gmhm]');
    cy.get(cesc('#\\/m12smulExp') + ' .mjx-mrow').eq(0).should('have.text', '[gmhm]');


    cy.get(cesc('#\\/m22m22b') + ' .mjx-mrow').eq(0).should('have.text', '[abcd]+[nopq]');
    cy.get(cesc('#\\/m22m22bSimp') + ' .mjx-mrow').eq(0).should('have.text', '[a+nb+oc+pd+q]');
    cy.get(cesc('#\\/m22m22bdiff') + ' .mjx-mrow').eq(0).should('have.text', '[abcd]−[nopq]');
    cy.get(cesc('#\\/m22m22bdiffSimp') + ' .mjx-mrow').eq(0).should('have.text', '[a−nb−oc−pd−q]');
    cy.get(cesc('#\\/m22sm22b') + ' .mjx-mrow').eq(0).should('have.text', '[abcd]+m[nopq]');
    cy.get(cesc('#\\/m22sm22bSimp') + ' .mjx-mrow').eq(0).should('have.text', '[a+mnb+moc+mpd+mq]');
    cy.get(cesc('#\\/m22sm22bExpSimp') + ' .mjx-mrow').eq(0).should('have.text', '[a+mnb+moc+mpd+mq]');

  });

  it('matrix multiplication', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p>matrix22a: <math name="matrix22a" format="latex">\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}</math></p>
  <p>matrix22b: <math name="matrix22b" format="latex">\\begin{bmatrix}e&f\\\\g&h\\end{bmatrix}</math></p>
  <p>matrix21a: <math name="matrix21a" format="latex">\\begin{bmatrix}i\\\\j\\end{bmatrix}</math></p>
  <p>matrix21b: <math name="matrix21b" format="latex">\\begin{bmatrix}k\\\\l\\end{bmatrix}</math></p>
  <p>matrix12a: <math name="matrix12a" format="latex">\\begin{bmatrix}m&n\\end{bmatrix}</math></p>
  <p>matrix12b: <math name="matrix12b" format="latex">\\begin{bmatrix}o&p\\end{bmatrix}</math></p>
  <p><math name="m22am22b">$matrix22a$matrix22b</math></p>
  <p><math name="m22am22bExp" expand>$matrix22a$matrix22b</math></p>
  <p><math name="m22bm22a">$matrix22b$matrix22a</math></p>
  <p><math name="m22bm22aExp" expand>$matrix22b$matrix22a</math></p>
  <p><math name="m21am21b">$matrix21a$matrix21b</math></p>
  <p><math name="m21am21bExp" expand>$matrix21a$matrix21b</math></p>
  <p><math name="m12am12b">$matrix12a$matrix12b</math></p>
  <p><math name="m12am12bExp" expand>$matrix12a$matrix12b</math></p>
  <p><math name="m21am12a">$matrix21a$matrix12a</math></p>
  <p><math name="m21am12aExp" expand>$matrix21a$matrix12a</math></p>
  <p><math name="m12am21a">$matrix12a$matrix21a</math></p>
  <p><math name="m12am21aExp" expand>$matrix12a$matrix21a</math></p>
  <p><math name="longmult">$matrix22a$matrix21a$matrix12a$matrix22b$matrix21b$matrix12b</math></p>
  <p><math name="longmultExp" expand>$matrix22a$matrix21a$matrix12a$matrix22b$matrix21b$matrix12b</math></p>
  <p><math name="longMultResult" format="latex">\\begin{pmatrix}a e i k m o + a f i l m o + a g i k n o + a h i l n o + b e j k m o + b f j l m o + b g j k n o + b h j l n o & a e i k m p + a f i l m p + a g i k n p + a h i l n p + b e j k m p + b f j l m p + b g j k n p + b h j l n p\\\\
    c e i k m o + c f i l m o + c g i k n o + c h i l n o + d e j k m o + d f j l m o + d g j k n o + d h j l n o & c e i k m p + c f i l m p + c g i k n p + c h i l n p + d e j k m p + d f j l m p + d g j k n p + d h j l n p\\end{pmatrix}</math></p>
  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m22am22b') + ' .mjx-mrow').eq(0).should('have.text', '[abcd][efgh]');
    cy.get(cesc('#\\/m22am22bExp') + ' .mjx-mrow').eq(0).should('have.text', '[ae+bgaf+bhce+dgcf+dh]');
    cy.get(cesc('#\\/m22bm22a') + ' .mjx-mrow').eq(0).should('have.text', '[efgh][abcd]');
    cy.get(cesc('#\\/m22bm22aExp') + ' .mjx-mrow').eq(0).should('have.text', '[ae+cfbe+dfag+chbg+dh]');
    cy.get(cesc('#\\/m21am21b') + ' .mjx-mrow').eq(0).should('have.text', '[ij][kl]');
    cy.get(cesc('#\\/m21am21bExp') + ' .mjx-mrow').eq(0).should('have.text', '[ij][kl]');
    cy.get(cesc('#\\/m12am12b') + ' .mjx-mrow').eq(0).should('have.text', '[mn][op]');
    cy.get(cesc('#\\/m12am12bExp') + ' .mjx-mrow').eq(0).should('have.text', '[mn][op]');
    cy.get(cesc('#\\/m21am12a') + ' .mjx-mrow').eq(0).should('have.text', '[ij][mn]');
    cy.get(cesc('#\\/m21am12aExp') + ' .mjx-mrow').eq(0).should('have.text', '[iminjmjn]');
    cy.get(cesc('#\\/m12am21a') + ' .mjx-mrow').eq(0).should('have.text', '[mn][ij]');
    cy.get(cesc('#\\/m12am21aExp') + ' .mjx-mrow').eq(0).should('have.text', '[im+jn]');
    cy.get(cesc('#\\/longmult') + ' .mjx-mrow').eq(0).should('have.text', '[abcd][ij][mn][efgh][kl][op]');
    cy.get(cesc('#\\/longmultExp') + ' .mjx-mrow').eq(0).should('have.text', '[aeikmo+afilmo+agikno+ahilno+bejkmo+bfjlmo+bgjkno+bhjlnoaeikmp+afilmp+agiknp+ahilnp+bejkmp+bfjlmp+bgjknp+bhjlnpceikmo+cfilmo+cgikno+chilno+dejkmo+dfjlmo+dgjkno+dhjlnoceikmp+cfilmp+cgiknp+chilnp+dejkmp+dfjlmp+dgjknp+dhjlnp]');
    cy.get(cesc('#\\/longMultResult') + ' .mjx-mrow').eq(0).should('have.text', '[aeikmo+afilmo+agikno+ahilno+bejkmo+bfjlmo+bgjkno+bhjlnoaeikmp+afilmp+agiknp+ahilnp+bejkmp+bfjlmp+bgjknp+bhjlnpceikmo+cfilmo+cgikno+chilno+dejkmo+dfjlmo+dgjkno+dhjlnoceikmp+cfilmp+cgiknp+chilnp+dejkmp+dfjlmp+dgjknp+dhjlnp]');

  });

  it('matrix-vector multiplication', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p>matrix22: <math name="matrix22" format="latex">\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}</math></p>
  <p>tuple2: <math name="tuple2">(e,f)</math></p>
  <p>vector2: <math createVectors name="vector2">(g,h)</math></p>
  <p>alt vector2: <math name="altvector2">⟨p,q⟩</math></p>
  <p><math name="m22t2">$matrix22$tuple2</math></p>
  <p><math name="m22t2Exp" expand>$matrix22$tuple2</math></p>
  <p><math name="t2m22">$tuple2$matrix22</math></p>
  <p><math name="t2m22Exp" expand>$tuple2$matrix22</math></p>
  <p><math name="m22v2">$matrix22$vector2</math></p>
  <p><math name="m22v2Exp" expand>$matrix22$vector2</math></p>
  <p><math name="v2m22">$vector2$matrix22</math></p>
  <p><math name="v2m22Exp" expand>$vector2$matrix22</math></p>
  <p><math name="m22a2">$matrix22$altvector2</math></p>
  <p><math name="m22a2Exp" expand>$matrix22$altvector2</math></p>
  <p><math name="a2m22">$altvector2$matrix22</math></p>
  <p><math name="a2m22Exp" expand>$altvector2$matrix22</math></p>
  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m22t2') + ' .mjx-mrow').eq(0).should('have.text', '[abcd](e,f)');
    cy.get(cesc('#\\/m22t2Exp') + ' .mjx-mrow').eq(0).should('have.text', '(ae+bf,ce+df)');
    cy.get(cesc('#\\/t2m22') + ' .mjx-mrow').eq(0).should('have.text', '(e,f)[abcd]');
    cy.get(cesc('#\\/t2m22Exp') + ' .mjx-mrow').eq(0).should('have.text', '(e,f)[abcd]');
    cy.get(cesc('#\\/m22v2') + ' .mjx-mrow').eq(0).should('have.text', '[abcd](g,h)');
    cy.get(cesc('#\\/m22v2Exp') + ' .mjx-mrow').eq(0).should('have.text', '(ag+bh,cg+dh)');
    cy.get(cesc('#\\/v2m22') + ' .mjx-mrow').eq(0).should('have.text', '(g,h)[abcd]');
    cy.get(cesc('#\\/v2m22Exp') + ' .mjx-mrow').eq(0).should('have.text', '(g,h)[abcd]');
    cy.get(cesc('#\\/m22a2') + ' .mjx-mrow').eq(0).should('have.text', '[abcd]⟨p,q⟩');
    cy.get(cesc('#\\/m22a2Exp') + ' .mjx-mrow').eq(0).should('have.text', '⟨ap+bq,cp+dq⟩');
    cy.get(cesc('#\\/a2m22') + ' .mjx-mrow').eq(0).should('have.text', '⟨p,q⟩[abcd]');
    cy.get(cesc('#\\/a2m22Exp') + ' .mjx-mrow').eq(0).should('have.text', '⟨p,q⟩[abcd]');

  });

  it('matrix and vector state variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p>Originals: <math format="latex" name="v1">
    \\begin{pmatrix}
      1 \\\\ 2
    \\end{pmatrix}
  </math>
  <math format="latex" name="v2">
    \\begin{pmatrix}
      1 & 2
    \\end{pmatrix}
  </math>
  <math name="v3">(1,2)</math>
  <math name="v4">(1,2)'</math>
  <math name="v5">(1,2)^T</math>
  <math name="v6">1,2</math>
  <math name="v7" createVectors>(1,2)</math>
  <math name="v8" createVectors>(1,2)'</math>
  <math name="v9" createVectors>(1,2)^T</math>
  <math name="v10">⟨1,2⟩</math>
  <math name="v11">⟨1,2⟩'</math>
  <math name="v12">⟨1,2⟩^T</math>
  </p>
  <p>N dimensions:
    <integer copySource="v1.nDimensions" name="v1nd" />
    <integer copySource="v2.nDimensions" name="v2nd" />
    <integer copySource="v3.nDimensions" name="v3nd" />
    <integer copySource="v4.nDimensions" name="v4nd" />
    <integer copySource="v5.nDimensions" name="v5nd" />
    <integer copySource="v6.nDimensions" name="v6nd" />
    <integer copySource="v7.nDimensions" name="v7nd" />
    <integer copySource="v8.nDimensions" name="v8nd" />
    <integer copySource="v9.nDimensions" name="v9nd" />
    <integer copySource="v10.nDimensions" name="v10nd" />
    <integer copySource="v11.nDimensions" name="v11nd" />
    <integer copySource="v12.nDimensions" name="v12nd" />
  </p>
  <p>Vectors:
    <vector copySource="v1.vector" name="v1v" />
    <vector copySource="v2.vector" name="v2v" />
    <vector copySource="v3.vector" name="v3v" />
    <vector copySource="v4.vector" name="v4v" />
    <vector copySource="v5.vector" name="v5v" />
    <vector copySource="v6.vector" name="v6v" />
    <vector copySource="v7.vector" name="v7v" />
    <vector copySource="v8.vector" name="v8v" />
    <vector copySource="v9.vector" name="v9v" />
    <vector copySource="v10.vector" name="v10v" />
    <vector copySource="v11.vector" name="v11v" />
    <vector copySource="v12.vector" name="v12v" />
  </p>
  <p>Vectors as math:
    <math copySource="v1.vector" name="v1vm" />
    <math copySource="v2.vector" name="v2vm" />
    <math copySource="v3.vector" name="v3vm" />
    <math copySource="v4.vector" name="v4vm" />
    <math copySource="v5.vector" name="v5vm" />
    <math copySource="v6.vector" name="v6vm" />
    <math copySource="v7.vector" name="v7vm" />
    <math copySource="v8.vector" name="v8vm" />
    <math copySource="v9.vector" name="v9vm" />
    <math copySource="v10.vector" name="v10vm" />
    <math copySource="v11.vector" name="v11vm" />
    <math copySource="v12.vector" name="v12vm" />
  </p>
  <p>Vector x components:
    <math copySource="v1.x" name="v1x" />
    <math copySource="v2.x" name="v2x" />
    <math copySource="v3.x" name="v3x" />
    <math copySource="v4.x" name="v4x" />
    <math copySource="v5.x" name="v5x" />
    <math copySource="v6.x" name="v6x" />
    <math copySource="v7.x" name="v7x" />
    <math copySource="v8.x" name="v8x" />
    <math copySource="v9.x" name="v9x" />
    <math copySource="v10.x" name="v10x" />
    <math copySource="v11.x" name="v11x" />
    <math copySource="v12.x" name="v12x" />
  </p>
  <p>Vector y components:
    <math copySource="v1.y" name="v1y" />
    <math copySource="v2.y" name="v2y" />
    <math copySource="v3.y" name="v3y" />
    <math copySource="v4.y" name="v4y" />
    <math copySource="v5.y" name="v5y" />
    <math copySource="v6.y" name="v6y" />
    <math copySource="v7.y" name="v7y" />
    <math copySource="v8.y" name="v8y" />
    <math copySource="v9.y" name="v9y" />
    <math copySource="v10.y" name="v10y" />
    <math copySource="v11.y" name="v11y" />
    <math copySource="v12.y" name="v12y" />
  </p>
  <p>Vector x components b:
    <math copySource="v1.vector[1]" name="v1xb" />
    <math copySource="v2.vector[1]" name="v2xb" />
    <math copySource="v3.vector[1]" name="v3xb" />
    <math copySource="v4.vector[1]" name="v4xb" />
    <math copySource="v5.vector[1]" name="v5xb" />
    <math copySource="v6.vector[1]" name="v6xb" />
    <math copySource="v7.vector[1]" name="v7xb" />
    <math copySource="v8.vector[1]" name="v8xb" />
    <math copySource="v9.vector[1]" name="v9xb" />
    <math copySource="v10.vector[1]" name="v10xb" />
    <math copySource="v11.vector[1]" name="v11xb" />
    <math copySource="v12.vector[1]" name="v12xb" />
  </p>
  <p>Vector y components b:
    <math copySource="v1.vector[2]" name="v1yb" />
    <math copySource="v2.vector[2]" name="v2yb" />
    <math copySource="v3.vector[2]" name="v3yb" />
    <math copySource="v4.vector[2]" name="v4yb" />
    <math copySource="v5.vector[2]" name="v5yb" />
    <math copySource="v6.vector[2]" name="v6yb" />
    <math copySource="v7.vector[2]" name="v7yb" />
    <math copySource="v8.vector[2]" name="v8yb" />
    <math copySource="v9.vector[2]" name="v9yb" />
    <math copySource="v10.vector[2]" name="v10yb" />
    <math copySource="v11.vector[2]" name="v11yb" />
    <math copySource="v12.vector[2]" name="v12yb" />
  </p>
  <p>Matrix size:
    <numberList copySource="v1.matrixSize" name="v1ms" />
    <numberList copySource="v2.matrixSize" name="v2ms" />
    <numberList copySource="v3.matrixSize" name="v3ms" />
    <numberList copySource="v4.matrixSize" name="v4ms" />
    <numberList copySource="v5.matrixSize" name="v5ms" />
    <numberList copySource="v6.matrixSize" name="v6ms" />
    <numberList copySource="v7.matrixSize" name="v7ms" />
    <numberList copySource="v8.matrixSize" name="v8ms" />
    <numberList copySource="v9.matrixSize" name="v9ms" />
    <numberList copySource="v10.matrixSize" name="v10ms" />
    <numberList copySource="v11.matrixSize" name="v11ms" />
    <numberList copySource="v12.matrixSize" name="v12ms" />
  </p>
  <p>N rows:
    <integer copySource="v1.nRows" name="v1nr" />
    <integer copySource="v2.nRows" name="v2nr" />
    <integer copySource="v3.nRows" name="v3nr" />
    <integer copySource="v4.nRows" name="v4nr" />
    <integer copySource="v5.nRows" name="v5nr" />
    <integer copySource="v6.nRows" name="v6nr" />
    <integer copySource="v7.nRows" name="v7nr" />
    <integer copySource="v8.nRows" name="v8nr" />
    <integer copySource="v9.nRows" name="v9nr" />
    <integer copySource="v10.nRows" name="v10nr" />
    <integer copySource="v11.nRows" name="v11nr" />
    <integer copySource="v12.nRows" name="v12nr" />
  </p>
  <p>N columns:
    <integer copySource="v1.nColumns" name="v1nc" />
    <integer copySource="v2.nColumns" name="v2nc" />
    <integer copySource="v3.nColumns" name="v3nc" />
    <integer copySource="v4.nColumns" name="v4nc" />
    <integer copySource="v5.nColumns" name="v5nc" />
    <integer copySource="v6.nColumns" name="v6nc" />
    <integer copySource="v7.nColumns" name="v7nc" />
    <integer copySource="v8.nColumns" name="v8nc" />
    <integer copySource="v9.nColumns" name="v9nc" />
    <integer copySource="v10.nColumns" name="v10nc" />
    <integer copySource="v11.nColumns" name="v11nc" />
    <integer copySource="v12.nColumns" name="v12nc" />
  </p>
  <p>Matrices:
    <matrix copySource="v1.matrix" name="v1m" />
    <matrix copySource="v2.matrix" name="v2m" />
    <matrix copySource="v3.matrix" name="v3m" />
    <matrix copySource="v4.matrix" name="v4m" />
    <matrix copySource="v5.matrix" name="v5m" />
    <matrix copySource="v6.matrix" name="v6m" />
    <matrix copySource="v7.matrix" name="v7m" />
    <matrix copySource="v8.matrix" name="v8m" />
    <matrix copySource="v9.matrix" name="v9m" />
    <matrix copySource="v10.matrix" name="v10m" />
    <matrix copySource="v11.matrix" name="v11m" />
    <matrix copySource="v12.matrix" name="v12m" />
  </p>
  <p>Matrices as math:
    <math copySource="v1.matrix" name="v1mm" />
    <math copySource="v2.matrix" name="v2mm" />
    <math copySource="v3.matrix" name="v3mm" />
    <math copySource="v4.matrix" name="v4mm" />
    <math copySource="v5.matrix" name="v5mm" />
    <math copySource="v6.matrix" name="v6mm" />
    <math copySource="v7.matrix" name="v7mm" />
    <math copySource="v8.matrix" name="v8mm" />
    <math copySource="v9.matrix" name="v9mm" />
    <math copySource="v10.matrix" name="v10mm" />
    <math copySource="v11.matrix" name="v11mm" />
    <math copySource="v12.matrix" name="v12mm" />
  </p>
  <p>Row 1:
    <matrix copySource="v1.matrix[1]" name="v1r1" />
    <matrix copySource="v2.matrix[1]" name="v2r1" />
    <matrix copySource="v3.matrix[1]" name="v3r1" />
    <matrix copySource="v4.matrix[1]" name="v4r1" />
    <matrix copySource="v5.matrix[1]" name="v5r1" />
    <matrix copySource="v6.matrix[1]" name="v6r1" />
    <matrix copySource="v7.matrix[1]" name="v7r1" />
    <matrix copySource="v8.matrix[1]" name="v8r1" />
    <matrix copySource="v9.matrix[1]" name="v9r1" />
    <matrix copySource="v10.matrix[1]" name="v10r1" />
    <matrix copySource="v11.matrix[1]" name="v11r1" />
    <matrix copySource="v12.matrix[1]" name="v12r1" />
  </p>
  <p>Row 1 b:
    <matrix copySource="v1.row1" name="v1r1b" />
    <matrix copySource="v2.row1" name="v2r1b" />
    <matrix copySource="v3.row1" name="v3r1b" />
    <matrix copySource="v4.row1" name="v4r1b" />
    <matrix copySource="v5.row1" name="v5r1b" />
    <matrix copySource="v6.row1" name="v6r1b" />
    <matrix copySource="v7.row1" name="v7r1b" />
    <matrix copySource="v8.row1" name="v8r1b" />
    <matrix copySource="v9.row1" name="v9r1b" />
    <matrix copySource="v10.row1" name="v10r1b" />
    <matrix copySource="v11.row1" name="v11r1b" />
    <matrix copySource="v12.row1" name="v12r1b" />
  </p>
  <p>Row 1 c:
    <matrix copySource="v1.rows[1]" name="v1r1c" />
    <matrix copySource="v2.rows[1]" name="v2r1c" />
    <matrix copySource="v3.rows[1]" name="v3r1c" />
    <matrix copySource="v4.rows[1]" name="v4r1c" />
    <matrix copySource="v5.rows[1]" name="v5r1c" />
    <matrix copySource="v6.rows[1]" name="v6r1c" />
    <matrix copySource="v7.rows[1]" name="v7r1c" />
    <matrix copySource="v8.rows[1]" name="v8r1c" />
    <matrix copySource="v9.rows[1]" name="v9r1c" />
    <matrix copySource="v10.rows[1]" name="v10r1c" />
    <matrix copySource="v11.rows[1]" name="v11r1c" />
    <matrix copySource="v12.rows[1]" name="v12r1c" />
  </p>
  <p>Row 2:
    <matrix copySource="v1.matrix[2]" name="v1r2" />
    <matrix copySource="v2.matrix[2]" name="v2r2" />
    <matrix copySource="v3.matrix[2]" name="v3r2" />
    <matrix copySource="v4.matrix[2]" name="v4r2" />
    <matrix copySource="v5.matrix[2]" name="v5r2" />
    <matrix copySource="v6.matrix[2]" name="v6r2" />
    <matrix copySource="v7.matrix[2]" name="v7r2" />
    <matrix copySource="v8.matrix[2]" name="v8r2" />
    <matrix copySource="v9.matrix[2]" name="v9r2" />
    <matrix copySource="v10.matrix[2]" name="v10r2" />
    <matrix copySource="v11.matrix[2]" name="v11r2" />
    <matrix copySource="v12.matrix[2]" name="v12r2" />
  </p>
  <p>Row 2 b:
    <matrix copySource="v1.row2" name="v1r2b" />
    <matrix copySource="v2.row2" name="v2r2b" />
    <matrix copySource="v3.row2" name="v3r2b" />
    <matrix copySource="v4.row2" name="v4r2b" />
    <matrix copySource="v5.row2" name="v5r2b" />
    <matrix copySource="v6.row2" name="v6r2b" />
    <matrix copySource="v7.row2" name="v7r2b" />
    <matrix copySource="v8.row2" name="v8r2b" />
    <matrix copySource="v9.row2" name="v9r2b" />
    <matrix copySource="v10.row2" name="v10r2b" />
    <matrix copySource="v11.row2" name="v11r2b" />
    <matrix copySource="v12.row2" name="v12r2b" />
  </p>
  <p>Row 2 c:
    <matrix copySource="v1.rows[2]" name="v1r2c" />
    <matrix copySource="v2.rows[2]" name="v2r2c" />
    <matrix copySource="v3.rows[2]" name="v3r2c" />
    <matrix copySource="v4.rows[2]" name="v4r2c" />
    <matrix copySource="v5.rows[2]" name="v5r2c" />
    <matrix copySource="v6.rows[2]" name="v6r2c" />
    <matrix copySource="v7.rows[2]" name="v7r2c" />
    <matrix copySource="v8.rows[2]" name="v8r2c" />
    <matrix copySource="v9.rows[2]" name="v9r2c" />
    <matrix copySource="v10.rows[2]" name="v10r2c" />
    <matrix copySource="v11.rows[2]" name="v11r2c" />
    <matrix copySource="v12.rows[2]" name="v12r2c" />
  </p>
  <p>Column 1:
    <matrix copySource="v1.columns[1]" name="v1c1" />
    <matrix copySource="v2.columns[1]" name="v2c1" />
    <matrix copySource="v3.columns[1]" name="v3c1" />
    <matrix copySource="v4.columns[1]" name="v4c1" />
    <matrix copySource="v5.columns[1]" name="v5c1" />
    <matrix copySource="v6.columns[1]" name="v6c1" />
    <matrix copySource="v7.columns[1]" name="v7c1" />
    <matrix copySource="v8.columns[1]" name="v8c1" />
    <matrix copySource="v9.columns[1]" name="v9c1" />
    <matrix copySource="v10.columns[1]" name="v10c1" />
    <matrix copySource="v11.columns[1]" name="v11c1" />
    <matrix copySource="v12.columns[1]" name="v12c1" />
  </p>
  <p>Column 1 b:
    <matrix copySource="v1.column1" name="v1c1b" />
    <matrix copySource="v2.column1" name="v2c1b" />
    <matrix copySource="v3.column1" name="v3c1b" />
    <matrix copySource="v4.column1" name="v4c1b" />
    <matrix copySource="v5.column1" name="v5c1b" />
    <matrix copySource="v6.column1" name="v6c1b" />
    <matrix copySource="v7.column1" name="v7c1b" />
    <matrix copySource="v8.column1" name="v8c1b" />
    <matrix copySource="v9.column1" name="v9c1b" />
    <matrix copySource="v10.column1" name="v10c1b" />
    <matrix copySource="v11.column1" name="v11c1b" />
    <matrix copySource="v12.column1" name="v12c1b" />
  </p>
  <p>Column 2:
    <matrix copySource="v1.columns[2]" name="v1c2" />
    <matrix copySource="v2.columns[2]" name="v2c2" />
    <matrix copySource="v3.columns[2]" name="v3c2" />
    <matrix copySource="v4.columns[2]" name="v4c2" />
    <matrix copySource="v5.columns[2]" name="v5c2" />
    <matrix copySource="v6.columns[2]" name="v6c2" />
    <matrix copySource="v7.columns[2]" name="v7c2" />
    <matrix copySource="v8.columns[2]" name="v8c2" />
    <matrix copySource="v9.columns[2]" name="v9c2" />
    <matrix copySource="v10.columns[2]" name="v10c2" />
    <matrix copySource="v11.columns[2]" name="v11c2" />
    <matrix copySource="v12.columns[2]" name="v12c2" />
  </p>
  <p>Column 2 b:
    <matrix copySource="v1.column2" name="v1c2b" />
    <matrix copySource="v2.column2" name="v2c2b" />
    <matrix copySource="v3.column2" name="v3c2b" />
    <matrix copySource="v4.column2" name="v4c2b" />
    <matrix copySource="v5.column2" name="v5c2b" />
    <matrix copySource="v6.column2" name="v6c2b" />
    <matrix copySource="v7.column2" name="v7c2b" />
    <matrix copySource="v8.column2" name="v8c2b" />
    <matrix copySource="v9.column2" name="v9c2b" />
    <matrix copySource="v10.column2" name="v10c2b" />
    <matrix copySource="v11.column2" name="v11c2b" />
    <matrix copySource="v12.column2" name="v12c2b" />
  </p>

  <p>Matrix entry 12:
    <math copySource="v1.matrix[1][2]" name="v1me12" />
    <math copySource="v2.matrix[1][2]" name="v2me12" />
    <math copySource="v3.matrix[1][2]" name="v3me12" />
    <math copySource="v4.matrix[1][2]" name="v4me12" />
    <math copySource="v5.matrix[1][2]" name="v5me12" />
    <math copySource="v6.matrix[1][2]" name="v6me12" />
    <math copySource="v7.matrix[1][2]" name="v7me12" />
    <math copySource="v8.matrix[1][2]" name="v8me12" />
    <math copySource="v9.matrix[1][2]" name="v9me12" />
    <math copySource="v10.matrix[1][2]" name="v10me12" />
    <math copySource="v11.matrix[1][2]" name="v11me12" />
    <math copySource="v12.matrix[1][2]" name="v12me12" />
  </p>
  <p>Matrix entry 12 b:
    <math copySource="v1.rows[1][2]" name="v1me12b" />
    <math copySource="v2.rows[1][2]" name="v2me12b" />
    <math copySource="v3.rows[1][2]" name="v3me12b" />
    <math copySource="v4.rows[1][2]" name="v4me12b" />
    <math copySource="v5.rows[1][2]" name="v5me12b" />
    <math copySource="v6.rows[1][2]" name="v6me12b" />
    <math copySource="v7.rows[1][2]" name="v7me12b" />
    <math copySource="v8.rows[1][2]" name="v8me12b" />
    <math copySource="v9.rows[1][2]" name="v9me12b" />
    <math copySource="v10.rows[1][2]" name="v10me12b" />
    <math copySource="v11.rows[1][2]" name="v11me12b" />
    <math copySource="v12.rows[1][2]" name="v12me12b" />
  </p>
  <p>Matrix entry 12 c:
    <math copySource="v1.columns[2][1]" name="v1me12c" />
    <math copySource="v2.columns[2][1]" name="v2me12c" />
    <math copySource="v3.columns[2][1]" name="v3me12c" />
    <math copySource="v4.columns[2][1]" name="v4me12c" />
    <math copySource="v5.columns[2][1]" name="v5me12c" />
    <math copySource="v6.columns[2][1]" name="v6me12c" />
    <math copySource="v7.columns[2][1]" name="v7me12c" />
    <math copySource="v8.columns[2][1]" name="v8me12c" />
    <math copySource="v9.columns[2][1]" name="v9me12c" />
    <math copySource="v10.columns[2][1]" name="v10me12c" />
    <math copySource="v11.columns[2][1]" name="v11me12c" />
    <math copySource="v12.columns[2][1]" name="v12me12c" />
  </p>
  <p>Matrix entry 12 d:
    <math copySource="v1.row1[2]" name="v1me12d" />
    <math copySource="v2.row1[2]" name="v2me12d" />
    <math copySource="v3.row1[2]" name="v3me12d" />
    <math copySource="v4.row1[2]" name="v4me12d" />
    <math copySource="v5.row1[2]" name="v5me12d" />
    <math copySource="v6.row1[2]" name="v6me12d" />
    <math copySource="v7.row1[2]" name="v7me12d" />
    <math copySource="v8.row1[2]" name="v8me12d" />
    <math copySource="v9.row1[2]" name="v9me12d" />
    <math copySource="v10.row1[2]" name="v10me12d" />
    <math copySource="v11.row1[2]" name="v11me12d" />
    <math copySource="v12.row1[2]" name="v12me12d" />
  </p>
  <p>Matrix entry 12 e:
    <math copySource="v1.column2[1]" name="v1me12e" />
    <math copySource="v2.column2[1]" name="v2me12e" />
    <math copySource="v3.column2[1]" name="v3me12e" />
    <math copySource="v4.column2[1]" name="v4me12e" />
    <math copySource="v5.column2[1]" name="v5me12e" />
    <math copySource="v6.column2[1]" name="v6me12e" />
    <math copySource="v7.column2[1]" name="v7me12e" />
    <math copySource="v8.column2[1]" name="v8me12e" />
    <math copySource="v9.column2[1]" name="v9me12e" />
    <math copySource="v10.column2[1]" name="v10me12e" />
    <math copySource="v11.column2[1]" name="v11me12e" />
    <math copySource="v12.column2[1]" name="v12me12e" />
  </p>
  <p>Matrix entry 12 f:
    <math copySource="v1.matrixEntry1_2" name="v1me12f" />
    <math copySource="v2.matrixEntry1_2" name="v2me12f" />
    <math copySource="v3.matrixEntry1_2" name="v3me12f" />
    <math copySource="v4.matrixEntry1_2" name="v4me12f" />
    <math copySource="v5.matrixEntry1_2" name="v5me12f" />
    <math copySource="v6.matrixEntry1_2" name="v6me12f" />
    <math copySource="v7.matrixEntry1_2" name="v7me12f" />
    <math copySource="v8.matrixEntry1_2" name="v8me12f" />
    <math copySource="v9.matrixEntry1_2" name="v9me12f" />
    <math copySource="v10.matrixEntry1_2" name="v10me12f" />
    <math copySource="v11.matrixEntry1_2" name="v11me12f" />
    <math copySource="v12.matrixEntry1_2" name="v12me12f" />
  </p>
  <p>Matrix entry 21:
    <math copySource="v1.matrix[2][1]" name="v1me21" />
    <math copySource="v2.matrix[2][1]" name="v2me21" />
    <math copySource="v3.matrix[2][1]" name="v3me21" />
    <math copySource="v4.matrix[2][1]" name="v4me21" />
    <math copySource="v5.matrix[2][1]" name="v5me21" />
    <math copySource="v6.matrix[2][1]" name="v6me21" />
    <math copySource="v7.matrix[2][1]" name="v7me21" />
    <math copySource="v8.matrix[2][1]" name="v8me21" />
    <math copySource="v9.matrix[2][1]" name="v9me21" />
    <math copySource="v10.matrix[2][1]" name="v10me21" />
    <math copySource="v11.matrix[2][1]" name="v11me21" />
    <math copySource="v12.matrix[2][1]" name="v12me21" />
  </p>
  <p>Matrix entry 21 b:
    <math copySource="v1.rows[2][1]" name="v1me21b" />
    <math copySource="v2.rows[2][1]" name="v2me21b" />
    <math copySource="v3.rows[2][1]" name="v3me21b" />
    <math copySource="v4.rows[2][1]" name="v4me21b" />
    <math copySource="v5.rows[2][1]" name="v5me21b" />
    <math copySource="v6.rows[2][1]" name="v6me21b" />
    <math copySource="v7.rows[2][1]" name="v7me21b" />
    <math copySource="v8.rows[2][1]" name="v8me21b" />
    <math copySource="v9.rows[2][1]" name="v9me21b" />
    <math copySource="v10.rows[2][1]" name="v10me21b" />
    <math copySource="v11.rows[2][1]" name="v11me21b" />
    <math copySource="v12.rows[2][1]" name="v12me21b" />
  </p>
  <p>Matrix entry 21 c:
    <math copySource="v1.columns[1][2]" name="v1me21c" />
    <math copySource="v2.columns[1][2]" name="v2me21c" />
    <math copySource="v3.columns[1][2]" name="v3me21c" />
    <math copySource="v4.columns[1][2]" name="v4me21c" />
    <math copySource="v5.columns[1][2]" name="v5me21c" />
    <math copySource="v6.columns[1][2]" name="v6me21c" />
    <math copySource="v7.columns[1][2]" name="v7me21c" />
    <math copySource="v8.columns[1][2]" name="v8me21c" />
    <math copySource="v9.columns[1][2]" name="v9me21c" />
    <math copySource="v10.columns[1][2]" name="v10me21c" />
    <math copySource="v11.columns[1][2]" name="v11me21c" />
    <math copySource="v12.columns[1][2]" name="v12me21c" />
  </p>
  <p>Matrix entry 21 d:
    <math copySource="v1.row2[1]" name="v1me21d" />
    <math copySource="v2.row2[1]" name="v2me21d" />
    <math copySource="v3.row2[1]" name="v3me21d" />
    <math copySource="v4.row2[1]" name="v4me21d" />
    <math copySource="v5.row2[1]" name="v5me21d" />
    <math copySource="v6.row2[1]" name="v6me21d" />
    <math copySource="v7.row2[1]" name="v7me21d" />
    <math copySource="v8.row2[1]" name="v8me21d" />
    <math copySource="v9.row2[1]" name="v9me21d" />
    <math copySource="v10.row2[1]" name="v10me21d" />
    <math copySource="v11.row2[1]" name="v11me21d" />
    <math copySource="v12.row2[1]" name="v12me21d" />
  </p>
  <p>Matrix entry 21 e:
    <math copySource="v1.column1[2]" name="v1me21e" />
    <math copySource="v2.column1[2]" name="v2me21e" />
    <math copySource="v3.column1[2]" name="v3me21e" />
    <math copySource="v4.column1[2]" name="v4me21e" />
    <math copySource="v5.column1[2]" name="v5me21e" />
    <math copySource="v6.column1[2]" name="v6me21e" />
    <math copySource="v7.column1[2]" name="v7me21e" />
    <math copySource="v8.column1[2]" name="v8me21e" />
    <math copySource="v9.column1[2]" name="v9me21e" />
    <math copySource="v10.column1[2]" name="v10me21e" />
    <math copySource="v11.column1[2]" name="v11me21e" />
    <math copySource="v12.column1[2]" name="v12me21e" />
  </p>
  <p>Matrix entry 21 f:
    <math copySource="v1.matrixEntry2_1" name="v1me21f" />
    <math copySource="v2.matrixEntry2_1" name="v2me21f" />
    <math copySource="v3.matrixEntry2_1" name="v3me21f" />
    <math copySource="v4.matrixEntry2_1" name="v4me21f" />
    <math copySource="v5.matrixEntry2_1" name="v5me21f" />
    <math copySource="v6.matrixEntry2_1" name="v6me21f" />
    <math copySource="v7.matrixEntry2_1" name="v7me21f" />
    <math copySource="v8.matrixEntry2_1" name="v8me21f" />
    <math copySource="v9.matrixEntry2_1" name="v9me21f" />
    <math copySource="v10.matrixEntry2_1" name="v10me21f" />
    <math copySource="v11.matrixEntry2_1" name="v11me21f" />
    <math copySource="v12.matrixEntry2_1" name="v12me21f" />
  </p>

  <p>Graph vectors</p>
  <graph>
    <vector copySource="v1.vector" name="v1vb" />
    <vector copySource="v2.vector" name="v2vb" />
    <vector copySource="v3.vector" name="v3vb" />
    <vector copySource="v4.vector" name="v4vb" />
    <vector copySource="v5.vector" name="v5vb" />
    <vector copySource="v6.vector" name="v6vb" />
    <vector copySource="v7.vector" name="v7vb" />
    <vector copySource="v8.vector" name="v8vb" />
    <vector copySource="v9.vector" name="v9vb" />
    <vector copySource="v10.vector" name="v10vb" />
    <vector copySource="v11.vector" name="v11vb" />
    <vector copySource="v12.vector" name="v12vb" />
  </graph>

  <p>Change matrices</p>
  <p><matrixInput name="mi1" showSizeControls="false" bindValueTo="$v1.matrix" /></p>
  <p><matrixInput name="mi2" showSizeControls="false" bindValueTo="$v2.matrix" /></p>
  <p><matrixInput name="mi3" showSizeControls="false" bindValueTo="$v3.matrix" /></p>
  <p><matrixInput name="mi4" showSizeControls="false" bindValueTo="$v4.matrix" /></p>
  <p><matrixInput name="mi5" showSizeControls="false" bindValueTo="$v5.matrix" /></p>
  <p><matrixInput name="mi6" showSizeControls="false" bindValueTo="$v6.matrix" /></p>
  <p><matrixInput name="mi7" showSizeControls="false" bindValueTo="$v7.matrix" /></p>
  <p><matrixInput name="mi8" showSizeControls="false" bindValueTo="$v8.matrix" /></p>
  <p><matrixInput name="mi9" showSizeControls="false" bindValueTo="$v9.matrix" /></p>
  <p><matrixInput name="mi10" showSizeControls="false" bindValueTo="$v10.matrix" /></p>
  <p><matrixInput name="mi11" showSizeControls="false" bindValueTo="$v11.matrix" /></p>
  <p><matrixInput name="mi12" showSizeControls="false" bindValueTo="$v12.matrix" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/v1') + ' .mjx-mrow').eq(0).should('have.text', "[12]");
    cy.get(cesc('#\\/v2') + ' .mjx-mrow').eq(0).should('have.text', "[12]");
    cy.get(cesc('#\\/v3') + ' .mjx-mrow').eq(0).should('have.text', "(1,2)");
    cy.get(cesc('#\\/v4') + ' .mjx-mrow').eq(0).should('have.text', "(1,2)′");
    cy.get(cesc('#\\/v5') + ' .mjx-mrow').eq(0).should('have.text', "(1,2)T");
    cy.get(cesc('#\\/v6') + ' .mjx-mrow').eq(0).should('have.text', "1,2");
    cy.get(cesc('#\\/v7') + ' .mjx-mrow').eq(0).should('have.text', "(1,2)");
    cy.get(cesc('#\\/v8') + ' .mjx-mrow').eq(0).should('have.text', "(1,2)′");
    cy.get(cesc('#\\/v9') + ' .mjx-mrow').eq(0).should('have.text', "(1,2)T");
    cy.get(cesc('#\\/v10') + ' .mjx-mrow').eq(0).should('have.text', "⟨1,2⟩");
    cy.get(cesc('#\\/v11') + ' .mjx-mrow').eq(0).should('have.text', "⟨1,2⟩′");
    cy.get(cesc('#\\/v12') + ' .mjx-mrow').eq(0).should('have.text', "⟨1,2⟩T");

    cy.get(cesc("#\\/v1nd")).should('have.text', '2')
    cy.get(cesc("#\\/v2nd")).should('have.text', '2')
    cy.get(cesc("#\\/v3nd")).should('have.text', '2')
    cy.get(cesc("#\\/v4nd")).should('have.text', '2')
    cy.get(cesc("#\\/v5nd")).should('have.text', '2')
    cy.get(cesc("#\\/v6nd")).should('have.text', '2')
    cy.get(cesc("#\\/v7nd")).should('have.text', '2')
    cy.get(cesc("#\\/v8nd")).should('have.text', '2')
    cy.get(cesc("#\\/v9nd")).should('have.text', '2')
    cy.get(cesc("#\\/v10nd")).should('have.text', '2')
    cy.get(cesc("#\\/v11nd")).should('have.text', '2')
    cy.get(cesc("#\\/v12nd")).should('have.text', '2')

    cy.get(cesc("#\\/v1v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v2v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v3v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v4v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v5v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v6v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v7v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v8v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v9v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v10v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v11v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v12v") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')

    cy.get(cesc("#\\/v1vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v2vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v3vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v4vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v5vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v6vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v7vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v8vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v9vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v10vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v11vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')
    cy.get(cesc("#\\/v12vm") + " .mjx-mrow").eq(0).should('have.text', '(1,2)')

    cy.get(cesc("#\\/v1x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v2x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v3x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v4x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v5x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v6x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v7x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v8x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v9x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v10x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v11x") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v12x") + " .mjx-mrow").eq(0).should('have.text', '1')

    cy.get(cesc("#\\/v1xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v2xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v3xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v4xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v5xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v6xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v7xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v8xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v9xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v10xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v11xb") + " .mjx-mrow").eq(0).should('have.text', '1')
    cy.get(cesc("#\\/v12xb") + " .mjx-mrow").eq(0).should('have.text', '1')

    cy.get(cesc("#\\/v1y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v2y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v3y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v4y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v5y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v6y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v7y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v8y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v9y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v10y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v11y") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v12y") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/v1yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v2yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v3yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v4yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v5yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v6yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v7yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v8yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v9yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v10yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v11yb") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v12yb") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/v1ms")).should('have.text', '2, 1')
    cy.get(cesc("#\\/v2ms")).should('have.text', '1, 2')
    cy.get(cesc("#\\/v3ms")).should('have.text', '2, 1')
    cy.get(cesc("#\\/v4ms")).should('have.text', '1, 2')
    cy.get(cesc("#\\/v5ms")).should('have.text', '1, 2')
    cy.get(cesc("#\\/v6ms")).should('have.text', '2, 1')
    cy.get(cesc("#\\/v7ms")).should('have.text', '2, 1')
    cy.get(cesc("#\\/v8ms")).should('have.text', '1, 2')
    cy.get(cesc("#\\/v9ms")).should('have.text', '1, 2')
    cy.get(cesc("#\\/v10ms")).should('have.text', '2, 1')
    cy.get(cesc("#\\/v11ms")).should('have.text', '1, 2')
    cy.get(cesc("#\\/v12ms")).should('have.text', '1, 2')

    cy.get(cesc("#\\/v1nr")).should('have.text', '2')
    cy.get(cesc("#\\/v2nr")).should('have.text', '1')
    cy.get(cesc("#\\/v3nr")).should('have.text', '2')
    cy.get(cesc("#\\/v4nr")).should('have.text', '1')
    cy.get(cesc("#\\/v5nr")).should('have.text', '1')
    cy.get(cesc("#\\/v6nr")).should('have.text', '2')
    cy.get(cesc("#\\/v7nr")).should('have.text', '2')
    cy.get(cesc("#\\/v8nr")).should('have.text', '1')
    cy.get(cesc("#\\/v9nr")).should('have.text', '1')
    cy.get(cesc("#\\/v10nr")).should('have.text', '2')
    cy.get(cesc("#\\/v11nr")).should('have.text', '1')
    cy.get(cesc("#\\/v12nr")).should('have.text', '1')

    cy.get(cesc("#\\/v1nc")).should('have.text', '1')
    cy.get(cesc("#\\/v2nc")).should('have.text', '2')
    cy.get(cesc("#\\/v3nc")).should('have.text', '1')
    cy.get(cesc("#\\/v4nc")).should('have.text', '2')
    cy.get(cesc("#\\/v5nc")).should('have.text', '2')
    cy.get(cesc("#\\/v6nc")).should('have.text', '1')
    cy.get(cesc("#\\/v7nc")).should('have.text', '1')
    cy.get(cesc("#\\/v8nc")).should('have.text', '2')
    cy.get(cesc("#\\/v9nc")).should('have.text', '2')
    cy.get(cesc("#\\/v10nc")).should('have.text', '1')
    cy.get(cesc("#\\/v11nc")).should('have.text', '2')
    cy.get(cesc("#\\/v12nc")).should('have.text', '2')

    cy.get(cesc("#\\/v1m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v2m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v3m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v4m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v5m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v6m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v7m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v8m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v9m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v10m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v11m") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v12m") + " .mjx-mrow").eq(0).should('have.text', '[12]')

    cy.get(cesc("#\\/v1mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v2mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v3mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v4mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v5mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v6mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v7mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v8mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v9mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v10mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v11mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v12mm") + " .mjx-mrow").eq(0).should('have.text', '[12]')

    cy.get(cesc("#\\/v1r1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v2r1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v3r1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v4r1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v5r1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v6r1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v7r1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v8r1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v9r1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v10r1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v11r1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v12r1") + " .mjx-mrow").eq(0).should('have.text', '[12]')

    cy.get(cesc("#\\/v1r1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v2r1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v3r1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v4r1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v5r1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v6r1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v7r1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v8r1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v9r1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v10r1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v11r1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v12r1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')

    cy.get(cesc("#\\/v1r1c") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v2r1c") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v3r1c") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v4r1c") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v5r1c") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v6r1c") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v7r1c") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v8r1c") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v9r1c") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v10r1c") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v11r1c") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v12r1c") + " .mjx-mrow").eq(0).should('have.text', '[12]')

    cy.get(cesc("#\\/v1r2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v2r2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v3r2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v4r2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v5r2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v6r2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v7r2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v8r2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v9r2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v10r2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v11r2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v12r2") + " .mjx-mrow").eq(0).should('have.text', '[]')

    cy.get(cesc("#\\/v1r2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v2r2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v3r2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v4r2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v5r2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v6r2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v7r2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v8r2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v9r2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v10r2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v11r2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v12r2b") + " .mjx-mrow").eq(0).should('have.text', '[]')

    cy.get(cesc("#\\/v1r2c") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v2r2c") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v3r2c") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v4r2c") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v5r2c") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v6r2c") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v7r2c") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v8r2c") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v9r2c") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v10r2c") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v11r2c") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v12r2c") + " .mjx-mrow").eq(0).should('have.text', '[]')

    cy.get(cesc("#\\/v1c1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v2c1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v3c1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v4c1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v5c1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v6c1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v7c1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v8c1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v9c1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v10c1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v11c1") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v12c1") + " .mjx-mrow").eq(0).should('have.text', '[1]')

    cy.get(cesc("#\\/v1c1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v2c1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v3c1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v4c1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v5c1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v6c1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v7c1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v8c1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v9c1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v10c1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/v11c1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')
    cy.get(cesc("#\\/v12c1b") + " .mjx-mrow").eq(0).should('have.text', '[1]')

    cy.get(cesc("#\\/v1c2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v2c2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v3c2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v4c2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v5c2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v6c2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v7c2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v8c2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v9c2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v10c2") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v11c2") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v12c2") + " .mjx-mrow").eq(0).should('have.text', '[2]')

    cy.get(cesc("#\\/v1c2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v2c2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v3c2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v4c2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v5c2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v6c2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v7c2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v8c2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v9c2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v10c2b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/v11c2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')
    cy.get(cesc("#\\/v12c2b") + " .mjx-mrow").eq(0).should('have.text', '[2]')

    cy.get(cesc("#\\/v1me12") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v2me12") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v3me12") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v4me12") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v5me12") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v6me12") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v7me12") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v8me12") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v9me12") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v10me12") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v11me12") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v12me12") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/v1me12b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v2me12b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v3me12b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v4me12b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v5me12b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v6me12b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v7me12b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v8me12b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v9me12b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v10me12b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v11me12b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v12me12b") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/v1me12c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v2me12c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v3me12c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v4me12c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v5me12c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v6me12c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v7me12c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v8me12c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v9me12c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v10me12c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v11me12c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v12me12c") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/v1me12d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v2me12d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v3me12d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v4me12d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v5me12d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v6me12d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v7me12d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v8me12d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v9me12d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v10me12d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v11me12d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v12me12d") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/v1me12e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v2me12e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v3me12e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v4me12e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v5me12e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v6me12e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v7me12e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v8me12e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v9me12e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v10me12e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v11me12e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v12me12e") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/v1me12f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v2me12f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v3me12f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v4me12f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v5me12f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v6me12f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v7me12f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v8me12f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v9me12f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v10me12f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v11me12f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v12me12f") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/v1me21") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v2me21") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v3me21") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v4me21") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v5me21") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v6me21") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v7me21") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v8me21") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v9me21") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v10me21") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v11me21") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v12me21") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get(cesc("#\\/v1me21b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v2me21b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v3me21b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v4me21b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v5me21b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v6me21b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v7me21b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v8me21b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v9me21b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v10me21b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v11me21b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v12me21b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get(cesc("#\\/v1me21c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v2me21c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v3me21c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v4me21c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v5me21c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v6me21c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v7me21c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v8me21c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v9me21c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v10me21c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v11me21c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v12me21c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get(cesc("#\\/v1me21d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v2me21d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v3me21d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v4me21d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v5me21d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v6me21d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v7me21d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v8me21d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v9me21d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v10me21d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v11me21d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v12me21d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get(cesc("#\\/v1me21e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v2me21e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v3me21e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v4me21e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v5me21e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v6me21e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v7me21e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v8me21e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v9me21e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v10me21e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v11me21e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v12me21e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get(cesc("#\\/v1me21f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v2me21f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v3me21f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v4me21f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v5me21f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v6me21f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v7me21f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v8me21f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v9me21f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v10me21f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/v11me21f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/v12me21f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')


    cy.log('move vectors')

    cy.window().then(async (win) => {

      win.callAction1({
        actionName: "moveVector",
        componentName: "/v1vb",
        args: {
          headcoords: [2, 1]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v2vb",
        args: {
          headcoords: [2, 2]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v3vb",
        args: {
          headcoords: [2, 3]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v4vb",
        args: {
          headcoords: [2, 4]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v5vb",
        args: {
          headcoords: [2, 5]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v6vb",
        args: {
          headcoords: [2, 6]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v7vb",
        args: {
          headcoords: [2, 7]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v8vb",
        args: {
          headcoords: [2, 8]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v9vb",
        args: {
          headcoords: [2, 9]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v10vb",
        args: {
          headcoords: [2, 10]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v11vb",
        args: {
          headcoords: [2, 11]
        }
      })
      win.callAction1({
        actionName: "moveVector",
        componentName: "/v12vb",
        args: {
          headcoords: [2, 12]
        }
      })

    })

    cy.get(cesc('#\\/v12') + ' .mjx-mrow').should('contain.text', "⟨2,12⟩T");

    cy.get(cesc('#\\/v1') + ' .mjx-mrow').eq(0).should('have.text', "[21]");
    cy.get(cesc('#\\/v2') + ' .mjx-mrow').eq(0).should('have.text', "[22]");
    cy.get(cesc('#\\/v3') + ' .mjx-mrow').eq(0).should('have.text', "(2,3)");
    cy.get(cesc('#\\/v4') + ' .mjx-mrow').eq(0).should('have.text', "(2,4)′");
    cy.get(cesc('#\\/v5') + ' .mjx-mrow').eq(0).should('have.text', "(2,5)T");
    cy.get(cesc('#\\/v6') + ' .mjx-mrow').eq(0).should('have.text', "2,6");
    cy.get(cesc('#\\/v7') + ' .mjx-mrow').eq(0).should('have.text', "(2,7)");
    cy.get(cesc('#\\/v8') + ' .mjx-mrow').eq(0).should('have.text', "(2,8)′");
    cy.get(cesc('#\\/v9') + ' .mjx-mrow').eq(0).should('have.text', "(2,9)T");
    cy.get(cesc('#\\/v10') + ' .mjx-mrow').eq(0).should('have.text', "⟨2,10⟩");
    cy.get(cesc('#\\/v11') + ' .mjx-mrow').eq(0).should('have.text', "⟨2,11⟩′");
    cy.get(cesc('#\\/v12') + ' .mjx-mrow').eq(0).should('have.text', "⟨2,12⟩T");


    cy.log('change from matrix inputs')

    cy.get(cesc('#\\/mi1_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi1_component_1_0') + ' textarea').type("{end}{backspace}-1{enter}", { force: true })
    cy.get(cesc('#\\/mi2_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi2_component_0_1') + ' textarea').type("{end}{backspace}-2{enter}", { force: true })
    cy.get(cesc('#\\/mi3_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi3_component_1_0') + ' textarea').type("{end}{backspace}-3{enter}", { force: true })
    cy.get(cesc('#\\/mi4_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi4_component_0_1') + ' textarea').type("{end}{backspace}-4{enter}", { force: true })
    cy.get(cesc('#\\/mi5_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi5_component_0_1') + ' textarea').type("{end}{backspace}-5{enter}", { force: true })
    cy.get(cesc('#\\/mi6_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi6_component_1_0') + ' textarea').type("{end}{backspace}-6{enter}", { force: true })
    cy.get(cesc('#\\/mi7_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi7_component_1_0') + ' textarea').type("{end}{backspace}-7{enter}", { force: true })
    cy.get(cesc('#\\/mi8_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi8_component_0_1') + ' textarea').type("{end}{backspace}-8{enter}", { force: true })
    cy.get(cesc('#\\/mi9_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi9_component_0_1') + ' textarea').type("{end}{backspace}-9{enter}", { force: true })
    cy.get(cesc('#\\/mi10_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi10_component_1_0') + ' textarea').type("{end}{backspace}{backspace}-10{enter}", { force: true })
    cy.get(cesc('#\\/mi11_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi11_component_0_1') + ' textarea').type("{end}{backspace}{backspace}-11{enter}", { force: true })
    cy.get(cesc('#\\/mi12_component_0_0') + ' textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get(cesc('#\\/mi12_component_0_1') + ' textarea').type("{end}{backspace}{backspace}-12{enter}", { force: true })


    cy.get(cesc('#\\/v12') + ' .mjx-mrow').should('contain.text', "⟨3,−12⟩T");

    cy.get(cesc('#\\/v1') + ' .mjx-mrow').eq(0).should('have.text', "[3−1]");
    cy.get(cesc('#\\/v2') + ' .mjx-mrow').eq(0).should('have.text', "[3−2]");
    cy.get(cesc('#\\/v3') + ' .mjx-mrow').eq(0).should('have.text', "(3,−3)");
    cy.get(cesc('#\\/v4') + ' .mjx-mrow').eq(0).should('have.text', "(3,−4)′");
    cy.get(cesc('#\\/v5') + ' .mjx-mrow').eq(0).should('have.text', "(3,−5)T");
    cy.get(cesc('#\\/v6') + ' .mjx-mrow').eq(0).should('have.text', "3,−6");
    cy.get(cesc('#\\/v7') + ' .mjx-mrow').eq(0).should('have.text', "(3,−7)");
    cy.get(cesc('#\\/v8') + ' .mjx-mrow').eq(0).should('have.text', "(3,−8)′");
    cy.get(cesc('#\\/v9') + ' .mjx-mrow').eq(0).should('have.text', "(3,−9)T");
    cy.get(cesc('#\\/v10') + ' .mjx-mrow').eq(0).should('have.text', "⟨3,−10⟩");
    cy.get(cesc('#\\/v11') + ' .mjx-mrow').eq(0).should('have.text', "⟨3,−11⟩′");
    cy.get(cesc('#\\/v12') + ' .mjx-mrow').eq(0).should('have.text', "⟨3,−12⟩T");

  });

  it('matrix state variables, non vector matrices', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p>Originals: <math format="latex" name="m1">
    \\begin{pmatrix}
      1 & 2\\\\
      3 & 4\\\\
      5 & 6
    \\end{pmatrix}
  </math>
  <matrix name="m2">
    <row>1 2</row>
    <row>3 4</row>
    <row>5 6</row>
  </matrix>
  <matrix name="m3">
    <column>1 3 5</column>
    <column>2 4 6</column>
  </matrix>
  </p>
  <p>Matrix size:
    <numberList copySource="m1.matrixSize" name="m1ms" />
    <numberList copySource="m2.matrixSize" name="m2ms" />
    <numberList copySource="m3.matrixSize" name="m3ms" />
  </p>
  <p>N rows:
    <integer copySource="m1.nRows" name="m1nr" />
    <integer copySource="m2.nRows" name="m2nr" />
    <integer copySource="m3.nRows" name="m3nr" />
  </p>
  <p>N columns:
    <integer copySource="m1.nColumns" name="m1nc" />
    <integer copySource="m2.nColumns" name="m2nc" />
    <integer copySource="m3.nColumns" name="m3nc" />
  </p>
  <p>Matrices:
    <matrix copySource="m1.matrix" name="m1m" />
    <matrix copySource="m2.matrix" name="m2m" />
    <matrix copySource="m3.matrix" name="m3m" />
  </p>
  <p>Matrices as math:
    <math copySource="m1.matrix" name="m1mm" />
    <math copySource="m2.matrix" name="m2mm" />
    <math copySource="m3.matrix" name="m3mm" />
  </p>
  <p>Row 1:
    <matrix copySource="m1.matrix[1]" name="m1r1" />
    <matrix copySource="m2.matrix[1]" name="m2r1" />
    <matrix copySource="m3.matrix[1]" name="m3r1" />
  </p>
  <p>Row 1 b:
    <matrix copySource="m1.row1" name="m1r1b" />
    <matrix copySource="m2.row1" name="m2r1b" />
    <matrix copySource="m3.row1" name="m3r1b" />
  </p>
  <p>Row 1 c:
    <matrix copySource="m1.rows[1]" name="m1r1c" />
    <matrix copySource="m2.rows[1]" name="m2r1c" />
    <matrix copySource="m3.rows[1]" name="m3r1c" />
  </p>
  <p>Row 2:
    <matrix copySource="m1.matrix[2]" name="m1r2" />
    <matrix copySource="m2.matrix[2]" name="m2r2" />
    <matrix copySource="m3.matrix[2]" name="m3r2" />
  </p>
  <p>Row 2 b:
    <matrix copySource="m1.row2" name="m1r2b" />
    <matrix copySource="m2.row2" name="m2r2b" />
    <matrix copySource="m3.row2" name="m3r2b" />
  </p>
  <p>Row 2 c:
    <matrix copySource="m1.rows[2]" name="m1r2c" />
    <matrix copySource="m2.rows[2]" name="m2r2c" />
    <matrix copySource="m3.rows[2]" name="m3r2c" />
  </p>
  <p>Row 3:
    <matrix copySource="m1.matrix[3]" name="m1r3" />
    <matrix copySource="m2.matrix[3]" name="m2r3" />
    <matrix copySource="m3.matrix[3]" name="m3r3" />
  </p>
  <p>Row 3 b:
    <matrix copySource="m1.row3" name="m1r3b" />
    <matrix copySource="m2.row3" name="m2r3b" />
    <matrix copySource="m3.row3" name="m3r3b" />
  </p>
  <p>Row 3 c:
    <matrix copySource="m1.rows[3]" name="m1r3c" />
    <matrix copySource="m2.rows[3]" name="m2r3c" />
    <matrix copySource="m3.rows[3]" name="m3r3c" />
  </p>
  <p>Row 4:
    <matrix copySource="m1.matrix[4]" name="m1r4" />
    <matrix copySource="m2.matrix[4]" name="m2r4" />
    <matrix copySource="m3.matrix[4]" name="m3r4" />
  </p>
  <p>Row 4 b:
    <matrix copySource="m1.row4" name="m1r4b" />
    <matrix copySource="m2.row4" name="m2r4b" />
    <matrix copySource="m3.row4" name="m3r4b" />
  </p>
  <p>Row 4 c:
    <matrix copySource="m1.rows[4]" name="m1r4c" />
    <matrix copySource="m2.rows[4]" name="m2r4c" />
    <matrix copySource="m3.rows[4]" name="m3r4c" />
  </p>
  <p>Column 1:
    <matrix copySource="m1.columns[1]" name="m1c1" />
    <matrix copySource="m2.columns[1]" name="m2c1" />
    <matrix copySource="m3.columns[1]" name="m3c1" />
  </p>
  <p>Column 1 b:
    <matrix copySource="m1.column1" name="m1c1b" />
    <matrix copySource="m2.column1" name="m2c1b" />
    <matrix copySource="m3.column1" name="m3c1b" />
  </p>
  <p>Column 2:
    <matrix copySource="m1.columns[2]" name="m1c2" />
    <matrix copySource="m2.columns[2]" name="m2c2" />
    <matrix copySource="m3.columns[2]" name="m3c2" />
  </p>
  <p>Column 2 b:
    <matrix copySource="m1.column2" name="m1c2b" />
    <matrix copySource="m2.column2" name="m2c2b" />
    <matrix copySource="m3.column2" name="m3c2b" />
  </p>
  <p>Column 3:
    <matrix copySource="m1.columns[3]" name="m1c3" />
    <matrix copySource="m2.columns[3]" name="m2c3" />
    <matrix copySource="m3.columns[3]" name="m3c3" />
  </p>
  <p>Column 3 b:
    <matrix copySource="m1.column3" name="m1c3b" />
    <matrix copySource="m2.column3" name="m2c3b" />
    <matrix copySource="m3.column3" name="m3c3b" />
  </p>

  <p>Matrix entry 12:
    <math copySource="m1.matrix[1][2]" name="m1me12" />
    <math copySource="m2.matrix[1][2]" name="m2me12" />
    <math copySource="m3.matrix[1][2]" name="m3me12" />
  </p>
  <p>Matrix entry 12 b:
    <math copySource="m1.rows[1][2]" name="m1me12b" />
    <math copySource="m2.rows[1][2]" name="m2me12b" />
    <math copySource="m3.rows[1][2]" name="m3me12b" />
  </p>
  <p>Matrix entry 12 c:
    <math copySource="m1.columns[2][1]" name="m1me12c" />
    <math copySource="m2.columns[2][1]" name="m2me12c" />
    <math copySource="m3.columns[2][1]" name="m3me12c" />
  </p>
  <p>Matrix entry 12 d:
    <math copySource="m1.row1[2]" name="m1me12d" />
    <math copySource="m2.row1[2]" name="m2me12d" />
    <math copySource="m3.row1[2]" name="m3me12d" />
  </p>
  <p>Matrix entry 12 e:
    <math copySource="m1.column2[1]" name="m1me12e" />
    <math copySource="m2.column2[1]" name="m2me12e" />
    <math copySource="m3.column2[1]" name="m3me12e" />
  </p>
  <p>Matrix entry 12 f:
    <math copySource="m1.matrixEntry1_2" name="m1me12f" />
    <math copySource="m2.matrixEntry1_2" name="m2me12f" />
    <math copySource="m3.matrixEntry1_2" name="m3me12f" />
  </p>
  <p>Matrix entry 31:
    <math copySource="m1.matrix[3][1]" name="m1me31" />
    <math copySource="m2.matrix[3][1]" name="m2me31" />
    <math copySource="m3.matrix[3][1]" name="m3me31" />
  </p>
  <p>Matrix entry 31 b:
    <math copySource="m1.rows[3][1]" name="m1me31b" />
    <math copySource="m2.rows[3][1]" name="m2me31b" />
    <math copySource="m3.rows[3][1]" name="m3me31b" />
  </p>
  <p>Matrix entry 31 c:
    <math copySource="m1.columns[1][3]" name="m1me31c" />
    <math copySource="m2.columns[1][3]" name="m2me31c" />
    <math copySource="m3.columns[1][3]" name="m3me31c" />
  </p>
  <p>Matrix entry 31 d:
    <math copySource="m1.row3[1]" name="m1me31d" />
    <math copySource="m2.row3[1]" name="m2me31d" />
    <math copySource="m3.row3[1]" name="m3me31d" />
  </p>
  <p>Matrix entry 31 e:
    <math copySource="m1.column1[3]" name="m1me31e" />
    <math copySource="m2.column1[3]" name="m2me31e" />
    <math copySource="m3.column1[3]" name="m3me31e" />
  </p>
  <p>Matrix entry 31 f:
    <math copySource="m1.matrixEntry3_1" name="m1me31f" />
    <math copySource="m2.matrixEntry3_1" name="m2me31f" />
    <math copySource="m3.matrixEntry3_1" name="m3me31f" />
  </p>
  <p>Matrix entry 23:
    <math copySource="m1.matrix[2][3]" name="m1me23" />
    <math copySource="m2.matrix[2][3]" name="m2me23" />
    <math copySource="m3.matrix[2][3]" name="m3me23" />
  </p>
  <p>Matrix entry 23 b:
    <math copySource="m1.rows[2][3]" name="m1me23b" />
    <math copySource="m2.rows[2][3]" name="m2me23b" />
    <math copySource="m3.rows[2][3]" name="m3me23b" />
  </p>
  <p>Matrix entry 23 c:
    <math copySource="m1.columns[3][2]" name="m1me23c" />
    <math copySource="m2.columns[3][2]" name="m2me23c" />
    <math copySource="m3.columns[3][2]" name="m3me23c" />
  </p>
  <p>Matrix entry 23 d:
    <math copySource="m1.row2[3]" name="m1me23d" />
    <math copySource="m2.row2[3]" name="m2me23d" />
    <math copySource="m3.row2[3]" name="m3me23d" />
  </p>
  <p>Matrix entry 23 e:
    <math copySource="m1.column3[2]" name="m1me23e" />
    <math copySource="m2.column3[2]" name="m2me23e" />
    <math copySource="m3.column3[2]" name="m3me23e" />
  </p>
  <p>Matrix entry 23 f:
    <math copySource="m1.matrixEntry2_3" name="m1me23f" />
    <math copySource="m2.matrixEntry2_3" name="m2me23f" />
    <math copySource="m3.matrixEntry2_3" name="m3me23f" />
  </p>


  <p>Change matrices</p>
  <p><matrixInput name="mi1" showSizeControls="false" bindValueTo="$m1.matrix" /></p>
  <p><matrixInput name="mi2" showSizeControls="false" bindValueTo="$m2.matrix" /></p>
  <p><matrixInput name="mi3" showSizeControls="false" bindValueTo="$m3.matrix" /></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', "⎡⎢⎣123456⎤⎥⎦");
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', "⎡⎢⎣123456⎤⎥⎦");
    cy.get(cesc('#\\/m3') + ' .mjx-mrow').eq(0).should('have.text', "⎡⎢⎣123456⎤⎥⎦");

    cy.get(cesc("#\\/m1ms")).should('have.text', '3, 2')
    cy.get(cesc("#\\/m2ms")).should('have.text', '3, 2')
    cy.get(cesc("#\\/m3ms")).should('have.text', '3, 2')

    cy.get(cesc("#\\/m1nr")).should('have.text', '3')
    cy.get(cesc("#\\/m2nr")).should('have.text', '3')
    cy.get(cesc("#\\/m3nr")).should('have.text', '3')

    cy.get(cesc("#\\/m1nc")).should('have.text', '2')
    cy.get(cesc("#\\/m2nc")).should('have.text', '2')
    cy.get(cesc("#\\/m3nc")).should('have.text', '2')

    cy.get(cesc("#\\/m1m") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣123456⎤⎥⎦')
    cy.get(cesc("#\\/m2m") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣123456⎤⎥⎦')
    cy.get(cesc("#\\/m3m") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣123456⎤⎥⎦')

    cy.get(cesc("#\\/m1mm") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣123456⎤⎥⎦')
    cy.get(cesc("#\\/m2mm") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣123456⎤⎥⎦')
    cy.get(cesc("#\\/m3mm") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣123456⎤⎥⎦')

    cy.get(cesc("#\\/m1r1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/m2r1") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/m3r1") + " .mjx-mrow").eq(0).should('have.text', '[12]')

    cy.get(cesc("#\\/m1r1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/m2r1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/m3r1b") + " .mjx-mrow").eq(0).should('have.text', '[12]')

    cy.get(cesc("#\\/m1r1c") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/m2r1c") + " .mjx-mrow").eq(0).should('have.text', '[12]')
    cy.get(cesc("#\\/m3r1c") + " .mjx-mrow").eq(0).should('have.text', '[12]')

    cy.get(cesc("#\\/m1r2") + " .mjx-mrow").eq(0).should('have.text', '[34]')
    cy.get(cesc("#\\/m2r2") + " .mjx-mrow").eq(0).should('have.text', '[34]')
    cy.get(cesc("#\\/m3r2") + " .mjx-mrow").eq(0).should('have.text', '[34]')

    cy.get(cesc("#\\/m1r2b") + " .mjx-mrow").eq(0).should('have.text', '[34]')
    cy.get(cesc("#\\/m2r2b") + " .mjx-mrow").eq(0).should('have.text', '[34]')
    cy.get(cesc("#\\/m3r2b") + " .mjx-mrow").eq(0).should('have.text', '[34]')

    cy.get(cesc("#\\/m1r2c") + " .mjx-mrow").eq(0).should('have.text', '[34]')
    cy.get(cesc("#\\/m2r2c") + " .mjx-mrow").eq(0).should('have.text', '[34]')
    cy.get(cesc("#\\/m3r2c") + " .mjx-mrow").eq(0).should('have.text', '[34]')

    cy.get(cesc("#\\/m1r3") + " .mjx-mrow").eq(0).should('have.text', '[56]')
    cy.get(cesc("#\\/m2r3") + " .mjx-mrow").eq(0).should('have.text', '[56]')
    cy.get(cesc("#\\/m3r3") + " .mjx-mrow").eq(0).should('have.text', '[56]')

    cy.get(cesc("#\\/m1r3b") + " .mjx-mrow").eq(0).should('have.text', '[56]')
    cy.get(cesc("#\\/m2r3b") + " .mjx-mrow").eq(0).should('have.text', '[56]')
    cy.get(cesc("#\\/m3r3b") + " .mjx-mrow").eq(0).should('have.text', '[56]')

    cy.get(cesc("#\\/m1r3c") + " .mjx-mrow").eq(0).should('have.text', '[56]')
    cy.get(cesc("#\\/m2r3c") + " .mjx-mrow").eq(0).should('have.text', '[56]')
    cy.get(cesc("#\\/m3r3c") + " .mjx-mrow").eq(0).should('have.text', '[56]')

    cy.get(cesc("#\\/m1r4") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/m2r4") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/m3r4") + " .mjx-mrow").eq(0).should('have.text', '[]')

    cy.get(cesc("#\\/m1r4b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/m2r4b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/m3r4b") + " .mjx-mrow").eq(0).should('have.text', '[]')

    cy.get(cesc("#\\/m1r4c") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/m2r4c") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/m3r4c") + " .mjx-mrow").eq(0).should('have.text', '[]')

    cy.get(cesc("#\\/m1c1") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣135⎤⎥⎦')
    cy.get(cesc("#\\/m2c1") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣135⎤⎥⎦')
    cy.get(cesc("#\\/m3c1") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣135⎤⎥⎦')

    cy.get(cesc("#\\/m1c1b") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣135⎤⎥⎦')
    cy.get(cesc("#\\/m2c1b") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣135⎤⎥⎦')
    cy.get(cesc("#\\/m3c1b") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣135⎤⎥⎦')

    cy.get(cesc("#\\/m1c2") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣246⎤⎥⎦')
    cy.get(cesc("#\\/m2c2") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣246⎤⎥⎦')
    cy.get(cesc("#\\/m3c2") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣246⎤⎥⎦')

    cy.get(cesc("#\\/m1c2b") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣246⎤⎥⎦')
    cy.get(cesc("#\\/m2c2b") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣246⎤⎥⎦')
    cy.get(cesc("#\\/m3c2b") + " .mjx-mrow").eq(0).should('have.text', '⎡⎢⎣246⎤⎥⎦')

    cy.get(cesc("#\\/m1c3") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/m2c3") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/m3c3") + " .mjx-mrow").eq(0).should('have.text', '[]')

    cy.get(cesc("#\\/m1c3b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/m2c3b") + " .mjx-mrow").eq(0).should('have.text', '[]')
    cy.get(cesc("#\\/m3c3b") + " .mjx-mrow").eq(0).should('have.text', '[]')

    cy.get(cesc("#\\/m1me12") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m2me12") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m3me12") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/m1me12b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m2me12b") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m3me12b") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/m1me12c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m2me12c") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m3me12c") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/m1me12d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m2me12d") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m3me12d") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/m1me12e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m2me12e") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m3me12e") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/m1me12f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m2me12f") + " .mjx-mrow").eq(0).should('have.text', '2')
    cy.get(cesc("#\\/m3me12f") + " .mjx-mrow").eq(0).should('have.text', '2')

    cy.get(cesc("#\\/m1me31") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m2me31") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m3me31") + " .mjx-mrow").eq(0).should('have.text', '5')

    cy.get(cesc("#\\/m1me31b") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m2me31b") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m3me31b") + " .mjx-mrow").eq(0).should('have.text', '5')

    cy.get(cesc("#\\/m1me31c") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m2me31c") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m3me31c") + " .mjx-mrow").eq(0).should('have.text', '5')

    cy.get(cesc("#\\/m1me31d") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m2me31d") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m3me31d") + " .mjx-mrow").eq(0).should('have.text', '5')

    cy.get(cesc("#\\/m1me31e") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m2me31e") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m3me31e") + " .mjx-mrow").eq(0).should('have.text', '5')

    cy.get(cesc("#\\/m1me31f") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m2me31f") + " .mjx-mrow").eq(0).should('have.text', '5')
    cy.get(cesc("#\\/m3me31f") + " .mjx-mrow").eq(0).should('have.text', '5')


    cy.get(cesc("#\\/m1me23") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m2me23") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m3me23") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get(cesc("#\\/m1me23b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m2me23b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m3me23b") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get(cesc("#\\/m1me23c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m2me23c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m3me23c") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get(cesc("#\\/m1me23d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m2me23d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m3me23d") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get(cesc("#\\/m1me23e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m2me23e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m3me23e") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')

    cy.get(cesc("#\\/m1me23f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m2me23f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')
    cy.get(cesc("#\\/m3me23f") + " .mjx-mrow").eq(0).should('have.text', '\uff3f')



    cy.log('change from matrix inputs')

    cy.get(cesc('#\\/mi1_component_0_0') + ' textarea').type("{end}{backspace}a{enter}", { force: true })
    cy.get(cesc('#\\/mi1_component_0_1') + ' textarea').type("{end}{backspace}b{enter}", { force: true })
    cy.get(cesc('#\\/mi1_component_1_0') + ' textarea').type("{end}{backspace}c{enter}", { force: true })
    cy.get(cesc('#\\/mi1_component_1_1') + ' textarea').type("{end}{backspace}d{enter}", { force: true })
    cy.get(cesc('#\\/mi1_component_2_0') + ' textarea').type("{end}{backspace}e{enter}", { force: true })
    cy.get(cesc('#\\/mi1_component_2_1') + ' textarea').type("{end}{backspace}f{enter}", { force: true })

    cy.get(cesc('#\\/mi2_component_0_0') + ' textarea').type("{end}{backspace}g{enter}", { force: true })
    cy.get(cesc('#\\/mi2_component_0_1') + ' textarea').type("{end}{backspace}h{enter}", { force: true })
    cy.get(cesc('#\\/mi2_component_1_0') + ' textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get(cesc('#\\/mi2_component_1_1') + ' textarea').type("{end}{backspace}j{enter}", { force: true })
    cy.get(cesc('#\\/mi2_component_2_0') + ' textarea').type("{end}{backspace}k{enter}", { force: true })
    cy.get(cesc('#\\/mi2_component_2_1') + ' textarea').type("{end}{backspace}l{enter}", { force: true })

    cy.get(cesc('#\\/mi3_component_0_0') + ' textarea').type("{end}{backspace}m{enter}", { force: true })
    cy.get(cesc('#\\/mi3_component_0_1') + ' textarea').type("{end}{backspace}n{enter}", { force: true })
    cy.get(cesc('#\\/mi3_component_1_0') + ' textarea').type("{end}{backspace}o{enter}", { force: true })
    cy.get(cesc('#\\/mi3_component_1_1') + ' textarea').type("{end}{backspace}p{enter}", { force: true })
    cy.get(cesc('#\\/mi3_component_2_0') + ' textarea').type("{end}{backspace}q{enter}", { force: true })
    cy.get(cesc('#\\/mi3_component_2_1') + ' textarea').type("{end}{backspace}r{enter}", { force: true })

    cy.get(cesc('#\\/m3') + ' .mjx-mrow').should('contain.text', "⎡⎢⎣mnopqr⎤⎥⎦");

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', "⎡⎢⎣abcdef⎤⎥⎦");
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', "⎡⎢⎣ghijkl⎤⎥⎦");
    cy.get(cesc('#\\/m3') + ' .mjx-mrow').eq(0).should('have.text', "⎡⎢⎣mnopqr⎤⎥⎦");
  });

  it('simplify complex numbers', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <math simplify name="e1">i^2</math>
  <math simplify name="e2">i^3</math>
  <math simplify name="e3">i^4</math>
  <math simplify name="e4">(1+i)(1-i)</math>
  <math simplify name="e5">aibici</math>
  <math simplify expand name="e6">(a+bi)(c+di)</math>
  <math simplify expand name="e7">(a+bi)(a-bi)</math>
  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/e1') + ' .mjx-mrow').eq(0).should('have.text', '−1');
    cy.get(cesc('#\\/e2') + ' .mjx-mrow').eq(0).should('have.text', '−i');
    cy.get(cesc('#\\/e3') + ' .mjx-mrow').eq(0).should('have.text', '1');
    cy.get(cesc('#\\/e4') + ' .mjx-mrow').eq(0).should('have.text', '2');
    cy.get(cesc('#\\/e5') + ' .mjx-mrow').eq(0).should('have.text', '−abci');
    cy.get(cesc('#\\/e6') + ' .mjx-mrow').eq(0).should('have.text', 'ac+adi+bci−bd');
    cy.get(cesc('#\\/e7') + ' .mjx-mrow').eq(0).should('have.text', 'a2+b2');

  });

  it('parse scientific notation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math simplify name="m1"><math>2E+3</math>+3E+2</math>
  <math simplify name="m2" parseScientificNotation><math>2E+3</math>+3E+2</math>
  <math simplify name="m3"><math parseScientificNotation>2E+3</math>+3E+2</math>
  <math simplify name="m4" parseScientificNotation><math parseScientificNotation="false">2E+3</math>+3E+2</math></p>


  <p><math format="latex" simplify name="m1a"><math format="latex">2E+3</math>+3E+2</math>
  <math format="latex" simplify name="m2a" parseScientificNotation><math format="latex">2E+3</math>+3E+2</math>
  <math format="latex" simplify name="m3a"><math format="latex" parseScientificNotation>2E+3</math>+3E+2</math>
  <math format="latex" simplify name="m4a" parseScientificNotation><math format="latex" parseScientificNotation="false">2E+3</math>+3E+2</math></p>

  <p><math simplify name="m5"><math>2E3</math>+3E2</math>
  <math simplify name="m6" parseScientificNotation><math>2E3</math>+3E2</math>
  <math simplify name="m7"><math parseScientificNotation>2E3</math>+3E2</math>
  <math simplify name="m8" parseScientificNotation><math parseScientificNotation="false">2E3</math>+3E2</math>
  </p>

  <p><math format="latex" simplify name="m5a"><math format="latex">2E3</math>+3E2</math>
  <math format="latex" simplify name="m6a" parseScientificNotation><math format="latex">2E3</math>+3E2</math>
  <math format="latex" simplify name="m7a"><math format="latex" parseScientificNotation>2E3</math>+3E2</math>
  <math format="latex" simplify name="m8a" parseScientificNotation><math format="latex" parseScientificNotation="false">2E3</math>+3E2</math>
  </p>

  <p><booleanInput name="p1"><label>parse 1</label></booleanInput>
  <booleanInput name="p2"><label>parse 2</label></booleanInput>
  </p>
  <p><math simplify name="m9" parseScientificNotation="$p1"><math parseScientificNotation="$p2">2E+3</math>+3E+2</math></p>
  <p><math format="latex" simplify name="m9a" parseScientificNotation="$p1"><math format="latex" parseScientificNotation="$p2">2E+3</math>+3E+2</math></p>
  <p><math simplify name="m10" parseScientificNotation="$p1"><math parseScientificNotation="$p2">2E3</math>+3E2</math></p>
  <p><math format="latex" simplify name="m10a" parseScientificNotation="$p1"><math format="latex" parseScientificNotation="$p2">2E3</math>+3E2</math></p>


  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/m1') + ' .mjx-mrow').eq(0).should('have.text', '5E+5');
    cy.get(cesc('#\\/m2') + ' .mjx-mrow').eq(0).should('have.text', '2300');
    cy.get(cesc('#\\/m3') + ' .mjx-mrow').eq(0).should('have.text', '3E+2002');
    cy.get(cesc('#\\/m4') + ' .mjx-mrow').eq(0).should('have.text', '2E+303');
    cy.get(cesc('#\\/m1a') + ' .mjx-mrow').eq(0).should('have.text', '5E+5');
    cy.get(cesc('#\\/m2a') + ' .mjx-mrow').eq(0).should('have.text', '2300');
    cy.get(cesc('#\\/m3a') + ' .mjx-mrow').eq(0).should('have.text', '3E+2002');
    cy.get(cesc('#\\/m4a') + ' .mjx-mrow').eq(0).should('have.text', '2E+303');

    cy.get(cesc('#\\/m5') + ' .mjx-mrow').eq(0).should('have.text', '3E2+2E3');
    cy.get(cesc('#\\/m6') + ' .mjx-mrow').eq(0).should('have.text', '2300');
    cy.get(cesc('#\\/m7') + ' .mjx-mrow').eq(0).should('have.text', '3E2+2000');
    cy.get(cesc('#\\/m8') + ' .mjx-mrow').eq(0).should('have.text', '2E3+300');
    cy.get(cesc('#\\/m5a') + ' .mjx-mrow').eq(0).should('have.text', '3E2+2E3');
    cy.get(cesc('#\\/m6a') + ' .mjx-mrow').eq(0).should('have.text', '2300');
    cy.get(cesc('#\\/m7a') + ' .mjx-mrow').eq(0).should('have.text', '3E2+2000');
    cy.get(cesc('#\\/m8a') + ' .mjx-mrow').eq(0).should('have.text', '2E3+300');

    cy.get(cesc('#\\/m9') + ' .mjx-mrow').eq(0).should('have.text', '5E+5');
    cy.get(cesc('#\\/m9a') + ' .mjx-mrow').eq(0).should('have.text', '5E+5');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').eq(0).should('have.text', '3E2+2E3');
    cy.get(cesc('#\\/m10a') + ' .mjx-mrow').eq(0).should('have.text', '3E2+2E3');

    cy.get(cesc('#\\/p1')).click();
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').should('contain.text', '2E+303');
    cy.get(cesc('#\\/m9a') + ' .mjx-mrow').should('contain.text', '2E+303');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').should('contain.text', '2E3+300');
    cy.get(cesc('#\\/m10a') + ' .mjx-mrow').should('contain.text', '2E3+300');
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').eq(0).should('have.text', '2E+303');
    cy.get(cesc('#\\/m9a') + ' .mjx-mrow').eq(0).should('have.text', '2E+303');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').eq(0).should('have.text', '2E3+300');
    cy.get(cesc('#\\/m10a') + ' .mjx-mrow').eq(0).should('have.text', '2E3+300');

    cy.get(cesc('#\\/p2')).click();
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').should('contain.text', '2300');
    cy.get(cesc('#\\/m9a') + ' .mjx-mrow').should('contain.text', '2300');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').should('contain.text', '2300');
    cy.get(cesc('#\\/m10a') + ' .mjx-mrow').should('contain.text', '2300');
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').eq(0).should('have.text', '2300');
    cy.get(cesc('#\\/m9a') + ' .mjx-mrow').eq(0).should('have.text', '2300');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').eq(0).should('have.text', '2300');
    cy.get(cesc('#\\/m10a') + ' .mjx-mrow').eq(0).should('have.text', '2300');

    cy.get(cesc('#\\/p1')).click();
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').should('contain.text', '3E+2002');
    cy.get(cesc('#\\/m9a') + ' .mjx-mrow').should('contain.text', '3E+2002');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').should('contain.text', '3E2+2000');
    cy.get(cesc('#\\/m10a') + ' .mjx-mrow').should('contain.text', '3E2+2000');
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').eq(0).should('have.text', '3E+2002');
    cy.get(cesc('#\\/m9a') + ' .mjx-mrow').eq(0).should('have.text', '3E+2002');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').eq(0).should('have.text', '3E2+2000');
    cy.get(cesc('#\\/m10a') + ' .mjx-mrow').eq(0).should('have.text', '3E2+2000');

    cy.get(cesc('#\\/p2')).click();
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').should('contain.text', '5E+5');
    cy.get(cesc('#\\/m9a') + ' .mjx-mrow').should('contain.text', '5E+5');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').should('contain.text', '3E2+2E3');
    cy.get(cesc('#\\/m10a') + ' .mjx-mrow').should('contain.text', '3E2+2E3');
    cy.get(cesc('#\\/m9') + ' .mjx-mrow').eq(0).should('have.text', '5E+5');
    cy.get(cesc('#\\/m9a') + ' .mjx-mrow').eq(0).should('have.text', '5E+5');
    cy.get(cesc('#\\/m10') + ' .mjx-mrow').eq(0).should('have.text', '3E2+2E3');
    cy.get(cesc('#\\/m10a') + ' .mjx-mrow').eq(0).should('have.text', '3E2+2E3');

  });

  it('subscripts and superscripts numbers to unicode text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><math name="m1">2x_1y_23+z_456-a_(7+8-90)</math></p>
  <p><math name="m2">2x^1y^23+z^456-a^(7+8-90)</math></p>
  <p><math name="m3">a^2 - b_2</math></p>
  <p name="m1t">$m1.text</p>
  <p name="m2t">$m2.text</p>
  <p name="m3t">$m3.text</p>
  <p><text name="t1">a₂-b²</text></p>
  
  <p><updateValue name="uv" type="text" target="m3.text" newValue="$t1.text" ><label>Update via text</label></updateValue></p>

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded
    cy.get(cesc('#\\/m1t')).should('have.text', '2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀')
    cy.get(cesc('#\\/m2t')).should('have.text', '2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰')
    cy.get(cesc('#\\/m3t')).should('have.text', 'a² - b₂')

    cy.get(cesc('#\\/uv')).click();
    cy.get(cesc('#\\/m3t')).should('have.text', 'a₂ - b²')


  });

  it('math in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph >
      <math anchor="$anchorCoords1" name="math1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1">$content1</math>
      <math name="math2">e^(-x^2)</math>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $math1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $math2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$math2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $math1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $math2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$math2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$math2.draggable" /></p>
    <p name="pContent1">Content 1: $math1</p>
    <p name="pContent2">Content 2: $math2</p>
    <p>Content 1 <mathinput name="content1" prefill="x^2/3" /></p>
    <p>Content 2 <mathinput name="content2" bindValueTo="$math2" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(1,3)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')

    cy.get(cesc("#\\/pPositionFromAnchor1")).should('have.text', 'Position from anchor 1: upperright')
    cy.get(cesc("#\\/pPositionFromAnchor2")).should('have.text', 'Position from anchor 2: center')
    cy.get(cesc("#\\/positionFromAnchor1")).should('have.value', '1')
    cy.get(cesc("#\\/positionFromAnchor2")).should('have.value', '9')
    cy.get(cesc("#\\/pDraggable1")).should('have.text', 'Draggable 1: true')
    cy.get(cesc("#\\/pDraggable2")).should('have.text', 'Draggable 2: true')
    cy.get(cesc("#\\/pContent1") + " .mjx-mrow").eq(0).should('have.text', 'x23')
    cy.get(cesc("#\\/pContent2") + " .mjx-mrow").eq(0).should('have.text', 'e−x2')


    cy.log("move maths by dragging")

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math1",
        args: { x: -2, y: 3 }
      })
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math2",
        args: { x: 4, y: -5 }
      })
    })

    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').should('contain.text', '(4,−5)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(−2,3)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(4,−5)')


    cy.log("move maths by entering coordinates")

    cy.get(cesc('#\\/anchorCoords1') + ' textarea').type("{home}{shift+end}{backspace}(6,7){enter}", { force: true })
    cy.get(cesc('#\\/anchorCoords2') + ' textarea').type("{home}{shift+end}{backspace}(8,9){enter}", { force: true })

    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').should('contain.text', '(8,9)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(8,9)')


    cy.log('change position from anchor');
    cy.get(cesc('#\\/positionFromAnchor1')).select("lowerLeft")
    cy.get(cesc('#\\/positionFromAnchor2')).select("lowerRight")

    cy.get(cesc("#\\/pPositionFromAnchor1")).should('have.text', 'Position from anchor 1: lowerleft')
    cy.get(cesc("#\\/pPositionFromAnchor2")).should('have.text', 'Position from anchor 2: lowerright')


    cy.log('make not draggable')

    cy.get(cesc('#\\/draggable1')).click();
    cy.get(cesc('#\\/draggable2')).click();
    cy.get(cesc("#\\/pDraggable1")).should('have.text', 'Draggable 1: false')
    cy.get(cesc("#\\/pDraggable2")).should('have.text', 'Draggable 2: false')


    cy.log('cannot move maths by dragging')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math1",
        args: { x: -10, y: -9 }
      })
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math2",
        args: { x: -8, y: -7 }
      })
    })

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should('have.text', 'true');

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(8,9)')


    cy.log("change content of math")
    cy.get(cesc('#\\/content1') + ' textarea').type("{end}+5{enter}", { force: true })
    cy.get(cesc('#\\/content2') + ' textarea').type("{end}-a{enter}", { force: true })

    cy.get(cesc("#\\/pContent2") + " .mjx-mrow").should('contain.text', 'e−x2−a')

    cy.get(cesc("#\\/pContent1") + " .mjx-mrow").eq(0).should('have.text', 'x23+5')
    cy.get(cesc("#\\/pContent2") + " .mjx-mrow").eq(0).should('have.text', 'e−x2−a')

  })

  it('math in graph, handle bad anchor coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph >
      <math anchor="$anchorCoords1" name="math1">x^2</math>
    </graph>
    

    <p name="pAnchor1">Anchor 1 coordinates: $math1.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="x" /></p>
    

    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', 'x')


    cy.log("give good anchor coords")

    cy.get(cesc('#\\/anchorCoords1') + ' textarea').type("{home}{shift+end}{backspace}(6,7){enter}", { force: true })

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').should('contain.text', '(6,7)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')

    cy.log("give bad anchor coords again")

    cy.get(cesc('#\\/anchorCoords1') + ' textarea').type("{home}{shift+end}{backspace}q{enter}", { force: true })

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').should('contain.text', 'q')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', 'q')


  });

  it('color math via style', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
      </styleDefinitions>
    </setup>

    <p>Style number: <mathinput prefill="1" name="sn" /></p>

    <p><math name="no_style">x^2</math> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><math name="fixed_style" stylenumber="2">x^3</math> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><math name="variable_style" stylenumber="$sn">x^4</math> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    ` }, "*");
    });

    cy.get(cesc('#\\/tsd_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/tc_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/bc_no_style')).should('have.text', 'none');

    cy.get(cesc('#\\/tsd_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/tc_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/bc_fixed_style')).should('have.text', 'none');

    cy.get(cesc('#\\/tsd_variable_style')).should('have.text', 'black');
    cy.get(cesc('#\\/tc_variable_style')).should('have.text', 'black');
    cy.get(cesc('#\\/bc_variable_style')).should('have.text', 'none');


    cy.get(cesc('#\\/no_style')).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.get(cesc('#\\/no_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/fixed_style')).should('have.css', 'color', 'rgb(0, 128, 0)');
    cy.get(cesc('#\\/fixed_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/variable_style')).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.get(cesc('#\\/variable_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    // TODO: how to test color in graph


    cy.get(cesc('#\\/sn') + ' textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(cesc('#\\/tsd_variable_style')).should('have.text', 'green');
    cy.get(cesc('#\\/tc_variable_style')).should('have.text', 'green');
    cy.get(cesc('#\\/bc_variable_style')).should('have.text', 'none');

    cy.get(cesc('#\\/tsd_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/tc_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/bc_no_style')).should('have.text', 'none');

    cy.get(cesc('#\\/tsd_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/tc_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/bc_fixed_style')).should('have.text', 'none');

    cy.get(cesc('#\\/no_style')).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.get(cesc('#\\/no_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/fixed_style')).should('have.css', 'color', 'rgb(0, 128, 0)');
    cy.get(cesc('#\\/fixed_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/variable_style')).should('have.css', 'color', 'rgb(0, 128, 0)');
    cy.get(cesc('#\\/variable_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');



    cy.get(cesc('#\\/sn') + ' textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(cesc('#\\/tsd_variable_style')).should('have.text', 'red with a blue background');
    cy.get(cesc('#\\/tc_variable_style')).should('have.text', 'red');
    cy.get(cesc('#\\/bc_variable_style')).should('have.text', 'blue');

    cy.get(cesc('#\\/tsd_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/tc_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/bc_no_style')).should('have.text', 'none');

    cy.get(cesc('#\\/tsd_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/tc_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/bc_fixed_style')).should('have.text', 'none');

    cy.get(cesc('#\\/no_style')).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.get(cesc('#\\/no_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/fixed_style')).should('have.css', 'color', 'rgb(0, 128, 0)');
    cy.get(cesc('#\\/fixed_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/variable_style')).should('have.css', 'color', 'rgb(255, 0, 0)');
    cy.get(cesc('#\\/variable_style')).should('have.css', 'background-color', 'rgb(0, 0, 255)');



  })

  it('math copied by plain macro, but not value, reflects style and anchor position', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" />
      </styleDefinitions>
    </setup>

    <text>a</text>

    <graph name="g1">
      <math styleNumber="2" name="m1">x^2</math>
      <math styleNumber="3" anchor="(3,4)" name="m2" >x^3</math>
    </graph>

    <coords copySource="m1.anchor" name="m1coords" />
    <coords copySource="m2.anchor" name="m2coords" />

    <graph name="g2">
      $m1
      $m2
    </graph>

    <collect componentTypes="math" source="g2" prop="anchor" assignNames="m1acoords m2acoords" />

    <graph name="g3">
      $m1.value
      $m2.value
    </graph>

    <collect componentTypes="math" source="g3" prop="anchor" assignNames="m1bcoords m2bcoords" />

    <p name="p1">$m1 $m2</p>

    <p name="p2">$m1.value $m2.value</p>

    ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let m1aName = stateVariables["/g2"].activeChildren[0].componentName;
      let m2aName = stateVariables["/g2"].activeChildren[1].componentName;
      let m1bName = stateVariables["/g3"].activeChildren[0].componentName;
      let m2bName = stateVariables["/g3"].activeChildren[1].componentName;
      let m1cName = stateVariables["/p1"].activeChildren[0].componentName;
      let m2cName = stateVariables["/p1"].activeChildren[2].componentName;
      let m1dName = stateVariables["/p2"].activeChildren[0].componentName;
      let m2dName = stateVariables["/p2"].activeChildren[2].componentName;

      let m1cAnchor = '#' + cesc2(m1cName) + " .mjx-mrow";
      let m2cAnchor = '#' + cesc2(m2cName) + " .mjx-mrow";
      let m1dAnchor = '#' + cesc2(m1dName) + " .mjx-mrow";
      let m2dAnchor = '#' + cesc2(m2dName) + " .mjx-mrow";

      cy.get(m1cAnchor).eq(0).should('have.text', 'x2')
      cy.get(m1dAnchor).eq(0).should('have.text', 'x2')
      cy.get(m2cAnchor).eq(0).should('have.text', 'x3')
      cy.get(m2dAnchor).eq(0).should('have.text', 'x3')

      cy.get(m1cAnchor).should('have.css', 'color', 'rgb(0, 128, 0)');
      cy.get(m1dAnchor).should('have.css', 'color', 'rgb(0, 0, 0)');
      cy.get(m2cAnchor).should('have.css', 'color', 'rgb(255, 0, 0)');
      cy.get(m2dAnchor).should('have.css', 'color', 'rgb(0, 0, 0)');

      cy.get(cesc('#\\/m1coords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')
      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').eq(0).should('have.text', '(3,4)')
      cy.get(cesc('#\\/m1acoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')
      cy.get(cesc('#\\/m2acoords') + ' .mjx-mrow').eq(0).should('have.text', '(3,4)')
      cy.get(cesc('#\\/m1bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')
      cy.get(cesc('#\\/m2bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')



      cy.log("move first maths")
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "moveMath",
          componentName: "/m1",
          args: { x: -2, y: 3 }
        })
        win.callAction1({
          actionName: "moveMath",
          componentName: "/m2",
          args: { x: 4, y: -5 }
        })
      })

      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').should('contain.text', '(4,−5)')

      cy.get(cesc('#\\/m1coords') + ' .mjx-mrow').eq(0).should('have.text', '(−2,3)')
      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').eq(0).should('have.text', '(4,−5)')
      cy.get(cesc('#\\/m1acoords') + ' .mjx-mrow').eq(0).should('have.text', '(−2,3)')
      cy.get(cesc('#\\/m2acoords') + ' .mjx-mrow').eq(0).should('have.text', '(4,−5)')
      cy.get(cesc('#\\/m1bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')
      cy.get(cesc('#\\/m2bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')


      cy.log("move second maths")
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "moveMath",
          componentName: m1aName,
          args: { x: 7, y: 1 }
        })
        win.callAction1({
          actionName: "moveMath",
          componentName: m2aName,
          args: { x: -8, y: 2 }
        })
      })

      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').should('contain.text', '(−8,2)')

      cy.get(cesc('#\\/m1coords') + ' .mjx-mrow').eq(0).should('have.text', '(7,1)')
      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').eq(0).should('have.text', '(−8,2)')
      cy.get(cesc('#\\/m1acoords') + ' .mjx-mrow').eq(0).should('have.text', '(7,1)')
      cy.get(cesc('#\\/m2acoords') + ' .mjx-mrow').eq(0).should('have.text', '(−8,2)')
      cy.get(cesc('#\\/m1bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')
      cy.get(cesc('#\\/m2bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')


      cy.log("move third maths")
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "moveMath",
          componentName: m1bName,
          args: { x: -6, y: 3 }
        })
        win.callAction1({
          actionName: "moveMath",
          componentName: m2bName,
          args: { x: -5, y: -4 }
        })
      })

      cy.get(cesc('#\\/m2bcoords') + ' .mjx-mrow').should('contain.text', '(−5,−4)')

      cy.get(cesc('#\\/m1coords') + ' .mjx-mrow').eq(0).should('have.text', '(7,1)')
      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').eq(0).should('have.text', '(−8,2)')
      cy.get(cesc('#\\/m1acoords') + ' .mjx-mrow').eq(0).should('have.text', '(7,1)')
      cy.get(cesc('#\\/m2acoords') + ' .mjx-mrow').eq(0).should('have.text', '(−8,2)')
      cy.get(cesc('#\\/m1bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(−6,3)')
      cy.get(cesc('#\\/m2bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(−5,−4)')



    })
  })

  it('vec', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math format="latex">\\vec{a}</math>
    <math>vec a</math>
    ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").eq(0).should('have.text', '→a')
    cy.get(cesc("#\\/_math2") + " .mjx-mrow").eq(0).should('have.text', '→a')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(["vec", "a"]);
      expect(stateVariables['/_math2'].stateValues.value).eqls(["vec", "a"]);
    });

  })

  it('line segment', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math format="latex">\\overline{AB}</math>
    <math>linesegment(A,B)</math>
    ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").eq(0).should('have.text', '¯¯¯¯¯¯¯¯AB')
    cy.get(cesc("#\\/_math2") + " .mjx-mrow").eq(0).should('have.text', '¯¯¯¯¯¯¯¯AB')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(["linesegment", "A", "B"]);
      expect(stateVariables['/_math2'].stateValues.value).eqls(["linesegment", "A", "B"]);
    });

  })

  it('perp', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math format="latex">v \\perp u</math>
    <math>v perp u</math>
    <math format="latex">v^\\perp</math>
    <math>v^perp</math>
    ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").eq(0).should('have.text', 'v⊥u')
    cy.get(cesc("#\\/_math2") + " .mjx-mrow").eq(0).should('have.text', 'v⊥u')
    cy.get(cesc("#\\/_math3") + " .mjx-mrow").eq(0).should('have.text', 'v⊥')
    cy.get(cesc("#\\/_math4") + " .mjx-mrow").eq(0).should('have.text', 'v⊥')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(["perp", "v", "u"]);
      expect(stateVariables['/_math2'].stateValues.value).eqls(["perp", "v", "u"]);
      expect(stateVariables['/_math3'].stateValues.value).eqls(["^", "v", "perp"]);
      expect(stateVariables['/_math4'].stateValues.value).eqls(["^", "v", "perp"]);
    });


  })

  it('parallel', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math format="latex">v \\parallel u</math>
    <math>v parallel u</math>
    ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc("#\\/_math1") + " .mjx-mrow").eq(0).should('have.text', 'v∥u')
    cy.get(cesc("#\\/_math2") + " .mjx-mrow").eq(0).should('have.text', 'v∥u')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(["parallel", "v", "u"]);
      expect(stateVariables['/_math2'].stateValues.value).eqls(["parallel", "v", "u"]);
    });


  })

  it('basic units', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>
    <math name="dol5">$5</math>
    <math name="perc25">25%</math>
    <math name="deg60">60 deg</math>
    <math name="dol5b" format="latex">\\$5</math>
    <math name="perc25b" format="latex">25\\%</math>
    <math name="deg60b" format="latex">60^{\\circ}</math>
    <math name="dol5c" format="latex">$5</math>
    <math name="perc25c" format="latex">25%</math>
    <math name="sin90deg">sin(90 deg)</math>
  </p>
  <p>
    <number name="ndol5">$5</number>
    <number name="nperc25">25%</number>
    <number name="ndeg60">60 deg</number>
    <number name="nsin90deg">sin(90 deg)</number>
  </p>
  ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc("#\\/dol5") + " .mjx-mrow").eq(0).should('have.text', '$5')
    cy.get(cesc("#\\/perc25") + " .mjx-mrow").eq(0).should('have.text', '25%')
    cy.get(cesc("#\\/deg60") + " .mjx-mrow").eq(0).should('have.text', '60∘')
    cy.get(cesc("#\\/dol5b") + " .mjx-mrow").eq(0).should('have.text', '$5')
    cy.get(cesc("#\\/perc25b") + " .mjx-mrow").eq(0).should('have.text', '25%')
    cy.get(cesc("#\\/deg60b") + " .mjx-mrow").eq(0).should('have.text', '60∘')
    cy.get(cesc("#\\/dol5c") + " .mjx-mrow").eq(0).should('have.text', '$5')
    cy.get(cesc("#\\/perc25c") + " .mjx-mrow").eq(0).should('have.text', '25%')
    cy.get(cesc("#\\/sin90deg") + " .mjx-mrow").eq(0).should('have.text', 'sin(90∘)')

    cy.get(cesc("#\\/ndol5")).should('have.text', '5')
    cy.get(cesc("#\\/nperc25")).should('have.text', '0.25')
    cy.get(cesc("#\\/ndeg60")).invoke('text').then(text => {
      expect(parseFloat(text)).closeTo(Math.PI / 3, 1E-6)
    });
    cy.get(cesc("#\\/nsin90deg")).should('have.text', '1')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/dol5'].stateValues.value).eqls(["unit", "$", 5]);
      expect(stateVariables['/perc25'].stateValues.value).eqls(["unit", 25, "%"]);
      expect(stateVariables['/deg60'].stateValues.value).eqls(["unit", 60, "deg"]);
      expect(stateVariables['/dol5b'].stateValues.value).eqls(["unit", "$", 5]);
      expect(stateVariables['/perc25b'].stateValues.value).eqls(["unit", 25, "%"]);
      expect(stateVariables['/deg60b'].stateValues.value).eqls(["unit", 60, "deg"]);
      expect(stateVariables['/dol5c'].stateValues.value).eqls(["unit", "$", 5]);
      expect(stateVariables['/perc25c'].stateValues.value).eqls(["unit", 25, "%"]);
      expect(stateVariables['/ndol5'].stateValues.value).eq(5);
      expect(stateVariables['/nperc25'].stateValues.value).eq(.25);
      expect(stateVariables['/ndeg60'].stateValues.value).closeTo(Math.PI / 3, 1E-14);
      expect(stateVariables['/nsin90deg'].stateValues.value).eq(1);
    });


  })

  it('some support for integral', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>
    <math name="indefint">int f(x) dx</math>
    <math name="defint">int_a^b f(x) dx</math>
    <math name="indefintb" format="latex">\\int f(x) dx</math>
    <math name="defintb" format="latex">\\int_a^b f(x) dx</math>
  </p>
  ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc("#\\/indefint") + " .mjx-mrow").eq(0).should('have.text', '∫f(x)dx')
    cy.get(cesc("#\\/defint") + " .mjx-mrow").eq(0).should('have.text', '∫baf(x)dx')
    cy.get(cesc("#\\/indefintb") + " .mjx-mrow").eq(0).should('have.text', '∫f(x)dx')
    cy.get(cesc("#\\/defintb") + " .mjx-mrow").eq(0).should('have.text', '∫baf(x)dx')


  })

  it('recover math values through latex state variables', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>
    <vector name="v">(3,4)</vector>
    <point name="p">(5,6)</point>
    <function name="f">sin(x)/exp(x)</function>
    <m name="m">\\frac{x}{y}</m>
    <math name="math">y/z</math>
    <line name="l">y=x+4</line>
    <aslist name="al"><math>sin(x)</math><math>cos(x)</math></aslist>
    <mathlist name="ml">tan(x) cot(y)</mathlist>
  </p>
  <p>
    <math name="v2">$v.latex</math>
    <math name="p2">$p.latex</math>
    <math name="f2">$f.latex</math>
    <math name="m2">$m.latex</math>
    <math name="math2">$math.latex</math>
    <math name="l2">$l.latex</math>
    <math name="al2">$al.latex</math>
    <math name="ml2">$ml.latex</math>
  </p>
  ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/v2'].stateValues.value).eqls(["tuple", 3, 4]);
      expect(stateVariables['/p2'].stateValues.value).eqls(["tuple", 5, 6]);
      expect(stateVariables['/f2'].stateValues.value).eqls(["/", ["apply", "sin", "x"], ["apply", "exp", "x"]]);
      expect(stateVariables['/m2'].stateValues.value).eqls(["/", "x", "y"]);
      expect(stateVariables['/math2'].stateValues.value).eqls(["/", "y", "z"]);
      expect(stateVariables['/l2'].stateValues.value).eqls(["=", "y", ["+", "x", 4]]);
      expect(stateVariables['/al2'].stateValues.value).eqls(["list", ["apply", "sin", "x"], ["apply", "cos", "x"]]);
      expect(stateVariables['/ml2'].stateValues.value).eqls(["list", ["apply", "tan", "x"], ["apply", "cot", "y"]]);

    })

  })

})

