import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Conditional Content Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  // tests without cases or else

  it("inline content containing sign of number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="n" />

  <p>You typed 
    <conditionalcontent condition="$n > 0">
      a positive number.
    </conditionalcontent>
    <conditionalcontent condition="$n < 0">
      a negative number.
    </conditionalcontent>
    <conditionalcontent condition="$n=0">
      zero.
    </conditionalcontent>
    <conditionalcontent condition="not ($n>0 or $n<0 or $n=0)" >
      something else.
    </conditionalcontent>
  </p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.get("p" + cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed something else.",
        );
      });

    cy.get(cesc2("#/n") + " textarea").type("10{enter}", { force: true });

    cy.get("p" + cesc2("#/_p1")).should("contain.text", "a positive number.");
    cy.get("p" + cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed a positive number.",
        );
      });

    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}-5/9{enter}",
      { force: true },
    );
    cy.get("p" + cesc2("#/_p1")).should("contain.text", "a negative number.");
    cy.get("p" + cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed a negative number.",
        );
      });

    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}5-5{enter}",
      { force: true },
    );
    cy.get("p" + cesc2("#/_p1")).should("contain.text", "zero.");
    cy.get("p" + cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal("You typed zero.");
      });

    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}-x{enter}",
      { force: true },
    );
    cy.get("p" + cesc2("#/_p1")).should("contain.text", "something else.");
    cy.get("p" + cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed something else.",
        );
      });
  });

  it("inline content containing sign of number, use XML entities", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="n" />

  <p>You typed 
    <conditionalcontent condition="$n &gt; 0">
      a positive number.
    </conditionalcontent>
    <conditionalcontent condition="$n &lt; 0">
      a negative number.
    </conditionalcontent>
    <conditionalcontent condition="$n=0">
      zero.
    </conditionalcontent>
    <conditionalcontent condition="not ($n&gt;0 or $n&lt;0 or $n=0)" >
      something else.
    </conditionalcontent>
  </p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.get("p" + cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed something else.",
        );
      });

    cy.get(cesc2("#/n") + " textarea").type("10{enter}", { force: true });
    cy.get("p" + cesc2("#/_p1")).should("contain.text", "a positive number.");
    cy.get("p" + cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed a positive number.",
        );
      });

    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}-5/9{enter}",
      { force: true },
    );
    cy.get("p" + cesc2("#/_p1")).should("contain.text", "a negative number.");
    cy.get("p" + cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed a negative number.",
        );
      });

    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}5-5{enter}",
      { force: true },
    );
    cy.get("p" + cesc2("#/_p1")).should("contain.text", "zero.");
    cy.get("p" + cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal("You typed zero.");
      });

    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}-x{enter}",
      { force: true },
    );
    cy.get("p" + cesc2("#/_p1")).should("contain.text", "something else.");
    cy.get("p" + cesc2("#/_p1"))
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed something else.",
        );
      });
  });

  it("block content containing sign of number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="n" />

    <section>
    <conditionalcontent condition="$n>0" >
      <p>You typed a positive number.</p>
    </conditionalcontent>
    </section>
    <section>
    <conditionalcontent condition="$n<0" >
      <p>You typed a negative number.</p>
    </conditionalcontent>
    </section>
    <section>
    <conditionalcontent condition="$n=0" >
      <p>You typed zero.</p>
    </conditionalcontent>
    </section>
    <section>
    <conditionalcontent condition="not ($n>0 or $n<0 or $n=0)" >
      <p>You typed something else.</p>
    </conditionalcontent>
    </section>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.get(cesc2("#/_section1") + " p").should("not.exist");
    cy.get(cesc2("#/_section2") + " p").should("not.exist");
    cy.get(cesc2("#/_section3") + " p").should("not.exist");
    cy.get(cesc2("#/_section4") + " p")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed something else.",
        );
      });

    cy.get(cesc2("#/n") + " textarea").type("10{enter}", { force: true });
    cy.get(cesc2("#/_section1") + " p").should(
      "contain.text",
      "a positive number.",
    );
    cy.get(cesc2("#/_section1") + " p")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed a positive number.",
        );
      });
    cy.get(cesc2("#/_section2") + " p").should("not.exist");
    cy.get(cesc2("#/_section3") + " p").should("not.exist");
    cy.get(cesc2("#/_section4") + " p").should("not.exist");

    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}-5/9{enter}",
      { force: true },
    );
    cy.get(cesc2("#/_section2") + " p").should(
      "contain.text",
      "a negative number.",
    );
    cy.get(cesc2("#/_section1") + " p").should("not.exist");
    cy.get(cesc2("#/_section2") + " p")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed a negative number.",
        );
      });
    cy.get(cesc2("#/_section3") + " p").should("not.exist");
    cy.get(cesc2("#/_section4") + " p").should("not.exist");

    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}5-5{enter}",
      { force: true },
    );
    cy.get(cesc2("#/_section3") + " p").should("contain.text", "zero.");
    cy.get(cesc2("#/_section1") + " p").should("not.exist");
    cy.get(cesc2("#/_section2") + " p").should("not.exist");
    cy.get(cesc2("#/_section3") + " p")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal("You typed zero.");
      });
    cy.get(cesc2("#/_section4") + " p").should("not.exist");

    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}-x{enter}",
      { force: true },
    );
    cy.get(cesc2("#/_section4") + " p").should(
      "contain.text",
      "something else.",
    );
    cy.get(cesc2("#/_section1") + " p").should("not.exist");
    cy.get(cesc2("#/_section2") + " p").should("not.exist");
    cy.get(cesc2("#/_section3") + " p").should("not.exist");
    cy.get(cesc2("#/_section4") + " p")
      .invoke("text")
      .then((text) => {
        expect(text.replace(/\s+/g, " ").trim()).equal(
          "You typed something else.",
        );
      });
  });

  it("conditional text used as correct answer", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>Enter a slope: <mathinput name="m" /></p>

  <p>If this is the slope at an equilibrium of a discrete dynamical system, the equilibrium is
  <answer>
    <choiceinput inline="true" shuffleOrder><choice>stable</choice><choice>unstable</choice></choiceinput>
    <award><when>
      <copy prop="selectedvalue" source="_choiceinput1" />
      =
      <text>
        <conditionalcontent condition="abs($m) < 1" >
          stable
        </conditionalcontent>
        <conditionalcontent condition="abs($m) > 1" >
          unstable
        </conditionalcontent>
      </text>
    </when></award>
  </answer>
  </p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.get(cesc2("#/_choiceinput1")).select(`stable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");
    cy.get(cesc2("#/_choiceinput1")).select(`unstable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");

    cy.get(cesc2("#/m") + " textarea").type("3{enter}", { force: true });
    cy.get(cesc2("#/_choiceinput1")).select(`stable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");
    cy.get(cesc2("#/_choiceinput1")).select(`unstable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_correct")).should("be.visible");

    cy.get(cesc2("#/m") + " textarea").type("{end}{backspace}-0.8{enter}", {
      force: true,
    });
    cy.get(cesc2("#/_choiceinput1")).select(`stable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_correct")).should("be.visible");
    cy.get(cesc2("#/_choiceinput1")).select(`unstable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");

    cy.get(cesc2("#/m") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}1/3{enter}",
      { force: true },
    );
    cy.get(cesc2("#/_choiceinput1")).select(`stable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_correct")).should("be.visible");
    cy.get(cesc2("#/_choiceinput1")).select(`unstable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");

    cy.get(cesc2("#/m") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}-7/5{enter}",
      { force: true },
    );
    cy.get(cesc2("#/_choiceinput1")).select(`stable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");
    cy.get(cesc2("#/_choiceinput1")).select(`unstable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_correct")).should("be.visible");

    cy.get(cesc2("#/m") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc2("#/_choiceinput1")).select(`stable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");
    cy.get(cesc2("#/_choiceinput1")).select(`unstable`);
    cy.get(cesc2("#/_choiceinput1_submit")).click();
    cy.get(cesc2("#/_choiceinput1_incorrect")).should("be.visible");
  });

  it("conditional math used as correct answer", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>Require <choiceinput inline="true" name="c" shuffleOrder><choice>positive</choice><choice>negative</choice></choiceinput>.</p>

  <p>Condition on <m>x</m>:
  <answer>
    <mathinput name="x" />
    <award><when>
      <copy prop="immediateValue" source="x" />
      =
      <math>
        <conditionalcontent condition="$c = positive" >
          x > 0
        </conditionalcontent>
        <conditionalcontent condition="$c = negative" >
          x < 0
        </conditionalcontent>
      </math>
    </when></award>
  </answer>
  </p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");
    cy.get(cesc2("#/x_submit")).click();
    cy.get(cesc2("#/x_incorrect")).should("be.visible");

    cy.get(cesc2("#/x") + " textarea").type("x > 0{enter}", { force: true });
    cy.get(cesc2("#/x_incorrect")).should("be.visible");

    cy.get(cesc2("#/x") + " textarea").type(
      "{end}{backspace}{backspace}{backspace}< 0",
      { force: true },
    );
    cy.get(cesc2("#/x_submit")).should("be.visible");
    cy.get(cesc2("#/x") + " textarea").type("{enter}", { force: true });
    cy.get(cesc2("#/x_incorrect")).should("be.visible");

    cy.get(cesc2("#/c")).select(`negative`);
    cy.get(cesc2("#/x_submit")).click();
    cy.get(cesc2("#/x_correct")).should("be.visible");

    cy.get(cesc2("#/x") + " textarea").type(
      "{end}{backspace}{backspace}{backspace}> 0",
      { force: true },
    );
    cy.get(cesc2("#/x_submit")).should("be.visible");
    cy.get(cesc2("#/x") + " textarea").type("{enter}", { force: true });
    cy.get(cesc2("#/x_incorrect")).should("be.visible");

    cy.get(cesc2("#/c")).select(`positive`);
    cy.get(cesc2("#/x_submit")).click();
    cy.get(cesc2("#/x_correct")).should("be.visible");

    cy.get(cesc2("#/x") + " textarea").type(
      "{end}{backspace}{backspace}{backspace}< 0",
      { force: true },
    );
    cy.get(cesc2("#/x_submit")).should("be.visible");
    cy.get(cesc2("#/x") + " textarea").type("{enter}", { force: true });
    cy.get(cesc2("#/x_incorrect")).should("be.visible");
  });

  it("include blank string between tags", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <setup>
    <text name="animal">fox</text><text name="verb">jumps</text>
  </setup>
  <booleaninput name="b" >
    <label>animal phrase</label>
  </booleaninput>

  <p name="p"><conditionalContent condition="$b">The $animal $verb.</conditionalcontent></p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.get(cesc2("#/p")).should("have.text", "");

    cy.get(cesc2("#/b")).click();

    cy.get(cesc2("#/p")).should("have.text", "The fox jumps.");
  });

  it("assignNames gives blanks for strings but strings still displayed", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="p1"><conditionalContent condition="$n > 0" assignNames="a b c">
      <text>dog</text> mouse <text>cat</text>
    </conditionalContent></p>

    <p name="pa">$a</p>
    
    <p name="pb">$b</p>

    <p name="pc">$c</p>

    <p name="p2" ><copy source="_conditionalcontent1" assignNames="d e f" /></p>

    <p name="pd">$d</p>

    <p name="pe">$e</p>

    <p name="pf">$f</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/p1")).should("have.text", "");
    cy.get(cesc2("#/pa")).should("have.text", "");
    cy.get(cesc2("#/pb")).should("have.text", "");
    cy.get(cesc2("#/pc")).should("have.text", "");
    cy.get(cesc2("#/p2")).should("have.text", "");
    cy.get(cesc2("#/pd")).should("have.text", "");
    cy.get(cesc2("#/pe")).should("have.text", "");
    cy.get(cesc2("#/pf")).should("have.text", "");

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc2("#/p1")).should("contain.text", "dog mouse cat");
    cy.get(cesc2("#/pa")).should("have.text", "dog");
    cy.get(cesc2("#/pb")).should("have.text", "");
    cy.get(cesc2("#/pc")).should("have.text", "cat");
    cy.get(cesc2("#/p2")).should("contain.text", "dog mouse cat");
    cy.get(cesc2("#/pd")).should("have.text", "dog");
    cy.get(cesc2("#/pe")).should("have.text", "");
    cy.get(cesc2("#/pf")).should("have.text", "cat");

    cy.log("enter 0");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc2("#/p1")).should("have.text", "");
    cy.get(cesc2("#/pa")).should("have.text", "");
    cy.get(cesc2("#/pb")).should("have.text", "");
    cy.get(cesc2("#/pc")).should("have.text", "");
    cy.get(cesc2("#/p2")).should("have.text", "");
    cy.get(cesc2("#/pd")).should("have.text", "");
    cy.get(cesc2("#/pe")).should("have.text", "");
    cy.get(cesc2("#/pf")).should("have.text", "");
  });

  it("correctly withhold replacements when shadowing", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Hide greeting:
    <booleanInput name="hide" />
    </p>
    
    <p name="p">Greeting is hidden: $hide. Greeting: <conditionalContent condition="not $hide">Hello!</conditionalContent></p>
    
    <p>Show copy:
      <booleanInput name="show_copy" />
    </p>
    <conditionalContent condition="$show_copy" assignNames="p2">
      $p
    </conditionalContent>
    
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/p")).should(
      "have.text",
      "Greeting is hidden: false. Greeting: Hello!",
    );
    cy.get(cesc2("#/p2")).should("not.exist");

    cy.get(cesc2("#/hide")).click();

    cy.get(cesc2("#/p")).should(
      "have.text",
      "Greeting is hidden: true. Greeting: ",
    );
    cy.get(cesc2("#/p2")).should("not.exist");

    cy.get(cesc2("#/show_copy")).click();
    cy.get(cesc2("#/p2")).should(
      "have.text",
      "Greeting is hidden: true. Greeting: ",
    );

    cy.get(cesc2("#/hide")).click();

    cy.get(cesc2("#/p")).should(
      "have.text",
      "Greeting is hidden: false. Greeting: Hello!",
    );
    cy.get(cesc2("#/p2")).should(
      "have.text",
      "Greeting is hidden: false. Greeting: Hello!",
    );
  });

  // tests with cases or else

  it("case/else with single text, assign sub on copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a: <conditionalContent assignNames="a">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>

    <p name="pa1">a1: $a{assignNames="a1"}</p>

    <p name="pb" >b: <copy source="_conditionalcontent1" assignNames="(b)" /></p>

    <p name="pb1">b1: $b{name="b1"}</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/pa")).should("have.text", "a: mouse");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: mouse");
    cy.get(cesc2("#/pb")).should("have.text", "b: mouse");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: mouse");

    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/b")).should("have.text", "mouse");
    cy.get(cesc2("#/b1")).should("have.text", "mouse");

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc2("#/pa")).should("have.text", "a: cat");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: cat");
    cy.get(cesc2("#/pb")).should("have.text", "b: cat");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: cat");

    cy.get(cesc2("#/a1")).should("have.text", "cat");
    cy.get(cesc2("#/b")).should("have.text", "cat");
    cy.get(cesc2("#/b1")).should("have.text", "cat");

    cy.log("enter 10");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}10{enter}",
      { force: true },
    );

    cy.get(cesc2("#/pa")).should("have.text", "a: mouse");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: mouse");
    cy.get(cesc2("#/pb")).should("have.text", "b: mouse");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: mouse");

    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/b")).should("have.text", "mouse");
    cy.get(cesc2("#/b1")).should("have.text", "mouse");

    cy.log("enter -1");
    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}-1{enter}",
      { force: true },
    );

    cy.get(cesc2("#/pa")).should("have.text", "a: dog");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: dog");
    cy.get(cesc2("#/pb")).should("have.text", "b: dog");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: dog");

    cy.get(cesc2("#/a1")).should("have.text", "dog");
    cy.get(cesc2("#/b")).should("have.text", "dog");
    cy.get(cesc2("#/b1")).should("have.text", "dog");

    cy.log("enter x");
    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc2("#/pa")).should("have.text", "a: mouse");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: mouse");
    cy.get(cesc2("#/pb")).should("have.text", "b: mouse");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: mouse");

    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/b")).should("have.text", "mouse");
    cy.get(cesc2("#/b1")).should("have.text", "mouse");
  });

  it("case/else with single text, initially assign sub", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a: <conditionalContent assignNames="(a)">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>

    <p name="pa1">a1: $a{name="a1"}</p>

    <p name="pb" >b: $_conditionalcontent1{assignNames="b"}</p>

    <p name="pb1">b1: $b{assignNames="b1"}</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/pa")).should("have.text", "a: mouse");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: mouse");
    cy.get(cesc2("#/pb")).should("have.text", "b: mouse");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: mouse");

    cy.get(cesc2("#/a")).should("have.text", "mouse");
    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/b1")).should("have.text", "mouse");

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc2("#/pa")).should("have.text", "a: cat");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: cat");
    cy.get(cesc2("#/pb")).should("have.text", "b: cat");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: cat");

    cy.get(cesc2("#/a")).should("have.text", "cat");
    cy.get(cesc2("#/a1")).should("have.text", "cat");
    cy.get(cesc2("#/b1")).should("have.text", "cat");

    cy.log("enter 10");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}10{enter}", {
      force: true,
    });

    cy.get(cesc2("#/pa")).should("have.text", "a: mouse");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: mouse");
    cy.get(cesc2("#/pb")).should("have.text", "b: mouse");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: mouse");

    cy.get(cesc2("#/a")).should("have.text", "mouse");
    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/b1")).should("have.text", "mouse");

    cy.log("enter -11");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}-1{enter}",
      { force: true },
    );

    cy.get(cesc2("#/pa")).should("have.text", "a: dog");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: dog");
    cy.get(cesc2("#/pb")).should("have.text", "b: dog");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: dog");

    cy.get(cesc2("#/a")).should("have.text", "dog");
    cy.get(cesc2("#/a1")).should("have.text", "dog");
    cy.get(cesc2("#/b1")).should("have.text", "dog");

    cy.log("enter x");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc2("#/pa")).should("have.text", "a: mouse");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: mouse");
    cy.get(cesc2("#/pb")).should("have.text", "b: mouse");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: mouse");

    cy.get(cesc2("#/a")).should("have.text", "mouse");
    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/b1")).should("have.text", "mouse");
  });

  it("case/else with text, math, and optional", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p>original: <conditionalContent assignNames="(a b c d)">
      <case condition="$n<0" ><text>dog</text>  <math>x</math>
        <text>optional text!</text>
      </case>
      <case condition="$n <= 1" ><text>cat</text>  <math>y</math>
      </case>
      <else><text>mouse</text>  <math>z</math>
      </else>
    </conditionalContent></p>

    <p>a1: $a{name="a1"}</p>
    <p>b1: $b{name="b1"}</p>
    <p>c1: $c{name="c1"}</p>
    <p>d1: $d{name="d1"}</p>

    <p>copy: <copy name="cnd2" source="_conditionalcontent1" assignNames="(e f g h i)" /></p>

    <p>e1: $e{name="e1"}</p>
    <p>f1: $f{name="f1"}</p>
    <p>g1: $g{name="g1"}</p>
    <p>h1: $h{name="h1"}</p>
    <p>i1: $i{name="i1"}</p>

    <p>copied copy: <copy source="cnd2" assignNames="(j k l)" /></p>

    <p>j1: $j{name="j1"}</p>
    <p>k1: $k{name="k1"}</p>
    <p>l1: $l{name="l1"}</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/a")).should("have.text", "mouse");
    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/e")).should("have.text", "mouse");
    cy.get(cesc2("#/e1")).should("have.text", "mouse");
    cy.get(cesc2("#/j")).should("have.text", "mouse");
    cy.get(cesc2("#/j1")).should("have.text", "mouse");

    cy.get(cesc2("#/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/b1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/f1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/k"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/k1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc2("#/c")).should("not.exist");
    cy.get(cesc2("#/c1")).should("not.exist");
    cy.get(cesc2("#/g")).should("not.exist");
    cy.get(cesc2("#/g1")).should("not.exist");
    cy.get(cesc2("#/l")).should("not.exist");
    cy.get(cesc2("#/l1")).should("not.exist");

    cy.get(cesc2("#/d")).should("not.exist");
    cy.get(cesc2("#/d1")).should("not.exist");
    cy.get(cesc2("#/h")).should("not.exist");
    cy.get(cesc2("#/h1")).should("not.exist");
    cy.get(cesc2("#/i")).should("not.exist");
    cy.get(cesc2("#/i1")).should("not.exist");

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc2("#/a")).should("have.text", "cat");
    cy.get(cesc2("#/a1")).should("have.text", "cat");
    cy.get(cesc2("#/e")).should("have.text", "cat");
    cy.get(cesc2("#/e1")).should("have.text", "cat");
    cy.get(cesc2("#/j")).should("have.text", "cat");
    cy.get(cesc2("#/j1")).should("have.text", "cat");

    cy.get(cesc2("#/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2("#/b1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2("#/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2("#/f1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2("#/k"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2("#/k1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });

    cy.get(cesc2("#/c")).should("not.exist");
    cy.get(cesc2("#/c1")).should("not.exist");
    cy.get(cesc2("#/g")).should("not.exist");
    cy.get(cesc2("#/g1")).should("not.exist");
    cy.get(cesc2("#/l")).should("not.exist");
    cy.get(cesc2("#/l1")).should("not.exist");

    cy.get(cesc2("#/d")).should("not.exist");
    cy.get(cesc2("#/d1")).should("not.exist");
    cy.get(cesc2("#/h")).should("not.exist");
    cy.get(cesc2("#/h1")).should("not.exist");
    cy.get(cesc2("#/i")).should("not.exist");
    cy.get(cesc2("#/i1")).should("not.exist");

    cy.log("enter 10");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}10{enter}", {
      force: true,
    });

    cy.get(cesc2("#/a")).should("have.text", "mouse");
    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/e")).should("have.text", "mouse");
    cy.get(cesc2("#/e1")).should("have.text", "mouse");
    cy.get(cesc2("#/j")).should("have.text", "mouse");
    cy.get(cesc2("#/j1")).should("have.text", "mouse");

    cy.get(cesc2("#/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/b1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/f1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/k"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/k1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc2("#/c")).should("not.exist");
    cy.get(cesc2("#/c1")).should("not.exist");
    cy.get(cesc2("#/g")).should("not.exist");
    cy.get(cesc2("#/g1")).should("not.exist");
    cy.get(cesc2("#/l")).should("not.exist");
    cy.get(cesc2("#/l1")).should("not.exist");

    cy.get(cesc2("#/d")).should("not.exist");
    cy.get(cesc2("#/d1")).should("not.exist");
    cy.get(cesc2("#/h")).should("not.exist");
    cy.get(cesc2("#/h1")).should("not.exist");
    cy.get(cesc2("#/i")).should("not.exist");
    cy.get(cesc2("#/i1")).should("not.exist");

    cy.log("enter -11");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}-1{enter}",
      { force: true },
    );

    cy.get(cesc2("#/a")).should("have.text", "dog");
    cy.get(cesc2("#/a1")).should("have.text", "dog");
    cy.get(cesc2("#/e")).should("have.text", "dog");
    cy.get(cesc2("#/e1")).should("have.text", "dog");
    cy.get(cesc2("#/j")).should("have.text", "dog");
    cy.get(cesc2("#/j1")).should("have.text", "dog");

    cy.get(cesc2("#/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2("#/b1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2("#/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2("#/f1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2("#/k"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2("#/k1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });

    cy.get(cesc2("#/c")).should("have.text", "optional text!");
    cy.get(cesc2("#/c1")).should("have.text", "optional text!");
    cy.get(cesc2("#/g")).should("have.text", "optional text!");
    cy.get(cesc2("#/g1")).should("have.text", "optional text!");
    cy.get(cesc2("#/l")).should("have.text", "optional text!");
    cy.get(cesc2("#/l1")).should("have.text", "optional text!");

    cy.get(cesc2("#/d")).should("not.exist");
    cy.get(cesc2("#/d1")).should("not.exist");
    cy.get(cesc2("#/h")).should("not.exist");
    cy.get(cesc2("#/h1")).should("not.exist");
    cy.get(cesc2("#/i")).should("not.exist");
    cy.get(cesc2("#/i1")).should("not.exist");

    cy.log("enter x");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc2("#/a")).should("have.text", "mouse");
    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/e")).should("have.text", "mouse");
    cy.get(cesc2("#/e1")).should("have.text", "mouse");
    cy.get(cesc2("#/j")).should("have.text", "mouse");
    cy.get(cesc2("#/j1")).should("have.text", "mouse");

    cy.get(cesc2("#/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/b1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/f1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/k"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/k1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc2("#/c")).should("not.exist");
    cy.get(cesc2("#/c1")).should("not.exist");
    cy.get(cesc2("#/g")).should("not.exist");
    cy.get(cesc2("#/g1")).should("not.exist");
    cy.get(cesc2("#/l")).should("not.exist");
    cy.get(cesc2("#/l1")).should("not.exist");

    cy.get(cesc2("#/d")).should("not.exist");
    cy.get(cesc2("#/d1")).should("not.exist");
    cy.get(cesc2("#/h")).should("not.exist");
    cy.get(cesc2("#/h1")).should("not.exist");
    cy.get(cesc2("#/i")).should("not.exist");
    cy.get(cesc2("#/i1")).should("not.exist");
  });

  it("case/else with text, math, and optional, new namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p>original: <conditionalContent assignNames="(a b c d)" name="s1" newnamespace>
      <case condition="$(../n)<0" ><text>dog</text>  <math>x</math>
        <text>optional text!</text>
      </case>
      <case condition="$(../n) <= 1" ><text>cat</text>  <math>y</math>
      </case>
      <else><text>mouse</text>  <math>z</math>
      </else>
    </conditionalContent></p>

    <p>a1: $(s1/a{name="a1"})</p>
    <p>b1: $(s1/b{name="b1"})</p>
    <p>c1: $(s1/c{name="c1"})</p>
    <p>d1: $(s1/d{name="d1"})</p>

    <p>copy: <conditionalContent name="s2" copySource="s1" assignNames="(e f g h i)" /></p>

    <p>e1: $(s2/e{name="e1"})</p>
    <p>f1: $(s2/f{name="f1"})</p>
    <p>g1: $(s2/g{name="g1"})</p>
    <p>h1: $(s2/h{name="h1"})</p>
    <p>i1: $(s2/i{name="i1"})</p>

    <p>copied copy: <conditionalContent name="s3" copysource="s2" assignNames="(j k l)" newNamespace /></p>

    <p>j1: $(s3/j{name="j1"})</p>
    <p>k1: $(s3/k{name="k1"})</p>
    <p>l1: $(s3/l{name="l1"})</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/s1/a")).should("have.text", "mouse");
    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/s2/e")).should("have.text", "mouse");
    cy.get(cesc2("#/e1")).should("have.text", "mouse");
    cy.get(cesc2("#/s3/j")).should("have.text", "mouse");
    cy.get(cesc2("#/j1")).should("have.text", "mouse");

    cy.get(cesc2("#/s1/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/b1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/s2/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/f1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/s3/k"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/k1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc2("#/s1/c")).should("not.exist");
    cy.get(cesc2("#/c1")).should("not.exist");
    cy.get(cesc2("#/s2/g")).should("not.exist");
    cy.get(cesc2("#/g1")).should("not.exist");
    cy.get(cesc2("#/s3/l")).should("not.exist");
    cy.get(cesc2("#/l1")).should("not.exist");

    cy.get(cesc2("#/s1/d")).should("not.exist");
    cy.get(cesc2("#/d1")).should("not.exist");
    cy.get(cesc2("#/s2/h")).should("not.exist");
    cy.get(cesc2("#/h1")).should("not.exist");
    cy.get(cesc2("#/s2/i")).should("not.exist");
    cy.get(cesc2("#/i1")).should("not.exist");

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc2("#/s1/a")).should("have.text", "cat");
    cy.get(cesc2("#/a1")).should("have.text", "cat");
    cy.get(cesc2("#/s2/e")).should("have.text", "cat");
    cy.get(cesc2("#/e1")).should("have.text", "cat");
    cy.get(cesc2("#/s3/j")).should("have.text", "cat");
    cy.get(cesc2("#/j1")).should("have.text", "cat");

    cy.get(cesc2("#/s1/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2("#/b1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2("#/s2/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2("#/f1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2("#/s3/k"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2("#/k1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });

    cy.get(cesc2("#/s1/c")).should("not.exist");
    cy.get(cesc2("#/c1")).should("not.exist");
    cy.get(cesc2("#/s2/g")).should("not.exist");
    cy.get(cesc2("#/g1")).should("not.exist");
    cy.get(cesc2("#/s3/l")).should("not.exist");
    cy.get(cesc2("#/l1")).should("not.exist");

    cy.get(cesc2("#/s1/d")).should("not.exist");
    cy.get(cesc2("#/d1")).should("not.exist");
    cy.get(cesc2("#/s2/h")).should("not.exist");
    cy.get(cesc2("#h1")).should("not.exist");
    cy.get(cesc2("#/s2/i")).should("not.exist");
    cy.get(cesc2("#/i1")).should("not.exist");

    cy.log("enter 10");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}10{enter}",
      { force: true },
    );

    cy.get(cesc2("#/s1/a")).should("have.text", "mouse");
    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/s2/e")).should("have.text", "mouse");
    cy.get(cesc2("#/e1")).should("have.text", "mouse");
    cy.get(cesc2("#/s3/j")).should("have.text", "mouse");
    cy.get(cesc2("#/j1")).should("have.text", "mouse");

    cy.get(cesc2("#/s1/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/b1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/s2/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/f1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/s3/k"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/k1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc2("#/s1/c")).should("not.exist");
    cy.get(cesc2("#/c1")).should("not.exist");
    cy.get(cesc2("#/s2/g")).should("not.exist");
    cy.get(cesc2("#/g1")).should("not.exist");
    cy.get(cesc2("#/s3/l")).should("not.exist");
    cy.get(cesc2("#/l1")).should("not.exist");

    cy.get(cesc2("#/s1/d")).should("not.exist");
    cy.get(cesc2("#/d1")).should("not.exist");
    cy.get(cesc2("#/s2/h")).should("not.exist");
    cy.get(cesc2("#/h1")).should("not.exist");
    cy.get(cesc2("#/s2/i")).should("not.exist");
    cy.get(cesc2("#/i1")).should("not.exist");

    cy.log("enter -1");
    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}-1{enter}",
      { force: true },
    );

    cy.get(cesc2("#/s1/a")).should("have.text", "dog");
    cy.get(cesc2("#/a1")).should("have.text", "dog");
    cy.get(cesc2("#/s2/e")).should("have.text", "dog");
    cy.get(cesc2("#/e1")).should("have.text", "dog");
    cy.get(cesc2("#/s3/j")).should("have.text", "dog");
    cy.get(cesc2("#/j1")).should("have.text", "dog");

    cy.get(cesc2("#/s1/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2("#/b1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2("#/s2/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2("#/f1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2("#/s3/k"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2("#/k1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });

    cy.get(cesc2("#/s1/c")).should("have.text", "optional text!");
    cy.get(cesc2("#/c1")).should("have.text", "optional text!");
    cy.get(cesc2("#/s2/g")).should("have.text", "optional text!");
    cy.get(cesc2("#/g1")).should("have.text", "optional text!");
    cy.get(cesc2("#/s3/l")).should("have.text", "optional text!");
    cy.get(cesc2("#/l1")).should("have.text", "optional text!");

    cy.get(cesc2("#/s1/d")).should("not.exist");
    cy.get(cesc2("#/d1")).should("not.exist");
    cy.get(cesc2("#/s2/h")).should("not.exist");
    cy.get(cesc2("#/h1")).should("not.exist");
    cy.get(cesc2("#/s2/i")).should("not.exist");
    cy.get(cesc2("#/i1")).should("not.exist");

    cy.log("enter x");
    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc2("#/s1/a")).should("have.text", "mouse");
    cy.get(cesc2("#/a1")).should("have.text", "mouse");
    cy.get(cesc2("#/s2/e")).should("have.text", "mouse");
    cy.get(cesc2("#/e1")).should("have.text", "mouse");
    cy.get(cesc2("#/s3/j")).should("have.text", "mouse");
    cy.get(cesc2("#/j1")).should("have.text", "mouse");

    cy.get(cesc2("#/s1/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/b1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/s2/f"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/f1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/s3/k"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2("#/k1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc2("#/s1/c")).should("not.exist");
    cy.get(cesc2("#/c1")).should("not.exist");
    cy.get(cesc2("#/s2/g")).should("not.exist");
    cy.get(cesc2("#/g1")).should("not.exist");
    cy.get(cesc2("#/s3/l")).should("not.exist");
    cy.get(cesc2("#/l1")).should("not.exist");

    cy.get(cesc2("#/s1/d")).should("not.exist");
    cy.get(cesc2("#/d1")).should("not.exist");
    cy.get(cesc2("#/s2/h")).should("not.exist");
    cy.get(cesc2("#/h1")).should("not.exist");
    cy.get(cesc2("#/s2/i")).should("not.exist");
    cy.get(cesc2("#/i1")).should("not.exist");
  });

  it("references to internal and external components", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathinput name="n" />
    <p>original: <conditionalContent assignNames="(a b c)">
      <case condition="$n<0" >
        $x1
        $y1
        <math simplify>3<math name="a1">x</math><math name="b1">a</math> + $a1$b1</math>
      </case>
      <case condition="$n <= 1" >
        $x2
        $y2
        <math simplify>4<math name="a2">y</math><math name="b2">b</math> + $a2$b2</math>
      </case>
      <else>
        $x3
        $y3
        <math simplify>5<math name="a3">z</math><math name="b3">c</math> + $a3$b3</math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    $a{name="aa"}
    $b{name="bb"}
    $c{name="cc"}

    <p>Whole thing repeated</p>
    <conditionalContent copysource="_conditionalcontent1" assignNames="(d e f)" />

    <p>Selected options repeated from copy</p>
    $d{name="dd"}
    $e{name="ee"}
    $f{name="ff"}


    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2(`#/a`)).should("have.text", "mouse");
    cy.get(cesc2(`#/b`)).should("have.text", "bush");
    cy.get(cesc2(`#/c`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/aa`)).should("have.text", "mouse");
    cy.get(cesc2(`#/bb`)).should("have.text", "bush");
    cy.get(cesc2(`#/cc`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/d`)).should("have.text", "mouse");
    cy.get(cesc2(`#/e`)).should("have.text", "bush");
    cy.get(cesc2(`#/f`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/dd`)).should("have.text", "mouse");
    cy.get(cesc2(`#/ee`)).should("have.text", "bush");
    cy.get(cesc2(`#/ff`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc2(`#/a`)).should("have.text", "cat");
    cy.get(cesc2(`#/b`)).should("have.text", "shrub");
    cy.get(cesc2(`#/c`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });
    cy.get(cesc2(`#/aa`)).should("have.text", "cat");
    cy.get(cesc2(`#/bb`)).should("have.text", "shrub");
    cy.get(cesc2(`#/cc`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });

    cy.get(cesc2(`#/d`)).should("have.text", "cat");
    cy.get(cesc2(`#/e`)).should("have.text", "shrub");
    cy.get(cesc2(`#/f`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });
    cy.get(cesc2(`#/dd`)).should("have.text", "cat");
    cy.get(cesc2(`#/ee`)).should("have.text", "shrub");
    cy.get(cesc2(`#/ff`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });

    cy.log("enter -1");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}-1{enter}", {
      force: true,
    });

    cy.get(cesc2(`#/a`)).should("have.text", "dog");
    cy.get(cesc2(`#/b`)).should("have.text", "tree");
    cy.get(cesc2(`#/c`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });
    cy.get(cesc2(`#/aa`)).should("have.text", "dog");
    cy.get(cesc2(`#/bb`)).should("have.text", "tree");
    cy.get(cesc2(`#/cc`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });

    cy.get(cesc2(`#/d`)).should("have.text", "dog");
    cy.get(cesc2(`#/e`)).should("have.text", "tree");
    cy.get(cesc2(`#/f`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });
    cy.get(cesc2(`#/dd`)).should("have.text", "dog");
    cy.get(cesc2(`#/ee`)).should("have.text", "tree");
    cy.get(cesc2(`#/ff`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });

    cy.log("enter 10");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}10{enter}",
      { force: true },
    );

    cy.get(cesc2(`#/a`)).should("have.text", "mouse");
    cy.get(cesc2(`#/b`)).should("have.text", "bush");
    cy.get(cesc2(`#/c`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/aa`)).should("have.text", "mouse");
    cy.get(cesc2(`#/bb`)).should("have.text", "bush");
    cy.get(cesc2(`#/cc`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/d`)).should("have.text", "mouse");
    cy.get(cesc2(`#/e`)).should("have.text", "bush");
    cy.get(cesc2(`#/f`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/dd`)).should("have.text", "mouse");
    cy.get(cesc2(`#/ee`)).should("have.text", "bush");
    cy.get(cesc2(`#/ff`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
  });

  it("references to internal and external components, new namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathinput name="n" />
    <p>original: <conditionalContent assignNames="a">
      <case condition="$n<0" newNamespace >
        $(../x1{name="animal"})
        $(../y1{name="plant"})
        <math simplify name="p">3<math name="x">x</math><math name="a">a</math> + $x$a</math>
      </case>
      <case condition="$n <= 1" newNamespace >
        $(../x2{name="animal"})
        $(../y2{name="plant"})
        <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + $x$a</math>
      </case>
      <else newNamespace>
        $(../x3{name="animal"})
        $(../y3{name="plant"})
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + $x$a</math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    $(a/animal{name="animal"})
    $(a/plant{name="plant"})
    $(a/p{name="p"})
    $(a/x{name="xx"})
    $(a/a{name="aa"})

    <p>Whole thing repeated</p>
    <conditionalContent copysource="_conditionalcontent1" assignNames="b" />

    <p>Selected options repeated from copy</p>
    $(b/animal{name="animalcopy"})
    $(b/plant{name="plantcopy"})
    $(b/p{name="pcopy"})
    $(b/x{name="xxcopy"})
    $(b/a{name="aacopy"})

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2(`#/a/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/a/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    cy.get(cesc2(`#/b/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/b/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "bush");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc2(`#/a/animal`)).should("have.text", "cat");
    cy.get(cesc2(`#/a/plant`)).should("have.text", "shrub");
    cy.get(cesc2(`#/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "cat");
    cy.get(cesc2(`#/plant`)).should("have.text", "shrub");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    cy.get(cesc2(`#/b/animal`)).should("have.text", "cat");
    cy.get(cesc2(`#/b/plant`)).should("have.text", "shrub");
    cy.get(cesc2(`#/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "cat");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "shrub");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    cy.log("enter -1");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}-1{enter}",
      { force: true },
    );

    cy.get(cesc2(`#/a/animal`)).should("have.text", "dog");
    cy.get(cesc2(`#/a/plant`)).should("have.text", "tree");
    cy.get(cesc2(`#/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "dog");
    cy.get(cesc2(`#/plant`)).should("have.text", "tree");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    cy.get(cesc2(`#/b/animal`)).should("have.text", "dog");
    cy.get(cesc2(`#/b/plant`)).should("have.text", "tree");
    cy.get(cesc2(`#/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "dog");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "tree");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    cy.log("enter 10");
    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}10{enter}",
      { force: true },
    );

    cy.get(cesc2(`#/a/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/a/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    cy.get(cesc2(`#/b/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/b/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "bush");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
  });

  it("references to internal and external components, multiple layers of new namespaces", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathinput name="n" />
    <p>original: <conditionalContent name="s" assignNames="a" newNamespace>
      <case newNamespace condition="$(../n) < 0" >
        $(../../x1{name="animal"})
        $(../../y1{name="plant"})
        <math simplify name="p">3<math name="x">x</math><math name="a">a</math> + $x$a</math>
      </case>
      <case newNamespace condition="$(../n) <= 1" >
        $(../../x2{name="animal"})
        $(../../y2{name="plant"})
        <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + $x$a</math>
      </case>
      <else newNamespace>
        $(../../x3{name="animal"})
        $(../../y3{name="plant"})
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + $x$a</math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    $(s/a/animal{name="animal"})
    $(s/a/plant{name="plant"})
    $(s/a/p{name="p"})
    $(s/a/x{name="xx"})
    $(s/a/a{name="aa"})

    <p>Whole thing repeated</p>
    <conditionalContent copysource="s" name="s2" assignNames="b" />

    <p>Selected options repeated from copy</p>
    $(s2/b/animal{name="animalcopy"})
    $(s2/b/plant{name="plantcopy"})
    $(s2/b/p{name="pcopy"})
    $(s2/b/x{name="xxcopy"})
    $(s2/b/a{name="aacopy"})

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2(`#/s/a/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/s/a/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/s/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    cy.get(cesc2(`#/s2/b/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/s2/b/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/s2/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "bush");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc2(`#/s/a/animal`)).should("have.text", "cat");
    cy.get(cesc2(`#/s/a/plant`)).should("have.text", "shrub");
    cy.get(cesc2(`#/s/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "cat");
    cy.get(cesc2(`#/plant`)).should("have.text", "shrub");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    cy.get(cesc2(`#/s2/b/animal`)).should("have.text", "cat");
    cy.get(cesc2(`#/s2/b/plant`)).should("have.text", "shrub");
    cy.get(cesc2(`#/s2/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "cat");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "shrub");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    cy.log("enter -1");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}-1{enter}",
      { force: true },
    );

    cy.get(cesc2(`#/s/a/animal`)).should("have.text", "dog");
    cy.get(cesc2(`#/s/a/plant`)).should("have.text", "tree");
    cy.get(cesc2(`#/s/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "dog");
    cy.get(cesc2(`#/plant`)).should("have.text", "tree");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    cy.get(cesc2(`#/s2/b/animal`)).should("have.text", "dog");
    cy.get(cesc2(`#/s2/b/plant`)).should("have.text", "tree");
    cy.get(cesc2(`#/s2/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "dog");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "tree");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4ax");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });

    cy.log("enter 10");
    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}10{enter}",
      { force: true },
    );

    cy.get(cesc2(`#/s/a/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/s/a/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/s/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    cy.get(cesc2(`#/s2/b/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/s2/b/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/s2/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "bush");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
  });

  it("references to internal and external components, inconsistent new namespaces", () => {
    // not sure why would want to do this, as give inconsistent behavior
    // depending on which option is chosen
    // but, we handle it gracefully
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathinput name="n" />
    <p>original: <conditionalContent assignNames="a">
      <case condition="$n<0" >
        $x1{name="theanimal"}
        $y1{name="theplant"}
        <math simplify name="thep">3<math name="thex">x</math><math name="thea">a</math> + $thex$thea</math>
      </case>
      <case newNamespace condition="$n <= 1" >
        $(../x2{name="animal"})
        $(../y2{name="plant"})
        <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + $x$a</math>
      </case>
      <else newNamespace>
        $(../x3{name="animal"})
        $(../y3{name="plant"})
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + $x$a</math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    $(a/animal{name="animal"})
    $(a/plant{name="plant"})
    $(a/p{name="p"})
    $(a/x{name="xx"})
    $(a/a{name="aa"})

    <p>Whole thing repeated</p>
    <p name="repeat"><conditionalContent name="s2" copysource="_conditionalcontent1" assignNames="b" /></p>

    <p>Selected options repeated from copy</p>
    $(b/animal{name="animalcopy"})
    $(b/plant{name="plantcopy"})
    $(b/p{name="pcopy"})
    $(b/x{name="xxcopy"})
    $(b/a{name="aacopy"})

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2(`#/a/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/a/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    cy.get(cesc2(`#/b/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/b/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "bush");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}1{enter}",
      { force: true },
    );

    cy.get(cesc2(`#/a/animal`)).should("have.text", "cat");
    cy.get(cesc2(`#/a/plant`)).should("have.text", "shrub");
    cy.get(cesc2(`#/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "cat");
    cy.get(cesc2(`#/plant`)).should("have.text", "shrub");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    cy.get(cesc2(`#/b/animal`)).should("have.text", "cat");
    cy.get(cesc2(`#/b/plant`)).should("have.text", "shrub");
    cy.get(cesc2(`#/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "cat");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "shrub");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5by");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });

    cy.log("enter -1");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}-1{enter}",
      { force: true },
    );

    cy.get(cesc2(`#/a/animal`)).should("not.exist");
    cy.get(cesc2(`#/a/plant`)).should("not.exist");
    cy.get(cesc2(`#/a/p`)).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let p1Chidren = stateVariables["/_p1"].activeChildren;
      let theAnimalAnchor = cesc2("#" + p1Chidren[2].componentName);
      let thePlantAnchor = cesc2("#" + p1Chidren[4].componentName);
      let thePAnchor = cesc2("#" + p1Chidren[6].componentName);

      let repeatChildren = stateVariables["/_p1"].activeChildren;
      let theAnimalCopyAnchor = cesc2("#" + repeatChildren[2].componentName);
      let thePlantCopyAnchor = cesc2("#" + repeatChildren[4].componentName);
      let thePCopyAnchor = cesc2("#" + repeatChildren[6].componentName);

      cy.get(cesc2(`#/_p1`))
        .invoke("text")
        .then((text) => {
          let words = text.split(/\s+/).slice(1);
          expect(words[0]).eq("dog");
          expect(words[1]).eq("tree");
        });
      cy.get(cesc2(`#/_p1`))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4ax");
        });

      cy.get(theAnimalAnchor).should("have.text", "dog");
      cy.get(thePlantAnchor).should("have.text", "tree");
      cy.get(thePAnchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4ax");
        });

      cy.get(cesc2(`#/animal`)).should("not.exist");
      cy.get(cesc2(`#/plant`)).should("not.exist");
      cy.get(cesc2(`#/p`)).should("not.exist");
      cy.get(cesc2(`#/xx`)).should("not.exist");
      cy.get(cesc2(`#/aa`)).should("not.exist");

      cy.get(cesc2(`#/b/animal`)).should("not.exist");
      cy.get(cesc2(`#/b/plant`)).should("not.exist");
      cy.get(cesc2(`#/b/p`)).should("not.exist");

      cy.get(cesc2(`#/repeat`))
        .invoke("text")
        .then((text) => {
          let words = text.split(/\s+/).slice(1);
          expect(words[0]).eq("dog");
          expect(words[1]).eq("tree");
        });
      cy.get(cesc2(`#/repeat`))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4ax");
        });

      cy.get(theAnimalCopyAnchor).should("have.text", "dog");
      cy.get(thePlantCopyAnchor).should("have.text", "tree");
      cy.get(thePCopyAnchor)
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4ax");
        });

      cy.get(cesc2(`#/animalcopy`)).should("not.exist");
      cy.get(cesc2(`#/plantcopy`)).should("not.exist");
      cy.get(cesc2(`#/pcopy`)).should("not.exist");
      cy.get(cesc2(`#/xxcopy`)).should("not.exist");
      cy.get(cesc2(`#/aacopy`)).should("not.exist");
    });

    cy.log("enter 10");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}10{enter}",
      { force: true },
    );

    cy.get(cesc2(`#/a/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/a/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/a/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xx`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aa`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });

    cy.get(cesc2(`#/b/animal`)).should("have.text", "mouse");
    cy.get(cesc2(`#/b/plant`)).should("have.text", "bush");
    cy.get(cesc2(`#/b/p`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });

    cy.get(cesc2(`#/animalcopy`)).should("have.text", "mouse");
    cy.get(cesc2(`#/plantcopy`)).should("have.text", "bush");
    cy.get(cesc2(`#/pcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6cz");
      });
    cy.get(cesc2(`#/xxcopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc2(`#/aacopy`))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("c");
      });
  });

  it("dynamic internal references", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="1" />
    <conditionalContent assignNames="a">
      <case condition="$n<0" newNamespace>
        <p>What is your favorite animal? <textinput name="response" /></p>
        <p>I like <copy prop="value" source="response" />, too.</p>
      </case>
      <case condition="$n <= 1" newNamespace >
        <p>What is your name? <textinput name="response" /></p>
        <p>Hello, <copy prop="value" source="response" />!</p>
      </case>
      <else newNamespace>
        <p>Anything else? <textinput name="response" /></p>
        <p>To repeat: <copy prop="value" source="response" />.</p>
      </else>
    </conditionalContent>
    
    <p>The response: <copy source="a/response" prop="value" /></p>
    
    <conditionalContent name="sc2" copysource="_conditionalcontent1" assignNames="b" />
    
    <p>The response one more time: <copy source="b/response" prop="value" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2(`#/a/_p1`)).should("have.text", "What is your name? ");
    cy.get(cesc2(`#/a/_p2`)).should("have.text", "Hello, !");
    cy.get(cesc2(`#/_p1`)).should("have.text", "The response: ");
    cy.get(cesc2(`#/b/_p1`)).should("have.text", "What is your name? ");
    cy.get(cesc2(`#/b/_p2`)).should("have.text", "Hello, !");
    cy.get(cesc2(`#/_p2`)).should("have.text", "The response one more time: ");

    cy.get(cesc2(`#/a/response_input`)).clear().type("Fred{enter}");
    cy.get(cesc2(`#/a/_p2`)).should("have.text", "Hello, Fred!");
    cy.get(cesc2(`#/_p1`)).should("have.text", "The response: Fred");
    cy.get(cesc2(`#/b/_p2`)).should("have.text", "Hello, Fred!");
    cy.get(cesc2(`#/_p2`)).should(
      "have.text",
      "The response one more time: Fred",
    );

    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}-1{enter}", {
      force: true,
    });
    cy.get(cesc2(`#/a/_p1`)).should(
      "have.text",
      "What is your favorite animal? ",
    );
    cy.get(cesc2(`#/a/_p2`)).should("have.text", "I like , too.");
    cy.get(cesc2(`#/_p1`)).should("have.text", "The response: ");
    cy.get(cesc2(`#/b/_p1`)).should(
      "have.text",
      "What is your favorite animal? ",
    );
    cy.get(cesc2(`#/b/_p2`)).should("have.text", "I like , too.");
    cy.get(cesc2(`#/_p2`)).should("have.text", "The response one more time: ");

    cy.get(cesc2(`#/a/response_input`)).clear().type("dogs{enter}");
    cy.get(cesc2(`#/a/_p2`)).should("have.text", "I like dogs, too.");
    cy.get(cesc2(`#/_p1`)).should("have.text", "The response: dogs");
    cy.get(cesc2(`#/b/_p2`)).should("have.text", "I like dogs, too.");
    cy.get(cesc2(`#/_p2`)).should(
      "have.text",
      "The response one more time: dogs",
    );

    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}3{enter}",
      { force: true },
    );
    cy.get(cesc2(`#/a/_p1`)).should("have.text", "Anything else? ");
    cy.get(cesc2(`#/a/_p2`)).should("have.text", "To repeat: .");
    cy.get(cesc2(`#/_p1`)).should("have.text", "The response: ");
    cy.get(cesc2(`#/b/_p1`)).should("have.text", "Anything else? ");
    cy.get(cesc2(`#/b/_p2`)).should("have.text", "To repeat: .");
    cy.get(cesc2(`#/_p2`)).should("have.text", "The response one more time: ");

    cy.get(cesc2(`#/a/response_input`)).clear().type("Goodbye{enter}");
    cy.get(cesc2(`#/a/_p2`)).should("have.text", "To repeat: Goodbye.");
    cy.get(cesc2(`#/_p1`)).should("have.text", "The response: Goodbye");
    cy.get(cesc2(`#/b/_p2`)).should("have.text", "To repeat: Goodbye.");
    cy.get(cesc2(`#/_p2`)).should(
      "have.text",
      "The response one more time: Goodbye",
    );
  });

  it("dynamic internal references, assign pieces", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="1" />
    <conditionalContent assignNames="(a b)">
      <case condition="$n<0" >
        <p newNamespace name="panimal">What is your favorite animal? <textinput name="response" /></p>
        <p newNamespace>I like <copy prop="value" source="../panimal/response" />, too.</p>
      </case>
      <case condition="$n <= 1" >
        <p newNamespace name="pname">What is your name? <textinput name="response" /></p>
        <p newNamespace>Hello, <copy prop="value" source="../pname/response" />!</p>
      </case>
      <else>
        <p newNamespace name="pelse">Anything else? <textinput name="response" /></p>
        <p newNamespace>To repeat: <copy prop="value" source="../pelse/response" />.</p>
      </else>
    </conditionalContent>
    
    <p name="pResponse">The response: <copy source="a/response" prop="value" /></p>
    
    <conditionalContent name="sc2" copysource="_conditionalcontent1" assignNames="(c d)" />
    
    <p name="pResponse2">The response one more time: <copy source="c/response" prop="value" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2(`#/a`)).should("have.text", "What is your name? ");
    cy.get(cesc2(`#/b`)).should("have.text", "Hello, !");
    cy.get(cesc2(`#/pResponse`)).should("have.text", "The response: ");
    cy.get(cesc2(`#/c`)).should("have.text", "What is your name? ");
    cy.get(cesc2(`#/d`)).should("have.text", "Hello, !");
    cy.get(cesc2(`#/pResponse2`)).should(
      "have.text",
      "The response one more time: ",
    );

    cy.get(cesc2(`#/a/response_input`)).clear().type("Fred{enter}");
    cy.get(cesc2(`#/b`)).should("have.text", "Hello, Fred!");
    cy.get(cesc2(`#/pResponse`)).should("have.text", "The response: Fred");
    cy.get(cesc2(`#/d`)).should("have.text", "Hello, Fred!");
    cy.get(cesc2(`#/pResponse2`)).should(
      "have.text",
      "The response one more time: Fred",
    );

    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}-1{enter}", {
      force: true,
    });
    cy.get(cesc2(`#/a`)).should("have.text", "What is your favorite animal? ");
    cy.get(cesc2(`#/b`)).should("have.text", "I like , too.");
    cy.get(cesc2(`#/pResponse`)).should("have.text", "The response: ");
    cy.get(cesc2(`#/c`)).should("have.text", "What is your favorite animal? ");
    cy.get(cesc2(`#/d`)).should("have.text", "I like , too.");
    cy.get(cesc2(`#/pResponse2`)).should(
      "have.text",
      "The response one more time: ",
    );

    cy.get(cesc2(`#/a/response_input`)).clear().type("dogs{enter}");
    cy.get(cesc2(`#/b`)).should("have.text", "I like dogs, too.");
    cy.get(cesc2(`#/pResponse`)).should("have.text", "The response: dogs");
    cy.get(cesc2(`#/d`)).should("have.text", "I like dogs, too.");
    cy.get(cesc2(`#/pResponse2`)).should(
      "have.text",
      "The response one more time: dogs",
    );

    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}3{enter}",
      { force: true },
    );
    cy.get(cesc2(`#/a`)).should("have.text", "Anything else? ");
    cy.get(cesc2(`#/b`)).should("have.text", "To repeat: .");
    cy.get(cesc2(`#/pResponse`)).should("have.text", "The response: ");
    cy.get(cesc2(`#/c`)).should("have.text", "Anything else? ");
    cy.get(cesc2(`#/d`)).should("have.text", "To repeat: .");
    cy.get(cesc2(`#/pResponse2`)).should(
      "have.text",
      "The response one more time: ",
    );

    cy.get(cesc2(`#/a/response_input`)).clear().type("Goodbye{enter}");
    cy.get(cesc2(`#/b`)).should("have.text", "To repeat: Goodbye.");
    cy.get(cesc2(`#/pResponse`)).should("have.text", "The response: Goodbye");
    cy.get(cesc2(`#/d`)).should("have.text", "To repeat: Goodbye.");
    cy.get(cesc2(`#/pResponse2`)).should(
      "have.text",
      "The response one more time: Goodbye",
    );
  });

  it("copy case", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="n" />

    <p><conditionalContent>
      <case name="positiveCase" condition="$n>0" ><text>positive</text></case>
      <else><text>non-positive</text></else>
    </conditionalContent></p>
    
    <p><conditionalContent>
      <copy source="positiveCase" createComponentOfType="case" />
      <case condition="$n<0" ><text>negative</text></case>
      <else><text>neither</text></else>
    </conditionalContent></p>
    
    
    <p>$_conditionalcontent1</p>

    <p>$_conditionalcontent2</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/_p1")).should("have.text", "non-positive");
    cy.get(cesc2("#/_p3")).should("have.text", "non-positive");
    cy.get(cesc2("#/_p2")).should("have.text", "neither");
    cy.get(cesc2("#/_p4")).should("have.text", "neither");

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc2("#/_p1")).should("have.text", "positive");
    cy.get(cesc2("#/_p3")).should("have.text", "positive");
    cy.get(cesc2("#/_p2")).should("have.text", "positive");
    cy.get(cesc2("#/_p4")).should("have.text", "positive");

    cy.log("enter -1");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}-1{enter}",
      { force: true },
    );

    cy.get(cesc2("#/_p1")).should("have.text", "non-positive");
    cy.get(cesc2("#/_p3")).should("have.text", "non-positive");
    cy.get(cesc2("#/_p2")).should("have.text", "negative");
    cy.get(cesc2("#/_p4")).should("have.text", "negative");

    cy.log("enter 0");
    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}0{enter}",
      { force: true },
    );

    cy.get(cesc2("#/_p1")).should("have.text", "non-positive");
    cy.get(cesc2("#/_p3")).should("have.text", "non-positive");
    cy.get(cesc2("#/_p2")).should("have.text", "neither");
    cy.get(cesc2("#/_p4")).should("have.text", "neither");
  });

  it("copy else", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput name="n" />

    <p><conditionalContent>
      <case condition="$n>0" ><text>hello</text></case>
      <else name="bye"><text>bye</text></else>
    </conditionalContent></p>
    
    <p><conditionalContent>
      <case condition="$n<0" ><text>hello</text></case>
      <case condition="$n>0" ><text>oops</text></case>
      <copy source="bye" createComponentOfType="else" />
    </conditionalContent></p>
    
    <p>$_conditionalcontent1</p>

    <p>$_conditionalcontent2</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/_p1")).should("have.text", "bye");
    cy.get(cesc2("#/_p3")).should("have.text", "bye");
    cy.get(cesc2("#/_p2")).should("have.text", "bye");
    cy.get(cesc2("#/_p4")).should("have.text", "bye");

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc2("#/_p1")).should("have.text", "hello");
    cy.get(cesc2("#/_p3")).should("have.text", "hello");
    cy.get(cesc2("#/_p2")).should("have.text", "oops");
    cy.get(cesc2("#/_p4")).should("have.text", "oops");

    cy.log("enter -1");
    cy.get(cesc2("#/n") + " textarea").type(
      "{end}{backspace}{backspace}-1{enter}",
      { force: true },
    );

    cy.get(cesc2("#/_p1")).should("have.text", "bye");
    cy.get(cesc2("#/_p3")).should("have.text", "bye");
    cy.get(cesc2("#/_p2")).should("have.text", "hello");
    cy.get(cesc2("#/_p4")).should("have.text", "hello");

    cy.log("enter 0");
    cy.get(cesc2("#/n") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}0{enter}",
      { force: true },
    );

    cy.get(cesc2("#/_p1")).should("have.text", "bye");
    cy.get(cesc2("#/_p3")).should("have.text", "bye");
    cy.get(cesc2("#/_p2")).should("have.text", "bye");
    cy.get(cesc2("#/_p4")).should("have.text", "bye");
  });

  it("conditionalcontents hide dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" >
      <label>Hide first conditionalContent</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true" >
      <label>Hide second conditionalContent</label>
    </booleaninput>
    <mathinput name="n" />
    <p name="pa">a: <conditionalContent assignNames="a" hide="$h1">
      <case condition="$n<0"><text>dog</text></case>
      <case condition="$n<=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>
    <p name="pb">b: <conditionalContent assignNames="b" hide="$h2">
      <case condition="$n<0"><text>dog</text></case>
      <case condition="$n<=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>
    <p name="pa1">a1: <copy source="a" assignNames="(a1)" /></p>
    <p name="pb1">b1: <copy source="b" assignNames="(b1)" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc2("#/pa")).should("have.text", "a: mouse");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: mouse");
    cy.get(cesc2("#/pb")).should("have.text", "b: ");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: mouse");

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc2("#/pa")).should("have.text", "a: cat");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: cat");
    cy.get(cesc2("#/pb")).should("have.text", "b: ");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: cat");

    cy.get(cesc2("#/h1")).click();
    cy.get(cesc2("#/h2")).click();

    cy.get(cesc2("#/pa")).should("have.text", "a: ");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: cat");
    cy.get(cesc2("#/pb")).should("have.text", "b: cat");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: cat");

    cy.log("enter -3");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}-3{enter}", {
      force: true,
    });

    cy.get(cesc2("#/pa")).should("have.text", "a: ");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: dog");
    cy.get(cesc2("#/pb")).should("have.text", "b: dog");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: dog");

    cy.get(cesc2("#/h1")).click();
    cy.get(cesc2("#/h2")).click();

    cy.get(cesc2("#/pa")).should("have.text", "a: dog");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: dog");
    cy.get(cesc2("#/pb")).should("have.text", "b: ");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: dog");
  });

  it("string and blank strings in case and else", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <setup>
  <text name="animal1">fox</text><text name="verb1">jumps</text>
  <text name="animal2">elephant</text><text name="verb2">trumpets</text>
  </setup>

  <mathinput name="n" />
  <p name="pa">a: <conditionalContent assignNames="a">
    <case condition="$n > 0">The $animal1 $verb1.</case>
    <else>The $animal2 $verb2.</else>
  </conditionalContent></p>

  <p name="pa1">a1: $a{assignNames="a11 a12 a13 a14"}</p>

  <p name="ppieces" >pieces: <conditionalContent copysource="_conditionalcontent1" assignNames="(b c d e)" /></p>

  <p name="pb1">b1: $b{name="b1"}</p>
  <p name="pc1">c1: $c{name="c1"}</p>
  <p name="pd1">d1: $d{name="d1"}</p>
  <p name="pe1">e1: $e{name="e1"}</p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.get(cesc2("#/pa")).should("have.text", "a: The elephant trumpets.");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: The elephant trumpets.");
    cy.get(cesc2("#/ppieces")).should(
      "have.text",
      "pieces: The elephant trumpets.",
    );
    cy.get(cesc2("#/pb1")).should("have.text", "b1: ");
    cy.get(cesc2("#/pc1")).should("have.text", "c1: elephant");
    cy.get(cesc2("#/pd1")).should("have.text", "d1: trumpets");
    cy.get(cesc2("#/pe1")).should("have.text", "e1: ");

    cy.get(cesc2("#/a11")).should("not.exist");
    cy.get(cesc2("#/a12")).should("have.text", "elephant");
    cy.get(cesc2("#/a13")).should("have.text", "trumpets");
    cy.get(cesc2("#/a14")).should("not.exist");
    cy.get(cesc2("#/b1")).should("not.exist");
    cy.get(cesc2("#/c1")).should("have.text", "elephant");
    cy.get(cesc2("#/d1")).should("have.text", "trumpets");
    cy.get(cesc2("#/e1")).should("not.exist");

    cy.log("enter 1");
    cy.get(cesc2("#/n") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc2("#/pa")).should("have.text", "a: The fox jumps.");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: The fox jumps.");
    cy.get(cesc2("#/ppieces")).should("have.text", "pieces: The fox jumps.");
    cy.get(cesc2("#/pb1")).should("have.text", "b1: ");
    cy.get(cesc2("#/pc1")).should("have.text", "c1: fox");
    cy.get(cesc2("#/pd1")).should("have.text", "d1: jumps");
    cy.get(cesc2("#/pe1")).should("have.text", "e1: ");

    cy.get(cesc2("#/a11")).should("not.exist");
    cy.get(cesc2("#/a12")).should("have.text", "fox");
    cy.get(cesc2("#/a13")).should("have.text", "jumps");
    cy.get(cesc2("#/a14")).should("not.exist");
    cy.get(cesc2("#/b1")).should("not.exist");
    cy.get(cesc2("#/c1")).should("have.text", "fox");
    cy.get(cesc2("#/d1")).should("have.text", "jumps");
    cy.get(cesc2("#/e1")).should("not.exist");

    cy.log("enter 0");
    cy.get(cesc2("#/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc2("#/pa")).should("have.text", "a: The elephant trumpets.");
    cy.get(cesc2("#/pa1")).should("have.text", "a1: The elephant trumpets.");
    cy.get(cesc2("#/ppieces")).should(
      "have.text",
      "pieces: The elephant trumpets.",
    );
    cy.get(cesc2("#/pb1")).should("have.text", "b1: ");
    cy.get(cesc2("#/pc1")).should("have.text", "c1: elephant");
    cy.get(cesc2("#/pd1")).should("have.text", "d1: trumpets");
    cy.get(cesc2("#/pe1")).should("have.text", "e1: ");

    cy.get(cesc2("#/a11")).should("not.exist");
    cy.get(cesc2("#/a12")).should("have.text", "elephant");
    cy.get(cesc2("#/a13")).should("have.text", "trumpets");
    cy.get(cesc2("#/a14")).should("not.exist");
    cy.get(cesc2("#/b1")).should("not.exist");
    cy.get(cesc2("#/c1")).should("have.text", "elephant");
    cy.get(cesc2("#/d1")).should("have.text", "trumpets");
    cy.get(cesc2("#/e1")).should("not.exist");
  });

  it("copy with invalid source gets expanded", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="n" />
  before
  <conditionalContent assignNames='a'>
    <case condition="$n=1" newNamespace>nothing: <copy source="nada" name="nothing" /></case>
  </conditionalContent>
  after
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.get(cesc2("#/n") + " textarea")
      .type("1", { force: true })
      .blur();

    cy.get(cesc2("#/_document1")).should(
      "contain.text",
      "a\n  1\n  before\n  nothing: \n  after\n  ",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      // don't currently have a way to check for isExpanded or replacements
      // expect(stateVariables["/a/nothing"].isExpanded).eq(true)
      // expect(stateVariables["/a/nothing"].replacements).eqls([])
      expect(
        stateVariables["/_document1"].activeChildren.filter(
          (x) => x.componentType === "copy",
        ),
      ).eqls([]);
    });
  });

  it("use original names if no assignNames", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="n" />

  <conditionalContent condition="$n > 0">
    <p>We have a <text name="winner1">first winner</text>!</p>
  </conditionalContent>
  
  <conditionalContent>
    <case condition="$n > 0 && $n<=1">
      <p>Just emphasizing that we have that <text name="winner1b">first winner</text>!</p>
    </case>
    <case condition="$n > 1 && $n <= 2">
      <p>We have a <text name="winner2">second winner</text>!</p>
    </case>
    <case condition="$n > 2">
      <p>We have a <text name="winner3">third winner</text>!</p>
    </case>
    <else>
      <p>We have <text name="winner0">no winner</text>.</p>
    </else>
  </conditionalContent>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a");

    cy.get(cesc2("#/winner1")).should("not.exist");
    cy.get(cesc2("#/_p1")).should("not.exist");
    cy.get(cesc2("#/winner1b")).should("not.exist");
    cy.get(cesc2("#/_p2")).should("not.exist");
    cy.get(cesc2("#/winner2")).should("not.exist");
    cy.get(cesc2("#/_p3")).should("not.exist");
    cy.get(cesc2("#/winner3")).should("not.exist");
    cy.get(cesc2("#/_p4")).should("not.exist");
    cy.get(cesc2("#/winner0")).should("have.text", "no winner");
    cy.get(cesc2("#/_p5")).should("have.text", "We have no winner.");

    cy.get(cesc2("#/n") + " textarea")
      .type("1", { force: true })
      .blur();

    cy.get(cesc2("#/winner1")).should("have.text", "first winner");
    cy.get(cesc2("#/_p1")).should("have.text", "We have a first winner!");
    cy.get(cesc2("#/winner1b")).should("have.text", "first winner");
    cy.get(cesc2("#/_p2")).should(
      "have.text",
      "Just emphasizing that we have that first winner!",
    );
    cy.get(cesc2("#/winner2")).should("not.exist");
    cy.get(cesc2("#/_p3")).should("not.exist");
    cy.get(cesc2("#/winner3")).should("not.exist");
    cy.get(cesc2("#/_p4")).should("not.exist");
    cy.get(cesc2("#/winner0")).should("not.exist");
    cy.get(cesc2("#/_p5")).should("not.exist");

    cy.get(cesc2("#/n") + " textarea")
      .type("{end}{backspace}2", { force: true })
      .blur();

    cy.get(cesc2("#/winner1")).should("have.text", "first winner");
    cy.get(cesc2("#/_p1")).should("have.text", "We have a first winner!");
    cy.get(cesc2("#/winner1b")).should("not.exist");
    cy.get(cesc2("#/_p2")).should("not.exist");
    cy.get(cesc2("#/winner2")).should("have.text", "second winner");
    cy.get(cesc2("#/_p3")).should("have.text", "We have a second winner!");
    cy.get(cesc2("#/winner3")).should("not.exist");
    cy.get(cesc2("#/_p4")).should("not.exist");
    cy.get(cesc2("#/winner0")).should("not.exist");
    cy.get(cesc2("#/_p5")).should("not.exist");

    cy.get(cesc2("#/n") + " textarea")
      .type("{end}{backspace}3", { force: true })
      .blur();

    cy.get(cesc2("#/winner1")).should("have.text", "first winner");
    cy.get(cesc2("#/_p1")).should("have.text", "We have a first winner!");
    cy.get(cesc2("#/winner1b")).should("not.exist");
    cy.get(cesc2("#/_p2")).should("not.exist");
    cy.get(cesc2("#/winner2")).should("not.exist");
    cy.get(cesc2("#/_p3")).should("not.exist");
    cy.get(cesc2("#/winner3")).should("have.text", "third winner");
    cy.get(cesc2("#/_p4")).should("have.text", "We have a third winner!");
    cy.get(cesc2("#/winner0")).should("not.exist");
    cy.get(cesc2("#/_p5")).should("not.exist");

    cy.get(cesc2("#/n") + " textarea")
      .type("{end}{backspace}x", { force: true })
      .blur();

    cy.get(cesc2("#/winner1")).should("not.exist");
    cy.get(cesc2("#/_p1")).should("not.exist");
    cy.get(cesc2("#/winner1b")).should("not.exist");
    cy.get(cesc2("#/_p2")).should("not.exist");
    cy.get(cesc2("#/winner2")).should("not.exist");
    cy.get(cesc2("#/_p3")).should("not.exist");
    cy.get(cesc2("#/winner3")).should("not.exist");
    cy.get(cesc2("#/_p4")).should("not.exist");
    cy.get(cesc2("#/winner0")).should("have.text", "no winner");
    cy.get(cesc2("#/_p5")).should("have.text", "We have no winner.");
  });
});
