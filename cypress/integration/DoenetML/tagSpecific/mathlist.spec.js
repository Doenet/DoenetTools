import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('MathList Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('mathlist from string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>a 1+1 </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let child1Name = stateVariables['/_mathlist1'].activeChildren[0].componentName;
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = stateVariables['/_mathlist1'].activeChildren[1].componentName;
      let child2Anchor = cesc('#' + child2Name);


      cy.log('Test value displayed in browser')
      cy.get(child1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(child2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+1')
      })

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[0].componentName].stateValues.value).eq('a');
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[1].componentName].stateValues.value).eqls(['+', 1, 1]);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eqls(['+', 1, 1]);
      })
    })
  })

  it('mathlist with error in string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>a (  1+1 </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let child1Name = stateVariables['/_mathlist1'].activeChildren[0].componentName;
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = stateVariables['/_mathlist1'].activeChildren[1].componentName;
      let child2Anchor = cesc('#' + child2Name);
      let child3Name = stateVariables['/_mathlist1'].activeChildren[2].componentName;
      let child3Anchor = cesc('#' + child3Name);

      cy.log('Test value displayed in browser')
      cy.get(child1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(child2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(child3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+1')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[0].componentName].stateValues.value).eq('a');
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[1].componentName].stateValues.value).eq('＿');
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[2].componentName].stateValues.value).eqls(['+', 1, 1]);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq('＿');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eqls(['+', 1, 1]);
      })
    })
  })

  it('mathlist in attribute containing math and number macros', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><math name="m1">x</math>
    <math name="m2">3y</math>
    <number name="n1">7</number>
    <number name="n2">11</number></p>
    <p><point xs="$m1 $m2/$n1 $n1 $n1-$n2 $n1 -$n2 $n1 - $n2 $n1$m1$m2 ($n1+$m1)/($n2$m2)" /></p>
    <p><aslist><copy prop="xs" target="_point1" assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11" /></aslist></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/x1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/x2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3y7')
    })
    cy.get('#\\/x3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get('#\\/x4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−4')
    })
    cy.get('#\\/x5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get('#\\/x6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−11')
    })
    cy.get('#\\/x7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get('#\\/x8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#\\/x9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('11')
    })
    cy.get('#\\/x10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21xy')
    })
    cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+733y')
    })
    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let xs = stateVariables["/_point1"].stateValues.xs;

      expect(xs.length).eq(11);
      expect(xs[0]).eq('x');
      expect(stateVariables["/x1"].stateValues.value).eq('x');
      expect(xs[1]).eqls(['/', ['*', 3, 'y'], 7]);
      expect(stateVariables["/x2"].stateValues.value).eqls(['/', ['*', 3, 'y'], 7]);
      expect(xs[2]).eqls(7);
      expect(stateVariables["/x3"].stateValues.value).eqls(7);
      expect(xs[3]).eqls(-4);
      expect(stateVariables["/x4"].stateValues.value).eqls(-4);
      expect(xs[4]).eqls(7);
      expect(stateVariables["/x5"].stateValues.value).eqls(7);
      expect(xs[5]).eqls(-11);
      expect(stateVariables["/x6"].stateValues.value).eqls(-11);
      expect(xs[6]).eqls(7);
      expect(stateVariables["/x7"].stateValues.value).eqls(7);
      expect(xs[7]).eqls('\uff3f');
      expect(stateVariables["/x8"].stateValues.value).eqls('\uff3f');
      expect(xs[8]).eqls(11);
      expect(stateVariables["/x9"].stateValues.value).eqls(11);
      expect(xs[9]).eqls(['*', 21, 'x', 'y']);
      expect(stateVariables["/x10"].stateValues.value).eqls(['*', 21, 'x', 'y']);
      expect(xs[10]).eqls(['/', ['+', 'x', 7], ['*', 33, 'y']]);
      expect(stateVariables["/x11"].stateValues.value).eqls(['/', ['+', 'x', 7], ['*', 33, 'y']]);

    })

  })

  it('mathlist with math children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <math>1+1</math>
    </mathlist>

    <mathlist>
      <math>a</math><math>1+1</math>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+1')
      })
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+1')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_mathlist1'].activeChildren.length).eq(2);
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[0].componentName].stateValues.value).eq('a');
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[1].componentName].stateValues.value).eqls(['+', 1, 1]);
        expect(stateVariables['/_mathlist1'].stateValues.maths.length).eq(2);
        expect(stateVariables['/_mathlist1'].stateValues.maths[0]).eq('a');
        expect(stateVariables['/_mathlist1'].stateValues.maths[1]).eqls(['+', 1, 1]);
        expect(stateVariables['/_mathlist2'].activeChildren.length).eq(2);
        expect(stateVariables[stateVariables['/_mathlist2'].activeChildren[0].componentName].stateValues.value).eq('a');
        expect(stateVariables[stateVariables['/_mathlist2'].activeChildren[1].componentName].stateValues.value).eqls(['+', 1, 1]);
        expect(stateVariables['/_mathlist2'].stateValues.maths.length).eq(2);
        expect(stateVariables['/_mathlist2'].stateValues.maths[0]).eq('a');
        expect(stateVariables['/_mathlist2'].stateValues.maths[1]).eqls(['+', 1, 1]);
      })
    })
  })

  it('mathlist with math and string children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math> q <math>1+1</math>h
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matha = stateVariables["/_mathlist1"].activeChildren[1];
      let mathaAnchor = cesc('#' + matha.componentName);
      let mathb = stateVariables["/_mathlist1"].activeChildren[3];
      let mathbAnchor = cesc('#' + mathb.componentName);


      cy.log('Test value displayed in browser')
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(mathaAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('q')
      })
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+1')
      })
      cy.get(mathbAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('h')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[0].componentName].stateValues.value).eq('a');
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[1].componentName].stateValues.value).eq('q');
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[2].componentName].stateValues.value).eqls(['+', 1, 1]);
        expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[3].componentName].stateValues.value).eq('h');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq('q');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eqls(['+', 1, 1]);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[3]).eq('h');
      })
    })
  })

  it('mathlist with math and number children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <number>1+1</number>
    </mathlist>
    <mathlist>
      <math>a</math><number>1+1</number>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#\\/_number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#\\/_number2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathlist1'].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[0].componentName].stateValues.value).eq('a');
      expect(stateVariables[stateVariables['/_mathlist1'].activeChildren[1].componentName].stateValues.number).eq(2);
      expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq(2);
      expect(stateVariables['/_mathlist2'].activeChildren.length).eq(2);
      expect(stateVariables[stateVariables['/_mathlist2'].activeChildren[0].componentName].stateValues.value).eq('a');
      expect(stateVariables[stateVariables['/_mathlist2'].activeChildren[1].componentName].stateValues.number).eq(2);
      expect((stateVariables['/_mathlist2'].stateValues.maths)[0]).eq('a');
      expect((stateVariables['/_mathlist2'].stateValues.maths)[1]).eq(2);
    })

  })

  it('mathlist with mathlist children, test inverse', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <mathlist>q r</mathlist>
      <math>h</math>
      <mathlist>
        <mathlist>
          <math>b</math>
          <mathlist>u v</mathlist>
        </mathlist>
        <mathlist>i j</mathlist>
      </mathlist>
    </mathlist>

    <mathinput bindValueTo="$(_mathlist1{prop='math1'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math2'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math3'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math4'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math5'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math6'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math7'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math8'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math9'})" />

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let child1Name = stateVariables['/_mathlist2'].activeChildren[0].componentName;
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = stateVariables['/_mathlist2'].activeChildren[1].componentName;
      let child2Anchor = cesc('#' + child2Name);
      let child5Name = stateVariables['/_mathlist5'].activeChildren[0].componentName;
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = stateVariables['/_mathlist5'].activeChildren[1].componentName;
      let child6Anchor = cesc('#' + child6Name);
      let child7Name = stateVariables['/_mathlist6'].activeChildren[0].componentName;
      let child7Anchor = cesc('#' + child7Name);
      let child8Name = stateVariables['/_mathlist6'].activeChildren[1].componentName;
      let child8Anchor = cesc('#' + child8Name);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(child1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('q')
      })
      cy.get(child2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('r')
      })
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('h')
      })
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('b')
      })
      cy.get(child5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u')
      })
      cy.get(child6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('v')
      })
      cy.get(child7Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('i')
      })
      cy.get(child8Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('j')
      })

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq('q');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eq('r');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[3]).eq('h');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[4]).eq('b');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[5]).eq('u');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[6]).eq('v');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[7]).eq('i');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[8]).eq('j');
        expect((stateVariables['/_mathlist2'].stateValues.maths)[0]).eq('q');
        expect((stateVariables['/_mathlist2'].stateValues.maths)[1]).eq('r');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[0]).eq('b');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[1]).eq('u');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[2]).eq('v');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[3]).eq('i');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[4]).eq('j');
        expect((stateVariables['/_mathlist4'].stateValues.maths)[0]).eq('b');
        expect((stateVariables['/_mathlist4'].stateValues.maths)[1]).eq('u');
        expect((stateVariables['/_mathlist4'].stateValues.maths)[2]).eq('v');
        expect((stateVariables['/_mathlist5'].stateValues.maths)[0]).eq('u');
        expect((stateVariables['/_mathlist5'].stateValues.maths)[1]).eq('v');
        expect((stateVariables['/_mathlist6'].stateValues.maths)[0]).eq('i');
        expect((stateVariables['/_mathlist6'].stateValues.maths)[1]).eq('j');
      })

      cy.log('change values')

      cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}1{enter}", { force: true })
      cy.get("#\\/_mathinput2 textarea").type("{end}{backspace}2{enter}", { force: true })
      cy.get("#\\/_mathinput3 textarea").type("{end}{backspace}3{enter}", { force: true })
      cy.get("#\\/_mathinput4 textarea").type("{end}{backspace}4{enter}", { force: true })
      cy.get("#\\/_mathinput5 textarea").type("{end}{backspace}5{enter}", { force: true })
      cy.get("#\\/_mathinput6 textarea").type("{end}{backspace}6{enter}", { force: true })
      cy.get("#\\/_mathinput7 textarea").type("{end}{backspace}7{enter}", { force: true })
      cy.get("#\\/_mathinput8 textarea").type("{end}{backspace}8{enter}", { force: true })
      cy.get("#\\/_mathinput9 textarea").type("{end}{backspace}9{enter}", { force: true })

      cy.get(child8Anchor).should('contain.text', '9');

      cy.log('Test value displayed in browser')
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get(child1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get(child2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get(child5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      })
      cy.get(child6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get(child7Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get(child8Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq(1);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq(2);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eq(3);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[3]).eq(4);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[4]).eq(5);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[5]).eq(6);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[6]).eq(7);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[7]).eq(8);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[8]).eq(9);
        expect((stateVariables['/_mathlist2'].stateValues.maths)[0]).eq(2);
        expect((stateVariables['/_mathlist2'].stateValues.maths)[1]).eq(3);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[0]).eq(5);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[1]).eq(6);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[2]).eq(7);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[3]).eq(8);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[4]).eq(9);
        expect((stateVariables['/_mathlist4'].stateValues.maths)[0]).eq(5);
        expect((stateVariables['/_mathlist4'].stateValues.maths)[1]).eq(6);
        expect((stateVariables['/_mathlist4'].stateValues.maths)[2]).eq(7);
        expect((stateVariables['/_mathlist5'].stateValues.maths)[0]).eq(6);
        expect((stateVariables['/_mathlist5'].stateValues.maths)[1]).eq(7);
        expect((stateVariables['/_mathlist6'].stateValues.maths)[0]).eq(8);
        expect((stateVariables['/_mathlist6'].stateValues.maths)[1]).eq(9);
      })


    })
  })

  it('mathlist with mathlist children and sugar, test inverse', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      a
      <mathlist>q r</mathlist>  
      <math>h</math>
      <mathlist>
        <mathlist>
          b
          <mathlist>u v</mathlist>
        </mathlist>
        <mathlist>i  j</mathlist>
      </mathlist>
    </mathlist>

    <mathinput bindValueTo="$(_mathlist1{prop='math1'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math2'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math3'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math4'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math5'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math6'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math7'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math8'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math9'})" />

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let child0Name = stateVariables['/_mathlist1'].activeChildren[0].componentName;
      let child0Anchor = cesc('#' + child0Name);
      let child1Name = stateVariables['/_mathlist2'].activeChildren[0].componentName;
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = stateVariables['/_mathlist2'].activeChildren[1].componentName;
      let child2Anchor = cesc('#' + child2Name);
      let child4Name = stateVariables['/_mathlist4'].activeChildren[0].componentName;
      let child4Anchor = cesc('#' + child4Name);
      let child5Name = stateVariables['/_mathlist5'].activeChildren[0].componentName;
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = stateVariables['/_mathlist5'].activeChildren[1].componentName;
      let child6Anchor = cesc('#' + child6Name);
      let child7Name = stateVariables['/_mathlist6'].activeChildren[0].componentName;
      let child7Anchor = cesc('#' + child7Name);
      let child8Name = stateVariables['/_mathlist6'].activeChildren[1].componentName;
      let child8Anchor = cesc('#' + child8Name);

      cy.log('Test value displayed in browser')
      cy.get(child0Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(child1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('q')
      })
      cy.get(child2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('r')
      })
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('h')
      })
      cy.get(child4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('b')
      })
      cy.get(child5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u')
      })
      cy.get(child6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('v')
      })
      cy.get(child7Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('i')
      })
      cy.get(child8Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('j')
      })

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq('q');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eq('r');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[3]).eq('h');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[4]).eq('b');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[5]).eq('u');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[6]).eq('v');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[7]).eq('i');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[8]).eq('j');
        expect((stateVariables['/_mathlist2'].stateValues.maths)[0]).eq('q');
        expect((stateVariables['/_mathlist2'].stateValues.maths)[1]).eq('r');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[0]).eq('b');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[1]).eq('u');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[2]).eq('v');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[3]).eq('i');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[4]).eq('j');
        expect((stateVariables['/_mathlist4'].stateValues.maths)[0]).eq('b');
        expect((stateVariables['/_mathlist4'].stateValues.maths)[1]).eq('u');
        expect((stateVariables['/_mathlist4'].stateValues.maths)[2]).eq('v');
        expect((stateVariables['/_mathlist5'].stateValues.maths)[0]).eq('u');
        expect((stateVariables['/_mathlist5'].stateValues.maths)[1]).eq('v');
        expect((stateVariables['/_mathlist6'].stateValues.maths)[0]).eq('i');
        expect((stateVariables['/_mathlist6'].stateValues.maths)[1]).eq('j');
      })

      cy.log('change values')

      cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}1{enter}", { force: true })
      cy.get("#\\/_mathinput2 textarea").type("{end}{backspace}2{enter}", { force: true })
      cy.get("#\\/_mathinput3 textarea").type("{end}{backspace}3{enter}", { force: true })
      cy.get("#\\/_mathinput4 textarea").type("{end}{backspace}4{enter}", { force: true })
      cy.get("#\\/_mathinput5 textarea").type("{end}{backspace}5{enter}", { force: true })
      cy.get("#\\/_mathinput6 textarea").type("{end}{backspace}6{enter}", { force: true })
      cy.get("#\\/_mathinput7 textarea").type("{end}{backspace}7{enter}", { force: true })
      cy.get("#\\/_mathinput8 textarea").type("{end}{backspace}8{enter}", { force: true })
      cy.get("#\\/_mathinput9 textarea").type("{end}{backspace}9{enter}", { force: true })

      cy.get(child8Anchor).should('contain.text', '9')

      cy.log('Test value displayed in browser')
      cy.get(child0Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get(child1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get(child2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get(child4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get(child5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      })
      cy.get(child6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get(child7Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get(child8Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq(1);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq(2);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eq(3);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[3]).eq(4);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[4]).eq(5);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[5]).eq(6);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[6]).eq(7);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[7]).eq(8);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[8]).eq(9);
        expect((stateVariables['/_mathlist2'].stateValues.maths)[0]).eq(2);
        expect((stateVariables['/_mathlist2'].stateValues.maths)[1]).eq(3);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[0]).eq(5);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[1]).eq(6);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[2]).eq(7);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[3]).eq(8);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[4]).eq(9);
        expect((stateVariables['/_mathlist4'].stateValues.maths)[0]).eq(5);
        expect((stateVariables['/_mathlist4'].stateValues.maths)[1]).eq(6);
        expect((stateVariables['/_mathlist4'].stateValues.maths)[2]).eq(7);
        expect((stateVariables['/_mathlist5'].stateValues.maths)[0]).eq(6);
        expect((stateVariables['/_mathlist5'].stateValues.maths)[1]).eq(7);
        expect((stateVariables['/_mathlist6'].stateValues.maths)[0]).eq(8);
        expect((stateVariables['/_mathlist6'].stateValues.maths)[1]).eq(9);
      })


    })
  })

  it('mathlist with self references', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <mathlist>q r</mathlist>
      <copy prop="math3" target="_mathlist1" assignNames="m4" createComponentOfType="math" />
      <mathlist>
        <mathlist name="mid">
          <math><copy prop="math1" target="_mathlist1" createComponentOfType="math" /></math>
          <mathlist>u v</mathlist>
        </mathlist>
        <mathlist>
          <copy prop="math2" target="_mathlist1" assignNames="m8" createComponentOfType="math" />
          <copy prop="math5" target="_mathlist1" assignNames="m9" createComponentOfType="math" />
        </mathlist>
      </mathlist>
      <copy target="mid" assignNames="mid2" />
    </mathlist>

    <mathinput bindValueTo="$(_mathlist1{prop='math1'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math2'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math3'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math4'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math5'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math6'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math7'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math8'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math9'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math10'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math11'})" />
    <mathinput bindValueTo="$(_mathlist1{prop='math12'})" />

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let child0Name = "/_math1";
      let ca0 = cesc('#' + child0Name);
      let child1Name = stateVariables['/_mathlist2'].activeChildren[0].componentName;
      let ca1 = cesc('#' + child1Name);
      let child2Name = stateVariables['/_mathlist2'].activeChildren[1].componentName;
      let ca2 = cesc('#' + child2Name);
      let child3Name = "/m4";
      let ca3 = cesc('#' + child3Name);
      let child4Name = "/_math2";
      let ca4 = cesc('#' + child4Name);
      let child5Name = stateVariables['/_mathlist5'].activeChildren[0].componentName;
      let ca5 = cesc('#' + child5Name);
      let child6Name = stateVariables['/_mathlist5'].activeChildren[1].componentName;
      let ca6 = cesc('#' + child6Name);
      let child7Name = "/m8";
      let ca7 = cesc('#' + child7Name);
      let child8Name = "/m9";
      let ca8 = cesc('#' + child8Name);
      let child9Name = stateVariables['/mid2'].activeChildren[0].componentName;
      let ca9 = cesc('#' + child9Name);
      let child10Name = stateVariables[stateVariables['/mid2'].activeChildren[1].componentName].activeChildren[0].componentName;
      let ca10 = cesc('#' + child10Name);
      let child11Name = stateVariables[stateVariables['/mid2'].activeChildren[1].componentName].activeChildren[1].componentName;
      let ca11 = cesc('#' + child11Name);


      let childAnchors = [ca0, ca1, ca2, ca3, ca4, ca5, ca6, ca7, ca8, ca9, ca10, ca11]
      let vals = ["a", "q", "r", "u", "v"]
      let mapping = [0, 1, 2, 2, 0, 3, 4, 1, 0, 0, 3, 4];
      let mv = i => vals[mapping[i]];

      let maths = (stateVariables['/_mathlist1'].stateValues.maths);

      let mathinputAnchors = []
      for (let i in mapping) {
        mathinputAnchors.push(`#\\/_mathinput${Number(i) + 1} textarea`)

      }

      cy.log('Test value displayed in browser')

      for (let i in mapping) {
        cy.get(childAnchors[i]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(mv(i))
        })
      }

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        for (let i in mapping) {
          expect(maths[i]).eq(mv(i));
        }
      })

      cy.log('change values')

      for (let changeInd in mapping) {
        cy.window().then(async (win) => {
          vals[mapping[changeInd]] = Number(changeInd);
          cy.get(mathinputAnchors[changeInd]).type("{end}{backspace}" + changeInd + "{enter}", { force: true });
          cy.get(childAnchors[changeInd]).should('contain.text', String(mv(changeInd)))

          cy.log('Test value displayed in browser')

          for (let i in mapping) {
            cy.get(childAnchors[i]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
              expect(text.trim()).equal(String(mv(i)))
            })
          }

          cy.log('Test internal values are set to the correct values')
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let maths = (stateVariables['/_mathlist1'].stateValues.maths);

            for (let i in mapping) {
              expect(maths[i]).eq(mv(i));
            }
          })


        })

      }


    })
  })

  // TODO: address maximum number in rendered children of mathlist
  it('mathlist with maximum number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist maximumnumber="7">
      <math>a</math>
      <mathlist maximumnumber="2">q r l k</mathlist>
      <math>h</math>
      <mathlist maximumnumber="4">
        <mathlist maximumnumber="2">
          <math>b</math>
          <mathlist>u v</mathlist>
        </mathlist>
        <mathlist>i j k</mathlist>
      </mathlist>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {
      // let stateVariables = await win.returnAllStateVariables1();
      // let child1Name = stateVariables['/_mathlist2'].activeChildren[0].componentName;
      // let child1Anchor = cesc('#' + child1Name);
      // let child2Name = stateVariables['/_mathlist2'].activeChildren[1].componentName;
      // let child2Anchor = cesc('#' + child2Name);
      // let child5Name = stateVariables['/_mathlist5'].activeChildren[0].componentName;
      // let child5Anchor = cesc('#' + child5Name);
      // let child6Name = stateVariables['/_mathlist6'].activeChildren[0].componentName;
      // let child6Anchor = cesc('#' + child6Name);

      // cy.log('Test value displayed in browser')
      // cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('a')
      // })
      // cy.get(child1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('q')
      // })
      // cy.get(child2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('r')
      // })
      // cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('h')
      // })
      // cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('b')
      // })
      // cy.get(child5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('u')
      // })
      // cy.get(child6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('i')
      // })


      cy.get('#\\/_document1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get('#\\/_document1').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('q')
      });
      cy.get('#\\/_document1').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('r')
      });
      cy.get('#\\/_document1').find('.mjx-mrow').eq(3).invoke('text').then((text) => {
        expect(text.trim()).equal('h')
      });
      cy.get('#\\/_document1').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('b')
      });
      cy.get('#\\/_document1').find('.mjx-mrow').eq(5).invoke('text').then((text) => {
        expect(text.trim()).equal('u')
      });
      cy.get('#\\/_document1').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
        expect(text.trim()).equal('i')
      });
      cy.get('#\\/_document1').find('.mjx-mrow').eq(7).should('not.exist')

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/_mathlist1'].stateValues.maths).length).eq(7);
        expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq('q');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eq('r');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[3]).eq('h');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[4]).eq('b');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[5]).eq('u');
        expect((stateVariables['/_mathlist1'].stateValues.maths)[6]).eq('i');
        expect((stateVariables['/_mathlist2'].stateValues.maths).length).eq(2);
        expect((stateVariables['/_mathlist2'].stateValues.maths)[0]).eq('q');
        expect((stateVariables['/_mathlist2'].stateValues.maths)[1]).eq('r');
        expect((stateVariables['/_mathlist3'].stateValues.maths).length).eq(4);
        expect((stateVariables['/_mathlist3'].stateValues.maths)[0]).eq('b');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[1]).eq('u');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[2]).eq('i');
        expect((stateVariables['/_mathlist3'].stateValues.maths)[3]).eq('j');
        expect((stateVariables['/_mathlist4'].stateValues.maths).length).eq(2);
        expect((stateVariables['/_mathlist4'].stateValues.maths)[0]).eq('b');
        expect((stateVariables['/_mathlist4'].stateValues.maths)[1]).eq('u');
        expect((stateVariables['/_mathlist5'].stateValues.maths).length).eq(2);
        expect((stateVariables['/_mathlist5'].stateValues.maths)[0]).eq('u');
        expect((stateVariables['/_mathlist5'].stateValues.maths)[1]).eq('v');
        expect((stateVariables['/_mathlist6'].stateValues.maths).length).eq(3);
        expect((stateVariables['/_mathlist6'].stateValues.maths)[0]).eq('i');
        expect((stateVariables['/_mathlist6'].stateValues.maths)[1]).eq('j');
        expect((stateVariables['/_mathlist6'].stateValues.maths)[2]).eq('k');
      })
    })
  })

  it('copy mathlist and overwrite maximum number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p><mathlist name="ml1">a b c d e</mathlist></p>
      <p><copy target="ml1" maximumNumber="3" assignNames="ml2" /></p>
      <p><copy target="ml2" maximumNumber="" assignNames="ml3" /></p>

      <p><mathlist name="ml4" maximumNumber="3">a b c d e</mathlist></p>
      <p><copy target="ml4" maximumNumber="4" assignNames="ml5" /></p>
      <p><copy target="ml5" maximumNumber="" assignNames="ml6" /></p>

      ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {


      cy.get('#\\/_p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get('#\\/_p1').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('b')
      });
      cy.get('#\\/_p1').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('c')
      });
      cy.get('#\\/_p1').find('.mjx-mrow').eq(3).invoke('text').then((text) => {
        expect(text.trim()).equal('d')
      });
      cy.get('#\\/_p1').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('e')
      });
      cy.get('#\\/_p1').find('.mjx-mrow').eq(5).should('not.exist')


      cy.get('#\\/_p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get('#\\/_p2').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('b')
      });
      cy.get('#\\/_p2').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('c')
      });
      cy.get('#\\/_p2').find('.mjx-mrow').eq(3).should('not.exist')


      cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get('#\\/_p3').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('b')
      });
      cy.get('#\\/_p3').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('c')
      });
      cy.get('#\\/_p3').find('.mjx-mrow').eq(3).invoke('text').then((text) => {
        expect(text.trim()).equal('d')
      });
      cy.get('#\\/_p3').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('e')
      });
      cy.get('#\\/_p3').find('.mjx-mrow').eq(5).should('not.exist')


      cy.get('#\\/_p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get('#\\/_p4').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('b')
      });
      cy.get('#\\/_p4').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('c')
      });
      cy.get('#\\/_p4').find('.mjx-mrow').eq(3).should('not.exist')


      cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get('#\\/_p5').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('b')
      });
      cy.get('#\\/_p5').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('c')
      });
      cy.get('#\\/_p5').find('.mjx-mrow').eq(3).invoke('text').then((text) => {
        expect(text.trim()).equal('d')
      });
      cy.get('#\\/_p5').find('.mjx-mrow').eq(4).should('not.exist')


      cy.get('#\\/_p6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      });
      cy.get('#\\/_p6').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('b')
      });
      cy.get('#\\/_p6').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('c')
      });
      cy.get('#\\/_p6').find('.mjx-mrow').eq(3).invoke('text').then((text) => {
        expect(text.trim()).equal('d')
      });
      cy.get('#\\/_p6').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('e')
      });
      cy.get('#\\/_p6').find('.mjx-mrow').eq(5).should('not.exist')


      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/ml1'].stateValues.maths)).eqls(['a', 'b', 'c', 'd', 'e']);
        expect((stateVariables['/ml2'].stateValues.maths)).eqls(['a', 'b', 'c']);
        expect((stateVariables['/ml3'].stateValues.maths)).eqls(['a', 'b', 'c', 'd', 'e']);
        expect((stateVariables['/ml4'].stateValues.maths)).eqls(['a', 'b', 'c']);
        expect((stateVariables['/ml5'].stateValues.maths)).eqls(['a', 'b', 'c', 'd']);
        expect((stateVariables['/ml6'].stateValues.maths)).eqls(['a', 'b', 'c', 'd', 'e']);

      })
    })
  })


  it('dynamic maximum number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p><mathlist name="ml1" maximumNumber="$mn1" >x y z u v</mathlist></p>
      <p><copy target="ml1" maximumNumber="$mn2" assignNames="ml2" /></p>
      <p>Maximum number 1: <mathinput name="mn1" prefill="2" /></p>
      <p>Maximum number 2: <mathinput name="mn2" /></p>

      ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get('#\\/_p1 > span:nth-of-type(1) .mjx-mrow').should('contain.text', 'x')
    cy.get('#\\/_p1 > span:nth-of-type(2) .mjx-mrow').should('contain.text', 'y')
    cy.get('#\\/_p1 > span:nth-of-type(3) .mjx-mrow').should('not.exist')
    cy.get('#\\/_p2 > span:nth-of-type(1) .mjx-mrow').should('contain.text', 'x')
    cy.get('#\\/_p2 > span:nth-of-type(2) .mjx-mrow').should('contain.text', 'y')
    cy.get('#\\/_p2 > span:nth-of-type(3) .mjx-mrow').should('contain.text', 'z')
    cy.get('#\\/_p2 > span:nth-of-type(4) .mjx-mrow').should('contain.text', 'u')
    cy.get('#\\/_p2 > span:nth-of-type(5) .mjx-mrow').should('contain.text', 'v')
    cy.get('#\\/_p2 > span:nth-of-type(6) .mjx-mrow').should('not.exist')

    cy.get('#\\/_p1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/_p1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/_p2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/_p2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/_p2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/_p2 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/_p2 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ml1'].stateValues.maths).eqls(["x", "y"]);
      expect(stateVariables['/ml2'].stateValues.maths).eqls(["x", "y", "z", "u", "v"]);
    })

    cy.log("clear first maxnum")
    cy.get('#\\/mn1 textarea').type("{end}{backspace}", { force: true }).blur();


    cy.get('#\\/_p1 > span:nth-of-type(1) .mjx-mrow').should('contain.text', 'x')
    cy.get('#\\/_p1 > span:nth-of-type(2) .mjx-mrow').should('contain.text', 'y')
    cy.get('#\\/_p1 > span:nth-of-type(3) .mjx-mrow').should('contain.text', 'z')
    cy.get('#\\/_p1 > span:nth-of-type(4) .mjx-mrow').should('contain.text', 'u')
    cy.get('#\\/_p1 > span:nth-of-type(5) .mjx-mrow').should('contain.text', 'v')
    cy.get('#\\/_p1 > span:nth-of-type(6) .mjx-mrow').should('not.exist')
    cy.get('#\\/_p2 > span:nth-of-type(1) .mjx-mrow').should('contain.text', 'x')
    cy.get('#\\/_p2 > span:nth-of-type(2) .mjx-mrow').should('contain.text', 'y')
    cy.get('#\\/_p2 > span:nth-of-type(3) .mjx-mrow').should('contain.text', 'z')
    cy.get('#\\/_p2 > span:nth-of-type(4) .mjx-mrow').should('contain.text', 'u')
    cy.get('#\\/_p2 > span:nth-of-type(5) .mjx-mrow').should('contain.text', 'v')
    cy.get('#\\/_p2 > span:nth-of-type(6) .mjx-mrow').should('not.exist')

    cy.get('#\\/_p1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/_p1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/_p1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/_p1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/_p1 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/_p2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/_p2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/_p2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/_p2 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/_p2 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ml1'].stateValues.maths).eqls(["x", "y", "z", "u", "v"]);
      expect(stateVariables['/ml2'].stateValues.maths).eqls(["x", "y", "z", "u", "v"]);
    })


    cy.log("number in second maxnum")
    cy.get('#\\/mn2 textarea').type("3{enter}", { force: true });


    cy.get('#\\/_p2 > span:nth-of-type(4) .mjx-mrow').should('not.exist')
    cy.get('#\\/_p1 > span:nth-of-type(1) .mjx-mrow').should('contain.text', 'x')
    cy.get('#\\/_p1 > span:nth-of-type(2) .mjx-mrow').should('contain.text', 'y')
    cy.get('#\\/_p1 > span:nth-of-type(3) .mjx-mrow').should('contain.text', 'z')
    cy.get('#\\/_p1 > span:nth-of-type(4) .mjx-mrow').should('contain.text', 'u')
    cy.get('#\\/_p1 > span:nth-of-type(5) .mjx-mrow').should('contain.text', 'v')
    cy.get('#\\/_p1 > span:nth-of-type(6) .mjx-mrow').should('not.exist')
    cy.get('#\\/_p2 > span:nth-of-type(1) .mjx-mrow').should('contain.text', 'x')
    cy.get('#\\/_p2 > span:nth-of-type(2) .mjx-mrow').should('contain.text', 'y')
    cy.get('#\\/_p2 > span:nth-of-type(3) .mjx-mrow').should('contain.text', 'z')

    cy.get('#\\/_p1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/_p1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/_p1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/_p1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/_p1 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/_p2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/_p2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/_p2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ml1'].stateValues.maths).eqls(["x", "y", "z", "u", "v"]);
      expect(stateVariables['/ml2'].stateValues.maths).eqls(["x", "y", "z"]);
    })


    cy.log("number in first maxnum")
    cy.get('#\\/mn1 textarea').type("4{enter}", { force: true });

    cy.get('#\\/_p1 > span:nth-of-type(5) .mjx-mrow').should('not.exist')
    cy.get('#\\/_p1 > span:nth-of-type(1) .mjx-mrow').should('contain.text', 'x')
    cy.get('#\\/_p1 > span:nth-of-type(2) .mjx-mrow').should('contain.text', 'y')
    cy.get('#\\/_p1 > span:nth-of-type(3) .mjx-mrow').should('contain.text', 'z')
    cy.get('#\\/_p1 > span:nth-of-type(4) .mjx-mrow').should('contain.text', 'u')
    cy.get('#\\/_p2 > span:nth-of-type(1) .mjx-mrow').should('contain.text', 'x')
    cy.get('#\\/_p2 > span:nth-of-type(2) .mjx-mrow').should('contain.text', 'y')
    cy.get('#\\/_p2 > span:nth-of-type(3) .mjx-mrow').should('contain.text', 'z')
    cy.get('#\\/_p2 > span:nth-of-type(4) .mjx-mrow').should('not.exist')

    cy.get('#\\/_p1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/_p1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/_p1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/_p1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/_p2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/_p2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/_p2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ml1'].stateValues.maths).eqls(["x", "y", "z", "u"]);
      expect(stateVariables['/ml2'].stateValues.maths).eqls(["x", "y", "z"]);
    })


    cy.log("change number in first maxnum")
    cy.get('#\\/mn1 textarea').type("{end}{backspace}1{enter}", { force: true });

    cy.get('#\\/_p1 > span:nth-of-type(2) .mjx-mrow').should('not.exist')
    cy.get('#\\/_p1 > span:nth-of-type(1) .mjx-mrow').should('contain.text', 'x')
    cy.get('#\\/_p2 > span:nth-of-type(1) .mjx-mrow').should('contain.text', 'x')
    cy.get('#\\/_p2 > span:nth-of-type(2) .mjx-mrow').should('contain.text', 'y')
    cy.get('#\\/_p2 > span:nth-of-type(3) .mjx-mrow').should('contain.text', 'z')
    cy.get('#\\/_p2 > span:nth-of-type(4) .mjx-mrow').should('not.exist')

    cy.get('#\\/_p1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/_p2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/_p2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/_p2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ml1'].stateValues.maths).eqls(["x"]);
      expect(stateVariables['/ml2'].stateValues.maths).eqls(["x", "y", "z"]);
    })


  })

  it('mathlist with merge math list', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist mergeMathLists="$_booleaninput1">
      <math>a</math>
      <math>b,c,d</math>
      <math>e,f</math>
      <math>g</math>
    </mathlist>
    <p>Merge math lists: <booleaninput /></p>

    <p>Third math: <copy prop="math3" target="_mathlist1" /></p>
    <p>Fifth math: <copy prop="math5" target="_mathlist1" /></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b,c,d')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e,f')
    })
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get('#\\/_p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e,f')
    })
    cy.get('#\\/_p3').find('.mjx-mrow').should('not.exist');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_mathlist1'].stateValues.maths).length).eq(4);
      expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eqls(['list', 'b', 'c', 'd']);
      expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eqls(['list', 'e', 'f']);
      expect((stateVariables['/_mathlist1'].stateValues.maths)[3]).eq('g');
      expect(stateVariables['/_mathlist1'].stateValues.math3).eqls(['list', 'e', 'f']);
      expect(stateVariables['/_mathlist1'].stateValues.math5).eq(undefined);

    })

    cy.log('merge math lists')
    cy.get('#\\/_booleaninput1_input').click();

    cy.get('#\\/_p2 .mjx-mrow').should('contain.text', 'c')

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b,c,d')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e,f')
    })
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get('#\\/_p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })
    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_mathlist1'].stateValues.maths).length).eq(7);
      expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq('b');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eq('c');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[3]).eq('d');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[4]).eq('e');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[5]).eq('f');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[6]).eq('g');
      expect(stateVariables['/_mathlist1'].stateValues.math3).eq('c');
      expect(stateVariables['/_mathlist1'].stateValues.math5).eq('e');

    })


    cy.log('stop merging again')
    cy.get('#\\/_booleaninput1_input').click();
    cy.get('#\\/_p2 .mjx-mrow').should('contain.text', 'e,f')

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b,c,d')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e,f')
    })
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get('#\\/_p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e,f')
    })
    cy.get('#\\/_p3').find('.mjx-mrow').should('not.exist');

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_mathlist1'].stateValues.maths).length).eq(4);
      expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eqls(['list', 'b', 'c', 'd']);
      expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eqls(['list', 'e', 'f']);
      expect((stateVariables['/_mathlist1'].stateValues.maths)[3]).eq('g');
      expect(stateVariables['/_mathlist1'].stateValues.math3).eqls(['list', 'e', 'f']);
      expect(stateVariables['/_mathlist1'].stateValues.math5).eq(undefined);

    })

  })

  it('always merge math lists when have one math child', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <math>a,b,c,d,e</math>
    </mathlist>

    <p>Third math: <copy prop="math3" target="_mathlist1" /></p>
    <p>Fifth math: <copy prop="math5" target="_mathlist1" /></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a,b,c,d,e')
    })
    cy.get('#\\/_p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })
    cy.get('#\\/_p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_mathlist1'].stateValues.maths).length).eq(5);
      expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq('b');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eq('c');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[3]).eq('d');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[4]).eq('e');
      expect(stateVariables['/_mathlist1'].stateValues.math3).eq('c')
      expect(stateVariables['/_mathlist1'].stateValues.math5).eq('e');

    })

  })

  // TODO: deal with hidden children of a mathlist
  it('mathlist within mathlists, with child hide', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><mathlist hide="true">a b c</mathlist></p>

    <p><copy name="mathlist1a" hide="false" target="_mathlist1" /></p>

    <p><mathlist>
      <math>x</math>
      <copy target="_mathlist1" />
      <math hide>y</math>
      <copy target="mathlist1a" />
    </mathlist></p>

    <p><copy name="mathlist3" maximumnumber="6" target="_mathlist2" /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')

    cy.get('#\\/_p1').should('have.text', '')

    cy.get('#\\/_p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p2').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    });
    cy.get('#\\/_p2').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    });
    cy.get('#\\/_p2').find('.mjx-mrow').eq(3).should('not.exist')

    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(7).should('not.exist')

    cy.get('#\\/_p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(5).should('not.exist');


    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathlist1a = stateVariables[stateVariables["/mathlist1a"].replacements[0].componentName];
      let mathlist3 = stateVariables[stateVariables["/mathlist3"].replacements[0].componentName];
      expect((stateVariables['/_mathlist1'].stateValues.maths).length).eq(3);
      expect((stateVariables['/_mathlist1'].stateValues.maths)[0]).eq('a');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[1]).eq('b');
      expect((stateVariables['/_mathlist1'].stateValues.maths)[2]).eq('c');
      expect((await mathlist1a.stateValues.maths).length).eq(3);
      expect((await mathlist1a.stateValues.maths)[0]).eq('a');
      expect((await mathlist1a.stateValues.maths)[1]).eq('b');
      expect((await mathlist1a.stateValues.maths)[2]).eq('c');
      expect((stateVariables['/_mathlist2'].stateValues.maths).length).eq(8);
      expect((stateVariables['/_mathlist2'].stateValues.maths)[0]).eq('x');
      expect((stateVariables['/_mathlist2'].stateValues.maths)[1]).eq('a');
      expect((stateVariables['/_mathlist2'].stateValues.maths)[2]).eq('b');
      expect((stateVariables['/_mathlist2'].stateValues.maths)[3]).eq('c');
      expect((stateVariables['/_mathlist2'].stateValues.maths)[4]).eq('y');
      expect((stateVariables['/_mathlist2'].stateValues.maths)[5]).eq('a');
      expect((stateVariables['/_mathlist2'].stateValues.maths)[6]).eq('b');
      expect((stateVariables['/_mathlist2'].stateValues.maths)[7]).eq('c');
      expect((await mathlist3.stateValues.maths).length).eq(6);
      expect((await mathlist3.stateValues.maths)[0]).eq('x');
      expect((await mathlist3.stateValues.maths)[1]).eq('a');
      expect((await mathlist3.stateValues.maths)[2]).eq('b');
      expect((await mathlist3.stateValues.maths)[3]).eq('c');
      expect((await mathlist3.stateValues.maths)[4]).eq('y');
      expect((await mathlist3.stateValues.maths)[5]).eq('a');

    })

  })

  it('mathlist does not force composite replacement, even in boolean', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <boolean>
      <mathlist>$nothing</mathlist> = <mathlist></mathlist>
    </boolean>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_boolean1').should('have.text', 'true')

  })

  it('mathlist and rounding, from strings', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><mathlist displayDigits="3">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p><mathlist displayDigits="3" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p><mathlist displayDecimals="3">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p><mathlist displayDecimals="3" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p><mathlist displayDigits="3" displaySmallAsZero>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p><mathlist displayDigits="3" displaySmallAsZero padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let maths1 = stateVariables["/_mathlist1"].activeChildren.map(x => x.componentName);
      let maths2 = stateVariables["/_mathlist2"].activeChildren.map(x => x.componentName);
      let maths3 = stateVariables["/_mathlist3"].activeChildren.map(x => x.componentName);
      let maths4 = stateVariables["/_mathlist4"].activeChildren.map(x => x.componentName);
      let maths5 = stateVariables["/_mathlist5"].activeChildren.map(x => x.componentName);
      let maths6 = stateVariables["/_mathlist6"].activeChildren.map(x => x.componentName);

      cy.get(cesc('#' + maths1[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2350')
      })
      cy.get(cesc('#' + maths1[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.52')
      })
      cy.get(cesc('#' + maths1[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.5')
      })
      cy.get(cesc('#' + maths1[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.25⋅10−13')
      })
      cy.get(cesc('#' + maths1[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('6⋅10−21')
      })


      cy.get(cesc('#' + maths2[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2350')
      })
      cy.get(cesc('#' + maths2[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.52')
      })
      cy.get(cesc('#' + maths2[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.500')
      })
      cy.get(cesc('#' + maths2[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.25⋅10−13')
      })
      cy.get(cesc('#' + maths2[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('6.00⋅10−21')
      })


      cy.get(cesc('#' + maths3[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2345.154')
      })
      cy.get(cesc('#' + maths3[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.523')
      })
      cy.get(cesc('#' + maths3[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.5')
      })
      cy.get(cesc('#' + maths3[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })
      cy.get(cesc('#' + maths3[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })

      cy.get(cesc('#' + maths4[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2345.154')
      })
      cy.get(cesc('#' + maths4[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.523')
      })
      cy.get(cesc('#' + maths4[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.500')
      })
      cy.get(cesc('#' + maths4[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.000')
      })
      cy.get(cesc('#' + maths4[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.000')
      })

      cy.get(cesc('#' + maths5[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2350')
      })
      cy.get(cesc('#' + maths5[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.52')
      })
      cy.get(cesc('#' + maths5[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.5')
      })
      cy.get(cesc('#' + maths5[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.25⋅10−13')
      })
      cy.get(cesc('#' + maths5[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })

      cy.get(cesc('#' + maths6[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2350')
      })
      cy.get(cesc('#' + maths6[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.52')
      })
      cy.get(cesc('#' + maths6[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.500')
      })
      cy.get(cesc('#' + maths6[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.25⋅10−13')
      })
      cy.get(cesc('#' + maths6[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.00')
      })



    })

  })

  it('mathlist and rounding, override math children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><mathlist name="ml1">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="5">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math>0.00000000000000052523</math>
      <math displaySmallAsZero>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml2" displayDigits="3">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="5">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math>0.00000000000000052523</math>
      <math displaySmallAsZero>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml3" displayDigits="3" padZeros>
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="5">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math>0.00000000000000052523</math>
      <math displaySmallAsZero>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml4" displayDigits="3" padZeros="false">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="5">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math>0.00000000000000052523</math>
      <math displaySmallAsZero>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml5" displayDecimals="3">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="5">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math>0.00000000000000052523</math>
      <math displaySmallAsZero>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml6" displayDecimals="3" padZeros>
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="5">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math>0.00000000000000052523</math>
      <math displaySmallAsZero>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml7" displayDecimals="3" padZeros="false">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="5">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math>0.00000000000000052523</math>
      <math displaySmallAsZero>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml8" displayDigits="3" displaySmallAsZero>
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="5">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math>0.00000000000000052523</math>
      <math displaySmallAsZero>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml9" displayDigits="3" displaySmallAsZero="false">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="5">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math>0.00000000000000052523</math>
      <math displaySmallAsZero>0.000000000000000000006</math>
    </mathList></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let maths1 = stateVariables["/ml1"].activeChildren.map(x => x.componentName);
      let maths2 = stateVariables["/ml2"].activeChildren.map(x => x.componentName);
      let maths3 = stateVariables["/ml3"].activeChildren.map(x => x.componentName);
      let maths4 = stateVariables["/ml4"].activeChildren.map(x => x.componentName);
      let maths5 = stateVariables["/ml5"].activeChildren.map(x => x.componentName);
      let maths6 = stateVariables["/ml6"].activeChildren.map(x => x.componentName);
      let maths7 = stateVariables["/ml7"].activeChildren.map(x => x.componentName);
      let maths8 = stateVariables["/ml8"].activeChildren.map(x => x.componentName);
      let maths9 = stateVariables["/ml9"].activeChildren.map(x => x.componentName);

      cy.get(cesc('#' + maths1[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2345.2')
      })
      cy.get(cesc('#' + maths1[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.52343')
      })
      cy.get(cesc('#' + maths1[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.0000')
      })
      cy.get(cesc('#' + maths1[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.2523⋅10−16')
      })
      cy.get(cesc('#' + maths1[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })


      cy.get(cesc('#' + maths2[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2350')
      })
      cy.get(cesc('#' + maths2[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.52')
      })
      cy.get(cesc('#' + maths2[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.00')
      })
      cy.get(cesc('#' + maths2[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.25⋅10−16')
      })
      cy.get(cesc('#' + maths2[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })


      cy.get(cesc('#' + maths3[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2350')
      })
      cy.get(cesc('#' + maths3[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.52')
      })
      cy.get(cesc('#' + maths3[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.00')
      })
      cy.get(cesc('#' + maths3[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.25⋅10−16')
      })
      cy.get(cesc('#' + maths3[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.00')
      })

      cy.get(cesc('#' + maths4[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2350')
      })
      cy.get(cesc('#' + maths4[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.52')
      })
      cy.get(cesc('#' + maths4[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5')
      })
      cy.get(cesc('#' + maths4[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.25⋅10−16')
      })
      cy.get(cesc('#' + maths4[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })

      cy.get(cesc('#' + maths5[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2345.154')
      })
      cy.get(cesc('#' + maths5[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.523')
      })
      cy.get(cesc('#' + maths5[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.000')
      })
      cy.get(cesc('#' + maths5[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })
      cy.get(cesc('#' + maths5[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })

      cy.get(cesc('#' + maths6[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2345.154')
      })
      cy.get(cesc('#' + maths6[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.523')
      })
      cy.get(cesc('#' + maths6[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.000')
      })
      cy.get(cesc('#' + maths6[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.000')
      })
      cy.get(cesc('#' + maths6[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0.000')
      })

      cy.get(cesc('#' + maths7[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2345.154')
      })
      cy.get(cesc('#' + maths7[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.523')
      })
      cy.get(cesc('#' + maths7[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5')
      })
      cy.get(cesc('#' + maths7[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })
      cy.get(cesc('#' + maths7[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })

      cy.get(cesc('#' + maths8[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2350')
      })
      cy.get(cesc('#' + maths8[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.52')
      })
      cy.get(cesc('#' + maths8[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.00')
      })
      cy.get(cesc('#' + maths8[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })
      cy.get(cesc('#' + maths8[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('0')
      })


      cy.get(cesc('#' + maths9[0]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('2350')
      })
      cy.get(cesc('#' + maths9[1]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('3.52')
      })
      cy.get(cesc('#' + maths9[2]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.00')
      })
      cy.get(cesc('#' + maths9[3]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('5.25⋅10−16')
      })
      cy.get(cesc('#' + maths9[4]) + ' .mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq('6⋅10−21')
      })


    })

  })

  it('mathlist and rounding, override number children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><mathlist name="ml1">
      <number name="n11" displayDigits="5">2345.1535268</number>
      <number name="n12" displayDecimals="5">3.52343</number>
      <number name="n13" displayDigits="5" padZeros>5</number>
      <number name="n14">0.00000000000000052523</number>
      <number name="n15" displaySmallAsZero>0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml2" displayDigits="3">
      <number name="n21" displayDigits="5">2345.1535268</number>
      <number name="n22" displayDecimals="5">3.52343</number>
      <number name="n23" displayDigits="5" padZeros>5</number>
      <number name="n24">0.00000000000000052523</number>
      <number name="n25" displaySmallAsZero>0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml3" displayDigits="3" padZeros>
      <number name="n31" displayDigits="5">2345.1535268</number>
      <number name="n32" displayDecimals="5">3.52343</number>
      <number name="n33" displayDigits="5" padZeros>5</number>
      <number name="n34">0.00000000000000052523</number>
      <number name="n35" displaySmallAsZero>0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml4" displayDigits="3" padZeros="false">
      <number name="n41" displayDigits="5">2345.1535268</number>
      <number name="n42" displayDecimals="5">3.52343</number>
      <number name="n43" displayDigits="5" padZeros>5</number>
      <number name="n44">0.00000000000000052523</number>
      <number name="n45" displaySmallAsZero>0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml5" displayDecimals="3">
      <number name="n51" displayDigits="5">2345.1535268</number>
      <number name="n52" displayDecimals="5">3.52343</number>
      <number name="n53" displayDigits="5" padZeros>5</number>
      <number name="n54">0.00000000000000052523</number>
      <number name="n55" displaySmallAsZero>0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml6" displayDecimals="3" padZeros>
      <number name="n61" displayDigits="5">2345.1535268</number>
      <number name="n62" displayDecimals="5">3.52343</number>
      <number name="n63" displayDigits="5" padZeros>5</number>
      <number name="n64">0.00000000000000052523</number>
      <number name="n65" displaySmallAsZero>0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml7" displayDecimals="3" padZeros="false">
      <number name="n71" displayDigits="5">2345.1535268</number>
      <number name="n72" displayDecimals="5">3.52343</number>
      <number name="n73" displayDigits="5" padZeros>5</number>
      <number name="n74">0.00000000000000052523</number>
      <number name="n75" displaySmallAsZero>0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml8" displayDigits="3" displaySmallAsZero>
      <number name="n81" displayDigits="5">2345.1535268</number>
      <number name="n82" displayDecimals="5">3.52343</number>
      <number name="n83" displayDigits="5" padZeros>5</number>
      <number name="n84">0.00000000000000052523</number>
      <number name="n85" displaySmallAsZero>0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml9" displayDigits="3" displaySmallAsZero="false">
      <number name="n91" displayDigits="5">2345.1535268</number>
      <number name="n92" displayDecimals="5">3.52343</number>
      <number name="n93" displayDigits="5" padZeros>5</number>
      <number name="n94">0.00000000000000052523</number>
      <number name="n95" displaySmallAsZero>0.000000000000000000006</number>
    </mathList></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#/n11') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('2345.2')
    })
    cy.get(cesc('#/n12') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('3.52343')
    })
    cy.get(cesc('#/n13') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.0000')
    })
    cy.get(cesc('#/n14') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.2523⋅10−16')
    })
    cy.get(cesc('#/n15') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0')
    })


    cy.get(cesc('#/n21') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('2350')
    })
    cy.get(cesc('#/n22') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('3.52')
    })
    cy.get(cesc('#/n23') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.00')
    })
    cy.get(cesc('#/n24') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.25⋅10−16')
    })
    cy.get(cesc('#/n25') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0')
    })


    cy.get(cesc('#/n31') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('2350')
    })
    cy.get(cesc('#/n32') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('3.52')
    })
    cy.get(cesc('#/n33') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.00')
    })
    cy.get(cesc('#/n34') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.25⋅10−16')
    })
    cy.get(cesc('#/n35') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0.00')
    })

    cy.get(cesc('#/n41') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('2350')
    })
    cy.get(cesc('#/n42') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('3.52')
    })
    cy.get(cesc('#/n43') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5')
    })
    cy.get(cesc('#/n44') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.25⋅10−16')
    })
    cy.get(cesc('#/n45') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0')
    })

    cy.get(cesc('#/n51') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('2345.154')
    })
    cy.get(cesc('#/n52') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('3.523')
    })
    cy.get(cesc('#/n53') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.000')
    })
    cy.get(cesc('#/n54') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0')
    })
    cy.get(cesc('#/n55') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0')
    })

    cy.get(cesc('#/n61') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('2345.154')
    })
    cy.get(cesc('#/n62') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('3.523')
    })
    cy.get(cesc('#/n63') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.000')
    })
    cy.get(cesc('#/n64') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0.000')
    })
    cy.get(cesc('#/n65') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0.000')
    })

    cy.get(cesc('#/n71') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('2345.154')
    })
    cy.get(cesc('#/n72') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('3.523')
    })
    cy.get(cesc('#/n73') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5')
    })
    cy.get(cesc('#/n74') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0')
    })
    cy.get(cesc('#/n75') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0')
    })

    cy.get(cesc('#/n81') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('2350')
    })
    cy.get(cesc('#/n82') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('3.52')
    })
    cy.get(cesc('#/n83') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.00')
    })
    cy.get(cesc('#/n84') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0')
    })
    cy.get(cesc('#/n85') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('0')
    })


    cy.get(cesc('#/n91') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('2350')
    })
    cy.get(cesc('#/n92') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('3.52')
    })
    cy.get(cesc('#/n93') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.00')
    })
    cy.get(cesc('#/n94') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('5.25⋅10−16')
    })
    cy.get(cesc('#/n95') + ' .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('6⋅10−21')
    })


  })


})
