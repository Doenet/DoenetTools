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
    cy.visit('/cypressTest')
  })

  it('mathlist from string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>a 1+1 </mathlist>
    <mathlist simplify="full">a  1+1</mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_mathlist1'].activeChildren[0].componentName;
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_mathlist1'].activeChildren[1].componentName;
      let child2Anchor = cesc('#' + child2Name);
      let child3Name = components['/_mathlist2'].activeChildren[0].componentName;
      let child3Anchor = cesc('#' + child3Name);
      let child4Name = components['/_mathlist2'].activeChildren[1].componentName;
      let child4Anchor = cesc('#' + child4Name);


      cy.log('Test value displayed in browser')
      cy.get(child1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(child2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+1')
      })
      cy.get(child3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(child4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(components['/_mathlist1'].activeChildren[1].stateValues.value.tree).eqls(['+', 1, 1]);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eqls(['+', 1, 1]);
        expect(components['/_mathlist2'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(components['/_mathlist2'].activeChildren[1].stateValues.value.tree).eq(2);
        expect((await components['/_mathlist2'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist2'].stateValues.maths)[1].tree).eq(2);
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
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_mathlist1'].activeChildren[0].componentName;
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_mathlist1'].activeChildren[1].componentName;
      let child2Anchor = cesc('#' + child2Name);
      let child3Name = components['/_mathlist1'].activeChildren[2].componentName;
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
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(components['/_mathlist1'].activeChildren[1].stateValues.value.tree).eq('＿');
        expect(components['/_mathlist1'].activeChildren[2].stateValues.value.tree).eqls(['+', 1, 1]);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq('＿');
        expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eqls(['+', 1, 1]);
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
    <p><aslist><copy prop="xs" target="_point1" /></aslist></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let aslistAnchors = components['/_aslist1'].activeChildren.map(x => cesc('#' + x.componentName))


      cy.log('Test value displayed in browser')
      cy.get(aslistAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x')
      })
      cy.get(aslistAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3y7')
      })
      cy.get(aslistAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get(aslistAnchors[3]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get(aslistAnchors[4]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get(aslistAnchors[5]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−11')
      })
      cy.get(aslistAnchors[6]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get(aslistAnchors[7]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('＿')
      })
      cy.get(aslistAnchors[8]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('11')
      })
      cy.get(aslistAnchors[9]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21xy')
      })
      cy.get(aslistAnchors[10]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+733y')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let xs1 = components["/_point1"].attributes.xs.component;

        expect(xs1.activeChildren.length).eq(11);
        expect(xs1.activeChildren[0].stateValues.value.tree).eq('x');
        expect((await xs1.stateValues.maths)[0].tree).eq('x');
        expect(xs1.activeChildren[1].stateValues.value.tree).eqls(['/', ['*', 3, 'y'], 7]);
        expect((await xs1.stateValues.maths)[1].tree).eqls(['/', ['*', 3, 'y'], 7]);
        expect(xs1.activeChildren[2].stateValues.value.tree).eqls(7);
        expect((await xs1.stateValues.maths)[2].tree).eqls(7);
        expect(xs1.activeChildren[3].stateValues.value.tree).eqls(['+', 7, ['-', 11]]);
        expect((await xs1.stateValues.maths)[3].tree).eqls(['+', 7, ['-', 11]]);
        expect(xs1.activeChildren[4].stateValues.value.tree).eqls(7);
        expect((await xs1.stateValues.maths)[4].tree).eqls(7);
        expect(xs1.activeChildren[5].stateValues.value.tree).eqls(['-', 11]);
        expect((await xs1.stateValues.maths)[5].tree).eqls(['-', 11]);
        expect(xs1.activeChildren[6].stateValues.value.tree).eqls(7);
        expect((await xs1.stateValues.maths)[6].tree).eqls(7);
        expect(xs1.activeChildren[7].stateValues.value.tree).eqls('\uff3f');
        expect((await xs1.stateValues.maths)[7].tree).eqls('\uff3f');
        expect(xs1.activeChildren[8].stateValues.value.tree).eqls(11);
        expect((await xs1.stateValues.maths)[8].tree).eqls(11);
        expect(xs1.activeChildren[9].stateValues.value.tree).eqls(['*', 7, 'x', 3, 'y']);
        expect((await xs1.stateValues.maths)[9].tree).eqls(['*', 7, 'x', 3, 'y']);
        expect(xs1.activeChildren[10].stateValues.value.tree).eqls(['/', ['+', 7, 'x'], ['*', 11, 3, 'y']]);
        expect((await xs1.stateValues.maths)[10].tree).eqls(['/', ['+', 7, 'x'], ['*', 11, 3, 'y']]);

      })
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
      let components = Object.assign({}, win.state.components);

      let math3aAnchor = cesc('#' + components['/_mathlist2'].activeChildren[0].componentName)

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
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].activeChildren.length).eq(2);
        expect(components['/_mathlist1'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(components['/_mathlist1'].activeChildren[1].stateValues.value.tree).eqls(['+', 1, 1]);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eqls(['+', 1, 1]);
        expect(components['/_mathlist2'].activeChildren.length).eq(2);
        expect(components['/_mathlist2'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(components['/_mathlist2'].activeChildren[1].stateValues.value.tree).eqls(['+', 1, 1]);
        expect((await components['/_mathlist2'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist2'].stateValues.maths)[1].tree).eqls(['+', 1, 1]);
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
      let components = Object.assign({}, win.state.components);
      let matha = components["/_mathlist1"].activeChildren[1];
      let mathaAnchor = cesc('#' + matha.componentName);
      let mathb = components["/_mathlist1"].activeChildren[3];
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
        expect(components['/_mathlist1'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(components['/_mathlist1'].activeChildren[1].stateValues.value.tree).eq('q');
        expect(components['/_mathlist1'].activeChildren[2].stateValues.value.tree).eqls(['+', 1, 1]);
        expect(components['/_mathlist1'].activeChildren[3].stateValues.value.tree).eq('h');
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq('q');
        expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eqls(['+', 1, 1]);
        expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eq('h');
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


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let numberAdapterName = components['/_number1'].adapterUsed.componentName;
      let numberAdapterAnchor = cesc('#' + numberAdapterName);
      let numberAdapterName2 = components['/_number2'].adapterUsed.componentName;
      let numberAdapterAnchor2 = cesc('#' + numberAdapterName2);

      cy.log('Test value displayed in browser')
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(numberAdapterAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(numberAdapterAnchor2).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].activeChildren.length).eq(2);
        expect(components['/_mathlist1'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(await components['/_mathlist1'].activeChildren[1].stateValues.number).eq(2);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq(2);
        expect(components['/_mathlist2'].activeChildren.length).eq(2);
        expect(components['/_mathlist2'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(await components['/_mathlist2'].activeChildren[1].stateValues.number).eq(2);
        expect((await components['/_mathlist2'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist2'].stateValues.maths)[1].tree).eq(2);
      })
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
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_mathlist2'].activeChildren[0].componentName;
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_mathlist2'].activeChildren[1].componentName;
      let child2Anchor = cesc('#' + child2Name);
      let child5Name = components['/_mathlist5'].activeChildren[0].componentName;
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = components['/_mathlist5'].activeChildren[1].componentName;
      let child6Anchor = cesc('#' + child6Name);
      let child7Name = components['/_mathlist6'].activeChildren[0].componentName;
      let child7Anchor = cesc('#' + child7Name);
      let child8Name = components['/_mathlist6'].activeChildren[1].componentName;
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
        let components = Object.assign({}, win.state.components);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq('q');
        expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eq('r');
        expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eq('h');
        expect((await components['/_mathlist1'].stateValues.maths)[4].tree).eq('b');
        expect((await components['/_mathlist1'].stateValues.maths)[5].tree).eq('u');
        expect((await components['/_mathlist1'].stateValues.maths)[6].tree).eq('v');
        expect((await components['/_mathlist1'].stateValues.maths)[7].tree).eq('i');
        expect((await components['/_mathlist1'].stateValues.maths)[8].tree).eq('j');
        expect((await components['/_mathlist2'].stateValues.maths)[0].tree).eq('q');
        expect((await components['/_mathlist2'].stateValues.maths)[1].tree).eq('r');
        expect((await components['/_mathlist3'].stateValues.maths)[0].tree).eq('b');
        expect((await components['/_mathlist3'].stateValues.maths)[1].tree).eq('u');
        expect((await components['/_mathlist3'].stateValues.maths)[2].tree).eq('v');
        expect((await components['/_mathlist3'].stateValues.maths)[3].tree).eq('i');
        expect((await components['/_mathlist3'].stateValues.maths)[4].tree).eq('j');
        expect((await components['/_mathlist4'].stateValues.maths)[0].tree).eq('b');
        expect((await components['/_mathlist4'].stateValues.maths)[1].tree).eq('u');
        expect((await components['/_mathlist4'].stateValues.maths)[2].tree).eq('v');
        expect((await components['/_mathlist5'].stateValues.maths)[0].tree).eq('u');
        expect((await components['/_mathlist5'].stateValues.maths)[1].tree).eq('v');
        expect((await components['/_mathlist6'].stateValues.maths)[0].tree).eq('i');
        expect((await components['/_mathlist6'].stateValues.maths)[1].tree).eq('j');
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
        let components = Object.assign({}, win.state.components);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq(1);
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq(2);
        expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eq(3);
        expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eq(4);
        expect((await components['/_mathlist1'].stateValues.maths)[4].tree).eq(5);
        expect((await components['/_mathlist1'].stateValues.maths)[5].tree).eq(6);
        expect((await components['/_mathlist1'].stateValues.maths)[6].tree).eq(7);
        expect((await components['/_mathlist1'].stateValues.maths)[7].tree).eq(8);
        expect((await components['/_mathlist1'].stateValues.maths)[8].tree).eq(9);
        expect((await components['/_mathlist2'].stateValues.maths)[0].tree).eq(2);
        expect((await components['/_mathlist2'].stateValues.maths)[1].tree).eq(3);
        expect((await components['/_mathlist3'].stateValues.maths)[0].tree).eq(5);
        expect((await components['/_mathlist3'].stateValues.maths)[1].tree).eq(6);
        expect((await components['/_mathlist3'].stateValues.maths)[2].tree).eq(7);
        expect((await components['/_mathlist3'].stateValues.maths)[3].tree).eq(8);
        expect((await components['/_mathlist3'].stateValues.maths)[4].tree).eq(9);
        expect((await components['/_mathlist4'].stateValues.maths)[0].tree).eq(5);
        expect((await components['/_mathlist4'].stateValues.maths)[1].tree).eq(6);
        expect((await components['/_mathlist4'].stateValues.maths)[2].tree).eq(7);
        expect((await components['/_mathlist5'].stateValues.maths)[0].tree).eq(6);
        expect((await components['/_mathlist5'].stateValues.maths)[1].tree).eq(7);
        expect((await components['/_mathlist6'].stateValues.maths)[0].tree).eq(8);
        expect((await components['/_mathlist6'].stateValues.maths)[1].tree).eq(9);
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
      let components = Object.assign({}, win.state.components);
      let child0Name = components['/_mathlist1'].activeChildren[0].componentName;
      let child0Anchor = cesc('#' + child0Name);
      let child1Name = components['/_mathlist2'].activeChildren[0].componentName;
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_mathlist2'].activeChildren[1].componentName;
      let child2Anchor = cesc('#' + child2Name);
      let child4Name = components['/_mathlist4'].activeChildren[0].componentName;
      let child4Anchor = cesc('#' + child4Name);
      let child5Name = components['/_mathlist5'].activeChildren[0].componentName;
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = components['/_mathlist5'].activeChildren[1].componentName;
      let child6Anchor = cesc('#' + child6Name);
      let child7Name = components['/_mathlist6'].activeChildren[0].componentName;
      let child7Anchor = cesc('#' + child7Name);
      let child8Name = components['/_mathlist6'].activeChildren[1].componentName;
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
        let components = Object.assign({}, win.state.components);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq('q');
        expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eq('r');
        expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eq('h');
        expect((await components['/_mathlist1'].stateValues.maths)[4].tree).eq('b');
        expect((await components['/_mathlist1'].stateValues.maths)[5].tree).eq('u');
        expect((await components['/_mathlist1'].stateValues.maths)[6].tree).eq('v');
        expect((await components['/_mathlist1'].stateValues.maths)[7].tree).eq('i');
        expect((await components['/_mathlist1'].stateValues.maths)[8].tree).eq('j');
        expect((await components['/_mathlist2'].stateValues.maths)[0].tree).eq('q');
        expect((await components['/_mathlist2'].stateValues.maths)[1].tree).eq('r');
        expect((await components['/_mathlist3'].stateValues.maths)[0].tree).eq('b');
        expect((await components['/_mathlist3'].stateValues.maths)[1].tree).eq('u');
        expect((await components['/_mathlist3'].stateValues.maths)[2].tree).eq('v');
        expect((await components['/_mathlist3'].stateValues.maths)[3].tree).eq('i');
        expect((await components['/_mathlist3'].stateValues.maths)[4].tree).eq('j');
        expect((await components['/_mathlist4'].stateValues.maths)[0].tree).eq('b');
        expect((await components['/_mathlist4'].stateValues.maths)[1].tree).eq('u');
        expect((await components['/_mathlist4'].stateValues.maths)[2].tree).eq('v');
        expect((await components['/_mathlist5'].stateValues.maths)[0].tree).eq('u');
        expect((await components['/_mathlist5'].stateValues.maths)[1].tree).eq('v');
        expect((await components['/_mathlist6'].stateValues.maths)[0].tree).eq('i');
        expect((await components['/_mathlist6'].stateValues.maths)[1].tree).eq('j');
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
        let components = Object.assign({}, win.state.components);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq(1);
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq(2);
        expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eq(3);
        expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eq(4);
        expect((await components['/_mathlist1'].stateValues.maths)[4].tree).eq(5);
        expect((await components['/_mathlist1'].stateValues.maths)[5].tree).eq(6);
        expect((await components['/_mathlist1'].stateValues.maths)[6].tree).eq(7);
        expect((await components['/_mathlist1'].stateValues.maths)[7].tree).eq(8);
        expect((await components['/_mathlist1'].stateValues.maths)[8].tree).eq(9);
        expect((await components['/_mathlist2'].stateValues.maths)[0].tree).eq(2);
        expect((await components['/_mathlist2'].stateValues.maths)[1].tree).eq(3);
        expect((await components['/_mathlist3'].stateValues.maths)[0].tree).eq(5);
        expect((await components['/_mathlist3'].stateValues.maths)[1].tree).eq(6);
        expect((await components['/_mathlist3'].stateValues.maths)[2].tree).eq(7);
        expect((await components['/_mathlist3'].stateValues.maths)[3].tree).eq(8);
        expect((await components['/_mathlist3'].stateValues.maths)[4].tree).eq(9);
        expect((await components['/_mathlist4'].stateValues.maths)[0].tree).eq(5);
        expect((await components['/_mathlist4'].stateValues.maths)[1].tree).eq(6);
        expect((await components['/_mathlist4'].stateValues.maths)[2].tree).eq(7);
        expect((await components['/_mathlist5'].stateValues.maths)[0].tree).eq(6);
        expect((await components['/_mathlist5'].stateValues.maths)[1].tree).eq(7);
        expect((await components['/_mathlist6'].stateValues.maths)[0].tree).eq(8);
        expect((await components['/_mathlist6'].stateValues.maths)[1].tree).eq(9);
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
      <copy prop="math3" target="_mathlist1" assignNames="m4" componentType="math" />
      <mathlist>
        <mathlist name="mid">
          <math><copy prop="math1" target="_mathlist1" componentType="math" /></math>
          <mathlist>u v</mathlist>
        </mathlist>
        <mathlist>
          <copy prop="math2" target="_mathlist1" assignNames="m8" componentType="math" />
          <copy prop="math5" target="_mathlist1" assignNames="m9" componentType="math" />
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
      let components = Object.assign({}, win.state.components);
      let child0Name = "/_math1";
      let ca0 = cesc('#' + child0Name);
      let child1Name = components['/_mathlist2'].activeChildren[0].componentName;
      let ca1 = cesc('#' + child1Name);
      let child2Name = components['/_mathlist2'].activeChildren[1].componentName;
      let ca2 = cesc('#' + child2Name);
      let child3Name = "/m4";
      let ca3 = cesc('#' + child3Name);
      let child4Name = "/_math2";
      let ca4 = cesc('#' + child4Name);
      let child5Name = components['/_mathlist5'].activeChildren[0].componentName;
      let ca5 = cesc('#' + child5Name);
      let child6Name = components['/_mathlist5'].activeChildren[1].componentName;
      let ca6 = cesc('#' + child6Name);
      let child7Name = "/m8";
      let ca7 = cesc('#' + child7Name);
      let child8Name = "/m9";
      let ca8 = cesc('#' + child8Name);
      let child9Name = components['/mid2'].activeChildren[0].componentName;
      let ca9 = cesc('#' + child9Name);
      let child10Name = components['/mid2'].activeChildren[1].activeChildren[0].componentName;
      let ca10 = cesc('#' + child10Name);
      let child11Name = components['/mid2'].activeChildren[1].activeChildren[1].componentName;
      let ca11 = cesc('#' + child11Name);


      let childAnchors = [ca0, ca1, ca2, ca3, ca4, ca5, ca6, ca7, ca8, ca9, ca10, ca11]
      let vals = ["a", "q", "r", "u", "v"]
      let mapping = [0, 1, 2, 2, 0, 3, 4, 1, 0, 0, 3, 4];
      let mv = i => vals[mapping[i]];

      let maths = (await components['/_mathlist1'].stateValues.maths);

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
          expect(maths[i].tree).eq(mv(i));
        }
      })

      cy.log('change values')

      for (let changeInd in mapping) {
        cy.window().then(async (win) => {
          vals[mapping[changeInd]] = Number(changeInd);
          cy.get(mathinputAnchors[changeInd]).type("{end}{backspace}" + changeInd + "{enter}", { force: true });

          cy.log('Test value displayed in browser')

          for (let i in mapping) {
            cy.get(childAnchors[i]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
              expect(text.trim()).equal(String(mv(i)))
            })
          }

          cy.log('Test internal values are set to the correct values')
          cy.window().then(async (win) => {
            for (let i in mapping) {
              expect(maths[i].tree).eq(mv(i));
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
      // let components = Object.assign({}, win.state.components);
      // let child1Name = components['/_mathlist2'].activeChildren[0].componentName;
      // let child1Anchor = cesc('#' + child1Name);
      // let child2Name = components['/_mathlist2'].activeChildren[1].componentName;
      // let child2Anchor = cesc('#' + child2Name);
      // let child5Name = components['/_mathlist5'].activeChildren[0].componentName;
      // let child5Anchor = cesc('#' + child5Name);
      // let child6Name = components['/_mathlist6'].activeChildren[0].componentName;
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
        let components = Object.assign({}, win.state.components);
        expect((await components['/_mathlist1'].stateValues.maths).length).eq(7);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq('q');
        expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eq('r');
        expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eq('h');
        expect((await components['/_mathlist1'].stateValues.maths)[4].tree).eq('b');
        expect((await components['/_mathlist1'].stateValues.maths)[5].tree).eq('u');
        expect((await components['/_mathlist1'].stateValues.maths)[6].tree).eq('i');
        expect((await components['/_mathlist2'].stateValues.maths).length).eq(2);
        expect((await components['/_mathlist2'].stateValues.maths)[0].tree).eq('q');
        expect((await components['/_mathlist2'].stateValues.maths)[1].tree).eq('r');
        expect((await components['/_mathlist3'].stateValues.maths).length).eq(4);
        expect((await components['/_mathlist3'].stateValues.maths)[0].tree).eq('b');
        expect((await components['/_mathlist3'].stateValues.maths)[1].tree).eq('u');
        expect((await components['/_mathlist3'].stateValues.maths)[2].tree).eq('i');
        expect((await components['/_mathlist3'].stateValues.maths)[3].tree).eq('j');
        expect((await components['/_mathlist4'].stateValues.maths).length).eq(2);
        expect((await components['/_mathlist4'].stateValues.maths)[0].tree).eq('b');
        expect((await components['/_mathlist4'].stateValues.maths)[1].tree).eq('u');
        expect((await components['/_mathlist5'].stateValues.maths).length).eq(2);
        expect((await components['/_mathlist5'].stateValues.maths)[0].tree).eq('u');
        expect((await components['/_mathlist5'].stateValues.maths)[1].tree).eq('v');
        expect((await components['/_mathlist6'].stateValues.maths).length).eq(3);
        expect((await components['/_mathlist6'].stateValues.maths)[0].tree).eq('i');
        expect((await components['/_mathlist6'].stateValues.maths)[1].tree).eq('j');
        expect((await components['/_mathlist6'].stateValues.maths)[2].tree).eq('k');
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
        let components = Object.assign({}, win.state.components);
        expect((await components['/ml1'].stateValues.maths).map(x => x.tree)).eqls(['a', 'b', 'c', 'd', 'e']);
        expect((await components['/ml2'].stateValues.maths).map(x => x.tree)).eqls(['a', 'b', 'c']);
        expect((await components['/ml3'].stateValues.maths).map(x => x.tree)).eqls(['a', 'b', 'c', 'd', 'e']);
        expect((await components['/ml4'].stateValues.maths).map(x => x.tree)).eqls(['a', 'b', 'c']);
        expect((await components['/ml5'].stateValues.maths).map(x => x.tree)).eqls(['a', 'b', 'c', 'd']);
        expect((await components['/ml6'].stateValues.maths).map(x => x.tree)).eqls(['a', 'b', 'c', 'd', 'e']);

      })
    })
  })


  it.skip('mathlist ancestor prop simplify', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist simplify="full">
      <math>a+a</math>
      <math simplify="none">b+b</math>
      <math simplify="full">c+c</math>
      <copy target="dd" />
      <copy simplify="none" target="dd" />
      <copy simplify="full" target="dd" />
      <copy target="ee" />
      <copy simplify="none" target="ee" />
      <copy simplify="full" target="ee" />
      <copy target="ff" />
      <copy simplify="none" target="ff" />
      <copy simplify="full" target="ff" />
    </mathlist>
    <p>
      <math name="dd">d+d</math>
      <math name="ee" simplify="none">e+e</math>
      <math name="ff" simplify="full">f+f</math>
    </p>
    <p><textinput bindValueTo="$(_mathlist1{prop='simplify'})"/></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let childNames = components['/_mathlist1'].stateValues.childrenToRender;
      let childAnchors = childNames.map(x => cesc('#' + x));

      cy.log('Test value displayed in browser')
      cy.get(childAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2a')
      })
      cy.get(childAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('b+b')
      })
      cy.get(childAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2c')
      })
      cy.get(childAnchors[3]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2d')
      })
      cy.get(childAnchors[4]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('d+d')
      })
      cy.get(childAnchors[5]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2d')
      })
      cy.get(childAnchors[6]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('e+e')
      })
      cy.get(childAnchors[7]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('e+e')
      })
      cy.get(childAnchors[8]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2e')
      })
      cy.get(childAnchors[9]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2f')
      })
      cy.get(childAnchors[10]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('f+f')
      })
      cy.get(childAnchors[11]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2f')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/_mathlist1'].stateValues.maths).length).eq(12);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eqls(['*', 2, 'a']);
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eqls(['+', 'b', 'b']);
        expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eqls(['*', 2, 'c']);
        expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eqls(['*', 2, 'd']);
        expect((await components['/_mathlist1'].stateValues.maths)[4].tree).eqls(['+', 'd', 'd']);
        expect((await components['/_mathlist1'].stateValues.maths)[5].tree).eqls(['*', 2, 'd']);
        expect((await components['/_mathlist1'].stateValues.maths)[6].tree).eqls(['+', 'e', 'e']);
        expect((await components['/_mathlist1'].stateValues.maths)[7].tree).eqls(['+', 'e', 'e']);
        expect((await components['/_mathlist1'].stateValues.maths)[8].tree).eqls(['*', 2, 'e']);
        expect((await components['/_mathlist1'].stateValues.maths)[9].tree).eqls(['*', 2, 'f']);
        expect((await components['/_mathlist1'].stateValues.maths)[10].tree).eqls(['+', 'f', 'f']);
        expect((await components['/_mathlist1'].stateValues.maths)[11].tree).eqls(['*', 2, 'f']);
        expect(components[childNames[0]].stateValues.simplify).eq('full')
        expect(components[childNames[1]].stateValues.simplify).eq('none')
        expect(components[childNames[2]].stateValues.simplify).eq('full')
        expect(components[childNames[3]].stateValues.simplify).eq('full')
        expect(components[childNames[4]].stateValues.simplify).eq('none')
        expect(components[childNames[5]].stateValues.simplify).eq('full')
        expect(components[childNames[6]].stateValues.simplify).eq('none')
        expect(components[childNames[7]].stateValues.simplify).eq('none')
        expect(components[childNames[8]].stateValues.simplify).eq('full')
        expect(components[childNames[9]].stateValues.simplify).eq('full')
        expect(components[childNames[10]].stateValues.simplify).eq('none')
        expect(components[childNames[11]].stateValues.simplify).eq('full')
      })

      cy.log('change simplify to none')
      cy.get('#\\/_textinput1_input').clear().type(`none{enter}`);


      cy.log('Test value displayed in browser')
      cy.get(childAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a+a')
      })
      cy.get(childAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('b+b')
      })
      cy.get(childAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2c')
      })
      cy.get(childAnchors[3]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('d+d')
      })
      cy.get(childAnchors[4]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('d+d')
      })
      cy.get(childAnchors[5]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2d')
      })
      cy.get(childAnchors[6]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('e+e')
      })
      cy.get(childAnchors[7]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('e+e')
      })
      cy.get(childAnchors[8]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2e')
      })
      cy.get(childAnchors[9]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2f')
      })
      cy.get(childAnchors[10]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('f+f')
      })
      cy.get(childAnchors[11]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2f')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/_mathlist1'].stateValues.maths).length).eq(12);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eqls(['+', 'a', 'a']);
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eqls(['+', 'b', 'b']);
        expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eqls(['*', 2, 'c']);
        expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eqls(['+', 'd', 'd']);
        expect((await components['/_mathlist1'].stateValues.maths)[4].tree).eqls(['+', 'd', 'd']);
        expect((await components['/_mathlist1'].stateValues.maths)[5].tree).eqls(['*', 2, 'd']);
        expect((await components['/_mathlist1'].stateValues.maths)[6].tree).eqls(['+', 'e', 'e']);
        expect((await components['/_mathlist1'].stateValues.maths)[7].tree).eqls(['+', 'e', 'e']);
        expect((await components['/_mathlist1'].stateValues.maths)[8].tree).eqls(['*', 2, 'e']);
        expect((await components['/_mathlist1'].stateValues.maths)[9].tree).eqls(['*', 2, 'f']);
        expect((await components['/_mathlist1'].stateValues.maths)[10].tree).eqls(['+', 'f', 'f']);
        expect((await components['/_mathlist1'].stateValues.maths)[11].tree).eqls(['*', 2, 'f']);
        expect(components[childNames[0]].stateValues.simplify).eq('none')
        expect(components[childNames[1]].stateValues.simplify).eq('none')
        expect(components[childNames[2]].stateValues.simplify).eq('full')
        expect(components[childNames[3]].stateValues.simplify).eq('none')
        expect(components[childNames[4]].stateValues.simplify).eq('none')
        expect(components[childNames[5]].stateValues.simplify).eq('full')
        expect(components[childNames[6]].stateValues.simplify).eq('none')
        expect(components[childNames[7]].stateValues.simplify).eq('none')
        expect(components[childNames[8]].stateValues.simplify).eq('full')
        expect(components[childNames[9]].stateValues.simplify).eq('full')
        expect(components[childNames[10]].stateValues.simplify).eq('none')
        expect(components[childNames[11]].stateValues.simplify).eq('full')
      })



      cy.log('change simplify back to full')
      cy.get('#\\/_textinput1_input').clear().type(`full{enter}`);


      cy.log('Test value displayed in browser')
      cy.get(childAnchors[0]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2a')
      })
      cy.get(childAnchors[1]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('b+b')
      })
      cy.get(childAnchors[2]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2c')
      })
      cy.get(childAnchors[3]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2d')
      })
      cy.get(childAnchors[4]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('d+d')
      })
      cy.get(childAnchors[5]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2d')
      })
      cy.get(childAnchors[6]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('e+e')
      })
      cy.get(childAnchors[7]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('e+e')
      })
      cy.get(childAnchors[8]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2e')
      })
      cy.get(childAnchors[9]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2f')
      })
      cy.get(childAnchors[10]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('f+f')
      })
      cy.get(childAnchors[11]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2f')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/_mathlist1'].stateValues.maths).length).eq(12);
        expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eqls(['*', 2, 'a']);
        expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eqls(['+', 'b', 'b']);
        expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eqls(['*', 2, 'c']);
        expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eqls(['*', 2, 'd']);
        expect((await components['/_mathlist1'].stateValues.maths)[4].tree).eqls(['+', 'd', 'd']);
        expect((await components['/_mathlist1'].stateValues.maths)[5].tree).eqls(['*', 2, 'd']);
        expect((await components['/_mathlist1'].stateValues.maths)[6].tree).eqls(['+', 'e', 'e']);
        expect((await components['/_mathlist1'].stateValues.maths)[7].tree).eqls(['+', 'e', 'e']);
        expect((await components['/_mathlist1'].stateValues.maths)[8].tree).eqls(['*', 2, 'e']);
        expect((await components['/_mathlist1'].stateValues.maths)[9].tree).eqls(['*', 2, 'f']);
        expect((await components['/_mathlist1'].stateValues.maths)[10].tree).eqls(['+', 'f', 'f']);
        expect((await components['/_mathlist1'].stateValues.maths)[11].tree).eqls(['*', 2, 'f']);
        expect(components[childNames[0]].stateValues.simplify).eq('full')
        expect(components[childNames[1]].stateValues.simplify).eq('none')
        expect(components[childNames[2]].stateValues.simplify).eq('full')
        expect(components[childNames[3]].stateValues.simplify).eq('full')
        expect(components[childNames[4]].stateValues.simplify).eq('none')
        expect(components[childNames[5]].stateValues.simplify).eq('full')
        expect(components[childNames[6]].stateValues.simplify).eq('none')
        expect(components[childNames[7]].stateValues.simplify).eq('none')
        expect(components[childNames[8]].stateValues.simplify).eq('full')
        expect(components[childNames[9]].stateValues.simplify).eq('full')
        expect(components[childNames[10]].stateValues.simplify).eq('none')
        expect(components[childNames[11]].stateValues.simplify).eq('full')
      })


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
      let components = Object.assign({}, win.state.components);
      expect((await components['/_mathlist1'].stateValues.maths).length).eq(4);
      expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
      expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eqls(['list', 'b', 'c', 'd']);
      expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eqls(['list', 'e', 'f']);
      expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eq('g');
      expect(components['/_mathlist1'].stateValues.math3.tree).eqls(['list', 'e', 'f']);
      expect(components['/_mathlist1'].stateValues.math5).eq(undefined);

    })

    cy.log('merge math lists')
    cy.get('#\\/_booleaninput1_input').click();

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
      let components = Object.assign({}, win.state.components);
      expect((await components['/_mathlist1'].stateValues.maths).length).eq(7);
      expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
      expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq('b');
      expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eq('c');
      expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eq('d');
      expect((await components['/_mathlist1'].stateValues.maths)[4].tree).eq('e');
      expect((await components['/_mathlist1'].stateValues.maths)[5].tree).eq('f');
      expect((await components['/_mathlist1'].stateValues.maths)[6].tree).eq('g');
      expect(components['/_mathlist1'].stateValues.math3.tree).eq('c');
      expect(components['/_mathlist1'].stateValues.math5.tree).eq('e');

    })


    cy.log('stop merging again')
    cy.get('#\\/_booleaninput1_input').click();

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
      let components = Object.assign({}, win.state.components);
      expect((await components['/_mathlist1'].stateValues.maths).length).eq(4);
      expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
      expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eqls(['list', 'b', 'c', 'd']);
      expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eqls(['list', 'e', 'f']);
      expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eq('g');
      expect(components['/_mathlist1'].stateValues.math3.tree).eqls(['list', 'e', 'f']);
      expect(components['/_mathlist1'].stateValues.math5).eq(undefined);

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
      let components = Object.assign({}, win.state.components);
      expect((await components['/_mathlist1'].stateValues.maths).length).eq(5);
      expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
      expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq('b');
      expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eq('c');
      expect((await components['/_mathlist1'].stateValues.maths)[3].tree).eq('d');
      expect((await components['/_mathlist1'].stateValues.maths)[4].tree).eq('e');
      expect(components['/_mathlist1'].stateValues.math3.tree).eq('c')
      expect(components['/_mathlist1'].stateValues.math5.tree).eq('e');

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
      let components = Object.assign({}, win.state.components);
      let mathlist1a = components["/mathlist1a"].replacements[0];
      let mathlist3 = components["/mathlist3"].replacements[0];
      expect((await components['/_mathlist1'].stateValues.maths).length).eq(3);
      expect((await components['/_mathlist1'].stateValues.maths)[0].tree).eq('a');
      expect((await components['/_mathlist1'].stateValues.maths)[1].tree).eq('b');
      expect((await components['/_mathlist1'].stateValues.maths)[2].tree).eq('c');
      expect((await mathlist1a.stateValues.maths).length).eq(3);
      expect((await mathlist1a.stateValues.maths)[0].tree).eq('a');
      expect((await mathlist1a.stateValues.maths)[1].tree).eq('b');
      expect((await mathlist1a.stateValues.maths)[2].tree).eq('c');
      expect((await components['/_mathlist2'].stateValues.maths).length).eq(8);
      expect((await components['/_mathlist2'].stateValues.maths)[0].tree).eq('x');
      expect((await components['/_mathlist2'].stateValues.maths)[1].tree).eq('a');
      expect((await components['/_mathlist2'].stateValues.maths)[2].tree).eq('b');
      expect((await components['/_mathlist2'].stateValues.maths)[3].tree).eq('c');
      expect((await components['/_mathlist2'].stateValues.maths)[4].tree).eq('y');
      expect((await components['/_mathlist2'].stateValues.maths)[5].tree).eq('a');
      expect((await components['/_mathlist2'].stateValues.maths)[6].tree).eq('b');
      expect((await components['/_mathlist2'].stateValues.maths)[7].tree).eq('c');
      expect((await mathlist3.stateValues.maths).length).eq(6);
      expect((await mathlist3.stateValues.maths)[0].tree).eq('x');
      expect((await mathlist3.stateValues.maths)[1].tree).eq('a');
      expect((await mathlist3.stateValues.maths)[2].tree).eq('b');
      expect((await mathlist3.stateValues.maths)[3].tree).eq('c');
      expect((await mathlist3.stateValues.maths)[4].tree).eq('y');
      expect((await mathlist3.stateValues.maths)[5].tree).eq('a');

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


})
