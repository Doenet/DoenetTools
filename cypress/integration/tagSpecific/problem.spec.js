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
    cy.visit('/test')

  })

  it('problems default to weight 1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <title>Activity</title>
    <p>Credit achieved for <copy prop="title" tname="_document1" />:
    <copy name="docCa" prop="creditAchieved" tname="_document1" />, or <copy name="docPca" prop="percentCreditAchieved" tname="_document1" />%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <problem title="Problem 1" name="problem1">
      <p>Credit achieved for <copy prop="title" tname="problem1" />:
      <copy name="p1Ca" prop="creditAchieved" tname="problem1" />, or <copy name="p1Pca" prop="percentCreditAchieved" tname="problem1" />%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </problem>
    <problem title="Problem 2" name="problem2">
      <p>Credit achieved for <copy prop="title" tname="problem2" />:
      <copy name="p2Ca" prop="creditAchieved" tname="problem2" />, or <copy name="p2Pca" prop="percentCreditAchieved" tname="problem2" />%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <problem title="Problem 2.1" name="problem21">
        <p>Credit achieved for <copy prop="title" tname="problem21" />:
        <copy name="p21Ca" prop="creditAchieved" tname="problem21" />, or <copy name="p21Pca" prop="percentCreditAchieved" tname="problem21" />%</p>

        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </problem>
      <problem title="Problem 2.2" name="problem22">
        <p>Credit achieved for <copy prop="title" tname="problem22" />:
        <copy name="p22Ca" prop="creditAchieved" tname="problem22" />, or <copy name="p22Pca" prop="percentCreditAchieved" tname="problem22" />%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <problem title="Problem 2.2.1" name="problem221">
          <p>Credit achieved for <copy prop="title" tname="problem221" />:
          <copy name="p221Ca" prop="creditAchieved" tname="problem221" />, or <copy name="p221Pca" prop="percentCreditAchieved" tname="problem221" />%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </problem>
        <problem title="Problem 2.2.2" name="problem222">
          <p>Credit achieved for <copy prop="title" tname="problem222" />:
          <copy name="p222Ca" prop="creditAchieved" tname="problem222" />, or <copy name="p222Pca" prop="percentCreditAchieved" tname="problem222" />%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </problem>
      </problem>

    </problem>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_document1_title').should('have.text', 'Activity')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let docCaAnchor = "#" + components["/docCa"].replacements[0].componentName;
      let docPcaAnchor = "#" + components["/docPca"].replacements[0].componentName;
      let p1CaAnchor = "#" + components["/p1Ca"].replacements[0].componentName;
      let p1PcaAnchor = "#" + components["/p1Pca"].replacements[0].componentName;
      let p2CaAnchor = "#" + components["/p2Ca"].replacements[0].componentName;
      let p2PcaAnchor = "#" + components["/p2Pca"].replacements[0].componentName;
      let p21CaAnchor = "#" + components["/p21Ca"].replacements[0].componentName;
      let p21PcaAnchor = "#" + components["/p21Pca"].replacements[0].componentName;
      let p22CaAnchor = "#" + components["/p22Ca"].replacements[0].componentName;
      let p22PcaAnchor = "#" + components["/p22Pca"].replacements[0].componentName;
      let p221CaAnchor = "#" + components["/p221Ca"].replacements[0].componentName;
      let p221PcaAnchor = "#" + components["/p221Pca"].replacements[0].componentName;
      let p222CaAnchor = "#" + components["/p222Ca"].replacements[0].componentName;
      let p222PcaAnchor = "#" + components["/p222Pca"].replacements[0].componentName;
      let mathinput1Anchor = cesc('#' + components['/_answer1'].stateValues.inputChild.componentName + "_input");
      let mathinput2Anchor = cesc('#' + components['/_answer2'].stateValues.inputChild.componentName + "_input");
      let mathinput3Anchor = cesc('#' + components['/_answer3'].stateValues.inputChild.componentName + "_input");
      let mathinput4Anchor = cesc('#' + components['/_answer4'].stateValues.inputChild.componentName + "_input");
      let mathinput5Anchor = cesc('#' + components['/_answer5'].stateValues.inputChild.componentName + "_input");
      let mathinput6Anchor = cesc('#' + components['/_answer6'].stateValues.inputChild.componentName + "_input");
      let mathinput7Anchor = cesc('#' + components['/_answer7'].stateValues.inputChild.componentName + "_input");
      let mathinput8Anchor = cesc('#' + components['/_answer8'].stateValues.inputChild.componentName + "_input");
      let mathinput9Anchor = cesc('#' + components['/_answer9'].stateValues.inputChild.componentName + "_input");

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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_document1'].stateValues.creditAchieved).eq(0);
        expect(components['/_document1'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem1'].stateValues.creditAchieved).eq(0);
        expect(components['/problem1'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem2'].stateValues.creditAchieved).eq(0);
        expect(components['/problem2'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem21'].stateValues.creditAchieved).eq(0);
        expect(components['/problem21'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem22'].stateValues.creditAchieved).eq(0);
        expect(components['/problem22'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem221'].stateValues.creditAchieved).eq(0);
        expect(components['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem222'].stateValues.creditAchieved).eq(0);
        expect(components['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter first correct answer');
      cy.get(mathinput1Anchor).type(`u{enter}`);

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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_document1'].stateValues.creditAchieved).closeTo(credit1, 1E-12);
        expect(components['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit1, 1E-12);
        expect(components['/problem1'].stateValues.creditAchieved).eq(0);
        expect(components['/problem1'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem2'].stateValues.creditAchieved).eq(0);
        expect(components['/problem2'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem21'].stateValues.creditAchieved).eq(0);
        expect(components['/problem21'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem22'].stateValues.creditAchieved).eq(0);
        expect(components['/problem22'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem221'].stateValues.creditAchieved).eq(0);
        expect(components['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem222'].stateValues.creditAchieved).eq(0);
        expect(components['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer9'].stateValues.creditAchieved).eq(0);
      })


      cy.log('enter additional correct answers');
      cy.get(mathinput3Anchor).type(`y{enter}`);
      cy.get(mathinput5Anchor).type(`v{enter}`);
      cy.get(mathinput7Anchor).type(`q{enter}`);

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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_document1'].stateValues.creditAchieved).closeTo(credit2, 1E-12);
        expect(components['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit2, 1E-12);
        expect(components['/problem1'].stateValues.creditAchieved).closeTo(problem1credit2, 1E-12);
        expect(components['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit2, 1E-12);
        expect(components['/problem2'].stateValues.creditAchieved).closeTo(problem2credit2, 1E-12);
        expect(components['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit2, 1E-12);
        expect(components['/problem21'].stateValues.creditAchieved).closeTo(problem21credit2, 1E-12)
        expect(components['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit2, 1E-12);
        expect(components['/problem22'].stateValues.creditAchieved).closeTo(problem22credit2, 1E-12)
        expect(components['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit2, 1E-12);
        expect(components['/problem221'].stateValues.creditAchieved).eq(0);
        expect(components['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem222'].stateValues.creditAchieved).eq(0);
        expect(components['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter most other correct answers');
      cy.get(mathinput2Anchor).type(`x{enter}`);
      cy.get(mathinput4Anchor).type(`z{enter}`);
      cy.get(mathinput6Anchor).type(`w{enter}`);
      cy.get(mathinput8Anchor).type(`r{enter}`);


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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_document1'].stateValues.creditAchieved).closeTo(credit3, 1E-12);
        expect(components['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit3, 1E-12);
        expect(components['/problem1'].stateValues.creditAchieved).closeTo(problem1credit3, 1E-12);
        expect(components['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit3, 1E-12);
        expect(components['/problem2'].stateValues.creditAchieved).closeTo(problem2credit3, 1E-12);
        expect(components['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit3, 1E-12);
        expect(components['/problem21'].stateValues.creditAchieved).closeTo(problem21credit3, 1E-12)
        expect(components['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit3, 1E-12);
        expect(components['/problem22'].stateValues.creditAchieved).closeTo(problem22credit3, 1E-12)
        expect(components['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit3, 1E-12);
        expect(components['/problem221'].stateValues.creditAchieved).closeTo(problem221credit3, 1E-12);
        expect(components['/problem221'].stateValues.percentCreditAchieved).closeTo(problem221percentCredit3, 1E-12);;
        expect(components['/problem222'].stateValues.creditAchieved).eq(0);
        expect(components['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter last correct answer');
      cy.get(mathinput9Anchor).type(`s{enter}`);


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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_document1'].stateValues.creditAchieved).closeTo(credit4, 1E-12);
        expect(components['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit4, 1E-12);
        expect(components['/problem1'].stateValues.creditAchieved).closeTo(problem1credit4, 1E-12);
        expect(components['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit4, 1E-12);
        expect(components['/problem2'].stateValues.creditAchieved).closeTo(problem2credit4, 1E-12);
        expect(components['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit4, 1E-12);
        expect(components['/problem21'].stateValues.creditAchieved).closeTo(problem21credit4, 1E-12)
        expect(components['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit4, 1E-12);
        expect(components['/problem22'].stateValues.creditAchieved).closeTo(problem22credit4, 1E-12)
        expect(components['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit4, 1E-12);
        expect(components['/problem221'].stateValues.creditAchieved).closeTo(problem221credit4, 1E-12);
        expect(components['/problem221'].stateValues.percentCreditAchieved).closeTo(problem221percentCredit4, 1E-12);;
        expect(components['/problem222'].stateValues.creditAchieved).closeTo(problem222credit4, 1E-12);
        expect(components['/problem222'].stateValues.percentCreditAchieved).closeTo(problem222percentCredit4, 1E-12);;
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer9'].stateValues.creditAchieved).eq(1);
      })

    })
  });

  it('problems with weights', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <title>Activity</title>
    <p>Credit achieved for <copy prop="title" tname="_document1" />:
    <copy name="docCa" prop="creditAchieved" tname="_document1" />, or <copy name="docPca" prop="percentCreditAchieved" tname="_document1" />%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <problem title="Problem 1" name="problem1" weight="0.5">
      <p>Credit achieved for <copy prop="title" tname="problem1" />:
      <copy name="p1Ca" prop="creditAchieved" tname="problem1" />, or <copy name="p1Pca" prop="percentCreditAchieved" tname="problem1" />%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </problem>
    <problem title="Problem 2" name="problem2" weight="2">
      <p>Credit achieved for <copy prop="title" tname="problem2" />:
      <copy name="p2Ca" prop="creditAchieved" tname="problem2" />, or <copy name="p2Pca" prop="percentCreditAchieved" tname="problem2" />%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <problem title="Problem 2.1" name="problem21" weight="3">
        <p>Credit achieved for <copy prop="title" tname="problem21" />:
        <copy name="p21Ca" prop="creditAchieved" tname="problem21" />, or <copy name="p21Pca" prop="percentCreditAchieved" tname="problem21" />%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </problem>
      <problem title="Problem 2.2" name="problem22" weight="4">
        <p>Credit achieved for <copy prop="title" tname="problem22" />:
        <copy name="p22Ca" prop="creditAchieved" tname="problem22" />, or <copy name="p22Pca" prop="percentCreditAchieved" tname="problem22" />%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <problem title="Problem 2.2.1" name="problem221" weight="5">
          <p>Credit achieved for <copy prop="title" tname="problem221" />:
          <copy name="p221Ca" prop="creditAchieved" tname="problem221" />, or <copy name="p221Pca" prop="percentCreditAchieved" tname="problem221" />%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </problem>
        <problem title="Problem 2.2.2" name="problem222" weight="1">
          <p>Credit achieved for <copy prop="title" tname="problem222" />:
          <copy name="p222Ca" prop="creditAchieved" tname="problem222" />, or <copy name="p222Pca" prop="percentCreditAchieved" tname="problem222" />%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </problem>
      </problem>

    </problem>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_document1_title').should('have.text', 'Activity')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let docCaAnchor = "#" + components["/docCa"].replacements[0].componentName;
      let docPcaAnchor = "#" + components["/docPca"].replacements[0].componentName;
      let p1CaAnchor = "#" + components["/p1Ca"].replacements[0].componentName;
      let p1PcaAnchor = "#" + components["/p1Pca"].replacements[0].componentName;
      let p2CaAnchor = "#" + components["/p2Ca"].replacements[0].componentName;
      let p2PcaAnchor = "#" + components["/p2Pca"].replacements[0].componentName;
      let p21CaAnchor = "#" + components["/p21Ca"].replacements[0].componentName;
      let p21PcaAnchor = "#" + components["/p21Pca"].replacements[0].componentName;
      let p22CaAnchor = "#" + components["/p22Ca"].replacements[0].componentName;
      let p22PcaAnchor = "#" + components["/p22Pca"].replacements[0].componentName;
      let p221CaAnchor = "#" + components["/p221Ca"].replacements[0].componentName;
      let p221PcaAnchor = "#" + components["/p221Pca"].replacements[0].componentName;
      let p222CaAnchor = "#" + components["/p222Ca"].replacements[0].componentName;
      let p222PcaAnchor = "#" + components["/p222Pca"].replacements[0].componentName;
      let mathinput1Anchor = cesc('#' + components['/_answer1'].stateValues.inputChild.componentName + "_input");
      let mathinput2Anchor = cesc('#' + components['/_answer2'].stateValues.inputChild.componentName + "_input");
      let mathinput3Anchor = cesc('#' + components['/_answer3'].stateValues.inputChild.componentName + "_input");
      let mathinput4Anchor = cesc('#' + components['/_answer4'].stateValues.inputChild.componentName + "_input");
      let mathinput5Anchor = cesc('#' + components['/_answer5'].stateValues.inputChild.componentName + "_input");
      let mathinput6Anchor = cesc('#' + components['/_answer6'].stateValues.inputChild.componentName + "_input");
      let mathinput7Anchor = cesc('#' + components['/_answer7'].stateValues.inputChild.componentName + "_input");
      let mathinput8Anchor = cesc('#' + components['/_answer8'].stateValues.inputChild.componentName + "_input");
      let mathinput9Anchor = cesc('#' + components['/_answer9'].stateValues.inputChild.componentName + "_input");

      cy.get(docCaAnchor).should('have.text','0')
      cy.get(docPcaAnchor).should('have.text','0')
      cy.get(p1CaAnchor).should('have.text','0')
      cy.get(p1PcaAnchor).should('have.text','0')
      cy.get(p2CaAnchor).should('have.text','0')
      cy.get(p2PcaAnchor).should('have.text','0')
      cy.get(p21CaAnchor).should('have.text','0')
      cy.get(p21PcaAnchor).should('have.text','0')
      cy.get(p22CaAnchor).should('have.text','0')
      cy.get(p22PcaAnchor).should('have.text','0')
      cy.get(p221CaAnchor).should('have.text','0')
      cy.get(p221PcaAnchor).should('have.text','0')
      cy.get(p222CaAnchor).should('have.text','0')
      cy.get(p222PcaAnchor).should('have.text','0')

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_document1'].stateValues.creditAchieved).eq(0);
        expect(components['/_document1'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem1'].stateValues.creditAchieved).eq(0);
        expect(components['/problem1'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem2'].stateValues.creditAchieved).eq(0);
        expect(components['/problem2'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem21'].stateValues.creditAchieved).eq(0);
        expect(components['/problem21'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem22'].stateValues.creditAchieved).eq(0);
        expect(components['/problem22'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem221'].stateValues.creditAchieved).eq(0);
        expect(components['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem222'].stateValues.creditAchieved).eq(0);
        expect(components['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter first correct answer');
      cy.get(mathinput1Anchor).type(`u{enter}`);

      let credit1 = 1 / 3.5;
      let credit1Round = Math.round(1000 * credit1) / 1000;
      let percentCredit1 = credit1 * 100;
      let percentCredit1Round = Math.round(10 * percentCredit1) / 10;

      cy.get(docCaAnchor).should('have.text',credit1Round.toString())
      cy.get(docPcaAnchor).should('have.text',percentCredit1Round.toString())
      cy.get(p1CaAnchor).should('have.text','0')
      cy.get(p1PcaAnchor).should('have.text','0')
      cy.get(p2CaAnchor).should('have.text','0')
      cy.get(p2PcaAnchor).should('have.text','0')
      cy.get(p21CaAnchor).should('have.text','0')
      cy.get(p21PcaAnchor).should('have.text','0')
      cy.get(p22CaAnchor).should('have.text','0')
      cy.get(p22PcaAnchor).should('have.text','0')
      cy.get(p221CaAnchor).should('have.text','0')
      cy.get(p221PcaAnchor).should('have.text','0')
      cy.get(p222CaAnchor).should('have.text','0')
      cy.get(p222PcaAnchor).should('have.text','0')

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_document1'].stateValues.creditAchieved).closeTo(credit1, 1E-12);
        expect(components['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit1, 1E-12);
        expect(components['/problem1'].stateValues.creditAchieved).eq(0);
        expect(components['/problem1'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem2'].stateValues.creditAchieved).eq(0);
        expect(components['/problem2'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem21'].stateValues.creditAchieved).eq(0);
        expect(components['/problem21'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem22'].stateValues.creditAchieved).eq(0);
        expect(components['/problem22'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem221'].stateValues.creditAchieved).eq(0);
        expect(components['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem222'].stateValues.creditAchieved).eq(0);
        expect(components['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer9'].stateValues.creditAchieved).eq(0);
      })


      cy.log('enter additional correct answers');
      cy.get(mathinput3Anchor).type(`y{enter}`);
      cy.get(mathinput5Anchor).type(`v{enter}`);
      cy.get(mathinput7Anchor).type(`q{enter}`);

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

      cy.get(docCaAnchor).should('have.text',credit2Round.toString())
      cy.get(docPcaAnchor).should('have.text',percentCredit2Round.toString())
      cy.get(p1CaAnchor).should('have.text',problem1credit2Round.toString())
      cy.get(p1PcaAnchor).should('have.text',problem1percentCredit2Round.toString())
      cy.get(p2CaAnchor).should('have.text',problem2credit2Round.toString())
      cy.get(p2PcaAnchor).should('have.text',problem2percentCredit2Round.toString())
      cy.get(p21CaAnchor).should('have.text',problem21credit2Round.toString())
      cy.get(p21PcaAnchor).should('have.text',problem21percentCredit2Round.toString())
      cy.get(p22CaAnchor).should('have.text',problem22credit2Round.toString())
      cy.get(p22PcaAnchor).should('have.text',problem22percentCredit2Round.toString())
      cy.get(p221CaAnchor).should('have.text','0')
      cy.get(p221PcaAnchor).should('have.text','0')
      cy.get(p222CaAnchor).should('have.text','0')
      cy.get(p222PcaAnchor).should('have.text','0')

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_document1'].stateValues.creditAchieved).closeTo(credit2, 1E-12);
        expect(components['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit2, 1E-12);
        expect(components['/problem1'].stateValues.creditAchieved).closeTo(problem1credit2, 1E-12);
        expect(components['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit2, 1E-12);
        expect(components['/problem2'].stateValues.creditAchieved).closeTo(problem2credit2, 1E-12);
        expect(components['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit2, 1E-12);
        expect(components['/problem21'].stateValues.creditAchieved).closeTo(problem21credit2, 1E-12)
        expect(components['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit2, 1E-12);
        expect(components['/problem22'].stateValues.creditAchieved).closeTo(problem22credit2, 1E-12)
        expect(components['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit2, 1E-12);
        expect(components['/problem221'].stateValues.creditAchieved).eq(0);
        expect(components['/problem221'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/problem222'].stateValues.creditAchieved).eq(0);
        expect(components['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter most other correct answers');
      cy.get(mathinput2Anchor).type(`x{enter}`);
      cy.get(mathinput4Anchor).type(`z{enter}`);
      cy.get(mathinput6Anchor).type(`w{enter}`);
      cy.get(mathinput8Anchor).type(`r{enter}`);


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

      cy.get(docCaAnchor).should('have.text',credit3Round.toString())
      cy.get(docPcaAnchor).should('have.text',percentCredit3Round.toString())
      cy.get(p1CaAnchor).should('have.text',problem1credit3Round.toString())
      cy.get(p1PcaAnchor).should('have.text',problem1percentCredit3Round.toString())
      cy.get(p2CaAnchor).should('have.text',problem2credit3Round.toString())
      cy.get(p2PcaAnchor).should('have.text',problem2percentCredit3Round.toString())
      cy.get(p21CaAnchor).should('have.text',problem21credit3Round.toString())
      cy.get(p21PcaAnchor).should('have.text',problem21percentCredit3Round.toString())
      cy.get(p22CaAnchor).should('have.text',problem22credit3Round.toString())
      cy.get(p22PcaAnchor).should('have.text',problem22percentCredit3Round.toString())
      cy.get(p221CaAnchor).should('have.text',problem221credit3Round.toString())
      cy.get(p221PcaAnchor).should('have.text',problem221percentCredit3Round.toString())
      cy.get(p222CaAnchor).should('have.text','0')
      cy.get(p222PcaAnchor).should('have.text','0')

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_document1'].stateValues.creditAchieved).closeTo(credit3, 1E-12);
        expect(components['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit3, 1E-12);
        expect(components['/problem1'].stateValues.creditAchieved).closeTo(problem1credit3, 1E-12);
        expect(components['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit3, 1E-12);
        expect(components['/problem2'].stateValues.creditAchieved).closeTo(problem2credit3, 1E-12);
        expect(components['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit3, 1E-12);
        expect(components['/problem21'].stateValues.creditAchieved).closeTo(problem21credit3, 1E-12)
        expect(components['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit3, 1E-12);
        expect(components['/problem22'].stateValues.creditAchieved).closeTo(problem22credit3, 1E-12)
        expect(components['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit3, 1E-12);
        expect(components['/problem221'].stateValues.creditAchieved).closeTo(problem221credit3, 1E-12);
        expect(components['/problem221'].stateValues.percentCreditAchieved).closeTo(problem221percentCredit3, 1E-12);;
        expect(components['/problem222'].stateValues.creditAchieved).eq(0);
        expect(components['/problem222'].stateValues.percentCreditAchieved).eq(0);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer9'].stateValues.creditAchieved).eq(0);
      })

      cy.log('enter last correct answer');
      cy.get(mathinput9Anchor).type(`s{enter}`);


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

      cy.get(docCaAnchor).should('have.text',credit4Round.toString())
      cy.get(docPcaAnchor).should('have.text',percentCredit4Round.toString())
      cy.get(p1CaAnchor).should('have.text',problem1credit4Round.toString())
      cy.get(p1PcaAnchor).should('have.text',problem1percentCredit4Round.toString())
      cy.get(p2CaAnchor).should('have.text',problem2credit4Round.toString())
      cy.get(p2PcaAnchor).should('have.text',problem2percentCredit4Round.toString())
      cy.get(p21CaAnchor).should('have.text',problem21credit4Round.toString())
      cy.get(p21PcaAnchor).should('have.text',problem21percentCredit4Round.toString())
      cy.get(p22CaAnchor).should('have.text',problem22credit4Round.toString())
      cy.get(p22PcaAnchor).should('have.text',problem22percentCredit4Round.toString())
      cy.get(p221CaAnchor).should('have.text',problem221credit4Round.toString())
      cy.get(p221PcaAnchor).should('have.text',problem221percentCredit4Round.toString())
      cy.get(p222CaAnchor).should('have.text',problem222credit4Round.toString())
      cy.get(p222PcaAnchor).should('have.text',problem222percentCredit4Round.toString())

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_document1'].stateValues.creditAchieved).closeTo(credit4, 1E-12);
        expect(components['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit4, 1E-12);
        expect(components['/problem1'].stateValues.creditAchieved).closeTo(problem1credit4, 1E-12);
        expect(components['/problem1'].stateValues.percentCreditAchieved).closeTo(problem1percentCredit4, 1E-12);
        expect(components['/problem2'].stateValues.creditAchieved).closeTo(problem2credit4, 1E-12);
        expect(components['/problem2'].stateValues.percentCreditAchieved).closeTo(problem2percentCredit4, 1E-12);
        expect(components['/problem21'].stateValues.creditAchieved).closeTo(problem21credit4, 1E-12)
        expect(components['/problem21'].stateValues.percentCreditAchieved).closeTo(problem21percentCredit4, 1E-12);
        expect(components['/problem22'].stateValues.creditAchieved).closeTo(problem22credit4, 1E-12)
        expect(components['/problem22'].stateValues.percentCreditAchieved).closeTo(problem22percentCredit4, 1E-12);
        expect(components['/problem221'].stateValues.creditAchieved).closeTo(problem221credit4, 1E-12);
        expect(components['/problem221'].stateValues.percentCreditAchieved).closeTo(problem221percentCredit4, 1E-12);;
        expect(components['/problem222'].stateValues.creditAchieved).closeTo(problem222credit4, 1E-12);
        expect(components['/problem222'].stateValues.percentCreditAchieved).closeTo(problem222percentCredit4, 1E-12);;
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer3'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer4'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer5'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer6'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer7'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer8'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer9'].stateValues.creditAchieved).eq(1);
      })
    })
  });

});