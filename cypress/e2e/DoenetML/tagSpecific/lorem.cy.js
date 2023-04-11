import { cesc, cesc2 } from '../../../../src/_utils/url';

describe('Lorem Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })


  it('paragraphs, sentences, and words', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <section name="paragraphs" newNamespace>
    <title>Paragraphs</title>
  
    <p>Number of paragraphs: <mathinput name="numPars" prefill="3" /></p>
    
    <lorem name="lPars" generateParagraphs="$numPars" assignNames="a b c d e f g" />
  </section>
  
  <section name="sentences" newNamespace>
    <title>Sentences</title>
    
    <p>Number of sentences: <mathinput name="numSens" prefill="3" /></p>
  
    <p><lorem name="lSens" generateSentences="$numSens" assignNames="a b c d e f g" /></p>
  
  </section>
  
  <section name="words" newNamespace>
    <title>Words</title>
    
    <p>Number of words: <mathinput name="numWords" prefill="3" /></p>
  
    <p><lorem name="lWords" generateWords="$numWords" assignNames="a b c d e f g" /></p>
  </section>

  <p>
    <copy prop="value" target="words/numWords" assignNames="numWords" />
  </p>
  `}, "*");
    });

    cy.get(cesc2('#/_text1')).should('have.text', 'a');   // to wait for page to load

    let names = ["a", "b", "c", "d", "e", "f"]

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let nParagraphs = 3, nSentences = 3, nWords = 3;

      expect(stateVariables["/paragraphs/lPars"].replacements.length).eq(nParagraphs);
      expect(stateVariables["/sentences/lSens"].replacements.length).eq(2 * nSentences - 1);
      expect(stateVariables["/words/lWords"].replacements.length).eq(2 * nWords - 1);

      for (let [ind, repl] of stateVariables["/paragraphs/lPars"].replacements.entries()) {
        cy.get(cesc2(`#/paragraphs/${names[ind]}`)).should('have.text', stateVariables[repl.componentName].activeChildren[0])
      }

      for (let [ind, repl] of stateVariables["/sentences/lSens"].replacements.entries()) {
        if (ind % 2 === 1) {
          continue;
        }
        cy.get(cesc2(`#/sentences/${names[ind / 2]}`)).should('have.text', stateVariables[repl.componentName].activeChildren[0])
      }

      for (let [ind, repl] of stateVariables["/words/lWords"].replacements.entries()) {
        if (ind % 2 === 1) {
          continue;
        }
        cy.get(cesc2(`#/words/${names[ind / 2]}`)).should('have.text', stateVariables[repl.componentName].activeChildren[0])
      }


    });

    cy.get(cesc2("#/paragraphs/numPars") + " textarea").type("{end}{backspace}6{enter}", { force: true });
    cy.get(cesc2("#/sentences/numSens") + " textarea").type("{end}{backspace}2{enter}", { force: true });
    cy.get(cesc2("#/words/numWords") + " textarea").type("{end}{backspace}5{enter}", { force: true });

    cy.get(cesc2("#/numWords")).should('contain.text', '5');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let nParagraphs = 6, nSentences = 2, nWords = 5;

      expect(stateVariables["/paragraphs/lPars"].replacements.length).eq(nParagraphs);
      expect(stateVariables["/sentences/lSens"].replacements.length).eq(2 * nSentences - 1);
      expect(stateVariables["/words/lWords"].replacements.length).eq(2 * nWords - 1);

      for (let [ind, repl] of stateVariables["/paragraphs/lPars"].replacements.entries()) {
        cy.get(cesc2(`#/paragraphs/${names[ind]}`)).should('have.text', stateVariables[repl.componentName].activeChildren[0])
      }

      for (let [ind, repl] of stateVariables["/sentences/lSens"].replacements.entries()) {
        if (ind % 2 === 1) {
          continue;
        }
        cy.get(cesc2(`#/sentences/${names[ind / 2]}`)).should('have.text', stateVariables[repl.componentName].activeChildren[0])
      }

      for (let [ind, repl] of stateVariables["/words/lWords"].replacements.entries()) {
        if (ind % 2 === 1) {
          continue;
        }
        cy.get(cesc2(`#/words/${names[ind / 2]}`)).should('have.text', stateVariables[repl.componentName].activeChildren[0])
      }


    });

  })

  it('changes only with variant', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <lorem name="lPars" generateParagraphs="1" assignNames="a" />
  <selectFromSequence from="1" to="2" assignNames="n" />
  `,
        requestedVariantIndex: 1
      }, "*");
    });

    cy.get(cesc2('#/_text1')).should('have.text', 'a');   // to wait for page to load

    cy.get(cesc2('#/n')).should('have.text', '1');

    let paragraph0, paragraph1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/lPars"].replacements.length).eq(1);
      paragraph0 = stateVariables[stateVariables["/lPars"].replacements[0].componentName].activeChildren[0]
      cy.get(cesc2('#/a')).should('have.text', paragraph0)

    });


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <lorem name="lPars" generateParagraphs="1" assignNames="a" />
  <selectFromSequence from="1" to="2" assignNames="n" />
  `,
        requestedVariantIndex: 1
      }, "*");
    });


    cy.get(cesc2('#/_text1')).should('have.text', 'b');   // to wait for page to load

    cy.get(cesc2('#/n')).should('have.text', '1');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/lPars"].replacements.length).eq(1);
      expect(stateVariables[stateVariables["/lPars"].replacements[0].componentName].activeChildren[0]).eq(paragraph0);
      cy.get(cesc2('#/a')).should('have.text', paragraph0)

    });


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>c</text>
  <lorem name="lPars" generateParagraphs="1" assignNames="a" />
  <selectFromSequence from="1" to="2" assignNames="n" />
  `,
        requestedVariantIndex: 2
      }, "*");
    });


    cy.get(cesc2('#/_text1')).should('have.text', 'c');   // to wait for page to load

    cy.get(cesc2('#/n')).should('have.text', '2');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/lPars"].replacements.length).eq(1);

      paragraph1 = stateVariables[stateVariables["/lPars"].replacements[0].componentName].activeChildren[0];
      expect(paragraph1).not.eq(paragraph0);
      cy.get(cesc2('#/a')).should('have.text', paragraph1)


    });


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>d</text>
  <lorem name="lPars" generateParagraphs="1" assignNames="a" />
  <selectFromSequence from="1" to="2" assignNames="n" />
  `,
        requestedVariantIndex: 2
      }, "*");
    });


    cy.get(cesc2('#/_text1')).should('have.text', 'd');   // to wait for page to load

    cy.get(cesc2('#/n')).should('have.text', '2');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/lPars"].replacements.length).eq(1);
      expect(stateVariables[stateVariables["/lPars"].replacements[0].componentName].activeChildren[0]).eq(paragraph1);
      cy.get(cesc2('#/a')).should('have.text', paragraph1)


    });


  })



})



