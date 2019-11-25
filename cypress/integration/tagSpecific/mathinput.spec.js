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
        doenetCode: `
    <mathinput prefill='x+1'/>
    <ref>_mathinput1</ref>
    <ref prop='value'>_mathinput1</ref>
    <mathinput/>`}, "*");
    });

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 1');
    cy.get('#__mathinput1_input').should('have.value', 'x + 1');
    cy.get('#\\/_mathinput2_input').should('have.value', '');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 'x', 1]);
      expect(components['/_ref1'].replacements[0].state.value.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput2'].state.value.tree).to.eq('\uFF3F');
    });


    // type 2 in first input

    cy.log("Typing 2 in first mathinput");
    cy.get('#\\/_mathinput1_input').type(`2`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    cy.get('#__mathinput1_input').should('have.value', 'x + 1');
    cy.get('#\\/_mathinput2_input').should('have.value', '');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 'x', 1]);
      expect(components.__mathinput1.state.value.tree).eqls(['+', 'x', 1]);
      expect(components['/_mathinput2'].state.value.tree).to.eq('\uFF3F');
    });


    // press enter in first input

    cy.log("Pressing Enter in first mathinput");
    cy.get('#\\/_mathinput1_input').type(`{enter}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    cy.get('#__mathinput1_input').should('have.value', 'x + 12');
    cy.get('#\\/_mathinput2_input').should('have.value', '');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 'x', 12]);
      expect(components.__mathinput1.state.value.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput2'].state.value.tree).to.eq('\uFF3F');
    });


    // erase 12 and type y in second input

    cy.log("Erasing 12 and typing y second mathinput");
    cy.get('#\\/_mathinput1_input').blur();
    cy.get('#__mathinput1_input').type(`{backspace}{backspace}y`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x + 12');
    cy.get('#__mathinput1_input').should('have.value', 'x + y');
    cy.get('#\\/_mathinput2_input').should('have.value', '');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+12')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 'x', 12]);
      expect(components.__mathinput1.state.value.tree).eqls(['+', 'x', 12]);
      expect(components['/_mathinput2'].state.value.tree).to.eq('\uFF3F');
    });


    // change focus to mathinput 1
    cy.log("Changing focus to first mathinput");
    cy.get('#\\/_mathinput1_input').focus();

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x + y');
    cy.get('#__mathinput1_input').should('have.value', 'x + y');
    cy.get('#\\/_mathinput2_input').should('have.value', '');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 'x', 'y']);
      expect(components.__mathinput1.state.value.tree).eqls(['+', 'x', 'y']);
      expect(components['/_mathinput2'].state.value.tree).to.eq('\uFF3F');
    });


    // pq in third input

    cy.log("Typing pq in third mathinput");
    cy.get('#\\/_mathinput2_input').type(`pq`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x + y');
    cy.get('#__mathinput1_input').should('have.value', 'x + y');
    cy.get('#\\/_mathinput2_input').should('have.value', 'pq');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 'x', 'y']);
      expect(components.__mathinput1.state.value.tree).eqls(['+', 'x', 'y']);
      expect(components['/_mathinput2'].state.value.tree).to.eq('\uFF3F');
    });



    // press enter in mathinput 3

    cy.log("Pressing enter in third mathinput");
    cy.get('#\\/_mathinput2_input').type(`{enter}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x + y');
    cy.get('#__mathinput1_input').should('have.value', 'x + y');
    cy.get('#\\/_mathinput2_input').should('have.value', 'pq');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 'x', 'y']);
      expect(components.__mathinput1.state.value.tree).eqls(['+', 'x', 'y']);
      expect(components['/_mathinput2'].state.value.tree).eqls(['*', 'p', 'q']);
    });


    // type abc enter in mathinput 2

    cy.log("Typing abc in second mathinput");
    cy.get('#__mathinput1_input').clear().type(`abc`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'x + y');
    cy.get('#__mathinput1_input').should('have.value', 'abc');
    cy.get('#\\/_mathinput2_input').should('have.value', 'pq');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 'x', 'y']);
      expect(components.__mathinput1.state.value.tree).eqls(['+', 'x', 'y']);
      expect(components['/_mathinput2'].state.value.tree).eqls(['*', 'p', 'q']);
    });


    // press enter in mathinput 2

    cy.log("Pressing enter in second mathinput");
    cy.get('#__mathinput1_input').type(`{enter}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'a b c');
    cy.get('#__mathinput1_input').should('have.value', 'abc');
    cy.get('#\\/_mathinput2_input').should('have.value', 'pq');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['*', 'a', 'b', 'c']);
      expect(components.__mathinput1.state.value.tree).eqls(['*', 'a', 'b', 'c']);
      expect(components['/_mathinput2'].state.value.tree).eqls(['*', 'p', 'q']);
    });

    // type abc in mathinput 1

    cy.log("Typing abc in first mathinput");
    cy.get('#\\/_mathinput1_input').clear().type(`abc`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'abc');
    cy.get('#__mathinput1_input').should('have.value', 'abc');
    cy.get('#\\/_mathinput2_input').should('have.value', 'pq');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['*', 'a', 'b', 'c']);
      expect(components.__mathinput1.state.value.tree).eqls(['*', 'a', 'b', 'c']);
      expect(components['/_mathinput2'].state.value.tree).eqls(['*', 'p', 'q']);
    });


    // type u/v in mathinput 3

    cy.log("Typing u/v in third mathinput");
    cy.get('#\\/_mathinput2_input').clear().type(`u/v`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'abc');
    cy.get('#__mathinput1_input').should('have.value', 'abc');
    cy.get('#\\/_mathinput2_input').should('have.value', 'u/v');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['*', 'a', 'b', 'c']);
      expect(components.__mathinput1.state.value.tree).eqls(['*', 'a', 'b', 'c']);
      expect(components['/_mathinput2'].state.value.tree).eqls(['*', 'p', 'q']);
    });


    // type d in mathinput 1

    cy.log("Typing d in first mathinput");
    cy.get('#\\/_mathinput1_input').type(`d`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'abcd');
    cy.get('#__mathinput1_input').should('have.value', 'abc');
    cy.get('#\\/_mathinput2_input').should('have.value', 'u/v');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abc')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['*', 'a', 'b', 'c']);
      expect(components.__mathinput1.state.value.tree).eqls(['*', 'a', 'b', 'c']);
      expect(components['/_mathinput2'].state.value.tree).eqls(['/', 'u', 'v']);
    });


    cy.log("Typing enter in first mathinput");
    cy.get('#\\/_mathinput1_input').type(`{enter}`);

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'abcd');
    cy.get('#__mathinput1_input').should('have.value', 'a b c d');
    cy.get('#\\/_mathinput2_input').should('have.value', 'u/v');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abcd')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(components.__mathinput1.state.value.tree).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(components['/_mathinput2'].state.value.tree).eqls(['/', 'u', 'v']);
    });


    cy.log("Clearing second mathinput");
    cy.get('#\\/_mathinput1_input').blur();
    cy.get('#__mathinput1_input').clear();

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', 'abcd');
    cy.get('#__mathinput1_input').should('have.value', '');
    cy.get('#\\/_mathinput2_input').should('have.value', 'u/v');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('abcd')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(components.__mathinput1.state.value.tree).eqls(['*', 'a', 'b', 'c', 'd']);
      expect(components['/_mathinput2'].state.value.tree).eqls(['/', 'u', 'v']);
    });


    cy.log("Focusing third mathinput");
    cy.get('#\\/_mathinput2_input').focus();

    cy.log('Test values displayed in browser')
    cy.get('#\\/_mathinput1_input').should('have.value', '');
    cy.get('#__mathinput1_input').should('have.value', '');
    cy.get('#\\/_mathinput2_input').should('have.value', 'u/v');

    cy.get('#__math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('\uFF3F')
    });

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).to.eq('\uFF3F');
      expect(components.__mathinput1.state.value.tree).to.eq('\uFF3F');
      expect(components['/_mathinput2'].state.value.tree).eqls(['/', 'u', 'v']);
    });




  })

  it('downstream from mathinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <p>Original math: <math>1+2x</math></p>
    <p>Mathinput based on math: <mathinput><ref>_math1</ref></mathinput></p>
    <p>Reffed mathinput: <ref>_mathinput1</ref></p>
    `}, "*");
    });

    cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x');
    cy.get('#__mathinput1_input').should('have.value', '1 + 2 x');

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
      expect(components['/_math1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x']]);
    });

    cy.log('enter new values')
    cy.get('#\\/_mathinput1_input').clear().type(`xy{enter}`);

    cy.get('#\\/_mathinput1_input').should('have.value', 'xy');
    cy.get('#__mathinput1_input').should('have.value', 'x y');

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['*', 'x', 'y']);
      expect(components['/_math1'].state.value.tree).eqls(['*', 'x', 'y']);
      expect(components['__mathinput1'].state.value.tree).eqls(['*', 'x', 'y']);
    });

    cy.log('enter new values in referenced')
    cy.get('#__mathinput1_input').clear().type(`qr{enter}`);

    cy.get('#\\/_mathinput1_input').should('have.value', 'q r');
    cy.get('#__mathinput1_input').should('have.value', 'qr');

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['*', 'q', 'r']);
      expect(components['/_math1'].state.value.tree).eqls(['*', 'q', 'r']);
      expect(components['__mathinput1'].state.value.tree).eqls(['*', 'q', 'r']);
    });


    cy.log('prefill ignored');
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <p>Original math: <math>1+2x</math></p>
    <p>Mathinput based on math: <mathinput prefill="x^2/9"><ref>_math1</ref></mathinput></p>
    <p>Reffed mathinput: <ref>_mathinput1</ref></p>
    `}, "*");
    });

    cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x');
    cy.get('#__mathinput1_input').should('have.value', '1 + 2 x');

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2x')
    });


    cy.log("normal downstream rules apply")
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <p>Original math: <math>1+<math>3x</math></math></p>
    <p>Mathinput based on math: <mathinput><ref>_math1</ref></mathinput></p>
    <p>Reffed mathinput: <ref>_mathinput1</ref></p>
    `}, "*");
    });

    cy.get('#\\/_mathinput1_input').should('have.value', '1 + 3 x');
    cy.get('#__mathinput1_input').should('have.value', '1 + 3 x');

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+3x')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 1, ['*', 3, 'x']]);
      expect(components['__mathinput1'].state.value.tree).eqls(['+', 1, ['*', 3, 'x']]);
      expect(components['/_math1'].state.value.tree).eqls(['+', 1, ['*', 3, 'x']]);
      expect(components['/_math2'].state.value.tree).eqls(['*', 3, 'x']);
    });


    cy.log('enter new values')
    cy.get('#\\/_mathinput1_input').clear().type(`xy{enter}`);

    cy.get('#\\/_mathinput1_input').should('have.value', 'xy');
    cy.get('#__mathinput1_input').should('have.value', 'x y');

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['*', 'x', 'y']);
      expect(components['__mathinput1'].state.value.tree).eqls(['*', 'x', 'y']);
      expect(components['/_math1'].state.value.tree).eqls(['*', 'x', 'y']);
      expect(components['/_math2'].state.value.tree).eqls(['+', ['*', 'x', 'y'], -1]);
    });


    cy.log('enter new values in reffed')
    cy.get('#__mathinput1_input').clear().type(`qr{enter}`);

    cy.get('#\\/_mathinput1_input').should('have.value', 'q r');
    cy.get('#__mathinput1_input').should('have.value', 'qr');

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qr')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['*', 'q', 'r']);
      expect(components['__mathinput1'].state.value.tree).eqls(['*', 'q', 'r']);
      expect(components['/_math1'].state.value.tree).eqls(['*', 'q', 'r']);
      expect(components['/_math2'].state.value.tree).eqls(['+', ['*', 'q', 'r'], -1]);
    });


    cy.log("values revert if not updatable")
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <p>Original math: <math>1+<math>2x</math><math>z</math></math></p>
    <p>Mathinput based on math: <mathinput><ref>_math1</ref></mathinput></p>
    <p>Reffed mathinput: <ref>_mathinput1</ref></p>
    `}, "*");
    });

    cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x z');
    cy.get('#__mathinput1_input').should('have.value', '1 + 2 x z');

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(components['/_math1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(components['__mathinput1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
    });

    cy.log('enter new values, but they revert')
    cy.get('#\\/_mathinput1_input').clear().type(`xy{enter}`);

    cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x z');
    cy.get('#__mathinput1_input').should('have.value', '1 + 2 x z');

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(components['/_math1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(components['__mathinput1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
    });


    cy.log('enter new values in reffed, but they revert')
    cy.get('#__mathinput1_input').clear().type(`qr{enter}`);

    cy.get('#\\/_mathinput1_input').should('have.value', '1 + 2 x z');
    cy.get('#__mathinput1_input').should('have.value', '1 + 2 x z');

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1+2xz')
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_mathinput1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(components['/_math1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
      expect(components['__mathinput1'].state.value.tree).eqls(['+', 1, ['*', 2, 'x', 'z']]);
    });


  })

  it('preview input', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
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
      expect(text.substring(0,5)).equal('Error')
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
        doenetCode: `
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