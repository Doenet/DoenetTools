import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Sequence Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('number sequence, no parameters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence/></aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(10);
      for (let i = 0; i < 10; i++) {
        expect(children[i].stateValues.value).eq(i + 1);
      }
    })
  });

  it('number sequence, just from', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="-4"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(10);
      for (let i = 0; i < 10; i++) {
        expect(children[i].stateValues.value).eq(i - 4);
      }
    })
  });

  it('number sequence, just to', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence to="3"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(3);
      for (let i = 0; i < 3; i++) {
        expect(children[i].stateValues.value).eq(3 + i - 2);
      }
    })
  });

  it('number sequence, just step', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence step="-2"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(10);
      for (let i = 0; i < 10; i++) {
        expect(children[i].stateValues.value).eq(1 + i * (-2));
      }
    })
  });

  it('number sequence, just sequenceLength', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence sequenceLength="5"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      for (let i = 0; i < 5; i++) {
        expect(children[i].stateValues.value).eq(1 + i);
      }
    })
  });

  it('number sequence, from and to', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="-3" to="4"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      for (let i = 0; i < 8; i++) {
        expect(children[i].stateValues.value).eq(-3 + i);
      }
    })
  });

  it('number sequence, from and step', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="2" step="-4"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(10);
      for (let i = 0; i < 10; i++) {
        expect(children[i].stateValues.value).eq(2 + i * (-4));
      }
    })
  });

  it('number sequence, from and sequenceLength', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="11" sequenceLength="3"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(3);
      for (let i = 0; i < 3; i++) {
        expect(children[i].stateValues.value).eq(11 + i);
      }
    })
  });

  it('number sequence, to and step', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence to="21" step="3"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      for (let i = 0; i < 7; i++) {
        expect(children[i].stateValues.value).eq(21 + 3 * (i - 6));
      }
    })
  });

  it('number sequence, to and sequenceLength', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence to="-8" sequenceLength="4"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(4);
      for (let i = 0; i < 4; i++) {
        expect(children[i].stateValues.value).eq(-8 + (i - 3));
      }
    })
  });

  it('number sequence, step and sequenceLength', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence step="5" sequenceLength="6"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      for (let i = 0; i < 6; i++) {
        expect(children[i].stateValues.value).eq(1 + 5 * i);
      }
    })
  });

  it('number sequence, from, to, and step', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="9" to="2" step="-2" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(4);
      for (let i = 0; i < 4; i++) {
        expect(children[i].stateValues.value).eq(9 - 2 * i);
      }
    })
  });

  it('number sequence, from, to, and sequenceLength', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="-5" to="5" sequenceLength="6" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      for (let i = 0; i < 6; i++) {
        expect(children[i].stateValues.value).eq(-5 + 2 * i);
      }
    })
  });

  it('number sequence, from, step, and sequenceLength', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="8" step="-2" sequenceLength="5" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      for (let i = 0; i < 5; i++) {
        expect(children[i].stateValues.value).eq(8 - 2 * i);
      }
    })
  });

  it('number sequence, to, step, and sequenceLength', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence to="8" step="-2" sequenceLength="5" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      for (let i = 0; i < 5; i++) {
        expect(children[i].stateValues.value).eq(8 - 2 * (i - 4));
      }
    })
  });

  it('letters sequence, lowercase, explicit type', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence type="letters" from="c" to="Q" sequenceLength="5" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      expect(children[0].stateValues.value).eq('c');
      expect(children[1].stateValues.value).eq('f');
      expect(children[2].stateValues.value).eq('i');
      expect(children[3].stateValues.value).eq('l');
      expect(children[4].stateValues.value).eq('o');
    })
  });

  it('letters sequence, lowercase', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="c" to="Q" sequenceLength="5" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      expect(children[0].stateValues.value).eq('c');
      expect(children[1].stateValues.value).eq('f');
      expect(children[2].stateValues.value).eq('i');
      expect(children[3].stateValues.value).eq('l');
      expect(children[4].stateValues.value).eq('o');
    })
  });

  it('letters sequence, uppercase', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="Y" to="f" step="-4" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      expect(children[0].stateValues.value).eq('Y');
      expect(children[1].stateValues.value).eq('U');
      expect(children[2].stateValues.value).eq('Q');
      expect(children[3].stateValues.value).eq('M');
      expect(children[4].stateValues.value).eq('I');
    })
  });

  it('letters sequence, multicharacter', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="aZ" step="3" sequenceLength="4" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(4);
      expect(children[0].stateValues.value).eq('az');
      expect(children[1].stateValues.value).eq('bc');
      expect(children[2].stateValues.value).eq('bf');
      expect(children[3].stateValues.value).eq('bi');
    })
  });

  it('letters sequence, stays valid', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence to="q" step="3" sequenceLength="10" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      expect(children[0].stateValues.value).eq('b');
      expect(children[1].stateValues.value).eq('e');
      expect(children[2].stateValues.value).eq('h');
      expect(children[3].stateValues.value).eq('k');
      expect(children[4].stateValues.value).eq('n');
      expect(children[5].stateValues.value).eq('q');
    })
  });

  it.skip('number sequence, sugar to', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence>7</sequence></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      for (let i = 0; i < 7; i++) {
        expect(children[i].stateValues.value).eq(7 + i - 6);
      }
    })
  });

  it.skip('number sequence, sugar from and to', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence>-4,1</sequence></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      for (let i = 0; i < 6; i++) {
        expect(children[i].stateValues.value).eq(-4 + i);
      }
    })
  });

  it.skip('number sequence, step with sugar from and to', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence step="-3">4,-6</sequence></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(4);
      for (let i = 0; i < 4; i++) {
        expect(children[i].stateValues.value).eq(4 - 3 * i);
      }
    })
  });

  it('letters sequence, explicit type but no parameters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence type="letters"/></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(10);
      expect(children[0].stateValues.value).eq('a');
      expect(children[1].stateValues.value).eq('b');
      expect(children[2].stateValues.value).eq('c');
      expect(children[3].stateValues.value).eq('d');
      expect(children[4].stateValues.value).eq('e');
      expect(children[5].stateValues.value).eq('f');
      expect(children[6].stateValues.value).eq('g');
      expect(children[7].stateValues.value).eq('h');
      expect(children[8].stateValues.value).eq('i');
      expect(children[9].stateValues.value).eq('j');
    })
  });

  it.skip('letters sequence, sugar to', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence>e</sequence></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      expect(children[0].stateValues.value).eq('a');
      expect(children[1].stateValues.value).eq('b');
      expect(children[2].stateValues.value).eq('c');
      expect(children[3].stateValues.value).eq('d');
      expect(children[4].stateValues.value).eq('e');
    })
  });

  it.skip('letters sequence, sugar from and to, explicit type', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence type="letters">bw, cb</sequence></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      expect(children[0].stateValues.value).eq('bw');
      expect(children[1].stateValues.value).eq('bx');
      expect(children[2].stateValues.value).eq('by');
      expect(children[3].stateValues.value).eq('bz');
      expect(children[4].stateValues.value).eq('ca');
      expect(children[5].stateValues.value).eq('cb');
    })
  });

  it.skip('letters sequence, sugar from and to', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence>bw, cb</sequence></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      expect(children[0].stateValues.value).eq('bw');
      expect(children[1].stateValues.value).eq('bx');
      expect(children[2].stateValues.value).eq('by');
      expect(children[3].stateValues.value).eq('bz');
      expect(children[4].stateValues.value).eq('ca');
      expect(children[5].stateValues.value).eq('cb');
    })
  });

  it('math sequence, calculate step', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence type="math" from="3x" to="3y" sequenceLength="4" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(4);
      expect(children[0].stateValues.value.tree).eqls(['*', 3, 'x']);
      expect(children[1].stateValues.value.tree).eqls(['+', ['*', 2, 'x'], 'y']);
      expect(children[2].stateValues.value.tree).eqls(['+', 'x', ['*', 2, 'y']]);
      expect(children[3].stateValues.value.tree).eqls(['*', 3, 'y']);
    })
  });

  it('number sequence, excludes', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence from="1" sequenceLength="10" exclude="$exclude2, 2,6" />
    </aslist>
    <p>Also exclude: <mathinput name="exclude2" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(1 + i);
        ind++
      }
    })

    cy.log("also exclude 9")
    cy.get('#\\/exclude2 textarea').type(`{end}{backspace}9{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5 || i == 8) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(1 + i);
        ind++
      }
    })

    cy.log("also exclude 6 twice")
    cy.get('#\\/exclude2 textarea').type(`{end}{backspace}6{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(1 + i);
        ind++
      }
    })

    cy.log("also exclude 12")
    cy.get('#\\/exclude2 textarea').type(`{end}{backspace}12{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(1 + i);
        ind++
      }
    })


    cy.log("also exclude 3")
    cy.get('#\\/exclude2 textarea').type(`{end}{backspace}{backspace}3{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5 || i == 2) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(1 + i);
        ind++
      }
    })


    cy.log("don't exclude anything else")
    cy.get('#\\/exclude2 textarea').type(`{end}{backspace}{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(1 + i);
        ind++
      }
    })

  });

  it('letters sequence, excludes', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence type="letters" sequenceLength="10" exclude="$e, b,f" />
    </aslist>
    <p>Also exclude: <textinput name="e" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })

    cy.log("also exclude i")
    cy.get('#\\/e_input').clear().type(`i{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5 || i == 8) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })

    cy.log("also exclude f twice")
    cy.get('#\\/e_input').clear().type(`f{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })

    cy.log("also exclude l")
    cy.get('#\\/e_input').clear().type(`l{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })


    cy.log("also exclude C")
    cy.get('#\\/e_input').clear().type(`C{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5 || i == 2) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })


    cy.log("don't exclude anything else")
    cy.get('#\\/e_input').clear().type(`{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(children[ind].stateValues.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })

  });

  it('math sequence, excludes', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
      <sequence type="math" sequenceLength="10" from="x" step="x" exclude="2x,6x, $e" />
    </aslist>
    <p>Also exclude: <mathinput name="e" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(me.fromAst(children[ind].stateValues.value.tree).equals(me.fromText((1 + i).toString() + "x"))).eq(true);
        ind++
      }
    })

    cy.log("also exclude 9x")
    cy.get('#\\/e textarea').type(`{end}{backspace}9x{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5 || i == 8) {
          continue;
        }
        expect(me.fromAst(children[ind].stateValues.value.tree).equals(me.fromText((1 + i).toString() + "x"))).eq(true);
        ind++
      }
    })

    cy.log("also exclude 6x twice")
    cy.get('#\\/e textarea').type(`{end}{backspace}{backspace}6x{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(me.fromAst(children[ind].stateValues.value.tree).equals(me.fromText((1 + i).toString() + "x"))).eq(true);
        ind++
      }
    })

    cy.log("also exclude 12x")
    cy.get('#\\/e textarea').type(`{end}{backspace}{backspace}12x{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(me.fromAst(children[ind].stateValues.value.tree).equals(me.fromText((1 + i).toString() + "x"))).eq(true);
        ind++
      }
    })


    cy.log("also exclude 3x")
    cy.get('#\\/e textarea').type(`{end}{backspace}{backspace}{backspace}3x{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5 || i == 2) {
          continue;
        }
        expect(me.fromAst(children[ind].stateValues.value.tree).equals(me.fromText((1 + i).toString() + "x"))).eq(true);
        ind++
      }
    })


    cy.log("don't exclude anything else")
    cy.get('#\\/e textarea').type(`{end}{backspace}{backspace}{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for (let i = 0; i < 10; i++) {
        if (i == 1 || i == 5) {
          continue;
        }
        expect(me.fromAst(children[ind].stateValues.value.tree).equals(me.fromText((1 + i).toString() + "x"))).eq(true);
        ind++
      }
    })

  });

  it('sequence of decimals rounds on display', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist><sequence step="0.1" from="0" to="1" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log("Round when displaying to show 10ths correctly")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacements = components['/_sequence1'].replacements;

      for (let i = 0; i < 11; i++) {
        cy.get(cesc('#' + replacements[i].componentName)).invoke('text').then((text) => {
          expect(text.trim()).equal((i / 10).toString());
        })
      }
    });

    cy.log("Don't round internaly")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacements = components['/_sequence1'].replacements;

      for (let i = 0; i < 11; i++) {
        expect(replacements[i].stateValues.value).eq(0.1 * i);
      }
    })
  });

  it('sequence with number operators ', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="n">5</math>
    <number name="m">10</number>
    <aslist>
      <sequence from="$min" to="$max"/>
    </aslist>
    <number name="min">
      <min><copy tname="n" /><number>11</number></min>
    </number>
    <number name="max">
      <max><math><copy tname="m" />+3</math><number>11</number></max>
    </number>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacements = components['/_sequence1'].replacements;
      for (let i = 0; i < 9; i++) {
        cy.get(cesc('#' + replacements[i].componentName)).invoke('text').then((text) => {
          expect(text.trim()).equal((i + 5).toString());
        })
      }
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let replacements = components['/_sequence1'].replacements;
      for (let i = 0; i < 9; i++) {
        expect(replacements[i].stateValues.value).eq(i + 5);
      }
    })
  });

  it('initially invalid to', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n"/>
  <aslist><sequence from="2" to="$n" /></aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.log('sequence starts off invalid')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_sequence1'].stateValues.validSequence).eq(false);
      expect(components['/_sequence1'].replacements.length).eq(0);

    })

    cy.get('#\\/n textarea').type("2{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let number1 = components['/_sequence1'].replacements[0];
      let number1Name = number1.componentName;
      let number1Anchor = cesc('#' + number1Name);

      cy.get(number1Anchor).should('have.text', '2')

      cy.window().then((win) => {
        expect(components['/_sequence1'].stateValues.validSequence).eq(true);
        expect(components['/_sequence1'].replacements.length).eq(1);
      })
    })
  })


});

