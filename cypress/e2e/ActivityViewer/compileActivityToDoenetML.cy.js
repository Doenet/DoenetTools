import cssesc from 'cssesc';
import { compileActivity } from '../../../src/_utils/compileActivity';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Compile activity to JSON tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it("Sequence of two pages", () => {


    let activityJSON = {
      type: "activity",
      version: "0.1.0",
      order: {
        type: "order",
        behavior: "sequence",
        content: [
          "doenetId1",
          "doenetId2"
        ]
      },
    }

    let itemsByDoenetId = {
      doenetId1: {
        type: "page",
        cid: "bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu"
      },
      doenetId2: {
        type: "page",
        cid: "bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti"
      },
    }

    let activityDefinition = compileActivity({ activity: activityJSON, itemsByDoenetId });

    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition
      }, "*");
    })



    cy.get('#\\/_title1').should('have.text', 'Animal sounds')


    cy.window().then(async (win) => {
      let stateVariables1 = await win.returnAllStateVariables1();
      let animal = stateVariables1["/animal"].stateValues.value;
      let sound = stateVariables1["/sound"].stateValues.value;


      let correctIndex = stateVariables1["/_choiceinput1"].stateValues.choiceTexts.indexOf(sound)

      cy.get(`#\\/_choiceinput1_choice${correctIndex + 1}_input`).click();

      cy.get('#\\/_choiceinput1_submit').click();

      cy.get('#\\/_choiceinput1_correct').should('be.visible');

      console.log(correctIndex);
      console.log(stateVariables1["/_choiceinput1"].stateValues.choiceTexts)


      cy.get('[data-test=next]').click();

      cy.get(cesc('#/derivativeProblem/_title1')).should('have.text', 'Derivative problem')


      cy.window().then(async (win) => {
        let stateVariables2 = await win.returnAllStateVariables2();
        let mathinputName = cesc(stateVariables2['/derivativeProblem/_answer1'].stateValues.inputChildren[0].componentName)
        let mathinputAnchor = '#' + mathinputName + ' textarea';
        let mathinputEditiableFieldAnchor = '#' + mathinputName + " .mq-editable-field";
        let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
        let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
        let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';


        cy.get(mathinputAnchor).type("2x{enter}", { force: true });

        cy.get(mathinputCorrectAnchor).should('be.visible')

      })

    })


  })

})