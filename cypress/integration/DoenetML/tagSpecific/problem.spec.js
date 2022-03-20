import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Problem Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('problems default to weight 1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Activity</title>
    <p>Credit achieved for <copy prop="title" target="_document1" />:
    <copy name="docCa" prop="creditAchieved" target="_document1" />, or <copy name="docPca" prop="percentCreditAchieved" target="_document1" />%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <problem name="problem1"><title>Problem 1</title>
      <p>Credit achieved for <copy prop="title" target="problem1" />:
      <copy name="p1Ca" prop="creditAchieved" target="problem1" />, or <copy name="p1Pca" prop="percentCreditAchieved" target="problem1" />%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </problem>
    <problem name="problem2"><title>Problem 2</title>
      <p>Credit achieved for <copy prop="title" target="problem2" />:
      <copy name="p2Ca" prop="creditAchieved" target="problem2" />, or <copy name="p2Pca" prop="percentCreditAchieved" target="problem2" />%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <problem name="problem21"><title>Problem 2.1</title>
        <p>Credit achieved for <copy prop="title" target="problem21" />:
        <copy name="p21Ca" prop="creditAchieved" target="problem21" />, or <copy name="p21Pca" prop="percentCreditAchieved" target="problem21" />%</p>

        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </problem>
      <problem name="problem22"><title>Problem 2.2</title>
        <p>Credit achieved for <copy prop="title" target="problem22" />:
        <copy name="p22Ca" prop="creditAchieved" target="problem22" />, or <copy name="p22Pca" prop="percentCreditAchieved" target="problem22" />%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <problem name="problem221"><title>Problem 2.2.1</title>
          <p>Credit achieved for <copy prop="title" target="problem221" />:
          <copy name="p221Ca" prop="creditAchieved" target="problem221" />, or <copy name="p221Pca" prop="percentCreditAchieved" target="problem221" />%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </problem>
        <problem name="problem222"><title>Problem 2.2.2</title>
          <p>Credit achieved for <copy prop="title" target="problem222" />:
          <copy name="p222Ca" prop="creditAchieved" target="problem222" />, or <copy name="p222Pca" prop="percentCreditAchieved" target="problem222" />%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </problem>
      </problem>

    </problem>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_document1_title').should('have.text', 'Activity')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let docCaAnchor = cesc("#" + stateVariables["/docCa"].replacements[0].componentName);
      let docPcaAnchor = cesc("#" + stateVariables["/docPca"].replacements[0].componentName);
      let p1CaAnchor = cesc("#" + stateVariables["/p1Ca"].replacements[0].componentName);
      let p1PcaAnchor = cesc("#" + stateVariables["/p1Pca"].replacements[0].componentName);
      let p2CaAnchor = cesc("#" + stateVariables["/p2Ca"].replacements[0].componentName);
      let p2PcaAnchor = cesc("#" + stateVariables["/p2Pca"].replacements[0].componentName);
      let p21CaAnchor = cesc("#" + stateVariables["/p21Ca"].replacements[0].componentName);
      let p21PcaAnchor = cesc("#" + stateVariables["/p21Pca"].replacements[0].componentName);
      let p22CaAnchor = cesc("#" + stateVariables["/p22Ca"].replacements[0].componentName);
      let p22PcaAnchor = cesc("#" + stateVariables["/p22Pca"].replacements[0].componentName);
      let p221CaAnchor = cesc("#" + stateVariables["/p221Ca"].replacements[0].componentName);
      let p221PcaAnchor = cesc("#" + stateVariables["/p221Pca"].replacements[0].componentName);
      let p222CaAnchor = cesc("#" + stateVariables["/p222Ca"].replacements[0].componentName);
      let p222PcaAnchor = cesc("#" + stateVariables["/p222Pca"].replacements[0].componentName);
      let mathinput1Anchor = cesc('#' + stateVariables['/_answer1'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput2Anchor = cesc('#' + stateVariables['/_answer2'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput3Anchor = cesc('#' + stateVariables['/_answer3'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput4Anchor = cesc('#' + stateVariables['/_answer4'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput5Anchor = cesc('#' + stateVariables['/_answer5'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput6Anchor = cesc('#' + stateVariables['/_answer6'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput7Anchor = cesc('#' + stateVariables['/_answer7'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput8Anchor = cesc('#' + stateVariables['/_answer8'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput9Anchor = cesc('#' + stateVariables['/_answer9'].stateValues.inputChildren[0].componentName) + " textarea";

      cy.get(docCaAnchor).should('have.text', '0')
      cy.get(docPcaAnchor).should('have.text', '0')
      cy.get(p1CaAnchor).should('have.text', '0')
      cy.get(p1PcaAnchor).should('have.text', '0')
      cy.get(p2CaAnchor).should('have.text', '0')
      cy.get(p2PcaAnchor).should('have.text', '0')
      cy.get(p21CaAnchor).should('have.text', '0')
      cy.get(p21PcaAnchor).should('have.text', '0')
      cy.get(p22CaAnchor).should('have.text', '0')
      cy.get(p22PcaAnchor).should('have.text', '0')
      cy.get(p221CaAnchor).should('have.text', '0')
      cy.get(p221PcaAnchor).should('have.text', '0')
      cy.get(p222CaAnchor).should('have.text', '0')
      cy.get(p222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter first correct answer');
      cy.get(mathinput1Anchor).type(`u{enter}`, { force: true });

      let credit1 = 1 / 3;
      let credit1Round = Math.round(1000 * credit1) / 1000;
      let percentCredit1 = credit1 * 100;
      let percentCredit1Round = Math.round(10 * percentCredit1) / 10;

      cy.get(docCaAnchor).should('have.text', credit1Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit1Round.toString())
      cy.get(p1CaAnchor).should('have.text', '0')
      cy.get(p1PcaAnchor).should('have.text', '0')
      cy.get(p2CaAnchor).should('have.text', '0')
      cy.get(p2PcaAnchor).should('have.text', '0')
      cy.get(p21CaAnchor).should('have.text', '0')
      cy.get(p21PcaAnchor).should('have.text', '0')
      cy.get(p22CaAnchor).should('have.text', '0')
      cy.get(p22PcaAnchor).should('have.text', '0')
      cy.get(p221CaAnchor).should('have.text', '0')
      cy.get(p221PcaAnchor).should('have.text', '0')
      cy.get(p222CaAnchor).should('have.text', '0')
      cy.get(p222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit1, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit1, 1E-12);
        expect(stateVariables['/problem1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer9'].stateValues.creditAchieved).eq(0);
      })


      cy.log('enter additional correct answers');
      cy.get(mathinput3Anchor).type(`y{enter}`, { force: true });
      cy.get(mathinput5Anchor).type(`v{enter}`, { force: true });
      cy.get(mathinput7Anchor).type(`q{enter}`, { force: true });

      let problem1credit2 = 2 / 3;
      let problem1credit2Round = Math.round(1000 * problem1credit2) / 1000;
      let problem1percentCredit2 = problem1credit2 * 100;
      let problem1percentCredit2Round = Math.round(10 * problem1percentCredit2) / 10;

      let problem21credit2 = 1 / 3;
      let problem21credit2Round = Math.round(1000 * problem21credit2) / 1000;
      let problem21percentCredit2 = problem21credit2 * 100;
      let problem21percentCredit2Round = Math.round(10 * problem21percentCredit2) / 10;

      let problem22credit2 = 1 / 3;
      let problem22credit2Round = Math.round(1000 * problem22credit2) / 1000;
      let problem22percentCredit2 = problem22credit2 * 100;
      let problem22percentCredit2Round = Math.round(10 * problem22percentCredit2) / 10;

      let problem2credit2 = (problem21credit2 + problem22credit2) / 3
      let problem2credit2Round = Math.round(1000 * problem2credit2) / 1000;
      let problem2percentCredit2 = problem2credit2 * 100;
      let problem2percentCredit2Round = Math.round(10 * problem2percentCredit2) / 10;;

      let credit2 = (1 + problem1credit2 + problem2credit2) / 3;
      let credit2Round = Math.round(1000 * credit2) / 1000;
      let percentCredit2 = credit2 * 100;
      let percentCredit2Round = Math.round(10 * percentCredit2) / 10;

      cy.get(docCaAnchor).should('have.text', credit2Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit2Round.toString())
      cy.get(p1CaAnchor).should('have.text', problem1credit2Round.toString())
      cy.get(p1PcaAnchor).should('have.text', problem1percentCredit2Round.toString())
      cy.get(p2CaAnchor).should('have.text', problem2credit2Round.toString())
      cy.get(p2PcaAnchor).should('have.text', problem2percentCredit2Round.toString())
      cy.get(p21CaAnchor).should('have.text', problem21credit2Round.toString())
      cy.get(p21PcaAnchor).should('have.text', problem21percentCredit2Round.toString())
      cy.get(p22CaAnchor).should('have.text', problem22credit2Round.toString())
      cy.get(p22PcaAnchor).should('have.text', problem22percentCredit2Round.toString())
      cy.get(p221CaAnchor).should('have.text', '0')
      cy.get(p221PcaAnchor).should('have.text', '0')
      cy.get(p222CaAnchor).should('have.text', '0')
      cy.get(p222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit2, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit2, 1E-12);
        expect(stateVariables['/problem1'].stateValues.creditAchieved).closeTo(problem1credit2, 1E-12);
        expect(stateVariables['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit2, 1E-12);
        expect(stateVariables['/problem2'].stateValues.creditAchieved).closeTo(problem2credit2, 1E-12);
        expect(stateVariables['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit2, 1E-12);
        expect(stateVariables['/problem21'].stateValues.creditAchieved).closeTo(problem21credit2, 1E-12)
        expect(stateVariables['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit2, 1E-12);
        expect(stateVariables['/problem22'].stateValues.creditAchieved).closeTo(problem22credit2, 1E-12)
        expect(stateVariables['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit2, 1E-12);
        expect(stateVariables['/problem221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter most other correct answers');
      cy.get(mathinput2Anchor).type(`x{enter}`, { force: true });
      cy.get(mathinput4Anchor).type(`z{enter}`, { force: true });
      cy.get(mathinput6Anchor).type(`w{enter}`, { force: true });
      cy.get(mathinput8Anchor).type(`r{enter}`, { force: true });


      let problem1credit3 = 1;
      let problem1credit3Round = Math.round(1000 * problem1credit3) / 1000;
      let problem1percentCredit3 = problem1credit3 * 100;
      let problem1percentCredit3Round = Math.round(10 * problem1percentCredit3) / 10;

      let problem21credit3 = 1;
      let problem21credit3Round = Math.round(1000 * problem21credit3) / 1000;
      let problem21percentCredit3 = problem21credit3 * 100;
      let problem21percentCredit3Round = Math.round(10 * problem21percentCredit3) / 10;

      let problem221credit3 = 1;
      let problem221credit3Round = Math.round(1000 * problem221credit3) / 1000;
      let problem221percentCredit3 = problem221credit3 * 100;
      let problem221percentCredit3Round = Math.round(10 * problem221percentCredit3) / 10;

      let problem22credit3 = (problem221credit3 + 1) / 3;
      let problem22credit3Round = Math.round(1000 * problem22credit3) / 1000;
      let problem22percentCredit3 = problem22credit3 * 100;
      let problem22percentCredit3Round = Math.round(10 * problem22percentCredit3) / 10;

      let problem2credit3 = (problem21credit3 + problem22credit3 + 1) / 3
      let problem2credit3Round = Math.round(1000 * problem2credit3) / 1000;
      let problem2percentCredit3 = problem2credit3 * 100;
      let problem2percentCredit3Round = Math.round(10 * problem2percentCredit3) / 10;;

      let credit3 = (1 + problem1credit3 + problem2credit3) / 3;
      let credit3Round = Math.round(1000 * credit3) / 1000;
      let percentCredit3 = credit3 * 100;
      let percentCredit3Round = Math.round(10 * percentCredit3) / 10;

      cy.get(docCaAnchor).should('have.text', credit3Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit3Round.toString())
      cy.get(p1CaAnchor).should('have.text', problem1credit3Round.toString())
      cy.get(p1PcaAnchor).should('have.text', problem1percentCredit3Round.toString())
      cy.get(p2CaAnchor).should('have.text', problem2credit3Round.toString())
      cy.get(p2PcaAnchor).should('have.text', problem2percentCredit3Round.toString())
      cy.get(p21CaAnchor).should('have.text', problem21credit3Round.toString())
      cy.get(p21PcaAnchor).should('have.text', problem21percentCredit3Round.toString())
      cy.get(p22CaAnchor).should('have.text', problem22credit3Round.toString())
      cy.get(p22PcaAnchor).should('have.text', problem22percentCredit3Round.toString())
      cy.get(p221CaAnchor).should('have.text', problem221credit3Round.toString())
      cy.get(p221PcaAnchor).should('have.text', problem221percentCredit3Round.toString())
      cy.get(p222CaAnchor).should('have.text', '0')
      cy.get(p222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit3, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit3, 1E-12);
        expect(stateVariables['/problem1'].stateValues.creditAchieved).closeTo(problem1credit3, 1E-12);
        expect(stateVariables['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit3, 1E-12);
        expect(stateVariables['/problem2'].stateValues.creditAchieved).closeTo(problem2credit3, 1E-12);
        expect(stateVariables['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit3, 1E-12);
        expect(stateVariables['/problem21'].stateValues.creditAchieved).closeTo(problem21credit3, 1E-12)
        expect(stateVariables['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit3, 1E-12);
        expect(stateVariables['/problem22'].stateValues.creditAchieved).closeTo(problem22credit3, 1E-12)
        expect(stateVariables['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit3, 1E-12);
        expect(stateVariables['/problem221'].stateValues.creditAchieved).closeTo(problem221credit3, 1E-12);
        expect(stateVariables['/problem221'].stateValues.percentCreditAchieved).closeTo(problem221percentCredit3, 1E-12);;
        expect(stateVariables['/problem222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter last correct answer');
      cy.get(mathinput9Anchor).type(`s{enter}`, { force: true });


      let problem1credit4 = 1;
      let problem1credit4Round = Math.round(1000 * problem1credit4) / 1000;
      let problem1percentCredit4 = problem1credit4 * 100;
      let problem1percentCredit4Round = Math.round(10 * problem1percentCredit4) / 10;

      let problem221credit4 = 1;
      let problem221credit4Round = Math.round(1000 * problem221credit4) / 1000;
      let problem221percentCredit4 = problem221credit4 * 100;
      let problem221percentCredit4Round = Math.round(10 * problem221percentCredit4) / 10;

      let problem222credit4 = 1;
      let problem222credit4Round = Math.round(1000 * problem222credit4) / 1000;
      let problem222percentCredit4 = problem222credit4 * 100;
      let problem222percentCredit4Round = Math.round(10 * problem222percentCredit4) / 10;

      let problem21credit4 = 1;
      let problem21credit4Round = Math.round(1000 * problem21credit4) / 1000;
      let problem21percentCredit4 = problem21credit4 * 100;
      let problem21percentCredit4Round = Math.round(10 * problem21percentCredit4) / 10;

      let problem22credit4 = 1;
      let problem22credit4Round = Math.round(1000 * problem22credit4) / 1000;
      let problem22percentCredit4 = problem22credit4 * 100;
      let problem22percentCredit4Round = Math.round(10 * problem22percentCredit4) / 10;

      let problem2credit4 = 1;
      let problem2credit4Round = Math.round(1000 * problem2credit4) / 1000;
      let problem2percentCredit4 = problem2credit4 * 100;
      let problem2percentCredit4Round = Math.round(10 * problem2percentCredit4) / 10;;

      let credit4 = (1 + problem1credit4 + problem2credit4) / 3;
      let credit4Round = Math.round(1000 * credit4) / 1000;
      let percentCredit4 = credit4 * 100;
      let percentCredit4Round = Math.round(10 * percentCredit4) / 10;

      cy.get(docCaAnchor).should('have.text', credit4Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit4Round.toString())
      cy.get(p1CaAnchor).should('have.text', problem1credit4Round.toString())
      cy.get(p1PcaAnchor).should('have.text', problem1percentCredit4Round.toString())
      cy.get(p2CaAnchor).should('have.text', problem2credit4Round.toString())
      cy.get(p2PcaAnchor).should('have.text', problem2percentCredit4Round.toString())
      cy.get(p21CaAnchor).should('have.text', problem21credit4Round.toString())
      cy.get(p21PcaAnchor).should('have.text', problem21percentCredit4Round.toString())
      cy.get(p22CaAnchor).should('have.text', problem22credit4Round.toString())
      cy.get(p22PcaAnchor).should('have.text', problem22percentCredit4Round.toString())
      cy.get(p221CaAnchor).should('have.text', problem221credit4Round.toString())
      cy.get(p221PcaAnchor).should('have.text', problem221percentCredit4Round.toString())
      cy.get(p222CaAnchor).should('have.text', problem222credit4Round.toString())
      cy.get(p222PcaAnchor).should('have.text', problem222percentCredit4Round.toString())

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit4, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit4, 1E-12);
        expect(stateVariables['/problem1'].stateValues.creditAchieved).closeTo(problem1credit4, 1E-12);
        expect(stateVariables['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit4, 1E-12);
        expect(stateVariables['/problem2'].stateValues.creditAchieved).closeTo(problem2credit4, 1E-12);
        expect(stateVariables['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit4, 1E-12);
        expect(stateVariables['/problem21'].stateValues.creditAchieved).closeTo(problem21credit4, 1E-12)
        expect(stateVariables['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit4, 1E-12);
        expect(stateVariables['/problem22'].stateValues.creditAchieved).closeTo(problem22credit4, 1E-12)
        expect(stateVariables['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit4, 1E-12);
        expect(stateVariables['/problem221'].stateValues.creditAchieved).closeTo(problem221credit4, 1E-12);
        expect(stateVariables['/problem221'].stateValues.percentCreditAchieved).closeTo(problem221percentCredit4, 1E-12);;
        expect(stateVariables['/problem222'].stateValues.creditAchieved).closeTo(problem222credit4, 1E-12);
        expect(stateVariables['/problem222'].stateValues.percentCreditAchieved).closeTo(problem222percentCredit4, 1E-12);;
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer9'].stateValues.creditAchieved).eq(1);
      })

    })
  });

  it('problems with weights', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Activity</title>
    <p>Credit achieved for <copy prop="title" target="_document1" />:
    <copy name="docCa" prop="creditAchieved" target="_document1" />, or <copy name="docPca" prop="percentCreditAchieved" target="_document1" />%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <problem name="problem1" weight="0.5"><title>Problem 1</title>
      <p>Credit achieved for <copy prop="title" target="problem1" />:
      <copy name="p1Ca" prop="creditAchieved" target="problem1" />, or <copy name="p1Pca" prop="percentCreditAchieved" target="problem1" />%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </problem>
    <problem name="problem2" weight="2"><title>Problem 2</title>
      <p>Credit achieved for <copy prop="title" target="problem2" />:
      <copy name="p2Ca" prop="creditAchieved" target="problem2" />, or <copy name="p2Pca" prop="percentCreditAchieved" target="problem2" />%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <problem name="problem21" weight="3"><title>Problem 2.1</title>
        <p>Credit achieved for <copy prop="title" target="problem21" />:
        <copy name="p21Ca" prop="creditAchieved" target="problem21" />, or <copy name="p21Pca" prop="percentCreditAchieved" target="problem21" />%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </problem>
      <problem name="problem22" weight="4"><title>Problem 2.2</title>
        <p>Credit achieved for <copy prop="title" target="problem22" />:
        <copy name="p22Ca" prop="creditAchieved" target="problem22" />, or <copy name="p22Pca" prop="percentCreditAchieved" target="problem22" />%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <problem name="problem221" weight="5"><title>Problem 2.2.1</title>
          <p>Credit achieved for <copy prop="title" target="problem221" />:
          <copy name="p221Ca" prop="creditAchieved" target="problem221" />, or <copy name="p221Pca" prop="percentCreditAchieved" target="problem221" />%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </problem>
        <problem name="problem222" weight="1"><title>Problem 2.2.2</title>
          <p>Credit achieved for <copy prop="title" target="problem222" />:
          <copy name="p222Ca" prop="creditAchieved" target="problem222" />, or <copy name="p222Pca" prop="percentCreditAchieved" target="problem222" />%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </problem>
      </problem>

    </problem>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_document1_title').should('have.text', 'Activity')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let docCaAnchor = cesc("#" + stateVariables["/docCa"].replacements[0].componentName);
      let docPcaAnchor = cesc("#" + stateVariables["/docPca"].replacements[0].componentName);
      let p1CaAnchor = cesc("#" + stateVariables["/p1Ca"].replacements[0].componentName);
      let p1PcaAnchor = cesc("#" + stateVariables["/p1Pca"].replacements[0].componentName);
      let p2CaAnchor = cesc("#" + stateVariables["/p2Ca"].replacements[0].componentName);
      let p2PcaAnchor = cesc("#" + stateVariables["/p2Pca"].replacements[0].componentName);
      let p21CaAnchor = cesc("#" + stateVariables["/p21Ca"].replacements[0].componentName);
      let p21PcaAnchor = cesc("#" + stateVariables["/p21Pca"].replacements[0].componentName);
      let p22CaAnchor = cesc("#" + stateVariables["/p22Ca"].replacements[0].componentName);
      let p22PcaAnchor = cesc("#" + stateVariables["/p22Pca"].replacements[0].componentName);
      let p221CaAnchor = cesc("#" + stateVariables["/p221Ca"].replacements[0].componentName);
      let p221PcaAnchor = cesc("#" + stateVariables["/p221Pca"].replacements[0].componentName);
      let p222CaAnchor = cesc("#" + stateVariables["/p222Ca"].replacements[0].componentName);
      let p222PcaAnchor = cesc("#" + stateVariables["/p222Pca"].replacements[0].componentName);
      let mathinput1Anchor = cesc('#' + stateVariables['/_answer1'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput2Anchor = cesc('#' + stateVariables['/_answer2'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput3Anchor = cesc('#' + stateVariables['/_answer3'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput4Anchor = cesc('#' + stateVariables['/_answer4'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput5Anchor = cesc('#' + stateVariables['/_answer5'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput6Anchor = cesc('#' + stateVariables['/_answer6'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput7Anchor = cesc('#' + stateVariables['/_answer7'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput8Anchor = cesc('#' + stateVariables['/_answer8'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput9Anchor = cesc('#' + stateVariables['/_answer9'].stateValues.inputChildren[0].componentName) + " textarea";

      cy.get(docCaAnchor).should('have.text', '0')
      cy.get(docPcaAnchor).should('have.text', '0')
      cy.get(p1CaAnchor).should('have.text', '0')
      cy.get(p1PcaAnchor).should('have.text', '0')
      cy.get(p2CaAnchor).should('have.text', '0')
      cy.get(p2PcaAnchor).should('have.text', '0')
      cy.get(p21CaAnchor).should('have.text', '0')
      cy.get(p21PcaAnchor).should('have.text', '0')
      cy.get(p22CaAnchor).should('have.text', '0')
      cy.get(p22PcaAnchor).should('have.text', '0')
      cy.get(p221CaAnchor).should('have.text', '0')
      cy.get(p221PcaAnchor).should('have.text', '0')
      cy.get(p222CaAnchor).should('have.text', '0')
      cy.get(p222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter first correct answer');
      cy.get(mathinput1Anchor).type(`u{enter}`, { force: true });

      let credit1 = 1 / 3.5;
      let credit1Round = Math.round(1000 * credit1) / 1000;
      let percentCredit1 = credit1 * 100;
      let percentCredit1Round = Math.round(10 * percentCredit1) / 10;

      cy.get(docCaAnchor).should('have.text', credit1Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit1Round.toString())
      cy.get(p1CaAnchor).should('have.text', '0')
      cy.get(p1PcaAnchor).should('have.text', '0')
      cy.get(p2CaAnchor).should('have.text', '0')
      cy.get(p2PcaAnchor).should('have.text', '0')
      cy.get(p21CaAnchor).should('have.text', '0')
      cy.get(p21PcaAnchor).should('have.text', '0')
      cy.get(p22CaAnchor).should('have.text', '0')
      cy.get(p22PcaAnchor).should('have.text', '0')
      cy.get(p221CaAnchor).should('have.text', '0')
      cy.get(p221PcaAnchor).should('have.text', '0')
      cy.get(p222CaAnchor).should('have.text', '0')
      cy.get(p222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit1, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit1, 1E-12);
        expect(stateVariables['/problem1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer9'].stateValues.creditAchieved).eq(0);
      })


      cy.log('enter additional correct answers');
      cy.get(mathinput3Anchor).type(`y{enter}`, { force: true });
      cy.get(mathinput5Anchor).type(`v{enter}`, { force: true });
      cy.get(mathinput7Anchor).type(`q{enter}`, { force: true });

      let problem1credit2 = 2 / 3;
      let problem1credit2Round = Math.round(1000 * problem1credit2) / 1000;
      let problem1percentCredit2 = problem1credit2 * 100;
      let problem1percentCredit2Round = Math.round(10 * problem1percentCredit2) / 10;

      let problem21credit2 = 1 / 3;
      let problem21credit2Round = Math.round(1000 * problem21credit2) / 1000;
      let problem21percentCredit2 = problem21credit2 * 100;
      let problem21percentCredit2Round = Math.round(10 * problem21percentCredit2) / 10;

      let problem22credit2 = 1 / 7;
      let problem22credit2Round = Math.round(1000 * problem22credit2) / 1000;
      let problem22percentCredit2 = problem22credit2 * 100;
      let problem22percentCredit2Round = Math.round(10 * problem22percentCredit2) / 10;

      let problem2credit2 = (3 * problem21credit2 + 4 * problem22credit2) / 8
      let problem2credit2Round = Math.round(1000 * problem2credit2) / 1000;
      let problem2percentCredit2 = problem2credit2 * 100;
      let problem2percentCredit2Round = Math.round(10 * problem2percentCredit2) / 10;;

      let credit2 = (1 + 0.5 * problem1credit2 + 2 * problem2credit2) / 3.5;
      let credit2Round = Math.round(1000 * credit2) / 1000;
      let percentCredit2 = credit2 * 100;
      let percentCredit2Round = Math.round(10 * percentCredit2) / 10;

      cy.get(docCaAnchor).should('have.text', credit2Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit2Round.toString())
      cy.get(p1CaAnchor).should('have.text', problem1credit2Round.toString())
      cy.get(p1PcaAnchor).should('have.text', problem1percentCredit2Round.toString())
      cy.get(p2CaAnchor).should('have.text', problem2credit2Round.toString())
      cy.get(p2PcaAnchor).should('have.text', problem2percentCredit2Round.toString())
      cy.get(p21CaAnchor).should('have.text', problem21credit2Round.toString())
      cy.get(p21PcaAnchor).should('have.text', problem21percentCredit2Round.toString())
      cy.get(p22CaAnchor).should('have.text', problem22credit2Round.toString())
      cy.get(p22PcaAnchor).should('have.text', problem22percentCredit2Round.toString())
      cy.get(p221CaAnchor).should('have.text', '0')
      cy.get(p221PcaAnchor).should('have.text', '0')
      cy.get(p222CaAnchor).should('have.text', '0')
      cy.get(p222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit2, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit2, 1E-12);
        expect(stateVariables['/problem1'].stateValues.creditAchieved).closeTo(problem1credit2, 1E-12);
        expect(stateVariables['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit2, 1E-12);
        expect(stateVariables['/problem2'].stateValues.creditAchieved).closeTo(problem2credit2, 1E-12);
        expect(stateVariables['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit2, 1E-12);
        expect(stateVariables['/problem21'].stateValues.creditAchieved).closeTo(problem21credit2, 1E-12)
        expect(stateVariables['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit2, 1E-12);
        expect(stateVariables['/problem22'].stateValues.creditAchieved).closeTo(problem22credit2, 1E-12)
        expect(stateVariables['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit2, 1E-12);
        expect(stateVariables['/problem221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter most other correct answers');
      cy.get(mathinput2Anchor).type(`x{enter}`, { force: true });
      cy.get(mathinput4Anchor).type(`z{enter}`, { force: true });
      cy.get(mathinput6Anchor).type(`w{enter}`, { force: true });
      cy.get(mathinput8Anchor).type(`r{enter}`, { force: true });


      let problem1credit3 = 1;
      let problem1credit3Round = Math.round(1000 * problem1credit3) / 1000;
      let problem1percentCredit3 = problem1credit3 * 100;
      let problem1percentCredit3Round = Math.round(10 * problem1percentCredit3) / 10;

      let problem21credit3 = 1;
      let problem21credit3Round = Math.round(1000 * problem21credit3) / 1000;
      let problem21percentCredit3 = problem21credit3 * 100;
      let problem21percentCredit3Round = Math.round(10 * problem21percentCredit3) / 10;

      let problem221credit3 = 1;
      let problem221credit3Round = Math.round(1000 * problem221credit3) / 1000;
      let problem221percentCredit3 = problem221credit3 * 100;
      let problem221percentCredit3Round = Math.round(10 * problem221percentCredit3) / 10;

      let problem22credit3 = 6 / 7;
      let problem22credit3Round = Math.round(1000 * problem22credit3) / 1000;
      let problem22percentCredit3 = problem22credit3 * 100;
      let problem22percentCredit3Round = Math.round(10 * problem22percentCredit3) / 10;

      let problem2credit3 = (1 + 3 * problem21credit3 + 4 * problem22credit3) / 8
      let problem2credit3Round = Math.round(1000 * problem2credit3) / 1000;
      let problem2percentCredit3 = problem2credit3 * 100;
      let problem2percentCredit3Round = Math.round(10 * problem2percentCredit3) / 10;;

      let credit3 = (1 + 0.5 * problem1credit3 + 2 * problem2credit3) / 3.5;
      let credit3Round = Math.round(1000 * credit3) / 1000;
      let percentCredit3 = credit3 * 100;
      let percentCredit3Round = Math.round(10 * percentCredit3) / 10;

      cy.get(docCaAnchor).should('have.text', credit3Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit3Round.toString())
      cy.get(p1CaAnchor).should('have.text', problem1credit3Round.toString())
      cy.get(p1PcaAnchor).should('have.text', problem1percentCredit3Round.toString())
      cy.get(p2CaAnchor).should('have.text', problem2credit3Round.toString())
      cy.get(p2PcaAnchor).should('have.text', problem2percentCredit3Round.toString())
      cy.get(p21CaAnchor).should('have.text', problem21credit3Round.toString())
      cy.get(p21PcaAnchor).should('have.text', problem21percentCredit3Round.toString())
      cy.get(p22CaAnchor).should('have.text', problem22credit3Round.toString())
      cy.get(p22PcaAnchor).should('have.text', problem22percentCredit3Round.toString())
      cy.get(p221CaAnchor).should('have.text', problem221credit3Round.toString())
      cy.get(p221PcaAnchor).should('have.text', problem221percentCredit3Round.toString())
      cy.get(p222CaAnchor).should('have.text', '0')
      cy.get(p222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit3, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit3, 1E-12);
        expect(stateVariables['/problem1'].stateValues.creditAchieved).closeTo(problem1credit3, 1E-12);
        expect(stateVariables['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit3, 1E-12);
        expect(stateVariables['/problem2'].stateValues.creditAchieved).closeTo(problem2credit3, 1E-12);
        expect(stateVariables['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit3, 1E-12);
        expect(stateVariables['/problem21'].stateValues.creditAchieved).closeTo(problem21credit3, 1E-12)
        expect(stateVariables['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit3, 1E-12);
        expect(stateVariables['/problem22'].stateValues.creditAchieved).closeTo(problem22credit3, 1E-12)
        expect(stateVariables['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit3, 1E-12);
        expect(stateVariables['/problem221'].stateValues.creditAchieved).closeTo(problem221credit3, 1E-12);
        expect(stateVariables['/problem221'].stateValues.percentCreditAchieved).closeTo(problem221percentCredit3, 1E-12);;
        expect(stateVariables['/problem222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter last correct answer');
      cy.get(mathinput9Anchor).type(`s{enter}`, { force: true });


      let problem1credit4 = 1;
      let problem1credit4Round = Math.round(1000 * problem1credit4) / 1000;
      let problem1percentCredit4 = problem1credit4 * 100;
      let problem1percentCredit4Round = Math.round(10 * problem1percentCredit4) / 10;

      let problem21credit4 = 1;
      let problem21credit4Round = Math.round(1000 * problem21credit4) / 1000;
      let problem21percentCredit4 = problem21credit4 * 100;
      let problem21percentCredit4Round = Math.round(10 * problem21percentCredit4) / 10;

      let problem221credit4 = 1;
      let problem221credit4Round = Math.round(1000 * problem221credit4) / 1000;
      let problem221percentCredit4 = problem221credit4 * 100;
      let problem221percentCredit4Round = Math.round(10 * problem221percentCredit4) / 10;

      let problem222credit4 = 1;
      let problem222credit4Round = Math.round(1000 * problem222credit4) / 1000;
      let problem222percentCredit4 = problem222credit4 * 100;
      let problem222percentCredit4Round = Math.round(10 * problem222percentCredit4) / 10;

      let problem22credit4 = 1;
      let problem22credit4Round = Math.round(1000 * problem22credit4) / 1000;
      let problem22percentCredit4 = problem22credit4 * 100;
      let problem22percentCredit4Round = Math.round(10 * problem22percentCredit4) / 10;

      let problem2credit4 = 1;
      let problem2credit4Round = Math.round(1000 * problem2credit4) / 1000;
      let problem2percentCredit4 = problem2credit4 * 100;
      let problem2percentCredit4Round = Math.round(10 * problem2percentCredit4) / 10;;

      let credit4 = (1 + problem1credit4 + problem2credit4) / 3;
      let credit4Round = Math.round(1000 * credit4) / 1000;
      let percentCredit4 = credit4 * 100;
      let percentCredit4Round = Math.round(10 * percentCredit4) / 10;

      cy.get(docCaAnchor).should('have.text', credit4Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit4Round.toString())
      cy.get(p1CaAnchor).should('have.text', problem1credit4Round.toString())
      cy.get(p1PcaAnchor).should('have.text', problem1percentCredit4Round.toString())
      cy.get(p2CaAnchor).should('have.text', problem2credit4Round.toString())
      cy.get(p2PcaAnchor).should('have.text', problem2percentCredit4Round.toString())
      cy.get(p21CaAnchor).should('have.text', problem21credit4Round.toString())
      cy.get(p21PcaAnchor).should('have.text', problem21percentCredit4Round.toString())
      cy.get(p22CaAnchor).should('have.text', problem22credit4Round.toString())
      cy.get(p22PcaAnchor).should('have.text', problem22percentCredit4Round.toString())
      cy.get(p221CaAnchor).should('have.text', problem221credit4Round.toString())
      cy.get(p221PcaAnchor).should('have.text', problem221percentCredit4Round.toString())
      cy.get(p222CaAnchor).should('have.text', problem222credit4Round.toString())
      cy.get(p222PcaAnchor).should('have.text', problem222percentCredit4Round.toString())

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit4, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit4, 1E-12);
        expect(stateVariables['/problem1'].stateValues.creditAchieved).closeTo(problem1credit4, 1E-12);
        expect(stateVariables['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit4, 1E-12);
        expect(stateVariables['/problem2'].stateValues.creditAchieved).closeTo(problem2credit4, 1E-12);
        expect(stateVariables['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit4, 1E-12);
        expect(stateVariables['/problem21'].stateValues.creditAchieved).closeTo(problem21credit4, 1E-12)
        expect(stateVariables['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit4, 1E-12);
        expect(stateVariables['/problem22'].stateValues.creditAchieved).closeTo(problem22credit4, 1E-12)
        expect(stateVariables['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit4, 1E-12);
        expect(stateVariables['/problem221'].stateValues.creditAchieved).closeTo(problem221credit4, 1E-12);
        expect(stateVariables['/problem221'].stateValues.percentCreditAchieved).closeTo(problem221percentCredit4, 1E-12);;
        expect(stateVariables['/problem222'].stateValues.creditAchieved).closeTo(problem222credit4, 1E-12);
        expect(stateVariables['/problem222'].stateValues.percentCreditAchieved).closeTo(problem222percentCredit4, 1E-12);;
        expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer6'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer8'].stateValues.creditAchieved).eq(1);
        expect(stateVariables['/_answer9'].stateValues.creditAchieved).eq(1);
      })
    })
  });


  it('section wide checkwork in problem', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Section wide checkwork: <booleaninput name="swcw" /></p>
        <problem sectionWideCheckwork="$swcw" name="theProblem">
        <title>Problem 1</title>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceinput randomizeOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceinput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
        <answer name="sum3">
          <award targetsAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
      
      </problem>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/swcw_input').should('not.be.checked')

    cy.get('#\\/theProblem_submit').should('not.exist');
    cy.get('#\\/theProblem_correct').should('not.exist');
    cy.get('#\\/theProblem_incorrect').should('not.exist');
    cy.get('#\\/theProblem_partial').should('not.exist');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let twoxInputName = stateVariables['/twox'].stateValues.inputChildren[0].componentName
      let twoxInputAnchor = cesc('#' + twoxInputName) + " textarea";
      let twoxInputSubmitAnchor = cesc('#' + twoxInputName + '_submit');
      let twoxInputCorrectAnchor = cesc('#' + twoxInputName + '_correct');
      let twoxInputIncorrectAnchor = cesc('#' + twoxInputName + '_incorrect');

      cy.get(twoxInputSubmitAnchor).should('be.visible');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get(twoxInputAnchor).type("2x{enter}", { force: true })
      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('be.visible');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');


      let helloInputName = stateVariables['/hello'].stateValues.inputChildren[0].componentName
      let helloInputAnchor = cesc('#' + helloInputName + "_input");
      let helloInputSubmitAnchor = cesc('#' + helloInputName + '_submit');
      let helloInputCorrectAnchor = cesc('#' + helloInputName + '_correct');
      let helloInputIncorrectAnchor = cesc('#' + helloInputName + '_incorrect');

      cy.get(helloInputSubmitAnchor).should('be.visible');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');

      cy.get(helloInputAnchor).type("hello{enter}")
      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('be.visible');
      cy.get(helloInputIncorrectAnchor).should('not.exist');


      cy.get('#\\/fruitInput_submit').should('be.visible');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/fruitInput').contains(`banana`).click({ force: true });
      cy.get('#\\/fruitInput_submit').click();

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('be.visible');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');


      cy.get('#\\/sum3_submit').should('be.visible');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');

      cy.get("#\\/n1 textarea").type("2{enter}", { force: true })
      cy.get("#\\/n2 textarea").type("1{enter}", { force: true })


      cy.get('#\\/sum3_submit').should('be.visible');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.get('#\\/sum3_submit').click();
      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('be.visible');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.log('switch to section wide checkwork')

      cy.get('#\\/swcw_input').click();
      cy.get('#\\/swcw_input').should('be.checked');


      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('be.visible');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');


      cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", { force: true })
      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get('#\\/theProblem_submit').should('be.visible');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');

      cy.get('#\\/theProblem_submit').click();
      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('75% correct')
      })


      cy.get(helloInputAnchor).type("2{enter}")
      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');


      cy.get('#\\/theProblem_submit').should('be.visible');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');

      cy.get('#\\/theProblem_submit').click();
      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('50% correct')
      })

      cy.log('turn off section wide checkwork')

      cy.get('#\\/swcw_input').click();
      cy.get('#\\/swcw_input').should('not.be.checked');

      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('be.visible');

      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('be.visible');

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('be.visible');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('be.visible');
      cy.get('#\\/sum3_incorrect').should('not.exist');

      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');

    });

  });

  it('section wide checkwork in section', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Section wide checkwork: <booleaninput name="swcw" /></p>
        <section aggregateScores sectionWideCheckwork="$swcw" name="theProblem">
        <title>Problem 1</title>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceinput randomizeOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceinput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
        <answer name="sum3">
          <award targetsAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
      
      </section>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/swcw_input').should('not.be.checked')

    cy.get('#\\/theProblem_submit').should('not.exist');
    cy.get('#\\/theProblem_correct').should('not.exist');
    cy.get('#\\/theProblem_incorrect').should('not.exist');
    cy.get('#\\/theProblem_partial').should('not.exist');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let twoxInputName = stateVariables['/twox'].stateValues.inputChildren[0].componentName
      let twoxInputAnchor = cesc('#' + twoxInputName) + " textarea";
      let twoxInputSubmitAnchor = cesc('#' + twoxInputName + '_submit');
      let twoxInputCorrectAnchor = cesc('#' + twoxInputName + '_correct');
      let twoxInputIncorrectAnchor = cesc('#' + twoxInputName + '_incorrect');

      cy.get(twoxInputSubmitAnchor).should('be.visible');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get(twoxInputAnchor).type("2x{enter}", { force: true })
      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('be.visible');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');


      let helloInputName = stateVariables['/hello'].stateValues.inputChildren[0].componentName
      let helloInputAnchor = cesc('#' + helloInputName + "_input");
      let helloInputSubmitAnchor = cesc('#' + helloInputName + '_submit');
      let helloInputCorrectAnchor = cesc('#' + helloInputName + '_correct');
      let helloInputIncorrectAnchor = cesc('#' + helloInputName + '_incorrect');

      cy.get(helloInputSubmitAnchor).should('be.visible');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');

      cy.get(helloInputAnchor).type("hello{enter}")
      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('be.visible');
      cy.get(helloInputIncorrectAnchor).should('not.exist');


      cy.get('#\\/fruitInput_submit').should('be.visible');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/fruitInput').contains(`banana`).click({ force: true });
      cy.get('#\\/fruitInput_submit').click();

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('be.visible');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');


      cy.get('#\\/sum3_submit').should('be.visible');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');

      cy.get("#\\/n1 textarea").type("2{enter}", { force: true })
      cy.get("#\\/n2 textarea").type("1{enter}", { force: true })


      cy.get('#\\/sum3_submit').should('be.visible');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.get('#\\/sum3_submit').click();
      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('be.visible');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.log('switch to section wide checkwork')

      cy.get('#\\/swcw_input').click();
      cy.get('#\\/swcw_input').should('be.checked');


      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('be.visible');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');


      cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", { force: true })
      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get('#\\/theProblem_submit').should('be.visible');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');

      cy.get('#\\/theProblem_submit').click();
      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('75% correct')
      })


      cy.get(helloInputAnchor).type("2{enter}")
      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');


      cy.get('#\\/theProblem_submit').should('be.visible');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');

      cy.get('#\\/theProblem_submit').click();
      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('50% correct')
      })

      cy.log('turn off section wide checkwork')

      cy.get('#\\/swcw_input').click();
      cy.get('#\\/swcw_input').should('not.be.checked');

      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('be.visible');

      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('be.visible');

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('be.visible');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('be.visible');
      cy.get('#\\/sum3_incorrect').should('not.exist');

      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');

    });

  });

  it('document wide checkwork', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <document documentWideCheckwork="$dwcw" name="theDocument">
        <title>The problem</title>

        <p>Document wide checkwork: <booleaninput name="dwcw" /></p>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceinput randomizeOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceinput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
        <answer name="sum3">
          <award targetsAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
        </document>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/dwcw_input').should('not.be.checked')

    cy.get('#\\/theDocument_submit').should('not.exist');
    cy.get('#\\/theDocument_correct').should('not.exist');
    cy.get('#\\/theDocument_incorrect').should('not.exist');
    cy.get('#\\/theDocument_partial').should('not.exist');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let twoxInputName = stateVariables['/twox'].stateValues.inputChildren[0].componentName
      let twoxInputAnchor = cesc('#' + twoxInputName) + " textarea";
      let twoxInputSubmitAnchor = cesc('#' + twoxInputName + '_submit');
      let twoxInputCorrectAnchor = cesc('#' + twoxInputName + '_correct');
      let twoxInputIncorrectAnchor = cesc('#' + twoxInputName + '_incorrect');

      cy.get(twoxInputSubmitAnchor).should('be.visible');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get(twoxInputAnchor).type("2x{enter}", { force: true })
      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('be.visible');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');


      let helloInputName = stateVariables['/hello'].stateValues.inputChildren[0].componentName
      let helloInputAnchor = cesc('#' + helloInputName + "_input");
      let helloInputSubmitAnchor = cesc('#' + helloInputName + '_submit');
      let helloInputCorrectAnchor = cesc('#' + helloInputName + '_correct');
      let helloInputIncorrectAnchor = cesc('#' + helloInputName + '_incorrect');

      cy.get(helloInputSubmitAnchor).should('be.visible');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');

      cy.get(helloInputAnchor).type("hello{enter}")
      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('be.visible');
      cy.get(helloInputIncorrectAnchor).should('not.exist');


      cy.get('#\\/fruitInput_submit').should('be.visible');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/fruitInput').contains(`banana`).click({ force: true });
      cy.get('#\\/fruitInput_submit').click();

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('be.visible');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');


      cy.get('#\\/sum3_submit').should('be.visible');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');

      cy.get("#\\/n1 textarea").type("2{enter}", { force: true })
      cy.get("#\\/n2 textarea").type("1{enter}", { force: true })


      cy.get('#\\/sum3_submit').should('be.visible');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.get('#\\/sum3_submit').click();
      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('be.visible');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.log('switch to document wide checkwork')

      cy.get('#\\/dwcw_input').click();
      cy.get('#\\/dwcw_input').should('be.checked');


      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.get('#\\/theDocument_submit').should('not.exist');
      cy.get('#\\/theDocument_correct').should('be.visible');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').should('not.exist');


      cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", { force: true })
      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get('#\\/theDocument_submit').should('be.visible');
      cy.get('#\\/theDocument_correct').should('not.exist');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').should('not.exist');

      cy.get('#\\/theDocument_submit').click();
      cy.get('#\\/theDocument_submit').should('not.exist');
      cy.get('#\\/theDocument_correct').should('not.exist');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('75% correct')
      })


      cy.get(helloInputAnchor).type("2{enter}")
      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');


      cy.get('#\\/theDocument_submit').should('be.visible');
      cy.get('#\\/theDocument_correct').should('not.exist');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').should('not.exist');

      cy.get('#\\/theDocument_submit').click();
      cy.get('#\\/theDocument_submit').should('not.exist');
      cy.get('#\\/theDocument_correct').should('not.exist');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('50% correct')
      })

      cy.log('turn off document wide checkwork')

      cy.get('#\\/dwcw_input').click();
      cy.get('#\\/dwcw_input').should('not.be.checked');

      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('be.visible');

      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('be.visible');

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('be.visible');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('be.visible');
      cy.get('#\\/sum3_incorrect').should('not.exist');

      cy.get('#\\/theDocument_submit').should('not.exist');
      cy.get('#\\/theDocument_correct').should('not.exist');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').should('not.exist');

    });

  });

  it('outer section wide checkwork supercedes inner section', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <p>Section wide checkwork: <booleaninput name="swcw" /></p>
        <section aggregateScores sectionWideCheckwork="$swcw" name="theProblem">
        <title>Problem 1</title>

        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <subsection aggregateScores sectionWideCheckwork name="subProblem">
          <title>Sub problem a</title>
          <p>banana: 
          <answer name="fruit">
            <choiceinput randomizeOrder name="fruitInput">
              <choice credit="1">banana</choice>
              <choice>apple</choice>
              <choice>orange</choice>
            </choiceinput>
          </answer>
          </p>
      
          <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
          <answer name="sum3">
            <award targetsAreResponses="n1 n2">
              <when>$n1+$n2=3</when>
            </award>
          </answer></p>
        </subsection>
      
      </section>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/swcw_input').should('not.be.checked')

    cy.get('#\\/theProblem_submit').should('not.exist');
    cy.get('#\\/theProblem_correct').should('not.exist');
    cy.get('#\\/theProblem_incorrect').should('not.exist');
    cy.get('#\\/theProblem_partial').should('not.exist');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let twoxInputName = stateVariables['/twox'].stateValues.inputChildren[0].componentName
      let twoxInputAnchor = cesc('#' + twoxInputName) + " textarea";
      let twoxInputSubmitAnchor = cesc('#' + twoxInputName + '_submit');
      let twoxInputCorrectAnchor = cesc('#' + twoxInputName + '_correct');
      let twoxInputIncorrectAnchor = cesc('#' + twoxInputName + '_incorrect');

      cy.get(twoxInputSubmitAnchor).should('be.visible');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get(twoxInputAnchor).type("2x{enter}", { force: true })
      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('be.visible');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');


      let helloInputName = stateVariables['/hello'].stateValues.inputChildren[0].componentName
      let helloInputAnchor = cesc('#' + helloInputName + "_input");
      let helloInputSubmitAnchor = cesc('#' + helloInputName + '_submit');
      let helloInputCorrectAnchor = cesc('#' + helloInputName + '_correct');
      let helloInputIncorrectAnchor = cesc('#' + helloInputName + '_incorrect');

      cy.get(helloInputSubmitAnchor).should('be.visible');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');

      cy.get(helloInputAnchor).type("hello{enter}")
      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('be.visible');
      cy.get(helloInputIncorrectAnchor).should('not.exist');


      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');
      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');

      cy.get('#\\/subProblem_submit').should('be.visible');
      cy.get('#\\/subProblem_correct').should('not.exist');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').should('not.exist');


      cy.get('#\\/fruitInput').contains(`banana`).click({ force: true });
      cy.get('#\\/subProblem_submit').click();

      cy.get('#\\/subProblem_submit').should('not.exist');
      cy.get('#\\/subProblem_correct').should('not.exist');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('50% correct')
      })

      cy.get("#\\/n1 textarea").type("2{enter}", { force: true })
      cy.get("#\\/n2 textarea").type("1{enter}", { force: true })

      cy.get('#\\/subProblem_submit').should('be.visible');
      cy.get('#\\/subProblem_correct').should('not.exist');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').should('not.exist');

      cy.get('#\\/subProblem_submit').click();

      cy.get('#\\/subProblem_submit').should('not.exist');
      cy.get('#\\/subProblem_correct').should('be.visible');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').should('not.exist');


      cy.log('switch to section wide checkwork')

      cy.get('#\\/swcw_input').click();
      cy.get('#\\/swcw_input').should('be.checked');


      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.get('#\\/subProblem_submit').should('not.exist');
      cy.get('#\\/subProblem_correct').should('not.exist');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').should('not.exist');


      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('be.visible');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');


      cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", { force: true })
      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get('#\\/theProblem_submit').should('be.visible');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');

      cy.get('#\\/theProblem_submit').click();
      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('67% correct')
      })


      cy.get(helloInputAnchor).type("2{enter}")
      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');


      cy.get('#\\/theProblem_submit').should('be.visible');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');

      cy.get('#\\/theProblem_submit').click();
      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('33% correct')
      })

      cy.log('turn off section wide checkwork')

      cy.get('#\\/swcw_input').click();
      cy.get('#\\/swcw_input').should('not.be.checked');

      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('be.visible');

      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('be.visible');

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');

      cy.get('#\\/subProblem_submit').should('not.exist');
      cy.get('#\\/subProblem_correct').should('be.visible');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').should('not.exist');

      cy.get('#\\/theProblem_submit').should('not.exist');
      cy.get('#\\/theProblem_correct').should('not.exist');
      cy.get('#\\/theProblem_incorrect').should('not.exist');
      cy.get('#\\/theProblem_partial').should('not.exist');

    });

  });

  it('document wide checkwork supercedes section', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <document documentWideCheckwork="$dwcw" name="theDocument">
        <title>The problem</title>

        <p>Document wide checkwork: <booleaninput name="dwcw" /></p>
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <section aggregateScores sectionWideCheckwork name="subProblem">
          <title>Sub problem a</title>
          <p>banana: 
          <answer name="fruit">
            <choiceinput randomizeOrder name="fruitInput">
              <choice credit="1">banana</choice>
              <choice>apple</choice>
              <choice>orange</choice>
            </choiceinput>
          </answer>
          </p>
      
          <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
          <answer name="sum3">
            <award targetsAreResponses="n1 n2">
              <when>$n1+$n2=3</when>
            </award>
          </answer></p>
        </section>
      
      </document>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/dwcw_input').should('not.be.checked')

    cy.get('#\\/theDocument_submit').should('not.exist');
    cy.get('#\\/theDocument_correct').should('not.exist');
    cy.get('#\\/theDocument_incorrect').should('not.exist');
    cy.get('#\\/theDocument_partial').should('not.exist');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let twoxInputName = stateVariables['/twox'].stateValues.inputChildren[0].componentName
      let twoxInputAnchor = cesc('#' + twoxInputName) + " textarea";
      let twoxInputSubmitAnchor = cesc('#' + twoxInputName + '_submit');
      let twoxInputCorrectAnchor = cesc('#' + twoxInputName + '_correct');
      let twoxInputIncorrectAnchor = cesc('#' + twoxInputName + '_incorrect');

      cy.get(twoxInputSubmitAnchor).should('be.visible');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get(twoxInputAnchor).type("2x{enter}", { force: true })
      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('be.visible');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');


      let helloInputName = stateVariables['/hello'].stateValues.inputChildren[0].componentName
      let helloInputAnchor = cesc('#' + helloInputName + "_input");
      let helloInputSubmitAnchor = cesc('#' + helloInputName + '_submit');
      let helloInputCorrectAnchor = cesc('#' + helloInputName + '_correct');
      let helloInputIncorrectAnchor = cesc('#' + helloInputName + '_incorrect');

      cy.get(helloInputSubmitAnchor).should('be.visible');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');

      cy.get(helloInputAnchor).type("hello{enter}")
      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('be.visible');
      cy.get(helloInputIncorrectAnchor).should('not.exist');


      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');
      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');

      cy.get('#\\/subProblem_submit').should('be.visible');
      cy.get('#\\/subProblem_correct').should('not.exist');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').should('not.exist');


      cy.get('#\\/fruitInput').contains(`banana`).click({ force: true });
      cy.get('#\\/subProblem_submit').click();

      cy.get('#\\/subProblem_submit').should('not.exist');
      cy.get('#\\/subProblem_correct').should('not.exist');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('50% correct')
      })

      cy.get("#\\/n1 textarea").type("2{enter}", { force: true })
      cy.get("#\\/n2 textarea").type("1{enter}", { force: true })

      cy.get('#\\/subProblem_submit').should('be.visible');
      cy.get('#\\/subProblem_correct').should('not.exist');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').should('not.exist');

      cy.get('#\\/subProblem_submit').click();

      cy.get('#\\/subProblem_submit').should('not.exist');
      cy.get('#\\/subProblem_correct').should('be.visible');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').should('not.exist');


      cy.log('switch to document wide checkwork')

      cy.get('#\\/dwcw_input').click();
      cy.get('#\\/dwcw_input').should('be.checked');


      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');


      cy.get('#\\/subProblem_submit').should('not.exist');
      cy.get('#\\/subProblem_correct').should('not.exist');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').should('not.exist');


      cy.get('#\\/theDocument_submit').should('not.exist');
      cy.get('#\\/theDocument_correct').should('be.visible');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').should('not.exist');


      cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", { force: true })
      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('not.exist');

      cy.get('#\\/theDocument_submit').should('be.visible');
      cy.get('#\\/theDocument_correct').should('not.exist');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').should('not.exist');

      cy.get('#\\/theDocument_submit').click();
      cy.get('#\\/theDocument_submit').should('not.exist');
      cy.get('#\\/theDocument_correct').should('not.exist');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('67% correct')
      })


      cy.get(helloInputAnchor).type("2{enter}")
      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('not.exist');


      cy.get('#\\/theDocument_submit').should('be.visible');
      cy.get('#\\/theDocument_correct').should('not.exist');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').should('not.exist');

      cy.get('#\\/theDocument_submit').click();
      cy.get('#\\/theDocument_submit').should('not.exist');
      cy.get('#\\/theDocument_correct').should('not.exist');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('33% correct')
      })

      cy.log('turn off document wide checkwork')

      cy.get('#\\/dwcw_input').click();
      cy.get('#\\/dwcw_input').should('not.be.checked');

      cy.get(twoxInputSubmitAnchor).should('not.exist');
      cy.get(twoxInputCorrectAnchor).should('not.exist');
      cy.get(twoxInputIncorrectAnchor).should('be.visible');

      cy.get(helloInputSubmitAnchor).should('not.exist');
      cy.get(helloInputCorrectAnchor).should('not.exist');
      cy.get(helloInputIncorrectAnchor).should('be.visible');

      cy.get('#\\/fruitInput_submit').should('not.exist');
      cy.get('#\\/fruitInput_correct').should('not.exist');
      cy.get('#\\/fruitInput_incorrect').should('not.exist');

      cy.get('#\\/sum3_submit').should('not.exist');
      cy.get('#\\/sum3_correct').should('not.exist');
      cy.get('#\\/sum3_incorrect').should('not.exist');

      cy.get('#\\/subProblem_submit').should('not.exist');
      cy.get('#\\/subProblem_correct').should('be.visible');
      cy.get('#\\/subProblem_incorrect').should('not.exist');
      cy.get('#\\/subProblem_partial').should('not.exist');

      cy.get('#\\/theDocument_submit').should('not.exist');
      cy.get('#\\/theDocument_correct').should('not.exist');
      cy.get('#\\/theDocument_incorrect').should('not.exist');
      cy.get('#\\/theDocument_partial').should('not.exist');

    });

  });

  it('maintain state while reloading problem', () => {

    let doenetML = `
    <text>a</text>
    <problem name="problem1" newNamespace>
      <variantControl nVariants="2" variantNames="apple banana" />
      <select assignNames="fruit" hide>
        <option selectForVariantNames="apple" newNamespace>
          <text name="name">apple</text>
          <text name="color">red</text>
        </option>
        <option selectForVariantNames="banana" newNamespace>
          <text name="name">banana</text>
          <text name="color">yellow</text>
          </option>
      </select>
      <p>Enter $(fruit/name): 
        <answer type="text">
          <textinput name="input1" />
          <award>$(fruit/name)</award>
        </answer>
      </p>
      <p>Enter $(fruit/color): 
      <answer type="text">
        <textinput name="input2" />
        <award>$(fruit/color)</award>
      </answer>
    </p>
    </problem>
  
    <p>Credit achieved: <copy prop="creditAchieved" target="_document1" assignNames="ca" /></p>
    `

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML,
        requestedVariant: {
          subvariants: [{
            index: [1],
          }]
        }
      }, "*");
    });

    // at least right now, this turns on Allow Local Page State
    cy.get('h3 > button').click();
    cy.get(':nth-child(11) > label > input').click()
    cy.get('h3 > button').click();


    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/ca')).should('have.text', '0')

    cy.get(cesc('#/problem1/input1_input')).type('banana{enter}');
    cy.get(cesc('#/problem1/input1_incorrect')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0')

    cy.get(cesc('#/problem1/input2_submit')).should('be.visible');

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>b</text>
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.get(cesc('#/problem1/input1_incorrect')).should('be.visible');
    cy.get(cesc('#/problem1/input2_submit')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0')

    cy.get(cesc('#/problem1/input1_input')).clear().type('apple{enter}');
    cy.get(cesc('#/problem1/input1_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.get(cesc('#/problem1/input2_input')).clear().type('yellow{enter}');
    cy.get(cesc('#/problem1/input2_incorrect')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>b</text>
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.get(cesc('#/problem1/input1_correct')).should('be.visible');
    cy.get(cesc('#/problem1/input2_incorrect')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.get(cesc('#/problem1/input2_input')).clear().type('red{enter}');
    cy.get(cesc('#/problem1/input2_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '1')


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>b</text>
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML
      }, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.get(cesc('#/problem1/input1_correct')).should('be.visible');
    cy.get(cesc('#/problem1/input2_correct')).should('be.visible');
    cy.get(cesc('#/ca')).should('have.text', '1')


  })

});