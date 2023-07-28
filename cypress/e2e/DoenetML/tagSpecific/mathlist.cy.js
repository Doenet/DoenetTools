import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("MathList Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("mathlist from string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist>a 1+1 </mathlist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let child1Name =
        stateVariables["/_mathlist1"].activeChildren[0].componentName;
      let child1Anchor = cesc2("#" + child1Name);
      let child2Name =
        stateVariables["/_mathlist1"].activeChildren[1].componentName;
      let child2Anchor = cesc2("#" + child2Name);

      cy.log("Test value displayed in browser");
      cy.get(child1Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(child2Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1+1");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[0].componentName
          ].stateValues.value,
        ).eq("a");
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[1].componentName
          ].stateValues.value,
        ).eqls(["+", 1, 1]);
        expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
        expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eqls([
          "+",
          1,
          1,
        ]);
      });
    });
  });

  it("mathlist with error in string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist>a @  1+1 </mathlist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let child1Name =
        stateVariables["/_mathlist1"].activeChildren[0].componentName;
      let child1Anchor = cesc2("#" + child1Name);
      let child2Name =
        stateVariables["/_mathlist1"].activeChildren[1].componentName;
      let child2Anchor = cesc2("#" + child2Name);
      let child3Name =
        stateVariables["/_mathlist1"].activeChildren[2].componentName;
      let child3Anchor = cesc2("#" + child3Name);

      cy.log("Test value displayed in browser");
      cy.get(child1Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(child2Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("＿");
        });
      cy.get(child3Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1+1");
        });
      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[0].componentName
          ].stateValues.value,
        ).eq("a");
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[1].componentName
          ].stateValues.value,
        ).eq("＿");
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[2].componentName
          ].stateValues.value,
        ).eqls(["+", 1, 1]);
        expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
        expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq("＿");
        expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eqls([
          "+",
          1,
          1,
        ]);
      });
    });
  });

  it("mathlist in attribute containing math and number macros", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><math name="m1">x</math>
    <math name="m2">3y</math>
    <number name="n1">7</number>
    <number name="n2">11</number></p>
    <p><point xs="$m1 $m2/$n1 $n1 $n1-$n2 $n1 -$n2 $n1 - $n2 $n1$m1$m2 ($n1+$m1)/($n2$m2)" /></p>
    <p><aslist>$_point1.xs{assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11"}</aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3y7");
      });
    cy.get(cesc("#\\/x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/x4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/x6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−11");
      });
    cy.get(cesc("#\\/x7"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/x8"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−");
      });
    cy.get(cesc("#\\/x9"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("11");
      });
    cy.get(cesc("#\\/x10"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("21xy");
      });
    cy.get(cesc("#\\/x11"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x+733y");
      });
    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let xs = stateVariables["/_point1"].stateValues.xs;

      expect(xs.length).eq(11);
      expect(xs[0]).eq("x");
      expect(stateVariables["/x1"].stateValues.value).eq("x");
      expect(xs[1]).eqls(["/", ["*", 3, "y"], 7]);
      expect(stateVariables["/x2"].stateValues.value).eqls([
        "/",
        ["*", 3, "y"],
        7,
      ]);
      expect(xs[2]).eqls(7);
      expect(stateVariables["/x3"].stateValues.value).eqls(7);
      expect(xs[3]).eqls(-4);
      expect(stateVariables["/x4"].stateValues.value).eqls(-4);
      expect(xs[4]).eqls(7);
      expect(stateVariables["/x5"].stateValues.value).eqls(7);
      expect(xs[5]).eqls(-11);
      expect(stateVariables["/x6"].stateValues.value).eqls(-11);
      expect(xs[6]).eqls(7);
      expect(stateVariables["/x7"].stateValues.value).eqls(7);
      expect(xs[7]).eqls("-");
      expect(stateVariables["/x8"].stateValues.value).eqls("-");
      expect(xs[8]).eqls(11);
      expect(stateVariables["/x9"].stateValues.value).eqls(11);
      expect(xs[9]).eqls(["*", 21, "x", "y"]);
      expect(stateVariables["/x10"].stateValues.value).eqls([
        "*",
        21,
        "x",
        "y",
      ]);
      expect(xs[10]).eqls(["/", ["+", "x", 7], ["*", 33, "y"]]);
      expect(stateVariables["/x11"].stateValues.value).eqls([
        "/",
        ["+", "x", 7],
        ["*", 33, "y"],
      ]);
    });
  });

  it("mathlist with math children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <math>1+1</math>
    </mathlist>

    <mathlist>
      <math>a</math><math>1+1</math>
    </mathlist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1+1");
        });
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(cesc("#\\/_math4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1+1");
        });
      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_mathlist1"].activeChildren.length).eq(2);
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[0].componentName
          ].stateValues.value,
        ).eq("a");
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[1].componentName
          ].stateValues.value,
        ).eqls(["+", 1, 1]);
        expect(stateVariables["/_mathlist1"].stateValues.maths.length).eq(2);
        expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
        expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eqls([
          "+",
          1,
          1,
        ]);
        expect(stateVariables["/_mathlist2"].activeChildren.length).eq(2);
        expect(
          stateVariables[
            stateVariables["/_mathlist2"].activeChildren[0].componentName
          ].stateValues.value,
        ).eq("a");
        expect(
          stateVariables[
            stateVariables["/_mathlist2"].activeChildren[1].componentName
          ].stateValues.value,
        ).eqls(["+", 1, 1]);
        expect(stateVariables["/_mathlist2"].stateValues.maths.length).eq(2);
        expect(stateVariables["/_mathlist2"].stateValues.maths[0]).eq("a");
        expect(stateVariables["/_mathlist2"].stateValues.maths[1]).eqls([
          "+",
          1,
          1,
        ]);
      });
    });
  });

  it("mathlist with math and string children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math> q <math>1+1</math>h
    </mathlist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let matha = stateVariables["/_mathlist1"].activeChildren[1];
      let mathaAnchor = cesc2("#" + matha.componentName);
      let mathb = stateVariables["/_mathlist1"].activeChildren[3];
      let mathbAnchor = cesc2("#" + mathb.componentName);

      cy.log("Test value displayed in browser");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(mathaAnchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("q");
        });
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1+1");
        });
      cy.get(mathbAnchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("h");
        });
      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[0].componentName
          ].stateValues.value,
        ).eq("a");
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[1].componentName
          ].stateValues.value,
        ).eq("q");
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[2].componentName
          ].stateValues.value,
        ).eqls(["+", 1, 1]);
        expect(
          stateVariables[
            stateVariables["/_mathlist1"].activeChildren[3].componentName
          ].stateValues.value,
        ).eq("h");
        expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
        expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq("q");
        expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eqls([
          "+",
          1,
          1,
        ]);
        expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("h");
      });
    });
  });

  it("mathlist with math and number children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <number>1+1</number>
    </mathlist>
    <mathlist>
      <math>a</math><number>1+1</number>
    </mathlist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_number1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_number2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathlist1"].activeChildren.length).eq(2);
      expect(
        stateVariables[
          stateVariables["/_mathlist1"].activeChildren[0].componentName
        ].stateValues.value,
      ).eq("a");
      expect(
        stateVariables[
          stateVariables["/_mathlist1"].activeChildren[1].componentName
        ].stateValues.number,
      ).eq(2);
      expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
      expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq(2);
      expect(stateVariables["/_mathlist2"].activeChildren.length).eq(2);
      expect(
        stateVariables[
          stateVariables["/_mathlist2"].activeChildren[0].componentName
        ].stateValues.value,
      ).eq("a");
      expect(
        stateVariables[
          stateVariables["/_mathlist2"].activeChildren[1].componentName
        ].stateValues.number,
      ).eq(2);
      expect(stateVariables["/_mathlist2"].stateValues.maths[0]).eq("a");
      expect(stateVariables["/_mathlist2"].stateValues.maths[1]).eq(2);
    });
  });

  it("mathlist with mathlist children, test inverse", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <mathlist>q r</mathlist>
      <math>h</math>
      <mathlist>
        <mathlist>
          <math>b</math>
          <mathlist>u v</mathlist>
        </mathlist>
        <mathlist>i j</mathlist>
      </mathlist>
    </mathlist>

    <mathinput bindValueTo="$(_mathlist1.math1)" />
    <mathinput bindValueTo="$(_mathlist1.math2)" />
    <mathinput bindValueTo="$(_mathlist1.math3)" />
    <mathinput bindValueTo="$(_mathlist1.math4)" />
    <mathinput bindValueTo="$(_mathlist1.math5)" />
    <mathinput bindValueTo="$(_mathlist1.math6)" />
    <mathinput bindValueTo="$(_mathlist1.math7)" />
    <mathinput bindValueTo="$(_mathlist1.math8)" />
    <mathinput bindValueTo="$(_mathlist1.math9)" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let child1Name =
        stateVariables["/_mathlist2"].activeChildren[0].componentName;
      let child1Anchor = cesc2("#" + child1Name);
      let child2Name =
        stateVariables["/_mathlist2"].activeChildren[1].componentName;
      let child2Anchor = cesc2("#" + child2Name);
      let child5Name =
        stateVariables["/_mathlist5"].activeChildren[0].componentName;
      let child5Anchor = cesc2("#" + child5Name);
      let child6Name =
        stateVariables["/_mathlist5"].activeChildren[1].componentName;
      let child6Anchor = cesc2("#" + child6Name);
      let child7Name =
        stateVariables["/_mathlist6"].activeChildren[0].componentName;
      let child7Anchor = cesc2("#" + child7Name);
      let child8Name =
        stateVariables["/_mathlist6"].activeChildren[1].componentName;
      let child8Anchor = cesc2("#" + child8Name);

      cy.log("Test value displayed in browser");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(child1Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("q");
        });
      cy.get(child2Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("r");
        });
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("h");
        });
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("b");
        });
      cy.get(child5Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("u");
        });
      cy.get(child6Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("v");
        });
      cy.get(child7Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("i");
        });
      cy.get(child8Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("j");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
        expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq("q");
        expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eq("r");
        expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("h");
        expect(stateVariables["/_mathlist1"].stateValues.maths[4]).eq("b");
        expect(stateVariables["/_mathlist1"].stateValues.maths[5]).eq("u");
        expect(stateVariables["/_mathlist1"].stateValues.maths[6]).eq("v");
        expect(stateVariables["/_mathlist1"].stateValues.maths[7]).eq("i");
        expect(stateVariables["/_mathlist1"].stateValues.maths[8]).eq("j");
        expect(stateVariables["/_mathlist2"].stateValues.maths[0]).eq("q");
        expect(stateVariables["/_mathlist2"].stateValues.maths[1]).eq("r");
        expect(stateVariables["/_mathlist3"].stateValues.maths[0]).eq("b");
        expect(stateVariables["/_mathlist3"].stateValues.maths[1]).eq("u");
        expect(stateVariables["/_mathlist3"].stateValues.maths[2]).eq("v");
        expect(stateVariables["/_mathlist3"].stateValues.maths[3]).eq("i");
        expect(stateVariables["/_mathlist3"].stateValues.maths[4]).eq("j");
        expect(stateVariables["/_mathlist4"].stateValues.maths[0]).eq("b");
        expect(stateVariables["/_mathlist4"].stateValues.maths[1]).eq("u");
        expect(stateVariables["/_mathlist4"].stateValues.maths[2]).eq("v");
        expect(stateVariables["/_mathlist5"].stateValues.maths[0]).eq("u");
        expect(stateVariables["/_mathlist5"].stateValues.maths[1]).eq("v");
        expect(stateVariables["/_mathlist6"].stateValues.maths[0]).eq("i");
        expect(stateVariables["/_mathlist6"].stateValues.maths[1]).eq("j");
      });

      cy.log("change values");

      cy.get(cesc("#\\/_mathinput1") + " textarea").type(
        "{end}{backspace}1{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput2") + " textarea").type(
        "{end}{backspace}2{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput3") + " textarea").type(
        "{end}{backspace}3{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput4") + " textarea").type(
        "{end}{backspace}4{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput5") + " textarea").type(
        "{end}{backspace}5{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput6") + " textarea").type(
        "{end}{backspace}6{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput7") + " textarea").type(
        "{end}{backspace}7{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput8") + " textarea").type(
        "{end}{backspace}8{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput9") + " textarea").type(
        "{end}{backspace}9{enter}",
        { force: true },
      );

      cy.get(child8Anchor).should("contain.text", "9");

      cy.log("Test value displayed in browser");
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(child1Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(child2Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/_math2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/_math3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(child5Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("6");
        });
      cy.get(child6Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(child7Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(child8Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq(1);
        expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq(2);
        expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eq(3);
        expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq(4);
        expect(stateVariables["/_mathlist1"].stateValues.maths[4]).eq(5);
        expect(stateVariables["/_mathlist1"].stateValues.maths[5]).eq(6);
        expect(stateVariables["/_mathlist1"].stateValues.maths[6]).eq(7);
        expect(stateVariables["/_mathlist1"].stateValues.maths[7]).eq(8);
        expect(stateVariables["/_mathlist1"].stateValues.maths[8]).eq(9);
        expect(stateVariables["/_mathlist2"].stateValues.maths[0]).eq(2);
        expect(stateVariables["/_mathlist2"].stateValues.maths[1]).eq(3);
        expect(stateVariables["/_mathlist3"].stateValues.maths[0]).eq(5);
        expect(stateVariables["/_mathlist3"].stateValues.maths[1]).eq(6);
        expect(stateVariables["/_mathlist3"].stateValues.maths[2]).eq(7);
        expect(stateVariables["/_mathlist3"].stateValues.maths[3]).eq(8);
        expect(stateVariables["/_mathlist3"].stateValues.maths[4]).eq(9);
        expect(stateVariables["/_mathlist4"].stateValues.maths[0]).eq(5);
        expect(stateVariables["/_mathlist4"].stateValues.maths[1]).eq(6);
        expect(stateVariables["/_mathlist4"].stateValues.maths[2]).eq(7);
        expect(stateVariables["/_mathlist5"].stateValues.maths[0]).eq(6);
        expect(stateVariables["/_mathlist5"].stateValues.maths[1]).eq(7);
        expect(stateVariables["/_mathlist6"].stateValues.maths[0]).eq(8);
        expect(stateVariables["/_mathlist6"].stateValues.maths[1]).eq(9);
      });
    });
  });

  it("mathlist with mathlist children and sugar, test inverse", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist>
      a
      <mathlist>q r</mathlist>  
      <math>h</math>
      <mathlist>
        <mathlist>
          b
          <mathlist>u v</mathlist>
        </mathlist>
        <mathlist>i  j</mathlist>
      </mathlist>
    </mathlist>

    <mathinput bindValueTo="$(_mathlist1.math1)" />
    <mathinput bindValueTo="$(_mathlist1.math2)" />
    <mathinput bindValueTo="$(_mathlist1.math3)" />
    <mathinput bindValueTo="$(_mathlist1.math4)" />
    <mathinput bindValueTo="$(_mathlist1.math5)" />
    <mathinput bindValueTo="$(_mathlist1.math6)" />
    <mathinput bindValueTo="$(_mathlist1.math7)" />
    <mathinput bindValueTo="$(_mathlist1.math8)" />
    <mathinput bindValueTo="$(_mathlist1.math9)" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let child0Name =
        stateVariables["/_mathlist1"].activeChildren[0].componentName;
      let child0Anchor = cesc2("#" + child0Name);
      let child1Name =
        stateVariables["/_mathlist2"].activeChildren[0].componentName;
      let child1Anchor = cesc2("#" + child1Name);
      let child2Name =
        stateVariables["/_mathlist2"].activeChildren[1].componentName;
      let child2Anchor = cesc2("#" + child2Name);
      let child4Name =
        stateVariables["/_mathlist4"].activeChildren[0].componentName;
      let child4Anchor = cesc2("#" + child4Name);
      let child5Name =
        stateVariables["/_mathlist5"].activeChildren[0].componentName;
      let child5Anchor = cesc2("#" + child5Name);
      let child6Name =
        stateVariables["/_mathlist5"].activeChildren[1].componentName;
      let child6Anchor = cesc2("#" + child6Name);
      let child7Name =
        stateVariables["/_mathlist6"].activeChildren[0].componentName;
      let child7Anchor = cesc2("#" + child7Name);
      let child8Name =
        stateVariables["/_mathlist6"].activeChildren[1].componentName;
      let child8Anchor = cesc2("#" + child8Name);

      cy.log("Test value displayed in browser");
      cy.get(child0Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(child1Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("q");
        });
      cy.get(child2Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("r");
        });
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("h");
        });
      cy.get(child4Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("b");
        });
      cy.get(child5Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("u");
        });
      cy.get(child6Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("v");
        });
      cy.get(child7Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("i");
        });
      cy.get(child8Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("j");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
        expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq("q");
        expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eq("r");
        expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("h");
        expect(stateVariables["/_mathlist1"].stateValues.maths[4]).eq("b");
        expect(stateVariables["/_mathlist1"].stateValues.maths[5]).eq("u");
        expect(stateVariables["/_mathlist1"].stateValues.maths[6]).eq("v");
        expect(stateVariables["/_mathlist1"].stateValues.maths[7]).eq("i");
        expect(stateVariables["/_mathlist1"].stateValues.maths[8]).eq("j");
        expect(stateVariables["/_mathlist2"].stateValues.maths[0]).eq("q");
        expect(stateVariables["/_mathlist2"].stateValues.maths[1]).eq("r");
        expect(stateVariables["/_mathlist3"].stateValues.maths[0]).eq("b");
        expect(stateVariables["/_mathlist3"].stateValues.maths[1]).eq("u");
        expect(stateVariables["/_mathlist3"].stateValues.maths[2]).eq("v");
        expect(stateVariables["/_mathlist3"].stateValues.maths[3]).eq("i");
        expect(stateVariables["/_mathlist3"].stateValues.maths[4]).eq("j");
        expect(stateVariables["/_mathlist4"].stateValues.maths[0]).eq("b");
        expect(stateVariables["/_mathlist4"].stateValues.maths[1]).eq("u");
        expect(stateVariables["/_mathlist4"].stateValues.maths[2]).eq("v");
        expect(stateVariables["/_mathlist5"].stateValues.maths[0]).eq("u");
        expect(stateVariables["/_mathlist5"].stateValues.maths[1]).eq("v");
        expect(stateVariables["/_mathlist6"].stateValues.maths[0]).eq("i");
        expect(stateVariables["/_mathlist6"].stateValues.maths[1]).eq("j");
      });

      cy.log("change values");

      cy.get(cesc("#\\/_mathinput1") + " textarea").type(
        "{end}{backspace}1{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput2") + " textarea").type(
        "{end}{backspace}2{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput3") + " textarea").type(
        "{end}{backspace}3{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput4") + " textarea").type(
        "{end}{backspace}4{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput5") + " textarea").type(
        "{end}{backspace}5{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput6") + " textarea").type(
        "{end}{backspace}6{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput7") + " textarea").type(
        "{end}{backspace}7{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput8") + " textarea").type(
        "{end}{backspace}8{enter}",
        { force: true },
      );
      cy.get(cesc("#\\/_mathinput9") + " textarea").type(
        "{end}{backspace}9{enter}",
        { force: true },
      );

      cy.get(child8Anchor).should("contain.text", "9");

      cy.log("Test value displayed in browser");
      cy.get(child0Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(child1Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(child2Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/_math1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(child4Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(child5Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("6");
        });
      cy.get(child6Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(child7Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(child8Anchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq(1);
        expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq(2);
        expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eq(3);
        expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq(4);
        expect(stateVariables["/_mathlist1"].stateValues.maths[4]).eq(5);
        expect(stateVariables["/_mathlist1"].stateValues.maths[5]).eq(6);
        expect(stateVariables["/_mathlist1"].stateValues.maths[6]).eq(7);
        expect(stateVariables["/_mathlist1"].stateValues.maths[7]).eq(8);
        expect(stateVariables["/_mathlist1"].stateValues.maths[8]).eq(9);
        expect(stateVariables["/_mathlist2"].stateValues.maths[0]).eq(2);
        expect(stateVariables["/_mathlist2"].stateValues.maths[1]).eq(3);
        expect(stateVariables["/_mathlist3"].stateValues.maths[0]).eq(5);
        expect(stateVariables["/_mathlist3"].stateValues.maths[1]).eq(6);
        expect(stateVariables["/_mathlist3"].stateValues.maths[2]).eq(7);
        expect(stateVariables["/_mathlist3"].stateValues.maths[3]).eq(8);
        expect(stateVariables["/_mathlist3"].stateValues.maths[4]).eq(9);
        expect(stateVariables["/_mathlist4"].stateValues.maths[0]).eq(5);
        expect(stateVariables["/_mathlist4"].stateValues.maths[1]).eq(6);
        expect(stateVariables["/_mathlist4"].stateValues.maths[2]).eq(7);
        expect(stateVariables["/_mathlist5"].stateValues.maths[0]).eq(6);
        expect(stateVariables["/_mathlist5"].stateValues.maths[1]).eq(7);
        expect(stateVariables["/_mathlist6"].stateValues.maths[0]).eq(8);
        expect(stateVariables["/_mathlist6"].stateValues.maths[1]).eq(9);
      });
    });
  });

  it("mathlist with self references", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist>
      <math>a</math>
      <mathlist>q r</mathlist>
      <math copySource="_mathlist1.math3" name="m4" />
      <mathlist>
        <mathlist name="mid">
          <math name="m2"><math copySource="_mathlist1.math1" /></math>
          <mathlist>u v</mathlist>
        </mathlist>
        <mathlist>
          <math copySource="_mathlist1.math2" name="m8" />
          <math copySource="_mathlist1.math5" name="m9" />
        </mathlist>
      </mathlist>
      $mid{name="mid2"}
    </mathlist>

    <mathinput bindValueTo="$(_mathlist1.math1)" />
    <mathinput bindValueTo="$(_mathlist1.math2)" />
    <mathinput bindValueTo="$(_mathlist1.math3)" />
    <mathinput bindValueTo="$(_mathlist1.math4)" />
    <mathinput bindValueTo="$(_mathlist1.math5)" />
    <mathinput bindValueTo="$(_mathlist1.math6)" />
    <mathinput bindValueTo="$(_mathlist1.math7)" />
    <mathinput bindValueTo="$(_mathlist1.math8)" />
    <mathinput bindValueTo="$(_mathlist1.math9)" />
    <mathinput bindValueTo="$(_mathlist1.math10)" />
    <mathinput bindValueTo="$(_mathlist1.math11)" />
    <mathinput bindValueTo="$(_mathlist1.math12)" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let child0Name = "/_math1";
      let ca0 = cesc2("#" + child0Name);
      let child1Name =
        stateVariables["/_mathlist2"].activeChildren[0].componentName;
      let ca1 = cesc2("#" + child1Name);
      let child2Name =
        stateVariables["/_mathlist2"].activeChildren[1].componentName;
      let ca2 = cesc2("#" + child2Name);
      let child3Name = "/m4";
      let ca3 = cesc2("#" + child3Name);
      let child4Name = "/m2";
      let ca4 = cesc2("#" + child4Name);
      let child5Name =
        stateVariables["/_mathlist5"].activeChildren[0].componentName;
      let ca5 = cesc2("#" + child5Name);
      let child6Name =
        stateVariables["/_mathlist5"].activeChildren[1].componentName;
      let ca6 = cesc2("#" + child6Name);
      let child7Name = "/m8";
      let ca7 = cesc2("#" + child7Name);
      let child8Name = "/m9";
      let ca8 = cesc2("#" + child8Name);
      let child9Name = stateVariables["/mid2"].activeChildren[0].componentName;
      let ca9 = cesc2("#" + child9Name);
      let child10Name =
        stateVariables[stateVariables["/mid2"].activeChildren[1].componentName]
          .activeChildren[0].componentName;
      let ca10 = cesc2("#" + child10Name);
      let child11Name =
        stateVariables[stateVariables["/mid2"].activeChildren[1].componentName]
          .activeChildren[1].componentName;
      let ca11 = cesc2("#" + child11Name);

      let childAnchors = [
        ca0,
        ca1,
        ca2,
        ca3,
        ca4,
        ca5,
        ca6,
        ca7,
        ca8,
        ca9,
        ca10,
        ca11,
      ];
      let vals = ["a", "q", "r", "u", "v"];
      let mapping = [0, 1, 2, 2, 0, 3, 4, 1, 0, 0, 3, 4];
      let mv = (i) => vals[mapping[i]];

      let maths = stateVariables["/_mathlist1"].stateValues.maths;

      let mathinputAnchors = [];
      for (let i in mapping) {
        mathinputAnchors.push(
          cesc(`#\\/_mathinput${Number(i) + 1}`) + ` textarea`,
        );
      }

      cy.log("Test value displayed in browser");

      for (let i in mapping) {
        cy.get(childAnchors[i])
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal(mv(i));
          });
      }

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        for (let i in mapping) {
          expect(maths[i]).eq(mv(i));
        }
      });

      cy.log("change values");

      for (let changeInd in mapping) {
        cy.window().then(async (win) => {
          vals[mapping[changeInd]] = Number(changeInd);
          cy.get(mathinputAnchors[changeInd]).type(
            "{end}{backspace}" + changeInd + "{enter}",
            { force: true },
          );
          cy.get(childAnchors[changeInd]).should(
            "contain.text",
            String(mv(changeInd)),
          );

          cy.log("Test value displayed in browser");

          for (let i in mapping) {
            cy.get(childAnchors[i])
              .find(".mjx-mrow")
              .eq(0)
              .invoke("text")
              .then((text) => {
                expect(text.trim()).equal(String(mv(i)));
              });
          }

          cy.log("Test internal values are set to the correct values");
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let maths = stateVariables["/_mathlist1"].stateValues.maths;

            for (let i in mapping) {
              expect(maths[i]).eq(mv(i));
            }
          });
        });
      }
    });
  });

  // TODO: address maximum number in rendered children of mathlist
  it("mathlist with maximum number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist maxNumber="7">
      <math>a</math>
      <mathlist maxNumber="2">q r l k</mathlist>
      <math>h</math>
      <mathlist maxNumber="4">
        <mathlist maxNumber="2">
          <math>b</math>
          <mathlist>u v</mathlist>
        </mathlist>
        <mathlist>i j k</mathlist>
      </mathlist>
    </mathlist>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      // let stateVariables = await win.returnAllStateVariables1();
      // let child1Name = stateVariables['/_mathlist2'].activeChildren[0].componentName;
      // let child1Anchor = cesc2('#' + child1Name);
      // let child2Name = stateVariables['/_mathlist2'].activeChildren[1].componentName;
      // let child2Anchor = cesc2('#' + child2Name);
      // let child5Name = stateVariables['/_mathlist5'].activeChildren[0].componentName;
      // let child5Anchor = cesc2('#' + child5Name);
      // let child6Name = stateVariables['/_mathlist6'].activeChildren[0].componentName;
      // let child6Anchor = cesc2('#' + child6Name);

      // cy.log('Test value displayed in browser')
      // cy.get(cesc('#\\/_math1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('a')
      // })
      // cy.get(child1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('q')
      // })
      // cy.get(child2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('r')
      // })
      // cy.get(cesc('#\\/_math2')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('h')
      // })
      // cy.get(cesc('#\\/_math3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('b')
      // })
      // cy.get(child5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('u')
      // })
      // cy.get(child6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('i')
      // })

      cy.get(cesc("#\\/_document1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(cesc("#\\/_document1"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("q");
        });
      cy.get(cesc("#\\/_document1"))
        .find(".mjx-mrow")
        .eq(2)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("r");
        });
      cy.get(cesc("#\\/_document1"))
        .find(".mjx-mrow")
        .eq(3)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("h");
        });
      cy.get(cesc("#\\/_document1"))
        .find(".mjx-mrow")
        .eq(4)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("b");
        });
      cy.get(cesc("#\\/_document1"))
        .find(".mjx-mrow")
        .eq(5)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("u");
        });
      cy.get(cesc("#\\/_document1"))
        .find(".mjx-mrow")
        .eq(6)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("i");
        });
      cy.get(cesc("#\\/_document1"))
        .find(".mjx-mrow")
        .eq(7)
        .should("not.exist");

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_mathlist1"].stateValues.maths.length).eq(7);
        expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
        expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq("q");
        expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eq("r");
        expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("h");
        expect(stateVariables["/_mathlist1"].stateValues.maths[4]).eq("b");
        expect(stateVariables["/_mathlist1"].stateValues.maths[5]).eq("u");
        expect(stateVariables["/_mathlist1"].stateValues.maths[6]).eq("i");
        expect(stateVariables["/_mathlist2"].stateValues.maths.length).eq(2);
        expect(stateVariables["/_mathlist2"].stateValues.maths[0]).eq("q");
        expect(stateVariables["/_mathlist2"].stateValues.maths[1]).eq("r");
        expect(stateVariables["/_mathlist3"].stateValues.maths.length).eq(4);
        expect(stateVariables["/_mathlist3"].stateValues.maths[0]).eq("b");
        expect(stateVariables["/_mathlist3"].stateValues.maths[1]).eq("u");
        expect(stateVariables["/_mathlist3"].stateValues.maths[2]).eq("i");
        expect(stateVariables["/_mathlist3"].stateValues.maths[3]).eq("j");
        expect(stateVariables["/_mathlist4"].stateValues.maths.length).eq(2);
        expect(stateVariables["/_mathlist4"].stateValues.maths[0]).eq("b");
        expect(stateVariables["/_mathlist4"].stateValues.maths[1]).eq("u");
        expect(stateVariables["/_mathlist5"].stateValues.maths.length).eq(2);
        expect(stateVariables["/_mathlist5"].stateValues.maths[0]).eq("u");
        expect(stateVariables["/_mathlist5"].stateValues.maths[1]).eq("v");
        expect(stateVariables["/_mathlist6"].stateValues.maths.length).eq(3);
        expect(stateVariables["/_mathlist6"].stateValues.maths[0]).eq("i");
        expect(stateVariables["/_mathlist6"].stateValues.maths[1]).eq("j");
        expect(stateVariables["/_mathlist6"].stateValues.maths[2]).eq("k");
      });
    });
  });

  it("copy mathlist and overwrite maximum number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p><mathlist name="ml1">a b c d e</mathlist></p>
      <p>$ml1{maxNumber="3" name="ml2"}</p>
      <p>$ml2{maxNumber="" name="ml3"}</p>

      <p><mathlist name="ml4" maxNumber="3">a b c d e</mathlist></p>
      <p>$ml4{maxNumber="4" name="ml5"}</p>
      <p>$ml5{maxNumber="" name="ml6"}</p>

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/_p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(cesc("#\\/_p1"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("b");
        });
      cy.get(cesc("#\\/_p1"))
        .find(".mjx-mrow")
        .eq(2)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("c");
        });
      cy.get(cesc("#\\/_p1"))
        .find(".mjx-mrow")
        .eq(3)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("d");
        });
      cy.get(cesc("#\\/_p1"))
        .find(".mjx-mrow")
        .eq(4)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("e");
        });
      cy.get(cesc("#\\/_p1")).find(".mjx-mrow").eq(5).should("not.exist");

      cy.get(cesc("#\\/_p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(cesc("#\\/_p2"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("b");
        });
      cy.get(cesc("#\\/_p2"))
        .find(".mjx-mrow")
        .eq(2)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("c");
        });
      cy.get(cesc("#\\/_p2")).find(".mjx-mrow").eq(3).should("not.exist");

      cy.get(cesc("#\\/_p3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(cesc("#\\/_p3"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("b");
        });
      cy.get(cesc("#\\/_p3"))
        .find(".mjx-mrow")
        .eq(2)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("c");
        });
      cy.get(cesc("#\\/_p3"))
        .find(".mjx-mrow")
        .eq(3)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("d");
        });
      cy.get(cesc("#\\/_p3"))
        .find(".mjx-mrow")
        .eq(4)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("e");
        });
      cy.get(cesc("#\\/_p3")).find(".mjx-mrow").eq(5).should("not.exist");

      cy.get(cesc("#\\/_p4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(cesc("#\\/_p4"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("b");
        });
      cy.get(cesc("#\\/_p4"))
        .find(".mjx-mrow")
        .eq(2)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("c");
        });
      cy.get(cesc("#\\/_p4")).find(".mjx-mrow").eq(3).should("not.exist");

      cy.get(cesc("#\\/_p5"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(cesc("#\\/_p5"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("b");
        });
      cy.get(cesc("#\\/_p5"))
        .find(".mjx-mrow")
        .eq(2)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("c");
        });
      cy.get(cesc("#\\/_p5"))
        .find(".mjx-mrow")
        .eq(3)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("d");
        });
      cy.get(cesc("#\\/_p5")).find(".mjx-mrow").eq(4).should("not.exist");

      cy.get(cesc("#\\/_p6"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("a");
        });
      cy.get(cesc("#\\/_p6"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("b");
        });
      cy.get(cesc("#\\/_p6"))
        .find(".mjx-mrow")
        .eq(2)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("c");
        });
      cy.get(cesc("#\\/_p6"))
        .find(".mjx-mrow")
        .eq(3)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("d");
        });
      cy.get(cesc("#\\/_p6"))
        .find(".mjx-mrow")
        .eq(4)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("e");
        });
      cy.get(cesc("#\\/_p6")).find(".mjx-mrow").eq(5).should("not.exist");

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/ml1"].stateValues.maths).eqls([
          "a",
          "b",
          "c",
          "d",
          "e",
        ]);
        expect(stateVariables["/ml2"].stateValues.maths).eqls(["a", "b", "c"]);
        expect(stateVariables["/ml3"].stateValues.maths).eqls([
          "a",
          "b",
          "c",
          "d",
          "e",
        ]);
        expect(stateVariables["/ml4"].stateValues.maths).eqls(["a", "b", "c"]);
        expect(stateVariables["/ml5"].stateValues.maths).eqls([
          "a",
          "b",
          "c",
          "d",
        ]);
        expect(stateVariables["/ml6"].stateValues.maths).eqls([
          "a",
          "b",
          "c",
          "d",
          "e",
        ]);
      });
    });
  });

  it("dynamic maximum number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p><mathlist name="ml1" maxNumber="$mn1" >x y z u v</mathlist></p>
      <p>$ml1{maxNumber="$mn2" name="ml2"}</p>
      <p>Maximum number 1: <mathinput name="mn1" prefill="2" /></p>
      <p>Maximum number 2: <mathinput name="mn2" /></p>

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .should("contain.text", "x");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(1)
      .should("contain.text", "y");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .should("contain.text", "x");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(1)
      .should("contain.text", "y");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(2)
      .should("contain.text", "z");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(3)
      .should("contain.text", "u");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(4)
      .should("contain.text", "v");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(5)
      .should("not.exist");

    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ml1"].stateValues.maths).eqls(["x", "y"]);
      expect(stateVariables["/ml2"].stateValues.maths).eqls([
        "x",
        "y",
        "z",
        "u",
        "v",
      ]);
    });

    cy.log("clear first maxnum");
    cy.get(cesc("#\\/mn1") + " textarea")
      .type("{end}{backspace}", { force: true })
      .blur();

    cy.get(cesc("#\\/_p1")).should("contain.text", "v");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .should("contain.text", "x");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(1)
      .should("contain.text", "y");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(2)
      .should("contain.text", "z");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(3)
      .should("contain.text", "u");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(4)
      .should("contain.text", "v");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(5)
      .should("not.exist");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .should("contain.text", "x");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(1)
      .should("contain.text", "y");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(2)
      .should("contain.text", "z");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(3)
      .should("contain.text", "u");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(4)
      .should("contain.text", "v");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(5)
      .should("not.exist");

    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ml1"].stateValues.maths).eqls([
        "x",
        "y",
        "z",
        "u",
        "v",
      ]);
      expect(stateVariables["/ml2"].stateValues.maths).eqls([
        "x",
        "y",
        "z",
        "u",
        "v",
      ]);
    });

    cy.log("number in second maxnum");
    cy.get(cesc("#\\/mn2") + " textarea").type("3{enter}", { force: true });

    cy.get(cesc("#\\/_p2")).should("not.contain.text", "v");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .should("contain.text", "x");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(1)
      .should("contain.text", "y");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(2)
      .should("contain.text", "z");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(3)
      .should("contain.text", "u");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(4)
      .should("contain.text", "v");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(5)
      .should("not.exist");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .should("contain.text", "x");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(1)
      .should("contain.text", "y");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(2)
      .should("contain.text", "z");

    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ml1"].stateValues.maths).eqls([
        "x",
        "y",
        "z",
        "u",
        "v",
      ]);
      expect(stateVariables["/ml2"].stateValues.maths).eqls(["x", "y", "z"]);
    });

    cy.log("number in first maxnum");
    cy.get(cesc("#\\/mn1") + " textarea").type("4{enter}", { force: true });

    cy.get(cesc("#\\/_p1")).should("not.contain.text", "v");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(4)
      .should("not.exist");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .should("contain.text", "x");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(1)
      .should("contain.text", "y");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(2)
      .should("contain.text", "z");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(3)
      .should("contain.text", "u");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .should("contain.text", "x");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(1)
      .should("contain.text", "y");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(2)
      .should("contain.text", "z");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");

    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ml1"].stateValues.maths).eqls([
        "x",
        "y",
        "z",
        "u",
      ]);
      expect(stateVariables["/ml2"].stateValues.maths).eqls(["x", "y", "z"]);
    });

    cy.log("change number in first maxnum");
    cy.get(cesc("#\\/mn1") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/_p1")).should("not.contain.text", "y");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .should("contain.text", "x");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .should("contain.text", "x");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(1)
      .should("contain.text", "y");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(2)
      .should("contain.text", "z");
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");

    cy.get(cesc("#\\/_p1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/_p2") + " .mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ml1"].stateValues.maths).eqls(["x"]);
      expect(stateVariables["/ml2"].stateValues.maths).eqls(["x", "y", "z"]);
    });
  });

  it("mathlist with merge math lists", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist mergeMathLists="$_booleaninput1">
      <math>a</math>
      <math>b,c,d</math>
      <math>e,f</math>
      <math>g</math>
    </mathlist>
    <p>Merge math lists: <booleaninput /></p>

    <p>Third math: $_mathlist1.math3</p>
    <p>Fifth math: $_mathlist1.math5</p>

    <p>Change values:
      <mathinput name="mi1" bindValueTo="$_mathlist1.math1" />
      <mathinput name="mi2" bindValueTo="$_mathlist1.math2" />
      <mathinput name="mi3" bindValueTo="$_mathlist1.math3" />
      <mathinput name="mi4" bindValueTo="$_mathlist1.math4" />
      <mathinput name="mi5" bindValueTo="$_mathlist1.math5" />
      <mathinput name="mi6" bindValueTo="$_mathlist1.math6" />
      <mathinput name="mi7" bindValueTo="$_mathlist1.math7" />
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b,c,d");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e,f");
      });
    cy.get(cesc("#\\/_math4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e,f");
      });
    cy.get(cesc("#\\/_p3")).find(".mjx-mrow").should("not.exist");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathlist1"].stateValues.maths.length).eq(4);
      expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
      expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eqls([
        "list",
        "b",
        "c",
        "d",
      ]);
      expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eqls([
        "list",
        "e",
        "f",
      ]);
      expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("g");
      expect(stateVariables["/_mathlist1"].stateValues.math3).eqls([
        "list",
        "e",
        "f",
      ]);
      expect(stateVariables["/_mathlist1"].stateValues.math5).eq(undefined);
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}h{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{backspace}i{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi3") + " textarea").type("{end}{backspace}j{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi4") + " textarea").type("{end}{backspace}k{enter}", {
      force: true,
    });

    cy.log("Test value displayed in browser");

    cy.get(cesc("#\\/_math4") + " .mjx-mrow").should("contain.text", "k");

    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b,c,i");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e,j");
      });
    cy.get(cesc("#\\/_math4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e,j");
      });
    cy.get(cesc("#\\/_p3")).find(".mjx-mrow").should("not.exist");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathlist1"].stateValues.maths.length).eq(4);
      expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("h");
      expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eqls([
        "list",
        "b",
        "c",
        "i",
      ]);
      expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eqls([
        "list",
        "e",
        "j",
      ]);
      expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("k");
      expect(stateVariables["/_mathlist1"].stateValues.math3).eqls([
        "list",
        "e",
        "j",
      ]);
      expect(stateVariables["/_mathlist1"].stateValues.math5).eq(undefined);
    });

    cy.log("merge math lists");
    cy.get(cesc("#\\/_booleaninput1")).click();

    cy.get(cesc("#\\/_p2") + " .mjx-mrow").should("contain.text", "c");

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b,c,i");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e,j");
      });
    cy.get(cesc("#\\/_math4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/_p3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathlist1"].stateValues.maths.length).eq(7);
      expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("h");
      expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq("b");
      expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eq("c");
      expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("i");
      expect(stateVariables["/_mathlist1"].stateValues.maths[4]).eq("e");
      expect(stateVariables["/_mathlist1"].stateValues.maths[5]).eq("j");
      expect(stateVariables["/_mathlist1"].stateValues.maths[6]).eq("k");
      expect(stateVariables["/_mathlist1"].stateValues.math3).eq("c");
      expect(stateVariables["/_mathlist1"].stateValues.math5).eq("e");
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}l{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{backspace}m{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi3") + " textarea").type("{end}{backspace}n{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi4") + " textarea").type("{end}{backspace}o{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi5") + " textarea").type("{end}{backspace}p{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi6") + " textarea").type("{end}{backspace}q{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi7") + " textarea").type("{end}{backspace}r{enter}", {
      force: true,
    });

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_math4") + " .mjx-mrow").should("contain.text", "r");

    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m,n,o");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p,q");
      });
    cy.get(cesc("#\\/_math4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/_p3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathlist1"].stateValues.maths.length).eq(7);
      expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("l");
      expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq("m");
      expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eq("n");
      expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("o");
      expect(stateVariables["/_mathlist1"].stateValues.maths[4]).eq("p");
      expect(stateVariables["/_mathlist1"].stateValues.maths[5]).eq("q");
      expect(stateVariables["/_mathlist1"].stateValues.maths[6]).eq("r");
      expect(stateVariables["/_mathlist1"].stateValues.math3).eq("n");
      expect(stateVariables["/_mathlist1"].stateValues.math5).eq("p");
    });

    cy.log("stop merging again");
    cy.get(cesc("#\\/_booleaninput1")).click();
    cy.get(cesc("#\\/_p2") + " .mjx-mrow").should("contain.text", "p,q");

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/_math2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m,n,o");
      });
    cy.get(cesc("#\\/_math3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p,q");
      });
    cy.get(cesc("#\\/_math4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p,q");
      });
    cy.get(cesc("#\\/_p3")).find(".mjx-mrow").should("not.exist");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathlist1"].stateValues.maths.length).eq(4);
      expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("l");
      expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eqls([
        "list",
        "m",
        "n",
        "o",
      ]);
      expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eqls([
        "list",
        "p",
        "q",
      ]);
      expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("r");
      expect(stateVariables["/_mathlist1"].stateValues.math3).eqls([
        "list",
        "p",
        "q",
      ]);
      expect(stateVariables["/_mathlist1"].stateValues.math5).eq(undefined);
    });
  });

  it("always merge math lists when have one math child", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist>
      <math>a,b,c,d,e</math>
    </mathlist>

    <p>Third math: $_mathlist1.math3</p>
    <p>Fifth math: $_mathlist1.math5</p>

    <p>Change values:
    <mathinput name="mi1" bindValueTo="$_mathlist1.math1" />
    <mathinput name="mi2" bindValueTo="$_mathlist1.math2" />
    <mathinput name="mi3" bindValueTo="$_mathlist1.math3" />
    <mathinput name="mi4" bindValueTo="$_mathlist1.math4" />
    <mathinput name="mi5" bindValueTo="$_mathlist1.math5" />
  </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a,b,c,d,e");
      });
    cy.get(cesc("#\\/_p1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathlist1"].stateValues.maths.length).eq(5);
      expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
      expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq("b");
      expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eq("c");
      expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("d");
      expect(stateVariables["/_mathlist1"].stateValues.maths[4]).eq("e");
      expect(stateVariables["/_mathlist1"].stateValues.math3).eq("c");
      expect(stateVariables["/_mathlist1"].stateValues.math5).eq("e");
    });

    cy.log("change values");
    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}f{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{backspace}g{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi3") + " textarea").type("{end}{backspace}h{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi4") + " textarea").type("{end}{backspace}i{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi5") + " textarea").type("{end}{backspace}j{enter}", {
      force: true,
    });

    cy.log("Test value displayed in browser");

    cy.get(cesc("#\\/_p2") + " .mjx-mrow").should("contain.text", "j");
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f,g,h,i,j");
      });
    cy.get(cesc("#\\/_p1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathlist1"].stateValues.maths.length).eq(5);
      expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("f");
      expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq("g");
      expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eq("h");
      expect(stateVariables["/_mathlist1"].stateValues.maths[3]).eq("i");
      expect(stateVariables["/_mathlist1"].stateValues.maths[4]).eq("j");
      expect(stateVariables["/_mathlist1"].stateValues.math3).eq("h");
      expect(stateVariables["/_mathlist1"].stateValues.math5).eq("j");
    });
  });

  it("maxNumber with when have one math child", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <mathlist maxNumber="3" name="ml">
      <math name="m">a,b,c,d,e</math>
    </mathlist>

    <p>All maths from list: <aslist>$ml.maths</aslist></p>

    <p>Copied math: $m</p>

    <p>Copied mathlist: $ml</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "a,b,c");

    cy.get(cesc2("#/m") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "a,b,c");

    cy.get(cesc2("#/_p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "a");
    cy.get(cesc2("#/_p1") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "b");
    cy.get(cesc2("#/_p1") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "c");
    cy.get(cesc2("#/_p1") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");

    cy.get(cesc2("#/_p2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "a,b,c,d,e");

    cy.get(cesc2("#/_p3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "a,b,c");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ml"].stateValues.maths).eqls(["a", "b", "c"]);
    });
  });

  it("maxNumber with merge math lists", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

    <mathlist mergeMathLists="$mml" maxNumber="$maxnum" name="ml">
      <math>1</math>
      <mathlist mergeMathLists><math>2, 3</math><math>4</math><mathlist>5 6</mathlist></mathlist>
      <math>7,8,9</math>
      <mathlist>10 11</mathlist>
      <math>12, 13, 14, 15</math>
      <mathlist>16 17 18 19 20</mathlist>
    </mathlist>
    <p>Merge math lists: <booleaninput name="mml" /></p>
    <p>Maximum number: <mathinput name="maxnum" prefill="3" /></p>

    <p name="pmaths">All maths from list: <aslist>$ml.maths</aslist></p>

    <p name="pcopy">Copied mathlist: $ml</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");

    for (let i = 0; i < 3; i++) {
      cy.get(cesc2("#/pmaths") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
    }
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");

    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");

    cy.get(cesc2("#/maxnum") + " textarea").type("{end}{backspace}6{enter}", {
      force: true,
    });

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "4");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "5");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "6");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(5)
      .should("not.exist");

    for (let i = 0; i < 6; i++) {
      cy.get(cesc2("#/pmaths") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
    }
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");

    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "4");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "5");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "6");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(5)
      .should("not.exist");

    cy.get(cesc2("#/maxnum") + " textarea").type("{end}{backspace}7{enter}", {
      force: true,
    });

    cy.get(cesc2("#/ml") + " .mjx-mrow").should("contain.text", "7,8,9");

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "4");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "5");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "6");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(5)
      .should("have.text", "7,8,9");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");

    for (let i = 0; i < 6; i++) {
      cy.get(cesc2("#/pmaths") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
    }
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "7,8,9");
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(7)
      .should("not.exist");

    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "4");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "5");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "6");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(5)
      .should("have.text", "7,8,9");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");

    cy.get(cesc2("#/mml")).click();

    cy.get(cesc2("#/ml") + " .mjx-mrow").should("not.contain.text", "9");

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "4");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "5");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "6");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(5)
      .should("have.text", "7");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");

    for (let i = 0; i < 7; i++) {
      cy.get(cesc2("#/pmaths") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
    }
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(7)
      .should("not.exist");

    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "4");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "5");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "6");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(5)
      .should("have.text", "7");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(6)
      .should("not.exist");

    cy.get(cesc2("#/maxnum") + " textarea").type("{end}{backspace}13{enter}", {
      force: true,
    });

    cy.get(cesc2("#/ml") + " .mjx-mrow").should("contain.text", "13");

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "4");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "5");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "6");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(5)
      .should("have.text", "7,8,9");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "10");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(7)
      .should("have.text", "11");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(8)
      .should("have.text", "12,13");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(9)
      .should("not.exist");

    for (let i = 0; i < 13; i++) {
      cy.get(cesc2("#/pmaths") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
    }
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(13)
      .should("not.exist");

    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "4");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "5");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "6");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(5)
      .should("have.text", "7,8,9");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "10");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(7)
      .should("have.text", "11");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(8)
      .should("have.text", "12,13");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(9)
      .should("not.exist");

    cy.get(cesc2("#/mml")).click();

    cy.get(cesc2("#/ml") + " .mjx-mrow").should("contain.text", "18");

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "4");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "5");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "6");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(5)
      .should("have.text", "7,8,9");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "10");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(7)
      .should("have.text", "11");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(8)
      .should("have.text", "12,13,14,15");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(9)
      .should("have.text", "16");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(10)
      .should("have.text", "17");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(11)
      .should("have.text", "18");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(12)
      .should("not.exist");

    for (let i = 0; i < 6; i++) {
      cy.get(cesc2("#/pmaths") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
    }
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "7,8,9");
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(7)
      .should("have.text", "10");
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(8)
      .should("have.text", "11");
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(9)
      .should("have.text", "12,13,14,15");
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(10)
      .should("have.text", "16");
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(11)
      .should("have.text", "17");
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(12)
      .should("have.text", "18");
    cy.get(cesc2("#/pmaths") + " .mjx-mrow")
      .eq(13)
      .should("not.exist");

    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2,3");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "4");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "5");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "6");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(5)
      .should("have.text", "7,8,9");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "10");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(7)
      .should("have.text", "11");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(8)
      .should("have.text", "12,13,14,15");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(9)
      .should("have.text", "16");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(10)
      .should("have.text", "17");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(11)
      .should("have.text", "18");
    cy.get(cesc2("#/pcopy") + " .mjx-mrow")
      .eq(12)
      .should("not.exist");
  });

  it("maxNumber with mathlist or numberlist child", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

  <mathinput prefill="2" name="maxn" />

  <p><mathlist name="ml" maxNumber="$maxn">1 2 3</mathlist></p>
  <p><mathlist name="mlml" maxNumber="$maxn"><mathlist>1 2 3</mathlist></mathlist></p>
  <p><mathlist name="mlnl"  maxNumber="$maxn"><numberlist>1 2 3</numberlist></mathlist></p>

  <p name="pmathsml"><aslist>$ml.maths</aslist></p>
  <p name="pmathsmlml"><aslist>$mlml.maths</aslist></p>
  <p name="pmathsmlnl"><aslist>$mlnl.maths</aslist></p>

  <p name="pcopyml">$ml</p>
  <p name="pcopymlml">$mlml</p>
  <p name="pcopymlnl">$mlnl</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc2("#/mlml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/mlml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2");
    cy.get(cesc2("#/mlml") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc2("#/mlnl") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1,2");
    cy.get(cesc2("#/mlnl") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");

    for (let i = 0; i < 2; i++) {
      cy.get(cesc2("#/pmathsml") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
      cy.get(cesc2("#/pmathsmlml") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
      cy.get(cesc2("#/pmathsmlnl") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
    }
    cy.get(cesc2("#/pmathsml") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc2("#/pmathsmlml") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc2("#/pmathsmlnl") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");

    cy.get(cesc2("#/pcopyml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopyml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2");
    cy.get(cesc2("#/pcopyml") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc2("#/pcopymlml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopymlml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2");
    cy.get(cesc2("#/pcopymlml") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");
    cy.get(cesc2("#/pcopymlnl") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1,2");
    cy.get(cesc2("#/pcopymlnl") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ml"].stateValues.maths).eqls([1, 2]);
      expect(stateVariables["/ml"].stateValues.latex).eqls("1, 2");
      expect(stateVariables["/ml"].stateValues.text).eqls("1, 2");
      expect(stateVariables["/mlml"].stateValues.maths).eqls([1, 2]);
      expect(stateVariables["/mlml"].stateValues.latex).eqls("1, 2");
      expect(stateVariables["/mlml"].stateValues.text).eqls("1, 2");
      expect(stateVariables["/mlnl"].stateValues.maths).eqls([1, 2]);
      expect(stateVariables["/mlnl"].stateValues.latex).eqls("1, 2");
      expect(stateVariables["/mlnl"].stateValues.text).eqls("1, 2");
    });

    cy.get(cesc2("#/maxn") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc2("#/ml") + " .mjx-mrow").should("contain.text", "3");

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "3");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/mlml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/mlml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2");
    cy.get(cesc2("#/mlml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "3");
    cy.get(cesc2("#/mlml") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/mlnl") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1,2,3");
    cy.get(cesc2("#/mlnl") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");

    for (let i = 0; i < 3; i++) {
      cy.get(cesc2("#/pmathsml") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
      cy.get(cesc2("#/pmathsmlml") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
      cy.get(cesc2("#/pmathsmlnl") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
    }
    cy.get(cesc2("#/pmathsml") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/pmathsmlml") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/pmathsmlnl") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");

    cy.get(cesc2("#/pcopyml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopyml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2");
    cy.get(cesc2("#/pcopyml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "3");
    cy.get(cesc2("#/pcopyml") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/pcopymlml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopymlml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "2");
    cy.get(cesc2("#/pcopymlml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "3");
    cy.get(cesc2("#/pcopymlml") + " .mjx-mrow")
      .eq(3)
      .should("not.exist");
    cy.get(cesc2("#/pcopymlnl") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1,2,3");
    cy.get(cesc2("#/pcopymlnl") + " .mjx-mrow")
      .eq(2)
      .should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ml"].stateValues.maths).eqls([1, 2, 3]);
      expect(stateVariables["/ml"].stateValues.latex).eqls("1, 2, 3");
      expect(stateVariables["/ml"].stateValues.text).eqls("1, 2, 3");
      expect(stateVariables["/mlml"].stateValues.maths).eqls([1, 2, 3]);
      expect(stateVariables["/mlml"].stateValues.latex).eqls("1, 2, 3");
      expect(stateVariables["/mlml"].stateValues.text).eqls("1, 2, 3");
      expect(stateVariables["/mlnl"].stateValues.maths).eqls([1, 2, 3]);
      expect(stateVariables["/mlnl"].stateValues.latex).eqls("1, 2, 3");
      expect(stateVariables["/mlnl"].stateValues.text).eqls("1, 2, 3");
    });

    cy.get(cesc2("#/maxn") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc2("#/ml") + " .mjx-mrow").should("not.contain.text", "2");

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/mlml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/mlml") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/mlnl") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/mlnl") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");

    for (let i = 0; i < 1; i++) {
      cy.get(cesc2("#/pmathsml") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
      cy.get(cesc2("#/pmathsmlml") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
      cy.get(cesc2("#/pmathsmlnl") + " .mjx-mrow")
        .eq(i)
        .should("have.text", `${i + 1}`);
    }
    cy.get(cesc2("#/pmathsml") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/pmathsmlml") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/pmathsmlnl") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");

    cy.get(cesc2("#/pcopyml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopyml") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/pcopymlml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopymlml") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");
    cy.get(cesc2("#/pcopymlnl") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc2("#/pcopymlnl") + " .mjx-mrow")
      .eq(1)
      .should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ml"].stateValues.maths).eqls([1]);
      expect(stateVariables["/ml"].stateValues.latex).eqls("1");
      expect(stateVariables["/ml"].stateValues.text).eqls("1");
      expect(stateVariables["/mlml"].stateValues.maths).eqls([1]);
      expect(stateVariables["/mlml"].stateValues.latex).eqls("1");
      expect(stateVariables["/mlml"].stateValues.text).eqls("1");
      expect(stateVariables["/mlnl"].stateValues.maths).eqls([1]);
      expect(stateVariables["/mlnl"].stateValues.latex).eqls("1");
      expect(stateVariables["/mlnl"].stateValues.text).eqls("1");
    });
  });

  // TODO: deal with hidden children of a mathlist
  it("mathlist within mathlists, with child hide", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><mathlist hide="true">a b c</mathlist></p>

    <p>$_mathlist1{name="mathlist1a" hide="false"}</p>

    <p><mathlist>
      <math>x</math>
      $_mathlist1{hide="false"}
      <math hide>y</math>
      $mathlist1a
    </mathlist></p>

    <p>$_mathlist2{name="mathlist3" maxNumber="6"}</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");

    cy.get(cesc("#\\/_p1")).should("have.text", "");

    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/_p2")).find(".mjx-mrow").eq(3).should("not.exist");

    cy.get(cesc("#\\/_p3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p3"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p3"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/_p3"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/_p3"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p3"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/_p3"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/_p3")).find(".mjx-mrow").eq(7).should("not.exist");

    cy.get(cesc("#\\/_p4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/_p4"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p4"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/_p4"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/_p4"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_p4")).find(".mjx-mrow").eq(5).should("not.exist");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathlist1"].stateValues.maths.length).eq(3);
      expect(stateVariables["/_mathlist1"].stateValues.maths[0]).eq("a");
      expect(stateVariables["/_mathlist1"].stateValues.maths[1]).eq("b");
      expect(stateVariables["/_mathlist1"].stateValues.maths[2]).eq("c");
      expect(stateVariables["/mathlist1a"].stateValues.maths.length).eq(3);
      expect(stateVariables["/mathlist1a"].stateValues.maths[0]).eq("a");
      expect(stateVariables["/mathlist1a"].stateValues.maths[1]).eq("b");
      expect(stateVariables["/mathlist1a"].stateValues.maths[2]).eq("c");
      expect(stateVariables["/_mathlist2"].stateValues.maths.length).eq(8);
      expect(stateVariables["/_mathlist2"].stateValues.maths[0]).eq("x");
      expect(stateVariables["/_mathlist2"].stateValues.maths[1]).eq("a");
      expect(stateVariables["/_mathlist2"].stateValues.maths[2]).eq("b");
      expect(stateVariables["/_mathlist2"].stateValues.maths[3]).eq("c");
      expect(stateVariables["/_mathlist2"].stateValues.maths[4]).eq("y");
      expect(stateVariables["/_mathlist2"].stateValues.maths[5]).eq("a");
      expect(stateVariables["/_mathlist2"].stateValues.maths[6]).eq("b");
      expect(stateVariables["/_mathlist2"].stateValues.maths[7]).eq("c");
      expect(stateVariables["/mathlist3"].stateValues.maths.length).eq(6);
      expect(stateVariables["/mathlist3"].stateValues.maths[0]).eq("x");
      expect(stateVariables["/mathlist3"].stateValues.maths[1]).eq("a");
      expect(stateVariables["/mathlist3"].stateValues.maths[2]).eq("b");
      expect(stateVariables["/mathlist3"].stateValues.maths[3]).eq("c");
      expect(stateVariables["/mathlist3"].stateValues.maths[4]).eq("y");
      expect(stateVariables["/mathlist3"].stateValues.maths[5]).eq("a");
    });
  });

  it("mathlist does not force composite replacement, even in boolean", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <boolean>
      <mathlist>$nothing</mathlist> = <mathlist></mathlist>
    </boolean>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
  });

  it("functionSymbols", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><mathlist name="mldef">f(x) h(x) a(x)</mathlist></p>
    <p><mathlist name="mlh" functionSymbols="h">f(x) h(x) a(x)</mathlist></p>
    <p><mathlist name="mlmixed" functionSymbols="h a">
      <math functionSymbols="g">h(x)</math> <math functionSymbols="g">g(x)</math> a(x)
    </mathlist>
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/mldef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "f(x)");
    cy.get(cesc2("#/mldef") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "hx");
    cy.get(cesc2("#/mldef") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "ax");
    cy.get(cesc2("#/mlh") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "fx");
    cy.get(cesc2("#/mlh") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "h(x)");
    cy.get(cesc2("#/mlh") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "ax");
    cy.get(cesc2("#/mlmixed") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "hx");
    cy.get(cesc2("#/mlmixed") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "g(x)");
    cy.get(cesc2("#/mlmixed") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "a(x)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mldef"].stateValues.maths).eqls([
        ["apply", "f", "x"],
        ["*", "h", "x"],
        ["*", "a", "x"],
      ]);
      expect(stateVariables["/mlh"].stateValues.maths).eqls([
        ["*", "f", "x"],
        ["apply", "h", "x"],
        ["*", "a", "x"],
      ]);
      expect(stateVariables["/mlmixed"].stateValues.maths).eqls([
        ["*", "h", "x"],
        ["apply", "g", "x"],
        ["apply", "a", "x"],
      ]);
    });
  });

  it("sourcesAreFunctionSymbols", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <math name="fun1">f</math>
      <math name="fun2">g</math>
      <math name="fun3">h</math>
      <math name="fun4">a</math>
    </setup>
    <p><mathlist name="mldef">$fun1(x) $fun3(x) $fun4(x)</mathlist></p>
    <p><mathlist name="mlh" sourcesAreFunctionSymbols="fun3">$fun1(x) $fun3(x) $fun4(x)</mathlist></p>
    <p><mathlist name="mlmixed" sourcesAreFunctionSymbols="fun3 fun4">
      <math sourcesAreFunctionSymbols="fun2">$fun3(x)</math> <math sourcesAreFunctionSymbols="fun2">$fun2(x)</math> $fun4(x)
    </mathlist>
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/mldef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "fx");
    cy.get(cesc2("#/mldef") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "hx");
    cy.get(cesc2("#/mldef") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "ax");
    cy.get(cesc2("#/mlh") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "fx");
    cy.get(cesc2("#/mlh") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "h(x)");
    cy.get(cesc2("#/mlh") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "ax");
    cy.get(cesc2("#/mlmixed") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "hx");
    cy.get(cesc2("#/mlmixed") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "g(x)");
    cy.get(cesc2("#/mlmixed") + " .mjx-mrow")
      .eq(3)
      .should("have.text", "a(x)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mldef"].stateValues.maths).eqls([
        ["*", "f", "x"],
        ["*", "h", "x"],
        ["*", "a", "x"],
      ]);
      expect(stateVariables["/mlh"].stateValues.maths).eqls([
        ["*", "f", "x"],
        ["apply", "h", "x"],
        ["*", "a", "x"],
      ]);
      expect(stateVariables["/mlmixed"].stateValues.maths).eqls([
        ["*", "h", "x"],
        ["apply", "g", "x"],
        ["apply", "a", "x"],
      ]);
    });
  });

  it("splitSymbols", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><mathlist name="mldef">xy yz</mathlist></p>
    <p><mathlist name="mln" splitSymbols="false">xy yz</mathlist></p>
    <p><mathlist name="mlmixed" splitSymbols="false">
      xy <math splitSymbols>yz</math> <math>zx</math>
    </mathlist>
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/mldef") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "xy");
    cy.get(cesc2("#/mldef") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "yz");
    cy.get(cesc2("#/mln") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "xy");
    cy.get(cesc2("#/mln") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "yz");
    cy.get(cesc2("#/mlmixed") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "xy");
    cy.get(cesc2("#/mlmixed") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "yz");
    cy.get(cesc2("#/mlmixed") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "zx");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/mldef"].stateValues.maths).eqls([
        ["*", "x", "y"],
        ["*", "y", "z"],
      ]);
      expect(stateVariables["/mln"].stateValues.maths).eqls(["xy", "yz"]);
      expect(stateVariables["/mlmixed"].stateValues.maths).eqls([
        "xy",
        ["*", "y", "z"],
        "zx",
      ]);
    });
  });

  it("mathlist and rounding, from strings", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><mathlist displayDigits="4">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p><mathlist displayDigits="4" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p><mathlist displayDecimals="3">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p><mathlist displayDecimals="3" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p><mathlist displayDecimals="4" displayDigits="3" displaySmallAsZero="false">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>
    <p><mathlist displayDecimals="4" displayDigits="3" displaySmallAsZero="false" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</mathList></p>

    <p><mathlist name="ml1a" copySource="_mathlist1" /></p>
    <p><mathlist name="ml2a" copySource="_mathlist2" /></p>
    <p><mathlist name="ml3a" copySource="_mathlist3" /></p>
    <p><mathlist name="ml4a" copySource="_mathlist4" /></p>
    <p><mathlist name="ml5a" copySource="_mathlist5" /></p>
    <p><mathlist name="ml6a" copySource="_mathlist6" /></p>

    <p name="pms1">$_mathlist1.maths{assignNames="m1_1 m1_2 m1_3 m1_4 m1_5"}</p>
    <p name="pms2">$_mathlist2.maths{assignNames="m2_1 m2_2 m2_3 m2_4 m2_5"}</p>
    <p name="pms3">$_mathlist3.maths{assignNames="m3_1 m3_2 m3_3 m3_4 m3_5"}</p>
    <p name="pms4">$_mathlist4.maths{assignNames="m4_1 m4_2 m4_3 m4_4 m4_5"}</p>
    <p name="pms5">$_mathlist5.maths{assignNames="m5_1 m5_2 m5_3 m5_4 m5_5"}</p>
    <p name="pms6">$_mathlist6.maths{assignNames="m6_1 m6_2 m6_3 m6_4 m6_5"}</p>

    <p><mathlist name="ml1b" copySource="_mathlist1" link="false" /></p>
    <p><mathlist name="ml2b" copySource="_mathlist2" link="false" /></p>
    <p><mathlist name="ml3b" copySource="_mathlist3" link="false" /></p>
    <p><mathlist name="ml4b" copySource="_mathlist4" link="false" /></p>
    <p><mathlist name="ml5b" copySource="_mathlist5" link="false" /></p>
    <p><mathlist name="ml6b" copySource="_mathlist6" link="false" /></p>

    <p name="pms1a">$_mathlist1.maths{assignNames="m1_1a m1_2a m1_3a m1_4a m1_5a" link="false"}</p>
    <p name="pms2a">$_mathlist2.maths{assignNames="m2_1a m2_2a m2_3a m2_4a m2_5a" link="false"}</p>
    <p name="pms3a">$_mathlist3.maths{assignNames="m3_1a m3_2a m3_3a m3_4a m3_5a" link="false"}</p>
    <p name="pms4a">$_mathlist4.maths{assignNames="m4_1a m4_2a m4_3a m4_4a m4_5a" link="false"}</p>
    <p name="pms5a">$_mathlist5.maths{assignNames="m5_1a m5_2a m5_3a m5_4a m5_5a" link="false"}</p>
    <p name="pms6a">$_mathlist6.maths{assignNames="m6_1a m6_2a m6_3a m6_4a m6_5a" link="false"}</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let i = 0; i < 5; i++) {
        let maths1, maths2, maths3, maths4, maths5, maths6;

        if (i === 0) {
          maths1 = stateVariables["/_mathlist1"].activeChildren.map(
            (x) => x.componentName,
          );
          maths2 = stateVariables["/_mathlist2"].activeChildren.map(
            (x) => x.componentName,
          );
          maths3 = stateVariables["/_mathlist3"].activeChildren.map(
            (x) => x.componentName,
          );
          maths4 = stateVariables["/_mathlist4"].activeChildren.map(
            (x) => x.componentName,
          );
          maths5 = stateVariables["/_mathlist5"].activeChildren.map(
            (x) => x.componentName,
          );
          maths6 = stateVariables["/_mathlist6"].activeChildren.map(
            (x) => x.componentName,
          );
        } else if (i === 1) {
          maths1 = stateVariables["/ml1a"].activeChildren.map(
            (x) => x.componentName,
          );
          maths2 = stateVariables["/ml2a"].activeChildren.map(
            (x) => x.componentName,
          );
          maths3 = stateVariables["/ml3a"].activeChildren.map(
            (x) => x.componentName,
          );
          maths4 = stateVariables["/ml4a"].activeChildren.map(
            (x) => x.componentName,
          );
          maths5 = stateVariables["/ml5a"].activeChildren.map(
            (x) => x.componentName,
          );
          maths6 = stateVariables["/ml6a"].activeChildren.map(
            (x) => x.componentName,
          );
        } else if (i === 2) {
          maths1 = stateVariables["/pms1"].activeChildren.map(
            (x) => x.componentName,
          );
          maths2 = stateVariables["/pms2"].activeChildren.map(
            (x) => x.componentName,
          );
          maths3 = stateVariables["/pms3"].activeChildren.map(
            (x) => x.componentName,
          );
          maths4 = stateVariables["/pms4"].activeChildren.map(
            (x) => x.componentName,
          );
          maths5 = stateVariables["/pms5"].activeChildren.map(
            (x) => x.componentName,
          );
          maths6 = stateVariables["/pms6"].activeChildren.map(
            (x) => x.componentName,
          );
        } else if (i === 3) {
          maths1 = stateVariables["/ml1b"].activeChildren.map(
            (x) => x.componentName,
          );
          maths2 = stateVariables["/ml2b"].activeChildren.map(
            (x) => x.componentName,
          );
          maths3 = stateVariables["/ml3b"].activeChildren.map(
            (x) => x.componentName,
          );
          maths4 = stateVariables["/ml4b"].activeChildren.map(
            (x) => x.componentName,
          );
          maths5 = stateVariables["/ml5b"].activeChildren.map(
            (x) => x.componentName,
          );
          maths6 = stateVariables["/ml6b"].activeChildren.map(
            (x) => x.componentName,
          );
        } else {
          maths1 = stateVariables["/pms1a"].activeChildren.map(
            (x) => x.componentName,
          );
          maths2 = stateVariables["/pms2a"].activeChildren.map(
            (x) => x.componentName,
          );
          maths3 = stateVariables["/pms3a"].activeChildren.map(
            (x) => x.componentName,
          );
          maths4 = stateVariables["/pms4a"].activeChildren.map(
            (x) => x.componentName,
          );
          maths5 = stateVariables["/pms5a"].activeChildren.map(
            (x) => x.componentName,
          );
          maths6 = stateVariables["/pms6a"].activeChildren.map(
            (x) => x.componentName,
          );
        }

        cy.get(cesc2("#" + maths1[0]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("2345");
          });
        cy.get(cesc2("#" + maths1[1]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("3.523");
          });
        cy.get(cesc2("#" + maths1[2]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0.5");
          });
        cy.get(cesc2("#" + maths1[3]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("5.252⋅10−13");
          });
        cy.get(cesc2("#" + maths1[4]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0");
          });

        cy.get(cesc2("#" + maths2[0]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("2345");
          });
        cy.get(cesc2("#" + maths2[1]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("3.523");
          });
        cy.get(cesc2("#" + maths2[2]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0.5000");
          });
        cy.get(cesc2("#" + maths2[3]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("5.252⋅10−13");
          });
        cy.get(cesc2("#" + maths2[4]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0.000");
          });

        cy.get(cesc2("#" + maths3[0]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("2345.154");
          });
        cy.get(cesc2("#" + maths3[1]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("3.523");
          });
        cy.get(cesc2("#" + maths3[2]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0.5");
          });
        cy.get(cesc2("#" + maths3[3]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0");
          });
        cy.get(cesc2("#" + maths3[4]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0");
          });

        cy.get(cesc2("#" + maths4[0]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("2345.154");
          });
        cy.get(cesc2("#" + maths4[1]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("3.523");
          });
        cy.get(cesc2("#" + maths4[2]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0.500");
          });
        cy.get(cesc2("#" + maths4[3]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0.000");
          });
        cy.get(cesc2("#" + maths4[4]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0.000");
          });

        cy.get(cesc2("#" + maths5[0]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("2345.1535");
          });
        cy.get(cesc2("#" + maths5[1]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("3.5234");
          });
        cy.get(cesc2("#" + maths5[2]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0.5");
          });
        cy.get(cesc2("#" + maths5[3]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("5.25⋅10−13");
          });
        cy.get(cesc2("#" + maths5[4]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("6⋅10−21");
          });

        cy.get(cesc2("#" + maths6[0]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("2345.1535");
          });
        cy.get(cesc2("#" + maths6[1]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("3.5234");
          });
        cy.get(cesc2("#" + maths6[2]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("0.5000");
          });
        cy.get(cesc2("#" + maths6[3]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("5.25⋅10−13");
          });
        cy.get(cesc2("#" + maths6[4]) + " .mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).eq("6.00⋅10−21");
          });
      }
    });
  });

  it("mathlist and rounding, ignore math children attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><mathlist name="ml1">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml2" displayDigits="4">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml3" displayDigits="4" padZeros>
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml5" displayDecimals="4">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml6" displayDecimals="4" padZeros>
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    <p><mathlist name="ml9" displayDigits="4" displaySmallAsZero="false">
      <math displayDigits="5">2345.1535268</math>
      <math displayDecimals="4">3.52343</math>
      <math displayDigits="5" padZeros>5</math>
      <math displaySmallAsZero="false">0.00000000000000052523</math>
      <math>0.000000000000000000006</math>
    </mathList></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let maths1 = stateVariables["/ml1"].activeChildren.map(
        (x) => x.componentName,
      );
      let maths2 = stateVariables["/ml2"].activeChildren.map(
        (x) => x.componentName,
      );
      let maths3 = stateVariables["/ml3"].activeChildren.map(
        (x) => x.componentName,
      );
      let maths5 = stateVariables["/ml5"].activeChildren.map(
        (x) => x.componentName,
      );
      let maths6 = stateVariables["/ml6"].activeChildren.map(
        (x) => x.componentName,
      );
      let maths9 = stateVariables["/ml9"].activeChildren.map(
        (x) => x.componentName,
      );

      cy.get(cesc2("#" + maths1[0]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("2345.15");
        });
      cy.get(cesc2("#" + maths1[1]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("3.52");
        });
      cy.get(cesc2("#" + maths1[2]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("5");
        });
      cy.get(cesc2("#" + maths1[3]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("0");
        });
      cy.get(cesc2("#" + maths1[4]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("0");
        });

      cy.get(cesc2("#" + maths2[0]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("2345");
        });
      cy.get(cesc2("#" + maths2[1]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("3.523");
        });
      cy.get(cesc2("#" + maths2[2]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("5");
        });
      cy.get(cesc2("#" + maths2[3]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("0");
        });
      cy.get(cesc2("#" + maths2[4]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("0");
        });

      cy.get(cesc2("#" + maths3[0]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("2345");
        });
      cy.get(cesc2("#" + maths3[1]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("3.523");
        });
      cy.get(cesc2("#" + maths3[2]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("5.000");
        });
      cy.get(cesc2("#" + maths3[3]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("0.000");
        });
      cy.get(cesc2("#" + maths3[4]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("0.000");
        });

      cy.get(cesc2("#" + maths5[0]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("2345.1535");
        });
      cy.get(cesc2("#" + maths5[1]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("3.5234");
        });
      cy.get(cesc2("#" + maths5[2]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("5");
        });
      cy.get(cesc2("#" + maths5[3]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("0");
        });
      cy.get(cesc2("#" + maths5[4]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("0");
        });

      cy.get(cesc2("#" + maths6[0]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("2345.1535");
        });
      cy.get(cesc2("#" + maths6[1]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("3.5234");
        });
      cy.get(cesc2("#" + maths6[2]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("5.0000");
        });
      cy.get(cesc2("#" + maths6[3]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("0.0000");
        });
      cy.get(cesc2("#" + maths6[4]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("0.0000");
        });

      cy.get(cesc2("#" + maths9[0]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("2345");
        });
      cy.get(cesc2("#" + maths9[1]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("3.523");
        });
      cy.get(cesc2("#" + maths9[2]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("5");
        });
      cy.get(cesc2("#" + maths9[3]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("5.252⋅10−16");
        });
      cy.get(cesc2("#" + maths9[4]) + " .mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq("6⋅10−21");
        });
    });
  });

  it("mathlist and rounding, ignore number children attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><mathlist name="ml1">
      <number name="n11" displayDigits="5">2345.1535268</number>
      <number name="n12" displayDecimals="4">3.52343</number>
      <number name="n13" displayDigits="5" padZeros>5</number>
      <number name="n14" displaySmallAsZero="false">0.00000000000000052523</number>
      <number name="n15">0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml2" displayDigits="4">
      <number name="n21" displayDigits="5">2345.1535268</number>
      <number name="n22" displayDecimals="4">3.52343</number>
      <number name="n23" displayDigits="5" padZeros>5</number>
      <number name="n24" displaySmallAsZero="false">0.00000000000000052523</number>
      <number name="n25">0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml3" displayDigits="4" padZeros>
      <number name="n31" displayDigits="5">2345.1535268</number>
      <number name="n32" displayDecimals="4">3.52343</number>
      <number name="n33" displayDigits="5" padZeros>5</number>
      <number name="n34" displaySmallAsZero="false">0.00000000000000052523</number>
      <number name="n35">0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml4" displayDigits="4" padZeros="false">
      <number name="n41" displayDigits="5">2345.1535268</number>
      <number name="n42" displayDecimals="4">3.52343</number>
      <number name="n43" displayDigits="5" padZeros>5</number>
      <number name="n44" displaySmallAsZero="false">0.00000000000000052523</number>
      <number name="n45">0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml5" displayDecimals="4">
      <number name="n51" displayDigits="5">2345.1535268</number>
      <number name="n52" displayDecimals="4">3.52343</number>
      <number name="n53" displayDigits="5" padZeros>5</number>
      <number name="n54" displaySmallAsZero="false">0.00000000000000052523</number>
      <number name="n55">0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml6" displayDecimals="4" padZeros>
      <number name="n61" displayDigits="5">2345.1535268</number>
      <number name="n62" displayDecimals="4">3.52343</number>
      <number name="n63" displayDigits="5" padZeros>5</number>
      <number name="n64" displaySmallAsZero="false">0.00000000000000052523</number>
      <number name="n65">0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml7" displayDecimals="4" padZeros="false">
      <number name="n71" displayDigits="5">2345.1535268</number>
      <number name="n72" displayDecimals="4">3.52343</number>
      <number name="n73" displayDigits="5" padZeros>5</number>
      <number name="n74" displaySmallAsZero="false">0.00000000000000052523</number>
      <number name="n75">0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml8" displayDigits="4" displaySmallAsZero>
      <number name="n81" displayDigits="5">2345.1535268</number>
      <number name="n82" displayDecimals="4">3.52343</number>
      <number name="n83" displayDigits="5" padZeros>5</number>
      <number name="n84" displaySmallAsZero="false">0.00000000000000052523</number>
      <number name="n85">0.000000000000000000006</number>
    </mathList></p>
    <p><mathlist name="ml9" displayDigits="4" displaySmallAsZero="false">
      <number name="n91" displayDigits="5">2345.1535268</number>
      <number name="n92" displayDecimals="4">3.52343</number>
      <number name="n93" displayDigits="5" padZeros>5</number>
      <number name="n94" displaySmallAsZero="false">0.00000000000000052523</number>
      <number name="n95">0.000000000000000000006</number>
    </mathList></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/n11") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("2345.15");
      });
    cy.get(cesc2("#/n12") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("3.52");
      });
    cy.get(cesc2("#/n13") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("5");
      });
    cy.get(cesc2("#/n14") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0");
      });
    cy.get(cesc2("#/n15") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0");
      });

    cy.get(cesc2("#/n21") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("2345");
      });
    cy.get(cesc2("#/n22") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("3.523");
      });
    cy.get(cesc2("#/n23") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("5");
      });
    cy.get(cesc2("#/n24") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0");
      });
    cy.get(cesc2("#/n25") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0");
      });

    cy.get(cesc2("#/n31") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("2345");
      });
    cy.get(cesc2("#/n32") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("3.523");
      });
    cy.get(cesc2("#/n33") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("5.000");
      });
    cy.get(cesc2("#/n34") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0.000");
      });
    cy.get(cesc2("#/n35") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0.000");
      });

    cy.get(cesc2("#/n51") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("2345.1535");
      });
    cy.get(cesc2("#/n52") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("3.5234");
      });
    cy.get(cesc2("#/n53") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("5");
      });
    cy.get(cesc2("#/n54") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0");
      });
    cy.get(cesc2("#/n55") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0");
      });

    cy.get(cesc2("#/n61") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("2345.1535");
      });
    cy.get(cesc2("#/n62") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("3.5234");
      });
    cy.get(cesc2("#/n63") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("5.0000");
      });
    cy.get(cesc2("#/n64") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0.0000");
      });
    cy.get(cesc2("#/n65") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0.0000");
      });

    cy.get(cesc2("#/n91") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("2345");
      });
    cy.get(cesc2("#/n92") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("3.523");
      });
    cy.get(cesc2("#/n93") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("5");
      });
    cy.get(cesc2("#/n94") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("5.252⋅10−16");
      });
    cy.get(cesc2("#/n95") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("6⋅10−21");
      });
  });

  it("mathlist and rounding, copy and override", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><mathList name="ml1">34.245023482352345 <math displayDigits="7">245.23823402358234234</math></mathList></p>
    <p><mathList name="ml1Dig6" copySource="ml1" displayDigits="6" /></p>
    <p><mathList name="ml1Dec6" copySource="ml1" displayDecimals="6" /></p>
    <p><mathList name="ml1Dig6a" copySource="ml1Dec6" displayDigits="6" /></p>
    <p><mathList name="ml1Dec6a" copySource="ml1Dig6" displayDecimals="6" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/ml1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "34.25");
    cy.get(cesc("#\\/ml1") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "245.24");

    cy.get(cesc("#\\/ml1Dig6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "34.245");
    cy.get(cesc("#\\/ml1Dig6") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "245.238");
    cy.get(cesc("#\\/ml1Dig6a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "34.245");
    cy.get(cesc("#\\/ml1Dig6a") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "245.238");

    cy.get(cesc("#\\/ml1Dec6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "34.245023");
    cy.get(cesc("#\\/ml1Dec6") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "245.238234");
    cy.get(cesc("#\\/ml1Dec6a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "34.245023");
    cy.get(cesc("#\\/ml1Dec6a") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "245.238234");
  });

  it("mathlist adapts to math and text", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathlist><math>a</math> <math>b</math><math>c</math></mathlist>

    <p>Math list as math: <math>$_mathlist1</math></p>
    <p>Math list as text: <text>$_mathlist1</text></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/_math2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/_math3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
    cy.get(cesc("#\\/_math4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a,b,c");
      });
    cy.get(cesc("#\\/_text2")).should("have.text", "a, b, c");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math4"].stateValues.value).eqls([
        "list",
        "a",
        "b",
        "c",
      ]);
      expect(stateVariables["/_text2"].stateValues.value).eq("a, b, c");
    });
  });

  it("mathlist adapts to numberlist", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <mathlist name="ml"><math>9</math> <math>8</math><math>7</math></mathlist>

    <p><numberlist name="nl">$ml</numberlist></p>
    <p>Change second number: <mathinput name="mi1">$nl.number2</mathinput></p>

    <p>Change 1st and 3rd number via point: <mathinput name="mi2"><point>($nl.number1,$nl.math3)</point></mathinput></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "8");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "7");

    cy.get(cesc2("#/nl")).should("have.text", "9, 8, 7");

    cy.get(cesc2("#/mi1") + " textarea").type("{end}3{enter}", { force: true });

    cy.get(cesc2("#/nl")).should("have.text", "9, 83, 7");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "83");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "7");

    cy.get(cesc2("#/mi2") + " textarea").type(
      "{end}{leftarrow}{backspace}{backspace}{backspace}-1,2{enter}",
      { force: true },
    );

    cy.get(cesc2("#/nl")).should("have.text", "-1, 83, 2");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "−1");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(1)
      .should("have.text", "83");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "2");
  });
});
