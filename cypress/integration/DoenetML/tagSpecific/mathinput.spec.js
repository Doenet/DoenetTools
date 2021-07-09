import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('MathInput Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('mathinput references', () => {

    // A fairly involved test
    // to check for bugs that have shown up only after multiple manipulations

    // Initial doenet code

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill='x+1'/>
    <copy tname="_mathinput1" />
    <copy prop='value' tname="_mathinput1" />
    <copy prop='immediatevalue' tname="_mathinput1" />
    <mathinput/>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinput1a = components['/_copy1'].replacements[0];
      let mathinput1aEditiableFieldAnchor = cesc('#' + mathinput1a.componentName) + " .mq-editable-field";
      let mathinput1aAnchor = cesc('#' + mathinput1a.componentName) + " textarea";
      let math1 = components['/_copy2'].replacements[0];
      let math1Anchor = cesc('#' + math1.componentName);
      let math2 = components['/_copy3'].replacements[0];
      let math2Anchor = cesc('#' + math2.componentName);


      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+1')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+1')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 1]);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 1]);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).to.eq('\uFF3F');
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 1]);
        expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 1]);
        expect(components['/_mathinput2'].stateValues.value.tree).to.eq('\uFF3F');
      });


      cy.log("Type 2 in first mathinput");
      cy.get('#\\/_mathinput1 textarea').type(`{end}2`, { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+1')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+12')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).to.eq('\uFF3F');
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 1]);
        expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 1]);
        expect(components['/_mathinput2'].stateValues.value.tree).to.eq('\uFF3F');
      });


      // cy.log("Pressing Escape undoes change");
      // cy.get('#\\/_mathinput1_input').type(`{esc}`);

      // cy.log('Test values displayed in browser')
      // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 1');
      // cy.get(mathinput1aAnchor).should('have.value', 'x + 1');
      // cy.get('#\\/_mathinput2_input').should('have.value', '');

      // cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('x+1')
      // });
      // cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('x+1')
      // });

      // cy.log('Test internal values are set to the correct values')
      // cy.window().then((win) => {
      //   let components = Object.assign({}, win.state.components);
      //   expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 1]);
      //   expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 1]);
      //   expect(components['/_mathinput2'].stateValues.immediateValue.tree).to.eq('\uFF3F');
      //   expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 1]);
      //   expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 1]);
      //   expect(components['/_mathinput2'].stateValues.value.tree).to.eq('\uFF3F');
      // });


      cy.log("Changing to 3 in first mathinput");
      cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}3`, { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+13')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+1')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+13')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 13]);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 13]);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).to.eq('\uFF3F');
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 1]);
        expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 1]);
        expect(components['/_mathinput2'].stateValues.value.tree).to.eq('\uFF3F');
      });


      cy.log("Pressing Enter in first mathinput");
      cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+13')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+13')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+13')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+13')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 13]);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 13]);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).to.eq('\uFF3F');
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 13]);
        expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 13]);
        expect(components['/_mathinput2'].stateValues.value.tree).to.eq('\uFF3F');
      });


      // cy.log("Pressing Escape does not undo change");
      // cy.get('#\\/_mathinput1_input').type(`{esc}`);

      // cy.log('Test values displayed in browser')
      // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 13');
      // cy.get(mathinput1aAnchor).should('have.value', 'x + 13');
      // cy.get('#\\/_mathinput2_input').should('have.value', '');

      // cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('x+13')
      // });
      // cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('x+13')
      // });

      // cy.log('Test internal values are set to the correct values')
      // cy.window().then((win) => {
      //   let components = Object.assign({}, win.state.components);
      //   expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 13]);
      //   expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 13]);
      //   expect(components['/_mathinput2'].stateValues.immediateValue.tree).to.eq('\uFF3F');
      //   expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 13]);
      //   expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 13]);
      //   expect(components['/_mathinput2'].stateValues.value.tree).to.eq('\uFF3F');
      // });



      cy.log("Erasing 13 and typing y second mathinput");
      cy.get('#\\/_mathinput1 textarea').blur();
      cy.get(mathinput1aAnchor).type(`{end}{backspace}{backspace}y`, { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+13')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+13')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 'y']);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).to.eq('\uFF3F');
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 13]);
        expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 13]);
        expect(components['/_mathinput2'].stateValues.value.tree).to.eq('\uFF3F');
      });


      cy.log("Changing focus to first mathinput");
      cy.get('#\\/_mathinput1 textarea').focus();

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 'y']);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).to.eq('\uFF3F');
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.value.tree).to.eq('\uFF3F');
      });



      // cy.log("Changing escape doesn't do anything");
      // cy.get('#\\/_mathinput1_input').type("{esc}");

      // cy.log('Test values displayed in browser')
      // cy.get('#\\/_mathinput1_input').should('have.value', 'x + y');
      // cy.get(mathinput1aAnchor).should('have.value', 'x + y');
      // cy.get('#\\/_mathinput2_input').should('have.value', '');

      // cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('x+y')
      // });
      // cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('x+y')
      // });

      // cy.log('Test internal values are set to the correct values')
      // cy.window().then((win) => {
      //   let components = Object.assign({}, win.state.components);
      //   expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 'y']);
      //   expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 'y']);
      //   expect(components['/_mathinput2'].stateValues.immediateValue.tree).to.eq('\uFF3F');
      //   expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 'y']);
      //   expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 'y']);
      //   expect(components['/_mathinput2'].stateValues.value.tree).to.eq('\uFF3F');
      // });


      // pq in third input

      cy.log("Typing pq in third mathinput");
      cy.get('#\\/_mathinput2 textarea').type(`pq`, { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('pq')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 'y']);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['*', 'p', 'q']);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.value.tree).to.eq('\uFF3F');
      });



      // press enter in mathinput 3

      cy.log("Pressing enter in third mathinput");
      cy.get('#\\/_mathinput2 textarea').type(`{enter}`, { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('pq')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 'y']);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['+', 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['*', 'p', 'q']);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(['*', 'p', 'q']);
      });


      // type abc in mathinput 2

      cy.log("Typing abc in second mathinput");
      cy.get(mathinput1aAnchor).type(`{end}{backspace}{backspace}{backspace}abc`, { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('pq')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abc')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c']);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c']);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['*', 'p', 'q']);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(mathinput1a.stateValues.value.tree).eqls(['+', 'x', 'y']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(['*', 'p', 'q']);
      });


      // leave mathinput 2

      cy.log("Leave second mathinput");
      cy.get(mathinput1aAnchor).blur();

      cy.log('Test values displayed in browser')
      // for some reason, invoking text before mathinput1 is changed to abc,
      // so call unescaped version first, as that will wait for the change
      cy.get(`#\\/_mathinput1 .mq-editable-field`).should('have.text', 'abc')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('pq')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abc')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abc')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c']);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c']);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['*', 'p', 'q']);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['*', 'a', 'b', 'c']);
        expect(mathinput1a.stateValues.value.tree).eqls(['*', 'a', 'b', 'c']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(['*', 'p', 'q']);
      });

      // Enter abc in mathinput 1

      cy.log("Enter abc in first mathinput");
      cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}{backspace}{backspace}abc{enter}`, { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('pq')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abc')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abc')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c']);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c']);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['*', 'p', 'q']);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['*', 'a', 'b', 'c']);
        expect(mathinput1a.stateValues.value.tree).eqls(['*', 'a', 'b', 'c']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(['*', 'p', 'q']);
      });


      // type u/v in mathinput 3

      cy.log("Typing u/v in third mathinput");
      cy.get('#\\/_mathinput2 textarea').type(`{end}{backspace}{backspace}{backspace}u/v`, { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('uv')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abc')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abc')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c']);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c']);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['/', 'u', 'v']);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['*', 'a', 'b', 'c']);
        expect(mathinput1a.stateValues.value.tree).eqls(['*', 'a', 'b', 'c']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(['*', 'p', 'q']);
      });


      // type d in mathinput 1

      cy.log("Typing d in first mathinput");
      cy.get('#\\/_mathinput1 textarea').type(`{end}d`, { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abcd')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('uv')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abc')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abcd')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c', 'd']);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c', 'd']);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['/', 'u', 'v']);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['*', 'a', 'b', 'c']);
        expect(mathinput1a.stateValues.value.tree).eqls(['*', 'a', 'b', 'c']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(['/', 'u', 'v']);
      });


      cy.log("Leaving first mathinput");
      cy.get('#\\/_mathinput1 textarea').blur();

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abcd')
      })
      // for some reason, invoking text before mathinput1a is changed to abcd,
      // so call unescaped version first, as that will wait for the change
      cy.get(mathinput1aEditiableFieldAnchor).should('have.text', 'abcd')
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abcd')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('uv')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abcd')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abcd')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c', 'd']);
        expect(mathinput1a.stateValues.immediateValue.tree).eqls(['*', 'a', 'b', 'c', 'd']);
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['/', 'u', 'v']);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['*', 'a', 'b', 'c', 'd']);
        expect(mathinput1a.stateValues.value.tree).eqls(['*', 'a', 'b', 'c', 'd']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(['/', 'u', 'v']);
      });

      cy.log("Clearing second mathinput");
      cy.get(mathinput1aAnchor).type("{end}{backspace}{backspace}{backspace}{backspace}", { force: true });

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abcd')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('uv')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('abcd')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('\uFF3F')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).to.eq('\uFF3F');
        expect(mathinput1a.stateValues.immediateValue.tree).to.eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['/', 'u', 'v']);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['*', 'a', 'b', 'c', 'd']);
        expect(mathinput1a.stateValues.value.tree).eqls(['*', 'a', 'b', 'c', 'd']);
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(['/', 'u', 'v']);
      });

      cy.log("Focus on third mathinput");
      cy.get('#\\/_mathinput2 textarea').focus();

      cy.log('Test values displayed in browser')
      cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
      })
      cy.get(mathinput1aEditiableFieldAnchor).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
      })
      cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('uv')
      })

      cy.get(math1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('\uFF3F')
      });
      cy.get(math2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('\uFF3F')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).to.eq('\uFF3F');
        expect(mathinput1a.stateValues.immediateValue.tree).to.eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['/', 'u', 'v']);
        expect(components['/_mathinput1'].stateValues.value.tree).to.eq('\uFF3F');
        expect(mathinput1a.stateValues.value.tree).to.eq('\uFF3F');
        expect(components['/_mathinput2'].stateValues.value.tree).eqls(['/', 'u', 'v']);
      });


    });

  })

  it('downstream from mathinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" /></p>
    <p>Copied mathinput: <copy tname="_mathinput1" name="mathinput2" /></p>
    <p>Value of original mathinput: <copy tname="_mathinput1" prop="value" name="value1" /></p>
    <p>Immediate value of original mathinput: <copy tname="_mathinput1" prop="immediateValue" name="immediate1" /></p>
    <p>Value of copied mathinput: <copy tname="mathinput2" prop="value" name="value2" /></p>
    <p>Immediate value of copied mathinput: <copy tname="mathinput2" prop="immediateValue" name="immediate2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinput2 = components['/mathinput2'].replacements[0];
      let mathinput2Anchor = cesc('#' + mathinput2.componentName) + " textarea";
      let value1Anchor = cesc('#' + components['/value1'].replacements[0].componentName);
      let immedateValue1Anchor = cesc('#' + components['/immediate1'].replacements[0].componentName);
      let value2Anchor = cesc('#' + components['/value2'].replacements[0].componentName);
      let immediateValue2Anchor = cesc('#' + components['/immediate2'].replacements[0].componentName);

      // cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x');
      // cy.get(mathinput2Anchor).should('have.value', '1 + 2 x');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });


      cy.window().then(() => {
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(components['/_math1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(mathinput2.stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['+', 1, ['*', 2, 'x']]);
      });

      cy.log('type new values')
      cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}{backspace}{backspace}{backspace}xy`, { force: true });

      // cy.get('#\\/_mathinput1_input').should('have.value', 'xy');
      // cy.get(mathinput2Anchor).should('have.value', '1 + 2 x');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });


      cy.window().then(() => {
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(components['/_math1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(mathinput2.stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'x', 'y']);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['*', 'x', 'y']);
      });


      cy.log('press enter')
      cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

      // cy.get('#\\/_mathinput1_input').should('have.value', 'xy');
      // cy.get(mathinput2Anchor).should('have.value', 'x y');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });
      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });


      cy.window().then(() => {
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['*', 'x', 'y']);
        expect(components['/_math1'].stateValues.value.tree).eqls(['*', 'x', 'y']);
        expect(mathinput2.stateValues.value.tree).eqls(['*', 'x', 'y']);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'x', 'y']);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['*', 'x', 'y']);
      });


      cy.log('enter new values in referenced')
      cy.get(mathinput2Anchor).type(`{end}{backspace}{backspace}qr{enter}`, { force: true });

      // cy.get('#\\/_mathinput1_input').should('have.value', 'q r');
      // cy.get(mathinput2Anchor).should('have.value', 'qr');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('qr')
      });

      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('qr')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('qr')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('qr')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('qr')
      });

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['*', 'q', 'r']);
        expect(components['/_math1'].stateValues.value.tree).eqls(['*', 'q', 'r']);
        expect(mathinput2.stateValues.value.tree).eqls(['*', 'q', 'r']);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'q', 'r']);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['*', 'q', 'r']);
      });

    });


    cy.log('prefill ignored');
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathinput prefill="x^2/9" bindValueTo="$_math1" /></p>
    <p>Copied mathinput: <copy tname="_mathinput1" name="mathinput2" /></p>
    <p>Value of original mathinput: <copy tname="_mathinput1" prop="value" name="value1" /></p>
    <p>Immediate value of original mathinput: <copy tname="_mathinput1" prop="immediateValue" name="immediate1" /></p>
    <p>Value of copied mathinput: <copy tname="mathinput2" prop="value" name="value2" /></p>
    <p>Immediate value of copied mathinput: <copy tname="mathinput2" prop="immediateValue" name="immediate2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinput2 = components['/mathinput2'].replacements[0];
      let mathinput2Anchor = cesc('#' + mathinput2.componentName + '_input');
      let value1Anchor = cesc('#' + components['/value1'].replacements[0].componentName);
      let immedateValue1Anchor = cesc('#' + components['/immediate1'].replacements[0].componentName);
      let value2Anchor = cesc('#' + components['/value2'].replacements[0].componentName);
      let immediateValue2Anchor = cesc('#' + components['/immediate2'].replacements[0].componentName);


      // cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x');
      // cy.get(mathinput2Anchor).should('have.value', '1 + 2 x');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2x')
      });

      cy.window().then(() => {
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(components['/_math1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(mathinput2.stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 1, ['*', 2, 'x']]);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['+', 1, ['*', 2, 'x']]);
      });


    })


    cy.log("normal downstream rules apply")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <p>Original math: <math simplify>1+<math>3x</math></math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" /></p>
    <p>Copied mathinput: <copy tname="_mathinput1" name="mathinput2" /></p>
    <p>Value of original mathinput: <copy tname="_mathinput1" prop="value" name="value1" /></p>
    <p>Immediate value of original mathinput: <copy tname="_mathinput1" prop="immediateValue" name="immediate1" /></p>
    <p>Value of copied mathinput: <copy tname="mathinput2" prop="value" name="value2" /></p>
    <p>Immediate value of copied mathinput: <copy tname="mathinput2" prop="immediateValue" name="immediate2" /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinput2 = components['/mathinput2'].replacements[0];
      let mathinput2Anchor = cesc('#' + mathinput2.componentName) + " textarea";
      let value1Anchor = cesc('#' + components['/value1'].replacements[0].componentName);
      let immedateValue1Anchor = cesc('#' + components['/immediate1'].replacements[0].componentName);
      let value2Anchor = cesc('#' + components['/value2'].replacements[0].componentName);
      let immediateValue2Anchor = cesc('#' + components['/immediate2'].replacements[0].componentName);


      // cy.get('#\\/_mathinput1_input').should('have.value', '3 x + 1');
      // cy.get(mathinput2Anchor).should('have.value', '3 x + 1');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x+1')
      });

      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x+1')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x+1')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x+1')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x+1')
      });

      cy.window().then(() => {
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', ['*', 3, 'x'], 1]);
        expect(mathinput2.stateValues.value.tree).eqls(['+', ['*', 3, 'x'], 1]);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', ['*', 3, 'x'], 1]);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['+', ['*', 3, 'x'], 1]);
        expect(components['/_math1'].stateValues.value.tree).eqls(['+', ['*', 3, 'x'], 1]);
        expect(components['/_math2'].stateValues.value.tree).eqls(['*', 3, 'x']);
      });


      cy.log('enter new values')
      cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}{backspace}{backspace}{backspace}xy{enter}`, { force: true });

      // cy.get('#\\/_mathinput1_input').should('have.value', 'xy');
      // cy.get(mathinput2Anchor).should('have.value', 'x y');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });

      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('xy')
      });

      cy.window().then(() => {
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['*', 'x', 'y']);
        expect(mathinput2.stateValues.value.tree).eqls(['*', 'x', 'y']);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'x', 'y']);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['*', 'x', 'y']);
        expect(components['/_math1'].stateValues.value.tree).eqls(['*', 'x', 'y']);
        expect(components['/_math2'].stateValues.value.tree).eqls(['+', ['*', 'x', 'y'], -1]);
      });


      cy.log('enter new values in reffed')
      cy.get(mathinput2Anchor).type(`{end}{backspace}{backspace}qr{enter}`, { force: true });

      // cy.get('#\\/_mathinput1_input').should('have.value', 'q r');
      // cy.get(mathinput2Anchor).should('have.value', 'qr');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('qr')
      });

      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('qr')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('qr')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('qr')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('qr')
      });


      cy.window().then(() => {
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['*', 'q', 'r']);
        expect(mathinput2.stateValues.value.tree).eqls(['*', 'q', 'r']);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['*', 'q', 'r']);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['*', 'q', 'r']);
        expect(components['/_math1'].stateValues.value.tree).eqls(['*', 'q', 'r']);
        expect(components['/_math2'].stateValues.value.tree).eqls(['+', ['*', 'q', 'r'], -1]);
      });

    });

    cy.log("values revert if not updatable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>d</text>
    <p>Original math: <math>1+<math>2x</math><math>z</math></math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" /></p>
    <p>Copied mathinput: <copy tname="_mathinput1" name="mathinput2" /></p>
    <p>Value of original mathinput: <copy tname="_mathinput1" prop="value" name="value1" /></p>
    <p>Immediate value of original mathinput: <copy tname="_mathinput1" prop="immediateValue" name="immediate1" /></p>
    <p>Value of copied mathinput: <copy tname="mathinput2" prop="value" name="value2" /></p>
    <p>Immediate value of copied mathinput: <copy tname="mathinput2" prop="immediateValue" name="immediate2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'd');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinput2 = components['/mathinput2'].replacements[0];
      let mathinput2Anchor = cesc('#' + mathinput2.componentName) + " textarea";
      let value1Anchor = cesc('#' + components['/value1'].replacements[0].componentName);
      let immedateValue1Anchor = cesc('#' + components['/immediate1'].replacements[0].componentName);
      let value2Anchor = cesc('#' + components['/value2'].replacements[0].componentName);
      let immediateValue2Anchor = cesc('#' + components['/immediate2'].replacements[0].componentName);

      // cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x z');
      // cy.get(mathinput2Anchor).should('have.value', '1 + 2 x z');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });

      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });


      cy.window().then(() => {
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(mathinput2.stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(components['/_math1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      });

      cy.log('enter new values, but they revert')
      cy.get('#\\/_mathinput1 textarea').type(`{end}{rightarrow}{backspace}{backspace}{backspace}{backspace}{backspace}xy{enter}`, { force: true });

      // cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x z');
      // cy.get(mathinput2Anchor).should('have.value', '1 + 2 x z');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });

      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });


      cy.window().then(() => {
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(mathinput2.stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(components['/_math1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      });


      cy.log('enter new values in reffed, but they revert')
      cy.get(mathinput2Anchor).type(`{end}{backspace}{backspace}{backspace}{backspace}{backspace}qr{enter}`, { force: true });

      // cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x z');
      // cy.get(mathinput2Anchor).should('have.value', '1 + 2 x z');

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });

      cy.get(value1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });
      cy.get(immedateValue1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });
      cy.get(value2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });
      cy.get(immediateValue2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1+2xz')
      });


      cy.window().then(() => {
        expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(mathinput2.stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(mathinput2.stateValues.immediateValue.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
        expect(components['/_math1'].stateValues.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      });
    })

  })

  it('mathinput based on value of mathinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>Original mathinput: <mathinput prefill="x+1"/></p>
    <p>mathinput based on mathinput: <mathinput bindValueTo="$_mathinput1" /></p>
    <p>Immediate value of original: <math name="originalimmediate"><copy prop="immediateValue" tname="_mathinput1"/></math></p>
    <p>Value of original: <math name="originalvalue"><copy prop="value" tname="_mathinput1"/></math></p>
    <p>Immediate value of second: <math name="secondimmediate"><copy prop="immediateValue" tname="_mathinput2"/></math></p>
    <p>Value of second: <math name="secondvalue"><copy prop="value" tname="_mathinput2"/></math></p>
  `}, "*");
    });

    // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 1');
    // cy.get('#\\/_mathinput2_input').should('have.value', 'x + 1');


    cy.get('#\\/originalimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get('#\\/originalvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get('#\\/secondimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get('#\\/secondvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput2'].stateValues.value.tree).eqls(['+', 'x', 1]);
    });


    cy.log('type 2 first mathinput')
    cy.get('#\\/_mathinput1 textarea').type(`{end}2`, { force: true });

    // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    // cy.get('#\\/_mathinput2_input').should('have.value', 'x + 1');

    cy.get('#\\/originalimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/originalvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get('#\\/secondimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get('#\\/secondvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput2'].stateValues.value.tree).eqls(['+', 'x', 1]);
    });


    cy.log('press enter')
    cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

    // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    // cy.get('#\\/_mathinput2_input').should('have.value', 'x + 12');

    cy.get('#\\/originalimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/originalvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/secondimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/secondvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput2'].stateValues.value.tree).eqls(['+', 'x', 12]);
    });


    cy.log('type 3 in second mathinput')
    cy.get('#\\/_mathinput2 textarea').type(`{end}3`, { force: true });

    // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    // cy.get('#\\/_mathinput2_input').should('have.value', 'x + 123');

    cy.get('#\\/originalimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/originalvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/secondimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+123')
    });
    cy.get('#\\/secondvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['+', 'x', 123]);
      expect(components['/_mathinput2'].stateValues.value.tree).eqls(['+', 'x', 12]);
    });

    cy.log('leave second mathinput')
    cy.get('#\\/_mathinput2 textarea').blur();

    // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 123');
    // cy.get('#\\/_mathinput2_input').should('have.value', 'x + 123');

    cy.get('#\\/originalimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+123')
    });
    cy.get('#\\/originalvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+123')
    });
    cy.get('#\\/secondimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+123')
    });
    cy.get('#\\/secondvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+123')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 123]);
      expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 123]);
      expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['+', 'x', 123]);
      expect(components['/_mathinput2'].stateValues.value.tree).eqls(['+', 'x', 123]);
    });
  })

  it('mathinput based on immediate value of mathinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>Original mathinput: <mathinput prefill="x+1"/></p>
    <p>mathinput based on mathinput: <mathinput bindValueTo="$(_mathinput1{prop='immediateValue'})" /></p>
    <p>Immediate value of original: <math name="originalimmediate"><copy prop="immediateValue" tname="_mathinput1"/></math></p>
    <p>Value of original: <math name="originalvalue"><copy prop="value" tname="_mathinput1"/></math></p>
    <p>Immediate value of second: <math name="secondimmediate"><copy prop="immediateValue" tname="_mathinput2"/></math></p>
    <p>Value of second: <math name="secondvalue"><copy prop="value" tname="_mathinput2"/></math></p>
  `}, "*");
    });

    // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 1');
    // cy.get('#\\/_mathinput2_input').should('have.value', 'x + 1');


    cy.get('#\\/originalimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get('#\\/originalvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get('#\\/secondimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get('#\\/secondvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput2'].stateValues.value.tree).eqls(['+', 'x', 1]);
    });


    cy.log('type 2 first mathinput')
    cy.get('#\\/_mathinput1 textarea').type(`{end}2`, { force: true });

    // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    // cy.get('#\\/_mathinput2_input').should('have.value', 'x + 12');

    cy.get('#\\/originalimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/originalvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get('#\\/secondimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/secondvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput2'].stateValues.value.tree).eqls(['+', 'x', 12]);
    });


    cy.log('press enter')
    cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

    // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    // cy.get('#\\/_mathinput2_input').should('have.value', 'x + 12');

    cy.get('#\\/originalimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/originalvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/secondimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/secondvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput2'].stateValues.value.tree).eqls(['+', 'x', 12]);
    });


    cy.log('type 3 in second mathinput')
    cy.get('#\\/_mathinput2 textarea').type(`{end}3`, { force: true });

    // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    // cy.get('#\\/_mathinput2_input').should('have.value', 'x + 123');

    cy.get('#\\/originalimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/originalvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get('#\\/secondimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+123')
    });
    cy.get('#\\/secondvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['+', 'x', 123]);
      expect(components['/_mathinput2'].stateValues.value.tree).eqls(['+', 'x', 12]);
    });

    cy.log('leave second mathinput')
    cy.get('#\\/_mathinput2 textarea').blur();

    // cy.get('#\\/_mathinput1_input').should('have.value', 'x + 123');
    // cy.get('#\\/_mathinput2_input').should('have.value', 'x + 123');

    cy.get('#\\/originalimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+123')
    });
    cy.get('#\\/originalvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+123')
    });
    cy.get('#\\/secondimmediate').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+123')
    });
    cy.get('#\\/secondvalue').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+123')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].stateValues.immediateValue.tree).eqls(['+', 'x', 123]);
      expect(components['/_mathinput1'].stateValues.value.tree).eqls(['+', 'x', 123]);
      expect(components['/_mathinput2'].stateValues.immediateValue.tree).eqls(['+', 'x', 123]);
      expect(components['/_mathinput2'].stateValues.value.tree).eqls(['+', 'x', 123]);
    });
  })

  it('accurately reduce vector length', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>Enter vector</text>
    <mathinput name="a"/>
    <copy tname="a" prop="value" assignNames="b" />
    `}, "*");
    });

    // verify fixed bug where didn't reduce size of a vector

    cy.get('#\\/_text1').should('have.text', 'Enter vector');

    cy.get('#\\/a textarea').type('(1,2,3){enter}', { force: true });
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2,3)')
    })
    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(2,3){enter}', { force: true });
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,3)')
    })
  })

  it('function symbols', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>f, g: <mathinput name="a"/></p>
    <p><copy tname="a" prop="value" assignNames="a2" /></p>

    <p>h, q: <mathinput name="b" functionSymbols="h q" /></p>
    <p><copy tname="b" prop="value" assignNames="b2" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a textarea').type('f(x){enter}', { force: true });
    cy.get('#\\/b textarea').type('f(x){enter}', { force: true });

    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)')
    })
    cy.get('#\\/b2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('fx')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'f', 'x']);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'f', 'x']);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 'f', 'x']);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 'f', 'x']);
    });

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}g(f){enter}', { force: true });
    cy.get('#\\/b textarea').type('{end}{backspace}{backspace}{backspace}{backspace}g(f){enter}', { force: true });

    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g(f)')
    })
    cy.get('#\\/b2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('gf')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'g', 'f']);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'g', 'f']);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 'g', 'f']);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 'g', 'f']);
    });

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}h(q){enter}', { force: true });
    cy.get('#\\/b textarea').type('{end}{backspace}{backspace}{backspace}{backspace}h(q){enter}', { force: true });

    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hq')
    })
    cy.get('#\\/b2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h(q)')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['*', 'h', 'q']);
      expect(components['/a2'].stateValues.value.tree).eqls(['*', 'h', 'q']);
      expect(components['/b'].stateValues.value.tree).eqls(['apply', 'h', 'q']);
      expect(components['/b2'].stateValues.value.tree).eqls(['apply', 'h', 'q']);
    });


    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}q(z){enter}', { force: true });
    cy.get('#\\/b textarea').type('{end}{backspace}{backspace}{backspace}{backspace}q(z){enter}', { force: true });

    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qz')
    })
    cy.get('#\\/b2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q(z)')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['*', 'q', 'z']);
      expect(components['/a2'].stateValues.value.tree).eqls(['*', 'q', 'z']);
      expect(components['/b'].stateValues.value.tree).eqls(['apply', 'q', 'z']);
      expect(components['/b2'].stateValues.value.tree).eqls(['apply', 'q', 'z']);
    });


  })

  it('display digits', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" displayDigits="5" prefill="sin(2x)"/></p>
    <p>a2: <copy tname="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy tname="a" prop="immediateValue" assignNames="a3" /></p>
    <p>a4: <copy tname="a" prop="value" assignNames="a4" displayDigits="16" /></p>
    <p>a5: <copy tname="a" prop="immediateValue" assignNames="a5" displayDigits="16" /></p>

    <p>b: <math name="b">10e^(3y)</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDigits="3" /></p>
    <p>b3: <copy tname="b2" prop="value" assignNames="b3" /></p>
    <p>b4: <copy tname="b2" prop="immediateValue" assignNames="b4" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(2x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('10e3y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
    });

    cy.get('#\\/a textarea').type('{end}{leftArrow}{leftArrow}{backspace}345.15389319', { force: true });
    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.15389319x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })

    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{rightArrow}{backspace}{backspace}2.047529344518{ctrl+end}{leftArrow}{leftArrow}{backspace}0.0000073013048309', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.15x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.047529344518e0.0000073013048309y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.05e0.0000073y')
    })

    // for some reason, blurring doesn't seem to get mq-editable-field to updates, so type enter
    cy.get('#\\/b2 textarea').type("{enter}", { force: true });

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.047529345e0.000007301304831y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.05e0.0000073y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.05e0.0000073y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.05e0.0000073y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 2.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 2.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 2.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });


    cy.get('#\\/a textarea').type('{end}{leftArrow}{leftArrow}{backspace}4', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.14x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
    });

    cy.get('#\\/a textarea').blur();

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.14x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
    });

    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{backspace}6', { force: true });

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.047529345e0.000007301304831y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('6.05e0.0000073y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.05e0.0000073y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.05e0.0000073y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 2.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 2.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });

    cy.get('#\\/b2 textarea').blur();

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.05e0.0000073y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('6.05e0.0000073y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.05e0.0000073y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.05e0.0000073y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });

  })

  it('display decimals', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" displayDecimals="2" prefill="sin(2x)"/></p>
    <p>a2: <copy tname="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy tname="a" prop="immediateValue" assignNames="a3" /></p>

    <p>b: <math name="b">10e^(3y)</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDecimals="8" /></p>
    <p>b3: <copy tname="b2" prop="value" assignNames="b3" /></p>
    <p>b4: <copy tname="b2" prop="immediateValue" assignNames="b4" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(2x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('10e3y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
    });

    cy.get('#\\/a textarea').type('{end}{leftArrow}{leftArrow}{backspace}345.15389319', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.15389319x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })

    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{rightArrow}{backspace}{backspace}2.047529344518{ctrl+end}{leftArrow}{leftArrow}{backspace}0.0000073013048309', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.15x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.047529344518e0.0000073013048309y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.04752934e0.0000073y')
    })

    // for some reason, blurring doesn't seem to get mq-editable-field to updates, so type enter
    cy.get('#\\/b2 textarea').type("{enter}", { force: true });

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.047529345e0.000007301304831y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.04752934e0.0000073y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.04752934e0.0000073y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.04752934e0.0000073y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 2.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 2.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 2.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });


    cy.get('#\\/a textarea').type('{end}{leftArrow}{leftArrow}{backspace}4', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.14x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
    });

    cy.get('#\\/a textarea').blur();

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.14x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
    });


    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{backspace}6', { force: true });

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.047529345e0.000007301304831y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('6.04752934e0.0000073y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2.04752934e0.0000073y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.04752934e0.0000073y')
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 2.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 2.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });

    cy.get('#\\/b2 textarea').blur();

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.04752934e0.0000073y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('6.04752934e0.0000073y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.04752934e0.0000073y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.04752934e0.0000073y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });

  })

  it('display small as zero', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" displayDigits="5" prefill="sin(2x)"/></p>
    <p>a2: <copy tname="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy tname="a" prop="immediatevalue" assignNames="a3" /></p>
    <p>a4: <copy tname="a" prop="value" assignNames="a4" displayDigits="16" /></p>
    <p>a5: <copy tname="a" prop="immediatevalue" assignNames="a5" displayDigits="16" /></p>
  
    <p>b: <math name="b">10e^(3y)</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDigits="3" /></p>
    <p>b3: <copy tname="b2" prop="value" assignNames="b3" /></p>
    <p>b4: <copy tname="b2" prop="immediatevalue" assignNames="b4" /></p>

    <p>c: <mathinput name="c" displayDigits="5" prefill="sin(2x)" displaySmallAsZero /></p>
    <p>c2: <copy tname="c" prop="value" assignNames="c2" /></p>
    <p>c3: <copy tname="c" prop="immediatevalue" assignNames="c3" /></p>

    <p>d: <math name="d">10e^(3y)</math></p>
    <p>d2: <mathinput name="d2" bindValueTo="$d"  displayDigits="3" displaySmallAsZero /></p>
    <p>d3: <copy tname="d2" prop="value" assignNames="d3" /></p>
    <p>d4: <copy tname="d2" prop="immediatevalue" assignNames="d4" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(2x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('10e3y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/c .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(2x)')
    })
    cy.get('#\\/c2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/c3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/d2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('10e3y')
    })
    cy.get('#\\/d3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })
    cy.get('#\\/d4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('10e3y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/c'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/c'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/c2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/c2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/c3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/c3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(components['/d'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/d2'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/d2'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/d3'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/d3'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/d4'].stateValues.value.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(components['/d4'].stateValues.valueForDisplay.tree).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
    });

    cy.get('#\\/a textarea').type('{end}{leftArrow}{leftArrow}{backspace}0.000000000000000472946384739473{enter}', { force: true });
    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{rightArrow}{backspace}{backspace}0.0000000000000934720357236{ctrl+end}{leftArrow}{leftArrow}{backspace}0.0000000000000073013048309{enter}', { force: true });
    cy.get('#\\/c textarea').type('{end}{leftArrow}{leftArrow}{backspace}0.000000000000000472946384739473{enter}', { force: true });
    cy.get('#\\/d2 textarea').type('{ctrl+home}{rightArrow}{rightArrow}{backspace}{backspace}0.0000000000000934720357236{ctrl+end}{leftArrow}{leftArrow}{backspace}0.0000000000000073013048309{enter}', { force: true }).blur();

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('sin(4.7295⋅10−16x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(4.7295⋅10−16x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(4.7295⋅10−16x)')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9.347203572⋅10−14e7.301304831⋅10−15y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('9.35⋅10−14e7.3⋅10−15y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9.35⋅10−14e7.3⋅10−15y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9.35⋅10−14e7.3⋅10−15y')
    })
    cy.get('#\\/c .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('sin(0)')
    })
    cy.get('#\\/c2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0)')
    })
    cy.get('#\\/c3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0)')
    })
    cy.get('#\\/d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9.347203572⋅10−14e7.301304831⋅10−15y')
    })
    cy.get('#\\/d2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('9.35⋅10−14')
    })
    cy.get('#\\/d3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9.35⋅10−14')
    })
    cy.get('#\\/d4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9.35⋅10−14')
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 4.7295e-16, 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 4.7295e-16, 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 4.7295e-16, 'x']]);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 9.35e-14, ['^', 'e', ['*', 7.3e-15, 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 9.35e-14, ['^', 'e', ['*', 7.3e-15, 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 9.35e-14, ['^', 'e', ['*', 7.3e-15, 'y']]]);
      expect(components['/c'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(components['/c'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', 0]);
      expect(components['/c2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(components['/c2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', 0]);
      expect(components['/c3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(components['/c3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', 0]);
      expect(components['/d'].stateValues.value.tree).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(components['/d2'].stateValues.value.tree).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(components['/d2'].stateValues.valueForDisplay.tree).eqls(9.35e-14);
      expect(components['/d3'].stateValues.value.tree).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(components['/d3'].stateValues.valueForDisplay.tree).eqls(9.35e-14);
      expect(components['/d4'].stateValues.value.tree).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(components['/d4'].stateValues.valueForDisplay.tree).eqls(9.35e-14);
    });

    cy.get('#\\/a textarea').type('{home}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{backspace}5{enter}', { force: true });
    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{backspace}8{enter}', { force: true });
    cy.get('#\\/c textarea').type('{end}{leftArrow}{leftArrow}3{enter}', { force: true });
    cy.get('#\\/d2 textarea').type('{ctrl+home}{rightArrow}{backspace}6{enter}', { force: true }).blur();

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('sin(5.7295⋅10−16x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(5.7295⋅10−16x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(5.7295⋅10−16x)')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8.35⋅10−14e7.3⋅10−15y')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('8.35⋅10−14e7.3⋅10−15y')
    })
    cy.get('#\\/b3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8.35⋅10−14e7.3⋅10−15y')
    })
    cy.get('#\\/b4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8.35⋅10−14e7.3⋅10−15y')
    })
    cy.get('#\\/c .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('sin(30)')
    })
    cy.get('#\\/c2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(30)')
    })
    cy.get('#\\/c3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(30)')
    })
    cy.get('#\\/d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.35⋅10−14')
    })
    cy.get('#\\/d2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('6.35⋅10−14')
    })
    cy.get('#\\/d3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.35⋅10−14')
    })
    cy.get('#\\/d4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6.35⋅10−14')
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(components['/a'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(components['/a2'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(components['/a2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(components['/a3'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(components['/a3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(components['/b'].stateValues.value.tree).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(components['/b2'].stateValues.value.tree).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(components['/b3'].stateValues.value.tree).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(components['/b3'].stateValues.valueForDisplay.tree).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(components['/b4'].stateValues.value.tree).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(components['/b4'].stateValues.valueForDisplay.tree).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(components['/c'].stateValues.value.tree).eqls(['apply', 'sin', 30]);
      expect(components['/c'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', 30]);
      expect(components['/c2'].stateValues.value.tree).eqls(['apply', 'sin', 30]);
      expect(components['/c2'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', 30]);
      expect(components['/c3'].stateValues.value.tree).eqls(['apply', 'sin', 30]);
      expect(components['/c3'].stateValues.valueForDisplay.tree).eqls(['apply', 'sin', 30]);
      expect(components['/d'].stateValues.value.tree).eqls(['*', 6.35, ['^', 10, ['-', 14]]]);
      expect(components['/d2'].stateValues.value.tree).eqls(['*', 6.35, ['^', 10, ['-', 14]]]);
      expect(components['/d2'].stateValues.valueForDisplay.tree).eqls(6.35e-14);
      expect(components['/d3'].stateValues.value.tree).eqls(['*', 6.35, ['^', 10, ['-', 14]]]);
      expect(components['/d3'].stateValues.valueForDisplay.tree).eqls(6.35e-14);
      expect(components['/d4'].stateValues.value.tree).eqls(['*', 6.35, ['^', 10, ['-', 14]]]);
      expect(components['/d4'].stateValues.valueForDisplay.tree).eqls(6.35e-14);
    });

  })

  it('display digits, change from downstream', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" displayDigits="5" prefill="3"/></p>

    <p>b: <math name="b">5</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDigits="3" /></p>

    <graph>
      <point name="p">($a, $b2)</point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eq(3);
      expect(components['/a'].stateValues.valueForDisplay.tree).eq(3)
      expect(components['/p'].stateValues.xs[0].tree).eq(3)
      expect(components['/b'].stateValues.value.tree).eq(5);
      expect(components['/b2'].stateValues.value.tree).eq(5);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eq(5);
      expect(components['/p'].stateValues.xs[1].tree).eq(5)
    });

    cy.get('#\\/a textarea').type('{end}{backspace}2.4295639461593{enter}', { force: true });
    cy.get('#\\/b2 textarea').type('{end}{backspace}9.3935596792746{enter}', { force: true }).blur();

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.4296')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9.393559679')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9.39')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eq(2.4295639461593);
      expect(components['/a'].stateValues.valueForDisplay.tree).eq(2.4296)
      expect(components['/p'].stateValues.xs[0].tree).eq(2.4295639461593)
      expect(components['/b'].stateValues.value.tree).eq(9.3935596792746);
      expect(components['/b2'].stateValues.value.tree).eq(9.3935596792746);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eq(9.39);
      expect(components['/p'].stateValues.xs[1].tree).eq(9.3935596792746)
    });


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/p'].movePoint({ x: 7.936497798143, y: 2.142218345836 });

      // have to add 'have.text' version to get it to wait
      cy.get('#\\/a .mq-editable-field').should('have.text', '7.9365')
      cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7.9365')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2.142218346')
      })
      cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.14')
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.value.tree).eq(7.936497798143);
        expect(components['/a'].stateValues.valueForDisplay.tree).eq(7.9365)
        expect(components['/p'].stateValues.xs[0].tree).eq(7.936497798143)
        expect(components['/b'].stateValues.value.tree).eq(2.142218345836);
        expect(components['/b2'].stateValues.value.tree).eq(2.142218345836);
        expect(components['/b2'].stateValues.valueForDisplay.tree).eq(2.14);
        expect(components['/p'].stateValues.xs[1].tree).eq(2.142218345836)
      });

    })


  })

  it('display decimals, change from downstream', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" displayDecimals="4" prefill="3"/></p>

    <p>b: <math name="b">5</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDecimals="2" /></p>

    <graph>
      <point name="p">($a, $b2)</point>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eq(3);
      expect(components['/a'].stateValues.valueForDisplay.tree).eq(3)
      expect(components['/p'].stateValues.xs[0].tree).eq(3)
      expect(components['/b'].stateValues.value.tree).eq(5);
      expect(components['/b2'].stateValues.value.tree).eq(5);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eq(5);
      expect(components['/p'].stateValues.xs[1].tree).eq(5)
    });

    cy.get('#\\/a textarea').type('{end}{backspace}2.4295639461593{enter}', { force: true });
    cy.get('#\\/b2 textarea').type('{end}{backspace}9.3935596792746{enter}', { force: true }).blur();

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.4296')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9.393559679')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9.39')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eq(2.4295639461593);
      expect(components['/a'].stateValues.valueForDisplay.tree).eq(2.4296)
      expect(components['/p'].stateValues.xs[0].tree).eq(2.4295639461593)
      expect(components['/b'].stateValues.value.tree).eq(9.3935596792746);
      expect(components['/b2'].stateValues.value.tree).eq(9.3935596792746);
      expect(components['/b2'].stateValues.valueForDisplay.tree).eq(9.39);
      expect(components['/p'].stateValues.xs[1].tree).eq(9.3935596792746)
    });


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/p'].movePoint({ x: 7.936497798143, y: 2.142218345836 });

      // have to add 'have.text' version to get it to wait
      cy.get('#\\/a .mq-editable-field').should('have.text', '7.9365')
      cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7.9365')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2.142218346')
      })
      cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.14')
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/a'].stateValues.value.tree).eq(7.936497798143);
        expect(components['/a'].stateValues.valueForDisplay.tree).eq(7.9365)
        expect(components['/p'].stateValues.xs[0].tree).eq(7.936497798143)
        expect(components['/b'].stateValues.value.tree).eq(2.142218345836);
        expect(components['/b2'].stateValues.value.tree).eq(2.142218345836);
        expect(components['/b2'].stateValues.valueForDisplay.tree).eq(2.14);
        expect(components['/p'].stateValues.xs[1].tree).eq(2.142218345836)
      });

    })


  })

  it('natural input to sqrt', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" /></p>
    <p>a2: <copy prop="value" tname="a" assignNames="a2" /></p>
    <p>a3: <copy prop="value" tname="a" simplify assignNames="a3" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a textarea').type('sqrt4{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('√4')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('√4')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })


  })


  it('substitute unicode', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" /></p>
    <p>a2: <copy prop="value" tname="a" assignNames="a2" /></p>
    <p>a3: <copy prop="value" tname="a" simplify assignNames="a3" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a textarea').type('α{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('α')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls("alpha");
      expect(components['/a2'].stateValues.value.tree).eqls("alpha");
      expect(components['/a3'].stateValues.value.tree).eqls("alpha");
    });


    cy.get('#\\/a textarea').type('{end}{backspace}\\alpha{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('α')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls("alpha");
      expect(components['/a2'].stateValues.value.tree).eqls("alpha");
      expect(components['/a3'].stateValues.value.tree).eqls("alpha");
    });


    cy.get('#\\/a textarea').type('{end}{backspace}y\u2212z{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y−z')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y−z')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y−z')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(["+", "y", ["-", "z"]]);
      expect(components['/a2'].stateValues.value.tree).eqls(["+", "y", ["-", "z"]]);
      expect(components['/a3'].stateValues.value.tree).eqls(["+", "y", ["-", "z"]]);
    });


    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}y-z{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y−z')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y−z')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y−z')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(["+", "y", ["-", "z"]]);
      expect(components['/a2'].stateValues.value.tree).eqls(["+", "y", ["-", "z"]]);
      expect(components['/a3'].stateValues.value.tree).eqls(["+", "y", ["-", "z"]]);
    });


    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}y\u22C5z{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y⋅z')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(["*", "y", "z"]);
      expect(components['/a2'].stateValues.value.tree).eqls(["*", "y", "z"]);
      expect(components['/a3'].stateValues.value.tree).eqls(["*", "y", "z"]);
    });

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}y*z{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y\u00B7z')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(["*", "y", "z"]);
      expect(components['/a2'].stateValues.value.tree).eqls(["*", "y", "z"]);
      expect(components['/a3'].stateValues.value.tree).eqls(["*", "y", "z"]);
    });


    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}y\u00B7z{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y\u00B7z')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(["*", "y", "z"]);
      expect(components['/a2'].stateValues.value.tree).eqls(["*", "y", "z"]);
      expect(components['/a3'].stateValues.value.tree).eqls(["*", "y", "z"]);
    });


    
    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}y\u00D7z{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y\u00D7z')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eqls(["*", "y", "z"]);
      expect(components['/a2'].stateValues.value.tree).eqls(["*", "y", "z"]);
      expect(components['/a3'].stateValues.value.tree).eqls(["*", "y", "z"]);
    });


  })


});