import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('MatrixInput Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('no arguments, copy matrixinput', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Matrix 1: <matrixInput name="mi1" /></p>
    <p>Matrix 2: <copy target="mi1" assignNames="mi2" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m1" /></p>
    <p>Matrix 4: <copy prop="immediateValue" target="mi1" assignNames="m2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", '＿']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('type a in mi1')
    cy.get('#\\/mi1 textarea').type("a", { force: true });

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[a]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAstA = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'a']]]
      let matrixAstBlank = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", '＿']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAstA);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAstBlank);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAstA);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAstBlank);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAstBlank);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAstA);
    });


    cy.log('blur')
    cy.get('#\\/mi1 textarea').blur();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    // use alternate form as it isn't waiting long enough
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).should('have.text', 'a')
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[a]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'a']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row to mi1')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[a＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'a'], ["tuple", '＿']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('type b in second row of mi2')
    cy.get('#\\/mi2_component_1_0 textarea').type("b", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ab]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'a'], ["tuple", '＿']]]
      let matrixAstB = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'a'], ["tuple", 'b']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAstB);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAstB);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAstB);
    });


    cy.log('type enter')
    cy.get('#\\/mi2_component_1_0 textarea').type("{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ab]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ab]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'a'], ["tuple", 'b']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add column to mi2')
    cy.get('#\\/mi2_columnIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a＿b＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[a＿b＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'a', '＿'], ["tuple", 'b', '＿']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('c and d in second column')
    cy.get('#\\/mi2_component_0_1 textarea').type("c", { force: true })
    cy.get('#\\/mi2_component_1_1 textarea').type("d", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[acb＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[acbd]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'a', 'c'], ["tuple", 'b', '＿']]]
      let matrixAstD = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'a', 'c'], ["tuple", 'b', 'd']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAstD);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAstD);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAstD);
    });


    cy.log('blur')
    cy.get('#\\/mi2_component_1_1 textarea').blur()

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    // use alternate form as it isn't waiting long enough
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'd')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[acbd]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[acbd]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'a', 'c'], ["tuple", 'b', 'd']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('remove row in mi2')
    cy.get('#\\/mi2_rowDecrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ac]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ac]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'a', 'c']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });



    cy.log('change second value')
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}e{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ae]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ae]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'a', 'e']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('remove column in mi1')
    cy.get('#\\/mi1_columnDecrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[a]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'a']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change value')
    cy.get('#\\/mi2_component_0_0 textarea').type("{end}{backspace}f{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[f]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[f]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'f']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('values remembered when add back row and column')
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi2_rowIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[febd]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[febd]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'f', 'e'], ["tuple", 'b', 'd']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change values')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}g", { force: true })
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}h", { force: true })
    cy.get('#\\/mi2_component_1_0 textarea').type("{end}{backspace}i", { force: true })
    cy.get('#\\/mi2_component_1_1 textarea').type("{end}{backspace}j", { force: true }).blur()

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    // use alternate form as it isn't waiting long enough
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).should('have.text', 'j')
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ghij]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ghij]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'g', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.immediateValue.tree).eqls(matrixAst);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

  })

  it('prefill with matrix', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Matrix 1: <matrixInput name="mi1" format="latex" prefill="\\begin{matrix}a & b\\\\c & d\\end{matrix}" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[abcd]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'a', 'b'], ["tuple", 'c', 'd']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('remove column')
    cy.get('#\\/mi1_columnDecrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ac]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'a'], ["tuple", 'c']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}z{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[zc]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'z'], ["tuple", 'c']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add column back')
    cy.get('#\\/mi1_columnIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[zbcd]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'z', 'b'], ["tuple", 'c', 'd']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change values')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true })
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/mi1_rowDecrement').click();
    cy.get('#\\/mi1_columnDecrement').click();
    cy.get('#\\/mi1_rowDecrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });



    cy.log('up to 3x3 entry')
    cy.get('#\\/mi1_rowIncrement').click();
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('prefill with matrix, start smaller', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" format="latex" prefill="\\begin{matrix}a & b\\\\c & d\\end{matrix}" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row and column')
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'a']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change value')
    cy.get('#\\/mi1 textarea').type("{end}{backspace}e{enter}", { force: true });

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ec]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'c']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('type f in second row')
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ef]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add column via mathinput')
    cy.get('#\\/numColumns textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ebfd]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'b'], ["tuple", 'f', 'd']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('g and h in second column')
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row via mathinput')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });



    cy.log('up to 3x3 entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('prefill with vector', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ab]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'a'], ["tuple", 'b']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('remove row')
    cy.get('#\\/mi1_rowDecrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'a']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('restore row')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[eb]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'b']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('type f in second row')
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ef]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add column')
    cy.get('#\\/mi1_columnIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e＿f＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', '＿'], ["tuple", 'f', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('g and h in second column')
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/mi1_rowDecrement').click();
    cy.get('#\\/mi1_columnDecrement').click();
    cy.get('#\\/mi1_rowDecrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });



    cy.log('up to 3x3 entry')
    cy.get('#\\/mi1_rowIncrement').click();
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('prefill with vector, start smaller', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row and column')
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'a']]]
      console.log(components['/mi1'].stateValues.value.tree)
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change value')
    cy.get('#\\/mi1 textarea').type("{end}{backspace}e{enter}", { force: true });

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[eb]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'b']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('type f in second row')
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ef]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add column via mathinput')
    cy.get('#\\/numColumns textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e＿f＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', '＿'], ["tuple", 'f', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('g and h in second column')
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row via mathinput')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });



    cy.log('up to 3x3 entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('prefill with transpose of vector', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)^T" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ab]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'a', 'b']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('remove column')
    cy.get('#\\/mi1_columnDecrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'a']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('restore column')
    cy.get('#\\/mi1_columnIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[eb]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'e', 'b']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[eb＿＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'b'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change values')
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/mi1_rowDecrement').click();
    cy.get('#\\/mi1_columnDecrement').click();
    cy.get('#\\/mi1_rowDecrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });



    cy.log('up to 3x3 entry')
    cy.get('#\\/mi1_rowIncrement').click();
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('prefill with transpose of vector, start smaller', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)^T" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row and column')
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'a']]]
      console.log(components['/mi1'].stateValues.value.tree)
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change value')
    cy.get('#\\/mi1 textarea').type("{end}{backspace}e{enter}", { force: true });

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('type f in second row')
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ef]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add column via mathinput')
    cy.get('#\\/numColumns textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ebf＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'b'], ["tuple", 'f', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('g and h in second column')
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row via mathinput')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });



    cy.log('up to 3x3 entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('prefill with transpose of vector, start smaller, alternative format', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)'" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row and column')
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[a]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'a']]]
      console.log(components['/mi1'].stateValues.value.tree)
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change value')
    cy.get('#\\/mi1 textarea').type("{end}{backspace}e{enter}", { force: true });

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('type f in second row')
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ef]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add column via mathinput')
    cy.get('#\\/numColumns textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ebf＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'b'], ["tuple", 'f', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('g and h in second column')
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row via mathinput')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });



    cy.log('up to 3x3 entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('bind to matrix', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1{prop='numRows'})" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1{prop='numColumns'})" /></p>

    <p>Matrix 1: <math name="m1" format="latex">\\begin{matrix}a & b\\\\c & d\\end{matrix}</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[abcd]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[abcd]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'a', 'b'], ["tuple", 'c', 'd']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change entries')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true })
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row via mathinput')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });



    cy.log('up to 3x3 entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('bind to matrix, ignore size via definition', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" prefill="7" /></p>
    <p>Number of columns: <mathinput name="numColumns" prefill="5" /></p>

    <p>Matrix 1: <math name="m1" format="latex">\\begin{matrix}a & b\\\\c & d\\end{matrix}</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[abcd]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[abcd]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'a', 'b'], ["tuple", 'c', 'd']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('d')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ebcd]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ebcd]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'b'], ["tuple", 'c', 'd']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('remove row')
    cy.get('#\\/mi1_rowDecrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[eb]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eb]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'e', 'b']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('ignore change in numRows')
    cy.get('#\\/numRows textarea').type("{end}{backspace}9{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[eb]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eb]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'e', 'b']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('bind to vector', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1{prop='numRows'})" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1{prop='numColumns'})" /></p>

    <p>Vector 1: <math name="m1">(a,b)</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(a,b)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ab]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let vectorAst = ["tuple", "a", "b"]
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'a'], ["tuple", 'b']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change values')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true })
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ef]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f']]]
      let vectorAst = ["tuple", "e", "f"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add row, original stays a vector');
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f,＿)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣ef＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f'], ["tuple", '＿']]]
      let vectorAst = ["tuple", "e", "f", "＿"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}z{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f,z)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣efz⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f'], ["tuple", 'z']]]
      let vectorAst = ["tuple", "e", "f", "z"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('remove row')
    cy.get('#\\/mi1_rowDecrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ef]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f']]]
      let vectorAst = ["tuple", "e", "f"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('get value back when add rows')
    cy.get('#\\/numRows textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
    })
    cy.get(`#\\/mi1_component_3_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f,z,＿)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣efz＿⎤⎥\n⎥\n⎥\n⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 4, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f'], ["tuple", 'z'], ["tuple", '＿']]]
      let vectorAst = ["tuple", "e", "f", "z", "＿"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}{enter}", { force: true })
    cy.get('#\\/mi1_component_3_0 textarea').type("{end}{backspace}y{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_3_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f,＿,y)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢\n⎢\n⎢\n⎢⎣ef＿y⎤⎥\n⎥\n⎥\n⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 4, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f'], ["tuple", '＿'], ["tuple", 'y']]]
      let vectorAst = ["tuple", "e", "f", "＿", "y"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('back to 2D vector')
    cy.get('#\\/numRows textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ef]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f']]]
      let vectorAst = ["tuple", "e", "f"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add column via mathinput')
    cy.get('#\\/numColumns textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e＿f＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[e＿f＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', '＿'], ["tuple", 'f', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('g and h in second column')
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row via mathinput')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });



    cy.log('up to 3x3 entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('bind to vector, ignore size via definition', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" prefill="1" /></p>
    <p>Number of columns: <mathinput name="numColumns" prefill="7" /></p>

    <p>Vector 1: <math name="m1">(a,b,c)</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(a,b,c)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣abc⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let vectorAst = ["tuple", "a", "b", "c"]
      let matrixAst = ["matrix", ["tuple", 3, 1], ["tuple", ["tuple", 'a'], ["tuple", 'b'], ["tuple", 'c']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change values')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true })
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f,c)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣efc⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f'], ["tuple", 'c']]]
      let vectorAst = ["tuple", "e", "f", "c"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('ignore change in numColumns')
    cy.get('#\\/numColumns textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f,c)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣efc⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f'], ["tuple", 'c']]]
      let vectorAst = ["tuple", "e", "f", "c"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('remove row')
    cy.get('#\\/mi1_rowDecrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f)')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ef]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 1], ["tuple", ["tuple", 'e'], ["tuple", 'f']]]
      let vectorAst = ["tuple", "e", "f"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add column')
    cy.get('#\\/mi1_columnIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e＿f＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[e＿f＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', '＿'], ["tuple", 'f', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('bind to transpose of vector', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1{prop='numRows'})" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1{prop='numColumns'})" /></p>

    <p>Vector 1: <math name="m1">(a,b)^T</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(a,b)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ab]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let vectorAst = ["^", ["tuple", "a", "b"], "T"];
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'a', 'b']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change values')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true })
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'e', 'g']]]
      let vectorAst = ["^", ["tuple", "e", "g"], "T"];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add column, original stays a vector');
    cy.get('#\\/mi1_columnIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g,＿)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 3], ["tuple", ["tuple", 'e', 'g', '＿']]]
      let vectorAst = ["^", ["tuple", "e", "g", "＿"], "T"];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change value')
    cy.get('#\\/mi1_component_0_2 textarea').type("{end}{backspace}z{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g,z)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[egz]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 3], ["tuple", ["tuple", 'e', 'g', 'z']]]
      let vectorAst = ["^", ["tuple", "e", "g", "z"], "T"];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('remove column')
    cy.get('#\\/mi1_columnDecrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'e', 'g']]]
      let vectorAst = ["^", ["tuple", "e", "g"], "T"];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('get value back when add columns')
    cy.get('#\\/numColumns textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
    })
    cy.get(`#\\/mi1_component_0_3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g,z,＿)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[egz＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 4], ["tuple", ["tuple", 'e', 'g', 'z', '＿']]]
      let vectorAst = ["^", ["tuple", "e", "g", "z", "＿"], "T"];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change values')
    cy.get('#\\/mi1_component_0_2 textarea').type("{end}{backspace}{enter}", { force: true })
    cy.get('#\\/mi1_component_0_3 textarea').type("{end}{backspace}y{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_0_3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g,＿,y)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg＿y]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 4], ["tuple", ["tuple", 'e', 'g', '＿', 'y']]]
      let vectorAst = ["^", ["tuple", "e", "g", "＿", "y"], "T"];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('back to 2D vector transpose')
    cy.get('#\\/numColumns textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'e', 'g']]]
      let vectorAst = ["^", ["tuple", "e", "g"], "T"];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row via mathinput')
    cy.get('#\\/numRows textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[eg＿＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg＿＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('f and h in second row')
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row via mathinput')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('up to 3x3 entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('bind to transpose of vector, alternative format', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1{prop='numRows'})" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1{prop='numColumns'})" /></p>

    <p>Vector 1: <math name="m1">(a,b)'</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(a,b)′')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ab]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let vectorAst = ["prime", ["tuple", "a", "b"]];
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'a', 'b']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change values')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true })
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}g{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g)′')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'e', 'g']]]
      let vectorAst = ["prime", ["tuple", "e", "g"]];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('add column, original stays a vector');
    cy.get('#\\/mi1_columnIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g,＿)′')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 3], ["tuple", ["tuple", 'e', 'g', '＿']]]
      let vectorAst = ["prime", ["tuple", "e", "g", "＿"]];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change value')
    cy.get('#\\/mi1_component_0_2 textarea').type("{end}{backspace}z{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g,z)′')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[egz]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 3], ["tuple", ["tuple", 'e', 'g', 'z']]]
      let vectorAst = ["prime", ["tuple", "e", "g", "z"]];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('remove column')
    cy.get('#\\/mi1_columnDecrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g)′')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'e', 'g']]]
      let vectorAst = ["prime", ["tuple", "e", "g"]];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('get value back when add columns')
    cy.get('#\\/numColumns textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('z')
    })
    cy.get(`#\\/mi1_component_0_3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g,z,＿)′')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[egz＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 4], ["tuple", ["tuple", 'e', 'g', 'z', '＿']]]
      let vectorAst = ["prime", ["tuple", "e", "g", "z", "＿"]];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change values')
    cy.get('#\\/mi1_component_0_2 textarea').type("{end}{backspace}{enter}", { force: true })
    cy.get('#\\/mi1_component_0_3 textarea').type("{end}{backspace}y{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_0_3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('y')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g,＿,y)′')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg＿y]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 4], ["tuple", ["tuple", 'e', 'g', '＿', 'y']]]
      let vectorAst = ["prime", ["tuple", "e", "g", "＿", "y"]];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('back to 2D vector transpose')
    cy.get('#\\/numColumns textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,g)′')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'e', 'g']]]
      let vectorAst = ["prime", ["tuple", "e", "g"]];
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row via mathinput')
    cy.get('#\\/numRows textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[eg＿＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[eg＿＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('f and h in second row')
    cy.get('#\\/mi1_component_1_0 textarea').type("{end}{backspace}f{enter}", { force: true })
    cy.get('#\\/mi1_component_1_1 textarea').type("{end}{backspace}h{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[egfh]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row via mathinput')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfh＿＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change third row values')
    cy.get('#\\/mi1_component_2_0 textarea').type("{end}{backspace}i{enter}", { force: true })
    cy.get('#\\/mi1_component_2_1 textarea').type("{end}{backspace}j{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣egfhij⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 2], ["tuple", ["tuple", 'e', 'g'], ["tuple", 'f', 'h'], ["tuple", 'i', 'j']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('down to one entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}1{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[e]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[e]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'e']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('change value')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}k{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[k]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[k]')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", 'k']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('up to 3x3 entry')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get('#\\/numColumns textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('k')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('g')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('h')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('i')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('j')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 'k', 'g', '＿'], ["tuple", 'f', 'h', '＿'], ["tuple", 'i', 'j', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('bind to transpose of vector, ignore size via definition', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" prefill="7" /></p>
    <p>Number of columns: <mathinput name="numColumns" prefill="1" /></p>

    <p>Vector 1: <math name="m1">(a,b,c)^T</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('a')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(a,b,c)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[abc]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let vectorAst = ["^", ["tuple", "a", "b", "c"], "T"]
      let matrixAst = ["matrix", ["tuple", 1, 3], ["tuple", ["tuple", 'a', 'b', 'c']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });

    cy.log('change values')
    cy.get('#\\/mi1_component_0_0 textarea').type("{end}{backspace}e{enter}", { force: true })
    cy.get('#\\/mi1_component_0_1 textarea').type("{end}{backspace}f{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f,c)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[efc]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 3], ["tuple", ["tuple", 'e', 'f', 'c']]]
      let vectorAst = ["^", ["tuple", "e", "f", "c"], "T"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('ignore change in numRows')
    cy.get('#\\/numRows textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('c')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f,c)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[efc]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 3], ["tuple", ["tuple", 'e', 'f', 'c']]]
      let vectorAst = ["^", ["tuple", "e", "f", "c"], "T"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('remove column')
    cy.get('#\\/mi1_columnDecrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '(e,f)T')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ef]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 1, 2], ["tuple", ["tuple", 'e', 'f']]]
      let vectorAst = ["^", ["tuple", "e", "f"], "T"]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(vectorAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


    cy.log('add row')
    cy.get('#\\/mi1_rowIncrement').click();

    cy.get(`#\\/numRows .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/numColumns .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })
    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('e')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('f')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[ef＿＿]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[ef＿＿]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 'e', 'f'], ["tuple", '＿', '＿']]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst);
    });


  })

  it('matrixinput eliminates multicharacter symbols', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="varWithNum">x2</math>
    <math name="noSplit" splitSymbols="false">xyz</math>
    <matrixinput name="varWithNum2" bindValueTo="$varWithNum" />
    <matrixinput name="noSplit2" splitSymbols="false" bindValueTo="$noSplit" />
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
      expect(text.trim()).equal('[x2]')
    })
    cy.get('#\\/noSplit').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xyz')
    })
    cy.get(`#\\/noSplit2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xyz')
    })
    cy.get('#\\/noSplit3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('[xyz]')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/varWithNum'].stateValues.value.tree).eq("x2");
      expect(components['/varWithNum2'].stateValues.value.tree).eqls(
        ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "x2"]]]);
      expect(components['/varWithNum3'].stateValues.value.tree).eqls(
        ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "x2"]]]);
      expect(components['/noSplit'].stateValues.value.tree).eq("xyz");
      expect(components['/noSplit2'].stateValues.value.tree).eqls(
        ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xyz"]]])
      expect(components['/noSplit3'].stateValues.value.tree).eqls(
        ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xyz"]]]);
    })

    cy.get('#\\/varWithNum2 textarea').type("{end}{backspace}u9j{enter}", { force: true })
    cy.get('#\\/noSplit2 textarea').type("{end}{backspace}uv{enter}", { force: true })


    cy.get('#\\/varWithNum').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('[xu9j]')
    })
    cy.get(`#\\/varWithNum2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xu9j')
    })
    cy.get('#\\/varWithNum3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('[xu9j]')
    })
    cy.get('#\\/noSplit').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('[xyuv]')
    })
    cy.get(`#\\/noSplit2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('xyuv')
    })
    cy.get('#\\/noSplit3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('[xyuv]')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/varWithNum'].stateValues.value.tree).eqls(
        ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xu9j"]]]);
      expect(components['/varWithNum2'].stateValues.value.tree).eqls(
        ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xu9j"]]]);
      expect(components['/varWithNum3'].stateValues.value.tree).eqls(
        ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xu9j"]]]);
      expect(components['/noSplit'].stateValues.value.tree).eqls(
        ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xyuv"]]]);
      expect(components['/noSplit2'].stateValues.value.tree).eqls(
        ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xyuv"]]]);
      expect(components['/noSplit3'].stateValues.value.tree).eqls(
        ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xyuv"]]]);
    })


  })

  it('default entry, prefill sparse matrix', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>Sparse matrix: <math name="sparse" format="latex">
    \\begin{matrix}\\\\ & 3\\end{matrix}
    </math></p>
    <p>Matrix 1: <matrixInput name="mi1" prefill="$sparse" numRows="3" numColumns="3" /></p>
    <p>Matrix 1A: <copy prop="value" target="mi1" assignNames="m1" /></p>
    <p>Matrix 2: <matrixInput name="mi2" prefill="$sparse" numRows="3" numColumns="3" defaultEntry="0" /></p>
    <p>Matrix 2A: <copy prop="value" target="mi2" assignNames="m2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣00＿03＿＿＿＿⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣000030000⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst1 = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 0, 0, '＿'], ["tuple", 0, 3, '＿'], ["tuple", '＿', '＿', '＿']]]
      let matrixAst2 = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 0, 0, 0], ["tuple", 0, 3, 0], ["tuple", 0, 0, 0]]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst1);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst1);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst2);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst2);
    });


    cy.log('add column')
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi2_columnIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_0_3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_0_3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_1_3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_2_3 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣00＿＿03＿＿＿＿＿＿⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣000003000000⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst1 = ["matrix", ["tuple", 3, 4], ["tuple", ["tuple", 0, 0, '＿', '＿'], ["tuple", 0, 3, '＿', '＿'], ["tuple", '＿', '＿', '＿', '＿']]]
      let matrixAst2 = ["matrix", ["tuple", 3, 4], ["tuple", ["tuple", 0, 0, 0, 0], ["tuple", 0, 3, 0, 0], ["tuple", 0, 0, 0, 0]]]
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst1);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst1);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst2);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst2);
    });
  })

  it('default entry, bind value to sparse matrix', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>Sparse matrix: <math name="sparse1" format="latex">
    \\begin{matrix}\\\\ & 3\\end{matrix}
    </math></p>
    <p>Sparse matrix 2: <copy target="sparse1" link="false" assignNames="sparse2" /></p>
    <p>Matrix 1: <matrixInput name="mi1" bindValueTo="$sparse1" numRows="3" numColumns="3" /></p>
    <p>Matrix 1A: <copy prop="value" target="mi1" assignNames="m1" /></p>
    <p>Matrix 2: <matrixInput name="mi2" bindValueTo="$sparse2" numRows="3" numColumns="3" defaultEntry="0" /></p>
    <p>Matrix 2A: <copy prop="value" target="mi2" assignNames="m2" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })

    cy.get("#\\/sparse1").find('.mjx-mrow').eq(0).should('have.text', '[0003]')
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '[0003]')
    cy.get("#\\/sparse2").find('.mjx-mrow').eq(0).should('have.text', '[0003]')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '[0003]')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst1 = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 0, 0], ["tuple", 0, 3]]]
      let matrixAst2 = ["matrix", ["tuple", 2, 2], ["tuple", ["tuple", 0, 0], ["tuple", 0, 3]]]
      expect(components['/sparse1'].stateValues.value.tree).eqls(matrixAst1);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst1);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst1);
      expect(components['/sparse2'].stateValues.value.tree).eqls(matrixAst2);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst2);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst2);
    });


    cy.log('add row and column')
    cy.get('#\\/mi1_rowIncrement').click();
    cy.get('#\\/mi2_rowIncrement').click();
    cy.get('#\\/mi1_columnIncrement').click();
    cy.get('#\\/mi2_columnIncrement').click();

    cy.get(`#\\/mi1_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi1_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi1_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get(`#\\/mi1_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })

    cy.get(`#\\/mi2_component_0_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_0_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_0_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_1_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_1_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })
    cy.get(`#\\/mi2_component_1_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_2_0 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_2_1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get(`#\\/mi2_component_2_2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.get("#\\/sparse1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣00＿03＿＿＿＿⎤⎥⎦')
    cy.get("#\\/m1").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣00＿03＿＿＿＿⎤⎥⎦')
    cy.get("#\\/sparse2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣000030000⎤⎥⎦')
    cy.get("#\\/m2").find('.mjx-mrow').eq(0).should('have.text', '⎡⎢⎣000030000⎤⎥⎦')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let matrixAst1 = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 0, 0, '＿'], ["tuple", 0, 3, '＿'], ["tuple", '＿', '＿', '＿']]]
      let matrixAst2 = ["matrix", ["tuple", 3, 3], ["tuple", ["tuple", 0, 0, 0], ["tuple", 0, 3, 0], ["tuple", 0, 0, 0]]]
      expect(components['/sparse1'].stateValues.value.tree).eqls(matrixAst1);
      expect(components['/mi1'].stateValues.value.tree).eqls(matrixAst1);
      expect(components['/m1'].stateValues.value.tree).eqls(matrixAst1);
      expect(components['/sparse2'].stateValues.value.tree).eqls(matrixAst2);
      expect(components['/mi2'].stateValues.value.tree).eqls(matrixAst2);
      expect(components['/m2'].stateValues.value.tree).eqls(matrixAst2);
    });

  })

});