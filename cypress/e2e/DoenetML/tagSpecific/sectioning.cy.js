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
    cy.visit('/src/Tools/cypressTest/')

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

  it('copy and overwrite title', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <section includeAutoName includeAutoNumber name="sec">
        <title>A title</title>
        <p>Hello</p>
      </section>
    
      <section includeAutoName includeAutoNumber name="revised" copySource="sec">
        <title>A better title</title>
        <p>Good day!</p>
      </section>

      <p>Copy of original title: <text copySource="sec.title" name="title1" /></p>
      <p>Copy of revised title: <text copySource="revised.title" name="title2" /></p>
      <p>Original section number: <text copySource="sec.sectionNumber" name="sectionNumber1" /></p>
      <p>Revised section number: <text copySource="revised.sectionNumber" name="sectionNumber2" /></p>
   
    `}, "*");
    });

    cy.get('#\\/sec_title').should('have.text', 'Section 1: A title');
    cy.get('#\\/revised_title').should('have.text', 'Section 2: A better title');
    cy.get('#\\/title1').should('have.text', 'A title');
    cy.get('#\\/title2').should('have.text', 'A better title');
    cy.get('#\\/sectionNumber1').should('have.text', '1');
    cy.get('#\\/sectionNumber2').should('have.text', '2');

    cy.get('#\\/_p1').should('have.text', 'Hello');
    cy.get('#\\/revised p:first-of-type').should('have.text', 'Hello');
    cy.get('#\\/_p2').should('have.text', 'Good day!');

  });

  it('copy and overwrite title, newNamespaces', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <section includeAutoName includeAutoNumber name="sec" newNamespace>
        <title>A title</title>
        <p>Hello</p>
      </section>
    
      <section includeAutoName includeAutoNumber name="revised" copySource="sec" newNamespace>
        <title>A better title</title>
        <p>Good day!</p>
      </section>

      <p>Copy of original title: <text copySource="sec.title" name="title1" /></p>
      <p>Copy of revised title: <text copySource="revised.title" name="title2" /></p>
      <p>Original section number: <text copySource="sec.sectionNumber" name="sectionNumber1" /></p>
      <p>Revised section number: <text copySource="revised.sectionNumber" name="sectionNumber2" /></p>
    
    `}, "*");
    });

    cy.get('#\\/sec_title').should('have.text', 'Section 1: A title');
    cy.get('#\\/revised_title').should('have.text', 'Section 2: A better title');
    cy.get('#\\/sec\\/_title1').should('have.text', 'A title');
    cy.get('#\\/revised\\/_title').should('not.exist');
    cy.get('#\\/revised\\/_title2').should('have.text', 'A better title');
    cy.get('#\\/title1').should('have.text', 'A title');
    cy.get('#\\/title2').should('have.text', 'A better title');
    cy.get('#\\/sectionNumber1').should('have.text', '1');
    cy.get('#\\/sectionNumber2').should('have.text', '2');

    cy.get('#\\/sec\\/_p1').should('have.text', 'Hello');
    cy.get('#\\/revised\\/_p1').should('have.text', 'Hello');
    cy.get('#\\/revised\\/_p2').should('have.text', 'Good day!');

  });

  it('Auto naming of section titles', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <section name="sec1">
        <p><lorem generateSentences="1" /></p>
      </section>
      <section name="sec2">
        <p><lorem generateSentences="1" /></p>

        <section name="sec21">
          <p><lorem generateSentences="1" /></p>
        </section>
        <section name="sec22">
          <p><lorem generateSentences="1" /></p>
          <section name="sec221">
            <p><lorem generateSentences="1" /></p>
          </section>
          <section name="sec222">
            <p><lorem generateSentences="1" /></p>
          </section>
          <section name="sec223">
            <p><lorem generateSentences="1" /></p>

            <section name="sec2231">
              <p><lorem generateSentences="1" /></p>
            </section>
          </section>

        </section>

        <section name="sec23">
          <p><lorem generateSentences="1" /></p>
        </section>
      </section>

      <p>Title 1: <text name="title1" copySource="sec1.title" /></p>
      <p>Title 2: <text name="title2" copySource="sec2.title" /></p>
      <p>Title 2.1: <text name="title21" copySource="sec21.title" /></p>
      <p>Title 2.2: <text name="title22" copySource="sec22.title" /></p>
      <p>Title 2.2.1: <text name="title221" copySource="sec221.title" /></p>
      <p>Title 2.2.2: <text name="title222" copySource="sec222.title" /></p>
      <p>Title 2.2.3: <text name="title223" copySource="sec223.title" /></p>
      <p>Title 2.2.3.1: <text name="title2231" copySource="sec2231.title" /></p>
      <p>Title 2.3: <text name="title23" copySource="sec23.title" /></p>

      <p>Number for 1: <text name="sectionNumber1" copySource="sec1.sectionNumber" /></p>
      <p>Number for 2: <text name="sectionNumber2" copySource="sec2.sectionNumber" /></p>
      <p>Number for 2.1: <text name="sectionNumber21" copySource="sec21.sectionNumber" /></p>
      <p>Number for 2.2: <text name="sectionNumber22" copySource="sec22.sectionNumber" /></p>
      <p>Number for 2.2.1: <text name="sectionNumber221" copySource="sec221.sectionNumber" /></p>
      <p>Number for 2.2.2: <text name="sectionNumber222" copySource="sec222.sectionNumber" /></p>
      <p>Number for 2.2.3: <text name="sectionNumber223" copySource="sec223.sectionNumber" /></p>
      <p>Number for 2.2.3.1: <text name="sectionNumber2231" copySource="sec2231.sectionNumber" /></p>
      <p>Number for 2.3: <text name="sectionNumber23" copySource="sec23.sectionNumber" /></p>

    `}, "*");
    });

    cy.get('#\\/sec1_title').should('have.text', 'Section 1');
    cy.get('#\\/sec2_title').should('have.text', 'Section 2');
    cy.get('#\\/sec21_title').should('have.text', 'Section 2.1');
    cy.get('#\\/sec22_title').should('have.text', 'Section 2.2');
    cy.get('#\\/sec221_title').should('have.text', 'Section 2.2.1');
    cy.get('#\\/sec222_title').should('have.text', 'Section 2.2.2');
    cy.get('#\\/sec223_title').should('have.text', 'Section 2.2.3');
    cy.get('#\\/sec2231_title').should('have.text', 'Section 2.2.3.1');
    cy.get('#\\/sec23_title').should('have.text', 'Section 2.3');

    cy.get('#\\/title1').should('have.text', 'Section 1');
    cy.get('#\\/title2').should('have.text', 'Section 2');
    cy.get('#\\/title21').should('have.text', 'Section 2.1');
    cy.get('#\\/title22').should('have.text', 'Section 2.2');
    cy.get('#\\/title221').should('have.text', 'Section 2.2.1');
    cy.get('#\\/title222').should('have.text', 'Section 2.2.2');
    cy.get('#\\/title223').should('have.text', 'Section 2.2.3');
    cy.get('#\\/title2231').should('have.text', 'Section 2.2.3.1');
    cy.get('#\\/title23').should('have.text', 'Section 2.3');

    cy.get('#\\/sectionNumber1').should('have.text', '1');
    cy.get('#\\/sectionNumber2').should('have.text', '2');
    cy.get('#\\/sectionNumber21').should('have.text', '2.1');
    cy.get('#\\/sectionNumber22').should('have.text', '2.2');
    cy.get('#\\/sectionNumber221').should('have.text', '2.2.1');
    cy.get('#\\/sectionNumber222').should('have.text', '2.2.2');
    cy.get('#\\/sectionNumber223').should('have.text', '2.2.3');
    cy.get('#\\/sectionNumber2231').should('have.text', '2.2.3.1');
    cy.get('#\\/sectionNumber23').should('have.text', '2.3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/sec1'].stateValues.level).eq(1);
      expect(stateVariables['/sec2'].stateValues.level).eq(1);
      expect(stateVariables['/sec21'].stateValues.level).eq(2);
      expect(stateVariables['/sec22'].stateValues.level).eq(2);
      expect(stateVariables['/sec221'].stateValues.level).eq(3);
      expect(stateVariables['/sec222'].stateValues.level).eq(3);
      expect(stateVariables['/sec223'].stateValues.level).eq(3);
      expect(stateVariables['/sec2231'].stateValues.level).eq(4);
      expect(stateVariables['/sec23'].stateValues.level).eq(2);
    });
  });

  it('Not auto naming of section titles with custom titles, by default', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <section name="sec1">
        <title>A</title>
        <p><lorem generateSentences="1" /></p>
      </section>
      <section name="sec2">
        <title>B</title>
        <p><lorem generateSentences="1" /></p>

        <section name="sec21">
          <title>BA</title>
          <p><lorem generateSentences="1" /></p>
        </section>
        <section name="sec22">
          <title>BB</title>
          <p><lorem generateSentences="1" /></p>
          <section name="sec221">
            <title>BBA</title>
            <p><lorem generateSentences="1" /></p>
          </section>
          <section name="sec222">
            <title>BBB</title>
            <p><lorem generateSentences="1" /></p>
          </section>
          <section name="sec223">
            <title>BBC</title>
            <p><lorem generateSentences="1" /></p>

            <section name="sec2231">
              <title>BBCA</title>
              <p><lorem generateSentences="1" /></p>
            </section>
          </section>

        </section>

        <section name="sec23">
          <title>BC</title>
          <p><lorem generateSentences="1" /></p>
        </section>
      </section>
    
      <p>Title 1: <text name="title1" copySource="sec1.title" /></p>
      <p>Title 2: <text name="title2" copySource="sec2.title" /></p>
      <p>Title 2.1: <text name="title21" copySource="sec21.title" /></p>
      <p>Title 2.2: <text name="title22" copySource="sec22.title" /></p>
      <p>Title 2.2.1: <text name="title221" copySource="sec221.title" /></p>
      <p>Title 2.2.2: <text name="title222" copySource="sec222.title" /></p>
      <p>Title 2.2.3: <text name="title223" copySource="sec223.title" /></p>
      <p>Title 2.2.3.1: <text name="title2231" copySource="sec2231.title" /></p>
      <p>Title 2.3: <text name="title23" copySource="sec23.title" /></p>

      <p>Number for 1: <text name="sectionNumber1" copySource="sec1.sectionNumber" /></p>
      <p>Number for 2: <text name="sectionNumber2" copySource="sec2.sectionNumber" /></p>
      <p>Number for 2.1: <text name="sectionNumber21" copySource="sec21.sectionNumber" /></p>
      <p>Number for 2.2: <text name="sectionNumber22" copySource="sec22.sectionNumber" /></p>
      <p>Number for 2.2.1: <text name="sectionNumber221" copySource="sec221.sectionNumber" /></p>
      <p>Number for 2.2.2: <text name="sectionNumber222" copySource="sec222.sectionNumber" /></p>
      <p>Number for 2.2.3: <text name="sectionNumber223" copySource="sec223.sectionNumber" /></p>
      <p>Number for 2.2.3.1: <text name="sectionNumber2231" copySource="sec2231.sectionNumber" /></p>
      <p>Number for 2.3: <text name="sectionNumber23" copySource="sec23.sectionNumber" /></p>


    `}, "*");
    });

    cy.get('#\\/sec1_title').should('have.text', 'A');
    cy.get('#\\/sec2_title').should('have.text', 'B');
    cy.get('#\\/sec21_title').should('have.text', 'BA');
    cy.get('#\\/sec22_title').should('have.text', 'BB');
    cy.get('#\\/sec221_title').should('have.text', 'BBA');
    cy.get('#\\/sec222_title').should('have.text', 'BBB');
    cy.get('#\\/sec223_title').should('have.text', 'BBC');
    cy.get('#\\/sec2231_title').should('have.text', 'BBCA');
    cy.get('#\\/sec23_title').should('have.text', 'BC');

    cy.get('#\\/title1').should('have.text', 'A');
    cy.get('#\\/title2').should('have.text', 'B');
    cy.get('#\\/title21').should('have.text', 'BA');
    cy.get('#\\/title22').should('have.text', 'BB');
    cy.get('#\\/title221').should('have.text', 'BBA');
    cy.get('#\\/title222').should('have.text', 'BBB');
    cy.get('#\\/title223').should('have.text', 'BBC');
    cy.get('#\\/title2231').should('have.text', 'BBCA');
    cy.get('#\\/title23').should('have.text', 'BC');

    cy.get('#\\/sectionNumber1').should('have.text', '1');
    cy.get('#\\/sectionNumber2').should('have.text', '2');
    cy.get('#\\/sectionNumber21').should('have.text', '2.1');
    cy.get('#\\/sectionNumber22').should('have.text', '2.2');
    cy.get('#\\/sectionNumber221').should('have.text', '2.2.1');
    cy.get('#\\/sectionNumber222').should('have.text', '2.2.2');
    cy.get('#\\/sectionNumber223').should('have.text', '2.2.3');
    cy.get('#\\/sectionNumber2231').should('have.text', '2.2.3.1');
    cy.get('#\\/sectionNumber23').should('have.text', '2.3');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/sec1'].stateValues.level).eq(1);
      expect(stateVariables['/sec2'].stateValues.level).eq(1);
      expect(stateVariables['/sec21'].stateValues.level).eq(2);
      expect(stateVariables['/sec22'].stateValues.level).eq(2);
      expect(stateVariables['/sec221'].stateValues.level).eq(3);
      expect(stateVariables['/sec222'].stateValues.level).eq(3);
      expect(stateVariables['/sec223'].stateValues.level).eq(3);
      expect(stateVariables['/sec2231'].stateValues.level).eq(4);
      expect(stateVariables['/sec23'].stateValues.level).eq(2);
    });
  });

  it('Add auto number to section titles with custom titles', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <section includeAutoNumber name="sec1">
        <title>A</title>
        <p><lorem generateSentences="1" /></p>
      </section>
      <section includeAutoNumber name="sec2">
        <title>B</title>
        <p><lorem generateSentences="1" /></p>

        <section includeAutoNumber name="sec21">
          <title>BA</title>
          <p><lorem generateSentences="1" /></p>
        </section>
        <section includeAutoNumber name="sec22">
          <title>BB</title>
          <p><lorem generateSentences="1" /></p>
          <section includeAutoNumber name="sec221">
            <title>BBA</title>
            <p><lorem generateSentences="1" /></p>
          </section>
          <section includeAutoNumber name="sec222">
            <title>BBB</title>
            <p><lorem generateSentences="1" /></p>
          </section>
          <section includeAutoNumber name="sec223">
            <title>BBC</title>
            <p><lorem generateSentences="1" /></p>

            <section includeAutoNumber name="sec2231">
              <title>BBCA</title>
              <p><lorem generateSentences="1" /></p>
            </section>
          </section>

        </section>

        <section includeAutoNumber name="sec23">
          <title>BC</title>
          <p><lorem generateSentences="1" /></p>
        </section>
      </section>
  
      <p>Title 1: <text name="title1" copySource="sec1.title" /></p>
      <p>Title 2: <text name="title2" copySource="sec2.title" /></p>
      <p>Title 2.1: <text name="title21" copySource="sec21.title" /></p>
      <p>Title 2.2: <text name="title22" copySource="sec22.title" /></p>
      <p>Title 2.2.1: <text name="title221" copySource="sec221.title" /></p>
      <p>Title 2.2.2: <text name="title222" copySource="sec222.title" /></p>
      <p>Title 2.2.3: <text name="title223" copySource="sec223.title" /></p>
      <p>Title 2.2.3.1: <text name="title2231" copySource="sec2231.title" /></p>
      <p>Title 2.3: <text name="title23" copySource="sec23.title" /></p>

      <p>Number for 1: <text name="sectionNumber1" copySource="sec1.sectionNumber" /></p>
      <p>Number for 2: <text name="sectionNumber2" copySource="sec2.sectionNumber" /></p>
      <p>Number for 2.1: <text name="sectionNumber21" copySource="sec21.sectionNumber" /></p>
      <p>Number for 2.2: <text name="sectionNumber22" copySource="sec22.sectionNumber" /></p>
      <p>Number for 2.2.1: <text name="sectionNumber221" copySource="sec221.sectionNumber" /></p>
      <p>Number for 2.2.2: <text name="sectionNumber222" copySource="sec222.sectionNumber" /></p>
      <p>Number for 2.2.3: <text name="sectionNumber223" copySource="sec223.sectionNumber" /></p>
      <p>Number for 2.2.3.1: <text name="sectionNumber2231" copySource="sec2231.sectionNumber" /></p>
      <p>Number for 2.3: <text name="sectionNumber23" copySource="sec23.sectionNumber" /></p>


    `}, "*");
    });

    cy.get('#\\/sec1_title').should('have.text', '1. A');
    cy.get('#\\/sec2_title').should('have.text', '2. B');
    cy.get('#\\/sec21_title').should('have.text', '2.1. BA');
    cy.get('#\\/sec22_title').should('have.text', '2.2. BB');
    cy.get('#\\/sec221_title').should('have.text', '2.2.1. BBA');
    cy.get('#\\/sec222_title').should('have.text', '2.2.2. BBB');
    cy.get('#\\/sec223_title').should('have.text', '2.2.3. BBC');
    cy.get('#\\/sec2231_title').should('have.text', '2.2.3.1. BBCA');
    cy.get('#\\/sec23_title').should('have.text', '2.3. BC');

    cy.get('#\\/title1').should('have.text', 'A');
    cy.get('#\\/title2').should('have.text', 'B');
    cy.get('#\\/title21').should('have.text', 'BA');
    cy.get('#\\/title22').should('have.text', 'BB');
    cy.get('#\\/title221').should('have.text', 'BBA');
    cy.get('#\\/title222').should('have.text', 'BBB');
    cy.get('#\\/title223').should('have.text', 'BBC');
    cy.get('#\\/title2231').should('have.text', 'BBCA');
    cy.get('#\\/title23').should('have.text', 'BC');

    cy.get('#\\/sectionNumber1').should('have.text', '1');
    cy.get('#\\/sectionNumber2').should('have.text', '2');
    cy.get('#\\/sectionNumber21').should('have.text', '2.1');
    cy.get('#\\/sectionNumber22').should('have.text', '2.2');
    cy.get('#\\/sectionNumber221').should('have.text', '2.2.1');
    cy.get('#\\/sectionNumber222').should('have.text', '2.2.2');
    cy.get('#\\/sectionNumber223').should('have.text', '2.2.3');
    cy.get('#\\/sectionNumber2231').should('have.text', '2.2.3.1');
    cy.get('#\\/sectionNumber23').should('have.text', '2.3');



    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/sec1'].stateValues.level).eq(1);
      expect(stateVariables['/sec2'].stateValues.level).eq(1);
      expect(stateVariables['/sec21'].stateValues.level).eq(2);
      expect(stateVariables['/sec22'].stateValues.level).eq(2);
      expect(stateVariables['/sec221'].stateValues.level).eq(3);
      expect(stateVariables['/sec222'].stateValues.level).eq(3);
      expect(stateVariables['/sec223'].stateValues.level).eq(3);
      expect(stateVariables['/sec2231'].stateValues.level).eq(4);
      expect(stateVariables['/sec23'].stateValues.level).eq(2);
    });
  });

  it('Add auto name and number to section titles with custom titles', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <section includeAutoNumber includeAutoName name="sec1">
        <title>A</title>
        <p><lorem generateSentences="1" /></p>
      </section>
      <section includeAutoNumber includeAutoName name="sec2">
        <title>B</title>
        <p><lorem generateSentences="1" /></p>

        <section includeAutoNumber includeAutoName name="sec21">
          <title>BA</title>
          <p><lorem generateSentences="1" /></p>
        </section>
        <section includeAutoNumber includeAutoName name="sec22">
          <title>BB</title>
          <p><lorem generateSentences="1" /></p>
          <section includeAutoNumber includeAutoName name="sec221">
            <title>BBA</title>
            <p><lorem generateSentences="1" /></p>
          </section>
          <section includeAutoNumber includeAutoName name="sec222">
            <title>BBB</title>
            <p><lorem generateSentences="1" /></p>
          </section>
          <section includeAutoNumber includeAutoName name="sec223">
            <title>BBC</title>
            <p><lorem generateSentences="1" /></p>

            <section includeAutoNumber includeAutoName name="sec2231">
              <title>BBCA</title>
              <p><lorem generateSentences="1" /></p>
            </section>
          </section>

        </section>

        <section includeAutoNumber includeAutoName name="sec23">
          <title>BC</title>
          <p><lorem generateSentences="1" /></p>
        </section>
      </section>
  
      <p>Title 1: <text name="title1" copySource="sec1.title" /></p>
      <p>Title 2: <text name="title2" copySource="sec2.title" /></p>
      <p>Title 2.1: <text name="title21" copySource="sec21.title" /></p>
      <p>Title 2.2: <text name="title22" copySource="sec22.title" /></p>
      <p>Title 2.2.1: <text name="title221" copySource="sec221.title" /></p>
      <p>Title 2.2.2: <text name="title222" copySource="sec222.title" /></p>
      <p>Title 2.2.3: <text name="title223" copySource="sec223.title" /></p>
      <p>Title 2.2.3.1: <text name="title2231" copySource="sec2231.title" /></p>
      <p>Title 2.3: <text name="title23" copySource="sec23.title" /></p>

      <p>Number for 1: <text name="sectionNumber1" copySource="sec1.sectionNumber" /></p>
      <p>Number for 2: <text name="sectionNumber2" copySource="sec2.sectionNumber" /></p>
      <p>Number for 2.1: <text name="sectionNumber21" copySource="sec21.sectionNumber" /></p>
      <p>Number for 2.2: <text name="sectionNumber22" copySource="sec22.sectionNumber" /></p>
      <p>Number for 2.2.1: <text name="sectionNumber221" copySource="sec221.sectionNumber" /></p>
      <p>Number for 2.2.2: <text name="sectionNumber222" copySource="sec222.sectionNumber" /></p>
      <p>Number for 2.2.3: <text name="sectionNumber223" copySource="sec223.sectionNumber" /></p>
      <p>Number for 2.2.3.1: <text name="sectionNumber2231" copySource="sec2231.sectionNumber" /></p>
      <p>Number for 2.3: <text name="sectionNumber23" copySource="sec23.sectionNumber" /></p>


    `}, "*");
    });

    cy.get('#\\/sec1_title').should('have.text', 'Section 1: A');
    cy.get('#\\/sec2_title').should('have.text', 'Section 2: B');
    cy.get('#\\/sec21_title').should('have.text', 'Section 2.1: BA');
    cy.get('#\\/sec22_title').should('have.text', 'Section 2.2: BB');
    cy.get('#\\/sec221_title').should('have.text', 'Section 2.2.1: BBA');
    cy.get('#\\/sec222_title').should('have.text', 'Section 2.2.2: BBB');
    cy.get('#\\/sec223_title').should('have.text', 'Section 2.2.3: BBC');
    cy.get('#\\/sec2231_title').should('have.text', 'Section 2.2.3.1: BBCA');
    cy.get('#\\/sec23_title').should('have.text', 'Section 2.3: BC');

    cy.get('#\\/title1').should('have.text', 'A');
    cy.get('#\\/title2').should('have.text', 'B');
    cy.get('#\\/title21').should('have.text', 'BA');
    cy.get('#\\/title22').should('have.text', 'BB');
    cy.get('#\\/title221').should('have.text', 'BBA');
    cy.get('#\\/title222').should('have.text', 'BBB');
    cy.get('#\\/title223').should('have.text', 'BBC');
    cy.get('#\\/title2231').should('have.text', 'BBCA');
    cy.get('#\\/title23').should('have.text', 'BC');

    cy.get('#\\/sectionNumber1').should('have.text', '1');
    cy.get('#\\/sectionNumber2').should('have.text', '2');
    cy.get('#\\/sectionNumber21').should('have.text', '2.1');
    cy.get('#\\/sectionNumber22').should('have.text', '2.2');
    cy.get('#\\/sectionNumber221').should('have.text', '2.2.1');
    cy.get('#\\/sectionNumber222').should('have.text', '2.2.2');
    cy.get('#\\/sectionNumber223').should('have.text', '2.2.3');
    cy.get('#\\/sectionNumber2231').should('have.text', '2.2.3.1');
    cy.get('#\\/sectionNumber23').should('have.text', '2.3');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/sec1'].stateValues.level).eq(1);
      expect(stateVariables['/sec2'].stateValues.level).eq(1);
      expect(stateVariables['/sec21'].stateValues.level).eq(2);
      expect(stateVariables['/sec22'].stateValues.level).eq(2);
      expect(stateVariables['/sec221'].stateValues.level).eq(3);
      expect(stateVariables['/sec222'].stateValues.level).eq(3);
      expect(stateVariables['/sec223'].stateValues.level).eq(3);
      expect(stateVariables['/sec2231'].stateValues.level).eq(4);
      expect(stateVariables['/sec23'].stateValues.level).eq(2);
    });
  });

  it('Add auto name to section titles with custom titles', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <section includeAutoName name="sec1">
        <title>A</title>
        <p><lorem generateSentences="1" /></p>
      </section>
      <section includeAutoName name="sec2">
        <title>B</title>
        <p><lorem generateSentences="1" /></p>

        <section includeAutoName name="sec21">
          <title>BA</title>
          <p><lorem generateSentences="1" /></p>
        </section>
        <section includeAutoName name="sec22">
          <title>BB</title>
          <p><lorem generateSentences="1" /></p>
          <section includeAutoName name="sec221">
            <title>BBA</title>
            <p><lorem generateSentences="1" /></p>
          </section>
          <section includeAutoName name="sec222">
            <title>BBB</title>
            <p><lorem generateSentences="1" /></p>
          </section>
          <section includeAutoName name="sec223">
            <title>BBC</title>
            <p><lorem generateSentences="1" /></p>

            <section includeAutoName name="sec2231">
              <title>BBCA</title>
              <p><lorem generateSentences="1" /></p>
            </section>
          </section>

        </section>

        <section includeAutoName name="sec23">
          <title>BC</title>
          <p><lorem generateSentences="1" /></p>
        </section>
      </section>
      
      <p>Title 1: <text name="title1" copySource="sec1.title" /></p>
      <p>Title 2: <text name="title2" copySource="sec2.title" /></p>
      <p>Title 2.1: <text name="title21" copySource="sec21.title" /></p>
      <p>Title 2.2: <text name="title22" copySource="sec22.title" /></p>
      <p>Title 2.2.1: <text name="title221" copySource="sec221.title" /></p>
      <p>Title 2.2.2: <text name="title222" copySource="sec222.title" /></p>
      <p>Title 2.2.3: <text name="title223" copySource="sec223.title" /></p>
      <p>Title 2.2.3.1: <text name="title2231" copySource="sec2231.title" /></p>
      <p>Title 2.3: <text name="title23" copySource="sec23.title" /></p>

      <p>Number for 1: <text name="sectionNumber1" copySource="sec1.sectionNumber" /></p>
      <p>Number for 2: <text name="sectionNumber2" copySource="sec2.sectionNumber" /></p>
      <p>Number for 2.1: <text name="sectionNumber21" copySource="sec21.sectionNumber" /></p>
      <p>Number for 2.2: <text name="sectionNumber22" copySource="sec22.sectionNumber" /></p>
      <p>Number for 2.2.1: <text name="sectionNumber221" copySource="sec221.sectionNumber" /></p>
      <p>Number for 2.2.2: <text name="sectionNumber222" copySource="sec222.sectionNumber" /></p>
      <p>Number for 2.2.3: <text name="sectionNumber223" copySource="sec223.sectionNumber" /></p>
      <p>Number for 2.2.3.1: <text name="sectionNumber2231" copySource="sec2231.sectionNumber" /></p>
      <p>Number for 2.3: <text name="sectionNumber23" copySource="sec23.sectionNumber" /></p>


    `}, "*");
    });

    cy.get('#\\/sec1_title').should('have.text', 'Section: A');
    cy.get('#\\/sec2_title').should('have.text', 'Section: B');
    cy.get('#\\/sec21_title').should('have.text', 'Section: BA');
    cy.get('#\\/sec22_title').should('have.text', 'Section: BB');
    cy.get('#\\/sec221_title').should('have.text', 'Section: BBA');
    cy.get('#\\/sec222_title').should('have.text', 'Section: BBB');
    cy.get('#\\/sec223_title').should('have.text', 'Section: BBC');
    cy.get('#\\/sec2231_title').should('have.text', 'Section: BBCA');
    cy.get('#\\/sec23_title').should('have.text', 'Section: BC');

    cy.get('#\\/title1').should('have.text', 'A');
    cy.get('#\\/title2').should('have.text', 'B');
    cy.get('#\\/title21').should('have.text', 'BA');
    cy.get('#\\/title22').should('have.text', 'BB');
    cy.get('#\\/title221').should('have.text', 'BBA');
    cy.get('#\\/title222').should('have.text', 'BBB');
    cy.get('#\\/title223').should('have.text', 'BBC');
    cy.get('#\\/title2231').should('have.text', 'BBCA');
    cy.get('#\\/title23').should('have.text', 'BC');

    cy.get('#\\/sectionNumber1').should('have.text', '1');
    cy.get('#\\/sectionNumber2').should('have.text', '2');
    cy.get('#\\/sectionNumber21').should('have.text', '2.1');
    cy.get('#\\/sectionNumber22').should('have.text', '2.2');
    cy.get('#\\/sectionNumber221').should('have.text', '2.2.1');
    cy.get('#\\/sectionNumber222').should('have.text', '2.2.2');
    cy.get('#\\/sectionNumber223').should('have.text', '2.2.3');
    cy.get('#\\/sectionNumber2231').should('have.text', '2.2.3.1');
    cy.get('#\\/sectionNumber23').should('have.text', '2.3');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/sec1'].stateValues.level).eq(1);
      expect(stateVariables['/sec2'].stateValues.level).eq(1);
      expect(stateVariables['/sec21'].stateValues.level).eq(2);
      expect(stateVariables['/sec22'].stateValues.level).eq(2);
      expect(stateVariables['/sec221'].stateValues.level).eq(3);
      expect(stateVariables['/sec222'].stateValues.level).eq(3);
      expect(stateVariables['/sec223'].stateValues.level).eq(3);
      expect(stateVariables['/sec2231'].stateValues.level).eq(4);
      expect(stateVariables['/sec23'].stateValues.level).eq(2);
    });
  });

  it('Add auto name and number to section titles with custom titles, turning off include parent number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <section includeAutoNumber includeAutoName name="sec1">
        <title>A</title>
        <p><lorem generateSentences="1" /></p>
      </section>
      <section includeAutoNumber includeAutoName name="sec2">
        <title>B</title>
        <p><lorem generateSentences="1" /></p>

        <section includeAutoNumber includeAutoName name="sec21">
          <title>BA</title>
          <p><lorem generateSentences="1" /></p>
          <section includeAutoNumber includeAutoName name="sec211" includeParentNumber="false">
            <title>BAA</title>
            <p><lorem generateSentences="1" /></p>
            <section includeAutoNumber includeAutoName name="sec2111">
              <title>BAAA</title>
              <p><lorem generateSentences="1" /></p>
            </section>
            <section includeAutoNumber includeAutoName name="sec2112">
              <title>BAAB</title>
              <p><lorem generateSentences="1" /></p>
            </section>
          </section>
        </section>
        <section includeAutoNumber includeAutoName name="sec22" includeParentNumber="false">
          <title>BB</title>
          <p><lorem generateSentences="1" /></p>
          <section includeAutoNumber includeAutoName name="sec221">
            <title>BBA</title>
            <p><lorem generateSentences="1" /></p>
          </section>
          <section includeAutoNumber includeAutoName name="sec222">
            <title>BBB</title>
            <p><lorem generateSentences="1" /></p>
          </section>
          <section includeAutoNumber includeAutoName name="sec223">
            <title>BBC</title>
            <p><lorem generateSentences="1" /></p>

            <section includeAutoNumber includeAutoName name="sec2231">
              <title>BBCA</title>
              <p><lorem generateSentences="1" /></p>
            </section>
          </section>

        </section>

        <section includeAutoNumber includeAutoName name="sec23">
          <title>BC</title>
          <p><lorem generateSentences="1" /></p>
        </section>
      </section>
  

      <p>Title 1: <text name="title1" copySource="sec1.title" /></p>
      <p>Title 2: <text name="title2" copySource="sec2.title" /></p>
      <p>Title 2.1: <text name="title21" copySource="sec21.title" /></p>
      <p>Title 2.1.1: <text name="title211" copySource="sec211.title" /></p>
      <p>Title 2.1.1.1: <text name="title2111" copySource="sec2111.title" /></p>
      <p>Title 2.1.1.2: <text name="title2112" copySource="sec2112.title" /></p>
      <p>Title 2.2: <text name="title22" copySource="sec22.title" /></p>
      <p>Title 2.2.1: <text name="title221" copySource="sec221.title" /></p>
      <p>Title 2.2.2: <text name="title222" copySource="sec222.title" /></p>
      <p>Title 2.2.3: <text name="title223" copySource="sec223.title" /></p>
      <p>Title 2.2.3.1: <text name="title2231" copySource="sec2231.title" /></p>
      <p>Title 2.3: <text name="title23" copySource="sec23.title" /></p>

      <p>Number for 1: <text name="sectionNumber1" copySource="sec1.sectionNumber" /></p>
      <p>Number for 2: <text name="sectionNumber2" copySource="sec2.sectionNumber" /></p>
      <p>Number for 2.1: <text name="sectionNumber21" copySource="sec21.sectionNumber" /></p>
      <p>Number for 2.1.1: <text name="sectionNumber211" copySource="sec211.sectionNumber" /></p>
      <p>Number for 2.1.1.1: <text name="sectionNumber2111" copySource="sec2111.sectionNumber" /></p>
      <p>Number for 2.1.1.2: <text name="sectionNumber2112" copySource="sec2112.sectionNumber" /></p>
      <p>Number for 2.2: <text name="sectionNumber22" copySource="sec22.sectionNumber" /></p>
      <p>Number for 2.2.1: <text name="sectionNumber221" copySource="sec221.sectionNumber" /></p>
      <p>Number for 2.2.2: <text name="sectionNumber222" copySource="sec222.sectionNumber" /></p>
      <p>Number for 2.2.3: <text name="sectionNumber223" copySource="sec223.sectionNumber" /></p>
      <p>Number for 2.2.3.1: <text name="sectionNumber2231" copySource="sec2231.sectionNumber" /></p>
      <p>Number for 2.3: <text name="sectionNumber23" copySource="sec23.sectionNumber" /></p>


    `}, "*");
    });

    cy.get('#\\/sec1_title').should('have.text', 'Section 1: A');
    cy.get('#\\/sec2_title').should('have.text', 'Section 2: B');
    cy.get('#\\/sec21_title').should('have.text', 'Section 2.1: BA');
    cy.get('#\\/sec211_title').should('have.text', 'Section 1: BAA');
    cy.get('#\\/sec2111_title').should('have.text', 'Section 1.1: BAAA');
    cy.get('#\\/sec2112_title').should('have.text', 'Section 1.2: BAAB');
    cy.get('#\\/sec22_title').should('have.text', 'Section 2: BB');
    cy.get('#\\/sec221_title').should('have.text', 'Section 2.1: BBA');
    cy.get('#\\/sec222_title').should('have.text', 'Section 2.2: BBB');
    cy.get('#\\/sec223_title').should('have.text', 'Section 2.3: BBC');
    cy.get('#\\/sec2231_title').should('have.text', 'Section 2.3.1: BBCA');
    cy.get('#\\/sec23_title').should('have.text', 'Section 2.3: BC');

    cy.get('#\\/title1').should('have.text', 'A');
    cy.get('#\\/title2').should('have.text', 'B');
    cy.get('#\\/title21').should('have.text', 'BA');
    cy.get('#\\/title211').should('have.text', 'BAA');
    cy.get('#\\/title2111').should('have.text', 'BAAA');
    cy.get('#\\/title2112').should('have.text', 'BAAB');
    cy.get('#\\/title22').should('have.text', 'BB');
    cy.get('#\\/title221').should('have.text', 'BBA');
    cy.get('#\\/title222').should('have.text', 'BBB');
    cy.get('#\\/title223').should('have.text', 'BBC');
    cy.get('#\\/title2231').should('have.text', 'BBCA');
    cy.get('#\\/title23').should('have.text', 'BC');

    cy.get('#\\/sectionNumber1').should('have.text', '1');
    cy.get('#\\/sectionNumber2').should('have.text', '2');
    cy.get('#\\/sectionNumber21').should('have.text', '2.1');
    cy.get('#\\/sectionNumber211').should('have.text', '1');
    cy.get('#\\/sectionNumber2111').should('have.text', '1.1');
    cy.get('#\\/sectionNumber2112').should('have.text', '1.2');
    cy.get('#\\/sectionNumber22').should('have.text', '2');
    cy.get('#\\/sectionNumber221').should('have.text', '2.1');
    cy.get('#\\/sectionNumber222').should('have.text', '2.2');
    cy.get('#\\/sectionNumber223').should('have.text', '2.3');
    cy.get('#\\/sectionNumber2231').should('have.text', '2.3.1');
    cy.get('#\\/sectionNumber23').should('have.text', '2.3');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/sec1'].stateValues.level).eq(1);
      expect(stateVariables['/sec2'].stateValues.level).eq(1);
      expect(stateVariables['/sec21'].stateValues.level).eq(2);
      expect(stateVariables['/sec211'].stateValues.level).eq(3);
      expect(stateVariables['/sec2111'].stateValues.level).eq(4);
      expect(stateVariables['/sec2112'].stateValues.level).eq(4);
      expect(stateVariables['/sec22'].stateValues.level).eq(2);
      expect(stateVariables['/sec221'].stateValues.level).eq(3);
      expect(stateVariables['/sec222'].stateValues.level).eq(3);
      expect(stateVariables['/sec223'].stateValues.level).eq(3);
      expect(stateVariables['/sec2231'].stateValues.level).eq(4);
      expect(stateVariables['/sec23'].stateValues.level).eq(2);
    });
  });

  it('Add auto name to aside', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <aside name="aside1">
        <p><lorem generateSentences="1" /></p>
      </aside>
      <aside includeAutoName name="aside2">
        <title>Side point</title>
        <p><lorem generateSentences="1" /></p>
      </aside>
      <aside includeAutoName name="aside3" includeAutoNumber>
        <title>Another side point</title>
        <p><lorem generateSentences="1" /></p>
        <aside name="aside31">
          <title>Subpoint</title>
          <p><lorem generateSentences="1" /></p>
        </aside>
        <aside name="aside32">
          <p><lorem generateSentences="1" /></p>
        </aside>
      </aside>
  
      <p>Title 1: <text name="title1" copySource="aside1.title" /></p>
      <p>Title 2: <text name="title2" copySource="aside2.title" /></p>
      <p>Title 3: <text name="title3" copySource="aside3.title" /></p>
      <p>Title 3.1: <text name="title31" copySource="aside31.title" /></p>
      <p>Title 3.2: <text name="title32" copySource="aside32.title" /></p>

    `}, "*");
    });

    cy.get('#\\/aside1_title').should('contain.text', 'Aside 1');
    cy.get('#\\/aside1_title').should('not.contain.text', ':');
    cy.get('#\\/aside2_title').should('contain.text', 'Aside: Side point');
    cy.get('#\\/aside3_title').should('contain.text', 'Aside 3: Another side point');
    cy.get('#\\/title1').should('have.text', 'Aside 1');
    cy.get('#\\/title2').should('have.text', 'Side point');
    cy.get('#\\/title3').should('have.text', 'Another side point');

    cy.get('#\\/aside3_title').click();

    cy.get('#\\/aside31_title').should('contain.text', 'Subpoint');
    cy.get('#\\/aside31_title').should('not.contain.text', '1');
    cy.get('#\\/aside31_title').should('not.contain.text', ':');
    cy.get('#\\/aside32_title').should('contain.text', 'Aside 5 ');
    cy.get('#\\/aside32_title').should('not.contain.text', ':');


    cy.get('#\\/title31').should('have.text', 'Subpoint');
    cy.get('#\\/title32').should('have.text', 'Aside 5');

  });

  it('Example, problems, exercise do not include parent number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <section name="sec1">
        <problem name="prob11">
          <p><lorem generateSentences="1" /></p>
        </problem>
        <exercise name="exer11">
          <p><lorem generateSentences="1" /></p>
        </exercise>
        <example name="exam11">
          <p><lorem generateSentences="1" /></p>
        </example>
        <problem name="prob12">
          <p><lorem generateSentences="1" /></p>
        </problem>
        <exercise name="exer12">
          <p><lorem generateSentences="1" /></p>
        </exercise>
        <example name="exam12">
          <p><lorem generateSentences="1" /></p>
        </example>

      </section>
  

      <p>Title Section 1: <text name="titleSec1" copySource="sec1.title" /></p>
      <p>Title Problem 1.1: <text name="titleProb11" copySource="prob11.title" /></p>
      <p>Title Exercise 1.1: <text name="titleExer11" copySource="exer11.title" /></p>
      <p>Title Example 1.1: <text name="titleExam11" copySource="exam11.title" /></p>
      <p>Title Problem 1.2: <text name="titleProb12" copySource="prob12.title" /></p>
      <p>Title Exercise 1.2: <text name="titleExer12" copySource="exer12.title" /></p>
      <p>Title Example 1.2: <text name="titleExam12" copySource="exam12.title" /></p>


      <p>Number for Section 1: <text name="sectionNumberSec1" copySource="sec1.sectionNumber" /></p>
      <p>Number for Problem 1.1: <text name="sectionNumberProb11" copySource="prob11.sectionNumber" /></p>
      <p>Number for Exercise 1.1: <text name="sectionNumberExer11" copySource="exer11.sectionNumber" /></p>
      <p>Number for Example 1.1: <text name="sectionNumberExam11" copySource="exam11.sectionNumber" /></p>
      <p>Number for Problem 1.2: <text name="sectionNumberProb12" copySource="prob12.sectionNumber" /></p>
      <p>Number for Exercise 1.2: <text name="sectionNumberExer12" copySource="exer12.sectionNumber" /></p>
      <p>Number for Example 1.2: <text name="sectionNumberExam12" copySource="exam12.sectionNumber" /></p>



    `}, "*");
    });

    cy.get('#\\/sec1_title').should('have.text', 'Section 1');
    cy.get('#\\/prob11_title').should('have.text', 'Problem 1');
    cy.get('#\\/exer11_title').should('have.text', 'Exercise 2');
    cy.get('#\\/exam11_title').should('have.text', 'Example 3');
    cy.get('#\\/prob12_title').should('have.text', 'Problem 4');
    cy.get('#\\/exer12_title').should('have.text', 'Exercise 5');
    cy.get('#\\/exam12_title').should('have.text', 'Example 6');

    cy.get('#\\/titleProb11').should('have.text', 'Problem 1');
    cy.get('#\\/titleExer11').should('have.text', 'Exercise 2');
    cy.get('#\\/titleExam11').should('have.text', 'Example 3');
    cy.get('#\\/titleProb12').should('have.text', 'Problem 4');
    cy.get('#\\/titleExer12').should('have.text', 'Exercise 5');
    cy.get('#\\/titleExam12').should('have.text', 'Example 6');

    cy.get('#\\/sectionNumberProb11').should('have.text', '1');
    cy.get('#\\/sectionNumberExer11').should('have.text', '2');
    cy.get('#\\/sectionNumberExam11').should('have.text', '3');
    cy.get('#\\/sectionNumberProb12').should('have.text', '4');
    cy.get('#\\/sectionNumberExer12').should('have.text', '5');
    cy.get('#\\/sectionNumberExam12').should('have.text', '6');

  });

  it('Can open aside in read only mode', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_readOnly').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <aside name="aside1">
        <title>Hello</title>
        <p>Content</p>
      </aside>

      <p><textinput name="ti" /></p>
    `}, "*");
    });

    cy.get('#\\/aside1_title').should('contain.text', 'Hello');
    cy.get('#\\/_p1').should('not.exist');
    cy.get('#\\/ti_input').should('be.disabled')

    cy.get('#\\/aside1_title').click();
    cy.get('#\\/_p1').should('have.text', 'Content');

    cy.get('#\\/aside1_title').click();
    cy.get('#\\/_p1').should('not.exist');

  });

  it('Exercise with statement, hint, givenanswer, and solution', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

    <exercise name="exer">
      <title>An exercise</title>
      <statement>The exercise</statement>
      <hint>
        <p>Try harder</p>
      </hint>
      <givenAnswer>
        <p>The correct answer</p>
      </givenAnswer>
      <solution>
        <p>Here's how you do it.</p>
      </solution>
    </exercise>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'An exercise');

    cy.get('#\\/_statement1').should('have.text', 'The exercise');

    cy.get('#\\/_hint1 [data-test=hint-heading]').should('contain.text', 'Hint')
    cy.get('#\\/_hint1').should('not.contain.text', 'Try harder')
    cy.get('#\\/_givenanswer1').should('contain.text', 'Answer')
    cy.get('#\\/_givenanswer1').should('not.contain.text', 'The correct answer')
    cy.get('#\\/_solution1').should('contain.text', 'Solution')
    cy.get('#\\/_solution1').should('not.contain.text', "Here's how you do it.")

    cy.get('#\\/_hint1 [data-test=hint-heading]').click()
    cy.get('#\\/_hint1').should('contain.text', 'Try harder')
    cy.get('#\\/_givenanswer1').should('not.contain.text', 'The correct answer')
    cy.get('#\\/_solution1').should('not.contain.text', "Here's how you do it.")

    cy.get("#\\/_givenanswer1_button").click();
    cy.get('#\\/_givenanswer1').should('contain.text', 'The correct answer')
    cy.get('#\\/_hint1').should('contain.text', 'Try harder')
    cy.get('#\\/_solution1').should('not.contain.text', "Here's how you do it.")

    cy.get("#\\/_solution1_button").click();
    cy.get('#\\/_solution1').should('contain.text', "Here's how you do it.")
    cy.get('#\\/_hint1').should('contain.text', 'Try harder')
    cy.get('#\\/_givenanswer1').should('contain.text', 'The correct answer')

  });

  it('Section with introduction, subsections and conclusion', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <introduction>
    <p>First this</p>
    <p>Then that</p>
    <text>Hello</text> <text>World</text>
  </introduction>
  <subsection>
    <title>Point 1</title>
    <p>Make the first point</p>
  </subsection>
  <subsection>
    <title>Point 2</title>
    <p>Make the second point</p>
  </subsection>
  <conclusion>
    Wrap <text>it</text> <text>up</text>!
  </conclusion>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_introduction1').should('have.text', '\n    First this\n    Then that\n    Hello World\n  ');

    cy.get('#\\/_subsection1').should('have.text', ' Point 1\n    \n    Make the first point\n   ');
    cy.get('#\\/_subsection2').should('have.text', ' Point 2\n    \n    Make the second point\n   ');

    cy.get('#\\/_conclusion1').should('have.text', '\n    Wrap it up!\n  ');


  });

  it('Assemblage', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <assemblage>
    <title>Good stuff</title>
    <text>Hello</text> <text>World</text>
  </assemblage>
  <p>Is assemblage boxed? $_assemblage1.boxed</p>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');
    cy.get('#\\/_title2').should('have.text', 'Good stuff');

    cy.get('#\\/_assemblage1').should('contain.text', 'Hello World');

    cy.get('#\\/_p1').should('have.text', 'Is assemblage boxed? true')

  });

  it('Objectives', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <objectives>
    <text>Hello</text> <text>World</text>
  </objectives>
  <p>Is objectives boxed? $_objectives1.boxed</p>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_objectives1_title').should('have.text', 'Objectives 1');
    cy.get('#\\/_objectives1').should('contain.text', 'Hello World');

    cy.get('#\\/_p1').should('have.text', 'Is objectives boxed? true')

  });

  it('Activity', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <activity>
    <text>Hello</text> <text>World</text>
  </activity>
  <p>Is activity boxed? $_activity1.boxed</p>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_activity1_title').should('have.text', 'Activity 1');
    cy.get('#\\/_activity1').should('contain.text', 'Hello World');

    cy.get('#\\/_p1').should('have.text', 'Is activity boxed? false')

  });

  it('Exploration', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <exploration>
    <text>Hello</text> <text>World</text>
  </exploration>
  <p>Is exploration boxed? $_exploration1.boxed</p>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_exploration1_title').should('have.text', 'Exploration 1');

    cy.get('#\\/_p1').should('have.text', 'Is exploration boxed? false')

  });

  it('Exercises', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<exercises>
  <title>Exercises</title>
  <exercise>
    <text>Hello</text> <text>World</text>
  </exercise>
  <exercise>
    A second one
  </exercise>
</exercises>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'Exercises');

    cy.get('#\\/_exercise1_title').should('have.text', 'Exercise 1');
    cy.get('#\\/_exercise1').should('contain.text', 'Hello World');

    cy.get('#\\/_exercise2_title').should('have.text', 'Exercise 2');
    cy.get('#\\/_exercise2').should('contain.text', 'A second one');


  });

  it('Definition', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <definition>
    <text>Hello</text> <text>World</text>
  </definition>
  <p>Is definition boxed? $_definition1.boxed</p>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_definition1_title').should('have.text', 'Definition 1');
    cy.get('#\\/_definition1').should('contain.text', 'Hello World');

    cy.get('#\\/_p1').should('have.text', 'Is definition boxed? false')

  });

  it('Note', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <note>
    <text>Hello</text> <text>World</text>
  </note>
  <p>Is note boxed? $_note1.boxed</p>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_note1_title').should('have.text', 'Note 1');
    cy.get('#\\/_note1').should('contain.text', 'Hello World');

    cy.get('#\\/_p1').should('have.text', 'Is note boxed? false')

  });

  it('Question', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <question>
    <text>Hello</text> <text>World</text>
  </question>
  <p>Is question boxed? $_question1.boxed</p>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_question1_title').should('have.text', 'Question 1');
    cy.get('#\\/_question1').should('contain.text', 'Hello World');

    cy.get('#\\/_p1').should('have.text', 'Is question boxed? false')

  });

  it('Theorem-like elements', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <theorem>
    <statement>The statement</statement>
    <proof>The proof</proof>
  </theorem>
  <algorithm>
    <statement>The statement</statement>
    <proof>The proof</proof>
  </algorithm>
  <claim>
    <statement>The statement</statement>
    <proof>The proof</proof>
  </claim>
  <corollary>
    <statement>The statement</statement>
    <proof>The proof</proof>
  </corollary>
  <fact>
    <statement>The statement</statement>
    <proof>The proof</proof>
  </fact>
  <identity>
    <statement>The statement</statement>
    <proof>The proof</proof>
  </identity>
  <lemma>
    <statement>The statement</statement>
    <proof>The proof</proof>
  </lemma>
  <proposition>
    <statement>The statement</statement>
    <proof>The proof</proof>
  </proposition>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_theorem1_title').should('have.text', 'Theorem 1');
    cy.get('#\\/_statement1').should('have.text', 'The statement');
    cy.get('#\\/_proof1_title').should('contain.text', 'Proof')
    cy.get('#\\/_proof1_title').should('contain.text', 'Proof')
    cy.get('#\\/_proof1').should('not.contain.text', 'The proof')
    cy.get('#\\/_proof1_title').click();
    cy.get('#\\/_proof1').should('contain.text', 'The proof')

    cy.get('#\\/_algorithm1_title').should('have.text', 'Algorithm 2');
    cy.get('#\\/_statement2').should('have.text', 'The statement');
    cy.get('#\\/_proof2_title').should('contain.text', 'Proof')
    cy.get('#\\/_proof2').should('not.contain.text', 'The proof')
    cy.get('#\\/_proof2_title').click();
    cy.get('#\\/_proof2').should('contain.text', 'The proof')

    cy.get('#\\/_claim1_title').should('have.text', 'Claim 3');
    cy.get('#\\/_statement3').should('have.text', 'The statement');
    cy.get('#\\/_proof3_title').should('contain.text', 'Proof')
    cy.get('#\\/_proof3').should('not.contain.text', 'The proof')
    cy.get('#\\/_proof3_title').click();
    cy.get('#\\/_proof3').should('contain.text', 'The proof')

    cy.get('#\\/_corollary1_title').should('have.text', 'Corollary 4');
    cy.get('#\\/_statement4').should('have.text', 'The statement');
    cy.get('#\\/_proof4_title').should('contain.text', 'Proof')
    cy.get('#\\/_proof4').should('not.contain.text', 'The proof')
    cy.get('#\\/_proof4_title').click();
    cy.get('#\\/_proof4').should('contain.text', 'The proof')

    cy.get('#\\/_fact1_title').should('have.text', 'Fact 5');
    cy.get('#\\/_statement5').should('have.text', 'The statement');
    cy.get('#\\/_proof5_title').should('contain.text', 'Proof')
    cy.get('#\\/_proof5').should('not.contain.text', 'The proof')
    cy.get('#\\/_proof5_title').click();
    cy.get('#\\/_proof5').should('contain.text', 'The proof')

    cy.get('#\\/_identity1_title').should('have.text', 'Identity 6');
    cy.get('#\\/_statement6').should('have.text', 'The statement');
    cy.get('#\\/_proof6_title').should('contain.text', 'Proof')
    cy.get('#\\/_proof6').should('not.contain.text', 'The proof')
    cy.get('#\\/_proof6_title').click();
    cy.get('#\\/_proof6').should('contain.text', 'The proof')

    cy.get('#\\/_lemma1_title').should('have.text', 'Lemma 7');
    cy.get('#\\/_statement7').should('have.text', 'The statement');
    cy.get('#\\/_proof7_title').should('contain.text', 'Proof')
    cy.get('#\\/_proof7').should('not.contain.text', 'The proof')
    cy.get('#\\/_proof7_title').click();
    cy.get('#\\/_proof7').should('contain.text', 'The proof')

    cy.get('#\\/_proposition1_title').should('have.text', 'Proposition 8');
    cy.get('#\\/_statement8').should('have.text', 'The statement');
    cy.get('#\\/_proof8_title').should('contain.text', 'Proof')
    cy.get('#\\/_proof8').should('not.contain.text', 'The proof')
    cy.get('#\\/_proof8_title').click();
    cy.get('#\\/_proof8').should('contain.text', 'The proof')

  });

  it('Axiom-like elements', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <axiom>
    <statement>The statement</statement>
  </axiom>
  <assumption>
    <statement>The statement</statement>
  </assumption>
  <conjecture>
    <statement>The statement</statement>
  </conjecture>
  <heuristic>
    <statement>The statement</statement>
  </heuristic>
  <hypothesis>
    <statement>The statement</statement>
  </hypothesis>
  <principle>
    <statement>The statement</statement>
  </principle>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_axiom1_title').should('have.text', 'Axiom 1');
    cy.get('#\\/_statement1').should('have.text', 'The statement');

    cy.get('#\\/_assumption1_title').should('have.text', 'Assumption 2');
    cy.get('#\\/_statement2').should('have.text', 'The statement');

    cy.get('#\\/_conjecture1_title').should('have.text', 'Conjecture 3');
    cy.get('#\\/_statement3').should('have.text', 'The statement');

    cy.get('#\\/_heuristic1_title').should('have.text', 'Heuristic 4');
    cy.get('#\\/_statement4').should('have.text', 'The statement');

    cy.get('#\\/_hypothesis1_title').should('have.text', 'Hypothesis 5');
    cy.get('#\\/_statement5').should('have.text', 'The statement');

    cy.get('#\\/_principle1_title').should('have.text', 'Principle 6');
    cy.get('#\\/_statement6').should('have.text', 'The statement');

  });

  it('Aside-like elements', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <aside>
    Hello.
  </aside>
  <historical>
    Hello.
  </historical>
  <biographical>
    Hello.
  </biographical>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_aside1_title').should('contain.text', 'Aside 1');
    cy.get('#\\/_aside1').should('not.contain.text', 'Hello.');
    cy.get('#\\/_aside1_title').click();
    cy.get('#\\/_aside1').should('contain.text', 'Hello.');

    cy.get('#\\/_historical1_title').should('contain.text', 'Historical 2');
    cy.get('#\\/_historical1').should('not.contain.text', 'Hello.');
    cy.get('#\\/_historical1_title').click();
    cy.get('#\\/_historical1').should('contain.text', 'Hello.');

    cy.get('#\\/_biographical1_title').should('contain.text', 'Biographical 3');
    cy.get('#\\/_biographical1').should('not.contain.text', 'Hello.');
    cy.get('#\\/_biographical1_title').click();
    cy.get('#\\/_biographical1').should('contain.text', 'Hello.');

  });

  it('Remark-like elements', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <remark>
    Hello.
  </remark>
  <convention>
    Hello.
  </convention>
  <note>
    Hello.
  </note>
  <observation>
    Hello.
  </observation>
  <warning>
    Hello.
  </warning>
  <insight>
    Hello.
  </insight>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_remark1_title').should('have.text', 'Remark 1');
    cy.get('#\\/_remark1').should('contain.text', 'Hello.');

    cy.get('#\\/_convention1_title').should('have.text', 'Convention 2');
    cy.get('#\\/_convention1').should('contain.text', 'Hello.');

    cy.get('#\\/_note1_title').should('have.text', 'Note 3');
    cy.get('#\\/_note1').should('contain.text', 'Hello.');

    cy.get('#\\/_observation1_title').should('have.text', 'Observation 4');
    cy.get('#\\/_observation1').should('contain.text', 'Hello.');

    cy.get('#\\/_warning1_title').should('have.text', 'Warning 5');
    cy.get('#\\/_warning1').should('contain.text', 'Hello.');

    cy.get('#\\/_insight1_title').should('have.text', 'Insight 6');
    cy.get('#\\/_insight1').should('contain.text', 'Hello.');

  });

  it('Project-like elements', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <project>
    Hello.
  </project>
  <activity>
    Hello.
  </activity>
  <exploration>
    Hello.
  </exploration>
  <investigation>
    Hello.
  </investigation>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_project1_title').should('have.text', 'Project 1');
    cy.get('#\\/_project1').should('contain.text', 'Hello.');

    cy.get('#\\/_activity1_title').should('have.text', 'Activity 2');
    cy.get('#\\/_activity1').should('contain.text', 'Hello.');

    cy.get('#\\/_exploration1_title').should('have.text', 'Exploration 3');
    cy.get('#\\/_exploration1').should('contain.text', 'Hello.');

    cy.get('#\\/_investigation1_title').should('have.text', 'Investigation 4');
    cy.get('#\\/_investigation1').should('contain.text', 'Hello.');

  });

  it('Goal-like elements', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section>
  <title>A section</title>
  <objectives>
    <ul>
      <li>First</li>
      <li>Second</li>
    </ul>
  </objectives>
  <outcomes>
    <ul>
      <li>First</li>
      <li>Second</li>
    </ul>
  </outcomes>
</section>

    `}, "*");
    });

    cy.get('#\\/_title1').should('have.text', 'A section');

    cy.get('#\\/_objectives1_title').should('have.text', 'Objectives 1');
    cy.get('#\\/_objectives1').should('contain.text', 'FirstSecond');

    cy.get('#\\/_outcomes1_title').should('have.text', 'Outcomes 2');
    cy.get('#\\/_outcomes1').should('contain.text', 'FirstSecond');

  });

  it('Sections number independently of other sectioning elements', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<section name="sec1">
  <objectives name="obj1">
    <ul>
      <li>First</li>
      <li>Second</li>
    </ul>
  </objectives>
  <exploration name="exp2">
    An exploration
  </exploration>
  <subsection name="sec1-1">
    <activity name="act3">
      Activity inside a subsection.
    </activity>
  </subsection>
  <section name="sec1-2">
    <aside name="aside4">
      An aside
    </aside>
  </section>
  <activity name="act5">
    Final activity
  </activity>
  <outcomes name="out6">
    <ul>
      <li>First</li>
      <li>Second</li>
    </ul>
  </outcomes>
</section>
<section name="sec2">
  <objectives name="obj7">
  <ul>
    <li>First 2</li>
    <li>Second 2</li>
  </ul>
  </objectives>
  <section name="sec2-1">
    <exploration name="exp8">
      Another exploration
    </exploration>
  </section>
</section>

    `}, "*");
    });

    // Note: not sure if this is how we want numbering to work long term,
    // but this test at least documents how it is working now.

    cy.get('#\\/sec1_title').should('have.text', 'Section 1');

    cy.get('#\\/obj1_title').should('have.text', 'Objectives 1');
    cy.get('#\\/exp2_title').should('have.text', 'Exploration 2');
    cy.get('#\\/sec1-1_title').should('have.text', 'Section 1.1');
    cy.get('#\\/act3_title').should('have.text', 'Activity 3');
    cy.get('#\\/sec1-2_title').should('have.text', 'Section 1.2');
    cy.get('#\\/aside4_title').should('contain.text', 'Aside 4');
    cy.get('#\\/act5_title').should('have.text', 'Activity 5');
    cy.get('#\\/out6_title').should('have.text', 'Outcomes 6');

    cy.get('#\\/sec2_title').should('have.text', 'Section 2');

    cy.get('#\\/obj7_title').should('have.text', 'Objectives 7');
    cy.get('#\\/sec2-1_title').should('have.text', 'Section 2.1');

  });

});