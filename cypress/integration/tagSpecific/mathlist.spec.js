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
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[1];
      let child2Anchor = cesc('#' + child2Name);
      let child3Name = components['/_mathlist2'].stateValues.childrenToRender[0];
      let child3Anchor = cesc('#' + child3Name);
      let child4Name = components['/_mathlist2'].stateValues.childrenToRender[1];
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
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[1];
      let child2Anchor = cesc('#' + child2Name);
      let child3Name = components['/_mathlist1'].stateValues.childrenToRender[2];
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
      let numberAdapterAnchor = cesc('#' + numberAdapterName);

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
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[1];
      let child2Anchor = cesc('#' + child2Name);

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

  it('mathlist with mathlist children, test inverse', () => {
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

    <mathinput><copy prop="math1" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math2" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math3" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math4" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math5" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math6" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math7" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math8" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math9" tname="_mathlist1" /></mathinput>

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child1Name = components['/_mathlist1'].stateValues.childrenToRender[1];
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[2];
      let child2Anchor = cesc('#' + child2Name);
      let child5Name = components['/_mathlist1'].stateValues.childrenToRender[5];
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = components['/_mathlist1'].stateValues.childrenToRender[6];
      let child6Anchor = cesc('#' + child6Name);
      let child7Name = components['/_mathlist1'].stateValues.childrenToRender[7];
      let child7Anchor = cesc('#' + child7Name);
      let child8Name = components['/_mathlist1'].stateValues.childrenToRender[8];
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

      cy.get("#\\/_mathinput1_input").should('have.value', 'a')
      cy.get("#\\/_mathinput2_input").should('have.value', 'q')
      cy.get("#\\/_mathinput3_input").should('have.value', 'r')
      cy.get("#\\/_mathinput4_input").should('have.value', 'h')
      cy.get("#\\/_mathinput5_input").should('have.value', 'b')
      cy.get("#\\/_mathinput6_input").should('have.value', 'u')
      cy.get("#\\/_mathinput7_input").should('have.value', 'v')
      cy.get("#\\/_mathinput8_input").should('have.value', 'i')
      cy.get("#\\/_mathinput9_input").should('have.value', 'j')

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

      cy.log('change values')

      cy.get("#\\/_mathinput1_input").clear().type("1{enter}")
      cy.get("#\\/_mathinput2_input").clear().type("2{enter}")
      cy.get("#\\/_mathinput3_input").clear().type("3{enter}")
      cy.get("#\\/_mathinput4_input").clear().type("4{enter}")
      cy.get("#\\/_mathinput5_input").clear().type("5{enter}")
      cy.get("#\\/_mathinput6_input").clear().type("6{enter}")
      cy.get("#\\/_mathinput7_input").clear().type("7{enter}")
      cy.get("#\\/_mathinput8_input").clear().type("8{enter}")
      cy.get("#\\/_mathinput9_input").clear().type("9{enter}")


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

      cy.get("#\\/_mathinput1_input").should('have.value', '1')
      cy.get("#\\/_mathinput2_input").should('have.value', '2')
      cy.get("#\\/_mathinput3_input").should('have.value', '3')
      cy.get("#\\/_mathinput4_input").should('have.value', '4')
      cy.get("#\\/_mathinput5_input").should('have.value', '5')
      cy.get("#\\/_mathinput6_input").should('have.value', '6')
      cy.get("#\\/_mathinput7_input").should('have.value', '7')
      cy.get("#\\/_mathinput8_input").should('have.value', '8')
      cy.get("#\\/_mathinput9_input").should('have.value', '9')

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eq(1);
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eq(2);
        expect(components['/_mathlist1'].stateValues.maths[2].tree).eq(3);
        expect(components['/_mathlist1'].stateValues.maths[3].tree).eq(4);
        expect(components['/_mathlist1'].stateValues.maths[4].tree).eq(5);
        expect(components['/_mathlist1'].stateValues.maths[5].tree).eq(6);
        expect(components['/_mathlist1'].stateValues.maths[6].tree).eq(7);
        expect(components['/_mathlist1'].stateValues.maths[7].tree).eq(8);
        expect(components['/_mathlist1'].stateValues.maths[8].tree).eq(9);
        expect(components['/_mathlist2'].stateValues.maths[0].tree).eq(2);
        expect(components['/_mathlist2'].stateValues.maths[1].tree).eq(3);
        expect(components['/_mathlist3'].stateValues.maths[0].tree).eq(5);
        expect(components['/_mathlist3'].stateValues.maths[1].tree).eq(6);
        expect(components['/_mathlist3'].stateValues.maths[2].tree).eq(7);
        expect(components['/_mathlist3'].stateValues.maths[3].tree).eq(8);
        expect(components['/_mathlist3'].stateValues.maths[4].tree).eq(9);
        expect(components['/_mathlist4'].stateValues.maths[0].tree).eq(5);
        expect(components['/_mathlist4'].stateValues.maths[1].tree).eq(6);
        expect(components['/_mathlist4'].stateValues.maths[2].tree).eq(7);
        expect(components['/_mathlist5'].stateValues.maths[0].tree).eq(6);
        expect(components['/_mathlist5'].stateValues.maths[1].tree).eq(7);
        expect(components['/_mathlist6'].stateValues.maths[0].tree).eq(8);
        expect(components['/_mathlist6'].stateValues.maths[1].tree).eq(9);
      })


    })
  })

  it('mathlist with self references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <mathlist>q,r</mathlist>
      <copy prop="math3" tname="_mathlist1" />
      <mathlist>
        <mathlist name="mid">
          <math><copy prop="math1" tname="_mathlist1"/></math>
          <mathlist>u,v</mathlist>
        </mathlist>
        <mathlist>
          <copy prop="math2" tname="_mathlist1"/>
          <copy prop="math5" tname="_mathlist1"/>
        </mathlist>
      </mathlist>
      <copy tname="mid" />
    </mathlist>

    <mathinput><copy prop="math1" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math2" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math3" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math4" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math5" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math6" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math7" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math8" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math9" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math10" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math11" tname="_mathlist1" /></mathinput>
    <mathinput><copy prop="math12" tname="_mathlist1" /></mathinput>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let child0Name = components['/_mathlist1'].stateValues.childrenToRender[0];
      let ca0 = cesc('#' + child0Name);
      let child1Name = components['/_mathlist1'].stateValues.childrenToRender[1];
      let ca1 = cesc('#' + child1Name);
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[2];
      let ca2 = cesc('#' + child2Name);
      let child3Name = components['/_mathlist1'].stateValues.childrenToRender[3];
      let ca3 = cesc('#' + child3Name);
      let child4Name = components['/_mathlist1'].stateValues.childrenToRender[4];
      let ca4 = cesc('#' + child4Name);
      let child5Name = components['/_mathlist1'].stateValues.childrenToRender[5];
      let ca5 = cesc('#' + child5Name);
      let child6Name = components['/_mathlist1'].stateValues.childrenToRender[6];
      let ca6 = cesc('#' + child6Name);
      let child7Name = components['/_mathlist1'].stateValues.childrenToRender[7];
      let ca7 = cesc('#' + child7Name);
      let child8Name = components['/_mathlist1'].stateValues.childrenToRender[8];
      let ca8 = cesc('#' + child8Name);
      let child9Name = components['/_mathlist1'].stateValues.childrenToRender[9];
      let ca9 = cesc('#' + child9Name);
      let child10Name = components['/_mathlist1'].stateValues.childrenToRender[10];
      let ca10 = cesc('#' + child10Name);
      let child11Name = components['/_mathlist1'].stateValues.childrenToRender[11];
      let ca11 = cesc('#' + child11Name);


      let childAnchors = [ca0, ca1, ca2, ca3, ca4, ca5, ca6, ca7, ca8, ca9, ca10, ca11]
      let vals = ["a", "q", "r", "u", "v"]
      let mapping = [0, 1, 2, 2, 0, 3, 4, 1, 0, 0, 3, 4];
      let mv = i => vals[mapping[i]];

      let maths = components['/_mathlist1'].stateValues.maths;

      let mathinputAnchors = []
      for (let i in mapping) {
        mathinputAnchors.push(`#\\/_mathinput${Number(i) + 1}_input`)

      }

      cy.log('Test value displayed in browser')

      for (let i in mapping) {
        cy.get(childAnchors[i]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(mv(i))
        })
        cy.get(mathinputAnchors[i]).should('have.value', mv(i))
      }

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        for (let i in mapping) {
          expect(maths[i].tree).eq(mv(i));
        }
      })

      cy.log('change values')

      for (let changeInd in mapping) {
        cy.window().then((win) => {
          vals[mapping[changeInd]] = Number(changeInd);
          cy.get(mathinputAnchors[changeInd]).clear().type(changeInd + "{enter}");

          cy.log('Test value displayed in browser')

          for (let i in mapping) {
            cy.get(childAnchors[i]).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
              expect(text.trim()).equal(String(mv(i)))
            })
            cy.get(mathinputAnchors[i]).should('have.value', String(mv(i)))
          }

          cy.log('Test internal values are set to the correct values')
          cy.window().then((win) => {
            for (let i in mapping) {
              expect(maths[i].tree).eq(mv(i));
            }
          })


        })

      }


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
      let child1Anchor = cesc('#' + child1Name);
      let child2Name = components['/_mathlist1'].stateValues.childrenToRender[2];
      let child2Anchor = cesc('#' + child2Name);
      let child5Name = components['/_mathlist1'].stateValues.childrenToRender[5];
      let child5Anchor = cesc('#' + child5Name);
      let child6Name = components['/_mathlist1'].stateValues.childrenToRender[6];
      let child6Anchor = cesc('#' + child6Name);

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
      let childAnchors = childNames.map(x => '#' + x);

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
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eqls(['*', 2, 'a']);
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['+', 'b', 'b']);
        expect(components['/_mathlist1'].stateValues.maths[2].tree).eqls(['*', 2, 'c']);
        expect(components['/_mathlist1'].stateValues.maths[3].tree).eqls(['*', 2, 'd']);
        expect(components['/_mathlist1'].stateValues.maths[4].tree).eqls(['+', 'd', 'd']);
        expect(components['/_mathlist1'].stateValues.maths[5].tree).eqls(['*', 2, 'd']);
        expect(components['/_mathlist1'].stateValues.maths[6].tree).eqls(['+', 'e', 'e']);
        expect(components['/_mathlist1'].stateValues.maths[7].tree).eqls(['+', 'e', 'e']);
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
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eqls(['+', 'a', 'a']);
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['+', 'b', 'b']);
        expect(components['/_mathlist1'].stateValues.maths[2].tree).eqls(['*', 2, 'c']);
        expect(components['/_mathlist1'].stateValues.maths[3].tree).eqls(['+', 'd', 'd']);
        expect(components['/_mathlist1'].stateValues.maths[4].tree).eqls(['+', 'd', 'd']);
        expect(components['/_mathlist1'].stateValues.maths[5].tree).eqls(['*', 2, 'd']);
        expect(components['/_mathlist1'].stateValues.maths[6].tree).eqls(['+', 'e', 'e']);
        expect(components['/_mathlist1'].stateValues.maths[7].tree).eqls(['+', 'e', 'e']);
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
        expect(components['/_mathlist1'].stateValues.maths[0].tree).eqls(['*', 2, 'a']);
        expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['+', 'b', 'b']);
        expect(components['/_mathlist1'].stateValues.maths[2].tree).eqls(['*', 2, 'c']);
        expect(components['/_mathlist1'].stateValues.maths[3].tree).eqls(['*', 2, 'd']);
        expect(components['/_mathlist1'].stateValues.maths[4].tree).eqls(['+', 'd', 'd']);
        expect(components['/_mathlist1'].stateValues.maths[5].tree).eqls(['*', 2, 'd']);
        expect(components['/_mathlist1'].stateValues.maths[6].tree).eqls(['+', 'e', 'e']);
        expect(components['/_mathlist1'].stateValues.maths[7].tree).eqls(['+', 'e', 'e']);
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

  it('mathlist with merge math list', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathlist>
      <mergeMathLists><copy prop="value" tname="_booleaninput1" /></mergeMathLists>
      <math>a</math>
      <math>b,c,d</math>
      <math>e,f</math>
      <math>g</math>
    </mathlist>
    <p>Merge math lists: <booleaninput /></p>

    <p>Third math: <copy prop="math3" tname="_mathlist1" /></p>
    <p>Fifth math: <copy prop="math5" tname="_mathlist1" /></p>
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
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathlist1'].stateValues.maths.length).eq(4);
      expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['list', 'b', 'c', 'd']);
      expect(components['/_mathlist1'].stateValues.maths[2].tree).eqls(['list', 'e', 'f']);
      expect(components['/_mathlist1'].stateValues.maths[3].tree).eq('g');
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
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathlist1'].stateValues.maths.length).eq(7);
      expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].stateValues.maths[1].tree).eq('b');
      expect(components['/_mathlist1'].stateValues.maths[2].tree).eq('c');
      expect(components['/_mathlist1'].stateValues.maths[3].tree).eq('d');
      expect(components['/_mathlist1'].stateValues.maths[4].tree).eq('e');
      expect(components['/_mathlist1'].stateValues.maths[5].tree).eq('f');
      expect(components['/_mathlist1'].stateValues.maths[6].tree).eq('g');
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
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathlist1'].stateValues.maths.length).eq(4);
      expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].stateValues.maths[1].tree).eqls(['list', 'b', 'c', 'd']);
      expect(components['/_mathlist1'].stateValues.maths[2].tree).eqls(['list', 'e', 'f']);
      expect(components['/_mathlist1'].stateValues.maths[3].tree).eq('g');
      expect(components['/_mathlist1'].stateValues.math3.tree).eqls(['list', 'e', 'f']);
      expect(components['/_mathlist1'].stateValues.math5).eq(undefined);

    })

  })

  it('mathlist within mathlists, ignore child hide', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><mathlist hide="true">a,b,c</mathlist></p>

    <p><copy name="mathlist1a" hide="false" tname="_mathlist1" /></p>

    <p><mathlist>
      <math>x</math>
      <copy tname="_mathlist1" />
      <math hide>y</math>
      <copy tname="mathlist1a" />
    </mathlist></p>

    <p><copy name="mathlist3" maximumnumber="6" tname="_mathlist2" /></p>

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
      expect(text.trim()).equal('y')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(7).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    });
    cy.get('#\\/_p3').find('.mjx-mrow').eq(8).should('not.exist')

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
      expect(text.trim()).equal('y')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });
    cy.get('#\\/_p4').find('.mjx-mrow').eq(6).should('not.exist');


    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathlist1a = components["/mathlist1a"].replacements[0];
      let mathlist3 = components["/mathlist3"].replacements[0];
      expect(components['/_mathlist1'].stateValues.maths.length).eq(3);
      expect(components['/_mathlist1'].stateValues.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].stateValues.maths[1].tree).eq('b');
      expect(components['/_mathlist1'].stateValues.maths[2].tree).eq('c');
      expect(mathlist1a.stateValues.maths.length).eq(3);
      expect(mathlist1a.stateValues.maths[0].tree).eq('a');
      expect(mathlist1a.stateValues.maths[1].tree).eq('b');
      expect(mathlist1a.stateValues.maths[2].tree).eq('c');
      expect(components['/_mathlist2'].stateValues.maths.length).eq(8);
      expect(components['/_mathlist2'].stateValues.maths[0].tree).eq('x');
      expect(components['/_mathlist2'].stateValues.maths[1].tree).eq('a');
      expect(components['/_mathlist2'].stateValues.maths[2].tree).eq('b');
      expect(components['/_mathlist2'].stateValues.maths[3].tree).eq('c');
      expect(components['/_mathlist2'].stateValues.maths[4].tree).eq('y');
      expect(components['/_mathlist2'].stateValues.maths[5].tree).eq('a');
      expect(components['/_mathlist2'].stateValues.maths[6].tree).eq('b');
      expect(components['/_mathlist2'].stateValues.maths[7].tree).eq('c');
      expect(mathlist3.stateValues.maths.length).eq(6);
      expect(mathlist3.stateValues.maths[0].tree).eq('x');
      expect(mathlist3.stateValues.maths[1].tree).eq('a');
      expect(mathlist3.stateValues.maths[2].tree).eq('b');
      expect(mathlist3.stateValues.maths[3].tree).eq('c');
      expect(mathlist3.stateValues.maths[4].tree).eq('y');
      expect(mathlist3.stateValues.maths[5].tree).eq('a');

    })

  })


})
