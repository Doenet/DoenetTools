import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Mathlist Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('mathlist from string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>a,1+1,</mathlist>
    <mathlist simplify="full">a,1+1,</mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_mathlist1'].stateValues.childrenToRender[0];
      let child1Anchor = '#' + child1Name;
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[1];
      let child2Anchor = '#' + child2Name;
      let child3Name = components['/_mathlist2'].stateValues.childrenToRender[0];
      let child3Anchor = '#' + child3Name;
      let child4Name = components['/_mathlist2'].stateValues.childrenToRender[1];
      let child4Anchor = '#' + child4Name;


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
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(components['/_mathlist1'].activeChildren[1].stateValues.value.tree).eqls(['+', 1, 1]);
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['+', 1, 1]);
        expect(components['/_mathlist2'].activeChildren[1].stateValues.value.tree).eq('a');
        expect(components['/_mathlist2'].activeChildren[2].stateValues.value.tree).eq(2);
        expect(components['/_mathlist2'].stateValues.maths[0].tree).eq('a');
        expect(components['/_mathlist2'].stateValues.maths[1].tree).eq(2);
      })
    })
  })

  it('mathlist with error in string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>a,(, 1+1,</mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_mathlist1'].stateValues.childrenToRender[0];
      let child1Anchor = '#' + child1Name;
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[1];
      let child2Anchor = '#' + child2Name;
      let child3Name = components['/_mathlist1'].stateValues.childrenToRender[2];
      let child3Anchor = '#' + child3Name;

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
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(components['/_mathlist1'].activeChildren[1].stateValues.value.tree).eq('＿');
        expect(components['/_mathlist1'].activeChildren[2].stateValues.value.tree).eqls(['+', 1, 1]);
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eq('＿');
        expect(components['/_mathlist1'].stateValues.maths[2].tree).eqls(['+', 1, 1]);
      })
    })
  })

  it('mathlist with math children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <math>1+1</math>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+1')
    })
    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathlist1'].activeChildren[0].stateValues.value.tree).eq('a');
      expect(components['/_mathlist1'].activeChildren[1].stateValues.value.tree).eqls(['+', 1, 1]);
      expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['+', 1, 1]);
    })
  })

  it('mathlist with math and number children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <number>1+1</number>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let numberAdapterName = components['/_number1'].adapterUsed.componentName;
      let numberAdapterAnchor = '#' + numberAdapterName;

      cy.log('Test value displayed in browser')
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(numberAdapterAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(components['/_mathlist1'].activeChildren[1].stateValues.number).eq(2);
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eq(2);
      })
    })
  })

  it('mathlist originally gets blank string children from group', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <group>
        <math>a</math>
        <math>1+1</math>
      </group>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_mathlist1'].stateValues.childrenToRender[0];
      let child1Anchor = '#' + child1Name;
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[1];
      let child2Anchor = '#' + child2Name;

      cy.log('Test value displayed in browser')
      cy.get(child1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a')
      })
      cy.get(child2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+1')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].activeChildren[0].stateValues.value.tree).eq('a');
        expect(components['/_mathlist1'].activeChildren[1].stateValues.value.tree).eqls(['+', 1, 1]);
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['+', 1, 1]);
      })
    })
  })

  it('mathlist with mathlist children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <mathlist>q,r</mathlist>
      <math>h</math>
      <mathlist>
        <mathlist>
          <math>b</math>
          <mathlist>u,v</mathlist>
        </mathlist>
        <mathlist>i,j</mathlist>
      </mathlist>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_mathlist1'].stateValues.childrenToRender[1];
      let child1Anchor = '#' + child1Name;
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[2];
      let child2Anchor = '#' + child2Name;
      let child5Name = components['/_mathlist1'].stateValues.childrenToRender[5];
      let child5Anchor = '#' + child5Name;
      let child6Name = components['/_mathlist1'].stateValues.childrenToRender[6];
      let child6Anchor = '#' + child6Name;
      let child7Name = components['/_mathlist1'].stateValues.childrenToRender[7];
      let child7Anchor = '#' + child7Name;
      let child8Name = components['/_mathlist1'].stateValues.childrenToRender[8];
      let child8Anchor = '#' + child8Name;

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
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eq('q');
        expect(components['/_mathlist1'].stateValues.maths[2].tree).eq('r');
        expect(components['/_mathlist1'].stateValues.maths[3].tree).eq('h');
        expect(components['/_mathlist1'].stateValues.maths[4].tree).eq('b');
        expect(components['/_mathlist1'].stateValues.maths[5].tree).eq('u');
        expect(components['/_mathlist1'].stateValues.maths[6].tree).eq('v');
        expect(components['/_mathlist1'].stateValues.maths[7].tree).eq('i');
        expect(components['/_mathlist1'].stateValues.maths[8].tree).eq('j');
        expect(components['/_mathlist2'].stateValues.maths[0].tree).eq('q');
        expect(components['/_mathlist2'].stateValues.maths[1].tree).eq('r');
        expect(components['/_mathlist3'].stateValues.maths[0].tree).eq('b');
        expect(components['/_mathlist3'].stateValues.maths[1].tree).eq('u');
        expect(components['/_mathlist3'].stateValues.maths[2].tree).eq('v');
        expect(components['/_mathlist3'].stateValues.maths[3].tree).eq('i');
        expect(components['/_mathlist3'].stateValues.maths[4].tree).eq('j');
        expect(components['/_mathlist4'].stateValues.maths[0].tree).eq('b');
        expect(components['/_mathlist4'].stateValues.maths[1].tree).eq('u');
        expect(components['/_mathlist4'].stateValues.maths[2].tree).eq('v');
        expect(components['/_mathlist5'].stateValues.maths[0].tree).eq('u');
        expect(components['/_mathlist5'].stateValues.maths[1].tree).eq('v');
        expect(components['/_mathlist6'].stateValues.maths[0].tree).eq('i');
        expect(components['/_mathlist6'].stateValues.maths[1].tree).eq('j');
      })
    })
  })

  it('mathlist with maximum number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist maximumnumber="7">
      <math>a</math>
      <mathlist maximumnumber="2">q,r,l,k</mathlist>
      <math>h</math>
      <mathlist maximumnumber="4">
        <mathlist maximumnumber="2">
          <math>b</math>
          <mathlist>u,v</mathlist>
        </mathlist>
        <mathlist>i,j,k</mathlist>
      </mathlist>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_mathlist1'].stateValues.childrenToRender[1];
      let child1Anchor = '#' + child1Name;
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[2];
      let child2Anchor = '#' + child2Name;
      let child5Name = components['/_mathlist1'].stateValues.childrenToRender[5];
      let child5Anchor = '#' + child5Name;
      let child6Name = components['/_mathlist1'].stateValues.childrenToRender[6];
      let child6Anchor = '#' + child6Name;

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
        expect(text.trim()).equal('i')
      })
      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].stateValues.maths.length).eq(7);
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eq('q');
        expect(components['/_mathlist1'].stateValues.maths[2].tree).eq('r');
        expect(components['/_mathlist1'].stateValues.maths[3].tree).eq('h');
        expect(components['/_mathlist1'].stateValues.maths[4].tree).eq('b');
        expect(components['/_mathlist1'].stateValues.maths[5].tree).eq('u');
        expect(components['/_mathlist1'].stateValues.maths[6].tree).eq('i');
        expect(components['/_mathlist2'].stateValues.maths.length).eq(2);
        expect(components['/_mathlist2'].stateValues.maths[0].tree).eq('q');
        expect(components['/_mathlist2'].stateValues.maths[1].tree).eq('r');
        expect(components['/_mathlist3'].stateValues.maths.length).eq(4);
        expect(components['/_mathlist3'].stateValues.maths[0].tree).eq('b');
        expect(components['/_mathlist3'].stateValues.maths[1].tree).eq('u');
        expect(components['/_mathlist3'].stateValues.maths[2].tree).eq('i');
        expect(components['/_mathlist3'].stateValues.maths[3].tree).eq('j');
        expect(components['/_mathlist4'].stateValues.maths.length).eq(2);
        expect(components['/_mathlist4'].stateValues.maths[0].tree).eq('b');
        expect(components['/_mathlist4'].stateValues.maths[1].tree).eq('u');
        expect(components['/_mathlist5'].stateValues.maths.length).eq(2);
        expect(components['/_mathlist5'].stateValues.maths[0].tree).eq('u');
        expect(components['/_mathlist5'].stateValues.maths[1].tree).eq('v');
        expect(components['/_mathlist6'].stateValues.maths.length).eq(3);
        expect(components['/_mathlist6'].stateValues.maths[0].tree).eq('i');
        expect(components['/_mathlist6'].stateValues.maths[1].tree).eq('j');
        expect(components['/_mathlist6'].stateValues.maths[2].tree).eq('k');
      })
    })
  })


  it('mathlist ancestor prop simplify', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist simplify="full">
      <math>a+a</math>
      <math simplify="none">b+b</math>
      <math simplify="full">c+c</math>
      <copy tname="dd" />
      <copy simplify="none" tname="dd" />
      <copy simplify="full" tname="dd" />
      <copy tname="ee" />
      <copy simplify="none" tname="ee" />
      <copy simplify="full" tname="ee" />
      <copy tname="ff" />
      <copy simplify="none" tname="ff" />
      <copy simplify="full" tname="ff" />
    </mathlist>
    <p>
      <math name="dd">d+d</math>
      <math name="ee" simplify="none">e+e</math>
      <math name="ff" simplify="full">f+f</math>
    </p>
    <p><textinput><copy prop="simplify" tname="_mathlist1" /></textinput></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
    
      let childNames = components['/_mathlist1'].stateValues.childrenToRender;
      let childAnchors = childNames.map(x=> '#' + x);

      cy.log('Test value displayed in browser')
      cy.get(cesc(childAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2a')
      })
      cy.get(cesc(childAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('b+b')
      })
      cy.get(cesc(childAnchors[2])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].stateValues.maths.length).eq(12);
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eqls(['*',2, 'a']);
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['+','b','b']);
        expect(components['/_mathlist1'].stateValues.maths[2].tree).eqls(['*', 2, 'c']);
        expect(components['/_mathlist1'].stateValues.maths[3].tree).eqls(['*', 2, 'd']);
        expect(components['/_mathlist1'].stateValues.maths[4].tree).eqls(['+','d','d']);
        expect(components['/_mathlist1'].stateValues.maths[5].tree).eqls(['*', 2, 'd']);
        expect(components['/_mathlist1'].stateValues.maths[6].tree).eqls(['+','e','e']);
        expect(components['/_mathlist1'].stateValues.maths[7].tree).eqls(['+','e','e']);
        expect(components['/_mathlist1'].stateValues.maths[8].tree).eqls(['*', 2, 'e']);
        expect(components['/_mathlist1'].stateValues.maths[9].tree).eqls(['*', 2, 'f']);
        expect(components['/_mathlist1'].stateValues.maths[10].tree).eqls(['+', 'f', 'f']);
        expect(components['/_mathlist1'].stateValues.maths[11].tree).eqls(['*', 2, 'f']);
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
      cy.get(cesc(childAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('a+a')
      })
      cy.get(cesc(childAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('b+b')
      })
      cy.get(cesc(childAnchors[2])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].stateValues.maths.length).eq(12);
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eqls(['+','a', 'a']);
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['+','b','b']);
        expect(components['/_mathlist1'].stateValues.maths[2].tree).eqls(['*', 2, 'c']);
        expect(components['/_mathlist1'].stateValues.maths[3].tree).eqls(['+', 'd', 'd']);
        expect(components['/_mathlist1'].stateValues.maths[4].tree).eqls(['+','d','d']);
        expect(components['/_mathlist1'].stateValues.maths[5].tree).eqls(['*', 2, 'd']);
        expect(components['/_mathlist1'].stateValues.maths[6].tree).eqls(['+','e','e']);
        expect(components['/_mathlist1'].stateValues.maths[7].tree).eqls(['+','e','e']);
        expect(components['/_mathlist1'].stateValues.maths[8].tree).eqls(['*', 2, 'e']);
        expect(components['/_mathlist1'].stateValues.maths[9].tree).eqls(['*', 2, 'f']);
        expect(components['/_mathlist1'].stateValues.maths[10].tree).eqls(['+', 'f', 'f']);
        expect(components['/_mathlist1'].stateValues.maths[11].tree).eqls(['*', 2, 'f']);
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
      cy.get(cesc(childAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2a')
      })
      cy.get(cesc(childAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('b+b')
      })
      cy.get(cesc(childAnchors[2])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].stateValues.maths.length).eq(12);
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eqls(['*',2, 'a']);
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['+','b','b']);
        expect(components['/_mathlist1'].stateValues.maths[2].tree).eqls(['*', 2, 'c']);
        expect(components['/_mathlist1'].stateValues.maths[3].tree).eqls(['*', 2, 'd']);
        expect(components['/_mathlist1'].stateValues.maths[4].tree).eqls(['+','d','d']);
        expect(components['/_mathlist1'].stateValues.maths[5].tree).eqls(['*', 2, 'd']);
        expect(components['/_mathlist1'].stateValues.maths[6].tree).eqls(['+','e','e']);
        expect(components['/_mathlist1'].stateValues.maths[7].tree).eqls(['+','e','e']);
        expect(components['/_mathlist1'].stateValues.maths[8].tree).eqls(['*', 2, 'e']);
        expect(components['/_mathlist1'].stateValues.maths[9].tree).eqls(['*', 2, 'f']);
        expect(components['/_mathlist1'].stateValues.maths[10].tree).eqls(['+', 'f', 'f']);
        expect(components['/_mathlist1'].stateValues.maths[11].tree).eqls(['*', 2, 'f']);
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


})
