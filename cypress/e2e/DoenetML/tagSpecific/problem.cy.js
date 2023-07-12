import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Problem Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("problems default to weight 1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Activity</title>
    <p>Credit achieved for $_document1.title:
    $_document1.creditAchieved{name="docCa"}, or $_document1.percentCreditAchieved{name="docPca"}%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <problem name="problem1"><title>Problem 1</title>
      <p>Credit achieved for $problem1.title:
      $problem1.creditAchieved{name="p1Ca"}, or $problem1.percentCreditAchieved{name="p1Pca"}%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </problem>
    <problem name="problem2"><title>Problem 2</title>
      <p>Credit achieved for $problem2.title:
      $problem2.creditAchieved{name="p2Ca"}, or $problem2.percentCreditAchieved{name="p2Pca"}%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <problem name="problem21"><title>Problem 2.1</title>
        <p>Credit achieved for $problem21.title:
        $problem21.creditAchieved{name="p21Ca"}, or $problem21.percentCreditAchieved{name="p21Pca"}%</p>

        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </problem>
      <problem name="problem22"><title>Problem 2.2</title>
        <p>Credit achieved for $problem22.title:
        $problem22.creditAchieved{name="p22Ca"}, or $problem22.percentCreditAchieved{name="p22Pca"}%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <problem name="problem221"><title>Problem 2.2.1</title>
          <p>Credit achieved for $problem221.title:
          $problem221.creditAchieved{name="p221Ca"}, or $problem221.percentCreditAchieved{name="p221Pca"}%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </problem>
        <problem name="problem222"><title>Problem 2.2.2</title>
          <p>Credit achieved for $problem222.title:
          $problem222.creditAchieved{name="p222Ca"}, or $problem222.percentCreditAchieved{name="p222Pca"}%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </problem>
      </problem>

    </problem>
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
      let p1CaAnchor = cesc2(
        "#" + stateVariables["/p1Ca"].replacements[0].componentName,
      );
      let p1PcaAnchor = cesc2(
        "#" + stateVariables["/p1Pca"].replacements[0].componentName,
      );
      let p2CaAnchor = cesc2(
        "#" + stateVariables["/p2Ca"].replacements[0].componentName,
      );
      let p2PcaAnchor = cesc2(
        "#" + stateVariables["/p2Pca"].replacements[0].componentName,
      );
      let p21CaAnchor = cesc2(
        "#" + stateVariables["/p21Ca"].replacements[0].componentName,
      );
      let p21PcaAnchor = cesc2(
        "#" + stateVariables["/p21Pca"].replacements[0].componentName,
      );
      let p22CaAnchor = cesc2(
        "#" + stateVariables["/p22Ca"].replacements[0].componentName,
      );
      let p22PcaAnchor = cesc2(
        "#" + stateVariables["/p22Pca"].replacements[0].componentName,
      );
      let p221CaAnchor = cesc2(
        "#" + stateVariables["/p221Ca"].replacements[0].componentName,
      );
      let p221PcaAnchor = cesc2(
        "#" + stateVariables["/p221Pca"].replacements[0].componentName,
      );
      let p222CaAnchor = cesc2(
        "#" + stateVariables["/p222Ca"].replacements[0].componentName,
      );
      let p222PcaAnchor = cesc2(
        "#" + stateVariables["/p222Pca"].replacements[0].componentName,
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
      cy.get(p1CaAnchor).should("have.text", "0");
      cy.get(p1PcaAnchor).should("have.text", "0");
      cy.get(p2CaAnchor).should("have.text", "0");
      cy.get(p2PcaAnchor).should("have.text", "0");
      cy.get(p21CaAnchor).should("have.text", "0");
      cy.get(p21PcaAnchor).should("have.text", "0");
      cy.get(p22CaAnchor).should("have.text", "0");
      cy.get(p22PcaAnchor).should("have.text", "0");
      cy.get(p221CaAnchor).should("have.text", "0");
      cy.get(p221PcaAnchor).should("have.text", "0");
      cy.get(p222CaAnchor).should("have.text", "0");
      cy.get(p222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_document1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem222"].stateValues.percentCreditAchieved,
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
      cy.get(p1CaAnchor).should("have.text", "0");
      cy.get(p1PcaAnchor).should("have.text", "0");
      cy.get(p2CaAnchor).should("have.text", "0");
      cy.get(p2PcaAnchor).should("have.text", "0");
      cy.get(p21CaAnchor).should("have.text", "0");
      cy.get(p21PcaAnchor).should("have.text", "0");
      cy.get(p22CaAnchor).should("have.text", "0");
      cy.get(p22PcaAnchor).should("have.text", "0");
      cy.get(p221CaAnchor).should("have.text", "0");
      cy.get(p221PcaAnchor).should("have.text", "0");
      cy.get(p222CaAnchor).should("have.text", "0");
      cy.get(p222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit1, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit1, 1e-12);
        expect(stateVariables["/problem1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem222"].stateValues.percentCreditAchieved,
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

      let problem1credit2 = 2 / 3;
      let problem1credit2Round = Math.round(1000 * problem1credit2) / 1000;
      let problem1percentCredit2 = problem1credit2 * 100;
      let problem1percentCredit2Round =
        Math.round(10 * problem1percentCredit2) / 10;

      let problem21credit2 = 1 / 3;
      let problem21credit2Round = Math.round(1000 * problem21credit2) / 1000;
      let problem21percentCredit2 = problem21credit2 * 100;
      let problem21percentCredit2Round =
        Math.round(10 * problem21percentCredit2) / 10;

      let problem22credit2 = 1 / 3;
      let problem22credit2Round = Math.round(1000 * problem22credit2) / 1000;
      let problem22percentCredit2 = problem22credit2 * 100;
      let problem22percentCredit2Round =
        Math.round(10 * problem22percentCredit2) / 10;

      let problem2credit2 = (problem21credit2 + problem22credit2) / 3;
      let problem2credit2Round = Math.round(1000 * problem2credit2) / 1000;
      let problem2percentCredit2 = problem2credit2 * 100;
      let problem2percentCredit2Round =
        Math.round(10 * problem2percentCredit2) / 10;

      let credit2 = (1 + problem1credit2 + problem2credit2) / 3;
      let credit2Round = Math.round(1000 * credit2) / 1000;
      let percentCredit2 = credit2 * 100;
      let percentCredit2Round = Math.round(10 * percentCredit2) / 10;

      cy.get(docCaAnchor).should("have.text", credit2Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit2Round.toString());
      cy.get(p1CaAnchor).should("have.text", problem1credit2Round.toString());
      cy.get(p1PcaAnchor).should(
        "have.text",
        problem1percentCredit2Round.toString(),
      );
      cy.get(p2CaAnchor).should("have.text", problem2credit2Round.toString());
      cy.get(p2PcaAnchor).should(
        "have.text",
        problem2percentCredit2Round.toString(),
      );
      cy.get(p21CaAnchor).should("have.text", problem21credit2Round.toString());
      cy.get(p21PcaAnchor).should(
        "have.text",
        problem21percentCredit2Round.toString(),
      );
      cy.get(p22CaAnchor).should("have.text", problem22credit2Round.toString());
      cy.get(p22PcaAnchor).should(
        "have.text",
        problem22percentCredit2Round.toString(),
      );
      cy.get(p221CaAnchor).should("have.text", "0");
      cy.get(p221PcaAnchor).should("have.text", "0");
      cy.get(p222CaAnchor).should("have.text", "0");
      cy.get(p222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit2, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit2, 1e-12);
        expect(stateVariables["/problem1"].stateValues.creditAchieved).closeTo(
          problem1credit2,
          1e-12,
        );
        expect(
          stateVariables["/problem1"].stateValues.percentCreditAchieved,
        ).closeTo(problem1percentCredit2, 1e-12);
        expect(stateVariables["/problem2"].stateValues.creditAchieved).closeTo(
          problem2credit2,
          1e-12,
        );
        expect(
          stateVariables["/problem2"].stateValues.percentCreditAchieved,
        ).closeTo(problem2percentCredit2, 1e-12);
        expect(stateVariables["/problem21"].stateValues.creditAchieved).closeTo(
          problem21credit2,
          1e-12,
        );
        expect(
          stateVariables["/problem21"].stateValues.percentCreditAchieved,
        ).closeTo(problem21percentCredit2, 1e-12);
        expect(stateVariables["/problem22"].stateValues.creditAchieved).closeTo(
          problem22credit2,
          1e-12,
        );
        expect(
          stateVariables["/problem22"].stateValues.percentCreditAchieved,
        ).closeTo(problem22percentCredit2, 1e-12);
        expect(stateVariables["/problem221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem222"].stateValues.percentCreditAchieved,
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

      let problem1credit3 = 1;
      let problem1credit3Round = Math.round(1000 * problem1credit3) / 1000;
      let problem1percentCredit3 = problem1credit3 * 100;
      let problem1percentCredit3Round =
        Math.round(10 * problem1percentCredit3) / 10;

      let problem21credit3 = 1;
      let problem21credit3Round = Math.round(1000 * problem21credit3) / 1000;
      let problem21percentCredit3 = problem21credit3 * 100;
      let problem21percentCredit3Round =
        Math.round(10 * problem21percentCredit3) / 10;

      let problem221credit3 = 1;
      let problem221credit3Round = Math.round(1000 * problem221credit3) / 1000;
      let problem221percentCredit3 = problem221credit3 * 100;
      let problem221percentCredit3Round =
        Math.round(10 * problem221percentCredit3) / 10;

      let problem22credit3 = (problem221credit3 + 1) / 3;
      let problem22credit3Round = Math.round(1000 * problem22credit3) / 1000;
      let problem22percentCredit3 = problem22credit3 * 100;
      let problem22percentCredit3Round =
        Math.round(10 * problem22percentCredit3) / 10;

      let problem2credit3 = (problem21credit3 + problem22credit3 + 1) / 3;
      let problem2credit3Round = Math.round(1000 * problem2credit3) / 1000;
      let problem2percentCredit3 = problem2credit3 * 100;
      let problem2percentCredit3Round =
        Math.round(10 * problem2percentCredit3) / 10;

      let credit3 = (1 + problem1credit3 + problem2credit3) / 3;
      let credit3Round = Math.round(1000 * credit3) / 1000;
      let percentCredit3 = credit3 * 100;
      let percentCredit3Round = Math.round(10 * percentCredit3) / 10;

      cy.get(docCaAnchor).should("have.text", credit3Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit3Round.toString());
      cy.get(p1CaAnchor).should("have.text", problem1credit3Round.toString());
      cy.get(p1PcaAnchor).should(
        "have.text",
        problem1percentCredit3Round.toString(),
      );
      cy.get(p2CaAnchor).should("have.text", problem2credit3Round.toString());
      cy.get(p2PcaAnchor).should(
        "have.text",
        problem2percentCredit3Round.toString(),
      );
      cy.get(p21CaAnchor).should("have.text", problem21credit3Round.toString());
      cy.get(p21PcaAnchor).should(
        "have.text",
        problem21percentCredit3Round.toString(),
      );
      cy.get(p22CaAnchor).should("have.text", problem22credit3Round.toString());
      cy.get(p22PcaAnchor).should(
        "have.text",
        problem22percentCredit3Round.toString(),
      );
      cy.get(p221CaAnchor).should(
        "have.text",
        problem221credit3Round.toString(),
      );
      cy.get(p221PcaAnchor).should(
        "have.text",
        problem221percentCredit3Round.toString(),
      );
      cy.get(p222CaAnchor).should("have.text", "0");
      cy.get(p222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit3, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit3, 1e-12);
        expect(stateVariables["/problem1"].stateValues.creditAchieved).closeTo(
          problem1credit3,
          1e-12,
        );
        expect(
          stateVariables["/problem1"].stateValues.percentCreditAchieved,
        ).closeTo(problem1percentCredit3, 1e-12);
        expect(stateVariables["/problem2"].stateValues.creditAchieved).closeTo(
          problem2credit3,
          1e-12,
        );
        expect(
          stateVariables["/problem2"].stateValues.percentCreditAchieved,
        ).closeTo(problem2percentCredit3, 1e-12);
        expect(stateVariables["/problem21"].stateValues.creditAchieved).closeTo(
          problem21credit3,
          1e-12,
        );
        expect(
          stateVariables["/problem21"].stateValues.percentCreditAchieved,
        ).closeTo(problem21percentCredit3, 1e-12);
        expect(stateVariables["/problem22"].stateValues.creditAchieved).closeTo(
          problem22credit3,
          1e-12,
        );
        expect(
          stateVariables["/problem22"].stateValues.percentCreditAchieved,
        ).closeTo(problem22percentCredit3, 1e-12);
        expect(
          stateVariables["/problem221"].stateValues.creditAchieved,
        ).closeTo(problem221credit3, 1e-12);
        expect(
          stateVariables["/problem221"].stateValues.percentCreditAchieved,
        ).closeTo(problem221percentCredit3, 1e-12);
        expect(stateVariables["/problem222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem222"].stateValues.percentCreditAchieved,
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

      let problem1credit4 = 1;
      let problem1credit4Round = Math.round(1000 * problem1credit4) / 1000;
      let problem1percentCredit4 = problem1credit4 * 100;
      let problem1percentCredit4Round =
        Math.round(10 * problem1percentCredit4) / 10;

      let problem221credit4 = 1;
      let problem221credit4Round = Math.round(1000 * problem221credit4) / 1000;
      let problem221percentCredit4 = problem221credit4 * 100;
      let problem221percentCredit4Round =
        Math.round(10 * problem221percentCredit4) / 10;

      let problem222credit4 = 1;
      let problem222credit4Round = Math.round(1000 * problem222credit4) / 1000;
      let problem222percentCredit4 = problem222credit4 * 100;
      let problem222percentCredit4Round =
        Math.round(10 * problem222percentCredit4) / 10;

      let problem21credit4 = 1;
      let problem21credit4Round = Math.round(1000 * problem21credit4) / 1000;
      let problem21percentCredit4 = problem21credit4 * 100;
      let problem21percentCredit4Round =
        Math.round(10 * problem21percentCredit4) / 10;

      let problem22credit4 = 1;
      let problem22credit4Round = Math.round(1000 * problem22credit4) / 1000;
      let problem22percentCredit4 = problem22credit4 * 100;
      let problem22percentCredit4Round =
        Math.round(10 * problem22percentCredit4) / 10;

      let problem2credit4 = 1;
      let problem2credit4Round = Math.round(1000 * problem2credit4) / 1000;
      let problem2percentCredit4 = problem2credit4 * 100;
      let problem2percentCredit4Round =
        Math.round(10 * problem2percentCredit4) / 10;

      let credit4 = (1 + problem1credit4 + problem2credit4) / 3;
      let credit4Round = Math.round(1000 * credit4) / 1000;
      let percentCredit4 = credit4 * 100;
      let percentCredit4Round = Math.round(10 * percentCredit4) / 10;

      cy.get(docCaAnchor).should("have.text", credit4Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit4Round.toString());
      cy.get(p1CaAnchor).should("have.text", problem1credit4Round.toString());
      cy.get(p1PcaAnchor).should(
        "have.text",
        problem1percentCredit4Round.toString(),
      );
      cy.get(p2CaAnchor).should("have.text", problem2credit4Round.toString());
      cy.get(p2PcaAnchor).should(
        "have.text",
        problem2percentCredit4Round.toString(),
      );
      cy.get(p21CaAnchor).should("have.text", problem21credit4Round.toString());
      cy.get(p21PcaAnchor).should(
        "have.text",
        problem21percentCredit4Round.toString(),
      );
      cy.get(p22CaAnchor).should("have.text", problem22credit4Round.toString());
      cy.get(p22PcaAnchor).should(
        "have.text",
        problem22percentCredit4Round.toString(),
      );
      cy.get(p221CaAnchor).should(
        "have.text",
        problem221credit4Round.toString(),
      );
      cy.get(p221PcaAnchor).should(
        "have.text",
        problem221percentCredit4Round.toString(),
      );
      cy.get(p222CaAnchor).should(
        "have.text",
        problem222credit4Round.toString(),
      );
      cy.get(p222PcaAnchor).should(
        "have.text",
        problem222percentCredit4Round.toString(),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit4, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit4, 1e-12);
        expect(stateVariables["/problem1"].stateValues.creditAchieved).closeTo(
          problem1credit4,
          1e-12,
        );
        expect(
          stateVariables["/problem1"].stateValues.percentCreditAchieved,
        ).closeTo(problem1percentCredit4, 1e-12);
        expect(stateVariables["/problem2"].stateValues.creditAchieved).closeTo(
          problem2credit4,
          1e-12,
        );
        expect(
          stateVariables["/problem2"].stateValues.percentCreditAchieved,
        ).closeTo(problem2percentCredit4, 1e-12);
        expect(stateVariables["/problem21"].stateValues.creditAchieved).closeTo(
          problem21credit4,
          1e-12,
        );
        expect(
          stateVariables["/problem21"].stateValues.percentCreditAchieved,
        ).closeTo(problem21percentCredit4, 1e-12);
        expect(stateVariables["/problem22"].stateValues.creditAchieved).closeTo(
          problem22credit4,
          1e-12,
        );
        expect(
          stateVariables["/problem22"].stateValues.percentCreditAchieved,
        ).closeTo(problem22percentCredit4, 1e-12);
        expect(
          stateVariables["/problem221"].stateValues.creditAchieved,
        ).closeTo(problem221credit4, 1e-12);
        expect(
          stateVariables["/problem221"].stateValues.percentCreditAchieved,
        ).closeTo(problem221percentCredit4, 1e-12);
        expect(
          stateVariables["/problem222"].stateValues.creditAchieved,
        ).closeTo(problem222credit4, 1e-12);
        expect(
          stateVariables["/problem222"].stateValues.percentCreditAchieved,
        ).closeTo(problem222percentCredit4, 1e-12);
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

  it("problems with weights", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <title>Activity</title>
    <p>Credit achieved for $_document1.title:
    $_document1.creditAchieved{name="docCa"}, or $_document1.percentCreditAchieved{name="docPca"}%</p>

    <p>Enter <m>u</m>: <answer>u</answer></p>

    <problem name="problem1" weight="0.5"><title>Problem 1</title>
      <p>Credit achieved for $problem1.title:
      $problem1.creditAchieved{name="p1Ca"}, or $problem1.percentCreditAchieved{name="p1Pca"}%</p>

      <p>Enter <m>x</m>: <answer>x</answer></p>
      <p>Enter <m>y</m>: <answer weight="2">y</answer></p>


    </problem>
    <problem name="problem2" weight="2"><title>Problem 2</title>
      <p>Credit achieved for $problem2.title:
      $problem2.creditAchieved{name="p2Ca"}, or $problem2.percentCreditAchieved{name="p2Pca"}%</p>

      <p>Enter <m>z</m>: <answer>z</answer></p>

      <problem name="problem21" weight="3"><title>Problem 2.1</title>
        <p>Credit achieved for $problem21.title:
        $problem21.creditAchieved{name="p21Ca"}, or $problem21.percentCreditAchieved{name="p21Pca"}%</p>


        <p>Enter <m>v</m>: <answer weight="0.5">v</answer></p>
        <p>Enter <m>w</m>: <answer>w</answer></p>

      </problem>
      <problem name="problem22" weight="4"><title>Problem 2.2</title>
        <p>Credit achieved for $problem22.title:
        $problem22.creditAchieved{name="p22Ca"}, or $problem22.percentCreditAchieved{name="p22Pca"}%</p>

        <p>Enter <m>q</m>: <answer>q</answer></p>

        <problem name="problem221" weight="5"><title>Problem 2.2.1</title>
          <p>Credit achieved for $problem221.title:
          $problem221.creditAchieved{name="p221Ca"}, or $problem221.percentCreditAchieved{name="p221Pca"}%</p>

          <p>Enter <m>r</m>: <answer>r</answer></p>

        </problem>
        <problem name="problem222" weight="1"><title>Problem 2.2.2</title>
          <p>Credit achieved for $problem222.title:
          $problem222.creditAchieved{name="p222Ca"}, or $problem222.percentCreditAchieved{name="p222Pca"}%</p>

          <p>Enter <m>s</m>: <answer weight="3">s</answer></p>

        </problem>
      </problem>

    </problem>
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
      let p1CaAnchor = cesc2(
        "#" + stateVariables["/p1Ca"].replacements[0].componentName,
      );
      let p1PcaAnchor = cesc2(
        "#" + stateVariables["/p1Pca"].replacements[0].componentName,
      );
      let p2CaAnchor = cesc2(
        "#" + stateVariables["/p2Ca"].replacements[0].componentName,
      );
      let p2PcaAnchor = cesc2(
        "#" + stateVariables["/p2Pca"].replacements[0].componentName,
      );
      let p21CaAnchor = cesc2(
        "#" + stateVariables["/p21Ca"].replacements[0].componentName,
      );
      let p21PcaAnchor = cesc2(
        "#" + stateVariables["/p21Pca"].replacements[0].componentName,
      );
      let p22CaAnchor = cesc2(
        "#" + stateVariables["/p22Ca"].replacements[0].componentName,
      );
      let p22PcaAnchor = cesc2(
        "#" + stateVariables["/p22Pca"].replacements[0].componentName,
      );
      let p221CaAnchor = cesc2(
        "#" + stateVariables["/p221Ca"].replacements[0].componentName,
      );
      let p221PcaAnchor = cesc2(
        "#" + stateVariables["/p221Pca"].replacements[0].componentName,
      );
      let p222CaAnchor = cesc2(
        "#" + stateVariables["/p222Ca"].replacements[0].componentName,
      );
      let p222PcaAnchor = cesc2(
        "#" + stateVariables["/p222Pca"].replacements[0].componentName,
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
      cy.get(p1CaAnchor).should("have.text", "0");
      cy.get(p1PcaAnchor).should("have.text", "0");
      cy.get(p2CaAnchor).should("have.text", "0");
      cy.get(p2PcaAnchor).should("have.text", "0");
      cy.get(p21CaAnchor).should("have.text", "0");
      cy.get(p21PcaAnchor).should("have.text", "0");
      cy.get(p22CaAnchor).should("have.text", "0");
      cy.get(p22PcaAnchor).should("have.text", "0");
      cy.get(p221CaAnchor).should("have.text", "0");
      cy.get(p221PcaAnchor).should("have.text", "0");
      cy.get(p222CaAnchor).should("have.text", "0");
      cy.get(p222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_document1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem222"].stateValues.percentCreditAchieved,
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
      cy.get(p1CaAnchor).should("have.text", "0");
      cy.get(p1PcaAnchor).should("have.text", "0");
      cy.get(p2CaAnchor).should("have.text", "0");
      cy.get(p2PcaAnchor).should("have.text", "0");
      cy.get(p21CaAnchor).should("have.text", "0");
      cy.get(p21PcaAnchor).should("have.text", "0");
      cy.get(p22CaAnchor).should("have.text", "0");
      cy.get(p22PcaAnchor).should("have.text", "0");
      cy.get(p221CaAnchor).should("have.text", "0");
      cy.get(p221PcaAnchor).should("have.text", "0");
      cy.get(p222CaAnchor).should("have.text", "0");
      cy.get(p222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit1, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit1, 1e-12);
        expect(stateVariables["/problem1"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem1"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem2"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem2"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem21"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem21"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem22"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem22"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem222"].stateValues.percentCreditAchieved,
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

      let problem1credit2 = 2 / 3;
      let problem1credit2Round = Math.round(1000 * problem1credit2) / 1000;
      let problem1percentCredit2 = problem1credit2 * 100;
      let problem1percentCredit2Round =
        Math.round(10 * problem1percentCredit2) / 10;

      let problem21credit2 = 1 / 3;
      let problem21credit2Round = Math.round(1000 * problem21credit2) / 1000;
      let problem21percentCredit2 = problem21credit2 * 100;
      let problem21percentCredit2Round =
        Math.round(10 * problem21percentCredit2) / 10;

      let problem22credit2 = 1 / 7;
      let problem22credit2Round = Math.round(1000 * problem22credit2) / 1000;
      let problem22percentCredit2 = problem22credit2 * 100;
      let problem22percentCredit2Round =
        Math.round(10 * problem22percentCredit2) / 10;

      let problem2credit2 = (3 * problem21credit2 + 4 * problem22credit2) / 8;
      let problem2credit2Round = Math.round(1000 * problem2credit2) / 1000;
      let problem2percentCredit2 = problem2credit2 * 100;
      let problem2percentCredit2Round =
        Math.round(10 * problem2percentCredit2) / 10;

      let credit2 = (1 + 0.5 * problem1credit2 + 2 * problem2credit2) / 3.5;
      let credit2Round = Math.round(1000 * credit2) / 1000;
      let percentCredit2 = credit2 * 100;
      let percentCredit2Round = Math.round(10 * percentCredit2) / 10;

      cy.get(docCaAnchor).should("have.text", credit2Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit2Round.toString());
      cy.get(p1CaAnchor).should("have.text", problem1credit2Round.toString());
      cy.get(p1PcaAnchor).should(
        "have.text",
        problem1percentCredit2Round.toString(),
      );
      cy.get(p2CaAnchor).should("have.text", problem2credit2Round.toString());
      cy.get(p2PcaAnchor).should(
        "have.text",
        problem2percentCredit2Round.toString(),
      );
      cy.get(p21CaAnchor).should("have.text", problem21credit2Round.toString());
      cy.get(p21PcaAnchor).should(
        "have.text",
        problem21percentCredit2Round.toString(),
      );
      cy.get(p22CaAnchor).should("have.text", problem22credit2Round.toString());
      cy.get(p22PcaAnchor).should(
        "have.text",
        problem22percentCredit2Round.toString(),
      );
      cy.get(p221CaAnchor).should("have.text", "0");
      cy.get(p221PcaAnchor).should("have.text", "0");
      cy.get(p222CaAnchor).should("have.text", "0");
      cy.get(p222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit2, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit2, 1e-12);
        expect(stateVariables["/problem1"].stateValues.creditAchieved).closeTo(
          problem1credit2,
          1e-12,
        );
        expect(
          stateVariables["/problem1"].stateValues.percentCreditAchieved,
        ).closeTo(problem1percentCredit2, 1e-12);
        expect(stateVariables["/problem2"].stateValues.creditAchieved).closeTo(
          problem2credit2,
          1e-12,
        );
        expect(
          stateVariables["/problem2"].stateValues.percentCreditAchieved,
        ).closeTo(problem2percentCredit2, 1e-12);
        expect(stateVariables["/problem21"].stateValues.creditAchieved).closeTo(
          problem21credit2,
          1e-12,
        );
        expect(
          stateVariables["/problem21"].stateValues.percentCreditAchieved,
        ).closeTo(problem21percentCredit2, 1e-12);
        expect(stateVariables["/problem22"].stateValues.creditAchieved).closeTo(
          problem22credit2,
          1e-12,
        );
        expect(
          stateVariables["/problem22"].stateValues.percentCreditAchieved,
        ).closeTo(problem22percentCredit2, 1e-12);
        expect(stateVariables["/problem221"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem221"].stateValues.percentCreditAchieved,
        ).eq(0);
        expect(stateVariables["/problem222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem222"].stateValues.percentCreditAchieved,
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

      let problem1credit3 = 1;
      let problem1credit3Round = Math.round(1000 * problem1credit3) / 1000;
      let problem1percentCredit3 = problem1credit3 * 100;
      let problem1percentCredit3Round =
        Math.round(10 * problem1percentCredit3) / 10;

      let problem21credit3 = 1;
      let problem21credit3Round = Math.round(1000 * problem21credit3) / 1000;
      let problem21percentCredit3 = problem21credit3 * 100;
      let problem21percentCredit3Round =
        Math.round(10 * problem21percentCredit3) / 10;

      let problem221credit3 = 1;
      let problem221credit3Round = Math.round(1000 * problem221credit3) / 1000;
      let problem221percentCredit3 = problem221credit3 * 100;
      let problem221percentCredit3Round =
        Math.round(10 * problem221percentCredit3) / 10;

      let problem22credit3 = 6 / 7;
      let problem22credit3Round = Math.round(1000 * problem22credit3) / 1000;
      let problem22percentCredit3 = problem22credit3 * 100;
      let problem22percentCredit3Round =
        Math.round(10 * problem22percentCredit3) / 10;

      let problem2credit3 =
        (1 + 3 * problem21credit3 + 4 * problem22credit3) / 8;
      let problem2credit3Round = Math.round(1000 * problem2credit3) / 1000;
      let problem2percentCredit3 = problem2credit3 * 100;
      let problem2percentCredit3Round =
        Math.round(10 * problem2percentCredit3) / 10;

      let credit3 = (1 + 0.5 * problem1credit3 + 2 * problem2credit3) / 3.5;
      let credit3Round = Math.round(1000 * credit3) / 1000;
      let percentCredit3 = credit3 * 100;
      let percentCredit3Round = Math.round(10 * percentCredit3) / 10;

      cy.get(docCaAnchor).should("have.text", credit3Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit3Round.toString());
      cy.get(p1CaAnchor).should("have.text", problem1credit3Round.toString());
      cy.get(p1PcaAnchor).should(
        "have.text",
        problem1percentCredit3Round.toString(),
      );
      cy.get(p2CaAnchor).should("have.text", problem2credit3Round.toString());
      cy.get(p2PcaAnchor).should(
        "have.text",
        problem2percentCredit3Round.toString(),
      );
      cy.get(p21CaAnchor).should("have.text", problem21credit3Round.toString());
      cy.get(p21PcaAnchor).should(
        "have.text",
        problem21percentCredit3Round.toString(),
      );
      cy.get(p22CaAnchor).should("have.text", problem22credit3Round.toString());
      cy.get(p22PcaAnchor).should(
        "have.text",
        problem22percentCredit3Round.toString(),
      );
      cy.get(p221CaAnchor).should(
        "have.text",
        problem221credit3Round.toString(),
      );
      cy.get(p221PcaAnchor).should(
        "have.text",
        problem221percentCredit3Round.toString(),
      );
      cy.get(p222CaAnchor).should("have.text", "0");
      cy.get(p222PcaAnchor).should("have.text", "0");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit3, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit3, 1e-12);
        expect(stateVariables["/problem1"].stateValues.creditAchieved).closeTo(
          problem1credit3,
          1e-12,
        );
        expect(
          stateVariables["/problem1"].stateValues.percentCreditAchieved,
        ).closeTo(problem1percentCredit3, 1e-12);
        expect(stateVariables["/problem2"].stateValues.creditAchieved).closeTo(
          problem2credit3,
          1e-12,
        );
        expect(
          stateVariables["/problem2"].stateValues.percentCreditAchieved,
        ).closeTo(problem2percentCredit3, 1e-12);
        expect(stateVariables["/problem21"].stateValues.creditAchieved).closeTo(
          problem21credit3,
          1e-12,
        );
        expect(
          stateVariables["/problem21"].stateValues.percentCreditAchieved,
        ).closeTo(problem21percentCredit3, 1e-12);
        expect(stateVariables["/problem22"].stateValues.creditAchieved).closeTo(
          problem22credit3,
          1e-12,
        );
        expect(
          stateVariables["/problem22"].stateValues.percentCreditAchieved,
        ).closeTo(problem22percentCredit3, 1e-12);
        expect(
          stateVariables["/problem221"].stateValues.creditAchieved,
        ).closeTo(problem221credit3, 1e-12);
        expect(
          stateVariables["/problem221"].stateValues.percentCreditAchieved,
        ).closeTo(problem221percentCredit3, 1e-12);
        expect(stateVariables["/problem222"].stateValues.creditAchieved).eq(0);
        expect(
          stateVariables["/problem222"].stateValues.percentCreditAchieved,
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

      let problem1credit4 = 1;
      let problem1credit4Round = Math.round(1000 * problem1credit4) / 1000;
      let problem1percentCredit4 = problem1credit4 * 100;
      let problem1percentCredit4Round =
        Math.round(10 * problem1percentCredit4) / 10;

      let problem21credit4 = 1;
      let problem21credit4Round = Math.round(1000 * problem21credit4) / 1000;
      let problem21percentCredit4 = problem21credit4 * 100;
      let problem21percentCredit4Round =
        Math.round(10 * problem21percentCredit4) / 10;

      let problem221credit4 = 1;
      let problem221credit4Round = Math.round(1000 * problem221credit4) / 1000;
      let problem221percentCredit4 = problem221credit4 * 100;
      let problem221percentCredit4Round =
        Math.round(10 * problem221percentCredit4) / 10;

      let problem222credit4 = 1;
      let problem222credit4Round = Math.round(1000 * problem222credit4) / 1000;
      let problem222percentCredit4 = problem222credit4 * 100;
      let problem222percentCredit4Round =
        Math.round(10 * problem222percentCredit4) / 10;

      let problem22credit4 = 1;
      let problem22credit4Round = Math.round(1000 * problem22credit4) / 1000;
      let problem22percentCredit4 = problem22credit4 * 100;
      let problem22percentCredit4Round =
        Math.round(10 * problem22percentCredit4) / 10;

      let problem2credit4 = 1;
      let problem2credit4Round = Math.round(1000 * problem2credit4) / 1000;
      let problem2percentCredit4 = problem2credit4 * 100;
      let problem2percentCredit4Round =
        Math.round(10 * problem2percentCredit4) / 10;

      let credit4 = (1 + problem1credit4 + problem2credit4) / 3;
      let credit4Round = Math.round(1000 * credit4) / 1000;
      let percentCredit4 = credit4 * 100;
      let percentCredit4Round = Math.round(10 * percentCredit4) / 10;

      cy.get(docCaAnchor).should("have.text", credit4Round.toString());
      cy.get(docPcaAnchor).should("have.text", percentCredit4Round.toString());
      cy.get(p1CaAnchor).should("have.text", problem1credit4Round.toString());
      cy.get(p1PcaAnchor).should(
        "have.text",
        problem1percentCredit4Round.toString(),
      );
      cy.get(p2CaAnchor).should("have.text", problem2credit4Round.toString());
      cy.get(p2PcaAnchor).should(
        "have.text",
        problem2percentCredit4Round.toString(),
      );
      cy.get(p21CaAnchor).should("have.text", problem21credit4Round.toString());
      cy.get(p21PcaAnchor).should(
        "have.text",
        problem21percentCredit4Round.toString(),
      );
      cy.get(p22CaAnchor).should("have.text", problem22credit4Round.toString());
      cy.get(p22PcaAnchor).should(
        "have.text",
        problem22percentCredit4Round.toString(),
      );
      cy.get(p221CaAnchor).should(
        "have.text",
        problem221credit4Round.toString(),
      );
      cy.get(p221PcaAnchor).should(
        "have.text",
        problem221percentCredit4Round.toString(),
      );
      cy.get(p222CaAnchor).should(
        "have.text",
        problem222credit4Round.toString(),
      );
      cy.get(p222PcaAnchor).should(
        "have.text",
        problem222percentCredit4Round.toString(),
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables["/_document1"].stateValues.creditAchieved,
        ).closeTo(credit4, 1e-12);
        expect(
          stateVariables["/_document1"].stateValues.percentCreditAchieved,
        ).closeTo(percentCredit4, 1e-12);
        expect(stateVariables["/problem1"].stateValues.creditAchieved).closeTo(
          problem1credit4,
          1e-12,
        );
        expect(
          stateVariables["/problem1"].stateValues.percentCreditAchieved,
        ).closeTo(problem1percentCredit4, 1e-12);
        expect(stateVariables["/problem2"].stateValues.creditAchieved).closeTo(
          problem2credit4,
          1e-12,
        );
        expect(
          stateVariables["/problem2"].stateValues.percentCreditAchieved,
        ).closeTo(problem2percentCredit4, 1e-12);
        expect(stateVariables["/problem21"].stateValues.creditAchieved).closeTo(
          problem21credit4,
          1e-12,
        );
        expect(
          stateVariables["/problem21"].stateValues.percentCreditAchieved,
        ).closeTo(problem21percentCredit4, 1e-12);
        expect(stateVariables["/problem22"].stateValues.creditAchieved).closeTo(
          problem22credit4,
          1e-12,
        );
        expect(
          stateVariables["/problem22"].stateValues.percentCreditAchieved,
        ).closeTo(problem22percentCredit4, 1e-12);
        expect(
          stateVariables["/problem221"].stateValues.creditAchieved,
        ).closeTo(problem221credit4, 1e-12);
        expect(
          stateVariables["/problem221"].stateValues.percentCreditAchieved,
        ).closeTo(problem221percentCredit4, 1e-12);
        expect(
          stateVariables["/problem222"].stateValues.creditAchieved,
        ).closeTo(problem222credit4, 1e-12);
        expect(
          stateVariables["/problem222"].stateValues.percentCreditAchieved,
        ).closeTo(problem222percentCredit4, 1e-12);
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

  it("section wide checkwork in problem", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <text>a</text>
        <p>Section wide checkwork: <booleaninput name="swcw" /></p>
        <problem sectionWideCheckwork="$swcw" name="theProblem">
        <title>Problem 1</title>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceinput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceinput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
        <answer name="sum3">
          <award sourcesAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
      
      </problem>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

    cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
    cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
    cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
    cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let twoxInputName =
        stateVariables["/twox"].stateValues.inputChildren[0].componentName;
      let twoxInputAnchor = cesc2("#" + twoxInputName) + " textarea";
      let twoxInputSubmitAnchor = cesc2("#" + twoxInputName + "_submit");
      let twoxInputCorrectAnchor = cesc2("#" + twoxInputName + "_correct");
      let twoxInputIncorrectAnchor = cesc2("#" + twoxInputName + "_incorrect");

      cy.get(twoxInputSubmitAnchor).should("be.visible");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("be.visible");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      let helloInputName =
        stateVariables["/hello"].stateValues.inputChildren[0].componentName;
      let helloInputAnchor = cesc2("#" + helloInputName + "_input");
      let helloInputSubmitAnchor = cesc2("#" + helloInputName + "_submit");
      let helloInputCorrectAnchor = cesc2("#" + helloInputName + "_correct");
      let helloInputIncorrectAnchor = cesc2(
        "#" + helloInputName + "_incorrect",
      );

      cy.get(helloInputSubmitAnchor).should("be.visible");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(helloInputAnchor).type("hello{enter}");
      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("be.visible");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/fruitInput_submit")).should("be.visible");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/fruitInput")).contains(`banana`).click({ force: true });
      cy.get(cesc("#\\/fruitInput_submit")).click();

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("be.visible");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/n1") + " textarea").type("2{enter}", { force: true });
      cy.get(cesc("#\\/n2") + " textarea").type("1{enter}", { force: true });

      cy.get(cesc("#\\/sum3_submit")).should("be.visible");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).click();
      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("be.visible");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.log("switch to section wide checkwork");

      cy.get(cesc("#\\/swcw")).click();
      cy.get(cesc("#\\/swcw_input")).should("be.checked");

      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("be.visible");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

      cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", { force: true });
      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).click();
      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("75% correct");
        });

      cy.get(helloInputAnchor).type("2{enter}");
      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).click();
      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("50% correct");
        });

      cy.log("turn off section wide checkwork");

      cy.get(cesc("#\\/swcw")).click();
      cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("be.visible");

      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("be.visible");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("be.visible");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");
    });
  });

  it("section wide checkwork in section", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <text>a</text>
        <p>Section wide checkwork: <booleaninput name="swcw" /></p>
        <section aggregateScores sectionWideCheckwork="$swcw" name="theProblem">
        <title>Problem 1</title>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceinput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceinput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
        <answer name="sum3">
          <award sourcesAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
      
      </section>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

    cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
    cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
    cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
    cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let twoxInputName =
        stateVariables["/twox"].stateValues.inputChildren[0].componentName;
      let twoxInputAnchor = cesc2("#" + twoxInputName) + " textarea";
      let twoxInputSubmitAnchor = cesc2("#" + twoxInputName + "_submit");
      let twoxInputCorrectAnchor = cesc2("#" + twoxInputName + "_correct");
      let twoxInputIncorrectAnchor = cesc2("#" + twoxInputName + "_incorrect");

      cy.get(twoxInputSubmitAnchor).should("be.visible");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("be.visible");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      let helloInputName =
        stateVariables["/hello"].stateValues.inputChildren[0].componentName;
      let helloInputAnchor = cesc2("#" + helloInputName + "_input");
      let helloInputSubmitAnchor = cesc2("#" + helloInputName + "_submit");
      let helloInputCorrectAnchor = cesc2("#" + helloInputName + "_correct");
      let helloInputIncorrectAnchor = cesc2(
        "#" + helloInputName + "_incorrect",
      );

      cy.get(helloInputSubmitAnchor).should("be.visible");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(helloInputAnchor).type("hello{enter}");
      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("be.visible");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/fruitInput_submit")).should("be.visible");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/fruitInput")).contains(`banana`).click({ force: true });
      cy.get(cesc("#\\/fruitInput_submit")).click();

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("be.visible");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/n1") + " textarea").type("2{enter}", { force: true });
      cy.get(cesc("#\\/n2") + " textarea").type("1{enter}", { force: true });

      cy.get(cesc("#\\/sum3_submit")).should("be.visible");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).click();
      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("be.visible");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.log("switch to section wide checkwork");

      cy.get(cesc("#\\/swcw")).click();
      cy.get(cesc("#\\/swcw_input")).should("be.checked");

      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("be.visible");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

      cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", { force: true });
      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).click();
      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("75% correct");
        });

      cy.get(helloInputAnchor).type("2{enter}");
      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).click();
      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("50% correct");
        });

      cy.log("turn off section wide checkwork");

      cy.get(cesc("#\\/swcw")).click();
      cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("be.visible");

      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("be.visible");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("be.visible");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");
    });
  });

  it("document wide checkwork", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <text>a</text>
        <document documentWideCheckwork="$dwcw" name="theDocument">
        <title>The problem</title>

        <p>Document wide checkwork: <booleaninput name="dwcw" /></p>
      
        <p>2x: <answer name="twox">2x</answer></p>
      
        <p>hello: <answer type="text" name="hello">hello</answer></p>

        <p>banana: 
        <answer name="fruit">
          <choiceinput shuffleOrder name="fruitInput">
            <choice credit="1">banana</choice>
            <choice>apple</choice>
            <choice>orange</choice>
          </choiceinput>
        </answer>
        </p>
      
        <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
        <answer name="sum3">
          <award sourcesAreResponses="n1 n2">
            <when>$n1+$n2=3</when>
          </award>
        </answer></p>
        </document>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/dwcw_input")).should("not.be.checked");

    cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
    cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
    cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
    cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let twoxInputName =
        stateVariables["/twox"].stateValues.inputChildren[0].componentName;
      let twoxInputAnchor = cesc2("#" + twoxInputName) + " textarea";
      let twoxInputSubmitAnchor = cesc2("#" + twoxInputName + "_submit");
      let twoxInputCorrectAnchor = cesc2("#" + twoxInputName + "_correct");
      let twoxInputIncorrectAnchor = cesc2("#" + twoxInputName + "_incorrect");

      cy.get(twoxInputSubmitAnchor).should("be.visible");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("be.visible");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      let helloInputName =
        stateVariables["/hello"].stateValues.inputChildren[0].componentName;
      let helloInputAnchor = cesc2("#" + helloInputName + "_input");
      let helloInputSubmitAnchor = cesc2("#" + helloInputName + "_submit");
      let helloInputCorrectAnchor = cesc2("#" + helloInputName + "_correct");
      let helloInputIncorrectAnchor = cesc2(
        "#" + helloInputName + "_incorrect",
      );

      cy.get(helloInputSubmitAnchor).should("be.visible");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(helloInputAnchor).type("hello{enter}");
      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("be.visible");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/fruitInput_submit")).should("be.visible");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/fruitInput")).contains(`banana`).click({ force: true });
      cy.get(cesc("#\\/fruitInput_submit")).click();

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("be.visible");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/n1") + " textarea").type("2{enter}", { force: true });
      cy.get(cesc("#\\/n2") + " textarea").type("1{enter}", { force: true });

      cy.get(cesc("#\\/sum3_submit")).should("be.visible");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).click();
      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("be.visible");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.log("switch to document wide checkwork");

      cy.get(cesc("#\\/dwcw")).click();
      cy.get(cesc("#\\/dwcw_input")).should("be.checked");

      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
      cy.get(cesc("#\\/theDocument_correct")).should("be.visible");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

      cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", { force: true });
      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).should("be.visible");
      cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).click();
      cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
      cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("75% correct");
        });

      cy.get(helloInputAnchor).type("2{enter}");
      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).should("be.visible");
      cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).click();
      cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
      cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("50% correct");
        });

      cy.log("turn off document wide checkwork");

      cy.get(cesc("#\\/dwcw")).click();
      cy.get(cesc("#\\/dwcw_input")).should("not.be.checked");

      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("be.visible");

      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("be.visible");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("be.visible");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("be.visible");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
      cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial")).should("not.exist");
    });
  });

  it("outer section wide checkwork supercedes inner section", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
            <choiceinput shuffleOrder name="fruitInput">
              <choice credit="1">banana</choice>
              <choice>apple</choice>
              <choice>orange</choice>
            </choiceinput>
          </answer>
          </p>
      
          <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
          <answer name="sum3">
            <award sourcesAreResponses="n1 n2">
              <when>$n1+$n2=3</when>
            </award>
          </answer></p>
        </subsection>
      
      </section>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

    cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
    cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
    cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
    cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let twoxInputName =
        stateVariables["/twox"].stateValues.inputChildren[0].componentName;
      let twoxInputAnchor = cesc2("#" + twoxInputName) + " textarea";
      let twoxInputSubmitAnchor = cesc2("#" + twoxInputName + "_submit");
      let twoxInputCorrectAnchor = cesc2("#" + twoxInputName + "_correct");
      let twoxInputIncorrectAnchor = cesc2("#" + twoxInputName + "_incorrect");

      cy.get(twoxInputSubmitAnchor).should("be.visible");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("be.visible");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      let helloInputName =
        stateVariables["/hello"].stateValues.inputChildren[0].componentName;
      let helloInputAnchor = cesc2("#" + helloInputName + "_input");
      let helloInputSubmitAnchor = cesc2("#" + helloInputName + "_submit");
      let helloInputCorrectAnchor = cesc2("#" + helloInputName + "_correct");
      let helloInputIncorrectAnchor = cesc2(
        "#" + helloInputName + "_incorrect",
      );

      cy.get(helloInputSubmitAnchor).should("be.visible");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(helloInputAnchor).type("hello{enter}");
      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("be.visible");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");
      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/subProblem_submit")).should("be.visible");
      cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/fruitInput")).contains(`banana`).click({ force: true });
      cy.get(cesc("#\\/subProblem_submit")).click();

      cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("50% correct");
        });

      cy.get(cesc("#\\/n1") + " textarea").type("2{enter}", { force: true });
      cy.get(cesc("#\\/n2") + " textarea").type("1{enter}", { force: true });

      cy.get(cesc("#\\/subProblem_submit")).should("be.visible");
      cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/subProblem_submit")).click();

      cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/subProblem_correct")).should("be.visible");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

      cy.log("switch to section wide checkwork");

      cy.get(cesc("#\\/swcw")).click();
      cy.get(cesc("#\\/swcw_input")).should("be.checked");

      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("be.visible");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

      cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", { force: true });
      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).click();
      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("67% correct");
        });

      cy.get(helloInputAnchor).type("2{enter}");
      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("be.visible");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).click();
      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("33% correct");
        });

      cy.log("turn off section wide checkwork");

      cy.get(cesc("#\\/swcw")).click();
      cy.get(cesc("#\\/swcw_input")).should("not.be.checked");

      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("be.visible");

      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("be.visible");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/subProblem_correct")).should("be.visible");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/theProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/theProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/theProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theProblem_partial")).should("not.exist");
    });
  });

  it("document wide checkwork supercedes section", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
            <choiceinput shuffleOrder name="fruitInput">
              <choice credit="1">banana</choice>
              <choice>apple</choice>
              <choice>orange</choice>
            </choiceinput>
          </answer>
          </p>
      
          <p>Numbers that add to 3: <mathinput name="n1" /> <mathinput name="n2" />
          <answer name="sum3">
            <award sourcesAreResponses="n1 n2">
              <when>$n1+$n2=3</when>
            </award>
          </answer></p>
        </section>
      
      </document>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/dwcw_input")).should("not.be.checked");

    cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
    cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
    cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
    cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let twoxInputName =
        stateVariables["/twox"].stateValues.inputChildren[0].componentName;
      let twoxInputAnchor = cesc2("#" + twoxInputName) + " textarea";
      let twoxInputSubmitAnchor = cesc2("#" + twoxInputName + "_submit");
      let twoxInputCorrectAnchor = cesc2("#" + twoxInputName + "_correct");
      let twoxInputIncorrectAnchor = cesc2("#" + twoxInputName + "_incorrect");

      cy.get(twoxInputSubmitAnchor).should("be.visible");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(twoxInputAnchor).type("2x{enter}", { force: true });
      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("be.visible");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      let helloInputName =
        stateVariables["/hello"].stateValues.inputChildren[0].componentName;
      let helloInputAnchor = cesc2("#" + helloInputName + "_input");
      let helloInputSubmitAnchor = cesc2("#" + helloInputName + "_submit");
      let helloInputCorrectAnchor = cesc2("#" + helloInputName + "_correct");
      let helloInputIncorrectAnchor = cesc2(
        "#" + helloInputName + "_incorrect",
      );

      cy.get(helloInputSubmitAnchor).should("be.visible");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(helloInputAnchor).type("hello{enter}");
      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("be.visible");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");
      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/subProblem_submit")).should("be.visible");
      cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/fruitInput")).contains(`banana`).click({ force: true });
      cy.get(cesc("#\\/subProblem_submit")).click();

      cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("50% correct");
        });

      cy.get(cesc("#\\/n1") + " textarea").type("2{enter}", { force: true });
      cy.get(cesc("#\\/n2") + " textarea").type("1{enter}", { force: true });

      cy.get(cesc("#\\/subProblem_submit")).should("be.visible");
      cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/subProblem_submit")).click();

      cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/subProblem_correct")).should("be.visible");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

      cy.log("switch to document wide checkwork");

      cy.get(cesc("#\\/dwcw")).click();
      cy.get(cesc("#\\/dwcw_input")).should("be.checked");

      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/subProblem_correct")).should("not.exist");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
      cy.get(cesc("#\\/theDocument_correct")).should("be.visible");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

      cy.get(twoxInputAnchor).type("{end}{backspace}y{enter}", { force: true });
      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).should("be.visible");
      cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).click();
      cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
      cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("67% correct");
        });

      cy.get(helloInputAnchor).type("2{enter}");
      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).should("be.visible");
      cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial")).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).click();
      cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
      cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial"))
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).equal("33% correct");
        });

      cy.log("turn off document wide checkwork");

      cy.get(cesc("#\\/dwcw")).click();
      cy.get(cesc("#\\/dwcw_input")).should("not.be.checked");

      cy.get(twoxInputSubmitAnchor).should("not.exist");
      cy.get(twoxInputCorrectAnchor).should("not.exist");
      cy.get(twoxInputIncorrectAnchor).should("be.visible");

      cy.get(helloInputSubmitAnchor).should("not.exist");
      cy.get(helloInputCorrectAnchor).should("not.exist");
      cy.get(helloInputIncorrectAnchor).should("be.visible");

      cy.get(cesc("#\\/fruitInput_submit")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_correct")).should("not.exist");
      cy.get(cesc("#\\/fruitInput_incorrect")).should("not.exist");

      cy.get(cesc("#\\/sum3_submit")).should("not.exist");
      cy.get(cesc("#\\/sum3_correct")).should("not.exist");
      cy.get(cesc("#\\/sum3_incorrect")).should("not.exist");

      cy.get(cesc("#\\/subProblem_submit")).should("not.exist");
      cy.get(cesc("#\\/subProblem_correct")).should("be.visible");
      cy.get(cesc("#\\/subProblem_incorrect")).should("not.exist");
      cy.get(cesc("#\\/subProblem_partial")).should("not.exist");

      cy.get(cesc("#\\/theDocument_submit")).should("not.exist");
      cy.get(cesc("#\\/theDocument_correct")).should("not.exist");
      cy.get(cesc("#\\/theDocument_incorrect")).should("not.exist");
      cy.get(cesc("#\\/theDocument_partial")).should("not.exist");
    });
  });

  it("section wide checkwork, submit label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <problem sectionWideCheckwork name="prob1">
        <answer name="ans1">x</answer>
      </problem>
      <problem sectionWideCheckwork name="prob2" submitLabel="Hit it!">
        <answer name="ans2">x</answer>
      </problem>
      <problem sectionWideCheckwork name="prob3" submitLabelNoCorrectness="Guess">
        <answer name="ans3">x</answer>
      </problem>
      <problem sectionWideCheckwork name="prob4" submitLabel="Hit it!" submitLabelNoCorrectness="Guess">
        <answer name="ans4">x</answer>
      </problem>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinput1Name =
        stateVariables["/ans1"].stateValues.inputChildren[0].componentName;
      let mathinput1Anchor = cesc2("#" + mathinput1Name) + " textarea";

      let mathinput2Name =
        stateVariables["/ans2"].stateValues.inputChildren[0].componentName;
      let mathinput2Anchor = cesc2("#" + mathinput2Name) + " textarea";

      let mathinput3Name =
        stateVariables["/ans3"].stateValues.inputChildren[0].componentName;
      let mathinput3Anchor = cesc2("#" + mathinput3Name) + " textarea";

      let mathinput4Name =
        stateVariables["/ans4"].stateValues.inputChildren[0].componentName;
      let mathinput4Anchor = cesc2("#" + mathinput4Name) + " textarea";

      cy.get(cesc("#\\/prob1_submit"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("Check Work");
        });
      cy.get(cesc("#\\/prob2_submit"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("Hit it!");
        });
      cy.get(cesc("#\\/prob3_submit"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("Check Work");
        });
      cy.get(cesc("#\\/prob4_submit"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("Hit it!");
        });

      cy.get(mathinput1Anchor).type("x{enter}", { force: true });
      cy.get(mathinput2Anchor).type("x{enter}", { force: true });
      cy.get(mathinput3Anchor).type("x{enter}", { force: true });
      cy.get(mathinput4Anchor).type("x{enter}", { force: true });

      cy.get(cesc("#\\/prob1_submit")).click();
      cy.get(cesc("#\\/prob2_submit")).click();
      cy.get(cesc("#\\/prob3_submit")).click();
      cy.get(cesc("#\\/prob4_submit")).click();

      cy.get(cesc("#\\/prob1_correct")).should("contain.text", "Correct");
      cy.get(cesc("#\\/prob2_correct")).should("contain.text", "Correct");
      cy.get(cesc("#\\/prob3_correct")).should("contain.text", "Correct");
      cy.get(cesc("#\\/prob4_correct")).should("contain.text", "Correct");

      cy.get("#testRunner_toggleControls").click();
      cy.get("#testRunner_showCorrectness").click();
      cy.wait(100);
      cy.get("#testRunner_toggleControls").click();

      cy.get(cesc("#\\/prob1_submit")).should(
        "contain.text",
        "Submit Response",
      );
      cy.get(cesc("#\\/prob2_submit")).should(
        "contain.text",
        "Submit Response",
      );
      cy.get(cesc("#\\/prob3_submit")).should("contain.text", "Guess");
      cy.get(cesc("#\\/prob4_submit")).should("contain.text", "Guess");

      cy.get(cesc("#\\/prob1_submit"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("Submit Response");
        });
      cy.get(cesc("#\\/prob2_submit"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("Submit Response");
        });
      cy.get(cesc("#\\/prob3_submit"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("Guess");
        });
      cy.get(cesc("#\\/prob4_submit"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("Guess");
        });

      cy.get(mathinput1Anchor).type("x{enter}", { force: true });
      cy.get(mathinput2Anchor).type("x{enter}", { force: true });
      cy.get(mathinput3Anchor).type("x{enter}", { force: true });
      cy.get(mathinput4Anchor).type("x{enter}", { force: true });

      cy.get(cesc("#\\/prob1_submit")).click();
      cy.get(cesc("#\\/prob2_submit")).click();
      cy.get(cesc("#\\/prob3_submit")).click();
      cy.get(cesc("#\\/prob4_submit")).click();

      cy.get(cesc("#\\/prob1_saved")).should("contain.text", "Response Saved");
      cy.get(cesc("#\\/prob2_saved")).should("contain.text", "Response Saved");
      cy.get(cesc("#\\/prob3_saved")).should("contain.text", "Response Saved");
      cy.get(cesc("#\\/prob4_saved")).should("contain.text", "Response Saved");
    });
  });

  it("document wide checkwork, submit label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <document documentWideCheckwork name="doc" submitLabel="Hit it!" submitLabelNoCorrectness="Guess">
        <text>a</text>
        <answer name="ans1">x</answer>
      </document>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mathinput1Name =
        stateVariables["/ans1"].stateValues.inputChildren[0].componentName;
      let mathinput1Anchor = cesc2("#" + mathinput1Name) + " textarea";

      cy.get(cesc("#\\/doc_submit"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("Hit it!");
        });

      cy.get(mathinput1Anchor).type("x{enter}", { force: true });

      cy.get(cesc("#\\/doc_submit")).click();

      cy.get(cesc("#\\/doc_correct")).should("contain.text", "Correct");

      cy.get("#testRunner_toggleControls").click();
      cy.get("#testRunner_showCorrectness").click();
      cy.wait(100);
      cy.get("#testRunner_toggleControls").click();

      cy.get(cesc("#\\/doc_submit")).should("contain.text", "Guess");

      cy.get(cesc("#\\/doc_submit"))
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("Guess");
        });

      cy.get(mathinput1Anchor).type("x{enter}", { force: true });

      cy.get(cesc("#\\/doc_submit")).click();

      cy.get(cesc("#\\/doc_saved")).should("contain.text", "Response Saved");
    });
  });

  it("maintain state while reloading problem", () => {
    let doenetML = `
    <text>a</text>
    <problem name="problem1" newNamespace>
      <variantControl numVariants="2" variantNames="apple banana" />
      <select assignNames="fruit" hide>
        <option selectForVariants="apple" newNamespace>
          <text name="name">apple</text>
          <text name="color">red</text>
        </option>
        <option selectForVariants="banana" newNamespace>
          <text name="name">banana</text>
          <text name="color">yellow</text>
          </option>
      </select>
      <p>Enter <copy target="fruit/name" assignNames="fruitName" />: 
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
  
    <p>Credit achieved: $_document1.creditAchieved{assignNames="ca"}</p>
    `;

    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc2("#/ca")).should("have.text", "0");

    cy.get(cesc2("#/problem1/input1_input")).type("banana{enter}");
    cy.get(cesc2("#/problem1/input1_incorrect")).should("be.visible");
    cy.get(cesc2("#/ca")).should("have.text", "0");

    cy.get(cesc2("#/problem1/input2_submit")).should("be.visible");

    cy.wait(2000); // wait to make sure debounce save happened

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc2("#/problem1/input1_incorrect")).should("be.visible");
    cy.get(cesc2("#/problem1/input2_submit")).should("be.visible");
    cy.get(cesc2("#/ca")).should("have.text", "0");

    cy.get(cesc2("#/problem1/input1_input")).clear().type("apple");
    cy.get(cesc2("#/problem1/input1_submit")).click();
    cy.get(cesc2("#/problem1/input1_correct")).should("be.visible");
    cy.get(cesc2("#/ca")).should("have.text", "0.5");

    cy.get(cesc2("#/problem1/input2_input")).clear().type("yellow{enter}");
    cy.get(cesc2("#/problem1/input2_incorrect")).should("be.visible");
    cy.get(cesc2("#/ca")).should("have.text", "0.5");

    cy.wait(2000); // wait to make sure debounce save happened

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc2("#/problem1/input1_correct")).should("be.visible");
    cy.get(cesc2("#/problem1/input2_incorrect")).should("be.visible");
    cy.get(cesc2("#/ca")).should("have.text", "0.5");

    cy.get(cesc2("#/problem1/input2_input")).clear().type("red");
    cy.get(cesc2("#/problem1/input2_submit")).click();
    cy.get(cesc2("#/problem1/input2_correct")).should("be.visible");
    cy.get(cesc2("#/ca")).should("have.text", "1");

    cy.wait(2000); // wait to make sure debounce save happened

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc2("#/problem1/input1_correct")).should("be.visible");
    cy.get(cesc2("#/problem1/input2_correct")).should("be.visible");
    cy.get(cesc2("#/ca")).should("have.text", "1");
  });
});
