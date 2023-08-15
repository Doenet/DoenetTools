import { cesc, cesc2 } from "../../../../src/utils/url";

describe("Sectioning Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("sections default to not aggregating scores", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Activity</title>
    <p>Credit achieved for $_document1.title:
    $_document1.creditAchieved{name="docCa"}, or $_document1.percentCreditAchieved{name="docPca"}%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <section name="section1"><title>Section 1</title>
      <p>Credit achieved for $section1.title:
      $section1.creditAchieved{name="s1Ca"}, or $section1.percentCreditAchieved{name="s1Pca"}%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </section>
    <section name="section2"><title>Section 2</title>
      <p>Credit achieved for $section2.title:
      $section2.creditAchieved{name="s2Ca"}, or $section2.percentCreditAchieved{name="s2Pca"}%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <subsection name="section21"><title>Section 2.1</title>
        <p>Credit achieved for $section21.title:
        $section21.creditAchieved{name="s21Ca"}, or $section21.percentCreditAchieved{name="s21Pca"}%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </subsection>
      <subsection name="section22"><title>Section 2.2</title>
        <p>Credit achieved for $section22.title:
        $section22.creditAchieved{name="s22Ca"}, or $section22.percentCreditAchieved{name="s22Pca"}%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <subsubsection name="section221"><title>Section 2.2.1</title>
          <p>Credit achieved for $section221.title:
          $section221.creditAchieved{name="s221Ca"}, or $section221.percentCreditAchieved{name="s221Pca"}%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </subsubsection>
        <subsubsection name="section222"><title>Section 2.2.2</title>
          <p>Credit achieved for $section222.title:
          $section222.creditAchieved{name="s222Ca"}, or $section222.percentCreditAchieved{name="s222Pca"}%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_document1_title")).should("have.text", "Activity");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let docCaAnchor = cesc2(
        "#" + stateVariables["/docCa"].replacements[0].componentName,
      );
      let docPcaAnchor = cesc2(
        "#" + stateVariables["/docPca"].replacements[0].componentName,
      );
      let s1CaAnchor = cesc2(
        "#" + stateVariables["/s1Ca"].replacements[0].componentName,
      );
      let s1PcaAnchor = cesc2(
        "#" + stateVariables["/s1Pca"].replacements[0].componentName,
      );
      let s2CaAnchor = cesc2(
        "#" + stateVariables["/s2Ca"].replacements[0].componentName,
      );
      let s2PcaAnchor = cesc2(
        "#" + stateVariables["/s2Pca"].replacements[0].componentName,
      );
      let s21CaAnchor = cesc2(
        "#" + stateVariables["/s21Ca"].replacements[0].componentName,
      );
      let s21PcaAnchor = cesc2(
        "#" + stateVariables["/s21Pca"].replacements[0].componentName,
      );
      let s22CaAnchor = cesc2(
        "#" + stateVariables["/s22Ca"].replacements[0].componentName,
      );
      let s22PcaAnchor = cesc2(
        "#" + stateVariables["/s22Pca"].replacements[0].componentName,
      );
      let s221CaAnchor = cesc2(
        "#" + stateVariables["/s221Ca"].replacements[0].componentName,
      );
      let s221PcaAnchor = cesc2(
        "#" + stateVariables["/s221Pca"].replacements[0].componentName,
      );
      let s222CaAnchor = cesc2(
        "#" + stateVariables["/s222Ca"].replacements[0].componentName,
      );
      let s222PcaAnchor = cesc2(
        "#" + stateVariables["/s222Pca"].replacements[0].componentName,
      );
      let mathinput1Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer1"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput2Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer2"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput3Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer3"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput4Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer4"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput5Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer5"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput6Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer6"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput7Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer7"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput8Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer8"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput9Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer9"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";

      let weight = [1, 1, 2, 1, 0.5, 1, 1, 1, 3];
      let totWeight = weight.reduce((a, b) => a + b);

      cy.get(docCaAnchor).should("have.text", "0");
      cy.get(docPcaAnchor).should("have.text", "0");
      cy.get(s1CaAnchor).should("have.text", "0");
      cy.get(s1PcaAnchor).should("have.text", "0");
      cy.get(s2CaAnchor).should("have.text", "0");
      cy.get(s2PcaAnchor).should("have.text", "0");
      cy.get(s21CaAnchor).should("have.text", "0");
      cy.get(s21PcaAnchor).should("have.text", "0");
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_document1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter first correct answer");
      cy.get(mathinput1Anchor).type(`u{enter}`, { force: true });

      let credit1 = weight[0] / totWeight;
      let credit1Round = Math.round(10000 * credit1) / 10000;
      let percentCredit1 = credit1 * 100;
      let percentCredit1Round = credit1Round * 100;

      cy.get(docCaAnchor).should("have.text", credit1Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit1Round.toString());
      cy.get(s1CaAnchor).should("have.text", "0");
      cy.get(s1PcaAnchor).should("have.text", "0");
      cy.get(s2CaAnchor).should("have.text", "0");
      cy.get(s2PcaAnchor).should("have.text", "0");
      cy.get(s21CaAnchor).should("have.text", "0");
      cy.get(s21PcaAnchor).should("have.text", "0");
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit1, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit1, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter additional correct answers");
      cy.get(mathinput3Anchor).type(`y{enter}`, { force: true });
      cy.get(mathinput5Anchor).type(`v{enter}`, { force: true });
      cy.get(mathinput7Anchor).type(`q{enter}`, { force: true });

      let credit2 = (weight[0] + weight[2] + weight[4] + weight[6]) / totWeight;
      let credit2Round = Math.round(1000 * credit2) / 1000;
      let percentCredit2 = credit2 * 100;
      let percentCredit2Round = credit2Round * 100;

      cy.get(docCaAnchor).should("have.text", credit2Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit2Round.toString());
      cy.get(s1CaAnchor).should("have.text", "0");
      cy.get(s1PcaAnchor).should("have.text", "0");
      cy.get(s2CaAnchor).should("have.text", "0");
      cy.get(s2PcaAnchor).should("have.text", "0");
      cy.get(s21CaAnchor).should("have.text", "0");
      cy.get(s21PcaAnchor).should("have.text", "0");
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit2, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit2, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter most other correct answers");
      cy.get(mathinput2Anchor).type(`x{enter}`, { force: true });
      cy.get(mathinput4Anchor).type(`z{enter}`, { force: true });
      cy.get(mathinput6Anchor).type(`w{enter}`, { force: true });
      cy.get(mathinput8Anchor).type(`r{enter}`, { force: true });

      let credit3 = 1 - weight[8] / totWeight;
      let credit3Round = Math.round(1000 * credit3) / 1000;
      let percentCredit3 = credit3 * 100;
      let percentCredit3Round = credit3Round * 100;

      cy.get(docCaAnchor).should("have.text", credit3Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit3Round.toString());
      cy.get(s1CaAnchor).should("have.text", "0");
      cy.get(s1PcaAnchor).should("have.text", "0");
      cy.get(s2CaAnchor).should("have.text", "0");
      cy.get(s2PcaAnchor).should("have.text", "0");
      cy.get(s21CaAnchor).should("have.text", "0");
      cy.get(s21PcaAnchor).should("have.text", "0");
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit3, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit3, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter last correct answer");
      cy.get(mathinput9Anchor).type(`s{enter}`, { force: true });

      let credit4 = 1;
      let credit4Round = Math.round(1000 * credit4) / 1000;
      let percentCredit4 = credit4 * 100;
      let percentCredit4Round = credit4Round * 100;

      cy.get(docCaAnchor).should("have.text", credit4Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit4Round.toString());
      cy.get(s1CaAnchor).should("have.text", "0");
      cy.get(s1PcaAnchor).should("have.text", "0");
      cy.get(s2CaAnchor).should("have.text", "0");
      cy.get(s2PcaAnchor).should("have.text", "0");
      cy.get(s21CaAnchor).should("have.text", "0");
      cy.get(s21PcaAnchor).should("have.text", "0");
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit4, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit4, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(1);
      });
    });
  });

  it("sections aggregating scores default to weight 1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Activity</title>
    <p>Credit achieved for $_document1.title:
    $_document1.creditAchieved{name="docCa"}, or $_document1.percentCreditAchieved{name="docPca"}%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <section name="section1" aggregatescores><title>Section 1</title>
      <p>Credit achieved for $section1.title:
      $section1.creditAchieved{name="s1Ca"}, or $section1.percentCreditAchieved{name="s1Pca"}%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </section>
    <section name="section2" aggregatescores><title>Section 2</title>
      <p>Credit achieved for $section2.title:
      $section2.creditAchieved{name="s2Ca"}, or $section2.percentCreditAchieved{name="s2Pca"}%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <subsection name="section21" aggregatescores><title>Section 2.1</title>
        <p>Credit achieved for $section21.title:
        $section21.creditAchieved{name="s21Ca"}, or $section21.percentCreditAchieved{name="s21Pca"}%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </subsection>
      <subsection name="section22"><title>Section 2.2</title>
        <p>Credit achieved for $section22.title:
        $section22.creditAchieved{name="s22Ca"}, or $section22.percentCreditAchieved{name="s22Pca"}%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <subsubsection name="section221" aggregatescores><title>Section 2.2.1</title>
          <p>Credit achieved for $section221.title:
          $section221.creditAchieved{name="s221Ca"}, or $section221.percentCreditAchieved{name="s221Pca"}%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </subsubsection>
        <subsubsection name="section222" aggregatescores><title>Section 2.2.2</title>
          <p>Credit achieved for $section222.title:
          $section222.creditAchieved{name="s222Ca"}, or $section222.percentCreditAchieved{name="s222Pca"}%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_document1_title")).should("have.text", "Activity");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let docCaAnchor = cesc2(
        "#" + stateVariables["/docCa"].replacements[0].componentName,
      );
      let docPcaAnchor = cesc2(
        "#" + stateVariables["/docPca"].replacements[0].componentName,
      );
      let s1CaAnchor = cesc2(
        "#" + stateVariables["/s1Ca"].replacements[0].componentName,
      );
      let s1PcaAnchor = cesc2(
        "#" + stateVariables["/s1Pca"].replacements[0].componentName,
      );
      let s2CaAnchor = cesc2(
        "#" + stateVariables["/s2Ca"].replacements[0].componentName,
      );
      let s2PcaAnchor = cesc2(
        "#" + stateVariables["/s2Pca"].replacements[0].componentName,
      );
      let s21CaAnchor = cesc2(
        "#" + stateVariables["/s21Ca"].replacements[0].componentName,
      );
      let s21PcaAnchor = cesc2(
        "#" + stateVariables["/s21Pca"].replacements[0].componentName,
      );
      let s22CaAnchor = cesc2(
        "#" + stateVariables["/s22Ca"].replacements[0].componentName,
      );
      let s22PcaAnchor = cesc2(
        "#" + stateVariables["/s22Pca"].replacements[0].componentName,
      );
      let s221CaAnchor = cesc2(
        "#" + stateVariables["/s221Ca"].replacements[0].componentName,
      );
      let s221PcaAnchor = cesc2(
        "#" + stateVariables["/s221Pca"].replacements[0].componentName,
      );
      let s222CaAnchor = cesc2(
        "#" + stateVariables["/s222Ca"].replacements[0].componentName,
      );
      let s222PcaAnchor = cesc2(
        "#" + stateVariables["/s222Pca"].replacements[0].componentName,
      );
      let mathinput1Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer1"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput2Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer2"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput3Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer3"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput4Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer4"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput5Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer5"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput6Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer6"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput7Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer7"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput8Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer8"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput9Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer9"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";

      cy.get(docCaAnchor).should("have.text", "0");
      cy.get(docPcaAnchor).should("have.text", "0");
      cy.get(s1CaAnchor).should("have.text", "0");
      cy.get(s1PcaAnchor).should("have.text", "0");
      cy.get(s2CaAnchor).should("have.text", "0");
      cy.get(s2PcaAnchor).should("have.text", "0");
      cy.get(s21CaAnchor).should("have.text", "0");
      cy.get(s21PcaAnchor).should("have.text", "0");
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_document1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter first correct answer");
      cy.get(mathinput1Anchor).type(`u{enter}`, { force: true });

      let credit1 = 1 / 3;
      let credit1Round = Math.round(1000 * credit1) / 1000;
      let percentCredit1 = credit1 * 100;
      let percentCredit1Round = Math.round(10 * percentCredit1) / 10;

      cy.get(docCaAnchor).should("have.text", credit1Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit1Round.toString());
      cy.get(s1CaAnchor).should("have.text", "0");
      cy.get(s1PcaAnchor).should("have.text", "0");
      cy.get(s2CaAnchor).should("have.text", "0");
      cy.get(s2PcaAnchor).should("have.text", "0");
      cy.get(s21CaAnchor).should("have.text", "0");
      cy.get(s21PcaAnchor).should("have.text", "0");
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit1, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit1, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter additional correct answers");
      cy.get(mathinput3Anchor).type(`y{enter}`, { force: true });
      cy.get(mathinput5Anchor).type(`v{enter}`, { force: true });
      cy.get(mathinput7Anchor).type(`q{enter}`, { force: true });

      let section1credit2 = 2 / 3;
      let section1credit2Round = Math.round(1000 * section1credit2) / 1000;
      let section1percentCredit2 = section1credit2 * 100;
      let section1percentCredit2Round =
        Math.round(10 * section1percentCredit2) / 10;

      let section21credit2 = 1 / 3;
      let section21credit2Round = Math.round(1000 * section21credit2) / 1000;
      let section21percentCredit2 = section21credit2 * 100;
      let section21percentCredit2Round =
        Math.round(10 * section21percentCredit2) / 10;

      let section2credit2 = (section21credit2 + 1) / 5;
      let section2credit2Round = Math.round(1000 * section2credit2) / 1000;
      let section2percentCredit2 = section2credit2 * 100;
      let section2percentCredit2Round =
        Math.round(10 * section2percentCredit2) / 10;

      let credit2 = (1 + section1credit2 + section2credit2) / 3;
      let credit2Round = Math.round(1000 * credit2) / 1000;
      let percentCredit2 = credit2 * 100;
      let percentCredit2Round = Math.round(10 * percentCredit2) / 10;

      cy.get(docCaAnchor).should("have.text", credit2Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit2Round.toString());
      cy.get(s1CaAnchor).should("have.text", section1credit2Round.toString());
      cy.get(s1PcaAnchor).should(
        "have.text",
        section1percentCredit2Round.toString(),
      );
      cy.get(s2CaAnchor).should("have.text", section2credit2Round.toString());
      cy.get(s2PcaAnchor).should(
        "have.text",
        section2percentCredit2Round.toString(),
      );
      cy.get(s21CaAnchor).should("have.text", section21credit2Round.toString());
      cy.get(s21PcaAnchor).should(
        "have.text",
        section21percentCredit2Round.toString(),
      );
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit2, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit2, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).closeTo(
          section1credit2,
          1e-12,
        );
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).closeTo(section1percentCredit2, 1e-12);
        expect(stateVariables["/section2"].stateValues.creditAchieved).closeTo(
          section2credit2,
          1e-12,
        );
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).closeTo(section2percentCredit2, 1e-12);
        expect(stateVariables["/section21"].stateValues.creditAchieved).closeTo(
          section21credit2,
          1e-12,
        );
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).closeTo(section21percentCredit2, 1e-12);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter most other correct answers");
      cy.get(mathinput2Anchor).type(`x{enter}`, { force: true });
      cy.get(mathinput4Anchor).type(`z{enter}`, { force: true });
      cy.get(mathinput6Anchor).type(`w{enter}`, { force: true });
      cy.get(mathinput8Anchor).type(`r{enter}`, { force: true });

      let section1credit3 = 1;
      let section1credit3Round = Math.round(1000 * section1credit3) / 1000;
      let section1percentCredit3 = section1credit3 * 100;
      let section1percentCredit3Round =
        Math.round(10 * section1percentCredit3) / 10;

      let section221credit3 = 1;
      let section221credit3Round = Math.round(1000 * section221credit3) / 1000;
      let section221percentCredit3 = section221credit3 * 100;
      let section221percentCredit3Round =
        Math.round(10 * section221percentCredit3) / 10;

      let section21credit3 = 1;
      let section21credit3Round = Math.round(1000 * section21credit3) / 1000;
      let section21percentCredit3 = section21credit3 * 100;
      let section21percentCredit3Round =
        Math.round(10 * section21percentCredit3) / 10;

      let section2credit3 = (section21credit3 + 3) / 5;
      let section2credit3Round = Math.round(1000 * section2credit3) / 1000;
      let section2percentCredit3 = section2credit3 * 100;
      let section2percentCredit3Round =
        Math.round(10 * section2percentCredit3) / 10;

      let credit3 = (1 + section1credit3 + section2credit3) / 3;
      let credit3Round = Math.round(1000 * credit3) / 1000;
      let percentCredit3 = credit3 * 100;
      let percentCredit3Round = Math.round(10 * percentCredit3) / 10;

      cy.get(docCaAnchor).should("have.text", credit3Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit3Round.toString());
      cy.get(s1CaAnchor).should("have.text", section1credit3Round.toString());
      cy.get(s1PcaAnchor).should(
        "have.text",
        section1percentCredit3Round.toString(),
      );
      cy.get(s2CaAnchor).should("have.text", section2credit3Round.toString());
      cy.get(s2PcaAnchor).should(
        "have.text",
        section2percentCredit3Round.toString(),
      );
      cy.get(s21CaAnchor).should("have.text", section21credit3Round.toString());
      cy.get(s21PcaAnchor).should(
        "have.text",
        section21percentCredit3Round.toString(),
      );
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should(
        "have.text",
        section221credit3Round.toString(),
      );
      cy.get(s221PcaAnchor).should(
        "have.text",
        section221percentCredit3Round.toString(),
      );
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit3, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit3, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).closeTo(
          section1credit3,
          1e-12,
        );
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).closeTo(section1percentCredit3, 1e-12);
        expect(stateVariables["/section2"].stateValues.creditAchieved).closeTo(
          section2credit3,
          1e-12,
        );
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).closeTo(section2percentCredit3, 1e-12);
        expect(stateVariables["/section21"].stateValues.creditAchieved).closeTo(
          section21credit3,
          1e-12,
        );
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).closeTo(section21percentCredit3, 1e-12);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(
          stateVariables["/section221"].stateValues.creditAchieved,
        ).closeTo(section221credit3, 1e-12);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).closeTo(section221percentCredit3, 1e-12);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter last correct answer");
      cy.get(mathinput9Anchor).type(`s{enter}`, { force: true });

      let section1credit4 = 1;
      let section1credit4Round = Math.round(1000 * section1credit4) / 1000;
      let section1percentCredit4 = section1credit4 * 100;
      let section1percentCredit4Round =
        Math.round(10 * section1percentCredit4) / 10;

      let section221credit4 = 1;
      let section221credit4Round = Math.round(1000 * section221credit4) / 1000;
      let section221percentCredit4 = section221credit4 * 100;
      let section221percentCredit4Round =
        Math.round(10 * section221percentCredit4) / 10;

      let section222credit4 = 1;
      let section222credit4Round = Math.round(1000 * section222credit4) / 1000;
      let section222percentCredit4 = section222credit4 * 100;
      let section222percentCredit4Round =
        Math.round(10 * section222percentCredit4) / 10;

      let section21credit4 = 1;
      let section21credit4Round = Math.round(1000 * section21credit4) / 1000;
      let section21percentCredit4 = section21credit4 * 100;
      let section21percentCredit4Round =
        Math.round(10 * section21percentCredit4) / 10;

      let section2credit4 = 1;
      let section2credit4Round = Math.round(1000 * section2credit4) / 1000;
      let section2percentCredit4 = section2credit4 * 100;
      let section2percentCredit4Round =
        Math.round(10 * section2percentCredit4) / 10;

      let credit4 = (1 + section1credit4 + section2credit4) / 3;
      let credit4Round = Math.round(1000 * credit4) / 1000;
      let percentCredit4 = credit4 * 100;
      let percentCredit4Round = Math.round(10 * percentCredit4) / 10;

      cy.get(docCaAnchor).should("have.text", credit4Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit4Round.toString());
      cy.get(s1CaAnchor).should("have.text", section1credit4Round.toString());
      cy.get(s1PcaAnchor).should(
        "have.text",
        section1percentCredit4Round.toString(),
      );
      cy.get(s2CaAnchor).should("have.text", section2credit4Round.toString());
      cy.get(s2PcaAnchor).should(
        "have.text",
        section2percentCredit4Round.toString(),
      );
      cy.get(s21CaAnchor).should("have.text", section21credit4Round.toString());
      cy.get(s21PcaAnchor).should(
        "have.text",
        section21percentCredit4Round.toString(),
      );
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should(
        "have.text",
        section221credit4Round.toString(),
      );
      cy.get(s221PcaAnchor).should(
        "have.text",
        section221percentCredit4Round.toString(),
      );
      cy.get(s222CaAnchor).should(
        "have.text",
        section222credit4Round.toString(),
      );
      cy.get(s222PcaAnchor).should(
        "have.text",
        section222percentCredit4Round.toString(),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit4, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit4, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).closeTo(
          section1credit4,
          1e-12,
        );
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).closeTo(section1percentCredit4, 1e-12);
        expect(stateVariables["/section2"].stateValues.creditAchieved).closeTo(
          section2credit4,
          1e-12,
        );
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).closeTo(section2percentCredit4, 1e-12);
        expect(stateVariables["/section21"].stateValues.creditAchieved).closeTo(
          section21credit4,
          1e-12,
        );
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).closeTo(section21percentCredit4, 1e-12);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(
          stateVariables["/section221"].stateValues.creditAchieved,
        ).closeTo(section221credit4, 1e-12);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).closeTo(section221percentCredit4, 1e-12);
        expect(
          stateVariables["/section222"].stateValues.creditAchieved,
        ).closeTo(section222credit4, 1e-12);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).closeTo(section222percentCredit4, 1e-12);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(1);
      });
    });
  });

  it("sections aggregating scores, with weights", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Activity</title>
    <p>Credit achieved for $_document1.title:
    $_document1.creditAchieved{name="docCa"}, or $_document1.percentCreditAchieved{name="docPca"}%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <section name="section1" aggregatescores weight="0.5"><title>Section 1</title>
      <p>Credit achieved for $section1.title:
      $section1.creditAchieved{name="s1Ca"}, or $section1.percentCreditAchieved{name="s1Pca"}%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </section>
    <section name="section2" aggregatescores weight="2"><title>Section 2</title>
      <p>Credit achieved for $section2.title:
      $section2.creditAchieved{name="s2Ca"}, or $section2.percentCreditAchieved{name="s2Pca"}%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <subsection name="section21" aggregatescores weight="3"><title>Section 2.1</title>
        <p>Credit achieved for $section21.title:
        $section21.creditAchieved{name="s21Ca"}, or $section21.percentCreditAchieved{name="s21Pca"}%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </subsection>
      <subsection name="section22" aggregatescores weight="4"><title>Section 2.2</title>
        <p>Credit achieved for $section22.title:
        $section22.creditAchieved{name="s22Ca"}, or $section22.percentCreditAchieved{name="s22Pca"}%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <subsubsection name="section221" aggregatescores weight="5"><title>Section 2.2.1</title>
          <p>Credit achieved for $section221.title:
          $section221.creditAchieved{name="s221Ca"}, or $section221.percentCreditAchieved{name="s221Pca"}%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </subsubsection>
        <subsubsection name="section222" aggregatescores weight="1"><title>Section 2.2.2</title>
          <p>Credit achieved for $section222.title:
          $section222.creditAchieved{name="s222Ca"}, or $section222.percentCreditAchieved{name="s222Pca"}%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </subsubsection>
      </subsection>

    </section>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_document1_title")).should("have.text", "Activity");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let docCaAnchor = cesc2(
        "#" + stateVariables["/docCa"].replacements[0].componentName,
      );
      let docPcaAnchor = cesc2(
        "#" + stateVariables["/docPca"].replacements[0].componentName,
      );
      let s1CaAnchor = cesc2(
        "#" + stateVariables["/s1Ca"].replacements[0].componentName,
      );
      let s1PcaAnchor = cesc2(
        "#" + stateVariables["/s1Pca"].replacements[0].componentName,
      );
      let s2CaAnchor = cesc2(
        "#" + stateVariables["/s2Ca"].replacements[0].componentName,
      );
      let s2PcaAnchor = cesc2(
        "#" + stateVariables["/s2Pca"].replacements[0].componentName,
      );
      let s21CaAnchor = cesc2(
        "#" + stateVariables["/s21Ca"].replacements[0].componentName,
      );
      let s21PcaAnchor = cesc2(
        "#" + stateVariables["/s21Pca"].replacements[0].componentName,
      );
      let s22CaAnchor = cesc2(
        "#" + stateVariables["/s22Ca"].replacements[0].componentName,
      );
      let s22PcaAnchor = cesc2(
        "#" + stateVariables["/s22Pca"].replacements[0].componentName,
      );
      let s221CaAnchor = cesc2(
        "#" + stateVariables["/s221Ca"].replacements[0].componentName,
      );
      let s221PcaAnchor = cesc2(
        "#" + stateVariables["/s221Pca"].replacements[0].componentName,
      );
      let s222CaAnchor = cesc2(
        "#" + stateVariables["/s222Ca"].replacements[0].componentName,
      );
      let s222PcaAnchor = cesc2(
        "#" + stateVariables["/s222Pca"].replacements[0].componentName,
      );
      let mathinput1Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer1"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput2Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer2"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput3Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer3"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput4Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer4"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput5Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer5"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput6Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer6"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput7Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer7"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput8Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer8"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";
      let mathinput9Anchor =
        cesc2(
          "#" +
            stateVariables["/_answer9"].stateValues.inputChildren[0]
              .componentName,
        ) + " textarea";

      cy.get(docCaAnchor).should("have.text", "0");
      cy.get(docPcaAnchor).should("have.text", "0");
      cy.get(s1CaAnchor).should("have.text", "0");
      cy.get(s1PcaAnchor).should("have.text", "0");
      cy.get(s2CaAnchor).should("have.text", "0");
      cy.get(s2PcaAnchor).should("have.text", "0");
      cy.get(s21CaAnchor).should("have.text", "0");
      cy.get(s21PcaAnchor).should("have.text", "0");
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_document1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter first correct answer");
      cy.get(mathinput1Anchor).type(`u{enter}`, { force: true });

      let credit1 = 1 / 3.5;
      let credit1Round = Math.round(1000 * credit1) / 1000;
      let percentCredit1 = credit1 * 100;
      let percentCredit1Round = Math.round(10 * percentCredit1) / 10;

      cy.get(docCaAnchor).should("have.text", credit1Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit1Round.toString());
      cy.get(s1CaAnchor).should("have.text", "0");
      cy.get(s1PcaAnchor).should("have.text", "0");
      cy.get(s2CaAnchor).should("have.text", "0");
      cy.get(s2PcaAnchor).should("have.text", "0");
      cy.get(s21CaAnchor).should("have.text", "0");
      cy.get(s21PcaAnchor).should("have.text", "0");
      cy.get(s22CaAnchor).should("have.text", "0");
      cy.get(s22PcaAnchor).should("have.text", "0");
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit1, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit1, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter additional correct answers");
      cy.get(mathinput3Anchor).type(`y{enter}`, { force: true });
      cy.get(mathinput5Anchor).type(`v{enter}`, { force: true });
      cy.get(mathinput7Anchor).type(`q{enter}`, { force: true });

      let section1credit2 = 2 / 3;
      let section1credit2Round = Math.round(1000 * section1credit2) / 1000;
      let section1percentCredit2 = section1credit2 * 100;
      let section1percentCredit2Round =
        Math.round(10 * section1percentCredit2) / 10;

      let section21credit2 = 1 / 3;
      let section21credit2Round = Math.round(1000 * section21credit2) / 1000;
      let section21percentCredit2 = section21credit2 * 100;
      let section21percentCredit2Round =
        Math.round(10 * section21percentCredit2) / 10;

      let section22credit2 = 1 / 7;
      let section22credit2Round = Math.round(1000 * section22credit2) / 1000;
      let section22percentCredit2 = section22credit2 * 100;
      let section22percentCredit2Round =
        Math.round(10 * section22percentCredit2) / 10;

      let section2credit2 = (3 * section21credit2 + 4 * section22credit2) / 8;
      let section2credit2Round = Math.round(1000 * section2credit2) / 1000;
      let section2percentCredit2 = section2credit2 * 100;
      let section2percentCredit2Round =
        Math.round(10 * section2percentCredit2) / 10;

      let credit2 = (1 + 0.5 * section1credit2 + 2 * section2credit2) / 3.5;
      let credit2Round = Math.round(1000 * credit2) / 1000;
      let percentCredit2 = credit2 * 100;
      let percentCredit2Round = Math.round(10 * percentCredit2) / 10;

      cy.get(docCaAnchor).should("have.text", credit2Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit2Round.toString());
      cy.get(s1CaAnchor).should("have.text", section1credit2Round.toString());
      cy.get(s1PcaAnchor).should(
        "have.text",
        section1percentCredit2Round.toString(),
      );
      cy.get(s2CaAnchor).should("have.text", section2credit2Round.toString());
      cy.get(s2PcaAnchor).should(
        "have.text",
        section2percentCredit2Round.toString(),
      );
      cy.get(s21CaAnchor).should("have.text", section21credit2Round.toString());
      cy.get(s21PcaAnchor).should(
        "have.text",
        section21percentCredit2Round.toString(),
      );
      cy.get(s22CaAnchor).should("have.text", section22credit2Round.toString());
      cy.get(s22PcaAnchor).should(
        "have.text",
        section22percentCredit2Round.toString(),
      );
      cy.get(s221CaAnchor).should("have.text", "0");
      cy.get(s221PcaAnchor).should("have.text", "0");
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit2, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit2, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).closeTo(
          section1credit2,
          1e-12,
        );
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).closeTo(section1percentCredit2, 1e-12);
        expect(stateVariables["/section2"].stateValues.creditAchieved).closeTo(
          section2credit2,
          1e-12,
        );
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).closeTo(section2percentCredit2, 1e-12);
        expect(stateVariables["/section21"].stateValues.creditAchieved).closeTo(
          section21credit2,
          1e-12,
        );
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).closeTo(section21percentCredit2, 1e-12);
        expect(stateVariables["/section22"].stateValues.creditAchieved).closeTo(
          section22credit2,
          1e-12,
        );
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).closeTo(section22percentCredit2, 1e-12);
        expect(stateVariables["/section221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter most other correct answers");
      cy.get(mathinput2Anchor).type(`x{enter}`, { force: true });
      cy.get(mathinput4Anchor).type(`z{enter}`, { force: true });
      cy.get(mathinput6Anchor).type(`w{enter}`, { force: true });
      cy.get(mathinput8Anchor).type(`r{enter}`, { force: true });

      let section1credit3 = 1;
      let section1credit3Round = Math.round(1000 * section1credit3) / 1000;
      let section1percentCredit3 = section1credit3 * 100;
      let section1percentCredit3Round =
        Math.round(10 * section1percentCredit3) / 10;

      let section21credit3 = 1;
      let section21credit3Round = Math.round(1000 * section21credit3) / 1000;
      let section21percentCredit3 = section21credit3 * 100;
      let section21percentCredit3Round =
        Math.round(10 * section21percentCredit3) / 10;

      let section221credit3 = 1;
      let section221credit3Round = Math.round(1000 * section221credit3) / 1000;
      let section221percentCredit3 = section221credit3 * 100;
      let section221percentCredit3Round =
        Math.round(10 * section221percentCredit3) / 10;

      let section22credit3 = 6 / 7;
      let section22credit3Round = Math.round(1000 * section22credit3) / 1000;
      let section22percentCredit3 = section22credit3 * 100;
      let section22percentCredit3Round =
        Math.round(10 * section22percentCredit3) / 10;

      let section2credit3 =
        (1 + 3 * section21credit3 + 4 * section22credit3) / 8;
      let section2credit3Round = Math.round(1000 * section2credit3) / 1000;
      let section2percentCredit3 = section2credit3 * 100;
      let section2percentCredit3Round =
        Math.round(10 * section2percentCredit3) / 10;

      let credit3 = (1 + 0.5 * section1credit3 + 2 * section2credit3) / 3.5;
      let credit3Round = Math.round(1000 * credit3) / 1000;
      let percentCredit3 = credit3 * 100;
      let percentCredit3Round = Math.round(10 * percentCredit3) / 10;

      cy.get(docCaAnchor).should("have.text", credit3Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit3Round.toString());
      cy.get(s1CaAnchor).should("have.text", section1credit3Round.toString());
      cy.get(s1PcaAnchor).should(
        "have.text",
        section1percentCredit3Round.toString(),
      );
      cy.get(s2CaAnchor).should("have.text", section2credit3Round.toString());
      cy.get(s2PcaAnchor).should(
        "have.text",
        section2percentCredit3Round.toString(),
      );
      cy.get(s21CaAnchor).should("have.text", section21credit3Round.toString());
      cy.get(s21PcaAnchor).should(
        "have.text",
        section21percentCredit3Round.toString(),
      );
      cy.get(s22CaAnchor).should("have.text", section22credit3Round.toString());
      cy.get(s22PcaAnchor).should(
        "have.text",
        section22percentCredit3Round.toString(),
      );
      cy.get(s221CaAnchor).should(
        "have.text",
        section221credit3Round.toString(),
      );
      cy.get(s221PcaAnchor).should(
        "have.text",
        section221percentCredit3Round.toString(),
      );
      cy.get(s222CaAnchor).should("have.text", "0");
      cy.get(s222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit3, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit3, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).closeTo(
          section1credit3,
          1e-12,
        );
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).closeTo(section1percentCredit3, 1e-12);
        expect(stateVariables["/section2"].stateValues.creditAchieved).closeTo(
          section2credit3,
          1e-12,
        );
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).closeTo(section2percentCredit3, 1e-12);
        expect(stateVariables["/section21"].stateValues.creditAchieved).closeTo(
          section21credit3,
          1e-12,
        );
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).closeTo(section21percentCredit3, 1e-12);
        expect(stateVariables["/section22"].stateValues.creditAchieved).closeTo(
          section22credit3,
          1e-12,
        );
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).closeTo(section22percentCredit3, 1e-12);
        expect(
          stateVariables["/section221"].stateValues.creditAchieved,
        ).closeTo(section221credit3, 1e-12);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).closeTo(section221percentCredit3, 1e-12);
        expect(stateVariables["/section222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(0);
      });

      cy.log("enter last correct answer");
      cy.get(mathinput9Anchor).type(`s{enter}`, { force: true });

      let section1credit4 = 1;
      let section1credit4Round = Math.round(1000 * section1credit4) / 1000;
      let section1percentCredit4 = section1credit4 * 100;
      let section1percentCredit4Round =
        Math.round(10 * section1percentCredit4) / 10;

      let section21credit4 = 1;
      let section21credit4Round = Math.round(1000 * section21credit4) / 1000;
      let section21percentCredit4 = section21credit4 * 100;
      let section21percentCredit4Round =
        Math.round(10 * section21percentCredit4) / 10;

      let section221credit4 = 1;
      let section221credit4Round = Math.round(1000 * section221credit4) / 1000;
      let section221percentCredit4 = section221credit4 * 100;
      let section221percentCredit4Round =
        Math.round(10 * section221percentCredit4) / 10;

      let section222credit4 = 1;
      let section222credit4Round = Math.round(1000 * section222credit4) / 1000;
      let section222percentCredit4 = section222credit4 * 100;
      let section222percentCredit4Round =
        Math.round(10 * section222percentCredit4) / 10;

      let section22credit4 = 1;
      let section22credit4Round = Math.round(1000 * section22credit4) / 1000;
      let section22percentCredit4 = section22credit4 * 100;
      let section22percentCredit4Round =
        Math.round(10 * section22percentCredit4) / 10;

      let section2credit4 = 1;
      let section2credit4Round = Math.round(1000 * section2credit4) / 1000;
      let section2percentCredit4 = section2credit4 * 100;
      let section2percentCredit4Round =
        Math.round(10 * section2percentCredit4) / 10;

      let credit4 = (1 + section1credit4 + section2credit4) / 3;
      let credit4Round = Math.round(1000 * credit4) / 1000;
      let percentCredit4 = credit4 * 100;
      let percentCredit4Round = Math.round(10 * percentCredit4) / 10;

      cy.get(docCaAnchor).should("have.text", credit4Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit4Round.toString());
      cy.get(s1CaAnchor).should("have.text", section1credit4Round.toString());
      cy.get(s1PcaAnchor).should(
        "have.text",
        section1percentCredit4Round.toString(),
      );
      cy.get(s2CaAnchor).should("have.text", section2credit4Round.toString());
      cy.get(s2PcaAnchor).should(
        "have.text",
        section2percentCredit4Round.toString(),
      );
      cy.get(s21CaAnchor).should("have.text", section21credit4Round.toString());
      cy.get(s21PcaAnchor).should(
        "have.text",
        section21percentCredit4Round.toString(),
      );
      cy.get(s22CaAnchor).should("have.text", section22credit4Round.toString());
      cy.get(s22PcaAnchor).should(
        "have.text",
        section22percentCredit4Round.toString(),
      );
      cy.get(s221CaAnchor).should(
        "have.text",
        section221credit4Round.toString(),
      );
      cy.get(s221PcaAnchor).should(
        "have.text",
        section221percentCredit4Round.toString(),
      );
      cy.get(s222CaAnchor).should(
        "have.text",
        section222credit4Round.toString(),
      );
      cy.get(s222PcaAnchor).should(
        "have.text",
        section222percentCredit4Round.toString(),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit4, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit4, 1e-12);
        expect(stateVariables["/section1"].stateValues.creditAchieved).closeTo(
          section1credit4,
          1e-12,
        );
        expect(
          stateVariables["/section1"].stateValues.percentCreditAchieved,
        ).closeTo(section1percentCredit4, 1e-12);
        expect(stateVariables["/section2"].stateValues.creditAchieved).closeTo(
          section2credit4,
          1e-12,
        );
        expect(
          stateVariables["/section2"].stateValues.percentCreditAchieved,
        ).closeTo(section2percentCredit4, 1e-12);
        expect(stateVariables["/section21"].stateValues.creditAchieved).closeTo(
          section21credit4,
          1e-12,
        );
        expect(
          stateVariables["/section21"].stateValues.percentCreditAchieved,
        ).closeTo(section21percentCredit4, 1e-12);
        expect(stateVariables["/section22"].stateValues.creditAchieved).closeTo(
          section22credit4,
          1e-12,
        );
        expect(
          stateVariables["/section22"].stateValues.percentCreditAchieved,
        ).closeTo(section22percentCredit4, 1e-12);
        expect(
          stateVariables["/section221"].stateValues.creditAchieved,
        ).closeTo(section221credit4, 1e-12);
        expect(
          stateVariables["/section221"].stateValues.percentCreditAchieved,
        ).closeTo(section221percentCredit4, 1e-12);
        expect(
          stateVariables["/section222"].stateValues.creditAchieved,
        ).closeTo(section222credit4, 1e-12);
        expect(
          stateVariables["/section222"].stateValues.percentCreditAchieved,
        ).closeTo(section222percentCredit4, 1e-12);
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer3"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer4"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer5"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer6"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer7"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer8"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer9"].stateValues.creditAchieved).eq(1);
      });
    });
  });

  it("warning that cannot add section-wide checkwork button if not aggregating scores", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <section sectionWideCheckwork>
      <p>Enter x: <answer><mathinput />x</answer></p>
    </section>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc2("#/_p1")).should("have.text", "Enter x: ");

    cy.get(cesc2("#/_mathinput1") + " textarea").type("x{enter}", {
      force: true,
    });
    cy.get(cesc2("#/_mathinput1_correct")).should("be.visible");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(1);

      expect(errorWarnings.warnings[0].message).contain(
        `Cannot create submit all button for <section> because it doesn't aggegrate scores.`,
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(4);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(14);
    });
  });

  it("paragraphs", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <paragraphs><title>Some paragraphs</title>

    <p>Paragraph 1</p>
    <p>Paragraph 2</p>

    </paragraphs>
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_paragraphs1_title")).should(
      "have.text",
      "Some paragraphs",
    );

    cy.get(cesc("#\\/_paragraphs1") + " p:first-of-type").should(
      "have.text",
      "Paragraph 1",
    );
    cy.get(cesc("#\\/_paragraphs1") + " p:last-of-type").should(
      "have.text",
      "Paragraph 2",
    );
  });

  it("prefill mathinput in aside", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aside name="aside1">
      <title>Starting closed</title>
      <p>An expression: <mathinput name="expr1" prefill="(x+1)(x^2-1)" /></p>
      <p>The value of the expression is $expr1.value{assignNames="expr1a"}</p>
    </aside>
    <aside name="aside2" startOpen>
      <title>Starting open</title>
      <p>An expression: <mathinput name="expr2" prefill="(x-1)(x^2+1)" /></p>
      <p>The value of the expression is $expr2.value{assignNames="expr2a"}</p>
    </aside>
  
    <p>The first expression is $expr1.value{assignNames="expr1b"}</p>
    <p>The second expression is $expr2.value{assignNames="expr2b"}</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/expr1b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x+1)(x2−1)");
      });
    cy.get(cesc("#\\/expr2b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x−1)(x2+1)");
      });
    cy.get(cesc("#\\/expr1a")).should("not.exist");
    cy.get(cesc("#\\/expr2a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x−1)(x2+1)");
      });

    cy.get(cesc("#\\/expr1")).should("not.exist");
    cy.get(cesc("#\\/expr2") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x−1)(x2+1)");
      });

    cy.get(cesc("#\\/aside1_title")).click();

    cy.get(cesc("#\\/expr1a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x+1)(x2−1)");
      });
    cy.get(cesc("#\\/expr1") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x+1)(x2−1)");
      });

    cy.get(cesc("#\\/aside2_title")).click();
    cy.get(cesc("#\\/expr2a")).should("not.exist");
    cy.get(cesc("#\\/expr2")).should("not.exist");

    cy.get(cesc("#\\/expr1b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x+1)(x2−1)");
      });
    cy.get(cesc("#\\/expr2b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x−1)(x2+1)");
      });

    cy.get(cesc("#\\/expr1") + " textarea")
      .type("{end}{leftArrow}{backspace}4{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/expr1a")).should("contain.text", "(x+1)(x2−4)");
    cy.get(cesc("#\\/expr1a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x+1)(x2−4)");
      });
    cy.get(cesc("#\\/expr1") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).eq("(x+1)(x2−4)");
      });

    cy.get(cesc("#\\/expr1b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x+1)(x2−4)");
      });
    cy.get(cesc("#\\/expr2b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x−1)(x2+1)");
      });

    cy.get(cesc("#\\/aside1_title")).click();
    cy.get(cesc("#\\/expr1a")).should("not.exist");
    cy.get(cesc("#\\/expr1")).should("not.exist");

    cy.get(cesc("#\\/expr1b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x+1)(x2−4)");
      });
    cy.get(cesc("#\\/expr2b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x−1)(x2+1)");
      });

    cy.get(cesc("#\\/aside2_title")).click();

    cy.get(cesc("#\\/expr2a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x−1)(x2+1)");
      });
    cy.get(cesc("#\\/expr2") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x−1)(x2+1)");
      });

    cy.get(cesc("#\\/expr2") + " textarea")
      .type("{end}{leftArrow}{backspace}4{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/expr2a") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x−1)(x2+4)");
      });
    cy.get(cesc("#\\/expr2") + " .mq-editable-field")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).eq("(x−1)(x2+4)");
      });

    cy.get(cesc("#\\/expr1b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x+1)(x2−4)");
      });
    cy.get(cesc("#\\/expr2b") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).eq("(x−1)(x2+4)");
      });
  });

  it("copy and overwrite title", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
   
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/sec_title")).should("have.text", "Section 1: A title");
    cy.get(cesc("#\\/revised_title")).should(
      "have.text",
      "Section 2: A better title",
    );
    cy.get(cesc("#\\/title1")).should("have.text", "A title");
    cy.get(cesc("#\\/title2")).should("have.text", "A better title");
    cy.get(cesc("#\\/sectionNumber1")).should("have.text", "1");
    cy.get(cesc("#\\/sectionNumber2")).should("have.text", "2");

    cy.get(cesc("#\\/_p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/revised") + " p:first-of-type").should(
      "have.text",
      "Hello",
    );
    cy.get(cesc("#\\/_p2")).should("have.text", "Good day!");
  });

  it("copy and overwrite title, newNamespaces", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/sec_title")).should("have.text", "Section 1: A title");
    cy.get(cesc("#\\/revised_title")).should(
      "have.text",
      "Section 2: A better title",
    );
    cy.get(cesc("#\\/sec\\/_title1")).should("have.text", "A title");
    cy.get(cesc("#\\/revised\\/_title")).should("not.exist");
    cy.get(cesc("#\\/revised\\/_title2")).should("have.text", "A better title");
    cy.get(cesc("#\\/title1")).should("have.text", "A title");
    cy.get(cesc("#\\/title2")).should("have.text", "A better title");
    cy.get(cesc("#\\/sectionNumber1")).should("have.text", "1");
    cy.get(cesc("#\\/sectionNumber2")).should("have.text", "2");

    cy.get(cesc("#\\/sec\\/_p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/revised\\/_p1")).should("have.text", "Hello");
    cy.get(cesc("#\\/revised\\/_p2")).should("have.text", "Good day!");
  });

  it("Auto naming of section titles", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/sec1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/sec2_title")).should("have.text", "Section 2");
    cy.get(cesc("#\\/sec21_title")).should("have.text", "Section 2.1");
    cy.get(cesc("#\\/sec22_title")).should("have.text", "Section 2.2");
    cy.get(cesc("#\\/sec221_title")).should("have.text", "Section 2.2.1");
    cy.get(cesc("#\\/sec222_title")).should("have.text", "Section 2.2.2");
    cy.get(cesc("#\\/sec223_title")).should("have.text", "Section 2.2.3");
    cy.get(cesc("#\\/sec2231_title")).should("have.text", "Section 2.2.3.1");
    cy.get(cesc("#\\/sec23_title")).should("have.text", "Section 2.3");

    cy.get(cesc("#\\/title1")).should("have.text", "Section 1");
    cy.get(cesc("#\\/title2")).should("have.text", "Section 2");
    cy.get(cesc("#\\/title21")).should("have.text", "Section 2.1");
    cy.get(cesc("#\\/title22")).should("have.text", "Section 2.2");
    cy.get(cesc("#\\/title221")).should("have.text", "Section 2.2.1");
    cy.get(cesc("#\\/title222")).should("have.text", "Section 2.2.2");
    cy.get(cesc("#\\/title223")).should("have.text", "Section 2.2.3");
    cy.get(cesc("#\\/title2231")).should("have.text", "Section 2.2.3.1");
    cy.get(cesc("#\\/title23")).should("have.text", "Section 2.3");

    cy.get(cesc("#\\/sectionNumber1")).should("have.text", "1");
    cy.get(cesc("#\\/sectionNumber2")).should("have.text", "2");
    cy.get(cesc("#\\/sectionNumber21")).should("have.text", "2.1");
    cy.get(cesc("#\\/sectionNumber22")).should("have.text", "2.2");
    cy.get(cesc("#\\/sectionNumber221")).should("have.text", "2.2.1");
    cy.get(cesc("#\\/sectionNumber222")).should("have.text", "2.2.2");
    cy.get(cesc("#\\/sectionNumber223")).should("have.text", "2.2.3");
    cy.get(cesc("#\\/sectionNumber2231")).should("have.text", "2.2.3.1");
    cy.get(cesc("#\\/sectionNumber23")).should("have.text", "2.3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/sec1"].stateValues.level).eq(1);
      expect(stateVariables["/sec2"].stateValues.level).eq(1);
      expect(stateVariables["/sec21"].stateValues.level).eq(2);
      expect(stateVariables["/sec22"].stateValues.level).eq(2);
      expect(stateVariables["/sec221"].stateValues.level).eq(3);
      expect(stateVariables["/sec222"].stateValues.level).eq(3);
      expect(stateVariables["/sec223"].stateValues.level).eq(3);
      expect(stateVariables["/sec2231"].stateValues.level).eq(4);
      expect(stateVariables["/sec23"].stateValues.level).eq(2);
    });
  });

  it("Not auto naming of section titles with custom titles, by default", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/sec1_title")).should("have.text", "A");
    cy.get(cesc("#\\/sec2_title")).should("have.text", "B");
    cy.get(cesc("#\\/sec21_title")).should("have.text", "BA");
    cy.get(cesc("#\\/sec22_title")).should("have.text", "BB");
    cy.get(cesc("#\\/sec221_title")).should("have.text", "BBA");
    cy.get(cesc("#\\/sec222_title")).should("have.text", "BBB");
    cy.get(cesc("#\\/sec223_title")).should("have.text", "BBC");
    cy.get(cesc("#\\/sec2231_title")).should("have.text", "BBCA");
    cy.get(cesc("#\\/sec23_title")).should("have.text", "BC");

    cy.get(cesc("#\\/title1")).should("have.text", "A");
    cy.get(cesc("#\\/title2")).should("have.text", "B");
    cy.get(cesc("#\\/title21")).should("have.text", "BA");
    cy.get(cesc("#\\/title22")).should("have.text", "BB");
    cy.get(cesc("#\\/title221")).should("have.text", "BBA");
    cy.get(cesc("#\\/title222")).should("have.text", "BBB");
    cy.get(cesc("#\\/title223")).should("have.text", "BBC");
    cy.get(cesc("#\\/title2231")).should("have.text", "BBCA");
    cy.get(cesc("#\\/title23")).should("have.text", "BC");

    cy.get(cesc("#\\/sectionNumber1")).should("have.text", "1");
    cy.get(cesc("#\\/sectionNumber2")).should("have.text", "2");
    cy.get(cesc("#\\/sectionNumber21")).should("have.text", "2.1");
    cy.get(cesc("#\\/sectionNumber22")).should("have.text", "2.2");
    cy.get(cesc("#\\/sectionNumber221")).should("have.text", "2.2.1");
    cy.get(cesc("#\\/sectionNumber222")).should("have.text", "2.2.2");
    cy.get(cesc("#\\/sectionNumber223")).should("have.text", "2.2.3");
    cy.get(cesc("#\\/sectionNumber2231")).should("have.text", "2.2.3.1");
    cy.get(cesc("#\\/sectionNumber23")).should("have.text", "2.3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/sec1"].stateValues.level).eq(1);
      expect(stateVariables["/sec2"].stateValues.level).eq(1);
      expect(stateVariables["/sec21"].stateValues.level).eq(2);
      expect(stateVariables["/sec22"].stateValues.level).eq(2);
      expect(stateVariables["/sec221"].stateValues.level).eq(3);
      expect(stateVariables["/sec222"].stateValues.level).eq(3);
      expect(stateVariables["/sec223"].stateValues.level).eq(3);
      expect(stateVariables["/sec2231"].stateValues.level).eq(4);
      expect(stateVariables["/sec23"].stateValues.level).eq(2);
    });
  });

  it("Add auto number to section titles with custom titles", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/sec1_title")).should("have.text", "1. A");
    cy.get(cesc("#\\/sec2_title")).should("have.text", "2. B");
    cy.get(cesc("#\\/sec21_title")).should("have.text", "2.1. BA");
    cy.get(cesc("#\\/sec22_title")).should("have.text", "2.2. BB");
    cy.get(cesc("#\\/sec221_title")).should("have.text", "2.2.1. BBA");
    cy.get(cesc("#\\/sec222_title")).should("have.text", "2.2.2. BBB");
    cy.get(cesc("#\\/sec223_title")).should("have.text", "2.2.3. BBC");
    cy.get(cesc("#\\/sec2231_title")).should("have.text", "2.2.3.1. BBCA");
    cy.get(cesc("#\\/sec23_title")).should("have.text", "2.3. BC");

    cy.get(cesc("#\\/title1")).should("have.text", "A");
    cy.get(cesc("#\\/title2")).should("have.text", "B");
    cy.get(cesc("#\\/title21")).should("have.text", "BA");
    cy.get(cesc("#\\/title22")).should("have.text", "BB");
    cy.get(cesc("#\\/title221")).should("have.text", "BBA");
    cy.get(cesc("#\\/title222")).should("have.text", "BBB");
    cy.get(cesc("#\\/title223")).should("have.text", "BBC");
    cy.get(cesc("#\\/title2231")).should("have.text", "BBCA");
    cy.get(cesc("#\\/title23")).should("have.text", "BC");

    cy.get(cesc("#\\/sectionNumber1")).should("have.text", "1");
    cy.get(cesc("#\\/sectionNumber2")).should("have.text", "2");
    cy.get(cesc("#\\/sectionNumber21")).should("have.text", "2.1");
    cy.get(cesc("#\\/sectionNumber22")).should("have.text", "2.2");
    cy.get(cesc("#\\/sectionNumber221")).should("have.text", "2.2.1");
    cy.get(cesc("#\\/sectionNumber222")).should("have.text", "2.2.2");
    cy.get(cesc("#\\/sectionNumber223")).should("have.text", "2.2.3");
    cy.get(cesc("#\\/sectionNumber2231")).should("have.text", "2.2.3.1");
    cy.get(cesc("#\\/sectionNumber23")).should("have.text", "2.3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/sec1"].stateValues.level).eq(1);
      expect(stateVariables["/sec2"].stateValues.level).eq(1);
      expect(stateVariables["/sec21"].stateValues.level).eq(2);
      expect(stateVariables["/sec22"].stateValues.level).eq(2);
      expect(stateVariables["/sec221"].stateValues.level).eq(3);
      expect(stateVariables["/sec222"].stateValues.level).eq(3);
      expect(stateVariables["/sec223"].stateValues.level).eq(3);
      expect(stateVariables["/sec2231"].stateValues.level).eq(4);
      expect(stateVariables["/sec23"].stateValues.level).eq(2);
    });
  });

  it("Add auto name and number to section titles with custom titles", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/sec1_title")).should("have.text", "Section 1: A");
    cy.get(cesc("#\\/sec2_title")).should("have.text", "Section 2: B");
    cy.get(cesc("#\\/sec21_title")).should("have.text", "Section 2.1: BA");
    cy.get(cesc("#\\/sec22_title")).should("have.text", "Section 2.2: BB");
    cy.get(cesc("#\\/sec221_title")).should("have.text", "Section 2.2.1: BBA");
    cy.get(cesc("#\\/sec222_title")).should("have.text", "Section 2.2.2: BBB");
    cy.get(cesc("#\\/sec223_title")).should("have.text", "Section 2.2.3: BBC");
    cy.get(cesc("#\\/sec2231_title")).should(
      "have.text",
      "Section 2.2.3.1: BBCA",
    );
    cy.get(cesc("#\\/sec23_title")).should("have.text", "Section 2.3: BC");

    cy.get(cesc("#\\/title1")).should("have.text", "A");
    cy.get(cesc("#\\/title2")).should("have.text", "B");
    cy.get(cesc("#\\/title21")).should("have.text", "BA");
    cy.get(cesc("#\\/title22")).should("have.text", "BB");
    cy.get(cesc("#\\/title221")).should("have.text", "BBA");
    cy.get(cesc("#\\/title222")).should("have.text", "BBB");
    cy.get(cesc("#\\/title223")).should("have.text", "BBC");
    cy.get(cesc("#\\/title2231")).should("have.text", "BBCA");
    cy.get(cesc("#\\/title23")).should("have.text", "BC");

    cy.get(cesc("#\\/sectionNumber1")).should("have.text", "1");
    cy.get(cesc("#\\/sectionNumber2")).should("have.text", "2");
    cy.get(cesc("#\\/sectionNumber21")).should("have.text", "2.1");
    cy.get(cesc("#\\/sectionNumber22")).should("have.text", "2.2");
    cy.get(cesc("#\\/sectionNumber221")).should("have.text", "2.2.1");
    cy.get(cesc("#\\/sectionNumber222")).should("have.text", "2.2.2");
    cy.get(cesc("#\\/sectionNumber223")).should("have.text", "2.2.3");
    cy.get(cesc("#\\/sectionNumber2231")).should("have.text", "2.2.3.1");
    cy.get(cesc("#\\/sectionNumber23")).should("have.text", "2.3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/sec1"].stateValues.level).eq(1);
      expect(stateVariables["/sec2"].stateValues.level).eq(1);
      expect(stateVariables["/sec21"].stateValues.level).eq(2);
      expect(stateVariables["/sec22"].stateValues.level).eq(2);
      expect(stateVariables["/sec221"].stateValues.level).eq(3);
      expect(stateVariables["/sec222"].stateValues.level).eq(3);
      expect(stateVariables["/sec223"].stateValues.level).eq(3);
      expect(stateVariables["/sec2231"].stateValues.level).eq(4);
      expect(stateVariables["/sec23"].stateValues.level).eq(2);
    });
  });

  it("Add auto name to section titles with custom titles", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/sec1_title")).should("have.text", "Section: A");
    cy.get(cesc("#\\/sec2_title")).should("have.text", "Section: B");
    cy.get(cesc("#\\/sec21_title")).should("have.text", "Section: BA");
    cy.get(cesc("#\\/sec22_title")).should("have.text", "Section: BB");
    cy.get(cesc("#\\/sec221_title")).should("have.text", "Section: BBA");
    cy.get(cesc("#\\/sec222_title")).should("have.text", "Section: BBB");
    cy.get(cesc("#\\/sec223_title")).should("have.text", "Section: BBC");
    cy.get(cesc("#\\/sec2231_title")).should("have.text", "Section: BBCA");
    cy.get(cesc("#\\/sec23_title")).should("have.text", "Section: BC");

    cy.get(cesc("#\\/title1")).should("have.text", "A");
    cy.get(cesc("#\\/title2")).should("have.text", "B");
    cy.get(cesc("#\\/title21")).should("have.text", "BA");
    cy.get(cesc("#\\/title22")).should("have.text", "BB");
    cy.get(cesc("#\\/title221")).should("have.text", "BBA");
    cy.get(cesc("#\\/title222")).should("have.text", "BBB");
    cy.get(cesc("#\\/title223")).should("have.text", "BBC");
    cy.get(cesc("#\\/title2231")).should("have.text", "BBCA");
    cy.get(cesc("#\\/title23")).should("have.text", "BC");

    cy.get(cesc("#\\/sectionNumber1")).should("have.text", "1");
    cy.get(cesc("#\\/sectionNumber2")).should("have.text", "2");
    cy.get(cesc("#\\/sectionNumber21")).should("have.text", "2.1");
    cy.get(cesc("#\\/sectionNumber22")).should("have.text", "2.2");
    cy.get(cesc("#\\/sectionNumber221")).should("have.text", "2.2.1");
    cy.get(cesc("#\\/sectionNumber222")).should("have.text", "2.2.2");
    cy.get(cesc("#\\/sectionNumber223")).should("have.text", "2.2.3");
    cy.get(cesc("#\\/sectionNumber2231")).should("have.text", "2.2.3.1");
    cy.get(cesc("#\\/sectionNumber23")).should("have.text", "2.3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/sec1"].stateValues.level).eq(1);
      expect(stateVariables["/sec2"].stateValues.level).eq(1);
      expect(stateVariables["/sec21"].stateValues.level).eq(2);
      expect(stateVariables["/sec22"].stateValues.level).eq(2);
      expect(stateVariables["/sec221"].stateValues.level).eq(3);
      expect(stateVariables["/sec222"].stateValues.level).eq(3);
      expect(stateVariables["/sec223"].stateValues.level).eq(3);
      expect(stateVariables["/sec2231"].stateValues.level).eq(4);
      expect(stateVariables["/sec23"].stateValues.level).eq(2);
    });
  });

  it("Add auto name and number to section titles with custom titles, turning off include parent number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/sec1_title")).should("have.text", "Section 1: A");
    cy.get(cesc("#\\/sec2_title")).should("have.text", "Section 2: B");
    cy.get(cesc("#\\/sec21_title")).should("have.text", "Section 2.1: BA");
    cy.get(cesc("#\\/sec211_title")).should("have.text", "Section 1: BAA");
    cy.get(cesc("#\\/sec2111_title")).should("have.text", "Section 1.1: BAAA");
    cy.get(cesc("#\\/sec2112_title")).should("have.text", "Section 1.2: BAAB");
    cy.get(cesc("#\\/sec22_title")).should("have.text", "Section 2: BB");
    cy.get(cesc("#\\/sec221_title")).should("have.text", "Section 2.1: BBA");
    cy.get(cesc("#\\/sec222_title")).should("have.text", "Section 2.2: BBB");
    cy.get(cesc("#\\/sec223_title")).should("have.text", "Section 2.3: BBC");
    cy.get(cesc("#\\/sec2231_title")).should(
      "have.text",
      "Section 2.3.1: BBCA",
    );
    cy.get(cesc("#\\/sec23_title")).should("have.text", "Section 2.3: BC");

    cy.get(cesc("#\\/title1")).should("have.text", "A");
    cy.get(cesc("#\\/title2")).should("have.text", "B");
    cy.get(cesc("#\\/title21")).should("have.text", "BA");
    cy.get(cesc("#\\/title211")).should("have.text", "BAA");
    cy.get(cesc("#\\/title2111")).should("have.text", "BAAA");
    cy.get(cesc("#\\/title2112")).should("have.text", "BAAB");
    cy.get(cesc("#\\/title22")).should("have.text", "BB");
    cy.get(cesc("#\\/title221")).should("have.text", "BBA");
    cy.get(cesc("#\\/title222")).should("have.text", "BBB");
    cy.get(cesc("#\\/title223")).should("have.text", "BBC");
    cy.get(cesc("#\\/title2231")).should("have.text", "BBCA");
    cy.get(cesc("#\\/title23")).should("have.text", "BC");

    cy.get(cesc("#\\/sectionNumber1")).should("have.text", "1");
    cy.get(cesc("#\\/sectionNumber2")).should("have.text", "2");
    cy.get(cesc("#\\/sectionNumber21")).should("have.text", "2.1");
    cy.get(cesc("#\\/sectionNumber211")).should("have.text", "1");
    cy.get(cesc("#\\/sectionNumber2111")).should("have.text", "1.1");
    cy.get(cesc("#\\/sectionNumber2112")).should("have.text", "1.2");
    cy.get(cesc("#\\/sectionNumber22")).should("have.text", "2");
    cy.get(cesc("#\\/sectionNumber221")).should("have.text", "2.1");
    cy.get(cesc("#\\/sectionNumber222")).should("have.text", "2.2");
    cy.get(cesc("#\\/sectionNumber223")).should("have.text", "2.3");
    cy.get(cesc("#\\/sectionNumber2231")).should("have.text", "2.3.1");
    cy.get(cesc("#\\/sectionNumber23")).should("have.text", "2.3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/sec1"].stateValues.level).eq(1);
      expect(stateVariables["/sec2"].stateValues.level).eq(1);
      expect(stateVariables["/sec21"].stateValues.level).eq(2);
      expect(stateVariables["/sec211"].stateValues.level).eq(3);
      expect(stateVariables["/sec2111"].stateValues.level).eq(4);
      expect(stateVariables["/sec2112"].stateValues.level).eq(4);
      expect(stateVariables["/sec22"].stateValues.level).eq(2);
      expect(stateVariables["/sec221"].stateValues.level).eq(3);
      expect(stateVariables["/sec222"].stateValues.level).eq(3);
      expect(stateVariables["/sec223"].stateValues.level).eq(3);
      expect(stateVariables["/sec2231"].stateValues.level).eq(4);
      expect(stateVariables["/sec23"].stateValues.level).eq(2);
    });
  });

  // TODO: reinstate this test
  // Temporarily skipping due to stopgap solution of reverting new type of section
  it.skip("Add auto name to aside", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/aside1_title")).should("contain.text", "Aside 1");
    cy.get(cesc("#\\/aside1_title")).should("not.contain.text", ":");
    cy.get(cesc("#\\/aside2_title")).should(
      "contain.text",
      "Aside: Side point",
    );
    cy.get(cesc("#\\/aside3_title")).should(
      "contain.text",
      "Aside 3: Another side point",
    );
    cy.get(cesc("#\\/title1")).should("have.text", "Aside 1");
    cy.get(cesc("#\\/title2")).should("have.text", "Side point");
    cy.get(cesc("#\\/title3")).should("have.text", "Another side point");

    cy.get(cesc("#\\/aside3_title")).click();

    cy.get(cesc("#\\/aside31_title")).should("contain.text", "Subpoint");
    cy.get(cesc("#\\/aside31_title")).should("not.contain.text", "1");
    cy.get(cesc("#\\/aside31_title")).should("not.contain.text", ":");
    cy.get(cesc("#\\/aside32_title")).should("contain.text", "Aside 5 ");
    cy.get(cesc("#\\/aside32_title")).should("not.contain.text", ":");

    cy.get(cesc("#\\/title31")).should("have.text", "Subpoint");
    cy.get(cesc("#\\/title32")).should("have.text", "Aside 5");
  });

  it("Example, problems, exercise do not include parent number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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



    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/sec1_title")).should("have.text", "Section 1");
    cy.get(cesc("#\\/prob11_title")).should("have.text", "Problem 1");
    cy.get(cesc("#\\/exer11_title")).should("have.text", "Exercise 2");
    cy.get(cesc("#\\/exam11_title")).should("have.text", "Example 3");
    cy.get(cesc("#\\/prob12_title")).should("have.text", "Problem 4");
    cy.get(cesc("#\\/exer12_title")).should("have.text", "Exercise 5");
    cy.get(cesc("#\\/exam12_title")).should("have.text", "Example 6");

    cy.get(cesc("#\\/titleProb11")).should("have.text", "Problem 1");
    cy.get(cesc("#\\/titleExer11")).should("have.text", "Exercise 2");
    cy.get(cesc("#\\/titleExam11")).should("have.text", "Example 3");
    cy.get(cesc("#\\/titleProb12")).should("have.text", "Problem 4");
    cy.get(cesc("#\\/titleExer12")).should("have.text", "Exercise 5");
    cy.get(cesc("#\\/titleExam12")).should("have.text", "Example 6");

    cy.get(cesc("#\\/sectionNumberProb11")).should("have.text", "1");
    cy.get(cesc("#\\/sectionNumberExer11")).should("have.text", "2");
    cy.get(cesc("#\\/sectionNumberExam11")).should("have.text", "3");
    cy.get(cesc("#\\/sectionNumberProb12")).should("have.text", "4");
    cy.get(cesc("#\\/sectionNumberExer12")).should("have.text", "5");
    cy.get(cesc("#\\/sectionNumberExam12")).should("have.text", "6");
  });

  it("Can open aside in read only mode", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_readOnly").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <aside name="aside1">
        <title>Hello</title>
        <p>Content</p>
      </aside>

      <p><textinput name="ti" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/aside1_title")).should("contain.text", "Hello");
    cy.get(cesc("#\\/_p1")).should("not.exist");
    cy.get(cesc("#\\/ti_input")).should("be.disabled");

    cy.get(cesc("#\\/aside1_title")).click();
    cy.get(cesc("#\\/_p1")).should("have.text", "Content");

    cy.get(cesc("#\\/aside1_title")).click();
    cy.get(cesc("#\\/_p1")).should("not.exist");
  });

  it("Exercise with statement, hint, givenanswer, and solution", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_title1")).should("have.text", "An exercise");

    cy.get(cesc("#\\/_statement1")).should("have.text", "The exercise");

    cy.get(cesc("#\\/_hint1") + " [data-test=hint-heading]").should(
      "contain.text",
      "Hint",
    );
    cy.get(cesc("#\\/_hint1")).should("not.contain.text", "Try harder");
    cy.get(cesc("#\\/_givenanswer1")).should("contain.text", "Answer");
    cy.get(cesc("#\\/_givenanswer1")).should(
      "not.contain.text",
      "The correct answer",
    );
    cy.get(cesc("#\\/_solution1")).should("contain.text", "Solution");
    cy.get(cesc("#\\/_solution1")).should(
      "not.contain.text",
      "Here's how you do it.",
    );

    cy.get(cesc("#\\/_hint1") + " [data-test=hint-heading]").click();
    cy.get(cesc("#\\/_hint1")).should("contain.text", "Try harder");
    cy.get(cesc("#\\/_givenanswer1")).should(
      "not.contain.text",
      "The correct answer",
    );
    cy.get(cesc("#\\/_solution1")).should(
      "not.contain.text",
      "Here's how you do it.",
    );

    cy.get(cesc("#\\/_givenanswer1_button")).click();
    cy.get(cesc("#\\/_givenanswer1")).should(
      "contain.text",
      "The correct answer",
    );
    cy.get(cesc("#\\/_hint1")).should("contain.text", "Try harder");
    cy.get(cesc("#\\/_solution1")).should(
      "not.contain.text",
      "Here's how you do it.",
    );

    cy.get(cesc("#\\/_solution1_button")).click();
    cy.get(cesc("#\\/_solution1")).should(
      "contain.text",
      "Here's how you do it.",
    );
    cy.get(cesc("#\\/_hint1")).should("contain.text", "Try harder");
    cy.get(cesc("#\\/_givenanswer1")).should(
      "contain.text",
      "The correct answer",
    );
  });

  it("Section with introduction, subsections and conclusion", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_title1")).should("have.text", "A section");

    cy.get(cesc("#\\/_introduction1")).should(
      "have.text",
      "\n    First this\n    Then that\n    Hello World\n  ",
    );

    cy.get(cesc("#\\/_subsection1")).should(
      "have.text",
      " Point 1\n    \n    Make the first point\n   ",
    );
    cy.get(cesc("#\\/_subsection2")).should(
      "have.text",
      " Point 2\n    \n    Make the second point\n   ",
    );

    cy.get(cesc("#\\/_conclusion1")).should(
      "have.text",
      "\n    Wrap it up!\n  ",
    );
  });

  it("Objectives", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

<section>
  <title>A section</title>
  <objectives>
    <text>Hello</text> <text>World</text>
  </objectives>
  <p>Is objectives boxed? $_objectives1.boxed</p>
</section>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_title1")).should("have.text", "A section");

    cy.get(cesc("#\\/_objectives1_title")).should("have.text", "Objectives 1");
    cy.get(cesc("#\\/_objectives1")).should("contain.text", "Hello World");

    cy.get(cesc("#\\/_p1")).should("have.text", "Is objectives boxed? true");
  });

  it("Activity", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

<section>
  <title>A section</title>
  <activity>
    <text>Hello</text> <text>World</text>
  </activity>
  <p>Is activity boxed? $_activity1.boxed</p>
</section>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_title1")).should("have.text", "A section");

    cy.get(cesc("#\\/_activity1_title")).should("have.text", "Activity 1");
    cy.get(cesc("#\\/_activity1")).should("contain.text", "Hello World");

    cy.get(cesc("#\\/_p1")).should("have.text", "Is activity boxed? false");
  });

  it("Definition", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

<section>
  <title>A section</title>
  <definition>
    <text>Hello</text> <text>World</text>
  </definition>
  <p>Is definition boxed? $_definition1.boxed</p>
</section>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_title1")).should("have.text", "A section");

    cy.get(cesc("#\\/_definition1_title")).should("have.text", "Definition 1");
    cy.get(cesc("#\\/_definition1")).should("contain.text", "Hello World");

    cy.get(cesc("#\\/_p1")).should("have.text", "Is definition boxed? false");
  });

  it("Note", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

<section>
  <title>A section</title>
  <note>
    <text>Hello</text> <text>World</text>
  </note>
  <p>Is note boxed? $_note1.boxed</p>
</section>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_title1")).should("have.text", "A section");

    cy.get(cesc("#\\/_note1_title")).should("have.text", "Note 1");
    cy.get(cesc("#\\/_note1")).should("contain.text", "Hello World");

    cy.get(cesc("#\\/_p1")).should("have.text", "Is note boxed? false");
  });

  // TODO: reinstate this test
  // Temporarily skipping due to stopgap solution of reverting new type of section
  it.skip("Theorem elements", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

<section>
  <title>A section</title>
  <theorem>
    <statement>The statement</statement>
    <proof>The proof</proof>
  </theorem>
  <theorem renameTo="Corollary">
    <statement>The statement</statement>
    <proof>The proof</proof>
  </theorem>
</section>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_title1")).should("have.text", "A section");

    cy.get(cesc("#\\/_theorem1_title")).should("have.text", "Theorem 1");
    cy.get(cesc("#\\/_statement1")).should("have.text", "The statement");
    cy.get(cesc("#\\/_proof1_title")).should("contain.text", "Proof");
    cy.get(cesc("#\\/_proof1_title")).should("contain.text", "Proof");
    cy.get(cesc("#\\/_proof1")).should("not.contain.text", "The proof");
    cy.get(cesc("#\\/_proof1_title")).click();
    cy.get(cesc("#\\/_proof1")).should("contain.text", "The proof");

    cy.get(cesc("#\\/_theorem2_title")).should("have.text", "Corollary 2");
    cy.get(cesc("#\\/_statement2")).should("have.text", "The statement");
    cy.get(cesc("#\\/_proof2_title")).should("contain.text", "Proof");
    cy.get(cesc("#\\/_proof2")).should("not.contain.text", "The proof");
    cy.get(cesc("#\\/_proof2_title")).click();
    cy.get(cesc("#\\/_proof2")).should("contain.text", "The proof");
  });

  // TODO: reinstate this test
  // Temporarily skipping due to stopgap solution of reverting new type of section
  it.skip("Sections number independently of other sectioning elements", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

<section name="sec1">
  <objectives name="obj1">
    <ul>
      <li>First</li>
      <li>Second</li>
    </ul>
  </objectives>
  <definition name="exp2">
    An definition
  </definition>
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
  <objectives renameTo="Outcomes" name="out6">
    <ul>
      <li>First</li>
      <li>Second</li>
    </ul>
  </objectives>
</section>
<section name="sec2">
  <objectives name="obj7">
  <ul>
    <li>First 2</li>
    <li>Second 2</li>
  </ul>
  </objectives>
  <section name="sec2-1">
    <definition name="exp8">
      Another definition
    </definition>
  </section>
</section>

    `,
        },
        "*",
      );
    });

    // Note: not sure if this is how we want numbering to work long term,
    // but this test at least documents how it is working now.

    cy.get(cesc("#\\/sec1_title")).should("have.text", "Section 1");

    cy.get(cesc("#\\/obj1_title")).should("have.text", "Objectives 1");
    cy.get(cesc("#\\/exp2_title")).should("have.text", "Definition 2");
    cy.get(cesc("#\\/sec1-1_title")).should("have.text", "Section 1.1");
    cy.get(cesc("#\\/act3_title")).should("have.text", "Activity 3");
    cy.get(cesc("#\\/sec1-2_title")).should("have.text", "Section 1.2");
    cy.get(cesc("#\\/aside4_title")).should("contain.text", "Aside 4");
    cy.get(cesc("#\\/act5_title")).should("have.text", "Activity 5");
    cy.get(cesc("#\\/out6_title")).should("have.text", "Outcomes 6");

    cy.get(cesc("#\\/sec2_title")).should("have.text", "Section 2");

    cy.get(cesc("#\\/obj7_title")).should("have.text", "Objectives 7");
    cy.get(cesc("#\\/sec2-1_title")).should("have.text", "Section 2.1");
  });

  it("Problems tag causes child sections to be rendered as a list", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <problem name="aProb" newNamespace>
      <title>This is a problem</title>
      <p>Here is a problem!</p>
  
      <ol>
        <li>Item 1</li>
        <li>Item 2</li>
      </ol>
    </problem>
  
    <exercises name="exercises">
      <problem name="prob1" newNamespace>
        <p>We don't have a title, but we have a list.</p>
          
        <ol>
          <li>Item A</li>
          <li>Item B</li>
        </ol>
      </problem>
      <problem name="prob2" newNamespace>
      <title>A titled problem</title>
        <p>Work hard</p>
      </problem>
  
      $aProb{name='aProbb'}
    </exercises>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/aProb_title")).should("have.text", "This is a problem");
    cy.get(cesc("#\\/aProb\\/_ol1")).should(
      "have.css",
      "list-style-type",
      "decimal",
    );

    cy.get(cesc("#\\/exercises") + " li")
      .eq(0)
      .should("contain.text", "We don't have a title, but we have a list.");

    cy.get(cesc("#\\/prob1_title")).should("have.text", "");
    cy.get(cesc("#\\/prob1\\/_ol1")).should(
      "have.css",
      "list-style-type",
      "lower-alpha",
    );

    cy.get(cesc("#\\/prob2_title")).should("have.text", "A titled problem");

    cy.get(cesc("#\\/aProbb_title")).should("have.text", "This is a problem");
    cy.get(cesc("#\\/aProbb\\/_ol1")).should(
      "have.css",
      "list-style-type",
      "lower-alpha",
    );
  });

  it("As list attribute causes child sections to be rendered as a list", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <problem name="aProb" newNamespace>
      <title>This is a problem</title>
      <p>Here is a problem!</p>
  
      <ol>
        <li>Item 1</li>
        <li>Item 2</li>
      </ol>
    </problem>
  
    <section name="exercises" asList>
      <problem name="prob1" newNamespace>
        <p>We don't have a title, but we have a list.</p>
          
        <ol>
          <li>Item A</li>
          <li>Item B</li>
        </ol>
      </problem>
      <problem name="prob2" newNamespace>
      <title>A titled problem</title>
        <p>Work hard</p>
      </problem>
  
      $aProb{name='aProbb'}
    </section>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/aProb_title")).should("have.text", "This is a problem");
    cy.get(cesc("#\\/aProb\\/_ol1")).should(
      "have.css",
      "list-style-type",
      "decimal",
    );

    cy.get(cesc("#\\/exercises") + " li")
      .eq(0)
      .should("contain.text", "We don't have a title, but we have a list.");

    cy.get(cesc("#\\/prob1_title")).should("have.text", "");
    cy.get(cesc("#\\/prob1\\/_ol1")).should(
      "have.css",
      "list-style-type",
      "lower-alpha",
    );

    cy.get(cesc("#\\/prob2_title")).should("have.text", "A titled problem");

    cy.get(cesc("#\\/aProbb_title")).should("have.text", "This is a problem");
    cy.get(cesc("#\\/aProbb\\/_ol1")).should(
      "have.css",
      "list-style-type",
      "lower-alpha",
    );
  });
});
