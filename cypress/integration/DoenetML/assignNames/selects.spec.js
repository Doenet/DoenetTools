import { numberToLetters } from "../../../../src/Core/utils/sequence";
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('selects assignName Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('assignNamesSkip in selects', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup>
    <text name="h">hop</text>
  </setup>

  <select numberToSelect="6" assignNames="(a) (b) (c) (d) (e) (f)">
    <option>
      <text>hi</text>
    </option>
    <option>
      <select assignNamesSkip="2">
        <option><text>orange</text></option>
        <option><text>red</text></option>
      </select>
    </option>
    <option>
      <copy assignNamesSkip="1" target="h" />
    </option>
    <option>
      <selectFromSequence assignNamesSkip="1" type="letters" from="a" to="z" />
    </option>
    <option>
      <select assignNamesSkip="1" type="text">once upon a time</select>
    </option>
    <option>
      <selectRandomNumbers assignNamesSkip="1" />
    </option>
  </select>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let selectedIndices = stateVariables["/_select1"].stateValues.selectedIndices;

      let cNames = ["/a", "/b", "/c", "/d", "/e", "/f"];

      for (let [j, index] of selectedIndices.entries()) {

        let comp = stateVariables[cNames[j]];
        let anchor = cesc('#' + cNames[j]);
        let cType = index === 6 ? "number" : "text";

        let optionReplacement = stateVariables[stateVariables[stateVariables["/_select1"].replacements[j].componentName].replacements[1].componentName]


        expect(comp.componentType).eq(cType);

        if (index === 1) {
          cy.get(anchor).should('have.text', 'hi');
        } else if (index === 2) {
          let color = optionReplacement.stateValues.selectedIndices[0] === 1 ? "orange" : "red";
          cy.get(anchor).should('have.text', color);
        } else if (index === 3) {
          cy.get(anchor).should('have.text', 'hop');
        } else if (index === 4) {
          let letter = numberToLetters(optionReplacement.stateValues.selectedIndices[0], true);
          cy.get(anchor).should('have.text', letter);
        } else if (index === 5) {
          let word = ["once", "upon", "a", "time"][optionReplacement.stateValues.selectedIndices[0] - 1];
          cy.get(anchor).should('have.text', word);
        } else if (index === 6) {
          cy.get(anchor).invoke('text').then(text => {
            expect(Number(text)).lte(1);
            expect(Number(text)).gte(0);
          })
        }

      }

    })

  })


});
