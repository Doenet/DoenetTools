import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Basic copy assignName Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('recursively copying and assigning names to text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <text name="a">hello</text>
  <copy name="cp1" assignNames="b" target="a" />
  <copy name="cp2" assignNames="c" target="b" />
  <copy name="cp3" assignNames="d" target="cp1" />
  <copy name="cp4" assignNames="e" target="c" />
  <copy name="cp5" assignNames="f" target="cp2" />
  <copy name="cp6" assignNames="g" target="d" />
  <copy name="cp7" assignNames="h" target="cp3" />
  <copy name="cp8" assignNames="i" target="e" />
  <copy name="cp9" assignNames="j" target="cp4" />
  <copy name="cp10" assignNames="k" target="f" />
  <copy name="cp11" assignNames="l" target="cp5" />
  <copy name="cp12" assignNames="m" target="g" />
  <copy name="cp13" assignNames="n" target="cp6" />
  <copy name="cp14" assignNames="o" target="h" />
  <copy name="cp15" assignNames="p" target="cp7" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').should('have.text', 'hello');
    cy.get('#\\/b').should('have.text', 'hello');
    cy.get('#\\/c').should('have.text', 'hello');
    cy.get('#\\/d').should('have.text', 'hello');
    cy.get('#\\/e').should('have.text', 'hello');
    cy.get('#\\/f').should('have.text', 'hello');
    cy.get('#\\/g').should('have.text', 'hello');
    cy.get('#\\/h').should('have.text', 'hello');
    cy.get('#\\/i').should('have.text', 'hello');
    cy.get('#\\/j').should('have.text', 'hello');
    cy.get('#\\/k').should('have.text', 'hello');
    cy.get('#\\/l').should('have.text', 'hello');
    cy.get('#\\/m').should('have.text', 'hello');
    cy.get('#\\/n').should('have.text', 'hello');
    cy.get('#\\/o').should('have.text', 'hello');
    cy.get('#\\/p').should('have.text', 'hello');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/a'].stateValues.value).eq('hello');
      expect(stateVariables['/b'].stateValues.value).eq('hello');
      expect(stateVariables['/c'].stateValues.value).eq('hello');
      expect(stateVariables['/d'].stateValues.value).eq('hello');
      expect(stateVariables['/e'].stateValues.value).eq('hello');
      expect(stateVariables['/f'].stateValues.value).eq('hello');
      expect(stateVariables['/g'].stateValues.value).eq('hello');
      expect(stateVariables['/h'].stateValues.value).eq('hello');
      expect(stateVariables['/i'].stateValues.value).eq('hello');
      expect(stateVariables['/j'].stateValues.value).eq('hello');
      expect(stateVariables['/k'].stateValues.value).eq('hello');
      expect(stateVariables['/l'].stateValues.value).eq('hello');
      expect(stateVariables['/m'].stateValues.value).eq('hello');
      expect(stateVariables['/n'].stateValues.value).eq('hello');
      expect(stateVariables['/o'].stateValues.value).eq('hello');
      expect(stateVariables['/p'].stateValues.value).eq('hello');

      expect(stateVariables['/cp1'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp2'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp3'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp4'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp5'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp6'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp7'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp8'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp9'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp10'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp11'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp12'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp13'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp14'].replacements[0].stateValues.value).eq('hello');
      expect(stateVariables['/cp15'].replacements[0].stateValues.value).eq('hello');



    })

  })

  it('assign name to prop', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>x+x</math>
  <copy name="cp1" prop="simplify" assignNames="s1" target="_math1" />
  <copy name="cp2" target="s1" assignNames="s2" />
  <copy name="cp3" target="cp1" assignNames="s3" />

  <copy name="cp4" assignNames="m1" target="_math1" simplify="full" />
  <copy name="cp5" prop="simplify" assignNames="s4" target="m1" />
  <copy name="cp6" prop="simplify" assignNames="s5" target="cp4" />
  <copy name="cp7" target="s4" assignNames="s6" />
  <copy name="cp8" target="cp5" assignNames="s7" />
  <copy name="cp9" target="s5" assignNames="s8" />
  <copy name="cp10" target="cp6" assignNames="s9" />


  <extract name="ex1" prop="simplify" assignNames="s10"><copy target="_math1" /></extract>
  <copy name="cp11" target="s10" assignNames="s11" />
  <extract name="ex2" prop="simplify" assignNames="s12"><copy target="m1" /></extract>
  <copy name="cp12" target="s12" assignNames="s13" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x')
    })
    cy.get('#\\/s1').should('have.text', 'none');
    cy.get('#\\/s2').should('have.text', 'none');
    cy.get('#\\/s3').should('have.text', 'none');

    cy.get('#\\/m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get('#\\/s4').should('have.text', 'full');
    cy.get('#\\/s5').should('have.text', 'full');
    cy.get('#\\/s6').should('have.text', 'full');
    cy.get('#\\/s7').should('have.text', 'full');
    cy.get('#\\/s8').should('have.text', 'full');
    cy.get('#\\/s9').should('have.text', 'full');

    cy.get('#\\/s10').should('have.text', 'none');
    cy.get('#\\/s11').should('have.text', 'none');
    cy.get('#\\/s12').should('have.text', 'full');
    cy.get('#\\/s13').should('have.text', 'full');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_math1'].stateValues.value.tree).eqls(["+", "x", "x"]);
      expect(stateVariables['/s1'].stateValues.value).eq('none');
      expect(stateVariables['/s2'].stateValues.value).eq('none');
      expect(stateVariables['/s3'].stateValues.value).eq('none');

      expect(stateVariables['/m1'].stateValues.value.tree).eqls(["*", 2, "x"]);

      expect(stateVariables['/s4'].stateValues.value).eq('full');
      expect(stateVariables['/s5'].stateValues.value).eq('full');
      expect(stateVariables['/s6'].stateValues.value).eq('full');
      expect(stateVariables['/s7'].stateValues.value).eq('full');
      expect(stateVariables['/s8'].stateValues.value).eq('full');
      expect(stateVariables['/s9'].stateValues.value).eq('full');

      expect(stateVariables['/s10'].stateValues.value).eq('none');
      expect(stateVariables['/s11'].stateValues.value).eq('none');
      expect(stateVariables['/s12'].stateValues.value).eq('full');
      expect(stateVariables['/s13'].stateValues.value).eq('full');


      expect(stateVariables['/cp1'].replacements[0].stateValues.value).eq('none');
      expect(stateVariables['/cp2'].replacements[0].stateValues.value).eq('none');
      expect(stateVariables['/cp3'].replacements[0].stateValues.value).eq('none');
      expect(stateVariables['/cp4'].replacements[0].stateValues.value.tree).eqls(["*", 2, "x"]);
      expect(stateVariables['/cp5'].replacements[0].stateValues.value).eq('full');
      expect(stateVariables['/cp6'].replacements[0].stateValues.value).eq('full');
      expect(stateVariables['/cp7'].replacements[0].stateValues.value).eq('full');
      expect(stateVariables['/cp8'].replacements[0].stateValues.value).eq('full');
      expect(stateVariables['/cp9'].replacements[0].stateValues.value).eq('full');
      expect(stateVariables['/cp10'].replacements[0].stateValues.value).eq('full');

      expect(stateVariables['/cp11'].replacements[0].stateValues.value).eq('none');
      expect(stateVariables['/cp12'].replacements[0].stateValues.value).eq('full');

      expect(stateVariables['/ex1'].replacements[0].stateValues.value).eq('none');
      expect(stateVariables['/ex2'].replacements[0].stateValues.value).eq('full');

    })

  })

  it('assign names to array prop', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  <copy name="cp1" prop="points" assignNames="b c" target="_line1" />

  <graph>
    <copy target="b" assignNames="b1" />
    <copy target="c" assignNames="c1" />
  </graph>

  <graph>
    <copy assignNames="d e" target="cp1" />
  </graph>

  <copy target="d" assignNames="f" />
  <copy target="e" assignNames="g" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    })
    cy.get('#\\/c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,1)')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    })
    cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,1)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(stateVariables['/_line1'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('y=x'))).to.be.true;

      expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
      expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
      expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
      expect(stateVariables['/c1'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
      expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
      expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
      expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
      expect(stateVariables['/g'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);

    })

    cy.log('move point b')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      win.callAction1({
        actionName: "movePoint",
        componentName: "/b",
        args: { x: 5, y: -5 }
      });
      cy.get('#\\/b .mjx-mrow').should('contain.text', '(5,−5)')
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      }).then(() => {
        expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
        expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/c1'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/g'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
      })

    })

    cy.log('move point c')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      win.callAction1({
        actionName: "movePoint",
        componentName: "/c",
        args: { x: 3, y: 4 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/c .mjx-mrow').should('contain.text', '(3,4)')
      cy.get('#\\/c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      }).then(() => {
        expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/c1'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/g'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
      })

    })

    cy.log('move point b1')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b1",
        args: { x: -9, y: -8 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,−8)')
      })
      cy.get('#\\/c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,−8)')
      })
      cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      }).then(() => {
        expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/c1'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/g'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
      })

    })


    cy.log('move point c1')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/c1",
        args: { x: -1, y: -3 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,−8)')
      })
      cy.get('#\\/c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−3)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,−8)')
      })
      cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−3)')
      }).then(() => {
        expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
        expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/c1'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/g'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
      })

    })


    cy.log('move point d')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/d",
        args: { x: 0, y: 2 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,2)')
      })
      cy.get('#\\/c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−3)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,2)')
      })
      cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−3)')
      }).then(() => {
        expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
        expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
        expect(stateVariables['/c1'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
        expect(stateVariables['/g'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
      })

    })


    cy.log('move point e')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/e",
        args: { x: 5, y: 4 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,2)')
      })
      cy.get('#\\/c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,4)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,2)')
      })
      cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,4)')
      }).then(() => {
        expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
        expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
        expect(stateVariables['/c1'].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
        expect(stateVariables['/g'].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      })

    })

    cy.log('move point f')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/f",
        args: { x: 6, y: 7 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(6,7)')
      })
      cy.get('#\\/c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,4)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(6,7)')
      })
      cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,4)')
      }).then(() => {
        expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
        expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
        expect(stateVariables['/c1'].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
        expect(stateVariables['/g'].stateValues.xs.map(x => x.tree)).eqls([5, 4]);
      })

    })


    cy.log('move point g')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g",
        args: { x: 9, y: 3 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(6,7)')
      })
      cy.get('#\\/c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,3)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(6,7)')
      })
      cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,3)')
      }).then(() => {
        expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([9, 3]);
        expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
        expect(stateVariables['/c1'].stateValues.xs.map(x => x.tree)).eqls([9, 3]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([9, 3]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
        expect(stateVariables['/g'].stateValues.xs.map(x => x.tree)).eqls([9, 3]);
      })

    })

  })

  it('assign names to length-1 array prop', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  <copy name="cp1" prop="point1" assignNames="b" target="_line1" />

  <graph>
    <copy target="b" assignNames="b1" />
  </graph>

  <graph>
    <copy assignNames="d" target="cp1" />
  </graph>

  <copy target="d" assignNames="f" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(stateVariables['/_line1'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('y=x'))).to.be.true;

      expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
      expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
      expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
      expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);

    })

    cy.log('move point b')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b",
        args: { x: 5, y: -5 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
      expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
      expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
      expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
    })

    cy.log('move point b1')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b1",
        args: { x: -9, y: -8 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,−8)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,−8)')
      })
      expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
      expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
      expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
      expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
    })


    cy.log('move point d')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/d",
        args: { x: 0, y: 2 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,2)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,2)')
      })
      expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
      expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
      expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
      expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([0, 2]);
    })


    cy.log('move point f')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/f",
        args: { x: 6, y: 7 }
      });
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(6,7)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(6,7)')
      })
      expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
      expect(stateVariables['/b1'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
      expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
      expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([6, 7]);
    })


  })

  it('assign names to prop of array prop', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  <graph>
     <copy name="cp1" prop="points" assignNames="b c" target="_line1" />
  </graph>

  <p>xs of points: <copy prop="x" target="cp1" assignNames="d e" /></p>

  <p>
    xs again: <copy target="d" assignNames="f" />
    <copy target="e" assignNames="g" />
  </p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // have to create unproxied version of equation for equals to work
      let unproxiedEquation = me.fromAst(stateVariables['/_line1'].stateValues.equation.tree);
      expect(unproxiedEquation.equals(me.fromText('y=x'))).to.be.true;

      expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
      expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
      expect(stateVariables['/d'].stateValues.value.tree).eq(0);
      expect(stateVariables['/e'].stateValues.value.tree).eq(1);
      expect(stateVariables['/f'].stateValues.value.tree).eq(0);
      expect(stateVariables['/g'].stateValues.value.tree).eq(1);

    })

    cy.log('move point b')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b",
        args: { x: 5, y: -5 }
      });
      cy.get('#\\/d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
      expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
      expect(stateVariables['/d'].stateValues.value.tree).eq(5);
      expect(stateVariables['/e'].stateValues.value.tree).eq(1);
      expect(stateVariables['/f'].stateValues.value.tree).eq(5);
      expect(stateVariables['/g'].stateValues.value.tree).eq(1);

    })

    cy.log('move point c')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/c",
        args: { x: 3, y: 4 }
      });
      cy.get('#\\/d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      expect(stateVariables['/b'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
      expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
      expect(stateVariables['/d'].stateValues.value.tree).eq(5);
      expect(stateVariables['/e'].stateValues.value.tree).eq(3);
      expect(stateVariables['/f'].stateValues.value.tree).eq(5);
      expect(stateVariables['/g'].stateValues.value.tree).eq(3);

    })

  })

  it('cannot assign subnames to array prop', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  <copy name="cp1" prop="points" assignNames="(a1 a2) (b1 b2)" target="_line1" />
  
  <p name="n1">nothing 1: <copy target="a1" /></p>
  <p name="n2">nothing 2: <copy target="a2" /></p>
  <p name="n3">nothing 3: <copy target="b1" /></p>
  <p name="n4">nothing 4: <copy target="b2" /></p>

  <graph>
    <copy name="cp2" assignNames="c d" target="cp1" />
  </graph>

  <copy target="c" assignNames="e" />
  <copy target="d" assignNames="f" />

  <copy name="cp3" assignNames="(g1 g2) (h1 h2)" target="cp1" />
  
  <p name="n5">nothing 5: <copy target="g1" /></p>
  <p name="n6">nothing 6: <copy target="g2" /></p>
  <p name="n7">nothing 7: <copy target="h1" /></p>
  <p name="n8">nothing 8: <copy target="h2" /></p>

  <copy name="cp4" assignNames="(i1 i2) (j1 j2)" target="cp2" />
  
  <p name="n9">nothing 9: <copy target="i1" /></p>
  <p name="n10">nothing 10: <copy target="i2" /></p>
  <p name="n11">nothing 11: <copy target="j1" /></p>
  <p name="n12">nothing 12: <copy target="j2" /></p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let point1Anchor = cesc('#' + stateVariables["/cp1"].replacements[0].componentName);
      let point2Anchor = cesc('#' + stateVariables["/cp1"].replacements[1].componentName);
      let point1aAnchor = cesc('#' + stateVariables["/cp3"].replacements[0].componentName);
      let point2aAnchor = cesc('#' + stateVariables["/cp3"].replacements[1].componentName);
      let point1bAnchor = cesc('#' + stateVariables["/cp4"].replacements[0].componentName);
      let point2bAnchor = cesc('#' + stateVariables["/cp4"].replacements[1].componentName);

      cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,0)')
      })
      cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })

      cy.get('#\\/n1').should('have.text', 'nothing 1: ')
      cy.get('#\\/n2').should('have.text', 'nothing 2: ')
      cy.get('#\\/n3').should('have.text', 'nothing 3: ')
      cy.get('#\\/n4').should('have.text', 'nothing 4: ')

      cy.get('#\\/e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,0)')
      })
      cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })

      cy.get(point1aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,0)')
      })
      cy.get(point2aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })

      cy.get('#\\/n5').should('have.text', 'nothing 5: ')
      cy.get('#\\/n6').should('have.text', 'nothing 6: ')
      cy.get('#\\/n7').should('have.text', 'nothing 7: ')
      cy.get('#\\/n8').should('have.text', 'nothing 8: ')

      cy.get(point1bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,0)')
      })
      cy.get(point2bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })

      cy.get('#\\/n9').should('have.text', 'nothing 9: ')
      cy.get('#\\/n10').should('have.text', 'nothing 10: ')
      cy.get('#\\/n11').should('have.text', 'nothing 11: ')
      cy.get('#\\/n12').should('have.text', 'nothing 12: ')


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(stateVariables['/_line1'].stateValues.equation.tree);
        expect(unproxiedEquation.equals(me.fromText('y=x'))).to.be.true;

        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);

      })

      cy.log('move point c')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
        actionName: "movePoint",
        componentName: "/c",
        args: { x: 5, y: -5 }
      });
        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(1,1)')
        })
        cy.get(point1aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(1,1)')
        })
        cy.get(point1bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(1,1)')
        })
        cy.get('#\\/e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(1,1)')
        })
        cy.get('#\\/n1').should('have.text', 'nothing 1: ')
        cy.get('#\\/n2').should('have.text', 'nothing 2: ')
        cy.get('#\\/n3').should('have.text', 'nothing 3: ')
        cy.get('#\\/n4').should('have.text', 'nothing 4: ')
        cy.get('#\\/n5').should('have.text', 'nothing 5: ')
        cy.get('#\\/n6').should('have.text', 'nothing 6: ')
        cy.get('#\\/n7').should('have.text', 'nothing 7: ')
        cy.get('#\\/n8').should('have.text', 'nothing 8: ')
        cy.get('#\\/n9').should('have.text', 'nothing 9: ')
        cy.get('#\\/n10').should('have.text', 'nothing 10: ')
        cy.get('#\\/n11').should('have.text', 'nothing 11: ')
        cy.get('#\\/n12').should('have.text', 'nothing 12: ')

        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
      })

      cy.log('move point d')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
        actionName: "movePoint",
        componentName: "/d",
        args: { x: 3, y: 4 }
      });
        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(point1aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(point1bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get('#\\/e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get('#\\/n1').should('have.text', 'nothing 1: ')
        cy.get('#\\/n2').should('have.text', 'nothing 2: ')
        cy.get('#\\/n3').should('have.text', 'nothing 3: ')
        cy.get('#\\/n4').should('have.text', 'nothing 4: ')
        cy.get('#\\/n5').should('have.text', 'nothing 5: ')
        cy.get('#\\/n6').should('have.text', 'nothing 6: ')
        cy.get('#\\/n7').should('have.text', 'nothing 7: ')
        cy.get('#\\/n8').should('have.text', 'nothing 8: ')
        cy.get('#\\/n9').should('have.text', 'nothing 9: ')
        cy.get('#\\/n10').should('have.text', 'nothing 10: ')
        cy.get('#\\/n11').should('have.text', 'nothing 11: ')
        cy.get('#\\/n12').should('have.text', 'nothing 12: ')

        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
      })

      cy.log('move point e')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
        actionName: "movePoint",
        componentName: "/e",
        args: { x: -9, y: -8 }
      });
        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(point1aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(point1bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get('#\\/e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get('#\\/n1').should('have.text', 'nothing 1: ')
        cy.get('#\\/n2').should('have.text', 'nothing 2: ')
        cy.get('#\\/n3').should('have.text', 'nothing 3: ')
        cy.get('#\\/n4').should('have.text', 'nothing 4: ')
        cy.get('#\\/n5').should('have.text', 'nothing 5: ')
        cy.get('#\\/n6').should('have.text', 'nothing 6: ')
        cy.get('#\\/n7').should('have.text', 'nothing 7: ')
        cy.get('#\\/n8').should('have.text', 'nothing 8: ')
        cy.get('#\\/n9').should('have.text', 'nothing 9: ')
        cy.get('#\\/n10').should('have.text', 'nothing 10: ')
        cy.get('#\\/n11').should('have.text', 'nothing 11: ')
        cy.get('#\\/n12').should('have.text', 'nothing 12: ')

        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
      })


      cy.log('move point f')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
        actionName: "movePoint",
        componentName: "/f",
        args: { x: -1, y: -3 }
      });
        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,−3)')
        })
        cy.get(point1aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,−3)')
        })
        cy.get(point1bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,−3)')
        })
        cy.get('#\\/e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,−3)')
        })
        cy.get('#\\/n1').should('have.text', 'nothing 1: ')
        cy.get('#\\/n2').should('have.text', 'nothing 2: ')
        cy.get('#\\/n3').should('have.text', 'nothing 3: ')
        cy.get('#\\/n4').should('have.text', 'nothing 4: ')
        cy.get('#\\/n5').should('have.text', 'nothing 5: ')
        cy.get('#\\/n6').should('have.text', 'nothing 6: ')
        cy.get('#\\/n7').should('have.text', 'nothing 7: ')
        cy.get('#\\/n8').should('have.text', 'nothing 8: ')
        cy.get('#\\/n9').should('have.text', 'nothing 9: ')
        cy.get('#\\/n10').should('have.text', 'nothing 10: ')
        cy.get('#\\/n11').should('have.text', 'nothing 11: ')
        cy.get('#\\/n12').should('have.text', 'nothing 12: ')

        expect(stateVariables['/c'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/d'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
      })


    })
  })

  it('cannot assign subnames to array prop, inside namespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <section name="hello" newNamespace ><title>hello</title>
  <graph>
    <line through="(0,0) (1,1)" />
  </graph>

  <copy name="cp1" prop="points" assignNames="(a1 a2) (b1 b2)" target="_line1" />
  
  <p name="n1">nothing 1: <copy target="a1" /></p>
  <p name="n2">nothing 2: <copy target="a2" /></p>
  <p name="n3">nothing 3: <copy target="b1" /></p>
  <p name="n4">nothing 4: <copy target="b2" /></p>

  <graph>
    <copy name="cp2" assignNames="c d" target="cp1" />
  </graph>

  <copy target="c" assignNames="e" />
  <copy target="d" assignNames="f" />

  <copy name="cp3" assignNames="(g1 g2) (h1 h2)" target="cp1" />
  
  <p name="n5">nothing 5: <copy target="g1" /></p>
  <p name="n6">nothing 6: <copy target="g2" /></p>
  <p name="n7">nothing 7: <copy target="h1" /></p>
  <p name="n8">nothing 8: <copy target="h2" /></p>

  <copy name="cp4" assignNames="(i1 i2) (j1 j2)" target="cp2" />
  
  <p name="n9">nothing 9: <copy target="i1" /></p>
  <p name="n10">nothing 10: <copy target="i2" /></p>
  <p name="n11">nothing 11: <copy target="j1" /></p>
  <p name="n12">nothing 12: <copy target="j2" /></p>
  
  </section>

  <copy target="hello/e" assignNames="e" />
  <copy target="hello/f" assignNames="f" />

  <p name="n13">nothing 13: <copy target="hello/i1" /></p>
  <p name="n14">nothing 14: <copy target="hello/i2" /></p>
  <p name="n15">nothing 15: <copy target="hello/j1" /></p>
  <p name="n16">nothing 16: <copy target="hello/j2" /></p>
  

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let point1Anchor = cesc('#' + stateVariables["/hello/cp1"].replacements[0].componentName);
      let point2Anchor = cesc('#' + stateVariables["/hello/cp1"].replacements[1].componentName);
      let point1aAnchor = cesc('#' + stateVariables["/hello/cp3"].replacements[0].componentName);
      let point2aAnchor = cesc('#' + stateVariables["/hello/cp3"].replacements[1].componentName);
      let point1bAnchor = cesc('#' + stateVariables["/hello/cp4"].replacements[0].componentName);
      let point2bAnchor = cesc('#' + stateVariables["/hello/cp4"].replacements[1].componentName);

      cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,0)')
      })
      cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })

      cy.get(cesc('#/hello/n1')).should('have.text', 'nothing 1: ')
      cy.get(cesc('#/hello/n2')).should('have.text', 'nothing 2: ')
      cy.get(cesc('#/hello/n3')).should('have.text', 'nothing 3: ')
      cy.get(cesc('#/hello/n4')).should('have.text', 'nothing 4: ')

      cy.get(cesc('#/hello/e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,0)')
      })
      cy.get(cesc('#/hello/f')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })

      cy.get(point1aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,0)')
      })
      cy.get(point2aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })

      cy.get(cesc('#/hello/n5')).should('have.text', 'nothing 5: ')
      cy.get(cesc('#/hello/n6')).should('have.text', 'nothing 6: ')
      cy.get(cesc('#/hello/n7')).should('have.text', 'nothing 7: ')
      cy.get(cesc('#/hello/n8')).should('have.text', 'nothing 8: ')

      cy.get(point1bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,0)')
      })
      cy.get(point2bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })

      cy.get(cesc('#/hello/n9')).should('have.text', 'nothing 9: ')
      cy.get(cesc('#/hello/n10')).should('have.text', 'nothing 10: ')
      cy.get(cesc('#/hello/n11')).should('have.text', 'nothing 11: ')
      cy.get(cesc('#/hello/n12')).should('have.text', 'nothing 12: ')

      cy.get(cesc('#/e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(0,0)')
      })
      cy.get(cesc('#/f')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })

      cy.get(cesc('#/n13')).should('have.text', 'nothing 13: ')
      cy.get(cesc('#/n14')).should('have.text', 'nothing 14: ')
      cy.get(cesc('#/n15')).should('have.text', 'nothing 15: ')
      cy.get(cesc('#/n16')).should('have.text', 'nothing 16: ')


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        // have to create unproxied version of equation for equals to work
        let unproxiedEquation = me.fromAst(stateVariables['/hello/_line1'].stateValues.equation.tree);
        expect(unproxiedEquation.equals(me.fromText('y=x'))).to.be.true;

        expect(stateVariables['/hello/c'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
        expect(stateVariables['/hello/d'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
        expect(stateVariables['/hello/e'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
        expect(stateVariables['/hello/f'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);

      })

      cy.log('move point c')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
        actionName: "movePoint",
        componentName: "/hello/c",
        args: { x: 5, y: -5 }
      });
        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(1,1)')
        })
        cy.get(point1aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(1,1)')
        })
        cy.get(point1bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(1,1)')
        })
        cy.get(cesc('#/hello/e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(cesc('#/hello/f')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(1,1)')
        })
        cy.get(cesc('#/e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(cesc('#/f')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(1,1)')
        })
        cy.get(cesc('#/hello/n1')).should('have.text', 'nothing 1: ')
        cy.get(cesc('#/hello/n2')).should('have.text', 'nothing 2: ')
        cy.get(cesc('#/hello/n3')).should('have.text', 'nothing 3: ')
        cy.get(cesc('#/hello/n4')).should('have.text', 'nothing 4: ')
        cy.get(cesc('#/hello/n5')).should('have.text', 'nothing 5: ')
        cy.get(cesc('#/hello/n6')).should('have.text', 'nothing 6: ')
        cy.get(cesc('#/hello/n7')).should('have.text', 'nothing 7: ')
        cy.get(cesc('#/hello/n8')).should('have.text', 'nothing 8: ')
        cy.get(cesc('#/hello/n9')).should('have.text', 'nothing 9: ')
        cy.get(cesc('#/hello/n10')).should('have.text', 'nothing 10: ')
        cy.get(cesc('#/hello/n11')).should('have.text', 'nothing 11: ')
        cy.get(cesc('#/hello/n12')).should('have.text', 'nothing 12: ')
        cy.get(cesc('#/n13')).should('have.text', 'nothing 13: ')
        cy.get(cesc('#/n14')).should('have.text', 'nothing 14: ')
        cy.get(cesc('#/n15')).should('have.text', 'nothing 15: ')
        cy.get(cesc('#/n16')).should('have.text', 'nothing 16: ')

        expect(stateVariables['/hello/c'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/hello/d'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
        expect(stateVariables['/hello/e'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/hello/f'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
      })

      cy.log('move point d')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
        actionName: "movePoint",
        componentName: "/hello/d",
        args: { x: 3, y: 4 }
      });
        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(point1aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(point1bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(point2bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(cesc('#/hello/e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(cesc('#/hello/f')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(cesc('#/e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(5,−5)')
        })
        cy.get(cesc('#/f')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(cesc('#/hello/n1')).should('have.text', 'nothing 1: ')
        cy.get(cesc('#/hello/n2')).should('have.text', 'nothing 2: ')
        cy.get(cesc('#/hello/n3')).should('have.text', 'nothing 3: ')
        cy.get(cesc('#/hello/n4')).should('have.text', 'nothing 4: ')
        cy.get(cesc('#/hello/n5')).should('have.text', 'nothing 5: ')
        cy.get(cesc('#/hello/n6')).should('have.text', 'nothing 6: ')
        cy.get(cesc('#/hello/n7')).should('have.text', 'nothing 7: ')
        cy.get(cesc('#/hello/n8')).should('have.text', 'nothing 8: ')
        cy.get(cesc('#/hello/n9')).should('have.text', 'nothing 9: ')
        cy.get(cesc('#/hello/n10')).should('have.text', 'nothing 10: ')
        cy.get(cesc('#/hello/n11')).should('have.text', 'nothing 11: ')
        cy.get(cesc('#/hello/n12')).should('have.text', 'nothing 12: ')
        cy.get(cesc('#/n13')).should('have.text', 'nothing 13: ')
        cy.get(cesc('#/n14')).should('have.text', 'nothing 14: ')
        cy.get(cesc('#/n15')).should('have.text', 'nothing 15: ')
        cy.get(cesc('#/n16')).should('have.text', 'nothing 16: ')

        expect(stateVariables['/hello/c'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/hello/d'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/hello/e'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/hello/f'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([5, -5]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
      })

      cy.log('move point e')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
        actionName: "movePoint",
        componentName: "/hello/e",
        args: { x: -9, y: -8 }
      });
        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(point1aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(point1bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(cesc('#/hello/e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(cesc('#/hello/f')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(cesc('#/e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(cesc('#/f')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(3,4)')
        })
        cy.get(cesc('#/hello/n1')).should('have.text', 'nothing 1: ')
        cy.get(cesc('#/hello/n2')).should('have.text', 'nothing 2: ')
        cy.get(cesc('#/hello/n3')).should('have.text', 'nothing 3: ')
        cy.get(cesc('#/hello/n4')).should('have.text', 'nothing 4: ')
        cy.get(cesc('#/hello/n5')).should('have.text', 'nothing 5: ')
        cy.get(cesc('#/hello/n6')).should('have.text', 'nothing 6: ')
        cy.get(cesc('#/hello/n7')).should('have.text', 'nothing 7: ')
        cy.get(cesc('#/hello/n8')).should('have.text', 'nothing 8: ')
        cy.get(cesc('#/hello/n9')).should('have.text', 'nothing 9: ')
        cy.get(cesc('#/hello/n10')).should('have.text', 'nothing 10: ')
        cy.get(cesc('#/hello/n11')).should('have.text', 'nothing 11: ')
        cy.get(cesc('#/hello/n12')).should('have.text', 'nothing 12: ')
        cy.get(cesc('#/n13')).should('have.text', 'nothing 13: ')
        cy.get(cesc('#/n14')).should('have.text', 'nothing 14: ')
        cy.get(cesc('#/n15')).should('have.text', 'nothing 15: ')
        cy.get(cesc('#/n16')).should('have.text', 'nothing 16: ')

        expect(stateVariables['/hello/c'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/hello/d'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/hello/e'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/hello/f'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
      })


      cy.log('move point f')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        await win.callAction1({
        actionName: "movePoint",
        componentName: "/hello/f",
        args: { x: -1, y: -3 }
      });
        cy.get(point1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,−3)')
        })
        cy.get(point1aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2aAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,−3)')
        })
        cy.get(point1bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(point2bAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,−3)')
        })
        cy.get(cesc('#/hello/e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(cesc('#/hello/f')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,−3)')
        })
        cy.get(cesc('#/e')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−9,−8)')
        })
        cy.get(cesc('#/f')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('(−1,−3)')
        })
        cy.get(cesc('#/hello/n1')).should('have.text', 'nothing 1: ')
        cy.get(cesc('#/hello/n2')).should('have.text', 'nothing 2: ')
        cy.get(cesc('#/hello/n3')).should('have.text', 'nothing 3: ')
        cy.get(cesc('#/hello/n4')).should('have.text', 'nothing 4: ')
        cy.get(cesc('#/hello/n5')).should('have.text', 'nothing 5: ')
        cy.get(cesc('#/hello/n6')).should('have.text', 'nothing 6: ')
        cy.get(cesc('#/hello/n7')).should('have.text', 'nothing 7: ')
        cy.get(cesc('#/hello/n8')).should('have.text', 'nothing 8: ')
        cy.get(cesc('#/hello/n9')).should('have.text', 'nothing 9: ')
        cy.get(cesc('#/hello/n10')).should('have.text', 'nothing 10: ')
        cy.get(cesc('#/hello/n11')).should('have.text', 'nothing 11: ')
        cy.get(cesc('#/hello/n12')).should('have.text', 'nothing 12: ')
        cy.get(cesc('#/n13')).should('have.text', 'nothing 13: ')
        cy.get(cesc('#/n14')).should('have.text', 'nothing 14: ')
        cy.get(cesc('#/n15')).should('have.text', 'nothing 15: ')
        cy.get(cesc('#/n16')).should('have.text', 'nothing 16: ')

        expect(stateVariables['/hello/c'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/hello/d'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
        expect(stateVariables['/hello/e'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/hello/f'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
        expect(stateVariables['/e'].stateValues.xs.map(x => x.tree)).eqls([-9, -8]);
        expect(stateVariables['/f'].stateValues.xs.map(x => x.tree)).eqls([-1, -3]);
      })


    })
  })

  it('assign names can access namespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <section newNamespace>
    <subsection>
      <p newNamespace>Hello, <text name="person">Jesse</text>!</p>
    </subsection>
    <subsection>
      <p>Hello, <text name="person">Jessica</text>!</p>
    </subsection>
  </section>

  <copy assignNames="a" target="_section1"/>

  <copy assignNames="b" target="a" />

  <p><copy target="_section1/_p1/person"/> <copy target="_section1/person"/>
<copy target="a/_p1/person" /> <copy target="a/person" />
<copy target="b/_p1/person" /> <copy target="b/person" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_section1\\/_p1').should('have.text', 'Hello, Jesse!');
    cy.get('#\\/_section1\\/_p2').should('have.text', 'Hello, Jessica!');
    cy.get('#\\/a\\/_p1').should('have.text', 'Hello, Jesse!');
    cy.get('#\\/a\\/_p2').should('have.text', 'Hello, Jessica!');
    cy.get('#\\/b\\/_p1').should('have.text', 'Hello, Jesse!');
    cy.get('#\\/b\\/_p2').should('have.text', 'Hello, Jessica!');

    cy.get('#\\/_p1').should('have.text', 'Jesse Jessica\nJesse Jessica\nJesse Jessica');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_section1/_p1/person'].stateValues.value).eq("Jesse");
      expect(stateVariables['/_section1/person'].stateValues.value).eq("Jessica");
      expect(stateVariables['/a/_p1/person'].stateValues.value).eq("Jesse");
      expect(stateVariables['/a/person'].stateValues.value).eq("Jessica");
      expect(stateVariables['/b/_p1/person'].stateValues.value).eq("Jesse");
      expect(stateVariables['/b/person'].stateValues.value).eq("Jessica");

    })

  });

  it('assign names can access namespace, across namespaces', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <section name="hello" newNamespace><title>Hello</title>
    <p newNamespace>Hello, <text name="person">Jesse</text>!</p>
    <copy assignNames="a" target="_p1"/>
    <p><copy target="_p1/person"/> <copy target="a/person" /> <copy target="../bye/a/person" /></p>
  </section>

  <section name="bye" newNamespace><title>Bye</title>
    <copy assignNames="a" target="../hello/_p1"/>
    <p><copy target="../hello/_p1/person"/> <copy target="../hello/a/person" /> <copy target="a/person" /></p>
  </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/hello\\/_p1').should('have.text', 'Hello, Jesse!');
    cy.get('#\\/hello\\/a').should('have.text', 'Hello, Jesse!');
    cy.get('#\\/hello\\/_p2').should('have.text', 'Jesse Jesse Jesse');

    cy.get('#\\/bye\\/a').should('have.text', 'Hello, Jesse!');
    cy.get('#\\/bye\\/_p1').should('have.text', 'Jesse Jesse Jesse');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/hello/_p1/person'].stateValues.value).eq("Jesse");
      expect(stateVariables['/hello/a/person'].stateValues.value).eq("Jesse");
      expect(stateVariables['/bye/a/person'].stateValues.value).eq("Jesse");

    })

  })

  it('assign names can access namespace even with math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p newNamespace name="pOriginal">
    <math name="expression">
      <math name="x">x</math>+<math name="y">y</math>
    </math>
  </p>

  <copy target="pOriginal" assignNames="pCopy" />

  <p>This grabs expression: <copy target="pOriginal/expression" assignNames="expressionCopy" /></p>
  <p>This grabs expression: <copy target="pCopy/expression" assignNames="expressionCopy2" /></p>
  <p>This grabs piece x: <copy target="pOriginal/x" assignNames="xCopy" /></p>
  <p>This grabs piece y: <copy target="pOriginal/y" assignNames="yCopy" /></p>
  <p>Should this grab piece x? <copy target="pCopy/x" assignNames="xCopy2" /></p>
  <p>Should this grab piece y? <copy target="pCopy/y" assignNames="yCopy2" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load
    cy.get(`#\\/pOriginal\\/expression`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get(`#\\/pCopy\\/expression`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get(`#\\/expressionCopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get(`#\\/expressionCopy2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })
    cy.get(`#\\/xCopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get(`#\\/xCopy2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get(`#\\/yCopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get(`#\\/yCopy2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })

  });


});
