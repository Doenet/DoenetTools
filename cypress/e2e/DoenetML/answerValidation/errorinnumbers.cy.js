import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Allow error in numbers validation tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("expression with single number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>log(32x+c)</math> 
    <answer>
      <award allowederrorinnumbers="0.00001">
        $_math1
      </award>
      <award credit="0.8" allowederrorinnumbers="0.0001">
        $_math1
      </award>
      <award credit="0.6" allowederrorinnumbers="0.001">
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputEditiableFieldAnchor =
        "#" + mathinputName + " .mq-editable-field";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("log(32x+c){enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinputEditiableFieldAnchor)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
            "log(32x+c)",
          );
        });
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.04x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.01x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("shink error further");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.001x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "80 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.8,
          1e-14,
        );
      });

      cy.log("acceptable error for full credit");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.0001x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("increase error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.999x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "80 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.8,
          1e-14,
        );
      });

      cy.log("increase error further");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.99x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("error too large again");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.9x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });
    });
  });

  it("expression with single number, absolute error", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>log(32x+c)</math> 
    <answer>
      <award allowederrorinnumbers="0.00001" allowederrorisabsolute="true">
        $_math1
      </award>
      <award credit="0.8" allowederrorinnumbers="0.0001" allowederrorisabsolute="true">
        $_math1
      </award>
      <award credit="0.6" allowederrorinnumbers="0.001" allowederrorisabsolute="true">
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("log(32x+c){enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.002x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.0005x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("shink error further");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.00005x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "80 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.8,
          1e-14,
        );
      });

      cy.log("acceptable error for full credit");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.000005x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("increase error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.99995x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "80 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.8,
          1e-14,
        );
      });

      cy.log("increase error further");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.9995x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("error too large again");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.995x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });
    });
  });

  // since will randomly fail, just skip test
  it.skip("complicated expression with three numbers", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math simplify>10 exp(7x^2/(3-sqrt(y)))</math> 
    <answer>
      <award allowederrorinnumbers="0.0000001">
        $_math1
      </award>
      <award credit="0.6" allowederrorinnumbers="0.0001">
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("10 exp(7x^2/3-sqrty{enter}");
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error");
      cy.get(mathinputAnchor).clear().type("9.9 exp(6.9x^2/3.1-sqrty{enter}");
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error");
      cy.get(mathinputAnchor)
        .clear()
        .type("10.0001 exp(7.00005x^2/2.99995-sqrty{enter}");
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("acceptable error for full credit");
      cy.get(mathinputAnchor)
        .clear()
        .type("10.0000001 exp(7.0000001x^2/2.9999999-sqrty{enter}");
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });
    });
  });

  it("don't ignore exponents", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>10x^2-4</math> 
    <answer>
      <award allowederrorinnumbers="0.0001">
        $_math1
      </award>
    </answer>
    </p>

    <p>Allow for error in exponents
    <answer>
      <award allowederrorinnumbers="0.0001" includeerrorinnumberexponents>
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      let mathinput2Name = cesc2(
        stateVariables["/_answer2"].stateValues.inputChildren[0].componentName,
      );
      let mathinput2Anchor = "#" + mathinput2Name + " textarea";
      let mathinput2SubmitAnchor = "#" + mathinput2Name + "_submit";
      let mathinput2CorrectAnchor = "#" + mathinput2Name + "_correct";
      let mathinput2PartialAnchor = "#" + mathinput2Name + "_partial";
      let mathinput2IncorrectAnchor = "#" + mathinput2Name + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinput2SubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("10x^2{rightarrow}-4{enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinput2Anchor).type("10x^2{rightarrow}-4{enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinput2CorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}10.002x^2.0004{rightarrow}-4.0008",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(mathinput2Anchor).type(
        "{ctrl+home}{shift+end}{backspace}10.002x^2.0004{rightarrow}-4.0008",
        { force: true, delay: 5 },
      );
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Too large an error if don't allow exponent error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}10.002x^2{rightarrow}-4.0008",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(mathinput2Anchor).type(
        "{ctrl+home}{shift+end}{backspace}10.002x^2{rightarrow}-4.0008",
        { force: true, delay: 5 },
      );
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Shrink to allowable error in both cases");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}10.0002x^2{rightarrow}-4.00008",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinput2Anchor).type(
        "{ctrl+home}{shift+end}{backspace}10.0002x^2{rightarrow}-4.00008",
        { force: true, delay: 5 },
      );
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
      });
    });
  });

  it("symbolic, expression with single number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>log(32x+c)</math> 
    <answer>
      <award symbolicequality="true" allowederrorinnumbers="0.00001" simplifyOnCompare>
        $_math1
      </award>
      <award credit="0.8" symbolicequality="true" allowederrorinnumbers="0.0001" simplifyOnCompare>
        $_math1
      </award>
      <award credit="0.6" symbolicequality="true" allowederrorinnumbers="0.001" simplifyOnCompare>
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("log(32x+c){enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.04x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.01x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("shink error further");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.001x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "80 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.8,
          1e-14,
        );
      });

      cy.log("acceptable error for full credit");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.0001x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("increase error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.999x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "80 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.8,
          1e-14,
        );
      });

      cy.log("increase error further");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.99x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("error too large again");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.9x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });
    });
  });

  it("symbolic, expression with single number, absolute error", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>log(32x+c)</math> 
    <answer symbolicequality allowederrorinnumbers="0.00001" allowederrorisabsolute simplifyOnCompare>
      <award>$_math1</award>
      <award credit="0.8" allowederrorinnumbers="0.0001">$_math1</award>
      <award credit="0.6" allowederrorinnumbers="0.001">$_math1</award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("log(32x+c){enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.002x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.0005x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("shink error further");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.00005x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "80 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.8,
          1e-14,
        );
      });

      cy.log("acceptable error for full credit");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(32.000005x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("increase error");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.99995x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "80 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.8,
          1e-14,
        );
      });

      cy.log("increase error further");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.9995x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("error too large again");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}log(31.995x+c)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });
    });
  });

  it("symbolic, complicated expression with three numbers", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>10000 exp(7x^2/(0.00003-sqrt(y)))</math> 
    <answer symbolicequality simplifyOnCompare>
      <award allowederrorinnumbers="0.0000001" >
        $_math1
      </award>
      <award credit="0.8" allowederrorinnumbers="0.000001">
        $_math1
      </award>
      <award credit="0.6" allowederrorinnumbers="0.00001">
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type(
        "10000 exp(7x^2{rightarrow}/0.00003-sqrty{enter}",
        { force: true, delay: 5 },
      );
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in first number");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}9999 exp(7x^2{rightarrow}/0.00003-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in second number");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}10000 exp(7.0001x^2{rightarrow}/0.00003-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in third number");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}10000 exp(7x^2{rightarrow}/0.0000300005-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("partial credit error in each");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}9999.91 exp(7.00005x^2{rightarrow}/0.0000300002-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("higher partial credit error in each");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}9999.991 exp(7.000005x^2{rightarrow}/0.00003000002-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "80 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.8,
          1e-14,
        );
      });

      cy.log("acceptable error for full credit");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}9999.9991 exp(7.0000005x^2{rightarrow}/0.000030000002-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });
    });
  });

  it("symbolic, complicated expression with three numbers, absolute error", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math simplify>10000 exp(7x^2/(0.00003-sqrt(y)))</math> 
    <answer>
      <award symbolicequality="true" allowederrorinnumbers="0.0000001" allowederrorisabsolute simplifyOnCompare>
        $_math1
      </award>
      <award symbolicequality="true" credit="0.8" allowederrorinnumbers="0.000001" allowederrorisabsolute simplifyOnCompare>
        $_math1
      </award>
      <award symbolicequality="true" credit="0.6" allowederrorinnumbers="0.00001" allowederrorisabsolute simplifyOnCompare>
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type(
        "10000 exp(7x^2{rightarrow}/0.00003-sqrty{enter}",
        { force: true, delay: 5 },
      );
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in first number");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}9999.9999 exp(7x^2{rightarrow}/0.00003-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in second number");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}10000 exp(7.00002x^2{rightarrow}/0.00003-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in third number");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}10000 exp(7x^2{rightarrow}/0.00005-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("partial credit error in each");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}9999.999991 exp(7.000005x^2{rightarrow}/0.000032-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "60 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.6,
          1e-14,
        );
      });

      cy.log("higher partial credit error in each");
      cy.get(mathinputAnchor)
        .type(
          "{ctrl+home}{shift+end}{backspace}9999.9999991 exp(7.0000005x^2{rightarrow}/0.0000302-sqrty",
          { force: true, delay: 5 },
        )
        .blur();

      // wait for the value in the input to be rounded before submitting
      // so that the change doesn't occur after the submission
      // and make justSubmitted of the answer be false
      cy.get(`#${mathinputName} .mq-editable-field`).should(
        "not.contain.text",
        "9999.9999991",
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "80 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.8,
          1e-14,
        );
      });

      cy.log("acceptable error for full credit");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}9999.99999991 exp(7.00000005x^2{rightarrow}/0.00003002-sqrty",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });
    });
  });

  it("symbolic, don't ignore exponents", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math simplify>10x^2-4</math> 
    <answer>
      <award symbolicequality="true" allowederrorinnumbers="0.0001" simplifyOnCompare>
        $_math1
      </award>
    </answer>
    </p>

    <p>Allow for error in exponents
    <answer>
      <award symbolicequality="true" allowederrorinnumbers="0.0001" includeerrorinnumberexponents simplifyOnCompare>
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      let mathinput2Name = cesc2(
        stateVariables["/_answer2"].stateValues.inputChildren[0].componentName,
      );
      let mathinput2Anchor = "#" + mathinput2Name + " textarea";
      let mathinput2SubmitAnchor = "#" + mathinput2Name + "_submit";
      let mathinput2CorrectAnchor = "#" + mathinput2Name + "_correct";
      let mathinput2PartialAnchor = "#" + mathinput2Name + "_partial";
      let mathinput2IncorrectAnchor = "#" + mathinput2Name + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");
      cy.get(mathinput2SubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("10x^2{rightarrow}-4{enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinput2Anchor).type("10x^2{rightarrow}-4{enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinput2CorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in exponent");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}10x^2.0004{rightarrow}-4",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(mathinput2Anchor).type(
        "{ctrl+home}{shift+end}{backspace}10x^2.0004{rightarrow}-4",
        { force: true, delay: 5 },
      );
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2IncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Small error in exponent");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}10x^2.0001{rightarrow}-4",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");
      cy.get(mathinput2Anchor).type(
        "{ctrl+home}{shift+end}{backspace}10x^2.0001{rightarrow}-4",
        { force: true, delay: 5 },
      );
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Error in numbers not in exponents");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}10.0002x^2{rightarrow}-4.00008",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");
      cy.get(mathinput2Anchor).type(
        "{ctrl+home}{shift+end}{backspace}10.0002x^2{rightarrow}-4.00008",
        { force: true, delay: 5 },
      );
      cy.get(mathinput2SubmitAnchor).click();
      cy.get(mathinput2CorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
      });
    });
  });

  it("symbolic, no simplification", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>2.15234262pi+e*25.602348230</math> 
    <answer>
      <award symbolicequality="true" allowederrorinnumbers="0.001">
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("2.15234262pi+e*25.602348230{enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering not allowed");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}pi2.15234262+e*25.602348230",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}e*25.602348230+2.15234262pi",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Numeric evaluation not allowed");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}.35618172248981",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Round too much");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}2.15pi+e*25.602348230",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}2.15234262pi+2.73*25.602348230",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("acceptable rounding");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}2.152 3.142 + 2.718*25.6",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });
    });
  });

  // TODO: currently failing.  Need to investigate
  it.skip("symbolic, evaluate numbers, preserve order", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>sin(2pi+1x+4x+pi+6)</math> 
    <answer>
      <award symbolicequality="true" allowederrorinnumbers="0.001" simplifyOnCompare="numbersPreserveOrder">
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("sin(2pi+1x+4x+pi+6){enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering not allowed");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(2pi+pi+1x+4x+6)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Combining terms not allowed");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(2pi+5x+pi+6)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Numeric evaluation OK");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(6.28318+x+4x+9.14159)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Round too much");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(6.28318+x+4x+9.14",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}6.28+x+4x+9.14159",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });
    });
  });

  it("symbolic, evaluate numbers", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>sin(2pi+1x+4x+pi+6)</math> 
    <answer>
      <award symbolicequality="true" allowederrorinnumbers="0.001" simplifyOnCompare="numbers">
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("sin(2pi+1x+4x+pi+6){enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering allowed");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(2pi+pi+1x+4x+6)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combining terms not allowed");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(2pi+5x+pi+6)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });

      cy.log("Numeric evaluation OK");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(6.28318+x+4x+9.14159)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(x+15.42478+4x)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Round too much");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(x+15.4+4x)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });
    });
  });

  it("symbolic, full simplification", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>sin(2pi+1x+4x+pi+6)</math> 
    <answer>
      <award symbolicequality="true" allowederrorinnumbers="0.001" simplifyOnCompare="full">
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("sin(2pi+1x+4x+pi+6){enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering allowed");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(2pi+pi+1x+4x+6)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combining terms allowed");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(2pi+5x+pi+6)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Numeric evaluation OK");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(6.28318+x+4x+9.14159)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(15.42478+5x)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Round too much");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}sin(15.4+5x)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
      });
    });
  });

  it("expression with vector, matchPartial", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math>(log(32x+c), 42)</math> 
    <answer matchPartial>
      <award allowederrorinnumbers="0.001">
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("(log(32x+c), 42){enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in first component");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}(log(32.04x+c), 42)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "50 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0.5);
      });

      cy.log("Enter too large an error in second component");
      cy.get(mathinputAnchor).type("{end}{leftArrow}.3", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0.0);
      });

      cy.log("shink error in first component");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}(log(32.01x+c), 42.3)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "50 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.5,
          1e-14,
        );
      });

      cy.log("Shrink error in second component");
      cy.get(mathinputAnchor).type("{end}{leftArrow}{leftArrow}0", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1.0);
      });
    });
  });

  it("expression with vector, matchPartial, unordered", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><math unordered>(42, log(32x+c))</math> 
    <answer matchPartial>
      <award allowederrorinnumbers="0.001">
        $_math1
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputName = cesc2(
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName,
      );
      let mathinputAnchor = "#" + mathinputName + " textarea";
      let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
      let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
      let mathinputPartialAnchor = "#" + mathinputName + "_partial";
      let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

      cy.get(mathinputSubmitAnchor).should("be.visible");

      cy.log("Submit exact answer");
      cy.get(mathinputAnchor).type("(log(32x+c), 42){enter}", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in first component");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}(log(32.04x+c), 42)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "50 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0.5);
      });

      cy.log("Enter too large an error in second component");
      cy.get(mathinputAnchor).type("{end}{leftArrow}.3", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputIncorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0.0);
      });

      cy.log("shink error in first component");
      cy.get(mathinputAnchor).type(
        "{ctrl+home}{shift+end}{backspace}(log(32.01x+c), 42.3)",
        { force: true, delay: 5 },
      );
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputPartialAnchor).should("have.text", "50 %");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).closeTo(
          0.5,
          1e-14,
        );
      });

      cy.log("Shrink error in second component");
      cy.get(mathinputAnchor).type("{end}{leftArrow}{leftArrow}0", {
        force: true,
        delay: 5,
      });
      cy.get(mathinputSubmitAnchor).click();
      cy.get(mathinputCorrectAnchor).should("be.visible");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1.0);
      });
    });
  });

  it("expression with math lists, matchPartial", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><mathlist name="ml">log(32x+c) 42</mathlist> 
    <answer name="ans" matchPartial allowederrorinnumbers="0.001">
      <mathinput name="mi1" />
      <mathinput name="mi2" />
      <award>
        <when><mathlist>$mi1 $mi2</mathlist> = $ml</when>
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/ans_submit")).should("be.visible");

    cy.log("Submit exact answer");
    cy.get(cesc("#\\/mi1") + " textarea").type("log(32x+c)", {
      force: true,
      delay: 5,
    });
    cy.get(cesc("#\\/mi2") + " textarea").type("42", { force: true, delay: 5 });

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_correct")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);
    });

    cy.log("Enter too large an error in first component");
    cy.get(cesc("#\\/mi1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}log(32.04x+c)",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0.5);
    });

    cy.log("Enter too large an error in second component");
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}.3{enter}", {
      force: true,
      delay: 5,
    });
    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_incorrect")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0.0);
    });

    cy.log("shink error in first component");
    cy.get(cesc("#\\/mi1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}log(32.01x+c)",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.creditAchieved).closeTo(
        0.5,
        1e-14,
      );
    });

    cy.log("Shrink error in second component");
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{leftArrow}0", {
      force: true,
      delay: 5,
    });
    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_correct")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1.0);
    });
  });

  it("expression with math lists, matchPartial, unordered", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>a</p>
    <p><mathlist name="ml" unordered>42 log(32x+c)</mathlist> 
    <answer name="ans" matchPartial allowederrorinnumbers="0.001">
      <mathinput name="mi1" />
      <mathinput name="mi2" />
      <award>
        <when><mathlist>$mi1 $mi2</mathlist> = $ml</when>
      </award>
    </answer>
    </p>
    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/ans_submit")).should("be.visible");

    cy.log("Submit exact answer");
    cy.get(cesc("#\\/mi1") + " textarea").type("log(32x+c)", {
      force: true,
      delay: 5,
    });
    cy.get(cesc("#\\/mi2") + " textarea").type("42", { force: true, delay: 5 });

    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_correct")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);
    });

    cy.log("Enter too large an error in first component");
    cy.get(cesc("#\\/mi1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}log(32.04x+c)",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0.5);
    });

    cy.log("Enter too large an error in second component");
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}.3", {
      force: true,
      delay: 5,
    });
    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_incorrect")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0.0);
    });

    cy.log("shink error in first component");
    cy.get(cesc("#\\/mi1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}log(32.01x+c)",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.creditAchieved).closeTo(
        0.5,
        1e-14,
      );
    });

    cy.log("Shrink error in second component");
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{leftArrow}0", {
      force: true,
      delay: 5,
    });
    cy.get(cesc("#\\/ans_submit")).click();
    cy.get(cesc("#\\/ans_correct")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1.0);
    });
  });
});
