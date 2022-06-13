import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Sectioning Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('sections default to not aggregating scores', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Activity</title>
    <p>Credit achieved for <copy prop="title" target="_document1" />:
    <copy name="docCa" prop="creditAchieved" target="_document1" />, or <copy name="docPca" prop="percentCreditAchieved" target="_document1" />%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <section name="section1"><title>Section 1</title>
      <p>Credit achieved for <copy prop="title" target="section1" />:
      <copy name="s1Ca" prop="creditAchieved" target="section1" />, or <copy name="s1Pca" prop="percentCreditAchieved" target="section1" />%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </section>
    <section name="section2"><title>Section 2</title>
      <p>Credit achieved for <copy prop="title" target="section2" />:
      <copy name="s2Ca" prop="creditAchieved" target="section2" />, or <copy name="s2Pca" prop="percentCreditAchieved" target="section2" />%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <subsection name="section21"><title>Section 2.1</title>
        <p>Credit achieved for <copy prop="title" target="section21" />:
        <copy name="s21Ca" prop="creditAchieved" target="section21" />, or <copy name="s21Pca" prop="percentCreditAchieved" target="section21" />%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </subsection>
      <subsection name="section22"><title>Section 2.2</title>
        <p>Credit achieved for <copy prop="title" target="section22" />:
        <copy name="s22Ca" prop="creditAchieved" target="section22" />, or <copy name="s22Pca" prop="percentCreditAchieved" target="section22" />%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <subsubsection name="section221"><title>Section 2.2.1</title>
          <p>Credit achieved for <copy prop="title" target="section221" />:
          <copy name="s221Ca" prop="creditAchieved" target="section221" />, or <copy name="s221Pca" prop="percentCreditAchieved" target="section221" />%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </subsubsection>
        <subsubsection name="section222"><title>Section 2.2.2</title>
          <p>Credit achieved for <copy prop="title" target="section222" />:
          <copy name="s222Ca" prop="creditAchieved" target="section222" />, or <copy name="s222Pca" prop="percentCreditAchieved" target="section222" />%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    `}, "*");
    });


    // to wait for page to load
    cy.get('#\\/_document1_title').should('have.text', 'Activity')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let docCaAnchor = cesc("#" + stateVariables["/docCa"].replacements[0].componentName);
      let docPcaAnchor = cesc("#" + stateVariables["/docPca"].replacements[0].componentName);
      let s1CaAnchor = cesc("#" + stateVariables["/s1Ca"].replacements[0].componentName);
      let s1PcaAnchor = cesc("#" + stateVariables["/s1Pca"].replacements[0].componentName);
      let s2CaAnchor = cesc("#" + stateVariables["/s2Ca"].replacements[0].componentName);
      let s2PcaAnchor = cesc("#" + stateVariables["/s2Pca"].replacements[0].componentName);
      let s21CaAnchor = cesc("#" + stateVariables["/s21Ca"].replacements[0].componentName);
      let s21PcaAnchor = cesc("#" + stateVariables["/s21Pca"].replacements[0].componentName);
      let s22CaAnchor = cesc("#" + stateVariables["/s22Ca"].replacements[0].componentName);
      let s22PcaAnchor = cesc("#" + stateVariables["/s22Pca"].replacements[0].componentName);
      let s221CaAnchor = cesc("#" + stateVariables["/s221Ca"].replacements[0].componentName);
      let s221PcaAnchor = cesc("#" + stateVariables["/s221Pca"].replacements[0].componentName);
      let s222CaAnchor = cesc("#" + stateVariables["/s222Ca"].replacements[0].componentName);
      let s222PcaAnchor = cesc("#" + stateVariables["/s222Pca"].replacements[0].componentName);
      let mathinput1Anchor = cesc('#' + stateVariables['/_answer1'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput2Anchor = cesc('#' + stateVariables['/_answer2'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput3Anchor = cesc('#' + stateVariables['/_answer3'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput4Anchor = cesc('#' + stateVariables['/_answer4'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput5Anchor = cesc('#' + stateVariables['/_answer5'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput6Anchor = cesc('#' + stateVariables['/_answer6'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput7Anchor = cesc('#' + stateVariables['/_answer7'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput8Anchor = cesc('#' + stateVariables['/_answer8'].stateValues.inputChildren[0].componentName) + " textarea";
      let mathinput9Anchor = cesc('#' + stateVariables['/_answer9'].stateValues.inputChildren[0].componentName) + " textarea";

      let weight = [1, 1, 2, 1, 0.5, 1, 1, 1, 3]
      let totWeight = weight.reduce((a, b) => a + b);

      cy.get(docCaAnchor).should('have.text', '0')
      cy.get(docPcaAnchor).should('have.text', '0')
      cy.get(s1CaAnchor).should('have.text', '0')
      cy.get(s1PcaAnchor).should('have.text', '0')
      cy.get(s2CaAnchor).should('have.text', '0')
      cy.get(s2PcaAnchor).should('have.text', '0')
      cy.get(s21CaAnchor).should('have.text', '0')
      cy.get(s21PcaAnchor).should('have.text', '0')
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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

      let credit1 = weight[0] / totWeight;
      let credit1Round = Math.round(10000 * credit1) / 10000;
      let percentCredit1 = credit1 * 100;
      let percentCredit1Round = credit1Round * 100;

      cy.get(docCaAnchor).should('have.text', credit1Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit1Round.toString())
      cy.get(s1CaAnchor).should('have.text', '0')
      cy.get(s1PcaAnchor).should('have.text', '0')
      cy.get(s2CaAnchor).should('have.text', '0')
      cy.get(s2PcaAnchor).should('have.text', '0')
      cy.get(s21CaAnchor).should('have.text', '0')
      cy.get(s21PcaAnchor).should('have.text', '0')
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit1, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit1, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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

      let credit2 = (weight[0] + weight[2] + weight[4] + weight[6]) / totWeight;
      let credit2Round = Math.round(1000 * credit2) / 1000;
      let percentCredit2 = credit2 * 100;
      let percentCredit2Round = credit2Round * 100;

      cy.get(docCaAnchor).should('have.text', credit2Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit2Round.toString())
      cy.get(s1CaAnchor).should('have.text', '0')
      cy.get(s1PcaAnchor).should('have.text', '0')
      cy.get(s2CaAnchor).should('have.text', '0')
      cy.get(s2PcaAnchor).should('have.text', '0')
      cy.get(s21CaAnchor).should('have.text', '0')
      cy.get(s21PcaAnchor).should('have.text', '0')
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit2, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit2, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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

      let credit3 = 1 - weight[8] / totWeight;
      let credit3Round = Math.round(1000 * credit3) / 1000;
      let percentCredit3 = credit3 * 100;
      let percentCredit3Round = credit3Round * 100;

      cy.get(docCaAnchor).should('have.text', credit3Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit3Round.toString())
      cy.get(s1CaAnchor).should('have.text', '0')
      cy.get(s1PcaAnchor).should('have.text', '0')
      cy.get(s2CaAnchor).should('have.text', '0')
      cy.get(s2PcaAnchor).should('have.text', '0')
      cy.get(s21CaAnchor).should('have.text', '0')
      cy.get(s21PcaAnchor).should('have.text', '0')
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit3, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit3, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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

      let credit4 = 1;
      let credit4Round = Math.round(1000 * credit4) / 1000;
      let percentCredit4 = credit4 * 100;
      let percentCredit4Round = credit4Round * 100;

      cy.get(docCaAnchor).should('have.text', credit4Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit4Round.toString())
      cy.get(s1CaAnchor).should('have.text', '0')
      cy.get(s1PcaAnchor).should('have.text', '0')
      cy.get(s2CaAnchor).should('have.text', '0')
      cy.get(s2PcaAnchor).should('have.text', '0')
      cy.get(s21CaAnchor).should('have.text', '0')
      cy.get(s21PcaAnchor).should('have.text', '0')
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit4, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit4, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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

  it('sections aggregating scores default to weight 1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Activity</title>
    <p>Credit achieved for <copy prop="title" target="_document1" />:
    <copy name="docCa" prop="creditAchieved" target="_document1" />, or <copy name="docPca" prop="percentCreditAchieved" target="_document1" />%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <section name="section1" aggregatescores><title>Section 1</title>
      <p>Credit achieved for <copy prop="title" target="section1" />:
      <copy name="s1Ca" prop="creditAchieved" target="section1" />, or <copy name="s1Pca" prop="percentCreditAchieved" target="section1" />%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </section>
    <section name="section2" aggregatescores><title>Section 2</title>
      <p>Credit achieved for <copy prop="title" target="section2" />:
      <copy name="s2Ca" prop="creditAchieved" target="section2" />, or <copy name="s2Pca" prop="percentCreditAchieved" target="section2" />%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <subsection name="section21" aggregatescores><title>Section 2.1</title>
        <p>Credit achieved for <copy prop="title" target="section21" />:
        <copy name="s21Ca" prop="creditAchieved" target="section21" />, or <copy name="s21Pca" prop="percentCreditAchieved" target="section21" />%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </subsection>
      <subsection name="section22"><title>Section 2.2</title>
        <p>Credit achieved for <copy prop="title" target="section22" />:
        <copy name="s22Ca" prop="creditAchieved" target="section22" />, or <copy name="s22Pca" prop="percentCreditAchieved" target="section22" />%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <subsubsection name="section221" aggregatescores><title>Section 2.2.1</title>
          <p>Credit achieved for <copy prop="title" target="section221" />:
          <copy name="s221Ca" prop="creditAchieved" target="section221" />, or <copy name="s221Pca" prop="percentCreditAchieved" target="section221" />%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </subsubsection>
        <subsubsection name="section222" aggregatescores><title>Section 2.2.2</title>
          <p>Credit achieved for <copy prop="title" target="section222" />:
          <copy name="s222Ca" prop="creditAchieved" target="section222" />, or <copy name="s222Pca" prop="percentCreditAchieved" target="section222" />%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    `}, "*");
    });


    // to wait for page to load
    cy.get('#\\/_document1_title').should('have.text', 'Activity')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let docCaAnchor = cesc("#" + stateVariables["/docCa"].replacements[0].componentName);
      let docPcaAnchor = cesc("#" + stateVariables["/docPca"].replacements[0].componentName);
      let s1CaAnchor = cesc("#" + stateVariables["/s1Ca"].replacements[0].componentName);
      let s1PcaAnchor = cesc("#" + stateVariables["/s1Pca"].replacements[0].componentName);
      let s2CaAnchor = cesc("#" + stateVariables["/s2Ca"].replacements[0].componentName);
      let s2PcaAnchor = cesc("#" + stateVariables["/s2Pca"].replacements[0].componentName);
      let s21CaAnchor = cesc("#" + stateVariables["/s21Ca"].replacements[0].componentName);
      let s21PcaAnchor = cesc("#" + stateVariables["/s21Pca"].replacements[0].componentName);
      let s22CaAnchor = cesc("#" + stateVariables["/s22Ca"].replacements[0].componentName);
      let s22PcaAnchor = cesc("#" + stateVariables["/s22Pca"].replacements[0].componentName);
      let s221CaAnchor = cesc("#" + stateVariables["/s221Ca"].replacements[0].componentName);
      let s221PcaAnchor = cesc("#" + stateVariables["/s221Pca"].replacements[0].componentName);
      let s222CaAnchor = cesc("#" + stateVariables["/s222Ca"].replacements[0].componentName);
      let s222PcaAnchor = cesc("#" + stateVariables["/s222Pca"].replacements[0].componentName);
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
      cy.get(s1CaAnchor).should('have.text', '0')
      cy.get(s1PcaAnchor).should('have.text', '0')
      cy.get(s2CaAnchor).should('have.text', '0')
      cy.get(s2PcaAnchor).should('have.text', '0')
      cy.get(s21CaAnchor).should('have.text', '0')
      cy.get(s21PcaAnchor).should('have.text', '0')
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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
      cy.get(s1CaAnchor).should('have.text', '0')
      cy.get(s1PcaAnchor).should('have.text', '0')
      cy.get(s2CaAnchor).should('have.text', '0')
      cy.get(s2PcaAnchor).should('have.text', '0')
      cy.get(s21CaAnchor).should('have.text', '0')
      cy.get(s21PcaAnchor).should('have.text', '0')
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit1, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit1, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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

      let section1credit2 = 2 / 3;
      let section1credit2Round = Math.round(1000 * section1credit2) / 1000;
      let section1percentCredit2 = section1credit2 * 100;
      let section1percentCredit2Round = Math.round(10 * section1percentCredit2) / 10;

      let section21credit2 = 1 / 3;
      let section21credit2Round = Math.round(1000 * section21credit2) / 1000;
      let section21percentCredit2 = section21credit2 * 100;
      let section21percentCredit2Round = Math.round(10 * section21percentCredit2) / 10;

      let section2credit2 = (section21credit2 + 1) / 5
      let section2credit2Round = Math.round(1000 * section2credit2) / 1000;
      let section2percentCredit2 = section2credit2 * 100;
      let section2percentCredit2Round = Math.round(10 * section2percentCredit2) / 10;;

      let credit2 = (1 + section1credit2 + section2credit2) / 3;
      let credit2Round = Math.round(1000 * credit2) / 1000;
      let percentCredit2 = credit2 * 100;
      let percentCredit2Round = Math.round(10 * percentCredit2) / 10;

      cy.get(docCaAnchor).should('have.text', credit2Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit2Round.toString())
      cy.get(s1CaAnchor).should('have.text', section1credit2Round.toString())
      cy.get(s1PcaAnchor).should('have.text', section1percentCredit2Round.toString())
      cy.get(s2CaAnchor).should('have.text', section2credit2Round.toString())
      cy.get(s2PcaAnchor).should('have.text', section2percentCredit2Round.toString())
      cy.get(s21CaAnchor).should('have.text', section21credit2Round.toString())
      cy.get(s21PcaAnchor).should('have.text', section21percentCredit2Round.toString())
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit2, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit2, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).closeTo(section1credit2, 1E-12);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).closeTo(section1percentCredit2, 1E-12);
        expect(stateVariables['/section2'].stateValues.creditAchieved).closeTo(section2credit2, 1E-12);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).closeTo(section2percentCredit2, 1E-12);
        expect(stateVariables['/section21'].stateValues.creditAchieved).closeTo(section21credit2, 1E-12)
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).closeTo(section21percentCredit2, 1E-12);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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


      let section1credit3 = 1;
      let section1credit3Round = Math.round(1000 * section1credit3) / 1000;
      let section1percentCredit3 = section1credit3 * 100;
      let section1percentCredit3Round = Math.round(10 * section1percentCredit3) / 10;

      let section221credit3 = 1;
      let section221credit3Round = Math.round(1000 * section221credit3) / 1000;
      let section221percentCredit3 = section221credit3 * 100;
      let section221percentCredit3Round = Math.round(10 * section221percentCredit3) / 10;

      let section21credit3 = 1;
      let section21credit3Round = Math.round(1000 * section21credit3) / 1000;
      let section21percentCredit3 = section21credit3 * 100;
      let section21percentCredit3Round = Math.round(10 * section21percentCredit3) / 10;

      let section2credit3 = (section21credit3 + 3) / 5
      let section2credit3Round = Math.round(1000 * section2credit3) / 1000;
      let section2percentCredit3 = section2credit3 * 100;
      let section2percentCredit3Round = Math.round(10 * section2percentCredit3) / 10;;

      let credit3 = (1 + section1credit3 + section2credit3) / 3;
      let credit3Round = Math.round(1000 * credit3) / 1000;
      let percentCredit3 = credit3 * 100;
      let percentCredit3Round = Math.round(10 * percentCredit3) / 10;

      cy.get(docCaAnchor).should('have.text', credit3Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit3Round.toString())
      cy.get(s1CaAnchor).should('have.text', section1credit3Round.toString())
      cy.get(s1PcaAnchor).should('have.text', section1percentCredit3Round.toString())
      cy.get(s2CaAnchor).should('have.text', section2credit3Round.toString())
      cy.get(s2PcaAnchor).should('have.text', section2percentCredit3Round.toString())
      cy.get(s21CaAnchor).should('have.text', section21credit3Round.toString())
      cy.get(s21PcaAnchor).should('have.text', section21percentCredit3Round.toString())
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', section221credit3Round.toString())
      cy.get(s221PcaAnchor).should('have.text', section221percentCredit3Round.toString())
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit3, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit3, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).closeTo(section1credit3, 1E-12);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).closeTo(section1percentCredit3, 1E-12);
        expect(stateVariables['/section2'].stateValues.creditAchieved).closeTo(section2credit3, 1E-12);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).closeTo(section2percentCredit3, 1E-12);
        expect(stateVariables['/section21'].stateValues.creditAchieved).closeTo(section21credit3, 1E-12)
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).closeTo(section21percentCredit3, 1E-12);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).closeTo(section221credit3, 1E-12);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).closeTo(section221percentCredit3, 1E-12);;
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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


      let section1credit4 = 1;
      let section1credit4Round = Math.round(1000 * section1credit4) / 1000;
      let section1percentCredit4 = section1credit4 * 100;
      let section1percentCredit4Round = Math.round(10 * section1percentCredit4) / 10;

      let section221credit4 = 1;
      let section221credit4Round = Math.round(1000 * section221credit4) / 1000;
      let section221percentCredit4 = section221credit4 * 100;
      let section221percentCredit4Round = Math.round(10 * section221percentCredit4) / 10;

      let section222credit4 = 1;
      let section222credit4Round = Math.round(1000 * section222credit4) / 1000;
      let section222percentCredit4 = section222credit4 * 100;
      let section222percentCredit4Round = Math.round(10 * section222percentCredit4) / 10;

      let section21credit4 = 1;
      let section21credit4Round = Math.round(1000 * section21credit4) / 1000;
      let section21percentCredit4 = section21credit4 * 100;
      let section21percentCredit4Round = Math.round(10 * section21percentCredit4) / 10;

      let section2credit4 = 1;
      let section2credit4Round = Math.round(1000 * section2credit4) / 1000;
      let section2percentCredit4 = section2credit4 * 100;
      let section2percentCredit4Round = Math.round(10 * section2percentCredit4) / 10;;

      let credit4 = (1 + section1credit4 + section2credit4) / 3;
      let credit4Round = Math.round(1000 * credit4) / 1000;
      let percentCredit4 = credit4 * 100;
      let percentCredit4Round = Math.round(10 * percentCredit4) / 10;

      cy.get(docCaAnchor).should('have.text', credit4Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit4Round.toString())
      cy.get(s1CaAnchor).should('have.text', section1credit4Round.toString())
      cy.get(s1PcaAnchor).should('have.text', section1percentCredit4Round.toString())
      cy.get(s2CaAnchor).should('have.text', section2credit4Round.toString())
      cy.get(s2PcaAnchor).should('have.text', section2percentCredit4Round.toString())
      cy.get(s21CaAnchor).should('have.text', section21credit4Round.toString())
      cy.get(s21PcaAnchor).should('have.text', section21percentCredit4Round.toString())
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', section221credit4Round.toString())
      cy.get(s221PcaAnchor).should('have.text', section221percentCredit4Round.toString())
      cy.get(s222CaAnchor).should('have.text', section222credit4Round.toString())
      cy.get(s222PcaAnchor).should('have.text', section222percentCredit4Round.toString())

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit4, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit4, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).closeTo(section1credit4, 1E-12);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).closeTo(section1percentCredit4, 1E-12);
        expect(stateVariables['/section2'].stateValues.creditAchieved).closeTo(section2credit4, 1E-12);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).closeTo(section2percentCredit4, 1E-12);
        expect(stateVariables['/section21'].stateValues.creditAchieved).closeTo(section21credit4, 1E-12)
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).closeTo(section21percentCredit4, 1E-12);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).closeTo(section221credit4, 1E-12);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).closeTo(section221percentCredit4, 1E-12);;
        expect(stateVariables['/section222'].stateValues.creditAchieved).closeTo(section222credit4, 1E-12);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).closeTo(section222percentCredit4, 1E-12);;
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

  it('sections aggregating scores, with weights', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <title>Activity</title>
    <p>Credit achieved for <copy prop="title" target="_document1" />:
    <copy name="docCa" prop="creditAchieved" target="_document1" />, or <copy name="docPca" prop="percentCreditAchieved" target="_document1" />%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <section name="section1" aggregatescores weight="0.5"><title>Section 1</title>
      <p>Credit achieved for <copy prop="title" target="section1" />:
      <copy name="s1Ca" prop="creditAchieved" target="section1" />, or <copy name="s1Pca" prop="percentCreditAchieved" target="section1" />%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </section>
    <section name="section2" aggregatescores weight="2"><title>Section 2</title>
      <p>Credit achieved for <copy prop="title" target="section2" />:
      <copy name="s2Ca" prop="creditAchieved" target="section2" />, or <copy name="s2Pca" prop="percentCreditAchieved" target="section2" />%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <subsection name="section21" aggregatescores weight="3"><title>Section 2.1</title>
        <p>Credit achieved for <copy prop="title" target="section21" />:
        <copy name="s21Ca" prop="creditAchieved" target="section21" />, or <copy name="s21Pca" prop="percentCreditAchieved" target="section21" />%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </subsection>
      <subsection name="section22" aggregatescores weight="4"><title>Section 2.2</title>
        <p>Credit achieved for <copy prop="title" target="section22" />:
        <copy name="s22Ca" prop="creditAchieved" target="section22" />, or <copy name="s22Pca" prop="percentCreditAchieved" target="section22" />%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <subsubsection name="section221" aggregatescores weight="5"><title>Section 2.2.1</title>
          <p>Credit achieved for <copy prop="title" target="section221" />:
          <copy name="s221Ca" prop="creditAchieved" target="section221" />, or <copy name="s221Pca" prop="percentCreditAchieved" target="section221" />%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </subsubsection>
        <subsubsection name="section222" aggregatescores weight="1"><title>Section 2.2.2</title>
          <p>Credit achieved for <copy prop="title" target="section222" />:
          <copy name="s222Ca" prop="creditAchieved" target="section222" />, or <copy name="s222Pca" prop="percentCreditAchieved" target="section222" />%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    `}, "*");
    });


    // to wait for page to load
    cy.get('#\\/_document1_title').should('have.text', 'Activity')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let docCaAnchor = cesc("#" + stateVariables["/docCa"].replacements[0].componentName);
      let docPcaAnchor = cesc("#" + stateVariables["/docPca"].replacements[0].componentName);
      let s1CaAnchor = cesc("#" + stateVariables["/s1Ca"].replacements[0].componentName);
      let s1PcaAnchor = cesc("#" + stateVariables["/s1Pca"].replacements[0].componentName);
      let s2CaAnchor = cesc("#" + stateVariables["/s2Ca"].replacements[0].componentName);
      let s2PcaAnchor = cesc("#" + stateVariables["/s2Pca"].replacements[0].componentName);
      let s21CaAnchor = cesc("#" + stateVariables["/s21Ca"].replacements[0].componentName);
      let s21PcaAnchor = cesc("#" + stateVariables["/s21Pca"].replacements[0].componentName);
      let s22CaAnchor = cesc("#" + stateVariables["/s22Ca"].replacements[0].componentName);
      let s22PcaAnchor = cesc("#" + stateVariables["/s22Pca"].replacements[0].componentName);
      let s221CaAnchor = cesc("#" + stateVariables["/s221Ca"].replacements[0].componentName);
      let s221PcaAnchor = cesc("#" + stateVariables["/s221Pca"].replacements[0].componentName);
      let s222CaAnchor = cesc("#" + stateVariables["/s222Ca"].replacements[0].componentName);
      let s222PcaAnchor = cesc("#" + stateVariables["/s222Pca"].replacements[0].componentName);
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
      cy.get(s1CaAnchor).should('have.text', '0')
      cy.get(s1PcaAnchor).should('have.text', '0')
      cy.get(s2CaAnchor).should('have.text', '0')
      cy.get(s2PcaAnchor).should('have.text', '0')
      cy.get(s21CaAnchor).should('have.text', '0')
      cy.get(s21PcaAnchor).should('have.text', '0')
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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
      cy.get(s1CaAnchor).should('have.text', '0')
      cy.get(s1PcaAnchor).should('have.text', '0')
      cy.get(s2CaAnchor).should('have.text', '0')
      cy.get(s2PcaAnchor).should('have.text', '0')
      cy.get(s21CaAnchor).should('have.text', '0')
      cy.get(s21PcaAnchor).should('have.text', '0')
      cy.get(s22CaAnchor).should('have.text', '0')
      cy.get(s22PcaAnchor).should('have.text', '0')
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit1, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit1, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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

      let section1credit2 = 2 / 3;
      let section1credit2Round = Math.round(1000 * section1credit2) / 1000;
      let section1percentCredit2 = section1credit2 * 100;
      let section1percentCredit2Round = Math.round(10 * section1percentCredit2) / 10;

      let section21credit2 = 1 / 3;
      let section21credit2Round = Math.round(1000 * section21credit2) / 1000;
      let section21percentCredit2 = section21credit2 * 100;
      let section21percentCredit2Round = Math.round(10 * section21percentCredit2) / 10;

      let section22credit2 = 1 / 7;
      let section22credit2Round = Math.round(1000 * section22credit2) / 1000;
      let section22percentCredit2 = section22credit2 * 100;
      let section22percentCredit2Round = Math.round(10 * section22percentCredit2) / 10;

      let section2credit2 = (3 * section21credit2 + 4 * section22credit2) / 8
      let section2credit2Round = Math.round(1000 * section2credit2) / 1000;
      let section2percentCredit2 = section2credit2 * 100;
      let section2percentCredit2Round = Math.round(10 * section2percentCredit2) / 10;;

      let credit2 = (1 + 0.5 * section1credit2 + 2 * section2credit2) / 3.5;
      let credit2Round = Math.round(1000 * credit2) / 1000;
      let percentCredit2 = credit2 * 100;
      let percentCredit2Round = Math.round(10 * percentCredit2) / 10;

      cy.get(docCaAnchor).should('have.text', credit2Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit2Round.toString())
      cy.get(s1CaAnchor).should('have.text', section1credit2Round.toString())
      cy.get(s1PcaAnchor).should('have.text', section1percentCredit2Round.toString())
      cy.get(s2CaAnchor).should('have.text', section2credit2Round.toString())
      cy.get(s2PcaAnchor).should('have.text', section2percentCredit2Round.toString())
      cy.get(s21CaAnchor).should('have.text', section21credit2Round.toString())
      cy.get(s21PcaAnchor).should('have.text', section21percentCredit2Round.toString())
      cy.get(s22CaAnchor).should('have.text', section22credit2Round.toString())
      cy.get(s22PcaAnchor).should('have.text', section22percentCredit2Round.toString())
      cy.get(s221CaAnchor).should('have.text', '0')
      cy.get(s221PcaAnchor).should('have.text', '0')
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit2, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit2, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).closeTo(section1credit2, 1E-12);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).closeTo(section1percentCredit2, 1E-12);
        expect(stateVariables['/section2'].stateValues.creditAchieved).closeTo(section2credit2, 1E-12);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).closeTo(section2percentCredit2, 1E-12);
        expect(stateVariables['/section21'].stateValues.creditAchieved).closeTo(section21credit2, 1E-12)
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).closeTo(section21percentCredit2, 1E-12);
        expect(stateVariables['/section22'].stateValues.creditAchieved).closeTo(section22credit2, 1E-12)
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).closeTo(section22percentCredit2, 1E-12);
        expect(stateVariables['/section221'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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


      let section1credit3 = 1;
      let section1credit3Round = Math.round(1000 * section1credit3) / 1000;
      let section1percentCredit3 = section1credit3 * 100;
      let section1percentCredit3Round = Math.round(10 * section1percentCredit3) / 10;

      let section21credit3 = 1;
      let section21credit3Round = Math.round(1000 * section21credit3) / 1000;
      let section21percentCredit3 = section21credit3 * 100;
      let section21percentCredit3Round = Math.round(10 * section21percentCredit3) / 10;

      let section221credit3 = 1;
      let section221credit3Round = Math.round(1000 * section221credit3) / 1000;
      let section221percentCredit3 = section221credit3 * 100;
      let section221percentCredit3Round = Math.round(10 * section221percentCredit3) / 10;

      let section22credit3 = 6 / 7;
      let section22credit3Round = Math.round(1000 * section22credit3) / 1000;
      let section22percentCredit3 = section22credit3 * 100;
      let section22percentCredit3Round = Math.round(10 * section22percentCredit3) / 10;

      let section2credit3 = (1 + 3 * section21credit3 + 4 * section22credit3) / 8
      let section2credit3Round = Math.round(1000 * section2credit3) / 1000;
      let section2percentCredit3 = section2credit3 * 100;
      let section2percentCredit3Round = Math.round(10 * section2percentCredit3) / 10;;

      let credit3 = (1 + 0.5 * section1credit3 + 2 * section2credit3) / 3.5;
      let credit3Round = Math.round(1000 * credit3) / 1000;
      let percentCredit3 = credit3 * 100;
      let percentCredit3Round = Math.round(10 * percentCredit3) / 10;

      cy.get(docCaAnchor).should('have.text', credit3Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit3Round.toString())
      cy.get(s1CaAnchor).should('have.text', section1credit3Round.toString())
      cy.get(s1PcaAnchor).should('have.text', section1percentCredit3Round.toString())
      cy.get(s2CaAnchor).should('have.text', section2credit3Round.toString())
      cy.get(s2PcaAnchor).should('have.text', section2percentCredit3Round.toString())
      cy.get(s21CaAnchor).should('have.text', section21credit3Round.toString())
      cy.get(s21PcaAnchor).should('have.text', section21percentCredit3Round.toString())
      cy.get(s22CaAnchor).should('have.text', section22credit3Round.toString())
      cy.get(s22PcaAnchor).should('have.text', section22percentCredit3Round.toString())
      cy.get(s221CaAnchor).should('have.text', section221credit3Round.toString())
      cy.get(s221PcaAnchor).should('have.text', section221percentCredit3Round.toString())
      cy.get(s222CaAnchor).should('have.text', '0')
      cy.get(s222PcaAnchor).should('have.text', '0')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit3, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit3, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).closeTo(section1credit3, 1E-12);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).closeTo(section1percentCredit3, 1E-12);
        expect(stateVariables['/section2'].stateValues.creditAchieved).closeTo(section2credit3, 1E-12);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).closeTo(section2percentCredit3, 1E-12);
        expect(stateVariables['/section21'].stateValues.creditAchieved).closeTo(section21credit3, 1E-12)
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).closeTo(section21percentCredit3, 1E-12);
        expect(stateVariables['/section22'].stateValues.creditAchieved).closeTo(section22credit3, 1E-12)
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).closeTo(section22percentCredit3, 1E-12);
        expect(stateVariables['/section221'].stateValues.creditAchieved).closeTo(section221credit3, 1E-12);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).closeTo(section221percentCredit3, 1E-12);;
        expect(stateVariables['/section222'].stateValues.creditAchieved).eq(0);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).eq(0);
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


      let section1credit4 = 1;
      let section1credit4Round = Math.round(1000 * section1credit4) / 1000;
      let section1percentCredit4 = section1credit4 * 100;
      let section1percentCredit4Round = Math.round(10 * section1percentCredit4) / 10;

      let section21credit4 = 1;
      let section21credit4Round = Math.round(1000 * section21credit4) / 1000;
      let section21percentCredit4 = section21credit4 * 100;
      let section21percentCredit4Round = Math.round(10 * section21percentCredit4) / 10;

      let section221credit4 = 1;
      let section221credit4Round = Math.round(1000 * section221credit4) / 1000;
      let section221percentCredit4 = section221credit4 * 100;
      let section221percentCredit4Round = Math.round(10 * section221percentCredit4) / 10;

      let section222credit4 = 1;
      let section222credit4Round = Math.round(1000 * section222credit4) / 1000;
      let section222percentCredit4 = section222credit4 * 100;
      let section222percentCredit4Round = Math.round(10 * section222percentCredit4) / 10;

      let section22credit4 = 1;
      let section22credit4Round = Math.round(1000 * section22credit4) / 1000;
      let section22percentCredit4 = section22credit4 * 100;
      let section22percentCredit4Round = Math.round(10 * section22percentCredit4) / 10;

      let section2credit4 = 1;
      let section2credit4Round = Math.round(1000 * section2credit4) / 1000;
      let section2percentCredit4 = section2credit4 * 100;
      let section2percentCredit4Round = Math.round(10 * section2percentCredit4) / 10;;

      let credit4 = (1 + section1credit4 + section2credit4) / 3;
      let credit4Round = Math.round(1000 * credit4) / 1000;
      let percentCredit4 = credit4 * 100;
      let percentCredit4Round = Math.round(10 * percentCredit4) / 10;

      cy.get(docCaAnchor).should('have.text', credit4Round.toString())
      cy.get(docPcaAnchor).should('have.text', percentCredit4Round.toString())
      cy.get(s1CaAnchor).should('have.text', section1credit4Round.toString())
      cy.get(s1PcaAnchor).should('have.text', section1percentCredit4Round.toString())
      cy.get(s2CaAnchor).should('have.text', section2credit4Round.toString())
      cy.get(s2PcaAnchor).should('have.text', section2percentCredit4Round.toString())
      cy.get(s21CaAnchor).should('have.text', section21credit4Round.toString())
      cy.get(s21PcaAnchor).should('have.text', section21percentCredit4Round.toString())
      cy.get(s22CaAnchor).should('have.text', section22credit4Round.toString())
      cy.get(s22PcaAnchor).should('have.text', section22percentCredit4Round.toString())
      cy.get(s221CaAnchor).should('have.text', section221credit4Round.toString())
      cy.get(s221PcaAnchor).should('have.text', section221percentCredit4Round.toString())
      cy.get(s222CaAnchor).should('have.text', section222credit4Round.toString())
      cy.get(s222PcaAnchor).should('have.text', section222percentCredit4Round.toString())

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_document1'].stateValues.creditAchieved).closeTo(credit4, 1E-12);
        expect(stateVariables['/_document1'].stateValues.percentCreditAchieved).closeTo(percentCredit4, 1E-12);
        expect(stateVariables['/section1'].stateValues.creditAchieved).closeTo(section1credit4, 1E-12);
        expect(stateVariables['/section1'].stateValues.percentCreditAchieved).closeTo(section1percentCredit4, 1E-12);
        expect(stateVariables['/section2'].stateValues.creditAchieved).closeTo(section2credit4, 1E-12);
        expect(stateVariables['/section2'].stateValues.percentCreditAchieved).closeTo(section2percentCredit4, 1E-12);
        expect(stateVariables['/section21'].stateValues.creditAchieved).closeTo(section21credit4, 1E-12)
        expect(stateVariables['/section21'].stateValues.percentCreditAchieved).closeTo(section21percentCredit4, 1E-12);
        expect(stateVariables['/section22'].stateValues.creditAchieved).closeTo(section22credit4, 1E-12)
        expect(stateVariables['/section22'].stateValues.percentCreditAchieved).closeTo(section22percentCredit4, 1E-12);
        expect(stateVariables['/section221'].stateValues.creditAchieved).closeTo(section221credit4, 1E-12);
        expect(stateVariables['/section221'].stateValues.percentCreditAchieved).closeTo(section221percentCredit4, 1E-12);;
        expect(stateVariables['/section222'].stateValues.creditAchieved).closeTo(section222credit4, 1E-12);
        expect(stateVariables['/section222'].stateValues.percentCreditAchieved).closeTo(section222percentCredit4, 1E-12);;
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

  it('paragraphs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <paragraphs><title>Some paragraphs</title>

    <p>Paragraph 1</p>
    <p>Paragraph 2</p>

    </paragraphs>
    
    `}, "*");
    });

    cy.get('#\\/_paragraphs1_title').should('have.text', 'Some paragraphs');

    cy.get('#\\/_paragraphs1 p:first-of-type').should('have.text', 'Paragraph 1');
    cy.get('#\\/_paragraphs1 p:last-of-type').should('have.text', 'Paragraph 2');

  });

  it('prefill mathinput in aside', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aside name="aside1">
      <title>Starting closed</title>
      <p>An expression: <mathinput name="expr1" prefill="(x+1)(x^2-1)" /></p>
      <p>The value of the expression is <copy prop="value" target="expr1" assignNames="expr1a" /></p>
    </aside>
    <aside name="aside2" startOpen>
      <title>Starting open</title>
      <p>An expression: <mathinput name="expr2" prefill="(x-1)(x^2+1)" /></p>
      <p>The value of the expression is <copy prop="value" target="expr2" assignNames="expr2a" /></p>
    </aside>
  
    <p>The first expression is <copy prop="value" target="expr1" assignNames="expr1b" /></p>
    <p>The second expression is <copy prop="value" target="expr2" assignNames="expr2b" /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/expr1b .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x+1)(x2−1)");
    })
    cy.get('#\\/expr2b .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x−1)(x2+1)");
    })
    cy.get('#\\/expr1a').should('not.exist')
    cy.get('#\\/expr2a .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x−1)(x2+1)");
    })

    cy.get('#\\/expr1').should('not.exist')
    cy.get('#\\/expr2 .mq-editable-field').invoke('text').then(text => {
      expect(text.trim()).eq("(x−1)(x2+1)");
    })

    cy.get('#\\/aside1_title').click();

    cy.get('#\\/expr1a .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x+1)(x2−1)");
    })
    cy.get('#\\/expr1 .mq-editable-field').invoke('text').then(text => {
      expect(text.trim()).eq("(x+1)(x2−1)");
    })

    cy.get('#\\/aside2_title').click();
    cy.get('#\\/expr2a').should('not.exist')
    cy.get('#\\/expr2').should('not.exist')

    cy.get('#\\/expr1b .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x+1)(x2−1)");
    })
    cy.get('#\\/expr2b .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x−1)(x2+1)");
    })

    cy.get('#\\/expr1 textarea').type("{end}{leftArrow}{backspace}4{enter}", { force: true }).blur()


    cy.get('#\\/expr1a').should('contain.text', "(x+1)(x2−4)")
    cy.get('#\\/expr1a .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x+1)(x2−4)");
    })
    cy.get('#\\/expr1 .mq-editable-field').invoke('text').then(text => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).eq("(x+1)(x2−4)");
    })

    cy.get('#\\/expr1b .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x+1)(x2−4)");
    })
    cy.get('#\\/expr2b .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x−1)(x2+1)");
    })

    cy.get('#\\/aside1_title').click();
    cy.get('#\\/expr1a').should('not.exist')
    cy.get('#\\/expr1').should('not.exist')

    cy.get('#\\/expr1b .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x+1)(x2−4)");
    })
    cy.get('#\\/expr2b .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x−1)(x2+1)");
    })

    cy.get('#\\/aside2_title').click();

    cy.get('#\\/expr2a .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x−1)(x2+1)");
    })
    cy.get('#\\/expr2 .mq-editable-field').invoke('text').then(text => {
      expect(text.trim()).eq("(x−1)(x2+1)");
    })

    cy.get('#\\/expr2 textarea').type("{end}{leftArrow}{backspace}4{enter}", { force: true }).blur()

    cy.get('#\\/expr2a .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x−1)(x2+4)");
    })
    cy.get('#\\/expr2 .mq-editable-field').invoke('text').then(text => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).eq("(x−1)(x2+4)");
    })

    cy.get('#\\/expr1b .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x+1)(x2−4)");
    })
    cy.get('#\\/expr2b .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text.trim()).eq("(x−1)(x2+4)");
    })

  });




});