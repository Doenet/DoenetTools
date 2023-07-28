import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Ion Compounds Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("answer compounds from atom and ions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>


  <p>What is the ionic compound from <atom name="Li" symbol="Li" /> and <atom name="O" symbol="O" />?
    <answer name="ansLiO" splitSymbols="false"><ionicCompound>$Li$O</ionicCompound></answer>
  </p>

  <p>What is the ionic compound from <atom name="Ca" symbol="Ca" /> and <atom name="P" symbol="P" />?
    <answer name="ansCaP" splitSymbols="false"><math><ionicCompound>$Ca<ion>$P</ion></ionicCompound></math></answer>
  </p>
 
  <p>What is the ionic compound from <atom name="Mg" symbol="Mg" /> and <atom name="S" symbol="S" />?
    <answer name="ansMgS" splitSymbols="false"><ionicCompound><ion>$Mg</ion><ion>$S</ion></ionicCompound></answer>
  </p>
 
  <p>What is the ionic compound from <atom name="Sr" symbol="Sr" /> and <atom name="I" symbol="I" />?
    <answer name="ansSrI" splitSymbols="false"><ionicCompound><ion>$Sr</ion>$I</ionicCompound></answer>
  </p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputLiOName =
        stateVariables["/ansLiO"].stateValues.inputChildren[0].componentName;
      let mathinputLiOAnchor = cesc2("#" + mathinputLiOName) + " textarea";
      let mathinputLiOSubmitAnchor = cesc2("#" + mathinputLiOName + "_submit");
      let mathinputLiOCorrectAnchor = cesc2(
        "#" + mathinputLiOName + "_correct",
      );
      let mathinputLiOIncorrectAnchor = cesc2(
        "#" + mathinputLiOName + "_incorrect",
      );

      cy.get(mathinputLiOAnchor).type("LiO{enter}", { force: true });
      cy.get(mathinputLiOIncorrectAnchor).should("be.visible");

      cy.get(mathinputLiOAnchor).type("{end}{leftarrow} {enter}", {
        force: true,
      });
      cy.get(mathinputLiOIncorrectAnchor).should("be.visible");

      cy.get(mathinputLiOAnchor).type("{end}{leftarrow}{backspace}_2{enter}", {
        force: true,
      });
      cy.get(mathinputLiOCorrectAnchor).should("be.visible");

      let mathinputCaPName =
        stateVariables["/ansCaP"].stateValues.inputChildren[0].componentName;
      let mathinputCaPAnchor = cesc2("#" + mathinputCaPName) + " textarea";
      let mathinputCaPSubmitAnchor = cesc2("#" + mathinputCaPName + "_submit");
      let mathinputCaPCorrectAnchor = cesc2(
        "#" + mathinputCaPName + "_correct",
      );
      let mathinputCaPIncorrectAnchor = cesc2(
        "#" + mathinputCaPName + "_incorrect",
      );

      cy.get(mathinputCaPAnchor).type("CaP{enter}", { force: true });
      cy.get(mathinputCaPIncorrectAnchor).should("be.visible");

      cy.get(mathinputCaPAnchor).type("{end}{leftarrow}_3{enter}", {
        force: true,
      });
      cy.get(mathinputCaPIncorrectAnchor).should("be.visible");

      cy.get(mathinputCaPAnchor).type("{ctrl+end}_2{enter}", { force: true });
      cy.get(mathinputCaPCorrectAnchor).should("be.visible");

      let mathinputMgSName =
        stateVariables["/ansMgS"].stateValues.inputChildren[0].componentName;
      let mathinputMgSAnchor = cesc2("#" + mathinputMgSName) + " textarea";
      let mathinputMgSSubmitAnchor = cesc2("#" + mathinputMgSName + "_submit");
      let mathinputMgSCorrectAnchor = cesc2(
        "#" + mathinputMgSName + "_correct",
      );
      let mathinputMgSIncorrectAnchor = cesc2(
        "#" + mathinputMgSName + "_incorrect",
      );

      cy.get(mathinputMgSAnchor).type("MgS{enter}", { force: true });
      cy.get(mathinputMgSIncorrectAnchor).should("be.visible");

      cy.get(mathinputMgSAnchor).type("{end}{leftarrow} {enter}", {
        force: true,
      });
      cy.get(mathinputMgSCorrectAnchor).should("be.visible");

      let mathinputSrIName =
        stateVariables["/ansSrI"].stateValues.inputChildren[0].componentName;
      let mathinputSrIAnchor = cesc2("#" + mathinputSrIName) + " textarea";
      let mathinputSrISubmitAnchor = cesc2("#" + mathinputSrIName + "_submit");
      let mathinputSrICorrectAnchor = cesc2(
        "#" + mathinputSrIName + "_correct",
      );
      let mathinputSrIIncorrectAnchor = cesc2(
        "#" + mathinputSrIName + "_incorrect",
      );

      cy.get(mathinputSrIAnchor).type("SrI{enter}", { force: true });
      cy.get(mathinputSrIIncorrectAnchor).should("be.visible");

      cy.get(mathinputSrIAnchor).type("{end}_2{enter}", { force: true });
      cy.get(mathinputSrIIncorrectAnchor).should("be.visible");

      cy.get(mathinputSrIAnchor).type(
        "{leftarrow}{leftarrow}{leftarrow} {enter}",
        { force: true },
      );
      cy.get(mathinputSrICorrectAnchor).should("be.visible");
    });
  });

  it("warnings", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <atom name="Li" symbol="Li" /> <atom name="O" symbol="O" /> <atom name="Ca" symbol="Ca" />

  <ionicCompound>$Li$O$Ca</ionicCompound>
  <ionicCompound>$Li$Ca</ionicCompound>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(2);

      expect(errorWarnings.warnings[0].message).contain(
        `Have not implemented ionic compound for anything other than two ions`,
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(41);

      expect(errorWarnings.warnings[1].message).contain(
        `Ionic compound implemented only for one cation and one anion`,
      );
      expect(errorWarnings.warnings[1].level).eq(1);
      expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(6);
      expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
      expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(39);
    });
  });
});
