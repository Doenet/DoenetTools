describe('Mathlist Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('mathlist from string', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetCode: `
    <text>a</text>
    <mathlist>a,1+1,</mathlist>
    <mathlist simplify="full">a,1+1,</mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text','a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+1')
    })
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathlist1'].activeChildren[0].state.value.tree).eq('a');
      expect(components['/_mathlist1'].activeChildren[1].state.value.tree).eqls(['+',1,1]);
      expect(components['/_mathlist1'].state.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].state.maths[1].tree).eqls(['+',1,1]);
      expect(components['/_mathlist2'].activeChildren[1].state.value.tree).eq('a');
      expect(components['/_mathlist2'].activeChildren[2].state.value.tree).eq(2);
      expect(components['/_mathlist2'].state.maths[0].tree).eq('a');
      expect(components['/_mathlist2'].state.maths[1].tree).eq(2);
   })
  })

  it('mathlist with error in string', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetCode: `
    <text>a</text>
    <mathlist>a,(, 1+1,</mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text','a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+1')
    })
    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathlist1'].activeChildren[0].state.value.tree).eq('a');
      expect(components['/_mathlist1'].activeChildren[1].state.value.tree).eq('＿');
      expect(components['/_mathlist1'].activeChildren[2].state.value.tree).eqls(['+',1,1]);
      expect(components['/_mathlist1'].state.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].state.maths[1].tree).eq('＿');
      expect(components['/_mathlist1'].state.maths[2].tree).eqls(['+',1,1]);
   })
  })

  it('mathlist with math children', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetCode: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <math>1+1</math>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text','a');  // to wait until loaded

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
      expect(components['/_mathlist1'].activeChildren[0].state.value.tree).eq('a');
      expect(components['/_mathlist1'].activeChildren[1].state.value.tree).eqls(['+',1,1]);
      expect(components['/_mathlist1'].state.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].state.maths[1].tree).eqls(['+',1,1]);
   })
  })

  it('mathlist with math and number children', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetCode: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <number>1+1</number>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text','a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#\\/_number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathlist1'].activeChildren[0].state.value.tree).eq('a');
      expect(components['/_mathlist1'].activeChildren[1].state.number).eq(2);
      expect(components['/_mathlist1'].state.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].state.maths[1].tree).eq(2);
   })
  })

  it('mathlist originally gets blank string children from group', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetCode: `
    <text>a</text>
    <mathlist>
      <group>
        <math>a</math>
        <math>1+1</math>
      </group>
    </mathlist>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text','a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+1')
    })
    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathlist1'].activeChildren[0].state.value.tree).eq('a');
      expect(components['/_mathlist1'].activeChildren[1].state.value.tree).eqls(['+',1,1]);
      expect(components['/_mathlist1'].state.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].state.maths[1].tree).eqls(['+',1,1]);
    })
  })

  it('mathlist with mathlist children', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetCode: `
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

    cy.get('#\\/_text1').should('have.text','a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathlist1'].state.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].state.maths[1].tree).eq('q');
      expect(components['/_mathlist1'].state.maths[2].tree).eq('r');
      expect(components['/_mathlist1'].state.maths[3].tree).eq('h');
      expect(components['/_mathlist1'].state.maths[4].tree).eq('b');
      expect(components['/_mathlist1'].state.maths[5].tree).eq('u');
      expect(components['/_mathlist1'].state.maths[6].tree).eq('v');
      expect(components['/_mathlist1'].state.maths[7].tree).eq('i');
      expect(components['/_mathlist1'].state.maths[8].tree).eq('j');
      expect(components['/_mathlist2'].state.maths[0].tree).eq('q');
      expect(components['/_mathlist2'].state.maths[1].tree).eq('r');
      expect(components['/_mathlist3'].state.maths[0].tree).eq('b');
      expect(components['/_mathlist3'].state.maths[1].tree).eq('u');
      expect(components['/_mathlist3'].state.maths[2].tree).eq('v');
      expect(components['/_mathlist3'].state.maths[3].tree).eq('i');
      expect(components['/_mathlist3'].state.maths[4].tree).eq('j');
      expect(components['/_mathlist4'].state.maths[0].tree).eq('b');
      expect(components['/_mathlist4'].state.maths[1].tree).eq('u');
      expect(components['/_mathlist4'].state.maths[2].tree).eq('v');
      expect(components['/_mathlist5'].state.maths[0].tree).eq('u');
      expect(components['/_mathlist5'].state.maths[1].tree).eq('v');
      expect(components['/_mathlist6'].state.maths[0].tree).eq('i');
      expect(components['/_mathlist6'].state.maths[1].tree).eq('j');
    })
  })

  it('mathlist with maximum number', () => {
    cy.window().then((win) => {
      win.postMessage({ doenetCode: `
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

    cy.get('#\\/_text1').should('have.text','a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathlist1'].state.maths.length).eq(7);
      expect(components['/_mathlist1'].state.maths[0].tree).eq('a');
      expect(components['/_mathlist1'].state.maths[1].tree).eq('q');
      expect(components['/_mathlist1'].state.maths[2].tree).eq('r');
      expect(components['/_mathlist1'].state.maths[3].tree).eq('h');
      expect(components['/_mathlist1'].state.maths[4].tree).eq('b');
      expect(components['/_mathlist1'].state.maths[5].tree).eq('u');
      expect(components['/_mathlist1'].state.maths[6].tree).eq('i');
      expect(components['/_mathlist2'].state.maths.length).eq(2);
      expect(components['/_mathlist2'].state.maths[0].tree).eq('q');
      expect(components['/_mathlist2'].state.maths[1].tree).eq('r');
      expect(components['/_mathlist3'].state.maths.length).eq(4);
      expect(components['/_mathlist3'].state.maths[0].tree).eq('b');
      expect(components['/_mathlist3'].state.maths[1].tree).eq('u');
      expect(components['/_mathlist3'].state.maths[2].tree).eq('i');
      expect(components['/_mathlist3'].state.maths[3].tree).eq('j');
      expect(components['/_mathlist4'].state.maths.length).eq(2);
      expect(components['/_mathlist4'].state.maths[0].tree).eq('b');
      expect(components['/_mathlist4'].state.maths[1].tree).eq('u');
      expect(components['/_mathlist5'].state.maths.length).eq(2);
      expect(components['/_mathlist5'].state.maths[0].tree).eq('u');
      expect(components['/_mathlist5'].state.maths[1].tree).eq('v');
      expect(components['/_mathlist6'].state.maths.length).eq(3);
      expect(components['/_mathlist6'].state.maths[0].tree).eq('i');
      expect(components['/_mathlist6'].state.maths[1].tree).eq('j');
      expect(components['/_mathlist6'].state.maths[2].tree).eq('k');
    })
  })


})
