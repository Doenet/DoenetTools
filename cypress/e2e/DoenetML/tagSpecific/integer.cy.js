import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Integer Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })

  it('1.2+1.1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <copy target="_integer1" />
      <integer>1.2+1.1</integer>
    ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let integer0Name = stateVariables['/_copy1'].replacements[0].componentName;
      let integer0Anchor = cesc('#' + integer0Name);

      cy.log('Test value displayed in browser')
      cy.get(integer0Anchor).should('have.text', '2')
      cy.get('#\\/_integer1').should('have.text', '2')

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables[integer0Name].stateValues.value).eq(2);
        expect(stateVariables['/_integer1'].stateValues.value).eq(2);
      })
    })
  })

  it(`non-numeric value`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <copy target="_integer1" />
      <integer>x+1</integer>
      ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let integer0Name = stateVariables['/_copy1'].replacements[0].componentName;
      let integer0Anchor = cesc('#' + integer0Name);

      cy.log('Test value displayed in browser')
      cy.get(integer0Anchor).should('have.text', 'NaN')
      cy.get('#\\/_integer1').should('have.text', 'NaN')


      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        assert.isNaN(stateVariables[integer0Name].stateValues.value);
        assert.isNaN(stateVariables['/_integer1'].stateValues.value);
      })
    })
  })

  it(`entering non-integer values dynamically`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <integer name="n">$_mathinput1</integer>
      <mathinput />
      ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').should('have.text', 'NaN');
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}-6.5{enter}', { force: true })
    cy.get('#\\/n').should('have.text', '-6');
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('−6.5')
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}x{enter}', { force: true })
    cy.get('#\\/n').should('have.text', 'NaN');
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('−6.5x')
    })

    cy.get('#\\/_mathinput1 textarea').type('{ctrl+home}{shift+end}{backspace}9.5{enter}', { force: true })
    cy.get('#\\/n').should('have.text', '10');
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9.5')
    })
  })

  it(`entering non-integer through inverse`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <integer name="n">5</integer>
      <mathinput bindValueTo="$n" hideNaN="false" />
      ` }, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/n').should('have.text', '5');

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}-6.5{enter}', { force: true })
    cy.get('#\\/n').should('have.text', '-6');
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('−6')
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}x{enter}', { force: true })
    cy.get('#\\/n').should('have.text', 'NaN');
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('NaN')
    })

    // Note: change to 3 and then 31 to verify bug doesn't reappear
    cy.get('#\\/_mathinput1 textarea').type('{ctrl+home}{shift+end}{backspace}3{enter}', { force: true })
    cy.get('#\\/n').should('have.text', '3');
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}1{enter}', { force: true })
    cy.get('#\\/n').should('have.text', '31');
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('31')
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}.5{enter}', { force: true })
    cy.get('#\\/n').should('have.text', '32');
    cy.get(`#\\/_mathinput1 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('32')
    })

  })


});