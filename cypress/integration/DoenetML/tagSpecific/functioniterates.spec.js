import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('FunctionIterates Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

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

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/l1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=3av')
    })
    cy.get('#\\/l2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=3va2')
    })
    cy.get('#\\/l3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=3va3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value.tree).eqls(["*", 3, "a", "v"])
      expect(stateVariables["/l2/iter"].stateValues.value.tree).eqls(["*", 3, "v", ["^", "a", 2]])
      expect(stateVariables["/l3/iter"].stateValues.value.tree).eqls(["*", 3, "v", ["^", "a", 3]])
    })

    cy.log('change function, nIterates, and initial')
    cy.get('#\\/fformula textarea').type("{end}{backspace}{backspace}bx^2{enter}", { force: true });
    cy.get('#\\/n textarea').type("{end}{backspace}4{enter}", { force: true });
    cy.get('#\\/u textarea').type("{end}{backspace}{backspace}w{enter}", { force: true });


    cy.get('#\\/l1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=bw2')
    })
    cy.get('#\\/l2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=b3w4')
    })
    cy.get('#\\/l3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=b7w8')
    })
    cy.get('#\\/l4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=b15w16')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value.tree).eqls(["*", "b", ["^", "w", 2]])
      expect(stateVariables["/l2/iter"].stateValues.value.tree).eqls(["*", ["^", "b", 3], ["^", "w", 4]])
      expect(stateVariables["/l3/iter"].stateValues.value.tree).eqls(["*", ["^", "b", 7], ["^", "w", 8]])
      expect(stateVariables["/l4/iter"].stateValues.value.tree).eqls(["*", ["^", "b", 15], ["^", "w", 16]])
    })

    cy.log('change variable')
    cy.get('#\\/x textarea').type("{end}{backspace}y{enter}", { force: true });

    cy.get('#\\/l1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=bx2')
    })
    cy.get('#\\/l2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=bx2')
    })
    cy.get('#\\/l3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=bx2')
    })
    cy.get('#\\/l4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=bx2')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value.tree).eqls(["*", "b", ["^", "x", 2]])
      expect(stateVariables["/l2/iter"].stateValues.value.tree).eqls(["*", "b", ["^", "x", 2]])
      expect(stateVariables["/l3/iter"].stateValues.value.tree).eqls(["*", "b", ["^", "x", 2]])
      expect(stateVariables["/l4/iter"].stateValues.value.tree).eqls(["*", "b", ["^", "x", 2]])
    })

    cy.log('change function to match variable')
    cy.get('#\\/fformula textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}y+q{enter}", { force: true });
    cy.get('#\\/n textarea').type("{end}{backspace}5{enter}", { force: true });

    cy.get('#\\/l1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=q+w')
    })
    cy.get('#\\/l2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=2q+w')
    })
    cy.get('#\\/l3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=3q+w')
    })
    cy.get('#\\/l4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=4q+w')
    })
    cy.get('#\\/l5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f5(u)=5q+w')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value.tree).eqls(["+", "q", "w"])
      expect(stateVariables["/l2/iter"].stateValues.value.tree).eqls(["+", ["*", 2, "q"], "w"])
      expect(stateVariables["/l3/iter"].stateValues.value.tree).eqls(["+", ["*", 3, "q"], "w"])
      expect(stateVariables["/l4/iter"].stateValues.value.tree).eqls(["+", ["*", 4, "q"], "w"])
      expect(stateVariables["/l5/iter"].stateValues.value.tree).eqls(["+", ["*", 5, "q"], "w"])
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

  <p hide><function name="f" variables="$x">$fformula</function><functioniterates function="$f" initialValue="$u" nIterates="$n" name="fis" /><copy prop="iterates" target="fis"  name="iterates" /></p>
  

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/l1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=6')
    })
    cy.get('#\\/l2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=18')
    })
    cy.get('#\\/l3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=54')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value.tree).eqls(6)
      expect(stateVariables["/l2/iter"].stateValues.value.tree).eqls(18)
      expect(stateVariables["/l3/iter"].stateValues.value.tree).eqls(54)
    })

    cy.log('change function, nIterates, and initial')
    cy.get('#\\/fformula textarea').type("{end}{backspace}{backspace}2x^2{enter}", { force: true });
    cy.get('#\\/n textarea').type("{end}{backspace}4{enter}", { force: true });
    cy.get('#\\/u textarea').type("{end}{backspace}{backspace}1/4{enter}", { force: true });


    cy.get('#\\/l1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=0.125')
    })
    cy.get('#\\/l2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=0.03125')
    })
    cy.get('#\\/l3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=0.001953125')
    })
    cy.get('#\\/l4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=0.000007629394531')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value.tree).eqls(0.125)
      expect(stateVariables["/l2/iter"].stateValues.value.tree).eqls(0.03125)
      expect(stateVariables["/l3/iter"].stateValues.value.tree).eqls(0.001953125)
      expect(stateVariables["/l4/iter"].stateValues.value.tree).eqls(0.00000762939453125)
    })

    cy.log('change variable')
    cy.get('#\\/x textarea').type("{end}{backspace}y{enter}", { force: true });

    cy.get('#\\/l1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=NaN')
    })
    cy.get('#\\/l2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=NaN')
    })
    cy.get('#\\/l3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=NaN')
    })
    cy.get('#\\/l4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=NaN')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value.tree).eqls(NaN)
      expect(stateVariables["/l2/iter"].stateValues.value.tree).eqls(NaN)
      expect(stateVariables["/l3/iter"].stateValues.value.tree).eqls(NaN)
      expect(stateVariables["/l4/iter"].stateValues.value.tree).eqls(NaN)
    })

    cy.log('change function to match variable')
    cy.get('#\\/fformula textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}y+5{enter}", { force: true });
    cy.get('#\\/n textarea').type("{end}{backspace}5{enter}", { force: true });

    cy.get('#\\/l1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f1(u)=5.25')
    })
    cy.get('#\\/l2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f2(u)=10.25')
    })
    cy.get('#\\/l3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f3(u)=15.25')
    })
    cy.get('#\\/l4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f4(u)=20.25')
    })
    cy.get('#\\/l5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f5(u)=25.25')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l1/iter"].stateValues.value.tree).eqls(5.25)
      expect(stateVariables["/l2/iter"].stateValues.value.tree).eqls(10.25)
      expect(stateVariables["/l3/iter"].stateValues.value.tree).eqls(15.25)
      expect(stateVariables["/l4/iter"].stateValues.value.tree).eqls(20.25)
      expect(stateVariables["/l5/iter"].stateValues.value.tree).eqls(25.25)
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

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load


    function checkIterates({ a, b, c, d, u1, u2, n }) {

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let A = me.math.matrix([[a, b], [c, d]]);
        let x = me.math.matrix([[u1], [u2]]);

        let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
        let iterAnchors = iterNames.map(x => cesc('#' + x))


        for (let i = 0; i < n; i++) {
          x = me.math.multiply(A, x);
          let x1 = me.math.subset(x, me.math.index(0, 0));
          let x2 = me.math.subset(x, me.math.index(1, 0));
          expect(stateVariables["/iterates"].replacements[i].stateValues.value.tree).eqls(["vector", x1, x2])
          cy.get(iterAnchors[i]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.replace(/−/g, '-')).equal(`(${x1},${x2})`)
          })
        }


      });
    }

    checkIterates({ a: 3, b: -2, c: 1, d: 4, u1: 2, u2: 1, n: 3 })

    cy.log(`change values`)
    cy.get('#\\/x textarea').type("{end}{backspace}q{enter}", { force: true })
    cy.get('#\\/y textarea').type("{end}{backspace}r{enter}", { force: true })
    cy.get('#\\/a textarea').type("{end}{backspace}{backspace}-4{enter}", { force: true })
    cy.get('#\\/b textarea').type("{end}{backspace}{backspace}7{enter}", { force: true })
    cy.get('#\\/c textarea').type("{end}{backspace}{backspace}6{enter}", { force: true })
    cy.get('#\\/d textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })
    cy.get('#\\/u textarea').type("{end}{leftArrow}{backspace}{backspace}{backspace}-8, 9{enter}", { force: true })
    cy.get('#\\/n textarea').type("{end}{backspace}5{enter}", { force: true })

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
  

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(2);
      expect(stateVariables[iterNames[0]].stateValues.value.tree).eqls(["vector", 2, 3]);
      expect(stateVariables[iterNames[1]].stateValues.value.tree).eqls(["vector", 6, 5]);
      expect(stateVariables[iterNames[2]].stateValues.value.tree).eqls(["vector", 30, 11]);

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
    cy.get('#\\/fformula textarea').type("{end}{leftArrow}z, x-z{enter}", { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(0);
      expect(stateVariables[iterNames[0]].stateValues.value.tree).eqls("\uff3f");
      expect(stateVariables[iterNames[1]].stateValues.value.tree).eqls("\uff3f");
      expect(stateVariables[iterNames[2]].stateValues.value.tree).eqls("\uff3f");

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
    cy.get('#\\/vars textarea').type("{end}, z{enter}", { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(3);
      expect(stateVariables[iterNames[0]].stateValues.value.tree).eqls("\uff3f");
      expect(stateVariables[iterNames[1]].stateValues.value.tree).eqls("\uff3f");
      expect(stateVariables[iterNames[2]].stateValues.value.tree).eqls("\uff3f");

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
    cy.get('#\\/u textarea').type("{end}{leftArrow}, -4{enter}", { force: true });

    
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(3);
      expect(stateVariables[iterNames[0]].stateValues.value.tree).eqls(["vector", 2, -2, 6]);
      expect(stateVariables[iterNames[1]].stateValues.value.tree).eqls(["vector", -4, -10, -4]);
      expect(stateVariables[iterNames[2]].stateValues.value.tree).eqls(["vector", 40, 36, 0]);

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


  <p hide><mathlist mergeMathLists name="varList">$vars</mathlist><function name="f" variables="$varList">$fformula</function><functioniterates function="$f" initialValue="$u" nIterates="3" name="fis" /></p>
  

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(2);
      expect(stateVariables[iterNames[0]].stateValues.value.tree).eqls(["vector", 2, 3]);
      expect(stateVariables[iterNames[1]].stateValues.value.tree).eqls(["vector", 6, 5]);
      expect(stateVariables[iterNames[2]].stateValues.value.tree).eqls(["vector", 30, 11]);

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
    cy.get('#\\/u textarea').type("{end}{leftArrow}a{enter}", { force: true });
    
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc('#' + x))

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
    cy.get('#\\/u textarea').type("{backspace}{enter}", { force: true });
    cy.get('#\\/fformula textarea').type("{end}{leftArrow}z, x-z{enter}", { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(0);
      expect(stateVariables[iterNames[0]].stateValues.value.tree).eqls("\uff3f");
      expect(stateVariables[iterNames[1]].stateValues.value.tree).eqls("\uff3f");
      expect(stateVariables[iterNames[2]].stateValues.value.tree).eqls("\uff3f");

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
    cy.get('#\\/vars textarea').type("{end}, z{enter}", { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(3);
      expect(stateVariables[iterNames[0]].stateValues.value.tree).eqls("\uff3f");
      expect(stateVariables[iterNames[1]].stateValues.value.tree).eqls("\uff3f");
      expect(stateVariables[iterNames[2]].stateValues.value.tree).eqls("\uff3f");

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
    cy.get('#\\/u textarea').type("{end}{leftArrow}, -4{enter}", { force: true });

    
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let iterNames = stateVariables["/iterates"].replacements.map(x => x.componentName);
      let iterAnchors = iterNames.map(x => cesc('#' + x))

      expect(stateVariables["/fis"].stateValues.nDimensions).eq(3);
      expect(stateVariables[iterNames[0]].stateValues.value.tree).eqls(["vector", 2, -2, 6]);
      expect(stateVariables[iterNames[1]].stateValues.value.tree).eqls(["vector", -4, -10, -4]);
      expect(stateVariables[iterNames[2]].stateValues.value.tree).eqls(["vector", 40, 36, 0]);

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



