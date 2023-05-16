import { cesc } from "../../../../src/_utils/url";

describe("SolveEquations Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it.skip("solve single equation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>variable: <mathinput name="var" prefill="x" /></p>
  <p>equation: <mathinput name="equation" prefill="x^2+1=0" /></p>
  <solveEquations name="solve" variables="$var">$equation</solveEquations>
  <p>Number of solutions: <copy prop="numSolutions" target="solve" assignNames="num" /></p>
  <p name="sols">Solutions: <aslist><copy prop="solutions" target="solve" displayDigits="6" /></aslist></p>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/num")).should("have.text", 2);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−i");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([
        "i",
        ["-", "i"],
      ]);
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{end}{leftArrow}{leftArrow}{backspace}a{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 2);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("√−a");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−√−a");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([
        ["apply", "sqrt", ["-", "a"]],
        ["-", ["apply", "sqrt", ["-", "a"]]],
      ]);
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{backspace}{backspace}-a^2{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 2);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−a");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([
        "a",
        ["-", "a"],
      ]);
    });

    cy.get(cesc("#\\/var") + " textarea").type("{end}{backspace}a{enter}", {
      force: true,
      delay: 5,
    });

    cy.get(cesc("#\\/num")).should("have.text", 2);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−x");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([
        "x",
        ["-", "x"],
      ]);
    });

    cy.get(cesc("#\\/var") + " textarea").type("{end}{backspace}x_1{enter}", {
      force: true,
      delay: 5,
    });

    cy.get(cesc("#\\/num")).should("have.text", 0);

    cy.get(cesc("#\\/sols")).find(".mjx-math").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(0);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([]);
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}x_1{rightArrow}- 0.1exp(x_1{rightArrow})=0{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 2);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0.111833");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3.57715");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        0.111833,
        1e-6,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        3.57715,
        1e-5,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}ab=0{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 0);

    cy.get(cesc("#\\/sols")).find(".mjx-math").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(0);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([]);
    });

    cy.get(cesc("#\\/var") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}b{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 1);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(1);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([0]);
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}sin(10b) = b^3{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 7);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−0.870457");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−0.657084");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−0.311147");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0.311147");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0.657084");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0.870457");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(7);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        -0.870457,
        1e-6,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        -0.657084,
        1e-6,
      );
      expect(stateVariables["/solve"].stateValues.solutions[2]).closeTo(
        -0.311147,
        1e-6,
      );
      expect(stateVariables["/solve"].stateValues.solutions[3]).closeTo(
        0,
        1e-6,
      );
      expect(stateVariables["/solve"].stateValues.solutions[4]).closeTo(
        0.311147,
        1e-6,
      );
      expect(stateVariables["/solve"].stateValues.solutions[5]).closeTo(
        0.657084,
        1e-6,
      );
      expect(stateVariables["/solve"].stateValues.solutions[6]).closeTo(
        0.870457,
        1e-6,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}b^2{rightArrow}+0.1b=0{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 2);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−0.1");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        -0.1,
        1e-6,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        0,
        1e-6,
      );
    });
  });

  it("solve single equation, minvar and maxvar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>variable: <mathinput name="var" prefill="x" /></p>
  <p>minvar: <mathinput name="minvar" prefill="-1" /></p>
  <p>maxvar: <mathinput name="maxvar" prefill="1" /></p>
  <p>equation: <mathinput name="equation" prefill="x^2+1=0" /></p>
  <solveEquations name="solve" variables="$var" minVar="$minvar" maxVar="$maxvar">$equation</solveEquations>
  <p>Number of solutions: <copy prop="numSolutions" target="solve" assignNames="num" /></p>
  <p name="sols">Solutions: <aslist><copy prop="solutions" target="solve" displayDigits="6" /></aslist></p>
  <p>
    <copy prop="value" target="equation" assignNames="equation2" />
    <copy prop="value" target="var" assignNames="var2" />
    <copy prop="value" target="maxvar" assignNames="maxvar2" />
    <copy prop="value" target="minvar" assignNames="minvar2" />
  </p>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/num")).should("have.text", 0);

    cy.get(cesc("#\\/sols")).find(".mjx-math").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(0);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([]);
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{end}{leftArrow}{leftArrow}{backspace}{backspace}-a{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/equation2")).should("contain.text", "a");

    cy.get(cesc("#\\/num")).should("have.text", 0);

    cy.get(cesc("#\\/sols")).find(".mjx-math").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(0);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([]);
    });

    cy.get(cesc("#\\/var") + " textarea").type("{end}{backspace}x_1{enter}", {
      force: true,
      delay: 5,
    });
    cy.get(cesc("#\\/var2")).should("contain.text", "x1");

    cy.get(cesc("#\\/num")).should("have.text", 0);

    cy.get(cesc("#\\/sols")).find(".mjx-math").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(0);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([]);
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}x_1{rightArrow}- 0.1exp(x_1{rightArrow})=0{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 1);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0.111833");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(1);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        0.111833,
        1e-6,
      );
    });

    cy.get(cesc("#\\/maxvar") + " textarea").type(
      "{end}{backspace}100{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 2);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(0.111833, 1e-5);
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(3.57715, 1e-4);
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        0.111833,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        3.57715,
        1e-4,
      );
    });

    cy.get(cesc("#\\/minvar") + " textarea").type(
      "{end}{backspace}{backspace}1{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 1);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(3.57715, 1e-4);
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(1);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        3.57715,
        1e-4,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}ab=0{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/var") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}b{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/var2")).should("contain.text", "b");

    cy.get(cesc("#\\/num")).should("have.text", 0);

    cy.get(cesc("#\\/sols")).find(".mjx-math").should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(0);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([]);
    });

    cy.get(cesc("#\\/minvar") + " textarea").type(
      "{end}{backspace}{backspace}0{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 1);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(1);
      expect(stateVariables["/solve"].stateValues.solutions).eqls([0]);
    });

    cy.get(cesc("#\\/maxvar") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}10{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}sin(10b) = b^3{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/equation2")).should("contain.text", "sin(10b)");

    cy.get(cesc("#\\/num")).should("have.text", 4);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(0.311147, 1e-5);
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(0.657084, 1e-5);
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(0.870457, 1e-5);
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(4);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        0,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        0.311147,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[2]).closeTo(
        0.657084,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[3]).closeTo(
        0.870457,
        1e-5,
      );
    });

    cy.get(cesc("#\\/minvar") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}-10{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 7);

    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(-0.870457, 1e-5);
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(-0.657084, 1e-5);
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/−/, "-"))).closeTo(-0.311147, 1e-5);
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(0.311147, 1e-5);
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(0.657084, 1e-5);
      });
    cy.get(cesc("#\\/sols"))
      .find(".mjx-math")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(Number(text)).closeTo(0.870457, 1e-5);
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(7);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        -0.870457,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        -0.657084,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[2]).closeTo(
        -0.311147,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[3]).closeTo(
        0,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[4]).closeTo(
        0.311147,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[5]).closeTo(
        0.657084,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[6]).closeTo(
        0.870457,
        1e-5,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}sin(pi b) = 0{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/minvar") + " textarea").type("{end}.1{enter}", {
      force: true,
      delay: 5,
    });
    cy.get(cesc("#\\/maxvar") + " textarea").type("{end}.1{enter}", {
      force: true,
      delay: 5,
    });
    cy.get(cesc("#\\/maxvar2")).should("contain.text", ".1");

    cy.get(cesc("#\\/num")).should("have.text", 21);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(21);
      for (let i = 0; i < 21; i++) {
        expect(stateVariables["/solve"].stateValues.solutions[i]).closeTo(
          i - 10,
          1e-3,
        );
      }
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}b^2{rightArrow}-0.001b = 0{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/equation2")).should("contain.text", "0.001b=0");

    cy.get(cesc("#\\/num")).should("have.text", 2);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        0,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        0.001,
        1e-5,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(b+0.03)(b+0.0301) = 0{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/equation2")).should(
      "contain.text",
      "(b+0.03)(b+0.0301)=0",
    );

    cy.get(cesc("#\\/num")).should("have.text", 2);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        -0.0301,
        1e-5,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        -0.03,
        1e-5,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{end}{backspace}-0.1{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/equation2")).should("contain.text", "=−0.1");

    cy.get(cesc("#\\/num")).should("have.text", 0);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(0);
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}43.241(b+4.52352)(b+4.52365)(b-8.58230)(b-8.58263) = 0{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/equation2")).should(
      "contain.text",
      "43.241(b+4.52352)(b+4.52365)",
    );

    cy.get(cesc("#\\/num")).should("have.text", 4);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(4);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        -4.52365,
        1e-4,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        -4.52352,
        1e-4,
      );
      expect(stateVariables["/solve"].stateValues.solutions[2]).closeTo(
        8.5823,
        1e-4,
      );
      expect(stateVariables["/solve"].stateValues.solutions[3]).closeTo(
        8.58263,
        1e-4,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{home}exp({end}{backspace}{backspace}{backspace})=1{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/equation2")).should("contain.text", "=1");

    cy.get(cesc("#\\/num")).should("have.text", 4);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(4);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        -4.52365,
        1e-4,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        -4.52352,
        1e-4,
      );
      expect(stateVariables["/solve"].stateValues.solutions[2]).closeTo(
        8.5823,
        1e-4,
      );
      expect(stateVariables["/solve"].stateValues.solutions[3]).closeTo(
        8.58263,
        1e-4,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}cos(pi b) + 1=0{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 10);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(10);
      for (let i = 0; i < 10; i++) {
        expect(stateVariables["/solve"].stateValues.solutions[i]).closeTo(
          2 * i - 9,
          1e-3,
        );
      }
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}cos(pib) = 1{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 11);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(11);
      for (let i = 0; i < 11; i++) {
        expect(stateVariables["/solve"].stateValues.solutions[i]).closeTo(
          2 * i - 10,
          1e-3,
        );
      }
    });

    cy.get(cesc("#\\/minvar") + " textarea").type(
      "{end}{backspace}{backspace}{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/minvar2")).should("not.contain.text", ".1");

    cy.get(cesc("#\\/num")).should("have.text", 11);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(11);
      for (let i = 0; i < 11; i++) {
        expect(stateVariables["/solve"].stateValues.solutions[i]).closeTo(
          2 * i - 10,
          1e-3,
        );
      }
    });

    cy.get(cesc("#\\/maxvar") + " textarea").type(
      "{end}{backspace}{backspace}{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/maxvar2")).should("not.contain.text", ".1");

    cy.get(cesc("#\\/num")).should("have.text", 11);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(11);
      for (let i = 0; i < 11; i++) {
        expect(stateVariables["/solve"].stateValues.solutions[i]).closeTo(
          2 * i - 10,
          1e-3,
        );
      }
    });

    cy.get(cesc("#\\/minvar") + " textarea").type("{end}.0001{enter}", {
      force: true,
      delay: 5,
    });
    cy.get(cesc("#\\/minvar2")).should("contain.text", ".0001");

    cy.get(cesc("#\\/num")).should("have.text", 11);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(11);
      for (let i = 0; i < 11; i++) {
        expect(stateVariables["/solve"].stateValues.solutions[i]).closeTo(
          2 * i - 10,
          1e-3,
        );
      }
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}sqrtb-pi{rightArrow}=0{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 1);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(1);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        Math.PI,
        1e-3,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}sqrtb^2{rightArrow}-pi^2{rightArrow}{rightArrow}=0{enter}",
      { force: true, delay: 5 },
    );

    cy.get(cesc("#\\/num")).should("have.text", 2);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        -Math.PI,
        1e-3,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        Math.PI,
        1e-3,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}sqrtpi^2{rightArrow}-b^2{rightArrow}{rightArrow}=0{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/equation2")).should("contain.text", "√π2−b2=0");

    cy.get(cesc("#\\/num")).should("have.text", 2);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        -Math.PI,
        1e-3,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        Math.PI,
        1e-3,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}10000000000sqrtpi^2{rightArrow}-b^2{rightArrow}{rightArrow}=0{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/equation2")).should("contain.text", "10000000000√π2−b2=0");

    cy.get(cesc("#\\/num")).should("have.text", 2);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        -Math.PI,
        1e-3,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        Math.PI,
        1e-3,
      );
    });

    cy.get(cesc("#\\/equation") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}0.00000000000000000001sqrtpi^2{rightArrow}-b^2{rightArrow}{rightArrow}=0{enter}",
      { force: true, delay: 5 },
    );
    cy.get(cesc("#\\/equation2")).should("contain.text", "1⋅10−20√π2−b2=0");

    cy.get(cesc("#\\/num")).should("have.text", 2);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solve"].stateValues.numSolutions).eq(2);
      expect(stateVariables["/solve"].stateValues.solutions[0]).closeTo(
        -Math.PI,
        1e-3,
      );
      expect(stateVariables["/solve"].stateValues.solutions[1]).closeTo(
        Math.PI,
        1e-3,
      );
    });
  });
});
