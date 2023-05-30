import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("MatrixInput Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("no arguments, copy matrixinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Matrix 1: <matrixInput name="mi1" /></p>
    <p>Matrix 2: <copy target="mi1" assignNames="mi2" createComponentOfType="matrixInput" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m1" /></p>
    <p>Matrix 4: <copy prop="immediateValue" target="mi1" assignNames="m2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[＿]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "＿"]]];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type a in mi1");
    cy.get(cesc("#\\/mi1") + " textarea").type("a", { force: true });

    cy.get(cesc("#\\/m2") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[＿]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAstA = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      let matrixAstBlank = [
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(
        matrixAstA,
      );
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAstBlank);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(
        matrixAstA,
      );
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAstBlank);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAstBlank);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAstA);
    });

    cy.log("blur");
    cy.get(cesc("#\\/mi1") + " textarea").blur();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row to mi1");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a＿]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a＿]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[a＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "a"], ["tuple", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type b in second row of mi2");
    cy.get(cesc("#\\/mi2_component_1_0") + " textarea").type("b", {
      force: true,
    });

    cy.get(cesc("#\\/m2") + " .mjx-mrow").should("contain.text", "[ab]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a＿]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "a"], ["tuple", "＿"]],
      ];
      let matrixAstB = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "a"], ["tuple", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(
        matrixAstB,
      );
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(
        matrixAstB,
      );
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAstB);
    });

    cy.log("type enter");
    cy.get(cesc("#\\/mi2_component_1_0") + " textarea").type("{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ab]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "a"], ["tuple", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column to mi2");
    cy.get(cesc("#\\/mi2_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a＿b＿]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[a＿b＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[a＿b＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "a", "＿"], ["tuple", "b", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("c and d in second column");
    cy.get(cesc("#\\/mi2_component_0_1") + " textarea").type("c", {
      force: true,
    });
    cy.get(cesc("#\\/mi2_component_1_1") + " textarea").type("d", {
      force: true,
    });

    cy.get(cesc("#\\/m2") + " .mjx-mrow").should("contain.text", "[acbd]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[acb＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[acbd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "a", "c"], ["tuple", "b", "＿"]],
      ];
      let matrixAstD = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "a", "c"], ["tuple", "b", "d"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(
        matrixAstD,
      );
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(
        matrixAstD,
      );
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAstD);
    });

    cy.log("blur");
    cy.get(cesc("#\\/mi2_component_1_1") + " textarea").blur();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[acbd]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[acbd]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[acbd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "a", "c"], ["tuple", "b", "d"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove row in mi2");
    cy.get(cesc("#\\/mi2_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ac]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ac]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ac]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "a", "c"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change second value");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ae]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ae]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ae]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "a", "e"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove column in mi1");
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi2_component_0_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[f]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[f]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[f]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "f"]]];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("values remembered when add back row and column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi2_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[febd]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[febd]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[febd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "f", "e"], ["tuple", "b", "d"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}g",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}h",
      { force: true },
    );
    cy.get(cesc("#\\/mi2_component_1_0") + " textarea").type(
      "{end}{backspace}i",
      { force: true },
    );
    cy.get(cesc("#\\/mi2_component_1_1") + " textarea")
      .type("{end}{backspace}j", { force: true })
      .blur();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ghij]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ghij]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "g", "h"], ["tuple", "i", "j"]],
      ];
      expect(stateVariables["/mi1"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.immediateValue).eqls(matrixAst);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with matrix", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Matrix 1: <matrixInput name="mi1" format="latex" prefill="\\begin{matrix}a & b\\\\c & d\\end{matrix}" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[abcd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "a", "b"], ["tuple", "c", "d"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove column");
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ac]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ac]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "a"], ["tuple", "c"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}z{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[zc]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[zc]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "z"], ["tuple", "c"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column back");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[zbcd]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[zbcd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "z", "b"], ["tuple", "c", "d"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[kgfh]");

    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with matrix, start smaller", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" format="latex" prefill="\\begin{matrix}a & b\\\\c & d\\end{matrix}" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row and column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}e{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ec]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ec]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "c"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type f in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column via mathinput");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ebfd]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ebfd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "b"], ["tuple", "f", "d"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with vector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "a"], ["tuple", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove row");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("restore row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eb]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[eb]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type f in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿f＿]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "＿"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();
    cy.get(cesc("#\\/mi1_columnDecrement")).click();
    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[kgfh]");

    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with altvector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>Matrix 1: <matrixInput name="mi1" prefill="⟨a,b⟩" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "a"], ["tuple", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove row");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("restore row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eb]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[eb]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type f in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿f＿]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "＿"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();
    cy.get(cesc("#\\/mi1_columnDecrement")).click();
    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[kgfh]");

    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with vector, start smaller", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row and column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      console.log(stateVariables["/mi1"].stateValues.value);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}e{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eb]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[eb]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type f in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column via mathinput");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿f＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "＿"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with altvector, start smaller", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="⟨a,b⟩" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row and column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      console.log(stateVariables["/mi1"].stateValues.value);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}e{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eb]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[eb]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type f in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column via mathinput");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿f＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "＿"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with transpose of vector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)^T" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "a", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove column");
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("restore column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eb]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[eb]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eb＿＿]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eb＿＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "b"], ["tuple", "＿", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[kgfh]");

    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with transpose of altvector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>Matrix 1: <matrixInput name="mi1" prefill="⟨a,b⟩^T" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "a", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove column");
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("restore column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eb]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[eb]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eb＿＿]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eb＿＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "b"], ["tuple", "＿", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[kgfh]");

    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with transpose of vector, start smaller", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)^T" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row and column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      console.log(stateVariables["/mi1"].stateValues.value);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}e{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type f in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column via mathinput");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ebf＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ebf＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "b"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with transpose of altvector, start smaller", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="⟨a,b⟩^T" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row and column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      console.log(stateVariables["/mi1"].stateValues.value);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}e{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type f in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column via mathinput");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ebf＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ebf＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "b"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with transpose of vector, start smaller, alternative format", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)'" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row and column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      console.log(stateVariables["/mi1"].stateValues.value);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}e{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type f in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column via mathinput");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ebf＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ebf＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "b"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("prefill with transpose of altvector, start smaller, alternative format", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" /></p>
    <p>Number of columns: <mathinput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="⟨a,b⟩'" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <copy prop="value" target="mi1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 0, 0], ["tuple"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row and column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[a]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[a]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];
      console.log(stateVariables["/mi1"].stateValues.value);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}e{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("type f in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column via mathinput");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ebf＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ebf＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "b"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to matrix", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1.numRows)" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1.numColumns)" /></p>

    <p>Matrix 1: <math name="m1" format="latex">\\begin{matrix}a & b\\\\c & d\\end{matrix}</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[abcd]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[abcd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "a", "b"], ["tuple", "c", "d"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change entries");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to matrix, ignore size via definition", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" prefill="7" /></p>
    <p>Number of columns: <mathinput name="numColumns" prefill="5" /></p>

    <p>Matrix 1: <math name="m1" format="latex">\\begin{matrix}a & b\\\\c & d\\end{matrix}</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>

    <p><textinput name="ti" /> <copy prop="value" target="ti" assignNames="t" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[abcd]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[abcd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "a", "b"], ["tuple", "c", "d"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ebcd]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("d");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ebcd]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ebcd]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "b"], ["tuple", "c", "d"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove row");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eb]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[eb]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eb]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("ignore change in numRows");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}9{enter}", {
      force: true,
    });

    // wait for core to responds to change in textinput, so know have waited long enough
    cy.get(cesc("#\\/ti_input")).type("wait{enter}");

    cy.get(cesc("#\\/t")).should("have.text", "wait");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("9");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[eb]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eb]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to vector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1.numRows)" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1.numColumns)" /></p>

    <p>Vector 1: <math name="m1">(a,b)</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "(a,b)");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let vectorAst = ["tuple", "a", "b"];
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "a"], ["tuple", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f)");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "(e,f)");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      let vectorAst = ["tuple", "e", "f"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row, original stays a vector");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f,＿)");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,f,＿)");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ef＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"], ["tuple", "＿"]],
      ];
      let vectorAst = ["tuple", "e", "f", "＿"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}z{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f,z)");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,f,z)");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣efz⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"], ["tuple", "z"]],
      ];
      let vectorAst = ["tuple", "e", "f", "z"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove row");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f)");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "(e,f)");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      let vectorAst = ["tuple", "e", "f"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("get value back when add rows");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f,z,＿)");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc(`#\\/mi1_component_3_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,f,z,＿)");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣efz＿⎤⎥\n⎥\n⎥\n⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 4, 1],
        [
          "tuple",
          ["tuple", "e"],
          ["tuple", "f"],
          ["tuple", "z"],
          ["tuple", "＿"],
        ],
      ];
      let vectorAst = ["tuple", "e", "f", "z", "＿"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_3_0") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f,＿,y)");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_3_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,f,＿,y)");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣ef＿y⎤⎥\n⎥\n⎥\n⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 4, 1],
        [
          "tuple",
          ["tuple", "e"],
          ["tuple", "f"],
          ["tuple", "＿"],
          ["tuple", "y"],
        ],
      ];
      let vectorAst = ["tuple", "e", "f", "＿", "y"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("back to 2D vector");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f)");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "(e,f)");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      let vectorAst = ["tuple", "e", "f"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column via mathinput");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿f＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "＿"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to altvector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1.numRows)" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1.numColumns)" /></p>

    <p>Vector 1: <math name="m1">⟨a,b⟩</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "⟨a,b⟩");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let vectorAst = ["altvector", "a", "b"];
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "a"], ["tuple", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f⟩");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "⟨e,f⟩");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      let vectorAst = ["altvector", "e", "f"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row, original stays a vector");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f,＿⟩");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,f,＿⟩");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣ef＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"], ["tuple", "＿"]],
      ];
      let vectorAst = ["altvector", "e", "f", "＿"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}z{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f,z⟩");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,f,z⟩");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣efz⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"], ["tuple", "z"]],
      ];
      let vectorAst = ["altvector", "e", "f", "z"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove row");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f⟩");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "⟨e,f⟩");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      let vectorAst = ["altvector", "e", "f"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("get value back when add rows");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f,z,＿⟩");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc(`#\\/mi1_component_3_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,f,z,＿⟩");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣efz＿⎤⎥\n⎥\n⎥\n⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 4, 1],
        [
          "tuple",
          ["tuple", "e"],
          ["tuple", "f"],
          ["tuple", "z"],
          ["tuple", "＿"],
        ],
      ];
      let vectorAst = ["altvector", "e", "f", "z", "＿"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_3_0") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f,＿,y⟩");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_3_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,f,＿,y⟩");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢\n⎢\n⎢\n⎢⎣ef＿y⎤⎥\n⎥\n⎥\n⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 4, 1],
        [
          "tuple",
          ["tuple", "e"],
          ["tuple", "f"],
          ["tuple", "＿"],
          ["tuple", "y"],
        ],
      ];
      let vectorAst = ["altvector", "e", "f", "＿", "y"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("back to 2D vector");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f⟩");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "⟨e,f⟩");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      let vectorAst = ["altvector", "e", "f"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column via mathinput");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿f＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "＿"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("g and h in second column");
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to vector, ignore size via definition", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" prefill="1" /></p>
    <p>Number of columns: <mathinput name="numColumns" prefill="7" /></p>

    <p>Vector 1: <math name="m1">(a,b,c)</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>

    <p><textinput name="ti" /> <copy prop="value" target="ti" assignNames="t" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(a,b,c)");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abc⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let vectorAst = ["tuple", "a", "b", "c"];
      let matrixAst = [
        "matrix",
        ["tuple", 3, 1],
        ["tuple", ["tuple", "a"], ["tuple", "b"], ["tuple", "c"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f,c)");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,f,c)");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣efc⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"], ["tuple", "c"]],
      ];
      let vectorAst = ["tuple", "e", "f", "c"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("ignore change in numColumns");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    // wait for core to responds to change in textinput, so know have waited long enough
    cy.get(cesc("#\\/ti_input")).type("wait{enter}");

    cy.get(cesc("#\\/t")).should("have.text", "wait");

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f,c)");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,f,c)");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣efc⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"], ["tuple", "c"]],
      ];
      let vectorAst = ["tuple", "e", "f", "c"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove row");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f)");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "(e,f)");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      let vectorAst = ["tuple", "e", "f"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿f＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "＿"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to altvector, ignore size via definition", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" prefill="1" /></p>
    <p>Number of columns: <mathinput name="numColumns" prefill="7" /></p>

    <p>Vector 1: <math name="m1">⟨a,b,c⟩</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>

    <p><textinput name="ti" /> <copy prop="value" target="ti" assignNames="t" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨a,b,c⟩");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣abc⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let vectorAst = ["altvector", "a", "b", "c"];
      let matrixAst = [
        "matrix",
        ["tuple", 3, 1],
        ["tuple", ["tuple", "a"], ["tuple", "b"], ["tuple", "c"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f,c⟩");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,f,c⟩");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣efc⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"], ["tuple", "c"]],
      ];
      let vectorAst = ["altvector", "e", "f", "c"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("ignore change in numColumns");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    // wait for core to responds to change in textinput, so know have waited long enough
    cy.get(cesc("#\\/ti_input")).type("wait{enter}");

    cy.get(cesc("#\\/t")).should("have.text", "wait");

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f,c⟩");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,f,c⟩");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣efc⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"], ["tuple", "c"]],
      ];
      let vectorAst = ["altvector", "e", "f", "c"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove row");
    cy.get(cesc("#\\/mi1_rowDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f⟩");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "⟨e,f⟩");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 1],
        ["tuple", ["tuple", "e"], ["tuple", "f"]],
      ];
      let vectorAst = ["altvector", "e", "f"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e＿f＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[e＿f＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "＿"], ["tuple", "f", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to transpose of vector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1.numRows)" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1.numColumns)" /></p>

    <p>Vector 1: <math name="m1">(a,b)^T</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(a,b)T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let vectorAst = ["^", ["tuple", "a", "b"], "T"];
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "a", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g)T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g)T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["^", ["tuple", "e", "g"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column, original stays a vector");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g,＿)T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g,＿)T");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "g", "＿"]],
      ];
      let vectorAst = ["^", ["tuple", "e", "g", "＿"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_2") + " textarea").type(
      "{end}{backspace}z{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g,z)T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g,z)T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[egz]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "g", "z"]],
      ];
      let vectorAst = ["^", ["tuple", "e", "g", "z"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove column");
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g)T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g)T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["^", ["tuple", "e", "g"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("get value back when add columns");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}4{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g,z,＿)T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc(`#\\/mi1_component_0_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g,z,＿)T");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egz＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "e", "g", "z", "＿"]],
      ];
      let vectorAst = ["^", ["tuple", "e", "g", "z", "＿"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_2") + " textarea").type(
      "{end}{backspace}{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_3") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g,＿,y)T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_0_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g,＿,y)T");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿y]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "e", "g", "＿", "y"]],
      ];
      let vectorAst = ["^", ["tuple", "e", "g", "＿", "y"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("back to 2D vector transpose");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g)T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g)T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["^", ["tuple", "e", "g"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eg＿＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "＿", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("f and h in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to transpose of altvector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1.numRows)" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1.numColumns)" /></p>

    <p>Vector 1: <math name="m1">⟨a,b⟩^T</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨a,b⟩T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let vectorAst = ["^", ["altvector", "a", "b"], "T"];
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "a", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g⟩T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g⟩T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["^", ["altvector", "e", "g"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column, original stays a vector");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g,＿⟩T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g,＿⟩T");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "g", "＿"]],
      ];
      let vectorAst = ["^", ["altvector", "e", "g", "＿"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_2") + " textarea").type(
      "{end}{backspace}z{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g,z⟩T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g,z⟩T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[egz]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "g", "z"]],
      ];
      let vectorAst = ["^", ["altvector", "e", "g", "z"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove column");
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g⟩T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g⟩T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["^", ["altvector", "e", "g"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("get value back when add columns");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}4{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g,z,＿⟩T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc(`#\\/mi1_component_0_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g,z,＿⟩T");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egz＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "e", "g", "z", "＿"]],
      ];
      let vectorAst = ["^", ["altvector", "e", "g", "z", "＿"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_2") + " textarea").type(
      "{end}{backspace}{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_3") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g,＿,y⟩T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_0_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g,＿,y⟩T");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿y]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "e", "g", "＿", "y"]],
      ];
      let vectorAst = ["^", ["altvector", "e", "g", "＿", "y"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("back to 2D vector transpose");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g⟩T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g⟩T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["^", ["altvector", "e", "g"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eg＿＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "＿", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("f and h in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to transpose of vector, alternative format", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1.numRows)" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1.numColumns)" /></p>

    <p>Vector 1: <math name="m1">(a,b)'</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(a,b)′");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let vectorAst = ["prime", ["tuple", "a", "b"]];
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "a", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g)′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g)′");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["prime", ["tuple", "e", "g"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column, original stays a vector");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g,＿)′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g,＿)′");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "g", "＿"]],
      ];
      let vectorAst = ["prime", ["tuple", "e", "g", "＿"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_2") + " textarea").type(
      "{end}{backspace}z{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g,z)′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g,z)′");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[egz]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "g", "z"]],
      ];
      let vectorAst = ["prime", ["tuple", "e", "g", "z"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove column");
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g)′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g)′");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["prime", ["tuple", "e", "g"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("get value back when add columns");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}4{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g,z,＿)′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc(`#\\/mi1_component_0_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g,z,＿)′");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egz＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "e", "g", "z", "＿"]],
      ];
      let vectorAst = ["prime", ["tuple", "e", "g", "z", "＿"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_2") + " textarea").type(
      "{end}{backspace}{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_3") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g,＿,y)′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_0_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g,＿,y)′");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿y]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "e", "g", "＿", "y"]],
      ];
      let vectorAst = ["prime", ["tuple", "e", "g", "＿", "y"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("back to 2D vector transpose");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,g)′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,g)′");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["prime", ["tuple", "e", "g"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eg＿＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "＿", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("f and h in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to transpose of vector, alternative format", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" bindValueTo="$(mi1.numRows)" /></p>
    <p>Number of columns: <mathinput name="numColumns" bindValueTo="$(mi1.numColumns)" /></p>

    <p>Vector 1: <math name="m1">⟨a,b⟩'</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨a,b⟩′");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ab]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let vectorAst = ["prime", ["altvector", "a", "b"]];
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "a", "b"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g⟩′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g⟩′");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["prime", ["altvector", "e", "g"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add column, original stays a vector");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g,＿⟩′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g,＿⟩′");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "g", "＿"]],
      ];
      let vectorAst = ["prime", ["altvector", "e", "g", "＿"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_2") + " textarea").type(
      "{end}{backspace}z{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g,z⟩′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g,z⟩′");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[egz]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "g", "z"]],
      ];
      let vectorAst = ["prime", ["altvector", "e", "g", "z"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove column");
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g⟩′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g⟩′");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["prime", ["altvector", "e", "g"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("get value back when add columns");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}4{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g,z,＿⟩′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("z");
      });
    cy.get(cesc(`#\\/mi1_component_0_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g,z,＿⟩′");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egz＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "e", "g", "z", "＿"]],
      ];
      let vectorAst = ["prime", ["altvector", "e", "g", "z", "＿"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_2") + " textarea").type(
      "{end}{backspace}{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_3") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g,＿,y⟩′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("4");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_0_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("y");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g,＿,y⟩′");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿y]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 4],
        ["tuple", ["tuple", "e", "g", "＿", "y"]],
      ];
      let vectorAst = ["prime", ["altvector", "e", "g", "＿", "y"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("back to 2D vector transpose");
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,g⟩′");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,g⟩′");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[eg]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "g"]],
      ];
      let vectorAst = ["prime", ["altvector", "e", "g"]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[eg＿＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[eg＿＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "＿", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("f and h in second row");
    cy.get(cesc("#\\/mi1_component_1_0") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_1_1") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[egfh]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[egfh]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "g"], ["tuple", "f", "h"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row via mathinput");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfh＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfh＿＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "＿", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change third row values");
    cy.get(cesc("#\\/mi1_component_2_0") + " textarea").type(
      "{end}{backspace}i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_2_1") + " textarea").type(
      "{end}{backspace}j{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣egfhij⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣egfhij⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 2],
        [
          "tuple",
          ["tuple", "e", "g"],
          ["tuple", "f", "h"],
          ["tuple", "i", "j"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("down to one entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[e]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[e]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[e]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "e"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change value");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}k{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[k]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc("#\\/m1")).find(".mjx-mrow").eq(0).should("have.text", "[k]");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[k]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "k"]]];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("up to 3x3 entry");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/numColumns") + " textarea").type(
      "{end}{backspace}3{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("k");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("g");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("h");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("i");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("j");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣kg＿fh＿ij＿⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", "k", "g", "＿"],
          ["tuple", "f", "h", "＿"],
          ["tuple", "i", "j", "＿"],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to transpose of vector, ignore size via definition", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" prefill="7" /></p>
    <p>Number of columns: <mathinput name="numColumns" prefill="1" /></p>

    <p>Vector 1: <math name="m1">(a,b,c)^T</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>

    <p><textinput name="ti" /> <copy prop="value" target="ti" assignNames="t" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(a,b,c)T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[abc]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let vectorAst = ["^", ["tuple", "a", "b", "c"], "T"];
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "a", "b", "c"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f,c)T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,f,c)T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[efc]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "f", "c"]],
      ];
      let vectorAst = ["^", ["tuple", "e", "f", "c"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("ignore change in numRows");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    // wait for core to responds to change in textinput, so know have waited long enough
    cy.get(cesc("#\\/ti_input")).type("wait{enter}");

    cy.get(cesc("#\\/t")).should("have.text", "wait");

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f,c)T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,f,c)T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[efc]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "f", "c"]],
      ];
      let vectorAst = ["^", ["tuple", "e", "f", "c"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove column");
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "(e,f)T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "(e,f)T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "f"]],
      ];
      let vectorAst = ["^", ["tuple", "e", "f"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef＿＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ef＿＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ef＿＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "f"], ["tuple", "＿", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("bind to transpose of vector, ignore size via definition", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of rows: <mathinput name="numRows" prefill="7" /></p>
    <p>Number of columns: <mathinput name="numColumns" prefill="1" /></p>

    <p>Vector 1: <math name="m1">⟨a,b,c⟩^T</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m1" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <copy prop="value" target="mi1" assignNames="m2" /></p>

    <p><textinput name="ti" /> <copy prop="value" target="ti" assignNames="t" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("a");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("b");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨a,b,c⟩T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[abc]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let vectorAst = ["^", ["altvector", "a", "b", "c"], "T"];
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "a", "b", "c"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1_component_0_0") + " textarea").type(
      "{end}{backspace}e{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi1_component_0_1") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f,c⟩T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("7");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,f,c⟩T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[efc]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "f", "c"]],
      ];
      let vectorAst = ["^", ["altvector", "e", "f", "c"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("ignore change in numRows");
    cy.get(cesc("#\\/numRows") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    // wait for core to responds to change in textinput, so know have waited long enough
    cy.get(cesc("#\\/ti_input")).type("wait{enter}");

    cy.get(cesc("#\\/t")).should("have.text", "wait");

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f,c⟩T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("1");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("c");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,f,c⟩T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[efc]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 3],
        ["tuple", ["tuple", "e", "f", "c"]],
      ];
      let vectorAst = ["^", ["altvector", "e", "f", "c"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("remove column");
    cy.get(cesc("#\\/mi1_columnDecrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "⟨e,f⟩T");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⟨e,f⟩T");
    cy.get(cesc("#\\/m2")).find(".mjx-mrow").eq(0).should("have.text", "[ef]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 1, 2],
        ["tuple", ["tuple", "e", "f"]],
      ];
      let vectorAst = ["^", ["altvector", "e", "f"], "T"];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(vectorAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });

    cy.log("add row");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[ef＿＿]");

    cy.get(cesc(`#\\/numRows`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/numColumns`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("2");
      });
    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("e");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("f");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ef＿＿]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[ef＿＿]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", "e", "f"], ["tuple", "＿", "＿"]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst);
    });
  });

  it("matrixinput eliminates multicharacter symbols", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math name="varWithNum">x2</math>
    <math name="noSplit" splitSymbols="false">xyz</math>
    <matrixinput name="varWithNum2" bindValueTo="$varWithNum" />
    <matrixinput name="noSplit2" splitSymbols="false" bindValueTo="$noSplit" />
    <copy prop="value" target="varWithNum2" assignNames="varWithNum3"/>
    <copy prop="value" target="noSplit2" assignNames="noSplit3"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/varWithNum"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x2");
      });
    cy.get(cesc(`#\\/varWithNum2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x2");
      });
    cy.get(cesc("#\\/varWithNum3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("[x2]");
      });
    cy.get(cesc("#\\/noSplit"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("xyz");
      });
    cy.get(cesc(`#\\/noSplit2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("xyz");
      });
    cy.get(cesc("#\\/noSplit3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("[xyz]");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/varWithNum"].stateValues.value).eq("x2");
      expect(stateVariables["/varWithNum2"].stateValues.value).eqls([
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "x2"]],
      ]);
      expect(stateVariables["/varWithNum3"].stateValues.value).eqls([
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "x2"]],
      ]);
      expect(stateVariables["/noSplit"].stateValues.value).eq("xyz");
      expect(stateVariables["/noSplit2"].stateValues.value).eqls([
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "xyz"]],
      ]);
      expect(stateVariables["/noSplit3"].stateValues.value).eqls([
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "xyz"]],
      ]);
    });

    cy.get(cesc("#\\/varWithNum2") + " textarea").type(
      "{end}{backspace}u9j{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/noSplit2") + " textarea").type(
      "{end}{backspace}uv{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/noSplit") + " .mjx-mrow").should("contain.text", "[xyuv]");

    cy.get(cesc("#\\/varWithNum"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("[xu9j]");
      });
    cy.get(cesc(`#\\/varWithNum2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("xu9j");
      });
    cy.get(cesc("#\\/varWithNum3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("[xu9j]");
      });
    cy.get(cesc("#\\/noSplit"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("[xyuv]");
      });
    cy.get(cesc(`#\\/noSplit2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("xyuv");
      });
    cy.get(cesc("#\\/noSplit3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("[xyuv]");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/varWithNum"].stateValues.value).eqls([
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "xu9j"]],
      ]);
      expect(stateVariables["/varWithNum2"].stateValues.value).eqls([
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "xu9j"]],
      ]);
      expect(stateVariables["/varWithNum3"].stateValues.value).eqls([
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "xu9j"]],
      ]);
      expect(stateVariables["/noSplit"].stateValues.value).eqls([
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "xyuv"]],
      ]);
      expect(stateVariables["/noSplit2"].stateValues.value).eqls([
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "xyuv"]],
      ]);
      expect(stateVariables["/noSplit3"].stateValues.value).eqls([
        "matrix",
        ["tuple", 1, 1],
        ["tuple", ["tuple", "xyuv"]],
      ]);
    });
  });

  it("default entry, prefill sparse matrix", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>Sparse matrix: <math name="sparse" format="latex">
    \\begin{matrix}\\\\ & 3\\end{matrix}
    </math></p>
    <p>Matrix 1: <matrixInput name="mi1" prefill="$sparse" numRows="3" numColumns="3" /></p>
    <p>Matrix 1A: <copy prop="value" target="mi1" assignNames="m1" /></p>
    <p>Matrix 2: <matrixInput name="mi2" prefill="$sparse" numRows="3" numColumns="3" defaultEntry="0" /></p>
    <p>Matrix 2A: <copy prop="value" target="mi2" assignNames="m2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });

    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣00＿03＿＿＿＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣000030000⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst1 = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", 0, 0, "＿"],
          ["tuple", 0, 3, "＿"],
          ["tuple", "＿", "＿", "＿"],
        ],
      ];
      let matrixAst2 = [
        "matrix",
        ["tuple", 3, 3],
        ["tuple", ["tuple", 0, 0, 0], ["tuple", 0, 3, 0], ["tuple", 0, 0, 0]],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst1);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst1);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst2);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst2);
    });

    cy.log("add column");
    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi2_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣00＿＿03＿＿＿＿＿＿⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_0_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_0_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_1_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_2_3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });

    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣00＿＿03＿＿＿＿＿＿⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣000003000000⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst1 = [
        "matrix",
        ["tuple", 3, 4],
        [
          "tuple",
          ["tuple", 0, 0, "＿", "＿"],
          ["tuple", 0, 3, "＿", "＿"],
          ["tuple", "＿", "＿", "＿", "＿"],
        ],
      ];
      let matrixAst2 = [
        "matrix",
        ["tuple", 3, 4],
        [
          "tuple",
          ["tuple", 0, 0, 0, 0],
          ["tuple", 0, 3, 0, 0],
          ["tuple", 0, 0, 0, 0],
        ],
      ];
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst1);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst1);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst2);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst2);
    });
  });

  it("default entry, bind value to sparse matrix", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>Sparse matrix: <math name="sparse1" format="latex">
    \\begin{matrix}\\\\ & 3\\end{matrix}
    </math></p>
    <p>Sparse matrix 2: <copy target="sparse1" link="false" assignNames="sparse2" /></p>
    <p>Matrix 1: <matrixInput name="mi1" bindValueTo="$sparse1" numRows="3" numColumns="3" /></p>
    <p>Matrix 1A: <copy prop="value" target="mi1" assignNames="m1" /></p>
    <p>Matrix 2: <matrixInput name="mi2" bindValueTo="$sparse2" numRows="3" numColumns="3" defaultEntry="0" /></p>
    <p>Matrix 2A: <copy prop="value" target="mi2" assignNames="m2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });

    cy.get(cesc("#\\/sparse1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[0003]");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[0003]");
    cy.get(cesc("#\\/sparse2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[0003]");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "[0003]");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst1 = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", 0, 0], ["tuple", 0, 3]],
      ];
      let matrixAst2 = [
        "matrix",
        ["tuple", 2, 2],
        ["tuple", ["tuple", 0, 0], ["tuple", 0, 3]],
      ];
      expect(stateVariables["/sparse1"].stateValues.value).eqls(matrixAst1);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst1);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst1);
      expect(stateVariables["/sparse2"].stateValues.value).eqls(matrixAst2);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst2);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst2);
    });

    cy.log("add row and column");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();
    cy.get(cesc("#\\/mi2_rowIncrement")).click();
    cy.get(cesc("#\\/mi1_columnIncrement")).click();
    cy.get(cesc("#\\/mi2_columnIncrement")).click();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣00＿03＿＿＿＿⎤⎥⎦",
    );
    cy.get(cesc("#\\/m2") + " .mjx-mrow").should(
      "contain.text",
      "⎡⎢⎣000030000⎤⎥⎦",
    );

    cy.get(cesc(`#\\/mi1_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi1_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi1_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc(`#\\/mi1_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });

    cy.get(cesc(`#\\/mi2_component_0_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_0_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_0_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_1_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_1_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });
    cy.get(cesc(`#\\/mi2_component_1_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_2_0`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_2_1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });
    cy.get(cesc(`#\\/mi2_component_2_2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0");
      });

    cy.get(cesc("#\\/sparse1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣00＿03＿＿＿＿⎤⎥⎦");
    cy.get(cesc("#\\/m1"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣00＿03＿＿＿＿⎤⎥⎦");
    cy.get(cesc("#\\/sparse2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣000030000⎤⎥⎦");
    cy.get(cesc("#\\/m2"))
      .find(".mjx-mrow")
      .eq(0)
      .should("have.text", "⎡⎢⎣000030000⎤⎥⎦");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matrixAst1 = [
        "matrix",
        ["tuple", 3, 3],
        [
          "tuple",
          ["tuple", 0, 0, "＿"],
          ["tuple", 0, 3, "＿"],
          ["tuple", "＿", "＿", "＿"],
        ],
      ];
      let matrixAst2 = [
        "matrix",
        ["tuple", 3, 3],
        ["tuple", ["tuple", 0, 0, 0], ["tuple", 0, 3, 0], ["tuple", 0, 0, 0]],
      ];
      expect(stateVariables["/sparse1"].stateValues.value).eqls(matrixAst1);
      expect(stateVariables["/mi1"].stateValues.value).eqls(matrixAst1);
      expect(stateVariables["/m1"].stateValues.value).eqls(matrixAst1);
      expect(stateVariables["/sparse2"].stateValues.value).eqls(matrixAst2);
      expect(stateVariables["/mi2"].stateValues.value).eqls(matrixAst2);
      expect(stateVariables["/m2"].stateValues.value).eqls(matrixAst2);
    });
  });

  it("parse scientific notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p><text>a</text></p>
  <p><matrixInput name="mi1" prefill="5E+1" /> <math name="m1" copySource="mi1" /></p>
  <p><matrixInput name="mi2" prefill="5E+1" parseScientificNotation /> <math name="m2" copySource="mi2" /></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/mi1") + " .mq-editable-field").should("have.text", "5E+1");
    cy.get(cesc("#\\/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[5E+1]");
    cy.get(cesc("#\\/mi2") + " .mq-editable-field").should("have.text", "50");
    cy.get(cesc("#\\/m2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[50]");

    cy.get(cesc("#\\/mi1") + " textarea")
      .type("{end}{shift+home}{backspace}2x−3E+2{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/m1") + " .mjx-mrow").should("contain.text", "[2x−3E+2]");

    cy.get(cesc("#\\/mi1") + " .mq-editable-field").should(
      "have.text",
      "2x−3E+2",
    );
    cy.get(cesc("#\\/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x−3E+2]");

    cy.get(cesc("#\\/mi2") + " textarea")
      .type("{end}{shift+home}{backspace}2x-3E+2{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/m2") + " .mjx-mrow").should("contain.text", "[2x−300]");

    cy.get(cesc("#\\/mi2") + " .mq-editable-field").should(
      "have.text",
      "2x−3E+2",
    );
    cy.get(cesc("#\\/m2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2x−300]");
  });

  it("set value from immediateValue on reload", () => {
    let doenetML = `
    <p><matrixinput name="n" /></p>

    <p name="pv">value: $n</p>
    <p name="piv">immediate value: $n.immediateValue</p>
    `;

    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/n") + " textarea").type("1", { force: true });

    cy.get(cesc("#\\/piv") + " .mjx-mrow").should("contain.text", "[1]");
    cy.get(cesc("#\\/piv") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1]");
    cy.get(cesc("#\\/pv") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");

    cy.wait(1500); // wait for debounce

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/pv") + " .mjx-mrow").should("contain.text", "[1]");
    cy.get(cesc("#\\/piv") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1]");
    cy.get(cesc("#\\/pv") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[1]");
  });

  it("minComponentWidth attribute", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <p>Specify min component width: <mathinput name="mcw" prefill="0" /></p>

      <p>Original: <matrixInput name="original" /></p>
      <p>Result: <matrixInput minComponentWidth="$mcw" name="result" /></p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/mcw") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "50px",
    );

    cy.get(cesc("#\\/original_component_0_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
    cy.get(cesc("#\\/result_component_0_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );

    cy.get(cesc("#\\/mcw") + " textarea").type("{end}{backspace}100{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/result_component_0_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "100px",
    );

    cy.get(cesc("#\\/original_rowIncrement")).click();
    cy.get(cesc("#\\/original_columnIncrement")).click();
    cy.get(cesc("#\\/result_rowIncrement")).click();
    cy.get(cesc("#\\/result_columnIncrement")).click();

    cy.get(cesc("#\\/result_component_1_1") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "100px",
    );
    cy.get(cesc("#\\/result_component_0_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "100px",
    );
    cy.get(cesc("#\\/result_component_0_1") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "100px",
    );
    cy.get(cesc("#\\/result_component_1_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "100px",
    );

    cy.get(cesc("#\\/original_component_0_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
    cy.get(cesc("#\\/original_component_0_1") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
    cy.get(cesc("#\\/original_component_1_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
    cy.get(cesc("#\\/original_component_1_1") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );

    cy.get(cesc("#\\/mcw") + " textarea").type("{end}x{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/result_component_0_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
    cy.get(cesc("#\\/result_component_0_1") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
    cy.get(cesc("#\\/result_component_1_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
    cy.get(cesc("#\\/result_component_1_1") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );

    cy.get(cesc("#\\/mcw") + " textarea").type(
      "{end}{backspace}{backspace}{backspace}7{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/result_component_0_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "17px",
    );
    cy.get(cesc("#\\/result_component_0_1") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "17px",
    );
    cy.get(cesc("#\\/result_component_1_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "17px",
    );
    cy.get(cesc("#\\/result_component_1_1") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "17px",
    );

    cy.get(cesc("#\\/mcw") + " textarea").type(
      "{end}{backspace}{backspace}-20{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/result_component_0_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
    cy.get(cesc("#\\/result_component_0_1") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
    cy.get(cesc("#\\/result_component_1_0") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
    cy.get(cesc("#\\/result_component_1_1") + " .mq-editable-field").should(
      "have.css",
      "min-width",
      "0px",
    );
  });

  it("valueChanged", () => {
    let doenetML = `
    <p><matrixInput name="mi1" /> <math copySource="mi1" name="mi1a" /> <boolean copysource="mi1.valueChanged" name="mi1changed" /> <math copySource="mi1.immediateValue" name="mi1iva" /> <boolean copysource="mi1.immediateValueChanged" name="mi1ivchanged" /></p>
    <p><matrixInput name="mi2" prefill="(x,y)" /> <math copySource="mi2" name="mi2a" /> <boolean copysource="mi2.valueChanged" name="mi2changed" /> <math copySource="mi2.immediateValue" name="mi2iva" /> <boolean copysource="mi2.immediateValueChanged" name="mi2ivchanged" /></p>
    <p><matrixInput name="mi3" bindValueTo="$mi1" /> <math copySource="mi3" name="mi3a" /> <boolean copysource="mi3.valueChanged" name="mi3changed" /> <math copySource="mi3.immediateValue" name="mi3iva" /> <boolean copysource="mi3.immediateValueChanged" name="mi3ivchanged" /></p>
    <p><matrixInput name="mi4">$mi2.immediateValue</matrixInput> <math copySource="mi4" name="mi4a" /> <boolean copysource="mi4.valueChanged" name="mi4changed" /> <math copySource="mi4.immediateValue" name="mi4iva" /> <boolean copysource="mi4.immediateValueChanged" name="mi4ivchanged" /></p>

    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "false");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("type in first marks only first immediate value as changed");

    cy.get(cesc2("#/mi1_component_0_0") + " textarea").type("z", {
      force: true,
    });

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow").should("contain.text", "[z]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "false");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("press enter in first marks only first value as changed");

    cy.get(cesc2("#/mi1_component_0_0") + " textarea").type("{enter}", {
      force: true,
    });

    cy.get(cesc2("#/mi1a") + " .mjx-mrow").should("contain.text", "[z]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("type in second marks only second immediate value as changed");

    cy.get(cesc2("#/mi2_component_0_0") + " textarea").type(
      "{end}{backspace}a",
      {
        force: true,
      },
    );

    cy.get(cesc2("#/mi2iva") + " .mjx-mrow").should("contain.text", "[ay]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("press enter in second marks only second value as changed");

    cy.get(cesc2("#/mi2_component_0_0") + " textarea").type("{enter}", {
      force: true,
    });

    cy.get(cesc2("#/mi2a") + " .mjx-mrow").should("contain.text", "[ay]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "true");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("type in third marks third immediate value as changed");

    cy.get(cesc2("#/mi3_component_0_0") + " textarea").type(
      "{end}{backspace}b",
      {
        force: true,
      },
    );

    cy.get(cesc2("#/mi3iva") + " .mjx-mrow").should("contain.text", "[b]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "true");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("press enter in third marks third value as changed");

    cy.get(cesc2("#/mi3_component_0_0") + " textarea").type("{enter}", {
      force: true,
    });

    cy.get(cesc2("#/mi3a") + " .mjx-mrow").should("contain.text", "[b]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "true");
    cy.get(cesc2("#/mi3changed")).should("have.text", "true");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("type in fourth marks fourth immediate value as changed");

    cy.get(cesc2("#/mi4_component_1_0") + " textarea").type(
      "{end}{backspace}c",
      {
        force: true,
      },
    );

    cy.get(cesc2("#/mi4iva") + " .mjx-mrow").should("contain.text", "[ac]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ac]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "true");
    cy.get(cesc2("#/mi3changed")).should("have.text", "true");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "true");

    cy.log("press enter in fourth marks fourth value as changed");

    cy.get(cesc2("#/mi4_component_1_0") + " textarea").type("{enter}", {
      force: true,
    });

    cy.get(cesc2("#/mi4a") + " .mjx-mrow").should("contain.text", "[ac]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ac]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ac]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ac]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[b]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ac]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "true");
    cy.get(cesc2("#/mi3changed")).should("have.text", "true");
    cy.get(cesc2("#/mi4changed")).should("have.text", "true");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "true");

    cy.log("reload");
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "false");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("type in third marks only third immediate value as changed");

    cy.get(cesc2("#/mi3_component_0_0") + " textarea").type("z", {
      force: true,
    });

    cy.get(cesc2("#/mi3iva") + " .mjx-mrow").should("contain.text", "[z]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "false");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log(
      "press enter in third marks first and third value/immediateValue as changed",
    );

    cy.get(cesc2("#/mi3_component_0_0") + " textarea").type("{enter}", {
      force: true,
    });

    cy.get(cesc2("#/mi3a") + " .mjx-mrow").should("contain.text", "[z]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "true");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("type in fourth marks only fourth immediate value as changed");

    cy.get(cesc2("#/mi4_component_0_0") + " textarea").type(
      "{end}{backspace}a",
      {
        force: true,
      },
    );

    cy.get(cesc2("#/mi4iva") + " .mjx-mrow").should("contain.text", "[ay]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "true");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "true");

    cy.log(
      "press enter in fourth marks third and fourth value/immediateValue as changed",
    );

    cy.get(cesc2("#/mi4_component_0_0") + " textarea").type("{enter}", {
      force: true,
    });

    cy.get(cesc2("#/mi4a") + " .mjx-mrow").should("contain.text", "[ay]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[z]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[ay]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "true");
    cy.get(cesc2("#/mi3changed")).should("have.text", "true");
    cy.get(cesc2("#/mi4changed")).should("have.text", "true");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "true");

    cy.log("reload");
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "false");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("adding row to first marks first value/immediateValue as changed");
    cy.get(cesc("#\\/mi1_rowIncrement")).click();

    cy.get(cesc2("#/mi1a") + " .mjx-mrow").should(
      "contain.text",
      "[\uff3f\uff3f]",
    );

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log(
      "adding column to second marks second value/immediateValue as changed",
    );
    cy.get(cesc("#\\/mi2_columnIncrement")).click();

    cy.get(cesc2("#/mi2a") + " .mjx-mrow").should(
      "contain.text",
      "[x\uff3fy\uff3f]",
    );

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[x\uff3fy\uff3f]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[x\uff3fy\uff3f]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[x\uff3fy\uff3f]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[x\uff3fy\uff3f]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "true");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log("reload");
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "false");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "false");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log(
      "adding column to third marks first and third value/immediateValue as changed",
    );
    cy.get(cesc("#\\/mi3_columnIncrement")).click();

    cy.get(cesc2("#/mi3a") + " .mjx-mrow").should(
      "contain.text",
      "[\uff3f\uff3f]",
    );

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[xy]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "false");
    cy.get(cesc2("#/mi3changed")).should("have.text", "true");
    cy.get(cesc2("#/mi4changed")).should("have.text", "false");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "false");

    cy.log(
      "subtracting row from fourth marks second and fourth value/immediateValue as changed",
    );
    cy.get(cesc("#\\/mi4_rowDecrement")).click();

    cy.get(cesc2("#/mi4a") + " .mjx-mrow").should("contain.text", "[x]");

    cy.get(cesc2("#/mi1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi2a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[x]");
    cy.get(cesc2("#/mi3a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[x]");

    cy.get(cesc2("#/mi1iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi2iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[x]");
    cy.get(cesc2("#/mi3iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[\uff3f\uff3f]");
    cy.get(cesc2("#/mi4iva") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[x]");

    cy.get(cesc2("#/mi1changed")).should("have.text", "true");
    cy.get(cesc2("#/mi2changed")).should("have.text", "true");
    cy.get(cesc2("#/mi3changed")).should("have.text", "true");
    cy.get(cesc2("#/mi4changed")).should("have.text", "true");

    cy.get(cesc2("#/mi1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/mi4ivchanged")).should("have.text", "true");
  });
});
