describe('Mathinput Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
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
      let mathinput1aAnchor = '#' + mathinput1a.componentName + '_input';
      let math1 = components['/_copy2'].replacements[0];
      let math1Anchor = '#' + math1.componentName;
      let math2 = components['/_copy3'].replacements[0];
      let math2Anchor = '#' + math2.componentName;


      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + 1');
      cy.get(mathinput1aAnchor).should('have.value', 'x + 1');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

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
      cy.get('#\\/_mathinput1_input').type(`2`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
      cy.get(mathinput1aAnchor).should('have.value', 'x + 1');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

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


      cy.log("Pressing Escape undoes change");
      cy.get('#\\/_mathinput1_input').type(`{esc}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + 1');
      cy.get(mathinput1aAnchor).should('have.value', 'x + 1');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

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


      cy.log("Typing 3 in first mathinput");
      cy.get('#\\/_mathinput1_input').type(`3`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + 13');
      cy.get(mathinput1aAnchor).should('have.value', 'x + 1');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

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
      cy.get('#\\/_mathinput1_input').type(`{enter}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + 13');
      cy.get(mathinput1aAnchor).should('have.value', 'x + 13');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

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


      cy.log("Pressing Escape does not undo change");
      cy.get('#\\/_mathinput1_input').type(`{esc}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + 13');
      cy.get(mathinput1aAnchor).should('have.value', 'x + 13');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

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



      cy.log("Erasing 13 and typing y second mathinput");
      cy.get('#\\/_mathinput1_input').blur();
      cy.get(mathinput1aAnchor).type(`{backspace}{backspace}y`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + 13');
      cy.get(mathinput1aAnchor).should('have.value', 'x + y');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

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
      cy.get('#\\/_mathinput1_input').focus();

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + y');
      cy.get(mathinput1aAnchor).should('have.value', 'x + y');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

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



      cy.log("Changing escape doesn't do anything");
      cy.get('#\\/_mathinput1_input').type("{esc}");

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + y');
      cy.get(mathinput1aAnchor).should('have.value', 'x + y');
      cy.get('#\\/_mathinput2_input').should('have.value', '');

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


      // pq in third input

      cy.log("Typing pq in third mathinput");
      cy.get('#\\/_mathinput2_input').type(`pq`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + y');
      cy.get(mathinput1aAnchor).should('have.value', 'x + y');
      cy.get('#\\/_mathinput2_input').should('have.value', 'pq');

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
      cy.get('#\\/_mathinput2_input').type(`{enter}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + y');
      cy.get(mathinput1aAnchor).should('have.value', 'x + y');
      cy.get('#\\/_mathinput2_input').should('have.value', 'pq');

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
      cy.get(mathinput1aAnchor).clear().type(`abc`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'x + y');
      cy.get(mathinput1aAnchor).should('have.value', 'abc');
      cy.get('#\\/_mathinput2_input').should('have.value', 'pq');

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
      cy.get('#\\/_mathinput1_input').should('have.value', 'a b c');
      cy.get(mathinput1aAnchor).should('have.value', 'abc');
      cy.get('#\\/_mathinput2_input').should('have.value', 'pq');

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
      cy.get('#\\/_mathinput1_input').clear().type(`abc{enter}`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'abc');
      cy.get(mathinput1aAnchor).should('have.value', 'abc');
      cy.get('#\\/_mathinput2_input').should('have.value', 'pq');

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
      cy.get('#\\/_mathinput2_input').clear().type(`u/v`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'abc');
      cy.get(mathinput1aAnchor).should('have.value', 'abc');
      cy.get('#\\/_mathinput2_input').should('have.value', 'u/v');

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
      cy.get('#\\/_mathinput1_input').type(`d`);

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'abcd');
      cy.get(mathinput1aAnchor).should('have.value', 'abc');
      cy.get('#\\/_mathinput2_input').should('have.value', 'u/v');

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
      cy.get('#\\/_mathinput1_input').blur();

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'abcd');
      cy.get(mathinput1aAnchor).should('have.value', 'a b c d');
      cy.get('#\\/_mathinput2_input').should('have.value', 'u/v');

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
      cy.get(mathinput1aAnchor).clear();

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', 'abcd');
      cy.get(mathinput1aAnchor).should('have.value', '');
      cy.get('#\\/_mathinput2_input').should('have.value', 'u/v');

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
      cy.get('#\\/_mathinput2_input').focus();

      cy.log('Test values displayed in browser')
      cy.get('#\\/_mathinput1_input').should('have.value', '');
      cy.get(mathinput1aAnchor).should('have.value', '');
      cy.get('#\\/_mathinput2_input').should('have.value', 'u/v');


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
    <p>Mathinput based on math: <mathinput><copy tname="_math1" /></mathinput></p>
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
      let mathinput2Anchor = '#' + mathinput2.componentName + '_input';
      let value1Anchor = '#' + components['/value1'].replacements[0].componentName;
      let immedateValue1Anchor = '#' + components['/immediate1'].replacements[0].componentName;
      let value2Anchor = '#' + components['/value2'].replacements[0].componentName;
      let immediateValue2Anchor = '#' + components['/immediate2'].replacements[0].componentName;

      cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x');
      cy.get(mathinput2Anchor).should('have.value', '1 + 2 x');

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
      cy.get('#\\/_mathinput1_input').clear().type(`xy`);

      cy.get('#\\/_mathinput1_input').should('have.value', 'xy');
      cy.get(mathinput2Anchor).should('have.value', '1 + 2 x');

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
      cy.get('#\\/_mathinput1_input').type(`{enter}`);

      cy.get('#\\/_mathinput1_input').should('have.value', 'xy');
      cy.get(mathinput2Anchor).should('have.value', 'x y');

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
      cy.get(mathinput2Anchor).clear().type(`qr{enter}`);

      cy.get('#\\/_mathinput1_input').should('have.value', 'q r');
      cy.get(mathinput2Anchor).should('have.value', 'qr');

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
    <p>Mathinput based on math: <mathinput prefill="x^2/9"><copy tname="_math1" /></mathinput></p>
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
      let mathinput2Anchor = '#' + mathinput2.componentName + '_input';
      let value1Anchor = '#' + components['/value1'].replacements[0].componentName;
      let immedateValue1Anchor = '#' + components['/immediate1'].replacements[0].componentName;
      let value2Anchor = '#' + components['/value2'].replacements[0].componentName;
      let immediateValue2Anchor = '#' + components['/immediate2'].replacements[0].componentName;


      cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x');
      cy.get(mathinput2Anchor).should('have.value', '1 + 2 x');

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
    <p>Mathinput based on math: <mathinput><copy tname="_math1" /></mathinput></p>
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
      let mathinput2Anchor = '#' + mathinput2.componentName + '_input';
      let value1Anchor = '#' + components['/value1'].replacements[0].componentName;
      let immedateValue1Anchor = '#' + components['/immediate1'].replacements[0].componentName;
      let value2Anchor = '#' + components['/value2'].replacements[0].componentName;
      let immediateValue2Anchor = '#' + components['/immediate2'].replacements[0].componentName;


      cy.get('#\\/_mathinput1_input').should('have.value', '3 x + 1');
      cy.get(mathinput2Anchor).should('have.value', '3 x + 1');

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
      cy.get('#\\/_mathinput1_input').clear().type(`xy{enter}`);

      cy.get('#\\/_mathinput1_input').should('have.value', 'xy');
      cy.get(mathinput2Anchor).should('have.value', 'x y');

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
      cy.get(mathinput2Anchor).clear().type(`qr{enter}`);

      cy.get('#\\/_mathinput1_input').should('have.value', 'q r');
      cy.get(mathinput2Anchor).should('have.value', 'qr');

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
    <p>Mathinput based on math: <mathinput><copy tname="_math1" /></mathinput></p>
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
      let mathinput2Anchor = '#' + mathinput2.componentName + '_input';
      let value1Anchor = '#' + components['/value1'].replacements[0].componentName;
      let immedateValue1Anchor = '#' + components['/immediate1'].replacements[0].componentName;
      let value2Anchor = '#' + components['/value2'].replacements[0].componentName;
      let immediateValue2Anchor = '#' + components['/immediate2'].replacements[0].componentName;

      cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x z');
      cy.get(mathinput2Anchor).should('have.value', '1 + 2 x z');

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
      cy.get('#\\/_mathinput1_input').clear().type(`xy{enter}`);

      cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x z');
      cy.get(mathinput2Anchor).should('have.value', '1 + 2 x z');

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
      cy.get(mathinput2Anchor).clear().type(`qr{enter}`);

      cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x z');
      cy.get(mathinput2Anchor).should('have.value', '1 + 2 x z');

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
    <p>mathinput based on mathinput: <mathinput><copy prop="value" tname="_mathinput1" /></mathinput></p>
    <p>Immediate value of original: <math name="originalimmediate"><copy prop="immediateValue" tname="_mathinput1"/></math></p>
    <p>Value of original: <math name="originalvalue"><copy prop="value" tname="_mathinput1"/></math></p>
    <p>Immediate value of second: <math name="secondimmediate"><copy prop="immediateValue" tname="_mathinput2"/></math></p>
    <p>Value of second: <math name="secondvalue"><copy prop="value" tname="_mathinput2"/></math></p>
  `}, "*");
    });

    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 1');
    cy.get('#\\/_mathinput2_input').should('have.value', 'x + 1');


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
    cy.get('#\\/_mathinput1_input').type(`2`);

    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    cy.get('#\\/_mathinput2_input').should('have.value', 'x + 1');

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
    cy.get('#\\/_mathinput1_input').type(`{enter}`);

    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    cy.get('#\\/_mathinput2_input').should('have.value', 'x + 12');

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
    cy.get('#\\/_mathinput2_input').type(`3`);

    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    cy.get('#\\/_mathinput2_input').should('have.value', 'x + 123');

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
    cy.get('#\\/_mathinput2_input').blur();

    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 123');
    cy.get('#\\/_mathinput2_input').should('have.value', 'x + 123');

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
    <p>mathinput based on mathinput: <mathinput><copy prop="immediatevalue" tname="_mathinput1" /></mathinput></p>
    <p>Immediate value of original: <math name="originalimmediate"><copy prop="immediateValue" tname="_mathinput1"/></math></p>
    <p>Value of original: <math name="originalvalue"><copy prop="value" tname="_mathinput1"/></math></p>
    <p>Immediate value of second: <math name="secondimmediate"><copy prop="immediateValue" tname="_mathinput2"/></math></p>
    <p>Value of second: <math name="secondvalue"><copy prop="value" tname="_mathinput2"/></math></p>
  `}, "*");
    });

    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 1');
    cy.get('#\\/_mathinput2_input').should('have.value', 'x + 1');


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
    cy.get('#\\/_mathinput1_input').type(`2`);

    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    cy.get('#\\/_mathinput2_input').should('have.value', 'x + 12');

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
    cy.get('#\\/_mathinput1_input').type(`{enter}`);

    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    cy.get('#\\/_mathinput2_input').should('have.value', 'x + 12');

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
    cy.get('#\\/_mathinput2_input').type(`3`);

    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    cy.get('#\\/_mathinput2_input').should('have.value', 'x + 123');

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
    cy.get('#\\/_mathinput2_input').blur();

    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 123');
    cy.get('#\\/_mathinput2_input').should('have.value', 'x + 123');

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



  it('preview input', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>Enter math</text>
    <mathinput name="a"/>
    <mathinput name="b"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'Enter math');

    cy.get('#\\/a_input').should('have.value', '');

    cy.get('#\\/a_input_preview').should('not.be.visible')

    cy.get('#\\/a_input').type('x');
    cy.get('#\\/a_input').should('have.value', 'x');
    cy.get('#\\/a_input_preview').should('be.visible')
    cy.get('#\\/a_input_preview').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/b_input_preview').should('not.be.visible')

    cy.get('#\\/a_input').type('^');
    cy.wait(500);
    cy.get('#\\/a_input').should('have.value', 'x^');
    cy.get('#\\/a_input_preview').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/b_input_preview').should('not.be.visible')

    cy.wait(3000);
    cy.get('#\\/a_input').should('have.value', 'x^');
    cy.get('#\\/a_input_preview').invoke('text').then((text) => {
      expect(text.substring(0, 5)).equal('Error')
    });
    cy.get('#\\/b_input_preview').should('not.be.visible')

    cy.get('#\\/a_input').type('2');
    cy.get('#\\/a_input').should('have.value', 'x^2');
    cy.get('#\\/a_input_preview').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2')
    });
    cy.get('#\\/b_input_preview').should('not.be.visible')

    cy.get('#\\/a_input').blur();
    cy.get('#\\/b_input').type('a');
    cy.get('#\\/a_input').should('have.value', 'x^2');
    cy.get('#\\/a_input_preview').should('not.be.visible')
    cy.get('#\\/b_input').should('have.value', 'a');
    cy.get('#\\/b_input_preview').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    });

    cy.get('#\\/a_input').type('3');
    cy.get('#\\/a_input').should('have.value', 'x^23');
    cy.get('#\\/a_input_preview').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x23')
    });
    cy.get('#\\/b_input').should('have.value', 'a');
    cy.get('#\\/b_input_preview').should('not.be.visible')

    cy.get('#\\/a_input').blur();
    cy.get('#\\/b_input').type('b');
    cy.get('#\\/a_input').should('have.value', 'x^23');
    cy.get('#\\/a_input_preview').should('not.be.visible')
    cy.get('#\\/b_input').should('have.value', 'ab');
    cy.get('#\\/b_input_preview').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('ab')
    });

  })

  it('accurately reduce vector length', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>Enter vector</text>
    <mathinput name="a"/>
    `}, "*");
    });

    // verify fixed bug where didn't reduce size of a vector

    cy.get('#\\/_text1').should('have.text', 'Enter vector');

    cy.get('#\\/a_input').should('have.value', '');

    cy.get('#\\/a_input').type('(1,2,3){enter}');
    cy.get('#\\/a_input').should('have.value', '(1,2,3)');

    cy.get('#\\/a_input').clear().type('(2,3){enter}');
    cy.get('#\\/a_input').should('have.value', '(2,3)');

  })

});