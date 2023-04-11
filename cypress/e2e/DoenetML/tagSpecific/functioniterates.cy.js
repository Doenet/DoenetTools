import me from 'math-expressions';
import { cesc, cesc2 } from '../../../../src/_utils/url';

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`
  } else {
    return String(n);
  }
}

describe('FunctionIterates Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })


  // TODO: test forceNumeric and forceSymbolic?

  it('1D user-defined function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Choose variable for function: <mathinput name="x" prefill="x" />.
  Let <m>f($x) =</m> <mathinput name="fformula" prefill="ax" />.
  Let <m>u = </m> <mathinput name="u" prefill="3v" />.  Let <m>n=</m> <mathinput name="n" prefill="3" />
  Then</p>
  <ul>
  <map assignNames="(l1) (l2) (l3) (l4) (l5) (l6) (l7)">
    <template><li newnamespace><m>f^{$i}(u) = <copy componentIndex="$i" target="../iterates" assignNames="iter" /></m></li></template>
    <sources indexAlias="i"><sequence length="$n" /></sources>
  </map>
  </ul>

  <p hide><function name="f" variables="$x" symbolic simplify expand>$fformula</function><functioniterates function="$f" initialValue="$u" nIterates="$n" name="fis" /><copy prop="iterates" target="fis"  name="iterates" /></p>
  

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait for page to load

    cy.get(cesc('#\\/l1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=3av')
    })
    cy.get(cesc('#\\/l2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=3va2')
    })
    cy.get(cesc('#\\/l3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=3va3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value).eqls(["*", 3, "a", "v"])
      expect(stateVariables["/l2/iter"].stateValues.value).eqls(["*", 3, "v", ["^", "a", 2]])
      expect(stateVariables["/l3/iter"].stateValues.value).eqls(["*", 3, "v", ["^", "a", 3]])
    })

    cy.log('change function, nIterates, and initial')
    cy.get(cesc('#\\/fformula') + ' textarea').type("{end}{backspace}{backspace}bx^2{enter}", { force: true });
    cy.get(cesc('#\\/n') + ' textarea').type("{end}{backspace}4{enter}", { force: true });
    cy.get(cesc('#\\/u') + ' textarea').type("{end}{backspace}{backspace}w{enter}", { force: true });

    cy.get(cesc('#\\/l1')).should('contain.text', 'f1(u)=bw2')

    cy.get(cesc('#\\/l1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=bw2')
    })
    cy.get(cesc('#\\/l2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=b3w4')
    })
    cy.get(cesc('#\\/l3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=b7w8')
    })
    cy.get(cesc('#\\/l4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=b15w16')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value).eqls(["*", "b", ["^", "w", 2]])
      expect(stateVariables["/l2/iter"].stateValues.value).eqls(["*", ["^", "b", 3], ["^", "w", 4]])
      expect(stateVariables["/l3/iter"].stateValues.value).eqls(["*", ["^", "b", 7], ["^", "w", 8]])
      expect(stateVariables["/l4/iter"].stateValues.value).eqls(["*", ["^", "b", 15], ["^", "w", 16]])
    })

    cy.log('change variable')
    cy.get(cesc('#\\/x') + ' textarea').type("{end}{backspace}y{enter}", { force: true });

    cy.get(cesc('#\\/l1')).should('contain.text', 'f1(u)=bx2')

    cy.get(cesc('#\\/l1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=bx2')
    })
    cy.get(cesc('#\\/l2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=bx2')
    })
    cy.get(cesc('#\\/l3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=bx2')
    })
    cy.get(cesc('#\\/l4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=bx2')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value).eqls(["*", "b", ["^", "x", 2]])
      expect(stateVariables["/l2/iter"].stateValues.value).eqls(["*", "b", ["^", "x", 2]])
      expect(stateVariables["/l3/iter"].stateValues.value).eqls(["*", "b", ["^", "x", 2]])
      expect(stateVariables["/l4/iter"].stateValues.value).eqls(["*", "b", ["^", "x", 2]])
    })

    cy.log('change function to match variable')
    cy.get(cesc('#\\/fformula') + ' textarea').type("{ctrl+home}{shift+end}{backspace}y+q{enter}", { force: true });
    cy.get(cesc('#\\/n') + ' textarea').type("{end}{backspace}5{enter}", { force: true });

    cy.get(cesc('#\\/l5')).should('contain.text', 'f5(u)=5q+w')

    cy.get(cesc('#\\/l1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=q+w')
    })
    cy.get(cesc('#\\/l2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=2q+w')
    })
    cy.get(cesc('#\\/l3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=3q+w')
    })
    cy.get(cesc('#\\/l4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=4q+w')
    })
    cy.get(cesc('#\\/l5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f5(u)=5q+w')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value).eqls(["+", "q", "w"])
      expect(stateVariables["/l2/iter"].stateValues.value).eqls(["+", ["*", 2, "q"], "w"])
      expect(stateVariables["/l3/iter"].stateValues.value).eqls(["+", ["*", 3, "q"], "w"])
      expect(stateVariables["/l4/iter"].stateValues.value).eqls(["+", ["*", 4, "q"], "w"])
      expect(stateVariables["/l5/iter"].stateValues.value).eqls(["+", ["*", 5, "q"], "w"])
    })

  })


  it('1D user-defined numerical function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Choose variable for function: <mathinput name="x" prefill="x" />.
  Let <m>f($x) =</m> <mathinput name="fformula" prefill="3x" />.
  Let <m>u = </m> <mathinput name="u" prefill="2" />.  Let <m>n=</m> <mathinput name="n" prefill="3" />
  Then</p>
  <ul>
  <map assignNames="(l1) (l2) (l3) (l4) (l5) (l6) (l7)">
    <template><li newnamespace><m>f^{$i}(u) = <copy componentIndex="$i" target="../iterates" assignNames="iter" /></m></li></template>
    <sources indexAlias="i"><sequence length="$n" /></sources>
  </map>
  </ul>

  <p hide><function name="f" variables="$x" symbolic="false">$fformula</function><functioniterates function="$f" initialValue="$u" nIterates="$n" name="fis" /><copy prop="iterates" target="fis"  name="iterates" /></p>
  

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait for page to load

    cy.get(cesc('#\\/l1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=6')
    })
    cy.get(cesc('#\\/l2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=18')
    })
    cy.get(cesc('#\\/l3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=54')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value).eqls(6)
      expect(stateVariables["/l2/iter"].stateValues.value).eqls(18)
      expect(stateVariables["/l3/iter"].stateValues.value).eqls(54)
    })

    cy.log('change function, nIterates, and initial')
    cy.get(cesc('#\\/fformula') + ' textarea').type("{end}{backspace}{backspace}2x^2{enter}", { force: true });
    cy.get(cesc('#\\/n') + ' textarea').type("{end}{backspace}4{enter}", { force: true });
    cy.get(cesc('#\\/u') + ' textarea').type("{end}{backspace}{backspace}1/4{enter}", { force: true });

    cy.get(cesc('#\\/l1')).should('contain.text', 'f1(u)=0.125')

    cy.get(cesc('#\\/l1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=0.125')
    })
    cy.get(cesc('#\\/l2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=0.03125')
    })
    cy.get(cesc('#\\/l3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=0.001953125')
    })
    cy.get(cesc('#\\/l4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=0.000007629394531')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value).eqls(0.125)
      expect(stateVariables["/l2/iter"].stateValues.value).eqls(0.03125)
      expect(stateVariables["/l3/iter"].stateValues.value).eqls(0.001953125)
      expect(stateVariables["/l4/iter"].stateValues.value).eqls(0.00000762939453125)
    })

    cy.log('change variable')
    cy.get(cesc('#\\/x') + ' textarea').type("{end}{backspace}y{enter}", { force: true });

    cy.get(cesc('#\\/l1')).should('contain.text', 'f1(u)=NaN')

    cy.get(cesc('#\\/l1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=NaN')
    })
    cy.get(cesc('#\\/l2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=NaN')
    })
    cy.get(cesc('#\\/l3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=NaN')
    })
    cy.get(cesc('#\\/l4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=NaN')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value).eqls(NaN)
      expect(stateVariables["/l2/iter"].stateValues.value).eqls(NaN)
      expect(stateVariables["/l3/iter"].stateValues.value).eqls(NaN)
      expect(stateVariables["/l4/iter"].stateValues.value).eqls(NaN)
    })

    cy.log('change function to match variable')
    cy.get(cesc('#\\/fformula') + ' textarea').type("{ctrl+home}{shift+end}{backspace}y+5{enter}", { force: true });
    cy.get(cesc('#\\/n') + ' textarea').type("{end}{backspace}5{enter}", { force: true });

    cy.get(cesc('#\\/l5')).should('contain.text', 'f5(u)=25.25')

    cy.get(cesc('#\\/l1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=5.25')
    })
    cy.get(cesc('#\\/l2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=10.25')
    })
    cy.get(cesc('#\\/l3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=15.25')
    })
    cy.get(cesc('#\\/l4')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=20.25')
    })
    cy.get(cesc('#\\/l5')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f5(u)=25.25')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value).eqls(5.25)
      expect(stateVariables["/l2/iter"].stateValues.value).eqls(10.25)
      expect(stateVariables["/l3/iter"].stateValues.value).eqls(15.25)
      expect(stateVariables["/l4/iter"].stateValues.value).eqls(20.25)
      expect(stateVariables["/l5/iter"].stateValues.value).eqls(25.25)
    })

  })

  it('2D linear function', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>variables: <mathinput name="x" prefill="x" /> and <mathinput name="y" prefill="y" />.
  <m>a = </m> <mathinput name="a" prefill="3" />, <m>b = </m> <mathinput name="b" prefill="-2" />, <m>c = </m> <mathinput name="c" prefill="1" />, <m>d = </m> <mathinput name="d" prefill="4" />.
  <m>f($x, $y) =</m> <function name="f" simplify variables="$x $y">($a$x+$b$y, $c$x+$d$y)</function>
  <m>u = </m> <mathinput name="u" prefill="(2,1)" /> <m>n=</m> <mathinput name="n" prefill="3" /></p>

  <functionIterates function="$f" initialValue="$u" nIterates="$n" name="fis" />
  <p>Iterates: <aslist><copy prop="iterates" target="fis" name="iterates" /></aslist></p>
  <copy prop="value" target="n" assignNames="n2" />

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait for page to load


    function checkIterates({ a, b, c, d, u1, u2, n }) {

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let A = me.math.matrix([[a, b], [c, d]]);
        let x = me.math.matrix([[u1], [u2]]);

        let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
        let iterAnchors = iterNames.map(x => cesc2('#' + x))


        for (let i = 0; i < n; i++) {
          x = me.math.multiply(A, x);
          let x1 = me.math.subset(x, me.math.index(0, 0));
          let x2 = me.math.subset(x, me.math.index(1, 0));
          expect(stateVariables[iterNames[i]].stateValues.value).eqls(["vector", x1, x2])
          cy.get(iterAnchors[i]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.replace(/−/g, '-')).equal(`(${x1},${x2})`)
          })
        }


      });
    }

    checkIterates({ a: 3, b: -2, c: 1, d: 4, u1: 2, u2: 1, n: 3 })

    cy.log(`change values`)
    cy.get(cesc('#\\/x') + ' textarea').type("{end}{backspace}q{enter}", { force: true })
    cy.get(cesc('#\\/y') + ' textarea').type("{end}{backspace}r{enter}", { force: true })
    cy.get(cesc('#\\/a') + ' textarea').type("{end}{backspace}{backspace}-4{enter}", { force: true })
    cy.get(cesc('#\\/b') + ' textarea').type("{end}{backspace}{backspace}7{enter}", { force: true })
    cy.get(cesc('#\\/c') + ' textarea').type("{end}{backspace}{backspace}6{enter}", { force: true })
    cy.get(cesc('#\\/d') + ' textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })
    cy.get(cesc('#\\/u') + ' textarea').type("{end}{leftArrow}{backspace}{backspace}{backspace}-8, 9{enter}", { force: true })
    cy.get(cesc('#\\/n') + ' textarea').type("{end}{backspace}5{enter}", { force: true })

    cy.get(cesc('#\\/n2')).should('contain.text', '5')

    checkIterates({ a: -4, b: 7, c: 6, d: -1, u1: -8, u2: 9, n: 5 })


  })

  it('2D linear function, with alt vectors', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>variables: <mathinput name="x" prefill="x" /> and <mathinput name="y" prefill="y" />.
  <m>a = </m> <mathinput name="a" prefill="3" />, <m>b = </m> <mathinput name="b" prefill="-2" />, <m>c = </m> <mathinput name="c" prefill="1" />, <m>d = </m> <mathinput name="d" prefill="4" />.
  <m>f($x, $y) =</m> <function name="f" simplify variables="$x $y">⟨$a$x+$b$y, $c$x+$d$y⟩</function>
  <m>u = </m> <mathinput name="u" prefill="⟨2,1⟩" /> <m>n=</m> <mathinput name="n" prefill="3" /></p>

  <functionIterates function="$f" initialValue="$u" nIterates="$n" name="fis" />
  <p>Iterates: <aslist><copy prop="iterates" target="fis" name="iterates" /></aslist></p>
  <copy prop="value" target="n" assignNames="n2" />

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait for page to load


    function checkIterates({ a, b, c, d, u1, u2, n }) {

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let A = me.math.matrix([[a, b], [c, d]]);
        let x = me.math.matrix([[u1], [u2]]);

        let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
        let iterAnchors = iterNames.map(x => cesc2('#' + x))


        for (let i = 0; i < n; i++) {
          x = me.math.multiply(A, x);
          let x1 = me.math.subset(x, me.math.index(0, 0));
          let x2 = me.math.subset(x, me.math.index(1, 0));
          expect(stateVariables[iterNames[i]].stateValues.value).eqls(["vector", x1, x2])
          cy.get(iterAnchors[i]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.replace(/−/g, '-')).equal(`(${x1},${x2})`)
          })
        }


      });
    }

    checkIterates({ a: 3, b: -2, c: 1, d: 4, u1: 2, u2: 1, n: 3 })

    cy.log(`change values`)
    cy.get(cesc('#\\/x') + ' textarea').type("{end}{backspace}q{enter}", { force: true })
    cy.get(cesc('#\\/y') + ' textarea').type("{end}{backspace}r{enter}", { force: true })
    cy.get(cesc('#\\/a') + ' textarea').type("{end}{backspace}{backspace}-4{enter}", { force: true })
    cy.get(cesc('#\\/b') + ' textarea').type("{end}{backspace}{backspace}7{enter}", { force: true })
    cy.get(cesc('#\\/c') + ' textarea').type("{end}{backspace}{backspace}6{enter}", { force: true })
    cy.get(cesc('#\\/d') + ' textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })
    cy.get(cesc('#\\/u') + ' textarea').type("{end}{leftArrow}{backspace}{backspace}{backspace}-8, 9{enter}", { force: true })
    cy.get(cesc('#\\/n') + ' textarea').type("{end}{backspace}5{enter}", { force: true })

    cy.get(cesc('#\\/n2')).should('contain.text', '5')

    checkIterates({ a: -4, b: 7, c: 6, d: -1, u1: -8, u2: 9, n: 5 })


  })

  it('change dimensions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>variables: <mathinput name="vars" prefill="x,y" />.
  <m>f($vars) =</m> <mathinput name="fformula" prefill="(xy, x+y)" />.
  <m>u = </m> <mathinput name="u" prefill="(2,1)" /></p>

  <p>Iterates: <aslist><copy prop="iterates" target="fis" name="iterates" /></aslist></p>


  <p hide><mathlist mergeMathLists name="varList">$vars</mathlist><function name="f" variables="$varList" symbolic simplify expand>$fformula</function><functioniterates function="$f" initialValue="$u" nIterates="3" name="fis" /></p>
  
  <copy prop="value" target="vars" assignNames="vars2" />
  <copy prop="value" target="fformula" assignNames="fformula2" />
  <copy prop="value" target="u" assignNames="u2" />

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc2('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(2);
      expect(stateVariables[iterNames[0]].stateValues.value).eqls(["vector", 2, 3]);
      expect(stateVariables[iterNames[1]].stateValues.value).eqls(["vector", 6, 5]);
      expect(stateVariables[iterNames[2]].stateValues.value).eqls(["vector", 30, 11]);

      cy.get(iterAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(2,3)`)
      })
      cy.get(iterAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(6,5)`)
      })
      cy.get(iterAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(30,11)`)
      })


    });

    cy.log(`add component to function`)
    cy.get(cesc('#\\/fformula') + ' textarea').type("{end}{leftArrow}z, x-z{enter}", { force: true });

    cy.get(cesc('#\\/fformula2')).should('contain.text', 'x+yz,')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc2('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(0);
      expect(stateVariables[iterNames[0]].stateValues.value).eqls("\uff3f");
      expect(stateVariables[iterNames[1]].stateValues.value).eqls("\uff3f");
      expect(stateVariables[iterNames[2]].stateValues.value).eqls("\uff3f");

      cy.get(iterAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })
      cy.get(iterAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })
      cy.get(iterAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })


    });

    cy.log(`add variable to function`)
    cy.get(cesc('#\\/vars') + ' textarea').type("{end}, z{enter}", { force: true });
    cy.get(cesc('#\\/vars2')).should('contain.text', 'x,y,z')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc2('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(3);
      expect(stateVariables[iterNames[0]].stateValues.value).eqls("\uff3f");
      expect(stateVariables[iterNames[1]].stateValues.value).eqls("\uff3f");
      expect(stateVariables[iterNames[2]].stateValues.value).eqls("\uff3f");

      cy.get(iterAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })
      cy.get(iterAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })
      cy.get(iterAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })


    });

    cy.log(`add component to initial condition`)
    cy.get(cesc('#\\/u') + ' textarea').type("{end}{leftArrow}, -4{enter}", { force: true });
    cy.get(cesc('#\\/u2')).should('contain.text', '2,1,')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc2('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(3);
      expect(stateVariables[iterNames[0]].stateValues.value).eqls(["vector", 2, -2, 6]);
      expect(stateVariables[iterNames[1]].stateValues.value).eqls(["vector", -4, -10, -4]);
      expect(stateVariables[iterNames[2]].stateValues.value).eqls(["vector", 40, 36, 0]);

      cy.get(iterAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(2,-2,6)`)
      })
      cy.get(iterAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(-4,-10,-4)`)
      })
      cy.get(iterAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(40,36,0)`)
      })


    });

  })

  it('change dimensions, numerical', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>variables: <mathinput name="vars" prefill="x,y" />.
  <m>f($vars) =</m> <mathinput name="fformula" prefill="(xy, x+y)" />.
  <m>u = </m> <mathinput name="u" prefill="(2,1)" /></p>

  <p>Iterates: <aslist><copy prop="iterates" target="fis" name="iterates" /></aslist></p>


  <p hide><mathlist mergeMathLists name="varList">$vars</mathlist><function name="f" variables="$varList" symbolic="false">$fformula</function><functioniterates function="$f" initialValue="$u" nIterates="3" name="fis" /></p>
  <copy prop="value" target="u" assignNames="u2" />
  <copy prop="value" target="fformula" assignNames="fformula2" />
  <copy prop="value" target="vars" assignNames="vars2" />

  `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc2('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(2);
      expect(stateVariables[iterNames[0]].stateValues.value).eqls(["vector", 2, 3]);
      expect(stateVariables[iterNames[1]].stateValues.value).eqls(["vector", 6, 5]);
      expect(stateVariables[iterNames[2]].stateValues.value).eqls(["vector", 30, 11]);

      cy.get(iterAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(2,3)`)
      })
      cy.get(iterAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(6,5)`)
      })
      cy.get(iterAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(30,11)`)
      })

    });


    cy.log(`non-numeric initial condition`)
    cy.get(cesc('#\\/u') + ' textarea').type("{end}{leftArrow}a{enter}", { force: true });
    cy.get(cesc('#\\/u2')).should('contain.text', "(2,1a)")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc2('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(2);

      cy.get(iterAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(NaN,NaN)`)
      })
      cy.get(iterAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(NaN,NaN)`)
      })
      cy.get(iterAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(NaN,NaN)`)
      })

    });


    cy.log(`add component to function`)
    cy.get(cesc('#\\/u') + ' textarea').type("{backspace}{enter}", { force: true });
    cy.get(cesc('#\\/fformula') + ' textarea').type("{end}{leftArrow}z, x-z{enter}", { force: true });
    cy.get(cesc('#\\/fformula2')).should('contain.text', "x+yz,")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc2('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(0);
      expect(stateVariables[iterNames[0]].stateValues.value).eqls("\uff3f");
      expect(stateVariables[iterNames[1]].stateValues.value).eqls("\uff3f");
      expect(stateVariables[iterNames[2]].stateValues.value).eqls("\uff3f");

      cy.get(iterAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })
      cy.get(iterAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })
      cy.get(iterAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })


    });

    cy.log(`add variable to function`)
    cy.get(cesc('#\\/vars') + ' textarea').type("{end}, z{enter}", { force: true });
    cy.get(cesc('#\\/vars2')).should('contain.text', "x,y,z")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc2('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(3);
      expect(stateVariables[iterNames[0]].stateValues.value).eqls("\uff3f");
      expect(stateVariables[iterNames[1]].stateValues.value).eqls("\uff3f");
      expect(stateVariables[iterNames[2]].stateValues.value).eqls("\uff3f");

      cy.get(iterAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })
      cy.get(iterAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })
      cy.get(iterAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal("\uff3f")
      })


    });

    cy.log(`add component to initial condition`)
    cy.get(cesc('#\\/u') + ' textarea').type("{end}{leftArrow}, -4{enter}", { force: true });
    cy.get(cesc('#\\/u2')).should('contain.text', "(2,1,")


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc2('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(3);
      expect(stateVariables[iterNames[0]].stateValues.value).eqls(["vector", 2, -2, 6]);
      expect(stateVariables[iterNames[1]].stateValues.value).eqls(["vector", -4, -10, -4]);
      expect(stateVariables[iterNames[2]].stateValues.value).eqls(["vector", 40, 36, 0]);

      cy.get(iterAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(2,-2,6)`)
      })
      cy.get(iterAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(-4,-10,-4)`)
      })
      cy.get(iterAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.replace(/−/g, '-')).equal(`(40,36,0)`)
      })


    });

  })

})



