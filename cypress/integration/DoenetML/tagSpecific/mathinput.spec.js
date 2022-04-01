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
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('mathinput references', () => {

    // A fairly involved test
    // to check for bugs that have shown up only after multiple manipulations

    // Initial doenet code

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill='x+1' name="mi1" />
    <copy target="mi1" assignNames="mi1a"  />
    <copy prop='value' target="mi1" assignNames="v1" />
    <copy prop='immediatevalue' target="mi1" assignNames="iv1"  />
    <copy prop='value' target="mi1a" assignNames="v1a" />
    <copy prop='immediatevalue' target="mi1a" assignNames="iv1a"  />
    <mathinput name="mi2" />
    <copy prop='value' target="mi2" assignNames="v2" />
    <copy prop='immediatevalue' target="mi2" assignNames="iv2"  />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })

    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 1]);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 1]);
      expect(stateVariables['/mi2'].stateValues.immediateValue).to.eq('\uFF3F');
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 1]);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 1]);
      expect(stateVariables['/mi2'].stateValues.value).to.eq('\uFF3F');
    });


    cy.log("Type 2 in first mathinput");
    cy.get('#\\/mi1 textarea').type(`{end}2`, { force: true });
    cy.get(`#\\/iv1`).should('contain.text', 'x+12')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })

    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/mi2'].stateValues.immediateValue).to.eq('\uFF3F');
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 1]);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 1]);
      expect(stateVariables['/mi2'].stateValues.value).to.eq('\uFF3F');
    });


    // cy.log("Pressing Escape undoes change");
    // cy.get('#\\/mi1_input').type(`{esc}`);

    // cy.log('Test values displayed in browser')
    // cy.get('#\\/mi1_input').should('have.value', 'x + 1');
    // cy.get(`#\\/mi1a textarea`).should('have.value', 'x + 1');
    // cy.get('#\\/mi2_input').should('have.value', '');

    // cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('x+1')
    // });
    // cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('x+1')
    // });

    // cy.log('Test internal values are set to the correct values')
    // cy.window().then(async (win) => {
    //   stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 1]);
    //   expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 1]);
    //   expect(stateVariables['/mi2'].stateValues.immediateValue).to.eq('\uFF3F');
    //   expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 1]);
    //   expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 1]);
    //   expect(stateVariables['/mi2'].stateValues.value).to.eq('\uFF3F');
    // });


    cy.log("Changing to 3 in first mathinput");
    cy.get('#\\/mi1 textarea').type(`{end}{backspace}3`, { force: true });
    cy.get(`#\\/iv1`).should('contain.text', 'x+13')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x+13')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'x+13')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+13')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+13')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })

    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+13')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+13')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 13]);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 13]);
      expect(stateVariables['/mi2'].stateValues.immediateValue).to.eq('\uFF3F');
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 1]);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 1]);
      expect(stateVariables['/mi2'].stateValues.value).to.eq('\uFF3F');
    });


    cy.log("Pressing Enter in first mathinput");
    cy.get('#\\/mi1 textarea').type(`{enter}`, { force: true });
    cy.get(`#\\/v1`).should('contain.text', 'x+13')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+13')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+13')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })

    cy.get(`#\\/v1 .mjx-mrow`).should('contain.text', 'x+13')
    cy.get(`#\\/iv1 .mjx-mrow`).should('contain.text', 'x+13')
    cy.get(`#\\/v1a .mjx-mrow`).should('contain.text', 'x+13')
    cy.get(`#\\/iv1 .mjx-mrow`).should('contain.text', 'x+13')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+13')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+13')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+13')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+13')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 13]);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 13]);
      expect(stateVariables['/mi2'].stateValues.immediateValue).to.eq('\uFF3F');
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 13]);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 13]);
      expect(stateVariables['/mi2'].stateValues.value).to.eq('\uFF3F');
    });


    // cy.log("Pressing Escape does not undo change");
    // cy.get('#\\/mi1_input').type(`{esc}`);

    // cy.log('Test values displayed in browser')
    // cy.get('#\\/mi1_input').should('have.value', 'x + 13');
    // cy.get(`#\\/mi1a textarea`).should('have.value', 'x + 13');
    // cy.get('#\\/mi2_input').should('have.value', '');

    // cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('x+13')
    // });
    // cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('x+13')
    // });

    // cy.log('Test internal values are set to the correct values')
    // cy.window().then(async (win) => {
    //   stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 13]);
    //   expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 13]);
    //   expect(stateVariables['/mi2'].stateValues.immediateValue).to.eq('\uFF3F');
    //   expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 13]);
    //   expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 13]);
    //   expect(stateVariables['/mi2'].stateValues.value).to.eq('\uFF3F');
    // });



    cy.log("Erasing 13 and typing y second mathinput");
    cy.get('#\\/mi1 textarea').blur();
    cy.get(`#\\/mi1a textarea`).type(`{end}{backspace}{backspace}y`, { force: true });
    cy.get(`#\\/iv1`).should('contain.text', 'x+y')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x+y')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'x+y')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })

    cy.get(`#\\/iv1 .mjx-mrow`).should('contain.text', 'x+y')
    cy.get(`#\\/iv1a .mjx-mrow`).should('contain.text', 'x+y')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+13')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+13')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).to.eq('\uFF3F');
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 13]);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 13]);
      expect(stateVariables['/mi2'].stateValues.value).to.eq('\uFF3F');
    });


    cy.log("Changing focus to first mathinput");
    cy.get('#\\/mi1 textarea').focus();
    cy.get(`#\\/v1`).should('contain.text', 'x+y')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x+y')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'x+y')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })

    cy.get(`#\\/v1 .mjx-mrow`).should('contain.text', 'x+y')
    cy.get(`#\\/v1a .mjx-mrow`).should('contain.text', 'x+y')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).to.eq('\uFF3F');
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.value).to.eq('\uFF3F');
    });



    // cy.log("Changing escape doesn't do anything");
    // cy.get('#\\/mi1_input').type("{esc}");

    // cy.log('Test values displayed in browser')
    // cy.get('#\\/mi1_input').should('have.value', 'x + y');
    // cy.get(`#\\/mi1a textarea`).should('have.value', 'x + y');
    // cy.get('#\\/mi2_input').should('have.value', '');

    // cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('x+y')
    // });
    // cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('x+y')
    // });

    // cy.log('Test internal values are set to the correct values')
    // cy.window().then(async (win) => {
    //   stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 'y']);
    //   expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 'y']);
    //   expect(stateVariables['/mi2'].stateValues.immediateValue).to.eq('\uFF3F');
    //   expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 'y']);
    //   expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 'y']);
    //   expect(stateVariables['/mi2'].stateValues.value).to.eq('\uFF3F');
    // });


    // pq in third input

    cy.log("Typing pq in third mathinput");
    cy.get('#\\/mi2 textarea').type(`pq`, { force: true });
    cy.get(`#\\/iv2`).should('contain.text', 'pq')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'pq')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('pq')
    })


    cy.get(`#\\/iv2 .mjx-mrow`).should('contain.text', 'pq')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('pq')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'p', 'q']);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.value).to.eq('\uFF3F');
    });



    // press enter in mathinput 3

    cy.log("Pressing enter in third mathinput");
    cy.get('#\\/mi2 textarea').type(`{enter}`, { force: true });
    cy.get(`#\\/v2`).should('contain.text', 'pq')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+y')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('pq')
    })

    cy.get(`#\\/v2 .mjx-mrow`).should('contain.text', 'pq')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('pq')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('pq')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'p', 'q']);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['*', 'p', 'q']);
    });


    // type abc in mathinput 2

    cy.log("Typing abc in second mathinput");
    cy.get(`#\\/mi1a textarea`).type(`{end}{backspace}{backspace}{backspace}abc`, { force: true });
    cy.get(`#\\/iv1`).should('contain.text', 'abc')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'abc')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'abc')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('pq')
    })

    cy.get(`#\\/iv1 .mjx-mrow`).should('contain.text', 'abc')
    cy.get(`#\\/iv1a .mjx-mrow`).should('contain.text', 'abc')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('pq')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('pq')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'p', 'q']);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['*', 'p', 'q']);
    });


    // leave mathinput 2

    cy.log("Leave second mathinput");
    cy.get(`#\\/mi1a textarea`).blur();
    cy.get(`#\\/v1`).should('contain.text', 'abc')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'abc')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'abc')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('pq')
    })

    cy.get(`#\\/v1 .mjx-mrow`).should('contain.text', 'abc')
    cy.get(`#\\/v1a .mjx-mrow`).should('contain.text', 'abc')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('pq')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('pq')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'p', 'q']);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['*', 'p', 'q']);
    });

    // Enter abc in mathinput 1

    cy.log("Enter abc in first mathinput");
    cy.get('#\\/mi1 textarea').type(`{end}{backspace}{backspace}{backspace}`, { force: true });
    // pause after deleting so can detect change (given going from abc back to abc)
    cy.get(`#\\/iv1`).should('contain.text', '＿')
    cy.get('#\\/mi1 textarea').type(`abc{enter}`, { force: true });
    cy.get(`#\\/iv1`).should('contain.text', 'abc')
    cy.wait(100);  // since can't detect effect of {enter} given that v1 is already abc
    cy.get(`#\\/v1`).should('contain.text', 'abc')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'abc')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'abc')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('pq')
    })

    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('pq')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('pq')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'p', 'q']);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['*', 'p', 'q']);
    });


    // type u/v in mathinput 3

    cy.log("Typing u/v in third mathinput");
    cy.get('#\\/mi2 textarea').type(`{end}{backspace}{backspace}{backspace}u/v`, { force: true });
    cy.get(`#\\/iv2`).should('contain.text', 'uv')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'uv')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abc')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('uv')
    })

    cy.get(`#\\/iv2 .mjx-mrow`).should('contain.text', 'uv')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('pq')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['/', 'u', 'v']);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['*', 'p', 'q']);
    });


    // type d in mathinput 1

    cy.log("Typing d in first mathinput");
    cy.get('#\\/mi1 textarea').type(`{end}d`, { force: true });
    cy.get(`#\\/iv1`).should('contain.text', 'abcd')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'abcd')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'abcd')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abcd')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abcd')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('uv')
    })

    cy.get(`#\\/iv1 .mjx-mrow`).should('contain.text', 'abcd')
    cy.get(`#\\/v2 .mjx-mrow`).should('contain.text', 'uv')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abcd')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abcd')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['/', 'u', 'v']);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['*', 'a', 'b', 'c']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['/', 'u', 'v']);
    });


    cy.log("Leaving first mathinput");
    cy.get('#\\/mi1 textarea').blur();
    cy.get(`#\\/v1`).should('contain.text', 'abcd')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'abcd')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'abcd')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abcd')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('abcd')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('uv')
    })

    cy.get(`#\\/v1 .mjx-mrow`).should('contain.text', 'abcd')
    cy.get(`#\\/v1a .mjx-mrow`).should('contain.text', 'abcd')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abcd')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abcd')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abcd')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abcd')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['/', 'u', 'v']);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['/', 'u', 'v']);
    });

    cy.log("Clearing second mathinput");
    cy.get(`#\\/mi1a textarea`).type("{end}{backspace}{backspace}{backspace}{backspace}", { force: true });
    cy.get(`#\\/iv1`).should('contain.text', '\uFF3F')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('not.contain.text', 'a')
    cy.get(`#\\/mi1a .mq-editable-field`).should('not.contain.text', 'a')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('uv')
    })

    cy.get(`#\\/iv1 .mjx-mrow`).should('contain.text', '\uFF3F')
    cy.get(`#\\/iv1a .mjx-mrow`).should('contain.text', '\uFF3F')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abcd')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uFF3F')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abcd')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uFF3F')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).to.eq('\uFF3F');
      expect(stateVariables['/mi1a'].stateValues.immediateValue).to.eq('\uFF3F');
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['/', 'u', 'v']);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['/', 'u', 'v']);
    });

    cy.log("Focus on third mathinput");
    cy.get('#\\/mi2 textarea').focus();
    cy.get(`#\\/v1`).should('contain.text', '\uFF3F')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('not.contain.text', 'abcd')
    cy.get(`#\\/mi1a .mq-editable-field`).should('not.contain.text', 'abcd')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('uv')
    })

    cy.get(`#\\/v1 .mjx-mrow`).should('contain.text', '\uFF3F')
    cy.get(`#\\/v1a .mjx-mrow`).should('contain.text', '\uFF3F')
    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uFF3F')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uFF3F')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uFF3F')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uFF3F')
    });
    cy.get(`#\\/v2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    });
    cy.get(`#\\/iv2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).to.eq('\uFF3F');
      expect(stateVariables['/mi1a'].stateValues.immediateValue).to.eq('\uFF3F');
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['/', 'u', 'v']);
      expect(stateVariables['/mi1'].stateValues.value).to.eq('\uFF3F');
      expect(stateVariables['/mi1a'].stateValues.value).to.eq('\uFF3F');
      expect(stateVariables['/mi2'].stateValues.value).eqls(['/', 'u', 'v']);
    });


  });

  it('mathinput references with invalid math expressions', () => {
    let doenetML = `
    <text>a</text>
    <mathinput name="mi1" />
    <copy target="mi1" assignNames="mi1a"  />
    <copy prop='value' target="mi1" assignNames="v1" />
    <copy prop='immediatevalue' target="mi1" assignNames="iv1"  />
    <copy prop='value' target="mi1a" assignNames="v1a" />
    <copy prop='immediatevalue' target="mi1a" assignNames="iv1a"  />
    <p><booleaninput name="bi" /> <copy prop="value" target="bi" assignNames="b" /></p>
    `;

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })

    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls('＿');
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls('＿');
      expect(stateVariables['/mi1'].stateValues.value).eqls('＿');
      expect(stateVariables['/mi1a'].stateValues.value).eqls('＿');
    });


    cy.log("Type x- in first mathinput");
    cy.get('#\\/mi1 textarea').type(`x`, { force: true });
    // pause so that can detect change
    cy.get(`#\\/iv1`).should('contain.text', 'x')
    cy.get('#\\/mi1 textarea').type(`-`, { force: true }).blur();
    cy.get(`#\\/iv1`).should('contain.text', '\uFF3F')

    // since v1 was already invalid, can't be sure when have waited long enough
    // so click boolean input and wait for its effect to take
    cy.get('#\\/bi_input').click()
    cy.get('#\\/b').should('have.text', 'true')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x−')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'x−')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−')
    })

    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls('＿');
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls('＿');
      expect(stateVariables['/mi1'].stateValues.value).eqls('＿');
      expect(stateVariables['/mi1a'].stateValues.value).eqls('＿');
    });

    // pause 2 seconds to make sure 1 second debounce for saving was satisfied
    cy.wait(2000);

    cy.log('reload page')
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // the DOM will display even before core is ready
    // so to make sure core has loaded, click boolean and wait for it to change
    cy.get("#\\/b").should('have.text', 'true');
    cy.get('#\\/bi_input').click();
    cy.get("#\\/b").should('have.text', 'false');


    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x−')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'x−')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−')
    })

    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls('＿');
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls('＿');
      expect(stateVariables['/mi1'].stateValues.value).eqls('＿');
      expect(stateVariables['/mi1a'].stateValues.value).eqls('＿');
    });

    cy.log("Add y in copied mathinput");
    cy.get('#\\/mi1a textarea').type(`{end}y`, { force: true });
    cy.get(`#\\/iv1`).should('contain.text', 'x−y')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x−y')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'x−y')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−y')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−y')
    })

    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−y')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−y')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', ['-', 'y']]);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', ['-', 'y']]);
      expect(stateVariables['/mi1'].stateValues.value).eqls('＿');
      expect(stateVariables['/mi1a'].stateValues.value).eqls('＿');
    });


    cy.log("blur");
    cy.get('#\\/mi1a textarea').blur();
    cy.get(`#\\/v1`).should('contain.text', 'x−y')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/v1 .mjx-mrow`).should('contain.text', 'x−y')
    cy.get(`#\\/v1a .mjx-mrow`).should('contain.text', 'x−y')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x−y')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'x−y')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−y')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−y')
    })


    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−y')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−y')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−y')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−y')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', ['-', 'y']]);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', ['-', 'y']]);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', ['-', 'y']]);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', ['-', 'y']]);
    });


    cy.log("Add * in copied mathinput");
    cy.get('#\\/mi1a textarea').type(`{end}*`, { force: true });
    cy.get(`#\\/iv1`).should('contain.text', '\uFF3F')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x−y·')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'x−y·')
    cy.get(`#\\/iv1 .mjx-mrow`).should('contain.text', '＿')
    cy.get(`#\\/iv1a .mjx-mrow`).should('contain.text', '＿')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−y·')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−y·')
    })


    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−y')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−y')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls('＿');
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls('＿');
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', ['-', 'y']]);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', ['-', 'y']]);
    });


    cy.log("Add z in first mathinput");
    cy.get('#\\/mi1 textarea').type(`{end}`, { force: true });
    cy.get('#\\/mi1 textarea').type(`{end}z`, { force: true });
    cy.get(`#\\/iv1`).should('contain.text', 'x−yz')

    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x−y·z')
    cy.get(`#\\/mi1a .mq-editable-field`).should('contain.text', 'x−y·z')
    cy.get(`#\\/iv1 .mjx-mrow`).should('contain.text', 'x−yz')
    cy.get(`#\\/iv1a .mjx-mrow`).should('contain.text', 'x−yz')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−y·z')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−y·z')
    })


    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−yz')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−yz')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', ['-', ['*', 'y', 'z']]]);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', ['-', ['*', 'y', 'z']]]);
      expect(stateVariables['/mi1'].stateValues.value).eqls('＿');
      expect(stateVariables['/mi1a'].stateValues.value).eqls('＿');
    });


    cy.log("Press enter");
    cy.get('#\\/mi1 textarea').type(`{enter}`, { force: true });

    cy.get(`#\\/v1 .mjx-mrow`).should('contain.text', 'x−yz')
    cy.get(`#\\/v1a .mjx-mrow`).should('contain.text', 'x−yz')


    cy.log('Test values displayed in browser')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−y·z')
    })
    cy.get(`#\\/mi1a .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x−y·z')
    })


    cy.get(`#\\/v1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−yz')
    });
    cy.get(`#\\/iv1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−yz')
    });
    cy.get(`#\\/v1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−yz')
    });
    cy.get(`#\\/iv1a`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x−yz')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 'x', ['-', ['*', 'y', 'z']]]);
      expect(stateVariables['/mi1a'].stateValues.immediateValue).eqls(['+', 'x', ['-', ['*', 'y', 'z']]]);
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 'x', ['-', ['*', 'y', 'z']]]);
      expect(stateVariables['/mi1a'].stateValues.value).eqls(['+', 'x', ['-', ['*', 'y', 'z']]]);
    });


  })

  it('downstream from mathinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathinput: <copy target="mi1" assignNames="mi2" /></p>
    <p>Value of original mathinput: <copy target="mi1" prop="value" assignNames="value1" /></p>
    <p>Immediate value of original mathinput: <copy target="mi1" prop="immediateValue" assignNames="immediate1" /></p>
    <p>Value of copied mathinput: <copy target="mi2" prop="value" assignNames="value2" /></p>
    <p>Immediate value of copied mathinput: <copy target="mi2" prop="immediateValue" assignNames="immediate2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1+2x')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1+2x')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['+', 1, ['*', 2, 'x']]);
    });

    cy.log('type new values')
    cy.get('#\\/mi1 textarea').type(`{end}{backspace}{backspace}{backspace}{backspace}xy`, { force: true, delay: 50 });

    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', 'xy')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', 'xy')

    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'xy')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'xy')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'x', 'y']);
    });


    cy.log('press enter')
    cy.get('#\\/mi1 textarea').type(`{enter}`, { force: true });

    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', 'xy')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', 'xy')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', 'xy')

    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'xy')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'xy')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })


    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });
    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['*', 'x', 'y']);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['*', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['*', 'x', 'y']);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'x', 'y']);
    });


    cy.log('enter new values in referenced')
    cy.get(`#\\/mi2 textarea`).type(`{end}{backspace}{backspace}qr{enter}`, { force: true }).blur();

    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', 'qr')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', 'qr')
    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', 'qr')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', 'qr')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', 'qr')

    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'qr')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'qr')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('qr')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('qr')
    })


    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['*', 'q', 'r']);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['*', 'q', 'r']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['*', 'q', 'r']);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'q', 'r']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'q', 'r']);
    });


    cy.reload();

    cy.log('prefill ignored');
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <p>Original math: <math>1+2x</math></p>
    <p>MathInput based on math: <mathinput prefill="x^2/9" bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathinput: <copy target="mi1" assignNames="mi2" /></p>
    <p>Value of original mathinput: <copy target="mi1" prop="value" assignNames="value1" /></p>
    <p>Immediate value of original mathinput: <copy target="mi1" prop="immediateValue" assignNames="immediate1" /></p>
    <p>Value of copied mathinput: <copy target="mi2" prop="value" assignNames="value2" /></p>
    <p>Immediate value of copied mathinput: <copy target="mi2" prop="immediateValue" assignNames="immediate2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded


    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1+2x')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1+2x')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 1, ['*', 2, 'x']]);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['+', 1, ['*', 2, 'x']]);
    });


    cy.reload();

    cy.log("normal downstream rules apply")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <p>Original math: <math simplify>1+<math>3x</math></math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathinput: <copy target="mi1" assignNames="mi2" /></p>
    <p>Value of original mathinput: <copy target="mi1" prop="value" assignNames="value1" /></p>
    <p>Immediate value of original mathinput: <copy target="mi1" prop="immediateValue" assignNames="immediate1" /></p>
    <p>Value of copied mathinput: <copy target="mi2" prop="value" assignNames="value2" /></p>
    <p>Immediate value of copied mathinput: <copy target="mi2" prop="immediateValue" assignNames="immediate2" /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c');  // to wait until loaded


    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3x+1')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3x+1')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x+1')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x+1')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x+1')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x+1')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x+1')
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', ['*', 3, 'x'], 1]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['+', ['*', 3, 'x'], 1]);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', ['*', 3, 'x'], 1]);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['+', ['*', 3, 'x'], 1]);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', ['*', 3, 'x'], 1]);
      expect(stateVariables['/_math2'].stateValues.value).eqls(['*', 3, 'x']);
    });


    cy.log('type new values')
    cy.get('#\\/mi1 textarea').type(`{end}{backspace}{backspace}{backspace}{backspace}xy{enter}`, { force: true });

    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', 'xy')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', 'xy')
    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', 'xy')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', 'xy')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', 'xy')

    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'xy')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'xy')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['*', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['*', 'x', 'y']);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'x', 'y']);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['*', 'x', 'y']);
      expect(stateVariables['/_math2'].stateValues.value).eqls(['+', ['*', 'x', 'y'], -1]);
    });


    cy.log('enter new values in reffed')
    cy.get(`#\\/mi2 textarea`).type(`{end}{backspace}{backspace}qr{enter}`, { force: true });

    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', 'qr')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', 'qr')
    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', 'qr')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', 'qr')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', 'qr')


    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'qr')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'qr')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('qr')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('qr')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['*', 'q', 'r']);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['*', 'q', 'r']);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'q', 'r']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'q', 'r']);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['*', 'q', 'r']);
      expect(stateVariables['/_math2'].stateValues.value).eqls(['+', ['*', 'q', 'r'], -1]);
    });



  })

  it('values revert if bind to value that is not updatable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Original math: <math>1+<math>2x</math><math>z</math></math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathinput: <copy target="mi1" assignNames="mi2" /></p>
    <p>Value of original mathinput: <copy target="mi1" prop="value" assignNames="value1" /></p>
    <p>Immediate value of original mathinput: <copy target="mi1" prop="immediateValue" assignNames="immediate1" /></p>
    <p>Value of copied mathinput: <copy target="mi2" prop="value" assignNames="value2" /></p>
    <p>Immediate value of copied mathinput: <copy target="mi2" prop="immediateValue" assignNames="immediate2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1+2xz')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1+2xz')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
    });

    cy.log('type new values')
    cy.get('#\\/mi1 textarea').type(`{end}{rightarrow}{backspace}{backspace}{backspace}{backspace}{backspace}xy`, { force: true, delay: 50 });

    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', 'xy')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', 'xy')


    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'xy')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'xy')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'x', 'y']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'x', 'y']);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
    });


    cy.log('value revert when press enter')
    cy.get('#\\/mi1 textarea').type(`{enter}`, { force: true });

    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', '1+2xz')

    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', '1+2xz')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', '1+2xz')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1+2xz')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1+2xz')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
    });


    cy.log('type new values in copy')
    cy.get(`#\\/mi2 textarea`).type(`{end}{backspace}{backspace}{backspace}{backspace}{backspace}qr`, { force: true });

    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', 'qr')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', 'qr')


    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'qr')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'qr')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('qr')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('qr')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['*', 'q', 'r']);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['*', 'q', 'r']);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
    });


    cy.log('values revert when blur')
    cy.get(`#\\/mi2 textarea`).blur();


    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', '1+2xz')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', '1+2xz')


    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', '1+2xz')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', '1+2xz')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1+2xz')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1+2xz')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi2'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi1'].stateValues.immediateValue).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/mi2'].stateValues.immediateValue).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(stateVariables['/_math1'].stateValues.value).eqls(['+', 1, ['*', 2, 'x', 'z']]);
    });

  })

  it('values revert if bind to fixed value', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Original math: <math fixed>x</math></p>
    <p>MathInput based on math: <mathinput bindValueTo="$_math1" name="mi1" /></p>
    <p>Copied mathinput: <copy target="mi1" assignNames="mi2" /></p>
    <p>Value of original mathinput: <copy target="mi1" prop="value" assignNames="value1" /></p>
    <p>Immediate value of original mathinput: <copy target="mi1" prop="immediateValue" assignNames="immediate1" /></p>
    <p>Value of copied mathinput: <copy target="mi2" prop="value" assignNames="value2" /></p>
    <p>Immediate value of copied mathinput: <copy target="mi2" prop="immediateValue" assignNames="immediate2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eq('x');
      expect(stateVariables['/mi2'].stateValues.value).eq('x');
      expect(stateVariables['/mi1'].stateValues.immediateValue).eq('x');
      expect(stateVariables['/mi2'].stateValues.immediateValue).eq('x');
      expect(stateVariables['/_math1'].stateValues.value).eq('x');
    });

    cy.log('type new values')
    // Note: had to add a larger delay in typing 
    // or MathJax consistently didn't correctly update the second immediate value.
    // Not sure what is going on here.
    cy.get('#\\/mi1 textarea').type(`{end}{backspace}y`, { force: true, delay: 100 });

    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', 'y')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', 'y')
    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', 'x')

    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'y')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'y')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eq('x');
      expect(stateVariables['/mi2'].stateValues.value).eq('x');
      expect(stateVariables['/mi1'].stateValues.immediateValue).eq('y');
      expect(stateVariables['/mi2'].stateValues.immediateValue).eq('y');
      expect(stateVariables['/_math1'].stateValues.value).eq('x');
    });


    cy.log('value revert when press enter')
    cy.get('#\\/mi1 textarea').type(`{enter}`, { force: true });

    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', 'x')


    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'x')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })


    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eq('x');
      expect(stateVariables['/mi2'].stateValues.value).eq('x');
      expect(stateVariables['/mi1'].stateValues.immediateValue).eq('x');
      expect(stateVariables['/mi2'].stateValues.immediateValue).eq('x');
      expect(stateVariables['/_math1'].stateValues.value).eq('x');
    });


    cy.log('type new values in copy')
    cy.get(`#\\/mi2 textarea`).type(`{end}{backspace}z`, { force: true });

    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', 'z')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', 'z')
    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', 'x')

    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'z')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'z')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
    })


    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eq('x');
      expect(stateVariables['/mi2'].stateValues.value).eq('x');
      expect(stateVariables['/mi1'].stateValues.immediateValue).eq('z');
      expect(stateVariables['/mi2'].stateValues.immediateValue).eq('z');
      expect(stateVariables['/_math1'].stateValues.value).eq('x');
    });


    cy.log('values revert when blur')
    cy.get(`#\\/mi2 textarea`).blur();


    cy.get(`#\\/immediate1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/immediate2 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/_math1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/value1 .mjx-mrow`).should('contain.text', 'x')
    cy.get(`#\\/value2 .mjx-mrow`).should('contain.text', 'x')


    cy.get(`#\\/mi1 .mq-editable-field`).should('contain.text', 'x')
    cy.get(`#\\/mi2 .mq-editable-field`).should('contain.text', 'x')
    cy.get(`#\\/mi1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get(`#\\/mi2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });

    cy.get(`#\\/value1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/immediate1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/value2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get(`#\\/immediate2`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi1'].stateValues.value).eq('x');
      expect(stateVariables['/mi2'].stateValues.value).eq('x');
      expect(stateVariables['/mi1'].stateValues.immediateValue).eq('x');
      expect(stateVariables['/mi2'].stateValues.immediateValue).eq('x');
      expect(stateVariables['/_math1'].stateValues.value).eq('x');
    });

  })

  it('mathinput based on value of mathinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>Original mathinput: <mathinput prefill="x+1"/></p>
    <p>mathinput based on mathinput: <mathinput bindValueTo="$_mathinput1" /></p>
    <p>Immediate value of original: <math name="originalimmediate"><copy prop="immediateValue" target="_mathinput1"/></math></p>
    <p>Value of original: <math name="originalvalue"><copy prop="value" target="_mathinput1"/></math></p>
    <p>Immediate value of second: <math name="secondimmediate"><copy prop="immediateValue" target="_mathinput2"/></math></p>
    <p>Value of second: <math name="secondvalue"><copy prop="value" target="_mathinput2"/></math></p>
  `}, "*");
    });

    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
    })

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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.immediateValue).eqls(['+', 'x', 1]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(['+', 'x', 1]);
      expect(stateVariables['/_mathinput2'].stateValues.immediateValue).eqls(['+', 'x', 1]);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(['+', 'x', 1]);
    });


    cy.log('type 2 first mathinput')
    cy.get('#\\/_mathinput1 textarea').type(`{end}2`, { force: true });

    cy.get('#\\/originalimmediate .mjx-mrow').should('contain.text', 'x+12')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', 'x+1')
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
    })

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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(['+', 'x', 1]);
      expect(stateVariables['/_mathinput2'].stateValues.immediateValue).eqls(['+', 'x', 1]);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(['+', 'x', 1]);
    });


    cy.log('press enter')
    cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

    cy.get('#\\/originalvalue .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/originalimmediate .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/secondimmediate .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/secondvalue .mjx-mrow').should('contain.text', 'x+12')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })


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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput2'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(['+', 'x', 12]);
    });


    cy.log('type 3 in second mathinput')
    cy.get('#\\/_mathinput2 textarea').type(`{end}3`, { force: true });

    cy.get('#\\/secondimmediate .mjx-mrow').should('contain.text', 'x+123')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', 'x+123')
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+123')
    })


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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput2'].stateValues.immediateValue).eqls(['+', 'x', 123]);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(['+', 'x', 12]);
    });

    cy.log('leave second mathinput')
    cy.get('#\\/_mathinput2 textarea').blur();

    cy.get('#\\/originalvalue .mjx-mrow').should('contain.text', 'x+123')
    cy.get('#\\/secondvalue .mjx-mrow').should('contain.text', 'x+123')
    cy.get('#\\/originalimmediate .mjx-mrow').should('contain.text', 'x+123')
    cy.get('#\\/secondimmediate .mjx-mrow').should('contain.text', 'x+123')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'x+123')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', 'x+123')
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+123')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+123')
    })


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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.immediateValue).eqls(['+', 'x', 123]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(['+', 'x', 123]);
      expect(stateVariables['/_mathinput2'].stateValues.immediateValue).eqls(['+', 'x', 123]);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(['+', 'x', 123]);
    });
  })

  it('mathinput based on immediate value of mathinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>Original mathinput: <mathinput prefill="x+1"/></p>
    <p>mathinput based on mathinput: <mathinput bindValueTo="$(_mathinput1{prop='immediateValue'})" /></p>
    <p>Immediate value of original: <math name="originalimmediate"><copy prop="immediateValue" target="_mathinput1"/></math></p>
    <p>Value of original: <math name="originalvalue"><copy prop="value" target="_mathinput1"/></math></p>
    <p>Immediate value of second: <math name="secondimmediate"><copy prop="immediateValue" target="_mathinput2"/></math></p>
    <p>Value of second: <math name="secondvalue"><copy prop="value" target="_mathinput2"/></math></p>
  `}, "*");
    });

    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+1')
    })

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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.immediateValue).eqls(['+', 'x', 1]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(['+', 'x', 1]);
      expect(stateVariables['/_mathinput2'].stateValues.immediateValue).eqls(['+', 'x', 1]);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(['+', 'x', 1]);
    });


    cy.log('type 2 first mathinput')
    cy.get('#\\/_mathinput1 textarea').type(`{end}2`, { force: true });

    cy.get('#\\/originalimmediate .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/secondimmediate .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/secondvalue .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/originalvalue .mjx-mrow').should('contain.text', 'x+1')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })


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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(['+', 'x', 1]);
      expect(stateVariables['/_mathinput2'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(['+', 'x', 12]);
    });


    cy.log('press enter')
    cy.get('#\\/_mathinput1 textarea').type(`{enter}`, { force: true });

    cy.get('#\\/originalvalue .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/secondvalue .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/originalimmediate .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/secondimmediate .mjx-mrow').should('contain.text', 'x+12')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })

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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput2'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(['+', 'x', 12]);
    });


    cy.log('type 3 in second mathinput')
    cy.get('#\\/_mathinput2 textarea').type(`{end}3`, { force: true });

    cy.get('#\\/secondimmediate .mjx-mrow').should('contain.text', 'x+123')
    cy.get('#\\/originalimmediate .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/originalvalue .mjx-mrow').should('contain.text', 'x+12')
    cy.get('#\\/secondvalue .mjx-mrow').should('contain.text', 'x+12')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'x+12')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', 'x+123')
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+12')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+123')
    })
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.immediateValue).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(['+', 'x', 12]);
      expect(stateVariables['/_mathinput2'].stateValues.immediateValue).eqls(['+', 'x', 123]);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(['+', 'x', 12]);
    });

    cy.log('leave second mathinput')
    cy.get('#\\/_mathinput2 textarea').blur();


    cy.get('#\\/originalimmediate .mjx-mrow').should('contain.text', 'x+123')
    cy.get('#\\/originalvalue .mjx-mrow').should('contain.text', 'x+123')
    cy.get('#\\/secondvalue .mjx-mrow').should('contain.text', 'x+123')
    cy.get('#\\/secondimmediate .mjx-mrow').should('contain.text', 'x+123')

    cy.get(`#\\/_mathinput1 .mq-editable-field`).should('contain.text', 'x+123')
    cy.get(`#\\/_mathinput2 .mq-editable-field`).should('contain.text', 'x+123')
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+123')
    })
    cy.get(`#\\/_mathinput2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x+123')
    })

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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_mathinput1'].stateValues.immediateValue).eqls(['+', 'x', 123]);
      expect(stateVariables['/_mathinput1'].stateValues.value).eqls(['+', 'x', 123]);
      expect(stateVariables['/_mathinput2'].stateValues.immediateValue).eqls(['+', 'x', 123]);
      expect(stateVariables['/_mathinput2'].stateValues.value).eqls(['+', 'x', 123]);
    });
  })

  it('accurately reduce vector length', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>Enter vector</text>
    <mathinput name="a"/>
    <copy target="a" prop="value" assignNames="b" />
    `}, "*");
    });

    // verify fixed bug where didn't reduce size of a vector

    cy.get('#\\/_text1').should('have.text', 'Enter vector');

    cy.get('#\\/a textarea').type('(1,2,3){enter}', { force: true });
    cy.get('#\\/b .mjx-mrow').should('contain.text', '(1,2,3)')
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2,3)')
    })
    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}(2,3){enter}', { force: true });
    cy.get('#\\/b .mjx-mrow').should('contain.text', '(2,3)')
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,3)')
    })
  })

  it('function symbols', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>f, g: <mathinput name="a"/></p>
    <p><copy target="a" prop="value" assignNames="a2" /></p>

    <p>h, q: <mathinput name="b" functionSymbols="h q" /></p>
    <p><copy target="b" prop="value" assignNames="b2" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a textarea').type('f(x){enter}', { force: true });
    cy.get('#\\/b textarea').type('f(x){enter}', { force: true });

    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'f(x)')
    cy.get('#\\/b2 .mjx-mrow').should('contain.text', 'fx')
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)')
    })
    cy.get('#\\/b2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('fx')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'f', 'x']);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'f', 'x']);
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 'f', 'x']);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 'f', 'x']);
    });

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}g(f){enter}', { force: true });
    cy.get('#\\/b textarea').type('{end}{backspace}{backspace}{backspace}{backspace}g(f){enter}', { force: true });


    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'g(f)')
    cy.get('#\\/b2 .mjx-mrow').should('contain.text', 'gf')
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g(f)')
    })
    cy.get('#\\/b2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('gf')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'g', 'f']);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'g', 'f']);
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 'g', 'f']);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 'g', 'f']);
    });

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}h(q){enter}', { force: true });
    cy.get('#\\/b textarea').type('{end}{backspace}{backspace}{backspace}{backspace}h(q){enter}', { force: true });


    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'hq')
    cy.get('#\\/b2 .mjx-mrow').should('contain.text', 'h(q)')
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hq')
    })
    cy.get('#\\/b2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h(q)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['*', 'h', 'q']);
      expect(stateVariables['/a2'].stateValues.value).eqls(['*', 'h', 'q']);
      expect(stateVariables['/b'].stateValues.value).eqls(['apply', 'h', 'q']);
      expect(stateVariables['/b2'].stateValues.value).eqls(['apply', 'h', 'q']);
    });


    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}q(z){enter}', { force: true });
    cy.get('#\\/b textarea').type('{end}{backspace}{backspace}{backspace}{backspace}q(z){enter}', { force: true });


    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'qz')
    cy.get('#\\/b2 .mjx-mrow').should('contain.text', 'q(z)')
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qz')
    })
    cy.get('#\\/b2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q(z)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['*', 'q', 'z']);
      expect(stateVariables['/a2'].stateValues.value).eqls(['*', 'q', 'z']);
      expect(stateVariables['/b'].stateValues.value).eqls(['apply', 'q', 'z']);
      expect(stateVariables['/b2'].stateValues.value).eqls(['apply', 'q', 'z']);
    });


  })

  it('display digits', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" displayDigits="5" prefill="sin(2x)"/></p>
    <p>a2: <copy target="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy target="a" prop="immediateValue" assignNames="a3" /></p>
    <p>a4: <copy target="a" prop="value" assignNames="a4" displayDigits="16" /></p>
    <p>a5: <copy target="a" prop="immediateValue" assignNames="a5" displayDigits="16" /></p>

    <p>b: <math name="b">10e^(3y)</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDigits="3" /></p>
    <p>b3: <copy target="b2" prop="value" assignNames="b3" /></p>
    <p>b4: <copy target="b2" prop="immediateValue" assignNames="b4" /></p>
    <p>b5: <copy target="b2" prop="value" assignNames="b5" displayDigits="16" /></p>
    <p>b6: <copy target="b2" prop="immediateValue" assignNames="b6" displayDigits="16" /></p>
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
    });


    cy.get('#\\/a textarea').type('{end}{leftArrow}{leftArrow}{backspace}345.15389319{ctrl+end}', { force: true });

    cy.get('#\\/a5 .mjx-mrow').should('contain.text', 'sin(345.15389319x)')
    cy.get('#\\/a .mq-editable-field').should('contain.text', 'sin(345.15389319x)')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(2x)')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'sin(345.15x)')
    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.15389319x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/a4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/a5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15389319x)')
    })

    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{rightArrow}{backspace}{backspace}2.047529344518{ctrl+end}{leftArrow}{leftArrow}{backspace}0.0000073013048309{ctrl+end}', { force: true });

    cy.get('#\\/b6 .mjx-mrow').should('contain.text', '2.047529344518e0.0000073013048309y')

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'sin(345.15x)')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(345.15x)')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'sin(345.15x)')
    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.15x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })

    cy.get('#\\/b .mjx-mrow').should('contain.text', '10e3y')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '2.047529344518e0.0000073013048309y')
    cy.get('#\\/b3 .mjx-mrow').should('contain.text', '10e3y')
    cy.get('#\\/b4 .mjx-mrow').should('contain.text', '2.05e0.0000073y')

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

    cy.get('#\\/b2 textarea').blur();

    cy.get('#\\/b .mjx-mrow').should('contain.text', '2.047529345e0.000007301304831y')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '2.05e0.0000073y')
    cy.get('#\\/b3 .mjx-mrow').should('contain.text', '2.05e0.0000073y')
    cy.get('#\\/b4 .mjx-mrow').should('contain.text', '2.05e0.0000073y')
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      console.log(stateVariables['/a3'].stateValues.value)
      console.log(['apply', 'sin', ['*', 345.15389319, 'x']]);

      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 2.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 2.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 2.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });


    cy.get('#\\/a textarea').type('{end}{leftArrow}{leftArrow}{backspace}4{ctrl+end}', { force: true });


    cy.get('#\\/a .mq-editable-field').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(345.15x)')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'sin(345.14x)')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.14x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
    });

    cy.get('#\\/a textarea').blur();

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.14x)')
    })
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
    });

    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{backspace}6{ctrl+home}', { force: true });

    cy.get('#\\/b .mjx-mrow').should('contain.text', '2.047529345e0.000007301304831y')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '6.05e0.0000073y')
    cy.get('#\\/b3 .mjx-mrow').should('contain.text', '2.05e0.0000073y')
    cy.get('#\\/b4 .mjx-mrow').should('contain.text', '6.05e0.0000073y')
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 2.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 2.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });

    cy.get('#\\/b2 textarea').blur();

    cy.get('#\\/b .mjx-mrow').should('contain.text', '6.05e0.0000073y')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '6.05e0.0000073y')
    cy.get('#\\/b3 .mjx-mrow').should('contain.text', '6.05e0.0000073y')
    cy.get('#\\/b4 .mjx-mrow').should('contain.text', '6.05e0.0000073y')
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 6.05, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });

  })

  it('display decimals', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" displayDecimals="2" prefill="sin(2x)"/></p>
    <p>a2: <copy target="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy target="a" prop="immediateValue" assignNames="a3" /></p>

    <p>b: <math name="b">10e^(3y)</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDecimals="8" /></p>
    <p>b3: <copy target="b2" prop="value" assignNames="b3" /></p>
    <p>b4: <copy target="b2" prop="immediateValue" assignNames="b4" /></p>
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
    });



    cy.get('#\\/a textarea').type('{end}{leftArrow}{leftArrow}{backspace}345.15389319{ctrl+end}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'sin(345.15389319x)')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(2x)')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'sin(345.15x)')
    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.15389319x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(2x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })

    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{rightArrow}{backspace}{backspace}2.047529344518{ctrl+end}{leftArrow}{leftArrow}{backspace}0.0000073013048309{ctrl+end}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'sin(345.15x)')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(345.15x)')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'sin(345.15x)')
    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.15x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })


    cy.get('#\\/b .mjx-mrow').should('contain.text', '10e3y')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '2.047529344518e0.0000073013048309y')
    cy.get('#\\/b3 .mjx-mrow').should('contain.text', '10e3y')
    cy.get('#\\/b4 .mjx-mrow').should('contain.text', '2.04752934e0.0000073y')

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

    cy.get('#\\/b2 textarea').blur();

    cy.get('#\\/b .mjx-mrow').should('contain.text', '2.047529345e0.000007301304831y')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '2.04752934e0.0000073y')
    cy.get('#\\/b3 .mjx-mrow').should('contain.text', '2.04752934e0.0000073y')
    cy.get('#\\/b4 .mjx-mrow').should('contain.text', '2.04752934e0.0000073y')

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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 2.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 2.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 2.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });


    cy.get('#\\/a textarea').type('{end}{leftArrow}{leftArrow}{backspace}4{ctrl+end}', { force: true });


    cy.get('#\\/a .mq-editable-field').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(345.15x)')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.14x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.15x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 345.15389319, 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.15, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
    });

    cy.get('#\\/a textarea').blur();

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('sin(345.14x)')
    })
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(345.14x)')
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(345.14x)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 345.14, 'x']]);
    });


    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{backspace}6{ctrl+home}', { force: true });

    cy.get('#\\/b .mjx-mrow').should('contain.text', '2.047529345e0.000007301304831y')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '6.04752934e0.0000073y')
    cy.get('#\\/b3 .mjx-mrow').should('contain.text', '2.04752934e0.0000073y')
    cy.get('#\\/b4 .mjx-mrow').should('contain.text', '6.04752934e0.0000073y')

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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 2.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 2.047529344518, ['^', 'e', ['*', 0.0000073013048309, 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 2.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });

    cy.get('#\\/b2 textarea').blur();

    cy.get('#\\/b .mjx-mrow').should('contain.text', '6.04752934e0.0000073y')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '6.04752934e0.0000073y')
    cy.get('#\\/b3 .mjx-mrow').should('contain.text', '6.04752934e0.0000073y')
    cy.get('#\\/b4 .mjx-mrow').should('contain.text', '6.04752934e0.0000073y')

    cy.get('#\\/b .mjx-mrow').should('contain.text', '6.04752934e0.0000073y')
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 6.04752934, ['^', 'e', ['*', 0.0000073, 'y']]]);
    });

  })

  it('display small as zero', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" displayDigits="5" prefill="sin(2x)"/></p>
    <p>a2: <copy target="a" prop="value" assignNames="a2" /></p>
    <p>a3: <copy target="a" prop="immediatevalue" assignNames="a3" /></p>
    <p>a4: <copy target="a" prop="value" assignNames="a4" displayDigits="16" /></p>
    <p>a5: <copy target="a" prop="immediatevalue" assignNames="a5" displayDigits="16" /></p>
  
    <p>b: <math name="b">10e^(3y)</math></p>
    <p>b2: <mathinput name="b2" bindValueTo="$b"  displayDigits="3" /></p>
    <p>b3: <copy target="b2" prop="value" assignNames="b3" /></p>
    <p>b4: <copy target="b2" prop="immediatevalue" assignNames="b4" /></p>

    <p>c: <mathinput name="c" displayDigits="5" prefill="sin(2x)" displaySmallAsZero /></p>
    <p>c2: <copy target="c" prop="value" assignNames="c2" /></p>
    <p>c3: <copy target="c" prop="immediatevalue" assignNames="c3" /></p>

    <p>d: <math name="d">10e^(3y)</math></p>
    <p>d2: <mathinput name="d2" bindValueTo="$d"  displayDigits="3" displaySmallAsZero /></p>
    <p>d3: <copy target="d2" prop="value" assignNames="d3" /></p>
    <p>d4: <copy target="d2" prop="immediatevalue" assignNames="d4" /></p>
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/c'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/c'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/c2'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/c2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/c3'].stateValues.value).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/c3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 2, 'x']]);
      expect(stateVariables['/d'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/d2'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/d2'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/d3'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/d3'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/d4'].stateValues.value).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
      expect(stateVariables['/d4'].stateValues.valueForDisplay).eqls(['*', 10, ['^', 'e', ['*', 3, 'y']]]);
    });

    cy.get('#\\/a textarea').type('{ctrl+end}{leftArrow}{leftArrow}{backspace}0.000000000000000472946384739473{enter}', { force: true });
    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{rightArrow}{backspace}{backspace}0.0000000000000934720357236{ctrl+end}{leftArrow}{leftArrow}{backspace}0.0000000000000073013048309{enter}', { force: true });
    cy.get('#\\/c textarea').type('{end}{leftArrow}{leftArrow}{backspace}0.000000000000000472946384739473{enter}', { force: true });
    cy.get('#\\/d2 textarea').type('{ctrl+home}{rightArrow}{rightArrow}{backspace}{backspace}0.0000000000000934720357236{ctrl+end}{leftArrow}{leftArrow}{backspace}0.0000000000000073013048309{enter}', { force: true }).blur();

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'sin(4.7295')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(4.7295')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'sin(4.7295')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('sin(4.7295⋅10−16x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(4.7295⋅10−16x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(4.7295⋅10−16x)')
    })

    cy.get('#\\/b .mjx-mrow').should('contain.text', '9.347203572')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '9.35')
    cy.get('#\\/b3 .mjx-mrow').should('contain.text', '9.35')
    cy.get('#\\/b4 .mjx-mrow').should('contain.text', '9.35')

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

    cy.get('#\\/c .mq-editable-field').should('contain.text', 'sin(0)')
    cy.get('#\\/c2 .mjx-mrow').should('contain.text', 'sin(0)')
    cy.get('#\\/c3 .mjx-mrow').should('contain.text', 'sin(0)')
    cy.get('#\\/c .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('sin(0)')
    })
    cy.get('#\\/c2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0)')
    })
    cy.get('#\\/c3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(0)')
    })


    cy.get('#\\/d .mjx-mrow').should('contain.text', '9.347203572')
    cy.get('#\\/d2 .mq-editable-field').should('contain.text', '9.35')
    cy.get('#\\/d3 .mjx-mrow').should('contain.text', '9.35')
    cy.get('#\\/d4 .mjx-mrow').should('contain.text', '9.35')
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      console.log(stateVariables['/a'].stateValues.value)
      console.log(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']])
      console.log(stateVariables['/a3'].stateValues.value)

      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 4.7295e-16, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 4.7295e-16, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 4.7295e-16, 'x']]);
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 9.35e-14, ['^', 'e', ['*', 7.3e-15, 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 9.35e-14, ['^', 'e', ['*', 7.3e-15, 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 9.35e-14, ['^', 'e', ['*', 7.3e-15, 'y']]]);
      expect(stateVariables['/c'].stateValues.value).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(stateVariables['/c'].stateValues.valueForDisplay).eqls(['apply', 'sin', 0]);
      expect(stateVariables['/c2'].stateValues.value).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(stateVariables['/c2'].stateValues.valueForDisplay).eqls(['apply', 'sin', 0]);
      expect(stateVariables['/c3'].stateValues.value).eqls(['apply', 'sin', ['*', 4.72946384739473e-16, 'x']]);
      expect(stateVariables['/c3'].stateValues.valueForDisplay).eqls(['apply', 'sin', 0]);
      expect(stateVariables['/d'].stateValues.value).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(stateVariables['/d2'].stateValues.value).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(stateVariables['/d2'].stateValues.valueForDisplay).eqls(9.35e-14);
      expect(stateVariables['/d3'].stateValues.value).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(stateVariables['/d3'].stateValues.valueForDisplay).eqls(9.35e-14);
      expect(stateVariables['/d4'].stateValues.value).eqls(['*', 9.34720357236e-14, ['^', 'e', ['*', 7.3013048309e-15, 'y']]]);
      expect(stateVariables['/d4'].stateValues.valueForDisplay).eqls(9.35e-14);
    });

    cy.get('#\\/a textarea').type('{home}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{backspace}5{enter}', { force: true });
    cy.get('#\\/b2 textarea').type('{ctrl+home}{rightArrow}{backspace}8{enter}', { force: true });
    cy.get('#\\/c textarea').type('{end}{leftArrow}{leftArrow}3{enter}', { force: true, delay: 100 });
    cy.get('#\\/d2 textarea').type('{ctrl+home}{rightArrow}{backspace}6{enter}', { force: true }).blur();

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'sin(5.7295')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'sin(5.7295')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'sin(5.7295')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('sin(5.7295⋅10−16x)')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(5.7295⋅10−16x)')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(5.7295⋅10−16x)')
    })

    cy.get('#\\/b .mjx-mrow').should('contain.text', '8.35')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '8.35')
    cy.get('#\\/b3 .mjx-mrow').should('contain.text', '8.35')
    cy.get('#\\/b4 .mjx-mrow').should('contain.text', '8.35')

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

    cy.get('#\\/c .mq-editable-field').should('contain.text', 'sin(30)')
    cy.get('#\\/c2 .mjx-mrow').should('contain.text', 'sin(30)')
    cy.get('#\\/c3 .mjx-mrow').should('contain.text', 'sin(30)')
    cy.get('#\\/c .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '').replace(/\u00B7/g, '\u22C5')).equal('sin(30)')
    })
    cy.get('#\\/c2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(30)')
    })
    cy.get('#\\/c3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(30)')
    })

    cy.get('#\\/d .mjx-mrow').should('contain.text', '6.35')
    cy.get('#\\/d2 .mq-editable-field').should('contain.text', '6.35')
    cy.get('#\\/d3 .mjx-mrow').should('contain.text', '6.35')
    cy.get('#\\/d4 .mjx-mrow').should('contain.text', '6.35')
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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(stateVariables['/a2'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(stateVariables['/a3'].stateValues.valueForDisplay).eqls(['apply', 'sin', ['*', 5.7295, ['^', 10, ['-', 16]], 'x']]);
      expect(stateVariables['/b'].stateValues.value).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(stateVariables['/b2'].stateValues.value).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(stateVariables['/b3'].stateValues.value).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(stateVariables['/b3'].stateValues.valueForDisplay).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(stateVariables['/b4'].stateValues.value).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(stateVariables['/b4'].stateValues.valueForDisplay).eqls(['*', 8.35, ['^', 10, ['-', 14]], ['^', 'e', ['*', 7.3, ['^', 10, ['-', 15]], 'y']]]);
      expect(stateVariables['/c'].stateValues.value).eqls(['apply', 'sin', 30]);
      expect(stateVariables['/c'].stateValues.valueForDisplay).eqls(['apply', 'sin', 30]);
      expect(stateVariables['/c2'].stateValues.value).eqls(['apply', 'sin', 30]);
      expect(stateVariables['/c2'].stateValues.valueForDisplay).eqls(['apply', 'sin', 30]);
      expect(stateVariables['/c3'].stateValues.value).eqls(['apply', 'sin', 30]);
      expect(stateVariables['/c3'].stateValues.valueForDisplay).eqls(['apply', 'sin', 30]);
      expect(stateVariables['/d'].stateValues.value).eqls(['*', 6.35, ['^', 10, ['-', 14]]]);
      expect(stateVariables['/d2'].stateValues.value).eqls(['*', 6.35, ['^', 10, ['-', 14]]]);
      expect(stateVariables['/d2'].stateValues.valueForDisplay).eqls(6.35e-14);
      expect(stateVariables['/d3'].stateValues.value).eqls(['*', 6.35, ['^', 10, ['-', 14]]]);
      expect(stateVariables['/d3'].stateValues.valueForDisplay).eqls(6.35e-14);
      expect(stateVariables['/d4'].stateValues.value).eqls(['*', 6.35, ['^', 10, ['-', 14]]]);
      expect(stateVariables['/d4'].stateValues.valueForDisplay).eqls(6.35e-14);
    });

  })

  it('display digits, change from downstream', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eq(3);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eq(3)
      expect(stateVariables['/p'].stateValues.xs[0]).eq(3)
      expect(stateVariables['/b'].stateValues.value).eq(5);
      expect(stateVariables['/b2'].stateValues.value).eq(5);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eq(5);
      expect(stateVariables['/p'].stateValues.xs[1]).eq(5)
    });

    cy.get('#\\/a textarea').type('{end}{backspace}2.4295639461593{enter}', { force: true });
    cy.get('#\\/b2 textarea').type('{end}{backspace}9.3935596792746{enter}', { force: true }).blur();

    cy.get('#\\/a .mq-editable-field').should('contain.text', '2.4296')
    cy.get('#\\/b .mjx-mrow').should('contain.text', '9.393559679')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '9.39')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.4296')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9.393559679')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9.39')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eq(2.4295639461593);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eq(2.4296)
      expect(stateVariables['/p'].stateValues.xs[0]).eq(2.4295639461593)
      expect(stateVariables['/b'].stateValues.value).eq(9.3935596792746);
      expect(stateVariables['/b2'].stateValues.value).eq(9.3935596792746);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eq(9.39);
      expect(stateVariables['/p'].stateValues.xs[1]).eq(9.3935596792746)
    });


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p",
        args: { x: 7.936497798143, y: 2.142218345836 }
      })

      cy.get('#\\/a .mq-editable-field').should('contain.text', '7.9365')
      cy.get('#\\/b .mjx-mrow').should('contain.text', '2.142218346')
      cy.get('#\\/b2 .mq-editable-field').should('contain.text', '2.14')

      cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7.9365')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2.142218346')
      })
      cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.14')
      })

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/a'].stateValues.value).eq(7.936497798143);
        expect(stateVariables['/a'].stateValues.valueForDisplay).eq(7.9365)
        expect(stateVariables['/p'].stateValues.xs[0]).eq(7.936497798143)
        expect(stateVariables['/b'].stateValues.value).eq(2.142218345836);
        expect(stateVariables['/b2'].stateValues.value).eq(2.142218345836);
        expect(stateVariables['/b2'].stateValues.valueForDisplay).eq(2.14);
        expect(stateVariables['/p'].stateValues.xs[1]).eq(2.142218345836)
      });

    })


  })

  it('display decimals, change from downstream', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eq(3);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eq(3)
      expect(stateVariables['/p'].stateValues.xs[0]).eq(3)
      expect(stateVariables['/b'].stateValues.value).eq(5);
      expect(stateVariables['/b2'].stateValues.value).eq(5);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eq(5);
      expect(stateVariables['/p'].stateValues.xs[1]).eq(5)
    });

    cy.get('#\\/a textarea').type('{end}{backspace}2.4295639461593{enter}', { force: true });
    cy.get('#\\/b2 textarea').type('{end}{backspace}9.3935596792746{enter}', { force: true }).blur();

    cy.get('#\\/a .mq-editable-field').should('contain.text', '2.4296')
    cy.get('#\\/b .mjx-mrow').should('contain.text', '9.393559679')
    cy.get('#\\/b2 .mq-editable-field').should('contain.text', '9.39')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.4296')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9.393559679')
    })
    cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9.39')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eq(2.4295639461593);
      expect(stateVariables['/a'].stateValues.valueForDisplay).eq(2.4296)
      expect(stateVariables['/p'].stateValues.xs[0]).eq(2.4295639461593)
      expect(stateVariables['/b'].stateValues.value).eq(9.3935596792746);
      expect(stateVariables['/b2'].stateValues.value).eq(9.3935596792746);
      expect(stateVariables['/b2'].stateValues.valueForDisplay).eq(9.39);
      expect(stateVariables['/p'].stateValues.xs[1]).eq(9.3935596792746)
    });


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/p",
        args: { x: 7.936497798143, y: 2.142218345836 }
      })

      cy.get('#\\/a .mq-editable-field').should('contain.text', '7.9365')
      cy.get('#\\/b .mjx-mrow').should('contain.text', '2.142218346')
      cy.get('#\\/b2 .mq-editable-field').should('contain.text', '2.14')

      cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7.9365')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2.142218346')
      })
      cy.get('#\\/b2 .mq-editable-field').invoke('text').then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.14')
      })

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/a'].stateValues.value).eq(7.936497798143);
        expect(stateVariables['/a'].stateValues.valueForDisplay).eq(7.9365)
        expect(stateVariables['/p'].stateValues.xs[0]).eq(7.936497798143)
        expect(stateVariables['/b'].stateValues.value).eq(2.142218345836);
        expect(stateVariables['/b2'].stateValues.value).eq(2.142218345836);
        expect(stateVariables['/b2'].stateValues.valueForDisplay).eq(2.14);
        expect(stateVariables['/p'].stateValues.xs[1]).eq(2.142218345836)
      });

    })


  })

  it('natural input to sqrt', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" /></p>
    <p>a2: <copy prop="value" target="a" assignNames="a2" /></p>
    <p>a3: <copy prop="value" target="a" simplify assignNames="a3" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a textarea').type('sqrt4{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', '√4')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', '√4')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', '2')

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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" /></p>
    <p>a2: <copy prop="value" target="a" assignNames="a2" /></p>
    <p>a3: <copy prop="value" target="a" simplify assignNames="a3" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log(`unicode α U+03B1`)
    cy.get('#\\/a textarea').type('α{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'α')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'α')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'α')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('α')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls("alpha");
      expect(stateVariables['/a2'].stateValues.value).eqls("alpha");
      expect(stateVariables['/a3'].stateValues.value).eqls("alpha");
    });


    cy.log(`latex \\alpha\\beta`)
    // Note: first {enter} changes \beta to β and second {enter} is detected as an Enter
    cy.get('#\\/a textarea').type('{end}{backspace}\\alpha\\beta{enter}{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'αβ')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'αβ')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'αβ')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('αβ')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('αβ')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('αβ')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(["*", "alpha", "beta"]);
      expect(stateVariables['/a2'].stateValues.value).eqls(["*", "alpha", "beta"]);
      expect(stateVariables['/a3'].stateValues.value).eqls(["*", "alpha", "beta"]);
    });


    cy.log(`unicode − U+2212 is subtraction`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}y\u2212z{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'y−z')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'y−z')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'y−z')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y−z')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y−z')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y−z')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(["+", "y", ["-", "z"]]);
      expect(stateVariables['/a2'].stateValues.value).eqls(["+", "y", ["-", "z"]]);
      expect(stateVariables['/a3'].stateValues.value).eqls(["+", "y", ["-", "z"]]);
    });

    cy.log(`normal minus`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}a-b{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'a−b')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'a−b')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'a−b')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a−b')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a−b')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a−b')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(["+", "a", ["-", "b"]]);
      expect(stateVariables['/a2'].stateValues.value).eqls(["+", "a", ["-", "b"]]);
      expect(stateVariables['/a3'].stateValues.value).eqls(["+", "a", ["-", "b"]]);
    });

    cy.log(`unicode ⋅ U+22C5 is multiplication`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}y\u22C5z{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'y⋅z')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'yz')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'yz')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y⋅z')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(["*", "y", "z"]);
      expect(stateVariables['/a2'].stateValues.value).eqls(["*", "y", "z"]);
      expect(stateVariables['/a3'].stateValues.value).eqls(["*", "y", "z"]);
    });

    cy.log(`normal *`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}a*b{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'a\u00B7b')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'ab')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'ab')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a\u00B7b')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ab')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ab')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(["*", "a", "b"]);
      expect(stateVariables['/a2'].stateValues.value).eqls(["*", "a", "b"]);
      expect(stateVariables['/a3'].stateValues.value).eqls(["*", "a", "b"]);
    });

    cy.log(`unicode · U+00B7 becomes multiplication`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}y\u00B7z{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'y\u00B7z')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'yz')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'yz')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y\u00B7z')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('yz')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(["*", "y", "z"]);
      expect(stateVariables['/a2'].stateValues.value).eqls(["*", "y", "z"]);
      expect(stateVariables['/a3'].stateValues.value).eqls(["*", "y", "z"]);
    });


    cy.log(`unicode × U+00D7 becomes multiplication`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}u\u00D7v{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'u\u00D7v')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'uv')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'uv')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('u\u00D7v')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(["*", "u", "v"]);
      expect(stateVariables['/a2'].stateValues.value).eqls(["*", "u", "v"]);
      expect(stateVariables['/a3'].stateValues.value).eqls(["*", "u", "v"]);
    });

    cy.log(`unicode ∪ U+222A becomes union`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}A\u222AB{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'A\u222AB')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'A\u222AB')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'A\u222AB')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('A\u222AB')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A\u222AB')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A\u222AB')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(["union", "A", "B"]);
      expect(stateVariables['/a2'].stateValues.value).eqls(["union", "A", "B"]);
      expect(stateVariables['/a3'].stateValues.value).eqls(["union", "A", "B"]);
    });


    cy.log(`unicode ∩ U+2229 becomes intersect`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}A\u2229B{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', 'A\u2229B')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', 'A\u2229B')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', 'A\u2229B')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('A\u2229B')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A\u2229B')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A\u2229B')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(["intersect", "A", "B"]);
      expect(stateVariables['/a2'].stateValues.value).eqls(["intersect", "A", "B"]);
      expect(stateVariables['/a3'].stateValues.value).eqls(["intersect", "A", "B"]);
    });


    cy.log(`unicode ∞ U+221E becomes infinity`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}\u221E{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', '\u221E')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', '\u221E')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', '\u221E')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('\u221E')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\u221E')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\u221E')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eq(Infinity);
      expect(stateVariables['/a2'].stateValues.value).eq(Infinity);
      expect(stateVariables['/a3'].stateValues.value).eq(Infinity);
    });


    cy.log(`unicode µ U+u00B5 becomes mu`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}\u00B5{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', '\u00B5')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', '\u03BC')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', '\u03BC')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('\u00B5')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\u03BC')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\u03BC')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eq("mu");
      expect(stateVariables['/a2'].stateValues.value).eq("mu");
      expect(stateVariables['/a3'].stateValues.value).eq("mu");
    });


    cy.log(`unicode μ U+u03BC becomes mu`)

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}\u03BC{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', '\u03BC')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', '\u03BC')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', '\u03BC')

    cy.get('#\\/a .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('\u03BC')
    })
    cy.get('#\\/a2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\u03BC')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\u03BC')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eq("mu");
      expect(stateVariables['/a2'].stateValues.value).eq("mu");
      expect(stateVariables['/a3'].stateValues.value).eq("mu");
    });

  })

  it('exponent with numbers', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a: <mathinput name="a" /></p>
    <p>a2: <copy prop="value" target="a" assignNames="a2" /></p>
    <p>a3: <math simplify name="a3">$a</math></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/a textarea').type('3^2{rightArrow}5{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', '325')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', '32⋅52')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', '45')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['*', ['^', 3, 2], 5]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['*', ['^', 3, 2], 5]);
      expect(stateVariables['/a3'].stateValues.value).eqls(45);
    });


    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}3^25{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', '325')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', '325')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', '847288609400')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['^', 3, 25]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['^', 3, 25]);
      expect(stateVariables['/a3'].stateValues.value).eqls(847288609443);
    });


    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}3^2x{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', '32x')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', '32x')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', '32x')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['^', 3, ['*', 2, 'x']]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['^', 3, ['*', 2, 'x']]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['^', 3, ['*', 2, 'x']]);
    });


    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}3^2{rightarrow}x{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', '32x')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', '32x')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', '9x')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['*', ['^', 3, 2], 'x']);
      expect(stateVariables['/a2'].stateValues.value).eqls(['*', ['^', 3, 2], 'x']);
      expect(stateVariables['/a3'].stateValues.value).eqls(['*', 9, 'x']);
    });


    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}3^x2{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', '3x2')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', '3x2')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', '3x2')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['^', 3, 'x2']);
      expect(stateVariables['/a2'].stateValues.value).eqls(['^', 3, 'x2']);
      expect(stateVariables['/a3'].stateValues.value).eqls(['^', 3, 'x2']);
    });

    cy.get('#\\/a textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}3^x{rightarrow}2{enter}', { force: true });

    cy.get('#\\/a .mq-editable-field').should('contain.text', '3x2')
    cy.get('#\\/a2 .mjx-mrow').should('contain.text', '3x⋅2')
    cy.get('#\\/a3 .mjx-mrow').should('contain.text', '2⋅3x')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.value).eqls(['*', ['^', 3, 'x'], 2]);
      expect(stateVariables['/a2'].stateValues.value).eqls(['*', ['^', 3, 'x'], 2]);
      expect(stateVariables['/a3'].stateValues.value).eqls(['*', 2, ['^', 3, 'x']]);
    });




  })

  it('rawValue is updated', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point x="1" y="2" name="A">
        <constraints>
          <constrainToGrid />
        </constraints>
      </point>
    </graph>
    
    <mathinput name="mi" bindValueTo="$(A{prop='x'})" />
    
    <copy prop='x' target="A" assignNames="Ax" />
    <copy prop='value' target='mi' assignNames="mi2" />

    <graph>
      <point x="$mi" y="3" name="B" />
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');


    cy.get('#\\/Ax').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/mi2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.get('#\\/mi .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.rawRendererValue).eq('1')
      expect(stateVariables['/mi'].stateValues.immediateValue).eq(1)
      expect(stateVariables['/mi'].stateValues.value).eq(1)
      expect(stateVariables['/A'].stateValues.xs.map(x => x)).eqls([1, 2]);
      expect(stateVariables['/B'].stateValues.xs.map(x => x)).eqls([1, 3]);
    });


    cy.get('#\\/mi textarea').type('{end}{backspace}-7.4{enter}', { force: true });


    cy.get('#\\/Ax .mjx-mrow').should('contain.text', '−7')
    cy.get('#\\/mi2 .mjx-mrow').should('contain.text', '−7')
    cy.get('#\\/mi .mq-editable-field').should('contain.text', '−7')

    cy.get('#\\/Ax').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−7')
    })
    cy.get('#\\/mi2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−7')
    })
    cy.get('#\\/mi .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('−7')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.rawRendererValue).eq('-7')
      expect(stateVariables['/mi'].stateValues.immediateValue).eq(-7)
      expect(stateVariables['/mi'].stateValues.value).eq(-7)
      expect(stateVariables['/A'].stateValues.xs.map(x => x)).eqls([-7, 2]);
      expect(stateVariables['/B'].stateValues.xs.map(x => x)).eqls([-7, 3]);
    });

    cy.log('move point A')

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 3.9, y: -8.4 }
      })

    });

    cy.get('#\\/Ax .mjx-mrow').should('contain.text', '4')
    cy.get('#\\/mi2 .mjx-mrow').should('contain.text', '4')
    cy.get('#\\/mi .mq-editable-field').should('contain.text', '4')

    cy.get('#\\/Ax').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/mi2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })

    cy.get('#\\/mi .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.rawRendererValue).eq('4')
      expect(stateVariables['/mi'].stateValues.immediateValue).eq(4)
      expect(stateVariables['/mi'].stateValues.value).eq(4)
      expect(stateVariables['/A'].stateValues.xs.map(x => x)).eqls([4, -8]);
      expect(stateVariables['/B'].stateValues.xs.map(x => x)).eqls([4, 3]);

    });



    cy.log('move point B')

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 5.1, y: 1.3 }
      })

    });

    cy.get('#\\/Ax .mjx-mrow').should('contain.text', '5')
    cy.get('#\\/mi2 .mjx-mrow').should('contain.text', '5')
    cy.get('#\\/mi .mq-editable-field').should('contain.text', '5')

    cy.get('#\\/Ax').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })
    cy.get('#\\/mi2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.get('#\\/mi .mq-editable-field').invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.rawRendererValue).eq('5')
      expect(stateVariables['/mi'].stateValues.immediateValue).eq(5)
      expect(stateVariables['/mi'].stateValues.value).eq(5)
      expect(stateVariables['/A'].stateValues.xs.map(x => x)).eqls([5, -8]);
      expect(stateVariables['/B'].stateValues.xs.map(x => x)).eqls([5, 1.3]);

    });


  })

  it('chain update off mathinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="mi" />

    <math simplify name="x">x</math>
    <updateValue triggerWithTargets="mi" target="x" newValue="$x+$mi" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.get('#\\/mi textarea').type("y", { force: true })
    cy.get('#\\/x .mjx-mrow').should('have.text', 'x')
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.get('#\\/mi textarea').type("{backspace}x", { force: true })
    cy.get('#\\/x .mjx-mrow').should('have.text', 'x')
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.get('#\\/mi textarea').blur();
    cy.get('#\\/x .mjx-mrow').should('have.text', '2x')
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })

    cy.get('#\\/mi textarea').type("{end}{backspace}y", { force: true })
    cy.get('#\\/x .mjx-mrow').should('have.text', '2x')
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })

    cy.get('#\\/mi textarea').type("+x", { force: true })
    cy.get('#\\/x .mjx-mrow').should('have.text', '2x')
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })

    cy.get('#\\/mi textarea').type("{enter}", { force: true })
    cy.get('#\\/x .mjx-mrow').should('have.text', '3x+y')
    cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x+y')
    })

  })

  it('split symbols in mathinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="mins" splitSymbols="false" />
    <mathinput name="mis" />

    <p>No split: <copy prop="value" target="mins" assignNames="mns"/></p>
    <p>Split: <copy prop="value" target="mis" assignNames="ms"/></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/mins textarea').type("xy{enter}", { force: true })
    cy.get('#\\/mis textarea').type("xy{enter}", { force: true })
    cy.get('#\\/mns .mjx-mrow').should('contain.text', 'xy')
    cy.get('#\\/ms .mjx-mrow').should('contain.text', 'xy')
    cy.get('#\\/mns').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })
    cy.get('#\\/ms').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mins'].stateValues.value).eqls("xy");
      expect(stateVariables['/mis'].stateValues.value).eqls(["*", "x", "y"]);
      expect(stateVariables['/mns'].stateValues.value).eqls("xy");
      expect(stateVariables['/ms'].stateValues.value).eqls(["*", "x", "y"]);
    })

    cy.get('#\\/mins textarea').type("{end}0{enter}", { force: true })
    cy.get('#\\/mis textarea').type("{end}0{enter}", { force: true })
    cy.get('#\\/mns .mjx-mrow').should('contain.text', 'xy0')
    cy.get('#\\/ms .mjx-mrow').should('contain.text', 'xy0')
    cy.get('#\\/mns').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy0')
    })
    cy.get('#\\/ms').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy0')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mins'].stateValues.value).eqls("xy0");
      expect(stateVariables['/mis'].stateValues.value).eqls("xy0");
      expect(stateVariables['/mns'].stateValues.value).eqls("xy0");
      expect(stateVariables['/ms'].stateValues.value).eqls("xy0");
    })

    cy.get('#\\/mins textarea').type("{end}{backspace}_uv{enter}", { force: true })
    cy.get('#\\/mis textarea').type("{end}{backspace}_uv{enter}", { force: true })
    cy.get('#\\/mns .mjx-mrow').should('contain.text', 'xyuv')
    cy.get('#\\/ms .mjx-mrow').should('contain.text', 'xyuv')
    cy.get('#\\/mns').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get('#\\/ms').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mins'].stateValues.value).eqls(["_", "xy", "uv"]);
      expect(stateVariables['/mis'].stateValues.value).eqls(["*", "x", ["_", "y", ["*", "u", "v"]]]);
      expect(stateVariables['/mns'].stateValues.value).eqls(["_", "xy", "uv"]);
      expect(stateVariables['/ms'].stateValues.value).eqls(["*", "x", ["_", "y", ["*", "u", "v"]]]);
    })

  })

  it('normalize begin/end ldots in mathinput', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="mi" />

    <p>Value: <copy prop="value" target="mi" assignNames="m"/></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('use periods, no commas')
    cy.get('#\\/mi textarea').type("...x,y,z...{enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', '…,x,y,z,…')
    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,x,y,z,…')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "list", ["ldots"], "x", "y", "z", ["ldots"]
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "list", ["ldots"], "x", "y", "z", ["ldots"]
      ]);
    })

    cy.log('add spaces in between some periods')

    cy.get('#\\/mi textarea').type("{home} {rightarrow} {rightarrow} {end} {leftarrow}{leftarrow} {leftarrow}{leftarrow}{leftarrow}{backspace}a{end}{enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', '…,x,y,a,…')

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,x,y,a,…')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "list", ["ldots"], "x", "y", "a", ["ldots"]
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "list", ["ldots"], "x", "y", "a", ["ldots"]
      ]);
    })


    cy.log('add commas after first set of periods')

    cy.get('#\\/mi textarea').type("{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow},{rightarrow}{backspace}b{end}{enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', '…,b,y,a,…')

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,b,y,a,…')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "list", ["ldots"], "b", "y", "a", ["ldots"]
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "list", ["ldots"], "b", "y", "a", ["ldots"]
      ]);
    })


    cy.log('add commas before second set of periods')

    cy.get('#\\/mi textarea').type("{end}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow},{leftarrow}{backspace}c{end}{enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', '…,b,y,c,…')

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,b,y,c,…')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "list", ["ldots"], "b", "y", "c", ["ldots"]
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "list", ["ldots"], "b", "y", "c", ["ldots"]
      ]);
    })


    cy.log('change second set of periods to ldots')

    cy.get('#\\/mi textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{leftarrow}{backspace}d{rightarrow}\\ldots {enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', '…,b,y,d,…')

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,b,y,d,…')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "list", ["ldots"], "b", "y", "d", ["ldots"]
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "list", ["ldots"], "b", "y", "d", ["ldots"]
      ]);
    })


    cy.log('change first set of periods to ldots')

    cy.get('#\\/mi textarea').type("{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}{backspace}{backspace}{backspace}\\ldots  {rightarrow}{rightarrow}{backspace}e{end}{enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', '…,e,y,d,…')

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,e,y,d,…')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "list", ["ldots"], "e", "y", "d", ["ldots"]
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "list", ["ldots"], "e", "y", "d", ["ldots"]
      ]);
    })


    cy.log('remove first comma')

    cy.get('#\\/mi textarea').type("{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{backspace}{backspace}f{end}{enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', '…,f,y,d,…')

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,f,y,d,…')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "list", ["ldots"], "f", "y", "d", ["ldots"]
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "list", ["ldots"], "f", "y", "d", ["ldots"]
      ]);
    })


    cy.log('remove last comma')

    cy.get('#\\/mi textarea').type("{end}{leftarrow}{backspace}{backspace}g{end}{enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', '…,f,y,g,…')

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,f,y,g,…')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "list", ["ldots"], "f", "y", "g", ["ldots"]
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "list", ["ldots"], "f", "y", "g", ["ldots"]
      ]);
    })

  })

  it('mathinput eliminates multicharacter symbols', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="varWithNum">x2</math>
    <math name="noSplit" splitSymbols="false">xyz</math>
    <mathinput name="varWithNum2" bindValueTo="$varWithNum" />
    <mathinput name="noSplit2" splitSymbols="false" bindValueTo="$noSplit" />
    <copy prop="value" target="varWithNum2" assignNames="varWithNum3"/>
    <copy prop="value" target="noSplit2" assignNames="noSplit3"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get('#\\/varWithNum').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2')
    })
    cy.get(`#\\/varWithNum2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x2')
    })
    cy.get('#\\/varWithNum3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2')
    })
    cy.get('#\\/noSplit').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(`#\\/noSplit2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xyz')
    })
    cy.get('#\\/noSplit3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/varWithNum'].stateValues.value).eq("x2");
      expect(stateVariables['/varWithNum2'].stateValues.value).eq("x2");
      expect(stateVariables['/varWithNum3'].stateValues.value).eq("x2");
      expect(stateVariables['/noSplit'].stateValues.value).eq("xyz");
      expect(stateVariables['/noSplit2'].stateValues.value).eq("xyz");
      expect(stateVariables['/noSplit3'].stateValues.value).eq("xyz");
    })

    cy.get('#\\/varWithNum2 textarea').type("{end}{backspace}u9j{enter}", { force: true })
    cy.get('#\\/noSplit2 textarea').type("{end}{backspace}uv{enter}", { force: true })


    cy.get('#\\/varWithNum .mjx-mrow').should('contain.text', 'xu9j')
    cy.get(`#\\/varWithNum2 .mq-editable-field`).should('contain.text', 'xu9j')
    cy.get('#\\/varWithNum3 .mjx-mrow').should('contain.text', 'xu9j')
    cy.get('#\\/noSplit .mjx-mrow').should('contain.text', 'xyuv')
    cy.get(`#\\/noSplit2 .mq-editable-field`).should('contain.text', 'xyuv')
    cy.get('#\\/noSplit3 .mjx-mrow').should('contain.text', 'xyuv')

    cy.get('#\\/varWithNum').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xu9j')
    })
    cy.get(`#\\/varWithNum2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xu9j')
    })
    cy.get('#\\/varWithNum3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xu9j')
    })
    cy.get('#\\/noSplit').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })
    cy.get(`#\\/noSplit2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xyuv')
    })
    cy.get('#\\/noSplit3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyuv')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/varWithNum'].stateValues.value).eq("xu9j");
      expect(stateVariables['/varWithNum2'].stateValues.value).eq("xu9j");
      expect(stateVariables['/varWithNum3'].stateValues.value).eq("xu9j");
      expect(stateVariables['/noSplit'].stateValues.value).eq("xyuv");
      expect(stateVariables['/noSplit2'].stateValues.value).eq("xyuv");
      expect(stateVariables['/noSplit3'].stateValues.value).eq("xyuv");
    })


  })

  it('mathinput prefills', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>
    <math format="latex" name="unionLatex">A \\cup B</math>
    <math name="unionText">A union B</math>
    <math splitSymbols="false" name="noSplit">xy</math>
    <math name="split">xy</math>
    <math functionSymbols="h" name="hFunction">h(x)</math>
    <math name="hNoFunction">h(x)</math>
    </p>

    <p>
    <mathinput name="union1" prefill="$unionLatex" />
    <mathinput name="union2" prefill="$unionText" format="latex" />
    <mathinput name="union3" prefill="A union B" />
    <mathinput name="union4" prefill="A \\cup B" format="latex" />
    <copy prop="value" target="union1" assignNames="union1m" />
    <copy prop="value" target="union2" assignNames="union2m" />
    <copy prop="value" target="union3" assignNames="union3m" />
    <copy prop="value" target="union4" assignNames="union4m" />
    </p>
    
    <p>
    <mathinput name="splits1" prefill="$noSplit" />
    <mathinput name="splits2" prefill="$noSplit" splitSymbols="false" />
    <mathinput name="splits3" prefill="$split" />
    <mathinput name="splits4" prefill="$split" splitSymbols="false" />
    <mathinput name="splits5" prefill="xy" />
    <mathinput name="splits6" prefill="xy" splitSymbols="false" />
    <copy prop="value" target="splits1" assignNames="splits1m" />
    <copy prop="value" target="splits2" assignNames="splits2m" />
    <copy prop="value" target="splits3" assignNames="splits3m" />
    <copy prop="value" target="splits4" assignNames="splits4m" />
    <copy prop="value" target="splits5" assignNames="splits5m" />
    <copy prop="value" target="splits6" assignNames="splits6m" />
    </p>

    <p>
    <mathinput name="hFunction1" prefill="$hFunction" />
    <mathinput name="hFunction2" prefill="$hFunction" functionSymbols="h" />
    <mathinput name="hFunction3" prefill="$hNoFunction" />
    <mathinput name="hFunction4" prefill="$hNoFunction" functionSymbols="h" />
    <mathinput name="hFunction5" prefill="h(x)" />
    <mathinput name="hFunction6" prefill="h(x)" functionSymbols="h" />
    <copy prop="value" target="hFunction1" assignNames="hFunction1m" />
    <copy prop="value" target="hFunction2" assignNames="hFunction2m" />
    <copy prop="value" target="hFunction3" assignNames="hFunction3m" />
    <copy prop="value" target="hFunction4" assignNames="hFunction4m" />
    <copy prop="value" target="hFunction5" assignNames="hFunction5m" />
    <copy prop="value" target="hFunction6" assignNames="hFunction6m" />
    </p>


    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/union1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('A∪B')
    })
    cy.get(`#\\/union2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('A∪B')
    })
    cy.get(`#\\/union3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('A∪B')
    })
    cy.get(`#\\/union4 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('A∪B')
    })
    cy.get('#\\/union1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A∪B')
    })
    cy.get('#\\/union2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A∪B')
    })
    cy.get('#\\/union3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A∪B')
    })
    cy.get('#\\/union4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A∪B')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/union1'].stateValues.value).eqls(["union", "A", "B"]);
      expect(stateVariables['/union2'].stateValues.value).eqls(["union", "A", "B"]);
      expect(stateVariables['/union3'].stateValues.value).eqls(["union", "A", "B"]);
      expect(stateVariables['/union4'].stateValues.value).eqls(["union", "A", "B"]);
      expect(stateVariables['/union1m'].stateValues.value).eqls(["union", "A", "B"]);
      expect(stateVariables['/union2m'].stateValues.value).eqls(["union", "A", "B"]);
      expect(stateVariables['/union3m'].stateValues.value).eqls(["union", "A", "B"]);
      expect(stateVariables['/union4m'].stateValues.value).eqls(["union", "A", "B"]);
    })


    cy.get(`#\\/splits1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })
    cy.get(`#\\/splits2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })
    cy.get(`#\\/splits3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })
    cy.get(`#\\/splits4 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })
    cy.get(`#\\/splits5 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })
    cy.get(`#\\/splits6 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xy')
    })
    cy.get('#\\/splits1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })
    cy.get('#\\/splits2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })
    cy.get('#\\/splits3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })
    cy.get('#\\/splits4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })
    cy.get('#\\/splits5m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })
    cy.get('#\\/splits6m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/splits1'].stateValues.value).eqls("xy");
      expect(stateVariables['/splits2'].stateValues.value).eqls("xy");
      expect(stateVariables['/splits3'].stateValues.value).eqls(["*", "x", "y"]);
      expect(stateVariables['/splits4'].stateValues.value).eqls(["*", "x", "y"]);
      expect(stateVariables['/splits5'].stateValues.value).eqls(["*", "x", "y"]);
      expect(stateVariables['/splits6'].stateValues.value).eqls("xy");
      expect(stateVariables['/splits1m'].stateValues.value).eqls("xy");
      expect(stateVariables['/splits2m'].stateValues.value).eqls("xy");
      expect(stateVariables['/splits3m'].stateValues.value).eqls(["*", "x", "y"]);
      expect(stateVariables['/splits4m'].stateValues.value).eqls(["*", "x", "y"]);
      expect(stateVariables['/splits5m'].stateValues.value).eqls(["*", "x", "y"]);
      expect(stateVariables['/splits6m'].stateValues.value).eqls("xy");
    })

    cy.get('#\\/splits1 textarea').type("{end}z{enter}", { force: true })
    cy.get('#\\/splits2 textarea').type("{end}z{enter}", { force: true })
    cy.get('#\\/splits3 textarea').type("{end}z{enter}", { force: true })
    cy.get('#\\/splits4 textarea').type("{end}z{enter}", { force: true })
    cy.get('#\\/splits5 textarea').type("{end}z{enter}", { force: true })
    cy.get('#\\/splits6 textarea').type("{end}z{enter}", { force: true })


    cy.get(`#\\/splits1 .mq-editable-field`).should('contain.text', 'xyz');
    cy.get(`#\\/splits2 .mq-editable-field`).should('contain.text', 'xyz');
    cy.get(`#\\/splits3 .mq-editable-field`).should('contain.text', 'xyz');
    cy.get(`#\\/splits4 .mq-editable-field`).should('contain.text', 'xyz');
    cy.get(`#\\/splits5 .mq-editable-field`).should('contain.text', 'xyz');
    cy.get(`#\\/splits6 .mq-editable-field`).should('contain.text', 'xyz');
    cy.get('#\\/splits1m .mjx-mrow').should('contain.text', 'xyz');
    cy.get('#\\/splits2m .mjx-mrow').should('contain.text', 'xyz');
    cy.get('#\\/splits3m .mjx-mrow').should('contain.text', 'xyz');
    cy.get('#\\/splits4m .mjx-mrow').should('contain.text', 'xyz');
    cy.get('#\\/splits5m .mjx-mrow').should('contain.text', 'xyz');
    cy.get('#\\/splits6m .mjx-mrow').should('contain.text', 'xyz');

    cy.get(`#\\/splits1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xyz')
    })
    cy.get(`#\\/splits2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xyz')
    })
    cy.get(`#\\/splits3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xyz')
    })
    cy.get(`#\\/splits4 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xyz')
    })
    cy.get(`#\\/splits5 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xyz')
    })
    cy.get(`#\\/splits6 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xyz')
    })
    cy.get('#\\/splits1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/splits2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/splits3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/splits4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/splits5m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get('#\\/splits6m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/splits1'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/splits2'].stateValues.value).eqls("xyz");
      expect(stateVariables['/splits3'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/splits4'].stateValues.value).eqls("xyz");
      expect(stateVariables['/splits5'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/splits6'].stateValues.value).eqls("xyz");
      expect(stateVariables['/splits1m'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/splits2m'].stateValues.value).eqls("xyz");
      expect(stateVariables['/splits3m'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/splits4m'].stateValues.value).eqls("xyz");
      expect(stateVariables['/splits5m'].stateValues.value).eqls(["*", "x", "y", "z"]);
      expect(stateVariables['/splits6m'].stateValues.value).eqls("xyz");
    })



    cy.get(`#\\/hFunction1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h(x)')
    })
    cy.get(`#\\/hFunction2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h(x)')
    })
    cy.get(`#\\/hFunction3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('hx')
    })
    cy.get(`#\\/hFunction4 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('hx')
    })
    cy.get(`#\\/hFunction5 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('hx')
    })
    cy.get(`#\\/hFunction6 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h(x)')
    })
    cy.get('#\\/hFunction1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h(x)')
    })
    cy.get('#\\/hFunction2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h(x)')
    })
    cy.get('#\\/hFunction3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hx')
    })
    cy.get('#\\/hFunction4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hx')
    })
    cy.get('#\\/hFunction5m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hx')
    })
    cy.get('#\\/hFunction6m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h(x)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/hFunction1'].stateValues.value).eqls(["apply", "h", "x"]);
      expect(stateVariables['/hFunction2'].stateValues.value).eqls(["apply", "h", "x"]);
      expect(stateVariables['/hFunction3'].stateValues.value).eqls(["*", "h", "x"]);
      expect(stateVariables['/hFunction4'].stateValues.value).eqls(["*", "h", "x"]);
      expect(stateVariables['/hFunction5'].stateValues.value).eqls(["*", "h", "x"]);
      expect(stateVariables['/hFunction6'].stateValues.value).eqls(["apply", "h", "x"]);
      expect(stateVariables['/hFunction1m'].stateValues.value).eqls(["apply", "h", "x"]);
      expect(stateVariables['/hFunction2m'].stateValues.value).eqls(["apply", "h", "x"]);
      expect(stateVariables['/hFunction3m'].stateValues.value).eqls(["*", "h", "x"]);
      expect(stateVariables['/hFunction4m'].stateValues.value).eqls(["*", "h", "x"]);
      expect(stateVariables['/hFunction5m'].stateValues.value).eqls(["*", "h", "x"]);
      expect(stateVariables['/hFunction6m'].stateValues.value).eqls(["apply", "h", "x"]);
    })


    cy.get('#\\/hFunction1 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}h(y){enter}", { force: true })
    cy.get('#\\/hFunction2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}h(y){enter}", { force: true })
    cy.get('#\\/hFunction3 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}h(y){enter}", { force: true })
    cy.get('#\\/hFunction4 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}h(y){enter}", { force: true })
    cy.get('#\\/hFunction5 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}h(y){enter}", { force: true })
    cy.get('#\\/hFunction6 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}h(y){enter}", { force: true })

    cy.get(`#\\/hFunction1 .mq-editable-field`).should('contain.text', 'h(y)');
    cy.get(`#\\/hFunction2 .mq-editable-field`).should('contain.text', 'h(y)');
    cy.get(`#\\/hFunction3 .mq-editable-field`).should('contain.text', 'h(y)');
    cy.get(`#\\/hFunction4 .mq-editable-field`).should('contain.text', 'h(y)');
    cy.get(`#\\/hFunction5 .mq-editable-field`).should('contain.text', 'h(y)');
    cy.get(`#\\/hFunction6 .mq-editable-field`).should('contain.text', 'h(y)');
    cy.get('#\\/hFunction1m .mjx-mrow').should('contain.text', 'hy');
    cy.get('#\\/hFunction2m .mjx-mrow').should('contain.text', 'h(y)');
    cy.get('#\\/hFunction3m .mjx-mrow').should('contain.text', 'hy');
    cy.get('#\\/hFunction4m .mjx-mrow').should('contain.text', 'h(y)');
    cy.get('#\\/hFunction5m .mjx-mrow').should('contain.text', 'hy');
    cy.get('#\\/hFunction6m .mjx-mrow').should('contain.text', 'h(y)');

    cy.get(`#\\/hFunction1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h(y)')
    })
    cy.get(`#\\/hFunction2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h(y)')
    })
    cy.get(`#\\/hFunction3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h(y)')
    })
    cy.get(`#\\/hFunction4 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h(y)')
    })
    cy.get(`#\\/hFunction5 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h(y)')
    })
    cy.get(`#\\/hFunction6 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h(y)')
    })
    cy.get('#\\/hFunction1m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hy')
    })
    cy.get('#\\/hFunction2m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h(y)')
    })
    cy.get('#\\/hFunction3m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hy')
    })
    cy.get('#\\/hFunction4m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h(y)')
    })
    cy.get('#\\/hFunction5m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hy')
    })
    cy.get('#\\/hFunction6m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h(y)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/hFunction1'].stateValues.value).eqls(["*", "h", "y"]);
      expect(stateVariables['/hFunction2'].stateValues.value).eqls(["apply", "h", "y"]);
      expect(stateVariables['/hFunction3'].stateValues.value).eqls(["*", "h", "y"]);
      expect(stateVariables['/hFunction4'].stateValues.value).eqls(["apply", "h", "y"]);
      expect(stateVariables['/hFunction5'].stateValues.value).eqls(["*", "h", "y"]);
      expect(stateVariables['/hFunction6'].stateValues.value).eqls(["apply", "h", "y"]);
      expect(stateVariables['/hFunction1m'].stateValues.value).eqls(["*", "h", "y"]);
      expect(stateVariables['/hFunction2m'].stateValues.value).eqls(["apply", "h", "y"]);
      expect(stateVariables['/hFunction3m'].stateValues.value).eqls(["*", "h", "y"]);
      expect(stateVariables['/hFunction4m'].stateValues.value).eqls(["apply", "h", "y"]);
      expect(stateVariables['/hFunction5m'].stateValues.value).eqls(["*", "h", "y"]);
      expect(stateVariables['/hFunction6m'].stateValues.value).eqls(["apply", "h", "y"]);
    })


  })

  it('convert and/or into logicals', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="mi" />

    <p>Value: <copy prop="value" target="mi" assignNames="m"/></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('equalities with or')
    cy.get('#\\/mi textarea').type("x=1 or u=x{enter}", { force: true })

    // cy.get(`#\\/mi .mq-editable-field`).should('contain.text', 'x=1 or u=x');
    cy.get('#\\/m .mjx-mrow').should('contain.text', '(x=1)∨(u=x)')

    cy.get(`#\\/mi .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x=1oru=x')
    })


    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x=1)∨(u=x)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "or", ["=", "x", 1], ["=", "u", "x"]
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "or", ["=", "x", 1], ["=", "u", "x"]
      ]);
    })

    cy.log('inequalities with and')
    cy.get('#\\/mi textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}x>3 and x <= 5{enter}", { force: true })

    // cy.get(`#\\/mi .mq-editable-field`).should('contain.text', 'x>3 and x≤5');
    cy.get('#\\/m .mjx-mrow').should('contain.text', '(x>3)∧(x≤5)')

    cy.get(`#\\/mi .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x>3andx≤5')
    })

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x>3)∧(x≤5)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "and", [">", "x", 3], ["le", "x", 5]
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "and", [">", "x", 3], ["le", "x", 5]
      ]);
    })


    cy.log(`don't convert if not word`)
    cy.get('#\\/mi textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}AandBorC{enter}", { force: true })


    // cy.get(`#\\/mi .mq-editable-field`).should('contain.text', 'AandBorC');
    cy.get('#\\/m .mjx-mrow').should('contain.text', 'AandBorC')

    cy.get(`#\\/mi .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('AandBorC')
    })

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('AandBorC')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "*", "A", "a", "n", "d", "B", "o", "r", "C"
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "*", "A", "a", "n", "d", "B", "o", "r", "C"
      ]);
    })

    cy.log(`add parens or spaces`)
    cy.get('#\\/mi textarea').type("{home}({rightArrow}){rightArrow}{rightArrow}{rightArrow} {rightArrow} {rightArrow}{rightArrow}({rightArrow}){enter}", { force: true })

    // cy.get(`#\\/mi .mq-editable-field`).should('contain.text', '(A)and B or(C)');
    cy.get('#\\/m .mjx-mrow').should('contain.text', '(A∧B)∨C')

    cy.get(`#\\/mi .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('(A)andBor(C)')
    })

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(A∧B)∨C')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "or", ["and", "A", "B"], "C"
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "or", ["and", "A", "B"], "C"
      ]);
    })
  })

  it('union from U', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <booleanInput name="ufu" />
    <mathinput name="mi" unionFromU="$ufu" />

    <p>Value: <copy prop="value" target="mi" assignNames="m"/></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('A U C without unionFromU')
    cy.get('#\\/mi textarea').type("A U C{enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', 'AUC')

    cy.get(`#\\/mi .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('AUC')
    })

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('AUC')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "*", "A", "U", "C"
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "*", "A", "U", "C"
      ]);
    })

    cy.log('active unionFromU and modify text')
    cy.get('#\\/ufu').click();
    cy.get('#\\/mi textarea').type("{end}{backspace}B{enter}", { force: true })


    cy.get('#\\/m .mjx-mrow').should('contain.text', 'A∪B')

    cy.get(`#\\/mi .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('AUB')
    })

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A∪B')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "union", "A", "B"
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "union", "A", "B"
      ]);
    })

    cy.log('no substitution without spaces')
    cy.get('#\\/mi textarea').type("{end}{leftArrow}{backspace}{enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', 'AUB')

    cy.get(`#\\/mi .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('AUB')
    })

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('AUB')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "*", "A", "U", "B"
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "*", "A", "U", "B"
      ]);
    })

    cy.log('add parens')
    cy.get('#\\/mi textarea').type("{end}){leftArrow}{leftArrow}({enter}", { force: true })

    cy.get('#\\/m .mjx-mrow').should('contain.text', 'A∪B')

    cy.get(`#\\/mi .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('AU(B)')
    })

    cy.get('#\\/m').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('A∪B')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mi'].stateValues.value).eqls([
        "union", "A", "B"
      ]);
      expect(stateVariables['/m'].stateValues.value).eqls([
        "union", "A", "B"
      ]);
    })

  })

  it('mathinput can merge coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <mathinput name="coords" prefill="(1,2)" />
  <graph>
    <point name="P" coords="$coords" />
  </graph>
  <p>Change x-coordinate: <mathinput name="x1" bindValueTo="$(P{prop='x1'})" /></p>
  <p>Change y-coordinate: <mathinput name="x2" bindValueTo="$(P{prop='x2'})" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/x1 textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get('#\\/coords .mq-editable-field').should('have.text', '(3,2)')

    cy.get('#\\/x2 textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.get('#\\/coords .mq-editable-field').should('have.text', '(3,4)')


  });

  it('mathinput can merge coordinates, immediateValue', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <mathinput name="coords" prefill="(1,2)" />
  <graph>
    <point name="P" coords="$(coords{prop='immediateValue'})" />
  </graph>
  <p>Change x-coordinate: <mathinput name="x1" bindValueTo="$(P{prop='x1'})" /></p>
  <p>Change y-coordinate: <mathinput name="x2" bindValueTo="$(P{prop='x2'})" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/x1 textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get('#\\/coords .mq-editable-field').should('have.text', '(3,2)')

    cy.get('#\\/x2 textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.get('#\\/coords .mq-editable-field').should('have.text', '(3,4)')


  });

  it('change prefill', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p><mathinput name="mi" prefill="(1,2)" /></p>
  <p>Value: <copy prop="value" target="mi" assignNames="m" /></p>
  <p>Prefill: <copy target="mi" prop="prefill" assignNames="pf" /></p>
  <p>Change prefill: <mathinput name="mipf" bindValueTo="$(mi{prop='prefill'})" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/pf .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(1,2)");
    })
    cy.get('#\\/m .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(1,2)");
    })

    cy.get('#\\/mi .mq-editable-field').should('have.text', '(1,2)')
    cy.get('#\\/mipf .mq-editable-field').should('have.text', '(1,2)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mi"].stateValues.value).eqls(["tuple", 1, 2])
      expect(stateVariables["/mi"].stateValues.prefill).eqls(["tuple", 1, 2])
    });

    cy.log('change prefill')

    cy.get('#\\/mipf textarea').type("{end}{leftArrow}{backspace}5{enter}", { force: true }).blur();

    cy.get('#\\/mi .mq-editable-field').should('have.text', '(1,5)')
    cy.get('#\\/mipf .mq-editable-field').should('have.text', '(1,5)')
    cy.get('#\\/m .mjx-mrow').should("contain.text", "(1,5)")
    cy.get('#\\/pf .mjx-mrow').should("contain.text", "(1,5)")

    cy.get('#\\/m .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(1,5)");
    })
    cy.get('#\\/pf .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(1,5)");
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mi"].stateValues.value).eqls(["tuple", 1, 5])
      expect(stateVariables["/mi"].stateValues.prefill).eqls(["tuple", 1, 5])
    });


    cy.log('change value')

    cy.get('#\\/mi textarea').type("{end}{leftArrow}{backspace}9{enter}", { force: true }).blur();

    cy.get('#\\/m .mjx-mrow').should("contain.text", "(1,9)")
    cy.get('#\\/mi .mq-editable-field').should('have.text', '(1,9)')
    cy.get('#\\/mipf .mq-editable-field').should('have.text', '(1,5)')
    cy.get('#\\/pf .mjx-mrow').should("contain.text", "(1,5)")
    cy.get('#\\/m .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(1,9)");
    })
    cy.get('#\\/pf .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(1,5)");
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mi"].stateValues.value).eqls(["tuple", 1, 9])
      expect(stateVariables["/mi"].stateValues.prefill).eqls(["tuple", 1, 5])
    });



    cy.log('change prefill again')

    cy.get('#\\/mipf textarea').type("{end}{leftArrow}{backspace}7{enter}", { force: true }).blur();

    cy.get('#\\/pf .mjx-mrow').should("contain.text", "(1,7)")
    cy.get('#\\/m .mjx-mrow').should("contain.text", "(1,9)")
    cy.get('#\\/mi .mq-editable-field').should('have.text', '(1,9)')
    cy.get('#\\/mipf .mq-editable-field').should('have.text', '(1,7)')
    cy.get('#\\/pf .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(1,7)");
    })
    cy.get('#\\/m .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(1,9)");
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mi"].stateValues.value).eqls(["tuple", 1, 9])
      expect(stateVariables["/mi"].stateValues.prefill).eqls(["tuple", 1, 7])
    });

  });

  it('check ignoreUpdate bug 1', () => {
    // if set core to delay 1 second on updates
    // then the refresh on blur (from the focus field recoil atoms changing)
    // would cause rendererValue.current to be changed to the old SV value
    // as the update wouldn't be ignored
  
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><text>a</text></p>
  <p>n: <mathinput name="n" prefill="10" /></p>
  <p>Value of n: <copy prop="value" target="n" assignNames="n2" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    // by highlighting and typing a number, we make sure the rendererValue changes directly 
    // from 10 to 20 and back to 10 (without other changes that would hide the bug)
    cy.get('#\\/n textarea').type("{home}{shift+rightArrow}2", {force: true}).blur();
    cy.get('#\\/n2').should('contain.text', "20");

    cy.get('#\\/n textarea').type("{home}{shift+rightArrow}1", {force: true}).blur();
    cy.get('#\\/n2').should('contain.text', "10");


  });


  it('check ignoreUpdate bug 1', () => {
    // if set core to delay 1 second on updates
    // the extra update from focusing another mathinput wasn't being ignored
    // leading rendererValue to get out of sync

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>c: <mathinput name="c" prefill="x" /></p>
    <p>c2: <copy prop="value" target="c" assignNames="c2" /></p>
    <p>d: <mathinput name="d" /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');


    cy.get('#\\/c textarea').type('{end}y{enter}', { force: true });
    cy.get('#\\/d textarea').focus();

    cy.get('#\\/c2').should('contain.text', 'xy')
    cy.get('#\\/c .mq-editable-field').should('contain.text', 'xy')
    cy.get('#\\/c2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("xy");
    })

    // need next update to go back to x for the bug to be revealed
    cy.get('#\\/c textarea').type('{end}{backspace}{enter}', { force: true });
    cy.get('#\\/c2').should('not.contain.text', 'xy')
    cy.get('#\\/c .mq-editable-field').should('contain.text', 'x')
    cy.get('#\\/c2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("x");
    })
  })


});